import {createHash} from "node:crypto";
import {copyFile, mkdir, readFile, writeFile} from "node:fs/promises";
import path from "node:path";
import {fileURLToPath} from "node:url";
import {JSDOM, VirtualConsole} from "jsdom";
import {batchId, evidenceRoot, researchCutoff} from "./research-data.mjs";
import {sourceSpecs} from "./source-specs.mjs";

const here = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(here, "../../../");
const rawDirectory = path.join(repoRoot, evidenceRoot, "raw");
const selectedDirectory = path.join(repoRoot, evidenceRoot, "selected");
const sha256 = (bytes) =>
  createHash("sha256").update(bytes).digest("hex");
const safeName = (sourceId) =>
  sourceId.replaceAll(/[^a-z0-9-]+/gi, "-").toLowerCase();
const clean = (value) => String(value ?? "").replaceAll(/\s+/g, " ").trim();

await Promise.all([
  mkdir(rawDirectory, {recursive: true}),
  mkdir(selectedDirectory, {recursive: true}),
]);

const selectEvidence = (bytes, spec) => {
  const virtualConsole = new VirtualConsole();
  const dom = new JSDOM(bytes.toString("utf8"), {virtualConsole});
  const document = dom.window.document;
  for (const node of document.querySelectorAll(
    "script,style,noscript,svg,nav,footer",
  )) {
    node.remove();
  }
  const title = clean(
    document.querySelector('meta[property="og:title"]')?.content ??
      document.title,
  );
  const publishedAt =
    document.querySelector('meta[property="article:published_time"]')
      ?.content ??
    document.querySelector('meta[name="date"]')?.content ??
    document.querySelector("time[datetime]")?.getAttribute("datetime") ??
    null;
  const modifiedAt =
    document.querySelector('meta[property="article:modified_time"]')
      ?.content ?? null;
  const blocks = [...document.querySelectorAll("h1,h2,h3,h4,h5,p,li,time")]
    .map((node) => clean(node.textContent))
    .filter(
      (text) =>
        text.length >= 12 &&
        text.length <= 900 &&
        (/tvos/i.test(text) ||
          /public beta|publieke beta|public beta testers/i.test(text)),
    );
  const excerpts = [...new Set(blocks)].slice(0, 160);
  return {
    formatVersion: 1,
    sourceId: spec.sourceId,
    canonicalUrl: spec.canonicalUrl,
    title,
    publishedAt,
    modifiedAt,
    locatorHints: {
      selection:
        "Heading/paragraph/list/time blocks mentioning tvOS or an explicit public-beta audience; exact candidate assignments are added by the packet builder.",
      excerptCount: excerpts.length,
    },
    excerpts,
    copyrightHandling:
      "Bounded claim-level extracts only; no article body is republished in the committed packet.",
  };
};

const captureOne = async (spec) => {
  const rawFilename = `${safeName(spec.sourceId)}.html`;
  const selectedFilename = `${safeName(spec.sourceId)}.json`;
  const rawPath = path.join(rawDirectory, rawFilename);
  const selectedPath = path.join(selectedDirectory, selectedFilename);
  let bytes;
  let finalUrl = spec.canonicalUrl;
  let captureMethod;

  if (spec.localReusePath) {
    const reusePath = path.join(repoRoot, spec.localReusePath);
    bytes = await readFile(reusePath);
    await copyFile(reusePath, rawPath);
    captureMethod = "verified-local-reuse";
  } else {
    const response = await fetch(spec.canonicalUrl, {
      redirect: "follow",
      headers: {
        "user-agent":
          "Mozilla/5.0 (compatible; VersionRecord historical research; +https://www.versionrecord.com)",
        accept: "text/html,application/xhtml+xml",
      },
    });
    bytes = Buffer.from(await response.arrayBuffer());
    if (!response.ok || bytes.byteLength < 500) {
      throw new Error(
        `${spec.sourceId}: HTTP ${response.status}; ${bytes.byteLength} bytes`,
      );
    }
    finalUrl = response.url;
    await writeFile(rawPath, bytes);
    captureMethod = "http-html";
  }

  const selected = Buffer.from(
    `${JSON.stringify(selectEvidence(bytes, spec), null, 2)}\n`,
  );
  await writeFile(selectedPath, selected);
  return {
    sourceId: spec.sourceId,
    publisher: spec.publisher,
    canonicalUrl: spec.canonicalUrl,
    finalUrl,
    status: 200,
    captureMethod,
    rawFilename,
    rawBytes: bytes.byteLength,
    rawSha256: sha256(bytes),
    selectedFilename,
    selectedBytes: selected.byteLength,
    selectedSha256: sha256(selected),
    ...(spec.localReusePath ? {reusedFrom: spec.localReusePath} : {}),
  };
};

const concurrency = 8;
const results = [];
let nextIndex = 0;
await Promise.all(
  Array.from({length: concurrency}, async () => {
    while (nextIndex < sourceSpecs.length) {
      const index = nextIndex;
      nextIndex += 1;
      try {
        results[index] = await captureOne(sourceSpecs[index]);
      } catch (error) {
        results[index] = {
          sourceId: sourceSpecs[index].sourceId,
          publisher: sourceSpecs[index].publisher,
          canonicalUrl: sourceSpecs[index].canonicalUrl,
          status: "failed",
          error: error instanceof Error ? error.message : String(error),
        };
      }
    }
  }),
);

const log = {
  formatVersion: 1,
  batchId,
  accessedAt: researchCutoff,
  sourceCount: sourceSpecs.length,
  successCount: results.filter(({status}) => status !== "failed").length,
  failureCount: results.filter(({status}) => status === "failed").length,
  results: results.sort((left, right) =>
    left.sourceId.localeCompare(right.sourceId),
  ),
};
await writeFile(
  path.join(repoRoot, evidenceRoot, "fetch-log.json"),
  `${JSON.stringify(log, null, 2)}\n`,
);
console.log(
  JSON.stringify(
    {
      sourceCount: log.sourceCount,
      successCount: log.successCount,
      failureCount: log.failureCount,
      failures: log.results.filter(({status}) => status === "failed"),
    },
    null,
    2,
  ),
);
