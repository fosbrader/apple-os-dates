import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { JSDOM } from "jsdom";

const here = dirname(fileURLToPath(import.meta.url));
const evidenceDirectory = resolve(process.argv[2] || "tmp/ios4-point-evidence");
const bundle = JSON.parse(
  readFileSync(resolve(here, "apple-ios-4-point-prerelease.json"), "utf8"),
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

const preservedIos40Hashes = {
  "build-apple-ios-4-prerelease.mjs":
    "ce025a98788d24c0e78b1a42d44f7f6bf6d0db0146f3b8cd6f2e9f9236eda9a7",
  "audit-ios4-prerelease.mjs":
    "b579e7427e750135591c748423816b1be46a260970a78e847606e2bff1f43555",
  "apple-ios-4-prerelease.json":
    "552baa65718aafb20e8c22586663d4a6ba95ba39a1a043c34b5c10475cc38010",
  "apple-ios-4-prerelease.md":
    "ddda68c0a849260bcf6450d2e3191a5f2a56f930a673d1a3eda1cfa6f0573b38",
};
for (const [name, expectedHash] of Object.entries(preservedIos40Hashes)) {
  assert.equal(
    sha256(readFileSync(resolve(here, name))),
    expectedHash,
    `${name} remains untouched`,
  );
}

const expectedArtifacts = {
  "41-beta1-cultofmac.html": [
    286_705,
    "89928a7b170418f586735612d9bd552b667a249bdbbaabc50b5299b812796253",
    "article",
    2_696,
    "270aeac13e64a2c6772846685fa824c4316c0a62ffc2886a65802d6d0b205bb2",
  ],
  "41-beta1-iclarified.html": [
    194_883,
    "f2ac1cba54b7653f681bb2cea4061990e67658330fcc8a52d7299507b40ebc95",
    "article",
    1_347,
    "5220b1e872c41c3373c9ce6863fa52cbec1999edf465e68149e2d9dac76c2a97",
  ],
  "41-beta1-signal-macrumors.html": [
    113_127,
    "033fb16149d3dd8da131c5441cde49eb816e7cd56440306efb75c047f0bed8a1",
    "article",
    1_073,
    "1f1f08df10be73d40be6f6912ba172e9797182d9fa64692a265fcbfffe1f1739",
  ],
  "41-beta2-macrumors.html": [
    111_817,
    "bd902ea40b702ab62b748997f1f8f7300a09c1557679cb8fe5c6222ef02dabe9",
    "article",
    547,
    "ac9d4ac6aafad4db0a3cdc9b9ef34c3a47561f3aa54d774b8b843a1d975f6277",
  ],
  "41-beta2-techcrunch.html": [
    223_665,
    "687e35184923991ee032f05fd1d8f80c6ac760fe437b1883cbfa0bcf76f5204b",
    ".entry-content",
    422,
    "a36b19fece7ea77d0a71035ca5b6ff07e35a0899276c65619f27918b797c879f",
  ],
  "41-beta3-iculture.html": [
    559_199,
    "e90403bd140979c79c4186fb1c8a649656a4382f22ce7c555c28998526b229f8",
    ".main__content-body",
    1_913,
    "9d0d78577170a0498dbc281a3bba4437aa7ebef9cf4892727c3d89f7173f79ae",
  ],
  "41-beta3-macrumors.html": [
    113_140,
    "50fc35cf80ca346379f33ab913a2752e9c462d01747d88360b2b34ed7fc940b7",
    "article",
    1_163,
    "60921974ea68839eb5d9bd766e556c6bc053ec3f68f7cbafb79fe8fb2fbac3a1",
  ],
  "41-gm-apple-developer.html": [
    106_199,
    "6741079492836b8dac13d81cacc2a60971bd59a3a5567478f4d4cfc2c943defb",
    ".article-text",
    245,
    "b3199a6d496d040dba011c40a66807c3e8503e6d1c20a5888f0a2d9b62f3e77c",
  ],
  "41-gm-macrumors.html": [
    115_365,
    "dcfce06d866e695ad5c8e445b38a63d436dc79be2d0f379c50f4f79b8765f61b",
    "article",
    1_890,
    "ef6cb54a6582265e8511ac83242598b633a12c4a5bffe1d579effc7c997cd5bc",
  ],
  "42-beta1-apple-airprint.html": [
    126_226,
    "dda64dedf723daa98828b58c080300a3b6e2b520c04020167af29836b365f7ce",
    "article",
    2_807,
    "7a360c9fd8ca9c14513781dab008cb49ec97be8f87dd917d5b0d9b429d6f38e5",
  ],
  "42-beta1-macrumors.html": [
    112_980,
    "2aea2c720fdafdb815f6b8f284a1ea3311dec6f55d8f2e9f2347a4e91ddb794b",
    "article",
    1_235,
    "c013a0a85458d6ab6c7867a254f3e8f141c1cb6b1ff25ca2314c8bde6ebae3cc",
  ],
  "42-beta1-macworld.html": [
    211_729,
    "b630bc12d59dd0e0587762dbb1218c00dd150f1b6d0bcfe13002d04878b0204b",
    ".entry-content",
    8_036,
    "fd864f0c54d0ce23845552342bce386383bb9c12c3d042491c0e8f5496ee9766",
  ],
  "42-beta2-macrumors.html": [
    114_264,
    "fa51b456d8490e5c6a5650214816bbfd712c73d98888ee4f6ed3c834172ae5b5",
    "article",
    802,
    "7c622ca462928b56b5dcc8a884d2219a23b8f8f69cc12bfbd5047ea91352973e",
  ],
  "42-beta2-macstories.html": [
    58_661,
    "b2548259cd563cecc85148de83bbb4c743ac86f02e5a17c45a7a3974844c0650",
    ".post-content",
    2_663,
    "81460f529a5d2960f0c32c1aca19a9100eca0e0844ac300aeb99a6570e9995ad",
  ],
  "42-beta3-changes-macrumors.html": [
    112_501,
    "b8f297094af295a4dd602ba07bdd8b20924330d42a264c6b91dba70735e5471c",
    "article",
    676,
    "cf825788aa1cb328d5f1b2aadf886d3197940ea26eb2c49897a064576b457f43",
  ],
  "42-beta3-macrumors.html": [
    112_057,
    "d8fb10c8bb28bc79ec7f01be5d48d3fe85dd7b42253b7061bf207b11153a1fc0",
    "article",
    627,
    "df32568dc8769807c8fd5dfc2a79fa106bdfb0ff706b15a63aa9b1b9add8ce3e",
  ],
  "42-gm-macrumors.html": [
    112_282,
    "36ad83831dcaf95db0f852e5cdc9a7dcb0c69ac3a7e1cd18b34eb747a3c373bd",
    "article",
    1_097,
    "cdca11775a18687499ed83a91424c7e3b6887da97372a1f9fda13f22813008da",
  ],
  "42-gm-transcript.html": [
    174_326,
    "711b347701778825c7749583f9b3b4979f1873237cd4fc282708dafe1f74b9a8",
    ".entry-content",
    3_121,
    "5dc471d0dc9f8605615d6c9301fef93a469fe0d2f2f0fd4516a9c564cef7de67",
  ],
  "42-gm2-macworld.html": [
    202_190,
    "57673af5b17acea1e6759872e7524e3c7c2319532140767d9af0d9fa329b2c93",
    ".entry-content",
    2_411,
    "bb35f9773bd273d602f333bac09089a07c60b20f324520c92c65b9e0a1c6b163",
  ],
  "421-gm-macworld.html": [
    199_037,
    "dd5a74b08a6441a5b83ae05d1b50b77bc641569f89326e800bf8457edaceb0fe",
    ".entry-content",
    1_632,
    "5a299bee50bfb0f812260869ee0e307b06fb53627416e6fa1cde886d97be6996",
  ],
  "421-public-apple.html": [
    129_462,
    "a8b906d4c15c08607434551463c1e23e1bed9113c2add88fd5b2e4ee56fce1cc",
    "article",
    5_334,
    "6ad9ddf7cbd532bb359a159ce99e78ba49610a5f3c8a4e9d67c04fb655a64fef",
  ],
  "43-beta1-engadget.html": [
    63_036,
    "811b39257335e3c8d1b2f38d388748dc61c9088d7303c7a69faf09a785080885",
    "article",
    1_857,
    "b31f1c19d090bcf36887f75d2a99700d2681eebc365b2f3d1177fd463d581061",
  ],
  "43-beta1-macrumors.html": [
    115_674,
    "30ca933d3b41cbef662c24a37f4642fe65b506502c536cb9c55475418728fa86",
    "article",
    1_549,
    "7ed84af0b7e3a3462c9aae345a9e3b00ecf17483d4be4a6e3680798688ac0f3b",
  ],
  "43-beta1-side-switch.html": [
    112_641,
    "cd67b240613ac026908a4c592f35829608cd3e5adf9268fd9c6cea3e037468ca",
    "article",
    736,
    "e3d57fcd05cbc51af12ff1bb3fda46cfb5dc070ccc065fd60c122a3a74eaf790",
  ],
  "43-beta2-macrumors.html": [
    112_906,
    "08b56f16e0a4cfabf664787602f0bc65f56b5529a6a97626bf5d751c4eedd9ab",
    "article",
    1_410,
    "c877fa0c731c79c078bf25724afcb0cb7258b132ccae02dece80b7026bbdd2c1",
  ],
  "43-beta2-macstories.html": [
    47_799,
    "1ebea0bbda70ff6ba4bc935cae80f93ced1e327cb6482eba207bade65efe7962",
    ".post-content",
    1_380,
    "50b994a472d4c62b620bb967487246c9999707920063a6cb0238c1cad3b368b6",
  ],
  "43-beta3-macrumors.html": [
    113_546,
    "4a58e3eef90ff135ac975dc5846ae3a751bc38279b6c6a25a6ea12eea2301be6",
    "article",
    1_932,
    "0926f8bd340f7ac232a367ffcb6648a899bc89b542b39e0f79ee03adf025dcda",
  ],
  "43-beta3-macworld.html": [
    201_239,
    "396211aa5b2c589874273a5413b8fb26ea501821d880ad3a7207acdf6e174a5f",
    ".entry-content",
    2_075,
    "d03e83e213a37693fff9a6b85dc3ac607513b300c21ba54f0c7b3314eda70fcf",
  ],
  "43-gm-apple-developer.html": [
    107_042,
    "264b706e8f79f910be1d30c36e3be10d9d532ff517a4a9d0b963a64ddcece12a",
    ".article-text",
    454,
    "2112fc75c8e10a7c2ecbee5a6a1a2b6546cca3c15ec1d21d2c2a80a98de304c2",
  ],
  "43-gm-macrumors.html": [
    112_222,
    "565e07d6b9e7979ab1d2e9dd86df7795eaf82763ef1b3292f3d9819c40100a75",
    "article",
    728,
    "80bac8a4a85501938c10e1c8e4a888fbe41be26c2cf8b6bbb0ba01df7167e524",
  ],
  "43-public-apple.html": [
    127_187,
    "003fcefcbd9b1e29148b265c33ce481d72264ceaaba62f599a48cb67de4115ee",
    "article",
    4_798,
    "4e08a4522bbc6c3e074c397571a27d6fa33c8db065507d3a7f2c087bed63243f",
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

const evidenceFileByUrl = new Map([
  [
    "https://www.cultofmac.com/news/apple-releases-ios-4-1-beta-and-sdk-to-developers",
    "41-beta1-cultofmac.html",
  ],
  [
    "https://www.iclarified.com/10604/apple-releases-ios-41-beta-to-developers-update-x2",
    "41-beta1-iclarified.html",
  ],
  [
    "https://www.macrumors.com/2010/07/14/ios-4-1-beta-includes-apples-planned-signal-bar-changes/",
    "41-beta1-signal-macrumors.html",
  ],
  [
    "https://techcrunch.com/2010/07/27/ios-4-1-beta-2-now-available-to-developers/",
    "41-beta2-techcrunch.html",
  ],
  [
    "https://www.macrumors.com/2010/07/27/apple-releases-iphone-os-4-1-beta-2-to-developers/",
    "41-beta2-macrumors.html",
  ],
  [
    "https://www.macrumors.com/2010/08/03/apple-releases-ios-4-1-beta-3-and-updated-sdk-to-developers/",
    "41-beta3-macrumors.html",
  ],
  [
    "https://www.iculture.nl/nieuws/apple-brengt-ios-4-1-beta-3-uit/",
    "41-beta3-iculture.html",
  ],
  [
    "https://developer.apple.com/news/?id=09012010b",
    "41-gm-apple-developer.html",
  ],
  [
    "https://www.macrumors.com/2010/09/01/apple-announces-pending-release-of-ios-4-1-4-2-coming-in-november/",
    "41-gm-macrumors.html",
  ],
  [
    "https://www.apple.com/newsroom/2010/09/15Apples-AirPrint-Wireless-Printing-for-iPad-iPhone-iPod-touch-Coming-to-Users-in-November/",
    "42-beta1-apple-airprint.html",
  ],
  [
    "https://www.macrumors.com/2010/09/15/apple-releases-first-ios-4-2-beta-for-ipad-iphone-and-ipod-touch/",
    "42-beta1-macrumors.html",
  ],
  [
    "https://www.macworld.com/article/207734/firstlook_ios42b1.html",
    "42-beta1-macworld.html",
  ],
  [
    "https://www.macrumors.com/2010/09/28/ios-4-2-beta-2-and-itunes-10-1-beta-seeded-to-developers/",
    "42-beta2-macrumors.html",
  ],
  [
    "https://www.macstories.net/news/apple-releases-ios-4-2-beta-2/",
    "42-beta2-macstories.html",
  ],
  [
    "https://www.macrumors.com/2010/10/12/apple-seeds-ios-4-2-beta-3-to-developers/",
    "42-beta3-macrumors.html",
  ],
  [
    "https://www.macrumors.com/2010/10/12/ios-4-2-beta-changes-new-sms-tones-ipad-changes-airplay-missing/",
    "42-beta3-changes-macrumors.html",
  ],
  [
    "https://www.macrumors.com/2010/11/01/apple-releases-ios-4-2-golden-master-to-developers/",
    "42-gm-macrumors.html",
  ],
  [
    "https://www.ithinkdiff.com/apple-released-ios-42-gm-itunes-101-beta-2-developers-today/",
    "42-gm-transcript.html",
  ],
  [
    "https://www.macworld.com/article/208988/ios42_waiting.html",
    "42-gm2-macworld.html",
  ],
  [
    "https://www.macworld.com/article/209096/ios_421.html",
    "421-gm-macworld.html",
  ],
  [
    "https://www.apple.com/newsroom/2010/11/22Apples-iOS-4-2-Available-Today-for-iPad-iPhone-iPod-touch/",
    "421-public-apple.html",
  ],
  [
    "https://www.macrumors.com/2011/01/12/apple-seeds-ios-4-3-beta-to-developers/",
    "43-beta1-macrumors.html",
  ],
  [
    "https://www.engadget.com/2011-01-12-new-ios-beta-released-offering-new-gestures-xcode-updated-with.html",
    "43-beta1-engadget.html",
  ],
  [
    "https://www.macrumors.com/2011/01/12/ios-4-3-beta-brings-software-option-for-rotation-lock-or-mute-on-ipad/",
    "43-beta1-side-switch.html",
  ],
  [
    "https://www.macrumors.com/2011/01/19/apple-releases-second-beta-of-ios-4-3-to-developers/",
    "43-beta2-macrumors.html",
  ],
  [
    "https://www.macstories.net/news/apple-releases-ios-4-3-beta-2/",
    "43-beta2-macstories.html",
  ],
  [
    "https://www.macrumors.com/2011/02/01/apple-seeds-ios-4-3-beta-3-to-developers/",
    "43-beta3-macrumors.html",
  ],
  [
    "https://www.macworld.com/article/210444/ios_4_3-2.html",
    "43-beta3-macworld.html",
  ],
  [
    "https://developer.apple.com/news/?id=03062011a",
    "43-gm-apple-developer.html",
  ],
  [
    "https://www.macrumors.com/2011/03/03/apple-seeds-ios-4-3-golden-master-to-developers/",
    "43-gm-macrumors.html",
  ],
  [
    "https://www.apple.com/newsroom/2011/03/02Apple-Introduces-iOS-4-3/",
    "43-public-apple.html",
  ],
]);
const ledgerOnlySources = [
  {
    url: "https://www.macworld.com/article/208988/ios42_waiting.html",
    publishedAt: "2010-11-12T06:39:00-08:00",
  },
  {
    url: "https://www.macrumors.com/2011/02/01/apple-seeds-ios-4-3-beta-3-to-developers/",
    publishedAt: "2011-02-01T10:58:23-08:00",
  },
  {
    url: "https://www.macworld.com/article/210444/ios_4_3-2.html",
    publishedAt: "2011-02-01T04:00:00-08:00",
  },
];
const ledgerOnlySourceUrls = new Set(
  ledgerOnlySources.map((source) => source.url),
);
assert.equal(bundle.formatVersion, 1, "batch format version");
assert.deepEqual(
  bundle.target,
  { projectId: "lh3yswzu", dataset: "production" },
  "production target identity",
);
assert.equal(bundle.accessedAt, "2026-07-30", "research access date");
assert.equal(bundle.sources.length, 28, "content source count");
assert.equal(
  new Set(bundle.sources.map((source) => source.url)).size,
  bundle.sources.length,
  "content source URLs are unique",
);
assert.equal(
  evidenceFileByUrl.size,
  bundle.sources.length + ledgerOnlySourceUrls.size,
  "content plus timeline-only source-file count",
);
assert.deepEqual(
  new Set(evidenceFileByUrl.keys()),
  new Set([
    ...bundle.sources.map((source) => source.url),
    ...ledgerOnlySourceUrls,
  ]),
  "content plus timeline-only source/evidence closure",
);
assert.deepEqual(
  new Set(evidenceFileByUrl.values()),
  new Set(Object.keys(expectedArtifacts)),
  "every audited raw artifact has one retained source",
);
assert(
  [...ledgerOnlySourceUrls].every(
    (url) => !bundle.sources.some((source) => source.url === url),
  ),
  "timeline-only sources remain outside the content bundle",
);

const probesByFile = {
  "41-beta1-cultofmac.html": ["4.1 beta", "July 14, 2010"],
  "41-beta1-iclarified.html": [
    "Signal Bars seem to be fixed",
    "New Baseband",
    "Game Center is back",
    "Camera Switch and Flash buttons reposition",
    "add Favorite as voice or FaceTime",
    "Spell Check can be turned off",
    "FaceTime and Game Center Parental Controls",
    "Full Bluetooth AVRCP Support",
  ],
  "41-beta1-signal-macrumors.html": [
    "signal bar changes",
    "02.07.01",
    "no change in the reception loss",
  ],
  "41-beta2-techcrunch.html": ["Beta 2 of iOS 4.1", "developer center"],
  "41-beta2-macrumors.html": [
    "second beta",
    "proximity sensor issue does not appear to be fixed",
  ],
  "41-beta3-macrumors.html": ["iOS 4.1 Beta 3", "August 3, 2010"],
  "41-beta3-iculture.html": [
    "versie 3",
    "iPhone 3G",
    "tweede generatie iPod touch",
    "niet langer ondersteund",
  ],
  "41-gm-apple-developer.html": ["iOS 4.1 GM seed", "iOS SDK 4.1 GM seed"],
  "41-gm-macrumors.html": [
    "proximity sensor",
    "Bluetooth",
    "iPhone 3G performance",
    "High Dynamic Range photos",
    "HD video upload over Wi-Fi",
    "TV show rentals",
    "Game Center",
  ],
  "42-beta1-apple-airprint.html": [
    "releasing a beta version",
    "AirPrint automatically finds printers",
    "without the need to install drivers",
    "shared through a Mac",
    "iOS 4.2",
  ],
  "42-beta1-macrumors.html": ["first beta version of iOS 4.2", "iPad, iPhone"],
  "42-beta1-macworld.html": [
    "Safari, Mail, and Photos",
    "AirPlay-compatible device",
    "Chalkboard",
    "default account for Notes",
    "repurposed as mute switch",
    "software screen orientation lock",
    "brightness slider",
    "search text on a page",
    "seven types of background tasks",
    "folders can hold 20 apps",
    "unified inbox",
    "Game Center app",
    "event invitations",
    "how many pages",
  ],
  "42-beta2-macrumors.html": [
    "second beta version of iOS 4.2",
    "updated multitasking animation",
  ],
  "42-beta2-macstories.html": [
    "C410",
    "C310",
    "B210",
    "Mac OS X 10.6.5 beta",
    "iTunes 10.1 beta",
    "Launching the PrinterSimulator directly",
    "restored Beta 1 folders and webclips",
    "new animation for multitasking",
    "Game Center indicator",
    "Youtube upload features",
  ],
  "42-beta3-macrumors.html": ["third beta version", "October 12"],
  "42-beta3-changes-macrumors.html": [
    "New tones for SMS",
    "Enable/Disable alert sounds",
    "Minor graphical changes",
    "removed the AirPlay feature",
  ],
  "42-gm-macrumors.html": [
    "Golden Master",
    "AirPlay has returned",
    "YouTube playback",
  ],
  "42-gm-transcript.html": [
    "Latest SDK",
    "sound/silent switch",
    "import .ics files",
    "GKFriendRequestComposeViewController",
    "presented modally",
    "conditionally display annotation views",
    "only to printers that support AirPrint",
  ],
  "42-gm2-macworld.html": [
    "second Golden Master",
    "specific to the iPad",
    "8C134b",
    "repeatedly drops network connections",
  ],
  "421-gm-macworld.html": [
    "Golden Master (GM) build of 4.2.1",
    "not to resubmit their apps",
    "ringer will continue to ring",
    "It is not known yet",
  ],
  "421-public-apple.html": ["November 22, 2010", "available today", "iOS 4.2"],
  "43-beta1-macrumors.html": [
    "first beta version of iOS 4.3",
    "iPhone 3G and second-generation iPod touch",
    "personal hotspot",
    "stream video",
    "multi-touch gestures",
    "full-screen banner format iAds",
    "FaceTime icon",
  ],
  "43-beta1-engadget.html": [
    "four or five fingers",
    "AirPlay Video support",
    "web authors",
  ],
  "43-beta1-side-switch.html": [
    "option in the device's Settings",
    "customize the behavior of the switch",
  ],
  "43-beta2-macrumors.html": [
    "second beta version of iOS 4.3",
    "will not be included in the public release",
    "new Apple TV",
  ],
  "43-beta2-macstories.html": [
    "won’t be enabled in the final release",
    "gestures can still be activated",
  ],
  "43-beta3-macrumors.html": [
    "third beta version of iOS 4.3",
    "cancel downloading apps",
    "present in earlier iOS 4.3 betas",
  ],
  "43-beta3-macworld.html": [
    "third beta for developers",
    "will disappear from iOS 4.3",
  ],
  "43-gm-apple-developer.html": [
    "iOS 4.3 GM seed",
    "Nitro JavaScript engine",
    "iTunes Home Sharing",
    "enhancements to AirPlay",
    "Personal Hotspot",
    "Apple A5 chip",
    "front and rear cameras",
    "gyroscope",
  ],
  "43-gm-macrumors.html": [
    "golden master version of iOS 4.3",
    "March 3, 2011",
    "8F190",
  ],
  "43-public-apple.html": [
    "Nitro JavaScript engine",
    "iTunes Home Sharing",
    "video from third party apps",
    "Personal Hotspot",
    "side switch",
    "iPhone 3GS",
    "third and fourth generation iPod touch",
  ],
};
assert.deepEqual(
  new Set(Object.keys(probesByFile)),
  new Set(Object.keys(expectedArtifacts)),
  "every artifact has bounded fact-family probes",
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
for (const source of [...bundle.sources, ...ledgerOnlySources]) {
  const name = evidenceFileByUrl.get(source.url);
  if (
    name === "41-gm-apple-developer.html" ||
    name === "43-gm-apple-developer.html"
  ) {
    continue;
  }
  const expectedDate = source.publishedAt.slice(0, 10);
  const record = jsonLdValues(documents.get(name)).find(
    (value) =>
      (value.headline || value.name) &&
      String(value.datePublished || "").startsWith(expectedDate),
  );
  assert(record, `${name} retains publication identity at ${expectedDate}`);
}

const expectedRoutes = [
  ["version-ios-4-1", "beta-1", "Beta 1", "developerBeta", "2010-07-14", 1, 8],
  ["version-ios-4-1", "beta-2", "Beta 2", "developerBeta", "2010-07-27", 2, 1],
  ["version-ios-4-1", "beta-3", "Beta 3", "developerBeta", "2010-08-03", 3, 1],
  ["version-ios-4-1", "gm", "GM", "goldenMaster", "2010-09-01", 4, 7],
  [
    "version-ios-4-2-1",
    "beta-1",
    "iOS 4.2 Beta 1",
    "developerBeta",
    "2010-09-15",
    1,
    17,
  ],
  [
    "version-ios-4-2-1",
    "beta-2",
    "iOS 4.2 Beta 2",
    "developerBeta",
    "2010-09-28",
    2,
    7,
  ],
  [
    "version-ios-4-2-1",
    "beta-3",
    "iOS 4.2 Beta 3",
    "developerBeta",
    "2010-10-12",
    3,
    3,
  ],
  [
    "version-ios-4-2-1",
    "4-2-gm",
    "iOS 4.2 GM",
    "goldenMaster",
    "2010-11-01",
    4,
    8,
  ],
  ["version-ios-4-2-1", "gm", "GM", "goldenMaster", "2010-11-18", 6, 2],
  ["version-ios-4-3", "beta-1", "Beta 1", "developerBeta", "2011-01-12", 1, 8],
  ["version-ios-4-3", "beta-2", "Beta 2", "developerBeta", "2011-01-19", 2, 1],
  ["version-ios-4-3", "gm", "GM", "goldenMaster", "2011-03-03", 4, 7],
];
assert.equal(bundle.events.length, expectedRoutes.length, "route count");
for (let index = 0; index < expectedRoutes.length; index += 1) {
  const [versionId, alias, label, channel, date, sequence, changeCount] =
    expectedRoutes[index];
  const event = bundle.events[index];
  assert.deepEqual(event.target, {
    releaseVersionId: versionId,
    routeAlias: alias,
  });
  assert.equal(event.identity.releaseVersionId, versionId);
  assert.equal(event.identity.platformId, "platform-ios");
  assert.equal(event.identity.routeAlias, alias);
  assert.equal(
    event.identity.stableEventId,
    `event:apple:ios:${versionId.replace("version-ios-", "").replaceAll("-", ".")}:${alias}`,
  );
  assert.equal(event.identity.label, label);
  assert.equal(event.identity.channel, channel);
  assert.equal(event.identity.appearanceDate, date);
  assert.equal(event.identity.sequence, sequence);
  assert.equal(event.identity.isRevision, false);
  assert.equal(event.identity.availabilityState, "available");
  assert.equal(event.identity.closesReleaseCycle, false);
  assert.equal(event.changes.length, changeCount);
  assert.equal(event.authorship, "originalSynthesis");
  assert.equal(event.article?.authorship, "originalSynthesis");
  assert.equal(event.provenanceStatus, "editoriallyVerified");
  assert.deepEqual(event.editorialReview, {
    status: "approved",
    reviewedAt: "2026-07-30T13:16:42Z",
  });
  assert.equal(event.isIndexable, true);
  assert(event.citations.length > 0, `${label} has event citations`);
}
assert.deepEqual(bundle.versions, [], "batch does not add versions");
assert.deepEqual(bundle.builds, [], "batch does not infer build documents");
assert(
  bundle.events.every((event) => event.target.routeAlias !== "public"),
  "approved Public routes stay excluded",
);
assert(
  bundle.events.every(
    (event) =>
      event.target.routeAlias !== "beta-4" &&
      !event.identity.label.toLowerCase().includes("beta 4"),
  ),
  "unsupported Beta 4 routes stay explicit gaps",
);
const timelineOnlyRoutes = new Set([
  "version-ios-4-2-1/4-2-gm-seed-2-ipad",
  "version-ios-4-3/beta-3",
]);
const contentRoutes = new Set(
  expectedRoutes.map(([versionId, alias]) => `${versionId}/${alias}`),
);
assert.equal(timelineOnlyRoutes.size, 2, "timeline-only identity count");
assert(
  [...timelineOnlyRoutes].every((route) => !contentRoutes.has(route)),
  "timeline-only identities are omitted from content",
);
assert.equal(
  new Set([...contentRoutes, ...timelineOnlyRoutes]).size,
  14,
  "all 14 named milestones close without placeholder records",
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
    assert(change.citations.length > 0, `${change.key} has claim citations`);
    for (const citation of change.citations) {
      citationReferences += 1;
      assert(declaredUrls.has(citation.url), `${change.key} source closure`);
      assert(citation.locator, `${change.key} citation locator`);
      assert(citation.note, `${change.key} citation evidence note`);
    }
    const definition = {
      title: change.title,
      canonicalSummary: change.canonicalSummary,
      category: change.category,
    };
    const previous = definitions.get(change.key);
    if (previous) assert.deepEqual(definition, previous, change.key);
    else definitions.set(change.key, definition);
    assert(
      !change.summary.includes(
        "The evidence selected for this milestone supports this bounded state",
      ),
      `${change.key} has a substantive occurrence summary`,
    );
    assert(
      !change.key.includes("apple-tv") &&
        !change.title.toLowerCase().includes("apple tv"),
      `${change.key} stays within the iOS product scope`,
    );
  }
}
assert.equal(occurrenceCount, 70, "selected occurrence count");
assert.equal(definitions.size, 62, "stable change-definition count");
assert.equal(citationReferences, 211, "citation-reference count");

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
  recurrence.get("ios-4-1-proximity-sensor-reliability"),
  [
    "version-ios-4-1/beta-2:knownIssue:delta",
    "version-ios-4-1/gm:fixed:cumulative",
  ],
  "proximity-sensor stable history",
);
assert.deepEqual(
  recurrence.get("ios-4-2-airprint-shared-printer-path"),
  [
    "version-ios-4-2-1/beta-1:introduced:delta",
    "version-ios-4-2-1/beta-2:changed:delta",
    "version-ios-4-2-1/4-2-gm:removed:delta",
  ],
  "shared-printer AirPrint stable history",
);
assert.deepEqual(
  recurrence.get("ios-4-3-ipad-multitouch-preview"),
  [
    "version-ios-4-3/beta-1:introduced:delta",
    "version-ios-4-3/beta-2:changed:delta",
  ],
  "iPad gesture-preview stable history",
);
for (const [key, firstAction, gmAction] of [
  ["ios-4-3-device-support-reduction", "removed", "removed"],
  ["ios-4-3-personal-hotspot", "introduced", "changed"],
  ["ios-4-3-third-party-airplay-video", "introduced", "changed"],
  ["ios-4-3-ipad-side-switch-choice", "introduced", "changed"],
]) {
  assert.deepEqual(
    recurrence.get(key),
    [
      `version-ios-4-3/beta-1:${firstAction}:delta`,
      `version-ios-4-3/gm:${gmAction}:cumulative`,
    ],
    `${key} stable Beta 1-to-GM history`,
  );
}
const getEvent = (versionId, alias) =>
  bundle.events.find(
    (event) =>
      event.target.releaseVersionId === versionId &&
      event.target.routeAlias === alias,
  );
assert(
  getEvent("version-ios-4-1", "gm").changes.every(
    (change) => change.inheritance === "cumulative",
  ),
  "iOS 4.1 GM presentation records are cumulative release state",
);
assert.deepEqual(
  getEvent("version-ios-4-2-1", "4-2-gm").changes.map((change) => [
    change.key,
    change.inheritance,
  ]),
  [
    ["ios-4-2-gm-latest-sdk-setting", "cumulative"],
    ["ios-4-2-gm-ipad-switch-audio-semantics", "cumulative"],
    ["ios-4-2-gm-calendar-ics-import", "cumulative"],
    ["ios-4-2-gm-gamekit-friend-composer", "cumulative"],
    ["ios-4-2-gm-gamekit-modal-presentation", "cumulative"],
    ["ios-4-2-gm-mapkit-annotation-views", "cumulative"],
    ["ios-4-2-airprint-shared-printer-path", "delta"],
    ["ios-4-2-gm-youtube-airplay-returned", "delta"],
  ],
  "iOS 4.2 GM cumulative-note and proven-transition boundary",
);
for (const absentKey of [
  "ios-4-1-beta2-proximity-sensor",
  "ios-4-1-gm-proximity-sensor-fix",
  "ios-4-2-beta2-shared-printer-hosts",
  "ios-4-2-gm-direct-airprint-only",
  "ios-4-2-beta3-visual-adjustments",
  "ios-4-2-gm-seed-2-ipad-wifi",
  "ios-4-3-beta2-apple-tv-airplay-test",
  "ios-4-3-beta2-multitouch-removal",
  "ios-4-3-beta3-download-cancel",
]) {
  assert.equal(
    recurrence.has(absentKey),
    false,
    `${absentKey} is excluded or merged into a stable definition`,
  );
}

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
const evidenceTokenSets = new Map(
  [...evidenceFileByUrl].map(([url, name]) => [
    url,
    locatorTokens(normalized.get(name)),
  ]),
);
let weakestLocatorOverlap = Number.POSITIVE_INFINITY;
let weakestClaimOverlap = Number.POSITIVE_INFINITY;
for (const event of bundle.events) {
  for (const change of event.changes) {
    for (const citation of change.citations) {
      const evidenceTokens = evidenceTokenSets.get(citation.url);
      const locatorSet = locatorTokens(citation.locator);
      const claimSet = locatorTokens(
        `${change.title} ${change.canonicalSummary}`,
      );
      const locatorOverlap = overlapCount(locatorSet, evidenceTokens);
      const claimOverlap = overlapCount(claimSet, evidenceTokens);
      assert(
        locatorOverlap >= 1,
        `${change.key} locator resolves in ${evidenceFileByUrl.get(citation.url)} (${citation.locator})`,
      );
      assert(
        claimOverlap >= 2,
        `${change.key} claim resolves in ${evidenceFileByUrl.get(citation.url)}`,
      );
      weakestLocatorOverlap = Math.min(weakestLocatorOverlap, locatorOverlap);
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
assert.equal(
  editorialStrings.length,
  364,
  "reader-facing copyright field count",
);

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
assert.equal(rawBytes, 4_603_107, "evidence corpus byte count");
console.log(
  [
    "iOS 4 point-release prerelease evidence audit passed",
    `raw artifacts: ${buffers.size}`,
    `raw bytes: ${rawBytes}`,
    `normalized artifacts: ${normalized.size}`,
    "content routes: 4.1 Beta 1–3/GM; 4.2 Beta 1–3/GM; 4.2.1 GM; 4.3 Beta 1–2/GM",
    "timeline-only identities: iOS 4.2 GM Seed 2 (iPad) and iOS 4.3 Beta 3",
    "selected records: 4.1 17; 4.2/4.2.1 37; 4.3 16",
    "unsupported identity gaps: no 4.1, 4.2, or 4.3 Beta 4 routes",
    "bounded recurrences: proximity issue/fix, shared-printer AirPrint transition, gesture-preview clarification, and four Beta 1-to-GM cumulative histories",
    "scope boundary: companion Apple TV seed and standalone host changes excluded",
    `selected occurrences/definitions: ${occurrenceCount}/${definitions.size}`,
    `citation references: ${citationReferences}`,
    `weakest locator/claim token overlap: ${weakestLocatorOverlap}/${weakestClaimOverlap}`,
    `copyright fields: ${editorialStrings.length}`,
    `maximum contiguous source overlap: ${maximumOverlapWords} words`,
    `longest overlap phrase: ${overlapPhrase}`,
  ].join("\n"),
);
