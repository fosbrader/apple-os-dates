import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import { JSDOM } from "jsdom";

const bundlePath = resolve(
  process.argv[2] || "scripts/research-batches/apple-ios-7-prerelease.json",
);
const evidenceDirectory = resolve(
  process.argv[3] || "tmp/ios7-prerelease-evidence",
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

const expectedExactBodies = {
  "beta1-partial.pdf": [
    71_768,
    "55f499340bc8f22d183055da470e51fba14b91a7cc2154035e067cf67ef2e039",
  ],
  "beta1-transcript.html": [
    54_740,
    "68a334e90baefee0cc7bfeb2246bc7208cb674aee337973f816dddd642aa097a",
  ],
  "beta2-transcript.html": [
    89_809,
    "44be434cf3663f7cd8cc12e5f5bd92d0f210c6daac39e37a7f88864ecab8860b",
  ],
  "beta3.pdf": [
    151_476,
    "7006fff69aef3ab6ac3203cce5788be9a774d93247da8c8c7b7499061047060e",
  ],
  "beta3-transcript.html": [
    88_140,
    "663519c5b94206956a8a9121374c59b0e5b88a0b339a327164b37b1f9972a617",
  ],
  "beta4-transcript.html": [
    85_231,
    "421f4a660769db44bc2822ce3c4c3b08b18f5aa687024c4b8c97f1f49ca49042",
  ],
  "beta5-transcript.html": [
    81_678,
    "b1ac7ad90ecde73581f676cc3ca889db53cb349259f4be0d3b4f54af0d31a6df",
  ],
  "gm-transcript.html": [
    83_440,
    "ffe6720847b96f0349b358de1f1a10f9e88535bc27b827e677d9e588d6efe3e2",
  ],
};

const sourceStates = {
  "beta1-announcement.html": {
    selector: "article",
    bytes: 8_888,
    sha: "919076459f09771267960439625dd4efd996aad9fb418f0cfe7a54c0665d2d5b",
  },
  "beta1-transcript.html": {
    selector: ".KonaBody",
    bytes: 20_705,
    sha: "2b167944f2e0847e36f3d7645a25974c2f482a6550dc34c2d2f2549532a8fb9a",
  },
  "beta2-transcript.html": {
    selector: "article",
    bytes: 19_591,
    sha: "5d10bed50379c864717b76f3aed2c6952e523b6b3530881b042d4869e69eb643",
  },
  "beta2-idb.html": {
    selector: ".entry-content",
    bytes: 2_091,
    sha: "a86212f017c3981eacf2ff944d1ac44e3dde05c9096786c9178ff40dc5e77529",
  },
  "beta2-9to5.html": {
    selector: ".post-content",
    bytes: 2_971,
    sha: "0db0868c37c13afee382d4f43faeef11904083486206eae15218dd4c2e64230b",
  },
  "beta3-transcript.html": {
    selector: "article",
    bytes: 23_001,
    sha: "7c6720ff10b5260dc6c14d8f1e7f9791ebd485aee3f9f76b7d93ae1309e66162",
  },
  "beta4-transcript.html": {
    selector: "article",
    bytes: 22_914,
    sha: "7d82e1af36c7391899822d592c079c9a436530905c833b030bf08a4f5ee68582",
  },
  "beta4-wccftech.html": {
    selector: ".post",
    bytes: 22_576,
    sha: "ddc4a6c4e5072f1daaa713d807da3c0c5914e8e69c3d6f968c138a6d2f064365",
  },
  "beta5-transcript.html": {
    selector: "article",
    bytes: 19_015,
    sha: "e41b45d368a40cf4c00fd2fe6789bb377e5eb9c4c0fd92cb29fe914f9a38cd57",
  },
  "beta5-idevice.html": {
    selector: "blockquote",
    bytes: 26_705,
    sha: "b26bfcbb2272ea9ceff7de5a04755b1c15683565d19099e19f4df616b3b46916",
  },
  "beta6-idevice.html": {
    selector: ".td-post-content",
    bytes: 19_197,
    sha: "b3f4f52636de53be15de8ba92d5d60e7ca8743e6585a5d720b98c421ac99fa73",
  },
  "beta6-idb.html": {
    selector: ".entry-content",
    bytes: 1_336,
    sha: "c7ed5e41aca1dc3536c0b46e5e02a437def2ab0aac9d1645f6afdefc1438eb62",
  },
  "gm-transcript.html": {
    selector: "article",
    bytes: 17_071,
    sha: "9072c845ea9528b3aa78c82d119780dff1de838c527932abd67ff155a5fdb325",
  },
  "gm-intomobile.html": {
    selector: ".entry-content",
    bytes: 16_422,
    sha: "3e1397ad025f1e9d8773d703bf15bfd0d8a11e581a1aa16c6d274d1e2faf0ee4",
  },
  "final-support.html": {
    selector: ".section.viewport-content",
    bytes: 11_100,
    sha: "d02b2881d61fe9b6a7741dc71b2834dfff3a4fe4fa8fdc2957d7ce3b36818a0d",
  },
};

const buffers = new Map();
for (const [name, [bytes, expectedSha]] of Object.entries(
  expectedExactBodies,
)) {
  const buffer = readFileSync(resolve(evidenceDirectory, name));
  assert.equal(buffer.byteLength, bytes, `${name} exact byte count`);
  assert.equal(sha256(buffer), expectedSha, `${name} exact raw SHA-256`);
  buffers.set(name, buffer);
}

const documents = new Map();
const boundedTexts = new Map();
for (const [name, state] of Object.entries(sourceStates)) {
  const buffer =
    buffers.get(name) || readFileSync(resolve(evidenceDirectory, name));
  const document = new JSDOM(buffer).window.document;
  const root = document.querySelector(state.selector);
  assert(root, `${name} contains ${state.selector}`);
  const text = collapse(root.textContent);
  assert.equal(Buffer.byteLength(text), state.bytes, `${name} text bytes`);
  assert.equal(sha256(text), state.sha, `${name} normalized text SHA-256`);
  documents.set(name, document);
  boundedTexts.set(name, text);
}

const urls = {
  beta1Announcement:
    "https://www.apple.com/newsroom/2013/06/10Apple-Unveils-iOS-7/",
  beta1Transcript:
    "https://web.archive.org/web/20130615040305/http://www.phonesreview.co.uk/2013/06/10/ios-7-beta-1-release-notes-live-with-dev-download/",
  beta1PartialPdf:
    "https://wikis.mit.edu/confluence/download/attachments/100208014/iOS.7.Release.Notes.11A4372q%20.pdf?api=v2",
  beta2Transcript:
    "https://web.archive.org/web/20130624222434/http://bgr.com/2013/06/24/ios-7-beta-2-change-log-ipad/",
  beta2Observed:
    "https://www.idownloadblog.com/2013/06/24/ios-7-beta-2-is-out/",
  beta2ObservedCorroboration:
    "https://9to5mac.com/2013/06/24/apple-seeds-ios-7-beta-2-to-developers/",
  beta3Pdf:
    "https://www.ipod.info.pl/wp-content/uploads/2013/07/iOS-7-beta-3-lista-zmian.pdf",
  beta3Transcript:
    "https://web.archive.org/web/20130709213122/http://bgr.com/2013/07/08/ios-7-beta-3-change-log/",
  beta4Transcript:
    "https://web.archive.org/web/20130801011005/http://bgr.com/2013/07/29/ios-7-beta-4-full-change-log-changelog/",
  beta4Corroboration:
    "https://wccftech.com/full-ios-7-beta-4-changelog-posted/",
  beta5Transcript:
    "https://web.archive.org/web/20130809040933/http://bgr.com/2013/08/06/ios-7-beta-5-change-log/",
  beta5Corroboration:
    "https://www.idevice.ro/2013/08/06/ios-7-beta-5-iata-intregul-changelog/",
  beta6Evidence: "https://www.idevice.ro/2013/08/16/ios-7-beta-6-changelog/",
  beta6Corroboration:
    "https://www.idownloadblog.com/2013/08/15/apple-seeds-ios-7-beta-6/",
  gmTranscript:
    "https://web.archive.org/web/20130912223457/http://bgr.com/2013/09/10/ios-7-gm-change-log-release-notes/",
  gmCorroboration:
    "https://www.intomobile.com/2013/09/10/ios-7-gold-master-available-developers-change-log-detailed/",
  finalNotes: "https://support.apple.com/en-us/102996",
};

const sourceByUrl = new Map([
  [urls.beta1Announcement, ["beta1-announcement.html", "article"]],
  [urls.beta1Transcript, ["beta1-transcript.html", ".KonaBody"]],
  [urls.beta1PartialPdf, ["beta1-partial.pdf", undefined]],
  [urls.beta2Transcript, ["beta2-transcript.html", "article"]],
  [urls.beta2Observed, ["beta2-idb.html", ".entry-content"]],
  [urls.beta2ObservedCorroboration, ["beta2-9to5.html", ".post-content"]],
  [urls.beta3Pdf, ["beta3.pdf", undefined]],
  [urls.beta3Transcript, ["beta3-transcript.html", "article"]],
  [urls.beta4Transcript, ["beta4-transcript.html", "article"]],
  [urls.beta4Corroboration, ["beta4-wccftech.html", ".post"]],
  [urls.beta5Transcript, ["beta5-transcript.html", "article"]],
  [urls.beta5Corroboration, ["beta5-idevice.html", "blockquote"]],
  [urls.beta6Evidence, ["beta6-idevice.html", ".td-post-content"]],
  [urls.beta6Corroboration, ["beta6-idb.html", ".entry-content"]],
  [urls.gmTranscript, ["gm-transcript.html", "article"]],
  [urls.gmCorroboration, ["gm-intomobile.html", ".entry-content"]],
  [urls.finalNotes, ["final-support.html", ".section.viewport-content"]],
]);

const bundle = JSON.parse(readFileSync(bundlePath, "utf8"));
assert.deepEqual(
  bundle.events.map((event) => [event.target.routeAlias, event.changes.length]),
  [
    ["beta-1", 33],
    ["beta-2", 6],
    ["beta-3", 26],
    ["beta-4", 38],
    ["beta-5", 12],
    ["beta-6", 1],
    ["gm", 10],
  ],
  "route count closure",
);
assert.equal(bundle.sources.length, 17, "declared source count");
assert(
  bundle.sources.every((source) => sourceByUrl.has(source.url)),
  "every declared source maps to retained evidence",
);

const ignoredIdentityTokens = new Set(
  "a an and are as at be became been being by could did do does for from had has have in into is it its may might no not of on once or that the their them they this through to under was were when while with without would after before during current new now seed issue issues notes fixed known change changes".split(
    " ",
  ),
);
const identityTokens = (...values) =>
  new Set(
    values
      .flatMap((value) => normalizedText(value).split(" "))
      .filter(
        (token) =>
          token.length > 1 &&
          !ignoredIdentityTokens.has(token) &&
          token !== "original" &&
          token !== "synthesis",
      ),
  );
const overlapCount = (left, right) =>
  [...left].filter((token) => right.has(token)).length;

const recordsByUrl = new Map();
for (const [url, [name, selector]] of sourceByUrl) {
  if (!selector) continue;
  const document = documents.get(name);
  const root = document.querySelector(selector);
  const records = [
    ...new Set(
      [...root.querySelectorAll("p,li")]
        .map((element) => collapse(element.textContent))
        .filter((text) => text.length >= 8 && text.length < 1_800)
        .map(normalizedText),
    ),
  ];
  recordsByUrl.set(url, records);
}

let htmlLocatorAssertions = 0;
let pdfLocatorCitations = 0;
let weakestScore = Number.POSITIVE_INFINITY;
let weakestMargin = Number.POSITIVE_INFINITY;
let weakestMarkerOverlap = Number.POSITIVE_INFINITY;
const failures = [];

for (const event of bundle.events) {
  for (const change of event.changes) {
    for (const citation of change.citations) {
      const source = sourceByUrl.get(citation.url);
      assert(source, `retained source for ${citation.url}`);
      if (!source[1]) {
        pdfLocatorCitations += 1;
        continue;
      }
      const marker = citation.locator?.split(" — ").at(-1);
      if (!marker) {
        failures.push(
          `${event.target.routeAlias}/${change.key} has no locator marker for ${source[0]}`,
        );
        continue;
      }
      const markerTokens = identityTokens(marker);
      const editorialTokens = identityTokens(
        marker,
        change.title,
        change.canonicalSummary,
      );
      const ranked = recordsByUrl
        .get(citation.url)
        .map((text) => {
          const sourceTokens = identityTokens(text);
          const markerOverlap = overlapCount(markerTokens, sourceTokens);
          return {
            text,
            markerOverlap,
            score:
              overlapCount(editorialTokens, sourceTokens) + markerOverlap * 2,
          };
        })
        .sort(
          (left, right) =>
            right.score - left.score ||
            right.markerOverlap - left.markerOverlap,
        );
      const best = ranked[0];
      const runnerUp = ranked[1];
      const margin = runnerUp ? best.score - runnerUp.score : best.score;
      if (!best || best.score < 3 || best.markerOverlap < 1 || margin < 1) {
        failures.push(
          `${event.target.routeAlias}/${change.key} did not uniquely resolve ${citation.locator} in ${source[0]} (best=${best?.score || 0}/${best?.markerOverlap || 0}, second=${runnerUp?.score || 0}/${runnerUp?.markerOverlap || 0})`,
        );
        continue;
      }
      htmlLocatorAssertions += 1;
      weakestScore = Math.min(weakestScore, best.score);
      weakestMargin = Math.min(weakestMargin, margin);
      weakestMarkerOverlap = Math.min(weakestMarkerOverlap, best.markerOverlap);
    }
  }
}

assert.deepEqual(failures, [], failures.slice(0, 5).join("\n"));
assert.equal(htmlLocatorAssertions, 190, "HTML locator assertion count");
assert.equal(pdfLocatorCitations, 29, "PDF locator citation count");

const recurrence = new Map();
for (const event of bundle.events) {
  for (const change of event.changes) {
    recurrence.set(change.key, [
      ...(recurrence.get(change.key) || []),
      `${event.target.routeAlias}:${change.action}`,
    ]);
  }
}
const repeated = [...recurrence.values()].filter((states) => states.length > 1);
assert.equal(recurrence.size, 105, "canonical definition count");
assert.equal(repeated.length, 20, "repeated canonical definition count");
assert.deepEqual(
  recurrence.get("ios-7-prerelease-keychain-phone-validation-regions"),
  ["beta-3:knownIssue", "beta-4:knownIssue", "beta-5:fixed"],
  "phone-validation known-to-fixed transition",
);
assert.deepEqual(
  recurrence.get("ios-7-prerelease-safari-settings-upgrade-reset"),
  ["beta-4:fixed", "beta-5:fixed"],
  "documented Safari fix recurrence",
);
assert.equal(
  recurrence.has("ios-7-prerelease-photo-thumbnail-rebuild"),
  false,
  "Beta 5-only thumbnail note is not misattributed to Beta 4",
);

const sourceProbes = {
  "beta1-announcement.html": [
    "Apple Unveils iOS 7",
    "available immediately for iOS Developer Program members",
  ],
  "beta1-transcript.html": [
    "iOS 7 beta 1 release notes",
    "VoiceMemos app is not available in this seed",
  ],
  "beta2-transcript.html": ["iOS 7 beta 2", "iPad version released"],
  "beta2-idb.html": [
    "Beta 2 is now available for iPad",
    "New male and female Siri voices",
  ],
  "beta2-9to5.html": [
    "iPad version is out as well",
    "Voice Memos has returned",
  ],
  "beta3-transcript.html": [
    "Fixed in Seed 3",
    "Starting with Seed 2",
    "phone number validation",
  ],
  "beta4-transcript.html": [
    "Fixed in Seed 4",
    "hundreds of apps",
    "phone number validation",
  ],
  "beta4-wccftech.html": ["Fixed in Seed 4", "hundreds of apps"],
  "beta5-transcript.html": ["Fixed in Seed 5", "cellular fallback technology"],
  "beta5-idevice.html": ["Fixed in Seed 5", "cellular fallback technology"],
  "beta6-idevice.html": ["iTunes in the Cloud", "Reset Media Library"],
  "beta6-idb.html": ["iTunes in the Cloud", "Reset Media Library"],
  "gm-transcript.html": ["Fixed in GM Seed", "kSecAttrSynchronizable"],
  "gm-intomobile.html": ["Fixed in GM Seed", "kSecAttrSynchronizable"],
  "final-support.html": ["About iOS 7 Updates", "iOS 7.0.2"],
};
for (const [name, probes] of Object.entries(sourceProbes)) {
  const text = boundedTexts.get(name);
  for (const probe of probes) {
    assert(
      text.toLowerCase().includes(probe.toLowerCase()),
      `${name} contains ${probe}`,
    );
  }
}

console.log(
  [
    "iOS 7 prerelease HTML evidence audit passed",
    `exact immutable bodies: ${Object.keys(expectedExactBodies).length}`,
    `normalized source states: ${Object.keys(sourceStates).length}`,
    `HTML locator assertions: ${htmlLocatorAssertions}`,
    `PDF locator citations delegated: ${pdfLocatorCitations}`,
    `weakest locator score/margin/marker overlap: ${weakestScore}/${weakestMargin}/${weakestMarkerOverlap}`,
    `canonical definitions/occurrences/repeated: ${recurrence.size}/126/${repeated.length}`,
  ].join("\n"),
);
