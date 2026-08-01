import {createHash} from "node:crypto";
import {copyFile, mkdir, readFile, writeFile} from "node:fs/promises";
import path from "node:path";
import {fileURLToPath} from "node:url";
import {evidenceRoot, researchCutoff} from "./research-data.mjs";
import {sourceSpecs} from "./source-specs.mjs";

const here = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(here, "../../../");
const rawDirectory = path.join(repoRoot, evidenceRoot, "raw");
const sha256 = (bytes) =>
  createHash("sha256").update(bytes).digest("hex");
const safeName = (sourceId) =>
  sourceId.replaceAll(/[^a-z0-9-]+/gi, "-").toLowerCase();
const escapeHtml = (value) =>
  String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

await mkdir(rawDirectory, {recursive: true});

const captureOne = async (spec) => {
  const filename = `${safeName(spec.sourceId)}.html`;
  const outputPath = path.join(rawDirectory, filename);

  if (spec.localReusePath) {
    try {
      const reusePath = path.join(repoRoot, spec.localReusePath);
      const bytes = await readFile(reusePath);
      await copyFile(reusePath, outputPath);
      return {
        sourceId: spec.sourceId,
        requestedUrl: spec.canonicalUrl,
        finalUrl: spec.canonicalUrl,
        filename,
        status: 200,
        bytes: bytes.byteLength,
        sha256: sha256(bytes),
        captureMethod: "verified-local-reuse",
        reusedFrom: spec.localReusePath,
      };
    } catch {
      // A missing local reuse target falls through to a fresh HTTP capture.
    }
  }

  if (spec.indexedExtract) {
    const extract = spec.indexedExtract;
    const html = `<!doctype html>
<html lang="en">
<head><meta charset="utf-8"><title>Search-index extract: ${escapeHtml(extract.title)}</title></head>
<body>
<h1>Search-index extract — not a direct page capture</h1>
<dl>
<dt>Canonical source</dt><dd><a href="${escapeHtml(spec.canonicalUrl)}">${escapeHtml(spec.canonicalUrl)}</a></dd>
<dt>Publisher</dt><dd>${escapeHtml(spec.publisher)}</dd>
<dt>Index provider</dt><dd>${escapeHtml(extract.indexProvider)}</dd>
<dt>Index date shown by provider</dt><dd>${escapeHtml(extract.indexedAt)}</dd>
<dt>Research access cutoff</dt><dd>${escapeHtml(researchCutoff)}</dd>
<dt>Direct-fetch result</dt><dd>${escapeHtml(extract.originalFetchFailure)}</dd>
</dl>
<h2>Indexed fields</h2>
<p><strong>Title:</strong> ${escapeHtml(extract.title)}</p>
<p><strong>Published label:</strong> ${escapeHtml(extract.publishedLabel)}</p>
<p><strong>Short claim extract:</strong> ${escapeHtml(extract.excerpt)}</p>
<p>This bounded extract is retained because the canonical publisher page was indexed and visible in search, but its origin returned a gateway error to the packet fetcher. It is explicitly not represented as a full-page archive.</p>
</body>
</html>
`;
    const bytes = Buffer.from(html);
    await writeFile(outputPath, bytes);
    return {
      sourceId: spec.sourceId,
      requestedUrl: spec.canonicalUrl,
      finalUrl: spec.canonicalUrl,
      filename,
      status: 200,
      bytes: bytes.byteLength,
      sha256: sha256(bytes),
      captureMethod: "search-index-extract",
      indexProvider: extract.indexProvider,
      originalFetchFailure: extract.originalFetchFailure,
    };
  }

  try {
    const response = await fetch(spec.canonicalUrl, {
      redirect: "follow",
      headers: {
        "user-agent":
          "Mozilla/5.0 (compatible; VersionRecord historical research; +https://www.versionrecord.com)",
        accept: "text/html,application/xhtml+xml",
      },
    });
    const bytes = Buffer.from(await response.arrayBuffer());
    if (!response.ok || bytes.byteLength < 500) {
      throw new Error(
        `HTTP ${response.status}; ${bytes.byteLength} response bytes`,
      );
    }
    await writeFile(outputPath, bytes);
    return {
      sourceId: spec.sourceId,
      requestedUrl: spec.canonicalUrl,
      finalUrl: response.url,
      filename,
      status: response.status,
      bytes: bytes.byteLength,
      sha256: sha256(bytes),
      captureMethod: "http-html",
    };
  } catch (error) {
    return {
      sourceId: spec.sourceId,
      requestedUrl: spec.canonicalUrl,
      filename,
      status: "failed",
      error: error instanceof Error ? error.message : String(error),
    };
  }
};

const concurrency = 10;
const results = [];
let nextIndex = 0;
await Promise.all(
  Array.from({length: concurrency}, async () => {
    while (nextIndex < sourceSpecs.length) {
      const index = nextIndex;
      nextIndex += 1;
      results[index] = await captureOne(sourceSpecs[index]);
    }
  }),
);

const log = {
  formatVersion: 1,
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
