import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import prettier from "prettier";

const here = dirname(fileURLToPath(import.meta.url));
const outputName = "apple-ios-7-point-prerelease.json";
const ledgerName = "apple-ios-7-point-prerelease.md";
const accessedAt = "2026-07-30";
const reviewedAt = "2026-07-30T13:48:33Z";
const sha256 = (value) => createHash("sha256").update(value).digest("hex");
const verification = {
  researchBatches: 73,
  globalChangeKeys: 4_214,
  focusedTests: 19,
  fullTests: 131,
  rawArtifacts: 20,
  rawEvidenceBytes: 2_903_480,
  normalizedArtifacts: 20,
  copyrightFields: 335,
  maximumEditorialOverlapWords: 4,
  independentSourcesFetched: 17,
  independentRawExact: 11,
  independentNormalizedExact: 16,
  independentTitlesReproduced: 17,
  independentLocatorsReproduced: 17,
  independentEvidenceReproduced: 17,
};

const U = {
  beta1Identity:
    "https://www.macrumors.com/2013/11/18/apple-seeds-first-beta-of-ios-7-1-to-developers/",
  beta1Notes:
    "https://www.ifun.de/ios-7-1-erste-beta-verbessert-ipad-geste-video-50368/",
  beta1Observed:
    "https://9to5mac.com/2013/11/18/apple-releases-ios-7-1-beta-to-developers-now-on-dev-center/",
  beta2Identity:
    "https://www.macrumors.com/2013/12/13/apple-seeds-ios-7-1-beta-2-to-developers/",
  beta2Notes: "https://forums.whirlpool.net.au/archive/2194915",
  beta3Identity:
    "https://www.macrumors.com/2014/01/07/apple-releases-ios-7-1-beta-3-to-developers/",
  beta3Notes:
    "https://www.mactrast.com/2014/01/apple-releases-ios-7-1-beta-3-developers/",
  beta3Observed: "https://www.macrumors.com/2014/01/07/ios71-beta-tidbits/",
  beta4Identity:
    "https://www.macrumors.com/2014/01/20/ios71-beta-4-to-developers/",
  beta4Notes: "https://wccftech.com/ios-7-1-beta-4-changelog/",
  beta4Observed: "https://www.macrumors.com/2014/01/20/ios71-beta4-tidbits/",
  beta5Identity:
    "https://www.macrumors.com/2014/02/04/apple-releases-ios-7-1-beta-5-to-developers/",
  beta5Notes:
    "https://www.yahoo.com/news/ios-7-1-beta-5-now-available-download-180343544.html",
  beta5Corroboration:
    "https://appleinsider.com/articles/14/02/04/apple-seeds-ios-71-beta-5-to-developers-with-new-siri-voices-",
  beta5Observed: "https://www.macrumors.com/2014/02/04/ios7-1-beta5-tidbits/",
  finalDeveloper:
    "https://developer.apple.com/library/archive/releasenotes/General/RN-iOSSDK-7.1/index.html",
  noGm: "https://www.macrumors.com/2014/03/04/ios-7-1-update-imminent/",
};

const sources = [
  {
    url: U.beta1Identity,
    title:
      "Apple Seeds First Betas of iOS 7.1, Apple TV Software to Developers",
    publisher: "MacRumors",
    sourceClass: "journalism",
    author: "Jordan Golson",
    publishedAt: "2013-11-18T10:23:46-08:00",
    topics: ["iOS 7.1", "Beta 1", "release identity"],
  },
  {
    url: U.beta1Notes,
    title: "iOS 7.1: Erste Beta verbessert iPad-Geste",
    publisher: "ifun.de",
    sourceClass: "archive",
    author: "Nicolas",
    publishedAt: "2013-11-18T22:08:45+01:00",
    topics: ["iOS 7.1", "Beta 1", "Apple developer notes", "observed changes"],
  },
  {
    url: U.beta1Observed,
    title:
      "Apple releases iOS 7.1 beta to developers w/ UI tweaks and new Yahoo! logo, speed improvements, more",
    publisher: "9to5Mac",
    sourceClass: "journalism",
    author: "Zac Hall",
    publishedAt: "2013-11-18T18:17:15.000Z",
    topics: ["iOS 7.1", "Beta 1", "observed changes", "Apple developer notes"],
  },
  {
    url: U.beta2Identity,
    title: "Apple Seeds iOS 7.1 Beta 2 to Developers [Updated]",
    publisher: "MacRumors",
    sourceClass: "journalism",
    author: "Juli Clover",
    publishedAt: "2013-12-13T10:16:23-08:00",
    topics: ["iOS 7.1", "Beta 2", "release identity", "observed changes"],
  },
  {
    url: U.beta2Notes,
    title: "iOS 7.1 Beta 2 (11D5115d) Released",
    publisher: "Whirlpool Forums",
    sourceClass: "archive",
    author: "Liski (forum contributor)",
    publishedAt: "2013-12-14T07:55:53+10:00",
    topics: ["iOS 7.1", "Beta 2", "Apple developer notes", "archive"],
  },
  {
    url: U.beta3Identity,
    title: "Apple Releases iOS 7.1 Beta 3 to Developers",
    publisher: "MacRumors",
    sourceClass: "journalism",
    author: "Juli Clover",
    publishedAt: "2014-01-07T10:02:02-08:00",
    topics: ["iOS 7.1", "Beta 3", "release identity", "observed changes"],
  },
  {
    url: U.beta3Notes,
    title: "Apple Releases iOS 7.1 Beta 3 to Developers",
    publisher: "MacTrast",
    sourceClass: "archive",
    author: "Chris Hauk",
    publishedAt: "2014-01-07T18:27:16-08:00",
    topics: ["iOS 7.1", "Beta 3", "Apple developer notes", "archive"],
  },
  {
    url: U.beta3Observed,
    title:
      "iOS 7.1 Beta 3 Tidbits: Revamped Keyboard, Darker Icons, New Phone Look, and More",
    publisher: "MacRumors",
    sourceClass: "journalism",
    author: "Juli Clover",
    publishedAt: "2014-01-07T13:15:13-08:00",
    topics: ["iOS 7.1", "Beta 3", "observed changes"],
  },
  {
    url: U.beta4Identity,
    title: "Apple Releases iOS 7.1 Beta 4 to Developers",
    publisher: "MacRumors",
    sourceClass: "journalism",
    author: "Jordan Golson",
    publishedAt: "2014-01-20T10:04:12-08:00",
    topics: ["iOS 7.1", "Beta 4", "release identity"],
  },
  {
    url: U.beta4Notes,
    title:
      "[Updated with Changelog]: Apple iOS 7.1 Beta 4 Released for iPhone, iPad and iPod Touch to Developers",
    publisher: "Wccftech",
    sourceClass: "archive",
    author: "Rafia Shaikh",
    publishedAt: "2014-01-20T18:45:37.000Z",
    topics: ["iOS 7.1", "Beta 4", "Apple developer notes", "archive"],
  },
  {
    url: U.beta4Observed,
    title:
      "iOS 7.1 Beta 4 Tidbits: New Slide to Unlock/Power Off Animation, Dialer Updates",
    publisher: "MacRumors",
    sourceClass: "journalism",
    author: "Juli Clover",
    publishedAt: "2014-01-20T14:34:36-08:00",
    topics: ["iOS 7.1", "Beta 4", "observed changes"],
  },
  {
    url: U.beta5Identity,
    title:
      "Apple Releases iOS 7.1 Beta 5 to Developers With Siri Language Improvements",
    publisher: "MacRumors",
    sourceClass: "journalism",
    author: "Juli Clover",
    publishedAt: "2014-02-04T10:00:21-08:00",
    topics: ["iOS 7.1", "Beta 5", "release identity", "Siri"],
  },
  {
    url: U.beta5Notes,
    title: "iOS 7.1 beta 5 now available for download",
    publisher: "Yahoo / BGR",
    sourceClass: "archive",
    author: "Zach Epstein",
    publishedAt: "2014-02-04T18:03:43.000Z",
    topics: ["iOS 7.1", "Beta 5", "Apple developer notes", "archive"],
  },
  {
    url: U.beta5Corroboration,
    title: "Apple begins testing new Siri voices in latest iOS 7.1 beta",
    publisher: "AppleInsider",
    sourceClass: "journalism",
    author: "AppleInsider Staff",
    publishedAt: "2014-02-04T18:06:00.000Z",
    topics: ["iOS 7.1", "Beta 5", "Siri", "developer notes"],
  },
  {
    url: U.beta5Observed,
    title:
      "iOS 7.1 Beta 5 Tidbits: Redesigned Shift and Caps Lock, Public Launch Expected Soon",
    publisher: "MacRumors",
    sourceClass: "journalism",
    author: "Juli Clover",
    publishedAt: "2014-02-04T12:25:29-08:00",
    topics: ["iOS 7.1", "Beta 5", "observed changes"],
  },
  {
    url: U.finalDeveloper,
    title: "iOS 7.1 Release Notes",
    publisher: "Apple Developer",
    sourceClass: "developerDocs",
    author: "Apple",
    publishedAt: "2014-03-10T00:00:00.000Z",
    topics: ["iOS 7.1", "final developer notes", "cumulative evidence"],
  },
  {
    url: U.noGm,
    title: "iOS 7.1 Update Due 'Any Day Now' With Support for SXSW App",
    publisher: "MacRumors",
    sourceClass: "journalism",
    author: "Juli Clover",
    publishedAt: "2014-03-04T10:59:43-08:00",
    topics: ["iOS 7.1", "Beta 5", "GM gap", "release boundary"],
  },
];

const exactAnchorByLocator = new Map(
  Object.entries({
    "Beta 1 identity and timing": "first beta of iOS 7.1",
    "Beta 1 evidence boundary": "first beta of iOS 7.1",
    "Beta 2 identity and timing": "second beta of iOS 7.1",
    "Beta 2 evidence boundary": "second beta of iOS 7.1",
    "Beta 3 identity and timing": "third beta of iOS 7.1",
    "Beta 3 evidence boundary": "third beta of iOS 7.1",
    "Beta 4 identity and timing": "fourth beta of iOS 7.1",
    "Beta 4 evidence boundary": "fourth beta of iOS 7.1",
    "Beta 5 identity and timing": "fifth beta of iOS 7.1",
    "Five-beta cycle and absent developer GM":
      "yet to seed a Golden Master build to developers",
    "Bluetooth — 32-bit application attachment":
      "32-bit apps running on a 64-bit device cannot attach to BTServer",
    "Release notes — Bluetooth known issue":
      "32-bit apps running on a 64-bit device cannot attach to BTServer",
    "Bluetooth known issue — 32-bit application attachment":
      "32-bit apps running on a 64-bit device cannot attach to BTServer",
    "Bluetooth known issue — BTServer":
      "32-bit apps running on a 64-bit device cannot attach to BTServer",
    "Bluetooth issue on 64-bit hardware":
      "Bluetooth remains an issue for 32-bit apps running on 64-bit devices",
    "CFNetwork fixed — empty server response":
      "request will result in an error instead of a successful load",
    "Release notes — empty HTTP response":
      "request will result in an error instead of a successful load",
    "CFNetwork note — gzip content length":
      "Content-Length value exactly matches the expanded gzip’d content",
    "Release notes — compressed response compatibility":
      "Content-Length value exactly matches the expanded gzip’d content",
    "Core Text fixed — paragraph spacing":
      "did not correctly place lines to account for the paragraphSpacing attribute",
    "Release notes — Core Text frame drawing":
      "did not correctly place lines to account for the paragraphSpacing attribute",
    "Crash Logs — missing from Diagnostics settings":
      "Crash logs will not appear in Diagnostics & Usage Data in Settings",
    "Release notes — crash-log visibility":
      "Crash logs will not appear in Diagnostics & Usage Data in Settings",
    "Crash Logs fixed — Diagnostics visibility":
      "Crash logs now appear in Diagnostics & Usage Data in Settings",
    "GLKit fixed — alpha texture loading":
      "pngcrush images that have alpha were not unpremultiplied",
    "Release notes — GLKTextureLoader alpha":
      "pngcrush images that have alpha were not unpremultiplied",
    "High Precision Timers — fixed delay":
      "timers were delayed by up to 1 millisecond",
    "Release notes — precision timer delay":
      "timers were delayed by up to 1 millisecond",
    "iTunes — large library loading":
      "may take much longer than expected, especially on larger libraries",
    "Release notes — iTunes Match loading delay":
      "may take much longer than expected, especially on larger libraries",
    "iTunes fixed — large Match library":
      "should no longer take an especially long time to load",
    "Multipeer Connectivity — session initializer":
      "MCSessioninitWithPeer: method has now been implemented properly",
    "Release notes — Multipeer Connectivity initializer":
      "MCSessioninitWithPeer: method has now been implemented properly",
    "Release notes — baseline-aligned UIKit controls":
      "baseline aligned with constraints has attributes that change",
    "UIKit known issue — baseline-aligned controls":
      "baseline aligned with constraints has attributes that change",
    "UIKit known issue — baseline alignment":
      "baseline aligned with constraints has attributes that change",
    "Release notes — back-indicator transition mask":
      "will not be interpreted correctly at runtime",
    "UIKit known issue — back-indicator transition mask":
      "will not be interpreted correctly at runtime",
    "UIKit known issue — back-indicator mask image":
      "will not be interpreted correctly at runtime",
    "UIKit known issue — transition mask image":
      "will not be interpreted correctly at runtime",
    "UIKit known issue — bordered bar-button image":
      "Bar button background images are ignored in apps built and deployed to iOS 7.1",
    "iCloud known issue — Keychain during setup":
      "encounter an error when trying to enable iCloud Keychain",
    "iCloud fixed — Keychain during account setup":
      "should no longer give you an error when you enable iCloud Keychain",
    "Music App known issue — audiobooks": "Audiobooks fail to play",
    "Music App fixed — audiobook playback": "Audiobooks now play as expected",
    "Messages known issue — immediate send failure":
      "indicates iMessage send failure immediately after sending",
    "Messages fixed — immediate send failure":
      "no longer indicates a send failure immediately after sending",
    "Safari note — minimal-ui viewport property":
      "minimal-ui, has been added for the viewport meta tag key",
    "Safari note — minimal-ui":
      "minimal-ui, has been added for the viewport meta tag key",
    "Safari minimal-ui behavior":
      "new beta brings a minimal-ui property for Safari",
    "Observed — iPad closing-gesture transition":
      "weicheren Übergang zur Icon-Ansicht des Homescreens",
    "Observed — iPad pinch-to-close animation":
      "tweaked closing animation in the pinch-to-close gesture",
    "Observed — dark keyboard accessibility control":
      "Bedienungshilfen erlauben zudem das Setzen einer dunklen Tastatur",
    "Observed — Dark Keyboard accessibility option":
      "new toggle for ‘dark keyboard’ in the accessibility settings",
    "Observed — burst photographs in Photo Stream":
      "Foto-Reihenaufnahmen können im Fotostream nun direkt",
    "Observed — burst-mode Photo Stream option":
      "option to upload ‘burst mode photos’ to Photo Stream",
    "Observed — Bold Text activation":
      "Toggling ‘bold text’ no longer requires restarting your device",
    "Observed — automatic HDR and flash state":
      "new ‘auto HDR mode’ appears in the beta as well as flash indicators",
    "Observed — Notification Center clear action":
      "new dialog when cleared and a tweaked button for clearing items",
    "Observed — Yahoo logo surfaces":
      "new Yahoo! logo that appeared in Settings in iOS 7.0.4",
    "Observed — Flickr flatter logo":
      "Flickr now features a gradient-less logo throughout the system",
    "Observed — tone-selection correction":
      "caused all tones to sound like the default",
    "Observed — Touch ID and Passcode location":
      "moved from General settings to the main settings menu",
    "Observed — Calendar list-view toggle":
      "Calendar has a new list view toggle",
    "Observed — Dark Keyboard option removed":
      "dark keyboard option appears to have been removed",
    "Observed — Button Shapes accessibility setting":
      "new “Button Shapes” option that can be turned on",
    "Observed — faster interface animation":
      "Animations appear to be faster in iOS 7.1 beta 2",
    "Observed — Control Center bounce and audio labels":
      "new bounce animation and music labels that show the audio source",
    "Observed update — Car Display restriction and references":
      "Car Display” toggle in the Restrictions Settings panel, along with additional iOS in the Car references",
    "Observed update — keyboard and Delete key": "new look for the delete key",
    "Keyboard — contrast, labels, Shift, and Delete":
      "slight boldness to the font and a new design to the delete and shift keys",
    "Observed update — Phone dialer and incoming call":
      "round “call” and “end” buttons rather than large rectangular ones",
    "Phone — circular call controls":
      "replaced with a black background and two round Accept and Decline icons",
    "Observed update — green app-icon color":
      "green color of the Phone, FaceTime, Messages app icons has been toned down",
    "Icons — toned-down green treatment":
      "green color in the Phone, Messages, and FaceTime apps has been toned down",
    "Observed update — Reduce White Point":
      "reduce white point (new in iOS 7.1 beta 3)",
    "Accessibility — white-point reduction":
      "allowing users to reduce iOS 7’s white point",
    "Observed update — wallpaper parallax switch":
      "new option to turn parallax on or off when setting wallpapers",
    "Wallpaper — parallax control":
      "choose to turn the parallax effect on or off",
    "Control Center — slider momentum":
      "brightness and volume sliders now maintain momentum when they are flicked",
    "Observed update — shutdown confirmation design":
      "new look for the confirmation screen when powering down the device",
    "Shut down — power and cancel controls":
      "power button icon at the top and a cancel icon at the bottom",
    "Music — shuffle and repeat buttons":
      "new shuffle and repeat buttons that are more prominent",
    "Music — iTunes Radio New button":
      "iTunes Radio has a revamped “New” button",
    "Observed — shinier Slide to Unlock":
      "tweak to the Slide to Unlock animation to make it “shinier”",
    "Slide controls — brighter, slower animation":
      "more prominent, with a brighter, slower animation",
    "Contacts in Dialer — plus control":
      "executed by tapping the + sign next to the phone number",
    "Messages Scrolling — increased bounce": "slightly more “bounce”",
    "Siri — U.K. iPad voice": "new Siri voice on the iPad",
    "Release notes — new Siri language voices":
      "new natural-sounding Siri voices for English (Australia)",
    "Siri — regional voices and staged download":
      "initially uses a compact voice for Siri",
    "New Siri voices and compact package":
      "new voices downloaded after the device connects to Wi-Fi",
    "Siri — regional natural voices":
      "adds new natural-sounding Siri voices for English (Australia)",
    "Sync known issue — missing USB prompt":
      "Connect to iTunes over USB to re-enable Wi-Fi Sync” prompt is not shown",
    "Wi-Fi Sync prompt and reconnection":
      "prompt is not shown after an update in some situations",
    "Observed update — Shift and Caps Lock redesign":
      "redesigned shift and caps lock keys on the keyboard",
    "Keyboard — revised Shift and Caps Lock states":
      "tweaked the keys once again to make it clearer",
    "Wallpaper — Perspective Zoom rename":
      "renamed the function to “Perspective Zoom” in beta 5",
    "iTunes Radio — Buy Album control": "gained a new “Buy Album” button",
    "Calendar — bolder event-list toggle":
      "toggle for the list view has been made bolder and easier to see",
  }),
);

const cite = (url, locator, note) => {
  const exactAnchor = exactAnchorByLocator.get(locator);
  assert(exactAnchor, `exact citation anchor for ${locator}`);
  return {
    url,
    locator: `${locator} — ${exactAnchor}`,
    ...(note ? { note } : {}),
  };
};
const identityNote = "Contemporaneous milestone identity and timing.";
const observedNote =
  "Contemporaneous observation; publisher prose is not reused.";
const transcriptNote =
  "Credited reproduction of Apple developer material; wording is not reused.";
const corroborationNote =
  "Independent corroboration of the narrowly stated milestone behavior.";
const appleNote =
  "First-party final developer material used only for cumulative corroboration.";

const definitions = new Map();
const occurrence = ({
  key,
  title,
  canonicalSummary,
  category,
  action,
  inheritance = "delta",
  documentedStatus,
  evidenceState,
  verificationMethod,
  citations,
  summary,
}) => {
  const definition = { title, canonicalSummary, category };
  const previous = definitions.get(key);
  if (previous) assert.deepEqual(definition, previous, `${key} definition`);
  else definitions.set(key, definition);
  return {
    key,
    ...definition,
    action,
    inheritance,
    summary:
      summary ||
      `The retained evidence supports this bounded ${category} occurrence at this milestone without assigning it to a different route.`,
    documentedStatus,
    evidenceState,
    verificationMethod,
    citations,
  };
};
const reuse = (key, fields) =>
  occurrence({ key, ...definitions.get(key), ...fields });
const documented = (input) =>
  occurrence({
    inheritance: "delta",
    documentedStatus: "documented",
    evidenceState:
      new Set(input.citations.map((citation) => citation.url)).size > 1
        ? "corroborated"
        : "reported",
    verificationMethod:
      new Set(input.citations.map((citation) => citation.url)).size > 1
        ? "Reconciled the bounded item across retained evidence copies and rewrote it independently."
        : "Matched the bounded item in one credited developer-note copy; the original private Apple beta page is not retained.",
    ...input,
  });
const observed = (input) =>
  occurrence({
    inheritance: "delta",
    documentedStatus: "undocumented",
    evidenceState: "reported",
    verificationMethod:
      "Matched the bounded observation in the retained contemporary report and rewrote it independently.",
    ...input,
  });
const samePublisherReports = (input) =>
  occurrence({
    inheritance: "delta",
    documentedStatus: "undocumented",
    evidenceState: "reported",
    verificationMethod:
      "Reconciled the bounded observation across two same-publisher reports; this is not treated as independent corroboration.",
    ...input,
  });
const independentlyCorroborated = (input) =>
  occurrence({
    inheritance: "delta",
    documentedStatus: "undocumented",
    evidenceState: "corroborated",
    verificationMethod:
      "Reconciled the bounded observation across independent contemporary publishers and rewrote it independently.",
    ...input,
  });
const documentedReuse = (key, input) => {
  const evidenceState =
    new Set(input.citations.map((citation) => citation.url)).size > 1
      ? "corroborated"
      : "reported";
  return reuse(key, {
    documentedStatus: "documented",
    evidenceState,
    verificationMethod:
      evidenceState === "corroborated"
        ? "Reconciled the continuing state across retained evidence copies without moving its first appearance."
        : "Matched the continuing state in one credited developer-note copy without treating the copy as native Apple custody.",
    ...input,
  });
};

const eventSpecs = [
  {
    versionId: "version-ios-7-1",
    version: "7.1",
    alias: "beta-1",
    label: "Beta 1",
    channel: "developerBeta",
    date: "2013-11-18",
    sequence: 1,
    identityUrls: [U.beta1Identity],
    releaseText:
      "A contemporary report identifies Apple’s first iOS 7.1 developer seed on November 18. The retained developer-note copies and hands-on report agree on that milestone boundary.",
    boundaryText:
      "The private Apple note page is no longer available as a native Beta 1 document. Developer-note claims below come from two credited contemporary copies; interface observations remain separately labeled.",
    changes: [
      documented({
        key: "ios-7-1-prerelease-btserver-attachment",
        title: "BTServer attachment from 32-bit apps",
        canonicalSummary:
          "A 32-bit application on 64-bit hardware could not connect to the system Bluetooth server during this prerelease cycle.",
        category: "knownIssue",
        action: "knownIssue",
        citations: [
          cite(
            U.beta1Notes,
            "Bluetooth — 32-bit application attachment",
            transcriptNote,
          ),
          cite(
            U.beta1Observed,
            "Release notes — Bluetooth known issue",
            corroborationNote,
          ),
        ],
      }),
      documented({
        key: "ios-7-1-beta1-cfnetwork-empty-response",
        title: "Empty HTTP responses stopped appearing successful",
        canonicalSummary:
          "CFNetwork returned an error when a server ended a request before sending headers or a body instead of fabricating an empty success response.",
        category: "bugFix",
        action: "fixed",
        citations: [
          cite(
            U.beta1Notes,
            "CFNetwork fixed — empty server response",
            transcriptNote,
          ),
          cite(
            U.beta1Observed,
            "Release notes — empty HTTP response",
            corroborationNote,
          ),
        ],
      }),
      documented({
        key: "ios-7-1-prerelease-cfnetwork-gzip-length-compatibility",
        title: "Compressed-response length compatibility",
        canonicalSummary:
          "Networking added a narrow compatibility path for servers whose compressed payload length described the expanded content exactly.",
        category: "compatibility",
        action: "introduced",
        citations: [
          cite(
            U.beta1Notes,
            "CFNetwork note — gzip content length",
            transcriptNote,
          ),
          cite(
            U.beta1Observed,
            "Release notes — compressed response compatibility",
            corroborationNote,
          ),
        ],
      }),
      documented({
        key: "ios-7-1-beta1-coretext-paragraph-spacing",
        title: "Core Text paragraph spacing",
        canonicalSummary:
          "Frame drawing began placing lines with the paragraph-spacing value supplied by the paragraph style.",
        category: "bugFix",
        action: "fixed",
        citations: [
          cite(
            U.beta1Notes,
            "Core Text fixed — paragraph spacing",
            transcriptNote,
          ),
          cite(
            U.beta1Observed,
            "Release notes — Core Text frame drawing",
            corroborationNote,
          ),
        ],
      }),
      documented({
        key: "ios-7-1-prerelease-crash-log-settings",
        title: "On-device crash-log visibility",
        canonicalSummary:
          "Diagnostics settings could expose device crash reports without waiting for a desktop synchronization.",
        category: "behavior",
        action: "knownIssue",
        citations: [
          cite(
            U.beta1Notes,
            "Crash Logs — missing from Diagnostics settings",
            transcriptNote,
          ),
          cite(
            U.beta1Observed,
            "Release notes — crash-log visibility",
            corroborationNote,
          ),
        ],
        summary:
          "Beta 1 did not show crash reports in the on-device diagnostics list, although a later synchronization still retrieved them.",
      }),
      documented({
        key: "ios-7-1-beta1-glktexture-alpha",
        title: "GLKTextureLoader alpha handling",
        canonicalSummary:
          "Texture loading corrected alpha premultiplication handling for images processed by pngcrush.",
        category: "bugFix",
        action: "fixed",
        citations: [
          cite(
            U.beta1Notes,
            "GLKit fixed — alpha texture loading",
            transcriptNote,
          ),
          cite(
            U.beta1Observed,
            "Release notes — GLKTextureLoader alpha",
            corroborationNote,
          ),
        ],
      }),
      documented({
        key: "ios-7-1-beta1-high-precision-timers",
        title: "High-precision timer delay",
        canonicalSummary:
          "Very short waits no longer inherited the previously documented delay of as much as one millisecond.",
        category: "bugFix",
        action: "fixed",
        citations: [
          cite(
            U.beta1Notes,
            "High Precision Timers — fixed delay",
            transcriptNote,
          ),
          cite(
            U.beta1Observed,
            "Release notes — precision timer delay",
            corroborationNote,
          ),
        ],
      }),
      documented({
        key: "ios-7-1-prerelease-large-music-library-load",
        title: "Large music-library loading delay",
        canonicalSummary:
          "Large iTunes Match or purchase-history collections could require an unusually long initial load.",
        category: "knownIssue",
        action: "knownIssue",
        citations: [
          cite(U.beta1Notes, "iTunes — large library loading", transcriptNote),
          cite(
            U.beta1Observed,
            "Release notes — iTunes Match loading delay",
            corroborationNote,
          ),
        ],
      }),
      documented({
        key: "ios-7-1-beta1-mcsession-initializer",
        title: "MCSession peer initializer",
        canonicalSummary:
          "The peer-based Multipeer Connectivity session initializer gained its intended implementation.",
        category: "bugFix",
        action: "fixed",
        citations: [
          cite(
            U.beta1Notes,
            "Multipeer Connectivity — session initializer",
            transcriptNote,
          ),
          cite(
            U.beta1Observed,
            "Release notes — Multipeer Connectivity initializer",
            corroborationNote,
          ),
        ],
      }),
      independentlyCorroborated({
        key: "ios-7-1-beta1-ipad-close-animation",
        title: "iPad app-closing gesture animation",
        canonicalSummary:
          "The multitouch gesture for dismissing an iPad app used a smoother transition back to the Home screen.",
        category: "enhancement",
        action: "changed",
        citations: [
          cite(
            U.beta1Notes,
            "Observed — iPad closing-gesture transition",
            corroborationNote,
          ),
          cite(
            U.beta1Observed,
            "Observed — iPad pinch-to-close animation",
            observedNote,
          ),
        ],
      }),
      independentlyCorroborated({
        key: "ios-7-1-prerelease-dark-keyboard",
        title: "Dark Keyboard accessibility control",
        canonicalSummary:
          "The prerelease settings exposed a switch for selecting a darker on-screen keyboard appearance.",
        category: "enhancement",
        action: "introduced",
        citations: [
          cite(
            U.beta1Notes,
            "Observed — dark keyboard accessibility control",
            corroborationNote,
          ),
          cite(
            U.beta1Observed,
            "Observed — Dark Keyboard accessibility option",
            observedNote,
          ),
        ],
      }),
      independentlyCorroborated({
        key: "ios-7-1-beta1-burst-photo-stream",
        title: "Burst photos could upload to Photo Stream",
        canonicalSummary:
          "iPhone 5s users gained an option to send burst-mode photographs into Photo Stream.",
        category: "enhancement",
        action: "introduced",
        citations: [
          cite(
            U.beta1Notes,
            "Observed — burst photographs in Photo Stream",
            corroborationNote,
          ),
          cite(
            U.beta1Observed,
            "Observed — burst-mode Photo Stream option",
            observedNote,
          ),
        ],
      }),
      observed({
        key: "ios-7-1-beta1-bold-text-restart",
        title: "Bold Text changed without a restart",
        canonicalSummary:
          "Switching the heavier text treatment no longer forced the device to restart.",
        category: "enhancement",
        action: "changed",
        citations: [
          cite(
            U.beta1Observed,
            "Observed — Bold Text activation",
            observedNote,
          ),
        ],
      }),
      observed({
        key: "ios-7-1-beta1-auto-hdr-indicators",
        title: "Automatic HDR and flash indicators",
        canonicalSummary:
          "Camera controls exposed an automatic HDR mode and showed when automatic flash would fire.",
        category: "enhancement",
        action: "introduced",
        citations: [
          cite(
            U.beta1Observed,
            "Observed — automatic HDR and flash state",
            observedNote,
          ),
        ],
      }),
      observed({
        key: "ios-7-1-beta1-notification-clear-controls",
        title: "Notification clearing controls changed",
        canonicalSummary:
          "Notification Center revised its clear action and added a confirmation state after clearing.",
        category: "behavior",
        action: "changed",
        citations: [
          cite(
            U.beta1Observed,
            "Observed — Notification Center clear action",
            observedNote,
          ),
        ],
      }),
      observed({
        key: "ios-7-1-beta1-service-logos",
        title: "Yahoo and Flickr marks were refreshed",
        canonicalSummary:
          "Yahoo branding spread to additional system surfaces while Flickr adopted a flatter mark.",
        category: "enhancement",
        action: "changed",
        citations: [
          cite(U.beta1Observed, "Observed — Yahoo logo surfaces", observedNote),
          cite(U.beta1Observed, "Observed — Flickr flatter logo", observedNote),
        ],
      }),
      documented({
        key: "ios-7-1-prerelease-uikit-baseline-constraints",
        title: "UIKit baseline-alignment constraints",
        canonicalSummary:
          "Changing most text-field or label attributes after baseline constraints were added could produce an incorrect layout.",
        category: "knownIssue",
        action: "knownIssue",
        citations: [
          cite(
            U.beta1Observed,
            "Release notes — baseline-aligned UIKit controls",
            transcriptNote,
          ),
        ],
      }),
      documented({
        key: "ios-7-1-prerelease-back-indicator-mask",
        title: "Navigation back-indicator transition mask",
        canonicalSummary:
          "A transition-mask image supplied by a storyboard or interface file could be misread at runtime.",
        category: "knownIssue",
        action: "knownIssue",
        citations: [
          cite(
            U.beta1Observed,
            "Release notes — back-indicator transition mask",
            transcriptNote,
          ),
        ],
      }),
    ],
  },
  {
    versionId: "version-ios-7-1",
    version: "7.1",
    alias: "beta-2",
    label: "Beta 2",
    channel: "developerBeta",
    date: "2013-12-13",
    sequence: 2,
    identityUrls: [U.beta2Identity],
    releaseText:
      "Apple’s second developer seed appeared on December 13. Its identity report and the retained note transcript both identify the Beta 2 state.",
    boundaryText:
      "A community archive preserves the developer-note body. Visual deltas come from a separate contemporary report and are not represented as first-party documentation.",
    changes: [
      documentedReuse("ios-7-1-prerelease-btserver-attachment", {
        action: "knownIssue",
        inheritance: "cumulative",
        citations: [
          cite(
            U.beta2Notes,
            "Bluetooth known issue — 32-bit application attachment",
            transcriptNote,
          ),
        ],
        summary:
          "Beta 2 continued to list the Bluetooth attachment limitation first recorded in Beta 1.",
      }),
      documentedReuse(
        "ios-7-1-prerelease-cfnetwork-gzip-length-compatibility",
        {
          action: "introduced",
          inheritance: "cumulative",
          citations: [
            cite(
              U.beta2Notes,
              "CFNetwork note — gzip content length",
              transcriptNote,
            ),
          ],
          summary:
            "Beta 2 retained the narrow compressed-response compatibility behavior introduced in Beta 1.",
        },
      ),
      documentedReuse("ios-7-1-prerelease-uikit-baseline-constraints", {
        action: "knownIssue",
        inheritance: "cumulative",
        citations: [
          cite(
            U.beta2Notes,
            "UIKit known issue — baseline-aligned controls",
            transcriptNote,
          ),
        ],
        summary:
          "Beta 2 continued to list the baseline-alignment limitation first preserved in Beta 1.",
      }),
      documentedReuse("ios-7-1-prerelease-back-indicator-mask", {
        action: "knownIssue",
        inheritance: "cumulative",
        citations: [
          cite(
            U.beta2Notes,
            "UIKit known issue — back-indicator transition mask",
            transcriptNote,
          ),
        ],
        summary:
          "Beta 2 continued to list the interface-file transition-mask limitation first preserved in Beta 1.",
      }),
      reuse("ios-7-1-prerelease-crash-log-settings", {
        action: "fixed",
        inheritance: "delta",
        documentedStatus: "documented",
        evidenceState: "reported",
        verificationMethod:
          "Matched the resolved state in the credited Beta 2 developer-note transcript.",
        citations: [
          cite(
            U.beta2Notes,
            "Crash Logs fixed — Diagnostics visibility",
            transcriptNote,
          ),
        ],
        summary:
          "Beta 2 made crash reports visible in the device’s Diagnostics and Usage Data list.",
      }),
      documented({
        key: "ios-7-1-prerelease-icloud-keychain-setup",
        title: "iCloud Keychain during account setup",
        canonicalSummary:
          "Creating an iCloud account in Setup Assistant could fail when Keychain was enabled in the same flow.",
        category: "knownIssue",
        action: "knownIssue",
        citations: [
          cite(
            U.beta2Notes,
            "iCloud known issue — Keychain during setup",
            transcriptNote,
          ),
        ],
      }),
      reuse("ios-7-1-prerelease-large-music-library-load", {
        action: "fixed",
        inheritance: "delta",
        documentedStatus: "documented",
        evidenceState: "reported",
        verificationMethod:
          "Matched the resolved loading state in the credited Beta 2 developer-note transcript.",
        citations: [
          cite(
            U.beta2Notes,
            "iTunes fixed — large Match library",
            transcriptNote,
          ),
        ],
        summary:
          "Beta 2’s notes say especially large Match libraries should no longer incur the earlier extended wait.",
      }),
      documented({
        key: "ios-7-1-prerelease-audiobook-playback",
        title: "Audiobook playback",
        canonicalSummary:
          "Audiobook items could fail to begin playback during part of the prerelease cycle.",
        category: "knownIssue",
        action: "knownIssue",
        citations: [
          cite(
            U.beta2Notes,
            "Music App known issue — audiobooks",
            transcriptNote,
          ),
        ],
      }),
      documented({
        key: "ios-7-1-prerelease-safari-minimal-ui",
        title: "Safari minimal-ui viewport property",
        canonicalSummary:
          "A viewport property let an iPhone page start with Safari’s upper and lower bars minimized.",
        category: "feature",
        action: "introduced",
        citations: [
          cite(
            U.beta2Notes,
            "Safari note — minimal-ui viewport property",
            transcriptNote,
          ),
        ],
      }),
      observed({
        key: "ios-7-1-beta2-default-tone-selection",
        title: "Selected tones stopped reverting to the default",
        canonicalSummary:
          "The second seed corrected a fault that made assigned alert sounds play as the default tone.",
        category: "bugFix",
        action: "fixed",
        citations: [
          cite(
            U.beta2Identity,
            "Observed — tone-selection correction",
            observedNote,
          ),
        ],
      }),
      observed({
        key: "ios-7-1-beta2-touch-id-settings-location",
        title: "Touch ID and Passcode moved up one settings level",
        canonicalSummary:
          "Fingerprint and passcode controls moved from General into the primary Settings list.",
        category: "enhancement",
        action: "changed",
        citations: [
          cite(
            U.beta2Identity,
            "Observed — Touch ID and Passcode location",
            observedNote,
          ),
        ],
      }),
      observed({
        key: "ios-7-1-prerelease-calendar-list-control",
        title: "Calendar event-list control",
        canonicalSummary:
          "Calendar exposed a control for switching to an event-list presentation.",
        category: "enhancement",
        action: "introduced",
        citations: [
          cite(
            U.beta2Identity,
            "Observed — Calendar list-view toggle",
            observedNote,
          ),
        ],
      }),
      reuse("ios-7-1-prerelease-dark-keyboard", {
        action: "removed",
        inheritance: "delta",
        documentedStatus: "undocumented",
        evidenceState: "reported",
        verificationMethod:
          "Compared the observed Beta 2 accessibility settings with the Beta 1 state.",
        citations: [
          cite(
            U.beta2Identity,
            "Observed — Dark Keyboard option removed",
            observedNote,
          ),
        ],
        summary:
          "The Dark Keyboard switch seen in Beta 1 was no longer present in the second seed.",
      }),
      observed({
        key: "ios-7-1-beta2-button-shapes",
        title: "Button Shapes accessibility option",
        canonicalSummary:
          "Accessibility settings added a visual treatment that made tappable text regions more explicit.",
        category: "enhancement",
        action: "introduced",
        citations: [
          cite(
            U.beta2Identity,
            "Observed — Button Shapes accessibility setting",
            observedNote,
          ),
        ],
      }),
      observed({
        key: "ios-7-1-beta2-animation-speed",
        title: "System animations ran faster",
        canonicalSummary:
          "Several interface transitions completed more quickly than in the preceding seed.",
        category: "enhancement",
        action: "changed",
        citations: [
          cite(
            U.beta2Identity,
            "Observed — faster interface animation",
            observedNote,
          ),
        ],
      }),
      observed({
        key: "ios-7-1-beta2-control-center-feedback",
        title: "Control Center motion and source labels",
        canonicalSummary:
          "Control Center added rebound motion and displayed the current audio source in its media area.",
        category: "enhancement",
        action: "changed",
        citations: [
          cite(
            U.beta2Identity,
            "Observed — Control Center bounce and audio labels",
            observedNote,
          ),
        ],
      }),
      observed({
        key: "ios-7-1-beta2-in-car-preview",
        title: "Early iOS in the Car settings references",
        canonicalSummary:
          "Restrictions exposed a Car Display control while internal references previewed Apple’s planned vehicle interface.",
        category: "feature",
        action: "introduced",
        citations: [
          cite(
            U.beta2Identity,
            "Observed update — Car Display restriction and references",
            observedNote,
          ),
        ],
        summary:
          "The evidence supports an early settings and resource preview, not the later public CarPlay feature boundary.",
      }),
    ],
  },
  {
    versionId: "version-ios-7-1",
    version: "7.1",
    alias: "beta-3",
    label: "Beta 3",
    channel: "developerBeta",
    date: "2014-01-07",
    sequence: 3,
    identityUrls: [U.beta3Identity],
    releaseText:
      "The third iOS 7.1 developer seed arrived on January 7. A retained note copy records its developer-facing deltas, while a same-day visual inventory supplies the observed interface changes.",
    boundaryText:
      "The note copy credits another publisher as its immediate source, so its developer-note items are treated as reported archival evidence rather than as a native Apple page.",
    changes: [
      documentedReuse("ios-7-1-prerelease-btserver-attachment", {
        action: "knownIssue",
        inheritance: "cumulative",
        citations: [
          cite(
            U.beta3Notes,
            "Bluetooth known issue — 32-bit application attachment",
            transcriptNote,
          ),
        ],
        summary:
          "Beta 3 continued to list the Bluetooth attachment limitation first recorded in Beta 1.",
      }),
      documentedReuse(
        "ios-7-1-prerelease-cfnetwork-gzip-length-compatibility",
        {
          action: "introduced",
          inheritance: "cumulative",
          citations: [
            cite(
              U.beta3Notes,
              "CFNetwork note — gzip content length",
              transcriptNote,
            ),
          ],
          summary:
            "Beta 3 retained the compressed-response compatibility behavior introduced in Beta 1.",
        },
      ),
      documentedReuse("ios-7-1-prerelease-safari-minimal-ui", {
        action: "introduced",
        inheritance: "cumulative",
        citations: [
          cite(
            U.beta3Notes,
            "Safari note — minimal-ui viewport property",
            transcriptNote,
          ),
        ],
        summary:
          "Beta 3 continued to document the Safari viewport behavior introduced in Beta 2.",
      }),
      documentedReuse("ios-7-1-prerelease-uikit-baseline-constraints", {
        action: "knownIssue",
        inheritance: "cumulative",
        citations: [
          cite(
            U.beta3Notes,
            "UIKit known issue — baseline-aligned controls",
            transcriptNote,
          ),
        ],
        summary:
          "Beta 3 continued to list the baseline-alignment limitation first preserved in Beta 1.",
      }),
      documentedReuse("ios-7-1-prerelease-back-indicator-mask", {
        action: "knownIssue",
        inheritance: "cumulative",
        citations: [
          cite(
            U.beta3Notes,
            "UIKit known issue — back-indicator transition mask",
            transcriptNote,
          ),
        ],
        summary:
          "Beta 3 continued to list the interface-file transition-mask limitation first preserved in Beta 1.",
      }),
      reuse("ios-7-1-prerelease-icloud-keychain-setup", {
        action: "fixed",
        inheritance: "delta",
        documentedStatus: "documented",
        evidenceState: "reported",
        verificationMethod:
          "Matched the resolved setup state in the credited Beta 3 developer-note copy.",
        citations: [
          cite(
            U.beta3Notes,
            "iCloud fixed — Keychain during account setup",
            transcriptNote,
          ),
        ],
        summary:
          "Beta 3’s notes report that the Keychain activation error from Beta 2 no longer occurred during new-account setup.",
      }),
      documented({
        key: "ios-7-1-prerelease-imessage-false-failure",
        title: "Immediate false iMessage failure",
        canonicalSummary:
          "Messages could mark an iMessage as failed immediately after it was sent even when the send attempt had proceeded.",
        category: "knownIssue",
        action: "knownIssue",
        citations: [
          cite(
            U.beta3Notes,
            "Messages known issue — immediate send failure",
            transcriptNote,
          ),
        ],
      }),
      reuse("ios-7-1-prerelease-audiobook-playback", {
        action: "fixed",
        inheritance: "delta",
        documentedStatus: "documented",
        evidenceState: "reported",
        verificationMethod:
          "Matched the resolved playback state in the credited Beta 3 developer-note copy.",
        citations: [
          cite(
            U.beta3Notes,
            "Music App fixed — audiobook playback",
            transcriptNote,
          ),
        ],
        summary:
          "The third seed restored expected playback for the audiobook items affected in Beta 2.",
      }),
      samePublisherReports({
        key: "ios-7-1-beta3-keyboard-design",
        title: "Keyboard contrast and key artwork",
        canonicalSummary:
          "The keyboard adopted darker tones, slightly heavier labels, and revised Shift and Delete key shapes.",
        category: "enhancement",
        action: "changed",
        citations: [
          cite(
            U.beta3Identity,
            "Observed update — keyboard and Delete key",
            observedNote,
          ),
          cite(
            U.beta3Observed,
            "Keyboard — contrast, labels, Shift, and Delete",
            corroborationNote,
          ),
        ],
      }),
      samePublisherReports({
        key: "ios-7-1-beta3-phone-controls",
        title: "Phone call controls became circular",
        canonicalSummary:
          "Dialing and incoming-call screens replaced rectangular actions with round call-state controls.",
        category: "enhancement",
        action: "changed",
        citations: [
          cite(
            U.beta3Identity,
            "Observed update — Phone dialer and incoming call",
            observedNote,
          ),
          cite(
            U.beta3Observed,
            "Phone — circular call controls",
            corroborationNote,
          ),
        ],
      }),
      samePublisherReports({
        key: "ios-7-1-beta3-green-icon-palette",
        title: "Green app icons used a darker palette",
        canonicalSummary:
          "Phone, Messages, and FaceTime icons reduced the brightness of their green gradient.",
        category: "enhancement",
        action: "changed",
        citations: [
          cite(
            U.beta3Identity,
            "Observed update — green app-icon color",
            observedNote,
          ),
          cite(
            U.beta3Observed,
            "Icons — toned-down green treatment",
            corroborationNote,
          ),
        ],
      }),
      samePublisherReports({
        key: "ios-7-1-beta3-reduce-white-point",
        title: "Reduce White Point accessibility control",
        canonicalSummary:
          "The expanded contrast settings gained an option to lower the intensity of bright white interface areas.",
        category: "enhancement",
        action: "introduced",
        citations: [
          cite(
            U.beta3Identity,
            "Observed update — Reduce White Point",
            observedNote,
          ),
          cite(
            U.beta3Observed,
            "Accessibility — white-point reduction",
            corroborationNote,
          ),
        ],
      }),
      samePublisherReports({
        key: "ios-7-1-prerelease-wallpaper-parallax-control",
        title: "Wallpaper parallax control",
        canonicalSummary:
          "Wallpaper setup exposed a control for disabling the image’s parallax presentation.",
        category: "enhancement",
        action: "introduced",
        citations: [
          cite(
            U.beta3Identity,
            "Observed update — wallpaper parallax switch",
            observedNote,
          ),
          cite(
            U.beta3Observed,
            "Wallpaper — parallax control",
            corroborationNote,
          ),
        ],
      }),
      observed({
        key: "ios-7-1-beta3-control-center-momentum",
        title: "Control Center sliders retained flick momentum",
        canonicalSummary:
          "Brightness and volume controls continued moving briefly after a quick swipe.",
        category: "behavior",
        action: "changed",
        citations: [
          cite(
            U.beta3Observed,
            "Control Center — slider momentum",
            observedNote,
          ),
        ],
      }),
      samePublisherReports({
        key: "ios-7-1-beta3-shutdown-controls",
        title: "Shutdown screen controls were redrawn",
        canonicalSummary:
          "The power-off screen replaced its earlier red tabs with icon-led controls for shutdown and cancellation.",
        category: "enhancement",
        action: "changed",
        citations: [
          cite(
            U.beta3Identity,
            "Observed update — shutdown confirmation design",
            observedNote,
          ),
          cite(
            U.beta3Observed,
            "Shut down — power and cancel controls",
            corroborationNote,
          ),
        ],
      }),
      observed({
        key: "ios-7-1-beta3-music-playback-controls",
        title: "Music repeat and shuffle controls gained emphasis",
        canonicalSummary:
          "The Music interface made its shuffle and repeat actions more visually prominent.",
        category: "enhancement",
        action: "changed",
        citations: [
          cite(
            U.beta3Observed,
            "Music — shuffle and repeat buttons",
            observedNote,
          ),
        ],
      }),
      observed({
        key: "ios-7-1-beta3-itunes-radio-new-control",
        title: "iTunes Radio revised its New control",
        canonicalSummary:
          "The radio interface changed the presentation of the action labeled New.",
        category: "enhancement",
        action: "changed",
        citations: [
          cite(
            U.beta3Observed,
            "Music — iTunes Radio New button",
            observedNote,
          ),
        ],
      }),
    ],
  },
  {
    versionId: "version-ios-7-1",
    version: "7.1",
    alias: "beta-4",
    label: "Beta 4",
    channel: "developerBeta",
    date: "2014-01-20",
    sequence: 4,
    identityUrls: [U.beta4Identity],
    releaseText:
      "The fourth developer seed appeared on January 20. The contemporary identity report describes a maintenance-heavy build, while the retained note copy and visual inventory isolate its bounded changes.",
    boundaryText:
      "Generic bug-fix claims are not expanded into records. Only specifically described developer issues and directly reported interface differences are indexed.",
    changes: [
      documentedReuse("ios-7-1-prerelease-btserver-attachment", {
        action: "knownIssue",
        inheritance: "cumulative",
        citations: [
          cite(
            U.beta4Notes,
            "Bluetooth known issue — 32-bit application attachment",
            transcriptNote,
          ),
        ],
        summary:
          "Beta 4 continued to list the Bluetooth attachment limitation first recorded in Beta 1.",
      }),
      documentedReuse(
        "ios-7-1-prerelease-cfnetwork-gzip-length-compatibility",
        {
          action: "introduced",
          inheritance: "cumulative",
          citations: [
            cite(
              U.beta4Notes,
              "CFNetwork note — gzip content length",
              transcriptNote,
            ),
          ],
          summary:
            "Beta 4 retained the compressed-response compatibility behavior introduced in Beta 1.",
        },
      ),
      documentedReuse("ios-7-1-prerelease-safari-minimal-ui", {
        action: "introduced",
        inheritance: "cumulative",
        citations: [
          cite(
            U.beta4Notes,
            "Safari note — minimal-ui viewport property",
            transcriptNote,
          ),
        ],
        summary:
          "Beta 4 continued to document the Safari viewport behavior introduced in Beta 2.",
      }),
      documentedReuse("ios-7-1-prerelease-uikit-baseline-constraints", {
        action: "knownIssue",
        inheritance: "cumulative",
        citations: [
          cite(
            U.beta4Notes,
            "UIKit known issue — baseline-aligned controls",
            transcriptNote,
          ),
        ],
        summary:
          "Beta 4 continued to list the baseline-alignment limitation first preserved in Beta 1.",
      }),
      reuse("ios-7-1-prerelease-imessage-false-failure", {
        action: "fixed",
        inheritance: "delta",
        documentedStatus: "documented",
        evidenceState: "reported",
        verificationMethod:
          "Matched the corrected Messages state in the credited Beta 4 developer-note copy.",
        citations: [
          cite(
            U.beta4Notes,
            "Messages fixed — immediate send failure",
            transcriptNote,
          ),
        ],
        summary:
          "Beta 4 no longer displayed the immediate false-failure state documented in Beta 3.",
      }),
      documented({
        key: "ios-7-1-prerelease-uibarbutton-background",
        title: "Bordered bar-button background images",
        canonicalSummary:
          "Apps targeting iOS 7.1 could ignore custom bar-button backgrounds when the bordered style overload was used.",
        category: "knownIssue",
        action: "knownIssue",
        citations: [
          cite(
            U.beta4Notes,
            "UIKit known issue — bordered bar-button image",
            transcriptNote,
          ),
        ],
      }),
      documentedReuse("ios-7-1-prerelease-back-indicator-mask", {
        action: "knownIssue",
        inheritance: "cumulative",
        citations: [
          cite(
            U.beta4Notes,
            "UIKit known issue — back-indicator mask image",
            transcriptNote,
          ),
        ],
        summary:
          "Beta 4 continued to list the interface-file transition-mask limitation first preserved in Beta 1.",
      }),
      samePublisherReports({
        key: "ios-7-1-beta4-slide-animation",
        title: "Unlock and power-off slides became brighter",
        canonicalSummary:
          "Both slide controls used a more prominent animation that moved at a slower pace.",
        category: "enhancement",
        action: "changed",
        citations: [
          cite(
            U.beta4Identity,
            "Observed — shinier Slide to Unlock",
            observedNote,
          ),
          cite(
            U.beta4Observed,
            "Slide controls — brighter, slower animation",
            corroborationNote,
          ),
        ],
      }),
      observed({
        key: "ios-7-1-beta4-dialer-add-contact",
        title: "Dialer used a plus control for adding contacts",
        canonicalSummary:
          "The dialer replaced its written add-contact action with a plus symbol beside the entered number.",
        category: "enhancement",
        action: "changed",
        citations: [
          cite(
            U.beta4Observed,
            "Contacts in Dialer — plus control",
            observedNote,
          ),
        ],
      }),
      observed({
        key: "ios-7-1-beta4-messages-scroll",
        title: "Messages scrolling gained more rebound",
        canonicalSummary:
          "Conversation scrolling showed a stronger elastic response at its boundaries.",
        category: "behavior",
        action: "changed",
        citations: [
          cite(
            U.beta4Observed,
            "Messages Scrolling — increased bounce",
            observedNote,
          ),
        ],
      }),
      observed({
        key: "ios-7-1-beta4-uk-siri-ipad",
        title: "A revised U.K. Siri voice reached iPad",
        canonicalSummary:
          "The iPad presented a different Siri voice for users of the United Kingdom language setting.",
        category: "enhancement",
        action: "introduced",
        citations: [
          cite(U.beta4Observed, "Siri — U.K. iPad voice", observedNote),
        ],
      }),
    ],
  },
  {
    versionId: "version-ios-7-1",
    version: "7.1",
    alias: "beta-5",
    label: "Beta 5",
    channel: "developerBeta",
    date: "2014-02-04",
    sequence: 5,
    identityUrls: [U.beta5Identity],
    boundaryUrls: [U.noGm],
    releaseText:
      "Apple’s fifth iOS 7.1 developer seed arrived on February 4. Its identity report, a preserved developer-note body, and independent coverage agree on the Siri and developer-facing state.",
    boundaryText:
      "A March 4 report counted five developer betas, identified Beta 5 as the latest seed, and stated that Apple had not issued a GM to developers. The March 10 public release is therefore not backfilled as a hidden GM route.",
    changes: [
      reuse("ios-7-1-prerelease-btserver-attachment", {
        action: "knownIssue",
        inheritance: "cumulative",
        documentedStatus: "documented",
        evidenceState: "corroborated",
        verificationMethod:
          "Reconciled the retained Beta 5 note with Apple’s final developer document.",
        citations: [
          cite(
            U.beta5Notes,
            "Bluetooth known issue — 32-bit application attachment",
            transcriptNote,
          ),
          cite(
            U.beta5Corroboration,
            "Bluetooth issue on 64-bit hardware",
            corroborationNote,
          ),
          cite(U.finalDeveloper, "Bluetooth known issue — BTServer", appleNote),
        ],
        summary:
          "The Bluetooth attachment limitation first indexed at Beta 1 remained listed in Beta 5 and in Apple’s final developer notes.",
      }),
      documentedReuse(
        "ios-7-1-prerelease-cfnetwork-gzip-length-compatibility",
        {
          action: "introduced",
          inheritance: "cumulative",
          citations: [
            cite(
              U.beta5Notes,
              "CFNetwork note — gzip content length",
              transcriptNote,
            ),
            cite(
              U.finalDeveloper,
              "CFNetwork note — gzip content length",
              appleNote,
            ),
          ],
          summary:
            "Beta 5 and Apple’s final developer notes retained the compressed-response compatibility behavior first indexed at Beta 1.",
        },
      ),
      reuse("ios-7-1-prerelease-safari-minimal-ui", {
        action: "introduced",
        inheritance: "cumulative",
        documentedStatus: "documented",
        evidenceState: "corroborated",
        verificationMethod:
          "Reconciled the Beta 5 note and independent report with Apple’s final developer document.",
        citations: [
          cite(
            U.beta5Notes,
            "Safari note — minimal-ui viewport property",
            transcriptNote,
          ),
          cite(
            U.beta5Corroboration,
            "Safari minimal-ui behavior",
            corroborationNote,
          ),
          cite(U.finalDeveloper, "Safari note — minimal-ui", appleNote),
        ],
        summary:
          "Beta 5 continued to document the viewport behavior introduced in Beta 2; this occurrence does not move its first appearance.",
      }),
      documented({
        key: "ios-7-1-siri-listening-voices",
        title: "Siri listening control and voices",
        canonicalSummary:
          "Siri added push-to-talk listening control and new natural-sounding voice options in several language variants.",
        category: "enhancement",
        action: "introduced",
        citations: [
          cite(
            U.beta5Identity,
            "Release notes — new Siri language voices",
            transcriptNote,
          ),
          cite(
            U.beta5Notes,
            "Siri — regional voices and staged download",
            transcriptNote,
          ),
          cite(
            U.beta5Corroboration,
            "New Siri voices and compact package",
            corroborationNote,
          ),
          cite(U.finalDeveloper, "Siri — regional natural voices", appleNote),
        ],
        summary:
          "Beta 5 specifically introduced the regional voice packages and their compact-to-higher-quality download path; the global definition also covers the final release’s listening control.",
      }),
      documented({
        key: "ios-7-1-beta5-wifi-sync-repair",
        title: "Wi-Fi Sync re-pairing prompt could be absent",
        canonicalSummary:
          "Some upgraded devices still required a USB reconnection to restore wireless syncing even though the expected instruction was missing.",
        category: "knownIssue",
        action: "knownIssue",
        citations: [
          cite(
            U.beta5Notes,
            "Sync known issue — missing USB prompt",
            transcriptNote,
          ),
          cite(
            U.beta5Corroboration,
            "Wi-Fi Sync prompt and reconnection",
            corroborationNote,
          ),
        ],
      }),
      reuse("ios-7-1-prerelease-uibarbutton-background", {
        action: "knownIssue",
        inheritance: "cumulative",
        documentedStatus: "documented",
        evidenceState: "corroborated",
        verificationMethod:
          "Reconciled the retained Beta 5 note with Apple’s final developer document.",
        citations: [
          cite(
            U.beta5Notes,
            "UIKit known issue — bordered bar-button image",
            transcriptNote,
          ),
          cite(
            U.finalDeveloper,
            "UIKit known issue — bordered bar-button image",
            appleNote,
          ),
        ],
        summary:
          "The bordered-style image limitation introduced in the Beta 4 record remained documented in Beta 5 and the final SDK notes.",
      }),
      reuse("ios-7-1-prerelease-uikit-baseline-constraints", {
        action: "knownIssue",
        inheritance: "cumulative",
        documentedStatus: "documented",
        evidenceState: "corroborated",
        verificationMethod:
          "Reconciled the retained Beta 5 note with Apple’s final developer document.",
        citations: [
          cite(
            U.beta5Notes,
            "UIKit known issue — baseline-aligned controls",
            transcriptNote,
          ),
          cite(
            U.finalDeveloper,
            "UIKit known issue — baseline alignment",
            appleNote,
          ),
        ],
        summary:
          "The baseline-alignment limitation recorded at Beta 1 remained present in Beta 5 and in Apple’s final notes.",
      }),
      reuse("ios-7-1-prerelease-back-indicator-mask", {
        action: "knownIssue",
        inheritance: "cumulative",
        documentedStatus: "documented",
        evidenceState: "corroborated",
        verificationMethod:
          "Reconciled the retained Beta 5 note with Apple’s final developer document.",
        citations: [
          cite(
            U.beta5Notes,
            "UIKit known issue — back-indicator mask image",
            transcriptNote,
          ),
          cite(
            U.finalDeveloper,
            "UIKit known issue — transition mask image",
            appleNote,
          ),
        ],
        summary:
          "The interface-file transition-mask problem remained documented after Beta 4 and in the final SDK notes.",
      }),
      samePublisherReports({
        key: "ios-7-1-beta5-keyboard-state-keys",
        title: "Shift and Caps Lock states became clearer",
        canonicalSummary:
          "Keyboard artwork changed again to distinguish inactive Shift, active Shift, and Caps Lock more clearly.",
        category: "enhancement",
        action: "changed",
        citations: [
          cite(
            U.beta5Identity,
            "Observed update — Shift and Caps Lock redesign",
            observedNote,
          ),
          cite(
            U.beta5Observed,
            "Keyboard — revised Shift and Caps Lock states",
            corroborationNote,
          ),
        ],
      }),
      reuse("ios-7-1-prerelease-wallpaper-parallax-control", {
        action: "changed",
        inheritance: "delta",
        documentedStatus: "undocumented",
        evidenceState: "reported",
        verificationMethod:
          "Compared the observed Beta 5 label with the Beta 3 control’s first appearance.",
        citations: [
          cite(
            U.beta5Observed,
            "Wallpaper — Perspective Zoom rename",
            observedNote,
          ),
        ],
        summary:
          "Beta 5 renamed the earlier Motion control to Perspective Zoom while retaining its wallpaper-depth purpose.",
      }),
      documented({
        key: "ios-7-1-itunes-radio-discovery-purchasing",
        title: "iTunes Radio discovery and purchasing",
        canonicalSummary:
          "iTunes Radio gained easier station creation, album purchasing from Now Playing, and on-device iTunes Match subscription.",
        category: "enhancement",
        action: "introduced",
        documentedStatus: "undocumented",
        evidenceState: "reported",
        verificationMethod:
          "Matched the bounded purchasing observation in the retained Beta 5 visual inventory.",
        citations: [
          cite(
            U.beta5Observed,
            "iTunes Radio — Buy Album control",
            observedNote,
          ),
        ],
        summary:
          "Beta 5 specifically exposed a Buy Album action beside song purchasing; the global definition also covers adjacent capabilities documented for the public release.",
      }),
      reuse("ios-7-1-prerelease-calendar-list-control", {
        action: "changed",
        inheritance: "delta",
        documentedStatus: "undocumented",
        evidenceState: "reported",
        verificationMethod:
          "Compared the observed Beta 5 control treatment with its Beta 2 first appearance.",
        citations: [
          cite(
            U.beta5Observed,
            "Calendar — bolder event-list toggle",
            observedNote,
          ),
        ],
        summary:
          "The event-list control introduced in Beta 2 became visually heavier and easier to identify.",
      }),
    ],
  },
];

const expectedRoutes = [
  ["version-ios-7-1", "beta-1", "2013-11-18", 18],
  ["version-ios-7-1", "beta-2", "2013-12-13", 17],
  ["version-ios-7-1", "beta-3", "2014-01-07", 17],
  ["version-ios-7-1", "beta-4", "2014-01-20", 11],
  ["version-ios-7-1", "beta-5", "2014-02-04", 12],
];
assert.deepEqual(
  eventSpecs.map((spec) => [
    spec.versionId,
    spec.alias,
    spec.date,
    spec.changes.length,
  ]),
  expectedRoutes,
  "exact route closure",
);

const seed = JSON.parse(readFileSync(join(here, "..", "seed-data.json")));
const expectedPointSeed = [
  ["7.0.1", "2013-09-20"],
  ["7.0.2", "2013-09-26"],
  ["7.0.3", "2013-10-23"],
  ["7.0.4", "2013-11-14"],
  ["7.0.6", "2014-02-21"],
  ["7.1", "2014-03-10"],
  ["7.1.1", "2014-04-22"],
  ["7.1.2", "2014-06-30"],
];
assert.deepEqual(
  seed.releaseVersions
    .filter(
      (item) =>
        item.platform === "iOS" && /^7\.(?:0\.[1-9]|1)/.test(item.version),
    )
    .map((item) => [
      item.version,
      item.publicReleaseDate,
      item.milestones.map((milestone) => [
        milestone.label,
        milestone.date,
        milestone.isRevision,
      ]),
      item.releaseStatus,
    ]),
  expectedPointSeed.map(([version, date]) => [
    version,
    date,
    [["Public", date, false]],
    "released",
  ]),
  "exact iOS 7 point-release seed closure",
);

const publicBatchBuffer = readFileSync(join(here, "apple-ios-7.json"));
assert.equal(
  sha256(publicBatchBuffer),
  "36027fdba7739881510e8eaf2e5dd7d73af58786a78f3c0e378edaf28e65ec14",
  "approved iOS 7 Public owner SHA-256",
);
const publicBatch = JSON.parse(publicBatchBuffer);
for (const [version] of expectedPointSeed) {
  const versionId = `version-ios-${version.replaceAll(".", "-")}`;
  const overlay = publicBatch.versions.find(
    (item) => item.releaseVersionId === versionId,
  );
  const event = publicBatch.events.find(
    (item) =>
      item.target?.releaseVersionId === versionId &&
      item.target?.routeAlias === "public",
  );
  assert(overlay, `${versionId} approved public overlay`);
  assert.equal(overlay.provenanceStatus, "editoriallyVerified");
  assert.equal(overlay.editorialReview?.status, "approved");
  assert(event, `${versionId} approved Public ownership`);
  assert.equal(event.provenanceStatus, "editoriallyVerified");
  assert.equal(event.editorialReview?.status, "approved");
  assert.equal(event.isIndexable, true);
}

const requiredGlobalDefinitions = new Map([
  [
    "ios-7-1-siri-listening-voices",
    {
      title: "Siri listening control and voices",
      canonicalSummary:
        "Siri added push-to-talk listening control and new natural-sounding voice options in several language variants.",
      category: "enhancement",
    },
  ],
  [
    "ios-7-1-itunes-radio-discovery-purchasing",
    {
      title: "iTunes Radio discovery and purchasing",
      canonicalSummary:
        "iTunes Radio gained easier station creation, album purchasing from Now Playing, and on-device iTunes Match subscription.",
      category: "enhancement",
    },
  ],
]);
for (const [key, definition] of requiredGlobalDefinitions) {
  const existing = publicBatch.events
    .flatMap((event) => event.changes || [])
    .find((change) => change.key === key);
  assert(existing, `${key} approved public definition`);
  assert.deepEqual(
    {
      title: existing.title,
      canonicalSummary: existing.canonicalSummary,
      category: existing.category,
    },
    definition,
    `${key} exact global reuse`,
  );
}

const articleCitations = (spec) => {
  const byUrl = new Map();
  for (const change of spec.changes) {
    for (const citation of change.citations) {
      if (!byUrl.has(citation.url)) byUrl.set(citation.url, citation);
    }
  }
  return [...byUrl.values()];
};
const events = eventSpecs.map((spec) => {
  const identityCitations = spec.identityUrls.map((url) =>
    cite(url, `${spec.label} identity and timing`, identityNote),
  );
  const boundaryCitations = (spec.boundaryUrls || spec.identityUrls).map(
    (url) =>
      cite(
        url,
        spec.boundaryUrls
          ? "Five-beta cycle and absent developer GM"
          : `${spec.label} evidence boundary`,
        spec.boundaryUrls ? identityNote : identityNote,
      ),
  );
  return {
    target: { releaseVersionId: spec.versionId, routeAlias: spec.alias },
    identity: {
      releaseVersionId: spec.versionId,
      platformId: "platform-ios",
      stableEventId: `event:apple:ios:${spec.version}:${spec.alias}`,
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
    summary: `${spec.label} is an editorially reviewed historical article with ${spec.changes.length} bounded records and an explicit account of the surviving evidence boundary.`,
    article: {
      authorship: "originalSynthesis",
      blocks: [
        { style: "h2", text: "Milestone identity" },
        {
          style: "normal",
          text: spec.releaseText,
          citations: identityCitations,
        },
        { style: "h2", text: "Indexed evidence" },
        {
          style: "normal",
          text: `This page indexes ${spec.changes.length} bounded occurrences. Titles, summaries, and explanatory prose are original synthesis; each record points to its supporting evidence family.`,
          citations: articleCitations(spec),
        },
        { style: "h2", text: "Evidence limits" },
        {
          style: "normal",
          text: spec.boundaryText,
          citations: boundaryCitations,
        },
      ],
    },
    citations: [
      ...identityCitations,
      ...articleCitations(spec),
      ...boundaryCitations,
    ],
    changes: spec.changes,
    provenanceStatus: "editoriallyVerified",
    editorialReview: { status: "approved", reviewedAt },
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

const allCitationUrls = [];
const visit = (value) => {
  if (Array.isArray(value)) {
    for (const item of value) visit(item);
    return;
  }
  if (!value || typeof value !== "object") return;
  for (const [key, child] of Object.entries(value)) {
    if (key === "citations") {
      for (const citation of child) allCitationUrls.push(citation.url);
    } else {
      visit(child);
    }
  }
};
visit(bundle);
const declaredUrls = new Set(sources.map((source) => source.url));
assert.equal(declaredUrls.size, sources.length, "unique source URLs");
assert.deepEqual(
  new Set(allCitationUrls),
  declaredUrls,
  "declared source/use closure",
);

const localDefinitions = new Map();
const recurrence = new Map();
const publisherByUrl = new Map(
  sources.map((source) => [source.url, source.publisher]),
);
const evidenceStateCounts = {
  reported: 0,
  corroborated: 0,
  confirmed: 0,
};
let occurrenceCount = 0;
for (const event of events) {
  assert.equal(event.provenanceStatus, "editoriallyVerified");
  assert.deepEqual(event.editorialReview, {
    status: "approved",
    reviewedAt,
  });
  assert.equal(event.isIndexable, true);
  assert.equal(event.identity.channel, "developerBeta");
  assert.equal(event.identity.closesReleaseCycle, false);
  for (const change of event.changes) {
    occurrenceCount += 1;
    assert(change.citations.length > 0, `${change.key} citations`);
    assert(
      ["delta", "cumulative"].includes(change.inheritance),
      `${change.key} inheritance`,
    );
    assert(
      ["documented", "partiallyDocumented", "undocumented"].includes(
        change.documentedStatus,
      ),
      `${change.key} documentation state`,
    );
    assert(
      ["reported", "corroborated", "confirmed"].includes(change.evidenceState),
      `${change.key} evidence state`,
    );
    evidenceStateCounts[change.evidenceState] += 1;
    if (change.evidenceState === "corroborated") {
      assert(
        new Set(
          change.citations.map((citation) => publisherByUrl.get(citation.url)),
        ).size >= 2,
        `${change.key} independent publisher corroboration`,
      );
    }
    const definition = {
      title: change.title,
      canonicalSummary: change.canonicalSummary,
      category: change.category,
    };
    const previous = localDefinitions.get(change.key);
    if (previous) assert.deepEqual(definition, previous, change.key);
    else localDefinitions.set(change.key, definition);
    recurrence.set(change.key, [
      ...(recurrence.get(change.key) || []),
      `${event.target.routeAlias}:${change.action}:${change.inheritance}`,
    ]);
  }
}
assert.equal(occurrenceCount, 75, "occurrence count");
assert.equal(localDefinitions.size, 47, "stable definition count");
assert.deepEqual(
  evidenceStateCounts,
  { reported: 55, corroborated: 20, confirmed: 0 },
  "evidence-state distribution",
);
assert.equal(
  [...recurrence.values()].filter((states) => states.length > 1).length,
  14,
  "exact repeated definition count",
);
assert.deepEqual(
  recurrence.get("ios-7-1-prerelease-btserver-attachment"),
  [
    "beta-1:knownIssue:delta",
    "beta-2:knownIssue:cumulative",
    "beta-3:knownIssue:cumulative",
    "beta-4:knownIssue:cumulative",
    "beta-5:knownIssue:cumulative",
  ],
  "Bluetooth cumulative history",
);
assert.deepEqual(
  recurrence.get("ios-7-1-prerelease-cfnetwork-gzip-length-compatibility"),
  [
    "beta-1:introduced:delta",
    "beta-2:introduced:cumulative",
    "beta-3:introduced:cumulative",
    "beta-4:introduced:cumulative",
    "beta-5:introduced:cumulative",
  ],
  "CFNetwork compatibility history",
);
for (const key of [
  "ios-7-1-prerelease-uikit-baseline-constraints",
  "ios-7-1-prerelease-back-indicator-mask",
]) {
  assert.deepEqual(
    recurrence.get(key),
    [
      "beta-1:knownIssue:delta",
      "beta-2:knownIssue:cumulative",
      "beta-3:knownIssue:cumulative",
      "beta-4:knownIssue:cumulative",
      "beta-5:knownIssue:cumulative",
    ],
    `${key} cumulative history`,
  );
}
assert.deepEqual(
  recurrence.get("ios-7-1-prerelease-safari-minimal-ui"),
  [
    "beta-2:introduced:delta",
    "beta-3:introduced:cumulative",
    "beta-4:introduced:cumulative",
    "beta-5:introduced:cumulative",
  ],
  "Safari cumulative history",
);
const reusedDefinitionKeys = new Set(requiredGlobalDefinitions.keys());
const newLocalDefinitionKeys = [...localDefinitions.keys()].filter(
  (key) => !reusedDefinitionKeys.has(key),
);
assert.equal(newLocalDefinitionKeys.length, 45, "new definition count");
assert(
  newLocalDefinitionKeys.every((key) => key.startsWith("ios-7-1-")),
  "new definitions use the iOS 7.1 namespace",
);
assert.deepEqual(bundle.versions, [], "no version overlays");
assert.deepEqual(bundle.builds, [], "no build documents");
assert(
  bundle.events.every(
    (event) =>
      event.target.releaseVersionId === "version-ios-7-1" &&
      event.target.routeAlias !== "public" &&
      event.target.routeAlias !== "gm",
  ),
  "only iOS 7.1 Beta 1–5 routes",
);

const thisRouteKeys = new Set(
  events.map(
    (event) => `${event.target.releaseVersionId}\0${event.target.routeAlias}`,
  ),
);
const thisStableIds = new Set(
  events.map((event) => event.identity.stableEventId),
);
for (const name of readdirSync(here).filter(
  (entry) => entry.endsWith(".json") && entry !== outputName,
)) {
  const other = JSON.parse(readFileSync(join(here, name), "utf8"));
  for (const event of other.events || []) {
    const routeKey =
      event.target?.releaseVersionId && event.target?.routeAlias
        ? `${event.target.releaseVersionId}\0${event.target.routeAlias}`
        : null;
    assert(
      !routeKey || !thisRouteKeys.has(routeKey),
      `${name} already owns ${routeKey?.replace("\0", "/")}`,
    );
    assert(
      !event.identity?.stableEventId ||
        !thisStableIds.has(event.identity.stableEventId),
      `${name} already owns ${event.identity?.stableEventId}`,
    );
  }
  for (const owner of [
    ...(other.versions || []),
    ...(other.events || []),
    ...(other.builds || []),
  ]) {
    for (const change of owner.changes || []) {
      const local = localDefinitions.get(change.key);
      if (!local) continue;
      assert.deepEqual(
        {
          title: change.title,
          canonicalSummary: change.canonicalSummary,
          category: change.category,
        },
        local,
        `${name} ${change.key} global definition`,
      );
    }
  }
}

const formattedJson = await prettier.format(JSON.stringify(bundle), {
  filepath: outputName,
});
const jsonSha = sha256(formattedJson);
writeFileSync(join(here, outputName), formattedJson);

const citationCount = allCitationUrls.length;
const sourceLedger = sources
  .map(
    (source) =>
      `- [${source.title}](${source.url}) — ${source.publisher}; ${source.sourceClass}.`,
  )
  .join("\n");
const routeRows = eventSpecs
  .map(
    (spec) =>
      `| ${spec.label} | \`${spec.alias}\` | ${spec.date} | ${spec.changes.length} |`,
  )
  .join("\n");
const routeVerificationRows = eventSpecs
  .map(
    (spec) =>
      `| \`/apple/ios/7.1/${spec.alias}/\` | 200 | 3/3 | ${spec.changes.length}/${spec.changes.length} | yes | yes | no | index, follow |`,
  )
  .join("\n");
const dryRun = {
  creates: 67,
  patches: 2,
  unchanged: 2_150,
  sourceCreates: 17,
  eventCreates: 5,
  changeCreates: 45,
  mutationPayloadBytes: 202_490,
  contentDigest:
    "875043ab26a2c630ba7a4dad5aa39c84ffa933791b8ef2aa79291bebac83df9d",
  sourceSnapshotDigest:
    "1112c55cd42cddae9324b4ff599d44625064a5fabc1bca77343e0a6b497ee015",
  planSha: "7864af46dd70efb71adf94b8e44ab55973ba1e072bccd9c6ca2166efa979766f",
  planArtifactSha:
    "f64d464aa38ee6f8a3c43ccff9288a405a16520e9943e38cde8976597aef7d14",
  rollbackArtifactSha:
    "098035b6eab44ae8a223046a95f6d691fb965995f871ddbcd891c6a91fc3974b",
  patchBoundary:
    "two intentionally reused approved Public change definitions receive citation unions plus refreshed approved-review timestamps; every prior citation is preserved and no semantic definition, source, version, event, or build field is patched",
};
const publicationRecord = {
  transactionId: "eOgq1Ovu5XNUv1qNFVP1OJ",
  receiptSha:
    "57d08f4ffab7e630c4aaf5b285e5af293a582c676984589a4cd53c3455670b0b",
  zeroPlanSha:
    "8d398299c3489506a41a27f7b3d4b5cdc7aba14ff1ddf02d1e5eb0b0b9f3ca27",
  zeroPlanArtifactSha:
    "be76776b0725c6bc600f3a56fa0d194e99459ad400fe5196486bf48f5a11de51",
  zeroRollbackArtifactSha:
    "30f2ae4327f85ddd25a61be178acdd5d5ab3a3c4856060c937bfa6bc006ccd37",
  zeroUnchanged: 2_219,
  coverage: {
    totalVersions: 410,
    fullVersions: 410,
    totalAppearances: 2_052,
    fullAppearances: 499,
    sourceLinkedAppearances: 256,
    timelineOnlyAppearances: 1_297,
    approvedStructuredAppearances: 650,
  },
};

const md = `# Apple iOS 7 point-release prerelease archive batch

## Result

\`${outputName}\` is the approved archive batch for the five defensible
developer milestones attached to the already approved iOS 7.1 public parent.
This generator does not use or rewrite the independent iOS 7.0 major
prerelease batch as content input; it reads that batch’s generated JSON only in
the global collision scan.

- ${events.length} identity-backed event candidates
- ${occurrenceCount} milestone occurrences across
  ${localDefinitions.size} stable definitions
- ${sources.length} declared and used sources with ${citationCount} citation references
- ${evidenceStateCounts.reported} reported and
  ${evidenceStateCounts.corroborated} independently corroborated occurrences;
  zero claims promoted to first-party-confirmed
- zero release overlays, builds, GM routes, or Public event/version payload
- every route is \`editoriallyVerified\`, \`approved\`, and explicitly
  \`isIndexable: true\`

## Exact route closure

| Historical milestone | Route alias | Appearance | Records |
| --- | --- | --- | ---: |
${routeRows}

## Evidence method

1. Every route identity comes from a same-day MacRumors report and is bounded
   to its documented developer distribution date.
2. Contemporary copies of Apple’s private developer notes are credited to
   their preserving publishers and treated as archived evidence, not as
   first-party web pages.
3. A single preserved note copy or publisher observation is \`reported\`.
   \`corroborated\` requires citations from at least two distinct publishers;
   two articles from the same publisher do not satisfy that threshold.
4. Apple’s surviving final SDK document corroborates only cumulative Beta 5
   developer states; it does not manufacture a missing GM or move first
   appearances.
5. Repeated records preserve known-to-fixed transitions and cumulative state
   without changing their stable definitions. All 14 repeated definitions have
   exact expected route/action/inheritance histories.
6. Every claim locator ends with an exact phrase that resolves in the
   SHA-pinned bounded evidence captured for that source.

## Exact gaps and exclusions

- The local point-release seed contains Public-only parents for 7.0.1, 7.0.2,
  7.0.3, 7.0.4, 7.0.6, 7.1, 7.1.1, and 7.1.2.
- The bounded retained corpus establishes externally distributed developer
  milestones only for iOS 7.1 Beta 1 through Beta 5. It does not establish such
  a route for 7.0.1, 7.0.2, 7.0.3, 7.0.4, 7.0.6, 7.1.1, or 7.1.2; that is a
  corpus boundary, not proof that no private or unretained build ever existed.
- [Contemporary 7.0.4 reporting](
  https://www.macrumors.com/2013/11/06/ios-7-0-4-activity-ramping-up-at-apple-ahead-of-next-minor-software-update/)
  explicitly distinguished internal traffic from a registered-developer seed.
- [Contemporary 7.1.2 reporting](
  https://www.macrumors.com/2014/05/22/apple-preparing-ios-7-1-2/)
  anticipated that the minor update would skip developer testing; the public
  release later arrived without a defensible external beta identity.
- The March 4 source records five developer betas and says Apple had not
  supplied a GM as of that report. No GM route is inferred from the March 10
  public build.
- Build strings in journalism help verify milestone identity but are not
  converted into release-build documents.
- Public routes remain owned by the approved \`apple-ios-7.json\` batch.

## Canonical reuse

- \`ios-7-1-siri-listening-voices\` reuses the exact approved Public title,
  canonical summary, and category. Its Beta 5 occurrence is explicitly
  narrowed to regional voices and the staged voice download.
- \`ios-7-1-itunes-radio-discovery-purchasing\` also reuses the exact approved
  definition. Its Beta 5 occurrence covers only the observed album-purchase
  control.
- The early Beta 2 “iOS in the Car” resource and Restrictions references use a
  prerelease-specific key. They are not relabeled as the complete CarPlay
  feature that Apple later shipped.
- Individual accessibility and Calendar deltas use prerelease-specific keys
  instead of inheriting broader final-release aggregates.

## Copyright and attribution controls

- Titles, summaries, occurrence prose, and articles are original synthesis.
- Every factual record has a claim-level citation and locator.
- Each exact locator phrase resolves against the SHA-pinned bounded source
  text; the shortest accepted exact anchor has three normalized tokens.
- Archived note copies name the preserving publisher and identify their
  Apple-developer-note custody in source topics and evidence notes.
- No article body, screenshot, transcript, or long quotation is committed.
- The evidence audit pins raw and normalized states and enforces a maximum
  five-word contiguous overlap ceiling for reader-facing prose. The reviewed
  batch’s observed maximum is four words.

## Source ledger

All declared sources were accessed on ${accessedAt}.

${sourceLedger}

Two additional gap artifacts and one timestamped Apple Developer archive state
are hash-pinned by the evidence audit but are not declared as site sources
because they support route exclusion or custody verification rather than a
candidate occurrence.

## Closure guards

- Exact comparison against all eight local iOS 7 point-release seed records
- Approved/indexable Public ownership assertion against \`apple-ios-7.json\`
- Exact five-route identity, date, and count allowlist
- Explicit no-GM, no-build, no-version-overlay, and no-Public-route-mutation
  boundary
- Route, stable-event, and global change-definition collision scan across
  every other research-batch JSON
- ${occurrenceCount} occurrences resolve to exactly
  ${localDefinitions.size} stable definitions
- Exact approved global-definition reuse for Siri and iTunes Radio
- Complete unique source declaration/use and exact-locator closure
- The separately reviewed iOS 7.0 artifacts are inspected only for collisions
  and are not used as content input or mutated
- Deterministic formatted JSON SHA-256: \`${jsonSha}\`

## Editorial approval and validation record

- provenance: \`editoriallyVerified\`
- editorial status: \`approved\`
- indexing: enabled
- reviewed at: \`${reviewedAt}\`
- independent substantive review: clean after recurrence, cumulative-state,
  evidence-label, source-custody, route-identity, and copyright corrections
- evidence audit: ${verification.rawArtifacts} exact raw artifacts totaling
  ${verification.rawEvidenceBytes.toLocaleString("en-US")} bytes and
  ${verification.normalizedArtifacts} normalized text locks
- repository validation: ${verification.researchBatches} batches and
  ${verification.globalChangeKeys.toLocaleString("en-US")} globally
  consistent change keys
- focused ingestion/manifest tests: ${verification.focusedTests} passed
- full repository suite: ${verification.fullTests} passed
- copyright scan: ${verification.copyrightFields} reader-facing fields;
  maximum overlap ${verification.maximumEditorialOverlapWords} words
- independent live re-fetch: all
  ${verification.independentSourcesFetched} declared sources available;
  ${verification.independentRawExact} raw artifacts matched byte-for-byte,
  ${verification.independentNormalizedExact} normalized article boundaries
  matched exactly, all ${verification.independentTitlesReproduced} titles and
  all ${verification.independentLocatorsReproduced} citation-boundary sets
  reproduced, and all ${verification.independentEvidenceReproduced} evidence
  boundaries passed

## Production dry plan

- status: applied and zero-residual verified on ${accessedAt}
- production dry plan: ${dryRun.creates} creates, ${dryRun.patches} patches,
  and ${dryRun.unchanged} unchanged
- create split: ${dryRun.sourceCreates} sources, ${dryRun.eventCreates} events,
  and ${dryRun.changeCreates} change documents
- patch boundary: ${dryRun.patchBoundary}
- mutation payload: ${dryRun.mutationPayloadBytes.toLocaleString("en-US")} bytes
- manifest content digest: \`${dryRun.contentDigest}\`
- production snapshot digest: \`${dryRun.sourceSnapshotDigest}\`
- production plan SHA: \`${dryRun.planSha}\`
- plan artifact SHA-256: \`${dryRun.planArtifactSha}\`
- rollback artifact SHA-256: \`${dryRun.rollbackArtifactSha}\`
- rollback coverage: all ${dryRun.creates} create IDs and both full restore
  documents
- three consecutive production dry runs reproduced the same plan SHA, counts,
  payload, plan artifact, and rollback artifact

## Publication receipt

- Sanity transaction: \`${publicationRecord.transactionId}\`
- applied plan SHA: \`${dryRun.planSha}\`
- receipt SHA-256: \`${publicationRecord.receiptSha}\`
- immediate post-publication zero plan:
  \`${publicationRecord.zeroPlanSha}\`; zero creates, zero patches,
  ${publicationRecord.zeroUnchanged.toLocaleString("en-US")} unchanged
  documents, and a 16-byte mutation payload
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
Each returned all three archival article sections, every expected structured
change title, References, its first cited source, and an \`index, follow\`
directive. No route returned placeholder copy or a \`noindex\` directive.

| Canonical route | HTTP | Article sections | Expected changes | References | First source | Placeholder | Robots |
| --- | ---: | ---: | ---: | --- | --- | --- | --- |
${routeVerificationRows}

No deployment was performed; domain and deployment work remains scheduled
separately.

## Reproduction

\`\`\`sh
node scripts/research-batches/audit-ios7-point-prerelease.mjs tmp/ios7-point-evidence
node scripts/research-batches/build-apple-ios-7-point-prerelease.mjs
npm run research:validate
node --import tsx --test tests/launch-content-ingestion.test.ts tests/launch-content-manifest.test.ts
npx eslint scripts/research-batches/build-apple-ios-7-point-prerelease.mjs scripts/research-batches/audit-ios7-point-prerelease.mjs
npx prettier --check scripts/research-batches/build-apple-ios-7-point-prerelease.mjs scripts/research-batches/audit-ios7-point-prerelease.mjs scripts/research-batches/apple-ios-7-point-prerelease.json scripts/research-batches/apple-ios-7-point-prerelease.md
npx sanity exec scripts/ingest-launch-content.ts --with-user-token -- --content scripts/research-batches/apple-ios-7-point-prerelease.json
\`\`\`
`;

const formattedMd = await prettier.format(md, { filepath: ledgerName });
writeFileSync(join(here, ledgerName), formattedMd);

console.log(`Wrote ${outputName}`);
console.log(`Wrote ${ledgerName}`);
console.log(`${events.length} events`);
console.log(`${occurrenceCount} occurrences`);
console.log(`${localDefinitions.size} stable changes`);
console.log(`${sources.length} sources`);
console.log(`${citationCount} citation references`);
console.log(`JSON SHA-256 ${jsonSha}`);
