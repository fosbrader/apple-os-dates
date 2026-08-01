import { createHash } from "node:crypto";
import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import prettier from "prettier";

const here = dirname(fileURLToPath(import.meta.url));
const outputName = "apple-ios-10-prerelease.json";
const ledgerName = "apple-ios-10-prerelease.md";
const accessedAt = "2026-07-30";
const reviewedAt = "2026-07-30T09:44:24Z";

const dryRun = {
  creates: 72,
  patches: 2,
  unchanged: 2080,
  sourceCreates: 5,
  changeCreates: 67,
  mutationPayloadBytes: 179_219,
  planSha: "ef165550f3ff58c6bc71371557bf155acf6620e0b1594ee1a0f43bcb3c671797",
  planArtifactSha:
    "9b9b8d76b7edaad820009571eb233c3100b78a8ceb3024bbbb1a8cf8609b6f27",
  rollbackArtifactSha:
    "41e398670535d097c4368b254fd9aebcddc13c074c9d950064fc5cebf1afd15c",
};
const verification = {
  researchBatches: 73,
  globalChangeKeys: 4214,
  focusedTests: 19,
  fullTests: 131,
  beta1PdfBytes: 265_117,
  beta1PhysicalPages: 20,
  beta1OcrBytes: 37_501,
  beta1OcrBullets: 166,
  beta1LocatorAssertions: 30,
  beta3TranscriptBytes: 39_717,
  beta3FixedStartLine: 94,
  beta3FixedEndLine: 188,
  beta3LocatorAssertions: 37,
  maximumEditorialOverlapWords: 5,
};
const publication = {
  transactionId: "tt1fSB5HY9GAB0YLyyeXd3",
  receiptSha:
    "37705622accf420385670bca4cd3e4a28f7e886bc8d00e278317f23e0e7709ff",
  immediateZeroPlanSha:
    "8117047a945819022cca59319fd4e3cadcc345bb819a3efb4515c2ea43dc4d7f",
  immediateZeroPlanArtifactSha:
    "1d277424d33259e00a0eb8d0cc753628fcc82c5f282397ce10ba15a9572961b5",
  immediateZeroRollbackArtifactSha:
    "c6ccf91beeb974b50a05264dfa9df2edac368fa1750e9ff85fd1a989e3f16681",
  immediateZeroCreates: 0,
  immediateZeroPatches: 0,
  immediateZeroUnchanged: 2154,
  immediateZeroPayloadBytes: 16,
  coverage: {
    fullVersions: 410,
    totalVersions: 410,
    fullAppearances: 402,
    sourceLinkedAppearances: 256,
    timelineOnlyAppearances: 1321,
    totalAppearances: 1979,
    approvedStructuredAppearances: 553,
  },
};
const baselineCorrection = {
  reviewedAt: "2026-07-30T14:12:29Z",
  planSha: "dc7bcfab95249527a8dfcd2e9d82cd3c84387434842a50cf889bf590d069e08d",
  planArtifactSha:
    "5453bac50c3a09babeed6cfe207e6a533d78d9f2e60db50a65d97b6cfccfb87a",
  rollbackArtifactSha:
    "28a8654b6c9379a2a3bce5d9387e9feccd1b3206cc121545cd2b66b3ac383904",
  creates: 0,
  patches: 3,
  unchanged: 2240,
  mutationPayloadBytes: 97_477,
  beta1InheritanceCorrections: 30,
  beta3ExactLocatorCorrections: 1,
  transactionId: "eOgq1Ovu5XNUv1qNFVRqhz",
  receiptSha:
    "a3281d11d6ec58fd5a3b6d006b291f4958b0dc6b0854426df70f128591bb30cc",
  zeroPlanSha:
    "50cae7d69ddbdef8edb1bb079209865da10eee5923f6555b845666c1ec08008f",
  zeroPlanArtifactSha:
    "6e7e5bf3ea8c1803bdafb13f0e75abaad2155ba32093e0d5f4bfb55ccbe66d34",
  zeroRollbackArtifactSha:
    "bbe0896065684fe48733eefb9630ad02e8bc27b8c80759fbb3b168b3ca27bd8a",
  zeroUnchanged: 2243,
  zeroPayloadBytes: 16,
  coverage: {
    fullVersions: 410,
    totalVersions: 410,
    fullAppearances: 515,
    sourceLinkedAppearances: 256,
    timelineOnlyAppearances: 1297,
    totalAppearances: 2068,
    approvedStructuredAppearances: 666,
  },
};

const U = {
  beta1:
    "https://archive.org/download/ios-10-beta-release-notes/315770725-IOS-10-Beta-Release-Notes.pdf",
  beta1Context: "https://gist.github.com/vdt/79891de1b602ab284e3d8f81ef59b8d3",
  beta3:
    "https://www.scribd.com/document/318576354/iOS-10-Beta-3-Release-Notes",
  beta3Context: "https://forums.whirlpool.net.au/archive/2539505?p=-1",
  finalNotes:
    "https://developer.apple.com/library/archive/releasenotes/General/RN-iOSSDK-10.0/",
};

const sources = [
  {
    url: U.beta1,
    archiveUrl: "https://archive.org/details/ios-10-beta-release-notes",
    title: "iOS SDK Release Notes for iOS 10 Beta (preserved PDF)",
    publisher: "Internet Archive document preservation",
    sourceClass: "archive",
    author: "Apple",
    publishedAt: "2016-06-13T00:00:00.000Z",
    topics: [
      "iOS",
      "10.0",
      "Beta 1",
      "Apple Developer release notes",
      "historical document mirror",
    ],
  },
  {
    url: U.beta1Context,
    title: "All the Apple Developer links you need from WWDC16",
    publisher: "GitHub Gist",
    sourceClass: "community",
    author: "vdt",
    publishedAt: "2016-06-14T14:13:28.000Z",
    topics: [
      "WWDC 2016",
      "iOS 10 Beta 1",
      "Apple CDN document identity",
      "historical context",
    ],
  },
  {
    url: U.beta3,
    title: "iOS 10 Beta 3 Release Notes (Apple-authored transcript)",
    publisher: "Scribd document mirror",
    sourceClass: "archive",
    author: "Apple",
    publishedAt: "2016-07-18T00:00:00.000Z",
    topics: [
      "iOS",
      "10.0",
      "Beta 3",
      "Apple Developer release notes",
      "historical document mirror",
    ],
  },
  {
    url: U.beta3Context,
    title: "Contemporaneous iOS 10 Beta 3 release-note link",
    publisher: "Whirlpool Forums",
    sourceClass: "community",
    author: "NeonVoid777",
    publishedAt: "2016-07-18T18:24:54.000Z",
    topics: [
      "iOS 10 Beta 3",
      "release-note document identity",
      "historical context",
    ],
  },
  {
    url: U.finalNotes,
    title: "iOS 10.0 Release Notes",
    publisher: "Apple Developer Documentation Archive",
    sourceClass: "firstPartyDocumentation",
    author: "Apple",
    publishedAt: "2016-09-13T00:00:00.000Z",
    topics: ["iOS", "10.0", "final SDK state", "archive boundary"],
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

const entry = (
  alias,
  key,
  title,
  canonicalSummary,
  category,
  action,
  component,
  locator,
  summary,
) => ({
  alias,
  key,
  title,
  canonicalSummary,
  category,
  action,
  component,
  locator,
  summary,
});

const selected = [
  entry(
    "beta-1",
    "apple-10-beta1-photos-faces-sync",
    "Face groupings stayed local to each device",
    "The first beta did not synchronize its Photos face groupings between a user’s devices.",
    "knownIssue",
    "knownIssue",
    "Functionality not in iOS 10 Beta 1",
    "Faces; page 4",
    "The preserved baseline warns that Photos face organization was device-local at this milestone.",
  ),
  entry(
    "beta-1",
    "apple-10-beta1-voicemail-transcription",
    "Voicemail transcription was not yet active",
    "Automatic transcription of voicemail messages was unavailable in the initial beta.",
    "knownIssue",
    "knownIssue",
    "Functionality not in iOS 10 Beta 1",
    "Voicemail transcription; page 4",
    "Apple explicitly withheld voicemail transcription from the first developer seed.",
  ),
  entry(
    "beta-1",
    "apple-10-beta1-store-dependent-extensions",
    "Store-dependent extensions awaited app adoption",
    "iMessage apps, SiriKit integrations, and Maps extensions could not operate until compatible App Store software became available.",
    "knownIssue",
    "knownIssue",
    "Functionality not in iOS 10 Beta 1",
    "App Store adoption; page 4",
    "The Beta 1 document distinguishes platform support from features that still needed third-party releases.",
  ),
  entry(
    "beta-1",
    "apple-10-beta1-rich-notification-device-scope",
    "Rich notifications initially required 3D Touch",
    "The first beta limited its optimized rich-notification interaction to iPhone 6s-class hardware.",
    "knownIssue",
    "knownIssue",
    "Functionality not in iOS 10 Beta 1",
    "Rich notifications and 3D Touch; page 4",
    "Apple said support for iPhones without 3D Touch would arrive in a later beta.",
  ),
  entry(
    "beta-1",
    "apple-10-beta1-ad-identifiers-upgrade",
    "Advertising identifiers changed after upgrading",
    "Installing the beta regenerated vendor and advertising identifiers.",
    "behavior",
    "changed",
    "AdSupport framework",
    "Vendor and advertising identifiers; page 4",
    "The milestone documents an identity continuity change that could affect analytics and advertising tests.",
  ),
  entry(
    "beta-1",
    "apple-10-beta1-airplay-mirroring",
    "AirPlay mirroring could fail",
    "Screen mirroring from an iOS 10 device to Apple TV was unreliable in the first beta.",
    "knownIssue",
    "knownIssue",
    "AirPlay",
    "Mirror a device; page 4",
    "The preserved notes identify AirPlay mirroring as an initial compatibility risk.",
  ),
  entry(
    "beta-1",
    "apple-10-beta1-sandbox-authentication",
    "Sandbox purchases could ask twice for authentication",
    "The In-App Purchase sandbox could display its first sign-in prompt two times.",
    "knownIssue",
    "knownIssue",
    "App Store",
    "First sandbox authentication dialog; page 4",
    "Apple’s workaround was to complete both prompts during purchase testing.",
  ),
  entry(
    "beta-1",
    "apple-10-beta1-mac-apple-pay-sheet",
    "Unconfigured iPhones produced an empty Mac payment sheet",
    "A Safari payment initiated on Mac could show a blank Apple Pay sheet when the paired iPhone had no card configured.",
    "knownIssue",
    "knownIssue",
    "Apple Pay",
    "Mac Safari payment sheet; page 4",
    "The baseline ties the empty sheet to missing Apple Pay setup on iPhone.",
  ),
  entry(
    "beta-1",
    "apple-10-beta1-pencil-angle-reporting",
    "Apple Pencil angles could be inaccurate near an edge",
    "Drawing inward from an iPad edge could produce estimated tilt and azimuth values with large errors.",
    "knownIssue",
    "knownIssue",
    "Apple Pencil",
    "Estimated tilt and azimuth; page 5",
    "Apple advised using the first later non-estimated measurement to repair the input history.",
  ),
  entry(
    "beta-1",
    "apple-10-beta1-raw-capture-iphone-se",
    "RAW capture could fail on iPhone SE",
    "The new photo-capture path did not reliably produce RAW images on iPhone SE.",
    "knownIssue",
    "knownIssue",
    "AVFoundation Capture",
    "RAW images on iPhone SE; page 5",
    "The first SDK notes call out a device-specific RAW photography failure.",
  ),
  entry(
    "beta-1",
    "apple-10-beta1-live-photo-movie-delivery",
    "Photo capture omitted Live Photo movies",
    "AVCapturePhotoOutput did not deliver the movie portion of a Live Photo through its normal result.",
    "knownIssue",
    "knownIssue",
    "AVFoundation Capture",
    "Live Photo movie delivery; page 5",
    "Developers were directed to create an AVAsset from the file URL supplied in the capture settings.",
  ),
  entry(
    "beta-1",
    "apple-10-beta1-legacy-icloud-restore",
    "Older iCloud backups could not restore directly",
    "Backups created on iOS 8 or earlier could fail when restored straight onto the first iOS 10 beta.",
    "knownIssue",
    "knownIssue",
    "Backup",
    "iOS 8 and earlier backups; page 5",
    "Apple’s documented bridge was to restore under iOS 9 before moving the device to iOS 10.",
  ),
  entry(
    "beta-1",
    "apple-10-beta1-tls-rc4-removal",
    "RC4 cipher suites were removed from Apple networking APIs",
    "HTTPS connections made through NSURLSession or NSURLConnection stopped negotiating RC4 during TLS setup.",
    "compatibility",
    "removed",
    "Binary Compatibility",
    "RC4 cipher suites; page 6",
    "The SDK baseline requires affected servers to offer stronger cipher suites.",
  ),
  entry(
    "beta-1",
    "apple-10-beta1-carplay-disconnects",
    "CarPlay connections could drop",
    "The first beta could disconnect an iPhone while it was attached to CarPlay.",
    "knownIssue",
    "knownIssue",
    "CarPlay",
    "CarPlay disconnects; page 6",
    "Apple recorded general CarPlay link instability for the initial seed.",
  ),
  entry(
    "beta-1",
    "apple-10-beta1-exchange-account-sync",
    "New Exchange accounts could remain unsynchronized",
    "Exchange accounts added manually or by configuration profile could appear in Settings without transferring data.",
    "knownIssue",
    "knownIssue",
    "Exchange Account Setup",
    "Manual and configuration-profile setup; page 7",
    "The documented recovery was to remove the incomplete setup and add the account again.",
  ),
  entry(
    "beta-1",
    "apple-10-beta1-guided-access-exit",
    "Guided Access could trap the active session",
    "After Guided Access was enabled, the first beta could prevent the user from leaving the current app.",
    "knownIssue",
    "knownIssue",
    "Guided Access",
    "Unable to exit; page 7",
    "Apple documented restart or battery-drain recovery paths depending on whether a passcode existed.",
  ),
  entry(
    "beta-1",
    "apple-10-beta1-messages-extension-insets",
    "Messages extension content could sit beneath the top bar",
    "UISearchController and UITableViewController content could be obscured when embedded in a Messages extension.",
    "knownIssue",
    "knownIssue",
    "Messages",
    "Search and table controllers; page 8",
    "The notes recommend temporary top and bottom insets for extension layouts.",
  ),
  entry(
    "beta-1",
    "apple-10-beta1-music-redesign",
    "The redesigned Apple Music experience entered testing",
    "Beta 1 introduced the new Apple Music interface as a simpler reorganization of the service.",
    "feature",
    "introduced",
    "Music",
    "All-new design; page 9",
    "The developer document establishes the Music redesign in the first iOS 10 seed.",
  ),
  entry(
    "beta-1",
    "apple-10-beta1-notification-audio-messages",
    "Audio messages would not play from notification surfaces",
    "Messages audio clips could not be played directly from a banner or notification-list action.",
    "knownIssue",
    "knownIssue",
    "Notifications",
    "Audio-message playback; page 10",
    "Apple directed users to open Messages or use the rich-notification interaction instead.",
  ),
  entry(
    "beta-1",
    "apple-10-beta1-memory-movie-crash",
    "Memory movies could terminate Photos",
    "Playing an automatically generated Memory movie could cause Photos to exit unexpectedly.",
    "knownIssue",
    "knownIssue",
    "Photos",
    "Memory movie playback; page 11",
    "The crash is explicitly present in the first beta’s Photos section.",
  ),
  entry(
    "beta-1",
    "apple-10-beta1-photos-32-bit-scope",
    "Advanced Photos views excluded 32-bit devices",
    "Memories, Related, People, and Scene experiences were not supported on 32-bit hardware.",
    "compatibility",
    "knownIssue",
    "Photos",
    "32-bit device support; page 11",
    "The first beta’s intelligent Photos experiences carried a clear hardware boundary.",
  ),
  entry(
    "beta-1",
    "apple-10-beta1-safari-content-blockers",
    "Content blockers could stop after the upgrade",
    "Safari content-blocking extensions could become inactive after installing Beta 1.",
    "knownIssue",
    "knownIssue",
    "Safari",
    "Content Blockers after upgrade; page 12",
    "Apple suggested toggling the blocker off and on again in Safari settings.",
  ),
  entry(
    "beta-1",
    "apple-10-beta1-safari-close-all-tabs",
    "Safari added a close-all-tabs command",
    "A long press on Safari’s tab-view control could close every open tab at once.",
    "feature",
    "introduced",
    "Safari",
    "Long press on Tab View; page 12",
    "The milestone notes establish the bulk tab-closing gesture as part of iOS 10.",
  ),
  entry(
    "beta-1",
    "apple-10-beta1-safari-viewport-zoom",
    "Safari prioritized user zoom over restrictive viewport settings",
    "Web pages could be pinch-zoomed even when their viewport attempted to disable scaling.",
    "enhancement",
    "changed",
    "Safari",
    "user-scalable viewport behavior; page 12",
    "Apple characterizes the behavior change as an accessibility improvement.",
  ),
  entry(
    "beta-1",
    "apple-10-beta1-safari-controller-tint",
    "Apps could customize the Safari view toolbar color",
    "SFSafariViewController gained a supported configuration path for changing its toolbar background.",
    "developerApi",
    "introduced",
    "SFSafariViewController",
    "preferredBarTintColor; page 12",
    "The Beta 1 SDK exposed the new tint control through the Safari view configuration.",
  ),
  entry(
    "beta-1",
    "apple-10-beta1-safari-controller-breadcrumb",
    "Safari view transitions showed a route back to the host app",
    "Opening full Safari from SFSafariViewController added a breadcrumb for returning to the originating application.",
    "enhancement",
    "introduced",
    "SFSafariViewController",
    "Safari button breadcrumb; page 12",
    "The initial notes document a clearer navigation handoff between the embedded view and Safari.",
  ),
  entry(
    "beta-1",
    "apple-10-beta1-swift-playgrounds",
    "Swift Playgrounds entered the iOS 10 beta",
    "Apple included the first beta of its iPad coding environment with Swift 3 lessons, challenges, and editable playgrounds.",
    "feature",
    "introduced",
    "Swift Playgrounds",
    "App introduction; page 13",
    "The release-note baseline describes the bundled learning app and its initial content model.",
  ),
  entry(
    "beta-1",
    "apple-10-beta1-gesture-recognizer-removal",
    "Removing an active gesture recognizer now cancelled it",
    "Detaching a gesture recognizer while it was recognizing began explicitly cancelling that gesture.",
    "developerApi",
    "changed",
    "UIKit",
    "Midflight UIGestureRecognizer removal; page 15",
    "The SDK notes contrast the new cancellation behavior with earlier releases.",
  ),
  entry(
    "beta-1",
    "apple-10-beta1-content-size-notification-source",
    "Dynamic Type notifications changed their sender",
    "UIContentSizeCategoryDidChangeNotification began originating from the main UIScreen rather than UIApplication.",
    "developerApi",
    "changed",
    "UIKit",
    "UIContentSizeCategoryDidChangeNotification; page 16",
    "The first beta records an observable source-object change for Dynamic Type notifications.",
  ),
  entry(
    "beta-1",
    "apple-10-beta1-3d-touch-haptics-setting",
    "3D Touch feedback depended on keyboard-click audio",
    "Haptic feedback for 3D Touch did not operate unless the Keyboard Clicks sound setting was enabled.",
    "knownIssue",
    "knownIssue",
    "UIKit",
    "3D Touch haptics; page 17",
    "The preserved known-issues list identifies an unexpected coupling between haptics and a sound preference.",
  ),
  entry(
    "beta-3",
    "apple-10-beta3-hosted-purchase-password",
    "Hosted sandbox purchases stopped prompting on every foreground",
    "Beta 3 resolved repeated password requests while hosted In-App Purchase content continued downloading.",
    "bugFix",
    "fixed",
    "App Store",
    "Hosted-content sandbox purchase; page 4",
    "Apple placed the recurring foreground authentication behavior in the milestone’s fixed section.",
  ),
  entry(
    "beta-3",
    "apple-10-beta3-apple-pay-card-validation",
    "Apple Pay card setup survived invalid detail entry",
    "Entering a wrong expiration date or security code no longer ended the entire card-provisioning attempt.",
    "bugFix",
    "fixed",
    "Apple Pay",
    "Card expiration date or CVV; page 4",
    "The fixed section records a more recoverable Apple Pay enrollment flow.",
  ),
  entry(
    "beta-3",
    "apple-10-beta3-pencil-pairing",
    "Apple Pencil pairing recovered on Home and Lock screens",
    "A new Apple Pencil could again pair while the device displayed the Home or Lock screen.",
    "bugFix",
    "fixed",
    "Apple Pencil",
    "New Pencil pairing; page 4",
    "Beta 3 closes the documented screen-dependent pairing failure.",
  ),
  entry(
    "beta-3",
    "apple-10-beta3-haptics-audio-playback",
    "Speaker audio continued through haptic feedback",
    "Internal-speaker playback no longer stopped when the device produced haptic feedback.",
    "bugFix",
    "fixed",
    "Audio",
    "Haptic feedback and internal speaker; page 4",
    "The audio interruption appears under Apple’s exact fixed-section heading.",
  ),
  entry(
    "beta-3",
    "apple-10-beta3-pages-without-icloud",
    "Pages document creation no longer hung without iCloud",
    "On iPad, creating a Pages document while signed out of iCloud stopped hanging.",
    "bugFix",
    "fixed",
    "Binary Compatibility",
    "Pages on iPad while signed out of iCloud; page 4",
    "Beta 3 resolves the account-state-specific Pages failure.",
  ),
  entry(
    "beta-3",
    "apple-10-beta3-carplay-now-playing-list",
    "CarPlay Now Playing lists repopulated",
    "Affected head units once again displayed entries in the Now Playing list.",
    "bugFix",
    "fixed",
    "CarPlay",
    "Empty Now Playing list; page 4",
    "The milestone’s fixed section restores the missing in-car queue display.",
  ),
  entry(
    "beta-3",
    "apple-10-beta3-carplay-steering-wheel-siri",
    "Steering-wheel Siri activation became more reliable",
    "CarPlay head-unit controls could again invoke Siri without the earlier triggering difficulty.",
    "bugFix",
    "fixed",
    "CarPlay",
    "Steering-wheel Siri control; page 4",
    "Apple records the steering-wheel activation problem among Beta 3’s CarPlay fixes.",
  ),
  entry(
    "beta-3",
    "apple-10-beta3-core-image-pixel-order",
    "CIImageProcessor standardized its pixel origin",
    "CIImageProcessor input and output buffers began placing the upper-left pixel at the first byte.",
    "developerApi",
    "changed",
    "CoreImage",
    "CIImageProcessor data order; page 4",
    "The fixed section includes a concrete buffer-order contract for the new processing API.",
  ),
  entry(
    "beta-3",
    "apple-10-beta3-exchange-setup-assistant-sync",
    "Setup Assistant Exchange accounts began syncing immediately",
    "Newly configured Exchange accounts no longer needed a device restart before data synchronization began.",
    "bugFix",
    "fixed",
    "Exchange",
    "Account setup through Setup Assistant; page 4",
    "Beta 3 removes the post-setup restart dependency.",
  ),
  entry(
    "beta-3",
    "apple-10-beta3-ibooks-audiobook-visibility",
    "Deleted collection audiobooks became visible again",
    "A purchased audiobook removed from a custom collection could once again be found or played without relaunching iBooks or syncing.",
    "bugFix",
    "fixed",
    "iBooks",
    "Purchased audiobook after custom-collection deletion; page 5",
    "The milestone fixes an iBooks library-visibility edge case.",
  ),
  entry(
    "beta-3",
    "apple-10-beta3-testflight-container-restore",
    "iCloud Restore added TestFlight app-container recovery",
    "Restoring from iCloud began carrying back container data for TestFlight beta applications.",
    "enhancement",
    "introduced",
    "iCloud Backup and Restore",
    "TestFlight app container restores; page 5",
    "Apple marks TestFlight container recovery as newly supported in Beta 3.",
  ),
  entry(
    "beta-3",
    "apple-10-beta3-two-factor-keyboard",
    "The keyboard returned during two-factor setup",
    "Settings reliably displayed its keyboard during two-factor authentication.",
    "bugFix",
    "fixed",
    "Keyboards",
    "Two-Factor Authentication in Settings; page 5",
    "Beta 3 resolves an intermittent authentication-input failure.",
  ),
  entry(
    "beta-3",
    "apple-10-beta3-chinese-lock-calendar",
    "Chinese lunar dates used consistent numerals on Lock screen",
    "The alternate Chinese calendar stopped mixing numeral systems when rendered on the Lock screen.",
    "bugFix",
    "fixed",
    "Lock Screen",
    "Chinese alternate calendar numerals; page 5",
    "The fixed section records a localized calendar-formatting repair.",
  ),
  entry(
    "beta-3",
    "apple-10-beta3-messages-selection-callbacks",
    "Message-selection callbacks fired for foreground extensions",
    "Selecting a third-party bubble began invoking the extension’s will-select and did-select conversation callbacks.",
    "bugFix",
    "fixed",
    "Messages",
    "willSelectMessage and didSelectMessage callbacks; page 5",
    "Beta 3 restores the missing extension-selection lifecycle notifications.",
  ),
  entry(
    "beta-3",
    "apple-10-beta3-messages-debug-attach",
    "Messages extension debugging used a stable attach sequence",
    "Launching an extension after Xcode entered its waiting-to-attach state avoided the earlier debugging failure.",
    "bugFix",
    "fixed",
    "Messages",
    "Xcode waiting-to-attach sequence; page 5",
    "Apple’s fixed section records the corrected launch timing for extension debugging.",
  ),
  entry(
    "beta-3",
    "apple-10-beta3-sticker-peeling",
    "Long-pressed stickers entered peeling mode again",
    "Holding a sticker once again started the peel interaction used to place it on a conversation.",
    "bugFix",
    "fixed",
    "Messages",
    "Sticker Peeling animation; page 5",
    "The milestone repairs the gesture that begins sticker placement.",
  ),
  entry(
    "beta-3",
    "apple-10-beta3-messages-compact-offset",
    "Messages extensions shed the extra compact-mode offset",
    "Returning from expanded to compact presentation no longer left an unwanted gap above extension content.",
    "bugFix",
    "fixed",
    "Messages",
    "Expanded-to-Compact transition; page 5",
    "Beta 3 fixes the presentation-style layout offset.",
  ),
  entry(
    "beta-3",
    "apple-10-beta3-images-locale-scope",
    "#images stopped appearing in unsupported locales",
    "Messages no longer offered the #images browser where the service could not load.",
    "bugFix",
    "fixed",
    "Messages",
    "#images in unsupported locales; page 5",
    "The fixed section aligns feature visibility with regional availability.",
  ),
  entry(
    "beta-3",
    "apple-10-beta3-message-voiceover-labels",
    "VoiceOver announced third-party message labels",
    "Accessibility labels attached to third-party Messages content became audible through VoiceOver.",
    "bugFix",
    "fixed",
    "Messages",
    "Third-party message accessibility labels; page 5",
    "Beta 3 restores spoken labeling for extension-generated messages.",
  ),
  entry(
    "beta-3",
    "apple-10-beta3-message-extension-enablement",
    "Downloaded Messages extensions enabled normally",
    "Newly installed Messages extensions no longer required a manual trip to the Manage tab before use.",
    "bugFix",
    "fixed",
    "Messages",
    "Messages extensions download and install; Manage tab; page 5",
    "The milestone fixes an installation state that left some extensions disabled.",
  ),
  entry(
    "beta-3",
    "apple-10-beta3-messages-rtl-photo-browser",
    "The Messages photo browser rendered in RTL layouts",
    "Right-to-left configurations no longer opened the Messages photo browser as an empty gray area.",
    "bugFix",
    "fixed",
    "Messages",
    "RTL photo browser; page 5",
    "Beta 3 repairs the browser’s initial rendering direction.",
  ),
  entry(
    "beta-3",
    "apple-10-beta3-music-china-membership-view",
    "Apple Music opened normally for members in China",
    "Users in China no longer had to force-quit Music after updating from the previous beta to see the application.",
    "bugFix",
    "fixed",
    "Music",
    "China membership after Beta 2 update; page 5",
    "Apple lists the post-update visibility failure among Beta 3’s fixes.",
  ),
  entry(
    "beta-3",
    "apple-10-beta3-notes-editing-crash",
    "Attachment and organization edits stopped crashing Notes",
    "Adding an attachment, deleting a note, or moving one no longer caused Notes to terminate.",
    "bugFix",
    "fixed",
    "Notes",
    "Adding an attachment, deleting, or moving notes; page 5",
    "Beta 3 resolves a group of common note-editing crashes.",
  ),
  entry(
    "beta-3",
    "apple-10-beta3-volte-relay-audio",
    "Relayed CS and VoLTE calls retained downlink audio",
    "Calls answered on another device kept their incoming audio and no longer disconnected around the thirty-second mark.",
    "bugFix",
    "fixed",
    "Phone",
    "CS/VoLTE relay-call audio; page 6",
    "The milestone repairs audio and stability in relayed cellular calls.",
  ),
  entry(
    "beta-3",
    "apple-10-beta3-simless-emergency-ui",
    "SIM-less emergency calls displayed the active call screen",
    "Dialing emergency number 08 without a SIM once again showed the Phone interface after connection.",
    "bugFix",
    "fixed",
    "Phone",
    "SIM-less emergency number 08; page 6",
    "Beta 3 resolves the mismatch between a connected emergency call and its UI.",
  ),
  entry(
    "beta-3",
    "apple-10-beta3-reset-network-settings",
    "Reset All Settings preserved carrier connectivity",
    "Resetting device preferences no longer removed carrier configuration or prevented LTE attachment.",
    "bugFix",
    "fixed",
    "Phone",
    "Reset All Settings and carrier bundle; page 6",
    "The fixed section restores carrier metadata and LTE service after a settings reset.",
  ),
  entry(
    "beta-3",
    "apple-10-beta3-911-call-end-screen",
    "Completed 911 calls no longer showed a failure screen",
    "Ending an emergency call stopped presenting the misleading Call Failed interface.",
    "bugFix",
    "fixed",
    "Phone",
    "911 call completion UI; page 6",
    "Beta 3 corrects the terminal state displayed after an emergency call.",
  ),
  entry(
    "beta-3",
    "apple-10-beta3-call-setting-state",
    "Call Forwarding and Call Waiting controls retained their state",
    "Settings kept the visible value of Call Forwarding or Call Waiting after the user left and returned to the screen.",
    "bugFix",
    "fixed",
    "Phone",
    "Call Forwarding and Call Waiting preferences; page 6",
    "The repair brings the displayed preference into line with the already-applied carrier option.",
  ),
  entry(
    "beta-3",
    "apple-10-beta3-watch-relay-handoff",
    "Apple Watch relay calls handed back from Lock screen",
    "Moving a relayed call from Apple Watch to a locked iPhone no longer dropped the connection.",
    "bugFix",
    "fixed",
    "Phone",
    "Apple Watch relay-call handoff; page 6",
    "Beta 3 repairs a Lock-screen call-continuity path.",
  ),
  entry(
    "beta-3",
    "apple-10-beta3-memory-movie-consistency",
    "Memory movies retained their selected media between betas",
    "A Memory movie created under Beta 1 no longer substituted different photos or videos when reopened after Beta 2.",
    "bugFix",
    "fixed",
    "Photos",
    "Memory movies across Beta 1 and Beta 2; page 6",
    "The fixed section records more stable automatic movie composition across upgrades.",
  ),
  entry(
    "beta-3",
    "apple-10-beta3-advertising-id-reset",
    "Signed-in users could reset the Advertising Identifier",
    "Logging into an iTunes account no longer disabled the control for regenerating the device’s advertising identifier.",
    "bugFix",
    "fixed",
    "Privacy",
    "Advertising Identifier reset after iTunes login; page 6",
    "Beta 3 restores the privacy reset action for authenticated users.",
  ),
  entry(
    "beta-3",
    "apple-10-beta3-siri-audio-output",
    "Siri stopped interrupting media and Maps voice guidance",
    "Invoking Siri no longer left media paused or replaced spoken Maps directions with alert tones.",
    "bugFix",
    "fixed",
    "Siri",
    "Audio playback and Maps navigation output; page 6",
    "The milestone fixes two related audio-output disruptions around Siri use.",
  ),
  entry(
    "beta-3",
    "apple-10-beta3-siri-australian-voice",
    "Australian English Siri responses regained speech",
    "Siri reliably spoke responses when its selected voice was Australian English.",
    "bugFix",
    "fixed",
    "Siri",
    "Australian English voice-over; page 6",
    "Beta 3 resolves the intermittent silent-response condition.",
  ),
  entry(
    "beta-3",
    "apple-10-beta3-sirikit-interaction-fields",
    "Intent UI extensions received response state",
    "INInteraction objects supplied to an Intents UI extension again carried their intent response and handling status.",
    "bugFix",
    "fixed",
    "SiriKit",
    "INInteraction response and handling-status properties; page 6",
    "The fixed section restores response context needed by SiriKit presentation extensions.",
  ),
  entry(
    "beta-3",
    "apple-10-beta3-sirikit-payment-method",
    "Invalid SiriKit payment-method parameters were retired",
    "Apple marked INPaymentMethod for removal from the affected request-payment intent declarations.",
    "developerApi",
    "removed",
    "SiriKit",
    "INPaymentMethod in request-payment intents; page 6",
    "Beta 3 clarifies an API surface that Apple considered invalid.",
  ),
  entry(
    "beta-3",
    "apple-10-beta3-sirikit-confirmation-handler",
    "SiriKit invoked handlers after a Ready confirmation",
    "An app extension that implemented intent confirmation and returned Ready could proceed to handle the request.",
    "bugFix",
    "fixed",
    "SiriKit",
    "Intent confirmation and Ready response; page 6",
    "The milestone fixes handler dispatch for the documented confirmation path.",
  ),
  entry(
    "beta-3",
    "apple-10-beta3-pasteboard-main-thread",
    "Pasteboard access became main-thread-only",
    "iOS 10 restricted pasteboard calls to the main thread, requiring apps to stop assuming background access would return a value.",
    "developerApi",
    "changed",
    "UIKit",
    "Main-thread pasteboard access; page 6",
    "Apple records the threading contract in Beta 3’s fixed section as a compatibility change.",
  ),
];

const routeMetadata = {
  "beta-1": {
    source: U.beta1,
    context: U.beta1Context,
    label: "Beta 1",
    status: "Notes and Known Issues baseline",
    evidence:
      "the complete Apple-authored Beta 1 PDF preserved by Internet Archive",
  },
  "beta-3": {
    source: U.beta3,
    context: U.beta3Context,
    label: "Beta 3",
    status: "Fixed in this Release",
    evidence:
      "the complete Apple-authored Beta 3 transcript preserved by Scribd",
  },
};

const verificationFor = (change) => {
  const route = routeMetadata[change.alias];
  if (change.alias === "beta-1") {
    return `Matched the cited section and “${change.locator}” record in ${route.evidence}. A June 14, 2016 WWDC link ledger independently identifies the original Apple CDN filename. This is treated as a first-document baseline, not a claimed diff from an unavailable earlier state.`;
  }
  return `Matched the exact “${change.component}” heading and “${change.locator}” record beneath Apple’s “Fixed in this Release” heading in ${route.evidence}. A contemporaneous July 19 AEST post independently identifies a PDF named for iOS 10 Beta 3. Forum observations were not used as release-note facts.`;
};

const changesByAlias = new Map();
for (const change of selected) {
  const route = routeMetadata[change.alias];
  const output = {
    key: change.key,
    title: change.title,
    canonicalSummary: change.canonicalSummary,
    category: change.category,
    action: change.action,
    inheritance: change.alias === "beta-1" ? "cumulative" : "delta",
    summary: change.summary,
    documentedStatus: "documented",
    evidenceState: "corroborated",
    verificationMethod: verificationFor(change),
    citations: [
      c(
        route.source,
        `${change.component} — ${change.locator}`,
        `Original synthesis from Apple’s ${route.status.toLowerCase()} record.`,
      ),
    ],
  };
  changesByAlias.set(change.alias, [
    ...(changesByAlias.get(change.alias) || []),
    output,
  ]);
}

const articleFor = (alias) => {
  const route = routeMetadata[alias];
  const changes = changesByAlias.get(alias) || [];
  if (alias === "beta-1") {
    return article(
      heading("What survives"),
      prose(
        "A complete Apple-authored developer PDF survives for the first iOS 10 beta. Its title identifies Beta 1, its document-numbered body runs through page 18, and it retains the original component headings, functionality exclusions, notes, workarounds, and known-issue sections.",
        [
          c(
            route.source,
            "iOS SDK Release Notes for iOS 10 Beta; Introduction; pages 3–18",
          ),
          c(
            route.context,
            "iOS 10 Beta Release Notes — original adcdownload.apple.com PDF URL",
            "Used only to corroborate the document identity and timing.",
          ),
        ],
      ),
      heading("A baseline, not an invented diff"),
      prose(
        "Because this is the first retained prerelease document, the structured entries are limited to explicit Beta 1 exclusions, component notes, compatibility changes, features, and known issues. They establish what Apple documented at the milestone; they do not claim that every entry first appeared on that day or that this selection exhausts the build.",
        [
          c(
            route.source,
            "Functionality not in iOS 10 Beta 1; Notes and Known Issues",
          ),
        ],
      ),
      heading("Selected coverage"),
      prose(
        "The index covers feature availability, Apple Pay, Pencil and photo capture, backup compatibility, networking security, Exchange, accessibility, Messages extensions, Music, notifications, Photos, Safari, Swift Playgrounds, and UIKit behavior.",
        uniqueCitations(changes.flatMap((change) => change.citations)),
      ),
      heading("Archive boundary"),
      prose(
        "Apple’s current documentation archive exposes the final September SDK state, not a navigable sequence of the 2016 beta revisions. The retained Beta 1 PDF is therefore cited as a third-party-preserved Apple document, and each occurrence was independently reviewed against its cited page before publication. No build number, community observation, or later cumulative note is assigned to this route.",
        [
          c(
            U.finalNotes,
            "iOS SDK Release Notes for iOS 10.0; Updated 2016-09-13",
            "Final-state boundary only; not used as Beta 1 attribution.",
          ),
          c(
            route.context,
            "Original Apple CDN filename",
            "Identity corroboration only.",
          ),
        ],
      ),
    );
  }
  return article(
    heading("What survives"),
    prose(
      "A complete text rendering of Apple’s iOS 10 Beta 3 developer PDF survives online. It identifies the SDK as Beta 3, preserves a 15-page document body, and separates a milestone-specific “Fixed in this Release” section from the cumulative notes and known issues that follow.",
      [
        c(route.source, "iOS SDK Release Notes for iOS 10 beta 3; pages 3–15"),
        c(
          route.context,
          "Post 355; Dev Beta 3; linked iOS 10 beta 3 Release Notes PDF",
          "Used only to corroborate document identity and timing.",
        ),
      ],
    ),
    heading("Exact delta boundary"),
    prose(
      "Only records beneath the document’s explicit fixed-section heading are attached to Beta 3. Generic known issues, functionality exclusions, and notes after that section are left out because they may have carried forward from earlier builds.",
      [c(route.source, "Fixed in this Release; pages 4–6")],
    ),
    heading("Selected coverage"),
    prose(
      "The structured delta spans purchase testing, Apple Pay, Apple Pencil, audio, CarPlay, Core Image, Exchange, backup and restore, Messages extensions, Music, Notes, telephony, Photos, privacy, Siri, SiriKit, and UIKit.",
      uniqueCitations(changes.flatMap((change) => change.citations)),
    ),
    heading("Archive limitations"),
    prose(
      "The original Apple download is no longer publicly inspectable without relying on a mirror, and Apple’s archive now presents the final SDK document. The preserved transcript and a contemporaneous filename link establish the Beta 3 document, but no unavailable build number or community-discovered behavior is promoted into this page.",
      [
        c(
          U.finalNotes,
          "iOS SDK Release Notes for iOS 10.0; final SDK state",
          "Archive-boundary comparison only.",
        ),
        c(
          route.context,
          "Contemporaneous Beta 3 PDF link",
          "Forum-authored observations are excluded.",
        ),
      ],
    ),
  );
};

const events = ["beta-1", "beta-3"].map((alias) => {
  const route = routeMetadata[alias];
  const changes = changesByAlias.get(alias) || [];
  const boundary =
    alias === "beta-1"
      ? "a conservative first-document baseline"
      : "the document’s explicit fixed section";
  return {
    target: {
      releaseVersionId: "version-ios-10-0",
      routeAlias: alias,
    },
    authorship: "originalSynthesis",
    summary: `iOS 10 ${route.label} is represented by ${changes.length} Apple-documented records from ${boundary}; unsupported builds, cumulative carry-forward, and community observations are excluded.`,
    article: articleFor(alias),
    citations: uniqueCitations([
      c(
        route.source,
        `${route.label}; ${route.status}; exact component headings`,
      ),
      c(
        route.context,
        `${route.label} document identity`,
        "Context only; community observations are excluded.",
      ),
      c(
        U.finalNotes,
        "Final iOS 10.0 SDK note state",
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
    majorVersion: 10,
    version: "10.0",
    releaseStatus: "released",
    publicReleaseDate: "2016-09-13",
    releaseNotesUrl:
      "https://support.apple.com/kb/DL1893?viewlocale=en_US&locale=en_US",
    milestones: [
      ["Beta 1", "2016-06-13", false, undefined],
      ["Beta 2", "2016-07-05", false, undefined],
      ["Beta 3", "2016-07-18", false, undefined],
      ["Beta 4", "2016-08-01", false, undefined],
      ["Beta 5", "2016-08-09", false, undefined],
      ["Beta 6", "2016-08-15", false, undefined],
      ["Beta 7", "2016-08-19", false, undefined],
      ["Beta 8", "2016-08-26", false, undefined],
      ["GM", "2016-09-07", false, "iOS 10.0.1 build 14A403"],
      ["Public", "2016-09-13", false, "iOS 10.0.1 build 14A403"],
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
  .filter((version) => version.platform === "iOS" && version.version === "10.0")
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
    "The exact local iOS 10.0 seed inventory changed; re-audit the cohort before regenerating.",
  );
}

const expectedRoutes = new Set([
  "version-ios-10-0/beta-1",
  "version-ios-10-0/beta-3",
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
  events.length !== 2 ||
  changeCount !== 67 ||
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
      event.changes.some(
        (change) =>
          change.evidenceState !== "corroborated" ||
          change.inheritance !==
            (event.target.routeAlias === "beta-1" ? "cumulative" : "delta") ||
          /seed-identity|testflight-build|build-identity|community-observation/i.test(
            change.key,
          ),
      ),
  )
) {
  throw new Error("The expected iOS 10 prerelease bundle closure failed.");
}

const expectedCounts = new Map([
  ["beta-1", 30],
  ["beta-3", 37],
]);
for (const event of events) {
  if (event.changes.length !== expectedCounts.get(event.target.routeAlias)) {
    throw new Error(
      `Unexpected ${event.target.routeAlias} change count: ${event.changes.length}.`,
    );
  }
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
      `iOS 10 prerelease change definition drifted for ${occurrence.key}.`,
    );
  }
  localChangeDefinitions.set(occurrence.key, definition);
}
const uniqueLocalChangeKeys = [...localChangeDefinitions.keys()];
if (uniqueLocalChangeKeys.length !== 67) {
  throw new Error(
    `Expected 67 stable iOS 10 prerelease definitions; found ${uniqueLocalChangeKeys.length}.`,
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
    `iOS 10 prerelease change keys collide with existing content: ${collisions
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
      `| iOS | ${routeMetadata[event.target.routeAlias].label} | \`${event.target.routeAlias}\` | ${event.changes.length} |`,
  )
  .join("\n");
const sourceLedger = sources
  .map(
    (source) =>
      `- [${source.title}](${source.url}) — ${source.publisher}; ${source.sourceClass}.`,
  )
  .join("\n");

const md = `# Apple iOS 10 prerelease archive batch

## Result

\`${outputName}\` is the reviewed overlay for two existing iOS 10.0 routes:
Beta 1 and Beta 3.

- ${events.length} substantive event overlays and no release-version overlays
- ${changeCount} milestone-specific change occurrences across
  ${uniqueLocalChangeKeys.length} stable, collision-checked definitions
- ${sources.length} declared and used sources with ${citationCount} citation
  references
- zero builds, build-number claims, route creation, GM changes, Public-route
  changes, community-observation changes, or administrative identity changes
- both events are \`editoriallyVerified\`, approved at \`${reviewedAt}\`, and
  \`isIndexable: true\`

## Reviewed route closure

| Platform | Milestone | Existing alias | Selected changes |
| --- | --- | --- | ---: |
${routeRows}

The local iOS 10.0 seed contains ten milestones. Beta 2, Beta 4 through Beta 8,
GM, and Public remain outside this prerelease batch.

## Evidence method

1. Internet Archive preserves a complete Apple-authored PDF titled “iOS SDK
   Release Notes for iOS 10 Beta.” Its introduction identifies iOS SDK 10.0
   beta 1, its PDF page tree contains ${verification.beta1PhysicalPages}
   physical pages, and its numbered document body runs through page 18. All
   ${verification.beta1LocatorAssertions} selected page-and-component locators
   were checked against the PDF.
2. A WWDC link ledger created on June 14, 2016 independently identifies the
   original Apple CDN path
   \`WWDC_2016/iOS_10_beta/iOS_10_beta_Release_Notes.pdf\`. It is used only
   for artifact identity and timing. The GitHub Gist API supplies the exact
   creation timestamp, and its raw payload reproduces the ledger hash below.
3. Scribd exposes a complete bot-readable transcript titled “iOS 10 Beta 3 -
   Release Notes.” The body identifies iOS SDK 10.0 beta 3, runs through
   document page 15, and retains the exact “Fixed in this Release” section at
   normalized lines ${verification.beta3FixedStartLine}–${verification.beta3FixedEndLine}. All
   ${verification.beta3LocatorAssertions} fixed records were reconciled to their
   component groups and locators.
4. A contemporaneous July 19 AEST Whirlpool post links a Dropbox file named
   \`iOS 10 beta 3 Release Notes.pdf\`. The raw archived page retains post 355,
   author \`NeonVoid777\`, the exact encoded filename, and its
   2016-07-18T18:24:54Z timestamp. It is used only to corroborate the document
   identity and timing.
5. Beta 1 is treated as a first-document baseline. Beta 3 selection is limited
   to the explicit fixed section on pages 4–6. Generic cumulative notes,
   community observations, and unsupported builds are excluded.

## Selected findings

The Beta 1 baseline covers 30 documented availability constraints, features,
developer-facing behavior changes, compatibility boundaries, and known issues.
The Beta 3 delta covers all 37 independently checked records beneath Apple’s
fixed-section heading, spanning commerce, peripherals, audio, CarPlay, backup,
Messages, telephony, Photos, privacy, Siri, SiriKit, and UIKit.

These pages are structured historical indexes of Apple’s developer-facing
records. They do not claim to exhaust every user-visible change in either build.

## Raw and mirror audit ledger

| State | Publication or access | Title | Count | SHA-256 | Use |
| --- | --- | --- | ---: | --- | --- |
| Preserved Beta 1 PDF bytes | Beta 1, 2016-06-13 | iOS SDK Release Notes for iOS 10 Beta | ${verification.beta1PdfBytes.toLocaleString("en-US")} bytes; ${verification.beta1PhysicalPages} physical PDF pages; numbered body through page 18 | \`bb57b2b8b876cc40fd1874d5f1ae085f885fc776da3906da91604bbdfbc8b46e\` | Exact Beta 1 evidence |
| Internet Archive Beta 1 text derivative | accessed ${accessedAt} | iOS SDK Release Notes for iOS 10 Beta | ${verification.beta1OcrBytes.toLocaleString("en-US")} bytes; ${verification.beta1OcrBullets} OCR bullet records; ${verification.beta1LocatorAssertions} selected | \`62ff46f46e197f5dd00a34afa611aee2da9bf8c5d5d66b9e2eb1ea024305feb1\` | Independent text-level audit of PDF |
| WWDC link-ledger API raw text | created 2016-06-14 14:13:28Z | All the Apple Developer links you need from WWDC16 | 1 exact \`WWDC_2016/iOS_10_beta/iOS_10_beta_Release_Notes.pdf\` path | \`e7b5aac7bf7aed153a580579e8618b3208a45bafc31c4107b24cf2b1929cef70\` | Beta 1 identity corroboration |
| Normalized Beta 3 transcript text | accessed ${accessedAt} | iOS SDK Release Notes for iOS 10 beta 3 | ${verification.beta3TranscriptBytes.toLocaleString("en-US")} bytes; fixed boundary lines ${verification.beta3FixedStartLine}–${verification.beta3FixedEndLine}; ${verification.beta3LocatorAssertions} records | \`b20309f0c6eb719b6a3d2d16ed97a2bcc0c49979badbbcea3049a794a94233e0\` | Exact Beta 3 transcript and component audit |
| Contemporaneous Beta 3 context page | post 355 by NeonVoid777 at 2016-07-18 18:24:54Z | iOS 10 General Discussion | 1 encoded exact \`iOS 10 beta 3 Release Notes.pdf\` filename link | \`9227aa89f9e1e56d882ad2789acede823ac2cf9617c56862be5f647bbc19e8a5\` | Beta 3 identity corroboration |
| Current Apple final archive HTML | accessed ${accessedAt} | iOS 10.0 Release Notes | 22 rendered headings; updated 2016-09-13 | \`b080c29354c91ffad187a1a2780cbf21238b1957e69ae8dc3c2b3ec81fc1e0ab\` | Final-state boundary only |

The Internet Archive item metadata declares Apple as creator and records the
preserved PDF at ${verification.beta1PdfBytes.toLocaleString("en-US")} bytes, SHA-1
\`9c88e9686f0cc60e8b2862c80b43715a7bbff096\`, and MD5
\`06d58fd6e4cff4ea4126804bfa0feaf2\`. The SHA-256 above was independently
computed from the downloaded bytes.

The PDF metadata values and the independently downloaded byte count match. The
${verification.beta1OcrBytes.toLocaleString("en-US")}-byte OCR derivative contains
${verification.beta1OcrBullets} parsed bullet records. Every one of the
${verification.beta1LocatorAssertions} selected Beta 1 occurrences was checked against
both its physical page and component heading.

The Scribd response contains a bot-readable transcription rather than the
original PDF bytes. Its HTML metadata reports 16 host pages while Apple’s
document footers and body run through page 15; this ledger uses the document
count and records that host-container discrepancy explicitly. Scribd’s
surrounding HTML changes between requests, so the transcript hash covers
${verification.beta3TranscriptBytes.toLocaleString("en-US")} bytes of normalized text
from the document title through the \`Page 15 of 15\` footer, after decoding HTML
entities, converting document line breaks, removing tags, trimming lines, and
joining them with LF. Two independent fetches produced the same normalized hash
while their raw HTML hashes differed. No claim is made that the mirror preserves
Apple’s original PDF byte sequence.

The fixed-section boundary is exact at normalized lines ${verification.beta3FixedStartLine}–${verification.beta3FixedEndLine}.
Its component groups contain 37 records in total: App Store 1, Apple Pay 1,
Apple Pencil 1, Audio 1, Binary Compatibility 1, CarPlay 2, CoreImage 1,
Exchange 1, iBooks 1, iCloud Backup and Restore 1, Keyboards 1, Lock Screen 1,
Messages 8, Music 1, Notes 1, Phone 6, Photos 1, Privacy 1, Siri 2, SiriKit 3,
and UIKit 1. All ${verification.beta3LocatorAssertions} selected Beta 3
occurrences reconcile to those groups and exact locators.

## Exact evidence gaps

- No complete, publicly inspectable Apple-authored milestone document was
  retained in this audit for Beta 2, Beta 4, Beta 5, Beta 6, Beta 7, Beta 8,
  or GM. Those routes remain timeline-only.
- Public is already owned by \`apple-ios-10.json\` and is untouched.
- Apple’s prerelease documentation root resolves only to a later archived
  final state. The Wayback CDX index returned no usable 2016 capture for the
  exact prerelease root or article.
- No complete first-party build-number set was independently retained. This
  batch creates no build documents and makes no build assertion.
- Beta 1 has no earlier state against which to compute a diff. Its entries are
  explicitly labeled a first-document baseline.
- Beta 3 generic known issues and functionality exclusions may be cumulative.
  Only the exact fixed section is attached to that route.
- Both Apple-authored prerelease artifacts survive through third-party mirrors.
  Their occurrences remain explicitly marked as corroborated and preserve the
  mirror provenance after editorial approval.

## Source ledger

All declared sources were accessed on ${accessedAt}.

${sourceLedger}

## Closure guards

- Exact comparison against the local iOS 10.0 seed record and all ten milestones
- Exact two-route allowlist with explicit exclusion of Public and every
  unsupported prerelease route
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

The generator's seed, route, collision, review-state, evidence-boundary, source,
and citation guards pass before either artifact is written.

Independent editorial and evidence review:

- both event articles and all ${changeCount} occurrences are
  \`editoriallyVerified\`, were approved at \`${reviewedAt}\`, and are indexable
- the exact ${verification.beta1PdfBytes.toLocaleString("en-US")}-byte Beta 1
  PDF reproduced SHA-256
  \`bb57b2b8b876cc40fd1874d5f1ae085f885fc776da3906da91604bbdfbc8b46e\`;
  its ${verification.beta1PhysicalPages}-page tree and Internet Archive SHA-1
  and MD5 metadata match
- the ${verification.beta1OcrBytes.toLocaleString("en-US")}-byte OCR artifact
  reproduced SHA-256
  \`62ff46f46e197f5dd00a34afa611aee2da9bf8c5d5d66b9e2eb1ea024305feb1\`
  and all ${verification.beta1LocatorAssertions} selected Beta 1
  page-and-component locators passed
- the Gist API preserves the exact 2016-06-14T14:13:28Z timestamp and Apple PDF
  path; its raw payload reproduced SHA-256
  \`e7b5aac7bf7aed153a580579e8618b3208a45bafc31c4107b24cf2b1929cef70\`
- the ${verification.beta3TranscriptBytes.toLocaleString("en-US")}-byte
  normalized Beta 3 transcript reproduced SHA-256
  \`b20309f0c6eb719b6a3d2d16ed97a2bcc0c49979badbbcea3049a794a94233e0\`
  across raw-wrapper changes; its exact fixed boundary is lines
  ${verification.beta3FixedStartLine}–${verification.beta3FixedEndLine}, its
  component groups total ${verification.beta3LocatorAssertions} records, and
  all ${verification.beta3LocatorAssertions} locators reconciled
- the Whirlpool raw page reproduced SHA-256
  \`9227aa89f9e1e56d882ad2789acede823ac2cf9617c56862be5f647bbc19e8a5\`;
  post 355 by \`NeonVoid777\` retains the exact encoded PDF filename and
  2016-07-18T18:24:54Z timestamp
- Apple's final-state archive reproduced SHA-256
  \`b080c29354c91ffad187a1a2780cbf21238b1957e69ae8dc3c2b3ec81fc1e0ab\`
- the independent copyright scan found a maximum contiguous reader-facing
  overlap of ${verification.maximumEditorialOverlapWords} words

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

### First-document baseline correction

A focused production correction was reviewed at
\`${baselineCorrection.reviewedAt}\`. It relabeled all
${baselineCorrection.beta1InheritanceCorrections} Beta 1 occurrences from
\`delta\` to \`cumulative\`, matching the already-published explanation that
Beta 1 is the first retained document rather than a comparison with an earlier
state. It also replaced one shortened Beta 3 Notes locator with the exact
source wording. The audit proved that no reader-facing article text or release
fact changed.

- correction plan: \`${baselineCorrection.planSha}\`
- reviewed plan artifact SHA-256:
  \`${baselineCorrection.planArtifactSha}\`
- rollback artifact SHA-256:
  \`${baselineCorrection.rollbackArtifactSha}\`
- exact plan contents: ${baselineCorrection.creates} creates,
  ${baselineCorrection.patches} revision-guarded patches,
  ${baselineCorrection.unchanged.toLocaleString("en-US")} unchanged documents,
  and a
  ${baselineCorrection.mutationPayloadBytes.toLocaleString("en-US")}-byte
  mutation payload
- Sanity transaction: \`${baselineCorrection.transactionId}\`
- receipt SHA-256: \`${baselineCorrection.receiptSha}\`
- immediate zero-residual plan: \`${baselineCorrection.zeroPlanSha}\`;
  0 creates, 0 patches,
  ${baselineCorrection.zeroUnchanged.toLocaleString("en-US")} unchanged
  documents, and a ${baselineCorrection.zeroPayloadBytes}-byte payload
- zero-plan artifact SHA-256:
  \`${baselineCorrection.zeroPlanArtifactSha}\`
- zero-plan rollback artifact SHA-256:
  \`${baselineCorrection.zeroRollbackArtifactSha}\`
- post-correction coverage:
  ${baselineCorrection.coverage.fullVersions} of
  ${baselineCorrection.coverage.totalVersions} full versions and
  ${baselineCorrection.coverage.fullAppearances} full,
  ${baselineCorrection.coverage.sourceLinkedAppearances} source-linked, and
  ${baselineCorrection.coverage.timelineOnlyAppearances.toLocaleString("en-US")}
  timeline-only appearances; ${baselineCorrection.coverage.approvedStructuredAppearances}
  appearances have approved structured changes

## Settled canonical route verification

Both published routes were fetched independently from the running local site.
Each response returned the full archival article, structured change index,
References, and its primary source. Neither response returned placeholder copy
or a \`noindex\` directive.

| Canonical route | HTTP | Full article | Changes | References | Primary source | Placeholder | Noindex |
| --------------- | ---: | ------------ | ------- | ---------- | -------------- | ----------- | ------- |
| \`/apple/ios/10.0/beta-1/\` | 200 | yes | yes | yes | yes | no | no |
| \`/apple/ios/10.0/beta-3/\` | 200 | yes | yes | yes | yes | no | no |

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
- all ${verification.beta1LocatorAssertions} Beta 1 page-and-component checks
  and ${verification.beta3LocatorAssertions} Beta 3 fixed-section locator
  reconciliations passed
- independent copyright-similarity scan: maximum contiguous overlap of
  ${verification.maximumEditorialOverlapWords} words
- ESLint, Prettier check, and focused \`git diff --check\`: passed
- deterministic regeneration: the formatted JSON SHA-256 remained
  \`${jsonSha}\`
- final production dry run after the baseline correction reproduced 0 creates,
  0 patches,
  ${baselineCorrection.zeroUnchanged.toLocaleString("en-US")} unchanged
  documents, the ${baselineCorrection.zeroPayloadBytes}-byte payload, and plan
  SHA \`${baselineCorrection.zeroPlanSha}\`
- the final planner reported “No Sanity data changed”

Reproduce with:

\`\`\`sh
node scripts/research-batches/build-apple-ios-10-prerelease.mjs
npm run research:validate
node --import tsx --test tests/launch-content-ingestion.test.ts tests/launch-content-manifest.test.ts
npx eslint scripts/research-batches/build-apple-ios-10-prerelease.mjs
npx prettier --check scripts/research-batches/build-apple-ios-10-prerelease.mjs scripts/research-batches/apple-ios-10-prerelease.json scripts/research-batches/apple-ios-10-prerelease.md
npx sanity exec scripts/ingest-launch-content.ts --with-user-token -- --content scripts/research-batches/apple-ios-10-prerelease.json
\`\`\`

The final command is intentionally a post-publication dry run and must
reproduce the zero plan above. Do not add \`--apply\`.
`;

const formattedMd = await prettier.format(md, { filepath: ledgerName });
writeFileSync(join(here, ledgerName), formattedMd);
