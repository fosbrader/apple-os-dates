import {createHash} from "node:crypto";
import {copyFile, mkdir, readFile, writeFile} from "node:fs/promises";
import path from "node:path";
import {fileURLToPath} from "node:url";
import {evidenceRoot, researchCutoff} from "./research-data.mjs";
import {sourceSpecs} from "./source-specs.mjs";

const here = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(here, "../../../");
const evidenceDir = path.join(repoRoot, evidenceRoot, "raw");
const sha256 = (bytes) =>
  createHash("sha256").update(bytes).digest("hex");
const safeName = (sourceId) =>
  sourceId.replaceAll(/[^a-z0-9-]+/gi, "-").toLowerCase();

await mkdir(evidenceDir, {recursive: true});

const captureOne = async (source) => {
  const filename = `${safeName(source.sourceId)}.html`;
  const outputPath = path.join(evidenceDir, filename);

  for (const preferred of [
    source.localReusePath
      ? path.join(repoRoot, source.localReusePath)
      : null,
    source.localPreferredPath ?? null,
  ].filter(Boolean)) {
    try {
      const bytes = await readFile(preferred);
      await copyFile(preferred, outputPath);
      return {
        sourceId: source.sourceId,
        url: source.canonicalUrl,
        finalUrl: source.archiveUrl ?? source.canonicalUrl,
        filename,
        status: 200,
        bytes: bytes.byteLength,
        sha256: sha256(bytes),
        captureMethod: source.localReusePath
          ? "verified-local-reuse"
          : source.archiveUrl
            ? "internet-archive-replay"
            : "same-day-local-capture",
        ...(source.localReusePath
          ? {reusedFrom: source.localReusePath}
          : {
              capturedFrom: source.localPreferredPath,
              ...(source.archiveUrl
                ? {
                    archiveUrl: source.archiveUrl,
                    archiveCapturedAt: source.archiveCapturedAt,
                  }
                : {}),
            }),
      };
    } catch {
      // Fall through to a fresh HTTP capture.
    }
  }

  try {
    const response = await fetch(source.canonicalUrl, {
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
      sourceId: source.sourceId,
      url: source.canonicalUrl,
      finalUrl: response.url,
      filename,
      status: response.status,
      bytes: bytes.byteLength,
      sha256: sha256(bytes),
      captureMethod: "http-html",
    };
  } catch (error) {
    return {
      sourceId: source.sourceId,
      url: source.canonicalUrl,
      filename,
      status: "failed",
      error: error instanceof Error ? error.message : String(error),
    };
  }
};

const concurrency = 8;
const results = [];
let nextIndex = 0;
const workers = Array.from({length: concurrency}, async () => {
  while (nextIndex < sourceSpecs.length) {
    const index = nextIndex;
    nextIndex += 1;
    results[index] = await captureOne(sourceSpecs[index]);
  }
});
await Promise.all(workers);

const log = {
  formatVersion: 1,
  accessedAt: researchCutoff,
  sourceCount: sourceSpecs.length,
  successCount: results.filter((result) => result.status !== "failed").length,
  failureCount: results.filter((result) => result.status === "failed").length,
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
      failures: log.results.filter((result) => result.status === "failed"),
    },
    null,
    2,
  ),
);
