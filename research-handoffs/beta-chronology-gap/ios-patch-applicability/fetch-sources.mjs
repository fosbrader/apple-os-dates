import {createHash} from "node:crypto";
import {mkdir, readFile, writeFile} from "node:fs/promises";
import path from "node:path";
import {fileURLToPath} from "node:url";
import {
  batchId,
  evidenceRoot,
  researchCutoff,
} from "./research-data.mjs";
import {sourceSpecs} from "./source-specs.mjs";

const here = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(here, "../../../");
const rawDir = path.join(repoRoot, evidenceRoot, "raw");
const selectedDir = path.join(repoRoot, evidenceRoot, "selected");
const sha256 = (bytes) =>
  createHash("sha256").update(bytes).digest("hex");
const json = (value) => `${JSON.stringify(value, null, 2)}\n`;
const safeName = (value) =>
  value.replaceAll(/[^a-z0-9-]+/gi, "-").toLowerCase();
const decodeHtml = (value) =>
  value
    .replaceAll(/<script[\s\S]*?<\/script>/gi, " ")
    .replaceAll(/<style[\s\S]*?<\/style>/gi, " ")
    .replaceAll(/&#x([0-9a-f]+);/gi, (_, hex) =>
      String.fromCodePoint(Number.parseInt(hex, 16)),
    )
    .replaceAll(/&#([0-9]+);/g, (_, number) =>
      String.fromCodePoint(Number.parseInt(number, 10)),
    )
    .replaceAll("&amp;", "&")
    .replaceAll("&quot;", '"')
    .replaceAll("&#039;", "'")
    .replaceAll("&apos;", "'")
    .replaceAll("&nbsp;", " ")
    .replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">")
    .replaceAll(/<[^>]+>/g, " ")
    .replaceAll(/\\u0026/g, "&")
    .replaceAll(/\\u003c/gi, "<")
    .replaceAll(/\\u003e/gi, ">")
    .replaceAll(/\\["/]/g, (value) => value.slice(1))
    .replaceAll(/\s+/g, " ")
    .trim();
const firstMatch = (text, patterns) => {
  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match?.[1]) return decodeHtml(match[1]);
  }
  return null;
};
const metadataFor = (bytes, source) => {
  const text = bytes.toString("utf8");
  return {
    canonicalUrl:
      firstMatch(text, [
        /<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']+)["']/i,
        /<link[^>]+href=["']([^"']+)["'][^>]+rel=["']canonical["']/i,
        /property=["']og:url["'][^>]+content=["']([^"']+)["']/i,
      ]) ?? source.canonicalUrl,
    title:
      firstMatch(text, [
        /<title[^>]*>([\s\S]*?)<\/title>/i,
        /property=["']og:title["'][^>]+content=["']([^"']+)["']/i,
        /"headline"\s*:\s*"([^"]+)"/i,
      ]) ?? source.sourceId,
    publishedAt: firstMatch(text, [
      /"datePublished"\s*:\s*"([^"]+)"/i,
      /property=["']article:published_time["'][^>]+content=["']([^"']+)["']/i,
      /name=["']date["'][^>]+content=["']([^"']+)["']/i,
    ]),
    modifiedAt: firstMatch(text, [
      /"dateModified"\s*:\s*"([^"]+)"/i,
      /property=["']article:modified_time["'][^>]+content=["']([^"']+)["']/i,
    ]),
    plainText: decodeHtml(text),
  };
};
const contextFor = (plainText, needle) => {
  const lower = plainText.toLocaleLowerCase("en-US");
  const index = lower.indexOf(needle.toLocaleLowerCase("en-US"));
  if (index < 0) return null;
  return {
    needle,
    firstCharacterOffset: index,
    occurrenceCount:
      lower.split(needle.toLocaleLowerCase("en-US")).length - 1,
    context: plainText
      .slice(Math.max(0, index - 90), index + needle.length + 180)
      .trim(),
  };
};

await Promise.all([
  mkdir(rawDir, {recursive: true}),
  mkdir(selectedDir, {recursive: true}),
]);

const results = [];
for (const source of sourceSpecs) {
  const rawFilename = `${safeName(source.sourceId)}.html`;
  const selectedFilename = `${safeName(source.sourceId)}.json`;
  const rawPath = path.join(rawDir, rawFilename);
  const selectedPath = path.join(selectedDir, selectedFilename);
  try {
    const response = await fetch(source.fetchUrl, {
      redirect: "follow",
      headers: {
        "user-agent":
          "VersionRecord historical research capture/1.0 (+https://www.versionrecord.com/methodology)",
        accept: "text/html,application/xhtml+xml",
      },
      signal: AbortSignal.timeout(45_000),
    });
    if (!response.ok) {
      throw new Error(`HTTP ${response.status} ${response.statusText}`);
    }
    const bytes = Buffer.from(await response.arrayBuffer());
    await writeFile(rawPath, bytes);
    const metadata = metadataFor(bytes, source);
    const locators = source.requiredNeedles.map((needle) =>
      contextFor(metadata.plainText, needle),
    );
    const missingNeedles = source.requiredNeedles.filter(
      (_, index) => !locators[index],
    );
    if (missingNeedles.length > 0) {
      throw new Error(
        `Missing required retained text: ${missingNeedles.join(" | ")}`,
      );
    }
    const selected = {
      formatVersion: 1,
      batchId,
      sourceId: source.sourceId,
      capturedAt: new Date().toISOString(),
      researchCutoff,
      requestedUrl: source.fetchUrl,
      finalUrl: response.url,
      contentType: response.headers.get("content-type"),
      title: metadata.title,
      canonicalUrl: metadata.canonicalUrl,
      publishedAt: metadata.publishedAt,
      modifiedAt: metadata.modifiedAt,
      locators,
      qualification:
        "Contexts are mechanically selected from the frozen raw capture. They identify retained claims; applicability and Pacific-date normalization remain research conclusions.",
    };
    const selectedBytes = Buffer.from(json(selected));
    await writeFile(selectedPath, selectedBytes);
    results.push({
      sourceId: source.sourceId,
      status: "captured",
      requestedUrl: source.fetchUrl,
      finalUrl: response.url,
      rawFilename,
      selectedFilename,
      rawBytes: bytes.byteLength,
      rawSha256: sha256(bytes),
      selectedBytes: selectedBytes.byteLength,
      selectedSha256: sha256(selectedBytes),
    });
  } catch (error) {
    results.push({
      sourceId: source.sourceId,
      status: "failed",
      requestedUrl: source.fetchUrl,
      error: error instanceof Error ? error.message : String(error),
    });
  }
}

const fetchLog = {
  formatVersion: 1,
  batchId,
  capturedAt: new Date().toISOString(),
  evidenceRoot,
  sourceCount: sourceSpecs.length,
  successCount: results.filter((item) => item.status === "captured").length,
  failureCount: results.filter((item) => item.status === "failed").length,
  results,
};
await writeFile(
  path.join(repoRoot, evidenceRoot, "fetch-log.json"),
  json(fetchLog),
);
console.log(json(fetchLog));
if (fetchLog.failureCount > 0) process.exit(1);

