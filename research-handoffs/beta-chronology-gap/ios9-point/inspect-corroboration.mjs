import {readFile} from "node:fs/promises";
import path from "node:path";
import {fileURLToPath} from "node:url";
import {JSDOM} from "jsdom";

const here = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(here, "../../../");
const evidenceRoot = path.join(repoRoot, "tmp/ios9-point-evidence");
const manifest = JSON.parse(
  await readFile(path.join(here, "corroboration-fetch-manifest.json"), "utf8"),
);
const summaryOnly = process.argv.includes("--summary");
const onlySourceId = process.argv
  .find((argument) => argument.startsWith("--only="))
  ?.slice("--only=".length);

function collapse(value) {
  return String(value ?? "")
    .replace(/\s+/g, " ")
    .trim();
}

function flattenJsonLd(value) {
  if (Array.isArray(value)) return value.flatMap(flattenJsonLd);
  if (!value || typeof value !== "object") return [];
  return [
    value,
    ...Object.values(value).flatMap((nested) => flattenJsonLd(nested)),
  ];
}

for (const source of manifest.sources) {
  if (onlySourceId && source.sourceId !== onlySourceId) continue;
  const rawPath = path.join(evidenceRoot, source.filename);
  const html = await readFile(rawPath, "utf8");
  const document = new JSDOM(html).window.document;
  const jsonLd = [...document.querySelectorAll('script[type="application/ld+json"]')]
    .flatMap((node) => {
      try {
        return flattenJsonLd(JSON.parse(node.textContent ?? ""));
      } catch {
        return [];
      }
    })
    .filter(
      (node) =>
        node.headline ||
        node.datePublished ||
        node["@type"] === "NewsArticle" ||
        node["@type"] === "Article",
    );
  const articleNode =
    jsonLd.find((node) =>
      [node["@type"]].flat().some((type) =>
        ["NewsArticle", "Article", "ReportageNewsArticle"].includes(type),
      ),
    ) ?? jsonLd[0];
  const paragraphs = [
    ...document.querySelectorAll(
      "article p, .entry-content p, .post-content p, .article-content p, main p",
    ),
  ]
    .map((node) => collapse(node.textContent))
    .filter(
      (text) =>
        text &&
        /(publiek|public|beta|ontwikkelaar|developer|versie)/i.test(text),
    );
  const uniqueParagraphs = [...new Set(paragraphs)].slice(0, 10);
  console.log(
    JSON.stringify({
      sourceId: source.sourceId,
      title:
        collapse(articleNode?.headline) ||
        collapse(
          document.querySelector('meta[property="og:title"]')?.content,
        ) ||
        collapse(document.title),
      datePublished:
        articleNode?.datePublished ??
        document.querySelector('meta[property="article:published_time"]')
          ?.content ??
        null,
      dateModified:
        articleNode?.dateModified ??
        document.querySelector('meta[property="article:modified_time"]')
          ?.content ??
        null,
      author:
        collapse(
          typeof articleNode?.author === "string"
            ? articleNode.author
            : articleNode?.author?.name,
        ) || null,
      ...(summaryOnly ? {} : {paragraphs: uniqueParagraphs}),
    }),
  );
}
