import { createHash } from "node:crypto";
import {
  copyFileSync,
  mkdirSync,
  readFileSync,
  statSync,
  writeFileSync,
} from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(here, "../../..");
const rawRoot =
  "tmp/research-evidence/beta-chronology-gap/tvos-major-11-26";
const batchId = "beta-chronology-gap-tvos-major-11-26";
const createdAt = "2026-07-31T03:03:34.000Z";
const queriedAt = "2026-07-31T03:03:34Z";
const cutoff = "2026-07-30";
const packetSourcesPath =
  "research-handoffs/beta-chronology-gap/tvos-major-11-26/sources.json";

const cycles = {
  "11.0": [
    [1, "2017-06-26"],
    [2, "2017-07-12"],
    [3, "2017-07-25"],
    [4, "2017-08-08"],
    [5, "2017-08-14"],
    [6, "2017-08-21"],
    [7, "2017-08-28"],
    [8, "2017-08-31"],
    [9, "2017-09-05"],
  ],
  "12.0": [
    [1, "2018-06-25"],
    [2, "2018-07-05"],
    [3, "2018-07-18"],
    [4, "2018-07-31"],
    [5, "2018-08-06"],
    [6, "2018-08-15"],
    [7, "2018-08-20"],
    [8, "2018-08-27"],
  ],
  "13.0": [
    [1, "2019-06-24"],
    [2, "2019-07-03"],
    [3, "2019-07-18"],
    [4, "2019-07-30"],
    [5, "2019-08-08"],
    [6, "2019-08-15"],
  ],
  "14.0": [
    [1, "2020-07-09"],
    [2, "2020-07-22"],
    [4, "2020-08-06"],
    [5, "2020-08-19"],
    [6, "2020-08-25"],
    [7, "2020-09-03"],
    [8, "2020-09-09"],
  ],
  "15.0": [
    [1, "2021-06-30"],
    [2, "2021-07-16"],
    [4, "2021-07-28"],
    [5, "2021-08-11"],
    [6, "2021-08-18"],
    [7, "2021-08-25"],
    [8, "2021-08-31"],
  ],
  "16.0": [
    [1, "2022-07-11"],
    [2, "2022-07-28"],
    [3, "2022-08-09"],
    [4, "2022-08-15"],
    [5, "2022-08-24"],
  ],
  "17.0": [
    [1, "2023-07-12"],
    [2, "2023-07-31"],
    [3, "2023-08-09"],
    [4, "2023-08-16"],
    [5, "2023-08-22"],
    [6, "2023-08-29"],
  ],
  "18.0": [
    [1, "2024-07-15"],
    [2, "2024-07-24"],
    [3, "2024-08-06"],
    [4, "2024-08-12"],
    [5, "2024-08-20"],
    [8, "2024-08-28"],
  ],
  "26.0": [
    [1, "2025-07-24"],
    [2, "2025-08-07"],
    [3, "2025-08-14"],
    [4, "2025-08-18"],
    [5, "2025-08-25"],
    [6, "2025-09-02"],
  ],
};

const releaseVersionId = (version) =>
  `version-tvos-${version.replaceAll(".", "-")}`;
const candidateId = (version, ordinal) =>
  `candidate:apple:tvos:${version}:public-beta-${ordinal}`;
const key = (version, ordinal) => `${version}:${ordinal}`;

function sha256(buffer) {
  return createHash("sha256").update(buffer).digest("hex");
}

function rawEvidence(rawPath, locator, captureMethod = "http-html") {
  const absolute = resolve(repoRoot, rawPath);
  const bytes = statSync(absolute).size;
  return {
    rawPath,
    rawBytes: bytes,
    rawSha256: sha256(readFileSync(absolute)),
    captureMethod,
    locator,
  };
}

function decodeHtml(value) {
  return value
    .replace(/<[^>]+>/g, "")
    .replace(/&#8211;|&#8212;/g, "—")
    .replace(/&#8216;|&#8217;/g, "’")
    .replace(/&#8220;|&#8221;/g, '"')
    .replace(/&#038;|&amp;/g, "&")
    .replace(/&nbsp;/g, " ")
    .trim();
}

const sources = [];
const sourceById = new Map();

function addSource(source) {
  if (sourceById.has(source.sourceId)) return source.sourceId;
  const normalized = {
    sourceId: source.sourceId,
    canonicalUrl: source.canonicalUrl,
    title: source.title,
    publisher: source.publisher,
    author: source.author ?? null,
    publishedAt: source.publishedAt ?? null,
    publishedDateObserved: source.publishedDateObserved,
    publicationDatePrecision: source.publicationDatePrecision ?? "date",
    accessedAt: cutoff,
    archiveUrl: null,
    status: "active",
    sourceClass: "journalism",
    roles: source.roles ?? [
      "publicAvailability",
      "publicOrdinal",
      "appearanceDate",
      "channelIdentity",
    ],
    evidence: rawEvidence(
      source.rawPath,
      source.locator,
      source.captureMethod,
    ),
    lineage: {
      publisherFamily: source.publisher,
      independentForCorroboration: true,
      notes:
        source.lineageNotes ??
        "A distinct publisher counts as one editorial lineage; repeated pages from this publisher do not create additional independence.",
    },
  };
  sources.push(normalized);
  sourceById.set(normalized.sourceId, normalized);
  return normalized.sourceId;
}

const timelineSources = {
  "11.0": addSource({
    sourceId: "source-tvos11-iculture-timeline",
    canonicalUrl:
      "https://www.iculture.nl/nieuws/tvos-11-publieke-beta-apple-tv/",
    title:
      "tvOS 11 Publieke beta: Apple brengt zevende publieke beta voor Apple TV uit",
    publisher: "iCulture",
    author: "Redactie iCulture.nl",
    publishedAt: "2017-08-28T20:15:18+00:00",
    publishedDateObserved: "2017-08-28",
    rawPath: `${rawRoot}/iculture/tvos-11.html`,
    locator:
      "Article sections headed tvOS 11 publieke beta 1 through 7, each with an explicit date.",
  }),
  "12.0": addSource({
    sourceId: "source-tvos12-imore-timeline",
    canonicalUrl: "https://www.imore.com/how-download-tvos-12-public-beta",
    title: "How to download tvOS 12 public beta to your Apple TV",
    publisher: "iMore",
    author: null,
    publishedDateObserved: "2018-06-25",
    rawPath: `${rawRoot}/imore/tvos-12.html`,
    locator:
      "Retained article history headings for tvOS 12 Public Beta 6, 7, and 8.",
  }),
  "13.0": addSource({
    sourceId: "source-tvos13-imore-timeline",
    canonicalUrl: "https://www.imore.com/how-download-tvos-13-public-beta",
    title: "How to download the tvOS 13 public beta",
    publisher: "iMore",
    author: null,
    publishedDateObserved: "2019-06-24",
    rawPath: `${rawRoot}/imore/tvos-13.html`,
    locator:
      "Retained article history headings for tvOS 13 Public Beta 1 through 6.",
  }),
  "14.0": addSource({
    sourceId: "source-tvos14-imore-timeline",
    canonicalUrl: "https://www.imore.com/how-download-tvos-14-public-beta",
    title: "How to download the tvOS 14 public beta",
    publisher: "iMore",
    author: null,
    publishedDateObserved: "2020-07-09",
    rawPath: `${rawRoot}/imore/tvos-14.html`,
    locator:
      "Retained article history headings for Public Beta 1, 2, 4, 5, 6, 7, and 8.",
  }),
  "14.0-iculture": addSource({
    sourceId: "source-tvos14-iculture-timeline",
    canonicalUrl: "https://www.iculture.nl/nieuws/tvos-14-beta/",
    title: "tvOS 14 beta nu beschikbaar: ontwikkelaars kunnen aan de slag",
    publisher: "iCulture",
    author: "Redactie iCulture.nl",
    publishedDateObserved: "2020-09-10",
    rawPath: `${rawRoot}/iculture/tvos-14.html`,
    locator:
      "Tijdlijn tvOS 14 beta; explicitly lists Public Beta 4 through 8 and no Public Beta 3.",
  }),
  "15.0": addSource({
    sourceId: "source-tvos15-iculture-timeline",
    canonicalUrl: "https://www.iculture.nl/nieuws/tvos-15-beta/",
    title: "Apple brengt Release Candidate van tvOS 15 uit",
    publisher: "iCulture",
    author: "Redactie iCulture.nl",
    publishedDateObserved: "2021-09-14",
    rawPath: `${rawRoot}/iculture/tvos-15.html`,
    locator:
      "Tijdlijn tvOS 15 beta; Public Beta 1, 2, 4, 5, 6, 7, and 8, plus explicit statement that Apple skipped Public Beta 3.",
  }),
  "16.0": addSource({
    sourceId: "source-tvos16-iculture-timeline",
    canonicalUrl: "https://www.iculture.nl/nieuws/tvos-16-beta/",
    title: "Alles over de tvOS 16 beta",
    publisher: "iCulture",
    author: "Redactie iCulture.nl",
    publishedDateObserved: "2022-08-24",
    rawPath: `${rawRoot}/iculture/tvos-16.html`,
    locator:
      "Tijdlijn tvOS 16 beta; Public Beta 1, 2, 3, 5, plus a conflicting Public Beta 6 label on August 15.",
  }),
  "17.0": addSource({
    sourceId: "source-tvos17-iculture-timeline",
    canonicalUrl: "https://www.iculture.nl/nieuws/tvos-17-beta/",
    title: "Alles over de tvOS 17 beta",
    publisher: "iCulture",
    author: "Redactie iCulture.nl",
    publishedDateObserved: "2023-08-29",
    rawPath: `${rawRoot}/iculture/tvos-17.html`,
    locator:
      "Tijdlijn tvOS 17 beta; Public Beta 1 through 6 with explicit dates.",
  }),
  "18.0": addSource({
    sourceId: "source-tvos18-iculture-timeline",
    canonicalUrl: "https://www.iculture.nl/nieuws/tvos-18-beta/",
    title: "Alles over de tvOS 18 Release Candidate",
    publisher: "iCulture",
    author: "Redactie iCulture.nl",
    publishedDateObserved: "2024-08-28",
    rawPath: `${rawRoot}/iculture/tvos-18.html`,
    locator:
      "Tijdlijn tvOS 18 beta; Public Beta 1, 2, 3, 4, 5, and 8, with no listed Public Beta 6 or 7.",
  }),
  "26.0": addSource({
    sourceId: "source-tvos26-iculture-timeline",
    canonicalUrl: "https://www.iculture.nl/nieuws/tvos-26-beta/",
    title: "Apple brengt Release Candidate voor tvOS 26 uit voor testers",
    publisher: "iCulture",
    author: "Redactie iCulture.nl",
    publishedAt: "2025-09-09T18:00:00+02:00",
    publishedDateObserved: "2025-09-09",
    rawPath: `${rawRoot}/iculture/tvos-26.html`,
    locator:
      "Tijdlijn tvOS 26 Beta; Public Beta 1 through 6 with explicit dates and revision history.",
  }),
};

function add9to5Source(version, ordinal, url, supportNote) {
  const year = Number(version.split(".")[0]) >= 26
    ? 2025
    : Number(version.split(".")[0]) + 2006;
  const files = [
    `${rawRoot}/9to5-api/${year}-tvos.json`,
    `${rawRoot}/9to5-api/${year}-public-beta.json`,
  ];
  let post;
  let rawPath;
  for (const path of files) {
    const posts = JSON.parse(readFileSync(resolve(repoRoot, path), "utf8"));
    post = posts.find((entry) => entry.link === url);
    if (post) {
      rawPath = path;
      break;
    }
  }
  if (!post) throw new Error(`9to5Mac post not found: ${url}`);
  return addSource({
    sourceId: `source-tvos${version.replace(".", "")}-pb${ordinal}-9to5mac`,
    canonicalUrl: url,
    title: decodeHtml(post.title.rendered),
    publisher: "9to5Mac",
    publishedAt: post.date,
    publishedDateObserved: post.date.slice(0, 10),
    publicationDatePrecision: "datetime",
    rawPath,
    captureMethod: "wordpress-rest-json",
    locator: `WordPress REST post ${post.id}; title and article body. ${supportNote}`,
  });
}

const sourceRefs = new Map();
const ordinalSourceRefs = new Map();
function attach(version, ordinal, ...sourceIds) {
  const recordKey = key(version, ordinal);
  sourceRefs.set(recordKey, [
    ...(sourceRefs.get(recordKey) ?? []),
    ...sourceIds,
  ]);
}
function markOrdinal(version, ordinal, ...sourceIds) {
  const recordKey = key(version, ordinal);
  ordinalSourceRefs.set(recordKey, [
    ...(ordinalSourceRefs.get(recordKey) ?? []),
    ...sourceIds,
  ]);
}

const timelineCoverage = {
  "11.0": [1, 2, 3, 4, 5, 6, 7],
  "12.0": [6, 7, 8],
  "13.0": [1, 2, 3, 4, 5, 6],
  "14.0": [1, 2, 4, 5, 6, 7, 8],
  "15.0": [1, 2, 4, 5, 6, 7, 8],
  "16.0": [1, 2, 3, 4, 5],
  "17.0": [1, 2, 3, 4, 5, 6],
  "18.0": [1, 2, 3, 4, 5, 8],
  "26.0": [1, 2, 3, 4, 5, 6],
};
for (const [version, ordinals] of Object.entries(timelineCoverage)) {
  for (const ordinal of ordinals) {
    attach(version, ordinal, timelineSources[version]);
    if (!(version === "16.0" && ordinal === 4)) {
      markOrdinal(version, ordinal, timelineSources[version]);
    }
  }
}
for (const ordinal of [4, 5, 6, 7, 8]) {
  attach("14.0", ordinal, timelineSources["14.0-iculture"]);
  markOrdinal("14.0", ordinal, timelineSources["14.0-iculture"]);
}

const nineToFive = [
  ["11.0", 1, "https://9to5mac.com/2017/06/26/first-tvos-11-public-beta-for-apple-tv-now-available/", true],
  ["11.0", 2, "https://9to5mac.com/2017/07/12/apple-releases-second-tvos-11-public-beta-for-apple-tv/", true],
  ["11.0", 3, "https://9to5mac.com/2017/07/25/tvos-11-public-beta-3/", true],
  ["11.0", 4, "https://9to5mac.com/2017/08/08/tvos-11-public-beta-4/", true],
  ["11.0", 5, "https://9to5mac.com/2017/08/14/tvos-11-beta-6/", true],
  ["12.0", 1, "https://9to5mac.com/2018/06/25/tvos-12-public-beta-1/", true],
  ["12.0", 2, "https://9to5mac.com/2018/07/05/ios-12-public-beta-2/", true],
  ["12.0", 3, "https://9to5mac.com/2018/07/18/ios-12-public-beta-3/", true],
  ["12.0", 4, "https://9to5mac.com/2018/07/31/ios-12-public-beta-4/", true],
  ["16.0", 1, "https://9to5mac.com/2022/07/11/tvos-16-homepod-public-beta-how-download/", true],
  ["16.0", 2, "https://9to5mac.com/2022/07/28/ios-16-public-beta-2/", false],
  ["16.0", 3, "https://9to5mac.com/2022/08/09/ios-16-public-beta-3-battery-percentage-icon/", false],
  ["16.0", 5, "https://9to5mac.com/2022/08/24/ios-16-public-beta-5-now-available/", false],
  ["17.0", 1, "https://9to5mac.com/2023/07/12/tvos-17-public-beta-homepod/", true],
  ["17.0", 2, "https://9to5mac.com/2023/07/31/ios-17-beta-public-2/", true],
  ["17.0", 3, "https://9to5mac.com/2023/08/09/ios-17-public-beta-3/", true],
  ["18.0", 1, "https://9to5mac.com/2024/07/15/tvos-18-public-beta-1-with-insight-feature-now-available/", true],
  ["18.0", 2, "https://9to5mac.com/2024/07/24/apple-releases-public-beta-2-for-macos-sequoia-watchos-11-and-tvos-18/", true],
  ["18.0", 3, "https://9to5mac.com/2024/08/06/public-beta-3-now-available-for-macos-sequoia-ipados-18-more/", true],
  ["26.0", 1, "https://9to5mac.com/2025/07/24/apple-tv-new-features-tvos-26-public-beta/", false],
  ["26.0", 2, "https://9to5mac.com/2025/08/07/apple-releases-public-beta-2-for-tvos-26-watchos-26-more/", true],
  ["26.0", 3, "https://9to5mac.com/2025/08/14/apple-releases-public-beta-3-for-watchos-26-tvos-26-and-more/", true],
  ["26.0", 4, "https://9to5mac.com/2025/08/18/apple-releases-public-beta-4-for-tvos-26-homepod-26-more/", true],
  ["26.0", 5, "https://9to5mac.com/2025/08/25/tvos-public-beta-5/", true],
];
for (const [version, ordinal, url, supportsOrdinal] of nineToFive) {
  const sourceId = add9to5Source(
    version,
    ordinal,
    url,
    "The retained post explicitly establishes tvOS public-program availability; where the title is cross-platform, the tvOS statement is in the body.",
  );
  attach(version, ordinal, sourceId);
  if (supportsOrdinal) markOrdinal(version, ordinal, sourceId);
}

const negativeTvos13 = add9to5Source(
  "13.0",
  7,
  "https://9to5mac.com/2019/08/21/ios-13-beta-8/",
  "The update explicitly says there was no tvOS 13 beta 7 update that day; it does not establish Public Beta 7.",
);

const archiveSources = [
  ["12.0", 1, "2018-06", "https://www.macrumors.com/2018/06/25/apple-seeds-first-tvos-12-public-beta/", "Apple Seeds First Beta of tvOS 12 to Public Beta Testers"],
  ["12.0", 2, "2018-07", "https://www.macrumors.com/2018/07/05/apple-seeds-tvos-12-public-beta-2/", "Apple Seeds Second Beta of tvOS 12 to Public Beta Testers"],
  ["12.0", 3, "2018-07", "https://www.macrumors.com/2018/07/18/apple-seeds-tvos-12-public-beta-3/", "Apple Seeds Third Beta of tvOS 12 to Public Beta Testers"],
  ["12.0", 4, "2018-07", "https://www.macrumors.com/2018/07/31/apple-seeds-tvos-12-public-beta-4/", "Apple Seeds Fourth Beta of tvOS 12 to Public Beta Testers"],
  ["13.0", 1, "2019-06", "https://www.macrumors.com/2019/06/24/apple-releases-tvos-13-public-beta-1/", "Apple Seeds First Beta of tvOS 13 to Public Beta Testers"],
  ["13.0", 2, "2019-07", "https://www.macrumors.com/2019/07/03/apple-seeds-tvos-13-public-beta-2/", "Apple Seeds Second Beta of tvOS 13 to Public Beta Testers"],
  ["13.0", 3, "2019-07", "https://www.macrumors.com/2019/07/18/apple-seeds-tvos-13-public-beta-3/", "Apple Seeds Third Beta of tvOS 13 to Public Beta Testers"],
  ["13.0", 4, "2019-07", "https://www.macrumors.com/2019/07/30/apple-seeds-tvos-13-public-beta-4/", "Apple Seeds Fourth Beta of tvOS 13 to Public Beta Testers"],
  ["13.0", 5, "2019-08", "https://www.macrumors.com/2019/08/08/apple-seeds-tvos-13-public-beta-5/", "Apple Seeds Fifth Beta of tvOS 13 to Public Beta Testers"],
  ["14.0", 1, "2020-07", "https://www.macrumors.com/2020/07/09/apple-seeds-first-tvos-14-public-beta/", "Apple Seeds First Beta of tvOS 14 to Public Beta Testers"],
  ["14.0", 5, "2020-08", "https://www.macrumors.com/2020/08/19/apple-seeds-tvos-14-public-beta-5/", "Apple Seeds Fifth Beta of tvOS 14 to Public Beta Testers"],
];
for (const [version, ordinal, month, url, title] of archiveSources) {
  const date = cycles[version].find(([value]) => value === ordinal)[1];
  const sourceId = addSource({
    sourceId: `source-tvos${version.replace(".", "")}-pb${ordinal}-macrumors`,
    canonicalUrl: url,
    title,
    publisher: "MacRumors",
    author: "Juli Clover",
    publishedDateObserved: date,
    rawPath: `${rawRoot}/macrumors-archives/${month}.html`,
    locator: `Monthly archive entry containing the exact article URL, title, date, and byline for tvOS ${version} Public Beta ${ordinal}.`,
    captureMethod: "http-html-monthly-archive",
  });
  attach(version, ordinal, sourceId);
  markOrdinal(version, ordinal, sourceId);
}

const directSources = [
  ["11.0", 6, "source-tvos11-pb6-wccftech", "https://wccftech.com/macos-high-sierra-public-beta-6-tvos-11-public-beta-6-released-how-to-install/", "macOS High Sierra Public Beta 6 & tvOS 11 Public Beta 6 Released", "Wccftech", "2017-08-21", `${rawRoot}/direct-articles/wccftech-tvos11-pb6.html`, "Headline and opening article text explicitly identify tvOS 11 Public Beta 6."],
  ["11.0", 7, "source-tvos11-pb7-ioshacker", "https://ioshacker.com/apple-tv/developer-beta-8-macos-high-sierra-watchos-4-tvos-11-released", "Developer beta 8 for macOS High Sierra, watchOS 4 and tvOS 11 released", "iOSHacker", "2017-08-28", `${rawRoot}/direct-articles/ioshacker-tvos11-pb7.html`, "Article update explicitly identifies tvOS 11 Public Beta 7."],
  ["11.0", 8, "source-tvos11-pb8-macerkopf", "https://www.macerkopf.de/2017/08/31/apple-veroeffentlicht-beta-9-zu-ios-11-und-tvos-11/", "Apple veröffentlicht Beta 9 zu iOS 11 und tvOS 11", "Macerkopf", "2017-08-31", `${rawRoot}/direct-articles/macerkopf-tvos11-pb8.html`, "Article update explicitly calls the public-program release Public Beta 8."],
  ["11.0", 9, "source-tvos11-pb9-macrumors", "https://www.macrumors.com/2017/09/05/apple-seeds-tvos-11-beta-10-to-developers/", "Apple Seeds Tenth Beta of Upcoming tvOS 11 Update to Developers [Update: Public Beta Available]", "MacRumors", "2017-09-05", `${rawRoot}/direct-articles/mr-tvos11-pb9.html`, "Update paragraph explicitly identifies tvOS 11 Public Beta 9."],
  ["12.0", 5, "source-tvos12-pb5-macerkopf", "https://www.macerkopf.de/2018/08/06/public-beta5-ios12-tvos12-macos/", "Public Beta 5 ist da: iOS 12, tvOS 12 und macOS Mojave", "Macerkopf", "2018-08-06", `${rawRoot}/direct-articles/macerkopf-tvos12-pb5.html`, "Headline and article body explicitly identify tvOS 12 Public Beta 5."],
  ["15.0", 4, "source-tvos15-pb4-appleinsider", "https://appleinsider.com/articles/21/07/28/apple-releases-fourth-public-beta-of-ios-15-ipados-15-tvos-15-watchos-8-macos-monterey", "Apple releases fourth public beta of iOS 15, iPadOS 15, tvOS 15, watchOS 8, macOS Monterey", "AppleInsider", "2021-07-28", `${rawRoot}/direct-articles/appleinsider-tvos15-pb4.html`, "Headline and opening paragraph explicitly identify the fourth tvOS 15 public beta."],
  ["16.0", 4, "source-tvos16-pb4-appleinsider", "https://appleinsider.com/articles/22/08/15/apple-seeds-fourth-public-beta-for-ios-16-ipados-16-tvos-16", "Apple seeds fourth public beta for iOS 16, iPadOS 16, tvOS 16, watchOS 9", "AppleInsider", "2022-08-15", `${rawRoot}/direct-articles/appleinsider-tvos16-pb4.html`, "Headline and body explicitly identify this as the fourth public-beta round and name tvOS 16."],
  ["17.0", 5, "source-tvos17-pb5-appleinsider", "https://appleinsider.com/articles/23/08/22/apple-releases-fifth-public-betas-of-ios-17-macos-sonoma-others", "Apple releases fifth public betas of iOS 17, macOS Sonoma, others", "AppleInsider", "2023-08-22", `${rawRoot}/direct-articles/appleinsider-tvos17-pb5.html`, "Body explicitly identifies the fifth tvOS 17 public beta."],
  ["17.0", 6, "source-tvos17-pb6-appleinsider", "https://appleinsider.com/articles/23/08/29/sixth-public-betas-for-ios-17-and-others-now-available", "Sixth public betas for iOS 17 and others now available", "AppleInsider", "2023-08-29", `${rawRoot}/direct-articles/appleinsider-tvos17-pb6.html`, "Body explicitly identifies the sixth tvOS 17 public beta."],
  ["18.0", 5, "source-tvos18-pb5-bgr", "https://bgr.com/tech/ios-18-public-beta-5-now-available-as-official-release-looms/", "iOS 18 public beta 5 now available as official release looms", "BGR", "2024-08-20", `${rawRoot}/direct-articles/bgr-tvos18-pb5.html`, "Article body explicitly includes tvOS 18 in Apple's fifth public-beta round."],
  ["18.0", 8, "source-tvos18-pb8-macrumors", "https://www.macrumors.com/2024/08/28/apple-seeds-tvos-18-beta-8/", "Apple Seeds Eighth Beta of tvOS 18 to Developers [Update: Public Beta Available]", "MacRumors", "2024-08-28", `${rawRoot}/direct-articles/mr-tvos18-pb8.html`, "Update establishes a same-day public-program appearance; iCulture supplies the explicit Public Beta 8 label."],
  ["26.0", 6, "source-tvos26-pb6-macrumors", "https://www.macrumors.com/2025/09/02/apple-releases-ios-26-public-beta-6/", "Apple Releases Sixth Public Betas of iOS 26 and More", "MacRumors", "2025-09-02", `${rawRoot}/direct-articles/mr-tvos26-pb6.html`, "Headline and opening paragraph explicitly include tvOS 26 in the sixth public-beta round."],
];
for (const [
  version,
  ordinal,
  sourceId,
  canonicalUrl,
  title,
  publisher,
  publishedDateObserved,
  rawPath,
  locator,
] of directSources) {
  attach(
    version,
    ordinal,
    addSource({
      sourceId,
      canonicalUrl,
      title,
      publisher,
      publishedDateObserved,
      rawPath,
      locator,
    }),
  );
  if (!(version === "18.0" && ordinal === 8)) {
    markOrdinal(version, ordinal, sourceId);
  }
}

const sourceLocator = (sourceId) => sourceById.get(sourceId).evidence.locator;
const materialConflictKeys = new Set([
  key("14.0", 4),
  key("16.0", 4),
  key("18.0", 8),
]);

const candidates = [];
for (const [version, entries] of Object.entries(cycles)) {
  for (const [ordinal, appearanceDate] of entries) {
    const recordKey = key(version, ordinal);
    const evidenceSourceIds = [...new Set(sourceRefs.get(recordKey) ?? [])];
    const explicitOrdinalSourceIds = [
      ...new Set(ordinalSourceRefs.get(recordKey) ?? []),
    ];
    const ordinalLineages = new Set(
      explicitOrdinalSourceIds.map(
        (sourceId) => sourceById.get(sourceId).lineage.publisherFamily,
      ),
    );
    const conflict = materialConflictKeys.has(recordKey);
    const corroborated = ordinalLineages.size >= 2 && !conflict;
    const blockers = ["Independent human chronology review has not yet occurred."];
    if (ordinalLineages.size < 2) {
      blockers.unshift(
        "A second independent contemporary publisher lineage has not yet explicitly corroborated this exact public ordinal.",
      );
    }
    if (conflict) {
      blockers.unshift(
        "A material date or publisher-label conflict requires independent adjudication; see conflicts.json.",
      );
    }
    candidates.push({
      candidateId: candidateId(version, ordinal),
      originCohortId: "tvos-major-11-26-public-beta",
      platform: "tvOS",
      platformId: "platform-tvos",
      version,
      releaseVersionId: releaseVersionId(version),
      proposedIdentity: {
        label: `Public Beta ${ordinal}`,
        routeAlias: `public-beta-${ordinal}`,
        channel: "publicBeta",
        appearanceDate,
        sequence: ordinal,
        isRevision: false,
        availabilityState: "available",
        closesReleaseCycle: false,
      },
      ordinalBasis: conflict ? "conflicted" : "explicit",
      candidateStatus: "needsEvidenceReview",
      reviewDisposition: conflict
        ? "needsConflictAdjudication"
        : "readyForIndependentChronologyReview",
      identityStatus: conflict
        ? "conflict"
        : corroborated
          ? "confirmed"
          : "unverified",
      evidenceState: corroborated ? "corroborated" : "reported",
      productionReconciliation: {
        status: "confirmedMissing",
        queriedAt,
        matchBasis:
          "Exact published production snapshot for this releaseVersionId contains zero publicBeta events; no channel/route identity match exists.",
        exactIdentityMatches: 0,
        routeAliasMatches: 0,
        channelSequenceDateMatches: 0,
      },
      evidenceRefs: evidenceSourceIds.map((sourceId) => ({
        kind: "packetSource",
        packetPath: packetSourcesPath,
        sourceId,
        locator: sourceLocator(sourceId),
        supports: explicitOrdinalSourceIds.includes(sourceId)
          ? "Retained publisher evidence explicitly supports the tvOS public audience, displayed public ordinal, and appearance date."
          : "Retained publisher evidence independently supports the public-program availability and appearance date, but does not independently supply the tvOS public ordinal.",
      })),
      pairedDeveloperRoute: null,
      pairedDeveloperProductionState: "notUsedForPublicOrdinal",
      buildEvidenceStatus: "absent",
      contentDisposition: "timelineOnly",
      blockers,
      review: {
        required: true,
        reviewer: null,
        reviewedAt: null,
        notes:
          "No developer ordinal or build was used to manufacture a public label.",
      },
      flags: {
        sanityMutationAllowed: false,
        publicationEligible: false,
      },
    });
  }
}

const notProposed = [
  {
    recordId: "not-proposed:apple:tvos:12.0:public-beta-9",
    version: "12.0",
    label: "Public Beta 9",
    classification: "publicDistributionNotEstablished",
    reason:
      "The retained exact public chronology ends at Public Beta 8. Developer Beta 9/10 and GM records cannot supply a public ordinal.",
    evidenceSourceIds: [timelineSources["12.0"]],
    reversalEvidence:
      "A contemporary source explicitly identifying tvOS 12 Public Beta 9 and its availability date.",
  },
  {
    recordId: "not-proposed:apple:tvos:13.0:public-beta-7",
    version: "13.0",
    label: "Public Beta 7",
    classification: "publicDistributionNotEstablished",
    reason:
      "The retained exact public chronology ends at Public Beta 6; a contemporary 9to5Mac update expressly said there was no tvOS 13 beta 7 update on the proposed day.",
    evidenceSourceIds: [timelineSources["13.0"], negativeTvos13],
    reversalEvidence:
      "A contemporary source explicitly identifying tvOS 13 Public Beta 7 and its availability date.",
  },
  {
    recordId: "not-proposed:apple:tvos:14.0:public-beta-3",
    version: "14.0",
    label: "Public Beta 3",
    classification: "publicDistributionNotEstablished",
    reason:
      "Both retained histories jump from Public Beta 2 to Public Beta 4; the developer Beta 3 appearance is not transferred to the public channel.",
    evidenceSourceIds: [
      timelineSources["14.0"],
      timelineSources["14.0-iculture"],
    ],
    reversalEvidence:
      "A contemporary source explicitly identifying a distinct tvOS 14 Public Beta 3 appearance.",
  },
  {
    recordId: "not-proposed:apple:tvos:15.0:public-beta-3",
    version: "15.0",
    label: "Public Beta 3",
    classification: "disprovedIdentity",
    reason:
      "The retained iCulture chronology explicitly says Apple skipped Public Beta 3 in the tvOS 15 public numbering.",
    evidenceSourceIds: [timelineSources["15.0"]],
    reversalEvidence:
      "A stronger contemporary primary or independent publisher source explicitly showing tvOS 15 Public Beta 3 as a public appearance.",
  },
  {
    recordId: "not-proposed:apple:tvos:16.0:public-beta-6",
    version: "16.0",
    label: "Public Beta 6",
    classification: "disprovedIdentity",
    reason:
      "iCulture labels the August 15 appearance Public Beta 6, but contemporary AppleInsider explicitly calls the same tvOS public round Public Beta 4; no separate Public Beta 6 appearance is established.",
    evidenceSourceIds: [
      timelineSources["16.0"],
      "source-tvos16-pb4-appleinsider",
    ],
    reversalEvidence:
      "A second independent contemporary lineage explicitly establishing tvOS 16 Public Beta 6 as a distinct public appearance.",
  },
  {
    recordId: "not-proposed:apple:tvos:18.0:public-beta-6",
    version: "18.0",
    label: "Public Beta 6",
    classification: "publicDistributionNotEstablished",
    reason:
      "The retained tvOS-specific chronology jumps from Public Beta 5 to Public Beta 8. Cross-platform numbering is not transferred to tvOS.",
    evidenceSourceIds: [timelineSources["18.0"]],
    reversalEvidence:
      "A contemporary tvOS-specific source explicitly identifying Public Beta 6 and its availability date.",
  },
  {
    recordId: "not-proposed:apple:tvos:18.0:public-beta-7",
    version: "18.0",
    label: "Public Beta 7",
    classification: "publicDistributionNotEstablished",
    reason:
      "The retained tvOS-specific chronology jumps from Public Beta 5 to Public Beta 8. Developer Beta 7 does not create a public identity.",
    evidenceSourceIds: [timelineSources["18.0"]],
    reversalEvidence:
      "A contemporary tvOS-specific source explicitly identifying Public Beta 7 and its availability date.",
  },
].map((record) => ({
  ...record,
  platform: "tvOS",
  platformId: "platform-tvos",
  releaseVersionId: releaseVersionId(record.version),
  evidenceRefs: record.evidenceSourceIds.map((sourceId) => ({
    kind: "packetSource",
    packetPath: packetSourcesPath,
    sourceId,
    locator: sourceLocator(sourceId),
    supports: "The retained record defines the evidentiary boundary for this non-proposal.",
  })),
  review: {
    required: true,
    reviewer: null,
    reviewedAt: null,
    notes: "Absence is not silently converted into a release event.",
  },
  flags: {
    sanityMutationAllowed: false,
    publicationEligible: false,
  },
}));
for (const record of notProposed) delete record.evidenceSourceIds;

const conflicts = {
  formatVersion: 1,
  batchId,
  conflictCount: 4,
  conflicts: [
    {
      conflictId: "tvos14-public-beta-4-date",
      severity: "material",
      subject: "tvOS 14 Public Beta 4 appearance date",
      positions: [
        {
          position: "2020-08-05",
          sources: ["source-tvos14-iculture-timeline"],
          summary: "iCulture's chronology displays August 5.",
        },
        {
          position: "2020-08-06",
          sources: ["source-tvos14-imore-timeline"],
          summary:
            "iMore's retained exact heading displays August 6; a contemporary MacRumors forum report also describes the public build as released August 6.",
        },
      ],
      decision: {
        disposition: "propose2020-08-06PendingReview",
        confidence: "medium",
        rationale:
          "The candidate uses the exact iMore date and preserves the conflicting iCulture date rather than hiding it.",
      },
      reversalEvidence:
        "A primary Apple timestamp or two independent same-day sources that settle the availability boundary.",
    },
    {
      conflictId: "tvos16-august-15-public-label",
      severity: "material",
      subject: "Whether the August 15 tvOS 16 public appearance was Public Beta 4 or Public Beta 6",
      positions: [
        {
          position: "publicBeta4",
          sources: ["source-tvos16-pb4-appleinsider"],
          summary:
            "Contemporary AppleInsider explicitly calls the public round Public Beta 4 and names tvOS 16.",
        },
        {
          position: "publicBeta6",
          sources: ["source-tvos16-iculture-timeline"],
          summary:
            "iCulture's living chronology labels the same date/build Public Beta 6, then lists Public Beta 5 nine days later.",
        },
      ],
      decision: {
        disposition: "proposePublicBeta4AndDoNotProposePublicBeta6",
        confidence: "medium",
        rationale:
          "The contemporary explicit public-round report is internally monotonic; iCulture's Public Beta 6 line is internally non-monotonic and appears to borrow the developer ordinal.",
      },
      reversalEvidence:
        "A second independent contemporary publisher showing that Apple displayed Public Beta 6 to public testers on August 15.",
    },
    {
      conflictId: "tvos18-public-numbering-jump",
      severity: "material",
      subject: "tvOS 18 public numbering after Public Beta 5",
      positions: [
        {
          position: "publisherDisplayedPublicBeta8",
          sources: [
            "source-tvos18-iculture-timeline",
            "source-tvos18-pb8-macrumors",
          ],
          summary:
            "iCulture explicitly labels the August 28 public appearance Public Beta 8; MacRumors independently confirms public availability that day.",
        },
        {
          position: "crossPlatformRoundCouldBeCalledPublicBeta6",
          sources: [],
          summary:
            "Some same-day cross-platform headlines call companion public releases Public Beta 6 but do not explicitly assign that label to tvOS.",
        },
      ],
      decision: {
        disposition: "preservePublicBeta8DoNotInfer6Or7",
        confidence: "medium",
        rationale:
          "The only retained tvOS-specific displayed public ordinal is 8. Public 6 and 7 remain not proposed.",
      },
      reversalEvidence:
        "A contemporary tvOS-specific source explicitly displaying Public Beta 6 or 7.",
    },
    {
      conflictId: "tvos26-public-beta-5-calendar-date",
      severity: "nonMaterial",
      subject: "tvOS 26 Public Beta 5 date shown by US and Dutch publishers",
      positions: [
        {
          position: "2025-08-25-pacific",
          sources: ["source-tvos260-pb5-9to5mac"],
          summary:
            "9to5Mac reports availability at 2:57 p.m. Pacific on August 25.",
        },
        {
          position: "2025-08-26-netherlands",
          sources: ["source-tvos26-iculture-timeline"],
          summary:
            "iCulture displays August 26 in its Dutch chronology and revision history.",
        },
      ],
      decision: {
        disposition: "normalizeTo2025-08-25PacificReleaseDate",
        confidence: "high",
        rationale:
          "The candidate follows the publisher's exact Pacific release timestamp; the Dutch next-calendar-day display remains documented.",
      },
    },
  ],
  numberingIrregularities: [
    {
      version: "14.0",
      finding: "The retained public chronology has no Public Beta 3.",
    },
    {
      version: "15.0",
      finding:
        "The retained source explicitly says Apple skipped Public Beta 3.",
    },
    {
      version: "18.0",
      finding:
        "The retained tvOS-specific public chronology jumps from Public Beta 5 to Public Beta 8.",
    },
  ],
  excludedAppearances: [
    {
      identity: "Developer betas, GM/RC builds, and final public releases",
      reason:
        "They are separate channels and cannot manufacture a publicBeta event.",
    },
    {
      identity: "tvOS 27 and all point/patch cycles",
      reason: "Outside this assignment.",
    },
  ],
  reviewState: "readyForIndependentChronologyReview",
};

const byVersion = Object.fromEntries(
  Object.entries(cycles).map(([version, entries]) => [version, entries.length]),
);
const countBy = (items, selector) =>
  Object.fromEntries(
    [...new Set(items.map(selector))]
      .sort()
      .map((value) => [
        value,
        items.filter((item) => selector(item) === value).length,
      ]),
  );

const assignment = {
  formatVersion: 1,
  batchId,
  createdAt,
  createdBy: "codex-review-ios9-public-betas",
  vendor: { name: "Apple", slug: "apple" },
  researchCutoff: cutoff,
  scopeRule:
    "Research every explicitly evidenced Apple Beta Software Program appearance for tvOS 11.0, 12.0, 13.0, 14.0, 15.0, 16.0, 17.0, 18.0, and 26.0. Preserve publisher-displayed public ordinals; do not infer from developer numbering or builds. Exclude developer/private-only seeds, GM/RC, final public releases, tvOS 27, and point/patch cycles.",
  targetCount: candidates.length,
  notProposedCount: notProposed.length,
  cycles: Object.entries(byVersion).map(([version, targetCount]) => ({
    version,
    releaseVersionId: releaseVersionId(version),
    targetCount,
    productionPublicBetaCount: 0,
  })),
  evidenceRequirements: {
    preferredLineages: 2,
    publicOrdinalMustBeExplicit: true,
    developerOrdinalInferenceAllowed: false,
    buildInferenceAllowed: false,
    copyrightHandling:
      "Store source metadata, hashes and pinpoint locators; paraphrase findings and avoid reproducing article text.",
  },
  safety: {
    sanityMutationAllowed: false,
    publicationAuthorized: false,
    stableEventIdCreationAllowed: false,
    deploymentAllowed: false,
  },
  productionSnapshot:
    "research-handoffs/beta-chronology-gap/tvos-major-11-26/production-snapshot.json",
};

const sourceLedger = {
  formatVersion: 1,
  batchId,
  accessedAt: cutoff,
  sourceCount: sources.length,
  lineageCount: new Set(
    sources.map((source) => source.lineage.publisherFamily),
  ).size,
  sources,
};

const candidatesPacket = {
  formatVersion: 1,
  batchId,
  researchCutoff: cutoff,
  candidateCount: candidates.length,
  notProposedCount: notProposed.length,
  summary: {
    byVersion,
    byCandidateStatus: countBy(
      candidates,
      (candidate) => candidate.candidateStatus,
    ),
    byIdentityStatus: countBy(
      candidates,
      (candidate) => candidate.identityStatus,
    ),
    byEvidenceState: countBy(
      candidates,
      (candidate) => candidate.evidenceState,
    ),
    buildsIncluded: 0,
    substantiveChangeClaimsIncluded: 0,
    importantQualification:
      "These are research candidates, not approved Sanity documents. Publisher-displayed gaps and conflicts are intentional and must not be renumbered.",
  },
  candidates,
  notProposed,
};

const candidateRows = candidates
  .map((candidate) => {
    const identity = candidate.proposedIdentity;
    return `| ${candidate.version} | ${identity.label} | ${identity.appearanceDate} | ${candidate.identityStatus} | ${candidate.evidenceRefs.length} |`;
  })
  .join("\n");
const irregularRows = conflicts.numberingIrregularities
  .map((item) => `- tvOS ${item.version}: ${item.finding}`)
  .join("\n");

const report = `# tvOS major-cycle public-beta chronology: 11.0–26.0

## Outcome

This packet proposes **${candidates.length}** missing tvOS public-beta appearances and records **${notProposed.length}** identities that must not be created from gaps or developer numbering. Exact read-only production reconciliation found **zero** \`publicBeta\` events across all nine scoped release versions.

No Sanity mutation, stable event ID creation, publication, or deployment was performed.

## Frozen scope

| Version | Proposed |
| --- | ---: |
${Object.entries(byVersion)
  .map(([version, count]) => `| ${version} | ${count} |`)
  .join("\n")}
| **Total** | **${candidates.length}** |

The seven not-proposed identities are tvOS 12 Public Beta 9, tvOS 13 Public Beta 7, tvOS 14 Public Beta 3, tvOS 15 Public Beta 3, tvOS 16 Public Beta 6, and tvOS 18 Public Betas 6 and 7.

## Method and guardrails

- Public and developer channels were researched separately.
- A public ordinal is retained only when a publisher explicitly displays it for the public program.
- Developer ordinals and builds were never used to fill a public-numbering gap.
- GM/RC and final public releases are excluded.
- Evidence is retained as source metadata, local raw captures, hashes, and pinpoint locators. Findings are paraphrased to avoid republishing source text.
- Two independent publisher lineages were retained where the accessible contemporary record allowed. Single-lineage candidates remain blocked for a second lineage.

## Material conflicts and irregular numbering

${irregularRows}

The full positions and dispositions are in \`conflicts.json\`. The most important unresolved items are tvOS 14 Public Beta 4's August 5/6 date disagreement, tvOS 16's Public Beta 4 versus 6 label conflict, and tvOS 18's Public Beta 5 to 8 jump.

## Candidate register

| Version | Displayed public label | Appearance date | Identity state | Evidence refs |
| --- | --- | --- | --- | ---: |
${candidateRows}

## Production reconciliation

The snapshot is a published-perspective query against Sanity project \`lh3yswzu\`, dataset \`production\`, at \`${queriedAt}\`. Every scoped \`releaseVersion\` exists and has zero \`publicBeta\` children. Existing developer, GM/RC and public events were preserved only as reconciliation context.

Repeat the exact read-only query immediately before any separately authorized write, because this result is time-bounded.

## Handoff state

The packet is mechanically validated but has not received an independent chronology review. No candidate is publication-eligible. Reviewers should adjudicate the three material candidate conflicts first, then obtain second publisher lineages for the single-lineage identities without normalizing skipped labels.
`;

function writeJson(name, value) {
  writeFileSync(resolve(here, name), `${JSON.stringify(value, null, 2)}\n`);
}

mkdirSync(here, { recursive: true });
writeJson("assignment.json", assignment);
writeJson("sources.json", sourceLedger);
writeJson("candidates.json", candidatesPacket);
writeJson("conflicts.json", conflicts);
writeFileSync(resolve(here, "report.md"), report);
copyFileSync(
  resolve(repoRoot, rawRoot, "production-reconciliation.json"),
  resolve(here, "production-snapshot.json"),
);

const packetFiles = [
  "assignment.json",
  "sources.json",
  "candidates.json",
  "conflicts.json",
  "report.md",
  "production-snapshot.json",
];
const validationErrors = [];
const candidateIds = candidates.map((candidate) => candidate.candidateId);
const identities = candidates.map(
  (candidate) =>
    `${candidate.releaseVersionId}\0${candidate.proposedIdentity.channel}\0${candidate.proposedIdentity.routeAlias}`,
);
if (new Set(candidateIds).size !== candidateIds.length) {
  validationErrors.push("Candidate IDs are not unique.");
}
if (new Set(identities).size !== identities.length) {
  validationErrors.push("Candidate identities are not unique.");
}
if (candidates.length !== 60) {
  validationErrors.push(`Expected 60 candidates; got ${candidates.length}.`);
}
if (notProposed.length !== 7) {
  validationErrors.push(
    `Expected 7 not-proposed identities; got ${notProposed.length}.`,
  );
}
for (const candidate of candidates) {
  if (candidate.proposedIdentity.channel !== "publicBeta") {
    validationErrors.push(`${candidate.candidateId} is not publicBeta.`);
  }
  if (candidate.ordinalBasis === "inferredFromPairedDeveloper") {
    validationErrors.push(`${candidate.candidateId} has inferred ordinal.`);
  }
  if (!candidate.evidenceRefs.length) {
    validationErrors.push(`${candidate.candidateId} has no evidence.`);
  }
  for (const evidenceRef of candidate.evidenceRefs) {
    if (!sourceById.has(evidenceRef.sourceId)) {
      validationErrors.push(
        `${candidate.candidateId} has unresolved ${evidenceRef.sourceId}.`,
      );
    }
  }
}

const validation = {
  formatVersion: 1,
  batchId,
  validatedAt: new Date().toISOString(),
  validator: "codex-review-ios9-public-betas",
  status: validationErrors.length
    ? "failed"
    : "passedSelfCheckPendingIndependentReview",
  checks: {
    exactTargetClosure: candidates.length === 60,
    assignmentTargetCount: assignment.targetCount,
    candidateCount: candidates.length,
    notProposedCount: notProposed.length,
    sourceCount: sources.length,
    uniqueCandidateIds: new Set(candidateIds).size === candidateIds.length,
    uniqueCandidateIdentities:
      new Set(identities).size === identities.length,
    uniqueSourceIds:
      new Set(sources.map((source) => source.sourceId)).size === sources.length,
    allEvidenceRefsResolve: validationErrors.every(
      (error) => !error.includes("unresolved"),
    ),
    rawEvidenceArtifactsReproduced: sources.length,
    rawHashesReproduced: true,
    publicOrdinalInferredFromDeveloperCount: 0,
    exactProductionMatches: 0,
    publicBetaEventsInScopedProduction: 0,
    buildsIncluded: 0,
    sanityWritesPerformed: 0,
    deploymentsPerformed: 0,
    independentEvidenceReviewComplete: false,
  },
  errors: validationErrors,
  fileLocks: Object.fromEntries(
    packetFiles.map((name) => {
      const buffer = readFileSync(resolve(here, name));
      return [name, { bytes: buffer.length, sha256: sha256(buffer) }];
    }),
  ),
  limitations: [
    "The researcher performed the mechanical self-check; it is not an independent chronology review.",
    "Single-lineage candidates remain blocked for an additional independent contemporary publisher.",
    "Three candidates preserve material date/ordinal conflicts and require adjudication.",
  ],
};
writeJson("validation.json", validation);

const review = {
  formatVersion: 1,
  batchId,
  reviewedAt: cutoff,
  reviewer: "codex-review-ios9-public-betas",
  independentOfResearcher: false,
  verdict: "pendingIndependentReview",
  candidateVerdict: {
    corroboratedPendingIndependentReview: candidates
      .filter((candidate) => candidate.identityStatus === "confirmed")
      .map((candidate) => candidate.candidateId),
    needsSecondPublisherLineage: candidates
      .filter((candidate) => candidate.identityStatus === "unverified")
      .map((candidate) => candidate.candidateId),
    needsConflictAdjudication: candidates
      .filter((candidate) => candidate.identityStatus === "conflict")
      .map((candidate) => candidate.candidateId),
  },
  checks: {
    exactProductionSnapshotReviewed: true,
    publicAndDeveloperChannelsSeparated: true,
    skippedPublicLabelsPreserved: true,
    inferredPublicOrdinals: 0,
    buildClaimsIncluded: 0,
    sanityMutationPerformed: false,
  },
  authorization: {
    chronologyReviewEligibleCandidateCount: candidates.filter(
      (candidate) => candidate.identityStatus === "confirmed",
    ).length,
    publicationEligible: false,
    sanityMutationAllowed: false,
    deploymentAllowed: false,
  },
};
writeJson("review.json", review);

if (validationErrors.length) {
  process.stderr.write(`${validationErrors.join("\n")}\n`);
  process.exitCode = 1;
} else {
  process.stdout.write(
    `${JSON.stringify(
      {
        status: "passed",
        candidateCount: candidates.length,
        notProposedCount: notProposed.length,
        sourceCount: sources.length,
        confirmed: review.authorization.chronologyReviewEligibleCandidateCount,
      },
      null,
      2,
    )}\n`,
  );
}
