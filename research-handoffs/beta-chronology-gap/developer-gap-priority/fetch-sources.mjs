import {createHash} from "node:crypto";
import {mkdir, writeFile} from "node:fs/promises";
import path from "node:path";

const batchId = "beta-chronology-gap-developer-gap-priority";
const evidenceRoot =
  "tmp/research-evidence/beta-chronology-gap/developer-gap-priority";
const rawDir = path.join(evidenceRoot, "raw");
const selectedDir = path.join(evidenceRoot, "selected");

const sources = [
  {
    sourceId: "new-ios1021-b1-idb-direct",
    author: "Christian Zibreg",
    canonicalUrl:
      "https://www.idownloadblog.com/2016/12/14/apple-seeds-first-beta-of-ios-10-2-1-macos-sierra-10-12-3-and-tvos-10-1-1-to-developers/",
    expectedMarkers: ["iOS 10.2.1 beta 1", "registered developers"],
  },
  {
    sourceId: "new-ios1032-b4-idb-direct",
    author: "Christian Zibreg",
    canonicalUrl:
      "https://www.idownloadblog.com/2017/04/24/fourth-betas-of-ios-10-3-2-macos-sierra-10-12-5-watchos-3-2-2-tvos-10-2-1-now-available/",
    expectedMarkers: ["iOS 10.3.2 beta 4", "Apple Developer Program"],
  },
  {
    sourceId: "new-ios1032-b1-idb-direct",
    author: "Cody Lee",
    canonicalUrl:
      "https://www.idownloadblog.com/2017/03/28/first-betas-ios-10-3-2-and-more/",
    expectedMarkers: ["first betas", "iOS 10.3.2"],
  },
  {
    sourceId: "new-ios1032-b2-idb-direct",
    author: "Christian Zibreg",
    canonicalUrl:
      "https://www.idownloadblog.com/2017/04/10/apple-posts-watchos-3-2-2-beta-7-second-beta-of-ios-10-3-2-macos-sierra-10-12-5-and-tvos-10-2-1/",
    expectedMarkers: ["iOS 10.3.2 beta 2", "registered developers"],
  },
  {
    sourceId: "new-ios1032-b5-idb-direct",
    author: "Cody Lee",
    canonicalUrl:
      "https://www.idownloadblog.com/2017/04/27/ios-10-3-2-beta-5/",
    expectedMarkers: ["fifth beta", "iOS 10.3.2"],
  },
  {
    sourceId: "new-ios1033-b1-idb-direct",
    author: "Cody Lee",
    canonicalUrl:
      "https://www.idownloadblog.com/2017/05/16/first-betas-of-ios-10-3-3/",
    expectedMarkers: ["first betas", "Registered developers"],
  },
  {
    sourceId: "new-ios1033-b2-idb-direct",
    author: "Sébastien Page",
    canonicalUrl:
      "https://www.idownloadblog.com/2017/05/30/apple-launches-second-betas-of-ios-10-3-3-macos-10-12-6-watchos-3-2-3-and-tvos-10-2-2/",
    expectedMarkers: ["second round of betas", "iOS 10.3.3"],
  },
  {
    sourceId: "new-ios1033-b5-idb-direct",
    author: "Christian Zibreg",
    canonicalUrl:
      "https://www.idownloadblog.com/2017/06/28/fifth-beta-of-ios-10-3-3-and-macos-sierra-10-12-6-seeded-to-developers/",
    expectedMarkers: ["fifth betas", "registered developers"],
  },
  {
    sourceId: "negative-ios921-final-appleinsider",
    author: "AppleInsider Staff",
    canonicalUrl:
      "https://appleinsider.com/articles/16/01/19/apple-release-ios-921-with-fix-for-app-installs-plus-other-bug-fixes-security-updates",
    expectedMarkers: ["two developer betas", "final release"],
  },
  {
    sourceId: "negative-ios1021-final-appleinsider",
    author: "Roger Fingas",
    canonicalUrl:
      "https://appleinsider.com/articles/17/01/23/apple-releases-finished-ios-1021-update-bringing-minor-fixes",
    expectedMarkers: ["four betas", "developers and the public"],
  },
  {
    sourceId: "conflict-ios1032-final-macrumors",
    author: "Juli Clover",
    canonicalUrl:
      "https://www.macrumors.com/2017/05/15/apple-releases-ios-10-3-2/",
    expectedMarkers: ["four betas", "iOS 10.3.2"],
  },
  {
    sourceId: "negative-ios1032-final-forbes",
    author: "Amit Chowdhry",
    canonicalUrl:
      "https://www.forbes.com/sites/amitchowdhry/2017/05/15/ios-10-3-2-features/",
    expectedMarkers: ["five betas", "iOS 10.3.2"],
  },
  {
    sourceId: "negative-ios1033-final-macrumors",
    author: "Juli Clover",
    canonicalUrl:
      "https://www.macrumors.com/2017/07/19/apple-releases-ios-10-3-3/",
    expectedMarkers: ["six betas", "iOS 10.3.3"],
  },
  {
    sourceId: "negative-ios1033-final-forbes",
    author: "Amit Chowdhry",
    canonicalUrl:
      "https://www.forbes.com/sites/amitchowdhry/2017/07/19/apple-ios-10-3-3-features/",
    expectedMarkers: ["Six betas", "iOS 10.3.3"],
  },
];

const sha256 = (value) =>
  createHash("sha256").update(value).digest("hex");
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
      .replaceAll(/<(br|\/p|\/div|\/li|\/h[1-6]|\/blockquote)>/gi, "\n")
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
const firstJsonString = (text, key) => {
  const pattern = new RegExp(
    `"${key}"\\s*:\\s*"((?:\\\\.|[^"\\\\])*)"`,
    "i",
  );
  const match = text.match(pattern);
  if (!match?.[1]) return null;
  try {
    return stripHtml(JSON.parse(`"${match[1]}"`));
  } catch {
    return stripHtml(match[1]);
  }
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
    if (text.length >= 120) return {selector, text: text.slice(0, 50_000)};
  }
  return {selector: "document", text: stripHtml(html).slice(0, 50_000)};
};
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

const capturedAt = new Date().toISOString();
const captures = [];
for (const item of sources) {
  const fetched = await fetchWithRetry(item.canonicalUrl);
  const html = fetched.bytes.toString("utf8");
  const selected = selectArticle(html);
  const title =
    firstJsonString(html, "headline") ??
    firstMatch(html, [/<title[^>]*>([\s\S]*?)<\/title>/i]);
  const publishedAt =
    firstJsonString(html, "datePublished") ??
    firstMatch(html, [
      /<meta[^>]+property=["']article:published_time["'][^>]+content=["']([^"']+)["']/i,
      /<time[^>]+datetime=["']([^"']+)["']/i,
    ]);
  const author = item.author ?? firstJsonString(html, "name");
  const combinedText = `${title ?? ""}\n${selected.text}`;
  const markerChecks = item.expectedMarkers.map((marker) => ({
    marker,
    found:
      html.toLocaleLowerCase().includes(marker.toLocaleLowerCase()) ||
      combinedText.toLocaleLowerCase().includes(marker.toLocaleLowerCase()),
  }));
  const rawPath = path.join(rawDir, `${item.sourceId}.raw.html`);
  const selectedPath = path.join(
    selectedDir,
    `${item.sourceId}.selected.txt`,
  );
  const selectedText = [
    `SOURCE ID: ${item.sourceId}`,
    `REQUESTED URL: ${item.canonicalUrl}`,
    `FINAL URL: ${fetched.finalUrl}`,
    `OBSERVED TITLE: ${title ?? "unknown"}`,
    `OBSERVED PUBLISHED: ${publishedAt ?? "unknown"}`,
    `OBSERVED AUTHOR: ${author ?? "unknown"}`,
    `SELECTOR: ${selected.selector}`,
    "",
    selected.text,
    "",
  ].join("\n");
  await Promise.all([
    writeFile(rawPath, fetched.bytes),
    writeFile(selectedPath, selectedText, "utf8"),
  ]);
  captures.push({
    ...item,
    capturedAt,
    finalUrl: fetched.finalUrl,
    httpStatus: fetched.status,
    contentType: fetched.contentType,
    parsed: {title, publishedAt, author},
    markerChecks,
    evidence: {
      rawPath,
      rawBytes: fetched.bytes.byteLength,
      rawSha256: sha256(fetched.bytes),
      selectedPath,
      selectedSelector: selected.selector,
      selectedTextBytes: Buffer.byteLength(selectedText),
      selectedTextSha256: sha256(selectedText),
      captureMethod: "http-html",
    },
  });
  console.log(
    `${item.sourceId}: ${fetched.status}, ${fetched.bytes.byteLength} bytes`,
  );
}

await writeFile(
  path.join(evidenceRoot, "fetch-manifest.json"),
  `${JSON.stringify(
    {
      batchId,
      capturedAt,
      sourceCount: captures.length,
      allExpectedMarkersFound: captures.every((capture) =>
        capture.markerChecks.every((check) => check.found),
      ),
      sources: captures,
    },
    null,
    2,
  )}\n`,
);
