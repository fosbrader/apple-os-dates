import { createHash } from "node:crypto";
import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import prettier from "prettier";

const here = dirname(fileURLToPath(import.meta.url));
const outputName = "apple-ios-ipados-16-prerelease.json";
const ledgerName = "apple-ios-ipados-16-prerelease.md";
const accessedAt = "2026-07-30";
const reviewedAt = "2026-07-30T08:15:41Z";
const publication = {
  planSha: "39e7a493aa964b3dbf85a33641b1b759112b3fb659e0682728ac672261bee6dc",
  planArtifactSha:
    "ff6869a3a21e4690279dc9afa5db35bb253d0102c98a798133a12b1270521033",
  rollbackArtifactSha:
    "e670892e5cb9388cbeec6688eedf6927fc0525fa3167a573ccd706aeb37218cd",
  transactionId: "eOgq1Ovu5XNUv1qNFUsndf",
  receiptSha:
    "6a11d231c9fa25c3ca9764f1179b7257834dbdfad0c19e25df5984c3c9bef27c",
  immediateZeroPlanSha:
    "0de0d100f1069ab764b3a327351e13546f7306e3a69dbf913c8acb4d16781efd",
  immediateZeroPlanArtifactSha:
    "ca219c134d78d8a6862c0718f84a43f080fdc0563fb0d0056dc0249c61f56efd",
  immediateZeroRollbackArtifactSha:
    "a92f4f8885d2c5006ca9c12f15294d7be96420e8322d53e44ed2d1bda95db07d",
  immediateZeroUnchanged: 2143,
  immediateZeroPayloadBytes: 16,
};

const U = {
  installBeta: "https://developer.apple.com/support/install-beta",
  beta1:
    "https://web.archive.org/web/20220610044940/https://developer.apple.com/documentation/iOS-iPadOS-Release-Notes/ios-ipados-16-release-notes",
  beta1Transport:
    "https://web.archive.org/web/20220608015846id_/https://developer.apple.com/tutorials/data/documentation/iOS-iPadOS-Release-Notes/ios-ipados-16-release-notes.json",
  beta2:
    "https://web.archive.org/web/20220623235135/https://developer.apple.com/documentation/ios-ipados-release-notes/ios-ipados-16-release-notes",
  beta2Transport:
    "https://web.archive.org/web/20220622231823id_/https://developer.apple.com/tutorials/data/documentation/ios-ipados-release-notes/ios-ipados-16-release-notes.json",
  beta2Revision:
    "https://web.archive.org/web/20220628053941/https://developer.apple.com/documentation/ios-ipados-release-notes/ios-ipados-16-release-notes",
  beta2RevisionTransport:
    "https://web.archive.org/web/20220628053943id_/https://developer.apple.com/tutorials/data/documentation/ios-ipados-release-notes/ios-ipados-16-release-notes.json",
  beta3:
    "https://web.archive.org/web/20220706210814/https://developer.apple.com/documentation/ios-ipados-release-notes/ios-ipados-16-release-notes",
  beta3Transport:
    "https://web.archive.org/web/20220706194549id_/https://developer.apple.com/tutorials/data/documentation/ios-ipados-release-notes/ios-ipados-16-release-notes.json",
  beta7Audit:
    "https://web.archive.org/web/20220823230919/https://developer.apple.com/documentation/ios-ipados-release-notes/ios-ipados-16-release-notes",
  beta7AuditTransport:
    "https://web.archive.org/web/20220823230920id_/https://developer.apple.com/tutorials/data/documentation/ios-ipados-release-notes/ios-ipados-16-release-notes.json",
};

const archiveSources = [
  [
    U.beta1,
    U.beta1Transport,
    "iOS & iPadOS 16 Beta Release Notes",
    "2022-06-10T04:49:40.000Z",
    "Beta 1",
  ],
  [
    U.beta2,
    U.beta2Transport,
    "iOS & iPadOS 16 Beta 2 Release Notes",
    "2022-06-23T23:51:35.000Z",
    "Beta 2",
  ],
  [
    U.beta2Revision,
    U.beta2RevisionTransport,
    "iOS & iPadOS 16 Beta 2 Release Notes — June 28 state",
    "2022-06-28T05:39:41.000Z",
    "Beta 2 retained revision",
  ],
  [
    U.beta3,
    U.beta3Transport,
    "iOS & iPadOS 16 Beta 3 Release Notes",
    "2022-07-06T21:08:14.000Z",
    "Beta 3",
  ],
].map(([url, transportUrl, title, publishedAt, milestone]) => ({
  url,
  transportUrl,
  title: `${title} (preserved snapshot)`,
  publisher: "Apple Developer via Internet Archive",
  sourceClass: "archive",
  author: "Apple",
  publishedAt,
  topics: ["iOS", "iPadOS", "16.0", milestone, "historical release notes"],
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

const c = (url, locator, note) => ({
  url,
  ...(locator ? { locator } : {}),
  ...(note ? { note } : {}),
});
const heading = (text) => ({ style: "h2", text });
const prose = (text, citations) => ({ style: "normal", text, citations });
const article = (...blocks) => ({ authorship: "originalSynthesis", blocks });
const uniqueCitations = (citations) => [
  ...new Map(
    citations.map((citation) => [
      `${citation.url}|${citation.locator || ""}|${citation.note || ""}`,
      citation,
    ]),
  ).values(),
];

const sourceForAlias = {
  "beta-1": U.beta1,
  "beta-2": U.beta2,
  "beta-3": U.beta3,
};

function verificationFor(alias) {
  if (alias === "beta-1") {
    return "Selected as a representative substantive record present in Apple’s first retained 143-record Beta 1 DocC state; the baseline selection is intentionally not exhaustive.";
  }
  if (alias === "beta-2") {
    return "Matched the issue ID, component, status heading, and normalized text in the first retained 175-record Beta 2 state against the 143-record Beta 1 state.";
  }
  return "Matched the issue ID, component, status heading, and normalized text in the 192-record Beta 3 state against the latest retained 180-record Beta 2 state from June 28.";
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
    citations: [
      c(
        sourceForAlias[alias],
        input.locator,
        input.citationNote ||
          `Original synthesis from the preserved Apple ${alias.replace("-", " ")} record.`,
      ),
    ],
  };
}

const routeChanges = new Map();
const appendChanges = (platforms, alias, inputs) => {
  for (const platform of platforms) {
    const key = `${platform}/${alias}`;
    routeChanges.set(key, [
      ...(routeChanges.get(key) || []),
      ...inputs.map((input) => archivedChange(alias, input)),
    ]);
  }
};
const both = ["ios", "ipados"];

appendChanges(both, "beta-1", [
  {
    key: "apple-16-beta1-storekit-app-purchase-verification",
    title: "StoreKit app-purchase verification",
    canonicalSummary:
      "StoreKit added a cryptographic way for an app to verify that its copy was obtained through the App Store.",
    category: "developerApi",
    action: "introduced",
    summary:
      "The initial SDK notes describe an app-purchase verification capability for checking App Store provenance.",
    locator: "App Store — New Features; 86739279",
  },
  {
    key: "apple-16-beta1-storekit-transaction-environment",
    title: "StoreKit transaction environment metadata",
    canonicalSummary:
      "StoreKit transaction and renewal information gained metadata identifying the server environment in which each record originated.",
    category: "developerApi",
    action: "introduced",
    summary:
      "Apps can distinguish the server environment associated with transaction and subscription-renewal information.",
    locator: "App Store — New Features; 85988753",
  },
  {
    key: "apple-16-beta1-roomplan-interior-capture",
    title: "RoomPlan interior capture",
    canonicalSummary:
      "The new RoomPlan framework used device sensing and machine learning to construct parametric 3D room models with custom-interface and USD export support.",
    category: "developerApi",
    action: "introduced",
    summary:
      "The initial state introduces a framework for guided room scanning, live capture data, and 3D model export.",
    locator: "RoomPlan — New Features; 84170837",
  },
  {
    key: "apple-16-beta1-swiftui-multiline-textfield",
    title: "SwiftUI multiline text fields",
    canonicalSummary:
      "SwiftUI text fields gained an axis-based multiline mode for short and medium-length editable text.",
    category: "developerApi",
    action: "introduced",
    summary:
      "Developers can configure a text field to grow across multiple lines without replacing it with a long-form text editor.",
    locator: "SwiftUI — New Features; 51463718",
  },
  {
    key: "apple-16-beta1-swiftui-navigation-bar-defaults",
    title: "SwiftUI navigation-bar defaults",
    canonicalSummary:
      "SwiftUI changed navigation bars to hide automatically when empty and to choose inline or large title presentation according to whether a title exists.",
    category: "behavior",
    action: "changed",
    summary:
      "Apps adopting the new SDK need to account for revised title presentation and automatic hiding of empty navigation bars.",
    locator: "SwiftUI — New Features; 84996257",
  },
  {
    key: "apple-16-beta1-swiftui-content-transitions",
    title: "SwiftUI automatic content transitions",
    canonicalSummary:
      "SwiftUI began animating changes to text and image content by default while providing an identity transition to opt out.",
    category: "behavior",
    action: "changed",
    summary:
      "Text and image updates adopt automatic animation unless an app explicitly requests no content transition.",
    locator: "SwiftUI — New Features; 89558882",
  },
  {
    key: "apple-16-beta1-swiftui-scroll-keyboard-dismissal",
    title: "SwiftUI scroll-driven keyboard dismissal",
    canonicalSummary:
      "SwiftUI lists and forms began dismissing the software keyboard when scrolling starts, with an API to retain the prior behavior.",
    category: "behavior",
    action: "changed",
    summary:
      "Scrolling a list or form now dismisses the keyboard by default, and apps can opt back out.",
    locator: "SwiftUI — New Features; 89588639",
  },
  {
    key: "apple-16-beta1-storekit-concurrency-annotations",
    title: "StoreKit concurrency annotations",
    canonicalSummary:
      "StoreKit APIs were annotated for Swift sendability and main-actor isolation.",
    category: "developerApi",
    action: "changed",
    summary:
      "The SDK applies concurrency annotations across StoreKit, affecting compile-time isolation and sendability checks.",
    locator: "StoreKit — New Features; 84157048",
  },
  {
    key: "apple-16-beta1-app-intents-release-builds",
    title: "App Intents release-build failure",
    canonicalSummary:
      "App Intents could fail when compiled in a Release configuration unless the conforming type was made public.",
    category: "knownIssue",
    action: "knownIssue",
    summary:
      "Apple documents a Release-build compatibility problem and a visibility-based workaround for affected intent types.",
    locator: "Swift — Known Issues; 93668260",
  },
  {
    key: "apple-16-beta1-matter-owner-pairing",
    title: "Matter accessory pairing ownership",
    canonicalSummary:
      "The initial Home implementation limited Matter pairing to the home owner and required the initiating device to use the home hub’s iCloud account.",
    category: "knownIssue",
    action: "knownIssue",
    summary:
      "Matter accessory setup had account and ownership restrictions in the first retained beta state.",
    locator: "Home — Known Issues; 76012945",
  },
]);

appendChanges(["ios"], "beta-1", [
  {
    key: "ios-16-beta1-healthkit-vision-prescriptions",
    title: "HealthKit vision prescriptions",
    canonicalSummary:
      "HealthKit added structured vision-prescription samples, document attachments, and per-sample authorization intended to limit unintended disclosure.",
    category: "developerApi",
    action: "introduced",
    summary:
      "The iOS baseline adds prescription data and attachment support with granular authorization for access to sensitive samples.",
    locator: "HealthKit — New Features; 82940646",
  },
  {
    key: "ios-16-beta1-game-controller-expansion",
    title: "Broader game-controller support",
    canonicalSummary:
      "The Game Controller framework expanded its supported set of Bluetooth and USB controllers on iOS 16.",
    category: "enhancement",
    action: "introduced",
    summary:
      "Apple’s initial notes explicitly list iOS 16 among the systems gaining support for additional controllers.",
    locator: "Game Controller — New Features; 82409809",
  },
  {
    key: "ios-16-beta1-emoji-lock-screen-search",
    title: "Emoji Lock Screen search",
    canonicalSummary:
      "The emoji Lock Screen editor was missing its search field in the first beta.",
    category: "knownIssue",
    action: "knownIssue",
    summary:
      "Apple identifies a missing search control in the iPhone Lock Screen’s emoji editor.",
    locator: "Emoji — Known Issues; 88603664",
  },
  {
    key: "ios-16-beta1-emoji-wallpaper-modifiers",
    title: "Emoji wallpaper modifiers",
    canonicalSummary:
      "Some emoji skin-tone and related modifiers could not be selected while configuring an emoji wallpaper.",
    category: "knownIssue",
    action: "knownIssue",
    summary:
      "The initial Lock Screen tooling could prevent selection of emoji modifiers during wallpaper setup.",
    locator: "Emoji — Known Issues; 93095669",
  },
  {
    key: "ios-16-beta1-siri-tv-remote-buttons",
    title: "Siri after using TV Remote",
    canonicalSummary:
      "Using the TV Remote app or Control Center remote could leave the iPhone’s hardware-button Siri activation unresponsive until restart.",
    category: "knownIssue",
    action: "knownIssue",
    summary:
      "The first beta notes an iPhone Siri activation failure associated with the TV Remote interfaces.",
    locator: "Siri — Known Issues; 94008258",
  },
  {
    key: "ios-16-beta1-voicemail-transcriptions",
    title: "Unavailable voicemail transcriptions",
    canonicalSummary:
      "Voicemail transcription was unavailable in the first retained iOS 16 beta state.",
    category: "knownIssue",
    action: "knownIssue",
    summary:
      "Apple flags voicemail transcription as unavailable during this initial prerelease milestone.",
    locator: "Voicemail — Known Issues; 93907701",
  },
]);

appendChanges(["ipados"], "beta-1", [
  {
    key: "ipados-16-beta1-stage-manager-low-resolution",
    title: "Stage Manager at lower resolutions",
    canonicalSummary:
      "Stage Manager content could render incorrectly when the connected-display resolution was below 4K.",
    category: "knownIssue",
    action: "knownIssue",
    summary:
      "The initial iPadOS notes warn that Stage Manager display output could be incorrect below 4K.",
    locator: "Stage Manager — Known Issues; 91981726",
  },
  {
    key: "ipados-16-beta1-lock-screen-timers",
    title: "Timers absent from the iPad Lock Screen",
    canonicalSummary:
      "Active timers did not appear on the iPad Lock Screen in the first beta.",
    category: "knownIssue",
    action: "knownIssue",
    summary:
      "Apple records an iPad-specific Lock Screen omission for running timers.",
    locator: "Home Screen — Known Issues; 93508904",
  },
  {
    key: "ipados-16-beta1-swiftui-table-headers",
    title: "SwiftUI table-header appearance",
    canonicalSummary:
      "SwiftUI table headers could use an incorrect appearance on iPad unless rows were wrapped in a section.",
    category: "knownIssue",
    action: "knownIssue",
    summary:
      "The iPad presentation bug came with a documented section-wrapping workaround.",
    locator: "SwiftUI — Known Issues; 92933472",
  },
  {
    key: "ipados-16-beta1-cellular-activation",
    title: "Cellular iPad activation",
    canonicalSummary:
      "A cellular iPad could fail to activate over cellular service during initial setup or after erasing the device.",
    category: "knownIssue",
    action: "knownIssue",
    summary:
      "The retained state identifies an iPad-specific activation failure affecting clean setup and erase workflows.",
    locator: "Telephony — Known Issues; 93295742",
  },
  {
    key: "ipados-16-beta1-metalfx-m1-creation",
    title: "MetalFX creation on M1 iPad",
    canonicalSummary:
      "Creating the MetalFX temporal-scaling effect could terminate unexpectedly on an M1-equipped iPad.",
    category: "knownIssue",
    action: "knownIssue",
    summary:
      "Apple advises using macOS for testing because effect creation could fail on M1 iPad hardware.",
    locator: "Metal Offline Compiler — Known Issues; 93278732",
  },
  {
    key: "ipados-16-beta1-external-display-status-bar",
    title: "External-display status bar",
    canonicalSummary:
      "The status bar could disappear on an external display after entering the app switcher.",
    category: "knownIssue",
    action: "knownIssue",
    summary:
      "The first iPadOS beta records an external-display status-bar failure with a reconnect workaround.",
    locator: "Home Screen — Known Issues; 93211110",
  },
]);

appendChanges(both, "beta-2", [
  {
    key: "apple-16-beta2-coregraphics-byte-order-validation",
    title: "CoreGraphics image byte-order validation",
    canonicalSummary:
      "CoreGraphics tightened image-construction validation so an invalid byte-order parameter could no longer load an image.",
    category: "compatibility",
    action: "changed",
    summary:
      "The Beta 2 notes warn that stricter parameter checking can expose invalid image creation code.",
    locator: "CoreGraphics — Deprecations; 94855401",
  },
  {
    key: "apple-16-beta2-storekit-format-styles",
    title: "StoreKit price and subscription format styles",
    canonicalSummary:
      "StoreKit products gained localized formatting helpers for prices and subscription periods, including a newer unit formatter on the 16-generation SDKs.",
    category: "developerApi",
    action: "introduced",
    summary:
      "Beta 2 adds product-level localization APIs for monetary values and subscription durations.",
    locator: "StoreKit — New Features in beta 2; 93780442",
  },
  {
    key: "apple-16-beta2-skdownload-deprecation",
    title: "SKDownload and hosted purchase assets",
    canonicalSummary:
      "Apple deprecated SKDownload and ended App Store hosting and App Store Connect management for nonconsumable in-app-purchase assets.",
    category: "removal",
    action: "removed",
    summary:
      "The Beta 2 document records the retirement path for StoreKit-hosted nonconsumable assets.",
    locator: "StoreKit — Deprecations; 89764253",
  },
  {
    key: "apple-16-beta2-realitykit-sdk-crash",
    title: "RealityKit Beta 2 SDK crash risk",
    canonicalSummary:
      "Apple advised developers to avoid an affected RealityKit API in the Beta 2 SDK because it could crash.",
    category: "knownIssue",
    action: "knownIssue",
    summary:
      "The preserved Beta 2 state adds a broad SDK stability warning for the affected RealityKit API.",
    locator: "RealityKit — Known Issues; 95647020",
  },
  {
    key: "apple-16-beta2-metalfx-minimum-input",
    title: "MetalFX temporal-scaler minimum input",
    canonicalSummary:
      "The Beta 2 temporal scaler required an input resolution of at least 1280 by 720 and returned no object below that threshold.",
    category: "knownIssue",
    action: "knownIssue",
    summary:
      "Developers need to respect a temporary minimum input resolution when constructing the temporal scaler.",
    locator: "MetalFX — Known Issues; 95390607",
  },
  {
    key: "apple-16-beta2-focus-filter-rename-fix",
    title: "Focus Filter deletion after intent rename",
    canonicalSummary:
      "Beta 2 fixed Focus Filters becoming undeletable after the underlying app intent was renamed.",
    category: "bugFix",
    action: "fixed",
    summary:
      "The issue moves from App Intents known issue in Beta 1 to resolved in Beta 2.",
    locator:
      "App Intents — Known Issues to Resolved in beta 2; 94235463 status transition",
  },
  {
    key: "apple-16-beta2-shortcuts-localized-parameters-fix",
    title: "Localized App Intents parameters",
    canonicalSummary:
      "Beta 2 fixed interpolated localized-string parameters appearing as raw format markers in Shortcuts and Focus Filters.",
    category: "bugFix",
    action: "fixed",
    summary:
      "The localization failure changes from known in the first state to resolved in Beta 2.",
    locator:
      "Shortcuts — Known Issues to Resolved in beta 2; 93520037 status transition",
  },
  {
    key: "apple-16-beta2-swiftui-layout-children-fix",
    title: "SwiftUI custom Layout children",
    canonicalSummary:
      "Beta 2 fixed custom SwiftUI Layout implementations failing to compile when given multiple child views.",
    category: "bugFix",
    action: "fixed",
    summary:
      "The compiler problem is retained under a resolved Beta 2 heading after appearing as a Beta 1 known issue.",
    locator:
      "SwiftUI — Known Issues to Resolved in beta 2; 92914226 status transition",
  },
  {
    key: "apple-16-beta2-cloudkit-simulator-launch",
    title: "CloudKit simulator launch failure",
    canonicalSummary:
      "CloudKit apps could fail to launch in Simulator because a Swift CloudKit library could not be loaded.",
    category: "knownIssue",
    action: "knownIssue",
    summary:
      "Beta 2 adds a Simulator-only CloudKit launch problem with a deployment-target workaround.",
    locator: "CloudKit — Known Issues; 94331191",
  },
]);

appendChanges(["ios"], "beta-2", [
  {
    key: "ios-16-beta2-lte-backup",
    title: "Device backup over LTE",
    canonicalSummary:
      "iOS 16 Beta 2 expanded device backup connectivity to LTE in addition to 5G and Wi-Fi.",
    category: "enhancement",
    action: "introduced",
    summary:
      "Apple explicitly scopes the new LTE backup option to customers using iOS 16.",
    locator: "Backup — New Features in beta 2; 95276719",
  },
  {
    key: "ios-16-beta2-healthkit-multisport-workouts",
    title: "HealthKit multisport workouts",
    canonicalSummary:
      "HealthKit workout APIs added multisport sessions spanning swimming, cycling, and running.",
    category: "developerApi",
    action: "introduced",
    summary:
      "Beta 2 adds a structured workout type for transitions among the three supported endurance activities.",
    locator: "HealthKit — New Features in beta 2; 82588168",
  },
  {
    key: "ios-16-beta2-healthkit-running-metrics",
    title: "HealthKit running metrics",
    canonicalSummary:
      "HealthKit added data types for running power, ground contact time, vertical oscillation, speed, and stride length.",
    category: "developerApi",
    action: "introduced",
    summary:
      "The Beta 2 SDK exposes a broader set of running-workout measurements.",
    locator: "HealthKit — New Features in beta 2; 82974514",
  },
  {
    key: "ios-16-beta2-healthkit-afib-history",
    title: "HealthKit AFib History data",
    canonicalSummary:
      "HealthKit added a data type for tracking atrial-fibrillation history.",
    category: "developerApi",
    action: "introduced",
    summary:
      "The retained Beta 2 notes identify a new HealthKit data type for AFib History.",
    locator: "HealthKit — New Features in beta 2; 95315701",
  },
  {
    key: "ios-16-beta2-sms-subcategories",
    title: "SMS transaction and promotion subcategories",
    canonicalSummary:
      "Messages classification APIs expanded incoming unknown-number SMS into twelve finer transaction and promotion subcategories.",
    category: "enhancement",
    action: "introduced",
    summary:
      "Beta 2 gives developers more categories for organizing transaction and promotional SMS.",
    locator: "Messages — New Features in beta 2; 95276296",
  },
  {
    key: "ios-16-beta2-sms-event-extraction",
    title: "SMS event extraction in India",
    canonicalSummary:
      "Messages added event extraction for Indian SMS users, surfacing appointments as suggestions in Messages and Calendar.",
    category: "feature",
    action: "introduced",
    summary:
      "The feature converts supported event and appointment messages into Siri and Calendar suggestions.",
    locator: "Messages — New Features in beta 2; 95276513",
  },
  {
    key: "ios-16-beta2-carrier-junk-reporting",
    title: "Carrier SMS and MMS junk reporting",
    canonicalSummary:
      "Messages extended junk reporting so customers of selected US carriers could send unknown-sender SMS or MMS reports to their carrier.",
    category: "enhancement",
    action: "introduced",
    summary:
      "The Beta 2 capability is carrier-limited and appears within the unknown-senders workflow.",
    locator: "Messages — New Features in beta 2; 95276623",
  },
  {
    key: "ios-16-beta2-dual-sim-message-filtering",
    title: "Dual-SIM message filtering",
    canonicalSummary:
      "Messages added filtering by line for customers using a dual-SIM iPhone.",
    category: "feature",
    action: "introduced",
    summary:
      "Beta 2 lets dual-SIM iPhone users separate messages according to their SIM lines.",
    locator: "Messages — New Features in beta 2; 95276784",
  },
  {
    key: "ios-16-beta2-widgetkit-lock-screen-previews",
    title: "WidgetKit Lock Screen preview fix",
    canonicalSummary:
      "Beta 2 fixed accessory-family widgets failing to appear correctly in Xcode Lock Screen previews for an iOS target.",
    category: "bugFix",
    action: "fixed",
    summary:
      "The retained state records a resolved Xcode preview issue for the new Lock Screen widget families.",
    locator: "WidgetKit — Resolved in beta 2; 93480607",
  },
  {
    key: "ios-16-beta2-wallpaper-restore-loss",
    title: "Custom wallpapers after iCloud restore",
    canonicalSummary:
      "Restoring an iCloud backup could replace custom Lock Screens with the default iOS 16 wallpaper.",
    category: "knownIssue",
    action: "knownIssue",
    summary:
      "Beta 2 adds a data-restoration risk specific to customized iOS 16 wallpapers.",
    locator: "Wallpapers — Known Issues; 94306911",
  },
]);

appendChanges(["ipados"], "beta-2", [
  {
    key: "ipados-16-beta2-maps-older-ipads",
    title: "Maps tiles on lower-core iPads",
    canonicalSummary:
      "Maps could fail to load map tiles and search previews on iPads equipped with two- or three-core CPUs.",
    category: "knownIssue",
    action: "knownIssue",
    summary:
      "The Beta 2 state adds an iPad-specific Maps rendering and search-preview failure.",
    locator: "Maps — Known issues; 94502723",
  },
  {
    key: "ipados-16-beta2-stage-manager-keyboard-touches",
    title: "Stage Manager keyboard touch events",
    canonicalSummary:
      "Stage Manager windows could receive unintended touch events while the software keyboard was in use.",
    category: "knownIssue",
    action: "knownIssue",
    summary:
      "Apple adds a Stage Manager input-routing issue affecting typing with the on-screen keyboard.",
    locator: "Stage Manager — Known Issues; 92645222",
  },
  {
    key: "ipados-16-beta2-external-display-canvas",
    title: "External-display canvas sizing",
    canonicalSummary:
      "Some connected displays used the wrong canvas size and rendered portions of the interface off-screen.",
    category: "knownIssue",
    action: "knownIssue",
    summary:
      "The Beta 2 notes recommend display mirroring as a workaround for incorrect external-display sizing.",
    locator: "Home Screen — Known Issues; 93481462",
  },
]);

appendChanges(both, "beta-3", [
  {
    key: "apple-16-beta3-swiftui-scroll-content-background",
    title: "SwiftUI scroll-content backgrounds",
    canonicalSummary:
      "SwiftUI added a view modifier for customizing backgrounds in scrollable containers such as lists.",
    category: "developerApi",
    action: "introduced",
    summary:
      "Beta 3 exposes direct scroll-content background customization in SwiftUI.",
    locator: "SwiftUI — New Features in beta 3; 45928055",
  },
  {
    key: "apple-16-beta3-swiftui-focused-objects",
    title: "SwiftUI focused objects",
    canonicalSummary:
      "SwiftUI added focused-object and focused-scene-object modifiers for vending observable objects from the focused view or scene.",
    category: "developerApi",
    action: "introduced",
    summary:
      "The new modifiers pair with FocusedObject so focus can supply an observable object through a view hierarchy.",
    locator: "SwiftUI — New Features in beta 3; 83637876",
  },
  {
    key: "apple-16-beta3-storekit-start-date-fix",
    title: "StoreKit recent subscription start date",
    canonicalSummary:
      "Beta 3 fixed StoreKit testing always returning a distant-past value for a subscription’s recent start date.",
    category: "bugFix",
    action: "fixed",
    summary:
      "The issue moves from known in the retained Beta 2 state to resolved in Beta 3.",
    locator:
      "StoreKit — Known Issues to Resolved in beta 3; 93794298 status transition",
  },
  {
    key: "apple-16-beta3-weatherkit-device-authentication",
    title: "WeatherKit device authentication",
    canonicalSummary:
      "WeatherKit service authentication could intermittently fail when an app launched on physical hardware.",
    category: "knownIssue",
    action: "knownIssue",
    summary:
      "Beta 3 adds an intermittent physical-device authentication issue with relaunch as the workaround.",
    locator: "WeatherKit — Known Issues; 95866480",
  },
  {
    key: "apple-16-beta3-weatherkit-simulator-requests",
    title: "WeatherKit Simulator requests",
    canonicalSummary:
      "WeatherKit requests could intermittently fail in Simulator and needed to be retried.",
    category: "knownIssue",
    action: "knownIssue",
    summary:
      "The Beta 3 document separately identifies intermittent WeatherKit failures in Simulator.",
    locator: "WeatherKit — Known Issues; 96101505",
  },
  {
    key: "apple-16-beta3-siri-app-shortcut-parameters",
    title: "Parameterized App Shortcut phrases",
    canonicalSummary:
      "Parameterized App Shortcut phrases could fail through Siri, although phrases without parameters continued to work.",
    category: "knownIssue",
    action: "knownIssue",
    summary:
      "Beta 3 adds a Siri integration failure limited to parameterized App Shortcut phrases.",
    locator: "Siri — Known Issues; 96128292",
  },
  {
    key: "apple-16-beta3-maps-share-eta-localization",
    title: "Share ETA localization",
    canonicalSummary:
      "Some strings used when one Maps user shared trip status with another were not localized.",
    category: "knownIssue",
    action: "knownIssue",
    summary:
      "The retained Beta 3 state adds a localization gap in the Maps Share ETA workflow.",
    locator: "Maps — Known issues; 86537613",
  },
]);

appendChanges(["ios"], "beta-3", [
  {
    key: "ios-16-beta3-esim-conversion-calls",
    title: "Calls after physical-SIM to eSIM conversion",
    canonicalSummary:
      "Incoming and outgoing calls could fail after converting a line from a physical SIM to eSIM on the same iPhone.",
    category: "knownIssue",
    action: "knownIssue",
    summary:
      "Beta 3 adds a telephony regression tied to same-device SIM conversion.",
    locator: "Telephony — Known Issues; 96261293",
  },
  {
    key: "ios-16-beta3-china-cellular-app-switches",
    title: "Per-app cellular settings on China-region iPhones",
    canonicalSummary:
      "After clean installation and backup restoration on affected China-region iPhones, third-party per-app cellular switches could be disabled.",
    category: "knownIssue",
    action: "knownIssue",
    summary:
      "Apple documents a regional cellular-settings problem and directs users to re-enable affected app switches.",
    locator: "Telephony — Known Issues; 95570535",
  },
  {
    key: "ios-16-beta3-focus-poster-from-photos",
    title: "Focus state after creating a poster",
    canonicalSummary:
      "Creating and applying a new Lock Screen poster from the Photos share sheet could leave the previously paired Focus active.",
    category: "knownIssue",
    action: "knownIssue",
    summary:
      "The Beta 3 document adds a Focus and Lock Screen poster state mismatch in the Photos sharing flow.",
    locator: "Posters — Known Issues; 94060721",
  },
]);

appendChanges(["ipados"], "beta-3", [
  {
    key: "ipados-16-beta3-external-display-camera",
    title: "Camera use on an external display",
    canonicalSummary:
      "On iPad, camera access while using an external display was limited to FaceTime in the retained Beta 3 state.",
    category: "knownIssue",
    action: "knownIssue",
    summary:
      "Beta 3 adds an explicit iPad external-display limitation for camera access.",
    locator: "Home Screen — Known Issues; 93877953",
  },
  {
    key: "ipados-16-beta3-mail-move-with-keyboard",
    title: "Mail move picker with a hardware keyboard",
    canonicalSummary:
      "Mail’s folder picker could become unresponsive when moving multiple selected messages with a keyboard attached.",
    category: "knownIssue",
    action: "knownIssue",
    summary:
      "The retained Beta 3 state adds a hardware-keyboard workflow failure for moving multiple messages.",
    locator: "Mail — Known issues; 96028740",
  },
]);

const platformMetadata = {
  ios: { name: "iOS", versionId: "version-ios-16-0" },
  ipados: { name: "iPadOS", versionId: "version-ipados-16-0" },
};

const routeMetadata = {
  "beta-1": {
    label: "Beta 1",
    capturedTitle: "iOS & iPadOS 16 Beta Release Notes",
    state: "143-record initial state",
    comparison:
      "This page is a representative baseline, not an exhaustive conversion of all 143 initial records.",
  },
  "beta-2": {
    label: "Beta 2",
    capturedTitle: "iOS & iPadOS 16 Beta 2 Release Notes",
    state: "175-record initial Beta 2 state",
    comparison:
      "Against Beta 1, the parser found 31 additions, no removals, and 35 records whose heading or text changed.",
  },
  "beta-3": {
    label: "Beta 3",
    capturedTitle: "iOS & iPadOS 16 Beta 3 Release Notes",
    state: "192-record Beta 3 state",
    comparison:
      "Against the latest retained 180-record Beta 2 state, the parser found 11 additions, no removals, and 5 changed records.",
  },
};

const comparisonForAlias = {
  "beta-1": [U.beta1],
  "beta-2": [U.beta1, U.beta2],
  "beta-3": [U.beta2Revision, U.beta3],
};

function eventArticle(platform, alias, changes) {
  const route = routeMetadata[alias];
  const platformBoundary =
    platform.name === "iOS"
      ? "The selection retains shared SDK records and notes explicitly scoped to iPhone or iOS. iPad-only Stage Manager, external-display, and iPad hardware claims are excluded."
      : "The selection retains shared SDK records and notes explicitly scoped to iPad or iPadOS. iPhone telephony, voicemail, HealthKit user workflows, and iOS Lock Screen claims are excluded.";
  return article(
    heading("Preserved release-note state"),
    prose(
      `The archived Apple reader identifies this document as “${route.capturedTitle}.” This ${platform.name} page selects ${changes.length} substantive records from the ${route.state}.`,
      [c(sourceForAlias[alias], `${route.label} archived document title`)],
    ),
    heading("How this milestone differs"),
    prose(
      `${route.comparison} Only exact issue-ID additions or meaningful status transitions are used for later milestones; wording-only edits are not presented as release changes.`,
      comparisonForAlias[alias].map((url, index) =>
        c(
          url,
          `${index === 0 && alias !== "beta-1" ? "Before" : "Retained"} comparison state for ${route.label}`,
        ),
      ),
    ),
    heading("Platform scope"),
    prose(
      platformBoundary,
      uniqueCitations(changes.flatMap((change) => change.citations)),
    ),
    heading("Editorial boundary"),
    prose(
      "This article is original synthesis with issue-ID locators. It does not reproduce Apple’s list text, infer build numbers, assign the June 28 document revision to a nonexistent route, or copy the cumulative Beta 7 state into missing milestones.",
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
        summary: `${platform.name} 16 ${route.label} is represented by ${changes.length} source-supported changes selected from Apple’s preserved ${route.state}; unsupported routes and build numbers are not inferred.`,
        article: eventArticle(platform, alias, changes),
        citations: uniqueCitations([
          ...comparisonForAlias[alias].map((url) =>
            c(url, `${route.label} snapshot comparison`),
          ),
          ...changes.flatMap((change) => change.citations),
        ]),
        changes,
        provenanceStatus: "editoriallyVerified",
        editorialReview: { status: "approved", reviewedAt },
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
    majorVersion: 16,
    version: "16.0",
    releaseStatus: "released",
    publicReleaseDate: "2022-09-12",
    milestones: [
      ["Beta 1", "2022-06-06", false, undefined],
      ["Beta 2", "2022-06-22", false, undefined],
      ["Beta 3", "2022-07-06", false, undefined],
      ["Beta 3 v2", "2022-07-11", true, undefined],
      ["Public Beta 1", "2022-07-11", false, undefined],
      ["Beta 4", "2022-07-27", false, undefined],
      ["Beta 5", "2022-08-08", false, undefined],
      ["Beta 6", "2022-08-15", false, undefined],
      ["Beta 7", "2022-08-23", false, undefined],
      ["Beta 8", "2022-08-29", false, undefined],
      ["RC", "2022-09-07", false, undefined],
      ["Public", "2022-09-12", false, undefined],
    ],
  },
  {
    platform: "iPadOS",
    majorVersion: 16,
    version: "16.0",
    releaseStatus: "superseded",
    publicReleaseDate: undefined,
    milestones: [
      ["Beta 1", "2022-06-06", false, undefined],
      ["Beta 2", "2022-06-22", false, undefined],
      ["Beta 3", "2022-07-06", false, undefined],
      ["Beta 3 v2", "2022-07-11", true, undefined],
      ["Public Beta 1", "2022-07-11", false, undefined],
      ["Beta 4", "2022-07-27", false, undefined],
      ["Beta 5", "2022-08-08", false, undefined],
      ["Beta 6", "2022-08-15", false, undefined],
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
      version.version === "16.0" &&
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
    "The exact local iOS/iPadOS 16.0 seed inventory changed; re-audit the cohort before regenerating.",
  );
}

const expectedRoutes = new Set([
  "version-ios-16-0/beta-1",
  "version-ios-16-0/beta-2",
  "version-ios-16-0/beta-3",
  "version-ipados-16-0/beta-1",
  "version-ipados-16-0/beta-2",
  "version-ipados-16-0/beta-3",
]);
const expectedRouteCounts = new Map([
  ["version-ios-16-0/beta-1", 16],
  ["version-ios-16-0/beta-2", 19],
  ["version-ios-16-0/beta-3", 10],
  ["version-ipados-16-0/beta-1", 16],
  ["version-ipados-16-0/beta-2", 12],
  ["version-ipados-16-0/beta-3", 9],
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
  events.length !== 6 ||
  changeCount !== 82 ||
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
    "The expected iOS/iPadOS 16 prerelease bundle closure failed.",
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
      `iOS/iPadOS 16 change definition drifted for ${occurrence.key}.`,
    );
  }
  localChangeDefinitions.set(occurrence.key, definition);
}
const uniqueLocalChangeKeys = [...localChangeDefinitions.keys()];
if (uniqueLocalChangeKeys.length !== 56) {
  throw new Error(
    `Expected 56 stable iOS/iPadOS 16 prerelease definitions; found ${uniqueLocalChangeKeys.length}.`,
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
    `iOS/iPadOS 16 prerelease change keys collide with existing content: ${collisions
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
const sourceLedger = sources
  .map(
    (source) =>
      `- [${source.title}](${source.url}) — ${source.publisher}; ${source.sourceClass}.`,
  )
  .join("\n");

const md = `# Apple iOS and iPadOS 16 prerelease archive batch

## Result

\`${outputName}\` records the published, source-backed archival articles for
six existing iOS and iPadOS 16.0 routes: Beta 1, Beta 2, and Beta 3 on each
platform.

- ${events.length} substantive event overlays and no release-version overlays
- ${changeCount} change occurrences across ${uniqueLocalChangeKeys.length}
  stable, collision-checked definitions
- ${sources.length} declared and used sources with ${citationCount} citation
  references
- zero builds, build-number claims, route creation, Public-route changes, or
  administrative identity changes
- every event is \`editoriallyVerified\`, approved at \`${reviewedAt}\`, and
  \`isIndexable: true\`

## Published route closure

| Platform | Milestone | Existing alias | Selected changes |
| --- | --- | --- | ---: |
${routeRows}

The local seed contains 20 iOS/iPadOS 16.0 milestones. This batch publishes
only the six routes above. Beta 3 v2, Public Beta 1, Beta 4, Beta 5, Beta 6,
iOS Beta 7, iOS Beta 8, iOS RC, and Public remain outside this archive pass.

## Archive method

1. An uncollapsed CDX query was run for both the reader path and the raw DocC
   transport path, limited to calendar year 2022 and HTTP 200 captures.
2. Reader-facing citations point to archived Apple Developer pages. Raw JSON
   transport URLs are retained only as source provenance and are never used as
   public citations.
3. DocC payloads were decoded, parsed by component and status heading, keyed by
   issue ID, and compared as adjacent retained states.
4. Beta 1 is representative. Beta 2 uses the first title-identified Beta 2
   state against Beta 1. Beta 3 uses the June 28 Beta 2 document revision as
   its immediate before-state.
5. Wording-only changes, duplicate section moves, TestFlight administration,
   and records without a defensible product or developer meaning were excluded.
6. Shared Apple documentation was not treated as blanket cross-platform proof.
   Explicit iPhone, iPad, telephony, Lock Screen, HealthKit user-interface,
   Stage Manager, and hardware language determined route scope.

## Selected findings

### Beta 1 representative baseline

The shared baseline covers StoreKit purchase provenance and environment
metadata, RoomPlan, SwiftUI presentation and interaction behavior, StoreKit
concurrency annotations, App Intents build compatibility, and Matter pairing.
iOS carries the explicitly iPhone-oriented HealthKit, controller, Lock Screen,
Siri, and voicemail records. iPadOS carries Stage Manager, external-display,
cellular-activation, table, timer, and M1 iPad records.

### Beta 2 clean milestone

The shared delta includes stricter CoreGraphics input validation, StoreKit
formatting and deprecation changes, RealityKit and MetalFX limitations, three
resolved developer issues, and a CloudKit Simulator failure. iOS adds LTE
backup, HealthKit workout data, carrier and dual-SIM Messages features,
Lock Screen widget previews, and wallpaper restoration. iPadOS adds older-iPad
Maps, Stage Manager input, and external-display sizing issues.

### Beta 3 clean milestone

The Beta 3 comparison isolates two SwiftUI APIs, a StoreKit testing fix,
WeatherKit failures, a parameterized Siri shortcut issue, and Maps
localization. Telephony and poster records remain iOS-only; external-display
camera access and the attached-keyboard Mail workflow remain iPadOS-only.

## Raw snapshot audit ledger

The SHA-256 values below are calculated over the decoded JSON payload serialized
by \`JSON.stringify\`, matching the repository audit helper.

| State | Raw capture | DocC title | Records | SHA-256 | Public citation |
| --- | --- | --- | ---: | --- | --- |
| Beta 1 | \`20220608015846\` | iOS & iPadOS 16 Beta Release Notes | 143 | \`fcb5607ceda361187b782a1d35e994eb27e7578adfecdbbedac16fadd53644cd\` | [Apple page](${U.beta1}) |
| Beta 2 | \`20220622231823\` | iOS & iPadOS 16 Beta 2 Release Notes | 175 | \`637c863f20b7b3986914ceb096f30aaa10769c39e964e1048b79b9abd155d5b3\` | [Apple page](${U.beta2}) |
| Beta 2 revision | \`20220628053943\` | iOS & iPadOS 16 Beta 2 Release Notes | 180 | \`56ea71abca299bce6ac30f6290733a90933448967668ef95d56d716cdc8ca304\` | [Apple page](${U.beta2Revision}) |
| Beta 3 | \`20220706194549\` | iOS & iPadOS 16 Beta 3 Release Notes | 192 | \`69b60f65d00d142dbbc754d122cdf4bfbeb9ca2d1c8128e504f5e81e403192b4\` | [Apple page](${U.beta3}) |
| Beta 7 audit | \`20220823230920\` | iOS & iPadOS 16 Beta 7 Release Notes | 203 | \`f5433b299af07811ecfb844b11a65439aebd77fc9d0e81b41cb5bb664b0c99bd\` | [Apple page](${U.beta7Audit}) |

Adjacent parser results:

- Beta 1 → initial Beta 2: 31 additions, 0 removals, 35 changed records
- initial Beta 2 → June 28 Beta 2 revision: 8 additions, 1 removal, 7
  changed records
- June 28 Beta 2 revision → Beta 3: 11 additions, 0 removals, 5 changed
  records
- Beta 3 → Beta 7: 14 additions, 3 removals, 127 changed records

## Exact evidence gaps

- The June 28 payload still identifies itself as Beta 2. It is used only as
  the before-state for Beta 3; its eight additions are not assigned to Beta 3
  v2, Public Beta 1, or any invented route.
- No retained raw state isolates the July 11 Beta 3 v2 or same-day Public Beta
  1 seed.
- The next raw snapshot after Beta 3 is Beta 7 on August 23. That interval
  crosses Beta 4, Beta 5, Beta 6, and Beta 7, so none of its additions or 127
  changed records are attributed to a route.
- The archive returned no raw Beta 8 or RC state in the audited 2022 CDX
  inventory.
- No complete first-party build-number set was independently retained, so the
  batch creates no build records and makes no build claims.
- Public is already owned by \`apple-ios-ipados-16.json\` and is untouched.
  iPadOS 16.0 was superseded without a Public milestone in the exact local seed.

## Source ledger

All declared sources were accessed on ${accessedAt}.

${sourceLedger}

## Closure guards

- Exact comparison against both local 16.0 seed records and all 20 milestones
- Exact six-route allowlist with explicit exclusion of Public and every
  unsupported prerelease route
- Zero versions and zero builds
- Collision scan across every other research-batch JSON plus
  \`apple-launch-content-2026.json\`
- ${changeCount} occurrences resolve to exactly
  ${uniqueLocalChangeKeys.length} stable local definitions
- Explicit rejection of identity, build, TestFlight, and administrative change
  keys
- Complete unique source declaration/use closure
- Deterministic formatted JSON SHA-256: \`${jsonSha}\`

## Publication and validation record

Root editorial review approved all six event articles and all
${changeCount} change occurrences at \`${reviewedAt}\`.

Publication record:

- reviewed production plan: \`${publication.planSha}\`
- reviewed plan artifact SHA-256:
  \`${publication.planArtifactSha}\`
- rollback artifact SHA-256:
  \`${publication.rollbackArtifactSha}\`
- Sanity transaction: \`${publication.transactionId}\`
- receipt SHA-256: \`${publication.receiptSha}\`
- immediate post-publication zero plan:
  \`${publication.immediateZeroPlanSha}\`
- zero-plan artifact SHA-256:
  \`${publication.immediateZeroPlanArtifactSha}\`
- zero-plan rollback artifact SHA-256:
  \`${publication.immediateZeroRollbackArtifactSha}\`
- zero mutations, ${publication.immediateZeroUnchanged.toLocaleString()}
  unchanged documents, and
  ${publication.immediateZeroPayloadBytes.toLocaleString()} mutation-payload
  bytes
- the final deterministic regeneration dry run reproduced this exact zero plan

Production coverage after publication:

- 410 of 410 release versions have full version-level coverage
- 1,979 appearances: 345 full articles, 256 source-linked records, and 1,378
  timeline-only records
- 496 appearances have approved structured changes

Settled local route verification:

- every iOS and iPadOS Beta 1, Beta 2, and Beta 3 route returned HTTP 200
- all six responses contained Full article mode, the “Preserved release-note
  state” article, References, and \`index, follow\`
- no route contained placeholder text or \`noindex\`

Validation on ${accessedAt}:

- \`npm run research:validate\`: 50 batches validated; this batch reports 6
  events, ${changeCount} change occurrences, ${sources.length} sources, and
  ${citationCount} citation references
- focused ingestion/manifest suite: 19 tests passed
- 82 issue-ID locator, component-heading, and status-heading checks against
  the exact Beta 1, Beta 2, and Beta 3 raw snapshots: passed
- copyright-similarity scan: the longest contiguous overlap between editorial
  fields and Apple list records was 7 words
- ESLint, Prettier check, and \`git diff --check\`: passed
- deterministic regeneration preserved the approved JSON exactly
- the post-publication planner reported no Sanity changes

Reproduce with:

\`\`\`sh
node scripts/research-batches/build-apple-ios-ipados-16-prerelease.mjs
npm run research:validate
node --import tsx --test tests/launch-content-ingestion.test.ts tests/launch-content-manifest.test.ts
npx eslint scripts/research-batches/build-apple-ios-ipados-16-prerelease.mjs
npx prettier --check scripts/research-batches/build-apple-ios-ipados-16-prerelease.mjs scripts/research-batches/apple-ios-ipados-16-prerelease.json scripts/research-batches/apple-ios-ipados-16-prerelease.md
npx sanity exec scripts/ingest-launch-content.ts --with-user-token -- --content scripts/research-batches/apple-ios-ipados-16-prerelease.json
\`\`\`

This finalization records an already completed publication. It does not perform
or request another Sanity mutation.
`;

const formattedMd = await prettier.format(md, { filepath: ledgerName });
writeFileSync(join(here, ledgerName), formattedMd);
