import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";

import { JSDOM, VirtualConsole } from "jsdom";

const [bundlePath, rawDirectory] = process.argv.slice(2);
if (!bundlePath || !rawDirectory) {
  throw new Error(
    "Usage: audit-ios6-point-prerelease-html-states.mjs BUNDLE RAW_DIRECTORY",
  );
}

const U = {
  mr601Carrier:
    "https://www.macrumors.com/2012/10/22/apple-testing-ios-6-0-1-with-fixes-for-keyboard-screen-glitch-camera-flash-issues-and-more/",
  mr61Beta1:
    "https://www.macrumors.com/2012/11/01/apple-seeds-first-ios-6-1-beta-to-developers/",
  idb61Beta1: "https://www.idownloadblog.com/2012/11/01/ios-6-1-beta/",
  nine61Fandango:
    "https://9to5mac.com/2012/11/04/apple-to-bring-movie-ticket-purchasing-to-siri-with-upcoming-ios-6-1-update/",
  mr61Fandango:
    "https://www.macrumors.com/2012/11/05/ios-6-1-to-add-siri-based-movie-ticket-purchases-via-fandango/",
  mr61Beta2:
    "https://www.macrumors.com/2012/11/12/apple-seeds-second-ios-6-1-beta-to-developers/",
  idb61Beta2: "https://www.idownloadblog.com/2012/11/12/ios-6-1-beta-2-is-out/",
  nine61Beta2:
    "https://9to5mac.com/2012/11/12/apple-releases-ios-6-1-beta-2-to-developers/",
  nine61Beta3:
    "https://9to5mac.com/2012/12/03/apple-seeds-ios-6-1-beta-3-to-developers/",
  ticker61Beta3:
    "https://www.iphone-ticker.de/ios-6-1-apple-veroffentlicht-dritte-vorabversion-41043/",
  iphonote61Beta3:
    "https://www.iphonote.com/actu/36369/ios-6-1-beta-3-toutes-les-ameliorations-et-corrections-de-bugs-listees",
  cult61Beta3:
    "https://www.cultofmac.com/news/heres-whats-new-in-apples-latest-ios-6-1-beta",
  mr61Beta4:
    "https://www.macrumors.com/2012/12/17/apple-seeds-fourth-ios-6-1-beta-to-developers/",
  ticker61Beta4:
    "https://www.iphone-ticker.de/ios-6-1-apple-veroffentlicht-vierte-vorabversion-41721/",
  mr61Beta5:
    "https://www.macrumors.com/2013/01/26/apple-seeds-ios-6-1-beta-5-to-developers/",
  mr61Manifest:
    "https://www.macrumors.com/2013/01/27/ios-6-1-beta-5-code-hints-at-upcoming-128-gb-devices/",
  mr61Public:
    "https://www.macrumors.com/2013/01/28/apple-releases-ios-6-1-with-new-lte-carriers-and-fandango-siri-integration/",
  mr611Beta1:
    "https://www.macrumors.com/2013/02/06/apple-seeds-first-beta-of-ios-6-1-1-to-developers/",
  nine611Beta1:
    "https://9to5mac.com/2013/02/06/apple-releases-ios-6-1-1-beta-to-developers-for-iphone-ipad-and-ipod-touch/",
  nine611Rename:
    "https://9to5mac.com/2013/02/11/apple-releases-ios-6-1-1-for-iphone-4s-to-address-bugs/",
  nine611Evasi0n:
    "https://9to5mac.com/2013/02/07/first-ios-6-1-1-beta-does-not-break-recently-released-evasi0n-jailbreak/",
  nine613Beta2:
    "https://9to5mac.com/2013/02/21/apple-releases-ios-6-1-3-beta-2-to-developers-for-ipad-iphone-and-ipod-touch/",
  mr613Beta2:
    "https://www.macrumors.com/2013/02/21/apple-seeds-ios-6-1-3-beta-2-to-developers/",
  nine613Evasi0n:
    "https://9to5mac.com/2013/02/25/apple-patches-exploits-in-ios-6-1-3-beta-2-that-break-evasi0n-jailbreak/",
  mr613Evasi0n:
    "https://www.macrumors.com/2013/02/25/ios-6-1-3-beta-2-fixes-exploits-used-for-evasi0n-jailbreak/",
};

const rawSpecs = new Map([
  [
    U.mr601Carrier,
    [
      "macrumors-601-carrier.html",
      126_640,
      "f2c8dc092b878d032bafdad8511f5421c9eb087e569af7d622fee4707b7fd537",
      ["Apple Testing iOS 6.0.1", "carrier testing of iOS 6.0.1"],
    ],
  ],
  [
    U.mr61Beta1,
    [
      "macrumors-61-beta1.html",
      123_665,
      "70eaee005f9c9366296e816e1bd428bde42478818009ae34db7f1ac8004b7f97",
      ["first beta of iOS 6.1", "10B5095f"],
    ],
  ],
  [
    U.idb61Beta1,
    [
      "idownloadblog-61-beta1.html",
      211_106,
      "0073de900255008021d05f8ad59e2f678d52e38144a675291470a5c8365a2e47",
      ["iOS 6.1 Beta", "map-based addresses and points of interest"],
    ],
  ],
  [
    U.nine61Fandango,
    [
      "9to5-61-fandango.html",
      144_834,
      "b5a30f1db481946a7d41f36e2bf806399256a4afbf0398ba756ecc31e8e0ba1d",
      ["movie tickets", "Fandango"],
    ],
  ],
  [
    U.mr61Fandango,
    [
      "macrumors-61-fandango.html",
      123_540,
      "2b7241aa389bc7da0c84b5d741579985f5b2205ec238e4a028624bfe091aee9e",
      ["movie ticket purchases", "Fandango"],
    ],
  ],
  [
    U.mr61Beta2,
    [
      "macrumors-61-beta2.html",
      124_762,
      "6eae07c543692c9c826127773fb86e1fa0159352f937a9a6a3f6a83cd7a105e0",
      ["second beta of iOS 6.1", "10B5105c"],
    ],
  ],
  [
    U.idb61Beta2,
    [
      "idownloadblog-61-beta2.html",
      218_432,
      "5cc5fa82c6b024ceebc6fa849d604f4f375d1f74a30394343646aba2b442e746",
      ["iOS 6.1 Beta 2", "iTunes Match"],
    ],
  ],
  [
    U.nine61Beta2,
    [
      "9to5-61-beta2.html",
      142_307,
      "c0ff7bb305b3b38fa10943217fa07d71bccacdd8087056d387f69dfd95a499a5",
      ["iOS 6.1 beta 2", "Panorama"],
    ],
  ],
  [
    U.nine61Beta3,
    [
      "9to5-61-beta3.html",
      142_447,
      "cd285e88b3e8b5d474d5aef61a4b38bb0825b66d8c67a1f50e912a394709383c",
      ["third beta", "iOS 6.1"],
    ],
  ],
  [
    U.ticker61Beta3,
    [
      "iphone-ticker-61-beta3.html",
      276_317,
      "856b876602523b7011daeea60ff559fdc72d07adfa861b6184fe000a2932198c",
      ["iOS SDK 6.1 beta 3", "NSTextAlignmentJustified"],
    ],
  ],
  [
    U.iphonote61Beta3,
    [
      "iphonote-61-beta3.html",
      204_141,
      "b87a0ad035110a96493ced2bd00734b9f0a0455f007932439b84c2247ba129ff",
      ["iOS 6.1 bêta 3", "NSTextAlignmentNatural"],
    ],
  ],
  [
    U.cult61Beta3,
    [
      "cultofmac-61-beta3.html",
      289_271,
      "636a8a2a9da14feedebb3a03765e931af1e7865ef0886bbed1a9ba41625bd5b6",
      ["iOS 6.1 Beta 3", "Voice Dial Only"],
    ],
  ],
  [
    U.mr61Beta4,
    [
      "macrumors-61-beta4.html",
      122_747,
      "6aefdd254d479b6cb61d7fb9015ea0f7242da7a7dcafc8e592fb04e0503c0378",
      ["fourth beta of iOS 6.1", "10B5126b"],
    ],
  ],
  [
    U.ticker61Beta4,
    [
      "iphone-ticker-61-beta4.html",
      271_684,
      "d7255f9e31b916554660d9112e96a203efe31f8d4599a83ef74b2821ec608b3b",
      [
        "iOS SDK 6.1 beta 4",
        "Fixed: This release does not support testing In-App Purchase",
      ],
    ],
  ],
  [
    U.mr61Beta5,
    [
      "macrumors-61-beta5.html",
      123_786,
      "54bf3f80231995eb8dc0df7495247b3cb06ad9394b67cb3c457ae0c2c6c6cd86",
      ["fifth beta of iOS 6.1", "January 26, 2013"],
    ],
  ],
  [
    U.mr61Manifest,
    [
      "macrumors-61-128gb.html",
      123_766,
      "954ef1eaac4eb17a208da0bf9e209bd8b083362c1563645756aaeac977d22bd1",
      ["SystemPartitionPadding", "128"],
    ],
  ],
  [
    U.mr61Public,
    [
      "macrumors-61-public.html",
      124_375,
      "82cb2e140e8284812b7ac23abc4dd0859ec2571fad24ea6e114d8baf9cab3d26",
      ["released iOS 6.1", "Beta 5 to developers"],
    ],
  ],
  [
    U.mr611Beta1,
    [
      "macrumors-611-beta1.html",
      124_379,
      "7d0dd933d71c4b8d7428a4ea1ee6db29a0d1fd81988ce98d1d0d044f12a4b8fa",
      ["first beta version of iOS 6.1.1", "10B311"],
    ],
  ],
  [
    U.nine611Beta1,
    [
      "9to5-611-beta1.html",
      145_117,
      "79d38bf44f7374e9d7417df6ecde0d38ee73e323b1bd75bb4d427356b244b3e4",
      ["iOS 6.1.1 beta", "Maps for Japan"],
    ],
  ],
  [
    U.nine611Rename,
    [
      "9to5-611-public-rename.html",
      144_436,
      "633a50ee585d0d8aa864d3046d6c84012806c5ab23683b0d024ff5d02536397a",
      [
        "iOS 6.1.1",
        "renamed to a different version with the next developer release",
      ],
    ],
  ],
  [
    U.nine611Evasi0n,
    [
      "9to5-611-evasi0n.html",
      144_466,
      "397440fef1a8326158bad62b9471ab3b4d1eb767a6fc09f61725a7433bf80160",
      ["does not break recently released evasi0n jailbreak", "evasi0n"],
    ],
  ],
  [
    U.nine613Beta2,
    [
      "9to5-613-beta2.html",
      144_205,
      "98d5c5342dcbf0c0ed5c071c514187159ab31b13a1c8fe62bd5e2be514b7ba9f",
      ["iOS 6.1.3 beta 2", "Lock Screen bug"],
    ],
  ],
  [
    U.mr613Beta2,
    [
      "macrumors-613-beta2.html",
      126_540,
      "57a1a324fda9de4de653114ea9bf49adfa12e16427d1121f28ab295da3e10767",
      ["iOS 6.1.3 beta 2", "Passcode Lock Bug"],
    ],
  ],
  [
    U.nine613Evasi0n,
    [
      "9to5-613-evasi0n.html",
      146_394,
      "3691b20f74873d63ba9616b20921b358cc10cdaf7b0f1a5eda30f103c6e575ad",
      ["time zone setting", "evasi0n"],
    ],
  ],
  [
    U.mr613Evasi0n,
    [
      "macrumors-613-evasi0n.html",
      126_309,
      "2b535d8578eba5eaf71de02649db7351d15ac6d2ba9bd1aa85431be7d63808b2",
      ["time zone settings", "evasi0n"],
    ],
  ],
]);
const excludedRawArtifacts = new Map([
  [
    "apple-support-ios6.html",
    [
      1_169_945,
      "7f8423a8084cd970d7eb20e96a1b370c7b95e546399575e05013b9677a366fba",
      "exploratory Public cumulative notes",
    ],
  ],
  [
    "mactrast-61-beta4.html",
    [
      148_993,
      "ca276ea87f58be8b2eafe6fc8546873f389707efbee67df6397478e8058e1ee2",
      "exploratory duplicate Beta 4 identity coverage",
    ],
  ],
]);

const normalize = (value) =>
  value
    .normalize("NFKC")
    .replace(/&(?:amp;)?#(?:x([0-9a-f]+)|([0-9]+));/gi, (_, hex, decimal) =>
      String.fromCodePoint(Number.parseInt(hex || decimal, hex ? 16 : 10)),
    )
    .replace(/[“”]/g, '"')
    .replace(/[‘’]/g, "'")
    .replace(/[®™©]/g, "")
    .replace(/[\u2010-\u2015]/g, "-")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();
const documentForRaw = (raw) => {
  const virtualConsole = new VirtualConsole();
  return new JSDOM(raw.toString("utf8"), { virtualConsole }).window.document;
};

const bundle = JSON.parse(readFileSync(bundlePath, "utf8"));
const retainedFilenames = [...rawSpecs.values()].map(([filename]) => filename);
const actualFilenames = readdirSync(rawDirectory, { withFileTypes: true })
  .filter((entry) => entry.isFile())
  .map((entry) => entry.name)
  .sort();
const expectedFilenames = [
  ...retainedFilenames,
  ...excludedRawArtifacts.keys(),
].sort();
assert.deepEqual(
  actualFilenames,
  expectedFilenames,
  "The raw evidence directory gained, lost, or renamed an artifact.",
);

let excludedRawBytes = 0;
for (const [filename, [expectedBytes, expectedSha]] of excludedRawArtifacts) {
  const path = join(rawDirectory, filename);
  const raw = readFileSync(path);
  const bytes = statSync(path).size;
  const sha = createHash("sha256").update(raw).digest("hex");
  assert.equal(bytes, expectedBytes, `${filename} byte size changed.`);
  assert.equal(sha, expectedSha, `${filename} hash changed.`);
  excludedRawBytes += bytes;
}

const normalizedTextByUrl = new Map();
const rawDocumentByUrl = new Map();
let retainedRawBytes = 0;
for (const [url, [filename, expectedBytes, expectedSha, markers]] of rawSpecs) {
  const path = join(rawDirectory, filename);
  const raw = readFileSync(path);
  const bytes = statSync(path).size;
  const sha = createHash("sha256").update(raw).digest("hex");
  if (bytes !== expectedBytes || sha !== expectedSha) {
    throw new Error(
      `${filename} changed: bytes=${bytes}/${expectedBytes}; sha=${sha}/${expectedSha}.`,
    );
  }
  const document = documentForRaw(raw);
  const text = normalize(document.body.textContent);
  const missingMarkers = markers.filter(
    (marker) => !text.includes(normalize(marker)),
  );
  if (missingMarkers.length > 0) {
    throw new Error(`${filename} is missing markers: ${missingMarkers}.`);
  }
  rawDocumentByUrl.set(url, document);
  normalizedTextByUrl.set(url, text);
  retainedRawBytes += bytes;
}

const declaredSourceUrls = bundle.sources.map((source) => source.url);
assert.equal(bundle.sources.length, 25, "The declared source count changed.");
assert.equal(
  new Set(declaredSourceUrls).size,
  bundle.sources.length,
  "A source URL is declared more than once.",
);
assert.deepEqual(
  [...declaredSourceUrls].sort(),
  [...rawSpecs.keys()].sort(),
  "The bundle source set no longer closes over retained raw evidence.",
);
for (const source of bundle.sources) {
  assert.ok(source.title, `${source.url} lost its title.`);
  assert.ok(source.publisher, `${source.url} lost its publisher.`);
  assert.ok(source.author, `${source.url} lost its author attribution.`);
  assert.ok(
    ["journalism", "archive"].includes(source.sourceClass),
    `${source.url} has an unexpected source class.`,
  );
  assert.ok(
    Array.isArray(source.topics) && source.topics.length > 0,
    `${source.url} lost topic metadata.`,
  );
}

const collectDatePublished = (value, results) => {
  if (Array.isArray(value)) {
    value.forEach((item) => collectDatePublished(item, results));
    return;
  }
  if (!value || typeof value !== "object") return;
  for (const [key, item] of Object.entries(value)) {
    if (
      ["datePublished", "dateCreated", "uploadDate"].includes(key) &&
      typeof item === "string"
    ) {
      results.push(item);
    }
    collectDatePublished(item, results);
  }
};
const publicationDates = (document) => {
  const values = [];
  for (const selector of [
    'meta[property="article:published_time"]',
    'meta[name="article:published_time"]',
    'meta[itemprop="datePublished"]',
  ]) {
    for (const node of document.querySelectorAll(selector)) {
      if (node.getAttribute("content"))
        values.push(node.getAttribute("content"));
    }
  }
  for (const node of document.querySelectorAll("time[datetime]")) {
    values.push(node.getAttribute("datetime"));
  }
  for (const node of document.querySelectorAll(
    'script[type="application/ld+json"]',
  )) {
    try {
      collectDatePublished(JSON.parse(node.textContent), values);
    } catch {
      // Non-JSON script fragments are not publication metadata.
    }
  }
  return new Set(
    values
      .map((value) => Date.parse(value))
      .filter(Number.isFinite)
      .map((value) => new Date(value).toISOString()),
  );
};
let publicationTimestampAssertions = 0;
for (const source of bundle.sources) {
  const expected = new Date(source.publishedAt).toISOString();
  const observed = publicationDates(rawDocumentByUrl.get(source.url));
  assert.ok(
    observed.has(expected),
    `${source.url} lacks declared publication timestamp ${expected}; observed ${[
      ...observed,
    ].join(", ")}.`,
  );
  publicationTimestampAssertions += 1;
}

let communityTranscriptAssertions = 0;
const assertCommunityTranscript = ({
  url,
  commentId,
  author,
  datetime,
  phrases,
}) => {
  const document = rawDocumentByUrl.get(url);
  const comment = document.querySelector(`#${commentId}`);
  if (!comment) throw new Error(`Missing preserved community ${commentId}.`);
  communityTranscriptAssertions += 1;
  const container = comment.closest("li");
  if (
    !container ||
    normalize(container.querySelector(".comment-author")?.textContent || "") !==
      normalize(author) ||
    container.querySelector("time")?.getAttribute("datetime") !== datetime
  ) {
    throw new Error(`Attribution changed for preserved ${commentId}.`);
  }
  communityTranscriptAssertions += 1;
  const commentText = normalize(comment.textContent);
  const missing = phrases.filter(
    (phrase) => !commentText.includes(normalize(phrase)),
  );
  if (missing.length > 0) {
    throw new Error(`${commentId} is missing transcript phrases: ${missing}.`);
  }
  communityTranscriptAssertions += 1;
};
assertCommunityTranscript({
  url: U.ticker61Beta3,
  commentId: "comment-419684",
  author: "Robo.Term",
  datetime: "2012-12-04T08:50:27+01:00",
  phrases: [
    "The following issues relate to using iOS SDK 6.1 beta 3",
    "NSTextAlignmentJustified or NSTextAlignmentNatural",
  ],
});
assertCommunityTranscript({
  url: U.ticker61Beta4,
  commentId: "comment-423669",
  author: "MichiBoa",
  datetime: "2012-12-17T19:26:32+01:00",
  phrases: [
    "iOS SDK Release Notes for iOS 6.1 beta 4",
    "Fixed: This release does not support testing In-App Purchase",
  ],
});
const iphonoteArticle = rawDocumentByUrl
  .get(U.iphonote61Beta3)
  .querySelector(".td-post-content");
if (
  !iphonoteArticle ||
  !normalize(iphonoteArticle.textContent).includes(
    normalize("NSTextAlignmentJustified or NSTextAlignmentNatural"),
  )
) {
  throw new Error("The iPhonote Beta 3 article transcript is missing.");
}
communityTranscriptAssertions += 1;

const citationScopeByUrl = new Map();
let articleScopeAssertions = 0;
for (const [url, document] of rawDocumentByUrl) {
  const selector = url.includes("9to5mac.com")
    ? ".post-content"
    : url === U.iphonote61Beta3
      ? ".td-post-content"
      : "article";
  const primary = document.querySelector(selector);
  assert.ok(primary, `${url} lacks primary article selector ${selector}.`);
  const extra =
    url === U.ticker61Beta3
      ? document.querySelector("#comment-419684")
      : url === U.ticker61Beta4
        ? document.querySelector("#comment-423669")
        : undefined;
  citationScopeByUrl.set(
    url,
    normalize(`${primary.textContent} ${extra?.textContent || ""}`),
  );
  articleScopeAssertions += 1;
}

const expectedRoutes = [
  {
    key: "version-ios-6-1/beta-1",
    label: "Beta 1",
    date: "2012-11-01",
    sequence: 1,
    stableEventId: "event:apple:ios:6.1:beta-1",
    count: 5,
  },
  {
    key: "version-ios-6-1/beta-2",
    label: "Beta 2",
    date: "2012-11-12",
    sequence: 2,
    stableEventId: "event:apple:ios:6.1:beta-2",
    count: 7,
  },
  {
    key: "version-ios-6-1/beta-3",
    label: "Beta 3",
    date: "2012-12-03",
    sequence: 3,
    stableEventId: "event:apple:ios:6.1:beta-3",
    count: 9,
  },
  {
    key: "version-ios-6-1/beta-4",
    label: "Beta 4",
    date: "2012-12-17",
    sequence: 4,
    stableEventId: "event:apple:ios:6.1:beta-4",
    count: 4,
  },
  {
    key: "version-ios-6-1/beta-5",
    label: "Beta 5",
    date: "2013-01-26",
    sequence: 5,
    stableEventId: "event:apple:ios:6.1:beta-5",
    count: 1,
  },
  {
    key: "version-ios-6-1-1/beta-1",
    label: "Beta 1",
    date: "2013-02-06",
    sequence: 1,
    stableEventId: "event:apple:ios:6.1.1:beta-1",
    count: 2,
  },
  {
    key: "version-ios-6-1-3/beta-2",
    label: "Beta 2",
    date: "2013-02-21",
    sequence: 2,
    stableEventId: "event:apple:ios:6.1.3:beta-2",
    count: 3,
  },
];
assert.deepEqual(
  bundle.target,
  { projectId: "lh3yswzu", dataset: "production" },
  "The inert bundle target changed.",
);
assert.deepEqual(bundle.versions, [], "Version overlays are forbidden.");
assert.deepEqual(bundle.builds, [], "Build documents are forbidden.");
assert.equal(bundle.events.length, expectedRoutes.length);

const counts = new Map(
  bundle.events.map((event) => [
    `${event.identity?.releaseVersionId}/${event.identity?.routeAlias}`,
    event.changes?.length || 0,
  ]),
);
assert.equal(counts.size, expectedRoutes.length, "A route is duplicated.");
for (const expected of expectedRoutes) {
  const event = bundle.events.find(
    (candidate) =>
      `${candidate.identity?.releaseVersionId}/${candidate.identity?.routeAlias}` ===
      expected.key,
  );
  assert.ok(event, `Missing route ${expected.key}.`);
  const [releaseVersionId, routeAlias] = expected.key.split("/");
  assert.deepEqual(
    event.target,
    { releaseVersionId, routeAlias },
    `${expected.key} target drifted.`,
  );
  assert.equal(event.identity.releaseVersionId, releaseVersionId);
  assert.equal(event.identity.routeAlias, routeAlias);
  assert.equal(event.identity.platformId, "platform-ios");
  assert.equal(event.identity.stableEventId, expected.stableEventId);
  assert.equal(event.identity.label, expected.label);
  assert.equal(event.identity.channel, "developerBeta");
  assert.equal(event.identity.appearanceDate, expected.date);
  assert.equal(event.identity.sequence, expected.sequence);
  assert.equal(event.identity.isRevision, false);
  assert.equal(event.identity.availabilityState, "available");
  assert.equal(event.identity.closesReleaseCycle, false);
  assert.equal(event.authorship, "originalSynthesis");
  assert.equal(event.article?.authorship, "originalSynthesis");
  assert.equal(event.provenanceStatus, "editoriallyVerified");
  assert.deepEqual(event.editorialReview, {
    status: "approved",
    reviewedAt: "2026-07-30T13:38:37Z",
  });
  assert.equal(event.isIndexable, true);
  assert.equal(event.changes.length, expected.count);
  assert.ok(event.citations.length > 0);
  assert.ok(event.article.blocks.length >= 4);
  assert.deepEqual(
    event.article.blocks
      .filter((block) => block.style === "h2")
      .map((block) => block.text),
    ["Release identity and boundary", "Selected milestone record"],
  );
}

const routeHistory = (key) =>
  bundle.events
    .flatMap((event) =>
      event.changes
        .filter((change) => change.key === key)
        .map(
          (change) =>
            `${event.identity.releaseVersionId}/${event.identity.routeAlias}:${change.action}:${change.inheritance}`,
        ),
    )
    .sort();
const expectedRecurrences = new Map([
  [
    "ios6-point-prerelease-icloud-storage-plan-changes",
    [
      "version-ios-6-1/beta-1:knownIssue:delta",
      "version-ios-6-1/beta-2:knownIssue:cumulative",
      "version-ios-6-1/beta-3:fixed:delta",
    ],
  ],
  [
    "ios-6-1-advertising-identifier-reset",
    [
      "version-ios-6-1/beta-1:introduced:delta",
      "version-ios-6-1/beta-3:fixed:delta",
    ],
  ],
  [
    "ios6-point-prerelease-simulator-in-app-purchase",
    [
      "version-ios-6-1/beta-2:knownIssue:delta",
      "version-ios-6-1/beta-4:fixed:delta",
    ],
  ],
  [
    "ios6-point-prerelease-evasi0n-jailbreak-path",
    [
      "version-ios-6-1-1/beta-1:knownIssue:delta",
      "version-ios-6-1-3/beta-2:changed:delta",
    ],
  ],
  [
    "ios-6-1-3-maps-japan",
    [
      "version-ios-6-1-1/beta-1:changed:delta",
      "version-ios-6-1-3/beta-2:changed:cumulative",
    ],
  ],
]);
const repeatedKeys = [
  ...new Map(
    bundle.events
      .flatMap((event) => event.changes)
      .map((change) => [change.key, 0]),
  ).keys(),
].filter((key) => routeHistory(key).length > 1);
assert.deepEqual(
  repeatedKeys.sort(),
  [...expectedRecurrences.keys()].sort(),
  "The repeated-history key set changed.",
);
for (const [key, history] of expectedRecurrences) {
  assert.deepEqual(
    routeHistory(key),
    history.sort(),
    `${key} history drifted.`,
  );
}
const cumulativeKeys = bundle.events
  .flatMap((event) => event.changes)
  .filter((change) => change.inheritance === "cumulative")
  .map((change) => change.key)
  .sort();
assert.deepEqual(cumulativeKeys, [
  "ios-6-1-3-maps-japan",
  "ios6-point-prerelease-icloud-storage-plan-changes",
  "ios6-point-prerelease-label-text-alignment",
  "ios6-point-prerelease-mapkit-local-search-coverage",
  "ios6-point-prerelease-state-restoration-launch-image",
  "ios6-point-prerelease-thai-keyboard-layouts",
]);
assert.ok(
  bundle.events
    .flatMap((event) => event.changes)
    .every((change) => change.evidenceState !== "confirmed"),
  "First-party confirmation is forbidden without a retained first-party prerelease artifact.",
);

let locatorAssertions = 0;
let citationReferences = 0;
const usedCitationUrls = new Set();
const missingLocators = [];
const auditCitations = (value, path = "bundle") => {
  if (Array.isArray(value)) {
    value.forEach((item, index) => auditCitations(item, `${path}[${index}]`));
    return;
  }
  if (!value || typeof value !== "object") return;
  for (const [key, item] of Object.entries(value)) {
    if (key === "citations" && Array.isArray(item)) {
      item.forEach((citation, index) => {
        citationReferences += 1;
        usedCitationUrls.add(citation.url);
        const sourceText = citationScopeByUrl.get(citation.url);
        if (!sourceText) {
          missingLocators.push(
            `${path}.citations[${index}]: unmapped ${citation.url}`,
          );
          return;
        }
        const separator = citation.locator?.indexOf(" — ") ?? -1;
        if (separator < 0) {
          missingLocators.push(
            `${path}.citations[${index}]: malformed ${citation.locator}`,
          );
          return;
        }
        const locator = normalize(citation.locator.slice(separator + 3));
        locatorAssertions += 1;
        if (!sourceText.includes(locator)) {
          missingLocators.push(
            `${path}.citations[${index}]: ${citation.url} lacks "${locator}"`,
          );
        }
      });
    } else {
      auditCitations(item, `${path}.${key}`);
    }
  }
};
auditCitations(bundle);
if (missingLocators.length > 0) {
  throw new Error(
    `HTML locator audit failed (${missingLocators.length}):\n${missingLocators.join("\n")}`,
  );
}
assert.equal(
  citationReferences,
  189,
  "The exact citation reference count changed.",
);
assert.equal(
  locatorAssertions,
  189,
  "The exact locator assertion count changed.",
);
assert.deepEqual(
  [...usedCitationUrls].sort(),
  [...declaredSourceUrls].sort(),
  "The citation/source use closure changed.",
);

const stopWords = new Set([
  "a",
  "an",
  "and",
  "apple",
  "as",
  "at",
  "beta",
  "by",
  "for",
  "from",
  "in",
  "into",
  "ios",
  "is",
  "it",
  "of",
  "on",
  "or",
  "seed",
  "that",
  "the",
  "this",
  "to",
  "was",
  "were",
  "with",
]);
const semanticTokens = (value) =>
  new Set(
    (normalize(value).match(/[a-z0-9][a-z0-9._:-]*/g) || []).filter(
      (token) => token.length > 2 && !stopWords.has(token),
    ),
  );
let minimumSemanticTokenOverlap = Number.POSITIVE_INFINITY;
let minimumSemanticTokenKey = "";
for (const change of bundle.events.flatMap((event) => event.changes)) {
  const editorial = semanticTokens(
    `${change.title} ${change.canonicalSummary} ${change.summary}`,
  );
  const locatorTokens = semanticTokens(
    change.citations
      .map((citation) =>
        citation.locator.slice(citation.locator.indexOf(" — ") + 3),
      )
      .join(" "),
  );
  const overlap = [...editorial].filter((token) =>
    locatorTokens.has(token),
  ).length;
  if (overlap < minimumSemanticTokenOverlap) {
    minimumSemanticTokenOverlap = overlap;
    minimumSemanticTokenKey = change.key;
  }
}
assert.ok(
  minimumSemanticTokenOverlap >= 2,
  `${minimumSemanticTokenKey} has fewer than two semantic tokens shared with its exact source locators.`,
);

const editorialStrings = [];
for (const event of bundle.events) {
  if (event.summary) editorialStrings.push(event.summary);
  for (const block of event.article?.blocks || []) {
    if (block.text) editorialStrings.push(block.text);
  }
  for (const change of event.changes || []) {
    for (const key of [
      "title",
      "canonicalSummary",
      "summary",
      "verificationMethod",
    ]) {
      if (change[key]) editorialStrings.push(change[key]);
    }
  }
}
const words = (value) => normalize(value).match(/[a-z0-9][a-z0-9._:-]*/g) || [];
let maximumOverlapWords = 0;
let overlapPhrase = "";
let overlapEditorial = "";
let overlapSource = "";
for (const [sourceUrl, sourceText] of normalizedTextByUrl) {
  const sourceTokens = words(sourceText);
  const sourceFourGramPositions = new Map();
  for (let index = 0; index + 4 <= sourceTokens.length; index += 1) {
    const gram = sourceTokens.slice(index, index + 4).join("|");
    sourceFourGramPositions.set(gram, [
      ...(sourceFourGramPositions.get(gram) || []),
      index,
    ]);
  }
  for (const editorial of editorialStrings) {
    const tokens = words(editorial);
    for (let start = 0; start + 4 <= tokens.length; start += 1) {
      const gram = tokens.slice(start, start + 4).join("|");
      for (const sourceStart of sourceFourGramPositions.get(gram) || []) {
        let length = 4;
        while (
          start + length < tokens.length &&
          sourceStart + length < sourceTokens.length &&
          tokens[start + length] === sourceTokens[sourceStart + length]
        ) {
          length += 1;
        }
        if (length > maximumOverlapWords) {
          maximumOverlapWords = length;
          overlapPhrase = tokens.slice(start, start + length).join(" ");
          overlapEditorial = editorial;
          overlapSource = sourceUrl;
        }
      }
    }
  }
}
if (maximumOverlapWords > 5) {
  throw new Error(
    `Copyright overlap exceeds five words (${maximumOverlapWords}) against ${overlapSource}: "${overlapPhrase}" in "${overlapEditorial}".`,
  );
}
assert.equal(
  editorialStrings.length,
  162,
  "The copyright field count changed.",
);
assert.equal(maximumOverlapWords, 5, "The pinned copyright overlap changed.");

console.log(
  JSON.stringify(
    {
      retainedRawFiles: rawSpecs.size,
      excludedRawFiles: excludedRawArtifacts.size,
      evidenceDirectoryFiles: actualFilenames.length,
      retainedRawBytes,
      excludedRawBytes,
      evidenceDirectoryBytes: retainedRawBytes + excludedRawBytes,
      declaredSources: bundle.sources.length,
      publicationTimestampAssertions,
      articleScopeAssertions,
      communityTranscriptAssertions,
      events: bundle.events.length,
      changes: [...counts.values()].reduce((sum, value) => sum + value, 0),
      repeatedHistoryKeys: repeatedKeys.length,
      cumulativeOccurrences: cumulativeKeys.length,
      citationReferences,
      locatorAssertions,
      minimumSemanticTokenOverlap,
      minimumSemanticTokenKey,
      copyrightFields: editorialStrings.length,
      maximumOverlapWords,
      overlapPhrase,
      overlapSource,
    },
    null,
    2,
  ),
);
