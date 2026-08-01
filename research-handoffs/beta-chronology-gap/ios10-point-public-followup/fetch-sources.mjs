import {execFile} from "node:child_process";
import {createHash} from "node:crypto";
import {mkdir, readFile, writeFile} from "node:fs/promises";
import path from "node:path";
import {promisify} from "node:util";
import {fileURLToPath} from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(here, "../../../");
const evidenceDir = path.join(
  repoRoot,
  "tmp/research-evidence/beta-chronology-gap/ios10-point-public-followup",
);
const rawDir = path.join(evidenceDir, "raw");
const execFileAsync = promisify(execFile);
const sha256 = (value) =>
  createHash("sha256").update(value).digest("hex");

const sourceSpecs = [
  {
    sourceId: "followup-ios102-pb3-macrumors-status-1302",
    url: "https://www.macrumors.com/2016/11/14/whats-new-in-ios-10-2-beta-3/",
    filename: "followup-ios102-pb3-macrumors-status-1302.raw.html",
  },
  {
    sourceId: "followup-ios102-pb3-macrumors-revision-1129",
    url: "https://www.macrumors.com/2016/11/14/apple-seeds-ios-10-2-beta-3-to-developers/",
    fetchUrl:
      "https://web.archive.org/web/20161114192927id_/https://www.macrumors.com/2016/11/14/apple-seeds-ios-10-2-beta-3-to-developers/",
    archive: {
      provider: "Internet Archive Wayback Machine",
      captureTimestamp: "2016-11-14T19:29:27Z",
      reason:
        "Historical revision captured at 11:29:27 a.m. Pacific, before the public-beta update appeared.",
    },
    filename: "followup-ios102-pb3-macrumors-revision-1129.raw.html",
  },
  {
    sourceId: "followup-ios102-pb3-macrumors-revision-1455",
    url: "https://www.macrumors.com/2016/11/14/apple-seeds-ios-10-2-beta-3-to-developers/",
    fetchUrl:
      "https://web.archive.org/web/20161114225546id_/https://www.macrumors.com/2016/11/14/apple-seeds-ios-10-2-beta-3-to-developers/",
    archive: {
      provider: "Internet Archive Wayback Machine",
      captureTimestamp: "2016-11-14T22:55:46Z",
      reason:
        "Historical revision captured at 2:55:46 p.m. Pacific, after the public-beta update appeared.",
    },
    filename: "followup-ios102-pb3-macrumors-revision-1455.raw.html",
  },
  {
    sourceId: "followup-ios102-pb3-neowin",
    url: "https://www.neowin.net/news/apple-releases-ios-102-and-macos-10122-public-beta-3-watchos-311-developer-beta-3/",
    fetchUrl:
      "https://web.archive.org/web/20161117150251id_/https://www.neowin.net/news/apple-releases-ios-102-and-macos-10122-public-beta-3-watchos-311-developer-beta-3/",
    archive: {
      provider: "Internet Archive Wayback Machine",
      captureTimestamp: "2016-11-17T15:02:51Z",
      reason:
        "The live article currently returns HTTP 500; the archived publisher response preserves the contemporaneous article.",
    },
    filename: "followup-ios102-pb3-neowin.raw.html",
  },
  {
    sourceId: "followup-ios102-pb3-redmondpie",
    url: "https://www.redmondpie.com/ios-10.2-beta-3-all-new-changes-and-features-in-one-place-screenshots/",
    filename: "followup-ios102-pb3-redmondpie.raw.html",
  },
  {
    sourceId: "followup-ios102-pb3-geekygadgets",
    url: "https://www.geeky-gadgets.com/apple-releases-ios-10-2-beta-3-15-11-2016/",
    filename: "followup-ios102-pb3-geekygadgets.raw.html",
  },
  {
    sourceId: "followup-ios102-pb3-taisy0",
    url: "https://taisy0.com/2016/11/15/76422.html",
    filename: "followup-ios102-pb3-taisy0.raw.html",
  },
  {
    sourceId: "followup-ios1021-pb3-kobonemi",
    url: "https://www.kobonemi.com/entry/iOS_10.2.1_Public_Beta_3",
    filename: "followup-ios1021-pb3-kobonemi.raw.html",
  },
  {
    sourceId: "followup-ios1021-pb3-taisy0",
    url: "https://taisy0.com/2017/01/10/78466.html",
    filename: "followup-ios1021-pb3-taisy0.raw.html",
  },
];

await mkdir(rawDir, {recursive: true});
const capturedAt = new Date().toISOString();
const results = [];

for (const spec of sourceSpecs) {
  const rawPath = path.join(rawDir, spec.filename);
  const {stdout} = await execFileAsync(
    "curl",
    [
      "--fail",
      "--location",
      "--silent",
      "--show-error",
      "--compressed",
      "--max-time",
      "90",
      "--user-agent",
      "VersionRecord historical-research capture/1.0 (+https://www.versionrecord.com)",
      "--header",
      "Accept: text/html,application/xhtml+xml",
      "--header",
      "Accept-Language: en-US,en;q=0.8,ja;q=0.7",
      "--output",
      rawPath,
      "--write-out",
      "%{json}",
      spec.fetchUrl ?? spec.url,
    ],
    {maxBuffer: 2 * 1024 * 1024},
  );
  const transfer = JSON.parse(stdout);
  const bytes = await readFile(rawPath);
  if (transfer.http_code < 200 || transfer.http_code >= 300) {
    throw new Error(
      `${spec.sourceId} returned HTTP ${transfer.http_code}`,
    );
  }
  results.push({
    sourceId: spec.sourceId,
    requestedUrl: spec.url,
    retrievalUrl: spec.fetchUrl ?? spec.url,
    finalUrl: transfer.url_effective,
    capturedAt,
    httpStatus: transfer.http_code,
    contentType: transfer.content_type,
    remoteIp: transfer.remote_ip,
    sslVerifyResult: transfer.ssl_verify_result,
    archive: spec.archive ?? null,
    filename: spec.filename,
    rawBytes: bytes.byteLength,
    rawSha256: sha256(bytes),
  });
}

const manifest = {
  formatVersion: 1,
  batchId: "beta-chronology-gap-ios10-point-public-followup",
  capturedAt,
  captureMethod: "direct-http-html",
  userAgent:
    "VersionRecord historical-research capture/1.0 (+https://www.versionrecord.com)",
  sourceCount: results.length,
  sources: results,
};

await writeFile(
  path.join(evidenceDir, "fetch-manifest.json"),
  `${JSON.stringify(manifest, null, 2)}\n`,
);

console.log(
  JSON.stringify(
    {
      evidenceDir: path.relative(repoRoot, evidenceDir),
      sourceCount: results.length,
      sources: results.map(
        ({sourceId, httpStatus, rawBytes, rawSha256, finalUrl}) => ({
          sourceId,
          httpStatus,
          rawBytes,
          rawSha256,
          finalUrl,
        }),
      ),
    },
    null,
    2,
  ),
);
