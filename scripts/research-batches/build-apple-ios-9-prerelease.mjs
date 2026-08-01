import { createHash } from "node:crypto";
import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import prettier from "prettier";

const here = dirname(fileURLToPath(import.meta.url));
const outputName = "apple-ios-9-prerelease.json";
const ledgerName = "apple-ios-9-prerelease.md";
const accessedAt = "2026-07-30";
const reviewedAt = "2026-07-30T10:22:45Z";

const dryRun = {
  creates: 109,
  patches: 4,
  unchanged: 2078,
  sourceCreates: 7,
  changeCreates: 102,
  mutationPayloadBytes: 324_254,
  planSha: "1df66086e116ab4a9a7c17720409403d16cd1e5296893b202b4592a83b371bb2",
  planArtifactSha:
    "8438d3c77c975f74adee008223b4ad32ba09b18cd76ff33de953dd96de3d1c24",
  rollbackArtifactSha:
    "cedb66305c5a9ee1dd2180e759c3960018386d8ba2b2e3b91d6af012fc6528fb",
};
const verification = {
  researchBatches: 61,
  globalChangeKeys: 3619,
  focusedTests: 19,
  fullTests: 131,
  locatorAssertions: 419,
  directAppleAssertions: 315,
  transitionFragments: 18,
  readerFacingFields: 586,
  sourceBodies: 7,
  maximumEditorialOverlapWords: 5,
};
const publication = {
  transactionId: "tt1fSB5HY9GAB0YLyyj5s6",
  receiptSha:
    "d7e336f49688c4c1395624e35e1f5346b918dd2a96988ea96f893d12b536a571",
  immediateZeroPlanSha:
    "226adaf93c0b2e26ebd86dd139896a0b693b37ea0461ea3e9cb8a114fc968d3c",
  immediateZeroPlanArtifactSha:
    "13908a0ca471e3db2bd04d7390feca5f611a4071d9de774d2f2d3b52d00937ed",
  immediateZeroRollbackArtifactSha:
    "495923a2fcb109ef375104b399b8c7f99f3dbd2ffa893a60b9fe865ec1878802",
  immediateZeroCreates: 0,
  immediateZeroPatches: 0,
  immediateZeroUnchanged: 2191,
  immediateZeroPayloadBytes: 16,
  coverage: {
    fullVersions: 410,
    totalVersions: 410,
    fullAppearances: 413,
    sourceLinkedAppearances: 256,
    timelineOnlyAppearances: 1310,
    totalAppearances: 1979,
    approvedStructuredAppearances: 564,
  },
};

const appleDocRoot =
  "https://developer.apple.com/library/prerelease/ios/releasenotes/General/RN-iOSSDK-9.0";
const U = {
  beta1:
    "https://web.archive.org/web/20260116162733/https://www.bgr.com/general/ios-9-beta-download-link-how-to-install/",
  beta1Announcement:
    "https://www.apple.com/newsroom/2015/06/08Apple-Previews-iOS-9/",
  beta2Context: "https://www.v2ex.com/t/200680",
  beta3: `https://web.archive.org/web/20150715110247/${appleDocRoot}/index.html`,
  beta4: `https://web.archive.org/web/20150722023232/${appleDocRoot}/`,
  beta5: `https://web.archive.org/web/20150814002045/${appleDocRoot}/index.html`,
  final: `https://web.archive.org/web/20150919124943/${appleDocRoot}/index.html`,
};

const sources = [
  {
    url: U.beta1,
    title:
      "Apple Just Released iOS 9 Beta 1 — archived reproduction of Apple’s release notes",
    publisher: "BGR via Internet Archive",
    sourceClass: "archive",
    author: "Zach Epstein",
    publishedAt: "2015-06-08T19:30:42.000Z",
    topics: [
      "iOS",
      "9.0",
      "Beta 1",
      "Apple Developer release notes",
      "historical reproduction",
    ],
  },
  {
    url: U.beta1Announcement,
    title: "Apple Previews iOS 9",
    publisher: "Apple Newsroom",
    sourceClass: "firstPartyAnnouncement",
    author: "Apple",
    publishedAt: "2015-06-08T00:00:00.000Z",
    topics: ["iOS", "9.0", "Beta 1", "availability", "WWDC 2015"],
  },
  {
    url: U.beta2Context,
    title: "Contemporaneous iOS 9 Beta 2 release-note link",
    publisher: "V2EX",
    sourceClass: "community",
    author: "camillo",
    publishedAt: "2015-06-23T19:02:40.000Z",
    topics: [
      "iOS",
      "9.0",
      "Beta 2",
      "Apple Developer URL",
      "historical context",
    ],
  },
  {
    url: U.beta3,
    title: "iOS SDK Release Notes for iOS 9 Beta 3 (preserved snapshot)",
    publisher: "Apple Developer via Internet Archive",
    sourceClass: "archive",
    author: "Apple",
    publishedAt: "2015-07-08T00:00:00.000Z",
    topics: ["iOS", "9.0", "Beta 3", "historical release notes"],
  },
  {
    url: U.beta4,
    title: "iOS SDK Release Notes for iOS 9 Beta 4 (preserved snapshot)",
    publisher: "Apple Developer via Internet Archive",
    sourceClass: "archive",
    author: "Apple",
    publishedAt: "2015-07-21T00:00:00.000Z",
    topics: ["iOS", "9.0", "Beta 4", "historical release notes"],
  },
  {
    url: U.beta5,
    title: "iOS SDK Release Notes for iOS 9 Beta 5 (preserved snapshot)",
    publisher: "Apple Developer via Internet Archive",
    sourceClass: "archive",
    author: "Apple",
    publishedAt: "2015-08-07T00:00:00.000Z",
    topics: ["iOS", "9.0", "Beta 5", "historical release notes"],
  },
  {
    url: U.final,
    title: "iOS SDK Release Notes for iOS 9 (preserved final snapshot)",
    publisher: "Apple Developer via Internet Archive",
    sourceClass: "archive",
    author: "Apple",
    publishedAt: "2015-09-11T00:00:00.000Z",
    topics: ["iOS", "9.0", "final SDK state", "archive boundary"],
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

const definitions = {};
const d = (key, title, canonicalSummary, category) => {
  if (definitions[key]) {
    throw new Error(`Duplicate local definition: ${key}`);
  }
  definitions[key] = { key, title, canonicalSummary, category };
  return key;
};

const K = {
  airplay: d(
    "ios-9-beta-airplay-connectivity",
    "AirPlay connectivity with Apple TV",
    "The initial beta could require network alignment or device restarts before AirPlay would connect to Apple TV.",
    "bugFix",
  ),
  purchasePrompt: d(
    "ios-9-beta-in-app-purchase-double-prompt",
    "Duplicate sandbox purchase credentials",
    "A first in-app purchase could request the buyer’s credentials twice.",
    "bugFix",
  ),
  appleIdEmail: d(
    "ios-9-beta-apple-id-primary-email-authentication",
    "Authentication after changing an Apple ID email",
    "Changing the primary Apple ID email could prevent authentication on the device.",
    "bugFix",
  ),
  applePayShipping: d(
    "ios-9-beta-apple-pay-shipping-name-field",
    "Apple Pay shipping-name request",
    "Requesting only the shipping recipient’s name could stop the Apple Pay sheet from appearing.",
    "compatibility",
  ),
  avQueueMixedMedia: d(
    "ios-9-beta-avqueueplayer-mixed-media",
    "Mixed media in AVQueuePlayer",
    "AVQueuePlayer gained support for queues containing both local files and HTTP Live Streaming items.",
    "developerApi",
  ),
  avPlayerInterruption: d(
    "ios-9-beta-avplayer-interruption-behavior",
    "AVPlayer media-interruption behavior",
    "Applications linked against iOS 9 interrupted other media only when playback actually began.",
    "behavior",
  ),
  pictureInPictureReplacement: d(
    "ios-9-beta-picture-in-picture-item-replacement",
    "Picture in Picture after replacing a player item",
    "Replacing the current AVPlayer item could stop Picture in Picture and remove its control.",
    "knownIssue",
  ),
  bluetoothCallAudio: d(
    "ios-9-beta-bluetooth-call-audio-routing",
    "Incoming-call audio on Bluetooth headsets",
    "Some Bluetooth headsets could fail to receive audio from an incoming cellular call.",
    "bugFix",
  ),
  carPlayPowerOff: d(
    "ios-9-beta-carplay-power-off-unresponsive-device",
    "Device response after a CarPlay vehicle powered off",
    "An attached device could become unresponsive when a CarPlay-equipped vehicle was turned off.",
    "bugFix",
  ),
  centralManagerRemoval: d(
    "ios-9-beta-cbcentralmanager-removed-methods",
    "Removed CBCentralManager retrieval methods",
    "Applications still calling two long-deprecated CBCentralManager retrieval methods could terminate because iOS 9 removed them.",
    "developerApi",
  ),
  contactsDirectories: d(
    "ios-9-beta-contacts-directory-autocomplete",
    "LDAP and GAL contact suggestions",
    "Contact autocompletion did not query configured LDAP or Global Address List directories.",
    "knownIssue",
  ),
  familyInlineAdd: d(
    "ios-9-beta-family-sharing-inline-member-addition",
    "Inline Family Sharing invitations",
    "Adding a family member directly from the affected flow failed until a later beta.",
    "bugFix",
  ),
  familyAskToBuy: d(
    "ios-9-beta-family-sharing-ask-to-buy-notifications",
    "Ask to Buy notification actions",
    "Ask to Buy notifications did not respond when selected until a later beta.",
    "bugFix",
  ),
  healthDatabase: d(
    "ios-9-beta-health-database-upgrade-loss",
    "Health database during beta upgrades",
    "A rare beta-upgrade path could remove the local Health database.",
    "knownIssue",
  ),
  homeKitDuplicates: d(
    "ios-9-beta-homekit-duplicate-accessories",
    "Duplicate multi-path HomeKit accessories",
    "Accessories supporting multiple HomeKit communication paths could appear more than once until Beta 3.",
    "bugFix",
  ),
  homeKitLocationSimulator: d(
    "ios-9-beta-homekit-location-triggers-simulator",
    "HomeKit location triggers in Simulator",
    "Location-based HomeKit events did not fire in Simulator until Beta 3.",
    "bugFix",
  ),
  iCloudRestoreSpeed: d(
    "ios-9-beta-icloud-restore-speed",
    "iCloud restore performance",
    "Restoring an iOS 9 backup through iCloud could take longer than restoring an earlier-system backup.",
    "knownIssue",
  ),
  iCloudBackupReporting: d(
    "ios-9-beta-icloud-backup-status-reporting",
    "iCloud Backup status and size reporting",
    "Settings could incorrectly warn that no backup existed or display an existing backup as zero bytes.",
    "knownIssue",
  ),
  iCloudRestoreTwoFactor: d(
    "ios-9-beta-icloud-restore-two-factor-sign-in",
    "Two-factor sign-in during iCloud restore",
    "Signing in to iTunes during an iCloud restore could stall while sending a verification code until Beta 3.",
    "bugFix",
  ),
  iCloudBackupFailure: d(
    "ios-9-beta-icloud-backup-intermittent-failure",
    "Intermittent iCloud Backup completion",
    "Some iCloud backups could make progress and then fail.",
    "knownIssue",
  ),
  iCloudDriveSearch: d(
    "ios-9-beta-icloud-drive-search-results",
    "Opening iCloud Drive documents from search",
    "Choosing a Drive-hosted document from system search had no effect until Beta 3.",
    "bugFix",
  ),
  thirdPartyKeyboardSearch: d(
    "ios-9-beta-third-party-keyboards-search",
    "Third-party keyboards in search",
    "Third-party keyboards could be unavailable in search results or disappear from an app’s active-keyboard list.",
    "knownIssue",
  ),
  secureEnclaveKeyGeneration: d(
    "ios-9-beta-secure-enclave-key-generation",
    "Secure Enclave key generation",
    "The affected Security framework call could intermittently fail to create a Secure Enclave-backed key.",
    "knownIssue",
  ),
  mapsWatchNavigation: d(
    "ios-9-beta-maps-watch-navigation-updates",
    "Maps guidance with a paired Apple Watch",
    "Maps instructions could stop updating while the paired iPhone was locked.",
    "knownIssue",
  ),
  mailPrinting: d(
    "ios-9-beta-mail-message-printing",
    "Printing a Mail message",
    "Mail could terminate when a user tried to print a message.",
    "knownIssue",
  ),
  multitaskingVoiceOver: d(
    "ios-9-beta-multitasking-voiceover-gestures",
    "iPad multitasking gestures with VoiceOver",
    "VoiceOver could prevent a secondary multitasking app from being pinned, unpinned, or resized.",
    "knownIssue",
  ),
  notesWindowsSync: d(
    "ios-9-beta-notes-windows-itunes-sync",
    "Upgraded Notes syncing through iTunes on Windows",
    "Notes upgraded under the first beta did not synchronize through iTunes on Windows.",
    "knownIssue",
  ),
  photosRestoreThumbnails: d(
    "ios-9-beta-photos-restore-thumbnails",
    "Photo thumbnails after iCloud restore",
    "Photos outside iCloud Photo Library could lack thumbnails after a restore until Beta 3.",
    "bugFix",
  ),
  safariPageTools: d(
    "ios-9-beta-safari-page-tools",
    "Safari page-search and desktop-site controls",
    "Safari exposed Find on Page and Request Desktop Site from its sharing interface.",
    "enhancement",
  ),
  searchDeepLinks: d(
    "ios-9-beta-search-result-deep-links",
    "Opening app content from system search",
    "Some Mail, Maps, Notes, and Messages search results failed to open their application until the prerelease cycle repaired the path.",
    "bugFix",
  ),
  siriMultiAddress: d(
    "ios-9-beta-siri-suggestions-multiple-addresses",
    "Siri Suggestions contacts with multiple addresses",
    "Contact actions in Siri Suggestions could terminate SpringBoard when the person had multiple addresses.",
    "knownIssue",
  ),
  printPreview: d(
    "ios-9-beta-uikit-print-preview",
    "UIKit print preview",
    "UIKit introduced a redesigned printing interface with an integrated preview.",
    "developerApi",
  ),
  pickerSizing: d(
    "ios-9-beta-uikit-picker-resizing",
    "Resizable picker controls",
    "Picker and date-picker views became adaptive and resizable instead of enforcing their former default dimensions.",
    "developerApi",
  ),
  popoverAnchor: d(
    "ios-9-beta-uikit-popover-anchor-resize",
    "Popover anchor updates after window resizing",
    "A modal popover could retain an outdated bar-button anchor after its window changed size until Beta 3.",
    "bugFix",
  ),
  activationLockWatch: d(
    "ios-9-beta-activation-lock-watch-state",
    "Apple Watch Activation Lock status",
    "An iPhone could incorrectly report that Activation Lock was enabled for its paired Apple Watch until Beta 3.",
    "bugFix",
  ),
  calendarTimeToLeave: d(
    "ios-9-beta-calendar-time-to-leave-alerts",
    "Calendar Time to Leave alerts",
    "Calendar could omit Time to Leave notifications until Beta 3.",
    "bugFix",
  ),
  faceTimeConnections: d(
    "ios-9-beta-facetime-connections-newer-devices",
    "FaceTime connections on selected newer devices",
    "FaceTime calls could fail on iPhone 6-class hardware and iPad Air 2 until Beta 3.",
    "bugFix",
  ),
  homeKitBackup: d(
    "ios-9-beta-homekit-itunes-backup-restoration",
    "iTunes backups after HomeKit use",
    "Using HomeKit could produce an iTunes backup that could not be restored until Beta 3.",
    "bugFix",
  ),
  instantHotspot: d(
    "ios-9-beta-instant-hotspot-connection-crash",
    "Instant Hotspot connection stability",
    "Some devices could terminate while connecting to Instant Hotspot until Beta 3.",
    "bugFix",
  ),
  quickTypeShareSheet: d(
    "ios-9-beta-quicktype-share-sheet-display",
    "QuickType suggestions in sharing interfaces",
    "QuickType suggestions could render incorrectly inside share sheets until Beta 3.",
    "bugFix",
  ),
  keychainSecurityCode: d(
    "ios-9-beta-icloud-keychain-security-code-setup",
    "iCloud Keychain security-code setup",
    "Correct security and SMS codes could still be rejected while enabling iCloud Keychain until Beta 3.",
    "bugFix",
  ),
  localizationEnglish: d(
    "ios-9-beta-localization-unexpected-english",
    "Unexpected English interface content",
    "Devices configured for another primary language could show some English content until Beta 3.",
    "bugFix",
  ),
  mapKitDirections: d(
    "ios-9-beta-mapkit-directions-eta",
    "MapKit directions and arrival estimates",
    "MapKit direction requests could return neither a route nor an arrival estimate until Beta 3.",
    "bugFix",
  ),
  musicRadioTab: d(
    "ios-9-beta-music-radio-tab",
    "Music Radio tab availability",
    "The Radio area could be absent from Music until Beta 3.",
    "bugFix",
  ),
  podcastsConvertedMedia: d(
    "ios-9-beta-podcasts-converted-media-launch",
    "Podcasts launch after media-type conversion",
    "Podcasts could terminate at launch after converted episodes were synchronized until Beta 3.",
    "bugFix",
  ),
  searchActivityMetadata: d(
    "ios-9-beta-search-user-activity-metadata",
    "NSUserActivity metadata in search indexing",
    "System search could omit an activity’s attribute metadata while retaining only its title and keywords until Beta 3.",
    "bugFix",
  ),
  settingsAccountsBlackScreen: d(
    "ios-9-beta-settings-google-yahoo-account-screen",
    "Account setup screen for Google and Yahoo",
    "Settings could show a black view while adding a Google or Yahoo account until Beta 3.",
    "bugFix",
  ),
  settingsSearchDescriptions: d(
    "ios-9-beta-settings-corespotlight-descriptions",
    "Core Spotlight descriptions in search",
    "Indexed Core Spotlight items could omit their description from search results until Beta 3.",
    "bugFix",
  ),
  setupIForgot: d(
    "ios-9-beta-setup-assistant-iforgot-links",
    "iForgot links in Setup Assistant",
    "Password-recovery links in Setup Assistant were nonfunctional until Beta 3.",
    "bugFix",
  ),
  spriteKitCameraNodes: d(
    "ios-9-beta-spritekit-camera-node-containment",
    "SpriteKit camera-node containment queries",
    "Two SKCameraNode containment methods did not return usable results until Beta 3.",
    "bugFix",
  ),
  appleIdTwoFactorOffer: d(
    "ios-9-beta3-apple-id-two-factor-offer",
    "Integrated Apple ID two-factor authentication",
    "Beta 3 began offering selected users an upgrade to Apple’s integrated two-factor authentication.",
    "feature",
  ),
  appExtensionVisibility: d(
    "ios-9-beta-app-extension-activity-view-visibility",
    "Extension visibility after debugging",
    "A debug session involving an action or share extension could make it disappear from the activity view until Beta 4.",
    "bugFix",
  ),
  openALAvailability: d(
    "ios-9-beta-openal-framework-availability",
    "OpenAL framework availability",
    "OpenAL was unavailable in an intermediate beta until Beta 4 restored it.",
    "bugFix",
  ),
  cameraVolumeButtons: d(
    "ios-9-beta-camera-volume-button-shutter",
    "Camera shutter through the volume buttons",
    "The Camera app could not use the physical volume controls as a shutter until Beta 4.",
    "bugFix",
  ),
  fileProviderPicker: d(
    "ios-9-beta-file-provider-document-picker",
    "Document Picker rendering",
    "The Document Picker could show an empty white view on some devices until Beta 4.",
    "bugFix",
  ),
  handoffPasscode: d(
    "ios-9-beta-handoff-without-passcode",
    "Handoff on a device without a passcode",
    "Handoff could fail when the iOS device had no passcode until Beta 4.",
    "bugFix",
  ),
  iCloudRestoreApps: d(
    "ios-9-beta-icloud-restore-applications",
    "Application restoration from iCloud Backup",
    "An iCloud restore could omit installed applications until Beta 4.",
    "bugFix",
  ),
  glKitMeshes: d(
    "ios-9-beta-glkit-modelio-mesh-initialization",
    "GLKit mesh initialization with Model I/O",
    "GLKit mesh objects could initialize incorrectly and limit Model I/O integration until Beta 4.",
    "bugFix",
  ),
  metalKitMeshes: d(
    "ios-9-beta-metalkit-modelio-mesh-initialization",
    "MetalKit mesh initialization with Model I/O",
    "MetalKit mesh objects could initialize incorrectly and limit Model I/O integration until Beta 4.",
    "bugFix",
  ),
  messagesAudioGlyphs: d(
    "ios-9-beta-messages-audio-recording-glyphs",
    "Audio-message recording indicators",
    "The visual waveform indicators could disappear while recording an audio message until Beta 5.",
    "bugFix",
  ),
  messagesAudioPlayback: d(
    "ios-9-beta-messages-audio-playback-start",
    "Starting audio-message playback",
    "Beginning playback of a sent audio message could be difficult until Beta 5.",
    "bugFix",
  ),
  phoneCallHistory: d(
    "ios-9-beta-phone-call-history-upgrade",
    "Call history after upgrading",
    "Upgrading to an affected beta could remove recent call history until Beta 4.",
    "bugFix",
  ),
  phoneVoicemail: d(
    "ios-9-beta-phone-voicemail-erase-install",
    "Voicemail after an erase installation",
    "Voicemail could be unavailable after a clean installation until Beta 4.",
    "bugFix",
  ),
  siriEyesFree: d(
    "ios-9-beta-siri-eyes-free",
    "Siri Eyes Free availability",
    "Siri Eyes Free could fail during the prerelease cycle until Beta 5.",
    "bugFix",
  ),
  watchSetupIForgot: d(
    "ios-9-beta-watch-setup-iforgot-cancel",
    "Canceling iForgot in Watch Setup Assistant",
    "The Cancel action did not work in Watch Setup Assistant’s password-recovery flow until Beta 4.",
    "bugFix",
  ),
  spotlightContacts: d(
    "ios-9-beta-spotlight-contact-search-upgrade",
    "Contact search after upgrading",
    "Some contacts could disappear from Spotlight results after an upgrade until Beta 5.",
    "bugFix",
  ),
  photoBoothSaving: d(
    "ios-9-beta-photo-booth-saving",
    "Saving pictures from Photo Booth",
    "Photo Booth could fail to save newly captured pictures until Beta 5.",
    "bugFix",
  ),
  lightningVideoAdapters: d(
    "ios-9-beta-lightning-video-adapters",
    "Lightning video-adapter compatibility",
    "Lightning video adapters could be unusable until Beta 5.",
    "bugFix",
  ),
  gameCenterAppleId: d(
    "ios-9-beta-game-center-apple-id-creation",
    "Apple ID creation through Game Center",
    "Creating an Apple ID through Game Center could terminate the flow until Beta 4.",
    "bugFix",
  ),
  twoFactorIncorrectCode: d(
    "ios-9-beta-two-factor-incorrect-code-setup",
    "Incorrect two-factor code during setup",
    "Entering an incorrect verification code could freeze Setup Assistant until Beta 4.",
    "bugFix",
  ),
  twoFactorCancel: d(
    "ios-9-beta-two-factor-cancel-setup",
    "Canceling the two-factor prompt during setup",
    "Canceling the verification-code prompt could leave Setup Assistant stuck at sign-in until Beta 4.",
    "bugFix",
  ),
  appSpecificPasswordNotifications: d(
    "ios-9-beta-app-specific-password-notifications",
    "Notifications from apps using app-specific passwords",
    "Applications using app-specific passwords could generate repeated notifications until Beta 4.",
    "bugFix",
  ),
  dictationRepeatUse: d(
    "ios-9-beta-dictation-repeat-use",
    "Repeated Dictation sessions",
    "Dictation could work once and then stop responding until Beta 4.",
    "bugFix",
  ),
  musicSignupDisplay: d(
    "ios-9-beta-apple-music-signup-display",
    "Apple Music signup presentation",
    "The Apple Music enrollment screen could render incorrectly until Beta 4.",
    "bugFix",
  ),
  musicLoveControls: d(
    "ios-9-beta-apple-music-love-album-playlist",
    "Love controls for albums and playlists",
    "The prerelease Music app could prevent users from marking an album or playlist as loved until Beta 4.",
    "bugFix",
  ),
  replayKitYouTubeFramework: d(
    "ios-9-beta-replaykit-youtube-framework",
    "ReplayKit YouTube framework dependency",
    "A missing framework could interfere with ReplayKit until Beta 4.",
    "bugFix",
  ),
  safariAutofill: d(
    "ios-9-beta-safari-ipad-autofill",
    "Safari password AutoFill on iPad",
    "Safari could fail to insert stored passwords into iPad login fields until Beta 4.",
    "bugFix",
  ),
  telephonyPlanAlert: d(
    "ios-9-beta-ipad-cellular-plan-expired-alert",
    "Cellular-plan expiration alert on iPad",
    "An iPad could report a newly purchased data plan as expired until Beta 4.",
    "bugFix",
  ),
  appleIdCreation: d(
    "ios-9-beta-apple-id-creation-settings-setup",
    "Account creation from Settings and device setup",
    "Apple ID creation could be unavailable in Settings and Setup Assistant until Beta 5.",
    "bugFix",
  ),
  calendarSuggestedEvent: d(
    "ios-9-beta-calendar-ignore-suggested-event",
    "Ignoring a suggested Calendar event",
    "Calendar could stop responding after a suggested event was ignored until Beta 5.",
    "bugFix",
  ),
  carPlayHomeButton: d(
    "ios-9-beta-carplay-home-button",
    "CarPlay Home button reliability",
    "The CarPlay Home button could fail intermittently until Beta 5.",
    "bugFix",
  ),
  homeSharingControls: d(
    "ios-9-beta-home-sharing-music-controls",
    "Home Sharing controls in Music",
    "Home Sharing could be impossible to toggle with an empty library or absent from My Music until Beta 5.",
    "bugFix",
  ),
  iCloudFetchChanges: d(
    "ios-9-beta-cloudkit-fetch-all-changes-deprecation",
    "CloudKit fetchAllChanges deprecation",
    "The prerelease SDK deprecated the fetchAllChanges property ahead of its removal.",
    "developerApi",
  ),
  keychainBetaSync: d(
    "ios-9-beta-icloud-keychain-cross-beta-sync",
    "iCloud Keychain synchronization across beta revisions",
    "Passwords and payment-card data did not synchronize with earlier mobile or desktop prerelease builds.",
    "compatibility",
  ),
  keychainSuggestedPassword: d(
    "ios-9-beta-keychain-suggested-password",
    "Accepting a suggested password",
    "Account creation could reject the system’s suggested password until Beta 5.",
    "bugFix",
  ),
  mapsSiriLocation: d(
    "ios-9-beta-maps-siri-current-location",
    "Siri directions from the current location",
    "Siri requests for driving, walking, or transit guidance could fail because Maps considered the current location unavailable.",
    "knownIssue",
  ),
  siriSettings: d(
    "ios-9-beta-siri-settings-options",
    "Changing settings through Siri",
    "Siri could not modify supported Settings options until Beta 5.",
    "bugFix",
  ),
  siriNotes: d(
    "ios-9-beta-siri-notes-operations",
    "Notes operations through Siri",
    "Siri could not create, display, or edit notes until Beta 5.",
    "bugFix",
  ),
  unqualifiedNibName: d(
    "ios-9-beta-uikit-unqualified-swift-nib-name",
    "Unqualified Swift view-controller nib names",
    "UIKit began allowing Swift view-controller nib filenames without their module prefix.",
    "developerApi",
  ),
  nilNibBundle: d(
    "ios-9-beta-uikit-nil-nib-bundle",
    "UIKit view controllers created with a nil nib bundle",
    "Some UIKit-defined view controllers searched the framework instead of the application bundle when initialized with a nil bundle.",
    "knownIssue",
  ),
  legacyAppLayout: d(
    "ios-9-beta-uikit-pre-ios8-app-layout",
    "Layout of applications linked before iOS 8",
    "Applications linked against older SDKs could render cropped or occupy only part of the display.",
    "knownIssue",
  ),
  vppLaunch: d(
    "ios-9-beta-vpp-device-licensed-app-launch",
    "Launching device-licensed VPP applications",
    "Applications licensed directly to a device through the Volume Purchase Program could fail to launch until Beta 5.",
    "bugFix",
  ),
  trustedDeviceManagement: d(
    "ios-9-beta-two-factor-trusted-device-management",
    "Managing two-factor trusted devices",
    "The Apple ID website could not manage trusted devices, and account removal required an additional device sign-out, until Beta 5.",
    "bugFix",
  ),
  complexPasscodeKeyboard: d(
    "ios-9-beta-ipad-complex-passcode-keyboard",
    "Keyboard in Settings with a complex iPad passcode",
    "Some Settings panes could unexpectedly show the keyboard when an iPad used a complex passcode until Beta 5.",
    "bugFix",
  ),
  keychainCircleJoin: d(
    "ios-9-beta-icloud-keychain-circle-join",
    "Joining an iCloud Keychain circle",
    "Security-code and SMS verification could fail when entering an established Keychain group until Beta 5.",
    "bugFix",
  ),
  keychainResetPrompt: d(
    "ios-9-beta-icloud-keychain-reset-prompt",
    "iCloud Keychain reset prompt after a password change",
    "Changing the iCloud password could trigger an unnecessary Keychain reset prompt until Beta 5.",
    "bugFix",
  ),
  keychainTwoStepFailure: d(
    "ios-9-beta-icloud-keychain-two-step-verification",
    "Keychain changes with two-step verification",
    "Changing Keychain security data from an untrusted device could produce a verification failure until Beta 5.",
    "bugFix",
  ),
  keychainPhoneAlerts: d(
    "ios-9-beta-icloud-keychain-phone-number-alerts",
    "Keychain phone-number change alerts",
    "A Keychain phone-number change could generate sign-in alerts across every logged-in prerelease device until Beta 5.",
    "bugFix",
  ),
  contentBlockerReload: d(
    "ios-9-beta-safari-content-blocker-reload",
    "Reloading a Safari content blocker on device",
    "Reloading a content blocker through the documented API could return an error on physical hardware until Beta 5.",
    "bugFix",
  ),
  carPlayMapsNavigationBar: d(
    "ios-9-beta5-carplay-maps-navigation-bar",
    "Maps navigation bar in CarPlay",
    "The Maps navigation bar could become inaccessible in CarPlay.",
    "knownIssue",
  ),
  enterpriseTls: d(
    "ios-9-beta5-enterprise-8021x-tls12",
    "TLS 1.2 for 802.1X authentication",
    "iOS 9 added TLS 1.2 support to enterprise 802.1X authentication, requiring compatible authentication-server releases.",
    "compatibility",
  ),
  safariViewDismissal: d(
    "ios-9-beta5-safari-view-controller-dismissal",
    "Automatic Safari view-controller dismissal",
    "SFSafariViewController began dismissing itself when Done was selected.",
    "developerApi",
  ),
};

const routeMetadata = {
  "beta-1": {
    label: "Beta 1",
    source: U.beta1,
    previous: undefined,
    sourceState:
      "a complete nine-page Apple document reproduced in a contemporaneous BGR article",
    selection:
      "a representative first-document baseline of platform behavior, APIs, and known issues",
  },
  "beta-3": {
    label: "Beta 3",
    source: U.beta3,
    previous: undefined,
    sourceState:
      "46 component headings, 56 status groups, and 100 leaf records in Apple’s preserved page",
    selection:
      "the explicit Beta 3 fixes, the self-dated two-factor-authentication addition, and selected current issues that later snapshots resolve",
  },
  "beta-4": {
    label: "Beta 4",
    source: U.beta4,
    previous: U.beta3,
    sourceState:
      "39 component headings, 49 status groups, and 91 leaf records in Apple’s preserved page",
    selection:
      "explicit Beta 4 fixes plus conservative additions verified against the retained Beta 3 state",
  },
  "beta-5": {
    label: "Beta 5",
    source: U.beta5,
    previous: U.beta4,
    sourceState:
      "29 component headings, 38 status groups, and 70 leaf records in Apple’s preserved page",
    selection:
      "explicit Beta 5 fixes plus three conservative additions verified against the retained Beta 4 state",
  },
};

const selected = [];
const o = (alias, key, action, component, sourceStatus, locator, evidence) => {
  const definition = definitions[key];
  if (!definition) throw new Error(`Unknown local definition: ${key}`);
  selected.push({
    alias,
    ...definition,
    action,
    component,
    sourceStatus,
    locator,
    evidence,
  });
};

const baseline = (key, action, component, status, locator) =>
  o("beta-1", key, action, component, status, locator, "baseline");
const beta3Fixed = (key, component, locator) =>
  o("beta-3", key, "fixed", component, "Fixed in Beta 3", locator, "fixed");
const beta3Current = (key, component, status, locator) =>
  o("beta-3", key, "knownIssue", component, status, locator, "current");
const beta4Fixed = (key, component, locator) =>
  o("beta-4", key, "fixed", component, "Fixed in Beta 4", locator, "fixed");
const beta4Added = (key, action, component, status, locator) =>
  o("beta-4", key, action, component, status, locator, "addition");
const beta5Fixed = (key, component, locator) =>
  o("beta-5", key, "fixed", component, "Fixed in Beta 5", locator, "fixed");
const beta5Added = (key, action, component, status, locator) =>
  o("beta-5", key, action, component, status, locator, "addition");

baseline(
  K.airplay,
  "knownIssue",
  "AirPlay",
  "Known Issue",
  "AirPlay connectivity issues with Apple TV",
);
baseline(
  K.purchasePrompt,
  "knownIssue",
  "App Store",
  "Known Issue",
  "prompted twice for credentials on the first In-App Purchase",
);
baseline(
  K.appleIdEmail,
  "knownIssue",
  "Apple ID",
  "Known Issues",
  "change your primary email address",
);
baseline(
  K.applePayShipping,
  "knownIssue",
  "Apple Pay",
  "Known Issue",
  "request PKAddressFieldName",
);
baseline(
  K.avQueueMixedMedia,
  "introduced",
  "AVFoundation",
  "Notes",
  "mixture of file-based media and HTTP Live Streaming media",
);
baseline(
  K.avPlayerInterruption,
  "changed",
  "AVFoundation",
  "Notes",
  "media interruption behavior",
);
baseline(
  K.pictureInPictureReplacement,
  "knownIssue",
  "AVFoundation",
  "Notes",
  "replacing the underlying AVPlayer",
);
baseline(
  K.bluetoothCallAudio,
  "knownIssue",
  "Bluetooth",
  "Known Issue",
  "Incoming cellular call audio",
);
baseline(
  K.carPlayPowerOff,
  "knownIssue",
  "CarPlay",
  "Known Issue",
  "turn off your vehicle",
);
baseline(
  K.centralManagerRemoval,
  "removed",
  "CBCentralManager",
  "Known Issue",
  "removed in iOS 9.0",
);
baseline(
  K.contactsDirectories,
  "knownIssue",
  "Contacts",
  "Known Issues",
  "LDAP and GAL servers",
);
baseline(
  K.familyInlineAdd,
  "knownIssue",
  "Family Sharing",
  "Known Issues",
  "Adding a family member inline fails",
);
baseline(
  K.familyAskToBuy,
  "knownIssue",
  "Family Sharing",
  "Known Issues",
  "Ask To Buy notifications",
);
baseline(
  K.healthDatabase,
  "knownIssue",
  "HealthKit",
  "Known Issue",
  "health database to be deleted",
);
baseline(
  K.homeKitDuplicates,
  "knownIssue",
  "HomeKit",
  "Known Issues",
  "multiple communication paths",
);
baseline(
  K.homeKitLocationSimulator,
  "knownIssue",
  "HomeKit",
  "Known Issues",
  "Location-based event triggers",
);
baseline(
  K.iCloudRestoreSpeed,
  "knownIssue",
  "iCloud Backup",
  "Known Issue",
  "Restoring from a backup created in iOS 9 is slower",
);
baseline(
  K.iCloudBackupReporting,
  "knownIssue",
  "iCloud Backup",
  "Known Issue",
  "incorrect “iCloud Backup” alert | backup size of 0 bytes",
);
baseline(
  K.iCloudRestoreTwoFactor,
  "knownIssue",
  "iCloud Backup",
  "Known Issue",
  "stuck sending your verification code",
);
baseline(
  K.iCloudBackupFailure,
  "knownIssue",
  "iCloud Backup",
  "Known Issue",
  "make progress, but then fail",
);
baseline(
  K.iCloudDriveSearch,
  "knownIssue",
  "iCloud Drive",
  "Known Issue",
  "iCloud Drive document in search results",
);
baseline(
  K.thirdPartyKeyboardSearch,
  "knownIssue",
  "Keyboards",
  "Known Issues",
  "Third party keyboards",
);
baseline(
  K.secureEnclaveKeyGeneration,
  "knownIssue",
  "Keychain",
  "Known Issues",
  "SecKeyGeneratePair",
);
baseline(
  K.mapsWatchNavigation,
  "knownIssue",
  "Maps",
  "Known Issue",
  "paired to an Apple Watch",
);
baseline(
  K.mailPrinting,
  "knownIssue",
  "Mail",
  "Known Issues",
  "Mail crashes when trying to print",
);
baseline(
  K.multitaskingVoiceOver,
  "knownIssue",
  "Multitasking",
  "Known Issues",
  "VoiceOver is enabled",
);
baseline(
  K.notesWindowsSync,
  "knownIssue",
  "Notes",
  "Known Issue",
  "will not sync using iTunes on Windows",
);
baseline(
  K.photosRestoreThumbnails,
  "knownIssue",
  "Photos",
  "Known Issue",
  "fail to display thumbnails",
);
baseline(
  K.safariPageTools,
  "introduced",
  "Safari",
  "Notes",
  "“Find on Page” is now available | Request Desktop Site has moved",
);
baseline(
  K.searchDeepLinks,
  "knownIssue",
  "Search",
  "Known Issues",
  "does not open the app on some devices",
);
baseline(
  K.siriMultiAddress,
  "knownIssue",
  "Siri",
  "Known Issue",
  "contact with multiple addresses",
);
baseline(
  K.printPreview,
  "introduced",
  "UIKit",
  "Notes",
  "redesigned UI for printing",
);
baseline(
  K.pickerSizing,
  "changed",
  "UIKit",
  "Notes",
  "now resizable and adaptive",
);
baseline(
  K.popoverAnchor,
  "knownIssue",
  "UIKit",
  "Known Issue",
  "window is resized",
);

beta3Fixed(
  K.activationLockWatch,
  "Activation Lock",
  "Activation Lock is turned on for your Apple Watch",
);
beta3Fixed(K.calendarTimeToLeave, "Calendar", "Time to Leave alerts");
beta3Fixed(
  K.faceTimeConnections,
  "FaceTime",
  "calls do not connect on iPhone 6",
);
beta3Fixed(K.homeKitDuplicates, "HomeKit", "multiple communication paths");
beta3Fixed(
  K.homeKitLocationSimulator,
  "HomeKit",
  "Location-based event triggers",
);
beta3Fixed(
  K.homeKitBackup,
  "HomeKit",
  "backing up to iTunes will result in an unrestorable backup",
);
beta3Fixed(
  K.iCloudRestoreTwoFactor,
  "iCloud Backup",
  "stuck sending your verification code",
);
beta3Fixed(K.iCloudDriveSearch, "iCloud Drive", "document in search results");
beta3Fixed(
  K.instantHotspot,
  "Instant HotSpot",
  "crash on connection to Instant Hotspot",
);
beta3Fixed(
  K.quickTypeShareSheet,
  "Keyboards",
  "QuickType suggestions in share sheets",
);
beta3Fixed(K.keychainSecurityCode, "Keychain", "incorrect security code");
beta3Fixed(
  K.localizationEnglish,
  "Localization",
  "content may appear in English",
);
beta3Fixed(
  K.mapKitDirections,
  "Maps",
  "MKDirections do not get directions or ETA",
);
beta3Fixed(K.musicRadioTab, "Music", "Radio tab is not available");
beta3Fixed(K.photosRestoreThumbnails, "Photos", "fail to display thumbnails");
beta3Fixed(
  K.podcastsConvertedMedia,
  "Podcasts",
  "media type of content in iTunes",
);
beta3Fixed(
  K.searchDeepLinks,
  "Search",
  "does not open the app on some devices",
);
beta3Fixed(
  K.searchActivityMetadata,
  "Search",
  "metadata (attributeSet) does not get added",
);
beta3Fixed(
  K.settingsAccountsBlackScreen,
  "Settings",
  "black screen when trying to add Google or Yahoo accounts",
);
beta3Fixed(
  K.settingsSearchDescriptions,
  "Settings",
  "indexed with description don’t display the description",
);
beta3Fixed(K.setupIForgot, "Setup Assistant", "iForgot links don’t work");
beta3Fixed(
  K.spriteKitCameraNodes,
  "SpriteKit",
  "containsNode: and containedNodeSet",
);
beta3Fixed(K.popoverAnchor, "UIKit", "barButtonItem anchor position");
o(
  "beta-3",
  K.appleIdTwoFactorOffer,
  "introduced",
  "Apple ID",
  "Note",
  "Beginning with this beta",
  "selfIdentifying",
);
beta3Current(
  K.appExtensionVisibility,
  "App Extensions",
  "Known Issue",
  "extension to be missing",
);
beta3Current(
  K.openALAvailability,
  "Audio",
  "Known Issue",
  "OpenAL framework is not available",
);
beta3Current(
  K.cameraVolumeButtons,
  "Camera",
  "Known Issue",
  "side volume buttons",
);
beta3Current(
  K.familyInlineAdd,
  "Family Sharing",
  "Known Issues",
  "Adding a family member inline fails",
);
beta3Current(
  K.familyAskToBuy,
  "Family Sharing",
  "Known Issues",
  "Ask To Buy notifications",
);
beta3Current(
  K.fileProviderPicker,
  "File Providers",
  "Known Issue",
  "Document Picker is not displayed",
);
beta3Current(
  K.handoffPasscode,
  "Handoff",
  "Known Issue",
  "does not have a passcode set",
);
beta3Current(
  K.iCloudRestoreApps,
  "iCloud Backup",
  "Known Issue",
  "will not restore your applications",
);
beta3Current(
  K.glKitMeshes,
  "GLKit",
  "Known Issue",
  "GLKMesh and GLKMeshBuffer",
);
beta3Current(
  K.metalKitMeshes,
  "MetalKit",
  "Known Issue",
  "MTKMesh and MTKMeshBuffer",
);
beta3Current(
  K.messagesAudioGlyphs,
  "Messages",
  "Known Issues",
  "audio glyphs are not shown",
);
beta3Current(
  K.messagesAudioPlayback,
  "Messages",
  "Known Issues",
  "difficult to begin playback",
);
beta3Current(
  K.phoneCallHistory,
  "Phone",
  "Known Issues",
  "Call history may be lost",
);
beta3Current(
  K.phoneVoicemail,
  "Phone",
  "Known Issues",
  "Voicemail may be unavailable",
);
beta3Current(K.siriEyesFree, "Siri", "Known Issue", "Siri Eyes Free");
beta3Current(
  K.watchSetupIForgot,
  "Watch App",
  "Known Issues",
  "Tapping Cancel does not work",
);
beta3Current(
  K.spotlightContacts,
  "Spotlight",
  "Known Issues",
  "contacts are not searchable",
);
beta3Current(
  K.photoBoothSaving,
  "Photo Booth",
  "Known Issue",
  "Photos taken with Photo Booth are not saved",
);
beta3Current(
  K.lightningVideoAdapters,
  "Accessories",
  "Known Issue",
  "Lightning video dongles",
);

beta4Fixed(
  K.appExtensionVisibility,
  "App Extensions",
  "extension to be missing",
);
beta4Fixed(
  K.gameCenterAppleId,
  "Apple ID",
  "create a new Apple ID via Game Center",
);
beta4Fixed(K.twoFactorIncorrectCode, "Apple ID", "incorrect verification code");
beta4Fixed(K.twoFactorCancel, "Apple ID", "tapping Cancel");
beta4Fixed(
  K.appSpecificPasswordNotifications,
  "Apple ID",
  "app-specific passwords cause multiple notifications",
);
beta4Fixed(K.openALAvailability, "Audio", "OpenAL framework");
beta4Fixed(K.cameraVolumeButtons, "Camera", "side volume buttons");
beta4Fixed(
  K.dictationRepeatUse,
  "Dictation",
  "first time, but not subsequent times",
);
beta4Fixed(
  K.familyInlineAdd,
  "Family Sharing",
  "Adding a family member inline",
);
beta4Fixed(K.familyAskToBuy, "Family Sharing", "Ask To Buy notifications");
beta4Fixed(
  K.fileProviderPicker,
  "File Providers",
  "Document Picker is not displayed",
);
beta4Fixed(K.glKitMeshes, "GLKit", "GLKMesh and GLKMeshBuffer");
beta4Fixed(K.handoffPasscode, "Handoff", "does not have a passcode set");
beta4Fixed(
  K.iCloudRestoreApps,
  "iCloud Backup",
  "will not restore your applications",
);
beta4Fixed(K.metalKitMeshes, "MetalKit", "MTKMesh and MTKMeshBuffer");
beta4Fixed(
  K.musicSignupDisplay,
  "Music",
  "signup screen may not display correctly",
);
beta4Fixed(K.musicLoveControls, "Music", "Love an album or playlist");
beta4Fixed(K.phoneCallHistory, "Phone", "Call history may be lost");
beta4Fixed(K.phoneVoicemail, "Phone", "Voicemail may be unavailable");
beta4Fixed(
  K.replayKitYouTubeFramework,
  "ReplayKit",
  "YouTube.framework is missing",
);
beta4Fixed(
  K.safariAutofill,
  "Safari",
  "passwords may not be automatically entered",
);
beta4Fixed(K.telephonyPlanAlert, "Telephony", "plan has expired");
beta4Fixed(K.watchSetupIForgot, "Watch App", "Tapping Cancel does not work");
beta4Added(
  K.appleIdCreation,
  "knownIssue",
  "Apple ID",
  "Known Issues",
  "create a new Apple ID in Settings or Setup Assistant",
);
beta4Added(
  K.calendarSuggestedEvent,
  "knownIssue",
  "Calendar",
  "Known Issue",
  "tap Ignore on a suggested event",
);
beta4Added(
  K.carPlayHomeButton,
  "knownIssue",
  "CarPlay",
  "Known Issue",
  "Home button may not always work",
);
beta4Added(
  K.homeSharingControls,
  "knownIssue",
  "Home Sharing",
  "Known Issues",
  "empty music library | Home Sharing option doesn’t always appear",
);
beta4Added(
  K.iCloudFetchChanges,
  "removed",
  "iCloud Drive",
  "Note",
  "fetchAllChanges property",
);
beta4Added(
  K.keychainBetaSync,
  "knownIssue",
  "Keychain",
  "Known Issues",
  "will not sync passwords",
);
beta4Added(
  K.keychainSuggestedPassword,
  "knownIssue",
  "Keychain",
  "Known Issues",
  "accept a Suggested Password",
);
beta4Added(
  K.mapsSiriLocation,
  "knownIssue",
  "Maps",
  "Known Issue",
  "Current Location not Available",
);
beta4Added(
  K.siriSettings,
  "knownIssue",
  "Siri",
  "Known Issues",
  "cannot change Settings options",
);
beta4Added(
  K.siriNotes,
  "knownIssue",
  "Siri",
  "Known Issues",
  "create, view, or edit notes",
);
beta4Added(
  K.unqualifiedNibName,
  "changed",
  "UIKit",
  "Notes",
  "omit the module name from the nib file name",
);
beta4Added(
  K.nilNibBundle,
  "knownIssue",
  "UIKit",
  "Known Issues",
  "created with a nil nibBundle",
);
beta4Added(
  K.legacyAppLayout,
  "knownIssue",
  "UIKit",
  "Known Issues",
  "linked to versions of iOS earlier than iOS 8",
);
beta4Added(
  K.vppLaunch,
  "knownIssue",
  "Volume Purchase Program",
  "Known Issue",
  "licensed to a device won’t launch",
);

beta5Fixed(K.lightningVideoAdapters, "Accessories", "Lightning video dongles");
beta5Fixed(
  K.appleIdCreation,
  "Apple ID",
  "create a new Apple ID in Settings or Setup Assistant",
);
beta5Fixed(
  K.trustedDeviceManagement,
  "Apple ID",
  "cannot manage your two-factor authentication trusted devices | Removing a device from your account",
);
beta5Fixed(
  K.calendarSuggestedEvent,
  "Calendar",
  "tap Ignore on a suggested event",
);
beta5Fixed(K.carPlayHomeButton, "CarPlay", "Home button may not always work");
beta5Fixed(
  K.homeSharingControls,
  "Home Sharing",
  "empty music library | Home Sharing option doesn’t always appear",
);
beta5Fixed(
  K.complexPasscodeKeyboard,
  "Keyboards",
  "complex passcode on an iPad",
);
beta5Fixed(
  K.keychainSuggestedPassword,
  "Keychain",
  "accept a Suggested Password",
);
beta5Fixed(
  K.keychainCircleJoin,
  "Keychain",
  "join an existing iCloud Keychain circle",
);
beta5Fixed(K.keychainResetPrompt, "Keychain", "iCloud Keychain Reset");
beta5Fixed(K.keychainTwoStepFailure, "Keychain", "Verification Failed");
beta5Fixed(K.keychainPhoneAlerts, "Keychain", "change in the phone number");
beta5Fixed(K.messagesAudioGlyphs, "Messages", "audio glyphs are not shown");
beta5Fixed(K.messagesAudioPlayback, "Messages", "difficult to begin playback");
beta5Fixed(
  K.photoBoothSaving,
  "Photo Booth",
  "Photos taken with Photo Booth are not saved",
);
beta5Fixed(
  K.contentBlockerReload,
  "Safari",
  "reloadContentBlockerWithIdentifier",
);
beta5Fixed(K.siriSettings, "Siri", "cannot change Settings options");
beta5Fixed(K.siriEyesFree, "Siri", "Siri Eyes Free");
beta5Fixed(K.siriNotes, "Siri", "create, view, or edit notes");
beta5Fixed(K.spotlightContacts, "Spotlight", "contacts are not searchable");
beta5Fixed(
  K.vppLaunch,
  "Volume Purchase Program",
  "licensed to a device won’t launch",
);
beta5Added(
  K.carPlayMapsNavigationBar,
  "knownIssue",
  "CarPlay",
  "Known Issue",
  "navigation bar in Maps",
);
beta5Added(
  K.enterpriseTls,
  "changed",
  "Enterprise",
  "Note",
  "TLS v1.2 in 8021.X authentication",
);
beta5Added(
  K.safariViewDismissal,
  "changed",
  "Safari",
  "Notes",
  "When Done is tapped in a SFSafariViewController",
);

function verificationFor(change) {
  const route = routeMetadata[change.alias];
  if (change.evidence === "baseline") {
    return "Matched the component, status heading, and locator in the complete nine-page Apple document reproduced by BGR. Apple’s June 8 announcement independently confirms immediate developer beta availability. This is a representative first-document baseline, not a claimed diff.";
  }
  if (change.evidence === "fixed") {
    return `Matched the component, locator, and Apple’s explicit “Fixed in ${route.label}” status in the preserved milestone page.`;
  }
  if (change.evidence === "selfIdentifying") {
    return "Matched Apple’s self-dating “Beginning with this beta” language and the statement that earlier iOS 9 betas did not support the feature.";
  }
  if (change.evidence === "addition") {
    return `Matched the component and locator in Apple’s ${route.label} page and checked the exact preceding retained page for the conservative addition boundary.`;
  }
  return `Matched the component, current known-issue heading, and locator in Apple’s preserved ${route.label} page. The occurrence describes milestone state, not a first-appearance claim.`;
}

function occurrence(change) {
  const route = routeMetadata[change.alias];
  const comparisonCitation =
    change.evidence === "addition" && route.previous
      ? [
          c(
            route.previous,
            `Preceding retained state checked for ${change.component}`,
            "Comparison boundary only.",
          ),
        ]
      : [];
  const summary =
    change.action === "fixed"
      ? `Apple’s ${route.label} document places this ${change.component} record in its milestone-specific fixed section.`
      : change.action === "knownIssue"
        ? `The preserved ${route.label} state lists this ${change.component} behavior as a current known issue.`
        : `The preserved ${route.label} state documents this ${change.component} change.`;
  return {
    key: change.key,
    title: change.title,
    canonicalSummary: change.canonicalSummary,
    category: change.category,
    action: change.action,
    inheritance: "delta",
    summary,
    documentedStatus: "documented",
    evidenceState: change.alias === "beta-1" ? "corroborated" : "confirmed",
    verificationMethod: verificationFor(change),
    citations: [
      c(
        route.source,
        `${change.component} — ${change.sourceStatus}; ${change.locator}`,
        "Original synthesis from the cited milestone record.",
      ),
      ...comparisonCitation,
    ],
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
  const route = routeMetadata[alias];
  const changes = changesByAlias.get(alias) || [];
  const changeCitations = uniqueCitations(
    changes.flatMap((change) => change.citations),
  );
  if (alias === "beta-1") {
    return article(
      heading("What survives"),
      prose(
        "A contemporaneous BGR article reproduces Apple’s complete iOS 9 Beta 1 developer document. The retained transcript identifies the original Apple Developer URL, carries page markers 1/9 through 9/9, and ends with Apple’s June 8, 2015 update line.",
        [
          c(
            U.beta1,
            "Here are the full release notes for iOS 9 beta 1; pages 1/9–9/9",
          ),
          c(
            U.beta1Announcement,
            "Availability — beta software and SDK available immediately",
          ),
        ],
      ),
      heading("Representative baseline"),
      prose(
        `This article structures ${changes.length} source-supported records across media, commerce, connectivity, cloud services, search, multitasking, Safari, Siri, and UIKit. Because no earlier iOS 9 state exists, these entries describe what Apple documented in the first seed rather than claiming that each item originated that day.`,
        changeCitations,
      ),
      heading("Copyright and provenance boundary"),
      prose(
        "The reader-facing text is new editorial synthesis, not a republication of Apple’s document or BGR’s article. BGR is credited as the preserved host, Apple is identified as the underlying document author, and no community observation or inferred build number is promoted into the page.",
        [
          c(U.beta1, "Apple-authored release-note reproduction"),
          c(U.final, "Final iOS 9 SDK state", "Boundary comparison only."),
        ],
      ),
    );
  }
  const comparison =
    alias === "beta-3"
      ? "No complete Beta 2 page survives in the audited archive. The Beta 3 delta therefore uses only Apple’s explicit fixed headings and its self-dating two-factor-authentication note; selected unresolved items are labeled as current state rather than additions."
      : `The retained ${routeMetadata[alias === "beta-4" ? "beta-3" : "beta-4"].label} and ${route.label} pages permit a bounded comparison. Explicit fixed headings are attached directly, while additions are limited to records absent from the exact preceding retained state.`;
  const comparisonCitations =
    alias === "beta-3"
      ? [
          c(
            U.beta2Context,
            "iOS 9 Beta 2 Release Notes — original Apple Developer URL",
            "Confirms the overwritten URL, not the unavailable document body.",
          ),
          c(U.beta3, "Fixed in Beta 3 and Beginning with this beta"),
        ]
      : [
          c(route.previous, `Preceding retained state before ${route.label}`),
          c(route.source, `${route.label} retained state`),
        ];
  return article(
    heading("Preserved release-note state"),
    prose(
      `Apple’s archived page labels this milestone as ${route.label} in its iOS 9 SDK documentation. The source contains ${route.sourceState}; this article structures ${changes.length} high-signal records.`,
      [
        c(
          route.source,
          `${route.label} title, component, and status inventory`,
        ),
      ],
    ),
    heading("How the milestone is bounded"),
    prose(comparison, comparisonCitations),
    heading("Selected coverage"),
    prose(
      `The selection covers ${route.selection}. Repeated issues retain one stable identity as they move from a known state to Apple’s fixed section.`,
      changeCitations,
    ),
    heading("Editorial boundary"),
    prose(
      "The article paraphrases the source in original language, preserves short technical names only where needed for identification, and claims neither exhaustive user-visible changes nor a build number. Beta 2 and GM remain timeline-only because the audited evidence does not isolate their release-note bodies.",
      [
        c(route.source, `${route.label} evidence boundary`),
        c(
          U.final,
          "iOS SDK Release Notes for iOS 9; Updated 2015-09-11",
          "Final-state boundary only; not assigned to GM.",
        ),
      ],
    ),
  );
}

const events = Object.keys(routeMetadata).map((alias) => {
  const route = routeMetadata[alias];
  const changes = changesByAlias.get(alias) || [];
  return {
    target: {
      releaseVersionId: "version-ios-9-0",
      routeAlias: alias,
    },
    authorship: "originalSynthesis",
    summary: `iOS 9 ${route.label} is represented by ${changes.length} source-supported release-note records from ${route.selection}; unsupported builds and unbounded carry-forward are excluded.`,
    article: eventArticle(alias),
    citations: uniqueCitations([
      c(route.source, `${route.label} release-note evidence`),
      ...(alias === "beta-1"
        ? [
            c(
              U.beta1Announcement,
              "Availability — developer beta immediately available",
            ),
          ]
        : []),
      ...(alias === "beta-3"
        ? [
            c(
              U.beta2Context,
              "Contemporaneous Beta 2 Apple Developer link",
              "Evidence-gap boundary only.",
            ),
          ]
        : []),
      ...(route.previous
        ? [
            c(
              route.previous,
              `Preceding retained state before ${route.label}`,
              "Comparison boundary only.",
            ),
          ]
        : []),
      c(
        U.final,
        "Final iOS 9 SDK document",
        "Archive-boundary comparison only.",
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

const expectedSeedInventory = [
  {
    platform: "iOS",
    majorVersion: 9,
    version: "9.0",
    releaseStatus: "released",
    publicReleaseDate: "2015-09-16",
    releaseNotesUrl: undefined,
    milestones: [
      ["Beta 1", "2015-06-08", false, undefined],
      ["Beta 2", "2015-06-23", false, undefined],
      ["Beta 3", "2015-07-08", false, undefined],
      ["Beta 4", "2015-07-21", false, undefined],
      ["Beta 5", "2015-08-06", false, undefined],
      ["GM", "2015-09-09", false, undefined],
      ["Public", "2015-09-16", false, undefined],
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
  .filter((version) => version.platform === "iOS" && version.version === "9.0")
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
    "The exact local iOS 9.0 seed inventory changed; re-audit the cohort before regenerating.",
  );
}

const expectedRoutes = new Set([
  "version-ios-9-0/beta-1",
  "version-ios-9-0/beta-3",
  "version-ios-9-0/beta-4",
  "version-ios-9-0/beta-5",
]);
const expectedCounts = new Map([
  ["beta-1", 34],
  ["beta-3", 43],
  ["beta-4", 37],
  ["beta-5", 24],
]);
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
  events.length !== 4 ||
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
          !["confirmed", "corroborated"].includes(change.evidenceState) ||
          change.inheritance !== "delta" ||
          /seed-identity|testflight-build|build-identity|community-observation/i.test(
            change.key,
          ),
      ),
  )
) {
  throw new Error("The expected iOS 9 prerelease bundle closure failed.");
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
      `iOS 9 prerelease change definition drifted for ${occurrence.key}.`,
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
    `iOS 9 prerelease change keys collide with existing content: ${collisions
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
const sourceLedger = sources
  .map(
    (source) =>
      `- [${source.title}](${source.url}) — ${source.publisher}; ${source.sourceClass}.`,
  )
  .join("\n");

const md = `# Apple iOS 9 prerelease archive batch

## Result

\`${outputName}\` is the reviewed overlay for four existing iOS 9.0 routes:
Beta 1, Beta 3, Beta 4, and Beta 5.

- ${events.length} substantive event overlays and no release-version overlays
- ${changeCount} source-backed change occurrences across
  ${uniqueLocalChangeKeys.length} stable, collision-checked definitions
- ${sources.length} declared and used sources with ${citationCount} citation
  references
- zero builds, build-number claims, route creation, Beta 2 changes, GM changes,
  Public-route changes, or community-observation changes
- every event is \`editoriallyVerified\`, approved at \`${reviewedAt}\`, and
  \`isIndexable: true\`

## Reviewed route closure

| Milestone | Existing alias | Selected changes | Fixed | Current known |
| --- | --- | ---: | ---: | ---: |
${routeRows}

The local iOS 9.0 seed contains seven milestones. Beta 2 and GM remain
timeline-only evidence gaps. Public is already owned by \`apple-ios-9.json\` and
is untouched.

## Evidence method

1. A fixed Internet Archive snapshot of BGR’s June 8, 2015 article reproduces
   Apple’s complete nine-page Beta 1 developer document. The transcript carries
   the original Apple Developer URL, document page markers 1/9 through 9/9, and
   Apple’s June 8 footer. Apple Newsroom independently confirms that the iOS 9
   beta software and SDK became immediately available that day.
2. A contemporaneous June 23 V2EX post labels the same Apple Developer URL as
   the iOS 9 Beta 2 notes. The Apple URL was cumulative and later overwritten,
   and no complete Beta 2 body survives in the audited source set. The link
   proves document identity and timing only; it does not support a Beta 2 page.
3. Internet Archive preserves intact Apple Developer HTML states titled for
   Beta 3, Beta 4, and Beta 5. Their metadata and footer dates are July 8,
   July 21, and August 7, 2015.
4. Beta 3 uses Apple’s explicit fixed headings, the self-dating two-factor note,
   and a limited set of current issues that later retained pages resolve.
   Because the Beta 2 body is absent, no Beta 2-to-Beta 3 addition diff is
   claimed.
5. Beta 4 and Beta 5 use their explicit fixed headings. Added notes and known
   issues are included only when a conservative exact-state comparison supports
   the boundary.

## Raw-source audit ledger

| State | Source identity | Inventory | SHA-256 | Use |
| --- | --- | --- | --- | --- |
| Archived BGR Beta 1 HTML | published 2015-06-08; archive replay 2026-01-16 | Complete Apple transcript; pages 1/9–9/9; ${events[0].changes.length} selected records | \`d3d2c355259b6930f0ae5c0dc3c262cdecdf59c038c34822dcfe9f3bc523596c\` | Beta 1 baseline |
| Apple iOS 9 preview HTML | published 2015-06-08; accessed twice on ${accessedAt} | Explicit immediate developer-beta availability | \`39399aad2d33a68c272a3d24ac2f60c1ace33adceefee9665320660cfbb8db35\` | Beta 1 timing corroboration |
| V2EX Beta 2 context HTML | posted 2015-06-23 19:02:40Z; accessed twice on ${accessedAt} | One exact Apple Developer release-note URL | \`a28b2b8e14259c55e2737076437c373df41e4b98f606f3d743a5f633ef9bc5d2\` | Beta 2 evidence-gap boundary |
| Apple Beta 3 archive HTML | document updated 2015-07-08; captured 2015-07-15 | 46 components; 56 status groups; 100 leaf records; ${expectedCounts.get("beta-3")} selected | \`9ffd758bb0b527afb5b77e9fabb8fa561ab9b0e4f57dc7eab579b0384891d500\` | Beta 3 evidence |
| Apple Beta 4 archive HTML | document updated and captured 2015-07-21 | 39 components; 49 status groups; 91 leaf records; ${expectedCounts.get("beta-4")} selected | \`74aabce5f36a06fcd275b269d076d760a2ac90e3ae501dd5e7e51675da74cd40\` | Beta 4 evidence |
| Apple Beta 5 archive HTML | document updated 2015-08-07; captured 2015-08-14 | 29 components; 38 status groups; 70 leaf records; ${expectedCounts.get("beta-5")} selected | \`19f2abb4787e751c7d1a6b0585739337bcc6311b2c711f7932431c64a51e6b80\` | Beta 5 evidence |
| Apple final archive HTML | document updated 2015-09-11; captured 2015-09-19 | 19 components; 21 status groups; 40 leaf records | \`8f9a9b3455640420f7153ae816a922bceacab81ee9996994760ccb8e63d66676\` | Final-state and GM boundary only |

All hashes were independently computed over the exact fetched response bodies.
Internet Archive replay URLs in the manifest identify the same fixed timestamped
states; the raw audit used \`id_\` replay to avoid toolbar rewriting. The Apple
Newsroom and V2EX pages are live wrappers rather than fixed captures; two
independent fetches produced the recorded body hashes, but only their narrowly
identified availability sentence, timestamp, label, and Apple URL are used.

## Copyright and editorial method

Every title, canonical summary, article paragraph, and occurrence summary is
original synthesis. Technical identifiers and product names are retained only
when needed to identify an API, framework, setting, or affected feature. The
manifest does not republish Apple’s lists, BGR’s prose, or community comments.

Repeated defects retain one canonical identity as Apple moves them from a
current known issue to a later fixed section. This supports a wiki-style history
without presenting cumulative documentation as a fresh release delta.

## Exact evidence gaps

- Beta 2 has a contemporaneous link to the correct Apple page but no retained
  milestone body. The cumulative URL now exposes a later state, so Beta 2
  remains timeline-only.
- The September 11 Apple document identifies the final iOS 9 SDK state, not the
  September 9 GM milestone. It is used only as an archive boundary; GM remains
  timeline-only.
- Beta 1 survives through a third-party reproduction. Its evidence remains
  explicitly corroborated and preserves the mirror provenance after editorial
  approval.
- Beta 3 is the first intact Apple-hosted archive state. Current known issues on
  that route describe state, not first appearance; only explicit fixed headings
  and self-dating language are treated as milestone deltas.
- The structured selection is deliberately high-signal rather than a claim that
  every source paragraph is a separate reader-facing change.
- No complete first-party build-number set was retained. The batch creates no
  build documents and makes no build assertion.
- Public is already covered by the approved iOS 9 public-release batch and is
  not patched here.

## Source ledger

All declared sources were accessed on ${accessedAt}.

${sourceLedger}

## Closure guards

- Exact comparison against the local iOS 9.0 seed record and all seven
  milestones
- Exact four-route allowlist with explicit exclusion of Beta 2, GM, and Public
- Zero versions and zero builds
- Collision scan across every other research-batch JSON plus
  \`apple-launch-content-2026.json\`
- ${changeCount} occurrences resolve to exactly
  ${uniqueLocalChangeKeys.length} stable local definitions
- Explicit rejection of identity, build, community-observation, and
  administrative keys
- Complete unique source declaration/use closure
- Deterministic formatted JSON SHA-256: \`${jsonSha}\`

## Publication and validation record

The generator's route, collision, review-state, evidence-boundary, source, and
citation guards pass before either artifact is written.

Independent editorial and evidence review:

- all four event articles and all ${changeCount} occurrences are
  \`editoriallyVerified\`, were approved at \`${reviewedAt}\`, and are indexable
- all five fixed Internet Archive response bodies reproduced the exact hashes in
  the raw ledger; two independent Apple Newsroom fetches and two independent
  V2EX fetches reproduced their updated live-wrapper hashes
- the Beta 1 reproduction contains the original Apple Developer URL, all nine
  page markers from 1/9 through 9/9, and Apple’s June 8 document date
- the durable HTML audit passed ${verification.locatorAssertions} component,
  status, and locator-fragment assertions across all ${changeCount}
  occurrences; the three direct Apple pages account for
  ${verification.directAppleAssertions} DOM-bounded assertions
- all ${verification.transitionFragments} fragments used for conservative Beta 4
  or Beta 5 additions occur in the current retained state and are absent from
  the exact preceding state
- the copyright scan checked ${verification.readerFacingFields} reader-facing
  fields against ${verification.sourceBodies} source bodies; the longest
  contiguous overlap was ${verification.maximumEditorialOverlapWords} words

Publication receipt:

- applied production plan: \`${dryRun.planSha}\`
- reviewed plan artifact SHA-256: \`${dryRun.planArtifactSha}\`
- rollback artifact SHA-256: \`${dryRun.rollbackArtifactSha}\`
- applied plan contents: ${dryRun.creates} creates,
  ${dryRun.patches} revision-guarded patches,
  ${dryRun.unchanged.toLocaleString("en-US")} unchanged documents, and a
  ${dryRun.mutationPayloadBytes.toLocaleString("en-US")}-byte mutation payload
- create split: ${dryRun.sourceCreates} sources and
  ${dryRun.changeCreates} stable change documents; zero versions, events, or
  builds were created
- all four patches targeted the exact existing Beta 1, Beta 3, Beta 4, and
  Beta 5 route documents and set only article, change, citation, approved
  review, provenance, summary, and indexability fields
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

Production coverage after publication:

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

All four published routes were fetched independently from the running local
site. Every response returned its full archival article, all expected structured
change titles, References, and its primary source. No response returned
placeholder copy or a \`noindex\` directive.

| Canonical route | HTTP | Full article | Expected changes | References | Primary source | Placeholder | Noindex |
| --- | ---: | --- | --- | --- | --- | --- | --- |
| \`/apple/ios/9.0/beta-1/\` | 200 | yes | 34/34 | yes | yes | no | no |
| \`/apple/ios/9.0/beta-3/\` | 200 | yes | 43/43 | yes | yes | no | no |
| \`/apple/ios/9.0/beta-4/\` | 200 | yes | 37/37 | yes | yes | no | no |
| \`/apple/ios/9.0/beta-5/\` | 200 | yes | 24/24 | yes | yes | no | no |

Final verification on ${accessedAt}:

- \`npm run research:validate\`:
  ${verification.researchBatches} batches validated; this batch reports
  ${events.length} events, ${changeCount} change occurrences,
  ${sources.length} sources, and ${citationCount} citation references;
  ${verification.globalChangeKeys.toLocaleString("en-US")} change keys remain
  globally consistent
- full repository suite: ${verification.fullTests} tests passed
- focused ingestion and manifest suite: ${verification.focusedTests} tests
  passed
- the checked-in HTML audit reproduced all
  ${verification.locatorAssertions} locator assertions and all
  ${verification.transitionFragments} transition boundaries with zero failures
- independent copyright-similarity scan: maximum contiguous overlap of
  ${verification.maximumEditorialOverlapWords} words
- ESLint, Prettier check, and focused \`git diff --check\`: passed
- deterministic regeneration: the formatted JSON SHA-256 remained
  \`${jsonSha}\`
- final production dry run reproduced
  ${publication.immediateZeroCreates} creates,
  ${publication.immediateZeroPatches} patches,
  ${publication.immediateZeroUnchanged.toLocaleString("en-US")} unchanged
  documents, the ${publication.immediateZeroPayloadBytes}-byte payload, and
  plan SHA \`${publication.immediateZeroPlanSha}\`
- the final planner reported “No Sanity data changed”

Reproduce with:

\`\`\`sh
node scripts/research-batches/build-apple-ios-9-prerelease.mjs
npm run research:validate
node --import tsx --test tests/launch-content-ingestion.test.ts tests/launch-content-manifest.test.ts
npx eslint scripts/research-batches/build-apple-ios-9-prerelease.mjs scripts/research-batches/audit-ios9-html-states.mjs
npx prettier --check scripts/research-batches/build-apple-ios-9-prerelease.mjs scripts/research-batches/apple-ios-9-prerelease.json scripts/research-batches/apple-ios-9-prerelease.md scripts/research-batches/audit-ios9-html-states.mjs
npx sanity exec scripts/ingest-launch-content.ts --with-user-token -- --content scripts/research-batches/apple-ios-9-prerelease.json
\`\`\`

The final command is intentionally a post-publication dry run and must
reproduce the zero plan above. Do not add \`--apply\`.
`;

const formattedMd = await prettier.format(md, { filepath: ledgerName });
writeFileSync(join(here, ledgerName), formattedMd);
