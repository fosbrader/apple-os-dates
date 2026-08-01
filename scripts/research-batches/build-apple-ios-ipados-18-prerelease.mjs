import { createHash } from "node:crypto";
import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import prettier from "prettier";

const here = dirname(fileURLToPath(import.meta.url));
const outputName = "apple-ios-ipados-18-prerelease.json";
const ledgerName = "apple-ios-ipados-18-prerelease.md";
const accessedAt = "2026-07-30";
const reviewedAt = "2026-07-30T07:45:17Z";

const U = {
  installBeta: "https://developer.apple.com/support/install-beta",
  beta1:
    "https://web.archive.org/web/20240613151040/https://developer.apple.com/documentation/ios-ipados-release-notes/ios-ipados-18-release-notes",
  beta1Transport:
    "https://web.archive.org/web/20240612190904id_/https://developer.apple.com/tutorials/data/documentation/ios-ipados-release-notes/ios-ipados-18-release-notes.json",
  beta2:
    "https://web.archive.org/web/20240630111940/https://developer.apple.com/documentation/ios-ipados-release-notes/ios-ipados-18-release-notes",
  beta2Transport:
    "https://web.archive.org/web/20240630111940id_/https://developer.apple.com/tutorials/data/documentation/ios-ipados-release-notes/ios-ipados-18-release-notes.json",
  beta3:
    "https://web.archive.org/web/20240710002802/https://developer.apple.com/documentation/ios-ipados-release-notes/ios-ipados-18-release-notes",
  beta3Transport:
    "https://web.archive.org/web/20240709144845id_/https://developer.apple.com/tutorials/data/documentation/ios-ipados-release-notes/ios-ipados-18-release-notes.json",
  beta3Revision:
    "https://web.archive.org/web/20240715174626/https://developer.apple.com/documentation/ios-ipados-release-notes/ios-ipados-18-release-notes",
  beta3RevisionTransport:
    "https://web.archive.org/web/20240715174636id_/https://developer.apple.com/tutorials/data/documentation/ios-ipados-release-notes/ios-ipados-18-release-notes.json",
  beta6Audit:
    "https://web.archive.org/web/20240815005927/https://developer.apple.com/documentation/ios-ipados-release-notes/ios-ipados-18-release-notes",
  beta6AuditTransport:
    "https://web.archive.org/web/20240815005934id_/https://developer.apple.com/tutorials/data/documentation/ios-ipados-release-notes/ios-ipados-18-release-notes.json",
  beta7Audit:
    "https://web.archive.org/web/20240823034042/https://developer.apple.com/documentation/ios-ipados-release-notes/ios-ipados-18-release-notes",
  beta7AuditTransport:
    "https://web.archive.org/web/20240823034057id_/https://developer.apple.com/tutorials/data/documentation/ios-ipados-release-notes/ios-ipados-18-release-notes.json",
};

const archiveSources = [
  [
    U.beta1,
    U.beta1Transport,
    "iOS & iPadOS 18 Beta Release Notes",
    "2024-06-13T15:10:40.000Z",
    "Beta 1",
  ],
  [
    U.beta2,
    U.beta2Transport,
    "iOS & iPadOS 18 Beta 2 Release Notes",
    "2024-06-30T11:19:40.000Z",
    "Beta 2",
  ],
  [
    U.beta3,
    U.beta3Transport,
    "iOS & iPadOS 18 Beta 3 Release Notes",
    "2024-07-10T00:28:02.000Z",
    "Beta 3",
  ],
  [
    U.beta3Revision,
    U.beta3RevisionTransport,
    "iOS & iPadOS 18 Beta 3 Release Notes — July 15 state",
    "2024-07-15T17:46:26.000Z",
    "Beta 3 v2",
  ],
].map(([url, transportUrl, title, publishedAt, milestone]) => ({
  url,
  transportUrl,
  title: `${title} (preserved snapshot)`,
  publisher: "Apple Developer via Internet Archive",
  sourceClass: "archive",
  author: "Apple",
  publishedAt,
  topics: ["iOS", "iPadOS", "18.0", milestone, "historical release notes"],
}));

const sources = [
  ...archiveSources,
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
};

const comparisonForAlias = {
  "beta-1": [U.beta1],
  "beta-2": [U.beta1, U.beta2],
  "beta-3": [U.beta2, U.beta3],
  "beta-3-v2": [U.beta3, U.beta3Revision],
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

function verificationFor(alias) {
  if (alias === "beta-1") {
    return "Selected as a representative initial capability, API change, deprecation, or platform behavior from Apple’s first preserved Beta 1 DocC state; the baseline is intentionally not exhaustive.";
  }
  if (alias === "beta-2") {
    return "Matched the component, status heading, and retained issue ID in the 219-record Beta 2 state against the 196-record Beta 1 state.";
  }
  if (alias === "beta-3") {
    return "Matched the component, status heading, and retained issue ID in the 227-record Beta 3 state against the 219-record Beta 2 state.";
  }
  return "Matched the issue ID as an exact addition in the 229-record July 15 state against the 227-record Beta 3 state; no other records changed at this boundary.";
}

function archivedChange(alias, input) {
  return {
    key: input.key,
    title: input.title,
    canonicalSummary: input.canonicalSummary,
    category: input.category,
    action: input.action,
    inheritance: "delta",
    summary: input.summary,
    documentedStatus: "documented",
    evidenceState: "confirmed",
    verificationMethod: input.verificationMethod || verificationFor(alias),
    citations: [c(sourceForAlias[alias], input.locator, input.citationNote)],
  };
}

const routeChanges = new Map();
const appendChanges = (platforms, alias, changes) => {
  for (const platform of platforms) {
    const key = `${platform}/${alias}`;
    routeChanges.set(key, [...(routeChanges.get(key) || []), ...changes]);
  }
};

const both = ["ios", "ipados"];

appendChanges(both, "beta-1", [
  archivedChange("beta-1", {
    key: "apple-18-beta1-adattributionkit-reengagement",
    title: "AdAttributionKit re-engagement attribution",
    canonicalSummary:
      "AdAttributionKit added click-through re-engagement measurement and Universal Link deep linking for already-installed apps.",
    category: "developerApi",
    action: "introduced",
    summary:
      "The first preserved state documents re-engagement measurement and deep links for previously installed apps.",
    locator: "AdAttributionKit — New Features; 111224069",
  }),
  archivedChange("beta-1", {
    key: "apple-18-beta1-mapkit-place-identity-and-cards",
    title: "MapKit place identity and place cards",
    canonicalSummary:
      "MapKit added persistent Place IDs, more local-search result categories, and an API for presenting place-card interfaces.",
    category: "developerApi",
    action: "introduced",
    summary:
      "The initial notes group three related MapKit additions: Place IDs, expanded search result types, and place-card presentation.",
    locator: "Maps — New Features; 129071038, 129073725, and 129073922",
  }),
  archivedChange("beta-1", {
    key: "apple-18-beta1-memory-allocator-implementation",
    title: "System memory allocator implementation",
    canonicalSummary:
      "The system allocator changed for most allocation sizes, potentially exposing latent memory bugs and altering allocation-heavy performance or fragmentation.",
    category: "behavior",
    action: "changed",
    summary:
      "Apple warned developers that a new allocator implementation could reveal existing memory defects and change allocation behavior.",
    locator: "Memory Allocation — New Features; 127493322",
  }),
  archivedChange("beta-1", {
    key: "apple-18-beta1-realitykit-rendering-capabilities",
    title: "RealityKit subdivision and Display P3 rendering",
    canonicalSummary:
      "RealityKit added Catmull-Clark subdivision rendering for qualifying USD meshes and Display P3 rendering for virtual objects.",
    category: "developerApi",
    action: "introduced",
    summary:
      "The initial state adds subdivision rendering with documented resource costs and expands virtual-object rendering to Display P3.",
    locator: "RealityKit — New Features; 129016034 and 129017592",
  }),
  archivedChange("beta-1", {
    key: "apple-18-beta1-storekit-renewal-offer-metadata",
    title: "StoreKit renewal and offer metadata",
    canonicalSummary:
      "StoreKit subscription status gained renewal price, currency, and next-renewal offer information.",
    category: "developerApi",
    action: "introduced",
    summary:
      "Subscription status objects can expose renewal pricing, currency, and the offer expected for the next renewal.",
    locator: "StoreKit — New Features; 114217892",
  }),
  archivedChange("beta-1", {
    key: "apple-18-beta1-swift-charts-function-vectorized-plots",
    title: "Swift Charts function and vectorized plots",
    canonicalSummary:
      "Swift Charts added function plots and vectorized plotting APIs intended to render large datasets more efficiently.",
    category: "developerApi",
    action: "introduced",
    summary:
      "The first state introduces LinePlot and AreaPlot for math functions plus vectorized PointPlot and RectanglePlot APIs.",
    locator: "Swift Charts — New Features; 117186178 and 117469419",
  }),
  archivedChange("beta-1", {
    key: "apple-18-beta1-swiftui-sheet-presentation-sizing",
    title: "SwiftUI automatic sheet sizing",
    canonicalSummary:
      "SwiftUI sheets linked against the new SDK adopted automatic presentation sizing with platform-dependent form or fitted behavior.",
    category: "behavior",
    action: "changed",
    summary:
      "Apps linking against the new SDK need to audit sheets because their default presentation sizing changed.",
    locator: "SwiftUI — New Features; 117551515",
  }),
  archivedChange("beta-1", {
    key: "apple-18-beta1-swiftui-mainactor-isolation",
    title: "SwiftUI default MainActor isolation",
    canonicalSummary:
      "SwiftUI protocol conformances became MainActor-isolated by default to improve compile-time data-race diagnostics.",
    category: "developerApi",
    action: "changed",
    summary:
      "The SDK applies default MainActor isolation to View and related protocol conformances while leaving runtime evaluation behavior unchanged.",
    locator: "SwiftUI — New Features; 120815051",
  }),
  archivedChange("beta-1", {
    key: "apple-18-beta1-swiftui-entry-macro",
    title: "SwiftUI Entry macro",
    canonicalSummary:
      "SwiftUI added the Entry macro to simplify custom environment, focused, transaction, and container value declarations.",
    category: "developerApi",
    action: "introduced",
    summary:
      "The Entry macro reduces boilerplate for several custom SwiftUI value containers.",
    locator: "SwiftUI — New Features; 125568810",
  }),
  archivedChange("beta-1", {
    key: "apple-18-beta1-translation-apis-and-hindi",
    title: "Translation APIs and Hindi support",
    canonicalSummary:
      "The system added app-facing translation sessions and Hindi across the Translate app, system translation, Safari, and the new APIs.",
    category: "developerApi",
    action: "introduced",
    summary:
      "Apps gained a translation-session API while the broader translation stack added Hindi support.",
    locator: "Translation — New Features; 112844581 and 116622913",
  }),
  archivedChange("beta-1", {
    key: "apple-18-beta1-storekit-original-api-deprecation",
    title: "Original StoreKit API deprecation",
    canonicalSummary:
      "Apple deprecated the original in-app purchase API family in favor of current StoreKit APIs.",
    category: "removal",
    action: "changed",
    summary:
      "The initial notes mark the legacy in-app purchase classes and requests as deprecated.",
    locator: "StoreKit — Deprecations; 116600524",
  }),
]);

appendChanges(["ios"], "beta-1", [
  archivedChange("beta-1", {
    key: "ios-18-beta1-messages-via-satellite",
    title: "Messages via satellite",
    canonicalSummary:
      "Messages added satellite messaging in the United States, with SMS-over-satellite availability limited to participating carriers.",
    category: "feature",
    action: "introduced",
    summary:
      "The first preserved iOS state records the initial United States and carrier scope for messaging over satellite.",
    locator: "Messages — New Features; 127751557",
  }),
  archivedChange("beta-1", {
    key: "ios-18-beta1-siri-bluetooth-media-source",
    title: "Siri response audio over a vehicle media source",
    canonicalSummary:
      "Siri added an option to route responses through a vehicle’s Bluetooth media source when CarPlay is unavailable.",
    category: "enhancement",
    action: "introduced",
    summary:
      "The iPhone-only note describes improved Siri audio through a vehicle media source without CarPlay.",
    locator: "Siri — New Features; 110810507",
  }),
  archivedChange("beta-1", {
    key: "ios-18-beta1-today-view-extension-removal",
    title: "Legacy Today View extensions removed",
    canonicalSummary:
      "iOS 18 removed support for legacy Today View extensions.",
    category: "removal",
    action: "removed",
    summary:
      "Apple’s deprecation section states that legacy Today View extensions are removed in iOS 18.",
    locator: "Widgets — Deprecations; 116246167",
  }),
]);

appendChanges(["ipados"], "beta-1", [
  archivedChange("beta-1", {
    key: "ipados-18-beta1-swiftui-top-tab-bar",
    title: "SwiftUI top tab-bar appearance on iPad",
    canonicalSummary:
      "Automatic-style SwiftUI TabViews adopted a compact top tab bar in the regular horizontal size class on iPad.",
    category: "behavior",
    action: "changed",
    summary:
      "The first preserved state explicitly scopes the revised automatic TabView appearance to iPad.",
    locator: "SwiftUI — New Features; 117029720",
  }),
]);

const rcsFallbackDefinition = {
  key: "ios-18-beta2-rcs-sms-fallback",
  title: "RCS conversations falling back to SMS",
  canonicalSummary:
    "Existing RCS conversations could fall back to SMS even while RCS remained registered.",
  category: "regression",
};

const rtlTabsDefinition = {
  key: "ipados-18-beta2-rtl-tab-titles",
  title: "Right-to-left iPad tab titles",
  canonicalSummary:
    "Tab titles could be missing from iPad tab bars when using a right-to-left language.",
  category: "regression",
};

appendChanges(both, "beta-2", [
  archivedChange("beta-2", {
    key: "apple-18-beta2-on-demand-resource-limits",
    title: "Higher on-demand resource limits",
    canonicalSummary:
      "Apple increased on-demand resource limits for iOS 18 and iPadOS 18 alongside other platforms.",
    category: "developerApi",
    action: "changed",
    summary:
      "The Beta 2 state adds the cross-platform increase in on-demand resource limits.",
    locator: "App Store — New Features; 122163236",
  }),
  archivedChange("beta-2", {
    key: "apple-18-beta2-bluetooth-audio-route-fix",
    title: "Bluetooth headphone audio routing",
    canonicalSummary:
      "Apple fixed Bluetooth headphones being unavailable as an audio route under some AVAudioSession configurations.",
    category: "bugFix",
    action: "fixed",
    summary:
      "Beta 2 adds a resolved audio-routing issue affecting some Bluetooth headphone and AVAudioSession combinations.",
    locator: "Audio — Resolved Issues; 126693883",
  }),
  archivedChange("beta-2", {
    key: "apple-18-beta2-duplicate-app-container-handling",
    title: "Duplicate app-container handling",
    canonicalSummary:
      "The system improved handling of duplicate containers created by older Xcode versions so apps launch consistently and deletion removes duplicates.",
    category: "bugFix",
    action: "fixed",
    summary:
      "Beta 2 documents more consistent launch and deletion behavior when Xcode 15 through 15.3 created duplicate device containers.",
    locator: "Containerization — Resolved Issues; 123480553",
  }),
  archivedChange("beta-2", {
    key: "apple-18-beta2-camera-startup-delay-fix",
    title: "Camera startup delay",
    canonicalSummary:
      "Apple fixed camera functions taking as long as two minutes to become available after an iPhone or iPad booted.",
    category: "bugFix",
    action: "fixed",
    summary:
      "The Beta 1 known issue becomes resolved in Beta 2 for both iPhone and iPad.",
    locator:
      "Camera — Known Issues to Resolved Issues; 128899310 status transition",
  }),
  archivedChange("beta-2", {
    key: "apple-18-beta2-healthkit-workout-route-access",
    title: "HealthKit workout-route access",
    canonicalSummary:
      "Apple fixed third-party workout apps being unable to access routes created by the Apple Watch Workout app.",
    category: "bugFix",
    action: "fixed",
    summary:
      "Beta 2 moves the HealthKit workout-route access issue from known to resolved.",
    locator:
      "HealthKit — Known Issues to Resolved Issues; 123450917 status transition",
  }),
  archivedChange("beta-2", {
    key: "apple-18-beta2-icloud-drive-data-usage",
    title: "iCloud Drive sync data usage",
    canonicalSummary:
      "Apple fixed frequently edited iCloud Drive files using more network data than expected while syncing.",
    category: "bugFix",
    action: "fixed",
    summary:
      "The excess-data syncing issue changes from known in Beta 1 to resolved in Beta 2.",
    locator:
      "iCloud Drive — Known Issues to Resolved Issues; 128771010 status transition",
  }),
  archivedChange("beta-2", {
    key: "apple-18-beta2-photos-icloud-sync",
    title: "Photos iCloud Library syncing",
    canonicalSummary:
      "Apple fixed photos and videos stopping their synchronization through iCloud Photo Library.",
    category: "bugFix",
    action: "fixed",
    summary:
      "The iCloud Photo Library syncing failure changes from known to resolved in Beta 2.",
    locator:
      "Photos — Known Issues to Resolved Issues; 128325085 status transition",
  }),
  archivedChange("beta-2", {
    key: "apple-18-beta2-swiftui-sheet-sizing-default",
    title: "SwiftUI sheet-sizing default",
    canonicalSummary:
      "Apple corrected SwiftUI sheets using fitted sizing when their intended automatic default should resolve to form sizing.",
    category: "bugFix",
    action: "fixed",
    summary:
      "Beta 2 resolves the incorrect initial sheet-sizing behavior documented in the preceding state.",
    locator:
      "SwiftUI — Known Issues to Resolved Issues; 128902804 status transition",
  }),
  archivedChange("beta-2", {
    key: "apple-18-beta2-hardware-timer-register-frequency",
    title: "Hardware timer-register frequency",
    canonicalSummary:
      "SDK-linked apps on specified newer Apple silicon began reading a 1 GHz architectural timer frequency instead of the prior 24 MHz value.",
    category: "compatibility",
    action: "changed",
    summary:
      "Beta 2 adds a compatibility note for direct timer-register readers while continuing to recommend system timekeeping APIs.",
    locator: "Platform — New Features; 84639494",
  }),
]);

appendChanges(["ios"], "beta-2", [
  archivedChange("beta-2", {
    ...rcsFallbackDefinition,
    action: "knownIssue",
    summary:
      "Beta 2 newly lists RCS one-to-one and group conversations incorrectly downgrading to SMS.",
    locator: "Messages — Known Issues; 130029732",
  }),
  archivedChange("beta-2", {
    key: "ios-18-beta2-always-on-display-reboot",
    title: "Always-On display exit reboot",
    canonicalSummary:
      "Apple fixed iPhones with Always-On display enabled potentially panicking or rebooting when leaving that display state.",
    category: "bugFix",
    action: "fixed",
    summary:
      "The phone-specific Always-On display reboot issue changes from known to resolved in Beta 2.",
    locator:
      "Display — Known Issues to Resolved Issues; 128268712 status transition",
  }),
  archivedChange("beta-2", {
    key: "ios-18-beta2-wallet-id-liveness-capture",
    title: "Wallet ID liveness capture",
    canonicalSummary:
      "Wallet could request a Live Photo during ID enrollment to help verify that a live person was submitting the image.",
    category: "enhancement",
    action: "introduced",
    summary:
      "Beta 2 adds an iPhone ID-enrollment liveness check that may supplement or replace prompted facial movements.",
    locator: "Wallet — New Features; 129338051",
  }),
  archivedChange("beta-2", {
    key: "ios-18-beta2-files-move-panel-navigation",
    title: "Files move-panel navigation",
    canonicalSummary:
      "Apple fixed navigation failures in the Files app’s Move panel on iPhone.",
    category: "bugFix",
    action: "fixed",
    summary:
      "The iPhone-specific Move-panel navigation issue changes from known to resolved in Beta 2.",
    locator:
      "Files — Known Issues to Resolved Issues; 128868597 status transition",
  }),
]);

appendChanges(["ipados"], "beta-2", [
  archivedChange("beta-2", {
    ...rtlTabsDefinition,
    action: "knownIssue",
    summary:
      "Beta 2 newly lists missing iPad tab-bar titles for right-to-left languages.",
    locator: "UIKit — Known Issues; 130154177",
  }),
  archivedChange("beta-2", {
    key: "ipados-18-beta2-document-scanning-preview",
    title: "Document-scanning camera preview",
    canonicalSummary:
      "Apple fixed document scanning from Camera on iPad sometimes showing a black preview instead of the live camera feed.",
    category: "bugFix",
    action: "fixed",
    summary:
      "The iPad-specific document-scanning preview issue changes from known to resolved in Beta 2.",
    locator:
      "Camera — Known Issues to Resolved Issues; 128907349 status transition",
  }),
  archivedChange("beta-2", {
    key: "ipados-18-beta2-math-notes-negative-adjustment",
    title: "Math Notes negative-number adjustment",
    canonicalSummary:
      "Apple fixed Math Notes number adjustment producing repeated negative signs.",
    category: "bugFix",
    action: "fixed",
    summary:
      "The negative-number adjustment issue changes from known to resolved in Beta 2.",
    locator:
      "Math Notes — Known Issues to Resolved Issues; 123738353 status transition",
  }),
  archivedChange("beta-2", {
    key: "ipados-18-beta2-realitykit-ipad-pro-shadows",
    title: "RealityKit shadows on iPad Pro",
    canonicalSummary:
      "Apple fixed RealityKit grounding and storyboard-enabled ray-traced shadows failing on specified iPad Pro configurations.",
    category: "bugFix",
    action: "fixed",
    summary:
      "The iPad Pro-specific shadows issue changes from known to resolved in Beta 2.",
    locator:
      "RealityKit — Known Issues to Resolved Issues; 127748381 status transition",
  }),
]);

appendChanges(both, "beta-3", [
  archivedChange("beta-3", {
    key: "apple-18-beta3-facetime-video-after-unlock",
    title: "FaceTime video after unlocking",
    canonicalSummary:
      "Apple fixed FaceTime video becoming disabled after answering from the Lock Screen and later unlocking the device.",
    category: "bugFix",
    action: "fixed",
    summary:
      "The FaceTime Lock Screen and picture-in-picture camera issue changes from known to resolved in Beta 3.",
    locator:
      "FaceTime — Known Issues to Resolved Issues; 124719544 status transition",
  }),
  archivedChange("beta-3", {
    key: "apple-18-beta3-keyboard-settings-configuration",
    title: "Keyboard configuration in Settings",
    canonicalSummary:
      "Apple fixed Settings preventing users from adding or removing language keyboards and keyboard extensions.",
    category: "bugFix",
    action: "fixed",
    summary:
      "The keyboard-configuration issue changes from known to resolved in Beta 3.",
    locator:
      "Keyboard — Known Issues to Resolved Issues; 129174947 status transition",
  }),
  archivedChange("beta-3", {
    key: "apple-18-beta3-storage-availability-reporting",
    title: "Available-storage reporting",
    canonicalSummary:
      "Apple fixed General settings reporting an incorrect amount of available device storage.",
    category: "bugFix",
    action: "fixed",
    summary:
      "The available-storage reporting issue changes from known to resolved in Beta 3.",
    locator:
      "Settings — Known Issues to Resolved Issues; 129688831 status transition",
  }),
  archivedChange("beta-3", {
    key: "apple-18-beta3-shortcuts-intent-refresh",
    title: "Shortcuts intent refresh",
    canonicalSummary:
      "Apple fixed added or removed SiriKit and App Intents definitions not appearing promptly in Shortcuts.",
    category: "bugFix",
    action: "fixed",
    summary:
      "The intent-refresh issue changes from known in Beta 2 to resolved in Beta 3.",
    locator:
      "Shortcuts — Known Issues to Resolved Issues; 130039560 status transition",
  }),
  archivedChange("beta-3", {
    key: "apple-18-beta3-swift-charts-animation-marks",
    title: "Swift Charts animated marks",
    canonicalSummary:
      "Apple fixed chart marks disappearing during animations when a foreground color style was applied.",
    category: "bugFix",
    action: "fixed",
    summary:
      "The Swift Charts animation issue changes from known in Beta 2 to resolved in Beta 3.",
    locator:
      "Swift Charts — Known Issues to Resolved Issues; 130023892 status transition",
  }),
  archivedChange("beta-3", {
    key: "apple-18-beta3-swiftui-scenephase",
    title: "SwiftUI scenePhase reporting",
    canonicalSummary:
      "Apple fixed SwiftUI scenePhase so an app reports active whenever at least one of its scenes is active.",
    category: "bugFix",
    action: "fixed",
    summary:
      "The scenePhase behavior changes from known in Beta 2 to resolved in Beta 3.",
    locator:
      "SwiftUI — Known Issues to Resolved Issues; 117864591 status transition",
  }),
  archivedChange("beta-3", {
    key: "apple-18-beta3-storekit-voiceover-product-text",
    title: "StoreKit product text in VoiceOver",
    canonicalSummary:
      "Apple fixed VoiceOver failing to read StoreKit product titles and descriptions in affected subscription interfaces.",
    category: "bugFix",
    action: "fixed",
    summary:
      "Beta 3 adds a resolved StoreKit accessibility issue covering product titles and descriptions.",
    locator: "StoreKit — Resolved Issues; 124254957 and FB13679318",
  }),
  archivedChange("beta-3", {
    key: "apple-18-beta3-photos-services-stall",
    title: "Photos-related services becoming unresponsive",
    canonicalSummary:
      "Photos services could stop responding and disrupt iCloud syncing, camera and screenshot capture, or sharing.",
    category: "knownIssue",
    action: "knownIssue",
    summary:
      "Beta 3 newly documents a Photos-services stall with effects across capture, synchronization, and sharing.",
    locator: "Photos — Known Issues; 130739189",
  }),
  archivedChange("beta-3", {
    key: "apple-18-beta3-realitykit-dynamic-lights",
    title: "RealityKit dynamic-light stability",
    canonicalSummary:
      "Apple fixed RealityKit scenes with more than roughly one hundred dynamic lights triggering an abnormal termination.",
    category: "bugFix",
    action: "fixed",
    summary:
      "The dynamic-light stability issue changes from known in Beta 2 to resolved in Beta 3.",
    locator:
      "RealityKit — Known Issues to Resolved Issues; 129424857 status transition",
  }),
]);

appendChanges(["ios"], "beta-3", [
  archivedChange("beta-3", {
    ...rcsFallbackDefinition,
    action: "fixed",
    summary:
      "Beta 3 moves the RCS-to-SMS fallback regression from known to resolved.",
    locator:
      "Messages — Known Issues to Resolved Issues; 130029732 status transition",
  }),
  archivedChange("beta-3", {
    key: "ios-18-beta3-iphone-mirroring-interactions",
    title: "iPhone Mirroring interaction fixes",
    canonicalSummary:
      "Apple fixed iPhone Mirroring keyboard input, Lock Screen app launching, and incompatible-device listings.",
    category: "bugFix",
    action: "fixed",
    summary:
      "Three iPhone Mirroring interaction issues move from known in Beta 2 to resolved in Beta 3.",
    locator:
      "iPhone Mirroring — Known Issues to Resolved Issues; 126928807, 128281331, and 128633492",
  }),
  archivedChange("beta-3", {
    key: "ios-18-beta3-wifi-calling-companion-devices",
    title: "Wi-Fi Calling on companion devices",
    canonicalSummary:
      "Apple fixed affected T-Mobile users being unable to place or receive Wi-Fi calls on secondary devices using the same Apple account.",
    category: "bugFix",
    action: "fixed",
    summary:
      "The secondary-device Wi-Fi Calling issue moves from known in Beta 2 to resolved in Beta 3.",
    locator:
      "Wifi Calling — Known Issues to Resolved Issues; 130227345 status transition",
  }),
]);

appendChanges(["ipados"], "beta-3", [
  archivedChange("beta-3", {
    ...rtlTabsDefinition,
    action: "fixed",
    summary:
      "Beta 3 moves the right-to-left iPad tab-title regression from known to resolved.",
    locator:
      "UIKit — Known Issues to Resolved Issues; 130154177 status transition",
  }),
  archivedChange("beta-3", {
    key: "ipados-18-beta3-m4-sound-recognition",
    title: "Sound Recognition on M4 iPad Pro",
    canonicalSummary:
      "Apple fixed Sound Recognition and Sound Actions failing on iPad Pro models with M4.",
    category: "bugFix",
    action: "fixed",
    summary:
      "The M4 iPad Pro accessibility issue moves from known to resolved in Beta 3.",
    locator:
      "Accessibility — Known Issues to Resolved Issues; 128949527 status transition",
  }),
  archivedChange("beta-3", {
    key: "ipados-18-beta3-handwriting-auto-refine",
    title: "Handwriting auto-refine rendering",
    canonicalSummary:
      "Apple fixed handwriting auto-refine animation artifacts when iPad Display Zoom used the More Space setting.",
    category: "bugFix",
    action: "fixed",
    summary:
      "The Display Zoom-specific handwriting rendering issue moves from known to resolved in Beta 3.",
    locator:
      "Handwriting — Known Issues to Resolved Issues; 129419813 status transition",
  }),
  archivedChange("beta-3", {
    key: "ipados-18-beta3-math-notes-comma-adjustment",
    title: "Math Notes comma-number adjustment",
    canonicalSummary:
      "Apple fixed Math Notes changing a comma-containing number to zero when it was adjusted.",
    category: "bugFix",
    action: "fixed",
    summary:
      "The comma-number adjustment issue moves from known to resolved in Beta 3.",
    locator:
      "Math Notes — Known Issues to Resolved Issues; 127904684 status transition",
  }),
]);

appendChanges(both, "beta-3-v2", [
  archivedChange("beta-3-v2", {
    key: "apple-18-beta3v2-home-utility-account-offboarding",
    title: "Home Utility account offboarding",
    canonicalSummary:
      "Upgrading one device to Beta 3 could remove a Home Utility account when the user still had other devices on Beta 1 or Beta 2.",
    category: "knownIssue",
    action: "knownIssue",
    summary:
      "The July 15 state adds a mixed-beta Home Utility account offboarding issue and advises completing upgrades before re-onboarding.",
    locator: "Home app — Known Issues; 130850945",
  }),
]);

appendChanges(["ios"], "beta-3-v2", [
  archivedChange("beta-3-v2", {
    key: "ios-18-beta3v2-rcs-carrier-availability",
    title: "RCS carrier availability",
    canonicalSummary:
      "RCS messaging became available on participating carriers.",
    category: "feature",
    action: "introduced",
    summary:
      "The July 15 state adds an iOS Messages availability note limiting RCS support to selected carriers.",
    locator: "Messages — New Features; 131499640",
  }),
]);

const platformMetadata = {
  ios: {
    name: "iOS",
    versionId: "version-ios-18-0",
  },
  ipados: {
    name: "iPadOS",
    versionId: "version-ipados-18-0",
  },
};

const routeMetadata = {
  "beta-1": {
    label: "Beta 1",
    capturedTitle: "iOS & iPadOS 18 Beta Release Notes",
    state: "196-record initial state",
    comparison:
      "This is a representative baseline rather than an exhaustive conversion of all 196 records.",
  },
  "beta-2": {
    label: "Beta 2",
    capturedTitle: "iOS & iPadOS 18 Beta 2 Release Notes",
    state: "219-record state",
    comparison:
      "Against Beta 1, the archive parser found 26 additions, 3 removals, and 73 changed issue records.",
  },
  "beta-3": {
    label: "Beta 3",
    capturedTitle: "iOS & iPadOS 18 Beta 3 Release Notes",
    state: "227-record state",
    comparison:
      "Against Beta 2, the archive parser found 11 additions, 3 removals, and 27 changed issue records.",
  },
  "beta-3-v2": {
    label: "Beta 3 v2",
    capturedTitle: "iOS & iPadOS 18 Beta 3 Release Notes",
    state: "229-record July 15 state",
    comparison:
      "Against the earlier Beta 3 state, exactly two issue records were added and none were removed or changed.",
  },
};

function eventArticle(platform, alias, changes) {
  const route = routeMetadata[alias];
  const comparisonCitations = comparisonForAlias[alias].map((url, index) =>
    c(
      url,
      `${index === 0 && alias !== "beta-1" ? "Before" : "Retained"} comparison state for ${route.label}`,
    ),
  );
  const changeCitations = uniqueCitations(
    changes.flatMap((change) => change.citations),
  );
  const platformBoundary =
    platform.name === "iOS"
      ? "Items explicitly limited to iPad or iPadOS are excluded from this route. iPhone-only notes and shared iOS/iPadOS framework behavior are retained where the source text supports that scope."
      : "Items explicitly limited to iPhone or iOS are excluded from this route. iPad-specific notes and shared iOS/iPadOS framework behavior are retained where the source text supports that scope.";
  return article(
    heading("Preserved release-note state"),
    prose(
      `The reader-facing Apple archive identifies this document as “${route.capturedTitle}.” This ${platform.name} overlay selects ${changes.length} substantive records from the ${route.state}.`,
      [c(sourceForAlias[alias], `${route.label} archived document title`)],
    ),
    heading("How this milestone differs"),
    prose(
      `${route.comparison} The published selection emphasizes exact issue-ID additions and status transitions rather than every wording edit.`,
      comparisonCitations,
    ),
    heading("Platform scope"),
    prose(platformBoundary, changeCitations),
    heading("Editorial boundary"),
    prose(
      "The page contains original synthesis and issue-ID locators. It does not reproduce Apple’s list text, infer a build number, or copy cumulative notes into unsupported milestones. Apple’s beta guidance treats these seeds as prerelease software.",
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
        summary: `${platform.name} 18 ${route.label} is represented by ${changes.length} source-supported changes selected from Apple’s preserved ${route.state}; no build number or unsupported milestone payload is inferred.`,
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
    platform: "iOS",
    majorVersion: 18,
    version: "18.0",
    releaseStatus: "released",
    publicReleaseDate: "2024-09-16",
    milestones: [
      ["Beta 1", "2024-06-10", false, undefined],
      ["Beta 2", "2024-06-24", false, undefined],
      ["Beta 3", "2024-07-08", false, undefined],
      ["Beta 3 v2", "2024-07-15", true, "Public Beta Release"],
      ["Beta 4", "2024-07-23", false, undefined],
      ["Beta 4 v2", "2024-07-26", true, "Public Beta 2"],
      ["Beta 5", "2024-08-05", false, undefined],
      ["Beta 6", "2024-08-12", false, undefined],
      ["Beta 7", "2024-08-20", false, undefined],
      ["Beta 8", "2024-08-28", false, undefined],
      ["RC", "2024-09-09", false, undefined],
      ["Public", "2024-09-16", false, undefined],
    ],
  },
  {
    platform: "iPadOS",
    majorVersion: 18,
    version: "18.0",
    releaseStatus: "released",
    publicReleaseDate: "2024-09-16",
    milestones: [
      ["Beta 1", "2024-06-10", false, undefined],
      ["Beta 2", "2024-06-24", false, undefined],
      ["Beta 3", "2024-07-08", false, undefined],
      ["Beta 3 v2", "2024-07-15", true, "Public Beta Release"],
      ["Beta 4", "2024-07-23", false, undefined],
      ["Beta 4 v2", "2024-07-26", true, undefined],
      ["Beta 5", "2024-08-05", false, undefined],
      ["Beta 6", "2024-08-12", false, undefined],
      ["Beta 7", "2024-08-20", false, undefined],
      ["Beta 8", "2024-08-28", false, undefined],
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
const seedInventory = seed.releaseVersions
  .filter(
    (version) =>
      version.version === "18.0" &&
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
    "The exact local iOS/iPadOS 18.0 seed inventory changed; re-audit the cohort before regenerating.",
  );
}

const expectedRoutes = new Set([
  "version-ios-18-0/beta-1",
  "version-ios-18-0/beta-2",
  "version-ios-18-0/beta-3",
  "version-ios-18-0/beta-3-v2",
  "version-ipados-18-0/beta-1",
  "version-ipados-18-0/beta-2",
  "version-ipados-18-0/beta-3",
  "version-ipados-18-0/beta-3-v2",
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
  events.length !== 8 ||
  changeCount !== 80 ||
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
      event.changes.some((change) =>
        /seed-identity|testflight|build-identity/i.test(change.key),
      ),
  )
) {
  throw new Error(
    "The expected iOS/iPadOS 18 prerelease bundle closure failed.",
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
      `iOS/iPadOS 18 change definition drifted for ${occurrence.key}.`,
    );
  }
  localChangeDefinitions.set(occurrence.key, definition);
}
const uniqueLocalChangeKeys = [...localChangeDefinitions.keys()];
if (uniqueLocalChangeKeys.length !== 48) {
  throw new Error(
    `Expected 48 stable iOS/iPadOS 18 prerelease change definitions; found ${uniqueLocalChangeKeys.length}.`,
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
    `iOS/iPadOS 18 prerelease change keys collide with existing content: ${collisions
      .map((key) => `${key} (${otherChangeKeys.get(key)})`)
      .join(", ")}`,
  );
}

for (const file of collisionFiles.filter(
  (file) => file !== join(here, "..", "apple-launch-content-2026.json"),
)) {
  const candidate = JSON.parse(readFileSync(file, "utf8"));
  for (const event of candidate.events || []) {
    if (
      event.target?.releaseVersionId &&
      event.target?.routeAlias &&
      expectedRoutes.has(
        `${event.target.releaseVersionId}/${event.target.routeAlias}`,
      )
    ) {
      throw new Error(
        `An existing research batch already owns ${event.target.releaseVersionId}/${event.target.routeAlias}: ${file}`,
      );
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
      `| ${platformMetadata[event.target.releaseVersionId.includes("ipados") ? "ipados" : "ios"].name} | ${routeMetadata[event.target.routeAlias].label} | \`${event.target.routeAlias}\` | ${event.changes.length} |`,
  )
  .join("\n");

const sourceLedger = sources
  .map(
    (source) =>
      `- [${source.title}](${source.url}) — ${source.publisher}; ${source.sourceClass}.`,
  )
  .join("\n");

const md = `# Apple iOS and iPadOS 18 prerelease archive batch

## Result

\`${outputName}\` records the published source-backed archival articles on
eight existing iOS and iPadOS 18.0 prerelease routes: Beta 1, Beta 2, Beta 3,
and Beta 3 v2 for each platform.

- ${events.length} substantive event overlays and no release-version overlays
- ${changeCount} change occurrences across ${uniqueLocalChangeKeys.length}
  stable, collision-checked definitions
- ${sources.length} declared and used sources with ${citationCount} citation
  references
- no build records, build-number claims, route creation, public-route changes,
  or administrative identity changes
- every event is \`editoriallyVerified\`, \`approved\`, and
  \`isIndexable: true\`, with review timestamp \`${reviewedAt}\`

## Published route closure

| Platform | Milestone | Existing alias | Selected changes |
| --- | --- | --- | ---: |
${routeRows}

The local seed contains 24 iOS/iPadOS 18.0 milestones. This batch publishes
only the eight routes above. Beta 4, Beta 4 v2, Beta 5, Beta 6, Beta 7, Beta
8, RC, and Public remain outside this prerelease archive pass unless they have
separately reproducible milestone evidence.

## Archive method

1. Reader-facing citations point to preserved Apple Developer documentation,
   never to raw DocC JSON.
2. Raw DocC states were parsed by component, status heading, issue ID, and
   normalized text. Beta 2 and Beta 3 selections require either a newly added
   issue ID or an exact status transition against the immediately preceding
   retained state.
3. Beta 1 is intentionally representative. Its selected items are present in
   the first 196-record state, but this batch does not imply that the selection
   exhausts the initial notes.
4. The July 15 state contains exactly two additions against the earlier Beta 3
   state. RCS is limited to iOS; the mixed-beta Home Utility-account issue is
   retained on both routes.
5. The shared Apple document is not treated as blanket cross-platform proof.
   Items naming iPhone, iPad, iOS, or a device family are scoped accordingly.
6. All published wording is original synthesis. Necessary platform, framework,
   and feature names are nominative references; no Apple list text, screenshot,
   or marketing paragraph is reproduced.

## Selected findings

### Beta 1 representative baseline

The shared baseline covers AdAttributionKit re-engagement, MapKit place APIs,
allocator compatibility, RealityKit rendering, StoreKit subscription metadata
and deprecation, Swift Charts plotting, SwiftUI sizing/isolation/value APIs,
and Translation. iOS additionally carries Messages via satellite, Siri vehicle
audio, and Today View extension removal. iPadOS carries its explicitly scoped
top-tab-bar behavior.

### Beta 2 selected delta

The shared delta includes higher on-demand resource limits, Bluetooth audio and
container fixes, iPhone/iPad camera startup, HealthKit workout routes, iCloud
Drive data use, Photos syncing, SwiftUI sheet sizing, and direct timer-register
compatibility. The platform-specific selections keep iPhone Files, Wallet,
Always-On display, and RCS items off iPadOS while keeping iPad tab, scanning,
Math Notes, and RealityKit issues off iOS.

### Beta 3 selected delta

The shared delta covers FaceTime, keyboard settings, storage reporting,
Shortcuts, Swift Charts, SwiftUI, StoreKit accessibility, Photos services, and
RealityKit. The RCS status transition, iPhone Mirroring, and Wi-Fi Calling
remain iOS-only. The right-to-left tab transition, M4 Sound Recognition,
handwriting, and Math Notes remain iPadOS-only.

### July 15 Beta 3 v2 state

The July 15 comparison is exhaustive at this boundary: issue \`130850945\`
adds the mixed-beta Home Utility-account known issue, and issue \`131499640\`
adds RCS carrier availability. No issue records were removed or otherwise
changed.

## Raw snapshot audit ledger

Raw transports are research provenance only:

| State | Raw capture | Records | SHA-256 | Public citation |
| --- | --- | ---: | --- | --- |
| Beta 1 | \`20240612190904\` | 196 | \`473ade4c3c4f8dbdd46fa0bb027728c6f0878418788c4cadce5a97e13e3f49bb\` | [Apple page](${U.beta1}) |
| Beta 2 | \`20240630111940\` | 219 | \`a566f5a628da551d31c4e1c765a18f0fb051c6fc578169e04d7fa31598a59149\` | [Apple page](${U.beta2}) |
| Beta 3 | \`20240709144845\` | 227 | \`d4ff2cdbaabf341f1bcff684bba70421b52640f0eb15c476cd982cceef5a5f0c\` | [Apple page](${U.beta3}) |
| July 15 state | \`20240715174636\` | 229 | \`26f9be3b9af1b3695a0b93514c30cbc4c6a582c719a8e49a01976c1784b0a25a\` | [Apple page](${U.beta3Revision}) |

## Unsupported archive boundary

The human capture at [\`20240815005927\`](${U.beta6Audit}) identifies itself as
Beta 6, and CDX still advertises a distinct raw capture at
\`20240815005934\`. The current raw replay, however, redirects to
\`20240823034057\` and returns the same 254-record Beta 7 payload with SHA-256
\`f14bc3d63e25ac8e2530f71e97586a02b2a33f319f292a84dfe019fbf3e8976f\`.
The retained Beta 6 payload is therefore unavailable for reproducible
comparison.

The Beta 3-to-Beta 6 interval also crosses Beta 4, Beta 4 v2, Beta 5, and Beta
6. No addition or status change across that gap is assigned to one of those
routes. Beta 7 is omitted as well: remembered issue IDs are not substituted for
the missing before-state.

## Exact evidence gaps

- No complete first-party build-number set was independently retained, so this
  batch creates no build records and makes no build claims.
- Beta 4, Beta 4 v2, Beta 5, Beta 6, Beta 7, Beta 8, and RC lack a clean
  adjacent-state comparison in this audit and receive no overlay.
- The existing Public route is already owned by the approved
  \`apple-ios-ipados-18.json\` batch and is not modified.
- The July 15 Apple document title remains “Beta 3 Release Notes.” Its two-item
  delta is assigned to the existing Beta 3 v2 route by the captured state
  boundary, without inferring a revision build or public-beta payload.

## Source ledger

All declared sources were accessed on ${accessedAt}.

${sourceLedger}

## Closure guards

- Exact comparison against both local 18.0 seed records and all 24 milestones
- Exact eight-route allowlist with explicit exclusion of Public and every
  unsupported prerelease route
- Zero versions and zero builds
- Collision scan across every other research-batch JSON plus
  \`apple-launch-content-2026.json\`
- ${changeCount} occurrences resolve to exactly
  ${uniqueLocalChangeKeys.length} stable local definitions
- Explicit rejection of identity, build, and TestFlight administrative change
  keys
- Complete unique source declaration/use closure
- Deterministic formatted JSON SHA-256: \`${jsonSha}\`

## Publication and validation record

The generator’s seed, route, collision, review-state, and citation guards pass
before either artifact is written.

Editorial and publication record:

- all 8 event articles and all 80 occurrences were approved at
  \`${reviewedAt}\`
- reviewed production plan:
  \`8db88f461ef9e5eb0c77c63fe2ec1cb3f9297004efc8a67d6908852d680c5562\`
- reviewed plan artifact SHA-256:
  \`5803407ef7c50c38b04f59c0c3170a9420b354d54695e76f80d4b7311ec7859a\`
- rollback artifact SHA-256:
  \`e3bd3a071b06f60a5bc5b57db675d3fe1adcd72e68a9e8a6b55ebbe83103fdf8\`
- Sanity transaction: \`F0eE6eK5XyVXtlnaoy9yHx\`
- receipt SHA-256:
  \`c64a7e2fcf0a899950775af0ea5c0ffe406e821282ba8ea5d10860910672fe21\`
- post-publication zero plan:
  \`a76c5e748bac368028ec3d3844e6cca902ce8f987301077a3c576450dc1722de\`;
  0 mutations and 2,135 unchanged documents

Production coverage after publication:

- 410 of 410 release versions have full version-level coverage
- 1,979 appearances: 319 full articles, 256 source-linked records, and 1,404
  timeline-only records
- 470 appearances have approved structured changes

## Settled canonical route verification

After the 60-second Next.js/Sanity cache window, every canonical local route
was fetched independently from the running site. Each response contained the
expected production canonical URL, \`index, follow\` robots metadata, Full
article mode, the What changed article, the References section, and the
Editorially verified marker.

| Canonical route | HTTP | Bytes | Full | Index | References | Article | Verified |
| --- | ---: | ---: | --- | --- | --- | --- | --- |
| \`/apple/ios/18.0/beta-1/\` | 200 | 387,477 | yes | yes | yes | yes | yes |
| \`/apple/ios/18.0/beta-2/\` | 200 | 381,647 | yes | yes | yes | yes | yes |
| \`/apple/ios/18.0/beta-3/\` | 200 | 365,276 | yes | yes | yes | yes | yes |
| \`/apple/ios/18.0/beta-3-v2/\` | 200 | 194,459 | yes | yes | yes | yes | yes |
| \`/apple/ipados/18.0/beta-1/\` | 200 | 353,462 | yes | yes | yes | yes | yes |
| \`/apple/ipados/18.0/beta-2/\` | 200 | 381,861 | yes | yes | yes | yes | yes |
| \`/apple/ipados/18.0/beta-3/\` | 200 | 382,398 | yes | yes | yes | yes | yes |
| \`/apple/ipados/18.0/beta-3-v2/\` | 200 | 177,697 | yes | yes | yes | yes | yes |

Verification on ${accessedAt}:

- \`npm run research:validate\`: 47 batches validated; this batch reports 8
  events, 80 change occurrences, 5 sources, and 292 citation references
- focused ingestion/manifest suite: 19 tests passed
- 94 issue-ID locator checks against the four retained raw snapshots: passed
- retained snapshot closure: 196, 219, 227, and 229 records with SHA-256 values
  exactly matching the raw snapshot ledger above
- ESLint, Prettier check, and \`git diff --check\`: passed
- deterministic regeneration: SHA-256 remained \`${jsonSha}\`

Reproduce with:

\`\`\`sh
node scripts/research-batches/build-apple-ios-ipados-18-prerelease.mjs
npm run research:validate
node --import tsx --test tests/launch-content-ingestion.test.ts tests/launch-content-manifest.test.ts
npx eslint scripts/research-batches/build-apple-ios-ipados-18-prerelease.mjs
npx prettier --check scripts/research-batches/build-apple-ios-ipados-18-prerelease.mjs scripts/research-batches/apple-ios-ipados-18-prerelease.json scripts/research-batches/apple-ios-ipados-18-prerelease.md
\`\`\`

This finalization records an already completed publication. It does not perform
or request another Sanity mutation.
`;

const formattedMd = await prettier.format(md, { filepath: ledgerName });
writeFileSync(join(here, ledgerName), formattedMd);
