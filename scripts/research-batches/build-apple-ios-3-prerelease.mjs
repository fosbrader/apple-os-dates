import { createHash } from "node:crypto";
import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import prettier from "prettier";

const here = dirname(fileURLToPath(import.meta.url));
const outputName = "apple-ios-3-prerelease.json";
const ledgerName = "apple-ios-3-prerelease.md";
const accessedAt = "2026-07-30";
const reviewedAt = "2026-07-30T12:50:04Z";

const verification = {
  researchBatches: 73,
  globalChangeKeys: 4_258,
  focusedTests: 19,
  fullTests: 131,
  rawArtifacts: 22,
  rawEvidenceBytes: 3_368_803,
  normalizedArtifacts: 23,
  maximumEditorialOverlapWords: 5,
  independentSourcesFetched: 22,
  independentRawExact: 8,
  independentNormalizedExact: 21,
  independentEvidenceReproduced: 22,
};
const dryRun = {
  creates: 98,
  patches: 0,
  unchanged: 2_100,
  sourceCreates: 21,
  eventCreates: 6,
  changeCreates: 71,
  mutationPayloadBytes: 258_206,
  planSha: "37b31e20fd1004113b7f31c19f18b5777d7718fd801a3f546bb63f66acfeb457",
  planArtifactSha:
    "bf9214ddda9a7f449e43a4263b4abe834b9fd46fa433fc1c93aba8d52c78167a",
  rollbackArtifactSha:
    "52da9046e911963eaeca113c34c61afaf2963b910e135abbb542c15ec85a4806",
};
const publicationRecord = {
  transactionId: "F0eE6eK5XyVXtlnaoyYMQb",
  receiptSha:
    "9343e4bf7a64746adf7632f0bca9ac70f24a2b162caaa95bea8e9fc5cf5f4ca0",
  zeroPlanSha:
    "6fe54f9fbd270e7e3793481cebf322e85f3e60249df10438b44ab27a75fc0701",
  zeroPlanArtifactSha:
    "df7acaeaa1b243bc46ce6551cab373ca5ce0d70314531550c00fdca9ade2c0a7",
  zeroRollbackArtifactSha:
    "9a9c7242d882a6b3677963538174264f6499d8a1aa8a1aa5095d7dc1a95760f0",
  zeroCreates: 0,
  zeroPatches: 0,
  zeroUnchanged: 2_198,
  zeroPayloadBytes: 16,
  coverage: {
    totalVersions: 410,
    fullVersions: 410,
    totalAppearances: 2_002,
    fullAppearances: 449,
    sourceLinkedAppearances: 256,
    timelineOnlyAppearances: 1_297,
    approvedStructuredAppearances: 600,
  },
};

const U = {
  beta1Apple:
    "https://www.apple.com/newsroom/2009/03/17Apple-Previews-Developer-Beta-of-iPhone-OS-3-0/",
  beta2AppleInsider:
    "https://appleinsider.com/articles/09/03/31/apple_releases_second_beta_of_iphone_3_0_software_to_developers",
  beta2Ilounge:
    "https://web.archive.org/web/20090402150947id_/http://www.ilounge.com:80/index.php/news/comments/apple-releases-iphone-os-30-beta-2-with-push-calendar-updates/",
  beta2World:
    "https://web.archive.org/web/20090403075532id_/http://news.worldofapple.com:80/archives/2009/03/31/iphone-os-30-beta-2-released/",
  beta3AppleInsider:
    "https://appleinsider.com/articles/09/04/15/iphone_software_3_0_beta_3_delivers_gradual_improvements",
  beta3Ars:
    "https://arstechnica.com/gadgets/2009/04/apple-posts-third-iphone-os-30-beta-with-minor-api-changes/",
  beta3MacRumors:
    "https://www.macrumors.com/2009/04/14/apple-seeds-iphone-os-3-0-beta-3-and-new-sdk-to-developers/",
  beta3World:
    "https://web.archive.org/web/20090417052932id_/http://news.worldofapple.com:80/archives/2009/04/14/iphone-developers-receive-third-beta-of-iphone-os-30/",
  beta4Advisory:
    "https://s3.cloud.cmctelecom.vn/tinhte1/2009/04/2755045_iphone_os_3.0_beta_4_preinstallation_advisory.pdf",
  beta4Ars:
    "https://arstechnica.com/gadgets/2009/04/details-about-iphone-os-30-beta-4-and-prerelease-itunes-82/",
  beta4Iclarified:
    "https://www.iclarified.com/3724/iphone-os-30-beta-4-supports-multiple-itunes-accounts",
  beta4MacRumors:
    "https://www.macrumors.com/2009/04/28/apple-seeds-iphone-os-3-0-beta-4-and-itunes-8-2-pre-release-to-developers/",
  beta5Compat:
    "https://www.macrumors.com/2009/05/07/app-store-submissions-now-being-reviewed-for-iphone-os-3-0-compatibility/",
  beta5Engadget:
    "https://www.engadget.com/2009-05-06-iphone-os-3-0-beta-5-now-available.html",
  beta5Gizmodo: "https://gizmodo.com/iphone-os-3-0-beta-5-is-out-now-5243450",
  beta5Groups: "https://groups.google.com/g/phonegap/c/obseCVn6_po",
  beta5MacRumors:
    "https://www.macrumors.com/2009/05/06/apple-releases-iphone-os-3-0-beta-5-and-new-itunes-8-2-pre-release-to-developers/",
  beta5SlashGear:
    "https://www.slashgear.com/apple-iphone-os-30-beta-5-released-mms-hole-closed-0743063/",
  gmAppleInsider:
    "https://appleinsider.com/articles/09/06/08/apple_unveils_new_iphone_3_0_features_sets_release_for_june_17th",
  gmEngadget:
    "https://www.engadget.com/2009-06-08-iphone-os-3-0-gold-release-in-pictures.html",
  gmIclarified:
    "https://www.iclarified.com/4151/apple-seeds-iphone-30-gold-master-to-developers-with-warning",
  gmMacworld: "https://www.macworld.com/article/198495/iphone30release.html",
};

const sources = [
  {
    url: U.beta1Apple,
    title: "Apple Previews Developer Beta of iPhone OS 3.0",
    publisher: "Apple Newsroom",
    sourceClass: "firstPartyAnnouncement",
    publishedAt: "2009-03-17T00:00:00Z",
    topics: ["iPhone OS", "3.0", "features", "developer APIs"],
  },
  {
    url: U.beta2AppleInsider,
    title: "Apple releases second beta of iPhone 3.0 Software to developers",
    publisher: "AppleInsider",
    sourceClass: "journalism",
    author: "Sam Oliver",
    publishedAt: "2009-03-31T17:00:00-04:00",
    topics: ["iPhone OS 3.0", "Beta 2", "push notifications", "SDK"],
  },
  {
    url: U.beta2Ilounge,
    title: "Apple releases iPhone OS 3.0 Beta 2 with push notifications",
    publisher: "iLounge",
    sourceClass: "archive",
    author: "Charles Starrett",
    publishedAt: "2009-03-31T00:00:00Z",
    topics: ["iPhone OS 3.0", "Beta 2", "push notifications", "SpringBoard"],
  },
  {
    url: U.beta2World,
    title: "iPhone OS 3.0 Beta 2 Released",
    publisher: "World of Apple",
    sourceClass: "archive",
    author: "Alex Brooks",
    publishedAt: "2009-03-31T22:30:00+01:00",
    topics: ["iPhone OS 3.0", "Beta 2", "developer seed", "limitations"],
  },
  {
    url: U.beta3AppleInsider,
    title: "iPhone Software 3.0 beta 3 delivers gradual improvements",
    publisher: "AppleInsider",
    sourceClass: "journalism",
    author: "AppleInsider Staff",
    publishedAt: "2009-04-15T00:05:00Z",
    topics: ["iPhone OS 3.0", "Beta 3", "performance", "Spotlight"],
  },
  {
    url: U.beta3Ars,
    title: "Apple posts third iPhone OS 3.0 beta with minor API changes",
    publisher: "Ars Technica",
    sourceClass: "journalism",
    author: "Chris Foresman",
    publishedAt: "2009-04-14T23:54:34Z",
    topics: ["iPhone OS 3.0", "Beta 3", "SDK", "push notifications"],
  },
  {
    url: U.beta3MacRumors,
    title: "Apple Seeds iPhone OS 3.0 Beta 3 and New SDK to Developers",
    publisher: "MacRumors",
    sourceClass: "journalism",
    author: "Eric Slivka",
    publishedAt: "2009-04-14T15:50:16-07:00",
    topics: ["iPhone OS 3.0", "Beta 3", "SDK", "release identity"],
  },
  {
    url: U.beta3World,
    title: "iPhone Developers Receive Third Beta of iPhone OS 3.0",
    publisher: "World of Apple",
    sourceClass: "archive",
    author: "Alex Brooks",
    publishedAt: "2009-04-14T23:00:00+01:00",
    topics: [
      "iPhone OS 3.0",
      "Beta 3",
      "Apple SDK seed notes",
      "historical transcript",
    ],
  },
  {
    url: U.beta4Advisory,
    title: "iPhone OS 3.0 beta 4 software release - Pre-Installation Advisory",
    publisher: "Apple Developer (third-party PDF mirror)",
    sourceClass: "archive",
    author: "Apple",
    publishedAt: "2009-04-28T00:00:00Z",
    topics: ["iPhone OS 3.0", "Beta 4", "installation", "developer advisory"],
  },
  {
    url: U.beta4Ars,
    title: "Details about iPhone OS 3.0 beta 4 and prerelease iTunes 8.2",
    publisher: "Ars Technica",
    sourceClass: "journalism",
    author: "Chris Foresman",
    publishedAt: "2009-04-29T18:43:19Z",
    topics: ["iPhone OS 3.0", "Beta 4", "SDK", "iTunes 8.2"],
  },
  {
    url: U.beta4Iclarified,
    title: "iPhone OS 3.0 Beta 4 Supports Multiple iTunes Accounts",
    publisher: "iClarified",
    sourceClass: "journalism",
    author: "Shalom Levytam",
    publishedAt: "2009-04-29T19:27:03Z",
    topics: ["iPhone OS 3.0", "Beta 4", "Store", "accounts"],
  },
  {
    url: U.beta4MacRumors,
    title:
      "iPhone OS 3.0 Beta 4 and iTunes 8.2 Pre-Release to Developers [Blu-Ray Evidence?]",
    publisher: "MacRumors",
    sourceClass: "journalism",
    author: "Eric Slivka",
    publishedAt: "2009-04-28T19:49:45-07:00",
    topics: ["iPhone OS 3.0", "Beta 4", "iTunes 8.2", "release identity"],
  },
  {
    url: U.beta5Compat,
    title:
      "App Store Submissions Now Being Reviewed for iPhone OS 3.0 Compatibility",
    publisher: "MacRumors",
    sourceClass: "journalism",
    author: "Eric Slivka",
    publishedAt: "2009-05-07T13:54:03-07:00",
    topics: ["iPhone OS 3.0", "Beta 5", "App Store", "compatibility"],
  },
  {
    url: U.beta5Engadget,
    title: "iPhone OS 3.0 beta 5 now available",
    publisher: "Engadget",
    sourceClass: "journalism",
    author: "Ross Miller",
    publishedAt: "2009-05-07T03:16:00Z",
    topics: ["iPhone OS 3.0", "Beta 5", "iTunes 8.2", "MMS"],
  },
  {
    url: U.beta5Gizmodo,
    title: "iPhone OS 3.0 Beta 5 Is Out Now",
    publisher: "Gizmodo",
    sourceClass: "journalism",
    author: "Jesus Diaz",
    publishedAt: "2009-05-06T23:06:02-04:00",
    topics: ["iPhone OS 3.0", "Beta 5", "release identity"],
  },
  {
    url: U.beta5Groups,
    title:
      "Apple developer compatibility message preserved in 3.0 Features thread",
    publisher: "PhoneGap Google Group",
    sourceClass: "archive",
    author: "Apple",
    publishedAt: "2009-05-07T00:00:00Z",
    topics: ["iPhone OS 3.0", "Beta 5", "App Store", "developer compatibility"],
  },
  {
    url: U.beta5MacRumors,
    title:
      "Apple Releases iPhone OS 3.0 Beta 5 and New iTunes 8.2 Pre-Release to Developers",
    publisher: "MacRumors",
    sourceClass: "journalism",
    author: "Eric Slivka",
    publishedAt: "2009-05-06T20:26:44-07:00",
    topics: ["iPhone OS 3.0", "Beta 5", "StoreKit", "iTunes 8.2"],
  },
  {
    url: U.beta5SlashGear,
    title: "Apple iPhone OS 3.0 Beta 5 Released: MMS Hole Closed",
    publisher: "SlashGear",
    sourceClass: "journalism",
    author: "Chris Davies",
    publishedAt: "2009-05-07T08:53:03Z",
    topics: ["iPhone OS 3.0", "Beta 5", "MMS", "carrier settings"],
  },
  {
    url: U.gmAppleInsider,
    title: "Apple unveils new iPhone 3.0 features, sets release for June 17th",
    publisher: "AppleInsider",
    sourceClass: "journalism",
    author: "Prince McLean",
    publishedAt: "2009-06-08T19:00:00-04:00",
    topics: ["iPhone OS 3.0", "Golden Master", "WWDC", "release features"],
  },
  {
    url: U.gmEngadget,
    title: "iPhone OS 3.0 gold release in pictures",
    publisher: "Engadget",
    sourceClass: "journalism",
    author: "Chris Ziegler",
    publishedAt: "2009-06-09T02:40:00Z",
    topics: ["iPhone OS 3.0", "Golden Master", "Store", "MMS"],
  },
  {
    url: U.gmIclarified,
    title: "Apple Seeds iPhone 3.0 Gold Master to Developers With WARNING",
    publisher: "iClarified",
    sourceClass: "journalism",
    author: "Shalom Levytam",
    publishedAt: "2009-06-08T20:06:55Z",
    topics: ["iPhone OS 3.0", "Golden Master", "installation warning"],
  },
  {
    url: U.gmMacworld,
    title: "iPhone OS 3.0 coming on June 17",
    publisher: "Macworld",
    sourceClass: "journalism",
    author: "Peter Cohen",
    publishedAt: "2009-06-08T04:51:00-07:00",
    topics: ["iPhone OS 3.0", "Golden Master", "public release", "MMS"],
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

const record = (
  id,
  title,
  canonicalSummary,
  category,
  action,
  component,
  sourceKeys,
  {
    documentedStatus = "documented",
    evidenceState = "reported",
    locator = component,
    verification,
    stableKey,
    inheritance = "delta",
    occurrenceSummary,
  } = {},
) => ({
  id,
  title,
  canonicalSummary,
  category,
  action,
  component,
  sourceKeys,
  documentedStatus,
  evidenceState,
  locator,
  verification,
  stableKey,
  inheritance,
  occurrenceSummary,
});

const beta1Changes = [
  record(
    "in-app-purchases",
    "Applications could sell content from within the app",
    "The preview exposed a commerce interface for purchasing additional application content.",
    "developerApi",
    "introduced",
    "In-App Purchase",
    ["beta1Apple"],
    { evidenceState: "confirmed", locator: "developer APIs and App Store" },
  ),
  record(
    "bluetooth-peer-links",
    "Bluetooth supported peer application links",
    "The SDK let nearby applications communicate through a peer-to-peer Bluetooth interface.",
    "developerApi",
    "introduced",
    "Bluetooth",
    ["beta1Apple"],
    { evidenceState: "confirmed", locator: "peer-to-peer connectivity API" },
  ),
  record(
    "external-accessories",
    "Applications could communicate with external accessories",
    "A new accessory interface opened communication with compatible hardware attached to an iPhone or iPod touch.",
    "developerApi",
    "introduced",
    "External Accessory",
    ["beta1Apple"],
    { evidenceState: "confirmed", locator: "hardware accessory API" },
  ),
  record(
    "ipod-library-access",
    "Applications gained access to the device music library",
    "Developers could read and play music from the user's on-device media library.",
    "developerApi",
    "introduced",
    "Media Player",
    ["beta1Apple"],
    { evidenceState: "confirmed", locator: "iPod library access" },
  ),
  record(
    "maps-api",
    "Maps became available inside third-party applications",
    "The SDK provided an interface for embedding map data and map interaction in applications.",
    "developerApi",
    "introduced",
    "Maps",
    ["beta1Apple"],
    { evidenceState: "confirmed", locator: "Maps API" },
  ),
  record(
    "push-notifications",
    "The push notification service entered the SDK baseline",
    "Applications could register for remote alerts delivered through Apple's notification service.",
    "developerApi",
    "introduced",
    "Push Notifications",
    ["beta1Apple"],
    { evidenceState: "confirmed", locator: "Push Notification service" },
  ),
  record(
    "cut-copy-paste",
    "System editing gained cut, copy, and paste",
    "The operating-system preview added reusable clipboard actions across first-party and third-party applications.",
    "feature",
    "introduced",
    "Text editing",
    ["beta1Apple"],
    { evidenceState: "confirmed", locator: "consumer feature overview" },
  ),
  record(
    "mms",
    "Messages added multimedia messaging support",
    "The preview included messaging for photos, audio, contact cards, and location data where carrier service supported it.",
    "feature",
    "introduced",
    "Messages",
    ["beta1Apple"],
    { evidenceState: "confirmed", locator: "MMS feature overview" },
  ),
  record(
    "landscape-apps",
    "More built-in applications supported landscape entry",
    "Mail, Messages, and Notes could use a wider landscape keyboard and layout.",
    "enhancement",
    "introduced",
    "Built-in applications",
    ["beta1Apple"],
    { evidenceState: "confirmed", locator: "landscape keyboard support" },
  ),
  record(
    "stereo-bluetooth",
    "Stereo Bluetooth audio joined the feature baseline",
    "Compatible wireless audio devices could receive stereo sound from the operating system.",
    "feature",
    "introduced",
    "Bluetooth audio",
    ["beta1Apple"],
    { evidenceState: "confirmed", locator: "stereo Bluetooth support" },
  ),
  record(
    "notes-sync",
    "Notes could synchronize with a computer",
    "The preview added desktop synchronization for notes stored on the device.",
    "enhancement",
    "introduced",
    "Notes",
    ["beta1Apple"],
    { evidenceState: "confirmed", locator: "Notes synchronization" },
  ),
  record(
    "shake-to-shuffle",
    "Music playback added a shake-to-shuffle control",
    "A motion gesture could select another shuffled track during music playback.",
    "feature",
    "introduced",
    "Music",
    ["beta1Apple"],
    { evidenceState: "confirmed", locator: "music playback features" },
  ),
  record(
    "parental-controls",
    "Parental restrictions expanded to media and applications",
    "Device restrictions could cover additional media categories and App Store content.",
    "enhancement",
    "introduced",
    "Restrictions",
    ["beta1Apple"],
    { evidenceState: "confirmed", locator: "parental controls" },
  ),
  record(
    "wifi-hotspot-login",
    "Known Wi-Fi hotspots could log in more automatically",
    "The system preview reduced repeated sign-in steps when reconnecting to supported hotspot networks.",
    "enhancement",
    "introduced",
    "Wi-Fi",
    ["beta1Apple"],
    { evidenceState: "confirmed", locator: "Wi-Fi hotspot login" },
  ),
  record(
    "voice-memos",
    "A built-in voice recording application was added",
    "Voice Memos provided a first-party way to capture and manage spoken recordings.",
    "feature",
    "introduced",
    "Voice Memos",
    ["beta1Apple"],
    { evidenceState: "confirmed", locator: "Voice Memos application" },
  ),
  record(
    "in-app-search",
    "Built-in applications expanded their search controls",
    "The preview added or broadened local search within several first-party applications.",
    "enhancement",
    "introduced",
    "Search",
    ["beta1Apple"],
    { evidenceState: "confirmed", locator: "search in built-in apps" },
  ),
  record(
    "spotlight",
    "Spotlight provided device-wide search",
    "A system search surface indexed information across applications and device content.",
    "feature",
    "introduced",
    "Spotlight",
    ["beta1Apple"],
    { evidenceState: "confirmed", locator: "Spotlight Search" },
  ),
  record(
    "calendar-standards",
    "Calendar added CalDAV and subscribed-calendar support",
    "The calendar client expanded standards-based synchronization and subscription options.",
    "compatibility",
    "introduced",
    "Calendar",
    ["beta1Apple"],
    { evidenceState: "confirmed", locator: "calendar interoperability" },
  ),
];

const beta2Changes = [
  record(
    "push-live-testing",
    "Push notification testing became available",
    "Developers could begin testing remote notification delivery against the live seed service.",
    "developerApi",
    "introduced",
    "Push Notifications",
    ["beta2Ilounge", "beta2AppleInsider"],
    {
      documentedStatus: "partiallyDocumented",
      evidenceState: "corroborated",
      locator: "Push service testing",
    },
  ),
  record(
    "springboard-page-limit",
    "The home screen expanded to eleven application pages",
    "The seed raised the visible application capacity to eleven pages, or roughly 180 icons.",
    "enhancement",
    "changed",
    "SpringBoard",
    ["beta2Ilounge"],
    { documentedStatus: "undocumented", locator: "eleven home-screen pages" },
  ),
  record(
    "store-settings-unfinished",
    "Store account settings panel functionality",
    "The prerelease Store settings panel could expose controls before its account actions were functional.",
    "bugFix",
    "knownIssue",
    "Store settings",
    ["beta2World", "beta2AppleInsider", "beta2Ilounge"],
    {
      documentedStatus: "undocumented",
      evidenceState: "corroborated",
      locator: "Store settings panel",
      stableKey: "store-settings-panel",
      occurrenceSummary:
        "Beta 2 exposed the Store settings surface while the retained reports still described its visible controls as unfinished.",
    },
  ),
  record(
    "performance-stability",
    "General performance and stability improved",
    "Contemporaneous testing described a faster and more stable seed than the first developer beta.",
    "enhancement",
    "changed",
    "System performance",
    ["beta2AppleInsider"],
    {
      documentedStatus: "undocumented",
      locator: "performance and stability observations",
    },
  ),
  record(
    "in-app-purchase-testing",
    "In-App Purchase implementation guidance advanced",
    "The developer seed expanded the test path and implementation guidance for application-based purchases.",
    "developerApi",
    "changed",
    "In-App Purchase",
    ["beta2AppleInsider"],
    {
      documentedStatus: "partiallyDocumented",
      locator: "developer guidance and testing",
    },
  ),
  record(
    "mms-carrier-availability",
    "Carrier-gated MMS availability",
    "MMS capability could remain unusable until a carrier enabled supporting service and settings.",
    "compatibility",
    "knownIssue",
    "Messages",
    ["beta2World", "beta2AppleInsider"],
    {
      documentedStatus: "partiallyDocumented",
      evidenceState: "corroborated",
      locator: "MMS availability limitation",
      stableKey: "mms-carrier-availability",
      occurrenceSummary:
        "Beta 2 reporting still placed MMS behind unavailable carrier support rather than presenting it as a generally usable seed feature.",
    },
  ),
  record(
    "tethering-unavailable",
    "Carrier-gated tethering availability",
    "Tethering availability varied across prerelease seeds and could depend on carrier configuration.",
    "compatibility",
    "knownIssue",
    "Tethering",
    ["beta2World", "beta2AppleInsider"],
    {
      documentedStatus: "partiallyDocumented",
      evidenceState: "corroborated",
      locator: "tethering availability limitation",
      stableKey: "tethering-availability",
      occurrenceSummary:
        "Beta 2 sources said tethering would not be available during the beta program; later retained evidence shows that state changed without identifying the exact intervening seed.",
    },
  ),
];

const beta3SdkSources = ["beta3World"];
const beta3SdkBaseline = (locator) => ({
  locator,
  inheritance: "cumulative",
  occurrenceSummary:
    "The retained Beta 3 SDK transcription includes this bundled tool capability as baseline context; its exact first seed is not claimed.",
});
const beta3Changes = [
  record(
    "prior-os-target-testing",
    "Applications targeting earlier system versions could not be tested",
    "The seed warned that projects targeting earlier iPhone OS versions could not be exercised with this toolchain state.",
    "knownIssue",
    "knownIssue",
    "SDK compatibility",
    ["beta3World", "beta3MacRumors", "beta3AppleInsider"],
    {
      evidenceState: "corroborated",
      locator: "seed compatibility warning",
    },
  ),
  record(
    "xcode-assistants-templates",
    "Xcode project assistants and templates",
    "The retained SDK notes describe revised creation assistants and starter templates in Xcode.",
    "developerApi",
    "changed",
    "Xcode",
    beta3SdkSources,
    beta3SdkBaseline("Xcode item 1"),
  ),
  record(
    "xcode-overview-toolbar",
    "Xcode Overview toolbar control",
    "The retained SDK baseline includes a toolbar overview for navigating core project configuration.",
    "developerApi",
    "changed",
    "Xcode",
    beta3SdkSources,
    beta3SdkBaseline("Xcode item 2"),
  ),
  record(
    "xcode-active-sdk-override",
    "Global Active SDK override",
    "The retained SDK baseline includes a global control for overriding the active SDK selected for project builds.",
    "developerApi",
    "changed",
    "Xcode",
    beta3SdkSources,
    beta3SdkBaseline("Xcode item 3"),
  ),
  record(
    "xcode-build-setting-shortcuts",
    "Shortcuts for common Xcode build settings",
    "The retained SDK baseline includes quicker access to frequently changed build options.",
    "developerApi",
    "changed",
    "Xcode",
    beta3SdkSources,
    beta3SdkBaseline("Xcode item 4"),
  ),
  record(
    "xcode-target-libraries",
    "Libraries and frameworks in Xcode target windows",
    "The retained SDK baseline describes managing linked libraries and frameworks from the target configuration window.",
    "developerApi",
    "changed",
    "Xcode",
    beta3SdkSources,
    beta3SdkBaseline("Xcode item 5"),
  ),
  record(
    "xcode-weak-linking",
    "Weak-link designation in Xcode",
    "The retained SDK baseline describes marking linked dependencies as optional through the target interface.",
    "developerApi",
    "changed",
    "Xcode",
    beta3SdkSources,
    beta3SdkBaseline("Xcode item 6"),
  ),
  record(
    "xcode-edit-scope",
    "Edit-all-in-scope control in Xcode",
    "The retained SDK baseline includes a scoped source-editing operation for updating matching symbols.",
    "developerApi",
    "changed",
    "Xcode",
    beta3SdkSources,
    beta3SdkBaseline("Xcode item 7"),
  ),
  record(
    "xcode-conditional-settings",
    "Conditional build settings in Xcode",
    "The retained SDK baseline describes varying selected build settings by architecture and SDK.",
    "developerApi",
    "changed",
    "Xcode",
    beta3SdkSources,
    beta3SdkBaseline("Xcode item 8"),
  ),
  record(
    "ib-drag-reparent",
    "Drag-based reparenting in Interface Builder",
    "The retained SDK baseline describes moving interface objects into a different parent through direct manipulation.",
    "developerApi",
    "changed",
    "Interface Builder",
    beta3SdkSources,
    beta3SdkBaseline("Interface Builder item 1"),
  ),
  record(
    "ib-outline-reorder",
    "Outline reordering in Interface Builder",
    "The retained SDK baseline describes direct reordering of interface objects in the document outline.",
    "developerApi",
    "changed",
    "Interface Builder",
    beta3SdkSources,
    beta3SdkBaseline("Interface Builder item 2"),
  ),
  record(
    "ib-string-localization",
    "String-table localization in Interface Builder",
    "The retained SDK baseline describes editing localized interface text through a string-table workflow.",
    "developerApi",
    "changed",
    "Interface Builder",
    beta3SdkSources,
    beta3SdkBaseline("Interface Builder item 3"),
  ),
  record(
    "ib-diff-friendly-xib",
    "Diff-friendly XIB documents",
    "The retained SDK baseline describes XIB output intended to produce more reviewable source-control differences.",
    "developerApi",
    "changed",
    "Interface Builder",
    beta3SdkSources,
    beta3SdkBaseline("Interface Builder item 4"),
  ),
  record(
    "dashcode-iphone-web-apps",
    "iPhone web-application workflow in Dashcode",
    "The retained SDK baseline includes a Dashcode workflow for building web applications aimed at iPhone.",
    "developerApi",
    "changed",
    "Dashcode",
    beta3SdkSources,
    beta3SdkBaseline("Dashcode item 1"),
  ),
  record(
    "push-registration-options",
    "Push registration separated alert capabilities",
    "Applications could register independently for badge, text-alert, and sound notification behaviors.",
    "developerApi",
    "changed",
    "Push Notifications",
    ["beta3Ars"],
    {
      documentedStatus: "undocumented",
      locator: "remote-notification registration options",
    },
  ),
  record(
    "keyboard-performance",
    "Keyboard input responsiveness improved",
    "A contemporaneous hands-on report described smoother text entry in the third seed.",
    "enhancement",
    "changed",
    "Keyboard",
    ["beta3AppleInsider"],
    {
      documentedStatus: "undocumented",
      locator: "keyboard performance observation",
    },
  ),
  record(
    "app-store-app-performance",
    "The built-in App Store felt more responsive",
    "Contemporaneous hands-on testing reported speed improvements while using the on-device storefront.",
    "enhancement",
    "changed",
    "App Store",
    ["beta3AppleInsider"],
    {
      documentedStatus: "undocumented",
      locator: "on-device App Store performance",
    },
  ),
  record(
    "spotlight-query-controls",
    "Spotlight remembered queries and offered exclusions",
    "The search interface retained the previous query and added settings for excluding content categories.",
    "enhancement",
    "changed",
    "Spotlight",
    ["beta3AppleInsider"],
    {
      documentedStatus: "undocumented",
      locator: "Spotlight behavior observation",
    },
  ),
];

const beta4AdvisorySources = ["beta4Advisory"];
const beta4Changes = [
  record(
    "sdk-host-requirements",
    "The SDK required an Intel Mac and Mac OS X 10.5.6 or later",
    "The installation advisory limited the developer toolchain to Intel-based Macs running at least Mac OS X 10.5.6.",
    "compatibility",
    "changed",
    "SDK installation",
    beta4AdvisorySources,
    {
      evidenceState: "confirmed",
      locator: "page 1; supported development host",
    },
  ),
  record(
    "itunes-82-required",
    "Prerelease iTunes 8.2 installation dependency",
    "Installing and activating the device seed required the companion iTunes 8.2 prerelease.",
    "compatibility",
    "changed",
    "iTunes",
    beta4AdvisorySources,
    {
      evidenceState: "confirmed",
      locator: "page 1; installation order",
      stableKey: "itunes-82-prerequisite",
    },
  ),
  record(
    "itunes-development-only",
    "The companion iTunes build was limited to development use",
    "Apple's advisory restricted the prerelease desktop software to testing and cautioned against using a primary media library.",
    "knownIssue",
    "knownIssue",
    "iTunes",
    beta4AdvisorySources,
    { evidenceState: "confirmed", locator: "page 1; usage warning" },
  ),
  record(
    "device-test-lock",
    "Prerelease device downgrade restriction",
    "Devices upgraded to the prerelease seed could not return to an earlier operating-system version.",
    "compatibility",
    "knownIssue",
    "Device installation",
    beta4AdvisorySources,
    {
      evidenceState: "confirmed",
      locator: "page 2; device lock warning",
      stableKey: "device-test-lock",
    },
  ),
  record(
    "commerce-push-development",
    "Push and In-App Purchase development remained enabled",
    "The advisory identified both remote notifications and application commerce as active developer services in this seed.",
    "developerApi",
    "changed",
    "Developer services",
    beta4AdvisorySources,
    {
      evidenceState: "confirmed",
      locator: "page 2; enabled APIs",
      inheritance: "cumulative",
      occurrenceSummary:
        "The Beta 4 advisory confirms that push-notification and application-commerce development remained available; it is retained as context, not claimed as a newly enabled state.",
    },
  ),
  record(
    "push-provisioning",
    "Team agents could provision push components",
    "Authorized development-team administrators could configure the required push-notification assets in the provisioning portal.",
    "developerApi",
    "introduced",
    "Developer portal",
    beta4AdvisorySources,
    { evidenceState: "confirmed", locator: "page 2; portal provisioning" },
  ),
  record(
    "beta-app-submission",
    "Applications built with the beta SDK could not be submitted",
    "The prerelease toolchain was valid for development testing but not for App Store submission.",
    "compatibility",
    "knownIssue",
    "App Store submission",
    beta4AdvisorySources,
    { evidenceState: "confirmed", locator: "page 2; submission restriction" },
  ),
  record(
    "carrier-activation-first",
    "Carrier service had to be activated before installation",
    "The advisory required an active carrier account on the test device before applying the seed.",
    "compatibility",
    "knownIssue",
    "Carrier activation",
    beta4AdvisorySources,
    { evidenceState: "confirmed", locator: "page 2; activation prerequisite" },
  ),
  record(
    "alternate-sim-data-plan",
    "Alternate SIM testing required an appropriate data plan",
    "Developers using a different SIM were told to verify that its account included sufficient data service.",
    "knownIssue",
    "knownIssue",
    "Cellular data",
    beta4AdvisorySources,
    { evidenceState: "confirmed", locator: "page 2; data-plan warning" },
  ),
  record(
    "uikit-nonatomic-properties",
    "Selected UIKit properties became nonatomic",
    "The Beta 4 SDK changed memory-access semantics on a set of UIKit properties.",
    "developerApi",
    "changed",
    "UIKit",
    ["beta4Ars"],
    {
      documentedStatus: "partiallyDocumented",
      locator: "UIKit property attributes",
    },
  ),
  record(
    "view-controller-search",
    "View controllers gained search-controller support",
    "UIKit exposed additional integration between view controllers and search display behavior.",
    "developerApi",
    "introduced",
    "UIKit",
    ["beta4Ars"],
    {
      documentedStatus: "partiallyDocumented",
      locator: "UIViewController search integration",
    },
  ),
  record(
    "store-settings-functional",
    "Store account settings panel functionality",
    "The prerelease Store settings panel could expose controls before its account actions were functional.",
    "bugFix",
    "fixed",
    "Store settings",
    ["beta4Ars", "beta4Iclarified"],
    {
      documentedStatus: "undocumented",
      evidenceState: "corroborated",
      locator: "Store account controls",
      stableKey: "store-settings-panel",
      occurrenceSummary:
        "By Beta 4, contemporaneous reports described the previously unfinished panel as able to handle sign-in, payment information, and redemption tasks.",
    },
  ),
  record(
    "app-store-multiple-accounts",
    "The App Store exposed a multiple-account sign-in flow",
    "Users could switch the store account used by the on-device purchasing interface.",
    "enhancement",
    "introduced",
    "App Store",
    ["beta4Iclarified"],
    {
      documentedStatus: "undocumented",
      locator: "multiple iTunes accounts",
    },
  ),
  record(
    "encrypted-backups",
    "iTunes exposed encrypted iPhone backup controls",
    "The companion desktop beta added an option for protecting device backups with encryption.",
    "feature",
    "introduced",
    "iTunes backup",
    ["beta4Ars"],
    {
      documentedStatus: "undocumented",
      locator: "encrypted backup option",
    },
  ),
  record(
    "notes-sync-desktop",
    "iTunes added Notes synchronization",
    "The companion desktop release could synchronize device notes when paired with the required Mac OS X update.",
    "enhancement",
    "introduced",
    "Notes sync",
    ["beta4Ars"],
    {
      documentedStatus: "undocumented",
      locator: "Notes synchronization and host requirement",
    },
  ),
];

const beta5Changes = [
  record(
    "itunes-prerequisite",
    "Prerelease iTunes 8.2 installation dependency",
    "Installing and activating the device seed required the companion iTunes 8.2 prerelease.",
    "compatibility",
    "changed",
    "iTunes",
    ["beta5MacRumors", "beta5Engadget"],
    {
      documentedStatus: "partiallyDocumented",
      evidenceState: "corroborated",
      locator: "installation prerequisite",
      stableKey: "itunes-82-prerequisite",
      inheritance: "cumulative",
      occurrenceSummary:
        "Beta 5 reporting retained the same companion-iTunes prerequisite documented for Beta 4; this is a continuing state rather than a newly introduced dependency.",
    },
  ),
  record(
    "storekit-api-change",
    "StoreKit changed without a surviving detailed delta",
    "The retained report identifies a StoreKit API revision and fixes, but does not preserve the underlying member-level changes.",
    "developerApi",
    "changed",
    "StoreKit",
    ["beta5MacRumors"],
    {
      documentedStatus: "partiallyDocumented",
      locator: "reported release-note summary",
      verification:
        "The publisher preserves only a high-level description. No API detail is inferred, and the exact delta remains an explicit archive gap.",
    },
  ),
  record(
    "tethering-functional-state",
    "Carrier-gated tethering availability",
    "Tethering availability varied across prerelease seeds and could depend on carrier configuration.",
    "compatibility",
    "changed",
    "Tethering",
    ["beta5SlashGear"],
    {
      documentedStatus: "undocumented",
      locator: "tethering still functional",
      stableKey: "tethering-availability",
      inheritance: "cumulative",
      occurrenceSummary:
        "A Beta 5 report described tethering as still functional. Because it does not identify the enabling seed, this is a cumulative state rather than a claimed Beta 5 first appearance.",
    },
  ),
  record(
    "att-data-loss",
    "A small AT&T test cohort could lose cellular data",
    "Apple's preserved warning identified a limited group of developers whose data service might stop after the upgrade.",
    "knownIssue",
    "knownIssue",
    "Cellular data",
    ["beta5SlashGear"],
    { locator: "preserved Apple cellular-data warning" },
  ),
  record(
    "submission-review-baseline",
    "New submissions were reviewed against Beta 5 compatibility",
    "App Store review began checking newly submitted applications against the current system seed.",
    "compatibility",
    "changed",
    "App Store review",
    ["beta5Groups", "beta5Compat"],
    {
      evidenceState: "corroborated",
      locator: "preserved Apple compatibility message",
    },
  ),
  record(
    "incompatible-submission-rejection",
    "Incompatible new applications could be rejected",
    "The compatibility notice warned that new submissions failing on the fifth seed would not pass review.",
    "compatibility",
    "changed",
    "App Store review",
    ["beta5Groups", "beta5Compat"],
    {
      evidenceState: "corroborated",
      locator: "new-submission compatibility policy",
    },
  ),
  record(
    "existing-app-testing",
    "Developers were asked to test existing applications",
    "The preserved notice called for compatibility testing of applications already distributed through the store.",
    "compatibility",
    "changed",
    "Application testing",
    ["beta5Groups", "beta5Compat"],
    {
      evidenceState: "corroborated",
      locator: "existing-application testing request",
    },
  ),
  record(
    "existing-app-removal-risk",
    "Persistently incompatible applications could be removed",
    "The notice said existing store applications might later be withdrawn if they remained incompatible with the new system.",
    "compatibility",
    "changed",
    "App Store catalog",
    ["beta5Groups", "beta5Compat"],
    {
      evidenceState: "corroborated",
      locator: "existing-application compatibility policy",
    },
  ),
  record(
    "mms-activation-control",
    "The visible MMS activation control was removed",
    "The fifth seed no longer exposed the earlier user-facing control for enabling multimedia messaging.",
    "removal",
    "removed",
    "Messages",
    ["beta5SlashGear", "beta5Engadget"],
    {
      documentedStatus: "undocumented",
      evidenceState: "corroborated",
      locator: "MMS control observation",
    },
  ),
  record(
    "carrier-update-control",
    "The carrier-file update control was disabled",
    "A previously accessible carrier-settings update path could no longer be used in the seed.",
    "behavior",
    "changed",
    "Carrier settings",
    ["beta5SlashGear"],
    {
      documentedStatus: "undocumented",
      locator: "carrier update control",
    },
  ),
  record(
    "landscape-trash-icon",
    "A trash control appeared in landscape-oriented applications",
    "A visible deletion icon appeared in some applications when they were used in landscape orientation.",
    "enhancement",
    "introduced",
    "Landscape interfaces",
    ["beta5SlashGear"],
    {
      documentedStatus: "undocumented",
      locator: "landscape trash icon",
    },
  ),
  record(
    "sms-send-sound",
    "The outgoing SMS sound returned",
    "The fifth seed restored audible feedback after sending a text message.",
    "bugFix",
    "fixed",
    "Messages",
    ["beta5SlashGear"],
    {
      documentedStatus: "undocumented",
      locator: "SMS send-sound observation",
    },
  ),
];

const gmChanges = [
  record(
    "store-video-downloads",
    "The on-device store added video downloads",
    "The final developer seed exposed direct downloads for movies, television episodes, and music videos.",
    "feature",
    "introduced",
    "iTunes Store",
    ["gmEngadget", "gmAppleInsider", "gmMacworld"],
    {
      documentedStatus: "partiallyDocumented",
      evidenceState: "corroborated",
      locator: "on-device media purchases",
    },
  ),
  record(
    "itunes-navigation",
    "The iTunes Store rearranged its bottom navigation",
    "The on-device store changed the placement of its primary navigation controls.",
    "behavior",
    "changed",
    "iTunes Store",
    ["gmEngadget"],
    {
      documentedStatus: "undocumented",
      locator: "store navigation observation",
    },
  ),
  record(
    "app-store-more-menu",
    "The App Store grouped Top 25 and Redeem under More",
    "The final seed consolidated two store destinations inside a secondary navigation menu.",
    "behavior",
    "changed",
    "App Store",
    ["gmEngadget"],
    {
      documentedStatus: "undocumented",
      locator: "App Store navigation observation",
    },
  ),
  record(
    "att-mms-unavailable",
    "Carrier-gated MMS availability",
    "MMS capability could remain unusable until a carrier enabled supporting service and settings.",
    "compatibility",
    "knownIssue",
    "Messages",
    ["gmEngadget", "gmMacworld", "gmAppleInsider"],
    {
      documentedStatus: "partiallyDocumented",
      evidenceState: "corroborated",
      locator: "AT&T MMS availability",
      stableKey: "mms-carrier-availability",
      inheritance: "cumulative",
      occurrenceSummary:
        "At GM, the operating-system capability was present but AT&T customers still awaited carrier enablement; this continues the earlier availability boundary.",
    },
  ),
  record(
    "device-test-lock",
    "Prerelease device downgrade restriction",
    "Devices upgraded to the prerelease seed could not return to an earlier operating-system version.",
    "compatibility",
    "knownIssue",
    "Device installation",
    ["gmIclarified"],
    {
      locator: "preserved Apple installation warning",
      stableKey: "device-test-lock",
      inheritance: "cumulative",
      occurrenceSummary:
        "The GM warning retained the same no-downgrade state documented for Beta 4, so the occurrence is cumulative.",
    },
  ),
  record(
    "compatibility-ratings",
    "Developers were directed to verify compatibility and ratings",
    "The launch-period guidance asked developers to test applications and provide the new content-rating information.",
    "compatibility",
    "changed",
    "App Store submission",
    ["gmAppleInsider"],
    {
      documentedStatus: "partiallyDocumented",
      locator: "developer compatibility guidance",
    },
  ),
];

const eventSpecs = [
  {
    alias: "beta-1",
    label: "Beta 1",
    date: "2009-03-17",
    sequence: 1,
    channel: "developerBeta",
    changes: beta1Changes,
    sourceKeys: ["beta1Apple"],
    method:
      "This is the first retained feature and API baseline. It does not assert that every listed capability first appeared in the downloadable bits on that day; it records the scope Apple publicly attached to the opening developer seed.",
  },
  {
    alias: "beta-2",
    label: "Beta 2",
    date: "2009-03-31",
    sequence: 2,
    channel: "developerBeta",
    changes: beta2Changes,
    sourceKeys: ["beta2AppleInsider", "beta2Ilounge", "beta2World"],
    method:
      "The selection combines a documented developer-service transition with independently reported interface and performance observations. Each item keeps its documentation and evidence state instead of treating observation as an official note.",
  },
  {
    alias: "beta-3",
    label: "Beta 3",
    date: "2009-04-14",
    sequence: 3,
    channel: "developerBeta",
    changes: beta3Changes,
    sourceKeys: [
      "beta3AppleInsider",
      "beta3Ars",
      "beta3MacRumors",
      "beta3World",
    ],
    method:
      "Thirteen relevant toolchain entries come from a retained Apple-authored SDK seed-note transcription and form a Beta 3 baseline rather than a claim of first appearance. Two compilers that explicitly require the Mac OS X SDK and the macOS-only Carbon-controls item are excluded. Four additional user-visible observations remain explicitly undocumented.",
  },
  {
    alias: "beta-4",
    label: "Beta 4",
    date: "2009-04-28",
    sequence: 4,
    channel: "developerBeta",
    changes: beta4Changes,
    sourceKeys: [
      "beta4Advisory",
      "beta4Ars",
      "beta4Iclarified",
      "beta4MacRumors",
    ],
    method:
      "Nine records preserve the operational boundaries in Apple's two-page installation advisory. Six narrower tool and interface observations are synthesized from contemporaneous reporting and retain weaker documentation labels.",
  },
  {
    alias: "beta-5",
    label: "Beta 5",
    date: "2009-05-06",
    sequence: 5,
    channel: "developerBeta",
    changes: beta5Changes,
    sourceKeys: [
      "beta5Compat",
      "beta5Engadget",
      "beta5Gizmodo",
      "beta5Groups",
      "beta5MacRumors",
      "beta5SlashGear",
    ],
    method:
      "The compatibility policy is preserved in an Apple-authored message and contemporary coverage. Interface observations remain labeled undocumented, and the reported StoreKit revision is deliberately limited because no member-level note survived this research pass.",
  },
  {
    alias: "gm",
    label: "GM",
    date: "2009-06-08",
    sequence: 6,
    channel: "goldenMaster",
    changes: gmChanges,
    sourceKeys: ["gmAppleInsider", "gmEngadget", "gmIclarified", "gmMacworld"],
    method:
      "This route indexes the defensible final developer milestone and only the retained GM-specific state. It does not copy the later public release notes or infer an unpublished build identity.",
  },
];

const sourceByKey = new Map(Object.entries(U).map(([key, url]) => [key, url]));
const citationFor = (sourceKey, locator) =>
  c(
    sourceByKey.get(sourceKey),
    locator,
    "The factual result is rewritten as original synthesis; the cited artifact retains the historical evidence.",
  );

const changesFor = (spec) =>
  spec.changes.map((item) => ({
    key: item.stableKey
      ? `iphone-os-3-0-${item.stableKey}`
      : `iphone-os-3-0-${spec.alias.replaceAll("-", "")}-${item.id}`,
    title: item.title,
    canonicalSummary: item.canonicalSummary,
    category: item.category,
    action: item.action,
    inheritance: item.inheritance,
    summary:
      item.occurrenceSummary ||
      (spec.alias === "beta-1"
        ? `Apple's opening preview places this ${item.component} capability in the first retained iPhone OS 3.0 developer baseline.`
        : `${spec.label} evidence places this ${item.component} state in the milestone while preserving its documentation boundary.`),
    documentedStatus: item.documentedStatus,
    evidenceState: item.evidenceState,
    verificationMethod:
      item.verification ||
      (item.evidenceState === "corroborated"
        ? `Matched the ${item.component} claim across the listed retained sources and reduced it to a narrow historical record.`
        : item.evidenceState === "confirmed"
          ? `Matched the ${item.component} claim to the retained first-party Apple artifact and kept only an original summary plus locator.`
          : `Matched the ${item.component} claim to the retained artifact; no stronger evidence state is inferred.`),
    citations: item.sourceKeys.map((key) =>
      citationFor(key, `${spec.label}; ${item.locator}`),
    ),
  }));

const eventArticle = (spec, changes) => {
  const identityCitations = spec.sourceKeys.map((key) =>
    citationFor(key, `${spec.label} identity and timing`),
  );
  return article(
    heading("Release milestone"),
    prose(
      `${spec.label} appeared on ${spec.date}. Contemporaneous sources support that route identity, while each indexed item below keeps its own evidence and documentation state.`,
      identityCitations,
    ),
    heading(`What ${spec.label} documents`),
    prose(
      `This archive page contains ${changes.length} narrowly attributed historical records. All titles, summaries, and explanatory prose are original synthesis, with source locators retained for verification.`,
      uniqueCitations(changes.flatMap((change) => change.citations)),
    ),
    heading("Selection boundary"),
    prose(spec.method, identityCitations),
    heading("Archive limitations"),
    prose(
      "This archive does not reproduce publisher articles or confidential developer material. Unsupported build numbers, speculative features, long excerpts, and the separately owned Public route are excluded.",
      identityCitations,
    ),
  );
};

const events = eventSpecs.map((spec) => {
  const changes = changesFor(spec);
  return {
    target: {
      releaseVersionId: "version-ios-3-0",
      routeAlias: spec.alias,
    },
    identity: {
      releaseVersionId: "version-ios-3-0",
      platformId: "platform-ios",
      stableEventId: `event:apple:ios:3.0:${spec.alias}`,
      label: spec.label,
      routeAlias: spec.alias,
      channel: spec.channel,
      appearanceDate: spec.date,
      sequence: spec.sequence,
      isRevision: false,
      availabilityState: "available",
      closesReleaseCycle: false,
    },
    authorship: "originalSynthesis",
    summary: `${spec.label} is a sourced historical archive page with ${changes.length} structured records and explicit documentation and evidence labels.`,
    article: eventArticle(spec, changes),
    citations: uniqueCitations([
      ...spec.sourceKeys.map((key) =>
        citationFor(key, `${spec.label} milestone evidence`),
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
    platform: "iOS",
    majorVersion: 3,
    version: "3.0",
    releaseStatus: "released",
    publicReleaseDate: "2009-06-17",
    milestones: [["Public", "2009-06-17", false, undefined]],
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
  .filter((version) => version.platform === "iOS" && version.version === "3.0")
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
  }));
if (
  JSON.stringify(stableValue(seedInventory)) !==
  JSON.stringify(stableValue(expectedSeedInventory))
) {
  throw new Error(
    "The exact local iOS 3.0 seed inventory changed; re-audit before regenerating.",
  );
}

const expectedCounts = new Map([
  ["beta-1", 18],
  ["beta-2", 7],
  ["beta-3", 18],
  ["beta-4", 15],
  ["beta-5", 12],
  ["gm", 6],
]);
const expectedDates = new Map(
  eventSpecs.map((spec) => [spec.alias, spec.date]),
);
const expectedRoutes = new Set(
  [...expectedCounts.keys()].map((alias) => `version-ios-3-0/${alias}`),
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
  events.length !== expectedCounts.size ||
  changeCount !== 76 ||
  new Set(actualRoutes).size !== expectedRoutes.size ||
  actualRoutes.some((route) => !expectedRoutes.has(route)) ||
  events.some(
    (event) =>
      Object.keys(event.target).sort().join(",") !==
        "releaseVersionId,routeAlias" ||
      event.identity.releaseVersionId !== event.target.releaseVersionId ||
      event.identity.routeAlias !== event.target.routeAlias ||
      event.identity.appearanceDate !==
        expectedDates.get(event.target.routeAlias) ||
      event.identity.platformId !== "platform-ios" ||
      event.identity.stableEventId !==
        `event:apple:ios:3.0:${event.target.routeAlias}` ||
      event.authorship !== "originalSynthesis" ||
      event.provenanceStatus !== "editoriallyVerified" ||
      event.editorialReview.status !== "approved" ||
      event.editorialReview.reviewedAt !== reviewedAt ||
      event.isIndexable !== true ||
      event.changes.length !== expectedCounts.get(event.target.routeAlias) ||
      event.changes.some(
        (item) =>
          !["delta", "cumulative"].includes(item.inheritance) ||
          !["documented", "partiallyDocumented", "undocumented"].includes(
            item.documentedStatus,
          ) ||
          !["reported", "corroborated", "confirmed"].includes(
            item.evidenceState,
          ) ||
          /build-identity|community-observation|seed-identity/i.test(item.key),
      ),
  )
) {
  throw new Error("The expected iOS 3 prerelease bundle closure failed.");
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
      `iOS 3 prerelease change definition drifted for ${occurrence.key}.`,
    );
  }
  localChangeDefinitions.set(occurrence.key, definition);
}
const uniqueLocalChangeKeys = [...localChangeDefinitions.keys()];
if (uniqueLocalChangeKeys.length !== 71) {
  throw new Error(
    `Expected 71 stable iOS 3 prerelease definitions; found ${uniqueLocalChangeKeys.length}.`,
  );
}

const cumulativeOccurrences = events
  .flatMap((event) =>
    event.changes.map((change) => ({
      routeAlias: event.identity.routeAlias,
      change,
    })),
  )
  .filter(({ change }) => change.inheritance === "cumulative")
  .map(({ routeAlias, change }) => `${routeAlias}:${change.key}`)
  .sort();
const expectedCumulativeOccurrences = [
  "beta-3:iphone-os-3-0-beta3-dashcode-iphone-web-apps",
  "beta-3:iphone-os-3-0-beta3-ib-diff-friendly-xib",
  "beta-3:iphone-os-3-0-beta3-ib-drag-reparent",
  "beta-3:iphone-os-3-0-beta3-ib-outline-reorder",
  "beta-3:iphone-os-3-0-beta3-ib-string-localization",
  "beta-3:iphone-os-3-0-beta3-xcode-active-sdk-override",
  "beta-3:iphone-os-3-0-beta3-xcode-assistants-templates",
  "beta-3:iphone-os-3-0-beta3-xcode-build-setting-shortcuts",
  "beta-3:iphone-os-3-0-beta3-xcode-conditional-settings",
  "beta-3:iphone-os-3-0-beta3-xcode-edit-scope",
  "beta-3:iphone-os-3-0-beta3-xcode-overview-toolbar",
  "beta-3:iphone-os-3-0-beta3-xcode-target-libraries",
  "beta-3:iphone-os-3-0-beta3-xcode-weak-linking",
  "beta-4:iphone-os-3-0-beta4-commerce-push-development",
  "beta-5:iphone-os-3-0-itunes-82-prerequisite",
  "beta-5:iphone-os-3-0-tethering-availability",
  "gm:iphone-os-3-0-device-test-lock",
  "gm:iphone-os-3-0-mms-carrier-availability",
].sort();
if (
  JSON.stringify(cumulativeOccurrences) !==
  JSON.stringify(expectedCumulativeOccurrences)
) {
  throw new Error("The reviewed cumulative-state allowlist changed.");
}

const histories = new Map();
for (const event of events) {
  for (const change of event.changes) {
    histories.set(change.key, [
      ...(histories.get(change.key) || []),
      `${event.identity.routeAlias}:${change.action}:${change.inheritance}`,
    ]);
  }
}
const repeatedHistories = [...histories.entries()].filter(
  ([, history]) => history.length > 1,
);
const expectedTransitionHistories = new Map([
  [
    "iphone-os-3-0-store-settings-panel",
    ["beta-2:knownIssue:delta", "beta-4:fixed:delta"],
  ],
  [
    "iphone-os-3-0-itunes-82-prerequisite",
    ["beta-4:changed:delta", "beta-5:changed:cumulative"],
  ],
  [
    "iphone-os-3-0-mms-carrier-availability",
    ["beta-2:knownIssue:delta", "gm:knownIssue:cumulative"],
  ],
  [
    "iphone-os-3-0-device-test-lock",
    ["beta-4:knownIssue:delta", "gm:knownIssue:cumulative"],
  ],
  [
    "iphone-os-3-0-tethering-availability",
    ["beta-2:knownIssue:delta", "beta-5:changed:cumulative"],
  ],
]);
if (
  repeatedHistories.length !== expectedTransitionHistories.size ||
  repeatedHistories.some(
    ([key, history]) =>
      JSON.stringify(history) !==
      JSON.stringify(expectedTransitionHistories.get(key)),
  )
) {
  throw new Error("The reviewed iOS 3 transition inventory changed.");
}

if (
  events
    .flatMap((event) => event.changes)
    .some((change) =>
      /carbon|xcode-(?:llvm-gcc|gcc-42)/i.test(`${change.key} ${change.title}`),
    )
) {
  throw new Error("Host-only macOS tooling entered the iOS 3 archive.");
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
      if (!otherChangeKeys.has(item.key)) otherChangeKeys.set(item.key, file);
    }
  }
}
const collisions = uniqueLocalChangeKeys.filter((key) =>
  otherChangeKeys.has(key),
);
if (collisions.length > 0) {
  throw new Error(
    `iOS 3 prerelease change keys collide with existing content: ${collisions
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
const sourceLedger = sources
  .map(
    (source) =>
      `- [${source.title}](${source.url}) - ${source.publisher}; ${source.sourceClass}.`,
  )
  .join("\n");
const routeRows = eventSpecs
  .map(
    (spec) =>
      `| iOS | ${spec.label} | \`${spec.alias}\` | ${spec.date} | ${spec.changes.length} |`,
  )
  .join("\n");
const routeVerificationRows = eventSpecs
  .map(
    (spec) =>
      `| \`/apple/ios/3.0/${spec.alias}/\` | 200 | 4/4 | ${spec.changes.length}/${spec.changes.length} | yes | yes | no | index, follow |`,
  )
  .join("\n");

const rawLedger = [
  [
    "Beta 1",
    "Apple Newsroom HTML",
    128_423,
    "223b0e2b4ec426ce7f1180bd8e67f5518fc00502aff1f7372b431eff275beb8a",
  ],
  [
    "Beta 2",
    "AppleInsider HTML",
    132_421,
    "06ffccb346b84ac1777712d899032be7ff8d4031354311c374a959e596d1d005",
  ],
  [
    "Beta 2",
    "iLounge archived HTML",
    44_115,
    "b4a6dd355f54fe96b4d349e14ac4bcd74375fcc0f46bf82adb6383f2e01f7824",
  ],
  [
    "Beta 2",
    "World of Apple archived HTML",
    23_498,
    "64d69a932a8473384cc402d0d70eaa584d23d73f95bbf9316d444e3380183721",
  ],
  [
    "Beta 3",
    "AppleInsider HTML",
    130_728,
    "9b81f8a1b71bb70704bdcc85b0286ab5e8d4ae0284c87d2a50973528a7472b96",
  ],
  [
    "Beta 3",
    "Ars Technica HTML",
    138_757,
    "d05cdd01b6a4305c186ec9d5f3c5038d47bdf79c5c05f35f2444d8c0cab7f2bf",
  ],
  [
    "Beta 3",
    "MacRumors HTML",
    112_892,
    "5129656eee21ae6033df367ac58560b5c217831ff8f51341e5736f29af778807",
  ],
  [
    "Beta 3",
    "World of Apple archived HTML",
    32_219,
    "0d5dd0cfa0a60a3f091aa20cfbf75a9ada9a96d0072002f77249682e3bf6b537",
  ],
  [
    "Beta 4",
    "Apple advisory PDF",
    49_405,
    "1900ed272a1888ee6faf6a48a1ce507d5b108584814df17582f55a4988d6026f",
  ],
  [
    "Beta 4",
    "Ars Technica HTML",
    140_285,
    "9771cd26140a03b340a1b6dab55bceef725f0dfff0bfd6ca98793f81d82577bd",
  ],
  [
    "Beta 4",
    "iClarified HTML",
    179_832,
    "caa0c0eddc7dcb6ad7e443100789a619ce4233578e0e49d12387b2ec6da1de0a",
  ],
  [
    "Beta 4",
    "MacRumors HTML",
    114_598,
    "35725ef5a340776222e857eb46648bb06c0630c12dc91b248b26679521d5c978",
  ],
  [
    "Beta 5",
    "MacRumors compatibility HTML",
    111_510,
    "3a8ea71ec6d8bb40bfc6b62f013b959e6eeebea36914f1625be8f761395e9c95",
  ],
  [
    "Beta 5",
    "Gizmodo HTML",
    211_768,
    "4fbd760e7d9e8bf9832f5e81871eb934778d5a6afdbe2e16b569f382654a65b0",
  ],
  [
    "Beta 5",
    "Google Groups archive HTML",
    1_018_438,
    "b62cb932eb019fa9b7c862a9a3b6111442b607788ab0b9d83a27302a4bdae31a",
  ],
  [
    "Beta 5",
    "MacRumors HTML",
    112_495,
    "add117b9fbee8425846d3c2c9796cdab95272f27d38ca8cd7c43ea8015c51b80",
  ],
  [
    "Beta 5",
    "SlashGear HTML",
    51_061,
    "0a6c21153e7eb9204cb188a87add6010960305fe9706b4c2aeb948cc3ed4fd31",
  ],
  [
    "Beta 5",
    "Engadget HTML",
    57_779,
    "d6871d0bb3d78252d9e1a7f3aa5fef50a8ed93e7ac7c15218f90b581f6f57d6d",
  ],
  [
    "GM",
    "AppleInsider HTML",
    139_020,
    "7b508d0b66cf0d559f60063c8c205b4e5f619c44d437700ea8ef626a4c5e1eb5",
  ],
  [
    "GM",
    "Engadget HTML",
    59_332,
    "297c00016afe87ba4ecddb111f775d2a211683ce226f41c9d7427d162615ffec",
  ],
  [
    "GM",
    "iClarified HTML",
    178_778,
    "926a00c814b36fe4bf84f55ce3ba2120d3434cb7df4b32157ecf3bf929e8ce59",
  ],
  [
    "GM",
    "Macworld HTML",
    201_449,
    "40808dc8efff90c6bc44f2c75a0d69f5e4b3a0ffd651ffd8abcf468edcd26672",
  ],
]
  .map(
    ([milestone, artifact, bytes, sha]) =>
      `| ${milestone} | ${artifact} | ${Number(bytes).toLocaleString("en-US")} | \`${sha}\` |`,
  )
  .join("\n");

const md = `# Apple iPhone OS 3.0 prerelease archive batch

## Result

\`${outputName}\` is the approved archive batch for six historically defensible
iPhone OS 3.0 prerelease routes that were absent from the local seed.

- ${events.length} identity-backed event pages and no release-version overlays
- ${changeCount} milestone-specific occurrences across
  ${uniqueLocalChangeKeys.length} stable, collision-checked definitions
- ${sources.length} declared and used sources with ${citationCount} citation references
- zero builds, build-number claims, or Public-route changes
- every route is \`editoriallyVerified\`, \`approved\`, and explicitly
  \`isIndexable: true\`

## Approved route closure

| Platform | Milestone | New alias | Appearance date | Selected changes |
| --- | --- | --- | --- | ---: |
${routeRows}

The local seed contains only Public on 2009-06-17. Public is already owned by
\`apple-ios-3.json\` and remains untouched.

## Evidence method

1. Apple's March 17 announcement establishes Beta 1 and provides a first-party
   feature and developer-API baseline. The 18 selected records are a
   first-document baseline, not a blanket claim that every capability first
   appeared in that day's binary.
2. Three contemporaneous reports establish Beta 2 and retain six narrow
   service, interface, performance, and availability records. Observations are
   labeled separately from documented developer-service facts.
3. Four contemporaneous artifacts establish Beta 3. A World of Apple archive
   retains an Apple-authored SDK summary with exactly 10 Xcode, five Interface
   Builder, and one Dashcode entry. The selected baseline excludes two
   compilers whose notes explicitly require the Mac OS X SDK and a macOS-only
   Carbon-controls item. Four observed behaviors remain explicitly
   undocumented.
4. Apple's two-page Beta 4 installation advisory survives through a third-party
   PDF mirror. Nine operational records are confirmed from that document, and
   six tool or interface observations are kept with weaker labels.
5. Beta 5 combines a preserved Apple developer-compatibility message with
   contemporaneous reporting. The StoreKit entry is intentionally high level:
   the report says the API changed, but its member-level delta did not survive.
6. Four contemporaneous reports establish GM and retain six specific final-seed
   states. The later Public notes are not copied into this milestone.

## Raw evidence ledger

| Milestone | Public artifact | Raw bytes | Raw SHA-256 |
| --- | --- | ---: | --- |
${rawLedger}

The ${verification.rawArtifacts} selected raw artifacts total
${verification.rawEvidenceBytes.toLocaleString("en-US")} bytes. The committed
audit helper also locks ${verification.normalizedArtifacts} bounded text
artifacts, including both PDF pages, and verifies short metadata and subject
probes. Raw publisher files remain only in the ignored temporary evidence
directory.

An independent live re-fetch reached all
${verification.independentSourcesFetched} declared sources. It reproduced
${verification.independentRawExact} raw artifacts byte-for-byte and all
${verification.independentNormalizedExact} selected HTML evidence boundaries;
the PDF reproduced byte-for-byte, so all
${verification.independentEvidenceReproduced} source boundaries were
independently reproduced.

## Exact evidence gaps and exclusions

- No defensible build-number documents are created. Build strings present in
  publisher reporting are not promoted to archive identities.
- No complete first-party developer release-note set was found for Beta 2,
  Beta 3, Beta 5, or GM. Documentation state reflects that limit.
- Beta 3's 13 selected toolchain entries are a retained seed-note baseline;
  this batch does not infer that every item first appeared in Beta 3. The two
  Mac OS X SDK-only compilers and the Carbon-controls item remain outside the
  iPhone OS archive.
- Beta 4's advisory is Apple-authored but hosted by a third-party mirror. Its
  raw and extracted-page hashes are locked in the evidence audit.
- Beta 5's StoreKit report does not retain the detailed API delta. The record
  says only that a revision occurred and leaves member-level specifics as an
  explicit gap.
- Public remains owned by the existing iOS 3 public batch.

## Copyright and attribution controls

- All reader-facing article, title, summary, and canonical-summary text is
  original synthesis.
- Every factual record carries source citations and a short locator.
- Apple-authored material on third-party hosts is credited as such; the host is
  named in the source ledger.
- No article, transcript, PDF, screenshot, source HTML, or long excerpt is
  committed.
- Publisher commentary and unsupported inference are excluded.

## Source ledger

All declared sources were accessed on ${accessedAt}.

${sourceLedger}

## Closure guards

- Exact comparison against the local iOS 3.0 seed record and its sole Public
  milestone
- Exact six-route identity, date, channel, and change-count allowlist
- Zero versions, zero builds, exact approval timestamps, and explicit true
  indexability
- Collision scan across every other research-batch JSON plus
  \`apple-launch-content-2026.json\`
- ${changeCount} occurrences resolve to exactly
  ${uniqueLocalChangeKeys.length} stable local definitions
- ${repeatedHistories.length} repeated cross-milestone histories and the exact
  cumulative-context inventory are locked
- Complete unique source declaration/use closure
- Deterministic formatted JSON SHA-256: \`${jsonSha}\`

## Editorial approval and validation record

- provenance: \`editoriallyVerified\`
- editorial status: \`approved\`
- indexability: \`true\`
- reviewed at: \`${reviewedAt}\`
- independent substantive review: clean after platform-scope,
  cumulative-context, claim-boundary, and stable-history corrections

Verified on ${accessedAt}:

- evidence audit: ${verification.rawArtifacts} exact raw artifacts totaling
  ${verification.rawEvidenceBytes.toLocaleString("en-US")} bytes and
  ${verification.normalizedArtifacts} normalized text locks
- independent live re-fetch: all
  ${verification.independentSourcesFetched} sources available and all
  ${verification.independentEvidenceReproduced} selected evidence boundaries
  reproduced
- \`npm run research:validate\`:
  ${verification.researchBatches} batches and
  ${verification.globalChangeKeys.toLocaleString("en-US")} globally consistent
  change keys
- focused ingestion/manifest suite:
  ${verification.focusedTests} of ${verification.focusedTests} passed
- full repository suite:
  ${verification.fullTests} of ${verification.fullTests} passed
- independent copyright-similarity scan: maximum contiguous reader-facing
  overlap of ${verification.maximumEditorialOverlapWords} words
- ESLint, Prettier check, deterministic regeneration, and
  \`git diff --check\`: passed

## Production dry plan

- Status: Applied and zero-residual verified on ${accessedAt}
- ${dryRun.creates} creates:
  ${dryRun.sourceCreates} sources,
  ${dryRun.eventCreates} events, and
  ${dryRun.changeCreates} stable change documents
- ${dryRun.patches} patches; no existing release, event, build, source, or
  change document was mutated
- ${dryRun.unchanged.toLocaleString("en-US")} production documents remained
  unchanged
- The existing Apple Newsroom Beta 1 source was reused unchanged
- Mutation payload:
  ${dryRun.mutationPayloadBytes.toLocaleString("en-US")} bytes
- Plan SHA: \`${dryRun.planSha}\`
- Plan artifact SHA-256: \`${dryRun.planArtifactSha}\`
- Rollback artifact SHA-256: \`${dryRun.rollbackArtifactSha}\`

Three consecutive production dry runs reproduced the same plan SHA, counts,
payload size, plan artifact, and rollback artifact.

## Publication receipt

- Sanity transaction: \`${publicationRecord.transactionId}\`
- applied plan SHA: \`${dryRun.planSha}\`
- receipt SHA-256: \`${publicationRecord.receiptSha}\`
- immediate post-publication zero plan:
  \`${publicationRecord.zeroPlanSha}\`;
  ${publicationRecord.zeroCreates} creates,
  ${publicationRecord.zeroPatches} patches,
  ${publicationRecord.zeroUnchanged.toLocaleString("en-US")} unchanged
  documents, and a ${publicationRecord.zeroPayloadBytes}-byte mutation payload
- zero-plan artifact SHA-256:
  \`${publicationRecord.zeroPlanArtifactSha}\`
- zero-plan rollback artifact SHA-256:
  \`${publicationRecord.zeroRollbackArtifactSha}\`

## Production coverage after publication

- ${publicationRecord.coverage.fullVersions} of
  ${publicationRecord.coverage.totalVersions} release versions have full
  version-level coverage
- ${publicationRecord.coverage.totalAppearances.toLocaleString("en-US")}
  appearances:
  ${publicationRecord.coverage.fullAppearances} full articles,
  ${publicationRecord.coverage.sourceLinkedAppearances} source-linked records,
  and
  ${publicationRecord.coverage.timelineOnlyAppearances.toLocaleString("en-US")}
  timeline-only records
- ${publicationRecord.coverage.approvedStructuredAppearances} appearances have
  approved structured changes

## Settled canonical route verification

Every published route was fetched independently from the running local site.
Each returned all four archival article sections, every expected structured
change title, References, its first cited source, and an \`index, follow\`
directive. No route returned placeholder copy or a \`noindex\` directive.

| Canonical route | HTTP | Article sections | Expected changes | References | First source | Placeholder | Robots |
| --- | ---: | ---: | ---: | --- | --- | --- | --- |
${routeVerificationRows}

No deployment was performed; domain and deployment work remains scheduled
separately.

Reproduce the approved batch with:

\`\`\`sh
node scripts/research-batches/build-apple-ios-3-prerelease.mjs
node scripts/research-batches/audit-ios3-prerelease.mjs tmp/ios3-evidence
npm run research:validate
node --import tsx --test tests/launch-content-ingestion.test.ts tests/launch-content-manifest.test.ts
npx eslint scripts/research-batches/build-apple-ios-3-prerelease.mjs scripts/research-batches/audit-ios3-prerelease.mjs
npx prettier --check scripts/research-batches/build-apple-ios-3-prerelease.mjs scripts/research-batches/audit-ios3-prerelease.mjs scripts/research-batches/apple-ios-3-prerelease.json scripts/research-batches/apple-ios-3-prerelease.md
npx sanity exec scripts/ingest-launch-content.ts --with-user-token -- --content scripts/research-batches/apple-ios-3-prerelease.json
\`\`\`
`;

const ledgerPath = join(here, ledgerName);
writeFileSync(
  ledgerPath,
  await prettier.format(md, {
    filepath: ledgerPath,
  }),
);

console.log(
  [
    `wrote ${outputName}`,
    `wrote ${ledgerName}`,
    `events: ${events.length}`,
    `changes: ${changeCount}`,
    `sources: ${sources.length}`,
    `citations: ${citationCount}`,
    `json SHA-256: ${jsonSha}`,
  ].join("\n"),
);
