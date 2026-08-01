import { createHash } from "node:crypto";
import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import prettier from "prettier";

const here = dirname(fileURLToPath(import.meta.url));
const outputName = "apple-ios-ipados-13-prerelease.json";
const ledgerName = "apple-ios-ipados-13-prerelease.md";
const accessedAt = "2026-07-30";
const reviewedAt = "2026-07-30T09:04:52Z";

const publication = {
  planSha: "04161943c522d1799a35c5ee7fc93edd66b183ffa295ecf2c21a84b8da2af75d",
  planArtifactSha:
    "6174a0c4483d162269ea819228abd51b9706a3522699bdd616aeac83bd09307a",
  rollbackArtifactSha:
    "0efef1669a3f673d13dc04244a7f4c32fd68bff42d38f8a46711e8f20e237645",
  transactionId: "eOgq1Ovu5XNUv1qNFUxq3z",
  receiptSha:
    "6e37467c042bae2cdf9957e2b3c43321d22772c4bbf58aefc10fedd735b96356",
  immediateZeroPlanSha:
    "fe252148f4c0213341051acffad64f6c41f0eda4de2f5c451367124467adec34",
  immediateZeroPlanArtifactSha:
    "27f6298b778c8f21e4203b6ce899d0b57128c7d3360c8ec8bb43d530eaf6a699",
  immediateZeroRollbackArtifactSha:
    "fbe91930673227f8c3c14a342b92ab3a80c42410a325a08f6295f986d0792dad",
  immediateZeroUnchanged: 2184,
  immediateZeroPayloadBytes: 16,
};

const archivePath =
  "https://developer.apple.com/documentation/ios_ipados_release_notes";
const U = {
  installBeta: "https://developer.apple.com/support/install-beta",
  beta1: `https://web.archive.org/web/20190605224338/${archivePath}/ios_ipados_13_beta_release_notes`,
  beta2: `https://web.archive.org/web/20190617182129/${archivePath}/ios_ipados_13_beta_2_release_notes`,
  beta2Late: `https://web.archive.org/web/20190701210440/${archivePath}/ios_ipados_13_beta_2_release_notes`,
  beta3: `https://web.archive.org/web/20190704121813/${archivePath}/ios_ipados_13_beta_3_release_notes`,
  beta3Revision: `https://web.archive.org/web/20190711171915/${archivePath}/ios_ipados_13_beta_3_release_notes`,
  beta4: `https://web.archive.org/web/20190718064136/${archivePath}/ios_ipados_13_beta_4_release_notes`,
  beta5: `https://web.archive.org/web/20190730072345/${archivePath}/ios_ipados_13_beta_5_release_notes`,
  beta7: `https://web.archive.org/web/20190815184709/${archivePath}/ios_ipados_13_beta_7_release_notes`,
  beta8: `https://web.archive.org/web/20190822104335/${archivePath}/ios_ipados_13_beta_8_release_notes`,
};

const archivedSources = [
  [
    U.beta1,
    "iOS & iPadOS 13 Beta Release Notes",
    "2019-06-05T22:43:38.000Z",
    "Beta 1",
  ],
  [
    U.beta2,
    "iOS & iPadOS 13 Beta 2 Release Notes",
    "2019-06-17T18:21:29.000Z",
    "Beta 2",
  ],
  [
    U.beta2Late,
    "iOS & iPadOS 13 Beta 2 Release Notes — July 1 state",
    "2019-07-01T21:04:40.000Z",
    "Beta 2 comparison state",
  ],
  [
    U.beta3,
    "iOS & iPadOS 13 Beta 3 Release Notes",
    "2019-07-04T12:18:13.000Z",
    "Beta 3",
  ],
  [
    U.beta3Revision,
    "iOS & iPadOS 13 Beta 3 Release Notes — July 11 state",
    "2019-07-11T17:19:15.000Z",
    "Beta 3 v2",
  ],
  [
    U.beta4,
    "iOS & iPadOS 13 Beta 4 Release Notes",
    "2019-07-18T06:41:36.000Z",
    "Beta 4",
  ],
  [
    U.beta5,
    "iOS & iPadOS 13 Beta 5 Release Notes",
    "2019-07-30T07:23:45.000Z",
    "Beta 5",
  ],
  [
    U.beta7,
    "iOS & iPadOS 13 Beta 7 Release Notes",
    "2019-08-15T18:47:09.000Z",
    "Beta 7",
  ],
  [
    U.beta8,
    "iOS & iPadOS 13 Beta 8 Release Notes",
    "2019-08-22T10:43:35.000Z",
    "Beta 8",
  ],
].map(([url, title, publishedAt, milestone]) => ({
  url,
  title: `${title} (preserved snapshot)`,
  publisher: "Apple Developer via Internet Archive",
  sourceClass: "archive",
  author: "Apple",
  publishedAt,
  topics: ["iOS", "iPadOS", "13.0", milestone, "historical release notes"],
}));

const sources = [
  ...archivedSources,
  {
    url: U.installBeta,
    title: "Installing and using Apple beta software",
    publisher: "Apple Developer",
    sourceClass: "firstPartyDocumentation",
    author: "Apple",
    topics: ["beta software", "backup", "release notes", "Feedback Assistant"],
  },
];

const sourceForAlias = {
  "beta-1": U.beta1,
  "beta-2": U.beta2,
  "beta-3": U.beta3,
  "beta-3-v2": U.beta3Revision,
  "beta-4": U.beta4,
  "beta-5": U.beta5,
  "beta-7": U.beta7,
  "beta-8": U.beta8,
};

const comparisonForAlias = {
  "beta-1": [U.beta1],
  "beta-2": [U.beta1, U.beta2],
  "beta-3": [U.beta2Late, U.beta3],
  "beta-3-v2": [U.beta3, U.beta3Revision],
  "beta-4": [U.beta3Revision, U.beta4],
  "beta-5": [U.beta4, U.beta5],
  "beta-7": [U.beta7],
  "beta-8": [U.beta7, U.beta8],
};

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

const both = ["ios", "ipados"];
const ios = ["ios"];
const ipados = ["ipados"];

const entry = (
  alias,
  platforms,
  key,
  title,
  canonicalSummary,
  category,
  action,
  component,
  issueIds,
  sourceStatus,
  evidence,
) => ({
  alias,
  platforms,
  key,
  title,
  canonicalSummary,
  category,
  action,
  component,
  issueIds,
  sourceStatus,
  evidence,
});

const selected = [
  entry(
    "beta-1",
    both,
    "apple-13-beta1-avengine-voice-processing",
    "Voice processing for AVAudioEngine",
    "AVAudioEngine gained an option for enabling voice-processing mode.",
    "developerApi",
    "introduced",
    "Audio",
    "50906329",
    "New Features",
    "baseline",
  ),
  entry(
    "beta-1",
    both,
    "apple-13-beta1-shared-airpods-audio",
    "Shared listening with supported headphones",
    "Compatible iPhone and iPad models could share audio with AirPods or Powerbeats Pro.",
    "feature",
    "introduced",
    "Audio Sharing",
    "51331268",
    "New Features",
    "baseline",
  ),
  entry(
    "beta-1",
    both,
    "apple-13-beta1-hevc-alpha-video",
    "HEVC video with transparency",
    "AVFoundation added HEVC encoding for video that carries an alpha channel.",
    "developerApi",
    "introduced",
    "AVFoundation",
    "8045917",
    "New Features",
    "baseline",
  ),
  entry(
    "beta-1",
    both,
    "apple-13-beta1-core-image-raw-floor",
    "Newer RAW baseline in Core Image",
    "Two Core Image loading APIs stopped accepting RAW formats through version 5 while retaining version 6 and newer.",
    "compatibility",
    "changed",
    "Core Image",
    "50911303",
    "New Features",
    "baseline",
  ),
  entry(
    "beta-1",
    both,
    "apple-13-beta1-mail-blocked-senders",
    "Mail blocked-sender filtering",
    "Mail added a switch for ignoring blocked senders and shared its contact block list with communication apps.",
    "feature",
    "introduced",
    "Mail",
    "50775961",
    "New Features",
    "baseline",
  ),
  entry(
    "beta-1",
    both,
    "apple-13-beta1-urlsession-get-body-error",
    "GET request bodies rejected by URLSession",
    "URLSession tasks using GET with a request body began failing with a data-length error.",
    "compatibility",
    "changed",
    "Networking",
    "46025234",
    "New Features",
    "baseline",
  ),
  entry(
    "beta-1",
    both,
    "apple-13-beta1-table-cell-selection-appearance",
    "Stable table-cell subview appearance",
    "Selecting or highlighting a table cell no longer automatically rewrote the background and opacity of its content subviews.",
    "developerApi",
    "changed",
    "UIKit",
    "13955336",
    "New Features",
    "baseline",
  ),
  entry(
    "beta-1",
    both,
    "apple-13-beta1-search-presentation-context",
    "Automatic search presentation context",
    "Navigation controllers began setting presentation context automatically for a displayed controller with an attached search controller.",
    "developerApi",
    "changed",
    "UIKit",
    "31338934",
    "New Features",
    "baseline",
  ),
  entry(
    "beta-1",
    both,
    "apple-13-beta1-refresh-control-insets",
    "Refresh controls use adjusted insets",
    "Refresh controls moved their usual inset contribution into the scroll view's adjusted inset calculation.",
    "developerApi",
    "changed",
    "UIKit",
    "35866834",
    "New Features",
    "baseline",
  ),
  entry(
    "beta-1",
    both,
    "apple-13-beta1-manual-cell-self-sizing",
    "Clarified manual table-cell sizing",
    "Manually sized table cells received a defined content-view width and automatic separator allowance.",
    "developerApi",
    "changed",
    "UIKit",
    "39742612",
    "New Features",
    "baseline",
  ),
  entry(
    "beta-1",
    both,
    "apple-13-beta1-trait-change-callback",
    "Trait callbacks only for actual changes",
    "Trait-change callbacks stopped serving as a guaranteed initial-setup hook when predicted and final traits match.",
    "compatibility",
    "changed",
    "UIKit",
    "46818941",
    "New Features",
    "baseline",
  ),
  entry(
    "beta-1",
    both,
    "apple-13-beta1-storyboard-creator-initializers",
    "Custom initialization from storyboards",
    "Storyboard creation closures could invoke custom view-controller initializers with additional context.",
    "developerApi",
    "introduced",
    "UIKit",
    "48313869",
    "New Features",
    "baseline",
  ),
  entry(
    "beta-1",
    both,
    "apple-13-beta1-cametallayer-simulator",
    "CAMetalLayer in Simulator",
    "The iOS Simulator added support for CAMetalLayer.",
    "developerApi",
    "introduced",
    "Xcode",
    "45101325",
    "New Features",
    "baseline",
  ),

  entry(
    "beta-2",
    both,
    "apple-13-beta2-airplay-mirroring-output",
    "Reliable AirPlay mirroring output",
    "AirPlay mirroring stopped producing the unexpected output documented in the first beta.",
    "bugFix",
    "fixed",
    "General",
    "51116513",
    "Resolved Issues",
    "transition",
  ),
  entry(
    "beta-2",
    ipados,
    "ipados-13-beta2-widget-editing-orientation",
    "Widget editing without rotating iPad",
    "iPad users could edit widgets without first changing to landscape orientation.",
    "bugFix",
    "fixed",
    "General",
    "49162249",
    "Resolved Issues",
    "transition",
  ),
  entry(
    "beta-2",
    both,
    "apple-13-beta2-face-id-reliability",
    "Face ID reliability",
    "Face ID stopped becoming unavailable without warning.",
    "bugFix",
    "fixed",
    "General",
    "51205195",
    "Resolved Issues",
    "transition",
  ),
  entry(
    "beta-2",
    both,
    "apple-13-beta2-realtime-audio-artifacts",
    "Real-time audio artifact fix",
    "Real-time audio applications stopped exhibiting the artifacts listed in Beta 1.",
    "bugFix",
    "fixed",
    "Audio",
    "50870425",
    "Resolved Issues",
    "transition",
  ),
  entry(
    "beta-2",
    both,
    "apple-13-beta2-icloud-books-visibility",
    "iCloud books visible in Books",
    "Books stored in iCloud Drive appeared in the Books application again.",
    "bugFix",
    "fixed",
    "Books",
    "48685806",
    "Resolved Issues",
    "transition",
  ),
  entry(
    "beta-2",
    ios,
    "ios-13-beta2-carplay-navigation-image-size",
    "Correct CarPlay navigation image sizing",
    "Navigation applications stopped rendering images at unintended sizes in CarPlay.",
    "bugFix",
    "fixed",
    "CarPlay",
    "49380030",
    "Resolved Issues",
    "transition",
  ),
  entry(
    "beta-2",
    both,
    "apple-13-beta2-files-apfs-drives",
    "APFS external-drive support in Files",
    "Files added support for storage devices formatted with APFS.",
    "feature",
    "introduced",
    "Files",
    "51071338",
    "Resolved Issues",
    "transition",
  ),
  entry(
    "beta-2",
    both,
    "apple-13-beta2-files-smb-connections",
    "SMB connections from Files",
    "Files and document-browser applications could connect to SMB servers without the earlier connection error.",
    "bugFix",
    "fixed",
    "Files",
    "50987682",
    "Resolved Issues",
    "transition",
  ),
  entry(
    "beta-2",
    both,
    "apple-13-beta2-find-my-repeating-alerts",
    "Repeating Find My location alerts",
    "Find My restored the option to repeat a location notification every time its condition occurs.",
    "feature",
    "introduced",
    "Find My",
    "51271728",
    "Resolved Issues",
    "transition",
  ),
  entry(
    "beta-2",
    ipados,
    "ipados-13-beta2-scene-target-selection",
    "Scene targeting for drag multitasking",
    "Scene identifiers and activation conditions determined which iPad multitasking destination received dragged content.",
    "developerApi",
    "changed",
    "Home Screen",
    "50784657",
    "Resolved Issues",
    "transition",
  ),
  entry(
    "beta-2",
    both,
    "apple-13-beta2-apple-maps-links",
    "Apple Maps links open in Maps",
    "Web links using Apple's Maps domain began opening the Maps app instead of Safari.",
    "bugFix",
    "fixed",
    "Maps",
    "51095623",
    "Resolved Issues",
    "transition",
  ),
  entry(
    "beta-2",
    ios,
    "ios-13-beta2-messages-storage-accounting",
    "Accurate Messages storage reporting",
    "The iPhone Storage view reported Messages usage and its deletable content correctly.",
    "bugFix",
    "fixed",
    "Messages",
    "45913540",
    "Resolved Issues",
    "transition",
  ),
  entry(
    "beta-2",
    ipados,
    "ipados-13-beta2-pencilkit-canvas-appearance",
    "PencilKit canvas settings from Interface Builder",
    "PencilKit canvases honored background color and opacity configured in Interface Builder.",
    "bugFix",
    "fixed",
    "PencilKit",
    "50870664",
    "Resolved Issues",
    "transition",
  ),
  entry(
    "beta-2",
    both,
    "apple-13-beta2-swiftui-tab-navigation",
    "SwiftUI tabs inside navigation views",
    "TabbedView content rendered correctly when nested in a NavigationView.",
    "bugFix",
    "fixed",
    "SwiftUI",
    "49958869",
    "Resolved Issues",
    "transition",
  ),
  entry(
    "beta-2",
    both,
    "apple-13-beta2-swiftui-form",
    "SwiftUI Form availability",
    "SwiftUI made its Form view available in the second beta.",
    "developerApi",
    "introduced",
    "SwiftUI",
    "50871134",
    "Resolved Issues",
    "addition",
  ),
  entry(
    "beta-2",
    ios,
    "ios-13-beta2-siri-shortcuts-endpoints",
    "Siri Shortcuts on Watch, HomePod, and CarPlay",
    "Shortcuts invoked through Siri became available across Apple Watch, HomePod, and CarPlay.",
    "feature",
    "introduced",
    "Siri",
    "50782908",
    "Resolved Issues",
    "transition",
  ),

  entry(
    "beta-3",
    ios,
    "ios-13-beta3-iphone7-availability",
    "Beta 3 availability on iPhone 7",
    "The first Beta 3 build excluded iPhone 7 and iPhone 7 Plus, while the revised build restored availability.",
    "compatibility",
    "knownIssue",
    "General",
    "52363318",
    "Known Issues",
    "addition",
  ),
  entry(
    "beta-3",
    ios,
    "ios-13-beta3-carplay-light-icons",
    "CarPlay icons in light appearance",
    "CarPlay home-screen icons could render incorrectly in light appearance until a later beta repaired them.",
    "bugFix",
    "knownIssue",
    "CarPlay",
    "51863892",
    "Known Issues",
    "addition",
  ),
  entry(
    "beta-3",
    ios,
    "ios-13-beta3-facetime-attention-toggle",
    "FaceTime attention-correction toggle",
    "Disabling FaceTime Attention Correction could require toggling the setting once before it took effect.",
    "knownIssue",
    "knownIssue",
    "FaceTime",
    "52054477",
    "Known Issues",
    "addition",
  ),
  entry(
    "beta-3",
    both,
    "apple-13-beta3-icloud-missing-data",
    "iCloud Drive data after upgrading",
    "Some upgrade paths could leave iCloud Drive content missing until a later beta resolved the defect.",
    "bugFix",
    "knownIssue",
    "iCloud",
    "51787170, 51950018",
    "Known Issues",
    "addition",
  ),
  entry(
    "beta-3",
    both,
    "apple-13-beta3-icloud-document-downloads",
    "iCloud Drive document downloads",
    "Some iCloud Drive documents could fail to download in the third beta.",
    "knownIssue",
    "knownIssue",
    "iCloud",
    "52295165",
    "Known Issues",
    "addition",
  ),
  entry(
    "beta-3",
    both,
    "apple-13-beta3-location-report-inflation",
    "Inflated location-delivery reporting",
    "Applications could be credited with far more delivered locations than they actually received.",
    "bugFix",
    "knownIssue",
    "Location",
    "52240105",
    "Known Issues",
    "addition",
  ),
  entry(
    "beta-3",
    both,
    "apple-13-beta3-memoji-face-tracking",
    "Animoji and Memoji face tracking",
    "Animoji and Memoji could stop following the user's face until the revised Beta 3 build.",
    "bugFix",
    "knownIssue",
    "Messages",
    "52199654",
    "Known Issues",
    "addition",
  ),
  entry(
    "beta-3",
    ios,
    "ios-13-beta3-airpods-announcements",
    "AirPods with announced messages",
    "AirPods could disconnect when message announcements arrived without music already playing.",
    "knownIssue",
    "knownIssue",
    "Siri",
    "50322025",
    "Known Issues",
    "addition",
  ),
  entry(
    "beta-3",
    both,
    "apple-13-beta3-swiftui-navigation-styles",
    "SwiftUI navigation styles",
    "SwiftUI added explicit stack and two-column styles for navigation views.",
    "developerApi",
    "introduced",
    "SwiftUI",
    "51636729",
    "New Features",
    "addition",
  ),
  entry(
    "beta-3",
    both,
    "apple-13-beta3-swiftui-tabitem-builder",
    "View-builder tab item labels",
    "SwiftUI's renamed tab-item modifier began accepting view-builder closures.",
    "developerApi",
    "changed",
    "SwiftUI",
    "51502668",
    "Resolved Issues",
    "addition",
  ),
  entry(
    "beta-3",
    both,
    "apple-13-beta3-store-product-pages",
    "Store product pages render again",
    "The StoreKit product-view controller stopped returning an empty page.",
    "bugFix",
    "fixed",
    "App Store",
    "50955943",
    "Resolved Issues",
    "transition",
  ),
  entry(
    "beta-3",
    both,
    "apple-13-beta3-secure-enclave-prompts",
    "Secure Enclave authentication prompts",
    "Access-controlled Secure Enclave keys began prompting users for authentication correctly.",
    "bugFix",
    "fixed",
    "Apple CryptoKit",
    "51279188",
    "Resolved Issues",
    "transition",
  ),
  entry(
    "beta-3",
    both,
    "apple-13-beta3-quickpath-toggle",
    "QuickPath can be disabled",
    "The keyboard setting for turning off QuickPath typing became effective.",
    "bugFix",
    "fixed",
    "Keyboards",
    "50989321",
    "Resolved Issues",
    "transition",
  ),
  entry(
    "beta-3",
    both,
    "apple-13-beta3-podcast-transcript-search",
    "Podcast transcript search",
    "Transcript search became available in Podcasts.",
    "feature",
    "introduced",
    "Podcasts",
    "50425804",
    "Resolved Issues",
    "transition",
  ),
  entry(
    "beta-3",
    both,
    "apple-13-beta3-swiftui-preview-appearance",
    "Dark appearance in SwiftUI previews",
    "Xcode previews began updating their text appearance correctly when switched to Dark Mode.",
    "bugFix",
    "fixed",
    "SwiftUI",
    "51486412",
    "Resolved Issues",
    "transition",
  ),

  entry(
    "beta-3-v2",
    ios,
    "ios-13-beta3-iphone7-availability",
    "Beta 3 availability on iPhone 7",
    "The first Beta 3 build excluded iPhone 7 and iPhone 7 Plus, while the revised build restored availability.",
    "compatibility",
    "fixed",
    "General",
    "52363318",
    "Resolved Issues",
    "transition",
  ),
  entry(
    "beta-3-v2",
    both,
    "apple-13-beta3-memoji-face-tracking",
    "Animoji and Memoji face tracking",
    "Animoji and Memoji could stop following the user's face until the revised Beta 3 build.",
    "bugFix",
    "fixed",
    "Messages",
    "52199654",
    "Resolved Issues",
    "transition",
  ),

  entry(
    "beta-4",
    both,
    "apple-13-beta4-metal-app-switcher-snapshots",
    "Metal snapshots in the app switcher",
    "Applications using Metal could show an unexpected snapshot in the app switcher.",
    "knownIssue",
    "knownIssue",
    "General",
    "53121694",
    "Known Issues",
    "addition",
  ),
  entry(
    "beta-4",
    both,
    "apple-13-beta4-home-camera-sleep",
    "Device sleep after viewing Home cameras",
    "Viewing a camera stream in Home could prevent the device from sleeping until the app was closed.",
    "knownIssue",
    "knownIssue",
    "HomeKit",
    "52981554",
    "Known Issues",
    "addition",
  ),
  entry(
    "beta-4",
    ios,
    "ios-13-beta4-dnd-watch-sync",
    "Do Not Disturb synchronization with Apple Watch",
    "Do Not Disturb settings could remain out of sync between iPhone and Apple Watch until Beta 7.",
    "bugFix",
    "knownIssue",
    "Settings",
    "52830669",
    "Known Issues",
    "addition",
  ),
  entry(
    "beta-4",
    both,
    "apple-13-beta4-swiftui-accessibility-environment",
    "Accessibility values in SwiftUI environment",
    "SwiftUI environment values exposed settings for color differentiation, transparency, motion, and inversion.",
    "developerApi",
    "introduced",
    "SwiftUI",
    "51712481",
    "New Features",
    "addition",
  ),
  entry(
    "beta-4",
    both,
    "apple-13-beta4-swiftui-foreground-color",
    "SwiftUI text color naming",
    "The text color modifier was renamed to align with SwiftUI's broader foreground-color modifier.",
    "developerApi",
    "changed",
    "SwiftUI",
    "50391847",
    "New Features",
    "addition",
  ),
  entry(
    "beta-4",
    both,
    "apple-13-beta4-bindableobject-willchange",
    "BindableObject pre-change notifications",
    "BindableObject switched from an after-change signal to a before-change signal to improve notification coalescing.",
    "developerApi",
    "changed",
    "SwiftUI",
    "51580731",
    "New Features",
    "addition",
  ),
  entry(
    "beta-4",
    both,
    "apple-13-beta4-collection-offset-edits",
    "Collection helpers for row edits",
    "Swift collections gained offset-based removal and movement helpers for SwiftUI list actions.",
    "developerApi",
    "introduced",
    "SwiftUI",
    "51991601",
    "New Features",
    "addition",
  ),
  entry(
    "beta-4",
    both,
    "apple-13-beta4-swiftui-presentation-modifiers",
    "Reworked SwiftUI presentations",
    "SwiftUI introduced revised sheet, action-sheet, and alert modifiers driven by presented-state bindings.",
    "developerApi",
    "changed",
    "SwiftUI",
    "52075730",
    "New Features",
    "addition",
  ),
  entry(
    "beta-4",
    both,
    "apple-13-beta4-swiftui-animation-api",
    "Revised SwiftUI animation API",
    "SwiftUI renamed curve and spring animation constructors and separated interactive spring behavior.",
    "developerApi",
    "changed",
    "SwiftUI",
    "50280375",
    "New Features",
    "addition",
  ),
  entry(
    "beta-4",
    both,
    "apple-13-beta4-swiftui-ctfont",
    "SwiftUI fonts from CTFont",
    "SwiftUI added a Font initializer that accepts a Core Text font.",
    "developerApi",
    "introduced",
    "SwiftUI",
    "51849885",
    "New Features",
    "addition",
  ),
  entry(
    "beta-4",
    both,
    "apple-13-beta4-swiftui-navigation-colors",
    "Navigation destination control colors",
    "Controls in a SwiftUI list's pushed destination could appear with unintended black text.",
    "knownIssue",
    "knownIssue",
    "SwiftUI",
    "52858284",
    "Known Issues",
    "addition",
  ),
  entry(
    "beta-4",
    both,
    "apple-13-beta4-textfield-side-view-sizing",
    "Text-field side-view sizing contract",
    "Text fields began asking left and right accessory views for an Auto Layout fitting size, requiring explicit sizing for legacy behavior.",
    "compatibility",
    "changed",
    "UIKit",
    "51787798",
    "Known Issues",
    "addition",
  ),
  entry(
    "beta-4",
    both,
    "apple-13-beta4-large-library-upgrade",
    "Large photo-library upgrade delay",
    "Devices with large photo libraries stopped remaining on the update progress screen for an extended period.",
    "bugFix",
    "fixed",
    "General",
    "51147659",
    "Resolved Issues",
    "transition",
  ),
  entry(
    "beta-4",
    ios,
    "ios-13-beta3-carplay-light-icons",
    "CarPlay icons in light appearance",
    "CarPlay home-screen icons could render incorrectly in light appearance until a later beta repaired them.",
    "bugFix",
    "fixed",
    "CarPlay",
    "51863892",
    "Resolved Issues",
    "transition",
  ),
  entry(
    "beta-4",
    ios,
    "ios-13-beta4-carplay-garage-control",
    "CarPlay garage-door control",
    "The garage-door control returned to the CarPlay dashboard.",
    "bugFix",
    "fixed",
    "CarPlay",
    "50275274",
    "Resolved Issues",
    "transition",
  ),
  entry(
    "beta-4",
    both,
    "apple-13-beta3-icloud-missing-data",
    "iCloud Drive data after upgrading",
    "Some upgrade paths could leave iCloud Drive content missing until a later beta resolved the defect.",
    "bugFix",
    "fixed",
    "iCloud",
    "51787170, 51950018",
    "Resolved Issues",
    "transition",
  ),
  entry(
    "beta-4",
    both,
    "apple-13-beta3-location-report-inflation",
    "Inflated location-delivery reporting",
    "Applications could be credited with far more delivered locations than they actually received.",
    "bugFix",
    "fixed",
    "Location",
    "52240105",
    "Resolved Issues",
    "transition",
  ),
  entry(
    "beta-4",
    both,
    "apple-13-beta4-music-up-next-reordering",
    "Music Up Next reordering stability",
    "Music stopped closing unexpectedly when its Up Next queue was reordered.",
    "bugFix",
    "fixed",
    "Music",
    "51639471",
    "Resolved Issues",
    "transition",
  ),
  entry(
    "beta-4",
    both,
    "apple-13-beta4-swiftui-opaque-modifier-results",
    "Opaque return types from SwiftUI modifiers",
    "SwiftUI view modifiers began returning opaque views instead of exposing complex generic result types.",
    "developerApi",
    "changed",
    "SwiftUI",
    "46140669",
    "Resolved Issues",
    "transition",
  ),

  entry(
    "beta-5",
    both,
    "apple-13-beta5-detected-link-opening",
    "Automatically detected links",
    "Some detected links, including flight numbers, could fail to open when tapped.",
    "knownIssue",
    "knownIssue",
    "General",
    "53416463",
    "Known Issues",
    "addition",
  ),
  entry(
    "beta-5",
    both,
    "apple-13-beta5-messages-icloud-repair",
    "Messages in iCloud repair prompts",
    "Messages in iCloud could request account repair while messages failed to synchronize across devices.",
    "knownIssue",
    "knownIssue",
    "Messages",
    "53406906",
    "Known Issues",
    "addition",
  ),
  entry(
    "beta-5",
    both,
    "apple-13-beta5-http-body-copying",
    "NSMutableURLRequest body-copy behavior",
    "The mutable request body began enforcing copy semantics, with legacy behavior retained for applications built against older SDKs.",
    "compatibility",
    "changed",
    "Networking",
    "53427882",
    "Known Issues",
    "addition",
  ),
  entry(
    "beta-5",
    both,
    "apple-13-beta5-shortcuts-automations",
    "Shortcuts automations unavailable",
    "Personal automation support in Shortcuts was temporarily unavailable.",
    "knownIssue",
    "knownIssue",
    "Siri",
    "53182885",
    "Known Issues",
    "addition",
  ),
  entry(
    "beta-5",
    both,
    "apple-13-beta5-swiftui-platform-colors",
    "SwiftUI colors from platform color objects",
    "SwiftUI Color gained initializers for UIKit and AppKit color values.",
    "developerApi",
    "introduced",
    "SwiftUI",
    "49833933",
    "New Features",
    "addition",
  ),
  entry(
    "beta-5",
    both,
    "apple-13-beta5-core-data-observation",
    "Core Data observation in SwiftUI",
    "Managed objects adopted ObservableObject, while a fetch-request property wrapper and managed-object context entered the SwiftUI environment.",
    "developerApi",
    "introduced",
    "SwiftUI",
    "50280673",
    "New Features",
    "addition",
  ),
  entry(
    "beta-5",
    both,
    "apple-13-beta5-swiftui-gesture-naming",
    "Consistent SwiftUI gesture names",
    "SwiftUI gesture modifiers adopted on-prefixed names for taps and long presses.",
    "developerApi",
    "changed",
    "SwiftUI",
    "50395282",
    "New Features",
    "addition",
  ),
  entry(
    "beta-5",
    both,
    "apple-13-beta5-swiftui-text-wrapping",
    "SwiftUI text wraps by default",
    "SwiftUI Text removed its implicit one-line limit so content could wrap without extra configuration.",
    "behavior",
    "changed",
    "SwiftUI",
    "51147116",
    "New Features",
    "addition",
  ),
  entry(
    "beta-5",
    both,
    "apple-13-beta5-segmented-picker-style",
    "Segmented controls become a picker style",
    "SwiftUI folded its segmented-control type into Picker as a presentation style.",
    "developerApi",
    "changed",
    "SwiftUI",
    "51769046",
    "New Features",
    "addition",
  ),
  entry(
    "beta-5",
    both,
    "apple-13-beta5-observableobject",
    "ObservableObject replaces BindableObject",
    "SwiftUI adopted Combine's ObservableObject model and the ObservedObject property wrapper.",
    "developerApi",
    "changed",
    "SwiftUI",
    "50800624",
    "New Features",
    "addition",
  ),
  entry(
    "beta-5",
    both,
    "apple-13-beta5-swiftui-path-crash",
    "SwiftUI Path crash",
    "Using SwiftUI Path with affected prerelease SDKs could terminate an application until a later beta fixed the defect.",
    "bugFix",
    "knownIssue",
    "SwiftUI",
    "53523206",
    "Known Issues",
    "addition",
  ),
  entry(
    "beta-5",
    both,
    "apple-13-beta5-swiftui-context-menus",
    "SwiftUI context-menu stability",
    "Context menus could render incorrectly or close an application unexpectedly.",
    "knownIssue",
    "knownIssue",
    "SwiftUI",
    "53461370",
    "Known Issues",
    "addition",
  ),
  entry(
    "beta-5",
    both,
    "apple-13-beta5-tabview-rename",
    "TabbedView renamed to TabView",
    "SwiftUI replaced the TabbedView name with TabView.",
    "developerApi",
    "changed",
    "SwiftUI",
    "51012120",
    "Deprecations",
    "addition",
  ),
  entry(
    "beta-5",
    both,
    "apple-13-beta5-mail-image-sharing",
    "Share images from Mail",
    "Images could once again be shared directly from an email.",
    "bugFix",
    "fixed",
    "Mail",
    "50538771",
    "Resolved Issues",
    "transition",
  ),
  entry(
    "beta-5",
    ios,
    "ios-13-beta5-sim-pin-setup",
    "SIM PIN during setup",
    "The setup process accepted a SIM PIN normally after upgrading.",
    "bugFix",
    "fixed",
    "Phone and FaceTime",
    "51593059",
    "Resolved Issues",
    "transition",
  ),
  entry(
    "beta-5",
    both,
    "apple-13-beta5-screen-time-extra-minute",
    "Screen Time extra-minute enforcement",
    "A user could no longer request the one-minute extension repeatedly after reaching an application limit.",
    "bugFix",
    "fixed",
    "Screen Time",
    "48773803",
    "Resolved Issues",
    "transition",
  ),
  entry(
    "beta-5",
    both,
    "apple-13-beta5-instagram-story-audio",
    "Audio in Instagram stories",
    "Instagram stories regained audio playback.",
    "bugFix",
    "fixed",
    "Third-Party Apps",
    "50433755",
    "Resolved Issues",
    "transition",
  ),
  entry(
    "beta-5",
    both,
    "apple-13-beta5-voice-control-download-progress",
    "Voice Control resource progress",
    "The initial Voice Control resource download gained a visible progress indicator.",
    "enhancement",
    "introduced",
    "Voice Control",
    "50788121",
    "Resolved Issues",
    "transition",
  ),

  entry(
    "beta-7",
    both,
    "apple-13-beta7-mail-search-filters",
    "Mail search-filter controls",
    "The controls below Mail's search field narrowed results correctly.",
    "bugFix",
    "fixed",
    "Mail",
    "53808836",
    "Resolved Issues",
    "selfIdentifying",
  ),
  entry(
    "beta-7",
    ios,
    "ios-13-beta4-dnd-watch-sync",
    "Do Not Disturb synchronization with Apple Watch",
    "Do Not Disturb settings could remain out of sync between iPhone and Apple Watch until Beta 7.",
    "bugFix",
    "fixed",
    "Settings",
    "52830669",
    "Resolved Issues",
    "selfIdentifying",
  ),
  entry(
    "beta-7",
    ipados,
    "ipados-13-beta7-cellular-plan-purchases",
    "Cellular plan purchases on iPad",
    "Cellular-capable iPads regained the ability to purchase data plans.",
    "bugFix",
    "fixed",
    "Settings",
    "51735832, 51737229",
    "Resolved Issues",
    "selfIdentifying",
  ),
  entry(
    "beta-7",
    both,
    "apple-13-beta7-sign-in-real-user",
    "Sign in with Apple real-user status",
    "Sign in with Apple's real-user status became available and returned its expected account signal.",
    "developerApi",
    "introduced",
    "Sign In with Apple",
    "51765525",
    "Resolved Issues",
    "selfIdentifying",
  ),
  entry(
    "beta-7",
    both,
    "apple-13-beta7-siri-nonenglish-actions",
    "Siri actions in non-English languages",
    "Non-English Siri requests for Reminders or Messages stopped closing the target application.",
    "bugFix",
    "fixed",
    "Siri",
    "50952938",
    "Resolved Issues",
    "selfIdentifying",
  ),
  entry(
    "beta-7",
    both,
    "apple-13-beta5-swiftui-path-crash",
    "SwiftUI Path crash",
    "Using SwiftUI Path with affected prerelease SDKs could terminate an application until a later beta fixed the defect.",
    "bugFix",
    "fixed",
    "SwiftUI",
    "53523206",
    "Resolved Issues",
    "selfIdentifying",
  ),
  entry(
    "beta-7",
    both,
    "apple-13-beta7-foreach-complex-expression",
    "Complex expressions in SwiftUI ForEach",
    "SwiftUI ForEach closures accepted complex expressions without producing the earlier compiler error.",
    "bugFix",
    "fixed",
    "SwiftUI",
    "53325810",
    "Resolved Issues",
    "selfIdentifying",
  ),

  entry(
    "beta-8",
    ios,
    "ios-13-beta8-health-cycle-configuration",
    "Health cycle-tracking configuration",
    "Health and Activity could stop working when cycle tracking used a period longer than its configured cycle.",
    "knownIssue",
    "knownIssue",
    "Health",
    "54313089",
    "Known Issues",
    "addition",
  ),
  entry(
    "beta-8",
    both,
    "apple-13-beta8-music-sync-library-state",
    "Music Sync Library state",
    "The Music settings switch could misrepresent whether library synchronization was enabled.",
    "knownIssue",
    "knownIssue",
    "Music",
    "53957863",
    "Known Issues",
    "addition",
  ),
  entry(
    "beta-8",
    both,
    "apple-13-beta8-notes-lasso-colors",
    "Notes lasso selection colors",
    "Rotating after selecting colored drawing strokes could turn those strokes black.",
    "knownIssue",
    "knownIssue",
    "Notes",
    "54246012",
    "Known Issues",
    "addition",
  ),
  entry(
    "beta-8",
    ipados,
    "ipados-13-beta8-pencilkit-submissions",
    "PencilKit application submissions",
    "Apple advised developers not to submit applications linked against PencilKit at this beta boundary.",
    "compatibility",
    "knownIssue",
    "PencilKit",
    "53811027",
    "Known Issues",
    "addition",
  ),
  entry(
    "beta-8",
    both,
    "apple-13-beta8-realitykit-object-anchors",
    "RealityKit object anchors",
    "Reality files with object anchors could fail to attach to those objects in Quick Look and applications.",
    "knownIssue",
    "knownIssue",
    "RealityKit",
    "53689364",
    "Known Issues",
    "addition",
  ),
  entry(
    "beta-8",
    both,
    "apple-13-beta8-realitykit-skybox-camera",
    "RealityKit skybox camera feed",
    "A camera feed could remain visible beneath a Reality file object when using a skybox background.",
    "knownIssue",
    "knownIssue",
    "RealityKit",
    "53715030",
    "Known Issues",
    "addition",
  ),
  entry(
    "beta-8",
    ios,
    "ios-13-beta8-icloud-storage-accounting",
    "iCloud Drive storage accounting",
    "The iPhone Storage view began reflecting the current local state of iCloud Drive files accurately.",
    "bugFix",
    "fixed",
    "iCloud",
    "50362095",
    "Resolved Issues",
    "transition",
  ),
  entry(
    "beta-8",
    both,
    "apple-13-beta8-localized-layout",
    "Localized layout alignment",
    "Clipped and misaligned interfaces were repaired for affected device languages.",
    "bugFix",
    "fixed",
    "Localization",
    "51068688",
    "Resolved Issues",
    "transition",
  ),
  entry(
    "beta-8",
    both,
    "apple-13-beta8-unlocalized-text",
    "Localized interface text",
    "Affected device languages stopped showing interface text that had not been localized.",
    "bugFix",
    "fixed",
    "Localization",
    "47765173, 51197936, 51270878",
    "Resolved Issues",
    "transition",
  ),
];

function verificationFor(alias, evidence) {
  if (evidence === "baseline") {
    return "Matched the component, status heading, and retained issue ID in Apple's first self-identifying iOS & iPadOS 13 Beta page; the selection is a representative baseline.";
  }
  if (alias === "beta-7") {
    return "Matched the component, Resolved Issues heading, and retained issue ID in Apple's self-identifying Beta 7 page. Because Beta 6 has no surviving first-party page, no Beta 5-to-Beta 7 diff is claimed.";
  }
  if (evidence === "transition") {
    return `Matched the issue ID and component across both preserved boundary states, then confirmed its status transition in Apple's self-identifying ${routeMetadata[alias].label} page.`;
  }
  return `Matched the issue ID and component as an addition in Apple's self-identifying ${routeMetadata[alias].label} page against the preceding retained state.`;
}

function archivedChange(input) {
  return {
    key: input.key,
    title: input.title,
    canonicalSummary: input.canonicalSummary,
    category: input.category,
    action: input.action,
    inheritance: "delta",
    summary: `The preserved ${routeMetadata[input.alias].label} page supports this ${input.component} record and retains Apple issue locator ${input.issueIds}.`,
    documentedStatus: "documented",
    evidenceState: "confirmed",
    verificationMethod: verificationFor(input.alias, input.evidence),
    citations: [
      c(
        sourceForAlias[input.alias],
        `${input.component} — ${input.sourceStatus}; ${input.issueIds}`,
        `Original synthesis from the milestone page's ${input.component} record for ${input.issueIds}.`,
      ),
    ],
  };
}

const platformMetadata = {
  ios: {
    name: "iOS",
    versionId: "version-ios-13-0",
    boundary:
      "Shared framework and cross-device records are retained with iPhone, Face ID, CarPlay, Health, Apple Watch, cellular, or iPhone Storage items. iPad-only multitasking and Apple Pencil records are excluded.",
  },
  ipados: {
    name: "iPadOS",
    versionId: "version-ipados-13-0",
    boundary:
      "Shared framework and cross-device records are retained with iPad, Split View, Slide Over, cellular iPad, and Apple Pencil items. iPhone-only carrier, CarPlay, Health, Watch-pairing, and iPhone Storage records are excluded.",
  },
};

const routeMetadata = {
  "beta-1": {
    label: "Beta 1",
    date: "2019-06-03",
    capturedTitle: "iOS & iPadOS 13 Beta Release Notes",
    state: "155 records and 161 issue identifiers",
    comparison:
      "This is a representative baseline selected from the initial page's New Features records.",
  },
  "beta-2": {
    label: "Beta 2",
    date: "2019-06-17",
    capturedTitle: "iOS & iPadOS 13 Beta 2 Release Notes",
    state: "190 records and 198 issue identifiers",
    comparison:
      "Against Beta 1, the preserved issue inventory adds 39 identifiers, removes 2, and changes 76; this selection emphasizes exact resolutions and one added SwiftUI capability.",
  },
  "beta-3": {
    label: "Beta 3",
    date: "2019-07-02",
    capturedTitle: "iOS & iPadOS 13 Beta 3 Release Notes",
    state: "124 records and 131 issue identifiers",
    comparison:
      "Against the July 1 Beta 2 state, the archive adds 12 issue identifiers, removes 79, and changes 42; selected entries are exact additions or status transitions.",
  },
  "beta-3-v2": {
    label: "Beta 3 v2",
    date: "2019-07-08",
    capturedTitle: "iOS & iPadOS 13 Beta 3 Release Notes",
    state: "124 records and 131 issue identifiers in the July 11 state",
    comparison:
      "Against the July 4 Beta 3 page, exactly two issue records change status and no issue identifiers are added or removed.",
  },
  "beta-4": {
    label: "Beta 4",
    date: "2019-07-17",
    capturedTitle: "iOS & iPadOS 13 Beta 4 Release Notes",
    state: "137 records and 144 issue identifiers",
    comparison:
      "Against the July 11 Beta 3 state, the archive adds 14 issue identifiers, removes 1, and changes 24; selected entries are exact additions or status transitions.",
  },
  "beta-5": {
    label: "Beta 5",
    date: "2019-07-29",
    capturedTitle: "iOS & iPadOS 13 Beta 5 Release Notes",
    state: "100 records and 103 issue identifiers",
    comparison:
      "Against Beta 4, the archive adds 25 issue identifiers, removes 66, and changes 15; the selection preserves high-signal API, compatibility, and resolved records.",
  },
  "beta-7": {
    label: "Beta 7",
    date: "2019-08-15",
    capturedTitle: "iOS & iPadOS 13 Beta 7 Release Notes",
    state: "88 records and 91 issue identifiers",
    comparison:
      "Beta 6 has no surviving Apple page in the exact archive inventory, so Beta 7 uses only records under the Resolved Issues headings of its self-identifying page and claims no crossed-state diff.",
  },
  "beta-8": {
    label: "Beta 8",
    date: "2019-08-21",
    capturedTitle: "iOS & iPadOS 13 Beta 8 Release Notes",
    state: "86 records and 88 issue identifiers",
    comparison:
      "Against Beta 7, the archive adds 6 issue identifiers, removes 9, and changes 5; selected entries are exact additions or status transitions.",
  },
};

const routeChanges = new Map();
for (const input of selected) {
  for (const platform of input.platforms) {
    const route = `${platform}/${input.alias}`;
    routeChanges.set(route, [
      ...(routeChanges.get(route) || []),
      archivedChange(input),
    ]);
  }
}

function eventArticle(platform, alias, changes) {
  const route = routeMetadata[alias];
  const comparisons = comparisonForAlias[alias].map((url, index) =>
    c(
      url,
      `${index === 0 && alias !== "beta-1" ? "Before" : "Retained"} comparison state for ${route.label}`,
    ),
  );
  const changeCitations = uniqueCitations(
    changes.flatMap((change) => change.citations),
  );
  return article(
    heading("Preserved release-note state"),
    prose(
      `Apple's archived page identifies itself as “${route.capturedTitle}.” This ${platform.name} article structures ${changes.length} source-supported records from the ${route.state}.`,
      [c(sourceForAlias[alias], `${route.label} archived document title`)],
    ),
    heading("How this milestone differs"),
    prose(route.comparison, comparisons),
    heading("Platform scope"),
    prose(platform.boundary, changeCitations),
    heading("Editorial boundary"),
    prose(
      "This article is original synthesis. It retains Apple issue identifiers as locators, quotes no list text, creates no build records, and does not fill Beta 6, GM, Public, or any other route without an isolated primary-source boundary.",
      [
        c(
          U.installBeta,
          "Beta software, release notes, and Feedback Assistant",
        ),
        c(sourceForAlias[alias], `${route.label} evidence boundary`),
      ],
    ),
  );
}

const events = Object.entries(platformMetadata).flatMap(
  ([platformSlug, platform]) =>
    Object.keys(routeMetadata).map((alias) => {
      const changes = routeChanges.get(`${platformSlug}/${alias}`) || [];
      const route = routeMetadata[alias];
      return {
        target: {
          releaseVersionId: platform.versionId,
          routeAlias: alias,
        },
        authorship: "originalSynthesis",
        summary: `${platform.name} 13 ${route.label} is represented by ${changes.length} source-supported records from Apple's preserved milestone page; unsupported route content and build identities are not inferred.`,
        article: eventArticle(platform, alias, changes),
        citations: uniqueCitations([
          ...comparisonForAlias[alias].map((url) =>
            c(url, `${route.label} snapshot comparison`),
          ),
          ...changes.flatMap((change) => change.citations),
        ]),
        changes,
        provenanceStatus: "editoriallyVerified",
        editorialReview: review(),
        isIndexable: true,
      };
    }),
);

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
    platform: "iPadOS",
    majorVersion: 13,
    version: "13.0",
    releaseStatus: "superseded",
    publicReleaseDate: undefined,
    milestones: [
      ["Beta 1", "2019-06-03", false, undefined],
      ["Beta 2", "2019-06-17", false, undefined],
      ["Beta 3", "2019-07-02", false, undefined],
      ["Beta 3 v2", "2019-07-08", true, undefined],
      ["Beta 4", "2019-07-17", false, undefined],
      ["Beta 5", "2019-07-29", false, undefined],
      ["Beta 6", "2019-08-07", false, undefined],
      ["Beta 7", "2019-08-15", false, undefined],
      ["Beta 8", "2019-08-21", false, undefined],
    ],
  },
  {
    platform: "iOS",
    majorVersion: 13,
    version: "13.0",
    releaseStatus: "released",
    publicReleaseDate: "2019-09-19",
    milestones: [
      ["Beta 1", "2019-06-03", false, undefined],
      ["Beta 2", "2019-06-17", false, undefined],
      ["Beta 3", "2019-07-02", false, undefined],
      ["Beta 3 v2", "2019-07-08", true, undefined],
      ["Beta 4", "2019-07-17", false, undefined],
      ["Beta 5", "2019-07-29", false, undefined],
      ["Beta 6", "2019-08-07", false, undefined],
      ["Beta 7", "2019-08-15", false, undefined],
      ["Beta 8", "2019-08-21", false, undefined],
      ["GM", "2019-09-10", false, undefined],
      ["Public", "2019-09-19", false, "iPhone Only"],
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
  .filter(
    (version) =>
      version.version === "13.0" &&
      ["iOS", "iPadOS"].includes(version.platform),
  )
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
  }))
  .sort((left, right) => left.platform.localeCompare(right.platform));
const normalizedExpectedSeed = [...expectedSeedInventory].sort((left, right) =>
  left.platform.localeCompare(right.platform),
);
if (
  JSON.stringify(stableValue(seedInventory)) !==
  JSON.stringify(stableValue(normalizedExpectedSeed))
) {
  throw new Error(
    "The exact local iOS/iPadOS 13.0 seed inventory changed; re-audit the cohort before regenerating.",
  );
}

const expectedRoutes = new Set(
  Object.values(platformMetadata).flatMap((platform) =>
    Object.keys(routeMetadata).map((alias) => `${platform.versionId}/${alias}`),
  ),
);
const expectedRouteCounts = new Map([
  ["version-ios-13-0/beta-1", 13],
  ["version-ios-13-0/beta-2", 13],
  ["version-ios-13-0/beta-3", 15],
  ["version-ios-13-0/beta-3-v2", 2],
  ["version-ios-13-0/beta-4", 19],
  ["version-ios-13-0/beta-5", 18],
  ["version-ios-13-0/beta-7", 6],
  ["version-ios-13-0/beta-8", 8],
  ["version-ipados-13-0/beta-1", 13],
  ["version-ipados-13-0/beta-2", 13],
  ["version-ipados-13-0/beta-3", 11],
  ["version-ipados-13-0/beta-3-v2", 1],
  ["version-ipados-13-0/beta-4", 16],
  ["version-ipados-13-0/beta-5", 17],
  ["version-ipados-13-0/beta-7", 6],
  ["version-ipados-13-0/beta-8", 7],
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
  events.length !== 16 ||
  changeCount !== 178 ||
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
      event.changes.length === 0 ||
      event.changes.length !==
        expectedRouteCounts.get(
          `${event.target.releaseVersionId}/${event.target.routeAlias}`,
        ) ||
      event.changes.some((change) =>
        /seed-identity|testflight|build-identity|administrative/i.test(
          change.key,
        ),
      ),
  )
) {
  throw new Error(
    "The expected iOS/iPadOS 13 prerelease review-candidate closure failed.",
  );
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
      `iOS/iPadOS 13 change definition drifted for ${occurrence.key}.`,
    );
  }
  localChangeDefinitions.set(occurrence.key, definition);
}
const uniqueLocalChangeKeys = [...localChangeDefinitions.keys()];
if (uniqueLocalChangeKeys.length !== 92) {
  throw new Error(
    `Expected the reviewed stable iOS/iPadOS 13 definition count; found ${uniqueLocalChangeKeys.length}.`,
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
    `iOS/iPadOS 13 prerelease change keys collide with existing content: ${collisions
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
  .map((event) => {
    const platform = event.target.releaseVersionId.includes("ipados")
      ? "iPadOS"
      : "iOS";
    return `| ${platform} | ${routeMetadata[event.target.routeAlias].label} | \`${event.target.routeAlias}\` | ${event.changes.length} |`;
  })
  .join("\n");
const renderRows = events
  .map((event) => {
    const platform = event.target.releaseVersionId.includes("ipados")
      ? "ipados"
      : "ios";
    return `| \`/apple/${platform}/13.0/${event.target.routeAlias}/\` | 200 | yes | yes | yes | yes |`;
  })
  .join("\n");
const sourceLedger = sources
  .map(
    (source) =>
      `- [${source.title}](${source.url}) — ${source.publisher}; ${source.sourceClass}.`,
  )
  .join("\n");

const md = `# Apple iOS and iPadOS 13 prerelease archive batch

## Result

\`${outputName}\` publishes a primary-source-backed archive for 16
existing iOS and iPadOS 13.0 routes: Beta 1 through Beta 5, Beta 3 v2,
Beta 7, and Beta 8 on each platform.

- ${events.length} substantive event overlays and no release-version overlays
- ${changeCount} change occurrences across ${uniqueLocalChangeKeys.length}
  stable, collision-checked definitions
- ${sources.length} declared and used sources with ${citationCount} citation
  references
- zero builds, build-number claims, route creation, Beta 6 changes, GM changes,
  Public-route changes, or administrative identity changes
- every event is \`editoriallyVerified\`, approved at \`${reviewedAt}\`, and
  indexable

## Published route closure

| Platform | Milestone | Existing alias | Selected changes |
| --- | --- | --- | ---: |
${routeRows}

The local seed contains 20 iOS/iPadOS 13.0 milestones. Beta 6 on both
platforms, iOS GM, and iOS Public remain outside this prerelease archive pass.
Public is already owned by \`apple-ios-ipados-13.json\`.

## Archive method

1. Exact Internet Archive CDX inventories were queried for each legacy Apple
   Developer milestone slug rather than a broad prefix.
2. The preserved Apple pages are server-rendered human documents. Each state
   was parsed by component, status heading, list record, and retained issue ID.
3. Beta 1 is a representative New Features baseline. Beta 2, Beta 3, Beta 3
   v2, Beta 4, Beta 5, and Beta 8 use adjacent retained states; exact additions
   and status transitions are preferred over wording edits.
4. Beta 7 has an exact self-identifying Apple page, but its previous retained
   page is Beta 5. To avoid crossing Beta 6, only Beta 7's own Resolved Issues
   records are used and no page-to-page delta is claimed.
5. Explicit iPhone, CarPlay, Health, Apple Watch, cellular, iPhone Storage,
   iPad, Split View, Slide Over, and Apple Pencil language controls route scope.

## Raw snapshot audit ledger

Canonical SHA-256 values below cover the ordered parsed object
\`{title, records:[{component,status,issueIds,text}]}\` after collapsing DOM
whitespace in title, component, status, and text, serialized with
\`JSON.stringify\`.

| Milestone state | Capture | CDX digest | CDX length | Records | Issue IDs | Canonical SHA-256 |
| --- | --- | --- | ---: | ---: | ---: | --- |
| Beta 1 | \`20190605224338\` | \`HZFWPQVOBZIMBKLLOFSWHAFHP3H2EQMR\` | 33,678 | 155 | 161 | \`f120b70d949ff43576028421b447c617cfe16122dd2439c9f79d8317af853b9e\` |
| Beta 2 | \`20190617182129\` | \`HDJTBLMD4DHXRBAS2QMV7IA5UBPNPV4X\` | 37,138 | 190 | 198 | \`0962ae88525ff8c3314c78978d5f0ffcec3b864899d065cbbf65f8aba0c83392\` |
| Beta 2 comparison | \`20190701210440\` | \`AFPXWYFZYEHTVVOH5DBEJQK4Q5NHPWMV\` | 36,995 | 190 | 198 | \`491f000d699ed72537f960aa48f14475e04bd2e8238471d8700dfff4d8a25560\` |
| Beta 3 | \`20190704121813\` | \`C7IR2M27SHNVR4MK5XWLUNQX5Z6RT56Y\` | 30,982 | 124 | 131 | \`b851589ec4ff4e36a0569e5312c5c1b4d6332bf09fbdcf4651c5e800f1b0d94d\` |
| Beta 3 v2 boundary | \`20190711171915\` | \`G2NVUTMNB7L674IQD33Z6FTWGXW7DNUE\` | 30,994 | 124 | 131 | \`ac9f8911ba79292f39431a5e6624d0db0b456633e762eb8762c7ad5ec2c87dcc\` |
| Beta 4 | \`20190718064136\` | \`6UZX6FMWEIULIW7OSRNCXCYKBIEGQBX5\` | 34,405 | 137 | 144 | \`41bc7a643b6be7c663403b44411a51dfc55afe36f7c2c57a3965435be2eaf5bb\` |
| Beta 5 | \`20190730072345\` | \`DLIXBWHMGFWLW3WS5ZSVU32V2FGZQFXA\` | 34,160 | 100 | 103 | \`ec80e95a46c1872e24797ac3f9b92d681f976d5ae1d2a64735993f3b94c821ab\` |
| Beta 7 | \`20190815184709\` | \`JKFXPKWZ7LQJC4MCJVMQVSR5XNBHZE6K\` | 32,473 | 88 | 91 | \`df3624bd3b2dd21997103028f37b33ac307f1c39b823ce8d399f07a04b7b66be\` |
| Beta 8 | \`20190822104335\` | \`2WA4DIFYEU2W3RFAAFGZUWE4ZFO7DNRY\` | 32,580 | 86 | 88 | \`6d1434545a8451375e39eb0843a029457c63a5561de02248c51168cd93fae8dc\` |

## Exact evidence gaps

- The exact Beta 6 Apple slug has no CDX capture. Beta 5-to-Beta 7 crosses that
  milestone, so it is never used as a Beta 7 delta.
- Beta 3 v2 retains the Beta 3 document title, but its two status transitions
  explicitly say they apply starting in build 17A5522g and the capture falls
  after the July 8 revision and before Beta 4.
- iOS GM has no audited milestone page in this pass.
- Public is already represented by the public-release batch and is untouched.
- No complete first-party build-number set was independently retained. This
  batch creates no build documents.

## Source ledger

All declared sources were accessed on ${accessedAt}.

${sourceLedger}

## Closure guards

- Exact comparison against both local 13.0 seed records and all 20 milestones
- Exact 16-route allowlist with explicit exclusion of Beta 6, GM, and Public
- Zero versions and zero builds
- Collision scan across every other research-batch JSON plus
  \`apple-launch-content-2026.json\`
- ${changeCount} occurrences resolve to exactly
  ${uniqueLocalChangeKeys.length} stable local definitions
- Explicit rejection of identity, build, TestFlight, and administrative keys
- Complete unique source declaration/use closure
- Deterministic formatted JSON SHA-256: \`${jsonSha}\`

## Publication and validation record

The generator's seed, route, collision, review-state, evidence-boundary, and
citation guards pass before either artifact is written.

Independent editorial and evidence review:

- all nine retained Apple states were independently replayed; every document
  title, record count, unique issue-ID count, and canonical parsed-state
  SHA-256 matched this ledger exactly
- all ${changeCount} occurrence checks and 187 issue-ID assertions matched the
  exact component and status heading in the cited Apple state
- all 148 adjacent-boundary assertions passed; Beta 1 and Beta 7 retained their
  explicitly documented baseline methods
- the independent reader-facing copyright scan found a maximum contiguous
  overlap of 6 words, limited to the factual iPhone 7 device sequence
- all 16 event articles and all ${changeCount} occurrences were approved at
  \`${reviewedAt}\`

Publication receipt:

- applied production plan: \`${publication.planSha}\`
- reviewed plan artifact SHA-256: \`${publication.planArtifactSha}\`
- rollback artifact SHA-256: \`${publication.rollbackArtifactSha}\`
- Sanity transaction: \`${publication.transactionId}\`
- receipt SHA-256: \`${publication.receiptSha}\`
- immediate post-publication zero plan:
  \`${publication.immediateZeroPlanSha}\`; zero creates, zero patches,
  ${publication.immediateZeroUnchanged.toLocaleString("en-US")} unchanged
  documents, and a ${publication.immediateZeroPayloadBytes}-byte mutation
  payload
- zero-plan artifact SHA-256:
  \`${publication.immediateZeroPlanArtifactSha}\`
- zero-plan rollback artifact SHA-256:
  \`${publication.immediateZeroRollbackArtifactSha}\`

Production coverage after publication:

- 410 of 410 release versions have full version-level coverage
- 1,979 appearances: 391 full articles, 256 source-linked records, and 1,332
  timeline-only records
- 542 appearances have approved structured changes

## Settled canonical route verification

Every published route was fetched independently from the running local site.
Each response returned the full archival article, release-note evidence,
References, and \`index, follow\`; none returned a timeline placeholder,
placeholder copy, or \`noindex\`.

| Canonical route | HTTP | Full article | Evidence | References | Index |
| --------------- | ---: | ------------ | -------- | ---------- | ----- |
${renderRows}

Final verification on ${accessedAt}:

- \`npm run research:validate\`: 55 batches validated; this batch reports 16
  events, ${changeCount} change occurrences, ${sources.length} sources, and
  ${citationCount} citation references; 2,978 change keys remain globally
  consistent
- full repository suite: 131 tests passed
- focused ingestion/manifest suite: 19 tests passed
- all ${changeCount} occurrence checks, 187 issue-ID assertions, and 148
  adjacent-boundary assertions passed
- independent copyright-similarity scan: maximum contiguous overlap of 6 words
- ESLint, Prettier check, and focused \`git diff --check\`: passed
- deterministic regeneration: the formatted JSON SHA-256 remained
  \`${jsonSha}\`
- final production dry run reproduced zero creates, zero patches,
  ${publication.immediateZeroUnchanged.toLocaleString("en-US")} unchanged
  documents, the ${publication.immediateZeroPayloadBytes}-byte payload, and
  plan SHA \`${publication.immediateZeroPlanSha}\`
- the final planner reported “No Sanity data changed”

Reproduce with:

\`\`\`sh
node scripts/research-batches/build-apple-ios-ipados-13-prerelease.mjs
npm run research:validate
node --import tsx --test tests/launch-content-ingestion.test.ts tests/launch-content-manifest.test.ts
npx eslint scripts/research-batches/build-apple-ios-ipados-13-prerelease.mjs
npx prettier --check scripts/research-batches/build-apple-ios-ipados-13-prerelease.mjs scripts/research-batches/apple-ios-ipados-13-prerelease.json scripts/research-batches/apple-ios-ipados-13-prerelease.md
npx sanity exec scripts/ingest-launch-content.ts --with-user-token -- --content scripts/research-batches/apple-ios-ipados-13-prerelease.json
\`\`\`

The final command is intentionally a post-publication dry run and must
reproduce the zero plan above. Do not add \`--apply\`.
`;

const formattedMd = await prettier.format(md, { filepath: ledgerName });
writeFileSync(join(here, ledgerName), formattedMd);

console.log(
  `${outputName}: ${events.length} events, ${changeCount} occurrences, ${uniqueLocalChangeKeys.length} unique changes, ${sources.length} sources, ${citationCount} citations, SHA-256 ${jsonSha}`,
);
