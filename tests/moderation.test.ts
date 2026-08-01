import assert from "node:assert/strict";
import test from "node:test";
import { POST as submitReport } from "../src/app/api/submissions/route";
import {
  getFeedIngestConfig,
  getModerationConfig,
  getTurnstileConfig,
  ModerationConfigurationError,
} from "../src/lib/moderation/config";
import {
  assertPublicFeedDestination,
  buildIngestCandidate,
  fetchAllowlistedFeed,
  isAuthorizedCron,
  parseJsonFeed,
  parseXmlFeed,
  type FeedSourceRecord,
} from "../src/lib/moderation/feeds";
import { SlidingWindowRateLimiter } from "../src/lib/moderation/rate-limit";
import { buildSubmissionDocument } from "../src/lib/moderation/sanity";
import { validateSubmission } from "../src/lib/moderation/submission";
import { verifyTurnstile } from "../src/lib/moderation/turnstile";
import {
  canonicalizePublicHttpsUrl,
  isBlockedIpAddress,
} from "../src/lib/moderation/urls";

const validSubmission = {
  submissionType: "correction",
  platform: "iOS",
  version: "26.3 beta 4",
  summary: "The recorded beta date needs review",
  details:
    "Apple's public developer page gives a different date for this beta event.",
  pageUrl: "https://versionrecord.com/apple/ios/26.3/",
  sourceUrls: [
    "https://developer.apple.com/news/releases/?id=07292026a&utm_source=test",
  ],
  publicCredit: "Archive contributor",
  contactEmail: "EDITOR@example.com",
  consentToContact: true,
  consentToPublicCredit: true,
  publicEvidenceOnly: true,
  rightsToSubmit: true,
  noConfidentialInformation: true,
};

const rssSource: FeedSourceRecord = {
  _id: "feedSource.apple-developer",
  name: "Apple Developer Releases",
  publisher: "Apple",
  feedUrl: "https://developer.apple.com/news/releases/rss/releases.rss",
  feedKind: "rss",
};

test("moderation configuration cannot fall back to the public dataset or token", () => {
  assert.throws(
    () =>
      getModerationConfig({
        NEXT_PUBLIC_SANITY_PROJECT_ID: "lh3yswzu",
        NEXT_PUBLIC_SANITY_DATASET: "production",
        SANITY_API_TOKEN: "must-not-be-used",
      }),
    ModerationConfigurationError,
  );
  assert.throws(
    () =>
      getModerationConfig({
        NEXT_PUBLIC_SANITY_PROJECT_ID: "lh3yswzu",
        NEXT_PUBLIC_SANITY_DATASET: "public",
        SANITY_MODERATION_DATASET: "public",
        SANITY_MODERATION_WRITE_TOKEN: "dedicated-token",
      }),
    /distinct from the public dataset/,
  );

  assert.deepEqual(
    getModerationConfig({
      NEXT_PUBLIC_SANITY_PROJECT_ID: "lh3yswzu",
      NEXT_PUBLIC_SANITY_DATASET: "production",
      SANITY_MODERATION_DATASET: "moderation",
      SANITY_MODERATION_WRITE_TOKEN: "dedicated-token",
    }),
    {
      projectId: "lh3yswzu",
      dataset: "moderation",
      token: "dedicated-token",
    },
  );
});

test("feed ingestion requires a separate host allowlist and strong cron secret", () => {
  assert.throws(
    () =>
      getFeedIngestConfig({
        CRON_SECRET: "short",
        FEED_INGEST_ALLOWED_HOSTS: "developer.apple.com",
      }),
    ModerationConfigurationError,
  );
  const config = getFeedIngestConfig({
    CRON_SECRET: "this-is-a-long-random-cron-secret",
    FEED_INGEST_ALLOWED_HOSTS:
      "developer.apple.com, support.apple.com",
  });
  assert.deepEqual([...config.allowedHosts], [
    "developer.apple.com",
    "support.apple.com",
  ]);
  assert.equal(
    isAuthorizedCron(
      "Bearer this-is-a-long-random-cron-secret",
      config.cronSecret,
    ),
    true,
  );
  assert.equal(isAuthorizedCron("Bearer wrong", config.cronSecret), false);
});

test("Turnstile is either completely configured or completely disabled", () => {
  assert.equal(getTurnstileConfig({}), null);
  assert.throws(
    () =>
      getTurnstileConfig({
        NEXT_PUBLIC_TURNSTILE_SITE_KEY: "site-only",
      }),
    ModerationConfigurationError,
  );
  assert.deepEqual(
    getTurnstileConfig({
      NEXT_PUBLIC_TURNSTILE_SITE_KEY: "site",
      TURNSTILE_SECRET_KEY: "secret",
    }),
    { siteKey: "site", secretKey: "secret" },
  );
});

test("submission validation normalizes sources and requires privacy attestations", () => {
  const result = validateSubmission(validSubmission);
  assert.equal(result.ok, true);
  if (!result.ok) return;

  assert.equal(result.value.contactEmail, "editor@example.com");
  assert.equal(
    result.value.sourceUrls[0],
    "https://developer.apple.com/news/releases/?id=07292026a",
  );

  const missingAttestations = validateSubmission({
    ...validSubmission,
    rightsToSubmit: false,
  });
  assert.equal(missingAttestations.ok, false);
  if (!missingAttestations.ok) {
    assert.match(missingAttestations.errors.attestations, /Confirm all three/);
  }

  const externalTarget = validateSubmission({
    ...validSubmission,
    pageUrl: "https://untrusted.example.org/apple/ios/26.3/",
  });
  assert.equal(externalTarget.ok, false);
  if (!externalTarget.ok) {
    assert.match(externalTarget.errors.pageUrl, /versionrecord\.com/);
  }
});

test("submission documents contain only moderated schema fields and expire", () => {
  const result = validateSubmission(validSubmission);
  assert.equal(result.ok, true);
  if (!result.ok) return;

  const document = buildSubmissionDocument(
    result.value,
    new Date("2026-07-29T12:00:00.000Z"),
  );
  assert.match(document._id, /^submission\.[0-9a-f-]+$/);
  assert.equal(document._type, "submission");
  assert.equal(document.kind, "correction");
  assert.equal(document.targetDocumentType, "releaseVersion");
  assert.equal(document.targetLabel, "iOS 26.3 beta 4");
  assert.equal(document.retentionDeleteAfter, "2027-01-25");
  assert.equal("turnstileToken" in document, false);
  assert.equal("consentToContact" in document, false);
});

test("URL checks reject local, literal, and reserved destinations", () => {
  assert.equal(canonicalizePublicHttpsUrl("http://example.com/feed"), null);
  assert.equal(canonicalizePublicHttpsUrl("https://127.0.0.1/feed"), null);
  assert.equal(canonicalizePublicHttpsUrl("https://service.internal/feed"), null);
  assert.equal(isBlockedIpAddress("10.1.2.3"), true);
  assert.equal(isBlockedIpAddress("169.254.169.254"), true);
  assert.equal(isBlockedIpAddress("198.51.100.10"), true);
  assert.equal(isBlockedIpAddress("2001:db8::1"), true);
  assert.equal(isBlockedIpAddress("8.8.8.8"), false);
  assert.equal(
    canonicalizePublicHttpsUrl(
      "https://example.org/story?b=2&utm_medium=x&a=1#section",
    ),
    "https://example.org/story?a=1&b=2",
  );
});

test("feed destinations need both a Sanity record and an exact server host allowlist", async () => {
  await assert.rejects(
    assertPublicFeedDestination(
      rssSource.feedUrl,
      new Set(["support.apple.com"]),
      async () => [{ address: "17.253.144.10", family: 4 }],
    ),
    /server allowlist/,
  );
  await assert.rejects(
    assertPublicFeedDestination(
      rssSource.feedUrl,
      new Set(["developer.apple.com"]),
      async () => [{ address: "127.0.0.1", family: 4 }],
    ),
    /public address/,
  );
  const accepted = await assertPublicFeedDestination(
    rssSource.feedUrl,
    new Set(["developer.apple.com"]),
    async () => [{ address: "17.253.144.10", family: 4 }],
  );
  assert.equal(accepted.hostname, "developer.apple.com");
});

test("RSS, Atom, and JSON feeds produce only bounded source metadata", () => {
  const xml = `
    <rss><channel>
      <item>
        <title>iOS 26.3 beta 4 is available</title>
        <link>https://developer.apple.com/news/releases/?id=07292026a&amp;utm_source=rss</link>
        <guid>apple-07292026a</guid>
        <pubDate>Wed, 29 Jul 2026 17:00:00 GMT</pubDate>
        <description>Publisher body that must not be copied.</description>
      </item>
    </channel></rss>`;
  const items = parseXmlFeed(xml);
  assert.deepEqual(items, [
    {
      id: "apple-07292026a",
      title: "iOS 26.3 beta 4 is available",
      canonicalUrl:
        "https://developer.apple.com/news/releases/?id=07292026a",
      publishedAt: "2026-07-29T17:00:00.000Z",
    },
  ]);

  const jsonItems = parseJsonFeed(
    JSON.stringify({
      items: [
        {
          id: "one",
          title: "Release item",
          url: "https://support.apple.com/guide/deployment/example",
          content_html: "<p>Full publisher copy must not be retained.</p>",
          date_published: "2026-07-29T10:00:00Z",
        },
      ],
    }),
  );
  assert.equal(jsonItems.length, 1);
  assert.equal("content_html" in jsonItems[0], false);

  const candidate = buildIngestCandidate(
    rssSource,
    items[0],
    "2026-07-29T18:00:00.000Z",
  );
  assert.match(candidate._id, /^ingestCandidate\.[a-f0-9]{64}$/);
  assert.equal(candidate._id.startsWith("drafts."), false);
  assert.equal(candidate.publicationBlocked, true);
  assert.equal(candidate.status, "new");
  assert.equal("description" in candidate, false);
  assert.equal("body" in candidate, false);
});

test("the feed reader resolves first, rejects redirects, and keeps responses bounded", async () => {
  let requestedRedirectMode: RequestRedirect | undefined;
  const items = await fetchAllowlistedFeed({
    source: rssSource,
    allowedHosts: new Set(["developer.apple.com"]),
    resolveHost: async () => [{ address: "17.253.144.10", family: 4 }],
    fetchImplementation: async (_input, init) => {
      requestedRedirectMode = init?.redirect;
      return new Response(
        `<rss><channel><item><title>One</title><link>https://developer.apple.com/news/one</link></item></channel></rss>`,
        {
          status: 200,
          headers: { "content-type": "application/rss+xml" },
        },
      );
    },
  });
  assert.equal(requestedRedirectMode, "error");
  assert.equal(items.length, 1);

  await assert.rejects(
    fetchAllowlistedFeed({
      source: rssSource,
      allowedHosts: new Set(["developer.apple.com"]),
      resolveHost: async () => [{ address: "17.253.144.10", family: 4 }],
      fetchImplementation: async () =>
        new Response("x", {
          headers: {
            "content-type": "application/rss+xml",
            "content-length": "1000001",
          },
        }),
    }),
    /size limit/,
  );
});

test("sliding-window rate limiting returns a useful retry interval", () => {
  const limiter = new SlidingWindowRateLimiter(2, 1_000);
  assert.equal(limiter.check("client", 0).allowed, true);
  assert.equal(limiter.check("client", 100).allowed, true);
  const limited = limiter.check("client", 200);
  assert.equal(limited.allowed, false);
  assert.equal(limited.retryAfterSeconds, 1);
  assert.equal(limiter.check("client", 1_001).allowed, true);
});

test("Turnstile verification binds a token to this form and hostname", async () => {
  const verified = await verifyTurnstile({
    secretKey: "private",
    token: "single-use-token",
    expectedHostname: "versionrecord.com",
    fetchImplementation: async (_input, init) => {
      assert.match(String(init?.body), /secret=private/);
      return Response.json({
        success: true,
        action: "submission",
        hostname: "versionrecord.com",
      });
    },
  });
  assert.equal(verified, true);

  const wrongHost = await verifyTurnstile({
    secretKey: "private",
    token: "single-use-token",
    expectedHostname: "versionrecord.com",
    fetchImplementation: async () =>
      Response.json({
        success: true,
        action: "submission",
        hostname: "attacker.example",
      }),
  });
  assert.equal(wrongHost, false);
});

test("the submission route rejects cross-origin and non-JSON requests without writing", async () => {
  const crossOrigin = await submitReport(
    new Request("https://versionrecord.com/api/submissions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Origin: "https://attacker.example",
      },
      body: JSON.stringify({ website: "filled-by-bot" }),
    }),
  );
  assert.equal(crossOrigin.status, 403);

  const wrongContentType = await submitReport(
    new Request("https://versionrecord.com/api/submissions", {
      method: "POST",
      headers: {
        "Content-Type": "multipart/form-data",
        Origin: "https://versionrecord.com",
      },
      body: "not-a-file-upload",
    }),
  );
  assert.equal(wrongContentType.status, 415);

  const honeypot = await submitReport(
    new Request("https://versionrecord.com/api/submissions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Origin: "https://versionrecord.com",
      },
      body: JSON.stringify({ website: "filled-by-bot" }),
    }),
  );
  assert.equal(honeypot.status, 202);
  assert.deepEqual(await honeypot.json(), { accepted: true });
});
