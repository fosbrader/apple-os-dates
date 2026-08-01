import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { JSDOM, VirtualConsole } from "jsdom";

const here = dirname(fileURLToPath(import.meta.url));
const evidenceDirectory = resolve(process.argv[2] || "tmp/ios3-evidence");
const bundlePath = resolve(here, "apple-ios-3-prerelease.json");
const sha256 = (value) => createHash("sha256").update(value).digest("hex");
const collapse = (value) => value.replace(/\s+/g, " ").trim();

const expectedRaw = {
  "apple-beta1.html": [
    128_423,
    "223b0e2b4ec426ce7f1180bd8e67f5518fc00502aff1f7372b431eff275beb8a",
  ],
  "beta2-appleinsider.html": [
    132_421,
    "06ffccb346b84ac1777712d899032be7ff8d4031354311c374a959e596d1d005",
  ],
  "beta2-ilounge.html": [
    44_115,
    "b4a6dd355f54fe96b4d349e14ac4bcd74375fcc0f46bf82adb6383f2e01f7824",
  ],
  "beta2-worldofapple.html": [
    23_498,
    "64d69a932a8473384cc402d0d70eaa584d23d73f95bbf9316d444e3380183721",
  ],
  "beta3-appleinsider.html": [
    130_728,
    "9b81f8a1b71bb70704bdcc85b0286ab5e8d4ae0284c87d2a50973528a7472b96",
  ],
  "beta3-ars.html": [
    138_757,
    "d05cdd01b6a4305c186ec9d5f3c5038d47bdf79c5c05f35f2444d8c0cab7f2bf",
  ],
  "beta3-macrumors.html": [
    112_892,
    "5129656eee21ae6033df367ac58560b5c217831ff8f51341e5736f29af778807",
  ],
  "beta3-worldofapple.html": [
    32_219,
    "0d5dd0cfa0a60a3f091aa20cfbf75a9ada9a96d0072002f77249682e3bf6b537",
  ],
  "beta4-advisory.pdf": [
    49_405,
    "1900ed272a1888ee6faf6a48a1ce507d5b108584814df17582f55a4988d6026f",
  ],
  "beta4-ars.html": [
    140_285,
    "9771cd26140a03b340a1b6dab55bceef725f0dfff0bfd6ca98793f81d82577bd",
  ],
  "beta4-iclarified.html": [
    179_832,
    "caa0c0eddc7dcb6ad7e443100789a619ce4233578e0e49d12387b2ec6da1de0a",
  ],
  "beta4-macrumors.html": [
    114_598,
    "35725ef5a340776222e857eb46648bb06c0630c12dc91b248b26679521d5c978",
  ],
  "beta5-compat.html": [
    111_510,
    "3a8ea71ec6d8bb40bfc6b62f013b959e6eeebea36914f1625be8f761395e9c95",
  ],
  "beta5-engadget.html": [
    57_779,
    "d6871d0bb3d78252d9e1a7f3aa5fef50a8ed93e7ac7c15218f90b581f6f57d6d",
  ],
  "beta5-gizmodo.html": [
    211_768,
    "4fbd760e7d9e8bf9832f5e81871eb934778d5a6afdbe2e16b569f382654a65b0",
  ],
  "beta5-groups.html": [
    1_018_438,
    "b62cb932eb019fa9b7c862a9a3b6111442b607788ab0b9d83a27302a4bdae31a",
  ],
  "beta5-macrumors.html": [
    112_495,
    "add117b9fbee8425846d3c2c9796cdab95272f27d38ca8cd7c43ea8015c51b80",
  ],
  "beta5-slashgear.html": [
    51_061,
    "0a6c21153e7eb9204cb188a87add6010960305fe9706b4c2aeb948cc3ed4fd31",
  ],
  "gm-appleinsider.html": [
    139_020,
    "7b508d0b66cf0d559f60063c8c205b4e5f619c44d437700ea8ef626a4c5e1eb5",
  ],
  "gm-engadget.html": [
    59_332,
    "297c00016afe87ba4ecddb111f775d2a211683ce226f41c9d7427d162615ffec",
  ],
  "gm-iclarified.html": [
    178_778,
    "926a00c814b36fe4bf84f55ce3ba2120d3434cb7df4b32157ecf3bf929e8ce59",
  ],
  "gm-macworld.html": [
    201_449,
    "40808dc8efff90c6bc44f2c75a0d69f5e4b3a0ffd651ffd8abcf468edcd26672",
  ],
};

const buffers = new Map();
const documents = new Map();
for (const [name, [bytes, expectedSha]] of Object.entries(expectedRaw)) {
  const buffer = readFileSync(resolve(evidenceDirectory, name));
  assert.equal(buffer.byteLength, bytes, `${name} byte count`);
  assert.equal(sha256(buffer), expectedSha, `${name} raw SHA-256`);
  buffers.set(name, buffer);
  if (name.endsWith(".html")) {
    const virtualConsole = new VirtualConsole();
    documents.set(name, new JSDOM(buffer, { virtualConsole }).window.document);
  }
}

const boundedText = (name, selector, start, end) => {
  const root = documents.get(name)?.querySelector(selector);
  assert(root, `${name} contains ${selector}`);
  let text = collapse(root.textContent);
  if (start) {
    const index = text.indexOf(start);
    assert.notEqual(index, -1, `${name} contains start marker ${start}`);
    text = text.slice(index);
  }
  if (end) {
    const index = text.indexOf(end);
    assert.notEqual(index, -1, `${name} contains end marker ${end}`);
    text = text.slice(0, index);
  }
  return text.trim();
};

const normalizedSpecs = [
  [
    "apple-beta1.html",
    "article",
    undefined,
    undefined,
    5_543,
    "0b4e18d6d9c9ae440d3109f8c3ca25989565687881f703ce215163715c27195b",
  ],
  [
    "beta2-appleinsider.html",
    "article",
    "Apple on Tuesday afternoon provided",
    "No other changes are being reported at this time.",
    2_173,
    "db541aae36f59f4418ac5225c1716d2ec7e45593754e9f0ee5009f86c0221832",
  ],
  [
    "beta2-ilounge.html",
    ".story",
    undefined,
    undefined,
    802,
    "ef9ff9102f3d40fbc40b02288ba13af44dc7dcba8ba36c1d156e2dfa5bc16816",
  ],
  [
    "beta2-worldofapple.html",
    ".postContent",
    undefined,
    undefined,
    541,
    "3fd6b933e31df9c9ea031be0f913fe75593cd6df9fd9a4c39056e67fee925429",
  ],
  [
    "beta3-appleinsider.html",
    "article",
    "Apple on Tuesday evening made available",
    "(function",
    1_701,
    "e2086dd82309ee1b47357edbc111c4612bc8255dc3b8b405aa2af0746ae10f89",
  ],
  [
    "beta3-ars.html",
    "article",
    "Apple has released another beta",
    "Chris Foresman Chris Foresman",
    2_080,
    "0603328a78f27b41c49feabb21a3a16c1c3a512ebc900f93a6afc5e353e2f7ef",
  ],
  [
    "beta3-macrumors.html",
    "article",
    "Apple today seeded the third beta",
    "Related Forum",
    899,
    "420d2d67c49cbde15517747eb642a12a7fe6a8c423255fc142690cfa40968c41",
  ],
  [
    "beta3-worldofapple.html",
    ".postContent",
    undefined,
    undefined,
    2_835,
    "b644b3b6b56e1e39f41295f0706ad49e1b961b0f00816ed9d34706135927b494",
  ],
  [
    "beta4-ars.html",
    "article",
    "Apple has seeded the fourth beta",
    "Chris Foresman Chris Foresman",
    3_143,
    "e8ad29b8f8ce4d5ae9567c10b7cca18102ecffe65af260e721c32f452d07dc4c",
  ],
  [
    "beta4-iclarified.html",
    "article",
    "iPhone OS 3.0 Beta 4 now supports",
    "Get the iClarified Daily Newsletter",
    1_189,
    "6b13ac4570f176a91616d7b1fe1e7f98ce81dd45120e1023c051c81c508d1df5",
  ],
  [
    "beta4-macrumors.html",
    "article",
    "Continuing a pattern of biweekly releases",
    "Related Forum",
    836,
    "8f719de3a3d09402cf9237fd765cf1da9c9d8f7c112aeb76856712e60de2703d",
  ],
  [
    "beta5-compat.html",
    "article",
    "In an e-mail sent out to registered",
    "Related Forum",
    1_255,
    "4a8626162232dc294ec200780f4049efc2d1592133d291c7cc82f31db124d056",
  ],
  [
    "beta5-gizmodo.html",
    "article",
    "Can you feel that?",
    undefined,
    873,
    "250d9c43c5736a94aad5b49e7e5f20b94c6fad9344dd4ddf9a07f5753454603a",
  ],
  [
    "beta5-groups.html",
    "body",
    "Just got this from Apple",
    "On May 7, 4:14",
    1_012,
    "99911706ccfaccac0f6ed442d8ba64a12824be345d11cf47a62cbb2846ac3e3c",
  ],
  [
    "beta5-macrumors.html",
    "article",
    "Apple tonight seeded the fifth beta",
    "Related Forum",
    785,
    "2e301b192553f227a4038b2a52f7ad7ea67c1a4bb17bb1f9cebc969393bcf377",
  ],
  [
    "beta5-slashgear.html",
    "article",
    "Apple have pushed out the next release",
    "[via iPhone Buzz]",
    1_403,
    "fe1ed383e2acc290b775db9a0b930547af5fdba471fc64bcdf5ab08e4934193b",
  ],
  [
    "beta5-engadget.html",
    "article",
    "Looks like Apple's just released",
    "thanks, Rene!",
    772,
    "8d238d69e5b1d50800873fa8ba5cd959bd641cddd296d14865b45dda410722ea",
  ],
  [
    "gm-appleinsider.html",
    "article",
    "At WWDC, Apple revealed a few new details",
    "(function",
    5_045,
    "95ea70f5a6d4ba383759cdb9f0980cb43f36ed6d5ee6e1d5b7e86fe6e9fe1d7a",
  ],
  [
    "gm-engadget.html",
    "article",
    "It won't be available en masse",
    "Dive into the gallery for a closer look.",
    1_056,
    "236c3498ffb23b5710eb444750efe6d692978f56b9dfeb5b19489fca3d6a085e",
  ],
  [
    "gm-iclarified.html",
    "article",
    "Apple has seeded the iPhone OS 3.0 Gold Master",
    "Get the iClarified Daily Newsletter",
    665,
    "0a05f31537994a354da435fcb0b0e6cc71a83d2b0e726eb17924c5fbfc72e75a",
  ],
  [
    "gm-macworld.html",
    "article",
    "Apple senior vice president of iPhone software",
    undefined,
    4_522,
    "e94e185f0b2a32f020a83d65b8c25e47501244b9977b2d652db80d28b5ae14c2",
  ],
];

const normalizedTexts = [];
for (const [
  name,
  selector,
  start,
  end,
  expectedBytes,
  expectedSha,
] of normalizedSpecs) {
  const text = boundedText(name, selector, start, end);
  assert.equal(Buffer.byteLength(text), expectedBytes, `${name} text bytes`);
  assert.equal(sha256(text), expectedSha, `${name} normalized SHA-256`);
  normalizedTexts.push(text);
}

for (const [name, bytes, expectedSha] of [
  [
    "beta4-advisory-page-1.txt",
    1_985,
    "b04ca656f02b121180464bf17ed6617a2ff478bbeabf54124358111a68db0709",
  ],
  [
    "beta4-advisory-page-2.txt",
    2_547,
    "ea9019115c0c034a42657e645380fe4bc3c940217ee81c7edd8a228b78d86aca",
  ],
]) {
  const buffer = readFileSync(resolve(evidenceDirectory, name));
  assert.equal(buffer.byteLength, bytes, `${name} byte count`);
  assert.equal(sha256(buffer), expectedSha, `${name} SHA-256`);
  normalizedTexts.push(collapse(buffer.toString("utf8")));
}

const assertProbes = (name, text, probes) => {
  for (const probe of probes) {
    assert(
      text.toLowerCase().includes(probe.toLowerCase()),
      `${name} contains probe ${probe}`,
    );
  }
};

const bodyText = (name) => collapse(documents.get(name).body.textContent);
for (const [name, titleProbe, dateProbe] of [
  ["apple-beta1.html", "Developer Beta of iPhone OS 3.0", "March 17, 2009"],
  ["beta2-appleinsider.html", "second beta", "Mar 31"],
  ["beta2-ilounge.html", "Beta 2", "March 31, 2009"],
  ["beta2-worldofapple.html", "Beta 2", "iPhone OS 3.0"],
  ["beta3-appleinsider.html", "beta 3", "Apr 14"],
  ["beta3-ars.html", "third iPhone OS 3.0 beta", "Apr 14, 2009"],
  ["beta3-macrumors.html", "Beta 3", "2009-04-14"],
  ["beta3-worldofapple.html", "Third Beta", "iPhone Developers"],
  ["beta4-ars.html", "beta 4", "Apr 29, 2009"],
  ["beta4-iclarified.html", "Beta 4", "April 29, 2009"],
  ["beta4-macrumors.html", "Beta 4", "2009-04-28"],
  ["beta5-compat.html", "Compatibility", "2009-05-07"],
  ["beta5-engadget.html", "beta 5", "May 6, 2009"],
  ["beta5-gizmodo.html", "Beta 5", "May 6, 2009"],
  ["beta5-macrumors.html", "Beta 5", "2009-05-06"],
  ["beta5-slashgear.html", "Beta 5", "May 7, 2009"],
  ["gm-appleinsider.html", "June 17th", "Jun 08"],
  ["gm-engadget.html", "gold release", "June 8, 2009"],
  ["gm-iclarified.html", "Gold Master", "June 8, 2009"],
  ["gm-macworld.html", "coming on June 17", "Jun 8, 2009"],
]) {
  assertProbes(name, `${documents.get(name).title} ${bodyText(name)}`, [
    titleProbe,
    dateProbe,
  ]);
}

assertProbes("apple-beta1.html", bodyText("apple-beta1.html"), [
  "beta software and SDK include over 1,000 new APIs and are available today",
  "In-App Purchases",
  "peer-to-peer connections",
  "Apple Push Notification service",
  "Cut, Copy and Paste",
  "Spotlight Search",
]);
assertProbes("beta2 sources", normalizedTexts.slice(1, 4).join(" "), [
  "push notification",
  "11 pages",
  "Store",
  "tethering",
]);

const beta3Root = documents
  .get("beta3-worldofapple.html")
  .querySelector(".postContent");
assert(beta3Root, "Beta 3 archive retains .postContent");
const beta3Lists = [...beta3Root.querySelectorAll("ul")];
assert.deepEqual(
  beta3Lists.map((list) => list.querySelectorAll(":scope > li").length),
  [10, 5, 1],
  "Beta 3 SDK inventory is Xcode 10, Interface Builder 5, Dashcode 1",
);
assertProbes("beta3-worldofapple.html", collapse(beta3Root.textContent), [
  "Xcode",
  "Interface Builder",
  "Dashcode",
  "Active SDK",
  "Weak-link",
  "LLVM GCC 4.2",
  "string table interface",
]);
assertProbes("Beta 3 observations", normalizedTexts.slice(4, 8).join(" "), [
  "badge",
  "keyboard",
  "included App Store application",
  "Spotlight",
]);

const beta4Page1 = readFileSync(
  resolve(evidenceDirectory, "beta4-advisory-page-1.txt"),
  "utf8",
);
const beta4Page2 = readFileSync(
  resolve(evidenceDirectory, "beta4-advisory-page-2.txt"),
  "utf8",
);
assertProbes("Beta 4 advisory page 1", beta4Page1, [
  "Pre-Installation Advisory",
  "Intel-based Mac",
  "Mac OS X v10.5.6",
  "iTunes 8.2",
  "development and testing purposes",
]);
assertProbes("Beta 4 advisory page 2", beta4Page2, [
  "permanently",
  "locked",
  "Apple Push",
  "In App Purchasing",
  "App Store",
  "carrier",
  "data plan",
]);
assertProbes("Beta 4 reports", normalizedTexts.slice(8, 11).join(" "), [
  "nonatomic",
  "search controller support",
  "encryption of iPhone back-ups",
  "multiple iTunes accounts",
]);
assertProbes("Beta 5 reports", normalizedTexts.slice(11, 17).join(" "), [
  "StoreKit",
  "iTunes 8.2",
  "compatibility",
  "MMS",
  "trash",
  "sound",
]);
assertProbes("GM reports", normalizedTexts.slice(17, 21).join(" "), [
  "Gold Master",
  "movies",
  "Top 25",
  "AT&T",
  "ratings",
]);

const bundle = JSON.parse(readFileSync(bundlePath, "utf8"));
assert.equal(bundle.events.length, 6, "generated bundle event count");
assert.equal(
  bundle.events.flatMap((event) => event.changes).length,
  76,
  "generated bundle change count",
);
assert.equal(bundle.sources.length, 22, "generated bundle source count");
assert.deepEqual(bundle.versions, [], "generated bundle has no versions");
assert.deepEqual(bundle.builds, [], "generated bundle has no builds");
assert(
  bundle.events.every(
    (event) =>
      event.provenanceStatus === "editoriallyVerified" &&
      event.editorialReview?.status === "approved" &&
      event.editorialReview.reviewedAt === "2026-07-30T12:50:04Z" &&
      event.isIndexable === true,
  ),
  "all generated routes carry the reviewed approval state",
);
assert.deepEqual(
  new Map(
    bundle.events.map((event) => [
      event.identity.routeAlias,
      event.changes.length,
    ]),
  ),
  new Map([
    ["beta-1", 18],
    ["beta-2", 7],
    ["beta-3", 18],
    ["beta-4", 15],
    ["beta-5", 12],
    ["gm", 6],
  ]),
  "generated route change counts",
);

const histories = new Map();
for (const event of bundle.events) {
  for (const change of event.changes) {
    histories.set(change.key, [
      ...(histories.get(change.key) || []),
      `${event.identity.routeAlias}:${change.action}:${change.inheritance}`,
    ]);
  }
}
const repeatedHistories = [...histories.entries()].filter(
  ([, history]) => history.length > 1,
);
assert.equal(histories.size, 71, "stable change-definition inventory");
assert.deepEqual(
  new Map(repeatedHistories),
  new Map([
    [
      "iphone-os-3-0-store-settings-panel",
      ["beta-2:knownIssue:delta", "beta-4:fixed:delta"],
    ],
    [
      "iphone-os-3-0-itunes-82-prerequisite",
      ["beta-4:changed:delta", "beta-5:changed:cumulative"],
    ],
    [
      "iphone-os-3-0-mms-carrier-availability",
      ["beta-2:knownIssue:delta", "gm:knownIssue:cumulative"],
    ],
    [
      "iphone-os-3-0-device-test-lock",
      ["beta-4:knownIssue:delta", "gm:knownIssue:cumulative"],
    ],
    [
      "iphone-os-3-0-tethering-availability",
      ["beta-2:knownIssue:delta", "beta-5:changed:cumulative"],
    ],
  ]),
  "reviewed change histories",
);
assert.deepEqual(
  bundle.events
    .flatMap((event) =>
      event.changes.map((change) => ({
        routeAlias: event.identity.routeAlias,
        change,
      })),
    )
    .filter(({ change }) => change.inheritance === "cumulative")
    .map(({ routeAlias, change }) => `${routeAlias}:${change.key}`)
    .sort(),
  [
    "beta-3:iphone-os-3-0-beta3-dashcode-iphone-web-apps",
    "beta-3:iphone-os-3-0-beta3-ib-diff-friendly-xib",
    "beta-3:iphone-os-3-0-beta3-ib-drag-reparent",
    "beta-3:iphone-os-3-0-beta3-ib-outline-reorder",
    "beta-3:iphone-os-3-0-beta3-ib-string-localization",
    "beta-3:iphone-os-3-0-beta3-xcode-active-sdk-override",
    "beta-3:iphone-os-3-0-beta3-xcode-assistants-templates",
    "beta-3:iphone-os-3-0-beta3-xcode-build-setting-shortcuts",
    "beta-3:iphone-os-3-0-beta3-xcode-conditional-settings",
    "beta-3:iphone-os-3-0-beta3-xcode-edit-scope",
    "beta-3:iphone-os-3-0-beta3-xcode-overview-toolbar",
    "beta-3:iphone-os-3-0-beta3-xcode-target-libraries",
    "beta-3:iphone-os-3-0-beta3-xcode-weak-linking",
    "beta-4:iphone-os-3-0-beta4-commerce-push-development",
    "beta-5:iphone-os-3-0-itunes-82-prerequisite",
    "beta-5:iphone-os-3-0-tethering-availability",
    "gm:iphone-os-3-0-device-test-lock",
    "gm:iphone-os-3-0-mms-carrier-availability",
  ].sort(),
  "reviewed cumulative-context inventory",
);
assert(
  bundle.events
    .flatMap((event) => event.changes)
    .every(
      (change) =>
        !/carbon|xcode-(?:llvm-gcc|gcc-42)/i.test(
          `${change.key} ${change.title}`,
        ),
    ),
  "host-only Mac SDK compilers and Carbon control tooling are excluded",
);

const editorialFields = [];
for (const event of bundle.events) {
  editorialFields.push(event.summary);
  for (const block of event.article.blocks) {
    if (block.text) editorialFields.push(block.text);
    for (const span of block.spans || []) editorialFields.push(span.text);
  }
  for (const change of event.changes) {
    editorialFields.push(
      change.title,
      change.canonicalSummary,
      change.summary,
      change.verificationMethod,
    );
  }
}

const tokens = (value) =>
  String(value || "")
    .toLowerCase()
    .match(/[a-z0-9]+(?:[.'-][a-z0-9]+)*/g) || [];
const sourceTokenSets = normalizedTexts.map(tokens);
const editorialTokenSets = editorialFields.filter(Boolean).map(tokens);
const maximumFieldWords = Math.max(
  ...editorialTokenSets.map((field) => field.length),
);
let maximumOverlap = 0;
let overlapExample = "";
for (let width = maximumFieldWords; width > 0 && !maximumOverlap; width -= 1) {
  const sourceNgrams = new Set();
  for (const sourceTokens of sourceTokenSets) {
    for (let index = 0; index + width <= sourceTokens.length; index += 1) {
      sourceNgrams.add(sourceTokens.slice(index, index + width).join(" "));
    }
  }
  for (const fieldTokens of editorialTokenSets) {
    for (let index = 0; index + width <= fieldTokens.length; index += 1) {
      const candidate = fieldTokens.slice(index, index + width).join(" ");
      if (sourceNgrams.has(candidate)) {
        maximumOverlap = width;
        overlapExample = candidate;
        break;
      }
    }
    if (maximumOverlap) break;
  }
}
assert(
  maximumOverlap <= 5,
  `reader-facing source overlap is ${maximumOverlap} words: "${overlapExample}"`,
);

console.log(
  [
    "iOS 3 prerelease evidence audit passed",
    `raw artifacts: ${buffers.size}`,
    `raw bytes: ${[...buffers.values()].reduce((total, value) => total + value.byteLength, 0)}`,
    `normalized artifacts: ${normalizedTexts.length}`,
    "route identities: Beta 1-5 and GM",
    "Beta 3 SDK inventory: Xcode 10, Interface Builder 5, Dashcode 1",
    "Beta 3 selected tool records: Xcode 8, Interface Builder 4, Dashcode 1",
    `stable definitions: ${histories.size}`,
    `repeated transition histories: ${repeatedHistories.length}`,
    "host-only macOS compiler and Carbon records excluded: yes",
    `editorial fields: ${editorialFields.filter(Boolean).length}`,
    `retained-source tokens: ${sourceTokenSets.reduce((total, value) => total + value.length, 0)}`,
    `maximum editorial overlap: ${maximumOverlap} words (${overlapExample})`,
  ].join("\n"),
);
