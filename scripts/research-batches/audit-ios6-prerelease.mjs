import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { JSDOM } from "jsdom";

const evidenceDirectory = resolve(process.argv[2] || "tmp/ios6-evidence");
const manifestPath = resolve(
  process.argv[3] || "scripts/research-batches/apple-ios-6-prerelease.json",
);
const bundle = JSON.parse(readFileSync(manifestPath, "utf8"));
const sha256 = (value) => createHash("sha256").update(value).digest("hex");
const collapse = (value) => value.replace(/\s+/g, " ").trim();

const expectedRaw = {
  "apple-beta1.html": [
    133_084,
    "96e5c6abce88bd369076b6c9355e1f771df74f734d70b9363e6d82c4be84343e",
  ],
  "apple-final.html": [
    1_169_945,
    "7f8423a8084cd970d7eb20e96a1b370c7b95e546399575e05013b9677a366fba",
  ],
  "beta1-9to5.html": [
    161_340,
    "6cb1a0a665d4d0f78c372016707a8504ef99e6361a1e8141988e1c56bcb066d3",
  ],
  "beta1-bgr.html": [
    61_138,
    "9177fd68c9a021c046065ea5842be545e94295e4f4fc97c829f8d2a76321b702",
  ],
  "beta2-9to5.html": [
    184_265,
    "22eadb48648de41279bbb5b08f61736e57d84385d4ac90f2ddf855f639925406",
  ],
  "beta2-osxdaily.html": [
    229_594,
    "d25d72162938d55ea51602cf2badf57e6dcde1954dc3c27449f6ec4d1560e1cc",
  ],
  "beta3-9to5.html": [
    201_190,
    "5b76d69bbe5f51b07f68812cbac9889309fcbd07613cad70d590239dd5e29ada",
  ],
  "beta3-iclarified.html": [
    186_044,
    "f1dbe367487a4f0a237aa606d4b73e50521a142834fa4ed938798181cad21684",
  ],
  "beta4-9to5.html": [
    199_138,
    "8f6b5e05a75100ae769a654202a10ef1e49e4186fea1b78655200f04358408f9",
  ],
  "beta4-engadget.html": [
    87_771,
    "7d16b463ffc85e4ffd05407a75f2769d771c2f2351952b0d5cf28303575b7d14",
  ],
  "beta4-macrumors.html": [
    134_040,
    "f7996fe27f989c7b0a3bbc5bd052856c74a645cccf6d83596e2338dace00afda",
  ],
  "gm-engadget.html": [
    56_703,
    "538728e1d292dc1430f1dfa8f2d07bf10a25dbc684b9b9b553010f0af3438991",
  ],
  "gm-macrumors.html": [
    124_047,
    "355a8cad524b705fde118d367b9bfffde6aa7d868dcedf8571afdeaefd65b258",
  ],
};

const buffers = new Map();
const documents = new Map();
for (const [name, [bytes, expectedSha]] of Object.entries(expectedRaw)) {
  const buffer = readFileSync(resolve(evidenceDirectory, name));
  assert.equal(buffer.byteLength, bytes, `${name} byte count`);
  assert.equal(sha256(buffer), expectedSha, `${name} raw SHA-256`);
  buffers.set(name, buffer);
  documents.set(name, new JSDOM(buffer).window.document);
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

const normalizedTranscripts = [
  [
    "apple-beta1.html",
    "article",
    undefined,
    undefined,
    6_598,
    "a93a0bd11405c67b8cecfd0ef81ae0ccfa2578bee8c07b8f4c52c3c97760e210",
  ],
  [
    "beta1-9to5.html",
    ".post-content",
    "OS SDK Release Notes for iOS 6",
    "FTC:",
    15_060,
    "5c8b8d94e0bd6b488bce89c7bda0dbc1a7066f39f12b465a2380de4dbf1f515f",
  ],
  [
    "beta1-bgr.html",
    "article",
    "iOS SDK Release Notes for iOS 6",
    "Read",
    14_924,
    "3c37ed9faf5616003401560974d0952b83a3d960e5f61b12df3cedf6d5de1a0a",
  ],
  [
    "beta2-9to5.html",
    ".post-content",
    "Notes and Known Issues",
    "Related articles",
    20_280,
    "91edc2ec6a274b85319ed3cf0fddbb59e5c278a6627aac1e1f6e4a8b98cf4dbc",
  ],
  [
    "beta3-9to5.html",
    ".post-content",
    "Release notes:",
    "FTC:",
    31_619,
    "c5bc86347d35deb484f0fb9ee38aa3be277b7bfa0b84a38748d3d6b4bc960d5c",
  ],
  [
    "beta4-9to5.html",
    ".post-content",
    "Release notes after the break:",
    "FTC:",
    30_839,
    "9bd204a6e15c5a636444a92642e9cc33f7b7039f910c0cd0d6407e70714ad720",
  ],
  [
    "beta4-engadget.html",
    "article",
    "iOS SDK Release Notes for iOS 6 beta 4",
    undefined,
    28_783,
    "51b157ed0e67c4542882a185126da15ec07f3eae928c8d786fb96e60145dd55d",
  ],
  [
    "gm-macrumors.html",
    "article",
    undefined,
    undefined,
    640,
    "a8d78c23d13d36dae7ecc8f24009e268958c5f1ac40c8527a8b3387b169aae69",
  ],
  [
    "gm-engadget.html",
    "article",
    undefined,
    undefined,
    694,
    "8584f77e5481d253bf2cb06569c2dedabdd0d58d0fb3c4b4bdbc3c98091ff04b",
  ],
];
const normalizedByName = new Map();
for (const [
  name,
  selector,
  start,
  end,
  expectedBytes,
  expectedSha,
] of normalizedTranscripts) {
  const text = boundedText(name, selector, start, end);
  assert.equal(Buffer.byteLength(text), expectedBytes, `${name} text bytes`);
  assert.equal(sha256(text), expectedSha, `${name} normalized SHA-256`);
  normalizedByName.set(name, text);
}

const fixedInventory = (name) => {
  const root = documents.get(name)?.querySelector(".post-content");
  assert(root, `${name} contains .post-content`);
  let component = "General";
  const records = [];
  for (const element of root.querySelectorAll("h2,h3,h4,li")) {
    const text = collapse(element.textContent);
    if (/^H[234]$/.test(element.tagName)) {
      if (text) component = text;
    } else if (/^FIXED:/i.test(text)) {
      records.push({ component, text });
    }
  }
  const canonical = records
    .map(({ component, text }) => `${component}\t${text}`)
    .join("\n");
  const groups = Object.fromEntries(
    [...new Set(records.map(({ component }) => component))]
      .sort()
      .map((component) => [
        component,
        records.filter((record) => record.component === component).length,
      ]),
  );
  return { records, canonical, groups };
};

const inventoryExpectations = {
  "beta2-9to5.html": {
    count: 20,
    bytes: 4_356,
    sha: "73135cc523362992aa3c879814a2073a738e8d9817450197124d4fc95358e92c",
    groups: {
      "Apple TV": 2,
      "Game Center": 5,
      IOKit: 1,
      Passbook: 1,
      "Safari & WebKit": 1,
      Simulator: 1,
      UIKit: 2,
      "User Experience": 2,
      iCloud: 1,
      "iMessage & FaceTime": 2,
      iTunes: 1,
      "Movie Player": 1,
    },
  },
  "beta3-9to5.html": {
    count: 18,
    bytes: 3_036,
    sha: "48f090b1cb60b30abc91f8d9f284b54dc5f27639ae9b3d56e7ed6455f737fd99",
    groups: {
      "Apple TV": 2,
      "iMessage & FaceTime": 1,
      iTunes: 1,
      Maps: 2,
      Passbook: 2,
      Reminders: 1,
      Simulator: 3,
      SpringBoard: 1,
      UIKit: 5,
    },
  },
  "beta4-9to5.html": {
    count: 13,
    bytes: 1_915,
    sha: "9bad162630b465dec17a2e68620b1945e13b2dd1ce4366675d5e0b21b0b96a0c",
    groups: {
      "Address Book": 1,
      "Apple TV": 4,
      Dictionary: 1,
      "Game Center": 1,
      Maps: 1,
      Newsstand: 1,
      Passbook: 1,
      "Shared Photo Stream": 1,
      Simulator: 1,
      UIKit: 1,
    },
  },
};
const inventories = new Map();
for (const [name, expected] of Object.entries(inventoryExpectations)) {
  const inventory = fixedInventory(name);
  assert.equal(inventory.records.length, expected.count, `${name} fixed count`);
  assert.equal(
    Buffer.byteLength(inventory.canonical),
    expected.bytes,
    `${name} fixed inventory bytes`,
  );
  assert.equal(sha256(inventory.canonical), expected.sha, `${name} fixed SHA`);
  assert.deepEqual(inventory.groups, expected.groups, `${name} fixed groups`);
  inventories.set(name, inventory);
}

const assertProbes = (name, text, probes) => {
  for (const probe of probes) {
    assert(
      text.toLowerCase().includes(probe.toLowerCase()),
      `${name} contains probe ${probe}`,
    );
  }
};

const beta1Probes = [
  "Bonjour",
  "double-NAT",
  "production server",
  "MobileMe",
  "Data Protection",
  "case-sensitive in iOS",
  "Setup Assistant",
  "attachments through iMessage",
  "change your password",
  "speakerphone or headphones",
  "Wi-Fi Sync",
  "infrastructure hosted by Apple",
  "Maps cannot connect to the internet",
  "current location",
  "video thumbnails",
  "Settings > Privacy",
  "privacy alerts",
  "Shared Photo Stream Notifications",
  "Facebook accounts via the Accounts framework",
  "airplane icon",
  "ingesting passes",
  "Single-Finger and Single-Tap",
  "paints its contents asynchronously",
  "supportedInterfaceOrientations",
  "viewDidUnload",
  "requestAnimationFrame",
  "tags in web forms",
  "Web Inspector",
  "Smart App Banners",
  "key clicking sounds",
  "keyboard in landscape",
];
for (const name of ["beta1-9to5.html", "beta1-bgr.html"]) {
  assertProbes(name, normalizedByName.get(name), beta1Probes);
}

const selectedFixedProbes = {
  "beta2-9to5.html": [
    "double-NAT",
    "friend request UI",
    "game invite or automatch UI",
    "live production server",
    "Setup Assistant",
    "attachments through iMessage",
    "change your password",
    "speakerphone or headphones",
    "Wi-Fi Sync",
    "video thumbnails",
    "back button for navigation controllers",
    "ingesting passes",
    "Single-Finger and Single-Tap",
    "NSFontAttributeName",
    "key clicking sounds",
    "landscape orientation",
  ],
  "beta3-9to5.html": [
    "Answer and Decline buttons",
    "shows up as a new device",
    "Maps cannot connect to the internet",
    "current location",
    "airplane icon",
    "Passbook database has been reset",
    "Done button is missing",
    "Edit button to edit a reminder",
    "SKStoreProductViewController",
    "iPad (Retina) profile",
    "ADAdTypeMediumRectangle",
    "current wallpaper",
    "jitters in the scroll indicators",
    "requiresConstraintBasedLayout",
    "UIWebView.isLoading",
  ],
  "beta4-9to5.html": [
    "ABNewPersonViewController",
    "download a dictionary",
    "month of your date of birth",
    "does not zoom into the current location",
    "simple HTTP downloads",
    "boarding passes on lock screen",
    "delete confirmation alert panel",
    "Camera in an unresponsive state",
  ],
};
for (const [name, probes] of Object.entries(selectedFixedProbes)) {
  const canonical = inventories.get(name).canonical;
  assertProbes(name, canonical, probes);
}
assertProbes("beta2-9to5.html", normalizedByName.get("beta2-9to5.html"), [
  "Smart App Banners",
  "app launching UI and functionality portion of Smart App Banners is not available",
]);
assertProbes("beta3-9to5.html", inventories.get("beta3-9to5.html").canonical, [
  "Single-Finger and Single-Tap",
  "NSFontAttributeName",
]);
assertProbes("beta4-9to5.html", inventories.get("beta4-9to5.html").canonical, [
  "Single-Finger and Single-Tap",
]);

const beta4Text = normalizedByName.get("beta4-9to5.html");
assertProbes("beta4-9to5.html", beta4Text, [
  "ACFacebookAppIdKey",
  "ACFacebookPermissionGroupKey",
  "ACFacebookAudienceKey",
  "GKGameCenterViewController singleton",
  "GKScore+Sharing.h",
  "@icloud.com email address",
  "CLActivityTypeAutomotiveNavigation",
  "Description field is now a required field",
  "no longer requires https/ssl",
  "UIStatusBarTintParameters",
]);
assertProbes(
  "beta4-engadget.html",
  normalizedByName.get("beta4-engadget.html"),
  [
    "GKGameCenterViewController singleton",
    "@icloud.com email address",
    "CLActivityTypeAutomotiveNavigation",
    "Description field is now a required field",
    "UIStatusBarTintParameters",
  ],
);
assertProbes(
  "beta4-engadget.html",
  collapse(
    documents.get("beta4-engadget.html").querySelector("article").textContent,
  ),
  ["YouTube"],
);
assertProbes(
  "beta4-macrumors.html",
  collapse(documents.get("beta4-macrumors.html").body.textContent),
  ["YouTube app", "iOS 6 Beta 4"],
);

const collectJsonLd = (name) => {
  const values = [];
  for (const script of documents
    .get(name)
    .querySelectorAll('script[type="application/ld+json"]')) {
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
const publishedRecord = (name, titleProbe, datePrefix) => {
  const record = collectJsonLd(name).find(
    (value) =>
      String(value.headline || value.name || "")
        .toLowerCase()
        .includes(titleProbe.toLowerCase()) &&
      String(value.datePublished || "").startsWith(datePrefix),
  );
  assert(record, `${name} retains ${titleProbe} at ${datePrefix}`);
};
for (const [name, title, date] of [
  ["apple-beta1.html", "Apple Previews iOS 6", "2012-06-11"],
  ["beta1-9to5.html", "requires user permission", "2012-06-14"],
  ["beta1-bgr.html", "iOS 6 Beta Download", "2012-06-11"],
  ["beta2-9to5.html", "iOS 6.0 Beta 2", "2012-06-25"],
  ["beta2-osxdaily.html", "iOS 6 Beta 2 Released", "2012-06-25"],
  ["beta3-9to5.html", "iOS 6 beta 3", "2012-07-16"],
  ["beta3-iclarified.html", "iOS 6 Beta 3", "2012-07-16"],
  ["beta4-9to5.html", "iOS 6 beta 4", "2012-08-06"],
  ["beta4-engadget.html", "iOS 6 beta 4", "2012-08-06"],
  ["beta4-macrumors.html", "iOS 6 Beta 4", "2012-08-06"],
  ["gm-macrumors.html", "iOS 6 Golden Master", "2012-09-12"],
  ["gm-engadget.html", "iOS 6 GM seed", "2012-09-12"],
]) {
  publishedRecord(name, title, date);
}

const appleAnnouncementText = collapse(
  documents.get("apple-beta1.html").querySelector("article").textContent,
);
assertProbes("apple-beta1.html", appleAnnouncementText, [
  "iOS 6 beta software and SDK are available immediately",
  "June 11, 2012",
]);
const appleFinalText = collapse(
  documents.get("apple-final.html").body.textContent,
);
assertProbes("apple-final.html", appleFinalText, ["About iOS 6", "iOS 6.0.1"]);

const copyrightSourceTexts = new Map([
  ["apple-beta1.html", normalizedByName.get("apple-beta1.html")],
  ["beta1-9to5.html", normalizedByName.get("beta1-9to5.html")],
  ["beta1-bgr.html", normalizedByName.get("beta1-bgr.html")],
  ["beta2-9to5.html", normalizedByName.get("beta2-9to5.html")],
  [
    "beta2-osxdaily.html",
    collapse(
      (
        documents.get("beta2-osxdaily.html").querySelector("article") ||
        documents.get("beta2-osxdaily.html").body
      ).textContent,
    ),
  ],
  ["beta3-9to5.html", normalizedByName.get("beta3-9to5.html")],
  [
    "beta3-iclarified.html",
    collapse(
      (
        documents.get("beta3-iclarified.html").querySelector("article") ||
        documents.get("beta3-iclarified.html").body
      ).textContent,
    ),
  ],
  ["beta4-9to5.html", normalizedByName.get("beta4-9to5.html")],
  ["beta4-engadget.html", normalizedByName.get("beta4-engadget.html")],
  [
    "beta4-macrumors.html",
    collapse(
      (
        documents.get("beta4-macrumors.html").querySelector("article") ||
        documents.get("beta4-macrumors.html").body
      ).textContent,
    ),
  ],
]);
const words = (value) =>
  collapse(value)
    .toLowerCase()
    .match(/[a-z0-9][a-z0-9._:$-]*/g) || [];
const sourceTokenStates = [...copyrightSourceTexts].map(([name, text]) => {
  const tokens = words(text);
  const fourGramPositions = new Map();
  for (let index = 0; index + 4 <= tokens.length; index += 1) {
    const gram = tokens.slice(index, index + 4).join("|");
    const positions = fourGramPositions.get(gram);
    if (positions) positions.push(index);
    else fourGramPositions.set(gram, [index]);
  }
  return { name, tokens, fourGramPositions };
});
const editorialStrings = [];
for (const event of bundle.events || []) {
  editorialStrings.push(event.summary);
  for (const block of event.article?.blocks || []) {
    editorialStrings.push(block.text);
  }
  for (const change of event.changes || []) {
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
assert.equal(editorialStrings.length, 352, "copyright field count");

let maximumOverlapWords = 0;
let overlapPhrase = "";
let overlapSource = "";
let overlapEditorial = "";
for (const editorial of editorialStrings) {
  const editorialTokens = words(editorial);
  for (const state of sourceTokenStates) {
    for (let start = 0; start + 4 <= editorialTokens.length; start += 1) {
      const gram = editorialTokens.slice(start, start + 4).join("|");
      for (const sourceStart of state.fourGramPositions.get(gram) || []) {
        let length = 4;
        while (
          start + length < editorialTokens.length &&
          sourceStart + length < state.tokens.length &&
          editorialTokens[start + length] === state.tokens[sourceStart + length]
        ) {
          length += 1;
        }
        if (length > maximumOverlapWords) {
          maximumOverlapWords = length;
          overlapPhrase = editorialTokens
            .slice(start, start + length)
            .join(" ");
          overlapSource = state.name;
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

console.log(
  [
    "iOS 6 prerelease evidence audit passed",
    `raw artifacts: ${buffers.size}`,
    `raw bytes: ${[...buffers.values()].reduce((total, value) => total + value.byteLength, 0)}`,
    `normalized artifacts: ${normalizedTranscripts.length}`,
    "fixed inventories: Beta 2 20, Beta 3 18, Beta 4 13",
    "selected probes: Beta 1 31×2, Beta 2 16, Beta 3 15, Beta 4 fixed 8 + current 10 + mirror/context",
    "excluded deltas: contradictory Beta 2 Smart App Banner claim and three fixed carry-forward records",
    "publication identities: Beta 1–4 and GM",
    `copyright fields: ${editorialStrings.length}`,
    `maximum contiguous source overlap: ${maximumOverlapWords} words`,
    `longest overlap phrase: ${overlapPhrase}`,
  ].join("\n"),
);
