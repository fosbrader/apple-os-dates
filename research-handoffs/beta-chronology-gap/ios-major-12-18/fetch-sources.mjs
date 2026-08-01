import {createHash} from "node:crypto";
import {copyFile, mkdir, readFile, writeFile} from "node:fs/promises";
import path from "node:path";
import {fileURLToPath} from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(here, "../../../");
const evidenceRelative =
  "tmp/research-evidence/beta-chronology-gap/ios-major-12-18";
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
  ["iculture-ios12", "https://www.iculture.nl/nieuws/ios-12-beta/"],
  ["iculture-ios13", "https://www.iculture.nl/nieuws/ios-13-beta/"],
  ["iculture-ios14", "https://www.iculture.nl/nieuws/ios-14-beta/"],
  ["iculture-ios15", "https://www.iculture.nl/nieuws/ios-15-beta/"],
  ["iculture-ios16", "https://www.iculture.nl/nieuws/ios-16-beta/"],
  ["iculture-ios17", "https://www.iculture.nl/nieuws/ios-17-beta/"],
  ["iculture-ios18", "https://www.iculture.nl/nieuws/ios-18-beta/"],
  ["imore-ios12", "https://www.imore.com/how-download-ios-12-public-beta"],
  ["imore-ios13", "https://www.imore.com/how-download-ios-13-public-beta"],
  ["imore-ios14", "https://www.imore.com/how-download-ios-14-public-beta"],
  ["imore-ios15", "https://www.imore.com/how-download-ios-15-public-beta"],
  [
    "imore-ios16",
    "https://www.imore.com/how-download-ios-16-public-beta-your-iphone",
  ],
  [
    "mr-ios12-dev7-pulled",
    "https://www.macrumors.com/2018/08/13/apple-pulls-ios-12-beta-7/",
  ],
  [
    "mr-ios12-pb6-after-withdrawal",
    "https://www.macrumors.com/2018/08/15/apple-seeds-ios-12-beta-8-to-developers/",
  ],
  [
    "mr-ios16-pb5",
    "https://www.macrumors.com/2022/08/24/apple-seeds-ios-16-public-beta-5/",
  ],
  [
    "mr-ios16-pb6",
    "https://www.macrumors.com/2022/08/29/apple-seeds-ios-16-beta-8-to-developers/",
  ],
  [
    "idb-ios15-pb2",
    "https://www.idownloadblog.com/2021/07/16/ios-15-public-beta-2/",
  ],
];

const reuseMappings = [
  ...Array.from({length: 7}, (_, index) => [
    `mr-ios13-pb${index + 1}`,
    `mr-ipados13-pb${index + 1}`,
  ]),
  ["mr-ios14-opening", "mr-ipados14-pb2"],
  ["mr-ios14-pb3", "mr-ipados14-pb3"],
  ...Array.from({length: 5}, (_, index) => [
    `mr-ios14-pb${index + 4}`,
    `mr-ipados14-pb${index + 4}`,
  ]),
  ["mr-ios15-opening", "mr-ipados15-pb2"],
  ["mr-ios15-pb2", "mr-ipados15-pb3"],
  ...Array.from({length: 5}, (_, index) => [
    `mr-ios15-pb${index + 4}`,
    `mr-ipados15-pb${index + 4}`,
  ]),
  ...Array.from({length: 4}, (_, index) => [
    `mr-ios16-pb${index + 1}`,
    `mr-ipados16-pb${index + 1}`,
  ]),
  ...Array.from({length: 6}, (_, index) => [
    `mr-ios17-pb${index + 1}`,
    `mr-ipados17-pb${index + 1}`,
  ]),
  ...Array.from({length: 6}, (_, index) => [
    `mr-ios18-pb${index + 1}`,
    `mr-ipados18-pb${index + 1}`,
  ]),
  ["forbes-ios14-pb3", "forbes-ipados14-pb3"],
  ["forbes-ios15-opening-as-pb2", "forbes-ipados15-pb2"],
  ["forbes-ios15-second-as-pb3", "forbes-ipados15-pb3"],
  ["osxd-ios15-pb4", "osxd-ipados15-pb4"],
  ["osxd-ios15-pb6", "osxd-ipados15-pb6"],
  ["redmondpie-ios14-pb3", "redmondpie-ipados14-pb3"],
  ["wccftech-ios15-second-as-pb3", "wccftech-ipados15-pb3"],
  ["osxd-ios17-pb4", "osxd-ipados17-pb4"],
  ["appleinsider-ios17-pb5", "appleinsider-ipados17-pb5"],
  ["9to5mac-ios18-pb4", "9to5mac-ipados18-pb4"],
  ["osxd-ios18-pb5", "osxd-ipados18-pb5"],
  ["9to5mac-ios18-pb6", "9to5mac-ipados18-pb6"],
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
  if (!/\biOS(?:\s|&nbsp;|&#xA0;)+1[3-8]\b/i.test(html)) {
    throw new Error(
      `${priorSourceId} does not retain an explicit iOS 13–18 platform claim`,
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
        "The retained raw page was re-read and contains an explicit iOS 13–18 platform claim; no iPadOS-only claim was reused.",
      publisherFamily: prior.lineage.publisherFamily,
      independentForCorroboration:
        prior.lineage.independentForCorroboration,
    },
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
        accept: "text/html,application/xhtml+xml",
      },
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
      captureMethod: "http-html",
    });
  } catch (error) {
    results.push({
      sourceId,
      url,
      filename,
      status: "failed",
      error: error instanceof Error ? error.message : String(error),
    });
  }
}

const log = {
  formatVersion: 1,
  accessedAt: "2026-07-31",
  sourceCount: results.length,
  reuseAttemptCount: reuseMappings.length,
  freshAttemptCount: freshSources.length,
  successCount: results.filter((result) => result.status !== "failed").length,
  failureCount: results.filter((result) => result.status === "failed").length,
  results: results.sort((left, right) =>
    left.sourceId.localeCompare(right.sourceId),
  ),
};
await writeFile(
  path.join(evidenceDir, "fetch-log.json"),
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
