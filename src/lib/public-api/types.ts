import {
  RESEARCH_DATASET_NAMES,
  type ResearchDatasetName,
} from "@/lib/research/types";

export const PUBLIC_API_VERSION = "v1";
export const PUBLIC_API_BASE_PATH = "/api/v1";
export const PUBLIC_API_DEFAULT_LIMIT = 25;
export const PUBLIC_API_MAX_LIMIT = 100;

export const PUBLIC_API_DATASET_NAMES = RESEARCH_DATASET_NAMES;

export type PublicApiDatasetName = ResearchDatasetName;

/**
 * Next.js treats a final segment with a period as file-like when
 * `trailingSlash` is enabled. Keep every public URL in the one shape that
 * reaches its handler without a redirect.
 */
function publicApiPath(segments: readonly string[]): string {
  if (segments.length === 0) return `${PUBLIC_API_BASE_PATH}/`;

  const pathname = `${PUBLIC_API_BASE_PATH}/${segments.join("/")}`;
  const leaf = segments.at(-1) || "";
  return leaf.includes(".") ? pathname : `${pathname}/`;
}

export function publicApiRootPath(): string {
  return publicApiPath([]);
}

export function publicApiCollectionPath(
  dataset: PublicApiDatasetName,
): string {
  return publicApiPath([dataset]);
}

export function publicApiDetailPath(
  dataset: PublicApiDatasetName,
  id: string,
): string {
  return publicApiPath([dataset, encodeURIComponent(id)]);
}

export function publicApiSearchPath(): string {
  return publicApiPath(["search"]);
}

export function publicApiOpenApiPath(): string {
  return publicApiPath(["openapi.json"]);
}

/** Return the canonical API pathname while preserving a caller's query. */
export function canonicalPublicApiPathname(pathname: string): string {
  const stripped = pathname.replace(/\/+$/, "") || PUBLIC_API_BASE_PATH;
  const leaf = stripped.split("/").filter(Boolean).at(-1) || "";
  return leaf.includes(".") ? stripped : `${stripped}/`;
}

export interface PublicApiFilterDefinition {
  name: string;
  description: string;
  example: string;
  value_type?: "boolean" | "utc-date-or-date-time";
}

export interface PublicApiDatasetDefinition {
  singular: string;
  description: string;
  filters: readonly PublicApiFilterDefinition[];
}

const commonReleaseFilters: readonly PublicApiFilterDefinition[] = [
  {
    name: "vendor",
    description: "Get records from one vendor.",
    example: "apple",
  },
  {
    name: "platform",
    description: "Get records from one platform.",
    example: "ios",
  },
  {
    name: "family",
    description: "Get records from one major release family.",
    example: "26",
  },
  {
    name: "version",
    description: "Get records from one version.",
    example: "26.3",
  },
];

export const PUBLIC_API_DATASETS: Record<
  PublicApiDatasetName,
  PublicApiDatasetDefinition
> = {
  releases: {
    singular: "release",
    description: "Get recorded software versions and release state.",
    filters: [
      ...commonReleaseFilters,
      {
        name: "status",
        description: "Get records with one release state.",
        example: "released",
      },
      {
        name: "provenance_status",
        description: "Get records with one evidence state.",
        example: "audit_verified",
      },
      {
        name: "updated_since",
        description: "Get records changed at or after one UTC date or time.",
        example: "2026-07-01T00:00:00Z",
        value_type: "utc-date-or-date-time",
      },
    ],
  },
  events: {
    singular: "event",
    description: "Get dated channel appearances for release versions.",
    filters: [
      ...commonReleaseFilters,
      {
        name: "version_id",
        description: "Get events for one release record ID.",
        example: "release.ios.26.3",
      },
      {
        name: "channel",
        description: "Get events from one release channel.",
        example: "developer_beta",
      },
      {
        name: "availability_state",
        description: "Get events with one availability state.",
        example: "available",
      },
      {
        name: "build_id",
        description: "Get events for one verified build ID.",
        example: "build.23d123",
      },
      {
        name: "build_number",
        description: "Get events for one verified build number.",
        example: "23d123",
      },
      {
        name: "is_revision",
        description: "Get revision events or initial events.",
        example: "false",
        value_type: "boolean",
      },
      {
        name: "updated_since",
        description: "Get records changed at or after one UTC date or time.",
        example: "2026-07-01T00:00:00Z",
        value_type: "utc-date-or-date-time",
      },
    ],
  },
  builds: {
    singular: "build",
    description: "Get verified build identities and release links.",
    filters: [
      ...commonReleaseFilters,
      {
        name: "version_id",
        description: "Get builds for one release record ID.",
        example: "release.ios.26.3",
      },
      {
        name: "build_number",
        description: "Get one verified build number.",
        example: "23d123",
      },
      {
        name: "status",
        description: "Get builds with one availability state.",
        example: "available",
      },
      {
        name: "provenance_status",
        description: "Get records with one evidence state.",
        example: "source_linked",
      },
      {
        name: "updated_since",
        description: "Get records changed at or after one UTC date or time.",
        example: "2026-07-01T00:00:00Z",
        value_type: "utc-date-or-date-time",
      },
    ],
  },
  changes: {
    singular: "change",
    description: "Get approved change definitions.",
    filters: [
      {
        name: "category",
        description: "Get changes from one category.",
        example: "developer_api",
      },
      {
        name: "updated_since",
        description: "Get records changed at or after one UTC date or time.",
        example: "2026-07-01T00:00:00Z",
        value_type: "utc-date-or-date-time",
      },
    ],
  },
  occurrences: {
    singular: "occurrence",
    description: "Get changes as they occur in a build or event.",
    filters: [
      ...commonReleaseFilters,
      {
        name: "change_id",
        description: "Get occurrences for one change record ID.",
        example: "change.example",
      },
      {
        name: "target_kind",
        description: "Get occurrences for one target type.",
        example: "event",
      },
      {
        name: "target_id",
        description: "Get occurrences for one target record ID.",
        example: "event.ios.26.3.beta-4",
      },
      {
        name: "action",
        description: "Get occurrences with one change action.",
        example: "introduced",
      },
      {
        name: "documented_status",
        description: "Get occurrences with one document state.",
        example: "documented",
      },
      {
        name: "evidence_state",
        description: "Get occurrences with one evidence state.",
        example: "confirmed",
      },
      {
        name: "updated_since",
        description: "Get records changed at or after one UTC date or time.",
        example: "2026-07-01T00:00:00Z",
        value_type: "utc-date-or-date-time",
      },
    ],
  },
  citations: {
    singular: "citation",
    description: "Get public source records and source locators.",
    filters: [
      {
        name: "target_kind",
        description: "Get citations for one target type.",
        example: "event",
      },
      {
        name: "target_id",
        description: "Get citations for one target record ID.",
        example: "event.ios.26.3.beta-4",
      },
      {
        name: "source_id",
        description: "Get citations for one source record ID.",
        example: "source.apple.release-notes",
      },
      {
        name: "publisher",
        description: "Get citations from one publisher.",
        example: "apple",
      },
      {
        name: "source_class",
        description: "Get citations from one source class.",
        example: "first_party",
      },
    ],
  },
  provenance: {
    singular: "provenance record",
    description: "Get public audit and correction records.",
    filters: [
      {
        name: "record_type",
        description: "Get one provenance record type.",
        example: "audit_batch",
      },
      {
        name: "status",
        description: "Get records with one publication state.",
        example: "published",
      },
      {
        name: "scope",
        description: "Get records that apply to one platform.",
        example: "ios",
      },
      {
        name: "reason_category",
        description: "Get corrections with one reason type.",
        example: "source_error",
      },
    ],
  },
};

export const PUBLIC_API_SEARCH_FILTERS: readonly PublicApiFilterDefinition[] = [
  {
    name: "kind",
    description: "Get one record kind.",
    example: "event",
  },
  {
    name: "vendor",
    description: "Get records from one vendor.",
    example: "apple",
  },
  {
    name: "platform",
    description: "Get records from one platform.",
    example: "ios",
  },
  {
    name: "family",
    description: "Get records from one major release family.",
    example: "26",
  },
  {
    name: "version",
    description: "Get records from one version.",
    example: "26.3",
  },
  {
    name: "status",
    description: "Get records with one status value.",
    example: "available",
  },
  {
    name: "channel",
    description: "Get records from one release channel.",
    example: "developer_beta",
  },
  {
    name: "change_type",
    description: "Get records with one change action.",
    example: "introduced",
  },
  {
    name: "documented_status",
    description: "Get records with one document state.",
    example: "documented",
  },
  {
    name: "evidence_state",
    description: "Get records with one evidence state.",
    example: "confirmed",
  },
  {
    name: "publisher",
    description: "Get records that cite one publisher.",
    example: "apple",
  },
];

export function isPublicApiDatasetName(
  value: string,
): value is PublicApiDatasetName {
  return PUBLIC_API_DATASET_NAMES.includes(
    value as PublicApiDatasetName,
  );
}
