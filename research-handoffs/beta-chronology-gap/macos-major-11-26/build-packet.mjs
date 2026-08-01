import {createHash} from "node:crypto";
import {readFile, writeFile} from "node:fs/promises";
import path from "node:path";
import {fileURLToPath} from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(here, "../../../");
const evidenceRoot = path.join(
  repoRoot,
  "tmp/research-evidence/beta-chronology-gap/macos-major-11-26",
);
const relativeEvidenceRoot =
  "tmp/research-evidence/beta-chronology-gap/macos-major-11-26";
const relativePacketDir =
  "research-handoffs/beta-chronology-gap/macos-major-11-26";
const batchId = "beta-chronology-gap-macos-major-11-26";
const cohortId = "macos-major-11-26-public-beta";
const researchCutoff = "2026-07-30";
const generatedAt = new Date().toISOString();

const cycles = {
  "11.0": [
    [1, "2020-08-06"],
    [2, "2020-08-20"],
    [3, "2020-09-08"],
    [4, "2020-09-22"],
    [5, "2020-09-30"],
    [6, "2020-10-15"],
  ],
  "12.0": [
    [1, "2021-07-01"],
    [2, "2021-07-16"],
    [4, "2021-07-28"],
    [5, "2021-08-12"],
    [6, "2021-08-31"],
    [7, "2021-09-22"],
    [8, "2021-09-29"],
    [9, "2021-10-07"],
    [10, "2021-10-13"],
  ],
  "13.0": [
    [1, "2022-07-11"],
    [2, "2022-07-28"],
    [3, "2022-08-09"],
    [4, "2022-08-26"],
    [5, "2022-09-09"],
    [6, "2022-09-21"],
    [7, "2022-09-28"],
    [8, "2022-10-05"],
    [9, "2022-10-11"],
  ],
  "14.0": [
    [1, "2023-07-12"],
    [2, "2023-07-31"],
    [3, "2023-08-09"],
    [4, "2023-08-22"],
    [5, "2023-08-30"],
  ],
  "15.0": [
    [1, "2024-07-15"],
    [2, "2024-07-24"],
    [3, "2024-08-06"],
    [4, "2024-08-12"],
    [5, "2024-08-20"],
    [6, "2024-08-28"],
  ],
  "26.0": [
    [1, "2025-07-21"],
    [2, "2025-08-07"],
    [3, "2025-08-14"],
    [4, "2025-08-18"],
    [5, "2025-08-25"],
    [6, "2025-09-02"],
  ],
};

const versionIds = Object.fromEntries(
  Object.keys(cycles).map((version) => [
    version,
    `version-macos-${version.replaceAll(".", "-")}`,
  ]),
);

const candidateIdFor = (version, sequence) =>
  `candidate:apple:macos:${version}:public-beta-${sequence}`;
const candidateKey = (version, sequence) => `${version}:${sequence}`;
const sha256 = (value) =>
  createHash("sha256").update(value).digest("hex");
const writeJson = (filename, value) =>
  writeFile(
    path.join(here, filename),
    `${JSON.stringify(value, null, 2)}\n`,
  );

const decodeHtml = (value = "") =>
  value
    .replaceAll(/&#x([0-9a-f]+);/gi, (_, hex) =>
      String.fromCodePoint(Number.parseInt(hex, 16)),
    )
    .replaceAll(/&#([0-9]+);/g, (_, number) =>
      String.fromCodePoint(Number.parseInt(number, 10)),
    )
    .replaceAll("&amp;", "&")
    .replaceAll("&quot;", '"')
    .replaceAll("&apos;", "'")
    .replaceAll("&#039;", "'")
    .replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">")
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

const boundedIdentification = (title) => {
  const words = title.split(/\s+/).filter(Boolean).slice(0, 20);
  return {
    type: "boundedSourceIdentification",
    text: words.join(" "),
    wordCount: words.length,
    maxWords: 20,
    purpose:
      "Source identification only; candidate claims use structured locators and original synthesis.",
  };
};

const commonEvidence = async ({
  rawRelativePath,
  title,
  captureMethod,
  locator,
}) => {
  const absolutePath = path.join(evidenceRoot, rawRelativePath);
  const raw = await readFile(absolutePath);
  return {
    rawPath: path.posix.join(relativeEvidenceRoot, rawRelativePath),
    rawBytes: raw.byteLength,
    rawSha256: sha256(raw),
    captureMethod,
    locator,
    selectedText: boundedIdentification(title),
  };
};

const iCultureSpecs = [
  {
    sourceId: "source-iculture-macos-11",
    version: "11.0",
    file: "macos11.html",
    locator:
      "The macOS Big Sur public-beta timeline lists Public Beta 1, 2, and 3, then calls the September 30 appearance Public Beta 4; that late-cycle divergence is preserved in conflicts.json.",
  },
  {
    sourceId: "source-iculture-macos-12",
    version: "12.0",
    file: "macos12.html",
    locator:
      "The macOS Monterey public-beta timeline explicitly lists Public Beta 1, 2, 4 through 9 and states that Public Beta 3 was skipped.",
  },
  {
    sourceId: "source-iculture-macos-13",
    version: "13.0",
    file: "macos13.html",
    locator:
      "The macOS Ventura public-beta timeline explicitly lists Public Beta 1 through 9 and dates Public Beta 5 to September 10 in its European-local chronology.",
  },
  {
    sourceId: "source-iculture-macos-14",
    version: "14.0",
    file: "macos14.html",
    locator:
      "The macOS Sonoma public-beta timeline explicitly lists Public Beta 1 through 5, with European-local dates retained as date-normalization conflicts.",
  },
  {
    sourceId: "source-iculture-macos-15",
    version: "15.0",
    file: "macos15.html",
    locator:
      "The macOS Sequoia public-beta timeline explicitly lists Public Beta 1 through 6 with dates.",
  },
  {
    sourceId: "source-iculture-macos-26",
    version: "26.0",
    file: "macos26.html",
    locator:
      "The macOS Tahoe public-beta timeline explicitly lists the official Public Beta 1 appearance and Public Beta 2 through 6; it does not preserve the accidental July 21 appearance.",
  },
];

const apiPostSpecs = [
  ["source-9to5-macos-11-pb1", 2020, 660533],
  ["source-9to5-macos-11-pb2", 2020, 663275],
  ["source-9to5-macos-12-pb2", 2021, 737972],
  ["source-9to5-macos-12-pb4", 2021, 740626],
  ["source-9to5-macos-12-pb5", 2021, 744313],
  ["source-9to5-macos-12-pb6", 2021, 745161],
  ["source-9to5-macos-13-pb1", 2022, 818823],
  ["source-9to5-macos-14-pb1", 2023, 896319],
  ["source-9to5-macos-14-pb2", 2023, 899397],
  ["source-9to5-macos-14-pb3", 2023, 901059],
  ["source-9to5-macos-15-pb2", 2024, 959900],
  ["source-9to5-macos-15-pb3", 2024, 961498],
  ["source-9to5-macos-26-pb2", 2025, 1013009],
  ["source-9to5-macos-26-pb3", 2025, 1013936],
  ["source-9to5-macos-26-pb4", 2025, 1014616],
  ["source-9to5-macos-26-pb5", 2025, 1015625],
  ["source-9to5-macos-26-pb6", 2025, 1016605],
].map(([sourceId, year, postId]) => ({sourceId, year, postId}));

const archiveSpecs = [
  {
    sourceId: "source-mr-macos-11-pb3",
    file: "2020-09.html",
    date: "2020-09-08",
    title:
      "Apple Seeds New Public Beta of macOS Big Sur to Public Beta Testers",
  },
  {
    sourceId: "source-mr-macos-12-pb1",
    file: "2021-07.html",
    date: "2021-07-01",
    title: "Apple Releases First Public Beta of macOS 12 Monterey",
  },
  {
    sourceId: "source-mr-macos-12-pb7",
    file: "2021-09.html",
    date: "2021-09-22",
    title:
      "Apple Seeds Seventh Beta of macOS Monterey to Developers [Update: Public Beta Available]",
  },
  {
    sourceId: "source-mr-macos-12-pb8",
    file: "2021-09.html",
    date: "2021-09-29",
    title: "Apple Releases New macOS 12 Monterey Public Beta",
  },
  {
    sourceId: "source-mr-macos-13-pb2",
    file: "2022-07.html",
    date: "2022-07-28",
    title: "Apple Seeds Second Public Beta of macOS 13 Ventura",
  },
  {
    sourceId: "source-mr-macos-13-pb3",
    file: "2022-08.html",
    date: "2022-08-09",
    title: "Apple Seeds Third Public Beta of macOS 13 Ventura",
  },
  {
    sourceId: "source-mr-macos-13-pb4",
    file: "2022-08.html",
    date: "2022-08-26",
    title: "Apple Seeds Fourth Public Beta of macOS 13 Ventura",
  },
  {
    sourceId: "source-mr-macos-13-pb6",
    file: "2022-09.html",
    date: "2022-09-21",
    title: "Apple Seeds Sixth Public Beta of macOS 13 Ventura",
  },
  {
    sourceId: "source-mr-macos-13-pb7",
    file: "2022-09.html",
    date: "2022-09-28",
    title: "Apple Seeds Seventh Public Beta of macOS 13 Ventura",
  },
  {
    sourceId: "source-mr-macos-15-pb1",
    file: "2024-07.html",
    date: "2024-07-15",
    title:
      "Apple Releases First macOS Sequoia Public Beta With iPhone Mirroring and More",
  },
];

const directSpecs = [
  {
    sourceId: "source-mr-bigsur-pb4",
    file: "mr-bigsur-beta8.html",
    publisher: "MacRumors",
    family: "MacRumors",
    locator:
      "JSON-LD datePublished and the same-day article update stating that the public beta became available on September 22.",
  },
  {
    sourceId: "source-mr-bigsur-pb5",
    file: "mr-bigsur-beta9.html",
    publisher: "MacRumors",
    family: "MacRumors",
    locator:
      "JSON-LD datePublished, headline, and lead record a new macOS Big Sur public-beta appearance on September 30.",
  },
  {
    sourceId: "source-mr-bigsur-pb6",
    file: "mr-bigsur-beta10.html",
    publisher: "MacRumors",
    family: "MacRumors",
    locator:
      "The retained article update says, “Update October 15,” followed by public-beta-program availability.",
  },
  {
    sourceId: "source-osxd-bigsur-pb6",
    file: "osxd-bigsur-beta10.html",
    publisher: "OS X Daily",
    family: "OS X Daily",
    locator:
      "Headline, publication metadata, and article body identify the beta 10 payload as available to both developer and public-beta testers.",
  },
  {
    sourceId: "source-applewiki-bigsur",
    file: "applewiki-bigsur-api.json",
    publisher: "Apple Wiki",
    family: "Apple Wiki",
    sourceClass: "retrospectiveChronology",
    title: "macOS Big Sur release history",
    canonicalUrl: "https://apple.fandom.com/wiki/MacOS_Big_Sur",
    publishedAt: null,
    publishedDateObserved: null,
    captureMethod: "http-json",
    locator:
      "MediaWiki parse API wikitext lines for 11.0 beta 8, 9, and 10 explicitly map them to the fourth, fifth, and sixth public betas.",
  },
  {
    sourceId: "source-cisco-bigsur-pb5",
    file: "cisco-anyconnect-4-9.pdf",
    publisher: "Cisco",
    family: "Cisco",
    sourceClass: "contemporaneousVendorReleaseNotes",
    title:
      "Release Notes for Cisco AnyConnect Secure Mobility Client, Release 4.9",
    canonicalUrl:
      "https://www.cisco.com/c/en/us/td/docs/security/vpn_client/anyconnect/anyconnect49/release/notes/release-notes-anyconnect-4-9.pdf",
    publishedAt: null,
    publishedDateObserved: "2020-09-30",
    captureMethod: "http-pdf",
    locator:
      "The retained vendor PDF states that HostScan 4.9.03047 supports macOS 11 beta 9 “or public beta 5,” independently tying that ordinal to the late-September payload.",
  },
  {
    sourceId: "source-9to5-monterey-pb10",
    file: "9to5-monterey-pb10.html",
    publisher: "9to5Mac",
    family: "9to5Mac",
    locator:
      "Publication metadata and the article update state that beta 10 was appearing OTA for public testers as well as developers.",
  },
  {
    sourceId: "source-kobonemi-monterey-pb9",
    file: "kobonemi-monterey-pb9.html",
    publisher: "Kobonemi",
    family: "Kobonemi",
    locator:
      "The retained Japanese article's October 8 update explicitly identifies macOS Monterey Public Beta 9.",
  },
  {
    sourceId: "source-kobonemi-monterey-pb10",
    file: "kobonemi-monterey-pb10.html",
    publisher: "Kobonemi",
    family: "Kobonemi",
    locator:
      "Headline, publication metadata, and article body explicitly identify macOS Monterey Public Beta 10.",
  },
  {
    sourceId: "source-appleinsider-monterey-pb4",
    file: "appleinsider-monterey-pb4.html",
    publisher: "AppleInsider",
    family: "AppleInsider",
    locator:
      "Headline and article lead explicitly identify the fourth public beta of macOS Monterey on July 28.",
  },
  {
    sourceId: "source-osxd-monterey-pb4",
    file: "osxd-monterey-pb4.html",
    publisher: "OS X Daily",
    family: "OS X Daily",
    locator:
      "Headline and article body explicitly identify Public Beta 4 of macOS Monterey on July 28.",
  },
  {
    sourceId: "source-9to5-ventura-pb5",
    file: "9to5-ventura-pb5-original.html",
    publisher: "9to5Mac",
    family: "9to5Mac",
    locator:
      "Publication metadata and the September 9 article body state that the matching update was also available to public-beta testers.",
  },
  {
    sourceId: "source-ithinkdiff-ventura",
    file: "ithinkdiff-ventura.html",
    publisher: "iThinkDifferent",
    family: "iThinkDifferent",
    sourceClass: "contemporaneousLivingChronology",
    locator:
      "The retained update history explicitly lists Ventura Public Beta 2 through 8, including Public Beta 5 on September 10.",
  },
  {
    sourceId: "source-heipg-ventura-pb9",
    file: "heipg-ventura-pb9.html",
    publisher: "Heipg",
    family: "Heipg",
    locator:
      "Retained headline and article metadata explicitly identify macOS Ventura Public Beta 9.",
  },
  {
    sourceId: "source-mrmac-ventura-pb5",
    file: "mrmac-ventura-pb5.html",
    publisher: "Mr. Macintosh",
    family: "Mr. Macintosh",
    locator:
      "The contemporaneous September 9 article says Public Beta 5 “was released then pulled” and its release list marks it not released yet.",
  },
  {
    sourceId: "source-ithinkdiff-sonoma-pb4",
    file: "ithinkdiff-sonoma-pb4.html",
    publisher: "iThinkDifferent",
    family: "iThinkDifferent",
    locator:
      "The retained article's release history distinguishes developer beta 6 from macOS Sonoma Public Beta 4.",
  },
  {
    sourceId: "source-heipg-sonoma-pb4",
    file: "heipg-sonoma-pb4.html",
    publisher: "Heipg",
    family: "Heipg",
    locator:
      "The retained headline explicitly identifies macOS Sonoma Public Beta 4 and developer beta 6.",
  },
  {
    sourceId: "source-heipg-sonoma-pb5",
    file: "heipg-sonoma-pb5.html",
    publisher: "Heipg",
    family: "Heipg",
    locator:
      "The retained headline explicitly identifies macOS Sonoma Public Beta 5 and developer beta 7.",
  },
  {
    sourceId: "source-osxd-sonoma-pb5",
    file: "osxd-sonoma-pb5.html",
    publisher: "OS X Daily",
    family: "OS X Daily",
    locator:
      "Publication metadata and article body identify the August 30 macOS Sonoma beta 7 payload as available to public-beta testers.",
  },
  {
    sourceId: "source-osxd-sonoma-overnumber",
    file: "osxd-sonoma-overnumber.html",
    publisher: "OS X Daily",
    family: "OS X Daily",
    locator:
      "The cross-platform headline calls the August 23 releases Public Beta 5, conflicting with Mac-specific Public Beta 4 sources.",
  },
  {
    sourceId: "source-appleinsider-sonoma-overnumber",
    file: "appleinsider-sonoma-overnumber.html",
    publisher: "AppleInsider",
    family: "AppleInsider",
    locator:
      "The cross-platform headline calls the August 22 releases fifth public betas, conflicting with Mac-specific Public Beta 4 sources.",
  },
  {
    sourceId: "source-9to5-sequoia-pb4",
    file: "9to5-sequoia-pb4.html",
    publisher: "9to5Mac",
    family: "9to5Mac",
    locator:
      "Headline and article body identify public beta 4 and explicitly include the macOS Sequoia companion release.",
  },
  {
    sourceId: "source-9to5-sequoia-pb5",
    file: "9to5-sequoia-pb5.html",
    publisher: "9to5Mac",
    family: "9to5Mac",
    locator:
      "Headline and article lead identify public beta 5 for macOS Sequoia and companion platforms.",
  },
  {
    sourceId: "source-9to5-sequoia-pb6",
    file: "9to5-sequoia-pb6.html",
    publisher: "9to5Mac",
    family: "9to5Mac",
    locator:
      "Headline and article lead identify public beta 6 for macOS Sequoia and companion platforms.",
  },
  {
    sourceId: "source-mr-sequoia-pb4",
    file: "mr-sequoia-beta6.html",
    publisher: "MacRumors",
    family: "MacRumors",
    locator:
      "The same-day article update records public-beta availability for the beta 6 payload on August 12.",
  },
  {
    sourceId: "source-mr-sequoia-pb6",
    file: "mr-sequoia-beta8.html",
    publisher: "MacRumors",
    family: "MacRumors",
    locator:
      "The same-day article update records public-beta availability for the beta 8 payload on August 28.",
  },
  {
    sourceId: "source-osxd-sequoia-pb5",
    file: "osxd-sequoia-pb5.html",
    publisher: "OS X Daily",
    family: "OS X Daily",
    locator:
      "Headline and article body explicitly identify Public Beta 5 of macOS Sequoia.",
  },
  {
    sourceId: "source-mr-tahoe-pb1-accidental",
    file: "mr-tahoe-pb1-accidental.html",
    publisher: "MacRumors",
    family: "MacRumors",
    locator:
      "Headline, publication metadata, and updates record that macOS Tahoe Public Beta 1 appeared for some users on July 21 and was then pulled.",
  },
  {
    sourceId: "source-appleinsider-tahoe-pb1-accidental",
    file: "appleinsider-tahoe-pb1-accidental.html",
    publisher: "AppleInsider",
    family: "AppleInsider",
    locator:
      "Headline and article body independently record the mistaken July 21 macOS Tahoe public-beta distribution and withdrawal.",
  },
  {
    sourceId: "source-mr-tahoe-pb1-official",
    file: "mr-tahoe-pb1-official.html",
    publisher: "MacRumors",
    family: "MacRumors",
    locator:
      "Headline and publication metadata explicitly identify the official first macOS Tahoe public beta on July 24.",
  },
  {
    sourceId: "source-9to5-tahoe-pb1-official",
    file: "9to5-tahoe-pb1-official.html",
    publisher: "9to5Mac",
    family: "9to5Mac",
    locator:
      "Headline, publication metadata, and article body explicitly identify the July 24 official macOS Tahoe 26 public beta.",
  },
  {
    sourceId: "source-mr-tahoe-pb6",
    file: "mr-tahoe-pb6.html",
    publisher: "MacRumors",
    family: "MacRumors",
    locator:
      "Headline and article body identify the sixth public-beta wave and explicitly include macOS Tahoe.",
  },
];

const sources = [];

for (const spec of iCultureSpecs) {
  const rawRelativePath = `iculture/${spec.file}`;
  const html = await readFile(path.join(evidenceRoot, rawRelativePath), "utf8");
  const title =
    firstMatch(html, [/<title[^>]*>([\s\S]*?)<\/title>/i]) ??
    `iCulture macOS ${spec.version} beta timeline`;
  const canonicalUrl = firstMatch(html, [
    /<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']+)/i,
    /<link[^>]+href=["']([^"']+)["'][^>]+rel=["']canonical["']/i,
    /property=["']og:url["'][^>]+content=["']([^"']+)/i,
  ]);
  const publishedAt = firstMatch(html, [
    /property=["']article:published_time["'][^>]+content=["']([^"']+)/i,
    /"datePublished"\s*:\s*"([^"]+)/i,
  ]);
  sources.push({
    sourceId: spec.sourceId,
    canonicalUrl,
    title,
    publisher: "iCulture",
    author: "Redactie iCulture.nl",
    publishedAt,
    publishedDateObserved: publishedAt?.slice(0, 10) ?? null,
    publicationDatePrecision: "date",
    accessedAt: researchCutoff,
    archiveUrl: null,
    status: "active",
    sourceClass: "contemporaneousLivingChronology",
    roles: [
      "publicAvailability",
      "publicOrdinal",
      "appearanceDate",
      "channelIdentity",
    ],
    evidence: await commonEvidence({
      rawRelativePath,
      title,
      captureMethod: "http-html",
      locator: spec.locator,
    }),
    lineage: {
      publisherFamily: "iCulture",
      independentForCorroboration: true,
      notes:
        "One editorial lineage; the living timeline is treated as contemporary chronology and its known disagreements are not silently normalized.",
    },
  });
}

for (const spec of apiPostSpecs) {
  const rawRelativePath = `9to5-api/${spec.year}-public-beta.json`;
  const posts = JSON.parse(
    await readFile(path.join(evidenceRoot, rawRelativePath), "utf8"),
  );
  const post = posts.find((item) => item.id === spec.postId);
  if (!post) {
    throw new Error(`Missing 9to5Mac post ${spec.postId} in ${rawRelativePath}`);
  }
  const title = decodeHtml(post.title.rendered);
  const publishedAt = post.date_gmt
    ? `${post.date_gmt}Z`
    : post.date ?? null;
  sources.push({
    sourceId: spec.sourceId,
    canonicalUrl: post.link,
    title,
    publisher: "9to5Mac",
    author: null,
    publishedAt,
    publishedDateObserved: post.date?.slice(0, 10) ?? null,
    publicationDatePrecision: "timestamp",
    accessedAt: researchCutoff,
    archiveUrl: null,
    status: "active",
    sourceClass: "contemporaneousSecondary",
    roles: [
      "publicAvailability",
      "publicOrdinal",
      "appearanceDate",
      "channelIdentity",
    ],
    evidence: await commonEvidence({
      rawRelativePath,
      title,
      captureMethod: "wordpress-rest-json",
      locator: `WordPress REST post ${spec.postId}; retained title, timestamp, URL, and article body support the candidate-specific public-beta claim.`,
    }),
    lineage: {
      publisherFamily: "9to5Mac",
      independentForCorroboration: true,
      notes:
        "Distinct editorial lineage; multiple posts or a shared API response count only once per candidate.",
    },
  });
}

for (const spec of archiveSpecs) {
  const rawRelativePath = `macrumors-archives/${spec.file}`;
  sources.push({
    sourceId: spec.sourceId,
    canonicalUrl: `https://www.macrumors.com/${spec.file.replace(".html", "")}/`,
    title: spec.title,
    publisher: "MacRumors",
    author: "Juli Clover",
    publishedAt: null,
    publishedDateObserved: spec.date,
    publicationDatePrecision: "date",
    accessedAt: researchCutoff,
    archiveUrl: null,
    status: "active",
    sourceClass: "contemporaneousSecondary",
    roles: [
      "publicAvailability",
      "publicOrdinal",
      "appearanceDate",
      "channelIdentity",
    ],
    evidence: await commonEvidence({
      rawRelativePath,
      title: spec.title,
      captureMethod: "http-html",
      locator: `Monthly archive entry with the exact headline “${spec.title}” and its candidate-date byline.`,
    }),
    lineage: {
      publisherFamily: "MacRumors",
      independentForCorroboration: true,
      notes:
        "Distinct editorial lineage; multiple archive entries or direct pages count only once per candidate.",
    },
  });
}

for (const spec of directSpecs) {
  const rawRelativePath = `direct-articles/${spec.file}`;
  const raw = await readFile(path.join(evidenceRoot, rawRelativePath));
  const html = spec.file.endsWith(".html") ? raw.toString("utf8") : "";
  const title =
    spec.title ??
    firstMatch(html, [/<title[^>]*>([\s\S]*?)<\/title>/i]) ??
    spec.sourceId;
  const canonicalUrl =
    spec.canonicalUrl ??
    firstMatch(html, [
      /<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']+)/i,
      /<link[^>]+href=["']([^"']+)["'][^>]+rel=["']canonical["']/i,
      /property=["']og:url["'][^>]+content=["']([^"']+)/i,
      /"url"\s*:\s*"([^"]+)/i,
    ]);
  const publishedAt =
    spec.publishedAt === null
      ? null
      : (spec.publishedAt ??
        firstMatch(html, [
          /property=["']article:published_time["'][^>]+content=["']([^"']+)/i,
          /"datePublished"\s*:\s*"([^"]+)/i,
          /<time[^>]+datetime=["']([^"']+)/i,
        ]));
  const publishedDateObserved =
    spec.publishedDateObserved ??
    publishedAt?.slice(0, 10) ??
    null;
  sources.push({
    sourceId: spec.sourceId,
    canonicalUrl,
    title,
    publisher: spec.publisher,
    author:
      firstMatch(html, [
        /"author"\s*:\s*\{[^}]*"name"\s*:\s*"([^"]+)/i,
        /"author"\s*:\s*"([^"]+)/i,
      ]) ?? null,
    publishedAt,
    publishedDateObserved,
    publicationDatePrecision: publishedAt ? "timestamp" : "date",
    accessedAt: researchCutoff,
    archiveUrl: null,
    status: "active",
    sourceClass: spec.sourceClass ?? "contemporaneousSecondary",
    roles: [
      "publicAvailability",
      "publicOrdinal",
      "appearanceDate",
      "channelIdentity",
      "conflictDocumentation",
    ],
    evidence: await commonEvidence({
      rawRelativePath,
      title,
      captureMethod:
        spec.captureMethod ??
        (spec.file.endsWith(".json")
          ? "http-json"
          : spec.file.endsWith(".pdf")
            ? "http-pdf"
            : "http-html"),
      locator: spec.locator,
    }),
    lineage: {
      publisherFamily: spec.family,
      independentForCorroboration: true,
      notes:
        "Distinct publisher lineage; repeated pages from this publisher do not create additional independence.",
    },
  });
}

sources.sort((left, right) => left.sourceId.localeCompare(right.sourceId));
const sourceById = new Map(
  sources.map((source) => [source.sourceId, source]),
);

const evidenceByCandidate = {
  "11.0:1": ["source-iculture-macos-11", "source-9to5-macos-11-pb1"],
  "11.0:2": ["source-iculture-macos-11", "source-9to5-macos-11-pb2"],
  "11.0:3": ["source-iculture-macos-11", "source-mr-macos-11-pb3"],
  "11.0:4": [
    "source-mr-bigsur-pb4",
    "source-applewiki-bigsur",
    "source-iculture-macos-11",
  ],
  "11.0:5": [
    "source-mr-bigsur-pb5",
    "source-cisco-bigsur-pb5",
    "source-applewiki-bigsur",
  ],
  "11.0:6": [
    "source-mr-bigsur-pb6",
    "source-osxd-bigsur-pb6",
    "source-applewiki-bigsur",
  ],
  "12.0:1": ["source-iculture-macos-12", "source-mr-macos-12-pb1"],
  "12.0:2": ["source-iculture-macos-12", "source-9to5-macos-12-pb2"],
  "12.0:4": [
    "source-iculture-macos-12",
    "source-appleinsider-monterey-pb4",
    "source-osxd-monterey-pb4",
  ],
  "12.0:5": ["source-iculture-macos-12", "source-9to5-macos-12-pb5"],
  "12.0:6": ["source-iculture-macos-12", "source-9to5-macos-12-pb6"],
  "12.0:7": ["source-iculture-macos-12", "source-mr-macos-12-pb7"],
  "12.0:8": ["source-iculture-macos-12", "source-mr-macos-12-pb8"],
  "12.0:9": ["source-iculture-macos-12", "source-kobonemi-monterey-pb9"],
  "12.0:10": [
    "source-9to5-monterey-pb10",
    "source-kobonemi-monterey-pb10",
    "source-iculture-macos-12",
  ],
  "13.0:1": ["source-iculture-macos-13", "source-9to5-macos-13-pb1"],
  "13.0:2": ["source-iculture-macos-13", "source-mr-macos-13-pb2"],
  "13.0:3": ["source-iculture-macos-13", "source-mr-macos-13-pb3"],
  "13.0:4": [
    "source-iculture-macos-13",
    "source-mr-macos-13-pb4",
    "source-ithinkdiff-ventura",
  ],
  "13.0:5": [
    "source-9to5-ventura-pb5",
    "source-ithinkdiff-ventura",
    "source-iculture-macos-13",
    "source-mrmac-ventura-pb5",
  ],
  "13.0:6": [
    "source-iculture-macos-13",
    "source-mr-macos-13-pb6",
    "source-ithinkdiff-ventura",
  ],
  "13.0:7": [
    "source-iculture-macos-13",
    "source-mr-macos-13-pb7",
    "source-ithinkdiff-ventura",
  ],
  "13.0:8": ["source-iculture-macos-13", "source-ithinkdiff-ventura"],
  "13.0:9": ["source-iculture-macos-13", "source-heipg-ventura-pb9"],
  "14.0:1": ["source-iculture-macos-14", "source-9to5-macos-14-pb1"],
  "14.0:2": ["source-iculture-macos-14", "source-9to5-macos-14-pb2"],
  "14.0:3": ["source-iculture-macos-14", "source-9to5-macos-14-pb3"],
  "14.0:4": [
    "source-ithinkdiff-sonoma-pb4",
    "source-heipg-sonoma-pb4",
    "source-appleinsider-sonoma-overnumber",
    "source-osxd-sonoma-overnumber",
  ],
  "14.0:5": [
    "source-iculture-macos-14",
    "source-heipg-sonoma-pb5",
    "source-osxd-sonoma-pb5",
  ],
  "15.0:1": ["source-iculture-macos-15", "source-mr-macos-15-pb1"],
  "15.0:2": ["source-iculture-macos-15", "source-9to5-macos-15-pb2"],
  "15.0:3": ["source-iculture-macos-15", "source-9to5-macos-15-pb3"],
  "15.0:4": [
    "source-iculture-macos-15",
    "source-9to5-sequoia-pb4",
    "source-mr-sequoia-pb4",
  ],
  "15.0:5": [
    "source-iculture-macos-15",
    "source-9to5-sequoia-pb5",
    "source-osxd-sequoia-pb5",
  ],
  "15.0:6": [
    "source-iculture-macos-15",
    "source-9to5-sequoia-pb6",
    "source-mr-sequoia-pb6",
  ],
  "26.0:1": [
    "source-mr-tahoe-pb1-accidental",
    "source-appleinsider-tahoe-pb1-accidental",
    "source-mr-tahoe-pb1-official",
    "source-9to5-tahoe-pb1-official",
    "source-iculture-macos-26",
  ],
  "26.0:2": ["source-iculture-macos-26", "source-9to5-macos-26-pb2"],
  "26.0:3": ["source-iculture-macos-26", "source-9to5-macos-26-pb3"],
  "26.0:4": ["source-iculture-macos-26", "source-9to5-macos-26-pb4"],
  "26.0:5": ["source-iculture-macos-26", "source-9to5-macos-26-pb5"],
  "26.0:6": [
    "source-iculture-macos-26",
    "source-9to5-macos-26-pb6",
    "source-mr-tahoe-pb6",
  ],
};

const conflictCandidateKeys = new Set([
  "11.0:4",
  "11.0:5",
  "11.0:6",
  "12.0:10",
  "13.0:5",
  "14.0:4",
  "14.0:5",
  "26.0:1",
]);
const replacedCandidateKeys = new Set(["13.0:5", "26.0:1"]);

const productionRaw = await readFile(
  path.join(evidenceRoot, "production-snapshot.json"),
);
const production = JSON.parse(productionRaw);
const productionCheckByKey = new Map(
  production.exactChecks.map((check) => [
    candidateKey(check.version, check.sequence),
    check,
  ]),
);

const candidates = [];
for (const [version, appearances] of Object.entries(cycles)) {
  for (const [sequence, appearanceDate] of appearances) {
    const key = candidateKey(version, sequence);
    const sourceIds = evidenceByCandidate[key];
    if (!sourceIds?.length) {
      throw new Error(`No evidence mapping for ${key}`);
    }
    for (const sourceId of sourceIds) {
      if (!sourceById.has(sourceId)) {
        throw new Error(`Unknown source ${sourceId} for ${key}`);
      }
    }
    const productionCheck = productionCheckByKey.get(key);
    if (!productionCheck) {
      throw new Error(`No production exact check for ${key}`);
    }
    const identityConflict = conflictCandidateKeys.has(key);
    const lifecycleConflict = replacedCandidateKeys.has(key);
    candidates.push({
      candidateId: candidateIdFor(version, sequence),
      originCohortId: cohortId,
      platform: "macOS",
      platformId: "platform-macos",
      version,
      releaseVersionId: versionIds[version],
      proposedIdentity: {
        label: `Public Beta ${sequence}`,
        routeAlias: `public-beta-${sequence}`,
        channel: "publicBeta",
        appearanceDate,
        sequence,
        isRevision: false,
        availabilityState: lifecycleConflict ? "replaced" : "available",
        closesReleaseCycle: false,
      },
      ordinalBasis: "explicit",
      candidateStatus: "needsEvidenceReview",
      identityStatus: identityConflict ? "conflict" : "confirmed",
      evidenceState: "corroborated",
      productionReconciliation: {
        status: "confirmedMissing",
        queriedAt: production.capturedAt,
        matchBasis:
          "The read-only published production query found zero macOS publicBeta events globally and zero exact {releaseVersionId, channel, routeAlias} matches; the releaseVersion parent exists.",
        exactIdentityMatches: productionCheck.exactIdentityMatches,
      },
      evidenceRefs: sourceIds.map((sourceId) => ({
        kind: "packetSource",
        packetPath: `${relativePacketDir}/sources.json`,
        sourceId,
        locator: sourceById.get(sourceId).evidence.locator,
        supports: identityConflict
          ? `Evidence or explicit conflict context for macOS ${version} Public Beta ${sequence}, including the public audience, candidate date, and disputed ordinal or lifecycle where noted.`
          : `Independent evidence for macOS ${version} Public Beta ${sequence}, including the public audience, displayed ordinal, and appearance date.`,
      })),
      buildEvidenceStatus: "absent",
      contentDisposition: "timelineOnly",
      blockers: [
        "Independent human chronology review has not yet occurred.",
        ...(identityConflict
          ? ["Conflicting chronology or local-date evidence requires human adjudication."]
          : []),
        ...(lifecycleConflict
          ? ["The same-label return requires a lifecycle-modeling decision; no duplicate route may be created."]
          : []),
      ],
      review: {
        required: true,
        reviewer: null,
        reviewedAt: null,
        notes:
          "The research agent reproduced source bytes, hashes, locators, and production checks but cannot count as an independent reviewer.",
      },
      flags: {
        sanityMutationAllowed: false,
        publicationEligible: false,
      },
    });
  }
}

const exceptionalAppearances = [
  {
    appearanceId:
      "exceptional:apple:macos:13.0:public-beta-5-return",
    version: "13.0",
    releaseVersionId: versionIds["13.0"],
    appearanceDate: "2022-09-10",
    displayedLabel: "Public Beta 5",
    routeAlias: "public-beta-5",
    relationshipToCandidate: candidateIdFor("13.0", 5),
    lifecycle: "returnAfterWithdrawal",
    evidenceState: "corroboratedWithOneDayPublisherConflict",
    evidenceRefs: [
      "source-iculture-macos-13",
      "source-ithinkdiff-ventura",
      "source-mrmac-ventura-pb5",
    ],
    modelingDisposition:
      "Preserve as a same-label reappearance. Do not create a second public-beta-5 route and do not assert isRevision without a defined lifecycle rule.",
  },
  {
    appearanceId:
      "exceptional:apple:macos:26.0:public-beta-1-official-return",
    version: "26.0",
    releaseVersionId: versionIds["26.0"],
    appearanceDate: "2025-07-24",
    displayedLabel: "Public Beta 1",
    routeAlias: "public-beta-1",
    relationshipToCandidate: candidateIdFor("26.0", 1),
    lifecycle: "officialReturnAfterAccidentalWithdrawal",
    evidenceState: "corroborated",
    evidenceRefs: [
      "source-mr-tahoe-pb1-official",
      "source-9to5-tahoe-pb1-official",
      "source-iculture-macos-26",
    ],
    modelingDisposition:
      "Preserve as the official same-label return. Do not create a second public-beta-1 route.",
  },
];

const notProposed = [
  {
    recordId: "not-proposed:apple:macos:12.0:public-beta-3-skipped",
    version: "12.0",
    displayedLabel: "Public Beta 3",
    appearanceDate: null,
    disposition: "doNotCreateSkippedOrdinal",
    evidenceState: "corroborated",
    evidenceRefs: [
      "source-iculture-macos-12",
      "source-appleinsider-monterey-pb4",
      "source-osxd-monterey-pb4",
    ],
    reasons: [
      "The retained living chronology explicitly states that Apple skipped Public Beta 3.",
      "Two independent contemporary Public Beta 4 reports establish the jump without requiring a fabricated Public Beta 3 date.",
    ],
    flags: {
      sanityMutationAllowed: false,
      publicationEligible: false,
    },
  },
  {
    recordId:
      "not-proposed:apple:macos:13.0:public-beta-5-return",
    version: "13.0",
    displayedLabel: "Public Beta 5",
    appearanceDate: "2022-09-10",
    disposition: "duplicateDisplayedIdentityNeedsModelingDecision",
    evidenceState: "corroboratedWithDateConflict",
    evidenceRefs: [
      "source-mrmac-ventura-pb5",
      "source-iculture-macos-13",
      "source-ithinkdiff-ventura",
    ],
    reasons: [
      "A September 9 public appearance was released and then pulled.",
      "Two independent living chronologies record Public Beta 5 on September 10, establishing a same-label return.",
      "A second public-beta-5 route would collide with the original candidate identity.",
    ],
    flags: {
      sanityMutationAllowed: false,
      publicationEligible: false,
    },
  },
  {
    recordId:
      "not-proposed:apple:macos:14.0:apparent-public-beta-6",
    version: "14.0",
    displayedLabel: "Apparent Public Beta 6",
    appearanceDate: "2023-08-30",
    disposition: "doNotCreateCrossPlatformOvernumber",
    evidenceState: "disprovedIdentity",
    evidenceRefs: [
      "source-appleinsider-sonoma-overnumber",
      "source-osxd-sonoma-overnumber",
      "source-heipg-sonoma-pb4",
      "source-heipg-sonoma-pb5",
      "source-osxd-sonoma-pb5",
    ],
    reasons: [
      "Cross-platform reports over-number the August 22/23 macOS appearance as fifth.",
      "Mac-specific contemporary sources identify that appearance as Public Beta 4 and the August 30/31 appearance as Public Beta 5.",
      "No retained reliable evidence establishes a separate macOS Sonoma Public Beta 6.",
    ],
    flags: {
      sanityMutationAllowed: false,
      publicationEligible: false,
    },
  },
  {
    recordId:
      "not-proposed:apple:macos:26.0:public-beta-1-official-return",
    version: "26.0",
    displayedLabel: "Public Beta 1",
    appearanceDate: "2025-07-24",
    disposition: "duplicateDisplayedIdentityNeedsModelingDecision",
    evidenceState: "corroborated",
    evidenceRefs: [
      "source-mr-tahoe-pb1-accidental",
      "source-appleinsider-tahoe-pb1-accidental",
      "source-mr-tahoe-pb1-official",
      "source-9to5-tahoe-pb1-official",
    ],
    reasons: [
      "The Public Beta 1 identity first appeared accidentally on July 21 and was withdrawn.",
      "The official July 24 distribution retained the same Public Beta 1 identity.",
      "A second public-beta-1 route would collide with the original candidate identity.",
    ],
    flags: {
      sanityMutationAllowed: false,
      publicationEligible: false,
    },
  },
];

const safety = {
  sanityMutationAllowed: false,
  publicationAuthorized: false,
  stableEventIdCreationAllowed: false,
  note:
    "Research-only packet. Validation cannot authorize Sanity mutation, stable ID creation, or publication.",
};

const assignment = {
  formatVersion: 1,
  batchId,
  createdAt: generatedAt,
  createdBy: "research-agent",
  researchCutoff,
  vendor: "Apple",
  platform: "macOS",
  scopeRule:
    "Numbered public-beta appearances before the stable release of macOS major versions 11.0, 12.0, 13.0, 14.0, 15.0, and 26.0. Developer-only seeds, RCs, minor-version betas, and inferred ordinals are excluded.",
  calendarNormalization:
    "Canonical appearance dates use the Apple/Pacific newsroom day when available. Publisher-local next-day dates remain explicit conflicts and are never silently converted into additional appearances.",
  numberedTargetCount: candidates.length,
  exceptionalAppearanceCount: exceptionalAppearances.length,
  observedAppearanceCount:
    candidates.length + exceptionalAppearances.length,
  numberedTargets: candidates.map((candidate) => ({
    candidateId: candidate.candidateId,
    version: candidate.version,
    releaseVersionId: candidate.releaseVersionId,
    appearanceDate: candidate.proposedIdentity.appearanceDate,
    displayedLabel: candidate.proposedIdentity.label,
    routeAlias: candidate.proposedIdentity.routeAlias,
    availabilityState: candidate.proposedIdentity.availabilityState,
    identityStatus: candidate.identityStatus,
  })),
  exceptionalAppearances,
  notProposedCount: notProposed.length,
  safety,
};

const byVersion = Object.fromEntries(
  Object.entries(cycles).map(([version, appearances]) => [
    version,
    appearances.length,
  ]),
);

const candidatesDocument = {
  formatVersion: 1,
  batchId,
  researchCutoff,
  candidateCount: candidates.length,
  existingMatches: [],
  summary: {
    byVersion,
    byCandidateStatus: {needsEvidenceReview: candidates.length},
    byEvidenceState: {corroborated: candidates.length},
    byIdentityStatus: {
      confirmed:
        candidates.length -
        candidates.filter((candidate) => candidate.identityStatus === "conflict")
          .length,
      conflict: candidates.filter(
        (candidate) => candidate.identityStatus === "conflict",
      ).length,
    },
    numberedRouteCount: candidates.length,
    exceptionalAppearanceCount: exceptionalAppearances.length,
    observedAppearanceCount:
      candidates.length + exceptionalAppearances.length,
    notProposedCount: notProposed.length,
    buildsIncluded: 0,
    importantQualification:
      "The register preserves 41 unique numbered routes and two same-label lifecycle reappearances. Eight candidates retain explicit identity or lifecycle conflicts. No candidate is chronology-approved or publication-eligible.",
  },
  candidates,
  exceptionalAppearances,
  notProposed,
  nextEvidenceWaves: [
    {
      waveId: "independent-human-chronology-review",
      scope:
        "Human adjudication of all 41 routes, with special attention to Big Sur late-cycle numbering and same-label lifecycle returns.",
      artifactPaths: [
        `${relativePacketDir}/sources.json`,
        `${relativePacketDir}/conflicts.json`,
        `${relativePacketDir}/report.md`,
      ],
      estimatedCandidateCount: 41,
      countStatus: "confirmed",
      requiredNextStep:
        "An independent reviewer must sign off or reject each route before any mutation proposal is prepared.",
    },
  ],
  safety,
};

const conflicts = [
  {
    conflictId: "conflict-macos11-late-public-ordinal",
    versions: ["11.0"],
    candidateIds: [4, 5, 6].map((sequence) =>
      candidateIdFor("11.0", sequence),
    ),
    type: "ordinalChronologyDivergence",
    canonicalDecision:
      "Preserve all three actual public appearances as Public Beta 4, 5, and 6, but freeze them at identityStatus=conflict.",
    evidence:
      "MacRumors records public availability on September 22, September 30, and October 15. Apple Wiki maps those appearances to the fourth, fifth, and sixth public betas, and Cisco independently maps beta 9 to public beta 5. iCulture and iMore-style living chronologies omit September 22 and call September 30 Public Beta 4.",
    sourceIds: [
      "source-mr-bigsur-pb4",
      "source-mr-bigsur-pb5",
      "source-mr-bigsur-pb6",
      "source-applewiki-bigsur",
      "source-cisco-bigsur-pb5",
      "source-iculture-macos-11",
    ],
    reviewRequired: true,
  },
  {
    conflictId: "conflict-macos11-pb6-date",
    versions: ["11.0"],
    candidateIds: [candidateIdFor("11.0", 6)],
    type: "calendarNormalization",
    canonicalDecision:
      "Use October 15, 2020, the explicit Pacific-dated MacRumors public-program update; preserve Apple Wiki's October 16 date as a conflict.",
    evidence:
      "The contemporary article explicitly labels its public-program update October 15; the retrospective chronology records October 16.",
    sourceIds: [
      "source-mr-bigsur-pb6",
      "source-applewiki-bigsur",
      "source-osxd-bigsur-pb6",
    ],
    reviewRequired: true,
  },
  {
    conflictId: "conflict-macos12-skipped-pb3",
    versions: ["12.0"],
    candidateIds: [candidateIdFor("12.0", 4)],
    type: "skippedOrdinal",
    canonicalDecision:
      "Do not create Public Beta 3. Preserve Public Beta 4 as the next actual appearance after Public Beta 2.",
    evidence:
      "iCulture explicitly states that Apple skipped Public Beta 3; AppleInsider and OS X Daily independently identify the July 28 release as Public Beta 4.",
    sourceIds: [
      "source-iculture-macos-12",
      "source-appleinsider-monterey-pb4",
      "source-osxd-monterey-pb4",
    ],
    reviewRequired: true,
  },
  {
    conflictId: "conflict-macos12-pb10",
    versions: ["12.0"],
    candidateIds: [candidateIdFor("12.0", 10)],
    type: "lateOrdinalDivergence",
    canonicalDecision:
      "Retain Public Beta 10 on October 13 Pacific, but freeze it at identityStatus=conflict.",
    evidence:
      "9to5Mac reports beta 10 availability to public testers and Kobonemi explicitly labels macOS Monterey Public Beta 10; iCulture's living chronology ends at Public Beta 9.",
    sourceIds: [
      "source-9to5-monterey-pb10",
      "source-kobonemi-monterey-pb10",
      "source-iculture-macos-12",
    ],
    reviewRequired: true,
  },
  {
    conflictId: "conflict-macos13-pb5-lifecycle",
    versions: ["13.0"],
    candidateIds: [candidateIdFor("13.0", 5)],
    type: "withdrawalAndSameLabelReturn",
    canonicalDecision:
      "Use September 9 for the unique route candidate with availabilityState=replaced; preserve September 10 as a separate same-label return without a duplicate route.",
    evidence:
      "9to5Mac records public-tester availability on September 9; Mr. Macintosh says Public Beta 5 was released then pulled. iCulture and iThinkDifferent record Public Beta 5 on September 10.",
    sourceIds: [
      "source-9to5-ventura-pb5",
      "source-mrmac-ventura-pb5",
      "source-iculture-macos-13",
      "source-ithinkdiff-ventura",
    ],
    reviewRequired: true,
  },
  {
    conflictId: "conflict-macos14-pb4-overnumber",
    versions: ["14.0"],
    candidateIds: [candidateIdFor("14.0", 4)],
    type: "crossPlatformOrdinalContamination",
    canonicalDecision:
      "Use Public Beta 4 on August 22 Pacific. Do not carry the mobile-platform fifth-public-beta ordinal onto macOS.",
    evidence:
      "Mac-specific iThinkDifferent and Heipg sources identify Public Beta 4. Cross-platform AppleInsider and OS X Daily headlines call the wave fifth public betas.",
    sourceIds: [
      "source-ithinkdiff-sonoma-pb4",
      "source-heipg-sonoma-pb4",
      "source-appleinsider-sonoma-overnumber",
      "source-osxd-sonoma-overnumber",
    ],
    reviewRequired: true,
  },
  {
    conflictId: "conflict-macos14-pb5-date-and-ordinal",
    versions: ["14.0"],
    candidateIds: [candidateIdFor("14.0", 5)],
    type: "calendarNormalizationAndOvernumber",
    canonicalDecision:
      "Use Public Beta 5 on August 30 Pacific; retain August 31 European-local dates and reject an apparent Public Beta 6.",
    evidence:
      "Heipg explicitly labels Public Beta 5, while OS X Daily records the August 30 Pacific release. iCulture and Heipg display August 31 locally. Earlier cross-platform over-numbering would incorrectly imply Public Beta 6.",
    sourceIds: [
      "source-heipg-sonoma-pb5",
      "source-osxd-sonoma-pb5",
      "source-iculture-macos-14",
      "source-appleinsider-sonoma-overnumber",
    ],
    reviewRequired: true,
  },
  {
    conflictId: "conflict-macos26-pb1-lifecycle",
    versions: ["26.0"],
    candidateIds: [candidateIdFor("26.0", 1)],
    type: "accidentalWithdrawalAndOfficialReturn",
    canonicalDecision:
      "Use July 21 for the unique route candidate with availabilityState=replaced; preserve the official July 24 same-label return as an exceptional appearance.",
    evidence:
      "MacRumors and AppleInsider independently record accidental July 21 public availability and withdrawal. MacRumors, 9to5Mac, and iCulture independently record the official July 24 distribution.",
    sourceIds: [
      "source-mr-tahoe-pb1-accidental",
      "source-appleinsider-tahoe-pb1-accidental",
      "source-mr-tahoe-pb1-official",
      "source-9to5-tahoe-pb1-official",
      "source-iculture-macos-26",
    ],
    reviewRequired: true,
  },
  {
    conflictId: "conflict-macos26-pb5-date",
    versions: ["26.0"],
    candidateIds: [candidateIdFor("26.0", 5)],
    type: "calendarNormalization",
    canonicalDecision:
      "Use August 25 Pacific. Preserve iCulture's August 26 European-local date as the same appearance.",
    evidence:
      "9to5Mac published the Mac-specific release on August 25 Pacific; iCulture's European-local chronology displays August 26.",
    sourceIds: [
      "source-9to5-macos-26-pb5",
      "source-iculture-macos-26",
    ],
    reviewRequired: true,
  },
];

const conflictsDocument = {
  formatVersion: 1,
  batchId,
  researchCutoff,
  conflictCount: conflicts.length,
  conflicts,
  resolutionRules: [
    "Never derive a public ordinal from a developer seed number.",
    "Use a Mac-specific explicit ordinal over a cross-platform mobile-wave ordinal, while preserving the disagreement.",
    "Use the Pacific newsroom day where a timestamp or explicit Pacific update exists; retain local next-day dates as conflicts.",
    "A withdrawal and same-label return produce one unique route candidate plus an exceptional appearance, not duplicate route aliases.",
  ],
  safety,
};

const review = {
  formatVersion: 1,
  batchId,
  reviewedAt: generatedAt,
  reviewType: "researcherSelfReview",
  independentOfResearcher: false,
  verdict: "selfCheckPassedPendingIndependentReview",
  scope:
    "Mechanical completeness, evidence provenance, source-lineage independence, production reconciliation, and safety only.",
  checks: [
    {
      check: "routeCount",
      result: "pass",
      detail: "41 unique numbered routes are present.",
    },
    {
      check: "observedAppearanceCount",
      result: "pass",
      detail:
        "Two same-label returns are preserved separately, yielding 43 observed appearances.",
    },
    {
      check: "sourceProvenance",
      result: "pass",
      detail:
        "Every cited source has retained bytes, SHA-256, byte count, bounded identification text, a claim locator, and publisher lineage.",
    },
    {
      check: "independentCorroboration",
      result: "passWithDocumentedConflicts",
      detail:
        "Every candidate has at least two independent publisher lineages. Big Sur late ordinals remain conflict-tagged because contemporary chronologies disagree.",
    },
    {
      check: "productionReadOnly",
      result: "pass",
      detail:
        "The published production query was read-only and found zero exact matches.",
    },
    {
      check: "authorization",
      result: "pass",
      detail:
        "All mutation, publication, and stable-ID flags remain false.",
    },
  ],
  findings: [
    "The researcher is not an independent reviewer and has not approved any route.",
    "Eight candidates remain identityStatus=conflict pending human chronology review.",
    "No build values are proposed.",
    "No stable production IDs are created.",
  ],
  candidateIds: candidates.map((candidate) => candidate.candidateId),
  authorization: {
    chronologyApproved: false,
    sanityMutationAllowed: false,
    publicationAuthorized: false,
    stableEventIdCreationAllowed: false,
  },
  requiredNextStep:
    "Independent human review must adjudicate each candidate and all conflicts before any mutation proposal.",
  safety,
};

const chronologyRows = Object.entries(cycles)
  .map(([version, appearances]) => {
    const values = appearances
      .map(([sequence, date]) => `PB${sequence} ${date}`)
      .join("; ");
    return `| ${version} | ${appearances.length} | ${values} |`;
  })
  .join("\n");

const report = `# macOS major public-beta chronology: 11.0 through 26.0

Status: **research packet frozen for independent review; no mutation or publication is authorized.**

## Result

The bounded scope contains **41 unique numbered public-beta routes** and **two additional same-label lifecycle reappearances**, for **43 observed public appearances**. Production contains no macOS \`publicBeta\` events and no exact identity matches for these routes.

| macOS | Unique routes | Pacific-normalized numbered appearances |
|---|---:|---|
${chronologyRows}

The non-contiguous Monterey sequence is intentional: Public Beta 3 was skipped. No macOS Sonoma Public Beta 6 is proposed.

## Same-label lifecycle appearances

- **macOS 13.0 Public Beta 5:** appeared September 9, 2022, was reported released then pulled, and returned under the same label on September 10. The unique route candidate uses September 9 with \`availabilityState=replaced\`; the return is preserved separately.
- **macOS 26.0 Public Beta 1:** appeared accidentally July 21, 2025, was pulled, and was officially released under the same label July 24. The unique route candidate uses July 21 with \`availabilityState=replaced\`; the official return is preserved separately.

Neither return creates a duplicate route, and neither is asserted to be an \`isRevision\` event without a defined lifecycle model.

## Important conflicts

- **Big Sur PB4–PB6:** retained public appearances exist on September 22, September 30, and October 15. Apple Wiki maps these to PB4, PB5, and PB6, and Cisco independently maps the September payload to PB5. A living iCulture chronology omits September 22 and calls September 30 PB4. All three late routes remain conflict-tagged.
- **Big Sur PB6 date:** the contemporary MacRumors update explicitly says October 15; Apple Wiki records October 16.
- **Monterey:** PB3 was skipped. PB10 is supported by 9to5Mac public-tester wording and an explicit Kobonemi PB10 label, while iCulture's chronology ends at PB9.
- **Ventura PB5:** September 9 release/pull and September 10 same-label return are modeled as one route plus one exceptional appearance.
- **Sonoma:** cross-platform reports carried the mobile fifth-public-beta count onto the August 22/23 Mac release. Mac-specific sources identify it as PB4 and the August 30/31 release as PB5; no PB6 is created.
- **Tahoe PB1:** the accidental July 21 release and official July 24 return share one identity.
- **Time zones:** Pacific newsroom dates are canonical when available; European-local next-day dates remain recorded conflicts, notably Sonoma PB4/PB5 and Tahoe PB5.

## Evidence and provenance

\`sources.json\` records ${sources.length} source entries. Every entry has retained raw bytes, byte count, SHA-256, a bounded source-identification fragment, a claim-specific locator, and publisher-lineage metadata. Candidate evidence references resolve only to packet sources. Each candidate has at least two independent publisher families; repeated pages from one publisher never count as additional independence.

Apple first-party public-seed archives do not expose a durable candidate-by-candidate chronology for this historical span. The packet therefore uses multiple contemporary editorial lineages, with vendor release notes and a retrospective release table only where they materially clarify a documented conflict.

No build is proposed. Developer seed ordinals and shared payloads are not used to manufacture public ordinals.

## Production reconciliation

The read-only published production query captured at \`${production.capturedAt}\` found:

- ${production.productionCounts.totalReleaseEvents} total release events;
- ${production.productionCounts.macOSPublicBetaEventsAllVersions} macOS public-beta events across all versions;
- ${production.productionCounts.scopedReleaseEvents} release events under the six target parents;
- ${production.productionCounts.scopedPublicBetaEvents} scoped public-beta events;
- zero exact matches for all 41 proposed identities.

All six target \`releaseVersion\` parents exist. No Sanity mutation was performed.

## Review boundary

The included review is a researcher self-check only. It is explicitly non-independent and grants no approval. An independent human reviewer must adjudicate every route, especially the eight conflict-tagged identities, before any mutation proposal is prepared.
`;

await Promise.all([
  writeJson("assignment.json", assignment),
  writeJson("sources.json", {
    formatVersion: 1,
    batchId,
    capturedAt: generatedAt,
    sourceCount: sources.length,
    sources,
    safety,
  }),
  writeJson("candidates.json", candidatesDocument),
  writeJson("conflicts.json", conflictsDocument),
  writeFile(path.join(here, "production-snapshot.json"), productionRaw),
  writeFile(path.join(here, "report.md"), report),
  writeJson("review.json", review),
]);

console.log(
  JSON.stringify(
    {
      batchId,
      generatedAt,
      candidateCount: candidates.length,
      exceptionalAppearanceCount: exceptionalAppearances.length,
      observedAppearanceCount:
        candidates.length + exceptionalAppearances.length,
      sourceCount: sources.length,
      conflictCount: conflicts.length,
      productionExactMatches: production.exactChecks.reduce(
        (sum, check) => sum + check.exactIdentityMatches,
        0,
      ),
    },
    null,
    2,
  ),
);
