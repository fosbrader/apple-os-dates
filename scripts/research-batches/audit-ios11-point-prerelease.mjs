import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readdirSync, readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import { JSDOM } from "jsdom";

const here = dirname(fileURLToPath(import.meta.url));
const evidenceDirectory = resolve(
  process.argv[2] || "tmp/ios11-point-evidence",
);
const bundle = JSON.parse(
  readFileSync(resolve(here, "apple-ios-11-point-prerelease.json"), "utf8"),
);
const sha256 = (value) => createHash("sha256").update(value).digest("hex");
const collapse = (value) => value.replace(/\s+/g, " ").trim();
const normalizedText = (value) =>
  value
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/[“”]/g, '"')
    .replace(/[‘’]/g, "'")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();

const expectedArtifacts = {
  "111-b1.html": [
    123804,
    "e41bb580ac5715eb15277c0b7014eba3f17260092020233abe17adebd275966d",
    "article",
    1285,
    "99bf03c3597b58b9cfbec814f4565d0a90583620595b989a7ac35a5fd2abb898",
  ],
  "111-b2.html": [
    132169,
    "fb638b17bf7a1dd2739fbbb027b54a4bf5d0c367d57acf8212a2f7463909f92e",
    "article",
    1804,
    "503aea66683410d95f5763e1ac0652522c32ab29d4311cbb9462582628ae144c",
  ],
  "111-b3.html": [
    128050,
    "9294625b6a4a6b4530b2168ec837b51b31802d590dc60e60f54696de507efff1",
    "article",
    2379,
    "67b8f9417183c7ede736c25d04dbd11f3a7c2c5d2930c18e9eb3320f4c96a79f",
  ],
  "111-b4.html": [
    131420,
    "53d6550d09a56dc74cfdf308a8d065358e28f6910746789e3039995d93279678",
    "article",
    2572,
    "d3c8dd22e96fd2e86fbeb4afdea6fcb7b95ad084a25656892246f544a34cef25",
  ],
  "111-b5.html": [
    131616,
    "9fb35c80f2a345fdb0d553003d70fb808a0bc93ac58040533f5d21721fcfa83b",
    "article",
    2886,
    "9da2bfbe8b0d330cf7b249d6c2508bb02b8417dda9e1c49ff383a2ec26977655",
  ],
  "111-pb1.html": [
    127569,
    "cd0e56b38b9c2633aa35209101db1a20ca76b377519d39dd5662cebfb359ddab",
    "article",
    1626,
    "16c66565cfb5be5be6a088f8557d1e4a8ec0b5a5e54d433ad31202cd1ca3a69a",
  ],
  "111-switcher.html": [
    124162,
    "40e59b67b4ff4eec3548e55c274c0595af9d7cf7bcacb2a7aefc434eb3e77618",
    "article",
    1481,
    "356ba1dcabb507c6c582d6370a2538a5c45f7aa1b3e09e10660fe35efa6540dc",
  ],
  "112-autocorrect.html": [
    128846,
    "1e4097fbbb88100097654708fe43809ab1710ec9cad2595f5c109c255297f5de",
    "article",
    2519,
    "647b7ed81fee85ec6d0b22b87741d84b4f7d513c470c85793d4834917d480dc1",
  ],
  "112-b1.html": [
    124224,
    "a944d29775219a7f7852e17a4540037dd317338d5010a1672f7244eabf176b00",
    "article",
    1565,
    "7fe1b516a1294e58175c6fb19e5fd5e0d8db5892a1622af0bea16a92cb4cf9f8",
  ],
  "112-b2.html": [
    125287,
    "197a3b37d7aa5f3fb88158437f661b888700c5bada5c64afa7b879ab28da21f0",
    "article",
    1622,
    "5532d0b39e2bf62a685af0b9d3a2e2f1aad87765e1fec81fcdfe028dbc6f5ba6",
  ],
  "112-b2x.html": [
    127980,
    "0a7cc9db0a3568a8d4113de0c8456d4097d7875fbc28cd953e00cc5f6ad06a51",
    "article",
    1700,
    "c36817c5797b7429312e4093031542c0790c32d658e9fab003d69e21eab5880d",
  ],
  "112-b3.html": [
    126321,
    "2c80a36ed0d8595d89bbb338f48436dfb0655ea152c4bf61126b4a424215faa8",
    "article",
    1809,
    "f7cf3efce94792b1c071dbc2289500c72e5d251044130462ece83bfc7c7ac50a",
  ],
  "112-b4.html": [
    129342,
    "151d55c3b5717f98eb9cbb91e172ee4e569ff0d94321ede26034e9d62cfcb005",
    "article",
    2662,
    "69851049dfd4f25f5292b648dc8e6ff1d6d37380ba9d0c872c8740fe0c5f1ddc",
  ],
  "112-b5.html": [
    130629,
    "7bbcb78336d652854877f28343a71dc9b9a9f5fe98add80d299ae7b789fea51f",
    "article",
    2678,
    "75096083376093379bbb1e2240ef928653d0742b79ac23b7ace7ba903fb07aa5",
  ],
  "112-b6.html": [
    128598,
    "8a64c19bbb4a326e0bca65188b63f075417311bc570b6999b146f8d2467e5089",
    "article",
    2795,
    "a7e7c5647e5e911edff5e905c3a6cd1a833df6fb933e2be25c83db23008a4db1",
  ],
  "112-charge.html": [
    129271,
    "d623d934d7063eaa27d01f717520d6ceae73d47e9c440a5a6e5fb088c849992a",
    "article",
    2367,
    "d685a8a8b61aeabb873f89a4ac88ed6f9c4e12a59f0dc3aa941c737997bf7f9c",
  ],
  "112-control-center.html": [
    131244,
    "1cf83946a63663aeada335249ba1bdbb06de34554d6e32f4de919db4d0d05779",
    "article",
    3110,
    "934a10ff8da0a15dfca725faa366da7275e64851d705d5aedef0525df28ab7db",
  ],
  "112-pb1.html": [
    127682,
    "235a60dc5190ec52c6aaee09ffa9a3712d3304f5746c5065dee212d9edc07e4f",
    "article",
    1639,
    "9ed5af22a0ae09bd98fa922f181cf2f5651f4a961f7771a6232196cffcb770d9",
  ],
  "112-pb2.html": [
    129332,
    "e25db5e70858780b0385895f118e7732c86f986ece2000349a4560e1a965113d",
    "article",
    1692,
    "b6dee86409d42f5b98c74617457cee540b5c11ae9d7edb4bb62a04eda34e1259",
  ],
  "113-b1.html": [
    136976,
    "c46d90e8efc8f0603323aa7dfaa287572b6d804598c7169e993433e7f72f64e3",
    "article",
    3810,
    "9e077234809fa84a74f3dd15583380afb283d5fb368d10ac569afc15f2ca7d20",
  ],
  "113-b2.html": [
    129810,
    "486b9aaa7c0fe388a06435a5f46a9d2f677a3dcecf8c9e84ea184c98a426e3ad",
    "article",
    3743,
    "bc5fa729005c29e7fa025439093cd3dffe394c03b3b2e4b855ff4c4a0777246b",
  ],
  "113-b3.html": [
    133071,
    "cb7e14a569dd1d69a7f199b6939bddf0e885f03a3de9d669f2f004621faa5f41",
    "article",
    3782,
    "cea896bfd669f0f87eef41e9b67161a402faf147003ea337b2515dfeb49a0dab",
  ],
  "113-b4.html": [
    132789,
    "e054b33cb89da4ae1a954a1d28b857bf0904c19a565fc8b8bbddd589b7a04f61",
    "article",
    3371,
    "a9db4d653b7c8f2eb0adb8b82103c6ce13ba0a1824aba1bfabb38c05eb9381e4",
  ],
  "113-b5.html": [
    133105,
    "78ac60030da3603345f964146762d281bf2cc38814210aa0b88e532b35c5e2eb",
    "article",
    3316,
    "f7bafdf5689d5c96a61fdd4648af939f55ad4694943975334c50be1d065007f0",
  ],
  "113-b6.html": [
    131357,
    "6fa3ebe094ced9db178fbe570e1067e7bae2e3e82bc02987fb698494379b9b7c",
    "article",
    3299,
    "72fc41fa38dae5d3482c78616184eda2072c1869b1897b1014bdcb7801064d10",
  ],
  "113-pb1.html": [
    128896,
    "63bfe9195dc88d747fef21b83602784ad369f3b2e4945ce1ccede829c3b32659",
    "article",
    2345,
    "cd0cdb81e1432863e8efef2be0cd588e3970de60d9884500fa4a2dc9efbcd0b3",
  ],
  "113-pb2.html": [
    128222,
    "962aed1335f504bf39a4dd3d5dfe81876c44a62f8779c30436f41c0d334fb2f9",
    "article",
    2860,
    "21aca4a5e293b25c070f6fcb8c68af6caebafa97b2f26d91896be1a91fe0d780",
  ],
  "113-pb3.html": [
    128906,
    "ea1360dc49a45197ce1ac1a0c801513d6db147e5192f6fcad53e3e2815b9c00a",
    "article",
    3303,
    "07b5bc542d1ede187c2aa8fb7039cb8daba27b8bb2c86580bd0ded211fbc8562",
  ],
  "114-b1.html": [
    126736,
    "4d97d0246fb53ea292e95e92f9de72307ad02d102f3e282fac38484a1cb7b1dd",
    "article",
    1728,
    "775f95066ed17fad408f01157740a2d3ca0434f5ae9d6d5620d8e6937d5016ef",
  ],
  "114-b2.html": [
    128433,
    "c652899df27e4cb24c6f62b9454567a87ff2199d40f3201227cb8a2a8583d4c7",
    "article",
    1841,
    "807ee3f21db45add5ecd4b89d6f2cd3c40115d41ee9390d4cd3117f6b5646a0b",
  ],
  "114-b3.html": [
    128477,
    "f1d816bce532c839b36a5b6de1a778d9b31f9158768408ad8546cea8b0a06136",
    "article",
    2404,
    "4a3da99d0944db2f3de130c172bbb5396bff2bbea6ec586e90dd3e6787b079d1",
  ],
  "114-b4.html": [
    126788,
    "6222d3001c2d33876fff35e28c32e50863e03d9057e3eb822912fa45b167f0c5",
    "article",
    2750,
    "816356a2803636b094e0de402548beba3e5e77c692e4bba261dc58532394e1e0",
  ],
  "114-b5.html": [
    136910,
    "49f367e371f15cb337ebefc512c46a29db7aae1db61833aa7621e5b4da9aca3c",
    "article",
    2755,
    "55dc3cff651cf9b50423cb2c9755e9a4471f5162c0c6b1deaa817a29b6467ad7",
  ],
  "114-b6.html": [
    127238,
    "63940813570e9994d60a3804a3baf11fff53d88322e05ac275fcd3ce07bb2e18",
    "article",
    3011,
    "95bf1de2fe38e3b670acb5dd34953e442fade18b1165bd43269ddeb87ff2d7b1",
  ],
  "114-pb1.html": [
    127057,
    "0b50104e0352e99aa1daac5249e4e3330cae0c82b21099ffa2d717238eadaec8",
    "article",
    1565,
    "257d54846fc56398dd4cc9498bd253b1d12142b54647b166ac44549f6a80a7be",
  ],
  "114-pb2.html": [
    126239,
    "e36a5b6cce30ed9fc1782f6975a2df65133e6fb7b33d5dcda281e7046ca22039",
    "article",
    2128,
    "e5dd8fc0affa5faa413d8ccec0b3af66a45cb47f6ce5f96c70675fcf268a2465",
  ],
  "114-usb.html": [
    129524,
    "204db215d930997d31a1692dcbf705196de72468d7e11be913fa54883326cffc",
    "article",
    3695,
    "aa8215cea6735f97e964cc1b94ec5413e4d1894d000ce65dc26869b5ed305b54",
  ],
  "1141-b1.html": [
    125393,
    "ee1a7d6edb7a7a81e7da359ad0d8985ebe4ac37fab0b0863a004d64f5e438ae6",
    "article",
    866,
    "2241bbe31927a4076b6a7c6ff559f8da16e2edc2cc832ece38ec4d121bbc6bdf",
  ],
  "1141-b2.html": [
    126007,
    "97b9cdf7df1a63c25053afaeb9da4b7f61c07cf2db72cfe9d1e6f901055a67c8",
    "article",
    987,
    "083f67fd50d526d64878b954d140bc4edbb456acc1773c30e6ae0fbc960b1493",
  ],
  "1141-b3.html": [
    127179,
    "4694a956386ac3baf90fa60945ef5cccd02ca5f80a89153610a3c7f1304d23d7",
    "article",
    1089,
    "66b4a9d0ea94f2895a1c822d43306f702f66316efbe00fa4f675aa6e18a17c71",
  ],
  "1141-b4.html": [
    125449,
    "4fe66ba282271907c8e47a44e49822295e26660ada7e6bc09911c1f124369913",
    "article",
    1116,
    "b1c80647ab8850270de7073b5bbec63256f34572085f713c9c0e9d3f2393f027",
  ],
  "1141-b5.html": [
    126407,
    "785391629d2a79b10274f09d272e162010cc1a127b39790be9e73fd3203b46f6",
    "article",
    1130,
    "28e67eadb0e833da3c2768ac436cb8e46b712c1aedbd3e5416cc630cee7b3a9f",
  ],
  "1141-pb1.html": [
    124565,
    "b2434ccb34d026cb18379bfe01a81030686a9db41c9c1d7577f2d230822c1fab",
    "article",
    938,
    "8194641b972a2d41bbf4de68b49c67676513432c6529f3e4782d72e6859ecaa9",
  ],
  "1141-pb2.html": [
    124172,
    "1059c2f2cb75e1b9205e2b16085f5550ef6431872b8c310677fe969cf858145b",
    "article",
    1024,
    "3871c6cc18b4114a78382cb943179adb8aca618ac442921ee2e79f94cb09221d",
  ],
  "apple-113-preview.html": [
    154058,
    "141e5b233618c5fdad8725e8da8c8ca2ac6d8f4fcd5cb979f7252185ea994ca6",
    "article",
    7198,
    "ccb4638562686e22492ebe0d8e54c49d4b575de1226549df512adb9149e1b21c",
  ],
  "apple-113-release.html": [
    174834,
    "b9c802b918848a4f2188cd80adc6fbc905baa60ff0db70207a979104477b3af7",
    "article",
    9300,
    "9c3a095ce751ede35dce0d4012604669dbc4695e837dc11ea3b4f0c660419284",
  ],
  "apple-ios11-updates.html": [
    1210271,
    "532a532abe4ced42eadc1563f81b83c886ef24e412a639452389b60e08d09bad",
    "#sections",
    24788,
    "022750f7055f5fe26bdf9f86d8c710abca810e84eae27f9c08cc9dac4e4e6714",
  ],
  "apple-ios111-notes.html": [
    22621,
    "1a2658934a29af1ee0e84d77d90b03ca2c9cba26930046e34aabcf63acf04ba8",
    "article",
    5800,
    "3c2830e978bd703dce0503213971b2a12b5048e921f7429f9424b30540871dac",
  ],
  "apple-ios112-notes.html": [
    22715,
    "6ba1d94e82f9bf66bd0490aa302f239e3df2288d96c7c396adc97c3a26dca7c4",
    "article",
    5468,
    "7ff7853c7e2fd8f223dd1b09c69ed6efd1b491b777730a8ebdc2c0ddca22f482",
  ],
};

assert.deepEqual(
  new Set(readdirSync(evidenceDirectory)),
  new Set(Object.keys(expectedArtifacts)),
  "retained evidence file closure",
);

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

const evidenceNamesInSourceOrder = [
  "111-b1.html",
  "111-pb1.html",
  "111-b2.html",
  "111-switcher.html",
  "111-b3.html",
  "111-b4.html",
  "111-b5.html",
  "112-b1.html",
  "112-pb1.html",
  "112-b2x.html",
  "112-b2.html",
  "112-pb2.html",
  "112-autocorrect.html",
  "112-b3.html",
  "112-control-center.html",
  "112-charge.html",
  "112-b4.html",
  "112-b5.html",
  "112-b6.html",
  "113-b1.html",
  "113-pb1.html",
  "113-b2.html",
  "113-pb2.html",
  "113-b3.html",
  "113-pb3.html",
  "113-b4.html",
  "113-b5.html",
  "113-b6.html",
  "114-b1.html",
  "114-pb1.html",
  "114-b2.html",
  "114-pb2.html",
  "114-b3.html",
  "114-b4.html",
  "114-usb.html",
  "114-b5.html",
  "114-b6.html",
  "1141-b1.html",
  "1141-pb1.html",
  "1141-b2.html",
  "1141-pb2.html",
  "1141-b3.html",
  "1141-b4.html",
  "1141-b5.html",
  "apple-ios11-updates.html",
  "apple-ios111-notes.html",
  "apple-ios112-notes.html",
  "apple-113-preview.html",
  "apple-113-release.html",
];
assert.equal(evidenceNamesInSourceOrder.length, bundle.sources.length);
const sourceFileByUrl = new Map(
  bundle.sources.map((source, index) => [
    source.url,
    evidenceNamesInSourceOrder[index],
  ]),
);
assert.deepEqual(
  new Set(sourceFileByUrl.values()),
  new Set(Object.keys(expectedArtifacts)),
  "declared source/evidence closure",
);

for (const source of bundle.sources) {
  const name = sourceFileByUrl.get(source.url);
  const document = documents.get(name);
  const canonical = document.querySelector('link[rel="canonical"]')?.href;
  if (canonical) assert.equal(canonical, source.url, `${name} canonical URL`);
  const text = normalized.get(name).toLowerCase();
  const meaningfulTitleTokens = normalizedText(source.title)
    .split(" ")
    .filter((token) => token.length >= 4);
  assert(
    meaningfulTitleTokens.filter((token) => text.includes(token)).length >= 2,
    `${name} preserves its declared title context`,
  );
}

const expectedRoutes = [
  ["11.1", 5, 5],
  ["11.2", 7, 6],
  ["11.3", 6, 6],
  ["11.4", 6, 6],
  ["11.4.1", 5, 5],
];
assert.equal(bundle.events.length, 57, "route count");
for (const [version, developerCount, publicCount] of expectedRoutes) {
  const versionId = `version-ios-${version.replaceAll(".", "-")}`;
  const routes = bundle.events.filter(
    (event) => event.target.releaseVersionId === versionId,
  );
  assert.equal(
    routes.filter((event) => event.identity.channel === "developerBeta").length,
    developerCount,
    `${version} developer route count`,
  );
  assert.equal(
    routes.filter((event) => event.identity.channel === "publicBeta").length,
    publicCount,
    `${version} public route count`,
  );
}
assert.deepEqual(bundle.versions, [], "no version overlays");
assert.deepEqual(bundle.builds, [], "no builds");
assert(
  bundle.events.every(
    (event) =>
      event.target.routeAlias !== "public" &&
      !["releaseCandidate", "goldenMaster"].includes(event.identity.channel) &&
      event.provenanceStatus === "sourceLinked" &&
      event.editorialReview?.status === "readyForReview" &&
      !event.editorialReview?.reviewedAt &&
      event.isIndexable === false &&
      event.identity.closesReleaseCycle === false,
  ),
  "review-only non-Public route state",
);
assert.deepEqual(
  bundle.events
    .filter(
      (event) =>
        event.target.releaseVersionId === "version-ios-11-2" &&
        event.identity.label.startsWith("Beta 2"),
    )
    .map((event) => [
      event.target.routeAlias,
      event.identity.label,
      event.identity.appearanceDate,
    ]),
  [
    ["beta-2-2017-11-03", "Beta 2", "2017-11-03"],
    ["beta-2-2017-11-06", "Beta 2", "2017-11-06"],
  ],
  "iPhone X and general Beta 2 routes remain distinct",
);
assert.equal(
  bundle.events.filter((event) => event.identity.channel === "developerBeta")
    .length,
  29,
  "owned developer count",
);
assert(
  bundle.events
    .filter((event) => event.identity.channel === "developerBeta")
    .every((event) =>
      event.identity.stableEventId.startsWith(
        `${event.target.releaseVersionId}:m-`,
      ),
    ),
  "developer overlays retain seed-migrated stable identities",
);
assert(
  bundle.events
    .filter((event) => event.identity.channel === "publicBeta")
    .every(
      (event) =>
        event.identity.stableEventId ===
        `event:apple:ios:${event.target.releaseVersionId
          .replace("version-ios-", "")
          .replaceAll("-", ".")}:${event.target.routeAlias}`,
    ),
  "new public-beta routes use canonical stable identities",
);

const declaredUrls = new Set(bundle.sources.map((source) => source.url));
let citationReferences = 0;
let occurrenceCount = 0;
const definitions = new Map();
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
      change.key.startsWith("apple-ios-11-point-prerelease-"),
      `${change.key} batch prefix`,
    );
    assert(change.citations.length > 0, `${change.key} claim citations`);
    for (const citation of change.citations) {
      citationReferences += 1;
      assert(declaredUrls.has(citation.url), `${change.key} source closure`);
      assert(citation.locator, `${change.key} citation locator`);
      assert(citation.note, `${change.key} citation note`);
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
assert.equal(occurrenceCount, 89, "occurrence count");
assert.equal(definitions.size, 51, "definition count");
assert.equal(citationReferences, 571, "citation-reference count");

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
        markerOverlap >= 1,
        `${change.key} locator resolves in ${sourceFileByUrl.get(citation.url)} (${citation.locator})`,
      );
      assert(
        claimOverlap >= 2,
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
assert.equal(editorialStrings.length, 755, "copyright field count");

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
assert.equal(rawBytes, 7_241_751, "evidence corpus byte count");

console.log(
  [
    "iOS 11 point-release prerelease evidence audit passed",
    `raw artifacts: ${buffers.size}`,
    `raw bytes: ${rawBytes}`,
    `normalized artifacts: ${normalized.size}`,
    "route identities: 29 developer or limited-device beta routes and 28 public-beta routes",
    "route gaps: no defensible RC/GM; Messages-in-iCloud removal and USB restriction first seed remain unattributed",
    `selected occurrences/definitions: ${occurrenceCount}/${definitions.size}`,
    `citation references: ${citationReferences}`,
    `weakest locator/claim token overlap: ${weakestLocatorOverlap}/${weakestClaimOverlap}`,
    `copyright fields: ${editorialStrings.length}`,
    `maximum contiguous source overlap: ${maximumOverlapWords} words`,
    `longest overlap phrase: ${overlapPhrase}`,
  ].join("\n"),
);
