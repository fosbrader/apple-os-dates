export interface Platform {
  _id: string;
  name: string;
  slug: { current: string };
  color: string;
  sortOrder: number;
}

export interface ReleaseTrain {
  _id: string;
  platform: Platform;
  majorVersion: number;
  displayName: string;
  releaseYear: number;
}

export interface BetaMilestone {
  _key: string;
  label: string;
  date: string;
  note?: string;
  build?: string;
  channel?: string;
  deviceScope?: string;
  sourceUrl?: string;
  sourceLabel?: string;
  isRevision: boolean;
}

export type ReleaseStatus = "active" | "released" | "superseded";
export type ProvenanceStatus =
  | "legacyImported"
  | "auditVerified"
  | "sourceLinked"
  | "editoriallyVerified";
export type EditorialReviewStatus =
  | "draft"
  | "needsEvidence"
  | "readyForReview"
  | "approved"
  | "rejected";
export type ReleaseEventChannel =
  | "developer"
  | "publicBeta"
  | "releaseCandidate"
  | "gm"
  | "public"
  | "securityResponse"
  | "recovery"
  | "other";
export type ReleaseEventAvailability =
  | "available"
  | "withdrawn"
  | "replaced"
  | "superseded";
export type ChangeAction =
  | "introduced"
  | "changed"
  | "fixed"
  | "removed"
  | "regression"
  | "knownIssue";
export type EvidenceState = "reported" | "corroborated" | "confirmed";
export type DocumentationStatus = "documented" | "undocumented";
export type DetailedDocumentationStatus =
  | DocumentationStatus
  | "partiallyDocumented"
  | "unknown";

export interface SlugValue {
  current: string;
}

export interface SourceRecord {
  _id: string;
  title: string;
  canonicalUrl: string;
  publisher?: string;
  author?: string;
  publishedAt?: string;
  accessedAt?: string;
  archiveUrl?: string;
  sourceClass?: string;
}

export interface CitationRecord {
  _key?: string;
  source: SourceRecord;
  locator?: string;
  context?: string;
  quotedText?: string;
}

export interface PortableTextSpan {
  _key: string;
  _type: "span";
  text: string;
  marks?: string[];
}

export interface PortableTextMarkDefinition {
  _key: string;
  _type: string;
  source?: SourceRecord;
  locator?: string;
  context?: string;
  href?: string;
}

export interface PortableTextBlock {
  _key: string;
  _type: string;
  style?: string;
  level?: number;
  listItem?: "bullet" | "number";
  children?: PortableTextSpan[];
  markDefs?: PortableTextMarkDefinition[];
  asset?: {
    url?: string;
    metadata?: {
      dimensions?: {
        width?: number;
        height?: number;
        aspectRatio?: number;
      };
    };
  };
  alt?: string;
  caption?: string;
  rightsBasis?: string;
  rightsHolder?: string;
  sourceCitation?: CitationRecord;
}

export interface EditorialReview {
  status?: EditorialReviewStatus;
  reviewedAt?: string;
  notes?: string;
}

export interface SeoMetadata {
  title?: string;
  description?: string;
  noIndex?: boolean;
}

export interface AuditBatchSummary {
  _id: string;
  title: string;
  verifiedAt?: string;
  scopeSummary?: string;
}

export interface ReleaseLifecycle {
  releaseStatus?: ReleaseStatus;
  publicReleaseDate?: string;
}

/**
 * Older Sanity documents predate the explicit lifecycle field. Preserve their
 * historical behavior while allowing never-shipped cycles to opt out of both
 * the active and released states.
 */
export function getReleaseStatus(
  release: ReleaseLifecycle,
): ReleaseStatus {
  if (release.releaseStatus) return release.releaseStatus;
  return release.publicReleaseDate ? "released" : "active";
}

export function isActiveRelease(release: ReleaseLifecycle): boolean {
  return getReleaseStatus(release) === "active";
}

export function isReleasedRelease(release: ReleaseLifecycle): boolean {
  return getReleaseStatus(release) === "released";
}

export function isSupersededRelease(release: ReleaseLifecycle): boolean {
  return getReleaseStatus(release) === "superseded";
}

export interface ReleaseVersion {
  _id: string;
  updatedAt?: string;
  releaseTrain: ReleaseTrain;
  version: string;
  releaseNotesUrl?: string;
  keyFeatures?: {
    title: string;
    description?: string;
    category?: string;
  }[];
  releaseStatus?: ReleaseStatus;
  overview?: PortableTextBlock[];
  citations?: CitationRecord[];
  provenanceStatus?: ProvenanceStatus;
  auditBatches?: AuditBatchSummary[];
  editorialReview?: EditorialReview;
  publicReleaseDate?: string;
  versionNote?: string;
  milestones: BetaMilestone[];
  legacyMilestones?: BetaMilestone[];
}

export interface ReleaseVersionSummary {
  _id: string;
  updatedAt?: string;
  version: string;
  releaseStatus?: ReleaseStatus;
  provenanceStatus?: ProvenanceStatus;
  publicReleaseDate?: string;
  versionNote?: string;
  milestones?: BetaMilestone[];
  milestoneCount: number;
  firstBetaDate?: string;
  lastMilestoneDate?: string;
  releaseTrain: {
    _id: string;
    displayName: string;
    majorVersion: number;
    platform: Platform;
  };
}

export interface ReleaseVersionRoute {
  platform: string;
  version: string;
  updatedAt?: string;
}

export interface ReleaseBuildSummary {
  _id: string;
  buildNumber: string;
  slug?: SlugValue;
  displayBuildNumber?: string;
  availabilityState?: ReleaseEventAvailability;
  provenanceStatus?: ProvenanceStatus;
  editorialReview?: EditorialReview;
  indexEligible?: boolean;
}

export interface ReleaseEvent {
  _id: string;
  updatedAt?: string;
  slug?: SlugValue;
  label: string;
  normalizedChannel: ReleaseEventChannel;
  date: string;
  versionLabelAtAppearance?: string;
  sequence?: number;
  availabilityState?: ReleaseEventAvailability;
  note?: string;
  summary?: string;
  deviceScope?: string[];
  platformScope?: string[];
  regionScope?: string[];
  languageScope?: string[];
  audienceScope?: string[];
  isRevision?: boolean;
  closesReleaseCycle?: boolean;
  legacySourceId?: string;
  legacyNote?: string;
  provenanceStatus?: ProvenanceStatus;
  editorialReview?: EditorialReview;
  citations?: CitationRecord[];
  auditBatch?: AuditBatchSummary;
  auditBatches?: AuditBatchSummary[];
  articleBody?: PortableTextBlock[];
  changes?: ChangeOccurrence[];
  isIndexable?: boolean;
  seo?: SeoMetadata;
  build?: ReleaseBuildSummary;
  relatedEvents?: Array<{
    _id: string;
    label: string;
    date: string;
  }>;
}

export interface ReleaseChangeSummary {
  _id: string;
  title: string;
  slug?: SlugValue;
  category?: string;
  summary?: string;
}

export interface ChangeOccurrence {
  _key: string;
  change: ReleaseChangeSummary;
  action: ChangeAction;
  inheritance?: "delta" | "inherited" | "cumulative";
  summary?: string;
  documentedStatus: DetailedDocumentationStatus;
  evidenceState: EvidenceState;
  verificationMethod?: string;
  applicability?: string[];
  citations?: CitationRecord[];
  publicContributorCredit?: string;
  targetEvent?: {
    _id: string;
    label: string;
    date: string;
    slug?: SlugValue;
  };
  targetBuild?: ReleaseBuildSummary;
}

export interface ReleaseBuild extends ReleaseBuildSummary {
  releaseVersion: {
    _id: string;
    version: string;
    releaseStatus?: ReleaseStatus;
    releaseTrain: ReleaseTrain;
  };
  platform: Platform;
  articleBody?: PortableTextBlock[];
  summary?: string;
  availabilityState?: ReleaseEventAvailability;
  deviceScope?: string[];
  regionScope?: string[];
  languageScope?: string[];
  audienceScope?: string[];
  events: ReleaseEvent[];
  changes?: ChangeOccurrence[];
  citations?: CitationRecord[];
  auditBatches?: AuditBatchSummary[];
  seo?: SeoMetadata;
  updatedAt?: string;
}

export interface ReleaseFamily {
  platform: Platform;
  majorVersion: number;
  releaseYear?: number;
  versions: ReleaseVersionSummary[];
}

export interface ReleaseBuildRoute {
  platform: string;
  version: string;
  build: string;
  updatedAt?: string;
  indexEligible?: boolean;
}

export interface ReleaseEventRoute {
  platform: string;
  version: string;
  event: string;
  build?: string;
  updatedAt?: string;
  indexEligible?: boolean;
}

export interface CorrectionClaim {
  _key: string;
  claim: string;
  previousValue?: string;
  correctedValue: string;
  resolution: string;
  affectedDocument?: {
    _id: string;
    _type: string;
    title?: string;
    version?: string;
    label?: string;
    buildNumber?: string;
  };
  citations?: CitationRecord[];
}

export interface PublishedCorrection {
  _id: string;
  updatedAt?: string;
  title: string;
  slug: SlugValue;
  correctionDate: string;
  reasonCategory: string;
  publicSummary: string;
  publishedAt?: string;
  affectedClaims: CorrectionClaim[];
  citations?: CitationRecord[];
}

export interface SitePageRecord {
  _id: string;
  title: string;
  slug: SlugValue;
  pageKind: string;
  summary: string;
  body: PortableTextBlock[];
  citations?: CitationRecord[];
  effectiveDate?: string;
  editorialReview?: EditorialReview;
}

export interface HistoricalContext {
  samePlatformVersions: ReleaseVersion[];
  samePositionVersions: ReleaseVersion[];
}
