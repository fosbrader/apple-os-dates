import { createHash } from "node:crypto";
import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import prettier from "prettier";

const here = dirname(fileURLToPath(import.meta.url));
const outputName = "apple-ios-ipados-15-prerelease.json";
const ledgerName = "apple-ios-ipados-15-prerelease.md";
const accessedAt = "2026-07-30";
const reviewedAt = "2026-07-30T08:22:43Z";

const archivePath =
  "https://developer.apple.com/documentation/ios-ipados-release-notes/ios-ipados-15-beta-release-notes";
const transportPath =
  "https://developer.apple.com/tutorials/data/documentation/ios-ipados-release-notes/ios-ipados-15-beta-release-notes.json";

const U = {
  installBeta: "https://developer.apple.com/support/install-beta",
  beta1: `https://web.archive.org/web/20210612230307/${archivePath}`,
  beta1Transport: `https://web.archive.org/web/20210612230308id_/${transportPath}`,
  beta2: `https://web.archive.org/web/20210714160635/${archivePath}`,
  beta2Transport: `https://web.archive.org/web/20210714160642id_/${transportPath}`,
  beta4: `https://web.archive.org/web/20210727223431/${archivePath}`,
  beta4Transport: `https://web.archive.org/web/20210727223431id_/${transportPath}`,
  beta4Revision: `https://web.archive.org/web/20210804024501/${archivePath}`,
  beta4RevisionTransport: `https://web.archive.org/web/20210804024502id_/${transportPath}`,
  beta6: `https://web.archive.org/web/20210822111412/${archivePath}`,
  beta6Transport: `https://web.archive.org/web/20210822111415id_/${transportPath}`,
  beta8: `https://web.archive.org/web/20210914131935/${archivePath}`,
  beta8Transport: `https://web.archive.org/web/20210914131936id_/${transportPath}`,
};

const archiveSources = [
  [
    U.beta1,
    U.beta1Transport,
    "iOS & iPadOS 15 Beta Release Notes",
    "2021-06-12T23:03:07.000Z",
    "Beta 1",
  ],
  [
    U.beta2,
    U.beta2Transport,
    "iOS & iPadOS 15 Beta 2 Release Notes",
    "2021-07-14T16:06:35.000Z",
    "Beta 2",
  ],
  [
    U.beta4,
    U.beta4Transport,
    "iOS & iPadOS 15 Beta 4 Release Notes",
    "2021-07-27T22:34:31.000Z",
    "Beta 3 and Beta 4 headings",
  ],
  [
    U.beta4Revision,
    U.beta4RevisionTransport,
    "iOS & iPadOS 15 Beta 4 Release Notes — August 4 state",
    "2021-08-04T02:45:01.000Z",
    "Beta 4 retained revision",
  ],
  [
    U.beta6,
    U.beta6Transport,
    "iOS & iPadOS 15 Beta 6 Release Notes",
    "2021-08-22T11:14:12.000Z",
    "Beta 5 and Beta 6 headings",
  ],
  [
    U.beta8,
    U.beta8Transport,
    "iOS & iPadOS 15 Beta 8 Release Notes",
    "2021-09-14T13:19:35.000Z",
    "Beta 7 and Beta 8 headings",
  ],
].map(([url, transportUrl, title, publishedAt, milestone]) => ({
  url,
  transportUrl,
  title: `${title} (preserved snapshot)`,
  publisher: "Apple Developer via Internet Archive",
  sourceClass: "archive",
  author: "Apple",
  publishedAt,
  topics: ["iOS", "iPadOS", "15.0", milestone, "historical release notes"],
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
  "beta-3": U.beta4,
  "beta-4": U.beta4Revision,
  "beta-5": U.beta6,
  "beta-6": U.beta6,
  "beta-7": U.beta8,
  "beta-8": U.beta8,
};

const comparisonForAlias = {
  "beta-1": [U.beta1],
  "beta-2": [U.beta1, U.beta2],
  "beta-3": [U.beta2, U.beta4],
  "beta-4": [U.beta4, U.beta4Revision],
  "beta-5": [U.beta4Revision, U.beta6],
  "beta-6": [U.beta4Revision, U.beta6],
  "beta-7": [U.beta6, U.beta8],
  "beta-8": [U.beta6, U.beta8],
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

const exactHeadingForAlias = {
  "beta-1": "iOS & iPadOS 15 beta",
  "beta-2": "iOS & iPadOS 15 beta 2",
  "beta-3": "iOS & iPadOS 15 beta 3",
  "beta-4": "iOS & iPadOS 15 beta 4",
  "beta-5": "iOS & iPadOS 15 beta 5",
  "beta-6": "iOS & iPadOS 15 beta 6",
  "beta-7": "iOS & iPadOS 15 beta 7",
  "beta-8": "iOS & iPadOS 15 beta 8",
};

function verificationFor(alias) {
  if (alias === "beta-1") {
    return "Selected as a representative capability or SDK behavior retained beneath Apple's exact “New Features in iOS & iPadOS 15 beta” heading in the first preserved 146-record DocC state; the baseline is intentionally not exhaustive.";
  }
  const headingLabel = exactHeadingForAlias[alias];
  const state =
    alias === "beta-2"
      ? "195-record Beta 2 state"
      : ["beta-3", "beta-4"].includes(alias)
        ? "238-record retained Beta 4 state"
        : ["beta-5", "beta-6"].includes(alias)
          ? "242-record retained Beta 6 state"
          : "250-record retained Beta 8 state";
  return `Matched the component and retained issue ID beneath Apple's exact “New Features in ${headingLabel}” or “Resolved in ${headingLabel}” status heading in the ${state}; generic cumulative records and crossed-gap diff attribution are excluded.`;
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
        input.source || sourceForAlias[alias],
        input.locator,
        input.citationNote,
      ),
    ],
  };
}

const change = (
  key,
  title,
  canonicalSummary,
  category,
  action,
  summary,
  locator,
  extra = {},
) => ({
  key,
  title,
  canonicalSummary,
  category,
  action,
  summary,
  locator,
  ...extra,
});

const routeChanges = new Map();
const appendChanges = (platforms, alias, changes) => {
  for (const platform of platforms) {
    const key = `${platform}/${alias}`;
    routeChanges.set(key, [
      ...(routeChanges.get(key) || []),
      ...changes.map((item) => archivedChange(alias, item)),
    ]);
  }
};
const both = ["ios", "ipados"];

appendChanges(both, "beta-1", [
  change(
    "apple-15-beta1-storekit2",
    "StoreKit 2 transaction APIs",
    "StoreKit gained a Swift-native purchase and transaction interface built around concurrency and signed transaction data.",
    "developerApi",
    "introduced",
    "The first beta documents a modern StoreKit path for loading products, making purchases, managing entitlements, and receiving signed transaction information.",
    "App Store — New Features in iOS & iPadOS 15 beta; 66587964",
  ),
  change(
    "apple-15-beta1-create-ml-on-device",
    "Create ML on iPhone and iPad",
    "Create ML became available on iOS and iPadOS for several on-device classification and tabular-model workflows.",
    "developerApi",
    "introduced",
    "The initial SDK state brings image, sound, text, hand-pose, hand-action, and tabular training tasks onto iPhone and iPad.",
    "Create ML — New Features in iOS & iPadOS 15 beta; 37087332",
  ),
  change(
    "apple-15-beta1-foundation-grammar-agreement",
    "Automatic grammar agreement",
    "Foundation added localized grammar inflection for number, gender, and forms of address.",
    "developerApi",
    "introduced",
    "Localization code can delegate selected grammatical agreement to the system instead of maintaining every inflected string variant.",
    "Foundation — New Features in iOS & iPadOS 15 beta; 70210115",
  ),
  change(
    "apple-15-beta1-foundation-formatting",
    "Value-focused formatting APIs",
    "Foundation added formatting interfaces configured directly from the value being rendered.",
    "developerApi",
    "introduced",
    "The new approach reduces the need to construct and cache separate formatter instances for common value types.",
    "Foundation — New Features in iOS & iPadOS 15 beta; 70220307",
  ),
  change(
    "apple-15-beta1-foundation-json5",
    "JSON5 decoding",
    "Foundation JSON serialization and decoding gained JSON5 input support.",
    "developerApi",
    "introduced",
    "The first beta expands Foundation's accepted JSON syntax to include JSON5.",
    "Foundation — New Features in iOS & iPadOS 15 beta; 73954652",
  ),
  change(
    "apple-15-beta1-swift-signposting",
    "Swift performance signposting",
    "The system logging framework added Swift-native signpost creation and scoped interval measurement.",
    "developerApi",
    "introduced",
    "Developers gained a lower-overhead Swift interface for emitting points, beginning and ending intervals, and surrounding work with measured spans.",
    "Logging — New Features in iOS & iPadOS 15 beta; 54756831",
  ),
  change(
    "apple-15-beta1-accept-language-fallback",
    "Locale-aware Accept-Language fallback",
    "SDK-linked networking began adding the current system language as a fallback when it differed from the preferred language.",
    "behavior",
    "changed",
    "The default request language header was corrected for multiple locales and could now contain both the preferred and system languages.",
    "Networking — New Features in iOS & iPadOS 15 beta; 38772422",
  ),
  change(
    "apple-15-beta1-record-app-activity-export",
    "Record App Activity export",
    "Privacy settings gained an export containing an app's sensor, data, and network access activity.",
    "feature",
    "introduced",
    "The initial beta exposes a downloadable activity record from the system privacy settings for later inspection.",
    "Privacy — New Features in iOS & iPadOS 15 beta; 77758720",
  ),
  change(
    "apple-15-beta1-skadnetwork-winning-postback",
    "SKAdNetwork winning-postback copy",
    "Advertised-app developers could opt in to receive a copy of the winning attribution postback.",
    "developerApi",
    "introduced",
    "The attribution flow can send the successful postback to the advertised app's developer as well as its existing destination.",
    "SKAdNetwork — New Features in iOS & iPadOS 15 beta; 75054513",
  ),
  change(
    "apple-15-beta1-attributed-string",
    "Swift AttributedString",
    "Swift gained a localizable attributed-text value with Markdown, Codable, and strongly typed attribute support.",
    "developerApi",
    "introduced",
    "The new value type combines localized character handling with structured text attributes and serialization.",
    "Swift — New Features in iOS & iPadOS 15 beta; 27227292",
  ),
  change(
    "apple-15-beta1-async-notifications",
    "Asynchronous notification sequences",
    "Foundation notifications gained an async-await consumption interface.",
    "developerApi",
    "introduced",
    "Notification observers could consume system notifications through Swift concurrency rather than only callback-based delivery.",
    "Swift — New Features in iOS & iPadOS 15 beta; 74401384",
  ),
  change(
    "apple-15-beta1-swiftui-markdown-text",
    "Markdown in SwiftUI Text",
    "SwiftUI Text began parsing and styling supported Markdown from localized strings and literals.",
    "developerApi",
    "introduced",
    "Text views can render structured emphasis and links supplied through Markdown-aware string content.",
    "SwiftUI — New Features in iOS & iPadOS 15 beta; 74515884",
  ),
  change(
    "apple-15-beta1-swiftui-off-main-animations",
    "Off-main-thread SwiftUI animations",
    "Some SwiftUI animation work moved away from the main thread and imposed new thread-safety requirements on custom animation code.",
    "compatibility",
    "changed",
    "Developers need to audit custom geometry, shape, and animation closures because selected animation evaluation can occur off the main thread.",
    "SwiftUI — New Features in iOS & iPadOS 15 beta; 70524799",
  ),
  change(
    "apple-15-beta1-tabular-data",
    "TabularData framework",
    "A Swift framework was added for reading, joining, grouping, aggregating, and transforming table-shaped data.",
    "developerApi",
    "introduced",
    "The new framework supports CSV and JSON input plus common analytical operations over columns and rows.",
    "TabularData — New Features in iOS & iPadOS 15 beta; 69982458",
  ),
  change(
    "apple-15-beta1-uikit-key-command-priority",
    "UIKit key-command priority",
    "SDK-linked key commands stopped intercepting ordinary text entry unless an explicit priority behavior was requested.",
    "compatibility",
    "changed",
    "Apps with keyboard shortcuts must opt in when a command should override typing, editing, or focus-navigation keystrokes.",
    "UIKit — New Features in iOS & iPadOS 15 beta; 55118263",
  ),
]);

appendChanges(["ios"], "beta-1", [
  change(
    "ios-15-beta1-audio-unit-custom-views",
    "Audio Unit custom views",
    "Audio Unit extensions gained host-presentable custom interfaces with configurable tinting.",
    "developerApi",
    "introduced",
    "Hosts can discover and present an Audio Unit's own interface and coordinate its tint with the surrounding application.",
    "Audio Units — New Features in iOS & iPadOS 15 beta; 74183251",
  ),
]);

appendChanges(both, "beta-2", [
  change(
    "apple-15-beta2-storekit-status-listener",
    "StoreKit subscription-status listener",
    "StoreKit began notifying clients when a subscription renewal state changed.",
    "bugFix",
    "fixed",
    "The Beta 2 status listener now receives renewal-state updates that the earlier seed could miss.",
    "App Store — Resolved in iOS & iPadOS 15 beta 2; 78375457",
  ),
  change(
    "apple-15-beta2-facetime-spatial-audio",
    "Group FaceTime spatial audio",
    "Spatial positioning for Group FaceTime audio began correctly when a call started.",
    "bugFix",
    "fixed",
    "Beta 2 corrects the point at which spatial panning activates for a multi-person FaceTime call.",
    "FaceTime — Resolved in iOS & iPadOS 15 beta 2; 78537333",
  ),
  change(
    "apple-15-beta2-facetime-nonroman-contacts",
    "FaceTime calls to non-Roman contact names",
    "FaceTime no longer became unresponsive when a called contact used non-Roman characters.",
    "bugFix",
    "fixed",
    "The call-start failure tied to affected contact-name scripts is marked resolved in Beta 2.",
    "FaceTime — Resolved in iOS & iPadOS 15 beta 2; 78742488",
  ),
  change(
    "apple-15-beta2-focus-location-search",
    "Focus location search",
    "Location lookup while configuring a Focus began returning results.",
    "bugFix",
    "fixed",
    "Beta 2 repairs the location-search path used by location-based Focus configuration.",
    "Focus — Resolved in iOS & iPadOS 15 beta 2; 75850587",
  ),
  change(
    "apple-15-beta2-private-relay-settings",
    "iCloud Private Relay settings",
    "The settings controls for iCloud Private Relay became available.",
    "feature",
    "introduced",
    "Beta 2 exposes the system configuration surface for the prerelease Private Relay service.",
    "iCloud — Resolved in iOS & iPadOS 15 beta 2; 78603429 and 78287769",
  ),
  change(
    "apple-15-beta2-recovery-contact-mixed-systems",
    "Recovery contacts with mixed OS versions",
    "Account Recovery contacts could be configured without first updating every device on the account to the current beta generation.",
    "bugFix",
    "fixed",
    "Beta 2 removes an unnecessary all-devices-updated requirement from Recovery Contact setup.",
    "iCloud — Resolved in iOS & iPadOS 15 beta 2; 78401415",
  ),
  change(
    "apple-15-beta2-private-relay-routing",
    "iCloud Private Relay routing reliability",
    "Private Relay traffic handling was corrected after behaving unexpectedly.",
    "bugFix",
    "fixed",
    "Apple records a general routing correction for the beta service without expanding it into an unsupported product claim.",
    "iCloud — Resolved in iOS & iPadOS 15 beta 2; 78516754",
  ),
  change(
    "apple-15-beta2-record-activity-reset",
    "Record App Activity privacy reset",
    "Resetting Location and Privacy began clearing retained Record App Activity logs.",
    "bugFix",
    "fixed",
    "Beta 2 aligns the privacy reset operation with the new activity-recording store.",
    "Privacy — Resolved in iOS & iPadOS 15 beta 2; 76568242",
  ),
  change(
    "apple-15-beta2-safari-hide-ip-loading",
    "Safari loading with Hide IP Address",
    "Safari could again load affected sites while tracker IP-address hiding was enabled.",
    "bugFix",
    "fixed",
    "The Beta 2 fix restores page loading under the relevant privacy setting.",
    "Safari — Resolved in iOS & iPadOS 15 beta 2; 78529425",
  ),
  change(
    "apple-15-beta2-safari-search-stability",
    "Safari search-bar stability",
    "Tapping Safari's search field no longer caused an unexpected termination.",
    "bugFix",
    "fixed",
    "Beta 2 resolves a crash on entry to the browser's search interface.",
    "Safari — Resolved in iOS & iPadOS 15 beta 2; 78582318",
  ),
  change(
    "apple-15-beta2-shortcuts-drag-drop",
    "Shortcuts editor drag and drop",
    "Drag-and-drop editing in Shortcuts became reliable.",
    "bugFix",
    "fixed",
    "The milestone marks the editor's drag interaction as functioning consistently.",
    "Shortcuts — Resolved in iOS & iPadOS 15 beta 2; 77395180",
  ),
  change(
    "apple-15-beta2-thirdparty-mic-modes",
    "Voice Isolation and Wide Spectrum in third-party apps",
    "Affected third-party apps regained access to the new microphone processing modes.",
    "bugFix",
    "fixed",
    "Beta 2 restores selection of Voice Isolation and Wide Spectrum where the earlier seed could hide those choices.",
    "Third-Party Apps — Resolved in iOS & iPadOS 15 beta 2; 78534920",
  ),
  change(
    "apple-15-beta2-uikit-markdown-styles",
    "Markdown styling in UIKit text views",
    "UIKit text views began rendering bold, italic, code, and strikethrough attributes from Markdown correctly.",
    "bugFix",
    "fixed",
    "The milestone repairs multiple Markdown text styles in UIKit rendering.",
    "UIKit — Resolved in iOS & iPadOS 15 beta 2; 74107883",
  ),
]);

appendChanges(["ios"], "beta-2", [
  change(
    "ios-15-beta2-health-sharing-setup",
    "Health Sharing setup and delivery",
    "Health Sharing invitations, setup, stopping, and person matching received a coordinated set of reliability fixes.",
    "bugFix",
    "fixed",
    "The iOS-only Health surface gained fixes for invitation delivery, setup errors, delayed stop-sharing, missing data, and people with matching first names.",
    "Health — Resolved in iOS & iPadOS 15 beta 2; 74996608, 77030574, 78508260, 77943795, 78007265, and 78520265",
  ),
  change(
    "ios-15-beta2-carplay-controls-announcements",
    "CarPlay route controls and announcements",
    "CarPlay navigation controls and Siri announcement presentation received several interface fixes.",
    "bugFix",
    "fixed",
    "Beta 2 restores missing route buttons and corrects announcement-related Siri and banner behavior in supported vehicles.",
    "CarPlay — Resolved in iOS & iPadOS 15 beta 2; 78223409, 78412579, and 78118849",
  ),
]);

appendChanges(["ipados"], "beta-2", [
  change(
    "ipados-15-beta2-home-screen-widget-layout",
    "iPad Home Screen widget layout",
    "Dragging widgets and arranging the Today overlay no longer produced affected spacing and layout errors on iPad.",
    "bugFix",
    "fixed",
    "Beta 2 corrects an iPadOS widget-placement regression and missing space between small widgets.",
    "Home Screen — Resolved in iOS & iPadOS 15 beta 2; 78461690 and 78476875",
  ),
  change(
    "ipados-15-beta2-keyboard-shortcut-menu",
    "iPad keyboard shortcut menu",
    "The hardware-keyboard shortcut menu began appearing consistently when the Command key was held.",
    "bugFix",
    "fixed",
    "Beta 2 repairs repeated presentation of the iPadOS keyboard shortcut overlay.",
    "Keyboard — Resolved in iOS & iPadOS 15 beta 2; 74902281",
  ),
  change(
    "ipados-15-beta2-quick-note-message-sharing",
    "Quick Note sharing to Messages",
    "Sharing a Quick Note to Messages began showing a usable send control.",
    "bugFix",
    "fixed",
    "The iPad note-sharing sheet receives the missing visible Send action in Beta 2.",
    "Notes — Resolved in iOS & iPadOS 15 beta 2; 75712983",
  ),
  change(
    "ipados-15-beta2-schoolwork-documents",
    "Schoolwork document opening",
    "Schoolwork stopped reporting an error when opening affected documents.",
    "bugFix",
    "fixed",
    "The classroom-oriented iPad app's document-open path is marked resolved in Beta 2.",
    "Schoolwork — Resolved in iOS & iPadOS 15 beta 2; 77528937",
  ),
]);

appendChanges(both, "beta-3", [
  change(
    "apple-15-beta3-storekit-latest-transaction",
    "StoreKit latest-transaction lookup",
    "StoreKit began returning the expected latest transaction for a requested product.",
    "bugFix",
    "fixed",
    "The Beta 3 heading records a correction to product-level latest-transaction queries.",
    "App Store — Resolved in iOS & iPadOS 15 beta 3; 79399941",
  ),
  change(
    "apple-15-beta3-passkeys-simulator",
    "Passkeys in Simulator",
    "Passkey workflows became available in the device simulator.",
    "developerApi",
    "fixed",
    "Beta 3 lifts the earlier simulator limitation for Authentication Services passkey testing.",
    "Authentication Services — Resolved in iOS & iPadOS 15 beta 3; 79358627",
  ),
  change(
    "apple-15-beta3-live-text-camera",
    "Live Text camera availability",
    "The Camera integration for Live Text became available as expected.",
    "bugFix",
    "fixed",
    "The Beta 3 status section marks the earlier Live Text availability issue resolved.",
    "Camera — Resolved in iOS & iPadOS 15 beta 3; 79693579",
  ),
  change(
    "apple-15-beta3-find-my-left-behind",
    "Find My separation alerts for Mac and Apple Watch",
    "Notify When Left Behind expanded to supported Intel-based Macs and Apple Watch.",
    "enhancement",
    "introduced",
    "Beta 3 resolves the earlier device-family exclusion for Find My separation notifications.",
    "Find My — Resolved in iOS & iPadOS 15 beta 3; 79188374",
  ),
  change(
    "apple-15-beta3-pdf-font-rendering",
    "PDF text rendering",
    "Affected PDF documents stopped displaying illegible text.",
    "bugFix",
    "fixed",
    "The font-rendering defect is explicitly marked resolved under the Beta 3 heading.",
    "Fonts — Resolved in iOS & iPadOS 15 beta 3; 79370423",
  ),
  change(
    "apple-15-beta3-thread-accessory-routing",
    "Thread accessory routing",
    "Home accessories stopped falling back to Bluetooth in two affected Thread-network setup scenarios.",
    "bugFix",
    "fixed",
    "Beta 3 corrects Thread transport after initial setup and after creating another home on the same account.",
    "Home — Resolved in iOS & iPadOS 15 beta 3; 78129824 and 79214660",
  ),
  change(
    "apple-15-beta3-widget-gallery-crash",
    "Home Screen widget dragging",
    "Dragging a widget from the gallery no longer terminated the Home Screen.",
    "bugFix",
    "fixed",
    "The widget-gallery crash is retained beneath Apple's exact Beta 3 resolved heading.",
    "Home Screen — Resolved in iOS & iPadOS 15 beta 3; 79360336",
  ),
  change(
    "apple-15-beta3-private-relay-fallback",
    "Private Relay location and fallback handling",
    "Private Relay improved reported-location precision and stopped silently using a direct connection when private routing failed.",
    "bugFix",
    "fixed",
    "Two Beta 3 fixes strengthen the service's location behavior and failure handling.",
    "iCloud — Resolved in iOS & iPadOS 15 beta 3; 77291090 and 78433904",
  ),
  change(
    "apple-15-beta3-record-activity-duplicates",
    "Record App Activity duplicate entries",
    "The privacy activity log stopped writing duplicate records for a single access.",
    "bugFix",
    "fixed",
    "Beta 3 corrects duplicate entries in the exported activity history.",
    "Privacy — Resolved in iOS & iPadOS 15 beta 3; 77168882",
  ),
  change(
    "apple-15-beta3-safari-viewport-height",
    "Safari viewport height units",
    "Browser-interface placement stopped changing the computed viewport height unit.",
    "compatibility",
    "fixed",
    "The Beta 3 WebKit-facing correction stabilizes viewport sizing as Safari's controls move.",
    "Safari — Resolved in iOS & iPadOS 15 beta 3; 79160286",
  ),
  change(
    "apple-15-beta3-low-storage-updates",
    "Software Update with limited storage",
    "System updates could proceed with less than 500 MB of free device storage.",
    "enhancement",
    "introduced",
    "Beta 3 reduces the free-space barrier for updating an enrolled device.",
    "Software Update — Resolved in iOS & iPadOS 15 beta 3; 78474912",
  ),
  change(
    "apple-15-beta3-on-device-translation",
    "On-device translation privacy",
    "System translation stopped sending requests to a server when On-Device Mode was enabled.",
    "bugFix",
    "fixed",
    "The milestone corrects network behavior for users who selected local translation.",
    "Translation — Resolved in iOS & iPadOS 15 beta 3; 75374469",
  ),
  change(
    "apple-15-beta3-shareplay-rejoin-position",
    "SharePlay rejoin position",
    "A participant returning to a SharePlay session resumed at the group's current playback point.",
    "bugFix",
    "fixed",
    "Beta 3 repairs synchronization after leaving and rejoining shared playback.",
    "SharePlay — Resolved in iOS & iPadOS 15 beta 3; 79431429",
  ),
]);

appendChanges(["ios"], "beta-3", [
  change(
    "ios-15-beta3-health-sharing-cap",
    "Health Sharing participant limit",
    "Health Sharing no longer imposed the affected three-person sharing or receiving limit.",
    "bugFix",
    "fixed",
    "The iPhone Health feature's participant ceiling regression is marked resolved in Beta 3.",
    "Health — Resolved in iOS & iPadOS 15 beta 3; 77534149",
  ),
  change(
    "ios-15-beta3-workout-resume",
    "Partially completed workouts",
    "Fitness could resume an unfinished workout without also creating an affected duplicate summary entry.",
    "bugFix",
    "fixed",
    "Beta 3 repairs workout continuation and the related duplicate-record behavior.",
    "Workout — Resolved in iOS & iPadOS 15 beta 3; 80053493",
  ),
]);

appendChanges(["ipados"], "beta-3", [
  change(
    "ipados-15-beta3-pinned-widget-migration",
    "Pinned iPad widget migration",
    "Large pinned favorite widgets migrated correctly from iPadOS 14.",
    "compatibility",
    "fixed",
    "Beta 3 corrects the explicitly iPadOS-scoped migration of pinned Home Screen widgets.",
    "Home Screen — Resolved in iOS & iPadOS 15 beta 3; 78419030",
  ),
]);

appendChanges(both, "beta-4", [
  change(
    "apple-15-beta4-storekit-sandbox-verification",
    "StoreKit sandbox purchase verification",
    "Sandbox purchases stopped being returned as unverified solely because of the beta defect.",
    "bugFix",
    "fixed",
    "The Beta 4 resolved section records corrected verification results in the StoreKit test environment.",
    "App Store — Resolved in iOS & iPadOS 15 beta 4; 79053760",
  ),
  change(
    "apple-15-beta4-storekit-sandbox-renewals",
    "StoreKit sandbox subscription renewals",
    "Automatic subscription renewal updates began reaching StoreKit 2 client applications in the sandbox.",
    "bugFix",
    "fixed",
    "Beta 4 repairs the test environment's delivery of renewal activity to apps.",
    "App Store — Resolved in iOS & iPadOS 15 beta 4; 78463355",
  ),
  change(
    "apple-15-beta4-matter-thirdparty-hubs",
    "Matter pairing with third-party hubs",
    "The API for connecting a Matter accessory to a third-party home hub became available.",
    "developerApi",
    "introduced",
    "The August 4 retained Beta 4 state moves the previously unavailable connection API beneath the exact Beta 4 resolved heading.",
    "Home — Resolved in iOS & iPadOS 15 beta 4; 79729460",
    {
      source: U.beta4Revision,
      verificationMethod:
        "Matched issue 79729460 changing from a generic known issue in the July 27 Beta 4 state to Apple's exact “Resolved in iOS & iPadOS 15 beta 4” heading in the August 4 Beta 4 state; the two snapshots otherwise retain the same 238-record count.",
    },
  ),
  change(
    "apple-15-beta4-private-relay-network-alert",
    "Private Relay network compatibility alert",
    "A temporary connectivity interruption stopped producing a false Private Relay incompatibility warning.",
    "bugFix",
    "fixed",
    "Beta 4 corrects an inaccurate network alert associated with the prerelease privacy service.",
    "iCloud — Resolved in iOS & iPadOS 15 beta 4; 79853379",
  ),
  change(
    "apple-15-beta4-maps-geometry",
    "Maps river and road geometry",
    "Maps corrected rivers disappearing and buildings overlapping roads at selected zoom levels.",
    "bugFix",
    "fixed",
    "Two Beta 4 rendering fixes improve geographic and building placement as map scale changes.",
    "Maps — Resolved in iOS & iPadOS 15 beta 4; 79993916 and 79928870",
  ),
  change(
    "apple-15-beta4-record-activity-retention",
    "Record App Activity after update or restore",
    "Record App Activity no longer reset to disabled after software updates or backup restoration.",
    "bugFix",
    "fixed",
    "Beta 4 preserves the user's activity-recording preference across the affected system transitions.",
    "Privacy — Resolved in iOS & iPadOS 15 beta 4; 77466774",
  ),
  change(
    "apple-15-beta4-safari-tab-close-stability",
    "Safari tab-closing stability",
    "Closing browser tabs stopped causing an affected Safari crash.",
    "bugFix",
    "fixed",
    "The unexpected termination while dismissing tabs is marked resolved in Beta 4.",
    "Safari — Resolved in iOS & iPadOS 15 beta 4; 80327074",
  ),
  change(
    "apple-15-beta4-shareplay-notification-privacy",
    "Notifications during SharePlay screen sharing",
    "Incoming notifications stopped being exposed to other participants while a display was shared.",
    "security",
    "fixed",
    "Beta 4 closes a screen-sharing privacy problem in the prerelease SharePlay experience.",
    "SharePlay — Resolved in iOS & iPadOS 15 beta 4; 79456016",
  ),
  change(
    "apple-15-beta4-swiftui-availability-crash",
    "SwiftUI availability checks on older systems",
    "A SwiftUI API guarded by an availability check stopped crashing on earlier OS versions.",
    "compatibility",
    "fixed",
    "The Beta 4 fix restores the expected safety of runtime availability gating.",
    "SwiftUI — Resolved in iOS & iPadOS 15 beta 4; 79145837",
  ),
]);

appendChanges(["ios"], "beta-4", [
  change(
    "ios-15-beta4-carplay-compass-overlay",
    "CarPlay map-panning controls",
    "The vehicle compass stopped covering the resume control while panning an active navigation map.",
    "bugFix",
    "fixed",
    "Beta 4 repairs the CarPlay control overlap during route guidance.",
    "CarPlay — Resolved in iOS & iPadOS 15 beta 4; 80099526",
  ),
  change(
    "ios-15-beta4-safari-tabbar-scroll",
    "iPhone Safari tab-bar scrolling",
    "Safari's iPhone tab bar began collapsing and expanding correctly during scrolling.",
    "bugFix",
    "fixed",
    "The phone-specific browser control animation is marked resolved in Beta 4.",
    "Safari — Resolved in iOS & iPadOS 15 beta 4; 80410491",
  ),
  change(
    "ios-15-beta4-apple-watch-boot-loop",
    "First-generation Apple Watch pairing",
    "Pairing with a first-generation Apple Watch no longer triggered an iOS boot loop.",
    "bugFix",
    "fixed",
    "Beta 4 resolves the severe restart cycle for the explicitly named paired watch generation.",
    "Watch — Resolved in iOS & iPadOS 15 beta 4; 80023360",
  ),
  change(
    "ios-15-beta4-weather-hungarian",
    "Weather in Hungarian",
    "The Weather app began functioning under the Hungarian system language.",
    "bugFix",
    "fixed",
    "Beta 4 marks the language-specific Weather failure resolved.",
    "Weather — Resolved in iOS & iPadOS 15 beta 4; 80275901",
  ),
]);

appendChanges(["ipados"], "beta-4", [
  change(
    "ipados-15-beta4-widget-gallery-category",
    "iPad widget-gallery categories",
    "Choosing a sidebar category stopped showing the wrong widget group.",
    "bugFix",
    "fixed",
    "The iPad-oriented widget-gallery navigation issue is marked resolved in Beta 4.",
    "Home Screen — Resolved in iOS & iPadOS 15 beta 4; 78882533",
  ),
  change(
    "ipados-15-beta4-safari-search-scroll",
    "Safari search-result scrolling on iPad",
    "Safari search results became scrollable on iPad.",
    "bugFix",
    "fixed",
    "Beta 4 repairs the explicitly iPad-scoped browser results interaction.",
    "Safari — Resolved in iOS & iPadOS 15 beta 4; 80170006",
  ),
]);

appendChanges(both, "beta-5", [
  change(
    "apple-15-beta5-audio-after-restart",
    "Audio playback after restart",
    "Audio began working normally after a device restart without the earlier delay.",
    "bugFix",
    "fixed",
    "The exact Beta 5 resolved heading records the post-restart playback correction.",
    "Audio — Resolved in iOS & iPadOS 15 beta 5; 81064594",
  ),
  change(
    "apple-15-beta5-swiftui-animatable-values",
    "SwiftUI animation conformance behavior",
    "Eligible value types began animating their changes directly through existing arithmetic or vector conformances.",
    "developerApi",
    "changed",
    "Beta 5 simplifies custom animation models and soft-deprecates a redundant protocol path.",
    "SwiftUI — New Features in iOS & iPadOS 15 beta 5; 76971100",
  ),
  change(
    "apple-15-beta5-swiftui-content-shapes",
    "SwiftUI interaction-specific content shapes",
    "SwiftUI gained separate shape control for drag previews, hover effects, context menus, and interaction regions.",
    "developerApi",
    "introduced",
    "Beta 5 permits a view to expose different effective outlines for different interaction types.",
    "SwiftUI — New Features in iOS & iPadOS 15 beta 5; 60792377",
  ),
  change(
    "apple-15-beta5-swiftui-url-handling",
    "SwiftUI URL handling environment",
    "SwiftUI added an environment-level hook for customizing how links and embedded URL actions are opened.",
    "developerApi",
    "introduced",
    "The new Beta 5 value allows URL handling policy to flow through a view hierarchy.",
    "SwiftUI — New Features in iOS & iPadOS 15 beta 5; 78551237",
  ),
  change(
    "apple-15-beta5-swiftui-task-priority",
    "SwiftUI task priority",
    "SwiftUI task creation gained an explicit priority setting.",
    "developerApi",
    "introduced",
    "Beta 5 lets a view-associated asynchronous task request its scheduling priority.",
    "SwiftUI — New Features in iOS & iPadOS 15 beta 5; 80599258",
  ),
  change(
    "apple-15-beta5-swiftui-line-height",
    "SwiftUI oversized-line layout",
    "Text with unusually tall characters received more default space to avoid clipping and overlap.",
    "behavior",
    "changed",
    "The Beta 5 layout adjustment expands affected text views for scripts or glyphs with large line metrics.",
    "SwiftUI — New Features in iOS & iPadOS 15 beta 5; 80665315",
  ),
]);

appendChanges(["ipados"], "beta-5", [
  change(
    "ipados-15-beta5-sidebar-navigation",
    "iPad sidebar navigation destination",
    "A navigation link in an iPad sidebar could push into the sidebar rather than incorrectly targeting the detail column.",
    "bugFix",
    "fixed",
    "The exact Beta 5 feature heading documents corrected column targeting for the explicitly iPad-scoped layout.",
    "SwiftUI — New Features in iOS & iPadOS 15 beta 5; 80919171",
  ),
]);

appendChanges(both, "beta-6", [
  change(
    "apple-15-beta6-storekit-storefront-continuation",
    "StoreKit storefront-change handling",
    "StoreKit 2 added a purchase option controlling whether a transaction continues after the storefront changes.",
    "developerApi",
    "introduced",
    "Beta 6 gives purchase code an explicit continuation policy for a storefront change during checkout.",
    "App Store — New Features in iOS & iPadOS 15 beta 6; 70757789",
  ),
  change(
    "apple-15-beta6-storekit-verification-details",
    "StoreKit verification details",
    "StoreKit signed-value verification gained structured failure reasons and direct access to payload data.",
    "developerApi",
    "introduced",
    "The Beta 6 API surface exposes why a value failed verification and makes its signed or decoded payload easier to inspect.",
    "App Store — New Features in iOS & iPadOS 15 beta 6; 80701792",
  ),
  change(
    "apple-15-beta6-storekit-value-types",
    "StoreKit protocol value semantics",
    "The relevant StoreKit 2 conforming models became value types.",
    "developerApi",
    "changed",
    "Beta 6 records a semantic model change for the affected StoreKit protocol conformances.",
    "App Store — Resolved in iOS & iPadOS 15 beta 6; 80982924",
  ),
  change(
    "apple-15-beta6-swiftui-safe-area",
    "SwiftUI safe-area handling",
    "An affected SwiftUI presentation path began respecting safe-area insets.",
    "bugFix",
    "fixed",
    "The exact Beta 6 resolved heading records restored safe-area layout behavior.",
    "SwiftUI — Resolved in iOS & iPadOS 15 beta 6; 78833004",
  ),
]);

appendChanges(["ios"], "beta-6", [
  change(
    "ios-15-beta6-safari-address-bar-choice",
    "Safari bottom tab bar and address-bar choice",
    "Safari redesigned its phone tab bar below page content and added a setting for returning the address bar to the top.",
    "feature",
    "changed",
    "The Beta 6 heading records a substantial iPhone browser-interface revision and a user-selectable alternative layout.",
    "Safari — New Features in iOS & iPadOS 15 beta 6; 81118141",
  ),
]);

appendChanges(both, "beta-7", [
  change(
    "apple-15-beta7-private-relay-public-beta",
    "iCloud Private Relay public-beta posture",
    "Apple changed iCloud Private Relay to a public-beta service while gathering compatibility feedback.",
    "behavior",
    "changed",
    "The Beta 7 heading explicitly records the service's prerelease availability posture rather than a completed launch.",
    "iCloud — New Features in iOS & iPadOS 15 beta 7; 82150385",
  ),
  change(
    "apple-15-beta7-focus-siri-switching",
    "Switching Focus with Siri",
    "Siri could switch to Focus modes other than Do Not Disturb.",
    "bugFix",
    "fixed",
    "Beta 7 resolves the voice-control limitation for selecting another configured Focus.",
    "Focus — Resolved in iOS & iPadOS 15 beta 7; 78263540",
  ),
  change(
    "apple-15-beta7-maps-bay-bridge-scale",
    "Bay Bridge map scaling",
    "The Bay Bridge stopped rendering at an incorrect scale when Maps was highly zoomed.",
    "bugFix",
    "fixed",
    "The geographic rendering issue is explicitly retained beneath the Beta 7 resolved heading.",
    "Maps — Resolved in iOS & iPadOS 15 beta 7; 79217316",
  ),
  change(
    "apple-15-beta7-vpn-legacy-private-api",
    "Affected VPN app connectivity",
    "VPN apps using a removed private interface could connect again.",
    "compatibility",
    "fixed",
    "Beta 7 records a compatibility correction for existing VPN apps; it does not endorse continued private-API use.",
    "Third-Party Apps — Resolved in iOS & iPadOS 15 beta 7; 79164225",
  ),
]);

appendChanges(["ios"], "beta-7", [
  change(
    "ios-15-beta7-3g-conference-calls",
    "Adding callers over 3G",
    "Phone calls on a 3G connection could add more participants.",
    "bugFix",
    "fixed",
    "The iPhone telephony limitation is marked resolved under the exact Beta 7 heading.",
    "Phone — Resolved in iOS & iPadOS 15 beta 7; 81584102",
  ),
  change(
    "ios-15-beta7-safari-clear-button",
    "Safari search clear button",
    "The clear control in Safari's search field stopped being clipped on iPhone.",
    "bugFix",
    "fixed",
    "Beta 7 repairs the explicitly iOS-scoped browser control layout.",
    "Safari — Resolved in iOS & iPadOS 15 beta 7; 80132991",
  ),
]);

appendChanges(["ipados"], "beta-7", [
  change(
    "ipados-15-beta7-files-new-window",
    "Files Open in New Window stability",
    "Opening a file in a separate window stopped terminating the Files app.",
    "bugFix",
    "fixed",
    "The multiwindow Files failure is assigned to iPadOS and retained beneath Apple's exact Beta 7 resolved heading.",
    "Files — Resolved in iOS & iPadOS 15 beta 7; 79449679",
  ),
  change(
    "ipados-15-beta7-keyboard-shortcut-bar",
    "Hardware-keyboard shortcut-bar edges",
    "Collapsing the hardware-keyboard shortcut strip began reporting its leading and trailing edge changes correctly.",
    "bugFix",
    "fixed",
    "The iPad keyboard interaction is marked resolved under the exact Beta 7 heading.",
    "UIKit — Resolved in iOS & iPadOS 15 beta 7; 74440016",
  ),
]);

appendChanges(both, "beta-8", [
  change(
    "apple-15-beta8-custom-domain-short-addresses",
    "Short iCloud custom-domain addresses",
    "iCloud Custom Email Domain accepted addresses shorter than three characters.",
    "bugFix",
    "fixed",
    "The first exact Beta 8 resolution expands address handling for the prerelease custom-domain feature.",
    "iCloud — Resolved in iOS & iPadOS 15 beta 8; 82419759",
  ),
  change(
    "apple-15-beta8-custom-domain-mail-visibility",
    "Custom-domain address visibility",
    "Configured iCloud custom-domain addresses appeared in both Mail and iCloud webmail.",
    "bugFix",
    "fixed",
    "Beta 8 resolves missing presentation of the configured addresses across Apple's mail clients.",
    "iCloud — Resolved in iOS & iPadOS 15 beta 8; 82395318",
  ),
]);

const platformMetadata = {
  ios: {
    name: "iOS",
    versionId: "version-ios-15-0",
  },
  ipados: {
    name: "iPadOS",
    versionId: "version-ipados-15-0",
  },
};

const routeMetadata = {
  "beta-1": {
    label: "Beta 1",
    capturedTitle: "iOS & iPadOS 15 Beta Release Notes",
    state: "146-record initial state",
    comparison:
      "This is a representative baseline rather than an exhaustive conversion of all 146 retained records.",
  },
  "beta-2": {
    label: "Beta 2",
    capturedTitle: "iOS & iPadOS 15 Beta 2 Release Notes",
    state: "195-record Beta 2 state",
    comparison:
      "Against the first state, the parser found 53 additions, 5 removals, and 84 changed issue records; every selected item also sits beneath an exact Beta 2 heading.",
  },
  "beta-3": {
    label: "Beta 3",
    capturedTitle: "iOS & iPadOS 15 Beta 4 Release Notes",
    state: "238-record Beta 4 state",
    comparison:
      "The retained Beta 2-to-Beta 4 interval crosses Beta 3 and Beta 4, so no broad diff is assigned here; only records under exact Beta 3 status headings are selected.",
  },
  "beta-4": {
    label: "Beta 4",
    capturedTitle: "iOS & iPadOS 15 Beta 4 Release Notes",
    state: "238-record August 4 Beta 4 state",
    comparison:
      "The two retained Beta 4 payloads have the same record count and differ in three issue records; all selections are explicitly labeled Beta 4.",
  },
  "beta-5": {
    label: "Beta 5",
    capturedTitle: "iOS & iPadOS 15 Beta 6 Release Notes",
    state: "242-record Beta 6 state",
    comparison:
      "The retained Beta 4-to-Beta 6 interval crosses Beta 5 and Beta 6, so this route uses only records beneath exact Beta 5 status headings.",
  },
  "beta-6": {
    label: "Beta 6",
    capturedTitle: "iOS & iPadOS 15 Beta 6 Release Notes",
    state: "242-record Beta 6 state",
    comparison:
      "This route selects only issue records that Apple's preserved document explicitly labels as new or resolved in Beta 6.",
  },
  "beta-7": {
    label: "Beta 7",
    capturedTitle: "iOS & iPadOS 15 Beta 8 Release Notes",
    state: "250-record Beta 8 state",
    comparison:
      "The retained Beta 6-to-Beta 8 interval crosses Beta 7 and Beta 8, so this route uses only records beneath exact Beta 7 status headings.",
  },
  "beta-8": {
    label: "Beta 8",
    capturedTitle: "iOS & iPadOS 15 Beta 8 Release Notes",
    state: "250-record Beta 8 state",
    comparison:
      "Only the two records beneath Apple's exact Beta 8 resolved heading are selected; generic known issues are not attributed to this milestone.",
  },
};

function eventArticle(platform, alias, changes) {
  const route = routeMetadata[alias];
  const comparisonCitations = comparisonForAlias[alias].map((url, index) =>
    c(
      url,
      `${index === 0 && alias !== "beta-1" ? "Earlier" : "Retained"} comparison state for ${route.label}`,
    ),
  );
  const changeCitations = uniqueCitations(
    changes.flatMap((item) => item.citations),
  );
  const platformBoundary =
    platform.name === "iOS"
      ? "Items expressly limited to iPad, iPadOS, multiwindow iPad behavior, or iPad hardware-keyboard interfaces are excluded. Shared framework behavior and explicitly iPhone or iOS changes are retained."
      : "Items expressly limited to iPhone, Phone, CarPlay, Health, Workout, or iOS-only browser behavior are excluded. Shared framework behavior and explicitly iPad or iPadOS changes are retained.";
  return article(
    heading("Preserved release-note evidence"),
    prose(
      `The reader-facing archive identifies the retained source document as “${route.capturedTitle}.” This ${platform.name} overlay selects ${changes.length} substantive records from the ${route.state}.`,
      [
        c(
          sourceForAlias[alias],
          `${route.label} archived document and exact beta-named status headings`,
        ),
      ],
    ),
    heading("How this milestone is isolated"),
    prose(
      `${route.comparison} A later cumulative snapshot is used only when its section heading names this exact beta.`,
      comparisonCitations,
    ),
    heading("Platform scope"),
    prose(platformBoundary, changeCitations),
    heading("Editorial boundary"),
    prose(
      "The page uses original synthesis and issue-ID locators. It does not reproduce Apple's list prose, infer a build number, project generic cumulative notes into a beta, or treat TestFlight and release identity as user-facing changes. Apple's beta guidance describes these seeds as prerelease software.",
      [
        c(
          U.installBeta,
          "Beta software, release notes, backups, and Feedback Assistant",
        ),
        c(
          sourceForAlias[alias],
          `${route.label} exact heading and evidence boundary`,
        ),
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
        summary: `${platform.name} 15 ${route.label} is represented by ${changes.length} source-supported changes selected from Apple's preserved ${route.state}; no build number, generic cumulative issue, or unsupported milestone payload is inferred.`,
        article: eventArticle(platform, alias, changes),
        citations: uniqueCitations([
          ...comparisonForAlias[alias].map((url) =>
            c(url, `${route.label} archived evidence comparison`),
          ),
          ...changes.flatMap((item) => item.citations),
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
    majorVersion: 15,
    version: "15.0",
    releaseStatus: "released",
    publicReleaseDate: "2021-09-20",
    milestones: [
      ["Beta 1", "2021-06-07", false, undefined],
      ["Beta 2", "2021-06-24", false, undefined],
      ["Beta 2 Update", "2021-06-30", true, "Build 19A5281j"],
      ["Public Beta 1", "2021-06-30", false, "Build 19A5281j"],
      ["Beta 3", "2021-07-14", false, undefined],
      ["Beta 4", "2021-07-27", false, undefined],
      ["Beta 5", "2021-08-10", false, undefined],
      ["Beta 6", "2021-08-17", false, undefined],
      ["Beta 7", "2021-08-25", false, undefined],
      ["Beta 8", "2021-08-31", false, undefined],
      ["RC", "2021-09-14", false, undefined],
      ["Public", "2021-09-20", false, undefined],
    ],
  },
  {
    platform: "iPadOS",
    majorVersion: 15,
    version: "15.0",
    releaseStatus: "released",
    publicReleaseDate: "2021-09-20",
    milestones: [
      ["Beta 1", "2021-06-07", false, undefined],
      ["Beta 2", "2021-06-24", false, undefined],
      ["Beta 2 Update", "2021-06-30", true, "Build 19A5281j"],
      ["Public Beta 1", "2021-06-30", false, "Build 19A5281j"],
      ["Beta 3", "2021-07-14", false, undefined],
      ["Beta 4", "2021-07-27", false, undefined],
      ["Beta 5", "2021-08-10", false, undefined],
      ["Beta 6", "2021-08-17", false, undefined],
      ["Beta 7", "2021-08-25", false, undefined],
      ["Beta 8", "2021-08-31", false, undefined],
      ["RC", "2021-09-14", false, undefined],
      ["Public", "2021-09-20", false, undefined],
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
      version.version === "15.0" &&
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
    "The exact local iOS/iPadOS 15.0 seed inventory changed; re-audit the cohort before regenerating.",
  );
}

const expectedRoutes = new Set(
  ["version-ios-15-0", "version-ipados-15-0"].flatMap((versionId) =>
    Object.keys(routeMetadata).map((alias) => `${versionId}/${alias}`),
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
  events.length !== 16 ||
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
        (item) =>
          /seed-identity|testflight|build-identity/i.test(item.key) ||
          !item.citations[0]?.locator,
      ),
  )
) {
  throw new Error(
    "The expected iOS/iPadOS 15 prerelease bundle closure failed.",
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
      `iOS/iPadOS 15 change definition drifted for ${occurrence.key}.`,
    );
  }
  localChangeDefinitions.set(occurrence.key, definition);
}
const uniqueLocalChangeKeys = [...localChangeDefinitions.keys()];

const invalidHeadingChanges = events
  .flatMap((event) =>
    event.changes.map((item) => ({
      alias: event.target.routeAlias,
      key: item.key,
      locator: item.citations[0]?.locator || "",
      verificationMethod: item.verificationMethod || "",
    })),
  )
  .filter(({ alias, locator, verificationMethod }) => {
    const exactHeading = exactHeadingForAlias[alias];
    return (
      !locator.includes(exactHeading) ||
      !verificationMethod.includes(exactHeading)
    );
  });
if (invalidHeadingChanges.length > 0) {
  throw new Error(
    `Every occurrence must name its exact beta heading in both locator and verification: ${invalidHeadingChanges
      .map((item) => item.key)
      .join(", ")}`,
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
      if (!otherChangeKeys.has(item.key)) {
        otherChangeKeys.set(item.key, file);
      }
    }
  }
}
const collisions = uniqueLocalChangeKeys.filter((key) =>
  otherChangeKeys.has(key),
);
if (collisions.length > 0) {
  throw new Error(
    `iOS/iPadOS 15 prerelease change keys collide with existing content: ${collisions
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
const renderRows = events
  .map((event) => {
    const platform = event.target.releaseVersionId.includes("ipados")
      ? "ipados"
      : "ios";
    return `| \`/apple/${platform}/15.0/${event.target.routeAlias}/\` | 200 | yes | yes | yes | yes |`;
  })
  .join("\n");
const sourceLedger = sources
  .map(
    (source) =>
      `- [${source.title}](${source.url}) — ${source.publisher}; ${source.sourceClass}.`,
  )
  .join("\n");

const md = `# Apple iOS and iPadOS 15 prerelease archive batch

## Result

\`${outputName}\` publishes source-backed archival articles for sixteen existing
iOS and iPadOS 15.0 prerelease routes: Beta 1 through Beta 8 on each platform.

- ${events.length} substantive event overlays and no release-version overlays
- ${changeCount} change occurrences across ${uniqueLocalChangeKeys.length}
  stable, collision-checked definitions
- ${sources.length} declared and used sources with ${citationCount} citation
  references
- no build records, build-number claims, route creation, public-route changes,
  TestFlight changes, or administrative identity changes
- every event is \`editoriallyVerified\`, \`approved\`, and
  \`isIndexable: true\`, with review timestamp \`${reviewedAt}\`

## Published route closure

| Platform | Milestone | Existing alias | Selected changes |
| -------- | --------- | -------------- | ---------------: |
${routeRows}

The local seed contains 24 iOS/iPadOS 15.0 milestones. This batch publishes the
sixteen developer-beta routes above. Beta 2 Update, Public Beta 1, RC, and
Public remain outside this archive pass.

## Archive method

1. Reader-facing citations point to preserved Apple Developer documentation,
   never to raw DocC JSON.
2. Raw DocC states were parsed by component, status heading, issue ID, and
   normalized text. Every later-beta occurrence must sit beneath a heading that
   explicitly names that beta. Generic Known Issues, generic Deprecations, and
   broad cumulative additions are excluded.
3. Beta 1 is intentionally representative. Its selected items are present
   beneath the initial beta heading in the first 146-record state, but this
   batch does not imply that the selection exhausts the initial notes.
4. The preserved states skip some adjacent releases. Where an interval crosses
   two milestones, the diff is audit context only; exact beta-named headings,
   not the crossed-gap comparison, provide the occurrence-level attribution.
5. The shared Apple document is not treated as blanket cross-platform proof.
   Records expressly naming iPhone, iPad, Phone, CarPlay, Health, Workout,
   multiwindow, or hardware-keyboard behavior are scoped to the supported
   route.
6. All published wording is original synthesis. Necessary platform, framework,
   API, and feature names are nominative references; no Apple list text,
   screenshot, or marketing paragraph is reproduced.

## Selected findings

### Beta 1 representative baseline

The shared baseline covers StoreKit 2, Create ML, Foundation grammar and
formatting, JSON5, Swift signposting, request-language fallback, Record App
Activity, SKAdNetwork, attributed strings, asynchronous notifications,
Markdown in SwiftUI, animation threading, TabularData, and UIKit keyboard
behavior. The iOS route also retains Apple's iOS-scoped Audio Unit interface.

### Beta 2 exact-heading selection

The shared Beta 2 set covers StoreKit renewal status, FaceTime, Focus, iCloud
Private Relay and account recovery, Record App Activity, Safari, Shortcuts,
third-party microphone modes, and UIKit Markdown. iOS adds Health Sharing and
CarPlay fixes. iPadOS adds widget layout, keyboard shortcuts, Quick Note
sharing, and Schoolwork.

### Beta 3 and Beta 4 retained headings

Beta 3 includes StoreKit, passkey simulation, Live Text, Find My, PDF text,
Thread accessories, widgets, Private Relay, privacy logs, Safari viewport
units, low-storage updates, translation privacy, and SharePlay. Platform-only
items cover Health and Workout on iOS and pinned-widget migration on iPadOS.

Beta 4 includes StoreKit sandbox repairs, Matter hub support, Private Relay,
Maps, Record App Activity, Safari, SharePlay privacy, and SwiftUI
compatibility. CarPlay, Weather, the phone Safari tab bar, and paired-watch
stability stay on iOS; widget-gallery and Safari scrolling fixes stay on
iPadOS.

### Beta 5 through Beta 8 retained headings

The later headings cover SwiftUI animation, interaction shapes, URL handling,
tasks, text layout, and iPad sidebar behavior in Beta 5; StoreKit, SwiftUI
safe-area behavior, and the phone Safari layout in Beta 6; Private Relay,
Focus, Maps, VPN compatibility, telephony, Safari, Files, and keyboard fixes
in Beta 7; and two Custom Email Domain repairs in Beta 8.

## Raw snapshot audit ledger

Raw transports are research provenance only:

| State | Raw capture | CDX digest | CDX length | Records | Decoded SHA-256 | Public citation |
| ----- | ----------- | ---------- | ---------: | ------: | -------------- | --------------- |
| Beta 1 | \`20210612230308\` | \`NJIVSFUOZQ6RAKNHIO4OUOBF23F4BFAH\` | 26,798 | 146 | \`94496d23c566c468bbab4624a37be27bf710bdfd04c5aa97883bffc591a08096\` | [Apple page](${U.beta1}) |
| Beta 2 title state | \`20210714160642\` | \`OPVEDTDAGLQJHVEFWUVDBAAXWANO5QOG\` | 32,317 | 195 | \`5c1b9a202a192c70e40ae6a471f2e95c48bcc78bc45cde2f7512a2e0502e2a1f\` | [Apple page](${U.beta2}) |
| Beta 4 | \`20210727223431\` | \`CUJ73NSJCGFMETJGS6LAISCZUQOL2V6Z\` | 36,745 | 238 | \`09d9c17c4172e5f7453acc9e1b54853b1e68cd4c97a7f68382d5903d8cbed996\` | [Apple page](${U.beta4}) |
| Beta 4 August state | \`20210804024502\` | \`OPXP4T4KXYRV2PMID6ZR6SLHKN5UJ7NE\` | 37,023 | 238 | \`dbea5b7c11d4f9ee343f6f52c2c5351400d0fef580f088519fa605893e18fd3d\` | [Apple page](${U.beta4Revision}) |
| Beta 6 | \`20210822111415\` | \`JZDQLWEYSX5P3W7EG7D42SCOPF7B4DOW\` | 39,261 | 242 | \`ccc83c4a2b258099a23191df7ad111cf5ee1b59d265abc067bff145d362fe763\` | [Apple page](${U.beta6}) |
| Beta 8 title state | \`20210914131936\` | \`3QM3GXF26ONGBBJZDMFJHL2E6QVQ4WHL\` | 39,439 | 250 | \`0a78a9f0af9c7052197093bb9097efa747ec7bd453192680315e831900d37af7\` | [Apple page](${U.beta8}) |

Exact parsed comparisons:

- Beta 1 to the retained Beta 2 title state: 53 additions, 5 removals, and 84
  changed issue records.
- Beta 2 title state to Beta 4: 46 additions, 3 removals, and 73 changed issue
  records. This interval crosses Beta 3 and Beta 4 and is not used as a broad
  milestone delta.
- July 27 Beta 4 to August 4 Beta 4: zero additions, zero removals, and 3
  changed issue records. Issue \`79729460\` moves beneath the exact Beta 4
  resolved heading.
- August 4 Beta 4 to Beta 6: 18 additions, 14 removals, and 9 changed issue
  records. This interval crosses Beta 5 and Beta 6.
- Beta 6 to the retained Beta 8 title state: 8 additions, zero removals, and 11
  changed issue records. This interval crosses Beta 7 and Beta 8.

## Exact evidence gaps

- The June 30 Beta 2 Update and Public Beta 1 seed routes share a seed build
  annotation, but no retained Apple note state isolates either route. Neither
  receives an overlay, and the annotation is not promoted into a build record.
- The July 14 raw capture still identifies itself as Beta 2 even though its
  capture date matches the local Beta 3 date. Beta 2 attribution relies on its
  exact Beta 2 status headings, not on the capture date.
- No retained state identifies itself as RC. The September 14 raw capture
  still carries the Beta 8 title, so it is not projected onto the RC route.
- No complete independently retained first-party build set was found. This
  batch creates no build records and makes no build-number claims.
- The existing Public routes are already owned by the approved
  \`apple-ios-ipados-15.json\` batch and are not modified.
- Generic Known Issues, unqualified Deprecations, and the explicitly
  TestFlight-related Beta 6 item are ledger-only even when retained in a raw
  state.

## Source ledger

All declared sources were accessed on ${accessedAt}.

${sourceLedger}

## Closure guards

- Exact comparison against both local 15.0 seed records and all 24 milestones
- Exact sixteen-route allowlist with explicit exclusion of Beta 2 Update,
  Public Beta 1, RC, and Public
- Exact beta-named heading required in every occurrence locator and
  verification method
- Zero versions and zero builds
- Collision scan across every other research-batch JSON plus
  \`apple-launch-content-2026.json\`
- ${changeCount} occurrences resolve to exactly ${uniqueLocalChangeKeys.length}
  stable local definitions
- Explicit rejection of identity, build, and TestFlight administrative change
  keys
- Complete unique source declaration/use closure
- Deterministic formatted JSON SHA-256: \`${jsonSha}\`

## Publication and validation record

The generator's seed, route, collision, review-state, exact-heading, and
citation guards pass before either artifact is written.

Independent editorial and evidence review:

- all six archived payloads were independently replayed; their document titles,
  record counts, decoded SHA-256 values, and all five adjacent comparisons
  matched this ledger exactly
- all ${changeCount} occurrence checks and 170 issue-ID references matched the
  exact component and beta-named status heading in the six retained raw
  snapshots
- the independent reader-facing copyright scan found a maximum contiguous
  overlap of 7 words between editorial fields and Apple's retained records
- all 16 event articles and all ${changeCount} occurrences were approved at
  \`${reviewedAt}\`

Publication receipt:

- applied production plan:
  \`3d5260bf9e826a65f2f6d8d6676f246de83eba2c99ed22fbce2d16e9824fa751\`
- reviewed plan artifact SHA-256:
  \`ebafd98b855897bb8b2e5766cbdd1169af6d6ef2589267ae658e55ae2b7c6f5a\`
- rollback artifact SHA-256:
  \`f5b5b87011ab454c19fd574df15447f131572b0b5382a7879d47353406f31c60\`
- Sanity transaction: \`tt1fSB5HY9GAB0YLyyR0TM\`
- receipt SHA-256:
  \`5024dec35275e9248a4c8b7db557d8f5bf452c3ff3e647fba2270471474b19b6\`
- immediate post-publication zero plan:
  \`fc031038072cac58608247df7968c28e5e92f726082731c8719241ad2e58f2d5\`;
  zero mutations, 2,177 unchanged documents, and a 16-byte mutation payload
- zero-plan artifact SHA-256:
  \`14576b5cfc77f5a1b60d6456dc71690b4b4312ed6541d9f5b34d44d18dfad2bd\`

Production coverage after publication:

- 410 of 410 release versions have full version-level coverage
- 1,979 appearances: 361 full articles, 256 source-linked records, and 1,362
  timeline-only records
- 512 appearances have approved structured changes

## Settled canonical route verification

Every published route was fetched independently from the running local site.
Each response returned the full archival article, the “Preserved release-note
evidence” section, References, and \`index, follow\`; none returned a timeline
placeholder or \`noindex\`.

| Canonical route | HTTP | Full article | Evidence | References | Index |
| --------------- | ---: | ------------ | -------- | ---------- | ----- |
${renderRows}

Final verification on ${accessedAt}:

- \`npm run research:validate\`: 51 batches validated; this batch reports 16
  events, ${changeCount} change occurrences, ${sources.length} sources, and
  ${citationCount} citation references; 2,721 change keys remain globally
  consistent
- focused ingestion/manifest suite: 19 tests passed
- ESLint, Prettier check, and focused \`git diff --check\`: passed
- deterministic regeneration: SHA-256 remained \`${jsonSha}\`
- final production dry run reproduced zero mutations, 2,177 unchanged
  documents, the 16-byte payload, and plan SHA
  \`fc031038072cac58608247df7968c28e5e92f726082731c8719241ad2e58f2d5\`
- the final planner reported “No Sanity data changed”

Reproduce with:

\`\`\`sh
node scripts/research-batches/build-apple-ios-ipados-15-prerelease.mjs
npm run research:validate
node --import tsx --test tests/launch-content-ingestion.test.ts tests/launch-content-manifest.test.ts
npx eslint scripts/research-batches/build-apple-ios-ipados-15-prerelease.mjs
npx prettier --check scripts/research-batches/build-apple-ios-ipados-15-prerelease.mjs scripts/research-batches/apple-ios-ipados-15-prerelease.json scripts/research-batches/apple-ios-ipados-15-prerelease.md
npx sanity exec scripts/ingest-launch-content.ts --with-user-token -- --content scripts/research-batches/apple-ios-ipados-15-prerelease.json
\`\`\`

The final command is intentionally a post-publication dry run and must
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
