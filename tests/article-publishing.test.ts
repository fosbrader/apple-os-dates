import assert from "node:assert/strict";
import test from "node:test";
import {
  articleHasMeaningfulUpdate,
  createArticlePublicationStamp,
  defaultArticleByline,
  formatArticleTimestamp,
} from "../src/lib/article";

test("first publication uses the brand byline and one shared timestamp", () => {
  const now = new Date("2026-08-09T01:15:00.000Z");
  const stamp = createArticlePublicationStamp({ now });

  assert.deepEqual(stamp, {
    byline: defaultArticleByline,
    publishedAt: "2026-08-09T01:15:00.000Z",
    updatedAt: "2026-08-09T01:15:00.000Z",
  });
  assert.equal(
    articleHasMeaningfulUpdate(stamp.publishedAt, stamp.updatedAt),
    false,
  );
});

test("later publication preserves publishedAt and advances updatedAt", () => {
  const stamp = createArticlePublicationStamp({
    existingPublishedAt: "2026-08-09T01:15:00.000Z",
    now: new Date("2026-08-10T14:30:00.000Z"),
  });

  assert.equal(stamp.publishedAt, "2026-08-09T01:15:00.000Z");
  assert.equal(stamp.updatedAt, "2026-08-10T14:30:00.000Z");
  assert.equal(
    articleHasMeaningfulUpdate(stamp.publishedAt, stamp.updatedAt),
    true,
  );
});

test("article timestamps are displayed in the Version Record time zone", () => {
  assert.equal(
    formatArticleTimestamp("2026-08-09T01:15:00.000Z"),
    "August 8, 2026 at 9:15 PM EDT",
  );
});

test("an invalid existing publication timestamp is rejected", () => {
  assert.throws(
    () =>
      createArticlePublicationStamp({
        existingPublishedAt: "not-a-date",
        now: new Date("2026-08-10T14:30:00.000Z"),
      }),
    /existing publication time is invalid/i,
  );
});
