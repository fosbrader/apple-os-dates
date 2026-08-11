import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";

import { HistoricalAnalysisReport } from "../src/components/analytics/HistoricalAnalysisReport";
import { historicalAnalysisReportFixture } from "./fixtures/historical-analysis-report";

test("FR-016 renders the historical report with semantic, keyboard-accessible markup", () => {
  const markup = renderToStaticMarkup(
    React.createElement(HistoricalAnalysisReport, {
      report: historicalAnalysisReportFixture(),
    }),
  );

  assert.match(markup, /<section[^>]+id="historical-analysis"/);
  assert.match(markup, /<h2[^>]*>Historical timing analysis<\/h2>/);
  assert.match(markup, /<h3[^>]*>Overall timing accuracy<\/h3>/);
  assert.match(markup, /<table[^>]+class="data-table min-w-\[52rem\]"/);
  assert.match(markup, /<caption class="sr-only">/);
  assert.match(markup, /role="region"/);
  assert.match(markup, /tabindex="0"/);
  assert.match(markup, /overflow-x-auto/);
  assert.match(markup, /href="\/api\/v1\/historical-analysis\/"/);
  assert.match(markup, /Included and excluded intervals/);
  assert.match(markup, /Minimum sample rules/);
  assert.doesNotMatch(markup, /animate-in/);
});

test("FR-016 gives assistive technology a clear unavailable state", () => {
  const markup = renderToStaticMarkup(
    React.createElement(HistoricalAnalysisReport, { report: null }),
  );

  assert.match(markup, /role="status"/);
  assert.match(markup, /Historical analysis is not available/);
  assert.match(
    markup,
    /This section appears only when the complete source record/,
  );
  assert.doesNotMatch(markup, /<table/);
});

test("FR-016 adds a direct historical-analysis section to the API reference", () => {
  const source = readFileSync(
    new URL("../src/app/api/page.tsx", import.meta.url),
    "utf8",
  );

  assert.match(source, /id="historical-analysis"/);
  assert.match(source, /Check measured timing results\./);
  assert.match(source, /No query parameters/);
  assert.match(source, /It does not return incomplete analysis/);
  assert.match(source, /href=\{historicalAnalysisPath\}/);
});
