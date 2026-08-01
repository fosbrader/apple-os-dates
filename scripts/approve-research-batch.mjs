/**
 * Records a completed human editorial review in a checked-in research batch.
 *
 * This does not decide whether prose is accurate. It only encodes a review
 * decision after the reviewer has checked the source ledger, claims, locators,
 * event mapping, and dry-run plan.
 *
 * Usage:
 *   node scripts/approve-research-batch.mjs \
 *     --content scripts/research-batches/example.json \
 *     --reviewed-at 2026-07-29T23:45:00Z \
 *     --confirm-editorial-review
 */

import { readFileSync, writeFileSync } from "node:fs";
import { extname, relative, resolve, sep } from "node:path";

const repositoryRoot = resolve(import.meta.dirname, "..");
const researchRoot = resolve(repositoryRoot, "scripts/research-batches");

function argumentValue(flag) {
  const index = process.argv.indexOf(flag);
  return index >= 0 ? process.argv[index + 1] : undefined;
}

function fail(message) {
  throw new Error(message);
}

const contentArgument = argumentValue("--content");
const reviewedAt = argumentValue("--reviewed-at");

if (!contentArgument) {
  fail("--content is required.");
}
if (!process.argv.includes("--confirm-editorial-review")) {
  fail("--confirm-editorial-review is required.");
}
if (!reviewedAt || Number.isNaN(Date.parse(reviewedAt))) {
  fail("--reviewed-at must be a valid ISO datetime.");
}

const contentPath = resolve(repositoryRoot, contentArgument);
const relativePath = relative(researchRoot, contentPath);
if (
  relativePath.startsWith(`..${sep}`) ||
  relativePath === ".." ||
  extname(contentPath).toLowerCase() !== ".json"
) {
  fail("The content file must be a JSON batch under scripts/research-batches.");
}

const bundle = JSON.parse(readFileSync(contentPath, "utf8"));
const records = [
  ...(bundle.versions || []).map((record) => ({
    kind: "version",
    record,
  })),
  ...(bundle.events || []).map((record) => ({
    kind: "event",
    record,
  })),
  ...(bundle.builds || []).map((record) => ({
    kind: "build",
    record,
  })),
];

if (!records.length) {
  fail("The batch has no editorial records.");
}

for (const { kind, record } of records) {
  const reviewStatus = record.editorialReview?.status;
  const provenanceStatus = record.provenanceStatus;
  const ready =
    reviewStatus === "readyForReview" && provenanceStatus === "sourceLinked";
  const approved =
    reviewStatus === "approved" && provenanceStatus === "editoriallyVerified";

  if (!ready && !approved) {
    fail(
      `${kind} record is not in a reviewable or already-approved state: ` +
        `${reviewStatus || "missing review"}/${provenanceStatus || "missing provenance"}.`,
    );
  }

  if (kind === "version") {
    const articleText = (record.overview?.blocks || [])
      .flatMap((block) => [
        block.text || "",
        ...(block.spans || []).map((span) => span.text || ""),
      ])
      .join(" ")
      .trim();
    if (articleText.length < 80 || !(record.citations || []).length) {
      fail(
        `${record.releaseVersionId || "version"} lacks a substantive cited overview.`,
      );
    }
  } else {
    if (
      (record.summary || "").trim().length < 80 ||
      !(record.citations || []).length ||
      (!(record.changes || []).length && !(record.article?.blocks || []).length)
    ) {
      fail(`${kind} record lacks substantive cited release content.`);
    }
    record.isIndexable = true;
  }

  record.provenanceStatus = "editoriallyVerified";
  record.editorialReview = {
    status: "approved",
    reviewedAt,
  };
}

writeFileSync(contentPath, `${JSON.stringify(bundle, null, 2)}\n`);
console.log(
  `Recorded editorial approval for ${records.length} records in ${relative(
    repositoryRoot,
    contentPath,
  )}.`,
);
