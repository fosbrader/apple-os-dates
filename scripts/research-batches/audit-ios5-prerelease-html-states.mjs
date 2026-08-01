import { createHash } from "node:crypto";
import { readFileSync, statSync } from "node:fs";
import { join } from "node:path";

import { JSDOM } from "jsdom";

const [bundlePath, rawDirectory] = process.argv.slice(2);
if (!bundlePath || !rawDirectory) {
  throw new Error(
    "Usage: audit-ios5-prerelease-html-states.mjs BUNDLE RAW_DIRECTORY",
  );
}

const U = {
  beta1Developer: "https://developer.apple.com/news/?id=06062011a",
  beta1Announcement:
    "https://www.apple.com/newsroom/2011/06/06New-Version-of-iOS-Includes-Notification-Center-iMessage-Newsstand-Twitter-Integration-Among-200-New-Features/",
  beta2Identity:
    "https://www.macrumors.com/2011/06/24/apple-releases-ios-5-beta-2-to-developers/",
  beta2Transcript:
    "https://www.iphoneforums.net/threads/differences-in-the-new-ios-5-betas.15506/",
  beta3Identity:
    "https://www.macrumors.com/2011/07/11/apple-releases-ios-5-beta-3-to-developers/",
  beta3Transcript:
    "https://theunlockr.com/apple-ios-5-beta-3-alongside-itunes-10-5-released-with-full-change-log/",
  beta3Observed: "https://www.macstories.net/news/apple-releases-ios-5-beta-3/",
  beta4Identity:
    "https://www.macrumors.com/2011/07/22/apple-seeds-ios-5-beta-4-to-developers/",
  beta4Transcript:
    "https://www.iphoneforums.net/threads/ios-sdk-release-notes-for-ios-5-0-beta-4.17424/",
  beta5Identity:
    "https://www.macrumors.com/2011/08/06/apple-releases-ios-5-beta-5-to-developers/",
  beta5Pdf: "https://iszene.com/uploads/5nvaddy7eqkbt355afs.pdf",
  beta5Transcript:
    "https://www.cultofmac.com/news/apple-releases-ios-5-beta-5-and-itunes-10-5-beta-5-to-developers",
  beta6Identity:
    "https://www.macrumors.com/2011/08/19/ios-5-beta-6-seeded-to-developers/",
  beta6Transcript:
    "https://theunlockr.com/ios-5-beta-6-released-to-developers-full-change-log-included/",
  beta7Identity:
    "https://www.macrumors.com/2011/08/31/apple-posts-ios-5-beta-7-for-developers/",
  beta7Transcript: "https://www.idownloadblog.com/2011/08/31/ios-5-beta-7/",
  gmIdentity:
    "https://www.macrumors.com/2011/10/04/apple-posts-ios-5-golden-master-seed-for-developers/",
  gmTranscript:
    "https://news.wirefly.com/2011/10/04/apple-makes-ios-5-gm-available-to-registered-developers",
  publicBoundary:
    "https://techcrunch.com/2011/10/12/apples-ios-5-update-now-available-for-iphone-ipad-and-ipod-touch/",
  itunesBeta8Boundary:
    "https://www.macrumors.com/2011/09/09/apple-seeds-new-itunes-10-5-and-iwork-for-ios-betas-to-developers/",
};

const rawSpecs = new Map([
  [
    U.beta1Developer,
    [
      "apple-developer-beta1.html",
      107_467,
      "7a4894caa3a5a13f00607355bb78ab2712c58e3c2e1c466fed1506a504534e1e",
      ["Download iOS 5 and iOS 5 SDK Beta Today", "June 6, 2011"],
    ],
  ],
  [
    U.beta1Announcement,
    [
      "apple-newsroom-beta1.html",
      133_524,
      "d444d3a73e3875822844ff5c7adaacad729daaf2ceb0a2e91416811b4aa8ed6a",
      ["New Version of iOS Includes Notification Center", "June 6, 2011"],
    ],
  ],
  [
    U.beta2Identity,
    [
      "macrumors-beta2.html",
      131_075,
      "11f7574fa3220294dc2ed7a288f443392fd928282823efa1164b32b66941dd8b",
      ["Apple Releases iOS 5 Beta 2", "June 24, 2011"],
    ],
  ],
  [
    U.beta2Transcript,
    [
      "iphoneforums-beta2.html",
      200_050,
      "853f3101a891ecf2680c0312232595b422efa50d8675c435009b145a1423cdba",
      ["iOS SDK Release Notes for iOS 5.0 beta 2"],
    ],
  ],
  [
    U.beta3Identity,
    [
      "macrumors-beta3.html",
      124_873,
      "cd6d752ffe8cca2609eef8fd26baa19d665ab8898c0c539d348d23736aa13dd6",
      ["Apple Releases iOS 5 Beta 3", "July 11, 2011"],
    ],
  ],
  [
    U.beta3Transcript,
    [
      "unlockr-beta3.html",
      182_064,
      "db9b2ea58b0504e6f6965501c1b7f75523268f36d9c5cfdb2a23680f5233ce12",
      ["iOS 5 beta 3", "Notes and Known Issues"],
    ],
  ],
  [
    U.beta3Observed,
    [
      "macstories-beta3.html",
      55_292,
      "fb952d0eb835ff2d78b5bfee4e1699106b01e4db1f6f0c8ce54d7d37e4575daa",
      ["Apple Releases iOS 5 Beta 3", "FaceTime icon"],
    ],
  ],
  [
    U.beta4Identity,
    [
      "macrumors-beta4.html",
      123_356,
      "aca9dfb57e7390e9aa50cb9755336e4d4acb12a7cb840aa2d0384755c187b945",
      ["Apple Seeds iOS 5 Beta 4", "July 22, 2011"],
    ],
  ],
  [
    U.beta4Transcript,
    [
      "iphoneforums-beta4.html",
      133_913,
      "42bb811112e3e8c1d5ed61f2672496336165076ebec3667bfbca8f65cbf7a5e4",
      ["iOS SDK Release Notes for iOS 5.0 beta 4"],
    ],
  ],
  [
    U.beta5Identity,
    [
      "macrumors-beta5.html",
      130_067,
      "54b6af58a5437960224c432e19ae13df15da62b2c497f64f7bcf28377e824b64",
      ["Apple Releases iOS 5 Beta 5", "August 6, 2011"],
    ],
  ],
  [
    U.beta5Pdf,
    [
      "ios5-beta5.pdf",
      155_665,
      "786c027c85024d5da0295a16587dec1e86a4c86705c9c8ae9f7842b557c87416",
      [],
    ],
  ],
  [
    U.beta5Transcript,
    [
      "cultofmac-beta5.html",
      310_399,
      "29861fafc314e0063e95f95c96272eab7ffbe823bfe24c593cb7398ed29b42f3",
      ["Apple Releases iOS 5 Beta 5", "full change log"],
    ],
  ],
  [
    U.beta6Identity,
    [
      "macrumors-beta6.html",
      125_748,
      "e2a15fc9f5bf6804e63068994349ace5925424f8e8d3b3107d63e66fe4f492f0",
      ["iOS 5 Beta 6 Seeded", "August 19, 2011"],
    ],
  ],
  [
    U.beta6Transcript,
    [
      "unlockr-beta6.html",
      193_088,
      "27c5982ec6d8ac0ba6638f38f7974eea0c91926ddd968f57b11280edfe96ce54",
      ["iOS 5 beta 6", "Notes and Known Issues"],
    ],
  ],
  [
    U.beta7Identity,
    [
      "macrumors-beta7.html",
      124_584,
      "2f184c64e63f95d5ad037356f72fabe8645acc9fa2e06b8de2abcc96e7d664c2",
      ["Apple Posts iOS 5 Beta 7", "August 31, 2011"],
    ],
  ],
  [
    U.beta7Transcript,
    [
      "idownloadblog-beta7.html",
      251_968,
      "260d42b34df10d5667232b0c3b82cbcd1964187a6e1a16d38f5779db76afacfc",
      ["Apple Releases iOS 5 Beta 7", "API Validation"],
    ],
  ],
  [
    U.gmIdentity,
    [
      "macrumors-gm.html",
      123_614,
      "196ca3ee8d31e2f60ef7e1dff692627f3817cf36b158913ecdcc8195f3bc59c1",
      ["Apple Posts iOS 5 Golden Master", "October 4, 2011"],
    ],
  ],
  [
    U.gmTranscript,
    [
      "wirefly-gm.html",
      105_820,
      "eca3875107a5b408f9c55ace9d29d41a7e0ec942a400a205c6fe159014af436c",
      ["Apple makes iOS 5 GM available", "Auto-matching"],
    ],
  ],
  [
    U.publicBoundary,
    [
      "techcrunch-public.html",
      226_779,
      "86c94ed5e6e5e2144ca3533315e3acaa0043ce118092b707e0f9b6da8efb405e",
      ["iOS 5 Update Now Available", "7 Beta releases"],
    ],
  ],
  [
    U.itunesBeta8Boundary,
    [
      "macrumors-itunes-beta8.html",
      126_577,
      "c3a75ae1dd3a2b22fdb116baa31fe0582b5fa6579db171350ca5c6040d3d3b3d",
      ["iTunes 10.5 beta 8", "iWork for iOS beta 3"],
    ],
  ],
]);

const bundle = JSON.parse(readFileSync(bundlePath, "utf8"));
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
const bodyText = (raw) =>
  new JSDOM(raw.toString("utf8")).window.document.body.textContent;

const normalizedTextByUrl = new Map();
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
  if (filename.endsWith(".pdf")) continue;
  const text = normalize(bodyText(raw));
  const missingMarkers = markers.filter(
    (marker) => !text.includes(normalize(marker)),
  );
  if (missingMarkers.length > 0) {
    throw new Error(`${filename} is missing markers: ${missingMarkers}.`);
  }
  normalizedTextByUrl.set(url, text);
}

const markerInventory = [
  [U.beta2Transcript, "div.bbCodeBlock-expandContent", 23, 15],
  [U.beta3Transcript, "blockquote", 14, 8],
  [U.beta4Transcript, "div.bbWrapper", 17, 5],
  [U.beta5Transcript, "article", 15, 15],
  [U.beta6Transcript, "blockquote", 15, 17],
  [U.beta7Transcript, "article", 8, 7],
  [U.gmTranscript, "#node-32554 > .content", 0, 2],
];
const markerResults = [];
for (const [url, selector, expectedNew, expectedFixed] of markerInventory) {
  const [filename] = rawSpecs.get(url);
  const document = new JSDOM(readFileSync(join(rawDirectory, filename), "utf8"))
    .window.document;
  const candidate = [...document.querySelectorAll(selector)].sort(
    (left, right) =>
      (right.textContent.match(/(?:NEW|FIXED):/gi) || []).length -
      (left.textContent.match(/(?:NEW|FIXED):/gi) || []).length,
  )[0];
  if (!candidate) throw new Error(`Could not find ${selector} in ${filename}.`);
  const newCount = (candidate.textContent.match(/NEW:/gi) || []).length;
  const fixedCount = (candidate.textContent.match(/FIXED:/gi) || []).length;
  if (newCount !== expectedNew || fixedCount !== expectedFixed) {
    throw new Error(
      `${filename} marker inventory changed: new=${newCount}/${expectedNew}; fixed=${fixedCount}/${expectedFixed}.`,
    );
  }
  markerResults.push({ filename, newCount, fixedCount });
}

const expectedCounts = new Map([
  ["beta-1", 15],
  ["beta-2", 25],
  ["beta-3", 16],
  ["beta-4", 17],
  ["beta-5", 26],
  ["beta-6", 22],
  ["beta-7", 14],
  ["gm", 2],
]);
const counts = new Map(
  bundle.events.map((event) => [
    event.identity?.routeAlias,
    event.changes?.length || 0,
  ]),
);
if (
  counts.size !== expectedCounts.size ||
  [...expectedCounts].some(([alias, count]) => counts.get(alias) !== count)
) {
  throw new Error("The generated iOS 5 route counts changed.");
}

const histories = new Map();
for (const event of bundle.events) {
  for (const change of event.changes || []) {
    histories.set(change.key, [
      ...(histories.get(change.key) || []),
      `${event.identity.routeAlias}:${change.action}`,
    ]);
  }
}
const repeatedHistories = [...histories.entries()].filter(
  ([, history]) => history.length > 1,
);
const transitionShape = (history) => history.map((item) => item.split(":")[1]);
const validTransition = (history) => {
  const actions = transitionShape(history);
  return (
    (actions.length === 2 &&
      ((actions[0] === "knownIssue" && actions[1] === "fixed") ||
        (actions[0] === "changed" && actions[1] === "fixed"))) ||
    (actions.length === 2 &&
      actions.every((action) => action === "knownIssue")) ||
    (actions.length === 3 &&
      actions[0] === "knownIssue" &&
      actions[1] === "knownIssue" &&
      actions[2] === "fixed")
  );
};
if (
  histories.size !== 101 ||
  repeatedHistories.length !== 34 ||
  repeatedHistories.reduce(
    (total, [, history]) => total + history.length - 1,
    0,
  ) !== 36 ||
  repeatedHistories.some(([, history]) => !validTransition(history))
) {
  throw new Error("The reviewed iOS 5 transition inventory changed.");
}

const macOnlyInterfaceBuilderKeys = new Set([
  "ios5-prerelease-ib-top-level-size-constraints",
  "ios5-prerelease-ib-generated-constraints",
  "ios5-prerelease-ib-equal-size-constraints",
  "ios5-prerelease-ib-constraint-selection",
  "ios5-prerelease-ib-copy-constraints",
  "ios5-prerelease-ib-select-all",
  "ios5-prerelease-segment-style-automatic",
]);
if ([...histories.keys()].some((key) => macOnlyInterfaceBuilderKeys.has(key))) {
  throw new Error(
    "A macOS-only Cocoa Auto Layout record entered the iOS batch.",
  );
}

let locatorAssertions = 0;
let markerAlignmentAssertions = 0;
const missingLocators = [];
for (const event of bundle.events) {
  for (const change of event.changes || []) {
    for (const citation of change.citations || []) {
      if (citation.url === U.beta5Pdf) continue;
      const sourceText = normalizedTextByUrl.get(citation.url);
      if (!sourceText) {
        missingLocators.push(`${change.key}: unmapped ${citation.url}`);
        continue;
      }
      const separator = citation.locator?.indexOf(" — ") ?? -1;
      if (separator < 0) {
        missingLocators.push(`${change.key}: malformed ${citation.locator}`);
        continue;
      }
      const locator = normalize(citation.locator.slice(separator + 3));
      locatorAssertions += 1;
      if (!sourceText.includes(locator)) {
        missingLocators.push(
          `${change.key}: ${citation.url} lacks "${locator}"`,
        );
        continue;
      }
      if (
        citation.url !== U.beta1Announcement &&
        change.action !== "knownIssue"
      ) {
        const locatorIndex = sourceText.indexOf(locator);
        const lastFixed = sourceText.lastIndexOf("fixed:", locatorIndex);
        const lastNew = sourceText.lastIndexOf("new:", locatorIndex);
        const actualMarker = lastFixed > lastNew ? "fixed" : "new";
        const expectedMarker = change.action === "fixed" ? "fixed" : "new";
        markerAlignmentAssertions += 1;
        if (
          Math.max(lastFixed, lastNew) < 0 ||
          actualMarker !== expectedMarker
        ) {
          missingLocators.push(
            `${change.key}: ${change.action} does not align with the nearest status marker`,
          );
        }
      }
    }
  }
}
if (missingLocators.length > 0) {
  throw new Error(
    `HTML locator audit failed (${missingLocators.length}):\n${missingLocators.join("\n")}`,
  );
}

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
const sourceTokens = [...normalizedTextByUrl.values()].flatMap((text) =>
  words(text),
);
const sourceFourGramPositions = new Map();
for (let index = 0; index + 4 <= sourceTokens.length; index += 1) {
  const gram = sourceTokens.slice(index, index + 4).join("|");
  const positions = sourceFourGramPositions.get(gram);
  if (positions) positions.push(index);
  else sourceFourGramPositions.set(gram, [index]);
}
let maximumOverlapWords = 0;
let overlapPhrase = "";
let overlapEditorial = "";
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
      }
    }
  }
}
if (maximumOverlapWords > 5) {
  throw new Error(
    `Copyright overlap exceeds 5 words (${maximumOverlapWords}): "${overlapPhrase}" in "${overlapEditorial}".`,
  );
}

console.log(
  JSON.stringify(
    {
      rawFiles: rawSpecs.size,
      markerResults,
      events: bundle.events.length,
      changes: [...counts.values()].reduce((sum, value) => sum + value, 0),
      locatorAssertions,
      markerAlignmentAssertions,
      repeatedCanonicalKeys: repeatedHistories.length,
      repeatedTransitionOccurrences: repeatedHistories.reduce(
        (total, [, history]) => total + history.length - 1,
        0,
      ),
      copyrightFields: editorialStrings.length,
      maximumOverlapWords,
      overlapPhrase,
    },
    null,
    2,
  ),
);
