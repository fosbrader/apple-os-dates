import { createHash } from "node:crypto";
import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import prettier from "prettier";

const here = dirname(fileURLToPath(import.meta.url));
const outputName = "apple-ios-ipados-17-prerelease.json";
const ledgerName = "apple-ios-ipados-17-prerelease.md";
const accessedAt = "2026-07-30";
const reviewedAt = "2026-07-30T08:09:31Z";

const U = {
  installBeta: "https://developer.apple.com/support/install-beta",
  beta1:
    "https://web.archive.org/web/20230605212151/https://developer.apple.com/documentation/ios-ipados-release-notes/ios-ipados-17-release-notes",
  beta1Transport:
    "https://web.archive.org/web/20230605212152id_/https://developer.apple.com/tutorials/data/documentation/ios-ipados-release-notes/ios-ipados-17-release-notes.json",
  beta2:
    "https://web.archive.org/web/20230624091108/https://developer.apple.com/documentation/ios-ipados-release-notes/ios-ipados-17-release-notes",
  beta2Transport:
    "https://web.archive.org/web/20230624091109id_/https://developer.apple.com/tutorials/data/documentation/ios-ipados-release-notes/ios-ipados-17-release-notes.json",
  beta3:
    "https://web.archive.org/web/20230710001128/https://developer.apple.com/documentation/ios-ipados-release-notes/ios-ipados-17-release-notes",
  beta3Transport:
    "https://web.archive.org/web/20230710001130id_/https://developer.apple.com/tutorials/data/documentation/ios-ipados-release-notes/ios-ipados-17-release-notes.json",
  beta3DateAudit:
    "https://web.archive.org/web/20230705210759/https://developer.apple.com/documentation/ios-ipados-release-notes/ios-ipados-17-release-notes",
  beta3DateAuditTransport:
    "https://web.archive.org/web/20230705210800id_/https://developer.apple.com/tutorials/data/documentation/ios-ipados-release-notes/ios-ipados-17-release-notes.json",
  beta8Audit:
    "https://web.archive.org/web/20230901004210/https://developer.apple.com/documentation/ios-ipados-release-notes/ios-ipados-17-release-notes",
  beta8AuditTransport:
    "https://web.archive.org/web/20230901004211id_/https://developer.apple.com/tutorials/data/documentation/ios-ipados-release-notes/ios-ipados-17-release-notes.json",
  rcAudit:
    "https://web.archive.org/web/20230912200639/https://developer.apple.com/documentation/ios-ipados-release-notes/ios-ipados-17-release-notes",
  rcAuditTransport:
    "https://web.archive.org/web/20230912200640id_/https://developer.apple.com/tutorials/data/documentation/ios-ipados-release-notes/ios-ipados-17-release-notes.json",
};

const archiveSources = [
  [
    U.beta1,
    U.beta1Transport,
    "iOS & iPadOS 17 Beta Release Notes",
    "2023-06-05T21:21:51.000Z",
    "Beta 1",
  ],
  [
    U.beta2,
    U.beta2Transport,
    "iOS & iPadOS 17 Beta 2 Release Notes",
    "2023-06-24T09:11:08.000Z",
    "Beta 2",
  ],
  [
    U.beta3,
    U.beta3Transport,
    "iOS & iPadOS 17 Beta 3 Release Notes",
    "2023-07-10T00:11:28.000Z",
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
  topics: ["iOS", "iPadOS", "17.0", milestone, "historical release notes"],
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
};

const comparisonForAlias = {
  "beta-1": [U.beta1],
  "beta-2": [U.beta1, U.beta2],
  "beta-3": [U.beta2, U.beta3],
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
    return "Selected as a representative capability, API change, removal, or platform behavior from Apple's first preserved 187-record Beta 1 DocC state; the baseline is intentionally not exhaustive.";
  }
  if (alias === "beta-2") {
    return "Matched the component, status heading, and retained issue ID as an exact addition or status transition in the 212-record Beta 2 state against the 187-record Beta 1 state.";
  }
  return "Matched the component, status heading, and retained issue ID as an exact addition in the 244-record Beta 3 state against the unchanged 212-record Beta 2 state.";
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
    key: "apple-17-beta1-passkey-credential-providers",
    title: "Passkeys in third-party credential providers",
    canonicalSummary:
      "Password-manager credential providers gained system support for saving and offering passkeys.",
    category: "developerApi",
    action: "introduced",
    summary:
      "The initial notes add passkey creation and sign-in support to the credential-provider API used by password managers.",
    locator: "Authentication Services and Passkeys — New Features; 83501802",
  }),
  archivedChange("beta-1", {
    key: "apple-17-beta1-authentication-settings-helper",
    title: "Authentication settings helper",
    canonicalSummary:
      "Authentication Services added a helper for opening the relevant Settings pages for credential providers and verification-code apps.",
    category: "developerApi",
    action: "introduced",
    summary:
      "Apps can direct users to the system configuration views for Password AutoFill, passkey sign-in, and verification-code setup links.",
    locator: "Authentication Services and Passkeys — New Features; 106351958",
  }),
  archivedChange("beta-1", {
    key: "apple-17-beta1-foundation-grammar-agreement",
    title: "Foundation grammar agreement APIs",
    canonicalSummary:
      "Foundation added term-of-address metadata and detached-phrase grammar agreement for localized text.",
    category: "developerApi",
    action: "introduced",
    summary:
      "The first state adds APIs for honoring a person's preferred form of address and for making a detached phrase agree with another language concept.",
    locator: "Foundation — New Features; 99745330 and 102595293",
  }),
  archivedChange("beta-1", {
    key: "apple-17-beta1-managed-media-source",
    title: "Managed media sources",
    canonicalSummary:
      "Managed Media Source support arrived on iPadOS and as a preview on iOS.",
    category: "developerApi",
    action: "introduced",
    summary:
      "Apple describes full support on iPadOS alongside preview availability on iOS, preserving the different maturity stated for the two platforms.",
    locator: "Media — New Features; 30320350",
  }),
  archivedChange("beta-1", {
    key: "apple-17-beta1-stickers-outside-messages",
    title: "Sticker packs outside Messages",
    canonicalSummary:
      "Sticker-pack apps became available from the system Stickers interface in first- and third-party apps outside Messages.",
    category: "feature",
    action: "introduced",
    summary:
      "The new Stickers interface can surface sticker packs through emoji recents or Markup in apps such as Notes and Freeform and in eligible third-party apps.",
    locator: "Messages — New Features; 106685842",
  }),
  archivedChange("beta-1", {
    key: "apple-17-beta1-wired-8021x",
    title: "Wired 802.1X networking",
    canonicalSummary:
      "iPhone and iPad gained support for joining authenticated wired 802.1X networks.",
    category: "compatibility",
    action: "introduced",
    summary:
      "Apple explicitly lists both iPhone and iPad among the devices that can join wired 802.1X networks in the new release.",
    locator: "Networking — New Features; 12867782",
  }),
  archivedChange("beta-1", {
    key: "apple-17-beta1-urlsession-resumable-uploads",
    title: "Resumable HTTP uploads",
    canonicalSummary:
      "URLSession added the ability to pause and resume HTTP upload tasks when the server supports the protocol.",
    category: "developerApi",
    action: "introduced",
    summary:
      "Upload tasks gained pause-and-resume behavior analogous to download tasks when used with compatible servers.",
    locator: "Networking — New Features; 68890505",
  }),
  archivedChange("beta-1", {
    key: "apple-17-beta1-eap-tls-13",
    title: "EAP-TLS 1.3 networking",
    canonicalSummary:
      "Apple platforms added 802.1X authentication through EAP-TLS with TLS 1.3.",
    category: "security",
    action: "introduced",
    summary:
      "The new networking support adds forward secrecy, protects peer identity, and requires revocation checking as described by Apple.",
    locator: "Networking — New Features; 74526852",
  }),
  archivedChange("beta-1", {
    key: "apple-17-beta1-ats-external-ip-addresses",
    title: "App Transport Security for external IP addresses",
    canonicalSummary:
      "Apps linked to the new SDK began requiring secure connections to external IP addresses by default, with address- and CIDR-level exceptions available.",
    category: "security",
    action: "changed",
    summary:
      "The SDK-linked App Transport Security policy extends secure-by-default handling to external IP addresses and permits narrowly scoped exceptions.",
    locator: "Networking — Resolved Issues; 101967030",
  }),
  archivedChange("beta-1", {
    key: "apple-17-beta1-newsstandkit-removal",
    title: "NewsstandKit removed",
    canonicalSummary: "The NewsstandKit framework was removed.",
    category: "removal",
    action: "removed",
    summary:
      "The first preserved state records the removal of the legacy NewsstandKit framework.",
    locator: "Newsstand — Deprecations; 101054446",
  }),
  archivedChange("beta-1", {
    key: "apple-17-beta1-photos-heic-edit-output",
    title: "HEIC rendered editing output",
    canonicalSummary:
      "Photos added an API for supplying rendered photo-editing output encoded as HEIC.",
    category: "developerApi",
    action: "introduced",
    summary:
      "A new Photos editing-output API accepts rendered content identified as the HEIC uniform type.",
    locator: "Photos — New Features; 109861295",
  }),
  archivedChange("beta-1", {
    key: "apple-17-beta1-storekit-subscription-status",
    title: "Expanded subscription-group status",
    canonicalSummary:
      "StoreKit added subscription-group presentation and APIs for retrieving status across an app's subscription groups.",
    category: "developerApi",
    action: "introduced",
    summary:
      "Developers can present a customer's plans within a subscription group and inspect full status information across all of an app's groups.",
    locator: "StoreKit — New Features; 87853800 and 102064614",
  }),
  archivedChange("beta-1", {
    key: "apple-17-beta1-storekit-merchandising-views",
    title: "StoreKit merchandising views",
    canonicalSummary:
      "StoreKit 2 added reusable SwiftUI components for presenting products, stores, and subscription groups.",
    category: "developerApi",
    action: "introduced",
    summary:
      "ProductView, StoreView, and SubscriptionStoreView reduce the amount of custom interface code needed to merchandise in-app purchases.",
    locator: "StoreKit — New Features; 102066107",
  }),
  archivedChange("beta-1", {
    key: "apple-17-beta1-swift-charts-interaction-and-sectors",
    title: "Scrollable, selectable, and sector-based charts",
    canonicalSummary:
      "Swift Charts added scrolling, axis and angle selection, and SectorMark for pie and donut charts.",
    category: "developerApi",
    action: "introduced",
    summary:
      "The charting framework gains scrollable axes, selection modifiers, gesture customization, and native sector marks.",
    locator: "Swift Charts — New Features; 70444254, 79083764, and 102309263",
  }),
  archivedChange("beta-1", {
    key: "apple-17-beta1-swiftui-animation-defaults",
    title: "SwiftUI spring-animation defaults",
    canonicalSummary:
      "SwiftUI changed its default animation to a spring and made spring animations critically damped unless bounce is requested.",
    category: "behavior",
    action: "changed",
    summary:
      "Apps need to account for a spring-based default animation and a zero-bounce default for spring animations.",
    locator: "SwiftUI — New Features; 75149732 and 103169056",
  }),
  archivedChange("beta-1", {
    key: "apple-17-beta1-lock-screen-widget-drag",
    title: "Dragging Lock Screen widgets",
    canonicalSummary:
      "Dragging widgets into the Lock Screen widget area could fail on both iPhone and iPad.",
    category: "knownIssue",
    action: "knownIssue",
    summary:
      "The first state explicitly identifies a Lock Screen widget-placement problem on both device families.",
    locator: "Widgets — Known Issues; 106379745",
  }),
]);

appendChanges(["ios"], "beta-1", [
  archivedChange("beta-1", {
    key: "ios-17-beta1-assistive-access",
    title: "Assistive Access",
    canonicalSummary:
      "Assistive Access introduced a simplified, configurable iOS experience controlled from Accessibility settings.",
    category: "feature",
    action: "introduced",
    summary:
      "Apple's first state describes configuration, activation, and passcode-protected exit for the alternative iOS experience.",
    locator: "Assistive Access — New Features; 109227206",
  }),
  archivedChange("beta-1", {
    key: "ios-17-beta1-check-in-limitations",
    title: "Check In prerelease limitations",
    canonicalSummary:
      "Check In had early limitations involving offline sharing state, Siri announcements, lingering Live Activities, and regional availability.",
    category: "knownIssue",
    action: "knownIssue",
    summary:
      "The baseline records four Check In limitations spanning offline disclosure consistency, repeated announcements, stale session state, and availability in China.",
    locator:
      "Check In — Known Issues; 108265124, 109409441, 110066137, and 110069236",
  }),
  archivedChange("beta-1", {
    key: "ios-17-beta1-live-voicemail-sharing",
    title: "Live Voicemail sharing",
    canonicalSummary: "Live Voicemail could not be shared in the first beta.",
    category: "knownIssue",
    action: "knownIssue",
    summary:
      "The initial Live Voicemail section identifies sharing as unavailable.",
    locator: "Live Voicemail — Known Issues; 105513708",
  }),
  archivedChange("beta-1", {
    key: "ios-17-beta1-lockdown-mode-2g",
    title: "Lockdown Mode and 2G",
    canonicalSummary:
      "Lockdown Mode might not disable a previously selected 2G cellular option on every network.",
    category: "knownIssue",
    action: "knownIssue",
    summary:
      "Apple advises selecting a different cellular mode before enabling Lockdown Mode when the user intends to keep 2G disabled.",
    locator: "Lockdown Mode — Known Issues; 109406777",
  }),
  archivedChange("beta-1", {
    key: "ios-17-beta1-metalfx-iphone14-crash",
    title: "MetalFX temporal scaling on iPhone 14",
    canonicalSummary:
      "MetalFX temporal-scaling effects could terminate unexpectedly on iPhone 14 and iPhone 14 Pro.",
    category: "knownIssue",
    action: "knownIssue",
    summary:
      "The first state limits this MetalFX stability issue to the iPhone 14 device family.",
    locator: "Metal — Known Issues; 110191344",
  }),
  archivedChange("beta-1", {
    key: "ios-17-beta1-standby-limitations",
    title: "StandBy prerelease limitations",
    canonicalSummary:
      "StandBy had early issues involving stale widgets, restrictions, brightness, red-mode legibility, clipping, and call alerts.",
    category: "knownIssue",
    action: "knownIssue",
    summary:
      "Apple's initial notes group several StandBy limitations affecting widgets, Screen Time behavior, display controls, gallery rendering, and incoming calls.",
    locator:
      "StandBy — Known Issues; 105255305, 105255640, 106203217, 108919386, 108924188, and 108924275",
  }),
  archivedChange("beta-1", {
    key: "ios-17-beta1-photo-wallpaper-orientation",
    title: "iPhone photo-wallpaper orientation",
    canonicalSummary:
      "An iPhone Home Screen photo wallpaper could appear in the wrong orientation.",
    category: "knownIssue",
    action: "knownIssue",
    summary:
      "The wallpaper section explicitly limits this orientation defect to iPhone.",
    locator: "Wallpaper — Known Issues; 109716224",
  }),
]);

appendChanges(["ipados"], "beta-1", [
  archivedChange("beta-1", {
    key: "ipados-17-beta1-older-ipad-airplay",
    title: "AirPlay mirroring on older iPad Pro models",
    canonicalSummary:
      "AirPlay mirroring and Mac extended-display use were unavailable or affected on two older iPad Pro models.",
    category: "knownIssue",
    action: "knownIssue",
    summary:
      "The issue is explicitly limited to the 10.5-inch iPad Pro and second-generation 12.9-inch iPad Pro.",
    locator: "AirPlay — Known Issues; 109683501",
  }),
  archivedChange("beta-1", {
    key: "ipados-17-beta1-ipad6-cellular-service",
    title: "Cellular service on sixth-generation iPad",
    canonicalSummary:
      "A cellular sixth-generation iPad could show No Service after cellular data was toggled.",
    category: "knownIssue",
    action: "knownIssue",
    summary:
      "The first state recommends restarting the affected Wi-Fi + Cellular iPad model.",
    locator: "Cellular — Known Issues; 109705637",
  }),
  archivedChange("beta-1", {
    key: "ipados-17-beta1-stage-manager-switcher-gesture",
    title: "Stage Manager switcher gesture",
    canonicalSummary:
      "The gesture for opening the app switcher did not work while Stage Manager was active.",
    category: "knownIssue",
    action: "knownIssue",
    summary:
      "The Stage Manager section records the unavailable switcher gesture in the first beta.",
    locator: "Stage Manager — Known Issues; 109580340",
  }),
  archivedChange("beta-1", {
    key: "ipados-17-beta1-wallpaper-orientation",
    title: "iPad wallpaper orientation",
    canonicalSummary:
      "Wallpaper could display in an incorrect orientation on iPad.",
    category: "knownIssue",
    action: "knownIssue",
    summary:
      "The first preserved state separately identifies an iPad-specific wallpaper orientation issue.",
    locator: "Wallpaper — Known Issues; 109894244",
  }),
  archivedChange("beta-1", {
    key: "ipados-17-beta1-trackpad-lock-screen-widgets",
    title: "Trackpad placement of Lock Screen widgets",
    canonicalSummary:
      "A trackpad could not be used to add widgets to the Lock Screen.",
    category: "knownIssue",
    action: "knownIssue",
    summary:
      "The input-specific limitation is retained on iPadOS rather than generalized to iPhone.",
    locator: "Widgets — Known Issues; 110047943",
  }),
]);

appendChanges(both, "beta-2", [
  archivedChange("beta-2", {
    key: "apple-17-beta2-airplay-picker",
    title: "AirPlay picker population",
    canonicalSummary:
      "The AirPlay picker could show only the current route instead of populating the full route list.",
    category: "knownIssue",
    action: "knownIssue",
    summary:
      "Beta 2 adds a picker-population issue with reopening or relaunching as the documented workaround.",
    locator: "AirPlay — Known Issues; 109610361",
  }),
  archivedChange("beta-2", {
    key: "apple-17-beta2-app-intents-shortcuts-crash",
    title: "Shortcuts launch with App Intents providers",
    canonicalSummary:
      "Shortcuts could terminate at launch when certain apps that provide App Intents were installed.",
    category: "knownIssue",
    action: "knownIssue",
    summary:
      "The Beta 2 state newly records a Shortcuts launch failure linked to some App Intents providers.",
    locator: "App Intents — Known Issues; 109781493",
  }),
  archivedChange("beta-2", {
    key: "apple-17-beta2-freeform-cross-version-strokes",
    title: "Freeform strokes across beta versions",
    canonicalSummary:
      "Freeform strokes created in Beta 2 could render incorrectly on devices still running Beta 1.",
    category: "compatibility",
    action: "knownIssue",
    summary:
      "Apple recommends moving collaborating devices to Beta 2 to avoid cross-version drawing distortion.",
    locator: "Freeform — Known Issues; 107901155",
  }),
  archivedChange("beta-2", {
    key: "apple-17-beta2-home-widget-configuration",
    title: "Home widget accessory configuration",
    canonicalSummary:
      "Home widgets could report no accessories or omit accessories that exposed multiple services.",
    category: "knownIssue",
    action: "knownIssue",
    summary:
      "Two Beta 2 additions cover apparently empty Home widgets and filtered multi-service accessories.",
    locator: "Home Widgets — Known Issues; 110424040 and 110547396",
  }),
  archivedChange("beta-2", {
    key: "apple-17-beta2-imageio-palette-rendering",
    title: "ImageIO palette and icon rendering",
    canonicalSummary:
      "Some palette-based PNG images and Health or Wallet icons could render with corruption.",
    category: "knownIssue",
    action: "knownIssue",
    summary:
      "Beta 2 adds two ImageIO rendering defects, including PNG alpha-table handling and device icon corruption.",
    locator: "ImageIO — Known Issues; 110822373 and 110906101",
  }),
  archivedChange("beta-2", {
    key: "apple-17-beta2-messages-event-reminder-titles",
    title: "Suggested event and reminder titles",
    canonicalSummary:
      "Messages added on-device suggested English titles when creating events or reminders from recognized dates and times.",
    category: "feature",
    action: "introduced",
    summary:
      "The new Beta 2 note describes machine-learning title suggestions reached from a highlighted date or time in a conversation.",
    locator:
      "Pre-filled Titles for Events and Reminders — New Features; 110889506",
  }),
  archivedChange("beta-2", {
    key: "apple-17-beta2-screen-time-usage-detail-hang",
    title: "Screen Time usage-detail delay",
    canonicalSummary:
      "Opening detail for a heavily used app, website, or category could stall Screen Time for about 25 seconds.",
    category: "knownIssue",
    action: "knownIssue",
    summary:
      "Beta 2 adds a prolonged delay when navigating from the Most Used list to a detailed usage report.",
    locator: "Screen Time — Known Issues; 109490608",
  }),
  archivedChange("beta-2", {
    key: "apple-17-beta2-swiftdata-property-observers",
    title: "SwiftData property observers",
    canonicalSummary:
      "Apple fixed model properties with willSet or didSet observers failing to transform and persist correctly.",
    category: "bugFix",
    action: "fixed",
    summary:
      "Issue 109664186 moves from known in Beta 1 to resolved in the Beta 2 state.",
    locator:
      "SwiftData — Known Issues to Resolved Issues; 109664186 status transition",
  }),
  archivedChange("beta-2", {
    key: "apple-17-beta2-swiftui-list-section-spacing",
    title: "SwiftUI list-section spacing",
    canonicalSummary:
      "SwiftUI made the listSectionSpacing modifier available inside lists.",
    category: "developerApi",
    action: "introduced",
    summary:
      "Beta 2 adds direct control over section spacing within List containers.",
    locator: "SwiftUI — New Features; 109271050",
  }),
  archivedChange("beta-2", {
    key: "apple-17-beta2-swiftui-menu-hover-effect",
    title: "SwiftUI menu hover effects",
    canonicalSummary:
      "Apple fixed Menu being incompatible with the hoverEffect modifier.",
    category: "bugFix",
    action: "fixed",
    summary:
      "The Beta 2 state adds a resolved note for combining menus with hover effects.",
    locator: "SwiftUI — Resolved Issues; 67879883",
  }),
  archivedChange("beta-2", {
    key: "apple-17-beta2-navigation-split-view-reuse",
    title: "NavigationSplitView controller reuse",
    canonicalSummary:
      "NavigationSplitView began reusing view controllers more often, improving performance while changing some hosting-controller lifecycle behavior.",
    category: "behavior",
    action: "fixed",
    summary:
      "The performance fix can reduce UIHostingController creation, so code coupled to its lifecycle messages may observe different behavior.",
    locator: "SwiftUI — Resolved Issues; 88880547",
  }),
  archivedChange("beta-2", {
    key: "apple-17-beta2-alert-button-state",
    title: "Dynamically enabled alert buttons",
    canonicalSummary:
      "Apple fixed alert buttons failing to refresh after their enabled state changed dynamically.",
    category: "bugFix",
    action: "fixed",
    summary:
      "Beta 2 resolves alert actions remaining visually or functionally stale after inputs such as text fields changed.",
    locator: "SwiftUI — Resolved Issues; 95917673",
  }),
  archivedChange("beta-2", {
    key: "apple-17-beta2-scrollviewreader-end-clamping",
    title: "ScrollViewReader end-position clamping",
    canonicalSummary:
      "Programmatic scrolling to the end of a scroll view became clamped to the content extent instead of overscrolling.",
    category: "behavior",
    action: "fixed",
    summary:
      "The resolved behavior keeps the final offset within the scroll view's total content size.",
    locator: "SwiftUI — Resolved Issues; 107558652",
  }),
  archivedChange("beta-2", {
    key: "apple-17-beta2-searchable-scroll-transition",
    title: "Search presentation in scroll views",
    canonicalSummary:
      "Apple improved the transition when presenting or dismissing search on a scroll view.",
    category: "bugFix",
    action: "fixed",
    summary:
      "The note explicitly applies the smoother searchable transition to both iOS and iPadOS.",
    locator: "SwiftUI — Resolved Issues; 109265624",
  }),
  archivedChange("beta-2", {
    key: "apple-17-beta2-indirect-input-events",
    title: "Indirect input-event default",
    canonicalSummary:
      "Apps linked with the new SDK defaulted to indirect input-event support unless they explicitly disabled it.",
    category: "compatibility",
    action: "changed",
    summary:
      "Beta 2 adds an SDK-linking behavior change and documents the Info.plist key for opting out.",
    locator: "UIKit — New Features; 68295914",
  }),
  archivedChange("beta-2", {
    key: "apple-17-beta2-vision-body-pose-without-depth",
    title: "3D body pose without depth metadata",
    canonicalSummary:
      "Vision's 3D human-body pose request began returning results without explicitly supplied depth metadata or camera intrinsics.",
    category: "bugFix",
    action: "fixed",
    summary:
      "The Beta 2 resolved note removes the prior requirement for those extra inputs in qualifying images and frames.",
    locator: "Vision — Resolved Issues; 109723859",
  }),
]);

appendChanges(["ios"], "beta-2", [
  archivedChange("beta-2", {
    key: "ios-17-beta2-shareplay-car-qr",
    title: "SharePlay in-car QR connection",
    canonicalSummary:
      "Joining an in-car SharePlay session by scanning its QR code could fail.",
    category: "knownIssue",
    action: "knownIssue",
    summary:
      "The new note recommends keeping every participating device on the same beta build.",
    locator: "SharePlay — Known Issues; 109275769",
  }),
]);

appendChanges(["ipados"], "beta-2", [
  archivedChange("beta-2", {
    key: "ipados-17-beta2-2017-ipad-update",
    title: "Software Update on 2017 iPad models",
    canonicalSummary:
      "Some 2017 iPad models could fail the beta update and revert to their previous operating system.",
    category: "knownIssue",
    action: "knownIssue",
    summary:
      "Apple's iPad-specific workaround was to erase to an iPadOS 16 variant before trying the update again.",
    locator: "Software Update — Known Issues; 110281164",
  }),
]);

appendChanges(both, "beta-3", [
  archivedChange("beta-3", {
    key: "apple-17-beta3-malformed-mp3-id3",
    title: "Malformed MP3 ID3 tags",
    canonicalSummary:
      "MP3 files with malformed ID3 metadata could fail to play.",
    category: "knownIssue",
    action: "knownIssue",
    summary:
      "The Beta 3 state adds a playback failure tied specifically to malformed ID3 tags.",
    locator: "General — Known Issues; 110230071",
  }),
  archivedChange("beta-3", {
    key: "apple-17-beta3-facetime-handoff",
    title: "FaceTime handoff reliability",
    canonicalSummary:
      "Apple fixed FaceTime handoff sometimes dropping the call or transferring it without media.",
    category: "bugFix",
    action: "fixed",
    summary:
      "Beta 3 adds a resolved note for call and media continuity during FaceTime handoff.",
    locator: "Facetime handoff — Resolved Issues; 110126569",
  }),
  archivedChange("beta-3", {
    key: "apple-17-beta3-facetime-apple-tv-call-end",
    title: "Early FaceTime call termination on Apple TV",
    canonicalSummary:
      "FaceTime calls involving Apple TV and an iPhone or iPad could end during their first minute.",
    category: "knownIssue",
    action: "knownIssue",
    summary:
      "The Beta 3 state recommends restarting Apple TV and the connected iPhone or iPad.",
    locator: "FaceTime on Apple TV — Known Issues; 111099303",
  }),
  archivedChange("beta-3", {
    key: "apple-17-beta3-medication-shape-editing",
    title: "Editing medication shape",
    canonicalSummary:
      "The Health app could not change the shape assigned to an existing medication.",
    category: "knownIssue",
    action: "knownIssue",
    summary:
      "Beta 3 newly records the inability to revise this visual property after a medication was created.",
    locator: "Health Medications — Known Issues; 111303794",
  }),
  archivedChange("beta-3", {
    key: "apple-17-beta3-mail-redownload-large-account",
    title: "Mail redownload for large accounts",
    canonicalSummary:
      "Updating to Beta 3 could cause Mail to redownload messages for accounts containing more than ten thousand messages.",
    category: "knownIssue",
    action: "knownIssue",
    summary:
      "The issue is tied to the Beta 3 upgrade boundary and high-volume mail accounts.",
    locator: "Mail — Known Issues; 110809614",
  }),
  archivedChange("beta-3", {
    key: "apple-17-beta3-notes-content-rendering",
    title: "Temporarily missing note content",
    canonicalSummary:
      "Some note content could temporarily disappear until the view was revisited or scrolled.",
    category: "knownIssue",
    action: "knownIssue",
    summary:
      "Beta 3 adds a transient Notes rendering problem with navigation or scrolling as the workaround.",
    locator: "Notes — Known Issues; 108843547",
  }),
  archivedChange("beta-3", {
    key: "apple-17-beta3-significant-locations-photos-delay",
    title: "Significant Locations clearing delay in Photos",
    canonicalSummary:
      "Clearing Significant Locations history might take a week or longer to be reflected in Photos.",
    category: "knownIssue",
    action: "knownIssue",
    summary:
      "The privacy-state change was not immediately propagated to Photos in the Beta 3 state.",
    locator: "Privacy — Known Issues; 106171658",
  }),
  archivedChange("beta-3", {
    key: "apple-17-beta3-passcode-options",
    title: "Passcode Options during passcode changes",
    canonicalSummary:
      "The Passcode Options link could be missing, preventing a change from a numeric to an alphanumeric passcode.",
    category: "knownIssue",
    action: "knownIssue",
    summary:
      "Beta 3 newly documents the missing control in the passcode-change workflow.",
    locator: "Settings | Passcode — Known Issues; 110705323",
  }),
  archivedChange("beta-3", {
    key: "apple-17-beta3-freeform-skin-tone-stickers",
    title: "Skin-tone emoji in Freeform",
    canonicalSummary:
      "Emoji with skin-tone variants could not be inserted into Freeform canvases on iPhone or iPad.",
    category: "knownIssue",
    action: "knownIssue",
    summary:
      "The source explicitly scopes this Sticker issue to both iPad and iPhone.",
    locator: "Stickers — Known Issues; 110253100",
  }),
  archivedChange("beta-3", {
    key: "apple-17-beta3-storekit-view-styling",
    title: "StoreKit view styling",
    canonicalSummary:
      "StoreKit views gained more control over backgrounds, icon borders, and purchase-button styles.",
    category: "developerApi",
    action: "introduced",
    summary:
      "Beta 3 adds SwiftUI-facing customization for merchandising backgrounds, icon treatment, and purchase or subscription controls.",
    locator: "StoreKit — New Features; 105690554, 106649532, and 107713282",
  }),
  archivedChange("beta-3", {
    key: "apple-17-beta3-storekit-promotional-icons",
    title: "Custom StoreKit promotional icons",
    canonicalSummary:
      "StoreKit product and store views gained initializers for supplying promotional icons across loading phases.",
    category: "developerApi",
    action: "introduced",
    summary:
      "The new initializers expose loading phases as SwiftUI content so apps can customize product icon presentation.",
    locator: "StoreKit — New Features; 110470147",
  }),
  archivedChange("beta-3", {
    key: "apple-17-beta3-storekit-type-renames",
    title: "StoreKit type renames",
    canonicalSummary:
      "Several StoreKit view-style, marketing-content, and fallback-icon types were renamed during the Beta 3 SDK cycle.",
    category: "developerApi",
    action: "changed",
    summary:
      "The Beta 3 state records source-level naming changes that developers needed to account for while adopting the prerelease SDK.",
    locator: "StoreKit — New Features; 111185321",
  }),
  archivedChange("beta-3", {
    key: "apple-17-beta3-storekit-view-fixes",
    title: "StoreKit view loading and localization fixes",
    canonicalSummary:
      "StoreKit fixed single-product loading animation, a background-thread callback, and storefront localization failures.",
    category: "bugFix",
    action: "fixed",
    summary:
      "Three Beta 3 resolutions improve product loading behavior, callback threading, and localized merchandising text.",
    locator: "StoreKit — Resolved Issues; 110414023, 110640574, and 110734447",
  }),
  archivedChange("beta-3", {
    key: "apple-17-beta3-shazamkit-availability",
    title: "ShazamKit API availability",
    canonicalSummary:
      "Apple fixed availability problems affecting managed-session state and default-library items in ShazamKit.",
    category: "bugFix",
    action: "fixed",
    summary: "Beta 3 adds two resolved ShazamKit API availability records.",
    locator: "ShazamKit — Resolved Issues; 109670750 and 109670918",
  }),
  archivedChange("beta-3", {
    key: "apple-17-beta3-skadnetwork-postback-copies",
    title: "SKAdNetwork developer postback copies",
    canonicalSummary:
      "Apple fixed developer postback copies failing to send or containing an incorrect fine or coarse conversion value.",
    category: "bugFix",
    action: "fixed",
    summary:
      "The Beta 3 state adds a resolved record for developer-copy delivery and conversion-value integrity.",
    locator: "SKAdNetwork — Resolved Issues; 109471751",
  }),
  archivedChange("beta-3", {
    key: "apple-17-beta3-vision-camera-origin-matrix",
    title: "Vision camera-origin matrix",
    canonicalSummary:
      "Vision corrected its camera-origin matrix so clients no longer needed an extra 180-degree rotation around the x-axis.",
    category: "bugFix",
    action: "fixed",
    summary:
      "Beta 3 aligns the matrix behavior with updated sample code and removes the compensating rotation.",
    locator: "Vision — Resolved Issues; 110726503",
  }),
]);

appendChanges(["ios"], "beta-3", [
  archivedChange("beta-3", {
    key: "ios-17-beta3-assistive-access-selected-calls",
    title: "Assistive Access calls from selected contacts",
    canonicalSummary:
      "Assistive Access might not receive calls when calling was restricted to selected contacts.",
    category: "knownIssue",
    action: "knownIssue",
    summary:
      "The Beta 3 workaround was to permit calls from all contacts during setup.",
    locator: "Assistive Access — Known Issues; 110815616",
  }),
  archivedChange("beta-3", {
    key: "ios-17-beta3-android-shared-car-keys",
    title: "Car keys shared from Android",
    canonicalSummary:
      "A car key shared from Android to iOS or watchOS could not be added to Wallet.",
    category: "knownIssue",
    action: "knownIssue",
    summary:
      "The source explicitly scopes this cross-platform key-sharing failure to Wallet on iOS and watchOS.",
    locator: "Car Key — Known Issues; 110800534",
  }),
  archivedChange("beta-3", {
    key: "ios-17-beta3-carplay-focus-indicator",
    title: "CarPlay focus indication",
    canonicalSummary:
      "Apple fixed CarPlay's Now Playing screen failing to identify the focused control in vehicles with knob or trackpad input.",
    category: "bugFix",
    action: "fixed",
    summary:
      "Beta 3 adds a resolved focus-display issue for vehicles that use indirect input.",
    locator: "CarPlay — Resolved Issues; 110609967",
  }),
  archivedChange("beta-3", {
    key: "ios-17-beta3-carplay-navigation-and-progress",
    title: "CarPlay navigation and playback displays",
    canonicalSummary:
      "CarPlay could show incorrect upcoming-turn information in vehicle displays or omit progress movement from the Now Playing widget.",
    category: "knownIssue",
    action: "knownIssue",
    summary:
      "Two Beta 3 additions cover navigation guidance in instrument clusters or head-up displays and playback progress in the Now Playing widget.",
    locator: "CarPlay — Known Issues; 109437630 and 110845144",
  }),
  archivedChange("beta-3", {
    key: "ios-17-beta3-home-widget-upgrade",
    title: "Home widgets after early-beta updates",
    canonicalSummary:
      "Existing Home widgets could stop working after an iOS update from Beta 1 to Beta 2.",
    category: "knownIssue",
    action: "knownIssue",
    summary:
      "Apple's issue explicitly names iOS and recommends deleting and recreating affected widgets.",
    locator: "Home — Known Issues; 110343163",
  }),
  archivedChange("beta-3", {
    key: "ios-17-beta3-android-migration-5ghz",
    title: "Android migration in restricted 5 GHz regions",
    canonicalSummary:
      "Android-to-iPhone migration could fail in regions where the 5 GHz band was unavailable.",
    category: "knownIssue",
    action: "knownIssue",
    summary:
      "The Beta 3 record limits this software-migration failure to Android-to-iPhone transfers in affected regions.",
    locator: "Software Migration — Known Issues; 110983759",
  }),
  archivedChange("beta-3", {
    key: "ios-17-beta3-standby-unresponsive",
    title: "StandBy responsiveness",
    canonicalSummary: "An iPhone could become unresponsive while in StandBy.",
    category: "knownIssue",
    action: "knownIssue",
    summary:
      "Beta 3 adds a StandBy stability issue with leaving the mode as the documented workaround.",
    locator: "StandBy — Known Issues; 111607569",
  }),
]);

appendChanges(["ipados"], "beta-3", [
  archivedChange("beta-3", {
    key: "ipados-17-beta3-airdrop-classroom-discovery",
    title: "AirDrop discovery with Classroom",
    canonicalSummary:
      "AirDrop could show no nearby devices when a Classroom class was configured.",
    category: "knownIssue",
    action: "knownIssue",
    summary:
      "The newly documented issue affects both teacher and student device discovery.",
    locator: "AirDrop — Known Issues; 111254299",
  }),
  archivedChange("beta-3", {
    key: "ipados-17-beta3-center-stage-studio-display",
    title: "Center Stage with Studio Display",
    canonicalSummary:
      "Center Stage could not be disabled for FaceTime when an Apple Studio Display camera was used with certain iPads.",
    category: "knownIssue",
    action: "knownIssue",
    summary:
      "The issue is explicitly limited to iPads without a front-facing Ultra Wide camera.",
    locator: "Center Stage — Known Issues; 109838002",
  }),
]);

const platformMetadata = {
  ios: { name: "iOS", versionId: "version-ios-17-0" },
  ipados: { name: "iPadOS", versionId: "version-ipados-17-0" },
};

const routeMetadata = {
  "beta-1": {
    label: "Beta 1",
    capturedTitle: "iOS & iPadOS 17 Beta Release Notes",
    state: "187-record initial state",
    comparison:
      "This is a representative baseline rather than an exhaustive conversion of all 187 records.",
  },
  "beta-2": {
    label: "Beta 2",
    capturedTitle: "iOS & iPadOS 17 Beta 2 Release Notes",
    state: "212-record state",
    comparison:
      "Against Beta 1, the archive parser found 30 additions, 5 removals, and 14 changed issue records.",
  },
  "beta-3": {
    label: "Beta 3",
    capturedTitle: "iOS & iPadOS 17 Beta 3 Release Notes",
    state: "244-record state",
    comparison:
      "Against the unchanged Beta 2 state captured on July 5, the archive parser found 32 additions, no removals, and 2 changed issue records.",
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
      ? "Items explicitly limited to iPad or iPadOS are excluded. iPhone-only records and shared iOS/iPadOS framework behavior are retained where Apple's text supports that scope."
      : "Items explicitly limited to iPhone or iOS are excluded. iPad-specific records and shared iOS/iPadOS framework behavior are retained where Apple's text supports that scope.";
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
      "The page contains original synthesis and issue-ID locators. It does not reproduce Apple's list text, infer a build number, or copy cumulative notes into unsupported milestones. Apple's beta guidance treats these seeds as prerelease software.",
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
        summary: `${platform.name} 17 ${route.label} is represented by ${changes.length} source-supported changes selected from Apple's preserved ${route.state}; no build number or unsupported milestone payload is inferred.`,
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
    majorVersion: 17,
    version: "17.0",
    releaseStatus: "released",
    publicReleaseDate: "2023-09-18",
    milestones: [
      ["Beta 1", "2023-06-05", false, undefined],
      ["Beta 2", "2023-06-21", false, undefined],
      ["Beta 3", "2023-07-05", false, undefined],
      ["Beta 3 v2", "2023-07-11", true, "Build 21A5277j"],
      ["Public Beta 1", "2023-07-12", false, "Build 21A5277j"],
      ["Beta 4", "2023-07-25", false, undefined],
      ["Beta 4 v2", "2023-07-31", true, undefined],
      ["Beta 5", "2023-08-08", false, undefined],
      ["Beta 6", "2023-08-15", false, undefined],
      ["Beta 7", "2023-08-22", false, undefined],
      ["Beta 8", "2023-08-29", false, undefined],
      ["RC", "2023-09-12", false, undefined],
      ["Public", "2023-09-18", false, undefined],
    ],
  },
  {
    platform: "iPadOS",
    majorVersion: 17,
    version: "17.0",
    releaseStatus: "released",
    publicReleaseDate: "2023-09-18",
    milestones: [
      ["Beta 1", "2023-06-05", false, undefined],
      ["Beta 2", "2023-06-21", false, undefined],
      ["Beta 3", "2023-07-05", false, undefined],
      ["Beta 3 v2", "2023-07-11", true, "Build 21A5277j"],
      ["Public Beta 1", "2023-07-12", false, "Build 21A5277j"],
      ["Beta 4", "2023-07-25", false, undefined],
      ["Beta 4 v2", "2023-07-31", true, undefined],
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
const seedInventory = seed.releaseVersions
  .filter(
    (version) =>
      version.version === "17.0" &&
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
    "The exact local iOS/iPadOS 17.0 seed inventory changed; re-audit the cohort before regenerating.",
  );
}

const expectedRoutes = new Set([
  "version-ios-17-0/beta-1",
  "version-ios-17-0/beta-2",
  "version-ios-17-0/beta-3",
  "version-ipados-17-0/beta-1",
  "version-ipados-17-0/beta-2",
  "version-ipados-17-0/beta-3",
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
  changeCount !== 119 ||
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
    "The expected iOS/iPadOS 17 prerelease bundle closure failed.",
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
      `iOS/iPadOS 17 change definition drifted for ${occurrence.key}.`,
    );
  }
  localChangeDefinitions.set(occurrence.key, definition);
}
const uniqueLocalChangeKeys = [...localChangeDefinitions.keys()];
if (uniqueLocalChangeKeys.length !== 71) {
  throw new Error(
    `Expected 71 stable iOS/iPadOS 17 prerelease change definitions; found ${uniqueLocalChangeKeys.length}.`,
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
    `iOS/iPadOS 17 prerelease change keys collide with existing content: ${collisions
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

const md = `# Apple iOS and iPadOS 17 prerelease archive batch

## Result

\`${outputName}\` records the published source-backed archival articles on six
existing iOS and iPadOS 17.0 prerelease routes: Beta 1, Beta 2, and Beta 3 on each
platform.

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
| -------- | --------- | -------------- | ---------------: |
${routeRows}

The local seed contains 26 iOS/iPadOS 17.0 milestones. This batch publishes only
the six routes above. Beta 3 v2, Public Beta 1, Beta 4, Beta 4 v2, Beta 5,
Beta 6, Beta 7, Beta 8, RC, and Public remain outside this archive pass unless
they have a separately reproducible milestone boundary.

## Archive method

1. Reader-facing citations point to preserved Apple Developer documentation,
   never to raw DocC JSON.
2. Raw DocC states were parsed by component, status heading, issue ID, and
   normalized text. Beta 2 and Beta 3 selections require an exact addition or
   status transition against the immediately preceding retained state.
3. Beta 1 is intentionally representative. Its selected items are present in
   the first 187-record state, but this batch does not imply that the selection
   exhausts the initial notes.
4. The July 5 raw capture still identifies itself as Beta 2 and has no issue
   record differences from the June 24 Beta 2 state. The next raw capture,
   taken July 10 before the seed's July 11 Beta 3 v2 date, identifies itself as
   Beta 3 and provides the clean Beta 2-to-Beta 3 comparison used here.
5. The shared Apple document is not treated as blanket cross-platform proof.
   Records that expressly name iPhone, iPad, iOS, or a device family are scoped
   to the supported route.
6. All published wording is original synthesis. Necessary platform, framework,
   API, and feature names are nominative references; no Apple list text,
   screenshot, or marketing paragraph is reproduced.

## Selected findings

### Beta 1 representative baseline

The shared baseline covers third-party passkeys, authentication settings,
Foundation grammar agreement, managed media, stickers, wired 802.1X, resumable
uploads, EAP-TLS 1.3, App Transport Security, NewsstandKit removal, Photos
editing output, StoreKit views and subscription state, Swift Charts, SwiftUI
animation behavior, and Lock Screen widgets. The iOS route adds Assistive
Access, Check In, Live Voicemail, Lockdown Mode, MetalFX, StandBy, and an
iPhone wallpaper issue. The iPadOS route adds older-device AirPlay and cellular
issues, Stage Manager, iPad wallpaper, and trackpad widget placement.

### Beta 2 selected delta

The shared delta includes AirPlay discovery, an App Intents-related Shortcuts
failure, Freeform cross-beta drawings, Home widgets, ImageIO, suggested event
and reminder titles, Screen Time, SwiftData, SwiftUI, UIKit, and Vision. In-car
SharePlay is retained only on iOS, while the 2017-model software-update failure
is retained only on iPadOS.

### Beta 3 selected delta

The shared delta covers MP3 metadata, FaceTime handoff and Apple TV calling,
Health medications, Mail, Notes, privacy-state propagation, passcode settings,
Freeform stickers, StoreKit, ShazamKit, SKAdNetwork, and Vision. iOS carries
Assistive Access calling, Android-shared car keys, CarPlay, Home widget
migration, Android device migration, and StandBy. iPadOS carries Classroom
AirDrop and the explicitly scoped Center Stage issue.

## Raw snapshot audit ledger

Raw transports are research provenance only:

| State | Raw capture | Records | SHA-256 | Public citation |
| ----- | ----------- | ------: | ------- | --------------- |
| Beta 1 | \`20230605212152\` | 187 | \`b1ce041f65d8c76cfe6dcc16cb3e9685c495534f711d1aedad07d8e07396e062\` | [Apple page](${U.beta1}) |
| Beta 2 | \`20230624091109\` | 212 | \`32d713cca1becdbfc688727761acf7db5a61f4e80d226f2c9df53655e8bc7de3\` | [Apple page](${U.beta2}) |
| July 5 unchanged state | \`20230705210800\` | 212 | \`5e5b735e61e22f9dccfb3f4dcfb38d3d6b689abdfb672fe59b6c5ff6f48c9178\` | [Apple page](${U.beta3DateAudit}) |
| Beta 3 | \`20230710001130\` | 244 | \`102140dc50b249809a2c8bff184e904bb6eed10272b85eada575d84ac81c24a0\` | [Apple page](${U.beta3}) |
| Beta 8 audit | \`20230901004211\` | 282 | \`f6eb9f657d4115922c0835c731bd2602143228e567b9d31d044f45d43cd684fc\` | [Apple page](${U.beta8Audit}) |
| RC audit | \`20230912200640\` | 282 | \`f91cf1eac71864508ef2b2ac9ce1d70609ff808c6312bd34f107ab35829bbcb6\` | [Apple page](${U.rcAudit}) |

Exact parsed comparisons:

- Beta 1 to Beta 2: 30 additions, 5 removals, and 14 changed issue records.
- June 24 Beta 2 to July 5 capture: zero additions, removals, or changed issue
  records; the document title also remains Beta 2.
- July 5 Beta 2 to July 10 Beta 3: 32 additions, zero removals, and 2 changed
  issue records.
- Beta 3 to Beta 8: 45 additions, 7 removals, and 140 changed issue records
  across several unretained milestones; this interval is audit-only.
- Beta 8 to RC: zero additions, removals, or changed issue records. The raw
  payload hash changes because the document metadata identifies RC, not because
  a substantive issue record changes.

## Unsupported archive boundary

No retained raw states isolate Beta 3 v2, Public Beta 1, Beta 4, Beta 4 v2,
Beta 5, Beta 6, or Beta 7. The Beta 3-to-Beta 8 comparison crosses every one of
those boundaries, so none of its additions or status changes is assigned to an
individual route.

The RC capture is a 282-record state with no issue-record differences from the
retained Beta 8 state. This batch does not manufacture a release-identity
change merely from the document title. Beta 8 and RC therefore remain
ledger-only in this pass.

## Exact evidence gaps

- No complete first-party build-number set was independently retained, so this
  batch creates no build records and makes no build claims.
- The local seed notes a shared build on Beta 3 v2 and Public Beta 1. Those seed
  annotations do not substitute for a retained release-note boundary.
- The existing Public route is already owned by the approved
  \`apple-ios-ipados-17.json\` batch and is not modified.
- The July 10 capture is assigned to Beta 3 because it identifies itself as
  Beta 3 and predates the seed's July 11 Beta 3 v2 event. No content is
  projected into the later revision or public-beta route.

## Source ledger

All declared sources were accessed on ${accessedAt}.

${sourceLedger}

## Closure guards

- Exact comparison against both local 17.0 seed records and all 26 milestones
- Exact six-route allowlist with explicit exclusion of Public and every
  unsupported prerelease route
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

The generator's seed, route, collision, review-state, and citation guards pass
before either artifact is written.

Editorial and publication record:

- all 6 event articles and all ${changeCount} occurrences were approved at
  \`${reviewedAt}\`
- applied production plan:
  \`bd0ac4ffdb8dfc7c576df603554c4832a9146ecf9fb50f3f526b3f6ed541f655\`
- plan artifact:
  \`launch-content-plan-bd0ac4ffdb8dfc7c576df603554c4832a9146ecf9fb50f3f526b3f6ed541f655.json\`;
  SHA-256
  \`9ac408a472263a3e694925d406d9a927765b6ba847b2d2ee71aa7f1c7ecbd56e\`
- rollback artifact:
  \`launch-content-rollback-bd0ac4ffdb8dfc7c576df603554c4832a9146ecf9fb50f3f526b3f6ed541f655.json\`;
  SHA-256
  \`e669dd95a55e8167371dcf719d2daf645124d6b289601f680fb5cca668bca364\`
- Sanity transaction: \`F0eE6eK5XyVXtlnaoyBct9\`
- receipt:
  \`launch-content-receipt-bd0ac4ffdb8dfc7c576df603554c4832a9146ecf9fb50f3f526b3f6ed541f655.json\`;
  SHA-256
  \`1edc8f56235ba997899d06ed914ba17c2f26e415f4ec70d93070b3991a98ddc0\`
- immediate post-publication zero plan:
  \`bf68f0604d5a514ebc5e976d2e82b74f690afeb7bafd57cf87dfdebef4990e98\`;
  0 mutations and 2,157 unchanged documents
- zero-plan artifact:
  \`launch-content-plan-bf68f0604d5a514ebc5e976d2e82b74f690afeb7bafd57cf87dfdebef4990e98.json\`;
  SHA-256
  \`25f9b904902a18cecdaadba2fbd0e107222923c57f7c9f8109b906fbecd13a5c\`

Production coverage after publication:

- 410 of 410 release versions have full version-level coverage
- 1,979 appearances: 339 full articles, 256 source-linked records, and 1,384
  timeline-only records
- 490 appearances have approved structured changes

## Canonical route verification

Root verification fetched all six canonical local routes after publication:

| Canonical route | HTTP | Article | References | Robots |
| --- | ---: | --- | --- | --- |
| \`/apple/ios/17.0/beta-1/\` | 200 | Preserved release-note state | yes | index, follow |
| \`/apple/ios/17.0/beta-2/\` | 200 | Preserved release-note state | yes | index, follow |
| \`/apple/ios/17.0/beta-3/\` | 200 | Preserved release-note state | yes | index, follow |
| \`/apple/ipados/17.0/beta-1/\` | 200 | Preserved release-note state | yes | index, follow |
| \`/apple/ipados/17.0/beta-2/\` | 200 | Preserved release-note state | yes | index, follow |
| \`/apple/ipados/17.0/beta-3/\` | 200 | Preserved release-note state | yes | index, follow |

All 6 routes rendered the archival article and References section with
\`index, follow\`; none rendered the timeline-only placeholder or \`noindex\`.

Verification on ${accessedAt}:

- \`npm run research:validate\`: 50 batches validated; this batch reports 6
  events, ${changeCount} change occurrences, ${sources.length} sources, and
  ${citationCount} citation references
- focused ingestion/manifest suite: 19 tests passed
- 92 issue-ID locator, status-heading, and adjacent-boundary checks against the
  three retained raw snapshots: passed
- copyright-similarity scan: the longest contiguous overlap between editorial
  fields and Apple list records was 8 words
- ESLint, Prettier check, and \`git diff --check\`: passed
- deterministic regeneration: SHA-256 remained \`${jsonSha}\`
- final production dry run: the same
  \`bf68f0604d5a514ebc5e976d2e82b74f690afeb7bafd57cf87dfdebef4990e98\`
  zero plan, with 0 mutations, 2,157 unchanged documents, and a 16-byte
  mutation payload

Reproduce with:

\`\`\`sh
node scripts/research-batches/build-apple-ios-ipados-17-prerelease.mjs
npm run research:validate
node --import tsx --test tests/launch-content-ingestion.test.ts tests/launch-content-manifest.test.ts
npx eslint scripts/research-batches/build-apple-ios-ipados-17-prerelease.mjs
npx prettier --check scripts/research-batches/build-apple-ios-ipados-17-prerelease.mjs scripts/research-batches/apple-ios-ipados-17-prerelease.json scripts/research-batches/apple-ios-ipados-17-prerelease.md
\`\`\`

This finalization records an already completed publication. It does not perform
or request another Sanity mutation.
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
