import { publicApiDatasetFields, type PublicApiFieldDefinition } from "./fields";
import {
  RESEARCH_EXPORT_LICENSE,
  RESEARCH_EXPORT_LICENSE_SCOPE,
  RESEARCH_EXPORT_LICENSE_URL,
  RESEARCH_EXPORT_VERSION,
  type ResearchDatasetName,
} from "@/lib/research/types";
import {
  PUBLIC_API_DATASETS,
  PUBLIC_API_DEFAULT_LIMIT,
  PUBLIC_API_MAX_LIMIT,
  PUBLIC_API_SEARCH_FILTERS,
  PUBLIC_API_VERSION,
  publicApiCollectionPath,
  publicApiOpenApiPath,
  publicApiRootPath,
  publicApiSearchPath,
  type PublicApiDatasetName,
  type PublicApiFilterDefinition,
} from "./types";

function fieldSchema(field: PublicApiFieldDefinition): Record<string, unknown> {
  const base =
    field.type === "array"
      ? { type: "array", items: { type: "string" } }
      : { type: field.type };

  return {
    ...base,
    ...(field.nullable ? { type: [field.type, "null"] } : {}),
    ...(field.format ? { format: field.format } : {}),
    description: field.description,
  };
}

function dataSchema(dataset: ResearchDatasetName): Record<string, unknown> {
  const fields = publicApiDatasetFields(dataset);
  return {
    type: "object",
    additionalProperties: false,
    required: fields.map((field) => field.name),
    properties: Object.fromEntries(
      fields.map((field) => [field.name, fieldSchema(field)]),
    ),
  };
}

function paginationParameters() {
  return [
    {
      name: "limit",
      in: "query",
      description: `Set the page size. Use an integer from 1 through ${PUBLIC_API_MAX_LIMIT}.`,
      schema: {
        type: "integer",
        minimum: 1,
        maximum: PUBLIC_API_MAX_LIMIT,
        default: PUBLIC_API_DEFAULT_LIMIT,
      },
    },
    {
      name: "offset",
      in: "query",
      description: "Set the zero-based record offset. Use 0 through 1000000.",
      schema: { type: "integer", minimum: 0, maximum: 1_000_000, default: 0 },
    },
  ];
}

function filterSchema(filter: PublicApiFilterDefinition) {
  if (filter.value_type === "boolean") {
    return { type: "boolean", example: filter.example === "true" };
  }
  if (filter.value_type === "utc-date-or-date-time") {
    return {
      oneOf: [
        { type: "string", format: "date" },
        { type: "string", format: "date-time" },
      ],
      example: filter.example,
    };
  }
  return { type: "string", example: filter.example };
}

function filterParameters(filters: readonly PublicApiFilterDefinition[]) {
  return filters.map((filter) => ({
    name: filter.name,
    in: "query",
    description: filter.description,
    schema: filterSchema(filter),
  }));
}

function responseReference(name: string) {
  return { "$ref": `#/components/responses/${name}` };
}

function collectionPath(dataset: PublicApiDatasetName) {
  const definition = PUBLIC_API_DATASETS[dataset];
  return {
    get: {
      tags: ["Records"],
      summary: `List ${dataset}`,
      description: `${definition.description} Results use stable source order: platform, version, event date when present, then record ID.`,
      operationId: `list${dataset[0].toUpperCase()}${dataset.slice(1)}`,
      parameters: [
        ...paginationParameters(),
        ...filterParameters(definition.filters),
      ],
      responses: {
        "200": {
          description: "The requested record page.",
          content: {
            "application/json": {
              schema: { "$ref": `#/components/schemas/${dataset}Collection` },
            },
          },
        },
        "400": responseReference("BadRequest"),
        "429": responseReference("RateLimited"),
        "503": responseReference("Unavailable"),
      },
    },
  };
}

function detailPath(dataset: PublicApiDatasetName) {
  const definition = PUBLIC_API_DATASETS[dataset];
  return {
    get: {
      tags: ["Records"],
      summary: `Get one ${definition.singular}`,
      description:
        "Use the exact record ID from a list response. Prefer the response links.self path, which is canonical for that ID. A final ID with a period has no trailing slash; other detail IDs do.",
      operationId: `get${dataset[0].toUpperCase()}${dataset.slice(1)}Record`,
      parameters: [
        {
          name: "id",
          in: "path",
          required: true,
          description: "The exact public record ID.",
          schema: { type: "string", maxLength: 500 },
        },
      ],
      responses: {
        "200": {
          description: "The requested record.",
          content: {
            "application/json": {
              schema: { "$ref": `#/components/schemas/${dataset}Detail` },
            },
          },
        },
        "400": responseReference("BadRequest"),
        "404": responseReference("NotFound"),
        "429": responseReference("RateLimited"),
        "503": responseReference("Unavailable"),
      },
    },
  };
}

function apiResponseSchema(
  itemSchema: Record<string, unknown>,
  hasPagination: boolean,
) {
  return {
    type: "object",
    additionalProperties: false,
    required: [
      "api_version",
      "generated_at",
      "data",
      ...(hasPagination ? ["pagination"] : []),
      "links",
    ],
    properties: {
      api_version: {
        type: "string",
        const: PUBLIC_API_VERSION,
        description: "Major API contract version.",
      },
      generated_at: {
        type: "string",
        format: "date-time",
        description:
          "UTC time when this response snapshot was created. It is not the last update time for every record.",
      },
      data: itemSchema,
      ...(hasPagination
        ? { pagination: { "$ref": "#/components/schemas/Pagination" } }
        : {}),
      links: {
        type: "object",
        additionalProperties: { type: "string" },
        description: "Relative canonical API paths related to this response.",
      },
    },
  };
}

/**
 * This is code rather than a checked-in JSON file. Field names, types, and
 * descriptions come from the public serialization allowlist. The contract
 * cannot silently grow when CMS fields are added.
 */
export function createPublicApiOpenApi() {
  const datasetPaths = Object.fromEntries(
    Object.keys(PUBLIC_API_DATASETS).flatMap((dataset) => {
      const name = dataset as PublicApiDatasetName;
      const collection = publicApiCollectionPath(name);
      return [
        [collection, collectionPath(name)],
        [`${collection}{id}`, detailPath(name)],
      ];
    }),
  );

  const datasetSchemas = Object.fromEntries(
    Object.keys(PUBLIC_API_DATASETS).flatMap((dataset) => {
      const name = dataset as PublicApiDatasetName;
      const item = dataSchema(name);
      return [
        [name, item],
        [
          `${name}Collection`,
          apiResponseSchema(
            { type: "array", items: { "$ref": `#/components/schemas/${name}` } },
            true,
          ),
        ],
        [
          `${name}Detail`,
          apiResponseSchema({ "$ref": `#/components/schemas/${name}` }, false),
        ],
      ];
    }),
  );

  return {
    openapi: "3.1.0",
    info: {
      title: "Version Record Public API",
      version: "1.0.0",
      description:
        "Read source-backed software release data. Send GET requests only. Within v1, Version Record can add documented optional fields but will not remove or rename a field, change a field type, or repurpose a path. A breaking change uses a new versioned path. A future deprecation will be documented here before removal.",
      license: {
        name: RESEARCH_EXPORT_LICENSE,
        url: RESEARCH_EXPORT_LICENSE_URL,
      },
    },
    servers: [{ url: "https://www.versionrecord.com" }],
    externalDocs: {
      description: "Read the API reference.",
      url: "https://www.versionrecord.com/api/",
    },
    tags: [
      { name: "Records", description: "Read public archive records." },
      { name: "Search", description: "Search public archive records." },
      { name: "Reference", description: "Read API contract files." },
    ],
    paths: {
      [publicApiRootPath()]: {
        get: {
          tags: ["Reference"],
          summary: "Get API information",
          description: "Get canonical API paths and license data.",
          operationId: "getApiInformation",
          responses: {
            "200": {
              description: "API information.",
              content: { "application/json": { schema: { type: "object" } } },
            },
            "429": responseReference("RateLimited"),
            "503": responseReference("Unavailable"),
          },
        },
      },
      [publicApiOpenApiPath()]: {
        get: {
          tags: ["Reference"],
          summary: "Get the OpenAPI document",
          description: "Get this OpenAPI 3.1 document.",
          operationId: "getOpenApiDocument",
          responses: {
            "200": {
              description: "The OpenAPI document.",
              content: { "application/json": { schema: { type: "object" } } },
            },
            "429": responseReference("RateLimited"),
            "503": responseReference("Unavailable"),
          },
        },
      },
      ...datasetPaths,
      [publicApiSearchPath()]: {
        get: {
          tags: ["Search"],
          summary: "Search release records",
          description:
            "Find public records that contain all search terms. Results sort by relevance score, newest record date, then title. Search result metadata deliberately excludes full editorial text; use record.api_path for the matching factual record.",
          operationId: "searchReleaseRecords",
          parameters: [
            {
              name: "q",
              in: "query",
              required: true,
              description: "Send one or more letters or numbers. All search terms must match.",
              schema: { type: "string", minLength: 1, maxLength: 200 },
            },
            ...paginationParameters(),
            ...filterParameters(PUBLIC_API_SEARCH_FILTERS),
          ],
          responses: {
            "200": {
              description: "The ranked result page.",
              content: {
                "application/json": {
                  schema: { "$ref": "#/components/schemas/SearchCollection" },
                },
              },
            },
            "400": responseReference("BadRequest"),
            "429": responseReference("RateLimited"),
            "503": responseReference("Unavailable"),
          },
        },
      },
    },
    components: {
      schemas: {
        ...datasetSchemas,
        Pagination: {
          type: "object",
          additionalProperties: false,
          required: ["limit", "offset", "returned", "total", "next", "previous"],
          properties: {
            limit: { type: "integer", description: "Requested page size." },
            offset: { type: "integer", description: "Requested record offset." },
            returned: { type: "integer", description: "Records in data." },
            total: { type: "integer", description: "All matching records." },
            next: { type: ["string", "null"], description: "Next page path." },
            previous: { type: ["string", "null"], description: "Previous page path." },
          },
        },
        SearchRecord: {
          type: "object",
          additionalProperties: false,
          required: ["dataset", "id", "api_path"],
          properties: {
            dataset: {
              type: "string",
              enum: ["releases", "events", "builds", "occurrences"],
              description: "Collection that owns the matching record.",
            },
            id: { type: "string", description: "Exact public record ID." },
            api_path: {
              type: "string",
              description: "Canonical relative API path for the factual record.",
            },
          },
        },
        SearchResult: {
          type: "object",
          additionalProperties: false,
          required: [
            "search_id",
            "kind",
            "title",
            "href",
            "record",
            "vendor",
            "platform",
            "family",
            "version",
            "date",
            "status",
            "channel",
            "build_number",
            "change_type",
            "documented_status",
            "evidence_state",
            "publishers",
            "score",
          ],
          properties: {
            search_id: { type: "string", description: "Stable search-index identifier." },
            kind: { type: "string", enum: ["release", "event", "build", "change"] },
            title: { type: "string", description: "Display title of the search match." },
            href: { type: "string", description: "Relative Version Record page path." },
            record: { "$ref": "#/components/schemas/SearchRecord" },
            vendor: { type: "string" },
            platform: { type: ["string", "null"] },
            family: { type: ["string", "null"] },
            version: { type: ["string", "null"] },
            date: { type: ["string", "null"], format: "date" },
            status: { type: ["string", "null"] },
            channel: { type: ["string", "null"] },
            build_number: { type: ["string", "null"] },
            change_type: { type: ["string", "null"] },
            documented_status: { type: ["string", "null"] },
            evidence_state: { type: ["string", "null"] },
            publishers: { type: "array", items: { type: "string" } },
            score: { type: "number", description: "Relative relevance score." },
          },
        },
        SearchCollection: apiResponseSchema(
          { type: "array", items: { "$ref": "#/components/schemas/SearchResult" } },
          true,
        ),
        Error: {
          type: "object",
          additionalProperties: false,
          required: ["api_version", "error"],
          properties: {
            api_version: { type: "string", const: PUBLIC_API_VERSION },
            error: {
              type: "object",
              additionalProperties: false,
              required: ["code", "message"],
              properties: {
                code: { type: "string", description: "Stable machine-readable error code." },
                message: { type: "string", description: "Short error explanation." },
                parameter: { type: "string", description: "Invalid request parameter, if applicable." },
              },
            },
          },
        },
      },
      responses: {
        BadRequest: {
          description: "The request has an invalid parameter.",
          content: { "application/json": { schema: { "$ref": "#/components/schemas/Error" } } },
        },
        NotFound: {
          description: "The requested record does not exist.",
          content: { "application/json": { schema: { "$ref": "#/components/schemas/Error" } } },
        },
        RateLimited: {
          description: "A configured API rate limit rejected the request.",
          headers: {
            "Retry-After": {
              description: "Seconds to wait before retrying, when supplied by the limiter.",
              schema: { type: "integer", minimum: 1 },
            },
          },
          content: { "application/json": { schema: { "$ref": "#/components/schemas/Error" } } },
        },
        Unavailable: {
          description: "The API cannot answer this request now.",
          headers: {
            "Retry-After": {
              description: "Seconds to wait before retrying.",
              schema: { type: "integer", minimum: 1 },
            },
          },
          content: { "application/json": { schema: { "$ref": "#/components/schemas/Error" } } },
        },
      },
    },
    "x-version-record": {
      api_version: PUBLIC_API_VERSION,
      export_schema_version: RESEARCH_EXPORT_VERSION,
      license_scope: RESEARCH_EXPORT_LICENSE_SCOPE,
      cache_seconds: 300,
    },
  };
}
