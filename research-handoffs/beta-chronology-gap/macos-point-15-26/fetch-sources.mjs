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
      // A missing reuse target falls through to a fresh capture.
    }
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

const concurrency = 8;
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
