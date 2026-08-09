import { checkRateLimit } from "@vercel/firewall";
import {
  selectPublicColumns,
} from "@/lib/research/serialize";
import type {
  PublicResearchDatasets,
  PublicResearchRow,
  ResearchSearchDocument,
  ResearchSearchFilters,
  ResearchSearchIndex,
  ResearchSearchResult,
} from "@/lib/research/types";
import {
  hasResearchSearchTerm,
  searchResearchIndexPage,
} from "@/lib/research/search";
import {
  PUBLIC_API_DATASETS,
  PUBLIC_API_DEFAULT_LIMIT,
  PUBLIC_API_MAX_LIMIT,
  PUBLIC_API_SEARCH_FILTERS,
  PUBLIC_API_VERSION,
  canonicalPublicApiPathname,
  isPublicApiDatasetName,
  publicApiCollectionPath,
  publicApiDetailPath,
  publicApiOpenApiPath,
  publicApiRootPath,
  publicApiSearchPath,
  type PublicApiDatasetName,
} from "./types";

const PUBLIC_CACHE =
  "public, max-age=0, s-maxage=300, stale-while-revalidate=86400";
const MAX_QUERY_VALUE_LENGTH = 200;
const MAX_RECORD_ID_LENGTH = 500;
const configuredRateLimitId = process.env.VERCEL_API_RATE_LIMIT_ID?.trim();
const configuredRateLimitWindow = Number.parseInt(
  process.env.VERCEL_API_RATE_LIMIT_WINDOW_SECONDS || "60",
  10,
);
const publicApiRateLimitWindow =
  Number.isSafeInteger(configuredRateLimitWindow) && configuredRateLimitWindow > 0
    ? configuredRateLimitWindow
    : 60;

export interface PublicApiPagination {
  limit: number;
  offset: number;
  returned: number;
  total: number;
  next: string | null;
  previous: string | null;
}

export interface PublicApiListResponse {
  api_version: typeof PUBLIC_API_VERSION;
  generated_at: string;
  data: PublicResearchRow[];
  pagination: PublicApiPagination;
  links: {
    self: string;
    openapi: string;
  };
}

export interface PublicApiDetailResponse {
  api_version: typeof PUBLIC_API_VERSION;
  generated_at: string;
  data: PublicResearchRow;
  links: Record<string, string>;
}

export interface PublicApiSearchResult {
  search_id: string;
  kind: ResearchSearchDocument["kind"];
  title: string;
  href: string;
  record: {
    dataset: ResearchSearchDocument["api_dataset"];
    id: string;
    api_path: string;
  };
  vendor: string;
  platform: string | null;
  family: string | null;
  version: string | null;
  date: string | null;
  status: string | null;
  channel: string | null;
  build_number: string | null;
  change_type: string | null;
  documented_status: string | null;
  evidence_state: string | null;
  publishers: string[];
  score: number;
}

export interface PublicApiSearchResponse {
  api_version: typeof PUBLIC_API_VERSION;
  generated_at: string;
  data: PublicApiSearchResult[];
  pagination: PublicApiPagination;
  links: {
    self: string;
    openapi: string;
  };
}

export interface PublicApiErrorBody {
  api_version: typeof PUBLIC_API_VERSION;
  error: {
    code: string;
    message: string;
    parameter?: string;
  };
}

export class PublicApiRequestError extends Error {
  readonly code: string;
  readonly parameter?: string;
  readonly status: number;

  constructor(
    status: number,
    code: string,
    message: string,
    parameter?: string,
  ) {
    super(message);
    this.name = "PublicApiRequestError";
    this.status = status;
    this.code = code;
    this.parameter = parameter;
  }
}

/**
 * Use Vercel Firewall's distributed limiter when its rule ID is configured.
 * The SDK is intentionally optional outside Vercel so local development and
 * previews do not need a second rate-limit service.
 */
export async function enforcePublicApiRateLimit(
  request: Request,
): Promise<void> {
  if (!configuredRateLimitId) return;

  const result = await checkRateLimit(configuredRateLimitId, { request });
  if (result.error === "blocked") {
    throw new PublicApiRequestError(
      403,
      "REQUEST_BLOCKED",
      "This request is blocked by the API gateway.",
    );
  }
  if (result.rateLimited) {
    throw new PublicApiRequestError(
      429,
      "RATE_LIMITED",
      `Too many requests. Wait ${publicApiRateLimitWindow} seconds before retrying.`,
    );
  }
}

export interface PublicApiListRequest {
  filters: Map<string, string>;
  limit: number;
  offset: number;
}

export interface PublicApiSearchRequest extends PublicApiListRequest {
  query: string;
  search_filters: ResearchSearchFilters;
}

function badRequest(
  code: string,
  message: string,
  parameter?: string,
): never {
  throw new PublicApiRequestError(400, code, message, parameter);
}

function normalizedValue(value: string): string {
  return value
    .normalize("NFKD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .trim();
}

function relativeUrl(url: URL): string {
  return `${canonicalPublicApiPathname(url.pathname)}${url.search}`;
}

function pageUrl(url: URL, offset: number): string {
  const page = new URL(url);
  page.searchParams.set("offset", String(offset));
  return relativeUrl(page);
}

function readSingleParameter(
  params: URLSearchParams,
  name: string,
): string | undefined {
  const values = params.getAll(name);
  if (values.length > 1) {
    badRequest(
      "DUPLICATE_PARAMETER",
      "Send each query parameter one time.",
      name,
    );
  }

  return values[0];
}

function parsePositiveInteger(
  value: string | undefined,
  name: "limit" | "offset",
): number {
  if (value === undefined) {
    return name === "limit" ? PUBLIC_API_DEFAULT_LIMIT : 0;
  }

  if (!/^(?:0|[1-9]\d*)$/.test(value)) {
    badRequest(
      "INVALID_PARAMETER",
      `Use a whole number for ${name}.`,
      name,
    );
  }

  const parsed = Number(value);
  if (!Number.isSafeInteger(parsed)) {
    badRequest(
      "INVALID_PARAMETER",
      `Use a safe whole number for ${name}.`,
      name,
    );
  }

  if (name === "limit" && (parsed < 1 || parsed > PUBLIC_API_MAX_LIMIT)) {
    badRequest(
      "INVALID_PARAMETER",
      `Set limit from 1 through ${PUBLIC_API_MAX_LIMIT}.`,
      name,
    );
  }

  if (name === "offset" && parsed > 1_000_000) {
    badRequest(
      "INVALID_PARAMETER",
      "Set offset to 1000000 or less.",
      name,
    );
  }

  return parsed;
}

function isValidUtcTime(value: string): boolean {
  const dateOnly = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (dateOnly) {
    const [year, month, day] = dateOnly.slice(1).map(Number);
    const date = new Date(`${value}T00:00:00.000Z`);
    return (
      !Number.isNaN(date.valueOf()) &&
      date.getUTCFullYear() === year &&
      date.getUTCMonth() + 1 === month &&
      date.getUTCDate() === day
    );
  }

  return (
    /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(?::\d{2}(?:\.\d{1,3})?)?Z$/.test(
      value,
    ) && !Number.isNaN(Date.parse(value))
  );
}

function parseListRequest(
  url: URL,
  allowedFilters: readonly string[],
): PublicApiListRequest {
  const allowed = new Set(["limit", "offset", ...allowedFilters]);
  const seen = new Set<string>();

  for (const [name] of url.searchParams) {
    if (seen.has(name)) continue;
    seen.add(name);
    if (!allowed.has(name)) {
      badRequest(
        "UNKNOWN_PARAMETER",
        "Use a documented query parameter.",
        name,
      );
    }
    readSingleParameter(url.searchParams, name);
  }

  const limit = parsePositiveInteger(
    readSingleParameter(url.searchParams, "limit"),
    "limit",
  );
  const offset = parsePositiveInteger(
    readSingleParameter(url.searchParams, "offset"),
    "offset",
  );
  const filters = new Map<string, string>();

  for (const name of allowedFilters) {
    const value = readSingleParameter(url.searchParams, name);
    if (value === undefined) continue;
    const trimmed = value.trim();
    if (!trimmed || trimmed.length > MAX_QUERY_VALUE_LENGTH) {
      badRequest(
        "INVALID_PARAMETER",
        "Use a query value from 1 through 200 characters.",
        name,
      );
    }
    if (name === "updated_since" && !isValidUtcTime(trimmed)) {
      badRequest(
        "INVALID_PARAMETER",
        "Use a UTC date or UTC date-time for updated_since.",
        name,
      );
    }
    const normalized = name === "is_revision" ? trimmed.toLowerCase() : trimmed;
    if (
      name === "is_revision" &&
      normalized !== "true" &&
      normalized !== "false"
    ) {
      badRequest(
        "INVALID_PARAMETER",
        "Use true or false for is_revision.",
        name,
      );
    }
    filters.set(name, normalized);
  }

  return { filters, limit, offset };
}

function datasetFilters(dataset: PublicApiDatasetName): readonly string[] {
  return PUBLIC_API_DATASETS[dataset].filters.map((filter) => filter.name);
}

/**
 * Parse a collection request before any CMS or search snapshot is loaded.
 * Route handlers call this first so malformed requests remain inexpensive.
 */
export function validatePublicApiListRequest(
  dataset: PublicApiDatasetName,
  requestUrl: string,
): PublicApiListRequest {
  return parseListRequest(new URL(requestUrl), datasetFilters(dataset));
}

export function validatePublicApiRecordId(id: string): string {
  const trimmedId = id.trim();
  if (!trimmedId || trimmedId.length > MAX_RECORD_ID_LENGTH) {
    throw new PublicApiRequestError(
      400,
      "INVALID_IDENTIFIER",
      "Use a record ID from 1 through 500 characters.",
      "id",
    );
  }
  return trimmedId;
}

/**
 * Parse q and filters before building the full derived search index. The
 * normalized-term check prevents punctuation-only queries from becoming a
 * match-all request.
 */
export function validatePublicApiSearchRequest(
  requestUrl: string,
): PublicApiSearchRequest {
  const url = new URL(requestUrl);
  const filters = PUBLIC_API_SEARCH_FILTERS.map((filter) => filter.name);
  const parsed = parseListRequest(url, ["q", ...filters]);
  const query = parsed.filters.get("q");
  if (!query) {
    badRequest(
      "MISSING_PARAMETER",
      "Send a search term in q.",
      "q",
    );
  }
  if (!hasResearchSearchTerm(query)) {
    badRequest(
      "INVALID_PARAMETER",
      "Use one or more letters or numbers in q.",
      "q",
    );
  }

  const searchFilters = Object.fromEntries(
    Array.from(parsed.filters).filter(([name]) => name !== "q"),
  ) as ResearchSearchFilters;
  if (searchFilters.kind) {
    const kind = normalizedValue(searchFilters.kind);
    if (!["release", "event", "build", "change"].includes(kind)) {
      badRequest(
        "INVALID_PARAMETER",
        "Use release, event, build, or change for kind.",
        "kind",
      );
    }
    searchFilters.kind = kind as ResearchSearchFilters["kind"];
  }

  return {
    ...parsed,
    query,
    search_filters: searchFilters,
  };
}

function valueMatches(
  actual: PublicResearchRow[string],
  expected: string,
): boolean {
  if (Array.isArray(actual)) {
    return actual.some((value) => normalizedValue(value) === normalizedValue(expected));
  }
  if (actual === null) return false;
  if (typeof actual === "boolean") return String(actual) === expected;
  return normalizedValue(String(actual)) === normalizedValue(expected);
}

function rowMatches(
  row: PublicResearchRow,
  filters: Map<string, string>,
): boolean {
  for (const [name, expected] of filters) {
    if (name === "updated_since") {
      const updatedAt = row.updated_at;
      if (
        typeof updatedAt !== "string" ||
        Date.parse(updatedAt) < Date.parse(expected)
      ) {
        return false;
      }
      continue;
    }

    if (!valueMatches(row[name], expected)) return false;
  }
  return true;
}

function createPagination(
  url: URL,
  limit: number,
  offset: number,
  total: number,
  returned: number,
): PublicApiPagination {
  const nextOffset = offset + returned;
  const previousOffset = Math.max(0, offset - limit);
  return {
    limit,
    offset,
    returned,
    total,
    next: nextOffset < total ? pageUrl(url, nextOffset) : null,
    previous: offset > 0 ? pageUrl(url, previousOffset) : null,
  };
}

function resourcePath(dataset: PublicApiDatasetName): string {
  return publicApiCollectionPath(dataset);
}

function resourceListPath(
  dataset: PublicApiDatasetName,
  filters: Record<string, string | null | undefined>,
): string {
  const params = new URLSearchParams();
  for (const [name, value] of Object.entries(filters)) {
    if (value) params.set(name, value);
  }
  const query = params.toString();
  return `${resourcePath(dataset)}${query ? `?${query}` : ""}`;
}

function resourceDetailPath(
  dataset: PublicApiDatasetName,
  id: string,
): string {
  return publicApiDetailPath(dataset, id);
}

function targetPath(targetKind: string, targetId: string): string | null {
  const dataSetForTarget: Record<string, PublicApiDatasetName> = {
    release: "releases",
    event: "events",
    build: "builds",
    change: "changes",
    occurrence: "occurrences",
    audit_batch: "provenance",
    correction: "provenance",
  };
  const dataset = dataSetForTarget[targetKind];
  return dataset ? resourceDetailPath(dataset, targetId) : null;
}

function detailLinks(
  dataset: PublicApiDatasetName,
  row: PublicResearchRow,
  self: string,
): Record<string, string> {
  const id = String(row.id);
  const links: Record<string, string> = {
    self,
    collection: resourcePath(dataset),
    openapi: publicApiOpenApiPath(),
  };

  if (dataset === "releases") {
    links.events = resourceListPath("events", { version_id: id });
    links.builds = resourceListPath("builds", { version_id: id });
    links.occurrences = resourceListPath("occurrences", {
      platform: String(row.platform),
      version: String(row.version),
    });
    links.citations = resourceListPath("citations", { target_id: id });
  }

  if (dataset === "events") {
    const buildId = typeof row.build_id === "string" ? row.build_id : null;
    if (buildId) links.build = resourceDetailPath("builds", buildId);
    links.occurrences = resourceListPath("occurrences", { target_id: id });
    links.citations = resourceListPath("citations", { target_id: id });
  }

  if (dataset === "builds") {
    links.events = resourceListPath("events", { build_id: id });
    links.occurrences = resourceListPath("occurrences", { target_id: id });
    links.citations = resourceListPath("citations", { target_id: id });
  }

  if (dataset === "changes") {
    links.occurrences = resourceListPath("occurrences", { change_id: id });
    links.citations = resourceListPath("citations", { target_id: id });
  }

  if (dataset === "occurrences") {
    const targetKind = typeof row.target_kind === "string" ? row.target_kind : "";
    const targetId = typeof row.target_id === "string" ? row.target_id : "";
    const target = targetPath(targetKind, targetId);
    if (target) links.target = target;
    links.citations = resourceListPath("citations", { target_id: id });
  }

  if (dataset === "citations") {
    const targetKind = typeof row.target_kind === "string" ? row.target_kind : "";
    const targetId = typeof row.target_id === "string" ? row.target_id : "";
    const target = targetPath(targetKind, targetId);
    if (target) links.target = target;
  }

  if (dataset === "provenance") {
    links.citations = resourceListPath("citations", { target_id: id });
  }

  return links;
}

export function resolvePublicApiDataset(
  value: string,
): PublicApiDatasetName {
  if (!isPublicApiDatasetName(value)) {
    throw new PublicApiRequestError(
      404,
      "UNKNOWN_RESOURCE",
      "The requested API resource does not exist.",
    );
  }
  return value;
}

export function createPublicApiListResponse(
  dataset: PublicApiDatasetName,
  datasets: PublicResearchDatasets,
  requestUrl: string,
  generatedAt = new Date().toISOString(),
  request = validatePublicApiListRequest(dataset, requestUrl),
): PublicApiListResponse {
  const url = new URL(requestUrl);
  const rows = selectPublicColumns(dataset, datasets[dataset]).filter((row) =>
    rowMatches(row, request.filters),
  );
  const data = rows.slice(request.offset, request.offset + request.limit);

  return {
    api_version: PUBLIC_API_VERSION,
    generated_at: generatedAt,
    data,
    pagination: createPagination(
      url,
      request.limit,
      request.offset,
      rows.length,
      data.length,
    ),
    links: {
      self: relativeUrl(url),
      openapi: publicApiOpenApiPath(),
    },
  };
}

export function createPublicApiDetailResponse(
  dataset: PublicApiDatasetName,
  id: string,
  datasets: PublicResearchDatasets,
  requestUrl: string,
  generatedAt = new Date().toISOString(),
): PublicApiDetailResponse {
  const trimmedId = validatePublicApiRecordId(id);

  const record = selectPublicColumns(dataset, datasets[dataset]).find(
    (row) => row.id === trimmedId,
  );
  if (!record) {
    throw new PublicApiRequestError(
      404,
      "RECORD_NOT_FOUND",
      "The requested record does not exist.",
      "id",
    );
  }

  const self = relativeUrl(new URL(requestUrl));
  return {
    api_version: PUBLIC_API_VERSION,
    generated_at: generatedAt,
    data: record,
    links: detailLinks(dataset, record, self),
  };
}

export function createPublicApiSearchResponse(
  index: ResearchSearchIndex,
  requestUrl: string,
  request = validatePublicApiSearchRequest(requestUrl),
): PublicApiSearchResponse {
  const url = new URL(requestUrl);
  const page = searchResearchIndexPage(
    index,
    request.query,
    request.search_filters,
    request.limit,
    request.offset,
  );
  const data = page.results.map((result: ResearchSearchResult): PublicApiSearchResult => ({
    search_id: result.document.id,
    kind: result.document.kind,
    title: result.document.title,
    href: result.document.href,
    record: {
      dataset: result.document.api_dataset,
      id: result.document.record_id,
      api_path: resourceDetailPath(
        result.document.api_dataset,
        result.document.record_id,
      ),
    },
    vendor: result.document.vendor,
    platform: result.document.platform,
    family: result.document.family,
    version: result.document.version,
    date: result.document.date,
    status: result.document.status,
    channel: result.document.channel,
    build_number: result.document.build_number,
    change_type: result.document.change_type,
    documented_status: result.document.documented_status,
    evidence_state: result.document.evidence_state,
    publishers: result.document.publishers,
    score: result.score,
  }));

  return {
    api_version: PUBLIC_API_VERSION,
    generated_at: index.generated_at,
    data,
    pagination: createPagination(
      url,
      request.limit,
      request.offset,
      page.total,
      data.length,
    ),
    links: {
      self: relativeUrl(url),
      openapi: publicApiOpenApiPath(),
    },
  };
}

export function createPublicApiManifest(
  generatedAt = new Date().toISOString(),
) {
  return {
    api_version: PUBLIC_API_VERSION,
    generated_at: generatedAt,
    title: "Version Record Public API",
    root: publicApiRootPath(),
    documentation: "/api/",
    openapi: publicApiOpenApiPath(),
    license: "CC0-1.0",
    license_scope:
      "CC0 applies to factual structured fields. Original editorial text, design, media, and third-party material are excluded.",
    endpoints: Object.entries(PUBLIC_API_DATASETS).map(
      ([dataset, definition]) => ({
        method: "GET",
        path: resourcePath(dataset as PublicApiDatasetName),
        detail_path: `${resourcePath(dataset as PublicApiDatasetName)}{id}`,
        description: definition.description,
      }),
    ),
    search: {
      method: "GET",
      path: publicApiSearchPath(),
      description: "Search public release records.",
    },
  };
}

export function publicApiHeaders(
  additionalHeaders?: HeadersInit,
): HeadersInit {
  return {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": PUBLIC_CACHE,
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Max-Age": "86400",
    "X-Content-Type-Options": "nosniff",
    "X-Robots-Tag": "noindex, noarchive",
    ...additionalHeaders,
  };
}

export function publicApiJson(
  body: unknown,
  status = 200,
  additionalHeaders?: HeadersInit,
): Response {
  return Response.json(body, {
    status,
    headers: publicApiHeaders(additionalHeaders),
  });
}

export function publicApiOptions(): Response {
  return new Response(null, {
    status: 204,
    headers: publicApiHeaders(),
  });
}

export function publicApiErrorResponse(error: unknown): Response {
  if (error instanceof PublicApiRequestError) {
    const body: PublicApiErrorBody = {
      api_version: PUBLIC_API_VERSION,
      error: {
        code: error.code,
        message: error.message,
        ...(error.parameter ? { parameter: error.parameter } : {}),
      },
    };
    return publicApiJson(body, error.status, {
      "Cache-Control": "no-store",
      ...(error.status === 429
        ? { "Retry-After": String(publicApiRateLimitWindow) }
        : {}),
    });
  }

  console.error(
    "Public API request failed",
    error instanceof Error ? error.name : "UnknownError",
  );
  return publicApiJson(
    {
      api_version: PUBLIC_API_VERSION,
      error: {
        code: "TEMPORARILY_UNAVAILABLE",
        message: "The API is temporarily unavailable.",
      },
    } satisfies PublicApiErrorBody,
    503,
    {
      "Cache-Control": "no-store",
      "Retry-After": "60",
    },
  );
}

export {
  canonicalPublicApiPathname,
  publicApiCollectionPath,
  publicApiDetailPath,
  publicApiOpenApiPath,
  publicApiRootPath,
  publicApiSearchPath,
} from "./types";
