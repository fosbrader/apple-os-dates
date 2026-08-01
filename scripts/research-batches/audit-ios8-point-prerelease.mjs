import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readdirSync, readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import { JSDOM } from "jsdom";

const here = dirname(fileURLToPath(import.meta.url));
const evidenceDirectory = resolve(process.argv[2] || "tmp/ios8-point-evidence");
const bundle = JSON.parse(
  readFileSync(resolve(here, "apple-ios-8-point-prerelease.json"), "utf8"),
);
const ledger = readFileSync(
  resolve(here, "apple-ios-8-point-prerelease.md"),
  "utf8",
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
  "81-b1-9to5mac.html": [
    198_765,
    "25df710580446f5e1d2db443d979eca819e920be68de024a5073147eea1adc6c",
    ".post-content",
    11_081,
    "59247e9ebeb5bdf2c496b6e798a2ed35a30d0bec8275a1d36957e0f3a56c3131",
  ],
  "81-b1-macrumors.html": [
    123_564,
    "5d40280a48c78fd56696e93233bc9ebf0a41edaed0c9a50feb94b6719417a209",
    "article",
    1_138,
    "871ae843f581f0b16e900ab1ab292892f2abbac95925a6c1ba0bdd59266a86c1",
  ],
  "81-b2-9to5mac.html": [
    170_511,
    "22930ec855b5cafaa12a1210d7e4622ddddf72ac47a7cee030497a251198d222",
    ".post-content",
    857,
    "cdd505194d16cc1b9436c37166330a13586638a78964f0809b17a4cf98bfce0c",
  ],
  "81-b2-applepay-macrumors.html": [
    129_529,
    "6d5a8033adcbc3cd63264ef8c153dc852d51f9bfb5d2159c6c558e8093fee437",
    "article",
    1_614,
    "02a33ac3a17f21e6103283591eddd0041fcbccf1861567a652836047ec8c499d",
  ],
  "81-b2-macrumors.html": [
    123_722,
    "1b2bec61b3dd554bcd2f5ff42532e4b04ab5cb1ccbc1d823e373e0a1ccc553c0",
    "article",
    1_141,
    "0fe6b78b796c2a949e6c45207b1fc905064c1fcf89e27eff7f099606072235f0",
  ],
  "81-public-macrumors.html": [
    130_106,
    "97ef5e8db6a351c958bf366a2017e6cc0b5cd7463dac82a3c635997209bcfbfa",
    "article",
    4_137,
    "bb0030cd6fa3771b23e88a6c8d1763e4a6ed6df62fda4a163e4fd93d891af680",
  ],
  "82-b1-macrumors.html": [
    132_530,
    "76edf4bacaa18e0cf96decc515059eddad640ffeaf785c93ef88b1e5e44cf795",
    "article",
    3_476,
    "52a2e333135a97fd6bf2db14d3dcaf5721f9a39d827c579cccf9a8d71b8c28d5",
  ],
  "82-b2-macrumors.html": [
    123_634,
    "d3f02231205a565a712c79d13ad958eff9d3ab204a403be6cf6afb1df5bf2496",
    "article",
    1_296,
    "b886ece9c86de6130e867f9b965a09a2cc5e7f82b9475eb6a6b87069efd74252",
  ],
  "82-b3-macrumors.html": [
    125_003,
    "f8e91f0d95551e9986be6e14d0b9601b3797f0bb7b6fb75af73441303e447ee5",
    "article",
    1_565,
    "ec17d4972837a5ac6219f98b60f804f1eaa68962d5138560d8aea8b420540a3c",
  ],
  "82-b4-macrumors.html": [
    124_511,
    "d772566cd1d9f732f21323ac7e3d7f53e43a38d87dead83b0f962b58175bec2c",
    "article",
    1_557,
    "9b66413d2cb4a20c5a50813e1f07b4e326c2271cfb32cfb70a2b72e3d167b5e5",
  ],
  "82-b5-macrumors.html": [
    125_033,
    "85d92643466fbaf00ba38237d6f2590b45d1fdc141f1eeba33ffd9862f75b8db",
    "article",
    1_124,
    "ee50392057338ede9dd826fc787f758f182eb03902e1b26f1151ec10ab501793",
  ],
  "82-gm-macrumors.html": [
    127_406,
    "7485716e5561a64eed6a671cb267594ec9828b4936954337a6a0d57cd8d2dbbb",
    "article",
    2_438,
    "c82161fd8fc0e4ba210823aa56ca6ecf7644923e55eca6ecb103c7699149f2d0",
  ],
  "82-public-macrumors.html": [
    126_577,
    "b4a6d89ed91eb9ac5be074cd64da08b96d36ee28d80394a1c00bfc3afbaa5dd2",
    "article",
    620,
    "d1fc608b71a4aad69cfe1753b09069acb6e14c61b843a7a837ec687dc5313154",
  ],
  "83-b1-macrumors.html": [
    131_586,
    "4b1aec4037c805c83a9b10be16aa5247707211a0eb102a0190279b8bfcadbb5a",
    "article",
    2_242,
    "51fbfd55c41b4556f28bb343ea5a69025a99372bb7cfc62b7442c0f47f7febac",
  ],
  "83-b2-macrumors.html": [
    125_498,
    "73d41c53e1ff0bde7f1a59fa36b83833828856425dab7c480dd9fb9532baff67",
    "article",
    1_985,
    "d73fe041bd1f8fff95c28c5d01bdb1cb854be45e4388f1edd469bd0cd79e6807",
  ],
  "83-b3-macrumors.html": [
    125_476,
    "f0b3fdb9976a42186674294720c78e7c08daacabd78b8263a08069ca5426dee2",
    "article",
    1_545,
    "0f19e7187761b1210a7d641ab0908015e621d45495bf817844c1ca67bc755c10",
  ],
  "83-b4-pb2-macrumors.html": [
    127_346,
    "c3fca532d48ffde8c3dafb420d524ffeab1c40af88eb815e9a7a45edb293f9ae",
    "article",
    1_684,
    "0ed5227478ca18afe1daa69e76d4c0d97e9668d4bd371487d173fcd4b2097d8c",
  ],
  "83-pb1-macrumors.html": [
    126_719,
    "8ac01cb0d8de9b91b920216631b8ec179a551ee839e9dae45292ab692c0cd441",
    "article",
    2_703,
    "76fadb61bdc830c68ab02ccb72995995135a1a8beae7d0b96e9b258482abdaab",
  ],
  "83-public-macrumors.html": [
    137_076,
    "eab8146609e26c7f9644fd9fd81ed708667f5630b6613125351bbc0b69e5766e",
    "article",
    8_074,
    "fa719d86d71bc8160a892534e73b7d050bf5b242d2f23d0901097dd759cacaaf",
  ],
  "84-b1-audiobooks-9to5mac.html": [
    173_260,
    "67b7507061a4e557b6b7249b9d4e72a318092a42465e74922c95f512c7b3a4a8",
    ".post-content",
    2_798,
    "c6aa17bb679cfb88e32c869b2b0492e31322fe7b6a1805b9d59adb160503280e",
  ],
  "84-b1-macrumors.html": [
    129_977,
    "0ba87303ca709436ccb25d5863c661788f6412d0c707785b5e5e33db61ae5a5f",
    "article",
    3_830,
    "8e7625900435492186dc1cca82b5158cc513208e02b6567af38c7c81720db99d",
  ],
  "84-b2-pb1-9to5mac.html": [
    185_939,
    "7ee4fd32b8293b3b6f716b8ee831d4f8316dbc702cfa61855690569af22b332c",
    ".post-content",
    1_259,
    "0c5969f5a28ea671aaf54a286765145f692848f02711ac76ec1ab1d97db18365",
  ],
  "84-b3-pb2-9to5mac.html": [
    176_141,
    "8cad1f0db4394dbc045912143cc32565e298a42897ef97f88c80d6f34a2134db",
    ".post-content",
    2_319,
    "0c00375eb169dad0557080b596f8a04f1b7923a3fcd73058682e32994abccd93",
  ],
  "84-b4-imessage-macrumors.html": [
    124_788,
    "5b6823b4dd05c09905d235d80100de203f4d70715592450edb1999c983fa26b3",
    "article",
    1_507,
    "5fd0176da815afcc19cf4ea9ab710f71af57a3ceba3eae138175c8863db6a178",
  ],
  "84-b4-pb3-macrumors.html": [
    127_395,
    "23ec705d33fbdd1cf60f8a00dea264db0b94f297adf781d866d4886527d08d30",
    "article",
    1_809,
    "51ab7f6cb73c12681ecbdfcedfc60913b2ad6c47adfd00c00dcd7dc7c49daff5",
  ],
  "84-no-gm-macrumors.html": [
    124_616,
    "55e492e6ccd5d3b38276ac49fbbdb07357dcd6bb5894002e884003f7295c192b",
    "article",
    1_287,
    "a4f15a079121a38b29eea6b10be3e354693482be60df406b94434ea92f9d8e01",
  ],
  "84-public-macrumors.html": [
    130_000,
    "0cd78882bd21fb53315cbc2f1c4f84c453329dee3e96c930252653b7e11d220a",
    "article",
    2_093,
    "a18740e3888fbe382f834a5f69e0f2313174b3ba0ac0ac9c4fe1ad2aa3b630f5",
  ],
  "apple-ios8-updates.html": [
    1_189_370,
    "f4a76063e13ea4b7aa7a5f249842a0151e9e866de61b0af22e0c47e166188886",
    "#sections",
    20_245,
    "a8dc2d65328b924a00c093472ac39c3a3a7edd10071838e9d19e07b9f81faef3",
  ],
  "apple-watchkit-newsroom.html": [
    133_566,
    "44f9b15b46844640504c66a84cc7469b76c1dfdcd193b083e86fbca480313389",
    "article",
    4_369,
    "2332ef53538a2289376d5517346e1a4147eba7826a3027b97687055dfec34be8",
  ],
  "apple-xcode6-release-notes.html": [
    137_878,
    "5cd569213f7e9ccd6c29197104561e58ccb03fea2b6e941c3735ec8096e796f6",
    "#contents",
    75_382,
    "59168ab191fda5f4cbced14f024abdefe8c0a7e65832b06e39bcb2c2740822e3",
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

const structuredValues = (document, field) => {
  const values = [];
  const visit = (value) => {
    if (Array.isArray(value)) {
      for (const item of value) visit(item);
      return;
    }
    if (!value || typeof value !== "object") return;
    if (typeof value[field] === "string") values.push(value[field]);
    for (const child of Object.values(value)) visit(child);
  };
  for (const script of document.querySelectorAll(
    'script[type="application/ld+json"]',
  )) {
    try {
      visit(JSON.parse(script.textContent));
    } catch {
      // A retained page can contain unrelated malformed structured data. The
      // pinned article probes and hashes remain authoritative for its content.
    }
  }
  return [...new Set(values)];
};
const publishedDatesByFile = new Map(
  [...documents].map(([name, document]) => [
    name,
    structuredValues(document, "datePublished"),
  ]),
);

const sourceFileByUrl = new Map([
  [
    "https://www.macrumors.com/2014/09/29/apple-seeds-first-ios-8-1-beta-to-developers/",
    "81-b1-macrumors.html",
  ],
  [
    "https://9to5mac.com/2014/09/29/first-beta-version-ios-8-1-hits-apples-developer-center-with-build-number-12b401/",
    "81-b1-9to5mac.html",
  ],
  [
    "https://www.macrumors.com/2014/10/07/apple-seeds-ios-8-1-beta-2/",
    "81-b2-macrumors.html",
  ],
  [
    "https://9to5mac.com/2014/10/07/apple-releases-ios-8-1-beta-2-to-developers/",
    "81-b2-9to5mac.html",
  ],
  [
    "https://www.macrumors.com/2014/10/08/apple-pay-setup-screen/",
    "81-b2-applepay-macrumors.html",
  ],
  [
    "https://www.macrumors.com/2014/10/20/apple-releases-ios-8-1-apple-pay/",
    "81-public-macrumors.html",
  ],
  [
    "https://www.macrumors.com/2014/11/18/apple-watchkit-ios-8-2/",
    "82-b1-macrumors.html",
  ],
  [
    "https://www.macrumors.com/2014/12/10/apple-seeds-second-ios-8-2-beta-to-developers/",
    "82-b2-macrumors.html",
  ],
  [
    "https://www.macrumors.com/2014/12/18/apple-seeds-third-ios-8-2-beta-to-developers/",
    "82-b3-macrumors.html",
  ],
  [
    "https://www.macrumors.com/2015/01/12/apple-fourth-ios-8-2-beta/",
    "82-b4-macrumors.html",
  ],
  [
    "https://www.macrumors.com/2015/02/02/apple-seeds-fifth-ios-8-2-beta-to-developers/",
    "82-b5-macrumors.html",
  ],
  [
    "https://www.macrumors.com/2015/03/05/ios-8-2-release-date-and-notes/",
    "82-gm-macrumors.html",
  ],
  [
    "https://www.macrumors.com/2015/03/09/apple-releases-ios-8-2-today/",
    "82-public-macrumors.html",
  ],
  [
    "https://www.macrumors.com/2015/02/09/apple-seeds-first-ios-8-3-beta-to-developers/",
    "83-b1-macrumors.html",
  ],
  [
    "https://www.macrumors.com/2015/02/23/apple-seeds-second-ios-8-3-beta-to-developers/",
    "83-b2-macrumors.html",
  ],
  [
    "https://www.macrumors.com/2015/03/12/apple-seeds-third-ios-8-3-beta-to-developers/",
    "83-b3-macrumors.html",
  ],
  [
    "https://www.macrumors.com/2015/03/12/ios-beta-testing-program/",
    "83-pb1-macrumors.html",
  ],
  [
    "https://www.macrumors.com/2015/03/24/apple-seeds-fourth-ios-8-3-beta-to-developers/",
    "83-b4-pb2-macrumors.html",
  ],
  [
    "https://www.macrumors.com/2015/04/08/apple-releases-ios-8-3/",
    "83-public-macrumors.html",
  ],
  [
    "https://www.macrumors.com/2015/04/13/apple-seeds-first-ios-8-4-beta-to-developers/",
    "84-b1-macrumors.html",
  ],
  [
    "https://9to5mac.com/2015/04/14/audiobooks-ios-8-4/",
    "84-b1-audiobooks-9to5mac.html",
  ],
  [
    "https://9to5mac.com/2015/04/27/apple-releases-ios-8-4-beta-2-to-developers-with-revamped-music-app/",
    "84-b2-pb1-9to5mac.html",
  ],
  [
    "https://9to5mac.com/2015/05/11/apple-releases-ios-8-4-beta-3-with-revamped-music-ahead-of-late-june-launch/",
    "84-b3-pb2-9to5mac.html",
  ],
  [
    "https://www.macrumors.com/2015/06/09/apple-seeds-fourth-ios-8-4-beta/",
    "84-b4-pb3-macrumors.html",
  ],
  [
    "https://www.macrumors.com/2015/06/10/imessage-bug-fixed-ios-8-4-beta-4/",
    "84-b4-imessage-macrumors.html",
  ],
  [
    "https://www.macrumors.com/2015/06/22/ios-8-4-gm-ios-9-beta-2-release-date/",
    "84-no-gm-macrumors.html",
  ],
  [
    "https://www.macrumors.com/2015/06/30/apple-releases-ios-8-4-with-apple-music/",
    "84-public-macrumors.html",
  ],
  ["https://support.apple.com/en-us/102782", "apple-ios8-updates.html"],
  [
    "https://www.apple.com/newsroom/2014/11/18Developers-Start-Designing-Apps-for-Apple-Watch/",
    "apple-watchkit-newsroom.html",
  ],
  [
    "https://developer.apple.com/library/archive/documentation/Xcode/Conceptual/RN-Xcode-Archive/Chapters/xc6_release_notes.html",
    "apple-xcode6-release-notes.html",
  ],
]);
const ledgerOnlySourceUrls = new Set([
  "https://www.macrumors.com/2015/03/12/ios-beta-testing-program/",
]);
assert.equal(
  sourceFileByUrl.size,
  bundle.sources.length + ledgerOnlySourceUrls.size,
  "retained source-map count",
);
assert.deepEqual(
  new Set([
    ...bundle.sources.map((source) => source.url),
    ...ledgerOnlySourceUrls,
  ]),
  new Set(sourceFileByUrl.keys()),
  "content plus timeline-only source/evidence closure",
);
assert(
  [...ledgerOnlySourceUrls].every(
    (url) => !bundle.sources.some((source) => source.url === url),
  ),
  "timeline-only source stays outside the content bundle",
);

const probesByFile = {
  "81-b1-9to5mac.html": [
    "Icons in Notification Center’s widget list are bigger",
    "new mode with new API",
    "needs the iCloud entitlement",
  ],
  "81-b1-macrumors.html": ["first beta of iOS 8.1", "12B401"],
  "81-b2-9to5mac.html": ["iOS 8.1 beta 2", "12B407"],
  "81-b2-applepay-macrumors.html": [
    "setup screen in the Passbook app",
    "initial iOS 8.1 setup",
    "does not mention",
  ],
  "81-b2-macrumors.html": [
    "second beta of iOS 8.1",
    "Bluetooth connectivity problem",
  ],
  "81-public-macrumors.html": ["Apple Releases iOS 8.1", "Camera Roll"],
  "82-b1-macrumors.html": ["WatchKit SDK", "powered by the iPhone"],
  "82-b2-macrumors.html": [
    "keyboards that may not appear",
    "Singapore English",
    "notifications to fail to open an app",
  ],
  "82-b3-macrumors.html": [
    "opening Messages conversations",
    "missing emoji button",
    "blood glucose tracking",
  ],
  "82-b4-macrumors.html": ["fourth beta of iOS 8.2", "Apple Watch app"],
  "82-b5-macrumors.html": ["fifth beta of iOS 8.2", "Facebook"],
  "82-gm-macrumors.html": [
    "employees and carrier partners",
    "12D508",
    "unit of measurement",
  ],
  "82-public-macrumors.html": ["release iOS 8.2", "Apple Watch"],
  "83-b1-macrumors.html": [
    "wireless connectivity",
    "Google two-step verification",
    "China UnionPay",
  ],
  "83-b2-macrumors.html": [
    "not compatible with LTE Voice",
    "skin tone modifiers",
    "Danish",
  ],
  "83-b3-macrumors.html": ["Conversation List Filtering", "Apple Watch app"],
  "83-b4-pb2-macrumors.html": ["fourth beta of iOS 8.3", "Unknown Sender"],
  "83-pb1-macrumors.html": [
    "first time ever",
    "third iOS 8.3 beta",
    "public beta testing program",
  ],
  "83-public-macrumors.html": ["Apple Releases iOS 8.3", "Wireless CarPlay"],
  "84-b1-audiobooks-9to5mac.html": [
    "move it to the iBooks app",
    "chapter list",
    "iOS CarPlay interface",
  ],
  "84-b1-macrumors.html": [
    "first beta of iOS 8.4",
    "New MiniPlayer",
    "Up Next",
    "using Siri to control iTunes Radio",
    "AirPlay streaming",
    "Station sharing for iTunes Radio is not available",
  ],
  "84-b2-pb1-9to5mac.html": [
    "Public Beta 1",
    "corresponds to this second developer seed",
    "Trending Searches",
  ],
  "84-b3-pb2-9to5mac.html": [
    "third beta of iOS 8.4",
    "second Public Beta",
    "Trending Searches from beta 2 is gone",
  ],
  "84-b4-imessage-macrumors.html": [
    "specific string of Unicode characters",
    "fix has arrived",
  ],
  "84-b4-pb3-macrumors.html": [
    "fourth beta of iOS 8.4",
    "third that public beta testers",
    "station sharing",
  ],
  "84-no-gm-macrumors.html": [
    "report proved inaccurate",
    "has yet to release the iOS 8.4 GM",
  ],
  "84-public-macrumors.html": ["Apple Releases iOS 8.4", "Apple Music"],
  "apple-ios8-updates.html": [
    "About iOS 8 Updates",
    "select the unit of measurement",
    "redesigned Emoji keyboard",
    "Completely redesigned music player",
  ],
  "apple-watchkit-newsroom.html": [
    "availability of WatchKit",
    "actionable notifications and Glances",
    "fully native apps",
  ],
  "apple-xcode6-release-notes.html": [
    "Xcode 6.4 includes the iOS 8.4 SDK",
    "Swift 1.2",
    "WatchKit Framework",
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

for (const source of bundle.sources) {
  const name = sourceFileByUrl.get(source.url);
  const canonical = documents
    .get(name)
    .querySelector('link[rel="canonical"]')?.href;
  if (canonical) {
    assert.equal(canonical, source.url, `${name} canonical source URL`);
  }
  if (source.publishedAt) {
    const expectedTimestamp = Date.parse(source.publishedAt);
    assert(Number.isFinite(expectedTimestamp), `${name} source publishedAt`);
    assert(
      publishedDatesByFile
        .get(name)
        .some((value) => Date.parse(value) === expectedTimestamp),
      `${name} retained datePublished matches source custody metadata`,
    );
  }
}
assert.deepEqual(
  bundle.sources.reduce((counts, source) => {
    counts[source.sourceClass] = (counts[source.sourceClass] || 0) + 1;
    return counts;
  }, {}),
  {
    journalism: 26,
    firstPartyDocumentation: 1,
    firstPartyAnnouncement: 1,
    developerDocs: 1,
  },
  "source-class custody matrix",
);

const expectedRoutes = [
  ["version-ios-8-1", "beta-1", "developerBeta", "2014-09-29", 1, 8],
  ["version-ios-8-1", "beta-2", "developerBeta", "2014-10-07", 2, 4],
  ["version-ios-8-2", "beta-1", "developerBeta", "2014-11-18", 1, 6],
  ["version-ios-8-2", "beta-2", "developerBeta", "2014-12-10", 2, 4],
  ["version-ios-8-2", "beta-3", "developerBeta", "2014-12-18", 3, 6],
  ["version-ios-8-2", "beta-4", "developerBeta", "2015-01-12", 4, 1],
  ["version-ios-8-2", "beta-5", "developerBeta", "2015-02-02", 5, 1],
  ["version-ios-8-2", "gm", "goldenMaster", "2015-03-05", 6, 7],
  ["version-ios-8-3", "beta-1", "developerBeta", "2015-02-09", 1, 6],
  ["version-ios-8-3", "beta-2", "developerBeta", "2015-02-23", 2, 5],
  ["version-ios-8-3", "beta-3", "developerBeta", "2015-03-12", 3, 2],
  ["version-ios-8-3", "beta-4", "developerBeta", "2015-03-24", 4, 2],
  ["version-ios-8-4", "beta-1", "developerBeta", "2015-04-13", 1, 14],
  ["version-ios-8-4", "beta-2", "developerBeta", "2015-04-27", 2, 1],
  ["version-ios-8-4", "beta-3", "developerBeta", "2015-05-11", 3, 7],
  ["version-ios-8-4", "beta-4", "developerBeta", "2015-06-09", 4, 4],
];
assert.equal(bundle.events.length, expectedRoutes.length, "route count");
for (let index = 0; index < expectedRoutes.length; index += 1) {
  const [versionId, alias, channel, date, sequence, changeCount] =
    expectedRoutes[index];
  const event = bundle.events[index];
  assert.deepEqual(event.target, {
    releaseVersionId: versionId,
    routeAlias: alias,
  });
  assert.equal(event.identity.releaseVersionId, versionId);
  assert.equal(event.identity.platformId, "platform-ios");
  assert.equal(event.identity.routeAlias, alias);
  assert.equal(event.identity.appearanceDate, date);
  assert.equal(event.identity.sequence, sequence);
  assert.equal(event.identity.channel, channel);
  assert.equal(event.identity.isRevision, false);
  assert.equal(event.identity.closesReleaseCycle, false);
  assert.equal(event.changes.length, changeCount);
  assert.equal(event.provenanceStatus, "editoriallyVerified");
  assert.deepEqual(event.editorialReview, {
    status: "approved",
    reviewedAt: "2026-07-30T13:55:56Z",
  });
  assert.equal(event.isIndexable, true);
  const identityCitations = event.citations.filter(
    (citation) =>
      citation.note === "Contemporary milestone identity and timing.",
  );
  assert(identityCitations.length > 0, `${versionId}/${alias} identity source`);
  assert(
    identityCitations.some((citation) =>
      publishedDatesByFile
        .get(sourceFileByUrl.get(citation.url))
        .some((value) => value.startsWith(date)),
    ),
    `${versionId}/${alias} appearance date matches retained publication metadata`,
  );
}
assert.deepEqual(bundle.versions, [], "candidate does not add versions");
assert.deepEqual(bundle.builds, [], "candidate does not add builds");
assert(
  bundle.events.every((event) => event.target.routeAlias !== "public"),
  "approved Public routes stay excluded",
);
assert(
  bundle.events.every(
    (event) =>
      ["developerBeta", "goldenMaster"].includes(event.identity.channel) &&
      !event.target.routeAlias.startsWith("public-beta-"),
  ),
  "content candidate contains no distribution-only public-beta routes",
);
const timelineOnlyEvidence = [
  [
    "version-ios-8-3/public-beta-1",
    "2015-03-12",
    "83-pb1-macrumors.html",
    "The version of iOS 8.3 being distributed to beta testers is the third iOS 8.3 beta",
  ],
  [
    "version-ios-8-3/public-beta-2",
    "2015-03-24",
    "83-b4-pb2-macrumors.html",
    "Today's beta is also available for public beta testers",
  ],
  [
    "version-ios-8-4/public-beta-1",
    "2015-04-27",
    "84-b2-pb1-9to5mac.html",
    "Public Beta 1, which corresponds to this second developer seed",
  ],
  [
    "version-ios-8-4/public-beta-2",
    "2015-05-11",
    "84-b3-pb2-9to5mac.html",
    "The second Public Beta is available as well",
  ],
  [
    "version-ios-8-4/public-beta-3",
    "2015-06-09",
    "84-b4-pb3-macrumors.html",
    "Today's beta is the third that public beta testers have received",
  ],
];
const timelineOnlyRoutes = new Set(
  timelineOnlyEvidence.map(([route]) => route),
);
const contentRoutes = new Set(
  expectedRoutes.map(([versionId, alias]) => `${versionId}/${alias}`),
);
assert.equal(timelineOnlyRoutes.size, 5, "timeline-only public-beta count");
assert(
  [...timelineOnlyRoutes].every((route) => !contentRoutes.has(route)),
  "timeline-only public betas are omitted from content",
);
assert.equal(
  new Set([...contentRoutes, ...timelineOnlyRoutes]).size,
  21,
  "all 21 named milestones close without schema-filler records",
);
const compactLedger = ledger.replace(/[ \t]+/g, " ");
for (const [route, date, name, pairingProbe] of timelineOnlyEvidence) {
  assert(
    publishedDatesByFile.get(name).some((value) => value.startsWith(date)),
    `${route} date matches retained publication metadata`,
  );
  assert(
    normalized.get(name).toLowerCase().includes(pairingProbe.toLowerCase()),
    `${route} retained source supports its developer-seed pairing`,
  );
  const [versionId, alias] = route.split("/");
  const version = versionId.replace("version-ios-", "").replaceAll("-", ".");
  const ledgerRowPrefix =
    `| iOS ${version} | Public Beta ${alias.at(-1)} | ` +
    "`" +
    alias +
    "`" +
    ` | ${date} |`;
  assert(
    compactLedger.includes(ledgerRowPrefix),
    `${route} is retained in the generated route ledger`,
  );
}
assert(!ledger.includes("binary equivalence"));
assert(!ledger.includes("binary-equivalence"));
assert.match(ledger, /does not claim\s+byte-for-byte identity/);

const declaredUrls = new Set(bundle.sources.map((source) => source.url));
const declaredSourceByUrl = new Map(
  bundle.sources.map((source) => [source.url, source]),
);
let citationReferences = 0;
let occurrenceCount = 0;
const definitions = new Map();
const inheritanceCounts = {};
const actionCounts = {};
const evidenceCustodyCounts = {};
for (const event of bundle.events) {
  for (const citation of event.citations) {
    citationReferences += 1;
    assert(declaredUrls.has(citation.url), "event citation source closure");
    assert(citation.locator, "event citation locator");
  }
  for (const block of event.article?.blocks || []) {
    for (const citation of block.citations || []) {
      citationReferences += 1;
      assert(declaredUrls.has(citation.url), "article citation source closure");
      assert(citation.locator, "article citation locator");
    }
  }
  for (const change of event.changes) {
    occurrenceCount += 1;
    assert(
      change.key.startsWith("apple-ios-8-point-prerelease-"),
      `${change.key} batch prefix`,
    );
    assert(change.citations.length > 0, `${change.key} has claim citations`);
    inheritanceCounts[change.inheritance] =
      (inheritanceCounts[change.inheritance] || 0) + 1;
    actionCounts[change.action] = (actionCounts[change.action] || 0) + 1;
    const evidenceCustody = `${change.documentedStatus}/${change.evidenceState}`;
    evidenceCustodyCounts[evidenceCustody] =
      (evidenceCustodyCounts[evidenceCustody] || 0) + 1;
    for (const citation of change.citations) {
      citationReferences += 1;
      assert(declaredUrls.has(citation.url), `${change.key} source closure`);
      assert(citation.locator, `${change.key} citation locator`);
      assert(citation.note, `${change.key} citation evidence note`);
      const citedSource = declaredSourceByUrl.get(citation.url);
      if (citedSource.sourceClass === "journalism") {
        assert.notEqual(
          citation.note,
          "First-party material used for bounded confirmation or cumulative context.",
          `${change.key} does not relabel journalism as first-party custody`,
        );
      } else {
        assert.equal(
          citation.note,
          "First-party material used for bounded confirmation or cumulative context.",
          `${change.key} retains first-party custody`,
        );
      }
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
assert.equal(occurrenceCount, 78, "selected occurrence count");
assert.equal(definitions.size, 72, "stable change-definition count");
assert.equal(citationReferences, 239, "citation-reference count");
assert.deepEqual(
  inheritanceCounts,
  { delta: 68, cumulative: 10 },
  "fresh-delta versus cumulative occurrence matrix",
);
assert.deepEqual(
  actionCounts,
  {
    changed: 20,
    introduced: 35,
    fixed: 14,
    knownIssue: 8,
    removed: 1,
  },
  "action matrix",
);
assert.deepEqual(
  evidenceCustodyCounts,
  {
    "undocumented/reported": 28,
    "partiallyDocumented/corroborated": 24,
    "documented/reported": 19,
    "documented/confirmed": 7,
  },
  "documentation/evidence custody matrix",
);

const limitedGmEvent = bundle.events.find(
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
  "limited-GM records are cumulative final-note state",
);
assert.deepEqual(
  bundle.events.flatMap((event) =>
    event.changes
      .filter((change) => change.inheritance === "cumulative")
      .map((change) => [
        `${event.target.releaseVersionId}/${event.target.routeAlias}`,
        change.key,
      ]),
  ),
  [
    [
      "version-ios-8-2/gm",
      "apple-ios-8-point-prerelease-82-limited-gm-health-unit-selection",
    ],
    [
      "version-ios-8-2/gm",
      "apple-ios-8-point-prerelease-82-limited-gm-health-large-data-stability",
    ],
    [
      "version-ios-8-2/gm",
      "apple-ios-8-point-prerelease-82-limited-gm-third-party-workouts",
    ],
    [
      "version-ios-8-2/gm",
      "apple-ios-8-point-prerelease-82-limited-gm-medical-id-photo",
    ],
    [
      "version-ios-8-2/gm",
      "apple-ios-8-point-prerelease-82-limited-gm-health-data-display",
    ],
    [
      "version-ios-8-2/gm",
      "apple-ios-8-point-prerelease-82-limited-gm-motion-privacy-toggle",
    ],
    [
      "version-ios-8-2/gm",
      "apple-ios-8-point-prerelease-82-limited-gm-system-accessory-stability",
    ],
    [
      "version-ios-8-4/beta-4",
      "apple-ios-8-point-prerelease-84-siri-radio-control",
    ],
    [
      "version-ios-8-4/beta-4",
      "apple-ios-8-point-prerelease-84-airplay-streaming",
    ],
    [
      "version-ios-8-4/beta-4",
      "apple-ios-8-point-prerelease-84-radio-station-sharing",
    ],
  ],
  "only final-note context and explicitly persistent known issues are cumulative",
);

const recurrence = new Map();
for (const event of bundle.events) {
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
  "Photo Library label history contains only the two observed removals",
);
const photoLibraryBeta4 = bundle.events
  .find(
    (event) =>
      event.target.releaseVersionId === "version-ios-8-3" &&
      event.target.routeAlias === "beta-4",
  )
  ?.changes.find(
    (change) =>
      change.key ===
      "apple-ios-8-point-prerelease-83-icloud-photo-library-beta-label",
  );
assert(photoLibraryBeta4, "Photo Library Beta 4 occurrence");
assert.match(
  photoLibraryBeta4.verificationMethod,
  /without inferring the intervening toggles/,
  "Photo Library recurrence explicitly preserves the unknown intermediate state",
);
assert.match(
  photoLibraryBeta4.summary,
  /after intervening label changes/,
  "Photo Library recurrence states the bounded history",
);
assert.deepEqual(
  recurrence.get(
    "apple-ios-8-point-prerelease-83-messages-conversation-filtering",
  ),
  [
    "version-ios-8-3/beta-3:introduced:delta",
    "version-ios-8-3/beta-4:changed:delta",
  ],
  "Messages filtering introduction and label refinement",
);
assert.deepEqual(
  recurrence.get("apple-ios-8-point-prerelease-84-trending-radio-searches"),
  [
    "version-ios-8-4/beta-2:introduced:delta",
    "version-ios-8-4/beta-3:removed:delta",
  ],
  "Trending Searches introduction and removal",
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
    `${suffix} stable Beta 1-to-Beta 4 persistence`,
  );
}
assert.deepEqual(
  [...recurrence]
    .filter(([, occurrences]) => occurrences.length > 1)
    .map(([key]) => key)
    .sort(),
  [
    "apple-ios-8-point-prerelease-83-icloud-photo-library-beta-label",
    "apple-ios-8-point-prerelease-83-messages-conversation-filtering",
    "apple-ios-8-point-prerelease-84-airplay-streaming",
    "apple-ios-8-point-prerelease-84-radio-station-sharing",
    "apple-ios-8-point-prerelease-84-siri-radio-control",
    "apple-ios-8-point-prerelease-84-trending-radio-searches",
  ],
  "exact stable-key recurrence closure",
);
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

const candidateRouteKeys = new Set(
  bundle.events.map(
    (event) => `${event.target.releaseVersionId}\0${event.target.routeAlias}`,
  ),
);
const candidateStableEventIds = new Set(
  bundle.events.map((event) => event.identity.stableEventId),
);
assert.equal(
  candidateRouteKeys.size,
  bundle.events.length,
  "candidate route keys are unique",
);
assert.equal(
  candidateStableEventIds.size,
  bundle.events.length,
  "candidate stable event IDs are unique",
);
let collisionFilesScanned = 0;
for (const name of readdirSync(here).filter(
  (entry) =>
    entry.endsWith(".json") && entry !== "apple-ios-8-point-prerelease.json",
)) {
  const other = JSON.parse(readFileSync(resolve(here, name), "utf8"));
  collisionFilesScanned += 1;
  for (const event of other.events || []) {
    const routeKey =
      event.target?.releaseVersionId && event.target?.routeAlias
        ? `${event.target.releaseVersionId}\0${event.target.routeAlias}`
        : null;
    assert(
      !routeKey || !candidateRouteKeys.has(routeKey),
      `${name} already owns ${routeKey?.replace("\0", "/")}`,
    );
    assert(
      !event.identity?.stableEventId ||
        !candidateStableEventIds.has(event.identity.stableEventId),
      `${name} already owns ${event.identity?.stableEventId}`,
    );
    for (const change of event.changes || []) {
      const candidateDefinition = definitions.get(change.key);
      if (!candidateDefinition) continue;
      assert.deepEqual(
        {
          title: change.title,
          canonicalSummary: change.canonicalSummary,
          category: change.category,
        },
        candidateDefinition,
        `${name} ${change.key} global definition`,
      );
    }
  }
}
assert(collisionFilesScanned > 0, "cross-batch collision corpus is nonempty");

const ignoredLocatorTokens = new Set(
  "a an and are as at be beta by changed developer fixed for from in into issue known notes observed of on release report state the this to update with".split(
    " ",
  ),
);
const stemLocatorToken = (token) =>
  token.length > 3 && token.endsWith("s") ? token.slice(0, -1) : token;
const locatorTokens = (value) =>
  new Set(
    normalizedText(value)
      .split(" ")
      .filter((token) => token.length > 1 && !ignoredLocatorTokens.has(token))
      .map(stemLocatorToken),
  );
const overlapCount = (left, right) =>
  [...left].filter((token) => right.has(token)).length;
const sourceTokenSets = new Map(
  [...sourceFileByUrl].map(([url, name]) => [
    url,
    locatorTokens(normalized.get(name)),
  ]),
);
let weakestLocatorOverlap = Number.POSITIVE_INFINITY;
let weakestClaimOverlap = Number.POSITIVE_INFINITY;
for (const event of bundle.events) {
  for (const change of event.changes) {
    for (const citation of change.citations) {
      const sourceTokens = sourceTokenSets.get(citation.url);
      const markerSet = locatorTokens(citation.locator);
      const claimSet = locatorTokens(
        `${change.title} ${change.canonicalSummary}`,
      );
      const markerOverlap = overlapCount(markerSet, sourceTokens);
      const claimOverlap = overlapCount(claimSet, sourceTokens);
      assert(
        markerOverlap >= 2,
        `${change.key} locator resolves in ${sourceFileByUrl.get(citation.url)} (${citation.locator})`,
      );
      assert(
        claimOverlap >= 3,
        `${change.key} claim resolves in ${sourceFileByUrl.get(citation.url)}`,
      );
      weakestLocatorOverlap = Math.min(weakestLocatorOverlap, markerOverlap);
      weakestClaimOverlap = Math.min(weakestClaimOverlap, claimOverlap);
    }
  }
}

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
assert.equal(editorialStrings.length, 424, "copyright field count");

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

const rawBytes = [...buffers.values()].reduce(
  (total, buffer) => total + buffer.byteLength,
  0,
);
assert.equal(rawBytes, 5_167_522, "evidence corpus byte count");

console.log(
  [
    "iOS 8 point-release prerelease evidence audit passed",
    `raw artifacts: ${buffers.size}`,
    `raw bytes: ${rawBytes}`,
    `normalized artifacts: ${normalized.size}`,
    `publishedAt custody matches: ${bundle.sources.filter((source) => source.publishedAt).length}`,
    "content routes: iOS 8.1 Beta 1–2; iOS 8.2 Beta 1–5 plus reported limited GM; iOS 8.3 Beta 1–4; iOS 8.4 Beta 1–4",
    "timeline-only routes: iOS 8.3 Public Beta 1–2 and iOS 8.4 Public Beta 1–3",
    "route gaps: no defensible iOS 8.1 or 8.3 GM; corrected report records no iOS 8.4 GM",
    `inheritance: ${inheritanceCounts.delta} delta / ${inheritanceCounts.cumulative} cumulative`,
    "bounded recurrences: Photo Library label has no invented intermediate restoration; three iOS 8.4 Beta 1 issues persist cumulatively at Beta 4",
    `collision files scanned: ${collisionFilesScanned}`,
    `selected occurrences/definitions: ${occurrenceCount}/${definitions.size}`,
    `citation references: ${citationReferences}`,
    `weakest locator/claim token overlap: ${weakestLocatorOverlap}/${weakestClaimOverlap}`,
    `copyright fields: ${editorialStrings.length}`,
    `maximum contiguous source overlap: ${maximumOverlapWords} words`,
    `longest overlap phrase: ${overlapPhrase}`,
  ].join("\n"),
);
