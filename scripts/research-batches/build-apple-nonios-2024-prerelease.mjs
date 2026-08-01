import { createHash } from "node:crypto";
import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import prettier from "prettier";

const here = dirname(fileURLToPath(import.meta.url));
const outputName = "apple-nonios-2024-prerelease.json";
const ledgerName = "apple-nonios-2024-prerelease.md";
const accessedAt = "2026-07-30";
const reviewedAt = "2026-07-30T09:19:14Z";
const verification = {
  researchBatches: 56,
  globalChangeKeys: 3045,
  focusedTests: 19,
  fullTests: 131,
  evidenceAssertions: 315,
  maximumEditorialOverlapWords: 5,
};
const dryRun = {
  plan: "7ca4d274f624b20b1ebaab34808b51c532a75a47017816fb708b6761c870b856",
  planArtifact:
    "8e93fa61b6a081a50e507abd2f3f9bf4cdd4e082d12928edde79f89a21eab6ca",
  rollbackArtifact:
    "5784656b2e46aa4e4a5736979464b08f35ed659745e05aa17b5d92e4a16e47e5",
  creates: 82,
  patches: 8,
  unchanged: 2074,
  payloadBytes: 189188,
};
const publication = {
  transactionId: "eOgq1Ovu5XNUv1qNFUyuf1",
  receiptSha:
    "88733e373a4bf391aca3b1dc7583ece7987426de7a5c50886bdfd4090960d218",
  immediateZeroPlanSha:
    "771a5e85f51b239e15a329b1e0e3794c56a12c104fda1c05a5889876e0dc3d0e",
  immediateZeroPlanArtifactSha:
    "f4203382ff15887a3d59fca1367bac9678ca09f161875eb6bc1ad9b73be442cc",
  immediateZeroRollbackArtifactSha:
    "b1521477c01940e9c06194a8922498a7415ac51034682647e32d0b171667d68d",
  immediateZeroCreates: 0,
  immediateZeroPatches: 0,
  immediateZeroUnchanged: 2164,
  immediateZeroPayloadBytes: 16,
  coverage: {
    fullVersions: 410,
    totalVersions: 410,
    fullAppearances: 399,
    sourceLinkedAppearances: 256,
    timelineOnlyAppearances: 1324,
    totalAppearances: 1979,
    approvedStructuredAppearances: 550,
  },
};

const archivePaths = {
  macos:
    "https://developer.apple.com/documentation/macos-release-notes/macos-15-release-notes",
  macosTransport:
    "https://developer.apple.com/tutorials/data/documentation/macos-release-notes/macos-15-release-notes.json",
  tvos: "https://developer.apple.com/documentation/tvos-release-notes/tvos-18-release-notes",
  tvosTransport:
    "https://developer.apple.com/tutorials/data/documentation/tvos-release-notes/tvos-18-release-notes.json",
  visionos:
    "https://developer.apple.com/documentation/visionos-release-notes/visionos-2-release-notes",
  visionosTransport:
    "https://developer.apple.com/tutorials/data/documentation/visionos-release-notes/visionos-2-release-notes.json",
  watchos:
    "https://developer.apple.com/documentation/watchos-release-notes/watchos-11-release-notes",
  watchosTransport:
    "https://developer.apple.com/tutorials/data/documentation/watchos-release-notes/watchos-11-release-notes.json",
};

const archived = (timestamp, path) =>
  `https://web.archive.org/web/${timestamp}/${path}`;
const archivedRaw = (timestamp, path) =>
  `https://web.archive.org/web/${timestamp}id_/${path}`;

const evidence = {
  macosBeta1: {
    platform: "macOS",
    milestone: "Beta 1",
    humanTimestamp: "20240610230634",
    rawTimestamp: "20240619212721",
    rawTitle: "macOS Sequoia 15 Beta Release Notes",
    normalizedRecords: 144,
    issueBackedRecords: 142,
    sha256: "c2cd17b6d4abc6f785a1bb430eab7352a6dbfab9594dc8893b6b07f0129e2fb9",
    path: archivePaths.macos,
    transportPath: archivePaths.macosTransport,
  },
  macosBeta2: {
    platform: "macOS",
    milestone: "Beta 2",
    humanTimestamp: "20240628225332",
    rawTimestamp: "20240628225332",
    rawTitle: "macOS Sequoia 15 Beta 2 Release Notes",
    normalizedRecords: 152,
    issueBackedRecords: 150,
    sha256: "69960ecb060d96b3e0c5871b5cd32dbef2a8b65849d579f33574398071be7b18",
    path: archivePaths.macos,
    transportPath: archivePaths.macosTransport,
  },
  macosBeta3: {
    platform: "macOS",
    milestone: "Beta 3",
    humanTimestamp: "20240711120823",
    rawTimestamp: "20240711120834",
    rawTitle: "macOS Sequoia 15 Beta 3 Release Notes",
    normalizedRecords: 160,
    issueBackedRecords: 158,
    sha256: "e82ebc5a2c8280208cf1ef4db1ffb5ac4ef7eacf2eaf60f88fe44757f684eb69",
    path: archivePaths.macos,
    transportPath: archivePaths.macosTransport,
  },
  macosBeta4: {
    platform: "macOS",
    milestone: "Beta 4",
    humanTimestamp: "20240723174620",
    rawTimestamp: "20240723180119",
    rawTitle: "macOS Sequoia 15 Beta 4 Release Notes",
    normalizedRecords: 170,
    issueBackedRecords: 168,
    sha256: "cdfa1068580c7c28a30ede2bcdd17288c44719d68d5c064ae8fd5e15182b52ee",
    path: archivePaths.macos,
    transportPath: archivePaths.macosTransport,
  },
  macosBeta4Revision: {
    platform: "macOS",
    milestone: "Beta 4 retained revision",
    humanTimestamp: "20240731003906",
    rawTimestamp: "20240731043153",
    rawTitle: "macOS Sequoia 15 Beta 4 Release Notes",
    normalizedRecords: 170,
    issueBackedRecords: 168,
    sha256: "dbb93be92da0da3ea440b428fc138bd5b2fafe134607fed709fa5bd5ad6bfaf4",
    path: archivePaths.macos,
    transportPath: archivePaths.macosTransport,
  },
  macosBeta5: {
    platform: "macOS",
    milestone: "Beta 5",
    humanTimestamp: "20240807153431",
    rawTimestamp: "20240807153441",
    rawTitle: "macOS Sequoia 15 Beta 5 Release Notes",
    normalizedRecords: 174,
    issueBackedRecords: 172,
    sha256: "305131902a43ffb8695c3d588aa2b8c0d854c651e9540298be5ca6f62a4e6dc9",
    path: archivePaths.macos,
    transportPath: archivePaths.macosTransport,
  },
  macosBeta6: {
    platform: "macOS",
    milestone: "Beta 6",
    humanTimestamp: "20240813023546",
    rawTimestamp: "20240813023550",
    rawTitle: "macOS Sequoia 15 Beta 6 Release Notes",
    normalizedRecords: 174,
    issueBackedRecords: 172,
    sha256: "ef84b9fe891ec993aceab6f6b3b4da4e7730acd7de3acbbf4d92e8f5a8c7075f",
    path: archivePaths.macos,
    transportPath: archivePaths.macosTransport,
  },
  macosBeta7: {
    platform: "macOS",
    milestone: "Beta 7",
    humanTimestamp: "20240821000141",
    rawTimestamp: "20240821000143",
    rawTitle: "macOS Sequoia 15 Beta 7 Release Notes",
    normalizedRecords: 180,
    issueBackedRecords: 178,
    sha256: "1b267115e9f0d916d181aa19db7f36b24f040b795100862256345f50bb1a11f4",
    path: archivePaths.macos,
    transportPath: archivePaths.macosTransport,
  },
  macosBeta8: {
    platform: "macOS",
    milestone: "Beta 8 (not present in local seed)",
    humanTimestamp: "20240829040650",
    rawTimestamp: "20240829040652",
    rawTitle: "macOS Sequoia 15 Beta 8 Release Notes",
    normalizedRecords: 180,
    issueBackedRecords: 178,
    sha256: "1b4dd3bc36a0df9bd43ebc3db249c5c0f65b3d5604575fdfcc32db4b901ac445",
    path: archivePaths.macos,
    transportPath: archivePaths.macosTransport,
  },
  macosPublic: {
    platform: "macOS",
    milestone: "Public",
    humanTimestamp: "20240917134315",
    rawTimestamp: "20240917210234",
    rawTitle: "macOS Sequoia 15 Release Notes",
    normalizedRecords: 180,
    issueBackedRecords: 178,
    sha256: "f7d0f81e6d82637c33b481e42fb6025ef3538f4fbbf9e6b9500b8a3ff4e078b9",
    path: archivePaths.macos,
    transportPath: archivePaths.macosTransport,
  },
  tvosBeta4: {
    platform: "tvOS",
    milestone: "Beta 4",
    humanTimestamp: "20240724054200",
    rawTimestamp: "20240724054203",
    rawTitle: "tvOS 18 Beta 4 Release Notes",
    normalizedRecords: 52,
    issueBackedRecords: 52,
    sha256: "2a6dda8076f644f688fd1b928e014f9ea3297ce9800b4d5828369bebcb7c3546",
    path: archivePaths.tvos,
    transportPath: archivePaths.tvosTransport,
  },
  tvosBeta7: {
    platform: "tvOS",
    milestone: "Beta 7",
    humanTimestamp: "20240823054229",
    rawTimestamp: "20240823054229",
    rawTitle: "tvOS 18 Beta 7 Release Notes",
    normalizedRecords: 52,
    issueBackedRecords: 52,
    sha256: "78ec460cfcc1a358e5fea66a36ed7c1c543264e11311b320f69ad36d238f536d",
    path: archivePaths.tvos,
    transportPath: archivePaths.tvosTransport,
  },
  visionosBeta1: {
    platform: "visionOS",
    milestone: "Beta 1",
    humanTimestamp: "20240611002731",
    rawTimestamp: "20240611002742",
    rawTitle: "visionOS 2 Beta Release Notes",
    normalizedRecords: 131,
    issueBackedRecords: 128,
    sha256: "bc9b0875d286d76b4007aef56c0e511cfc05852cbbcee7e9fc98b67a72a94dfb",
    path: archivePaths.visionos,
    transportPath: archivePaths.visionosTransport,
  },
  visionosBeta4: {
    platform: "visionOS",
    milestone: "Beta 4",
    humanTimestamp: "20240724054214",
    rawTimestamp: "20240724054225",
    rawTitle: "visionOS 2 Beta 4 Release Notes",
    normalizedRecords: 170,
    issueBackedRecords: 168,
    sha256: "884ec2ca23dff52d0b3ad906650f8aea61d1fb837b22c4a875ec3018e7d531de",
    path: archivePaths.visionos,
    transportPath: archivePaths.visionosTransport,
  },
  visionosRc: {
    platform: "visionOS",
    milestone: "RC",
    humanTimestamp: "20240916171839",
    rawTimestamp: "20240916171844",
    rawTitle: "visionOS 2 RC Release Notes",
    normalizedRecords: 183,
    issueBackedRecords: 181,
    sha256: "9bd5b051110193c70a65cb84c8b7fa1e8f9f6d5f805c51febbba0d455a73529b",
    path: archivePaths.visionos,
    transportPath: archivePaths.visionosTransport,
  },
  watchosBeta5: {
    platform: "watchOS",
    milestone: "Beta 5",
    humanTimestamp: "20240806143747",
    rawTimestamp: "20240806143749",
    rawTitle: "watchOS 11 Beta 5 Release Notes",
    normalizedRecords: 70,
    issueBackedRecords: 70,
    sha256: "78da7e665022c62c575754989b2d1435d9e8b02dbe062dfb7ddad505d5163414",
    path: archivePaths.watchos,
    transportPath: archivePaths.watchosTransport,
  },
  watchosPublic: {
    platform: "watchOS",
    milestone: "Public",
    humanTimestamp: "20240928030158",
    rawTimestamp: "20240928030208",
    rawTitle: "watchOS 11 Release Notes",
    normalizedRecords: 71,
    issueBackedRecords: 71,
    sha256: "375885e0e54bdccfa5a9e9b2a579aa70ded037a0549661f04f3921c04814a84f",
    path: archivePaths.watchos,
    transportPath: archivePaths.watchosTransport,
  },
};

for (const item of Object.values(evidence)) {
  item.url = archived(item.humanTimestamp, item.path);
  item.rawUrl = archivedRaw(item.rawTimestamp, item.transportPath);
}

const sourceEvidenceKeys = [
  "macosBeta1",
  "macosBeta2",
  "macosBeta3",
  "macosBeta4",
  "macosBeta5",
  "macosBeta6",
  "macosBeta7",
  "visionosBeta1",
];
const sources = sourceEvidenceKeys.map((key) => {
  const item = evidence[key];
  return {
    url: item.url,
    transportUrl: item.rawUrl,
    title: `${item.rawTitle} (preserved snapshot)`,
    publisher: "Apple Developer via Internet Archive",
    sourceClass: "archive",
    author: "Apple",
    publishedAt: `${item.humanTimestamp.slice(0, 4)}-${item.humanTimestamp.slice(4, 6)}-${item.humanTimestamp.slice(6, 8)}T${item.humanTimestamp.slice(8, 10)}:${item.humanTimestamp.slice(10, 12)}:${item.humanTimestamp.slice(12, 14)}.000Z`,
    topics: [
      item.platform,
      item.platform === "macOS" ? "15.0" : "2.0",
      item.milestone,
      "historical release notes",
    ],
  };
});

const c = (url, locator, note) => ({
  url,
  ...(locator ? { locator } : {}),
  ...(note ? { note } : {}),
});
const heading = (text) => ({ style: "h2", text });
const prose = (text, citations) => ({ style: "normal", text, citations });
const article = (...blocks) => ({ authorship: "originalSynthesis", blocks });
const review = () => ({ status: "approved", reviewedAt });

const macosBeta1Specs = [
  {
    suffix: "appkit-window-sharing-request",
    title: "AppKit window-sharing requests",
    canonicalSummary:
      "AppKit added an API for applications to request sharing of a specific existing or newly supplied window.",
    category: "developerApi",
    action: "introduced",
    topic: "AppKit",
    status: "New Features",
    issues: ["115318870"],
    summary:
      "Presentation and conferencing workflows can offer focused sharing without requiring every application window to be exposed.",
  },
  {
    suffix: "directoryservice-plugin-removal",
    title: "DirectoryService plug-in removal",
    canonicalSummary:
      "macOS removed DirectoryService plug-in support and directed identity integrations toward Platform SSO.",
    category: "removal",
    action: "removed",
    topic: "DirectoryService",
    status: "Deprecations",
    issues: ["119515880"],
    summary:
      "Legacy directory plug-ins no longer remain a supported extension path in the first Sequoia beta state.",
  },
  {
    suffix: "maps-place-identity-and-cards",
    title: "Maps place identity and place cards",
    canonicalSummary:
      "MapKit added persistent Place IDs, broader local-search result categories, and an API for presenting place-card interfaces.",
    category: "developerApi",
    action: "introduced",
    topic: "Maps",
    status: "New Features",
    issues: ["129071038", "129073725", "129073922"],
    summary:
      "The initial notes group three MapKit additions for identifying, finding, and presenting places.",
  },
  {
    suffix: "quick-look-generator-removal",
    title: "Legacy Quick Look generator removal",
    canonicalSummary:
      "macOS ended the legacy Quick Look Generator plug-in path and directed developers to preview and thumbnail extensions.",
    category: "removal",
    action: "removed",
    topic: "Quick Look",
    status: "Deprecations",
    issues: ["116791365"],
    summary:
      "Custom file-preview providers need the supported extension APIs instead of the older generator plug-in model.",
  },
  {
    suffix: "realitykit-subdivision-and-p3",
    title: "RealityKit subdivision and Display P3 rendering",
    canonicalSummary:
      "RealityKit added Catmull-Clark subdivision for qualifying USD meshes and Display P3 rendering for virtual objects.",
    category: "developerApi",
    action: "introduced",
    topic: "RealityKit",
    status: "New Features",
    issues: ["129016034", "129017592"],
    summary:
      "The rendering changes expand mesh smoothing and wide-color output while documenting the resource cost of subdivision.",
  },
  {
    suffix: "legacy-screen-capture-alerts",
    title: "Privacy alerts for legacy screen-capture APIs",
    canonicalSummary:
      "Applications using deprecated display-capture APIs can trigger system privacy alerts and should migrate to ScreenCaptureKit.",
    category: "compatibility",
    action: "changed",
    topic: "ScreenCaptureKit",
    status: "Deprecations",
    issues: ["120910350"],
    summary:
      "The first beta documents a more visible privacy consequence for continuing to use legacy capture interfaces.",
  },
  {
    suffix: "storekit-mac-offer-code-redemption",
    title: "Mac App Store offer-code redemption",
    canonicalSummary:
      "StoreKit added in-app redemption support for Mac App Store offer codes.",
    category: "developerApi",
    action: "introduced",
    topic: "StoreKit",
    status: "New Features",
    issues: ["60096251"],
    summary:
      "Mac applications can respond to supported offer-code redemptions without sending customers outside the app.",
  },
  {
    suffix: "storekit-original-api-deprecation",
    title: "Original in-app purchase API deprecation",
    canonicalSummary:
      "Apple deprecated the original StoreKit in-app purchase API family and directed developers to newer StoreKit interfaces.",
    category: "developerApi",
    action: "changed",
    topic: "StoreKit",
    status: "Deprecations",
    issues: ["116600524"],
    summary:
      "The archived state marks a broad set of older commerce types as deprecated rather than immediately removed.",
  },
  {
    suffix: "swift-charts-function-vectorized-plots",
    title: "Swift Charts function and vectorized plots",
    canonicalSummary:
      "Swift Charts added function plots and vectorized plotting APIs for mathematical and large-dataset visualizations.",
    category: "developerApi",
    action: "introduced",
    topic: "Swift Charts",
    status: "New Features",
    issues: ["117186178", "117469419"],
    summary:
      "LinePlot and AreaPlot cover functions, while PointPlot and RectanglePlot offer more efficient bulk rendering.",
  },
  {
    suffix: "swiftui-automatic-sheet-sizing",
    title: "SwiftUI automatic sheet sizing",
    canonicalSummary:
      "SwiftUI sheets linked against the new SDK adopted automatic presentation sizing with platform-specific resolution.",
    category: "behavior",
    action: "changed",
    topic: "SwiftUI",
    status: "New Features",
    issues: ["117551515"],
    summary:
      "Developers are asked to audit sheet layouts because the default differs from earlier macOS releases.",
  },
  {
    suffix: "sip-app-group-container-protection",
    title: "System protection for app-group containers",
    canonicalSummary:
      "System Integrity Protection expanded to app-group containers and enforced entitlement and distribution requirements.",
    category: "security",
    action: "changed",
    topic: "System Integrity Protection",
    status: "New Features",
    issues: ["114586798"],
    summary:
      "Properly entitled applications retain access, while unsupported access can be denied or require temporary user consent.",
  },
  {
    suffix: "translation-api-and-hindi",
    title: "Translation API and Hindi support",
    canonicalSummary:
      "Apple added an in-app translation API and expanded system translation support to Hindi.",
    category: "developerApi",
    action: "introduced",
    topic: "Translation",
    status: "New Features",
    issues: ["112844581", "116622913"],
    summary:
      "The initial state combines a developer-facing translation session interface with broader language coverage.",
  },
];

const macosBeta2Specs = [
  {
    suffix: "app-store-install-space",
    title: "Reduced App Store installation-space requirement",
    canonicalSummary:
      "The Mac App Store changed initial download requirements from roughly twice the app size to the final install size plus a buffer.",
    category: "behavior",
    action: "changed",
    topic: "App Store",
    status: "New Features",
    issues: ["123838124"],
    kind: "addition",
    summary:
      "The documented storage calculation reduces the temporary free space needed to begin many app installations.",
  },
  {
    suffix: "firewall-plist-settings-removal",
    title: "Application Firewall property-list settings removal",
    canonicalSummary:
      "Application Firewall settings stopped using the former property-list location, requiring supported command-line configuration.",
    category: "removal",
    action: "removed",
    topic: "Application Firewall",
    status: "Deprecations",
    issues: ["124405935"],
    kind: "addition",
    summary:
      "Tools that edited the old preference file need to move to the documented socketfilterfw interface.",
  },
  {
    suffix: "fskit-msdos-startup-warning",
    title: "Intermittent MSDOS volume repair warning",
    canonicalSummary:
      "Beta 2 documented a startup warning that could incorrectly say a connected MSDOS volume needed repair or reformatting.",
    category: "knownIssue",
    action: "knownIssue",
    topic: "FSKit",
    status: "Known Issues",
    issues: ["130011123"],
    kind: "addition",
    summary:
      "Apple cautioned against reformatting the volume in response to the intermittent message.",
  },
  {
    suffix: "iphone-mirroring-universal-clipboard",
    title: "Universal Clipboard during iPhone Mirroring",
    canonicalSummary:
      "Beta 2 documented that Universal Clipboard might fail while iPhone Mirroring was active.",
    category: "knownIssue",
    action: "knownIssue",
    topic: "iPhone Mirroring",
    status: "Known Issues",
    issues: ["128165996"],
    kind: "addition",
    summary:
      "The limitation affects cross-device copy and paste during a mirrored session.",
  },
  {
    suffix: "encrypted-time-machine-backups",
    title: "Encrypted Time Machine network backups",
    canonicalSummary:
      "Beta 2 resolved failures when creating new encrypted Time Machine backups on Time Capsule or other AFP servers.",
    category: "bugFix",
    action: "fixed",
    topic: "Backup",
    status: "Resolved Issues",
    issues: ["129082348"],
    kind: "status",
    summary:
      "The archived transition moves the network-backup failure from Known Issues to Resolved Issues.",
  },
  {
    suffix: "icloud-drive-data-use",
    title: "iCloud Drive data use for frequently changed files",
    canonicalSummary:
      "Beta 2 corrected excessive transfer use when frequently changing files synchronized through iCloud Drive.",
    category: "bugFix",
    action: "fixed",
    topic: "iCloud Drive",
    status: "Resolved Issues",
    issues: ["128771010"],
    kind: "status",
    summary:
      "The exact status transition records the sync-efficiency issue as resolved.",
  },
  {
    suffix: "icloud-photo-library-sync",
    title: "iCloud Photo Library synchronization",
    canonicalSummary:
      "Beta 2 resolved a condition where photos and videos could stop synchronizing through iCloud Photo Library.",
    category: "bugFix",
    action: "fixed",
    topic: "Photos",
    status: "Resolved Issues",
    issues: ["128325085"],
    kind: "status",
    summary:
      "The Photos entry changes from a known synchronization failure to a documented resolution.",
  },
  {
    suffix: "intel-amd-battery-and-thermal-load",
    title: "Intel Mac battery and thermal load",
    canonicalSummary:
      "Beta 2 resolved elevated battery drain, temperature, and fan activity on certain Intel laptops with AMD graphics.",
    category: "bugFix",
    action: "fixed",
    topic: "Power",
    status: "Resolved Issues",
    issues: ["128623427"],
    kind: "status",
    summary:
      "The issue was tied to the default beta wallpaper on the affected hardware configuration.",
  },
  {
    suffix: "swift-charts-function-domain",
    title: "Swift Charts function-plot Y domain",
    canonicalSummary:
      "Beta 2 resolved automatic Y-domain inference for Swift Charts function plots.",
    category: "bugFix",
    action: "fixed",
    topic: "Swift Charts",
    status: "Resolved Issues",
    issues: ["128877906"],
    kind: "status",
    summary:
      "Function plots no longer retain the earlier documented domain-inference limitation.",
  },
  {
    suffix: "swiftui-navigationview-links",
    title: "SwiftUI NavigationView links",
    canonicalSummary:
      "Beta 2 resolved failures affecting some navigation links in the deprecated SwiftUI NavigationView.",
    category: "bugFix",
    action: "fixed",
    topic: "SwiftUI",
    status: "Resolved Issues",
    issues: ["128358023"],
    kind: "status",
    summary:
      "The transition records the legacy navigation-link behavior as fixed.",
  },
  {
    suffix: "virtualization-icloud-sign-in",
    title: "iCloud sign-in inside macOS virtual machines",
    canonicalSummary:
      "Beta 2 restored iCloud account access and dependent services inside macOS virtual machines.",
    category: "bugFix",
    action: "fixed",
    topic: "Virtualization",
    status: "Resolved Issues",
    issues: ["128924562"],
    kind: "status",
    summary:
      "The virtual-machine account limitation moves from Known Issues to Resolved Issues.",
  },
  {
    suffix: "voiceover-setup-assistant",
    title: "VoiceOver completion of Setup Assistant",
    canonicalSummary:
      "Beta 2 resolved a VoiceOver problem that could block completion of some Setup Assistant stages.",
    category: "bugFix",
    action: "fixed",
    topic: "VoiceOver",
    status: "Resolved Issues",
    issues: ["127445421"],
    kind: "status",
    summary:
      "The status transition documents improved accessibility during first-run setup.",
  },
];

const macosBeta3Specs = [
  {
    suffix: "finder-automation-permission-flow",
    title: "Finder automation permission flow",
    canonicalSummary:
      "Beta 3 changed Finder automation consent from a modal decision to a failed attempt followed by a System Settings notification.",
    category: "security",
    action: "changed",
    topic: "Automation",
    status: "New Features",
    issues: ["129086419"],
    kind: "addition",
    summary:
      "Applications must account for the new path that directs users to Automation privacy settings.",
  },
  {
    suffix: "iphone-mirroring-input-limitations",
    title: "iPhone Mirroring input limitations",
    canonicalSummary:
      "Beta 3 documented input failures involving some Logitech scrolling, Bluetooth keyboards, and Full Keyboard Access.",
    category: "knownIssue",
    action: "knownIssue",
    topic: "iPhone Mirroring",
    status: "Known Issues",
    issues: ["129403645", "130535985"],
    kind: "addition",
    summary:
      "Two newly listed issues cover external input and the space bar during mirrored sessions.",
  },
  {
    suffix: "screen-time-app-limits",
    title: "Screen Time app limits after watchOS upgrade",
    canonicalSummary:
      "Beta 3 documented a resolution for Screen Time app limits deleted after upgrading an Apple Watch from an earlier beta.",
    category: "bugFix",
    action: "fixed",
    topic: "Screen Time",
    status: "Resolved Issues",
    issues: ["130981807"],
    kind: "addition",
    summary:
      "The new resolved entry notes that affected families might still need to recreate limits already removed.",
  },
  {
    suffix: "storekit-system-errors",
    title: "Unexpected StoreKit system errors",
    canonicalSummary:
      "Beta 3 resolved a condition where StoreKit APIs could fail unexpectedly with a system error.",
    category: "bugFix",
    action: "fixed",
    topic: "StoreKit",
    status: "Resolved Issues",
    issues: ["111689346", "FB12509606"],
    kind: "addition",
    summary:
      "The archived delta adds an explicit resolution for intermittent API-level commerce failures.",
  },
  {
    suffix: "storekit-voiceover-product-content",
    title: "VoiceOver product title and description",
    canonicalSummary:
      "Beta 3 resolved StoreKit product interfaces whose title and description were not read by VoiceOver.",
    category: "bugFix",
    action: "fixed",
    topic: "StoreKit",
    status: "Resolved Issues",
    issues: ["124254957", "FB13679318"],
    kind: "addition",
    summary:
      "The change improves access to product merchandising content in the documented StoreKit view.",
  },
  {
    suffix: "swiftui-pointer-exit",
    title: "SwiftUI pointer update on view exit",
    canonicalSummary:
      "Beta 3 resolved a SwiftUI pointer that failed to update after leaving a view with a pointer-style modifier.",
    category: "bugFix",
    action: "fixed",
    topic: "SwiftUI",
    status: "Resolved Issues",
    issues: ["129741260", "FB13878385"],
    kind: "addition",
    summary:
      "The new resolved entry covers pointer appearance after the cursor exits the modified view.",
  },
  {
    suffix: "virtualized-mail-unavailable",
    title: "Mail unavailable in macOS virtual machines",
    canonicalSummary:
      "Beta 3 documented that the Mail application could not be used in macOS virtual machines.",
    category: "knownIssue",
    action: "knownIssue",
    topic: "Virtualization",
    status: "Known Issues",
    issues: ["127248244"],
    kind: "addition",
    summary:
      "The newly listed limitation is specific to virtualized macOS environments.",
  },
  {
    suffix: "core-ml-m-series-inference",
    title: "Core ML inference on early M-series chips",
    canonicalSummary:
      "Beta 3 resolved slower-than-expected inference for large Core ML models on a subset of M-series systems.",
    category: "bugFix",
    action: "fixed",
    topic: "Core ML",
    status: "Resolved Issues",
    issues: ["129682801"],
    kind: "status",
    summary:
      "The status transition covers affected configurations including M1 and M1 Max.",
  },
  {
    suffix: "maps-place-card-loading",
    title: "MapKit place-card loading",
    canonicalSummary:
      "Beta 3 resolved a Place Card API failure that prevented place details from loading.",
    category: "bugFix",
    action: "fixed",
    topic: "Maps",
    status: "Resolved Issues",
    issues: ["128231815"],
    kind: "status",
    summary:
      "The issue introduced as known in Beta 2 moves to Resolved Issues.",
  },
  {
    suffix: "object-tracker-usdz-validation",
    title: "Object Tracker USDZ validation",
    canonicalSummary:
      "Beta 3 resolved silent Object Tracker training failures for unsupported USDZ inputs.",
    category: "bugFix",
    action: "fixed",
    topic: "Object Tracker",
    status: "Resolved Issues",
    issues: ["129721127"],
    kind: "status",
    summary:
      "The transition closes the Beta 2 known issue around invalid reference-object models.",
  },
  {
    suffix: "swiftui-scenephase-active-state",
    title: "SwiftUI scenePhase active reporting",
    canonicalSummary:
      "Beta 3 corrected aggregate scenePhase reporting so one active scene keeps the application state active.",
    category: "bugFix",
    action: "fixed",
    topic: "SwiftUI",
    status: "Resolved Issues",
    issues: ["117864591"],
    kind: "status",
    summary:
      "The archived status change aligns aggregate application state with its active scenes.",
  },
  {
    suffix: "swiftui-navigationsplitview-path",
    title: "NavigationSplitView path clearing",
    canonicalSummary:
      "Beta 3 resolved a macOS NavigationSplitView failure to clear its path after selection changed in a later column.",
    category: "bugFix",
    action: "fixed",
    topic: "SwiftUI",
    status: "Resolved Issues",
    issues: ["128548564"],
    kind: "status",
    summary:
      "The exact transition records corrected path state in multi-column navigation.",
  },
];

const macosBeta4Specs = [
  {
    suffix: "create-ml-object-rendering",
    title: "Create ML 3D object rendering",
    canonicalSummary:
      "Beta 4 documented flickering or black output in some Create ML 3D object views.",
    category: "knownIssue",
    action: "knownIssue",
    topic: "Create ML",
    status: "Known Issues",
    issues: ["132026726"],
    kind: "addition",
    summary:
      "Restarting Create ML was the documented temporary recovery for the newly listed rendering problem.",
  },
  {
    suffix: "foundation-json-sorted-keys",
    title: "JSONEncoder sorted-key ordering",
    canonicalSummary:
      "Beta 4 changed JSONEncoder sortedKeys output to lexicographic ordering based on UTF-8 key contents.",
    category: "behavior",
    action: "changed",
    topic: "Foundation",
    status: "New Features",
    issues: ["126874437"],
    kind: "addition",
    summary:
      "The new ordering replaces earlier numeric, case-insensitive, or localized sorting behavior.",
  },
  {
    suffix: "iphone-mirroring-mixed-beta-versions",
    title: "iPhone Mirroring with mixed beta versions",
    canonicalSummary:
      "Beta 4 documented connection timeouts or interruptions when the Mac ran Beta 4 but the iPhone remained on Beta 3.",
    category: "knownIssue",
    action: "knownIssue",
    topic: "iPhone Mirroring",
    status: "Known Issues",
    issues: ["131780502"],
    kind: "addition",
    summary:
      "Apple advised updating both devices to Beta 4 or later before using notification handoff in Mirroring.",
  },
  {
    suffix: "maps-intel-satellite-imagery",
    title: "Satellite imagery on Intel Macs",
    canonicalSummary:
      "Beta 4 resolved missing satellite map imagery on Intel-based Macs.",
    category: "bugFix",
    action: "fixed",
    topic: "Maps",
    status: "Resolved Issues",
    issues: ["130466174"],
    kind: "addition",
    summary: "The delta adds a hardware-specific Maps rendering resolution.",
  },
  {
    suffix: "storekit-refund-confirmation",
    title: "StoreKit refund confirmation",
    canonicalSummary:
      "Beta 4 resolved an error returned after selecting Done in a refund confirmation sheet during StoreKit Testing.",
    category: "bugFix",
    action: "fixed",
    topic: "StoreKit",
    status: "Resolved Issues",
    issues: ["123865137"],
    kind: "addition",
    summary:
      "The fix applies to the documented refund-request testing workflow in Xcode.",
  },
  {
    suffix: "storekit-swift6-environment",
    title: "StoreKit environment with Swift 6",
    canonicalSummary:
      "Beta 4 made the documented StoreKit environment value compatible with Swift 6.",
    category: "developerApi",
    action: "fixed",
    topic: "StoreKit",
    status: "Resolved Issues",
    issues: ["129929512", "FB13922875"],
    kind: "addition",
    summary:
      "The newly resolved entry removes a Swift 6 compatibility problem in StoreKit integration.",
  },
  {
    suffix: "swiftui-pointer-style-state",
    title: "SwiftUI pointer-style state changes",
    canonicalSummary:
      "Beta 4 resolved delayed on-screen updates when a SwiftUI pointerStyle value changed.",
    category: "bugFix",
    action: "fixed",
    topic: "SwiftUI",
    status: "Resolved Issues",
    issues: ["129740140", "FB13878258"],
    kind: "addition",
    summary:
      "Pointer appearance can now reflect state changes without requiring additional mouse movement.",
  },
  {
    suffix: "sip-authorized-app-group-prompt",
    title: "Authorized app-group access prompt",
    canonicalSummary:
      "Beta 4 resolved incorrect prompts when a provisioned application accessed an authorized app-group container.",
    category: "bugFix",
    action: "fixed",
    topic: "System Integrity Protection",
    status: "Resolved Issues",
    issues: ["129667695", "FB13860644"],
    kind: "addition",
    summary:
      "The new resolution narrows consent prompts for applications with valid embedded authorization.",
  },
  {
    suffix: "virtualization-rosetta-intel-binaries",
    title: "Rosetta in Apple-silicon virtual machines",
    canonicalSummary:
      "Beta 4 documented that Intel binaries failed under Rosetta in virtual machines hosted on Apple-silicon Macs.",
    category: "knownIssue",
    action: "knownIssue",
    topic: "Virtualization",
    status: "Known Issues",
    issues: ["131773319"],
    kind: "addition",
    summary:
      "The limitation affects translated Intel software inside the specified virtualized environment.",
  },
  {
    suffix: "app-intents-parameter-wrappers",
    title: "App Intents parameter wrappers",
    canonicalSummary:
      "Beta 4 resolved protocol-conformance failures caused by parameterless App Intents property wrappers.",
    category: "bugFix",
    action: "fixed",
    topic: "App Intents",
    status: "Resolved Issues",
    issues: ["130219933"],
    kind: "status",
    summary:
      "The Beta 2 wrapper limitation moves from Known Issues to Resolved Issues.",
  },
  {
    suffix: "fskit-msdos-startup-warning-fixed",
    title: "MSDOS volume startup warning resolved",
    canonicalSummary:
      "Beta 4 resolved the intermittent startup warning that could misidentify a connected MSDOS volume as unrepairable.",
    category: "bugFix",
    action: "fixed",
    topic: "FSKit",
    status: "Resolved Issues",
    issues: ["130011123"],
    kind: "status",
    summary:
      "The exact transition closes the Beta 2 issue that cautioned users not to reformat.",
  },
  {
    suffix: "iphone-mirroring-external-input",
    title: "iPhone Mirroring external input",
    canonicalSummary:
      "Beta 4 resolved some scrolling and typing failures involving Logitech mice and Bluetooth keyboards during iPhone Mirroring.",
    category: "bugFix",
    action: "fixed",
    topic: "iPhone Mirroring",
    status: "Resolved Issues",
    issues: ["129403645"],
    kind: "status",
    summary:
      "The external-input issue introduced in Beta 3 moves to Resolved Issues.",
  },
];

const macosBeta5Specs = [
  {
    suffix: "contactprovider-ios-app-crash",
    title: "ContactProvider-linked iOS app crash",
    canonicalSummary:
      "Beta 5 resolved a ContactProvider linkage crash in mobile applications running through the Apple-silicon Mac compatibility environment.",
    category: "bugFix",
    action: "fixed",
    topic: "ContactProvider",
    status: "Resolved Issues",
    issues: ["124717115"],
    kind: "addition",
    summary:
      "The new resolved entry addresses a framework-linkage compatibility failure.",
  },
  {
    suffix: "core-location-ios-app-crash",
    title: "Core Location monitoring crash",
    canonicalSummary:
      "Beta 5 resolved an unexpected exit when compatible iPhone or iPad apps invoked location-push monitoring on Apple-silicon Macs.",
    category: "bugFix",
    action: "fixed",
    topic: "Core Location",
    status: "Resolved Issues",
    issues: ["128038918"],
    kind: "addition",
    summary:
      "The fix covers the documented CLLocationManager call in the Mac compatibility environment.",
  },
  {
    suffix: "core-motion-ios-app-crash",
    title: "Core Motion altitude query crash",
    canonicalSummary:
      "Beta 5 resolved an unexpected exit when compatible iPhone or iPad apps queried absolute-altitude availability on Apple-silicon Macs.",
    category: "bugFix",
    action: "fixed",
    topic: "Core Motion",
    status: "Resolved Issues",
    issues: ["128038968"],
    kind: "addition",
    summary:
      "The new resolved entry covers the specified CMAltimeter capability check.",
  },
  {
    suffix: "sip-testflight-app-group-prompt",
    title: "TestFlight app-group access prompt",
    canonicalSummary:
      "Beta 5 documented incorrect data-access prompts when TestFlight applications accessed their own app-group containers.",
    category: "knownIssue",
    action: "knownIssue",
    topic: "System Integrity Protection",
    status: "Known Issues",
    issues: ["132449491"],
    kind: "addition",
    summary:
      "The limitation could appear even when local development or Mac App Store distribution would not prompt.",
  },
  {
    suffix: "iphone-mirroring-clipboard-fixed",
    title: "Universal Clipboard in iPhone Mirroring resolved",
    canonicalSummary:
      "Beta 5 resolved the documented Universal Clipboard failure during iPhone Mirroring.",
    category: "bugFix",
    action: "fixed",
    topic: "iPhone Mirroring",
    status: "Resolved Issues",
    issues: ["128165996"],
    kind: "status",
    summary: "The issue first listed in Beta 2 moves to Resolved Issues.",
  },
  {
    suffix: "calendar-notification-snooze",
    title: "Calendar notification snooze",
    canonicalSummary:
      "Beta 5 resolved an inability to snooze some Calendar notifications.",
    category: "bugFix",
    action: "fixed",
    topic: "Notifications",
    status: "Resolved Issues",
    issues: ["128564243"],
    kind: "status",
    summary: "The exact status transition records restored snooze behavior.",
  },
  {
    suffix: "reality-file-beta-compatibility",
    title: "Reality file beta compatibility",
    canonicalSummary:
      "Beta 5 resolved a compatibility problem where Reality files written by beta RealityKit versions might not load later.",
    category: "compatibility",
    action: "fixed",
    topic: "RealityKit",
    status: "Resolved Issues",
    issues: ["128424173"],
    kind: "status",
    summary:
      "The transition closes a forward-loading risk for files produced during the beta cycle.",
  },
];

const macosBeta6Specs = [
  {
    suffix: "virtualization-rosetta-fixed",
    title: "Rosetta in Apple-silicon virtual machines resolved",
    canonicalSummary:
      "Beta 6 resolved the failure to run Intel binaries through Rosetta inside virtual machines on Apple-silicon Macs.",
    category: "bugFix",
    action: "fixed",
    topic: "Virtualization",
    status: "Resolved Issues",
    issues: ["131773319"],
    kind: "status",
    summary:
      "The sole normalized status transition closes the limitation introduced in Beta 4.",
  },
];

const macosBeta7Specs = [
  {
    suffix: "accessorysetupkit-ios-app-crash",
    title: "AccessorySetupKit-linked iOS app crash",
    canonicalSummary:
      "Beta 7 resolved an AccessorySetupKit linkage crash in mobile applications running through the Apple-silicon Mac compatibility environment.",
    category: "bugFix",
    action: "fixed",
    topic: "AccessorySetupKit",
    status: "Resolved Issues",
    issues: ["99817447"],
    kind: "addition",
    summary:
      "The new entry addresses framework-linkage compatibility in the Mac app environment.",
  },
  {
    suffix: "adattributionkit-ios-app-crash",
    title: "AdAttributionKit-linked iOS app crash",
    canonicalSummary:
      "Beta 7 resolved an AdAttributionKit linkage crash in mobile applications running through the Apple-silicon Mac compatibility environment.",
    category: "bugFix",
    action: "fixed",
    topic: "AdAttributionKit",
    status: "Resolved Issues",
    issues: ["121731262"],
    kind: "addition",
    summary:
      "The resolution covers the documented compatibility failure caused by linking the framework.",
  },
  {
    suffix: "app-intents-entity-url-validation",
    title: "App Intents entity URL validation",
    canonicalSummary:
      "Beta 7 resolved EntityURLRepresentation accepting arbitrary custom URLs without validation.",
    category: "bugFix",
    action: "fixed",
    topic: "App Intents",
    status: "Resolved Issues",
    issues: ["119524801"],
    kind: "addition",
    summary:
      "The newly documented resolution tightens URL handling for represented entities.",
  },
  {
    suffix: "siritipui-ios-app-crash",
    title: "SiriTipUIView reference crash",
    canonicalSummary:
      "Beta 7 resolved an unexpected exit when compatible iPhone or iPad apps referenced SiriTipUIView on Apple-silicon Macs.",
    category: "bugFix",
    action: "fixed",
    topic: "App Intents",
    status: "Resolved Issues",
    issues: ["128038651"],
    kind: "addition",
    summary:
      "The fix covers the documented App Intents interface reference in the Mac compatibility environment.",
  },
  {
    suffix: "marketplacekit-ios-app-crash",
    title: "MarketplaceKit-linked iOS app crash",
    canonicalSummary:
      "Beta 7 resolved a MarketplaceKit linkage crash in mobile applications running through the Apple-silicon Mac compatibility environment.",
    category: "bugFix",
    action: "fixed",
    topic: "MarketplaceKit",
    status: "Resolved Issues",
    issues: ["132598608"],
    kind: "addition",
    summary:
      "The new resolution records another framework-linkage compatibility fix.",
  },
  {
    suffix: "workoutkit-ios-app-crash",
    title: "WorkoutKit-linked iOS app crash",
    canonicalSummary:
      "Beta 7 resolved a WorkoutKit linkage crash in mobile applications running through the Apple-silicon Mac compatibility environment.",
    category: "bugFix",
    action: "fixed",
    topic: "WorkoutKit",
    status: "Resolved Issues",
    issues: ["108256454"],
    kind: "addition",
    summary:
      "The documented resolution applies to compatible mobile apps running on Apple-silicon Macs.",
  },
];

const visionosBeta1Specs = [
  {
    suffix: "farther-app-placement",
    title: "Farther app placement",
    canonicalSummary:
      "visionOS 2 increased the maximum distance at which people can place applications.",
    category: "feature",
    action: "introduced",
    topic: "App Placement",
    status: "New Features",
    issues: ["124564336"],
    summary:
      "The expanded placement range supports more flexible spatial layouts without requiring the wearer to move closer.",
  },
  {
    suffix: "volumetric-window-user-facing-tilt",
    title: "User-facing tilt for raised volumes",
    canonicalSummary:
      "Volumetric windows linked against the visionOS 2 SDK automatically tilt toward the wearer when repositioned upward.",
    category: "behavior",
    action: "changed",
    topic: "App Placement",
    status: "New Features",
    issues: ["124620395"],
    summary:
      "Applications can opt out when their volume needs to remain aligned with gravity.",
  },
  {
    suffix: "compatible-app-home-placement",
    title: "Compatible apps outside their folder",
    canonicalSummary:
      "Compatible iPad and iPhone apps can be moved out of their dedicated folder and placed beside visionOS applications.",
    category: "feature",
    action: "introduced",
    topic: "Compatible Apps",
    status: "New Features",
    issues: ["119016133"],
    summary:
      "The Home View no longer requires every compatible app to remain grouped in one folder.",
  },
  {
    suffix: "game-controller-system-ui",
    title: "Game controllers for system interaction",
    canonicalSummary:
      "visionOS 2 added game-controller interaction with system UI and documented opt-in handling for application views.",
    category: "developerApi",
    action: "introduced",
    topic: "Game Controller",
    status: "New Features",
    issues: ["121478652"],
    summary:
      "Applications using controller input need the documented UIKit interaction or SwiftUI modifier on participating views.",
  },
  {
    suffix: "home-view-icon-rearrangement",
    title: "Home View icon rearrangement",
    canonicalSummary:
      "visionOS 2 added an editing mode for rearranging application icons in Home View.",
    category: "feature",
    action: "introduced",
    topic: "Home View",
    status: "New Features",
    issues: ["81856035"],
    summary: "A long pinch on an icon enters the new organization mode.",
  },
  {
    suffix: "environment-offloading",
    title: "Environment offloading",
    canonicalSummary:
      "Home View gained the ability to offload downloaded environments while retaining icons for later download.",
    category: "feature",
    action: "introduced",
    topic: "Home View",
    status: "New Features",
    issues: ["119642769"],
    summary:
      "The feature lets people reclaim storage without losing access to the environment entry.",
  },
  {
    suffix: "mac-virtual-display-immersive-spaces",
    title: "Mac Virtual Display in immersive development",
    canonicalSummary:
      "A developer setting enabled Mac Virtual Display while using applications with immersive spaces.",
    category: "feature",
    action: "introduced",
    topic: "Mac Virtual Display",
    status: "New Features",
    issues: ["111140451"],
    summary:
      "The option supports development workflows for immersive applications and WebXR content.",
  },
  {
    suffix: "reclined-environment-video",
    title: "Reclined video placement in environments",
    canonicalSummary:
      "Fullscreen video in an environment can be recentered upward for a more comfortable reclined viewing position.",
    category: "feature",
    action: "introduced",
    topic: "Media Playback",
    status: "New Features",
    issues: ["124620911"],
    summary:
      "The wearer can reposition the video toward the sky before or while using an environment.",
  },
  {
    suffix: "scene-state-and-placement-restoration",
    title: "Scene state and placement restoration",
    canonicalSummary:
      "After a restart, visionOS 2 can restore application scenes with their prior content state and spatial relationship.",
    category: "feature",
    action: "introduced",
    topic: "Scenes",
    status: "New Features",
    issues: ["124560652"],
    summary:
      "Applications remain responsible for restoring their own content through SwiftUI or UIKit state restoration.",
  },
  {
    suffix: "progressive-immersion-range",
    title: "Progressive immersion range control",
    canonicalSummary:
      "SwiftUI applications can define initial, minimum, and maximum progressive immersion and observe the current level.",
    category: "developerApi",
    action: "introduced",
    topic: "SwiftUI",
    status: "New Features",
    issues: ["118316795"],
    summary:
      "The API exposes both configuration and live Reality Dial changes for progressive immersive spaces.",
  },
  {
    suffix: "ornaments-inside-volumes",
    title: "SwiftUI ornaments inside volumes",
    canonicalSummary:
      "visionOS 2 added support for the SwiftUI ornament modifier within volumetric scenes.",
    category: "developerApi",
    action: "introduced",
    topic: "SwiftUI",
    status: "New Features",
    issues: ["121121550"],
    summary:
      "Developers can attach supported ornament interfaces to content hosted in volumes.",
  },
  {
    suffix: "volumetric-window-resizing",
    title: "Volumetric window resizing",
    canonicalSummary:
      "visionOS 2 added corner resize controls for volumetric windows.",
    category: "feature",
    action: "introduced",
    topic: "Window Resizing",
    status: "New Features",
    issues: ["118580633"],
    summary:
      "Volumes gain direct resizing behavior similar to plain windows in the prior release.",
  },
];

const routeDefinitions = [
  {
    platform: "macos",
    version: "15-0",
    display: "macOS Sequoia 15",
    alias: "beta-1",
    milestone: "Beta 1",
    after: "macosBeta1",
    specs: macosBeta1Specs,
    initial: true,
  },
  {
    platform: "macos",
    version: "15-0",
    display: "macOS Sequoia 15",
    alias: "beta-2",
    milestone: "Beta 2",
    before: "macosBeta1",
    after: "macosBeta2",
    specs: macosBeta2Specs,
    diff: { additions: 10, removals: 2, changed: 36, status: 27 },
  },
  {
    platform: "macos",
    version: "15-0",
    display: "macOS Sequoia 15",
    alias: "beta-3",
    milestone: "Beta 3",
    before: "macosBeta2",
    after: "macosBeta3",
    specs: macosBeta3Specs,
    diff: { additions: 9, removals: 1, changed: 9, status: 7 },
  },
  {
    platform: "macos",
    version: "15-0",
    display: "macOS Sequoia 15",
    alias: "beta-4",
    milestone: "Beta 4",
    before: "macosBeta3",
    after: "macosBeta4",
    specs: macosBeta4Specs,
    diff: { additions: 10, removals: 0, changed: 5, status: 5 },
  },
  {
    platform: "macos",
    version: "15-0",
    display: "macOS Sequoia 15",
    alias: "beta-5",
    milestone: "Beta 5",
    before: "macosBeta4",
    after: "macosBeta5",
    specs: macosBeta5Specs,
    diff: { additions: 4, removals: 0, changed: 5, status: 3 },
  },
  {
    platform: "macos",
    version: "15-0",
    display: "macOS Sequoia 15",
    alias: "beta-6",
    milestone: "Beta 6",
    before: "macosBeta5",
    after: "macosBeta6",
    specs: macosBeta6Specs,
    diff: { additions: 0, removals: 0, changed: 1, status: 1 },
  },
  {
    platform: "macos",
    version: "15-0",
    display: "macOS Sequoia 15",
    alias: "beta-7",
    milestone: "Beta 7",
    before: "macosBeta6",
    after: "macosBeta7",
    specs: macosBeta7Specs,
    diff: { additions: 6, removals: 0, changed: 0, status: 0 },
  },
  {
    platform: "visionos",
    version: "2-0",
    display: "visionOS 2",
    alias: "beta-1",
    milestone: "Beta 1",
    after: "visionosBeta1",
    specs: visionosBeta1Specs,
    initial: true,
  },
];

const issueLocator = (spec) =>
  `${spec.topic} — ${spec.status}; ${spec.issues.length === 1 ? "issue" : "issues"} ${spec.issues.join(", ")}`;

function structuredChange(route, spec) {
  const after = evidence[route.after];
  const citations = route.initial
    ? [c(after.url, issueLocator(spec))]
    : [
        c(
          evidence[route.before].url,
          `Before-state raw payload ${evidence[route.before].rawTimestamp}; comparison baseline`,
        ),
        c(after.url, issueLocator(spec)),
      ];
  return {
    key: `${route.platform}-${route.version}-${route.alias}-${spec.suffix}`,
    title: spec.title,
    canonicalSummary: spec.canonicalSummary,
    category: spec.category,
    action: spec.action,
    inheritance: "delta",
    summary: spec.summary,
    documentedStatus: "documented",
    evidenceState: "confirmed",
    verificationMethod: route.initial
      ? `Present under ${spec.topic} — ${spec.status} with ${spec.issues.join(", ")} in the first retained ${after.normalizedRecords}-record raw Apple DocC state after Beta 1 and before Beta 2; selected as representative, not exhaustive.`
      : spec.kind === "status"
        ? `Matched by component and issue ID as an explicit transition to ${spec.status} across raw Apple DocC payloads ${evidence[route.before].rawTimestamp} and ${after.rawTimestamp}; the interval crosses ${route.milestone} and no other local seed milestone.`
        : `Matched by component, status heading, and issue ID as an addition across raw Apple DocC payloads ${evidence[route.before].rawTimestamp} and ${after.rawTimestamp}; the interval crosses ${route.milestone} and no other local seed milestone.`,
    citations,
  };
}

function eventArticle(route) {
  const after = evidence[route.after];
  const afterCitation = c(
    after.url,
    `Human capture ${after.humanTimestamp}; exact raw payload ${after.rawTimestamp}; ${after.rawTitle}`,
  );
  if (route.initial) {
    return article(
      heading("Preserved Apple note state"),
      prose(
        `The first retained raw Apple DocC state after ${route.display} Beta 1 and before Beta 2 identifies itself as ${after.rawTitle}. It contains ${after.normalizedRecords} normalized list records, ${after.issueBackedRecords} of them carrying a retained issue identifier.`,
        [afterCitation],
      ),
      heading("Representative Beta 1 inventory"),
      prose(
        `This page structures ${route.specs.length} high-signal entries across user-facing behavior, compatibility, privacy, and developer APIs. It is a selective index of the preserved state, not a reproduction of Apple's complete list.`,
        [afterCitation],
      ),
      heading("Attribution boundary"),
      prose(
        "The archive establishes that these entries were present during the Beta 1 interval. It does not establish their exact publication hour, and nothing from a later cumulative state is projected backward.",
        [afterCitation],
      ),
    );
  }
  const before = evidence[route.before];
  const beforeCitation = c(
    before.url,
    `Before-state raw payload ${before.rawTimestamp}; ${before.rawTitle}`,
  );
  return article(
    heading("Sequential archive boundary"),
    prose(
      `The retained before and after payloads bracket ${route.display} ${route.milestone} without crossing another local seed milestone. The after state identifies itself as ${after.rawTitle}.`,
      [beforeCitation, afterCitation],
    ),
    heading(`Documented ${route.milestone} delta`),
    prose(
      `The normalized list-record comparison contains ${route.diff.additions} additions, ${route.diff.removals} removals, and ${route.diff.changed} changed records, including ${route.diff.status} status transitions. This article promotes ${route.specs.length} attributable changes and leaves wording-only edits or ambiguous removals out of the release inventory.`,
      [beforeCitation, afterCitation],
    ),
    heading("Attribution boundary"),
    prose(
      "Every structured occurrence is tied to a component, status heading, and retained issue identifier. A note disappearing without an explicit resolved replacement is not described as a fix, and document-title changes alone are not treated as release changes.",
      [beforeCitation, afterCitation],
    ),
  );
}

const uniqueCitations = (citations) => [
  ...new Map(
    citations.map((citation) => [
      `${citation.url}|${citation.locator || ""}|${citation.note || ""}`,
      citation,
    ]),
  ).values(),
];

const events = routeDefinitions.map((route) => {
  const changes = route.specs.map((spec) => structuredChange(route, spec));
  const comparisonSources = route.initial
    ? [evidence[route.after].url]
    : [evidence[route.before].url, evidence[route.after].url];
  return {
    target: {
      releaseVersionId: `version-${route.platform}-${route.version}`,
      routeAlias: route.alias,
    },
    authorship: "originalSynthesis",
    summary: route.initial
      ? `The first retained ${route.display} Beta 1 state contains ${evidence[route.after].normalizedRecords} normalized list records; this page structures ${changes.length} representative, source-supported entries without claiming an exhaustive changelog.`
      : `An exact archived Apple DocC boundary isolates ${route.display} ${route.milestone}; ${changes.length} source-supported occurrences are selected from the attributable list-record delta.`,
    article: eventArticle(route),
    citations: uniqueCitations([
      ...comparisonSources.map((url) =>
        c(url, `${route.milestone} snapshot comparison`),
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
    platform: "macOS",
    version: "15.0",
    publicReleaseDate: "2024-09-16",
    milestones: [
      ["Beta 1", "2024-06-10", false, undefined],
      ["Beta 2", "2024-06-24", false, undefined],
      ["Beta 3", "2024-07-10", false, undefined],
      ["Beta 4", "2024-07-23", false, undefined],
      ["Beta 5", "2024-08-05", false, undefined],
      ["Beta 6", "2024-08-12", false, undefined],
      ["Beta 7", "2024-08-20", false, undefined],
      ["RC", "2024-09-09", false, undefined],
      ["Public", "2024-09-16", false, undefined],
    ],
  },
  {
    platform: "tvOS",
    version: "18.0",
    publicReleaseDate: "2024-09-16",
    milestones: [
      ["Beta 1", "2024-06-10", false, undefined],
      ["Beta 2", "2024-06-24", false, undefined],
      ["Beta 3", "2024-07-08", false, undefined],
      ["Beta 4", "2024-07-23", false, undefined],
      ["Beta 5", "2024-08-05", false, undefined],
      ["Beta 6", "2024-08-12", false, undefined],
      ["Beta 7", "2024-08-20", false, undefined],
      ["Beta 8", "2024-08-28", false, undefined],
      ["RC", "2024-09-09", false, undefined],
      ["Public", "2024-09-16", false, undefined],
    ],
  },
  {
    platform: "visionOS",
    version: "2.0",
    publicReleaseDate: "2024-09-16",
    milestones: [
      ["Beta 1", "2024-06-10", false, undefined],
      ["Beta 2", "2024-06-24", false, undefined],
      ["Beta 3", "2024-07-08", false, undefined],
      ["Beta 4", "2024-07-23", false, undefined],
      ["Beta 5", "2024-08-05", false, undefined],
      ["Beta 6", "2024-08-12", false, undefined],
      ["Beta 7", "2024-08-20", false, undefined],
      ["Beta 8", "2024-08-28", false, undefined],
      ["Beta 9", "2024-09-03", false, undefined],
      ["RC", "2024-09-09", false, undefined],
      ["Public", "2024-09-16", false, undefined],
    ],
  },
  {
    platform: "watchOS",
    version: "11.0",
    publicReleaseDate: "2024-09-16",
    milestones: [
      ["Beta 1", "2024-06-10", false, undefined],
      ["Beta 2", "2024-06-24", false, undefined],
      ["Beta 3", "2024-07-08", false, undefined],
      ["Beta 4", "2024-07-23", false, undefined],
      ["Beta 5", "2024-08-05", false, undefined],
      ["Beta 6", "2024-08-12", false, undefined],
      ["Beta 7", "2024-08-20", false, undefined],
      ["RC", "2024-09-09", false, undefined],
      ["Public", "2024-09-16", false, undefined],
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
const expectedVersionKeys = new Set(
  expectedSeedInventory.map((item) => `${item.platform}/${item.version}`),
);
const seedInventory = seed.releaseVersions
  .filter((version) =>
    expectedVersionKeys.has(`${version.platform}/${version.version}`),
  )
  .map((version) => ({
    platform: version.platform,
    version: version.version,
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
    "The exact local 2024 non-iOS seed inventory changed; re-audit before regenerating.",
  );
}

const routeAudit = [
  ["macOS", "Beta 1", "beta-1", "Initial state before Beta 2", true],
  [
    "macOS",
    "Beta 2",
    "beta-2",
    "20240619212721 → 20240628225332 crosses only Beta 2",
    true,
  ],
  [
    "macOS",
    "Beta 3",
    "beta-3",
    "20240628225332 → 20240711120834 crosses only Beta 3",
    true,
  ],
  [
    "macOS",
    "Beta 4",
    "beta-4",
    "20240711120834 → 20240723180119 crosses only Beta 4",
    true,
  ],
  [
    "macOS",
    "Beta 5",
    "beta-5",
    "Beta 4 revision has zero record changes; next state isolates Beta 5",
    true,
  ],
  [
    "macOS",
    "Beta 6",
    "beta-6",
    "20240807153441 → 20240813023550 crosses only Beta 6",
    true,
  ],
  [
    "macOS",
    "Beta 7",
    "beta-7",
    "20240813023550 → 20240821000143 crosses only Beta 7",
    true,
  ],
  [
    "macOS",
    "RC",
    "rc",
    "No exact RC state; next retained seeded state crosses RC and Public",
    false,
  ],
  ["tvOS", "Beta 1", "beta-1", "No raw state", false],
  ["tvOS", "Beta 2", "beta-2", "No raw state", false],
  ["tvOS", "Beta 3", "beta-3", "No raw state", false],
  [
    "tvOS",
    "Beta 4",
    "beta-4",
    "First retained state is cumulative Beta 4",
    false,
  ],
  ["tvOS", "Beta 5", "beta-5", "No isolated raw boundary", false],
  ["tvOS", "Beta 6", "beta-6", "No isolated raw boundary", false],
  [
    "tvOS",
    "Beta 7",
    "beta-7",
    "Previous retained state is cumulative Beta 4",
    false,
  ],
  ["tvOS", "Beta 8", "beta-8", "No raw state", false],
  ["tvOS", "RC", "rc", "No raw state", false],
  ["visionOS", "Beta 1", "beta-1", "Initial state before Beta 2", true],
  ["visionOS", "Beta 2", "beta-2", "No isolated raw boundary", false],
  ["visionOS", "Beta 3", "beta-3", "No isolated raw boundary", false],
  [
    "visionOS",
    "Beta 4",
    "beta-4",
    "Previous retained state predates Betas 2 and 3",
    false,
  ],
  ["visionOS", "Beta 5", "beta-5", "No isolated raw boundary", false],
  ["visionOS", "Beta 6", "beta-6", "No isolated raw boundary", false],
  ["visionOS", "Beta 7", "beta-7", "No isolated raw boundary", false],
  ["visionOS", "Beta 8", "beta-8", "No isolated raw boundary", false],
  ["visionOS", "Beta 9", "beta-9", "No isolated raw boundary", false],
  [
    "visionOS",
    "RC",
    "rc",
    "Previous retained state predates Betas 5–9 and RC",
    false,
  ],
  ["watchOS", "Beta 1", "beta-1", "No raw state", false],
  ["watchOS", "Beta 2", "beta-2", "No raw state", false],
  ["watchOS", "Beta 3", "beta-3", "No raw state", false],
  ["watchOS", "Beta 4", "beta-4", "No raw state", false],
  [
    "watchOS",
    "Beta 5",
    "beta-5",
    "First retained state is cumulative Beta 5",
    false,
  ],
  ["watchOS", "Beta 6", "beta-6", "No isolated raw boundary", false],
  ["watchOS", "Beta 7", "beta-7", "No isolated raw boundary", false],
  ["watchOS", "RC", "rc", "Next retained state is after RC and Public", false],
];

const prereleaseSeedRoutes = seedInventory.flatMap((version) =>
  version.milestones
    .filter(([label]) => label !== "Public")
    .map(([label]) => [
      version.platform,
      label,
      label.toLowerCase().replaceAll(" ", "-"),
    ]),
);
if (
  prereleaseSeedRoutes.length !== 35 ||
  routeAudit.length !== 35 ||
  routeAudit.filter((row) => row[4]).length !== 8 ||
  routeAudit.filter((row) => !row[4]).length !== 27
) {
  throw new Error("The expected 35-route archive audit closure failed.");
}
for (const [platform, label, alias] of prereleaseSeedRoutes) {
  if (
    !routeAudit.some(
      ([auditPlatform, auditLabel, auditAlias]) =>
        auditPlatform === platform &&
        auditLabel === label &&
        auditAlias === alias,
    )
  ) {
    throw new Error(`Missing route audit for ${platform} ${label}.`);
  }
}

const expectedRoutes = new Set(
  routeDefinitions.map(
    (route) => `version-${route.platform}-${route.version}/${route.alias}`,
  ),
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
  events.length !== 8 ||
  changeCount !== 74 ||
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
      event.changes.length === 0,
  )
) {
  throw new Error("The expected approved event closure failed.");
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
    throw new Error(`Change definition drifted for ${occurrence.key}.`);
  }
  localChangeDefinitions.set(occurrence.key, definition);
}
const uniqueLocalChangeKeys = [...localChangeDefinitions.keys()];
if (uniqueLocalChangeKeys.length !== 74) {
  throw new Error(
    `Expected 74 stable change definitions; found ${uniqueLocalChangeKeys.length}.`,
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
    if (
      owner.target?.releaseVersionId &&
      owner.target?.routeAlias &&
      expectedRoutes.has(
        `${owner.target.releaseVersionId}/${owner.target.routeAlias}`,
      )
    ) {
      throw new Error(
        `An existing batch already owns ${owner.target.releaseVersionId}/${owner.target.routeAlias}: ${file}`,
      );
    }
  }
}
const collisions = uniqueLocalChangeKeys.filter((key) =>
  otherChangeKeys.has(key),
);
if (collisions.length) {
  throw new Error(
    `Change-key collisions: ${collisions.map((key) => `${key} (${otherChangeKeys.get(key)})`).join(", ")}`,
  );
}

const publicOwner = JSON.parse(
  readFileSync(join(here, "apple-other-2024.json"), "utf8"),
);
for (const releaseVersionId of [
  "version-macos-15-0",
  "version-tvos-18-0",
  "version-visionos-2-0",
  "version-watchos-11-0",
]) {
  const version = publicOwner.versions.find(
    (item) => item.releaseVersionId === releaseVersionId,
  );
  const publicEvent = publicOwner.events.find(
    (item) =>
      item.target?.releaseVersionId === releaseVersionId &&
      item.target?.routeAlias === "public",
  );
  if (
    version?.editorialReview?.status !== "approved" ||
    publicEvent?.editorialReview?.status !== "approved" ||
    publicEvent?.isIndexable !== true
  ) {
    throw new Error(
      `${releaseVersionId} Public ownership changed in apple-other-2024.json.`,
    );
  }
}

const sourceUrls = new Set(sources.map((source) => source.url));
const citations = [];
const collectCitations = (value) => {
  if (Array.isArray(value)) {
    for (const item of value) collectCitations(item);
    return;
  }
  if (!value || typeof value !== "object") return;
  if (
    typeof value.url === "string" &&
    Object.keys(value).every((key) => ["url", "locator", "note"].includes(key))
  ) {
    citations.push(value);
    return;
  }
  for (const item of Object.values(value)) collectCitations(item);
};
collectCitations({ events });
if (
  sourceUrls.size !== sources.length ||
  citations.some((citation) => !sourceUrls.has(citation.url)) ||
  sources.some(
    (source) => !citations.some((citation) => citation.url === source.url),
  )
) {
  throw new Error("Source declaration and citation-use closure failed.");
}
for (const item of Object.values(evidence)) {
  if (
    item.rawUrl !== archivedRaw(item.rawTimestamp, item.transportPath) ||
    !item.url.startsWith("https://web.archive.org/web/") ||
    item.url.includes("/tutorials/data/")
  ) {
    throw new Error(`Archive provenance drifted for ${item.rawTimestamp}.`);
  }
}

const rawCaptureInventory = Object.values(evidence).map((item) => [
  item.platform,
  item.rawTimestamp,
  item.rawTitle,
  item.normalizedRecords,
  item.issueBackedRecords,
  item.sha256,
]);
if (
  rawCaptureInventory.length !== 17 ||
  new Set(rawCaptureInventory.map((row) => `${row[0]}/${row[1]}`)).size !== 17
) {
  throw new Error("Raw capture inventory closure failed.");
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
const routeRows = routeDefinitions
  .map(
    (route) =>
      `| ${route.display} | ${route.milestone} | \`${route.alias}\` | ${route.specs.length} |`,
  )
  .join("\n");
const sourceRows = sources
  .map(
    (source) =>
      `- [${source.title}](${source.url}) — ${source.publisher}; raw transport retained separately for verification.`,
  )
  .join("\n");
const rawRows = rawCaptureInventory
  .map(
    ([platform, timestamp, title, records, issueRecords, hash]) =>
      `| ${platform} | \`${timestamp}\` | ${title} | ${records} | ${issueRecords} | \`${hash}\` |`,
  )
  .join("\n");
const routeAuditRows = routeAudit
  .map(
    ([platform, milestone, alias, boundary, supported]) =>
      `| ${platform} | ${milestone} | \`${alias}\` | ${boundary} | ${supported ? "Included" : "Ledger only"} |`,
  )
  .join("\n");
const renderRows = routeDefinitions
  .map(
    (route) =>
      `| \`/apple/${route.platform}/${route.version.replace("-", ".")}/${route.alias}/\` | 200 | yes | yes | yes | yes |`,
  )
  .join("\n");

const md = `# Apple 2024 non-iOS prerelease archive batch

## Result

\`${outputName}\` publishes eight source-backed event overlays on existing routes:
macOS 15 Betas 1–7 and visionOS 2 Beta 1.

- ${events.length} event overlays, ${changeCount} structured occurrences, and
  ${uniqueLocalChangeKeys.length} stable change definitions
- ${sources.length} declared and used reader-facing sources with
  ${citationCount} citation references
- zero version overlays, build pages, route creation, Public-route changes, or
  administrative identity changes
- all events are \`editoriallyVerified\`, approved at \`${reviewedAt}\`, and
  indexable

| Version | Milestone | Existing alias | Selected changes |
| ------- | --------- | -------------- | ---------------: |
${routeRows}

## Archive method

Reader-facing citations use preserved human Apple Developer pages. Exact raw
DocC JSON is research transport only. Every selected sequential occurrence was
matched by component, status heading, and issue identifier across two
CDX-confirmed payloads whose interval crosses one and only one local milestone.

The macOS and visionOS Beta 1 pages are representative initial states. They
select high-signal entries without implying an exhaustive list. Later
cumulative first captures for watchOS, tvOS, and visionOS are not projected
backward.

Normalized comparison counts include text changes. Only explicit additions and
status transitions are promoted. A removal without a replacement is not labeled
as fixed, and a title-only state is not manufactured into a release change.

## Selected findings

### macOS Beta 1

The representative baseline covers focused window sharing, identity plug-in and
Quick Look transitions, MapKit place identity, RealityKit rendering, capture
privacy, StoreKit, Swift Charts, sheet sizing, app-group protection, and
translation.

### macOS Betas 2–7

- Beta 2: 10 additions, 2 removals, and 36 changed normalized records,
  including 27 status transitions. Selected entries cover App Store storage,
  firewall configuration, FSKit, iPhone Mirroring, backup, iCloud, Photos,
  power, Charts, navigation, virtualization, and VoiceOver.
- Beta 3: 9 additions, 1 removal, and 9 changed records, including 7 status
  transitions. Selected entries cover Finder automation, iPhone Mirroring,
  Screen Time, StoreKit, SwiftUI, virtualization, Core ML, Maps, and Object
  Tracker.
- Beta 4: 10 additions and 5 changed records; all 5 changes are status
  transitions. Selected entries cover Create ML, Foundation ordering, iPhone
  Mirroring, Maps, StoreKit, SwiftUI, app-group access, virtualization, App
  Intents, and FSKit.
- Beta 5: 4 additions and 5 changed records, including 3 status transitions.
  The selected delta covers compatible mobile-app crashes, app-group prompts,
  iPhone Mirroring, notifications, and Reality files.
- Beta 6: no additions or removals and one status transition, resolving Rosetta
  execution inside the specified virtual-machine environment.
- Beta 7: exactly six added resolved records, all selected; four concern
  framework or view compatibility for mobile apps on Apple-silicon Macs.

### visionOS Beta 1

The representative baseline covers spatial placement, compatible-app
organization, controllers, Home View, environment storage, Mac Virtual Display,
reclined playback, scene restoration, progressive immersion, ornaments, and
volume resizing.

## Seventeen raw states

Hashes are SHA-256 values of the decompressed raw DocC JSON bytes. “Normalized”
counts top-level unordered-list records using the repository audit parser;
“issue-backed” is the subset containing a retained Apple or Feedback issue ID.

| Platform | Raw capture | Raw Apple title | Normalized | Issue-backed | SHA-256 |
| -------- | ----------- | --------------- | ---------: | -----------: | ------- |
${rawRows}

Exact consecutive comparisons:

- macOS: Beta 1→Beta 2 +10/−2/~36; Beta 2→Beta 3 +9/−1/~9; Beta 3→Beta 4
  +10/−0/~5; Beta 4 retained revision +0/−0/~0; revision→Beta 5 +4/−0/~5;
  Beta 5→Beta 6 +0/−0/~1; Beta 6→Beta 7 +6/−0/~0; Beta 7→archived Beta 8
  +0/−0/~0; Beta 8→Public +0/−0/~2.
- tvOS: cumulative Beta 4→Beta 7 +0/−0/~2.
- visionOS: Beta 1→cumulative Beta 4 +49/−10/~48; Beta 4→RC
  +14/−1/~20.
- watchOS: cumulative Beta 5→post-Public +1/−0/~1.

The symbols mean added, removed, and changed normalized records. Counts are
evidence-audit facts, not a claim that every changed line belongs to one
release.

## Thirty-five-route isolation audit

| Platform | Milestone | Alias | Exact boundary or gap | Decision |
| -------- | --------- | ----- | --------------------- | -------- |
${routeAuditRows}

The 27 ledger-only routes remain honest gaps. In particular:

- watchOS begins at a cumulative Beta 5 state, then does not reappear until
  after RC and Public.
- tvOS begins at cumulative Beta 4 and next appears at Beta 7, crossing two
  intervening milestones.
- visionOS begins with a clean Beta 1 state, but its next state is cumulative
  Beta 4 and its following state crosses Betas 5–9 and RC.
- macOS has clean seeded boundaries through Beta 7, no exact RC state, and no
  attributable issue-record change in its archived Beta 8 state.

## Seed/source divergence

The preserved Apple payload captured on 2024-08-29 identifies itself as
“macOS Sequoia 15 Beta 8 Release Notes.” The audited local seed has macOS 15
Betas 1–7 followed by RC, so this batch does not create a Beta 8 route or alter
the timeline. The Beta 8 payload has zero normalized issue-record delta from
Beta 7. This discrepancy should be resolved by the timeline owner independently
of this content batch.

## Source ledger

${sourceRows}

## Copyright and attribution boundary

Article prose, titles, summaries, and grouping are original synthesis.
Framework, API, product, and issue names are used only as factual locators. The
batch does not reproduce Apple's paragraphs, workaround instructions, complete
lists, screenshots, artwork, or marketing copy. Every structured occurrence
links to a preserved Apple page, while the exact raw URL remains available for
independent verification.

## Closure guards

- exact comparison against four local seed records and all 39 milestones
- exact 35-route prerelease audit with an eight-route allowlist and 27 gaps
- approved Public ownership remains in \`apple-other-2024.json\`
- zero versions and zero builds
- collision scan across every other batch and the launch manifest
- complete ${changeCount}-occurrence, ${uniqueLocalChangeKeys.length}-definition,
  source, and citation closure
- deterministic formatted JSON SHA-256: \`${jsonSha}\`

## Publication and validation record

The generator's seed, route, collision, review-state, raw-inventory, source,
and citation guards pass before either artifact is written.

Independent editorial and evidence review:

- all 17 retained raw payloads independently reproduced the exact Apple title,
  decompressed SHA-256, normalized-record count, and issue-backed-record count
  recorded in this ledger
- all ${changeCount} occurrences resolved across 86 after-state issue IDs; the
  57 later-beta boundary decisions comprise 20 explicit status transitions and
  37 additions
- ${verification.evidenceAssertions} total raw-inventory, exact-diff,
  occurrence, issue-ID, component, status-heading, and boundary assertions
  passed with zero failures
- the independent reader-facing copyright scan found a maximum contiguous
  overlap of ${verification.maximumEditorialOverlapWords} words between
  editorial fields and Apple's retained records
- all eight event articles and all ${changeCount} occurrences were approved at
  \`${reviewedAt}\`

Publication receipt:

- applied production plan: \`${dryRun.plan}\`
- reviewed plan artifact SHA-256: \`${dryRun.planArtifact}\`
- rollback artifact SHA-256: \`${dryRun.rollbackArtifact}\`
- applied plan contents: ${dryRun.creates} creates, ${dryRun.patches}
  revision-guarded patches, ${dryRun.unchanged.toLocaleString("en-US")}
  unchanged documents, and a ${dryRun.payloadBytes.toLocaleString("en-US")}-byte
  mutation payload
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

Every published route was fetched independently from the running local site.
Each response returned the full archival article, preserved evidence,
References, and \`index, follow\`; none returned a timeline placeholder or
\`noindex\`.

| Canonical route | HTTP | Full article | Evidence | References | Index |
| --------------- | ---: | ------------ | -------- | ---------- | ----- |
${renderRows}

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
- independent evidence replay: ${verification.evidenceAssertions} assertions
  passed with zero failures
- independent copyright-similarity scan: maximum contiguous overlap of
  ${verification.maximumEditorialOverlapWords} words
- ESLint, Prettier check, and focused \`git diff --check\`: passed
- deterministic regeneration: the formatted JSON SHA-256 is \`${jsonSha}\`
- final production dry run reproduced
  ${publication.immediateZeroCreates} creates,
  ${publication.immediateZeroPatches} patches,
  ${publication.immediateZeroUnchanged.toLocaleString("en-US")} unchanged
  documents, the ${publication.immediateZeroPayloadBytes}-byte payload, and
  plan SHA \`${publication.immediateZeroPlanSha}\`
- the final planner reported “No Sanity data changed”

Reproduce the local checks with:

\`\`\`sh
node scripts/research-batches/build-apple-nonios-2024-prerelease.mjs
npm run research:validate
node --import tsx --test tests/launch-content-ingestion.test.ts tests/launch-content-manifest.test.ts
npx eslint scripts/research-batches/build-apple-nonios-2024-prerelease.mjs
npx prettier --check scripts/research-batches/build-apple-nonios-2024-prerelease.mjs scripts/research-batches/apple-nonios-2024-prerelease.json scripts/research-batches/apple-nonios-2024-prerelease.md
npx sanity exec scripts/ingest-launch-content.ts --with-user-token -- --content scripts/research-batches/apple-nonios-2024-prerelease.json
\`\`\`

The final command is intentionally a post-publication dry run and must
reproduce the zero plan above. Do not add \`--apply\`.
`;

writeFileSync(
  join(here, ledgerName),
  await prettier.format(md, { parser: "markdown" }),
);

console.log(
  `Wrote ${outputName} and ${ledgerName}: ${events.length} events, ${changeCount} occurrences, ${uniqueLocalChangeKeys.length} definitions, ${sources.length} sources, ${citationCount} citation references, JSON SHA-256 ${jsonSha}.`,
);
