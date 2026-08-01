import { readFileSync } from "node:fs";

const args = process.argv.slice(2);

const valueFor = (flag) => {
  const index = args.indexOf(flag);
  if (index === -1 || !args[index + 1]) {
    throw new Error(`Missing ${flag}`);
  }
  return args[index + 1];
};

const decodeEntities = (value) =>
  value
    .replace(/&#x([0-9a-f]+);?/gi, (_, hex) =>
      String.fromCodePoint(Number.parseInt(hex, 16)),
    )
    .replace(/&#([0-9]+);?/g, (_, decimal) =>
      String.fromCodePoint(Number.parseInt(decimal, 10)),
    )
    .replace(
      /&(nbsp|amp|lt|gt|quot|apos|rsquo|lsquo|rdquo|ldquo|ndash|mdash);/gi,
      (entity, name) =>
        ({
          nbsp: " ",
          amp: "&",
          lt: "<",
          gt: ">",
          quot: '"',
          apos: "'",
          rsquo: "’",
          lsquo: "‘",
          rdquo: "”",
          ldquo: "“",
          ndash: "–",
          mdash: "—",
        })[name.toLowerCase()] || entity,
    );

const removeNonContent = (html) =>
  html
    .replace(/<!--[\s\S]*?-->/g, " ")
    .replace(/<(script|style)\b[\s\S]*?<\/\1>/gi, " ");

const normalizeText = (value) =>
  decodeEntities(value)
    .normalize("NFKC")
    .replace(/[\u00ad\u200b-\u200d\ufeff]/g, "")
    .replace(/[‐‑‒–—―]/g, "-")
    .replace(/[‘’]/g, "'")
    .replace(/[“”]/g, '"')
    .replace(/\s+/g, " ")
    .replace(/\(\s+/g, "(")
    .replace(/\s+\)/g, ")")
    .trim()
    .toLowerCase();

const htmlText = (html) =>
  normalizeText(
    removeNonContent(html)
      .replace(/<br\s*\/?>/gi, "\n")
      .replace(
        /<\/(p|li|h1|h2|h3|h4|section|div|article|header|footer|tr)>/gi,
        "\n",
      )
      .replace(/<[^>]+>/g, " "),
  );

const htmlLines = (html) =>
  removeNonContent(html)
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(
      /<\/(p|li|h1|h2|h3|h4|section|div|article|header|footer|tr)>/gi,
      "\n",
    )
    .replace(/<[^>]+>/g, " ")
    .split(/\n+/)
    .map(normalizeText)
    .filter(Boolean);

const parseLocator = (locator) => {
  const match = locator.match(/^(.*?) — (.*?); (.+)$/);
  if (!match) {
    throw new Error(`Unexpected locator: ${locator}`);
  }
  return {
    component: normalizeText(match[1]),
    status: normalizeText(match[2]),
    fragments: match[3].split(" | ").map(normalizeText),
  };
};

const bundlePath = valueFor("--bundle");
const bundle = JSON.parse(readFileSync(bundlePath, "utf8"));
const sourcePaths = {
  "beta-1": valueFor("--beta1"),
  "beta-3": valueFor("--beta3"),
  "beta-4": valueFor("--beta4"),
  "beta-5": valueFor("--beta5"),
};
const sourceHtml = Object.fromEntries(
  Object.entries(sourcePaths).map(([alias, path]) => [
    alias,
    readFileSync(path, "utf8"),
  ]),
);
const eventByAlias = new Map(
  bundle.events.map((event) => [event.target.routeAlias, event]),
);
const selectedAliases = ["beta-1", "beta-3", "beta-4", "beta-5"];

if (
  bundle.events.length !== selectedAliases.length ||
  selectedAliases.some((alias) => !eventByAlias.has(alias))
) {
  throw new Error("Unexpected iOS 9 route closure.");
}

const parsedChanges = new Map(
  selectedAliases.map((alias) => [
    alias,
    eventByAlias.get(alias).changes.map((change) => ({
      change,
      locator: parseLocator(change.citations[0].locator),
    })),
  ]),
);

const allComponents = new Set(
  [...parsedChanges.values()].flat().map(({ locator }) => locator.component),
);
const allStatuses = new Set(
  [...parsedChanges.values()].flat().map(({ locator }) => locator.status),
);

const beta1Groups = (() => {
  const lines = htmlLines(sourceHtml["beta-1"]);
  const start = lines.findIndex(
    (line, index) =>
      line === "notes and known issues" &&
      lines[index + 1] ===
        "the following issues relate to using ios sdk 9.0 to develop code.",
  );
  if (start === -1) {
    throw new Error("Could not locate the Beta 1 Apple transcript boundary.");
  }
  const body = lines.slice(start + 2);
  const groups = [];
  let component = "";
  let status = "";
  let text = [];
  const finish = () => {
    if (component && status) {
      groups.push({
        component,
        status,
        text: normalizeText(text.join(" ")),
      });
    }
    text = [];
  };
  for (const line of body) {
    const statusCandidate =
      allStatuses.has(line) && (!allComponents.has(line) || !status);
    if (component && statusCandidate) {
      finish();
      status = line;
      continue;
    }
    if (allComponents.has(line)) {
      finish();
      component = line;
      status = "";
      continue;
    }
    if (component && allStatuses.has(line)) {
      finish();
      status = line;
      continue;
    }
    if (component && status) {
      text.push(line);
    }
  }
  finish();
  return groups;
})();

const appleGroups = (html) => {
  const clean = removeNonContent(html);
  const headingPattern =
    /<h3\b[^>]*class=["'][^"']*\bsection-name\b[^"']*["'][^>]*>([\s\S]*?)<\/h3>/gi;
  const headings = [];
  for (const match of clean.matchAll(headingPattern)) {
    headings.push({
      text: normalizeText(match[1].replace(/<[^>]+>/g, " ")),
      start: match.index,
      end: match.index + match[0].length,
    });
  }
  const groups = [];
  let component = "";
  let status = "";
  for (let index = 0; index < headings.length; index += 1) {
    const heading = headings[index];
    const ambiguousHeading =
      allStatuses.has(heading.text) && allComponents.has(heading.text);
    const nextHeadingIsStatus = allStatuses.has(headings[index + 1]?.text);
    const ambiguousComponent =
      ambiguousHeading && Boolean(status) && nextHeadingIsStatus;
    const statusCandidate =
      allStatuses.has(heading.text) &&
      (!allComponents.has(heading.text) || !status || !ambiguousComponent);
    if (component && statusCandidate) {
      status = heading.text;
    } else if (allComponents.has(heading.text)) {
      component = heading.text;
      status = "";
      continue;
    } else if (component && allStatuses.has(heading.text)) {
      status = heading.text;
    } else {
      continue;
    }
    const end = headings[index + 1]?.start ?? clean.length;
    groups.push({
      component,
      status,
      text: htmlText(clean.slice(heading.end, end)),
    });
  }
  return { groups, headings };
};

const directStates = Object.fromEntries(
  ["beta-3", "beta-4", "beta-5"].map((alias) => [
    alias,
    appleGroups(sourceHtml[alias]),
  ]),
);

let groupAssertions = 0;
let fragmentAssertions = 0;
const failures = [];

for (const alias of selectedAliases) {
  const groups = alias === "beta-1" ? beta1Groups : directStates[alias].groups;
  for (const { change, locator } of parsedChanges.get(alias)) {
    const candidates = groups.filter(
      (group) =>
        group.component === locator.component &&
        group.status === locator.status,
    );
    groupAssertions += 2;
    if (candidates.length === 0) {
      failures.push(
        `${alias}:${change.key}:missing ${locator.component} / ${locator.status}`,
      );
      continue;
    }
    for (const fragment of locator.fragments) {
      fragmentAssertions += 1;
      if (!candidates.some((group) => group.text.includes(fragment))) {
        failures.push(`${alias}:${change.key}:missing fragment "${fragment}"`);
      }
    }
  }
}

let transitionFragments = 0;
for (const alias of ["beta-4", "beta-5"]) {
  const previousAlias = alias === "beta-4" ? "beta-3" : "beta-4";
  const previousText = htmlText(sourceHtml[previousAlias]);
  for (const { change, locator } of parsedChanges.get(alias)) {
    if (!change.verificationMethod.includes("preceding retained page")) {
      continue;
    }
    for (const fragment of locator.fragments) {
      transitionFragments += 1;
      if (previousText.includes(fragment)) {
        failures.push(
          `${alias}:${change.key}:addition fragment existed in ${previousAlias}`,
        );
      }
    }
  }
}

const expectedTransitions = 18;
if (transitionFragments !== expectedTransitions) {
  failures.push(
    `transition-fragment-count:${transitionFragments}/${expectedTransitions}`,
  );
}

const statusGroupCounts = Object.fromEntries(
  Object.entries(directStates).map(([alias, state]) => [
    alias,
    state.groups.length,
  ]),
);
const componentCounts = Object.fromEntries(
  Object.entries(directStates).map(([alias, state]) => [
    alias,
    new Set(state.groups.map((group) => group.component)).size,
  ]),
);

console.log(
  `routes=${selectedAliases.length} occurrences=${
    [...parsedChanges.values()].flat().length
  }`,
);
console.log(
  `component_status_assertions=${groupAssertions} fragment_assertions=${fragmentAssertions}`,
);
console.log(
  `transition_fragments=${transitionFragments}/${expectedTransitions}`,
);
console.log(
  `apple_components=${JSON.stringify(componentCounts)} apple_status_groups=${JSON.stringify(statusGroupCounts)}`,
);

if (args.includes("--copyright")) {
  const editorial = [];
  for (const event of bundle.events) {
    editorial.push(event.summary);
    editorial.push(
      ...(event.article?.blocks || [])
        .map((block) => block.text)
        .filter(Boolean),
    );
    for (const change of event.changes) {
      editorial.push(
        change.title,
        change.canonicalSummary,
        change.summary,
        change.verificationMethod,
      );
    }
  }
  const wordTokens = (value) =>
    value
      .toLowerCase()
      .match(/[a-z0-9]+/g)
      ?.filter((word) => !/^[0-9]{8}$/.test(word)) || [];
  const sourceTokens = wordTokens(
    Object.values(sourceHtml).map(htmlText).join(" "),
  );
  const editorialTokens = editorial.map((text) => ({
    text,
    words: wordTokens(text),
  }));
  let best = { count: 0, phrase: "", editorial: "" };
  const maximum = Math.min(
    30,
    sourceTokens.length,
    Math.max(...editorialTokens.map(({ words }) => words.length)),
  );
  for (let length = maximum; length >= 1 && best.count === 0; length -= 1) {
    const sourceNgrams = new Set();
    for (let index = 0; index <= sourceTokens.length - length; index += 1) {
      sourceNgrams.add(sourceTokens.slice(index, index + length).join("|"));
    }
    for (const item of editorialTokens) {
      for (let index = 0; index <= item.words.length - length; index += 1) {
        const phrase = item.words.slice(index, index + length).join("|");
        if (sourceNgrams.has(phrase)) {
          best = {
            count: length,
            phrase: phrase.replaceAll("|", " "),
            editorial: item.text,
          };
          break;
        }
      }
      if (best.count) {
        break;
      }
    }
  }
  console.log(`max_overlap_words=${best.count}`);
  console.log(`overlap_phrase=${best.phrase}`);
  console.log(`overlap_editorial=${best.editorial}`);
}

console.log(`failures=${failures.length}`);
if (failures.length > 0) {
  console.error(failures.join("\n"));
  process.exit(1);
}
