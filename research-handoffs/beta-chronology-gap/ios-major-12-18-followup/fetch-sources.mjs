import {createHash} from "node:crypto";
import {copyFile, mkdir, readFile, writeFile} from "node:fs/promises";
import path from "node:path";
import {fileURLToPath} from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(here, "../../../");
const evidenceRelative =
  "tmp/research-evidence/beta-chronology-gap/ios-major-12-18-followup";
const evidenceDir = path.join(repoRoot, evidenceRelative);
const priorLedgerPath = path.join(
  repoRoot,
  "research-handoffs/beta-chronology-gap/ipados-major-13-26/sources.json",
);
const priorLedger = JSON.parse(await readFile(priorLedgerPath, "utf8"));
const priorById = new Map(
  priorLedger.sources.map((source) => [source.sourceId, source]),
);
const sha256 = (bytes) =>
  createHash("sha256").update(bytes).digest("hex");

const freshSources = [
  [
    "appleinsider-ios12-pb1",
    "https://appleinsider.com/articles/18/06/25/apple-issues-first-public-betas-of-ios-12-macos-mojave-and-tvos-12",
  ],
  [
    "appleinsider-ios12-pb2",
    "https://appleinsider.com/articles/18/07/05/apple-issues-second-public-beta-of-ios-12",
  ],
  [
    "appleinsider-ios12-pb3",
    "https://appleinsider.com/articles/18/07/18/apple-rolls-out-third-public-beta-of-ios-12-tvos-12",
  ],
  [
    "9to5mac-ios12-pb4",
    "https://9to5mac.com/2018/07/31/ios-12-public-beta-4/",
  ],
  [
    "iphonecanada-ios12-pb5",
    "https://www.iphoneincanada.ca/2018/08/06/ios-12-public-beta-5-download/",
  ],
  [
    "iphonecanada-ios14-pb2",
    "https://www.iphoneincanada.ca/2020/07/09/how-to-install-ios-14-public-beta-iphone-ipad/",
  ],
  [
    "iphonecanada-ios15-pb2",
    "https://www.iphoneincanada.ca/2021/06/30/ios-15-beta-2-download-and-ipados-15-released-for-developers/",
  ],
  [
    "appleinsider-ios17-pb6",
    "https://appleinsider.com/articles/23/08/29/sixth-public-betas-for-ios-17-and-others-now-available",
  ],
  [
    "9to5mac-ios18-pb5",
    "https://9to5mac.com/2024/08/20/ios-18-public-beta-5-and-more-now-available-ahead-of-september-launch/",
  ]
];

const reuseMappings = [
  ["koc-ios14-pb2", "koc-ipados14-pb2"],
  ["forbes-ios15-pb2", "forbes-ipados15-pb2"],
  ["forbes-ios15-pb3", "forbes-ipados15-pb3"],
  ["wccftech-ios15-pb3", "wccftech-ipados15-pb3"]
];

await mkdir(evidenceDir, {recursive: true});
const results = [];

for (const [sourceId, priorSourceId] of reuseMappings) {
  const prior = priorById.get(priorSourceId);
  if (!prior) throw new Error(`Missing prior source ${priorSourceId}`);
  const sourcePath = path.join(repoRoot, prior.evidence.rawPath);
  const bytes = await readFile(sourcePath);
  const actualHash = sha256(bytes);
  if (actualHash !== prior.evidence.rawSha256) {
    throw new Error(`Prior raw hash drift for ${priorSourceId}`);
  }
  const html = bytes.toString("utf8");
  if (!/\biOS(?:\s|&nbsp;|&#xA0;)+1[45]\b/i.test(html)) {
    throw new Error(
      `${priorSourceId} does not retain an explicit iOS 14 or iOS 15 claim`,
    );
  }
  const filename = `reuse-${sourceId}.html`;
  await copyFile(sourcePath, path.join(evidenceDir, filename));
  results.push({
    sourceId,
    url: prior.canonicalUrl,
    finalUrl: prior.canonicalUrl,
    filename,
    status: 200,
    bytes: bytes.byteLength,
    sha256: actualHash,
    captureMethod: "verified-local-reuse",
    reusedFrom: {
      sourceId: priorSourceId,
      ledgerPath:
        "research-handoffs/beta-chronology-gap/ipados-major-13-26/sources.json",
      rawPath: prior.evidence.rawPath,
      expectedSha256: prior.evidence.rawSha256,
      platformVerification:
        "The retained raw page was re-read and contains an explicit iOS 14 or iOS 15 claim; no iPadOS-only claim was reused.",
      publisherFamily: prior.lineage.publisherFamily,
      independentForCorroboration:
        prior.lineage.independentForCorroboration
    }
  });
}

for (const [sourceId, url] of freshSources) {
  const filename = `fresh-${sourceId}.html`;
  try {
    const response = await fetch(url, {
      redirect: "follow",
      headers: {
        "user-agent":
          "Mozilla/5.0 (compatible; VersionRecord historical research; +https://www.versionrecord.com)",
        accept: "text/html,application/xhtml+xml"
      }
    });
    const bytes = Buffer.from(await response.arrayBuffer());
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}; ${bytes.length} response bytes`);
    }
    await writeFile(path.join(evidenceDir, filename), bytes);
    results.push({
      sourceId,
      url,
      finalUrl: response.url,
      filename,
      status: response.status,
      bytes: bytes.byteLength,
      sha256: sha256(bytes),
      captureMethod: "http-html"
    });
  } catch (error) {
    results.push({
      sourceId,
      url,
      filename,
      status: "failed",
      error: error instanceof Error ? error.message : String(error)
    });
  }
}

const log = {
  formatVersion: 1,
  batchId: "beta-chronology-gap-ios-major-12-18-followup",
  accessedAt: new Date().toISOString(),
  evidencePath: evidenceRelative,
  sourceCount: results.length,
  reuseAttemptCount: reuseMappings.length,
  freshAttemptCount: freshSources.length,
  successCount: results.filter((result) => result.status !== "failed").length,
  failureCount: results.filter((result) => result.status === "failed").length,
  results: results.sort((left, right) =>
    left.sourceId.localeCompare(right.sourceId),
  )
};
await writeFile(
  path.join(here, "fetch-log.json"),
  `${JSON.stringify(log, null, 2)}\n`,
);

console.log(
  JSON.stringify(
    {
      sourceCount: log.sourceCount,
      successCount: log.successCount,
      failureCount: log.failureCount,
      failures: log.results.filter((result) => result.status === "failed")
    },
    null,
    2,
  ),
);
