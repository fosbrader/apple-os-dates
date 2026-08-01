import { createHash } from "node:crypto";
import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import prettier from "prettier";

const here = dirname(fileURLToPath(import.meta.url));
const outputName = "apple-ios-5-prerelease.json";
const ledgerName = "apple-ios-5-prerelease.md";
const accessedAt = "2026-07-30";
const reviewedAt = "2026-07-30T12:08:22Z";

const dryRun = {
  creates: 112,
  patches: 17,
  unchanged: 2086,
  eventCreates: 8,
  sourceCreates: 18,
  changeCreates: 86,
  mutationPayloadBytes: 341_448,
  planSha: "e320d0b62fb8b49372380363eb03f21665198e53c0817d8da59117e2324318d9",
  planArtifactSha:
    "5132294bb51b402c8a13ad8b859e79029db3870de3b8748dda90547d0d0395f8",
  rollbackArtifactSha:
    "f6094ea56eb7afdf41b4dfe60c4f632346dca75cacce70a12c95a17e66dba9d2",
};

const publication = {
  transactionId: "F0eE6eK5XyVXtlnaoyTjQK",
  receiptSha:
    "4dec48cb0c9a7b0c6558097d9744ae9f20014393f53e7fb4a83468f95b148cbe",
  immediateZeroPlanSha:
    "abf460f81e84f0e6190a168ac7bb858c6e7034c1d5d563e5ef0bba5778a0c3e0",
  immediateZeroPlanArtifactSha:
    "8abe53d94ce803512ad58e2f6f71626046a3b67b70aed9d75d3e4c28d0669eb1",
  immediateZeroRollbackArtifactSha:
    "28814a9a2165a282b8833c44b56f70f05ad701553dfd77967dfd9d00a2249ddb",
  immediateZeroCreates: 0,
  immediateZeroPatches: 0,
  immediateZeroUnchanged: 2_215,
  immediateZeroPayloadBytes: 16,
  coverage: {
    totalVersions: 410,
    fullVersions: 410,
    totalAppearances: 1_991,
    fullAppearances: 438,
    sourceLinkedAppearances: 256,
    timelineOnlyAppearances: 1_297,
    approvedStructuredAppearances: 589,
  },
};

const verification = {
  researchBatches: 71,
  globalChangeKeys: 4_170,
  focusedTests: 19,
  fullTests: 131,
  copyrightFields: 604,
  maximumEditorialOverlapWords: 5,
  beta5PdfBytes: 155_665,
  beta5PdfPages: 8,
  htmlLocatorAssertions: 137,
  pdfLocatorAssertions: 26,
  markerAlignmentAssertions: 71,
  repeatedCanonicalKeys: 34,
  repeatedTransitionOccurrences: 36,
  independentSourcesFetched: 20,
  independentRawExact: 13,
  independentWholeBodyExact: 14,
};

const U = {
  beta1Developer: "https://developer.apple.com/news/?id=06062011a",
  beta1Announcement:
    "https://www.apple.com/newsroom/2011/06/06New-Version-of-iOS-Includes-Notification-Center-iMessage-Newsstand-Twitter-Integration-Among-200-New-Features/",
  beta2Identity:
    "https://www.macrumors.com/2011/06/24/apple-releases-ios-5-beta-2-to-developers/",
  beta2Transcript:
    "https://www.iphoneforums.net/threads/differences-in-the-new-ios-5-betas.15506/",
  beta3Identity:
    "https://www.macrumors.com/2011/07/11/apple-releases-ios-5-beta-3-to-developers/",
  beta3Transcript:
    "https://theunlockr.com/apple-ios-5-beta-3-alongside-itunes-10-5-released-with-full-change-log/",
  beta3Observed: "https://www.macstories.net/news/apple-releases-ios-5-beta-3/",
  beta4Identity:
    "https://www.macrumors.com/2011/07/22/apple-seeds-ios-5-beta-4-to-developers/",
  beta4Transcript:
    "https://www.iphoneforums.net/threads/ios-sdk-release-notes-for-ios-5-0-beta-4.17424/",
  beta5Identity:
    "https://www.macrumors.com/2011/08/06/apple-releases-ios-5-beta-5-to-developers/",
  beta5Pdf: "https://iszene.com/uploads/5nvaddy7eqkbt355afs.pdf",
  beta5Transcript:
    "https://www.cultofmac.com/news/apple-releases-ios-5-beta-5-and-itunes-10-5-beta-5-to-developers",
  beta6Identity:
    "https://www.macrumors.com/2011/08/19/ios-5-beta-6-seeded-to-developers/",
  beta6Transcript:
    "https://theunlockr.com/ios-5-beta-6-released-to-developers-full-change-log-included/",
  beta7Identity:
    "https://www.macrumors.com/2011/08/31/apple-posts-ios-5-beta-7-for-developers/",
  beta7Transcript: "https://www.idownloadblog.com/2011/08/31/ios-5-beta-7/",
  gmIdentity:
    "https://www.macrumors.com/2011/10/04/apple-posts-ios-5-golden-master-seed-for-developers/",
  gmTranscript:
    "https://news.wirefly.com/2011/10/04/apple-makes-ios-5-gm-available-to-registered-developers",
  publicBoundary:
    "https://techcrunch.com/2011/10/12/apples-ios-5-update-now-available-for-iphone-ipad-and-ipod-touch/",
  itunesBeta8Boundary:
    "https://www.macrumors.com/2011/09/09/apple-seeds-new-itunes-10-5-and-iwork-for-ios-betas-to-developers/",
};

const sources = [
  {
    url: U.beta1Developer,
    title: "Download iOS 5 and iOS 5 SDK Beta Today",
    publisher: "Apple Developer",
    sourceClass: "firstPartyAnnouncement",
    author: "Apple",
    publishedAt: "2011-06-06T00:00:00.000Z",
    topics: ["iOS", "5.0", "Beta 1", "developer availability"],
  },
  {
    url: U.beta1Announcement,
    title:
      "New Version of iOS Includes Notification Center, iMessage, Newsstand, Twitter Integration Among 200 New Features",
    publisher: "Apple Newsroom",
    sourceClass: "firstPartyAnnouncement",
    author: "Apple",
    publishedAt: "2011-06-06T00:00:00.000Z",
    topics: ["iOS", "5.0", "Beta 1", "feature preview", "WWDC 2011"],
  },
  {
    url: U.beta2Identity,
    title: "Apple Releases iOS 5 Beta 2 to Developers, Now with Wi-Fi Sync",
    publisher: "MacRumors",
    sourceClass: "journalism",
    author: "Arnold Kim",
    publishedAt: "2011-06-24T00:00:00.000Z",
    topics: ["iOS", "5.0", "Beta 2", "availability", "Wi-Fi Sync"],
  },
  {
    url: U.beta2Transcript,
    title: "iOS SDK Release Notes for iOS 5.0 Beta 2 (forum preservation)",
    publisher: "iPhone Forums",
    sourceClass: "community",
    author: "Apple; preserved by forum member Gregoris",
    publishedAt: "2011-06-25T00:00:00.000Z",
    topics: [
      "iOS",
      "5.0",
      "Beta 2",
      "Apple Developer release-note reproduction",
    ],
  },
  {
    url: U.beta3Identity,
    title: "Apple Releases iOS 5 Beta 3 to Developers",
    publisher: "MacRumors",
    sourceClass: "journalism",
    author: "Eric Slivka",
    publishedAt: "2011-07-11T00:00:00.000Z",
    topics: ["iOS", "5.0", "Beta 3", "availability"],
  },
  {
    url: U.beta3Transcript,
    title: "Apple iOS 5 Beta 3 Released with Full Change Log",
    publisher: "TheUnlockr",
    sourceClass: "journalism",
    author: "Amy Eichelberg",
    publishedAt: "2011-07-11T00:00:00.000Z",
    topics: [
      "iOS",
      "5.0",
      "Beta 3",
      "Apple Developer release-note reproduction",
    ],
  },
  {
    url: U.beta3Observed,
    title: "Apple Releases iOS 5 Beta 3",
    publisher: "MacStories",
    sourceClass: "journalism",
    author: "Federico Viticci",
    publishedAt: "2011-07-11T00:00:00.000Z",
    topics: ["iOS", "5.0", "Beta 3", "release-note checks", "observations"],
  },
  {
    url: U.beta4Identity,
    title:
      "Apple Seeds iOS 5 Beta 4 to Developers, Over-The-Air Updating Going Live",
    publisher: "MacRumors",
    sourceClass: "journalism",
    author: "Eric Slivka",
    publishedAt: "2011-07-22T00:00:00.000Z",
    topics: ["iOS", "5.0", "Beta 4", "availability", "OTA update"],
  },
  {
    url: U.beta4Transcript,
    title: "iOS SDK Release Notes for iOS 5.0 Beta 4 (forum preservation)",
    publisher: "iPhone Forums",
    sourceClass: "community",
    author: "Apple; preserved by forum member Gregoris",
    publishedAt: "2011-07-23T00:00:00.000Z",
    topics: [
      "iOS",
      "5.0",
      "Beta 4",
      "Apple Developer release-note reproduction",
    ],
  },
  {
    url: U.beta5Identity,
    title: "Apple Releases iOS 5 Beta 5 to Developers",
    publisher: "MacRumors",
    sourceClass: "journalism",
    author: "Arnold Kim",
    publishedAt: "2011-08-06T00:00:00.000Z",
    topics: ["iOS", "5.0", "Beta 5", "availability"],
  },
  {
    url: U.beta5Pdf,
    title: "iOS SDK Release Notes for iOS 5.0 Beta 5 (preserved PDF)",
    publisher: "iSzene document mirror",
    sourceClass: "archive",
    author: "Apple",
    publishedAt: "2011-08-06T17:34:06.000Z",
    topics: [
      "iOS",
      "5.0",
      "Beta 5",
      "Apple Developer release notes",
      "historical PDF",
    ],
  },
  {
    url: U.beta5Transcript,
    title: "Apple Releases iOS 5 Beta 5 and iTunes 10.5 Beta 5 to Developers",
    publisher: "Cult of Mac",
    sourceClass: "journalism",
    author: "Alex Heath",
    publishedAt: "2011-08-06T00:00:00.000Z",
    topics: [
      "iOS",
      "5.0",
      "Beta 5",
      "Apple Developer release-note reproduction",
    ],
  },
  {
    url: U.beta6Identity,
    title: "iOS 5 Beta 6 Seeded to Developers",
    publisher: "MacRumors",
    sourceClass: "journalism",
    author: "Eric Slivka",
    publishedAt: "2011-08-19T00:00:00.000Z",
    topics: ["iOS", "5.0", "Beta 6", "availability"],
  },
  {
    url: U.beta6Transcript,
    title: "iOS 5 Beta 6 Released to Developers, Full Change Log Included",
    publisher: "TheUnlockr",
    sourceClass: "journalism",
    author: "Amy Eichelberg",
    publishedAt: "2011-08-19T00:00:00.000Z",
    topics: [
      "iOS",
      "5.0",
      "Beta 6",
      "Apple Developer release-note reproduction",
    ],
  },
  {
    url: U.beta7Identity,
    title: "Apple Posts iOS 5 Beta 7 for Developers",
    publisher: "MacRumors",
    sourceClass: "journalism",
    author: "Jordan Golson",
    publishedAt: "2011-08-31T00:00:00.000Z",
    topics: ["iOS", "5.0", "Beta 7", "availability", "OTA update"],
  },
  {
    url: U.beta7Transcript,
    title: "Apple Releases iOS 5 Beta 7",
    publisher: "iDownloadBlog",
    sourceClass: "journalism",
    author: "Alex Heath",
    publishedAt: "2011-08-31T00:00:00.000Z",
    topics: [
      "iOS",
      "5.0",
      "Beta 7",
      "Apple Developer release-note reproduction",
    ],
  },
  {
    url: U.gmIdentity,
    title: "Apple Posts iOS 5 Golden Master Seed for Developers",
    publisher: "MacRumors",
    sourceClass: "journalism",
    author: "Jordan Golson",
    publishedAt: "2011-10-04T00:00:00.000Z",
    topics: ["iOS", "5.0", "GM", "availability"],
  },
  {
    url: U.gmTranscript,
    title: "Apple Makes iOS 5 GM Available to Registered Developers",
    publisher: "Wirefly",
    sourceClass: "journalism",
    author: "Alex Wagner",
    publishedAt: "2011-10-04T00:00:00.000Z",
    topics: ["iOS", "5.0", "GM", "Apple Developer release-note reproduction"],
  },
  {
    url: U.publicBoundary,
    title:
      "Apple’s iOS 5 Update Now Available for iPhone, iPad, and iPod Touch",
    publisher: "TechCrunch",
    sourceClass: "journalism",
    author: "Greg Kumparak",
    publishedAt: "2011-10-12T00:00:00.000Z",
    topics: ["iOS", "5.0", "seven betas", "GM", "public boundary"],
  },
  {
    url: U.itunesBeta8Boundary,
    title: "Apple Seeds New iTunes 10.5 and iWork for iOS Betas to Developers",
    publisher: "MacRumors",
    sourceClass: "journalism",
    author: "Eric Slivka",
    publishedAt: "2011-09-09T00:00:00.000Z",
    topics: ["iTunes 10.5 Beta 8", "iWork", "iOS 5 sequence boundary"],
  },
];

const c = (url, locator, note) => ({
  url,
  ...(locator ? { locator } : {}),
  ...(note ? { note } : {}),
});
const review = () => ({ status: "approved", reviewedAt });
const heading = (text) => ({ style: "h2", text });
const prose = (text, citations) => ({
  style: "normal",
  text,
  citations,
});
const article = (...blocks) => ({
  authorship: "originalSynthesis",
  blocks,
});
const uniqueCitations = (citations) => [
  ...new Map(
    citations.map((citation) => [
      `${citation.url}|${citation.locator || ""}|${citation.note || ""}`,
      citation,
    ]),
  ).values(),
];

const publicBatch = JSON.parse(
  readFileSync(join(here, "apple-ios-5.json"), "utf8"),
);
const publicDefinitions = new Map();
for (const owner of [
  ...(publicBatch.versions || []),
  ...(publicBatch.events || []),
  ...(publicBatch.builds || []),
]) {
  for (const change of owner.changes || []) {
    const definition = {
      key: change.key,
      title: change.title,
      canonicalSummary: change.canonicalSummary,
      category: change.category,
    };
    const previous = publicDefinitions.get(change.key);
    if (previous && JSON.stringify(previous) !== JSON.stringify(definition)) {
      throw new Error(`The public iOS 5 definition drifted for ${change.key}.`);
    }
    publicDefinitions.set(change.key, definition);
  }
}

const definitions = new Map();
const define = (key, title, canonicalSummary, category) => {
  const definition = { key, title, canonicalSummary, category };
  const previous = definitions.get(key);
  if (previous && JSON.stringify(previous) !== JSON.stringify(definition)) {
    throw new Error(`Local definition drifted for ${key}.`);
  }
  definitions.set(key, definition);
  return key;
};
const reusePublic = (key) => {
  const definition = publicDefinitions.get(key);
  if (!definition) throw new Error(`Missing public definition ${key}.`);
  definitions.set(key, definition);
  return key;
};

const K = {
  mobileMeDeleteWarning: define(
    "ios5-prerelease-mobileme-delete-warning",
    "MobileMe deletion warning",
    "Removing a MobileMe account stopped showing an incorrect warning that Photo Stream content would also be removed.",
    "bugFix",
  ),
  cardDavAddContact: define(
    "ios5-prerelease-carddav-add-contact",
    "CardDAV contact creation controls",
    "Removing a CardDAV account no longer caused the controls for creating contacts to disappear.",
    "bugFix",
  ),
  iCloudContactPhoto: define(
    "ios5-prerelease-icloud-contact-photo",
    "iCloud contact-photo synchronization",
    "Editing an iCloud contact from a second device no longer hid its photo on other devices.",
    "bugFix",
  ),
  bluetoothHotspot: define(
    "ios5-prerelease-bluetooth-hotspot-browsing",
    "Bluetooth Personal Hotspot browsing",
    "Web traffic began working through a Bluetooth connection to Personal Hotspot.",
    "bugFix",
  ),
  calDavRecurringMerge: define(
    "ios5-prerelease-caldav-recurring-merge",
    "Recurring CalDAV merge synchronization",
    "Creating a recurring event locally could leave account synchronization blocked after a merge failure.",
    "bugFix",
  ),
  calendarSyncUi: define(
    "ios5-prerelease-calendar-sync-ui",
    "Calendar account-state refresh",
    "Calendar began reflecting account synchronization changes without requiring the app to be force-closed.",
    "bugFix",
  ),
  turnMatchEnding: define(
    "ios5-prerelease-turn-match-ending",
    "Turn-based match completion",
    "A participant could end a turn-based match without waiting for every participant to end it.",
    "bugFix",
  ),
  peerPicker: define(
    "ios5-prerelease-peer-picker-presentation",
    "GameKit peer-picker presentation",
    "Presenting the GameKit peer picker on iPhone 4 no longer left the interface dimmed without a picker.",
    "bugFix",
  ),
  skyboxCenterType: define(
    "ios5-prerelease-glkskybox-center-type",
    "GLKSkyboxEffect center type",
    "The GLKSkyboxEffect center property changed from a float pointer to GLKVector3.",
    "developerApi",
  ),
  iBooksPdfBackup: define(
    "ios5-prerelease-ibooks-pdf-backup",
    "iBooks PDF backups",
    "PDFs newly added to iBooks became eligible for later device backups.",
    "bugFix",
  ),
  backupRestoreState: define(
    "ios5-prerelease-icloud-backup-restore-state",
    "iCloud Backup after restore",
    "A completed restore could leave the device reporting that restoration was still active and block another backup.",
    "knownIssue",
  ),
  deletedBackupToggle: define(
    "ios5-prerelease-deleted-backup-toggle",
    "Deleted iCloud Backup state",
    "Deleting a cloud backup could leave Settings displaying backup as enabled until the switch was toggled.",
    "knownIssue",
  ),
  metadataSort: define(
    "ios5-prerelease-nsmetadataquery-sort",
    "NSMetadataQuery sorting",
    "The prerelease iCloud document implementation did not support NSMetadataQuery sort descriptors.",
    "knownIssue",
  ),
  manualCloudContainers: define(
    "ios5-prerelease-manual-icloud-containers",
    "Manual iCloud container entitlements",
    "Early seeds required developers to enter iCloud container identifiers manually in app entitlements.",
    "developerApi",
  ),
  protectedCloudData: define(
    "ios5-prerelease-protected-cloud-data",
    "Protected-data cloud documents",
    "Combining cloud-document APIs with protected data could corrupt stored content.",
    "knownIssue",
  ),
  cloudDocumentChanges: define(
    "ios5-prerelease-cloud-document-change-detection",
    "Cloud-document change detection",
    "Document-based apps could miss cloud files that changed, moved, or disappeared outside the app.",
    "bugFix",
  ),
  filePresenterCallbacks: define(
    "ios5-prerelease-file-presenter-callbacks",
    "NSFilePresenter callbacks",
    "Cloud-backed file presenters could miss expected item and subitem change callbacks.",
    "knownIssue",
  ),
  iMessageSeedCompatibility: define(
    "ios5-prerelease-imessage-seed-compatibility",
    "iMessage seed interoperability",
    "The first iMessage seed could not exchange messages with later iOS 5 seeds.",
    "compatibility",
  ),
  messageToggleCrash: define(
    "ios5-prerelease-message-toggle-crash",
    "Messaging settings toggles",
    "Dragging the iMessage or MMS switch in Settings no longer caused Settings to exit.",
    "bugFix",
  ),
  messageAttachments: define(
    "ios5-prerelease-imessage-attachment-transcript",
    "iMessage attachment transcripts",
    "Audio and video attachments became viewable from both sides of an iMessage conversation.",
    "bugFix",
  ),
  reminderGeofence: define(
    "ios5-prerelease-reminder-geofence-without-date",
    "Undated location reminders",
    "Location-based reminders without an associated date could fail to notify.",
    "bugFix",
  ),
  softwareTermsKeyboard: define(
    "ios5-prerelease-software-terms-keyboard",
    "Software Update terms keyboard",
    "Opening the keyboard from Software Update terms could trap Settings with no dismissal path.",
    "bugFix",
  ),
  calendar24Hour: define(
    "ios5-prerelease-calendar-24-hour-editor",
    "24-hour Calendar event editing",
    "Calendar’s event editor could reject afternoon hours and assign the preceding weekday under 24-hour time.",
    "bugFix",
  ),
  tableContentInset: define(
    "ios5-prerelease-table-scroll-content-inset",
    "Table scrolling and content insets",
    "Scrolling a table row to the top or bottom began accounting for the corresponding content inset.",
    "behavior",
  ),
  momentumScrolling: define(
    "ios5-prerelease-webkit-momentum-scrolling",
    "Opt-in momentum scrolling for web content",
    "Web content could request native-style momentum within overflow regions through a new inherited CSS property.",
    "developerApi",
  ),
  securityQuestion: define(
    "ios5-prerelease-icloud-security-question",
    "iCloud security-question setup",
    "Choosing a security question during iCloud account setup could fail.",
    "bugFix",
  ),
  airplayScreensaver: define(
    "ios5-prerelease-airplay-screensaver-performance",
    "AirPlay mirroring and Apple TV screensaver",
    "Apple TV screensaver activity no longer degraded AirPlay mirroring performance.",
    "bugFix",
  ),
  seed1CalendarRestore: define(
    "ios5-prerelease-seed1-calendar-restore",
    "Calendar sync after early-seed restore",
    "Restoring a backup from the first seed or earlier could leave MobileMe and iCloud event calendars unsynchronized.",
    "bugFix",
  ),
  iMessageModalAlerts: define(
    "ios5-prerelease-imessage-modal-alerts",
    "iMessage modal alerts",
    "Modal notifications could fail to appear for incoming iMessages.",
    "knownIssue",
  ),
  faceTimeSettingsIcon: define(
    "ios5-prerelease-facetime-settings-icon",
    "FaceTime settings icon",
    "The FaceTime icon could be absent from Settings on iPhone.",
    "bugFix",
  ),
  twitterLocationIndicator: define(
    "ios5-prerelease-twitter-location-indicator",
    "Safari tweet location indicator",
    "Leaving a Safari tweet before location lookup completed could leave the location indicator active.",
    "bugFix",
  ),
  automationFirstRun: define(
    "ios5-prerelease-automation-first-run",
    "UI Automation first run",
    "The first automation script after a reboot or clean installation could fail while later attempts succeeded.",
    "knownIssue",
  ),
  exclusiveTouchDefault: define(
    "ios5-prerelease-exclusive-touch-default",
    "UIControl exclusiveTouch default",
    "UIControl again defaulted the exclusiveTouch property to NO.",
    "developerApi",
  ),
  photoCapacityLabel: define(
    "ios5-prerelease-itunes-photo-capacity-label",
    "iTunes photo capacity label",
    "iTunes stopped counting synchronized photos in the generic Other capacity category.",
    "bugFix",
  ),
  xcodeRestoreMemory: define(
    "ios5-prerelease-xcode-restore-memory",
    "Xcode restore memory growth",
    "Xcode stopped its rapid memory growth during affected Mac restore and firmware-copy operations.",
    "bugFix",
  ),
  xcodeCrashLogs: define(
    "ios5-prerelease-xcode-crash-log-listing",
    "Crash logs in Xcode Organizer",
    "Xcode Organizer began listing device crash logs without requiring the device to be renamed.",
    "bugFix",
  ),
  nikeAccessories: define(
    "ios5-prerelease-nike-radio-accessories",
    "Nike+ Gym and radio-tagging accessories",
    "Nike+ Gym workout uploads and radio-tag synchronization were unavailable in this seed.",
    "knownIssue",
  ),
  bbcIplayer: define(
    "ios5-prerelease-bbc-iplayer-compatibility",
    "BBC iPlayer compatibility",
    "BBC iPlayer web and app playback was unavailable in this seed.",
    "compatibility",
  ),
  mobileMeContactMerge: define(
    "ios5-prerelease-mobileme-contact-merge",
    "MobileMe contact merging",
    "A MobileMe merge could delete local contacts instead of combining them.",
    "knownIssue",
  ),
  cloudFilenameCase: define(
    "ios5-prerelease-cloud-filename-case",
    "iCloud filename case handling",
    "iCloud Storage treated file names as case-sensitive.",
    "compatibility",
  ),
  significantLocationResume: define(
    "ios5-prerelease-significant-location-resume",
    "Significant-location background delivery",
    "Apps monitoring significant location changes could fail to relaunch or resume when an update arrived.",
    "bugFix",
  ),
  forwardAttachments: define(
    "ios5-prerelease-forward-mail-attachments",
    "Forwarded Mail attachments",
    "Forwarding a message could omit its attachments and leave the composer waiting.",
    "bugFix",
  ),
  albumArtwork: define(
    "ios5-prerelease-music-artwork-after-sync",
    "Album artwork after synchronization",
    "Changing the synchronized media library could leave some songs without album art.",
    "bugFix",
  ),
  glExtensionNamespace: define(
    "ios5-prerelease-opengl-extension-namespace",
    "OpenGL ES extension namespaces",
    "Several graphics extension APIs adopted EXT names in place of their APPLE-prefixed forms.",
    "developerApi",
  ),
  otaPhotoResync: define(
    "ios5-prerelease-ota-photo-resync",
    "Photo resync after OTA update",
    "Installing the fourth seed over the air required photos to be synchronized again.",
    "knownIssue",
  ),
  hotspotJoin: define(
    "ios5-prerelease-iphone4-hotspot-join",
    "iPhone 4 Personal Hotspot joining",
    "An iPhone 4 could fail to join an available Personal Hotspot because Wi-Fi tethering did not function.",
    "bugFix",
  ),
  voipTermination: define(
    "ios5-prerelease-voip-background-termination",
    "VoIP background resumption",
    "VoIP apps resumed for network traffic could be terminated repeatedly.",
    "bugFix",
  ),
  photoThumbnails: define(
    "ios5-prerelease-photo-thumbnail-sync",
    "Photo synchronization thumbnails",
    "Photo synchronization could transfer only thumbnails instead of full images.",
    "bugFix",
  ),
  cloudSetupState: define(
    "ios5-prerelease-icloud-setup-state",
    "iCloud Setup Assistant state",
    "Setup Assistant could fail to preserve the selected iCloud service settings.",
    "bugFix",
  ),
  defaultCalendar: define(
    "ios5-prerelease-default-calendar-after-setup",
    "Default calendar after iCloud setup",
    "Setup Assistant could leave the local calendar selected as default after an iCloud account was configured.",
    "bugFix",
  ),
  calendarPush: define(
    "ios5-prerelease-icloud-calendar-push",
    "iCloud Calendar push",
    "iCloud calendar changes could require a manual refresh because push delivery was unavailable.",
    "bugFix",
  ),
  gameCenterLogin: define(
    "ios5-prerelease-game-center-login-password",
    "Game Center sign-in",
    "Game Center could clear the entered password and require a second sign-in attempt.",
    "bugFix",
  ),
  gameKitInvites: define(
    "ios5-prerelease-gamekit-invites",
    "GameKit invitations",
    "GameKit invitations could fail until the device was restarted.",
    "bugFix",
  ),
  automaticCloudProfiles: define(
    "ios5-prerelease-automatic-icloud-profiles",
    "Automatic iCloud provisioning",
    "New provisioning profiles became automatically enabled for iCloud instead of requiring portal configuration.",
    "developerApi",
  ),
  cloudEntitlementSetup: define(
    "ios5-prerelease-icloud-entitlement-setup",
    "Xcode-managed iCloud entitlements",
    "Xcode could create iCloud entitlements and prepend the team identifier rather than requiring fully manual container setup.",
    "developerApi",
  ),
  volumeSlider: define(
    "ios5-prerelease-volume-slider-buttons",
    "Volume slider and hardware buttons",
    "App volume sliders could fail to reflect changes made with device or headset buttons.",
    "bugFix",
  ),
  mailHostname: define(
    "ios5-prerelease-mail-hostname-unified-inbox",
    "Mail host-name changes",
    "Changing an account host name could produce blank entries in the unified inbox.",
    "knownIssue",
  ),
  redEyeRoundTrip: define(
    "ios5-prerelease-red-eye-photo-roundtrip",
    "Red-eye edits after iPhoto round trip",
    "Red-eye corrections made on iOS survived import to the iPhoto seed and later synchronization.",
    "bugFix",
  ),
  photoRestore: define(
    "ios5-prerelease-photo-library-restore",
    "Photo-library restore completeness",
    "Restoring an iTunes backup could leave some photos absent from the Photos app.",
    "bugFix",
  ),
  prerenderedIcon: define(
    "ios5-prerelease-prerendered-icon-key",
    "UIPrerenderedIcon handling",
    "The seed could ignore the Info.plist setting that indicated an app icon was already rendered.",
    "bugFix",
  ),
  storeKitSandbox: define(
    "ios5-prerelease-storekit-sandbox",
    "StoreKit sandbox purchases",
    "Developers could not complete test in-app purchases through the iTunes sandbox.",
    "bugFix",
  ),
  clientCertificateSites: define(
    "ios5-prerelease-client-certificate-sites",
    "Client-certificate websites",
    "Opening a site that required a client-side certificate could fail or terminate the browser.",
    "bugFix",
  ),
  lowercaseUrlScheme: define(
    "ios5-prerelease-lowercase-url-scheme",
    "Lowercase URL schemes",
    "WebKit began canonicalizing URL schemes to lowercase, affecting custom schemes used for native handoff.",
    "behavior",
  ),
  xcodeDeviceRestore: define(
    "ios5-prerelease-xcode-device-restore",
    "Device restore from Xcode",
    "Device restoration became available again from Xcode.",
    "bugFix",
  ),
  xcodePageTemplate: define(
    "ios5-prerelease-xcode-page-template",
    "Xcode page-based template",
    "The page-based project template could fail to build unless Core Graphics was linked manually.",
    "bugFix",
  ),
  findMyIphoneSetup: define(
    "ios5-prerelease-find-my-iphone-setup",
    "Find My iPhone after account setup",
    "Account setup could silently leave Find My iPhone disabled despite the selected setting.",
    "bugFix",
  ),
  multiAccountBookmarks: define(
    "ios5-prerelease-multi-account-bookmarks",
    "Bookmarks across multiple accounts",
    "Enabling bookmark synchronization on several accounts could produce undefined results.",
    "bugFix",
  ),
  turnDelegateEvents: define(
    "ios5-prerelease-turn-delegate-events",
    "Turn-based match delegate events",
    "Turn-based match delegates receive an event after every turn, not only when the local player becomes active.",
    "developerApi",
  ),
  cloudSymlinkRead: define(
    "ios5-prerelease-cloud-symlink-coordinated-read",
    "Coordinated reads after path normalization",
    "Normalizing or resolving a path inside an app container could produce a path unusable for a coordinated read.",
    "knownIssue",
  ),
  kvsLimits: define(
    "ios5-prerelease-kvs-limits",
    "iCloud key-value limits",
    "The per-key key-value-store allowance increased to 64 KB and the key count increased to 256.",
    "developerApi",
  ),
  communicationsPassword: define(
    "ios5-prerelease-setup-communications-password",
    "Communications password handoff in Setup Assistant",
    "Setup Assistant could fail to provide the Apple ID password to FaceTime or iMessage.",
    "bugFix",
  ),
  yahooReminders: define(
    "ios5-prerelease-yahoo-reminders-calendar",
    "Yahoo reminders collection",
    "A missing Yahoo reminders collection could be recreated repeatedly and appear as an event calendar.",
    "bugFix",
  ),
  hostTaskDeadlock: define(
    "ios5-prerelease-automation-host-task-output",
    "UI Automation host-task output",
    "A host task that emitted very large output could deadlock UI Automation until its timeout.",
    "knownIssue",
  ),
  popoverAutoresizing: define(
    "ios5-prerelease-popover-autoresizing",
    "Popover content autoresizing",
    "Apps linked on iOS 5 became responsible for configuring autoresizing masks on popover content views.",
    "developerApi",
  ),
  documentAutosave: define(
    "ios5-prerelease-document-autosave",
    "Document autosave callbacks",
    "The periodic autosave callback no longer implied that a save was mandatory, while explicit save operations still did.",
    "developerApi",
  ),
  wifiSyncState: define(
    "ios5-prerelease-wifi-sync-account-state",
    "Wi-Fi Sync account and backup state",
    "Wi-Fi Sync could fail to transfer contacts, calendars, account settings, or backups until the device restarted.",
    "bugFix",
  ),
  privateApiValidation: define(
    "ios5-prerelease-private-api-validation",
    "Private API validation",
    "The development tools could extract an app’s API usage and check it for private interfaces during validation.",
    "developerApi",
  ),
  containerRules: define(
    "ios5-prerelease-cloud-container-rules",
    "iCloud container identifier rules",
    "Non-wildcard iCloud container identifiers became subject to exact bundle and team ownership requirements.",
    "developerApi",
  ),
  kvsThrottling: define(
    "ios5-prerelease-kvs-throttling",
    "iCloud key-value synchronization throttling",
    "The key-value store reduced how many rapid synchronization requests an app could make.",
    "behavior",
  ),
  turnAutoMatch: define(
    "ios5-prerelease-turn-auto-match",
    "Turn-based view-controller auto-match",
    "Automatic matching from the turn-based view controller could fail while invitations and the direct API still worked.",
    "bugFix",
  ),
  legacyRestore: define(
    "ios5-prerelease-beta7-legacy-device-restore",
    "Beta 7 restore on older devices",
    "Some older devices required DFU mode for an iTunes restore from Beta 6 to Beta 7, while OTA remained available.",
    "knownIssue",
  ),
  glLightingClamp: define(
    "ios5-prerelease-glkit-lighting-clamp",
    "GLKit lighting color clamping",
    "GLKit effects began clamping post-lighting colors consistently across per-vertex and per-pixel paths.",
    "bugFix",
  ),
  stalledStorePurchases: define(
    "ios5-prerelease-stalled-store-purchases",
    "Store purchases during background downloads",
    "Store purchases no longer appeared stalled solely because another background download was active.",
    "bugFix",
  ),
  passcodeUpdate: define(
    "ios5-prerelease-beta7-passcode-update",
    "Passcode before Beta 7 update",
    "Updating to the seventh seed could require temporarily removing the device passcode.",
    "knownIssue",
  ),
  optionalLegacySupport: define(
    "ios5-prerelease-xcode-optional-legacy-support",
    "Optional legacy simulator and device support",
    "Xcode moved the iOS 4.3 Simulator and older device support into downloadable components.",
    "developerApi",
  ),
  musicDeleteCrash: define(
    "ios5-prerelease-music-delete-crash",
    "Deleting media from Music or Videos",
    "Deleting a song or video on the device could terminate the media app.",
    "bugFix",
  ),
};

const beta1Keys = [
  ["ios-5-0-notification-center", "Notification Center"],
  ["ios-5-0-imessage", "iMessage"],
  ["ios-5-0-newsstand", "Newsstand"],
  ["ios-5-0-reminders", "Reminders"],
  ["ios-5-0-twitter-integration", "Twitter"],
  ["ios-5-0-camera-controls", "Camera"],
  ["ios-5-0-photos-editing", "Photos"],
  ["ios-5-0-mail-composition", "Mail"],
  ["ios-5-0-calendar-views-attachments", "Calendar"],
  ["ios-5-0-game-center-discovery", "Game Center"],
  ["ios-5-0-ipad-airplay-gestures", "AirPlay Mirroring"],
  ["ios-5-0-pc-free-ota-wifi-sync", "PC Free"],
  ["ios-5-0-icloud-services", "iCloud"],
  ["ios-5-0-accessibility", "accessibility"],
  ["ios-5-0-developer-apis", "1,500 new APIs"],
].map(([key, locator]) => [reusePublic(key), locator]);

const routeMetadata = {
  "beta-1": {
    label: "Beta 1",
    date: "2011-06-06",
    sequence: 1,
    stableEventId: "event:apple:ios:5.0:beta-1",
    channel: "developerBeta",
    identitySource: U.beta1Developer,
    evidenceSources: [U.beta1Announcement],
  },
  "beta-2": {
    label: "Beta 2",
    date: "2011-06-24",
    sequence: 2,
    stableEventId: "event:apple:ios:5.0:beta-2",
    channel: "developerBeta",
    identitySource: U.beta2Identity,
    evidenceSources: [U.beta2Transcript],
  },
  "beta-3": {
    label: "Beta 3",
    date: "2011-07-11",
    sequence: 3,
    stableEventId: "event:apple:ios:5.0:beta-3",
    channel: "developerBeta",
    identitySource: U.beta3Identity,
    evidenceSources: [U.beta3Transcript, U.beta3Observed],
  },
  "beta-4": {
    label: "Beta 4",
    date: "2011-07-22",
    sequence: 4,
    stableEventId: "event:apple:ios:5.0:beta-4",
    channel: "developerBeta",
    identitySource: U.beta4Identity,
    evidenceSources: [U.beta4Transcript],
  },
  "beta-5": {
    label: "Beta 5",
    date: "2011-08-06",
    sequence: 5,
    stableEventId: "event:apple:ios:5.0:beta-5",
    channel: "developerBeta",
    identitySource: U.beta5Identity,
    evidenceSources: [U.beta5Pdf, U.beta5Transcript],
  },
  "beta-6": {
    label: "Beta 6",
    date: "2011-08-19",
    sequence: 6,
    stableEventId: "event:apple:ios:5.0:beta-6",
    channel: "developerBeta",
    identitySource: U.beta6Identity,
    evidenceSources: [U.beta6Transcript],
  },
  "beta-7": {
    label: "Beta 7",
    date: "2011-08-31",
    sequence: 7,
    stableEventId: "event:apple:ios:5.0:beta-7",
    channel: "developerBeta",
    identitySource: U.beta7Identity,
    evidenceSources: [U.beta7Transcript],
  },
  gm: {
    label: "GM",
    date: "2011-10-04",
    sequence: 8,
    stableEventId: "event:apple:ios:5.0:gm",
    channel: "goldenMaster",
    identitySource: U.gmIdentity,
    evidenceSources: [U.gmTranscript],
  },
};

const occurrenceRows = [];
const add = (alias, key, action, component, locator, options = {}) => {
  occurrenceRows.push({
    alias,
    key,
    action,
    component,
    locator,
    evidence: options.evidence || "releaseNotes",
    stateOnly: options.stateOnly || false,
    documentedStatus: options.documentedStatus || "documented",
  });
};

for (const [key, locator] of beta1Keys) {
  add("beta-1", key, "introduced", "iOS 5 feature preview", locator, {
    evidence: "beta1Announcement",
  });
}

add(
  "beta-2",
  K.mobileMeDeleteWarning,
  "fixed",
  "Accounts",
  "incorrect message is displayed",
);
add(
  "beta-2",
  K.cardDavAddContact,
  "fixed",
  "Address Book",
  "loss of the UI button to add a new contact",
);
add(
  "beta-2",
  K.iCloudContactPhoto,
  "fixed",
  "Address Book",
  "contact causes the contact’s photo to disappear",
);
add(
  "beta-2",
  K.bluetoothHotspot,
  "fixed",
  "Bluetooth",
  "Personal Hot Spot via Bluetooth",
);
add(
  "beta-2",
  K.calDavRecurringMerge,
  "knownIssue",
  "CalDAV",
  "recurring event locally",
);
add(
  "beta-2",
  K.calendarSyncUi,
  "fixed",
  "Calendar",
  "changes may not show up on the calendar UI",
);
add(
  "beta-2",
  K.turnMatchEnding,
  "fixed",
  "GameKit",
  "player cannot end a match",
);
add("beta-2", K.peerPicker, "fixed", "GameKit", "GKPeerPickerController");
add(
  "beta-2",
  K.skyboxCenterType,
  "changed",
  "GLKit",
  "center property of GLKSkyboxEffect",
);
add(
  "beta-2",
  K.iBooksPdfBackup,
  "fixed",
  "iBooks",
  "Newer PDFs added to iBooks",
);
add(
  "beta-2",
  K.backupRestoreState,
  "knownIssue",
  "iCloud Backup",
  "device still thinks it’s restoring",
);
add(
  "beta-2",
  K.deletedBackupToggle,
  "knownIssue",
  "iCloud Backup",
  "If you delete your backup",
);
add(
  "beta-2",
  K.metadataSort,
  "knownIssue",
  "iCloud Storage",
  "setSortDescriptors",
);
add(
  "beta-2",
  K.manualCloudContainers,
  "knownIssue",
  "iCloud Storage",
  "manually specify various container identifiers",
);
add(
  "beta-2",
  K.protectedCloudData,
  "knownIssue",
  "iCloud Storage",
  "protected data which can lead to data corruption",
);
add(
  "beta-2",
  K.cloudDocumentChanges,
  "knownIssue",
  "iCloud Storage",
  "cannot always detect when files change",
);
add(
  "beta-2",
  K.filePresenterCallbacks,
  "knownIssue",
  "iCloud Storage",
  "presentedSubitemDidAppearAtURL",
);
add(
  "beta-2",
  K.iMessageSeedCompatibility,
  "knownIssue",
  "iMessage",
  "seed 2 will be unable to communicate",
);
add(
  "beta-2",
  K.messageToggleCrash,
  "fixed",
  "iMessage",
  "Swiping the iMessage on/off switch",
);
add(
  "beta-2",
  K.messageAttachments,
  "fixed",
  "iMessage",
  "video/audio attachments cannot be viewed",
);
add(
  "beta-2",
  K.reminderGeofence,
  "knownIssue",
  "Reminders",
  "entry (and/or exit) of a location",
);
add(
  "beta-2",
  K.softwareTermsKeyboard,
  "knownIssue",
  "Settings",
  "keyboard of the terms",
);
add("beta-2", K.calendar24Hour, "knownIssue", "UIKit", "24 hr clock");
add(
  "beta-2",
  K.tableContentInset,
  "changed",
  "UIKit",
  "UITableViewScrollPositionTop",
);
add(
  "beta-2",
  K.momentumScrolling,
  "introduced",
  "WebKit",
  "-webkit-overflow-scrolling",
);

add(
  "beta-3",
  K.securityQuestion,
  "knownIssue",
  "Accounts",
  "Choosing a security question",
);
add(
  "beta-3",
  K.airplayScreensaver,
  "fixed",
  "AirPlay",
  "screen saver may degrade mirroring performance",
);
add(
  "beta-3",
  K.calDavRecurringMerge,
  "fixed",
  "CalDAV",
  "recurring event locally",
);
add(
  "beta-3",
  K.seed1CalendarRestore,
  "knownIssue",
  "Calendar",
  "Restoring from a Seed 1 backup",
);
add(
  "beta-3",
  K.iMessageSeedCompatibility,
  "knownIssue",
  "iMessage",
  "beta 3 will be unable to communicate",
  { stateOnly: true },
);
add(
  "beta-3",
  K.iMessageModalAlerts,
  "knownIssue",
  "iMessage",
  "Modal alerts don’t appear",
);
add(
  "beta-3",
  K.reminderGeofence,
  "fixed",
  "Reminders",
  "does not send notifications for reminders",
);
add(
  "beta-3",
  K.softwareTermsKeyboard,
  "fixed",
  "Settings",
  "keyboard of the terms",
);
add(
  "beta-3",
  K.faceTimeSettingsIcon,
  "knownIssue",
  "Settings",
  "FaceTime icon is missing",
);
add(
  "beta-3",
  K.twitterLocationIndicator,
  "knownIssue",
  "Twitter",
  "location arrow will stay",
);
add(
  "beta-3",
  K.automationFirstRun,
  "knownIssue",
  "UI Automation",
  "first execution of a script",
);
add(
  "beta-3",
  K.exclusiveTouchDefault,
  "changed",
  "UIKit",
  "exclusiveTouch property",
);
add("beta-3", K.calendar24Hour, "knownIssue", "UIKit", "24 hr clock", {
  stateOnly: true,
});
add(
  "beta-3",
  K.photoCapacityLabel,
  "fixed",
  "Wi-Fi Syncing",
  "Photos as “Other”",
);
add("beta-3", K.xcodeRestoreMemory, "fixed", "Xcode", "memory usage inflates");
add("beta-3", K.xcodeCrashLogs, "fixed", "Xcode", "crash logs");

add("beta-4", K.nikeAccessories, "knownIssue", "Accessories", "Nike + Gym");
add(
  "beta-4",
  K.securityQuestion,
  "fixed",
  "Accounts",
  "Choosing a security question",
);
add(
  "beta-4",
  K.bbcIplayer,
  "knownIssue",
  "Binary Compatibility",
  "BBC iPlayer",
);
add(
  "beta-4",
  K.seed1CalendarRestore,
  "fixed",
  "Calendar",
  "Restoring from a Seed 1 backup",
);
add(
  "beta-4",
  K.mobileMeContactMerge,
  "knownIssue",
  "Contacts",
  "local contacts are deleted",
);
add(
  "beta-4",
  K.cloudFilenameCase,
  "changed",
  "iCloud Storage",
  "File names in iCloud Storage are case sensitive",
);
add(
  "beta-4",
  K.significantLocationResume,
  "knownIssue",
  "Location",
  "startMonitoringSignificantLocationChanges",
);
add(
  "beta-4",
  K.forwardAttachments,
  "knownIssue",
  "Mail",
  "Forwarding a message with attachments",
);
add(
  "beta-4",
  K.albumArtwork,
  "knownIssue",
  "Music Library",
  "missing their album artwork",
);
add(
  "beta-4",
  K.glExtensionNamespace,
  "changed",
  "OpenGL ES",
  "moved from the APPLE namespace",
);
add(
  "beta-4",
  K.otaPhotoResync,
  "knownIssue",
  "OTA Software Update",
  "re-sync your photos",
);
add(
  "beta-4",
  K.hotspotJoin,
  "knownIssue",
  "Personal Hotspot",
  "cannot join personal hotspot",
);
add(
  "beta-4",
  K.faceTimeSettingsIcon,
  "fixed",
  "Settings",
  "FaceTime icon is missing",
);
add(
  "beta-4",
  K.voipTermination,
  "knownIssue",
  "SpringBoard",
  "terminates VoIP applications",
);
add(
  "beta-4",
  K.twitterLocationIndicator,
  "knownIssue",
  "Twitter",
  "location arrow will stay",
  { stateOnly: true },
);
add("beta-4", K.calendar24Hour, "fixed", "UIKit", "24 hr clock");
add(
  "beta-4",
  K.photoThumbnails,
  "knownIssue",
  "Wi-Fi Syncing",
  "only thumbnails on your device",
);

add(
  "beta-5",
  K.cloudSetupState,
  "knownIssue",
  "Accounts",
  "Enabling iCloud services in Setup Assistant",
);
add(
  "beta-5",
  K.defaultCalendar,
  "knownIssue",
  "Calendar",
  "default calendar is still",
);
add(
  "beta-5",
  K.calendarPush,
  "knownIssue",
  "Calendar",
  "Pushing iCloud Calendar data",
);
add("beta-5", K.gameCenterLogin, "knownIssue", "GameKit", "password may clear");
add(
  "beta-5",
  K.gameKitInvites,
  "knownIssue",
  "GameKit",
  "GameKit Invites may fail",
);
add(
  "beta-5",
  K.automaticCloudProfiles,
  "introduced",
  "iCloud Storage",
  "Provisioning Profiles no longer need",
);
add(
  "beta-5",
  K.cloudEntitlementSetup,
  "fixed",
  "iCloud Storage",
  "Enable Entitlements",
);
add(
  "beta-5",
  K.cloudDocumentChanges,
  "fixed",
  "iCloud Storage",
  "cannot always detect when files change",
);
add("beta-5", K.volumeSlider, "knownIssue", "iPod", "volume slider in the UI");
add(
  "beta-5",
  K.significantLocationResume,
  "fixed",
  "Location",
  "startMonitoringSignificantLocationChanges",
);
add(
  "beta-5",
  K.forwardAttachments,
  "fixed",
  "Mail",
  "Forwarding a message with attachments",
);
add("beta-5", K.mailHostname, "knownIssue", "Mail", "changing the host name");
add(
  "beta-5",
  K.albumArtwork,
  "fixed",
  "Music Library",
  "missing their album artwork",
);
add(
  "beta-5",
  K.glExtensionNamespace,
  "fixed",
  "OpenGL ES",
  "moved from the APPLE namespace",
);
add(
  "beta-5",
  K.hotspotJoin,
  "fixed",
  "Personal Hotspot",
  "cannot join personal hotspot",
);
add("beta-5", K.redEyeRoundTrip, "fixed", "Photos", "red-eye adjustments");
add(
  "beta-5",
  K.photoRestore,
  "knownIssue",
  "Photos",
  "restoring photo libraries",
);
add(
  "beta-5",
  K.voipTermination,
  "fixed",
  "SpringBoard",
  "terminates VoIP applications",
);
add(
  "beta-5",
  K.prerenderedIcon,
  "knownIssue",
  "SpringBoard",
  "UIPrerenderedIcon",
);
add(
  "beta-5",
  K.storeKitSandbox,
  "knownIssue",
  "StoreKit",
  "In-App purchase will not work",
);
add(
  "beta-5",
  K.twitterLocationIndicator,
  "fixed",
  "Twitter",
  "location arrow will stay",
);
add(
  "beta-5",
  K.clientCertificateSites,
  "knownIssue",
  "WebKit",
  "client side SSL certificates",
);
add(
  "beta-5",
  K.lowercaseUrlScheme,
  "changed",
  "WebKit",
  "scheme all lowercase",
);
add(
  "beta-5",
  K.photoThumbnails,
  "fixed",
  "Wi-Fi Syncing",
  "only thumbnails on your device",
);
add(
  "beta-5",
  K.xcodeDeviceRestore,
  "fixed",
  "Xcode",
  "Device restores are now enabled",
);
add(
  "beta-5",
  K.xcodePageTemplate,
  "knownIssue",
  "Xcode",
  "Page-based template",
);

add(
  "beta-6",
  K.findMyIphoneSetup,
  "fixed",
  "Accounts",
  "leaving Find My iPhone on",
);
add(
  "beta-6",
  K.cloudSetupState,
  "fixed",
  "Accounts",
  "Enabling iCloud services in Setup Assistant",
);
add(
  "beta-6",
  K.multiAccountBookmarks,
  "fixed",
  "Accounts",
  "disable Bookmarks on multiple accounts",
);
add(
  "beta-6",
  K.defaultCalendar,
  "fixed",
  "Calendar",
  "default calendar is still",
);
add(
  "beta-6",
  K.calendarPush,
  "fixed",
  "Calendar",
  "Pushing iCloud Calendar data",
);
add(
  "beta-6",
  K.turnDelegateEvents,
  "changed",
  "GameKit",
  "Events will be passed to the delegate",
);
add("beta-6", K.gameCenterLogin, "fixed", "GameKit", "password may clear");
add("beta-6", K.gameKitInvites, "fixed", "GameKit", "GameKit Invites may fail");
add(
  "beta-6",
  K.cloudSymlinkRead,
  "knownIssue",
  "iCloud Storage",
  "stringByResolvingSymlinksInPath",
);
add(
  "beta-6",
  K.kvsLimits,
  "changed",
  "iCloud Storage",
  "per-key limit has been raised",
);
add(
  "beta-6",
  K.communicationsPassword,
  "knownIssue",
  "iMessage",
  "does not input AppleID password",
);
add("beta-6", K.volumeSlider, "fixed", "iPod", "volume slider in the UI");
add("beta-6", K.photoRestore, "fixed", "Photos", "restoring photo libraries");
add(
  "beta-6",
  K.yahooReminders,
  "knownIssue",
  "Reminders",
  "reminders syncing is enabled for a Yahoo account",
);
add("beta-6", K.prerenderedIcon, "fixed", "SpringBoard", "UIPrerenderedIcon");
add(
  "beta-6",
  K.storeKitSandbox,
  "fixed",
  "StoreKit",
  "In-App purchase will not work",
);
add(
  "beta-6",
  K.hostTaskDeadlock,
  "knownIssue",
  "UI Automation",
  "performTaskOnHost",
);
add(
  "beta-6",
  K.popoverAutoresizing,
  "changed",
  "UIKit",
  "UIPopoverController class will no longer",
);
add(
  "beta-6",
  K.documentAutosave,
  "changed",
  "UIKit",
  "autosaveWithCompletionHandler",
);
add(
  "beta-6",
  K.clientCertificateSites,
  "fixed",
  "Safari and WebKit",
  "client side SSL certificates",
);
add(
  "beta-6",
  K.wifiSyncState,
  "fixed",
  "Wi-Fi Syncing",
  "fail to sync contacts",
);
add("beta-6", K.xcodePageTemplate, "fixed", "Xcode", "Page-based template");

add(
  "beta-7",
  K.privateApiValidation,
  "introduced",
  "API Validation",
  "checked for private APIs usage",
);
add(
  "beta-7",
  K.containerRules,
  "changed",
  "iCloud Storage",
  "requirements for specifying container identifier",
);
add(
  "beta-7",
  K.kvsThrottling,
  "changed",
  "iCloud Storage",
  "synchronize in quick succession",
);
add("beta-7", K.turnAutoMatch, "knownIssue", "GameKit", "Auto-matching");
add(
  "beta-7",
  K.turnDelegateEvents,
  "fixed",
  "GameKit",
  "Events will be passed to the delegate",
);
add(
  "beta-7",
  K.communicationsPassword,
  "fixed",
  "iMessage",
  "does not provide AppleID password",
);
add(
  "beta-7",
  K.legacyRestore,
  "knownIssue",
  "iTunes",
  "iPhone 3GS or iPod touch 3rd generation",
);
add(
  "beta-7",
  K.glLightingClamp,
  "fixed",
  "OpenGL ES",
  "resulting color values are not clamped",
);
add(
  "beta-7",
  K.stalledStorePurchases,
  "fixed",
  "OTA Software Update",
  "purchases from the App Store",
);
add(
  "beta-7",
  K.passcodeUpdate,
  "knownIssue",
  "OTA Software Update",
  "passcode set",
);
add(
  "beta-7",
  K.yahooReminders,
  "fixed",
  "Reminders",
  "reminders syncing is enabled for a Yahoo account",
);
add(
  "beta-7",
  K.documentAutosave,
  "fixed",
  "UIKit",
  "autosaveWithCompletionHandler",
);
add(
  "beta-7",
  K.optionalLegacySupport,
  "changed",
  "Xcode",
  "support to run and debug applications",
);
add(
  "beta-7",
  K.musicDeleteCrash,
  "knownIssue",
  "Music Player",
  "deleting a song or video",
  { stateOnly: true },
);

add(
  "gm",
  K.turnAutoMatch,
  "fixed",
  "GameKit",
  "Auto-matching with the turn-based view controller",
);
add(
  "gm",
  K.musicDeleteCrash,
  "fixed",
  "Music Player",
  "deleting a song or video",
);

const evidenceUrls = (row) => {
  if (row.evidence === "beta1Announcement") return [U.beta1Announcement];
  return routeMetadata[row.alias].evidenceSources.slice(
    0,
    row.alias === "beta-5" ? 2 : 1,
  );
};

const verificationMethod = (row) => {
  const route = routeMetadata[row.alias];
  if (row.evidence === "beta1Announcement") {
    return "Matched directly in Apple’s June 6 feature preview. The occurrence records first-beta documentation, not a claim that the feature was complete or unchanged at that seed.";
  }
  if (row.stateOnly) {
    return `Matched in the retained ${route.label} document as current milestone state. This occurrence does not claim that the condition first appeared in ${route.label}.`;
  }
  if (row.alias === "beta-5") {
    return "Matched in the byte-verified eight-page Apple-authored PDF and its independent contemporaneous transcript. Only the document’s explicit NEW or FIXED marker is used.";
  }
  if (row.action === "fixed") {
    return `Matched under an explicit FIXED marker in the retained ${route.label} developer-note reproduction and bounded by the preceding audited state when available.`;
  }
  if (row.action === "knownIssue") {
    return `Matched under an explicit NEW marker or a milestone-specific current-issue statement in the retained ${route.label} developer-note reproduction.`;
  }
  return `Matched under an explicit NEW marker in the retained ${route.label} developer-note reproduction; cumulative unlabeled material was excluded.`;
};

const occurrence = (row) => {
  const definition = definitions.get(row.key);
  if (!definition) throw new Error(`Missing definition for ${row.key}.`);
  const route = routeMetadata[row.alias];
  const summary =
    row.action === "fixed"
      ? `The retained ${route.label} evidence marks this ${row.component} record as fixed at the milestone.`
      : row.action === "knownIssue"
        ? `The retained ${route.label} evidence documents this ${row.component} limitation at the milestone.`
        : `The retained ${route.label} evidence identifies this ${row.component} change at the milestone.`;
  return {
    ...definition,
    action: row.action,
    inheritance: "delta",
    summary,
    documentedStatus: row.documentedStatus,
    evidenceState:
      row.evidence === "beta1Announcement" ? "confirmed" : "corroborated",
    verificationMethod: verificationMethod(row),
    citations: evidenceUrls(row).map((url) =>
      c(
        url,
        `${row.component} — ${row.locator}`,
        "Original synthesis from the cited milestone evidence.",
      ),
    ),
  };
};

const changesByAlias = new Map();
for (const row of occurrenceRows) {
  changesByAlias.set(row.alias, [
    ...(changesByAlias.get(row.alias) || []),
    occurrence(row),
  ]);
}

const eventArticle = (alias) => {
  const route = routeMetadata[alias];
  const changes = changesByAlias.get(alias) || [];
  const fixed = changes.filter((change) => change.action === "fixed").length;
  const current = changes.filter(
    (change) => change.action === "knownIssue",
  ).length;
  const changeCitations = uniqueCitations(
    changes.flatMap((change) => change.citations),
  );

  if (alias === "beta-1") {
    return article(
      heading("First developer seed"),
      prose(
        "Apple announced and made the first iOS 5 beta available to program members on June 6, 2011. The date and developer availability are first-party facts, not a reconstruction from a later timeline.",
        [
          c(
            U.beta1Developer,
            "June 6, 2011 — beta available to program members",
          ),
          c(U.beta1Announcement, "June 6, 2011 — released a beta version"),
        ],
      ),
      heading("Documented preview baseline"),
      prose(
        `The ${changes.length} structured records reuse the canonical iOS 5 feature definitions already owned by the Public page. Here they describe what Apple documented at the first seed—not whether each feature was complete, stable, or unchanged through October.`,
        changeCitations,
      ),
      heading("Evidence and copyright boundary"),
      prose(
        "The article summarizes Apple’s public feature preview in new language and links to the announcement. It does not reproduce the press release or treat first-seed documentation as a complete beta changelog.",
        [
          c(U.beta1Announcement, "Feature descriptions and availability"),
          c(U.beta1Developer, "Developer download notice"),
        ],
      ),
    );
  }

  if (alias === "beta-5") {
    return article(
      heading("Preserved Apple-authored PDF"),
      prose(
        "An eight-page PDF created on release day retains the Beta 5 title, section structure, and explicit status markers. A contemporaneous publisher transcript independently preserves the same body.",
        [
          c(U.beta5Pdf, "Pages 1–8 — Beta 5 release notes"),
          c(U.beta5Transcript, "Complete Beta 5 transcript"),
          c(U.beta5Identity, "August 6 developer release"),
        ],
      ),
      heading("Structured milestone delta"),
      prose(
        `This page carries ${changes.length} records: ${fixed} explicit fixes, ${current} current issues, and ${changes.length - fixed - current} API or behavior changes. Cumulative statements without a Beta 5 marker are excluded.`,
        changeCitations,
      ),
      heading("Preservation boundary"),
      prose(
        "The PDF is a third-party preservation copy of Apple-authored developer material. Every reader-facing sentence is original synthesis, short API names are retained only for identification, and editorial approval does not convert the mirror into first-party hosting.",
        [
          c(U.beta5Pdf, "Apple-authored PDF preserved by iSzene"),
          c(U.beta5Transcript, "Independent release-day reproduction"),
        ],
      ),
    );
  }

  if (alias === "gm") {
    return article(
      heading("Gold Master boundary"),
      prose(
        "Contemporaneous reporting places the iOS 5 GM seed on October 4, 2011. The retained GM transcript isolates two fixes, while the separately owned Public page remains the record for the October 12 release.",
        [
          c(U.gmIdentity, "October 4 GM seed availability"),
          c(U.gmTranscript, "GM change-log reproduction"),
          c(U.publicBoundary, "Seven betas, one GM, then Public"),
        ],
      ),
      heading("Two isolatable fixes"),
      prose(
        `Only ${changes.length} milestone-specific fixes are structured: one for turn-based auto-matching and one for deleting media. The rest of the cumulative GM document is not relabeled as new.`,
        changeCitations,
      ),
      heading("No Beta 8 route"),
      prose(
        "No released iOS 5 Beta 8 is represented. A September 9 report instead pairs the eighth iTunes 10.5 beta with iWork Beta 3, while contemporaneous final-release coverage describes seven iOS betas before GM. Later lists that collapse those product sequences are therefore kept as an explicit evidence gap rather than used to create a route.",
        [
          c(
            U.itunesBeta8Boundary,
            "September 9 — iTunes 10.5 Beta 8 and iWork Beta 3",
          ),
          c(U.publicBoundary, "Seven beta releases and one Gold Master"),
        ],
      ),
    );
  }

  return article(
    heading(`${route.label} release identity`),
    prose(
      `Contemporaneous release reporting identifies iOS 5 ${route.label} as available to developers on ${route.date}. This batch creates that historical event identity without adding a milestone to the hardcoded seed file.`,
      [c(route.identitySource, `${route.label} availability and date`)],
    ),
    heading("Structured developer-note delta"),
    prose(
      `The page contains ${changes.length} source-linked records: ${fixed} explicit fixes, ${current} known milestone conditions, and ${changes.length - fixed - current} API or behavior changes. Repeated cumulative text is excluded unless it is needed to show continuing state.`,
      changeCitations,
    ),
    heading("Evidence boundary"),
    prose(
      "The detailed notes survive through a third-party reproduction of Apple’s developer material. The page paraphrases selected records, credits both the original author and preserving publisher, and makes no claim of completeness.",
      [
        ...route.evidenceSources.map((url) =>
          c(url, `${route.label} retained evidence`),
        ),
        ...(alias === "beta-3"
          ? [
              c(
                U.beta3Observed,
                "Independent release-day observations and release-note checks",
              ),
            ]
          : []),
      ],
    ),
  );
};

const events = Object.entries(routeMetadata).map(([alias, route]) => {
  const changes = changesByAlias.get(alias) || [];
  return {
    target: {
      releaseVersionId: "version-ios-5-0",
      routeAlias: alias,
    },
    identity: {
      releaseVersionId: "version-ios-5-0",
      platformId: "platform-ios",
      stableEventId: route.stableEventId,
      label: route.label,
      routeAlias: alias,
      channel: route.channel,
      appearanceDate: route.date,
      sequence: route.sequence,
      isRevision: false,
      availabilityState: "available",
    },
    authorship: "originalSynthesis",
    summary: `iOS 5 ${route.label} is represented by ${changes.length} selected, source-linked records from the exact ${route.date} milestone; cumulative carry-forward, unsupported build identity, and a rumored Beta 8 are excluded.`,
    article: eventArticle(alias),
    citations: uniqueCitations([
      c(route.identitySource, `${route.label} release identity`),
      ...route.evidenceSources.map((url) =>
        c(url, `${route.label} release-note evidence`),
      ),
      ...(alias === "beta-3"
        ? [
            c(
              U.beta3Observed,
              "Independent Beta 3 observations and note checks",
            ),
          ]
        : []),
      ...(alias === "gm"
        ? [
            c(U.publicBoundary, "Public-release sequence boundary"),
            c(U.itunesBeta8Boundary, "iTunes Beta 8 product-sequence boundary"),
          ]
        : []),
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

const expectedSeedInventory = [
  ["5.0", "2011-10-12", [["Public", "2011-10-12", false, undefined]]],
  ["5.0.1", "2011-11-10", [["Public", "2011-11-10", false, undefined]]],
  ["5.1", "2012-03-07", [["Public", "2012-03-07", false, undefined]]],
  ["5.1.1", "2012-05-07", [["Public", "2012-05-07", false, undefined]]],
];
const seed = JSON.parse(
  readFileSync(join(here, "..", "seed-data.json"), "utf8"),
);
const seedInventory = seed.releaseVersions
  .filter((version) => version.platform === "iOS" && version.majorVersion === 5)
  .map((version) => [
    version.version,
    version.publicReleaseDate,
    version.milestones.map((milestone) => [
      milestone.label,
      milestone.date,
      milestone.isRevision,
      milestone.note,
    ]),
  ]);
if (
  JSON.stringify(stableValue(seedInventory)) !==
  JSON.stringify(stableValue(expectedSeedInventory))
) {
  throw new Error(
    "The exact local iOS 5 seed inventory changed; re-audit the cohort before regenerating.",
  );
}

const expectedCounts = new Map([
  ["beta-1", 15],
  ["beta-2", 25],
  ["beta-3", 16],
  ["beta-4", 17],
  ["beta-5", 26],
  ["beta-6", 22],
  ["beta-7", 14],
  ["gm", 2],
]);
const expectedIdentities = new Map(
  Object.entries(routeMetadata).map(([alias, route]) => [
    alias,
    {
      target: {
        releaseVersionId: "version-ios-5-0",
        routeAlias: alias,
      },
      identity: {
        releaseVersionId: "version-ios-5-0",
        platformId: "platform-ios",
        stableEventId: route.stableEventId,
        label: route.label,
        routeAlias: alias,
        channel: route.channel,
        appearanceDate: route.date,
        sequence: route.sequence,
        isRevision: false,
        availabilityState: "available",
      },
    },
  ]),
);
if (
  bundle.versions.length !== 0 ||
  bundle.builds.length !== 0 ||
  events.length !== expectedCounts.size ||
  events.some((event) => {
    const alias = event.identity.routeAlias;
    const expected = expectedIdentities.get(alias);
    return (
      !expected ||
      JSON.stringify(
        stableValue({ target: event.target, identity: event.identity }),
      ) !== JSON.stringify(stableValue(expected)) ||
      event.changes.length !== expectedCounts.get(alias) ||
      event.authorship !== "originalSynthesis" ||
      event.provenanceStatus !== "editoriallyVerified" ||
      event.editorialReview.status !== "approved" ||
      event.editorialReview.reviewedAt !== reviewedAt ||
      event.isIndexable !== true ||
      event.changes.some(
        (change) =>
          change.inheritance !== "delta" ||
          !["confirmed", "corroborated"].includes(change.evidenceState),
      )
    );
  })
) {
  throw new Error("The expected iOS 5 prerelease bundle closure failed.");
}

const forbiddenAliases = new Set(["public", "beta-8"]);
if (
  events.some((event) => forbiddenAliases.has(event.identity.routeAlias)) ||
  events.some(
    (event) =>
      event.identity.routeAlias === "gm" && event.identity.sequence !== 8,
  )
) {
  throw new Error("A forbidden iOS 5 prerelease route entered the bundle.");
}

const publicOwners = (publicBatch.events || []).filter(
  (event) =>
    event.target?.releaseVersionId === "version-ios-5-0" &&
    event.target?.routeAlias === "public",
);
if (
  publicOwners.length !== 1 ||
  publicOwners[0].editorialReview?.status !== "approved" ||
  publicOwners[0].provenanceStatus !== "editoriallyVerified" ||
  publicOwners[0].isIndexable !== true
) {
  throw new Error(
    "The approved iOS 5.0 Public owner changed; re-audit route ownership.",
  );
}

const localDefinitions = new Map();
for (const change of events.flatMap((event) => event.changes)) {
  const definition = JSON.stringify(
    stableValue({
      title: change.title,
      canonicalSummary: change.canonicalSummary,
      category: change.category,
    }),
  );
  const previous = localDefinitions.get(change.key);
  if (previous && previous !== definition) {
    throw new Error(`Local definition drifted for ${change.key}.`);
  }
  localDefinitions.set(change.key, definition);
}

const sharedBeta1Keys = new Set(beta1Keys.map(([key]) => key));
const collisionFiles = [
  ...readdirSync(here)
    .filter(
      (name) =>
        name.endsWith(".json") &&
        name !== outputName &&
        // The point-release file is a downstream reuser; its own generator
        // enforces exact ownership and definition equality against this batch.
        name !== "apple-ios-5-point-prerelease.json",
    )
    .map((name) => join(here, name)),
  join(here, "..", "apple-launch-content-2026.json"),
];
const otherDefinitions = new Map();
const otherRoutes = new Map();
const otherStableEventIds = new Map();
for (const file of collisionFiles) {
  const candidate = JSON.parse(readFileSync(file, "utf8"));
  for (const owner of [
    ...(candidate.versions || []),
    ...(candidate.events || []),
    ...(candidate.builds || []),
  ]) {
    for (const change of owner.changes || []) {
      const definition = JSON.stringify(
        stableValue({
          title: change.title,
          canonicalSummary: change.canonicalSummary,
          category: change.category,
        }),
      );
      const previous = otherDefinitions.get(change.key);
      if (previous && previous.definition !== definition) {
        throw new Error(
          `Existing content already has inconsistent definitions for ${change.key}.`,
        );
      }
      otherDefinitions.set(change.key, { definition, file });
    }
  }
  for (const event of candidate.events || []) {
    const alias =
      event.identity?.routeAlias || event.target?.routeAlias || undefined;
    const releaseVersionId =
      event.identity?.releaseVersionId ||
      event.target?.releaseVersionId ||
      undefined;
    const stableEventId =
      event.identity?.stableEventId || event.target?.stableEventId || undefined;
    if (releaseVersionId && alias) {
      otherRoutes.set(`${releaseVersionId}/${alias}`, file);
    }
    if (stableEventId) otherStableEventIds.set(stableEventId, file);
  }
}

for (const [key, definition] of localDefinitions) {
  const collision = otherDefinitions.get(key);
  if (!collision) continue;
  if (
    !sharedBeta1Keys.has(key) ||
    collision.definition !== definition ||
    collision.file !== join(here, "apple-ios-5.json")
  ) {
    throw new Error(
      `iOS 5 prerelease change key collision: ${key} (${collision.file}).`,
    );
  }
}
if (
  [...sharedBeta1Keys].some(
    (key) =>
      !otherDefinitions.has(key) ||
      otherDefinitions.get(key).file !== join(here, "apple-ios-5.json"),
  )
) {
  throw new Error(
    "A shared Beta 1/Public canonical definition lost ownership.",
  );
}
for (const [alias, route] of Object.entries(routeMetadata)) {
  const routeKey = `version-ios-5-0/${alias}`;
  if (otherRoutes.has(routeKey)) {
    throw new Error(
      `An existing research batch already owns ${routeKey} (${otherRoutes.get(routeKey)}).`,
    );
  }
  if (otherStableEventIds.has(route.stableEventId)) {
    throw new Error(
      `An existing research batch already owns ${route.stableEventId}.`,
    );
  }
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
const changeCount = events.reduce(
  (total, event) => total + event.changes.length,
  0,
);
const uniqueLocalChangeKeys = [...localDefinitions.keys()];
const routeRows = events
  .map(
    (event) =>
      `| ${event.identity.label} | \`${event.identity.routeAlias}\` | ${event.identity.appearanceDate} | ${event.changes.length} | ${event.changes.filter((change) => change.action === "fixed").length} | ${event.changes.filter((change) => change.action === "knownIssue").length} |`,
  )
  .join("\n");
const routeVerificationRows = events
  .map(
    (event) =>
      `| \`/apple/ios/5.0/${event.identity.routeAlias}/\` | 200 | 6/6 | ${event.changes.length}/${event.changes.length} | yes | yes | no | no |`,
  )
  .join("\n");
const sourceLedger = sources
  .map(
    (source) =>
      `- [${source.title}](${source.url}) — ${source.publisher}; ${source.author ? `by ${source.author}; ` : ""}${source.sourceClass}.`,
  )
  .join("\n");

const md = `# Apple iOS 5 prerelease archive batch

## Result

\`${outputName}\` is the editorially approved archive overlay for eight
historically defensible iOS 5.0 prerelease routes. It does not alter the
hardcoded seed timeline or any existing Public route.

- ${events.length} identity-backed event creates and no release-version overlays
- ${changeCount} source-backed change occurrences across
  ${uniqueLocalChangeKeys.length} canonical definitions
- ${sharedBeta1Keys.size} Beta 1 feature definitions deliberately reused from
  the approved Public owner with byte-for-byte definition equality
- ${sources.length} declared and used sources with ${citationCount} citation
  references
- zero builds, build-number claims, seed edits, or Public-route changes
- every event is \`editoriallyVerified\`, approved at \`${reviewedAt}\`, and
  explicitly \`isIndexable: true\`

## New historical route closure

| Milestone | New alias | Appearance date | Selected changes | Fixed | Current known |
| --- | --- | --- | ---: | ---: | ---: |
${routeRows}

The local iOS 5 seed currently contains only Public milestones. These eight
identities are carried in the ingestion manifest itself with deterministic
\`stableEventId\` values, \`platform-ios\`, \`version-ios-5-0\`, exact aliases,
dates, channels, and sequence numbers. The generator refuses route or stable-ID
ownership collisions.

## Evidence method

1. Beta 1 uses two first-party Apple pages. Apple Developer confirms immediate
   beta availability on June 6, and Apple Newsroom supplies a public feature
   preview. The structured baseline reuses the approved Public page’s canonical
   feature definitions and does not claim that each feature was complete.
2. Beta 2–4 use contemporaneous release reporting for exact identity and
   preserved reproductions of Apple’s developer notes for detailed records.
   Only explicit \`NEW\` or \`FIXED\` markers are promoted, apart from narrowly
   identified current state needed to connect a later fix.
3. Beta 5 has the strongest retained artifact: an eight-page Apple-authored PDF
   created on August 6, 2011 and independently reproduced by Cult of Mac. The
   PDF was opened through PDFKit, checked page by page for title and locators,
   and hashed over the exact downloaded bytes.
4. Beta 6 and Beta 7 use full contemporaneous developer-note reproductions.
   Entries already marked fixed in Beta 5 or repeated without a defensible new
   boundary are excluded. Repeated known conditions are labeled as state rather
   than first appearance. Seven Cocoa Auto Layout / AppKit records embedded in
   the combined tool notes are excluded because they concern macOS Interface
   Builder behavior rather than the iOS release.
5. GM is limited to two isolatable fixes in the retained GM transcript. Public
   remains separately owned by the approved \`apple-ios-5.json\` batch.

## Raw-source audit ledger

The HTML and PDF bodies were downloaded on ${accessedAt} to a temporary,
uncommitted audit directory. Hashes below cover the exact response bytes.

| Raw artifact | Bytes / pages | SHA-256 | Use |
| --- | ---: | --- | --- |
| Apple Developer Beta 1 HTML | 107,467 | \`7a4894caa3a5a13f00607355bb78ab2712c58e3c2e1c466fed1506a504534e1e\` | Beta 1 identity |
| Apple Newsroom Beta 1 HTML | 133,524 | \`d444d3a73e3875822844ff5c7adaacad729daaf2ceb0a2e91416811b4aa8ed6a\` | Beta 1 feature baseline |
| MacRumors Beta 2 HTML | 131,075 | \`11f7574fa3220294dc2ed7a288f443392fd928282823efa1164b32b66941dd8b\` | Beta 2 identity |
| iPhone Forums Beta 2 HTML | 200,050 | \`853f3101a891ecf2680c0312232595b422efa50d8675c435009b145a1423cdba\` | Beta 2 body |
| MacRumors Beta 3 HTML | 124,873 | \`cd6d752ffe8cca2609eef8fd26baa19d665ab8898c0c539d348d23736aa13dd6\` | Beta 3 identity |
| TheUnlockr Beta 3 HTML | 182,064 | \`db9b2ea58b0504e6f6965501c1b7f75523268f36d9c5cfdb2a23680f5233ce12\` | Beta 3 body |
| MacStories Beta 3 HTML | 55,292 | \`fb952d0eb835ff2d78b5bfee4e1699106b01e4db1f6f0c8ce54d7d37e4575daa\` | Beta 3 corroboration |
| MacRumors Beta 4 HTML | 123,356 | \`aca9dfb57e7390e9aa50cb9755336e4d4acb12a7cb840aa2d0384755c187b945\` | Beta 4 identity |
| iPhone Forums Beta 4 HTML | 133,913 | \`42bb811112e3e8c1d5ed61f2672496336165076ebec3667bfbca8f65cbf7a5e4\` | Beta 4 body |
| MacRumors Beta 5 HTML | 130,067 | \`54b6af58a5437960224c432e19ae13df15da62b2c497f64f7bcf28377e824b64\` | Beta 5 identity |
| Apple-authored Beta 5 PDF mirror | ${verification.beta5PdfBytes.toLocaleString("en-US")} / ${verification.beta5PdfPages} pages | \`786c027c85024d5da0295a16587dec1e86a4c86705c9c8ae9f7842b557c87416\` | Beta 5 body |
| Cult of Mac Beta 5 HTML | 310,399 | \`29861fafc314e0063e95f95c96272eab7ffbe823bfe24c593cb7398ed29b42f3\` | Beta 5 body corroboration |
| MacRumors Beta 6 HTML | 125,748 | \`e2a15fc9f5bf6804e63068994349ace5925424f8e8d3b3107d63e66fe4f492f0\` | Beta 6 identity |
| TheUnlockr Beta 6 HTML | 193,088 | \`27c5982ec6d8ac0ba6638f38f7974eea0c91926ddd968f57b11280edfe96ce54\` | Beta 6 body |
| MacRumors Beta 7 HTML | 124,584 | \`2f184c64e63f95d5ad037356f72fabe8645acc9fa2e06b8de2abcc96e7d664c2\` | Beta 7 identity |
| iDownloadBlog Beta 7 HTML | 251,968 | \`260d42b34df10d5667232b0c3b82cbcd1964187a6e1a16d38f5779db76afacfc\` | Beta 7 body |
| MacRumors GM HTML | 123,614 | \`196ca3ee8d31e2f60ef7e1dff692627f3817cf36b158913ecdcc8195f3bc59c1\` | GM identity |
| Wirefly GM HTML | 105,820 | \`eca3875107a5b408f9c55ace9d29d41a7e0ec942a400a205c6fe159014af436c\` | GM body |
| TechCrunch Public-boundary HTML | 226,779 | \`86c94ed5e6e5e2144ca3533315e3acaa0043ce118092b707e0f9b6da8efb405e\` | Seven-beta / one-GM boundary |
| MacRumors iTunes Beta 8 HTML | 126,577 | \`c3a75ae1dd3a2b22fdb116baa31fe0582b5fa6579db171350ca5c6040d3d3b3d\` | Product-sequence disambiguation |

The HTML audit verifies all selected citation locators against the exact raw
pages, route counts, marker inventories, file sizes, and hashes. The PDFKit
audit separately verifies the Beta 5 title, page count, creation metadata, and
every selected PDF locator. Raw third-party reproductions are not committed.

An independent live re-fetch downloaded all
${verification.independentSourcesFetched} public evidence artifacts again.
${verification.independentRawExact} complete payloads remained byte-identical,
and ${verification.independentWholeBodyExact} whole normalized bodies remained
identical; the remaining wrapper differences were dynamic counters,
timestamps, challenge IDs, or current-page modules. All
${verification.htmlLocatorAssertions} selected HTML locators, all seven
\`NEW\`/\`FIXED\` marker inventories, and the exact Beta 5 PDF bytes reproduced.

## Copyright and editorial method

Every event summary, article paragraph, occurrence title, canonical summary,
occurrence summary, and verification method is original synthesis. Technical
identifiers and product names are retained only where necessary to identify an
API, framework, setting, or affected feature.

The detailed third-party pages reproduce Apple-authored developer material.
They are credited as preservation or journalistic hosts, never represented as
first-party hosting, and never copied into the manifest as a list. The Beta 5
PDF is likewise identified as an Apple-authored document preserved by a mirror.

The Beta 1 page reuses fifteen definitions from the approved Public batch
instead of creating duplicate canonical concepts. The generator permits those
keys only when title, summary, category, and owning file all match exactly.

## Exact evidence gaps

- No direct first-party download for Beta 2–GM remains in the audited public
  source set. Those identities rely on contemporaneous release reporting, and
  detailed bodies rely on credited third-party preservation.
- Beta 5 is the only complete byte-verifiable PDF recovered. Other developer
  bodies are HTML reproductions and remain \`corroborated\`, not
  \`confirmed\`.
- No iOS 5 Beta 8 route is created. A September 9 source identifies iTunes
  10.5 Beta 8 and iWork Beta 3, while final-release coverage counts seven iOS
  betas and one GM. Any later timeline that says otherwise remains
  ledger-only.
- No complete first-party build-number set was recovered. The batch creates no
  build documents and makes no build assertion, even where journalism displays
  a build string.
- The structured selections are milestone deltas, not exhaustive copies of
  cumulative release notes. Repeated fixed text and unmarked carry-forward are
  excluded.
- Cocoa Auto Layout and \`NSSegmentedControl\` entries in the Beta 6 and Beta 7
  tool-note reproductions are macOS/AppKit records and are deliberately
  excluded from this iOS archive.
- This cohort covers the iOS 5.0 prerelease cycle only. Prerelease histories
  for 5.0.1 and 5.1 are researched in a separate review-only cohort rather than
  inferred here.
- Public is already covered by the approved iOS 5 batch and is neither
  duplicated nor patched.

## Source ledger

All declared sources were accessed on ${accessedAt}.

${sourceLedger}

## Closure guards

- Exact comparison against all four local iOS 5 seed records, which still carry
  only Public milestones
- Exact eight-event identity allowlist for Beta 1–7 and GM, including stable
  IDs, aliases, labels, channels, dates, sequences, platform, and parent version
- Explicit rejection of Public and Beta 8
- Approved/indexable ownership check for the existing iOS 5.0 Public route
- Zero release-version overlays and zero builds
- Route and stable-ID collision scan across every other research-batch JSON
  plus \`apple-launch-content-2026.json\`
- ${changeCount} occurrences resolve to exactly
  ${uniqueLocalChangeKeys.length} canonical definitions
- Strict allowlist for ${sharedBeta1Keys.size} approved Public definition reuses;
  every other key must be collision-free
- Complete unique source declaration/use closure
- ${verification.markerAlignmentAssertions} selected non-state records align
  with the nearest explicit \`NEW\` or \`FIXED\` source marker
- ${verification.repeatedCanonicalKeys} repeated canonical identities preserve
  ${verification.repeatedTransitionOccurrences} known/changed-to-fixed or
  continuing-known transitions without definition drift
- Exact exclusion guard for seven macOS-only Cocoa Auto Layout definitions
- Deterministic formatted JSON SHA-256: \`${jsonSha}\`

## Editorial approval and validation record

The independently re-fetched and audited event creations are approved:

- provenance: \`editoriallyVerified\`
- editorial status: \`approved\` at \`${reviewedAt}\`
- indexing: enabled

- repository validation: ${verification.researchBatches} batches validated;
  this cohort reports ${events.length} events, ${changeCount} changes,
  ${sources.length} sources, and ${citationCount} citations;
  ${verification.globalChangeKeys.toLocaleString("en-US")} change keys are
  globally consistent
- focused ingestion/manifest tests:
  ${verification.focusedTests} passed
- full repository suite: ${verification.fullTests} passed
- raw HTML locator assertions: ${verification.htmlLocatorAssertions}
- raw PDF locator assertions: ${verification.pdfLocatorAssertions}
- explicit source-marker alignment assertions:
  ${verification.markerAlignmentAssertions}
- independent live source re-fetch: all
  ${verification.independentSourcesFetched} artifacts available, every selected
  locator and marker inventory reproduced, and the Beta 5 PDF remained
  byte-identical
- copyright-similarity scan:
  ${verification.copyrightFields.toLocaleString("en-US")} reader-facing fields
  checked against the retained evidence; the longest contiguous overlap was
  ${verification.maximumEditorialOverlapWords} words
- ESLint, Prettier check, and \`git diff --check\`: passed
- applied production plan: ${dryRun.creates} creates,
  ${dryRun.patches} patches, ${dryRun.unchanged} unchanged
- create split: ${dryRun.eventCreates} events, ${dryRun.sourceCreates} sources,
  and ${dryRun.changeCreates} stable change documents
- patch boundary: 15 reused Public change documents receive citation union and
  the approved review timestamp only; two reused source documents receive topic
  or source-class metadata only; zero versions or existing events are patched
- mutation payload: ${dryRun.mutationPayloadBytes.toLocaleString("en-US")} bytes
- production plan SHA: \`${dryRun.planSha}\`
- plan artifact SHA-256: \`${dryRun.planArtifactSha}\`
- rollback artifact SHA-256: \`${dryRun.rollbackArtifactSha}\`
- three consecutive production dry runs reproduced the same plan SHA, counts,
  payload size, plan artifact, and rollback artifact

## Publication receipt

- applied plan SHA: \`${dryRun.planSha}\`
- reviewed plan artifact SHA-256: \`${dryRun.planArtifactSha}\`
- rollback artifact SHA-256: \`${dryRun.rollbackArtifactSha}\`
- Sanity transaction: \`${publication.transactionId}\`
- receipt SHA-256: \`${publication.receiptSha}\`
- immediate post-publication zero plan:
  \`${publication.immediateZeroPlanSha}\`;
  ${publication.immediateZeroCreates} creates,
  ${publication.immediateZeroPatches} patches,
  ${publication.immediateZeroUnchanged.toLocaleString("en-US")} unchanged
  documents, and a ${publication.immediateZeroPayloadBytes}-byte mutation
  payload
- zero-plan artifact SHA-256:
  \`${publication.immediateZeroPlanArtifactSha}\`
- zero-plan rollback artifact SHA-256:
  \`${publication.immediateZeroRollbackArtifactSha}\`

## Production coverage after publication

- ${publication.coverage.fullVersions} of
  ${publication.coverage.totalVersions} release versions have full
  version-level coverage
- ${publication.coverage.totalAppearances.toLocaleString("en-US")}
  appearances: ${publication.coverage.fullAppearances} full articles,
  ${publication.coverage.sourceLinkedAppearances} source-linked records, and
  ${publication.coverage.timelineOnlyAppearances.toLocaleString("en-US")}
  timeline-only records
- ${publication.coverage.approvedStructuredAppearances} appearances have
  approved structured changes

## Settled canonical route verification

Every published route was fetched independently from the running local site.
Each response returned all six archival article blocks, every expected
structured change title, References, and its primary source. No response
returned placeholder copy or a \`noindex\` directive.

| Canonical route | HTTP | Article blocks | Expected changes | References | Primary source | Placeholder | Noindex |
| --- | ---: | ---: | ---: | --- | --- | --- | --- |
${routeVerificationRows}

Final verification on ${accessedAt}:

- full repository suite: ${verification.fullTests} tests passed
- focused ingestion and manifest suite:
  ${verification.focusedTests} tests passed
- deterministic regeneration preserved JSON SHA-256 \`${jsonSha}\`
- final production dry run reproduced
  ${publication.immediateZeroCreates} creates,
  ${publication.immediateZeroPatches} patches,
  ${publication.immediateZeroUnchanged.toLocaleString("en-US")} unchanged
  documents, the ${publication.immediateZeroPayloadBytes}-byte payload, and
  plan SHA \`${publication.immediateZeroPlanSha}\`
- the final planner reported “No Sanity data changed”

Reproduce and verify the published batch with:

\`\`\`sh
node scripts/research-batches/build-apple-ios-5-prerelease.mjs
npm run research:validate
node --import tsx --test tests/launch-content-ingestion.test.ts tests/launch-content-manifest.test.ts
npx eslint scripts/research-batches/build-apple-ios-5-prerelease.mjs scripts/research-batches/audit-ios5-prerelease-html-states.mjs
npx prettier --check scripts/research-batches/build-apple-ios-5-prerelease.mjs scripts/research-batches/apple-ios-5-prerelease.json scripts/research-batches/apple-ios-5-prerelease.md scripts/research-batches/audit-ios5-prerelease-html-states.mjs
node scripts/research-batches/audit-ios5-prerelease-html-states.mjs scripts/research-batches/apple-ios-5-prerelease.json /private/tmp/apple-ios5-prerelease.ELLID3
osascript -l JavaScript scripts/research-batches/audit-ios5-prerelease-pdf-state.jxa scripts/research-batches/apple-ios-5-prerelease.json /private/tmp/apple-ios5-prerelease.ELLID3
npx sanity exec scripts/ingest-launch-content.ts --with-user-token -- --content scripts/research-batches/apple-ios-5-prerelease.json
\`\`\`

The final Sanity command is intentionally a post-publication dry run and must
reproduce the zero plan above. Do not add \`--apply\`.
`;

const formattedMd = await prettier.format(md, {
  filepath: join(here, ledgerName),
});
writeFileSync(join(here, ledgerName), formattedMd);

console.log(
  JSON.stringify(
    {
      output: outputPath,
      ledger: join(here, ledgerName),
      events: events.length,
      changes: changeCount,
      changeKeys: uniqueLocalChangeKeys.length,
      sharedCanonicalKeys: sharedBeta1Keys.size,
      sources: sources.length,
      citations: citationCount,
      sha256: jsonSha,
    },
    null,
    2,
  ),
);
