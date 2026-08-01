import { createHash } from "node:crypto";
import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import prettier from "prettier";

const here = dirname(fileURLToPath(import.meta.url));
const outputName = "apple-ios-ipados-14-prerelease.json";
const ledgerName = "apple-ios-ipados-14-prerelease.md";
const accessedAt = "2026-07-30";
const reviewedAt = "2026-07-30T08:31:50Z";
const publication = {
  planSha: "6568a87ef30747ff7c8ce7d37c8b3702acc43789b5703338e12b4c605b405175",
  planArtifactSha:
    "62b448d15984ab58aef46cf55b1b76eebd603b5562b99b283e42313133c91e58",
  rollbackArtifactSha:
    "85fe2095f06e8ab9bcc2e51dfc6e7cff74e8eb8f756e0aa4ebed831db123f81a",
  transactionId: "F0eE6eK5XyVXtlnaoyCuQL",
  receiptSha:
    "a85ed5a38e38f63966338cf85ae757e99e176dd136b8b179e0dccbdf2070225e",
  immediateZeroPlanSha:
    "01f956496c29c3cf8abae9e057787363f929df174e5793c32082121a924d9634",
  immediateZeroPlanArtifactSha:
    "3f661cbc3102357fc5539e9b20fd139828b9d65ab101cf7151cb0aa1070ae533",
  immediateZeroUnchanged: 2162,
  immediateZeroPayloadBytes: 16,
};

const archivePath =
  "https://developer.apple.com/documentation/ios-ipados-release-notes/ios-ipados-14-beta-release-notes";
const transportPath =
  "https://developer.apple.com/tutorials/data/documentation/ios-ipados-release-notes/ios-ipados-14-beta-release-notes.json";

const U = {
  installBeta: "https://developer.apple.com/support/install-beta",
  beta1Shell: `https://web.archive.org/web/20200703101020/${archivePath}`,
  beta3Shell: `https://web.archive.org/web/20200726024530/${archivePath}`,
  beta4: `https://web.archive.org/web/20200807235724/${archivePath}`,
  beta4Transport: `https://web.archive.org/web/20200810155919id_/${transportPath}`,
};

const sources = [
  {
    url: U.beta1Shell,
    title:
      "iOS & iPadOS 14 beta documentation — July 3 shell (preserved snapshot)",
    publisher: "Apple Developer via Internet Archive",
    sourceClass: "archive",
    author: "Apple",
    publishedAt: "2020-07-03T10:10:20.000Z",
    topics: [
      "iOS",
      "iPadOS",
      "14.0",
      "Beta 1 archive boundary",
      "historical release notes",
    ],
  },
  {
    url: U.beta3Shell,
    title:
      "iOS & iPadOS 14 beta documentation — July 26 shell (preserved snapshot)",
    publisher: "Apple Developer via Internet Archive",
    sourceClass: "archive",
    author: "Apple",
    publishedAt: "2020-07-26T02:45:30.000Z",
    topics: [
      "iOS",
      "iPadOS",
      "14.0",
      "Beta 3 archive boundary",
      "historical release notes",
    ],
  },
  {
    url: U.beta4,
    transportUrl: U.beta4Transport,
    title:
      "iOS & iPadOS 14 Beta 4 Release Notes (preserved cumulative snapshot)",
    publisher: "Apple Developer via Internet Archive",
    sourceClass: "archive",
    author: "Apple",
    publishedAt: "2020-08-07T23:57:24.000Z",
    topics: [
      "iOS",
      "iPadOS",
      "14.0",
      "Beta 1 through Beta 4 exact headings",
      "historical release notes",
    ],
  },
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
const review = () => ({ status: "approved", reviewedAt });
const uniqueCitations = (citations) => [
  ...new Map(
    citations.map((citation) => [
      `${citation.url}|${citation.locator || ""}|${citation.note || ""}`,
      citation,
    ]),
  ).values(),
];

function verificationFor(alias, status) {
  const exactHeading =
    status === "new"
      ? alias === "beta-1"
        ? "New Features in iOS & iPadOS 14 beta"
        : `New Features in iOS & iPadOS 14 ${alias.replace("-", " ")}`
      : alias === "beta-1"
        ? "Resolved in iOS & iPadOS 14 beta"
        : `Resolved in iOS & iPadOS 14 ${alias.replace("-", " ")}`;
  return `Matched the component, retained issue ID, and Apple's exact “${exactHeading}” heading in the 172-record Beta 4 DocC state captured after Beta 4 and before Beta 5. Attribution uses the milestone-named heading, not a crossed-state diff.`;
}

function archivedChange(alias, input) {
  const exactHeading =
    input.status === "new"
      ? alias === "beta-1"
        ? "New Features in iOS & iPadOS 14 beta"
        : `New Features in iOS & iPadOS 14 ${alias.replace("-", " ")}`
      : alias === "beta-1"
        ? "Resolved in iOS & iPadOS 14 beta"
        : `Resolved in iOS & iPadOS 14 ${alias.replace("-", " ")}`;
  return {
    key: input.key,
    title: input.title,
    canonicalSummary: input.canonicalSummary,
    category: input.category,
    action: input.action,
    inheritance: "delta",
    summary:
      input.summary ||
      `${input.title} is retained as a milestone-specific ${alias.replace("-", " ")} item in Apple's archived developer notes.`,
    documentedStatus: "documented",
    evidenceState: "confirmed",
    verificationMethod: verificationFor(alias, input.status),
    citations: [
      c(
        U.beta4,
        `${input.component} — ${exactHeading}; ${input.issueIds}`,
        `Original synthesis from Apple's milestone-named record for ${input.issueIds}.`,
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
  component,
  issueIds,
  status,
  summary,
) => ({
  key,
  title,
  canonicalSummary,
  category,
  action,
  component,
  issueIds,
  status,
  ...(summary ? { summary } : {}),
});

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
  change(
    "apple-14-beta1-skoverlay-app-install",
    "In-app App Store download overlay",
    "StoreKit gained an overlay that can start an app download without taking the user away from the current app or App Clip.",
    "developerApi",
    "introduced",
    "App Store",
    "56886149",
    "new",
  ),
  change(
    "apple-14-beta1-sandbox-subscription-controls",
    "Sandbox subscription controls",
    "App Store sandbox accounts gained settings for subscription changes, cancellations, and introductory-offer eligibility resets.",
    "developerApi",
    "introduced",
    "App Store",
    "57248908",
    "new",
  ),
  change(
    "apple-14-beta1-stereo-microphone-orientation",
    "Stereo microphone orientation",
    "AVAudioSession added controls for selecting a stereo microphone pattern and describing the device's input orientation.",
    "developerApi",
    "introduced",
    "AVFoundation",
    "58584572",
    "new",
  ),
  change(
    "apple-14-beta1-wubi-input-methods",
    "Additional Wubi input methods",
    "The keyboard added three variants of the Wubi input method for Simplified Chinese.",
    "enhancement",
    "introduced",
    "Localization",
    "56277474",
    "new",
  ),
  change(
    "apple-14-beta1-pinyin-quickpath-english",
    "English QuickPath on Pinyin keyboard",
    "The Simplified Chinese Pinyin keyboard gained swipe entry for English words.",
    "enhancement",
    "introduced",
    "Localization",
    "56314466",
    "new",
  ),
  change(
    "apple-14-beta1-japanese-kana-numbers",
    "Improved number entry on Kana keyboards",
    "Numeric input from the Japanese Kana keyboard received a substantial usability update.",
    "enhancement",
    "changed",
    "Localization",
    "56285976",
    "new",
  ),
  change(
    "apple-14-beta1-gaelic-nynorsk-autocorrection",
    "Gaelic and Nynorsk autocorrection",
    "Irish Gaelic and Norwegian Nynorsk keyboards gained automatic spelling correction.",
    "enhancement",
    "introduced",
    "Localization",
    "53156919, 48183197",
    "new",
  ),
  change(
    "apple-14-beta1-swift-logger-api",
    "Swift-native unified logging",
    "The os framework introduced a Swift Logger interface with levels, interpolation, privacy controls, and lower-overhead logging.",
    "developerApi",
    "introduced",
    "Logging",
    "22539144",
    "new",
  ),
  change(
    "apple-14-beta1-experimental-http3",
    "Experimental HTTP/3",
    "Developers and Safari users gained switches for testing early HTTP/3 support.",
    "developerApi",
    "introduced",
    "Networking",
    "62969220",
    "new",
  ),
  change(
    "apple-14-beta1-safari-translation",
    "Safari webpage translation",
    "Safari introduced automatic translation availability detection for seven languages in the United States and Canada.",
    "feature",
    "introduced",
    "Safari and Webkit",
    "64437861",
    "new",
  ),
  change(
    "apple-14-beta1-swiftui-geometryreader-alignment",
    "Consistent GeometryReader alignment",
    "SwiftUI restored reliable top-leading placement for content hosted by GeometryReader when apps rebuild with the iOS 14 SDK.",
    "compatibility",
    "changed",
    "SwiftUI",
    "59722992",
    "resolved",
  ),
  change(
    "apple-14-beta1-voice-control-languages",
    "More English Voice Control locales",
    "Voice Control expanded to the United Kingdom and India English locales.",
    "enhancement",
    "introduced",
    "Voice Control",
    "55904557",
    "new",
  ),
]);

appendChanges(["ios"], "beta-1", [
  change(
    "ios-14-beta1-healthkit-mobility-metrics",
    "HealthKit mobility metrics",
    "HealthKit added measurements such as walking speed, step length, and double-support percentage.",
    "developerApi",
    "introduced",
    "HealthKit",
    "56387364",
    "new",
  ),
  change(
    "ios-14-beta1-healthkit-ecg-reading",
    "HealthKit ECG samples",
    "Apps gained access to electrocardiogram voltage samples and classifications recorded by Apple Watch.",
    "developerApi",
    "introduced",
    "HealthKit",
    "56396806",
    "new",
  ),
  change(
    "ios-14-beta1-carplay-keyboard-languages",
    "Broader CarPlay keyboard support",
    "CarPlay's keyboard became available in more than one hundred additional languages.",
    "enhancement",
    "introduced",
    "Localization",
    "56791047",
    "new",
  ),
]);

appendChanges(both, "beta-2", [
  change(
    "apple-14-beta2-full-keyboard-siri-shortcut",
    "Keyboard access to Siri and accessibility actions",
    "Full Keyboard Access could now invoke Siri and the configured Accessibility Shortcut.",
    "bugFix",
    "fixed",
    "Accessibility",
    "59607413",
    "resolved",
  ),
  change(
    "apple-14-beta2-account-auth-userinfo",
    "Account-upgrade extension metadata",
    "Account Authentication Modification extensions gained access to caller-provided userInfo during an in-app upgrade.",
    "developerApi",
    "introduced",
    "App Store",
    "64128404",
    "new",
  ),
  change(
    "apple-14-beta2-arkit-session-replay",
    "ARKit geographic session replay",
    "Recorded AR sessions became usable with geographic tracking configurations.",
    "developerApi",
    "fixed",
    "ARKit",
    "63249747",
    "resolved",
  ),
  change(
    "apple-14-beta2-calendar-custom-recurrence",
    "Custom recurring calendar events",
    "Calendar restored the ability to create events with custom recurrence rules.",
    "bugFix",
    "fixed",
    "Calendar",
    "64318342",
    "resolved",
  ),
  change(
    "apple-14-beta2-haptic-parameter-curves",
    "Larger Core Haptics parameter curves",
    "Advanced haptic players gained parameter-curve support beyond the earlier sixteen-control-point ceiling.",
    "developerApi",
    "introduced",
    "Core Haptics",
    "48822574",
    "new",
  ),
  change(
    "apple-14-beta2-home-first-launch",
    "Home first-launch stability",
    "The Home app stopped terminating during its initial launch.",
    "bugFix",
    "fixed",
    "HomeKit",
    "63900758",
    "resolved",
  ),
  change(
    "apple-14-beta2-location-prompt-weight",
    "Location prompt text weight",
    "Application-provided location usage descriptions stopped rendering with unintended bold styling.",
    "bugFix",
    "fixed",
    "Location",
    "63882116",
    "resolved",
  ),
  change(
    "apple-14-beta2-maps-restriction-alerts",
    "Maps restriction-zone alerts",
    "Maps enabled alerts for congestion areas and zones governed by license-plate restrictions.",
    "feature",
    "introduced",
    "Maps",
    "63826260",
    "resolved",
  ),
  change(
    "apple-14-beta2-maps-temporary-precision",
    "Temporary precise-location access in Maps",
    "Selected Maps tasks could request a one-time precise location grant from an iPhone or Apple Watch.",
    "feature",
    "introduced",
    "Maps",
    "63202251",
    "resolved",
  ),
  change(
    "apple-14-beta2-messages-pin-limit-alert",
    "Pinned-conversation alert fix",
    "Messages stopped showing an incorrect warning that the pinned-conversation maximum had been reached.",
    "bugFix",
    "fixed",
    "Messages",
    "62919406",
    "resolved",
  ),
  change(
    "apple-14-beta2-screen-time-widget",
    "Screen Time widget availability",
    "The Screen Time widget became available in the beta.",
    "feature",
    "introduced",
    "Screen Time",
    "64037493",
    "resolved",
  ),
  change(
    "apple-14-beta2-siri-home-shortcut-automation",
    "Shortcuts inside Home automations",
    "Home automations containing a shortcut began running successfully.",
    "bugFix",
    "fixed",
    "Siri",
    "64016006",
    "resolved",
  ),
  change(
    "apple-14-beta2-swiftui-body-builders",
    "Implicit SwiftUI body builders",
    "SwiftUI inferred the appropriate view or scene result builder for body declarations.",
    "developerApi",
    "introduced",
    "SwiftUI",
    "63606493",
    "new",
  ),
  change(
    "apple-14-beta2-swiftui-container-shape-clipping",
    "Container-relative clipping shapes",
    "ContainerRelativeShape began working when supplied to SwiftUI's clipping modifier.",
    "bugFix",
    "fixed",
    "SwiftUI",
    "64325583",
    "resolved",
  ),
  change(
    "apple-14-beta2-severe-weather-alerts",
    "Expanded severe-weather alerts",
    "Government warnings for selected dangerous weather events expanded across several countries and regions.",
    "feature",
    "introduced",
    "Weather",
    "58931042",
    "new",
  ),
  change(
    "apple-14-beta2-widget-gallery-simulator",
    "Widgets in Simulator gallery",
    "Widgets became visible in the widget gallery while testing with Simulator.",
    "bugFix",
    "fixed",
    "Widgets",
    "64222135",
    "resolved",
  ),
]);

appendChanges(["ios"], "beta-2", [
  change(
    "ios-14-beta2-healthkit-stair-descent-speed",
    "HealthKit stair-descent authorization",
    "Apps could request permission to write the stair-descent-speed quantity type.",
    "developerApi",
    "fixed",
    "HealthKit",
    "64369379",
    "resolved",
  ),
  change(
    "ios-14-beta2-boost-mobile-incoming-calls",
    "Boost Mobile incoming calls",
    "Incoming calls began reaching customers using Boost Mobile.",
    "bugFix",
    "fixed",
    "Phone and FaceTime",
    "64381514",
    "resolved",
  ),
]);

appendChanges(["ipados"], "beta-2", [
  change(
    "ipados-14-beta2-pencilkit-scribble-recovery",
    "Scribble after keyboard setup",
    "Scribble and Copy as Text no longer required restarting an app after enabling a supported Chinese or English keyboard.",
    "bugFix",
    "fixed",
    "PencilKit",
    "64222317",
    "resolved",
  ),
  change(
    "ipados-14-beta2-tmobile-wifi-calling",
    "T-Mobile Wi-Fi Calling on iPad",
    "Regular and emergency Wi-Fi Calling became available to T-Mobile customers using the prerelease Apple operating systems.",
    "enhancement",
    "fixed",
    "Phone and FaceTime",
    "63078572",
    "resolved",
  ),
]);

appendChanges(both, "beta-3", [
  change(
    "apple-14-beta3-sound-recognition-siri-alert",
    "Sound Recognition and Hey Siri notice",
    "Enabling Sound Recognition began warning that hands-free Siri activation would be unavailable.",
    "enhancement",
    "fixed",
    "Accessibility",
    "57295771",
    "resolved",
  ),
  change(
    "apple-14-beta3-avasset-download-options",
    "AVAsset download presentation options",
    "Asset download tasks exposed minimum presentation size and high-dynamic-range selection options.",
    "developerApi",
    "fixed",
    "AVFoundation",
    "64000708",
    "resolved",
  ),
  change(
    "apple-14-beta3-low-latency-hls-webkit",
    "Low-Latency HLS in Safari and WebKit",
    "Safari and WebKit enabled playback of Low-Latency HLS streams.",
    "developerApi",
    "fixed",
    "Core Media",
    "61859389",
    "resolved",
  ),
  change(
    "apple-14-beta3-cllocationmanager-auth-property",
    "Swift location authorization property",
    "CLLocationManager's authorization status became exposed as a Swift property.",
    "developerApi",
    "fixed",
    "Location",
    "62853845",
    "resolved",
  ),
  change(
    "apple-14-beta3-widget-location-entitlement-key",
    "Explicit widget location declaration",
    "Widget extensions needed an Info.plist declaration before they could receive location information.",
    "compatibility",
    "changed",
    "Location",
    "61953645",
    "resolved",
  ),
  change(
    "apple-14-beta3-music-snapchat-sharing",
    "Apple Music sharing to Snapchat",
    "Songs, albums, and playlists from Apple Music gained a Snapchat Stories sharing destination.",
    "feature",
    "introduced",
    "Music",
    "60895397",
    "new",
  ),
  change(
    "apple-14-beta3-http3-draft29",
    "HTTP/3 Draft 29",
    "The networking stack added compatibility with Draft 29 of the developing HTTP/3 specification.",
    "compatibility",
    "introduced",
    "Networking",
    "63524866",
    "resolved",
  ),
  change(
    "apple-14-beta3-realitykit-debug-component-rename",
    "RealityKit debug component rename",
    "RealityKit renamed its model debugging component and associated shader-debug option.",
    "developerApi",
    "changed",
    "RealityKit",
    "64275817",
    "new",
  ),
  change(
    "apple-14-beta3-tracking-preference-persistence",
    "Tracking preference persistence",
    "The system privacy switch for app tracking requests stopped turning itself back on after a user disabled it.",
    "bugFix",
    "fixed",
    "Settings",
    "64168665",
    "resolved",
  ),
  change(
    "apple-14-beta3-shortcuts-app-close-trigger",
    "App-close automation triggers",
    "Shortcuts automations gained a trigger for closing an application.",
    "feature",
    "introduced",
    "Siri",
    "62820498",
    "resolved",
  ),
  change(
    "apple-14-beta3-swiftui-list-scroll-reader",
    "SwiftUI lists with ScrollViewReader",
    "A SwiftUI List could be embedded in a ScrollViewReader for programmatic navigation.",
    "developerApi",
    "introduced",
    "SwiftUI",
    "35471164",
    "new",
  ),
  change(
    "apple-14-beta3-swiftui-formatted-text",
    "Formatter-backed SwiftUI text",
    "SwiftUI Text added initialization from a value and Foundation formatter.",
    "developerApi",
    "introduced",
    "SwiftUI",
    "63641785",
    "new",
  ),
  change(
    "apple-14-beta3-swiftui-menu",
    "SwiftUI Menu controls",
    "SwiftUI added a menu control that reveals actions from a primary button.",
    "developerApi",
    "introduced",
    "SwiftUI",
    "59725999",
    "new",
  ),
  change(
    "apple-14-beta3-translate-on-device-mode",
    "Translate on-device mode",
    "The Translate app enabled a mode that performs supported translations locally.",
    "feature",
    "fixed",
    "Translate",
    "64437614",
    "resolved",
  ),
  change(
    "apple-14-beta3-widget-responsiveness",
    "Widget interaction responsiveness",
    "Widgets stopped entering an unresponsive state.",
    "bugFix",
    "fixed",
    "Widgets",
    "64899088",
    "resolved",
  ),
]);

appendChanges(["ios"], "beta-3", [
  change(
    "ios-14-beta3-voiceover-banner-calls",
    "VoiceOver support for banner calls",
    "VoiceOver users regained the ability to answer calls presented with the compact banner interface.",
    "bugFix",
    "fixed",
    "Accessibility",
    "64858244",
    "resolved",
  ),
  change(
    "ios-14-beta3-verizon-silence-junk-callers",
    "Carrier-identified junk call silencing",
    "A Verizon Call Filter Plus integration could automatically silence calls identified as spam or fraud.",
    "feature",
    "introduced",
    "Phone and FaceTime",
    "58307002",
    "new",
  ),
]);

appendChanges(both, "beta-4", [
  change(
    "apple-14-beta4-app-store-keyboard-crash",
    "App Store Full Keyboard Access stability",
    "The App Store stopped terminating when Full Keyboard Access was active.",
    "bugFix",
    "fixed",
    "App Store",
    "65240690",
    "resolved",
  ),
  change(
    "apple-14-beta4-devicecheck-attestation",
    "DeviceCheck key attestation",
    "DeviceCheck key-attestation requests could complete successfully for DCAppAttestService implementations.",
    "bugFix",
    "fixed",
    "DeviceCheck",
    "55893194",
    "resolved",
  ),
  change(
    "apple-14-beta4-homekit-locked-accessories",
    "Home accessories while locked",
    "HomeKit accessories remained reachable when the controlling device was locked.",
    "bugFix",
    "fixed",
    "HomeKit",
    "65465625",
    "resolved",
  ),
  change(
    "apple-14-beta4-mail-blocked-sender-control",
    "Mail blocked-sender control",
    "Mail restored the Mark Blocked Sender action after an operating-system update.",
    "bugFix",
    "fixed",
    "Mail",
    "65230154",
    "resolved",
  ),
  change(
    "apple-14-beta4-proxy-user-agent-headers",
    "HTTPS proxy request headers",
    "Core networking stopped attaching a custom User-Agent header to CONNECT requests sent through HTTPS proxies.",
    "compatibility",
    "fixed",
    "Networking",
    "64759874",
    "resolved",
  ),
  change(
    "apple-14-beta4-facetime-pip-video",
    "FaceTime video after Picture in Picture",
    "A participant's outgoing video continued instead of pausing after using FaceTime in Picture in Picture.",
    "bugFix",
    "fixed",
    "Phone and FaceTime",
    "65568837",
    "resolved",
  ),
  change(
    "apple-14-beta4-software-update-reliability",
    "Software Update completion",
    "Devices regained the ability to complete a software update successfully.",
    "bugFix",
    "fixed",
    "Software Update",
    "64606517",
    "resolved",
  ),
  change(
    "apple-14-beta4-swiftui-image-redaction",
    "SwiftUI image redaction",
    "SwiftUI images adopted a redacted appearance when their containing view applied a redaction reason.",
    "developerApi",
    "introduced",
    "SwiftUI",
    "65047189",
    "new",
  ),
  change(
    "apple-14-beta4-swiftui-inline-picker",
    "Inline SwiftUI pickers",
    "SwiftUI added a picker style that presents choices directly within the surrounding container.",
    "developerApi",
    "introduced",
    "SwiftUI",
    "59868844",
    "new",
  ),
  change(
    "apple-14-beta4-swiftui-menu-picker",
    "Menu-based SwiftUI pickers",
    "SwiftUI added a picker style that places its choices inside a menu or nested submenu.",
    "developerApi",
    "introduced",
    "SwiftUI",
    "65515392",
    "new",
  ),
  change(
    "apple-14-beta4-swiftui-presentation-environment",
    "Environment inheritance in presentations",
    "Sheets and popovers began inheriting environment values from the view that presents them.",
    "bugFix",
    "fixed",
    "SwiftUI",
    "51827597",
    "resolved",
  ),
  change(
    "apple-14-beta4-swiftui-appearance-callbacks",
    "SwiftUI appearance callback frequency",
    "Navigation links stopped causing repeated on-appear and on-disappear action calls.",
    "bugFix",
    "fixed",
    "SwiftUI",
    "64284131",
    "resolved",
  ),
  change(
    "apple-14-beta4-swiftui-scene-phase",
    "Aggregate SwiftUI scene phase",
    "An application's scenePhase value began reflecting the combined lifecycle state of all its scenes.",
    "developerApi",
    "fixed",
    "SwiftUI",
    "63339201",
    "resolved",
  ),
  change(
    "apple-14-beta4-swiftui-scene-storage",
    "SceneStorage in document and settings scenes",
    "SceneStorage became usable with document groups and settings scenes.",
    "developerApi",
    "fixed",
    "SwiftUI",
    "63676281",
    "resolved",
  ),
  change(
    "apple-14-beta4-widget-quick-actions-layering",
    "Widget Quick Actions layering",
    "The Quick Actions menu began appearing above, rather than behind, the widget overlay.",
    "bugFix",
    "fixed",
    "Widgets",
    "64456466",
    "resolved",
  ),
  change(
    "apple-14-beta4-weather-widget-conditions",
    "Weather widget condition consistency",
    "The Weather widget and Weather app began reporting matching conditions.",
    "bugFix",
    "fixed",
    "Widgets",
    "64948860",
    "resolved",
  ),
  change(
    "apple-14-beta4-widget-automatic-redaction",
    "Automatic widget timeline redaction",
    "Stand-in timeline entries automatically received SwiftUI's redacted presentation.",
    "developerApi",
    "fixed",
    "Widgets",
    "65040472",
    "resolved",
  ),
  change(
    "apple-14-beta4-weather-widget-temperature-units",
    "Weather widget temperature units",
    "Next-day temperature changes stopped switching from Fahrenheit to Celsius unexpectedly.",
    "bugFix",
    "fixed",
    "Widgets",
    "65061840",
    "resolved",
  ),
]);

appendChanges(["ios"], "beta-4", [
  change(
    "ios-14-beta4-3d-touch-restored",
    "3D Touch restored",
    "Pressure-sensitive 3D Touch interactions became available again.",
    "bugFix",
    "fixed",
    "3D Touch",
    "65576619",
    "resolved",
  ),
  change(
    "ios-14-beta4-exposure-notification-availability",
    "Exposure Notification availability",
    "The Exposure Notification capability became available in the prerelease system.",
    "feature",
    "fixed",
    "ExposureNotification",
    "64433241",
    "resolved",
  ),
  change(
    "ios-14-beta4-app-library-rtl-headers",
    "App Library right-to-left layout",
    "App Library section labels moved to the correct positions in right-to-left languages.",
    "bugFix",
    "fixed",
    "Home Screen",
    "63558681",
    "resolved",
  ),
]);

appendChanges(["ipados"], "beta-4", [
  change(
    "ipados-14-beta4-lidar-person-height",
    "Automatic person-height measurement",
    "LiDAR-equipped iPad Pro models gained automatic measurement of a person's height.",
    "feature",
    "fixed",
    "Measure",
    "64613902",
    "resolved",
  ),
  change(
    "ipados-14-beta4-notes-bluetooth-keyboard",
    "Notes pen tools with hardware keyboards",
    "Typing with a Bluetooth keyboard stopped activating drawing tools in Notes.",
    "bugFix",
    "fixed",
    "Notes",
    "65005033",
    "resolved",
  ),
  change(
    "ipados-14-beta4-swiftui-toolbar-hover",
    "iPad toolbar hover effects",
    "SwiftUI toolbar buttons regained their expected pointer-hover appearance on iPad.",
    "bugFix",
    "fixed",
    "SwiftUI",
    "64782084",
    "resolved",
  ),
]);

const platformMetadata = {
  ios: {
    name: "iOS",
    versionId: "version-ios-14-0",
    platformBoundary:
      "Shared SDK and cross-device records are retained alongside entries that explicitly concern iPhone, cellular calling, HealthKit user data, 3D Touch, Exposure Notification, CarPlay, or iOS-only Home Screen behavior. iPad hardware and PencilKit-only claims are excluded.",
  },
  ipados: {
    name: "iPadOS",
    versionId: "version-ipados-14-0",
    platformBoundary:
      "Shared SDK and cross-device records are retained alongside entries that explicitly concern iPad, PencilKit, iPad hardware, or pointer behavior. iPhone-only carrier, HealthKit, CarPlay, 3D Touch, Exposure Notification, and App Library claims are excluded.",
  },
};

const routeMetadata = {
  "beta-1": {
    label: "Beta 1",
    date: "2020-06-22",
    exactHeading: "Updates in iOS & iPadOS 14 beta",
    archiveContext: [U.beta1Shell, U.beta4],
    narrative:
      "The retained baseline introduces StoreKit purchase surfaces, multilingual keyboards, Swift-native logging, HTTP/3 testing, Safari translation, and SwiftUI compatibility changes.",
  },
  "beta-2": {
    label: "Beta 2",
    date: "2020-07-07",
    exactHeading: "Updates in iOS & iPadOS 14 beta 2",
    archiveContext: [U.beta1Shell, U.beta3Shell, U.beta4],
    narrative:
      "The milestone-named section records developer API additions and fixes across accessibility, ARKit, location privacy, Maps, Messages, Shortcuts, SwiftUI, Weather, and widgets.",
  },
  "beta-3": {
    label: "Beta 3",
    date: "2020-07-22",
    exactHeading: "Updates in iOS & iPadOS 14 beta 3",
    archiveContext: [U.beta3Shell, U.beta4],
    narrative:
      "The exact Beta 3 section covers media streaming, location contracts, HTTP/3 compatibility, privacy settings, Shortcuts triggers, SwiftUI controls, Translate, and widget reliability.",
  },
  "beta-4": {
    label: "Beta 4",
    date: "2020-08-04",
    exactHeading: "iOS & iPadOS 14 Beta 4 Release Notes",
    archiveContext: [U.beta4],
    narrative:
      "The self-identifying Beta 4 state adds SwiftUI picker APIs and consolidates fixes across App Store, DeviceCheck, HomeKit, Mail, networking, FaceTime, Software Update, and widgets.",
  },
};

function eventArticle(platform, alias, changes) {
  const route = routeMetadata[alias];
  return article(
    heading("Preserved milestone section"),
    prose(
      `Apple's cumulative Beta 4 document retains an exact “${route.exactHeading}” section. This ${platform.name} page structures ${changes.length} high-signal records from the milestone-named headings rather than treating the full cumulative document as a route delta.`,
      [
        c(
          U.beta4,
          `${route.exactHeading}; archived document title and milestone headings`,
        ),
      ],
    ),
    heading("What this beta documents"),
    prose(
      route.narrative,
      uniqueCitations(changes.flatMap((item) => item.citations)),
    ),
    heading("Platform scope"),
    prose(
      platform.platformBoundary,
      uniqueCitations(changes.flatMap((item) => item.citations)),
    ),
    heading("Archive boundary"),
    prose(
      "Internet Archive retained one raw beta DocC payload on August 10, after Beta 4 and before Beta 5. Its title names Beta 4 and its cumulative body labels Beta 1 through Beta 4 separately. Earlier human-shell captures establish document continuity but do not expose additional raw states, so this page uses only explicitly milestone-named records and does not infer an adjacent-state diff.",
      route.archiveContext.map((url) =>
        c(url, `${route.label} archive chronology and exact-heading boundary`),
      ),
    ),
    heading("Editorial boundary"),
    prose(
      "This article is original synthesis. It preserves Apple issue identifiers as source locators, creates no build records, does not assign generic known issues to a beta, and leaves later prerelease routes unfilled when no milestone-labeled raw evidence survives.",
      [
        c(
          U.installBeta,
          "Beta software, release notes, and Feedback Assistant",
        ),
        c(U.beta4, `${route.label} evidence boundary`),
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
        summary: `${platform.name} 14 ${route.label} is represented by ${changes.length} source-supported changes from Apple's exact milestone headings in the preserved Beta 4 document; later routes and build identities are not inferred.`,
        article: eventArticle(platform, alias, changes),
        citations: uniqueCitations([
          ...route.archiveContext.map((url) =>
            c(url, `${route.label} archive context`),
          ),
          ...changes.flatMap((changeItem) => changeItem.citations),
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
    majorVersion: 14,
    version: "14.0",
    releaseStatus: "released",
    publicReleaseDate: "2020-09-16",
    milestones: [
      ["Beta 1", "2020-06-22", false, undefined],
      ["Beta 2", "2020-07-07", false, undefined],
      ["Beta 3", "2020-07-22", false, undefined],
      ["Beta 4", "2020-08-04", false, undefined],
      ["Beta 5", "2020-08-18", false, undefined],
      ["Beta 6", "2020-08-25", false, undefined],
      ["Beta 7", "2020-09-03", false, undefined],
      ["Beta 8", "2020-09-09", false, undefined],
      ["GM", "2020-09-15", false, undefined],
      ["Public", "2020-09-16", false, undefined],
    ],
  },
  {
    platform: "iPadOS",
    majorVersion: 14,
    version: "14.0",
    releaseStatus: "released",
    publicReleaseDate: "2020-09-16",
    milestones: [
      ["Beta 1", "2020-06-22", false, undefined],
      ["Beta 2", "2020-07-07", false, undefined],
      ["Beta 3", "2020-07-22", false, undefined],
      ["Beta 4", "2020-08-04", false, undefined],
      ["Beta 5", "2020-08-18", false, undefined],
      ["Beta 6", "2020-08-25", false, undefined],
      ["Beta 7", "2020-09-03", false, undefined],
      ["Beta 8", "2020-09-09", false, undefined],
      ["GM", "2020-09-15", false, undefined],
      ["Public", "2020-09-16", false, undefined],
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
      version.version === "14.0" &&
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
    "The exact local iOS/iPadOS 14.0 seed inventory changed; re-audit the cohort before regenerating.",
  );
}

const expectedRoutes = new Set([
  "version-ios-14-0/beta-1",
  "version-ios-14-0/beta-2",
  "version-ios-14-0/beta-3",
  "version-ios-14-0/beta-4",
  "version-ipados-14-0/beta-1",
  "version-ipados-14-0/beta-2",
  "version-ipados-14-0/beta-3",
  "version-ipados-14-0/beta-4",
]);
const expectedRouteCounts = new Map([
  ["version-ios-14-0/beta-1", 15],
  ["version-ios-14-0/beta-2", 18],
  ["version-ios-14-0/beta-3", 17],
  ["version-ios-14-0/beta-4", 21],
  ["version-ipados-14-0/beta-1", 12],
  ["version-ipados-14-0/beta-2", 18],
  ["version-ipados-14-0/beta-3", 15],
  ["version-ipados-14-0/beta-4", 21],
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
  changeCount !== 137 ||
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
      event.changes.some((changeItem) =>
        /seed-identity|testflight|build-identity|administrative/i.test(
          changeItem.key,
        ),
      ),
  )
) {
  throw new Error(
    "The expected iOS/iPadOS 14 prerelease bundle closure failed.",
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
      `iOS/iPadOS 14 change definition drifted for ${occurrence.key}.`,
    );
  }
  localChangeDefinitions.set(occurrence.key, definition);
}
const uniqueLocalChangeKeys = [...localChangeDefinitions.keys()];
if (uniqueLocalChangeKeys.length !== 76) {
  throw new Error(
    `Expected 76 stable iOS/iPadOS 14 prerelease definitions; found ${uniqueLocalChangeKeys.length}.`,
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
    for (const changeItem of owner.changes || []) {
      if (!otherChangeKeys.has(changeItem.key)) {
        otherChangeKeys.set(changeItem.key, file);
      }
    }
  }
}
const collisions = uniqueLocalChangeKeys.filter((key) =>
  otherChangeKeys.has(key),
);
if (collisions.length > 0) {
  throw new Error(
    `iOS/iPadOS 14 prerelease change keys collide with existing content: ${collisions
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
    return `| \`/apple/${platform}/14.0/${event.target.routeAlias}/\` | 200 | yes | yes | yes | yes |`;
  })
  .join("\n");
const sourceLedger = sources
  .map(
    (source) =>
      `- [${source.title}](${source.url}) — ${source.publisher}; ${source.sourceClass}.`,
  )
  .join("\n");

const md = `# Apple iOS and iPadOS 14 prerelease archive batch

## Result

\`${outputName}\` publishes primary-source-backed archival articles for eight
existing iOS and iPadOS 14.0 routes: Beta 1 through Beta 4 on each platform.

- ${events.length} substantive event overlays and no release-version overlays
- ${changeCount} change occurrences across ${uniqueLocalChangeKeys.length}
  stable, collision-checked definitions
- ${sources.length} declared and used sources with ${citationCount} citation
  references
- zero builds, build-number claims, route creation, GM changes, Public-route
  changes, or administrative identity changes
- every event is \`editoriallyVerified\`, \`approved\`, and
  \`isIndexable: true\`, with review timestamp \`${reviewedAt}\`

## Published route closure

| Platform | Milestone | Existing alias | Selected changes |
| --- | --- | --- | ---: |
${routeRows}

The local seed contains 20 iOS/iPadOS 14.0 milestones. This batch publishes
only the eight routes above. Beta 5, Beta 6, Beta 7, Beta 8, GM, and Public
remain outside this prerelease archive pass.

## Archive method

1. An uncollapsed Internet Archive CDX query was run over the Apple Developer
   iOS/iPadOS release-note DocC prefix for calendar year 2020.
2. That inventory returns one raw 14.0 beta payload:
   \`20200810155919\`, captured after Beta 4 and before Beta 5. Its decoded title
   is “iOS & iPadOS 14 Beta 4 Release Notes.”
3. The cumulative payload explicitly separates “Updates in iOS & iPadOS 14
   beta,” beta 2, and beta 3, while its leading section is the Beta 4 state.
   Records were parsed by component, exact milestone-named status heading, and
   issue ID.
4. Because no adjacent raw states survive, no diff is claimed. Attribution is
   limited to records under exact “New Features in … beta N” or “Resolved in …
   beta N” headings.
5. Generic known issues, unlabeled cumulative records, bounty administration,
   records without issue IDs, and milestones after Beta 4 were excluded.
6. Shared Apple documentation was not treated as blanket cross-platform proof.
   Explicit iPhone, cellular, HealthKit, CarPlay, 3D Touch, Exposure
   Notification, App Library, PencilKit, and iPad hardware language determines
   route scope.

## Selected findings

### Beta 1 baseline

The representative initial set covers StoreKit installation and sandbox
controls, stereo audio input, multilingual keyboards, Swift-native logging,
HTTP/3 testing, Safari translation, SwiftUI alignment, and Voice Control.
iOS additionally retains HealthKit, ECG, and CarPlay records.

### Beta 2 milestone headings

The exact Beta 2 headings support accessibility, ARKit, haptics, location
privacy, Maps, Messages, Screen Time, Siri, SwiftUI, Weather, and widget
changes. HealthKit and carrier calling remain iOS-only; PencilKit and the
explicit iPad calling workflow remain iPadOS-only.

### Beta 3 milestone headings

The exact Beta 3 headings cover AVFoundation, Low-Latency HLS, location
contracts, Apple Music sharing, HTTP/3 compatibility, RealityKit, tracking
privacy, Shortcuts, SwiftUI, Translate, and widgets. Compact-banner calling and
carrier junk-call filtering remain iOS-only.

### Beta 4 milestone headings

The self-identifying Beta 4 state covers App Store, DeviceCheck, HomeKit, Mail,
networking, FaceTime, Software Update, SwiftUI, and widget repairs. iOS carries
3D Touch, Exposure Notification, and App Library records; iPadOS carries
LiDAR measurement, Notes keyboard interaction, and pointer-hover records.

## Raw snapshot audit ledger

The decoded SHA-256 is calculated over the payload serialized by
\`JSON.stringify\`, matching \`audit-docc-snapshots.mjs\`.

| State | Raw capture | CDX digest | CDX length | DocC title | Records | Decoded SHA-256 | Public citation |
| --- | --- | --- | ---: | --- | ---: | --- | --- |
| Beta 4 cumulative | \`20200810155919\` | \`U7B55MEXFADXH6ECPNFWD4L4QZP7JZK3\` | 21,469 | iOS & iPadOS 14 Beta 4 Release Notes | 172 | \`6c1f155a00def504d5ff7b01852570f598a6457aa19cecad35e196198f9923fc\` | [Apple page](${U.beta4}) |

Exact raw replay: [Apple DocC transport payload](${U.beta4Transport}).

Sequential calendar checks:

- Beta 1 (June 22) precedes the retained July 3 human shell, which precedes
  Beta 2 (July 7).
- Beta 3 (July 22) precedes the retained July 26 human shell, which precedes
  Beta 4 (August 4).
- Beta 4 precedes both the August 7 human shell and August 10 raw payload; the
  raw payload precedes Beta 5 (August 18).
- The sole raw state crosses earlier milestones, so exact milestone headings,
  not capture chronology or a synthetic diff, are the attribution boundary.

## Exact evidence gaps

- CDX returns no raw 14.0 beta state before August 10 and no later 14.0 beta
  state. Earlier human shells do not expose an independently retained payload.
- Beta 2 is not isolated by adjacent captures. Its entries are used only when
  the retained body names Beta 2 in the exact status heading.
- Beta 5 through Beta 8 and GM have no retained milestone-labeled raw state in
  the audited prefix inventory, so they remain ledger-only gaps.
- Public is already owned by \`apple-ios-ipados-14.json\` and is untouched.
- No complete first-party build-number set was independently retained. The
  batch creates no build documents and makes no build assertions.

## Source ledger

All declared sources were accessed on ${accessedAt}.

${sourceLedger}

## Closure guards

- Exact comparison against both local 14.0 seed records and all 20 milestones
- Exact eight-route allowlist with explicit exclusion of Public and every
  unsupported later prerelease route
- Zero versions and zero builds
- Collision scan across every other research-batch JSON plus
  \`apple-launch-content-2026.json\`
- ${changeCount} occurrences resolve to exactly
  ${uniqueLocalChangeKeys.length} stable local definitions
- Explicit rejection of identity, build, TestFlight, and administrative keys
- Complete unique source declaration/use closure
- Deterministic formatted JSON SHA-256: \`${jsonSha}\`

## Publication and validation record

The generator's seed, route, collision, review-state, exact-heading, and
citation guards pass before either artifact is written.

Independent editorial and evidence review:

- the sole retained raw payload was independently replayed; its title,
  172-record count, and decoded SHA-256 matched this ledger exactly
- all ${changeCount} occurrence checks and 139 issue-ID assertions matched the
  exact component and milestone-named status heading in the retained raw state
- the independent reader-facing copyright scan found a maximum contiguous
  overlap of 6 words between editorial fields and Apple's retained records
- all eight event articles and all ${changeCount} occurrences were approved at
  \`${reviewedAt}\`

Publication receipt:

- applied production plan: \`${publication.planSha}\`
- reviewed plan artifact SHA-256: \`${publication.planArtifactSha}\`
- rollback artifact SHA-256: \`${publication.rollbackArtifactSha}\`
- Sanity transaction: \`${publication.transactionId}\`
- receipt SHA-256: \`${publication.receiptSha}\`
- immediate post-publication zero plan:
  \`${publication.immediateZeroPlanSha}\`; zero mutations,
  ${publication.immediateZeroUnchanged.toLocaleString("en-US")} unchanged
  documents, and a ${publication.immediateZeroPayloadBytes}-byte mutation
  payload
- zero-plan artifact SHA-256:
  \`${publication.immediateZeroPlanArtifactSha}\`

Production coverage after publication:

- 410 of 410 release versions have full version-level coverage
- 1,979 appearances: 369 full articles, 256 source-linked records, and 1,354
  timeline-only records
- 520 appearances have approved structured changes

## Settled canonical route verification

Every published route was fetched independently from the running local site.
Each response returned the full archival article, the “Preserved milestone
section,” References, and \`index, follow\`; none returned a timeline
placeholder or \`noindex\`.

| Canonical route | HTTP | Full article | Evidence | References | Index |
| --------------- | ---: | ------------ | -------- | ---------- | ----- |
${renderRows}

Final verification on ${accessedAt}:

- \`npm run research:validate\`: 52 batches validated; this batch reports 8
  events, ${changeCount} change occurrences, ${sources.length} sources, and
  ${citationCount} citation references; 2,775 change keys remain globally
  consistent
- full repository suite: 131 tests passed
- all 137 occurrence-level heading checks and 139 issue-ID assertions passed
- independent copyright-similarity scan: maximum contiguous overlap of 6 words
- ESLint, Prettier check, and focused \`git diff --check\`: passed
- deterministic regeneration: the formatted JSON SHA-256 is \`${jsonSha}\`
- final production dry run reproduced zero mutations,
  ${publication.immediateZeroUnchanged.toLocaleString("en-US")} unchanged
  documents, the ${publication.immediateZeroPayloadBytes}-byte payload, and
  plan SHA \`${publication.immediateZeroPlanSha}\`
- the final planner reported “No Sanity data changed”

Reproduce with:

\`\`\`sh
node scripts/research-batches/build-apple-ios-ipados-14-prerelease.mjs
npm run research:validate
node --import tsx --test tests/launch-content-ingestion.test.ts tests/launch-content-manifest.test.ts
npx eslint scripts/research-batches/build-apple-ios-ipados-14-prerelease.mjs
npx prettier --check scripts/research-batches/build-apple-ios-ipados-14-prerelease.mjs scripts/research-batches/apple-ios-ipados-14-prerelease.json scripts/research-batches/apple-ios-ipados-14-prerelease.md
npx sanity exec scripts/ingest-launch-content.ts --with-user-token -- --content scripts/research-batches/apple-ios-ipados-14-prerelease.json
\`\`\`

The final command is intentionally a post-publication dry run and must
reproduce the zero plan above. Do not add \`--apply\`.
`;

const formattedMd = await prettier.format(md, { filepath: ledgerName });
writeFileSync(join(here, ledgerName), formattedMd);
