import {createHash} from "node:crypto";
import {copyFile, mkdir, readFile, writeFile} from "node:fs/promises";
import path from "node:path";
import {fileURLToPath} from "node:url";
import {
  allObservedAppearances,
  evidenceRoot,
  researchCutoff,
} from "./research-data.mjs";
import {
  sourceIdsForCandidate,
  sourceSpecsFor,
} from "./source-specs.mjs";

const here = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(here, "../../../");
const rawDir = path.join(repoRoot, evidenceRoot, "raw");
const selectedDir = path.join(repoRoot, evidenceRoot, "selected");
const sourceSpecs = sourceSpecsFor(allObservedAppearances);
const candidateClaimsBySourceId = new Map();
for (const candidate of allObservedAppearances) {
  for (const sourceId of sourceIdsForCandidate(candidate)) {
    const claims = candidateClaimsBySourceId.get(sourceId) ?? [];
    claims.push(candidate);
    candidateClaimsBySourceId.set(sourceId, claims);
  }
}
const sha256 = (bytes) =>
  createHash("sha256").update(bytes).digest("hex");
const safeName = (value) =>
  value.replaceAll(/[^a-z0-9-]+/gi, "-").toLowerCase();
const json = (value) => `${JSON.stringify(value, null, 2)}\n`;
const decodeHtml = (value) =>
  value
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
    .replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">")
    .replaceAll(/<[^>]+>/g, " ")
    .replaceAll(/\s+/g, " ")
    .trim();
const firstMatch = (text, patterns) => {
  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match?.[1]) return decodeHtml(match[1]);
  }
  return null;
};
const parseMetadata = (bytes, source) => {
  const text = bytes.toString("utf8");
  if (source.fetchUrl?.includes("/wp-json/wp/v2/posts/")) {
    const payload = JSON.parse(text);
    return {
      canonicalUrl: payload.link ?? source.canonicalUrl,
      title: decodeHtml(payload.title?.rendered ?? source.sourceId),
      publishedAt: payload.date ?? null,
      modifiedAt: payload.modified ?? null,
      plainText: decodeHtml(
        `${payload.title?.rendered ?? ""} ${payload.content?.rendered ?? ""}`,
      ),
      contentType: "application/json",
    };
  }
  const canonicalUrl =
    firstMatch(text, [
      /<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']+)["']/i,
      /<link[^>]+href=["']([^"']+)["'][^>]+rel=["']canonical["']/i,
      /property=["']og:url["'][^>]+content=["']([^"']+)["']/i,
    ]) ?? source.canonicalUrl;
  return {
    canonicalUrl,
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
    contentType: "text/html",
  };
};
const locateTerms = (plainText) => {
  const terms = [
    "Public Beta",
    "public beta",
    "Publieke Beta",
    "publieke beta",
    "iOS",
    "iPadOS",
    "Release Candidate",
    "withdraw",
    "pulled",
  ];
  const locators = [];
  for (const term of terms) {
    const index = plainText.indexOf(term);
    if (index >= 0) {
      locators.push({
        term,
        firstCharacterOffset: index,
        occurrenceCount: plainText.split(term).length - 1,
      });
    }
  }
  return locators;
};
const ordinalWord = (sequence) =>
  [
    null,
    "first",
    "second",
    "third",
    "fourth",
    "fifth",
    "sixth",
    "seventh",
    "eighth",
  ][sequence] ?? String(sequence);
const locateVariants = (plainText, variants) => {
  const lowered = plainText.toLocaleLowerCase("en-US");
  for (const variant of variants) {
    const index = lowered.indexOf(
      variant.toLocaleLowerCase("en-US"),
    );
    if (index >= 0) {
      return {
        matchedTerm: plainText.slice(index, index + variant.length),
        firstCharacterOffset: index,
      };
    }
  }
  return null;
};
const claimLocators = (plainText, sourceId) =>
  (candidateClaimsBySourceId.get(sourceId) ?? []).map((candidate) => {
    const ordinal = ordinalWord(candidate.sequence);
    const platformLocator = locateVariants(plainText, [
      candidate.platform,
    ]);
    const versionLocator = locateVariants(plainText, [
      `${candidate.platform} ${candidate.version}`,
      candidate.version,
    ]);
    const publicChannelLocator = locateVariants(plainText, [
      `Public Beta ${candidate.sequence}`,
      `${ordinal} public beta`,
      `public beta ${ordinal}`,
      `publieke beta ${candidate.sequence}`,
      `öffentliche beta ${candidate.sequence}`,
      "public beta",
      "public betas",
      "public beta tester",
      "public beta testers",
      "publieke beta",
      "öffentliche beta",
      "パブリックベータ版",
      "パブリックベータ",
    ]);
    const ordinalLocator = locateVariants(plainText, [
      `Public Beta ${candidate.sequence}`,
      `${ordinal} public beta`,
      `${ordinal} public betas`,
      `${ordinal} dev and public betas`,
      `${ordinal} developer and public betas`,
      `${ordinal} beta`,
      `${ordinal} betas`,
      `public beta ${ordinal}`,
      `publieke beta ${candidate.sequence}`,
      `öffentliche beta ${candidate.sequence}`,
      `第${candidate.sequence}のパブリックベータ版`,
      `第${candidate.sequence}のベータ版`,
      `beta ${candidate.sequence}`,
    ]);
    return {
      candidateId: candidate.candidateId,
      platform: candidate.platform,
      version: candidate.version,
      channel: "publicBeta",
      publicOrdinal: candidate.sequence,
      pacificAppearanceDate: candidate.appearanceDate,
      locators: {
        platform: platformLocator,
        version: versionLocator,
        publicChannel: publicChannelLocator,
        publicOrdinal: ordinalLocator,
      },
      locatorQualification:
        "Offsets identify retained source text only. Pacific-date normalization and conflict handling remain original research conclusions documented in the packet.",
    };
  });

await Promise.all([
  mkdir(rawDir, {recursive: true}),
  mkdir(selectedDir, {recursive: true}),
]);

const captureOne = async (source) => {
  const isJson = source.fetchUrl?.includes("/wp-json/wp/v2/posts/");
  const rawFilename = `${safeName(source.sourceId)}.${isJson ? "json" : "html"}`;
  const selectedFilename = `${safeName(source.sourceId)}.json`;
  const rawOutputPath = path.join(rawDir, rawFilename);
  const selectedOutputPath = path.join(selectedDir, selectedFilename);

  try {
    let bytes;
    let status;
    let captureMethod;
    let capturedFrom;
    if (source.localReusePath) {
      const localPath = path.isAbsolute(source.localReusePath)
        ? source.localReusePath
        : path.join(repoRoot, source.localReusePath);
      bytes = await readFile(localPath);
      if (path.resolve(localPath) !== path.resolve(rawOutputPath)) {
        await copyFile(localPath, rawOutputPath);
      }
      status = 200;
      captureMethod = "verified-local-reuse";
      capturedFrom = source.localReusePath;
    } else {
      const response = await fetch(source.fetchUrl, {
        redirect: "follow",
        headers: {
          "user-agent":
            "Mozilla/5.0 (compatible; VersionRecord historical research; +https://www.versionrecord.com)",
          accept: isJson
            ? "application/json"
            : "text/html,application/xhtml+xml",
        },
      });
      bytes = Buffer.from(await response.arrayBuffer());
      if (!response.ok || bytes.byteLength < 300) {
        throw new Error(
          `HTTP ${response.status}; ${bytes.byteLength} response bytes`,
        );
      }
      await writeFile(rawOutputPath, bytes);
      status = response.status;
      captureMethod = isJson ? "http-json-api" : "http-html";
      capturedFrom = response.url;
    }

    const metadata = parseMetadata(bytes, source);
    if (!metadata.canonicalUrl) {
      throw new Error("No canonical URL found in source or retained page");
    }
    const selected = {
      formatVersion: 1,
      sourceId: source.sourceId,
      publisher: source.publisher,
      sourceClass: source.sourceClass,
      canonicalUrl: metadata.canonicalUrl,
      title: metadata.title,
      publishedAt: metadata.publishedAt,
      modifiedAt: metadata.modifiedAt,
      accessedAt: researchCutoff,
      roles: source.roles,
      claimSelection:
        "No article body text is republished. The retained page is selected for the source-specific chronology roles above; candidate-level locators and conflict qualifications are recorded in sources.json and candidates.json.",
      locatorHints: locateTerms(metadata.plainText),
      candidateClaimAssignments: claimLocators(
        metadata.plainText,
        source.sourceId,
      ),
      sourceQualification: source.note,
      copyrightHandling:
        "Metadata and original research paraphrase only. Raw source retained internally for verification and hashing.",
    };
    const selectedBytes = Buffer.from(json(selected));
    await writeFile(selectedOutputPath, selectedBytes);

    return {
      sourceId: source.sourceId,
      publisher: source.publisher,
      requestedUrl: source.fetchUrl,
      canonicalUrl: metadata.canonicalUrl,
      finalUrl: capturedFrom,
      rawFilename,
      selectedFilename,
      status,
      rawBytes: bytes.byteLength,
      rawSha256: sha256(bytes),
      selectedBytes: selectedBytes.byteLength,
      selectedSha256: sha256(selectedBytes),
      captureMethod,
      ...(source.localReusePath
        ? {reusedFrom: source.localReusePath}
        : {capturedFrom}),
    };
  } catch (error) {
    return {
      sourceId: source.sourceId,
      publisher: source.publisher,
      requestedUrl: source.fetchUrl,
      rawFilename,
      selectedFilename,
      status: "failed",
      error: error instanceof Error ? error.message : String(error),
    };
  }
};

const results = [];
let nextIndex = 0;
const concurrency = 8;
await Promise.all(
  Array.from({length: concurrency}, async () => {
    while (nextIndex < sourceSpecs.length) {
      const index = nextIndex;
      nextIndex += 1;
      results[index] = await captureOne(sourceSpecs[index]);
    }
  }),
);

results.sort((left, right) => left.sourceId.localeCompare(right.sourceId));
const log = {
  formatVersion: 1,
  accessedAt: researchCutoff,
  sourceCount: sourceSpecs.length,
  successCount: results.filter((result) => result.status !== "failed").length,
  failureCount: results.filter((result) => result.status === "failed").length,
  results,
};
await writeFile(
  path.join(repoRoot, evidenceRoot, "fetch-log.json"),
  json(log),
);
console.log(
  json({
    sourceCount: log.sourceCount,
    successCount: log.successCount,
    failureCount: log.failureCount,
    failures: results.filter((result) => result.status === "failed"),
  }),
);
