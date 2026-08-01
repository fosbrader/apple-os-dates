import {createHash} from "node:crypto";
import {mkdir, readFile, writeFile} from "node:fs/promises";
import path from "node:path";
import {fileURLToPath} from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(here, "../../../");
const evidenceRoot = path.join(repoRoot, "tmp/ios9-point-evidence");
const manifest = JSON.parse(
  await readFile(path.join(here, "corroboration-fetch-manifest.json"), "utf8"),
);
const results = [];

for (const source of manifest.sources) {
  const destination = path.join(evidenceRoot, source.filename);
  await mkdir(path.dirname(destination), {recursive: true});
  try {
    const response = await fetch(source.url, {
      redirect: "follow",
      headers: {
        "user-agent":
          "Mozilla/5.0 (compatible; VersionRecord historical research; +https://www.versionrecord.com)",
        accept: "text/html,application/xhtml+xml",
      },
    });
    const bytes = Buffer.from(await response.arrayBuffer());
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}; ${bytes.length} response bytes`);
    }
    await writeFile(destination, bytes);
    results.push({
      sourceId: source.sourceId,
      candidateId: source.candidateId,
      url: source.url,
      finalUrl: response.url,
      filename: source.filename,
      status: response.status,
      bytes: bytes.byteLength,
      sha256: createHash("sha256").update(bytes).digest("hex"),
    });
  } catch (error) {
    results.push({
      sourceId: source.sourceId,
      candidateId: source.candidateId,
      url: source.url,
      filename: source.filename,
      status: "failed",
      error: error instanceof Error ? error.message : String(error),
    });
  }
}

await writeFile(
  path.join(evidenceRoot, "corroboration-fetch-log.json"),
  `${JSON.stringify(
    {
      formatVersion: 1,
      batchId: manifest.batchId,
      accessedAt: manifest.accessedAt,
      sourceCount: manifest.sources.length,
      successCount: results.filter((result) => result.status !== "failed")
        .length,
      failureCount: results.filter((result) => result.status === "failed")
        .length,
      results,
    },
    null,
    2,
  )}\n`,
);

console.log(
  JSON.stringify(
    {
      sourceCount: results.length,
      successCount: results.filter((result) => result.status !== "failed")
        .length,
      failures: results.filter((result) => result.status === "failed"),
    },
    null,
    2,
  ),
);
