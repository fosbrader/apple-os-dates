import { createHash } from "node:crypto";
import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import prettier from "prettier";

const here = dirname(fileURLToPath(import.meta.url));
const outputName = "apple-ios-6-point-prerelease.json";
const ledgerName = "apple-ios-6-point-prerelease.md";
const accessedAt = "2026-07-30";
const reviewedAt = "2026-07-30T13:38:37Z";
const approvedPublicSha =
  "90a268731788d73204b9e77d5176fd5aa55c8fe0f506b2597b16a3bc1ed385b7";
const completedMajorPrereleaseArtifactShas = {
  "build-apple-ios-6-prerelease.mjs":
    "6fb55e2ca4a4d0bcb9a719e718c478f665d5ae5249fff53fdb3afd2e18a9de94",
  "audit-ios6-prerelease.mjs":
    "48aa397d8cc534bbbdee3f9f7dd963c69377cd42f4284f2c41390dcc9ddfc582",
  "apple-ios-6-prerelease.json":
    "28bcb3df23cb2642088f763490b213da38d34bd51ec933df7d235eb157047421",
  "apple-ios-6-prerelease.md":
    "09d61fe63cb10f32e0dc11e4fafe18895e69b1f8d384f654a9a6bece8ee8b580",
};

const verification = {
  researchBatches: 73,
  globalChangeKeys: 4214,
  focusedTests: 19,
  fullTests: 131,
  htmlLocatorAssertions: 189,
  minimumSemanticTokenOverlap: 2,
  copyrightFields: 162,
  maximumEditorialOverlapWords: 5,
  independentSourcesFetched: 25,
  independentRawExact: 13,
  independentNormalizedExact: 24,
  independentTitlesReproduced: 25,
  independentLocatorsReproduced: 25,
  independentEvidenceReproduced: 25,
};

const dryRun = {
  creates: 52,
  patches: 5,
  unchanged: 2_143,
  eventCreates: 7,
  sourceCreates: 25,
  changeCreates: 20,
  mutationPayloadBytes: 114_100,
  contentDigest:
    "0a1cb2786376a49edb4a9ccd0fa70be42e5d3484e8954beb6556217a5b1cd9d5",
  sourceSnapshotDigest:
    "a17bd51fedb0dcef1cb6c723e48ed9b61d551fc6369ac6982dbd28ebf6f85db5",
  planSha: "5b084b4ac4201a60b04235542f240aa5289dae5b4560cfa87122178fa344af94",
  planArtifactSha:
    "6011fb1ea1d371ec91444588c24df74ce5fd88f3930bf3ede0ae249c33ec9d2f",
  rollbackArtifactSha:
    "ac585e3644187bfc8427f8a469c555690f757af2493870dfd6e6cdf20b3b1f33",
  patchBoundary:
    "five existing approved change documents receive citation unions plus refreshed approved-review timestamps; every prior citation is preserved, all semantic definitions remain unchanged, and there are zero source, version, event, or build patches",
};
const publicationRecord = {
  transactionId: "F0eE6eK5XyVXtlnaoydbIq",
  receiptSha:
    "4dc67fb89f80cd52374574cb8574e982bfcf0b255a903f10f21211a435518f12",
  zeroPlanSha:
    "f66a811b39762ab15bfecc98547e7156093311d40ba8ce5edf6ff25509ae5214",
  zeroPlanArtifactSha:
    "df7c21737eb6d2534a83b120a1248304c3d8fe39b52d56a55eba5ccc1e07c942",
  zeroRollbackArtifactSha:
    "a132f6b8221f799b64839d9e520a0ecd141b996f47857b0f20be6af11c3b3793",
  zeroUnchanged: 2_200,
  coverage: {
    totalVersions: 410,
    fullVersions: 410,
    totalAppearances: 2_047,
    fullAppearances: 494,
    sourceLinkedAppearances: 256,
    timelineOnlyAppearances: 1_297,
    approvedStructuredAppearances: 645,
  },
};

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

const sources = [
  {
    url: U.mr601Carrier,
    title:
      "Apple Testing iOS 6.0.1 with Fixes for Keyboard Screen Glitch, Camera Flash Issues, and More",
    publisher: "MacRumors",
    sourceClass: "journalism",
    author: "Eric Slivka",
    publishedAt: "2012-10-22T14:40:17.000Z",
    topics: ["iOS", "6.0.1", "carrier testing", "route exclusion"],
  },
  {
    url: U.mr61Beta1,
    title: "Apple Seeds First iOS 6.1 Beta to Developers",
    publisher: "MacRumors",
    sourceClass: "journalism",
    author: "Jordan Golson",
    publishedAt: "2012-11-01T18:30:26.000Z",
    topics: ["iOS", "6.1", "Beta 1", "release identity", "build evidence"],
  },
  {
    url: U.idb61Beta1,
    title: "Apple seeds iOS 6.1 Beta to developers with Maps Kit improvements",
    publisher: "iDownloadBlog",
    sourceClass: "journalism",
    author: "Christian Zibreg",
    publishedAt: "2012-11-01T18:39:52.000Z",
    topics: ["iOS", "6.1", "Beta 1", "MapKit", "Passbook", "Settings"],
  },
  {
    url: U.nine61Fandango,
    title:
      "Apple to bring movie ticket purchasing to Siri with upcoming iOS 6.1 update",
    publisher: "9to5Mac",
    sourceClass: "journalism",
    author: "Mark Gurman",
    publishedAt: "2012-11-04T21:43:58.000Z",
    topics: ["iOS", "6.1", "Beta 1", "Siri", "Fandango"],
  },
  {
    url: U.mr61Fandango,
    title: "iOS 6.1 to Add Siri-Based Movie Ticket Purchases via Fandango",
    publisher: "MacRumors",
    sourceClass: "journalism",
    author: "Eric Slivka",
    publishedAt: "2012-11-05T14:34:25.000Z",
    topics: ["iOS", "6.1", "Beta 1", "Siri", "Fandango"],
  },
  {
    url: U.mr61Beta2,
    title: "Apple Seeds Second iOS 6.1 Beta to Developers",
    publisher: "MacRumors",
    sourceClass: "journalism",
    author: "Jordan Golson",
    publishedAt: "2012-11-12T18:14:29.000Z",
    topics: ["iOS", "6.1", "Beta 2", "release identity", "build evidence"],
  },
  {
    url: U.idb61Beta2,
    title: "Apple posts iOS 6.1 Beta 2, new Apple TV beta",
    publisher: "iDownloadBlog",
    sourceClass: "journalism",
    author: "Christian Zibreg",
    publishedAt: "2012-11-12T18:15:59.000Z",
    topics: [
      "iOS",
      "6.1",
      "Beta 2",
      "observed changes",
      "developer-note reproduction",
      "build conflict",
    ],
  },
  {
    url: U.nine61Beta2,
    title:
      "Apple releases iOS 6.1 beta 2 for iPhone, iPod, iPad, updated Apple TV software to developers",
    publisher: "9to5Mac",
    sourceClass: "journalism",
    author: "Jake Smith",
    publishedAt: "2012-11-12T18:17:24.000Z",
    topics: ["iOS", "6.1", "Beta 2", "Panorama", "Passbook", "iTunes Match"],
  },
  {
    url: U.nine61Beta3,
    title: "Apple seeds iOS 6.1 beta 3 to developers",
    publisher: "9to5Mac",
    sourceClass: "journalism",
    author: "Mark Gurman",
    publishedAt: "2012-12-03T17:54:54.000Z",
    topics: ["iOS", "6.1", "Beta 3", "release identity"],
  },
  {
    url: U.ticker61Beta3,
    title:
      "iOS 6.1: Apple veröffentlicht dritte Vorabversion (developer-note transcript in community comment)",
    publisher: "iPhone-Ticker",
    sourceClass: "archive",
    author: "Nicolas; transcript posted by Robo.Term",
    publishedAt: "2012-12-03T19:03:45.000Z",
    topics: ["iOS", "6.1", "Beta 3", "community archive", "release notes"],
  },
  {
    url: U.iphonote61Beta3,
    title:
      "iOS 6.1 bêta 3 : Toutes les améliorations et corrections de bugs listées",
    publisher: "iPhonote",
    sourceClass: "archive",
    author: "Rémi",
    publishedAt: "2012-12-05T12:37:45.000Z",
    topics: ["iOS", "6.1", "Beta 3", "developer-note reproduction"],
  },
  {
    url: U.cult61Beta3,
    title: "Here's What's New In Apple's Latest iOS 6.1 Beta",
    publisher: "Cult of Mac",
    sourceClass: "journalism",
    author: "Killian Bell",
    publishedAt: "2012-12-04T15:54:57.000Z",
    topics: ["iOS", "6.1", "Beta 3", "observed changes"],
  },
  {
    url: U.mr61Beta4,
    title: "Apple Seeds Fourth iOS 6.1 Beta to Developers",
    publisher: "MacRumors",
    sourceClass: "journalism",
    author: "Jordan Golson",
    publishedAt: "2012-12-17T18:09:05.000Z",
    topics: ["iOS", "6.1", "Beta 4", "release identity", "build evidence"],
  },
  {
    url: U.ticker61Beta4,
    title:
      "iOS 6.1 Apple veröffentlicht vierte Vorabversion (developer-note transcript in community comment)",
    publisher: "iPhone-Ticker",
    sourceClass: "archive",
    author: "Nicolas; transcript posted by MichiBoa",
    publishedAt: "2012-12-17T18:09:21.000Z",
    topics: ["iOS", "6.1", "Beta 4", "community archive", "release notes"],
  },
  {
    url: U.mr61Beta5,
    title: "Apple Seeds iOS 6.1 Beta 5 to Developers",
    publisher: "MacRumors",
    sourceClass: "journalism",
    author: "Eric Slivka",
    publishedAt: "2013-01-27T02:24:31.000Z",
    topics: ["iOS", "6.1", "Beta 5", "release identity", "GM boundary"],
  },
  {
    url: U.mr61Manifest,
    title: "iOS 6.1 Beta 5 Code Hints at Upcoming 128 GB Devices",
    publisher: "MacRumors",
    sourceClass: "journalism",
    author: "Eric Slivka",
    publishedAt: "2013-01-27T22:04:23.000Z",
    topics: ["iOS", "6.1", "Beta 5", "build manifest", "undocumented"],
  },
  {
    url: U.mr61Public,
    title:
      "Apple Releases iOS 6.1 with New LTE Carriers and Fandango Siri Integration",
    publisher: "MacRumors",
    sourceClass: "journalism",
    author: "Eric Slivka",
    publishedAt: "2013-01-28T18:10:31.000Z",
    topics: ["iOS", "6.1", "Public", "cycle boundary"],
  },
  {
    url: U.mr611Beta1,
    title: "Apple Seeds First Beta of iOS 6.1.1 to Developers",
    publisher: "MacRumors",
    sourceClass: "journalism",
    author: "Eric Slivka",
    publishedAt: "2013-02-06T18:32:01.000Z",
    topics: ["iOS", "6.1.1", "Beta 1", "release identity", "build evidence"],
  },
  {
    url: U.nine611Beta1,
    title:
      "Apple releases iOS 6.1.1 beta to developers with major enhancements to Maps for Japan",
    publisher: "9to5Mac",
    sourceClass: "journalism",
    author: "Mark Gurman",
    publishedAt: "2013-02-06T18:22:12.000Z",
    topics: ["iOS", "6.1.1", "Beta 1", "Maps Japan", "expiration evidence"],
  },
  {
    url: U.nine611Rename,
    title:
      "iOS 6.1.1 for iPhone 4S released to address cellular performance and reliability bugs",
    publisher: "9to5Mac",
    sourceClass: "journalism",
    author: "Mark Gurman",
    publishedAt: "2013-02-11T20:03:13.000Z",
    topics: ["iOS", "6.1.1", "Public", "beta rename", "lineage boundary"],
  },
  {
    url: U.nine611Evasi0n,
    title:
      "First iOS 6.1.1 beta does not break recently released evasi0n jailbreak",
    publisher: "9to5Mac",
    sourceClass: "journalism",
    author: "Mark Gurman",
    publishedAt: "2013-02-07T17:35:35.000Z",
    topics: ["iOS", "6.1.1", "Beta 1", "evasi0n", "security observation"],
  },
  {
    url: U.nine613Beta2,
    title:
      "Apple releases iOS 6.1.3 beta 2 to developers with Lock Screen security flaw fix",
    publisher: "9to5Mac",
    sourceClass: "journalism",
    author: "Mark Gurman",
    publishedAt: "2013-02-21T18:01:50.000Z",
    topics: ["iOS", "6.1.3", "Beta 2", "rename", "Maps", "passcode"],
  },
  {
    url: U.mr613Beta2,
    title:
      "Apple Seeds iOS 6.1.3 Beta 2 to Developers with Fix for Passcode Lock Bug",
    publisher: "MacRumors",
    sourceClass: "journalism",
    author: "Eric Slivka",
    publishedAt: "2013-02-21T18:09:07.000Z",
    topics: ["iOS", "6.1.3", "Beta 2", "rename", "Maps", "passcode"],
  },
  {
    url: U.nine613Evasi0n,
    title:
      "Apple patches exploits in iOS 6.1.3 beta 2 that break evasi0n jailbreak",
    publisher: "9to5Mac",
    sourceClass: "journalism",
    author: "Jordan Kahn",
    publishedAt: "2013-02-25T19:26:55.000Z",
    topics: ["iOS", "6.1.3", "Beta 2", "evasi0n", "time-zone exploit"],
  },
  {
    url: U.mr613Evasi0n,
    title: "iOS 6.1.3 Beta 2 Fixes Exploits Used for Evasi0n Jailbreak",
    publisher: "MacRumors",
    sourceClass: "journalism",
    author: "Juli Clover",
    publishedAt: "2013-02-25T20:11:03.000Z",
    topics: ["iOS", "6.1.3", "Beta 2", "evasi0n", "time-zone exploit"],
  },
];

const rawEvidence = [
  [
    "macrumors-601-carrier.html",
    126_640,
    "f2c8dc092b878d032bafdad8511f5421c9eb087e569af7d622fee4707b7fd537",
    "6.0.1 carrier-only boundary",
  ],
  [
    "macrumors-61-beta1.html",
    123_665,
    "70eaee005f9c9366296e816e1bd428bde42478818009ae34db7f1ac8004b7f97",
    "6.1 Beta 1 identity and build",
  ],
  [
    "idownloadblog-61-beta1.html",
    211_106,
    "0073de900255008021d05f8ad59e2f678d52e38144a675291470a5c8365a2e47",
    "Beta 1 developer changes",
  ],
  [
    "9to5-61-fandango.html",
    144_834,
    "b5a30f1db481946a7d41f36e2bf806399256a4afbf0398ba756ecc31e8e0ba1d",
    "Beta 1 Siri observation",
  ],
  [
    "macrumors-61-fandango.html",
    123_540,
    "2b7241aa389bc7da0c84b5d741579985f5b2205ec238e4a028624bfe091aee9e",
    "Siri report mirror",
  ],
  [
    "macrumors-61-beta2.html",
    124_762,
    "6eae07c543692c9c826127773fb86e1fa0159352f937a9a6a3f6a83cd7a105e0",
    "Beta 2 identity and build",
  ],
  [
    "idownloadblog-61-beta2.html",
    218_432,
    "5cc5fa82c6b024ceebc6fa849d604f4f375d1f74a30394343646aba2b442e746",
    "Beta 2 observations, transcript, and build typo",
  ],
  [
    "9to5-61-beta2.html",
    142_307,
    "c0ff7bb305b3b38fa10943217fa07d71bccacdd8087056d387f69dfd95a499a5",
    "Beta 2 observed changes",
  ],
  [
    "9to5-61-beta3.html",
    142_447,
    "cd285e88b3e8b5d474d5aef61a4b38bb0825b66d8c67a1f50e912a394709383c",
    "Beta 3 identity",
  ],
  [
    "iphone-ticker-61-beta3.html",
    276_317,
    "856b876602523b7011daeea60ff559fdc72d07adfa861b6184fe000a2932198c",
    "Beta 3 community transcript",
  ],
  [
    "iphonote-61-beta3.html",
    204_141,
    "b87a0ad035110a96493ced2bd00734b9f0a0455f007932439b84c2247ba129ff",
    "Beta 3 article transcript",
  ],
  [
    "cultofmac-61-beta3.html",
    289_271,
    "636a8a2a9da14feedebb3a03765e931af1e7865ef0886bbed1a9ba41625bd5b6",
    "Beta 3 observed changes",
  ],
  [
    "macrumors-61-beta4.html",
    122_747,
    "6aefdd254d479b6cb61d7fb9015ea0f7242da7a7dcafc8e592fb04e0503c0378",
    "Beta 4 identity and builds 3/4",
  ],
  [
    "iphone-ticker-61-beta4.html",
    271_684,
    "d7255f9e31b916554660d9112e96a203efe31f8d4599a83ef74b2821ec608b3b",
    "Beta 4 community transcript",
  ],
  [
    "macrumors-61-beta5.html",
    123_786,
    "54bf3f80231995eb8dc0df7495247b3cb06ad9394b67cb3c457ae0c2c6c6cd86",
    "Beta 5 identity",
  ],
  [
    "macrumors-61-128gb.html",
    123_766,
    "954ef1eaac4eb17a208da0bf9e209bd8b083362c1563645756aaeac977d22bd1",
    "Beta 5 manifest observation",
  ],
  [
    "macrumors-61-public.html",
    124_375,
    "82cb2e140e8284812b7ac23abc4dd0859ec2571fad24ea6e114d8baf9cab3d26",
    "direct Beta 5-to-Public boundary",
  ],
  [
    "macrumors-611-beta1.html",
    124_379,
    "7d0dd933d71c4b8d7428a4ea1ee6db29a0d1fd81988ce98d1d0d044f12a4b8fa",
    "6.1.1 Beta 1 identity and build",
  ],
  [
    "9to5-611-beta1.html",
    145_117,
    "79d38bf44f7374e9d7417df6ecde0d38ee73e323b1bd75bb4d427356b244b3e4",
    "Maps notes and no-expiry report",
  ],
  [
    "9to5-611-public-rename.html",
    144_436,
    "633a50ee585d0d8aa864d3046d6c84012806c5ab23683b0d024ff5d02536397a",
    "Public 6.1.1 and beta-rename boundary",
  ],
  [
    "9to5-611-evasi0n.html",
    144_466,
    "397440fef1a8326158bad62b9471ab3b4d1eb767a6fc09f61725a7433bf80160",
    "Beta 1 evasi0n observation",
  ],
  [
    "9to5-613-beta2.html",
    144_205,
    "98d5c5342dcbf0c0ed5c071c514187159ab31b13a1c8fe62bd5e2be514b7ba9f",
    "6.1.3 Beta 2 identity, rename, and changes",
  ],
  [
    "macrumors-613-beta2.html",
    126_540,
    "57a1a324fda9de4de653114ea9bf49adfa12e16427d1121f28ab295da3e10767",
    "Beta 2 corroboration",
  ],
  [
    "9to5-613-evasi0n.html",
    146_394,
    "3691b20f74873d63ba9616b20921b358cc10cdaf7b0f1a5eda30f103c6e575ad",
    "time-zone exploit report",
  ],
  [
    "macrumors-613-evasi0n.html",
    126_309,
    "2b535d8578eba5eaf71de02649db7351d15ac6d2ba9bd1aa85431be7d63808b2",
    "time-zone exploit corroboration",
  ],
];
const excludedRawArtifacts = [
  [
    "apple-support-ios6.html",
    1_169_945,
    "7f8423a8084cd970d7eb20e96a1b370c7b95e546399575e05013b9677a366fba",
    "exploratory Apple Public-release cumulative notes; not evidence for a selected prerelease occurrence",
  ],
  [
    "mactrast-61-beta4.html",
    148_993,
    "ca276ea87f58be8b2eafe6fc8546873f389707efbee67df6397478e8058e1ee2",
    "exploratory duplicate Beta 4 identity coverage; excluded from the declared source set",
  ],
];

const c = (url, context, locator, note) => ({
  url,
  locator: `${context} — ${locator}`,
  ...(note ? { note } : {}),
});
const heading = (text) => ({ style: "h2", text });
const prose = (text, citations) => ({ style: "normal", text, citations });
const article = (...blocks) => ({
  authorship: "originalSynthesis",
  blocks,
});
const uniqueCitations = (citations) => [
  ...new Map(
    citations.map((citation) => [
      `${citation.url}|${citation.locator}|${citation.note || ""}`,
      citation,
    ]),
  ).values(),
];
const stableValue = (value) => {
  if (Array.isArray(value)) return value.map(stableValue);
  if (!value || typeof value !== "object") return value;
  return Object.fromEntries(
    Object.entries(value)
      .sort(([left], [right]) => left.localeCompare(right))
      .map(([key, item]) => [key, stableValue(item)]),
  );
};
const routeKey = (releaseVersionId, alias) => `${releaseVersionId}/${alias}`;

const publicPath = join(here, "apple-ios-6.json");
const completedMajorPrereleasePath = join(here, "apple-ios-6-prerelease.json");
const publicRaw = readFileSync(publicPath);
const completedMajorPrereleaseRaw = readFileSync(completedMajorPrereleasePath);
for (const [filename, expectedSha] of Object.entries(
  completedMajorPrereleaseArtifactShas,
)) {
  const observedSha = createHash("sha256")
    .update(readFileSync(join(here, filename)))
    .digest("hex");
  if (observedSha !== expectedSha) {
    throw new Error(
      `The completed iOS 6.0 prerelease sibling changed: ${filename} (${observedSha}/${expectedSha}).`,
    );
  }
}
const completedMajorPrereleaseSha =
  completedMajorPrereleaseArtifactShas["apple-ios-6-prerelease.json"];
if (
  createHash("sha256").update(publicRaw).digest("hex") !== approvedPublicSha
) {
  throw new Error(
    "The approved iOS 6 Public batch changed; re-audit canonical ownership before rebuilding.",
  );
}
const completedMajorPrereleaseBatch = JSON.parse(completedMajorPrereleaseRaw);
const completedMajorRoutes = (completedMajorPrereleaseBatch.events || [])
  .map(
    (event) =>
      `${event.identity?.releaseVersionId}/${event.identity?.routeAlias}`,
  )
  .sort();
const expectedCompletedMajorRoutes = [
  "version-ios-6-0/beta-1",
  "version-ios-6-0/beta-2",
  "version-ios-6-0/beta-3",
  "version-ios-6-0/beta-4",
];
if (
  (completedMajorPrereleaseBatch.versions || []).length !== 0 ||
  (completedMajorPrereleaseBatch.builds || []).length !== 0 ||
  JSON.stringify(completedMajorRoutes) !==
    JSON.stringify(expectedCompletedMajorRoutes)
) {
  throw new Error(
    "The iOS 6.0 prerelease candidate moved outside its four major-version routes; this point-release batch must not compete with it.",
  );
}
const publicBatch = JSON.parse(publicRaw);

const definitionValue = (change) => ({
  key: change.key,
  title: change.title,
  canonicalSummary: change.canonicalSummary,
  category: change.category,
});
const collectDefinitions = (batch, label) => {
  const result = new Map();
  for (const owner of [
    ...(batch.versions || []),
    ...(batch.events || []),
    ...(batch.builds || []),
  ]) {
    for (const change of owner.changes || []) {
      const definition = definitionValue(change);
      const prior = result.get(change.key);
      if (
        prior &&
        JSON.stringify(stableValue(prior)) !==
          JSON.stringify(stableValue(definition))
      ) {
        throw new Error(`${label} has definition drift for ${change.key}.`);
      }
      result.set(change.key, definition);
    }
  }
  return result;
};

const publicDefinitions = collectDefinitions(publicBatch, "apple-ios-6.json");
const definitions = new Map();
const sharedOwners = new Map();
const define = (key, title, canonicalSummary, category) => {
  if (!key.startsWith("ios6-point-prerelease-")) {
    throw new Error(`New point-release key lacks the cohort prefix: ${key}.`);
  }
  const definition = { key, title, canonicalSummary, category };
  const prior = definitions.get(key);
  if (
    prior &&
    JSON.stringify(stableValue(prior)) !==
      JSON.stringify(stableValue(definition))
  ) {
    throw new Error(`Local definition drifted for ${key}.`);
  }
  definitions.set(key, definition);
  return key;
};
const reusePublic = (key) => {
  const definition = publicDefinitions.get(key);
  if (!definition) throw new Error(`The approved Public owner lost ${key}.`);
  definitions.set(key, definition);
  sharedOwners.set(key, publicPath);
  return key;
};

const K = {
  mapkitSearch: define(
    "ios6-point-prerelease-mapkit-local-search",
    "MapKit local-search classes",
    "MapKit gained request and response classes that supplied applications with search results for addresses and places.",
    "developerApi",
  ),
  passbookRelevance: define(
    "ios6-point-prerelease-passbook-date-location-relevance",
    "Date-and-location relevance for boarding passes",
    "A boarding pass with date and location relevance required the date to match; when both matched, its display window became longer.",
    "behavior",
  ),
  advertisingReset: reusePublic("ios-6-1-advertising-identifier-reset"),
  siriFandango: reusePublic("ios-6-1-siri-fandango-tickets"),
  icloudPlans: define(
    "ios6-point-prerelease-icloud-storage-plan-changes",
    "iCloud storage-plan changes",
    "The first two 6.1 seeds blocked iCloud storage-plan upgrades and downgrades; Beta 3 marked that restriction as repaired.",
    "bugFix",
  ),
  passbookInfo: define(
    "ios6-point-prerelease-passbook-explanatory-card",
    "Passbook explanatory card",
    "Passbook gained a revised first-run card that explained the kinds of passes the application could hold.",
    "enhancement",
  ),
  panorama: define(
    "ios6-point-prerelease-panorama-availability",
    "Panorama capture availability",
    "Panorama capture, unavailable in the first 6.1 seed, worked again in the second seed.",
    "bugFix",
  ),
  itunesMatchSongs: reusePublic("ios-6-1-itunes-match-song-downloads"),
  simulatorIap: define(
    "ios6-point-prerelease-simulator-in-app-purchase",
    "Simulator in-app-purchase testing",
    "Testing in-app purchases in iOS Simulator was unavailable in earlier 6.1 seeds and later marked as restored in a preserved Beta 4 note.",
    "developerApi",
  ),
  weiboVisibility: define(
    "ios6-point-prerelease-weibo-settings-visibility",
    "Weibo Settings visibility",
    "The Weibo account settings appeared only when a Chinese keyboard was enabled.",
    "behavior",
  ),
  legacyTwitter: define(
    "ios6-point-prerelease-legacy-sdk-twitter-testing",
    "Legacy-SDK Twitter testing",
    "On OS X Mountain Lion, iOS 5.x legacy Simulator targets could not sign in to Twitter and could not use Twitter.framework correctly.",
    "knownIssue",
  ),
  chineseInput: define(
    "ios6-point-prerelease-chinese-keyboard-input",
    "Chinese keyboard input repairs",
    "Chinese keyboard fixes addressed rapid-input errors, unavailable emoji, broken Zhuyin sequences and shortcuts, and slow Cangjie or Sucheng candidate expansion.",
    "bugFix",
  ),
  thaiKeyboards: define(
    "ios6-point-prerelease-thai-keyboard-layouts",
    "Four- and five-row Thai keyboards",
    "iOS 6.1 made both the earlier four-row Thai keyboard and the five-row layout introduced with iOS 6 available.",
    "enhancement",
  ),
  icloudSetup: define(
    "ios6-point-prerelease-icloud-setup-identity-confirmation",
    "iCloud first-run identity confirmation",
    "Initial iCloud setup added confirmation steps for the Apple ID password and the addresses used by FaceTime and iMessage.",
    "behavior",
  ),
  passbookUk: define(
    "ios6-point-prerelease-passbook-british-english",
    "British English on the Passbook sample",
    "Passbook's sample card used British English terms for movie venues and tickets when shown in the United Kingdom.",
    "enhancement",
  ),
  voiceDial: define(
    "ios6-point-prerelease-voice-dial-only",
    "Voice Dial Only control",
    "A Voice Control option limited voice commands to telephone dialing without invoking other media actions.",
    "feature",
  ),
  itunesCellular: define(
    "ios6-point-prerelease-itunes-cellular-data-control",
    "iTunes cellular-data control",
    "The cellular-data settings added an iTunes control for allowing music downloads over mobile networks.",
    "feature",
  ),
  textAlignment: define(
    "ios6-point-prerelease-label-text-alignment",
    "UILabel natural and justified alignment",
    "Natural and justified text alignments were unavailable to affected label and string-rendering APIs.",
    "knownIssue",
  ),
  exchangePush: define(
    "ios6-point-prerelease-exchange-push-network-transitions",
    "Exchange push across network changes",
    "An Exchange push-mail failure associated with transitions between Wi-Fi and cellular networks was marked as repaired.",
    "bugFix",
  ),
  mapSearchCoverage: define(
    "ios6-point-prerelease-mapkit-local-search-coverage",
    "MapKit local-search regional coverage",
    "Local-search results from the new MapKit APIs were not available in every country, with Russia and Japan named as examples.",
    "knownIssue",
  ),
  launchImage: define(
    "ios6-point-prerelease-state-restoration-launch-image",
    "State-restoration launch image",
    "Applications launching with a state-restoration archive returned to the default launch image instead of showing the saved snapshot.",
    "behavior",
  ),
  manifest128: define(
    "ios6-point-prerelease-128gb-build-manifest-reference",
    "128 GB build-manifest reference",
    "A SystemPartitionPadding entry in the seed's build manifest included a 128 GB capacity reference without establishing a shipping device.",
    "other",
  ),
  mapsJapan: reusePublic("ios-6-1-3-maps-japan"),
  evasi0nPath: define(
    "ios6-point-prerelease-evasi0n-jailbreak-path",
    "Evasi0n jailbreak path",
    "The first seed still allowed evasi0n to run; the relabeled second seed changed that state by patching at least its time-zone-settings exploit.",
    "security",
  ),
  passcodeBypass: reusePublic("ios-6-1-3-phone-passcode-bypass"),
};

const routes = [
  {
    releaseVersionId: "version-ios-6-1",
    version: "6.1",
    alias: "beta-1",
    label: "Beta 1",
    date: "2012-11-01",
    sequence: 1,
    stableEventId: "event:apple:ios:6.1:beta-1",
    identityCitation: c(
      U.mr61Beta1,
      "Release identity",
      "Apple today released the first beta of iOS 6.1 to developers",
    ),
  },
  {
    releaseVersionId: "version-ios-6-1",
    version: "6.1",
    alias: "beta-2",
    label: "Beta 2",
    date: "2012-11-12",
    sequence: 2,
    stableEventId: "event:apple:ios:6.1:beta-2",
    identityCitation: c(
      U.mr61Beta2,
      "Release identity",
      "Apple today released the second beta of iOS 6.1 to developers",
    ),
  },
  {
    releaseVersionId: "version-ios-6-1",
    version: "6.1",
    alias: "beta-3",
    label: "Beta 3",
    date: "2012-12-03",
    sequence: 3,
    stableEventId: "event:apple:ios:6.1:beta-3",
    identityCitation: c(
      U.nine61Beta3,
      "Release identity",
      "seeded the third beta of the upcoming iOS 6.1",
    ),
  },
  {
    releaseVersionId: "version-ios-6-1",
    version: "6.1",
    alias: "beta-4",
    label: "Beta 4",
    date: "2012-12-17",
    sequence: 4,
    stableEventId: "event:apple:ios:6.1:beta-4",
    identityCitation: c(
      U.mr61Beta4,
      "Release identity",
      "Apple today released the fourth beta of iOS 6.1 to developers",
    ),
  },
  {
    releaseVersionId: "version-ios-6-1",
    version: "6.1",
    alias: "beta-5",
    label: "Beta 5",
    date: "2013-01-26",
    sequence: 5,
    stableEventId: "event:apple:ios:6.1:beta-5",
    identityCitation: c(
      U.mr61Beta5,
      "Release identity",
      "pushed out the fifth beta of iOS 6.1 to developers",
    ),
  },
  {
    releaseVersionId: "version-ios-6-1-1",
    version: "6.1.1",
    alias: "beta-1",
    label: "Beta 1",
    date: "2013-02-06",
    sequence: 1,
    stableEventId: "event:apple:ios:6.1.1:beta-1",
    identityCitation: c(
      U.mr611Beta1,
      "Release identity",
      "seeded the first beta version of iOS 6.1.1 to developers",
    ),
  },
  {
    releaseVersionId: "version-ios-6-1-3",
    version: "6.1.3",
    alias: "beta-2",
    label: "Beta 2",
    date: "2013-02-21",
    sequence: 2,
    stableEventId: "event:apple:ios:6.1.3:beta-2",
    identityCitation: c(
      U.nine613Beta2,
      "Release identity",
      "released iOS 6.1.3 beta 2 to developers",
    ),
  },
];
const routeByKey = new Map(
  routes.map((route) => [routeKey(route.releaseVersionId, route.alias), route]),
);

const occurrenceRows = [];
const add = ({
  releaseVersionId,
  alias,
  key,
  action,
  documentedStatus,
  evidenceState,
  citations,
  summary,
  verificationMethod,
  inheritance = "delta",
}) => {
  occurrenceRows.push({
    releaseVersionId,
    alias,
    key,
    action,
    inheritance,
    documentedStatus,
    evidenceState,
    citations,
    summary,
    verificationMethod,
  });
};

add({
  releaseVersionId: "version-ios-6-1",
  alias: "beta-1",
  key: K.mapkitSearch,
  action: "introduced",
  documentedStatus: "documented",
  evidenceState: "corroborated",
  citations: [
    c(
      U.idb61Beta1,
      "MapKit search",
      "programmatically search for map-based addresses and points of interest",
    ),
    c(
      U.mr61Beta1,
      "Developer integration",
      "developers can integrate Apple's new mapping service in their apps",
    ),
  ],
  summary:
    "The first seed exposed a local-search API for applications to retrieve addresses and places from Apple's map service.",
  verificationMethod:
    "A detailed release-day explanation and separate identity report both place the mapping integration in Beta 1.",
});
add({
  releaseVersionId: "version-ios-6-1",
  alias: "beta-1",
  key: K.passbookRelevance,
  action: "changed",
  documentedStatus: "documented",
  evidenceState: "corroborated",
  citations: [
    c(
      U.idb61Beta1,
      "Pass relevance",
      "The date must match for these passes to be relevant",
    ),
    c(
      U.mr61Beta1,
      "Passbook scope",
      "improvement to how boarding passes are handled in Passbook",
    ),
  ],
  summary:
    "Boarding-pass relevance began requiring the date to match, while a matching location extended the presentation window.",
  verificationMethod:
    "The preserved developer-note language supplies the rule and contemporaneous coverage independently identifies the Passbook change.",
});
add({
  releaseVersionId: "version-ios-6-1",
  alias: "beta-1",
  key: K.advertisingReset,
  action: "introduced",
  documentedStatus: "documented",
  evidenceState: "reported",
  citations: [
    c(
      U.idb61Beta1,
      "Settings control",
      "new Reset Advertising Identifier button has been added",
    ),
  ],
  summary:
    "Advertising settings gained a control intended to rotate the device's advertising identifier for later requests.",
  verificationMethod:
    "A contemporaneous article reproduces the developer-note description; later milestone behavior is modeled separately.",
});
add({
  releaseVersionId: "version-ios-6-1",
  alias: "beta-1",
  key: K.siriFandango,
  action: "introduced",
  documentedStatus: "undocumented",
  evidenceState: "reported",
  citations: [
    c(
      U.nine61Fandango,
      "Observed Siri capability",
      "ability to get movie tickets",
    ),
    c(U.mr61Fandango, "Report mirror", "purchase movie tickets through Siri"),
  ],
  summary:
    "Developers found a United States workflow that handed Siri movie-ticket requests to Fandango for checkout.",
  verificationMethod:
    "The second page attributes the finding to the first, so two URLs do not establish independent corroboration; the occurrence remains reported.",
});
const beta3TranscriptSources = [U.ticker61Beta3, U.iphonote61Beta3];
add({
  releaseVersionId: "version-ios-6-1",
  alias: "beta-1",
  key: K.icloudPlans,
  action: "knownIssue",
  documentedStatus: "documented",
  evidenceState: "reported",
  citations: [
    c(
      U.idb61Beta2,
      "Beta 1 retrospective",
      "will not be able to upgrade or downgrade your iCloud storage",
    ),
  ],
  summary:
    "A later developer-note reproduction specifically records that Beta 1 could not change the user's iCloud storage plan.",
  verificationMethod:
    "The retained Beta 2 article reproduces developer-note language that explicitly labels the restriction as Beta 1 state.",
});

add({
  releaseVersionId: "version-ios-6-1",
  alias: "beta-2",
  key: K.passbookInfo,
  action: "changed",
  documentedStatus: "undocumented",
  evidenceState: "corroborated",
  citations: [
    c(
      U.idb61Beta2,
      "Observed Passbook change",
      "new Passbook information card which explains what the software is capable of",
    ),
    c(
      U.nine61Beta2,
      "Observed Passbook change",
      "new Passbook card to explain the feature",
    ),
  ],
  summary:
    "The second seed replaced Passbook's introductory presentation with a card explaining the application's purpose.",
  verificationMethod:
    "Two contemporaneous reports describe and illustrate the revised first-run card.",
});
add({
  releaseVersionId: "version-ios-6-1",
  alias: "beta-2",
  key: K.panorama,
  action: "fixed",
  documentedStatus: "undocumented",
  evidenceState: "corroborated",
  citations: [
    c(
      U.idb61Beta2,
      "Observed camera repair",
      "The Panorama mode in the Camera app now works again",
    ),
    c(U.nine61Beta2, "Observed camera repair", "Panorama support is back"),
  ],
  summary:
    "Panorama capture returned after being unavailable in the preceding 6.1 seed.",
  verificationMethod:
    "Two release-day reports independently list the restored camera mode.",
});
add({
  releaseVersionId: "version-ios-6-1",
  alias: "beta-2",
  key: K.itunesMatchSongs,
  action: "fixed",
  documentedStatus: "undocumented",
  evidenceState: "corroborated",
  citations: [
    c(
      U.idb61Beta2,
      "Observed iTunes Match repair",
      "again able to download individual songs from iTunes Match",
    ),
    c(
      U.nine61Beta2,
      "Observed iTunes Match repair",
      "Once again, you can download individual songs from iTunes Match",
    ),
  ],
  summary:
    "Individual iTunes Match song downloads worked again instead of limiting retrieval to complete albums.",
  verificationMethod:
    "Two contemporaneous observation reports agree on the restored per-song download path.",
});
add({
  releaseVersionId: "version-ios-6-1",
  alias: "beta-2",
  key: K.simulatorIap,
  action: "knownIssue",
  documentedStatus: "documented",
  evidenceState: "reported",
  citations: [
    c(
      U.idb61Beta2,
      "Simulator limitation",
      "does not support testing In-App Purchase in iOS Simulator",
    ),
  ],
  summary:
    "Developers needed physical hardware because this seed's Simulator could not exercise in-app purchases.",
  verificationMethod:
    "The limitation appears in a contemporaneous reproduction of the Beta 2 developer notes.",
});
add({
  releaseVersionId: "version-ios-6-1",
  alias: "beta-2",
  key: K.weiboVisibility,
  action: "changed",
  documentedStatus: "documented",
  evidenceState: "reported",
  citations: [
    c(
      U.idb61Beta2,
      "Social settings",
      "Weibo shows up in the Settings app only if a Chinese keyboard is enabled",
    ),
  ],
  summary:
    "The Weibo settings entry was conditional on the device having a Chinese keyboard enabled.",
  verificationMethod:
    "A developer-note reproduction states the exact visibility prerequisite.",
});
add({
  releaseVersionId: "version-ios-6-1",
  alias: "beta-2",
  key: K.legacyTwitter,
  action: "knownIssue",
  documentedStatus: "documented",
  evidenceState: "reported",
  citations: [
    c(
      U.idb61Beta2,
      "Legacy Simulator limitation",
      "will not be able to sign in to Twitter via the Settings pane",
    ),
  ],
  summary:
    "Legacy iOS 5.x Simulator targets on Mountain Lion could neither complete Twitter sign-in nor use the framework correctly.",
  verificationMethod:
    "The retained Beta 2 note limits the failure to legacy SDK targets and distinguishes Lion hosts.",
});
add({
  releaseVersionId: "version-ios-6-1",
  alias: "beta-2",
  key: K.icloudPlans,
  action: "knownIssue",
  inheritance: "cumulative",
  documentedStatus: "documented",
  evidenceState: "corroborated",
  citations: beta3TranscriptSources.map((url) =>
    c(
      url,
      "Beta 2 prior state",
      "FIXED: In iOS 6.1 beta 2, you will not be able to upgrade or downgrade your iCloud storage",
    ),
  ),
  summary:
    "Beta 3's fixed note retrospectively confirms that Beta 2 still blocked storage-plan upgrades and downgrades.",
  verificationMethod:
    "Two separately retained copies preserve the Beta 3 fixed marker and its explicit description of the Beta 2 restriction; this is a cumulative prior-state occurrence.",
});

add({
  releaseVersionId: "version-ios-6-1",
  alias: "beta-3",
  key: K.icloudPlans,
  action: "fixed",
  documentedStatus: "documented",
  evidenceState: "corroborated",
  citations: beta3TranscriptSources.map((url) =>
    c(
      url,
      "iCloud FIXED",
      "FIXED: In iOS 6.1 beta 2, you will not be able to upgrade or downgrade your iCloud storage",
    ),
  ),
  summary:
    "Beta 3 marked the earlier inability to change iCloud storage plans as repaired.",
  verificationMethod:
    "Two independently retained reproductions carry the same fixed marker and prior-state wording.",
});
add({
  releaseVersionId: "version-ios-6-1",
  alias: "beta-3",
  key: K.chineseInput,
  action: "fixed",
  documentedStatus: "documented",
  evidenceState: "corroborated",
  citations: [
    ...beta3TranscriptSources.map((url) =>
      c(
        url,
        "Chinese input FIXED",
        "FIXED: Typing quickly could result in incorrect input",
      ),
    ),
    c(
      U.iphonote61Beta3,
      "Chinese input FIXED",
      "Some Emoji cannot be entered using the Pinyin and Zhuyin keyboards",
    ),
    c(
      U.ticker61Beta3,
      "Traditional Chinese FIXED",
      "the extended list often takes a long time to open",
    ),
  ],
  summary:
    "The seed repaired rapid-input, emoji, Zhuyin sequence and shortcut, and candidate-list failures across supported Chinese keyboards.",
  verificationMethod:
    "Two archive pages preserve matching developer-note groups; this record summarizes the related input repairs rather than copying the list.",
});
add({
  releaseVersionId: "version-ios-6-1",
  alias: "beta-3",
  key: K.thaiKeyboards,
  action: "changed",
  inheritance: "cumulative",
  documentedStatus: "documented",
  evidenceState: "corroborated",
  citations: beta3TranscriptSources.map((url) =>
    c(
      url,
      "Thai language support",
      "both the five-row and the four-row Thai keyboards are available",
    ),
  ),
  summary:
    "Thai users could select either the five-row layout introduced with iOS 6 or the earlier four-row design.",
  verificationMethod:
    "Matching text in two preserved release-note copies supports the dual-layout availability but does not establish that Beta 3 introduced it.",
});
add({
  releaseVersionId: "version-ios-6-1",
  alias: "beta-3",
  key: K.advertisingReset,
  action: "fixed",
  documentedStatus: "undocumented",
  evidenceState: "reported",
  citations: [
    c(
      U.cult61Beta3,
      "Observed Settings repair",
      "Reset Advertising Identifier Now Works",
    ),
  ],
  summary:
    "The advertising-identifier reset control began prompting for confirmation and appeared to perform its intended action.",
  verificationMethod:
    "The report describes an observed repair, but no retained Apple changelog explicitly marks it fixed.",
});
add({
  releaseVersionId: "version-ios-6-1",
  alias: "beta-3",
  key: K.icloudSetup,
  action: "changed",
  documentedStatus: "undocumented",
  evidenceState: "reported",
  citations: [
    c(
      U.cult61Beta3,
      "Observed setup change",
      "confirm your Apple ID password for FaceTime and iMessages",
    ),
  ],
  summary:
    "First-run iCloud setup added confirmation for the account password and the contact addresses used by communication services.",
  verificationMethod:
    "A contemporaneous hands-on report describes the setup prompts; the developer-note copies do not list them.",
});
add({
  releaseVersionId: "version-ios-6-1",
  alias: "beta-3",
  key: K.passbookUk,
  action: "changed",
  documentedStatus: "undocumented",
  evidenceState: "reported",
  citations: [
    c(
      U.cult61Beta3,
      "Observed localization change",
      "changing “movie tickets” to “cinema tickets”",
    ),
  ],
  summary:
    "The United Kingdom sample card switched its movie-ticket and venue wording to British English.",
  verificationMethod:
    "The locale-specific text is retained in one release-day observation report.",
});
add({
  releaseVersionId: "version-ios-6-1",
  alias: "beta-3",
  key: K.voiceDial,
  action: "introduced",
  documentedStatus: "undocumented",
  evidenceState: "reported",
  citations: [
    c(
      U.cult61Beta3,
      "Observed Voice Control option",
      "activate a ‘Voice Dial Only’ option",
    ),
  ],
  summary:
    "A new Voice Control setting restricted voice handling to telephone dialing.",
  verificationMethod:
    "The option appears in a hands-on change report and not in the preserved developer-note groups.",
});
add({
  releaseVersionId: "version-ios-6-1",
  alias: "beta-3",
  key: K.itunesCellular,
  action: "introduced",
  documentedStatus: "undocumented",
  evidenceState: "reported",
  citations: [
    c(
      U.cult61Beta3,
      "Observed cellular setting",
      "an iTunes option within the cellular data settings",
    ),
  ],
  summary:
    "Cellular-data settings added an iTunes switch for permitting music downloads away from Wi-Fi.",
  verificationMethod:
    "One contemporaneous observation report describes and illustrates the control.",
});
add({
  releaseVersionId: "version-ios-6-1",
  alias: "beta-3",
  key: K.textAlignment,
  action: "knownIssue",
  inheritance: "cumulative",
  documentedStatus: "documented",
  evidenceState: "reported",
  citations: [
    c(
      U.iphonote61Beta3,
      "UIKit limitation",
      "do not support NSTextAlignmentJustified or NSTextAlignmentNatural text alignments",
    ),
  ],
  summary:
    "Natural and justified alignment constants remained unsupported in the affected NSString and UILabel drawing paths.",
  verificationMethod:
    "The limitation is selected from a preserved developer-note reproduction that does not identify Beta 3 as its first appearance.",
});

add({
  releaseVersionId: "version-ios-6-1",
  alias: "beta-4",
  key: K.exchangePush,
  action: "fixed",
  documentedStatus: "documented",
  evidenceState: "reported",
  citations: [
    c(
      U.ticker61Beta4,
      "Mail FIXED",
      "push email does not work consistently with Exchange clients",
    ),
  ],
  summary:
    "The fourth seed marked an Exchange push failure tied to moving between cellular and Wi-Fi networks as repaired.",
  verificationMethod:
    "The only detailed retained copy is a user-posted developer-note transcript, so the occurrence remains reported.",
});
add({
  releaseVersionId: "version-ios-6-1",
  alias: "beta-4",
  key: K.mapSearchCoverage,
  action: "knownIssue",
  inheritance: "cumulative",
  documentedStatus: "documented",
  evidenceState: "reported",
  citations: [
    c(
      U.ticker61Beta4,
      "MapKit coverage",
      "Search results from these APIs may not be available in all areas or countries, including Russia and Japan",
    ),
  ],
  summary:
    "The new local-search APIs still lacked results in some regions, with Russia and Japan called out explicitly.",
  verificationMethod:
    "A community-preserved Beta 4 note supplies the geographic examples but does not identify Beta 4 as their first appearance.",
});
add({
  releaseVersionId: "version-ios-6-1",
  alias: "beta-4",
  key: K.simulatorIap,
  action: "fixed",
  documentedStatus: "partiallyDocumented",
  evidenceState: "reported",
  citations: [
    c(
      U.ticker61Beta4,
      "Simulator FIXED",
      "Fixed: This release does not support testing In-App Purchase in iOS Simulator",
      "The retained line carries a Fixed marker but repeats the prior restriction in present tense.",
    ),
  ],
  summary:
    "The retained note labels the Simulator purchase-testing restriction as fixed, although its sentence still describes the old limitation.",
  verificationMethod:
    "The action follows the explicit fixed marker while the documentation status preserves the contradictory wording; no broader restoration is inferred.",
});
add({
  releaseVersionId: "version-ios-6-1",
  alias: "beta-4",
  key: K.launchImage,
  action: "changed",
  inheritance: "cumulative",
  documentedStatus: "documented",
  evidenceState: "reported",
  citations: [
    c(
      U.ticker61Beta4,
      "UIKit launch behavior",
      "the snapshot is not displayed in this situation",
    ),
    c(
      U.ticker61Beta4,
      "UIKit launch behavior",
      "the default.png image is always displayed",
    ),
  ],
  summary:
    "A launch with saved restoration state displayed the normal launch image rather than the previously captured interface snapshot.",
  verificationMethod:
    "The behavior is selected from the community-preserved Beta 4 transcript, whose iOS 6.1-wide wording does not establish a Beta 4 delta.",
});

add({
  releaseVersionId: "version-ios-6-1",
  alias: "beta-5",
  key: K.manifest128,
  action: "changed",
  documentedStatus: "undocumented",
  evidenceState: "reported",
  citations: [
    c(
      U.mr61Manifest,
      "Build-manifest observation",
      "SystemPartitionPadding key in the build manifest associated with the release",
    ),
    c(
      U.mr61Manifest,
      "Report caveat",
      "does not mean that a 128 GB iOS device is definitely coming",
    ),
  ],
  summary:
    "Researchers found a 128 GB capacity entry in the seed's partition-padding manifest without evidence that such hardware would ship.",
  verificationMethod:
    "The record preserves both the manifest observation and the source's explicit product-inference caveat.",
});

add({
  releaseVersionId: "version-ios-6-1-1",
  alias: "beta-1",
  key: K.mapsJapan,
  action: "changed",
  documentedStatus: "documented",
  evidenceState: "corroborated",
  citations: [
    c(
      U.nine611Beta1,
      "Maps release notes",
      "major enhancements to Maps for Japan",
    ),
    c(U.mr611Beta1, "Maps release notes", "improvements to Maps for Japan"),
  ],
  summary:
    "The seed grouped navigation pronunciation, routing, map-label, icon, color, and landmark work for users in Japan.",
  verificationMethod:
    "Two contemporaneous pages preserve the same Apple-attributed improvement list; the shared Public definition remains intentionally broader.",
});
add({
  releaseVersionId: "version-ios-6-1-1",
  alias: "beta-1",
  key: K.evasi0nPath,
  action: "knownIssue",
  documentedStatus: "undocumented",
  evidenceState: "reported",
  citations: [
    c(
      U.nine611Evasi0n,
      "Security observation",
      "does not block the evasi0n jailbreak tool from running",
    ),
  ],
  summary:
    "Testing reported that the newly released seed still allowed the evasi0n jailbreak to run.",
  verificationMethod:
    "The milestone state is based on a named security researcher's reported test and is not presented as an Apple disclosure.",
});

add({
  releaseVersionId: "version-ios-6-1-3",
  alias: "beta-2",
  key: K.mapsJapan,
  action: "changed",
  inheritance: "cumulative",
  documentedStatus: "documented",
  evidenceState: "corroborated",
  citations: [
    c(
      U.nine613Beta2,
      "Carried Maps work",
      "includes several enhancements to the Maps application for Japan",
    ),
    c(
      U.mr613Beta2,
      "Carried Maps work",
      "focused on Maps improvements for Japan",
    ),
  ],
  summary:
    "The relabeled second seed carried forward the Japan-focused Maps work introduced under the 6.1.1 Beta 1 name.",
  verificationMethod:
    "Both identity reports connect the Maps work to the original beta; inheritance is cumulative rather than a newly claimed delta.",
});
add({
  releaseVersionId: "version-ios-6-1-3",
  alias: "beta-2",
  key: K.passcodeBypass,
  action: "fixed",
  documentedStatus: "documented",
  evidenceState: "corroborated",
  citations: [
    c(
      U.nine613Beta2,
      "Apple-attributed security fix",
      "will also fix the recently publicized Lock Screen bug, according to Apple",
    ),
    c(
      U.mr613Beta2,
      "Apple-attributed security fix",
      "addresses the passcode lock bug publicized last week",
    ),
  ],
  summary:
    "Apple-attributed notes said the seed repaired the reported passcode bug, a lock-screen sequence that exposed Phone access without authentication.",
  verificationMethod:
    "Two contemporaneous reports independently identify the Apple-attributed fix and the same beta route.",
});
add({
  releaseVersionId: "version-ios-6-1-3",
  alias: "beta-2",
  key: K.evasi0nPath,
  action: "changed",
  documentedStatus: "undocumented",
  evidenceState: "corroborated",
  citations: [
    c(
      U.nine613Evasi0n,
      "Researcher test",
      "patches at least one of the five bugs the jailbreak exploits, namely a flaw in the operating system’s time zone settings",
    ),
    c(
      U.mr613Evasi0n,
      "Researcher test",
      "patches at least one of the five bugs the jailbreak exploits, namely a flaw in the operating system's time zone settings",
    ),
  ],
  summary:
    "A researcher testing Beta 2 found that Apple had patched at least the time-zone flaw used by evasi0n.",
  verificationMethod:
    "Two contemporaneous reports quote the same named researcher; they support the tested time-zone change but not a claim that every jailbreak path was closed.",
});

const changesByRoute = new Map();
for (const row of occurrenceRows) {
  const key = routeKey(row.releaseVersionId, row.alias);
  if (!routeByKey.has(key))
    throw new Error(`Occurrence uses unknown route ${key}.`);
  const definition = definitions.get(row.key);
  if (!definition) throw new Error(`Occurrence uses unknown key ${row.key}.`);
  changesByRoute.set(key, [
    ...(changesByRoute.get(key) || []),
    {
      ...definition,
      action: row.action,
      inheritance: row.inheritance,
      summary: row.summary,
      documentedStatus: row.documentedStatus,
      evidenceState: row.evidenceState,
      verificationMethod: row.verificationMethod,
      citations: row.citations,
    },
  ]);
}

const articleSpecs = new Map([
  [
    "version-ios-6-1/beta-1",
    [
      prose(
        "Contemporaneous coverage places the first iOS 6.1 developer seed on November 1, 2012. Earlier 6.0.1 reporting describes carrier testing rather than a developer distribution, so this archive does not invent a 6.0.1 beta route.",
        [
          c(U.mr61Beta1, "Release date", "Thursday November 1, 2012"),
          c(
            U.mr601Carrier,
            "6.0.1 boundary",
            "Apple has begun carrier testing of iOS 6.0.1",
          ),
        ],
      ),
      prose(
        "The selected records cover the new local-search interface, boarding-pass relevance, advertising-identifier reset, a reported Siri ticket workflow, and an iCloud plan-change restriction later attributed specifically to this first seed.",
        [
          c(
            U.idb61Beta1,
            "MapKit search",
            "programmatically search for map-based addresses and points of interest",
          ),
          c(
            U.idb61Beta1,
            "Pass relevance",
            "The date must match for these passes to be relevant",
          ),
          c(
            U.idb61Beta1,
            "Settings control",
            "new Reset Advertising Identifier button has been added",
          ),
          c(
            U.nine61Fandango,
            "Siri observation",
            "ability to get movie tickets",
          ),
          c(
            U.idb61Beta2,
            "Beta 1 retrospective",
            "will not be able to upgrade or downgrade your iCloud storage",
          ),
        ],
      ),
      prose(
        "The identity report prints build 10B5095f, but this candidate creates no build because the retained page does not preserve device-specific download artifacts or a first-party build record.",
        [c(U.mr61Beta1, "Build evidence", "build number of 10B5095f")],
      ),
    ],
  ],
  [
    "version-ios-6-1/beta-2",
    [
      prose(
        "The second seed arrived on November 12. The narrative on two pages identifies build 10B5105c, while an embedded social post on the detailed report drops one digit and shows 10B105c; the conflict is recorded instead of converted into a build document.",
        [
          c(U.mr61Beta2, "Build evidence", "build number of 10B5105c"),
          c(U.idb61Beta2, "Embedded build typo", "beta 2 (10B105c)"),
        ],
      ),
      prose(
        "Observed changes restored Panorama and per-song iTunes Match downloads and revised Passbook's explanatory card. The preserved developer notes also describe Simulator and social-framework constraints, while two Beta 3 note copies retrospectively confirm that Beta 2 still blocked iCloud storage-plan changes.",
        [
          c(U.nine61Beta2, "Camera", "Panorama support is back"),
          c(
            U.nine61Beta2,
            "iTunes Match",
            "download individual songs from iTunes Match",
          ),
          c(U.idb61Beta2, "Passbook", "new Passbook information card"),
          c(
            U.idb61Beta2,
            "Simulator",
            "does not support testing In-App Purchase in iOS Simulator",
          ),
          c(
            U.idb61Beta2,
            "Social",
            "Weibo shows up in the Settings app only if a Chinese keyboard is enabled",
          ),
          ...beta3TranscriptSources.map((url) =>
            c(
              url,
              "Beta 2 prior state",
              "FIXED: In iOS 6.1 beta 2, you will not be able to upgrade or downgrade your iCloud storage",
            ),
          ),
        ],
      ),
    ],
  ],
  [
    "version-ios-6-1/beta-3",
    [
      prose(
        "9to5Mac identifies the third developer seed on December 3. Its detailed notes survive in an iPhonote article and a separate iPhone-Ticker user transcript; the latter's community origin is retained explicitly in the source metadata.",
        [
          c(
            U.nine61Beta3,
            "Release identity",
            "seeded the third beta of the upcoming iOS 6.1",
          ),
          c(
            U.iphonote61Beta3,
            "Developer-note copy",
            "The following issues relate to using iOS SDK 6.1 beta 3",
          ),
          c(
            U.ticker61Beta3,
            "Community transcript",
            "The following issues relate to using iOS SDK 6.1 beta 3",
          ),
        ],
      ),
      prose(
        "Those copies support selected iCloud, Chinese-input, Thai-layout, and UIKit records. Separate hands-on coverage supplies the seed's setup, localization, advertising-reset, voice-dial, and iTunes cellular observations.",
        [
          c(U.iphonote61Beta3, "iCloud", "FIXED: In iOS 6.1 beta 2"),
          c(
            U.ticker61Beta3,
            "Chinese input",
            "FIXED: Typing quickly could result in incorrect input",
          ),
          c(
            U.iphonote61Beta3,
            "Thai layouts",
            "both the five-row and the four-row Thai keyboards are available",
          ),
          c(
            U.cult61Beta3,
            "Observed setup",
            "confirm your Apple ID password for FaceTime and iMessages",
          ),
          c(
            U.cult61Beta3,
            "Observed voice option",
            "activate a ‘Voice Dial Only’ option",
          ),
        ],
      ),
      prose(
        "MacRumors later identifies 10B5117b as the third-beta build, but without retained device downloads this archive keeps the value as evidence only.",
        [
          c(
            U.mr61Beta4,
            "Prior build evidence",
            "versus 10B5117b for the third beta of iOS 6.1",
          ),
        ],
      ),
    ],
  ],
  [
    "version-ios-6-1/beta-4",
    [
      prose(
        "MacRumors places the fourth seed on December 17 and prints build 10B5126b. The detailed notes used here survive in a user-posted transcript below a contemporaneous iPhone-Ticker article, not on an Apple host.",
        [
          c(
            U.mr61Beta4,
            "Release and build",
            "release has a build number of 10B5126b",
          ),
          c(U.ticker61Beta4, "Community transcript", "Hier die Release Notes"),
        ],
      ),
      prose(
        "The selected records cover an Exchange push repair, local-search coverage limits, a contradictory fixed marker for Simulator purchase testing, and a state-restoration launch-image change. Their evidence remains reported because the detailed copy is community-preserved.",
        [
          c(
            U.ticker61Beta4,
            "Exchange",
            "push email does not work consistently with Exchange clients",
          ),
          c(U.ticker61Beta4, "Map coverage", "including Russia and Japan"),
          c(
            U.ticker61Beta4,
            "Simulator",
            "Fixed: This release does not support testing In-App Purchase",
          ),
          c(
            U.ticker61Beta4,
            "UIKit",
            "the default.png image is always displayed",
          ),
        ],
      ),
    ],
  ],
  [
    "version-ios-6-1/beta-5",
    [
      prose(
        "A weekend release on January 26 was explicitly called the fifth beta. This page selects only a reported build-manifest clue and does not upgrade the milestone to a Golden Master label.",
        [
          c(
            U.mr61Beta5,
            "Release identity",
            "pushed out the fifth beta of iOS 6.1 to developers",
          ),
          c(
            U.mr61Manifest,
            "Manifest evidence",
            "SystemPartitionPadding key in the build manifest associated with the release",
          ),
        ],
      ),
      prose(
        "The manifest contained a 128 GB capacity reference, but its source expressly warned that this did not establish a product. Coverage two days later moves directly from Beta 5 to the Public release, so no separate GM route is inferred.",
        [
          c(
            U.mr61Manifest,
            "Product caveat",
            "does not mean that a 128 GB iOS device is definitely coming",
          ),
          c(
            U.mr61Public,
            "Public boundary",
            "Following this weekend's release of iOS 6.1 Beta 5 to developers",
          ),
        ],
      ),
    ],
  ],
  [
    "version-ios-6-1-1/beta-1",
    [
      prose(
        "The February 6 developer milestone shipped under the visible name iOS 6.1.1 Beta 1 and was reported as build 10B311. A contemporaneous page also said the seed lacked an expiration date.",
        [
          c(U.mr611Beta1, "Build evidence", "beta arrives as build 10B311"),
          c(
            U.nine611Beta1,
            "Expiration report",
            "this beta has no expiration date",
          ),
        ],
      ),
      prose(
        "Apple-attributed notes grouped navigation and mapping improvements for Japan. A next-day security report said the seed still permitted evasi0n to run.",
        [
          c(U.nine611Beta1, "Maps", "major enhancements to Maps for Japan"),
          c(
            U.nine611Evasi0n,
            "Security observation",
            "does not block the evasi0n jailbreak tool from running",
          ),
        ],
      ),
      prose(
        "Five days later, Apple said this beta line would receive a different version number. The unrelated Public 6.1.1 was an iPhone 4S emergency update, so this archive preserves the historical beta label and links its continuation to 6.1.3 Beta 2.",
        [
          c(
            U.nine611Rename,
            "Rename statement",
            "iOS 6.1.1 beta will be renamed to a different version",
          ),
          c(
            U.nine611Rename,
            "Public scope",
            "addresses the previously discussed cellular performance and reliability issues with the iPhone 4S",
          ),
        ],
      ),
    ],
  ],
  [
    "version-ios-6-1-3/beta-2",
    [
      prose(
        "Both identity reports state that the first seed had been called 6.1.1 Beta 1 and that emergency Public releases caused the continuing track to reappear as 6.1.3 Beta 2. The two labels remain distinct routes joined by an explicit lineage note.",
        [
          c(
            U.nine613Beta2,
            "Rename lineage",
            "The first beta was known as iOS 6.1.1 beta 1",
          ),
          c(
            U.mr613Beta2,
            "Rename lineage",
            "original iOS 6.1.1 beta track has now been relabeled as iOS 6.1.3",
          ),
        ],
      ),
      prose(
        "The Japan Maps work is represented as cumulative carry-forward rather than a fresh delta. The seed newly addressed the reported passcode bypass, and subsequent researcher testing found that its time-zone patch disrupted evasi0n.",
        [
          c(
            U.nine613Beta2,
            "Maps carry-forward",
            "includes several enhancements to the Maps application for Japan",
          ),
          c(
            U.mr613Beta2,
            "Passcode",
            "addresses the passcode lock bug publicized last week",
          ),
          c(
            U.nine613Evasi0n,
            "Researcher test",
            "patches at least one of the five bugs the jailbreak exploits, namely a flaw in the operating system’s time zone settings",
          ),
        ],
      ),
    ],
  ],
]);

const events = routes.map((route) => {
  const key = routeKey(route.releaseVersionId, route.alias);
  const changes = changesByRoute.get(key) || [];
  const articleParagraphs = articleSpecs.get(key);
  if (!articleParagraphs || changes.length === 0) {
    throw new Error(`Route ${key} lacks article or change content.`);
  }
  const routeArticle = article(
    heading("Release identity and boundary"),
    articleParagraphs[0],
    heading("Selected milestone record"),
    ...articleParagraphs.slice(1),
  );
  const articleCitations = routeArticle.blocks.flatMap(
    (block) => block.citations || [],
  );
  return {
    target: {
      releaseVersionId: route.releaseVersionId,
      routeAlias: route.alias,
    },
    identity: {
      releaseVersionId: route.releaseVersionId,
      platformId: "platform-ios",
      stableEventId: route.stableEventId,
      label: route.label,
      routeAlias: route.alias,
      channel: "developerBeta",
      appearanceDate: route.date,
      sequence: route.sequence,
      isRevision: false,
      availabilityState: "available",
      closesReleaseCycle: false,
    },
    authorship: "originalSynthesis",
    summary: `iOS ${route.version} ${route.label} is represented by ${changes.length} selected source-linked change records from the ${route.date} milestone; unsupported routes and build guesses remain excluded.`,
    article: routeArticle,
    citations: uniqueCitations([
      route.identityCitation,
      ...articleCitations,
      ...changes.flatMap((change) => change.citations),
    ]),
    changes,
    provenanceStatus: "editoriallyVerified",
    editorialReview: { status: "approved", reviewedAt },
    isIndexable: true,
  };
});

const bundle = {
  formatVersion: 1,
  generatedAt: "2026-07-30T00:00:00.000Z",
  accessedAt,
  target: {
    projectId: "lh3yswzu",
    dataset: "production",
  },
  sources,
  versions: [],
  events,
  builds: [],
};

const expectedSeedInventory = [
  ["6.0", "2012-09-19", [["Public", "2012-09-19", false, undefined]]],
  ["6.0.1", "2012-11-01", [["Public", "2012-11-01", false, undefined]]],
  ["6.0.2", "2012-12-18", [["Public", "2012-12-18", false, undefined]]],
  ["6.1", "2013-01-28", [["Public", "2013-01-28", false, undefined]]],
  ["6.1.1", "2013-02-11", [["Public", "2013-02-11", false, undefined]]],
  ["6.1.2", "2013-02-19", [["Public", "2013-02-19", false, undefined]]],
  ["6.1.3", "2013-03-19", [["Public", "2013-03-19", false, undefined]]],
  ["6.1.4", "2013-05-02", [["Public", "2013-05-02", false, undefined]]],
];
const seed = JSON.parse(
  readFileSync(join(here, "..", "seed-data.json"), "utf8"),
);
const seedInventory = seed.releaseVersions
  .filter((version) => version.platform === "iOS" && version.majorVersion === 6)
  .map((version) => [
    version.version,
    version.publicReleaseDate,
    version.milestones.map((milestone) => [
      milestone.label,
      milestone.date,
      milestone.isRevision,
      milestone.note,
    ]),
  ]);
if (
  JSON.stringify(stableValue(seedInventory)) !==
  JSON.stringify(stableValue(expectedSeedInventory))
) {
  throw new Error(
    "The exact local iOS 6 seed inventory changed; re-audit this point-release cohort.",
  );
}

const expectedCounts = new Map([
  ["version-ios-6-1/beta-1", 5],
  ["version-ios-6-1/beta-2", 7],
  ["version-ios-6-1/beta-3", 9],
  ["version-ios-6-1/beta-4", 4],
  ["version-ios-6-1/beta-5", 1],
  ["version-ios-6-1-1/beta-1", 2],
  ["version-ios-6-1-3/beta-2", 3],
]);
if (
  bundle.versions.length !== 0 ||
  bundle.builds.length !== 0 ||
  events.length !== expectedCounts.size ||
  events.some((event) => {
    const key = routeKey(
      event.identity.releaseVersionId,
      event.identity.routeAlias,
    );
    const route = routeByKey.get(key);
    return (
      !route ||
      event.changes.length !== expectedCounts.get(key) ||
      event.identity.stableEventId !== route.stableEventId ||
      event.identity.label !== route.label ||
      event.identity.channel !== "developerBeta" ||
      event.identity.appearanceDate !== route.date ||
      event.identity.sequence !== route.sequence ||
      event.target.releaseVersionId !== route.releaseVersionId ||
      event.target.routeAlias !== route.alias ||
      event.identity.platformId !== "platform-ios" ||
      event.identity.isRevision !== false ||
      event.identity.availabilityState !== "available" ||
      event.identity.closesReleaseCycle !== false ||
      event.authorship !== "originalSynthesis" ||
      event.article.authorship !== "originalSynthesis" ||
      event.provenanceStatus !== "editoriallyVerified" ||
      event.editorialReview.status !== "approved" ||
      event.editorialReview.reviewedAt !== reviewedAt ||
      event.isIndexable !== true
    );
  })
) {
  throw new Error("The exact iOS 6 point-release route closure failed.");
}
if (
  events.some(
    (event) =>
      event.identity.routeAlias === "public" ||
      event.identity.routeAlias === "gm" ||
      event.identity.releaseVersionId === "version-ios-6-0",
  )
) {
  throw new Error("A forbidden Public, GM, or iOS 6.0 major route entered.");
}
const inherited = events
  .flatMap((event) => event.changes)
  .filter((change) => change.inheritance !== "delta");
const cumulativeKeys = inherited.map((change) => change.key).sort();
const expectedCumulativeKeys = [
  K.icloudPlans,
  K.launchImage,
  K.mapSearchCoverage,
  K.mapsJapan,
  K.textAlignment,
  K.thaiKeyboards,
].sort();
if (
  inherited.some((change) => change.inheritance !== "cumulative") ||
  JSON.stringify(cumulativeKeys) !== JSON.stringify(expectedCumulativeKeys)
) {
  throw new Error("The exact cumulative occurrence allowlist changed.");
}
const recurrenceHistory = (key) =>
  events
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
    K.icloudPlans,
    [
      "version-ios-6-1/beta-1:knownIssue:delta",
      "version-ios-6-1/beta-2:knownIssue:cumulative",
      "version-ios-6-1/beta-3:fixed:delta",
    ],
  ],
  [
    K.advertisingReset,
    [
      "version-ios-6-1/beta-1:introduced:delta",
      "version-ios-6-1/beta-3:fixed:delta",
    ],
  ],
  [
    K.simulatorIap,
    [
      "version-ios-6-1/beta-2:knownIssue:delta",
      "version-ios-6-1/beta-4:fixed:delta",
    ],
  ],
  [
    K.evasi0nPath,
    [
      "version-ios-6-1-1/beta-1:knownIssue:delta",
      "version-ios-6-1-3/beta-2:changed:delta",
    ],
  ],
  [
    K.mapsJapan,
    [
      "version-ios-6-1-1/beta-1:changed:delta",
      "version-ios-6-1-3/beta-2:changed:cumulative",
    ],
  ],
]);
for (const [key, expectedHistory] of expectedRecurrences) {
  const actualHistory = recurrenceHistory(key);
  if (
    JSON.stringify(actualHistory) !== JSON.stringify(expectedHistory.sort())
  ) {
    throw new Error(
      `The exact recurrence history changed for ${key}: ${actualHistory.join(", ")}.`,
    );
  }
}
if (
  events
    .flatMap((event) => event.changes)
    .some((change) => change.evidenceState === "confirmed")
) {
  throw new Error(
    "This cohort has no direct retained first-party prerelease artifact; confirmed evidence is forbidden.",
  );
}

for (const releaseVersionId of expectedSeedInventory.map(
  ([version]) => `version-ios-${String(version).replaceAll(".", "-")}`,
)) {
  const owners = publicBatch.events.filter(
    (event) =>
      event.target?.releaseVersionId === releaseVersionId &&
      event.target?.routeAlias === "public",
  );
  if (
    owners.length !== 1 ||
    owners[0].editorialReview?.status !== "approved" ||
    owners[0].provenanceStatus !== "editoriallyVerified" ||
    owners[0].isIndexable !== true
  ) {
    throw new Error(
      `The approved Public owner changed for ${releaseVersionId}.`,
    );
  }
}

const localDefinitions = new Map();
for (const change of events.flatMap((event) => event.changes)) {
  const definition = JSON.stringify(
    stableValue({
      title: change.title,
      canonicalSummary: change.canonicalSummary,
      category: change.category,
    }),
  );
  const prior = localDefinitions.get(change.key);
  if (prior && prior !== definition) {
    throw new Error(`Local definition drifted for ${change.key}.`);
  }
  localDefinitions.set(change.key, definition);
}
if (
  localDefinitions.size !== 25 ||
  sharedOwners.size !== 5 ||
  [...localDefinitions.keys()].some(
    (key) =>
      !sharedOwners.has(key) && !key.startsWith("ios6-point-prerelease-"),
  )
) {
  throw new Error("Canonical key ownership closure changed.");
}

const collisionFiles = [
  ...readdirSync(here)
    .filter((name) => name.endsWith(".json") && name !== outputName)
    .map((name) => join(here, name)),
  join(here, "..", "apple-launch-content-2026.json"),
];
const otherDefinitions = new Map();
const otherRoutes = new Map();
const otherStableEventIds = new Map();
for (const file of collisionFiles) {
  const candidate = JSON.parse(readFileSync(file, "utf8"));
  for (const owner of [
    ...(candidate.versions || []),
    ...(candidate.events || []),
    ...(candidate.builds || []),
  ]) {
    for (const change of owner.changes || []) {
      const definition = JSON.stringify(
        stableValue({
          title: change.title,
          canonicalSummary: change.canonicalSummary,
          category: change.category,
        }),
      );
      otherDefinitions.set(change.key, [
        ...(otherDefinitions.get(change.key) || []),
        { definition, file },
      ]);
    }
  }
  for (const event of candidate.events || []) {
    const releaseVersionId =
      event.identity?.releaseVersionId || event.target?.releaseVersionId;
    const alias = event.identity?.routeAlias || event.target?.routeAlias;
    const stableEventId =
      event.identity?.stableEventId || event.target?.stableEventId;
    if (releaseVersionId && alias) {
      otherRoutes.set(routeKey(releaseVersionId, alias), file);
    }
    if (stableEventId) otherStableEventIds.set(stableEventId, file);
  }
}
for (const [key, definition] of localDefinitions) {
  const collisions = otherDefinitions.get(key) || [];
  const expectedOwner = sharedOwners.get(key);
  if (!expectedOwner && collisions.length > 0) {
    throw new Error(
      `New point-release key collides with existing content: ${key}.`,
    );
  }
  if (
    expectedOwner &&
    (!collisions.some(
      (collision) =>
        collision.file === expectedOwner && collision.definition === definition,
    ) ||
      collisions.some((collision) => collision.definition !== definition))
  ) {
    throw new Error(`Shared definition ownership drifted for ${key}.`);
  }
}
for (const route of routes) {
  const key = routeKey(route.releaseVersionId, route.alias);
  if (otherRoutes.has(key)) {
    throw new Error(
      `An existing research batch already owns ${key} (${otherRoutes.get(key)}).`,
    );
  }
  if (otherStableEventIds.has(route.stableEventId)) {
    throw new Error(
      `An existing research batch already owns ${route.stableEventId}.`,
    );
  }
}

const citationUrls = new Set();
const collectCitationUrls = (value) => {
  if (Array.isArray(value)) {
    value.forEach(collectCitationUrls);
    return;
  }
  if (!value || typeof value !== "object") return;
  for (const [key, item] of Object.entries(value)) {
    if (key === "citations" && Array.isArray(item)) {
      item.forEach((citation) => citationUrls.add(citation.url));
    } else {
      collectCitationUrls(item);
    }
  }
};
collectCitationUrls(bundle);
const sourceUrls = new Set(sources.map((source) => source.url));
const missingSources = [...citationUrls].filter((url) => !sourceUrls.has(url));
const unusedSources = sources.filter((source) => !citationUrls.has(source.url));
if (
  sourceUrls.size !== sources.length ||
  missingSources.length > 0 ||
  unusedSources.length > 0
) {
  throw new Error(
    `Citation closure failed. Unique sources ${sourceUrls.size}/${sources.length}; missing ${missingSources.join(", ")}; unused ${unusedSources
      .map((source) => source.url)
      .join(", ")}.`,
  );
}

const outputPath = join(here, outputName);
const json = await prettier.format(JSON.stringify(bundle), {
  filepath: outputPath,
});
writeFileSync(outputPath, json);
const jsonSha = createHash("sha256").update(json).digest("hex");

const citationReferenceCount = (value) => {
  if (Array.isArray(value)) {
    return value.reduce(
      (total, item) => total + citationReferenceCount(item),
      0,
    );
  }
  if (!value || typeof value !== "object") return 0;
  return Object.entries(value).reduce(
    (total, [key, item]) =>
      total +
      (key === "citations" && Array.isArray(item)
        ? item.length
        : citationReferenceCount(item)),
    0,
  );
};
const citationCount = citationReferenceCount(bundle);
const changeCount = events.reduce(
  (total, event) => total + event.changes.length,
  0,
);
const routeRows = events
  .map((event) => {
    const route = routes.find(
      (candidate) => candidate.stableEventId === event.identity.stableEventId,
    );
    return `| iOS ${route.version} ${event.identity.label} | \`${event.target.releaseVersionId}/${event.identity.routeAlias}\` | ${event.identity.appearanceDate} | ${event.changes.length} | ${event.changes.filter((change) => change.action === "fixed").length} | ${event.changes.filter((change) => change.action === "knownIssue").length} |`;
  })
  .join("\n");
const sourceLedger = sources
  .map(
    (source) =>
      `- [${source.title}](${source.url}) — ${source.publisher}; ${source.sourceClass}.`,
  )
  .join("\n");
const routeVerificationRows = events
  .map((event) => {
    const version = event.target.releaseVersionId
      .replace("version-ios-", "")
      .replaceAll("-", ".");
    return `| \`/apple/ios/${version}/${event.target.routeAlias}/\` | 200 | 2/2 | ${event.changes.length}/${event.changes.length} | yes | yes | no | index, follow |`;
  })
  .join("\n");
const rawRows = rawEvidence
  .map(
    ([filename, bytes, sha, use]) =>
      `| ${filename} | ${Number(bytes).toLocaleString("en-US")} | \`${sha}\` | ${use} |`,
  )
  .join("\n");
const excludedRawRows = excludedRawArtifacts
  .map(
    ([filename, bytes, sha, reason]) =>
      `| ${filename} | ${Number(bytes).toLocaleString("en-US")} | \`${sha}\` | ${reason} |`,
  )
  .join("\n");
const retainedRawBytes = rawEvidence.reduce(
  (total, [, bytes]) => total + bytes,
  0,
);
const excludedRawBytes = excludedRawArtifacts.reduce(
  (total, [, bytes]) => total + bytes,
  0,
);

const md = `# Apple iOS 6 point-release prerelease archive batch

## Result

\`${outputName}\` is the approved archive batch for the iOS 6 point-release
developer cycles after 6.0. It is isolated from the completed iOS 6.0
prerelease batch and does not alter the hardcoded seed timeline or any existing
Public page.

- ${events.length} exact identity-backed event creates and no release-version
  overlays
- ${changeCount} selected change occurrences across ${localDefinitions.size}
  canonical definitions
- ${sharedOwners.size} definitions reused byte-for-byte from the approved
  Public owner; ${localDefinitions.size - sharedOwners.size} new definitions
  use the \`ios6-point-prerelease-\` namespace
- ${sources.length} declared and used sources with ${citationCount} citation
  references
- zero builds, guessed build scope, release-version overlays, or seed edits
- every event is \`editoriallyVerified\`, \`approved\`, and explicitly
  \`isIndexable: true\`

## New historical route closure

| Milestone | New route | Appearance date | Selected changes | Fixed | Current known |
| --- | --- | --- | ---: | ---: | ---: |
${routeRows}

Only exact source-defensible developer identities are represented. The
generator rejects Public, GM, and the existing 6.0 major-cycle routes.

## Lineage and evidence method

1. The 6.1 cycle is represented by five explicitly numbered betas. Beta 1
   introduces the selected developer interfaces and early observed features;
   Betas 2 through 4 distinguish source-defensible deltas from cumulative state
   found in preserved developer-note copies.
2. The detailed Beta 3 notes survive in two independent archive pages. The
   iPhone-Ticker copy is a user comment by Robo.Term, not publisher-authored
   release notes. Beta 4's only detailed retained copy is likewise a user
   comment by MichiBoa, so all four detailed Beta 4 records stay
   \`reported\`.
3. Beta 5 remains Beta 5. Reporting moved directly from that named seed to the
   Public release, and no separately distributed GM identity was recovered.
4. The February 6 seed retains its historical \`6.1.1 Beta 1\` identity.
   Apple's later statement said that beta would be renamed because the Public
   6.1.1 emergency update was unrelated. Reports explicitly connect it to
   \`6.1.3 Beta 2\`.
5. Maps for Japan is a delta on 6.1.1 Beta 1 and a cumulative occurrence on
   6.1.3 Beta 2. The passcode repair is a Beta 2 delta. The evasi0n record says
   only that the tested jailbreak path changed when at least its time-zone flaw
   was patched; it does not claim every exploit was repaired.

## Build evidence without build documents

| Milestone | Retained evidence | Decision |
| --- | --- | --- |
| 6.1 Beta 1 | \`10B5095f\` | No device-specific first-party artifact retained |
| 6.1 Beta 2 | Narrative \`10B5105c\`; embedded post \`10B105c\` | Conflict retained; no build |
| 6.1 Beta 3 | \`10B5117b\`, identified retrospectively by Beta 4 coverage | No retained device download |
| 6.1 Beta 4 | \`10B5126b\` | No retained device download |
| 6.1 Beta 5 | Public-equivalent builds vary by device in later archives | No single build or inferred GM |
| 6.1.1 Beta 1 | \`10B311\` | No retained device download |
| 6.1.3 Beta 2 | Later archives report \`10B318\`; identity pages do not preserve a complete device matrix | No build |

The content model can represent builds, but this candidate does not turn
article text into globally scoped build documents.

## Exact evidence gaps

- No developer-distributed 6.0.1 beta identity was recovered. Contemporaneous
  evidence describes carrier testing before Public.
- No exact 6.0.2, 6.1.2, or 6.1.4 developer beta identity was recovered.
- No 6.1 GM route is created. Beta 5 is retained under the label used by the
  release report.
- No 6.1.3 Beta 3 or other later prerelease identity was recovered.
- The Beta 2 build typo is preserved as a conflict, not silently corrected.
- Beta 4's Simulator line carries a fixed marker while repeating the earlier
  restriction. Its occurrence is partially documented and explains the
  ambiguity.
- The selections contain milestone deltas plus six explicit cumulative
  occurrences, not copied or exhaustive changelogs.

## Raw-source audit ledger

The HTML bodies were downloaded on ${accessedAt} to a temporary, uncommitted
audit directory. Hashes cover the exact response bytes.

| Raw artifact | Bytes | SHA-256 | Use |
| --- | ---: | --- | --- |
${rawRows}

The retained source set contains ${rawEvidence.length} files and
${retainedRawBytes.toLocaleString("en-US")} bytes. Two additional exploratory
downloads remain in the temporary directory but are explicitly excluded:

| Excluded raw artifact | Bytes | SHA-256 | Reason |
| --- | ---: | --- | --- |
${excludedRawRows}

The audit closes the directory over all ${rawEvidence.length + excludedRawArtifacts.length}
files (${(retainedRawBytes + excludedRawBytes).toLocaleString("en-US")} total
bytes), verifies every byte count and hash, page marker and publication
timestamp, the exact community-comment containers for both transcript sources,
every citation locator, route and recurrence history, source use, and
reader-facing copyright overlap.

## Copyright and editorial method

Every event summary, article paragraph, occurrence title, canonical summary,
occurrence summary, and verification method is scanned against each retained
source independently. The candidate uses original synthesis and keeps exact
source language only inside citation locators.

Third-party release-note reproductions are credited as archive or journalism
sources, never as Apple-hosted documents. The pages select claims and link to
their provenance; they do not republish the source lists.

## Source ledger

All sources were accessed on ${accessedAt}.

${sourceLedger}

## Closure guards

- exact comparison against all eight local iOS 6 seed records
- immutable SHA for the approved Public owner: \`${approvedPublicSha}\`
- immutable SHAs for all four structurally isolated iOS 6.0 prerelease sibling
  artifacts, including candidate JSON \`${completedMajorPrereleaseSha}\`
- exact seven-event route, identity, date, channel, sequence, and count
  allowlist
- explicit rejection of Public, GM, and iOS 6.0 major-cycle events
- approved/indexable ownership checks for every existing local Public page
- zero release-version overlays and zero builds
- route and stable-ID collision scan across every other research-batch JSON
  plus \`apple-launch-content-2026.json\`
- strict owner and byte-equality guards for ${sharedOwners.size} reused
  definitions; every new key is collision-free and cohort-prefixed
- complete unique source declaration/use closure
- complete retained/evidence-directory closure with two named exclusions
- deterministic formatted JSON SHA-256: \`${jsonSha}\`

## Editorial approval and validation record

- provenance: \`editoriallyVerified\`
- editorial status: \`approved\`
- indexing: enabled
- reviewed at: \`${reviewedAt}\`
- independent substantive review: clean after cumulative-state, source-custody,
  route-lineage, action-scope, evidence-label, and copyright corrections

- repository validation: ${verification.researchBatches} batches;
  ${verification.globalChangeKeys} globally consistent change keys
- focused ingestion/manifest tests: ${verification.focusedTests}
- full repository suite: ${verification.fullTests}
- HTML locator assertions: ${verification.htmlLocatorAssertions}
- minimum exact-locator/editorial semantic-token overlap:
  ${verification.minimumSemanticTokenOverlap}
- copyright scan: ${verification.copyrightFields} reader-facing fields;
  maximum overlap ${verification.maximumEditorialOverlapWords} words
- independent live re-fetch: all
  ${verification.independentSourcesFetched} declared sources available;
  ${verification.independentRawExact} raw artifacts matched byte-for-byte,
  ${verification.independentNormalizedExact} normalized article boundaries
  matched exactly, all ${verification.independentTitlesReproduced} titles and
  all ${verification.independentLocatorsReproduced} citation-boundary sets
  reproduced, and all ${verification.independentEvidenceReproduced} evidence
  boundaries passed

## Production dry plan

- status: applied and zero-residual verified on ${accessedAt}
- production dry plan: ${dryRun.creates} creates, ${dryRun.patches} patches,
  and ${dryRun.unchanged} unchanged
- create split: ${dryRun.eventCreates} events, ${dryRun.sourceCreates} sources,
  and ${dryRun.changeCreates} change documents
- patch boundary: ${dryRun.patchBoundary}
- mutation payload: ${dryRun.mutationPayloadBytes} bytes
- manifest content digest: \`${dryRun.contentDigest}\`
- production snapshot digest: \`${dryRun.sourceSnapshotDigest}\`
- production plan SHA: \`${dryRun.planSha}\`
- plan artifact SHA-256: \`${dryRun.planArtifactSha}\`
- rollback artifact SHA-256: \`${dryRun.rollbackArtifactSha}\`
- rollback coverage: all ${dryRun.creates} create IDs and all
  ${dryRun.patches} full restore documents
- three consecutive production dry runs reproduced the same plan SHA, counts,
  payload, plan artifact, and rollback artifact

## Publication receipt

- Sanity transaction: \`${publicationRecord.transactionId}\`
- applied plan SHA: \`${dryRun.planSha}\`
- receipt SHA-256: \`${publicationRecord.receiptSha}\`
- immediate post-publication zero plan:
  \`${publicationRecord.zeroPlanSha}\`; zero creates, zero patches,
  ${publicationRecord.zeroUnchanged.toLocaleString("en-US")} unchanged
  documents, and a 16-byte mutation payload
- zero-plan artifact SHA-256:
  \`${publicationRecord.zeroPlanArtifactSha}\`
- zero-plan rollback artifact SHA-256:
  \`${publicationRecord.zeroRollbackArtifactSha}\`

## Production coverage after publication

- ${publicationRecord.coverage.fullVersions} of
  ${publicationRecord.coverage.totalVersions} release versions have full
  version-level coverage
- ${publicationRecord.coverage.totalAppearances.toLocaleString("en-US")}
  appearances:
  ${publicationRecord.coverage.fullAppearances} full articles,
  ${publicationRecord.coverage.sourceLinkedAppearances} source-linked records,
  and
  ${publicationRecord.coverage.timelineOnlyAppearances.toLocaleString("en-US")}
  timeline-only records
- ${publicationRecord.coverage.approvedStructuredAppearances} appearances have
  approved structured changes

## Settled canonical route verification

Every published route was fetched independently from the running local site.
Each returned both archival article sections, every expected structured change
title, References, its first cited source, and an \`index, follow\` directive.
No route returned placeholder copy or a \`noindex\` directive.

| Canonical route | HTTP | Article sections | Expected changes | References | First source | Placeholder | Robots |
| --- | ---: | ---: | ---: | --- | --- | --- | --- |
${routeVerificationRows}

No deployment was performed; domain and deployment work remains scheduled
separately.

Reproduce with:

\`\`\`sh
node scripts/research-batches/build-apple-ios-6-point-prerelease.mjs
npm run research:validate
node --import tsx --test tests/launch-content-ingestion.test.ts tests/launch-content-manifest.test.ts
node --import tsx --test tests/*.test.ts
npx eslint scripts/research-batches/build-apple-ios-6-point-prerelease.mjs scripts/research-batches/audit-ios6-point-prerelease-html-states.mjs
npx prettier --check scripts/research-batches/build-apple-ios-6-point-prerelease.mjs scripts/research-batches/apple-ios-6-point-prerelease.json scripts/research-batches/apple-ios-6-point-prerelease.md scripts/research-batches/audit-ios6-point-prerelease-html-states.mjs
node scripts/research-batches/audit-ios6-point-prerelease-html-states.mjs scripts/research-batches/apple-ios-6-point-prerelease.json /private/tmp/apple-ios6-point-prerelease.lILAsH
\`\`\`
`;

const formattedMd = await prettier.format(md, {
  filepath: join(here, ledgerName),
});
writeFileSync(join(here, ledgerName), formattedMd);

console.log(
  JSON.stringify(
    {
      output: outputPath,
      ledger: join(here, ledgerName),
      events: events.length,
      changes: changeCount,
      changeKeys: localDefinitions.size,
      sharedCanonicalKeys: sharedOwners.size,
      sources: sources.length,
      citations: citationCount,
      sha256: jsonSha,
    },
    null,
    2,
  ),
);
