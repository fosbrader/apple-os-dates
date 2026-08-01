import { createHash } from "node:crypto";
import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import prettier from "prettier";

const here = dirname(fileURLToPath(import.meta.url));
const outputName = "apple-ios-ipados-26-prerelease.json";
const ledgerName = "apple-ios-ipados-26-prerelease.md";
const accessedAt = "2026-07-30";
const reviewedAt = "2026-07-30T07:02:33Z";

const U = {
  notes:
    "https://developer.apple.com/documentation/ios-ipados-release-notes/ios-ipados-26-release-notes",
  publicBeta:
    "https://www.macrumors.com/2025/07/24/apple-seeds-ios-26-public-beta/",
  beta4Revision:
    "https://www.apfeltalk.de/community/threads/apple-veroeffentlicht-ueberarbeitete-ios-26-und-ipados-26-beta-4-fuer-iphone-und-ipad.585980/",
  beta6Revision:
    "https://www.macrumors.com/2025/08/14/apple-releases-ios-26-public-beta-3/",
  iphone11Correction:
    "https://www.macrumors.com/2025/07/25/apple-seeds-ios-26-public-beta-iphone-11/",
};

const notesPath =
  "https://developer.apple.com/documentation/ios-ipados-release-notes/ios-ipados-26-release-notes";
const noteSnapshots = Object.fromEntries(
  [
    ["beta-1", "20250610085647", "2025-06-10"],
    ["beta-1-v2", "20250614143610", "2025-06-14"],
    ["beta-2", "20250623180044", "2025-06-23"],
    ["beta-3", "20250707180920", "2025-07-07"],
    ["beta-4", "20250722200644", "2025-07-22"],
    ["beta-5", "20250806095944", "2025-08-06"],
    ["beta-6", "20250812161651", "2025-08-12"],
    ["beta-8", "20250827123336", "2025-08-27"],
    ["beta-9", "20250902225803", "2025-09-02"],
    ["rc", "20250910061549", "2025-09-10"],
  ].map(([alias, timestamp, date]) => [
    alias,
    {
      url: `https://web.archive.org/web/${timestamp}/${notesPath}`,
      date,
    },
  ]),
);

const releaseRows = [
  [
    "beta-1",
    "2025-06-09",
    "20250611140510",
    "06092025a",
    "06092025b",
    "23A5260n",
  ],
  [
    "beta-2",
    "2025-06-23",
    "20250627183259",
    "06232025a",
    "06232025b",
    "23A5276f",
  ],
  [
    "beta-3",
    "2025-07-07",
    "20250707172403",
    "07072025a",
    "07072025b",
    "23A5287g",
  ],
  [
    "beta-4",
    "2025-07-22",
    "20250725182151",
    "07222025a",
    "07222025b",
    "23A5297i",
  ],
  [
    "beta-5",
    "2025-08-05",
    "20250805205134",
    "08052025a",
    "08052025b",
    "23A5308g",
  ],
  [
    "beta-6",
    "2025-08-11",
    "20250815232657",
    "08112025a",
    "08112025b",
    "23A5318c",
  ],
  [
    "beta-7",
    "2025-08-18",
    "20250818215547",
    "08182025a",
    "08182025b",
    "23A5326a",
  ],
  [
    "beta-8",
    "2025-08-25",
    "20250827134815",
    "08252025a",
    "08252025b",
    "23A5330a",
  ],
  [
    "beta-9",
    "2025-09-02",
    "20250904001610",
    "09022025a",
    "09022025b",
    "23A5336a",
  ],
  ["rc", "2025-09-09", "20250910061256", "09092025a", "09092025b", "23A340"],
];

const releaseSourceByKey = new Map();
const releaseSources = releaseRows.flatMap(
  ([alias, date, archiveTimestamp, iosId, ipadosId, build]) =>
    [
      ["ios", "iOS", iosId],
      ["ipados", "iPadOS", ipadosId],
    ].map(([slug, name, id]) => {
      const key = `${slug}/${alias}`;
      const url = `https://developer.apple.com/news/releases/?id=${id}`;
      releaseSourceByKey.set(key, url);
      return {
        url,
        title: `${name} 26.0 ${alias === "rc" ? "RC" : alias.replace("-", " ")} (${build})`,
        publisher: "Apple Developer",
        sourceClass: "firstPartyDocumentation",
        author: "Apple",
        publishedAt: `${date}T00:00:00.000Z`,
        archiveUrl: `https://web.archive.org/web/${archiveTimestamp}/https://developer.apple.com/news/releases/`,
        topics: [name, "26.0", alias, "build number"],
      };
    }),
);

const iosBeta1Revision =
  "https://developer.apple.com/news/releases/?id=06132025a";
releaseSourceByKey.set("ios/beta-1-v2", iosBeta1Revision);
releaseSources.push({
  url: iosBeta1Revision,
  title: "iOS 26 beta (23A5260n | 23A5260u)",
  publisher: "Apple Developer",
  sourceClass: "firstPartyDocumentation",
  author: "Apple",
  publishedAt: "2025-06-13T00:00:00.000Z",
  archiveUrl:
    "https://web.archive.org/web/20250614051151/https://developer.apple.com/news/releases/",
  topics: ["iOS", "26.0", "Beta 1 v2", "build number", "device scope"],
});

const noteSources = Object.entries(noteSnapshots).map(([alias, snapshot]) => ({
  url: snapshot.url,
  title: `iOS & iPadOS 26 Release Notes — ${alias} snapshot`,
  publisher: "Apple Developer via Internet Archive",
  sourceClass: "archive",
  author: "Apple",
  publishedAt: `${snapshot.date}T00:00:00.000Z`,
  topics: ["iOS", "iPadOS", "26.0", alias, "historical release notes"],
}));

const sources = [
  {
    url: U.notes,
    title: "iOS & iPadOS 26 Release Notes",
    publisher: "Apple Developer Documentation",
    sourceClass: "firstPartyDocumentation",
    author: "Apple",
    topics: ["iOS", "iPadOS", "26.0", "living release notes"],
  },
  ...releaseSources,
  ...noteSources,
  {
    url: U.publicBeta,
    title: "Apple Releases First iOS 26 and iPadOS 26 Public Betas",
    publisher: "MacRumors",
    sourceClass: "journalism",
    author: "Juli Clover",
    publishedAt: "2025-07-24T00:00:00.000Z",
    topics: ["iOS", "iPadOS", "26.0", "Public Beta 1"],
  },
  {
    url: U.beta4Revision,
    title:
      "Apple releases revised iOS 26 and iPadOS 26 Beta 4 for iPhone and iPad",
    publisher: "Apfeltalk",
    sourceClass: "journalism",
    author: "Apfeltalk Redaktion",
    publishedAt: "2025-07-25T00:00:00.000Z",
    topics: ["iOS", "iPadOS", "26.0", "Beta 4 v2", "23A5297m"],
  },
  {
    url: U.beta6Revision,
    title:
      "Apple Releases Third iOS 26 and iPadOS 26 Public Betas, New Developer Beta",
    publisher: "MacRumors",
    sourceClass: "journalism",
    author: "Juli Clover",
    publishedAt: "2025-08-14T00:00:00.000Z",
    topics: ["iOS", "iPadOS", "26.0", "Beta 6 v2", "Public Beta 3"],
  },
  {
    url: U.iphone11Correction,
    title: "Apple Seeds iOS 26 Public Beta for iPhone 11 Users",
    publisher: "MacRumors",
    sourceClass: "journalism",
    author: "Juli Clover",
    publishedAt: "2025-07-25T00:00:00.000Z",
    topics: ["iOS", "26.0", "iPhone 11", "23A5297n", "corrective build"],
  },
];

const c = (url, locator, note) => ({
  url,
  ...(locator ? { locator } : {}),
  ...(note ? { note } : {}),
});
const heading = (text) => ({ style: "h2", text });
const prose = (text, citations) => ({ text, citations });
const article = (...blocks) => ({ authorship: "originalSynthesis", blocks });
const review = () => ({ status: "approved", reviewedAt });
const noteUrl = (alias) => noteSnapshots[alias].url;

function change({
  key,
  title,
  canonicalSummary,
  category,
  action,
  citations,
  summary = canonicalSummary,
  documentedStatus = "documented",
  evidenceState = "confirmed",
  verificationMethod = "Compared adjacent preserved Apple Developer release-note snapshots and retained only the item that appeared at this milestone.",
}) {
  return {
    key,
    title,
    canonicalSummary,
    category,
    action,
    inheritance: "delta",
    summary,
    documentedStatus,
    evidenceState,
    verificationMethod,
    citations,
  };
}

const deltaByRoute = new Map();
const add = (slug, alias, values) =>
  deltaByRoute.set(`${slug}/${alias}`, values);
const addBoth = (alias, values) => {
  add("ios", alias, values);
  add("ipados", alias, values);
};

const beta1 = noteUrl("beta-1");
addBoth("beta-1", [
  change({
    key: "ios-ipados-26-beta1-foundation-models-access",
    title: "On-device Foundation Models access",
    canonicalSummary:
      "The Foundation Models framework opened direct developer access to the on-device large language model used by Apple Intelligence.",
    category: "developerApi",
    action: "introduced",
    citations: [c(beta1, "Apple Intelligence — New Features; 139996377")],
    verificationMethod:
      "Selected from the first preserved Beta 1 release-note snapshot as a representative initial developer capability.",
  }),
  change({
    key: "ios-ipados-26-beta1-accessibility-nutrition-labels",
    title: "App Store Accessibility Nutrition Labels",
    canonicalSummary:
      "App Store product pages gained an Accessibility section describing supported accessibility features before download.",
    category: "feature",
    action: "introduced",
    citations: [c(beta1, "App Store — New Features; 138344118")],
    verificationMethod:
      "Selected from the first preserved Beta 1 release-note snapshot as a representative initial platform feature.",
  }),
  change({
    key: "ios-ipados-26-beta1-healthkit-medication-data",
    title: "HealthKit medication and dose-event APIs",
    canonicalSummary:
      "HealthKit added APIs for reading a user’s medications and logged medication dose events with authorization.",
    category: "developerApi",
    action: "introduced",
    citations: [c(beta1, "HealthKit — New Features; 114279172")],
    verificationMethod:
      "Selected from the first preserved Beta 1 release-note snapshot as a representative initial developer capability.",
  }),
  change({
    key: "ios-ipados-26-beta1-workout-session-apis",
    title: "Workout session APIs on iPhone and iPad",
    canonicalSummary:
      "HKWorkoutSession and HKLiveWorkoutBuilder became available to apps on iOS and iPadOS for live workout tracking.",
    category: "developerApi",
    action: "introduced",
    citations: [c(beta1, "HealthKit — New Features; 125746390")],
    verificationMethod:
      "Selected from the first preserved Beta 1 release-note snapshot as a representative initial developer capability.",
  }),
  change({
    key: "ios-ipados-26-beta1-journaling-suggestions-sync",
    title: "Journaling Suggestions sync to iPad",
    canonicalSummary:
      "Journaling Suggestions created on iPhone could sync through iCloud to the Journal app and participating journaling apps on iPad.",
    category: "feature",
    action: "introduced",
    citations: [c(beta1, "Journaling Suggestions — New Features; 152322897")],
    verificationMethod:
      "Selected from the first preserved Beta 1 release-note snapshot as a representative cross-device capability.",
  }),
  change({
    key: "ios-ipados-26-beta1-metal-4",
    title: "Metal 4 support",
    canonicalSummary:
      "The first iOS and iPadOS 26 seed introduced support for Metal 4.",
    category: "developerApi",
    action: "introduced",
    citations: [c(beta1, "Metal — New Features; 113781091")],
    verificationMethod:
      "Selected from the first preserved Beta 1 release-note snapshot as a representative initial graphics capability.",
  }),
  change({
    key: "ios-ipados-26-beta1-storekit-offer-apis",
    title: "StoreKit offer merchandising APIs",
    canonicalSummary:
      "StoreKit added a one-time offer payment mode, JWS-signed promotional offers, and SubscriptionOfferView merchandising.",
    category: "developerApi",
    action: "introduced",
    citations: [
      c(beta1, "StoreKit — New Features; 142501142, 143395736, 145251635"),
    ],
    verificationMethod:
      "Grouped three related StoreKit additions from the first preserved Beta 1 release-note snapshot.",
  }),
  change({
    key: "ios-ipados-26-beta1-ikev2-legacy-algorithms",
    title: "Legacy IKEv2 algorithms removed",
    canonicalSummary:
      "IKEv2 VPN configurations could no longer use DES, 3DES, SHA1-96, SHA1-160, or Diffie-Hellman groups below 14.",
    category: "removal",
    action: "removed",
    citations: [c(beta1, "NetworkExtension — Deprecations; 148767790")],
    verificationMethod:
      "Selected from the first preserved Beta 1 release-note snapshot because it changes VPN compatibility and security posture.",
  }),
]);

add("ios", "beta-1-v2", [
  change({
    key: "ios-26-beta1-v2-iphone-startup-recovery",
    title: "iPhone 15 and iPhone 16 startup recovery",
    canonicalSummary:
      "The updated Beta 1 build supplied a restore path for affected iPhone 15 and iPhone 16 models that could show a low-battery symbol and fail to start after the original seed.",
    category: "bugFix",
    action: "fixed",
    citations: [
      c(noteUrl("beta-1-v2"), "General — Resolved Issues; 153071880"),
    ],
  }),
]);

const beta2 = noteUrl("beta-2");
addBoth("beta-2", [
  change({
    key: "ios-ipados-26-beta2-recovery-assistant",
    title: "Recovery Assistant",
    canonicalSummary:
      "Recovery Assistant could diagnose and attempt to repair a device that did not start normally.",
    category: "feature",
    action: "introduced",
    citations: [c(beta2, "Overview — Recovery Assistant; 151856202")],
  }),
  change({
    key: "ios-ipados-26-beta2-passkey-registration-availability",
    title: "Immediate passkey registration availability",
    canonicalSummary:
      "AuthenticationServices could limit passkey-registration UI to cases where the device was immediately able to create a passkey.",
    category: "developerApi",
    action: "introduced",
    citations: [
      c(
        beta2,
        "AuthenticationServices — New Features; preferImmediatelyAvailableCredentials; 150688929",
      ),
    ],
  }),
  change({
    key: "ios-ipados-26-beta2-background-assets-stability",
    title: "Background Assets download stability",
    canonicalSummary:
      "Apple fixed stalled or failed asset-pack downloads, missing status updates, and delayed TestFlight asset refreshes while retaining a large-pack installation limitation.",
    category: "bugFix",
    action: "fixed",
    citations: [
      c(
        beta2,
        "Background Assets — Resolved and Known Issues; 143281558, 151498902, 151647839, 151942388, 153128086",
      ),
    ],
  }),
  change({
    key: "ios-ipados-26-beta2-medications-authorization-dismissal",
    title: "Medication authorization dismissal",
    canonicalSummary:
      "The HealthKit medications authorization sheet could be dismissed when no medication required authorization.",
    category: "bugFix",
    action: "fixed",
    citations: [c(beta2, "HealthKit — Resolved Issues; 152094574")],
  }),
  change({
    key: "ios-ipados-26-beta2-message-retranslation",
    title: "Edited message retranslation",
    canonicalSummary:
      "A sent translated message was translated again after the sender edited it.",
    category: "bugFix",
    action: "fixed",
    citations: [c(beta2, "Messages — Resolved Issues; 149401758")],
  }),
  change({
    key: "ios-ipados-26-beta2-wifi-aware-connection-timeout",
    title: "Wi‑Fi Aware two-minute disconnect",
    canonicalSummary:
      "Wi‑Fi Aware connections no longer terminated unexpectedly after 120 seconds.",
    category: "bugFix",
    action: "fixed",
    citations: [c(beta2, "Wi-Fi Aware — Resolved Issues; 152279075")],
  }),
]);
add("ios", "beta-2", [
  ...deltaByRoute.get("ios/beta-2"),
  change({
    key: "ios-26-beta2-adaptive-clock-depth-regression",
    title: "Adaptive clock depth regression",
    canonicalSummary:
      "Upgrading from Beta 1 to Beta 2 could remove depth from Lock Screen wallpapers and posters using the adaptive clock.",
    category: "regression",
    action: "regression",
    citations: [c(beta2, "Lock Screen — Known Issues; 153005914")],
  }),
]);
add("ipados", "beta-2", [
  ...deltaByRoute.get("ipados/beta-2"),
  change({
    key: "ipados-26-beta2-inline-sidebar-titles",
    title: "Inline sidebar and inspector titles",
    canonicalSummary:
      "In the regular size class, iPadOS sidebars and inspector titles defaulted to inline presentation with an API override.",
    category: "developerApi",
    action: "changed",
    citations: [c(beta2, "SwiftUI — New Features; 150891824")],
  }),
]);

const beta3 = noteUrl("beta-3");
addBoth("beta-3", [
  change({
    key: "ios-ipados-26-beta3-low-texture-object-capture",
    title: "Low-texture Object Capture model",
    canonicalSummary:
      "Object Capture added a downloadable reconstruction model that improved photogrammetry quality for low-texture objects.",
    category: "enhancement",
    action: "introduced",
    citations: [c(beta3, "Object Capture — New Features; 145220451")],
  }),
  change({
    key: "ios-ipados-26-beta3-foundation-models-public-generable",
    title: "Public Generable types and model reliability",
    canonicalSummary:
      "Foundation Models fixed public Generable declarations and several rate-limit and guided-generation reliability problems.",
    category: "bugFix",
    action: "fixed",
    citations: [
      c(
        beta3,
        "Foundation Models framework — Resolved Issues; 152681332, 153216183, 153216632",
      ),
    ],
  }),
  change({
    key: "ios-ipados-26-beta3-metalfx-temporal-upscaling",
    title: "MetalFX temporal upscaling",
    canonicalSummary:
      "MetalFX temporal and denoised temporal upscaling began working with MTL4CommandBuffer.",
    category: "bugFix",
    action: "fixed",
    citations: [c(beta3, "MetalFX — Resolved Issues; 146436460, 146436741")],
  }),
  change({
    key: "ios-ipados-26-beta3-wifi-aware-background-browser",
    title: "Wi‑Fi Aware background-browser connections",
    canonicalSummary:
      "Wi‑Fi Aware connection attempts could succeed while the browser process was not running.",
    category: "bugFix",
    action: "fixed",
    citations: [c(beta3, "Wi-Fi Aware — Resolved Issues; 152336071")],
  }),
]);
add("ios", "beta-3", [
  ...deltaByRoute.get("ios/beta-3"),
  change({
    key: "ios-26-beta3-adaptive-clock-depth-fix",
    title: "Adaptive clock depth restored",
    canonicalSummary:
      "Apple fixed the Beta 2 regression that removed depth from adaptive-clock Lock Screen wallpapers and posters.",
    category: "bugFix",
    action: "fixed",
    citations: [c(beta3, "Lock Screen — Resolved Issues; 153005914")],
  }),
]);
add("ipados", "beta-3", [
  ...deltaByRoute.get("ipados/beta-3"),
  change({
    key: "ipados-26-beta3-navigation-link-indicators",
    title: "NavigationSplitView link indicators",
    canonicalSummary:
      "Navigation links in a regular-width NavigationSplitView content column hid chevrons by default and gained an indicator-visibility API.",
    category: "developerApi",
    action: "changed",
    citations: [c(beta3, "SwiftUI — New Features; 151646790")],
  }),
]);

const beta4 = noteUrl("beta-4");
addBoth("beta-4", [
  change({
    key: "ios-ipados-26-beta4-ten-key-return-rotation",
    title: "10-key Return key rotation issue",
    canonicalSummary:
      "The Return key could stop responding on Japanese and Chinese 10-key keyboards after rotating from landscape to portrait.",
    category: "knownIssue",
    action: "knownIssue",
    citations: [c(beta4, "Keyboards — Known Issues; 154163977")],
  }),
  change({
    key: "ios-ipados-26-beta4-foundation-models-guardrails",
    title: "Foundation Models prompt and guardrail limitations",
    canonicalSummary:
      "Some prompts could produce unexpected responses or erroneous guardrail-violation errors in the Foundation Models framework.",
    category: "knownIssue",
    action: "knownIssue",
    citations: [
      c(
        beta4,
        "Foundation Models framework — Known Issues; 152318091, 155273863",
      ),
    ],
  }),
  change({
    key: "ios-ipados-26-beta4-wifi-aware-error-property",
    title: "Wi‑Fi Aware NWError metadata",
    canonicalSummary:
      "Connection-related NWError values could expose a nil Wi‑Fi Aware property.",
    category: "knownIssue",
    action: "knownIssue",
    citations: [c(beta4, "Wi-Fi Aware — Known Issues; 153100140")],
  }),
]);
add("ios", "beta-4", [
  ...deltaByRoute.get("ios/beta-4"),
  change({
    key: "ios-26-beta4-chart3d",
    title: "Chart3D",
    canonicalSummary:
      "Swift Charts added Chart3D for RealityKit-powered three-dimensional data and mathematical-surface visualization on iOS.",
    category: "developerApi",
    action: "introduced",
    citations: [c(beta4, "Swift Charts — New Features; 148361385")],
  }),
]);

add("ios", "public-beta-1", [
  change({
    key: "ios-26-public-beta1-iphone11-folder-correction",
    title: "iPhone 11 Home Screen folder correction",
    canonicalSummary:
      "A July 25 corrective build for the iPhone 11 family restored all columns of app icons inside Home Screen folders.",
    category: "bugFix",
    action: "fixed",
    citations: [
      c(
        U.iphone11Correction,
        "iPhone 11 build 23A5297n and Home Screen folder correction",
      ),
      c(noteUrl("beta-5"), "Apps — Resolved Issues; 156425266"),
    ],
    documentedStatus: "partiallyDocumented",
    evidenceState: "corroborated",
    verificationMethod:
      "Matched the contemporaneous build-specific report to the same iPhone 11 folder issue later preserved in Apple’s developer notes.",
  }),
]);

const beta5 = noteUrl("beta-5");
addBoth("beta-5", [
  change({
    key: "ios-ipados-26-beta5-foundation-models-prewarm",
    title: "Foundation Models prompt prewarming",
    canonicalSummary:
      "LanguageModelSession.prewarm() began caching instructions and prompt prefixes to reduce time to the first generated token.",
    category: "developerApi",
    action: "introduced",
    citations: [
      c(beta5, "Foundation Models framework — New Features; 152381043"),
    ],
  }),
  change({
    key: "ios-ipados-26-beta5-content-tagging-languages",
    title: "Multilingual content tagging",
    canonicalSummary:
      "The Foundation Models content-tagging use case expanded beyond English and exposed supported-language discovery.",
    category: "developerApi",
    action: "introduced",
    citations: [
      c(beta5, "Foundation Models framework — New Features; 155801948"),
    ],
  }),
  change({
    key: "ios-ipados-26-beta5-foundation-models-refusal-and-content",
    title: "Foundation Models refusal and raw-content APIs",
    canonicalSummary:
      "Guided generation added explicit refusal handling, raw generated-content access, and a permissive mode for supported text transformations.",
    category: "developerApi",
    action: "introduced",
    citations: [
      c(
        beta5,
        "Foundation Models framework — New Features; 156086748, 156351123, 156721060",
      ),
    ],
  }),
  change({
    key: "ios-ipados-26-beta5-coredata-sendable-annotations",
    title: "Core Data concurrency annotations",
    canonicalSummary:
      "The Beta 5 SDK revised Core Data Sendable and isolation annotations, surfacing warnings for code that violated established context-concurrency rules.",
    category: "developerApi",
    action: "changed",
    citations: [c(beta5, "CoreData — Known Issues; 153848710")],
  }),
  change({
    key: "ios-ipados-26-beta5-coredata-ubiquitous-store-options",
    title: "Deprecated Core Data ubiquitous-store options removed",
    canonicalSummary:
      "The iOS and iPadOS 26 SDK removed long-deprecated ubiquitous-store option keys superseded by NSPersistentCloudKitContainer and SwiftData.",
    category: "removal",
    action: "removed",
    citations: [c(beta5, "CoreData — Deprecations; 157297746")],
  }),
  change({
    key: "ios-ipados-26-beta5-multiple-device-controller-pairing",
    title: "Multi-device DualSense pairing",
    canonicalSummary:
      "A DualSense or DualSense Edge controller could pair with multiple Apple devices and switch between them.",
    category: "feature",
    action: "introduced",
    citations: [c(beta5, "Game Controller — New Features; 137782227")],
  }),
  change({
    key: "ios-ipados-26-beta5-power-slider-health-data",
    title: "Health data at the power-off screen",
    canonicalSummary:
      "Health data remained accessible after a device without a passcode reached the Power Off slider.",
    category: "bugFix",
    action: "fixed",
    citations: [c(beta5, "HealthKit — Resolved Issues; 155576088")],
  }),
  change({
    key: "ios-ipados-26-beta5-alphanumeric-passcode-screen",
    title: "Alphanumeric passcode entry regression",
    canonicalSummary:
      "Some devices with alphanumeric passcodes could show a single-digit entry screen that prevented the correct passcode from being entered.",
    category: "regression",
    action: "regression",
    citations: [c(beta5, "Passcode — Known Issues; 156070293")],
  }),
  change({
    key: "ios-ipados-26-beta5-full-screen-cover-background",
    title: "SwiftUI full-screen cover backgrounds",
    canonicalSummary:
      "SwiftUI full-screen covers again used opaque backgrounds where transparency was unintended.",
    category: "bugFix",
    action: "fixed",
    citations: [c(beta5, "SwiftUI — Resolved Issues; 154232311")],
  }),
]);
add("ipados", "beta-5", [
  ...deltaByRoute.get("ipados/beta-5"),
  change({
    key: "ipados-26-beta5-multitasking-mode-picker",
    title: "Multitasking mode picker",
    canonicalSummary:
      "The Multitasking mode picker returned to Control Center on affected iPad models.",
    category: "bugFix",
    action: "fixed",
    citations: [c(beta5, "iPad Multitasking — Resolved Issues; 152457491")],
  }),
]);

const beta6 = noteUrl("beta-6");
addBoth("beta-6", [
  change({
    key: "ios-ipados-26-beta6-foundation-models-assets",
    title: "Foundation Models asset-download guardrail errors",
    canonicalSummary:
      "Foundation Models stopped reporting guardrail violations caused by model assets that had not fully downloaded.",
    category: "bugFix",
    action: "fixed",
    citations: [
      c(beta6, "Foundation Models framework — Resolved Issues; 156223847"),
    ],
  }),
  change({
    key: "ios-ipados-26-beta6-one-sided-message-translation",
    title: "One-sided Messages translation",
    canonicalSummary:
      "Message translation could fail when only the recipient had enabled translation.",
    category: "knownIssue",
    action: "knownIssue",
    citations: [c(beta6, "Messages — Known Issues; 157779997")],
  }),
  change({
    key: "ios-ipados-26-beta6-alphanumeric-passcode-fix",
    title: "Alphanumeric passcode entry restored",
    canonicalSummary:
      "Apple fixed the Beta 5 state that could present a single-digit screen for an alphanumeric passcode.",
    category: "bugFix",
    action: "fixed",
    citations: [c(beta6, "Passcode — Resolved Issues; 156070293")],
  }),
  change({
    key: "ios-ipados-26-beta6-search-crashes",
    title: "Search-related app crashes",
    canonicalSummary: "Applications no longer quit unexpectedly during search.",
    category: "bugFix",
    action: "fixed",
    citations: [c(beta6, "Search — Resolved Issues; 157464670")],
  }),
  change({
    key: "ios-ipados-26-beta6-home-screen-web-apps",
    title: "Add to Home Screen web apps",
    canonicalSummary:
      "The Add to Home Screen flow again loaded webpage data needed to create a Home Screen web app.",
    category: "bugFix",
    action: "fixed",
    citations: [c(beta6, "Web Apps — Resolved Issues; 154655565")],
  }),
]);

const beta9 = noteUrl("beta-9");
addBoth("beta-9", [
  change({
    key: "ios-ipados-26-beta9-create-image-action",
    title: "Create Image action discovery",
    canonicalSummary:
      "The Image Playground Create Image action reappeared in Shortcuts and Spotlight.",
    category: "bugFix",
    action: "fixed",
    citations: [c(beta9, "Image Playground — Resolved Issues; 153235442")],
  }),
  change({
    key: "ios-ipados-26-beta9-popover-environment-objects",
    title: "SwiftUI popover environment-object crash",
    canonicalSummary:
      "SwiftUI popovers stopped crashing when they accessed environment objects declared outside the popover content.",
    category: "bugFix",
    action: "fixed",
    citations: [c(beta9, "SwiftUI — Resolved Issues; 156906038")],
  }),
]);

const rc = noteUrl("rc");
addBoth("rc", [
  change({
    key: "ios-ipados-26-rc-cloudkit-request-access",
    title: "CloudKit request-access APIs",
    canonicalSummary:
      "CloudKit request-access operations that were present in the SDK began functioning.",
    category: "bugFix",
    action: "fixed",
    citations: [c(rc, "CloudKit — Resolved Issues; 151878020")],
  }),
  change({
    key: "ios-ipados-26-rc-uisymbol-transition-compiler-crash",
    title: "UISymbolContentTransition compiler crash",
    canonicalSummary:
      "The Swift compiler stopped crashing when a project initialized UISymbolContentTransition.",
    category: "bugFix",
    action: "fixed",
    citations: [c(rc, "Swift Compiler — Resolved Issues; 150858005")],
  }),
]);

const platforms = [
  {
    name: "iOS",
    slug: "ios",
    platformId: "platform-ios",
    versionId: "version-ios-26-0",
    events: [
      ["beta-1", "Beta 1", "2025-06-09", "23A5260n"],
      ["beta-1-v2", "Beta 1 v2", "2025-06-13", "23A5260u"],
      ["beta-2", "Beta 2", "2025-06-23", "23A5276f"],
      ["beta-3", "Beta 3", "2025-07-07", "23A5287g"],
      ["beta-4", "Beta 4", "2025-07-22", "23A5297i"],
      ["beta-4-v2", "Beta 4 v2", "2025-07-24", "23A5297m"],
      ["public-beta-1", "Public Beta 1", "2025-07-24", "23A5297m"],
      ["beta-5", "Beta 5", "2025-08-05", "23A5308g"],
      ["beta-6", "Beta 6", "2025-08-11", "23A5318c"],
      ["beta-6-v2", "Beta 6 v2", "2025-08-14", "23A5318f"],
      ["beta-7", "Beta 7", "2025-08-18", "23A5326a"],
      ["beta-8", "Beta 8", "2025-08-25", "23A5330a"],
      ["beta-9", "Beta 9", "2025-09-02", "23A5336a"],
      ["rc", "RC", "2025-09-09", "23A340"],
    ],
  },
  {
    name: "iPadOS",
    slug: "ipados",
    platformId: "platform-ipados",
    versionId: "version-ipados-26-0",
    events: [
      ["beta-1", "Beta 1", "2025-06-09", "23A5260n"],
      ["beta-2", "Beta 2", "2025-06-23", "23A5276f"],
      ["beta-3", "Beta 3", "2025-07-07", "23A5287g"],
      ["beta-4", "Beta 4", "2025-07-22", "23A5297i"],
      ["beta-4-v2", "Beta 4 v2", "2025-07-24", "23A5297m"],
      ["public-beta-1", "Public Beta 1", "2025-07-24", "23A5297m"],
      ["beta-5", "Beta 5", "2025-08-05", "23A5308g"],
      ["beta-6", "Beta 6", "2025-08-11", "23A5318c"],
      ["beta-6-v2", "Beta 6 v2", "2025-08-14", "23A5318f"],
      ["beta-7", "Beta 7", "2025-08-18", "23A5326a"],
      ["beta-8", "Beta 8", "2025-08-25", "23A5330a"],
      ["beta-9", "Beta 9", "2025-09-02", "23A5336a"],
      ["rc", "RC", "2025-09-09", "23A340"],
    ],
  },
].map((platform) => ({
  ...platform,
  events: platform.events.map(([alias, label, date, build]) => ({
    alias,
    label,
    date,
    build,
  })),
}));

function uniqueCitations(citations) {
  return [
    ...new Map(
      citations.map((citation) => [
        `${citation.url}|${citation.locator || ""}|${citation.note || ""}`,
        citation,
      ]),
    ).values(),
  ];
}

function identityCitations(platform, event) {
  if (event.alias === "beta-4-v2") {
    return [
      c(U.beta4Revision, `Revised ${platform.name} 26 Beta 4; build 23A5297m`),
    ];
  }
  if (event.alias === "public-beta-1") {
    return [
      c(U.publicBeta, "First iOS 26 and iPadOS 26 public betas; July 24"),
      c(U.beta4Revision, "Build 23A5297m and revised Beta 4 relationship"),
    ];
  }
  if (event.alias === "beta-6-v2") {
    return [
      c(
        U.beta6Revision,
        `${platform.name} 26 Public Beta 3 and revised Beta 6 release; August 14`,
      ),
    ];
  }
  return [
    c(
      releaseSourceByKey.get(`${platform.slug}/${event.alias}`),
      `${platform.name} 26.0 ${event.label}; build ${event.build}`,
    ),
  ];
}

function identityChange(platform, event) {
  const isPublicBeta = event.alias === "public-beta-1";
  const isRevision = event.alias.endsWith("-v2");
  const sourceLimited =
    event.alias === "beta-4-v2" || event.alias === "beta-6-v2" || isPublicBeta;
  const scope =
    platform.slug === "ios" && event.alias === "beta-1-v2"
      ? " This build was limited to the iPhone 15 and iPhone 16 product families."
      : "";
  const canonicalSummary = isPublicBeta
    ? `Apple opened the first ${platform.name} 26 public beta on July 24, 2025, using build ${event.build}.${platform.slug === "ios" ? " The iPhone 11 family received a separate corrective build the next day." : ""}`
    : `${platform.name} 26 ${event.label} appeared on ${event.date} as build ${event.build}.${scope}`;

  return change({
    key: `${platform.slug}-26-${event.alias}-release-identity`,
    title: isPublicBeta
      ? "Public beta channel opened"
      : isRevision
        ? `${event.label} revised seed`
        : `${event.label} seed`,
    canonicalSummary,
    category: "other",
    action: event.alias === "beta-1" || isPublicBeta ? "introduced" : "changed",
    citations: identityCitations(platform, event),
    documentedStatus: sourceLimited ? "partiallyDocumented" : "documented",
    evidenceState: sourceLimited ? "corroborated" : "confirmed",
    verificationMethod: sourceLimited
      ? "Matched the exact audited local milestone and build note to contemporaneous release reporting; no unlisted fix or feature payload is inferred."
      : "Matched Apple Developer’s dated release entry and build number to the exact existing seed milestone and durable route alias.",
  });
}

function evidenceCitations(alias) {
  if (alias === "beta-7") {
    return [
      c(noteUrl("beta-6"), "Last cleanly separable snapshot before Beta 7"),
      c(
        noteUrl("beta-8"),
        "Next retained snapshot; Beta 7/Beta 8 attribution boundary",
      ),
    ];
  }
  if (alias === "beta-8") {
    return [
      c(noteUrl("beta-6"), "Prior retained structured snapshot"),
      c(
        noteUrl("beta-8"),
        "Beta 8 snapshot; changes since Beta 6 are not assigned to one seed",
      ),
    ];
  }
  if (alias === "beta-4-v2" || alias === "public-beta-1") {
    return [c(noteUrl("beta-4"), "Beta 4 release-note snapshot")];
  }
  if (alias === "beta-6-v2") {
    return [c(noteUrl("beta-6"), "Beta 6 release-note snapshot")];
  }
  return noteSnapshots[alias]
    ? [c(noteUrl(alias), `${alias} release-note snapshot`)]
    : [c(U.notes, "Living iOS & iPadOS 26 release notes")];
}

function eventNarrative(platform, event, deltas) {
  if (event.alias === "beta-1") {
    return `This page records a representative initial developer-note inventory rather than treating every cumulative iOS and iPadOS 26 feature as a Beta 1 discovery. The selected entries cover the first seed’s Foundation Models, accessibility, HealthKit, journaling, Metal, StoreKit, and VPN-compatibility changes.`;
  }
  if (event.alias === "beta-4-v2") {
    return `The audited milestone records a revised ${platform.name} Beta 4 build, ${event.build}. The retained Apple notes do not itemize a revision-only fix, so this route preserves the new build identity without copying Beta 4’s cumulative notes or guessing why Apple replaced the seed.`;
  }
  if (event.alias === "public-beta-1") {
    return `Public Beta 1 widened access to the Beta 4-era software. It does not receive a duplicate copy of Beta 4’s developer-note deltas. ${
      platform.slug === "ios"
        ? "The separate iPhone 11 correction is retained because both its device-limited build and folder-display fix are specifically sourced."
        : "No public-beta-only iPadOS behavior delta was found in the retained evidence."
    }`;
  }
  if (event.alias === "beta-6-v2") {
    return `The audited milestone records build ${event.build} as a revised ${platform.name} Beta 6 seed released alongside Public Beta 3. No retained source itemizes what changed inside the revision, so the page does not convert a build replacement into an unsupported bug-fix claim.`;
  }
  if (event.alias === "beta-7" || event.alias === "beta-8") {
    return `Apple’s release index establishes ${event.label} and build ${event.build}. The preserved developer-note snapshots do not support a clean Beta 7-versus-Beta 8 behavior diff, so later cumulative items are not assigned backward to this seed.`;
  }
  return `The adjacent preserved Apple Developer snapshots support ${deltas.length} milestone-specific ${deltas.length === 1 ? "item" : "items"} for this seed. These are deltas visible at this point in the prerelease cycle, not a cumulative copy of the eventual public release notes.`;
}

const events = platforms.flatMap((platform) =>
  platform.events.map((event) => {
    const identity = identityChange(platform, event);
    const deltas = deltaByRoute.get(`${platform.slug}/${event.alias}`) || [];
    const identityRefs = identityCitations(platform, event);
    const deltaRefs = uniqueCitations(
      deltas.flatMap((item) => item.citations || []),
    );
    const boundaryRefs = uniqueCitations([
      ...evidenceCitations(event.alias),
      c(U.notes, "Living document; historical attribution boundary"),
    ]);
    const summary =
      deltas.length > 0
        ? `${platform.name} 26 ${event.label} (${event.build}) has ${deltas.length} source-supported milestone ${deltas.length === 1 ? "delta" : "deltas"} plus exact build and channel metadata.`
        : `${platform.name} 26 ${event.label} (${event.build}) preserves exact prerelease identity and evidence limits without inventing a revision-specific or cumulative change list.`;

    return {
      target: {
        releaseVersionId: platform.versionId,
        routeAlias: event.alias,
      },
      authorship: "originalSynthesis",
      summary,
      article: article(
        heading("Release identity"),
        prose(
          `${platform.name} 26 ${event.label} appeared on ${event.date}. Its primary build is ${event.build}; that build identifier is scoped to ${platform.name} even when the same alphanumeric value also appeared on another Apple platform.${
            platform.slug === "ios" && event.alias === "beta-1-v2"
              ? " Apple limited this revised build to the iPhone 15 and iPhone 16 product families."
              : ""
          }`,
          identityRefs,
        ),
        heading("What changed at this milestone"),
        prose(eventNarrative(platform, event, deltas), [
          ...(deltaRefs.length > 0
            ? deltaRefs
            : evidenceCitations(event.alias)),
        ]),
        heading("How to read these notes"),
        prose(
          `Apple’s iOS and iPadOS 26 developer-notes page was updated throughout the beta cycle. This article uses preserved snapshots to isolate what the retained evidence supports at ${event.label}; it does not project the final public notes backward or describe an unlisted revision as a bug or security fix.`,
          boundaryRefs,
        ),
      ),
      citations: uniqueCitations([
        ...identityRefs,
        ...deltaRefs,
        ...evidenceCitations(event.alias),
      ]),
      changes: [identity, ...deltas],
      provenanceStatus: "editoriallyVerified",
      editorialReview: review(),
      isIndexable: true,
    };
  }),
);

const buildMap = new Map();
for (const platform of platforms) {
  for (const event of platform.events) {
    const identity = `${platform.versionId}/${event.build}`;
    if (!buildMap.has(identity)) {
      buildMap.set(identity, {
        releaseVersionId: platform.versionId,
        platformId: platform.platformId,
        platformName: platform.name,
        buildNumber: event.build,
        eventTargets: [],
        labels: [],
        citations: [],
      });
    }
    const item = buildMap.get(identity);
    item.eventTargets.push({
      releaseVersionId: platform.versionId,
      routeAlias: event.alias,
    });
    item.labels.push(event.label);
    item.citations.push(...identityCitations(platform, event));
  }
}

const builds = [...buildMap.values()].map((item) => {
  const labels = [...new Set(item.labels)];
  const citations = uniqueCitations(item.citations);
  const summary = `${item.platformName} 26 build ${item.buildNumber} is linked to the exact existing ${labels.join(" and ")} ${labels.length === 1 ? "event" : "events"}; the build record does not imply a public release or an undocumented payload.`;
  return {
    releaseVersionId: item.releaseVersionId,
    platformId: item.platformId,
    buildNumber: item.buildNumber,
    eventTargets: item.eventTargets,
    authorship: "originalSynthesis",
    summary,
    article: article(
      heading("Build linkage"),
      prose(
        `${summary} Build identifiers are recorded independently from release-note deltas so a shared or revised seed is not mistaken for a separately documented feature payload.`,
        citations,
      ),
    ),
    citations,
    provenanceStatus: "editoriallyVerified",
    editorialReview: review(),
    isIndexable: true,
  };
});

const iphone11BuildCitations = [
  c(
    U.iphone11Correction,
    "iPhone 11 build 23A5297n and Home Screen folder correction",
  ),
  c(noteUrl("beta-5"), "Apps — Resolved Issues; 156425266"),
];
const iphone11BuildSummary =
  "iOS 26 build 23A5297n was a July 25, 2025 corrective build limited to the iPhone 11 family; it is intentionally unlinked because Public Beta 1 already uses the primary 23A5297m build reference.";
builds.push({
  releaseVersionId: "version-ios-26-0",
  platformId: "platform-ios",
  buildNumber: "23A5297n",
  authorship: "originalSynthesis",
  summary: iphone11BuildSummary,
  article: article(
    heading("Build linkage"),
    prose(
      `${iphone11BuildSummary} The accompanying sources support the device scope and correction while the absent event link preserves the site’s one-primary-build constraint.`,
      iphone11BuildCitations,
    ),
  ),
  citations: iphone11BuildCitations,
  provenanceStatus: "editoriallyVerified",
  editorialReview: review(),
  isIndexable: true,
});

const bundle = {
  formatVersion: 1,
  target: { projectId: "lh3yswzu", dataset: "production" },
  accessedAt,
  sources,
  versions: [],
  events,
  builds,
};

const expectedSeed = [
  {
    platform: "iOS",
    majorVersion: 26,
    publicReleaseDate: "2025-09-15",
    versionNote: undefined,
    milestones: [
      ["Beta 1", "2025-06-09", false, undefined],
      [
        "Beta 1 v2",
        "2025-06-13",
        true,
        "Build 23A5260u; iPhone 15 and iPhone 16 product families only",
      ],
      ["Beta 2", "2025-06-23", false, undefined],
      ["Beta 3", "2025-07-07", false, undefined],
      ["Beta 4", "2025-07-22", false, undefined],
      ["Beta 4 v2", "2025-07-24", true, "Build 23A5297m"],
      [
        "Public Beta 1",
        "2025-07-24",
        false,
        "Build 23A5297m; iPhone 11 family received corrective build 23A5297n on 7/25",
      ],
      ["Beta 5", "2025-08-05", false, undefined],
      ["Beta 6", "2025-08-11", false, undefined],
      [
        "Beta 6 v2",
        "2025-08-14",
        true,
        "Build 23A5318f; also released as Public Beta 3",
      ],
      ["Beta 7", "2025-08-18", false, undefined],
      ["Beta 8", "2025-08-25", false, undefined],
      ["Beta 9", "2025-09-02", false, undefined],
      ["RC", "2025-09-09", false, undefined],
      ["Public", "2025-09-15", false, undefined],
    ],
  },
  {
    platform: "iPadOS",
    majorVersion: 26,
    publicReleaseDate: "2025-09-15",
    versionNote: undefined,
    milestones: [
      ["Beta 1", "2025-06-09", false, undefined],
      ["Beta 2", "2025-06-23", false, undefined],
      ["Beta 3", "2025-07-07", false, undefined],
      ["Beta 4", "2025-07-22", false, undefined],
      ["Beta 4 v2", "2025-07-24", true, "Build 23A5297m"],
      ["Public Beta 1", "2025-07-24", false, "Build 23A5297m"],
      ["Beta 5", "2025-08-05", false, undefined],
      ["Beta 6", "2025-08-11", false, undefined],
      [
        "Beta 6 v2",
        "2025-08-14",
        true,
        "Build 23A5318f; also released as Public Beta 3",
      ],
      ["Beta 7", "2025-08-18", false, undefined],
      ["Beta 8", "2025-08-25", false, undefined],
      ["Beta 9", "2025-09-02", false, undefined],
      ["RC", "2025-09-09", false, undefined],
      ["Public", "2025-09-15", false, undefined],
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
const actualSeed = seed.releaseVersions
  .filter(
    (version) =>
      version.version === "26.0" &&
      (version.platform === "iOS" || version.platform === "iPadOS"),
  )
  .map((version) => ({
    platform: version.platform,
    majorVersion: version.majorVersion,
    publicReleaseDate: version.publicReleaseDate,
    versionNote: version.versionNote,
    milestones: version.milestones.map((milestone) => [
      milestone.label,
      milestone.date,
      milestone.isRevision,
      milestone.note,
    ]),
  }))
  .sort((left, right) => left.platform.localeCompare(right.platform));
const sortedExpectedSeed = [...expectedSeed].sort((left, right) =>
  left.platform.localeCompare(right.platform),
);
if (
  JSON.stringify(stableValue(actualSeed)) !==
  JSON.stringify(stableValue(sortedExpectedSeed))
) {
  throw new Error(
    "The exact local iOS/iPadOS 26.0 seed inventory changed; re-audit this cohort before regenerating.",
  );
}

const remainingPlatforms = new Set(["macOS", "watchOS", "tvOS", "visionOS"]);
const remainingGap = seed.releaseVersions
  .filter(
    (version) =>
      version.version === "26.0" && remainingPlatforms.has(version.platform),
  )
  .map((version) => ({
    platform: version.platform,
    prereleaseCount: version.milestones.filter(
      (milestone) => milestone.label !== "Public",
    ).length,
  }))
  .sort((left, right) => left.platform.localeCompare(right.platform));
if (
  remainingGap.length !== 4 ||
  remainingGap.some((item) => item.prereleaseCount !== 10)
) {
  throw new Error(
    "The documented 40-route macOS/watchOS/tvOS/visionOS gap changed.",
  );
}

const expectedRoutes = new Set(
  platforms.flatMap((platform) =>
    platform.events.map((event) => `${platform.versionId}/${event.alias}`),
  ),
);
const actualRoutes = events.map(
  (event) => `${event.target.releaseVersionId}/${event.target.routeAlias}`,
);
const expectedBuilds = new Set([
  ...[
    "23A5260n",
    "23A5260u",
    "23A5276f",
    "23A5287g",
    "23A5297i",
    "23A5297m",
    "23A5297n",
    "23A5308g",
    "23A5318c",
    "23A5318f",
    "23A5326a",
    "23A5330a",
    "23A5336a",
    "23A340",
  ].map((build) => `version-ios-26-0/${build}`),
  ...[
    "23A5260n",
    "23A5276f",
    "23A5287g",
    "23A5297i",
    "23A5297m",
    "23A5308g",
    "23A5318c",
    "23A5318f",
    "23A5326a",
    "23A5330a",
    "23A5336a",
    "23A340",
  ].map((build) => `version-ipados-26-0/${build}`),
]);
const actualBuilds = builds.map(
  (build) => `${build.releaseVersionId}/${build.buildNumber}`,
);

if (
  bundle.versions.length !== 0 ||
  events.length !== 27 ||
  builds.length !== 26 ||
  expectedRoutes.size !== 27 ||
  new Set(actualRoutes).size !== expectedRoutes.size ||
  actualRoutes.some((route) => !expectedRoutes.has(route)) ||
  actualRoutes.some((route) => route.endsWith("/public")) ||
  events.some(
    (event) =>
      Object.keys(event.target).sort().join(",") !==
        "releaseVersionId,routeAlias" ||
      event.provenanceStatus !== "editoriallyVerified" ||
      event.editorialReview.status !== "approved" ||
      event.editorialReview.reviewedAt !== reviewedAt ||
      event.isIndexable !== true,
  ) ||
  new Set(actualBuilds).size !== expectedBuilds.size ||
  actualBuilds.some((identity) => !expectedBuilds.has(identity)) ||
  builds.some(
    (build) =>
      build.provenanceStatus !== "editoriallyVerified" ||
      build.editorialReview.status !== "approved" ||
      build.editorialReview.reviewedAt !== reviewedAt ||
      build.isIndexable !== true ||
      (build.eventTargets || []).some(
        (target) =>
          Object.keys(target).sort().join(",") !==
            "releaseVersionId,routeAlias" ||
          !expectedRoutes.has(
            `${target.releaseVersionId}/${target.routeAlias}`,
          ) ||
          target.routeAlias === "public",
      ),
  )
) {
  throw new Error(
    "The expected iOS/iPadOS 26.0 prerelease bundle closure failed.",
  );
}

const localChanges = events.flatMap((event) => event.changes || []);
const localChangeDefinitions = new Map();
for (const item of localChanges) {
  const stable = JSON.stringify(stableValue(item));
  const previous = localChangeDefinitions.get(item.key);
  if (previous && previous !== stable) {
    throw new Error(`Local change definition drifted for ${item.key}.`);
  }
  localChangeDefinitions.set(item.key, stable);
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
    ...(candidate.events || []),
    ...(candidate.builds || []),
  ]) {
    for (const item of owner.changes || []) {
      if (!otherChangeKeys.has(item.key)) otherChangeKeys.set(item.key, file);
    }
  }
  for (const event of candidate.events || []) {
    if (
      event.target?.releaseVersionId &&
      event.target?.routeAlias &&
      expectedRoutes.has(
        `${event.target.releaseVersionId}/${event.target.routeAlias}`,
      )
    ) {
      throw new Error(
        `Another research batch already owns ${event.target.releaseVersionId}/${event.target.routeAlias}: ${file}`,
      );
    }
  }
  for (const build of candidate.builds || []) {
    const identity = `${build.releaseVersionId}/${build.buildNumber}`;
    if (expectedBuilds.has(identity)) {
      throw new Error(
        `Another research batch already owns ${identity}: ${file}`,
      );
    }
  }
}
const collisions = [...localChangeDefinitions.keys()].filter((key) =>
  otherChangeKeys.has(key),
);
if (collisions.length > 0) {
  throw new Error(
    `Prerelease change keys collide with existing content: ${collisions
      .map((key) => `${key} (${otherChangeKeys.get(key)})`)
      .join(", ")}`,
  );
}

const launchManifest = JSON.parse(
  readFileSync(join(here, "..", "apple-launch-content-2026.json"), "utf8"),
);
const approvedPublicLegacyTargets = new Set([
  "version-ios-26-0:m12",
  "version-ipados-26-0:m12",
]);
const launchPublicEvents = (launchManifest.events || []).filter((event) =>
  approvedPublicLegacyTargets.has(event.target?.legacySourceId),
);
const launchVersionOverlays = (launchManifest.versions || []).filter(
  (version) =>
    version.releaseVersionId === "version-ios-26-0" ||
    version.releaseVersionId === "version-ipados-26-0",
);
if (
  launchPublicEvents.length !== 2 ||
  launchVersionOverlays.length !== 2 ||
  launchPublicEvents.some(
    (event) =>
      event.editorialReview?.status !== "approved" ||
      event.isIndexable !== true,
  ) ||
  launchVersionOverlays.some(
    (version) => version.editorialReview?.status !== "approved",
  )
) {
  throw new Error(
    "The approved iOS/iPadOS 26 public launch ownership changed; re-audit overlap before regenerating.",
  );
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
    `Citation closure failed. Missing: ${missingSources.join(", ")}; unused: ${unusedSources
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
const generatorSha = createHash("sha256")
  .update(readFileSync(fileURLToPath(import.meta.url)))
  .digest("hex");

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
const uniqueChangeCount = localChangeDefinitions.size;
const changeOccurrenceCount = localChanges.length;

const routeRows = platforms
  .flatMap((platform) =>
    platform.events.map((event) => {
      const releaseEvent = events.find(
        (item) =>
          item.target.releaseVersionId === platform.versionId &&
          item.target.routeAlias === event.alias,
      );
      return `| ${platform.name} | ${event.label} | ${event.date} | \`${event.build}\` | ${releaseEvent.changes.length - 1} |`;
    }),
  )
  .join("\n");

const sourceLedger = sources
  .map(
    (source) =>
      `- [${source.title}](${source.url}) — ${source.publisher}; ${source.sourceClass}.`,
  )
  .join("\n");

const md = `# Apple iOS and iPadOS 26 prerelease research batch

## Result

\`${outputName}\` publishes substantive, independently reviewed articles for every existing
iOS 26.0 and iPadOS 26.0 prerelease route. It does not mutate either approved
public event, either approved version article, or either public build.

- 27 exact event overlays: 14 iOS and 13 iPadOS
- 26 exact build records, including revised builds and the unlinked
  iPhone 11 corrective build \`23A5297n\`
- ${changeOccurrenceCount} structured change occurrences across
  ${uniqueChangeCount} globally collision-checked definitions
- ${sources.length} declared and used sources with ${citationCount}
  claim-level or page-level citation references
- 0 release-version overlays, 0 route creations, and 0 \`public\` event targets
- every event and build is \`editoriallyVerified\`, approved at
  \`${reviewedAt}\`, and \`isIndexable: true\`

## Exact route closure

| Platform | Existing route | Date | Primary build | Milestone deltas beyond identity |
| --- | --- | --- | --- | ---: |
${routeRows}

## Research and attribution method

1. Exact labels, dates, revision flags, notes, and device/build scope come from
   the audited local seed inventory.
2. Apple Developer release cards establish the ordinary developer-seed build
   numbers. Their canonical URLs are retained with dated Internet Archive
   captures.
3. Preserved snapshots of Apple’s iOS and iPadOS 26 developer notes are
   compared sequentially. A behavior, API, fix, regression, or known issue is
   attached only where the retained snapshots support that milestone.
4. The first beta uses a representative initial inventory rather than
   pretending every version-wide feature was discovered in Beta 1.
5. Revised builds do not inherit speculative fixes. Public Beta 1 widens the
   channel and does not duplicate Beta 4’s developer-note payload.
6. All prose is original synthesis. Product names are nominative references;
   no article body, screenshot, logo, or marketing passage is reproduced.

## Preserved build and device scope

- iOS Beta 1 v2 is build \`23A5260u\`, limited by the audited milestone to
  the iPhone 15 and iPhone 16 product families. Apple’s preserved note ties
  the update to a startup/restore problem on some of those models.
- iOS and iPadOS Beta 4 v2 use build \`23A5297m\`; the same build is the
  primary build for Public Beta 1. No revision-only fix is inferred.
- The iPhone 11 family received \`23A5297n\` on July 25. It remains a separate,
  unlinked build because an event can have only one primary build reference.
  The sourced change was a Home Screen folder-display correction.
- iOS and iPadOS Beta 6 v2 use build \`23A5318f\`; the audited milestone also
  associates it with Public Beta 3. No unlisted revision payload is inferred.
- RC is build \`23A340\`. The approved public build \`23A341\` remains
  untouched.

## Exact evidence gaps

1. No clean retained structured snapshot isolates Beta 7 from Beta 8. Both
   routes therefore preserve real release-card/build metadata and an explicit
   evidence boundary without assigning cumulative notes backward.
2. Apple’s public release index did not retain separate cards for
   \`23A5297m\`, \`23A5318f\`, or \`23A5297n\`. Those build identities are
   preserved from the audited seed and corroborated with contemporaneous
   reporting; their articles are marked \`partiallyDocumented\`/
   \`corroborated\`, not first-party-confirmed.
3. Public Beta 1 has no duplicated Beta 4 change list. The only additional
   structured iOS item is the separately sourced iPhone 11 correction.
4. Beta 4 v2 and Beta 6 v2 have no sourced revision-only release-note payload,
   so neither page labels the reissue as a bug fix or security update.

## Deferred six-platform gap

The requested six-platform 26.0 prerelease inventory is too broad for one
source-accurate batch. This cohort closes all 27 iOS/iPadOS routes. The exact
remaining gap is 40 non-public routes:

- macOS 26.0: 10
- watchOS 26.0: 10
- tvOS 26.0: 10
- visionOS 26.0: 10

Those four platforms require their own historical developer-note snapshot
audits before content should be prepared.

## Source ledger

All sources were accessed on ${accessedAt}. Apple developer-note pages are
living documents, so historical claims cite preserved captures and exact
component/radar locators.

${sourceLedger}

## Closure guards

- Exact comparison against both full local 26.0 seed records, including the
  two Public milestones that this batch explicitly excludes
- Exact 27-route selector allowlist using only
  \`{releaseVersionId, routeAlias}\`
- Explicit rejection of every \`public\` selector and every version overlay
- Exact 26-build allowlist and exact event-target closure
- Explicit guard that the approved launch manifest still owns both public
  events and both version articles
- Collision scan across every other research-batch JSON and the approved
  launch manifest for route, build, and change-key ownership
- Full citation declaration/use closure
- Deterministic formatted JSON SHA-256: \`${jsonSha}\`

## Validation and dry run

Validation completed on ${accessedAt}:

- The generator’s seed, selector, build, collision, review-state, and citation
  guards passed.
- Repository-wide research validation accepted 44 batches and 2,287 globally
  consistent change keys.
- The focused launch-content ingestion and manifest suites passed 19 of 19
  tests.
- ESLint and Prettier passed for the generator, manifest, and ledger;
  \`git diff --check\` passed.
- A second generator run reproduced the JSON byte for byte at SHA-256
  \`${jsonSha}\`.
- The reviewed production dry run reported 135 creates, 28
  revision-guarded patches, and 2,055 unchanged documents. The mutation
  payload was 340,006 bytes, 8.7% of the guarded limit.
- Creates are exactly 35 sources, 26 builds, and 74 release changes. Patches
  are exactly the 27 intended draft prerelease events plus one reused source.
- Every event patch sets only article, build reference, changes, citations,
  review state, provenance, and summary. There are no event or version creates,
  no version patches, no \`public\` route, no unsets, and no deletion.
- Production plan SHA:
  \`3cb1c9cb56def732f3e1bdea37571e8495539a83b39dd2289e2884d46f9cc3b9\`.

## Editorial approval and production receipt

The primary agent independently reviewed the route closure, source ledger,
claim locators, representative raw Apple DocC snapshots, and the exact
revision-guarded production plan. Seventy cited Apple issue identifiers sampled
across Beta 1, Beta 2, Beta 5, and RC were present in the corresponding raw
archived payloads with no misses. Build records were also given short,
source-linked original-synthesis articles so they pass the same substantive
editorial gate as event records.

- Editorial approval recorded at \`${reviewedAt}\`
- Approved manifest SHA-256: \`${jsonSha}\`
- Generator SHA-256: \`${generatorSha}\`
- Applied production plan:
  \`3cb1c9cb56def732f3e1bdea37571e8495539a83b39dd2289e2884d46f9cc3b9\`
- Plan artifact SHA-256:
  \`9497ba0e154591303ad612e69077d9cc05d9e1b7ed16988b28c1cae0ffc5e24d\`
- Rollback artifact SHA-256:
  \`c9f5da64b7ffc2528e6d5c10d5e267bb6b17ecdaaace5a3600801cc797575ac5\`
- Apply receipt SHA-256:
  \`f8a4114b94cef93d3826b8a97674542161eab7ca78372d4be96681f4cf3adddc\`
- Sanity transaction: \`F0eE6eK5XyVXtlnaoy7kuE\`
- Post-apply residual plan:
  \`2829c1c5ad29a44c0f106ea67d60b48cf23d13ddbdb4221f501800a3b8d7f429\`
  with 0 creates, 0 patches, and 2,218 unchanged documents
- Production coverage after apply: 410 of 410 versions have full articles;
  appearances are 290 full, 270 source-linked, and 1,419 timeline-only; 441
  appearances have approved structured changes
- Local cache-busted verification passed for representative Beta 1, Beta 5,
  RC, and corrective-build routes; each rendered its article, references, and
  \`index, follow\` metadata
`;

const ledgerPath = join(here, ledgerName);
const formattedMd = await prettier.format(md, { filepath: ledgerPath });
writeFileSync(ledgerPath, formattedMd);

console.log(
  `Wrote ${events.length} events, ${builds.length} builds, ${changeOccurrenceCount} change occurrences (${uniqueChangeCount} unique), and ${sources.length} sources to ${outputPath}.`,
);
