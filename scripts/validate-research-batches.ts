/**
 * Validates every checked-in historical editorial batch without contacting
 * Sanity. Remote source and production-plan checks remain separate review
 * steps because they require network access and a live snapshot.
 */

import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import {
  assertLaunchContentBundle,
  type LaunchCitationInput,
  type LaunchContentBundle,
  type OriginalArticleInput,
} from "./lib/launch-content-ingestion";

const batchDirectory = join(__dirname, "research-batches");
const placeholderPattern =
  /\b(?:lorem ipsum|placeholder|todo|tbd|write an original|insert (?:copy|text))\b/i;

interface BatchResult {
  file: string;
  sources: number;
  versions: number;
  events: number;
  builds: number;
  changes: number;
  citations: number;
}

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

function articleText(article: OriginalArticleInput | undefined): string {
  return (article?.blocks || [])
    .flatMap((block) => [
      block.text || "",
      ...(block.spans || []).map((span) => span.text || ""),
    ])
    .join(" ")
    .trim();
}

function inspectArticle(
  article: OriginalArticleInput | undefined,
  path: string,
  citations: LaunchCitationInput[],
): void {
  assert(article, `${path} is required.`);
  assert(
    articleText(article).length >= 80,
    `${path} must contain at least 80 characters of original prose.`,
  );

  for (const [blockIndex, block] of article.blocks.entries()) {
    const blockPath = `${path}.blocks[${blockIndex}]`;
    if (block.style === "h2" || block.style === "h3") continue;
    if (block.text?.trim()) {
      assert(
        (block.citations || []).length > 0,
        `${blockPath} needs a claim-level citation.`,
      );
      citations.push(...(block.citations || []));
      continue;
    }

    assert(
      (block.spans || []).some((span) => span.text.trim()),
      `${blockPath} has no prose.`,
    );
    for (const [spanIndex, span] of (block.spans || []).entries()) {
      if (!span.text.trim()) continue;
      assert(
        (span.citations || []).length > 0,
        `${blockPath}.spans[${spanIndex}] needs a claim-level citation.`,
      );
      citations.push(...(span.citations || []));
    }
  }
}

function collectPageCitations(
  inputs: LaunchCitationInput[] | undefined,
  citations: LaunchCitationInput[],
): void {
  citations.push(...(inputs || []));
}

function validateReviewState(
  record: {
    editorialReview?: { status?: string; reviewedAt?: string };
    provenanceStatus?: string;
    isIndexable?: boolean;
  },
  path: string,
  supportsIndexing: boolean,
): void {
  const status = record.editorialReview?.status;
  const provenance = record.provenanceStatus;
  if (status === "approved") {
    assert(
      provenance === "editoriallyVerified",
      `${path} must be editoriallyVerified when approved.`,
    );
    assert(
      Boolean(record.editorialReview?.reviewedAt),
      `${path} needs reviewedAt when approved.`,
    );
    if (supportsIndexing) {
      assert(
        record.isIndexable === true,
        `${path} must be indexable when approved.`,
      );
    }
    return;
  }

  assert(
    status === "readyForReview" && provenance === "sourceLinked",
    `${path} must be either sourceLinked/readyForReview or editoriallyVerified/approved.`,
  );
  if (supportsIndexing) {
    assert(
      record.isIndexable !== true,
      `${path} cannot be indexable before approval.`,
    );
  }
}

const files = readdirSync(batchDirectory)
  .filter((file) => file.endsWith(".json"))
  .sort();
assert(files.length > 0, "No research batch JSON files were found.");

const globalChanges = new Map<string, { file: string; definition: string }>();
const results: BatchResult[] = [];

for (const file of files) {
  const raw = readFileSync(join(batchDirectory, file), "utf8");
  assert(
    !placeholderPattern.test(raw),
    `${file} contains placeholder editorial text.`,
  );
  const bundle = JSON.parse(raw) as LaunchContentBundle;
  assertLaunchContentBundle(bundle);

  const sourceUrls = new Set(
    (bundle.sources || []).map((source) => source.url),
  );
  const citations: LaunchCitationInput[] = [];
  const versionIds = new Set<string>();
  const eventTargets = new Set<string>();
  let changeCount = 0;

  for (const [index, version] of (bundle.versions || []).entries()) {
    const path = `${file}.versions[${index}]`;
    assert(
      !versionIds.has(version.releaseVersionId),
      `${path} repeats ${version.releaseVersionId}.`,
    );
    versionIds.add(version.releaseVersionId);
    inspectArticle(version.overview, `${path}.overview`, citations);
    collectPageCitations(version.citations, citations);
    validateReviewState(version, path, false);
  }

  for (const [index, event] of (bundle.events || []).entries()) {
    const path = `${file}.events[${index}]`;
    const targetKeys = Object.keys(event.target).sort();
    assert(
      targetKeys.length === 2 &&
        targetKeys[0] === "releaseVersionId" &&
        targetKeys[1] === "routeAlias" &&
        Boolean(event.target.routeAlias?.trim()),
      `${path} must use only a durable releaseVersionId/routeAlias target.`,
    );
    const targetIdentity =
      `${event.target.releaseVersionId}/${event.target.routeAlias}`;
    assert(
      !eventTargets.has(targetIdentity),
      `${path} repeats ${targetIdentity}.`,
    );
    eventTargets.add(targetIdentity);
    assert(
      (event.summary || "").trim().length >= 80,
      `${path}.summary must contain at least 80 characters.`,
    );
    assert(
      (event.changes || []).length > 0,
      `${path} needs at least one structured change.`,
    );
    if (event.article) {
      inspectArticle(event.article, `${path}.article`, citations);
    }
    collectPageCitations(event.citations, citations);
    validateReviewState(event, path, true);

    for (const [changeIndex, change] of (event.changes || []).entries()) {
      const changePath = `${path}.changes[${changeIndex}]`;
      collectPageCitations(change.citations, citations);
      changeCount += 1;
      const definition = JSON.stringify({
        title: change.title,
        canonicalSummary: change.canonicalSummary,
        category: change.category,
      });
      const existing = globalChanges.get(change.key);
      assert(
        !existing || existing.definition === definition,
        `${changePath}.key conflicts with ${existing?.file || "another batch"}.`,
      );
      globalChanges.set(change.key, {
        file,
        definition,
      });
    }
  }

  for (const [index, build] of (bundle.builds || []).entries()) {
    const path = `${file}.builds[${index}]`;
    assert(
      (build.summary || "").trim().length >= 80,
      `${path}.summary must contain at least 80 characters.`,
    );
    if (build.article) {
      inspectArticle(build.article, `${path}.article`, citations);
    }
    collectPageCitations(build.citations, citations);
    validateReviewState(build, path, true);
    for (const change of build.changes || []) {
      collectPageCitations(change.citations, citations);
      changeCount += 1;
    }
  }

  const undeclared = [
    ...new Set(
      citations
        .map((citation) => citation.url)
        .filter((url) => !sourceUrls.has(url)),
    ),
  ];
  assert(
    undeclared.length === 0,
    `${file} cites undeclared sources: ${undeclared.join(", ")}.`,
  );

  results.push({
    file,
    sources: bundle.sources?.length || 0,
    versions: bundle.versions?.length || 0,
    events: bundle.events?.length || 0,
    builds: bundle.builds?.length || 0,
    changes: changeCount,
    citations: citations.length,
  });
}

for (const result of results) {
  console.log(
    [
      result.file,
      `${result.versions} versions`,
      `${result.events} events`,
      `${result.changes} changes`,
      `${result.sources} sources`,
      `${result.citations} citations`,
    ].join(" · "),
  );
}

console.log(
  `Validated ${results.length} research batches with ${globalChanges.size} globally consistent change keys.`,
);
