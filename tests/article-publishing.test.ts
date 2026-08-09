import assert from "node:assert/strict";
import test from "node:test";
import {
  articleHasMeaningfulUpdate,
  articlePublishingFeatureVersion,
  createArticlePublicationStamp,
  defaultArticleByline,
  formatArticleTimestamp,
} from "../src/lib/article";
import {
  articleDeploymentIsReady,
  productionArticleDeploymentOrigin,
  verifyArticleDeployment,
} from "../src/lib/article-deployment";
import {
  createArticlePreviewToken,
  verifyArticlePreviewToken,
} from "../src/lib/article-preview";

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

test("signed article preview tokens are scoped, short-lived, and tamper evident", () => {
  const secret = "a-private-preview-secret-with-at-least-32-characters";
  const now = new Date("2026-08-09T01:15:00.000Z");
  const token = createArticlePreviewToken({
    slug: "launching-version-record",
    secret,
    now,
    lifetimeSeconds: 600,
  });

  assert.deepEqual(
    verifyArticlePreviewToken({ token, secret, now }),
    {
      version: 1,
      slug: "launching-version-record",
      expiresAt: 1786238700,
    },
  );
  assert.equal(
    verifyArticlePreviewToken({
      token: `${token.slice(0, -1)}x`,
      secret,
      now,
    }),
    null,
  );
  assert.equal(
    verifyArticlePreviewToken({
      token,
      secret,
      now: new Date("2026-08-09T01:25:00.000Z"),
    }),
    null,
  );
});

test("preview token creation rejects weak secrets and unsafe slugs", () => {
  assert.throws(
    () =>
      createArticlePreviewToken({
        slug: "launching-version-record",
        secret: "too-short",
      }),
    /at least 32 characters/i,
  );
  assert.throws(
    () =>
      createArticlePreviewToken({
        slug: "../private",
        secret: "a-private-preview-secret-with-at-least-32-characters",
      }),
    /slug is invalid/i,
  );
});

test("publication deployment checks require the canonical production origin", () => {
  assert.equal(
    productionArticleDeploymentOrigin("https://www.versionrecord.com/news/"),
    "https://www.versionrecord.com",
  );
  assert.throws(
    () => productionArticleDeploymentOrigin("http://www.versionrecord.com"),
    /requires the production origin/i,
  );
  assert.throws(
    () => productionArticleDeploymentOrigin("https://preview.vercel.app"),
    /requires the production origin/i,
  );
});

test("publication readiness requires deployed code and private preview", async () => {
  const readyPayload = {
    featureVersion: articlePublishingFeatureVersion,
    production: true,
    previewConfigured: true,
  };
  assert.equal(articleDeploymentIsReady(readyPayload), true);
  assert.equal(
    articleDeploymentIsReady({
      ...readyPayload,
      previewConfigured: false,
    }),
    false,
  );

  const fetcher = (async (input: string | URL | Request) => {
    assert.equal(
      String(input),
      "https://www.versionrecord.com/api/news-readiness/",
    );
    return Response.json(readyPayload);
  }) as typeof fetch;
  assert.deepEqual(
    await verifyArticleDeployment(
      "https://www.versionrecord.com",
      fetcher,
    ),
    readyPayload,
  );
});
