import { createHash } from "node:crypto";
import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import prettier from "prettier";

const here = dirname(fileURLToPath(import.meta.url));
const outputName = "apple-ios-7-prerelease.json";
const ledgerName = "apple-ios-7-prerelease.md";
const accessedAt = "2026-07-30";
const reviewedAt = "2026-07-30T11:22:57Z";

const dryRun = {
  creates: 121,
  patches: 8,
  unchanged: 2_075,
  sourceCreates: 16,
  changeCreates: 105,
  mutationPayloadBytes: 415_929,
  planSha: "dda56cdd3c72b73090e110308791c8bebf9afae2da6db29ae9ab77d4081f92f5",
  planArtifactSha:
    "44600d5197a0aadb2c84e16b2db7070a2e73dd19f1a5261dd7fe734559f31b2e",
  rollbackArtifactSha:
    "1894efd27bc3853c1003812ec3f79dd465d29ca105c8ab51e026ec21c6c684cc",
};

const publication = {
  transactionId: "tt1fSB5HY9GAB0YLyysuOg",
  receiptSha:
    "e3f48dc7b76ea9d101a55e6bc3f92857ed9847e8f05bbdb4065eccfc438b5abf",
  immediateZeroPlanSha:
    "3e56faf5e5f8aee40ac92d33e4ecb1a1a843fbc6ed1af987e32722ecfa6fd0bc",
  immediateZeroPlanArtifactSha:
    "faa85fb0b308c00fe105186553cb64c0e6fa7009b8b61e8e7d723619b7fff3f4",
  immediateZeroRollbackArtifactSha:
    "01468e86384a6d237b68950f10261b113e7d0e7fa775d0b3dc31a1c2e2111be4",
  immediateZeroCreates: 0,
  immediateZeroPatches: 0,
  immediateZeroUnchanged: 2_204,
  immediateZeroPayloadBytes: 16,
  coverage: {
    totalVersions: 410,
    fullVersions: 410,
    totalAppearances: 1_979,
    fullAppearances: 426,
    sourceLinkedAppearances: 256,
    timelineOnlyAppearances: 1_297,
    approvedStructuredAppearances: 577,
  },
};

const verification = {
  researchBatches: 68,
  globalChangeKeys: 4_052,
  focusedTests: 19,
  fullTests: 131,
  copyrightFields: 553,
  maximumEditorialOverlapWords: 5,
  beta1PartialPdfBytes: 71_768,
  beta1PartialPdfPages: 1,
  beta3PdfBytes: 151_476,
  beta3PdfPages: 12,
};

const U = {
  beta1Announcement:
    "https://www.apple.com/newsroom/2013/06/10Apple-Unveils-iOS-7/",
  beta1Transcript:
    "https://web.archive.org/web/20130615040305/http://www.phonesreview.co.uk/2013/06/10/ios-7-beta-1-release-notes-live-with-dev-download/",
  beta1TranscriptRaw:
    "https://web.archive.org/web/20130615040305id_/http://www.phonesreview.co.uk/2013/06/10/ios-7-beta-1-release-notes-live-with-dev-download/",
  beta1PartialPdf:
    "https://wikis.mit.edu/confluence/download/attachments/100208014/iOS.7.Release.Notes.11A4372q%20.pdf?api=v2",
  beta2Transcript:
    "https://web.archive.org/web/20130624222434/http://bgr.com/2013/06/24/ios-7-beta-2-change-log-ipad/",
  beta2TranscriptRaw:
    "https://web.archive.org/web/20130624222434id_/http://bgr.com/2013/06/24/ios-7-beta-2-change-log-ipad/",
  beta2Observed:
    "https://www.idownloadblog.com/2013/06/24/ios-7-beta-2-is-out/",
  beta2ObservedCorroboration:
    "https://9to5mac.com/2013/06/24/apple-seeds-ios-7-beta-2-to-developers/",
  beta3Pdf:
    "https://www.ipod.info.pl/wp-content/uploads/2013/07/iOS-7-beta-3-lista-zmian.pdf",
  beta3Transcript:
    "https://web.archive.org/web/20130709213122/http://bgr.com/2013/07/08/ios-7-beta-3-change-log/",
  beta3TranscriptRaw:
    "https://web.archive.org/web/20130709213122id_/http://bgr.com/2013/07/08/ios-7-beta-3-change-log/",
  beta4Transcript:
    "https://web.archive.org/web/20130801011005/http://bgr.com/2013/07/29/ios-7-beta-4-full-change-log-changelog/",
  beta4TranscriptRaw:
    "https://web.archive.org/web/20130801011005id_/http://bgr.com/2013/07/29/ios-7-beta-4-full-change-log-changelog/",
  beta4Corroboration:
    "https://wccftech.com/full-ios-7-beta-4-changelog-posted/",
  beta5Transcript:
    "https://web.archive.org/web/20130809040933/http://bgr.com/2013/08/06/ios-7-beta-5-change-log/",
  beta5TranscriptRaw:
    "https://web.archive.org/web/20130809040933id_/http://bgr.com/2013/08/06/ios-7-beta-5-change-log/",
  beta5Corroboration:
    "https://www.idevice.ro/2013/08/06/ios-7-beta-5-iata-intregul-changelog/",
  beta6Evidence: "https://www.idevice.ro/2013/08/16/ios-7-beta-6-changelog/",
  beta6Corroboration:
    "https://www.idownloadblog.com/2013/08/15/apple-seeds-ios-7-beta-6/",
  gmTranscript:
    "https://web.archive.org/web/20130912223457/http://bgr.com/2013/09/10/ios-7-gm-change-log-release-notes/",
  gmTranscriptRaw:
    "https://web.archive.org/web/20130912223457id_/http://bgr.com/2013/09/10/ios-7-gm-change-log-release-notes/",
  gmCorroboration:
    "https://www.intomobile.com/2013/09/10/ios-7-gold-master-available-developers-change-log-detailed/",
  finalNotes: "https://support.apple.com/en-us/102996",
};

const sources = [
  {
    url: U.beta1Announcement,
    title: "Apple Unveils iOS 7",
    publisher: "Apple Newsroom",
    sourceClass: "firstPartyAnnouncement",
    author: "Apple",
    publishedAt: "2013-06-10T00:00:00.000Z",
    topics: ["iOS", "7.0", "Beta 1", "WWDC 2013", "availability"],
  },
  {
    url: U.beta1Transcript,
    title: "iOS 7 Beta 1 release notes live with developer download",
    publisher: "Phones Review via Internet Archive",
    sourceClass: "archive",
    author: "Daniel Chubb",
    publishedAt: "2013-06-10T22:57:26.000Z",
    topics: [
      "iOS",
      "7.0",
      "Beta 1",
      "Apple Developer release-note transcript",
      "historical preservation",
    ],
  },
  {
    url: U.beta1PartialPdf,
    title: "iOS SDK Release Notes for iOS 7.0 (preserved opening page)",
    publisher: "MIT Wiki document attachment",
    sourceClass: "archive",
    author: "Apple",
    publishedAt: "2013-06-11T18:57:05.000Z",
    topics: [
      "iOS",
      "7.0",
      "Beta 1",
      "Apple Developer document identity",
      "partial PDF",
    ],
  },
  {
    url: U.beta2Transcript,
    title: "iOS 7 Beta 2 change log and iPad release",
    publisher: "BGR via Internet Archive",
    sourceClass: "archive",
    author: "Zach Epstein",
    publishedAt: "2013-06-24T17:33:00.000Z",
    topics: [
      "iOS",
      "7.0",
      "Beta 2",
      "Apple Developer release-note transcript",
      "historical preservation",
    ],
  },
  {
    url: U.beta2Observed,
    title: "iOS 7 Beta 2 is out with iPad support and other features",
    publisher: "iDownloadBlog",
    sourceClass: "journalism",
    author: "Cody Lee",
    publishedAt: "2013-06-24T17:03:56.000Z",
    topics: ["iOS", "7.0", "Beta 2", "iPad", "Voice Memos", "Siri"],
  },
  {
    url: U.beta2ObservedCorroboration,
    title:
      "Apple seeds iOS 7 Beta 2 to developers with Voice Memos and Siri updates",
    publisher: "9to5Mac",
    sourceClass: "journalism",
    author: "Mark Gurman",
    publishedAt: "2013-06-24T16:57:27.000Z",
    topics: ["iOS", "7.0", "Beta 2", "Voice Memos", "Siri", "iPad"],
  },
  {
    url: U.beta3Pdf,
    title: "iOS SDK Release Notes for iOS 7 Seed 3 (preserved PDF)",
    publisher: "iPod.info.pl document mirror",
    sourceClass: "archive",
    author: "Apple",
    publishedAt: "2013-07-08T00:00:00.000Z",
    topics: [
      "iOS",
      "7.0",
      "Beta 3",
      "Apple Developer release notes",
      "historical document mirror",
    ],
  },
  {
    url: U.beta3Transcript,
    title: "iOS 7 Beta 3 full change log",
    publisher: "BGR via Internet Archive",
    sourceClass: "archive",
    author: "Zach Epstein",
    publishedAt: "2013-07-08T17:11:01.000Z",
    topics: [
      "iOS",
      "7.0",
      "Beta 3",
      "Apple Developer release-note transcript",
      "historical preservation",
    ],
  },
  {
    url: U.beta4Transcript,
    title: "iOS 7 Beta 4 full change log",
    publisher: "BGR via Internet Archive",
    sourceClass: "archive",
    author: "Zach Epstein",
    publishedAt: "2013-07-29T00:00:00.000Z",
    topics: [
      "iOS",
      "7.0",
      "Beta 4",
      "Apple Developer release-note transcript",
      "historical preservation",
    ],
  },
  {
    url: U.beta4Corroboration,
    title: "Full iOS 7 Beta 4 changelog posted",
    publisher: "Wccftech",
    sourceClass: "journalism",
    author: "Shawn Sanders",
    publishedAt: "2013-07-29T21:36:51.000Z",
    topics: ["iOS", "7.0", "Beta 4", "release-note transcript"],
  },
  {
    url: U.beta5Transcript,
    title: "iOS 7 Beta 5 full change log",
    publisher: "BGR via Internet Archive",
    sourceClass: "archive",
    author: "Zach Epstein",
    publishedAt: "2013-08-06T00:00:00.000Z",
    topics: [
      "iOS",
      "7.0",
      "Beta 5",
      "Apple Developer release-note transcript",
      "historical preservation",
    ],
  },
  {
    url: U.beta5Corroboration,
    title: "iOS 7 Beta 5 complete changelog",
    publisher: "iDevice.ro",
    sourceClass: "journalism",
    author: "Adrian Gabor",
    publishedAt: "2013-08-06T17:54:06.000Z",
    topics: ["iOS", "7.0", "Beta 5", "release-note transcript"],
  },
  {
    url: U.beta6Evidence,
    title: "iOS 7 Beta 6 changelog",
    publisher: "iDevice.ro",
    sourceClass: "journalism",
    author: "Adrian Gabor",
    publishedAt: "2013-08-16T05:05:49.000Z",
    topics: ["iOS", "7.0", "Beta 6", "iTunes in the Cloud"],
  },
  {
    url: U.beta6Corroboration,
    title: "Apple seeds iOS 7 Beta 6 with iTunes in the Cloud fix",
    publisher: "iDownloadBlog",
    sourceClass: "journalism",
    author: "Cody Lee",
    publishedAt: "2013-08-16T00:22:57.000Z",
    topics: ["iOS", "7.0", "Beta 6", "iTunes in the Cloud"],
  },
  {
    url: U.gmTranscript,
    title: "iOS 7 GM change log and release notes",
    publisher: "BGR via Internet Archive",
    sourceClass: "archive",
    author: "Zach Epstein",
    publishedAt: "2013-09-10T00:00:00.000Z",
    topics: [
      "iOS",
      "7.0",
      "GM",
      "Apple Developer release-note transcript",
      "historical preservation",
    ],
  },
  {
    url: U.gmCorroboration,
    title: "iOS 7 Gold Master available for developers with change log",
    publisher: "IntoMobile",
    sourceClass: "journalism",
    author: "Ian Kersey",
    publishedAt: "2013-09-10T20:47:28.000Z",
    topics: ["iOS", "7.0", "GM", "release-note transcript"],
  },
  {
    url: U.finalNotes,
    title: "About iOS 7 Updates",
    publisher: "Apple Support",
    sourceClass: "firstPartyDocumentation",
    author: "Apple",
    publishedAt: "2013-09-18T00:00:00.000Z",
    topics: ["iOS", "7.0", "Public", "final release boundary"],
  },
];

const c = (url, locator, note) => ({
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

const definitionRows = [
  [
    "airdropInternet",
    "ios-7-prerelease-airdrop-contacts-internet",
    "AirDrop contact filtering needed internet access",
    "Contact-restricted AirDrop discovery depended on an active internet connection during the prerelease cycle.",
    "bugFix",
  ],
  [
    "airdropDiscovery",
    "ios-7-prerelease-airdrop-discovery-transfer",
    "AirDrop peer discovery and transfer reliability",
    "Nearby peers did not always appear, and file transfers could fail over Wi-Fi.",
    "knownIssue",
  ],
  [
    "utiHandler",
    "ios-7-prerelease-document-uti-app-lookup",
    "App lookup for received document types",
    "Opening a received document by its Uniform Type Identifier could lead to an empty app-selection screen.",
    "bugFix",
  ],
  [
    "captureBackground",
    "ios-7-prerelease-avcapture-background-audio",
    "Background audio capture samples",
    "AVCaptureSession could stop delivering audio samples while its application ran in the background.",
    "knownIssue",
  ],
  [
    "calendarSync",
    "ios-7-prerelease-icloud-calendar-event-sync",
    "iCloud calendar event synchronization",
    "Calendar changes could fail to reach a device through push, fetch, or manual refresh.",
    "bugFix",
  ],
  [
    "carDisplay",
    "ios-7-prerelease-car-display-availability",
    "Car Display support awaited compatible systems",
    "The prerelease SDK documented Car Display as unavailable until compatible vehicle systems existed.",
    "knownIssue",
  ],
  [
    "groupOpacity",
    "ios-7-prerelease-uiview-group-opacity-default",
    "Grouped view opacity became the default",
    "When no explicit preference was present, transparent view subtrees used grouped compositing by default.",
    "behavior",
  ],
  [
    "coreDataMigration",
    "ios-7-prerelease-core-data-icloud-migration",
    "Core Data migration into iCloud",
    "Moving a persistent store from a local sandbox into iCloud could terminate the application.",
    "knownIssue",
  ],
  [
    "gameCenterNewId",
    "ios-7-prerelease-game-center-new-apple-id",
    "New Game Center account creation",
    "Creating a Game Center Apple ID worked only inside its dedicated application, not in Settings.",
    "knownIssue",
  ],
  [
    "gameCenterLoginContrast",
    "ios-7-prerelease-game-center-login-readability",
    "Game Center sign-in sheet readability",
    "The Game Center authentication sheet could render with insufficient contrast to read its content.",
    "knownIssue",
  ],
  [
    "gameKitReminder",
    "ios-7-prerelease-game-kit-reminder-api",
    "Game Kit reminder API availability",
    "The API for sending Game Center reminders was declared but not implemented in the first seed.",
    "knownIssue",
  ],
  [
    "activationLock",
    "ios-7-prerelease-activation-lock",
    "Activation Lock",
    "Find My iPhone gained an account-credential lock around sign-out, erasure, and post-erase activation.",
    "feature",
  ],
  [
    "keychainApprovalKeyboard",
    "ios-7-prerelease-keychain-approval-keyboard",
    "Keyboard in the Keychain approval dialog",
    "The approval dialog for iCloud Keychain could open without a usable keyboard after unlocking the screen.",
    "bugFix",
  ],
  [
    "keychainCountryDisplay",
    "ios-7-prerelease-keychain-country-display",
    "Updated Keychain country code display",
    "Changing the recovery phone country could leave the new country name or dialing code hidden.",
    "bugFix",
  ],
  [
    "activationEraseCredentials",
    "ios-7-prerelease-activation-lock-erase-credentials",
    "Credentials before erasing an Activation Locked device",
    "One reset path could erase a device without first asking for the account credentials needed to disable Activation Lock.",
    "bugFix",
  ],
  [
    "keychainIdleApproval",
    "ios-7-prerelease-keychain-idle-peer-approval",
    "Keychain approval on an idle peer",
    "An iCloud Keychain approval request could remain hidden while the receiving device slept.",
    "bugFix",
  ],
  [
    "secondaryIcloudToggles",
    "ios-7-prerelease-secondary-icloud-toggles",
    "Unsupported secondary iCloud toggles",
    "Find My iPhone and Bookmarks settings on secondary iCloud accounts could be disabled without notifying the user.",
    "bugFix",
  ],
  [
    "keychainSetupDifficulty",
    "ios-7-prerelease-keychain-setup-difficulty",
    "Intermittent iCloud Keychain setup failure",
    "Some devices could encounter a rare failure while joining or configuring iCloud Keychain.",
    "bugFix",
  ],
  [
    "locationServicesUpgrade",
    "ios-7-prerelease-location-services-upgrade-default",
    "Location Services after an upgrade",
    "Updating from an earlier system could leave Location Services disabled and consequently block Find My iPhone.",
    "knownIssue",
  ],
  [
    "iphone4Gps",
    "ios-7-prerelease-iphone4-gps",
    "GPS location on iPhone 4",
    "GPS-derived positioning, including assisted GPS, did not function on iPhone 4 in the first seed.",
    "knownIssue",
  ],
  [
    "mapHeading",
    "ios-7-prerelease-mapkit-camera-heading",
    "MapKit camera heading calculation",
    "A camera created from center and eye coordinates could choose an incorrect map heading.",
    "knownIssue",
  ],
  [
    "mapSnapshot",
    "ios-7-prerelease-mapkit-nonsquare-snapshot-coordinate",
    "Coordinates in nonsquare map snapshots",
    "MKMapSnapshot could return the wrong point for a coordinate when the rendered image was not square.",
    "knownIssue",
  ],
  [
    "silentPushWake",
    "ios-7-prerelease-silent-push-wake",
    "Silent push wake behavior",
    "A silent remote notification woke the device regardless of whether useful background work could proceed.",
    "knownIssue",
  ],
  [
    "backgroundPolicyApi",
    "ios-7-prerelease-background-policy-introspection",
    "Background-policy inspection API",
    "Applications had no API for reading the user settings that governed their background activity.",
    "knownIssue",
  ],
  [
    "mediaPicker",
    "ios-7-prerelease-media-picker-disabled",
    "Media picker availability",
    "MPMediaPickerController returned immediately as though the user had cancelled instead of presenting a selection.",
    "bugFix",
  ],
  [
    "newsstandAuth",
    "ios-7-prerelease-newsstand-background-auth",
    "Newsstand background-download authentication",
    "Authenticated Newsstand downloads could show authorization prompts because credential callbacks were not handled correctly.",
    "bugFix",
  ],
  [
    "backgroundRefresh",
    "ios-7-prerelease-background-app-refresh-settings",
    "Per-app Background App Refresh controls",
    "Individual application switches under Background App Refresh could be ignored.",
    "bugFix",
  ],
  [
    "siriVoicesAbsent",
    "ios-7-prerelease-siri-voice-availability",
    "New Siri voices absent from the first seed",
    "The redesigned voice options announced for Siri were not included in the initial developer seed.",
    "knownIssue",
  ],
  [
    "hotspot",
    "ios-7-prerelease-personal-hotspot",
    "Personal Hotspot availability",
    "Internet tethering through Personal Hotspot did not operate with the first SDK seed.",
    "knownIssue",
  ],
  [
    "voiceMemosAbsent",
    "ios-7-prerelease-voice-memos-availability",
    "Voice Memos absent from the first seed",
    "The Voice Memos application was not bundled with the initial iOS 7 developer seed.",
    "knownIssue",
  ],
  [
    "voiceoverMaps",
    "ios-7-prerelease-voiceover-maps",
    "Maps with VoiceOver",
    "Maps did not function correctly for users navigating with VoiceOver.",
    "knownIssue",
  ],
  [
    "voiceoverSiri",
    "ios-7-prerelease-voiceover-siri",
    "Siri interaction with VoiceOver",
    "Siri and VoiceOver could interfere with one another during use.",
    "knownIssue",
  ],
  [
    "voiceoverReminders",
    "ios-7-prerelease-voiceover-reminders",
    "Reminders with VoiceOver",
    "Reminders did not function correctly when operated through VoiceOver.",
    "bugFix",
  ],
  [
    "ipadSupport",
    "ios-7-prerelease-beta2-ipad-support",
    "iOS 7 beta reached iPad",
    "The second developer seed extended the iOS 7 preview to iPad and iPad mini hardware.",
    "feature",
  ],
  [
    "voiceMemosReturn",
    "ios-7-prerelease-beta2-voice-memos-return",
    "Voice Memos returned",
    "Voice Memos reappeared after being absent from the first developer seed.",
    "enhancement",
  ],
  [
    "siriVoicesAdded",
    "ios-7-prerelease-beta2-siri-voices",
    "Additional Siri voices became available",
    "The second seed added alternative masculine and feminine voice options for Siri.",
    "enhancement",
  ],
  [
    "airdropSeedCompatibility",
    "ios-7-prerelease-airdrop-seed-compatibility",
    "AirDrop compatibility changed after Seed 1",
    "AirDrop peers on Seed 2 or later could not exchange data with devices still running Seed 1.",
    "compatibility",
  ],
  [
    "passbookValidation",
    "ios-7-prerelease-passbook-back-field-validation",
    "Passbook back-field validation",
    "Passbook began enforcing validation of back fields that earlier system versions had not checked completely.",
    "behavior",
  ],
  [
    "statusBarManagement",
    "ios-7-prerelease-view-controller-status-bar",
    "View-controller status-bar management became the default",
    "Applications began using view-controller-based status-bar appearance unless they explicitly opted out.",
    "developerApi",
  ],
  [
    "airplayNextTrack",
    "ios-7-prerelease-airplay-next-track",
    "Advancing an AirPlay music queue",
    "Moving to the next song while streaming music to Apple TV could fail.",
    "bugFix",
  ],
  [
    "airplayVolume",
    "ios-7-prerelease-airplay-volume-surge",
    "Unexpected AirPlay volume increase",
    "AirPlay playback could jump to a much louder level without user intent.",
    "bugFix",
  ],
  [
    "messagesEmptyList",
    "ios-7-prerelease-messages-clean-install-compose",
    "Messages after a clean installation",
    "Opening Messages on a clean installation could show an empty conversation list instead of composition.",
    "bugFix",
  ],
  [
    "messagesDatabase",
    "ios-7-prerelease-messages-database-restore",
    "Messages database after restore or upgrade",
    "A particular iCloud and iMessage account mismatch during setup could remove the existing Messages database.",
    "bugFix",
  ],
  [
    "messagesAttachments",
    "ios-7-prerelease-messages-attachment-threads",
    "Attachments across multiple Messages threads",
    "Viewing attachments in two different conversations could cause Messages to terminate.",
    "bugFix",
  ],
  [
    "crashLogs",
    "ios-7-prerelease-crash-logs-after-device-erase",
    "Crash logs after an on-device erase",
    "CrashReporter logs could stop copying to a computer after erasing content and settings on the device.",
    "bugFix",
  ],
  [
    "passcodeAutolock",
    "ios-7-prerelease-passcode-autolock-enforcement",
    "Passcode and Auto-Lock enforcement",
    "The system did not always enforce the configured passcode and automatic-lock intervals.",
    "bugFix",
  ],
  [
    "pushDelivery",
    "ios-7-prerelease-push-delivery-duplicates",
    "Duplicate or missing push notifications",
    "Applications could receive a push notification more than once or not receive it at all.",
    "bugFix",
  ],
  [
    "appSwitcher",
    "ios-7-prerelease-app-switcher-suspended-apps",
    "Suspended applications in the app switcher",
    "The app switcher could omit applications that remained suspended in memory.",
    "bugFix",
  ],
  [
    "trustPrompt",
    "ios-7-prerelease-computer-trust-prompt",
    "Computer trust prompt on an unlocked device",
    "A connected device without a passcode could be trusted even though its expected approval interface never appeared.",
    "bugFix",
  ],
  [
    "switchTint",
    "ios-7-prerelease-uiswitch-tint",
    "Custom UISwitch tint color",
    "UISwitch displayed a green on-state even when an application configured another tint.",
    "bugFix",
  ],
  [
    "keychainSeed3Compatibility",
    "ios-7-prerelease-keychain-seed3-compatibility",
    "Seed 3 iCloud Keychain compatibility",
    "Updating to Seed 3 disabled earlier Keychain and restore state because its format was incompatible with Seed 2 software.",
    "compatibility",
  ],
  [
    "multipeerApis",
    "ios-7-prerelease-multipeer-session-apis",
    "Multipeer Connectivity session APIs",
    "Seed 3 implemented stream and resource-transfer operations and aligned MCSession behavior with the WWDC design.",
    "developerApi",
  ],
  [
    "urlSessionSuspended",
    "ios-7-prerelease-urlsession-suspended-start",
    "URL session tasks began suspended",
    "New URL session tasks initially remained paused so clients could configure state before starting network work.",
    "developerApi",
  ],
  [
    "passbookCancelStatus",
    "ios-7-prerelease-passbook-cancel-status",
    "Passbook add-pass cancellation status",
    "PKPassLibrary gained a status value that distinguished a user cancelling the add-passes alert.",
    "developerApi",
  ],
  [
    "calendarDuplicates",
    "ios-7-prerelease-duplicate-icloud-calendars-reminders",
    "Duplicate iCloud calendars or reminders",
    "Adding an event could produce an extra calendar or reminders list.",
    "bugFix",
  ],
  [
    "contactPhotoSync",
    "ios-7-prerelease-contact-caller-photo-sync",
    "High-resolution contact photo synchronization",
    "High-resolution caller images could fail to synchronize through iCloud or another configured service.",
    "bugFix",
  ],
  [
    "keychainSingleRestore",
    "ios-7-prerelease-keychain-single-device-restore",
    "Keychain setup after a single-device restore",
    "Restoring the only device in an iCloud Keychain circle could lead to the wrong setup flow.",
    "bugFix",
  ],
  [
    "keychainSignoutSetup",
    "ios-7-prerelease-keychain-setup-after-signout-erase",
    "Keychain setup after signing out or erasing",
    "Returning to iCloud after account removal or device erasure could present an incorrect Keychain setup sequence.",
    "bugFix",
  ],
  [
    "creditCardDeleteSync",
    "ios-7-prerelease-keychain-credit-card-deletion-sync",
    "Synchronized removal of saved credit cards",
    "Deleting an AutoFill credit card on one device could leave it stored on peer devices.",
    "bugFix",
  ],
  [
    "keychainReenable",
    "ios-7-prerelease-keychain-reenable",
    "Re-enabling iCloud Keychain",
    "Turning iCloud Keychain off could leave the service unable to be enabled again.",
    "bugFix",
  ],
  [
    "keychainWep",
    "ios-7-prerelease-keychain-wep-sync",
    "Keychain synchronization on WEP networks",
    "Keychain data could stop synchronizing while devices used a WEP-secured wireless network.",
    "bugFix",
  ],
  [
    "keychainSetupKeyboardCover",
    "ios-7-prerelease-keychain-setup-keyboard-cover",
    "Keychain setup fields on smaller iPhones",
    "During setup on iPhone 4-class hardware, the keyboard could cover security-code controls.",
    "bugFix",
  ],
  [
    "epubRestore",
    "ios-7-prerelease-icloud-restore-nonpurchased-books",
    "Restoring non-purchased books from iCloud",
    "An iCloud restore from an older backup could omit user-added EPUB and PDF files.",
    "bugFix",
  ],
  [
    "safariAutofill",
    "ios-7-prerelease-safari-cross-site-autofill",
    "Safari credential AutoFill across site variants",
    "Saved website credentials could fail to fill when a site switched between mobile and desktop forms.",
    "bugFix",
  ],
  [
    "safariSettingsReset",
    "ios-7-prerelease-safari-settings-upgrade-reset",
    "Safari settings after an upgrade",
    "Installing a later iOS 7 seed could restore Safari preferences to defaults.",
    "bugFix",
  ],
  [
    "webclipSwitcherCrash",
    "ios-7-prerelease-webclip-app-switcher-crash",
    "App-switcher crash involving saved websites",
    "Opening certain saved web clips from the multitasking interface could crash SpringBoard.",
    "bugFix",
  ],
  [
    "manyAppsCrash",
    "ios-7-prerelease-restore-many-apps-springboard-crash",
    "SpringBoard while restoring many applications",
    "Restoring an iCloud backup containing hundreds of applications could trigger repeated SpringBoard crashes.",
    "bugFix",
  ],
  [
    "diacriticalPassword",
    "ios-7-prerelease-diacritical-password-unlock",
    "Unlocking with diacritical password characters",
    "Passwords containing diacritical marks could prevent the device from being unlocked.",
    "bugFix",
  ],
  [
    "wifiSync",
    "ios-7-prerelease-itunes-wifi-sync-discovery",
    "Device discovery for iTunes Wi-Fi sync",
    "Devices could remain absent from iTunes even when wireless synchronization was enabled.",
    "bugFix",
  ],
  [
    "imagePickerPreview",
    "ios-7-prerelease-image-picker-overlay-preview",
    "Image picker preview with a custom overlay",
    "UIImagePickerController could omit its live camera preview when an application supplied an overlay.",
    "bugFix",
  ],
  [
    "pickerCustomViews",
    "ios-7-prerelease-picker-custom-selection-view",
    "Custom views in a picker selection",
    "UIPickerView could hide custom content inside the selected row indicator.",
    "bugFix",
  ],
  [
    "refreshHidden",
    "ios-7-prerelease-refresh-control-navigation-bar",
    "Refresh controls below an opaque navigation bar",
    "A refresh control and its table could be obscured when the navigation bar was nontranslucent.",
    "bugFix",
  ],
  [
    "layoutGuides",
    "ios-7-prerelease-interface-builder-layout-guides",
    "Layout-guide support in Interface Builder",
    "Interface Builder did not correctly support a view controller’s top and bottom layout guides.",
    "bugFix",
  ],
  [
    "refreshTitle",
    "ios-7-prerelease-refresh-control-title-position",
    "Refresh-control title position",
    "The refresh-control label could appear underneath the navigation bar.",
    "bugFix",
  ],
  [
    "addressBookPrivacy",
    "ios-7-prerelease-addressbookui-privacy",
    "AddressBookUI privacy support",
    "Applications linked with the iOS 7 SDK again received privacy behavior around AddressBookUI view controllers.",
    "developerApi",
  ],
  [
    "exchangeIdentifier",
    "ios-7-prerelease-exchange-device-identifier",
    "Exchange device identifier behavior",
    "The Exchange identifier returned to the iOS 6 convention of using the device serial number.",
    "behavior",
  ],
  [
    "fontHeights",
    "ios-7-prerelease-font-line-height",
    "Font line-height metrics changed",
    "Text aligned manually against earlier seeds could shift vertically after font metrics changed.",
    "behavior",
  ],
  [
    "metadataContentTree",
    "ios-7-prerelease-metadata-content-type-tree",
    "Content-type-tree predicates in ubiquitous metadata queries",
    "Ubiquitous NSMetadataQuery searches gained predicate support for kMDItemContentTypeTree.",
    "developerApi",
  ],
  [
    "mediaAppMemory",
    "ios-7-prerelease-last-media-app-memory",
    "Last-used media application persisted",
    "The system remembered the most recent media application across restarts and application crashes.",
    "behavior",
  ],
  [
    "taskCompletionPolicy",
    "ios-7-prerelease-task-completion-policy",
    "Background task-completion policy",
    "Task completion returned to iOS 6-style policy while offering less total execution time.",
    "developerApi",
  ],
  [
    "passbookIBeacon",
    "ios-7-prerelease-passbook-ibeacon-major-minor",
    "Passbook iBeacon major and minor fields",
    "Passbook beacon dictionaries gained optional major and minor values alongside the required proximity UUID.",
    "developerApi",
  ],
  [
    "snapshotApi",
    "ios-7-prerelease-uiview-snapshot-committed-state",
    "View snapshots and pending updates",
    "UIView snapshot methods began representing committed state and added a choice to wait for pending hierarchy updates.",
    "developerApi",
  ],
  [
    "backTitle",
    "ios-7-prerelease-navigation-short-back-title",
    "Short fallback navigation title",
    "A crowded navigation bar could replace the full previous-screen title with a generic short label or only a chevron.",
    "behavior",
  ],
  [
    "storeDownloads",
    "ios-7-prerelease-iphone4-store-downloads",
    "Store downloads on some iPhone 4 devices",
    "Some iPhone 4 devices could not download purchases from the App Store or iTunes Store.",
    "bugFix",
  ],
  [
    "setupCrash",
    "ios-7-prerelease-setup-existing-email-crash",
    "Setup Assistant with an existing email address",
    "Setup Assistant could terminate while configuring fresh hardware with an email address already in use.",
    "bugFix",
  ],
  [
    "mediaLandscape",
    "ios-7-prerelease-landscape-media-player-shift",
    "Landscape media-player position",
    "Presenting the system media player in landscape could shift application content unexpectedly.",
    "bugFix",
  ],
  [
    "webclipFolder",
    "ios-7-prerelease-webclip-folder-persistence",
    "Web clip folders after reboot",
    "Web applications and clips created before Seed 4 could leave their folders after a restart.",
    "knownIssue",
  ],
  [
    "awdlCompatibility",
    "ios-7-prerelease-awdl-older-seed-compatibility",
    "AWDL compatibility with older seeds",
    "Seed 4 networking changes made AirDrop and Multipeer Connectivity incompatible with earlier seeds.",
    "compatibility",
  ],
  [
    "voiceMemosRestore",
    "ios-7-prerelease-voice-memos-icloud-restore",
    "Voice Memos in iCloud restores",
    "Voice recordings could be omitted when restoring a device from an iCloud backup.",
    "bugFix",
  ],
  [
    "keychainPhoneValidation",
    "ios-7-prerelease-keychain-phone-validation-regions",
    "Phone-validated Keychain restore by region",
    "Users in several countries could not restore Keychain data with phone-number validation.",
    "bugFix",
  ],
  [
    "cellularFallbackRemoved",
    "ios-7-prerelease-cellular-fallback-removed",
    "Cellular fallback removed",
    "The networking behavior that retried failed Wi-Fi connections over cellular was removed from Seed 5.",
    "removal",
  ],
  [
    "addressBookSubclass",
    "ios-7-prerelease-addressbookui-subclassing",
    "AddressBookUI subclassing disallowed",
    "Software built with the iOS 7 toolchain could no longer initialize subclasses of AddressBookUI classes.",
    "developerApi",
  ],
  [
    "backgroundAudioActivation",
    "ios-7-prerelease-background-audio-session-activation",
    "Audio-session activation during background wake",
    "Applications awakened for fetch, transfers, or remote notifications could no longer activate AVAudioSession in the background.",
    "developerApi",
  ],
  [
    "siriGermanVoices",
    "ios-7-prerelease-german-siri-voices",
    "Male and female German Siri voices",
    "Seed 5 documented development versions of both voice options for German rather than only the male voice.",
    "enhancement",
  ],
  [
    "itunesCloudMismatch",
    "ios-7-prerelease-itunes-cloud-unexpected-items",
    "Unexpected iTunes in the Cloud items",
    "Beta 6 corrected a cloud-library fault that could download or play a different purchase than the one selected.",
    "bugFix",
  ],
  [
    "storesWaiting",
    "ios-7-prerelease-store-download-waiting",
    "Store downloads stuck waiting",
    "Application downloads could remain indefinitely in the waiting state before the GM fix.",
    "bugFix",
  ],
  [
    "landscapeAlertPassword",
    "ios-7-prerelease-landscape-alert-password-field",
    "Password fields in landscape alerts",
    "Alert views used for authentication could omit their password fields when an application was in landscape orientation.",
    "bugFix",
  ],
  [
    "vendorIdentifier",
    "ios-7-prerelease-enterprise-vendor-identifier",
    "Vendor identifiers for related enterprise applications",
    "Enterprise or Xcode-installed applications with closely related bundle identifiers could receive the same vendor identifier.",
    "behavior",
  ],
  [
    "betaBirthdays",
    "ios-7-prerelease-beta-contact-birthdays",
    "Contact birthdays created in beta seeds",
    "Birthday dates saved by an earlier beta could display incorrectly and require editing.",
    "knownIssue",
  ],
  [
    "precisionTimers",
    "ios-7-prerelease-high-precision-timer-delay",
    "High-precision timer delay",
    "Very short sleeps or waits could run as much as one millisecond later than requested.",
    "knownIssue",
  ],
  [
    "keychainSyncApiUnavailable",
    "ios-7-prerelease-keychain-sync-api-gm-removal",
    "Synchronizable Keychain APIs unavailable in GM",
    "Keychain synchronization APIs exposed during the beta cycle were absent from the GM SDK.",
    "removal",
  ],
  [
    "itunesRadioRefresh",
    "ios-7-prerelease-itunes-radio-gm-account-refresh",
    "iTunes Radio stations after the GM update",
    "Accounts used with earlier seeds could need a sign-out and sign-in before station changes resumed.",
    "behavior",
  ],
  [
    "safariGmUpgrade",
    "ios-7-prerelease-safari-gm-preferences",
    "Safari preferences when upgrading to GM",
    "Moving from an earlier seed to the GM could lose Safari preference values.",
    "knownIssue",
  ],
  [
    "baselineConstraints",
    "ios-7-prerelease-baseline-constraint-attribute-changes",
    "Baseline constraints after text attribute changes",
    "Changing attributes after baseline-alignment constraints were installed could produce an incorrect layout.",
    "knownIssue",
  ],
  [
    "backIndicatorMask",
    "ios-7-prerelease-back-indicator-transition-mask",
    "Back-indicator transition mask from Interface Builder",
    "A transition mask loaded from a storyboard or xib could be interpreted incorrectly at runtime.",
    "knownIssue",
  ],
];

const definitions = Object.fromEntries(
  definitionRows.map(([name, key, title, canonicalSummary, category]) => [
    name,
    { key, title, canonicalSummary, category },
  ]),
);
if (
  Object.keys(definitions).length !== definitionRows.length ||
  new Set(definitionRows.map((row) => row[1])).size !== definitionRows.length
) {
  throw new Error("The iOS 7 prerelease definition table contains duplicates.");
}

const o = (alias, name, action, component, locator, evidence) => {
  const definition = definitions[name];
  if (!definition) throw new Error(`Unknown iOS 7 change definition: ${name}`);
  return { alias, name, ...definition, action, component, locator, evidence };
};

const selected = [
  o(
    "beta-1",
    "airdropInternet",
    "knownIssue",
    "AirDrop",
    "Known Issues — Contacts Only and active internet",
    "baseline",
  ),
  o(
    "beta-1",
    "airdropDiscovery",
    "knownIssue",
    "AirDrop",
    "Known Issues — peer discovery and transfer over Wi-Fi",
    "baseline",
  ),
  o(
    "beta-1",
    "utiHandler",
    "knownIssue",
    "AirDrop",
    "Known Issues — Uniform Type Identifier app lookup",
    "baseline",
  ),
  o(
    "beta-1",
    "captureBackground",
    "knownIssue",
    "AV Foundation",
    "Known Issues — AVCaptureAudioDataOutput in background",
    "baseline",
  ),
  o(
    "beta-1",
    "calendarSync",
    "knownIssue",
    "Calendar",
    "Known Issues — off-device edits do not push",
    "baseline",
  ),
  o(
    "beta-1",
    "carDisplay",
    "knownIssue",
    "Car Display",
    "Known Issues — compatible systems not yet available",
    "baseline",
  ),
  o(
    "beta-1",
    "groupOpacity",
    "changed",
    "Core Animation",
    "Notes — UIViewGroupOpacity default",
    "baseline",
  ),
  o(
    "beta-1",
    "coreDataMigration",
    "knownIssue",
    "Core Data",
    "Known Issues — migratePersistentStore from local to iCloud",
    "baseline",
  ),
  o(
    "beta-1",
    "gameCenterNewId",
    "knownIssue",
    "Game Center",
    "Known Issues — adding new Apple IDs",
    "baseline",
  ),
  o(
    "beta-1",
    "gameCenterLoginContrast",
    "knownIssue",
    "Game Center",
    "Known Issues — login sheet content contrast",
    "baseline",
  ),
  o(
    "beta-1",
    "gameKitReminder",
    "knownIssue",
    "Game Kit",
    "Known Issues — reminders API present but unimplemented",
    "baseline",
  ),
  o(
    "beta-1",
    "activationLock",
    "introduced",
    "iCloud",
    "Notes — Find My iPhone Activation Lock",
    "baseline",
  ),
  o(
    "beta-1",
    "keychainApprovalKeyboard",
    "knownIssue",
    "iCloud",
    "Known Issues — Keychain approval dialog after unlock",
    "baseline",
  ),
  o(
    "beta-1",
    "keychainCountryDisplay",
    "knownIssue",
    "iCloud",
    "Known Issues — changed phone-country name and code",
    "baseline",
  ),
  o(
    "beta-1",
    "activationEraseCredentials",
    "knownIssue",
    "iCloud",
    "Known Issues — Reset All Contents with Activation Lock",
    "baseline",
  ),
  o(
    "beta-1",
    "keychainIdleApproval",
    "knownIssue",
    "iCloud",
    "Known Issues — approval request on sleeping peers",
    "baseline",
  ),
  o(
    "beta-1",
    "secondaryIcloudToggles",
    "knownIssue",
    "iCloud",
    "Known Issues — secondary-account Find My iPhone and Bookmarks",
    "baseline",
  ),
  o(
    "beta-1",
    "keychainSetupDifficulty",
    "knownIssue",
    "iCloud",
    "Known Issues — rare difficulties setting up iCloud Keychain",
    "baseline",
  ),
  o(
    "beta-1",
    "locationServicesUpgrade",
    "knownIssue",
    "Location Services",
    "Known Issues — disabled after updating",
    "baseline",
  ),
  o(
    "beta-1",
    "iphone4Gps",
    "knownIssue",
    "Location Services",
    "Known Issues — GPS-based location on iPhone 4",
    "baseline",
  ),
  o(
    "beta-1",
    "mapHeading",
    "knownIssue",
    "MapKit",
    "Known Issues — cameraLookingAtCenterCoordinate heading",
    "baseline",
  ),
  o(
    "beta-1",
    "mapSnapshot",
    "knownIssue",
    "MapKit",
    "Known Issues — pointForCoordinate on nonsquare snapshots",
    "baseline",
  ),
  o(
    "beta-1",
    "silentPushWake",
    "knownIssue",
    "Multitasking",
    "Known Issues — silent pushes wake the device",
    "baseline",
  ),
  o(
    "beta-1",
    "backgroundPolicyApi",
    "knownIssue",
    "Multitasking",
    "Known Issues — inspecting background settings",
    "baseline",
  ),
  o(
    "beta-1",
    "mediaPicker",
    "knownIssue",
    "Music Player",
    "Known Issues — MPMediaPickerController disabled",
    "baseline",
  ),
  o(
    "beta-1",
    "newsstandAuth",
    "knownIssue",
    "Newsstand",
    "Known Issues — background authentication callbacks",
    "baseline",
  ),
  o(
    "beta-1",
    "backgroundRefresh",
    "knownIssue",
    "Settings",
    "Known Issues — per-app Background App Refresh switches",
    "baseline",
  ),
  o(
    "beta-1",
    "siriVoicesAbsent",
    "knownIssue",
    "Siri",
    "Known Issues — new voices not in this seed",
    "baseline",
  ),
  o(
    "beta-1",
    "hotspot",
    "knownIssue",
    "USB Tethering",
    "Known Issues — Personal Hotspot",
    "baseline",
  ),
  o(
    "beta-1",
    "voiceMemosAbsent",
    "knownIssue",
    "Voice Memos",
    "Known Issues — VoiceMemos app unavailable",
    "baseline",
  ),
  o(
    "beta-1",
    "voiceoverMaps",
    "knownIssue",
    "VoiceOver",
    "Known Issues — Maps",
    "baseline",
  ),
  o(
    "beta-1",
    "voiceoverSiri",
    "knownIssue",
    "VoiceOver",
    "Known Issues — Siri interaction",
    "baseline",
  ),
  o(
    "beta-1",
    "voiceoverReminders",
    "knownIssue",
    "VoiceOver",
    "Known Issues — Reminders",
    "baseline",
  ),
  o(
    "beta-2",
    "ipadSupport",
    "introduced",
    "Platform availability",
    "Release coverage — Beta 2 iPad version available",
    "beta2Observed",
  ),
  o(
    "beta-2",
    "voiceMemosReturn",
    "introduced",
    "Voice Memos",
    "Observed changes — Voice Memos restored",
    "beta2Observed",
  ),
  o(
    "beta-2",
    "siriVoicesAdded",
    "introduced",
    "Siri",
    "Observed changes — additional male and female voices",
    "beta2Observed",
  ),
  o(
    "beta-2",
    "airdropSeedCompatibility",
    "changed",
    "AirDrop",
    "Notes — AirDrop incompatible across Seed 1 and Seed 2",
    "beta2Retrospective",
  ),
  o(
    "beta-2",
    "passbookValidation",
    "changed",
    "Passbook",
    "Notes — back-field validation corrected in Seed 2 and later",
    "beta2Retrospective",
  ),
  o(
    "beta-2",
    "statusBarManagement",
    "changed",
    "UIKit",
    "Notes — view-controller status bar default starting with Seed 2",
    "beta2Retrospective",
  ),
  o(
    "beta-3",
    "airplayNextTrack",
    "fixed",
    "AirPlay",
    "Fixed in Seed 3 — advancing to the next track",
    "fixed",
  ),
  o(
    "beta-3",
    "airplayVolume",
    "fixed",
    "AirPlay",
    "Fixed in Seed 3 — unexpected audio volume increase",
    "fixed",
  ),
  o(
    "beta-3",
    "keychainApprovalKeyboard",
    "fixed",
    "iCloud",
    "Fixed in Seed 3 — approval-dialog keyboard",
    "fixed",
  ),
  o(
    "beta-3",
    "keychainCountryDisplay",
    "fixed",
    "iCloud",
    "Fixed in Seed 3 — phone-country display",
    "fixed",
  ),
  o(
    "beta-3",
    "activationEraseCredentials",
    "fixed",
    "iCloud",
    "Fixed in Seed 3 — erase credentials and Activation Lock",
    "fixed",
  ),
  o(
    "beta-3",
    "keychainIdleApproval",
    "fixed",
    "iCloud",
    "Fixed in Seed 3 — idle peer approval request",
    "fixed",
  ),
  o(
    "beta-3",
    "secondaryIcloudToggles",
    "fixed",
    "iCloud",
    "Fixed in Seed 3 — secondary-account toggles",
    "fixed",
  ),
  o(
    "beta-3",
    "keychainSetupDifficulty",
    "fixed",
    "iCloud",
    "Fixed in Seed 3 — rare difficulties setting up iCloud Keychain",
    "fixed",
  ),
  o(
    "beta-3",
    "messagesEmptyList",
    "fixed",
    "Messages",
    "Fixed in Seed 3 — clean-install launch",
    "fixed",
  ),
  o(
    "beta-3",
    "messagesDatabase",
    "fixed",
    "Messages",
    "Fixed in Seed 3 — database after restore or upgrade",
    "fixed",
  ),
  o(
    "beta-3",
    "messagesAttachments",
    "fixed",
    "Messages",
    "Fixed in Seed 3 — attachments in two threads",
    "fixed",
  ),
  o(
    "beta-3",
    "mediaPicker",
    "fixed",
    "Music Player",
    "Fixed in Seed 3 — MPMediaPickerController disabled",
    "fixed",
  ),
  o(
    "beta-3",
    "newsstandAuth",
    "fixed",
    "Newsstand",
    "Fixed in Seed 3 — authenticated background downloads",
    "fixed",
  ),
  o(
    "beta-3",
    "backgroundRefresh",
    "fixed",
    "Settings",
    "Fixed in Seed 3 — per-app Background App Refresh",
    "fixed",
  ),
  o(
    "beta-3",
    "crashLogs",
    "fixed",
    "Setup",
    "Fixed in Seed 3 — CrashReporter logs after erase",
    "fixed",
  ),
  o(
    "beta-3",
    "passcodeAutolock",
    "fixed",
    "SpringBoard",
    "Fixed in Seed 3 — Passcode Lock and Auto-Lock",
    "fixed",
  ),
  o(
    "beta-3",
    "pushDelivery",
    "fixed",
    "SpringBoard",
    "Fixed in Seed 3 — duplicate or absent push delivery",
    "fixed",
  ),
  o(
    "beta-3",
    "appSwitcher",
    "fixed",
    "SpringBoard",
    "Fixed in Seed 3 — suspended apps in switcher",
    "fixed",
  ),
  o(
    "beta-3",
    "trustPrompt",
    "fixed",
    "UIKit",
    "Fixed in Seed 3 — trust interface on the device",
    "fixed",
  ),
  o(
    "beta-3",
    "switchTint",
    "fixed",
    "UIKit",
    "Fixed in Seed 3 — UISwitch on tint",
    "fixed",
  ),
  o(
    "beta-3",
    "voiceoverReminders",
    "fixed",
    "VoiceOver",
    "Fixed in Seed 3 — Reminders",
    "fixed",
  ),
  o(
    "beta-3",
    "keychainSeed3Compatibility",
    "changed",
    "iCloud",
    "Seed 3 Notes — Keychain compatibility and re-enable steps",
    "note",
  ),
  o(
    "beta-3",
    "multipeerApis",
    "changed",
    "Multipeer Connectivity",
    "Seed 3 Notes — startStreamWithName and sendResourceAtURL",
    "note",
  ),
  o(
    "beta-3",
    "urlSessionSuspended",
    "changed",
    "Networking",
    "Notes — URL session task initial state",
    "note",
  ),
  o(
    "beta-3",
    "passbookCancelStatus",
    "introduced",
    "Passbook",
    "As of Seed 3 — PKPassLibraryDidCancelAddPasses",
    "note",
  ),
  o(
    "beta-3",
    "keychainPhoneValidation",
    "knownIssue",
    "iCloud",
    "Known Issues — Switzerland and phone-number validation",
    "current",
  ),
  o(
    "beta-4",
    "calendarSync",
    "fixed",
    "Calendar",
    "Fixed in Seed 4 — calendar fetch push and manual refresh",
    "fixed",
  ),
  o(
    "beta-4",
    "calendarDuplicates",
    "fixed",
    "Calendar",
    "Fixed in Seed 4 — duplicate calendars or reminders",
    "fixed",
  ),
  o(
    "beta-4",
    "contactPhotoSync",
    "fixed",
    "Contacts",
    "Fixed in Seed 4 — high-resolution caller photos",
    "fixed",
  ),
  o(
    "beta-4",
    "keychainSingleRestore",
    "fixed",
    "iCloud",
    "Fixed in Seed 4 — single-device backup restore",
    "fixed",
  ),
  o(
    "beta-4",
    "keychainSignoutSetup",
    "fixed",
    "iCloud",
    "Fixed in Seed 4 — setup after sign-out or erase",
    "fixed",
  ),
  o(
    "beta-4",
    "creditCardDeleteSync",
    "fixed",
    "iCloud",
    "Fixed in Seed 4 — deleted AutoFill cards",
    "fixed",
  ),
  o(
    "beta-4",
    "keychainReenable",
    "fixed",
    "iCloud",
    "Fixed in Seed 4 — disable and reenable iCloud Keychain",
    "fixed",
  ),
  o(
    "beta-4",
    "keychainWep",
    "fixed",
    "iCloud",
    "Fixed in Seed 4 — WEP network synchronization",
    "fixed",
  ),
  o(
    "beta-4",
    "keychainSetupKeyboardCover",
    "fixed",
    "iCloud",
    "Fixed in Seed 4 — keyboard covering setup fields",
    "fixed",
  ),
  o(
    "beta-4",
    "epubRestore",
    "fixed",
    "iCloud",
    "Fixed in Seed 4 — non-purchased EPUB and PDF restore",
    "fixed",
  ),
  o(
    "beta-4",
    "urlSessionSuspended",
    "fixed",
    "Networking",
    "Fixed in Seed 4 — URL session task initial state",
    "fixed",
  ),
  o(
    "beta-4",
    "safariAutofill",
    "fixed",
    "Safari",
    "Fixed in Seed 4 — credential AutoFill across site variants",
    "fixed",
  ),
  o(
    "beta-4",
    "safariSettingsReset",
    "fixed",
    "Safari",
    "Fixed in Seed 4 — preferences reset during upgrade",
    "fixed",
  ),
  o(
    "beta-4",
    "webclipSwitcherCrash",
    "fixed",
    "SpringBoard",
    "Fixed in Seed 4 — web clips in app switcher",
    "fixed",
  ),
  o(
    "beta-4",
    "manyAppsCrash",
    "fixed",
    "SpringBoard",
    "Fixed in Seed 4 — hundreds of apps crash repeatedly",
    "fixed",
  ),
  o(
    "beta-4",
    "diacriticalPassword",
    "fixed",
    "SpringBoard",
    "Fixed in Seed 4 — diacritical password characters",
    "fixed",
  ),
  o(
    "beta-4",
    "wifiSync",
    "fixed",
    "Sync",
    "Fixed in Seed 4 — Wi-Fi devices absent in iTunes",
    "fixed",
  ),
  o(
    "beta-4",
    "imagePickerPreview",
    "fixed",
    "UIKit",
    "Fixed in Seed 4 — custom-overlay camera preview",
    "fixed",
  ),
  o(
    "beta-4",
    "pickerCustomViews",
    "fixed",
    "UIKit",
    "Fixed in Seed 4 — custom picker views",
    "fixed",
  ),
  o(
    "beta-4",
    "refreshHidden",
    "fixed",
    "UIKit",
    "Fixed in Seed 4 — associated table view hidden under navigation bar",
    "fixed",
  ),
  o(
    "beta-4",
    "layoutGuides",
    "fixed",
    "UIKit",
    "Fixed in Seed 4 — Interface Builder layout guides",
    "fixed",
  ),
  o(
    "beta-4",
    "refreshTitle",
    "fixed",
    "UIKit",
    "Fixed in Seed 4 — refresh title position",
    "fixed",
  ),
  o(
    "beta-4",
    "addressBookPrivacy",
    "changed",
    "Address Book",
    "Notes — AddressBookUI privacy re-enabled",
    "note",
  ),
  o(
    "beta-4",
    "exchangeIdentifier",
    "changed",
    "Exchange",
    "Notes — DeviceIdentifier returned to iOS 6 behavior",
    "note",
  ),
  o(
    "beta-4",
    "fontHeights",
    "changed",
    "Fonts",
    "Notes — line heights changed from previous seeds",
    "note",
  ),
  o(
    "beta-4",
    "metadataContentTree",
    "introduced",
    "Foundation",
    "Notes — ubiquitous NSMetadataQuery predicates",
    "note",
  ),
  o(
    "beta-4",
    "mediaAppMemory",
    "changed",
    "Media",
    "Notes — last-used app across reboot and crash",
    "note",
  ),
  o(
    "beta-4",
    "taskCompletionPolicy",
    "changed",
    "Multitasking",
    "Notes — task completion policy and time limit",
    "note",
  ),
  o(
    "beta-4",
    "passbookIBeacon",
    "introduced",
    "Passbook",
    "As of Seed 4 — beacon major and minor fields",
    "note",
  ),
  o(
    "beta-4",
    "snapshotApi",
    "changed",
    "UIKit",
    "Notes — snapshot committed state and afterUpdates",
    "note",
  ),
  o(
    "beta-4",
    "backTitle",
    "changed",
    "UIKit",
    "Notes — generic short back title",
    "note",
  ),
  o(
    "beta-4",
    "storeDownloads",
    "knownIssue",
    "Stores",
    "Known Issue — downloads on some iPhone 4 devices",
    "current",
  ),
  o(
    "beta-4",
    "setupCrash",
    "knownIssue",
    "Setup",
    "Known Issue — existing email address",
    "current",
  ),
  o(
    "beta-4",
    "mediaLandscape",
    "knownIssue",
    "UIKit",
    "Known Issue — landscape media-player presentation",
    "current",
  ),
  o(
    "beta-4",
    "webclipFolder",
    "knownIssue",
    "WebKit",
    "Known Issue — pre-Seed 4 web clips and folders",
    "current",
  ),
  o(
    "beta-4",
    "awdlCompatibility",
    "changed",
    "Wi-Fi",
    "Notes — AWDL compatibility with older seeds",
    "note",
  ),
  o(
    "beta-4",
    "voiceMemosRestore",
    "knownIssue",
    "iCloud",
    "Known Issues — Voice Memos in iCloud backups",
    "current",
  ),
  o(
    "beta-4",
    "keychainPhoneValidation",
    "knownIssue",
    "iCloud",
    "Known Issues — Switzerland and phone-number validation",
    "current",
  ),
  o(
    "beta-5",
    "airdropInternet",
    "fixed",
    "AirDrop",
    "Fixed in Seed 5 — Contacts Only internet requirement",
    "fixed",
  ),
  o(
    "beta-5",
    "utiHandler",
    "fixed",
    "AirDrop",
    "Fixed in Seed 5 — UTI application lookup",
    "fixed",
  ),
  o(
    "beta-5",
    "voiceMemosRestore",
    "fixed",
    "iCloud",
    "Fixed in Seed 5 — Voice Memos restore",
    "fixed",
  ),
  o(
    "beta-5",
    "keychainPhoneValidation",
    "fixed",
    "iCloud",
    "Fixed in Seed 5 — phone validation regions",
    "fixed",
  ),
  o(
    "beta-5",
    "safariSettingsReset",
    "fixed",
    "Safari",
    "Fixed in Seed 5 — preferences reset",
    "fixed",
  ),
  o(
    "beta-5",
    "setupCrash",
    "fixed",
    "Setup",
    "Fixed in Seed 5 — existing email address",
    "fixed",
  ),
  o(
    "beta-5",
    "storeDownloads",
    "fixed",
    "Stores",
    "Fixed in Seed 5 — iPhone 4 downloads",
    "fixed",
  ),
  o(
    "beta-5",
    "mediaLandscape",
    "fixed",
    "UIKit",
    "Fixed in Seed 5 — landscape media-player presentation",
    "fixed",
  ),
  o(
    "beta-5",
    "cellularFallbackRemoved",
    "removed",
    "Networking",
    "As of Seed 5 — cellular fallback removed",
    "note",
  ),
  o(
    "beta-5",
    "addressBookSubclass",
    "changed",
    "Address Book",
    "Notes — AddressBookUI classes disallow subclassing",
    "note",
  ),
  o(
    "beta-5",
    "backgroundAudioActivation",
    "changed",
    "Multitasking",
    "Notes — AVAudioSession during background wake",
    "note",
  ),
  o(
    "beta-5",
    "siriGermanVoices",
    "changed",
    "Siri",
    "Notes — male and female German voices",
    "note",
  ),
  o(
    "beta-6",
    "itunesCloudMismatch",
    "fixed",
    "iTunes in the Cloud",
    "Important Information — unexpected purchased items",
    "beta6Fix",
  ),
  o(
    "gm",
    "storesWaiting",
    "fixed",
    "Stores",
    "Fixed in GM Seed — downloads waiting",
    "gmFixed",
  ),
  o(
    "gm",
    "landscapeAlertPassword",
    "fixed",
    "UIKit",
    "Fixed in GM Seed — alert password fields in landscape",
    "gmFixed",
  ),
  o(
    "gm",
    "vendorIdentifier",
    "changed",
    "App Deployment",
    "GM Notes — identifierForVendor for related bundle IDs",
    "gmState",
  ),
  o(
    "gm",
    "betaBirthdays",
    "knownIssue",
    "Contacts",
    "GM Known Issue — birthdays created in beta versions",
    "gmState",
  ),
  o(
    "gm",
    "precisionTimers",
    "knownIssue",
    "High Precision Timers",
    "GM Known Issue — delay up to one millisecond",
    "gmState",
  ),
  o(
    "gm",
    "keychainSyncApiUnavailable",
    "removed",
    "iCloud",
    "GM Notes — kSecAttrSynchronizable APIs unavailable",
    "gmState",
  ),
  o(
    "gm",
    "itunesRadioRefresh",
    "changed",
    "iTunes Radio",
    "GM Notes — account refresh after earlier seeds",
    "gmState",
  ),
  o(
    "gm",
    "safariGmUpgrade",
    "knownIssue",
    "Safari",
    "GM Known Issue — preferences lost during upgrade",
    "gmState",
  ),
  o(
    "gm",
    "baselineConstraints",
    "knownIssue",
    "UIKit",
    "GM Known Issues — attributes after baseline constraints",
    "gmState",
  ),
  o(
    "gm",
    "backIndicatorMask",
    "knownIssue",
    "UIKit",
    "GM Known Issues — transition mask from storyboard or xib",
    "gmState",
  ),
];

const routeMetadata = {
  "beta-1": {
    label: "Beta 1",
    date: "2013-06-10",
    sources: [U.beta1Transcript],
    selection:
      "a representative first-document baseline spanning cloud services, accessibility, media, location, networking, and developer APIs",
  },
  "beta-2": {
    label: "Beta 2",
    date: "2013-06-24",
    sources: [U.beta2Transcript, U.beta3Pdf],
    selection:
      "three source-labeled Seed 2 boundaries and three independently reported user-visible additions",
  },
  "beta-3": {
    label: "Beta 3",
    date: "2013-07-08",
    sources: [U.beta3Pdf, U.beta3Transcript],
    selection:
      "Apple’s explicit Seed 3 fixes, four self-identifying milestone notes, and one retained issue later resolved",
  },
  "beta-4": {
    label: "Beta 4",
    date: "2013-07-29",
    sources: [U.beta4Transcript, U.beta4Corroboration],
    selection:
      "explicit Seed 4 fixes, conservative additions, and current issues needed to explain later fixes",
  },
  "beta-5": {
    label: "Beta 5",
    date: "2013-08-06",
    sources: [U.beta5Transcript, U.beta5Corroboration],
    selection:
      "eight explicit Seed 5 fixes and four milestone-specific platform notes",
  },
  "beta-6": {
    label: "Beta 6",
    date: "2013-08-15",
    sources: [U.beta6Evidence, U.beta6Corroboration],
    selection:
      "the one independently corroborated Beta 6-specific iTunes in the Cloud correction",
  },
  gm: {
    label: "GM",
    date: "2013-09-10",
    sources: [U.gmTranscript, U.gmCorroboration],
    selection:
      "two explicit GM fixes and eight GM-specific compatibility or known-issue records",
  },
};

function evidenceUrls(change) {
  if (change.evidence === "baseline") return [U.beta1Transcript];
  if (change.evidence === "beta2Observed") {
    return [U.beta2Observed, U.beta2ObservedCorroboration];
  }
  if (change.evidence === "beta2Retrospective") {
    return [U.beta3Pdf, U.beta3Transcript];
  }
  return routeMetadata[change.alias].sources;
}

function verificationMethod(change) {
  if (change.evidence === "baseline") {
    return "Matched the component, status heading, and distinctive locator in a fixed 2013 archive snapshot of the complete transcript. A partial institutional PDF verifies the Apple document identity but does not independently supply this detail.";
  }
  if (change.evidence === "beta2Observed") {
    return "Matched independently in two contemporaneous reports. The record is marked partially documented because the surviving cumulative developer transcript does not isolate it as an official release-note delta.";
  }
  if (change.evidence === "beta2Retrospective") {
    return "Matched in two independently preserved Seed 3 reproductions whose text explicitly identifies the behavior as beginning with Seed 2.";
  }
  if (change.evidence === "fixed" || change.evidence === "gmFixed") {
    return `Matched under the source’s explicit fixed heading for ${routeMetadata[change.alias].label} and checked against an independently preserved reproduction.`;
  }
  if (change.evidence === "current" || change.evidence === "gmState") {
    return `Matched under the named component and status in both retained ${routeMetadata[change.alias].label} reproductions. A known-issue action describes milestone state, not first appearance.`;
  }
  if (change.evidence === "beta6Fix") {
    return "Matched in two contemporaneous reproductions of Apple’s Beta 6-specific iTunes in the Cloud notice and remediation.";
  }
  return `Matched as a milestone-specific note in both retained ${routeMetadata[change.alias].label} reproductions; cumulative carry-forward was excluded.`;
}

function occurrence(change) {
  const route = routeMetadata[change.alias];
  const urls = evidenceUrls(change);
  const summary =
    change.action === "fixed"
      ? `The retained ${route.label} evidence places this ${change.component} record in its milestone-specific fixed section.`
      : change.action === "knownIssue"
        ? `The retained ${route.label} state documents this ${change.component} limitation at that milestone without claiming its first appearance.`
        : `The retained ${route.label} evidence identifies this ${change.component} change at the milestone boundary.`;
  return {
    key: change.key,
    title: change.title,
    canonicalSummary: change.canonicalSummary,
    category: change.category,
    action: change.action,
    inheritance: "delta",
    summary,
    documentedStatus:
      change.evidence === "beta2Observed"
        ? "partiallyDocumented"
        : "documented",
    evidenceState: "corroborated",
    verificationMethod: verificationMethod(change),
    citations: urls.map((url) =>
      c(
        url,
        `${change.component} — ${change.locator}`,
        "Original synthesis from the cited milestone evidence.",
      ),
    ),
  };
}

const changesByAlias = new Map();
for (const change of selected) {
  changesByAlias.set(change.alias, [
    ...(changesByAlias.get(change.alias) || []),
    occurrence(change),
  ]);
}

function eventArticle(alias) {
  const changes = changesByAlias.get(alias) || [];
  const changeCitations = uniqueCitations(
    changes.flatMap((change) => change.citations),
  );
  if (alias === "beta-1") {
    return article(
      heading("What survives"),
      prose(
        "A fixed June 2013 archive snapshot preserves a complete transcript of Apple’s first iOS 7 developer notes. Apple’s announcement independently confirms immediate beta availability, while an institutional PDF retains the opening page and developer-document identity.",
        [
          c(
            U.beta1Transcript,
            "Notes and Known Issues — complete retained transcript",
          ),
          c(
            U.beta1Announcement,
            "Availability — beta software and SDK available immediately",
          ),
          c(
            U.beta1PartialPdf,
            "Page 1 — iOS SDK Release Notes for iOS 7.0",
            "Identity and context only; the attachment is not a complete body.",
          ),
        ],
      ),
      heading("Representative baseline"),
      prose(
        `This page structures ${changes.length} high-signal records from the first retained document. They describe what the seed documented across cloud services, accessibility, location, media, networking, and developer APIs; they are not a claim that every behavior first appeared on June 10.`,
        changeCitations,
      ),
      heading("Evidence boundary"),
      prose(
        "The detailed body survives through a publisher transcript rather than an intact first-party download. Every occurrence therefore remains corroborated and explicitly source-linked; editorial approval does not convert that preservation evidence into first-party confirmation, and no build number is inferred from the attachment filename.",
        [
          c(U.beta1Transcript, "Apple-authored release-note transcript"),
          c(
            U.beta1PartialPdf,
            "Preserved opening page and attachment filename",
            "No build assertion is imported.",
          ),
        ],
      ),
    );
  }
  if (alias === "beta-2") {
    return article(
      heading("A deliberately narrow Beta 2 record"),
      prose(
        "The surviving developer transcript is cumulative and cannot safely turn every listed item into a Beta 2 addition. This page instead keeps three later-retained statements that explicitly identify Seed 2 and three user-visible changes reported independently on release day.",
        [
          c(U.beta2Transcript, "Notes and Known Issues — cumulative state"),
          c(U.beta3Pdf, "Pages 2, 7–8, and 10 — statements tied to Seed 2"),
          c(U.beta2Observed, "Beta 2 feature observations"),
          c(
            U.beta2ObservedCorroboration,
            "Independent Beta 2 feature observations",
          ),
        ],
      ),
      heading("Selected coverage"),
      prose(
        `The ${changes.length} structured records cover iPad availability, Voice Memos, Siri voices, AirDrop seed compatibility, Passbook validation, and the UIKit status-bar default. Community-observed features are labeled partially documented and are not represented as Apple release-note quotations.`,
        changeCitations,
      ),
      heading("Evidence gap"),
      prose(
        "No byte-verifiable first-party Beta 2 body was recovered. The page does not claim a complete Beta 1-to-Beta 2 diff, and stale known-issue text in the cumulative transcript is excluded when contemporaneous observation shows the state had changed.",
        [
          c(U.beta2Transcript, "Cumulative Beta 2 transcript boundary"),
          c(U.beta2Observed, "Release-day state comparison"),
          c(U.beta2ObservedCorroboration, "Release-day corroboration"),
        ],
      ),
    );
  }
  if (alias === "beta-3") {
    return article(
      heading("Byte-verifiable Seed 3 document"),
      prose(
        "A twelve-page PDF preserves Apple’s Seed 3 title, component structure, fixed headings, developer URL, and July 2013 footer. A fixed BGR archive snapshot independently reproduces the same milestone document.",
        [
          c(U.beta3Pdf, "Pages 1–12 — iOS 7 Seed 3 release notes"),
          c(
            U.beta3Transcript,
            "Notes and Known Issues — complete Seed 3 transcript",
          ),
        ],
      ),
      heading("Structured release delta"),
      prose(
        `The page includes ${changes.length} records: ${changes.filter((change) => change.action === "fixed").length} items from explicit fixed sections, four notes that name Seed 3 or establish a clear API-state boundary, and one current issue retained because later seeds explicitly carry and fix it. General cumulative notes are not relabeled as new.`,
        changeCitations,
      ),
      heading("Preservation and copyright boundary"),
      prose(
        "Both public copies reproduce an Apple-authored developer document. The article uses new summaries, retains only necessary product and API identifiers, and credits the preserving publishers rather than presenting their copies as first-party hosting.",
        [
          c(U.beta3Pdf, "Apple-authored PDF preserved by iPod.info.pl"),
          c(U.beta3Transcript, "Apple-authored transcript preserved by BGR"),
        ],
      ),
    );
  }
  if (alias === "beta-4") {
    return article(
      heading("Preserved Seed 4 state"),
      prose(
        "A fixed BGR archive snapshot and a separate contemporaneous reproduction preserve the Seed 4 developer changelog. Their matching component and status structure supports direct attachment of explicit fixes and a conservative comparison against the Seed 3 PDF.",
        [
          c(U.beta4Transcript, "Complete Seed 4 transcript"),
          c(U.beta4Corroboration, "Independent Seed 4 reproduction"),
          c(U.beta3Pdf, "Seed 3 preceding state", "Comparison boundary only."),
        ],
      ),
      heading("Structured release delta"),
      prose(
        `The ${changes.length} selected records include ${changes.filter((change) => change.action === "fixed").length} entries from explicit fixed sections. New notes are included only when Seed 4 language or the exact preceding state supports the boundary; current issues are labeled as state rather than first appearance.`,
        changeCitations,
      ),
      heading("Editorial boundary"),
      prose(
        "The source pages are reproductions of developer material, not a license to republish it. This page paraphrases each selected record, preserves short technical names only for identification, and makes no claim that the selection is an exhaustive user-visible changelog.",
        [
          c(U.beta4Transcript, "Seed 4 evidence boundary"),
          c(U.beta4Corroboration, "Seed 4 corroboration boundary"),
        ],
      ),
    );
  }
  if (alias === "beta-5") {
    return article(
      heading("Preserved Seed 5 state"),
      prose(
        "A fixed BGR archive snapshot and a contemporaneous iDevice.ro reproduction preserve matching Seed 5 developer-note sections. The two copies support a focused set of explicit fixes and milestone-labeled changes.",
        [
          c(U.beta5Transcript, "Complete Seed 5 transcript"),
          c(U.beta5Corroboration, "Independent Seed 5 reproduction"),
        ],
      ),
      heading("Structured release delta"),
      prose(
        `The page contains ${changes.length} records: ${changes.filter((change) => change.action === "fixed").length} explicit Seed 5 fixes and four notes with a defensible milestone boundary. Repeated issues keep the same canonical identity used on earlier prerelease pages.`,
        changeCitations,
      ),
      heading("Evidence boundary"),
      prose(
        "The cumulative sections contain older context that is not promoted into this release delta. Reader-facing text is original synthesis, and both the Apple-authored material and each preserving publisher are identified in the source record.",
        [
          c(U.beta5Transcript, "Seed 5 fixed and notes headings"),
          c(U.beta5Corroboration, "Matching Seed 5 headings"),
        ],
      ),
    );
  }
  if (alias === "beta-6") {
    return article(
      heading("One isolated Beta 6 correction"),
      prose(
        "Two contemporaneous sources reproduce Apple’s Beta 6-specific notice about an iTunes in the Cloud library fault and the required reset procedure. That unique notice is separable from the otherwise cumulative changelog.",
        [
          c(U.beta6Evidence, "Important information about media libraries"),
          c(
            U.beta6Corroboration,
            "Independent reproduction of the cloud-library correction",
          ),
        ],
      ),
      heading("Why this page is short"),
      prose(
        "Only the independently corroborated cloud-media correction is structured. The broader developer notes available with Beta 6 largely carry prior state, so they are not presented as fresh changes without an isolatable milestone label.",
        changeCitations,
      ),
      heading("Editorial boundary"),
      prose(
        "The remediation is summarized rather than copied, and no unsupported claim of a complete Beta 6 delta or build identity is made.",
        [
          c(U.beta6Evidence, "Beta 6 notice and remediation"),
          c(U.beta6Corroboration, "Beta 6 notice corroboration"),
        ],
      ),
    );
  }
  return article(
    heading("Preserved Gold Master state"),
    prose(
      "A fixed BGR archive snapshot and a contemporaneous IntoMobile reproduction preserve matching GM headings. The document explicitly labels two fixes and separately identifies compatibility changes and unresolved GM issues.",
      [
        c(U.gmTranscript, "Complete GM transcript"),
        c(U.gmCorroboration, "Independent GM reproduction"),
      ],
    ),
    heading("Structured release delta"),
    prose(
      `The page contains ${changes.length} records: two explicit GM fixes and eight GM-specific state changes or known issues. General notes carried from earlier seeds are excluded.`,
      changeCitations,
    ),
    heading("GM is not the Public page"),
    prose(
      "This event remains a prerelease archive entry. Apple’s public update record belongs to the separately owned September 18 route, which this batch neither replaces nor patches.",
      [
        c(U.gmTranscript, "GM Seed title and fixed headings"),
        c(U.finalNotes, "iOS 7 public update boundary"),
      ],
    ),
  );
}

const events = Object.keys(routeMetadata).map((alias) => {
  const route = routeMetadata[alias];
  const changes = changesByAlias.get(alias) || [];
  return {
    target: {
      releaseVersionId: "version-ios-7-0",
      routeAlias: alias,
    },
    authorship: "originalSynthesis",
    summary: `iOS 7 ${route.label} is represented by ${changes.length} source-supported ${changes.length === 1 ? "record" : "records"} from ${route.selection}; cumulative carry-forward, unsupported build identity, and unbounded inference are excluded.`,
    article: eventArticle(alias),
    citations: uniqueCitations([
      ...route.sources.map((url) =>
        c(url, `${route.label} release-note evidence`),
      ),
      ...(alias === "beta-1"
        ? [
            c(
              U.beta1Announcement,
              "Availability — developer beta available immediately",
            ),
            c(
              U.beta1PartialPdf,
              "Opening page — Apple developer-document identity",
            ),
          ]
        : []),
      ...(alias === "beta-2"
        ? [
            c(U.beta2Observed, "Release-day feature observations"),
            c(
              U.beta2ObservedCorroboration,
              "Independent release-day observations",
            ),
          ]
        : []),
      ...(alias === "beta-4"
        ? [c(U.beta3Pdf, "Preceding Seed 3 state", "Comparison boundary only.")]
        : []),
      ...(alias === "gm"
        ? [
            c(
              U.finalNotes,
              "Public iOS 7 update record",
              "Final-release boundary only.",
            ),
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

const expectedSeedInventory = [
  {
    platform: "iOS",
    majorVersion: 7,
    version: "7.0",
    releaseStatus: "released",
    publicReleaseDate: "2013-09-18",
    releaseNotesUrl: undefined,
    milestones: [
      ["Beta 1", "2013-06-10", false, undefined],
      ["Beta 2", "2013-06-24", false, undefined],
      ["Beta 3", "2013-07-08", false, undefined],
      ["Beta 4", "2013-07-29", false, undefined],
      ["Beta 5", "2013-08-06", false, undefined],
      ["Beta 6", "2013-08-15", false, undefined],
      ["GM", "2013-09-10", false, undefined],
      ["Public", "2013-09-18", false, undefined],
    ],
  },
];

const stableValue = (value) => {
  if (Array.isArray(value)) return value.map(stableValue);
  if (!value || typeof value !== "object") return value;
  return Object.fromEntries(
    Object.entries(value)
      .sort(([left], [right]) => left.localeCompare(right))
      .map(([key, item]) => [key, stableValue(item)]),
  );
};

const seed = JSON.parse(
  readFileSync(join(here, "..", "seed-data.json"), "utf8"),
);
const seedInventory = seed.releaseVersions
  .filter((version) => version.platform === "iOS" && version.version === "7.0")
  .map((version) => ({
    platform: version.platform,
    majorVersion: version.majorVersion,
    version: version.version,
    releaseStatus: version.releaseStatus,
    publicReleaseDate: version.publicReleaseDate,
    releaseNotesUrl: version.releaseNotesUrl,
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
    "The exact local iOS 7.0 seed inventory changed; re-audit the cohort before regenerating.",
  );
}

const expectedCounts = new Map([
  ["beta-1", 33],
  ["beta-2", 6],
  ["beta-3", 26],
  ["beta-4", 38],
  ["beta-5", 12],
  ["beta-6", 1],
  ["gm", 10],
]);
const expectedRoutes = new Set(
  [...expectedCounts.keys()].map((alias) => `version-ios-7-0/${alias}`),
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
  new Set(actualRoutes).size !== expectedRoutes.size ||
  actualRoutes.some((route) => !expectedRoutes.has(route)) ||
  events.some(
    (event) =>
      Object.keys(event.target).sort().join(",") !==
        "releaseVersionId,routeAlias" ||
      event.authorship !== "originalSynthesis" ||
      event.provenanceStatus !== "editoriallyVerified" ||
      event.editorialReview.status !== "approved" ||
      event.editorialReview.reviewedAt !== reviewedAt ||
      event.isIndexable !== true ||
      event.changes.length !== expectedCounts.get(event.target.routeAlias) ||
      event.changes.some(
        (change) =>
          change.evidenceState !== "corroborated" ||
          change.inheritance !== "delta" ||
          /seed-identity|testflight-build|build-identity|community-observation/i.test(
            change.key,
          ),
      ),
  )
) {
  throw new Error("The expected iOS 7 prerelease bundle closure failed.");
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
      `iOS 7 prerelease change definition drifted for ${occurrence.key}.`,
    );
  }
  localChangeDefinitions.set(occurrence.key, definition);
}
const uniqueLocalChangeKeys = [...localChangeDefinitions.keys()];

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
    for (const change of owner.changes || []) {
      if (!otherChangeKeys.has(change.key)) {
        otherChangeKeys.set(change.key, file);
      }
    }
  }
}
const collisions = uniqueLocalChangeKeys.filter((key) =>
  otherChangeKeys.has(key),
);
if (collisions.length > 0) {
  throw new Error(
    `iOS 7 prerelease change keys collide with existing content: ${collisions
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

const publicBatch = JSON.parse(
  readFileSync(join(here, "apple-ios-7.json"), "utf8"),
);
const publicOwners = (publicBatch.events || []).filter(
  (event) =>
    event.target?.releaseVersionId === "version-ios-7-0" &&
    event.target?.routeAlias === "public",
);
if (
  publicOwners.length !== 1 ||
  publicOwners[0].editorialReview?.status !== "approved" ||
  publicOwners[0].provenanceStatus !== "editoriallyVerified" ||
  publicOwners[0].isIndexable !== true
) {
  throw new Error(
    "The approved iOS 7.0 Public owner changed; re-audit route ownership.",
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
const routeRows = events
  .map(
    (event) =>
      `| ${routeMetadata[event.target.routeAlias].label} | \`${event.target.routeAlias}\` | ${event.changes.length} | ${event.changes.filter((change) => change.action === "fixed").length} | ${event.changes.filter((change) => change.action === "knownIssue").length} |`,
  )
  .join("\n");
const routeVerificationRows = events
  .map(
    (event) =>
      `| \`/apple/ios/7.0/${event.target.routeAlias}/\` | 200 | yes | ${event.changes.length}/${event.changes.length} | yes | no | no |`,
  )
  .join("\n");
const sourceLedger = sources
  .map(
    (source) =>
      `- [${source.title}](${source.url}) — ${source.publisher}; ${source.sourceClass}.`,
  )
  .join("\n");

const md = `# Apple iOS 7 prerelease archive batch

## Result

\`${outputName}\` is the independently reviewed editorial overlay for all seven
existing iOS 7.0 prerelease routes.

- ${events.length} substantive event overlays and no release-version overlays
- ${changeCount} source-backed change occurrences across
  ${uniqueLocalChangeKeys.length} stable, collision-checked definitions
- ${sources.length} declared and used sources with ${citationCount} citation
  references
- zero builds, build-number claims, route creation, or Public-route changes
- every event is \`editoriallyVerified\`, approved at \`${reviewedAt}\`, and
  \`isIndexable: true\`

## Approved route closure

| Milestone | Existing alias | Selected changes | Fixed | Current known |
| --- | --- | ---: | ---: | ---: |
${routeRows}

The local iOS 7.0 seed contains eight milestones. Public is already owned by the
approved \`apple-ios-7.json\` batch and is untouched.

## Evidence method

1. Beta 1 uses a clean June 15, 2013 Internet Archive snapshot of a complete
   Apple Developer transcript. Apple Newsroom confirms immediate beta
   availability, and an MIT-hosted one-page PDF independently retains the
   Apple document identity. The PDF is explicitly partial and supports no
   individual change claim.
2. Beta 2 is intentionally narrow. Three records rely on Seed 2-specific
   language preserved independently by the Seed 3 PDF and fixed BGR Seed 3
   transcript. Three visible additions use two contemporaneous publishers and
   remain \`partiallyDocumented\`. The fixed BGR Beta 2 page establishes the
   release boundary only; stale cumulative text is not treated as a full
   milestone delta.
3. Beta 3 uses a byte-verifiable twelve-page PDF plus a fixed BGR snapshot.
   Twenty-one records come from explicit fixed sections; five additional
   records use self-identifying Seed 3 or clear milestone-state language.
4. Beta 4 and Beta 5 use fixed BGR archive states with independently retained
   reproductions. Explicit fixed headings are attached directly. Additions are
   limited to self-dating notes or conservative comparison with the exact
   preceding retained state.
5. Beta 6 is limited to the independently reproduced iTunes in the Cloud
   correction. The cumulative body is not presented as a fresh change set.
6. GM uses two matching reproductions for its two explicit fixes and eight
   GM-specific compatibility or known-issue records. General carry-forward is
   excluded, and Public remains a separate event.

## Raw-source audit ledger

| State | Integrity model | Bytes / pages | SHA-256 | Use |
| --- | --- | ---: | --- | --- |
| Apple Beta 1 announcement | normalized live \`article\`; identical across two fetches | 8,888 bytes | \`919076459f09771267960439625dd4efd996aad9fb418f0cfe7a54c0665d2d5b\` | Beta 1 timing |
| Phones Review Beta 1 archive | exact fixed replay body | 54,740 bytes | \`68a334e90baefee0cc7bfeb2246bc7208cb674aee337973f816dddd642aa097a\` | Beta 1 body |
| MIT Beta 1 partial PDF | exact file; every page visually checked | ${verification.beta1PartialPdfBytes.toLocaleString("en-US")} bytes / ${verification.beta1PartialPdfPages} page | \`55f499340bc8f22d183055da470e51fba14b91a7cc2154035e067cf67ef2e039\` | Identity only |
| BGR Beta 2 archive | exact fixed replay body | 89,809 bytes | \`44be434cf3663f7cd8cc12e5f5bd92d0f210c6daac39e37a7f88864ecab8860b\` | Seed 2 release boundary |
| iDownloadBlog Beta 2 | normalized live article; identical across two fetches | 2,091 bytes | \`a86212f017c3981eacf2ff944d1ac44e3dde05c9096786c9178ff40dc5e77529\` | Visible changes |
| 9to5Mac Beta 2 | normalized live article; identical across two fetches | 2,971 bytes | \`0db0868c37c13afee382d4f43faeef11904083486206eae15218dd4c2e64230b\` | Visible-change corroboration |
| Apple-authored Beta 3 PDF mirror | exact file; every page visually checked | ${verification.beta3PdfBytes.toLocaleString("en-US")} bytes / ${verification.beta3PdfPages} pages | \`7006fff69aef3ab6ac3203cce5788be9a774d93247da8c8c7b7499061047060e\` | Beta 3 body and Beta 2 retrospective labels |
| BGR Beta 3 archive | exact fixed replay body | 88,140 bytes | \`663519c5b94206956a8a9121374c59b0e5b88a0b339a327164b37b1f9972a617\` | Beta 3 corroboration |
| BGR Beta 4 archive | exact fixed replay body | 85,231 bytes | \`421f4a660769db44bc2822ce3c4c3b08b18f5aa687024c4b8c97f1f49ca49042\` | Beta 4 body |
| Wccftech Beta 4 | normalized live article; identical across two fetches | 22,576 bytes | \`ddc4a6c4e5072f1daaa713d807da3c0c5914e8e69c3d6f968c138a6d2f064365\` | Beta 4 corroboration |
| BGR Beta 5 archive | exact fixed replay body | 81,678 bytes | \`b1ac7ad90ecde73581f676cc3ca889db53cb349259f4be0d3b4f54af0d31a6df\` | Beta 5 body |
| iDevice.ro Beta 5 | normalized live changelog block; identical across two fetches | 26,705 bytes | \`b26bfcbb2272ea9ceff7de5a04755b1c15683565d19099e19f4df616b3b46916\` | Beta 5 corroboration |
| iDevice.ro Beta 6 | normalized live article; identical across two fetches | 19,197 bytes | \`b3f4f52636de53be15de8ba92d5d60e7ca8743e6585a5d720b98c421ac99fa73\` | Beta 6 notice |
| iDownloadBlog Beta 6 | normalized live article; identical across two fetches | 1,336 bytes | \`c7ed5e41aca1dc3536c0b46e5e02a437def2ab0aac9d1645f6afdefc1438eb62\` | Beta 6 corroboration |
| BGR GM archive | exact fixed replay body | 83,440 bytes | \`ffe6720847b96f0349b358de1f1a10f9e88535bc27b827e677d9e588d6efe3e2\` | GM body |
| IntoMobile GM | normalized live article; identical across two fetches | 16,422 bytes | \`3e1397ad025f1e9d8773d703bf15bfd0d8a11e581a1aa16c6d274d1e2faf0ee4\` | GM corroboration |
| Apple final notes | normalized live support body; identical across two fetches | 11,100 bytes | \`d02b2881d61fe9b6a7741dc71b2834dfff3a4fe4fa8fdc2957d7ce3b36818a0d\` | Public boundary only |

Fixed Internet Archive citations use timestamped \`id_\` replays without toolbar
rewriting. Live pages were independently fetched twice: wrapper bytes were
allowed to vary, while each scoped article or changelog body reproduced the
same normalized hash. Both PDFs were rendered and checked page by page. The
executable audits assert 190 HTML locators, 29 PDF-backed citations, 30
distinctive PDF probes, route closure, and canonical recurrence.

## Copyright and editorial method

Every title, canonical summary, article paragraph, and occurrence summary is
original synthesis. Technical identifiers and product names are retained only
where needed to identify an API, framework, setting, or affected feature. The
manifest does not republish Apple’s lists or publisher prose.

Third-party hosts are credited as preservation or journalistic sources, while
Apple is identified as the author of the reproduced developer material. No
mirror is described as first-party hosting. Community-observed Beta 2 features
are explicitly separated from developer-note evidence.

Repeated defects retain one canonical identity as they move from a current
known issue to a later fixed section. This supports a wiki-style history without
presenting cumulative documentation as a fresh release delta.

## Exact evidence gaps

- No complete first-party-hosted Beta 1 document remains in the audited public
  set. The detailed body comes from a fixed publisher transcript; the
  institutional PDF retains only its opening page.
- No byte-verifiable first-party Beta 2 body was recovered. The surviving
  Beta 2 transcript establishes the date but does not support the three
  retrospective Seed 2 claims; those are included only because both retained
  Seed 3 reproductions explicitly date them. The other three records use two
  independent release-day reports.
- The Beta 3 PDF and the later milestone bodies are preserved by third parties.
  All occurrences therefore remain corroborated rather than confirmed.
- Beta 4 and Beta 5 selections are high-signal, not claims that every paragraph
  in a cumulative developer document was newly introduced.
- A photo-thumbnail note found in the retained Beta 5 material is not
  backdated to Beta 4 or presented as a fresh Beta 5 delta.
- Beta 6 supports one isolated correction. Other milestone changes remain an
  explicit evidence gap.
- No complete first-party build-number set was retained. The batch creates no
  build documents and makes no build assertion.
- Public is already covered by the approved iOS 7 batch and is neither
  duplicated nor patched here.

## Source ledger

All declared sources were accessed on ${accessedAt}.

${sourceLedger}

## Closure guards

- Exact comparison against the local iOS 7.0 seed record and all eight
  milestones
- Exact seven-route allowlist with explicit exclusion of Public
- Approved/indexable ownership check for the existing Public route
- Zero versions and zero builds
- Collision scan across every other research-batch JSON plus
  \`apple-launch-content-2026.json\`
- ${changeCount} occurrences resolve to exactly
  ${uniqueLocalChangeKeys.length} stable local definitions
- Raw-state audits resolve 190 HTML citations and delegate 29 PDF citations to
  30 exact text probes across the complete rendered PDF states
- Canonical-history guard preserves 20 repeated definitions, including the
  Beta 3 → Beta 4 → Beta 5 phone-validation transition
- Explicit rejection of identity, build, community-observation, and
  administrative keys
- Complete unique source declaration/use closure
- Deterministic formatted JSON SHA-256: \`${jsonSha}\`

## Editorial approval and validation record

The independently re-fetched and audited event overlays are approved:

- provenance: \`editoriallyVerified\`
- editorial status: \`approved\` at \`${reviewedAt}\`
- indexability: \`true\`

Verified on ${accessedAt}:

- \`npm run research:validate\`: ${verification.researchBatches} batches
  validated;
  this cohort reports ${events.length} events, ${changeCount} changes,
  ${sources.length} sources, and ${citationCount} citations;
  ${verification.globalChangeKeys.toLocaleString("en-US")} change keys are
  globally consistent
- focused ingestion/manifest suite: ${verification.focusedTests} tests passed
- HTML-state audit: 8 exact fixed snapshots and 15 normalized live-source
  states, with 190 locator assertions and all 29 PDF-backed citations
  delegated to the PDF audit
- PDF audit: the one-page Beta 1 identity fragment and all 12 Beta 3 pages were
  rendered and reviewed; 30 distinctive probes close 26 selected Beta 3
  occurrences and the three retrospective Seed 2 claims
- canonical recurrence audit: 20 repeated definitions retain one stable
  identity across milestones, including the Beta 3 → Beta 4 → Beta 5
  phone-validation sequence
- copyright-similarity scan:
  ${verification.copyrightFields.toLocaleString("en-US")} reader-facing fields
  checked against the retained raw evidence; the longest contiguous overlap was
  ${verification.maximumEditorialOverlapWords} words
- full repository suite: ${verification.fullTests} tests passed
- ESLint, Prettier check, and \`git diff --check\`: passed
- applied production plan: ${dryRun.creates} creates,
  ${dryRun.patches} revision-guarded patches, and ${dryRun.unchanged} unchanged
  documents
- create split: ${dryRun.sourceCreates} sources and
  ${dryRun.changeCreates} stable change documents
- mutation payload: ${dryRun.mutationPayloadBytes.toLocaleString("en-US")} bytes
- production plan SHA: \`${dryRun.planSha}\`
- plan artifact SHA-256: \`${dryRun.planArtifactSha}\`
- rollback artifact SHA-256: \`${dryRun.rollbackArtifactSha}\`
- seven planned patches target the exact existing Beta 1–6 and GM event
  documents; each sets only article body, changes, citations, editorial
  review, indexability, provenance, and summary
- one planned patch targets the exact reused Apple Support source and fills
  only author, publication date, and topics

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
Each response returned the complete archival article, every expected structured
change title, and References. No response returned placeholder copy or a
\`noindex\` directive.

| Canonical route | HTTP | Full article | Expected changes | References | Placeholder | Noindex |
| --- | ---: | --- | --- | --- | --- | --- |
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

Reproduce with:

\`\`\`sh
node scripts/research-batches/build-apple-ios-7-prerelease.mjs
node scripts/research-batches/audit-ios7-prerelease-html-states.mjs scripts/research-batches/apple-ios-7-prerelease.json EVIDENCE_DIRECTORY
swift -sdk /Library/Developer/CommandLineTools/SDKs/MacOSX15.4.sdk -module-cache-path tmp/pdfs/swift-module-cache scripts/research-batches/audit-ios7-prerelease-pdf-state.swift EVIDENCE_DIRECTORY/beta1-partial.pdf EVIDENCE_DIRECTORY/beta3.pdf
npm run research:validate
node --import tsx --test tests/launch-content-ingestion.test.ts tests/launch-content-manifest.test.ts
npx eslint scripts/research-batches/build-apple-ios-7-prerelease.mjs
npx prettier --check scripts/research-batches/build-apple-ios-7-prerelease.mjs scripts/research-batches/apple-ios-7-prerelease.json scripts/research-batches/apple-ios-7-prerelease.md
npx sanity exec scripts/ingest-launch-content.ts --with-user-token -- --content scripts/research-batches/apple-ios-7-prerelease.json
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
      uniqueChangeKeys: uniqueLocalChangeKeys.length,
      sources: sources.length,
      citations: citationCount,
      sha256: jsonSha,
    },
    null,
    2,
  ),
);
