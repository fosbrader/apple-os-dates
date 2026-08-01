import { createHash } from "node:crypto";
import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import prettier from "prettier";

const here = dirname(fileURLToPath(import.meta.url));
const outputName = "apple-ios-8-prerelease.json";
const ledgerName = "apple-ios-8-prerelease.md";
const accessedAt = "2026-07-30";
const reviewedAt = "2026-07-30T10:48:59Z";

const dryRun = {
  creates: 196,
  patches: 6,
  unchanged: 2076,
  sourceCreates: 6,
  changeCreates: 190,
  mutationPayloadBytes: 516_404,
  planSha: "5d699b661bf24885e037c16b325612f8ed8a913066f6d5c76b0e58f6092eb630",
  planArtifactSha:
    "ebe2208d5f68b3ab401da9ce8b78039be7b33f6c607a3f8f74f48b817b1d61f3",
  rollbackArtifactSha:
    "8a4788a22ba26767f76547851a97a05ce0bd409b0e3840d14854b5693a091fa2",
};

const publication = {
  transactionId: "tt1fSB5HY9GAB0YLyymd4F",
  receiptSha:
    "45b4c4e1e3ddc26342e4d8001ace13b08bb16ac2ffe25a38678a87885be68ff7",
  immediateZeroPlanSha:
    "5fbc99d019de969c277f1ebe16570ee3ca73e09fc2fd22ed94aa849fd9c0487f",
  immediateZeroPlanArtifactSha:
    "0367a9e2e2c1717cb2e902e634ec50f8ab5533b17c8bbcf265c4ed667e610802",
  immediateZeroRollbackArtifactSha:
    "87d4f54d9b88e4ce12936076973bd0d0f2a4f3df0546724a48c746fd655c5d6b",
  immediateZeroCreates: 0,
  immediateZeroPatches: 0,
  immediateZeroUnchanged: 2278,
  immediateZeroPayloadBytes: 16,
  coverage: {
    totalVersions: 410,
    fullVersions: 410,
    totalAppearances: 1979,
    fullAppearances: 419,
    sourceLinkedAppearances: 256,
    timelineOnlyAppearances: 1304,
    approvedStructuredAppearances: 570,
  },
};

const U = {
  beta1:
    "https://web.archive.org/web/20140603004241id_/https://developer.apple.com/library/prerelease/ios/releasenotes/General/RN-iOSSDK-8.0/index.html",
  beta2:
    "https://web.archive.org/web/20140625110018id_/https://developer.apple.com/library/prerelease/ios/releasenotes/General/RN-iOSSDK-8.0/index.html",
  beta3: "https://bjtechnews.org/2014/07/ios-8-beta-3-release-notes/",
  beta3Archive:
    "https://web.archive.org/web/20190723175022id_/https://bjtechnews.org/2014/07/ios-8-beta-3-release-notes/",
  beta4: "https://www.idevice.ro/2014/07/21/ios-8-beta-4-changelog/",
  beta4Archive:
    "https://web.archive.org/web/20140722191651id_/http://www.idevice.ro:80/2014/07/21/ios-8-beta-4-changelog/",
  beta5:
    "https://www.iphonemod.net/wp-content/uploads/2014/08/iOS-8-Beta-5-Release-Notes.pdf",
  beta5Archive:
    "https://web.archive.org/web/20240607031344id_/https://www.iphonemod.net/wp-content/uploads/2014/08/iOS-8-Beta-5-Release-Notes.pdf",
  gm: "https://web.archive.org/web/20140910201412id_/https://developer.apple.com/library/prerelease/ios/releasenotes/General/RN-iOSSDK-8.0/",
};

const sources = [
  {
    url: U.beta1,
    title: "iOS SDK Release Notes for iOS 8.0 Beta",
    publisher: "Apple Developer document preserved by Internet Archive",
    sourceClass: "archive",
    author: "Apple",
    publishedAt: "2014-06-02T00:00:00.000Z",
    topics: [
      "iOS",
      "8.0",
      "Beta 1",
      "Apple Developer release notes",
      "historical first-party capture",
    ],
  },
  {
    url: U.beta2,
    title: "iOS SDK Release Notes for iOS 8.0 Beta 2",
    publisher: "Apple Developer document preserved by Internet Archive",
    sourceClass: "archive",
    author: "Apple",
    publishedAt: "2014-06-16T00:00:00.000Z",
    topics: [
      "iOS",
      "8.0",
      "Beta 2",
      "Apple Developer release notes",
      "historical first-party capture",
    ],
  },
  {
    url: U.beta3,
    archiveUrl: U.beta3Archive,
    title: "iOS 8 Beta 3 Release Notes (Apple-authored transcript)",
    publisher: "Apple Developer notes preserved by BTNHD",
    sourceClass: "archive",
    author: "Apple",
    publishedAt: "2014-07-09T00:00:00.000Z",
    topics: [
      "iOS",
      "8.0",
      "Beta 3",
      "Apple Developer release notes",
      "historical transcript",
    ],
  },
  {
    url: U.beta4,
    archiveUrl: U.beta4Archive,
    title: "iOS 8 Beta 4 changelog (Apple-authored transcript)",
    publisher: "Apple Developer notes preserved by iDevice.ro",
    sourceClass: "archive",
    author: "Apple",
    publishedAt: "2014-07-21T17:13:04.000Z",
    topics: [
      "iOS",
      "8.0",
      "Beta 4",
      "Apple Developer release notes",
      "next-day historical capture",
    ],
  },
  {
    url: U.beta5,
    archiveUrl: U.beta5Archive,
    title: "iOS SDK Release Notes for iOS 8.0 Beta 5",
    publisher: "Apple Developer document mirrored by iPhoneMod",
    sourceClass: "archive",
    author: "Apple",
    publishedAt: "2014-08-03T00:00:00.000Z",
    topics: [
      "iOS",
      "8.0",
      "Beta 5",
      "Apple Developer release notes",
      "historical PDF mirror",
    ],
  },
  {
    url: U.gm,
    title: "iOS SDK Release Notes for iOS 8.0 GM Seed",
    publisher: "Apple Developer document preserved by Internet Archive",
    sourceClass: "archive",
    author: "Apple",
    publishedAt: "2014-09-09T00:00:00.000Z",
    topics: [
      "iOS",
      "8.0",
      "GM",
      "Apple Developer release notes",
      "historical first-party capture",
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
  status,
  marker,
) => ({
  key,
  title,
  canonicalSummary,
  category,
  action,
  component,
  status,
  marker,
});

const fixed = (
  alias,
  key,
  title,
  canonicalSummary,
  component,
  marker,
  category = "bugFix",
) =>
  record(
    `ios-8-0-${alias}-${key}`,
    title,
    canonicalSummary,
    category,
    "fixed",
    component,
    alias === "gm" ? "Fixed in GM Seed" : `Fixed in beta ${alias.slice(4)}`,
    marker,
  );

const baseline = (
  key,
  title,
  canonicalSummary,
  category,
  action,
  component,
  status,
  marker,
) =>
  record(
    `ios-8-0-beta1-${key}`,
    title,
    canonicalSummary,
    category,
    action,
    component,
    status,
    marker,
  );

const beta1Changes = [
  baseline(
    "contacts-private-picker",
    "Contacts gained a privacy-preserving picker",
    "Applications could receive a temporary selected contact without first obtaining access to the user’s full address book.",
    "developerApi",
    "introduced",
    "Contacts",
    "Note",
    "new people-picker mode",
  ),
  baseline(
    "contacts-picker-migration",
    "The legacy contacts picker entered migration",
    "The first seed let developers choose the old or new people-picker mode while warning that the old path would be deprecated during the beta cycle.",
    "compatibility",
    "changed",
    "Contacts",
    "Note",
    "old mode will be deprecated",
  ),
  baseline(
    "document-picker-entitlement",
    "Document pickers required an iCloud entitlement",
    "Applications needed the iCloud documents entitlement before participating as a document provider.",
    "developerApi",
    "introduced",
    "File Providers",
    "Note",
    "iCloud documents entitlement",
  ),
  baseline(
    "container-layout",
    "Application container paths changed",
    "Developers were directed to system directory APIs because iOS 8 changed the on-disk layout of application containers.",
    "compatibility",
    "changed",
    "File System",
    "Note",
    "app-container layout",
  ),
  baseline(
    "find-my-friends-account",
    "Find My Friends followed the iCloud account",
    "After location sharing moved into Messages, Find My Friends supported only the Apple ID selected for iCloud.",
    "behavior",
    "changed",
    "Find My Friends",
    "Note",
    "Share My Location account",
  ),
  baseline(
    "icloud-beta-copy",
    "Existing iCloud documents entered beta containers",
    "Upgrading copied locally retained iCloud Documents and Data into separate server-side containers for the prerelease period.",
    "behavior",
    "changed",
    "iCloud",
    "Notes",
    "beta container copy",
  ),
  baseline(
    "icloud-cross-version-isolation",
    "Beta iCloud documents stopped syncing with older systems",
    "Prerelease cloud documents synchronized only among devices on Apple’s new mobile and desktop developer seeds.",
    "compatibility",
    "changed",
    "iCloud",
    "Notes",
    "only sync with devices running iOS 8",
  ),
  baseline(
    "icloud-beta-data-wipe",
    "Beta iCloud data carried a server-wipe warning",
    "Apple warned that prerelease Documents and Data would be removed from its servers during the beta, with retained local copies later resynchronizing.",
    "behavior",
    "knownIssue",
    "iCloud",
    "Notes",
    "server-side beta data deletion",
  ),
  baseline(
    "icloud-management-visibility",
    "iCloud management hid prerelease data",
    "The storage-management interface showed legacy-system documents but not the separate iOS 8 and Yosemite preview data.",
    "knownIssue",
    "knownIssue",
    "iCloud",
    "Notes",
    "management UI visibility",
  ),
  baseline(
    "photos-itunes-media",
    "iTunes-synced media stayed outside iCloud Photo Library",
    "Turning on iCloud Photo Library did not upload photographs or videos that had arrived through iTunes synchronization.",
    "compatibility",
    "changed",
    "Photos",
    "Notes",
    "iTunes-synced media exclusion",
  ),
  baseline(
    "photosui-background-callbacks",
    "Photo-editing callbacks could arrive off the main thread",
    "Photo editing extensions had to tolerate PHContentEditingController protocol calls on background threads.",
    "developerApi",
    "changed",
    "PhotosUI",
    "Note",
    "PHContentEditingController threading",
  ),
  baseline(
    "uilabel-clipping-default",
    "UILabel clipping defaulted on",
    "UILabel used a true clipsToBounds default in the first iOS 8 seed, unlike the false default inherited by ordinary UIViews.",
    "developerApi",
    "changed",
    "UIKit",
    "Note",
    "clipsToBounds default",
  ),
  baseline(
    "webkit-subpixel-rendering",
    "Web content adopted subpixel rendering",
    "Safari and embedded web views rendered page geometry with subpixel precision by default.",
    "behavior",
    "changed",
    "WebKit",
    "Note",
    "subpixel rendering",
  ),
  baseline(
    "extension-openurl",
    "Extensions could not open URLs",
    "The initial extension runtime did not support opening a URL from an extension.",
    "knownIssue",
    "knownIssue",
    "Extensions",
    "Known Issues",
    "openURL",
  ),
  baseline(
    "extension-ui-relaunch",
    "Terminated extension interfaces could relaunch",
    "An extension with a user interface could restart instead of dismissing after the extension process was killed.",
    "knownIssue",
    "knownIssue",
    "Extensions",
    "Known Issues",
    "killed UI extension relaunch",
  ),
  baseline(
    "sharing-enabled-default",
    "Sharing extensions appeared enabled by default",
    "New sharing extensions could start in an enabled state without a user explicitly turning them on.",
    "knownIssue",
    "knownIssue",
    "Extensions",
    "Known Issues",
    "sharing-extension default",
  ),
  baseline(
    "sharing-project-name",
    "Sharing extensions could show a project name",
    "The sharing interface could display the containing project’s name instead of the extension target’s intended name.",
    "knownIssue",
    "knownIssue",
    "Extensions",
    "Known Issues",
    "project name in sharing UI",
  ),
  baseline(
    "extension-debug-timeout",
    "Debugged extensions could time out",
    "Extension processes could exceed their launch window before a debugger-attached session finished loading.",
    "knownIssue",
    "knownIssue",
    "Extensions",
    "Known Issues",
    "debug-session timeout",
  ),
  baseline(
    "handoff-document-apps",
    "Document-based Handoff was unreliable",
    "Applications built around documents could not complete Handoff correctly in the first seed.",
    "knownIssue",
    "knownIssue",
    "Handoff",
    "Known Issues",
    "document-based applications",
  ),
  baseline(
    "handoff-device-pairing",
    "Handoff pairing could omit account devices",
    "Some devices on the same Apple ID failed to pair, disabling Handoff, call relay, and tethering for those devices.",
    "knownIssue",
    "knownIssue",
    "Handoff",
    "Known Issues",
    "Apple ID device pairing",
  ),
  baseline(
    "handoff-stale-safari-url",
    "Safari Handoff could resume an older page",
    "Continuing a Safari activity on another device could open a stale URL instead of the currently viewed page.",
    "knownIssue",
    "knownIssue",
    "Handoff",
    "Known Issues",
    "stale Safari URL",
  ),
  baseline(
    "handoff-call-relay-audio",
    "Mac call relay could lose completion or audio",
    "Relayed iPhone calls involving a Mac could fail to connect or carry audio.",
    "knownIssue",
    "knownIssue",
    "Handoff",
    "Known Issues",
    "Mac phone-call relay",
  ),
  baseline(
    "healthkit-correlation-query",
    "Health correlation queries omitted standalone entries",
    "HKCorrelationQuery returned only values already stored inside correlations instead of every matching health entry.",
    "knownIssue",
    "knownIssue",
    "HealthKit",
    "Known Issues",
    "HKCorrelationQuery coverage",
  ),
  baseline(
    "healthkit-blood-pressure-correlation",
    "Blood-pressure components lacked a saved correlation",
    "Health did not preserve the relationship between systolic and diastolic values when storing a blood-pressure reading.",
    "knownIssue",
    "knownIssue",
    "HealthKit",
    "Known Issues",
    "blood-pressure correlation",
  ),
  baseline(
    "homekit-bluetooth",
    "HomeKit Bluetooth LE support was unavailable",
    "Bluetooth Low Energy transport for HomeKit accessories was not enabled in the first developer seed.",
    "knownIssue",
    "knownIssue",
    "HomeKit",
    "Known Issues",
    "Bluetooth LE support",
  ),
  baseline(
    "homekit-siri-refresh",
    "Siri could lag behind HomeKit changes",
    "Siri did not always recognize recent edits to HomeKit configuration data.",
    "knownIssue",
    "knownIssue",
    "HomeKit",
    "Known Issues",
    "Siri data refresh",
  ),
  baseline(
    "homekit-bridge-capacity",
    "HomeKit bridges had a five-service ceiling",
    "A bridge accessory could expose only five services in total across everything connected through it.",
    "knownIssue",
    "knownIssue",
    "HomeKit",
    "Known Issues",
    "bridge service limit",
  ),
  baseline(
    "keyboard-network-access",
    "Third-party keyboards lacked network access",
    "Custom keyboards remained offline even when their property list requested open network access.",
    "knownIssue",
    "knownIssue",
    "Keyboards",
    "Known Issues",
    "RequestsOpenAccess",
  ),
  baseline(
    "keyboard-supplementary-lexicon",
    "Custom keyboards received no supplementary lexicon",
    "The supplementary-lexicon request API returned no entries to keyboard extensions.",
    "knownIssue",
    "knownIssue",
    "Keyboards",
    "Known Issues",
    "supplementary lexicon",
  ),
  baseline(
    "photos-recently-deleted-sync",
    "Recently Deleted removals did not propagate",
    "Permanently removing an item from Recently Deleted on one device did not synchronize that deletion to others.",
    "knownIssue",
    "knownIssue",
    "Photos",
    "Known Issues",
    "Recently Deleted synchronization",
  ),
];

const beta2Changes = [
  fixed(
    "beta2",
    "app-store-developer-links",
    "App Store developer links recovered",
    "Developer-site links on application product pages opened correctly again.",
    "App Store",
    "developer website links",
  ),
  fixed(
    "beta2",
    "restored-app-launch",
    "Restored applications stopped crashing at launch",
    "Applications transferred through a device backup no longer entered a repeatable startup crash.",
    "Backup",
    "restore-from-backup launch",
  ),
  fixed(
    "beta2",
    "camera-connector-import",
    "Camera Connector imports returned",
    "An attached camera connector once again appeared as an available import source.",
    "Camera Connector",
    "import option",
  ),
  fixed(
    "beta2",
    "carplay-siri-sample-rate",
    "CarPlay preserved audio quality after Siri",
    "Finishing a Siri interaction no longer forced CarPlay audio to remain at a 24 kHz sample rate.",
    "CarPlay",
    "post-Siri audio quality",
  ),
  fixed(
    "beta2",
    "carplay-now-playing-back",
    "CarPlay’s Now Playing back action stabilized",
    "Using Back from the CarPlay Now Playing screen stopped crashing the interface.",
    "CarPlay",
    "Now Playing Back button",
  ),
  fixed(
    "beta2",
    "document-provider-discovery",
    "Document providers appeared without a restart",
    "Installing or updating a document provider made it available without requiring a device reboot.",
    "Document Providers",
    "provider discovery after install",
  ),
  fixed(
    "beta2",
    "document-provider-sandbox",
    "First document imports cleared the sandbox",
    "The first open or import attempt through a document provider no longer failed with a sandbox denial.",
    "Document Providers",
    "first import sandbox denial",
  ),
  fixed(
    "beta2",
    "extension-debug-timeout",
    "Extension debugging gained a usable launch window",
    "Debugged extensions stopped timing out before their code could load.",
    "Extensions",
    "debug-session timeout",
  ),
  fixed(
    "beta2",
    "action-extension-fullscreen",
    "Action extensions gained full-screen presentation",
    "Action-extension view controllers could present their interface across the full screen.",
    "Extensions",
    "full-screen presentation",
  ),
  fixed(
    "beta2",
    "action-extension-dismissal",
    "Action-extension dismissal animations smoothed out",
    "Closing an action extension no longer produced the documented uneven transition.",
    "Extensions",
    "do not animate smoothly when dismissed",
  ),
  fixed(
    "beta2",
    "extension-openurl",
    "Extensions regained URL opening",
    "The extension environment could invoke URL-opening behavior.",
    "Extensions",
    "openURL",
  ),
  fixed(
    "beta2",
    "extension-enable-state",
    "Extension enablement changes propagated",
    "Sharing and action extensions refreshed reliably after users enabled or disabled them.",
    "Extensions",
    "not updated properly after enabling or disabling",
  ),
  fixed(
    "beta2",
    "extension-item-sharing",
    "Extension items worked with activity controllers",
    "UIActivityViewController accepted NSExtensionItem and NSItemProvider objects.",
    "Extensions",
    "UIActivityViewController item providers",
    "developerApi",
  ),
  fixed(
    "beta2",
    "family-store-spinner",
    "Family Sharing purchases stopped spinning indefinitely",
    "The iTunes Store no longer became stuck on an endless loading indicator during family use.",
    "Family Sharing",
    "iTunes Store spinner",
  ),
  fixed(
    "beta2",
    "family-icloud-login",
    "Family Sharing iCloud sign-in sped up",
    "Signing into iCloud for family features no longer suffered the documented delay.",
    "Family Sharing",
    "slow iCloud login",
  ),
  fixed(
    "beta2",
    "family-purchase-history",
    "Shared purchase history reopened",
    "Family purchase-history pages became available again in the iOS and Mac App Stores.",
    "Family Sharing",
    "shared purchase history",
  ),
  fixed(
    "beta2",
    "family-ask-to-buy",
    "Ask to Buy approvals worked on the requester’s device",
    "A purchase request could be approved from the same iOS device used by the family member requesting it.",
    "Family Sharing",
    "requester-device approval",
  ),
  fixed(
    "beta2",
    "find-my-iphone-setup",
    "Find My iPhone setup respected location choices",
    "Declining the location-services prompt no longer left Find My iPhone disabled unexpectedly during setup.",
    "Find My iPhone",
    "Setup Assistant location prompt",
  ),
  fixed(
    "beta2",
    "find-my-iphone-lost-mode",
    "Lost Mode reached locked iPads",
    "An iPad already on its lock screen could enter Lost Mode when commanded from iCloud.com.",
    "Find My iPhone",
    "locked-iPad Lost Mode",
  ),
  fixed(
    "beta2",
    "game-center-menu-crash",
    "Game Center menus stopped crashing",
    "Navigating selected Game Center menus no longer terminated the application.",
    "Game Center",
    "menu interaction crash",
  ),
  fixed(
    "beta2",
    "game-center-sections",
    "Game Center opened the requested section",
    "Achievements and Challenges controls stopped redirecting users to Leaderboards.",
    "Game Center",
    "Achievements and Challenges routing",
  ),
  fixed(
    "beta2",
    "game-center-cross-device-notifications",
    "Game Center notifications reached a second device",
    "Account notifications propagated to another signed-in device.",
    "Game Center",
    "second-device notifications",
  ),
  fixed(
    "beta2",
    "game-center-repeat-invites",
    "Repeated matchmaking invites stopped crashing",
    "Sending multiple matchmaking invitations no longer terminated GameCenterUIService.",
    "Game Center",
    "repeated matchmaking invitations",
  ),
  fixed(
    "beta2",
    "handoff-bluetooth-reliability",
    "Handoff Bluetooth sessions recovered",
    "Attempting Handoff no longer left the underlying cross-device Bluetooth connection unusable.",
    "Handoff",
    "Bluetooth connection failure",
  ),
  fixed(
    "beta2",
    "handoff-document-apps",
    "Document-based Handoff began working",
    "Applications centered on documents could transfer activities through Handoff.",
    "Handoff",
    "document-based applications",
  ),
  fixed(
    "beta2",
    "handoff-device-pairing",
    "Account devices paired for Continuity services",
    "Devices on one Apple ID paired reliably enough to use Handoff, call relay, and tethering.",
    "Handoff",
    "Apple ID device pairing",
  ),
  fixed(
    "beta2",
    "handoff-app-identity",
    "Handoff displayed the originating application",
    "The lock screen and Mac Dock stopped labeling third-party Handoff activities as Safari.",
    "Handoff",
    "mistakenly show as Safari",
  ),
  fixed(
    "beta2",
    "handoff-maps-navigation",
    "Maps navigation transferred through Handoff",
    "Directions and active navigation became eligible for Handoff.",
    "Handoff",
    "Maps directions and navigation",
  ),
  fixed(
    "beta2",
    "handoff-safari-current-url",
    "Safari Handoff resumed the current page",
    "Continuing Safari on another device used the active URL instead of an older one.",
    "Handoff",
    "current Safari URL",
  ),
  fixed(
    "beta2",
    "healthkit-correlation-query",
    "HealthKit correlation queries returned matching entries",
    "HKCorrelationQuery included all predicate-matching data rather than only values saved inside correlations.",
    "HealthKit",
    "HKCorrelationQuery coverage",
    "developerApi",
  ),
  fixed(
    "beta2",
    "healthkit-blood-pressure-correlation",
    "HealthKit linked blood-pressure components",
    "Systolic and diastolic values saved from Health retained their shared blood-pressure correlation.",
    "HealthKit",
    "blood-pressure correlation",
  ),
  fixed(
    "beta2",
    "homekit-primary-property",
    "HomeKit clarified HMService primary behavior",
    "The HMService primary-property transition no longer remained as an unresolved framework issue.",
    "HomeKit",
    "HMService primary property",
    "developerApi",
  ),
  fixed(
    "beta2",
    "homekit-bridge-capacity",
    "HomeKit bridges moved beyond five services",
    "A bridge accessory was no longer limited to five services across all of its bridged accessories.",
    "HomeKit",
    "bridge service limit",
  ),
  fixed(
    "beta2",
    "homekit-siri-refresh",
    "Siri refreshed HomeKit data",
    "Siri recognized HomeKit configuration changes without the earlier delay.",
    "HomeKit",
    "Siri data refresh",
  ),
  fixed(
    "beta2",
    "homekit-simulator-pairing",
    "HomeKit simulator pairing worked on the first attempt",
    "Accessories supplied by the HomeKit Accessory Simulator paired without requiring a retry.",
    "HomeKit",
    "Accessory Simulator pairing",
  ),
  fixed(
    "beta2",
    "keychain-simulator-api",
    "Keychain developer APIs worked in Simulator",
    "Applications running in Simulator could use the Keychain Access programming interfaces.",
    "iCloud Keychain",
    "Keychain APIs in Simulator",
    "developerApi",
  ),
  fixed(
    "beta2",
    "itunes-radio-redirect",
    "iTunes Radio links stopped showing an upgrade page",
    "Opening a Radio URL from an iTunes Store music page no longer produced an obsolete iOS 7 upgrade prompt.",
    "iTunes Store",
    "Radio URL upgrade prompt",
  ),
  fixed(
    "beta2",
    "itunes-store-shelf",
    "The iTunes Store shelf appeared on first use",
    "The store rendered its shelf during the initial launch and sign-in.",
    "iTunes Store",
    "first-launch shelf",
  ),
  fixed(
    "beta2",
    "keyboard-redeployment",
    "Keyboard redeployment stopped blanking the system keyboard",
    "Repeatedly installing a third-party keyboard no longer corrupted or erased the system keyboard view.",
    "Keyboards",
    "third-party keyboard multiple times",
  ),
  fixed(
    "beta2",
    "keyboard-network-access",
    "Custom keyboards gained requested network access",
    "A keyboard that opted into open access could reach the network.",
    "Keyboards",
    "RequestsOpenAccess",
  ),
  fixed(
    "beta2",
    "visit-monitoring-indicator",
    "Denied visit monitoring stopped looking active",
    "Applications denied location access no longer appeared to continue visit monitoring.",
    "Location Services",
    "denied-authorization indicator",
  ),
  fixed(
    "beta2",
    "visit-monitoring-uninstall",
    "Uninstalling an app ended visit monitoring",
    "Removing an application also stopped the visit-monitoring session it had registered.",
    "Location Services",
    "app is uninstalled while it is monitoring",
  ),
  fixed(
    "beta2",
    "lock-screen-app-location-permission",
    "Lock-screen recommendations honored App Store location access",
    "Location-based application suggestions respected whether the App Store could use Location Services.",
    "Location Services",
    "App Store authorization",
  ),
  fixed(
    "beta2",
    "clvisit-readonly-properties",
    "CLVisit coordinates became read-only",
    "The coordinate and horizontal-accuracy properties exposed the intended immutable API contract.",
    "Location Services",
    "CLVisit property mutability",
    "developerApi",
  ),
  fixed(
    "beta2",
    "mail-suggestion-contact",
    "Mail contact suggestions stopped hanging iPad",
    "Adding a person from Mail’s suggestion banner no longer froze the application on iPad.",
    "Mail",
    "Suggestion Banner contact",
  ),
  fixed(
    "beta2",
    "maps-points-of-interest",
    "Maps Points of Interest stopped hanging",
    "Opening Points of Interest on iPad no longer froze Maps.",
    "MapKit",
    "Points of Interest",
  ),
  fixed(
    "beta2",
    "mkmapitem-null-url",
    "MKMapItem returned nil for a missing URL",
    "A map item without a URL stopped manufacturing an invalid http-null string.",
    "MapKit",
    "MKMapItem URL nullability",
    "developerApi",
  ),
  fixed(
    "beta2",
    "volume-settings-alert",
    "The media volume alert restored its controls",
    "MPVolumeSettingsAlertShow displayed both the volume slider and AirPlay picker.",
    "Media Player",
    "MPVolumeSettingsAlertShow controls",
    "developerApi",
  ),
  fixed(
    "beta2",
    "messages-location-localization",
    "Messages localized the Location label",
    "Non-English interfaces stopped displaying the Location label in English.",
    "Messages",
    "Location string localization",
  ),
  fixed(
    "beta2",
    "music-radio-product-links",
    "Music product pages opened Radio redirects",
    "Radio redirection links originating on product pages worked.",
    "Music",
    "Radio Redirect links",
  ),
  fixed(
    "beta2",
    "family-notifications-after-crash",
    "Family notifications survived application crashes",
    "A crash in another application no longer prevented later family notifications from appearing.",
    "Notifications",
    "Family notifications after crash",
  ),
  fixed(
    "beta2",
    "phone-recents-refresh",
    "Phone recents refreshed reliably",
    "Missed-call and recent-call details updated consistently.",
    "Phone",
    "missed and recent call updates",
  ),
  fixed(
    "beta2",
    "phone-status-bar-dismissal",
    "Call status bars dismissed",
    "The double-height status bar disappeared correctly after phone and FaceTime calls.",
    "Phone",
    "double-height status bar",
  ),
  fixed(
    "beta2",
    "facetime-audio-availability",
    "Phone hid unavailable FaceTime Audio actions",
    "Contact interfaces stopped showing a FaceTime Audio icon when the service could not be used.",
    "Phone",
    "FaceTime Audio icon",
  ),
  fixed(
    "beta2",
    "phone-relay-audio-quality",
    "Phone relay audio quality improved",
    "Relayed calls no longer suffered the documented low-quality audio path.",
    "Phone",
    "call-relay audio",
  ),
  fixed(
    "beta2",
    "maps-pin-during-call",
    "Maps pins remained responsive during calls",
    "Selecting a map pin during an active call stopped freezing the device interface.",
    "Phone",
    "Maps pin during call",
  ),
  fixed(
    "beta2",
    "shared-stream-camera-roll",
    "Shared-stream photos saved to Camera Roll",
    "The Save to Camera Roll action worked for items in a shared photo stream.",
    "Photos",
    "Save to Camera Roll",
  ),
  fixed(
    "beta2",
    "icloud-photo-library-signout",
    "iCloud Photo Library removed synced items on sign-out",
    "Turning off iCloud before the photo library no longer left cloud-synchronized photographs behind on the device.",
    "Photos",
    "iCloud sign-out cleanup",
  ),
  fixed(
    "beta2",
    "photo-library-large-upload",
    "Large photo libraries continued uploading",
    "Synchronization no longer stalled while sending a large library.",
    "Photos",
    "large-library upload",
  ),
  fixed(
    "beta2",
    "photo-library-during-restore",
    "Photo Library uploads followed an iCloud restore",
    "Enabling iCloud Photo Library during a restore no longer prevented the initial upload from starting afterward.",
    "Photos",
    "initial upload after restore",
  ),
  fixed(
    "beta2",
    "recently-deleted-sync",
    "Recently Deleted removals synchronized",
    "Deleting an item from Recently Deleted propagated to other devices.",
    "Photos",
    "Recently Deleted synchronization",
  ),
  fixed(
    "beta2",
    "quicktime-ipad-air-capture",
    "QuickTime connected to iPad Air for capture",
    "QuickTime Player X could attach to an iPad Air as a screen-capture source.",
    "Screen Capture",
    "iPad Air connection",
  ),
  fixed(
    "beta2",
    "settings-keyboard-crash",
    "Settings accepted third-party keyboards",
    "Adding a custom keyboard no longer crashed Settings.",
    "Settings",
    "third-party keyboard addition",
  ),
  fixed(
    "beta2",
    "settings-icloud-dialog",
    "The iCloud compatibility dialog became dismissible",
    "Users could close the iCloud Drive and iCloud Documents incompatibility alert.",
    "Settings",
    "iCloud compatibility dialog",
  ),
  fixed(
    "beta2",
    "settings-brightness",
    "Settings brightness control worked",
    "The screen-brightness slider changed display brightness again.",
    "Settings",
    "brightness slider",
  ),
  fixed(
    "beta2",
    "settings-icloud-signout-state",
    "iCloud sign-out state refreshed immediately",
    "Settings reflected a completed iCloud sign-out without requiring the user to leave and reopen the account pane.",
    "Settings",
    "sign-out UI state",
  ),
  fixed(
    "beta2",
    "settings-itunes-wifi-sync",
    "iTunes Wi-Fi Sync returned",
    "The wireless synchronization control in Settings worked.",
    "Settings",
    "iTunes Wi-Fi Sync",
  ),
  fixed(
    "beta2",
    "simulator-resizable-iphone",
    "Resizable iPhone simulation worked",
    "The adjustable-size iPhone target became usable in iOS Simulator.",
    "Simulator",
    "resizable iPhone",
    "developerApi",
  ),
  fixed(
    "beta2",
    "simulator-resizable-keyboard-focus",
    "Resizable Simulator routed keyboard focus correctly",
    "Hardware keyboard input reached the simulated application after focus left the dimension controls.",
    "Simulator",
    "width-height field focus",
  ),
  fixed(
    "beta2",
    "simulator-game-center-login",
    "Game Center sign-in worked in Simulator",
    "The simulated Settings application could authenticate to Game Center without the Cocoa 4097 connection error.",
    "Simulator",
    "Game Center login",
  ),
  fixed(
    "beta2",
    "uikit-scroll-inset",
    "Nested navigation kept scroll insets",
    "UIScrollView content insets were calculated correctly when navigation controllers were pushed within a scroll-view-controller flow.",
    "UIKit",
    "UIScrollView contentInset is not set correctly",
    "developerApi",
  ),
  fixed(
    "beta2",
    "searchbar-search-key",
    "UISearchBar exposed search-key customization",
    "Developers gained a public way to configure the keyboard’s search key for a UISearchBar.",
    "UIKit",
    "UISearchBar search key",
    "developerApi",
  ),
  fixed(
    "beta2",
    "shared-web-credentials-simulator",
    "Shared web credentials worked in Simulator",
    "SecRequestSharedWebCredential and SecAddSharedWebCredential were no longer limited to physical devices.",
    "WebKit",
    "SecRequestSharedWebCredential and SecAddSharedWebCredential",
    "developerApi",
  ),
  fixed(
    "beta2",
    "widget-map-tiles",
    "Maps rendered inside widgets",
    "Map views loaded their tiles when hosted by a widget.",
    "Widgets",
    "map-view tiles",
  ),
];

const beta3Changes = [
  fixed(
    "beta3",
    "icloud-clean-restore",
    "Clean-install iCloud restores completed",
    "A clean installation could restore the device’s iCloud backup completely.",
    "Backup",
    "clean-install restore",
  ),
  fixed(
    "beta3",
    "nclaunchstats-battery",
    "Notification Center logging stopped draining battery",
    "Excessive NCLaunchstats console activity no longer contributed to the documented battery-life loss.",
    "Battery Life",
    "NCLaunchstats logging",
  ),
  fixed(
    "beta3",
    "corebluetooth-restoration",
    "Core Bluetooth restored background applications",
    "State preservation and restoration resumed long-running Bluetooth work after an application was jetsammed.",
    "Bluetooth",
    "state preservation and restoration",
  ),
  fixed(
    "beta3",
    "bug-reporter-visibility",
    "Bug Reporter honored its visibility switch",
    "The developer setting for hiding Bug Reporter took effect.",
    "Bug Reporter",
    "visibility switch",
  ),
  fixed(
    "beta3",
    "bug-reporter-ipad-icon",
    "Bug Reporter appeared on the iPad Home Screen",
    "The developer utility’s application icon became visible on iPad.",
    "Bug Reporter",
    "iPad Home Screen icon",
  ),
  fixed(
    "beta3",
    "bug-reporter-cursor",
    "Bug Reporter placed the text cursor correctly",
    "Editing focus moved into the intended report field.",
    "Bug Reporter",
    "text-field cursor",
  ),
  fixed(
    "beta3",
    "family-ask-to-buy-beta2",
    "Ask to Buy requests worked across beta generations",
    "Devices on the third beta could receive and act on purchase requests originating from Beta 2.",
    "Family Sharing",
    "Beta 2 request notifications",
    "compatibility",
  ),
  fixed(
    "beta3",
    "game-center-waiting-invites",
    "Game Center invites left the waiting state",
    "Matchmaking invitations no longer became permanently stuck while waiting.",
    "Game Center",
    "matchmaking invite waiting",
  ),
  fixed(
    "beta3",
    "handoff-mac-icons",
    "Mac Handoff icons remained discoverable",
    "Using a Mac no longer caused Handoff indicators to disappear from nearby iOS and OS X devices.",
    "Handoff",
    "Mac icon discovery",
  ),
  fixed(
    "beta3",
    "handoff-mac-call-relay",
    "Mac call relay completed with audio",
    "Phone calls handed between iPhone and Mac connected and carried sound.",
    "Handoff",
    "Mac phone-call relay",
  ),
  fixed(
    "beta3",
    "icloud-signin-delay",
    "iCloud sign-in delay cleared",
    "Signing into iCloud no longer took as long as two minutes.",
    "iCloud Drive",
    "two-minute sign-in",
  ),
  fixed(
    "beta3",
    "keyboard-app-restart",
    "Third-party keyboard input registered immediately",
    "Applications no longer needed a restart before accepting input from a newly selected custom keyboard.",
    "Keyboards",
    "application restart",
  ),
  fixed(
    "beta3",
    "keyboard-layout-notifications",
    "Keyboards responded to layout notifications",
    "On-screen keyboards applied system layout changes made in Settings.",
    "Keyboards",
    "layout-change notifications",
  ),
  fixed(
    "beta3",
    "keyboard-key-highlights",
    "Keyboard highlights returned on older hardware",
    "Keys displayed their pressed-state highlight on previous-generation devices.",
    "Keyboards",
    "key highlighting",
  ),
  fixed(
    "beta3",
    "keyboard-add-sheet",
    "Single-target keyboards populated the add sheet",
    "Selecting an application with one keyboard target no longer opened an empty Add New Keyboard sheet.",
    "Keyboards",
    "Add New Keyboard sheet",
  ),
  fixed(
    "beta3",
    "keyboard-delete-button",
    "iPad keyboards regained the delete control",
    "The removal interface showed its Delete button when managing iPad keyboards.",
    "Keyboards",
    "keyboard removal button",
  ),
  fixed(
    "beta3",
    "location-suggestion-expiry",
    "Location suggestions left the lock screen",
    "Recommended applications disappeared after the device moved away from the relevant place.",
    "Location Services",
    "location-suggestion expiry",
  ),
  fixed(
    "beta3",
    "lock-screen-home-wake",
    "Home button reliably woke devices",
    "Pressing Home brought a sleeping device back to the lock screen.",
    "Lock Screen",
    "Home-button wake",
  ),
  fixed(
    "beta3",
    "lock-screen-emergency",
    "The lock-screen Emergency action responded",
    "Selecting Emergency opened the emergency-dialing interface.",
    "Lock Screen",
    "Emergency button",
  ),
  fixed(
    "beta3",
    "lost-mode-locked-message",
    "Lost Mode displayed its message on locked devices",
    "A device already locked when Lost Mode began still showed the owner’s message.",
    "Lost Mode",
    "locked-device message",
  ),
  fixed(
    "beta3",
    "lost-mode-after-wipe",
    "Remote-wiped devices escaped stale Lost Mode",
    "Signing back into the same iCloud account after a remote wipe no longer left an unlock-blocking Lost Mode screen.",
    "Lost Mode",
    "post-wipe lock screen",
  ),
  fixed(
    "beta3",
    "mail-attachment-reply",
    "Mail replies with attachments stopped crashing",
    "Replying to a message that contained an attachment no longer terminated Mail.",
    "Mail",
    "reply with attachment",
  ),
  fixed(
    "beta3",
    "messages-sms-relay",
    "SMS relay initialized without an iMessage",
    "Text-message relay worked before the device sent an initial iMessage.",
    "Messages",
    "SMS relay initialization",
  ),
  fixed(
    "beta3",
    "messages-predictive-bar",
    "Messages kept predictive text visible",
    "Launching Messages from the application switcher no longer let the keyboard cover the prediction bar.",
    "Messages",
    "predictive-text bar",
  ),
  fixed(
    "beta3",
    "passbook-cross-version-sync",
    "Passbook passes crossed iOS versions",
    "Passes created on iOS 7 and iOS 8 became visible across both system versions.",
    "Passbook",
    "iOS 7 and iOS 8 passes",
    "compatibility",
  ),
  fixed(
    "beta3",
    "phone-contact-card",
    "Mail contact cards stayed responsive during calls",
    "Opening a sender’s contact card from Mail during an active call no longer froze the interface.",
    "Phone",
    "Mail contact card during call",
  ),
  fixed(
    "beta3",
    "phone-relay-wifi",
    "Phone relay used Wi-Fi",
    "Call relay stopped depending on Bluetooth hardware and selected the intended Wi-Fi path.",
    "Phone",
    "call-relay transport",
  ),
  fixed(
    "beta3",
    "photos-slow-motion-thumbnail",
    "Trimmed slow-motion clips kept thumbnails",
    "Synchronizing an edited slow-motion video no longer replaced its thumbnail with a gray image.",
    "Photos",
    "slow-motion thumbnail",
  ),
  fixed(
    "beta3",
    "photos-idle-download",
    "iCloud photo downloads resumed after idle time",
    "Long device-idle periods no longer stalled iCloud Photo Library downloads.",
    "Photos",
    "idle download stall",
  ),
  fixed(
    "beta3",
    "photos-itunes-upload",
    "iCloud Photo Library handled iTunes-synced photos",
    "Photographs synchronized from iTunes were no longer omitted by the photo-library upload path.",
    "Photos",
    "iTunes-synced photo upload",
  ),
  fixed(
    "beta3",
    "settings-forgot-password",
    "Apple ID recovery worked in Settings",
    "The on-device Forgot Apple ID or Password flow became usable.",
    "Settings",
    "account-recovery dialog",
  ),
  fixed(
    "beta3",
    "settings-icloud-fields",
    "iCloud credential fields rendered correctly",
    "Settings displayed the username and password inputs without the earlier layout defect.",
    "Settings",
    "credential-field display",
  ),
  fixed(
    "beta3",
    "simulator-keyboard-settings",
    "Simulator applications observed keyboard changes",
    "A running simulated application recognized keyboard settings without requiring a relaunch.",
    "Simulator",
    "keyboard-settings propagation",
  ),
  fixed(
    "beta3",
    "simulator-call-status-bar",
    "Simulator toggled its in-call status bar",
    "The Hardware menu command for showing an in-call status bar worked.",
    "Simulator",
    "Toggle In-Call Status Bar",
  ),
  fixed(
    "beta3",
    "simulator-icloud-login",
    "Simulator accepted iCloud sign-in",
    "Developers could authenticate an iCloud account inside the simulated device.",
    "Simulator",
    "iCloud account login",
  ),
  fixed(
    "beta3",
    "siri-voice-activation-localization",
    "Siri showed localized voice-activation prompts",
    "Settings displayed the appropriate activation phrase for each supported Siri language.",
    "Siri",
    "Voice Activation phrase strings",
  ),
  fixed(
    "beta3",
    "siri-bluetooth-song",
    "Bluetooth-activated Siri identified music",
    "Siri could answer a request to identify the currently playing song when invoked over Bluetooth.",
    "Siri",
    "Bluetooth song identification",
  ),
  fixed(
    "beta3",
    "siri-memory-pressure",
    "Siri survived memory-pressure activation",
    "Holding Home after a memory-pressure event launched Siri instead of falling back to Voice Control.",
    "Siri",
    "post-memory-pressure activation",
  ),
];

const beta4Changes = [
  fixed(
    "beta4",
    "layout-margins-autolayout",
    "Auto Layout incorporated UIView margins",
    "Constraints could work directly with a view’s layoutMargins property.",
    "Document Providers",
    "UIView layoutMargins",
    "developerApi",
  ),
  fixed(
    "beta4",
    "document-provider-import-crash",
    "Document-provider imports stopped crashing extensions",
    "Importing through a document-provider controller no longer terminated its extension.",
    "Document Providers",
    "provider-controller import crash",
  ),
  fixed(
    "beta4",
    "document-picker-repeat-selection",
    "Repeated document selection stayed responsive",
    "Choosing the same file twice no longer caused the document picker to hang.",
    "Document Providers",
    "repeat file selection",
  ),
  fixed(
    "beta4",
    "file-provider-storage-url",
    "Deployed file providers received a storage URL",
    "A FileProvider installed from Xcode no longer received a nil documentStorageURL that could crash the extension.",
    "Document Providers",
    "documentStorageURL after deployment",
  ),
  fixed(
    "beta4",
    "extension-xcode-launch",
    "Xcode launched extensions for debugging",
    "Attaching the debugger no longer prevented an extension from starting.",
    "Extensions",
    "Xcode debug launch",
  ),
  fixed(
    "beta4",
    "extension-ui-dismissal",
    "Terminated extension interfaces dismissed",
    "Killing a user-interface extension stopped relaunching it in place.",
    "Extensions",
    "killed UI extension",
  ),
  fixed(
    "beta4",
    "sharing-action-hang",
    "Sharing and action extensions stopped hanging",
    "The two interactive extension types completed without the documented stall.",
    "Extensions",
    "sharing or action hang",
  ),
  fixed(
    "beta4",
    "today-extension-redeploy",
    "Redeployment preserved Today extensions",
    "Installing a new build no longer disabled its extension in Notification Center.",
    "Extensions",
    "Redeploying an extension may disable it",
  ),
  fixed(
    "beta4",
    "hindi-rendering",
    "Hindi text rendered correctly",
    "Incorrectly displayed Hindi strings stopped disrupting search and text rendering.",
    "Fonts",
    "Hindi strings",
  ),
  fixed(
    "beta4",
    "game-center-friend-request",
    "Game Center notifications stopped auto-accepting requests",
    "Opening a friend-request notification no longer approved the request automatically.",
    "Game Center",
    "friend-request notification",
  ),
  fixed(
    "beta4",
    "healthkit-btle-save",
    "Bluetooth health devices saved HealthKit data",
    "Paired BTLE health accessories could persist their measurements to HealthKit.",
    "HealthKit",
    "BTLE data saving",
  ),
  fixed(
    "beta4",
    "icloud-drive-second-device",
    "iCloud Drive enabled on additional devices",
    "Signing into a second device through setup or Settings activated iCloud Drive correctly.",
    "iCloud Drive",
    "second-device enablement",
  ),
  fixed(
    "beta4",
    "keychain-password-reset-message",
    "Password changes stopped reporting a Keychain reset",
    "Updating the iCloud account password no longer produced the misleading reset warning.",
    "iCloud Keychain",
    "reset message after password change",
  ),
  fixed(
    "beta4",
    "ipad-restore-keyboard",
    "Landscape iPad restores kept the keyboard onscreen",
    "Restoring an iPad while rotated no longer positioned its keyboard outside the visible area.",
    "Keyboards",
    "landscape restore keyboard",
  ),
  fixed(
    "beta4",
    "keyboard-callback-lag",
    "Custom keyboard callbacks arrived promptly",
    "The delay between viewDidLoad and textDidChange callbacks was removed.",
    "Keyboards",
    "viewDidLoad to textDidChange",
    "developerApi",
  ),
  fixed(
    "beta4",
    "lock-screen-location-suggestions",
    "Location-based app suggestions appeared",
    "Recommended applications could display on the lock screen for a relevant place.",
    "Lock Screen",
    "location-based recommendations",
  ),
  fixed(
    "beta4",
    "messages-send-as-sms",
    "Messages stayed responsive with Send as SMS",
    "Enabling SMS fallback no longer caused periodic Messages freezes.",
    "Messages",
    "Send as SMS responsiveness",
  ),
  fixed(
    "beta4",
    "newsstand-asset-return",
    "Newsstand returned downloaded assets",
    "Content fetched through NKAssetDownload became available to its application.",
    "Newsstand",
    "NKAssetDownload return",
    "developerApi",
  ),
  fixed(
    "beta4",
    "phone-app-switcher-call-ui",
    "Call controls stopped covering the Home Screen",
    "Starting a call from the app switcher no longer left the call interface layered above SpringBoard.",
    "Phone",
    "app-switcher call UI",
  ),
  fixed(
    "beta4",
    "photos-upgrade-upload",
    "Photo uploads resumed after a Beta 3 upgrade",
    "Moving to Beta 3 no longer left the device stuck while uploading its iCloud library.",
    "Photos",
    "post-Beta 3 upload",
  ),
  fixed(
    "beta4",
    "photos-duplicate-streams",
    "iCloud Photos and Photo Stream stopped duplicating items",
    "Using both services simultaneously no longer displayed duplicate photographs.",
    "Photos",
    "iCloud Photos and Photo Stream duplicates",
  ),
  fixed(
    "beta4",
    "setup-touch-id",
    "Upgrades preserved Touch ID unlock",
    "Installing over an earlier seed no longer disabled iPhone Unlock in Touch ID settings.",
    "Setup",
    "Touch ID after upgrade",
  ),
  fixed(
    "beta4",
    "siri-voice-activation-repeat",
    "Hey Siri handled consecutive requests",
    "Leaving the Siri interface while speech was finishing no longer prevented the next voice-activation request.",
    "Siri",
    "subsequent Hey Siri request",
  ),
  fixed(
    "beta4",
    "siri-japanese-activation",
    "Hey Siri worked with Japanese selected",
    "Voice activation became available when Siri’s language was Japanese.",
    "Siri",
    "Japanese voice activation",
  ),
  fixed(
    "beta4",
    "springboard-folder-lock",
    "Locking inside a folder stopped crashing SpringBoard",
    "The Home Screen process remained stable when the device locked while a folder was open.",
    "Springboard",
    "lock while viewing folder",
  ),
  fixed(
    "beta4",
    "uikit-landscape-xib",
    "Landscape iPad XIB windows used correct dimensions",
    "An application whose main window came from a XIB opened at the proper landscape size on iPad.",
    "UIKit",
    "landscape main-window dimensions",
    "developerApi",
  ),
  fixed(
    "beta4",
    "weather-iphone4s-background",
    "Weather restored its iPhone 4S background",
    "Condition animations no longer exposed the wallpaper behind the Weather interface.",
    "Weather",
    "iPhone 4S background color",
  ),
  fixed(
    "beta4",
    "uiwebview-custom-scheme",
    "UIWebView delivered custom-scheme navigation callbacks",
    "Passing application data through a custom URL scheme no longer lost the delegate load request when URL formatting was imperfect.",
    "WebKit",
    "custom URL delegate callback",
    "developerApi",
  ),
  fixed(
    "beta4",
    "shared-web-credential-domain",
    "Shared web credentials considered all entitled domains",
    "Passing a null domain to SecRequestSharedWebCredential no longer restricted matching to the first associated domain.",
    "WebKit",
    "SecRequestSharedWebCredential domain selection",
    "developerApi",
  ),
];

const beta5Changes = [
  fixed(
    "beta5",
    "capture-zoom-ramp",
    "Camera zoom ramping worked",
    "AVCaptureDevice could animate to a requested video zoom factor at a specified rate.",
    "AVCapture",
    "rampToVideoZoomFactor",
    "developerApi",
  ),
  fixed(
    "beta5",
    "bracketed-capture-count",
    "Bracketed-capture limits reported correctly",
    "AVCaptureStillImageOutput returned an accurate maximum bracketed still-image count.",
    "AVCapture",
    "maxBracketedCaptureStillImageCount",
    "developerApi",
  ),
  fixed(
    "beta5",
    "same-device-icloud-restore",
    "Same-device iCloud restores stabilized",
    "Restoring an iCloud backup onto the device that created it no longer left applications crashing.",
    "Backup and Restore",
    "same-device restore",
  ),
  fixed(
    "beta5",
    "carplay-now-playing-back",
    "CarPlay restored the Now Playing back control",
    "The Now Playing screen again showed its navigation button in the upper-left corner.",
    "CarPlay",
    "Now Playing Back button",
  ),
  fixed(
    "beta5",
    "cloudkit-zone-busy",
    "CloudKit handled concurrent zone updates",
    "Simultaneous record mutations against one private-database zone no longer produced the documented busy error.",
    "CloudKit",
    "CKErrorZoneBusy",
    "developerApi",
  ),
  fixed(
    "beta5",
    "document-picker-icons",
    "Document picker icons appeared",
    "Provider application icons rendered on both iPhone and iPad.",
    "Document Providers",
    "provider icons",
  ),
  fixed(
    "beta5",
    "document-provider-import-hang",
    "Document-provider imports completed",
    "Importing a file through a provider no longer caused the extension to hang.",
    "Document Providers",
    "import hang",
  ),
  fixed(
    "beta5",
    "keyboard-extension-instruments",
    "Instruments profiled keyboard extensions",
    "Developers could attach performance instruments to custom keyboard processes.",
    "Extensions",
    "keyboard profiling",
    "developerApi",
  ),
  fixed(
    "beta5",
    "extension-location-access",
    "Extensions controlled location access reliably",
    "Extension processes gained dependable behavior around location authorization.",
    "Extensions",
    "location-access control",
  ),
  fixed(
    "beta5",
    "today-extension-redeploy",
    "Redeployed Today extensions kept their identity",
    "Installing a new application build no longer prevented its Today extension from launching or replaced its display name.",
    "Extensions",
    "Today extension after redeploy",
  ),
  fixed(
    "beta5",
    "facetime-landscape",
    "FaceTime worked in landscape",
    "Video calling behaved correctly when the device was rotated horizontally.",
    "FaceTime",
    "landscape orientation",
  ),
  fixed(
    "beta5",
    "iad-hls-video",
    "iAd video played in NPR streams",
    "Advertisements could render video within the documented NPR HLS station case.",
    "iAd",
    "NPR HLS video",
  ),
  fixed(
    "beta5",
    "keychain-locked-approval",
    "Locked-device approval completed Keychain sync",
    "Initial iCloud Keychain synchronization succeeded even when the approving device was locked.",
    "iCloud Keychain",
    "initial sync during locked approval",
  ),
  fixed(
    "beta5",
    "keychain-recovery-sync",
    "Keychain recovery preserved later synchronization",
    "Using account recovery no longer left newly added keychain items unable to sync.",
    "iCloud Keychain",
    "post-recovery item sync",
  ),
  fixed(
    "beta5",
    "predictive-text-reactivation",
    "Predictive text reactivated across applications",
    "Turning predictions back on in another application restored the feature system-wide.",
    "Keyboards",
    "predictive-text toggle",
  ),
  fixed(
    "beta5",
    "unexpected-caps-lock",
    "Text fields stopped enabling Caps Lock unexpectedly",
    "Keyboard state no longer entered Caps Lock without a user action.",
    "Keyboards",
    "unexpected Caps Lock",
  ),
  fixed(
    "beta5",
    "system-string-localization",
    "System components completed localization",
    "The listed accessibility, sharing, configuration, networking, mapping, SpringBoard, and media interfaces stopped falling back to English.",
    "Localization",
    "localized component list",
  ),
  fixed(
    "beta5",
    "shadow-sampler-filtering",
    "Linear filtering worked with shadow samplers",
    "Metal and OpenGL shadow sampling no longer required nearest-neighbor filtering as a workaround.",
    "Metal and OpenGL",
    "linear shadow sampling",
    "developerApi",
  ),
  fixed(
    "beta5",
    "music-album-download",
    "Music stayed responsive during album downloads",
    "Downloading a complete album no longer froze the Music application.",
    "Music",
    "album download hang",
  ),
  fixed(
    "beta5",
    "springboard-landscape-launch",
    "Landscape projects launched in landscape",
    "Applications started in the device’s current horizontal orientation instead of incorrectly opening in portrait.",
    "Springboard",
    "landscape project launch",
  ),
  fixed(
    "beta5",
    "multiline-label-margins",
    "Multiline labels invalidated size after margin changes",
    "Changing layout margins recalculated a multiline label’s intrinsic content size and prevented unexpected truncation.",
    "UIKit",
    "layoutMargins intrinsic size",
    "developerApi",
  ),
];

const gmChanges = [
  fixed(
    "gm",
    "encrypted-itunes-backup",
    "Encrypted iTunes backups succeeded",
    "Devices could create encrypted local backups through iTunes.",
    "Backup and Restore",
    "encrypted iTunes backup",
  ),
  fixed(
    "gm",
    "ios7-icloud-photo-restore",
    "iOS 7 iCloud backups restored photos",
    "Restoring an older iCloud backup onto iOS 8 correctly recovered its photo library.",
    "Backup and Restore",
    "iOS 7 backup photos",
    "compatibility",
  ),
  fixed(
    "gm",
    "docmenu-status-bar",
    "The iPhone document menu cleared the status bar",
    "Opening Locations from the document picker no longer placed DocMenu over the status bar.",
    "Document Providers",
    "DocMenu status-bar overlap",
  ),
  fixed(
    "gm",
    "homekit-siri-refresh",
    "Siri recognized HomeKit edits promptly",
    "Home configuration changes became available to Siri without the earlier refresh delay.",
    "HomeKit",
    "Siri data refresh",
  ),
  fixed(
    "gm",
    "itunes-app-sync",
    "Applications synchronized back to iTunes",
    "Device-installed applications once again transferred during an iTunes synchronization.",
    "iTunes Sync",
    "device-to-iTunes app sync",
  ),
  fixed(
    "gm",
    "simulator-hybrid-map",
    "Simulator rendered complete hybrid maps",
    "Hybrid map views displayed all expected tiles in Maps and MapKit applications.",
    "Maps",
    "Hybrid map tiles",
  ),
  fixed(
    "gm",
    "quicklook-pdf",
    "Quick Look displayed PDFs",
    "Applications relying on Quick Look could render PDF documents.",
    "Quicklook",
    "PDF display",
  ),
  fixed(
    "gm",
    "settings-icons",
    "Settings icons appeared immediately",
    "Preference rows rendered their icons before the user selected them.",
    "Settings",
    "missing row icons",
  ),
  fixed(
    "gm",
    "setup-icloud-screen",
    "iCloud setup completed without an apparent hang",
    "Updating the iCloud account pane during Setup Assistant remained responsive.",
    "Setup",
    "iCloud settings update",
  ),
  fixed(
    "gm",
    "ipad-action-sheet-anchor",
    "iPad action sheets handled their popover anchor",
    "Action-sheet UIAlertControllers could present correctly on iPad when configured through the popover source view.",
    "UIKit",
    "UIAlertController sourceView",
    "developerApi",
  ),
];

const canonicalIdentityOverrides = new Map();
const sharedIdentity = (key, title, canonicalSummary, memberKeys) => {
  const definition = { key, title, canonicalSummary, category: "bugFix" };
  for (const memberKey of memberKeys) {
    if (canonicalIdentityOverrides.has(memberKey)) {
      throw new Error(`Duplicate canonical identity override: ${memberKey}`);
    }
    canonicalIdentityOverrides.set(memberKey, definition);
  }
};

sharedIdentity(
  "ios-8-0-extension-debug-timeout",
  "Extension debugging timeout",
  "Debugger-attached extension processes could exceed their permitted launch window before loading.",
  [
    "ios-8-0-beta1-extension-debug-timeout",
    "ios-8-0-beta2-extension-debug-timeout",
  ],
);
sharedIdentity(
  "ios-8-0-extension-openurl",
  "Opening URLs from extensions",
  "The extension environment could fail to open a requested URL.",
  ["ios-8-0-beta1-extension-openurl", "ios-8-0-beta2-extension-openurl"],
);
sharedIdentity(
  "ios-8-0-handoff-document-apps",
  "Document-based Handoff",
  "Document-centered applications could fail to transfer activities through Handoff.",
  [
    "ios-8-0-beta1-handoff-document-apps",
    "ios-8-0-beta2-handoff-document-apps",
  ],
);
sharedIdentity(
  "ios-8-0-handoff-device-pairing",
  "Handoff device pairing",
  "Some devices on one Apple ID could fail to pair for Handoff, call relay, and tethering.",
  [
    "ios-8-0-beta1-handoff-device-pairing",
    "ios-8-0-beta2-handoff-device-pairing",
  ],
);
sharedIdentity(
  "ios-8-0-handoff-stale-safari-url",
  "Current Safari URL in Handoff",
  "A continued Safari activity could resume an older page instead of the currently viewed URL.",
  [
    "ios-8-0-beta1-handoff-stale-safari-url",
    "ios-8-0-beta2-handoff-safari-current-url",
  ],
);
sharedIdentity(
  "ios-8-0-healthkit-correlation-query",
  "HealthKit correlation-query coverage",
  "HKCorrelationQuery could omit matching health values that were not already stored inside correlations.",
  [
    "ios-8-0-beta1-healthkit-correlation-query",
    "ios-8-0-beta2-healthkit-correlation-query",
  ],
);
sharedIdentity(
  "ios-8-0-healthkit-blood-pressure-correlation",
  "Blood-pressure value correlation",
  "HealthKit could lose the relationship between the systolic and diastolic values in a blood-pressure reading.",
  [
    "ios-8-0-beta1-healthkit-blood-pressure-correlation",
    "ios-8-0-beta2-healthkit-blood-pressure-correlation",
  ],
);
sharedIdentity(
  "ios-8-0-homekit-bridge-capacity",
  "HomeKit bridge service capacity",
  "A HomeKit bridge could expose no more than five services across its connected accessories.",
  [
    "ios-8-0-beta1-homekit-bridge-capacity",
    "ios-8-0-beta2-homekit-bridge-capacity",
  ],
);
sharedIdentity(
  "ios-8-0-homekit-siri-refresh",
  "Siri refresh after HomeKit edits",
  "Siri could take time to recognize recent HomeKit configuration changes.",
  [
    "ios-8-0-beta1-homekit-siri-refresh",
    "ios-8-0-beta2-homekit-siri-refresh",
    "ios-8-0-gm-homekit-siri-refresh",
  ],
);
sharedIdentity(
  "ios-8-0-keyboard-network-access",
  "Network access for custom keyboards",
  "A custom keyboard could remain offline even after requesting open network access.",
  [
    "ios-8-0-beta1-keyboard-network-access",
    "ios-8-0-beta2-keyboard-network-access",
  ],
);
sharedIdentity(
  "ios-8-0-photos-recently-deleted-sync",
  "Recently Deleted synchronization",
  "A permanent deletion from Recently Deleted could fail to synchronize to other devices.",
  [
    "ios-8-0-beta1-photos-recently-deleted-sync",
    "ios-8-0-beta2-recently-deleted-sync",
  ],
);

const canonicalizeIdentity = (item) => ({
  ...item,
  ...(canonicalIdentityOverrides.get(item.key) || {}),
});

const eventSpecs = [
  {
    alias: "beta-1",
    label: "Beta 1",
    source: U.beta1,
    status: "initial Apple document",
    method:
      "This is a conservative first-document baseline. Selection is limited to exact Apple Note or Known Issue records that describe an API, compatibility boundary, behavior, or concrete defect; broad boilerplate and workaround text are excluded.",
    evidence:
      "Internet Archive captured Apple’s own page on June 3. Its title identifies the iOS 8.0 beta, its footer says it was updated June 2, and it preserves Apple copyright and internal document anchors.",
    changes: beta1Changes.map(canonicalizeIdentity),
  },
  {
    alias: "beta-2",
    label: "Beta 2",
    source: U.beta2,
    status: "Fixed in beta 2",
    method:
      "Every non-workaround record under an exact “Fixed in beta 2” heading is retained. Notes, known issues, and other cumulative material are excluded even when interesting.",
    evidence:
      "Apple’s archived page is titled for Beta 2, carries a June 16 update footer, and contains 74 non-workaround fixed records across 30 exact status sections.",
    changes: beta2Changes.map(canonicalizeIdentity),
  },
  {
    alias: "beta-3",
    label: "Beta 3",
    source: U.beta3,
    previousSource: U.beta2,
    status: "Fixed in beta 3",
    method:
      "The transcript contains 42 non-workaround fixed records. This batch keeps only the 38 whose same component and normalized issue text also occur under an Apple Known Issue heading in the archived Beta 2 page. Three transcript-only records and one record Apple had already marked fixed in Beta 2 remain outside the manifest.",
    evidence:
      "The Apple-markup transcript’s 42-record fixed inventory is identical in its earliest 2019 archive capture and the current page. The 38 selected transitions are independently bounded by Apple’s first-party Beta 2 state.",
    changes: beta3Changes.map(canonicalizeIdentity),
  },
  {
    alias: "beta-4",
    label: "Beta 4",
    source: U.beta4,
    status: "Fixed in beta 4",
    method:
      "All 29 non-workaround records beneath exact “Fixed in beta 4” headings are retained from the Apple-markup transcript. General notes, known issues, publisher commentary, and workaround text are excluded.",
    evidence:
      "Internet Archive captured the page on July 22, one day after release. Its complete 29-record fixed inventory is normalization-identical to the current page and retains Apple’s internal anchors and component hierarchy.",
    changes: beta4Changes.map(canonicalizeIdentity),
  },
  {
    alias: "beta-5",
    label: "Beta 5",
    source: U.beta5,
    status: "Fixed in beta 5",
    method:
      "All 21 substantive records under exact “Fixed in beta 5” headings are retained from the Apple PDF. Workarounds, generic notes, and still-open known issues are excluded.",
    evidence:
      "The intact PDF is titled for Beta 5, has 11 PDFKit-readable pages, carries Apple’s copyright footer and an August 3 update date, and is byte-identical to its Internet Archive replay.",
    changes: beta5Changes.map(canonicalizeIdentity),
  },
  {
    alias: "gm",
    label: "GM",
    source: U.gm,
    status: "Fixed in GM Seed",
    method:
      "All ten records under exact “Fixed in GM Seed” headings are retained. Notes and known issues elsewhere in the GM document are not converted into milestone changes.",
    evidence:
      "Apple’s archived page is titled for the iOS 8.0 GM Seed, was updated September 9, and preserves ten exact fixed records under Apple copyright.",
    changes: gmChanges.map(canonicalizeIdentity),
  },
];

const sourceByUrl = new Map(sources.map((source) => [source.url, source]));
const verificationFor = (spec, item) => {
  if (spec.alias === "beta-1") {
    return `Matched the cited ${item.component} record beneath Apple’s exact “${item.status}” heading in the June 2 first-document state preserved by Internet Archive.`;
  }
  if (spec.alias === "beta-3") {
    return `Matched the cited ${item.component} record beneath the transcript’s exact “Fixed in beta 3” heading, then matched the same normalized issue under Apple’s Beta 2 Known Issue state.`;
  }
  if (spec.alias === "beta-4") {
    return `Matched the cited ${item.component} record beneath the exact “Fixed in beta 4” heading in the next-day archive capture; the fixed-record inventory remains identical on the current page.`;
  }
  if (spec.alias === "beta-5") {
    return `Matched the cited ${item.component} record beneath the exact “Fixed in beta 5” heading in the Apple-authored PDF; the current mirror and archive replay are byte-identical.`;
  }
  return `Matched the cited ${item.component} record beneath Apple’s exact “${item.status}” heading in the preserved ${spec.label} document state.`;
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
        ? `Apple’s initial iOS 8 developer document records this ${item.component} behavior or limitation in the first seed.`
        : `Apple’s milestone-specific ${item.status} section places this ${item.component} resolution in ${spec.label}.`,
    documentedStatus: "documented",
    evidenceState: ["beta-1", "beta-2", "gm"].includes(spec.alias)
      ? "confirmed"
      : "corroborated",
    verificationMethod: verificationFor(spec, item),
    citations: uniqueCitations([
      c(
        spec.source,
        `${item.component} — ${item.status}; ${item.marker}`,
        "Original synthesis from the Apple-authored milestone record.",
      ),
      ...(spec.previousSource
        ? [
            c(
              spec.previousSource,
              `${item.component} — predecessor Known Issue; ${item.marker}`,
              "First-party predecessor state used to corroborate the fixed transition.",
            ),
          ]
        : []),
    ]),
  }));

const eventArticle = (spec, changes) =>
  article(
    heading("What survives"),
    prose(spec.evidence, [
      c(
        spec.source,
        `${sourceByUrl.get(spec.source)?.title}; ${spec.status}`,
        "Apple-authored historical evidence with mirror provenance recorded.",
      ),
    ]),
    heading(`What ${spec.label} documents`),
    prose(
      `This structured snapshot contains ${changes.length} narrowly attributed Apple developer-note records. The index preserves the component and milestone status for each item while rewriting the factual result in original language.`,
      uniqueCitations(changes.flatMap((item) => item.citations)),
    ),
    heading("Selection boundary"),
    prose(
      spec.method,
      uniqueCitations([
        c(spec.source, `${spec.label}; retained note state`),
        ...(spec.previousSource
          ? [
              c(
                spec.previousSource,
                "Beta 2 predecessor state",
                "Used only to corroborate the Known Issue to fixed transition.",
              ),
            ]
          : []),
      ]),
    ),
    heading("Archive limitations"),
    prose(
      "This page is a structured historical index, not a reproduction of Apple’s document or an exhaustive list of every user-visible change. It excludes publisher commentary, workaround prose, community observations, unavailable build claims, and the already-owned Public route.",
      [c(spec.source, "Document scope and exact status headings")],
    ),
  );

const events = eventSpecs.map((spec) => {
  const changes = changesFor(spec);
  return {
    target: {
      releaseVersionId: "version-ios-8-0",
      routeAlias: spec.alias,
    },
    authorship: "originalSynthesis",
    summary: `${spec.label} is represented by ${changes.length} narrowly attributed Apple developer-note records. Publisher commentary, workaround text, unsupported builds, and the Public route are excluded.`,
    article: eventArticle(spec, changes),
    citations: uniqueCitations([
      c(spec.source, `${spec.label}; ${spec.status}`),
      ...(spec.previousSource
        ? [
            c(
              spec.previousSource,
              "Predecessor Known Issue state",
              "Boundary comparison only.",
            ),
          ]
        : []),
      ...changes.flatMap((item) => item.citations),
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
    majorVersion: 8,
    version: "8.0",
    releaseStatus: "released",
    publicReleaseDate: "2014-09-17",
    milestones: [
      ["Beta 1", "2014-06-02", false, undefined],
      ["Beta 2", "2014-06-17", false, undefined],
      ["Beta 3", "2014-07-07", false, undefined],
      ["Beta 4", "2014-07-21", false, undefined],
      ["Beta 5", "2014-08-04", false, undefined],
      ["GM", "2014-09-09", false, undefined],
      ["Public", "2014-09-17", false, undefined],
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
  .filter((version) => version.platform === "iOS" && version.version === "8.0")
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
    "The exact local iOS 8.0 seed inventory changed; re-audit the cohort before regenerating.",
  );
}

const expectedCounts = new Map([
  ["beta-1", 30],
  ["beta-2", 74],
  ["beta-3", 38],
  ["beta-4", 29],
  ["beta-5", 21],
  ["gm", 10],
]);
const expectedRoutes = new Set(
  [...expectedCounts.keys()].map((alias) => `version-ios-8-0/${alias}`),
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
  changeCount !== 202 ||
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
        (item) =>
          !["confirmed", "corroborated"].includes(item.evidenceState) ||
          item.inheritance !== "delta" ||
          item.documentedStatus !== "documented" ||
          /build-identity|community-observation|seed-identity/i.test(item.key),
      ),
  )
) {
  throw new Error("The expected iOS 8 prerelease bundle closure failed.");
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
      `iOS 8 prerelease change definition drifted for ${occurrence.key}.`,
    );
  }
  localChangeDefinitions.set(occurrence.key, definition);
}
const uniqueLocalChangeKeys = [...localChangeDefinitions.keys()];
if (uniqueLocalChangeKeys.length !== 190) {
  throw new Error(
    `Expected 190 stable iOS 8 prerelease definitions; found ${uniqueLocalChangeKeys.length}.`,
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
    `iOS 8 prerelease change keys collide with existing content: ${collisions
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
      `- [${source.title}](${source.url}) — ${source.publisher}; ${source.sourceClass}.`,
  )
  .join("\n");
const routeRows = eventSpecs
  .map(
    (spec) =>
      `| iOS | ${spec.label} | \`${spec.alias}\` | ${spec.changes.length} |`,
  )
  .join("\n");
const routeVerificationRows = eventSpecs
  .map(
    (spec) =>
      `| \`/apple/ios/8.0/${spec.alias}/\` | 200 | yes | ${spec.changes.length}/${spec.changes.length} | yes | yes | no | no |`,
  )
  .join("\n");

const md = `# Apple iOS 8 prerelease archive batch

## Result

\`${outputName}\` is the editorially approved overlay for all six existing
iOS 8.0 prerelease routes. It combines three preserved first-party Apple page
states, two integrity-checked Apple-authored transcripts, and a byte-verifiable
Apple Developer PDF.

- ${events.length} substantive event overlays and no release-version overlays
- ${changeCount} milestone-specific occurrences across
  ${uniqueLocalChangeKeys.length} stable, collision-checked definitions
- ${sources.length} declared and used sources with ${citationCount} citation
  references
- zero builds, build-number claims, route creation, Public-route changes,
  or community-observation changes
- every event is \`editoriallyVerified\`, approved at \`${reviewedAt}\`, and
  indexable

## Approved route closure

| Platform | Milestone | Existing alias | Selected changes |
| --- | --- | --- | ---: |
${routeRows}

Public is already owned by \`apple-ios-8.json\` and is untouched.

## Evidence method

1. Beta 1, Beta 2, and GM are exact captures of Apple’s original
   \`RN-iOSSDK-8.0\` page. Their titles and update footers identify June 2,
   June 16, and September 9 document states.
2. Beta 1 is a conservative first-document baseline of 30 exact Note or Known
   Issue records. Boilerplate and workaround text are excluded.
3. Beta 2 includes all 74 non-workaround records under exact “Fixed in beta 2”
   headings.
4. Beta 3’s transcript contains 42 fixed records. Thirty-eight are retained
   because the same component and normalized issue occur in Apple’s archived
   Beta 2 Known Issue state. Three transcript-only records and one record Apple
   had already labeled fixed in Beta 2 are excluded.
5. Beta 4 includes all 29 fixed records in a transcript captured the next day.
   Its normalized fixed inventory is identical on the current page.
6. Beta 5 includes all 21 substantive fixed records from an Apple PDF whose
   current mirror and Internet Archive replay are byte-identical.
7. GM includes all ten records beneath Apple’s exact “Fixed in GM Seed”
   headings.
8. Eleven exact Beta 1-to-Beta 2 transitions reuse one canonical identity
   across their known and fixed occurrences. The matching HomeKit/Siri record
   also retains that identity in GM.

## Raw evidence ledger

| State | Public artifact | Count | SHA-256 | Use |
| --- | --- | ---: | --- | --- |
| Beta 1 | Apple HTML replay; captured 2014-06-03 | 17 Note records; 30 selected baseline records | \`c46f99da95ebdef730c6891cf5c366fd08224eaab7dea3514cfce90f404261fe\` | Exact first-document state |
| Beta 2 | Apple HTML replay; captured 2014-06-25 | 74 non-workaround fixed records | \`1ff69e7c4941df3eac813e40559c63e68cde6c410a9321c79a24a2a2e92c4531\` | Complete explicit Beta 2 fixed set |
| Beta 3 | Live transcript HTML; two-fetch stable wrapper on 2026-07-30 | 42 non-workaround fixed records; 38 selected | \`7a4d620948a0642e677e457b49c33c59180091320d0a8869801ab9eb9ee8e5e2\` | Current transcript cross-check |
| Beta 3 | Earliest archive replay; captured 2019-07-23 | normalized 42-record inventory | \`5584690965d6b06bd5b13ec9ca0405623704ccc7529e7ccdc02c74fc9424c336\` | Inventory integrity check |
| Beta 4 | Next-day archive replay; captured 2014-07-22 | 29 non-workaround fixed records | \`b204cb8c9de06fbe45d691d477de3496fddf32d8b76ba1bf87fcedc317d68f79\` | Complete explicit Beta 4 fixed set |
| Beta 4 | Live transcript HTML; dynamic wrapper on 2026-07-30 | normalized 29-record inventory | \`49aeb7b1e22adafc009cf71afa0333eef11af7a3c30212e362507988003c3547\`, then \`675a923e32d06f76fa6fcc2fa584136ee15ffc4b6b686fd182bdf693d1565a2c\` | Current transcript cross-check only |
| Beta 5 | Apple Developer PDF mirror and byte-identical archive replay | 11 PDFKit-readable pages; 21 selected fixed records | \`9a318824510c9eaa717d721585d805cc223f8ebb0b3bc713d6a492013d2bcfb8\` | Complete explicit Beta 5 fixed set |
| GM | Apple HTML replay; captured 2014-09-10 | 10 fixed records | \`edc931c85c2a9455bd215b9cd801b380348edf36cc254c2ee03426ba0150ffc4\` | Complete explicit GM fixed set |

The Beta 3 current and archived normalized fixed-record inventories share
SHA-256 \`f4eacc3262dc5fb67e579ab2d3fa28c12cdaa938c407889b02316e9845820f36\`.
The Beta 4 pair share normalized inventory SHA-256
\`412064498155ea6e5490746b487c33568a5679dfeb35e683846d211ffe1572f1\`.
The live page wrappers are not treated as immutable evidence: Beta 3 was stable
across two immediate fetches, while Beta 4 changed between two immediate
fetches even though both produced the exact locked 29-record inventory.
Raw artifacts remain in a temporary research directory and are not committed.

## Exact evidence gaps and exclusions

- Beta 1 has no predecessor document. Its 30 records are explicitly labeled a
  first-document baseline, not a claim that Apple introduced every behavior on
  June 2.
- The Beta 3 transcript’s earliest public archive capture is from 2019. This
  batch therefore requires a matching Beta 2 first-party Known Issue for every
  selected Beta 3 record.
- Three Beta 3 fixed records have no exact Beta 2 predecessor match: family
  push notifications, newly added iCloud Drive files, and Simulator profile
  drag-and-drop. They remain timeline-only.
- A fourth Beta 3 record says Ask to Buy was fixed, but Apple had already placed
  the same record under “Fixed in beta 2.” It is excluded rather than assigned
  twice.
- Beta 4 is a third-party transcript, but a next-day Internet Archive capture
  preserves its Apple anchors and its complete fixed inventory remains stable.
- Beta 5 is a mirrored Apple PDF; the original prerelease URL is not publicly
  navigable. The mirror and archive replay are byte-identical.
- No community-discovered changes or publisher feature lists are imported.
- Public is already owned by \`apple-ios-8.json\` and remains untouched.
- No build number is inferred from publisher prose or unavailable downloads.

## Copyright and attribution controls

- All article, title, summary, and canonical-summary fields are original
  synthesis.
- Apple-authored documents and transcripts are linked, titled, and credited;
  no PDF, transcript, screenshot, or long source excerpt is checked into the
  repository.
- Citation locators retain only short component, status, and record identifiers.
- Publisher commentary and workaround prose are excluded.
- The artifacts are used as factual evidence for component, status, and
  milestone boundaries, not republished as substitute copies.

## Source ledger

All declared sources were accessed on ${accessedAt}.

${sourceLedger}

## Closure guards

- Exact comparison against the local iOS 8.0 seed record and all seven
  milestones
- Exact six-route allowlist with Public excluded
- Zero versions and zero builds; exact approved review, provenance, and
  indexability closure for every event
- Collision scan across every other research-batch JSON plus
  \`apple-launch-content-2026.json\`
- ${changeCount} occurrences resolve to exactly
  ${uniqueLocalChangeKeys.length} stable local definitions
- Exact source-state comparison closes 11 selected Beta 1-to-Beta 2
  transitions and the repeated GM HomeKit/Siri record onto shared identities
- Complete unique source declaration/use closure
- Deterministic formatted JSON SHA-256: \`${jsonSha}\`

## Editorial approval and validation record

The independently reviewed event overlays are approved:

- provenance: \`editoriallyVerified\`
- editorial status: \`approved\` at \`${reviewedAt}\`
- indexability: \`true\`

Verified on ${accessedAt}:

- \`npm run research:validate\`: 63 batches validated; this batch reports 6
  events, 202 changes, 6 sources, and 746 citations; 3,771 change keys are
  globally consistent
- focused ingestion/manifest suite: 19 tests passed
- HTML-state audit: 17 Beta 1 Note records, 74 Beta 2 fixed records, 42 Beta 3
  fixed records with an exact 38-known/1-already-fixed/3-unmatched predecessor
  split, 29 Beta 4 fixed records, and 10 GM fixed records
- HTML locator audit: every one of the 181 selected non-PDF records resolves
  uniquely inside its exact component and milestone status through its locator
  and editorial identity terms; all 38 selected Beta 3 records also resolve to
  an exact Beta 2 Known Issue predecessor
- canonical-transition audit: all 11 exact selected Beta 1-to-Beta 2
  transitions share one change identity, including the HomeKit/Siri identity
  that recurs in GM
- Beta 5 PDF audit: 11 readable pages, 15 fixed-section headings, and 21
  selected locator assertions
- copyright-similarity scan: maximum contiguous overlap of 5 words
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
- all six planned patches target the exact existing Beta 1–5 and GM event
  documents; each is revision-guarded and sets article, change, citation,
  approved review, provenance, summary, and indexability fields only

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
Each response returned the full archival article, every expected structured
change title, References, and its primary source. No response returned
placeholder copy or a \`noindex\` directive.

| Canonical route | HTTP | Full article | Expected changes | References | Primary source | Placeholder | Noindex |
| --- | ---: | --- | --- | --- | --- | --- | --- |
${routeVerificationRows}

Final verification on ${accessedAt}:

- full repository suite: 131 tests passed
- focused ingestion and manifest suite: 19 tests passed
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
node scripts/research-batches/build-apple-ios-8-prerelease.mjs
npm run research:validate
node --import tsx --test tests/launch-content-ingestion.test.ts tests/launch-content-manifest.test.ts
npx eslint scripts/research-batches/build-apple-ios-8-prerelease.mjs scripts/research-batches/audit-ios8-html-states.mjs
npx prettier --check scripts/research-batches/build-apple-ios-8-prerelease.mjs scripts/research-batches/apple-ios-8-prerelease.json scripts/research-batches/apple-ios-8-prerelease.md scripts/research-batches/audit-ios8-html-states.mjs
npx sanity exec scripts/ingest-launch-content.ts --with-user-token -- --content scripts/research-batches/apple-ios-8-prerelease.json
\`\`\`

The final Sanity command is intentionally a post-publication dry run and must
reproduce the zero plan above. Do not add \`--apply\`.
`;

const formattedMd = await prettier.format(md, { filepath: ledgerName });
writeFileSync(join(here, ledgerName), formattedMd);
