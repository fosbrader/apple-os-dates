import {createHash} from "node:crypto";
import {readFile, stat, writeFile} from "node:fs/promises";
import path from "node:path";

const batchDir = "research-handoffs/beta-chronology-gap/macos-2014-2019";
const evidenceDir =
  "tmp/research-evidence/beta-chronology-gap/macos-2014-2019/sources";
const accessedAt = "2026-07-30";
const productionQueriedAt = "2026-07-31T02:59:06.504Z";
const generatedAt = new Date().toISOString();

const sha256 = (value) =>
  createHash("sha256").update(value).digest("hex");

const decodeHtml = (value) =>
  value
    .replaceAll("\\/", "/")
    .replaceAll("&amp;", "&")
    .replaceAll("&#8217;", "’")
    .replaceAll("&#039;", "'")
    .replaceAll("&quot;", '"')
    .replaceAll("&#8211;", "–")
    .replaceAll(/<[^>]+>/g, " ")
    .replaceAll(/\s+/g, " ")
    .trim();

const firstMatch = (text, patterns) => {
  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match?.[1]) return decodeHtml(match[1]);
  }
  return null;
};

const publisherFamilyFor = (publisher) => publisher;

async function fileSource({
  sourceId,
  relativePath,
  publisher,
  canonicalUrl = null,
  title = null,
  author = null,
  publishedAt = null,
  sourceClass = "contemporaneousSecondary",
  roles = [
    "publicAvailability",
    "publicOrdinal",
    "appearanceDate",
    "channelIdentity",
  ],
  locator = "Page metadata and the candidate-specific article paragraph or chronology section.",
  lineageNotes = "Direct contemporary publisher page retained locally.",
  independentForCorroboration = true,
}) {
  const rawPath = path.posix.join(evidenceDir, relativePath);
  const bytes = await readFile(rawPath);
  const html = bytes.toString("utf8");
  const parsedCanonical = firstMatch(html, [
    /<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']+)["']/i,
    /<link[^>]+href=["']([^"']+)["'][^>]+rel=["']canonical["']/i,
  ]);
  const parsedTitle = firstMatch(html, [
    /"headline"\s*:\s*"([^"]+)"/i,
    /<meta[^>]+property=["']og:title["'][^>]+content=["']([^"']+)["']/i,
    /<title[^>]*>([^<]+)<\/title>/i,
  ]);
  const parsedPublishedAt = firstMatch(html, [
    /"datePublished"\s*:\s*"([^"]+)"/i,
    /property=["']article:published_time["'][^>]+content=["']([^"']+)["']/i,
  ]);
  const parsedAuthor = firstMatch(html, [
    /"author"\s*:\s*\{[^{}]{0,500}?"name"\s*:\s*"([^"]+)"/i,
    /"author"\s*:\s*"([^"]+)"/i,
  ]);

  return {
    sourceId,
    canonicalUrl: canonicalUrl ?? parsedCanonical,
    title: title ?? parsedTitle ?? relativePath,
    publisher,
    author: author ?? parsedAuthor,
    publishedAt: publishedAt ?? parsedPublishedAt,
    publishedDateObserved:
      (publishedAt ?? parsedPublishedAt)?.slice(0, 10) ?? null,
    publicationDatePrecision: !(publishedAt ?? parsedPublishedAt)
      ? "unknown"
      : (publishedAt ?? parsedPublishedAt).length > 10
        ? "datetime"
        : "date",
    accessedAt,
    archiveUrl: null,
    status: "active",
    sourceClass,
    roles,
    evidence: {
      rawPath,
      rawBytes: bytes.byteLength,
      rawSha256: sha256(bytes),
      captureMethod: "http-html",
      locator,
    },
    lineage: {
      publisherFamily: publisherFamilyFor(publisher),
      independentForCorroboration,
      notes: lineageNotes,
    },
  };
}

const webOnlySource = ({
  sourceId,
  canonicalUrl,
  title,
  publisher,
  author = null,
  publishedAt,
  sourceClass = "contemporaneousSecondary",
  roles = [
    "publicAvailability",
    "publicOrdinal",
    "appearanceDate",
    "channelIdentity",
  ],
  locator,
  captureMethod =
    "browser/search-rendered text; direct HTTP capture was unavailable",
  lineageNotes = "Contemporary page reviewed through rendered search text.",
  independentForCorroboration = true,
}) => ({
  sourceId,
  canonicalUrl,
  title,
  publisher,
  author,
  publishedAt,
  publishedDateObserved: publishedAt?.slice(0, 10) ?? null,
  publicationDatePrecision: !publishedAt
    ? "unknown"
    : publishedAt.length > 10
      ? "datetime"
      : "date",
  accessedAt,
  archiveUrl: null,
  status: "active",
  sourceClass,
  roles,
  evidence: {
    rawPath: null,
    rawBytes: null,
    rawSha256: null,
    captureMethod,
    locator,
  },
  lineage: {
    publisherFamily: publisherFamilyFor(publisher),
    independentForCorroboration,
    notes: lineageNotes,
  },
});

const mrPath = (name) => `macrumors/${name}.html`;
const sourceIdForCandidate = (version, sequence) =>
  `source-mr-macos-${version.replaceAll(".", "-")}-pb${sequence}`;

const candidateSpecs = [
  {
    version: "10.10",
    dates: [
      "2014-07-24",
      "2014-08-21",
      "2014-09-15",
      "2014-09-30",
      "2014-10-07",
      "2014-10-13",
    ],
    mr: [
      "os-x-yosemite-public-beta-available",
      "second-yosemite-public-beta",
      "apple-releases-third-os-x-yosemite-public-beta",
      "os-x-yosemite-developer-preview-9",
      "apple-second-yosemite-golden-master",
      "apple-releases-sixth-os-x-yosemite-public-beta",
    ],
    secondary: [
      "source-osxd-yosemite-pb1",
      "source-osxd-yosemite-pb2",
      "source-osxd-yosemite-pb3",
      "source-osxd-yosemite-pb4",
      "source-osxd-yosemite-pb5",
      "source-osxd-yosemite-pb6",
    ],
  },
  {
    version: "10.11",
    dates: [
      "2015-07-09",
      "2015-07-22",
      "2015-07-29",
      "2015-08-04",
      "2015-08-18",
    ],
    mr: [
      "ios-9-os-x-el-capitan-public-betas",
      "apple-second-ios-9-public-beta",
      "apple-releases-third-os-x-el-capitan-public-beta",
      "apple-fourth-el-capitan-public-beta",
      "apple-fifth-el-capitan-beta-public-testers",
    ],
    secondary: [
      "source-osxd-elcap-pb1",
      "source-osxd-elcap-pb2",
      "source-osxd-elcap-pb3",
      "source-osxd-elcap-pb4",
      "source-osxd-elcap-pb5",
    ],
  },
  {
    version: "10.12",
    dates: [
      "2016-07-07",
      "2016-07-20",
      "2016-08-02",
      "2016-08-09",
      "2016-08-15",
      "2016-08-22",
      "2016-08-29",
    ],
    mr: [
      "macos-sierra-public-beta",
      "apple-releases-macos-sierra-public-beta-2",
      "apple-releases-macos-sierra-public-beta-3",
      "apple-seeds-macos-sierra-beta-5-to-developers",
      "apple-seeds-macos-sierra-beta-6-to-developers",
      "apple-seeds-macos-sierra-beta-7-to-developers",
      "macos-sierra-beta-8",
    ],
    secondary: [
      "source-osxd-sierra-pb1",
      "source-idb-sierra-pb2",
      "source-idb-sierra-pb3",
      "source-macmag-sierra-pb4",
      "source-macworld-sierra-pb5",
      "source-macworld-sierra-pb6",
      "source-osxd-sierra-pb7",
    ],
  },
  {
    version: "10.13",
    dates: [
      "2017-06-29",
      "2017-07-12",
      "2017-07-25",
      "2017-08-08",
      "2017-08-14",
      "2017-08-21",
      "2017-08-28",
      "2017-09-01",
    ],
    mr: [
      "apple-seeds-first-public-beta-of-macos-high-sierra",
      "apple-seeds-macos-high-sierra-public-beta-2",
      "apple-seeds-macos-high-sierra-public-beta-3",
      "apple-seeds-macos-high-sierra-to-public-beta-4",
      "apple-macos-high-sierra-beta-6-to-developers",
      "apple-seeds-macos-high-sierra-beta-7",
      "apple-seeds-macos-high-sierra-beta-8-to-developers",
      null,
    ],
    secondary: [
      "source-iculture-high-sierra",
      "source-iculture-high-sierra",
      "source-iculture-high-sierra",
      "source-iculture-high-sierra",
      "source-iculture-high-sierra",
      "source-iculture-high-sierra",
      "source-iculture-high-sierra",
      "source-whirlpool-high-sierra-pb8",
    ],
    extraSources: {
      8: ["source-mrforum-high-sierra-pb8"],
    },
    reportedSequences: [8],
  },
  {
    version: "10.14",
    dates: [
      "2018-06-26",
      "2018-07-06",
      "2018-07-17",
      "2018-07-31",
      "2018-08-06",
      "2018-08-13",
      "2018-08-20",
      "2018-08-27",
      "2018-09-05",
      "2018-09-12",
    ],
    mr: [
      "macos-mojave-first-public-beta",
      "apple-seeds-macos-mojave-public-beta-2",
      "apple-seeds-macos-mojave-public-beta-3",
      "apple-seeds-macos-mohave-public-beta-4",
      "apple-seeds-macos-mojave-beta-6-to-developers",
      "apple-seeds-macos-mojave-beta-7-to-developers",
      "apple-seeds-macos-mojave-beta-8",
      null,
      null,
      null,
    ],
    secondary: [
      "source-iculture-mojave",
      "source-iculture-mojave",
      "source-iculture-mojave",
      "source-iculture-mojave",
      "source-iculture-mojave",
      "source-iculture-mojave",
      "source-iculture-mojave",
      "source-monomaniac-mojave-pb8",
      "source-purudo-mojave-pb9",
      "source-osxd-mojave-pb10",
    ],
    extraSources: {
      8: ["source-softpedia-mojave-pb8"],
      9: ["source-sysprofile-mojave-pb9"],
      10: ["source-mrforum-mojave-pb10"],
    },
    reportedSequences: [9, 10],
  },
  {
    version: "10.15",
    dates: [
      "2019-06-24",
      "2019-07-03",
      "2019-07-18",
      "2019-08-01",
      "2019-08-19",
      "2019-08-28",
      "2019-09-11",
      "2019-09-23",
      "2019-09-30",
    ],
    mr: [
      "apple-releases-macos-catalina-public-beta-1",
      "apple-seeds-second-macos-catalina-public-beta",
      "apple-releases-macos-catalina-public-beta-3",
      "macos-catalina-public-beta-4",
      "apple-seeds-macos-catalina-beta-6",
      "apple-seeds-macos-catalina-beta-7",
      null,
      "apple-seeds-macos-catalina-beta-9",
      "apple-seeds-macos-catalina-beta-10-to-developers",
    ],
    secondary: [
      "source-iculture-catalina",
      "source-iculture-catalina",
      "source-iculture-catalina",
      "source-iculture-catalina",
      "source-iculture-catalina",
      "source-iculture-catalina",
      "source-mrforum-catalina-pb7",
      "source-dosdude-catalina",
      "source-appleinsider-catalina-pb9",
    ],
    extraSources: {
      7: ["source-reddit-catalina-pb7", "source-dosdude-catalina"],
      8: ["source-reddit-catalina-pb8"],
      9: [
        "source-mactrast-catalina-pb9",
        "source-mrforum-catalina-pb9",
      ],
    },
    reportedSequences: [7, 8, 9],
  },
];

const secondaryFileDefs = [
  ...Array.from({length: 6}, (_, index) => ({
    sourceId: `source-osxd-yosemite-pb${index + 1}`,
    relativePath: `osxdaily/yosemite-public-beta-${index + 1}.html`,
    publisher: "OS X Daily",
  })),
  ...Array.from({length: 5}, (_, index) => ({
    sourceId: `source-osxd-elcap-pb${index + 1}`,
    relativePath: `osxdaily/el-capitan-public-beta-${index + 1}.html`,
    publisher: "OS X Daily",
  })),
  {
    sourceId: "source-osxd-sierra-pb1",
    relativePath: "osxdaily/sierra-public-beta-1.html",
    publisher: "OS X Daily",
  },
  {
    sourceId: "source-osxd-sierra-pb7",
    relativePath: "osxdaily/sierra-public-beta-7.html",
    publisher: "OS X Daily",
  },
  {
    sourceId: "source-osxd-mojave-pb10",
    relativePath: "osxdaily/mojave-public-beta-10.html",
    publisher: "OS X Daily",
  },
  {
    sourceId: "source-idb-sierra-pb2",
    relativePath: "idownloadblog/sierra-public-beta-2.html",
    publisher: "iDownloadBlog",
  },
  {
    sourceId: "source-idb-sierra-pb3",
    relativePath: "idownloadblog/sierra-public-beta-3.html",
    publisher: "iDownloadBlog",
  },
  {
    sourceId: "source-macworld-sierra-pb5",
    relativePath: "macworld/sierra-public-beta-5.html",
    publisher: "Macworld",
  },
  {
    sourceId: "source-macworld-sierra-pb6",
    relativePath: "macworld/sierra-public-beta-6.html",
    publisher: "Macworld",
  },
  {
    sourceId: "source-macworld-sierra-pb7",
    relativePath: "macworld/sierra-public-beta-7.html",
    publisher: "Macworld",
  },
  {
    sourceId: "source-iculture-high-sierra",
    relativePath: "iculture/macos-high-sierra-publieke-beta.html",
    publisher: "iCulture",
    sourceClass: "contemporaryLivingChronology",
    locator:
      "Candidate-specific headed sections for Public Betas 1–7; use the prose sections, not the typo-prone recap list.",
    lineageNotes:
      "Living chronology published during the cycle. Its prose sections support PB1–7; its recap list contains acknowledged date/ordinal typos.",
  },
  {
    sourceId: "source-iculture-mojave",
    relativePath: "iculture/macos-mojave-beta.html",
    publisher: "iCulture",
    sourceClass: "contemporaryLivingChronology",
    locator:
      "Candidate-specific chronology entries for Mojave Public Betas 1–7.",
  },
  {
    sourceId: "source-iculture-catalina",
    relativePath: "iculture/macos-catalina-beta.html",
    publisher: "iCulture",
    sourceClass: "contemporaryLivingChronology",
    locator:
      "Candidate-specific chronology entries and revision history for Catalina Public Betas 1–6. Its PB5 revision is August 20 at 08:32 CEST, which converts to August 19 at 23:32 PDT; use the Pacific date.",
  },
  {
    sourceId: "source-iculture-elcap-pb5",
    relativePath:
      "iculture/os-x-el-capitan-publieke-beta-5-beschikbaar.html",
    publisher: "iCulture",
    locator:
      "Update paragraph: available briefly August 18, withdrawn, and downloadable again August 20.",
  },
  {
    sourceId: "source-macworld-elcap-pb5-return",
    relativePath:
      "forums/el-capitan-public-beta-5-replacement-macworld.html",
    publisher: "Macworld",
    locator:
      "Headline/date metadata and lead: appeared Tuesday, disappeared, and returned August 19.",
  },
  {
    sourceId: "source-whirlpool-high-sierra-pb8",
    relativePath: "forums/high-sierra-public-beta-8-whirlpool.html",
    publisher: "Whirlpool Forums",
    canonicalUrl: "https://forums.whirlpool.net.au/archive/2646210",
    publishedAt: "2017-09-02T09:01:49+10:00",
    sourceClass: "contemporaneousCommunityObservation",
    locator:
      "September 2 AEST post explicitly reports Public Beta 8 (= Developer Beta 9) that day.",
    lineageNotes:
      "Direct tester observation; useful but not an editorial publisher lineage.",
  },
  {
    sourceId: "source-monomaniac-mojave-pb8",
    relativePath: "monomaniac/mojave-public-beta-8.html",
    publisher: "Monomaniac Garage",
    canonicalUrl:
      "https://www.monomaniacgarage.com/macos-mojave-10-14-public-beta-8-18a377a/",
    publishedAt: "2018-08-28",
    sourceClass: "contemporaneousCommunityObservation",
    locator:
      "August 28 JST entry explicitly reports Mojave Public Beta 8 build 18A377a.",
  },
  {
    sourceId: "source-purudo-mojave-pb9",
    relativePath: "purudo/mojave-public-beta-9.html",
    publisher: "Purudo.net",
    locator:
      "Headline and lead explicitly identify Mojave Public Beta 9 on September 5.",
  },
  {
    sourceId: "source-sysprofile-mojave-pb9",
    relativePath: "sysprofile/mojave-public-beta-9.html",
    publisher: "SysProfile Forum",
    canonicalUrl:
      "https://forum.sysprofile.de/macos-mojave-10-14-public-beta-9-veroeffentlicht.t342600/",
    publishedAt: "2018-09-05",
    sourceClass: "contemporaneousSyndicatedReport",
    locator:
      "September 5 NewsBot post explicitly labels Mojave Public Beta 9.",
    lineageNotes:
      "Syndicated/reposted report; independence from the originating story is not established.",
  },
  {
    sourceId: "source-mrforum-mojave-pb10",
    relativePath: "forums/mojave-public-beta-10-macrumors.html",
    publisher: "MacRumors Forums",
    sourceClass: "contemporaneousCommunityObservation",
    locator:
      "September 12 thread post states that the public beta was also available; follow-up posts discuss the candidate-final payload.",
    lineageNotes:
      "Direct tester observation on a publisher forum, not a separate editorial report.",
  },
  {
    sourceId: "source-mrforum-catalina-pb7",
    relativePath: "forums/catalina-public-beta-7-macrumors.html",
    publisher: "MacRumors Forums",
    sourceClass: "contemporaneousCommunityObservation",
    locator:
      "September 11 thread titled 'New Public Beta out now'; posts report 19A558d.",
    lineageNotes:
      "Direct tester observation on a publisher forum, not a separate editorial report.",
  },
  {
    sourceId: "source-dosdude-catalina",
    relativePath: "dosdude/catalina-patcher-changelog.html",
    publisher: "dosdude1",
    canonicalUrl: "https://dosdude1.com/catalina/changelog.html",
    sourceClass: "contemporaneousTechnicalArtifact",
    locator:
      "Patcher changelog maps Developer Preview 7/Public Beta 6, Preview 8/Public Beta 7, and Preview 9/Public Beta 8 to dated support releases.",
    lineageNotes:
      "Independent technical-maintenance artifact, not journalism.",
  },
  {
    sourceId: "source-appleinsider-catalina-pb9",
    relativePath: "appleinsider/catalina-public-beta-9.html",
    publisher: "AppleInsider",
    locator:
      "September 30 article update states that Apple issued a public beta version of the latest Catalina release.",
  },
  {
    sourceId: "source-mactrast-catalina-pb9",
    relativePath: "mactrast/catalina-public-beta-9.html",
    publisher: "MacTrast",
    locator:
      "September 30 report says the latest Catalina beta was available to developer and public beta testers; it uses developer-style 'beta 10' wording.",
  },
  {
    sourceId: "source-origin-macworld",
    relativePath:
      "program-origin/apple-launches-beta-seed-for-os-x-program-for-end-users.html.html",
    publisher: "Macworld",
    locator:
      "Headline/date and lead identify the April 22 OS X Beta Seed Program opening to end users.",
  },
  {
    sourceId: "source-origin-ars",
    relativePath:
      "program-origin/apple-opens-os-x-beta-program-to-the-public-for-10-9-3.html",
    publisher: "Ars Technica",
    locator:
      "Headline/date and lead identify public access to the current OS X 10.9.3 prerelease.",
  },
  {
    sourceId: "source-origin-9to5mac",
    relativePath:
      "program-origin/apples-new-program-lets-anyone-not-just-developers-test-os-x-beta-builds.html",
    publisher: "9to5Mac",
    locator:
      "Headline/date and lead identify the new open program and contrast it with developer-only access.",
  },
  {
    sourceId: "source-origin-engadget",
    relativePath:
      "program-origin/2014-04-22-os-x-beta-seed-program.html.html",
    publisher: "Engadget",
    locator:
      "April 22 report identifies OS X Beta Seed Program access for end users.",
  },
];

const webOnlyDefs = [
  {
    sourceId: "source-macmag-sierra-pb4",
    canonicalUrl:
      "https://macmagazine.com.br/post/2016/08/09/quase-uma-semana-antes-do-previsto-apple-libera-quinta-beta-do-ios-10-para-desenvolvedores/",
    title:
      "Quase uma semana antes do previsto, Apple libera quintas betas dos seus novos sistemas operacionais para desenvolvedores [atualizado 4x]",
    publisher: "MacMagazine",
    publishedAt: "2016-08-09",
    locator:
      "Update III at 18:19 on August 9 explicitly says Sierra Public Beta 4 was released through Apple Beta Software Program.",
    captureMethod: "web-search rendered text; direct HTTP capture returned 403",
  },
  {
    sourceId: "source-mrforum-high-sierra-pb8",
    canonicalUrl:
      "https://forums.macrumors.com/threads/macos-high-sierra-10-13-unsupported-macs-thread.2048478/page-45",
    title: "macOS High Sierra (10.13) Unsupported Macs Thread — page 45",
    publisher: "MacRumors Forums",
    publishedAt: "2017-09-02",
    sourceClass: "contemporaneousCommunityObservation",
    locator:
      "September 2–4 posts report 17A360a and explicitly say High Sierra Public Beta 8 appeared.",
    captureMethod: "web-search rendered text; direct HTTP capture returned 403",
    lineageNotes:
      "Direct tester observations; not an editorial publisher lineage.",
  },
  {
    sourceId: "source-softpedia-mojave-pb8",
    canonicalUrl:
      "https://news.softpedia.com/news/apple-releases-ios-12-beta-11-macos-mojave-10-14-and-tvos-12-beta-9-for-testing-522402.shtml",
    title:
      "Apple Releases iOS 12 Beta 11, macOS Mojave 10.14 and tvOS 12 Beta 9 for Testing — Updated",
    publisher: "Softpedia",
    author: "Marius Nestor",
    publishedAt: "2018-08-27T17:15:00Z",
    locator:
      "Article update explicitly identifies Mojave Public Beta 8 as available to public testers.",
    captureMethod: "web-search rendered text; direct HTTP capture returned 403",
  },
  {
    sourceId: "source-reddit-catalina-pb7",
    canonicalUrl:
      "https://www.reddit.com/r/MacOSBeta/comments/d2tm4d/catalina_public_beta_7_is_out/",
    title: "Catalina Public Beta 7 is out",
    publisher: "Reddit / r/MacOSBeta",
    publishedAt: "2019-09-11",
    sourceClass: "contemporaneousCommunityObservation",
    locator:
      "Same-day post explicitly labels Public Beta 7 and reports build 19A558d.",
    captureMethod: "web-search rendered text; direct HTTP capture returned 403",
    lineageNotes: "Direct community observation, not an editorial report.",
  },
  {
    sourceId: "source-reddit-catalina-pb8",
    canonicalUrl:
      "https://www.reddit.com/r/MacOSBeta/comments/d8cw2s/macos_1015_catalina_public_beta_8_is_out_too_but/",
    title: "macOS 10.15 Catalina Public Beta 8 is out, too",
    publisher: "Reddit / r/MacOSBeta",
    publishedAt: "2019-09-23",
    sourceClass: "contemporaneousCommunityObservation",
    locator:
      "Same-day post explicitly says Catalina Public Beta 8 went live after Developer Beta 9.",
    captureMethod: "web-search rendered text; direct HTTP capture returned 403",
    lineageNotes: "Direct community observation, not an editorial report.",
  },
  {
    sourceId: "source-mrforum-catalina-pb9",
    canonicalUrl:
      "https://forums.macrumors.com/threads/macos-catalina-10-15-bugs-and-bug-fixes.2183833/page-26",
    title: "macOS Catalina (10.15) — Bugs and bug fixes, page 26",
    publisher: "MacRumors Forums",
    publishedAt: "2019-09-30",
    sourceClass: "contemporaneousCommunityObservation",
    locator:
      "September 30 posts explicitly identify the currently installed public release as Public Beta 9.",
    captureMethod: "web-search rendered text; direct HTTP capture was not retained",
    lineageNotes: "Direct tester observation, not an editorial report.",
  },
];

const macRumorsSourceDefs = [];
for (const cycle of candidateSpecs) {
  cycle.mr.forEach((name, index) => {
    if (!name) return;
    macRumorsSourceDefs.push({
      sourceId: sourceIdForCandidate(cycle.version, index + 1),
      relativePath: mrPath(name),
      publisher: "MacRumors",
      locator:
        cycle.version === "10.15" && index + 1 === 5
          ? "The August 19 developer article's same-day public-availability update and its 10:23 a.m. PDT discussion record establish Catalina Public Beta 5 availability on August 19 Pacific."
          : "JSON-LD headline/datePublished and the article lead or update that records public-beta availability.",
    });
  });
}

const sources = [
  ...(await Promise.all(
    [...macRumorsSourceDefs, ...secondaryFileDefs].map((definition) =>
      fileSource(definition),
    ),
  )),
  ...webOnlyDefs.map(webOnlySource),
].sort((left, right) => left.sourceId.localeCompare(right.sourceId));

const sourceById = new Map(sources.map((source) => [source.sourceId, source]));

const candidateSourceIds = (cycle, sequence) => {
  const ids = [];
  if (cycle.mr[sequence - 1]) {
    ids.push(sourceIdForCandidate(cycle.version, sequence));
  }
  ids.push(cycle.secondary[sequence - 1]);
  ids.push(...(cycle.extraSources?.[sequence] ?? []));
  return [...new Set(ids)];
};

const candidates = [];
for (const cycle of candidateSpecs) {
  cycle.dates.forEach((appearanceDate, index) => {
    const sequence = index + 1;
    const reported = cycle.reportedSequences?.includes(sequence) ?? false;
    const isElCapReplacementConflict =
      cycle.version === "10.11" && sequence === 5;
    const sourceIds = candidateSourceIds(cycle, sequence);
    candidates.push({
      candidateId: `candidate:apple:macos:${cycle.version}:public-beta-${sequence}`,
      originCohortId: "macos-2014-2019-major-public-beta",
      platform: "macOS",
      platformId: "platform-macos",
      version: cycle.version,
      releaseVersionId: `version-macos-${cycle.version.replaceAll(".", "-")}`,
      proposedIdentity: {
        label: `Public Beta ${sequence}`,
        routeAlias: `public-beta-${sequence}`,
        channel: "publicBeta",
        appearanceDate,
        sequence,
        isRevision: false,
        availabilityState: isElCapReplacementConflict
          ? "replaced"
          : "available",
        closesReleaseCycle: false,
      },
      ordinalBasis: isElCapReplacementConflict ? "conflicted" : "explicit",
      candidateStatus: "needsEvidenceReview",
      identityStatus: isElCapReplacementConflict
        ? "conflict"
        : reported
          ? "unverified"
          : "confirmed",
      evidenceState: reported ? "reported" : "corroborated",
      productionReconciliation: {
        status: "confirmedMissing",
        queriedAt: productionQueriedAt,
        matchBasis:
          "The read-only published production query found zero macOS publicBeta events globally; this releaseVersion exists and therefore has zero exact {releaseVersionId, channel, routeAlias} matches.",
        exactIdentityMatches: 0,
      },
      evidenceRefs: sourceIds.map((sourceId) => ({
        kind: "packetSource",
        packetPath: `${batchDir}/sources.json`,
        sourceId,
        locator: sourceById.get(sourceId).evidence.locator,
        supports: reported
          ? `Contemporary evidence for macOS ${cycle.version} Public Beta ${sequence}; the packet keeps this identity at reported pending stronger editorial corroboration.`
          : `Independent contemporary evidence for macOS ${cycle.version} Public Beta ${sequence}, including its public audience, displayed ordinal, and appearance date.`,
      })),
      buildEvidenceStatus: "absent",
      contentDisposition: "timelineOnly",
      blockers: [
        "Independent human chronology review has not yet occurred.",
        ...(reported
          ? [
              "A second independent contemporary editorial publisher lineage that explicitly preserves this public ordinal has not yet been retained.",
            ]
          : []),
        ...(isElCapReplacementConflict
          ? [
              "Public Beta 5 was withdrawn and then reappeared under the same displayed ordinal; the current route schema cannot represent the replacement without a chronology-model decision.",
              "Contemporary sources disagree whether the replacement returned August 19 or August 20.",
            ]
          : []),
      ],
      review: {
        required: true,
        reviewer: null,
        reviewedAt: null,
        notes:
          "The research agent reproduced source metadata and hashes but cannot count as an independent reviewer.",
      },
      flags: {
        sanityMutationAllowed: false,
        publicationEligible: false,
      },
    });
  });
}

const notProposed = [
  {
    recordId: "not-proposed:apple:macos:10.9.3:os-x-beta-seed-program",
    version: "10.9.3",
    appearanceDate: "2014-04-22",
    displayedLabel: "OS X Beta Seed Program",
    proposedChannel: "publicBeta",
    disposition: "modelingDecisionRequired",
    evidenceState: "corroborated",
    evidenceRefs: [
      "source-origin-macworld",
      "source-origin-ars",
      "source-origin-9to5mac",
      "source-origin-engadget",
    ],
    reasons: [
      "This is the first open recurring OS X public-seed appearance and must remain in the historical record.",
      "The surviving sources do not display 'Public Beta 1'; inventing that ordinal would violate the program rules.",
      "Production has no version-macos-10-9-3 releaseVersion parent, and the current candidate schema requires Public Beta N/public-beta-N.",
    ],
    productionReconciliation: {
      status: "existingIdentityConflict",
      queriedAt: productionQueriedAt,
      exactIdentityMatches: 0,
      parentReleaseVersionExists: false,
    },
    flags: {
      sanityMutationAllowed: false,
      publicationEligible: false,
    },
  },
  {
    recordId:
      "not-proposed:apple:macos:10.11:public-beta-5-replacement-appearance",
    version: "10.11",
    appearanceDateRange: ["2015-08-19", "2015-08-20"],
    displayedLabel: "Public Beta 5",
    proposedChannel: "publicBeta",
    disposition: "duplicateDisplayedIdentityNeedsModelingDecision",
    evidenceState: "corroboratedWithDateConflict",
    evidenceRefs: [
      "source-iculture-elcap-pb5",
      "source-macworld-elcap-pb5-return",
    ],
    reasons: [
      "The original Public Beta 5 appeared August 18 and was withdrawn.",
      "The replacement/reappearance retained the same displayed Public Beta 5 identity.",
      "Macworld dates the return to August 19; iCulture's updated contemporary page dates it to August 20.",
      "Creating another public-beta-5 route would collide with the original, and isRevision cannot be asserted without a defined public replacement identity rule.",
    ],
    flags: {
      sanityMutationAllowed: false,
      publicationEligible: false,
    },
  },
  {
    recordId: "not-proposed:apple:macos:10.15:apparent-public-beta-10-gm",
    version: "10.15",
    appearanceDate: "2019-10-03",
    displayedLabel: "Golden Master / apparent Public Beta 10",
    proposedChannel: "publicBeta",
    disposition: "doNotCreatePublicBetaEvent",
    evidenceState: "conflictedCommunityTerminology",
    evidenceRefs: [
      "source-mr-macos-10-15-pb9",
      "source-appleinsider-catalina-pb9",
      "source-mrforum-catalina-pb9",
    ],
    reasons: [
      "Reliable contemporary reporting identifies September 30 as the ninth public-beta appearance.",
      "Apple issued the Golden Master on October 3.",
      "Later community discussion sometimes calls the GM payload Public Beta 10, but no retained reliable contemporary source separately establishes a Public Beta 10 appearance.",
      "The program rule says that public testers receiving an RC/GM does not by itself create a publicBeta event.",
    ],
    flags: {
      sanityMutationAllowed: false,
      publicationEligible: false,
    },
  },
];

const productionSnapshot = {
  formatVersion: 1,
  batchId: "beta-chronology-gap-macos-2014-2019",
  queriedAt: productionQueriedAt,
  perspective: "published",
  queryScript: `${batchDir}/query-production.ts`,
  projectId: "lh3yswzu",
  dataset: "production",
  allPublishedEventCount: 2068,
  macOSPublicBetaCount: 0,
  targetVersionIds: [
    "version-macos-10-9-3",
    "version-macos-10-10",
    "version-macos-10-11",
    "version-macos-10-12",
    "version-macos-10-13",
    "version-macos-10-14",
    "version-macos-10-15",
  ],
  existingReleaseVersionIds: [
    "version-macos-10-10",
    "version-macos-10-11",
    "version-macos-10-12",
    "version-macos-10-13",
    "version-macos-10-14",
    "version-macos-10-15",
  ],
  missingReleaseVersionIds: ["version-macos-10-9-3"],
  exactCandidateMatchCount: 0,
  interpretation:
    "Every numbered candidate in candidates.json is absent from published production. The 10.9.3 program-origin appearance additionally lacks a releaseVersion parent.",
  safety: {
    readOnly: true,
    sanityMutationPerformed: false,
  },
};

const assignmentTargets = candidates.map((candidate) => ({
  candidateId: candidate.candidateId,
  platform: candidate.platform,
  platformId: candidate.platformId,
  version: candidate.version,
  releaseVersionId: candidate.releaseVersionId,
  channel: "publicBeta",
  routeAlias: candidate.proposedIdentity.routeAlias,
  displayedLabel: candidate.proposedIdentity.label,
  expectedAppearanceDate: candidate.proposedIdentity.appearanceDate,
  expectedSequence: candidate.proposedIdentity.sequence,
}));

const assignment = {
  formatVersion: 1,
  batchId: "beta-chronology-gap-macos-2014-2019",
  createdAt: generatedAt,
  createdBy: "codex-review-reusable-public-betas",
  vendor: {name: "Apple", slug: "apple"},
  researchCutoff: accessedAt,
  scopeRule:
    "Audit every recurring public OS X/macOS major-cycle appearance from OS X 10.9.3 through macOS Catalina 10.15. Preserve public numbering exactly, distinguish developer/GM/private distribution, investigate withdrawals and replacements, and exclude the separately sold 2000 Mac OS X Public Beta product.",
  calendarNormalization:
    "appearanceDate uses the America/Los_Angeles calendar date when a release crossed midnight in European or Asian reporting. A later local publication date is preserved in source metadata and conflicts, not silently treated as a second appearance.",
  numberedTargetCount: candidates.length,
  exceptionalAppearanceCount: 2,
  numberedTargets: assignmentTargets,
  exceptionalAppearances: notProposed.slice(0, 2).map((record) => ({
    recordId: record.recordId,
    version: record.version,
    displayedLabel: record.displayedLabel,
    disposition: record.disposition,
  })),
  explicitExclusion: notProposed[2],
  constraints: {
    sanityMutationAllowed: false,
    publicationAuthorized: false,
    stableEventIdCreationAllowed: false,
    buildsInScope: false,
    articleResearchInScope: false,
  },
};

const byVersion = Object.fromEntries(
  candidateSpecs.map((cycle) => [cycle.version, cycle.dates.length]),
);
const evidenceCounts = candidates.reduce(
  (summary, candidate) => {
    summary[candidate.evidenceState] =
      (summary[candidate.evidenceState] ?? 0) + 1;
    return summary;
  },
  {},
);

const candidatesDocument = {
  formatVersion: 1,
  batchId: "beta-chronology-gap-macos-2014-2019",
  researchCutoff: accessedAt,
  candidateCount: candidates.length,
  summary: {
    byVersion,
    byCandidateStatus: {needsEvidenceReview: candidates.length},
    byEvidenceState: evidenceCounts,
    modelableAppearanceCandidateCount: candidates.length,
    exceptionalHistoricalAppearanceCount: 2,
    excludedApparentAppearanceCount: 1,
    buildsIncluded: 0,
    substantiveChangeClaimsIncluded: 0,
    importantQualification:
      "The numbered sequence contains 45 candidates. The April 2014 10.9.3 program launch and the El Capitan Public Beta 5 replacement are separately preserved because the current numbered route schema cannot represent them truthfully. No candidate is chronology-approved or publication-eligible.",
  },
  candidates,
  notProposed,
};

const conflicts = {
  formatVersion: 1,
  batchId: "beta-chronology-gap-macos-2014-2019",
  conflictCount: 9,
  conflicts: [
    {
      conflictId: "osx-10-9-3-unnumbered-program-origin",
      severity: "high",
      subject:
        "How to model the April 22, 2014 OS X 10.9.3 Beta Seed Program appearance",
      sourceIds: [
        "source-origin-macworld",
        "source-origin-ars",
        "source-origin-9to5mac",
        "source-origin-engadget",
      ],
      finding:
        "Four contemporary lineages establish open end-user access to the current OS X 10.9.3 prerelease, but none displays Public Beta 1.",
      decision:
        "Preserve as a modeling exception; do not invent public-beta-1. A releaseVersion parent also must be separately approved.",
    },
    {
      conflictId: "elcap-public-beta-5-withdrawal-replacement",
      severity: "high",
      subject:
        "El Capitan Public Beta 5 withdrawal and same-label replacement",
      sourceIds: [
        "source-mr-macos-10-11-pb5",
        "source-iculture-elcap-pb5",
        "source-macworld-elcap-pb5-return",
      ],
      finding:
        "Public Beta 5 appeared August 18, was withdrawn, and returned under the same public label. Macworld dates the return August 19; iCulture dates it August 20.",
      decision:
        "Keep the August 18 candidate as replaced and preserve the return as an unmodeled replacement appearance pending route/revision policy.",
    },
    {
      conflictId: "sierra-public-beta-4-calendar-date",
      severity: "medium",
      subject: "Sierra Public Beta 4 date: August 9 versus August 10",
      sourceIds: [
        "source-mr-macos-10-12-pb4",
        "source-macmag-sierra-pb4",
      ],
      finding:
        "MacRumors and MacMagazine recorded the public update on August 9 in the Americas; later European/Asian records use August 10.",
      decision:
        "Normalize to 2016-08-09 America/Los_Angeles and preserve the cross-time-zone discrepancy.",
    },
    {
      conflictId: "high-sierra-living-chronology-typos",
      severity: "medium",
      subject: "Internal typos in iCulture's High Sierra living chronology",
      sourceIds: ["source-iculture-high-sierra"],
      finding:
        "The candidate-specific prose gives PB1 as June 29 and PB7 as August 28, while the recap list says June 26 for PB1 and one section body accidentally says PB8 under the PB7 heading.",
      decision:
        "Use the dated prose sections corroborated by MacRumors. Do not treat the recap typos as separate appearances.",
    },
    {
      conflictId: "high-sierra-public-beta-8-evidence-quality",
      severity: "high",
      subject: "High Sierra Public Beta 8 on September 1, 2017",
      sourceIds: [
        "source-whirlpool-high-sierra-pb8",
        "source-mrforum-high-sierra-pb8",
      ],
      finding:
        "Two independent tester communities report Public Beta 8 and build 17A360a around September 1–2, but no retained contemporary editorial publisher explicitly preserves the public ordinal.",
      decision:
        "Keep the candidate at reported/needsEvidenceReview.",
    },
    {
      conflictId: "mojave-late-public-beta-evidence",
      severity: "medium",
      subject: "Mojave Public Betas 8–10",
      sourceIds: [
        "source-monomaniac-mojave-pb8",
        "source-softpedia-mojave-pb8",
        "source-purudo-mojave-pb9",
        "source-sysprofile-mojave-pb9",
        "source-osxd-mojave-pb10",
        "source-mrforum-mojave-pb10",
      ],
      finding:
        "PB8 is independently corroborated. PB9 has one direct publisher and one likely syndicated lineage. PB10 has one editorial report plus tester confirmation and shared GM-candidate terminology.",
      decision:
        "PB8 is evidence-corroborated; keep PB9 and PB10 at reported until another independent contemporary editorial source is retained.",
    },
    {
      conflictId: "catalina-public-beta-5-pacific-date",
      severity: "high",
      subject:
        "Catalina Public Beta 5: August 19 Pacific versus August 20 European chronology date",
      sourceIds: [
        "source-mr-macos-10-15-pb5",
        "source-iculture-catalina",
      ],
      finding:
        "MacRumors records public availability on August 19 and its discussion records availability at 10:23 a.m. PDT. iCulture's August 20 08:32 CEST revision converts to August 19 23:32 PDT.",
      decision:
        "Normalize Catalina Public Beta 5 to 2019-08-19 under the packet's America/Los_Angeles convention. August 20 is the European local date, not a second appearance.",
    },
    {
      conflictId: "catalina-calendar-and-ordinal-boundaries",
      severity: "medium",
      subject:
        "Catalina local calendar dates and late-cycle public numbering",
      sourceIds: [
        "source-iculture-catalina",
        "source-mrforum-catalina-pb7",
        "source-dosdude-catalina",
        "source-reddit-catalina-pb7",
        "source-reddit-catalina-pb8",
        "source-appleinsider-catalina-pb9",
      ],
      finding:
        "European reports roll PB2, PB5, and PB6 into the following local day. PB7–PB9 survive mainly through public-tester observations, technical artifacts, and developer-seed articles updated to say a public version was available.",
      decision:
        "Normalize dates to Pacific availability (July 3, August 19, August 28, September 11, September 23, September 30) and keep PB7–PB9 at reported pending stronger ordinal-specific editorial corroboration.",
    },
    {
      conflictId: "catalina-apparent-public-beta-10-gm",
      severity: "high",
      subject:
        "Whether Catalina's October 3 GM distribution creates Public Beta 10",
      sourceIds: [
        "source-mr-macos-10-15-pb9",
        "source-appleinsider-catalina-pb9",
        "source-mrforum-catalina-pb9",
      ],
      finding:
        "The last independently supportable numbered public appearance is Public Beta 9 on September 30. Community terminology later conflates the October 3 GM with Public Beta 10.",
      decision:
        "Do not create a Public Beta 10 event unless a reliable contemporary source separately identifies that public-beta appearance rather than merely GM availability to public testers.",
    },
  ],
  reviewState: "selfCheckedPendingIndependentReview",
};

const tableRows = candidates
  .map(
    (candidate) =>
      `| ${candidate.version} | ${candidate.proposedIdentity.label} | ${candidate.proposedIdentity.appearanceDate} | ${candidate.evidenceState} | ${candidate.identityStatus} |`,
  )
  .join("\n");

const report = `# macOS recurring public-beta chronology, 2014–2019

Status: **research complete; mechanical self-check passed; independent partial review received; required Catalina PB5 correction applied**

Research cutoff: **${accessedAt}**

Scope: every recurring public OS X/macOS major-cycle appearance from OS X 10.9.3 through macOS Catalina 10.15. The separately sold 2000 Mac OS X Public Beta product is outside this packet.

## Outcome

The surviving record supports **45 numbered public-beta candidates** across OS X Yosemite through macOS Catalina:

- OS X Yosemite 10.10: 6
- OS X El Capitan 10.11: 5
- macOS Sierra 10.12: 7
- macOS High Sierra 10.13: 8
- macOS Mojave 10.14: 10
- macOS Catalina 10.15: 9

In addition, two historically real appearances cannot be truthfully expressed by the current numbered-route model:

1. **OS X 10.9.3 Beta Seed Program — April 22, 2014.** This is the recurring program's open public origin. Contemporary sources do not call it Public Beta 1, and production has no \`version-macos-10-9-3\` parent.
2. **OS X El Capitan Public Beta 5 replacement.** The August 18 seed was withdrawn, then returned under the same displayed ordinal on August 19 or 20 depending on the contemporary source. A second \`public-beta-5\` route would collide with the original.

An apparent Catalina Public Beta 10 is deliberately not proposed. Reliable evidence identifies September 30 as Public Beta 9 and October 3 as the Golden Master; community usage that calls the GM payload Public Beta 10 does not cross the program's RC/GM gate.

## Production reconciliation

A read-only published-production query at \`${productionQueriedAt}\` counted **2,068** release events and **zero macOS \`publicBeta\` events**. Release-version parents exist for 10.10 through 10.15; 10.9.3 is missing. Therefore every numbered candidate is confirmed absent in that snapshot, while the 10.9.3 origin also requires a parent-model decision.

No Sanity write, import, transaction, publication, or deployment was performed.

## Numbered sequence

| Version | Displayed label | Pacific appearance date | Evidence | Identity |
| --- | --- | --- | --- | --- |
${tableRows}

All 45 remain \`needsEvidenceReview\` because the researcher cannot serve as the independent reviewer. Thirty-nine identities have two independent contemporary lineages in this packet. Six late-cycle identities remain \`reported\`: High Sierra PB8, Mojave PB9–10, and Catalina PB7–9.

## Date convention

The canonical \`appearanceDate\` is the America/Los_Angeles calendar date. That matters for sources published after midnight in Europe or Asia:

- Sierra PB4: August 9 Pacific; some later records say August 10.
- High Sierra PB5: August 14 Pacific; one recap list says August 15.
- Mojave PB6 and PB8: August 13 and 27 Pacific; European/Asian pages display August 14 and 28.
- Catalina PB2, PB5, and PB6: July 3, August 19, and August 28 Pacific; European reporting displays July 4, August 20, and August 29.

Those are preserved as source/date qualifications, not modeled as extra appearances.

The independent review identified the original Catalina PB5 date as a blocking defect. This re-freeze applies its required correction from August 20 to **August 19, 2019**, updates the source locators and conflicts, and preserves \`independent-review.json\` unchanged. The seven pre-existing evidence/modeling blockers remain.

## Evidence and copyright handling

The packet records release identity only: public audience, displayed ordinal, date, availability state, and production absence. It does not copy publisher release-note prose or make substantive feature claims. Later page builders should write original synthesis, cite the public-distribution source at claim level, and point shared product changes to the paired developer event rather than duplicating unsupported notes.

Raw captures are under \`tmp/research-evidence/beta-chronology-gap/macos-2014-2019/\`. They are ignored research evidence, not publishing assets.

## Required independent review

1. Reproduce every retained raw byte count and SHA-256 in \`sources.json\`.
2. Check each candidate locator for explicit platform, public audience, public ordinal, and date.
3. Review the six \`reported\` late-cycle candidates and seek another independent editorial lineage.
4. Decide how the chronology model should represent the unnumbered 10.9.3 origin.
5. Decide whether a same-label withdrawal/replacement needs a new event subtype, revision identity, or availability-history model.
6. Re-run the live read-only production query immediately before any separately authorized mutation.
7. Keep GM/RC distribution distinct from a separately labeled public-beta appearance.

## Files

- \`assignment.json\` — exact scope, targets, date convention, and constraints
- \`sources.json\` — source ledger with local evidence custody
- \`candidates.json\` — 45 numbered candidates and three not-proposed records
- \`conflicts.json\` — modeling, date, ordinal, and evidence conflicts
- \`production-snapshot.json\` — bounded read-only production reconciliation
- \`review.json\` — researcher's self-check boundary
- \`independent-review.json\` — independent partial review and the now-applied Catalina PB5 correction
- \`validate.mjs\` and \`validation.json\` — repeatable mechanical validation

This packet authorizes no production change.
`;

const review = {
  formatVersion: 1,
  batchId: "beta-chronology-gap-macos-2014-2019",
  reviewedAt: accessedAt,
  reviewer: "codex-review-reusable-public-betas",
  independentOfResearcher: false,
  verdict: "selfCheckPassedPendingIndependentReview",
  independentReviewArtifact: {
    path: `${batchDir}/independent-review.json`,
    verdict: "partialPassWithRequiredCorrection",
    chronologyApprovedCandidateCount: 37,
    requiredCorrectionApplied: {
      candidateId: "candidate:apple:macos:10.15:public-beta-5",
      appearanceDate: "2019-08-19",
    },
    remainingIndependentReviewBlockers: 7,
  },
  candidateVerdict: {
    readyForIndependentChronologyReview: candidates
      .filter(
        (candidate) =>
          candidate.evidenceState === "corroborated" &&
          candidate.identityStatus === "confirmed",
      )
      .map((candidate) => candidate.candidateId),
    needsAdditionalEvidenceOrModeling: candidates
      .filter(
        (candidate) =>
          candidate.evidenceState !== "corroborated" ||
          candidate.identityStatus !== "confirmed",
      )
      .map((candidate) => candidate.candidateId),
  },
  checks: {
    targetEnumerationComplete: true,
    sourceMetadataCaptured: true,
    productionQueryReadOnly: true,
    productionMacOSPublicBetaCount: 0,
    publicOrdinalNotInferredFromDeveloperOrdinal: true,
    unnumberedProgramOriginPreserved: true,
    withdrawalReplacementPreserved: true,
    gmRcBoundaryApplied: true,
    sanityMutationPerformed: false,
  },
  authorization: {
    independentChronologyReviewComplete: false,
    publicationEligible: false,
    sanityMutationAllowed: false,
    deploymentAllowed: false,
  },
};

const sourcesDocument = {
  formatVersion: 1,
  batchId: "beta-chronology-gap-macos-2014-2019",
  accessedAt,
  sourceCount: sources.length,
  sources,
};

for (const [filename, value] of [
  ["assignment.json", assignment],
  ["sources.json", sourcesDocument],
  ["candidates.json", candidatesDocument],
  ["conflicts.json", conflicts],
  ["production-snapshot.json", productionSnapshot],
  ["review.json", review],
]) {
  await writeFile(
    path.join(batchDir, filename),
    `${JSON.stringify(value, null, 2)}\n`,
  );
}
await writeFile(path.join(batchDir, "report.md"), report);

const builtFiles = await Promise.all(
  [
    "assignment.json",
    "sources.json",
    "candidates.json",
    "conflicts.json",
    "production-snapshot.json",
    "review.json",
    "report.md",
  ].map(async (filename) => ({
    filename,
    bytes: (await stat(path.join(batchDir, filename))).size,
  })),
);

console.log(
  JSON.stringify(
    {
      batchId: "beta-chronology-gap-macos-2014-2019",
      candidateCount: candidates.length,
      sourceCount: sources.length,
      builtFiles,
    },
    null,
    2,
  ),
);
