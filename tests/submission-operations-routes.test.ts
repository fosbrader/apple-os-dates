import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { createSubmissionRetentionHandler } from "../src/app/api/cron/submission-retention/handler";
import { createSubmissionStatusHandler } from "../src/app/api/submissions/status/handler";

const cronSecret = "retention-secret-at-least-24-characters";
const monitorSecret = "monitor-secret-at-least-24-characters";

test("submission monitor trusts only its GitHub Actions issue", async () => {
  const workflow = await readFile(
    new URL("../.github/workflows/submission-monitor.yml", import.meta.url),
    "utf8",
  );

  assert.match(workflow, /ISSUE_AUTHOR: app\/github-actions/);
  assert.match(workflow, /cron: "17 13 \* \* \*"/);
  assert.doesNotMatch(workflow, /\*\/6/);
  assert.match(workflow, /in:title author:\$\{ISSUE_AUTHOR\}/);
  assert.match(workflow, /--json number,state,title,body,author/);
  assert.equal(
    workflow.match(/\.author\.is_bot == true/g)?.length,
    3,
  );
  assert.equal(
    workflow.match(/\.author\.login == \$author/g)?.length,
    3,
  );
});

function request(path: string, secret?: string): Request {
  return new Request(`https://www.versionrecord.com${path}`, {
    headers: secret
      ? { Authorization: `Bearer ${secret}` }
      : undefined,
  });
}

test("submission retention fails closed before accessing storage", async (context) => {
  context.mock.method(console, "error", () => undefined);
  let calls = 0;
  const unavailable = createSubmissionRetentionHandler({
    deleteExpiredSubmissions: async () => {
      calls += 1;
    },
    getCronSecret: () => undefined,
  });
  const unavailableResponse = await unavailable(
    request("/api/cron/submission-retention/", cronSecret),
  );
  assert.equal(unavailableResponse.status, 503);
  assert.equal(calls, 0);

  const unauthorized = createSubmissionRetentionHandler({
    deleteExpiredSubmissions: async () => {
      calls += 1;
    },
    getCronSecret: () => cronSecret,
  });
  const unauthorizedResponse = await unauthorized(
    request("/api/cron/submission-retention/", "wrong-secret"),
  );
  assert.equal(unauthorizedResponse.status, 401);
  assert.equal(calls, 0);
});

test("submission retention invokes the idempotent storage cleanup once", async () => {
  let calls = 0;
  const handler = createSubmissionRetentionHandler({
    deleteExpiredSubmissions: async () => {
      calls += 1;
    },
    getCronSecret: () => cronSecret,
  });

  const response = await handler(
    request("/api/cron/submission-retention/", cronSecret),
  );
  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), { completed: true });
  assert.equal(response.headers.get("cache-control"), "no-store");
  assert.equal(calls, 1);
});

test("submission status returns only the pending boolean", async () => {
  for (const pending of [false, true]) {
    const handler = createSubmissionStatusHandler({
      hasPendingSubmissions: async () => pending,
      getMonitorSecret: () => monitorSecret,
    });
    const response = await handler(
      request("/api/submissions/status/", monitorSecret),
    );
    const body = await response.json();

    assert.equal(response.status, 200);
    assert.deepEqual(body, { pending });
    assert.deepEqual(Object.keys(body), ["pending"]);
    assert.equal(response.headers.get("cache-control"), "no-store");
  }
});

test("submission status rejects missing or incorrect monitor credentials", async (context) => {
  context.mock.method(console, "error", () => undefined);
  let calls = 0;
  const unconfigured = createSubmissionStatusHandler({
    hasPendingSubmissions: async () => {
      calls += 1;
      return true;
    },
    getMonitorSecret: () => undefined,
  });
  const unavailableResponse = await unconfigured(
    request("/api/submissions/status/", monitorSecret),
  );
  assert.equal(unavailableResponse.status, 503);
  assert.equal(calls, 0);

  const configured = createSubmissionStatusHandler({
    hasPendingSubmissions: async () => {
      calls += 1;
      return true;
    },
    getMonitorSecret: () => monitorSecret,
  });
  const unauthorizedResponse = await configured(
    request("/api/submissions/status/", "wrong-secret"),
  );
  assert.equal(unauthorizedResponse.status, 401);
  assert.equal(calls, 0);
});

test("submission status limits repeated requests before checking storage", async () => {
  let calls = 0;
  const handler = createSubmissionStatusHandler({
    hasPendingSubmissions: async () => {
      calls += 1;
      return true;
    },
    getMonitorSecret: () => monitorSecret,
    checkRateLimit: () => ({
      allowed: false,
      retryAfterSeconds: 90,
    }),
  });

  const response = await handler(
    request("/api/submissions/status/", monitorSecret),
  );
  assert.equal(response.status, 429);
  assert.equal(response.headers.get("retry-after"), "90");
  assert.equal(calls, 0);
});

test("submission operation failures do not reveal storage details", async (context) => {
  context.mock.method(console, "error", () => undefined);
  const sensitiveFailure = new Error(
    "moderation/submissions/private-email@example.com.json",
  );
  const retention = createSubmissionRetentionHandler({
    deleteExpiredSubmissions: async () => {
      throw sensitiveFailure;
    },
    getCronSecret: () => cronSecret,
  });
  const status = createSubmissionStatusHandler({
    hasPendingSubmissions: async () => {
      throw sensitiveFailure;
    },
    getMonitorSecret: () => monitorSecret,
  });

  const retentionResponse = await retention(
    request("/api/cron/submission-retention/", cronSecret),
  );
  const statusResponse = await status(
    request("/api/submissions/status/", monitorSecret),
  );
  const combinedBodies = `${await retentionResponse.text()} ${await statusResponse.text()}`;

  assert.equal(retentionResponse.status, 503);
  assert.equal(statusResponse.status, 503);
  assert.doesNotMatch(combinedBodies, /private-email|moderation\/submissions/);
});
