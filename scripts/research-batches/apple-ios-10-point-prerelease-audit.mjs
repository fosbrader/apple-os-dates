import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import { mkdirSync, readdirSync, readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import { JSDOM } from "jsdom";

const here = dirname(fileURLToPath(import.meta.url));
const evidenceDirectory = resolve(
  process.argv[2] || "tmp/apple-ios10-point-prerelease-evidence",
);
const bundlePath = resolve(here, "apple-ios-10-point-prerelease.json");
const bundleRaw = readFileSync(bundlePath);
const bundle = JSON.parse(bundleRaw);
const historicalPlanDigest =
  "f493f24a229b781a7369161f3e2746435cba381476ea4d7bd1982600cef1ece2";
const historicalPlanPath = resolve(
  here,
  "../..",
  `.migration-artifacts/launch-content-plan-${historicalPlanDigest}.json`,
);
const historicalRollbackPath = resolve(
  here,
  "../..",
  `.migration-artifacts/launch-content-rollback-${historicalPlanDigest}.json`,
);
const sha256 = (value) => createHash("sha256").update(value).digest("hex");
const collapse = (value) => value.replace(/\s+/g, " ").trim();
const normalizedText = (value) =>
  value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/[“”]/g, '"')
    .replace(/[‘’]/g, "'")
    .replace(/[‐‑‒–—―]/g, "-")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();

const historicalPlanRaw = readFileSync(historicalPlanPath);
const historicalRollbackRaw = readFileSync(historicalRollbackPath);
assert.equal(historicalPlanRaw.byteLength, 368_693, "historical plan bytes");
assert.equal(
  sha256(historicalPlanRaw),
  "d0f8e3fc18d8399487b6956d009fefdfd23322182219abd828a8db375dfa3bda",
  "historical plan SHA-256",
);
assert.equal(
  historicalRollbackRaw.byteLength,
  18_554,
  "historical rollback bytes",
);
assert.equal(
  sha256(historicalRollbackRaw),
  "34c7a3adc849c879ae1ae4af80bde538accd6c2ce32d5bb5f342f1ac70f319ea",
  "historical rollback SHA-256",
);
const historicalPlan = JSON.parse(historicalPlanRaw);
const historicalRollback = JSON.parse(historicalRollbackRaw);
assert.equal(
  historicalPlan.artifactType,
  "sanity-launch-content-plan",
  "historical plan artifact type",
);
assert.equal(
  historicalPlan.manifest,
  "scripts/research-batches/apple-ios-10-point-prerelease.json",
  "historical plan manifest",
);
assert.equal(
  historicalPlan.plan.planDigest,
  historicalPlanDigest,
  "historical plan digest",
);
assert.equal(
  historicalPlan.plan.sourceSnapshotDigest,
  "caf57fbf8ddbf199f9487ca4278d61303b6f1bb6ddc2df8642a144869575b382",
  "historical source snapshot digest",
);
assert.deepEqual(
  historicalPlan.plan.summary,
  {
    buildCreates: 0,
    changeCreates: 49,
    creates: 76,
    eventCreates: 0,
    patches: 14,
    sourceCreates: 27,
    unchanged: 2089,
    versionCreates: 0,
    versionPatches: 0,
  },
  "historical plan summary",
);
assert.deepEqual(
  historicalPlan.plan.creates.reduce(
    (counts, create) => ({
      ...counts,
      [create.document._type]: (counts[create.document._type] || 0) + 1,
    }),
    {},
  ),
  { releaseChange: 49, source: 27 },
  "historical create-type closure",
);
assert.equal(
  historicalPlan.plan.unchangedDocumentIds.length,
  2_089,
  "historical unchanged-document closure",
);
const historicalChangePatchFields = ["citations"];
const historicalEventPatchFields = [
  "articleBody",
  "changes",
  "citations",
  "editorialReview",
  "provenanceStatus",
  "summary",
];
assert.equal(
  historicalPlan.plan.patches.filter((patch) =>
    patch.id.startsWith("release-change-"),
  ).length,
  4,
  "historical shared-change patch count",
);
assert.equal(
  historicalPlan.plan.patches.filter((patch) =>
    patch.id.startsWith("release-event-"),
  ).length,
  10,
  "historical event patch count",
);
for (const patch of historicalPlan.plan.patches) {
  assert(
    typeof patch.ifRevisionId === "string" && patch.ifRevisionId,
    `${patch.id} historical revision guard`,
  );
  assert.deepEqual(
    Object.keys(patch.set).sort(),
    (patch.id.startsWith("release-change-")
      ? historicalChangePatchFields
      : historicalEventPatchFields
    ).sort(),
    `${patch.id} historical patch-field allowlist`,
  );
}
assert.equal(
  historicalRollback.artifactType,
  "sanity-launch-content-rollback",
  "historical rollback artifact type",
);
assert.equal(
  historicalRollback.planDigest,
  historicalPlanDigest,
  "historical rollback plan digest",
);
assert.equal(
  historicalRollback.sourceSnapshotDigest,
  historicalPlan.plan.sourceSnapshotDigest,
  "historical rollback source snapshot",
);
assert.equal(
  historicalRollback.rollbackDigest,
  "b6c620bab92200da7caf6b9ba65f7efa28b558c8fd39cfb05e41321d6091fec3",
  "historical rollback digest",
);
assert.deepEqual(
  [...historicalRollback.createdDocumentIds].sort(),
  historicalPlan.plan.creates.map((create) => create.document._id).sort(),
  "historical create rollback coverage",
);
assert.deepEqual(
  historicalRollback.restoreDocuments.map((document) => document._id).sort(),
  historicalPlan.plan.patches.map((patch) => patch.id).sort(),
  "historical patch rollback coverage",
);
assert.notEqual(
  sha256(bundleRaw),
  "fab4ce93281e025b3249c52eef2894ed9f741c93dea9c8186a1eec2bcd565c7c",
  "historical plan is stale after candidate corrections",
);

const expectedHtml = {
  "apple-ios101-final.html": [
    41_248,
    "d3998e87e13bffe40edb1e87565ec44bd847af4c4de798c75440c3be8e6dd9ac",
    "article",
    13_787,
    "e27bcf5ee080555f5f80543dc32b65fb60b4fa0d8404d5e4aa5943eccb0c13ed",
  ],
  "apple-ios102-final.html": [
    13_967,
    "e626eca5eb4f9f418ea47cf9f209a44329f65e5883d2f0cee2a2604a7a51c131",
    "article",
    2_334,
    "6022dfd6ca46c00c30724fa0dfdcebed53308b6214ee71e893e479b017523272",
  ],
  "apple-ios103-final.html": [
    15_150,
    "78ff2159b4856059aa17dc6187cd36f98df1b9232ed9249f85bb8b32c9f98797",
    "article",
    3_254,
    "9325f08ca1fbaf433919ee0e0c816ae05f493bb4ef2667d5b1ddf0a6798ea30f",
  ],
  "iclarified-101-b1.html": [
    178_895,
    "5ffaa42306a0ff28495bcd8995a915ce3f9ebc8234db51ce268a7ded393890d8",
    "article",
    728,
    "6eb3f0079248353e8740bcb7718ccd187c68666c78b13b2d87d9a2133e23486a",
  ],
  "idb-101-b2.html": [
    210_019,
    "af5761a9742d2cba0e86c1d72aa04c24a663bae9443f44ca4837d60c818b90b5",
    ".entry-content",
    1_185,
    "6dc1a0f0c2fa77110f1be8867e74a4fcb9c8e7e08da97a68c96318077606ccdf",
  ],
  "idb-101-b4.html": [
    214_975,
    "cfaa52fe7d4ffee972f0b17ff6d3ce1a5eb69a52a9c71265f581c771ea49db86",
    ".entry-content",
    1_218,
    "8b7c779fc4ac13b152d586268f6b1d2cb01c39736231213556c127dbc3593a97",
  ],
  "idb-102-b3.html": [
    211_670,
    "9636f90e6fa7d516ea044b34239ebf4a79083228300417610f8ae21509ba2d78",
    ".entry-content",
    1_372,
    "dee507cbb951ce230aae2268f8919b2309f795828f38d84c8372487437de8b1c",
  ],
  "idb-102-b4.html": [
    216_063,
    "991f0b99d8d003ecd1d6d63b1fd8b821f14cbbd9094c183eadf8740a52380383",
    ".entry-content",
    2_580,
    "cd8f6cdd1815b66b79d3a85b60d4c42170f36202a990c4b7bf00b1aefb2aa9fa",
  ],
  "idb-103-b1.html": [
    224_466,
    "12d5c89a81a2d62eaf55b9b7e665cb9a7ef1c30cb0172dfcf0e14ad8a3040282",
    ".entry-content",
    6_132,
    "7fb697130d0d150cbd9ea7ea966287fed7b9fde53a100d4a356e22cd2eea33be",
  ],
  "mr-101-b1.html": [
    128_936,
    "4127234a87ec2ff3686e6c4aaa5d12c8eb48474eaedbc47fae04f54558105553",
    "article",
    2_144,
    "1bb5e0f99faf9bb380eee9eb78771faba9374bab6aa7714f8df2258649193f62",
  ],
  "mr-102-b1.html": [
    136_266,
    "69528bc41d6c2c1e0d08d12722051660210d4e7c03f5258ff1e86c0a38188633",
    "article",
    2_399,
    "cea74a8b13efe1252b31bbc7fda1bb66fd32d49c3ec14d7d4fa0c5921110327d",
  ],
  "mr-102-b2.html": [
    125_114,
    "b7b9019b7b78249184d6348284c2abc50a12fe1d6c79a60cc6ba61f424786b33",
    "article",
    2_325,
    "e06653cfc0a3f82dcd2fcec05d9ab20a7ccce6ff50436f85b00d2c01653659b5",
  ],
  "mr-102-b3.html": [
    127_987,
    "6ef98a33e58f0480b82543be50fdf6da380fef7735230064ebb8084737602d09",
    "article",
    2_329,
    "a8ecffb704e3920610e95ae4609a1aecbd28b541c9026f2ab08b1ab0afa5ddd6",
  ],
  "mr-103-b1-details.html": [
    137_603,
    "a31e8ecdadcc25d7f40b4adb05e77e48d536c3393fe2dac477b21ffd1739d363",
    "article",
    4_503,
    "a3b9372d1bf8441107f5f8acc2d65d623b90654571f01a517ad9b0793b34c9b5",
  ],
  "nine-101-b2.html": [
    153_162,
    "4a72ecd4a280ecdd79364a8d679932f1ac22cb26c92572a4ca8ea8d267c3c585",
    ".post-content",
    2_131,
    "438e4438520b1aceca58b637a14d3be4f84f4a6919d2233d380dbecad2ec5346",
  ],
  "nine-101-b5.html": [
    150_164,
    "5b84bda69609b527dd2d43cd29d8b5a5af4c5e22fff6272fa3f99a7b1790e9f8",
    ".post-content",
    3_401,
    "936ae976d5c950cf66bf85433ac4b528fe1c19eab60ecfc2cbdb38691ff97ced",
  ],
  "nine-102-b1.html": [
    157_664,
    "a0f7ad5618b3f650017a8ba111b2bf6041ddfab4f616624a744ab89670a8585e",
    ".post-content",
    4_913,
    "40967237b46d37da4390f3e1235b7739f28eb22753abae18e694c5c1c3728adb",
  ],
  "nine-102-b3-videos.html": [
    145_849,
    "20bb1c42ae1e6e5eafa852d4b17bbef5ddd646625f409f9390ba7ae9074a4230",
    ".post-content",
    2_449,
    "2c207236560f707c439fd3790e5424568854878b31799b4bf06b204d795f467b",
  ],
};

const expectedPdf = {
  "ios102-beta5-notes.pdf": [
    63_079,
    "6f4837eecc1391d8b381f391f10fd070223300e753c4eb5933af8c131aa0d16f",
  ],
  "ios102-beta6-notes.pdf": [
    63_118,
    "31f578aad187952c93acd2f3bd5891b3a51066999f2547a3d48e55fcd6f3e426",
  ],
  "ios102-beta7-notes.pdf": [
    70_820,
    "6d4e284e3e7c2dbcda863345ae71c80b6a315fa6b176b3e78e53d0165bb106aa",
  ],
  "ios103-beta2-notes.pdf": [
    74_793,
    "7f37a2015af507d05d9f172bf4ecf63eb222a472fb7be8209b7b5cccc9cc6424",
  ],
  "ios103-beta3-notes.pdf": [
    117_892,
    "e035c9d4a40291266d80c29fb5c29c4711b59b9b7bbe213d3c61a11b216fda54",
  ],
  "ios103-beta4-notes.pdf": [
    117_864,
    "5d321c01c0f779c414d8dfe77a009c78b983f859eff67806720bd678905f911e",
  ],
  "ios103-beta5-notes.pdf": [
    114_955,
    "99c1aca494c122fc278fb8576bb409da961d0a385946e388c73f9feb109466e9",
  ],
  "ios103-beta6-notes.pdf": [
    117_931,
    "01758995aa39267d367011ffd9259c58f4da16325b6298202d4c0b7621c49006",
  ],
  "ios103-beta7-notes.pdf": [
    117_871,
    "2c3428ea8d7979c1313d7a69f94060a339b019f49e6c6f9327d52fc6481d4442",
  ],
};

const expectedArchiveForums = {
  "mrforum-102-b5.html": [
    294_697,
    "db5390cdda29e1edee60b3af05852d8aadce5b88b4b4a7d30c7b705ec0c674fd",
    "https://forums.macrumors.com/threads/ios-10-2-beta-5-changes-bugs-and-fixes.2019207/",
    "/attachments/ios_10-2_beta_5_release_notes-pdf.675821/",
  ],
  "mrforum-102-b6.html": [
    286_987,
    "bec429866e4d72f0fef459644c82cc017e2aa89bfaa98398258018f864697d55",
    "https://forums.macrumors.com/threads/ios-10-2-beta-6-changes-bugs-and-fixes.2019785/",
    "/attachments/ios_10-2_beta_6_release_notes-pdf.676343/",
  ],
  "mrforum-102-b7.html": [
    301_727,
    "e3a76a3522788758b42015663a0700e3666691e872b385557045e292b5085b04",
    "https://forums.macrumors.com/threads/ios-10-2-beta-7-changes-bugs-and-fixes.2020220/",
    "/attachments/ios_10-2_beta_7_release_notes-pdf.676779/",
  ],
  "mrforum-103-beta2.html": [
    301_655,
    "05275691cef48465d952b98c2d2ae9b68c7f0377f8707c354ca99c75c664242b",
    "https://forums.macrumors.com/threads/ios-10-3-developer-beta-2-changes-bug-fixes-enhacements-etc.2031354/",
    "/attachments/ios_10-3_beta_2_release_notes-pdf.687234/",
  ],
  "mrforum-103-beta3.html": [
    294_966,
    "816b416091e117064f96e5add12fd3329739cf4c1b798763855136951083fc48",
    "https://forums.macrumors.com/threads/ios-10-3-beta-3-bug-fixes-changes-etc.2033588/",
    "/attachments/ios_10-3_beta_3_release_notes-pdf.689410/",
  ],
  "mrforum-103-beta4.html": [
    303_516,
    "9493f4bb06f09947c2f8b337d4aac6d9f641f56291132ae218ac912bca5d3e31",
    "https://forums.macrumors.com/threads/ios-10-3-developer-beta-4-changes-bug-fixes-enhacements-etc.2034640/",
    "/attachments/ios_10-3_beta_4_release_notes-pdf.690300/",
  ],
  "mrforum-103-beta5.html": [
    298_378,
    "a03a757534ac254ded1fa079b4173494ef23d13b57d107396010f8c033c39ebe",
    "https://forums.macrumors.com/threads/ios-10-3-developer-beta-5-changes-bug-fixes-enhancements-etc.2036136/",
    "/attachments/ios_10-3_beta_5_release_notes-pdf.691502/",
  ],
  "mrforum-103-beta6.html": [
    297_642,
    "70aca21ac1ba3182d585d2ba319d8bd50346811d44b241b6138022ef5aa87a1e",
    "https://forums.macrumors.com/threads/ios-10-3-beta-public-beta-6-bug-fixes-enhancements-etc.2036798/",
    "/attachments/ios_10-3_beta_6_release_notes-pdf.692121/",
  ],
  "mrforum-103-beta7.html": [
    297_597,
    "6041c23d889a6a7dc2b5662c5359cdea4af6bb51ba7a37da85e20e3814afc8e0",
    "https://forums.macrumors.com/threads/ios-10-3-beta-7-changes-bug-fixes-and-enhancements.2037301/",
    "/attachments/ios_10-3_beta_7_release_notes-pdf.692489/",
  ],
};

const expectedNegativeArtifacts = {
  "mrforum-101-b1.html": [
    304_087,
    "799b2fb2e43bf86eefe232ca1d894ae74a0d4a14b567c7fb9745bdd57170c7dd",
  ],
  "apple-ios101-beta1.pdf": [
    84_095,
    "b555363881a59b722dfe30d81d6342f5cc853fd62c90d69627ae12fc124c9728",
  ],
  "applebetas-101-beta1.pdf": [
    1_000,
    "e2bb33ce9a767f984f08fc8fd69fcdd1b4668782cafcb88bc963619e8c5be5b5",
  ],
  "cdx-ios101-exact.json": [
    3,
    "37517e5f3dc66819f61f5a7bb8ace1921282415f10551d2defa5c3eb0985b570",
  ],
  "cdx-ios101.json": [
    3,
    "37517e5f3dc66819f61f5a7bb8ace1921282415f10551d2defa5c3eb0985b570",
  ],
  "cdx-ios102.json": [
    3,
    "37517e5f3dc66819f61f5a7bb8ace1921282415f10551d2defa5c3eb0985b570",
  ],
  "cdx-ios103.json": [
    3,
    "37517e5f3dc66819f61f5a7bb8ace1921282415f10551d2defa5c3eb0985b570",
  ],
  "cdx-applebetas-101.json": [
    3,
    "37517e5f3dc66819f61f5a7bb8ace1921282415f10551d2defa5c3eb0985b570",
  ],
  "cdx-applebetas-102.json": [
    3,
    "37517e5f3dc66819f61f5a7bb8ace1921282415f10551d2defa5c3eb0985b570",
  ],
  "cdx-applebetas-103.json": [
    3,
    "37517e5f3dc66819f61f5a7bb8ace1921282415f10551d2defa5c3eb0985b570",
  ],
};

const expectedExcludedArtifacts = {
  "ai-101-b1.html": [
    5_735,
    "194c11d83a41fceb4d993721f79e2570e95e1cccfcda760cf053907469290663",
    "Cloudflare challenge page; no article body",
  ],
  "ios103-beta2-notes-retry.pdf": [
    5_980,
    "766059fdfec65b6a5e5ee3a1c9b8919a0a7e4bc0deffc8ad7f23ee82bc025923",
    "failed duplicate retry containing HTML rather than a PDF",
  ],
  "mrforum-103-beta1.html": [
    287_975,
    "e352d6235f6c87dd9f8a5fd58560f6d42990ffb2b48d375da81b9690623a1ba0",
    "exploratory discussion without an attached release-note artifact",
  ],
  "swift-audit.json": [
    58_565,
    "2a30c85876ca38769320c159fc84a0b15a3eb1baa6a2c33185ad06b43334ff47",
    "derived exploratory extraction output; not source evidence",
  ],
};

const sourceTextByFile = new Map();
const htmlTitleByFile = new Map();
const htmlDocumentByFile = new Map();
let citedHtmlBytes = 0;
for (const [
  name,
  [rawBytes, rawSha, selector, textBytes, textSha],
] of Object.entries(expectedHtml)) {
  const raw = readFileSync(resolve(evidenceDirectory, name));
  assert.equal(raw.byteLength, rawBytes, `${name} raw byte count`);
  assert.equal(sha256(raw), rawSha, `${name} raw SHA-256`);
  const document = new JSDOM(raw).window.document;
  htmlDocumentByFile.set(name, document);
  const node = document.querySelector(selector);
  assert(node, `${name} contains ${selector}`);
  const heading = document.querySelector("h1");
  assert(heading, `${name} contains its source heading`);
  htmlTitleByFile.set(name, collapse(heading.textContent));
  const text = collapse(node.textContent);
  assert.equal(Buffer.byteLength(text), textBytes, `${name} text byte count`);
  assert.equal(sha256(text), textSha, `${name} selected-text SHA-256`);
  sourceTextByFile.set(name, text);
  citedHtmlBytes += raw.byteLength;
}

const archiveForumDocumentByFile = new Map();
let archiveForumBytes = 0;
for (const [
  name,
  [rawBytes, rawSha, archiveUrl, attachmentPath],
] of Object.entries(expectedArchiveForums)) {
  const raw = readFileSync(resolve(evidenceDirectory, name));
  assert.equal(raw.byteLength, rawBytes, `${name} raw byte count`);
  assert.equal(sha256(raw), rawSha, `${name} raw SHA-256`);
  const markup = raw.toString("utf8");
  assert(markup.includes(attachmentPath), `${name} preserves attachment link`);
  const document = new JSDOM(raw).window.document;
  archiveForumDocumentByFile.set(name, document);
  const canonical = document.querySelector('link[rel="canonical"]')?.href;
  if (canonical) assert.equal(canonical, archiveUrl, `${name} canonical URL`);
  archiveForumBytes += raw.byteLength;
}

let pdfBytes = 0;
for (const [name, [rawBytes, rawSha]] of Object.entries(expectedPdf)) {
  const raw = readFileSync(resolve(evidenceDirectory, name));
  assert.equal(raw.byteLength, rawBytes, `${name} raw byte count`);
  assert.equal(sha256(raw), rawSha, `${name} raw SHA-256`);
  assert.equal(raw.subarray(0, 4).toString("ascii"), "%PDF", `${name} is PDF`);
  pdfBytes += raw.byteLength;
}

let negativeArtifactBytes = 0;
for (const [name, [rawBytes, rawSha]] of Object.entries(
  expectedNegativeArtifacts,
)) {
  const raw = readFileSync(resolve(evidenceDirectory, name));
  assert.equal(raw.byteLength, rawBytes, `${name} raw byte count`);
  assert.equal(sha256(raw), rawSha, `${name} raw SHA-256`);
  negativeArtifactBytes += raw.byteLength;
}

let excludedArtifactBytes = 0;
for (const [name, [rawBytes, rawSha, reason]] of Object.entries(
  expectedExcludedArtifacts,
)) {
  const raw = readFileSync(resolve(evidenceDirectory, name));
  assert.equal(raw.byteLength, rawBytes, `${name} excluded raw byte count`);
  assert.equal(sha256(raw), rawSha, `${name} excluded raw SHA-256`);
  assert(reason, `${name} has an explicit exclusion reason`);
  excludedArtifactBytes += raw.byteLength;
}
const accountedEvidenceFiles = new Set([
  ...Object.keys(expectedHtml),
  ...Object.keys(expectedPdf),
  ...Object.keys(expectedArchiveForums),
  ...Object.keys(expectedNegativeArtifacts),
  ...Object.keys(expectedExcludedArtifacts),
]);
const evidenceDirectoryEntries = readdirSync(evidenceDirectory, {
  withFileTypes: true,
});
const actualEvidenceFiles = evidenceDirectoryEntries
  .filter((entry) => entry.isFile() && !entry.name.startsWith("."))
  .map((entry) => entry.name)
  .sort();
assert.deepEqual(
  actualEvidenceFiles,
  [...accountedEvidenceFiles].sort(),
  "raw evidence directory closure",
);
assert.deepEqual(
  evidenceDirectoryEntries
    .filter((entry) => entry.isDirectory() && !entry.name.startsWith("."))
    .map((entry) => entry.name)
    .sort(),
  ["rendered"],
  "derived-render directory closure",
);
const derivedRenderFiles = readdirSync(resolve(evidenceDirectory, "rendered"), {
  withFileTypes: true,
});
assert.deepEqual(
  derivedRenderFiles.map((entry) => entry.name).sort(),
  ["ios103-beta3-page1.png"],
  "derived-render file closure",
);
assert(
  derivedRenderFiles.every((entry) => entry.isFile()),
  "derived-render directory contains only files",
);
const derivedRender = readFileSync(
  resolve(evidenceDirectory, "rendered/ios103-beta3-page1.png"),
);
assert.equal(derivedRender.byteLength, 26_540, "derived-render bytes");
assert.equal(
  sha256(derivedRender),
  "dca3b82c8e82b5ad9f693fd0ad7a42e5bae70202fc45c9660f90a1c37ae6241d",
  "derived-render SHA-256",
);
assert.equal(
  derivedRender.subarray(1, 4).toString("ascii"),
  "PNG",
  "derived render is a PNG",
);
assert.equal(derivedRender.readUInt32BE(16), 612, "derived-render width");
assert.equal(derivedRender.readUInt32BE(20), 792, "derived-render height");
for (const name of ["ai-101-b1.html", "ios103-beta2-notes-retry.pdf"]) {
  const challenge = new JSDOM(readFileSync(resolve(evidenceDirectory, name)))
    .window.document;
  assert.equal(challenge.title, "Just a moment...", `${name} is a challenge`);
  assert.equal(
    challenge.querySelector('meta[name="robots"]')?.content,
    "noindex,nofollow",
    `${name} exposes no retained publisher article`,
  );
}
assert.notEqual(
  readFileSync(resolve(evidenceDirectory, "ios103-beta2-notes-retry.pdf"))
    .subarray(0, 4)
    .toString("ascii"),
  "%PDF",
  "failed Beta 2 retry is not a PDF",
);
assert(
  !readFileSync(
    resolve(evidenceDirectory, "mrforum-103-beta1.html"),
    "utf8",
  ).includes("/attachments/ios_10-3_beta_1"),
  "exploratory Beta 1 forum state has no matching note attachment",
);
assert.equal(
  JSON.parse(
    readFileSync(resolve(evidenceDirectory, "swift-audit.json"), "utf8"),
  ).pdfFiles,
  9,
  "excluded Swift output is identified as derived audit data",
);

const unavailableForum = readFileSync(
  resolve(evidenceDirectory, "mrforum-101-b1.html"),
  "utf8",
);
const unavailableAppleUrl =
  "http://adcdownload.apple.com/Documentation/Xcode_8.1_beta_SDK_Release_Notes/iOS_10.1_beta_Release_Notes.pdf";
const unavailableMirrorUrl =
  "https://beta.applebetas.tk/notes/ios/10.1/beta1.pdf";
assert(
  unavailableForum.includes(unavailableAppleUrl),
  "iOS 10.1 forum state preserves the gated Apple URL",
);
assert(
  unavailableForum.includes(unavailableMirrorUrl),
  "iOS 10.1 forum state preserves the former mirror URL",
);
const unavailableApple = new JSDOM(
  readFileSync(resolve(evidenceDirectory, "apple-ios101-beta1.pdf")),
).window.document;
assert.equal(
  unavailableApple.title,
  "Unauthorized - Apple Developer",
  "Apple iOS 10.1 URL remains gated",
);
const unavailableMirror = new JSDOM(
  readFileSync(resolve(evidenceDirectory, "applebetas-101-beta1.pdf")),
).window.document;
assert.equal(
  unavailableMirror.title,
  "applebetas.tk",
  "former mirror now resolves to parked-domain state",
);
assert(
  collapse(unavailableMirror.body.textContent).includes(
    "This domain may be for sale.",
  ),
  "former mirror exposes no release-note body",
);
for (const name of Object.keys(expectedNegativeArtifacts).filter((item) =>
  item.startsWith("cdx-"),
)) {
  assert.equal(
    readFileSync(resolve(evidenceDirectory, name), "utf8").trim(),
    "[]",
    `${name} has no captured result`,
  );
}

const moduleCache = "/private/tmp/swift-module-cache-ios10";
mkdirSync(moduleCache, { recursive: true });
const swiftResult = spawnSync(
  "swift",
  [
    "-target",
    "arm64-apple-macosx26.0",
    resolve(here, "apple-ios-10-point-prerelease-audit.swift"),
    evidenceDirectory,
  ],
  {
    encoding: "utf8",
    env: {
      ...process.env,
      SWIFT_MODULECACHE_PATH: moduleCache,
      CLANG_MODULE_CACHE_PATH: moduleCache,
    },
    maxBuffer: 2 * 1024 * 1024,
  },
);
assert.equal(
  swiftResult.status,
  0,
  `PDFKit audit failed:\n${swiftResult.stderr}`,
);
const pdfAudit = JSON.parse(swiftResult.stdout);
assert.equal(pdfAudit.pdfFiles, 9, "PDF audit file count");
assert.equal(pdfAudit.physicalPages, 45, "PDF physical-page count");
assert.equal(pdfAudit.locatorAssertions, 33, "PDF locator assertions");
assert.equal(
  pdfAudit.ios102EquivalentDocuments,
  3,
  "iOS 10.2 equivalent late-cycle PDFs",
);
assert.equal(
  pdfAudit.ios103EquivalentDocuments,
  4,
  "iOS 10.3 equivalent late-cycle PDFs",
);
assert.deepEqual(
  new Set(Object.keys(pdfAudit.pdfTextByFile)),
  new Set(Object.keys(expectedPdf)),
  "PDF text/file closure",
);
for (const [name, text] of Object.entries(pdfAudit.pdfTextByFile)) {
  assert(text, `${name} has extracted text`);
  sourceTextByFile.set(name, text);
}

const sourceFilesInOrder = [
  "mr-101-b1.html",
  "iclarified-101-b1.html",
  "nine-101-b2.html",
  "idb-101-b2.html",
  "idb-101-b4.html",
  "nine-101-b5.html",
  "apple-ios101-final.html",
  "mr-102-b1.html",
  "nine-102-b1.html",
  "mr-102-b2.html",
  "mr-102-b3.html",
  "idb-102-b3.html",
  "nine-102-b3-videos.html",
  "idb-102-b4.html",
  "ios102-beta5-notes.pdf",
  "ios102-beta6-notes.pdf",
  "ios102-beta7-notes.pdf",
  "apple-ios102-final.html",
  "idb-103-b1.html",
  "mr-103-b1-details.html",
  "ios103-beta2-notes.pdf",
  "ios103-beta3-notes.pdf",
  "ios103-beta4-notes.pdf",
  "ios103-beta5-notes.pdf",
  "ios103-beta6-notes.pdf",
  "ios103-beta7-notes.pdf",
  "apple-ios103-final.html",
];
assert.equal(bundle.sources.length, 27, "declared source count");
assert.equal(sourceFilesInOrder.length, bundle.sources.length);
assert.deepEqual(
  new Set(sourceFilesInOrder),
  new Set([...Object.keys(expectedHtml), ...Object.keys(expectedPdf)]),
  "cited source/evidence closure",
);
const sourceFileByUrl = new Map(
  bundle.sources.map((source, index) => [
    source.url,
    sourceFilesInOrder[index],
  ]),
);
assert.equal(sourceFileByUrl.size, bundle.sources.length, "unique source URLs");
const sourceTextByUrl = new Map(
  [...sourceFileByUrl].map(([url, name]) => [url, sourceTextByFile.get(name)]),
);
assert(
  [...sourceTextByUrl.values()].every(Boolean),
  "every source resolves to an audited text state",
);
for (const source of bundle.sources) {
  const name = sourceFileByUrl.get(source.url);
  if (name.endsWith(".html")) {
    assert.equal(
      source.title,
      htmlTitleByFile.get(name),
      `${name} exact source title`,
    );
  }
}

const exactArticleMetadata = {
  "mr-101-b1.html": ["Juli Clover", "2016-09-21T10:33:15-07:00"],
  "iclarified-101-b1.html": ["Shalom Levytam", "2016-09-21T17:04:43+00:00"],
  "nine-101-b2.html": ["Jeff Benjamin", "2016-10-04T19:40:11+00:00"],
  "idb-101-b2.html": ["Cody Lee", "2016-10-04T17:51:46+00:00"],
  "idb-101-b4.html": ["Sébastien Page", "2016-10-17T20:13:19+00:00"],
  "nine-101-b5.html": ["Greg Barbosa", "2016-10-19T16:51:16+00:00"],
  "mr-102-b1.html": ["Juli Clover", "2016-10-31T12:56:12-07:00"],
  "nine-102-b1.html": ["Jeff Benjamin", "2016-11-01T21:53:05+00:00"],
  "mr-102-b2.html": ["Juli Clover", "2016-11-07T09:50:10-08:00"],
  "mr-102-b3.html": ["Juli Clover", "2016-11-14T09:52:08-08:00"],
  "idb-102-b3.html": ["Cody Lee", "2016-11-14T17:55:11+00:00"],
  "nine-102-b3-videos.html": ["Zac Hall", "2016-11-14T18:21:35+00:00"],
  "idb-102-b4.html": ["Christian Zibreg", "2016-11-28T18:57:40+00:00"],
  "idb-103-b1.html": ["Christian Zibreg", "2017-01-24T21:06:45+00:00"],
  "mr-103-b1-details.html": ["Juli Clover", "2017-01-24T14:57:09-08:00"],
};
let articleMetadataAssertions = 0;
for (const [name, [author, publishedAt]] of Object.entries(
  exactArticleMetadata,
)) {
  const document = htmlDocumentByFile.get(name);
  const source = bundle.sources.find(
    (candidate) => sourceFileByUrl.get(candidate.url) === name,
  );
  assert(source, `${name} has a declared source`);
  assert.equal(source.author, author, `${name} exact declared author`);
  assert.equal(
    source.publishedAt,
    publishedAt,
    `${name} exact declared publication timestamp`,
  );
  const observedPublishedAt =
    document.querySelector('meta[property="article:published_time"]')
      ?.content || document.querySelector("time[datetime]")?.dateTime;
  assert(observedPublishedAt, `${name} retains publication metadata`);
  assert.equal(
    new Date(observedPublishedAt).getTime(),
    new Date(publishedAt).getTime(),
    `${name} publication timestamp custody`,
  );
  const authorCandidates = [
    ...document.querySelectorAll(
      '[rel="author"], [itemprop="author"], meta[name="author"], meta[name="AUTHOR"]',
    ),
  ]
    .flatMap((node) => [
      collapse(node.textContent || ""),
      collapse(node.getAttribute("content") || ""),
    ])
    .filter(Boolean);
  assert(
    authorCandidates.some((candidate) => candidate.includes(author)),
    `${name} author custody`,
  );
  articleMetadataAssertions += 1;
}
const exactFinalArchiveDates = {
  "apple-ios101-final.html": "2016-10-27",
  "apple-ios102-final.html": "2016-12-12",
  "apple-ios103-final.html": "2017-03-27",
};
let undatedSourceTimestamps = 0;
for (const [name, date] of Object.entries(exactFinalArchiveDates)) {
  const source = bundle.sources.find(
    (candidate) => sourceFileByUrl.get(candidate.url) === name,
  );
  assert(source, `${name} has a declared source`);
  assert.equal(source.author, "Apple", `${name} exact author`);
  assert.equal(source.sourceClass, "developerDocs", `${name} source class`);
  assert.equal(
    htmlDocumentByFile.get(name).querySelector('meta[name="date"]')?.content,
    date,
    `${name} retained archive date`,
  );
  assert(
    !Object.hasOwn(source, "publishedAt"),
    `${name} does not convert a date-only field into an exact timestamp`,
  );
  undatedSourceTimestamps += 1;
}

const archiveSources = bundle.sources.filter(
  (source) => source.publisher === "MacRumors Forums attachment archive",
);
const expectedPdfSourceTitles = {
  "ios102-beta5-notes.pdf":
    "iOS SDK Release Notes for iOS 10.2 Beta 5 (Apple-authored PDF mirror)",
  "ios102-beta6-notes.pdf":
    "iOS SDK Release Notes for iOS 10.2 Beta 6 (Apple-authored PDF mirror)",
  "ios102-beta7-notes.pdf":
    "iOS SDK Release Notes for iOS 10.2 Beta 7 (Apple-authored PDF mirror)",
  "ios103-beta2-notes.pdf":
    "iOS Release Notes for iOS 10.3 beta 2 (Apple-authored PDF mirror)",
  "ios103-beta3-notes.pdf":
    "iOS Release Notes for iOS 10.3 beta 3 (Apple-authored PDF mirror)",
  "ios103-beta4-notes.pdf":
    "iOS Release Notes for iOS 10.3 beta 4 (Apple-authored PDF mirror)",
  "ios103-beta5-notes.pdf":
    "iOS Release Notes for iOS 10.3 beta 5 (Apple-authored PDF mirror)",
  "ios103-beta6-notes.pdf":
    "iOS Release Notes for iOS 10.3 beta 6 (Apple-authored PDF mirror)",
  "ios103-beta7-notes.pdf":
    "iOS Release Notes for iOS 10.3 beta 7 (Apple-authored PDF mirror)",
};
assert.equal(archiveSources.length, 9, "mirrored Apple PDF source count");
for (const source of archiveSources) {
  assert.equal(source.author, "Apple", `${source.url} author attribution`);
  assert.equal(source.sourceClass, "archive", `${source.url} source class`);
  assert.equal(
    source.title,
    expectedPdfSourceTitles[sourceFileByUrl.get(source.url)],
    `${source.url} exact mirrored-document title`,
  );
  const forumState = Object.values(expectedArchiveForums).find(
    ([, , archiveUrl, attachmentPath]) =>
      archiveUrl === source.archiveUrl &&
      new URL(source.url).pathname === attachmentPath,
  );
  assert(forumState, `${source.url} retains its exact forum provenance`);
}
const exactPdfProvenanceTimestamps = {
  "ios102-beta5-notes.pdf": [
    "mrforum-102-b5.html",
    "2016-12-02T10:22:27-08:00",
  ],
  "ios102-beta6-notes.pdf": [
    "mrforum-102-b6.html",
    "2016-12-05T10:03:22-08:00",
  ],
  "ios102-beta7-notes.pdf": [
    "mrforum-102-b7.html",
    "2016-12-07T09:54:04-08:00",
  ],
  "ios103-beta2-notes.pdf": [
    "mrforum-103-beta2.html",
    "2017-02-06T10:03:57-08:00",
  ],
  "ios103-beta3-notes.pdf": [
    "mrforum-103-beta3.html",
    "2017-02-20T10:00:40-08:00",
  ],
  "ios103-beta4-notes.pdf": [
    "mrforum-103-beta4.html",
    "2017-02-27T10:00:47-08:00",
  ],
  "ios103-beta5-notes.pdf": [
    "mrforum-103-beta5.html",
    "2017-03-08T09:58:25-08:00",
  ],
  "ios103-beta6-notes.pdf": [
    "mrforum-103-beta6.html",
    "2017-03-13T10:14:43-07:00",
  ],
  "ios103-beta7-notes.pdf": [
    "mrforum-103-beta7.html",
    "2017-03-16T10:02:23-07:00",
  ],
};
let pdfProvenanceTimestampAssertions = 0;
for (const [pdfName, [forumName, publishedAt]] of Object.entries(
  exactPdfProvenanceTimestamps,
)) {
  const source = bundle.sources.find(
    (candidate) => sourceFileByUrl.get(candidate.url) === pdfName,
  );
  assert(source, `${pdfName} has a declared source`);
  assert.equal(
    source.publishedAt,
    publishedAt,
    `${pdfName} exact provenance timestamp`,
  );
  const observed = archiveForumDocumentByFile
    .get(forumName)
    .querySelector("time[datetime]")?.dateTime;
  assert(observed, `${forumName} retains its first-post timestamp`);
  assert.equal(
    new Date(observed).getTime(),
    new Date(publishedAt).getTime(),
    `${pdfName} timestamp matches its attachment thread`,
  );
  pdfProvenanceTimestampAssertions += 1;
}
assert.equal(
  articleMetadataAssertions + pdfProvenanceTimestampAssertions,
  24,
  "exact source publication timestamp assertions",
);

assert.equal(bundle.formatVersion, 1, "bundle format");
assert.equal(bundle.target.projectId, "lh3yswzu", "production project target");
assert.equal(bundle.target.dataset, "production", "production dataset target");
assert.deepEqual(bundle.versions, [], "no version overlays");
assert.deepEqual(bundle.builds, [], "no build documents");
const expectedRoutes = [
  [
    "version-ios-10-1",
    "beta-1",
    "version-ios-10-1:m-53f23b3e20be",
    "2016-09-21",
    "Beta 1",
    1,
    3,
  ],
  [
    "version-ios-10-1",
    "beta-2",
    "version-ios-10-1:m-ca8bc420a603",
    "2016-10-04",
    "Beta 2",
    2,
    3,
  ],
  [
    "version-ios-10-2",
    "beta-1",
    "version-ios-10-2:m-535a456d1097",
    "2016-10-31",
    "Beta 1",
    1,
    10,
  ],
  [
    "version-ios-10-2",
    "beta-2",
    "version-ios-10-2:m-1abc72fd0d1b",
    "2016-11-07",
    "Beta 2",
    2,
    4,
  ],
  [
    "version-ios-10-2",
    "beta-3",
    "version-ios-10-2:m-ed33bef91340",
    "2016-11-14",
    "Beta 3",
    3,
    4,
  ],
  [
    "version-ios-10-2",
    "beta-5",
    "version-ios-10-2:m-7dfcf07ef9a5",
    "2016-12-02",
    "Beta 5",
    5,
    5,
  ],
  [
    "version-ios-10-3",
    "beta-1",
    "version-ios-10-3:m-ec39a31c165f",
    "2017-01-24",
    "Beta 1",
    1,
    15,
  ],
  [
    "version-ios-10-3",
    "beta-2",
    "version-ios-10-3:m-12d7773b7d2e",
    "2017-02-06",
    "Beta 2",
    2,
    12,
  ],
  [
    "version-ios-10-3",
    "beta-3",
    "version-ios-10-3:m-b9bedfb63ad9",
    "2017-02-20",
    "Beta 3",
    3,
    5,
  ],
  [
    "version-ios-10-3",
    "beta-4",
    "version-ios-10-3:m-7b6fe56c8df5",
    "2017-02-27",
    "Beta 4",
    4,
    1,
  ],
];
assert.equal(bundle.events.length, expectedRoutes.length, "event route count");
assert.deepEqual(
  bundle.events.map((event) => [
    event.identity.releaseVersionId,
    event.identity.routeAlias,
    event.identity.stableEventId,
    event.identity.appearanceDate,
    event.identity.label,
    event.identity.sequence,
    event.changes.length,
  ]),
  expectedRoutes,
  "exact route/date/occurrence closure",
);
assert(
  bundle.events.every(
    (event) =>
      event.identity.channel === "developerBeta" &&
      event.identity.platformId === "platform-ios" &&
      event.identity.isRevision === false &&
      event.identity.closesReleaseCycle === false &&
      event.identity.availabilityState === "available" &&
      event.target.releaseVersionId === event.identity.releaseVersionId &&
      event.target.routeAlias === event.identity.routeAlias &&
      event.target.routeAlias !== "public" &&
      event.authorship === "originalSynthesis" &&
      event.article?.authorship === "originalSynthesis" &&
      event.provenanceStatus === "editoriallyVerified" &&
      event.editorialReview?.status === "approved" &&
      event.editorialReview.reviewedAt === "2026-07-30T14:16:50Z" &&
      event.isIndexable === true,
  ),
  "all events are independently approved, non-Public, and indexable",
);

const declaredUrls = new Set(bundle.sources.map((source) => source.url));
const usedUrls = new Set();
const missingLocators = [];
let citationAssertions = 0;
const auditCitations = (value) => {
  if (Array.isArray(value)) {
    value.forEach(auditCitations);
    return;
  }
  if (!value || typeof value !== "object") return;
  for (const [key, item] of Object.entries(value)) {
    if (key === "citations" && Array.isArray(item)) {
      for (const citation of item) {
        citationAssertions += 1;
        assert(declaredUrls.has(citation.url), "citation source is declared");
        usedUrls.add(citation.url);
        assert(citation.locator, `${citation.url} citation has a locator`);
        const locatorParts = citation.locator.split(" — ");
        assert(
          locatorParts.length >= 2,
          `${citation.url} locator has a context separator`,
        );
        const exactPhrase = normalizedText(locatorParts.at(-1));
        assert(exactPhrase, `${citation.url} locator phrase is nonempty`);
        const sourceText = normalizedText(sourceTextByUrl.get(citation.url));
        if (!sourceText.includes(exactPhrase)) {
          missingLocators.push(
            `${sourceFileByUrl.get(citation.url)} lost locator phrase "${locatorParts.at(-1)}"`,
          );
        }
      }
    } else {
      auditCitations(item);
    }
  }
};
auditCitations(bundle);
assert.equal(citationAssertions, 288, "citation-reference assertions");
assert.equal(
  missingLocators.length,
  0,
  `every final locator phrase resolves (${new Set(missingLocators).size} unique failures):\n${[
    ...new Set(missingLocators),
  ]
    .slice(0, 10)
    .join("\n")}`,
);
assert.deepEqual(usedUrls, declaredUrls, "declared/used source closure");

let occurrenceCount = 0;
const definitions = new Map();
const histories = new Map();
for (const event of bundle.events) {
  const route = `${event.identity.releaseVersionId}/${event.identity.routeAlias}`;
  for (const change of event.changes) {
    occurrenceCount += 1;
    assert(change.citations.length > 0, `${change.key} claim citations`);
    assert(
      [
        "introduced",
        "changed",
        "removed",
        "fixed",
        "knownIssue",
        "regression",
      ].includes(change.action),
      `${change.key} action semantics`,
    );
    assert(
      ["delta", "cumulative"].includes(change.inheritance),
      `${change.key} inheritance semantics`,
    );
    assert.notEqual(
      change.evidenceState,
      "confirmed",
      `${change.key} does not overstate archived prerelease evidence`,
    );
    assert(
      ["reported", "corroborated"].includes(change.evidenceState),
      `${change.key} evidence-state semantics`,
    );
    assert(
      ["documented", "undocumented"].includes(change.documentedStatus),
      `${change.key} documented-status semantics`,
    );
    assert(
      typeof change.verificationMethod === "string" &&
        change.verificationMethod.length > 0,
      `${change.key} verification method`,
    );
    histories.set(change.key, [
      ...(histories.get(change.key) || []),
      `${route}:${change.action}:${change.inheritance}`,
    ]);
    const definition = {
      title: change.title,
      canonicalSummary: change.canonicalSummary,
      category: change.category,
    };
    const prior = definitions.get(change.key);
    if (prior) assert.deepEqual(definition, prior, change.key);
    else definitions.set(change.key, definition);
  }
}
assert.equal(occurrenceCount, 62, "selected occurrence count");
assert.equal(definitions.size, 53, "stable definition count");
const expectedRecurringHistories = new Map([
  [
    "apple-ios-10-point-prerelease-101-reduced-motion-message-effects",
    [
      "version-ios-10-1/beta-1:knownIssue:delta",
      "version-ios-10-1/beta-2:fixed:delta",
    ],
  ],
  [
    "apple-ios-10-point-prerelease-102-emergency-sos-beta-scope",
    [
      "version-ios-10-2/beta-2:introduced:delta",
      "version-ios-10-2/beta-3:changed:delta",
    ],
  ],
  [
    "apple-ios-10-point-prerelease-103-lan-asset-cache",
    [
      "version-ios-10-3/beta-2:knownIssue:delta",
      "version-ios-10-3/beta-3:fixed:delta",
    ],
  ],
  [
    "apple-ios-10-point-prerelease-103-lightning-video-adapters",
    [
      "version-ios-10-3/beta-2:knownIssue:delta",
      "version-ios-10-3/beta-3:fixed:delta",
    ],
  ],
  [
    "apple-ios-10-point-prerelease-103-shared-ipad-settings",
    [
      "version-ios-10-3/beta-2:regression:delta",
      "version-ios-10-3/beta-4:fixed:delta",
    ],
  ],
  [
    "apple-ios-10-point-prerelease-103-simulator-icloud-drive-crash",
    [
      "version-ios-10-3/beta-2:knownIssue:delta",
      "version-ios-10-3/beta-3:fixed:delta",
    ],
  ],
  [
    "apple-ios-10-point-prerelease-103-sirikit-car-commands",
    [
      "version-ios-10-3/beta-1:knownIssue:delta",
      "version-ios-10-3/beta-2:knownIssue:cumulative",
    ],
  ],
  [
    "apple-ios-10-point-prerelease-103-find-airpods-reliability",
    [
      "version-ios-10-3/beta-1:knownIssue:delta",
      "version-ios-10-3/beta-2:knownIssue:cumulative",
      "version-ios-10-3/beta-3:fixed:delta",
    ],
  ],
]);
assert.deepEqual(
  new Set(
    [...histories]
      .filter(([, history]) => history.length > 1)
      .map(([key]) => key),
  ),
  new Set(expectedRecurringHistories.keys()),
  "recurring change-key closure",
);
for (const [key, history] of expectedRecurringHistories) {
  assert.deepEqual(histories.get(key), history, `${key} exact history`);
}
assert.deepEqual(
  bundle.events
    .flatMap((event) => event.changes)
    .filter((change) => change.inheritance === "cumulative")
    .map((change) => change.key)
    .sort(),
  [
    "apple-ios-10-point-prerelease-103-find-airpods-reliability",
    "apple-ios-10-point-prerelease-103-sirikit-car-commands",
  ],
  "cumulative occurrence allowlist",
);
const reusedDefinitions = [
  "ios-10-1-portrait-camera-beta",
  "ios-10-2-emoji-expansion",
  "ios-10-3-find-my-airpods",
  "ios-10-3-in-app-ratings-api",
];
assert(
  [...definitions.keys()].every(
    (key) =>
      reusedDefinitions.includes(key) ||
      key.startsWith("apple-ios-10-point-prerelease-"),
  ),
  "all non-reused definitions use the batch namespace",
);
assert(
  reusedDefinitions.every((key) => definitions.has(key)),
  "four canonical Public definitions are reused",
);

const editorialStrings = [];
for (const event of bundle.events) {
  editorialStrings.push(event.summary);
  for (const block of event.article?.blocks || []) {
    if (block.text) editorialStrings.push(block.text);
    for (const span of block.spans || []) {
      if (span.text) editorialStrings.push(span.text);
    }
  }
  for (const change of event.changes) {
    editorialStrings.push(
      change.title,
      change.canonicalSummary,
      change.summary,
      change.verificationMethod,
    );
  }
}
assert(
  editorialStrings.every((value) => typeof value === "string" && value),
  "reader-facing fields are nonempty strings",
);
assert.equal(editorialStrings.length, 298, "reader-facing copyright fields");

const words = (value) =>
  collapse(
    value
      .normalize("NFKD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase(),
  ).match(/[a-z0-9][a-z0-9._:$-]*/g) || [];
const sourceTokens = new Map(
  [...sourceTextByUrl].map(([url, text]) => [url, words(text)]),
);
const fourGramPositions = new Map();
for (const [url, tokens] of sourceTokens) {
  const positions = new Map();
  for (let index = 0; index + 4 <= tokens.length; index += 1) {
    const gram = tokens.slice(index, index + 4).join("|");
    const starts = positions.get(gram);
    if (starts) starts.push(index);
    else positions.set(gram, [index]);
  }
  fourGramPositions.set(url, positions);
}

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
if (maximumOverlapWords < 4) {
  for (let size = 3; size >= 1 && maximumOverlapWords === 0; size -= 1) {
    const sourceGrams = new Map(
      [...sourceTokens].map(([url, tokens]) => [
        url,
        new Set(
          Array.from(
            { length: Math.max(0, tokens.length - size + 1) },
            (_, index) => tokens.slice(index, index + size).join("|"),
          ),
        ),
      ]),
    );
    for (const editorial of editorialStrings) {
      const editorialTokens = words(editorial);
      for (let index = 0; index + size <= editorialTokens.length; index += 1) {
        const gram = editorialTokens.slice(index, index + size).join("|");
        const source = [...sourceGrams].find(([, grams]) => grams.has(gram));
        if (source) {
          maximumOverlapWords = size;
          overlapPhrase = editorialTokens.slice(index, index + size).join(" ");
          overlapSource = source[0];
          overlapEditorial = editorial;
          break;
        }
      }
      if (maximumOverlapWords) break;
    }
  }
}
assert(
  maximumOverlapWords <= 5,
  `copyright overlap exceeds 5 words: "${overlapPhrase}" from ${overlapSource} in "${overlapEditorial}"`,
);

const retainedEvidenceBytes =
  citedHtmlBytes + archiveForumBytes + pdfBytes + negativeArtifactBytes;
const totalEvidenceBytes = retainedEvidenceBytes + excludedArtifactBytes;
assert.equal(retainedEvidenceBytes, 6_513_889, "retained evidence bytes");
assert.equal(excludedArtifactBytes, 358_255, "excluded evidence bytes");
assert.equal(totalEvidenceBytes, 6_872_144, "evidence-directory bytes");
assert.equal(accountedEvidenceFiles.size, 50, "evidence-directory file count");

const result = {
  archiveForumFiles: Object.keys(expectedArchiveForums).length,
  cumulativeOccurrences: bundle.events
    .flatMap((event) => event.changes)
    .filter((change) => change.inheritance === "cumulative").length,
  citationAssertions,
  citedHtmlFiles: Object.keys(expectedHtml).length,
  definitions: definitions.size,
  derivedRenderArtifacts: 1,
  derivedRenderBytes: derivedRender.byteLength,
  evidenceFiles: accountedEvidenceFiles.size,
  excludedArtifacts: Object.keys(expectedExcludedArtifacts).length,
  excludedEvidenceBytes: excludedArtifactBytes,
  ios102EquivalentDocuments: pdfAudit.ios102EquivalentDocuments,
  ios103EquivalentDocuments: pdfAudit.ios103EquivalentDocuments,
  maximumOverlapWords,
  negativeArtifacts: Object.keys(expectedNegativeArtifacts).length,
  occurrences: occurrenceCount,
  pdfFiles: pdfAudit.pdfFiles,
  pdfLocatorAssertions: pdfAudit.locatorAssertions,
  physicalPages: pdfAudit.physicalPages,
  publicationTimestampAssertions:
    articleMetadataAssertions + pdfProvenanceTimestampAssertions,
  readerFacingFields: editorialStrings.length,
  recurringHistories: expectedRecurringHistories.size,
  retainedEvidenceBytes,
  routes: bundle.events.length,
  sources: bundle.sources.length,
  totalAuditedBytes: totalEvidenceBytes,
  undatedSourceTimestamps,
  workspaceAuditBytes: totalEvidenceBytes + derivedRender.byteLength,
};

console.log(JSON.stringify(result, null, 2));
console.log(
  `Longest reader-facing overlap: "${overlapPhrase}" (${maximumOverlapWords} words; ${overlapSource})`,
);
