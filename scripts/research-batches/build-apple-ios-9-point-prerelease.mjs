import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import prettier from "prettier";

const here = dirname(fileURLToPath(import.meta.url));
const outputName = "apple-ios-9-point-prerelease.json";
const ledgerName = "apple-ios-9-point-prerelease.md";
const accessedAt = "2026-07-30";
const reviewedAt = "2026-07-30T13:06:56Z";
const sha256 = (value) => createHash("sha256").update(value).digest("hex");

const verification = {
  researchBatches: 73,
  globalChangeKeys: 4_214,
  focusedTests: 19,
  fullTests: 131,
  rawArtifacts: 65,
  rawEvidenceBytes: 8_014_368,
  normalizedArtifacts: 65,
  maximumEditorialOverlapWords: 5,
  independentSourcesFetched: 27,
  independentRawExact: 23,
  independentNormalizedExact: 25,
  independentMarkersReproduced: 27,
  independentEvidenceReproduced: 27,
};
const dryRun = {
  creates: 86,
  patches: 0,
  unchanged: 2_105,
  sourceCreates: 27,
  eventCreates: 13,
  changeCreates: 46,
  mutationPayloadBytes: 191_120,
  planSha: "487c97e058758b6e6fea439d86c7e51c18493ff94cca9ef31152784759569dc8",
  planArtifactSha:
    "f428826d7acebed39213518c17790062fec7a5d40f7b7eb6bd421663e0b7d987",
  rollbackArtifactSha:
    "50d3cfbd385aed5756b73ee95813bf59c1a714d42c4f26480e302b0e255eb60c",
};
const publicationRecord = {
  transactionId: "F0eE6eK5XyVXtlnaoyaJYP",
  receiptSha:
    "46299a4726f3a99eb334436b33f97f75279b35da436122dd2a467d8c84718f7b",
  zeroPlanSha:
    "3efb092198957939f98a9eb6812a0d5af3355cb80a7bf512392e459ad610f1c8",
  zeroPlanArtifactSha:
    "cd4a155edab3fea5c15f8d87347b22a002cd8fbb07221c58d0a038512acfbc33",
  zeroRollbackArtifactSha:
    "e1ec049b668789bd1b95f4c8cdd5f23cb504934c122bccfad4450daf478949d5",
  zeroCreates: 0,
  zeroPatches: 0,
  zeroUnchanged: 2_191,
  zeroPayloadBytes: 16,
  coverage: {
    totalVersions: 410,
    fullVersions: 410,
    totalAppearances: 2_015,
    fullAppearances: 462,
    sourceLinkedAppearances: 256,
    timelineOnlyAppearances: 1_297,
    approvedStructuredAppearances: 613,
  },
};

const U = {
  ios91b1:
    "https://www.macrumors.com/2015/09/09/apple-seeds-first-ios-9-1-apple-tv-os-betas/",
  ios91b2:
    "https://www.macrumors.com/2015/09/23/apple-seeds-second-ios-9-1-beta-developers/",
  ios91b3:
    "https://www.macrumors.com/2015/09/30/apple-seeds-third-ios-9-1-beta-to-developers/",
  ios91b4: "https://www.macrumors.com/2015/10/06/apple-seeds-ios-9-1-beta-4/",
  ios91b5:
    "https://www.macrumors.com/2015/10/12/apple-seeds-fifth-ios-9-1-beta/",
  ios91Public: "https://www.macrumors.com/2015/10/21/apple-releases-ios-9-1/",

  ios92b1: "https://www.macrumors.com/2015/10/27/ios-9-2-beta-1/",
  ios92b2:
    "https://www.macrumors.com/2015/11/03/apple-seeds-second-ios-9-2-beta-to-developers/",
  ios92b2Notes: "https://www.idevice.ro/2015/11/03/ios-9-2-beta-2/",
  ios92b3:
    "https://www.macrumors.com/2015/11/10/apple-seeds-third-9-2-beta-to-developers/",
  ios92b4:
    "https://www.macrumors.com/2015/11/18/apple-seeds-fourth-ios-9-2-beta-to-developers/",
  ios92Public: "https://www.macrumors.com/2015/12/08/apple-releases-ios-9-2/",
  ios92Developer:
    "https://developer.apple.com/library/archive/releasenotes/General/RN-iOSSDK-9.2/index.html",

  ios921b1:
    "https://www.macrumors.com/2015/12/16/apple-seeds-first-921-beta-to-devs/",
  ios921b1Corroboration: "https://9to5mac.com/2015/12/16/ios-9-2-1-beta-1/",
  ios921b2:
    "https://www.macrumors.com/2016/01/04/apple-seeds-second-beta-of-ios-9-2-1/",
  ios921b2Corroboration:
    "https://9to5mac.com/2016/01/04/apple-releases-ios-9-2-1-beta-for-developers/",
  ios921Public:
    "https://www.macrumors.com/2016/01/19/apple-releases-ios-9-2-1/",

  ios93b1: "https://www.macrumors.com/2016/01/11/apple-ios-9-3-first-beta/",
  ios93Preview:
    "https://web.archive.org/web/20160112035022/https://www.apple.com/ios/preview/",
  ios93Education:
    "https://web.archive.org/web/20160116054816/https://www.apple.com/education/preview/",
  ios93b1Features: "https://www.macrumors.com/2016/01/11/whats-new-in-ios-9-3/",
  ios93b2:
    "https://www.macrumors.com/2016/01/25/apple-seeds-second-ios-9-3-beta/",
  ios93b2SmartConnector:
    "https://www.macrumors.com/2016/01/28/ios-9-3-beta-2-smart-connector-accessory-firmware/",
  ios93b3:
    "https://www.macrumors.com/2016/02/08/apple-seeds-third-ios-9-3-beta/",
  ios93b4: "https://www.macrumors.com/2016/02/22/apple-seeds-ios-9-3-beta-4/",
  ios93b4DateFix:
    "https://www.macrumors.com/2016/02/24/ios-9-3-beta-4-fixes-1970-date-bug/",
  ios93b45NightShift:
    "https://www.macrumors.com/2016/03/02/night-shift-changes-low-power/",
  ios93b5:
    "https://www.macrumors.com/2016/03/01/apple-ios-9-3-beta-5-to-developers/",
  ios93b6: "https://www.macrumors.com/2016/03/07/apple-seeds-ios-9-3-beta-6/",
  ios93b7: "https://www.macrumors.com/2016/03/14/apple-seeds-ios-9-3-beta-7/",
  ios93Public: "https://www.macrumors.com/2016/03/21/apple-releases-ios-9-3/",

  ios932b1:
    "https://www.macrumors.com/2016/04/06/apple-seeds-first-ios-9-3-2-beta/",
  ios932b1GameCenter:
    "https://www.macrumors.com/2016/04/12/ios-9-3-2-beta-fixes-game-center-bug/",
  ios932b2:
    "https://www.macrumors.com/2016/04/20/apple-seeds-second-ios-9-3-2-beta/",
  ios932b3:
    "https://www.macrumors.com/2016/04/26/apple-seeds-ios-9-3-2-beta-3/",
  ios932b4:
    "https://www.macrumors.com/2016/05/03/apple-seeds-ios-9-3-2-beta-4-to-developers/",
  ios932Public:
    "https://www.macrumors.com/2016/05/16/apple-releases-ios-9-3-2/",

  ios933b1:
    "https://www.macrumors.com/2016/05/23/apple-seeds-first-beta-of-ios-9-3-3/",
  ios933b2:
    "https://www.macrumors.com/2016/06/06/apple-ios-9-3-3-beta-2-to-developers/",
  ios933b3:
    "https://www.macrumors.com/2016/06/21/apple-seeds-ios-9-3-3-beta-3-to-developers/",
  ios933b4:
    "https://www.macrumors.com/2016/06/29/apple-seeds-ios-9-3-3-beta-4/",
  ios933b5: "https://www.macrumors.com/2016/07/06/ios-9-3-3-beta-5/",
  ios933Public:
    "https://www.macrumors.com/2016/07/18/apple-releases-ios-9-3-3/",
};

const routeSpecs = [
  {
    version: "9.1",
    alias: "beta-1",
    label: "Beta 1",
    date: "2015-09-09",
    sequence: 1,
    url: U.ios91b1,
    publishedAt: "2015-09-09T12:39:27-07:00",
    title: "Apple Seeds First iOS 9.1 and Apple tvOS Betas to Developers",
  },
  {
    version: "9.1",
    alias: "beta-2",
    label: "Beta 2",
    date: "2015-09-23",
    sequence: 2,
    url: U.ios91b2,
    publishedAt: "2015-09-23T09:57:34-07:00",
    title: "Apple Seeds Second iOS 9.1 and tvOS Betas to Developers",
  },
  {
    version: "9.1",
    alias: "beta-3",
    label: "Beta 3",
    date: "2015-09-30",
    sequence: 3,
    url: U.ios91b3,
    publishedAt: "2015-09-30T09:58:20-07:00",
    title: "Apple Seeds Third iOS 9.1 Beta to Developers",
  },
  {
    version: "9.1",
    alias: "beta-4",
    label: "Beta 4",
    date: "2015-10-06",
    sequence: 4,
    url: U.ios91b4,
    publishedAt: "2015-10-06T09:56:47-07:00",
    title: "Apple Seeds Fourth iOS 9.1 Beta, Third tvOS Beta to Developers",
  },
  {
    version: "9.1",
    alias: "beta-5",
    label: "Beta 5",
    date: "2015-10-12",
    sequence: 5,
    url: U.ios91b5,
    publishedAt: "2015-10-12T09:57:33-07:00",
    title:
      "Apple Seeds Fifth iOS 9.1 Beta to Developers and Public Beta Testers",
  },
  {
    version: "9.2",
    alias: "beta-1",
    label: "Beta 1",
    date: "2015-10-27",
    sequence: 1,
    url: U.ios92b1,
    publishedAt: "2015-10-27T10:12:22-07:00",
    title: "Apple Seeds First iOS 9.2 Beta to Developers",
  },
  {
    version: "9.2",
    alias: "beta-2",
    label: "Beta 2",
    date: "2015-11-03",
    sequence: 2,
    url: U.ios92b2,
    publishedAt: "2015-11-03T09:58:59-08:00",
    title: "Apple Seeds Second iOS 9.2 Beta to Developers",
  },
  {
    version: "9.2",
    alias: "beta-3",
    label: "Beta 3",
    date: "2015-11-10",
    sequence: 3,
    url: U.ios92b3,
    publishedAt: "2015-11-10T10:01:35-08:00",
    title:
      "Apple Seeds Third iOS 9.2 Beta to Developers and Public Beta Testers",
  },
  {
    version: "9.2",
    alias: "beta-4",
    label: "Beta 4",
    date: "2015-11-18",
    sequence: 4,
    url: U.ios92b4,
    publishedAt: "2015-11-18T09:49:38-08:00",
    title:
      "Apple Seeds Fourth iOS 9.2 Beta to Developers and Public Beta Testers",
  },
  {
    version: "9.2.1",
    alias: "beta-1",
    label: "Beta 1",
    date: "2015-12-16",
    sequence: 1,
    url: U.ios921b1,
    corroborationUrls: [U.ios921b1Corroboration],
    publishedAt: "2015-12-16T10:04:56-08:00",
    title: "Apple Seeds First Beta of iOS 9.2.1 to Developers",
  },
  {
    version: "9.2.1",
    alias: "beta-2",
    label: "Beta 2",
    date: "2016-01-04",
    sequence: 2,
    url: U.ios921b2,
    corroborationUrls: [U.ios921b2Corroboration],
    publishedAt: "2016-01-04T10:00:56-08:00",
    title:
      "Apple Seeds Second Beta of iOS 9.2.1 to Developers and Public Beta Testers",
  },
  {
    version: "9.3",
    alias: "beta-1",
    label: "Beta 1",
    date: "2016-01-11",
    sequence: 1,
    url: U.ios93b1,
    publishedAt: "2016-01-11T10:05:11-08:00",
    title: "Apple Seeds First Beta of iOS 9.3 to Developers",
  },
  {
    version: "9.3",
    alias: "beta-2",
    label: "Beta 2",
    date: "2016-01-25",
    sequence: 2,
    url: U.ios93b2,
    publishedAt: "2016-01-25T12:59:45-08:00",
    title:
      "Apple Seeds Second iOS 9.3 Beta to Developers With Night Shift Toggle in Control Center",
  },
  {
    version: "9.3",
    alias: "beta-3",
    label: "Beta 3",
    date: "2016-02-08",
    sequence: 3,
    url: U.ios93b3,
    publishedAt: "2016-02-08T09:49:32-08:00",
    title: "Apple Seeds Third Beta of iOS 9.3 to Developers",
  },
  {
    version: "9.3",
    alias: "beta-4",
    label: "Beta 4",
    date: "2016-02-22",
    sequence: 4,
    url: U.ios93b4,
    publishedAt: "2016-02-22T09:49:10-08:00",
    title: "Apple Seeds Fourth Beta of iOS 9.3 to Developers",
  },
  {
    version: "9.3",
    alias: "beta-5",
    label: "Beta 5",
    date: "2016-03-01",
    sequence: 5,
    url: U.ios93b5,
    publishedAt: "2016-03-01T10:16:08-08:00",
    title:
      "Apple Seeds Fifth Beta of iOS 9.3 to Developers and Public Beta Testers",
  },
  {
    version: "9.3",
    alias: "beta-6",
    label: "Beta 6",
    date: "2016-03-07",
    sequence: 6,
    url: U.ios93b6,
    publishedAt: "2016-03-07T09:50:28-08:00",
    title:
      "Apple Seeds Sixth Beta of iOS 9.3 to Developers and Public Beta Testers",
  },
  {
    version: "9.3",
    alias: "beta-7",
    label: "Beta 7",
    date: "2016-03-14",
    sequence: 7,
    url: U.ios93b7,
    publishedAt: "2016-03-14T14:48:51-07:00",
    title:
      "Apple Seeds Seventh Beta of iOS 9.3 to Developers and Public Beta Testers",
  },
  {
    version: "9.3.2",
    alias: "beta-1",
    label: "Beta 1",
    date: "2016-04-06",
    sequence: 1,
    url: U.ios932b1,
    publishedAt: "2016-04-06T09:50:12-07:00",
    title:
      "Apple Seeds First Beta of iOS 9.3.2 to Developers With Bug Fixes and Improvements",
  },
  {
    version: "9.3.2",
    alias: "beta-2",
    label: "Beta 2",
    date: "2016-04-20",
    sequence: 2,
    url: U.ios932b2,
    publishedAt: "2016-04-20T09:57:49-07:00",
    title:
      "Apple Seeds Second iOS 9.3.2 Beta to Developers With Night Shift and Low Power Mode Update",
  },
  {
    version: "9.3.2",
    alias: "beta-3",
    label: "Beta 3",
    date: "2016-04-26",
    sequence: 3,
    url: U.ios932b3,
    publishedAt: "2016-04-26T09:58:10-07:00",
    title: "Apple Seeds Third Beta of iOS 9.3.2 to Developers",
  },
  {
    version: "9.3.2",
    alias: "beta-4",
    label: "Beta 4",
    date: "2016-05-03",
    sequence: 4,
    url: U.ios932b4,
    publishedAt: "2016-05-03T10:01:14-07:00",
    title:
      "Apple Seeds Fourth Beta of iOS 9.3.2 to Developers and Public Beta Testers",
  },
  {
    version: "9.3.3",
    alias: "beta-1",
    label: "Beta 1",
    date: "2016-05-23",
    sequence: 1,
    url: U.ios933b1,
    publishedAt: "2016-05-23T09:49:07-07:00",
    title: "Apple Seeds First Beta of iOS 9.3.3 to Developers",
  },
  {
    version: "9.3.3",
    alias: "beta-2",
    label: "Beta 2",
    date: "2016-06-06",
    sequence: 2,
    url: U.ios933b2,
    publishedAt: "2016-06-06T09:50:40-07:00",
    title: "Apple Seeds Second Beta of iOS 9.3.3 to Developers",
  },
  {
    version: "9.3.3",
    alias: "beta-3",
    label: "Beta 3",
    date: "2016-06-21",
    sequence: 3,
    url: U.ios933b3,
    publishedAt: "2016-06-21T10:06:55-07:00",
    title:
      "Apple Seeds Third Beta of iOS 9.3.3 to Developers and Public Beta Testers",
  },
  {
    version: "9.3.3",
    alias: "beta-4",
    label: "Beta 4",
    date: "2016-06-29",
    sequence: 4,
    url: U.ios933b4,
    publishedAt: "2016-06-29T09:56:55-07:00",
    title:
      "Apple Seeds Fourth Beta of iOS 9.3.3 to Developers and Public Beta Testers",
  },
  {
    version: "9.3.3",
    alias: "beta-5",
    label: "Beta 5",
    date: "2016-07-06",
    sequence: 5,
    url: U.ios933b5,
    publishedAt: "2016-07-06T09:43:10-07:00",
    title:
      "Apple Seeds Fifth Beta of iOS 9.3.3 to Developers and Public Beta Testers",
  },
];

const publicCycles = {
  9.1: {
    url: U.ios91Public,
    title: "Apple Releases iOS 9.1 With New Emoji, Live Photos Improvements",
    publishedAt: "2015-10-21T09:52:39-07:00",
  },
  9.2: {
    url: U.ios92Public,
    title:
      "Apple Releases iOS 9.2 With Safari View Controller Improvements, AT&T NumberSync Support and Bug Fixes",
    publishedAt: "2015-12-08T09:53:32-08:00",
  },
  "9.2.1": {
    url: U.ios921Public,
    title: "Apple Releases iOS 9.2.1 With Bug Fixes, Security Updates",
    publishedAt: "2016-01-19T10:00:09-08:00",
  },
  9.3: {
    url: U.ios93Public,
    title:
      "Apple Releases iOS 9.3 With Night Shift, New Quick Actions, App Improvements, '1970' Bug Fix and More",
    publishedAt: "2016-03-21T11:54:45-07:00",
  },
  "9.3.2": {
    url: U.ios932Public,
    title:
      "Apple Releases iOS 9.3.2 With Support for Simultaneous Night Shift/Low Power Mode Usage",
    publishedAt: "2016-05-16T09:50:47-07:00",
  },
  "9.3.3": {
    url: U.ios933Public,
    title:
      "Apple Releases iOS 9.3.3 With Bug Fixes and Performance Improvements",
    publishedAt: "2016-07-18T10:09:46-07:00",
  },
};

const researchSources = [
  ...routeSpecs.map((route) => ({
    url: route.url,
    title: route.title,
    publisher: "MacRumors",
    sourceClass: "journalism",
    author: "Juli Clover",
    publishedAt: route.publishedAt,
    topics: [
      `iOS ${route.version}`,
      route.label,
      "developer beta identity",
      "contemporary report",
    ],
  })),
  ...Object.entries(publicCycles).map(([version, cycle]) => ({
    ...cycle,
    publisher: "MacRumors",
    sourceClass: "journalism",
    author: "Juli Clover",
    topics: [`iOS ${version}`, "public boundary", "cycle closure"],
  })),
  {
    url: U.ios921b1Corroboration,
    title: "Apple releases first iOS 9.2.1 beta for testing",
    publisher: "9to5Mac",
    sourceClass: "journalism",
    author: "Zac Hall",
    publishedAt: "2015-12-16T18:09:47+00:00",
    topics: ["iOS 9.2.1", "Beta 1", "build corroboration"],
  },
  {
    url: U.ios921b2Corroboration,
    title:
      "Apple releases iOS 9.2.1 beta 2 for developers and public beta testers",
    publisher: "9to5Mac",
    sourceClass: "journalism",
    author: "Benjamin Mayo",
    publishedAt: "2016-01-04T18:04:53+00:00",
    topics: ["iOS 9.2.1", "Beta 2", "build corroboration"],
  },
  {
    url: U.ios92b2Notes,
    title: "iOS 9.2 beta 2 a fost lansat",
    publisher: "iDevice.ro",
    sourceClass: "archive",
    author: "Adrian Gabor; Apple developer-note material reproduced",
    publishedAt: "2015-11-03T20:03:25+02:00",
    topics: ["iOS 9.2", "Beta 2", "Apple developer notes", "archive"],
  },
  {
    url: U.ios92Developer,
    title: "iOS 9.2 Release Notes",
    publisher: "Apple Developer",
    sourceClass: "developerDocs",
    author: "Apple",
    publishedAt: "2015-12-08T00:00:00.000Z",
    topics: ["iOS 9.2", "final developer notes", "cumulative corroboration"],
  },
  {
    url: U.ios93Preview,
    title: "iOS 9.3 Preview",
    publisher: "Apple",
    sourceClass: "archive",
    author: "Apple",
    publishedAt: "2016-01-11T00:00:00.000Z",
    topics: ["iOS 9.3", "Beta 1", "first-party announcement", "archive"],
  },
  {
    url: U.ios93Education,
    title: "iOS 9.3 Education Preview",
    publisher: "Apple",
    sourceClass: "archive",
    author: "Apple",
    publishedAt: "2016-01-11T00:00:00.000Z",
    topics: ["iOS 9.3", "Beta 1", "education", "first-party announcement"],
  },
  {
    url: U.ios93b1Features,
    title:
      "What's New in iOS 9.3: Night Shift, New Quick Actions, Improvements to Apple News, Notes, CarPlay and Health",
    publisher: "MacRumors",
    sourceClass: "journalism",
    author: "Juli Clover",
    publishedAt: "2016-01-11T13:06:29-08:00",
    topics: ["iOS 9.3", "Beta 1", "observed changes"],
  },
  {
    url: U.ios93b2SmartConnector,
    title:
      "iOS 9.3 Beta 2 Allows iPad Pro's Smart Connector to Update Accessory Firmware",
    publisher: "MacRumors",
    sourceClass: "journalism",
    author: "Husain Sumra",
    publishedAt: "2016-01-27T21:08:50-08:00",
    topics: ["iOS 9.3", "Beta 2", "Smart Connector", "observed change"],
  },
  {
    url: U.ios93b4DateFix,
    title:
      "Latest iOS 9.3 Beta Unbricks iPhones Affected by 'January 1, 1970' Date Bug",
    publisher: "MacRumors",
    sourceClass: "journalism",
    author: "Juli Clover",
    publishedAt: "2016-02-24T14:32:33-08:00",
    topics: ["iOS 9.3", "Beta 4", "date bug", "observed fix"],
  },
  {
    url: U.ios93b45NightShift,
    title:
      "Night Shift Beta Tidbits: Disabled in Low Power Mode, Control Center Changes",
    publisher: "MacRumors",
    sourceClass: "journalism",
    author: "Joe Rossignol",
    publishedAt: "2016-03-02T08:02:17-08:00",
    topics: ["iOS 9.3", "Beta 4", "Beta 5", "Night Shift"],
  },
  {
    url: U.ios932b1GameCenter,
    title:
      "iOS 9.3.2 Beta Reportedly Fixes 'White Screen of Death' Game Center Bug",
    publisher: "MacRumors",
    sourceClass: "journalism",
    author: "Tim Hardwick",
    publishedAt: "2016-04-12T03:13:19-07:00",
    topics: ["iOS 9.3.2", "Beta 1", "Game Center", "reported fix"],
  },
];

const cite = (url, locator, note) => ({
  url,
  locator,
  ...(note ? { note } : {}),
});
const identityNote = "Contemporary milestone identity and timing.";
const firstPartyNote =
  "Apple-authored archived announcement; wording is independently synthesized.";
const transcriptNote =
  "Credited reproduction of Apple developer material; wording is not reused.";
const observedNote =
  "Contemporary observation or report; publisher wording is not reused.";
const finalNote =
  "Apple's final SDK document corroborates cumulative behavior only.";

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
    summary,
    documentedStatus,
    evidenceState,
    verificationMethod,
    citations,
  };
};
const documented = (input) =>
  occurrence({
    documentedStatus: "documented",
    evidenceState: "confirmed",
    verificationMethod:
      "Matched a bounded Apple-authored statement or preserved developer-note item and rewrote it independently.",
    ...input,
  });
const observed = (input) =>
  occurrence({
    documentedStatus: "undocumented",
    evidenceState: "reported",
    verificationMethod:
      "Matched the bounded observation in a contemporary report and rewrote it independently.",
    ...input,
  });
const corroborated = (input) =>
  occurrence({
    documentedStatus: "partiallyDocumented",
    evidenceState: "corroborated",
    verificationMethod:
      "Reconciled the bounded claim across the retained contemporary and cumulative evidence.",
    ...input,
  });

const changesByRoute = {
  "9.1/beta-1": [
    observed({
      key: "ios-9-1-prerelease-ipad-pro-accessories",
      title: "iPad Pro accessory integration",
      canonicalSummary:
        "The update added operating-system support for the original iPad Pro, Apple Pencil, and Smart Keyboard.",
      category: "compatibility",
      action: "introduced",
      summary:
        "The first seed exposed the compatibility layer needed by Apple's forthcoming large iPad and its two input accessories.",
      citations: [
        cite(U.ios91b1, "iPad Pro; Smart Keyboard; Apple Pencil", observedNote),
      ],
    }),
    observed({
      key: "ios-9-1-prerelease-unicode-8-emoji",
      title: "Unicode 8 emoji set",
      canonicalSummary:
        "The keyboard and text system gained emoji characters from the Unicode 8 repertoire.",
      category: "feature",
      action: "introduced",
      summary:
        "The initial 9.1 seed made the newer emoji repertoire available for testing.",
      citations: [
        cite(U.ios91b1, "What's new; Emoji; Unicode 8", observedNote),
      ],
    }),
    observed({
      key: "ios-9-1-prerelease-hey-siri-enrollment",
      title: "Personalized Hey Siri enrollment",
      canonicalSummary:
        "Siri settings added a spoken-example setup flow that trained voice activation for an individual user.",
      category: "enhancement",
      action: "introduced",
      summary:
        "Beta 1 exposed a voice-enrollment step for the hands-free Siri trigger.",
      citations: [
        cite(U.ios91b1, "What's new; Hey Siri; voice examples", observedNote),
      ],
    }),
  ],
  "9.1/beta-2": [
    observed({
      key: "ios-9-1-prerelease-messages-contact-photos",
      title: "Messages contact-photo control",
      canonicalSummary:
        "Messages settings gained a switch for hiding or showing contact photographs.",
      category: "enhancement",
      action: "introduced",
      summary:
        "The second seed added an explicit preference for contact imagery in Messages.",
      citations: [
        cite(
          U.ios91b2,
          "What's new; Messages; disable contact photos",
          observedNote,
        ),
      ],
    }),
  ],
  "9.1/beta-3": [],
  "9.1/beta-4": [],
  "9.1/beta-5": [],

  "9.2/beta-1": [
    corroborated({
      key: "ios-9-2-prerelease-safari-view-action-extensions",
      title: "Safari View Controller action extensions",
      canonicalSummary:
        "In-app Safari views could invoke compatible third-party action extensions.",
      category: "developerApi",
      action: "introduced",
      summary:
        "Beta 1 brought Safari action-extension access into SFSafariViewController.",
      citations: [
        cite(
          U.ios92b1,
          "What's new; third-party Action Extensions; SFSafariViewController",
          observedNote,
        ),
        cite(
          U.ios92Developer,
          "Safari; SFSafariViewController; 3rd party Action Extensions",
          finalNote,
        ),
      ],
    }),
    corroborated({
      key: "ios-9-2-prerelease-safari-view-content-blocker-reload",
      title: "Content-blocker bypass reload",
      canonicalSummary:
        "A long press on the in-app browser's reload control offered a one-time load without content blockers.",
      category: "enhancement",
      action: "introduced",
      summary:
        "The first seed added a content-blocker bypass to the Safari View Controller reload menu.",
      citations: [
        cite(
          U.ios92b1,
          "Long tapping Reload; reload content without content blockers",
          observedNote,
        ),
        cite(
          U.ios92Developer,
          "Safari; Reload Without Content Blockers",
          finalNote,
        ),
      ],
    }),
    corroborated({
      key: "ios-9-2-prerelease-safari-view-desktop-site",
      title: "Desktop-site request in app browser",
      canonicalSummary:
        "The Safari View Controller reload menu gained a command to request the desktop form of a website.",
      category: "enhancement",
      action: "introduced",
      summary:
        "Beta 1 aligned the in-app browser with Safari's desktop-site request control.",
      citations: [
        cite(
          U.ios92b1,
          "Long tapping Reload; request desktop site",
          observedNote,
        ),
        cite(U.ios92Developer, "Safari; Request Desktop Site", finalNote),
      ],
    }),
  ],
  "9.2/beta-2": [
    documented({
      key: "ios-9-2-prerelease-watch-stocks-glance",
      title: "Apple Watch Stocks glance after re-pairing",
      canonicalSummary:
        "Re-pairing an Apple Watch no longer caused its Stocks glance to disappear.",
      category: "bugFix",
      action: "fixed",
      summary:
        "Apple's Beta 2 notes mark the missing Stocks glance after a new pairing as fixed.",
      citations: [
        cite(
          U.ios92b2Notes,
          "Apple Watch; Fixed in Beta 2; stocks glance",
          transcriptNote,
        ),
        cite(U.ios92b2, "Bug Fixes; Stocks glance", observedNote),
      ],
    }),
    documented({
      key: "ios-9-2-prerelease-watch-music-sync",
      title: "Apple Watch music synchronization",
      canonicalSummary:
        "Music synchronization to a paired Apple Watch resumed working in this seed.",
      category: "bugFix",
      action: "fixed",
      summary:
        "The preserved developer notes identify watch music syncing as repaired in Beta 2.",
      citations: [
        cite(
          U.ios92b2Notes,
          "Apple Watch; Fixed in Beta 2; sync music",
          transcriptNote,
        ),
        cite(U.ios92b2, "Bug Fixes; Syncing Music", observedNote),
      ],
    }),
    documented({
      key: "ios-9-2-prerelease-usb-car-audio-quality",
      title: "USB car-stereo audio quality",
      canonicalSummary:
        "Playback over USB stopped exhibiting the documented quality problem on affected vehicle stereos.",
      category: "bugFix",
      action: "fixed",
      summary:
        "Beta 2 addressed degraded USB audio reported with a subset of car stereos.",
      citations: [
        cite(
          U.ios92b2Notes,
          "Audio; Fixed in Beta 2; audio over USB; car stereos",
          transcriptNote,
        ),
        cite(U.ios92b2, "Bug Fixes; audio quality; USB", observedNote),
      ],
    }),
    documented({
      key: "ios-9-2-prerelease-icloud-keychain-setup",
      title: "iCloud Keychain setup failure",
      canonicalSummary:
        "The setup flow stopped producing the documented failure while enabling iCloud Keychain.",
      category: "bugFix",
      action: "fixed",
      summary:
        "Apple's Beta 2 notes move the Keychain setup error into the fixed state.",
      citations: [
        cite(
          U.ios92b2Notes,
          "iCloud Keychain; Fixed in Beta 2; Could Not Set Up",
          transcriptNote,
        ),
        cite(U.ios92b2, "Bug Fixes; iCloud Keychain", observedNote),
      ],
    }),
    documented({
      key: "ios-9-2-prerelease-network-ecn-default",
      title: "Explicit Congestion Notification by default",
      canonicalSummary:
        "Networking enabled Explicit Congestion Notification on Wi-Fi and selected carrier paths by default.",
      category: "behavior",
      action: "introduced",
      summary:
        "The seed changed ECN from an opt-in path to the default on the documented networks.",
      citations: [
        cite(
          U.ios92b2Notes,
          "Networking Notes; Explicit Congestion Notification; enabled by default",
          transcriptNote,
        ),
      ],
    }),
    documented({
      key: "ios-9-2-prerelease-nat64-getaddrinfo",
      title: "NAT64 synthesis for IPv4 literals",
      canonicalSummary:
        "On NAT64 networks, getaddrinfo gained translation from a literal IPv4 destination into an IPv6 result.",
      category: "developerApi",
      action: "introduced",
      summary:
        "Beta 2 documented resolver support for converting literal IPv4 destinations on NAT64 networks.",
      citations: [
        cite(
          U.ios92b2Notes,
          "Networking Notes; synthesize NAT64 IPv6 addresses; getaddrinfo",
          transcriptNote,
        ),
      ],
    }),
    documented({
      key: "ios-9-2-prerelease-safari-view-edge-dismissal",
      title: "Edge-swipe Safari View dismissal",
      canonicalSummary:
        "Apps targeting the 9.2 SDK gained a swipe-from-edge gesture for closing the embedded Safari interface.",
      category: "developerApi",
      action: "introduced",
      summary:
        "Beta 2 added a gesture-based dismissal path that required rebuilding against the newer SDK.",
      citations: [
        cite(
          U.ios92b2Notes,
          "Safari Notes; dismissed using an edge swipe; rebuild",
          transcriptNote,
        ),
        cite(U.ios92b2, "New Features; dismiss; edge swipe", observedNote),
        cite(
          U.ios92Developer,
          "Safari; dismissed using an edge swipe",
          finalNote,
        ),
      ],
    }),
    documented({
      key: "ios-9-2-prerelease-empty-content-blocker-xpc",
      title: "Empty content-blocker XPC crash",
      canonicalSummary:
        "Supplying no content-blocker data could crash the loader's XPC service.",
      category: "knownIssue",
      action: "knownIssue",
      summary:
        "The Beta 2 document warned that an empty content-blocker payload could terminate its loader service.",
      citations: [
        cite(
          U.ios92b2Notes,
          "Safari Known Issue; content blocker loader XPC service",
          transcriptNote,
        ),
      ],
    }),
    documented({
      key: "ios-9-2-prerelease-folw-video-playback",
      title: "32-bit playback of videos with folw tracks",
      canonicalSummary:
        "Videos carrying a folw track association played again on 32-bit hardware.",
      category: "bugFix",
      action: "fixed",
      summary:
        "Apple's Beta 2 notes identify the 32-bit folw-track playback failure as resolved.",
      citations: [
        cite(
          U.ios92b2Notes,
          "Video; Fixed in Beta 2; folw; 32-bit devices",
          transcriptNote,
        ),
        cite(U.ios92b2, "Bug Fixes; folw; 32-bit devices", observedNote),
      ],
    }),
    observed({
      key: "ios-9-2-prerelease-att-numbersync",
      title: "AT&T NumberSync calling",
      canonicalSummary:
        "AT&T subscribers could receive calls on linked Macs and iPads without keeping those devices on the iPhone's Wi-Fi network.",
      category: "feature",
      action: "introduced",
      summary:
        "The second seed exposed AT&T's expanded Wi-Fi Calling handoff under the NumberSync name.",
      citations: [
        cite(U.ios92b2, "New Features; AT&T NumberSync", observedNote),
        cite(
          U.ios92b2Notes,
          "Wi-Fi Calling on Other Devices; AT&T SIM",
          transcriptNote,
        ),
      ],
    }),
  ],
  "9.2/beta-3": [],
  "9.2/beta-4": [],
  "9.2.1/beta-1": [],
  "9.2.1/beta-2": [],

  "9.3/beta-1": [
    documented({
      key: "ios-9-3-prerelease-night-shift",
      title: "Night Shift display scheduling",
      canonicalSummary:
        "Night Shift used time and location to move the display toward warmer colors after sunset and restore its normal balance in the morning.",
      category: "feature",
      action: "introduced",
      summary:
        "Apple's preview introduced an automatic evening display-color schedule under the Night Shift name.",
      citations: [
        cite(
          U.ios93Preview,
          "Night Shift; clock and geolocation",
          firstPartyNote,
        ),
        cite(U.ios93b1, "What's new; Night Shift", observedNote),
      ],
    }),
    documented({
      key: "ios-9-3-prerelease-notes-lock",
      title: "Protected individual notes",
      canonicalSummary:
        "A note could be secured individually with a password or a fingerprint.",
      category: "feature",
      action: "introduced",
      summary:
        "Beta 1 added per-note access protection rather than locking the Notes application as a whole.",
      citations: [
        cite(U.ios93Preview, "Notes; password or fingerprint", firstPartyNote),
        cite(U.ios93b1, "What's new; Notes; password protected", observedNote),
      ],
    }),
    documented({
      key: "ios-9-3-prerelease-notes-sorting",
      title: "Configurable Notes sorting",
      canonicalSummary:
        "Notes could be ordered by creation time, modification time, or title.",
      category: "enhancement",
      action: "introduced",
      summary:
        "The first seed exposed multiple ordering choices for a user's notes.",
      citations: [
        cite(U.ios93Preview, "Notes; sort notes", firstPartyNote),
        cite(U.ios93b1, "Notes; sorting by date created", observedNote),
      ],
    }),
    documented({
      key: "ios-9-3-prerelease-news-feed",
      title: "More adaptive Apple News feed",
      canonicalSummary:
        "Apple News refined recommendations, surfaced editorial and trending items, played feed video, supported iPhone landscape, and refreshed stories faster.",
      category: "enhancement",
      action: "introduced",
      summary:
        "Apple grouped several discovery, presentation, and refresh improvements into the Beta 1 News experience.",
      citations: [
        cite(U.ios93Preview, "News; For You; video; landscape", firstPartyNote),
        cite(U.ios93b1, "What's new; Apple News", observedNote),
      ],
    }),
    corroborated({
      key: "ios-9-3-prerelease-health-app-discovery",
      title: "Health app-discovery preview",
      canonicalSummary:
        "Apple's iOS 9.3 preview described controls in selected Health categories for finding compatible tracking apps.",
      category: "enhancement",
      action: "changed",
      inheritance: "cumulative",
      summary:
        "Apple announced the discovery interface for the 9.3 cycle, but contemporary Beta 1 testing did not find it active; this record preserves preview scope rather than claiming seed availability.",
      citations: [
        cite(U.ios93Preview, "Health; slider menu; apps", firstPartyNote),
        cite(
          U.ios93b1Features,
          "Health; app discovery; features may not be functional",
          observedNote,
        ),
      ],
    }),
    corroborated({
      key: "ios-9-3-prerelease-health-watch-activity",
      title: "Apple Watch activity preview in Health",
      canonicalSummary:
        "Apple's iOS 9.3 preview described Health views for Apple Watch movement, exercise, standing, and goal information.",
      category: "enhancement",
      action: "changed",
      inheritance: "cumulative",
      summary:
        "Apple announced the watch-data view for the 9.3 cycle, but contemporary Beta 1 testing did not confirm its interface; this record preserves preview scope rather than claiming seed availability.",
      citations: [
        cite(
          U.ios93Preview,
          "Health; move, exercise, and stand",
          firstPartyNote,
        ),
        cite(
          U.ios93b1Features,
          "Health; Activity interface; features may not be functional",
          observedNote,
        ),
      ],
    }),
    documented({
      key: "ios-9-3-prerelease-carplay-music-discovery",
      title: "Apple Music discovery in CarPlay",
      canonicalSummary:
        "CarPlay made Apple Music's New and For You discovery areas available on the vehicle display.",
      category: "enhancement",
      action: "introduced",
      summary:
        "The first 9.3 seed extended Apple Music discovery into the CarPlay interface.",
      citations: [
        cite(U.ios93Preview, "CarPlay; New and For You", firstPartyNote),
        cite(U.ios93b1, "CarPlay; New and For You", observedNote),
      ],
    }),
    documented({
      key: "ios-9-3-prerelease-carplay-nearby",
      title: "Nearby places in CarPlay Maps",
      canonicalSummary:
        "The CarPlay Maps interface added one-tap discovery for nearby fuel, parking, food, and coffee stops.",
      category: "enhancement",
      action: "introduced",
      summary:
        "Beta 1 surfaced Maps' nearby-place categories on the vehicle display.",
      citations: [
        cite(U.ios93Preview, "CarPlay; Nearby feature in Maps", firstPartyNote),
        cite(U.ios93b1, "CarPlay; Nearby feature", observedNote),
      ],
    }),
    documented({
      key: "ios-9-3-prerelease-shared-ipad",
      title: "Shared iPad student sessions",
      canonicalSummary:
        "Students could sign in to a classroom iPad and retrieve their own content on a device shared with classmates.",
      category: "feature",
      action: "introduced",
      summary:
        "Apple's education preview presented user-specific classroom sessions under the Shared iPad name.",
      citations: [
        cite(
          U.ios93Education,
          "Shared iPad; students; log in to any iPad",
          firstPartyNote,
        ),
        cite(U.ios93b1, "Education; shared iPads", observedNote),
      ],
    }),
    documented({
      key: "ios-9-3-prerelease-classroom-app",
      title: "Classroom teacher controls",
      canonicalSummary:
        "The Classroom app let a teacher launch apps for a class and guide what students viewed on their devices.",
      category: "feature",
      action: "introduced",
      summary:
        "Beta 1 introduced Apple's teacher-facing coordination application for managed classes.",
      citations: [
        cite(
          U.ios93Education,
          "Classroom App; launch everyone's apps; guide",
          firstPartyNote,
        ),
        cite(U.ios93b1, "Education; new Classroom app", observedNote),
      ],
    }),
    documented({
      key: "ios-9-3-prerelease-school-manager",
      title: "Apple School Manager administration",
      canonicalSummary:
        "Apple School Manager combined account creation, content purchasing, device enrollment, and school information-system integration.",
      category: "feature",
      action: "introduced",
      summary:
        "The education preview placed several district deployment tasks in one web administration service.",
      citations: [
        cite(
          U.ios93Education,
          "Apple School Manager; setup assistant; Student Information System",
          firstPartyNote,
        ),
        cite(U.ios93b1, "Education; Apple School Manager", observedNote),
      ],
    }),
    documented({
      key: "ios-9-3-prerelease-managed-apple-ids",
      title: "Managed Apple IDs for schools",
      canonicalSummary:
        "Schools could create role-aware Apple IDs in bulk, audit them, and reset their passwords.",
      category: "feature",
      action: "introduced",
      summary:
        "Beta 1's education program added institution-controlled identities designed for school deployment.",
      citations: [
        cite(
          U.ios93Education,
          "Managed Apple IDs; reset passwords; audit; create IDs in bulk",
          firstPartyNote,
        ),
        cite(U.ios93b1Features, "Education; Apple ID management", observedNote),
      ],
    }),
    observed({
      key: "ios-9-3-prerelease-multiple-watch-pairing",
      title: "Multiple Apple Watches per iPhone",
      canonicalSummary:
        "The seed let one iPhone maintain pairings with multiple Apple Watches when each watch also ran watchOS 2.2.",
      category: "compatibility",
      action: "introduced",
      summary:
        "The first seed and matching watchOS cycle expanded an iPhone beyond a single paired watch.",
      citations: [
        cite(U.ios93b1, "Apple Watch; pair with more than one", observedNote),
      ],
    }),
    observed({
      key: "ios-9-3-prerelease-quick-actions",
      title: "Expanded first-party Quick Actions",
      canonicalSummary:
        "Additional Apple applications exposed Home-screen shortcuts, and the App Store gained preview gestures.",
      category: "enhancement",
      action: "introduced",
      summary:
        "Beta 1 broadened 3D Touch shortcuts across Apple's bundled applications.",
      citations: [
        cite(
          U.ios93b1Features,
          "3D Touch Quick Actions; App Store; Peek and Pop",
          observedNote,
        ),
      ],
    }),
  ],
  "9.3/beta-2": [
    observed({
      key: "ios-9-3-prerelease-night-shift-control-center",
      title: "Night Shift Control Center control",
      canonicalSummary:
        "Control Center gained a dedicated button for changing the current Night Shift state.",
      category: "enhancement",
      action: "introduced",
      summary:
        "The second seed moved frequent Night Shift control into the system's quick-settings panel.",
      citations: [
        cite(
          U.ios93b2,
          "What's new; Control Center Night Shift Toggle",
          observedNote,
        ),
      ],
    }),
    observed({
      key: "ios-9-3-prerelease-night-shift-settings-section",
      title: "Dedicated Night Shift settings page",
      canonicalSummary:
        "Display settings placed all Night Shift controls in their own submenu.",
      category: "enhancement",
      action: "introduced",
      summary:
        "Beta 2 consolidated Night Shift preferences instead of leaving them inline with other display controls.",
      citations: [
        cite(U.ios93b2, "Night Shift Settings; own submenu", observedNote),
      ],
    }),
    observed({
      key: "ios-9-3-prerelease-music-playlist-library-toggle",
      title: "Playlist additions independent of music library",
      canonicalSummary:
        "A Music preference let a song join a playlist without also entering the user's iCloud Music Library.",
      category: "enhancement",
      action: "introduced",
      summary:
        "The second seed separated playlist membership from automatic library membership.",
      citations: [
        cite(
          U.ios93b2,
          "Apple Music Playlists; added to playlists; iCloud Music Library",
          observedNote,
        ),
      ],
    }),
    observed({
      key: "ios-9-3-prerelease-settings-wallpaper-quick-action",
      title: "Wallpaper Settings shortcut",
      canonicalSummary:
        "The Settings application's Home-screen shortcut menu no longer included a wallpaper command.",
      category: "removal",
      action: "removed",
      summary:
        "Beta 2 pruned the wallpaper entry from Settings' 3D Touch shortcut list.",
      citations: [
        cite(
          U.ios93b2,
          "Quick Actions; Settings; no longer offers wallpaper",
          observedNote,
        ),
      ],
    }),
    observed({
      key: "ios-9-3-prerelease-smart-connector-firmware",
      title: "Smart Connector accessory firmware updates",
      canonicalSummary:
        "An iPad Pro could deliver a firmware update to a connected Smart Connector accessory.",
      category: "compatibility",
      action: "introduced",
      summary:
        "Testing showed Beta 2 presenting an accessory-update flow for a connected keyboard case.",
      citations: [
        cite(
          U.ios93b2SmartConnector,
          "Smart Connector; update accessory firmware",
          observedNote,
        ),
      ],
    }),
  ],
  "9.3/beta-3": [
    observed({
      key: "ios-9-3-prerelease-verizon-wifi-calling",
      title: "Verizon Wi-Fi Calling",
      canonicalSummary:
        "The seed enabled Verizon Wi-Fi Calling as a fallback in areas with weak cellular coverage.",
      category: "feature",
      action: "introduced",
      summary: "Beta 3 enabled Apple's Wi-Fi Calling path for Verizon service.",
      citations: [
        cite(U.ios93b3, "What's new; Verizon Wi-Fi calling", observedNote),
      ],
    }),
    observed({
      key: "ios-9-3-prerelease-tmobile-cellular-app-loading",
      title: "T-Mobile cellular app loading",
      canonicalSummary:
        "A carrier update corrected a failure that kept applications from loading over T-Mobile cellular data.",
      category: "bugFix",
      action: "fixed",
      summary:
        "The third seed paired with carrier settings that repaired the reported T-Mobile data path.",
      citations: [
        cite(U.ios93b3, "T-Mobile bug fix; apps; cellular", observedNote),
      ],
    }),
  ],
  "9.3/beta-4": [
    observed({
      key: "ios-9-3-prerelease-night-shift-control-icon",
      title: "Revised Night Shift icon",
      canonicalSummary:
        "The Night Shift button changed from an eye-and-moon symbol to a moon inside a sun.",
      category: "enhancement",
      action: "changed",
      summary:
        "Beta 4 revised the visual language of the Control Center button.",
      citations: [
        cite(U.ios93b4, "What's new; Night Shift; icon", observedNote),
      ],
    }),
    observed({
      key: "ios-9-3-prerelease-1970-date-recovery",
      title: "Recovery from the 1970 date boot loop",
      canonicalSummary:
        "The system blocked the problematic early date and could restore affected 64-bit devices from the restart loop.",
      category: "bugFix",
      action: "fixed",
      summary:
        "Testing of Beta 4 showed both a lower date bound and a usable restore path for devices already trapped by the issue.",
      citations: [
        cite(
          U.ios93b4DateFix,
          "iOS 9.3 beta 4; date; restore; boot loops",
          observedNote,
        ),
      ],
    }),
    observed({
      key: "ios-9-3-prerelease-night-shift-low-power-coexistence",
      title: "Night Shift with Low Power Mode",
      canonicalSummary:
        "The screen-warming feature could remain active while the energy-saving system profile was enabled.",
      category: "behavior",
      action: "removed",
      summary:
        "Beta 4 stopped the two power-and-display features from remaining active together.",
      citations: [
        cite(
          U.ios93b45NightShift,
          "betas 4 and 5; disabled; Low Power Mode",
          observedNote,
        ),
        cite(
          U.ios932b2,
          "Early betas; removed in iOS 9.3 beta 4",
          observedNote,
        ),
      ],
    }),
  ],
  "9.3/beta-5": [
    observed({
      key: "ios-9-3-prerelease-pencil-navigation",
      title: "Apple Pencil system navigation",
      canonicalSummary:
        "Apple Pencil again selected text, scrolled content, changed apps, opened menus, and edited outside drawing canvases.",
      category: "bugFix",
      action: "fixed",
      summary:
        "Beta 5 restored the broader Pencil interactions that earlier 9.3 seeds had withheld.",
      citations: [
        cite(
          U.ios93b5,
          "restores full navigational functionality; Apple Pencil",
          observedNote,
        ),
      ],
    }),
    observed({
      key: "ios-9-3-prerelease-night-shift-toggle-behavior",
      title: "Simplified Night Shift button behavior",
      canonicalSummary:
        "The Control Center button directly changed Night Shift instead of opening a choice menu.",
      category: "behavior",
      action: "changed",
      summary:
        "Beta 5 converted the Night Shift quick control from a menu launcher into a direct toggle.",
      citations: [
        cite(
          U.ios93b5,
          "What's new; Night Shift Control Center toggle",
          observedNote,
        ),
        cite(
          U.ios93b45NightShift,
          "no longer has a contextual menu; manually activates",
          observedNote,
        ),
      ],
    }),
  ],
  "9.3/beta-6": [],
  "9.3/beta-7": [],

  "9.3.2/beta-1": [
    observed({
      key: "ios-9-3-2-prerelease-landscape-quick-actions",
      title: "Smoother landscape Quick Actions",
      canonicalSummary:
        "Home-screen Quick Actions opened without the previously visible stutter when the device was in landscape.",
      category: "bugFix",
      action: "fixed",
      summary:
        "The first 9.3.2 seed corrected the landscape animation of 3D Touch shortcut menus.",
      citations: [
        cite(
          U.ios932b1,
          "What's new; Quick Actions; landscape; jittering",
          observedNote,
        ),
      ],
    }),
    observed({
      key: "ios-9-3-2-prerelease-game-center-white-screen",
      title: "Game Center white-screen failure",
      canonicalSummary:
        "Affected testers reported that Game Center and dependent games no longer stalled on a white screen.",
      category: "bugFix",
      action: "fixed",
      summary:
        "Community testing of the first public seed suggested the long-running Game Center failure was repaired, but Apple did not confirm the fix.",
      citations: [
        cite(
          U.ios932b1GameCenter,
          "reportedly resolved; white screen; public beta",
          observedNote,
        ),
      ],
    }),
  ],
  "9.3.2/beta-2": [
    observed({
      key: "ios-9-3-prerelease-night-shift-low-power-coexistence",
      title: "Night Shift with Low Power Mode",
      canonicalSummary:
        "The screen-warming feature could remain active while the energy-saving system profile was enabled.",
      category: "behavior",
      action: "fixed",
      summary:
        "The second 9.3.2 seed restored simultaneous use after the 9.3 cycle had disabled it.",
      citations: [
        cite(
          U.ios932b2,
          "Night Shift and Low Power Mode; re-enabling",
          observedNote,
        ),
        cite(
          U.ios932Public,
          "using Night Shift and Low Power Mode simultaneously",
          observedNote,
        ),
      ],
    }),
  ],
  "9.3.2/beta-3": [],
  "9.3.2/beta-4": [],

  "9.3.3/beta-1": [
    observed({
      key: "ios-9-3-3-prerelease-ipad-pro-9-7-availability",
      title: "9.7-inch iPad Pro seed availability",
      canonicalSummary:
        "Apple's smaller 2016 iPad Pro could install the 9.3.3 testing build.",
      category: "compatibility",
      action: "knownIssue",
      summary:
        "Apple did not provide the first 9.3.3 seed for the 9.7-inch iPad Pro while the prior update's device-specific problem remained unresolved.",
      citations: [
        cite(
          U.ios933b1,
          "no iOS 9.3.3 update; 9.7-inch iPad Pro",
          observedNote,
        ),
      ],
    }),
  ],
  "9.3.3/beta-2": [
    observed({
      key: "ios-9-3-3-prerelease-ipad-pro-9-7-availability",
      title: "9.7-inch iPad Pro seed availability",
      canonicalSummary:
        "Apple's smaller 2016 iPad Pro could install the 9.3.3 testing build.",
      category: "compatibility",
      action: "fixed",
      summary:
        "Beta 2 added the 9.7-inch iPad Pro after Apple replaced the problematic 9.3.2 device build.",
      citations: [
        cite(U.ios933b2, "now available; 9.7-inch iPad Pro", observedNote),
      ],
    }),
  ],
  "9.3.3/beta-3": [],
  "9.3.3/beta-4": [],
  "9.3.3/beta-5": [],
};

const routeKey = (route) => `${route.version}/${route.alias}`;
for (const route of routeSpecs) {
  assert(routeKey(route) in changesByRoute, `${routeKey(route)} changes`);
}
assert.equal(
  Object.keys(changesByRoute).length,
  routeSpecs.length,
  "exact route/change closure",
);

const dedupeCitations = (citations) => {
  const seen = new Set();
  return citations.filter((citation) => {
    const key = `${citation.url}\0${citation.locator}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
};

const substantiveRouteSpecs = routeSpecs.filter(
  (route) => changesByRoute[routeKey(route)].length > 0,
);
const identityOnlyRouteSpecs = routeSpecs.filter(
  (route) => changesByRoute[routeKey(route)].length === 0,
);

const events = substantiveRouteSpecs.map((route) => {
  const changes = changesByRoute[routeKey(route)];
  const corroborationCitations = (route.corroborationUrls || []).map((url) =>
    cite(url, `${route.label} corroborating identity`, identityNote),
  );
  const identityCitations = [
    cite(route.url, `${route.label} identity and timing`, identityNote),
    ...corroborationCitations,
  ];
  const changeCitations = dedupeCitations(
    changes.flatMap((change) => change.citations),
  );
  const boundaryCitation = cite(
    publicCycles[route.version].url,
    `iOS ${route.version} public-release boundary`,
    "Contemporary public boundary; no separate candidate route is inferred.",
  );
  const deltaText = `This page indexes ${changes.length} milestone-specific records. It excludes features merely repeated from an earlier seed and avoids treating a final cumulative list as a fresh beta delta. Any explicitly cumulative record preserves bounded release-scope context rather than claiming that a feature was active in this seed.`;
  return {
    target: {
      releaseVersionId: `version-ios-${route.version.replaceAll(".", "-")}`,
      routeAlias: route.alias,
    },
    identity: {
      releaseVersionId: `version-ios-${route.version.replaceAll(".", "-")}`,
      platformId: "platform-ios",
      stableEventId: `event:apple:ios:${route.version}:${route.alias}`,
      label: route.label,
      routeAlias: route.alias,
      channel: "developerBeta",
      appearanceDate: route.date,
      sequence: route.sequence,
      isRevision: false,
      availabilityState: "available",
      closesReleaseCycle: false,
    },
    authorship: "originalSynthesis",
    summary: `iOS ${route.version} ${route.label} is an editorially reviewed historical archive page with ${changes.length} bounded, source-backed records.`,
    article: {
      authorship: "originalSynthesis",
      blocks: [
        { style: "h2", text: "Milestone identity" },
        {
          style: "normal",
          text: `Contemporary coverage identifies iOS ${route.version} ${route.label} as distributed to registered developers on ${route.date}. Public-test participation is mentioned only when it joined the same numbered milestone; it is not split into a duplicate route.`,
          citations: identityCitations,
        },
        { style: "h2", text: "What changed here" },
        {
          style: "normal",
          text: deltaText,
          citations:
            changeCitations.length > 0 ? changeCitations : identityCitations,
        },
        { style: "h2", text: "Evidence boundary" },
        {
          style: "normal",
          text: `The retained sequence proceeds from numbered betas to the iOS ${route.version} public release. No separately distributed GM or RC is modeled. That is a bounded archival conclusion about externally named routes, not a statement about Apple's internal candidates.`,
          citations: [boundaryCitation],
        },
      ],
    },
    citations: dedupeCitations([
      ...identityCitations,
      ...changeCitations,
      boundaryCitation,
    ]),
    changes,
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
const sources = researchSources.filter((source) => usedUrls.has(source.url));
const bundle = {
  formatVersion: 1,
  target: { projectId: "lh3yswzu", dataset: "production" },
  accessedAt,
  sources,
  versions: [],
  events,
  builds: [],
};

const declaredUrls = new Set(sources.map((source) => source.url));
assert.equal(declaredUrls.size, sources.length, "unique source URLs");
assert(
  [...usedUrls].every((url) =>
    researchSources.some((source) => source.url === url),
  ),
  "every cited URL belongs to the retained research source set",
);
assert.deepEqual(usedUrls, declaredUrls, "declared source/use closure");

const publicBatch = JSON.parse(
  readFileSync(join(here, "apple-ios-9.json"), "utf8"),
);
const approvedParents = new Set(
  publicBatch.events
    .filter(
      (event) =>
        event.target?.routeAlias === "public" &&
        event.editorialReview?.status === "approved" &&
        event.isIndexable === true,
    )
    .map((event) => event.target.releaseVersionId),
);
for (const version of Object.keys(publicCycles)) {
  const id = `version-ios-${version.replaceAll(".", "-")}`;
  assert(approvedParents.has(id), `${id} approved Public parent`);
}

let occurrenceCount = 0;
const localDefinitions = new Map();
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
assert.equal(events.length, 13, "substantive route count");
assert.equal(identityOnlyRouteSpecs.length, 14, "timeline-only identity count");
assert.equal(occurrenceCount, 48, "occurrence count");
assert.equal(localDefinitions.size, 46, "definition count");
assert.deepEqual(
  events.flatMap((event) =>
    event.changes
      .filter((change) => change.inheritance === "cumulative")
      .map(
        (change) =>
          `${event.target.releaseVersionId}/${event.target.routeAlias}:${change.key}`,
      ),
  ),
  [
    "version-ios-9-3/beta-1:ios-9-3-prerelease-health-app-discovery",
    "version-ios-9-3/beta-1:ios-9-3-prerelease-health-watch-activity",
  ],
  "exact cumulative preview-context inventory",
);
assert.deepEqual(bundle.versions, [], "no version overlays");
assert.deepEqual(bundle.builds, [], "no build documents");
assert(
  bundle.events.every(
    (event) =>
      event.target.routeAlias.startsWith("beta-") &&
      !["gm", "rc", "public"].includes(event.target.routeAlias),
  ),
  "numbered betas only",
);

const expectedRouteCounts = new Map([
  ["9.1", 5],
  ["9.2", 4],
  ["9.2.1", 2],
  ["9.3", 7],
  ["9.3.2", 4],
  ["9.3.3", 5],
]);
for (const [version, count] of expectedRouteCounts) {
  assert.equal(
    routeSpecs.filter((route) => route.version === version).length,
    count,
    `${version} route count`,
  );
}

const recurrence = new Map();
for (const event of events) {
  for (const change of event.changes) {
    recurrence.set(change.key, [
      ...(recurrence.get(change.key) || []),
      `${event.identity.releaseVersionId}/${event.identity.routeAlias}:${change.action}`,
    ]);
  }
}
assert.deepEqual(
  recurrence.get("ios-9-3-prerelease-night-shift-low-power-coexistence"),
  ["version-ios-9-3/beta-4:removed", "version-ios-9-3-2/beta-2:fixed"],
  "Night Shift/Low Power transition",
);
assert.deepEqual(
  recurrence.get("ios-9-3-3-prerelease-ipad-pro-9-7-availability"),
  ["version-ios-9-3-3/beta-1:knownIssue", "version-ios-9-3-3/beta-2:fixed"],
  "9.7-inch iPad Pro availability transition",
);

const thisRoutes = new Set(
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
    const otherRoute =
      event.target?.releaseVersionId && event.target?.routeAlias
        ? `${event.target.releaseVersionId}\0${event.target.routeAlias}`
        : null;
    assert(
      !otherRoute || !thisRoutes.has(otherRoute),
      `${name} owns ${otherRoute?.replace("\0", "/")}`,
    );
    assert(
      !event.identity?.stableEventId ||
        !thisStableIds.has(event.identity.stableEventId),
      `${name} owns ${event.identity?.stableEventId}`,
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

const routeRows = routeSpecs
  .map((route) => {
    const count = changesByRoute[routeKey(route)].length;
    const disposition = count > 0 ? "Approved archive" : "Timeline ledger only";
    return `| iOS ${route.version} ${route.label} | \`${route.alias}\` | ${route.date} | ${count} | ${disposition} |`;
  })
  .join("\n");
const routeVerificationRows = events
  .map((event) => {
    const [, , , version, alias] = event.identity.stableEventId.split(":");
    return `| \`/apple/ios/${version}/${alias}/\` | 200 | 3/3 | ${event.changes.length}/${event.changes.length} | yes | yes | no | index, follow |`;
  })
  .join("\n");
const sourceLedger = researchSources
  .map(
    (source) =>
      `- [${source.title}](${source.url}) — ${source.publisher}; ${source.sourceClass}.`,
  )
  .join("\n");

const md = `# Apple iOS 9 point-release prerelease archive batch

## Result

\`${outputName}\` is the approved archive batch for the 13 defensible
numbered developer-beta milestones with source-verifiable product or developer
changes. The ledger closes all 27 named routes attached to iOS 9.1 through
9.3.3 Public parents. It does not read, regenerate, or modify the independently
researched iOS 9.0 prerelease candidate.

- ${events.length} editorially verified, approved, indexable archive routes
- ${identityOnlyRouteSpecs.length} additional named milestones retained only
  as timeline evidence because no substantive fresh delta survives
- ${occurrenceCount} milestone occurrences across ${localDefinitions.size}
  stable definitions
- ${sources.length} content-bundle sources, ${researchSources.length} retained
  research sources, and ${allCitationUrls.length} content citation references
- zero release overlays, build documents, GM routes, RC routes, or Public
  route events
- zero synthetic evidence-boundary or generic “bug fixes” change records

## Exact route closure

| Historical milestone | Route alias | Appearance | Records | Disposition |
| --- | --- | --- | ---: | --- |
${routeRows}

## Evidence method

1. Each route identity is tied to a same-day contemporary report. A public
   beta sharing the same numbered milestone is noted in prose rather than
   duplicated as another route.
2. Apple's archived iOS 9.3 and Education preview pages are treated as
   first-party-authored archive states. Their prose is not copied.
3. The iOS 9.2 Beta 2 developer-note transcript is credited to the publisher
   that preserved it. Apple's surviving final SDK document is used only as a
   cumulative cross-check.
4. A milestone delta is emitted only where the evidence identifies activation
   or change at that milestone. Two first-party iOS 9.3 Health preview
   announcements whose Beta 1 interfaces could not be confirmed are retained
   as explicitly cumulative context, not Beta 1 deltas.
5. Repeated summaries of an earlier seed are not carried forward as fresh
   deltas.
6. Sparse maintenance seeds remain in this ledger as timeline evidence. They
   are omitted from the JSON bundle instead of receiving synthetic
   evidence-boundary or generic “bug fixes” change records.

## Exact conflicts, gaps, and exclusions

- iOS 9.2.1 has two defensible numbered routes: Beta 1 / build 13D11 on
  December 16 and Beta 2 / build 13D14 on January 4.
- The January 19 MacRumors public-release article says there were “three
  betas,” but its own guide, the two named MacRumors articles, and the
  independent 9to5Mac trail expose only those two distinct numbered builds.
  No unnamed Beta 3 route is synthesized from the aggregate sentence.
- The retained public-boundary reports move directly from the last numbered
  beta to Public. No separately distributed iOS 9.1–9.3.3 point-release GM or
  RC is found, so none is inferred from a final build.
- iOS 9.3.1 arrived ten days after 9.3 to repair the web-link failure; no
  defensible external beta route was found.
- iOS 9.3.4 and 9.3.5 were public security updates without a defensible
  external beta cycle. The local approved Public batch omits 9.3.4.
- Apple's current iOS 9 update history also lists device-limited iOS 9.3.6
  from 2019. No external beta route or local Public parent exists for it.
- Revised public builds of iOS 9.2.1 and 9.3 are not relabeled as beta,
  prerelease, or revision routes in this batch.
- Build strings verify research identities but are intentionally not emitted
  as release-build documents.

## Recurrence model

- \`ios-9-3-prerelease-night-shift-low-power-coexistence\` records the Beta 4
  removal and the iOS 9.3.2 Beta 2 restoration with one immutable definition.
- \`ios-9-3-3-prerelease-ipad-pro-9-7-availability\` records the missing
  first device seed and its Beta 2 resolution without changing the canonical
  definition.
- The two iOS 9.3 Health preview records are cumulative context because
  Apple announced them for the cycle while contemporary Beta 1 testing could
  not confirm that their interfaces were active.
- No cumulative occurrence is emitted merely to show that an earlier feature
  still existed.

## Copyright and attribution controls

- Titles, summaries, occurrence descriptions, and articles are original
  synthesis.
- Every factual change has a claim-level source and locator.
- Preserved Apple-authored material is labeled by custody and publisher.
- No source article, transcript, screenshot, or long quotation is committed
  to the bundle.
- The companion evidence audit pins raw and normalized artifacts and enforces
  a short contiguous-overlap ceiling for reader-facing prose.

## Source ledger

All retained research sources were accessed on ${accessedAt}. Only sources
cited by the 13 archive routes are declared inside the JSON bundle.

${sourceLedger}

Additional Apple final documents, current iOS 9 history, public-only
maintenance-release reports, archive-index responses, and guide pages are
hash-pinned by the evidence audit for route exclusion and custody verification
but are not all declared as reader-facing sources.

## Closure guards

- Exact approved/indexable Public-parent assertion against
  \`apple-ios-9.json\`
- Exact 27-route, date, sequence, and per-cycle allowlist
- Explicit no-GM, no-RC, no-Public, no-build, and no-version-overlay boundary
- Collision scan across every other research-batch JSON
- ${occurrenceCount} occurrences resolve to ${localDefinitions.size} stable
  definitions with two tested cross-milestone transitions
- Complete unique source declaration/use closure
- Deterministic formatted JSON SHA-256: \`${jsonSha}\`

## Editorial approval

- provenance: \`editoriallyVerified\`
- editorial status: \`approved\`
- indexability: \`true\`
- reviewed at: \`${reviewedAt}\`
- independent substantive review: clean after correcting the two iOS 9.3
  Health preview records to cumulative, partially documented context
- evidence audit: ${verification.rawArtifacts} exact raw artifacts totaling
  ${verification.rawEvidenceBytes.toLocaleString("en-US")} bytes and
  ${verification.normalizedArtifacts} normalized text locks
- independent live re-fetch: all
  ${verification.independentSourcesFetched} declared sources available;
  ${verification.independentRawExact} raw artifacts reproduced byte-for-byte,
  ${verification.independentNormalizedExact} selected article boundaries
  matched, all ${verification.independentMarkersReproduced} marker sets
  reproduced, and every retained evidence boundary passed
- \`npm run research:validate\`:
  ${verification.researchBatches} batches and
  ${verification.globalChangeKeys.toLocaleString("en-US")} globally consistent
  change keys
- focused ingestion/manifest suite:
  ${verification.focusedTests} of ${verification.focusedTests} passed
- full repository suite:
  ${verification.fullTests} of ${verification.fullTests} passed
- copyright-similarity scan: maximum contiguous reader-facing overlap of
  ${verification.maximumEditorialOverlapWords} words
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
- Mutation payload:
  ${dryRun.mutationPayloadBytes.toLocaleString("en-US")} bytes
- Plan SHA: \`${dryRun.planSha}\`
- Plan artifact SHA-256: \`${dryRun.planArtifactSha}\`
- Rollback artifact SHA-256: \`${dryRun.rollbackArtifactSha}\`
- Rollback coverage: all ${dryRun.creates} proposed creates and zero restore
  documents

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
Each returned all three archival article sections, every expected structured
change title, References, its first cited source, and an \`index, follow\`
directive. No route returned placeholder copy or a \`noindex\` directive.

| Canonical route | HTTP | Article sections | Expected changes | References | First source | Placeholder | Robots |
| --- | ---: | ---: | ---: | --- | --- | --- | --- |
${routeVerificationRows}

## Reproduction

\`\`\`sh
node scripts/research-batches/audit-ios9-point-prerelease.mjs tmp/ios9-point-evidence
node scripts/research-batches/build-apple-ios-9-point-prerelease.mjs
npm run research:validate
node --import tsx --test tests/launch-content-ingestion.test.ts tests/launch-content-manifest.test.ts
npx eslint scripts/research-batches/build-apple-ios-9-point-prerelease.mjs scripts/research-batches/audit-ios9-point-prerelease.mjs
npx prettier --check scripts/research-batches/build-apple-ios-9-point-prerelease.mjs scripts/research-batches/audit-ios9-point-prerelease.mjs scripts/research-batches/apple-ios-9-point-prerelease.json scripts/research-batches/apple-ios-9-point-prerelease.md
npx sanity exec scripts/ingest-launch-content.ts --with-user-token -- --content scripts/research-batches/apple-ios-9-point-prerelease.json
\`\`\`

No deployment was performed; domain and deployment work remains scheduled
separately.
`;

const formattedMd = await prettier.format(md, { filepath: ledgerName });
writeFileSync(join(here, ledgerName), formattedMd);

console.log(`Wrote ${outputName}`);
console.log(`Wrote ${ledgerName}`);
console.log(`${events.length} substantive events`);
console.log(`${identityOnlyRouteSpecs.length} timeline-only identities`);
console.log(`${occurrenceCount} occurrences`);
console.log(`${localDefinitions.size} stable definitions`);
console.log(`${sources.length} sources`);
console.log(`${allCitationUrls.length} citation references`);
console.log(`JSON SHA-256 ${jsonSha}`);
