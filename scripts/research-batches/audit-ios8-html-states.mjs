import { createHash } from "node:crypto";
import { readFileSync, writeSync } from "node:fs";
import { JSDOM } from "jsdom";

const paths = CommandLineArguments();

function CommandLineArguments() {
  const [
    bundle,
    beta1,
    beta2,
    beta3Current,
    beta3Archive,
    beta4Current,
    beta4Archive,
    gm,
  ] = process.argv.slice(2);
  if (
    !bundle ||
    !beta1 ||
    !beta2 ||
    !beta3Current ||
    !beta3Archive ||
    !beta4Current ||
    !beta4Archive ||
    !gm
  ) {
    throw new Error(
      "Usage: audit-ios8-html-states.mjs BUNDLE BETA1 BETA2 BETA3_CURRENT BETA3_ARCHIVE BETA4_CURRENT BETA4_ARCHIVE GM",
    );
  }
  return {
    bundle,
    beta1,
    beta2,
    beta3Current,
    beta3Archive,
    beta4Current,
    beta4Archive,
    gm,
  };
}

const normalized = (value) =>
  value
    .replace(/[“”‘’]/g, "'")
    .replace(/\s+/g, " ")
    .trim();
const comparisonKey = (record) =>
  `${record.component}|${normalized(record.text)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim()}`;
const normalizedLocatorText = (value) =>
  normalized(value)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
const canonicalToken = (token) =>
  token.length > 3 && token.endsWith("s") ? token.slice(0, -1) : token;
const ignoredIdentityTokens = new Set([
  "a",
  "an",
  "and",
  "are",
  "as",
  "at",
  "be",
  "became",
  "been",
  "being",
  "by",
  "could",
  "did",
  "do",
  "does",
  "for",
  "from",
  "had",
  "has",
  "have",
  "in",
  "into",
  "is",
  "it",
  "its",
  "may",
  "might",
  "no",
  "not",
  "of",
  "on",
  "once",
  "or",
  "that",
  "the",
  "their",
  "them",
  "they",
  "this",
  "through",
  "to",
  "under",
  "was",
  "were",
  "when",
  "while",
  "with",
  "without",
  "would",
]);
const identityTokens = (...values) =>
  new Set(
    values
      .flatMap((value) => normalizedLocatorText(value).split(" "))
      .filter(Boolean)
      .map(canonicalToken)
      .filter((token) => !ignoredIdentityTokens.has(token)),
  );
const overlapCount = (left, right) =>
  [...left].filter((token) => right.has(token)).length;
const inventorySha = (records) =>
  createHash("sha256")
    .update(
      JSON.stringify(
        records.map((record) => [record.component, record.status, record.text]),
      ),
    )
    .digest("hex");

function recordsAt(path) {
  const document = new JSDOM(readFileSync(path, "utf8")).window.document;
  const records = [];
  for (const heading of document.querySelectorAll("h3.section-name")) {
    const status = normalized(heading.textContent);
    if (
      !/^(Fixed in beta \d|Fixed in GM Seed|Known Issues?|Notes?)$/.test(status)
    ) {
      continue;
    }
    const statusSection = heading.parentElement;
    const componentHeading = [...statusSection.parentElement.children].find(
      (element) => element.matches?.("h3.section-name"),
    );
    const component = normalized(componentHeading?.textContent || "WebKit");
    for (const element of statusSection.querySelectorAll(
      ":scope > p.para, :scope > ul.list-bullet > li.item",
    )) {
      const copy = element.cloneNode(true);
      if (
        copy.matches?.("p.para") &&
        normalized(copy.textContent).startsWith("Workaround:")
      ) {
        continue;
      }
      for (const paragraph of copy.querySelectorAll("p.para")) {
        if (normalized(paragraph.textContent).startsWith("Workaround:")) {
          paragraph.remove();
        }
      }
      const text = normalized(copy.textContent);
      if (text) records.push({ component, status, text });
    }
  }
  return records;
}

const bundle = JSON.parse(readFileSync(paths.bundle, "utf8"));
const counts = new Map(
  bundle.events.map((event) => [event.target.routeAlias, event.changes.length]),
);
const expectedBundleCounts = new Map([
  ["beta-1", 30],
  ["beta-2", 74],
  ["beta-3", 38],
  ["beta-4", 29],
  ["beta-5", 21],
  ["gm", 10],
]);
if (
  counts.size !== expectedBundleCounts.size ||
  [...expectedBundleCounts].some(
    ([alias, count]) => counts.get(alias) !== count,
  )
) {
  throw new Error("The generated iOS 8 route counts changed.");
}

const beta1 = recordsAt(paths.beta1);
const beta2 = recordsAt(paths.beta2);
const beta3Current = recordsAt(paths.beta3Current).filter(
  (record) => record.status === "Fixed in beta 3",
);
const beta3Archive = recordsAt(paths.beta3Archive).filter(
  (record) => record.status === "Fixed in beta 3",
);
const beta4Current = recordsAt(paths.beta4Current).filter(
  (record) => record.status === "Fixed in beta 4",
);
const beta4Archive = recordsAt(paths.beta4Archive).filter(
  (record) => record.status === "Fixed in beta 4",
);
const gm = recordsAt(paths.gm).filter(
  (record) => record.status === "Fixed in GM Seed",
);
const beta1Notes = beta1.filter((record) =>
  ["Note", "Notes"].includes(record.status),
);
const beta2Fixed = beta2.filter(
  (record) => record.status === "Fixed in beta 2",
);

const expectedInventories = new Map([
  [
    "beta2",
    [74, "2494e5324cdf6a8103abd8bd5a47c79f8fa9c6e41ad3443afc199795cddf9711"],
  ],
  [
    "beta3",
    [42, "f4eacc3262dc5fb67e579ab2d3fa28c12cdaa938c407889b02316e9845820f36"],
  ],
  [
    "beta4",
    [29, "412064498155ea6e5490746b487c33568a5679dfeb35e683846d211ffe1572f1"],
  ],
  [
    "gm",
    [10, "3f858b1deb30595c1140c7c6485266be394bdf3b63c16e868d9fe1bf4f985951"],
  ],
]);
const actualInventories = new Map([
  ["beta2", [beta2Fixed.length, inventorySha(beta2Fixed)]],
  ["beta3", [beta3Current.length, inventorySha(beta3Current)]],
  ["beta4", [beta4Current.length, inventorySha(beta4Current)]],
  ["gm", [gm.length, inventorySha(gm)]],
]);
for (const [name, expected] of expectedInventories) {
  const actual = actualInventories.get(name);
  if (JSON.stringify(actual) !== JSON.stringify(expected)) {
    throw new Error(
      `${name} inventory changed: ${JSON.stringify(actual)} != ${JSON.stringify(expected)}`,
    );
  }
}
if (
  beta1Notes.length !== 17 ||
  inventorySha(beta3Archive) !== inventorySha(beta3Current) ||
  inventorySha(beta4Archive) !== inventorySha(beta4Current)
) {
  throw new Error("A baseline or mirror-integrity assertion changed.");
}

const beta2ByIssue = new Map(
  beta2.map((record) => [comparisonKey(record), record]),
);
let priorKnown = 0;
let priorFixed = 0;
let unmatched = 0;
for (const record of beta3Current) {
  const predecessor = beta2ByIssue.get(comparisonKey(record));
  if (!predecessor) {
    unmatched += 1;
  } else if (/^Known Issues?$/.test(predecessor.status)) {
    priorKnown += 1;
  } else if (predecessor.status === "Fixed in beta 2") {
    priorFixed += 1;
  }
}
if (priorKnown !== 38 || priorFixed !== 1 || unmatched !== 3) {
  throw new Error(
    `Beta 3 boundary changed: known=${priorKnown}, fixed=${priorFixed}, unmatched=${unmatched}.`,
  );
}

const recordsByAlias = new Map([
  ["beta-1", beta1],
  ["beta-2", beta2Fixed],
  ["beta-3", beta3Current],
  ["beta-4", beta4Current],
  ["gm", gm],
]);
const expectedStatusByAlias = new Map([
  ["beta-2", "Fixed in beta 2"],
  ["beta-3", "Fixed in beta 3"],
  ["beta-4", "Fixed in beta 4"],
  ["gm", "Fixed in GM Seed"],
]);
let selectedHtmlOccurrences = 0;
let primaryLocatorAssertions = 0;
let predecessorAssertions = 0;
const locatorFailures = [];
let weakestPrimaryScore = Number.POSITIVE_INFINITY;
let weakestPrimaryMargin = Number.POSITIVE_INFINITY;
let weakestMarkerOverlap = Number.POSITIVE_INFINITY;
const resolvedOccurrences = new Map();

for (const event of bundle.events) {
  const alias = event.target.routeAlias;
  if (alias === "beta-5") continue;
  const records = recordsByAlias.get(alias);
  if (!records) {
    throw new Error(`No retained HTML state is configured for ${alias}.`);
  }
  const expectedStatus = expectedStatusByAlias.get(alias);

  for (const change of event.changes) {
    selectedHtmlOccurrences += 1;
    const primaryCitation = change.citations.find((citation) => {
      if (!citation.locator?.includes(" — ")) return false;
      if (alias === "beta-1") {
        return / — (?:Notes?|Known Issues?); /.test(citation.locator);
      }
      return citation.locator.includes(` — ${expectedStatus}; `);
    });
    if (!primaryCitation) {
      locatorFailures.push(
        `${alias}/${change.key} has no primary source locator.`,
      );
      continue;
    }
    const locatorMatch = primaryCitation.locator.match(/^(.*?) — (.*?); (.+)$/);
    if (!locatorMatch) {
      locatorFailures.push(
        `${alias}/${change.key} has an unparseable locator: ${primaryCitation.locator}`,
      );
      continue;
    }
    const [, component, status, marker] = locatorMatch;
    const candidateRecords = records.filter(
      (record) => record.component === component && record.status === status,
    );
    const editorialTokens = identityTokens(
      marker,
      change.title,
      change.canonicalSummary,
    );
    const markerTokens = identityTokens(marker);
    const ranked = candidateRecords
      .map((record) => {
        const sourceTokens = identityTokens(record.text);
        const markerOverlap = overlapCount(markerTokens, sourceTokens);
        return {
          record,
          markerOverlap,
          score:
            overlapCount(editorialTokens, sourceTokens) + markerOverlap * 2,
        };
      })
      .sort(
        (left, right) =>
          right.score - left.score || right.markerOverlap - left.markerOverlap,
      );
    const best = ranked[0];
    const runnerUp = ranked[1];
    const margin = runnerUp ? best.score - runnerUp.score : best?.score || 0;
    if (
      !best ||
      best.score < 2 ||
      best.markerOverlap < 1 ||
      (runnerUp &&
        best.score === runnerUp.score &&
        best.markerOverlap === runnerUp.markerOverlap)
    ) {
      locatorFailures.push(
        `${alias}/${change.key} did not uniquely resolve ${component} — ${status}; ${marker} (best=${best?.score || 0}/${best?.markerOverlap || 0}: ${best?.record.text || "none"}; second=${runnerUp?.score || 0}/${runnerUp?.markerOverlap || 0}: ${runnerUp?.record.text || "none"})`,
      );
      continue;
    }
    const matchingRecord = best.record;
    weakestPrimaryScore = Math.min(weakestPrimaryScore, best.score);
    weakestPrimaryMargin = Math.min(weakestPrimaryMargin, margin);
    weakestMarkerOverlap = Math.min(weakestMarkerOverlap, best.markerOverlap);
    const resolvedForAlias = resolvedOccurrences.get(alias) || new Map();
    resolvedForAlias.set(comparisonKey(matchingRecord), {
      key: change.key,
      record: matchingRecord,
    });
    resolvedOccurrences.set(alias, resolvedForAlias);
    primaryLocatorAssertions += 1;

    if (alias === "beta-3") {
      const predecessor = beta2ByIssue.get(comparisonKey(matchingRecord));
      if (!predecessor || !/^Known Issues?$/.test(predecessor.status)) {
        locatorFailures.push(
          `${alias}/${change.key} has no exact Beta 2 Known Issue predecessor.`,
        );
        continue;
      }
      const predecessorCitation = change.citations.find((citation) =>
        citation.locator?.includes(" — predecessor Known Issue; "),
      );
      if (
        !predecessorCitation ||
        !predecessorCitation.locator.startsWith(`${component} — `)
      ) {
        locatorFailures.push(
          `${alias}/${change.key} has an invalid predecessor locator.`,
        );
        continue;
      }
      predecessorAssertions += 1;
    }
  }
}
if (locatorFailures.length > 0) {
  const failureOffset = Number(process.env.IOS8_AUDIT_FAILURE_OFFSET || 0);
  writeSync(
    2,
    `${locatorFailures.slice(failureOffset, failureOffset + 3).join("\n")}\n`,
  );
  throw new Error(`Locator audit failed (${locatorFailures.length}).`);
}
if (
  selectedHtmlOccurrences !== 181 ||
  primaryLocatorAssertions !== 181 ||
  predecessorAssertions !== 38
) {
  throw new Error(
    `Locator closure changed: selected=${selectedHtmlOccurrences}, primary=${primaryLocatorAssertions}, predecessor=${predecessorAssertions}.`,
  );
}

console.log(`beta1_note_records=${beta1Notes.length}`);
for (const [name, [count, sha]] of actualInventories) {
  console.log(`${name}_records=${count}`);
  console.log(`${name}_inventory_sha=${sha}`);
}
console.log(`beta3_prior_known=${priorKnown}`);
console.log(`beta3_prior_fixed=${priorFixed}`);
console.log(`beta3_unmatched=${unmatched}`);
console.log(`selected_html_occurrences=${selectedHtmlOccurrences}`);
console.log(`primary_locator_assertions=${primaryLocatorAssertions}`);
console.log(`beta3_predecessor_assertions=${predecessorAssertions}`);
console.log(`weakest_primary_score=${weakestPrimaryScore}`);
console.log(`weakest_primary_margin=${weakestPrimaryMargin}`);
console.log(`weakest_marker_overlap=${weakestMarkerOverlap}`);
const expectedExactTransitions = new Map([
  ["beta-1/beta-2", 11],
  ["beta-2/beta-3", 0],
  ["beta-3/beta-4", 0],
  ["beta-4/gm", 0],
  ["beta-1/gm", 1],
  ["beta-2/gm", 1],
]);
for (const [previousAlias, currentAlias] of [
  ["beta-1", "beta-2"],
  ["beta-2", "beta-3"],
  ["beta-3", "beta-4"],
  ["beta-4", "gm"],
  ["beta-1", "gm"],
  ["beta-2", "gm"],
]) {
  const previous = resolvedOccurrences.get(previousAlias) || new Map();
  const current = resolvedOccurrences.get(currentAlias) || new Map();
  const transitions = [...current.entries()]
    .filter(([identity]) => previous.has(identity))
    .map(([identity, occurrence]) => ({
      previousKey: previous.get(identity).key,
      currentKey: occurrence.key,
      component: occurrence.record.component,
    }));
  const pair = `${previousAlias}/${currentAlias}`;
  if (
    transitions.length !== expectedExactTransitions.get(pair) ||
    transitions.some(
      (transition) => transition.previousKey !== transition.currentKey,
    )
  ) {
    throw new Error(
      `${pair} canonical transition closure changed: ${JSON.stringify(transitions)}`,
    );
  }
  console.log(
    `${previousAlias}_to_${currentAlias}_shared_identities=${transitions.length}`,
  );
}
console.log(
  `bundle_changes=${[...counts.values()].reduce((a, b) => a + b, 0)}`,
);
