import {createHash} from "node:crypto";
import {mkdir, writeFile} from "node:fs/promises";
import path from "node:path";

const batchId = "beta-chronology-gap-mobile26-public";
const evidenceRoot =
  "tmp/research-evidence/beta-chronology-gap/mobile26-public";
const rawDir = path.join(evidenceRoot, "raw");
const selectedDir = path.join(evidenceRoot, "selected");
const capturedAt = new Date().toISOString();

const candidateId = (platform, version, sequence) =>
  `candidate:apple:${platform === "iOS" ? "ios" : "ipados"}:${version}:public-beta-${sequence}`;
const both = (version, sequence) => [
  candidateId("iOS", version, sequence),
  candidateId("iPadOS", version, sequence),
];
const one = (platform, version, sequence) => [
  candidateId(platform, version, sequence),
];

const source = ({
  sourceId,
  canonicalUrl,
  publisher,
  publishedDateObserved,
  candidateIds = [],
  conflictIds = [],
  platformsNamed = [],
  roles = [
    "publicAvailability",
    "publicOrdinal",
    "appearanceDate",
    "channelIdentity",
  ],
  locator = "Page metadata, headline, and candidate-specific article lead or update paragraph.",
  supportNote =
    "Contemporary report supports the public-beta identity and appearance chronology.",
  sourceClass = "journalism",
  independentForCorroboration = true,
}) => ({
  sourceId,
  canonicalUrl,
  publisher,
  publishedDateObserved,
  candidateIds,
  conflictIds,
  platformsNamed,
  roles,
  locator,
  supportNote,
  sourceClass,
  independentForCorroboration,
});

const cycles = {
  "26.1": [
    [1, "2025-09-24", "apple-releases-ios-26-1-public-beta-1"],
    [2, "2025-10-07", "apple-seeds-ios-26-1-public-beta-2"],
    [3, "2025-10-14", "apple-seeds-ios-26-1-public-beta-3"],
    [4, "2025-10-20", "apple-seeds-ios-26-1-public-beta-4"],
  ],
  "26.2": [
    [1, "2025-11-06", "apple-seeds-ios-26-2-public-beta-1"],
    [2, "2025-11-18", "apple-releases-ios-26-2-public-beta-2"],
  ],
  "26.3": [
    [1, "2025-12-17", "apple-releases-ios-26-3-public-beta-1"],
    [2, "2026-01-13", "apple-releases-ios-26-3-public-beta-2"],
    [3, "2026-01-27", "apple-seeds-ios-26-3-public-beta-3"],
  ],
  "26.4": [
    [1, "2026-02-17", "ios-26-4-public-beta-1"],
    [2, "2026-03-05", "apple-seeds-revised-ios-26-4-beta-3"],
    [3, "2026-03-09", "apple-seeds-ios-26-4-beta-4-to-developers"],
  ],
  "26.5": [
    [1, "2026-04-03", "apple-first-ios-26-5-public-beta"],
    [2, "2026-04-14", "apple-seeds-ios-26-5-public-beta-2"],
    [3, "2026-04-21", "apple-releases-ios-26-5-public-beta-3"],
    [4, "2026-04-27", "apple-seeds-ios-26-5-beta-4"],
  ],
  "26.6": [
    [1, "2026-05-28", "apple-seeds-ios-26-6-public-beta-1"],
    [2, "2026-06-16", "apple-ios-26-6-public-beta-2"],
    [3, "2026-06-30", "ios-26-6-public-beta-3"],
    [4, "2026-07-07", "apple-seeds-ios-26-6-public-beta-4"],
    [5, "2026-07-13", "apple-seeds-ios-26-6-beta-5"],
  ],
};

const macRumorsSources = Object.entries(cycles).flatMap(
  ([version, appearances]) =>
    appearances.map(([sequence, date, slug]) =>
      source({
        sourceId: `source-macrumors-${version.replaceAll(".", "")}-pb${sequence}`,
        canonicalUrl: `https://www.macrumors.com/${date.replaceAll("-", "/")}/${slug}/`,
        publisher: "MacRumors",
        publishedDateObserved: date,
        candidateIds: both(version, sequence),
        platformsNamed: ["iOS", "iPadOS"],
        locator:
          version === "26.4" && sequence === 2
            ? "Headline, publication timestamp, lead, build paragraph, and paragraph stating that Apple also provided new public betas for iOS 26.4 and iPadOS 26.4."
            : version === "26.4" && sequence === 3
              ? "Headline, publication timestamp, lead naming iOS and iPadOS, and the same-day update stating that public beta versions are available."
              : "Headline, publication timestamp, and lead explicitly naming the numbered iOS 26.x and iPadOS 26.x public-beta releases.",
        supportNote:
          version === "26.4" && sequence === 2
            ? "Contemporary report establishes new public releases for both platforms on March 5 alongside revised developer Beta 3. The public ordinal is resolved from the complete public sequence and corroborating sources."
            : "Contemporary report explicitly supports both platform identities, ordinal, public channel, and appearance date.",
      }),
    ),
);

const iCultureSources = Object.entries(cycles).map(
  ([version, appearances]) =>
    source({
      sourceId: `source-iculture-${version.replaceAll(".", "")}-timeline`,
      canonicalUrl: `https://www.iculture.nl/nieuws/ios-${version.replace(".", "-")}-beta/`,
      publisher: "iCulture",
      publishedDateObserved:
        version === "26.1"
          ? "2025-10-28"
          : version === "26.2"
            ? "2025-12-03"
            : version === "26.3"
              ? "2026-02-04"
              : version === "26.4"
                ? "2026-03-18"
                : version === "26.5"
                  ? "2026-05-04"
                  : "2026-07-20",
      candidateIds: appearances.flatMap(([sequence]) =>
        version === "26.4" && sequence > 1
          ? []
          : both(version, sequence),
      ),
      conflictIds: [
        ...(version === "26.1"
          ? ["ipados-261-pb1-mislabeled-by-iculture"]
          : []),
        ...(version === "26.2"
          ? ["mobile-262-public-developer-sequence-divergence"]
          : []),
        ...(version === "26.4"
          ? ["mobile-264-iculture-omits-pb2-pb3"]
          : []),
        ...(version === "26.5"
          ? ["mobile-265-iculture-year-typos"]
          : []),
        ...(version === "26.6"
          ? ["mobile-266-pb3-date-conflict"]
          : []),
      ],
      platformsNamed: ["iOS", "iPadOS"],
      roles: [
        "rollingChronology",
        "publicAvailability",
        "publicOrdinal",
        "appearanceDate",
        "terminalBoundary",
        "conflictEvidence",
      ],
      locator:
        "The iOS and iPadOS beta-history tables, page revision history, and terminal RC/final-release rows. Candidate rows and the documented errors or omissions are bounded by their version-specific table headings.",
      supportNote:
        "Independent rolling chronology supports the listed public sequence except where this packet explicitly records a label, year, omission, or date conflict.",
    }),
);

const specialSources = [
  source({
    sourceId: "source-itopnews-261-pb1",
    canonicalUrl:
      "https://www.itopnews.de/2025/09/public-beta-1-von-ios-26-1-ipados-26-1-und-macos-26-1-ist-da/",
    publisher: "iTopnews",
    publishedDateObserved: "2025-09-24",
    candidateIds: both("26.1", 1),
    platformsNamed: ["iOS", "iPadOS"],
    locator:
      "Headline, publication date, and lead explicitly identifying Public Beta 1 of iOS 26.1 and iPadOS 26.1.",
    supportNote:
      "Independent explicit evidence resolves iCulture's erroneous iPadOS Public Beta 2 label on the same date.",
  }),
  source({
    sourceId: "source-9to5mac-264-pb1-ios",
    canonicalUrl:
      "https://9to5mac.com/2026/02/17/apple-releases-first-ios-26-4-public-beta-with-these-changes/",
    publisher: "9to5Mac",
    publishedDateObserved: "2026-02-17",
    candidateIds: one("iOS", "26.4", 1),
    platformsNamed: ["iOS"],
  }),
  source({
    sourceId: "source-9to5mac-264-pb1-ipados",
    canonicalUrl:
      "https://9to5mac.com/2026/02/17/ipados-26-4-public-beta-now-available-heres-every-new-feature/",
    publisher: "9to5Mac",
    publishedDateObserved: "2026-02-17",
    candidateIds: one("iPadOS", "26.4", 1),
    platformsNamed: ["iPadOS"],
  }),
  source({
    sourceId: "source-appleosophy-264-pb2",
    canonicalUrl:
      "https://appleosophy.com/2026/03/05/apple-rolls-out-revised-versions-of-ios-26-4-and-ipados-26-4-beta-3-to-developers-alongside-public-betas/",
    publisher: "Appleosophy",
    publishedDateObserved: "2026-03-05",
    candidateIds: both("26.4", 2),
    platformsNamed: ["iOS", "iPadOS"],
    locator:
      "Headline, timestamp, lead, and build paragraph naming both platforms and stating that public betas with the same revised build were released alongside developer Beta 3.",
    supportNote:
      "Independent publisher corroborates March 5 public availability for both platforms; the exact public ordinal is established by the complete public sequence rather than developer numbering.",
  }),
  source({
    sourceId: "source-onetech-264-pb2-ios",
    canonicalUrl:
      "https://onetech.pl/ios-26-4-beta-3-version-2-najwazniejsze-zmiany/",
    publisher: "Onetech",
    publishedDateObserved: "2026-03-06",
    candidateIds: one("iOS", "26.4", 2),
    platformsNamed: ["iOS"],
    locator:
      "Headline, article lead, and build paragraph explicitly pairing iOS 26.4 developer Beta 3 v2 with iOS 26.4 Public Beta 2.",
    supportNote:
      "Next-day independent report explicitly corroborates the Public Beta 2 ordinal and revised build relationship for iOS.",
  }),
  source({
    sourceId: "source-macrumors-forum-264-no-pb2-mar2",
    canonicalUrl:
      "https://forums.macrumors.com/threads/apple-seeds-third-betas-of-ios-26-4-and-ipados-26-4-to-developers.2478436/?post=34455655",
    publisher: "MacRumors Forums",
    publishedDateObserved: "2026-03-02",
    candidateIds: [],
    conflictIds: [
      "mobile-264-no-public-counterpart-to-developer-beta2",
    ],
    platformsNamed: ["iOS", "iPadOS"],
    roles: ["negativeSequenceEvidence", "contemporaryCommunityWitness"],
    locator:
      "March 2 discussion posts asking where Public Beta 2 was and answering that it had not been released.",
    supportNote:
      "Contemporary community evidence supports the absence of a public counterpart before the March 5 revised build; it is not counted as an editorial lineage.",
    sourceClass: "communityThread",
    independentForCorroboration: false,
  }),
  source({
    sourceId: "source-macrumors-forum-264-pb2-build",
    canonicalUrl:
      "https://forums.macrumors.com/threads/ios-26-4-beta-3-bug-fixes-changes-and-improvements.2478437/page-6",
    publisher: "MacRumors Forums",
    publishedDateObserved: "2026-03-05",
    candidateIds: both("26.4", 2),
    platformsNamed: ["iOS", "iPadOS"],
    roles: ["publicOrdinal", "buildRelationship", "communityWitness"],
    locator:
      "March 5 post 133 stating that the revised developer build is the same build as Public Beta 2, version 23E5223k.",
    supportNote:
      "Contemporary community witness explicitly records the Public Beta 2 ordinal; it is not counted as an independent editorial lineage.",
    sourceClass: "communityThread",
    independentForCorroboration: false,
  }),
  source({
    sourceId: "source-9to5mac-264-pb3-ios",
    canonicalUrl:
      "https://9to5mac.com/2026/03/09/apple-releases-ios-26-4-beta-4/",
    publisher: "9to5Mac",
    publishedDateObserved: "2026-03-09",
    candidateIds: one("iOS", "26.4", 3),
    platformsNamed: ["iOS"],
    locator:
      "Timestamp and same-day update stating that the corresponding iOS public beta rolled out a few hours after developer Beta 4.",
  }),
  source({
    sourceId: "source-9to5mac-264-pb3-ipados",
    canonicalUrl:
      "https://9to5mac.com/2026/03/09/apple-releases-beta-4-for-ipados-26-4-tvos-26-4-and-more/",
    publisher: "9to5Mac",
    publishedDateObserved: "2026-03-09",
    candidateIds: one("iPadOS", "26.4", 3),
    platformsNamed: ["iPadOS"],
    locator:
      "Timestamp, iPadOS Beta 4 article body, and update stating that public betas rolled out later the same day.",
  }),
  source({
    sourceId: "source-anotherapple-264-pb3",
    canonicalUrl:
      "https://www.anotherapple.com/2026/03/ios-26-4-public-beta-3-now-available-for-download/",
    publisher: "AnotherApple",
    publishedDateObserved: "2026-03-09",
    candidateIds: both("26.4", 3),
    platformsNamed: ["iOS", "iPadOS"],
    locator:
      "Headline, timestamp, and lead explicitly identifying Public Beta 3 for iOS 26.4 and iPadOS 26.4.",
  }),
  source({
    sourceId: "source-macobserver-264-false-pb2-ios",
    canonicalUrl:
      "https://www.macobserver.com/news/ios-26-4-public-beta-2-now-available-with-new-features-and-fixes/",
    publisher: "The Mac Observer",
    publishedDateObserved: "2026-02-24",
    candidateIds: [],
    conflictIds: ["mobile-264-false-feb24-pb2-report"],
    platformsNamed: ["iOS"],
    roles: ["conflictEvidence", "publisherCorrectionEvidence"],
    locator:
      "Headline and body claim a February 24 Public Beta 2 release; February 26–27 comments report no update, and the author replies that they also do not see the beta.",
    supportNote:
      "Preserved as a contradicted publisher report and never used as positive appearance evidence.",
    independentForCorroboration: false,
  }),
  source({
    sourceId: "source-macobserver-264-false-pb2-ipados",
    canonicalUrl:
      "https://www.macobserver.com/news/apple-releases-ipados-26-4-beta-2-to-public-users/",
    publisher: "The Mac Observer",
    publishedDateObserved: "2026-02-24",
    candidateIds: [],
    conflictIds: ["mobile-264-false-feb24-pb2-report"],
    platformsNamed: ["iPadOS"],
    roles: ["conflictEvidence"],
    locator:
      "Headline and article body claim a February 24 iPadOS Public Beta 2 release with build 23E5218e.",
    supportNote:
      "Preserved as the iPadOS counterpart of the contradicted February 24 report; never used as positive appearance evidence.",
    independentForCorroboration: false,
  }),
  source({
    sourceId: "source-macrumors-264-rc",
    canonicalUrl:
      "https://www.macrumors.com/2026/03/18/apple-seeds-ios-26-4-release-candidate/",
    publisher: "MacRumors",
    publishedDateObserved: "2026-03-18",
    candidateIds: [],
    conflictIds: ["rc-is-not-public-beta"],
    platformsNamed: ["iOS", "iPadOS"],
    roles: ["terminalBoundary", "releaseCandidateIdentity"],
    locator:
      "Headline, timestamp, and lead explicitly identify the March 18 release as the iOS/iPadOS 26.4 Release Candidate.",
    supportNote:
      "Establishes that the post-Public-Beta-3 seed is an RC, not Public Beta 4.",
  }),
];

const nineToFive265 = [
  [
    "source-9to5mac-265-pb1-ios",
    "https://9to5mac.com/2026/04/03/apple-releases-first-ios-26-5-public-beta/",
    "iOS",
    1,
  ],
  [
    "source-9to5mac-265-pb1-ipados",
    "https://9to5mac.com/2026/04/03/apple-releases-public-betas-for-ipados-26-5-watchos-26-5-and-more/",
    "iPadOS",
    1,
  ],
  [
    "source-9to5mac-265-pb2-ios",
    "https://9to5mac.com/2026/04/14/apple-releases-ios-26-5-public-beta-2/",
    "iOS",
    2,
  ],
  [
    "source-9to5mac-265-pb2-ipados",
    "https://9to5mac.com/2026/04/14/apple-releases-public-beta-2-for-ipados-26-5-tvos-26-5-and-more/",
    "iPadOS",
    2,
  ],
  [
    "source-9to5mac-265-pb3-ios",
    "https://9to5mac.com/2026/04/21/apple-releases-ios-26-5-public-beta-3/",
    "iOS",
    3,
  ],
  [
    "source-9to5mac-265-pb3-ipados",
    "https://9to5mac.com/2026/04/21/public-beta-3-for-ipados-26-5-watchos-26-5-and-more-available-now/",
    "iPadOS",
    3,
  ],
  [
    "source-9to5mac-265-pb4-ios",
    "https://9to5mac.com/2026/04/27/apple-releases-ios-26-5-beta-4-for-iphone/",
    "iOS",
    4,
  ],
  [
    "source-9to5mac-265-pb4-ipados",
    "https://9to5mac.com/2026/04/27/apple-releases-beta-4-for-ipados-26-5-tvos-26-5-and-more/",
    "iPadOS",
    4,
  ],
].map(([sourceId, canonicalUrl, platform, sequence]) =>
  source({
    sourceId,
    canonicalUrl,
    publisher: "9to5Mac",
    publishedDateObserved: cycles["26.5"].find(
      ([candidateSequence]) => candidateSequence === sequence,
    )[1],
    candidateIds: one(platform, "26.5", sequence),
    platformsNamed: [platform],
    locator:
      "Headline, publication timestamp, lead, and any same-day update identifying the relevant numbered 26.5 public beta.",
    supportNote:
      "Independent 2026-dated platform-specific evidence resolves iCulture's erroneous 2025 display years.",
  }),
);

const nineToFive266 = [
  [
    "source-9to5mac-266-pb3-ios",
    "https://9to5mac.com/2026/06/29/apple-releases-ios-26-6-beta-3-for-iphone-heres-what-to-expect/",
    "iOS",
    3,
  ],
  [
    "source-9to5mac-266-pb3-ipados",
    "https://9to5mac.com/2026/06/29/beta-3-for-ipados-26-6-watchos-26-6-and-more-now-available/",
    "iPadOS",
    3,
  ],
  [
    "source-9to5mac-266-pb5-ios",
    "https://9to5mac.com/2026/07/13/apple-releases-ios-26-6-beta-5-for-iphone-heres-what-to-expect/",
    "iOS",
    5,
  ],
  [
    "source-9to5mac-266-pb5-ipados",
    "https://9to5mac.com/2026/07/13/apple-rolls-beta-5-for-ipados-26-6-tvos-26-6-watchos-26-6-more/",
    "iPadOS",
    5,
  ],
].map(([sourceId, canonicalUrl, platform, sequence]) =>
  source({
    sourceId,
    canonicalUrl,
    publisher: "9to5Mac",
    publishedDateObserved: cycles["26.6"].find(
      ([candidateSequence]) => candidateSequence === sequence,
    )[1],
    candidateIds: one(platform, "26.6", sequence),
    conflictIds:
      sequence === 3 ? ["mobile-266-pb3-date-conflict"] : [],
    platformsNamed: [platform],
    locator:
      sequence === 3
        ? "Original June 29 developer timestamp and June 30 update stating that the corresponding public beta is now available."
        : "Headline, July 13 timestamp, and update or lead identifying the relevant fifth public beta.",
    supportNote:
      sequence === 3
        ? "Independent source separates the June 29 developer seed from the June 30 public appearance."
        : "Independent platform-specific evidence supports the July 13 fifth public appearance.",
  }),
);

const sources = [
  ...iCultureSources,
  ...macRumorsSources,
  ...specialSources,
  ...nineToFive265,
  ...nineToFive266,
];

const decodeHtml = (value) =>
  value
    .replaceAll(/&nbsp;/gi, " ")
    .replaceAll(/&amp;/gi, "&")
    .replaceAll(/&quot;/gi, '"')
    .replaceAll(/&#0*39;|&apos;/gi, "'")
    .replaceAll(/&#0*34;/gi, '"')
    .replaceAll(/&lt;/gi, "<")
    .replaceAll(/&gt;/gi, ">")
    .replaceAll(/&#8216;|&#x2018;/gi, "‘")
    .replaceAll(/&#8217;|&#x2019;/gi, "’")
    .replaceAll(/&#8220;|&#x201c;/gi, "“")
    .replaceAll(/&#8221;|&#x201d;/gi, "”")
    .replaceAll(/&#8211;|&#x2013;/gi, "–")
    .replaceAll(/&#8212;|&#x2014;/gi, "—")
    .replaceAll(/&#(\d+);/g, (_, code) =>
      String.fromCodePoint(Number(code)),
    )
    .replaceAll(/&#x([0-9a-f]+);/gi, (_, code) =>
      String.fromCodePoint(Number.parseInt(code, 16)),
    );

const stripHtml = (value) =>
  decodeHtml(
    value
      .replaceAll(/<!--[\s\S]*?-->/g, " ")
      .replaceAll(
        /<(script|style|svg|noscript|template)[^>]*>[\s\S]*?<\/\1>/gi,
        " ",
      )
      .replaceAll(
        /<(br|\/p|\/div|\/li|\/h[1-6]|\/blockquote|\/tr|\/td)>/gi,
        "\n",
      )
      .replaceAll(/<[^>]+>/g, " "),
  )
    .replaceAll(/\r/g, "")
    .replaceAll(/[ \t]+/g, " ")
    .replaceAll(/\n[ \t]+/g, "\n")
    .replaceAll(/\n{3,}/g, "\n\n")
    .trim();

const firstMatch = (text, patterns) => {
  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match?.[1]) return stripHtml(match[1]);
  }
  return null;
};

const selectArticle = (html) => {
  const candidates = [
    ["article", /<article\b[^>]*>([\s\S]*?)<\/article>/i],
    [
      ".post-content",
      /<[^>]+class=["'][^"']*post-content[^"']*["'][^>]*>([\s\S]*?)<\/(?:div|section)>/i,
    ],
    ["main", /<main\b[^>]*>([\s\S]*?)<\/main>/i],
    ["body", /<body\b[^>]*>([\s\S]*?)<\/body>/i],
  ];
  for (const [selector, pattern] of candidates) {
    const match = html.match(pattern);
    const text = match?.[1] ? stripHtml(match[1]) : "";
    if (text.length >= 120) return {selector, text: text.slice(0, 120_000)};
  }
  return {selector: "document", text: stripHtml(html).slice(0, 120_000)};
};

const sha256 = (value) =>
  createHash("sha256").update(value).digest("hex");

const fetchWithRetry = async (url, attempts = 3) => {
  let lastError;
  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    try {
      const response = await fetch(url, {
        redirect: "follow",
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Chrome/131.0 Safari/537.36 VersionRecordResearch/1.0",
          Accept:
            "text/html,application/xhtml+xml,application/json;q=0.9,*/*;q=0.8",
          "Accept-Language": "en-US,en;q=0.8",
        },
      });
      const bytes = Buffer.from(await response.arrayBuffer());
      if (!response.ok || bytes.byteLength < 100) {
        throw new Error(
          `HTTP ${response.status}; ${bytes.byteLength} response bytes`,
        );
      }
      return {
        bytes,
        finalUrl: response.url,
        status: response.status,
        contentType: response.headers.get("content-type"),
      };
    } catch (error) {
      lastError = error;
      if (attempt < attempts) {
        await new Promise((resolve) => setTimeout(resolve, attempt * 500));
      }
    }
  }
  throw lastError;
};

await Promise.all([
  mkdir(rawDir, {recursive: true}),
  mkdir(selectedDir, {recursive: true}),
]);

const capture = async (item, index) => {
  try {
    const fetched = await fetchWithRetry(item.canonicalUrl);
    const html = fetched.bytes.toString("utf8");
    const rawPath = path.join(rawDir, `${item.sourceId}.raw.html`);
    const selectedPath = path.join(
      selectedDir,
      `${item.sourceId}.selected.txt`,
    );
    const article = selectArticle(html);
    const parsedTitle = firstMatch(html, [
      /"headline"\s*:\s*"([^"]+)"/i,
      /<meta[^>]+property=["']og:title["'][^>]+content=["']([^"']+)["']/i,
      /<title[^>]*>([\s\S]*?)<\/title>/i,
    ]);
    const parsedPublishedAt = firstMatch(html, [
      /"datePublished"\s*:\s*"([^"]+)"/i,
      /property=["']article:published_time["'][^>]+content=["']([^"']+)["']/i,
      /name=["']date["'][^>]+content=["']([^"']+)["']/i,
    ]);
    const parsedModifiedAt = firstMatch(html, [
      /"dateModified"\s*:\s*"([^"]+)"/i,
      /property=["']article:modified_time["'][^>]+content=["']([^"']+)["']/i,
    ]);
    const parsedAuthor = firstMatch(html, [
      /"author"\s*:\s*\{[^{}]{0,800}?"name"\s*:\s*"([^"]+)"/i,
      /"author"\s*:\s*"([^"]+)"/i,
      /name=["']author["'][^>]+content=["']([^"']+)["']/i,
    ]);
    const selectedText = [
      `SOURCE ID: ${item.sourceId}`,
      `REQUESTED URL: ${item.canonicalUrl}`,
      `FINAL URL: ${fetched.finalUrl}`,
      `OBSERVED TITLE: ${parsedTitle ?? "unknown"}`,
      `OBSERVED PUBLISHED: ${parsedPublishedAt ?? item.publishedDateObserved}`,
      `OBSERVED MODIFIED: ${parsedModifiedAt ?? "unknown"}`,
      `OBSERVED AUTHOR: ${parsedAuthor ?? "unknown"}`,
      `BOUNDED LOCATOR: ${item.locator}`,
      `SELECTOR: ${article.selector}`,
      "",
      article.text,
    ].join("\n");
    await Promise.all([
      writeFile(rawPath, fetched.bytes),
      writeFile(selectedPath, selectedText, "utf8"),
    ]);
    return {
      ...item,
      captureStatus: "captured",
      capturedAt,
      finalUrl: fetched.finalUrl,
      httpStatus: fetched.status,
      contentType: fetched.contentType,
      parsed: {
        title: parsedTitle,
        publishedAt: parsedPublishedAt,
        modifiedAt: parsedModifiedAt,
        author: parsedAuthor,
      },
      evidence: {
        rawPath,
        rawBytes: fetched.bytes.byteLength,
        rawSha256: sha256(fetched.bytes),
        selectedPath,
        selectedSelector: article.selector,
        selectedTextBytes: Buffer.byteLength(selectedText),
        selectedTextSha256: sha256(selectedText),
        captureMethod: "http-html",
        locator: item.locator,
      },
      captureIndex: index,
    };
  } catch (error) {
    return {
      ...item,
      captureStatus: "failed",
      capturedAt,
      error: error instanceof Error ? error.message : String(error),
      evidence: null,
      captureIndex: index,
    };
  }
};

const observations = new Array(sources.length);
let nextIndex = 0;
const worker = async () => {
  while (true) {
    const index = nextIndex;
    nextIndex += 1;
    if (index >= sources.length) return;
    const result = await capture(sources[index], index);
    observations[index] = result;
    process.stdout.write(
      `[${String(index + 1).padStart(2, "0")}/${sources.length}] ${result.sourceId}: ${result.captureStatus}\n`,
    );
  }
};
await Promise.all(Array.from({length: 6}, () => worker()));

await Promise.all([
  writeFile(
    path.join(evidenceRoot, "source-plan.json"),
    `${JSON.stringify(
      {
        formatVersion: 1,
        batchId,
        sourceCount: sources.length,
        sources,
      },
      null,
      2,
    )}\n`,
  ),
  writeFile(
    path.join(evidenceRoot, "source-observations.json"),
    `${JSON.stringify(
      {
        formatVersion: 1,
        batchId,
        capturedAt,
        sourceCount: observations.length,
        capturedCount: observations.filter(
          (item) => item.captureStatus === "captured",
        ).length,
        failedCount: observations.filter(
          (item) => item.captureStatus === "failed",
        ).length,
        observations,
      },
      null,
      2,
    )}\n`,
  ),
]);

console.log(
  JSON.stringify(
    {
      sourceCount: observations.length,
      capturedCount: observations.filter(
        (item) => item.captureStatus === "captured",
      ).length,
      failed: observations
        .filter((item) => item.captureStatus === "failed")
        .map((item) => ({
          sourceId: item.sourceId,
          error: item.error,
        })),
    },
    null,
    2,
  ),
);
