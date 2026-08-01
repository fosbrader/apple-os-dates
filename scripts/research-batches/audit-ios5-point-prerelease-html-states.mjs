import { createHash } from "node:crypto";
import { readFileSync, statSync } from "node:fs";
import { join } from "node:path";

import { JSDOM, VirtualConsole } from "jsdom";

const [bundlePath, rawDirectory] = process.argv.slice(2);
if (!bundlePath || !rawDirectory) {
  throw new Error(
    "Usage: audit-ios5-point-prerelease-html-states.mjs BUNDLE RAW_DIRECTORY",
  );
}

const U = {
  apple501Beta1: "https://developer.apple.com/news/?id=11032011a",
  mr501Beta1:
    "https://www.macrumors.com/2011/11/02/apple-posts-ios-5-0-1-beta-for-developers/",
  nine501Beta2: "https://9to5mac.com/2011/11/04/apple-seeds-ios-5-beta-2/",
  mr501Beta2:
    "https://www.macrumors.com/2011/11/04/apple-seeds-ios-5-0-1-beta-2-to-developers/",
  macstories501Beta2:
    "https://www.macstories.net/news/apple-releases-ios-5-0-1-beta-2/",
  apple501Public: "https://developer.apple.com/news/?id=11102011a",
  mr51Beta1:
    "https://www.macrumors.com/2011/11/28/apple-begins-seeding-of-ios-5-1-beta-xcode-4-3-to-developers/",
  pdf51Beta1: "https://iszene.com/uploads/9ul0quu9psp8mp6ewa3.pdf",
  mr51Beta2:
    "https://www.macrumors.com/2011/12/12/apple-seeds-ios-5-1-beta-2-to-developers-enables-photo-stream-photo-deletion/",
  cult51Beta2:
    "https://www.cultofmac.com/news/apple-releases-ios-5-1-beta-2-to-developers",
  mr51Beta3:
    "https://www.macrumors.com/2012/01/09/apple-seeds-ios-5-1-beta-3-to-developers/",
  apple51BetaBoundary: "https://developer.apple.com/news/?id=02162012b",
  mr51InternalGm:
    "https://www.macrumors.com/2012/03/06/testing-on-ios-5-1-golden-master-reportedly-complete-ahead-of-ipad-3-launch/",
  imore51NoGm: "https://www.imore.com/ios-5-1-review",
  appleSupport: "https://support.apple.com/en-us/102998",
};

const rawSpecs = new Map([
  [
    U.apple501Beta1,
    [
      "apple-dev-501-beta1.html",
      106_041,
      "b063eaa5628be42315031ce3d46b99efda129266e7b434743814e3bda2ede5ec",
      ["iOS 5.0.1 beta is now available", "remain on device"],
    ],
  ],
  [
    U.mr501Beta1,
    [
      "macrumors-501-beta1.html",
      123_486,
      "1078b75d13f6783a8ac4c8bd252f0815224c853538ddd2fd9d3010d69a090ad0",
      ["November 2, 2011", "Fixes bugs affecting battery life"],
    ],
  ],
  [
    U.nine501Beta2,
    [
      "9to5-501-beta2.html",
      146_642,
      "a87cd740fba1409cbbc32eb1719fb730cbeddd196c00e1a127cc65fa318422f7",
      ["fixed the Smart Cover security flaw", "Changelog is not available yet"],
    ],
  ],
  [
    U.mr501Beta2,
    [
      "macrumors-501-beta2.html",
      129_309,
      "da125c56d0c432112027ee2511c56d298df40f5c771cc812cd843afb90bfb3e8",
      ["November 4, 2011", "pushed out a second version for testing"],
    ],
  ],
  [
    U.macstories501Beta2,
    [
      "macstories-501-beta2.html",
      43_121,
      "c58bf1792768f43d08665e6c67b76500865b8d09fcf20c014182084cb55a43d5",
      ["failed activations", "doesn’t appear that iOS 5.0.1 beta 2"],
    ],
  ],
  [
    U.apple501Public,
    [
      "apple-dev-501-public.html",
      105_974,
      "f14c8c0fed165becd8e07ec9684577ca9c69392be45c7ff1dadd06ad445df815",
      ["November 10, 2011", "available to iOS users worldwide"],
    ],
  ],
  [
    U.mr51Beta1,
    [
      "macrumors-51-beta1.html",
      123_935,
      "1997bc042703af9c2237f0054158f1e5c68e64d0d9b110217eb950d9dadd7a82",
      ["November 28, 2011", "first version of iOS 5.1 Beta"],
    ],
  ],
  [
    U.pdf51Beta1,
    [
      "ios51-beta1.pdf",
      76_179,
      "75160cd989483602688931401a452898064d03bbbbdd4fbf99b67bfd2652b35e",
      [],
    ],
  ],
  [
    U.mr51Beta2,
    [
      "macrumors-51-beta2.html",
      124_416,
      "f676e78a8318e42872e17548a6722b25cedc29fff7824229c74068457ad25f8f",
      ["December 12, 2011", "Photo Stream"],
    ],
  ],
  [
    U.cult51Beta2,
    [
      "cultofmac-51-beta2.html",
      296_196,
      "98e912d8c92fbfcb83298e39c447edf88e36df68024fbe56c93433fa1d96719a",
      ["App icons and profile photos", "Network Link Conditioner daemon"],
    ],
  ],
  [
    U.mr51Beta3,
    [
      "macrumors-51-beta3.html",
      129_987,
      "e3c2f37ccba06be3979c05f8fe7ffc34f34a90bbc1da9bc7e26e3ad89f72680b",
      ["January 9, 2012", "NSURLIsExcludedFromBackupKey"],
    ],
  ],
  [
    U.apple51BetaBoundary,
    [
      "apple-dev-51-beta-boundary.html",
      107_554,
      "87164502a0966d56eb00825555bda27b0fad1b8e910b552b5b93f6b6f7bde659",
      ["February 16, 2012", "iOS 5.1 SDK beta"],
    ],
  ],
  [
    U.mr51InternalGm,
    [
      "macrumors-51-internal-gm.html",
      124_090,
      "ac31f2de3beea6d23e65e3d118461132440e8dadaede02adac5459349a6d75b8",
      ["March 6, 2012", "carrier partners"],
    ],
  ],
  [
    U.imore51NoGm,
    [
      "imore-51-no-gm.html",
      1_094_911,
      "208c0865c36c514dc014327c2bda53298ef12ce6f3c5a908535b502d4583124a",
      ["final build for developers to test against", "March 7, 2012"],
    ],
  ],
  [
    U.appleSupport,
    [
      "apple-support-ios5.html",
      1_164_087,
      "5d61d349285f4629cb30e476c63cc2c0e3977ff2288694e8046aa4d784ee4a71",
      ["iOS 5.1", "iOS 5.1.1"],
    ],
  ],
]);

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
const wordTokens = (value) =>
  normalize(value).match(/[a-z0-9][a-z0-9._:-]*/g) || [];
const documentForRaw = (raw) => {
  const virtualConsole = new VirtualConsole();
  return new JSDOM(raw.toString("utf8"), { virtualConsole }).window.document;
};

const bundle = JSON.parse(readFileSync(bundlePath, "utf8"));
const declaredSourceUrls = new Set(
  (bundle.sources || []).map((source) => source.url),
);
if (
  declaredSourceUrls.size !== rawSpecs.size ||
  [...rawSpecs.keys()].some((url) => !declaredSourceUrls.has(url))
) {
  throw new Error("The exact declared-source/raw-artifact closure changed.");
}
const mirroredPdfSource = bundle.sources.find(
  (source) => source.url === U.pdf51Beta1,
);
if (
  !mirroredPdfSource ||
  mirroredPdfSource.publisher !== "iSzene document mirror" ||
  mirroredPdfSource.sourceClass !== "archive" ||
  mirroredPdfSource.author !== "Apple" ||
  mirroredPdfSource.publishedAt !== "2011-11-29T08:25:14.000Z" ||
  !mirroredPdfSource.title.includes("(preserved PDF)")
) {
  throw new Error("The Apple-authored PDF mirror custody label changed.");
}
const normalizedTextByUrl = new Map();
const rawDocumentByUrl = new Map();
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
  const document = documentForRaw(raw);
  const text = normalize(document.body.textContent);
  const missingMarkers = markers.filter(
    (marker) => !text.includes(normalize(marker)),
  );
  if (missingMarkers.length > 0) {
    throw new Error(`${filename} is missing markers: ${missingMarkers}.`);
  }
  rawDocumentByUrl.set(url, document);
  normalizedTextByUrl.set(url, text);
}

const cultArticle =
  rawDocumentByUrl.get(U.cult51Beta2).querySelector("article#post-134770") ||
  rawDocumentByUrl.get(U.cult51Beta2).querySelector("section.post-body");
if (!cultArticle) throw new Error("The Cult of Mac article body is missing.");
const cultNew = (cultArticle.textContent.match(/NEW:/g) || []).length;
const cultFixed = (cultArticle.textContent.match(/FIXED:/g) || []).length;
if (cultNew !== 4 || cultFixed !== 4) {
  throw new Error(
    `Cult of Mac marker inventory changed: NEW=${cultNew}/4, FIXED=${cultFixed}/4.`,
  );
}

const expectedCounts = new Map([
  ["version-ios-5-0-1/beta-1", 6],
  ["version-ios-5-0-1/beta-2", 1],
  ["version-ios-5-1/beta-1", 12],
  ["version-ios-5-1/beta-2", 8],
  ["version-ios-5-1/beta-3", 2],
]);
const expectedRoutes = [
  {
    releaseVersionId: "version-ios-5-0-1",
    alias: "beta-1",
    label: "Beta 1",
    appearanceDate: "2011-11-02",
    sequence: 1,
    stableEventId: "event:apple:ios:5.0.1:beta-1",
    identityUrl: U.mr501Beta1,
    dateMarker: "November 2, 2011",
  },
  {
    releaseVersionId: "version-ios-5-0-1",
    alias: "beta-2",
    label: "Beta 2",
    appearanceDate: "2011-11-04",
    sequence: 2,
    stableEventId: "event:apple:ios:5.0.1:beta-2",
    identityUrl: U.mr501Beta2,
    dateMarker: "November 4, 2011",
  },
  {
    releaseVersionId: "version-ios-5-1",
    alias: "beta-1",
    label: "Beta 1",
    appearanceDate: "2011-11-28",
    sequence: 1,
    stableEventId: "event:apple:ios:5.1:beta-1",
    identityUrl: U.mr51Beta1,
    dateMarker: "November 28, 2011",
  },
  {
    releaseVersionId: "version-ios-5-1",
    alias: "beta-2",
    label: "Beta 2",
    appearanceDate: "2011-12-12",
    sequence: 2,
    stableEventId: "event:apple:ios:5.1:beta-2",
    identityUrl: U.mr51Beta2,
    dateMarker: "December 12, 2011",
  },
  {
    releaseVersionId: "version-ios-5-1",
    alias: "beta-3",
    label: "Beta 3",
    appearanceDate: "2012-01-09",
    sequence: 3,
    stableEventId: "event:apple:ios:5.1:beta-3",
    identityUrl: U.mr51Beta3,
    dateMarker: "January 9, 2012",
  },
];
const counts = new Map(
  bundle.events.map((event) => [
    `${event.identity?.releaseVersionId}/${event.identity?.routeAlias}`,
    event.changes?.length || 0,
  ]),
);
if (
  counts.size !== expectedCounts.size ||
  [...expectedCounts].some(([key, count]) => counts.get(key) !== count)
) {
  throw new Error("The generated point-release route counts changed.");
}
if (
  bundle.events.length !== expectedRoutes.length ||
  (bundle.versions || []).length !== 0 ||
  (bundle.builds || []).length !== 0
) {
  throw new Error("The exact point-release document-type closure changed.");
}
for (let index = 0; index < expectedRoutes.length; index += 1) {
  const expected = expectedRoutes[index];
  const event = bundle.events[index];
  const identitySourceText = normalizedTextByUrl.get(expected.identityUrl);
  if (
    !identitySourceText?.includes(normalize(expected.dateMarker)) ||
    event.target?.releaseVersionId !== expected.releaseVersionId ||
    event.target?.routeAlias !== expected.alias ||
    event.identity?.releaseVersionId !== expected.releaseVersionId ||
    event.identity?.platformId !== "platform-ios" ||
    event.identity?.stableEventId !== expected.stableEventId ||
    event.identity?.label !== expected.label ||
    event.identity?.routeAlias !== expected.alias ||
    event.identity?.channel !== "developerBeta" ||
    event.identity?.appearanceDate !== expected.appearanceDate ||
    event.identity?.sequence !== expected.sequence ||
    event.identity?.isRevision !== false ||
    event.identity?.availabilityState !== "available" ||
    event.identity?.closesReleaseCycle !== false ||
    event.authorship !== "originalSynthesis" ||
    event.article?.authorship !== "originalSynthesis" ||
    event.provenanceStatus !== "editoriallyVerified" ||
    event.editorialReview?.status !== "approved" ||
    event.editorialReview?.reviewedAt !== "2026-07-30T13:22:09Z" ||
    event.isIndexable !== true
  ) {
    throw new Error(
      `The reviewed route identity changed at ${expected.stableEventId}.`,
    );
  }
}

const cumulativeOccurrences = bundle.events
  .flatMap((event) =>
    (event.changes || []).map((change) => ({
      route: `${event.identity.releaseVersionId}/${event.identity.routeAlias}`,
      change,
    })),
  )
  .filter(({ change }) => change.inheritance === "cumulative")
  .map(({ route, change }) => `${route}:${change.key}`)
  .sort();
const expectedCumulativeOccurrences = [
  "version-ios-5-1/beta-1:ios5-point-prerelease-game-center-profile-media",
  "version-ios-5-1/beta-1:ios5-point-prerelease-icloud-provisioning-profile",
  "version-ios-5-1/beta-1:ios5-prerelease-nsmetadataquery-sort",
  "version-ios-5-1/beta-1:ios5-prerelease-protected-cloud-data",
  "version-ios-5-1/beta-1:ios5-prerelease-cloud-filename-case",
  "version-ios-5-1/beta-1:ios5-point-prerelease-movie-player-preparation",
  "version-ios-5-1/beta-1:ios5-point-prerelease-shake-shuffle-freeze",
  "version-ios-5-1/beta-1:ios5-point-prerelease-xcode-documentation-organizer",
  "version-ios-5-1/beta-1:ios5-point-prerelease-uninstall-devtools-running-xcode",
  "version-ios-5-1/beta-1:ios5-point-prerelease-network-link-conditioner-launch",
].sort();
if (
  JSON.stringify(cumulativeOccurrences) !==
  JSON.stringify(expectedCumulativeOccurrences)
) {
  throw new Error("The reviewed Beta 1 cumulative-context inventory changed.");
}

const evidencePairs = new Map();
for (const event of bundle.events) {
  for (const change of event.changes || []) {
    const pair = `${change.documentedStatus}/${change.evidenceState}`;
    evidencePairs.set(pair, (evidencePairs.get(pair) || 0) + 1);
  }
}
if (
  JSON.stringify([...evidencePairs].sort()) !==
  JSON.stringify(
    [
      ["documented/confirmed", 13],
      ["documented/corroborated", 13],
      ["partiallyDocumented/corroborated", 1],
      ["undocumented/reported", 2],
    ].sort(),
  )
) {
  throw new Error(
    "The reviewed documentation/evidence-state inventory changed.",
  );
}

const histories = new Map();
for (const event of bundle.events) {
  for (const change of event.changes || []) {
    histories.set(change.key, [
      ...(histories.get(change.key) || []),
      `${event.identity.releaseVersionId}/${event.identity.routeAlias}:${change.action}:${change.inheritance}`,
    ]);
  }
}
const repeatedHistories = [...histories.entries()].filter(
  ([, history]) => history.length > 1,
);
if (
  JSON.stringify(repeatedHistories) !==
  JSON.stringify([
    [
      "ios5-point-prerelease-game-center-profile-media",
      [
        "version-ios-5-1/beta-1:knownIssue:cumulative",
        "version-ios-5-1/beta-2:fixed:delta",
      ],
    ],
    [
      "ios5-point-prerelease-xcode-documentation-organizer",
      [
        "version-ios-5-1/beta-1:knownIssue:cumulative",
        "version-ios-5-1/beta-2:fixed:delta",
      ],
    ],
    [
      "ios5-point-prerelease-uninstall-devtools-running-xcode",
      [
        "version-ios-5-1/beta-1:knownIssue:cumulative",
        "version-ios-5-1/beta-2:fixed:delta",
      ],
    ],
    [
      "ios5-point-prerelease-network-link-conditioner-launch",
      [
        "version-ios-5-1/beta-1:knownIssue:cumulative",
        "version-ios-5-1/beta-2:fixed:delta",
      ],
    ],
  ])
) {
  throw new Error("The reviewed point-release transition inventory changed.");
}

const hostToolKeys = new Set([
  "ios5-point-prerelease-xcode-documentation-organizer",
  "ios5-point-prerelease-uninstall-devtools-running-xcode",
  "ios5-point-prerelease-network-link-conditioner-launch",
  "ios5-point-prerelease-xcode-single-application-bundle",
]);
const hostToolOccurrences = bundle.events
  .flatMap((event) =>
    (event.changes || []).map((change) => ({
      route: `${event.identity.releaseVersionId}/${event.identity.routeAlias}`,
      change,
    })),
  )
  .filter(({ change }) => hostToolKeys.has(change.key))
  .map(
    ({ route, change }) =>
      `${route}:${change.key}:${change.action}:${change.inheritance}`,
  )
  .sort();
if (
  JSON.stringify(hostToolOccurrences) !==
  JSON.stringify(
    [
      "version-ios-5-1/beta-1:ios5-point-prerelease-network-link-conditioner-launch:knownIssue:cumulative",
      "version-ios-5-1/beta-1:ios5-point-prerelease-uninstall-devtools-running-xcode:knownIssue:cumulative",
      "version-ios-5-1/beta-1:ios5-point-prerelease-xcode-documentation-organizer:knownIssue:cumulative",
      "version-ios-5-1/beta-2:ios5-point-prerelease-network-link-conditioner-launch:fixed:delta",
      "version-ios-5-1/beta-2:ios5-point-prerelease-uninstall-devtools-running-xcode:fixed:delta",
      "version-ios-5-1/beta-2:ios5-point-prerelease-xcode-documentation-organizer:fixed:delta",
      "version-ios-5-1/beta-2:ios5-point-prerelease-xcode-single-application-bundle:introduced:delta",
    ].sort(),
  )
) {
  throw new Error("The reviewed Xcode host-tool context inventory changed.");
}

let locatorAssertions = 0;
let maximumLocatorWords = 0;
const missingLocators = [];
const auditCitations = (value, path = "bundle") => {
  if (Array.isArray(value)) {
    value.forEach((item, index) => auditCitations(item, `${path}[${index}]`));
    return;
  }
  if (!value || typeof value !== "object") return;
  for (const [key, item] of Object.entries(value)) {
    if (key === "citations" && Array.isArray(item)) {
      item.forEach((citation, index) => {
        const separator = citation.locator?.indexOf(" — ") ?? -1;
        if (separator < 0) {
          missingLocators.push(
            `${path}.citations[${index}]: malformed ${citation.locator}`,
          );
          return;
        }
        const locatorFragment = citation.locator.slice(separator + 3);
        maximumLocatorWords = Math.max(
          maximumLocatorWords,
          wordTokens(locatorFragment).length,
        );
        if (wordTokens(locatorFragment).length > 20) {
          missingLocators.push(
            `${path}.citations[${index}]: locator excerpt exceeds 20 words`,
          );
          return;
        }
        if (citation.url === U.pdf51Beta1) return;
        const sourceText = normalizedTextByUrl.get(citation.url);
        if (!sourceText) {
          missingLocators.push(
            `${path}.citations[${index}]: unmapped ${citation.url}`,
          );
          return;
        }
        const locator = normalize(locatorFragment);
        locatorAssertions += 1;
        if (!sourceText.includes(locator)) {
          missingLocators.push(
            `${path}.citations[${index}]: ${citation.url} lacks "${locator}"`,
          );
        }
      });
    } else {
      auditCitations(item, `${path}.${key}`);
    }
  }
};
auditCitations(bundle);
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
let maximumOverlapWords = 0;
let overlapPhrase = "";
let overlapEditorial = "";
let overlapSource = "";
for (const [sourceUrl, sourceText] of normalizedTextByUrl) {
  const sourceTokens = wordTokens(sourceText);
  const sourceFourGramPositions = new Map();
  for (let index = 0; index + 4 <= sourceTokens.length; index += 1) {
    const gram = sourceTokens.slice(index, index + 4).join("|");
    sourceFourGramPositions.set(gram, [
      ...(sourceFourGramPositions.get(gram) || []),
      index,
    ]);
  }
  for (const editorial of editorialStrings) {
    const tokens = wordTokens(editorial);
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
          overlapSource = sourceUrl;
        }
      }
    }
  }
}
if (maximumOverlapWords > 5) {
  throw new Error(
    `Copyright overlap exceeds five words (${maximumOverlapWords}) against ${overlapSource}: "${overlapPhrase}" in "${overlapEditorial}".`,
  );
}

console.log(
  JSON.stringify(
    {
      rawFiles: rawSpecs.size,
      htmlFiles: normalizedTextByUrl.size,
      cultMarkerInventory: { new: cultNew, fixed: cultFixed },
      events: bundle.events.length,
      changes: [...counts.values()].reduce((sum, value) => sum + value, 0),
      cumulativeOccurrences: cumulativeOccurrences.length,
      repeatedHistories: repeatedHistories.length,
      hostToolOccurrences: hostToolOccurrences.length,
      evidencePairs: Object.fromEntries(evidencePairs),
      locatorAssertions,
      maximumLocatorWords,
      copyrightFields: editorialStrings.length,
      maximumOverlapWords,
      overlapPhrase,
      overlapSource,
    },
    null,
    2,
  ),
);
