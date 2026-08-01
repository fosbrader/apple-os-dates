import {createHash} from "node:crypto";
import {execFile} from "node:child_process";
import {mkdir, readFile, writeFile} from "node:fs/promises";
import path from "node:path";
import {promisify} from "node:util";
import {fileURLToPath} from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(here, "../../../");
const evidenceDir = path.join(
  repoRoot,
  "tmp/research-evidence/beta-chronology-gap/ipados-major-13-26-second-lineage",
);

const sourceSpecs = [
  {
    sourceId: "imore-ipados14-pb6-pb8",
    url: "https://www.imore.com/how-download-ipados-14-public-beta",
    filename: "source-01-imore-ipados14-public-beta-history.html",
  },
  {
    sourceId: "imore-ipados15-pb5-pb8",
    url: "https://www.imore.com/how-download-ipados-15-public-beta-your-ipad",
    filename: "source-02-imore-ipados15-public-beta-history.html",
  },
  {
    sourceId: "iphonetricks-ipados16-pb4",
    url: "https://www.iphonetricks.org/ios-16-public-beta-4-bugs-fixes-features/",
    fetchUrl:
      "https://web.archive.org/web/20220815223312id_/https://www.iphonetricks.org/ios-16-public-beta-4-bugs-fixes-features/",
    archive: {
      provider: "Internet Archive Wayback Machine",
      captureTimestamp: "2022-08-15T22:33:12Z",
      reason:
        "The live hostname presents a certificate-name mismatch and the unverified endpoint returns HTTP 404; the contemporaneous archived response preserves the publisher page.",
    },
    filename: "source-03-iphonetricks-ipados16-public-beta-4.html",
  },
  {
    sourceId: "osxd-ipados17-pb6",
    url: "https://osxdaily.com/2023/08/30/ios-17-public-beta-6-released-for-download/",
    filename: "source-04-osxd-ipados17-public-beta-6.html",
  },
  {
    sourceId: "osxd-ipados18-pb6",
    url: "https://osxdaily.com/2024/08/29/public-beta-6-of-macos-sequoia-ios-18-ipados-18-available-now/",
    filename: "source-05-osxd-ipados18-public-beta-6.html",
  },
];

const sha256 = (value) =>
  createHash("sha256").update(value).digest("hex");
const execFileAsync = promisify(execFile);

await mkdir(evidenceDir, {recursive: true});

const capturedAt = new Date().toISOString();
const results = [];

for (const spec of sourceSpecs) {
  const rawPath = path.join(evidenceDir, spec.filename);
  const {stdout} = await execFileAsync(
    "curl",
    [
      "--fail",
      "--location",
      "--silent",
      "--show-error",
      "--max-time",
      "60",
      "--user-agent",
      "VersionRecord historical-research capture/1.0 (+https://www.versionrecord.com)",
      "--header",
      "Accept: text/html,application/xhtml+xml",
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
    rawBytes: bytes.length,
    rawSha256: sha256(bytes),
  });
}

const manifest = {
  formatVersion: 1,
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
