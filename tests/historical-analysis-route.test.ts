import assert from "node:assert/strict";
import test from "node:test";

import { createHistoricalAnalysisHandler } from "../src/app/api/v1/historical-analysis/handler";
import { PublicApiRequestError } from "../src/lib/public-api";
import { historicalAnalysisReportFixture } from "./fixtures/historical-analysis-report";

function request(query = ""): Request {
  return new Request(
    `https://www.versionrecord.com/api/v1/historical-analysis/${query}`,
  );
}

test("FR-016 serves a validated historical report with public cache headers", async () => {
  const report = historicalAnalysisReportFixture();
  let loads = 0;
  const handler = createHistoricalAnalysisHandler({
    loadHistoricalAnalysisReport: async () => {
      loads += 1;
      return report;
    },
  });

  const response = await handler(request());
  const body = (await response.json()) as {
    generated_at: string;
    data: { report_fingerprint: string };
  };

  assert.equal(response.status, 200);
  assert.match(response.headers.get("cache-control") ?? "", /s-maxage=300/);
  assert.equal(response.headers.get("access-control-allow-origin"), "*");
  assert.equal(response.headers.get("x-robots-tag"), "noindex, noarchive");
  assert.equal(body.generated_at, report.provenance.source_issued_at);
  assert.equal(body.data.report_fingerprint, report.report_fingerprint);
  assert.equal(loads, 1);
});

test("FR-016 rejects query fields before it reads the report", async () => {
  let loads = 0;
  const handler = createHistoricalAnalysisHandler({
    loadHistoricalAnalysisReport: async () => {
      loads += 1;
      return historicalAnalysisReportFixture();
    },
  });

  const response = await handler(request("?limit=1"));
  const body = (await response.json()) as {
    error: { code: string; parameter?: string };
  };

  assert.equal(response.status, 400);
  assert.equal(body.error.code, "UNKNOWN_PARAMETER");
  assert.equal(body.error.parameter, "limit");
  assert.equal(loads, 0);
});

test("FR-016 redacts unavailable historical-analysis failures", async (context) => {
  const logs: unknown[][] = [];
  context.mock.method(console, "error", (...values: unknown[]) => {
    logs.push(values);
  });
  const handler = createHistoricalAnalysisHandler({
    loadHistoricalAnalysisReport: async () => {
      throw new Error("private forecast/artifacts/secret.json");
    },
  });

  const response = await handler(request());
  const body = (await response.json()) as {
    error: { code: string; message: string };
  };

  assert.equal(response.status, 503);
  assert.equal(body.error.code, "HISTORICAL_ANALYSIS_UNAVAILABLE");
  assert.doesNotMatch(JSON.stringify(body), /secret|artifact|forecast/i);
  assert.deepEqual(logs, [
    ["historical-analysis-api-failure", "report-unavailable"],
  ]);
  assert.equal(response.headers.get("cache-control"), "no-store");
  assert.equal(response.headers.get("retry-after"), null);
});

test("FR-016 retains the API-wide rate-limit response before report work", async () => {
  let loads = 0;
  const handler = createHistoricalAnalysisHandler({
    loadHistoricalAnalysisReport: async () => {
      loads += 1;
      return historicalAnalysisReportFixture();
    },
    enforceRateLimit: async () => {
      throw new PublicApiRequestError(
        429,
        "RATE_LIMITED",
        "Too many requests. Wait 60 seconds before retrying.",
      );
    },
  });

  const response = await handler(request());

  assert.equal(response.status, 429);
  assert.equal(response.headers.get("cache-control"), "no-store");
  assert.equal(response.headers.get("retry-after"), "60");
  assert.equal(loads, 0);
});
