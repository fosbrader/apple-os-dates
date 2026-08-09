export const RESEARCH_EXPORT_VERSION = "1.0.0";
export const RESEARCH_EXPORT_LICENSE = "CC0-1.0";
export const RESEARCH_EXPORT_LICENSE_URL =
  "https://creativecommons.org/publicdomain/zero/1.0/";
export const RESEARCH_EXPORT_LICENSE_SCOPE =
  "CC0 applies to the factual structured fields in this export. Original editorial prose, design, media, and third-party material are excluded.";

export const RESEARCH_DATASET_NAMES = [
  "releases",
  "events",
  "builds",
  "changes",
  "occurrences",
  "citations",
  "provenance",
] as const;

export type ResearchDatasetName =
  (typeof RESEARCH_DATASET_NAMES)[number];

export type PublicResearchValue =
  | string
  | number
  | boolean
  | null
  | string[];

export type PublicResearchRow = Record<
  string,
  PublicResearchValue
>;

export interface PublicReleaseRow extends PublicResearchRow {
  id: string;
  vendor: string;
  platform: string;
  family: string;
  version: string;
  status: string;
  public_release_date: string | null;
  note: string | null;
  release_notes_url: string | null;
  provenance_status: string;
  updated_at: string | null;
}

export interface PublicEventRow extends PublicResearchRow {
  id: string;
  vendor: string;
  platform: string;
  family: string;
  version_id: string;
  version: string;
  label: string;
  route_alias: string;
  channel: string;
  appearance_date: string;
  version_label_at_appearance: string | null;
  availability_state: string;
  build_id: string | null;
  build_number: string | null;
  is_revision: boolean;
  audience: string[];
  device_scope: string[];
  region_scope: string[];
  language_scope: string[];
  note: string | null;
  provenance_status: string;
  index_eligible: boolean;
  source_count: number;
  updated_at: string | null;
}

export interface PublicBuildRow extends PublicResearchRow {
  id: string;
  vendor: string;
  platform: string;
  family: string;
  version_id: string;
  version: string;
  build_number: string;
  display_build_number: string;
  canonical_slug: string;
  status: string;
  device_scope: string[];
  provenance_status: string;
  index_eligible: boolean;
  updated_at: string | null;
}

export interface PublicChangeRow extends PublicResearchRow {
  id: string;
  title: string;
  category: string;
  summary: string | null;
  updated_at: string | null;
}

export interface PublicOccurrenceRow extends PublicResearchRow {
  id: string;
  change_id: string;
  change_title: string;
  action: string;
  inheritance: string;
  summary: string | null;
  target_kind: string;
  target_id: string;
  vendor: string;
  platform: string;
  family: string;
  version: string;
  build_number: string | null;
  documented_status: string;
  evidence_state: string;
  verification_method: string | null;
  applicability: string[];
  public_contributor_credit: string | null;
  source_count: number;
  updated_at: string | null;
}

export interface PublicCitationRow extends PublicResearchRow {
  id: string;
  target_kind: string;
  target_id: string;
  source_id: string | null;
  source_url: string;
  source_title: string | null;
  publisher: string | null;
  author: string | null;
  publication_date: string | null;
  accessed_date: string | null;
  archive_url: string | null;
  source_class: string | null;
  locator: string | null;
}

export interface PublicProvenanceRow extends PublicResearchRow {
  id: string;
  record_type: string;
  title: string;
  status: string;
  verification_date: string | null;
  methodology: string | null;
  scope: string[];
  snapshot_identity: string | null;
  affected_target_ids: string[];
  reason_category: string | null;
  reason: string | null;
  published_at: string | null;
}

export interface PublicResearchDatasets {
  releases: PublicReleaseRow[];
  events: PublicEventRow[];
  builds: PublicBuildRow[];
  changes: PublicChangeRow[];
  occurrences: PublicOccurrenceRow[];
  citations: PublicCitationRow[];
  provenance: PublicProvenanceRow[];
}

export type PublicResearchDataset =
  PublicResearchDatasets[ResearchDatasetName];

export interface ResearchExportEnvelope {
  schema_version: typeof RESEARCH_EXPORT_VERSION;
  dataset: ResearchDatasetName;
  generated_at: string;
  license: typeof RESEARCH_EXPORT_LICENSE;
  license_scope: string;
  record_count: number;
  records: PublicResearchRow[];
}

export type SearchDocumentKind =
  | "release"
  | "event"
  | "build"
  | "change";

/** The public-record collection behind a search document. */
export type SearchRecordDataset =
  | "releases"
  | "events"
  | "builds"
  | "occurrences";

export interface ResearchSearchDocument {
  id: string;
  kind: SearchDocumentKind;
  /** Exact record identifier for a follow-up public API request. */
  record_id: string;
  /** Collection that owns record_id in the public API. */
  api_dataset: SearchRecordDataset;
  title: string;
  href: string;
  text: string;
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
}

export interface ResearchSearchIndex {
  schema_version: typeof RESEARCH_EXPORT_VERSION;
  generated_at: string;
  documents: ResearchSearchDocument[];
}

export interface ResearchSearchFilters {
  kind?: SearchDocumentKind;
  vendor?: string;
  platform?: string;
  family?: string;
  version?: string;
  status?: string;
  channel?: string;
  change_type?: string;
  documented_status?: string;
  evidence_state?: string;
  publisher?: string;
}

export interface ResearchSearchResult {
  document: ResearchSearchDocument;
  score: number;
}
