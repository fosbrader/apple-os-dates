import { createHash } from "node:crypto";
import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import prettier from "prettier";

const here = dirname(fileURLToPath(import.meta.url));
const outputName = "apple-ios-6-prerelease.json";
const ledgerName = "apple-ios-6-prerelease.md";
const accessedAt = "2026-07-30";
const reviewedAt = "2026-07-30T11:45:36Z";
const verification = {
  researchBatches: 70,
  globalChangeKeys: 4_131,
  focusedTests: 19,
  fullTests: 131,
  rawArtifacts: 13,
  rawEvidenceBytes: 2_928_299,
  normalizedArtifacts: 9,
  beta1CrossMirrorProbes: 62,
  copyrightFields: 352,
  maximumEditorialOverlapWords: 5,
};
const dryRun = {
  creates: 77,
  patches: 1,
  unchanged: 2_082,
  sourceCreates: 9,
  eventCreates: 4,
  changeCreates: 64,
  mutationPayloadBytes: 258_206,
  planSha: "1341577a1f95912bd982f406130e75b36cff7392e93d0d3c8c4f7e25c960fdc7",
  planArtifactSha:
    "b7c43f2f3fd48c41edeaf7e95bf4f9051c7af084b7a7d65051b9d6a3bdd18db3",
  rollbackArtifactSha:
    "9a6f73b3a33d6dbbd94492c232d7766eafc9a73dbe9eea106b660b6db56db73a",
};

const publication = {
  transactionId: "F0eE6eK5XyVXtlnaoyRcBA",
  receiptSha:
    "e404483da64c5ca2b1921f048fa05fd8bc045a6f84c00acdc64bdec9f38c0737",
  immediateZeroPlanSha:
    "c416da356ae1af476bc13ac3856d0547fe15df7b8750640de4370f839f35abce",
  immediateZeroPlanArtifactSha:
    "52482b40e38d9de295927c0e2a993bc93e86e7d79afb6d6bd61b1c6bbc58daa4",
  immediateZeroRollbackArtifactSha:
    "04bbac72906f0a3e48c582b1822709baf710573bc74a96a9eb3dd1953d8bc332",
  immediateZeroCreates: 0,
  immediateZeroPatches: 0,
  immediateZeroUnchanged: 2_160,
  immediateZeroPayloadBytes: 16,
  coverage: {
    totalVersions: 410,
    fullVersions: 410,
    totalAppearances: 1_983,
    fullAppearances: 430,
    sourceLinkedAppearances: 256,
    timelineOnlyAppearances: 1_297,
    approvedStructuredAppearances: 581,
  },
};

const U = {
  beta1Apple:
    "https://www.apple.com/newsroom/2012/06/11Apple-Previews-iOS-6-With-All-New-Maps-Siri-Features-Facebook-Integration-Shared-Photo-Streams-New-Passbook-App/",
  beta1Notes:
    "https://9to5mac.com/2012/06/14/apple-now-requires-user-permission-in-ios-6-before-apps-can-access-private-data/",
  beta1Mirror:
    "https://www.bgr.com/general/ios-6-beta-download-link-iphone-ipad-ipod-touch-release/",
  beta2Notes:
    "https://9to5mac.com/2012/06/25/apple-pushes-ios-6-0-update-to-devs/",
  beta2Context: "https://osxdaily.com/2012/06/25/ios-6-beta-2-released/",
  beta3Notes:
    "https://9to5mac.com/2012/07/16/apple-seeds-ios-6-beta-3-to-developers/",
  beta3Context:
    "https://www.iclarified.com/23212/apple-releases-ios-6-beta-3-to-developers",
  beta4Notes:
    "https://9to5mac.com/2012/08/06/ios-6-beta-4-released-to-developers/",
  beta4Mirror:
    "https://www.engadget.com/2012-08-06-apple-seeds-ios-6-beta-4-to-developers-changelog.html",
  beta4Context:
    "https://www.macrumors.com/2012/08/06/apple-seeds-ios-6-beta-4-to-developers/",
  gmContext:
    "https://www.macrumors.com/2012/09/12/apple-releases-ios-6-golden-master-to-developers/",
  gmSecond:
    "https://www.engadget.com/2012-09-12-ios-6-seeded-to-developers-ahead-of-official-launch.html",
  finalNotes: "https://support.apple.com/en-us/102995",
};

const sources = [
  {
    url: U.beta1Apple,
    title:
      "Apple Previews iOS 6 With All New Maps, Siri Features, Facebook Integration, Shared Photo Streams & New Passbook App",
    publisher: "Apple Newsroom",
    sourceClass: "firstPartyAnnouncement",
    author: "Apple",
    publishedAt: "2012-06-11T00:00:00Z",
    topics: ["iOS", "6.0", "features"],
  },
  {
    url: U.beta1Notes,
    title: "iOS 6 Beta 1 developer release-note transcript",
    publisher: "9to5Mac",
    sourceClass: "archive",
    author: "Élyse Betters",
    publishedAt: "2012-06-14T19:48:03.000Z",
    topics: [
      "iOS 6",
      "Beta 1",
      "Apple Developer release notes",
      "historical transcript",
    ],
  },
  {
    url: U.beta1Mirror,
    title: "iOS 6 Beta 1 developer release-note mirror",
    publisher: "BGR",
    sourceClass: "archive",
    author: "Zach Epstein",
    publishedAt: "2012-06-11T19:42:47.000Z",
    topics: [
      "iOS 6",
      "Beta 1",
      "Apple Developer release notes",
      "historical transcript",
    ],
  },
  {
    url: U.beta2Notes,
    title: "iOS 6 Beta 2 developer release-note transcript",
    publisher: "9to5Mac",
    sourceClass: "archive",
    author: "9to5 Staff",
    publishedAt: "2012-06-25T17:10:20.000Z",
    topics: [
      "iOS 6",
      "Beta 2",
      "Apple Developer release notes",
      "historical transcript",
    ],
  },
  {
    url: U.beta2Context,
    title: "iOS 6 Beta 2 Released",
    publisher: "OS X Daily",
    sourceClass: "journalism",
    author: "Matt Chan",
    publishedAt: "2012-06-25T17:44:04.000Z",
    topics: ["iOS 6", "Beta 2", "release identity", "contemporaneous report"],
  },
  {
    url: U.beta3Notes,
    title: "iOS 6 Beta 3 developer release-note transcript",
    publisher: "9to5Mac",
    sourceClass: "archive",
    author: "Mark Gurman",
    publishedAt: "2012-07-16T17:09:35.000Z",
    topics: [
      "iOS 6",
      "Beta 3",
      "Apple Developer release notes",
      "historical transcript",
    ],
  },
  {
    url: U.beta3Context,
    title: "Apple Releases iOS 6 Beta 3 to Developers",
    publisher: "iClarified",
    sourceClass: "journalism",
    author: "Shalom Levytam",
    publishedAt: "2012-07-16T00:00:00.000Z",
    topics: ["iOS 6", "Beta 3", "release identity", "contemporaneous report"],
  },
  {
    url: U.beta4Notes,
    title: "iOS 6 Beta 4 developer release-note transcript",
    publisher: "9to5Mac",
    sourceClass: "archive",
    author: "Mark Gurman",
    publishedAt: "2012-08-06T17:25:34.000Z",
    topics: [
      "iOS 6",
      "Beta 4",
      "Apple Developer release notes",
      "historical transcript",
    ],
  },
  {
    url: U.beta4Mirror,
    title: "iOS 6 Beta 4 developer release-note mirror",
    publisher: "Engadget",
    sourceClass: "archive",
    author: "Darren Murph",
    publishedAt: "2012-08-06T18:04:00.000Z",
    topics: [
      "iOS 6",
      "Beta 4",
      "Apple Developer release notes",
      "historical transcript",
    ],
  },
  {
    url: U.beta4Context,
    title: "Apple Seeds iOS 6 Beta 4 to Developers",
    publisher: "MacRumors",
    sourceClass: "journalism",
    author: "Eric Slivka",
    publishedAt: "2012-08-06T17:31:31.000Z",
    topics: [
      "iOS 6",
      "Beta 4",
      "YouTube app removal",
      "contemporaneous report",
    ],
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

const record = (
  key,
  title,
  canonicalSummary,
  category,
  action,
  component,
  marker,
  documentedStatus = "documented",
) => ({
  key: `ios-6-0-${key}`,
  title,
  canonicalSummary,
  category,
  action,
  component,
  marker,
  documentedStatus,
});

const beta1Changes = [
  record(
    "beta1-bonjour-p2p",
    "Bonjour peer discovery changed",
    "Peer-to-peer Bonjour discovery followed the new iOS 6 networking behavior.",
    "behavior",
    "changed",
    "Bonjour",
    "peer-to-peer services",
  ),
  record(
    "beta1-game-center-p2p-connectivity",
    "Game Center peer connectivity across networks",
    "Peer-to-peer Game Center sessions could fail across certain carrier and double-NAT network paths.",
    "bugFix",
    "knownIssue",
    "Game Center",
    "peer-to-peer connectivity",
  ),
  record(
    "beta1-game-center-simulator-production-data",
    "Simulator Game Center production-data access",
    "Simulator Game Center sessions could touch records from the live service instead of an isolated test environment.",
    "bugFix",
    "knownIssue",
    "Game Center",
    "Simulator production server",
  ),
  record(
    "beta1-icloud-mobileme-migration",
    "MobileMe accounts moved to iCloud",
    "The first seed documented account migration behavior for users moving from MobileMe to iCloud.",
    "behavior",
    "changed",
    "iCloud",
    "MobileMe account migration",
  ),
  record(
    "beta1-icloud-protected-files",
    "Protected files could block cloud operations",
    "iCloud document work could fail while protected files remained unavailable to the application.",
    "knownIssue",
    "knownIssue",
    "iCloud",
    "protected files",
  ),
  record(
    "beta1-icloud-filename-case",
    "Cloud filenames remained case-sensitive",
    "Applications needed to preserve filename case when working with iCloud documents.",
    "compatibility",
    "changed",
    "iCloud",
    "filename case",
  ),
  record(
    "beta1-icloud-setup-assistant-account-crash",
    "iCloud account creation during Setup Assistant",
    "Creating an iCloud account during initial setup could terminate Setup Assistant after the account was created.",
    "bugFix",
    "knownIssue",
    "iCloud",
    "Setup Assistant new account",
  ),
  record(
    "beta1-imessage-attachments-after-restore",
    "iMessage attachments after device restore",
    "A restored device could require a restart before iMessage attachments would send.",
    "bugFix",
    "knownIssue",
    "iMessage & FaceTime",
    "attachments after restore",
  ),
  record(
    "beta1-messaging-password-change-reset",
    "iMessage and FaceTime after password changes",
    "Changing an iMessage or FaceTime password could require manually restarting the affected service.",
    "bugFix",
    "knownIssue",
    "iMessage & FaceTime",
    "password change",
  ),
  record(
    "beta1-call-screen-fade-system-crash",
    "System stability when a call darkened the screen",
    "The system interface could terminate when the display darkened during a speakerphone or headset call.",
    "bugFix",
    "knownIssue",
    "IOKit",
    "phone-call screen fade",
  ),
  record(
    "beta1-itunes-wifi-sync-lock-power",
    "Wi-Fi Sync across lock and power states",
    "Wireless iTunes synchronization could fail while the device was locked or connected to power.",
    "bugFix",
    "knownIssue",
    "iTunes",
    "Wi-Fi Sync",
  ),
  record(
    "beta1-maps-apple-infrastructure",
    "Maps moved to Apple infrastructure",
    "The Maps application and its developer surface used Apple’s new mapping stack in the first seed.",
    "feature",
    "introduced",
    "Maps",
    "Apple mapping infrastructure",
  ),
  record(
    "beta1-maps-third-party-launch-offline-error",
    "False offline error in third-party Maps launches",
    "Opening Maps from another application could incorrectly report that no internet connection was available.",
    "bugFix",
    "knownIssue",
    "Maps",
    "third-party launch connection error",
  ),
  record(
    "beta1-maps-third-party-launch-current-location",
    "Current location in third-party Maps launches",
    "Maps could fail to show current location when another application launched it before its first direct use.",
    "bugFix",
    "knownIssue",
    "Maps",
    "third-party launch current location",
  ),
  record(
    "beta1-icloud-restored-video-thumbnails",
    "Video thumbnails after iCloud restore",
    "Videos restored from iCloud could display the same poster image instead of individual artwork.",
    "bugFix",
    "knownIssue",
    "Movie Player",
    "restored video thumbnails",
  ),
  record(
    "beta1-per-app-privacy",
    "Applications needed data-access permission",
    "iOS 6 introduced user authorization gates for applications requesting protected personal data.",
    "feature",
    "introduced",
    "Privacy",
    "per-application data permissions",
  ),
  record(
    "beta1-simulator-privacy-prompts",
    "Simulator omitted privacy prompts",
    "The first simulator state did not reproduce the device permission prompts for protected data.",
    "knownIssue",
    "knownIssue",
    "Privacy",
    "Simulator permission prompts",
  ),
  record(
    "beta1-shared-photo-stream-setup",
    "Shared Photo Streams entered testing",
    "The seed exposed Shared Photo Stream creation and invitation workflows with prerelease limitations.",
    "feature",
    "introduced",
    "Shared Photo Stream",
    "setup and invitations",
  ),
  record(
    "beta1-facebook-accounts-framework",
    "Facebook accounts became system resources",
    "Applications could request access to a user’s configured Facebook account through the Accounts framework.",
    "developerApi",
    "introduced",
    "Social",
    "Facebook Accounts framework",
  ),
  record(
    "beta1-passbook-transit-symbol",
    "Transit symbols in Passbook",
    "Passbook could use an airplane glyph for every kind of journey, regardless of the actual transit mode.",
    "bugFix",
    "knownIssue",
    "Passbook",
    "transit icon",
  ),
  record(
    "beta1-passbook-ingestion-suspension",
    "Passbook ingestion service suspension",
    "The system pass service could be suspended while importing a pass.",
    "bugFix",
    "knownIssue",
    "Passbook",
    "pass ingestion",
  ),
  record(
    "beta1-single-tap-control-gestures",
    "Single-tap gesture recognizers with controls",
    "Single-finger single-tap recognizers changed their delegate interaction with UIControl objects.",
    "developerApi",
    "changed",
    "UIKit",
    "single-finger single-tap recognizers",
  ),
  record(
    "beta1-uiwebview-painting",
    "Web views painted asynchronously",
    "UIWebView rendering adopted asynchronous painting behavior that applications needed to account for.",
    "developerApi",
    "changed",
    "UIKit",
    "UIWebView asynchronous painting",
  ),
  record(
    "beta1-autorotation-api",
    "Autorotation adopted a new API contract",
    "View controllers used the iOS 6 autorotation methods and supported-orientation masks.",
    "developerApi",
    "changed",
    "UIKit",
    "view-controller autorotation",
  ),
  record(
    "beta1-view-unloading",
    "View unloading APIs were deprecated",
    "The platform deprecated the view-unloading lifecycle used under earlier memory-pressure behavior.",
    "developerApi",
    "removed",
    "UIKit",
    "view unloading",
  ),
  record(
    "beta1-safari-animation-api",
    "Safari exposed animation timing APIs",
    "Web content gained additional animation timing behavior in the iOS 6 Safari engine.",
    "developerApi",
    "introduced",
    "Safari & WebKit",
    "animation APIs",
  ),
  record(
    "beta1-web-file-upload",
    "Web pages gained file-upload controls",
    "Safari added support for file-selection controls that could draw from device media.",
    "feature",
    "introduced",
    "Safari & WebKit",
    "file upload controls",
  ),
  record(
    "beta1-remote-web-inspector",
    "Remote Web Inspector arrived",
    "Developers could inspect mobile Safari and web-view content remotely from desktop Safari.",
    "developerApi",
    "introduced",
    "Safari & WebKit",
    "remote Web Inspector",
  ),
  record(
    "beta1-smart-app-banners",
    "Smart App Banners were incomplete",
    "Safari displayed application metadata above a page before the banner’s application-launch workflow was available.",
    "knownIssue",
    "knownIssue",
    "Safari & WebKit",
    "Smart App Banners",
  ),
  record(
    "beta1-keyboard-click-sounds-fast-typing",
    "Keyboard click sounds during fast typing",
    "Rapid typing could cause some keyboard click sounds to be skipped.",
    "bugFix",
    "knownIssue",
    "User Experience",
    "key clicking sounds",
  ),
  record(
    "beta1-keyboard-rotation-placement",
    "Keyboard placement after rotation",
    "Rotating an active keyboard from landscape to portrait could leave it incorrectly positioned.",
    "bugFix",
    "knownIssue",
    "User Experience",
    "keyboard rotation",
  ),
];

const beta2Changes = [
  record(
    "beta1-game-center-p2p-connectivity",
    "Game Center peer connectivity across networks",
    "Peer-to-peer Game Center sessions could fail across certain carrier and double-NAT network paths.",
    "bugFix",
    "fixed",
    "Game Center",
    "peer-to-peer connectivity",
  ),
  record(
    "beta2-game-center-friend-request-ui",
    "Friend requests stopped freezing",
    "The Game Center friend-request interface no longer paused or became unresponsive.",
    "bugFix",
    "fixed",
    "Game Center",
    "friend request UI",
  ),
  record(
    "beta2-game-center-invite-ui",
    "Game invites stopped crashing applications",
    "Presenting Game Center invite or automatch interfaces outside the sandbox no longer terminated the host application.",
    "bugFix",
    "fixed",
    "Game Center",
    "invite and automatch UI",
  ),
  record(
    "beta1-game-center-simulator-production-data",
    "Simulator Game Center production-data access",
    "Simulator Game Center sessions could touch records from the live service instead of an isolated test environment.",
    "bugFix",
    "fixed",
    "Game Center",
    "Simulator production server",
  ),
  record(
    "beta1-icloud-setup-assistant-account-crash",
    "iCloud account creation during Setup Assistant",
    "Creating an iCloud account during initial setup could terminate Setup Assistant after the account was created.",
    "bugFix",
    "fixed",
    "iCloud",
    "Setup Assistant new account",
  ),
  record(
    "beta1-imessage-attachments-after-restore",
    "iMessage attachments after device restore",
    "A restored device could require a restart before iMessage attachments would send.",
    "bugFix",
    "fixed",
    "iMessage & FaceTime",
    "attachments after restore",
  ),
  record(
    "beta1-messaging-password-change-reset",
    "iMessage and FaceTime after password changes",
    "Changing an iMessage or FaceTime password could require manually restarting the affected service.",
    "bugFix",
    "fixed",
    "iMessage & FaceTime",
    "password change",
  ),
  record(
    "beta1-call-screen-fade-system-crash",
    "System stability when a call darkened the screen",
    "The system interface could terminate when the display darkened during a speakerphone or headset call.",
    "bugFix",
    "fixed",
    "IOKit",
    "phone-call screen fade",
  ),
  record(
    "beta1-itunes-wifi-sync-lock-power",
    "Wi-Fi Sync across lock and power states",
    "Wireless iTunes synchronization could fail while the device was locked or connected to power.",
    "bugFix",
    "fixed",
    "iTunes",
    "Wi-Fi Sync",
  ),
  record(
    "beta1-icloud-restored-video-thumbnails",
    "Video thumbnails after iCloud restore",
    "Videos restored from iCloud could display the same poster image instead of individual artwork.",
    "bugFix",
    "fixed",
    "Movie Player",
    "restored video thumbnails",
  ),
  record(
    "beta2-simulator-retina-back-button",
    "Simulator navigation buttons rendered correctly",
    "Navigation-controller back buttons displayed properly in Retina simulator profiles.",
    "bugFix",
    "fixed",
    "Simulator",
    "Retina navigation back button",
  ),
  record(
    "beta1-passbook-ingestion-suspension",
    "Passbook ingestion service suspension",
    "The system pass service could be suspended while importing a pass.",
    "bugFix",
    "fixed",
    "Passbook",
    "pass ingestion",
  ),
  record(
    "beta1-single-tap-control-gestures",
    "Single-tap gesture recognizers with controls",
    "Single-finger single-tap recognizers changed their delegate interaction with UIControl objects.",
    "developerApi",
    "fixed",
    "UIKit",
    "single-finger single-tap recognizers",
  ),
  record(
    "beta2-attributed-string-font",
    "Attributed-string drawing handled fonts",
    "Attributed-string drawing no longer failed under the documented missing-font condition.",
    "bugFix",
    "fixed",
    "UIKit",
    "NSFontAttributeName drawing",
  ),
  record(
    "beta1-keyboard-click-sounds-fast-typing",
    "Keyboard click sounds during fast typing",
    "Rapid typing could cause some keyboard click sounds to be skipped.",
    "bugFix",
    "fixed",
    "User Experience",
    "key clicking sounds",
  ),
  record(
    "beta1-keyboard-rotation-placement",
    "Keyboard placement after rotation",
    "Rotating an active keyboard from landscape to portrait could leave it incorrectly positioned.",
    "bugFix",
    "fixed",
    "User Experience",
    "keyboard rotation",
  ),
];

const beta3Changes = [
  record(
    "beta3-facetime-landscape-controls",
    "Landscape calls regained response controls",
    "Incoming FaceTime calls displayed Answer and Decline controls in landscape orientation.",
    "bugFix",
    "fixed",
    "iMessage & FaceTime",
    "landscape Answer and Decline buttons",
  ),
  record(
    "beta3-itunes-restore-identity",
    "Restored devices kept their iTunes identity",
    "An iTunes restore no longer intermittently presented the device as new after reboot.",
    "bugFix",
    "fixed",
    "iTunes",
    "device identity after restore",
  ),
  record(
    "beta1-maps-third-party-launch-offline-error",
    "False offline error in third-party Maps launches",
    "Opening Maps from another application could incorrectly report that no internet connection was available.",
    "bugFix",
    "fixed",
    "Maps",
    "third-party launch connection error",
  ),
  record(
    "beta1-maps-third-party-launch-current-location",
    "Current location in third-party Maps launches",
    "Maps could fail to show current location when another application launched it before its first direct use.",
    "bugFix",
    "fixed",
    "Maps",
    "third-party launch current location",
  ),
  record(
    "beta1-passbook-transit-symbol",
    "Transit symbols in Passbook",
    "Passbook could use an airplane glyph for every kind of journey, regardless of the actual transit mode.",
    "bugFix",
    "fixed",
    "Passbook",
    "transit icon",
  ),
  record(
    "beta3-passbook-database-reset",
    "Passbook reset its prerelease database",
    "The Beta 3 transition cleared the prerelease pass database and required passes to be added again.",
    "behavior",
    "changed",
    "Passbook",
    "database reset",
  ),
  record(
    "beta3-reminders-add-completion",
    "Reminder creation regained its completion control",
    "The iPhone Reminders interface again displayed the control used to finish adding a reminder.",
    "bugFix",
    "fixed",
    "Reminders",
    "Done button while adding a reminder",
  ),
  record(
    "beta3-reminders-edit-crash",
    "Reminder editing stopped crashing",
    "Opening the editing workflow in the iPhone Reminders application no longer terminated the application.",
    "bugFix",
    "fixed",
    "Reminders",
    "Edit button crash",
  ),
  record(
    "beta3-simulator-store-product",
    "Simulator store sheets stopped crashing",
    "Selecting Buy in a simulated store-product view no longer terminated the application.",
    "bugFix",
    "fixed",
    "Simulator",
    "SKStoreProductViewController Buy button",
  ),
  record(
    "beta3-simulator-ipad-retina",
    "Older SDKs worked with Retina iPad simulation",
    "The iOS 5.1 SDK no longer crashed SpringBoard under the Retina iPad simulator profile.",
    "bugFix",
    "fixed",
    "Simulator",
    "iOS 5.1 Retina iPad profile",
  ),
  record(
    "beta3-simulator-medium-rectangle-ads",
    "Medium rectangle ads appeared in Simulator",
    "The iPad simulator rendered medium-rectangle advertising placements.",
    "bugFix",
    "fixed",
    "Simulator",
    "ADAdTypeMediumRectangle",
  ),
  record(
    "beta3-wallpaper-after-restore",
    "Wallpaper returned immediately after restore",
    "The current wallpaper displayed after restore or device erasure without requiring another reboot.",
    "bugFix",
    "fixed",
    "SpringBoard",
    "wallpaper after restore",
  ),
  record(
    "beta3-autolayout-scroll-indicators",
    "Auto Layout stopped jittering scroll indicators",
    "Scroll indicators remained steady when Auto Layout managed scroll views on Retina displays.",
    "bugFix",
    "fixed",
    "UIKit",
    "Auto Layout scroll indicators",
  ),
  record(
    "beta3-autolayout-engagement",
    "Constraint-based layouts engaged automatically",
    "Views entered Auto Layout without requiring the documented class-method override.",
    "bugFix",
    "fixed",
    "UIKit",
    "requiresConstraintBasedLayout",
  ),
  record(
    "beta3-uiwebview-loading-state",
    "Web-view loading state matched the main frame",
    "UIWebView kept its loading flag active until the main frame completed.",
    "bugFix",
    "fixed",
    "UIKit",
    "UIWebView.isLoading",
  ),
];

const beta4Changes = [
  record(
    "beta4-address-book-dismissal",
    "New-contact sheets dismissed after authorization",
    "A newly authorized application could close its new-contact controller normally.",
    "bugFix",
    "fixed",
    "Address Book",
    "ABNewPersonViewController dismissal",
  ),
  record(
    "beta4-dictionary-downloads",
    "Additional dictionaries began downloading",
    "Dictionary downloads outside English and Japanese no longer stalled at the request interface.",
    "bugFix",
    "fixed",
    "Dictionary",
    "non-English dictionary download",
  ),
  record(
    "beta4-game-center-birth-month",
    "Game Center showed birth-month choices",
    "The iPad account-creation popover displayed selectable months of birth.",
    "bugFix",
    "fixed",
    "Game Center",
    "birth-month popover",
  ),
  record(
    "beta4-maps-third-party-zoom",
    "Third-party Maps launches zoomed to location",
    "Maps centered and zoomed to current location when another application opened it.",
    "bugFix",
    "fixed",
    "Maps",
    "third-party launch zoom",
  ),
  record(
    "beta4-newsstand-downloads",
    "Newsstand accepted broader download paths",
    "Newsstand downloads were no longer limited to the simple HTTP path documented in the prior state.",
    "bugFix",
    "fixed",
    "Newsstand",
    "download transport",
  ),
  record(
    "beta4-passbook-lock-screen",
    "Boarding passes appeared on the Lock Screen",
    "Passbook could present eligible boarding passes on the Lock Screen.",
    "bugFix",
    "fixed",
    "Passbook",
    "boarding pass Lock Screen",
  ),
  record(
    "beta4-simulator-delete-alert",
    "Simulator deletion prompts appeared promptly",
    "The simulator displayed application-deletion confirmation without the earlier delay.",
    "bugFix",
    "fixed",
    "Simulator",
    "application delete alert",
  ),
  record(
    "beta4-shared-stream-camera",
    "Disabling shared streams left Camera responsive",
    "Turning off Shared Photo Streams no longer left the Camera application unresponsive.",
    "bugFix",
    "fixed",
    "Shared Photo Stream",
    "Camera after disabling streams",
  ),
  record(
    "beta4-facebook-permission-contract",
    "Facebook account option keys changed",
    "Facebook account requests kept the application identifier, retired two provisional option keys, and required an audience value with write permissions.",
    "developerApi",
    "changed",
    "Accounts Framework",
    "Facebook options and write-permission audience",
  ),
  record(
    "beta4-game-center-view-controller-singleton",
    "Game Center dropped its view-controller singleton",
    "The prerelease Game Center view-controller singleton was no longer supported.",
    "developerApi",
    "removed",
    "Game Center",
    "GKGameCenterViewController singleton",
  ),
  record(
    "beta4-game-center-score-sharing-header",
    "Game Center removed its score-sharing category",
    "The prerelease Game Center score-sharing header and its associated category left the SDK surface.",
    "developerApi",
    "removed",
    "Game Center",
    "GKScore+Sharing.h",
  ),
  record(
    "beta4-icloud-email-addresses",
    "iCloud mail adopted icloud.com addresses",
    "New iCloud mail accounts began using the icloud.com address domain.",
    "behavior",
    "changed",
    "iCloud",
    "icloud.com addresses",
  ),
  record(
    "beta4-core-location-activity",
    "Core Location revised activity classifications",
    "The Core Location activity-type enumeration changed during the Beta 4 SDK transition.",
    "developerApi",
    "changed",
    "Core Location",
    "activity type enumeration",
  ),
  record(
    "beta4-passbook-description-required",
    "Pass descriptions became mandatory",
    "Passes without a Description field failed validation and could not be ingested.",
    "developerApi",
    "changed",
    "Passbook",
    "Description field is now required",
  ),
  record(
    "beta4-passbook-simulator-ssl",
    "Simulator pass ingestion relaxed SSL",
    "Passbook in Simulator no longer required HTTPS or SSL for a pass web-service URL.",
    "developerApi",
    "changed",
    "Passbook",
    "Simulator no longer requires https/ssl",
  ),
  record(
    "beta4-status-bar-tint",
    "Applications could configure launch status-bar tint",
    "UIKit added launch-time configuration for the status-bar tint used by an application.",
    "developerApi",
    "introduced",
    "UIKit",
    "status-bar tint launch configuration",
  ),
  record(
    "beta4-youtube-app-removal",
    "The built-in YouTube application was removed",
    "Beta 4 no longer included Apple’s previously bundled YouTube application.",
    "removal",
    "removed",
    "System applications",
    "built-in YouTube app",
    "undocumented",
  ),
];

const eventSpecs = [
  {
    alias: "beta-1",
    label: "Beta 1",
    date: "2012-06-11",
    sequence: 1,
    channel: "developerBeta",
    changes: beta1Changes,
    noteSource: U.beta1Notes,
    corroborationSource: U.beta1Mirror,
    contextSources: [U.beta1Apple],
    method:
      "This is a first-document baseline, not a first-appearance claim. Thirty-one narrow developer-facing facts were selected from two independently retained transcriptions; boilerplate, workarounds, and publisher commentary are excluded.",
  },
  {
    alias: "beta-2",
    label: "Beta 2",
    date: "2012-06-25",
    sequence: 2,
    channel: "developerBeta",
    changes: beta2Changes,
    noteSource: U.beta2Notes,
    corroborationSource: U.beta2Context,
    contextSources: [],
    method:
      "Sixteen explicit fixed records are retained. Both Apple TV records, a contradictory Game Center timeout record whose body still promised a future fix, and a Smart App Banner record whose body still said launching was unavailable are excluded conservatively.",
  },
  {
    alias: "beta-3",
    label: "Beta 3",
    date: "2012-07-16",
    sequence: 3,
    channel: "developerBeta",
    changes: beta3Changes,
    noteSource: U.beta3Notes,
    corroborationSource: U.beta3Context,
    contextSources: [],
    method:
      "Fifteen atomic records represent fourteen explicit fixed entries from the Apple-authored transcript; the two distinct Reminders failures are separated. Two Apple TV records and two fixes already carried forward from Beta 2 are excluded.",
  },
  {
    alias: "beta-4",
    label: "Beta 4",
    date: "2012-08-06",
    sequence: 4,
    channel: "developerBeta",
    changes: beta4Changes,
    noteSource: U.beta4Notes,
    corroborationSource: U.beta4Mirror,
    contextSources: [U.beta4Context],
    method:
      "Eight non-Apple-TV, non-carry-forward fixed records and nine atomic records derived from six explicit Beta 4 developer-note change groups are retained. The independently reported built-in YouTube removal is the sole undocumented record.",
  },
];

const sourceByUrl = new Map(sources.map((source) => [source.url, source]));
const changeCitations = (spec, item) => {
  if (item.key === "ios-6-0-beta4-youtube-app-removal") {
    return [
      c(
        U.beta4Context,
        "Beta 4 changes; built-in YouTube application",
        "Contemporaneous report of the removal.",
      ),
      c(
        U.beta4Mirror,
        "Beta 4 article introduction; YouTube application",
        "Independent contemporaneous report.",
      ),
    ];
  }
  return [
    c(
      spec.noteSource,
      `${item.component}; ${item.marker}`,
      "Apple-authored historical transcript; factual result rewritten in original language.",
    ),
    c(
      spec.corroborationSource,
      spec.alias === "beta-1"
        ? `${item.component}; ${item.marker}`
        : `${spec.label} release identity and timing`,
      spec.alias === "beta-1"
        ? "Second full transcript used to reconcile the record."
        : "Contemporaneous source corroborates the milestone; exact transcript integrity is recorded in the audit ledger.",
    ),
  ];
};

const changesFor = (spec) =>
  spec.changes.map((item) => ({
    key: item.key,
    title: item.title,
    canonicalSummary: item.canonicalSummary,
    category: item.category,
    action: item.action,
    inheritance: "delta",
    summary:
      spec.alias === "beta-1"
        ? `The first retained iOS 6 developer-note state documents this ${item.component} behavior or limitation.`
        : item.documentedStatus === "undocumented"
          ? `Two contemporaneous reports place this ${item.component} change in ${spec.label}.`
          : `The milestone transcript places this ${item.component} result in ${spec.label}.`,
    documentedStatus: item.documentedStatus,
    evidenceState: "corroborated",
    verificationMethod:
      spec.alias === "beta-1"
        ? `Reconciled the ${item.component} record across two complete Apple-authored transcripts and retained only a short locator.`
        : item.documentedStatus === "undocumented"
          ? "Matched two independent contemporaneous reports; the item is explicitly labeled undocumented because it is outside the developer-note transcript."
          : `Matched the explicit ${item.component} record in the normalized Apple-authored transcript; the transcript hash and fixed-record inventory are independently locked by the batch audit.`,
    citations: changeCitations(spec, item),
  }));

const eventArticle = (spec, changes) => {
  const identityCitations = uniqueCitations([
    c(
      spec.noteSource,
      `${sourceByUrl.get(spec.noteSource)?.title}; ${spec.label}`,
      "Milestone evidence.",
    ),
    c(
      spec.corroborationSource,
      `${spec.label} release identity and timing`,
      "Independent milestone corroboration.",
    ),
    ...spec.contextSources.map((url) =>
      c(url, `${spec.label} historical boundary`),
    ),
  ]);
  return article(
    heading("Release milestone"),
    prose(
      `${spec.label} appeared on ${spec.date}. Its route identity is backed by contemporaneous publication records, while the change index below is derived from retained Apple-authored developer-note text.`,
      identityCitations,
    ),
    heading(`What ${spec.label} documents`),
    prose(
      `This review candidate contains ${changes.length} narrowly attributed records. Titles, summaries, and explanatory text are original synthesis; short component locators point readers back to the evidence.`,
      uniqueCitations(changes.flatMap((change) => change.citations)),
    ),
    heading("Selection boundary"),
    prose(spec.method, identityCitations),
    heading("Archive limitations"),
    prose(
      "This is a structured historical index, not a reproduction of Apple’s document and not a claim to exhaust every user-visible change. Unsupported build identities, publisher commentary, workaround prose, and the already-owned Public route are excluded.",
      identityCitations,
    ),
  );
};

const events = eventSpecs.map((spec) => {
  const changes = changesFor(spec);
  const stableEventId = `event:apple:ios:6.0:${spec.alias}`;
  const citations = uniqueCitations([
    c(spec.noteSource, `${spec.label} milestone evidence`),
    c(spec.corroborationSource, `${spec.label} identity corroboration`),
    ...spec.contextSources.map((url) => c(url, `${spec.label} context`)),
    ...changes.flatMap((change) => change.citations),
  ]);
  return {
    target: {
      releaseVersionId: "version-ios-6-0",
      routeAlias: spec.alias,
    },
    identity: {
      releaseVersionId: "version-ios-6-0",
      platformId: "platform-ios",
      stableEventId,
      label: spec.label,
      routeAlias: spec.alias,
      channel: spec.channel,
      appearanceDate: spec.date,
      sequence: spec.sequence,
      isRevision: false,
      availabilityState: "available",
      closesReleaseCycle: false,
    },
    authorship: "originalSynthesis",
    summary: `${spec.label} is represented by ${changes.length} narrowly attributed historical records with explicit transcript and milestone provenance.`,
    article: eventArticle(spec, changes),
    citations,
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
    majorVersion: 6,
    version: "6.0",
    releaseStatus: "released",
    publicReleaseDate: "2012-09-19",
    milestones: [["Public", "2012-09-19", false, undefined]],
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
  .filter((version) => version.platform === "iOS" && version.version === "6.0")
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
    "The exact local iOS 6.0 seed inventory changed; re-audit before regenerating.",
  );
}

const expectedCounts = new Map([
  ["beta-1", 31],
  ["beta-2", 16],
  ["beta-3", 15],
  ["beta-4", 17],
]);
const expectedDates = new Map(
  eventSpecs.map((spec) => [spec.alias, spec.date]),
);
const expectedRoutes = new Set(
  [...expectedCounts.keys()].map((alias) => `version-ios-6-0/${alias}`),
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
  changeCount !== 79 ||
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
        `event:apple:ios:6.0:${event.target.routeAlias}` ||
      event.authorship !== "originalSynthesis" ||
      event.provenanceStatus !== "editoriallyVerified" ||
      event.editorialReview.status !== "approved" ||
      event.editorialReview.reviewedAt !== reviewedAt ||
      event.isIndexable !== true ||
      event.changes.length !== expectedCounts.get(event.target.routeAlias) ||
      event.changes.some(
        (item) =>
          item.evidenceState !== "corroborated" ||
          item.inheritance !== "delta" ||
          !["documented", "undocumented"].includes(item.documentedStatus) ||
          /build-identity|community-observation|seed-identity/i.test(item.key),
      ),
  )
) {
  throw new Error("The expected iOS 6 prerelease bundle closure failed.");
}

const undocumented = events
  .flatMap((event) => event.changes)
  .filter((item) => item.documentedStatus === "undocumented");
if (
  undocumented.length !== 1 ||
  undocumented[0].key !== "ios-6-0-beta4-youtube-app-removal"
) {
  throw new Error("The undocumented-change allowlist drifted.");
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
      `iOS 6 prerelease change definition drifted for ${occurrence.key}.`,
    );
  }
  localChangeDefinitions.set(occurrence.key, definition);
}
const uniqueLocalChangeKeys = [...localChangeDefinitions.keys()];
if (uniqueLocalChangeKeys.length !== 64) {
  throw new Error(
    `Expected 64 stable iOS 6 prerelease definitions; found ${uniqueLocalChangeKeys.length}.`,
  );
}
const repeatedDefinitionCount = changeCount - uniqueLocalChangeKeys.length;
if (repeatedDefinitionCount !== 15) {
  throw new Error(
    `Expected 15 canonical recurrence occurrences; found ${repeatedDefinitionCount}.`,
  );
}
const rejectedCarryForwardOrContradictionKeys = [
  "ios-6-0-beta2-smart-app-banners",
  "ios-6-0-beta3-single-tap-gestures",
  "ios-6-0-beta3-attributed-string-font",
  "ios-6-0-beta4-single-tap-gestures",
];
if (
  events
    .flatMap((event) => event.changes)
    .some((item) => rejectedCarryForwardOrContradictionKeys.includes(item.key))
) {
  throw new Error(
    "A contradictory or already-resolved carry-forward record re-entered the iOS 6 delta set.",
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
const collisions = uniqueLocalChangeKeys.filter((key) =>
  otherChangeKeys.has(key),
);
if (collisions.length > 0) {
  throw new Error(
    `iOS 6 prerelease change keys collide with existing content: ${collisions
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
const sourceLedger = sources
  .map(
    (source) =>
      `- [${source.title}](${source.url}) — ${source.publisher}; ${source.author ? `by ${source.author}; ` : ""}${source.sourceClass}.`,
  )
  .join("\n");
const routeRows = eventSpecs
  .map(
    (spec) =>
      `| iOS | ${spec.label} | \`${spec.alias}\` | ${spec.date} | ${spec.changes.length} |`,
  )
  .join("\n");
const routeVerificationRows = eventSpecs
  .map(
    (spec) =>
      `| \`/apple/ios/6.0/${spec.alias}/\` | 200 | 8/8 | ${spec.changes.length}/${spec.changes.length} | yes | yes | no | no |`,
  )
  .join("\n");

const md = `# Apple iOS 6 prerelease archive batch

## Result

\`${outputName}\` is the editorially approved archive overlay for four
historically defensible iOS 6.0 prerelease routes missing from the local seed.

- ${events.length} identity-backed event creations and no release-version overlays
- ${changeCount} milestone-specific occurrences across
  ${uniqueLocalChangeKeys.length} stable, collision-checked definitions
- ${sources.length} declared and used sources with ${citationCount} citation references
- zero builds, build-number claims, or Public-route changes
- every route is \`editoriallyVerified\`, approved at \`${reviewedAt}\`, and
  explicitly \`isIndexable: true\`

## Approved route closure

| Platform | Milestone | New alias | Appearance date | Selected changes |
| --- | --- | --- | --- | ---: |
${routeRows}

The local seed contains only Public on 2012-09-19. Public is already owned by
\`apple-ios-6.json\` and remains untouched.

## Evidence method

1. Apple’s June 11 announcement establishes Beta 1 availability. Two complete,
   independently hosted transcriptions preserve the Apple-authored developer
   notes. Thirty-one narrow records form a first-document baseline; they are not
   represented as changes first introduced on that date unless the note itself
   supports that status.
2. The Beta 2 transcript contains 20 explicit fixed headings. Sixteen are
   retained: two Apple TV records are outside this batch, and two contradictory
   bodies are excluded rather than being converted into false deltas.
3. The Beta 3 transcript contains 18 explicit fixed headings. Fourteen
   non-Apple-TV, non-carry-forward entries become 15 atomic records because the
   two distinct Reminders failures are kept separate.
4. Beta 4 has two complete developer-note transcriptions. Eight non-Apple-TV,
   non-carry-forward fixed records and nine atomic records from six current
   developer-note change groups are retained. A built-in YouTube application
   removal reported independently by MacRumors and Engadget is the only item
   labeled \`undocumented\`.
5. Two contemporaneous reports establish the September 12 GM, and Apple’s
   surviving public notes establish the later public-release boundary. No
   complete GM-specific release-note artifact was located. The manifest
   validator requires a structured change set for every content route, so GM
   remains an explicit evidence gap rather than receiving a synthetic record.

## Byte and transcript audit ledger

| State | Public artifact | Raw bytes | Raw SHA-256 | Normalized or parsed assertion |
| --- | --- | ---: | --- | --- |
| Beta 1 | Apple Newsroom announcement | 133,084 | \`96e5c6abce88bd369076b6c9355e1f771df74f734d70b9363e6d82c4be84343e\` | 6,598-byte normalized article; \`a93a0bd11405c67b8cecfd0ef81ae0ccfa2578bee8c07b8f4c52c3c97760e210\` |
| Beta 1 | 9to5Mac transcript | 161,340 | \`6cb1a0a665d4d0f78c372016707a8504ef99e6361a1e8141988e1c56bcb066d3\` | 15,060-byte normalized transcript; \`5c8b8d94e0bd6b488bce89c7bda0dbc1a7066f39f12b465a2380de4dbf1f515f\` |
| Beta 1 | BGR transcript | 61,138 | \`9177fd68c9a021c046065ea5842be545e94295e4f4fc97c829f8d2a76321b702\` | 14,924-byte normalized transcript; \`3c37ed9faf5616003401560974d0952b83a3d960e5f61b12df3cedf6d5de1a0a\` |
| Beta 2 | 9to5Mac transcript | 184,265 | \`22eadb48648de41279bbb5b08f61736e57d84385d4ac90f2ddf855f639925406\` | 20 fixed records; canonical inventory \`73135cc523362992aa3c879814a2073a738e8d9817450197124d4fc95358e92c\` |
| Beta 3 | 9to5Mac transcript | 201,190 | \`5b76d69bbe5f51b07f68812cbac9889309fcbd07613cad70d590239dd5e29ada\` | 18 fixed records; canonical inventory \`48f090b1cb60b30abc91f8d9f284b54dc5f27639ae9b3d56e7ed6455f737fd99\` |
| Beta 4 | 9to5Mac transcript | 199,138 | \`8f6b5e05a75100ae769a654202a10ef1e49e4186fea1b78655200f04358408f9\` | 13 fixed records; canonical inventory \`9bad162630b465dec17a2e68620b1945e13b2dd1ce4366675d5e0b21b0b96a0c\` |
| Beta 4 | Engadget transcript | 87,771 | \`7d16b463ffc85e4ffd05407a75f2769d771c2f2351952b0d5cf28303575b7d14\` | 28,783-byte normalized transcript; \`51b157ed0e67c4542882a185126da15ec07f3eae928c8d786fb96e60145dd55d\` |
| GM | MacRumors report | 124,047 | \`355a8cad524b705fde118d367b9bfffde6aa7d868dcedf8571afdeaefd65b258\` | 640-byte normalized article; \`a8d78c23d13d36dae7ecc8f24009e268958c5f1ac40c8527a8b3387b169aae69\` |
| GM | Engadget report | 56,703 | \`538728e1d292dc1430f1dfa8f2d07bf10a25dbc684b9b9b553010f0af3438991\` | 694-byte normalized article; \`8584f77e5481d253bf2cb06569c2dedabdd0d58d0fb3c4b4bdbc3c98091ff04b\` |

Raw evidence is retained only in the ignored temporary research directory.
The committed audit helper accepts that directory as input and verifies the
hashes, publication metadata, fixed-record counts, component splits, and short
selection probes without committing publisher text.

An independent live re-fetch reproduced all eight reviewed normalized article
and transcript bodies exactly. Seven complete wrapper payloads also reproduced
byte-for-byte; Engadget’s wrapper changed by four bytes while its scoped article
hash remained identical.

## Exact evidence gaps and exclusions

- The local seed has no prerelease milestones for iOS 6.0. These four events
  therefore carry complete deterministic identities rather than pretending to
  patch pre-existing routes.
- No complete first-party-hosted prerelease artifact was found for Beta 2, Beta
  3, Beta 4, or GM. The retained developer-note bodies are explicitly credited
  as third-party transcriptions; editorial approval does not convert their
  corroborated provenance into first-party confirmation.
- Beta 1 is a baseline, not a computed predecessor delta.
- Apple TV fixed records are excluded because this batch targets iOS, not the
  separate Apple TV software track.
- Beta 2’s Game Center timeout body still promises a future fix despite its
  “FIXED” prefix. Its Smart App Banner body likewise says launching remains
  unavailable. Neither contradictory entry is represented as a release delta.
- Beta 3’s Single-Tap and attributed-string fixed records and Beta 4’s
  Single-Tap fixed record are cumulative carry-forward from an earlier resolved
  state, so they are not presented as newly fixed.
- The Beta 3 Passbook database entry sits under a fixed heading, but its body
  describes a one-time prerelease database reset. It is conservatively modeled
  as a changed state rather than a bug-fix claim.
- GM is not created by this batch. Its date is defensible, but no inspectable
  GM-specific note set survived this research pass and the content contract
  correctly rejects empty or synthetic change sets.
- No build number is inferred from publisher prose, download filenames, or
  unavailable developer artifacts.
- Public remains owned by the existing iOS 6 public batch.

## Copyright and attribution controls

- All reader-facing article, title, summary, and canonical-summary text is
  original synthesis.
- Every retained factual record carries source citations and a short locator.
- Apple is credited as the author of the underlying developer-note text in the
  editorial method; each preserving page’s publisher and byline are retained so
  hosting and authorship provenance remain explicit.
- No transcript, screenshot, source HTML, or long source excerpt is committed.
- Publisher commentary and workaround prose are not republished.
- The undocumented YouTube item is separately labeled and requires two
  independent contemporaneous reports.

## Source ledger

All declared sources were accessed on ${accessedAt}.

${sourceLedger}

Evidence-gap sources audited but deliberately not declared in the manifest:

- [Apple Releases iOS 6 Golden Master to Developers](${U.gmContext}) —
  MacRumors; contemporaneous GM identity report.
- [iOS 6 seeded to developers ahead of official launch](${U.gmSecond}) —
  Engadget; independent contemporaneous GM identity report.
- [About iOS 6 Updates](${U.finalNotes}) — Apple Support; final public-state
  boundary only.

## Closure guards

- Exact comparison against the local iOS 6.0 seed record and its sole Public
  milestone
- Exact four-route identity and date allowlist, with GM and Public excluded
- Zero versions and zero builds; exact approved review, provenance, and
  indexability closure for all four events
- Collision scan across every other research-batch JSON plus
  \`apple-launch-content-2026.json\`
- ${changeCount} occurrences resolve to exactly
  ${uniqueLocalChangeKeys.length} stable local definitions
- Fifteen known-state → fixed-state occurrences retain one canonical identity
- Explicit rejection of the contradictory Smart App Banner entry and all three
  already-resolved carry-forward entries
- Exactly one undocumented allowlisted record
- Complete unique source declaration/use closure
- Deterministic formatted JSON SHA-256: \`${jsonSha}\`

## Editorial approval and validation record

The independently re-fetched and audited event creations are approved:

- provenance: \`editoriallyVerified\`
- editorial status: \`approved\` at \`${reviewedAt}\`
- indexability: \`true\`

Verified on ${accessedAt}:

- evidence audit: ${verification.rawArtifacts} exact raw artifacts totaling
  ${verification.rawEvidenceBytes.toLocaleString("en-US")} bytes,
  ${verification.normalizedArtifacts} normalized text locks,
  ${verification.beta1CrossMirrorProbes} Beta 1 cross-mirror probes, exact
  Beta 2/Beta 3/Beta 4 fixed inventories, contradiction and carry-forward
  exclusions, publication metadata for Beta 1–4 and GM, and an independent
  eight-body live re-fetch
- \`npm run research:validate\`:
  ${verification.researchBatches} batches and
  ${verification.globalChangeKeys.toLocaleString("en-US")} globally consistent
  change keys; this batch reports ${events.length} events,
  ${changeCount} changes, ${sources.length} sources, and
  ${citationCount} citations
- focused ingestion/manifest suite:
  ${verification.focusedTests} of ${verification.focusedTests} passed
- full repository suite:
  ${verification.fullTests} of ${verification.fullTests} passed
- independent copyright-similarity scan: maximum contiguous reader-facing
  overlap of ${verification.maximumEditorialOverlapWords} words across
  ${verification.copyrightFields} editorial fields
- ESLint, Prettier check, deterministic regeneration, and
  \`git diff --check\`: passed
- production dry plan: ${dryRun.creates} creates,
  ${dryRun.patches} revision-guarded patch, and
  ${dryRun.unchanged.toLocaleString("en-US")} unchanged documents
- create split: ${dryRun.sourceCreates} new sources,
  ${dryRun.eventCreates} new deterministic events, and
  ${dryRun.changeCreates} stable change definitions
- the one planned patch is revision-guarded and adds only \`author: "Apple"\`
  to the exact reused Apple Newsroom source
- mutation payload:
  ${dryRun.mutationPayloadBytes.toLocaleString("en-US")} bytes
- production plan SHA: \`${dryRun.planSha}\`
- two consecutive production dry runs reproduced the same plan SHA, counts,
  payload size, plan artifact, and rollback artifact
- plan artifact SHA-256: \`${dryRun.planArtifactSha}\`
- rollback artifact SHA-256: \`${dryRun.rollbackArtifactSha}\`
- all four event creations preserve the exact editorially verified, approved,
  and indexable identities in this manifest

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
Each response returned all eight archival article blocks, every expected
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
node scripts/research-batches/audit-ios6-prerelease.mjs tmp/ios6-evidence scripts/research-batches/apple-ios-6-prerelease.json
node scripts/research-batches/build-apple-ios-6-prerelease.mjs
npm run research:validate
node --import tsx --test tests/launch-content-ingestion.test.ts tests/launch-content-manifest.test.ts
npx eslint scripts/research-batches/build-apple-ios-6-prerelease.mjs scripts/research-batches/audit-ios6-prerelease.mjs
npx prettier --check scripts/research-batches/build-apple-ios-6-prerelease.mjs scripts/research-batches/audit-ios6-prerelease.mjs scripts/research-batches/apple-ios-6-prerelease.json scripts/research-batches/apple-ios-6-prerelease.md
npx sanity exec scripts/ingest-launch-content.ts --with-user-token -- --content scripts/research-batches/apple-ios-6-prerelease.json
\`\`\`

The final Sanity command is intentionally a post-publication dry run and must
reproduce the zero plan above. Do not add \`--apply\`.
`;

const formattedMd = await prettier.format(md, { filepath: ledgerName });
writeFileSync(join(here, ledgerName), formattedMd);
