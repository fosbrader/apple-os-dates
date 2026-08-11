import assert from "node:assert/strict";
import test from "node:test";
import {
  PublicApiRequestError,
  createPublicApiDetailResponse,
  createPublicApiHistoricalAnalysisResponse,
  createPublicApiListResponse,
  createPublicApiManifest,
  createPublicApiSearchResponse,
  publicApiDetailPath,
  publicApiErrorResponse,
  publicApiHistoricalAnalysisPath,
  validatePublicApiSearchRequest,
} from "../src/lib/public-api";
import { createPublicApiOpenApi } from "../src/lib/public-api/openapi";
import type {
  PublicResearchDatasets,
  ResearchSearchIndex,
} from "../src/lib/research/types";
import { historicalAnalysisReportFixture } from "./fixtures/historical-analysis-report";

const datasets: PublicResearchDatasets = {
  releases: [
    {
      id: "release.ios.26.3",
      vendor: "apple",
      platform: "ios",
      family: "26",
      version: "26.3",
      status: "active",
      public_release_date: null,
      note: "Current cycle",
      release_notes_url: null,
      provenance_status: "audit_verified",
      updated_at: "2026-07-29T12:00:00Z",
    },
    {
      id: "release.macos.26.0",
      vendor: "apple",
      platform: "macos",
      family: "26",
      version: "26.0",
      status: "released",
      public_release_date: "2026-09-15",
      note: null,
      release_notes_url: null,
      provenance_status: "source_linked",
      updated_at: "2026-07-20T12:00:00Z",
    },
  ],
  events: [
    {
      id: "legacy:release.ios.26.3:beta-1",
      vendor: "apple",
      platform: "ios",
      family: "26",
      version_id: "release.ios.26.3",
      version: "26.3",
      label: "Beta 1",
      route_alias: "beta-1",
      channel: "developer_beta",
      appearance_date: "2026-06-09",
      version_label_at_appearance: null,
      availability_state: "available",
      build_id: null,
      build_number: null,
      is_revision: false,
      audience: [],
      device_scope: [],
      region_scope: [],
      language_scope: [],
      note: null,
      provenance_status: "audit_verified",
      index_eligible: false,
      source_count: 1,
      updated_at: "2026-07-29T12:00:00Z",
    },
  ],
  builds: [],
  changes: [],
  occurrences: [],
  citations: [],
  provenance: [],
};

const searchIndex: ResearchSearchIndex = {
  schema_version: "1.0.0",
  generated_at: "2026-07-29T12:00:00.000Z",
  documents: [
    {
      id: "release:release.ios.26.3",
      kind: "release",
      record_id: "release.ios.26.3",
      api_dataset: "releases",
      title: "iOS 26.3",
      href: "/apple/ios/26.3",
      text: "Current cycle",
      vendor: "apple",
      platform: "ios",
      family: "26",
      version: "26.3",
      date: null,
      status: "active",
      channel: null,
      build_number: null,
      change_type: null,
      documented_status: null,
      evidence_state: null,
      publishers: ["Apple"],
    },
    {
      id: "event:legacy:release.ios.26.3:beta-1",
      kind: "event",
      record_id: "legacy:release.ios.26.3:beta-1",
      api_dataset: "events",
      title: "iOS 26.3 Beta 1",
      href: "/apple/ios/26.3/beta-1/",
      text: "Developer beta",
      vendor: "apple",
      platform: "ios",
      family: "26",
      version: "26.3",
      date: "2026-06-09",
      status: "available",
      channel: "developer_beta",
      build_number: null,
      change_type: null,
      documented_status: null,
      evidence_state: null,
      publishers: ["Apple"],
    },
  ],
};

test("the public API applies the export allowlist before it returns records", () => {
  const unsafe = {
    ...datasets,
    releases: [
      {
        ...datasets.releases[0],
        editorial_notes: "private work note",
      },
    ],
  } as PublicResearchDatasets;
  const response = createPublicApiListResponse(
    "releases",
    unsafe,
    "https://example.test/api/v1/releases?platform=IOS&limit=1",
    "2026-07-30T00:00:00.000Z",
  );

  assert.equal(response.data.length, 1);
  assert.equal(response.data[0].platform, "ios");
  assert.equal(response.data[0].editorial_notes, undefined);
  assert.equal(response.pagination.total, 1);
  assert.equal(response.links.self, "/api/v1/releases/?platform=IOS&limit=1");
});

test("the public API validates list parameters before it filters records", () => {
  assert.throws(
    () =>
      createPublicApiListResponse(
        "releases",
        datasets,
        "https://example.test/api/v1/releases?limit=101",
      ),
    (error: unknown) =>
      error instanceof PublicApiRequestError &&
      error.code === "INVALID_PARAMETER" &&
      error.parameter === "limit",
  );

  assert.throws(
    () =>
      createPublicApiListResponse(
        "releases",
        datasets,
        "https://example.test/api/v1/releases?unknown=value",
      ),
    (error: unknown) =>
      error instanceof PublicApiRequestError &&
      error.code === "UNKNOWN_PARAMETER" &&
      error.parameter === "unknown",
  );
});

test("detail responses keep a record ID exact and give relation links", () => {
  const response = createPublicApiDetailResponse(
    "events",
    "legacy:release.ios.26.3:beta-1",
    datasets,
    "https://example.test/api/v1/events/legacy%3Arelease.ios.26.3%3Abeta-1",
    "2026-07-30T00:00:00.000Z",
  );

  assert.equal(response.data.id, "legacy:release.ios.26.3:beta-1");
  assert.equal(
    response.links.occurrences,
    "/api/v1/occurrences/?target_id=legacy%3Arelease.ios.26.3%3Abeta-1",
  );
  assert.equal(
    response.links.citations,
    "/api/v1/citations/?target_id=legacy%3Arelease.ios.26.3%3Abeta-1",
  );
});

test("the public API creates direct detail paths for both Next.js URL shapes", () => {
  assert.equal(
    publicApiDetailPath("releases", "version-ios-26-6"),
    "/api/v1/releases/version-ios-26-6/",
  );
  assert.equal(
    publicApiDetailPath("releases", "release.ios.26.3"),
    "/api/v1/releases/release.ios.26.3",
  );
});

test("the public API search returns a ranked page with the total count", () => {
  const response = createPublicApiSearchResponse(
    searchIndex,
    "https://example.test/api/v1/search?q=ios&limit=1&offset=1",
  );

  assert.equal(response.pagination.total, 2);
  assert.equal(response.pagination.returned, 1);
  assert.equal(response.pagination.next, null);
  assert.equal(
    response.pagination.previous,
    "/api/v1/search/?q=ios&limit=1&offset=0",
  );
  assert.equal(response.data[0].kind, "release");
  assert.equal(typeof response.data[0].score, "number");
  assert.equal("text" in response.data[0], false);
  assert.deepEqual(response.data[0].record, {
    dataset: "releases",
    id: "release.ios.26.3",
    api_path: "/api/v1/releases/release.ios.26.3",
  });
});

test("the public API rejects a punctuation-only search before data is loaded", () => {
  assert.throws(
    () =>
      validatePublicApiSearchRequest(
        "https://example.test/api/v1/search/?q=!!!&limit=1",
      ),
    (error: unknown) =>
      error instanceof PublicApiRequestError &&
      error.code === "INVALID_PARAMETER" &&
      error.parameter === "q",
  );
});

test("the public API returns one validated historical-analysis snapshot", () => {
  const report = historicalAnalysisReportFixture();
  const path = publicApiHistoricalAnalysisPath();
  const response = createPublicApiHistoricalAnalysisResponse(
    report,
    `https://example.test${path}`,
  );

  assert.equal(response.generated_at, report.provenance.source_issued_at);
  assert.equal(response.data.report_fingerprint, report.report_fingerprint);
  assert.deepEqual(response.links, {
    self: path,
    openapi: "/api/v1/openapi.json",
    analytics: "/analytics/",
  });
  assert.throws(
    () =>
      createPublicApiHistoricalAnalysisResponse(
        report,
        `https://example.test${path}?limit=1`,
      ),
    (error: unknown) =>
      error instanceof PublicApiRequestError &&
      error.code === "UNKNOWN_PARAMETER" &&
      error.parameter === "limit",
  );
  assert.throws(
    () =>
      createPublicApiHistoricalAnalysisResponse(
        { ...report, report_fingerprint: "f".repeat(64) },
        `https://example.test${path}`,
      ),
    (error: unknown) =>
      error instanceof PublicApiRequestError &&
      error.status === 503 &&
      error.code === "HISTORICAL_ANALYSIS_UNAVAILABLE",
  );
  assert.deepEqual(
    createPublicApiManifest("2026-08-10T12:00:00.000Z").historical_analysis,
    {
      method: "GET",
      path,
      description: "Read validated historical cadence results and methodology.",
    },
  );
});

test("the public API returns stable public error bodies", async () => {
  const response = publicApiErrorResponse(
    new PublicApiRequestError(
      404,
      "RECORD_NOT_FOUND",
      "The requested record does not exist.",
      "id",
    ),
  );
  const body = (await response.json()) as {
    api_version: string;
    error: { code: string; parameter?: string };
  };

  assert.equal(response.status, 404);
  assert.equal(response.headers.get("access-control-allow-origin"), "*");
  assert.equal(body.api_version, "v1");
  assert.equal(body.error.code, "RECORD_NOT_FOUND");
  assert.equal(body.error.parameter, "id");
});

test("rate-limit errors are non-cacheable and tell clients when to retry", async () => {
  const response = publicApiErrorResponse(
    new PublicApiRequestError(
      429,
      "RATE_LIMITED",
      "Too many requests. Wait 60 seconds before retrying.",
    ),
  );

  assert.equal(response.status, 429);
  assert.equal(response.headers.get("cache-control"), "no-store");
  assert.equal(response.headers.get("retry-after"), "60");
});

test("the OpenAPI document uses the API allowlist and correct scalar types", () => {
  const document = createPublicApiOpenApi() as {
    openapi: string;
    paths: Record<string, unknown>;
    components: {
      schemas: Record<
        string,
        {
          required?: string[];
          properties?: Record<string, { type?: string | string[] }>;
        }
      >;
    };
  };

  assert.equal(document.openapi, "3.1.0");
  assert.ok(document.paths["/api/v1/events/"]);
  assert.ok(document.paths["/api/v1/events/{id}"]);
  assert.ok(document.paths["/api/v1/historical-analysis/"]);
  assert.ok(document.components.schemas.HistoricalAnalysisReport);
  assert.deepEqual(
    document.components.schemas.events.properties?.source_count.type,
    "integer",
  );
  assert.deepEqual(
    document.components.schemas.events.properties?.build_number.type,
    ["string", "null"],
  );
  assert.equal(
    document.components.schemas.eventsDetail.required?.includes("pagination"),
    false,
  );
  assert.equal(
    document.components.schemas.SearchResult.properties?.text,
    undefined,
  );
});
