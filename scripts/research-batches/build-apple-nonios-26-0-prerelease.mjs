import { createHash } from "node:crypto";
import { readdir, readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import prettier from "prettier";

const directory = dirname(fileURLToPath(import.meta.url));
const seedPath = join(directory, "..", "seed-data.json");
const launchManifestPath = join(
  directory,
  "..",
  "apple-launch-content-2026.json",
);
const jsonPath = join(directory, "apple-nonios-26-0-prerelease.json");
const ledgerPath = join(directory, "apple-nonios-26-0-prerelease.md");
const outputFile = "apple-nonios-26-0-prerelease.json";
const reviewedAt = "2026-07-30T07:35:34Z";
const publicationReceipt = {
  reviewedPlan:
    "c471f97198121aa37e415bd6a7cad23e774b8cb2b2c4d0d8a865243183edc210",
  planArtifact:
    "acd9c5073707412c529d8a1eec087fa9c51662dcd3ea6596582edfd974cf7bb9",
  rollback: "f3e6c6fdc25da8620f09d66896330c6f694a86c7ad617c0fbb18f77a79801e14",
  transaction: "F0eE6eK5XyVXtlnaoy9OAO",
  receipt: "54132f88aa673a287b0fdb6dd4233e684699899772acf6a189ba30cf17d0f831",
  zeroPlan: "041be249b29c71ee390194eb701759d4bb3f9b4af7cb7b8b662db9c2535c5f9f",
};

const platformPaths = {
  macos: "macos-release-notes/macos-26-release-notes",
  tvos: "tvos-release-notes/tvos-26-release-notes",
  visionos: "visionos-release-notes/visionos-26-release-notes",
  watchos: "watchos-release-notes/watchos-26-release-notes",
};

function humanArchiveUrl(timestamp, path) {
  return `https://web.archive.org/web/${timestamp}/https://developer.apple.com/documentation/${path}`;
}

function rawArchiveUrl(timestamp, path) {
  return `https://web.archive.org/web/${timestamp}id_/https://developer.apple.com/tutorials/data/documentation/${path}.json`;
}

const evidence = {
  macosBeta1: {
    platform: "macOS",
    milestone: "Beta 1",
    humanTimestamp: "20250609212701",
    rawTimestamp: "20250609212708",
    path: platformPaths.macos,
    rawTitle: "macOS Tahoe 26 Beta Release Notes",
  },
  macosBeta2: {
    platform: "macOS",
    milestone: "Beta 2",
    humanTimestamp: "20250703030442",
    rawTimestamp: "20250703030443",
    path: platformPaths.macos,
    rawTitle: "macOS Tahoe 26 Beta 2 Release Notes",
  },
  macosBeta3: {
    platform: "macOS",
    milestone: "Beta 3",
    humanTimestamp: "20250709070218",
    rawTimestamp: "20250713024323",
    path: platformPaths.macos,
    rawTitle: "macOS Tahoe 26 Beta 3 Release Notes",
  },
  macosBeta4: {
    platform: "macOS",
    milestone: "Beta 4",
    humanTimestamp: "20250726224626",
    rawTimestamp: "20250727152747",
    path: platformPaths.macos,
    rawTitle: "macOS Tahoe 26 Beta 4 Release Notes",
  },
  macosBeta5: {
    platform: "macOS",
    milestone: "Beta 5",
    humanTimestamp: "20250806092738",
    rawTimestamp: "20250806092740",
    path: platformPaths.macos,
    rawTitle: "macOS Tahoe 26 Beta 5 Release Notes",
  },
  tvosBeta1: {
    platform: "tvOS",
    milestone: "Beta 1",
    humanTimestamp: "20250616183649",
    rawTimestamp: "20250616183650",
    path: platformPaths.tvos,
    rawTitle: "tvOS 26 Beta Release Notes",
  },
  visionosBeta1: {
    platform: "visionOS",
    milestone: "Beta 1",
    humanTimestamp: "20250609220322",
    rawTimestamp: "20250609220324",
    path: platformPaths.visionos,
    rawTitle: "visionOS 26 Beta Release Notes",
  },
};

for (const item of Object.values(evidence)) {
  item.url = humanArchiveUrl(item.humanTimestamp, item.path);
  item.rawUrl = rawArchiveUrl(item.rawTimestamp, item.path);
  item.source = {
    url: item.url,
    title: `Archived ${item.rawTitle} — ${item.rawTimestamp} raw state`,
    publisher: "Apple Developer",
    sourceClass: "archive",
    topics: [
      "Apple Developer",
      item.platform,
      "26.0",
      item.milestone,
      "Internet Archive",
      "DocC snapshot",
    ],
  };
}

const macosBeta1Specs = [
  {
    suffix: "app-store-accessibility-labels",
    title: "App Store accessibility feature labels",
    canonicalSummary:
      "App Store product pages gained a section where developers can disclose supported accessibility features.",
    category: "feature",
    action: "introduced",
    locator: "App Store — New Features; issue 138344118",
    summary:
      "The first archived beta state introduces accessibility information on product pages so customers can review supported capabilities before downloading.",
  },
  {
    suffix: "foundation-models-access",
    title: "On-device Foundation Models framework access",
    canonicalSummary:
      "The Foundation Models framework exposed direct application access to the on-device model used by Apple Intelligence.",
    category: "developerApi",
    action: "introduced",
    locator: "Apple Intelligence — New Features; issue 139996377",
    summary:
      "The initial beta notes identify direct on-device model access as a new developer capability.",
  },
  {
    suffix: "asif-disk-images",
    title: "Apple Sparse Image Format support",
    canonicalSummary:
      "macOS added Apple Sparse Image Format support for space-efficient disk images, including virtual-machine storage.",
    category: "developerApi",
    action: "introduced",
    locator: "Disk Images — New Features; issue 152040832",
    summary:
      "The archived state introduces ASIF images through Disk Utility and diskutil, with virtual-machine backing storage among the documented uses.",
  },
  {
    suffix: "metal-4",
    title: "Metal 4 support",
    canonicalSummary:
      "The macOS 26 SDK added support for the Metal 4 graphics API generation.",
    category: "developerApi",
    action: "introduced",
    locator: "Metal — New Features; issue 113781091",
    summary:
      "Metal 4 appears as a new capability in the first retained macOS 26 beta note state.",
  },
  {
    suffix: "ikev2-legacy-algorithms",
    title: "Legacy IKEv2 algorithm removal",
    canonicalSummary:
      "IKEv2 stopped supporting DES, 3DES, SHA-1 variants, and Diffie-Hellman groups below 14.",
    category: "security",
    action: "removed",
    locator: "NetworkExtension — Deprecations; issue 148767790",
    summary:
      "The beta documentation removes several obsolete cryptographic choices from supported IKEv2 configurations.",
  },
  {
    suffix: "nslog-private-redaction",
    title: "NSLog unified-log privacy redaction",
    canonicalSummary:
      "Dynamic NSLog format arguments are redacted when they enter Unified Logging unless an explicit logging API is used.",
    category: "security",
    action: "changed",
    locator: "NSLog — New Features; issue 137129180",
    summary:
      "The initial state documents private redaction for dynamic NSLog data in Unified Logging while distinguishing console and standard-output behavior.",
  },
  {
    suffix: "nstextview-audio-attachments",
    title: "Inline audio playback in NSTextView",
    canonicalSummary:
      "NSTextView gained inline playback for supported sound-file text attachments.",
    category: "developerApi",
    action: "introduced",
    locator: "NSTextView — New Features; issue 140224296",
    summary:
      "The archived note introduces AVPlayer-backed playback for compatible audio attachments in text views.",
  },
  {
    suffix: "storekit-offer-apis",
    title: "StoreKit one-time and signed promotional offers",
    canonicalSummary:
      "StoreKit added a one-time offer payment mode and JWS-backed promotional-offer purchase options.",
    category: "developerApi",
    action: "introduced",
    locator: "StoreKit — New Features; issues 142501142 and 143395736",
    summary:
      "The first beta state expands offer-code payment modes and adds signed promotional-offer APIs, including SwiftUI integration.",
  },
  {
    suffix: "tls-default-minimum",
    title: "TLS 1.2 default minimum for newly linked apps",
    canonicalSummary:
      "Applications linked against the new SDK use TLS 1.2 rather than TLS 1.0 as the default minimum in URLSession and Network.",
    category: "security",
    action: "changed",
    locator: "Security — Deprecations; issue 135996267",
    summary:
      "The beta note raises the default transport-security floor for newly linked applications while documenting explicit compatibility APIs.",
  },
  {
    suffix: "swiftui-find-controls",
    title: "SwiftUI TextEditor Find controls",
    canonicalSummary:
      "SwiftUI added modifiers for presenting and disabling find and replace behavior in TextEditor.",
    category: "developerApi",
    action: "introduced",
    locator: "SwiftUI — New Features; issue 85308161",
    summary:
      "The initial beta state adds direct SwiftUI control over the macOS TextEditor Find Bar and replacement availability.",
  },
];

const tvosBeta1Specs = [
  {
    suffix: "app-store-accessibility-labels",
    title: "App Store accessibility feature labels",
    canonicalSummary:
      "App Store product pages gained a section where developers can disclose supported accessibility features.",
    category: "feature",
    action: "introduced",
    locator: "App Store — New Features; issue 138344118",
    summary:
      "The first archived tvOS state includes accessibility information intended to help customers understand supported app features before downloading.",
  },
  {
    suffix: "background-assets-beta-reliability",
    title: "Background Assets beta reliability limitations",
    canonicalSummary:
      "Apple documented update, download, status-delivery, installation, and development-override limitations for Background Assets.",
    category: "knownIssue",
    action: "knownIssue",
    locator:
      "Background Assets — Known Issues; issues 143281558, 151498902, 151647839, 151942388, and 152131750",
    summary:
      "The initial state groups the retained Background Assets limitations while preserving their individual Apple issue identifiers.",
  },
  {
    suffix: "metal-4",
    title: "Metal 4 support",
    canonicalSummary:
      "The tvOS 26 SDK added support for the Metal 4 graphics API generation.",
    category: "developerApi",
    action: "introduced",
    locator: "Metal — New Features; issue 113781091",
    summary:
      "Metal 4 appears as a new capability in the first retained tvOS 26 beta note state.",
  },
  {
    suffix: "airplay-stereo-pair",
    title: "AirPlay stereo-pair playback limitation",
    canonicalSummary:
      "AirPlay playback to a stereo pair could fail after Home Theater grouping changed.",
    category: "knownIssue",
    action: "knownIssue",
    locator: "Playback — Known Issues; issue 152107026",
    summary:
      "The beta note records a stereo-pair playback failure after creating or removing a Home Theater group.",
  },
  {
    suffix: "realitykit-camera-entity-lookup",
    title: "RealityKit tvOS camera-entity lookup limitation",
    canonicalSummary:
      "RealityViewCameraContent entity lookup did not work correctly on tvOS.",
    category: "knownIssue",
    action: "knownIssue",
    locator: "RealityKit — Known Issues; issue 148920446",
    summary:
      "The first archived state identifies incorrect entity lookup from RealityView camera content on tvOS.",
  },
  {
    suffix: "storekit-offer-apis",
    title: "StoreKit one-time and signed promotional offers",
    canonicalSummary:
      "StoreKit added a one-time offer payment mode and JWS-backed promotional-offer purchase options.",
    category: "developerApi",
    action: "introduced",
    locator: "StoreKit — New Features; issues 142501142 and 143395736",
    summary:
      "The first beta state expands offer-code payment modes and adds signed promotional-offer APIs, including SwiftUI integration.",
  },
  {
    suffix: "swiftui-tvos-control-size",
    title: "SwiftUI ControlSize adaptation on tvOS",
    canonicalSummary:
      "Custom tvOS SwiftUI views gained access to ControlSize modifiers and environment values.",
    category: "developerApi",
    action: "introduced",
    locator: "SwiftUI — New Features; issue 145237287",
    summary:
      "The beta documentation adds ControlSize-based adaptation for custom tvOS views.",
  },
  {
    suffix: "legacy-apple-tv-design-limit",
    title: "tvOS 26 design limitation on older Apple TV models",
    canonicalSummary:
      "The tvOS 26 design updates were not available for testing on first-generation Apple TV 4K and older hardware.",
    category: "knownIssue",
    action: "knownIssue",
    locator: "SwiftUI and UIKit — Known Issues; issue 152111626",
    summary:
      "Apple limits the beta's new design treatment to second- and third-generation Apple TV 4K hardware for testing.",
  },
];

const visionosBeta1Specs = [
  {
    suffix: "foundation-models-access",
    title: "On-device Foundation Models framework access",
    canonicalSummary:
      "The Foundation Models framework exposed direct application access to the on-device model used by Apple Intelligence.",
    category: "developerApi",
    action: "introduced",
    locator: "Apple Intelligence — New Features; issue 139996377",
    summary:
      "The initial visionOS beta notes identify direct on-device model access as a new developer capability.",
  },
  {
    suffix: "arkit-accessory-tracking",
    title: "ARKit accessory-tracking beta limitations",
    canonicalSummary:
      "Accessory Tracking had documented limitations in Travel Mode and in controller point-of-interest metadata.",
    category: "knownIssue",
    action: "knownIssue",
    locator: "ARKit — Known Issues; issues 152264297, 152304770, and 152335557",
    summary:
      "The first archived state groups Travel Mode and controller point-of-interest limitations for the new accessory-tracking workflows.",
  },
  {
    suffix: "background-assets-beta-reliability",
    title: "Background Assets beta reliability limitations",
    canonicalSummary:
      "Apple documented update, download, status-delivery, and installation limitations for Background Assets.",
    category: "knownIssue",
    action: "knownIssue",
    locator:
      "Background Assets — Known Issues; issues 143281558, 151498902, 151647839, and 151942388",
    summary:
      "The initial visionOS state groups the retained Background Assets limitations while preserving their individual Apple issue identifiers.",
  },
  {
    suffix: "remote-immersive-session-stability",
    title: "Remote immersive-session stability limitations",
    canonicalSummary:
      "Remote immersive streaming could end on poor connectivity or conflict with an already-open immersive space.",
    category: "knownIssue",
    action: "knownIssue",
    locator:
      "RemoteImmersiveSpace — Known Issues; issues 149237275 and 151897819",
    summary:
      "The initial state records two representative session-ending cases involving connection quality and existing immersive content.",
  },
  {
    suffix: "storekit-subscription-offer-view",
    title: "StoreKit SubscriptionOfferView",
    canonicalSummary:
      "StoreKit added a SwiftUI view for presenting auto-renewable subscription offers.",
    category: "developerApi",
    action: "introduced",
    locator: "StoreKit — New Features; issue 145251635",
    summary:
      "The beta notes introduce a dedicated SwiftUI merchandising view for auto-renewable subscriptions.",
  },
  {
    suffix: "chart3d-rendering-style",
    title: "Chart3D rendering-style limitation",
    canonicalSummary:
      "The chart3DRenderingStyle modifier was nonfunctional in the initial visionOS 26 beta.",
    category: "knownIssue",
    action: "knownIssue",
    locator: "Swift Charts — Known Issues; issue 150430199",
    summary:
      "Apple documents the 3D chart rendering-style modifier as unavailable in the first retained beta state.",
  },
  {
    suffix: "swiftui-breakthrough-effects",
    title: "SwiftUI breakthrough effects",
    canonicalSummary:
      "SwiftUI added effects that can keep selected content visible through occluding spatial content.",
    category: "developerApi",
    action: "introduced",
    locator: "SwiftUI — New Features; issue 142705695",
    summary:
      "The initial state introduces view and presentation breakthrough effects for spatial interfaces.",
  },
  {
    suffix: "tabletopkit-custom-actions-state",
    title: "TabletopKit custom actions and equipment state",
    canonicalSummary:
      "TabletopKit added custom multi-step actions and custom data for equipment states.",
    category: "developerApi",
    action: "introduced",
    locator: "TabletopKit — New Features; issues 150326238 and 150762229",
    summary:
      "The beta notes add lower-traffic custom actions and application-defined state for tabletop equipment.",
  },
  {
    suffix: "mv-hevc-decoding-crash",
    title: "MV-HEVC decoding-crash limitation",
    canonicalSummary:
      "MV-HEVC decoding errors could terminate the controlling process and interrupt video playback.",
    category: "knownIssue",
    action: "knownIssue",
    locator: "Video Toolbox — Known Issues; issue 152060939",
    summary:
      "The first retained state documents a process crash or playback interruption following MV-HEVC decode failures.",
  },
  {
    suffix: "widgetkit-texture-mounting",
    title: "WidgetKit texture and mounting-style limitations",
    canonicalSummary:
      "Widget texture and supported-mounting-style modifiers did not affect rendered widgets or configuration UI.",
    category: "knownIssue",
    action: "knownIssue",
    locator: "WidgetKit — Known Issues; issues 151808588 and 151808744",
    summary:
      "The initial beta note identifies two WidgetKit modifiers that were ignored in rendering and configuration.",
  },
];

const macosSequential = [
  {
    milestone: "Beta 2",
    alias: "beta-2",
    before: "macosBeta1",
    after: "macosBeta2",
    addedLines: 43,
    removedLines: 25,
    specs: [
      {
        suffix: "recovery-assistant",
        title: "Recovery Assistant",
        canonicalSummary:
          "Recovery Assistant added an automated path for diagnosing and attempting to repair a Mac that cannot start normally.",
        category: "feature",
        action: "introduced",
        locator: "General — New Features; issue 151856202",
        summary:
          "Beta 2 adds a recovery workflow that can inspect startup problems and attempt supported repairs.",
      },
      {
        suffix: "agl-sdk-removal",
        title: "AGL SDK removal",
        canonicalSummary:
          "The obsolete AGL interface was removed from the macOS SDK and its remaining symbols became inert.",
        category: "removal",
        action: "removed",
        locator: "AGL — Deprecations; issue 153913819",
        summary:
          "The Beta 2 diff removes the legacy Carbon-era OpenGL presentation interface from usable SDK surface.",
      },
      {
        suffix: "passkey-immediate-registration",
        title: "Immediately available passkey registration",
        canonicalSummary:
          "AuthenticationServices immediate-credential preference began applying to passkey registration requests.",
        category: "developerApi",
        action: "introduced",
        locator: "AuthenticationServices — New Features; issue 150688929",
        summary:
          "Beta 2 extends the immediate-availability request option to passkey registration and suppresses UI unless a credential is immediately available.",
      },
      {
        suffix: "background-assets-fixes",
        title: "Background Assets reliability fixes",
        canonicalSummary:
          "Beta 2 resolved documented Background Assets update, download, status, and paused-install failures.",
        category: "bugFix",
        action: "fixed",
        locator:
          "Background Assets — Resolved Issues; issues 143281558, 151498902, 151647839, and 151942388",
        summary:
          "Four Beta 1 limitations move to Resolved Issues in the clean Beta 2 snapshot diff.",
      },
      {
        suffix: "foundation-models-resolved",
        title: "Foundation Models availability and rate-limit fixes",
        canonicalSummary:
          "Beta 2 fixed schema-prompt handling, Playground rate limiting, and Mac Catalyst import availability in Foundation Models.",
        category: "bugFix",
        action: "fixed",
        locator:
          "Foundation Models framework — Resolved Issues; issues 151926006, 152325506, 153255533, and FB18004324",
        summary:
          "The Beta 2 state resolves three retained framework failures spanning schema prompts, Playground requests, and Catalyst builds.",
      },
      {
        suffix: "foundation-models-known",
        title: "Foundation Models command-line and macro limitations",
        canonicalSummary:
          "Beta 2 documented rate limiting in command-line and powered-device use plus a Generable visibility limitation.",
        category: "knownIssue",
        action: "knownIssue",
        locator:
          "Foundation Models framework — Known Issues; issues 152681332, 153216183, FB17990794, and 153216632",
        summary:
          "The clean diff adds three framework limitations and preserves their separate issue identifiers.",
      },
      {
        suffix: "rosetta-dependency-test",
        title: "Rosetta dependency testing boot argument",
        canonicalSummary:
          "A nox86exec boot argument allowed developers to test whether applications still depended on Rosetta.",
        category: "developerApi",
        action: "introduced",
        locator: "Rosetta — New Features; issue 136764433",
        summary:
          "Beta 2 adds an explicit failure mode for processes that would otherwise require Rosetta, enabling compatibility testing.",
      },
      {
        suffix: "textkit-natural-alignment",
        title: "TextKit natural-alignment resolution APIs",
        canonicalSummary:
          "TextKit added APIs for resolving natural and justified alignment into concrete leading or trailing alignment.",
        category: "developerApi",
        action: "introduced",
        locator: "TextKit — New Features; issue 152045248",
        summary:
          "The Beta 2 state introduces explicit alignment-resolution behavior shared across the OS 26 SDK family.",
      },
      {
        suffix: "separate-spaces-login-crash",
        title: "Separate Spaces login-crash known issue",
        canonicalSummary:
          "Disabling separate Spaces for displays could cause WindowServer to crash at login.",
        category: "knownIssue",
        action: "knownIssue",
        locator: "Settings — Known Issues; issue 153570422",
        summary:
          "Beta 2 documents a login-time WindowServer crash and a Recovery-based preference workaround.",
      },
      {
        suffix: "system-app-fixes",
        title: "Beta 2 system and application reliability fixes",
        canonicalSummary:
          "Beta 2 moved a set of Apple Intelligence, CloudKit, Finder, full-screen, Maps, Messages, Metal, RealityKit, login, setup, Siri, and Weather issues to resolved status.",
        category: "bugFix",
        action: "fixed",
        locator:
          "Resolved Issues diff; issues 151833204, 152468267, 148633307, 151778655, 152193702, 151266898, 150947515, 149401758, 149450560, 149263281, 152201501, 152456435, 151268030, 147787689, 151682699, and 152088799",
        summary:
          "This grouped occurrence preserves the issue-ID status transitions confirmed by the Beta 1-to-Beta 2 archive diff without reproducing Apple's individual notes.",
      },
    ],
  },
  {
    milestone: "Beta 3",
    alias: "beta-3",
    before: "macosBeta2",
    after: "macosBeta3",
    addedLines: 24,
    removedLines: 16,
    specs: [
      {
        suffix: "app-store-update-hang",
        title: "App Store iPhone and iPad app update-hang fix",
        canonicalSummary:
          "Beta 3 fixed stalled App Store updates for iPhone and iPad applications running on Mac.",
        category: "bugFix",
        action: "fixed",
        locator: "App Store — Resolved Issues; issue 152878930",
        summary:
          "The App Store progress hang moves from Known Issues to Resolved Issues at the clean Beta 3 boundary.",
      },
      {
        suffix: "background-assets-install-fixes",
        title: "Background Assets essential-pack installation fixes",
        canonicalSummary:
          "Beta 3 fixed premature app availability and failed installation for essential or large asset packs.",
        category: "bugFix",
        action: "fixed",
        locator:
          "Background Assets — Resolved Issues; issues 151709449 and 153128086",
        summary:
          "Two Background Assets installation limitations move to resolved status in the Beta 3 payload.",
      },
      {
        suffix: "foundation-models-fixes",
        title: "Foundation Models naming, rate, and visibility fixes",
        canonicalSummary:
          "Beta 3 resolved custom Generable naming, command-line rate limiting, public macro visibility, and powered-device rate limiting.",
        category: "bugFix",
        action: "fixed",
        locator:
          "Foundation Models framework — Resolved Issues; issues 152280144, 152681332, 153216183, FB17990794, and 153216632",
        summary:
          "Four prior framework limitations move to resolved status at the isolated Beta 3 boundary.",
      },
      {
        suffix: "metal-rendering-fixes",
        title: "Metal and MetalFX rendering fixes",
        canonicalSummary:
          "Beta 3 resolved an indirect-command-buffer residency issue and two MetalFX temporal-scaling failures.",
        category: "bugFix",
        action: "fixed",
        locator:
          "Metal and MetalFX — Resolved Issues; issues 145066238, 146436460, and 146436741",
        summary:
          "The clean diff moves three graphics limitations into Resolved Issues.",
      },
      {
        suffix: "object-capture-low-texture",
        title: "Low-texture Object Capture reconstruction",
        canonicalSummary:
          "Object Capture added a downloadable reconstruction algorithm for improving low-texture subjects.",
        category: "developerApi",
        action: "introduced",
        locator: "Object Capture — New Features; issue 145220451",
        summary:
          "Beta 3 adds a reconstruction path for low-texture objects captured outside the ObjectCaptureSession front end.",
      },
      {
        suffix: "swift-charts-chart3d",
        title: "Swift Charts Chart3D",
        canonicalSummary:
          "Swift Charts added RealityKit-powered 3D data and mathematical-surface visualization.",
        category: "developerApi",
        action: "introduced",
        locator: "Swift Charts — New Features; issue 148361385",
        summary: "Chart3D first appears in the clean Beta 3 snapshot diff.",
      },
      {
        suffix: "videotoolbox-hevc-performance",
        title: "High-bitrate HEVC decoding fix",
        canonicalSummary:
          "VideoToolbox corrected high-bitrate HEVC decoding performance that could cause stutter and lag.",
        category: "bugFix",
        action: "fixed",
        locator: "VideoToolbox — Resolved Issues; issue 153243806",
        summary:
          "The Beta 3 payload adds a resolved high-bitrate HEVC performance issue.",
      },
      {
        suffix: "game-mode-infoplist",
        title: "Game Mode Info.plist support fix",
        canonicalSummary:
          "Beta 3 corrected macOS handling of the LSSupportsGameMode Info.plist key.",
        category: "bugFix",
        action: "fixed",
        locator: "Game Mode — Resolved Issues; issue 153125166",
        summary:
          "The Game Mode declaration key moves from ignored to resolved status at the Beta 3 boundary.",
      },
    ],
  },
  {
    milestone: "Beta 4",
    alias: "beta-4",
    before: "macosBeta3",
    after: "macosBeta4",
    addedLines: 26,
    removedLines: 9,
    specs: [
      {
        suffix: "airplay-automix",
        title: "AirPlay AutoMix transition limitation",
        canonicalSummary:
          "AutoMix transitions might not work as expected while music is streamed with AirPlay.",
        category: "knownIssue",
        action: "knownIssue",
        locator: "AirPlay — Known Issues; issue 155925891",
        summary:
          "The Beta 4 diff adds an AirPlay-specific limitation for AutoMix song transitions.",
      },
      {
        suffix: "foundation-models-new-capabilities",
        title: "Foundation Models prewarming, feedback, and language expansion",
        canonicalSummary:
          "Beta 4 expanded Foundation Models prewarming, Playground feedback, and non-English content-tagging support.",
        category: "developerApi",
        action: "introduced",
        locator:
          "Foundation Models framework — New Features; issues 152381043, 153770707, and 155801948",
        summary:
          "Three new framework capabilities appear together in the isolated Beta 4 snapshot.",
      },
      {
        suffix: "foundation-models-reliability",
        title: "Foundation Models schema, language, tool, and guardrail fixes",
        canonicalSummary:
          "Beta 4 resolved recursive schemas, Chinese-language rejection, duplicate tool names, transcript tool attachment, and false guardrail failures.",
        category: "bugFix",
        action: "fixed",
        locator:
          "Foundation Models framework — Resolved Issues; issues 153147722, FB17962270, 153151710, FB17963656, 153426645, FB18074984, 154904647, and 155273863",
        summary:
          "The clean diff groups five issue-ID transitions into resolved framework behavior.",
      },
      {
        suffix: "system-app-fixes",
        title: "Beta 4 Maps, Music, Notifications, Photos, and Siri fixes",
        canonicalSummary:
          "Beta 4 resolved retained issues in Maps recents, Music sample-rate changes, notification icons, Photos Picker options, and Siri knowledge freshness.",
        category: "bugFix",
        action: "fixed",
        locator:
          "Resolved Issues diff; issues 152197565, 152465491, 151658533, 152336867, and 154889929",
        summary:
          "Five known issues move to resolved status at the isolated Beta 4 boundary.",
      },
      {
        suffix: "storekit-purchase-fixes",
        title: "StoreKit product decoding and transaction-finish fixes",
        canonicalSummary:
          "Beta 4 fixed original-StoreKit product decoding and unfinished transactions that blocked repeat purchases.",
        category: "bugFix",
        action: "fixed",
        locator: "StoreKit — Resolved Issues; issues 150851879 and 155449267",
        summary:
          "Two StoreKit reliability fixes first appear in the Beta 4 raw state.",
      },
      {
        suffix: "swift-charts-annotation-clipping",
        title: "Scrollable Swift Charts annotation fix",
        canonicalSummary:
          "Beta 4 fixed annotation clipping on scrollable charts.",
        category: "bugFix",
        action: "fixed",
        locator: "Swift Charts — Resolved Issues; issue 109164195",
        summary:
          "The archive diff adds a resolved annotation-clipping issue for scrollable charts.",
      },
      {
        suffix: "webpage-navigation-apis",
        title: "WebPage navigation and loading API changes",
        canonicalSummary:
          "WebPage loading began returning navigation event sequences directly, gained direct URL loading, and corrected scroll geometry.",
        category: "developerApi",
        action: "changed",
        locator:
          "WebKit API — New Features and Resolved Issues; issues 152414525, 152904248, FB17850359, and 146576790",
        summary:
          "Beta 4 groups two new WebPage loading behaviors with a corrected scroll-content-size report.",
      },
      {
        suffix: "xcode-previews-panic",
        title: "Xcode Previews panic known issue",
        canonicalSummary:
          "Xcode Previews could frequently trigger a panic while running on macOS Tahoe Beta 4.",
        category: "knownIssue",
        action: "knownIssue",
        locator: "Xcode Previews — Known Issues; issue 141641869",
        summary:
          "The Beta 4 state explicitly labels the Previews panic and originally advised affected developers to use Beta 3.",
      },
    ],
  },
  {
    milestone: "Beta 5",
    alias: "beta-5",
    before: "macosBeta4",
    after: "macosBeta5",
    addedLines: 21,
    removedLines: 5,
    specs: [
      {
        suffix: "coredata-sendable-annotations",
        title: "Core Data Swift 6 concurrency annotations",
        canonicalSummary:
          "Beta 5 changed Core Data Sendable annotations to align managed objects and contexts with Swift 6 actor isolation.",
        category: "compatibility",
        action: "changed",
        locator: "CoreData — Known Issues; issues 153848710 and FB18216198",
        summary:
          "The Beta 5 SDK introduces ABI-compatible annotations that can surface new source-level concurrency warnings.",
      },
      {
        suffix: "coredata-legacy-store-options",
        title: "Legacy Core Data persistent-store option removal",
        canonicalSummary:
          "The 26 SDK removed long-deprecated Core Data persistent-store options used by older iCloud synchronization.",
        category: "removal",
        action: "removed",
        locator: "CoreData — Deprecations; issues 157297746 and FB19286235",
        summary:
          "Beta 5 documents build errors for removed option keys and points developers toward modern synchronization containers.",
      },
      {
        suffix: "foundation-models-new-capabilities",
        title:
          "Foundation Models refusal, completion, raw-content, and permissive-transform APIs",
        canonicalSummary:
          "Beta 5 added structured refusal explanations, completion state, raw generated content, and a permissive content-transformation guardrail mode.",
        category: "developerApi",
        action: "introduced",
        locator:
          "Foundation Models framework — New Features; issues 156086748, 156109416, 156351123, and 156721060",
        summary:
          "Four new model-session and generated-content capabilities appear in the clean Beta 5 snapshot.",
      },
      {
        suffix: "foundation-models-fixes",
        title: "Foundation Models guided-generation and tool fixes",
        canonicalSummary:
          "Beta 5 fixed constrained decoding with tools, missing tool calls, and dynamic-schema crashes for enums with associated values.",
        category: "bugFix",
        action: "fixed",
        locator:
          "Foundation Models framework — Resolved Issues; issues 153773704, FB18190120, 155313086, FB18691470, 155957346, and FB18878026",
        summary:
          "Three former framework limitations move to resolved status at the Beta 5 boundary.",
      },
      {
        suffix: "foundation-models-known-issues",
        title: "Foundation Models download and enum-tool limitations",
        canonicalSummary:
          "Beta 5 documented false guardrail failures before model assets finish downloading and enum-associated-value tool decoding failures.",
        category: "knownIssue",
        action: "knownIssue",
        locator:
          "Foundation Models framework — Known Issues; issues 156223847, FB18944619, and 156723065",
        summary:
          "The isolated diff adds two new model-availability and tool-decoding limitations.",
      },
      {
        suffix: "dualsense-device-switching",
        title: "DualSense multi-device switching",
        canonicalSummary:
          "Supported DualSense controllers gained pairing with multiple Apple devices and direct switching between them.",
        category: "feature",
        action: "introduced",
        locator: "Game Controller — New Features; issue 137782227",
        summary:
          "The Beta 5 note adds multi-device pairing and switching for supported DualSense and DualSense Edge controllers.",
      },
      {
        suffix: "quick-look-variants",
        title: "Quick Look USDZ variants-menu fix",
        canonicalSummary:
          "Beta 5 fixed the Quick Look menu used to switch among USDZ asset variants.",
        category: "bugFix",
        action: "fixed",
        locator: "Quick Look — Resolved Issues; issue 154817946",
        summary:
          "The USDZ Variants menu moves from Known Issues to Resolved Issues in the Beta 5 state.",
      },
      {
        suffix: "search-crash",
        title: "Application search-crash known issue",
        canonicalSummary:
          "Some applications could quit unexpectedly during search until an automatic over-the-air correction arrived.",
        category: "knownIssue",
        action: "knownIssue",
        locator: "Search — Known Issues; issue 157464670",
        summary:
          "Beta 5 records a search-related application crash and says the correction could arrive automatically over Wi-Fi.",
      },
      {
        suffix: "swiftui-popover-gesture-fixes",
        title: "SwiftUI popover environment and gesture-priority fixes",
        canonicalSummary:
          "Beta 5 fixed popover environment propagation and restored expected gesture priority relative to platform recognizers.",
        category: "bugFix",
        action: "fixed",
        locator: "SwiftUI — Resolved Issues; issues 147954025 and 155581361",
        summary:
          "Two SwiftUI behavior fixes first appear together in the isolated Beta 5 payload.",
      },
      {
        suffix: "textkit-paragraph-directionality",
        title: "TextKit paragraph-indentation directionality fix",
        canonicalSummary:
          "TextKit 2 standardized paragraph indentation directionality on the resolved writing direction for OS 26-linked applications.",
        category: "bugFix",
        action: "fixed",
        locator: "TextKit — Resolved Issues; issue 155893102",
        summary:
          "Beta 5 documents standardized indentation semantics while preserving prior-SDK binary compatibility.",
      },
    ],
  },
];

const rawCaptureInventory = {
  macOS: [
    "20250609212708",
    "20250703030443",
    "20250713024323",
    "20250722192519",
    "20250727152747",
    "20250806092740",
    "20250830132723",
    "20250910061613",
  ],
  tvOS: ["20250616183650", "20250722210758"],
  visionOS: ["20250609220324", "20250722192518"],
  watchOS: ["20250722192724", "20250728022906", "20250910061618"],
};

const routeAudit = [
  [
    "macOS",
    "Beta 1",
    "beta-1",
    "20250609212708 initial state before Beta 2",
    true,
  ],
  [
    "macOS",
    "Beta 2",
    "beta-2",
    "20250609212708 → 20250703030443; crosses only Beta 2",
    true,
  ],
  [
    "macOS",
    "Beta 3",
    "beta-3",
    "20250703030443 → 20250713024323; crosses only Beta 3",
    true,
  ],
  [
    "macOS",
    "Beta 4",
    "beta-4",
    "20250713024323 → 20250727152747; crosses only Beta 4",
    true,
  ],
  [
    "macOS",
    "Beta 5",
    "beta-5",
    "20250727152747 → 20250806092740; crosses only Beta 5",
    true,
  ],
  [
    "macOS",
    "Beta 6",
    "beta-6",
    "No raw payload between Beta 5 and Beta 7",
    false,
  ],
  [
    "macOS",
    "Beta 7",
    "beta-7",
    "No raw payload between Beta 6 and Beta 8",
    false,
  ],
  [
    "macOS",
    "Beta 8",
    "beta-8",
    "20250806092740 → 20250830132723 crosses Betas 6, 7, and 8",
    false,
  ],
  [
    "macOS",
    "Beta 9",
    "beta-9",
    "20250830132723 → 20250910061613 crosses Beta 9 and RC",
    false,
  ],
  [
    "macOS",
    "RC",
    "rc",
    "20250830132723 → 20250910061613 crosses Beta 9 and RC",
    false,
  ],
  [
    "tvOS",
    "Beta 1",
    "beta-1",
    "20250616183650 initial state before Beta 2",
    true,
  ],
  ["tvOS", "Beta 2", "beta-2", "No adjacent raw payload", false],
  ["tvOS", "Beta 3", "beta-3", "No adjacent raw payload", false],
  [
    "tvOS",
    "Beta 4",
    "beta-4",
    "20250616183650 → 20250722210758 crosses Betas 2, 3, and 4",
    false,
  ],
  ["tvOS", "Beta 5", "beta-5", "No later prerelease raw payload", false],
  ["tvOS", "Beta 6", "beta-6", "No later prerelease raw payload", false],
  ["tvOS", "Beta 7", "beta-7", "No later prerelease raw payload", false],
  ["tvOS", "Beta 8", "beta-8", "No later prerelease raw payload", false],
  ["tvOS", "Beta 9", "beta-9", "No later prerelease raw payload", false],
  ["tvOS", "RC", "rc", "No later prerelease raw payload", false],
  [
    "visionOS",
    "Beta 1",
    "beta-1",
    "20250609220324 initial state before Beta 2",
    true,
  ],
  ["visionOS", "Beta 2", "beta-2", "No adjacent raw payload", false],
  ["visionOS", "Beta 3", "beta-3", "No adjacent raw payload", false],
  [
    "visionOS",
    "Beta 4",
    "beta-4",
    "20250609220324 → 20250722192518 crosses Betas 2, 3, and 4",
    false,
  ],
  ["visionOS", "Beta 5", "beta-5", "No later prerelease raw payload", false],
  ["visionOS", "Beta 6", "beta-6", "No later prerelease raw payload", false],
  ["visionOS", "Beta 7", "beta-7", "No later prerelease raw payload", false],
  ["visionOS", "Beta 8", "beta-8", "No later prerelease raw payload", false],
  ["visionOS", "Beta 9", "beta-9", "No later prerelease raw payload", false],
  ["visionOS", "RC", "rc", "No later prerelease raw payload", false],
  ["watchOS", "Beta 1", "beta-1", "No raw payload before Beta 2", false],
  ["watchOS", "Beta 2", "beta-2", "No raw payload before Beta 3", false],
  ["watchOS", "Beta 3", "beta-3", "No raw payload before Beta 4", false],
  [
    "watchOS",
    "Beta 4",
    "beta-4",
    "First raw payload 20250722192724 crosses Betas 1–4",
    false,
  ],
  ["watchOS", "Beta 5", "beta-5", "No adjacent raw payload", false],
  ["watchOS", "Beta 6", "beta-6", "No adjacent raw payload", false],
  ["watchOS", "Beta 7", "beta-7", "No adjacent raw payload", false],
  ["watchOS", "Beta 8", "beta-8", "No adjacent raw payload", false],
  ["watchOS", "Beta 9", "beta-9", "No adjacent raw payload", false],
  [
    "watchOS",
    "RC",
    "rc",
    "20250728022906 → 20250910061618 crosses Betas 5–9 and RC",
    false,
  ],
];

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function sha256(value) {
  return createHash("sha256").update(value).digest("hex");
}

function signature(milestones) {
  return milestones
    .map(
      (milestone) =>
        `${milestone.label}@${milestone.date}${milestone.isRevision ? "*" : ""}`,
    )
    .join("|");
}

function idForSeedVersion(version) {
  return `version-${version.platform.toLowerCase()}-${version.version.replaceAll(".", "-")}`;
}

function citation(url, locator) {
  return {
    url,
    ...(locator ? { locator } : {}),
  };
}

function article(blocks) {
  return {
    authorship: "originalSynthesis",
    blocks,
  };
}

function heading(text) {
  return { style: "h2", text };
}

function paragraph(text, citations) {
  return { text, citations };
}

function initialChange(platformSlug, spec, source) {
  return {
    key: `${platformSlug}-26-0-beta-1-${spec.suffix}`,
    title: spec.title,
    canonicalSummary: spec.canonicalSummary,
    category: spec.category,
    action: spec.action,
    inheritance: "delta",
    summary: spec.summary,
    documentedStatus: "documented",
    evidenceState: "confirmed",
    verificationMethod:
      "Observed in the first CDX-confirmed raw Apple DocC payload after Beta 1 and before Beta 2. This is a representative initial snapshot-state item, not a claim that the inventory is exhaustive or that the item appeared at an exact hour.",
    citations: [citation(source.url, spec.locator)],
  };
}

function initialEvent({
  platformSlug,
  displayName,
  sourceKey,
  specs,
  rawItemCount,
  scope,
}) {
  const source = evidence[sourceKey];
  const sourceCitation = citation(
    source.url,
    `Human capture ${source.humanTimestamp}; exact raw payload ${source.rawTimestamp}; ${source.rawTitle}`,
  );
  return {
    target: {
      releaseVersionId: `version-${platformSlug}-26-0`,
      routeAlias: "beta-1",
    },
    authorship: "originalSynthesis",
    summary: `The first retained raw Apple DocC state after ${displayName} 26 Beta 1 and before Beta 2 contains ${rawItemCount} note items; this page structures ${specs.length} representative, high-signal entries across ${scope}.`,
    article: article([
      heading("Archived Apple note state"),
      paragraph(
        `Internet Archive preserved an Apple Developer raw DocC payload after Beta 1 and before Beta 2. It identifies itself as ${source.rawTitle} and contains ${rawItemCount} structured note items.`,
        [sourceCitation],
      ),
      heading("Representative Beta 1 inventory"),
      paragraph(
        `This page structures ${specs.length} representative entries across ${scope}. It intentionally preserves a balanced set of new APIs, compatibility changes, fixes, and known issues instead of reproducing Apple's full list.`,
        [sourceCitation],
      ),
      heading("Attribution boundary"),
      paragraph(
        "This is initial snapshot-state attribution, not a claim that every item debuted at the exact seed publication time. The raw capture precedes Beta 2, so Beta 1 is the only intervening 26.0 milestone; later cumulative material and administrative identity facts are not copied backward.",
        [sourceCitation],
      ),
    ]),
    citations: [sourceCitation],
    changes: specs.map((spec) => initialChange(platformSlug, spec, source)),
    provenanceStatus: "editoriallyVerified",
    editorialReview: { status: "approved", reviewedAt },
    isIndexable: true,
  };
}

function sequentialEvent(row) {
  const before = evidence[row.before];
  const after = evidence[row.after];
  const beforeCitation = citation(
    before.url,
    `Before-state raw payload ${before.rawTimestamp}; ${before.rawTitle}`,
  );
  const afterCitation = citation(
    after.url,
    `After-state raw payload ${after.rawTimestamp}; ${after.rawTitle}`,
  );
  return {
    target: {
      releaseVersionId: "version-macos-26-0",
      routeAlias: row.alias,
    },
    authorship: "originalSynthesis",
    summary: `A clean archived Apple DocC boundary isolates macOS Tahoe 26 ${row.milestone}; the raw diff has ${row.addedLines} added or status-changed lines and ${row.removedLines} removed or superseded lines, grouped here into ${row.specs.length} sourced occurrences.`,
    article: article([
      heading("Sequential archive diff"),
      paragraph(
        `The CDX-confirmed before and after payloads bracket ${row.milestone} without crossing another macOS 26 milestone. The after-state page explicitly identifies itself as ${after.rawTitle}.`,
        [beforeCitation, afterCitation],
      ),
      heading(`Documented ${row.milestone} delta`),
      paragraph(
        `The raw comparison contains ${row.addedLines} added or status-changed lines and ${row.removedLines} removed or superseded lines. This article groups the high-signal issue-ID transitions into ${row.specs.length} copyright-safe editorial occurrences rather than reproducing Apple's changelog.`,
        [beforeCitation, afterCitation],
      ),
      heading("Attribution boundary"),
      paragraph(
        "Each structured occurrence is limited to an issue ID or status change present in this clean adjacent boundary. A removed note without an explicit replacement is not treated as proof of a fix, and no later Public note or build identity is inherited.",
        [beforeCitation, afterCitation],
      ),
    ]),
    citations: [beforeCitation, afterCitation],
    changes: row.specs.map((spec) => ({
      key: `macos-26-0-${row.alias}-${spec.suffix}`,
      title: spec.title,
      canonicalSummary: spec.canonicalSummary,
      category: spec.category,
      action: spec.action,
      inheritance: "delta",
      summary: spec.summary,
      documentedStatus: "documented",
      evidenceState: "confirmed",
      verificationMethod: `Sequential diff between exact CDX-confirmed raw Apple DocC payloads ${before.rawTimestamp} and ${after.rawTimestamp}; the interval crosses ${row.milestone} and no other macOS 26 milestone.`,
      citations: [
        citation(
          before.url,
          `Before-state raw payload ${before.rawTimestamp}; comparison baseline`,
        ),
        citation(after.url, spec.locator),
      ],
    })),
    provenanceStatus: "editoriallyVerified",
    editorialReview: { status: "approved", reviewedAt },
    isIndexable: true,
  };
}

function collectCitations(value, output = []) {
  if (Array.isArray(value)) {
    for (const item of value) collectCitations(item, output);
    return output;
  }
  if (!value || typeof value !== "object") return output;
  if (
    typeof value.url === "string" &&
    Object.keys(value).every((key) => ["url", "locator", "note"].includes(key))
  ) {
    output.push(value);
    return output;
  }
  for (const item of Object.values(value)) collectCitations(item, output);
  return output;
}

const seed = JSON.parse(await readFile(seedPath, "utf8"));
const launchManifest = JSON.parse(await readFile(launchManifestPath, "utf8"));

const seedVersions = seed.releaseVersions
  .filter(
    (version) =>
      version.version === "26.0" &&
      ["macOS", "tvOS", "visionOS", "watchOS"].includes(version.platform),
  )
  .sort((a, b) => a.platform.localeCompare(b.platform));

const expectedSeed = {
  "macOS 26.0":
    "Beta 1@2025-06-09|Beta 2@2025-06-23|Beta 3@2025-07-07|Beta 4@2025-07-22|Beta 5@2025-08-05|Beta 6@2025-08-11|Beta 7@2025-08-18|Beta 8@2025-08-25|Beta 9@2025-09-02|RC@2025-09-09|Public@2025-09-15",
  "tvOS 26.0":
    "Beta 1@2025-06-09|Beta 2@2025-06-23|Beta 3@2025-07-08|Beta 4@2025-07-22|Beta 5@2025-08-05|Beta 6@2025-08-11|Beta 7@2025-08-18|Beta 8@2025-08-25|Beta 9@2025-09-02|RC@2025-09-09|Public@2025-09-15",
  "visionOS 26.0":
    "Beta 1@2025-06-09|Beta 2@2025-06-23|Beta 3@2025-07-07|Beta 4@2025-07-22|Beta 5@2025-08-05|Beta 6@2025-08-11|Beta 7@2025-08-18|Beta 8@2025-08-25|Beta 9@2025-09-02|RC@2025-09-09|Public@2025-09-15",
  "watchOS 26.0":
    "Beta 1@2025-06-09|Beta 2@2025-06-23|Beta 3@2025-07-07|Beta 4@2025-07-22|Beta 5@2025-08-05|Beta 6@2025-08-11|Beta 7@2025-08-18|Beta 8@2025-08-25|Beta 9@2025-09-02|RC@2025-09-09|Public@2025-09-15",
};

assert(seedVersions.length === 4, "Expected four non-iOS 26.0 records.");
for (const version of seedVersions) {
  const key = `${version.platform} ${version.version}`;
  assert(expectedSeed[key], `Unexpected seed version ${key}.`);
  assert(
    signature(version.milestones) === expectedSeed[key],
    `${key} milestone closure changed.`,
  );
  assert(
    version.publicReleaseDate === "2025-09-15",
    `${key} public date changed.`,
  );
}

const seedMilestones = seedVersions.flatMap((version) =>
  version.milestones.map((milestone) => ({
    releaseVersionId: idForSeedVersion(version),
    platform: version.platform,
    ...milestone,
  })),
);
const publicMilestones = seedMilestones.filter(
  (milestone) => milestone.label === "Public",
);
const prereleaseMilestones = seedMilestones.filter(
  (milestone) => milestone.label !== "Public",
);
const supportedAudit = routeAudit.filter((row) => row[4]);
const unsupportedAudit = routeAudit.filter((row) => !row[4]);
const supportedRouteKeys = new Set(
  supportedAudit.map(
    ([platform, , alias]) => `version-${platform.toLowerCase()}-26-0/${alias}`,
  ),
);

assert(seedMilestones.length === 44, "Expected 44 total seed milestones.");
assert(publicMilestones.length === 4, "Expected four Public milestones.");
assert(
  prereleaseMilestones.length === 40,
  "Expected 40 prerelease milestones.",
);
assert(routeAudit.length === 40, "Expected a 40-route archive audit.");
assert(supportedAudit.length === 7, "Expected seven supported routes.");
assert(unsupportedAudit.length === 33, "Expected 33 unsupported routes.");
assert(
  new Set(
    routeAudit.map(
      ([platform, , alias]) =>
        `version-${platform.toLowerCase()}-26-0/${alias}`,
    ),
  ).size === 40,
  "Route audit contains a duplicate.",
);
for (const milestone of prereleaseMilestones) {
  const alias = milestone.label.toLowerCase().replaceAll(" ", "-");
  assert(
    routeAudit.some(
      ([platform, , routeAlias]) =>
        platform === milestone.platform && routeAlias === alias,
    ),
    `Missing route audit for ${milestone.platform} ${milestone.label}.`,
  );
}

const launchVersionIds = new Set(
  (launchManifest.versions || []).map((version) => version.releaseVersionId),
);
for (const version of seedVersions) {
  assert(
    launchVersionIds.has(idForSeedVersion(version)),
    `${idForSeedVersion(version)} is not owned by the approved launch manifest.`,
  );
}
const launchPublicEvents = (launchManifest.events || []).filter((event) => {
  const legacySourceId = event.target?.legacySourceId || "";
  return (
    /^version-(macos|tvos|visionos|watchos)-26-0:m10$/.test(legacySourceId) &&
    event.editorialReview?.status === "approved" &&
    event.provenanceStatus === "editoriallyVerified" &&
    event.isIndexable === true
  );
});
assert(
  launchPublicEvents.length === 4,
  "Expected four approved Public routes in the launch manifest.",
);

const sources = Object.values(evidence).map((item) => item.source);
const events = [
  initialEvent({
    platformSlug: "macos",
    displayName: "macOS Tahoe",
    sourceKey: "macosBeta1",
    specs: macosBeta1Specs,
    rawItemCount: 113,
    scope:
      "the App Store, Foundation Models, disk images, Metal, networking security, logging privacy, text, StoreKit, TLS, and SwiftUI",
  }),
  ...macosSequential.map(sequentialEvent),
  initialEvent({
    platformSlug: "tvos",
    displayName: "tvOS",
    sourceKey: "tvosBeta1",
    specs: tvosBeta1Specs,
    rawItemCount: 54,
    scope:
      "the App Store, Background Assets, Metal, AirPlay playback, RealityKit, StoreKit, SwiftUI, and hardware-specific design behavior",
  }),
  initialEvent({
    platformSlug: "visionos",
    displayName: "visionOS",
    sourceKey: "visionosBeta1",
    specs: visionosBeta1Specs,
    rawItemCount: 142,
    scope:
      "Foundation Models, ARKit, Background Assets, remote immersive streaming, StoreKit, Swift Charts, SwiftUI, TabletopKit, video decoding, and WidgetKit",
  }),
];
const bundle = {
  formatVersion: 1,
  target: { projectId: "lh3yswzu", dataset: "production" },
  accessedAt: "2026-07-30",
  sources,
  versions: [],
  events,
  builds: [],
};

assert(bundle.versions.length === 0, "Version overlays are out of scope.");
assert(bundle.events.length === 7, "Expected seven event overlays.");
assert(bundle.builds.length === 0, "Build pages are out of scope.");
const occurrences = bundle.events.flatMap((event) => event.changes);
assert(occurrences.length === 64, "Expected 64 change occurrences.");
assert(
  new Set(occurrences.map((change) => change.key)).size === 64,
  "Expected 64 unique change keys.",
);
for (const event of bundle.events) {
  assert(
    JSON.stringify(Object.keys(event.target).sort()) ===
      JSON.stringify(["releaseVersionId", "routeAlias"]),
    "Event selector contains a non-durable field.",
  );
  assert(
    supportedRouteKeys.has(
      `${event.target.releaseVersionId}/${event.target.routeAlias}`,
    ),
    "Event selector escaped the supported-route allowlist.",
  );
  assert(
    event.provenanceStatus === "editoriallyVerified" &&
      event.editorialReview.status === "approved" &&
      event.editorialReview.reviewedAt === reviewedAt &&
      event.isIndexable === true,
    "Every event must remain approved, editorially verified, and indexable.",
  );
  assert(event.changes.length > 0, "Every emitted event needs content.");
  for (const change of event.changes) {
    assert(change.inheritance === "delta", `${change.key} is not a delta.`);
    assert(
      change.documentedStatus === "documented" &&
        change.evidenceState === "confirmed",
      `${change.key} has an unexpected evidence state.`,
    );
  }
}

const sourceUrls = new Set(sources.map((source) => source.url));
assert(sourceUrls.size === sources.length, "Source URLs must be unique.");
for (const item of Object.values(evidence)) {
  assert(
    item.source.publisher === "Apple Developer" &&
      item.source.sourceClass === "archive",
    `Archive provenance is incomplete for ${item.url}.`,
  );
  assert(
    item.url.startsWith("https://web.archive.org/web/") &&
      !item.url.includes("/tutorials/data/"),
    `Reader-facing archive URL is invalid: ${item.url}.`,
  );
  assert(
    item.rawUrl === rawArchiveUrl(item.rawTimestamp, item.path),
    `Raw archive URL drifted for ${item.rawTimestamp}.`,
  );
}
const citations = collectCitations({ events });
for (const item of citations) {
  assert(sourceUrls.has(item.url), `Undeclared citation source ${item.url}.`);
}
for (const url of sourceUrls) {
  assert(
    citations.some((item) => item.url === url),
    `Declared source is unused: ${url}.`,
  );
}

const files = (await readdir(directory))
  .filter((file) => file.endsWith(".json") && file !== outputFile)
  .sort();
const targetOwners = new Map();
const researchChangeDefinitions = new Map();
for (const file of files) {
  const other = JSON.parse(await readFile(join(directory, file), "utf8"));
  for (const event of other.events || []) {
    if (event.target?.releaseVersionId && event.target?.routeAlias) {
      targetOwners.set(
        `${event.target.releaseVersionId}/${event.target.routeAlias}`,
        file,
      );
    }
    for (const change of event.changes || []) {
      const definition = JSON.stringify({
        title: change.title,
        canonicalSummary: change.canonicalSummary,
        category: change.category,
      });
      const prior = researchChangeDefinitions.get(change.key);
      assert(
        !prior || prior.definition === definition,
        `${change.key} conflicts between ${prior?.file} and ${file}.`,
      );
      researchChangeDefinitions.set(change.key, { file, definition });
    }
  }
}
for (const event of bundle.events) {
  const target = `${event.target.releaseVersionId}/${event.target.routeAlias}`;
  assert(
    !targetOwners.has(target),
    `${target} is already owned by ${targetOwners.get(target)}.`,
  );
  for (const change of event.changes) {
    const prior = researchChangeDefinitions.get(change.key);
    if (!prior) continue;
    assert(
      prior.definition ===
        JSON.stringify({
          title: change.title,
          canonicalSummary: change.canonicalSummary,
          category: change.category,
        }),
      `${change.key} conflicts with ${prior.file}.`,
    );
  }
}

const rawJson = `${JSON.stringify(bundle, null, 2)}\n`;
const formattedJson = await prettier.format(rawJson, {
  parser: "json",
  printWidth: 80,
});
const jsonSha = sha256(formattedJson);

const auditRows = routeAudit
  .map(
    ([platform, milestone, alias, boundary, supported]) =>
      `| ${platform} | ${milestone} | \`${alias}\` | ${boundary} | ${supported ? "Included" : "Unsupported"} |`,
  )
  .join("\n");
const evidenceRows = Object.values(evidence)
  .map(
    (item) =>
      `| ${item.platform} ${item.milestone} | [${item.humanTimestamp}](${item.url}) | [${item.rawTimestamp}](${item.rawUrl}) | \`${item.rawTitle}\` |`,
  )
  .join("\n");
const captureRows = Object.entries(rawCaptureInventory)
  .map(
    ([platform, timestamps]) =>
      `| ${platform} | ${timestamps.map((timestamp) => `\`${timestamp}\``).join(", ")} |`,
  )
  .join("\n");

const markdown = `# Apple non-iOS 26.0 prerelease archive research batch

## Result

\`apple-nonios-26-0-prerelease.json\` enriches seven existing macOS, tvOS, and visionOS prerelease routes whose Apple DocC states are isolated by exact CDX-confirmed raw payload captures.

- The exact seed contains 4 versions, 44 milestones, 4 Public routes, and 40 prerelease routes.
- 7 prerelease routes are included: macOS Betas 1–5, tvOS Beta 1, and visionOS Beta 1.
- 33 prerelease routes remain explicitly unsupported, including all ten watchOS routes.
- The event overlays contain 64 documented and confirmed change occurrences.
- 7 archived Apple sources are declared with Apple Developer as original publisher and \`archive\` as the preservation class.
- Beta 1 pages use representative initial-state items. Later macOS pages group issue-ID and status transitions only across clean adjacent raw boundaries.
- No version overlay, Public route, build page, route creation, or administrative identity-only change is included. This generator records the completed approval and indexing state but performs no Sanity or application write.

## Exact seed closure

All four seed records contain Beta 1 through Beta 9, RC, and Public. macOS, visionOS, and watchOS Beta 3 are dated July 7, 2025; tvOS Beta 3 is dated July 8. All Public releases are September 15 and are already approved in \`scripts/apple-launch-content-2026.json\`.

## Archive method

A requested Wayback replay timestamp is not treated as a capture. Only timestamps returned by the Internet Archive CDX index for the raw Apple DocC JSON URL establish a note state. Reader-facing citations use archived human Apple Developer pages; the exact raw \`id_\` payload URLs are listed below.

Initial Beta 1 pages use the first retained raw 26.0 payload only when it falls after Beta 1 and before Beta 2. These are representative snapshot-state inventories, not exhaustive reproductions of Apple's notes.

Later pages require two exact raw payloads whose interval crosses one and only one seed milestone. Status transitions are matched by Apple issue ID. A disappearance without an explicit replacement is not labeled as fixed. Diffs are grouped into copyright-safe editorial occurrences rather than copying Apple paragraphs.

## Exact reader/raw source alignment

| Evidence state | Reader-facing archived Apple page | Exact raw DocC payload | Raw Apple title |
| --- | --- | --- | --- |
${evidenceRows}

## CDX-confirmed raw capture inventory

| Platform | Exact raw timestamps audited |
| --- | --- |
${captureRows}

The macOS Beta 4 evidence uses the later July 27 raw state. An intermediate July 22 raw capture falls in the same Beta 4 interval; its only later difference is removal of workaround text from the Xcode Previews issue, which is not promoted as a separate change.

## Forty-route milestone isolation audit

| Platform | Milestone | Alias | Exact raw boundary or gap | Decision |
| --- | --- | --- | --- | --- |
${auditRows}

## Selected content scope

### macOS Beta 1

The first raw state contains 113 Apple note items. Ten representative entries preserve App Store accessibility metadata, Foundation Models access, sparse disk images, Metal 4, IKEv2 cryptographic removals, NSLog privacy behavior, inline audio attachments, StoreKit offers, the higher TLS default, and SwiftUI Find controls.

### macOS Betas 2–5

- Beta 2: the clean diff contains 43 added or status-changed lines and 25 removed or superseded lines, grouped into 10 occurrences. Major areas include Recovery Assistant, AGL removal, passkeys, Background Assets, Foundation Models, Rosetta testing, TextKit, and confirmed system-app status transitions.
- Beta 3: 24 added/status-changed and 16 removed/superseded lines, grouped into 8 occurrences across App Store updates, Background Assets, Foundation Models, Metal, Object Capture, Chart3D, HEVC, and Game Mode.
- Beta 4: 26 added/status-changed and 9 removed/superseded lines, grouped into 8 occurrences across AirPlay, Foundation Models, system apps, StoreKit, Swift Charts, WebKit, and Xcode Previews.
- Beta 5: 21 added/status-changed and 5 removed/superseded lines, grouped into 10 occurrences across Core Data, Foundation Models, controllers, Quick Look, Search, SwiftUI, and TextKit.

The August 30 Beta 8 raw state cannot be assigned because the previous raw state is Beta 5 and the interval crosses Betas 6, 7, and 8. The September 10 RC state cannot be assigned because the previous raw state precedes both Beta 9 and RC. Even though the RC payload changes two issues to Resolved, this batch does not guess which intervening route owns them.

### tvOS Beta 1

The first raw state contains 54 items. Eight representative occurrences cover App Store accessibility metadata, Background Assets, Metal 4, AirPlay stereo-pair playback, RealityKit lookup, StoreKit offers, SwiftUI control sizing, and the hardware boundary for the new tvOS design.

The next raw payload is on July 22 and crosses Betas 2, 3, and 4. It is retained as a gap marker only.

### visionOS Beta 1

The first raw state contains 142 items. Ten representative occurrences cover Foundation Models, ARKit accessory tracking, Background Assets, remote immersive sessions, StoreKit, Chart3D, SwiftUI breakthrough effects, TabletopKit, MV-HEVC decoding, and WidgetKit.

The next raw payload is on July 22 and crosses Betas 2, 3, and 4. It is retained as a gap marker only.

### watchOS

The first raw payload appears on July 22 after Beta 4, and the next July 28 payload remains in the Beta 4 interval. Neither can assign an initial Beta 1 state. The following raw payload is the September 10 RC page, but that boundary crosses Betas 5–9 and RC. All ten watchOS prerelease routes remain unsupported.

## Build and identity boundary

This is an event-page content batch. It does not create build pages or administrative identity-only changes. The archived DocC payloads establish release-note state, not durable build numbers. Existing release-card dates remain untouched; no build/date assertion is introduced into article prose without a separately archived first-party release record.

## Copyright and attribution method

All article text, titles, summaries, and grouped change descriptions are original synthesis. Apple issue identifiers, framework names, API names, and status headings are factual locators. The batch does not reproduce Apple's paragraphs, full item list, workaround wording, screenshots, artwork, or trademark boilerplate. Every structured claim links to an archived human Apple page, and this ledger exposes the exact raw payload used for reproducibility.

## Closure guards

- Exact comparison against all four local 26.0 seed records, including the tvOS-specific Beta 3 date.
- Exact 40-route audit with a seven-route allowlist and 33 explicit gaps.
- Approved-launch ownership assertion for all four Public routes and versions.
- Exact raw timestamp inventory and reader/raw archive URL assertions.
- Collision scan across every other research-batch JSON.
- Exact 64-key structured occurrence inventory and full source/citation closure.
- All seven events remain \`editoriallyVerified\`, approved at \`${reviewedAt}\`, and \`isIndexable: true\`.
- Deterministic formatted JSON SHA-256: \`${jsonSha}\`.

## Validation

- Repository validation passes; this batch contributes 0 versions, 7 events, 64 changes, 7 sources, and 144 citations.
- Focused launch-content ingestion and manifest tests pass. ESLint passes for this generator, and Prettier passes for all three batch artifacts.
- The formatted JSON is deterministic across consecutive generator runs.

## Publication receipt

- Editorial review completed at \`${reviewedAt}\`.
- Reviewed plan SHA-256: \`${publicationReceipt.reviewedPlan}\`.
- Plan artifact SHA-256: \`${publicationReceipt.planArtifact}\`.
- Rollback snapshot SHA-256: \`${publicationReceipt.rollback}\`.
- Sanity transaction: \`${publicationReceipt.transaction}\`.
- Publication receipt SHA-256: \`${publicationReceipt.receipt}\`.
- Post-publication zero plan SHA-256: \`${publicationReceipt.zeroPlan}\`; 0 mutations and 2,153 unchanged documents.
- Production coverage: 410/410 versions are full. The 1,979 appearances comprise 311 full, 256 source-linked, and 1,412 timeline-only appearances; 462 appearances have approved structured changes.
- All seven canonical local pages report full content, indexable state, and rendered references.

## Independent raw replay

- Exact archived Apple titles and item counts match the ledger.
- macOS diff arithmetic matches all four ledger boundaries.
- All 139 cited issue-ID checks pass.

## Reproduction

\`\`\`bash
node scripts/research-batches/build-apple-nonios-26-0-prerelease.mjs
npm run research:validate
node --import tsx --test tests/launch-content-ingestion.test.ts tests/launch-content-manifest.test.ts
npx eslint scripts/research-batches/build-apple-nonios-26-0-prerelease.mjs
npx prettier --check scripts/research-batches/build-apple-nonios-26-0-prerelease.mjs scripts/research-batches/apple-nonios-26-0-prerelease.json scripts/research-batches/apple-nonios-26-0-prerelease.md
\`\`\`

These reproduction commands are local and read-only except for regenerating the two batch artifacts. They do not contact or modify Sanity and do not change application code.
`;

const formattedMarkdown = await prettier.format(markdown, {
  parser: "markdown",
  printWidth: 80,
  proseWrap: "preserve",
});

await writeFile(jsonPath, formattedJson);
await writeFile(ledgerPath, formattedMarkdown);
