import { createHash } from "node:crypto";
import { readdir, readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import prettier from "prettier";

const here = dirname(fileURLToPath(import.meta.url));
const seedPath = join(here, "..", "seed-data.json");
const outputName = "apple-26-1-26-3-prerelease-archive.json";
const outputPath = join(here, outputName);
const ledgerName = "apple-26-1-26-3-prerelease-archive.md";
const ledgerPath = join(here, ledgerName);
const accessedAt = "2026-07-30";
const reviewedAt = "2026-07-30T07:50:18Z";

const releaseIndexUrl = "https://developer.apple.com/news/releases/";

const documentFamilies = {
  "ios-ipados-26_1-release-notes": "ios-ipados-release-notes",
  "ios-ipados-26_2-release-notes": "ios-ipados-release-notes",
  "ios-ipados-26_3-release-notes": "ios-ipados-release-notes",
  "macos-26_1-release-notes": "macos-release-notes",
  "macos-26_2-release-notes": "macos-release-notes",
  "macos-26_3-release-notes": "macos-release-notes",
  "visionos-26_1-release-notes": "visionos-release-notes",
  "visionos-26_2-release-notes": "visionos-release-notes",
  "visionos-26_3-release-notes": "visionos-release-notes",
};

function canonicalPage(documentName) {
  return `https://developer.apple.com/documentation/${documentFamilies[documentName]}/${documentName}`;
}

function canonicalRaw(documentName) {
  return `https://developer.apple.com/tutorials/data/documentation/${documentFamilies[documentName]}/${documentName}.json`;
}

function rawReplay(documentName, timestamp) {
  return `https://web.archive.org/web/${timestamp}id_/${canonicalRaw(documentName)}`;
}

function humanReplay(documentName, timestamp) {
  return `https://web.archive.org/web/${timestamp}/${canonicalPage(documentName)}`;
}

function cdxQuery(documentName) {
  const original = canonicalRaw(documentName).replace("https://", "");
  const params = new URLSearchParams({
    url: original,
    from: "2025",
    to: "2026",
    output: "json",
    fl: "timestamp,original,statuscode,mimetype,digest,length",
    filter: "statuscode:200",
    limit: "1000",
  });
  return `https://web.archive.org/cdx/search/cdx?${params}`;
}

function archiveEvidence({
  documentName,
  humanTimestamp,
  rawTimestamp,
  title,
  topics,
}) {
  const url = humanReplay(documentName, humanTimestamp);
  const rawUrl = rawReplay(documentName, rawTimestamp);
  return {
    documentName,
    humanTimestamp,
    rawTimestamp,
    url,
    rawUrl,
    source: {
      url,
      transportUrl: rawUrl,
      archiveUrl: url,
      title,
      publisher: "Apple Developer",
      author: "Apple",
      sourceClass: "archive",
      topics: [...topics, "Internet Archive", "DocC snapshot"],
    },
  };
}

const E = {
  mobile261Beta1: archiveEvidence({
    documentName: "ios-ipados-26_1-release-notes",
    humanTimestamp: "20250923063632",
    rawTimestamp: "20250927080956",
    title: "Archived iOS & iPadOS 26.1 Beta Release Notes — initial beta state",
    topics: ["iOS", "iPadOS", "26.1", "Beta 1"],
  }),
  mobile261PreBeta4: archiveEvidence({
    documentName: "ios-ipados-26_1-release-notes",
    humanTimestamp: "20251020210458",
    rawTimestamp: "20251020181850",
    title: "Archived iOS & iPadOS 26.1 Beta 3 Release Notes — Beta 4 baseline",
    topics: ["iOS", "iPadOS", "26.1", "Beta 3", "Beta 4 baseline"],
  }),
  mobile261Beta4: archiveEvidence({
    documentName: "ios-ipados-26_1-release-notes",
    humanTimestamp: "20251023065105",
    rawTimestamp: "20251023065106",
    title: "Archived iOS & iPadOS 26.1 Beta 4 Release Notes",
    topics: ["iOS", "iPadOS", "26.1", "Beta 4"],
  }),
  mobile261Rc: archiveEvidence({
    documentName: "ios-ipados-26_1-release-notes",
    humanTimestamp: "20251029020726",
    rawTimestamp: "20251031011033",
    title: "Archived iOS & iPadOS 26.1 RC Release Notes",
    topics: ["iOS", "iPadOS", "26.1", "RC"],
  }),
  mobile262Beta2: archiveEvidence({
    documentName: "ios-ipados-26_2-release-notes",
    humanTimestamp: "20251117094838",
    rawTimestamp: "20251117094839",
    title: "Archived iOS & iPadOS 26.2 Beta 2 Release Notes",
    topics: ["iOS", "iPadOS", "26.2", "Beta 2"],
  }),
  mobile263Beta2: archiveEvidence({
    documentName: "ios-ipados-26_3-release-notes",
    humanTimestamp: "20260113215401",
    rawTimestamp: "20260114134647",
    title: "Archived iOS & iPadOS 26.3 Beta 2 Release Notes — Beta 3 baseline",
    topics: ["iOS", "iPadOS", "26.3", "Beta 2", "Beta 3 baseline"],
  }),
  mobile263Beta3: archiveEvidence({
    documentName: "ios-ipados-26_3-release-notes",
    humanTimestamp: "20260129002237",
    rawTimestamp: "20260129002238",
    title: "Archived iOS & iPadOS 26.3 Beta 3 Release Notes",
    topics: ["iOS", "iPadOS", "26.3", "Beta 3"],
  }),
  mac261Beta1: archiveEvidence({
    documentName: "macos-26_1-release-notes",
    humanTimestamp: "20250923143016",
    rawTimestamp: "20250926135045",
    title: "Archived macOS Tahoe 26.1 Beta Release Notes",
    topics: ["macOS", "Tahoe", "26.1", "Beta 1"],
  }),
  mac261Beta2: archiveEvidence({
    documentName: "macos-26_1-release-notes",
    humanTimestamp: "20251013075559",
    rawTimestamp: "20251013075600",
    title: "Archived macOS Tahoe 26.1 Beta 2 Release Notes",
    topics: ["macOS", "Tahoe", "26.1", "Beta 2"],
  }),
  vision262Beta1: archiveEvidence({
    documentName: "visionos-26_2-release-notes",
    humanTimestamp: "20251105020215",
    rawTimestamp: "20251105020223",
    title: "Archived visionOS 26.2 Beta Release Notes",
    topics: ["visionOS", "26.2", "Beta 1"],
  }),
  vision263Beta1: archiveEvidence({
    documentName: "visionos-26_3-release-notes",
    humanTimestamp: "20251215220955",
    rawTimestamp: "20251215220956",
    title: "Archived visionOS 26.3 Beta Release Notes",
    topics: ["visionOS", "26.3", "Beta 1"],
  }),
};

const releaseIndexSource = {
  url: releaseIndexUrl,
  title: "Releases — Apple Developer",
  publisher: "Apple Developer",
  author: "Apple",
  sourceClass: "firstPartyDocumentation",
  topics: ["Apple platform releases", "developer beta", "release candidate"],
};

const mobile261Beta1Specs = [
  {
    suffix: "background-assets-local-url-lookup",
    title: "Background Assets local URL lookup fix",
    canonicalSummary:
      "Background Assets corrected local file URL lookup so an already downloaded asset could be located without an unexpected error.",
    category: "bugFix",
    action: "fixed",
    locator: "Background Assets — Resolved Issues; 157959878 and FB19512759",
    summary:
      "The initial archived note state records a fix for AssetPackManager URL lookup when the requested asset file is already stored locally.",
  },
  {
    suffix: "game-controller-timestamp-domain",
    title: "Game controller press timestamp correction",
    canonicalSummary:
      "Game Controller corrected the time domain used by the last-pressed-state timestamp.",
    category: "bugFix",
    action: "fixed",
    locator: "Game Controller — Resolved Issues; 159124910",
    summary:
      "Apple's initial beta notes mark the incorrect time domain returned by the pressed-state timestamp as resolved.",
  },
  {
    suffix: "healthkit-blood-pressure-authorization",
    title: "Unified blood-pressure authorization control",
    canonicalSummary:
      "HealthKit combined systolic and diastolic blood-pressure authorization into one interface control while retaining separate API requests.",
    category: "enhancement",
    action: "changed",
    locator: "HealthKit — New Features; 153579893",
    summary:
      "The archived state describes one blood-pressure switch in authorization UI and tells applications to continue requesting both underlying data types.",
  },
  {
    suffix: "healthkit-blood-pressure-correlation",
    title: "Blood-pressure correlation validation fix",
    canonicalSummary:
      "HealthKit corrected blood-pressure correlation saving around the required systolic and diastolic sample pairing.",
    category: "bugFix",
    action: "fixed",
    locator: "HealthKit — Resolved Issues; 151889745",
    summary:
      "The initial note state records corrected validation for blood-pressure correlation objects and their paired quantity samples.",
  },
  {
    suffix: "keyboard-diacritical-selection",
    title: "Keyboard diacritical selection known issue",
    canonicalSummary:
      "Apple documented that choosing a diacritical mark or character variant could insert only the base character.",
    category: "knownIssue",
    action: "knownIssue",
    locator: "Keyboard — Known Issues; 159398021",
    summary:
      "The Beta 1 archive warns that the character-variant chooser could discard the selected variant and enter its unmodified base character.",
  },
  {
    suffix: "nearby-interaction-uwb-parameters",
    title: "Additional Nearby Interaction UWB parameters",
    canonicalSummary:
      "Nearby Interaction configuration gained support for additional ultra-wideband parameters, including hopping mode.",
    category: "developerApi",
    action: "introduced",
    locator: "NearbyInteraction — New Features; 157879907",
    summary:
      "The archived developer notes add more UWB configuration options to NINearbyAccessoryConfiguration and identify hopping mode as an example.",
  },
  {
    suffix: "nearby-interaction-dltdoa-session",
    title: "Nearby Interaction DLTDOA session known issue",
    canonicalSummary:
      "Apple documented that starting a Nearby Interaction session with DLTDOA configuration could return an error.",
    category: "knownIssue",
    action: "knownIssue",
    locator: "NearbyInteraction — Known Issues; 151352056",
    summary:
      "The initial state flags an error when NISession runs with an NIDLTDOAConfiguration.",
  },
  {
    suffix: "siri-portuguese-news-fallback",
    title: "Portuguese Siri News fallback known issue",
    canonicalSummary:
      "Portuguese Siri requests about News could fall back to web search or ChatGPT.",
    category: "knownIssue",
    action: "knownIssue",
    locator: "Siri — Known Issues; 153935878",
    summary:
      "Apple's Beta 1 notes warn that Portuguese News questions might be routed away from the intended Siri result.",
  },
  {
    suffix: "siri-portuguese-voice-preview",
    title: "Portuguese Siri voice-preview mismatch",
    canonicalSummary:
      "The Siri voice preview could default to older Brazilian Portuguese voices instead of the new Portugal Portuguese choices.",
    category: "knownIssue",
    action: "knownIssue",
    locator: "Siri — Known Issues; 155929981",
    summary:
      "The archived state identifies a pt-BR preview fallback and suggests selecting Voice 2 and asking Siri a question to hear the pt-PT voice.",
  },
  {
    suffix: "siri-portuguese-pronunciation",
    title: "Initial pt-PT Siri pronunciation issues",
    canonicalSummary:
      "Apple documented pronunciation and word-stress problems in the initial Portugal Portuguese Siri voices.",
    category: "knownIssue",
    action: "knownIssue",
    locator: "Siri — Known Issues; 160205691",
    summary:
      "The initial beta state asks for feedback on pronunciation and stress problems in the first pt-PT voice set.",
  },
  {
    suffix: "swiftui-animatable-back-deployment",
    title: "SwiftUI Animatable macro back-deployment",
    canonicalSummary:
      "SwiftUI made the Animatable macro available back to iOS 13 and aligned legacy platform versions.",
    category: "developerApi",
    action: "introduced",
    locator: "SwiftUI — New Features; 158895616",
    summary:
      "The archived notes extend the macro's declared availability to iOS 13, macOS 10.15, tvOS 13, and watchOS 6.",
  },
  {
    suffix: "swiftui-toolbar-button-symbol",
    title: "SwiftUI toolbar button symbol fix",
    canonicalSummary:
      "SwiftUI corrected toolbar buttons that showed text instead of a symbol when no explicit label was supplied.",
    category: "bugFix",
    action: "fixed",
    locator: "SwiftUI — Resolved Issues; 157671221",
    summary:
      "Apple marks the unintended text rendering of implicitly labeled toolbar buttons as resolved.",
  },
  {
    suffix: "swiftui-navigation-indicator-crash",
    title: "SwiftUI navigation indicator crash fix",
    canonicalSummary:
      "SwiftUI corrected a navigationLinkIndicatorVisibility crash on older aligned releases when applications are rebuilt with the 26.1 SDK.",
    category: "bugFix",
    action: "fixed",
    locator: "SwiftUI — Resolved Issues; 158236264 and FB19613386",
    summary:
      "The initial notes require recompilation against the 26.1 SDK to receive the navigation-indicator compatibility fix.",
  },
  {
    suffix: "swiftui-focus-state-safe-area-bar",
    title: "SwiftUI FocusState safe-area-bar known issue",
    canonicalSummary:
      "Apple documented that SwiftUI FocusState did not work inside safeAreaBar on iOS and iPadOS.",
    category: "knownIssue",
    action: "knownIssue",
    locator: "SwiftUI — Known Issues; 158720838",
    summary:
      "The archived Beta 1 state limits this focus-management issue to the shared iOS and iPadOS safe-area-bar context.",
  },
  {
    suffix: "uikit-uidocument-actor-annotation",
    title: "UIDocument actor annotation correction",
    canonicalSummary:
      "UIKit corrected UIDocument's main-actor annotation, which could surface new compiler diagnostics in affected Swift code.",
    category: "developerApi",
    action: "changed",
    locator: "UIKit — Resolved Issues; 149990945",
    summary:
      "Apple's initial note state says the prior main-actor-only annotation was incorrect and warns that the correction can expose warnings or errors.",
  },
];

const mobile261Beta4Specs = [
  {
    suffix: "lock-screen-unexpected-sleep",
    title: "Lock Screen app sleep issue resolved",
    canonicalSummary:
      "Apple changed an unexpected-sleep problem in several Lock Screen apps from a known issue to a resolved issue.",
    category: "bugFix",
    action: "fixed",
    locator: "Lock Screen — Resolved Issues; 162150524",
    beforeLocator: "Lock Screen — Known Issues; 162150524",
    summary:
      "The Beta 4 snapshot moves unexpected sleep in Calculator, Timer, and Notes from Known Issues to Resolved Issues and removes the wake-and-relaunch workaround.",
  },
  {
    suffix: "webkit-navigation-cancel-trace",
    title: "WebKit navigation-cancel stack trace known issue",
    canonicalSummary:
      "Apple documented that cancelling a WebKit navigation policy could print a crash-like stack trace to standard error even though the application had not crashed.",
    category: "knownIssue",
    action: "knownIssue",
    locator: "WebKit — Known Issues; 156957269",
    beforeLocator: "WebKit section absent from the preceding item inventory",
    summary:
      "The Beta 4 state adds guidance that the stderr trace produced after a cancelled navigation policy can be ignored.",
  },
];

const mobile261RcSpecs = [
  {
    suffix: "airdrop-share-sheet-icon",
    title: "AirDrop share-sheet icon defect resolved",
    canonicalSummary:
      "Apple changed corner artifacts in the AirDrop share-sheet icon from a known issue to a resolved issue.",
    category: "bugFix",
    action: "fixed",
    locator: "AirDrop — Resolved Issues; 158979986",
    beforeLocator: "AirDrop — Known Issues; 158979986",
    summary:
      "The RC snapshot reclassifies the AirDrop icon's corner rendering defects as fixed.",
  },
  {
    suffix: "keyboard-diacritical-selection",
    title: "Keyboard diacritical selection issue resolved",
    canonicalSummary:
      "Apple changed the keyboard character-variant selection failure from a known issue to a resolved issue.",
    category: "bugFix",
    action: "fixed",
    locator: "Keyboard — Resolved Issues; 159398021",
    beforeLocator: "Keyboard — Known Issues; 159398021",
    summary:
      "The RC state marks the prior failure to insert selected diacritical marks and character variants as fixed.",
  },
];

const mobile262Beta2Specs = [
  {
    suffix: "airdrop-cross-beta-discoverability",
    title: "AirDrop cross-beta discoverability issue",
    canonicalSummary:
      "Apple documented that devices left in Everyone mode on 26.2 Beta 1 might not be discoverable from devices running Beta 2.",
    category: "knownIssue",
    action: "knownIssue",
    locator: "AirDrop — Known Issues; 163636875",
    summary:
      "The self-identifying Beta 2 note recommends updating both devices to Beta 2 or ensuring that their Apple Account contact details are mutually saved.",
  },
];

const mobile263Beta3Specs = [
  {
    suffix: "continuity-iphone17-ipad-pro-m5",
    title: "Continuity feature outage on newer devices",
    canonicalSummary:
      "Apple documented that several Continuity workflows were unavailable on iPhone 17-family devices, iPhone Air, and iPad Pro with M5 during 26.3 Beta 3.",
    category: "knownIssue",
    action: "knownIssue",
    locator: "Continuity — Known Issues; 168555883",
    beforeLocator:
      "Beta 2 raw snapshot contains no itemized Continuity section",
    summary:
      "The added Beta 3 entry covers iPhone Mirroring, AirPlay mirroring to Apple TV 4K, wireless Continuity Camera, and Sidecar with the named device families.",
  },
];

const mac261Beta1Specs = [
  {
    suffix: "apple-tv-search-bar",
    title: "Apple TV app search-bar known issue",
    canonicalSummary:
      "Apple documented that the Search bar could be missing from the Apple TV application on macOS.",
    category: "knownIssue",
    action: "knownIssue",
    locator: "Apple TV app — Known Issues; 159419539",
    summary:
      "The first retained macOS 26.1 beta state lists the missing Apple TV app search control as a known issue.",
  },
  {
    suffix: "background-assets-local-url-lookup",
    title: "Background Assets local URL lookup fix",
    canonicalSummary:
      "Background Assets corrected local file URL lookup so an already downloaded asset could be located without an unexpected error.",
    category: "bugFix",
    action: "fixed",
    locator: "Background Assets — Resolved Issues; 157959878 and FB19512759",
    summary:
      "The archived macOS state marks the AssetPackManager lookup failure for locally stored asset files as resolved.",
  },
  {
    suffix: "game-controller-timestamp-domain",
    title: "Game controller press timestamp correction",
    canonicalSummary:
      "Game Controller corrected the time domain used by the last-pressed-state timestamp.",
    category: "bugFix",
    action: "fixed",
    locator: "Game Controller — Resolved Issues; 159124910",
    summary:
      "Apple's initial macOS beta notes resolve the incorrect time domain returned for a controller input's last-pressed timestamp.",
  },
  {
    suffix: "sudo-configuration-ownership",
    title: "sudo configuration ownership checks",
    canonicalSummary:
      "Apple documented stricter ownership checks for sudo configuration files that could cause non-root-owned configuration to be ignored.",
    category: "knownIssue",
    action: "knownIssue",
    locator: "sudo — Known Issues; 155330149 and FB18698477",
    summary:
      "The archived note explains that sudo may fail when its configuration owner is not root and provides a Recovery-based ownership repair.",
  },
  {
    suffix: "swiftui-navigation-indicator-crash",
    title: "SwiftUI navigation indicator crash fix",
    canonicalSummary:
      "SwiftUI corrected a navigationLinkIndicatorVisibility crash on older aligned releases when applications are rebuilt with the 26.1 SDK.",
    category: "bugFix",
    action: "fixed",
    locator: "SwiftUI — Resolved Issues; 158236264 and FB19613386",
    summary:
      "The first macOS beta state documents the SDK-rebuild requirement for receiving this cross-version SwiftUI compatibility fix.",
  },
];

const mac261Beta2Specs = [
  {
    suffix: "game-controller-concurrent-queue-delay",
    title: "Game controller input-delay fix",
    canonicalSummary:
      "Game Controller corrected input delays that could occur when many tasks were submitted to the default global concurrent queue.",
    category: "bugFix",
    action: "fixed",
    locator: "Game Controller — Resolved Issues; 159163570",
    beforeLocator:
      "Game Controller section before Beta 2 lacks issue 159163570",
    summary:
      "The Beta 2 state adds a resolved issue for delayed controller input under heavy use of the default concurrent queue.",
  },
  {
    suffix: "game-controller-background-events",
    title: "Background game controller event fix",
    canonicalSummary:
      "Game Controller corrected a failure that could prevent non-UI processes from receiving controller input while background-event monitoring was enabled.",
    category: "bugFix",
    action: "fixed",
    locator: "Game Controller — Resolved Issues; 160974748 and FB20307654",
    beforeLocator:
      "Game Controller section before Beta 2 lacks issue 160974748",
    summary:
      "The Beta 2 archive adds a fix for controller events in non-UI processes using background-event monitoring.",
  },
];

const vision262Beta1Specs = [
  {
    suffix: "logitech-muse-stylus-events",
    title: "Logitech Muse stylus event routing",
    canonicalSummary:
      "Game Controller added a stylus event type that applications can opt into when handling Logitech Muse input directly.",
    category: "developerApi",
    action: "introduced",
    locator: "Game Controller — New Features; 160811739",
    summary:
      "The initial visionOS 26.2 state explains how UIKit and SwiftUI applications can request Muse input through Game Controller instead of default UI events.",
  },
  {
    suffix: "logitech-muse-force-normalization",
    title: "Logitech Muse force-value correction",
    canonicalSummary:
      "Game Controller corrected non-normalized force values from Logitech Muse controls and documented physical input extents for scaling.",
    category: "bugFix",
    action: "fixed",
    locator: "Game Controller — Resolved Issues; 159136834",
    summary:
      "The archived note points developers to GCPhysicalInputExtents when converting Muse tip and secondary-button forces.",
  },
  {
    suffix: "instruments-swift-reference-counting",
    title: "Allocations Swift reference-counting fix",
    canonicalSummary:
      "Instruments corrected cases where Allocations failed to report reference-counting operations for native Swift types.",
    category: "bugFix",
    action: "fixed",
    locator: "Instruments — Resolved Issues; 163080666",
    summary:
      "The first retained beta state marks missing Swift reference-counting operations in Allocations as resolved.",
  },
  {
    suffix: "storekit-win-back-offer-testing",
    title: "StoreKit win-back offer testing fix",
    canonicalSummary:
      "StoreKit Testing corrected a failure that could block subscription purchases using a win-back offer.",
    category: "bugFix",
    action: "fixed",
    locator: "StoreKit — Resolved Issues; 162357552 and FB20604848",
    summary:
      "The initial visionOS 26.2 note state records a fix for win-back subscription purchases tested through Xcode.",
  },
  {
    suffix: "storekit-stale-subscription-status",
    title: "Stale StoreKit subscription status known issue",
    canonicalSummary:
      "Apple documented that SubscriptionStatus.all could continue returning an earlier status after a subscription changed.",
    category: "knownIssue",
    action: "knownIssue",
    locator: "StoreKit — Known Issues; 163505178",
    summary:
      "The archived note recommends waiting before retrying when a subscription change is not reflected in the returned status.",
  },
];

const vision263Beta1Specs = [
  {
    suffix: "psvr2-sense-touch-state",
    title: "PlayStation VR2 Sense touch-state fix",
    canonicalSummary:
      "Game Controller corrected touch-state reporting for some buttons on PlayStation VR2 Sense controllers.",
    category: "bugFix",
    action: "fixed",
    locator: "Game Controller — Resolved Issues; 161227641 and FB20352828",
    summary:
      "The first retained visionOS 26.3 beta state marks unreliable GCTouchedStateInput values on the named controllers as resolved.",
  },
];

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function sha256(value) {
  return createHash("sha256").update(value).digest("hex");
}

function citation(url, locator, note) {
  return {
    url,
    ...(locator ? { locator } : {}),
    ...(note ? { note } : {}),
  };
}

function uniqueCitations(citations) {
  return [
    ...new Map(
      citations.map((item) => [
        `${item.url}|${item.locator || ""}|${item.note || ""}`,
        item,
      ]),
    ).values(),
  ];
}

function article(blocks) {
  return { authorship: "originalSynthesis", blocks };
}

function heading(text) {
  return { style: "h2", text };
}

function paragraph(text, citations) {
  return { text, citations };
}

function review() {
  return { status: "approved", reviewedAt };
}

function versionId(platformSlug, version) {
  return `version-${platformSlug}-${version.replaceAll(".", "-")}`;
}

function routeAlias(label) {
  return label.toLowerCase().replaceAll(" ", "-");
}

function changeFromInitial(prefix, spec, evidence) {
  return {
    key: `${prefix}-${spec.suffix}`,
    title: spec.title,
    canonicalSummary: spec.canonicalSummary,
    category: spec.category,
    action: spec.action,
    inheritance: "delta",
    summary: spec.summary,
    documentedStatus: "documented",
    evidenceState: "confirmed",
    verificationMethod:
      "Direct fact from the first CDX-confirmed Apple DocC state after Beta 1 and before Beta 2. This records the initial documented beta state; it does not assert the exact hour each item first appeared.",
    citations: [
      citation(
        evidence.url,
        `${spec.locator}; raw payload ${evidence.rawTimestamp}`,
      ),
    ],
  };
}

function changeFromDelta(prefix, spec, before, after, verificationMethod) {
  return {
    key: `${prefix}-${spec.suffix}`,
    title: spec.title,
    canonicalSummary: spec.canonicalSummary,
    category: spec.category,
    action: spec.action,
    inheritance: "delta",
    summary: spec.summary,
    documentedStatus: "documented",
    evidenceState: "confirmed",
    verificationMethod,
    citations: [
      citation(
        before.url,
        `${spec.beforeLocator}; raw payload ${before.rawTimestamp}`,
      ),
      citation(after.url, `${spec.locator}; raw payload ${after.rawTimestamp}`),
    ],
  };
}

function changeFromDirectState(prefix, spec, evidence) {
  return {
    key: `${prefix}-${spec.suffix}`,
    title: spec.title,
    canonicalSummary: spec.canonicalSummary,
    category: spec.category,
    action: spec.action,
    inheritance: "delta",
    summary: spec.summary,
    documentedStatus: "documented",
    evidenceState: "confirmed",
    verificationMethod:
      "Direct fact from a raw Apple DocC payload whose title identifies Beta 2 and whose AirDrop entry explicitly compares 26.2 Beta 1 with Beta 2. Other cumulative entries in that first retained state are intentionally excluded.",
    citations: [
      citation(
        evidence.url,
        `${spec.locator}; raw payload ${evidence.rawTimestamp}`,
      ),
    ],
  };
}

function eventShell({
  platformName,
  platformSlug,
  version,
  label,
  date,
  summary,
  blocks,
  changes,
}) {
  const identity = citation(
    releaseIndexUrl,
    `${platformName} ${version} ${label}; ${date}`,
  );
  return {
    target: {
      releaseVersionId: versionId(platformSlug, version),
      routeAlias: routeAlias(label),
    },
    authorship: "originalSynthesis",
    summary,
    article: article([
      heading("Release identity"),
      paragraph(
        `This article enriches the existing ${platformName} ${version} ${label} route dated ${date}. It does not alter the audited timeline date or create a second event.`,
        [identity],
      ),
      ...blocks,
    ]),
    citations: uniqueCitations([
      identity,
      ...changes.flatMap((change) => change.citations),
    ]),
    changes,
    provenanceStatus: "editoriallyVerified",
    editorialReview: review(),
    isIndexable: true,
  };
}

function initialEvent({
  platformName,
  platformSlug,
  version,
  label = "Beta 1",
  date,
  evidence,
  specs,
  prefix,
  scope,
}) {
  const sourceCitation = citation(
    evidence.url,
    `Human capture ${evidence.humanTimestamp}; raw DocC payload ${evidence.rawTimestamp}`,
  );
  const changes = specs.map((spec) =>
    changeFromInitial(prefix, spec, evidence),
  );
  return eventShell({
    platformName,
    platformSlug,
    version,
    label,
    date,
    summary: `The first retained Apple DocC state after ${platformName} ${version} Beta 1 and before Beta 2 contains ${changes.length} substantive, itemized developer-note ${changes.length === 1 ? "entry" : "entries"}.`,
    blocks: [
      heading("Archived Apple note state"),
      paragraph(
        `Internet Archive retained Apple's human documentation shell and its structured DocC payload during the interval after Beta 1 and before Beta 2. The raw document identifies itself as the ${platformName} ${version} beta notes and contains ${changes.length} itemized ${changes.length === 1 ? "entry" : "entries"} represented here.`,
        [sourceCitation],
      ),
      heading("Documented initial inventory"),
      paragraph(
        `The preserved state covers ${scope}. Resolved issues, new capabilities, API changes, and known issues remain separately labeled in the structured inventory.`,
        [sourceCitation],
      ),
      heading("Attribution boundary"),
      paragraph(
        "This is direct initial-snapshot evidence, not a claim that every item appeared at the exact release hour. The raw capture falls before Beta 2, so no later milestone is crossed and no final cumulative note is copied backward.",
        [sourceCitation],
      ),
    ],
    changes,
  });
}

function deltaEvent({
  platformName,
  platformSlug,
  version,
  label,
  date,
  before,
  after,
  specs,
  prefix,
  deltaDescription,
  boundaryDescription,
  verificationMethod,
}) {
  const beforeCitation = citation(
    before.url,
    `Before state: human capture ${before.humanTimestamp}; raw payload ${before.rawTimestamp}`,
  );
  const afterCitation = citation(
    after.url,
    `After state: human capture ${after.humanTimestamp}; raw payload ${after.rawTimestamp}`,
  );
  const changes = specs.map((spec) =>
    changeFromDelta(prefix, spec, before, after, verificationMethod),
  );
  return eventShell({
    platformName,
    platformSlug,
    version,
    label,
    date,
    summary: `A sequential comparison of preserved Apple DocC states supports ${changes.length} substantive ${platformName} ${version} ${label} ${changes.length === 1 ? "delta" : "deltas"} without importing later cumulative notes.`,
    blocks: [
      heading("Sequential archive comparison"),
      paragraph(
        `The before and after payloads preserve different Apple note states around ${platformName} ${version} ${label}. ${deltaDescription}`,
        [beforeCitation, afterCitation],
      ),
      heading(`Documented ${label} delta`),
      paragraph(
        `The structured comparison yields ${changes.length} substantive ${changes.length === 1 ? "item" : "items"}. Each occurrence retains the Apple component, status heading, and issue-number locator used during review.`,
        [beforeCitation, afterCitation],
      ),
      heading("Attribution boundary"),
      paragraph(boundaryDescription, [beforeCitation, afterCitation]),
    ],
    changes,
  });
}

function directStateEvent({
  platformName,
  platformSlug,
  version,
  label,
  date,
  evidence,
  specs,
  prefix,
}) {
  const sourceCitation = citation(
    evidence.url,
    `Human capture ${evidence.humanTimestamp}; raw payload ${evidence.rawTimestamp}; self-identifying Beta 2 state`,
  );
  const changes = specs.map((spec) =>
    changeFromDirectState(prefix, spec, evidence),
  );
  return eventShell({
    platformName,
    platformSlug,
    version,
    label,
    date,
    summary: `The first retained ${platformName} ${version} raw note state identifies itself as Beta 2 and contains one AirDrop issue that explicitly compares Beta 1 with Beta 2.`,
    blocks: [
      heading("Direct Beta 2 evidence"),
      paragraph(
        "The raw Apple DocC payload identifies itself as the Beta 2 release notes. Its AirDrop entry expressly distinguishes devices configured on Beta 1 from devices running Beta 2, making that one behavior route-specific without relying on a cumulative-note inference.",
        [sourceCitation],
      ),
      heading("Documented Beta 2 issue"),
      paragraph(
        "Apple records a discoverability failure across the two beta states and gives two workarounds: update both devices to Beta 2 or store the other device owner's Apple Account contact details.",
        [sourceCitation],
      ),
      heading("Attribution boundary"),
      paragraph(
        "The archive has no earlier 26.2 raw payload, and this capture occurred on the Beta 3 calendar date while still carrying a Beta 2 title. The remaining cumulative entries are excluded; only the statement that explicitly names Beta 1 and Beta 2 is attached to this route.",
        [sourceCitation],
      ),
    ],
    changes,
  });
}

const eventRecords = [];

function addEvent(event, ledger) {
  eventRecords.push({ event, ledger });
}

for (const platform of [
  { name: "iOS", slug: "ios" },
  { name: "iPadOS", slug: "ipados" },
]) {
  addEvent(
    initialEvent({
      platformName: platform.name,
      platformSlug: platform.slug,
      version: "26.1",
      date: "2025-09-22",
      evidence: E.mobile261Beta1,
      specs: mobile261Beta1Specs,
      prefix: "ios-ipados-26-1-beta-1",
      scope:
        "Background Assets, Game Controller, HealthKit, Keyboard, Nearby Interaction, Siri, SwiftUI, and UIKit",
    }),
    {
      mode: "direct initial snapshot",
      before: "—",
      after: E.mobile261Beta1.rawTimestamp,
    },
  );
  addEvent(
    deltaEvent({
      platformName: platform.name,
      platformSlug: platform.slug,
      version: "26.1",
      label: "Beta 4",
      date: "2025-10-20",
      before: E.mobile261PreBeta4,
      after: E.mobile261Beta4,
      specs: mobile261Beta4Specs,
      prefix: "ios-ipados-26-1-beta-4",
      deltaDescription:
        "The earlier payload still calls itself Beta 3; the next state calls itself Beta 4, moves the Lock Screen issue to Resolved Issues, and adds the WebKit stderr-trace warning.",
      boundaryDescription:
        "The title transition anchors the documentary change to Beta 4. The baseline was captured on the Beta 4 calendar date before Apple's note page changed state, so this is a timestamped documentation-boundary inference rather than a claim about seed publication time.",
      verificationMethod:
        "Sequential raw Apple DocC comparison from a Beta 3-titled state captured on the Beta 4 date to the first Beta 4-titled state, with no later 26.1 milestone crossed.",
    }),
    {
      mode: "title-anchored sequential delta",
      before: E.mobile261PreBeta4.rawTimestamp,
      after: E.mobile261Beta4.rawTimestamp,
    },
  );
  addEvent(
    deltaEvent({
      platformName: platform.name,
      platformSlug: platform.slug,
      version: "26.1",
      label: "RC",
      date: "2025-10-28",
      before: E.mobile261Beta4,
      after: E.mobile261Rc,
      specs: mobile261RcSpecs,
      prefix: "ios-ipados-26-1-rc",
      deltaDescription:
        "The Beta 4 state labels the AirDrop icon and keyboard character-variant defects as known issues; the pre-public RC state moves both issue IDs to Resolved Issues.",
      boundaryDescription:
        "The before state follows Beta 4 and the after state follows RC but precedes Public. No other 26.1 milestone falls between those captures, so the two status transitions are assigned to RC.",
      verificationMethod:
        "Sequential diff of raw Apple DocC payloads captured after Beta 4 and after RC, before Public, with matching component names and issue identifiers.",
    }),
    {
      mode: "isolated sequential delta",
      before: E.mobile261Beta4.rawTimestamp,
      after: E.mobile261Rc.rawTimestamp,
    },
  );
  addEvent(
    directStateEvent({
      platformName: platform.name,
      platformSlug: platform.slug,
      version: "26.2",
      label: "Beta 2",
      date: "2025-11-12",
      evidence: E.mobile262Beta2,
      specs: mobile262Beta2Specs,
      prefix: "ios-ipados-26-2-beta-2",
    }),
    {
      mode: "direct self-identifying snapshot fact",
      before: "—",
      after: E.mobile262Beta2.rawTimestamp,
    },
  );
  addEvent(
    deltaEvent({
      platformName: platform.name,
      platformSlug: platform.slug,
      version: "26.3",
      label: "Beta 3",
      date: "2026-01-26",
      before: E.mobile263Beta2,
      after: E.mobile263Beta3,
      specs: mobile263Beta3Specs,
      prefix: "ios-ipados-26-3-beta-3",
      deltaDescription:
        "The preserved Beta 2 payload has no itemized entries. The Beta 3 payload adds one Continuity known issue with a retained Apple issue identifier.",
      boundaryDescription:
        "The baseline follows Beta 2 and precedes Beta 3; the after state follows Beta 3 and precedes RC. Beta 3 is the only intervening milestone, so the Continuity entry is an isolated snapshot delta.",
      verificationMethod:
        "Sequential raw Apple DocC comparison between an item-free Beta 2 state and the first itemized Beta 3 state, bracketing Beta 3 and no other 26.3 milestone.",
    }),
    {
      mode: "isolated sequential delta",
      before: E.mobile263Beta2.rawTimestamp,
      after: E.mobile263Beta3.rawTimestamp,
    },
  );
}

addEvent(
  initialEvent({
    platformName: "macOS",
    platformSlug: "macos",
    version: "26.1",
    date: "2025-09-22",
    evidence: E.mac261Beta1,
    specs: mac261Beta1Specs,
    prefix: "macos-26-1-beta-1",
    scope:
      "the Apple TV app, Background Assets, Game Controller, sudo configuration ownership, and SwiftUI compatibility",
  }),
  {
    mode: "direct initial snapshot",
    before: "—",
    after: E.mac261Beta1.rawTimestamp,
  },
);

addEvent(
  deltaEvent({
    platformName: "macOS",
    platformSlug: "macos",
    version: "26.1",
    label: "Beta 2",
    date: "2025-10-06",
    before: E.mac261Beta1,
    after: E.mac261Beta2,
    specs: mac261Beta2Specs,
    prefix: "macos-26-1-beta-2",
    deltaDescription:
      "The first state contains one Game Controller item. The next state identifies itself as Beta 2 and adds two resolved Game Controller issues.",
    boundaryDescription:
      "The after payload was captured on the Beta 3 calendar date but still identifies itself as Beta 2. The two additions are therefore title-anchored to the retained Beta 2 documentation state; the ledger does not claim a precise release-hour boundary.",
    verificationMethod:
      "Sequential raw Apple DocC comparison from the initial Beta state to a self-identifying Beta 2 state. The capture date coincides with the later Beta 3 calendar date, so title and issue-state evidence are stated explicitly.",
  }),
  {
    mode: "title-anchored sequential delta",
    before: E.mac261Beta1.rawTimestamp,
    after: E.mac261Beta2.rawTimestamp,
  },
);

addEvent(
  initialEvent({
    platformName: "visionOS",
    platformSlug: "visionos",
    version: "26.2",
    date: "2025-11-04",
    evidence: E.vision262Beta1,
    specs: vision262Beta1Specs,
    prefix: "visionos-26-2-beta-1",
    scope:
      "Logitech Muse input, Game Controller force values, Instruments allocation reporting, and StoreKit testing and status behavior",
  }),
  {
    mode: "direct initial snapshot",
    before: "—",
    after: E.vision262Beta1.rawTimestamp,
  },
);

addEvent(
  initialEvent({
    platformName: "visionOS",
    platformSlug: "visionos",
    version: "26.3",
    date: "2025-12-15",
    evidence: E.vision263Beta1,
    specs: vision263Beta1Specs,
    prefix: "visionos-26-3-beta-1",
    scope: "Game Controller touch-state reporting for PlayStation VR2 Sense",
  }),
  {
    mode: "direct initial snapshot",
    before: "—",
    after: E.vision263Beta1.rawTimestamp,
  },
);

const events = eventRecords.map((record) => record.event);

const sources = [
  releaseIndexSource,
  ...Object.values(E).map((item) => item.source),
];

const bundle = {
  formatVersion: 1,
  target: { projectId: "lh3yswzu", dataset: "production" },
  accessedAt,
  sources,
  versions: [],
  events,
  builds: [],
};

const expectedSeed = {
  "iOS 26.1":
    "Beta 1@2025-09-22|Beta 2@2025-10-06|Beta 3@2025-10-13|Beta 4@2025-10-20|RC@2025-10-28|Public@2025-11-03",
  "iOS 26.2":
    "Beta 1@2025-11-04|Beta 2@2025-11-12|Beta 3@2025-11-17|RC@2025-12-03|RC 2@2025-12-08|Public@2025-12-12",
  "iOS 26.3":
    "Beta 1@2025-12-15|Beta 2@2026-01-12|Beta 3@2026-01-26|RC@2026-02-04|Public@2026-02-11",
  "iPadOS 26.1":
    "Beta 1@2025-09-22|Beta 2@2025-10-06|Beta 3@2025-10-13|Beta 4@2025-10-20|RC@2025-10-28|Public@2025-11-03",
  "iPadOS 26.2":
    "Beta 1@2025-11-04|Beta 2@2025-11-12|Beta 3@2025-11-17|RC@2025-12-03|RC 2@2025-12-08|Public@2025-12-12",
  "iPadOS 26.3":
    "Beta 1@2025-12-15|Beta 2@2026-01-12|Beta 3@2026-01-26|RC@2026-02-04|Public@2026-02-11",
  "macOS 26.1":
    "Beta 1@2025-09-22|Beta 2@2025-10-06|Beta 3@2025-10-13|Beta 4@2025-10-20|RC@2025-10-28|Public@2025-11-03",
  "macOS 26.2":
    "Beta 1@2025-11-06|Beta 2@2025-11-12|Beta 3@2025-11-17|RC@2025-12-03|Public@2025-12-12",
  "macOS 26.3":
    "Beta 1@2025-12-15|Beta 2@2026-01-12|Beta 3@2026-01-26|RC@2026-02-04|Public@2026-02-11",
  "visionOS 26.1":
    "Beta 1@2025-09-22|Beta 2@2025-10-06|Beta 4@2025-10-20|RC@2025-10-28|Public@2025-11-03",
  "visionOS 26.2":
    "Beta 1@2025-11-04|Beta 2@2025-11-12|Beta 3@2025-11-17|RC@2025-12-03|Public@2025-12-12",
  "visionOS 26.3":
    "Beta 1@2025-12-15|Beta 2@2026-01-12|Beta 3@2026-01-26|RC@2026-02-04|Public@2026-02-11",
};

const expectedPublicDates = {
  26.1: "2025-11-03",
  26.2: "2025-12-12",
  26.3: "2026-02-11",
};

function signature(milestones) {
  return milestones
    .map(
      (milestone) =>
        `${milestone.label}@${milestone.date}${milestone.isRevision ? "*" : ""}`,
    )
    .join("|");
}

const seed = JSON.parse(await readFile(seedPath, "utf8"));
const seedVersions = seed.releaseVersions
  .filter(
    (version) =>
      ["26.1", "26.2", "26.3"].includes(version.version) &&
      ["iOS", "iPadOS", "macOS", "visionOS"].includes(version.platform),
  )
  .sort((left, right) =>
    `${left.platform}/${left.version}`.localeCompare(
      `${right.platform}/${right.version}`,
    ),
  );

assert(seedVersions.length === 12, "Expected 12 seed versions in the cohort.");
for (const version of seedVersions) {
  const key = `${version.platform} ${version.version}`;
  assert(expectedSeed[key], `Unexpected seed version ${key}.`);
  assert(
    signature(version.milestones) === expectedSeed[key],
    `${key} milestone closure changed.`,
  );
  assert(
    version.publicReleaseDate === expectedPublicDates[version.version],
    `${key} public date changed.`,
  );
  if (key === "visionOS 26.1") {
    assert(
      version.versionNote === "Beta 3 date not confirmed; omitted",
      "visionOS 26.1 uncertainty note changed.",
    );
  } else {
    assert(!version.versionNote, `${key} unexpectedly gained a version note.`);
  }
}

const seedMilestones = seedVersions.flatMap((version) =>
  version.milestones.map((milestone) => ({
    platform: version.platform,
    version: version.version,
    releaseVersionId: versionId(
      version.platform.toLowerCase(),
      version.version,
    ),
    routeAlias: routeAlias(milestone.label),
    ...milestone,
  })),
);
const publicMilestones = seedMilestones.filter(
  (milestone) => milestone.label === "Public",
);
const prereleaseMilestones = seedMilestones.filter(
  (milestone) => milestone.label !== "Public",
);
const expectedRoutes = new Set(
  events.map(
    (event) => `${event.target.releaseVersionId}/${event.target.routeAlias}`,
  ),
);
const supportedMilestones = prereleaseMilestones.filter((milestone) =>
  expectedRoutes.has(`${milestone.releaseVersionId}/${milestone.routeAlias}`),
);
const unsupportedMilestones = prereleaseMilestones.filter(
  (milestone) =>
    !expectedRoutes.has(
      `${milestone.releaseVersionId}/${milestone.routeAlias}`,
    ),
);

assert(seedMilestones.length === 65, "Expected 65 total seed milestones.");
assert(publicMilestones.length === 12, "Expected 12 Public milestones.");
assert(
  prereleaseMilestones.length === 53,
  "Expected 53 prerelease milestones.",
);
assert(
  supportedMilestones.length === 14,
  "Expected exactly 14 evidence-supported routes.",
);
assert(
  unsupportedMilestones.length === 39,
  "Expected exactly 39 ledger-only evidence gaps.",
);

assert(bundle.versions.length === 0, "Version overlays are out of scope.");
assert(bundle.events.length === 14, "Expected 14 event overlays.");
assert(bundle.builds.length === 0, "Build overlays are out of scope.");

const occurrences = events.flatMap((event) => event.changes);
assert(occurrences.length === 55, "Expected 55 change occurrences.");
assert(
  new Set(occurrences.map((change) => change.key)).size === 34,
  "Expected 34 stable change definitions.",
);

for (const event of events) {
  assert(
    JSON.stringify(Object.keys(event.target).sort()) ===
      JSON.stringify(["releaseVersionId", "routeAlias"]),
    "Event selectors must contain only durable version and route fields.",
  );
  const target = `${event.target.releaseVersionId}/${event.target.routeAlias}`;
  assert(expectedRoutes.has(target), `${target} escaped the allowlist.`);
  assert(
    event.target.routeAlias !== "public" &&
      !event.target.routeAlias.includes("public"),
    `${target} is a forbidden Public overlay.`,
  );
  assert(
    event.provenanceStatus === "editoriallyVerified" &&
      event.editorialReview.status === "approved" &&
      event.editorialReview.reviewedAt === reviewedAt &&
      event.isIndexable === true,
    `${target} is not editorially verified, approved, and indexable.`,
  );
  assert(event.changes.length > 0, `${target} lacks a substantive change.`);
  for (const change of event.changes) {
    assert(
      change.documentedStatus === "documented" &&
        change.evidenceState === "confirmed",
      `${change.key} has an unexpected evidence state.`,
    );
  }
}

const sourceUrls = new Set(sources.map((source) => source.url));
assert(sourceUrls.size === sources.length, "Source URLs must be unique.");
for (const item of Object.values(E)) {
  assert(
    item.url.startsWith("https://web.archive.org/web/") &&
      !item.url.includes("/tutorials/data/"),
    `Reader source is not a human archived page: ${item.url}`,
  );
  assert(
    item.rawUrl.startsWith("https://web.archive.org/web/") &&
      item.rawUrl.includes("id_/https://developer.apple.com/tutorials/data/"),
    `Raw archive replay is not exact: ${item.rawUrl}`,
  );
  assert(
    item.source.transportUrl === item.rawUrl &&
      item.source.archiveUrl === item.url &&
      item.source.sourceClass === "archive",
    `Archive source provenance is incomplete for ${item.url}.`,
  );
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

const citations = collectCitations({ events });
for (const item of citations) {
  assert(sourceUrls.has(item.url), `Undeclared citation ${item.url}.`);
}
for (const url of sourceUrls) {
  assert(
    citations.some((item) => item.url === url),
    `Declared source is unused: ${url}`,
  );
}

const jsonFiles = (await readdir(here))
  .filter((file) => file.endsWith(".json") && file !== outputName)
  .sort();
const routeOwners = new Map();
const existingChanges = new Map();
for (const file of jsonFiles) {
  const candidate = JSON.parse(await readFile(join(here, file), "utf8"));
  for (const event of candidate.events || []) {
    if (event.target?.releaseVersionId && event.target?.routeAlias) {
      routeOwners.set(
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
      const prior = existingChanges.get(change.key);
      assert(
        !prior || prior.definition === definition,
        `${change.key} conflicts between ${prior?.file} and ${file}.`,
      );
      existingChanges.set(change.key, { file, definition });
    }
  }
}

for (const event of events) {
  const target = `${event.target.releaseVersionId}/${event.target.routeAlias}`;
  assert(
    !routeOwners.has(target),
    `${target} is already owned by ${routeOwners.get(target)}.`,
  );
}
for (const change of occurrences) {
  const prior = existingChanges.get(change.key);
  if (!prior) continue;
  const definition = JSON.stringify({
    title: change.title,
    canonicalSummary: change.canonicalSummary,
    category: change.category,
  });
  assert(
    prior.definition === definition,
    `${change.key} conflicts with ${prior.file}.`,
  );
}

const expectedPublicOwners = new Map([
  [
    "apple-ios-ipados-26-maintenance.json",
    new Set(
      ["ios", "ipados"].flatMap((platform) =>
        ["26.1", "26.2", "26.3"].map(
          (version) => `${versionId(platform, version)}/public`,
        ),
      ),
    ),
  ],
  [
    "apple-macos-visionos-26-maintenance.json",
    new Set(
      ["macos", "visionos"].flatMap((platform) =>
        ["26.1", "26.2", "26.3"].map(
          (version) => `${versionId(platform, version)}/public`,
        ),
      ),
    ),
  ],
]);
for (const [file, targets] of expectedPublicOwners) {
  const candidate = JSON.parse(await readFile(join(here, file), "utf8"));
  const actual = new Set(
    (candidate.events || []).map(
      (event) =>
        `${event.target?.releaseVersionId}/${event.target?.routeAlias}`,
    ),
  );
  for (const target of targets) {
    assert(actual.has(target), `${file} no longer owns ${target}.`);
  }
}

const snapshotInventory = {
  "ios-ipados-26_1-release-notes": [
    [
      "20250927080956",
      "HYCFBMRMP43A42BX6FGCO352OY5PXOQN",
      3790,
      "iOS & iPadOS 26.1 Beta Release Notes",
    ],
    [
      "20251013223912",
      "HBSDVLW4XEII6WV6Q5O2MJGKRGN6JW6V",
      4079,
      "iOS & iPadOS 26.1 Beta 3 Release Notes",
    ],
    [
      "20251020181850",
      "6DUS2ZSAXFXAQC6MCIMN563SQ6JB3UUO",
      4082,
      "iOS & iPadOS 26.1 Beta 3 Release Notes",
    ],
    [
      "20251023065106",
      "ZECMRP4ACRG5JDUPDBHWWLNE6CHCRGYD",
      4203,
      "iOS & iPadOS 26.1 Beta 4 Release Notes",
    ],
    [
      "20251031011033",
      "ANTTWXF6UYHQHVAWR7RKGWVPAOQ7ZFAC",
      4137,
      "iOS & iPadOS 26.1 RC Release Notes",
    ],
    [
      "20251102085839",
      "ANTTWXF6UYHQHVAWR7RKGWVPAOQ7ZFAC",
      4131,
      "iOS & iPadOS 26.1 RC Release Notes",
    ],
    [
      "20251112061735",
      "3TVTFVHBWLX7533IFVX5QTWPP25WULS6",
      4203,
      "iOS & iPadOS 26.1 Release Notes",
    ],
    [
      "20260104062851",
      "WO4RHRSG4RKOUQA2UY2IX3CNXVUCO5WM",
      4305,
      "iOS & iPadOS 26.1 Release Notes",
    ],
  ],
  "ios-ipados-26_2-release-notes": [
    [
      "20251117094839",
      "KWS2ZPES3ANKEIVDBONNKKL4ZDMCIB25",
      3193,
      "iOS & iPadOS 26.2 Beta 2 Release Notes",
    ],
    [
      "20251205120741",
      "Z4HICG5BP4WNFBS6PHOCXM3PW7JLGEAX",
      3694,
      "iOS & iPadOS 26.2 RC Release Notes",
    ],
    [
      "20251209075502",
      "NOPZ7447UXYIN6E655MQZQ6C65AGW6S7",
      3677,
      "iOS & iPadOS 26.2 RC Release Notes",
    ],
    [
      "20260101230052",
      "QYT4UZNWUTYTAEXYA7TBAZVFHWIBRBWI",
      3755,
      "iOS & iPadOS 26.2 Release Notes",
    ],
    [
      "20260104062805",
      "QYT4UZNWUTYTAEXYA7TBAZVFHWIBRBWI",
      3751,
      "iOS & iPadOS 26.2 Release Notes",
    ],
    [
      "20260212040228",
      "V2IZ3PYSGJGKG36MMEJKVWGIGEG3EA3K",
      3745,
      "iOS & iPadOS 26.2 Release Notes",
    ],
    [
      "20260219063340",
      "E2JLO4MNVKO4577KY7VSSKRUB7QKLHFJ",
      3799,
      "iOS & iPadOS 26.2 Release Notes",
    ],
  ],
  "ios-ipados-26_3-release-notes": [
    [
      "20251218021719",
      "66EBGFJRJ46QB3XQT2PUEPGKEFW6AT2J",
      2239,
      "iOS & iPadOS 26.3 Beta Release Notes",
    ],
    [
      "20260114134647",
      "7LDTUSDAIARK2XWDVDNCEEOLW36YM4UF",
      2235,
      "iOS & iPadOS 26.3 Beta 2 Release Notes",
    ],
    [
      "20260124101739",
      "5OWZMNLJ5NEZOIA4ZCINBADK6BM5VVRP",
      2240,
      "iOS & iPadOS 26.3 Beta 2 Release Notes",
    ],
    [
      "20260129002238",
      "627LG5WW2XLAMKTGVZT5FJULADFYPDRL",
      2447,
      "iOS & iPadOS 26.3 Beta 3 Release Notes",
    ],
    [
      "20260212103529",
      "GURDKLA2CJSEIEPOL3VIXKJTQ3VNGXAG",
      2605,
      "iOS & iPadOS 26.3 Release Notes",
    ],
    [
      "20260212222645",
      "GURDKLA2CJSEIEPOL3VIXKJTQ3VNGXAG",
      2606,
      "iOS & iPadOS 26.3 Release Notes",
    ],
    [
      "20260219063304",
      "FYNKWP3BEFHHFDAWGXH6BT5FUEPZVII3",
      2658,
      "iOS & iPadOS 26.3 Release Notes",
    ],
    [
      "20260228132812",
      "LRBJ7RWTD5U77M7SX3NBDTI5J5Z34HZN",
      2666,
      "iOS & iPadOS 26.3 Release Notes",
    ],
  ],
  "macos-26_1-release-notes": [
    [
      "20250926135045",
      "N2Y4NTGKDR72ANBNKVDKLJCUGYR6X52U",
      2848,
      "macOS Tahoe 26.1 Beta Release Notes",
    ],
    [
      "20251013075600",
      "V5UGJ43DNDYOFVREANBZMJG3NKDHQG2E",
      3020,
      "macOS Tahoe 26.1 Beta 2 Release Notes",
    ],
    [
      "20251104100731",
      "O5RJJXHP4SNAH65I6EAYNPSVE6ZKTBGK",
      3051,
      "macOS Tahoe 26.1 Release Notes",
    ],
    [
      "20251107122047",
      "LHN4WUWX3HMN72CKTBUN3LIR2FY4RRW6",
      3103,
      "macOS Tahoe 26.1 Release Notes",
    ],
    [
      "20251213125406",
      "6UYX3G7ADPVUCONKX6GOU2552LTX6ZO7",
      3141,
      "macOS Tahoe 26.1 Release Notes",
    ],
    [
      "20260401082745",
      "NGBD7RPVX5H7MQREHEA3E627EKLWYZY7",
      3251,
      "macOS Tahoe 26.1 Release Notes",
    ],
  ],
  "macos-26_2-release-notes": [
    [
      "20251204092527",
      "3ZT2RFEZ2ORK2SX2DOWEZMANTUNVYGOS",
      2849,
      "macOS Tahoe 26.2 RC Release Notes",
    ],
    [
      "20251212214116",
      "5JXHZAWV5IEPD4LDNZNUGSXBZNKPU66N",
      3098,
      "macOS Tahoe 26.2 Release Notes",
    ],
    [
      "20251213080310",
      "5JXHZAWV5IEPD4LDNZNUGSXBZNKPU66N",
      3088,
      "macOS Tahoe 26.2 Release Notes",
    ],
    [
      "20251218021737",
      "DZXOPW45URIXXKWCIEB7OVGGNOALR5IV",
      3145,
      "macOS Tahoe 26.2 Release Notes",
    ],
    [
      "20251223074224",
      "DZXOPW45URIXXKWCIEB7OVGGNOALR5IV",
      3139,
      "macOS Tahoe 26.2 Release Notes",
    ],
    [
      "20260108020634",
      "JSDOUNJEHMQNDICP4SZICQB37EVFYAH3",
      3148,
      "macOS Tahoe 26.2 Release Notes",
    ],
    [
      "20260401082822",
      "MQOYIJJUCBDCGMDGVJTMSD2IL6FQFTRL",
      3207,
      "macOS Tahoe 26.2 Release Notes",
    ],
  ],
  "macos-26_3-release-notes": [
    [
      "20251218021457",
      "2R34YNASSYDJPAINL7Z6CZQQONS2S7R6",
      2214,
      "macOS Tahoe 26.3 Beta Release Notes",
    ],
    [
      "20260111135318",
      "ZATDSLRY2EGVPJNE637YM3A64VCZ6OHX",
      2223,
      "macOS Tahoe 26.3 Beta Release Notes",
    ],
    [
      "20260114134704",
      "FKNRQTDOLBORXNHJE523UABYSNER4VAI",
      2232,
      "macOS Tahoe 26.3 Beta 2 Release Notes",
    ],
    [
      "20260212091016",
      "SO572LLR23XO25L3K6Y2S5L56CML3BQS",
      2486,
      "macOS Tahoe 26.3 Release Notes",
    ],
    [
      "20260222174534",
      "SQBS4TPEMFLUAUQOM2QPJGZURV4KQZP4",
      2617,
      "macOS Tahoe 26.3 Release Notes",
    ],
    [
      "20260528134619",
      "AEIOUD3WGV3CJAHH7KKS4GVAVVBMQJLG",
      2734,
      "macOS Tahoe 26.3 Release Notes",
    ],
  ],
  "visionos-26_1-release-notes": [
    [
      "20251104090133",
      "ZR2WGZZT5UTDSOQPPWPAVLETESZ2MF7W",
      3197,
      "visionOS 26.1 Release Notes",
    ],
    [
      "20251105155111",
      "S5HQ64KSNBVJ2LUX5ZZVLN7IG55XYNBD",
      3244,
      "visionOS 26.1 Release Notes",
    ],
  ],
  "visionos-26_2-release-notes": [
    [
      "20251105020223",
      "JRFMWF5YU4WJDIS7LAYWBCTR247VR2S3",
      2953,
      "visionOS 26.2 Beta Release Notes",
    ],
    [
      "20251212203139",
      "EMOBX6EPWN5GEFDI75V33YI5BQILIMWR",
      3247,
      "visionOS 26.2 Release Notes",
    ],
  ],
  "visionos-26_3-release-notes": [
    [
      "20251215220956",
      "WHDR2LVRT4CQ27LISOLMXLDTR7RXDRUI",
      2379,
      "visionOS 26.3 Beta Release Notes",
    ],
  ],
};

const nearestHumanCapture = {
  "ios-ipados-26_1-release-notes": [
    ["20250927080956", "20250923063632", 351204],
    ["20251013223912", "20251013223911", 1],
    ["20251020181850", "20251020210458", 9968],
    ["20251023065106", "20251023065105", 1],
    ["20251031011033", "20251029020726", 169387],
    ["20251102085839", "20251102085838", 1],
    ["20251112061735", "20251112061733", 2],
    ["20260104062851", "20251218085957", 1459734],
  ],
  "ios-ipados-26_2-release-notes": [
    ["20251117094839", "20251117094838", 1],
    ["20251205120741", "20251205120740", 1],
    ["20251209075502", "20251205120740", 330442],
    ["20260101230052", "20260101230051", 1],
    ["20260104062805", "20260104062804", 1],
    ["20260212040228", "20260212040227", 1],
    ["20260219063340", "20260219063339", 1],
  ],
  "ios-ipados-26_3-release-notes": [
    ["20251218021719", "20251216062344", 158015],
    ["20260114134647", "20260113215401", 57166],
    ["20260124101739", "20260129002237", 396298],
    ["20260129002238", "20260129002237", 1],
    ["20260212103529", "20260212103529", 0],
    ["20260212222645", "20260212103529", 42676],
    ["20260219063304", "20260212103529", 590255],
    ["20260228132812", "20260228132812", 0],
  ],
  "macos-26_1-release-notes": [
    ["20250926135045", "20250923143016", 256829],
    ["20251013075600", "20251013075559", 1],
    ["20251104100731", "20251104100731", 0],
    ["20251107122047", "20251104100731", 267196],
    ["20251213125406", "20251213125405", 1],
    ["20260401082745", "20260325073112", 608193],
  ],
  "macos-26_2-release-notes": [
    ["20251204092527", "20251204092526", 1],
    ["20251212214116", "20251212214116", 0],
    ["20251213080310", "20251213091738", 4468],
    ["20251218021737", "20251218021736", 1],
    ["20251223074224", "20251223074223", 1],
    ["20260108020634", "20260105084955", 234999],
    ["20260401082822", "20260228031411", 2783651],
  ],
  "macos-26_3-release-notes": [
    ["20251218021457", "20251216125304", 134513],
    ["20260111135318", "20260112183217", 103139],
    ["20260114134704", "20260113221554", 55870],
    ["20260212091016", "20260212091015", 1],
    ["20260222174534", "20260222174533", 1],
    ["20260528134619", "20260528134618", 1],
  ],
  "visionos-26_1-release-notes": [
    ["20251104090133", "20251104090132", 1],
    ["20251105155111", "20251105021936", 48695],
  ],
  "visionos-26_2-release-notes": [
    ["20251105020223", "20251105020215", 8],
    ["20251212203139", "20251212203139", 0],
  ],
  "visionos-26_3-release-notes": [["20251215220956", "20251215220955", 1]],
};

const snapshotJudgments = new Map([
  [
    "ios-ipados-26_1-release-notes/20250927080956",
    "Beta 1 — direct initial state; emitted",
  ],
  [
    "ios-ipados-26_1-release-notes/20251013223912",
    "Beta 3-titled direct state; preceding interval spans Beta 2 and Beta 3, so additions are not assigned",
  ],
  [
    "ios-ipados-26_1-release-notes/20251020181850",
    "Beta 3 state used as the Beta 4 comparison baseline",
  ],
  [
    "ios-ipados-26_1-release-notes/20251023065106",
    "Beta 4 — title-anchored sequential delta; emitted",
  ],
  [
    "ios-ipados-26_1-release-notes/20251031011033",
    "RC — isolated sequential delta before Public; emitted",
  ],
  [
    "ios-ipados-26_1-release-notes/20251102085839",
    "RC — identical digest repeat corroborating the pre-Public state; no new delta",
  ],
  [
    "ios-ipados-26_2-release-notes/20251117094839",
    "Beta 2-titled direct state; only the explicit Beta 1/Beta 2 AirDrop fact is emitted",
  ],
  [
    "ios-ipados-26_2-release-notes/20251205120741",
    "RC state; preceding raw interval spans Beta 3 and RC, so differences are not assigned",
  ],
  [
    "ios-ipados-26_2-release-notes/20251209075502",
    "RC 2 boundary; itemized inventory is unchanged from RC, so no substantive route delta",
  ],
  [
    "ios-ipados-26_3-release-notes/20251218021719",
    "Beta 1 — direct overview-only state with no itemized delta",
  ],
  [
    "ios-ipados-26_3-release-notes/20260114134647",
    "Beta 2 — direct overview-only state with no itemized delta",
  ],
  [
    "ios-ipados-26_3-release-notes/20260124101739",
    "Beta 2 state used as the Beta 3 comparison baseline",
  ],
  [
    "ios-ipados-26_3-release-notes/20260129002238",
    "Beta 3 — isolated sequential delta; emitted",
  ],
  [
    "macos-26_1-release-notes/20250926135045",
    "Beta 1 — direct initial state; emitted",
  ],
  [
    "macos-26_1-release-notes/20251013075600",
    "Beta 2-titled sequential state captured on the Beta 3 calendar date; emitted with caveat",
  ],
  [
    "macos-26_2-release-notes/20251204092527",
    "RC direct state, but first archive capture follows three betas; cumulative items are not assigned",
  ],
  [
    "macos-26_3-release-notes/20251218021457",
    "Beta 1 — direct overview-only state with no itemized delta",
  ],
  [
    "macos-26_3-release-notes/20260111135318",
    "Beta 1 overview-only state immediately before Beta 2",
  ],
  [
    "macos-26_3-release-notes/20260114134704",
    "Beta 2 — direct overview-only state with no itemized delta",
  ],
  [
    "visionos-26_2-release-notes/20251105020223",
    "Beta 1 — direct initial state; emitted",
  ],
  [
    "visionos-26_3-release-notes/20251215220956",
    "Beta 1 — direct initial state; emitted",
  ],
]);

function snapshotJudgment(documentName, timestamp) {
  return (
    snapshotJudgments.get(`${documentName}/${timestamp}`) ||
    "Public or later cumulative state; excluded from prerelease attribution"
  );
}

const gapReasons = {
  mobile: {
    "26.1/beta-2":
      "No raw state isolates Beta 2; the next changed state is titled Beta 3 and the interval crosses both milestones.",
    "26.1/beta-3":
      "The first Beta 3 state follows an interval that also crosses Beta 2, so its additions cannot be assigned only to Beta 3.",
    "26.2/beta-1":
      "No raw 26.2 payload was retained between Beta 1 and Beta 2.",
    "26.2/beta-3":
      "The only capture on the Beta 3 date still identifies itself as Beta 2; no Beta 3 note state is retained.",
    "26.2/rc":
      "The Beta 2-to-RC snapshot interval crosses both Beta 3 and RC, so the differences are not RC-specific.",
    "26.2/rc-2":
      "The RC 2 raw payload has the same itemized inventory as the preceding RC state; there is no substantive delta to emit.",
    "26.3/beta-1":
      "The first retained Beta 1 state contains overview prose but no itemized release-note entry.",
    "26.3/beta-2":
      "The retained Beta 2 states contain overview prose but no itemized release-note entry.",
    "26.3/rc":
      "The first post-Beta 3 itemized capture is dated after Public and cannot isolate RC.",
  },
  macos: {
    "26.1/beta-3":
      "No Beta 3-titled raw payload was retained; the next capture follows Public.",
    "26.1/beta-4":
      "No raw payload was retained between Beta 4 and RC or Public.",
    "26.1/rc": "The next raw payload follows Public and cannot isolate RC.",
    "26.2/beta-1":
      "The first retained raw payload is the RC state, after Beta 1, Beta 2, and Beta 3.",
    "26.2/beta-2":
      "The first retained raw payload is the RC state, so Beta 2 has no adjacent snapshot boundary.",
    "26.2/beta-3":
      "The first retained raw payload is the RC state, so Beta 3 has no adjacent snapshot boundary.",
    "26.2/rc":
      "The RC payload is the first retained state and is cumulative; no earlier raw state supports an RC-only delta.",
    "26.3/beta-1":
      "The retained Beta 1 states contain overview prose but no itemized release-note entry.",
    "26.3/beta-2":
      "The retained Beta 2 state contains overview prose but no itemized release-note entry.",
    "26.3/beta-3":
      "No Beta 3 raw state was retained; the next itemized capture follows Public.",
    "26.3/rc": "The first itemized state follows Public and cannot isolate RC.",
  },
  visionos: {
    "26.1/beta-1":
      "The first retained 26.1 raw payload follows Public and cannot be projected back to Beta 1.",
    "26.1/beta-2":
      "The first retained 26.1 raw payload follows Public and cannot isolate Beta 2.",
    "26.1/beta-4":
      "The first retained 26.1 raw payload follows Public and cannot isolate Beta 4.",
    "26.1/rc":
      "The first retained 26.1 raw payload follows Public and cannot isolate RC.",
    "26.2/beta-2":
      "No later beta-state payload was retained before the final Public state.",
    "26.2/beta-3":
      "No Beta 3 raw payload was retained before the final Public state.",
    "26.2/rc":
      "The next raw payload is the final state captured on Public day and cannot isolate RC.",
    "26.3/beta-2":
      "No raw payload after the initial Beta 1 state was retained before Public.",
    "26.3/beta-3": "No Beta 3 raw payload was retained before Public.",
    "26.3/rc": "No RC raw payload was retained before Public.",
  },
};

function gapReason(milestone) {
  const group = ["iOS", "iPadOS"].includes(milestone.platform)
    ? "mobile"
    : milestone.platform.toLowerCase();
  const reason =
    gapReasons[group]?.[`${milestone.version}/${milestone.routeAlias}`];
  assert(
    reason,
    `Missing evidence-gap explanation for ${milestone.releaseVersionId}/${milestone.routeAlias}.`,
  );
  return reason;
}

const seedRows = seedVersions
  .map((version) => {
    const prerelease = version.milestones.filter(
      (milestone) => milestone.label !== "Public",
    ).length;
    const selected = supportedMilestones.filter(
      (milestone) =>
        milestone.releaseVersionId ===
        versionId(version.platform.toLowerCase(), version.version),
    ).length;
    return `| ${version.platform} | ${version.version} | ${version.milestones.length} | ${prerelease} | ${selected} | ${prerelease - selected} |`;
  })
  .join("\n");

const supportedRows = eventRecords
  .map(({ event, ledger }) => {
    const target = `${event.target.releaseVersionId}/${event.target.routeAlias}`;
    const before =
      ledger.before === "—"
        ? "—"
        : `[${ledger.before}](${rawReplay(
            event.target.releaseVersionId.includes("macos")
              ? "macos-26_1-release-notes"
              : event.target.releaseVersionId.includes("visionos-26-2")
                ? "visionos-26_2-release-notes"
                : event.target.releaseVersionId.includes("visionos-26-3")
                  ? "visionos-26_3-release-notes"
                  : event.target.releaseVersionId.includes("26-2")
                    ? "ios-ipados-26_2-release-notes"
                    : event.target.releaseVersionId.includes("26-3")
                      ? "ios-ipados-26_3-release-notes"
                      : "ios-ipados-26_1-release-notes",
            ledger.before,
          )})`;
    const documentName = event.target.releaseVersionId.includes("macos")
      ? "macos-26_1-release-notes"
      : event.target.releaseVersionId.includes("visionos-26-2")
        ? "visionos-26_2-release-notes"
        : event.target.releaseVersionId.includes("visionos-26-3")
          ? "visionos-26_3-release-notes"
          : event.target.releaseVersionId.includes("26-2")
            ? "ios-ipados-26_2-release-notes"
            : event.target.releaseVersionId.includes("26-3")
              ? "ios-ipados-26_3-release-notes"
              : "ios-ipados-26_1-release-notes";
    const after = `[${ledger.after}](${rawReplay(documentName, ledger.after)})`;
    return `| \`${target}\` | ${ledger.mode} | ${before} | ${after} | ${event.changes.length} |`;
  })
  .join("\n");

const gapRows = unsupportedMilestones
  .map(
    (milestone) =>
      `| \`${milestone.releaseVersionId}/${milestone.routeAlias}\` | ${milestone.date} | ${gapReason(milestone)} |`,
  )
  .join("\n");

const trackRows = Object.keys(snapshotInventory)
  .map(
    (documentName) =>
      `| \`${documentName}\` | [canonical page](${canonicalPage(documentName)}) | [uncollapsed CDX index](${cdxQuery(documentName)}) | ${snapshotInventory[documentName].length} |`,
  )
  .join("\n");

const rawRows = Object.entries(snapshotInventory)
  .flatMap(([documentName, rows]) => {
    const nearest = new Map(
      nearestHumanCapture[documentName].map(([raw, human, lag]) => [
        raw,
        { human, lag },
      ]),
    );
    return rows.map(([timestamp, digest, length, title]) => {
      const human = nearest.get(timestamp);
      const lag =
        human.lag < 60
          ? `${human.lag}s`
          : human.lag < 86400
            ? `${(human.lag / 3600).toFixed(1)}h`
            : `${(human.lag / 86400).toFixed(1)}d`;
      return `| \`${documentName}\` | ${timestamp} | ${title} | \`${digest}\` | ${length} | ${snapshotJudgment(documentName, timestamp)} | [raw](${rawReplay(documentName, timestamp)}) | [human ${human.human}](${humanReplay(documentName, human.human)}) (${lag}) |`;
    });
  })
  .join("\n");

const rawJson = `${JSON.stringify(bundle, null, 2)}\n`;
const formattedJson = await prettier.format(rawJson, {
  parser: "json",
  printWidth: 80,
});
const manifestSha = sha256(formattedJson);
const generatorSha = sha256(await readFile(fileURLToPath(import.meta.url)));

const ledger = `# Apple 26.1–26.3 prerelease archive research batch

## Result

\`${outputName}\` enriches 14 existing Apple prerelease routes whose retained first-party note evidence supports at least one substantive structured occurrence.

- Exact local seed closure: 12 versions, 65 milestones, 12 Public routes, and 53 prerelease routes.
- Emitted: 14 prerelease event overlays with 55 change occurrences and 34 stable change definitions.
- Evidence gaps: 39 prerelease routes remain ledger-only. No administrative or empty event was created to satisfy coverage.
- Scope: iOS, iPadOS, macOS, and visionOS 26.1 through 26.3 only.
- Excluded from the manifest: every Public overlay, all other versions, version overviews, build pages, rollout claims, and route creation.
- Review state: every emitted event is \`editoriallyVerified\`, approved at \`${reviewedAt}\`, and \`isIndexable: true\`.

## Exact seed closure

| Platform | Version | Seed milestones | Prerelease | Emitted | Evidence gaps |
| --- | --- | ---: | ---: | ---: | ---: |
${seedRows}
| **Total** |  | **65** | **53** | **14** | **39** |

The generator asserts every seed label, date, order, public date, and the existing visionOS 26.1 uncertainty note. It fails if any route moves or if another checked-in research batch acquires one of the 14 selected durable targets.

## Archive method

The primary evidence is Apple's structured DocC JSON preserved by Internet Archive. CDX was queried without digest collapse so repeated captures remain visible; unchanged captures can establish a boundary even when their content digest repeats.

Reader-facing citations use archived human Apple Developer pages. The exact raw \`id_\` replay URL, digest, CDX-reported length, nearest audited human-shell capture, and human/raw time difference are retained below. Apple remains the original publisher; Internet Archive supplies the preservation layer.

Three evidence modes are intentionally distinct:

1. **Direct initial snapshot** — the first raw state follows Beta 1 and precedes Beta 2. It supports the documented initial inventory but not the exact hour each item appeared.
2. **Sequential snapshot delta** — before and after raw states are compared. A change is assigned only when one milestone is isolated, or when the Apple document title itself anchors the state and that caveat is stated.
3. **Direct self-identifying snapshot fact** — used once for iOS/iPadOS 26.2 Beta 2. Only the AirDrop entry that explicitly names Beta 1 and Beta 2 is emitted; the rest of that first cumulative state is excluded.

Final cumulative notes are never copied backward. A post-Public capture cannot support an RC route, an interval spanning two betas cannot be split, and an overview-only page does not become a synthetic product change.

## Canonical documents and uncollapsed CDX indexes

| Apple document | Canonical human page | Exact CDX query | Raw captures |
| --- | --- | --- | ---: |
${trackRows}

## Emitted route alignment

| Durable route | Evidence mode | Before raw state | After/direct raw state | Structured occurrences |
| --- | --- | --- | --- | ---: |
${supportedRows}

The iOS and iPadOS routes use Apple's shared document but remain separate durable event targets. Their shared change keys have identical canonical definitions. macOS 26.1 Beta 2 is retained with a visible caveat because its raw payload was captured on the Beta 3 calendar date while the Apple title still identified the state as Beta 2.

## Ledger-only evidence gaps

| Durable route | Seed date | Why no event overlay is emitted |
| --- | --- | --- |
${gapRows}

## Exact raw snapshot inventory and timestamp alignment

The “nearest human” column is an independently indexed HTML-shell capture, not a substituted raw timestamp. Its lag is shown so a distant human capture cannot be mistaken for a simultaneous payload. Manifest citations use only the 11 reviewed archive pairings declared by the generator.

| Apple document | Raw timestamp UTC | Raw title | CDX digest | CDX record length | Milestone alignment and use | Exact raw replay | Nearest human archive |
| --- | --- | --- | --- | ---: | --- | --- | --- |
${rawRows}

## Copyright and attribution boundary

- Apple issue identifiers and component/status headings are retained as factual locators.
- Editorial summaries are original synthesis; the manifest contains no copied DocC payload, publisher HTML, or long release-note passage.
- Raw JSON URLs appear only as validation provenance and ledger links. Public citations resolve to human-readable archived Apple pages.
- “Fixed,” “known issue,” and feature/API classifications follow Apple's structured status headings, but all prose is paraphrased.

## Ownership and collision checks

- \`apple-ios-ipados-26-maintenance.json\` remains the owner of the six iOS/iPadOS 26.1–26.3 Public routes.
- \`apple-macos-visionos-26-maintenance.json\` remains the owner of the six macOS/visionOS 26.1–26.3 Public routes.
- All checked-in research JSON files are scanned for duplicate durable route ownership and conflicting change definitions.
- No version overlay, Public route, build overlay, or route creation is included.

## Independent replay review

The independent read-only replay inspected all 11 cited raw snapshots. All 71 positive issue-ID citation assertions — 45 unique snapshot/ID pairs covering 36 unique identifiers — matched their assigned raw states and expected component/status headings. The two explicit issue-absence baselines and the WebKit and Continuity section-absence baselines also passed.

The sequential comparisons matched the manifest exactly: iOS/iPadOS 26.1 Beta 4 contains one added WebKit issue and one Lock Screen status transition; 26.1 RC contains two status transitions; 26.3 Beta 3 adds one Continuity issue; and macOS 26.1 Beta 2 adds exactly two Game Controller fixes. The calendar-day ambiguity for title-anchored states remains visible in every affected article and change verification note. Route ownership, shared iOS/iPadOS definitions, source closure, and copyright-safe original synthesis all passed review.

## Editorial approval and production receipt

- Editorial approval recorded at \`${reviewedAt}\`
- Reviewed production plan SHA-256: \`d0a31efbaac05b1f40f64a066fe4457d0d117a31c49de97cbac0379bf4971ada\`
- Serialized plan artifact SHA-256: \`067119a1d14c0ff6d5958d2dd96d7cc4594d49620829e156bdc41016700109ee\`
- Rollback artifact SHA-256: \`31b7e20da13a2cbc3d76f82bb5bed4dd0132744a0faed2a98730d1c8da2b5579\`
- Sanity transaction: \`eOgq1Ovu5XNUv1qNFUr5aB\`
- Apply receipt SHA-256: \`c2cb14e5092554816c882fc498e959bd8c189073e279eb87cbcdaf1b8744ab8e\`
- Post-apply zero-plan SHA-256: \`7f8932330f79a4c094366b166a51355fa541979aef6aeb29bd1cda08582a88f9\`, with 0 mutations and 2,127 unchanged documents
- Production coverage after apply: 410 of 410 versions have full articles; 1,979 appearances comprise 333 full, 256 source-linked, and 1,390 timeline-only records; 484 appearances have approved structured changes
- Local rendering: all 14 routes rendered their full article, references, and \`index, follow\` metadata. Eleven passed immediately; macOS 26.1 Beta 1, macOS 26.1 Beta 2, and visionOS 26.3 Beta 1 settled after the known 60-second aggregate-query cache interval.

## Deterministic artifact

- Manifest SHA-256: \`${manifestSha}\`
- Generator SHA-256 before artifact write: \`${generatorSha}\`
- Sources: ${sources.length}
- Events: ${events.length}
- Change occurrences: ${occurrences.length}
- Stable change definitions: ${new Set(occurrences.map((change) => change.key)).size}
- Raw CDX captures inventoried: ${Object.values(snapshotInventory).reduce((sum, rows) => sum + rows.length, 0)}
`;

const formattedLedger = await prettier.format(ledger, {
  parser: "markdown",
  printWidth: 100,
});

await writeFile(outputPath, formattedJson);
await writeFile(ledgerPath, formattedLedger);

console.log(`Wrote ${outputPath}`);
console.log(`Wrote ${ledgerPath}`);
console.log(`Manifest SHA-256 ${manifestSha}`);
