import assert from "node:assert/strict";
import test from "node:test";

import { createForecastShadowHandler } from "../src/app/api/cron/forecast-shadow/handler";

const cronSecret = "forecast-secret-at-least-24-characters";

function request(secret?: string): Request {
  return new Request("https://www.versionrecord.com/api/cron/forecast-shadow/", {
    headers: secret ? { Authorization: `Bearer ${secret}` } : undefined,
  });
}

test("forecast shadow cron fails closed before it starts the pipeline", async (context) => {
  context.mock.method(console, "error", () => undefined);
  let calls = 0;
  const handler = createForecastShadowHandler({
    runForecastShadow: async () => {
      calls += 1;
    },
    getCronSecret: () => undefined,
  });

  assert.equal((await handler(request(cronSecret))).status, 503);
  assert.equal(calls, 0);

  const unauthorized = createForecastShadowHandler({
    runForecastShadow: async () => {
      calls += 1;
    },
    getCronSecret: () => cronSecret,
  });
  assert.equal((await unauthorized(request("wrong-secret"))).status, 401);
  assert.equal((await unauthorized(request())).status, 401);
  assert.equal(calls, 0);
});

test("forecast shadow cron supplies one stable UTC-day run identity", async () => {
  const calls: unknown[] = [];
  const handler = createForecastShadowHandler({
    runForecastShadow: async (input) => {
      calls.push(input);
    },
    getCronSecret: () => cronSecret,
    now: () => new Date("2026-08-10T08:43:00.000Z"),
  });

  const response = await handler(request(cronSecret));

  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), { completed: true });
  assert.deepEqual(calls, [
    {
      requestedAt: "2026-08-10T08:43:00.000Z",
      scheduledFor: "2026-08-10",
    },
  ]);
  assert.equal(response.headers.get("cache-control"), "no-store");
  assert.equal(response.headers.get("x-robots-tag"), "noindex, noarchive");
  assert.equal(response.headers.get("x-content-type-options"), "nosniff");
});

test("forecast shadow cron rejects an invalid clock and redacts pipeline failures", async (context) => {
  const logs: unknown[][] = [];
  context.mock.method(console, "error", (...values: unknown[]) => {
    logs.push(values);
  });
  let calls = 0;
  const invalidClock = createForecastShadowHandler({
    runForecastShadow: async () => {
      calls += 1;
    },
    getCronSecret: () => cronSecret,
    now: () => new Date(Number.NaN),
  });
  assert.equal((await invalidClock(request(cronSecret))).status, 503);
  assert.equal(calls, 0);

  const failed = createForecastShadowHandler({
    runForecastShadow: async () => {
      throw new Error("private artifact forecast/artifacts/secret.json");
    },
    getCronSecret: () => cronSecret,
    now: () => new Date("2026-08-10T08:43:00.000Z"),
  });
  const response = await failed(request(cronSecret));
  assert.equal(response.status, 503);
  assert.deepEqual(await response.json(), {
    error: "Forecast generation failed.",
  });
  assert.doesNotMatch(JSON.stringify(logs), /secret\.json|forecast\/artifacts/);
});
