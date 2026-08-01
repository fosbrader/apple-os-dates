import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { JSDOM } from "jsdom";

const here = dirname(fileURLToPath(import.meta.url));
const evidenceDirectory = resolve(process.argv[2] || "tmp/ios4-evidence");
const bundle = JSON.parse(
  readFileSync(resolve(here, "apple-ios-4-prerelease.json"), "utf8"),
);
const sha256 = (value) => createHash("sha256").update(value).digest("hex");
const collapse = (value) => value.replace(/\s+/g, " ").trim();

const expectedRaw = {
  "beta1-apple-newsroom.html": [
    129_252,
    "2fd9f6fb5a58aca6140cd6081bf122ded5d66149a66630c2653c98685f6ba537",
  ],
  "beta1-apple-developer.html": [
    107_336,
    "b680a1148ed48ee3f280b0775b5f1350e9b14b25a3ae7a6149a480ad42666a49",
  ],
  "beta1-macrumors.html": [
    113_135,
    "3d55301761116226c85dfa593d889b6788f22bc6e772beb6f6be8bdced148d86",
  ],
  "beta2-macrumors.html": [
    112_791,
    "7d9dbedec9b125f255f55c2de501a74b193a3a2c39d2ca96ed1d3d097ae53d17",
  ],
  "beta2-transcript.html": [
    301_490,
    "f76396ba9d11ac657beb0f84a5cb8e3839f88b9ae584372c3f3203a41c976aa7",
  ],
  "beta3-transcript.html": [
    465_638,
    "2aec9b9d9d1d9e12d2027fca470ade03e9c000bb18b21c08217f79498cf21fd3",
  ],
  "beta3-techcrunch.html": [
    222_652,
    "c5d130a93419f42e030638de65b3f9100226c7a9929e7f68dc071bd00d70296e",
  ],
  "beta3-macworld.html": [
    199_358,
    "a5e2ef55e9c1bd2d3313577c0e85b1fe7da051a778e2bf9b203f6ffa664150ed",
  ],
  "beta3-features-macrumors.html": [
    113_628,
    "935e908d9929ebabeb51ddf0a13b7266f321f3d9cee1a8412e204d120ac2bd27",
  ],
  "beta3-features-engadget.html": [
    60_004,
    "c9927c3692aecc4c6e5b756dd784d672b8cc22538aec1d26747924797e249316",
  ],
  "beta4-macrumors.html": [
    113_309,
    "89186c716a3514db91c4419ec680378ae8d6850036813bc650103b889e4f74c7",
  ],
  "beta4-transcript.html": [
    297_226,
    "e40b7642b3c30617901a487f67b9cfd63c8a381fff04ba92cfd17035d40596f0",
  ],
  "beta4-pcworld.html": [
    250_790,
    "a5772819538499251061c187d6268374577740e1a44429053f150e7d2378a774",
  ],
  "beta4-gizmodo.html": [
    214_805,
    "f74630ef6c0984bc4cfbf762b28581669cacfb73476ad3643306ca212139687f",
  ],
  "gm-macrumors.html": [
    111_894,
    "3ddffd6622354be3b8493e2b166f340fe01fb1e378d66f2ad0137c2c2756620b",
  ],
  "gm-engadget.html": [
    58_314,
    "d752489c9012a5bcad5169b7004a8b7f5db33e09f446cc6d36a61a27bde037a3",
  ],
  "gm-naming.html": [
    112_220,
    "6feec295ff5002ff92602ae3815fa409b378ad974dc207030a14d94884a4b84c",
  ],
  "gm-naming-engadget.html": [
    62_436,
    "eb814da4f87b1bba5642ff965b471e63519fde678fd39cb6affff654413ef610",
  ],
  "public-apple-newsroom.html": [
    131_796,
    "d11f98321de46f691c329d8bb9b8abe90b28be49b8011e553e2189c8dc14832d",
  ],
};

const buffers = new Map();
const documents = new Map();
for (const [name, [expectedBytes, expectedSha]] of Object.entries(
  expectedRaw,
)) {
  const buffer = readFileSync(resolve(evidenceDirectory, name));
  assert.equal(buffer.byteLength, expectedBytes, `${name} byte count`);
  assert.equal(sha256(buffer), expectedSha, `${name} raw SHA-256`);
  buffers.set(name, buffer);
  documents.set(name, new JSDOM(buffer).window.document);
}

const normalizedNode = (name, selector) => {
  const node = documents.get(name)?.querySelector(selector);
  assert(node, `${name} contains ${selector}`);
  return collapse(node.textContent);
};
const matchingNode = (name, selector, probe) => {
  const node = [...documents.get(name).querySelectorAll(selector)].find(
    (candidate) => collapse(candidate.textContent).includes(probe),
  );
  assert(node, `${name} contains ${probe}`);
  return collapse(node.textContent);
};

const normalized = new Map([
  [
    "beta1-apple-newsroom.html",
    normalizedNode("beta1-apple-newsroom.html", "article"),
  ],
  [
    "beta1-apple-developer.html",
    normalizedNode("beta1-apple-developer.html", ".article-text"),
  ],
  ["beta1-macrumors.html", normalizedNode("beta1-macrumors.html", "article")],
  ["beta2-macrumors.html", normalizedNode("beta2-macrumors.html", "article")],
  [
    "beta2-transcript.html",
    matchingNode(
      "beta2-transcript.html",
      ".bbWrapper",
      "Know Issues from the release notes beta 2",
    ),
  ],
  [
    "beta3-transcript.html",
    normalizedNode("beta3-transcript.html", "#messTable_39543904 .msg"),
  ],
  ["beta3-macworld.html", normalizedNode("beta3-macworld.html", "article")],
  [
    "beta3-features-macrumors.html",
    normalizedNode("beta3-features-macrumors.html", "article"),
  ],
  [
    "beta3-features-engadget.html",
    normalizedNode("beta3-features-engadget.html", "article"),
  ],
  ["beta4-macrumors.html", normalizedNode("beta4-macrumors.html", "article")],
  [
    "beta4-transcript.html",
    matchingNode(
      "beta4-transcript.html",
      ".bbWrapper",
      "Changes copied from release notes",
    ),
  ],
  ["beta4-pcworld.html", normalizedNode("beta4-pcworld.html", "article")],
  ["beta4-gizmodo.html", normalizedNode("beta4-gizmodo.html", "article")],
  ["gm-macrumors.html", normalizedNode("gm-macrumors.html", "article")],
  ["gm-engadget.html", normalizedNode("gm-engadget.html", "article")],
  ["gm-naming.html", normalizedNode("gm-naming.html", "article")],
  [
    "gm-naming-engadget.html",
    normalizedNode("gm-naming-engadget.html", "article"),
  ],
  [
    "public-apple-newsroom.html",
    normalizedNode("public-apple-newsroom.html", "article"),
  ],
]);

const expectedNormalized = {
  "beta1-apple-newsroom.html": [
    6_575,
    "fab107449b253b409e5f397e8320e57c8154ffa378f03a4bafa138a548096d85",
  ],
  "beta1-apple-developer.html": [
    474,
    "a54477bce23d5440dab43ed35e41a90003e0b09f88e3d7c08f98d826d73f01be",
  ],
  "beta1-macrumors.html": [
    1_355,
    "02a881a212874ac2578a284e0a264f6903a29d0f97d332c29d316028d6db73e2",
  ],
  "beta2-macrumors.html": [
    1_178,
    "bcd1255d37694f3ecbe5583fc7edd7788327c9bb889804a4f1bd0587f67e930d",
  ],
  "beta2-transcript.html": [
    4_417,
    "55faac079578a5ef7b7ae22096b40b8993d90e2fdd2ad02485b7845550309e2c",
  ],
  "beta3-transcript.html": [
    10_227,
    "00fb6ed2c007399078c93543e2379231693ad236c3700b893fddce1395bdf6ec",
  ],
  "beta3-macworld.html": [
    2_762,
    "57cc79558a1eb9c769ead009d9c8f3913061c73643e85469038a4216e9d1d2fe",
  ],
  "beta3-features-macrumors.html": [
    1_315,
    "aae3f66e4dc4804b9a0d4912eba989d16f065a93cbb2407da51b2c63063f9ad2",
  ],
  "beta3-features-engadget.html": [
    1_193,
    "9f5bf758262d34f7bd99ccfbd1d4d4b2b391ef4d20c6f97fd8ba76e0f9b29338",
  ],
  "beta4-macrumors.html": [
    1_351,
    "39c7095c5f70280010cd6bcd66ead03fecda3a53cc8d866d52d7ae6875731e3b",
  ],
  "beta4-transcript.html": [
    9_189,
    "3e24ad90ed6e1c7285f6467108b350904075465c6de8e40c721e5eb9e9356cbb",
  ],
  "beta4-pcworld.html": [
    1_894,
    "6fb84cbc26fb208dff606587279f107568669abb84fda51abf4adebe3005d8c0",
  ],
  "beta4-gizmodo.html": [
    2_098,
    "91d4ce01112994b9e1020a4112c5de6f15296c6531799c21d918064e29d55642",
  ],
  "gm-macrumors.html": [
    565,
    "92cbb2c728b81e648f599be19b8424af1b55f3adf195a399787a00022cfca056",
  ],
  "gm-engadget.html": [
    958,
    "efb7c6eeaeacb77d9a0f5db84bec2b96681f9b6719c792850281059cd5a66de0",
  ],
  "gm-naming.html": [
    900,
    "a94b8fe6dc9ba2d24950323e07d46c3135d075821a2ef983f2434dbf108523a5",
  ],
  "gm-naming-engadget.html": [
    1_742,
    "cd63ee38ca53b0619f1fb146292d1a57b27cd1b548e221b0c2ffc1847048726d",
  ],
  "public-apple-newsroom.html": [
    8_779,
    "ddf9b0b76318c28b3154b0dcf20ea406eccafd9df8a5f27cf9ed84b131fc701c",
  ],
};
for (const [name, [expectedBytes, expectedSha]] of Object.entries(
  expectedNormalized,
)) {
  const text = normalized.get(name);
  assert.equal(Buffer.byteLength(text), expectedBytes, `${name} text bytes`);
  assert.equal(sha256(text), expectedSha, `${name} normalized SHA-256`);
}

const assertProbes = (name, probes) => {
  const text =
    normalized.get(name) || collapse(documents.get(name).textContent);
  for (const probe of probes) {
    assert(
      text.toLowerCase().includes(probe.toLowerCase()),
      `${name} contains ${probe}`,
    );
  }
};

assertProbes("beta1-apple-newsroom.html", [
  "released a beta version",
  "seven new multitasking services",
  "over 2,000 apps",
  "Unified Inbox",
  "open email attachments with compatible apps",
  "Data Protection",
  "Mobile Device Management",
  "wirelessly distribute",
  "multiple Exchange ActiveSync accounts",
  "SSL VPN",
  "iAd",
  "iBooks",
  "Game Center",
]);
assertProbes("beta1-apple-developer.html", [
  "over 1,500 new APIs",
  "New APIs enable Multitasking",
  "Game Kit Preview",
  "now available",
]);
assertProbes("beta1-macrumors.html", [
  "Calendar application",
  "in-app SMS",
  "Photos libraries",
  "video playback and capture",
  "mapping improvements",
  "Quick Look",
  "Accelerate",
]);

assertProbes("beta2-macrumors.html", ["second beta version", "April 20, 2010"]);
assertProbes("beta2-transcript.html", [
  "iTunes 9.1 does not support folders",
  "LLVM-GCC and the Clang LLVM Compiler",
  "Standard and Optimized presets",
  "Launching iPad applications",
  "Image thumbnails are not displayed",
  "desiredPlayers property has been removed",
  "Matchmaking may occasionally fail",
  "GameKitBeta.h has been renamed",
  "Mail now supports the following RFC extensions",
  "MPMoviePlayerController using the UIScreen APIs",
  "Your device will not appear in Find My iPhone",
  "time limit for task completion",
  "unresponsive pixel area",
  "presentOpenInMenuFromRect",
  "UIImagePickerController objects",
  "cursor may blink on the last letter",
  "UI Automation instrument may fail",
]);

assertProbes("beta3-transcript.html", [
  "iPhone SDK Release Notes for iPhone OS 4.0 Beta 3",
  "perform an Erase Install",
  "install the Beta 3 SDK",
  "Starting in Beta 3",
  "LLVM Compiler 1.5",
  "camera (photo/video) and screen shots",
  "GameKit voice chat",
  "scheduled local notifications",
  "UIDocumentInteractionController",
  "Automation instrument",
  "multiple versions of iPhone OS",
  "_OBJC_CLASS_$_NSURL",
]);
assertProbes("beta3-macworld.html", [
  "temporarily rescind",
  "installation process",
]);
for (const name of [
  "beta3-features-macrumors.html",
  "beta3-features-engadget.html",
]) {
  assertProbes(name, ["orientation lock", "iPod controls", "multitasking"]);
}

assertProbes("beta4-macrumors.html", ["fourth beta version", "May 18, 2010"]);
assertProbes("beta4-transcript.html", [
  "LLVM Compiler 1.5",
  "navigation core data template",
  "_OBJC_CLASS_$_NSURL",
  "startMonitoringSignificantLocationChanges",
  "no longer automatically cancel alerts",
  "free songs of the week",
  "UIInvalidBackgroundTask",
  "transition animation block",
  "colorWithPatternImage",
  "Automation template",
]);
for (const name of ["beta4-pcworld.html", "beta4-gizmodo.html"]) {
  assertProbes(name, ["wallpaper", "Utilities"]);
}
assertProbes("beta4-pcworld.html", ["group messaging"]);
assertProbes("beta4-gizmodo.html", [
  "group messages",
  "Photo Roll",
  "different orientation",
]);

assertProbes("gm-macrumors.html", [
  "Golden Master Candidate",
  "iTunes 9.2 Beta",
  "June 21st",
]);
assertProbes("gm-engadget.html", [
  "Gold Master seed",
  "requires a beta of iTunes 9.2",
]);
assertProbes("gm-naming.html", ["now known as iOS 4", "Bing"]);
assertProbes("gm-naming-engadget.html", ["renamed to iOS", "Bing"]);
assertProbes("public-apple-newsroom.html", [
  "iOS 4",
  "over 100 new features",
  "June 21",
]);

const jsonLdValues = (name) => {
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
const assertPublished = (name, titleProbe, datePrefix) => {
  const record = jsonLdValues(name).find(
    (value) =>
      String(value.headline || value.name || "")
        .toLowerCase()
        .includes(titleProbe.toLowerCase()) &&
      String(value.datePublished || "").startsWith(datePrefix),
  );
  assert(record, `${name} retains ${titleProbe} at ${datePrefix}`);
};
for (const [name, title, date] of [
  ["beta1-macrumors.html", "iPhone SDK 4 Beta", "2010-04-08"],
  ["beta2-macrumors.html", "iPhone OS 4 Beta 2", "2010-04-20"],
  ["beta3-techcrunch.html", "iPhone OS 4 Beta 3", "2010-05-04"],
  [
    "beta3-features-macrumors.html",
    "Orientation Lock and iPod Controls",
    "2010-05-04",
  ],
  [
    "beta3-features-engadget.html",
    "orientation lock, iPod controls",
    "2010-05-04",
  ],
  ["beta4-macrumors.html", "iPhone OS 4 Beta 4", "2010-05-18"],
  ["gm-macrumors.html", "Golden Master", "2010-06-07"],
  ["gm-engadget.html", "iOS 4 gold build", "2010-06-08"],
  ["gm-naming.html", "iPhone OS 4 Becomes iOS 4", "2010-06-07"],
  ["gm-naming-engadget.html", "renamed iOS 4", "2010-06-07"],
]) {
  assertPublished(name, title, date);
}

const evidenceFileByUrl = new Map([
  [
    "https://www.apple.com/newsroom/2010/04/08Apple-Previews-iPhone-OS-4/",
    "beta1-apple-newsroom.html",
  ],
  [
    "https://developer.apple.com/news/?id=04092010a",
    "beta1-apple-developer.html",
  ],
  [
    "https://www.macrumors.com/2010/04/08/apple-releases-iphone-sdk-4-beta-to-developers/",
    "beta1-macrumors.html",
  ],
  [
    "https://www.macrumors.com/2010/04/20/apple-releases-iphone-os-4-beta-2-and-sdk-to-developers/",
    "beta2-macrumors.html",
  ],
  [
    "https://forums.macrumors.com/threads/apple-releases-iphone-os-4-beta-2-and-sdk-to-developers.901243/page-2",
    "beta2-transcript.html",
  ],
  [
    "https://forum.donanimhaber.com/apple-iphone-os-4-0-in-3-beta-surumunu-ve-sdk-i-yayinladi-g--39542933",
    "beta3-transcript.html",
  ],
  [
    "https://techcrunch.com/2010/05/04/iphone-os-4-beta-3-released-to-developers/",
    "beta3-techcrunch.html",
  ],
  [
    "https://www.macworld.com/article/205244/iphoneos4.html",
    "beta3-macworld.html",
  ],
  [
    "https://www.macrumors.com/2010/05/04/latest-iphone-os-4-beta-gains-orientation-lock-and-ipod-controls-in-multitasking-interface/",
    "beta3-features-macrumors.html",
  ],
  [
    "https://www.engadget.com/2010-05-04-iphone-os-4-beta-3-adds-orientation-lock-ipod-controls-to-multi.html",
    "beta3-features-engadget.html",
  ],
  [
    "https://www.macrumors.com/2010/05/18/apple-releases-iphone-os-4-beta-4-and-sdk-to-developers/",
    "beta4-macrumors.html",
  ],
  [
    "https://forums.macrumors.com/threads/apple-releases-iphone-os-4-beta-4-and-sdk-to-developers.918718/page-2",
    "beta4-transcript.html",
  ],
  [
    "https://www.pcworld.com/article/512877/iphone_os_4_beta_4_new_features_breakdown.html",
    "beta4-pcworld.html",
  ],
  [
    "https://gizmodo.com/heres-whats-new-in-iphone-os-4-0-beta-4-5542143",
    "beta4-gizmodo.html",
  ],
  [
    "https://www.macrumors.com/2010/06/07/ios-4-0-golden-master-and-itunes-9-2-seeded-to-developers/",
    "gm-macrumors.html",
  ],
  [
    "https://www.engadget.com/2010-06-07-ios-4-gold-build-now-available-to-iphone-developer-program-membe.html/",
    "gm-engadget.html",
  ],
  [
    "https://www.macrumors.com/2010/06/07/iphone-os-4-becomes-ios-4-available-june-21-for-free/",
    "gm-naming.html",
  ],
  [
    "https://www.engadget.com/2010-06-07-iphone-os-4-renamed-ios-gets-1500-new-features.html",
    "gm-naming-engadget.html",
  ],
  [
    "https://www.apple.com/newsroom/2010/06/07Apple-Presents-iPhone-4/",
    "public-apple-newsroom.html",
  ],
]);
assert.equal(evidenceFileByUrl.size, bundle.sources.length, "source-file map");
assert.deepEqual(
  new Set(evidenceFileByUrl.keys()),
  new Set(bundle.sources.map((source) => source.url)),
  "every declared source maps to one audited raw artifact",
);

const words = (value) =>
  collapse(value)
    .toLowerCase()
    .match(/[a-z0-9][a-z0-9._:$-]*/g) || [];
const normalizedTextByUrl = new Map(
  [...evidenceFileByUrl].map(([url, name]) => [
    url,
    (
      normalized.get(name) || collapse(documents.get(name).body.textContent)
    ).toLowerCase(),
  ]),
);
const archivedTranscriptUrls = new Set([
  "https://forums.macrumors.com/threads/apple-releases-iphone-os-4-beta-2-and-sdk-to-developers.901243/page-2",
  "https://forum.donanimhaber.com/apple-iphone-os-4-0-in-3-beta-surumunu-ve-sdk-i-yayinladi-g--39542933",
  "https://forums.macrumors.com/threads/apple-releases-iphone-os-4-beta-4-and-sdk-to-developers.918718/page-2",
]);
let locatorAssertions = 0;
let markerAlignmentAssertions = 0;
for (const event of bundle.events) {
  for (const change of event.changes || []) {
    const transcriptCitation = (change.citations || []).find(
      (citation) =>
        archivedTranscriptUrls.has(citation.url) &&
        citation.note?.startsWith("Apple-authored developer-note"),
    );
    if (!transcriptCitation) continue;

    const sourceText = normalizedTextByUrl.get(transcriptCitation.url);
    const locatorParts = String(transcriptCitation.locator || "")
      .split(";")
      .map((part) => collapse(part).toLowerCase())
      .filter(Boolean);
    assert(sourceText, `${change.key} has normalized transcript evidence`);
    assert(
      locatorParts.length >= 2,
      `${change.key} has a component-and-fact locator`,
    );

    const statusMarker = ["new", "fixed"].includes(locatorParts[1])
      ? locatorParts[1]
      : undefined;
    const factParts = statusMarker
      ? locatorParts.slice(2)
      : locatorParts.slice(1);
    const factTokens = words(factParts.join(" ")).filter(
      (token) => token.length >= 4,
    );
    assert(
      factTokens.length > 0,
      `${change.key} has a substantive transcript locator`,
    );

    if (statusMarker) {
      const allowedActions =
        statusMarker === "fixed"
          ? new Set(["fixed", "changed"])
          : new Set(["introduced", "changed", "removed", "knownIssue"]);
      assert(
        allowedActions.has(change.action),
        `${change.key} ${statusMarker.toUpperCase()} marker aligns with ${change.action}`,
      );
      const marker = `${statusMarker}:`;
      const markerIndexes = [];
      let markerIndex = sourceText.indexOf(marker);
      while (markerIndex >= 0) {
        markerIndexes.push(markerIndex);
        markerIndex = sourceText.indexOf(marker, markerIndex + marker.length);
      }
      assert(
        markerIndexes.some((index) => {
          const window = sourceText.slice(index, index + 650);
          return factTokens.every((token) => window.includes(token));
        }),
        `${change.key} locator aligns with a ${statusMarker.toUpperCase()} entry`,
      );
      markerAlignmentAssertions += 1;
    } else {
      assert(
        factTokens.every((token) => sourceText.includes(token)),
        `${change.key} unmarked locator tokens occur in its transcript`,
      );
    }
    locatorAssertions += 1;
  }
}
assert.equal(locatorAssertions, 41, "selected transcript locator assertions");
assert.equal(
  markerAlignmentAssertions,
  29,
  "explicit NEW/FIXED marker alignment assertions",
);

const histories = new Map();
for (const event of bundle.events) {
  for (const change of event.changes || []) {
    histories.set(change.key, [
      ...(histories.get(change.key) || []),
      `${event.identity.routeAlias}:${change.action}`,
    ]);
  }
}
const expectedTransitionHistories = new Map([
  ["ios-4-0-document-open-in", ["beta-2:knownIssue", "beta-3:fixed"]],
  ["ios-4-0-llvm-simulator", ["beta-3:knownIssue", "beta-4:fixed"]],
  ["ios-4-0-simulator-nsurl-launch", ["beta-3:knownIssue", "beta-4:fixed"]],
  ["ios-4-0-automation-template", ["beta-3:knownIssue", "beta-4:fixed"]],
]);
const repeatedHistories = [...histories.entries()].filter(
  ([, history]) => history.length > 1,
);
assert.equal(histories.size, 67, "stable change-definition inventory");
assert.deepEqual(
  new Map(repeatedHistories),
  expectedTransitionHistories,
  "known-to-fixed histories retain stable canonical identities",
);

const sourceTokens = new Map();
for (const [url, name] of evidenceFileByUrl) {
  const text =
    normalized.get(name) || collapse(documents.get(name).body.textContent);
  sourceTokens.set(url, words(text));
}

const editorialStrings = [];
for (const event of bundle.events) {
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

let maximumOverlapWords = 0;
let overlapPhrase = "";
let overlapSource = "";
let overlapEditorial = "";
for (const editorial of editorialStrings) {
  const editorialTokens = words(editorial);
  for (const [url, tokens] of sourceTokens) {
    const positionsByFourGram = new Map();
    for (let index = 0; index + 4 <= tokens.length; index += 1) {
      const gram = tokens.slice(index, index + 4).join("|");
      const positions = positionsByFourGram.get(gram);
      if (positions) positions.push(index);
      else positionsByFourGram.set(gram, [index]);
    }
    for (let start = 0; start + 4 <= editorialTokens.length; start += 1) {
      const gram = editorialTokens.slice(start, start + 4).join("|");
      for (const sourceStart of positionsByFourGram.get(gram) || []) {
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
console.log(
  [
    "iOS 4 prerelease evidence audit passed",
    `raw artifacts: ${buffers.size}`,
    `raw bytes: ${rawBytes}`,
    `normalized artifacts: ${normalized.size}`,
    "route identities: Beta 1, Beta 2, Beta 3, Beta 4, GM",
    "selected records: Beta 1 20, Beta 2 20, Beta 3 14, Beta 4 14, GM 3",
    "unsupported identity gap: no Beta 5 route",
    `transcript locator assertions: ${locatorAssertions}`,
    `NEW/FIXED marker alignments: ${markerAlignmentAssertions}`,
    `stable definitions: ${histories.size}`,
    `repeated transition histories: ${repeatedHistories.length}`,
    `copyright fields: ${editorialStrings.length}`,
    `maximum contiguous source overlap: ${maximumOverlapWords} words`,
    `longest overlap phrase: ${overlapPhrase}`,
  ].join("\n"),
);
