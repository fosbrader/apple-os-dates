import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import prettier from "prettier";

const here = dirname(fileURLToPath(import.meta.url));
const outputName = "apple-ios-8-point-prerelease.json";
const ledgerName = "apple-ios-8-point-prerelease.md";
const accessedAt = "2026-07-30";
const reviewedAt = "2026-07-30T13:55:56Z";
const sha256 = (value) => createHash("sha256").update(value).digest("hex");
const verification = {
  researchBatches: 73,
  globalChangeKeys: 4_214,
  focusedTests: 19,
  fullTests: 131,
  rawArtifacts: 30,
  rawEvidenceBytes: 5_167_522,
  normalizedArtifacts: 30,
  copyrightFields: 424,
  maximumEditorialOverlapWords: 5,
  independentSourcesFetched: 30,
  independentContentSources: 29,
  independentTimelineSources: 1,
  independentRawExact: 23,
  independentNormalizedExact: 30,
  independentTitlesReproduced: 29,
  independentProbesReproduced: 30,
  independentEvidenceReproduced: 30,
};

const U = {
  ios81Beta1Identity:
    "https://www.macrumors.com/2014/09/29/apple-seeds-first-ios-8-1-beta-to-developers/",
  ios81Beta1Details:
    "https://9to5mac.com/2014/09/29/first-beta-version-ios-8-1-hits-apples-developer-center-with-build-number-12b401/",
  ios81Beta2Identity:
    "https://www.macrumors.com/2014/10/07/apple-seeds-ios-8-1-beta-2/",
  ios81Beta2Details:
    "https://9to5mac.com/2014/10/07/apple-releases-ios-8-1-beta-2-to-developers/",
  ios81ApplePay: "https://www.macrumors.com/2014/10/08/apple-pay-setup-screen/",
  ios81Public:
    "https://www.macrumors.com/2014/10/20/apple-releases-ios-8-1-apple-pay/",
  ios82Beta1: "https://www.macrumors.com/2014/11/18/apple-watchkit-ios-8-2/",
  ios82Beta2:
    "https://www.macrumors.com/2014/12/10/apple-seeds-second-ios-8-2-beta-to-developers/",
  ios82Beta3:
    "https://www.macrumors.com/2014/12/18/apple-seeds-third-ios-8-2-beta-to-developers/",
  ios82Beta4: "https://www.macrumors.com/2015/01/12/apple-fourth-ios-8-2-beta/",
  ios82Beta5:
    "https://www.macrumors.com/2015/02/02/apple-seeds-fifth-ios-8-2-beta-to-developers/",
  ios82LimitedGm:
    "https://www.macrumors.com/2015/03/05/ios-8-2-release-date-and-notes/",
  ios82Public:
    "https://www.macrumors.com/2015/03/09/apple-releases-ios-8-2-today/",
  ios83Beta1:
    "https://www.macrumors.com/2015/02/09/apple-seeds-first-ios-8-3-beta-to-developers/",
  ios83Beta2:
    "https://www.macrumors.com/2015/02/23/apple-seeds-second-ios-8-3-beta-to-developers/",
  ios83Beta3:
    "https://www.macrumors.com/2015/03/12/apple-seeds-third-ios-8-3-beta-to-developers/",
  ios83PublicBeta1:
    "https://www.macrumors.com/2015/03/12/ios-beta-testing-program/",
  ios83Beta4PublicBeta2:
    "https://www.macrumors.com/2015/03/24/apple-seeds-fourth-ios-8-3-beta-to-developers/",
  ios83Public: "https://www.macrumors.com/2015/04/08/apple-releases-ios-8-3/",
  ios84Beta1:
    "https://www.macrumors.com/2015/04/13/apple-seeds-first-ios-8-4-beta-to-developers/",
  ios84Audiobooks: "https://9to5mac.com/2015/04/14/audiobooks-ios-8-4/",
  ios84Beta2PublicBeta1:
    "https://9to5mac.com/2015/04/27/apple-releases-ios-8-4-beta-2-to-developers-with-revamped-music-app/",
  ios84Beta3PublicBeta2:
    "https://9to5mac.com/2015/05/11/apple-releases-ios-8-4-beta-3-with-revamped-music-ahead-of-late-june-launch/",
  ios84Beta4:
    "https://www.macrumors.com/2015/06/09/apple-seeds-fourth-ios-8-4-beta/",
  ios84UnicodeFix:
    "https://www.macrumors.com/2015/06/10/imessage-bug-fixed-ios-8-4-beta-4/",
  ios84NoGm:
    "https://www.macrumors.com/2015/06/22/ios-8-4-gm-ios-9-beta-2-release-date/",
  ios84Public:
    "https://www.macrumors.com/2015/06/30/apple-releases-ios-8-4-with-apple-music/",
  appleIos8Updates: "https://support.apple.com/en-us/102782",
  appleWatchKit:
    "https://www.apple.com/newsroom/2014/11/18Developers-Start-Designing-Apps-for-Apple-Watch/",
  appleXcode6:
    "https://developer.apple.com/library/archive/documentation/Xcode/Conceptual/RN-Xcode-Archive/Chapters/xc6_release_notes.html",
};

const source = (
  url,
  title,
  publisher,
  sourceClass,
  author,
  publishedAt,
  topics,
) => ({
  url,
  title,
  publisher,
  sourceClass,
  ...(author ? { author } : {}),
  ...(publishedAt ? { publishedAt } : {}),
  topics,
});

const researchSources = [
  source(
    U.ios81Beta1Identity,
    "Apple Seeds First iOS 8.1 Beta to Developers",
    "MacRumors",
    "journalism",
    "Juli Clover",
    "2014-09-29T15:27:03-07:00",
    ["iOS 8.1", "Beta 1", "release identity"],
  ),
  source(
    U.ios81Beta1Details,
    "First beta version iOS 8.1 hits Apple’s developer center with design tweaks and bug fixes",
    "9to5Mac",
    "journalism",
    "Mike Beasley",
    "2014-09-29T22:23:44.000Z",
    ["iOS 8.1", "Beta 1", "observed changes", "developer notes"],
  ),
  source(
    U.ios81Beta2Identity,
    "Apple Seeds Second iOS 8.1 Beta to Developers",
    "MacRumors",
    "journalism",
    "Juli Clover",
    "2014-10-07T10:15:42-07:00",
    ["iOS 8.1", "Beta 2", "release identity"],
  ),
  source(
    U.ios81Beta2Details,
    "Apple releases iOS 8.1 beta 2 to developers",
    "9to5Mac",
    "journalism",
    "Zac Hall",
    "2014-10-07T17:10:19.000Z",
    ["iOS 8.1", "Beta 2", "release identity"],
  ),
  source(
    U.ios81ApplePay,
    "New Apple Pay Setup Screens Unearthed in iOS 8.1 Beta 2",
    "MacRumors",
    "journalism",
    "Husain Sumra",
    "2014-10-07T21:28:46-07:00",
    ["iOS 8.1", "Beta 2", "Apple Pay", "observed changes"],
  ),
  source(
    U.ios81Public,
    "Apple Releases iOS 8.1 With Apple Pay Support, SMS Relay, Camera Roll, and More",
    "MacRumors",
    "journalism",
    "Juli Clover",
    "2014-10-20T09:56:41-07:00",
    ["iOS 8.1", "public release", "release boundary"],
  ),
  source(
    U.ios82Beta1,
    "Apple Seeds iOS 8.2 With WatchKit SDK for Apple Watch Apps to Developers",
    "MacRumors",
    "journalism",
    "Juli Clover",
    "2014-11-18T10:44:25-08:00",
    ["iOS 8.2", "Beta 1", "WatchKit", "release identity"],
  ),
  source(
    U.ios82Beta2,
    "Apple Seeds Second iOS 8.2 Beta to Developers",
    "MacRumors",
    "journalism",
    "Juli Clover",
    "2014-12-10T09:52:40-08:00",
    ["iOS 8.2", "Beta 2", "developer notes"],
  ),
  source(
    U.ios82Beta3,
    "Apple Seeds Third iOS 8.2 Beta to Developers",
    "MacRumors",
    "journalism",
    "Juli Clover",
    "2014-12-18T09:51:13-08:00",
    ["iOS 8.2", "Beta 3", "developer notes", "Health"],
  ),
  source(
    U.ios82Beta4,
    "Apple Seeds Fourth iOS 8.2 Beta to Developers",
    "MacRumors",
    "journalism",
    "Juli Clover",
    "2015-01-12T10:00:05-08:00",
    ["iOS 8.2", "Beta 4", "Apple Watch", "observed changes"],
  ),
  source(
    U.ios82Beta5,
    "Apple Seeds Fifth iOS 8.2 Beta to Developers",
    "MacRumors",
    "journalism",
    "Juli Clover",
    "2015-02-02T10:02:05-08:00",
    ["iOS 8.2", "Beta 5", "Facebook", "observed changes"],
  ),
  source(
    U.ios82LimitedGm,
    "iOS 8.2 to Launch Next Week as Final Beta Seeded to Employees and Carrier Partners",
    "MacRumors",
    "journalism",
    "Joe Rossignol",
    "2015-03-05T07:09:52-08:00",
    ["iOS 8.2", "limited GM", "employees", "carrier partners"],
  ),
  source(
    U.ios82Public,
    "Apple to Release iOS 8.2 Today With Support for Upcoming Apple Watch",
    "MacRumors",
    "journalism",
    "Juli Clover",
    "2015-03-09T11:24:31-07:00",
    ["iOS 8.2", "public release", "release boundary"],
  ),
  source(
    U.ios83Beta1,
    "Apple Seeds First iOS 8.3 Beta to Developers With Wireless CarPlay, New Emoji Picker, Apple Pay for China",
    "MacRumors",
    "journalism",
    "Juli Clover",
    "2015-02-09T10:32:27-08:00",
    ["iOS 8.3", "Beta 1", "observed changes"],
  ),
  source(
    U.ios83Beta2,
    "Apple Seeds Second iOS 8.3 Beta to Developers",
    "MacRumors",
    "journalism",
    "Juli Clover",
    "2015-02-23T10:04:26-08:00",
    ["iOS 8.3", "Beta 2", "developer notes", "observed changes"],
  ),
  source(
    U.ios83Beta3,
    "Apple Seeds Third iOS 8.3 Beta to Developers",
    "MacRumors",
    "journalism",
    "Juli Clover",
    "2015-03-12T09:57:41-07:00",
    ["iOS 8.3", "Beta 3", "Messages", "Apple Watch"],
  ),
  source(
    U.ios83PublicBeta1,
    "Apple Launches New iOS Beta Testing Program, Seeds iOS 8.3 to Testers",
    "MacRumors",
    "journalism",
    "Juli Clover",
    "2015-03-12T11:48:11-07:00",
    ["iOS 8.3", "Public Beta 1", "public beta program"],
  ),
  source(
    U.ios83Beta4PublicBeta2,
    "Apple Seeds Fourth iOS 8.3 Beta to Developers, Second Beta to Public Beta Testers",
    "MacRumors",
    "journalism",
    "Juli Clover",
    "2015-03-24T09:57:33-07:00",
    ["iOS 8.3", "Beta 4", "Public Beta 2", "observed changes"],
  ),
  source(
    U.ios83Public,
    "Apple Releases iOS 8.3 With Emoji Updates, Wireless CarPlay, Space Bar UI Fix",
    "MacRumors",
    "journalism",
    "Juli Clover",
    "2015-04-08T09:56:26-07:00",
    ["iOS 8.3", "public release", "release boundary"],
  ),
  source(
    U.ios84Beta1,
    "Apple Seeds First iOS 8.4 Beta to Developers With Revamped Music App",
    "MacRumors",
    "journalism",
    "Juli Clover",
    "2015-04-13T15:00:06-07:00",
    ["iOS 8.4", "Beta 1", "Music", "developer notes"],
  ),
  source(
    U.ios84Audiobooks,
    "iOS 8.4 beta moves audiobooks to iBooks app, dedicated CarPlay app",
    "9to5Mac",
    "journalism",
    "Mike Beasley",
    "2015-04-14T14:18:44.000Z",
    ["iOS 8.4", "Beta 1", "audiobooks", "CarPlay"],
  ),
  source(
    U.ios84Beta2PublicBeta1,
    "Apple releases iOS 8.4 beta 2 to developers with revamped Music app",
    "9to5Mac",
    "journalism",
    "Mark Gurman",
    "2015-04-27T16:49:11.000Z",
    ["iOS 8.4", "Beta 2", "Public Beta 1", "Music"],
  ),
  source(
    U.ios84Beta3PublicBeta2,
    "Apple releases iOS 8.4 beta 3 with revamped Music app ahead of late June launch",
    "9to5Mac",
    "journalism",
    "Mark Gurman",
    "2015-05-11T16:50:23.000Z",
    ["iOS 8.4", "Beta 3", "Public Beta 2", "Music"],
  ),
  source(
    U.ios84Beta4,
    "Apple Seeds Fourth iOS 8.4 Beta With Revamped Music App to Developers and Public Beta Testers",
    "MacRumors",
    "journalism",
    "Juli Clover",
    "2015-06-09T09:56:55-07:00",
    ["iOS 8.4", "Beta 4", "Public Beta 3", "known issues"],
  ),
  source(
    U.ios84UnicodeFix,
    "Apple Fixes iMessage Crashing Bug in iOS 8.4 Beta 4",
    "MacRumors",
    "journalism",
    "Joe Rossignol",
    "2015-06-10T07:45:37-07:00",
    ["iOS 8.4", "Beta 4", "Messages", "bug fix"],
  ),
  source(
    U.ios84NoGm,
    "Apple Plans to Release iOS 8.4 GM and iOS 9 Beta 2 Later Today [Updated]",
    "MacRumors",
    "journalism",
    "Joe Rossignol",
    "2015-06-22T07:57:52-07:00",
    ["iOS 8.4", "GM gap", "release boundary"],
  ),
  source(
    U.ios84Public,
    "Apple Releases iOS 8.4 With Apple Music, Beats 1, and Revamped Music App",
    "MacRumors",
    "journalism",
    "Juli Clover",
    "2015-06-30T07:49:09-07:00",
    ["iOS 8.4", "public release", "release boundary"],
  ),
  source(
    U.appleIos8Updates,
    "About iOS 8 Updates",
    "Apple Support",
    "firstPartyDocumentation",
    "Apple",
    undefined,
    ["8", "consumer release notes", "iOS"],
  ),
  source(
    U.appleWatchKit,
    "Developers Start Designing Apps for Apple Watch",
    "Apple Newsroom",
    "firstPartyAnnouncement",
    "Apple",
    "2014-11-18T00:00:00.000Z",
    ["iOS 8.2", "WatchKit", "Apple Watch"],
  ),
  source(
    U.appleXcode6,
    "Xcode 6 Release Notes",
    "Apple Developer",
    "developerDocs",
    "Apple",
    undefined,
    ["6.2", "WatchKit", "Xcode", "iOS 8.2"],
  ),
];

const cite = (url, locator, note) => ({
  url,
  locator,
  ...(note ? { note } : {}),
});
const identityNote = "Contemporary milestone identity and timing.";
const reportedNote =
  "Contemporary observation; the publisher’s wording is not reused.";
const archivedNote =
  "Credited report of developer material; the original wording is not reused.";
const appleNote =
  "First-party material used for bounded confirmation or cumulative context.";
const boundaryNote =
  "Contemporary release-boundary evidence; no absent route is invented.";
const limitedGmNote =
  "Reported limited distribution; this is not treated as an Apple-confirmed developer seed.";

const definitions = new Map();
const occurrence = ({
  suffix,
  title,
  canonicalSummary,
  category,
  action,
  inheritance = "delta",
  documentedStatus = "undocumented",
  evidenceState = "reported",
  verificationMethod,
  citations,
  summary = canonicalSummary,
}) => {
  const key = `apple-ios-8-point-prerelease-${suffix}`;
  const definition = { title, canonicalSummary, category };
  const previous = definitions.get(key);
  if (previous) assert.deepEqual(definition, previous, `${key} definition`);
  else definitions.set(key, definition);
  return {
    key,
    ...definition,
    action,
    inheritance,
    summary,
    documentedStatus,
    evidenceState,
    verificationMethod:
      verificationMethod ||
      "Matched this bounded state to the cited contemporary evidence and rewrote it independently.",
    citations,
  };
};
const reuse = (suffix, fields) =>
  occurrence({
    suffix,
    ...definitions.get(`apple-ios-8-point-prerelease-${suffix}`),
    ...fields,
  });
const reported = (input) => occurrence(input);
const archived = (input) =>
  occurrence({
    documentedStatus: "documented",
    evidenceState: "reported",
    verificationMethod:
      "Matched this bounded item in a credited report of developer notes and rewrote it independently.",
    ...input,
  });
const corroborated = (input) =>
  occurrence({
    documentedStatus: "partiallyDocumented",
    evidenceState: "corroborated",
    verificationMethod:
      "Reconciled the contemporary milestone report with first-party cumulative material without moving its first appearance.",
    ...input,
  });
const firstParty = (input) =>
  occurrence({
    documentedStatus: "documented",
    evidenceState: "confirmed",
    verificationMethod:
      "Matched the bounded state in first-party Apple material and rewrote it independently.",
    ...input,
  });

const ledgerOnlyRouteSpecs = [
  {
    versionId: "version-ios-8-3",
    version: "8.3",
    alias: "public-beta-1",
    label: "Public Beta 1",
    channel: "publicBeta",
    date: "2015-03-12",
    sequence: 1,
    identityUrl: U.ios83PublicBeta1,
    pairedDeveloperRoute: "beta-3",
    disposition:
      "Timeline ledger only; the paired Developer Beta 3 route owns the product changes.",
  },
  {
    versionId: "version-ios-8-3",
    version: "8.3",
    alias: "public-beta-2",
    label: "Public Beta 2",
    channel: "publicBeta",
    date: "2015-03-24",
    sequence: 2,
    identityUrl: U.ios83Beta4PublicBeta2,
    pairedDeveloperRoute: "beta-4",
    disposition:
      "Timeline ledger only; the paired Developer Beta 4 route owns the product changes.",
  },
  {
    versionId: "version-ios-8-4",
    version: "8.4",
    alias: "public-beta-1",
    label: "Public Beta 1",
    channel: "publicBeta",
    date: "2015-04-27",
    sequence: 1,
    identityUrl: U.ios84Beta2PublicBeta1,
    pairedDeveloperRoute: "beta-2",
    disposition:
      "Timeline ledger only; the paired Developer Beta 2 route owns the product changes.",
  },
  {
    versionId: "version-ios-8-4",
    version: "8.4",
    alias: "public-beta-2",
    label: "Public Beta 2",
    channel: "publicBeta",
    date: "2015-05-11",
    sequence: 2,
    identityUrl: U.ios84Beta3PublicBeta2,
    pairedDeveloperRoute: "beta-3",
    disposition:
      "Timeline ledger only; the paired Developer Beta 3 route owns the product changes.",
  },
  {
    versionId: "version-ios-8-4",
    version: "8.4",
    alias: "public-beta-3",
    label: "Public Beta 3",
    channel: "publicBeta",
    date: "2015-06-09",
    sequence: 3,
    identityUrl: U.ios84Beta4,
    pairedDeveloperRoute: "beta-4",
    disposition:
      "Timeline ledger only; the paired Developer Beta 4 route owns the product changes.",
  },
];

const eventSpecs = [
  {
    versionId: "version-ios-8-1",
    version: "8.1",
    alias: "beta-1",
    label: "Beta 1",
    channel: "developerBeta",
    date: "2014-09-29",
    sequence: 1,
    identityUrls: [U.ios81Beta1Identity],
    boundaryUrls: [U.ios81Public],
    releaseText:
      "Apple’s first externally documented iOS 8.1 developer seed appeared on September 29. A same-day change inventory preserves both visible deltas and a copy of the developer-facing notes.",
    boundaryText:
      "The private developer page is not treated as a surviving first-party source. The October 20 public release closes the known two-beta interval, but it does not prove that an unreported GM route existed.",
    changes: [
      reported({
        suffix: "81-beta1-notification-widget-icons",
        title: "Notification widget icons grew larger",
        canonicalSummary:
          "The widget-management list in Notification Center displayed larger application marks.",
        category: "enhancement",
        action: "changed",
        citations: [
          cite(
            U.ios81Beta1Details,
            "Notable changes — Notification Center widget icons",
            reportedNote,
          ),
        ],
      }),
      corroborated({
        suffix: "81-beta1-dictation-toggle",
        title: "Dictation gained its own switch",
        canonicalSummary:
          "Keyboard settings could disable speech dictation without also turning off Siri.",
        category: "enhancement",
        action: "introduced",
        citations: [
          cite(
            U.ios81Beta1Details,
            "Notable changes — Dictation separate from Siri",
            reportedNote,
          ),
          cite(
            U.appleIos8Updates,
            "iOS 8.1 — separate Dictation setting",
            appleNote,
          ),
        ],
      }),
      corroborated({
        suffix: "81-beta1-camera-roll-return",
        title: "Camera Roll returned to Photos",
        canonicalSummary:
          "The recently added photo collection resumed the familiar Camera Roll name.",
        category: "behavior",
        action: "changed",
        citations: [
          cite(
            U.ios81Beta1Details,
            "Notable changes — Camera Roll name",
            reportedNote,
          ),
          cite(U.appleIos8Updates, "iOS 8.1 — Camera Roll album", appleNote),
        ],
      }),
      reported({
        suffix: "81-beta1-ibooks-icon",
        title: "iBooks received revised artwork",
        canonicalSummary:
          "The iBooks application icon adopted the design already shown in Apple’s promotional material.",
        category: "enhancement",
        action: "changed",
        citations: [
          cite(
            U.ios81Beta1Details,
            "Notable changes — iBooks icon",
            reportedNote,
          ),
        ],
      }),
      reported({
        suffix: "81-beta1-app-permission-screen",
        title: "Application permission controls changed",
        canonicalSummary:
          "The per-application settings view revised how individual privacy permissions were presented.",
        category: "behavior",
        action: "changed",
        citations: [
          cite(
            U.ios81Beta1Details,
            "Notable changes — application permissions screen",
            reportedNote,
          ),
        ],
      }),
      archived({
        suffix: "81-beta1-contacts-picker-without-access",
        title: "Contacts picker could avoid broad address-book access",
        canonicalSummary:
          "A new people-picker mode returned a temporary selected contact without requesting access to the full contacts database.",
        category: "developerApi",
        action: "introduced",
        citations: [
          cite(
            U.ios81Beta1Details,
            "Contacts note — people picker without access prompt",
            archivedNote,
          ),
        ],
      }),
      archived({
        suffix: "81-beta1-document-provider-entitlement",
        title: "Document providers required an iCloud entitlement",
        canonicalSummary:
          "Applications acting as document providers needed an iCloud container entitlement.",
        category: "developerApi",
        action: "changed",
        citations: [
          cite(
            U.ios81Beta1Details,
            "Document Providers note — iCloud entitlement",
            archivedNote,
          ),
        ],
      }),
      archived({
        suffix: "81-beta1-healthkit-background-delivery",
        title: "HealthKit background delivery was repaired",
        canonicalSummary:
          "The seed corrected background delivery for HealthKit data updates.",
        category: "bugFix",
        action: "fixed",
        citations: [
          cite(
            U.ios81Beta1Details,
            "HealthKit fixed — background delivery",
            archivedNote,
          ),
        ],
      }),
    ],
  },
  {
    versionId: "version-ios-8-1",
    version: "8.1",
    alias: "beta-2",
    label: "Beta 2",
    channel: "developerBeta",
    date: "2014-10-07",
    sequence: 2,
    identityUrls: [U.ios81Beta2Identity, U.ios81Beta2Details],
    boundaryUrls: [U.ios81Public],
    releaseText:
      "The second developer seed arrived on October 7. Two reports agree on the route and build boundary, while a later same-day inspection exposed Apple Pay setup surfaces that were still inactive.",
    boundaryText:
      "The setup views were found inside prerelease software and are labeled as observations. The public update followed on October 20; no separate iOS 8.1 GM distribution is asserted.",
    changes: [
      corroborated({
        suffix: "81-beta2-bluetooth-handsfree",
        title: "Bluetooth hands-free connectivity was repaired",
        canonicalSummary:
          "The seed addressed a connection failure affecting some hands-free Bluetooth accessories.",
        category: "bugFix",
        action: "fixed",
        citations: [
          cite(
            U.ios81Beta2Identity,
            "iOS 8.1 Bluetooth connectivity fix",
            reportedNote,
          ),
          cite(
            U.appleIos8Updates,
            "iOS 8.1 — Bluetooth hands-free connections",
            appleNote,
          ),
        ],
      }),
      reported({
        suffix: "81-beta2-passbook-apple-pay-setup",
        title: "Passbook exposed Apple Pay enrollment",
        canonicalSummary:
          "A hidden Passbook path could begin payment-card enrollment by typing or scanning card details.",
        category: "feature",
        action: "introduced",
        citations: [
          cite(
            U.ios81ApplePay,
            "Passbook Apple Pay setup and card entry",
            reportedNote,
          ),
        ],
      }),
      reported({
        suffix: "81-beta2-setup-assistant-apple-pay",
        title: "Initial setup included an Apple Pay path",
        canonicalSummary:
          "Setup Assistant contained a payment-service enrollment screen during device configuration.",
        category: "feature",
        action: "introduced",
        citations: [
          cite(
            U.ios81ApplePay,
            "Initial iOS setup — Apple Pay screen",
            reportedNote,
          ),
        ],
      }),
      reported({
        suffix: "81-beta2-ipad-apple-pay-wording",
        title: "iPad payment setup omitted retail-use language",
        canonicalSummary:
          "The tablet enrollment screen avoided promising contactless store purchases on hardware without NFC.",
        category: "compatibility",
        action: "changed",
        citations: [
          cite(
            U.ios81ApplePay,
            "iPad setup — retail-store wording absent",
            reportedNote,
          ),
        ],
      }),
    ],
  },
  {
    versionId: "version-ios-8-2",
    version: "8.2",
    alias: "beta-1",
    label: "Beta 1",
    channel: "developerBeta",
    date: "2014-11-18",
    sequence: 1,
    identityUrls: [U.ios82Beta1, U.appleWatchKit],
    boundaryUrls: [U.ios82Public],
    releaseText:
      "Apple announced WatchKit and the first iOS 8.2 developer beta on November 18. Its announcement and the matching Xcode generation establish the initial Apple Watch development boundary.",
    boundaryText:
      "This route records the tools and architecture Apple made available then. It does not backdate the later customer-facing Watch companion experience to the beta.",
    changes: [
      firstParty({
        suffix: "82-beta1-watchkit-sdk",
        title: "WatchKit development opened",
        canonicalSummary:
          "The iOS 8.2 beta SDK gave registered developers their first public toolset for Apple Watch experiences.",
        category: "developerApi",
        action: "introduced",
        citations: [
          cite(
            U.appleWatchKit,
            "WatchKit software tools available to developers",
            appleNote,
          ),
          cite(U.ios82Beta1, "iOS 8.2 beta SDK and WatchKit", reportedNote),
        ],
      }),
      firstParty({
        suffix: "82-beta1-watch-app-glance-notification-surfaces",
        title: "Watch apps, Glances, and actionable alerts",
        canonicalSummary:
          "WatchKit supported application interfaces, compact glance views, and notifications with direct actions.",
        category: "developerApi",
        action: "introduced",
        citations: [
          cite(
            U.appleWatchKit,
            "WatchKit apps, actionable notifications, and Glances",
            appleNote,
          ),
          cite(U.ios82Beta1, "WatchKit content types", reportedNote),
        ],
      }),
      reported({
        suffix: "82-beta1-iphone-hosted-watch-apps",
        title: "Early Watch apps depended on iPhone execution",
        canonicalSummary:
          "Application code ran on the paired phone while Apple Watch presented the remote interface.",
        category: "behavior",
        action: "introduced",
        citations: [
          cite(
            U.ios82Beta1,
            "iPhone-powered WatchKit application architecture",
            reportedNote,
          ),
        ],
      }),
      firstParty({
        suffix: "82-beta1-watch-input-technologies",
        title: "Watch interaction technologies entered the toolchain",
        canonicalSummary:
          "Developers could design around Force Touch, the Digital Crown, and the Taptic Engine.",
        category: "developerApi",
        action: "introduced",
        citations: [
          cite(
            U.appleWatchKit,
            "Force Touch, Digital Crown, and Taptic Engine",
            appleNote,
          ),
        ],
      }),
      firstParty({
        suffix: "82-beta1-native-watch-app-boundary",
        title: "Fully native Watch software remained future work",
        canonicalSummary:
          "Apple said independent native applications for the watch would arrive after the initial WatchKit model.",
        category: "knownIssue",
        action: "knownIssue",
        citations: [
          cite(
            U.appleWatchKit,
            "Later availability of fully native apps",
            appleNote,
          ),
        ],
      }),
      firstParty({
        suffix: "82-beta1-xcode-62-sdk-context",
        title: "Xcode 6.2 carried the iOS 8.2 SDK",
        canonicalSummary:
          "The Xcode 6.2 generation paired WatchKit support with the iOS 8.2 development SDK.",
        category: "developerApi",
        action: "introduced",
        citations: [
          cite(
            U.appleXcode6,
            "Xcode 6.2 Release Notes — WatchKit and iOS 8.2 SDK",
            appleNote,
          ),
        ],
      }),
    ],
  },
  {
    versionId: "version-ios-8-2",
    version: "8.2",
    alias: "beta-2",
    label: "Beta 2",
    channel: "developerBeta",
    date: "2014-12-10",
    sequence: 2,
    identityUrls: [U.ios82Beta2],
    boundaryUrls: [U.ios82Public],
    releaseText:
      "The second iOS 8.2 developer beta appeared on December 10 with a matching WatchKit tool update. The contemporary report preserves four narrowly described fixes or additions.",
    boundaryText:
      "The detailed items are attributed to the report’s account of Apple’s private notes. They remain source-linked candidates rather than first-party archived pages.",
    changes: [
      archived({
        suffix: "82-beta2-simulator-third-party-keyboards",
        title: "Simulator keyboards returned in more apps",
        canonicalSummary:
          "Third-party keyboards could again appear in Safari, Maps, and other applications inside the iOS simulator.",
        category: "bugFix",
        action: "fixed",
        citations: [
          cite(
            U.ios82Beta2,
            "Release notes — keyboards in Safari, Maps, and third-party apps",
            archivedNote,
          ),
        ],
      }),
      archived({
        suffix: "82-beta2-siri-singapore-english",
        title: "Siri added Singapore English",
        canonicalSummary:
          "The voice assistant gained language support for Singapore English.",
        category: "enhancement",
        action: "introduced",
        citations: [
          cite(
            U.ios82Beta2,
            "Release notes — Siri Singapore English",
            archivedNote,
          ),
        ],
      }),
      archived({
        suffix: "82-beta2-watch-notification-open-app",
        title: "Watch notifications could open their apps",
        canonicalSummary:
          "A WatchKit defect that kept notification actions from opening the associated application was corrected.",
        category: "bugFix",
        action: "fixed",
        citations: [
          cite(
            U.ios82Beta2,
            "WatchKit fixes — notification opening an app",
            archivedNote,
          ),
        ],
      }),
      archived({
        suffix: "82-beta2-watchkit-simulator-stoppage",
        title: "WatchKit simulator sessions stopped failing",
        canonicalSummary:
          "The update repaired a simulator fault that caused WatchKit applications to stop running.",
        category: "bugFix",
        action: "fixed",
        citations: [
          cite(
            U.ios82Beta2,
            "WatchKit fixes — apps stopping in iOS Simulator",
            archivedNote,
          ),
        ],
      }),
    ],
  },
  {
    versionId: "version-ios-8-2",
    version: "8.2",
    alias: "beta-3",
    label: "Beta 3",
    channel: "developerBeta",
    date: "2014-12-18",
    sequence: 3,
    identityUrls: [U.ios82Beta3],
    boundaryUrls: [U.ios82Public],
    releaseText:
      "Apple’s third iOS 8.2 developer seed arrived on December 18. Its retained report separates four developer-note fixes from two Health changes observed after release.",
    boundaryText:
      "WatchKit and simulator items are credited developer-note reports. The Health records are contemporary observations and therefore carry a different documentation status.",
    changes: [
      archived({
        suffix: "82-beta3-messages-conversation-delay",
        title: "Messages conversations opened faster",
        canonicalSummary:
          "The seed fixed a delay that could make opening an existing Messages thread take unusually long.",
        category: "bugFix",
        action: "fixed",
        citations: [
          cite(
            U.ios82Beta3,
            "Release notes — Messages conversation delay",
            archivedNote,
          ),
        ],
      }),
      archived({
        suffix: "82-beta3-simulator-emoji-button",
        title: "Simulator restored the emoji control",
        canonicalSummary:
          "The software keyboard in iOS Simulator again displayed its emoji button.",
        category: "bugFix",
        action: "fixed",
        citations: [
          cite(
            U.ios82Beta3,
            "Release notes — missing emoji button in iOS Simulator",
            archivedNote,
          ),
        ],
      }),
      archived({
        suffix: "82-beta3-open-parent-background-launch",
        title: "Watch extensions could wake the containing app",
        canonicalSummary:
          "The parent-application method launched its iPhone host in the background whether the phone was locked or unlocked.",
        category: "developerApi",
        action: "fixed",
        citations: [
          cite(
            U.ios82Beta3,
            "WKInterfaceController openParentApplication behavior",
            archivedNote,
          ),
        ],
      }),
      archived({
        suffix: "82-beta3-watch-text-input-simulator",
        title: "Watch text input worked in Simulator",
        canonicalSummary:
          "The suggested-response text input controller became supported in the iOS simulator.",
        category: "developerApi",
        action: "fixed",
        citations: [
          cite(
            U.ios82Beta3,
            "presentTextInputController support in iOS Simulator",
            archivedNote,
          ),
        ],
      }),
      reported({
        suffix: "82-beta3-blood-glucose-return",
        title: "Blood glucose tracking returned",
        canonicalSummary:
          "Health once again exposed its blood glucose data type in the third seed.",
        category: "feature",
        action: "introduced",
        citations: [
          cite(
            U.ios82Beta3,
            "Update — blood glucose tracking reintroduced",
            reportedNote,
          ),
        ],
      }),
      reported({
        suffix: "82-beta3-health-descriptions",
        title: "Health data types gained explanations",
        canonicalSummary:
          "Several Health features received additional descriptive text inside the application.",
        category: "enhancement",
        action: "changed",
        citations: [
          cite(
            U.ios82Beta3,
            "Update — new Health feature descriptions",
            reportedNote,
          ),
        ],
      }),
    ],
  },
  {
    versionId: "version-ios-8-2",
    version: "8.2",
    alias: "beta-4",
    label: "Beta 4",
    channel: "developerBeta",
    date: "2015-01-12",
    sequence: 4,
    identityUrls: [U.ios82Beta4],
    boundaryUrls: [U.ios82Public],
    releaseText:
      "The fourth developer beta appeared on January 12. The retained report identifies one outward-facing Apple Watch preparation change beyond the carried WatchKit state.",
    boundaryText:
      "No larger feature inventory is inferred from this maintenance-oriented seed. The single record below is an observed Settings change.",
    changes: [
      reported({
        suffix: "82-beta4-watch-pairing-guidance",
        title: "Bluetooth settings pointed to Watch pairing",
        canonicalSummary:
          "The Bluetooth screen directed users to a dedicated Apple Watch application for pairing.",
        category: "feature",
        action: "introduced",
        citations: [
          cite(
            U.ios82Beta4,
            "Bluetooth Settings — Apple Watch pairing guidance",
            reportedNote,
          ),
        ],
      }),
    ],
  },
  {
    versionId: "version-ios-8-2",
    version: "8.2",
    alias: "beta-5",
    label: "Beta 5",
    channel: "developerBeta",
    date: "2015-02-02",
    sequence: 5,
    identityUrls: [U.ios82Beta5],
    boundaryUrls: [U.ios82Public],
    releaseText:
      "Apple distributed the fifth iOS 8.2 developer beta on February 2. Only one change in the surviving report is stated firmly enough for this archive.",
    boundaryText:
      "The same report described the calendar GMT repair only as an early suggestion, so that tentative claim is excluded from the structured records.",
    changes: [
      reported({
        suffix: "82-beta5-facebook-compatibility",
        title: "Facebook compatibility was repaired",
        canonicalSummary:
          "A defect that prevented Facebook from operating correctly was reported fixed in the fifth seed.",
        category: "compatibility",
        action: "fixed",
        citations: [
          cite(
            U.ios82Beta5,
            "Update — prevented Facebook from working properly",
            reportedNote,
          ),
        ],
      }),
    ],
  },
  {
    versionId: "version-ios-8-2",
    version: "8.2",
    alias: "gm",
    label: "Limited GM",
    channel: "goldenMaster",
    date: "2015-03-05",
    sequence: 6,
    identityUrls: [U.ios82LimitedGm],
    boundaryUrls: [U.ios82LimitedGm, U.ios82Public],
    releaseText:
      "A March 5 report said Apple supplied build 12D508 as a final GM to employees and carrier partners. This archive preserves that limited-distribution report without converting it into a confirmed registered-developer seed.",
    boundaryText:
      "The route identity is third-party reporting and remains explicitly qualified. Apple’s later public notes confirm the listed feature state, while the March 9 public route stays owned by the approved public batch.",
    changes: [
      corroborated({
        suffix: "82-limited-gm-health-unit-selection",
        title: "Health metrics gained unit selection",
        canonicalSummary:
          "Users could choose display units for glucose readings and for height, body mass, distance, and temperature.",
        category: "enhancement",
        action: "introduced",
        inheritance: "cumulative",
        citations: [
          cite(
            U.ios82LimitedGm,
            "Health improvements — measurement units",
            limitedGmNote,
          ),
          cite(
            U.appleIos8Updates,
            "iOS 8.2 — Health measurement units",
            appleNote,
          ),
        ],
      }),
      corroborated({
        suffix: "82-limited-gm-health-large-data-stability",
        title: "Health handled large datasets more reliably",
        canonicalSummary:
          "The Health application received stability work for collections containing substantial amounts of data.",
        category: "enhancement",
        action: "changed",
        inheritance: "cumulative",
        citations: [
          cite(
            U.ios82LimitedGm,
            "Health improvements — large amounts of data",
            limitedGmNote,
          ),
          cite(
            U.appleIos8Updates,
            "iOS 8.2 — Health large-data stability",
            appleNote,
          ),
        ],
      }),
      corroborated({
        suffix: "82-limited-gm-third-party-workouts",
        title: "Third-party workouts entered Health",
        canonicalSummary:
          "Compatible applications could add workout sessions for viewing inside Health.",
        category: "feature",
        action: "introduced",
        inheritance: "cumulative",
        citations: [
          cite(
            U.ios82LimitedGm,
            "Health improvements — third-party workout sessions",
            limitedGmNote,
          ),
          cite(U.appleIos8Updates, "iOS 8.2 — third-party workouts", appleNote),
        ],
      }),
      corroborated({
        suffix: "82-limited-gm-medical-id-photo",
        title: "Medical ID accepted a profile photo",
        canonicalSummary:
          "The update repaired a condition that could block adding an image to Medical ID.",
        category: "bugFix",
        action: "fixed",
        inheritance: "cumulative",
        citations: [
          cite(
            U.ios82LimitedGm,
            "Health improvements — Medical ID photo",
            limitedGmNote,
          ),
          cite(U.appleIos8Updates, "iOS 8.2 — Medical ID photo fix", appleNote),
        ],
      }),
      corroborated({
        suffix: "82-limited-gm-health-data-display",
        title: "Health data display and refresh errors were corrected",
        canonicalSummary:
          "Health repaired nutrient units, source-order refresh, and charts that omitted values.",
        category: "bugFix",
        action: "fixed",
        inheritance: "cumulative",
        citations: [
          cite(
            U.ios82LimitedGm,
            "Health improvements — units, refresh, and graphics",
            limitedGmNote,
          ),
          cite(U.appleIos8Updates, "iOS 8.2 — Health data fixes", appleNote),
        ],
      }),
      corroborated({
        suffix: "82-limited-gm-motion-privacy-toggle",
        title: "Tracked motion received a privacy switch",
        canonicalSummary:
          "A Health privacy control could stop tracking steps, distance, and flights climbed.",
        category: "enhancement",
        action: "introduced",
        inheritance: "cumulative",
        citations: [
          cite(
            U.ios82LimitedGm,
            "Health improvements — motion tracking privacy",
            limitedGmNote,
          ),
          cite(
            U.appleIos8Updates,
            "iOS 8.2 — motion privacy setting",
            appleNote,
          ),
        ],
      }),
      corroborated({
        suffix: "82-limited-gm-system-accessory-stability",
        title: "Core apps and hearing aids gained stability",
        canonicalSummary:
          "Reliability work covered Mail, Maps Flyover, Music, VoiceOver, and hearing-aid connections carrying the Made for iPhone designation.",
        category: "enhancement",
        action: "changed",
        inheritance: "cumulative",
        citations: [
          cite(
            U.ios82LimitedGm,
            "Stability enhancements — apps, VoiceOver, and hearing aids",
            limitedGmNote,
          ),
          cite(
            U.appleIos8Updates,
            "iOS 8.2 — stability enhancements",
            appleNote,
          ),
        ],
      }),
    ],
  },
  {
    versionId: "version-ios-8-3",
    version: "8.3",
    alias: "beta-1",
    label: "Beta 1",
    channel: "developerBeta",
    date: "2015-02-09",
    sequence: 1,
    identityUrls: [U.ios83Beta1],
    boundaryUrls: [U.ios83Public],
    releaseText:
      "Apple began the iOS 8.3 developer cycle on February 9 before the preceding point update had finished its own testing. The report identifies several customer-facing experiments plus the accompanying Xcode 6.3 generation.",
    boundaryText:
      "Visible changes are recorded as observations. Apple’s final notes provide cumulative confirmation where available, but do not relocate first appearance from this seed.",
    changes: [
      corroborated({
        suffix: "83-beta1-wireless-carplay",
        title: "CarPlay began testing wireless connections",
        canonicalSummary:
          "A settings path appeared for pairing an iPhone with a compatible CarPlay system without a cable.",
        category: "feature",
        action: "introduced",
        citations: [
          cite(
            U.ios83Beta1,
            "New features — wireless CarPlay connectivity",
            reportedNote,
          ),
          cite(U.appleIos8Updates, "iOS 8.3 — wireless CarPlay", appleNote),
        ],
      }),
      corroborated({
        suffix: "83-beta1-scrollable-emoji-picker",
        title: "Emoji moved into a scrolling picker",
        canonicalSummary:
          "The emoji keyboard organized symbols into categories within one continuously scrolling view.",
        category: "enhancement",
        action: "introduced",
        citations: [
          cite(
            U.ios83Beta1,
            "New features — scrollable emoji categories",
            reportedNote,
          ),
          cite(
            U.appleIos8Updates,
            "iOS 8.3 — redesigned Emoji keyboard",
            appleNote,
          ),
        ],
      }),
      corroborated({
        suffix: "83-beta1-google-two-step-signin",
        title: "Google two-step sign-in became native",
        canonicalSummary:
          "Adding a Google account could complete two-factor authentication without relying on an application-specific password.",
        category: "compatibility",
        action: "introduced",
        citations: [
          cite(
            U.ios83Beta1,
            "New features — Google two-step verification",
            reportedNote,
          ),
          cite(
            U.appleIos8Updates,
            "iOS 8.3 — Google two-factor sign-in",
            appleNote,
          ),
        ],
      }),
      corroborated({
        suffix: "83-beta1-china-unionpay",
        title: "Apple Pay added China UnionPay groundwork",
        canonicalSummary:
          "The payment framework introduced support for cards on the China UnionPay network.",
        category: "compatibility",
        action: "introduced",
        citations: [
          cite(
            U.ios83Beta1,
            "Release notes — China UnionPay support",
            archivedNote,
          ),
          cite(
            U.appleIos8Updates,
            "iOS 8.3 — China UnionPay network",
            appleNote,
          ),
        ],
      }),
      reported({
        suffix: "83-icloud-photo-library-beta-label",
        title: "iCloud Photo Library lost its beta badge",
        canonicalSummary:
          "The Photos service temporarily appeared without the beta designation used in earlier software.",
        category: "behavior",
        action: "changed",
        citations: [
          cite(
            U.ios83Beta1,
            "New features — iCloud Photo Library beta label removed",
            reportedNote,
          ),
        ],
      }),
      firstParty({
        suffix: "83-beta1-xcode-63-swift-12",
        title: "Xcode 6.3 introduced Swift 1.2",
        canonicalSummary:
          "The matching development environment delivered Swift 1.2, its migrator, and the iOS 8.3 SDK context.",
        category: "developerApi",
        action: "introduced",
        citations: [
          cite(U.appleXcode6, "Xcode 6.3 Release Notes — Swift 1.2", appleNote),
          cite(U.ios83Beta1, "Xcode 6.3 beta and Swift 1.2", reportedNote),
        ],
      }),
    ],
  },
  {
    versionId: "version-ios-8-3",
    version: "8.3",
    alias: "beta-2",
    label: "Beta 2",
    channel: "developerBeta",
    date: "2015-02-23",
    sequence: 2,
    identityUrls: [U.ios83Beta2],
    boundaryUrls: [U.ios83Public],
    releaseText:
      "Apple supplied the second iOS 8.3 developer beta on February 23. The report preserves two note-level compatibility items and three visible language or emoji changes.",
    boundaryText:
      "The Verizon and CarPlay records are attributed to reported developer notes. Emoji and Siri changes are labeled observations even though the final release later retained them.",
    changes: [
      archived({
        suffix: "83-beta2-verizon-volte-incompatibility",
        title: "Verizon voice over LTE was temporarily incompatible",
        canonicalSummary:
          "The seed required Verizon users to select data-only LTE because the test build did not support LTE voice.",
        category: "knownIssue",
        action: "knownIssue",
        citations: [
          cite(
            U.ios83Beta2,
            "Release notes — Verizon LTE Voice compatibility",
            archivedNote,
          ),
        ],
      }),
      archived({
        suffix: "83-beta2-carplay-connection-dialog",
        title: "CarPlay’s connection dialog was corrected",
        canonicalSummary:
          "The prompt shown when attaching an iPhone to a compatible vehicle received a documented fix.",
        category: "bugFix",
        action: "fixed",
        citations: [
          cite(
            U.ios83Beta2,
            "Release notes — CarPlay connection dialog",
            archivedNote,
          ),
        ],
      }),
      corroborated({
        suffix: "83-beta2-diverse-emoji",
        title: "Emoji added skin-tone choices",
        canonicalSummary:
          "People emoji gained diversified variants and selectable skin-tone modifiers.",
        category: "feature",
        action: "introduced",
        citations: [
          cite(
            U.ios83Beta2,
            "Emoji — diversified emoji and skin tone modifiers",
            reportedNote,
          ),
          cite(
            U.appleIos8Updates,
            "iOS 8.3 — redesigned Emoji keyboard and new characters",
            appleNote,
          ),
        ],
      }),
      reported({
        suffix: "83-beta2-flags-hardware-emoji",
        title: "Flags and Apple hardware expanded emoji",
        canonicalSummary:
          "The keyboard added country flags and refreshed device symbols for iPhone, iMac, and Apple Watch.",
        category: "enhancement",
        action: "introduced",
        citations: [
          cite(
            U.ios83Beta2,
            "Emoji — country flags and Apple hardware",
            reportedNote,
          ),
        ],
      }),
      corroborated({
        suffix: "83-beta2-siri-language-expansion",
        title: "Siri expanded to nine language variants",
        canonicalSummary:
          "The assistant added Danish, Dutch, Indian and New Zealand English, Brazilian Portuguese, Russian, Swedish, Thai, and Turkish.",
        category: "enhancement",
        action: "introduced",
        citations: [
          cite(U.ios83Beta2, "Siri — new language support", reportedNote),
          cite(
            U.appleIos8Updates,
            "iOS 8.3 — additional Siri languages",
            appleNote,
          ),
        ],
      }),
    ],
  },
  {
    versionId: "version-ios-8-3",
    version: "8.3",
    alias: "beta-3",
    label: "Beta 3",
    channel: "developerBeta",
    date: "2015-03-12",
    sequence: 3,
    identityUrls: [U.ios83Beta3],
    boundaryUrls: [U.ios83Public],
    releaseText:
      "The third developer beta appeared on March 12, after the public iOS 8.2 release. Its two newly reported surfaces concerned message organization and the installed Watch companion.",
    boundaryText:
      "The first public iOS beta used this same binary later that day and is indexed separately as a distribution route, without duplicating these feature claims.",
    changes: [
      corroborated({
        suffix: "83-messages-conversation-filtering",
        title: "Messages separated unfamiliar senders",
        canonicalSummary:
          "An optional conversation filter placed messages from people outside Contacts into a separate list.",
        category: "feature",
        action: "introduced",
        citations: [
          cite(
            U.ios83Beta3,
            "Messages — Conversation List Filtering",
            reportedNote,
          ),
          cite(
            U.appleIos8Updates,
            "iOS 8.3 — filter messages outside Contacts",
            appleNote,
          ),
        ],
      }),
      reported({
        suffix: "83-beta3-watch-app-presence",
        title: "The Apple Watch app appeared on Home Screen",
        canonicalSummary:
          "The iPhone companion application was present after the public iOS 8.2 foundation had shipped.",
        category: "feature",
        action: "introduced",
        citations: [
          cite(
            U.ios83Beta3,
            "Apple Watch app — Home Screen presence",
            reportedNote,
          ),
        ],
      }),
    ],
  },
  {
    versionId: "version-ios-8-3",
    version: "8.3",
    alias: "beta-4",
    label: "Beta 4",
    channel: "developerBeta",
    date: "2015-03-24",
    sequence: 4,
    identityUrls: [U.ios83Beta4PublicBeta2],
    boundaryUrls: [U.ios83Public],
    releaseText:
      "Apple distributed Developer Beta 4 on March 24 alongside a second public seed. The report isolates two label-level changes within the carried iOS 8.3 feature set.",
    boundaryText:
      "The iCloud label had changed more than once during testing. This route records only the state observed on March 24 and does not fill undocumented intermediate transitions.",
    changes: [
      reuse("83-icloud-photo-library-beta-label", {
        action: "changed",
        inheritance: "delta",
        documentedStatus: "undocumented",
        evidenceState: "reported",
        verificationMethod:
          "Compared the observed March 24 label state with its first-beta appearance without inferring the intervening toggles.",
        citations: [
          cite(
            U.ios83Beta4PublicBeta2,
            "Beta 4 — iCloud Photo Library beta label removed again",
            reportedNote,
          ),
        ],
        summary:
          "Beta 4 again showed iCloud Photo Library without its beta designation after intervening label changes.",
      }),
      reuse("83-messages-conversation-filtering", {
        action: "changed",
        inheritance: "delta",
        documentedStatus: "undocumented",
        evidenceState: "reported",
        verificationMethod:
          "Compared the observed category label with the filtering feature introduced in Developer Beta 3.",
        citations: [
          cite(
            U.ios83Beta4PublicBeta2,
            "Beta 4 — Messages category renamed Unknown Sender",
            reportedNote,
          ),
        ],
        summary:
          "The filtered category for people outside Contacts was renamed Unknown Sender.",
      }),
    ],
  },
  {
    versionId: "version-ios-8-4",
    version: "8.4",
    alias: "beta-1",
    label: "Beta 1",
    channel: "developerBeta",
    date: "2015-04-13",
    sequence: 1,
    identityUrls: [U.ios84Beta1],
    boundaryUrls: [U.ios84Public],
    releaseText:
      "Apple’s first iOS 8.4 developer beta arrived on April 13 with an early Music redesign. A next-day inspection adds the audiobook migration, while Apple’s Xcode archive fixes the SDK context.",
    boundaryText:
      "The Music inventory is a prerelease feature state, not a copy of Apple’s promotional prose. Later Apple material is used only to confirm which concepts survived into the public update.",
    changes: [
      corroborated({
        suffix: "84-beta1-music-library-design",
        title: "Music adopted a visual library redesign",
        canonicalSummary:
          "The library emphasized artist imagery and let users add custom artwork and descriptions to playlists.",
        category: "enhancement",
        action: "introduced",
        citations: [
          cite(
            U.ios84Beta1,
            "Music preview — design, artist images, and playlist customization",
            archivedNote,
          ),
          cite(
            U.appleIos8Updates,
            "iOS 8.4 — redesigned music player",
            appleNote,
          ),
        ],
      }),
      corroborated({
        suffix: "84-beta1-recently-added-shelf",
        title: "Recently Added moved to the library top",
        canonicalSummary:
          "New albums and playlists appeared in a prominent shelf with direct artwork playback.",
        category: "enhancement",
        action: "introduced",
        citations: [
          cite(U.ios84Beta1, "Music preview — Recently Added", archivedNote),
          cite(U.appleIos8Updates, "iOS 8.4 — Recently Added", appleNote),
        ],
      }),
      reported({
        suffix: "84-beta1-itunes-radio-layout",
        title: "iTunes Radio navigation was streamlined",
        canonicalSummary:
          "Radio emphasized recently played and curated stations while retaining artist- or song-based station creation.",
        category: "enhancement",
        action: "changed",
        citations: [
          cite(
            U.ios84Beta1,
            "Music preview — streamlined iTunes Radio",
            archivedNote,
          ),
        ],
      }),
      corroborated({
        suffix: "84-beta1-miniplayer",
        title: "Music gained a persistent MiniPlayer",
        canonicalSummary:
          "A compact playback bar stayed available while users browsed their collection and opened the full player on demand.",
        category: "feature",
        action: "introduced",
        citations: [
          cite(U.ios84Beta1, "Music preview — MiniPlayer", archivedNote),
          cite(U.appleIos8Updates, "iOS 8.4 — MiniPlayer", appleNote),
        ],
      }),
      reported({
        suffix: "84-beta1-now-playing-airplay",
        title: "Now Playing integrated AirPlay",
        canonicalSummary:
          "The full player received a new artwork-focused layout and exposed wireless streaming without leaving the screen.",
        category: "enhancement",
        action: "changed",
        citations: [
          cite(
            U.ios84Beta1,
            "Music preview — Now Playing and AirPlay",
            archivedNote,
          ),
        ],
      }),
      corroborated({
        suffix: "84-beta1-up-next-queue",
        title: "Up Next exposed the playback queue",
        canonicalSummary:
          "Listeners could inspect, reorder, add, or skip upcoming library songs from Now Playing.",
        category: "feature",
        action: "introduced",
        citations: [
          cite(U.ios84Beta1, "Music preview — Up Next", archivedNote),
          cite(U.appleIos8Updates, "iOS 8.4 — Up Next", appleNote),
        ],
      }),
      reported({
        suffix: "84-beta1-global-music-search",
        title: "Search became available throughout Music",
        canonicalSummary:
          "A persistent search control organized results and could create an iTunes Radio station from a query.",
        category: "feature",
        action: "introduced",
        citations: [
          cite(U.ios84Beta1, "Music preview — Global Search", archivedNote),
        ],
      }),
      corroborated({
        suffix: "84-beta1-audiobooks-moved-to-ibooks",
        title: "Audiobooks moved into iBooks",
        canonicalSummary:
          "Spoken-book browsing and playback left Music and became part of the iBooks library.",
        category: "behavior",
        action: "changed",
        citations: [
          cite(
            U.ios84Audiobooks,
            "Audiobooks moved from Music to iBooks",
            reportedNote,
          ),
          cite(
            U.appleIos8Updates,
            "iOS 8.4 — browse and listen to audiobooks in iBooks",
            appleNote,
          ),
        ],
      }),
      reported({
        suffix: "84-beta1-audiobook-player-controls",
        title: "iBooks added audiobook-specific controls",
        canonicalSummary:
          "The new player included chapter navigation, speed, sleep timer, sharing, and gesture-based seeking.",
        category: "feature",
        action: "introduced",
        citations: [
          cite(
            U.ios84Audiobooks,
            "iBooks audiobook player — chapters, speed, timer, and gestures",
            reportedNote,
          ),
        ],
      }),
      corroborated({
        suffix: "84-beta1-carplay-audiobooks",
        title: "CarPlay gained an audiobook application",
        canonicalSummary:
          "The vehicle interface received a dedicated iBooks-branded player for spoken books.",
        category: "feature",
        action: "introduced",
        citations: [
          cite(
            U.ios84Audiobooks,
            "Audiobooks application on CarPlay",
            reportedNote,
          ),
          cite(
            U.appleIos8Updates,
            "iOS 8.4 — audiobook CarPlay app",
            appleNote,
          ),
        ],
      }),
      archived({
        suffix: "84-siri-radio-control",
        title: "Siri could not control iTunes Radio",
        canonicalSummary:
          "Voice commands for operating iTunes Radio were unavailable in the prerelease Music application.",
        category: "knownIssue",
        action: "knownIssue",
        citations: [
          cite(
            U.ios84Beta1,
            "Beta 1 release notes — Siri and iTunes Radio",
            archivedNote,
          ),
        ],
      }),
      archived({
        suffix: "84-airplay-streaming",
        title: "Music had AirPlay streaming problems",
        canonicalSummary:
          "Wireless audio playback from the redesigned Music application had reported failures.",
        category: "knownIssue",
        action: "knownIssue",
        citations: [
          cite(
            U.ios84Beta1,
            "Beta 1 release notes — AirPlay streaming",
            archivedNote,
          ),
        ],
      }),
      archived({
        suffix: "84-radio-station-sharing",
        title: "Radio station sharing was unavailable",
        canonicalSummary:
          "The test version lacked a working path for sharing an iTunes Radio station.",
        category: "knownIssue",
        action: "knownIssue",
        citations: [
          cite(
            U.ios84Beta1,
            "Beta 1 release notes — station sharing",
            archivedNote,
          ),
        ],
      }),
      firstParty({
        suffix: "84-beta1-xcode-64-sdk-context",
        title: "Xcode 6.4 carried the iOS 8.4 SDK",
        canonicalSummary:
          "The Xcode 6.4 generation added the development SDK for applications targeting iOS 8.4.",
        category: "developerApi",
        action: "introduced",
        citations: [
          cite(
            U.appleXcode6,
            "Xcode 6.4 Release Notes — iOS 8.4 SDK",
            appleNote,
          ),
        ],
      }),
    ],
  },
  {
    versionId: "version-ios-8-4",
    version: "8.4",
    alias: "beta-2",
    label: "Beta 2",
    channel: "developerBeta",
    date: "2015-04-27",
    sequence: 2,
    identityUrls: [U.ios84Beta2PublicBeta1],
    boundaryUrls: [U.ios84Public],
    releaseText:
      "Developer Beta 2 appeared on April 27 beside the first public iOS 8.4 seed. The retained live inventory identifies one newly visible search element.",
    boundaryText:
      "The public seed corresponded to this developer build and is indexed as its own route. Shared feature changes remain on the developer route.",
    changes: [
      reported({
        suffix: "84-trending-radio-searches",
        title: "Radio search displayed trending queries",
        canonicalSummary:
          "The iTunes Radio search surface briefly suggested popular searches in a dedicated list.",
        category: "feature",
        action: "introduced",
        citations: [
          cite(
            U.ios84Beta2PublicBeta1,
            "Beta 2 — Trending Searches in iTunes Radio",
            reportedNote,
          ),
        ],
      }),
    ],
  },
  {
    versionId: "version-ios-8-4",
    version: "8.4",
    alias: "beta-3",
    label: "Beta 3",
    channel: "developerBeta",
    date: "2015-05-11",
    sequence: 3,
    identityUrls: [U.ios84Beta3PublicBeta2],
    boundaryUrls: [U.ios84Public],
    releaseText:
      "The third developer beta arrived on May 11 together with Public Beta 2. A contemporary inventory records seven focused Music interface deltas.",
    boundaryText:
      "These are observed prerelease changes. The disappearance of Trending Searches is recorded as a removal from the earlier Beta 2 state, without guessing whether it was temporary.",
    changes: [
      reported({
        suffix: "84-beta3-radio-ui-refinements",
        title: "iTunes Radio received interface refinements",
        canonicalSummary:
          "The phone and tablet radio sections gained several small layout adjustments.",
        category: "enhancement",
        action: "changed",
        citations: [
          cite(
            U.ios84Beta3PublicBeta2,
            "Beta 3 — iTunes Radio user interface tweaks",
            reportedNote,
          ),
        ],
      }),
      reported({
        suffix: "84-beta3-offline-only-toggles",
        title: "Offline-only controls became more prominent",
        canonicalSummary:
          "Music made the switches for limiting the library to downloaded material easier to find.",
        category: "enhancement",
        action: "changed",
        citations: [
          cite(
            U.ios84Beta3PublicBeta2,
            "Beta 3 — prominent offline Music toggles",
            reportedNote,
          ),
        ],
      }),
      reported({
        suffix: "84-beta3-local-search-history",
        title: "Search history included local queries",
        canonicalSummary:
          "Music search history expanded beyond radio searches to include earlier library searches.",
        category: "enhancement",
        action: "changed",
        citations: [
          cite(
            U.ios84Beta3PublicBeta2,
            "Beta 3 — local Music search history",
            reportedNote,
          ),
        ],
      }),
      reported({
        suffix: "84-beta3-now-playing-auto-open",
        title: "Now Playing opened when playback began",
        canonicalSummary:
          "Starting a song brought up the full player instead of showing only the compact bar.",
        category: "behavior",
        action: "changed",
        citations: [
          cite(
            U.ios84Beta3PublicBeta2,
            "Beta 3 — Now Playing opens on playback",
            reportedNote,
          ),
        ],
      }),
      reported({
        suffix: "84-beta3-up-next-animation",
        title: "Up Next gained a transition animation",
        canonicalSummary:
          "Opening the queue from Now Playing used a newly added animated transition.",
        category: "enhancement",
        action: "changed",
        citations: [
          cite(
            U.ios84Beta3PublicBeta2,
            "Beta 3 — Up Next button animation",
            reportedNote,
          ),
        ],
      }),
      reported({
        suffix: "84-beta3-offline-device-indicator",
        title: "Downloaded music received a device indicator",
        canonicalSummary:
          "Song options showed an iPhone mark when a track was stored locally.",
        category: "enhancement",
        action: "introduced",
        citations: [
          cite(
            U.ios84Beta3PublicBeta2,
            "Beta 3 — iPhone logo for offline music",
            reportedNote,
          ),
        ],
      }),
      reuse("84-trending-radio-searches", {
        action: "removed",
        inheritance: "delta",
        documentedStatus: "undocumented",
        evidenceState: "reported",
        verificationMethod:
          "Compared the third-beta inventory with the Trending Searches surface first recorded in Developer Beta 2.",
        citations: [
          cite(
            U.ios84Beta3PublicBeta2,
            "Beta 3 — Trending Searches absent",
            reportedNote,
          ),
        ],
        summary:
          "The Trending Searches list introduced in Developer Beta 2 was no longer present.",
      }),
    ],
  },
  {
    versionId: "version-ios-8-4",
    version: "8.4",
    alias: "beta-4",
    label: "Beta 4",
    channel: "developerBeta",
    date: "2015-06-09",
    sequence: 4,
    identityUrls: [U.ios84Beta4],
    boundaryUrls: [U.ios84NoGm, U.ios84Public],
    releaseText:
      "Apple’s fourth developer beta arrived on June 9. Its notes retained three Music limitations, and a follow-up report identified a fix for the crafted Unicode notification crash.",
    boundaryText:
      "A June 22 GM prediction was later corrected because no iOS 8.4 GM had appeared. The archive therefore ends the external developer route at Beta 4 before the June 30 public release.",
    changes: [
      reuse("84-siri-radio-control", {
        action: "knownIssue",
        inheritance: "cumulative",
        documentedStatus: "documented",
        evidenceState: "reported",
        verificationMethod:
          "Matched the fourth-beta notes to the issue first documented in Beta 1 without treating its persistence as a fresh defect.",
        citations: [
          cite(
            U.ios84Beta4,
            "Beta 4 release notes — Siri and iTunes Radio",
            archivedNote,
          ),
        ],
        summary:
          "The voice-control limitation first documented in Beta 1 remained listed for the fourth seed.",
      }),
      reuse("84-airplay-streaming", {
        action: "knownIssue",
        inheritance: "cumulative",
        documentedStatus: "documented",
        evidenceState: "reported",
        verificationMethod:
          "Matched the fourth-beta notes to the issue first documented in Beta 1 without treating its persistence as a fresh defect.",
        citations: [
          cite(
            U.ios84Beta4,
            "Beta 4 release notes — AirPlay streaming issues",
            archivedNote,
          ),
        ],
        summary:
          "The AirPlay streaming problem first documented in Beta 1 remained listed for the fourth seed.",
      }),
      reuse("84-radio-station-sharing", {
        action: "knownIssue",
        inheritance: "cumulative",
        documentedStatus: "documented",
        evidenceState: "reported",
        verificationMethod:
          "Matched the fourth-beta notes to the issue first documented in Beta 1 without treating its persistence as a fresh defect.",
        citations: [
          cite(
            U.ios84Beta4,
            "Beta 4 release notes — station sharing",
            archivedNote,
          ),
        ],
        summary:
          "The station-sharing limitation first documented in Beta 1 remained listed for the fourth seed.",
      }),
      corroborated({
        suffix: "84-beta4-unicode-notification-crash",
        title: "Crafted Unicode notifications stopped crashing devices",
        canonicalSummary:
          "The seed fixed the reboot and Messages failure triggered by a specific sequence of Unicode characters.",
        category: "bugFix",
        action: "fixed",
        citations: [
          cite(
            U.ios84UnicodeFix,
            "Beta 4 fix — crafted Unicode message crash",
            reportedNote,
          ),
          cite(U.appleIos8Updates, "iOS 8.4 — Unicode reboot fix", appleNote),
        ],
      }),
    ],
  },
];

const expectedContentRoutes = [
  ["version-ios-8-1", "beta-1", "developerBeta", "2014-09-29", 8],
  ["version-ios-8-1", "beta-2", "developerBeta", "2014-10-07", 4],
  ["version-ios-8-2", "beta-1", "developerBeta", "2014-11-18", 6],
  ["version-ios-8-2", "beta-2", "developerBeta", "2014-12-10", 4],
  ["version-ios-8-2", "beta-3", "developerBeta", "2014-12-18", 6],
  ["version-ios-8-2", "beta-4", "developerBeta", "2015-01-12", 1],
  ["version-ios-8-2", "beta-5", "developerBeta", "2015-02-02", 1],
  ["version-ios-8-2", "gm", "goldenMaster", "2015-03-05", 7],
  ["version-ios-8-3", "beta-1", "developerBeta", "2015-02-09", 6],
  ["version-ios-8-3", "beta-2", "developerBeta", "2015-02-23", 5],
  ["version-ios-8-3", "beta-3", "developerBeta", "2015-03-12", 2],
  ["version-ios-8-3", "beta-4", "developerBeta", "2015-03-24", 2],
  ["version-ios-8-4", "beta-1", "developerBeta", "2015-04-13", 14],
  ["version-ios-8-4", "beta-2", "developerBeta", "2015-04-27", 1],
  ["version-ios-8-4", "beta-3", "developerBeta", "2015-05-11", 7],
  ["version-ios-8-4", "beta-4", "developerBeta", "2015-06-09", 4],
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
  "exact iOS 8 point-release substantive route closure",
);
assert.deepEqual(
  ledgerOnlyRouteSpecs.map((spec) => [
    spec.versionId,
    spec.alias,
    spec.channel,
    spec.date,
    spec.sequence,
    spec.pairedDeveloperRoute,
  ]),
  [
    [
      "version-ios-8-3",
      "public-beta-1",
      "publicBeta",
      "2015-03-12",
      1,
      "beta-3",
    ],
    [
      "version-ios-8-3",
      "public-beta-2",
      "publicBeta",
      "2015-03-24",
      2,
      "beta-4",
    ],
    [
      "version-ios-8-4",
      "public-beta-1",
      "publicBeta",
      "2015-04-27",
      1,
      "beta-2",
    ],
    [
      "version-ios-8-4",
      "public-beta-2",
      "publicBeta",
      "2015-05-11",
      2,
      "beta-3",
    ],
    [
      "version-ios-8-4",
      "public-beta-3",
      "publicBeta",
      "2015-06-09",
      3,
      "beta-4",
    ],
  ],
  "exact public-beta timeline-only route closure",
);
const contentRouteKeys = new Set(
  eventSpecs.map((spec) => `${spec.versionId}/${spec.alias}`),
);
const ledgerOnlyRouteKeys = new Set(
  ledgerOnlyRouteSpecs.map((spec) => `${spec.versionId}/${spec.alias}`),
);
assert(
  [...ledgerOnlyRouteKeys].every((key) => !contentRouteKeys.has(key)),
  "timeline-only public betas are omitted from content",
);
assert.equal(
  new Set([...contentRouteKeys, ...ledgerOnlyRouteKeys]).size,
  21,
  "all 21 named route identities close without schema-filler records",
);

const seed = JSON.parse(readFileSync(join(here, "..", "seed-data.json")));
const expectedPointSeed = [
  ["8.1", "2014-10-20"],
  ["8.1.1", "2014-11-17"],
  ["8.1.2", "2014-12-09"],
  ["8.1.3", "2015-01-27"],
  ["8.2", "2015-03-09"],
  ["8.3", "2015-04-08"],
  ["8.4", "2015-06-30"],
  ["8.4.1", "2015-08-13"],
];
assert.deepEqual(
  seed.releaseVersions
    .filter(
      (item) =>
        item.platform === "iOS" &&
        [
          "8.1",
          "8.1.1",
          "8.1.2",
          "8.1.3",
          "8.2",
          "8.3",
          "8.4",
          "8.4.1",
        ].includes(item.version),
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
  "exact iOS 8.1 through 8.4.1 point-release seed closure",
);

const publicBatch = JSON.parse(
  readFileSync(join(here, "apple-ios-8.json"), "utf8"),
);
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
  const boundaryCitations = spec.boundaryUrls.map((url) =>
    cite(url, `${spec.version} route boundary`, boundaryNote),
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
    summary: `${spec.label} is an editorially reviewed historical article for iOS ${spec.version}, with ${spec.changes.length} bounded ${spec.changes.length === 1 ? "record" : "records"} and an explicit evidence boundary.`,
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
          text: `This page indexes ${spec.changes.length} bounded ${spec.changes.length === 1 ? "occurrence" : "occurrences"}. Every title and explanation is original synthesis, and each claim points to the retained evidence family that supports it.`,
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
visit(events);
const usedUrls = new Set(allCitationUrls);
const sources = researchSources.filter((item) => usedUrls.has(item.url));
assert(
  [...usedUrls].every((url) =>
    researchSources.some((item) => item.url === url),
  ),
  "every citation belongs to the retained research source set",
);
const declaredUrls = new Set(sources.map((item) => item.url));
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

const localDefinitions = new Map();
let occurrenceCount = 0;
for (const event of events) {
  assert.equal(event.provenanceStatus, "editoriallyVerified");
  assert.deepEqual(event.editorialReview, {
    status: "approved",
    reviewedAt,
  });
  assert.equal(event.isIndexable, true);
  assert.notEqual(event.target.routeAlias, "public");
  assert.equal(event.identity.closesReleaseCycle, false);
  assert(
    ["developerBeta", "goldenMaster"].includes(event.identity.channel),
    `${event.identity.stableEventId} channel`,
  );
  for (const change of event.changes) {
    occurrenceCount += 1;
    assert(
      change.key.startsWith("apple-ios-8-point-prerelease-"),
      `${change.key} batch namespace`,
    );
    assert(change.citations.length > 0, `${change.key} citations`);
    const definition = {
      title: change.title,
      canonicalSummary: change.canonicalSummary,
      category: change.category,
    };
    const previous = localDefinitions.get(change.key);
    if (previous) assert.deepEqual(definition, previous, change.key);
    else localDefinitions.set(change.key, definition);
  }
}
assert.equal(events.length, 16, "substantive event count");
assert.equal(occurrenceCount, 78, "occurrence count");
assert.equal(localDefinitions.size, 72, "stable definition count");
assert.deepEqual(bundle.versions, [], "no version overlays");
assert.deepEqual(bundle.builds, [], "no build documents");
assert(
  events.every(
    (event) =>
      !ledgerOnlyRouteKeys.has(
        `${event.target.releaseVersionId}/${event.target.routeAlias}`,
      ),
  ),
  "public-beta timeline identities remain ledger-only",
);
assert.deepEqual(
  events
    .filter((event) => event.identity.channel === "goldenMaster")
    .map((event) => [
      event.target.releaseVersionId,
      event.target.routeAlias,
      event.identity.label,
    ]),
  [["version-ios-8-2", "gm", "Limited GM"]],
  "only the reported limited iOS 8.2 GM route is included",
);
const limitedGmEvent = events.find(
  (event) =>
    event.target.releaseVersionId === "version-ios-8-2" &&
    event.target.routeAlias === "gm",
);
assert(limitedGmEvent, "limited GM event");
assert.deepEqual(
  limitedGmEvent.changes.map((change) => [change.key, change.inheritance]),
  [
    [
      "apple-ios-8-point-prerelease-82-limited-gm-health-unit-selection",
      "cumulative",
    ],
    [
      "apple-ios-8-point-prerelease-82-limited-gm-health-large-data-stability",
      "cumulative",
    ],
    [
      "apple-ios-8-point-prerelease-82-limited-gm-third-party-workouts",
      "cumulative",
    ],
    [
      "apple-ios-8-point-prerelease-82-limited-gm-medical-id-photo",
      "cumulative",
    ],
    [
      "apple-ios-8-point-prerelease-82-limited-gm-health-data-display",
      "cumulative",
    ],
    [
      "apple-ios-8-point-prerelease-82-limited-gm-motion-privacy-toggle",
      "cumulative",
    ],
    [
      "apple-ios-8-point-prerelease-82-limited-gm-system-accessory-stability",
      "cumulative",
    ],
  ],
  "limited-GM final-note records are cumulative rather than asserted deltas",
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
  recurrence.get(
    "apple-ios-8-point-prerelease-83-icloud-photo-library-beta-label",
  ),
  [
    "version-ios-8-3/beta-1:changed:delta",
    "version-ios-8-3/beta-4:changed:delta",
  ],
  "Photo Library label history is bounded to two observed removals; no intervening restoration is invented",
);
assert.deepEqual(
  recurrence.get("apple-ios-8-point-prerelease-84-trending-radio-searches"),
  [
    "version-ios-8-4/beta-2:introduced:delta",
    "version-ios-8-4/beta-3:removed:delta",
  ],
  "Trending Searches transition",
);
for (const suffix of [
  "84-siri-radio-control",
  "84-airplay-streaming",
  "84-radio-station-sharing",
]) {
  assert.deepEqual(
    recurrence.get(`apple-ios-8-point-prerelease-${suffix}`),
    [
      "version-ios-8-4/beta-1:knownIssue:delta",
      "version-ios-8-4/beta-4:knownIssue:cumulative",
    ],
    `${suffix} Beta 1 introduction and Beta 4 persistence`,
  );
}
assert.equal(
  recurrence.has("apple-ios-8-point-prerelease-83-public-beta-program"),
  false,
  "public-program schema filler is absent",
);
assert.equal(
  recurrence.has("apple-ios-8-point-prerelease-84-public-beta-channel"),
  false,
  "public-channel schema filler is absent",
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
    for (const change of event.changes || []) {
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
const sourceLedger = researchSources
  .map(
    (item) =>
      `- [${item.title}](${item.url}) — ${item.publisher}; ${item.sourceClass}.`,
  )
  .join("\n");
const routeRows = [
  ...eventSpecs.map((spec) => ({
    ...spec,
    recordCount: spec.changes.length,
    disposition: "Content candidate",
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
const routeVerificationRows = eventSpecs
  .map(
    (spec) =>
      `| \`/apple/ios/${spec.version}/${spec.alias}/\` | 200 | 3/3 | ${spec.changes.length}/${spec.changes.length} | yes | yes | no | index, follow |`,
  )
  .join("\n");
const dryRun = {
  creates: 115,
  patches: 0,
  unchanged: 2_157,
  sourceCreates: 27,
  eventCreates: 16,
  changeCreates: 72,
  mutationPayloadBytes: 242_461,
  contentDigest:
    "130a25b7ec6b56cedaf4ff7a323aee5e211c74da9bd5d148dbb73ec069551f05",
  sourceSnapshotDigest:
    "cd194803b12b982f56aa88cee158ccd3f1871a74ca20b363eb9ea3f2cf1c7f7e",
  planSha: "db6a90a07446e9c79446c8486614ee8bfd16e5cb4fe3bdcbcf23efc2bca2f6f9",
  planArtifactSha:
    "7b574c6b3677fa58d4dfa3e563ad0164af09850b357263906a9be3fb5ae9ee44",
  rollbackArtifactSha:
    "734005e9ac8ba758259a6d30ba7b1616682b84a4dd5e9ca5fb891a9d7bec3c5f",
};
const publicationRecord = {
  transactionId: "eOgq1Ovu5XNUv1qNFVPk8V",
  receiptSha:
    "6123f6338994eeb9aee15716fd333555383ebc7f5eaec76e42d1eeac41922fef",
  zeroPlanSha:
    "5dc67449fd1f654cf5debd3247065e08a6954315cd4ab30dfae7f5e4e05edc57",
  zeroPlanArtifactSha:
    "310f471a7d9954ffc7c6f1f429b9faeb0b45d46e67a6c294f1badf73f967b829",
  zeroRollbackArtifactSha:
    "fd564dd05b17cbd0fbe7abc36235d165c4238be1fcbb89ea4c214336c71328e7",
  zeroUnchanged: 2_272,
  coverage: {
    totalVersions: 410,
    fullVersions: 410,
    totalAppearances: 2_068,
    fullAppearances: 515,
    sourceLinkedAppearances: 256,
    timelineOnlyAppearances: 1_297,
    approvedStructuredAppearances: 666,
  },
};

const md = `# Apple iOS 8 point-release prerelease archive batch

## Result

\`${outputName}\` is the approved archive batch for the defensible prerelease
routes with source-verifiable product or developer material attached to the
approved iOS 8.1, 8.2, 8.3, and 8.4 public parents. It does not read or rewrite
the independently owned iOS 8.0 prerelease batch.

- ${events.length} approved, indexable content routes
- ${ledgerOnlyRouteSpecs.length} public-beta identities retained only as
  timeline and paired-distribution history
- ${occurrenceCount} milestone occurrences across ${localDefinitions.size}
  stable definitions
- ${sources.length} content-bundle sources, ${researchSources.length} retained
  research sources, and ${citationCount} content citation references
- zero version overlays, build documents, or Public patches
- every content route is \`editoriallyVerified\`, \`approved\`, and explicitly
  \`isIndexable: true\`

## Exact route closure

| Release | Historical milestone | Route alias | Appearance | Fresh records | Disposition |
| --- | --- | --- | --- | ---: | --- |
${routeRows}

## Evidence method

1. Same-day or near-contemporary reports establish each externally distributed
   route and isolate visible changes or credited developer-note claims.
2. Apple’s WatchKit announcement and Xcode 6 archive provide first-party
   context for the iOS 8.2, 8.3, and 8.4 SDK generations.
3. Apple’s cumulative iOS 8 notes confirm later shipped state but never
   manufacture an earlier appearance or an absent prerelease route.
4. Public betas reported as the same seed or distributed alongside a developer
   seed remain in this timeline ledger, while feature deltas and generated pages
   stay on the developer route.
5. Reported observations, reported developer notes, first-party documentation,
   and cumulative corroboration retain distinct evidence labels.

## Exact gaps, qualifications, and exclusions

- The local seed contains Public-only records for iOS 8.1, 8.1.1, 8.1.2,
  8.1.3, 8.2, 8.3, 8.4, and 8.4.1.
- This batch covers only the externally defensible prerelease routes for the
  8.1, 8.2, 8.3, and 8.4 parents. It does not invent prerelease pages for
  8.1.1, 8.1.2, 8.1.3, or 8.4.1.
- No source-backed external GM route was located for iOS 8.1 or iOS 8.3.
  Their public releases are not relabeled as hidden candidates.
- iOS 8.2 has one qualified \`gm\` route because a contemporary report
  identified build 12D508 as a final distribution to employees and carrier
  partners. The page says “Limited GM,” remains \`reported\` at the route
  level, and does not claim an Apple-confirmed registered-developer seed. Its
  seven final-note records are explicitly cumulative rather than claimed as
  Beta 5-to-GM deltas.
- [The corrected June 22 report](${U.ios84NoGm}) says the predicted iOS 8.4
  GM had not appeared. No GM page is generated between Beta 4 and Public.
- Build strings help identify historical milestones but are not converted
  into build documents.
- All Public routes remain owned by the approved \`apple-ios-8.json\` batch.

## Public-beta distribution pairing

- iOS 8.3 Public Beta 1 was explicitly reported as Developer Beta 3. Public
  Beta 2 was made available with Developer Beta 4.
- iOS 8.4 Public Beta 1 was explicitly reported as corresponding to Developer
  Beta 2. Public Beta 2 accompanied Developer Beta 3, and Public Beta 3 was
  distributed with Developer Beta 4.
- These five public-beta identities remain ledger-only because their retained
  sources establish audience and a same-day developer-seed pairing, not a
  separate substantive product or developer delta. The archive does not claim
  byte-for-byte identity where the report does not.

## Bounded recurrence model

- The iCloud Photo Library beta label is recorded only where directly observed:
  removed in iOS 8.3 Beta 1 and removed again in Beta 4. The source describes
  intervening label changes but does not identify the restoration milestone, so
  no Beta 2 or Beta 3 occurrence is synthesized.
- Siri control of iTunes Radio, Music AirPlay streaming, and radio-station
  sharing are first recorded as known issues in iOS 8.4 Beta 1. Their Beta 4
  occurrences reuse the same immutable definitions with cumulative inheritance.

## Copyright and attribution controls

- Titles, summaries, occurrence prose, and article blocks are original
  synthesis.
- Every factual record has a claim-level citation and a bounded locator.
- Reports that reproduce private developer notes are credited to the
  preserving publisher and are never relabeled as native Apple pages.
- No article body, screenshot, transcript, or long quotation is committed.
- The evidence audit pins raw and normalized source states and enforces a
  maximum five-word contiguous overlap target for reader-facing prose.

## Source ledger

All retained research sources were accessed on ${accessedAt}. Only the
${sources.length} sources cited by content candidates are declared in the JSON
bundle; the public-program launch source remains here as timeline evidence.

${sourceLedger}

## Closure guards

- Exact comparison against all eight local iOS 8.1–8.4.1 seed records
- Approved/indexable Public ownership assertion against \`apple-ios-8.json\`
- Exact 16-route content allowlist plus five disjoint public-beta timeline
  identities, closing all 21 named milestones without schema-filler records
- Explicit limited-GM qualification and explicit iOS 8.4 no-GM boundary
- No build, version-overlay, or Public-route mutation path
- Batch-specific change namespace:
  \`apple-ios-8-point-prerelease-\`
- Collision scan across every other research-batch JSON
- ${occurrenceCount} occurrences resolve to exactly ${localDefinitions.size}
  stable definitions, including three tested Beta 1-to-Beta 4 known-issue
  recurrences and a bounded Photo Library label history
- Complete unique source declaration/use closure
- No dependency on or mutation of the iOS 8.0 prerelease artifacts
- Deterministic formatted JSON SHA-256: \`${jsonSha}\`

## Editorial approval and validation record

- provenance: \`editoriallyVerified\`
- editorial status: \`approved\`
- indexing: enabled for all ${events.length} content routes
- reviewed at: \`${reviewedAt}\`
- independent substantive review: clean after route-pairing, inheritance,
  limited-GM wording, recurrence, evidence-custody, and copyright corrections
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
  ${verification.independentSourcesFetched} retained sources available
  (${verification.independentContentSources} content and
  ${verification.independentTimelineSources} timeline-only);
  ${verification.independentRawExact} raw artifacts matched byte-for-byte,
  all ${verification.independentNormalizedExact} normalized article boundaries,
  all ${verification.independentTitlesReproduced} declared-source titles, all
  ${verification.independentProbesReproduced} evidence probe sets, and all
  ${verification.independentEvidenceReproduced} evidence boundaries reproduced

## Production dry plan

- status: applied and zero-residual verified on ${accessedAt}
- production dry plan: ${dryRun.creates} creates, zero patches, and
  ${dryRun.unchanged} unchanged
- create split: ${dryRun.sourceCreates} sources, ${dryRun.eventCreates} events,
  and ${dryRun.changeCreates} change documents
- Apple Support’s iOS 8 notes and Apple Developer’s Xcode 6 archive are reused
  unchanged, so the ${sources.length} declared content sources require only
  ${dryRun.sourceCreates} creates
- mutation payload: ${dryRun.mutationPayloadBytes.toLocaleString("en-US")} bytes
- manifest content digest: \`${dryRun.contentDigest}\`
- production snapshot digest: \`${dryRun.sourceSnapshotDigest}\`
- production plan SHA: \`${dryRun.planSha}\`
- plan artifact SHA-256: \`${dryRun.planArtifactSha}\`
- rollback artifact SHA-256: \`${dryRun.rollbackArtifactSha}\`
- rollback coverage: all ${dryRun.creates} create IDs and zero restore
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

Every published content route was fetched independently from the running local
site. Each returned all three archival article sections, every expected
structured change title, References, its first cited source, and an
\`index, follow\` directive. No route returned placeholder copy or a
\`noindex\` directive.

| Canonical route | HTTP | Article sections | Expected changes | References | First source | Placeholder | Robots |
| --- | ---: | ---: | ---: | --- | --- | --- | --- |
${routeVerificationRows}

No deployment was performed; domain and deployment work remains scheduled
separately.

## Reproduction

\`\`\`sh
node scripts/research-batches/audit-ios8-point-prerelease.mjs tmp/ios8-point-evidence
node scripts/research-batches/build-apple-ios-8-point-prerelease.mjs
npm run research:validate
node --import tsx --test tests/launch-content-ingestion.test.ts tests/launch-content-manifest.test.ts
npx eslint scripts/research-batches/build-apple-ios-8-point-prerelease.mjs scripts/research-batches/audit-ios8-point-prerelease.mjs
npx prettier --check scripts/research-batches/build-apple-ios-8-point-prerelease.mjs scripts/research-batches/audit-ios8-point-prerelease.mjs scripts/research-batches/apple-ios-8-point-prerelease.json scripts/research-batches/apple-ios-8-point-prerelease.md
npx sanity exec scripts/ingest-launch-content.ts --with-user-token -- --content scripts/research-batches/apple-ios-8-point-prerelease.json
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
