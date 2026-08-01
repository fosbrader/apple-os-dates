import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readdirSync, readFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import { JSDOM } from "jsdom";

const here = dirname(fileURLToPath(import.meta.url));
const evidenceDirectory = resolve(process.argv[2] || "tmp/ios7-point-evidence");
const bundle = JSON.parse(
  readFileSync(resolve(here, "apple-ios-7-point-prerelease.json"), "utf8"),
);
const sha256 = (value) => createHash("sha256").update(value).digest("hex");
const collapse = (value) => value.replace(/\s+/g, " ").trim();
const normalizedText = (value) =>
  value
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/[“”]/g, '"')
    .replace(/[‘’]/g, "'")
    .replace(/ﬁ/g, "fi")
    .replace(/ﬂ/g, "fl")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();

const expectedArtifacts = {
  "70-4-no-dev-seed-macrumors.html": [
    128_590,
    "b396da05bd60251453c17b1b079975decabebe04f182e0cdefd88c83c3e477b0",
    "article",
    1_577,
    "0590691348fd1e5962ca31a6f39dcc333d297a82732cab6fb83156504986b1f9",
  ],
  "71-b1-identity-macrumors.html": [
    123_851,
    "860f416690e27224a81dfeafba5dd72ca239638b821865b45775442a2541748f",
    "article",
    723,
    "ceaef436e93ba14c953bff4a03ed64aba18a665f85013cb36e6411a93f28b7e4",
  ],
  "71-b1-notes-ifun.html": [
    205_230,
    "99fe7e4272aa2d286a200ef2721d3722cf6500e6b8c70d53a9d91362bc7dd0fd",
    "#article-single span.content",
    4_423,
    "5a73aebc6f697459c0e9df729c93d636055932ada994a058a0375d7ec444b722",
  ],
  "71-b1-observed-9to5mac.html": [
    252_529,
    "0053a866cabb54c90d430087a3a86b0bb0bf573306a4615ed8d00dfb1355e18b",
    ".post-content",
    7_124,
    "2a631b03c2ff315b9ed4e11908ed75eccb45d3687c586642a099bc623337a148",
  ],
  "71-b2-identity-macrumors.html": [
    127_489,
    "0d189ae685f6a92db6b7f29ccfbc5d4c94527cd23ea2d1e34a754233a5b00ad9",
    "article",
    2_012,
    "f23a0cccd8fe72b77d917590049a8cb33f2f621d6eeab076ca419eb213026aa8",
  ],
  "71-b2-notes-whirlpool.html": [
    35_925,
    "65e841a6cc87c5a6af9d2918d208e87d25d2566a06ae677ae68014fbb6b3dc72",
    "#rr41297456 .replytext.bodytext",
    3_605,
    "28fa0b3888557fde87de4a210f1ee848d3b3313f84223600d86f6c337d5b8a73",
  ],
  "71-b3-identity-macrumors.html": [
    129_146,
    "6a23e095ad981ec65bdf438fe6c89fece35be827c35652ac900de78d447bd68f",
    "article",
    2_158,
    "ac75427f81786f0c29418b0d2feb2c87fb4c8492d77d69116d1dc4b79ea90fa3",
  ],
  "71-b3-notes-mactrast.html": [
    156_758,
    "2e4962acdc55c59415780a53826470f20d6495e86e0ba6f397ce7b6d3509874b",
    ".entry-content",
    3_453,
    "6ad982d34cfbb74060da89f643b3640dd14db39acbb6e001b0dbd8a72458ad8d",
  ],
  "71-b3-tidbits-macrumors.html": [
    135_536,
    "2edd7b4c8e854bd691516c5a75aaede15e74ad048a5f2cd4605a02f4483e0e41",
    "article",
    3_141,
    "ef6ebd69a0acce13da682e6311c9638b99c52e259206774440df17d3eac19023",
  ],
  "71-b4-identity-macrumors.html": [
    126_563,
    "416c014c57038ae4200fb5be887b6dfdcd114064a0e8795ac66e43c8a02e1626",
    "article",
    1_144,
    "17a9339861518ede8d7d0e39c3a91c885301c71c9ff38dbb26d640191d647eed",
  ],
  "71-b4-notes-wccftech.html": [
    138_110,
    "41b0faa062df19bca64339f685cd916951580921b12b9923832fec08f26c552b",
    ".post",
    3_534,
    "c271b28e6c94bebefb10467b50e21cc59692a7ffadb5eab9012c57f43093b928",
  ],
  "71-b4-tidbits-macrumors.html": [
    126_079,
    "4152a3e59b799f70f7a3b38c81a1d9d9fb0f539d59ac6bc92e57100b7dd4b468",
    "article",
    2_035,
    "fb8b1418d18eb31e287067aa7b8a54c629621df85e7c80c1d843418b4fc39691",
  ],
  "71-b5-identity-macrumors.html": [
    128_758,
    "03997d698006cc04a28099dfab2a98f34c1c7be454ee02ed8d39aac29c29e89e",
    "article",
    1_886,
    "c156ffaa36239bbf9f26883a71462f5221bf026e802df60069ca8a8b4ca4be15",
  ],
  "71-b5-notes-appleinsider.html": [
    131_197,
    "7f4597a9a826a96527de2e5663e097f3f02a752c4a8f241d1c44186651d6a4d1",
    ".article-body",
    2_373,
    "a4854b141a152422d3c27017fdb2b3d4a3aa94cc28f618a9963795f861514550",
  ],
  "71-b5-notes-yahoo.html": [
    535_679,
    "ca5f358a0d145466acb0987543a186ab02a6084dbf48dde0b597b0284b290d89",
    "article",
    10_255,
    "09010b2e012bb02cc81255caba46f2b144addbcc7c416543f3733c496c2780cc",
  ],
  "71-b5-tidbits-macrumors.html": [
    133_875,
    "3eb8474958303f7040d4f97025ead0a0fd14c09c3aa54e90d987fba4eca9cb67",
    "article",
    2_809,
    "001d7f0a7cc15fe1afad58ec0cfa8dfd621c73824e4194a81751ed5b43b9eaa3",
  ],
  "71-final-apple-developer-archive.html": [
    18_718,
    "9f320e499a9ef2843f6261eb50e7fc731bc21e5931022e635685ded58b27cc02",
    "#contents",
    3_946,
    "4e92278cb726f3d48a8506ec394735e2328e4c32d357ef8318d62b73b74c09e3",
  ],
  "71-final-apple-developer.html": [
    18_552,
    "9836db9fd4bc973038276e831e4215fc921c8d0a188f620d8610247f966bcbcc",
    "#contents",
    4_077,
    "ec62e1f10dfd5f29bcdd547d951e1dcd693b8a26c6616e8734fa14f080646639",
  ],
  "71-no-gm-macrumors.html": [
    124_465,
    "21b9729faa83cab2a4f26c1242b12bcac94bea817c9f41ca774c5169b2cac06b",
    "article",
    1_673,
    "38f16b9196cdd0b91a45c4c6207afa15109b710e9c1389804c602dc4df7ae2b9",
  ],
  "712-no-dev-testing-macrumors.html": [
    126_430,
    "b8c4e66759f9e318fda733d290d6e120862f2bab12b776d8186a3e0c648c814f",
    "article",
    2_709,
    "9a82454c0d698ad488b82b63825698fc9fd1992a3f8cc493a2a7a0f74bb43a75",
  ],
};

const buffers = new Map();
const documents = new Map();
const normalized = new Map();
for (const [
  name,
  [rawBytes, rawSha, selector, textBytes, textSha],
] of Object.entries(expectedArtifacts)) {
  const buffer = readFileSync(resolve(evidenceDirectory, name));
  assert.equal(buffer.byteLength, rawBytes, `${name} byte count`);
  assert.equal(sha256(buffer), rawSha, `${name} raw SHA-256`);
  const document = new JSDOM(buffer).window.document;
  const node = document.querySelector(selector);
  assert(node, `${name} contains ${selector}`);
  const text = collapse(node.textContent);
  assert.equal(Buffer.byteLength(text), textBytes, `${name} text bytes`);
  assert.equal(sha256(text), textSha, `${name} normalized SHA-256`);
  buffers.set(name, buffer);
  documents.set(name, document);
  normalized.set(name, text);
}

const sourceFileByUrl = new Map([
  [
    "https://www.macrumors.com/2013/11/18/apple-seeds-first-beta-of-ios-7-1-to-developers/",
    "71-b1-identity-macrumors.html",
  ],
  [
    "https://www.ifun.de/ios-7-1-erste-beta-verbessert-ipad-geste-video-50368/",
    "71-b1-notes-ifun.html",
  ],
  [
    "https://9to5mac.com/2013/11/18/apple-releases-ios-7-1-beta-to-developers-now-on-dev-center/",
    "71-b1-observed-9to5mac.html",
  ],
  [
    "https://www.macrumors.com/2013/12/13/apple-seeds-ios-7-1-beta-2-to-developers/",
    "71-b2-identity-macrumors.html",
  ],
  [
    "https://forums.whirlpool.net.au/archive/2194915",
    "71-b2-notes-whirlpool.html",
  ],
  [
    "https://www.macrumors.com/2014/01/07/apple-releases-ios-7-1-beta-3-to-developers/",
    "71-b3-identity-macrumors.html",
  ],
  [
    "https://www.mactrast.com/2014/01/apple-releases-ios-7-1-beta-3-developers/",
    "71-b3-notes-mactrast.html",
  ],
  [
    "https://www.macrumors.com/2014/01/07/ios71-beta-tidbits/",
    "71-b3-tidbits-macrumors.html",
  ],
  [
    "https://www.macrumors.com/2014/01/20/ios71-beta-4-to-developers/",
    "71-b4-identity-macrumors.html",
  ],
  [
    "https://wccftech.com/ios-7-1-beta-4-changelog/",
    "71-b4-notes-wccftech.html",
  ],
  [
    "https://www.macrumors.com/2014/01/20/ios71-beta4-tidbits/",
    "71-b4-tidbits-macrumors.html",
  ],
  [
    "https://www.macrumors.com/2014/02/04/apple-releases-ios-7-1-beta-5-to-developers/",
    "71-b5-identity-macrumors.html",
  ],
  [
    "https://www.yahoo.com/news/ios-7-1-beta-5-now-available-download-180343544.html",
    "71-b5-notes-yahoo.html",
  ],
  [
    "https://appleinsider.com/articles/14/02/04/apple-seeds-ios-71-beta-5-to-developers-with-new-siri-voices-",
    "71-b5-notes-appleinsider.html",
  ],
  [
    "https://www.macrumors.com/2014/02/04/ios7-1-beta5-tidbits/",
    "71-b5-tidbits-macrumors.html",
  ],
  [
    "https://developer.apple.com/library/archive/releasenotes/General/RN-iOSSDK-7.1/index.html",
    "71-final-apple-developer.html",
  ],
  [
    "https://www.macrumors.com/2014/03/04/ios-7-1-update-imminent/",
    "71-no-gm-macrumors.html",
  ],
]);
assert.equal(sourceFileByUrl.size, bundle.sources.length, "source-map count");
assert(
  bundle.sources.every((source) => sourceFileByUrl.has(source.url)),
  "every declared source has a retained artifact",
);
assert.deepEqual(
  new Set(bundle.sources.map((source) => source.url)),
  new Set(sourceFileByUrl.keys()),
  "declared source/evidence closure",
);
for (const source of bundle.sources) {
  const name = sourceFileByUrl.get(source.url);
  const document = documents.get(name);
  const capturedTitle =
    name === "71-b2-notes-whirlpool.html"
      ? document
          .querySelector('#rr41297456 meta[itemprop="headline"]')
          ?.getAttribute("content")
      : collapse(document.querySelector("h1")?.textContent || "");
  assert.equal(capturedTitle, source.title, `${name} declared source title`);
}
assert.equal(
  bundle.sources.find(
    (source) =>
      source.url === "https://forums.whirlpool.net.au/archive/2194915",
  )?.author,
  "Liski (forum contributor)",
  "Whirlpool archive retains the actual preserving contributor",
);

const publicOwnerBuffer = readFileSync(resolve(here, "apple-ios-7.json"));
assert.equal(
  sha256(publicOwnerBuffer),
  "36027fdba7739881510e8eaf2e5dd7d73af58786a78f3c0e378edaf28e65ec14",
  "approved iOS 7 Public owner SHA-256",
);
const publicOwner = JSON.parse(publicOwnerBuffer);

const probesByFile = {
  "70-4-no-dev-seed-macrumors.html": [
    "iOS 7.0.4 appeared on October 22",
    "not seeded registered developers",
  ],
  "71-b1-identity-macrumors.html": ["first beta of iOS 7.1", "11D5099e"],
  "71-b1-notes-ifun.html": [
    "iOS SDK Release Notes for iOS 7.1 beta",
    "cannot attach to BTServer",
    "paragraphSpacing attribute",
    "MCSessioninitWithPeer",
  ],
  "71-b1-observed-9to5mac.html": [
    "dark keyboard",
    "burst mode photos",
    "auto HDR mode",
    "baseline aligned",
  ],
  "71-b2-identity-macrumors.html": [
    "second beta of iOS 7.1",
    "Button Shapes",
    "Car Display",
  ],
  "71-b2-notes-whirlpool.html": [
    "Crash logs now appear",
    "Setup Keychain Later",
    "Audiobooks fail to play",
    "minimal-ui",
  ],
  "71-b3-identity-macrumors.html": [
    "third beta of iOS 7.1",
    "iCloud Keychain",
    "reduce white point",
  ],
  "71-b3-notes-mactrast.html": [
    "iMessage send failure",
    "Audiobooks now play",
    "minimal-ui",
  ],
  "71-b3-tidbits-macrumors.html": [
    "brightness and volume sliders",
    "turn the parallax effect on or off",
    "new shuffle and repeat buttons",
  ],
  "71-b4-identity-macrumors.html": [
    "fourth beta of iOS 7.1",
    "Slide to Unlock animation",
  ],
  "71-b4-notes-wccftech.html": [
    "Messages no longer indicates a send failure",
    "Bar button background images are ignored",
    "backIndicatorTransitionMaskImage",
  ],
  "71-b4-tidbits-macrumors.html": [
    "executed by tapping the + sign",
    "slightly more",
    "Messages Scrolling",
    "new Siri voice on the iPad",
  ],
  "71-b5-identity-macrumors.html": [
    "fifth beta of iOS 7.1",
    "11D5145e",
    "compact voice for Siri",
  ],
  "71-b5-notes-appleinsider.html": [
    "minimal-ui property for Safari",
    "Connect to iTunes over USB",
    "re-enable wireless sync",
  ],
  "71-b5-notes-yahoo.html": [
    "new natural-sounding Siri voices",
    "prompt is not shown",
    "backIndicatorTransitionMaskImage",
  ],
  "71-b5-tidbits-macrumors.html": [
    "Perspective Zoom",
    "Buy Album",
    "toggle for the list view",
  ],
  "71-final-apple-developer-archive.html": [
    "iOS SDK Release Notes for iOS 7.1",
    "new natural-sounding Siri voices",
    "Updated: 2014-03-10",
  ],
  "71-final-apple-developer.html": [
    "iOS SDK Release Notes for iOS 7.1",
    "cannot attach to BTServer",
    "minimal-ui",
    "Updated: 2014-03-10",
  ],
  "71-no-gm-macrumors.html": [
    "five different developer betas",
    "last beta coming on February 4",
    "yet to seed a Golden Master",
  ],
  "712-no-dev-testing-macrumors.html": [
    "running iOS 7.1.2",
    "not even be put through a developer testing period",
  ],
};
assert.deepEqual(
  new Set(Object.keys(probesByFile)),
  new Set(Object.keys(expectedArtifacts)),
  "every retained artifact has bounded probes",
);
for (const [name, probes] of Object.entries(probesByFile)) {
  const text = normalized.get(name).toLowerCase();
  for (const probe of probes) {
    assert(text.includes(probe.toLowerCase()), `${name} contains ${probe}`);
  }
}

const jsonLdValues = (document) => {
  const values = [];
  for (const script of document.querySelectorAll(
    'script[type="application/ld+json"]',
  )) {
    let parsed;
    try {
      parsed = JSON.parse(script.textContent);
    } catch {
      continue;
    }
    const queue = Array.isArray(parsed) ? [...parsed] : [parsed];
    while (queue.length > 0) {
      const value = queue.shift();
      if (!value || typeof value !== "object") continue;
      values.push(value);
      if (Array.isArray(value["@graph"])) queue.push(...value["@graph"]);
    }
  }
  return values;
};
const filesWithoutJsonLd = new Set([
  "71-b2-notes-whirlpool.html",
  "71-final-apple-developer.html",
]);
for (const source of bundle.sources) {
  const name = sourceFileByUrl.get(source.url);
  const canonical = documents
    .get(name)
    .querySelector('link[rel="canonical"]')?.href;
  if (canonical) {
    assert.equal(canonical, source.url, `${name} canonical source URL`);
  }
  if (filesWithoutJsonLd.has(name)) continue;
  const expectedDate = source.publishedAt.slice(0, 10);
  const record = jsonLdValues(documents.get(name)).find(
    (value) =>
      (value.headline || value.name) &&
      String(value.datePublished || "").startsWith(expectedDate),
  );
  assert(record, `${name} retains publication identity at ${expectedDate}`);
}
assert.equal(
  documents
    .get("71-final-apple-developer.html")
    .querySelector('meta[name="date"]')?.content,
  "2014-03-10",
  "Apple final developer publication date",
);
assert(
  collapse(
    documents.get("71-b2-notes-whirlpool.html").querySelector("#rr41297456")
      .textContent,
  ).includes("posted 2013-Dec-14, 7:55 am AEST"),
  "Whirlpool archive post timestamp",
);
assert.equal(
  bundle.sources.find(
    (source) =>
      source.url === "https://forums.whirlpool.net.au/archive/2194915",
  )?.publishedAt,
  "2013-12-14T07:55:53+10:00",
  "Whirlpool source metadata retains the exact captured post timestamp",
);
assert.equal(
  documents
    .get("70-4-no-dev-seed-macrumors.html")
    .querySelector('link[rel="canonical"]')?.href,
  "https://www.macrumors.com/2013/11/06/ios-7-0-4-activity-ramping-up-at-apple-ahead-of-next-minor-software-update/",
  "iOS 7.0.4 gap canonical URL",
);
assert.equal(
  documents
    .get("712-no-dev-testing-macrumors.html")
    .querySelector('link[rel="canonical"]')?.href,
  "https://www.macrumors.com/2014/05/22/apple-preparing-ios-7-1-2/",
  "iOS 7.1.2 gap canonical URL",
);

const expectedRoutes = [
  ["beta-1", "Beta 1", "2013-11-18", 1, 18],
  ["beta-2", "Beta 2", "2013-12-13", 2, 17],
  ["beta-3", "Beta 3", "2014-01-07", 3, 17],
  ["beta-4", "Beta 4", "2014-01-20", 4, 11],
  ["beta-5", "Beta 5", "2014-02-04", 5, 12],
];
assert.equal(bundle.events.length, expectedRoutes.length, "route count");
for (let index = 0; index < expectedRoutes.length; index += 1) {
  const [alias, label, date, sequence, changeCount] = expectedRoutes[index];
  const event = bundle.events[index];
  assert.deepEqual(event.target, {
    releaseVersionId: "version-ios-7-1",
    routeAlias: alias,
  });
  assert.equal(event.identity.releaseVersionId, "version-ios-7-1");
  assert.equal(event.identity.platformId, "platform-ios");
  assert.equal(event.identity.label, label);
  assert.equal(event.identity.appearanceDate, date);
  assert.equal(event.identity.sequence, sequence);
  assert.equal(event.identity.channel, "developerBeta");
  assert.equal(event.identity.isRevision, false);
  assert.equal(event.identity.closesReleaseCycle, false);
  assert.equal(event.changes.length, changeCount);
  assert.equal(event.provenanceStatus, "editoriallyVerified");
  assert.deepEqual(event.editorialReview, {
    status: "approved",
    reviewedAt: "2026-07-30T13:48:33Z",
  });
  assert.equal(event.isIndexable, true);
}
assert.deepEqual(bundle.versions, [], "candidate does not add versions");
assert.deepEqual(bundle.builds, [], "candidate does not add builds");
assert(
  bundle.events.every(
    (event) =>
      event.target.routeAlias !== "gm" && event.target.routeAlias !== "public",
  ),
  "GM and Public routes stay excluded",
);

const declaredUrls = new Set(bundle.sources.map((source) => source.url));
const sourceByUrl = new Map(
  bundle.sources.map((source) => [source.url, source]),
);
const archiveUrls = new Set(
  bundle.sources
    .filter((source) => source.sourceClass === "archive")
    .map((source) => source.url),
);
let citationReferences = 0;
let occurrenceCount = 0;
let weakestExactAnchorTokens = Number.POSITIVE_INFINITY;
const evidenceStateCounts = {
  reported: 0,
  corroborated: 0,
  confirmed: 0,
};
const definitions = new Map();
const verifiedCitations = [];
const verifyCitation = (citation, context) => {
  assert(declaredUrls.has(citation.url), `${context} source closure`);
  assert(citation.locator, `${context} citation locator`);
  assert(citation.note, `${context} citation evidence note`);
  const separator = " — ";
  const anchorStart = citation.locator.lastIndexOf(separator);
  assert.notEqual(
    anchorStart,
    -1,
    `${context} locator contains exact-evidence separator`,
  );
  const exactAnchor = citation.locator.slice(anchorStart + separator.length);
  const normalizedAnchor = normalizedText(exactAnchor);
  const anchorTokenCount = normalizedAnchor.split(" ").length;
  assert(anchorTokenCount >= 3, `${context} exact anchor is claim-specific`);
  weakestExactAnchorTokens = Math.min(
    weakestExactAnchorTokens,
    anchorTokenCount,
  );
  const sourceName = sourceFileByUrl.get(citation.url);
  assert(
    normalizedText(normalized.get(sourceName)).includes(normalizedAnchor),
    `${context} exact locator resolves in ${sourceName}: ${exactAnchor}`,
  );
  verifiedCitations.push(citation);
};
for (const event of bundle.events) {
  for (const citation of event.citations) {
    citationReferences += 1;
    verifyCitation(citation, `${event.target.routeAlias} event`);
  }
  for (const block of event.article?.blocks || []) {
    for (const citation of block.citations || []) {
      citationReferences += 1;
      verifyCitation(citation, `${event.target.routeAlias} article`);
    }
  }
  for (const change of event.changes) {
    occurrenceCount += 1;
    assert(change.citations.length > 0, `${change.key} has claim citations`);
    for (const citation of change.citations) {
      citationReferences += 1;
      verifyCitation(citation, change.key);
      if (archiveUrls.has(citation.url)) {
        const isTranscript =
          /Credited reproduction of Apple developer material/i.test(
            citation.note,
          );
        assert(
          isTranscript ||
            (citation.locator.startsWith("Observed — ") &&
              /Independent corroboration/i.test(citation.note)),
          `${change.key} distinguishes archived note custody from publisher observation`,
        );
      }
    }
    assert(
      ["documented", "partiallyDocumented", "undocumented"].includes(
        change.documentedStatus,
      ),
      `${change.key} documented state`,
    );
    assert(
      ["reported", "corroborated", "confirmed"].includes(change.evidenceState),
      `${change.key} evidence state`,
    );
    evidenceStateCounts[change.evidenceState] += 1;
    if (change.evidenceState === "corroborated") {
      assert(
        new Set(
          change.citations.map(
            (citation) => sourceByUrl.get(citation.url).publisher,
          ),
        ).size >= 2,
        `${change.key} corroboration uses independent publishers`,
      );
    }
    const definition = {
      title: change.title,
      canonicalSummary: change.canonicalSummary,
      category: change.category,
    };
    const previous = definitions.get(change.key);
    if (previous) assert.deepEqual(definition, previous, change.key);
    else definitions.set(change.key, definition);
  }
}
assert.equal(occurrenceCount, 75, "selected occurrence count");
assert.equal(definitions.size, 47, "stable change-definition count");
assert.equal(citationReferences, 158, "citation-reference count");
assert.deepEqual(
  evidenceStateCounts,
  { reported: 55, corroborated: 20, confirmed: 0 },
  "exact evidence-state distribution",
);
assert.deepEqual(
  new Set(verifiedCitations.map((citation) => citation.url)),
  declaredUrls,
  "every declared source is used",
);

const reusedPublicKeys = new Set([
  "ios-7-1-siri-listening-voices",
  "ios-7-1-itunes-radio-discovery-purchasing",
]);
for (const key of reusedPublicKeys) {
  const owned = [
    ...(publicOwner.versions || []),
    ...(publicOwner.events || []),
    ...(publicOwner.builds || []),
  ]
    .flatMap((owner) => owner.changes || [])
    .find((change) => change.key === key);
  assert(owned, `${key} approved Public definition`);
  assert.deepEqual(
    definitions.get(key),
    {
      title: owned.title,
      canonicalSummary: owned.canonicalSummary,
      category: owned.category,
    },
    `${key} exact Public-definition reuse`,
  );
}
const localDefinitionKeys = [...definitions.keys()].filter(
  (key) => !reusedPublicKeys.has(key),
);
assert.equal(localDefinitionKeys.length, 45, "new local definition count");
assert(
  localDefinitionKeys.every((key) => key.startsWith("ios-7-1-")),
  "all new definitions use the iOS 7.1 namespace",
);

const finalDeveloperUrl =
  "https://developer.apple.com/library/archive/releasenotes/General/RN-iOSSDK-7.1/index.html";
const finalDeveloperAllowedKeys = new Set([
  "ios-7-1-prerelease-btserver-attachment",
  "ios-7-1-prerelease-cfnetwork-gzip-length-compatibility",
  "ios-7-1-prerelease-safari-minimal-ui",
  "ios-7-1-siri-listening-voices",
  "ios-7-1-prerelease-uibarbutton-background",
  "ios-7-1-prerelease-uikit-baseline-constraints",
  "ios-7-1-prerelease-back-indicator-mask",
]);
for (const event of bundle.events) {
  for (const change of event.changes) {
    if (
      change.citations.some((citation) => citation.url === finalDeveloperUrl)
    ) {
      assert.equal(
        event.target.routeAlias,
        "beta-5",
        `${change.key} uses final Apple material only at the cumulative endpoint`,
      );
      assert(
        finalDeveloperAllowedKeys.has(change.key),
        `${change.key} is an allowed final-document corroboration`,
      );
    }
  }
}
assert.equal(
  bundle.sources.find((source) => source.url === finalDeveloperUrl)
    ?.sourceClass,
  "developerDocs",
  "surviving Apple release notes retain first-party custody",
);

const candidateRouteKeys = new Set(
  bundle.events.map(
    (event) => `${event.target.releaseVersionId}\0${event.target.routeAlias}`,
  ),
);
const candidateStableIds = new Set(
  bundle.events.map((event) => event.identity.stableEventId),
);
for (const name of readdirSync(here).filter(
  (entry) =>
    entry.endsWith(".json") && entry !== "apple-ios-7-point-prerelease.json",
)) {
  const other = JSON.parse(readFileSync(join(here, name), "utf8"));
  for (const event of other.events || []) {
    const routeKey =
      event.target?.releaseVersionId && event.target?.routeAlias
        ? `${event.target.releaseVersionId}\0${event.target.routeAlias}`
        : undefined;
    assert(
      !routeKey || !candidateRouteKeys.has(routeKey),
      `${name} route collision`,
    );
    assert(
      !event.identity?.stableEventId ||
        !candidateStableIds.has(event.identity.stableEventId),
      `${name} stable-event collision`,
    );
  }
  for (const owner of [
    ...(other.versions || []),
    ...(other.events || []),
    ...(other.builds || []),
  ]) {
    for (const change of owner.changes || []) {
      const candidate = definitions.get(change.key);
      if (!candidate) continue;
      assert.deepEqual(
        {
          title: change.title,
          canonicalSummary: change.canonicalSummary,
          category: change.category,
        },
        candidate,
        `${name} ${change.key} global definition`,
      );
    }
  }
}

const recurrence = new Map();
for (const event of bundle.events) {
  for (const change of event.changes) {
    recurrence.set(change.key, [
      ...(recurrence.get(change.key) || []),
      `${event.target.routeAlias}:${change.action}:${change.inheritance}`,
    ]);
  }
}
const expectedRecurrence = new Map([
  [
    "ios-7-1-prerelease-btserver-attachment",
    [
      "beta-1:knownIssue:delta",
      "beta-2:knownIssue:cumulative",
      "beta-3:knownIssue:cumulative",
      "beta-4:knownIssue:cumulative",
      "beta-5:knownIssue:cumulative",
    ],
  ],
  [
    "ios-7-1-prerelease-cfnetwork-gzip-length-compatibility",
    [
      "beta-1:introduced:delta",
      "beta-2:introduced:cumulative",
      "beta-3:introduced:cumulative",
      "beta-4:introduced:cumulative",
      "beta-5:introduced:cumulative",
    ],
  ],
  [
    "ios-7-1-prerelease-uikit-baseline-constraints",
    [
      "beta-1:knownIssue:delta",
      "beta-2:knownIssue:cumulative",
      "beta-3:knownIssue:cumulative",
      "beta-4:knownIssue:cumulative",
      "beta-5:knownIssue:cumulative",
    ],
  ],
  [
    "ios-7-1-prerelease-back-indicator-mask",
    [
      "beta-1:knownIssue:delta",
      "beta-2:knownIssue:cumulative",
      "beta-3:knownIssue:cumulative",
      "beta-4:knownIssue:cumulative",
      "beta-5:knownIssue:cumulative",
    ],
  ],
  [
    "ios-7-1-prerelease-safari-minimal-ui",
    [
      "beta-2:introduced:delta",
      "beta-3:introduced:cumulative",
      "beta-4:introduced:cumulative",
      "beta-5:introduced:cumulative",
    ],
  ],
  [
    "ios-7-1-prerelease-crash-log-settings",
    ["beta-1:knownIssue:delta", "beta-2:fixed:delta"],
  ],
  [
    "ios-7-1-prerelease-large-music-library-load",
    ["beta-1:knownIssue:delta", "beta-2:fixed:delta"],
  ],
  [
    "ios-7-1-prerelease-dark-keyboard",
    ["beta-1:introduced:delta", "beta-2:removed:delta"],
  ],
  [
    "ios-7-1-prerelease-icloud-keychain-setup",
    ["beta-2:knownIssue:delta", "beta-3:fixed:delta"],
  ],
  [
    "ios-7-1-prerelease-audiobook-playback",
    ["beta-2:knownIssue:delta", "beta-3:fixed:delta"],
  ],
  [
    "ios-7-1-prerelease-imessage-false-failure",
    ["beta-3:knownIssue:delta", "beta-4:fixed:delta"],
  ],
  [
    "ios-7-1-prerelease-uibarbutton-background",
    ["beta-4:knownIssue:delta", "beta-5:knownIssue:cumulative"],
  ],
  [
    "ios-7-1-prerelease-wallpaper-parallax-control",
    ["beta-3:introduced:delta", "beta-5:changed:delta"],
  ],
  [
    "ios-7-1-prerelease-calendar-list-control",
    ["beta-2:introduced:delta", "beta-5:changed:delta"],
  ],
]);
for (const [key, states] of expectedRecurrence) {
  assert.deepEqual(recurrence.get(key), states, `${key} recurrence`);
}
assert.equal(
  [...recurrence.values()].filter((states) => states.length > 1).length,
  expectedRecurrence.size,
  "exact repeated definition count",
);

const words = (value) =>
  collapse(value)
    .toLowerCase()
    .match(/[a-z0-9][a-z0-9._:$-]*/g) || [];
const sourceTokens = new Map();
const fourGramPositions = new Map();
for (const [url, name] of sourceFileByUrl) {
  const tokens = words(normalized.get(name));
  sourceTokens.set(url, tokens);
  const positions = new Map();
  for (let index = 0; index + 4 <= tokens.length; index += 1) {
    const gram = tokens.slice(index, index + 4).join("|");
    const starts = positions.get(gram);
    if (starts) starts.push(index);
    else positions.set(gram, [index]);
  }
  fourGramPositions.set(url, positions);
}

const editorialStrings = [];
for (const event of bundle.events) {
  editorialStrings.push(event.summary);
  for (const block of event.article?.blocks || []) {
    editorialStrings.push(block.text);
  }
  for (const change of event.changes) {
    for (const field of [
      "title",
      "canonicalSummary",
      "summary",
      "verificationMethod",
    ]) {
      editorialStrings.push(change[field]);
    }
  }
}
assert(
  editorialStrings.every((value) => typeof value === "string" && value),
  "reader-facing fields are nonempty strings",
);
assert.equal(editorialStrings.length, 335, "copyright field count");

let maximumOverlapWords = 0;
let overlapPhrase = "";
let overlapSource = "";
let overlapEditorial = "";
for (const editorial of editorialStrings) {
  const editorialTokens = words(editorial);
  for (const [url, tokens] of sourceTokens) {
    const positions = fourGramPositions.get(url);
    for (let start = 0; start + 4 <= editorialTokens.length; start += 1) {
      const gram = editorialTokens.slice(start, start + 4).join("|");
      for (const sourceStart of positions.get(gram) || []) {
        let length = 4;
        while (
          start + length < editorialTokens.length &&
          sourceStart + length < tokens.length &&
          editorialTokens[start + length] === tokens[sourceStart + length]
        ) {
          length += 1;
        }
        if (length > maximumOverlapWords) {
          maximumOverlapWords = length;
          overlapPhrase = editorialTokens
            .slice(start, start + length)
            .join(" ");
          overlapSource = url;
          overlapEditorial = editorial;
        }
      }
    }
  }
}
assert(
  maximumOverlapWords <= 5,
  `copyright overlap exceeds 5 words: "${overlapPhrase}" from ${overlapSource} in "${overlapEditorial}"`,
);
assert.equal(maximumOverlapWords, 4, "recorded copyright overlap result");

const rawBytes = [...buffers.values()].reduce(
  (total, buffer) => total + buffer.byteLength,
  0,
);
assert.equal(rawBytes, 2_903_480, "evidence corpus byte count");

console.log(
  [
    "iOS 7 point-release prerelease evidence audit passed",
    `raw artifacts: ${buffers.size}`,
    `raw bytes: ${rawBytes}`,
    `normalized artifacts: ${normalized.size}`,
    "route identities: iOS 7.1 Beta 1–5",
    "bounded route gaps: no retained developer GM identity and no retained external point-release seed identity outside iOS 7.1",
    `selected occurrences/definitions/repeated: ${occurrenceCount}/${definitions.size}/${expectedRecurrence.size}`,
    `evidence states reported/corroborated/confirmed: ${evidenceStateCounts.reported}/${evidenceStateCounts.corroborated}/${evidenceStateCounts.confirmed}`,
    `citation references: ${citationReferences}`,
    `shortest exact locator anchor: ${weakestExactAnchorTokens} normalized tokens`,
    `copyright fields: ${editorialStrings.length}`,
    `maximum contiguous source overlap: ${maximumOverlapWords} words`,
    `longest overlap phrase: ${overlapPhrase}`,
  ].join("\n"),
);
