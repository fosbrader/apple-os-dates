import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { JSDOM, VirtualConsole } from "jsdom";

const here = dirname(fileURLToPath(import.meta.url));
const evidenceDirectory = resolve(process.argv[2] || "tmp/ios2-evidence");
const bundlePath = resolve(here, "apple-ios-2-prerelease.json");
const publicOwnerPath = resolve(here, "apple-ios-2.json");
const sha256 = (value) => createHash("sha256").update(value).digest("hex");
const collapse = (value) => value.replace(/\s+/g, " ").trim();
const normalizeEvidence = (value) =>
  collapse(value)
    .normalize("NFKC")
    .replace(/[®™©]/g, "")
    .replace(/[’‘]/g, "'")
    .replace(/[“”]/g, '"')
    .replace(/[–—]/g, "-")
    .toLowerCase();
const stableValue = (value) => {
  if (Array.isArray(value)) return value.map(stableValue);
  if (!value || typeof value !== "object") return value;
  return Object.fromEntries(
    Object.entries(value)
      .sort(([left], [right]) => left.localeCompare(right))
      .map(([key, item]) => [key, stableValue(item)]),
  );
};

const expectedRaw = {
  "beta1-apple.html": [
    134_048,
    "ca6b6ff640589367f560f412afce9b3eca06b68dfbffbd7ca7716caf9b90068a",
  ],
  "beta1-appleinsider.html": [
    137_066,
    "3f13d450a731853b75bef27b89729bcc19edbf263aabf44b666c6168eaa8e55c",
  ],
  "beta1-engadget.html": [
    63_567,
    "c427d9d4dad7ec382c613db6b1823055f017fce930a117e33b4bfee46c17ad5e",
  ],
  "beta2-iclarified.html": [
    183_327,
    "22067d9943ca4ec6451c354988f29f93082e7c9eea16ddc52387ec0dfd118548",
  ],
  "beta2-macworld.html": [
    194_221,
    "0cef58ec7fd793ce5230aa64ec0d583e9dcb93d5844237f1bc98f8e0db7a5051",
  ],
  "beta3-macrumors.html": [
    109_402,
    "5c222d0719c77fcc3afaa0f77dc9a1e764df5de83e5af17ea8b91cb6e9b688bd",
  ],
  "beta4-ars.html": [
    133_810,
    "bcd6f4945d16e6ea2a3d1a6217c2b84c1801085e57a048556ed75e9285881817",
  ],
  "beta4-iclarified.html": [
    180_284,
    "a8221fcf523ce8049a6967ac6e6f70429c8cb9b61b5acc6e7612bbbbab7d9bf4",
  ],
  "beta5-macrumors.html": [
    107_971,
    "0065d35b53e09c2160c0a992914e5b6aa66289fbe4261029f95dd6deb69bc9a7",
  ],
  "beta6-appleinsider.html": [
    133_145,
    "edc1a8c6ddf96a3a18f7bc7a0e626ac0a039fbf3abb0adf4f8445586de139f14",
  ],
  "beta6-ars.html": [
    133_062,
    "ecf3ffc680d259011e8c9d30540e3b1404d3afe5b08bde582a543c22a08061bd",
  ],
  "beta6-engadget.html": [
    55_675,
    "9af30679f22f0c00c03a520e488da6e862c0c44d8b97881c9fd53e1f34ef8f29",
  ],
  "beta6-geotag-engadget.html": [
    57_151,
    "03c64efa86b950b1e7b80bd77fd054bb76e51978aa0130f1cf703b24a88f06bc",
  ],
  "beta7-ars.html": [
    130_963,
    "19db44c531951fffccd27ba0ec6cc857ba2e07324d6adf4260845af0c1bef3af",
  ],
  "beta7-iculture.html": [
    513_689,
    "786a3f74e03e2fd540baa74c752b596dd5d337e0600d14922b8f6d05bab71196",
  ],
  "beta7-macrumors.html": [
    110_735,
    "7d48e5a259f3b94abc3006ccc78d441a1d5c622e284942c4ebc8726a7d70657c",
  ],
  "beta8-appstore.html": [
    111_975,
    "671e95bf61bbeaba3eda3212ba51581a433236a1fae23ca487fa32738ebe51e4",
  ],
  "beta8-engadget.html": [
    59_975,
    "d309f2e04b507e821cbcde1c74bf2bbe54f94f922b409174e2d196abd08de5a0",
  ],
  "beta8-macrumors.html": [
    111_930,
    "96de4edf82ba48f526b2b92cc278bd94716b15190db0cf351420bd3c415d72b3",
  ],
  "beta8-macworld.html": [
    193_557,
    "f7db6d1a587a4fcff149d90fe5b25bcb177376ce44333c55b42fbb3b83c6d446",
  ],
};

const buffers = new Map();
const documents = new Map();
for (const [name, [bytes, expectedSha]] of Object.entries(expectedRaw)) {
  const buffer = readFileSync(resolve(evidenceDirectory, name));
  assert.equal(buffer.byteLength, bytes, `${name} byte count`);
  assert.equal(sha256(buffer), expectedSha, `${name} raw SHA-256`);
  buffers.set(name, buffer);
  const virtualConsole = new VirtualConsole();
  documents.set(name, new JSDOM(buffer, { virtualConsole }).window.document);
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
    "beta1-apple.html",
    "article",
    "PRESS RELEASE March 6, 2008",
    "Press Contacts",
    7_105,
    "95d7c39d572127ff98dfc1fdc424a48f64a0420e7ecb20813873e867a4b01b6e",
  ],
  [
    "beta1-appleinsider.html",
    "article",
    "iPhone 2.0 beta firmware features revealed",
    "Apple placates ousted iPhone developers",
    738,
    "0bf6c7f82699aac7ce7673e5d5cc752134282b89663784a31f2802c5c2a174fa",
  ],
  [
    "beta1-engadget.html",
    "article",
    "We know there have been",
    "%Gallery-18608%",
    1_814,
    "bf12ea1dcc0d4faf3b3e4f00c5b27122e8e16d4bb5721dd7ad2fa0dd7adfc1df",
  ],
  [
    "beta2-iclarified.html",
    "article",
    "A new version of the iPhone 2.0 Beta Firmware",
    "Get the iClarified Daily Newsletter",
    226,
    "438f52e0658580cd635b2c539958ff6ae6dbe9d4e536f7d793ad71b75c8ef814",
  ],
  [
    "beta2-macworld.html",
    "article",
    "Apple on Thursday released",
    undefined,
    1_072,
    "8c55acab54fb805f004e0130cf22ef257ac9a4322c2a11633df8010bed1c2201",
  ],
  [
    "beta3-macrumors.html",
    "article",
    "Apple has seeded a new version",
    "Related Forum",
    841,
    "b5a8feee4a250d195f6e6fb1682d9c2c558a617aa26eba82944ac54c37bcd458",
  ],
  [
    "beta4-ars.html",
    "article",
    "Apple has released a fourth beta",
    "Chris Foresman Chris Foresman",
    1_691,
    "3f78e845b619e4c670811c6901c9ca3b5b7f2c72d2a92620d5dbf2f89d5daf27",
  ],
  [
    "beta4-iclarified.html",
    "article",
    "Apple has released a new version",
    "Get the iClarified Daily Newsletter",
    1_045,
    "1d65d1b2f66c643120831151ca6327c0e10c41d62ad3cdb5b47a1fdbf0e6bd15",
  ],
  [
    "beta5-macrumors.html",
    "article",
    "Apple has released iPhone SDK Beta 5",
    "Related Forum",
    250,
    "357071cdf100bf6cd851a46858626848f388194c513137d650b1d0b9c8952a5f",
  ],
  [
    "beta6-appleinsider.html",
    "article",
    "A new beta of Apple",
    "(function",
    1_768,
    "c5012ac2a8ddd105fad8c5ee8b899189b0180818edfe7fdb18502b049b288bee",
  ],
  [
    "beta6-ars.html",
    "article",
    "As June draws closer",
    "Justin Berka Justin Berka",
    1_664,
    "254cabb2614295e9f95ff80a62efddf23626efbd94d72a551b4588812bfb4110",
  ],
  [
    "beta6-engadget.html",
    "article",
    "Along with the recent updates",
    undefined,
    1_272,
    "3fcf6e1d1ab3e0db6cf841733eae91cb9a8294a2540e56f8407f580b86605fe6",
  ],
  [
    "beta6-geotag-engadget.html",
    "article",
    "Here's a nice little tidbit",
    undefined,
    651,
    "e478a85a3915aef1de104ab2299646a0bee7adbf03406d5060379cb8fa2fc0ee",
  ],
  [
    "beta7-ars.html",
    "article",
    "Many of you might have been",
    "Jeff Smykil Jeff Smykil",
    1_060,
    "8134621e09e6a0859eec53f74ac8c4a4c1091354a9663db9cc19350f32d3a629",
  ],
  [
    "beta7-iculture.html",
    "article",
    "iPhone SDK beta 7 Apple heeft",
    "Lees de 16 reacties",
    316,
    "00c880f01e330c6964d0c284ffa6878f5b2c0925e8db8260764c8c042683db3f",
  ],
  [
    "beta7-macrumors.html",
    "article",
    "Apple released the 7th Beta",
    "Related Forum",
    109,
    "3bfdbf3fda427a6e705e1f0fcf779d4df2815fde52fe14022e6255346042c3d7",
  ],
  [
    "beta8-appstore.html",
    "article",
    "Apple has sent out an email notice",
    "Related Forum",
    593,
    "8ac1b0ba98230c38cda20ea9ba547981fe8acd74668d2b8d6e8cf06e001e31ae",
  ],
  [
    "beta8-engadget.html",
    "article",
    "Apple has released iPhone SDK Beta 8",
    undefined,
    1_260,
    "c40b2a39326814db39784bc5cf80e4729cd68f1ff5c3638dd77e8cfff959faff",
  ],
  [
    "beta8-macrumors.html",
    "article",
    "Apple has seeded developers with Beta 8",
    "Related Forum",
    614,
    "a739ac341774d0a9cbafaec874be752abd9cbf1ced1b6fcb34268275aabd4788",
  ],
  [
    "beta8-macworld.html",
    "article",
    "As that July 11th launch",
    undefined,
    963,
    "1e57643334325546c23c4e9b5f40fe06db9df24db37bf1a8ffdf042b72906429",
  ],
];

const normalized = new Map();
for (const [
  name,
  selector,
  start,
  end,
  chars,
  expectedSha,
] of normalizedSpecs) {
  const text = boundedText(name, selector, start, end);
  assert.equal(text.length, chars, `${name} normalized character count`);
  assert.equal(sha256(text), expectedSha, `${name} normalized SHA-256`);
  normalized.set(name, text);
}

const probes = [
  ["beta1-apple.html", "Apple Announces iPhone 2.0 Software Beta"],
  ["beta1-apple.html", "Exchange ActiveSync"],
  ["beta1-engadget.html", "scientific mode"],
  ["beta1-appleinsider.html", "mass-selecting e-mail"],
  ["beta2-macworld.html", "Interface Builder"],
  ["beta2-iclarified.html", "Visible Changes"],
  ["beta3-macrumors.html", "Autodiscovery"],
  ["beta4-ars.html", "code signing is now enforced"],
  ["beta4-iclarified.html", "OpenGL ES support"],
  ["beta5-macrumors.html", "bug fixes"],
  ["beta6-engadget.html", "regenerate all provisioning profiles"],
  ["beta6-ars.html", "six fewer sample applications"],
  ["beta6-appleinsider.html", "Location Services"],
  ["beta6-geotag-engadget.html", "geotagging"],
  ["beta7-macrumors.html", "7th Beta"],
  ["beta7-ars.html", "bug fixes"],
  ["beta7-iculture.html", "bugfixes"],
  ["beta8-macrumors.html", "MobileMe"],
  ["beta8-engadget.html", "certificates issued before June 9"],
  ["beta8-appstore.html", "final testing"],
  ["beta8-macworld.html", "compatible with the final iPhone OS 2.0"],
];
for (const [name, marker] of probes) {
  const text = collapse(documents.get(name).body.textContent);
  assert(text.includes(marker), `${name} contains subject probe ${marker}`);
}

const bundle = JSON.parse(readFileSync(bundlePath, "utf8"));
assert.equal(bundle.formatVersion, 1, "bundle format");
assert.equal(bundle.accessedAt, "2026-07-30", "access date");
assert.equal(bundle.sources.length, 20, "declared source count");
assert.deepEqual(bundle.versions, [], "batch does not add versions");
assert.deepEqual(bundle.builds, [], "batch does not infer builds");
assert.equal(bundle.events.length, 8, "event count");

const expectedEvents = new Map([
  ["beta-1", ["Beta 1", "2008-03-06", 1, 17]],
  ["beta-2", ["Beta 2", "2008-03-27", 2, 4]],
  ["beta-3", ["Beta 3", "2008-04-08", 3, 5]],
  ["beta-4", ["Beta 4", "2008-04-23", 4, 10]],
  ["beta-5", ["Beta 5", "2008-05-06", 5, 2]],
  ["beta-6", ["Beta 6", "2008-05-28", 6, 4]],
  ["beta-7", ["Beta 7", "2008-06-09", 7, 3]],
  ["beta-8", ["Beta 8", "2008-06-26", 8, 6]],
]);
for (const event of bundle.events) {
  const alias = event.target.routeAlias;
  const expected = expectedEvents.get(alias);
  assert(expected, `expected route ${alias}`);
  const [label, date, sequence, count] = expected;
  assert.deepEqual(
    event.target,
    { releaseVersionId: "version-ios-2-0", routeAlias: alias },
    `${alias} durable target`,
  );
  assert.equal(event.identity.releaseVersionId, "version-ios-2-0", alias);
  assert.equal(event.identity.platformId, "platform-ios", alias);
  assert.equal(event.identity.stableEventId, `event:apple:ios:2.0:${alias}`);
  assert.equal(event.identity.label, label, alias);
  assert.equal(event.identity.routeAlias, alias, alias);
  assert.equal(event.identity.channel, "developerBeta", alias);
  assert.equal(event.identity.appearanceDate, date, alias);
  assert.equal(event.identity.sequence, sequence, alias);
  assert.equal(event.identity.isRevision, false, alias);
  assert.equal(event.identity.availabilityState, "available", alias);
  assert.equal(event.identity.closesReleaseCycle, false, alias);
  assert.equal(event.authorship, "originalSynthesis", alias);
  assert.equal(event.provenanceStatus, "editoriallyVerified", alias);
  assert.deepEqual(
    event.editorialReview,
    { status: "approved", reviewedAt: "2026-07-30T13:29:37Z" },
    alias,
  );
  assert.equal(event.isIndexable, true, alias);
  assert.equal(event.changes.length, count, `${alias} selected change count`);
}
assert.deepEqual(
  new Set(bundle.events.map((event) => event.target.routeAlias)),
  new Set(expectedEvents.keys()),
  "exact route closure",
);

const U = {
  beta1Apple:
    "https://www.apple.com/newsroom/2008/03/06Apple-Announces-iPhone-2-0-Software-Beta/",
  beta1Engadget:
    "https://www.engadget.com/2008-03-18-iphone-firmware-2-0-hands-on.html/",
  beta1AppleInsider:
    "https://appleinsider.com/articles/08/03/18/itunes_strike_refunds_iphone_2_0_beta_iphone_app_signing",
  beta2Macworld: "https://www.macworld.com/article/189903/iphonesdk-4.html",
  beta2Iclarified:
    "https://www.iclarified.com/866/new-version-of-iphone-20-beta-firmware",
  beta3MacRumors:
    "https://www.macrumors.com/2008/04/08/apple-seeds-new-iphone-os-2-0-beta-5a240d-sdk-update/",
  beta4Ars:
    "https://arstechnica.com/gadgets/2008/04/apple-releases-4th-iphone-sdk-and-beta-2-0-firmware/",
  beta4Iclarified:
    "https://www.iclarified.com/989/iphone-20-beta-4-5a258f-firmware-released",
  beta5MacRumors:
    "https://www.macrumors.com/2008/05/06/iphone-sdk-beta-5-released/",
  beta6Engadget:
    "https://www.engadget.com/2008-05-28-iphone-sdk-beta-6-is-here.html",
  beta6Ars:
    "https://arstechnica.com/gadgets/2008/05/iphone-sdk-beta-6-released-includes-3g-iphone-tidbits/",
  beta6AppleInsider:
    "https://appleinsider.com/articles/08/05/22/latest_iphone_2_0_beta_adds_geo_tagging_to_camera_photos.html",
  beta6GeotagEngadget:
    "https://www.engadget.com/2008-05-22-iphone-2-0-beta-gets-geotagging.html",
  beta7MacRumors:
    "https://www.macrumors.com/2008/06/09/apple-releases-iphone-sdk-beta-7/",
  beta7Ars:
    "https://arstechnica.com/gadgets/2008/06/iphone-sdk-beta-7-now-available/",
  beta7Iculture:
    "https://www.iculture.nl/nieuws/kort-iphone-nieuws-12-ek-songs-voor-band-iphone-3g-gratis-bij-o2-iphone-sdk-beta-7/",
  beta8MacRumors:
    "https://www.macrumors.com/2008/06/26/apple-seeds-iphone-2-0-5a345-itunes-7-7-beta-sdk-8/",
  beta8Engadget:
    "https://www.engadget.com/2008-06-26-iphone-sdk-beta-8-coming-soon.html",
  beta8AppStore:
    "https://www.macrumors.com/2008/06/26/apple-accepting-iphone-apps-into-app-store/",
  beta8Macworld:
    "https://www.macworld.com/article/191231/iphone_sdk_beta8.html",
};
const evidenceFileByUrl = new Map([
  [U.beta1Apple, "beta1-apple.html"],
  [U.beta1AppleInsider, "beta1-appleinsider.html"],
  [U.beta1Engadget, "beta1-engadget.html"],
  [U.beta2Iclarified, "beta2-iclarified.html"],
  [U.beta2Macworld, "beta2-macworld.html"],
  [U.beta3MacRumors, "beta3-macrumors.html"],
  [U.beta4Ars, "beta4-ars.html"],
  [U.beta4Iclarified, "beta4-iclarified.html"],
  [U.beta5MacRumors, "beta5-macrumors.html"],
  [U.beta6AppleInsider, "beta6-appleinsider.html"],
  [U.beta6Ars, "beta6-ars.html"],
  [U.beta6Engadget, "beta6-engadget.html"],
  [U.beta6GeotagEngadget, "beta6-geotag-engadget.html"],
  [U.beta7Ars, "beta7-ars.html"],
  [U.beta7Iculture, "beta7-iculture.html"],
  [U.beta7MacRumors, "beta7-macrumors.html"],
  [U.beta8AppStore, "beta8-appstore.html"],
  [U.beta8Engadget, "beta8-engadget.html"],
  [U.beta8MacRumors, "beta8-macrumors.html"],
  [U.beta8Macworld, "beta8-macworld.html"],
]);
assert.deepEqual(
  new Set(evidenceFileByUrl.keys()),
  new Set(bundle.sources.map((source) => source.url)),
  "every declared source maps to one audited raw artifact",
);
for (const source of bundle.sources) {
  const name = evidenceFileByUrl.get(source.url);
  const heading = collapse(
    documents.get(name).querySelector("h1")?.textContent || "",
  );
  assert.equal(
    heading,
    source.title,
    `${name} declared title equals captured H1`,
  );
}

const publicOwnerBuffer = readFileSync(publicOwnerPath);
assert.equal(
  sha256(publicOwnerBuffer),
  "351a5f3485fcbc560ab54a6b9968c3ca2640665c2c3029c50786518f9060f0a0",
  "Public owner SHA-256",
);
const publicOwner = JSON.parse(publicOwnerBuffer);
const sharedPublicKeys = new Set([
  "ios-2-0-exchange-push-sync",
  "ios-2-0-enterprise-network-management",
  "ios-2-0-mail-document-bulk-actions",
  "ios-2-0-native-sdk-platform",
  "ios-2-0-parental-controls",
]);
const publicDefinitions = new Map();
for (const owner of [
  ...(publicOwner.versions || []),
  ...(publicOwner.events || []),
  ...(publicOwner.builds || []),
]) {
  for (const change of owner.changes || []) {
    if (!sharedPublicKeys.has(change.key)) continue;
    publicDefinitions.set(
      change.key,
      stableValue({
        title: change.title,
        canonicalSummary: change.canonicalSummary,
        category: change.category,
      }),
    );
  }
}
assert.equal(
  publicDefinitions.size,
  sharedPublicKeys.size,
  "five Public definitions available for exact reuse",
);

const declaredUrls = new Set(bundle.sources.map((source) => source.url));
let citationReferences = 0;
let occurrenceCount = 0;
const definitions = new Map();
const occurrencesByKey = new Map();
const usedUrls = new Set();
const verifiedCitations = [];
const verifyCitation = (citation, context) => {
  verifiedCitations.push(citation);
  assert(declaredUrls.has(citation.url), `${context} source closure`);
  assert(citation.locator, `${context} citation locator`);
  assert(citation.note, `${context} citation evidence note`);
  const separator = " — ";
  const phraseStart = citation.locator.lastIndexOf(separator);
  assert.notEqual(
    phraseStart,
    -1,
    `${context} locator contains an exact-evidence separator`,
  );
  const phrase = citation.locator.slice(phraseStart + separator.length);
  assert(phrase.trim(), `${context} locator contains an exact-evidence phrase`);
  const name = evidenceFileByUrl.get(citation.url);
  const sourceText = normalizeEvidence(normalized.get(name));
  assert(
    sourceText.includes(normalizeEvidence(phrase)),
    `${context} exact locator resolves in ${name}: ${phrase}`,
  );
};
for (const event of bundle.events) {
  for (const citation of event.citations) {
    citationReferences += 1;
    usedUrls.add(citation.url);
    verifyCitation(citation, `${event.target.routeAlias} event`);
  }
  for (const block of event.article?.blocks || []) {
    for (const citation of block.citations || []) {
      citationReferences += 1;
      usedUrls.add(citation.url);
      verifyCitation(citation, `${event.target.routeAlias} article`);
    }
  }
  for (const change of event.changes) {
    occurrenceCount += 1;
    assert(change.citations.length > 0, `${change.key} has claim citations`);
    assert(
      ["delta", "cumulative"].includes(change.inheritance),
      `${change.key} inheritance`,
    );
    assert(
      ["documented", "partiallyDocumented", "undocumented"].includes(
        change.documentedStatus,
      ),
      `${change.key} documentation state`,
    );
    assert(
      ["reported", "corroborated", "confirmed"].includes(change.evidenceState),
      `${change.key} evidence state`,
    );
    for (const citation of change.citations) {
      citationReferences += 1;
      usedUrls.add(citation.url);
      verifyCitation(citation, change.key);
    }
    const distinctSourceCount = new Set(
      change.citations.map((citation) => citation.url),
    ).size;
    if (change.evidenceState === "corroborated") {
      assert(
        distinctSourceCount >= 2,
        `${change.key} corroborated state has two independent sources`,
      );
    }
    if (change.evidenceState === "confirmed") {
      assert(
        change.citations.some((citation) => citation.url === U.beta1Apple),
        `${change.key} confirmed state includes retained first-party evidence`,
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
    const history = occurrencesByKey.get(change.key) || [];
    history.push({
      alias: event.target.routeAlias,
      action: change.action,
      inheritance: change.inheritance,
    });
    occurrencesByKey.set(change.key, history);
  }
}
assert.equal(occurrenceCount, 51, "selected occurrence count");
assert.equal(definitions.size, 45, "stable change-definition count");
assert.equal(citationReferences, 310, "citation-reference count");
assert.deepEqual(usedUrls, declaredUrls, "every source is cited");

for (const key of sharedPublicKeys) {
  assert.deepEqual(
    stableValue(definitions.get(key)),
    publicDefinitions.get(key),
    `${key} exactly reuses its Public-owner definition`,
  );
}
const newDefinitionKeys = [...definitions.keys()].filter(
  (key) => !sharedPublicKeys.has(key),
);
assert.equal(newDefinitionKeys.length, 40, "new local definition count");
assert(
  newDefinitionKeys.every((key) => key.startsWith("iphone-os-2-0-")),
  "all nonshared definitions use the iPhone OS 2.0 namespace",
);

const expectedHistories = new Map([
  [
    "ios-2-0-exchange-push-sync",
    [
      { alias: "beta-1", action: "introduced", inheritance: "delta" },
      { alias: "beta-3", action: "changed", inheritance: "delta" },
    ],
  ],
  [
    "iphone-os-2-0-signing-policy",
    [
      { alias: "beta-4", action: "changed", inheritance: "delta" },
      { alias: "beta-8", action: "changed", inheritance: "delta" },
    ],
  ],
  [
    "iphone-os-2-0-sdk-maintenance",
    [
      { alias: "beta-5", action: "fixed", inheritance: "delta" },
      { alias: "beta-7", action: "fixed", inheritance: "delta" },
    ],
  ],
  [
    "iphone-os-2-0-sdk-os-support",
    [
      { alias: "beta-5", action: "changed", inheritance: "delta" },
      { alias: "beta-7", action: "changed", inheritance: "delta" },
      { alias: "beta-8", action: "changed", inheritance: "delta" },
    ],
  ],
  [
    "iphone-os-2-0-sdk-macos-10-5-3",
    [
      { alias: "beta-6", action: "changed", inheritance: "delta" },
      { alias: "beta-7", action: "changed", inheritance: "cumulative" },
    ],
  ],
]);
for (const [key, history] of expectedHistories) {
  assert.deepEqual(occurrencesByKey.get(key), history, `${key} stable history`);
}
assert.equal(
  [...occurrencesByKey.values()].filter((history) => history.length > 1).length,
  expectedHistories.size,
  "only the five reviewed concepts span multiple prerelease milestones",
);

const allKeys = [...definitions.keys()];
const excludedKeyFragments = [
  "app-store-discovery-and-delivery",
  "private-enterprise-app-pages",
  "maps-location-permission",
  "camera-location-permission",
  "system-location-services-toggle",
  "camera-location-metadata-absent",
  "stability-improved",
  "mobileme-push",
  "mobileme-bookmarks",
  "itunes-application-sync-selection",
];
assert(
  excludedKeyFragments.every(
    (fragment) => !allKeys.some((key) => key.includes(fragment)),
  ),
  "future-tense, misassigned-build, anonymous, and host-only records remain excluded",
);

const locationBoundaryUrls = new Set([
  U.beta6AppleInsider,
  U.beta6GeotagEngadget,
]);
for (const event of bundle.events) {
  for (const change of event.changes) {
    assert(
      change.citations.every(
        (citation) => !locationBoundaryUrls.has(citation.url),
      ),
      `${change.key} does not assign May 22 private-build evidence to Beta 6`,
    );
  }
}
const boundaryCitations = verifiedCitations.filter((citation) =>
  locationBoundaryUrls.has(citation.url),
);
assert(
  boundaryCitations.length > 0,
  "May 22 sources remain cited as exclusions",
);
assert(
  boundaryCitations.every((citation) =>
    citation.locator.includes("; selection boundary — "),
  ),
  "May 22 sources are used only as selection-boundary evidence",
);

const beta1InactiveStoreKey = "iphone-os-2-0-beta1-app-store-inactive";
const beta8SubmissionKey = "iphone-os-2-0-beta8-app-store-submissions-open";
assert(definitions.has(beta1InactiveStoreKey), "Beta 1 inactive store state");
assert(definitions.has(beta8SubmissionKey), "Beta 8 submission opening state");
assert.notEqual(
  beta1InactiveStoreKey,
  beta8SubmissionKey,
  "consumer store availability and developer submission remain separate",
);

const articleText = (alias) =>
  bundle.events
    .find((event) => event.target.routeAlias === alias)
    .article.blocks.map((block) => block.text)
    .join(" ");
assert.match(
  articleText("beta-1"),
  /without claiming that every item first originated/i,
  "Beta 1 is a first-document baseline, not a universal first-introduction claim",
);
assert.match(
  articleText("beta-2"),
  /not Beta 2.*SDK sequence/i,
  "Beta 2 preserves ambiguous firmware numbering",
);
assert.match(
  articleText("beta-5"),
  /does not establish a separately numbered firmware seed/i,
  "Beta 5 remains an SDK-sequence identity",
);
assert.match(
  articleText("beta-6"),
  /cannot be assigned to Beta 6/i,
  "Beta 6 excludes the earlier private build",
);
assert.match(
  articleText("beta-7"),
  /none establishes a separately numbered firmware seed/i,
  "Beta 7 remains an SDK-sequence identity",
);
assert.match(
  articleText("beta-8"),
  /iTunes 7\.7 behavior, not an iPhone OS change/i,
  "Beta 8 preserves desktop-versus-device scope",
);
const itunesCompanion = bundle.events
  .find((event) => event.target.routeAlias === "beta-8")
  .changes.find((change) => change.key.endsWith("itunes-7-7-installation"));
assert.match(
  itunesCompanion.summary,
  /neither establishes it as a general iPhone OS feature/i,
  "iTunes is retained only as a developer installation companion",
);

const words = (value) =>
  collapse(value)
    .toLowerCase()
    .match(/[a-z0-9][a-z0-9._:$-]*/g) || [];
const sourceTokens = new Map();
const fourGramPositions = new Map();
for (const [url, name] of evidenceFileByUrl) {
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
assert.equal(editorialStrings.length, 276, "reader-facing copyright fields");

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
assert.equal(maximumOverlapWords, 5, "recorded copyright overlap result");

const rawBytes = [...buffers.values()].reduce(
  (total, buffer) => total + buffer.byteLength,
  0,
);
assert.equal(rawBytes, 2_855_553, "evidence corpus byte count");

console.log(
  [
    "iPhone OS 2.0 prerelease evidence audit passed",
    `raw artifacts: ${buffers.size}`,
    `raw bytes: ${rawBytes}`,
    `normalized artifacts: ${normalized.size}`,
    "route identities: Beta 1 through Beta 8",
    "selected records: 17, 4, 5, 10, 2, 4, 3, 6",
    "stable definitions: 45 (5 exact Public reuses; 40 new local)",
    "identity gaps: Beta 2 firmware numbering is ambiguous; Betas 5 and 7 are SDK-sequence milestones; no separate GM or build documents",
    "scope exclusions: May 22 private build, future-tense App Store promises, iTunes-only changes, and anonymous stability commentary",
    `citation references: ${citationReferences}`,
    `copyright fields: ${editorialStrings.length}`,
    `maximum contiguous source overlap: ${maximumOverlapWords} words`,
    `longest overlap phrase: ${overlapPhrase}`,
  ].join("\n"),
);
