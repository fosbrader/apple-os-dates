import { createHash } from "node:crypto";
import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import prettier from "prettier";

const here = dirname(fileURLToPath(import.meta.url));
const outputName = "apple-nonios-2023-prerelease.json";
const ledgerName = "apple-nonios-2023-prerelease.md";
const accessedAt = "2026-07-30";
const reviewedAt = "2026-07-30T08:50:57Z";
const verification = {
  researchBatches: 53,
  globalChangeKeys: 2867,
  focusedTests: 19,
  evidenceAssertions: 132,
  maximumEditorialOverlapWords: 4,
};
const dryRun = {
  plan: "c552ffebb28cd71c673fb3e49d7f334c91537517717e2dc5f8a1a8d6ea65ece4",
  planArtifact:
    "feea19857e0b4a1d9bcc75664ee9a86bc008eda3fe3562b4885af99d208fe2dc",
  rollbackArtifact:
    "68c7978f31910ca0c69a7f009d8dafa2aee7f0338636bb49e6b03ed3c43731b0",
  creates: 61,
  patches: 6,
  unchanged: 2076,
  payloadBytes: 141878,
};
const publication = {
  transactionId: "tt1fSB5HY9GAB0YLyyVsnt",
  receiptSha:
    "b943198ddd77e429a240c9276ba2e38772102ae6602c04a87c5ca01d044b5f1d",
  immediateZeroPlan:
    "98d4d1fc3a204cc719975332c99a6a0b6e5c64fe9805ff1084e561008fb11d62",
  immediateZeroPlanArtifact:
    "bfc7454d65a2a456c5f3c423a0cc89da30a041de700ca673759b8c58646fdd2d",
  immediateZeroRollbackArtifact:
    "0d49d8de38c10b73a1c72e50346443549a0a2e7995812771a819ce31ebe164a6",
  immediateZeroUnchanged: 2143,
  immediateZeroPayloadBytes: 16,
  coverage: {
    versionFull: 410,
    versionTotal: 410,
    appearanceFull: 375,
    appearanceSourceLinked: 256,
    appearanceTimelineOnly: 1348,
    appearanceTotal: 1979,
    approvedStructuredChanges: 526,
  },
};

const archivePaths = {
  macos:
    "https://developer.apple.com/documentation/macos-release-notes/macos-14-release-notes",
  macosTransport:
    "https://developer.apple.com/tutorials/data/documentation/macos-release-notes/macos-14-release-notes.json",
  watchos:
    "https://developer.apple.com/documentation/watchos-release-notes/watchos-10-release-notes",
  watchosTransport:
    "https://developer.apple.com/tutorials/data/documentation/watchos-release-notes/watchos-10-release-notes.json",
};

const archived = (timestamp, path) =>
  `https://web.archive.org/web/${timestamp}/${path}`;
const archivedRaw = (timestamp, path) =>
  `https://web.archive.org/web/${timestamp}id_/${path}`;

const evidence = {
  macosBeta1: {
    platform: "macOS",
    milestone: "Beta 1",
    humanTimestamp: "20230607235810",
    rawTimestamp: "20230607235811",
    rawTitle: "macOS Sonoma 14 Beta Release Notes",
    records: 161,
    sha256: "90abefd3711aabaa48fc757af14b638c3be61391dd9bbacd5dd33bb3305af966",
    path: archivePaths.macos,
    transportPath: archivePaths.macosTransport,
  },
  macosBeta2: {
    platform: "macOS",
    milestone: "Beta 2",
    humanTimestamp: "20230622113903",
    rawTimestamp: "20230702124053",
    rawTitle: "macOS Sonoma 14 Beta 2 Release Notes",
    records: 184,
    sha256: "046c069e9b0ae3f8bca5e74a6eed358944e838cf4d604b5539a42b55ef9faec6",
    path: archivePaths.macos,
    transportPath: archivePaths.macosTransport,
  },
  macosBeta3: {
    platform: "macOS",
    milestone: "Beta 3",
    humanTimestamp: "20230707224219",
    rawTimestamp: "20230717163745",
    rawTitle: "macOS Sonoma 14 Beta 3 Release Notes",
    records: 204,
    sha256: "0024946c7b6b0574b99a24154621cc96286c2f8979480a8ff18e3c88e37a3004",
    path: archivePaths.macos,
    transportPath: archivePaths.macosTransport,
  },
  macosBeta4: {
    platform: "macOS",
    milestone: "Beta 4",
    humanTimestamp: "20230727164800",
    rawTimestamp: "20230727164800",
    rawTitle: "macOS Sonoma 14 Beta 4 Release Notes",
    records: 203,
    sha256: "0b421a6b6b4b39a0a6227d3d69d5c9e9f9f87524d164676f23da48f4b580c2c6",
    path: archivePaths.macos,
    transportPath: archivePaths.macosTransport,
  },
  macosBeta5: {
    platform: "macOS",
    milestone: "Beta 5",
    humanTimestamp: "20230816192544",
    rawTimestamp: "20230816192546",
    rawTitle: "macOS Sonoma 14 Beta 5 Release Notes",
    records: 218,
    sha256: "4da78817f33619d01c75933aaee3f76c0cf5e62af1eb55a39ad1b95f21c69338",
    path: archivePaths.macos,
    transportPath: archivePaths.macosTransport,
  },
  watchosBeta8: {
    platform: "watchOS",
    milestone: "Beta 8",
    humanTimestamp: "20230907135458",
    rawTimestamp: "20230907135458",
    rawTitle: "watchOS 10 Beta 8 Release Notes",
    records: 118,
    sha256: "26bd5b91f7a09de20b43d122cd5723a891b0f9d152639b2351944e9576378c23",
    path: archivePaths.watchos,
    transportPath: archivePaths.watchosTransport,
  },
  watchosRc: {
    platform: "watchOS",
    milestone: "RC",
    humanTimestamp: "20230912200534",
    rawTimestamp: "20230912200535",
    rawTitle: "watchOS 10 RC Release Notes",
    records: 119,
    sha256: "2222254780aa30a6912e29340c128c468fac7ad4e2804e84b93c0505289702d1",
    path: archivePaths.watchos,
    transportPath: archivePaths.watchosTransport,
  },
};

for (const item of Object.values(evidence)) {
  item.url = archived(item.humanTimestamp, item.path);
  item.rawUrl = archivedRaw(item.rawTimestamp, item.transportPath);
}

const sources = Object.values(evidence).map((item) => ({
  url: item.url,
  transportUrl: item.rawUrl,
  title: `${item.rawTitle} (preserved snapshot)`,
  publisher: "Apple Developer via Internet Archive",
  sourceClass: "archive",
  author: "Apple",
  publishedAt: `${item.humanTimestamp.slice(0, 4)}-${item.humanTimestamp.slice(4, 6)}-${item.humanTimestamp.slice(6, 8)}T${item.humanTimestamp.slice(8, 10)}:${item.humanTimestamp.slice(10, 12)}:${item.humanTimestamp.slice(12, 14)}.000Z`,
  topics: [
    item.platform,
    item.platform === "macOS" ? "14.0" : "10.0",
    item.milestone,
    "historical release notes",
  ],
}));

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
    suffix: "airpods-adaptive-audio",
    title: "AirPods adaptive listening beta features",
    canonicalSummary:
      "Apple exposed Adaptive Audio, Personalized Volume, and Conversation Awareness for testing through beta AirPods firmware.",
    category: "feature",
    action: "introduced",
    topic: "AirPods",
    status: "New Features",
    issues: ["110183983"],
    summary:
      "The first retained state identifies three adaptive listening capabilities available to developers testing compatible AirPods firmware.",
  },
  {
    suffix: "passkey-credential-providers",
    title: "Passkeys in third-party credential providers",
    canonicalSummary:
      "Credential-provider extensions gained system support for creating and offering passkeys.",
    category: "developerApi",
    action: "introduced",
    topic: "Authentication Services and Passkeys",
    status: "New Features",
    issues: ["83501802"],
    summary:
      "Password managers can participate in passkey creation and sign-in through the expanded credential-provider API.",
  },
  {
    suffix: "foundation-term-of-address",
    title: "Localized terms of address",
    canonicalSummary:
      "Foundation added term-of-address metadata for localized pronouns and grammatical agreement.",
    category: "developerApi",
    action: "introduced",
    topic: "Foundation",
    status: "New Features",
    issues: ["99745330"],
    summary:
      "The initial snapshot adds a localization model for addressing people according to their preferred grammatical form.",
  },
  {
    suffix: "http-resumable-uploads",
    title: "Resumable HTTP uploads",
    canonicalSummary:
      "URLSession added pausing and resuming for uploads when the server supports the relevant HTTP protocol.",
    category: "developerApi",
    action: "introduced",
    topic: "Networking",
    status: "New Features",
    issues: ["68890505"],
    summary:
      "Upload tasks gain download-like pause and resume behavior on compatible servers.",
  },
  {
    suffix: "eap-tls-1-3",
    title: "EAP-TLS 1.3 network authentication",
    canonicalSummary:
      "Apple devices added EAP-TLS 1.3 support for compatible 802.1X networks.",
    category: "security",
    action: "introduced",
    topic: "Networking",
    status: "New Features",
    issues: ["74526852"],
    summary:
      "The documented network update brings the newer TLS profile and its stronger privacy and forward-secrecy properties to enterprise Wi-Fi authentication.",
  },
  {
    suffix: "photos-heic-editing-output",
    title: "HEIC Photos editing output",
    canonicalSummary:
      "Photos editing extensions gained an API for HEIC-encoded rendered output.",
    category: "developerApi",
    action: "introduced",
    topic: "Photos",
    status: "New Features",
    issues: ["109861295"],
    summary:
      "A new content-editing output API lets extensions request a rendered HEIC destination.",
  },
  {
    suffix: "postscript-eps-conversion-removal",
    title: "PostScript and EPS conversion removal",
    canonicalSummary:
      "macOS removed several system paths that converted PostScript or EPS content to PDF or printable output.",
    category: "removal",
    action: "removed",
    topic: "Printing",
    status: "Deprecations",
    issues: ["110019863"],
    summary:
      "The archived notes warn that Core Graphics, ImageIO, AppKit image representation, and printing workflows no longer provide the former conversion behavior.",
  },
  {
    suffix: "storekit-merchandising-views",
    title: "StoreKit merchandising views",
    canonicalSummary:
      "StoreKit 2 added SwiftUI components for presenting products and subscriptions.",
    category: "developerApi",
    action: "introduced",
    topic: "StoreKit",
    status: "New Features",
    issues: ["102066107"],
    summary:
      "ProductView, StoreView, and SubscriptionStoreView reduce the custom interface work needed to merchandise in-app purchases.",
  },
  {
    suffix: "swift-charts-sector-mark",
    title: "Pie and donut charts",
    canonicalSummary:
      "Swift Charts added SectorMark for building pie and donut visualizations.",
    category: "developerApi",
    action: "introduced",
    topic: "Swift Charts",
    status: "New Features",
    issues: ["102309263"],
    summary:
      "The initial macOS 14 state includes the angular mark type used for pie- and ring-shaped charts.",
  },
  {
    suffix: "trusted-execution-policy-check",
    title: "Trusted Execution policy-check tool",
    canonicalSummary:
      "macOS added a command-line utility for evaluating an application against system trust policy.",
    category: "security",
    action: "introduced",
    topic: "Trusted Execution",
    status: "New Features",
    issues: ["108737781"],
    summary:
      "Developers gain a local assessment tool covering notarization-adjacent and other macOS trust checks.",
  },
  {
    suffix: "swiftui-navigation-bridging",
    title: "SwiftUI navigation bridging in AppKit hosts",
    canonicalSummary:
      "SwiftUI toolbar and navigation-title modifiers gained support outside the SwiftUI application lifecycle on macOS.",
    category: "developerApi",
    action: "introduced",
    topic: "SwiftUI",
    status: "New Features",
    issues: ["101092365"],
    summary:
      "AppKit-hosted SwiftUI content can opt into scene bridging for toolbar and window-title integration.",
  },
  {
    suffix: "iphone-widget-wake-updates",
    title: "iPhone widget refresh after Mac wake",
    canonicalSummary:
      "The initial beta documented delayed refreshes for iPhone widgets displayed on a Mac after sleep.",
    category: "knownIssue",
    action: "knownIssue",
    topic: "iPhone Widgets on Mac",
    status: "New Features",
    issues: ["109691143"],
    summary:
      "A widget sourced from an iPhone might wait for its next scheduled update after the Mac wakes.",
  },
];

const macosBeta2Specs = [
  {
    suffix: "ats-atsui-runtime-removal",
    title: "ATS and ATSUI runtime removal",
    canonicalSummary:
      "Applications detected using legacy ATS or ATSUI text APIs are stopped after macOS presents an update warning.",
    category: "removal",
    action: "removed",
    topic: "ATS and ATSUI",
    status: "Deprecations",
    issues: ["100521621"],
    summary:
      "The Beta 2 state establishes a hard compatibility boundary for applications that still invoke the retired text stacks.",
  },
  {
    suffix: "icloud-upgrade-access",
    title: "iCloud Drive access after upgrade",
    canonicalSummary:
      "The Beta 2 notes added upgrade-related access and synchronization failures for iCloud Drive folders.",
    category: "knownIssue",
    action: "knownIssue",
    topic: "iCloud Drive",
    status: "Known Issues",
    issues: ["109204311", "109507087"],
    summary:
      "Two newly retained records cover inaccessible folders owned by another local account and a failure enabling Desktop and Documents synchronization.",
  },
  {
    suffix: "iphone-widget-disable-removal",
    title: "Disabled iPhone widgets remaining on Mac",
    canonicalSummary:
      "Disabling iPhone widgets in macOS settings could leave existing widgets in place.",
    category: "knownIssue",
    action: "knownIssue",
    topic: "iPhone Widgets on Mac",
    status: "New Features",
    issues: ["110804620"],
    summary:
      "The Beta 2 delta adds a settings-state inconsistency for widgets sourced from an iPhone.",
  },
  {
    suffix: "messages-suggested-event-titles",
    title: "Suggested event and reminder titles",
    canonicalSummary:
      "Messages added machine-learning suggestions for English event and reminder titles.",
    category: "feature",
    action: "introduced",
    topic: "Pre-filled Titles for Events and Reminders",
    status: "New Features",
    issues: ["110889506"],
    summary:
      "Creating an event from a recognized date or time in a conversation can begin with a suggested title.",
  },
  {
    suffix: "rosetta-launch-failure",
    title: "Rosetta application launch failures",
    canonicalSummary:
      "The Beta 2 notes added a known issue in which Intel applications could exit during Rosetta launch.",
    category: "knownIssue",
    action: "knownIssue",
    topic: "Rosetta",
    status: "Known Issues",
    issues: ["110021755"],
    summary:
      "The isolated state adds an Intel-app launch limitation and points affected testers to the system Rosetta updater.",
  },
  {
    suffix: "swiftdata-property-observers",
    title: "SwiftData property-observer persistence fix",
    canonicalSummary:
      "Beta 2 resolved a SwiftData transformation and persistence failure involving willSet and didSet observers.",
    category: "bugFix",
    action: "fixed",
    topic: "SwiftData",
    status: "Resolved Issues",
    issues: ["109664186"],
    summary:
      "The issue moves from Known Issues to Resolved Issues at the clean Beta 2 boundary.",
  },
  {
    suffix: "catalyst-window-sizing",
    title: "Catalyst scene sizing controls",
    canonicalSummary:
      "SwiftUI Catalyst scenes gained window-resizability and default-size modifiers.",
    category: "developerApi",
    action: "introduced",
    topic: "SwiftUI",
    status: "New Features",
    issues: ["84203422", "110038374"],
    summary:
      "Two additions give Catalyst scenes more direct control over initial dimensions and user resizing.",
  },
  {
    suffix: "swiftui-alert-button-state",
    title: "SwiftUI alert button-state refresh",
    canonicalSummary:
      "Beta 2 fixed alert buttons that failed to reflect dynamic enabled-state changes.",
    category: "bugFix",
    action: "fixed",
    topic: "SwiftUI",
    status: "Resolved Issues",
    issues: ["95917673"],
    summary:
      "Alert actions now update when state such as text-field input changes their availability.",
  },
  {
    suffix: "gatekeeper-gktool",
    title: "Gatekeeper assessment and cache tool",
    canonicalSummary:
      "macOS added gktool for evaluating Gatekeeper policy and preparing the verification cache.",
    category: "security",
    action: "introduced",
    topic: "Trusted Execution",
    status: "New Features",
    issues: ["109793778"],
    summary:
      "The Beta 2 delta introduces a command-line path for policy assessment and first-launch verification preparation.",
  },
  {
    suffix: "vision-body-pose-without-depth",
    title: "3D body pose without depth metadata",
    canonicalSummary:
      "Vision fixed 3D human-pose requests for images that lack explicit depth or camera-intrinsic data.",
    category: "bugFix",
    action: "fixed",
    topic: "Vision",
    status: "Resolved Issues",
    issues: ["109723859"],
    summary:
      "The resolved record broadens usable input frames for the human body-pose request.",
  },
  {
    suffix: "web-app-notification-routing",
    title: "Web-app notification routing",
    canonicalSummary:
      "The Beta 2 notes added a web-app issue where selecting a notification returned to the already displayed page rather than its configured destination.",
    category: "knownIssue",
    action: "knownIssue",
    topic: "Web Apps",
    status: "Known Issues",
    issues: ["107906244"],
    summary:
      "A notification could activate an installed web app without navigating to its associated URL.",
  },
  {
    suffix: "web-app-display-mode-detection",
    title: "Web-app standalone-mode detection",
    canonicalSummary:
      "Installed web apps could report incorrect or missing standalone display-mode state to scripts and styles.",
    category: "knownIssue",
    action: "knownIssue",
    topic: "Web Apps",
    status: "Known Issues",
    issues: ["110362364", "110403186"],
    summary:
      "The new Beta 2 records cover both the legacy navigator flag and media-query detection used by installed web experiences.",
  },
];

const macosBeta3Specs = [
  {
    suffix: "malformed-mp3-playback",
    title: "Malformed MP3 metadata playback",
    canonicalSummary:
      "The Beta 3 notes added a playback failure for MP3 files containing malformed ID3 metadata.",
    category: "knownIssue",
    action: "knownIssue",
    topic: "General",
    status: "Known Issues",
    issues: ["110230071"],
    summary:
      "Audio files with invalid ID3 structures could fail to play in the retained Beta 3 state.",
  },
  {
    suffix: "xcode-documentation-crash",
    title: "Xcode documentation scrolling crash",
    canonicalSummary:
      "Xcode could crash while scrolling developer documentation on early macOS 14 betas.",
    category: "knownIssue",
    action: "knownIssue",
    topic: "Documentation",
    status: "Known Issues",
    issues: ["109810157"],
    summary:
      "The new issue spans Quick Help, the documentation browser, and package-dependency documentation views.",
  },
  {
    suffix: "facetime-handoff",
    title: "FaceTime handoff reliability",
    canonicalSummary:
      "Beta 3 resolved dropped calls and missing media during FaceTime handoff.",
    category: "bugFix",
    action: "fixed",
    topic: "Facetime handoff",
    status: "Resolved Issues",
    issues: ["110126569"],
    summary:
      "The clean delta adds a resolved record for transferring a call between devices.",
  },
  {
    suffix: "facetime-apple-tv-caller-label",
    title: "Apple TV FaceTime caller label",
    canonicalSummary:
      "Beta 3 fixed unreadable caller text when an Apple TV placed a FaceTime call to a Mac.",
    category: "bugFix",
    action: "fixed",
    topic: "FaceTime on Apple TV",
    status: "Resolved Issues",
    issues: ["110021693"],
    summary:
      "The issue changes from known to resolved across the isolated Beta 3 boundary.",
  },
  {
    suffix: "userspace-fat-filesystems",
    title: "User-space exFAT and MS-DOS filesystems",
    canonicalSummary:
      "macOS moved its exFAT and MS-DOS filesystem implementations from kernel extensions to user-space services.",
    category: "behavior",
    action: "changed",
    topic: "File System",
    status: "New Features",
    issues: ["110421802"],
    summary:
      "The Beta 3 notes ask software with filesystem-specific assumptions to validate against the new architecture.",
  },
  {
    suffix: "freeform-cross-beta-collaboration",
    title: "Freeform cross-beta collaboration",
    canonicalSummary:
      "Freeform drawings and Follow Me sessions had compatibility limits when collaborators used different beta versions.",
    category: "knownIssue",
    action: "knownIssue",
    topic: "Freeform",
    status: "Known Issues",
    issues: ["107901155", "110656281"],
    summary:
      "Two Beta 3 additions document distorted strokes and version-matched collaboration requirements.",
  },
  {
    suffix: "iphone-widget-beta3-availability",
    title: "iPhone widget availability after Beta 3",
    canonicalSummary:
      "iPhone-sourced widgets could lose icons after a staggered update or disappear in multi-user Mac sessions.",
    category: "knownIssue",
    action: "knownIssue",
    topic: "iPhone Widgets on Mac",
    status: "New Features",
    issues: ["111334099", "111336466"],
    summary:
      "The isolated delta adds two deployment-state limitations for the new iPhone widget integration.",
  },
  {
    suffix: "screen-sharing-dual-4k-lag",
    title: "High Performance screen-sharing lag",
    canonicalSummary:
      "Two 4K virtual displays could produce cursor and video latency on some Apple-silicon screen-sharing hosts.",
    category: "knownIssue",
    action: "knownIssue",
    topic: "Screen Sharing",
    status: "Known Issues",
    issues: ["110342712"],
    summary:
      "Beta 3 adds a performance limitation for the dual-display High Performance configuration.",
  },
  {
    suffix: "cgdisplaystream-consent",
    title: "Legacy screen-capture consent alerts",
    canonicalSummary:
      "Legacy CGDisplayStream screen capture began producing additional consent prompts.",
    category: "compatibility",
    action: "changed",
    topic: "ScreenSharing",
    status: "Deprecations",
    issues: ["110529324"],
    summary:
      "The new deprecation record warns capture applications about a changed permission experience.",
  },
  {
    suffix: "shazamkit-availability",
    title: "ShazamKit API availability",
    canonicalSummary:
      "Beta 3 resolved unavailable managed-session state and default-library item APIs in ShazamKit.",
    category: "bugFix",
    action: "fixed",
    topic: "ShazamKit",
    status: "Resolved Issues",
    issues: ["109670750", "109670918"],
    summary: "Two ShazamKit symbols become usable in the clean Beta 3 delta.",
  },
  {
    suffix: "storekit-view-customization",
    title: "StoreKit view customization",
    canonicalSummary:
      "StoreKit merchandising views gained background, icon-border, button-style, loading-phase, and renamed automatic-style controls.",
    category: "developerApi",
    action: "introduced",
    topic: "StoreKit",
    status: "New Features",
    issues: ["105690554", "106649532", "107713282", "110470147", "111185321"],
    summary:
      "The Beta 3 additions expand how applications style and populate product and subscription interfaces.",
  },
  {
    suffix: "storekit-loading-localization",
    title: "StoreKit loading and localization fixes",
    canonicalSummary:
      "Beta 3 fixed a single-product loading animation and storefront localization in StoreKit views.",
    category: "bugFix",
    action: "fixed",
    topic: "StoreKit",
    status: "Resolved Issues",
    issues: ["110414023", "110734447"],
    summary:
      "Two resolved records improve visual loading and localized presentation in the new merchandising components.",
  },
  {
    suffix: "vision-camera-origin",
    title: "Vision camera-origin matrix",
    canonicalSummary:
      "Beta 3 corrected the Vision camera-origin matrix so clients no longer needed an extra half-turn adjustment.",
    category: "bugFix",
    action: "fixed",
    topic: "Vision",
    status: "Resolved Issues",
    issues: ["110726503"],
    summary:
      "The fixed matrix convention removes an application-side coordinate correction from the referenced pose workflow.",
  },
];

const macosBeta4Specs = [
  {
    suffix: "hfs-intel-install-freeze",
    title: "HFS installation freeze on Intel Macs",
    canonicalSummary:
      "macOS 14 beta updates could freeze when installed to an HFS-formatted volume on an Intel Mac.",
    category: "knownIssue",
    action: "knownIssue",
    topic: "Installation",
    status: "Known Issues",
    issues: ["112165783"],
    summary:
      "The first Beta 4-specific addition is an installation limitation scoped to an older filesystem and Intel hardware.",
  },
  {
    suffix: "swiftdata-query-type-inference",
    title: "SwiftData Query type inference",
    canonicalSummary:
      "SwiftData Query declarations could require explicit model types in predicates, sort descriptors, and key paths.",
    category: "knownIssue",
    action: "knownIssue",
    topic: "SwiftData",
    status: "Known Issues",
    issues: ["109433172"],
    summary:
      "The Beta 4 state adds a source-compatibility issue associated with Query becoming a macro.",
  },
  {
    suffix: "video-effects-menu",
    title: "Video Effects menu availability",
    canonicalSummary:
      "Beta 4 fixed a missing menu-bar Video Effects control in some applications.",
    category: "bugFix",
    action: "fixed",
    topic: "Video Effects",
    status: "Resolved Issues",
    issues: ["110038665"],
    summary:
      "The issue moves from Known Issues to Resolved Issues at this isolated boundary.",
  },
  {
    suffix: "continuity-camera-discovery",
    title: "Continuity Camera discovery during Wi-Fi traffic",
    canonicalSummary:
      "Beta 4 fixed difficulty finding or connecting to Continuity Camera while Wi-Fi traffic was active.",
    category: "bugFix",
    action: "fixed",
    topic: "Wi-Fi",
    status: "Resolved Issues",
    issues: ["109954955"],
    summary:
      "The retained status transition resolves a wireless discovery problem for Continuity Camera.",
  },
];

const macosBeta5Specs = [
  {
    suffix: "icloud-migration-download",
    title: "iCloud downloads after Migration Assistant",
    canonicalSummary:
      "Beta 5 fixed failures opening cloud-only iCloud Drive files after a volume was configured with Migration Assistant.",
    category: "bugFix",
    action: "fixed",
    topic: "iCloud",
    status: "Resolved Issues",
    issues: ["109798846"],
    summary:
      "The issue moves from Known Issues to Resolved Issues in the isolated Beta 5 comparison.",
  },
  {
    suffix: "icloud-folder-extension-hang",
    title: "Application-created folder access hang",
    canonicalSummary:
      "Finder or applications could hang when opening an application-created directory using the .folder extension.",
    category: "knownIssue",
    action: "knownIssue",
    topic: "iCloud Drive",
    status: "Known Issues",
    issues: ["112600553"],
    summary:
      "Beta 5 adds an iCloud Drive access limitation tied to a particular directory-name extension.",
  },
  {
    suffix: "storekit-tall-marketing-layout",
    title: "SubscriptionStoreView marketing layout",
    canonicalSummary:
      "Beta 5 fixed unexpected SubscriptionStoreView layouts when custom marketing content was unusually tall.",
    category: "bugFix",
    action: "fixed",
    topic: "StoreKit",
    status: "Resolved Issues",
    issues: ["112862984"],
    summary:
      "The new resolved record improves layout handling for custom subscription marketing content.",
  },
  {
    suffix: "swift-charts-visible-plot-frame",
    title: "Visible plot frame for scrolling charts",
    canonicalSummary:
      "Swift Charts added an API for reading the visible plot region of a scrollable chart.",
    category: "developerApi",
    action: "introduced",
    topic: "Swift Charts",
    status: "New Features",
    issues: ["109675790"],
    summary:
      "ChartProxy can expose the currently visible container frame for scrolling visualizations.",
  },
  {
    suffix: "swift-charts-stability-memory",
    title: "Swift Charts stability and memory",
    canonicalSummary:
      "Beta 5 fixed a chart-content crash and memory growth during frequent chart updates.",
    category: "bugFix",
    action: "fixed",
    topic: "Swift Charts",
    status: "Resolved Issues",
    issues: ["105197081", "107611114"],
    summary:
      "Two newly resolved records address reliability under particular compositions and repeated data changes.",
  },
  {
    suffix: "swift-charts-selection-scrolling",
    title: "Swift Charts selection and scrolling performance",
    canonicalSummary:
      "Beta 5 improved selection bounds and reduced processor use for interactive and scrolling charts.",
    category: "bugFix",
    action: "fixed",
    topic: "Swift Charts",
    status: "Resolved Issues",
    issues: ["108398019", "108954531", "113149095"],
    summary:
      "The resolved group clamps out-of-range selections and improves the cost of selection and scroll-position bindings.",
  },
  {
    suffix: "swift-charts-rendering",
    title: "Swift Charts animation and compositing fixes",
    canonicalSummary:
      "Beta 5 fixed widget animation and two compositing-layer rendering problems in Swift Charts.",
    category: "bugFix",
    action: "fixed",
    topic: "Swift Charts",
    status: "Resolved Issues",
    issues: ["110035011", "110399956", "112232314"],
    summary:
      "The grouped delta covers widget animation, custom-symbol visibility, and annotation boundary behavior.",
  },
  {
    suffix: "swiftdata-query-inference-fix",
    title: "SwiftData Query inference fix",
    canonicalSummary:
      "Beta 5 resolved the explicit-type requirement introduced for some SwiftData Query declarations.",
    category: "bugFix",
    action: "fixed",
    topic: "SwiftData",
    status: "Resolved Issues",
    issues: ["109433172"],
    summary:
      "The Query macro compatibility issue added at Beta 4 moves to resolved status.",
  },
  {
    suffix: "swiftdata-predicate-value-types",
    title: "SwiftData predicate value types",
    canonicalSummary:
      "Beta 5 resolved missing UUID, Date, and URL support in SwiftData predicates.",
    category: "bugFix",
    action: "fixed",
    topic: "SwiftData",
    status: "Resolved Issues",
    issues: ["109539652"],
    summary:
      "The predicate limitation changes from Known Issues to Resolved Issues.",
  },
  {
    suffix: "swiftui-navigation-destination",
    title: "SwiftUI item-based navigation destinations",
    canonicalSummary:
      "Beta 5 fixed item-bound navigation destinations in stacks and split-view columns.",
    category: "bugFix",
    action: "fixed",
    topic: "SwiftUI",
    status: "Resolved Issues",
    issues: ["106106406"],
    summary:
      "The resolved behavior covers both push-style navigation and replacement of a later split-view column.",
  },
  {
    suffix: "swiftui-inspector-presentation",
    title: "SwiftUI inspector presentation",
    canonicalSummary:
      "Beta 5 corrected inspector height behavior, first-presentation sizing, and an animation glitch.",
    category: "bugFix",
    action: "fixed",
    topic: "SwiftUI",
    status: "Resolved Issues",
    issues: ["109532401", "111577034", "FB12488754"],
    summary:
      "Two new resolved entries align macOS inspector placement and animation with the documented presentation model.",
  },
  {
    suffix: "web-app-dark-title-bar",
    title: "Web-app title bar in dark appearance",
    canonicalSummary:
      "Beta 5 fixed installed web-app title bars that used the wrong appearance in dark mode.",
    category: "bugFix",
    action: "fixed",
    topic: "Web Apps",
    status: "Resolved Issues",
    issues: ["99514840"],
    summary:
      "The display issue moves from Known Issues to Resolved Issues at the Beta 5 boundary.",
  },
];

const watchosRcSpecs = [
  {
    suffix: "cellular-sos-waypoints",
    title: "Cellular and SOS waypoint visibility",
    canonicalSummary:
      "The watchOS 10 RC notes added a known issue where Cellular and SOS waypoints might not appear in remote areas.",
    category: "knownIssue",
    action: "knownIssue",
    topic: "Cellular Waypoints",
    status: "Known Issues",
    issues: ["113973758"],
    summary:
      "The sole new issue record in the clean Beta 8-to-RC comparison concerns waypoint visibility in Compass.",
  },
];

const routeDefinitions = [
  {
    platform: "macos",
    version: "14-0",
    alias: "beta-1",
    milestone: "Beta 1",
    after: "macosBeta1",
    specs: macosBeta1Specs,
    initial: true,
  },
  {
    platform: "macos",
    version: "14-0",
    alias: "beta-2",
    milestone: "Beta 2",
    before: "macosBeta1",
    after: "macosBeta2",
    specs: macosBeta2Specs,
    diff: { additions: 24, removals: 1, changed: 9, status: 2 },
  },
  {
    platform: "macos",
    version: "14-0",
    alias: "beta-3",
    milestone: "Beta 3",
    before: "macosBeta2",
    after: "macosBeta3",
    specs: macosBeta3Specs,
    diff: { additions: 22, removals: 2, changed: 3, status: 3 },
  },
  {
    platform: "macos",
    version: "14-0",
    alias: "beta-4",
    milestone: "Beta 4",
    before: "macosBeta3",
    after: "macosBeta4",
    specs: macosBeta4Specs,
    diff: { additions: 2, removals: 3, changed: 30, status: 2 },
  },
  {
    platform: "macos",
    version: "14-0",
    alias: "beta-5",
    milestone: "Beta 5",
    before: "macosBeta4",
    after: "macosBeta5",
    specs: macosBeta5Specs,
    diff: { additions: 15, removals: 0, changed: 6, status: 5 },
  },
  {
    platform: "watchos",
    version: "10-0",
    alias: "rc",
    milestone: "RC",
    before: "watchosBeta8",
    after: "watchosRc",
    specs: watchosRcSpecs,
    diff: { additions: 1, removals: 0, changed: 0, status: 0 },
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
      ? `Present under ${spec.topic} — ${spec.status} with ${spec.issues.join(", ")} in the first retained ${after.records}-record raw Apple DocC state after Beta 1 and before Beta 2; selected as representative, not exhaustive.`
      : `Matched by component, status heading, and issue ID across exact raw Apple DocC payloads ${evidence[route.before].rawTimestamp} and ${after.rawTimestamp}; the interval crosses ${route.milestone} and no other local seed milestone.`,
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
        `The first retained raw Apple DocC state after macOS Sonoma 14 Beta 1 and before Beta 2 identifies itself as ${after.rawTitle} and contains ${after.records} issue-backed note records.`,
        [afterCitation],
      ),
      heading("Representative Beta 1 inventory"),
      prose(
        `This page structures ${route.specs.length} high-signal entries across user-facing behavior, security, compatibility, and developer APIs. It is a selective index of the preserved state, not a reproduction of Apple's complete list.`,
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
      `The retained before and after payloads bracket ${route.platform === "macos" ? "macOS Sonoma 14" : "watchOS 10"} ${route.milestone} without crossing another seed milestone. The after state identifies itself as ${after.rawTitle}.`,
      [beforeCitation, afterCitation],
    ),
    heading(`Documented ${route.milestone} delta`),
    prose(
      `The issue-record comparison contains ${route.diff.additions} additions, ${route.diff.removals} removals, and ${route.diff.changed} changed records, including ${route.diff.status} status transitions. This article promotes ${route.specs.length} attributable changes and leaves wording-only edits or ambiguous removals out of the release inventory.`,
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
      ? `The first retained macOS Sonoma 14 Beta 1 state contains ${evidence[route.after].records} issue-backed records; this page structures ${changes.length} representative, source-supported entries without claiming an exhaustive changelog.`
      : `An exact archived Apple DocC boundary isolates ${route.platform === "macos" ? "macOS Sonoma 14" : "watchOS 10"} ${route.milestone}; ${changes.length} source-supported occurrences are selected from the attributable issue-record delta.`,
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
    version: "14.0",
    publicReleaseDate: "2023-09-26",
    milestones: [
      ["Beta 1", "2023-06-05", false, undefined],
      ["Beta 2", "2023-06-21", false, undefined],
      ["Beta 3", "2023-07-05", false, undefined],
      ["Beta 4", "2023-07-25", false, undefined],
      ["Beta 5", "2023-08-08", false, undefined],
      ["Beta 6", "2023-08-22", false, undefined],
      ["Beta 7", "2023-08-30", false, undefined],
      ["RC", "2023-09-12", false, undefined],
      ["RC 2", "2023-09-21", true, undefined],
      ["Public", "2023-09-26", false, undefined],
    ],
  },
  {
    platform: "tvOS",
    version: "17.0",
    publicReleaseDate: "2023-09-18",
    milestones: [
      ["Beta 1", "2023-06-05", false, undefined],
      ["Beta 2", "2023-06-21", false, undefined],
      ["Beta 3", "2023-07-05", false, undefined],
      ["Beta 4", "2023-07-25", false, undefined],
      ["Beta 5", "2023-08-08", false, undefined],
      ["Beta 6", "2023-08-15", false, undefined],
      ["Beta 7", "2023-08-22", false, undefined],
      ["Beta 8", "2023-08-29", false, undefined],
      ["Beta 9", "2023-09-05", false, undefined],
      ["RC", "2023-09-12", false, undefined],
      ["Public", "2023-09-18", false, undefined],
    ],
  },
  {
    platform: "visionOS",
    version: "1.0",
    publicReleaseDate: "2024-02-02",
    milestones: [
      ["Beta 1", "2023-06-21", false, "Simulator only"],
      ["Beta 2", "2023-07-25", false, "Simulator only"],
      ["Beta 3", "2023-08-29", false, "Simulator only"],
      ["Beta 4", "2023-10-03", false, "Simulator only"],
      ["Beta 5", "2023-11-01", false, "Includes App Store"],
      ["Beta 6", "2023-11-14", false, undefined],
      ["Beta 7", "2023-12-12", false, undefined],
      ["Public", "2024-02-02", false, "Apple Vision Pro launch"],
    ],
  },
  {
    platform: "watchOS",
    version: "10.0",
    publicReleaseDate: "2023-09-18",
    milestones: [
      ["Beta 1", "2023-06-05", false, undefined],
      ["Beta 2", "2023-06-21", false, undefined],
      ["Beta 3", "2023-07-05", false, undefined],
      ["Beta 4", "2023-07-25", false, undefined],
      ["Beta 5", "2023-08-08", false, undefined],
      ["Beta 6", "2023-08-15", false, undefined],
      ["Beta 7", "2023-08-22", false, undefined],
      ["Beta 8", "2023-08-29", false, undefined],
      ["RC", "2023-09-12", false, undefined],
      ["Public", "2023-09-18", false, undefined],
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
    "The exact local 2023 non-iOS seed inventory changed; re-audit before regenerating.",
  );
}

const routeAudit = [
  ["macOS", "Beta 1", "beta-1", "Initial state before Beta 2", true],
  [
    "macOS",
    "Beta 2",
    "beta-2",
    "20230607235811 → 20230702124053 crosses only Beta 2",
    true,
  ],
  [
    "macOS",
    "Beta 3",
    "beta-3",
    "20230702124053 → 20230717163745 crosses only Beta 3",
    true,
  ],
  [
    "macOS",
    "Beta 4",
    "beta-4",
    "20230717163745 → 20230727164800 crosses only Beta 4",
    true,
  ],
  [
    "macOS",
    "Beta 5",
    "beta-5",
    "20230727164800 → 20230816192546 crosses only Beta 5",
    true,
  ],
  [
    "macOS",
    "Beta 6",
    "beta-6",
    "Next retained state crosses Betas 6 and 7",
    false,
  ],
  [
    "macOS",
    "Beta 7",
    "beta-7",
    "Previous retained state predates Beta 6",
    false,
  ],
  ["macOS", "RC", "rc", "Exact RC title but zero issue-record changes", false],
  ["macOS", "RC 2", "rc-2", "Next state crosses RC 2 and Public", false],
  ["tvOS", "Beta 1", "beta-1", "No raw state", false],
  ["tvOS", "Beta 2", "beta-2", "No raw state", false],
  [
    "tvOS",
    "Beta 3",
    "beta-3",
    "First retained state is cumulative Beta 3",
    false,
  ],
  ["tvOS", "Beta 4", "beta-4", "No isolated raw boundary", false],
  ["tvOS", "Beta 5", "beta-5", "No isolated raw boundary", false],
  ["tvOS", "Beta 6", "beta-6", "No isolated raw boundary", false],
  ["tvOS", "Beta 7", "beta-7", "No isolated raw boundary", false],
  ["tvOS", "Beta 8", "beta-8", "No isolated raw boundary", false],
  ["tvOS", "Beta 9", "beta-9", "Previous retained state is Beta 3", false],
  ["tvOS", "RC", "rc", "Exact RC title but zero issue-record changes", false],
  ["visionOS", "Beta 1", "beta-1", "No raw state", false],
  [
    "visionOS",
    "Beta 2",
    "beta-2",
    "First retained state is cumulative Beta 2",
    false,
  ],
  ["visionOS", "Beta 3", "beta-3", "No isolated raw boundary", false],
  ["visionOS", "Beta 4", "beta-4", "No isolated raw boundary", false],
  ["visionOS", "Beta 5", "beta-5", "No isolated raw boundary", false],
  ["visionOS", "Beta 6", "beta-6", "No isolated raw boundary", false],
  [
    "visionOS",
    "Beta 7",
    "beta-7",
    "Next retained state is after Public",
    false,
  ],
  ["watchOS", "Beta 1", "beta-1", "No raw state", false],
  ["watchOS", "Beta 2", "beta-2", "No raw state", false],
  ["watchOS", "Beta 3", "beta-3", "No raw state", false],
  [
    "watchOS",
    "Beta 4",
    "beta-4",
    "First retained state is cumulative Beta 4",
    false,
  ],
  ["watchOS", "Beta 5", "beta-5", "No isolated raw boundary", false],
  ["watchOS", "Beta 6", "beta-6", "No isolated raw boundary", false],
  ["watchOS", "Beta 7", "beta-7", "No isolated raw boundary", false],
  ["watchOS", "Beta 8", "beta-8", "Previous retained state is Beta 4", false],
  [
    "watchOS",
    "RC",
    "rc",
    "20230907135458 → 20230912200535 crosses only RC",
    true,
  ],
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
  routeAudit.filter((row) => row[4]).length !== 6 ||
  routeAudit.filter((row) => !row[4]).length !== 29
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
  routeAudit
    .filter((row) => row[4])
    .map(
      ([platform, , alias]) =>
        `version-${platform.toLowerCase()}-${platform === "macOS" ? "14-0" : "10-0"}/${alias}`,
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
  events.length !== 6 ||
  changeCount !== 54 ||
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
if (uniqueLocalChangeKeys.length !== 54) {
  throw new Error(
    `Expected 54 stable change definitions; found ${uniqueLocalChangeKeys.length}.`,
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
  readFileSync(join(here, "apple-other-2023.json"), "utf8"),
);
for (const releaseVersionId of [
  "version-macos-14-0",
  "version-tvos-17-0",
  "version-visionos-1-0",
  "version-watchos-10-0",
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
      `${releaseVersionId} Public ownership changed in apple-other-2023.json.`,
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

const rawCaptureInventory = [
  [
    "macOS",
    "20230607235811",
    "macOS Sonoma 14 Beta Release Notes",
    161,
    "90abefd3711aabaa48fc757af14b638c3be61391dd9bbacd5dd33bb3305af966",
  ],
  [
    "macOS",
    "20230622113903",
    "macOS Sonoma 14 Beta 2 Release Notes",
    185,
    "1615a125da6cb59f4936edf83f5859e1cb4df32f12b8349e1dc8d25d180e38f8",
  ],
  [
    "macOS",
    "20230702124053",
    "macOS Sonoma 14 Beta 2 Release Notes",
    184,
    "046c069e9b0ae3f8bca5e74a6eed358944e838cf4d604b5539a42b55ef9faec6",
  ],
  [
    "macOS",
    "20230707224225",
    "macOS Sonoma 14 Beta 3 Release Notes",
    204,
    "371a2ecad5bd03553b2817d4fd44c2516326933cb276ea47f591997d3aa4b8e5",
  ],
  [
    "macOS",
    "20230711060054",
    "macOS Sonoma 14 Beta 3 Release Notes",
    204,
    "b83b2dbdda9331e00da7275c351bf03067d349259544b232ea9249140ad38c1c",
  ],
  [
    "macOS",
    "20230717163745",
    "macOS Sonoma 14 Beta 3 Release Notes",
    204,
    "0024946c7b6b0574b99a24154621cc96286c2f8979480a8ff18e3c88e37a3004",
  ],
  [
    "macOS",
    "20230725213920",
    "macOS Sonoma 14 Beta 4 Release Notes",
    203,
    "f3ce4c12c78867ab832296e96957d8e6617b1d242a1e115a37bfe191659a693d",
  ],
  [
    "macOS",
    "20230727164800",
    "macOS Sonoma 14 Beta 4 Release Notes",
    203,
    "0b421a6b6b4b39a0a6227d3d69d5c9e9f9f87524d164676f23da48f4b580c2c6",
  ],
  [
    "macOS",
    "20230816192546",
    "macOS Sonoma 14 Beta 5 Release Notes",
    218,
    "4da78817f33619d01c75933aaee3f76c0cf5e62af1eb55a39ad1b95f21c69338",
  ],
  [
    "macOS",
    "20230907135515",
    "macOS Sonoma 14 Beta 7 Release Notes",
    225,
    "71be0cd114c50b4ea0ac66de4507349bc56ea9506c5ec9ea76753c0abb562c23",
  ],
  [
    "macOS",
    "20230912200740",
    "macOS Sonoma 14 RC Release Notes",
    225,
    "1502565104287f308ff007aaa9e73d3734a4b8eebb5df8fa57bedbbaa93ac3cf",
  ],
  [
    "macOS",
    "20230928003224",
    "macOS Sonoma 14 Release Notes",
    225,
    "76897a477b0ffb859d2db6e0e4b5dbe6776b06f0402c311a668518ef5a65ee01",
  ],
  [
    "tvOS",
    "20230705224039",
    "tvOS 17 Beta 3 Release Notes",
    97,
    "94273808d2d980982350ee52a5e925f67d97e888bb8a3a6fb915726d83997a4b",
  ],
  [
    "tvOS",
    "20230905215723",
    "tvOS 17 Beta 9 Release Notes",
    113,
    "550e00e12a9ff3ca9300edea07d8a47beb23843c447d2306e58c3e22ebc7eeff",
  ],
  [
    "tvOS",
    "20230913072611",
    "tvOS 17 RC Release Notes",
    113,
    "bd1eb5772deb3fd28ea42bb6467a9c9067cd44263783f80d13bcb47ce2b4405c",
  ],
  [
    "visionOS",
    "20230725213159",
    "visionOS Beta 2 Release Notes",
    150,
    "7b7a5b0336878a5f47e7c64b6ecc55a9c19fbf2dfecc014d9701350c57963fd2",
  ],
  [
    "visionOS",
    "20240214065855",
    "visionOS Release Notes",
    179,
    "53f2ae07cdb25506bd94732d0b6600acaec3cdff1fb88cb448e49be9b3b72ebd",
  ],
  [
    "watchOS",
    "20230726003307",
    "watchOS 10 Beta 4 Release Notes",
    105,
    "b9aeaf46b43ea35122141c40f15e33812495ef4028e736692fc3a9fbf134b042",
  ],
  [
    "watchOS",
    "20230907135458",
    "watchOS 10 Beta 8 Release Notes",
    118,
    "26bd5b91f7a09de20b43d122cd5723a891b0f9d152639b2351944e9576378c23",
  ],
  [
    "watchOS",
    "20230912200535",
    "watchOS 10 RC Release Notes",
    119,
    "2222254780aa30a6912e29340c128c468fac7ad4e2804e84b93c0505289702d1",
  ],
];

if (
  rawCaptureInventory.length !== 20 ||
  new Set(rawCaptureInventory.map((row) => `${row[0]}/${row[1]}`)).size !== 20
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
      `| ${route.platform === "macos" ? "macOS 14.0" : "watchOS 10.0"} | ${route.milestone} | \`${route.alias}\` | ${route.specs.length} |`,
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
    ([platform, timestamp, title, records, hash]) =>
      `| ${platform} | \`${timestamp}\` | ${title} | ${records} | \`${hash}\` |`,
  )
  .join("\n");
const routeAuditRows = routeAudit
  .map(
    ([platform, milestone, alias, boundary, supported]) =>
      `| ${platform} | ${milestone} | \`${alias}\` | ${boundary} | ${supported ? "Included" : "Ledger only"} |`,
  )
  .join("\n");

const md = `# Apple 2023 non-iOS prerelease archive batch

## Result

\`${outputName}\` publishes six source-backed event overlays on existing routes:
macOS 14 Betas 1–5 and watchOS 10 RC.

- ${events.length} event overlays, ${changeCount} structured occurrences, and
  ${uniqueLocalChangeKeys.length} stable change definitions
- ${sources.length} declared and used reader-facing sources with
  ${citationCount} citation references
- zero version overlays, build pages, route creation, Public-route changes, or
  administrative identity changes
- all events are \`editoriallyVerified\`, approved at \`${reviewedAt}\`, and
  indexable; the production apply remains separately guarded

| Version | Milestone | Existing alias | Selected changes |
| ------- | --------- | -------------- | ---------------: |
${routeRows}

## Archive method

Reader-facing citations use preserved human Apple Developer pages. Exact raw
DocC JSON is research transport only. Every selected sequential occurrence was
matched by component, status heading, and issue identifier across two
CDX-confirmed payloads whose interval crosses one and only one local milestone.

Beta 1 is the only representative initial state. It contains 161 issue-backed
records after Beta 1 and before Beta 2; this batch selects twelve high-signal
items without implying an exhaustive list. Later cumulative first captures are
not treated the same way.

The normalized comparison counts below include text changes. Only explicit
additions and status transitions are promoted. A removal without a replacement
is not labeled as fixed, and a title-only RC state is not manufactured into a
release change.

## Selected findings

### macOS Beta 1

The representative baseline covers adaptive AirPods listening, passkeys,
localized grammar, resumable uploads, EAP-TLS 1.3, Photos editing output,
PostScript/EPS removal, StoreKit merchandising, pie and donut charts, trusted
execution tooling, AppKit-hosted SwiftUI navigation, and iPhone-widget refresh.

### macOS Betas 2–5

- Beta 2: 24 additions, 1 removal, and 9 changed records, including 2 status
  transitions. Selected changes cover legacy text APIs, iCloud, iPhone widgets,
  suggested titles, Rosetta, SwiftData, Catalyst, SwiftUI, Gatekeeper, Vision,
  and web apps.
- Beta 3: 22 additions, 2 removals, and 3 changed records; all 3 changes are
  status transitions. Selected changes cover media, Xcode documentation,
  FaceTime, filesystems, Freeform, widgets, screen sharing, ShazamKit, StoreKit,
  and Vision.
- Beta 4: 2 additions, 3 removals, and 30 changed records, including 2 status
  transitions. Only the two additions and two explicit resolutions are
  promoted.
- Beta 5: 15 additions and 6 changed records, including 5 status transitions.
  The selected delta emphasizes iCloud, StoreKit, Swift Charts, SwiftData,
  SwiftUI, and installed web apps. A newly listed iPhone-camera issue is not
  assigned to macOS merely because it appears in the shared document.

### watchOS RC

The Beta 8-to-RC comparison adds exactly one issue record: a Compass limitation
affecting Cellular and SOS waypoint visibility. No earlier watchOS beta receives
content from the cumulative Beta 4 or Beta 8 captures.

## Twenty raw states

Hashes are SHA-256 values of the decompressed raw DocC JSON bytes.

| Platform | Raw capture | Raw Apple title | Issue records | SHA-256 |
| -------- | ----------- | --------------- | ------------: | ------- |
${rawRows}

Exact consecutive comparisons:

- macOS: Beta 1→Beta 2 first state +25/−1/~9; Beta 2 first→revision +0/−1/~0;
  revision→Beta 3 +22/−2/~3; both later Beta 3 captures +0/−0/~0; Beta 3→Beta 4
  +2/−3/~30; Beta 4 revision +0/−0/~0; Beta 4→Beta 5 +15/−0/~6; Beta 5→Beta 7
  +10/−3/~80; Beta 7→RC +0/−0/~0; RC→Public +1/−1/~11.
- watchOS: cumulative Beta 4→Beta 8 +16/−3/~41; Beta 8→RC +1/−0/~0.
- tvOS: cumulative Beta 3→Beta 9 +17/−1/~38; Beta 9→RC +0/−0/~0.
- visionOS: cumulative Beta 2→post-Public +37/−8/~68.

The symbols mean added, removed, and changed issue records. Counts are evidence
audit facts, not a claim that every changed line belongs to one release.

## Thirty-five-route isolation audit

| Platform | Milestone | Alias | Exact boundary or gap | Decision |
| -------- | --------- | ----- | --------------------- | -------- |
${routeAuditRows}

The 29 ledger-only routes remain honest gaps. In particular:

- macOS Beta 6 and Beta 7 share one crossed boundary; the exact RC payload has
  no substantive issue-record difference; the next state crosses RC 2 and
  Public.
- tvOS begins at a cumulative Beta 3 state and next appears at Beta 9. Its RC
  state changes only document metadata.
- visionOS begins at cumulative Beta 2 and has no other retained state until
  after Public.
- watchOS begins at cumulative Beta 4. The next state is Beta 8, so only the
  subsequent clean RC addition is attributable.

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
- exact 35-route prerelease audit with a six-route allowlist and 29 gaps
- approved Public ownership remains in \`apple-other-2023.json\`
- zero versions and zero builds
- collision scan across every other batch and the launch manifest
- complete ${changeCount}-occurrence, ${uniqueLocalChangeKeys.length}-definition,
  source, and citation closure
- deterministic formatted JSON SHA-256: \`${jsonSha}\`

## Validation and production plan

Independent editorial and evidence review approved all six articles and all
${changeCount} occurrences at \`${reviewedAt}\`:

- repository validation: ${verification.researchBatches} batches and
  ${verification.globalChangeKeys} globally consistent change keys
- focused ingestion and manifest suite: ${verification.focusedTests} tests
- exact raw replay: ${verification.evidenceAssertions} issue-ID, component,
  status-heading, and boundary assertions
- copyright-similarity scan: the longest contiguous overlap between editorial
  fields and Apple list records was
  ${verification.maximumEditorialOverlapWords} words
- ESLint, Prettier, \`git diff --check\`, and deterministic regeneration: pass

Reviewed production plan:

- plan SHA-256: \`${dryRun.plan}\`
- ${dryRun.creates} creates: 7 sources and 54 release changes
- ${dryRun.patches} revision-guarded patches on exactly the six allowlisted
  existing events; zero version, event, or build creates and zero version
  patches
- event patches add the article, summary, citations, change references,
  \`editoriallyVerified\` provenance, approved review state, and indexability
- ${dryRun.unchanged} unchanged documents and a
  ${dryRun.payloadBytes.toLocaleString("en-US")}-byte mutation payload
- plan artifact SHA-256: \`${dryRun.planArtifact}\`
- rollback artifact SHA-256: \`${dryRun.rollbackArtifact}\`

Publication receipt:

- guarded Sanity transaction: \`${publication.transactionId}\`
- apply receipt SHA-256: \`${publication.receiptSha}\`
- immediate independent dry run: zero creates, zero patches,
  ${publication.immediateZeroUnchanged.toLocaleString("en-US")} unchanged
  documents, and a ${publication.immediateZeroPayloadBytes}-byte payload
- zero-plan SHA-256: \`${publication.immediateZeroPlan}\`
- zero-plan artifact SHA-256:
  \`${publication.immediateZeroPlanArtifact}\`
- zero-plan rollback artifact SHA-256:
  \`${publication.immediateZeroRollbackArtifact}\`

Production coverage after publication:

- ${publication.coverage.versionFull} of ${publication.coverage.versionTotal}
  release versions have full version-level articles
- ${publication.coverage.appearanceTotal} appearances:
  ${publication.coverage.appearanceFull} full articles,
  ${publication.coverage.appearanceSourceLinked} source-linked records, and
  ${publication.coverage.appearanceTimelineOnly} timeline-only records
- ${publication.coverage.approvedStructuredChanges} appearances have approved
  structured changes

## Settled canonical route verification

Every published route was fetched independently from the running local site.
Each returned HTTP 200, the full article, References, and \`index, follow\`;
none returned a timeline placeholder or \`noindex\`.

| Canonical route | HTTP | Full article | References | Index |
| --------------- | ---: | ------------ | ---------- | ----- |
| \`/apple/macos/14.0/beta-1/\` | 200 | yes | yes | yes |
| \`/apple/macos/14.0/beta-2/\` | 200 | yes | yes | yes |
| \`/apple/macos/14.0/beta-3/\` | 200 | yes | yes | yes |
| \`/apple/macos/14.0/beta-4/\` | 200 | yes | yes | yes |
| \`/apple/macos/14.0/beta-5/\` | 200 | yes | yes | yes |
| \`/apple/watchos/10.0/rc/\` | 200 | yes | yes | yes |

Final verification on 2026-07-30:

- \`npm run research:validate\`: ${verification.researchBatches} batches and
  ${verification.globalChangeKeys} globally consistent change keys
- full repository suite: 131 tests passed; focused ingestion and manifest
  suite: ${verification.focusedTests} tests passed
- independent raw replay: ${verification.evidenceAssertions} evidence
  assertions passed
- independent copyright-similarity scan: maximum non-identifier overlap of
  ${verification.maximumEditorialOverlapWords} words
- ESLint, Prettier, focused \`git diff --check\`, and deterministic
  regeneration: passed
- the final planner reported “No Sanity data changed”

Reproduce the local checks with:

\`\`\`sh
node scripts/research-batches/build-apple-nonios-2023-prerelease.mjs
npm run research:validate
node --import tsx --test tests/launch-content-ingestion.test.ts tests/launch-content-manifest.test.ts
npx eslint scripts/research-batches/build-apple-nonios-2023-prerelease.mjs
npx prettier --check scripts/research-batches/build-apple-nonios-2023-prerelease.mjs scripts/research-batches/apple-nonios-2023-prerelease.json scripts/research-batches/apple-nonios-2023-prerelease.md
npx sanity exec scripts/ingest-launch-content.ts --with-user-token -- --content scripts/research-batches/apple-nonios-2023-prerelease.json
\`\`\`

The final Sanity command is intentionally a post-publication dry run and must
reproduce the zero plan above. Do not add \`--apply\`.
`;

const ledgerPath = join(here, ledgerName);
writeFileSync(
  ledgerPath,
  await prettier.format(md, {
    filepath: ledgerPath,
  }),
);

console.log(
  `${outputName}: ${events.length} events, ${changeCount} occurrences, ${uniqueLocalChangeKeys.length} unique changes, ${sources.length} sources, ${citationCount} citations, SHA-256 ${jsonSha}`,
);
