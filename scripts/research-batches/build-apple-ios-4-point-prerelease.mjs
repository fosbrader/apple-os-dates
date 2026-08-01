import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import prettier from "prettier";

const here = dirname(fileURLToPath(import.meta.url));
const outputName = "apple-ios-4-point-prerelease.json";
const ledgerName = "apple-ios-4-point-prerelease.md";
const accessedAt = "2026-07-30";
const reviewedAt = "2026-07-30T13:16:42Z";
const sha256 = (value) => createHash("sha256").update(value).digest("hex");

const preservedIos40Hashes = {
  "build-apple-ios-4-prerelease.mjs":
    "ce025a98788d24c0e78b1a42d44f7f6bf6d0db0146f3b8cd6f2e9f9236eda9a7",
  "audit-ios4-prerelease.mjs":
    "b579e7427e750135591c748423816b1be46a260970a78e847606e2bff1f43555",
  "apple-ios-4-prerelease.json":
    "552baa65718aafb20e8c22586663d4a6ba95ba39a1a043c34b5c10475cc38010",
  "apple-ios-4-prerelease.md":
    "ddda68c0a849260bcf6450d2e3191a5f2a56f930a673d1a3eda1cfa6f0573b38",
};
for (const [name, expectedHash] of Object.entries(preservedIos40Hashes)) {
  assert.equal(
    sha256(readFileSync(join(here, name))),
    expectedHash,
    `${name} remains untouched`,
  );
}

const U = {
  beta41Identity:
    "https://www.cultofmac.com/news/apple-releases-ios-4-1-beta-and-sdk-to-developers",
  beta41Observed:
    "https://www.iclarified.com/10604/apple-releases-ios-41-beta-to-developers-update-x2",
  beta41Signal:
    "https://www.macrumors.com/2010/07/14/ios-4-1-beta-includes-apples-planned-signal-bar-changes/",
  beta412Identity:
    "https://techcrunch.com/2010/07/27/ios-4-1-beta-2-now-available-to-developers/",
  beta412State:
    "https://www.macrumors.com/2010/07/27/apple-releases-iphone-os-4-1-beta-2-to-developers/",
  beta413Identity:
    "https://www.macrumors.com/2010/08/03/apple-releases-ios-4-1-beta-3-and-updated-sdk-to-developers/",
  beta413Observed:
    "https://www.iculture.nl/nieuws/apple-brengt-ios-4-1-beta-3-uit/",
  gm41Apple: "https://developer.apple.com/news/?id=09012010b",
  gm41Features:
    "https://www.macrumors.com/2010/09/01/apple-announces-pending-release-of-ios-4-1-4-2-coming-in-november/",
  beta42Apple:
    "https://www.apple.com/newsroom/2010/09/15Apples-AirPrint-Wireless-Printing-for-iPad-iPhone-iPod-touch-Coming-to-Users-in-November/",
  beta42Identity:
    "https://www.macrumors.com/2010/09/15/apple-releases-first-ios-4-2-beta-for-ipad-iphone-and-ipod-touch/",
  beta42Observed:
    "https://www.macworld.com/article/207734/firstlook_ios42b1.html",
  beta422Identity:
    "https://www.macrumors.com/2010/09/28/ios-4-2-beta-2-and-itunes-10-1-beta-seeded-to-developers/",
  beta422Observed:
    "https://www.macstories.net/news/apple-releases-ios-4-2-beta-2/",
  beta423Identity:
    "https://www.macrumors.com/2010/10/12/apple-seeds-ios-4-2-beta-3-to-developers/",
  beta423Observed:
    "https://www.macrumors.com/2010/10/12/ios-4-2-beta-changes-new-sms-tones-ipad-changes-airplay-missing/",
  gm42Identity:
    "https://www.macrumors.com/2010/11/01/apple-releases-ios-4-2-golden-master-to-developers/",
  gm42Notes:
    "https://www.ithinkdiff.com/apple-released-ios-42-gm-itunes-101-beta-2-developers-today/",
  gm42Second: "https://www.macworld.com/article/208988/ios42_waiting.html",
  gm421: "https://www.macworld.com/article/209096/ios_421.html",
  public421:
    "https://www.apple.com/newsroom/2010/11/22Apples-iOS-4-2-Available-Today-for-iPad-iPhone-iPod-touch/",
  beta43Identity:
    "https://www.macrumors.com/2011/01/12/apple-seeds-ios-4-3-beta-to-developers/",
  beta43DeveloperExcerpt:
    "https://www.engadget.com/2011-01-12-new-ios-beta-released-offering-new-gestures-xcode-updated-with.html",
  beta43SideSwitch:
    "https://www.macrumors.com/2011/01/12/ios-4-3-beta-brings-software-option-for-rotation-lock-or-mute-on-ipad/",
  beta432Identity:
    "https://www.macrumors.com/2011/01/19/apple-releases-second-beta-of-ios-4-3-to-developers/",
  beta432Notes:
    "https://www.macstories.net/news/apple-releases-ios-4-3-beta-2/",
  beta433Identity:
    "https://www.macrumors.com/2011/02/01/apple-seeds-ios-4-3-beta-3-to-developers/",
  beta433State: "https://www.macworld.com/article/210444/ios_4_3-2.html",
  gm43Apple: "https://developer.apple.com/news/?id=03062011a",
  gm43Identity:
    "https://www.macrumors.com/2011/03/03/apple-seeds-ios-4-3-golden-master-to-developers/",
  public43:
    "https://www.apple.com/newsroom/2011/03/02Apple-Introduces-iOS-4-3/",
};

const researchSources = [
  {
    url: U.beta41Identity,
    title: "Apple Releases iOS 4.1 Beta and SDK to Developers",
    publisher: "Cult of Mac",
    sourceClass: "journalism",
    author: "David W. Martin",
    publishedAt: "2010-07-14T23:12:10.000Z",
    topics: ["iOS 4.1", "Beta 1", "release identity"],
  },
  {
    url: U.beta41Observed,
    title: "Apple Releases iOS 4.1 Beta to Developers [Update x2]",
    publisher: "iClarified",
    sourceClass: "journalism",
    author: "Shalom Levytam",
    publishedAt: "2010-07-15T03:43:41.000Z",
    topics: ["iOS 4.1", "Beta 1", "observed changes"],
  },
  {
    url: U.beta41Signal,
    title:
      "iOS 4.1 Beta Includes Apple's Announced Signal Bar Changes, New Modem Firmware",
    publisher: "MacRumors",
    sourceClass: "journalism",
    author: "Arnold Kim",
    publishedAt: "2010-07-14T14:30:00-07:00",
    topics: ["iOS 4.1", "Beta 1", "signal display", "modem"],
  },
  {
    url: U.beta412Identity,
    title: "iOS 4.1 Beta 2 now available to developers",
    publisher: "TechCrunch",
    sourceClass: "journalism",
    author: "Greg Kumparak",
    publishedAt: "2010-07-27T23:50:21.000Z",
    topics: ["iOS 4.1", "Beta 2", "release identity"],
  },
  {
    url: U.beta412State,
    title: "Apple Releases iPhone OS 4.1 Beta 2 to Developers",
    publisher: "MacRumors",
    sourceClass: "journalism",
    author: "Arnold Kim",
    publishedAt: "2010-07-27T18:04:28-07:00",
    topics: ["iOS 4.1", "Beta 2", "known issue"],
  },
  {
    url: U.beta413Identity,
    title: "Apple Releases iOS 4.1 Beta 3 and Updated SDK to Developers",
    publisher: "MacRumors",
    sourceClass: "journalism",
    author: "Eric Slivka",
    publishedAt: "2010-08-03T13:40:43-07:00",
    topics: ["iOS 4.1", "Beta 3", "release identity"],
  },
  {
    url: U.beta413Observed,
    title: "Apple brengt iOS 4.1 beta 3 uit voor ontwikkelaars",
    publisher: "iCulture",
    sourceClass: "journalism",
    author: "Gonny van der Zwaag",
    publishedAt: "2010-08-03T21:11:04.000Z",
    topics: ["iOS 4.1", "Beta 3", "Game Center", "device support"],
  },
  {
    url: U.gm41Apple,
    title: "iOS SDK 4.1 GM Seed Now Available",
    publisher: "Apple Developer",
    sourceClass: "developerDocs",
    author: "Apple",
    publishedAt: "2010-09-01T00:00:00.000Z",
    topics: ["iOS 4.1", "GM", "release identity", "SDK"],
  },
  {
    url: U.gm41Features,
    title: "Apple Announces Pending Release of iOS 4.1, 4.2 Coming in November",
    publisher: "MacRumors",
    sourceClass: "journalism",
    author: "Marianne Schultz",
    publishedAt: "2010-09-01T11:17:33-07:00",
    topics: ["iOS 4.1", "GM", "features", "fixes"],
  },
  {
    url: U.beta42Apple,
    title:
      "Apple’s AirPrint Wireless Printing for iPad, iPhone & iPod touch Coming to Users in November",
    publisher: "Apple Newsroom",
    sourceClass: "firstPartyAnnouncement",
    author: "Apple",
    publishedAt: "2010-09-15T00:00:00.000Z",
    topics: ["iOS 4.2", "Beta 1", "AirPrint", "release identity"],
  },
  {
    url: U.beta42Identity,
    title: "Apple Releases First iOS 4.2 Beta for iPad, iPhone, and iPod Touch",
    publisher: "MacRumors",
    sourceClass: "journalism",
    author: "Eric Slivka",
    publishedAt: "2010-09-15T09:32:16-07:00",
    topics: ["iOS 4.2", "Beta 1", "release identity", "device support"],
  },
  {
    url: U.beta42Observed,
    title: "First Look: iOS 4.2 beta 1",
    publisher: "Macworld",
    sourceClass: "journalism",
    author: "Dan Moren",
    publishedAt: "2010-09-15T10:40:00-07:00",
    topics: ["iOS 4.2", "Beta 1", "observed changes", "iPad"],
  },
  {
    url: U.beta422Identity,
    title: "iOS 4.2 Beta 2 and iTunes 10.1 Beta Seeded to Developers",
    publisher: "MacRumors",
    sourceClass: "journalism",
    author: "Eric Slivka",
    publishedAt: "2010-09-28T16:21:00-07:00",
    topics: ["iOS 4.2", "Beta 2", "release identity"],
  },
  {
    url: U.beta422Observed,
    title: "Apple Releases iOS 4.2 Beta 2, Here’s What’s New",
    publisher: "MacStories",
    sourceClass: "journalism",
    author: "Federico Viticci",
    publishedAt: "2010-09-28T23:14:39.000Z",
    topics: ["iOS 4.2", "Beta 2", "observed changes", "developer notes"],
  },
  {
    url: U.beta423Identity,
    title: "Apple Seeds iOS 4.2 Beta 3 and iTunes 10.1 Beta 2 to Developers",
    publisher: "MacRumors",
    sourceClass: "journalism",
    author: "Eric Slivka",
    publishedAt: "2010-10-12T12:43:20-07:00",
    topics: ["iOS 4.2", "Beta 3", "release identity"],
  },
  {
    url: U.beta423Observed,
    title:
      "iOS 4.2 Beta 3 Changes: New SMS Tones, iPad Changes, AirPlay Missing?",
    publisher: "MacRumors",
    sourceClass: "journalism",
    author: "Arnold Kim",
    publishedAt: "2010-10-12T15:44:59-07:00",
    topics: ["iOS 4.2", "Beta 3", "observed changes"],
  },
  {
    url: U.gm42Identity,
    title: "Apple Releases iOS 4.2 Golden Master to Developers",
    publisher: "MacRumors",
    sourceClass: "journalism",
    author: "Arnold Kim",
    publishedAt: "2010-11-01T16:54:36-07:00",
    topics: ["iOS 4.2", "GM", "release identity", "AirPlay"],
  },
  {
    url: U.gm42Notes,
    title:
      "Apple Has Released iOS 4.2 GM & iTunes 10.1 Beta 2 To Developers Today!",
    publisher: "iThinkDifferent",
    sourceClass: "archive",
    author: "Apple",
    publishedAt: "2010-11-02T12:40:57+04:00",
    topics: ["iOS 4.2", "GM", "Apple Developer release notes", "archive"],
  },
  {
    url: U.gm42Second,
    title: "iOS 4.2 arrival near? All signs point to yes",
    publisher: "Macworld",
    sourceClass: "journalism",
    author: "Dan Moren",
    publishedAt: "2010-11-12T06:39:00-08:00",
    topics: ["iOS 4.2", "GM Seed 2", "iPad", "Wi-Fi"],
  },
  {
    url: U.gm421,
    title: "Apple releases iOS 4.2.1 GM to developers",
    publisher: "Macworld",
    sourceClass: "journalism",
    author: "Serenity Caldwell",
    publishedAt: "2010-11-18T05:15:00-08:00",
    topics: ["iOS 4.2.1", "GM", "release identity", "known issue"],
  },
  {
    url: U.public421,
    title: "Apple’s iOS 4.2 Available Today for iPad, iPhone & iPod touch",
    publisher: "Apple Newsroom",
    sourceClass: "firstPartyAnnouncement",
    author: "Apple",
    publishedAt: "2010-11-22T00:00:00Z",
    topics: ["iOS", "4.2", "4.2.1", "features", "availability"],
  },
  {
    url: U.beta43Identity,
    title:
      "Apple Seeds iOS 4.3 Beta to Developers: Personal Hotspot, AirPlay Video Streaming, New iPad Gestures",
    publisher: "MacRumors",
    sourceClass: "journalism",
    author: "Eric Slivka",
    publishedAt: "2011-01-12T13:03:41-08:00",
    topics: ["iOS 4.3", "Beta 1", "release identity", "observed changes"],
  },
  {
    url: U.beta43DeveloperExcerpt,
    title:
      "New iOS beta released offering new gestures, Xcode updated with AirPlay services for apps",
    publisher: "Engadget",
    sourceClass: "journalism",
    author: "Victor Agreda Jr.",
    publishedAt: "2011-01-12T21:12:00.000Z",
    topics: ["iOS 4.3", "Beta 1", "Apple Developer excerpt", "AirPlay"],
  },
  {
    url: U.beta43SideSwitch,
    title:
      "iOS 4.3 Beta Brings Software Option for Rotation Lock or Mute on iPad",
    publisher: "MacRumors",
    sourceClass: "journalism",
    author: "Eric Slivka",
    publishedAt: "2011-01-12T13:47:13-08:00",
    topics: ["iOS 4.3", "Beta 1", "iPad side switch"],
  },
  {
    url: U.beta432Identity,
    title: "Apple Releases Second Beta of iOS 4.3 to Developers",
    publisher: "MacRumors",
    sourceClass: "journalism",
    author: "Eric Slivka",
    publishedAt: "2011-01-19T12:57:49-08:00",
    topics: ["iOS 4.3", "Beta 2", "release identity", "developer guidance"],
  },
  {
    url: U.beta432Notes,
    title: "Apple Releases iOS 4.3 Beta 2, Here’s What’s New",
    publisher: "MacStories",
    sourceClass: "archive",
    author: "Apple",
    publishedAt: "2011-01-19T21:11:31.000Z",
    topics: ["iOS 4.3", "Beta 2", "Apple Developer release notes", "archive"],
  },
  {
    url: U.beta433Identity,
    title: "Apple Seeds iOS 4.3 Beta 3 to Developers",
    publisher: "MacRumors",
    sourceClass: "journalism",
    author: "Eric Slivka",
    publishedAt: "2011-02-01T10:58:23-08:00",
    topics: ["iOS 4.3", "Beta 3", "release identity", "observed changes"],
  },
  {
    url: U.beta433State,
    title: "Apple releases iOS 4.3 beta 3 for developers",
    publisher: "Macworld",
    sourceClass: "journalism",
    author: "David Chartier",
    publishedAt: "2011-02-01T04:00:00-08:00",
    topics: ["iOS 4.3", "Beta 3", "carried state", "developer testing"],
  },
  {
    url: U.gm43Apple,
    title: "iOS SDK 4.3 GM Seed Now Available",
    publisher: "Apple Developer",
    sourceClass: "developerDocs",
    author: "Apple",
    publishedAt: "2011-03-03T00:00:00.000Z",
    topics: ["iOS 4.3", "GM", "release identity", "features"],
  },
  {
    url: U.gm43Identity,
    title: "Apple Seeds iOS 4.3 Golden Master to Developers",
    publisher: "MacRumors",
    sourceClass: "journalism",
    author: "Eric Slivka",
    publishedAt: "2011-03-03T11:25:19-08:00",
    topics: ["iOS 4.3", "GM", "release identity", "device support"],
  },
  {
    url: U.public43,
    title: "Apple Introduces iOS 4.3",
    publisher: "Apple Newsroom",
    sourceClass: "firstPartyAnnouncement",
    author: "Apple",
    publishedAt: "2011-03-02T00:00:00Z",
    topics: ["iOS", "4.3", "features", "planned availability"],
  },
];

const cite = (url, locator, note) => ({
  url,
  locator,
  ...(note ? { note } : {}),
});
const identityNote = "Contemporaneous milestone identity and timing.";
const observedNote =
  "Contemporaneous observation; publisher prose is not reused.";
const appleNote = "First-party milestone or feature evidence.";
const archiveNote =
  "Apple-authored developer material preserved by the credited publisher.";

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
    summary: summary || canonicalSummary,
    documentedStatus,
    evidenceState,
    verificationMethod,
    citations,
  };
};
const reuse = (key, fields) =>
  occurrence({ key, ...definitions.get(key), ...fields });
const observed = (input) =>
  occurrence({
    inheritance: "delta",
    documentedStatus: "undocumented",
    evidenceState: "reported",
    verificationMethod:
      "Matched the bounded observation in the retained contemporaneous report and rewrote it independently.",
    ...input,
  });
const corroborated = (input) =>
  occurrence({
    inheritance: "delta",
    documentedStatus: "undocumented",
    evidenceState: "corroborated",
    verificationMethod:
      "Reconciled the narrow observation across contemporaneous sources without carrying over publisher wording.",
    ...input,
  });
const documented = (input) =>
  occurrence({
    inheritance: "delta",
    documentedStatus: "documented",
    evidenceState: "confirmed",
    verificationMethod:
      "Matched the bounded fact in first-party material and expressed the result as original synthesis.",
    ...input,
  });
const archived = (input) =>
  occurrence({
    inheritance: "delta",
    documentedStatus: "documented",
    evidenceState: "corroborated",
    verificationMethod:
      "Matched the bounded fact in the credited copy of Apple developer material and rewrote it independently.",
    ...input,
  });

const ledgerOnlyRouteSpecs = [
  {
    versionId: "version-ios-4-2-1",
    version: "4.2.1",
    alias: "4-2-gm-seed-2-ipad",
    label: "iOS 4.2 GM Seed 2 (iPad)",
    channel: "goldenMaster",
    date: "2010-11-12",
    sequence: 5,
    isRevision: true,
    identityUrls: [U.gm42Second],
    disposition:
      "Timeline ledger only; the exact iPad revision is supported, but its possible Wi-Fi rationale is not a verified route-specific delta.",
  },
  {
    versionId: "version-ios-4-3",
    version: "4.3",
    alias: "beta-3",
    label: "Beta 3",
    channel: "developerBeta",
    date: "2011-02-01",
    sequence: 3,
    isRevision: false,
    identityUrls: [U.beta433Identity, U.beta433State],
    disposition:
      "Timeline ledger only; the reported download-cancel behavior explicitly predates Beta 3.",
  },
];

const eventSpecs = [
  {
    versionId: "version-ios-4-1",
    version: "4.1",
    alias: "beta-1",
    label: "Beta 1",
    channel: "developerBeta",
    date: "2010-07-14",
    sequence: 1,
    identityUrls: [U.beta41Identity, U.beta41Observed],
    releaseText:
      "Two contemporaneous reports place the first iOS 4.1 developer seed on July 14. The detailed observation page was posted just after midnight in its displayed locale, so this route retains the distribution date rather than its later page date.",
    boundaryText:
      "No complete Apple-hosted Beta 1 note body survives in the audited set. The eight records below are observed interface and compatibility changes, not a claim to reproduce the private document.",
    changes: [
      corroborated({
        key: "ios-4-1-beta1-signal-display-scale",
        title: "Signal bars adopted a revised display scale",
        canonicalSummary:
          "The seed changed the mapping between measured cellular strength and the visible bars while enlarging the shorter indicators.",
        category: "behavior",
        action: "changed",
        citations: [
          cite(U.beta41Observed, "Changes — signal bars", observedNote),
          cite(
            U.beta41Signal,
            "Signal mapping and lower-bar size",
            observedNote,
          ),
        ],
      }),
      corroborated({
        key: "ios-4-1-beta1-modem-firmware",
        title: "The cellular baseband firmware advanced",
        canonicalSummary:
          "The seed carried baseband firmware 02.07.01 for the device’s cellular radio.",
        category: "compatibility",
        action: "changed",
        citations: [
          cite(U.beta41Observed, "Changes — new baseband", observedNote),
          cite(U.beta41Signal, "Modem firmware revision", observedNote),
        ],
      }),
      observed({
        key: "ios-4-1-beta1-game-center-redesign",
        title: "Game Center returned with a revised design",
        canonicalSummary:
          "The developer seed restored Game Center with a changed visual presentation.",
        category: "enhancement",
        action: "changed",
        citations: [
          cite(U.beta41Observed, "Changes — Game Center", observedNote),
        ],
      }),
      observed({
        key: "ios-4-1-beta1-camera-landscape-controls",
        title: "Camera controls moved in landscape",
        canonicalSummary:
          "Rotating the camera interface repositioned its flash and camera-selection controls.",
        category: "behavior",
        action: "changed",
        citations: [
          cite(
            U.beta41Observed,
            "Changes — camera controls in landscape",
            observedNote,
          ),
        ],
      }),
      observed({
        key: "ios-4-1-beta1-favorite-call-kind",
        title: "Favorites distinguished voice and FaceTime",
        canonicalSummary:
          "Adding a contact favorite exposed a choice between a voice call and a FaceTime connection.",
        category: "enhancement",
        action: "introduced",
        citations: [
          cite(U.beta41Observed, "Changes — favorite call type", observedNote),
        ],
      }),
      observed({
        key: "ios-4-1-beta1-spell-check-control",
        title: "Spell checking gained an off switch",
        canonicalSummary:
          "Settings included a control for disabling automatic spelling checks.",
        category: "enhancement",
        action: "introduced",
        citations: [
          cite(U.beta41Observed, "Changes — spell-check setting", observedNote),
        ],
      }),
      observed({
        key: "ios-4-1-beta1-parental-controls",
        title: "Restrictions covered FaceTime and Game Center",
        canonicalSummary:
          "Parental controls added separate restrictions for FaceTime access and multiplayer gaming.",
        category: "enhancement",
        action: "introduced",
        citations: [
          cite(U.beta41Observed, "Changes — parental controls", observedNote),
        ],
      }),
      observed({
        key: "ios-4-1-beta1-bluetooth-avrcp",
        title: "Bluetooth media controls expanded",
        canonicalSummary:
          "AVRCP support allowed compatible accessories to control more playback functions than volume alone.",
        category: "compatibility",
        action: "introduced",
        citations: [
          cite(U.beta41Observed, "Changes — Bluetooth AVRCP", observedNote),
        ],
      }),
    ],
  },
  {
    versionId: "version-ios-4-1",
    version: "4.1",
    alias: "beta-2",
    label: "Beta 2",
    channel: "developerBeta",
    date: "2010-07-27",
    sequence: 2,
    identityUrls: [U.beta412Identity, U.beta412State],
    releaseText:
      "TechCrunch and MacRumors independently identify the second iOS 4.1 seed on July 27. Reporting described a maintenance-focused build rather than a feature-bearing revision.",
    boundaryText:
      "No retained release-note body supports a granular fix list. One unresolved, specifically reported behavior is structured; generic statements about minor corrections remain prose context.",
    changes: [
      observed({
        key: "ios-4-1-proximity-sensor-reliability",
        title: "iPhone 4 proximity-sensor reliability",
        canonicalSummary:
          "The proximity sensor should suppress accidental screen input while an iPhone 4 is held to the face during a call.",
        category: "bugFix",
        action: "knownIssue",
        summary:
          "Contemporaneous testing still found unintended display activation during iPhone 4 calls in Beta 2.",
        citations: [
          cite(U.beta412State, "Proximity sensor not fixed", observedNote),
        ],
      }),
    ],
  },
  {
    versionId: "version-ios-4-1",
    version: "4.1",
    alias: "beta-3",
    label: "Beta 3",
    channel: "developerBeta",
    date: "2010-08-03",
    sequence: 3,
    identityUrls: [U.beta413Identity, U.beta413Observed],
    releaseText:
      "The third iOS 4.1 seed and its updated SDK appeared on August 3, one week after Beta 2. Both retained reports agree on the milestone identity.",
    boundaryText:
      "The identity report says no detailed delta was available. A second report isolates one device-support change, which is retained as reported rather than promoted to first-party confirmation.",
    changes: [
      observed({
        key: "ios-4-1-beta3-game-center-device-removal",
        title: "Game Center dropped two older devices",
        canonicalSummary:
          "The beta no longer exposed Game Center on iPhone 3G or the second-generation iPod touch.",
        category: "compatibility",
        action: "removed",
        citations: [
          cite(
            U.beta413Observed,
            "Game Center support on older hardware",
            observedNote,
          ),
        ],
      }),
    ],
  },
  {
    versionId: "version-ios-4-1",
    version: "4.1",
    alias: "gm",
    label: "GM",
    channel: "goldenMaster",
    date: "2010-09-01",
    sequence: 4,
    identityUrls: [U.gm41Apple, U.gm41Features],
    releaseText:
      "Apple’s developer notice confirms the iOS 4.1 GM seed on September 1. The same-day product presentation supplies a bounded account of the candidate’s user-facing feature and repair state.",
    boundaryText:
      "The Apple developer page establishes identity but does not expose the linked private notes. The seven presentation-derived records are cumulative release-wide state, not asserted Beta 3-to-GM deltas.",
    changes: [
      reuse("ios-4-1-proximity-sensor-reliability", {
        action: "fixed",
        inheritance: "cumulative",
        documentedStatus: "undocumented",
        evidenceState: "reported",
        verificationMethod:
          "Reconciled the Beta 2 report with the release-wide repair state announced on the GM date without claiming the fix first landed in GM.",
        summary:
          "The release-wide iOS 4.1 presentation said the unintended-call-input problem would be corrected.",
        citations: [
          cite(U.gm41Features, "Proximity-sensor correction", observedNote),
        ],
      }),
      observed({
        key: "ios-4-1-gm-bluetooth-fix",
        title: "Bluetooth reliability received repairs",
        canonicalSummary:
          "The candidate was announced with corrections for previously reported Bluetooth behavior.",
        category: "bugFix",
        action: "fixed",
        inheritance: "cumulative",
        citations: [cite(U.gm41Features, "Bluetooth correction", observedNote)],
      }),
      observed({
        key: "ios-4-1-gm-iphone-3g-performance",
        title: "iPhone 3G performance was addressed",
        canonicalSummary:
          "The GM state included work aimed at the severe slowdowns reported on iPhone 3G.",
        category: "bugFix",
        action: "fixed",
        inheritance: "cumulative",
        citations: [
          cite(
            U.gm41Features,
            "iPhone 3G performance correction",
            observedNote,
          ),
        ],
      }),
      observed({
        key: "ios-4-1-gm-hdr-photos",
        title: "Camera gained HDR capture",
        canonicalSummary:
          "Supported hardware could combine differently exposed frames into one high-dynamic-range photograph.",
        category: "feature",
        action: "introduced",
        inheritance: "cumulative",
        citations: [
          cite(U.gm41Features, "High-dynamic-range photography", observedNote),
        ],
      }),
      observed({
        key: "ios-4-1-gm-hd-video-upload",
        title: "HD video could upload over Wi-Fi",
        canonicalSummary:
          "The candidate enabled direct high-definition video uploads while connected to Wi-Fi.",
        category: "feature",
        action: "introduced",
        inheritance: "cumulative",
        citations: [cite(U.gm41Features, "HD video upload", observedNote)],
      }),
      observed({
        key: "ios-4-1-gm-tv-rentals",
        title: "TV episode rentals joined the device",
        canonicalSummary:
          "The software added access to rented television episodes through Apple’s media storefront.",
        category: "feature",
        action: "introduced",
        inheritance: "cumulative",
        citations: [cite(U.gm41Features, "TV rentals", observedNote)],
      }),
      observed({
        key: "ios-4-1-gm-game-center",
        title: "Game Center reached its launch-ready form",
        canonicalSummary:
          "The candidate carried multiplayer invitations, scoreboards, achievements, and friend discovery into the release boundary.",
        category: "feature",
        action: "introduced",
        inheritance: "cumulative",
        citations: [cite(U.gm41Features, "Game Center debut", observedNote)],
      }),
    ],
  },
  {
    versionId: "version-ios-4-2-1",
    version: "4.2.1",
    alias: "beta-1",
    label: "iOS 4.2 Beta 1",
    channel: "developerBeta",
    date: "2010-09-15",
    sequence: 1,
    identityUrls: [U.beta42Apple, U.beta42Identity, U.beta42Observed],
    releaseText:
      "Apple announced an AirPrint beta for developers on September 15, while two same-day reports identify the accompanying software as iOS 4.2 Beta 1. The local public parent is 4.2.1; this page preserves the original 4.2 branding.",
    boundaryText:
      "The first-party announcement covers AirPrint. Other records are bounded observations from a hands-on Beta 1 review and are labeled accordingly rather than presented as Apple’s private notes.",
    changes: [
      documented({
        key: "ios-4-2-beta1-airprint-discovery",
        title: "AirPrint found printers on the local network",
        canonicalSummary:
          "The printing architecture located supported devices over the current network without manual discovery.",
        category: "feature",
        action: "introduced",
        citations: [cite(U.beta42Apple, "AirPrint local discovery", appleNote)],
      }),
      documented({
        key: "ios-4-2-beta1-driverless-printing",
        title: "Printing avoided device-side drivers",
        canonicalSummary:
          "The beta’s printing path did not require users to install printer drivers or extra software on iOS.",
        category: "enhancement",
        action: "introduced",
        citations: [cite(U.beta42Apple, "AirPrint setup model", appleNote)],
      }),
      documented({
        key: "ios-4-2-airprint-shared-printer-path",
        title: "AirPrint through shared desktop printers",
        canonicalSummary:
          "iOS devices could send print jobs to printers shared by a Mac or PC during the prerelease cycle.",
        category: "compatibility",
        action: "introduced",
        citations: [
          cite(U.beta42Apple, "Shared Mac or PC printing", appleNote),
        ],
      }),
      corroborated({
        key: "ios-4-2-beta1-print-enabled-apps",
        title: "Safari, Mail, and Photos exposed printing",
        canonicalSummary:
          "The first seed placed print commands in the browser, email client, and photo library.",
        category: "feature",
        action: "introduced",
        citations: [
          cite(U.beta42Apple, "Documents and photos", appleNote),
          cite(
            U.beta42Observed,
            "AirPrint controls by application",
            observedNote,
          ),
        ],
      }),
      observed({
        key: "ios-4-2-beta1-airplay",
        title: "AirPlay streamed media to nearby receivers",
        canonicalSummary:
          "The software could direct music or video to compatible playback hardware on the same network.",
        category: "feature",
        action: "introduced",
        citations: [
          cite(U.beta42Observed, "AirPlay destination menu", observedNote),
        ],
      }),
      observed({
        key: "ios-4-2-beta1-notes-fonts",
        title: "Notes offered alternative typefaces",
        canonicalSummary:
          "Users could replace the existing Notes typeface with one of two additional choices.",
        category: "enhancement",
        action: "introduced",
        citations: [cite(U.beta42Observed, "Notes font choices", observedNote)],
      }),
      observed({
        key: "ios-4-2-beta1-notes-default-account",
        title: "Notes gained a default-account setting",
        canonicalSummary:
          "A new preference selected which account received newly created notes.",
        category: "enhancement",
        action: "introduced",
        citations: [
          cite(U.beta42Observed, "Notes default account", observedNote),
        ],
      }),
      observed({
        key: "ios-4-2-beta1-ipad-side-switch-mute",
        title: "The iPad side switch became a mute control",
        canonicalSummary:
          "Beta 1 reassigned the tablet’s physical orientation switch to audio muting.",
        category: "behavior",
        action: "changed",
        citations: [
          cite(U.beta42Observed, "iPad hardware switch behavior", observedNote),
        ],
      }),
      observed({
        key: "ios-4-2-beta1-software-orientation-lock",
        title: "Orientation locking moved into software",
        canonicalSummary:
          "The iPad multitasking controls included a screen-orientation lock usable in either layout.",
        category: "behavior",
        action: "changed",
        citations: [
          cite(
            U.beta42Observed,
            "Multitasking shelf orientation control",
            observedNote,
          ),
        ],
      }),
      observed({
        key: "ios-4-2-beta1-brightness-slider",
        title: "The multitasking shelf gained brightness control",
        canonicalSummary:
          "A slider beside playback controls adjusted the iPad display without opening Settings.",
        category: "enhancement",
        action: "introduced",
        citations: [
          cite(U.beta42Observed, "Multitasking shelf brightness", observedNote),
        ],
      }),
      observed({
        key: "ios-4-2-beta1-safari-find-page",
        title: "Safari added in-page search",
        canonicalSummary:
          "A search-box result could locate and step through matching text in the open webpage.",
        category: "feature",
        action: "introduced",
        citations: [
          cite(U.beta42Observed, "Safari search within page", observedNote),
        ],
      }),
      observed({
        key: "ios-4-2-beta1-ipad-multitasking",
        title: "iPad adopted the iOS multitasking services",
        canonicalSummary:
          "Eligible tablet apps could use the established background modes and appear in a fast-switching shelf.",
        category: "feature",
        action: "introduced",
        citations: [
          cite(U.beta42Identity, "iOS 4 features on iPad", identityNote),
          cite(U.beta42Observed, "iPad multitasking behavior", observedNote),
        ],
      }),
      observed({
        key: "ios-4-2-beta1-ipad-folders",
        title: "iPad folders held more applications",
        canonicalSummary:
          "The tablet gained Home Screen folders sized for as many as twenty application icons.",
        category: "feature",
        action: "introduced",
        citations: [cite(U.beta42Observed, "iPad folders", observedNote)],
      }),
      observed({
        key: "ios-4-2-beta1-ipad-mail",
        title: "iPad Mail adopted the unified message model",
        canonicalSummary:
          "The tablet email client combined inboxes, grouped conversations, and improved list navigation.",
        category: "enhancement",
        action: "introduced",
        citations: [
          cite(U.beta42Observed, "Mail changes on iPad", observedNote),
        ],
      }),
      observed({
        key: "ios-4-2-beta1-ipad-game-center",
        title: "Game Center arrived on iPad",
        canonicalSummary:
          "The tablet received a screen-sized Game Center interface with friends, games, scores, and achievements.",
        category: "feature",
        action: "introduced",
        citations: [
          cite(U.beta42Observed, "Game Center on iPad", observedNote),
        ],
      }),
      observed({
        key: "ios-4-2-beta1-exchange-calendar-invites",
        title: "Exchange invitations appeared in iPad Calendar",
        canonicalSummary:
          "Calendar could display event invitations received through a Microsoft Exchange account.",
        category: "compatibility",
        action: "introduced",
        citations: [
          cite(U.beta42Observed, "Calendar Exchange invitations", observedNote),
        ],
      }),
      observed({
        key: "ios-4-2-beta1-safari-page-count",
        title: "Safari showed its open-page count",
        canonicalSummary:
          "The browser’s page control displayed how many tabs were currently open.",
        category: "enhancement",
        action: "introduced",
        citations: [
          cite(U.beta42Observed, "Safari page indicator", observedNote),
        ],
      }),
    ],
  },
  {
    versionId: "version-ios-4-2-1",
    version: "4.2.1",
    alias: "beta-2",
    label: "iOS 4.2 Beta 2",
    channel: "developerBeta",
    date: "2010-09-28",
    sequence: 2,
    identityUrls: [U.beta422Identity, U.beta422Observed],
    releaseText:
      "Apple distributed iOS 4.2 Beta 2 on September 28 with its SDK, Xcode 3.2.5, and an iTunes 10.1 test build. The milestone remained branded 4.2 although the eventual public parent is cataloged as 4.2.1.",
    boundaryText:
      "MacStories retained a mixture of developer-note details and hands-on observations. Each record identifies that custody; performance impressions and visual speculation are excluded.",
    changes: [
      archived({
        key: "ios-4-2-beta2-airprint-printer-list",
        title: "AirPrint documented three direct-print families",
        canonicalSummary:
          "Beta 2 named three supported HP ePrint product lines for direct wireless printing.",
        category: "compatibility",
        action: "changed",
        citations: [
          cite(U.beta422Observed, "Printing — supported printers", archiveNote),
        ],
      }),
      reuse("ios-4-2-airprint-shared-printer-path", {
        action: "changed",
        inheritance: "delta",
        documentedStatus: "documented",
        evidenceState: "corroborated",
        verificationMethod:
          "Matched the Beta 2 developer-note copy to the shared-printer path announced with Beta 1 and recorded its host-software requirements.",
        summary:
          "Beta 2 testing required a Mac running the matching macOS beta or a PC running the matching iTunes beta.",
        citations: [
          cite(
            U.beta422Observed,
            "Printing — shared-printer requirements",
            archiveNote,
          ),
        ],
      }),
      archived({
        key: "ios-4-2-beta2-printer-simulator-launch",
        title: "Printer Simulator needed a direct launch",
        canonicalSummary:
          "The menu command failed, while opening the simulator application itself provided the test environment.",
        category: "knownIssue",
        action: "knownIssue",
        citations: [
          cite(U.beta422Observed, "Printing — PrinterSimulator", archiveNote),
        ],
      }),
      observed({
        key: "ios-4-2-beta2-folder-webclip-restore",
        title: "Beta 1 folders and web clips restored",
        canonicalSummary:
          "A Beta 1 backup returned its Home Screen folders and saved website shortcuts under Beta 2.",
        category: "bugFix",
        action: "fixed",
        citations: [
          cite(
            U.beta422Observed,
            "Restored Beta 1 folders and webclips",
            observedNote,
          ),
        ],
      }),
      corroborated({
        key: "ios-4-2-beta2-multitasking-animation",
        title: "App switching used a refined transition",
        canonicalSummary:
          "The active application moved into the multitasking view with an altered depth effect.",
        category: "enhancement",
        action: "changed",
        citations: [
          cite(
            U.beta422Identity,
            "Updated multitasking animation",
            observedNote,
          ),
          cite(U.beta422Observed, "Multitasking transition", observedNote),
        ],
      }),
      observed({
        key: "ios-4-2-beta2-game-center-indicator",
        title: "App Store marked Game Center support",
        canonicalSummary:
          "Store listings gained a visual indicator for applications that worked with Game Center.",
        category: "enhancement",
        action: "introduced",
        citations: [
          cite(
            U.beta422Observed,
            "Game Center App Store indicator",
            observedNote,
          ),
        ],
      }),
      observed({
        key: "ios-4-2-beta2-youtube-upload-options",
        title: "YouTube uploads gained more controls",
        canonicalSummary:
          "The upload workflow exposed additional publication options for videos sent to YouTube.",
        category: "enhancement",
        action: "introduced",
        citations: [
          cite(U.beta422Observed, "YouTube upload controls", observedNote),
        ],
      }),
    ],
  },
  {
    versionId: "version-ios-4-2-1",
    version: "4.2.1",
    alias: "beta-3",
    label: "iOS 4.2 Beta 3",
    channel: "developerBeta",
    date: "2010-10-12",
    sequence: 3,
    identityUrls: [U.beta423Identity, U.beta423Observed],
    releaseText:
      "The third iOS 4.2 seed arrived on October 12 with a matching SDK and a second iTunes 10.1 beta. The later 4.2.1 public name does not retroactively replace this milestone’s 4.2 identity.",
    boundaryText:
      "The identity report had no detailed note body. A companion observation article supplies three narrow deltas; its broad performance, bug-fix, and unspecified visual characterizations are not converted into records.",
    changes: [
      observed({
        key: "ios-4-2-beta3-sms-tones",
        title: "Messages gained additional alert tones",
        canonicalSummary:
          "The seed added sound choices for incoming text messages.",
        category: "enhancement",
        action: "introduced",
        citations: [cite(U.beta423Observed, "New SMS tones", observedNote)],
      }),
      observed({
        key: "ios-4-2-beta3-ipad-alert-switches",
        title: "iPad exposed per-alert sound switches",
        canonicalSummary:
          "Settings could independently silence selected mail, calendar, lock, and keyboard sounds.",
        category: "enhancement",
        action: "introduced",
        citations: [
          cite(U.beta423Observed, "iPad alert-sound controls", observedNote),
        ],
      }),
      observed({
        key: "ios-4-2-beta3-airplay-removal",
        title: "AirPlay disappeared from some locations",
        canonicalSummary:
          "Several previously visible AirPlay entry points were absent in Beta 3, with later restoration still possible.",
        category: "removal",
        action: "removed",
        citations: [
          cite(
            U.beta423Observed,
            "AirPlay missing from several places",
            observedNote,
          ),
        ],
      }),
    ],
  },
  {
    versionId: "version-ios-4-2-1",
    version: "4.2.1",
    alias: "4-2-gm",
    label: "iOS 4.2 GM",
    channel: "goldenMaster",
    date: "2010-11-01",
    sequence: 4,
    identityUrls: [U.gm42Identity, U.gm42Notes],
    releaseText:
      "Apple issued the original iOS 4.2 GM on November 1. A credited publisher retained a short Apple-authored developer-note excerpt, while a separate identity report records the same milestone.",
    boundaryText:
      "The surviving excerpt is selective rather than a complete note body. Its release-wide SDK states are cumulative unless the evidence establishes a transition from an earlier seed; later GM identities remain distinct in the timeline.",
    changes: [
      archived({
        key: "ios-4-2-gm-latest-sdk-setting",
        title: "Xcode added a moving latest-SDK target",
        canonicalSummary:
          "Projects could select a base target that followed the newest installed iOS SDK automatically.",
        category: "developerApi",
        action: "introduced",
        inheritance: "cumulative",
        citations: [
          cite(U.gm42Notes, "Xcode — Latest SDK setting", archiveNote),
        ],
      }),
      archived({
        key: "ios-4-2-gm-ipad-switch-audio-semantics",
        title: "iPad apps had to treat the switch as mute",
        canonicalSummary:
          "Applications targeting iPad were advised to account for the physical switch’s new audio role.",
        category: "compatibility",
        action: "changed",
        inheritance: "cumulative",
        citations: [
          cite(U.gm42Notes, "Audio — iPad switch behavior", archiveNote),
        ],
      }),
      archived({
        key: "ios-4-2-gm-calendar-ics-import",
        title: "Calendar accepted ICS event files",
        canonicalSummary:
          "Applications could hand calendar files to the system for direct event import.",
        category: "developerApi",
        action: "introduced",
        inheritance: "cumulative",
        citations: [cite(U.gm42Notes, "Calendar — ICS import", archiveNote)],
      }),
      archived({
        key: "ios-4-2-gm-gamekit-friend-composer",
        title: "GameKit added a friend-request composer",
        canonicalSummary:
          "Applications gained a system view controller for starting Game Center friend invitations.",
        category: "developerApi",
        action: "introduced",
        inheritance: "cumulative",
        citations: [
          cite(U.gm42Notes, "GameKit — friend-request controller", archiveNote),
        ],
      }),
      archived({
        key: "ios-4-2-gm-gamekit-modal-presentation",
        title: "GameKit controllers required modal presentation",
        canonicalSummary:
          "Leaderboard, achievement, matchmaking, and friend interfaces had to be shown modally.",
        category: "compatibility",
        action: "changed",
        inheritance: "cumulative",
        citations: [
          cite(U.gm42Notes, "GameKit — modal presentation", archiveNote),
        ],
      }),
      archived({
        key: "ios-4-2-gm-mapkit-annotation-views",
        title: "MapKit made annotation views visibility-dependent",
        canonicalSummary:
          "Applications could no longer infer missing map data from an annotation view that was not currently displayed.",
        category: "developerApi",
        action: "changed",
        inheritance: "cumulative",
        citations: [
          cite(
            U.gm42Notes,
            "MapKit — conditional annotation views",
            archiveNote,
          ),
        ],
      }),
      reuse("ios-4-2-airprint-shared-printer-path", {
        action: "removed",
        inheritance: "delta",
        documentedStatus: "documented",
        evidenceState: "corroborated",
        verificationMethod:
          "Compared the shared Mac-or-PC path documented in Beta 1 and Beta 2 with the GM note limiting printing to direct AirPrint devices.",
        summary:
          "The GM note listed only direct AirPrint printer families, removing the earlier shared Mac-or-PC path from the documented candidate state.",
        citations: [
          cite(
            U.gm42Notes,
            "Printing — supported AirPrint devices",
            archiveNote,
          ),
        ],
      }),
      observed({
        key: "ios-4-2-gm-youtube-airplay-returned",
        title: "AirPlay returned to YouTube playback",
        canonicalSummary:
          "The GM restored an AirPlay destination that had been missing from the prior beta’s YouTube path.",
        category: "bugFix",
        action: "fixed",
        citations: [
          cite(U.gm42Identity, "AirPlay returned in YouTube", observedNote),
        ],
      }),
    ],
  },
  {
    versionId: "version-ios-4-2-1",
    version: "4.2.1",
    alias: "gm",
    label: "GM",
    channel: "goldenMaster",
    date: "2010-11-18",
    sequence: 6,
    identityUrls: [U.gm421, U.public421],
    releaseText:
      "Apple moved the candidate’s displayed version to iOS 4.2.1 on November 18 and distributed it for every supported device. Four days later Apple marketed the public package as iOS 4.2, preserving the historical naming mismatch.",
    boundaryText:
      "No complete 4.2.1 GM note body survives here. Two developer-facing states from the contemporaneous report are retained, including an explicit unresolved question about a VoIP warning.",
    changes: [
      observed({
        key: "ios-4-2-1-gm-app-resubmission",
        title: "Apps did not require resubmission",
        canonicalSummary:
          "Developers were reportedly told that the candidate’s version increment did not require another App Store submission.",
        category: "compatibility",
        action: "changed",
        documentedStatus: "partiallyDocumented",
        citations: [
          cite(U.gm421, "Developer app-resubmission guidance", observedNote),
        ],
      }),
      observed({
        key: "ios-4-2-1-gm-voip-ringer-uncertain",
        title: "A VoIP ringer issue had uncertain status",
        canonicalSummary:
          "A warning described continued ringing after pickup in one background-calling app, but the evidence does not show whether this GM repaired it.",
        category: "knownIssue",
        action: "knownIssue",
        inheritance: "cumulative",
        citations: [
          cite(
            U.gm421,
            "Line2 ringer warning and attribution gap",
            observedNote,
          ),
        ],
      }),
    ],
  },
  {
    versionId: "version-ios-4-3",
    version: "4.3",
    alias: "beta-1",
    label: "Beta 1",
    channel: "developerBeta",
    date: "2011-01-12",
    sequence: 1,
    identityUrls: [
      U.beta43Identity,
      U.beta43DeveloperExcerpt,
      U.beta43SideSwitch,
    ],
    releaseText:
      "The first iOS 4.3 developer seed appeared on January 12. Its identity and principal observed features are independently retained by MacRumors and Engadget.",
    boundaryText:
      "The Apple developer page itself is not retained, but Engadget preserves short, attributed excerpts. Product-file speculation and rumored subscription support are excluded.",
    changes: [
      corroborated({
        key: "ios-4-3-device-support-reduction",
        title: "Two older device families left the test matrix",
        canonicalSummary:
          "Beta 1 omitted two aging models: iPhone 3G plus the second-generation iPod touch.",
        category: "compatibility",
        action: "removed",
        citations: [
          cite(U.beta43Identity, "Beta device availability", observedNote),
          cite(
            U.beta43DeveloperExcerpt,
            "Older-device support boundary",
            observedNote,
          ),
        ],
      }),
      corroborated({
        key: "ios-4-3-personal-hotspot",
        title: "Personal Hotspot",
        canonicalSummary:
          "Eligible iPhone 4 users could share cellular data with nearby Wi-Fi, Bluetooth, and USB devices.",
        category: "feature",
        action: "introduced",
        citations: [
          cite(U.beta43Identity, "Personal Hotspot settings", observedNote),
          cite(U.beta43DeveloperExcerpt, "Hotspot observation", observedNote),
        ],
      }),
      corroborated({
        key: "ios-4-3-third-party-airplay-video",
        title: "Applications gained AirPlay video support",
        canonicalSummary:
          "Developers could allow compatible application video to play through an AirPlay receiver.",
        category: "developerApi",
        action: "introduced",
        documentedStatus: "partiallyDocumented",
        citations: [
          cite(
            U.beta43Identity,
            "AirPlay video from applications",
            observedNote,
          ),
          cite(
            U.beta43DeveloperExcerpt,
            "MPMoviePlayerController AirPlay option",
            archiveNote,
          ),
        ],
      }),
      archived({
        key: "ios-4-3-web-airplay-video",
        title: "Web authors could opt into AirPlay video",
        canonicalSummary:
          "Media embedded in webpages could advertise AirPlay output through supported web-video interfaces.",
        category: "developerApi",
        action: "introduced",
        citations: [
          cite(U.beta43DeveloperExcerpt, "Web AirPlay support", archiveNote),
        ],
      }),
      corroborated({
        key: "ios-4-3-ipad-multitouch-preview",
        title: "iPad tested four- and five-finger gestures",
        canonicalSummary:
          "The preview used multi-finger pinches and swipes for Home, task switching, and movement between applications.",
        category: "feature",
        action: "introduced",
        documentedStatus: "partiallyDocumented",
        citations: [
          cite(U.beta43Identity, "iPad gesture preview", observedNote),
          cite(
            U.beta43DeveloperExcerpt,
            "Apple gesture-preview excerpt",
            archiveNote,
          ),
        ],
      }),
      corroborated({
        key: "ios-4-3-ipad-side-switch-choice",
        title: "Configurable iPad side switch",
        canonicalSummary:
          "iPad users could choose whether the hardware side switch controlled rotation lock or mute.",
        category: "behavior",
        action: "introduced",
        citations: [
          cite(
            U.beta43DeveloperExcerpt,
            "Revert the orientation-lock functionality",
            observedNote,
          ),
          cite(U.beta43SideSwitch, "Side-switch setting", observedNote),
        ],
      }),
      observed({
        key: "ios-4-3-beta1-ipad-fullscreen-iad",
        title: "iPad gained full-screen iAd banners",
        canonicalSummary:
          "The beta exposed a full-screen advertising presentation sized for the tablet.",
        category: "developerApi",
        action: "introduced",
        citations: [
          cite(U.beta43Identity, "Full-screen iAd on iPad", observedNote),
        ],
      }),
      observed({
        key: "ios-4-3-beta1-facetime-icon",
        title: "FaceTime received a revised icon",
        canonicalSummary: "The seed displayed updated artwork for FaceTime.",
        category: "enhancement",
        action: "changed",
        citations: [cite(U.beta43Identity, "FaceTime icon", observedNote)],
      }),
    ],
  },
  {
    versionId: "version-ios-4-3",
    version: "4.3",
    alias: "beta-2",
    label: "Beta 2",
    channel: "developerBeta",
    date: "2011-01-19",
    sequence: 2,
    identityUrls: [U.beta432Identity, U.beta432Notes],
    releaseText:
      "Apple distributed iOS 4.3 Beta 2 on January 19, one week after the first seed. The retained reports agree on its identity and preserve a narrow developer-note clarification.",
    boundaryText:
      "The sole supported iOS delta is a scope clarification for the gesture preview. The companion Apple TV seed, speculative resource-file references, and subjective speed impressions are excluded from iOS change records.",
    changes: [
      reuse("ios-4-3-ipad-multitouch-preview", {
        action: "changed",
        inheritance: "delta",
        documentedStatus: "documented",
        evidenceState: "corroborated",
        verificationMethod:
          "Matched the Beta 2 developer-note copy to the gesture preview introduced in Beta 1 without mislabeling a still-present test feature as removed.",
        summary:
          "Apple clarified that the gestures remained a developer evaluation in Beta 2 and would not ship enabled for customers.",
        citations: [
          cite(
            U.beta432Identity,
            "Gesture-preview customer boundary",
            archiveNote,
          ),
          cite(
            U.beta432Notes,
            "Developer-note gesture clarification",
            archiveNote,
          ),
        ],
      }),
    ],
  },
  {
    versionId: "version-ios-4-3",
    version: "4.3",
    alias: "gm",
    label: "GM",
    channel: "goldenMaster",
    date: "2011-03-03",
    sequence: 4,
    identityUrls: [U.gm43Apple, U.gm43Identity, U.public43],
    releaseText:
      "Apple’s developer notice and a same-day report establish the iOS 4.3 GM seed on March 3. Apple’s March 2 announcement supplies first-party feature context immediately preceding the candidate.",
    boundaryText:
      "This page indexes the GM feature state rather than claiming every item first appeared on March 3. The public release remains a separate, already approved event.",
    changes: [
      documented({
        key: "ios-4-3-gm-nitro",
        title: "Safari adopted the Nitro JavaScript engine",
        canonicalSummary:
          "Mobile Safari used just-in-time JavaScript compilation to accelerate interactive webpages.",
        category: "enhancement",
        action: "introduced",
        citations: [
          cite(U.gm43Apple, "Nitro browser performance", appleNote),
          cite(U.public43, "Nitro JavaScript engine", appleNote),
        ],
      }),
      documented({
        key: "ios-4-3-gm-home-sharing",
        title: "iTunes Home Sharing reached iOS",
        canonicalSummary:
          "Devices could play media from a desktop iTunes library over the local wireless network.",
        category: "feature",
        action: "introduced",
        citations: [
          cite(U.gm43Apple, "iTunes Home Sharing", appleNote),
          cite(U.public43, "Home Sharing behavior", appleNote),
        ],
      }),
      reuse("ios-4-3-third-party-airplay-video", {
        action: "changed",
        inheritance: "cumulative",
        documentedStatus: "documented",
        evidenceState: "confirmed",
        verificationMethod:
          "Matched the GM feature state in first-party Apple material; Beta 1 remains the earlier observed occurrence.",
        citations: [
          cite(U.gm43Apple, "AirPlay enhancements", appleNote),
          cite(U.public43, "Third-party and web AirPlay video", appleNote),
        ],
        summary:
          "Apple’s GM materials confirm the broader AirPlay path first observed in Beta 1; this occurrence records candidate state, not a second introduction.",
      }),
      reuse("ios-4-3-personal-hotspot", {
        action: "changed",
        inheritance: "cumulative",
        documentedStatus: "documented",
        evidenceState: "confirmed",
        verificationMethod:
          "Matched the GM feature state in first-party Apple material; Beta 1 remains the earlier observed occurrence.",
        citations: [
          cite(U.gm43Apple, "Personal Hotspot", appleNote),
          cite(U.public43, "Personal Hotspot behavior", appleNote),
        ],
        summary:
          "The GM sources confirm the hotspot feature observed at Beta 1 without moving its first appearance to this route.",
      }),
      reuse("ios-4-3-ipad-side-switch-choice", {
        action: "changed",
        inheritance: "cumulative",
        documentedStatus: "documented",
        evidenceState: "confirmed",
        verificationMethod:
          "Matched the candidate feature state in Apple’s announcement and retained Beta 1 as the first observed occurrence.",
        citations: [cite(U.public43, "iPad side-switch choice", appleNote)],
        summary:
          "The candidate retained the side-switch preference first observed in Beta 1.",
      }),
      reuse("ios-4-3-device-support-reduction", {
        action: "removed",
        inheritance: "cumulative",
        documentedStatus: "documented",
        evidenceState: "corroborated",
        verificationMethod:
          "Reconciled Apple’s stated device list with the GM identity report and retained the earlier Beta 1 boundary.",
        citations: [
          cite(U.gm43Identity, "GM device availability", identityNote),
          cite(U.public43, "iOS 4.3 compatibility", appleNote),
        ],
        summary:
          "The GM compatibility list confirms the device boundary already visible in Beta 1.",
      }),
      documented({
        key: "ios-4-3-gm-ipad2-hardware",
        title: "The SDK covered iPad 2 hardware",
        canonicalSummary:
          "Apple asked developers to update tablet apps for the new processor, cameras, and gyroscope.",
        category: "compatibility",
        action: "introduced",
        citations: [cite(U.gm43Apple, "iPad 2 hardware guidance", appleNote)],
      }),
    ],
  },
];

const expectedContentRoutes = [
  ["version-ios-4-1", "beta-1", "developerBeta", "2010-07-14", 8],
  ["version-ios-4-1", "beta-2", "developerBeta", "2010-07-27", 1],
  ["version-ios-4-1", "beta-3", "developerBeta", "2010-08-03", 1],
  ["version-ios-4-1", "gm", "goldenMaster", "2010-09-01", 7],
  ["version-ios-4-2-1", "beta-1", "developerBeta", "2010-09-15", 17],
  ["version-ios-4-2-1", "beta-2", "developerBeta", "2010-09-28", 7],
  ["version-ios-4-2-1", "beta-3", "developerBeta", "2010-10-12", 3],
  ["version-ios-4-2-1", "4-2-gm", "goldenMaster", "2010-11-01", 8],
  ["version-ios-4-2-1", "gm", "goldenMaster", "2010-11-18", 2],
  ["version-ios-4-3", "beta-1", "developerBeta", "2011-01-12", 8],
  ["version-ios-4-3", "beta-2", "developerBeta", "2011-01-19", 1],
  ["version-ios-4-3", "gm", "goldenMaster", "2011-03-03", 7],
];
assert.deepEqual(
  eventSpecs.map((spec) => [
    spec.versionId,
    spec.alias,
    spec.channel,
    spec.date,
    spec.changes.length,
  ]),
  expectedContentRoutes,
  "exact substantive route closure",
);
assert.deepEqual(
  ledgerOnlyRouteSpecs.map((spec) => [
    spec.versionId,
    spec.version,
    spec.alias,
    spec.channel,
    spec.date,
    spec.sequence,
    spec.isRevision,
  ]),
  [
    [
      "version-ios-4-2-1",
      "4.2.1",
      "4-2-gm-seed-2-ipad",
      "goldenMaster",
      "2010-11-12",
      5,
      true,
    ],
    [
      "version-ios-4-3",
      "4.3",
      "beta-3",
      "developerBeta",
      "2011-02-01",
      3,
      false,
    ],
  ],
  "exact timeline-only route closure",
);
const contentRouteKeys = new Set(
  eventSpecs.map((spec) => `${spec.versionId}/${spec.alias}`),
);
const ledgerOnlyRouteKeys = new Set(
  ledgerOnlyRouteSpecs.map((spec) => `${spec.versionId}/${spec.alias}`),
);
assert(
  [...ledgerOnlyRouteKeys].every((key) => !contentRouteKeys.has(key)),
  "timeline-only identities are omitted from content",
);
assert.equal(
  new Set([...contentRouteKeys, ...ledgerOnlyRouteKeys]).size,
  14,
  "all 14 named route identities close without placeholder records",
);

const seed = JSON.parse(readFileSync(join(here, "..", "seed-data.json")));
const expectedSeed = [
  {
    platform: "iOS",
    majorVersion: 4,
    version: "4.1",
    milestones: [{ label: "Public", date: "2010-09-08", isRevision: false }],
    publicReleaseDate: "2010-09-08",
    releaseStatus: "released",
  },
  {
    platform: "iOS",
    majorVersion: 4,
    version: "4.2.1",
    milestones: [{ label: "Public", date: "2010-11-22", isRevision: false }],
    publicReleaseDate: "2010-11-22",
    releaseStatus: "released",
  },
  {
    platform: "iOS",
    majorVersion: 4,
    version: "4.3",
    milestones: [{ label: "Public", date: "2011-03-09", isRevision: false }],
    publicReleaseDate: "2011-03-09",
    releaseStatus: "released",
  },
];
assert.deepEqual(
  seed.releaseVersions
    .filter(
      (item) =>
        item.platform === "iOS" &&
        ["4.1", "4.2.1", "4.3"].includes(item.version),
    )
    .map((item) => structuredClone(item)),
  expectedSeed,
  "exact iOS 4 point-release seed",
);

const publicBatch = JSON.parse(
  readFileSync(join(here, "apple-ios-4.json"), "utf8"),
);
for (const versionId of [
  "version-ios-4-1",
  "version-ios-4-2-1",
  "version-ios-4-3",
]) {
  const version = publicBatch.versions.find(
    (item) => item.releaseVersionId === versionId,
  );
  const event = publicBatch.events.find(
    (item) =>
      item.target?.releaseVersionId === versionId &&
      item.target?.routeAlias === "public",
  );
  assert(version, `${versionId} public version ownership`);
  assert.equal(version.provenanceStatus, "editoriallyVerified");
  assert.equal(version.editorialReview?.status, "approved");
  assert(event, `${versionId} public event ownership`);
  assert.equal(event.provenanceStatus, "editoriallyVerified");
  assert.equal(event.editorialReview?.status, "approved");
  assert.equal(event.isIndexable, true);
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
      isRevision: Boolean(spec.isRevision),
      availabilityState: "available",
      closesReleaseCycle: false,
    },
    authorship: "originalSynthesis",
    summary: `${spec.label} is an editorially reviewed historical archive page with ${spec.changes.length} structured, source-backed milestone ${spec.changes.length === 1 ? "record" : "records"} and an explicit account of its surviving evidence boundary.`,
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
          text: `This page indexes ${spec.changes.length} bounded ${spec.changes.length === 1 ? "occurrence" : "occurrences"}. Titles and summaries are original synthesis; source locators identify the specific evidence family behind each record.`,
          citations: articleCitations(spec),
        },
        { style: "h2", text: "Evidence limits" },
        {
          style: "normal",
          text: spec.boundaryText,
          citations: identityCitations,
        },
      ],
    },
    citations: [...identityCitations, ...articleCitations(spec)],
    changes: spec.changes,
    provenanceStatus: "editoriallyVerified",
    editorialReview: { status: "approved", reviewedAt },
    isIndexable: true,
  };
});

const allCitationUrls = [];
const visit = (value) => {
  if (Array.isArray(value)) {
    for (const item of value) visit(item);
    return;
  }
  if (!value || typeof value !== "object") return;
  for (const [childKey, child] of Object.entries(value)) {
    if (childKey === "citations") {
      for (const citation of child) allCitationUrls.push(citation.url);
    } else {
      visit(child);
    }
  }
};
visit(events);
const usedUrls = new Set(allCitationUrls);
assert(
  [...usedUrls].every((url) =>
    researchSources.some((source) => source.url === url),
  ),
  "every citation belongs to the retained research source set",
);
const sources = researchSources.filter((source) => usedUrls.has(source.url));
const declaredUrls = new Set(sources.map((source) => source.url));
assert.equal(declaredUrls.size, sources.length, "unique source URLs");
assert.deepEqual(usedUrls, declaredUrls, "declared source/use closure");

const bundle = {
  formatVersion: 1,
  target: { projectId: "lh3yswzu", dataset: "production" },
  accessedAt,
  sources,
  versions: [],
  events,
  builds: [],
};

const localChangeDefinitions = new Map();
let occurrenceCount = 0;
for (const event of events) {
  assert.equal(event.provenanceStatus, "editoriallyVerified");
  assert.deepEqual(event.editorialReview, {
    status: "approved",
    reviewedAt,
  });
  assert.equal(event.isIndexable, true);
  assert.equal(event.identity.releaseVersionId, event.target.releaseVersionId);
  assert.equal(event.identity.platformId, "platform-ios");
  assert.equal(event.identity.routeAlias, event.target.routeAlias);
  assert.equal(
    event.identity.stableEventId,
    `event:apple:ios:${event.target.releaseVersionId.replace("version-ios-", "").replaceAll("-", ".")}:${event.target.routeAlias}`,
  );
  assert.equal(event.identity.availabilityState, "available");
  assert.equal(event.identity.closesReleaseCycle, false);
  assert.notEqual(event.target.routeAlias, "public");
  assert(
    ["developerBeta", "goldenMaster"].includes(event.identity.channel),
    `${event.identity.stableEventId} channel`,
  );
  for (const change of event.changes) {
    occurrenceCount += 1;
    const definition = {
      title: change.title,
      canonicalSummary: change.canonicalSummary,
      category: change.category,
    };
    const previous = localChangeDefinitions.get(change.key);
    if (previous) assert.deepEqual(definition, previous, change.key);
    else localChangeDefinitions.set(change.key, definition);
    assert(change.citations.length > 0, `${change.key} citations`);
    assert(
      !change.summary.includes(
        "The evidence selected for this milestone supports this bounded state",
      ),
      `${change.key} has a substantive occurrence summary`,
    );
  }
}
assert.equal(events.length, 12, "substantive event count");
assert.equal(occurrenceCount, 70, "occurrence count");
assert.equal(localChangeDefinitions.size, 62, "stable definition count");
assert.deepEqual(bundle.versions, [], "no version overlays");
assert.deepEqual(bundle.builds, [], "no build documents");
assert(
  events.every(
    (event) =>
      !ledgerOnlyRouteKeys.has(
        `${event.target.releaseVersionId}/${event.target.routeAlias}`,
      ),
  ),
  "timeline-only identities remain outside the content bundle",
);

const recurrence = new Map();
for (const event of events) {
  for (const change of event.changes) {
    recurrence.set(change.key, [
      ...(recurrence.get(change.key) || []),
      `${event.target.releaseVersionId}/${event.target.routeAlias}:${change.action}:${change.inheritance}`,
    ]);
  }
}
assert.deepEqual(
  recurrence.get("ios-4-1-proximity-sensor-reliability"),
  [
    "version-ios-4-1/beta-2:knownIssue:delta",
    "version-ios-4-1/gm:fixed:cumulative",
  ],
  "proximity-sensor history",
);
assert.deepEqual(
  recurrence.get("ios-4-2-airprint-shared-printer-path"),
  [
    "version-ios-4-2-1/beta-1:introduced:delta",
    "version-ios-4-2-1/beta-2:changed:delta",
    "version-ios-4-2-1/4-2-gm:removed:delta",
  ],
  "shared-printer AirPrint history",
);
assert.deepEqual(
  recurrence.get("ios-4-3-ipad-multitouch-preview"),
  [
    "version-ios-4-3/beta-1:introduced:delta",
    "version-ios-4-3/beta-2:changed:delta",
  ],
  "iPad gesture-preview history",
);
for (const [key, firstAction, gmAction] of [
  ["ios-4-3-device-support-reduction", "removed", "removed"],
  ["ios-4-3-personal-hotspot", "introduced", "changed"],
  ["ios-4-3-third-party-airplay-video", "introduced", "changed"],
  ["ios-4-3-ipad-side-switch-choice", "introduced", "changed"],
]) {
  assert.deepEqual(
    recurrence.get(key),
    [
      `version-ios-4-3/beta-1:${firstAction}:delta`,
      `version-ios-4-3/gm:${gmAction}:cumulative`,
    ],
    `${key} stable Beta 1-to-GM history`,
  );
}
const getEvent = (versionId, alias) =>
  events.find(
    (event) =>
      event.target.releaseVersionId === versionId &&
      event.target.routeAlias === alias,
  );
assert(
  getEvent("version-ios-4-1", "gm").changes.every(
    (change) => change.inheritance === "cumulative",
  ),
  "iOS 4.1 GM presentation records are cumulative release state",
);
assert.deepEqual(
  getEvent("version-ios-4-2-1", "4-2-gm").changes.map((change) => [
    change.key,
    change.inheritance,
  ]),
  [
    ["ios-4-2-gm-latest-sdk-setting", "cumulative"],
    ["ios-4-2-gm-ipad-switch-audio-semantics", "cumulative"],
    ["ios-4-2-gm-calendar-ics-import", "cumulative"],
    ["ios-4-2-gm-gamekit-friend-composer", "cumulative"],
    ["ios-4-2-gm-gamekit-modal-presentation", "cumulative"],
    ["ios-4-2-gm-mapkit-annotation-views", "cumulative"],
    ["ios-4-2-airprint-shared-printer-path", "delta"],
    ["ios-4-2-gm-youtube-airplay-returned", "delta"],
  ],
  "iOS 4.2 GM cumulative-note and proven-transition boundary",
);
for (const absentKey of [
  "ios-4-1-beta2-proximity-sensor",
  "ios-4-1-gm-proximity-sensor-fix",
  "ios-4-2-beta2-shared-printer-hosts",
  "ios-4-2-gm-direct-airprint-only",
  "ios-4-2-beta3-visual-adjustments",
  "ios-4-2-gm-seed-2-ipad-wifi",
  "ios-4-3-beta2-apple-tv-airplay-test",
  "ios-4-3-beta2-multitouch-removal",
  "ios-4-3-beta3-download-cancel",
]) {
  assert.equal(
    recurrence.has(absentKey),
    false,
    `${absentKey} is excluded or merged into a stable definition`,
  );
}

const thisBatchRouteKeys = new Set(
  events.map(
    (event) => `${event.target.releaseVersionId}\0${event.target.routeAlias}`,
  ),
);
const thisBatchStableIds = new Set(
  events.map((event) => event.identity.stableEventId),
);
const otherJsonFiles = readdirSync(here).filter(
  (name) => name.endsWith(".json") && name !== outputName,
);
for (const name of otherJsonFiles) {
  const other = JSON.parse(readFileSync(join(here, name), "utf8"));
  for (const event of other.events || []) {
    const routeKey =
      event.target?.releaseVersionId && event.target?.routeAlias
        ? `${event.target.releaseVersionId}\0${event.target.routeAlias}`
        : null;
    assert(
      !routeKey || !thisBatchRouteKeys.has(routeKey),
      `${name} already owns ${routeKey?.replace("\0", "/")}`,
    );
    assert(
      !event.identity?.stableEventId ||
        !thisBatchStableIds.has(event.identity.stableEventId),
      `${name} already owns ${event.identity?.stableEventId}`,
    );
    for (const change of event.changes || []) {
      const localDefinition = localChangeDefinitions.get(change.key);
      if (!localDefinition) continue;
      assert.deepEqual(
        {
          title: change.title,
          canonicalSummary: change.canonicalSummary,
          category: change.category,
        },
        localDefinition,
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
const sourceLedger = researchSources
  .map(
    (source) =>
      `- [${source.title}](${source.url}) — ${source.publisher}; ${source.sourceClass}.`,
  )
  .join("\n");
const routeRows = [
  ...eventSpecs.map((spec) => ({
    ...spec,
    recordCount: spec.changes.length,
    disposition: "Approved archive",
  })),
  ...ledgerOnlyRouteSpecs.map((spec) => ({
    ...spec,
    recordCount: 0,
  })),
]
  .sort(
    (left, right) =>
      left.version.localeCompare(right.version, undefined, { numeric: true }) ||
      left.date.localeCompare(right.date) ||
      left.channel.localeCompare(right.channel),
  )
  .map(
    (spec) =>
      `| iOS ${spec.version} | ${spec.label} | \`${spec.alias}\` | ${spec.date} | ${spec.recordCount} | ${spec.disposition} |`,
  )
  .join("\n");
const routeVerificationRows = events
  .map((event) => {
    const [, , , version, alias] = event.identity.stableEventId.split(":");
    return `| \`/apple/ios/${version}/${alias}/\` | 200 | 3/3 | ${event.changes.length}/${event.changes.length} | yes | yes | no | index, follow |`;
  })
  .join("\n");

const dryPlanRecord = {
  status: "Applied and zero-residual verified on 2026-07-30",
  summary:
    "Each of three pre-apply runs found 98 creates, four revision-guarded additive patches, and 2,118 unchanged documents.",
  details: [
    "All three consecutive runs produced plan SHA `cd97dc6aa61d0a31232e5bc5393e637d41fed007264484060070fd1576392b2b`",
    "Creates: 26 sources, 12 events, and 60 changes; zero versions and zero builds",
    "Two previously owned Apple sources and two global changes are reused rather than duplicated",
    "Patches: citation unions and refreshed approved-review timestamps on two global changes plus the missing `author: Apple` field on two Apple Newsroom sources; zero semantic-definition, identity, version, event, or build patches",
    "Both citation unions preserve every existing citation",
    "All 12 projected events are `editoriallyVerified`, approved, indexable, and timestamped",
    "Neither timeline-only identity appears in the create plan",
    "Mutation payload: 200,034 bytes (5.1% of the guarded limit)",
    "Plan artifact SHA-256: `5c961e50a196e480b3ff4bed449f64375c991b4a22293259407da8aef779d93d`",
    "Rollback artifact SHA-256: `bba2490b8f8af70787c65f48bbe626eb503cc5f15f5acfd42f664231b0a434d2`",
    "Rollback coverage exactly matches all 98 create IDs and all four patch targets",
  ],
};
const verificationRecord = {
  researchBatches: 73,
  globalChangeKeys: 4_214,
  focusedTests: 19,
  fullTests: 131,
  rawArtifacts: 31,
  rawEvidenceBytes: 4_603_107,
  normalizedArtifacts: 31,
  maximumEditorialOverlapWords: 4,
  independentSourcesFetched: 31,
  independentRawExact: 15,
  independentNormalizedExact: 30,
  independentMarkerMatches: 1,
  independentEvidenceReproduced: 31,
};
const publicationRecord = {
  transactionId: "F0eE6eK5XyVXtlnaoybvOv",
  receiptSha:
    "c7237a6c456ec218df6dc14a14087cb2be5c19b9912a9a7870650cb0e4faf0e0",
  zeroPlanSha:
    "07a944462d80535ffeb2b54801968f8241b96a042fca14c2663b53f41fbb71e5",
  zeroPlanArtifactSha:
    "c1bbc63358fd3761957f2fb5fb6940bfd43e46cc48b3aae8a80c0f3dded93943",
  zeroRollbackArtifactSha:
    "2445dd392120141dd65187d70f8245a67e843ba31e402e91cb0e55f850e926c9",
  zeroUnchanged: 2_220,
  coverage: {
    totalVersions: 410,
    fullVersions: 410,
    totalAppearances: 2_027,
    fullAppearances: 474,
    sourceLinkedAppearances: 256,
    timelineOnlyAppearances: 1_297,
    approvedStructuredAppearances: 625,
  },
};

const md = `# Apple iOS 4 point-release prerelease archive batch

## Result

\`${outputName}\` is the approved archive batch for exact prerelease
identities attached to the existing iOS 4.1, 4.2.1, and 4.3 public parents.
The completed iOS 4.0 prerelease batch remains byte-for-byte unchanged.

- ${events.length} editorially verified, approved, indexable archive routes
- ${ledgerOnlyRouteSpecs.length} exact identities retained only as timeline
  history because they lack a verified route-specific delta
- ${occurrenceCount} milestone occurrences across
  ${localChangeDefinitions.size} stable definitions
- ${sources.length} content-bundle sources, ${researchSources.length} retained
  research sources, and ${citationCount} content citation references
- zero release overlays, builds, or Public route events
- every route is \`editoriallyVerified\`, \`approved\`, and
  \`isIndexable: true\`

## Exact route closure

| Release | Historical milestone | Route alias | Appearance | Fresh records | Disposition |
| --- | --- | --- | --- | ---: | --- |
${routeRows}

The 4.2 cycle is attached to the local 4.2.1 public parent because the first
three betas and two initial GM states were branded **iOS 4.2**, while Apple
renamed the all-device candidate **iOS 4.2.1 GM** on November 18 and marketed
the November 22 public package as iOS 4.2. The original labels remain visible.

## Evidence method

1. iOS 4.1 retains three Betas and the Apple-confirmed GM. Beta 1 uses a
   bounded observed-change inventory; Beta 2 and Beta 3 remain sparse because
   no complete note bodies survive.
2. iOS 4.2 retains content pages for Beta 1–3, the November 1 GM, and the
   separately named 4.2.1 GM. The iPad-only November 12 revision remains an
   exact timeline identity, but its possible Wi-Fi rationale is not treated as
   a verified revision delta. A credited copy of Apple’s GM developer notes
   supplies cumulative SDK state plus two proven transitions.
3. iOS 4.3 retains content pages for Beta 1–2 and GM. Beta 3 remains in the
   timeline ledger because its only reported behavior explicitly predates that
   seed. Short Apple developer excerpts are distinguished from publisher
   observations, and the GM uses first-party Apple Developer and Newsroom
   material.
4. Cumulative GM occurrences do not move a feature’s first observed seed.
   Rumor-only subscription, unreleased resource-file, and inferred fix claims
   are excluded.

## Exact gaps and exclusions

- No defensible iOS 4.1 Beta 4, iOS 4.2 Beta 4, or iOS 4.3 Beta 4 identity was
  found; no such route is created.
- No complete Apple-hosted note body survives for any 4.1 beta, the sparse
  4.2.1 GM, or the 4.3 betas.
- The November 12 iOS 4.2 revision is iPad-only. Its identity remains
  timeline-only because the Wi-Fi report presents the revision as just one
  possible reason, not a verified change.
- iOS 4.3 Beta 3 remains timeline-only because its reported download-cancel
  behavior was already present in earlier iOS 4.3 betas.
- A companion Apple TV software seed is not an iOS change and is excluded from
  the iOS 4.3 Beta 2 page.
- Unspecified iOS 4.2 Beta 3 visual changes are not structured as a generic
  filler record.
- The November 18 report does not establish whether the cited VoIP ringer
  issue was repaired; the structured record preserves that uncertainty.
- Build numbers in journalism support source identity but are not converted
  into release-build documents.
- Public routes remain owned by the approved \`apple-ios-4.json\` batch.

## Copyright and attribution controls

- Titles, canonical summaries, occurrence summaries, and article prose are
  original synthesis.
- Every factual record has a claim-level citation and locator.
- The iThinkDifferent GM copy and MacStories Beta 2 excerpt identify Apple as
  author while naming the preserving publisher, making source custody clear.
- No article body, screenshot, transcript, or long quotation is committed.
- The separate evidence audit verifies raw and normalized hashes and enforces
  a maximum five-word contiguous overlap target for reader-facing prose.
- The audited maximum is four words across 364 reader-facing fields.

## Bounded recurrence model

- The iPhone 4 proximity-sensor issue is one immutable definition: a reported
  Beta 2 known issue followed by cumulative release-state corroboration at the
  iOS 4.1 GM boundary.
- The shared-printer AirPrint path is introduced in Beta 1, gains explicit host
  requirements in Beta 2, and is removed from the documented GM state.
- The iPad multitouch preview is introduced in iOS 4.3 Beta 1 and clarified in
  Beta 2 as a developer evaluation that would not ship enabled for customers.
- Device support, Personal Hotspot, third-party AirPlay video, and the
  configurable iPad side switch retain their Beta 1 first-observed state; GM
  occurrences are cumulative confirmation rather than second introductions.

## Source ledger

All ${researchSources.length} retained research sources were accessed on
${accessedAt}. Only the ${sources.length} sources cited by archive routes
are declared in the JSON bundle; the three timeline-only identity sources
remain in this ledger and the pinned evidence corpus.

${sourceLedger}

## Closure guards

- Exact comparison against the three local seed records and their sole Public
  milestones
- Approved/indexable Public ownership assertion against \`apple-ios-4.json\`
- Exact 12-route content allowlist plus two disjoint timeline-only identities,
  closing all 14 named milestones without placeholder records
- Explicit no-Beta-4, no-build, no-version-overlay, and no-Public-patch boundary
- Collision scan across every other research-batch JSON
- ${occurrenceCount} occurrences resolve to exactly
  ${localChangeDefinitions.size} stable definitions, including three bounded
  prerelease histories and four Beta 1-to-GM cumulative histories
- Complete unique source declaration/use closure
- Every claim citation resolves to its pinned artifact with at least one
  locator token and two title-or-summary tokens
- Byte-preservation assertion for all four completed iOS 4.0 artifacts
- Deterministic formatted JSON SHA-256: \`${jsonSha}\`

## Editorial approval and validation record

- provenance: \`editoriallyVerified\`
- editorial status: \`approved\`
- indexability: \`true\`
- reviewed at: \`${reviewedAt}\`
- independent substantive review: clean after route-specific-delta,
  cumulative-state, recurrence, platform-scope, and source-custody corrections
- evidence audit:
  ${verificationRecord.rawArtifacts} exact raw artifacts totaling
  ${verificationRecord.rawEvidenceBytes.toLocaleString("en-US")} bytes and
  ${verificationRecord.normalizedArtifacts} normalized text locks
- independent live re-fetch: all
  ${verificationRecord.independentSourcesFetched} retained sources available;
  ${verificationRecord.independentRawExact} raw artifacts matched
  byte-for-byte,
  ${verificationRecord.independentNormalizedExact} selected article
  boundaries matched exactly, the remaining rotating-script page reproduced
  its audited markers, and all
  ${verificationRecord.independentEvidenceReproduced} evidence boundaries
  passed
- \`npm run research:validate\`:
  ${verificationRecord.researchBatches} batches and
  ${verificationRecord.globalChangeKeys.toLocaleString("en-US")} globally
  consistent change keys
- focused ingestion/manifest suite:
  ${verificationRecord.focusedTests} of
  ${verificationRecord.focusedTests} passed
- full repository suite:
  ${verificationRecord.fullTests} of ${verificationRecord.fullTests} passed
- copyright-similarity scan: maximum contiguous reader-facing overlap of
  ${verificationRecord.maximumEditorialOverlapWords} words
- ESLint, Prettier check, deterministic regeneration, and
  \`git diff --check\`: passed

## Production dry plan

- Status: ${dryPlanRecord.status}
- ${dryPlanRecord.summary}
${dryPlanRecord.details.map((detail) => `- ${detail}`).join("\n")}

## Publication receipt

- Sanity transaction: \`${publicationRecord.transactionId}\`
- applied plan SHA:
  \`cd97dc6aa61d0a31232e5bc5393e637d41fed007264484060070fd1576392b2b\`
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
node scripts/research-batches/audit-ios4-point-prerelease.mjs tmp/ios4-point-evidence
node scripts/research-batches/build-apple-ios-4-point-prerelease.mjs
npm run research:validate
node --import tsx --test tests/launch-content-ingestion.test.ts tests/launch-content-manifest.test.ts
npx eslint scripts/research-batches/build-apple-ios-4-point-prerelease.mjs scripts/research-batches/audit-ios4-point-prerelease.mjs
npx prettier --check scripts/research-batches/build-apple-ios-4-point-prerelease.mjs scripts/research-batches/audit-ios4-point-prerelease.mjs scripts/research-batches/apple-ios-4-point-prerelease.json scripts/research-batches/apple-ios-4-point-prerelease.md
npx sanity exec scripts/ingest-launch-content.ts --with-user-token -- --content scripts/research-batches/apple-ios-4-point-prerelease.json
\`\`\`
`;

const formattedMd = await prettier.format(md, { filepath: ledgerName });
writeFileSync(join(here, ledgerName), formattedMd);

console.log(`Wrote ${outputName}`);
console.log(`Wrote ${ledgerName}`);
console.log(`${events.length} events`);
console.log(`${occurrenceCount} occurrences`);
console.log(`${localChangeDefinitions.size} stable changes`);
console.log(`${sources.length} sources`);
console.log(`${citationCount} citation references`);
console.log(`JSON SHA-256 ${jsonSha}`);
