/**
 * Stages the 2026-08-17 release-day article as a Sanity draft.
 *
 * This command only creates or updates `drafts.sitePage.<slug>`. It never
 * publishes and never stamps `publishedAt`, `updatedAt`, or an approved review
 * status. Publication is the separate, gated job of
 * `scripts/publish-site-article.ts`, which requires the live news-readiness
 * endpoint to pass and an exact plan SHA.
 *
 * Content comes from `scripts/release-day-2026-08-17-article.json` so the prose
 * stays reviewable as data rather than buried in code.
 *
 * Dry run (default):
 *   npx sanity exec scripts/stage-release-day-article.ts --with-user-token
 *
 * Apply:
 *   npx sanity exec scripts/stage-release-day-article.ts --with-user-token -- \
 *     --apply --confirm-production
 */

import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { getCliClient } from "sanity/cli";

const apiVersion = "2024-01-01";
const expectedProjectId = "lh3yswzu";
const expectedDataset = "production";
const accessedAt = "2026-08-17";
const contentPath = join(__dirname, "release-day-2026-08-17-article.json");

function sha256(v: string): string {
  return createHash("sha256").update(v).digest("hex");
}
function compactHash(v: string): string {
  return sha256(v).slice(0, 24);
}
function normalizeSourceUrl(v: string): string {
  const url = new URL(v);
  url.hash = "";
  return url.toString();
}
function sourceDocumentId(url: string): string {
  return `source-${compactHash(normalizeSourceUrl(url))}`;
}
function reference(id: string) {
  return { _type: "reference" as const, _ref: id };
}

interface CitationInput {
  url: string;
  locator: string;
  title?: string;
  publisher?: string;
  sourceClass?: string;
  publishedAt?: string;
}
interface ArticleContent {
  target: { projectId: string; dataset: string };
  documentId: string;
  title: string;
  slug: string;
  summary: string;
  seo: { title: string; description: string };
  paragraphs: string[];
  citations: CitationInput[];
  reviewNotes: string;
}

function assertNoDashes(value: string, where: string): void {
  if (/[—–]/.test(value)) {
    throw new Error(`${where} contains an em-dash or en-dash: ${value}`);
  }
}

/** A "## " prefix marks a section heading; everything else is body copy. */
function block(text: string, index: number) {
  const isHeading = text.startsWith("## ");
  const body = isHeading ? text.slice(3) : text;
  const key = compactHash(`${index}\0${body.slice(0, 90)}`);
  return {
    _key: `block-${key}`,
    _type: "block" as const,
    style: isHeading ? "h2" : "normal",
    markDefs: [],
    children: [
      {
        _key: `span-${key}`,
        _type: "span" as const,
        marks: [],
        text: body,
      },
    ],
  };
}

async function main(): Promise<void> {
  const argv = process.argv.slice(2);
  const apply = argv.includes("--apply");
  const confirmed = argv.includes("--confirm-production");

  const content: ArticleContent = JSON.parse(readFileSync(contentPath, "utf8"));

  const client = getCliClient({ apiVersion }).withConfig({
    perspective: "raw",
    useCdn: false,
  });
  const { projectId, dataset } = client.config();
  if (projectId !== expectedProjectId || dataset !== expectedDataset) {
    throw new Error(
      `Refusing to run against ${projectId}/${dataset}; expected ${expectedProjectId}/${expectedDataset}.`,
    );
  }
  if (
    content.target.projectId !== expectedProjectId ||
    content.target.dataset !== expectedDataset
  ) {
    throw new Error("Article content targets a different project or dataset.");
  }
  if (apply && !confirmed) {
    throw new Error("--apply also requires --confirm-production.");
  }

  const publishedId = content.documentId;
  if (!/^sitePage\.[a-z0-9][a-z0-9.-]*$/.test(publishedId)) {
    throw new Error(
      `documentId must match ^sitePage\\.[a-z0-9][a-z0-9.-]*$; got ${publishedId}.`,
    );
  }
  const draftId = `drafts.${publishedId}`;

  assertNoDashes(content.title, "title");
  assertNoDashes(content.summary, "summary");
  assertNoDashes(content.seo.title, "seo.title");
  assertNoDashes(content.seo.description, "seo.description");
  content.paragraphs.forEach((p, i) => assertNoDashes(p, `paragraph ${i}`));

  if (content.title.length > 160) {
    throw new Error(`title is ${content.title.length} chars; max is 160.`);
  }
  if (content.summary.length > 500) {
    throw new Error(`summary is ${content.summary.length} chars; max is 500.`);
  }
  if (content.seo.description.length > 160) {
    throw new Error(
      `seo.description is ${content.seo.description.length} chars; max is 160.`,
    );
  }
  if (content.paragraphs.length === 0) {
    throw new Error("body requires at least one block.");
  }
  if (content.citations.length === 0) {
    throw new Error("An article must carry page-level citations.");
  }

  const mutations: unknown[] = [];
  const planned: string[] = [];

  // Sources first: a citation cannot reference a document that does not exist.
  const sourceIds = content.citations.map((c) => sourceDocumentId(c.url));
  const existingSources: { _id: string }[] = await client.fetch(
    "*[_id in $ids]{_id}",
    { ids: Array.from(new Set(sourceIds)) },
  );
  const haveSource = new Set(existingSources.map((s) => s._id));
  const seenSource = new Set<string>();
  for (const citation of content.citations) {
    const id = sourceDocumentId(citation.url);
    if (haveSource.has(id) || seenSource.has(id)) continue;
    seenSource.add(id);
    if (!citation.title || !citation.publisher || !citation.sourceClass) {
      throw new Error(
        `New source ${citation.url} needs title, publisher, and sourceClass.`,
      );
    }
    mutations.push({
      createIfNotExists: {
        _id: id,
        _type: "source",
        title: citation.title,
        canonicalUrl: citation.url,
        publisher: citation.publisher,
        sourceClass: citation.sourceClass,
        ...(citation.publishedAt ? { publishedAt: citation.publishedAt } : {}),
        accessedAt,
        status: "active",
        reuseBasis: "linkedFactsOnly",
        topics: [],
      },
    });
    planned.push(`source  ${id}  ${citation.publisher}`);
  }

  const existingDraft: { _id: string; _rev: string } | null = await client.fetch(
    "*[_id == $id][0]{_id, _rev}",
    { id: draftId },
  );

  const document = {
    _id: draftId,
    _type: "sitePage" as const,
    title: content.title,
    slug: { _type: "slug" as const, current: content.slug },
    pageKind: "article",
    byline: "Version Record",
    summary: content.summary,
    body: content.paragraphs.map(block),
    citations: content.citations.map((c) => ({
      _key: `citation-${compactHash(`${sourceDocumentId(c.url)}\0${c.locator}`)}`,
      _type: "citation" as const,
      locator: c.locator,
      source: reference(sourceDocumentId(c.url)),
    })),
    seo: {
      _type: "seoMetadata" as const,
      title: content.seo.title,
      description: content.seo.description,
      noIndex: false,
    },
    // Left unapproved on purpose. publish-site-article.ts is what promotes a
    // reviewed draft and stamps the approval and timestamps.
    editorialReview: {
      _type: "editorialReview" as const,
      status: "readyForReview",
      reviewNotes: content.reviewNotes,
    },
  };

  mutations.push({ createOrReplace: document });
  planned.push(
    `${existingDraft ? "replace" : "create "} ${draftId}  "${content.title.slice(0, 60)}"  ${document.body.length} blocks, ${document.citations.length} citations`,
  );

  console.log(planned.join("\n"));
  console.log(`\n${apply ? "APPLY" : "DRY RUN"}: ${mutations.length} mutations.`);

  if (!apply) {
    console.log(
      "No Sanity data changed. Rerun with --apply --confirm-production.",
    );
    return;
  }

  const result = await client.mutate(mutations as never, {
    visibility: "sync",
  });
  console.log(`Committed transaction ${result.transactionId}.`);
  console.log(
    `Staged ${draftId}. Publish with:\n` +
      `  npx sanity exec scripts/publish-site-article.ts --with-user-token -- --id ${publishedId}`,
  );
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
