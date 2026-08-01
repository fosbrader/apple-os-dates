import {
  RESEARCH_DATASET_NAMES,
  RESEARCH_EXPORT_LICENSE,
  RESEARCH_EXPORT_LICENSE_SCOPE,
  RESEARCH_EXPORT_LICENSE_URL,
  RESEARCH_EXPORT_VERSION,
  type PublicResearchDataset,
  type PublicResearchDatasets,
  type PublicResearchRow,
  type PublicResearchValue,
  type ResearchDatasetName,
  type ResearchExportEnvelope,
} from "./types";

export const RESEARCH_DATASET_COLUMNS: Record<
  ResearchDatasetName,
  readonly string[]
> = {
  releases: [
    "id",
    "vendor",
    "platform",
    "family",
    "version",
    "status",
    "public_release_date",
    "release_notes_url",
    "provenance_status",
    "updated_at",
  ],
  events: [
    "id",
    "vendor",
    "platform",
    "family",
    "version_id",
    "version",
    "label",
    "route_alias",
    "channel",
    "appearance_date",
    "version_label_at_appearance",
    "availability_state",
    "build_id",
    "build_number",
    "is_revision",
    "audience",
    "device_scope",
    "region_scope",
    "language_scope",
    "provenance_status",
    "index_eligible",
    "source_count",
    "updated_at",
  ],
  builds: [
    "id",
    "vendor",
    "platform",
    "family",
    "version_id",
    "version",
    "build_number",
    "display_build_number",
    "canonical_slug",
    "status",
    "device_scope",
    "provenance_status",
    "index_eligible",
    "updated_at",
  ],
  changes: [
    "id",
    "title",
    "category",
    "updated_at",
  ],
  occurrences: [
    "id",
    "change_id",
    "change_title",
    "action",
    "inheritance",
    "target_kind",
    "target_id",
    "vendor",
    "platform",
    "family",
    "version",
    "build_number",
    "documented_status",
    "evidence_state",
    "applicability",
    "source_count",
    "updated_at",
  ],
  citations: [
    "id",
    "target_kind",
    "target_id",
    "source_id",
    "source_url",
    "source_title",
    "publisher",
    "author",
    "publication_date",
    "accessed_date",
    "archive_url",
    "source_class",
    "locator",
  ],
  provenance: [
    "id",
    "record_type",
    "title",
    "status",
    "verification_date",
    "scope",
    "snapshot_identity",
    "affected_target_ids",
    "reason_category",
    "published_at",
  ],
};

function publicValue(value: unknown): PublicResearchValue {
  if (
    typeof value === "string" ||
    typeof value === "number" ||
    typeof value === "boolean"
  ) {
    return value;
  }
  if (Array.isArray(value)) {
    return value.filter(
      (candidate): candidate is string =>
        typeof candidate === "string",
    );
  }
  return null;
}

/**
 * Re-project rows at the serialization boundary. This second allowlist ensures
 * a future Sanity query or normalizer change cannot accidentally add private
 * fields to an export.
 */
export function selectPublicColumns(
  dataset: ResearchDatasetName,
  rows: PublicResearchDataset,
): PublicResearchRow[] {
  const columns = RESEARCH_DATASET_COLUMNS[dataset];
  return rows.map((row) =>
    Object.fromEntries(
      columns.map((column) => [
        column,
        publicValue(row[column]),
      ]),
    ),
  );
}

export function createResearchEnvelope(
  dataset: ResearchDatasetName,
  datasets: PublicResearchDatasets,
  generatedAt = new Date().toISOString(),
): ResearchExportEnvelope {
  const records = selectPublicColumns(dataset, datasets[dataset]);
  return {
    schema_version: RESEARCH_EXPORT_VERSION,
    dataset,
    generated_at: generatedAt,
    license: RESEARCH_EXPORT_LICENSE,
    license_scope: RESEARCH_EXPORT_LICENSE_SCOPE,
    record_count: records.length,
    records,
  };
}

function csvScalar(value: PublicResearchValue): string {
  if (value === null) return "";
  if (Array.isArray(value)) return JSON.stringify(value);
  return String(value);
}

function protectSpreadsheetFormula(value: string): string {
  return /^[=+\-@\t\r]/.test(value) ? `'${value}` : value;
}

function csvCell(value: PublicResearchValue): string {
  const protectedValue = protectSpreadsheetFormula(csvScalar(value));
  return `"${protectedValue.replaceAll('"', '""')}"`;
}

export function serializeResearchCsv(
  dataset: ResearchDatasetName,
  rows: PublicResearchDataset,
): string {
  const columns = RESEARCH_DATASET_COLUMNS[dataset];
  const publicRows = selectPublicColumns(dataset, rows);
  const lines = [
    columns.map((column) => csvCell(column)).join(","),
    ...publicRows.map((row) =>
      columns.map((column) => csvCell(row[column])).join(","),
    ),
  ];
  return `${lines.join("\r\n")}\r\n`;
}

export function researchExportManifest(generatedAt: string) {
  return {
    schema_version: RESEARCH_EXPORT_VERSION,
    generated_at: generatedAt,
    license: RESEARCH_EXPORT_LICENSE,
    license_url: RESEARCH_EXPORT_LICENSE_URL,
    editorial_rights:
      "Original editorial prose, design, and media are not included in the CC0 grant.",
    datasets: RESEARCH_DATASET_NAMES.map((dataset) => ({
      name: dataset,
      json: `/exports/v1/${dataset}.json`,
      csv: `/exports/v1/${dataset}.csv`,
      columns: RESEARCH_DATASET_COLUMNS[dataset],
    })),
  };
}

export function researchExportReadme(): string {
  return `Version Record public research exports

Schema version: ${RESEARCH_EXPORT_VERSION}
License: ${RESEARCH_EXPORT_LICENSE}

The factual structured fields in these files are dedicated to the public
domain under CC0 1.0. Original editorial prose, correction explanations,
verification narratives, design, media, and third-party material are not part
of that grant and are not included as bulk-export fields.

Available datasets:
${RESEARCH_DATASET_NAMES.map(
  (dataset) =>
    `- ${dataset}.json and ${dataset}.csv: ${RESEARCH_DATASET_COLUMNS[
      dataset
    ].join(", ")}`,
).join("\n")}

Model notes:
- A release event is an observed channel appearance. It is not proof of a
  distinct binary.
- A build exists only when a build number has been verified.
- Multiple events can refer to the same build.
- provenance_status communicates whether a record is a legacy import,
  audit-verified, source-linked, or editorially verified.
- citation exports contain source metadata and locators, never mirrored
  publisher copy or private editorial notes.

The versioned bulk files are the supported public data interface. The site's
search-index endpoint is an internal implementation detail and is not a
supported API.
`;
}
