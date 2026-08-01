import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import {
  assertLaunchContentBundle,
  type LaunchContentBundle,
} from "../scripts/lib/launch-content-ingestion";

const manifest = JSON.parse(
  readFileSync(
    new URL(
      "../scripts/apple-launch-content-2026.json",
      import.meta.url,
    ),
    "utf8",
  ),
) as LaunchContentBundle;

function articleText(
  article: NonNullable<
    LaunchContentBundle["versions"]
  >[number]["overview"],
): string {
  return (article?.blocks ?? [])
    .flatMap((block) =>
      block.spans?.length
        ? block.spans.map((span) => span.text)
        : [block.text ?? ""],
    )
    .join(" ")
    .replace(/\s+/g, " ")
    .trim();
}

test("the checked-in Apple launch manifest passes ingestion validation", () => {
  assert.doesNotThrow(() =>
    assertLaunchContentBundle(manifest),
  );
});

test("the launch cohort is substantive, sourced, and explicitly approved", () => {
  assert.ok((manifest.sources?.length ?? 0) >= 80);
  assert.equal(manifest.versions?.length, 30);
  assert.equal(manifest.events?.length, 30);
  assert.equal(manifest.builds?.length, 30);

  const sourceUrls = (manifest.sources ?? []).map(
    (source) => source.url,
  );
  assert.equal(new Set(sourceUrls).size, sourceUrls.length);

  for (const version of manifest.versions ?? []) {
    assert.equal(version.authorship, "originalSynthesis");
    assert.equal(version.provenanceStatus, "editoriallyVerified");
    assert.equal(version.editorialReview?.status, "approved");
    assert.ok(version.editorialReview?.reviewedAt);
    assert.ok(version.releaseNotesUrl?.startsWith("https://"));
    assert.ok(
      articleText(version.overview).length >= 250,
      `${version.releaseVersionId} needs a substantive overview`,
    );
  }

  for (const event of manifest.events ?? []) {
    assert.equal(event.authorship, "originalSynthesis");
    assert.equal(event.provenanceStatus, "editoriallyVerified");
    assert.equal(event.editorialReview?.status, "approved");
    assert.ok(event.editorialReview?.reviewedAt);
    assert.equal(event.isIndexable, true);
    assert.ok((event.citations?.length ?? 0) >= 1);
    assert.ok(
      (event.changes?.length ?? 0) >= 3,
      `${JSON.stringify(event.target)} needs at least three sourced changes`,
    );
    for (const change of event.changes ?? []) {
      assert.ok(change.summary.length >= 20);
      assert.ok(change.citations.length >= 1);
    }
  }

  for (const build of manifest.builds ?? []) {
    assert.equal(build.authorship, "originalSynthesis");
    assert.equal(build.provenanceStatus, "editoriallyVerified");
    assert.equal(build.editorialReview?.status, "approved");
    assert.ok(build.editorialReview?.reviewedAt);
    assert.equal(build.isIndexable, false);
    assert.equal(build.eventTargets?.length, 1);
    assert.ok(build.citations.length >= 1);
  }
});

test("undocumented launch claims remain rare and independently corroborated", () => {
  const undocumented = (manifest.events ?? [])
    .flatMap((event) => event.changes ?? [])
    .filter(
      (change) => change.documentedStatus === "undocumented",
    );

  assert.equal(undocumented.length, 2);
  for (const change of undocumented) {
    assert.equal(change.evidenceState, "corroborated");
    assert.ok(new Set(change.citations.map(({ url }) => url)).size >= 2);
  }
});

test("the launch manifest contains no placeholder editorial copy", () => {
  const serialized = JSON.stringify(manifest);
  assert.doesNotMatch(
    serialized,
    /\b(?:lorem ipsum|placeholder|todo|tbd|coming soon|write an original)\b/i,
  );
});
