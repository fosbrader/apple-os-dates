import { RESEARCH_DATASET_COLUMNS } from "@/lib/research/serialize";
import type { ResearchDatasetName } from "@/lib/research/types";

export type PublicApiFieldType = "string" | "integer" | "boolean" | "array";

export interface PublicApiFieldDefinition {
  name: string;
  type: PublicApiFieldType;
  nullable: boolean;
  format?: "date" | "date-time" | "uri";
  description: string;
}

const arrayFields = new Set([
  "audience",
  "device_scope",
  "region_scope",
  "language_scope",
  "applicability",
  "scope",
  "affected_target_ids",
]);

const booleanFields = new Set(["is_revision", "index_eligible"]);
const numberFields = new Set(["source_count"]);
const dateFields = new Set([
  "public_release_date",
  "appearance_date",
  "publication_date",
  "accessed_date",
  "verification_date",
]);
const dateTimeFields = new Set(["updated_at", "published_at"]);
const uriFields = new Set([
  "release_notes_url",
  "source_url",
  "archive_url",
]);

const requiredStringFields: Record<ResearchDatasetName, ReadonlySet<string>> = {
  releases: new Set([
    "id",
    "vendor",
    "platform",
    "family",
    "version",
    "status",
    "provenance_status",
  ]),
  events: new Set([
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
    "availability_state",
    "provenance_status",
  ]),
  builds: new Set([
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
    "provenance_status",
  ]),
  changes: new Set(["id", "title", "category"]),
  occurrences: new Set([
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
    "documented_status",
    "evidence_state",
  ]),
  citations: new Set(["id", "target_kind", "target_id", "source_url"]),
  provenance: new Set(["id", "record_type", "title", "status"]),
};

const descriptions: Record<string, string> = {
  id: "Stable public identifier for this record.",
  vendor: "Software vendor that owns the release record.",
  platform: "Platform identifier, such as ios or macos.",
  family: "Major release family identifier.",
  version: "Version number as recorded by the archive.",
  status: "Current release or publication status.",
  public_release_date: "Date the public software release became available.",
  release_notes_url: "First-party release notes URL when available.",
  provenance_status: "Evidence-review state for the record.",
  updated_at: "UTC time when this record was last updated.",
  version_id: "Public identifier of the related release record.",
  label: "Human-readable event label.",
  route_alias: "Stable route label used by the public site.",
  channel: "Release channel, such as developer_beta or public.",
  appearance_date: "Date the release event appeared in its channel.",
  version_label_at_appearance: "Version label shown when the event appeared.",
  availability_state: "Availability state recorded for the event.",
  build_id: "Public identifier of the related verified build, if known.",
  build_number: "Build number associated with this record, if known.",
  is_revision: "True when this event revises an earlier build appearance.",
  audience: "Named audiences that could receive the event.",
  device_scope: "Devices included in the recorded scope.",
  region_scope: "Regions included in the recorded scope.",
  language_scope: "Languages included in the recorded scope.",
  index_eligible: "True when the record meets the public indexing gate.",
  source_count: "Number of linked public source records.",
  display_build_number: "Build number formatted for display.",
  canonical_slug: "Stable URL slug for the verified build.",
  title: "Human-readable title for the record.",
  category: "Change category.",
  change_id: "Public identifier of the related change definition.",
  change_title: "Title of the related change definition.",
  action: "How the change occurred, such as introduced or removed.",
  inheritance: "How the occurrence inherits release context.",
  target_kind: "Type of record cited or changed.",
  target_id: "Public identifier of the cited or changed target.",
  documented_status: "Documentation state for the change occurrence.",
  evidence_state: "Evidence state for the change occurrence.",
  applicability: "Contexts in which the change applies.",
  source_id: "Public identifier of the related source record.",
  source_url: "Canonical public URL of the source.",
  source_title: "Title of the cited source.",
  publisher: "Publisher of the cited source.",
  author: "Named author of the cited source, if available.",
  publication_date: "Date the cited source was published.",
  accessed_date: "Date Version Record last accessed the source.",
  archive_url: "Archived source URL, if available.",
  source_class: "Source classification, such as first_party.",
  locator: "Location within the source that supports the record.",
  record_type: "Type of provenance record, such as audit_batch.",
  verification_date: "Date an audit or correction was verified.",
  scope: "Platforms or records covered by this provenance record.",
  snapshot_identity: "Identity of the reviewed source snapshot.",
  affected_target_ids: "Public IDs affected by this provenance record.",
  reason_category: "Reason category for a correction, if applicable.",
  published_at: "UTC time the provenance record was published.",
};

function typeForField(name: string): PublicApiFieldType {
  if (arrayFields.has(name)) return "array";
  if (booleanFields.has(name)) return "boolean";
  if (numberFields.has(name)) return "integer";
  return "string";
}

function formatForField(
  name: string,
): PublicApiFieldDefinition["format"] | undefined {
  if (dateFields.has(name)) return "date";
  if (dateTimeFields.has(name)) return "date-time";
  if (uriFields.has(name)) return "uri";
  return undefined;
}

export function publicApiFieldDefinition(
  dataset: ResearchDatasetName,
  name: string,
): PublicApiFieldDefinition {
  const type = typeForField(name);
  const nullable =
    type === "string" && !requiredStringFields[dataset].has(name);

  return {
    name,
    type,
    nullable,
    ...(formatForField(name) ? { format: formatForField(name) } : {}),
    description: descriptions[name] || `Public ${name.replaceAll("_", " ")} value.`,
  };
}

export function publicApiDatasetFields(
  dataset: ResearchDatasetName,
): PublicApiFieldDefinition[] {
  return RESEARCH_DATASET_COLUMNS[dataset].map((field) =>
    publicApiFieldDefinition(dataset, field),
  );
}
