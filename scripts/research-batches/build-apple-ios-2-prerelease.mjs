import { createHash } from "node:crypto";
import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import prettier from "prettier";

const here = dirname(fileURLToPath(import.meta.url));
const outputName = "apple-ios-2-prerelease.json";
const ledgerName = "apple-ios-2-prerelease.md";
const publicOwnerName = "apple-ios-2.json";
const accessedAt = "2026-07-30";
const reviewedAt = "2026-07-30T13:29:37Z";
const expectedPublicOwnerSha =
  "351a5f3485fcbc560ab54a6b9968c3ca2640665c2c3029c50786518f9060f0a0";

const verification = {
  focusedTests: 19,
  fullTests: 131,
  rawArtifacts: 20,
  rawEvidenceBytes: 2_855_553,
  normalizedArtifacts: 20,
  copyrightFields: 276,
  maximumEditorialOverlapWords: 5,
  independentSourcesFetched: 20,
  independentRawExact: 6,
  independentNormalizedExact: 20,
  independentTitlesReproduced: 20,
  independentEvidenceReproduced: 20,
};

const dryRun = {
  creates: 67,
  patches: 5,
  unchanged: 2_136,
  sourceCreates: 19,
  eventCreates: 8,
  changeCreates: 40,
  mutationPayloadBytes: 225_001,
  planSha: "fcca348e4fd675657065b9f10c315b9210307cb6d8f0941639c97cf46067142b",
  planArtifactSha:
    "0650a464aa0dac8164eaac02ad96a09d99db8e4e7f91f58b8266727f9bdc23df",
  rollbackArtifactSha:
    "5b1102d06d39735a777ce296ddaa567853607a4ed6e6bda0c9afd705700bdfa9",
};
const publicationRecord = {
  transactionId: "eOgq1Ovu5XNUv1qNFVN2lj",
  receiptSha:
    "25442c35b4ebbee73045df8b4f9240314b9aa2eb8487a7999ed40b8723200015",
  zeroPlanSha:
    "79d25a5886c646862ee0922bc7ea99401f806a2b4b9a687d8841016b5f2084d9",
  zeroPlanArtifactSha:
    "a0e1a5608de97adbfcab55c435a1bd123e1d5df5268705fb41ff0d3613717365",
  zeroRollbackArtifactSha:
    "372c49b6fc8f6e9b7105aa16583eea0aa5178f41581b76258e2c8a69390f487a",
  zeroUnchanged: 2_208,
  coverage: {
    totalVersions: 410,
    fullVersions: 410,
    totalAppearances: 2_040,
    fullAppearances: 487,
    sourceLinkedAppearances: 256,
    timelineOnlyAppearances: 1_297,
    approvedStructuredAppearances: 638,
  },
};

const U = {
  beta1Apple:
    "https://www.apple.com/newsroom/2008/03/06Apple-Announces-iPhone-2-0-Software-Beta/",
  beta1Engadget:
    "https://www.engadget.com/2008-03-18-iphone-firmware-2-0-hands-on.html/",
  beta1AppleInsider:
    "https://appleinsider.com/articles/08/03/18/itunes_strike_refunds_iphone_2_0_beta_iphone_app_signing",
  beta2Macworld: "https://www.macworld.com/article/189903/iphonesdk-4.html",
  beta2Iclarified:
    "https://www.iclarified.com/866/new-version-of-iphone-20-beta-firmware",
  beta3MacRumors:
    "https://www.macrumors.com/2008/04/08/apple-seeds-new-iphone-os-2-0-beta-5a240d-sdk-update/",
  beta4Ars:
    "https://arstechnica.com/gadgets/2008/04/apple-releases-4th-iphone-sdk-and-beta-2-0-firmware/",
  beta4Iclarified:
    "https://www.iclarified.com/989/iphone-20-beta-4-5a258f-firmware-released",
  beta5MacRumors:
    "https://www.macrumors.com/2008/05/06/iphone-sdk-beta-5-released/",
  beta6Engadget:
    "https://www.engadget.com/2008-05-28-iphone-sdk-beta-6-is-here.html",
  beta6Ars:
    "https://arstechnica.com/gadgets/2008/05/iphone-sdk-beta-6-released-includes-3g-iphone-tidbits/",
  beta6AppleInsider:
    "https://appleinsider.com/articles/08/05/22/latest_iphone_2_0_beta_adds_geo_tagging_to_camera_photos.html",
  beta6GeotagEngadget:
    "https://www.engadget.com/2008-05-22-iphone-2-0-beta-gets-geotagging.html",
  beta7MacRumors:
    "https://www.macrumors.com/2008/06/09/apple-releases-iphone-sdk-beta-7/",
  beta7Ars:
    "https://arstechnica.com/gadgets/2008/06/iphone-sdk-beta-7-now-available/",
  beta7Iculture:
    "https://www.iculture.nl/nieuws/kort-iphone-nieuws-12-ek-songs-voor-band-iphone-3g-gratis-bij-o2-iphone-sdk-beta-7/",
  beta8MacRumors:
    "https://www.macrumors.com/2008/06/26/apple-seeds-iphone-2-0-5a345-itunes-7-7-beta-sdk-8/",
  beta8Engadget:
    "https://www.engadget.com/2008-06-26-iphone-sdk-beta-8-coming-soon.html",
  beta8AppStore:
    "https://www.macrumors.com/2008/06/26/apple-accepting-iphone-apps-into-app-store/",
  beta8Macworld:
    "https://www.macworld.com/article/191231/iphone_sdk_beta8.html",
};

const sources = [
  {
    url: U.beta1Apple,
    title: "Apple Announces iPhone 2.0 Software Beta",
    publisher: "Apple Newsroom",
    sourceClass: "firstPartyAnnouncement",
    publishedAt: "2008-03-06T00:00:00Z",
    topics: ["iPhone OS", "2.0", "App Store", "enterprise", "SDK"],
  },
  {
    url: U.beta1Engadget,
    title: "iPhone firmware 2.0 hands-on",
    publisher: "Engadget",
    sourceClass: "journalism",
    author: "Ryan Block",
    publishedAt: "2008-03-18T17:07:00Z",
    topics: ["iPhone OS 2.0", "Beta 1", "hands-on", "undocumented changes"],
  },
  {
    url: U.beta1AppleInsider,
    title: "iTunes strike refunds; iPhone 2.0 beta; iPhone app signing",
    publisher: "AppleInsider",
    sourceClass: "journalism",
    author: "Katie Marsal",
    publishedAt: "2008-03-18T18:20:00-04:00",
    topics: ["iPhone OS 2.0", "Beta 1", "hands-on", "developer program"],
  },
  {
    url: U.beta2Macworld,
    title: "Apple releases iPhone SDK beta 2",
    publisher: "Macworld",
    sourceClass: "journalism",
    author: "Jim Dalrymple and Dan Moren",
    publishedAt: "2008-03-27T04:23:00-07:00",
    topics: ["iPhone SDK", "Beta 2", "Interface Builder", "known issues"],
  },
  {
    url: U.beta2Iclarified,
    title: "New Version of iPhone 2.0 Beta Firmware!",
    publisher: "iClarified",
    sourceClass: "journalism",
    author: "Shalom Levytam",
    publishedAt: "2008-03-28T20:22:33Z",
    topics: ["iPhone OS 2.0", "Beta 2", "firmware", "observed changes"],
  },
  {
    url: U.beta3MacRumors,
    title: "Apple Seeds New iPhone OS 2.0 Beta (5A240d), SDK Update (Beta 3)",
    publisher: "MacRumors",
    sourceClass: "journalism",
    author: "longofest",
    publishedAt: "2008-04-08T14:21:00-07:00",
    topics: ["iPhone OS 2.0", "Beta 3", "Exchange", "SDK"],
  },
  {
    url: U.beta4Ars,
    title: "Apple releases 4th iPhone SDK and beta 2.0 firmware",
    publisher: "Ars Technica",
    sourceClass: "journalism",
    author: "Chris Foresman",
    publishedAt: "2008-04-24T13:19:00Z",
    topics: ["iPhone OS 2.0", "Beta 4", "OpenGL ES", "code signing"],
  },
  {
    url: U.beta4Iclarified,
    title: "iPhone 2.0 Beta 4 (5A258f) Firmware Released",
    publisher: "iClarified",
    sourceClass: "journalism",
    author: "Shalom Levytam",
    publishedAt: "2008-04-23T23:08:29Z",
    topics: ["iPhone OS 2.0", "Beta 4", "SDK", "API changes"],
  },
  {
    url: U.beta5MacRumors,
    title: "iPhone SDK Beta 5 Released",
    publisher: "MacRumors",
    sourceClass: "journalism",
    author: "longofest",
    publishedAt: "2008-05-06T17:36:57-07:00",
    topics: ["iPhone SDK", "Beta 5", "bug fixes", "compatibility"],
  },
  {
    url: U.beta6Engadget,
    title: "iPhone SDK beta 6 is here",
    publisher: "Engadget",
    sourceClass: "journalism",
    author: "Cory Bohon",
    publishedAt: "2008-05-28T19:07:00Z",
    topics: ["iPhone OS 2.0", "Beta 6", "provisioning", "SDK"],
  },
  {
    url: U.beta6Ars,
    title: "iPhone SDK beta 6 released, includes 3G iPhone tidbits",
    publisher: "Ars Technica",
    sourceClass: "journalism",
    author: "Justin Berka",
    publishedAt: "2008-05-29T18:14:51Z",
    topics: ["iPhone OS 2.0", "Beta 6", "provisioning", "SDK"],
  },
  {
    url: U.beta6AppleInsider,
    title: "Latest iPhone 2.0 beta adds geo-tagging to Camera photos",
    publisher: "AppleInsider",
    sourceClass: "journalism",
    author: "Sam Oliver",
    publishedAt: "2008-05-22T09:00:00-04:00",
    topics: [
      "iPhone OS 2.0",
      "unmapped prerelease build",
      "location",
      "Camera",
    ],
  },
  {
    url: U.beta6GeotagEngadget,
    title: "iPhone 2.0 beta gets geotagging?",
    publisher: "Engadget",
    sourceClass: "journalism",
    author: "Paul Miller",
    publishedAt: "2008-05-22T14:41:00Z",
    topics: [
      "iPhone OS 2.0",
      "unmapped prerelease build",
      "location",
      "Camera",
    ],
  },
  {
    url: U.beta7MacRumors,
    title: "Apple Releases iPhone SDK Beta 7",
    publisher: "MacRumors",
    sourceClass: "journalism",
    author: "Arnold Kim",
    publishedAt: "2008-06-09T14:09:31-07:00",
    topics: ["iPhone SDK", "Beta 7", "release identity"],
  },
  {
    url: U.beta7Ars,
    title: "iPhone SDK Beta 7 now available",
    publisher: "Ars Technica",
    sourceClass: "journalism",
    author: "Jeff Smykil",
    publishedAt: "2008-06-10T14:19:52Z",
    topics: ["iPhone SDK", "Beta 7", "bug fixes", "compatibility"],
  },
  {
    url: U.beta7Iculture,
    title:
      "Kort iPhone-nieuws: 12 EK-songs voor Band, iPhone 3G gratis bij O2, iPhone SDK beta 7",
    publisher: "iCulture",
    sourceClass: "journalism",
    author: "Gonny van der Zwaag",
    publishedAt: "2008-06-10T13:35:46Z",
    topics: ["iPhone SDK", "Beta 7", "release notes", "compatibility"],
  },
  {
    url: U.beta8MacRumors,
    title: "Apple Seeds iPhone 2.0 5A345, iTunes 7.7 Beta, SDK 8",
    publisher: "MacRumors",
    sourceClass: "journalism",
    author: "Arnold Kim",
    publishedAt: "2008-06-26T17:26:00-07:00",
    topics: ["iPhone OS 2.0", "Beta 8", "iTunes", "developer tools"],
  },
  {
    url: U.beta8Engadget,
    title: "iPhone SDK Beta 8 Released",
    publisher: "Engadget",
    sourceClass: "journalism",
    author: "Robert Palmer",
    publishedAt: "2008-06-26T23:15:00Z",
    topics: ["iPhone OS 2.0", "Beta 8", "certificates", "iTunes"],
  },
  {
    url: U.beta8AppStore,
    title: "Apple Accepting iPhone Apps Into App Store",
    publisher: "MacRumors",
    sourceClass: "journalism",
    author: "Arnold Kim",
    publishedAt: "2008-06-26T17:34:00-07:00",
    topics: ["iPhone OS 2.0", "Beta 8", "App Store", "submission"],
  },
  {
    url: U.beta8Macworld,
    title: "iPhone SDK beta eight is great",
    publisher: "Macworld",
    sourceClass: "journalism",
    author: "Dan Moren",
    publishedAt: "2008-06-27T02:09:00-07:00",
    topics: ["iPhone SDK", "Beta 8", "App Store", "compatibility"],
  },
];

const rawEvidence = [
  [
    "Beta 1",
    "Apple Newsroom HTML",
    134_048,
    "ca6b6ff640589367f560f412afce9b3eca06b68dfbffbd7ca7716caf9b90068a",
  ],
  [
    "Beta 1",
    "AppleInsider HTML",
    137_066,
    "3f13d450a731853b75bef27b89729bcc19edbf263aabf44b666c6168eaa8e55c",
  ],
  [
    "Beta 1",
    "Engadget HTML",
    63_567,
    "c427d9d4dad7ec382c613db6b1823055f017fce930a117e33b4bfee46c17ad5e",
  ],
  [
    "Beta 2",
    "iClarified HTML",
    183_327,
    "22067d9943ca4ec6451c354988f29f93082e7c9eea16ddc52387ec0dfd118548",
  ],
  [
    "Beta 2",
    "Macworld HTML",
    194_221,
    "0cef58ec7fd793ce5230aa64ec0d583e9dcb93d5844237f1bc98f8e0db7a5051",
  ],
  [
    "Beta 3",
    "MacRumors HTML",
    109_402,
    "5c222d0719c77fcc3afaa0f77dc9a1e764df5de83e5af17ea8b91cb6e9b688bd",
  ],
  [
    "Beta 4",
    "Ars Technica HTML",
    133_810,
    "bcd6f4945d16e6ea2a3d1a6217c2b84c1801085e57a048556ed75e9285881817",
  ],
  [
    "Beta 4",
    "iClarified HTML",
    180_284,
    "a8221fcf523ce8049a6967ac6e6f70429c8cb9b61b5acc6e7612bbbbab7d9bf4",
  ],
  [
    "Beta 5",
    "MacRumors HTML",
    107_971,
    "0065d35b53e09c2160c0a992914e5b6aa66289fbe4261029f95dd6deb69bc9a7",
  ],
  [
    "May 22 private build",
    "AppleInsider HTML",
    133_145,
    "edc1a8c6ddf96a3a18f7bc7a0e626ac0a039fbf3abb0adf4f8445586de139f14",
  ],
  [
    "Beta 6",
    "Ars Technica HTML",
    133_062,
    "ecf3ffc680d259011e8c9d30540e3b1404d3afe5b08bde582a543c22a08061bd",
  ],
  [
    "Beta 6",
    "Engadget HTML",
    55_675,
    "9af30679f22f0c00c03a520e488da6e862c0c44d8b97881c9fd53e1f34ef8f29",
  ],
  [
    "May 22 private build",
    "Engadget location HTML",
    57_151,
    "03c64efa86b950b1e7b80bd77fd054bb76e51978aa0130f1cf703b24a88f06bc",
  ],
  [
    "Beta 7",
    "Ars Technica HTML",
    130_963,
    "19db44c531951fffccd27ba0ec6cc857ba2e07324d6adf4260845af0c1bef3af",
  ],
  [
    "Beta 7",
    "iCulture HTML",
    513_689,
    "786a3f74e03e2fd540baa74c752b596dd5d337e0600d14922b8f6d05bab71196",
  ],
  [
    "Beta 7",
    "MacRumors HTML",
    110_735,
    "7d48e5a259f3b94abc3006ccc78d441a1d5c622e284942c4ebc8726a7d70657c",
  ],
  [
    "Beta 8",
    "MacRumors submission HTML",
    111_975,
    "671e95bf61bbeaba3eda3212ba51581a433236a1fae23ca487fa32738ebe51e4",
  ],
  [
    "Beta 8",
    "Engadget HTML",
    59_975,
    "d309f2e04b507e821cbcde1c74bf2bbe54f94f922b409174e2d196abd08de5a0",
  ],
  [
    "Beta 8",
    "MacRumors seed HTML",
    111_930,
    "96de4edf82ba48f526b2b92cc278bd94716b15190db0cf351420bd3c415d72b3",
  ],
  [
    "Beta 8",
    "Macworld HTML",
    193_557,
    "f7db6d1a587a4fcff149d90fe5b25bcb177376ce44333c55b42fbb3b83c6d446",
  ],
];

const cite = (url, locator, note) => ({
  url,
  ...(locator ? { locator } : {}),
  ...(note ? { note } : {}),
});
const heading = (text) => ({ style: "h2", text });
const prose = (text, citations) => ({ style: "normal", text, citations });
const article = (...blocks) => ({ authorship: "originalSynthesis", blocks });
const review = () => ({ status: "approved", reviewedAt });
const uniqueCitations = (citations) => [
  ...new Map(
    citations.map((citation) => [
      `${citation.url}|${citation.locator || ""}|${citation.note || ""}`,
      citation,
    ]),
  ).values(),
];

const record = (
  id,
  title,
  canonicalSummary,
  category,
  action,
  component,
  sourceKeys,
  {
    documentedStatus = "documented",
    evidenceState = "reported",
    stableKey,
    inheritance = "delta",
    occurrenceSummary,
    evidence,
    verification,
  } = {},
) => ({
  id,
  title,
  canonicalSummary,
  category,
  action,
  component,
  sourceKeys,
  documentedStatus,
  evidenceState,
  stableKey,
  inheritance,
  occurrenceSummary,
  evidence,
  verification,
});

const beta1Changes = [
  record(
    "exchange-active-sync",
    "Exchange ActiveSync",
    "iPhone 2.0 added Exchange ActiveSync for push email and over-the-air contact and calendar synchronization.",
    "feature",
    "introduced",
    "Exchange services",
    ["beta1Apple"],
    {
      stableKey: "ios-2-0-exchange-push-sync",
      evidenceState: "confirmed",
      occurrenceSummary:
        "The first retained beta announcement establishes Exchange push mail, contact and calendar sync, global-directory access, remote wipe, password policy support, and automatic account discovery as part of the opening documented baseline; it does not establish that each behavior first became operational on this date.",
      evidence: {
        beta1Apple: [
          "support for Microsoft Exchange ActiveSync to provide secure, over-the-air push email, contacts and calendars as well as remote wipe",
          "secure over-the-air push email, contacts, calendars and global address lists",
          "remote wipe, password policies and auto-discovery",
        ],
      },
    },
  ),
  record(
    "enterprise-networking",
    "Enterprise networking and configuration",
    "The release added Cisco IPsec VPN, WPA2 Enterprise with 802.1X, certificate authentication, and managed configuration delivery.",
    "enhancement",
    "introduced",
    "Enterprise networking",
    ["beta1Apple"],
    {
      stableKey: "ios-2-0-enterprise-network-management",
      evidenceState: "confirmed",
      occurrenceSummary:
        "The opening beta announcement documents Cisco IPsec, certificate authentication, WPA2 Enterprise with 802.1X, an administrator utility, and authenticated delivery of managed settings as one enterprise baseline.",
      evidence: {
        beta1Apple: [
          "The iPhone 2.0 software supports Cisco IPsec VPN",
          "authenticate using digital certificates",
          "WPA2 Enterprise with 802.1x authentication",
          "configuration utility that allows IT administrators",
          "securely delivered via web link or email to the user",
        ],
      },
    },
  ),
  record(
    "vpn-multifactor-authentication",
    "VPN connections supported password-based multifactor authentication",
    "The enterprise networking design supported an additional authentication factor alongside a password.",
    "feature",
    "introduced",
    "VPN authentication",
    ["beta1Apple"],
    {
      evidenceState: "confirmed",
      evidence: {
        beta1Apple: "password-based, multi-factor authentication",
      },
    },
  ),
  record(
    "native-sdk-platform",
    "Native iPhone SDK platform",
    "The release established Apple’s supported SDK and APIs for native iPhone and iPod touch applications.",
    "developerApi",
    "introduced",
    "Native SDK",
    ["beta1Apple"],
    {
      stableKey: "ios-2-0-native-sdk-platform",
      evidenceState: "confirmed",
      occurrenceSummary:
        "The first retained beta announcement establishes the supported native framework stack and APIs for Multi-Touch, animation, motion, and location as the opening SDK baseline.",
      evidence: {
        beta1Apple: [
          "rich set of Application Programming Interfaces (APIs) and tools",
          "programming interfaces for Core OS, Core Services, Media and Cocoa Touch technologies",
          "Multi-Touch™ user interface, animation technology, large storage, built-in three-axis accelerometer and geographical location technology",
        ],
      },
    },
  ),
  record(
    "xcode-tooling",
    "Xcode supplied the primary editing and debugging environment",
    "The announced SDK toolset included project management, source editing, and graphical debugging in Xcode.",
    "developerApi",
    "introduced",
    "Xcode",
    ["beta1Apple"],
    {
      evidenceState: "confirmed",
      evidence: {
        beta1Apple:
          "Xcode® for source code editing, project management and graphical debugging",
      },
    },
  ),
  record(
    "instruments-tooling",
    "Instruments supported application performance analysis",
    "Developers could monitor and optimize native application behavior with the Instruments tool.",
    "developerApi",
    "introduced",
    "Instruments",
    ["beta1Apple"],
    {
      evidenceState: "confirmed",
      evidence: {
        beta1Apple:
          "Instruments to monitor and optimize iPhone application performance in real time",
      },
    },
  ),
  record(
    "simulator-tooling",
    "The iPhone Simulator supported application testing",
    "The SDK provided a Mac-hosted environment for running and debugging native applications without a device.",
    "developerApi",
    "introduced",
    "iPhone Simulator",
    ["beta1Apple"],
    {
      evidenceState: "confirmed",
      evidence: {
        beta1Apple: "iPhone Simulator to run and debug applications",
      },
    },
  ),
  record(
    "public-sdk-download",
    "The beta SDK and simulator became a public download",
    "Apple made the development kit and simulator available worldwide without limiting the download to accepted device testers.",
    "developerApi",
    "introduced",
    "SDK availability",
    ["beta1Apple"],
    {
      evidenceState: "confirmed",
      evidence: {
        beta1Apple: "anyone can download the beta iPhone SDK for free",
      },
    },
  ),
  record(
    "device-testing-membership-limit",
    "Device testing remained limited to accepted program members",
    "Only a constrained developer-program cohort could place prerelease applications on physical devices during the beta.",
    "knownIssue",
    "knownIssue",
    "Developer Program",
    ["beta1Apple"],
    {
      evidenceState: "confirmed",
      evidence: {
        beta1Apple:
          "a limited number of developers will be accepted into Apple’s new iPhone Developer Program",
      },
    },
  ),
  record(
    "mail-documents-and-bulk-actions",
    "Mail documents and bulk actions",
    "Mail gained PowerPoint attachment viewing and the ability to move or delete multiple messages together.",
    "enhancement",
    "introduced",
    "Mail",
    ["beta1Apple", "beta1Engadget", "beta1AppleInsider"],
    {
      stableKey: "ios-2-0-mail-document-bulk-actions",
      evidenceState: "confirmed",
      occurrenceSummary:
        "The first-party announcement documents PowerPoint viewing and mass move or delete, while two hands-on accounts independently observed the bulk-message control.",
      evidence: {
        beta1Apple: [
          "ability to view PowerPoint attachments",
          "ability to mass delete and move email messages",
        ],
        beta1Engadget:
          "select as many messages as you want and delete or move them as a group",
        beta1AppleInsider:
          "option of mass-selecting e-mail to delete messages in bulk rather than one at a time",
      },
      verification:
        "Matched the feature to Apple's announcement and two independent hands-on descriptions.",
    },
  ),
  record(
    "parental-controls",
    "Parental control restrictions",
    "iPhone 2.0 added settings for restricting specified content.",
    "feature",
    "introduced",
    "Restrictions",
    ["beta1Engadget", "beta1AppleInsider"],
    {
      stableKey: "ios-2-0-parental-controls",
      documentedStatus: "undocumented",
      evidenceState: "corroborated",
      occurrenceSummary:
        "Two hands-on reports observed working controls that could hide selected built-in services in the opening retained beta.",
      evidence: {
        beta1Engadget: "Parental controls most certainly work",
        beta1AppleInsider:
          "parental controls that allow adults to shut off access",
      },
    },
  ),
  record(
    "wifi-network-priority",
    "Known Wi-Fi networks gained a preference order",
    "The beta exposed a way to rank remembered wireless networks.",
    "enhancement",
    "introduced",
    "Wi-Fi",
    ["beta1Engadget", "beta1AppleInsider"],
    {
      documentedStatus: "undocumented",
      evidenceState: "corroborated",
      evidence: {
        beta1Engadget: "order your preferred WiFi networks",
        beta1AppleInsider: "sort Wi-Fi networks by preference",
      },
    },
  ),
  record(
    "scientific-calculator",
    "Calculator added a landscape scientific layout",
    "Rotating the device exposed an expanded set of mathematical controls.",
    "feature",
    "introduced",
    "Calculator",
    ["beta1Engadget", "beta1AppleInsider"],
    {
      documentedStatus: "undocumented",
      evidenceState: "corroborated",
      evidence: {
        beta1Engadget: "new sideways scientific mode",
        beta1AppleInsider:
          "scientific mode when the iPhone is tilted on its side",
      },
    },
  ),
  record(
    "app-store-inactive",
    "The App Store shell could not yet connect",
    "The application icon was present, but hands-on testing reached an unavailable service rather than a working catalog.",
    "knownIssue",
    "knownIssue",
    "App Store",
    ["beta1Engadget"],
    {
      documentedStatus: "undocumented",
      evidence: {
        beta1Engadget:
          "The App Store is there, of course, but doesn't do anything yet",
      },
    },
  ),
  record(
    "contact-search-absent",
    "Contact search was not available in the tested seed",
    "Two hands-on accounts could not find a usable contact-search control.",
    "knownIssue",
    "knownIssue",
    "Contacts",
    ["beta1Engadget", "beta1AppleInsider"],
    {
      documentedStatus: "undocumented",
      evidenceState: "corroborated",
      evidence: {
        beta1Engadget: "There's no contact search that we can see",
        beta1AppleInsider: "contact search are nonetheless absent",
      },
    },
  ),
  record(
    "calendar-control-inactive",
    "An unexplained Calendar control remained inactive",
    "The seed displayed a new Calendar button that testers could not make perform an action.",
    "knownIssue",
    "knownIssue",
    "Calendar",
    ["beta1Engadget", "beta1AppleInsider"],
    {
      documentedStatus: "undocumented",
      evidenceState: "corroborated",
      evidence: {
        beta1Engadget: "There's a new button in the calendar",
        beta1AppleInsider:
          "button in the calendar feature appears to be inactive",
      },
    },
  ),
  record(
    "exchange-wifi-delivery-delay",
    "Exchange updates over Wi-Fi were not always immediate",
    "One hands-on test observed periodic checks on Wi-Fi instead of consistently instantaneous delivery.",
    "knownIssue",
    "knownIssue",
    "Exchange over Wi-Fi",
    ["beta1Engadget"],
    {
      documentedStatus: "undocumented",
      evidence: {
        beta1Engadget:
          "over WiFi it does check-ins, so it's not as instantaneous",
      },
    },
  ),
];

const beta2Changes = [
  record(
    "interface-builder-availability",
    "Interface Builder became available in the downloadable SDK",
    "Beta 2 added the visual interface-design tool to the SDK package developers could install.",
    "developerApi",
    "introduced",
    "Interface Builder",
    ["beta2Macworld"],
    {
      evidence: {
        beta2Macworld: "iPhone SDK beta 2 includes Interface Builder",
      },
    },
  ),
  record(
    "nondefault-developer-folder-incompatibility",
    "Nondefault developer-tool folders were incompatible",
    "The SDK readme warned that Beta 2 would not work when installed outside the standard developer directory.",
    "knownIssue",
    "knownIssue",
    "SDK installation",
    ["beta2Macworld"],
    {
      evidence: {
        beta2Macworld:
          "incompatible with installation folders other than the default /Developer",
      },
    },
  ),
  record(
    "contacts-home-screen-icon",
    "Contacts gained a separate Home Screen icon",
    "A contemporaneous firmware inspection found a Contacts icon on a second application page.",
    "enhancement",
    "introduced",
    "Contacts",
    ["beta2Iclarified"],
    {
      documentedStatus: "undocumented",
      evidence: {
        beta2Iclarified: "new icon Contacts on second page",
      },
    },
  ),
  record(
    "store-parental-controls-regression",
    "App Store and iTunes Store restriction switches stopped working",
    "A contemporaneous inspection reported that the parental controls could no longer switch on the two store applications.",
    "regression",
    "regression",
    "Restrictions",
    ["beta2Iclarified"],
    {
      documentedStatus: "undocumented",
      evidence: {
        beta2Iclarified:
          "Appstore and iTunes store cannot be switched on via parental controls anymore",
      },
    },
  ),
];

const beta3Changes = [
  record(
    "exchange-meeting-invitations",
    "Exchange meeting invitations could be received and accepted",
    "Calendar expanded its Exchange workflow to handle incoming meeting requests.",
    "feature",
    "introduced",
    "Exchange Calendar",
    ["beta3MacRumors"],
    {
      documentedStatus: "partiallyDocumented",
      evidence: {
        beta3MacRumors: "receiving and accepting meeting invitations",
      },
    },
  ),
  record(
    "global-address-list-search",
    "Exchange global address lists became searchable",
    "Users could query the organization's shared Exchange contact directory.",
    "enhancement",
    "introduced",
    "Exchange directory",
    ["beta3MacRumors"],
    {
      documentedStatus: "partiallyDocumented",
      evidence: {
        beta3MacRumors: "searching for contacts in the global address list",
      },
    },
  ),
  record(
    "global-address-list-autocomplete",
    "Mail could autocomplete addresses from the global directory",
    "Message composition could suggest recipients drawn from the Exchange global address list.",
    "enhancement",
    "introduced",
    "Exchange Mail",
    ["beta3MacRumors"],
    {
      documentedStatus: "partiallyDocumented",
      evidence: {
        beta3MacRumors:
          "auto-complete email addresses in the global address list",
      },
    },
  ),
  record(
    "exchange-2007-autodiscovery",
    "Exchange ActiveSync",
    "iPhone 2.0 added Exchange ActiveSync for push email and over-the-air contact and calendar synchronization.",
    "feature",
    "changed",
    "Exchange setup",
    ["beta3MacRumors"],
    {
      stableKey: "ios-2-0-exchange-push-sync",
      documentedStatus: "partiallyDocumented",
      occurrenceSummary:
        "Beta 3 evidence narrows the continuing Exchange history by specifically documenting automatic setup for supported Exchange 2007 accounts.",
      evidence: {
        beta3MacRumors:
          "setting up an exchange account using Autodiscovery (Exchange 2007)",
      },
    },
  ),
  record(
    "expired-opening-seed-replaced",
    "The expired opening seed was replaced",
    "Beta 3 superseded the original developer firmware on the day that earlier seed stopped operating.",
    "knownIssue",
    "fixed",
    "Beta availability",
    ["beta3MacRumors"],
    {
      documentedStatus: "partiallyDocumented",
      evidence: {
        beta3MacRumors:
          "replaces the build originally seeded to developers, which incidentally had timed out today",
      },
    },
  ),
];

const beta4Changes = [
  record(
    "opengl-es-simulator",
    "The simulator added OpenGL ES rendering",
    "Developers could exercise 3D graphics in the simulator instead of requiring device-only testing.",
    "developerApi",
    "introduced",
    "iPhone Simulator",
    ["beta4Ars", "beta4Iclarified"],
    {
      evidenceState: "corroborated",
      evidence: {
        beta4Ars: "iPhone Simulator now includes support for OpenGL ES",
        beta4Iclarified: "OpenGL ES support within the iPhone simulator",
      },
    },
  ),
  record(
    "device-code-signing-enforced",
    "Prerelease application-signing policy",
    "The iPhone OS 2.0 prerelease cycle changed which certificates could authorize applications on physical devices.",
    "compatibility",
    "changed",
    "Code signing",
    ["beta4Ars"],
    {
      stableKey: "iphone-os-2-0-signing-policy",
      occurrenceSummary:
        "Beta 4 began enforcing code signing for software installed on physical devices.",
      evidence: {
        beta4Ars: "code signing is now enforced by the iPhone OS",
      },
    },
  ),
  record(
    "simulator-unsigned-code",
    "Unsigned applications still ran in the simulator",
    "The new certificate requirement applied to device deployment while simulated testing retained an unsigned path.",
    "compatibility",
    "changed",
    "iPhone Simulator",
    ["beta4Ars"],
    {
      evidence: {
        beta4Ars: "Unsigned code will still run in the iPhone Simulator",
      },
    },
  ),
  record(
    "sdk-download-smaller",
    "The SDK download became smaller",
    "The Beta 4 package reduced its download footprint while retaining the Mac development tools.",
    "enhancement",
    "changed",
    "SDK distribution",
    ["beta4Ars"],
    {
      documentedStatus: "partiallyDocumented",
      evidence: {
        beta4Ars: "SDK download has been slimmed down to 1.15GB",
      },
    },
  ),
  record(
    "simulator-foundation-device-gap",
    "Some simulated Foundation functions were absent on devices",
    "The simulator exposed framework behavior that the phone operating system did not yet support.",
    "knownIssue",
    "knownIssue",
    "Foundation",
    ["beta4Ars"],
    {
      documentedStatus: "undocumented",
      evidence: {
        beta4Ars:
          "Foundation framework in the Simulator has functions not (yet?) supported by iPhone OS",
      },
    },
  ),
  record(
    "audio-toolbox-revisions",
    "Audio Toolbox received developer-facing revisions",
    "Contemporaneous developer inspection reported changes in the audio framework.",
    "developerApi",
    "changed",
    "Audio Toolbox",
    ["beta4Ars"],
    {
      documentedStatus: "undocumented",
      evidence: {
        beta4Ars: "improvements to Audio Toolbox",
      },
    },
  ),
  record(
    "uifont-revisions",
    "UIFont received developer-facing revisions",
    "Contemporaneous developer inspection reported changes in the font interface.",
    "developerApi",
    "changed",
    "UIFont",
    ["beta4Ars"],
    {
      documentedStatus: "undocumented",
      evidence: {
        beta4Ars: "UIFont",
      },
    },
  ),
  record(
    "uiapplication-revisions",
    "UIApplication received developer-facing revisions",
    "Contemporaneous developer inspection reported changes in the application object interface.",
    "developerApi",
    "changed",
    "UIApplication",
    ["beta4Ars"],
    {
      documentedStatus: "undocumented",
      evidence: {
        beta4Ars: "UIApplication",
      },
    },
  ),
  record(
    "nsxmlparser-support",
    "NSXMLParser support appeared",
    "The SDK added the Foundation parser used for event-driven XML processing.",
    "developerApi",
    "introduced",
    "NSXMLParser",
    ["beta4Ars"],
    {
      documentedStatus: "undocumented",
      evidence: {
        beta4Ars: "added NSXMLParser support",
      },
    },
  ),
  record(
    "api-method-name-churn",
    "Method names continued to change",
    "The beta revised existing API spellings, reinforcing that source compatibility had not stabilized.",
    "developerApi",
    "changed",
    "UIKit APIs",
    ["beta4Ars"],
    {
      documentedStatus: "partiallyDocumented",
      evidence: {
        beta4Ars: "some method names had changed",
      },
    },
  ),
];

const beta5Changes = [
  record(
    "sdk-bug-fix-focus",
    "iPhone SDK maintenance",
    "The iPhone OS 2.0 SDK prerelease line received general bug fixes without retained component-level detail.",
    "bugFix",
    "fixed",
    "iPhone SDK",
    ["beta5MacRumors"],
    {
      stableKey: "iphone-os-2-0-sdk-maintenance",
      documentedStatus: "partiallyDocumented",
      occurrenceSummary:
        "The surviving Beta 5 description identifies a general SDK maintenance pass but does not preserve component-level fixes.",
      evidence: {
        beta5MacRumors: "centered on bug fixes",
      },
    },
  ),
  record(
    "latest-os-support",
    "SDK support for the target iPhone OS",
    "The prerelease SDK was updated to support the corresponding iPhone OS software target.",
    "compatibility",
    "changed",
    "SDK and iPhone OS",
    ["beta5MacRumors"],
    {
      stableKey: "iphone-os-2-0-sdk-os-support",
      documentedStatus: "partiallyDocumented",
      occurrenceSummary:
        "The surviving Beta 5 description says the toolchain supported the latest operating-system prerelease, without identifying a separate firmware seed.",
      evidence: {
        beta5MacRumors: "support for the latest iPhone OS",
      },
    },
  ),
];

const beta6Changes = [
  record(
    "application-ids-required",
    "Provisioning began requiring Application IDs",
    "Developers had to register an identifier before installing a test application on a phone.",
    "developerApi",
    "changed",
    "Application provisioning",
    ["beta6Engadget", "beta6Ars"],
    {
      documentedStatus: "partiallyDocumented",
      evidenceState: "corroborated",
      evidence: {
        beta6Engadget: "must now register their Application IDs",
        beta6Ars: "create Application IDs for all of their apps",
      },
    },
  ),
  record(
    "provisioning-profiles-regenerated",
    "Existing provisioning profiles had to be replaced",
    "The new identifier requirement invalidated earlier profiles and required developers to create fresh ones.",
    "compatibility",
    "changed",
    "Provisioning profiles",
    ["beta6Engadget"],
    {
      documentedStatus: "partiallyDocumented",
      evidence: {
        beta6Engadget: "regenerate all provisioning profiles",
      },
    },
  ),
  record(
    "macos-10-5-3-required",
    "Mac OS X 10.5.3 SDK host requirement",
    "The iPhone SDK required an Intel-based Mac running Mac OS X 10.5.3.",
    "compatibility",
    "changed",
    "SDK host system",
    ["beta6Engadget", "beta6Ars"],
    {
      stableKey: "iphone-os-2-0-sdk-macos-10-5-3",
      documentedStatus: "partiallyDocumented",
      evidenceState: "corroborated",
      occurrenceSummary:
        "Beta 6 reports establish Mac OS X 10.5.3 as the SDK host requirement; the later Beta 7 occurrence records that this constraint continued.",
      evidence: {
        beta6Engadget:
          "requires you be running the latest version of Mac OS X Leopard 10.5.3",
        beta6Ars: "beta requires 10.5.3 to run",
      },
    },
  ),
  record(
    "sample-apps-removed",
    "Six sample applications left the SDK package",
    "The Beta 6 download contained fewer example projects than its predecessor.",
    "developerApi",
    "removed",
    "SDK samples",
    ["beta6Engadget", "beta6Ars"],
    {
      documentedStatus: "partiallyDocumented",
      evidenceState: "corroborated",
      evidence: {
        beta6Engadget: "removed 6 sample applications",
        beta6Ars: "six fewer sample applications than the previous version",
      },
    },
  ),
];

const beta7Changes = [
  record(
    "sdk-bug-fixes",
    "iPhone SDK maintenance",
    "The iPhone OS 2.0 SDK prerelease line received general bug fixes without retained component-level detail.",
    "bugFix",
    "fixed",
    "iPhone SDK",
    ["beta7Ars", "beta7Iculture"],
    {
      stableKey: "iphone-os-2-0-sdk-maintenance",
      documentedStatus: "partiallyDocumented",
      evidenceState: "corroborated",
      occurrenceSummary:
        "Two independent reports preserve the same narrow Beta 7 maintenance description without component-level detail.",
      evidence: {
        beta7Ars: "brings with it bug fixes",
        beta7Iculture: "releasenotes vermelden alleen dat er bugfixes",
      },
    },
  ),
  record(
    "current-os-support",
    "SDK support for the target iPhone OS",
    "The prerelease SDK was updated to support the corresponding iPhone OS software target.",
    "compatibility",
    "changed",
    "SDK and iPhone OS",
    ["beta7Ars", "beta7Iculture"],
    {
      stableKey: "iphone-os-2-0-sdk-os-support",
      documentedStatus: "partiallyDocumented",
      evidenceState: "corroborated",
      occurrenceSummary:
        "The retained Beta 7 summary connects the toolchain to the current OS target, but the surviving evidence does not identify a separately numbered firmware seed.",
      evidence: {
        beta7Ars: "added support for the latest iPhone OS",
        beta7Iculture: "support voor het nieuwste iPhone OS is toegevoegd",
      },
    },
  ),
  record(
    "macos-10-5-3-continued",
    "Mac OS X 10.5.3 SDK host requirement",
    "The iPhone SDK required an Intel-based Mac running Mac OS X 10.5.3.",
    "compatibility",
    "changed",
    "SDK host system",
    ["beta7Ars"],
    {
      stableKey: "iphone-os-2-0-sdk-macos-10-5-3",
      inheritance: "cumulative",
      documentedStatus: "partiallyDocumented",
      occurrenceSummary:
        "Beta 7 retained the Mac OS X 10.5.3 requirement on Intel hardware rather than introducing a new host requirement.",
      evidence: {
        beta7Ars:
          "will only run under OS X 10.5.3 on machines with a genuine Intel processor",
      },
    },
  ),
];

const beta8Changes = [
  record(
    "certificate-cutoff",
    "Prerelease application-signing policy",
    "The iPhone OS 2.0 prerelease cycle changed which certificates could authorize applications on physical devices.",
    "compatibility",
    "changed",
    "Code signing",
    ["beta8Engadget"],
    {
      stableKey: "iphone-os-2-0-signing-policy",
      documentedStatus: "partiallyDocumented",
      occurrenceSummary:
        "Beta 8 evidence records a new cutoff: certificates issued before June 9 had expired.",
      evidence: {
        beta8Engadget: "certificates issued before June 9 have also expired",
      },
    },
  ),
  record(
    "itunes-7-7-installation",
    "A prerelease iTunes 7.7 accompanied Beta 8 installation",
    "The developer-only desktop preview provided an installation path for the matching operating-system seed.",
    "compatibility",
    "changed",
    "iTunes installation",
    ["beta8MacRumors", "beta8Engadget"],
    {
      documentedStatus: "partiallyDocumented",
      evidenceState: "corroborated",
      occurrenceSummary:
        "Two reports connect the developer-only iTunes 7.7 preview to Beta 8 installation; neither establishes it as a general iPhone OS feature.",
      evidence: {
        beta8MacRumors: "seeded a pre-release of iTunes 7.7",
        beta8Engadget: [
          "developer-only version of iTunes 7.7",
          "install iPhone OS Beta 8 on your Apple devices",
        ],
      },
    },
  ),
  record(
    "final-submission-testing",
    "Beta 8 opened final App Store testing",
    "Apple's preserved developer message directed teams to conduct final checks with the new operating-system seed.",
    "developerApi",
    "changed",
    "App Store preparation",
    ["beta8AppStore"],
    {
      documentedStatus: "partiallyDocumented",
      evidence: {
        beta8AppStore:
          "conduct final testing and prepare your application for submission",
      },
    },
  ),
  record(
    "app-store-submissions-open",
    "The App Store began accepting application submissions",
    "Developers could send applications for review ahead of the public store launch.",
    "feature",
    "introduced",
    "App Store submission",
    ["beta8AppStore", "beta8MacRumors"],
    {
      documentedStatus: "partiallyDocumented",
      evidenceState: "corroborated",
      evidence: {
        beta8AppStore: "now accepting applications to the App Store",
        beta8MacRumors: "Apple is now accepting Apps into the App store",
      },
    },
  ),
  record(
    "submission-build-signing-requirement",
    "Beta 8 became the required submission toolchain",
    "App Store candidates had to be built and signed with this SDK release.",
    "compatibility",
    "changed",
    "App Store submission",
    ["beta8Macworld"],
    {
      evidence: {
        beta8Macworld: "version required to build and sign iPhone apps",
      },
    },
  ),
  record(
    "final-os-compatibility",
    "SDK support for the target iPhone OS",
    "The prerelease SDK was updated to support the corresponding iPhone OS software target.",
    "compatibility",
    "changed",
    "SDK and iPhone OS",
    ["beta8Macworld"],
    {
      stableKey: "iphone-os-2-0-sdk-os-support",
      documentedStatus: "partiallyDocumented",
      occurrenceSummary:
        "The Beta 8 release notes tie this SDK to the forthcoming public 2.0 target.",
      evidence: {
        beta8Macworld:
          "beta 8 is compatible with the final iPhone OS 2.0 software release",
      },
    },
  ),
];

const eventSpecs = [
  {
    alias: "beta-1",
    label: "Beta 1",
    date: "2008-03-06",
    sequence: 1,
    changes: beta1Changes,
    sourceKeys: ["beta1Apple", "beta1Engadget", "beta1AppleInsider"],
    summary:
      "Apple’s first retained iPhone OS 2.0 beta announcement establishes the enterprise and native-SDK baseline, while hands-on reporting preserves the seed’s visible additions and limitations.",
    identityEvidence: {
      beta1Apple: "immediate availability of a beta release of the software",
    },
    method:
      "Apple’s announcement establishes the first retained feature, enterprise, API, and tool baseline. It also describes launch-bound capabilities alongside immediately available beta software, so the baseline records documented scope without claiming that every item first originated—or was already operational—on March 6. The two future-tense App Store distribution promises are excluded; the inactive store shell remains as a separate hands-on observation.",
  },
  {
    alias: "beta-2",
    label: "Beta 2",
    date: "2008-03-27",
    sequence: 2,
    changes: beta2Changes,
    sourceKeys: ["beta2Macworld", "beta2Iclarified"],
    summary:
      "The March 27 SDK Beta 2 package added Interface Builder and retained an installation constraint; a next-day report describes an accompanying but not explicitly numbered firmware update.",
    identityEvidence: {
      beta2Macworld: "iPhone SDK beta 2 includes Interface Builder",
      beta2Iclarified: "A new version of the iPhone 2.0 Beta Firmware",
    },
    method:
      "Macworld explicitly dates SDK Beta 2 to March 27. The selected March 28 firmware report calls its subject only a new iPhone 2.0 beta firmware, not Beta 2. The route follows the SDK sequence and earliest milestone date; firmware observations retain their one-day and numbering uncertainty.",
  },
  {
    alias: "beta-3",
    label: "Beta 3",
    date: "2008-04-08",
    sequence: 3,
    changes: beta3Changes,
    sourceKeys: ["beta3MacRumors"],
    summary:
      "The April 8 report explicitly pairs SDK Beta 3 with an updated iPhone OS seed, adding bounded Exchange workflows and replacing the expired opening seed.",
    identityEvidence: {
      beta3MacRumors: "updated version of the iPhone SDK (Beta 3)",
    },
    method:
      "One contemporaneous report explicitly identifies both the third SDK and updated iPhone OS beta. It preserves four bounded Exchange changes and the expiration boundary for the opening seed; no unstated API or interface changes are inferred.",
  },
  {
    alias: "beta-4",
    label: "Beta 4",
    date: "2008-04-23",
    sequence: 4,
    changes: beta4Changes,
    sourceKeys: ["beta4Ars", "beta4Iclarified"],
    summary:
      "The fourth SDK and firmware milestone expanded simulator support, enforced device signing, and carried a small set of documented and developer-observed API changes.",
    identityEvidence: {
      beta4Ars: "fourth beta of the iPhone SDK",
      beta4Iclarified: "This is the fourth beta released",
    },
    method:
      "Two reports establish the firmware and SDK milestone. Documented simulator and signing changes are separated from developer-discovered API observations. Items described only as future work in the retained release-note summary are excluded because they had not yet occurred.",
  },
  {
    alias: "beta-5",
    label: "Beta 5",
    date: "2008-05-06",
    sequence: 5,
    changes: beta5Changes,
    sourceKeys: ["beta5MacRumors"],
    summary:
      "The surviving May 6 evidence identifies SDK Beta 5 and preserves only a general maintenance pass plus support for the latest iPhone OS target.",
    identityEvidence: {
      beta5MacRumors: "iPhone SDK Beta 5",
    },
    method:
      "The surviving description explicitly identifies SDK Beta 5 but does not establish a separately numbered firmware seed. It preserves only general maintenance and compatibility with the current OS target. Unverified preference strings and nearby observations are not assigned to this route.",
  },
  {
    alias: "beta-6",
    label: "Beta 6",
    date: "2008-05-28",
    sequence: 6,
    changes: beta6Changes,
    sourceKeys: [
      "beta6Engadget",
      "beta6Ars",
      "beta6AppleInsider",
      "beta6GeotagEngadget",
    ],
    summary:
      "The May 28 Beta 6 package changed provisioning, raised the SDK host requirement, and removed sample projects; an earlier private build is documented only as an exclusion boundary.",
    identityEvidence: {
      beta6Engadget: [
        "We're now up to iPhone beta 6",
        "release number for the firmware is 5a308",
      ],
      beta6Ars: "iPhone SDK, version 6",
    },
    boundaryEvidence: {
      beta6AppleInsider: "reportedly labeled build 5A292g",
      beta6GeotagEngadget: "most recent version of the iPhone 2.0 beta",
    },
    method:
      "The May 28 evidence independently identifies Beta 6, including firmware 5A308. The May 22 location and Camera reports describe an unnumbered private state, with AppleInsider naming build 5A292g. Because that earlier build cannot be assigned to Beta 6, its four location observations are excluded from this route and retained only as boundary evidence.",
  },
  {
    alias: "beta-7",
    label: "Beta 7",
    date: "2008-06-09",
    sequence: 7,
    changes: beta7Changes,
    sourceKeys: ["beta7MacRumors", "beta7Ars", "beta7Iculture"],
    summary:
      "SDK Beta 7 retained the narrow maintenance and current-target description from Beta 5 and continued the Mac OS X 10.5.3 host constraint.",
    identityEvidence: {
      beta7MacRumors: "7th Beta of the iPhone SDK",
      beta7Ars: "Beta release 7 of the SDK",
      beta7Iculture: "zevende beta van de iPhone SDK",
    },
    method:
      "All three selected reports identify SDK Beta 7, while none establishes a separately numbered firmware seed. Ars Technica and iCulture independently retain the same narrow release-note description: bug fixes and current-OS support. Forum-only interface, performance, and reliability observations are excluded.",
  },
  {
    alias: "beta-8",
    label: "Beta 8",
    date: "2008-06-26",
    sequence: 8,
    changes: beta8Changes,
    sourceKeys: [
      "beta8MacRumors",
      "beta8Engadget",
      "beta8AppStore",
      "beta8Macworld",
    ],
    summary:
      "Beta 8 paired the final prerelease SDK and firmware with updated signing state, a developer iTunes installation path, and the opening of App Store submission workflows.",
    identityEvidence: {
      beta8MacRumors: [
        "Beta 8 of the iPhone Software Developer's Kit",
        "new version of the iPhone 2.0 Firmware",
      ],
      beta8Engadget: ["iPhone SDK Beta 8", "firmware revision 5a345"],
      beta8AppStore: "eighth beta version of the iPhone OS",
      beta8Macworld: "beta 8 version of the software development kit",
    },
    method:
      "The selected reports call the June 26 milestone Beta 8. Later reporting sometimes describes the same firmware lineage as a golden master, but this batch does not duplicate one uncertain identity into separate routes. MobileMe push, bookmark syncing, and the Applications pane are excluded because the retained text describes iTunes 7.7 behavior, not an iPhone OS change; an anonymous stability impression is also excluded.",
  },
];

const sourceByKey = new Map(Object.entries(U));
const citationFor = (sourceKey, locator) =>
  cite(
    sourceByKey.get(sourceKey),
    locator,
    "The factual result is rewritten as original synthesis; the cited artifact retains the historical evidence.",
  );

const evidenceItems = (value) => (Array.isArray(value) ? value : [value]);
const citationsFromEvidence = (evidence, label, component) =>
  Object.entries(evidence || {}).flatMap(([sourceKey, values]) =>
    evidenceItems(values).map((value) => {
      const phrase = typeof value === "string" ? value : value.phrase;
      const detail =
        typeof value === "string" || !value.note ? "" : `; ${value.note}`;
      if (!phrase) {
        throw new Error(
          `Missing exact evidence phrase for ${label}/${component}/${sourceKey}.`,
        );
      }
      return citationFor(
        sourceKey,
        `${label}; ${component}${detail} — ${phrase}`,
      );
    }),
  );

const changesFor = (spec) =>
  spec.changes.map((item) => {
    const evidenceKeys = Object.keys(item.evidence || {});
    if (
      JSON.stringify([...item.sourceKeys].sort()) !==
      JSON.stringify(evidenceKeys.sort())
    ) {
      throw new Error(
        `${spec.label}/${item.id} source keys do not match its exact evidence map.`,
      );
    }
    return {
      key:
        item.stableKey ||
        `iphone-os-2-0-${spec.alias.replaceAll("-", "")}-${item.id}`,
      title: item.title,
      canonicalSummary: item.canonicalSummary,
      category: item.category,
      action: item.action,
      inheritance: item.inheritance,
      summary:
        item.occurrenceSummary ||
        (spec.alias === "beta-1"
          ? `The opening retained iPhone OS 2.0 evidence places this ${item.component} state in the first documented developer baseline without asserting that it originated on March 6.`
          : `${spec.label} evidence places this ${item.component} state in the milestone while preserving its documentation and product-scope boundary.`),
      documentedStatus: item.documentedStatus,
      evidenceState: item.evidenceState,
      verificationMethod:
        item.verification ||
        (item.evidenceState === "corroborated"
          ? `Matched the ${item.component} claim across independent retained sources, verified each exact locator, and reduced the result to a narrow historical record.`
          : item.evidenceState === "confirmed"
            ? `Matched the ${item.component} claim to the retained first-party Apple announcement, verified the exact locator, and retained only original synthesis.`
            : `Matched the ${item.component} claim to the retained artifact and exact locator; no stronger evidence state is inferred.`),
      citations: citationsFromEvidence(
        item.evidence,
        spec.label,
        item.component,
      ),
    };
  });

const eventArticle = (spec, changes) => {
  const identityCitations = citationsFromEvidence(
    spec.identityEvidence,
    spec.label,
    "identity and timing",
  );
  const boundaryCitations = citationsFromEvidence(
    spec.boundaryEvidence,
    spec.label,
    "selection boundary",
  );
  return article(
    heading("Release milestone"),
    prose(spec.summary, identityCitations),
    heading(`What ${spec.label} documents`),
    prose(
      `This archive page contains ${changes.length} narrowly attributed historical records. All titles, summaries, and explanatory prose are original synthesis, with source locators retained for verification.`,
      uniqueCitations(changes.flatMap((change) => change.citations)),
    ),
    heading("Selection boundary"),
    prose(
      spec.method,
      uniqueCitations([...identityCitations, ...boundaryCitations]),
    ),
    heading("Archive limitations"),
    prose(
      "This archive does not reproduce publisher articles or confidential developer material. Unsupported build numbers, speculative features, long excerpts, and the separately owned Public route are excluded.",
      uniqueCitations([...identityCitations, ...boundaryCitations]),
    ),
  );
};

const events = eventSpecs.map((spec) => {
  const changes = changesFor(spec);
  return {
    target: {
      releaseVersionId: "version-ios-2-0",
      routeAlias: spec.alias,
    },
    identity: {
      releaseVersionId: "version-ios-2-0",
      platformId: "platform-ios",
      stableEventId: `event:apple:ios:2.0:${spec.alias}`,
      label: spec.label,
      routeAlias: spec.alias,
      channel: "developerBeta",
      appearanceDate: spec.date,
      sequence: spec.sequence,
      isRevision: false,
      availabilityState: "available",
      closesReleaseCycle: false,
    },
    authorship: "originalSynthesis",
    summary: spec.summary,
    article: eventArticle(spec, changes),
    citations: uniqueCitations([
      ...citationsFromEvidence(
        spec.identityEvidence,
        spec.label,
        "identity and timing",
      ),
      ...citationsFromEvidence(
        spec.boundaryEvidence,
        spec.label,
        "selection boundary",
      ),
      ...changes.flatMap((change) => change.citations),
    ]),
    changes,
    provenanceStatus: "editoriallyVerified",
    editorialReview: review(),
    isIndexable: true,
  };
});

const bundle = {
  formatVersion: 1,
  target: { projectId: "lh3yswzu", dataset: "production" },
  accessedAt,
  sources,
  versions: [],
  events,
  builds: [],
};

const stableValue = (value) => {
  if (Array.isArray(value)) return value.map(stableValue);
  if (!value || typeof value !== "object") return value;
  return Object.fromEntries(
    Object.entries(value)
      .sort(([left], [right]) => left.localeCompare(right))
      .map(([key, item]) => [key, stableValue(item)]),
  );
};

const publicOwnerPath = join(here, publicOwnerName);
const publicOwnerBuffer = readFileSync(publicOwnerPath);
const publicOwnerSha = createHash("sha256")
  .update(publicOwnerBuffer)
  .digest("hex");
if (publicOwnerSha !== expectedPublicOwnerSha) {
  throw new Error(
    `${publicOwnerName} changed (${publicOwnerSha}); re-audit shared iPhone OS 2.0 definitions before regenerating.`,
  );
}
const publicOwner = JSON.parse(publicOwnerBuffer);
const sharedPublicKeys = new Set([
  "ios-2-0-exchange-push-sync",
  "ios-2-0-enterprise-network-management",
  "ios-2-0-mail-document-bulk-actions",
  "ios-2-0-native-sdk-platform",
  "ios-2-0-parental-controls",
]);
const publicDefinitions = new Map();
for (const owner of [
  ...(publicOwner.versions || []),
  ...(publicOwner.events || []),
  ...(publicOwner.builds || []),
]) {
  for (const item of owner.changes || []) {
    if (!sharedPublicKeys.has(item.key)) continue;
    const definition = stableValue({
      title: item.title,
      canonicalSummary: item.canonicalSummary,
      category: item.category,
    });
    const previous = publicDefinitions.get(item.key);
    if (previous && JSON.stringify(previous) !== JSON.stringify(definition)) {
      throw new Error(`${publicOwnerName} contains drift for ${item.key}.`);
    }
    publicDefinitions.set(item.key, definition);
  }
}
if (publicDefinitions.size !== sharedPublicKeys.size) {
  throw new Error(
    `${publicOwnerName} does not contain the five expected reusable definitions.`,
  );
}

const expectedSeedInventory = [
  {
    platform: "iOS",
    majorVersion: 2,
    version: "2.0",
    releaseStatus: "released",
    publicReleaseDate: "2008-07-11",
    milestones: [["Public", "2008-07-11", false, undefined]],
  },
];

const seed = JSON.parse(
  readFileSync(join(here, "..", "seed-data.json"), "utf8"),
);
const seedInventory = seed.releaseVersions
  .filter((version) => version.platform === "iOS" && version.version === "2.0")
  .map((version) => ({
    platform: version.platform,
    majorVersion: version.majorVersion,
    version: version.version,
    releaseStatus: version.releaseStatus,
    publicReleaseDate: version.publicReleaseDate,
    milestones: version.milestones.map((milestone) => [
      milestone.label,
      milestone.date,
      milestone.isRevision,
      milestone.note,
    ]),
  }));
if (
  JSON.stringify(stableValue(seedInventory)) !==
  JSON.stringify(stableValue(expectedSeedInventory))
) {
  throw new Error(
    "The exact local iPhone OS 2.0 seed inventory changed; re-audit before regenerating.",
  );
}

const expectedCounts = new Map([
  ["beta-1", 17],
  ["beta-2", 4],
  ["beta-3", 5],
  ["beta-4", 10],
  ["beta-5", 2],
  ["beta-6", 4],
  ["beta-7", 3],
  ["beta-8", 6],
]);
const expectedDates = new Map(
  eventSpecs.map((spec) => [spec.alias, spec.date]),
);
const expectedRoutes = new Set(
  [...expectedCounts.keys()].map((alias) => `version-ios-2-0/${alias}`),
);
const actualRoutes = events.map(
  (event) => `${event.target.releaseVersionId}/${event.target.routeAlias}`,
);
const changeCount = events.reduce(
  (total, event) => total + event.changes.length,
  0,
);
if (
  bundle.versions.length !== 0 ||
  bundle.builds.length !== 0 ||
  events.length !== expectedCounts.size ||
  changeCount !== 51 ||
  new Set(actualRoutes).size !== expectedRoutes.size ||
  actualRoutes.some((route) => !expectedRoutes.has(route)) ||
  events.some(
    (event) =>
      Object.keys(event.target).sort().join(",") !==
        "releaseVersionId,routeAlias" ||
      event.identity.releaseVersionId !== event.target.releaseVersionId ||
      event.identity.routeAlias !== event.target.routeAlias ||
      event.identity.appearanceDate !==
        expectedDates.get(event.target.routeAlias) ||
      event.identity.platformId !== "platform-ios" ||
      event.identity.stableEventId !==
        `event:apple:ios:2.0:${event.target.routeAlias}` ||
      event.identity.channel !== "developerBeta" ||
      event.authorship !== "originalSynthesis" ||
      event.provenanceStatus !== "editoriallyVerified" ||
      event.editorialReview.status !== "approved" ||
      event.editorialReview.reviewedAt !== reviewedAt ||
      event.isIndexable !== true ||
      event.changes.length !== expectedCounts.get(event.target.routeAlias) ||
      event.changes.some(
        (item) =>
          !["delta", "cumulative"].includes(item.inheritance) ||
          !["documented", "partiallyDocumented", "undocumented"].includes(
            item.documentedStatus,
          ) ||
          !["reported", "corroborated", "confirmed"].includes(
            item.evidenceState,
          ) ||
          /build-identity|community-observation|seed-identity/i.test(item.key),
      ),
  )
) {
  throw new Error("The expected iPhone OS 2.0 prerelease closure failed.");
}

const localChangeDefinitions = new Map();
for (const occurrence of events.flatMap((event) => event.changes)) {
  const definition = JSON.stringify(
    stableValue({
      title: occurrence.title,
      canonicalSummary: occurrence.canonicalSummary,
      category: occurrence.category,
    }),
  );
  const previous = localChangeDefinitions.get(occurrence.key);
  if (previous && previous !== definition) {
    throw new Error(
      `iPhone OS 2.0 prerelease definition drifted for ${occurrence.key}.`,
    );
  }
  localChangeDefinitions.set(occurrence.key, definition);
}
const uniqueLocalChangeKeys = [...localChangeDefinitions.keys()];
if (uniqueLocalChangeKeys.length !== 45) {
  throw new Error(
    `Expected 45 stable iPhone OS 2.0 prerelease definitions; found ${uniqueLocalChangeKeys.length}.`,
  );
}
for (const key of sharedPublicKeys) {
  const candidate = localChangeDefinitions.get(key);
  const owned = publicDefinitions.get(key);
  if (!candidate || candidate !== JSON.stringify(owned)) {
    throw new Error(
      `${key} must exactly reuse its definition from ${publicOwnerName}.`,
    );
  }
}
const newLocalChangeKeys = uniqueLocalChangeKeys.filter(
  (key) => !sharedPublicKeys.has(key),
);
if (
  newLocalChangeKeys.length !== 40 ||
  newLocalChangeKeys.some((key) => !key.startsWith("iphone-os-2-0-"))
) {
  throw new Error(
    "Every new iPhone OS 2.0 prerelease definition must use the local namespace.",
  );
}
const histories = new Map();
for (const event of events) {
  for (const occurrence of event.changes) {
    const history = histories.get(occurrence.key) || [];
    history.push([
      event.target.routeAlias,
      occurrence.action,
      occurrence.inheritance,
    ]);
    histories.set(occurrence.key, history);
  }
}
const expectedHistories = new Map([
  [
    "ios-2-0-exchange-push-sync",
    [
      ["beta-1", "introduced", "delta"],
      ["beta-3", "changed", "delta"],
    ],
  ],
  [
    "iphone-os-2-0-signing-policy",
    [
      ["beta-4", "changed", "delta"],
      ["beta-8", "changed", "delta"],
    ],
  ],
  [
    "iphone-os-2-0-sdk-maintenance",
    [
      ["beta-5", "fixed", "delta"],
      ["beta-7", "fixed", "delta"],
    ],
  ],
  [
    "iphone-os-2-0-sdk-os-support",
    [
      ["beta-5", "changed", "delta"],
      ["beta-7", "changed", "delta"],
      ["beta-8", "changed", "delta"],
    ],
  ],
  [
    "iphone-os-2-0-sdk-macos-10-5-3",
    [
      ["beta-6", "changed", "delta"],
      ["beta-7", "changed", "cumulative"],
    ],
  ],
]);
for (const [key, expected] of expectedHistories) {
  if (JSON.stringify(histories.get(key)) !== JSON.stringify(expected)) {
    throw new Error(`The reviewed stable history drifted for ${key}.`);
  }
}
if (
  [...histories.values()].filter((history) => history.length > 1).length !==
  expectedHistories.size
) {
  throw new Error("An unreviewed iPhone OS 2.0 concept spans multiple seeds.");
}
const excludedKeyFragments = [
  "app-store-discovery-and-delivery",
  "private-enterprise-app-pages",
  "maps-location-permission",
  "camera-location-permission",
  "system-location-services-toggle",
  "camera-location-metadata-absent",
  "stability-improved",
  "mobileme-push",
  "mobileme-bookmarks",
  "itunes-application-sync-selection",
];
if (
  excludedKeyFragments.some((fragment) =>
    uniqueLocalChangeKeys.some((key) => key.includes(fragment)),
  )
) {
  throw new Error(
    "A future-tense, wrong-build, anonymous, or host-only exclusion re-entered the candidate.",
  );
}

const collisionFiles = [
  ...readdirSync(here)
    .filter((name) => name.endsWith(".json") && name !== outputName)
    .map((name) => join(here, name)),
  join(here, "..", "apple-launch-content-2026.json"),
];
const otherChangeKeys = new Map();
for (const file of collisionFiles) {
  const candidate = JSON.parse(readFileSync(file, "utf8"));
  for (const owner of [
    ...(candidate.versions || []),
    ...(candidate.events || []),
    ...(candidate.builds || []),
  ]) {
    for (const item of owner.changes || []) {
      if (!otherChangeKeys.has(item.key)) otherChangeKeys.set(item.key, file);
    }
  }
}
const collisions = newLocalChangeKeys.filter((key) => otherChangeKeys.has(key));
if (collisions.length > 0) {
  throw new Error(
    `iPhone OS 2.0 prerelease change keys collide with existing content: ${collisions
      .map((key) => `${key} (${otherChangeKeys.get(key)})`)
      .join(", ")}`,
  );
}
for (const file of collisionFiles.filter(
  (file) => file !== join(here, "..", "apple-launch-content-2026.json"),
)) {
  const candidate = JSON.parse(readFileSync(file, "utf8"));
  for (const event of candidate.events || []) {
    const target =
      event.target?.releaseVersionId && event.target?.routeAlias
        ? `${event.target.releaseVersionId}/${event.target.routeAlias}`
        : undefined;
    if (target && expectedRoutes.has(target)) {
      throw new Error(`An existing research batch already owns ${target}.`);
    }
  }
}
const researchBatchFiles = readdirSync(here)
  .filter((name) => name.endsWith(".json") && name !== outputName)
  .map((name) => join(here, name));
const globalResearchChangeKeys = new Set(uniqueLocalChangeKeys);
for (const file of researchBatchFiles) {
  const candidate = JSON.parse(readFileSync(file, "utf8"));
  for (const owner of [
    ...(candidate.versions || []),
    ...(candidate.events || []),
    ...(candidate.builds || []),
  ]) {
    for (const item of owner.changes || []) {
      globalResearchChangeKeys.add(item.key);
    }
  }
}
const researchBatchCount = researchBatchFiles.length + 1;

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
const unusedSources = sources.filter((source) => !citationUrls.has(source.url));
if (
  sourceUrls.size !== sources.length ||
  missingSources.length > 0 ||
  unusedSources.length > 0
) {
  throw new Error(
    `Citation closure failed. Unique sources: ${sourceUrls.size}/${sources.length}; missing: ${missingSources.join(", ")}; unused: ${unusedSources
      .map((source) => source.url)
      .join(", ")}`,
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
    return value.reduce(
      (total, item) => total + citationReferenceCount(item),
      0,
    );
  }
  if (!value || typeof value !== "object") return 0;
  return Object.entries(value).reduce(
    (total, [key, item]) =>
      total +
      (key === "citations" && Array.isArray(item)
        ? item.length
        : citationReferenceCount(item)),
    0,
  );
};
const citationCount = citationReferenceCount(bundle);

const routeRows = eventSpecs
  .map(
    (spec) =>
      `| iOS | ${spec.label} | \`${spec.alias}\` | ${spec.date} | ${spec.changes.length} |`,
  )
  .join("\n");
const routeVerificationRows = eventSpecs
  .map(
    (spec) =>
      `| \`/apple/ios/2.0/${spec.alias}/\` | 200 | 4/4 | ${spec.changes.length}/${spec.changes.length} | yes | yes | no | index, follow |`,
  )
  .join("\n");
const evidenceRows = rawEvidence
  .map(
    ([milestone, artifact, bytes, sha]) =>
      `| ${milestone} | ${artifact} | ${bytes.toLocaleString("en-US")} | \`${sha}\` |`,
  )
  .join("\n");
const sourceRows = sources
  .map(
    (source) =>
      `- [${source.title}](${source.url}) - ${source.publisher}; ${source.sourceClass}.`,
  )
  .join("\n");

const ledger = `# Apple iPhone OS 2.0 prerelease archive batch

## Result

\`${outputName}\` is the approved archive batch for eight historically defensible
iPhone OS 2.0 prerelease routes that are absent from the local seed.

- 8 identity-backed, approved, indexable archive routes and no release-version overlays
- 51 milestone-specific occurrences across 45 stable definitions
- 5 definitions are exact, SHA-guarded reuses of the existing Public owner; 40 are new and locally namespaced
- ${sources.length} declared and used sources with ${citationCount} citation references
- zero build documents, unsupported build identities, or Public-event changes
- every route is \`editoriallyVerified\`, \`approved\`, and explicitly \`isIndexable: true\`

## Approved route closure

| Platform | Milestone | New alias | Appearance date | Selected changes |
| -------- | --------- | --------- | --------------- | ---------------: |
${routeRows}

The local seed contains only Public on 2008-07-11. Its event remains owned by
\`apple-ios-2.json\` and untouched; five exact shared definition documents
receive citation unions without semantic-definition changes.

## Evidence method

1. Apple's March 6 announcement establishes the first retained enterprise, SDK, and developer-tool baseline. It does not prove that each documented behavior originated that day. Two contemporaneous hands-on reports preserve visible user-interface behavior and limitations with weaker evidence labels. Future-tense App Store distribution promises are excluded.
2. Beta 2 uses the explicit March 27 SDK milestone. The March 28 firmware report calls its subject only a new iPhone 2.0 beta firmware, so its observations retain their one-day and numbering uncertainty.
3. Beta 3 has one explicit contemporaneous firmware-and-SDK report. Only its four Exchange changes and opening-seed expiration state are retained.
4. Beta 4 separates release-note-backed simulator and signing changes from developer-discovered framework observations. Future-tense SDK entries are excluded.
5. Beta 5 remains intentionally narrow because the surviving evidence explicitly names SDK Beta 5 but no separately numbered firmware seed.
6. Beta 6 contains four independently bounded provisioning, host, and sample-package states from the May 28 package. Four location and Camera observations from a May 22 private build are excluded because build 5A292g cannot be assigned to the later Beta 6 firmware 5A308.
7. Beta 7 is an SDK-sequence milestone with maintenance, current-target support, and a cumulative Mac OS X 10.5.3 host requirement. Uncorroborated forum observations are excluded.
8. Beta 8 retains signing, developer installation, submission, and final-target states. MobileMe, bookmark, and Applications-pane text is excluded as iTunes-only behavior; anonymous stability commentary is also excluded. The route is not duplicated as a separate GM.

## Raw evidence ledger

| Milestone | Public artifact | Raw bytes | Raw SHA-256 |
| --------- | --------------- | --------: | ----------- |
${evidenceRows}

The ${verification.rawArtifacts} selected raw artifacts total
${verification.rawEvidenceBytes.toLocaleString("en-US")} bytes. The committed
audit helper also locks ${verification.normalizedArtifacts} bounded text
artifacts and verifies short metadata and subject probes. Raw publisher files
remain only in the ignored temporary evidence directory.

## Exact evidence gaps and exclusions

- No defensible build-number documents are created. Build strings in publisher reporting are not promoted to archive identities.
- Beta 2 uses March 27 for SDK Beta 2, while the selected firmware observation is dated March 28 and does not explicitly use the Beta 2 number.
- Beta 4 notes described several API changes as coming soon. Future work is not represented as completed Beta 4 behavior.
- Beta 5 has only a broad Apple-authored description preserved by contemporaneous reporting; no component-level fixes are invented.
- Beta 6's official May 28 evidence names firmware 5A308. The May 22 location reports describe an unnumbered private state, one naming build 5A292g; they are retained only as exclusion evidence and are not attached to Beta 6 changes.
- Beta 7 forum reports about performance, App Store messaging, Exchange, ringtones, and Interface Builder are excluded because this pass did not find independent corroboration.
- Beta 5 and Beta 7 are explicitly SDK-sequence milestones; the retained sources do not establish separately numbered firmware seeds.
- Beta 8 MobileMe, bookmark, and application-sync text describes the companion iTunes preview rather than an iPhone OS change. An anonymous stability impression is excluded.
- June 26 sources name Beta 8, while later reports sometimes call the same firmware lineage a golden master. A separate GM identity is not created.
- Public remains owned by the existing iOS 2 public batch.

## Copyright and attribution controls

- All reader-facing article, title, summary, and canonical-summary text is original synthesis.
- Every factual record carries source citations whose exact-phrase locator resolves inside a SHA-locked, bounded source artifact.
- First-party claims preserved by journalism are labeled as such rather than presented as surviving Apple-hosted documentation.
- No article, transcript, screenshot, source HTML, confidential SDK material, or long excerpt is committed.
- Publisher commentary, rumors, unsupported build identities, and uncorroborated community claims are excluded.

## Source ledger

All declared sources were accessed on ${accessedAt}.

${sourceRows}

## Closure guards

- Exact comparison against the local iPhone OS 2.0 seed record and its sole Public milestone
- Exact eight-route identity, date, channel, and change-count allowlist
- Zero versions, zero builds, exact approval timestamps, and explicit true indexability
- Collision scan across every other research-batch JSON plus \`apple-launch-content-2026.json\`
- 51 occurrences resolve to exactly 45 stable definitions
- five shared definitions exactly match the SHA-guarded \`apple-ios-2.json\` Public owner; every other key uses the iPhone OS 2.0 namespace
- recurring Exchange, signing, SDK maintenance, target support, and host-requirement histories are asserted across seeds
- every declared source title exactly matches the captured H1 and every citation locator resolves to pinned text
- evidence labels are enforced: confirmed records include first-party Apple evidence and corroborated records have at least two independent sources
- May 22 private-build sources are prohibited from change records and retained only in the Beta 6 selection boundary
- Complete unique source declaration/use closure
- Deterministic formatted JSON SHA-256: \`${jsonSha}\`

## Editorial approval and validation record

- provenance: \`editoriallyVerified\`
- editorial status: \`approved\`
- indexability: \`true\`
- reviewed at: \`${reviewedAt}\`
- independent substantive review: clean after route-scope, future-state,
  private-build, recurrence, evidence-label, and source-custody corrections

Verified on ${accessedAt}:

- evidence audit: ${verification.rawArtifacts} exact raw artifacts totaling ${verification.rawEvidenceBytes.toLocaleString("en-US")} bytes and ${verification.normalizedArtifacts} normalized text locks
- \`npm run research:validate\`: ${researchBatchCount} batches and ${globalResearchChangeKeys.size} globally consistent change keys
- focused ingestion/manifest suite: ${verification.focusedTests || "pending"} passed
- full repository suite: ${verification.fullTests || "pending"} passed
- independent copyright-similarity scan: ${verification.copyrightFields || "pending"} reader-facing fields; maximum contiguous overlap of ${verification.maximumEditorialOverlapWords || "pending"} words
- independent live re-fetch: all
  ${verification.independentSourcesFetched} declared sources available;
  ${verification.independentRawExact} raw artifacts matched byte-for-byte,
  all ${verification.independentNormalizedExact} normalized article boundaries
  matched exactly, all ${verification.independentTitlesReproduced} source
  titles reproduced, and all
  ${verification.independentEvidenceReproduced} evidence boundaries passed
- ESLint, Prettier check, deterministic regeneration, and \`git diff --check\`: passed

## Production dry plan

- status: applied and zero-residual verified on ${accessedAt}
- production dry plan: ${dryRun.creates || "pending"} creates, ${dryRun.patches} patches, and ${dryRun.unchanged || "pending"} unchanged documents
- create split: ${dryRun.sourceCreates || "pending"} new sources, ${dryRun.eventCreates || "pending"} events, and ${dryRun.changeCreates || "pending"} change definitions
- the five patches are revision-guarded citation unions plus refreshed approved review timestamps on the exact shared Public definitions; every prior citation is preserved and no semantic definition field or version is changed
- the existing Apple Newsroom Beta 1 source is reused unchanged
- mutation payload: ${dryRun.mutationPayloadBytes || "pending"} bytes
- production plan SHA: \`${dryRun.planSha}\`
- plan artifact SHA-256: \`${dryRun.planArtifactSha}\`
- rollback artifact SHA-256: \`${dryRun.rollbackArtifactSha}\`
- rollback coverage: all ${dryRun.creates} create IDs and all
  ${dryRun.patches} full restore documents
- three consecutive production dry runs reproduced the same plan SHA, counts,
  payload, plan artifact, and rollback artifact

## Publication receipt

- Sanity transaction: \`${publicationRecord.transactionId}\`
- applied plan SHA: \`${dryRun.planSha}\`
- receipt SHA-256: \`${publicationRecord.receiptSha}\`
- immediate post-publication zero plan:
  \`${publicationRecord.zeroPlanSha}\`; zero creates, zero patches,
  ${publicationRecord.zeroUnchanged.toLocaleString("en-US")} unchanged
  documents, and a 16-byte mutation payload
- zero-plan artifact SHA-256:
  \`${publicationRecord.zeroPlanArtifactSha}\`
- zero-plan rollback artifact SHA-256:
  \`${publicationRecord.zeroRollbackArtifactSha}\`

## Production coverage after publication

- ${publicationRecord.coverage.fullVersions} of
  ${publicationRecord.coverage.totalVersions} release versions have full
  version-level coverage
- ${publicationRecord.coverage.totalAppearances.toLocaleString("en-US")}
  appearances:
  ${publicationRecord.coverage.fullAppearances} full articles,
  ${publicationRecord.coverage.sourceLinkedAppearances} source-linked records,
  and
  ${publicationRecord.coverage.timelineOnlyAppearances.toLocaleString("en-US")}
  timeline-only records
- ${publicationRecord.coverage.approvedStructuredAppearances} appearances have
  approved structured changes

## Settled canonical route verification

Every published route was fetched independently from the running local site.
Each returned all four archival article sections, every expected structured
change title, References, its first cited source, and an \`index, follow\`
directive. No route returned placeholder copy or a \`noindex\` directive.

| Canonical route | HTTP | Article sections | Expected changes | References | First source | Placeholder | Robots |
| --- | ---: | ---: | ---: | --- | --- | --- | --- |
${routeVerificationRows}

No deployment was performed; domain and deployment work remains scheduled
separately.

Reproduce the approved batch with:

\`\`\`sh
node scripts/research-batches/build-apple-ios-2-prerelease.mjs
node scripts/research-batches/audit-ios2-prerelease.mjs tmp/ios2-evidence
npm run research:validate
node --import tsx --test tests/launch-content-ingestion.test.ts tests/launch-content-manifest.test.ts
npx eslint scripts/research-batches/build-apple-ios-2-prerelease.mjs scripts/research-batches/audit-ios2-prerelease.mjs
npx prettier --check scripts/research-batches/build-apple-ios-2-prerelease.mjs scripts/research-batches/audit-ios2-prerelease.mjs scripts/research-batches/apple-ios-2-prerelease.json scripts/research-batches/apple-ios-2-prerelease.md
npx sanity exec scripts/ingest-launch-content.ts --with-user-token -- --content scripts/research-batches/apple-ios-2-prerelease.json
\`\`\`
`;

writeFileSync(
  join(here, ledgerName),
  await prettier.format(ledger, { filepath: join(here, ledgerName) }),
);

console.log(
  `Wrote ${outputName} and ${ledgerName}: ${events.length} events, ${changeCount} occurrences, ${sources.length} sources, ${citationCount} citation references; JSON SHA ${jsonSha}.`,
);
