import { createHash } from "node:crypto";
import {
  assertValidReleaseEventMigration,
  assertValidSchemaReadyMigration,
  buildReleaseEventMigrationPlan,
  extractLegacyReleaseVersions,
  projectSchemaReadyMigration,
  stableStringify,
  type LegacyReleaseVersion,
  type ReleaseEventMigrationPlan,
  type SanityReference,
  type SchemaReadyReleaseBuild,
  type SchemaReadyReleaseEvent,
} from "./release-event-migration";

export const LAUNCH_CONTENT_PROJECT_ID = "lh3yswzu";
export const LAUNCH_CONTENT_DATASET = "production";
export const LAUNCH_CONTENT_FORMAT_VERSION = 1;

const allowedSourceClasses = new Set([
  "firstPartyDocumentation",
  "firstPartyAnnouncement",
  "government",
  "journalism",
  "developerDocs",
  "community",
  "archive",
  "other",
]);
const allowedReviewStatuses = new Set([
  "draft",
  "needsEvidence",
  "readyForReview",
  "approved",
  "rejected",
]);
const allowedProvenanceStatuses = new Set([
  "legacyImported",
  "auditVerified",
  "sourceLinked",
  "editoriallyVerified",
]);
const allowedEventChannels = new Set([
  "developerBeta",
  "publicBeta",
  "releaseCandidate",
  "goldenMaster",
  "public",
  "securityResponse",
  "recovery",
  "other",
]);
const allowedAvailabilityStates = new Set([
  "available",
  "withdrawn",
  "replaced",
  "superseded",
]);
const allowedChangeCategories = new Set([
  "feature",
  "enhancement",
  "behavior",
  "bugFix",
  "regression",
  "security",
  "developerApi",
  "compatibility",
  "removal",
  "knownIssue",
  "other",
]);
const allowedChangeActions = new Set([
  "introduced",
  "changed",
  "fixed",
  "removed",
  "regression",
  "knownIssue",
]);
const allowedInheritanceStates = new Set(["delta", "inherited", "cumulative"]);
const allowedDocumentationStates = new Set([
  "documented",
  "partiallyDocumented",
  "undocumented",
  "unknown",
]);
const allowedEvidenceStates = new Set([
  "reported",
  "corroborated",
  "confirmed",
]);
const forbiddenPublisherCopyKeys = new Set([
  "bodyHtml",
  "copiedText",
  "publisherProse",
  "publisherText",
  "quotedText",
  "rawHtml",
  "releaseNotesText",
  "upstreamBody",
  "verbatim",
]);

type UnknownRecord = Record<string, unknown>;

export type EditorialReviewStatus =
  | "draft"
  | "needsEvidence"
  | "readyForReview"
  | "approved"
  | "rejected";

export type ProvenanceStatus =
  | "legacyImported"
  | "auditVerified"
  | "sourceLinked"
  | "editoriallyVerified";

export interface EditorialReviewInput {
  status: EditorialReviewStatus;
  reviewedAt?: string;
}

export interface LaunchCitationInput {
  url: string;
  locator?: string;
  note?: string;
}

export interface OriginalArticleBlockInput {
  style?: "normal" | "h2" | "h3";
  /**
   * Concise form: applies citations to the complete paragraph.
   * Use spans when separate claims in one paragraph need different sources.
   */
  text?: string;
  citations?: LaunchCitationInput[];
  spans?: Array<{
    text: string;
    citations?: LaunchCitationInput[];
  }>;
}

export interface OriginalArticleInput {
  authorship: "originalSynthesis";
  blocks: OriginalArticleBlockInput[];
}

export interface LaunchSourceInput {
  url: string;
  /**
   * Optional machine-readable URL used while preparing the checked-in
   * manifest. It is validation provenance only and is never written to Sanity
   * or exposed as a public citation/archive URL.
   */
  transportUrl?: string;
  title: string;
  publisher: string;
  sourceClass:
    | "firstPartyDocumentation"
    | "firstPartyAnnouncement"
    | "government"
    | "journalism"
    | "developerDocs"
    | "community"
    | "archive"
    | "other";
  author?: string;
  publishedAt?: string;
  archiveUrl?: string;
  topics?: string[];
}

export interface LaunchVersionIdentityInput {
  releaseTrainId: string;
  platformId: string;
  version: string;
  releaseStatus: "released";
  publicReleaseDate: string;
}

export interface LaunchVersionContentInput {
  releaseVersionId: string;
  /**
   * Required only when the deterministic releaseVersion document may not
   * exist yet. If the document already exists, every identity field must
   * match exactly; identity fields are never patched.
   */
  identity?: LaunchVersionIdentityInput;
  authorship: "originalSynthesis";
  releaseNotesUrl?: string;
  overview?: OriginalArticleInput;
  citations?: LaunchCitationInput[];
  provenanceStatus?: ProvenanceStatus;
  editorialReview?: EditorialReviewInput;
}

export interface LaunchEventTarget {
  documentId?: string;
  legacySourceId?: string;
  stableEventId?: string;
  releaseVersionId?: string;
  routeAlias?: string;
}

export interface LaunchEventIdentityInput {
  releaseVersionId: string;
  platformId: string;
  stableEventId: string;
  label: string;
  routeAlias: string;
  channel:
    | "developerBeta"
    | "publicBeta"
    | "releaseCandidate"
    | "goldenMaster"
    | "public"
    | "securityResponse"
    | "recovery"
    | "other";
  appearanceDate: string;
  sequence?: number;
  isRevision?: boolean;
  availabilityState?: "available" | "withdrawn" | "replaced" | "superseded";
  closesReleaseCycle?: boolean;
}

export interface LaunchChangeOccurrenceInput {
  key: string;
  title: string;
  canonicalSummary: string;
  category:
    | "feature"
    | "enhancement"
    | "behavior"
    | "bugFix"
    | "regression"
    | "security"
    | "developerApi"
    | "compatibility"
    | "removal"
    | "knownIssue"
    | "other";
  action:
    | "introduced"
    | "changed"
    | "fixed"
    | "removed"
    | "regression"
    | "knownIssue";
  inheritance?: "delta" | "inherited" | "cumulative";
  summary: string;
  documentedStatus:
    | "documented"
    | "partiallyDocumented"
    | "undocumented"
    | "unknown";
  evidenceState: "reported" | "corroborated" | "confirmed";
  verificationMethod?: string;
  citations: LaunchCitationInput[];
}

export interface LaunchEventContentInput {
  target: LaunchEventTarget;
  identity?: LaunchEventIdentityInput;
  authorship: "originalSynthesis";
  summary?: string;
  article?: OriginalArticleInput;
  citations?: LaunchCitationInput[];
  changes?: LaunchChangeOccurrenceInput[];
  provenanceStatus?: ProvenanceStatus;
  editorialReview?: EditorialReviewInput;
  isIndexable?: boolean;
}

export interface LaunchBuildContentInput {
  releaseVersionId: string;
  platformId: string;
  buildNumber: string;
  eventTargets?: LaunchEventTarget[];
  authorship: "originalSynthesis";
  summary?: string;
  article?: OriginalArticleInput;
  citations: LaunchCitationInput[];
  changes?: LaunchChangeOccurrenceInput[];
  provenanceStatus?: ProvenanceStatus;
  editorialReview?: EditorialReviewInput;
  isIndexable?: boolean;
}

export interface LaunchContentBundle {
  formatVersion: 1;
  target: {
    projectId: string;
    dataset: string;
  };
  accessedAt: string;
  sources?: LaunchSourceInput[];
  versions?: LaunchVersionContentInput[];
  events?: LaunchEventContentInput[];
  builds?: LaunchBuildContentInput[];
}

export interface SanityDocument extends UnknownRecord {
  _id: string;
  _type: string;
  _rev?: string;
}

export interface LaunchCreateMutation {
  document: SanityDocument;
}

export interface LaunchPatchMutation {
  id: string;
  ifRevisionId: string;
  set: UnknownRecord;
}

export interface LaunchContentPlan {
  formatVersion: 1;
  projectId: string;
  dataset: string;
  sourceSnapshotDigest: string;
  contentDigest: string;
  migrationPlanDigest: string;
  planDigest: string;
  creates: LaunchCreateMutation[];
  patches: LaunchPatchMutation[];
  unchangedDocumentIds: string[];
  summary: {
    creates: number;
    patches: number;
    unchanged: number;
    sourceCreates: number;
    versionCreates: number;
    eventCreates: number;
    buildCreates: number;
    changeCreates: number;
    versionPatches: number;
  };
}

export interface LaunchRollbackSnapshot {
  artifactType: "sanity-launch-content-rollback";
  formatVersion: 1;
  projectId: string;
  dataset: string;
  planDigest: string;
  sourceSnapshotDigest: string;
  createdDocumentIds: string[];
  restoreDocuments: SanityDocument[];
  instructions: string[];
  rollbackDigest: string;
}

export interface LaunchContentPlanResult {
  plan: LaunchContentPlan;
  rollback: LaunchRollbackSnapshot;
  migrationPlan: ReleaseEventMigrationPlan;
}

interface WorkingDocument {
  id: string;
  type: string;
  existing?: SanityDocument;
  value: SanityDocument;
  touched: Set<string>;
}

interface SourceResolution {
  id: string;
  url: string;
  document: SanityDocument;
}

function isRecord(value: unknown): value is UnknownRecord {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function cloneJson<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

function sha256(value: string): string {
  return createHash("sha256").update(value).digest("hex");
}

function compactHash(value: string): string {
  return sha256(value).slice(0, 24);
}

function exactEqual(left: unknown, right: unknown): boolean {
  return stableStringify(left) === stableStringify(right);
}

function stringValue(value: unknown): string | undefined {
  return typeof value === "string" && value.trim() ? value.trim() : undefined;
}

function asArray(value: unknown): unknown[] {
  return Array.isArray(value) ? value : [];
}

function referenceId(value: unknown): string | undefined {
  return isRecord(value) ? stringValue(value._ref) : undefined;
}

function assertDocumentId(value: string, path: string): void {
  if (!/^[A-Za-z0-9._-]+$/.test(value)) {
    throw new Error(`${path} must be a valid Sanity document ID.`);
  }
}

function isIsoDate(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(`${value}T00:00:00.000Z`);
  return (
    Number.isFinite(date.getTime()) && date.toISOString().slice(0, 10) === value
  );
}

function isReleaseVersion(value: string): boolean {
  return /^\d+\.\d+(?:\.\d+)?[a-z]?$/i.test(value);
}

function isIsoDateTime(value: string): boolean {
  const date = new Date(value);
  return Number.isFinite(date.getTime()) && value.includes("T");
}

function normalizeSourceUrl(value: string, path = "source URL"): string {
  let url: URL;
  try {
    url = new URL(value);
  } catch {
    throw new Error(`${path} is not a valid URL.`);
  }
  if (url.protocol !== "https:") {
    throw new Error(`${path} must use HTTPS.`);
  }
  url.hash = "";
  return url.toString();
}

function sourceDocumentId(url: string): string {
  return `source-${compactHash(normalizeSourceUrl(url))}`;
}

function eventDocumentId(stableEventId: string): string {
  return `release-event-${compactHash(stableEventId)}`;
}

function normalizedBuildNumber(value: string): string {
  const normalized = value.trim().toUpperCase();
  if (!/^\d+[A-Z]\d+[A-Z]?$/.test(normalized)) {
    throw new Error(`Build number ${value} is not a valid Apple build number.`);
  }
  return normalized;
}

function buildDocumentId(
  releaseVersionId: string,
  buildNumber: string,
): string {
  return `release-build-${compactHash(
    `${releaseVersionId}\0${normalizedBuildNumber(buildNumber)}`,
  )}`;
}

function changeDocumentId(key: string): string {
  const normalized = key.trim().toLowerCase();
  if (!/^[a-z0-9]+(?:[._-][a-z0-9]+)*$/.test(normalized)) {
    throw new Error(
      `Change key ${key} must use lowercase letters, numbers, dots, dashes, or underscores.`,
    );
  }
  return `release-change-${compactHash(normalized)}`;
}

function slugify(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function sanityReference(id: string): SanityReference {
  return { _type: "reference", _ref: id };
}

function extractSnapshotDocuments(input: unknown): SanityDocument[] {
  const documents = Array.isArray(input)
    ? input
    : isRecord(input) && Array.isArray(input.documents)
      ? input.documents
      : isRecord(input) && Array.isArray(input.result)
        ? input.result
        : undefined;
  if (!documents) {
    throw new Error(
      "The Sanity snapshot must be an array or an object with documents/result.",
    );
  }

  const result = documents.map((document, index) => {
    if (
      !isRecord(document) ||
      !stringValue(document._id) ||
      !stringValue(document._type)
    ) {
      throw new Error(`Snapshot document ${index} is missing _id or _type.`);
    }
    if (String(document._id).startsWith("drafts.")) {
      throw new Error(
        `Snapshot contains draft ${document._id}; export the published perspective only.`,
      );
    }
    return cloneJson(document) as SanityDocument;
  });

  const ids = new Set<string>();
  for (const document of result) {
    if (ids.has(document._id)) {
      throw new Error(`Snapshot repeats document ${document._id}.`);
    }
    ids.add(document._id);
  }
  return result.sort((left, right) => left._id.localeCompare(right._id));
}

function rejectPublisherCopyFields(value: unknown, path = "content"): void {
  if (Array.isArray(value)) {
    value.forEach((item, index) =>
      rejectPublisherCopyFields(item, `${path}[${index}]`),
    );
    return;
  }
  if (!isRecord(value)) return;

  for (const [key, item] of Object.entries(value)) {
    if (forbiddenPublisherCopyKeys.has(key)) {
      throw new Error(
        `${path}.${key} is forbidden. This pipeline accepts original synthesis and citations, never copied publisher prose.`,
      );
    }
    rejectPublisherCopyFields(item, `${path}.${key}`);
  }
}

export function assertLaunchTarget(target: {
  projectId?: string;
  dataset?: string;
}): void {
  if (
    target.projectId !== LAUNCH_CONTENT_PROJECT_ID ||
    target.dataset !== LAUNCH_CONTENT_DATASET
  ) {
    throw new Error(
      `Launch ingestion is restricted to ${LAUNCH_CONTENT_PROJECT_ID}/${LAUNCH_CONTENT_DATASET}; received ${target.projectId || "missing"}/${target.dataset || "missing"}.`,
    );
  }
}

function validateCitationInput(
  citation: LaunchCitationInput,
  path: string,
): void {
  normalizeSourceUrl(citation.url, `${path}.url`);
  if ((citation.locator?.length || 0) > 240) {
    throw new Error(`${path}.locator exceeds 240 characters.`);
  }
  if ((citation.note?.length || 0) > 500) {
    throw new Error(`${path}.note exceeds 500 characters.`);
  }
}

function validateReview(
  review: EditorialReviewInput | undefined,
  path: string,
): void {
  if (!review) return;
  if (!allowedReviewStatuses.has(review.status)) {
    throw new Error(`${path}.status is not supported.`);
  }
  if (
    ["approved", "rejected"].includes(review.status) &&
    (!review.reviewedAt || !isIsoDateTime(review.reviewedAt))
  ) {
    throw new Error(
      `${path}.reviewedAt must be an ISO datetime for ${review.status} content.`,
    );
  }
}

function validateArticle(
  article: OriginalArticleInput | undefined,
  path: string,
): void {
  if (!article) return;
  if (article.authorship !== "originalSynthesis") {
    throw new Error(
      `${path}.authorship must explicitly attest originalSynthesis.`,
    );
  }
  if (!Array.isArray(article.blocks) || article.blocks.length === 0) {
    throw new Error(`${path}.blocks must contain original editorial prose.`);
  }
  article.blocks.forEach((block, index) => {
    const blockPath = `${path}.blocks[${index}]`;
    const style = block.style || "normal";
    if (!["normal", "h2", "h3"].includes(style)) {
      throw new Error(
        `${blockPath}.style must be normal, h2, or h3; publisher blockquotes are not accepted.`,
      );
    }
    const hasText = Boolean(block.text?.trim());
    const hasSpans = Boolean(block.spans?.length);
    if (hasText === hasSpans) {
      throw new Error(
        `${blockPath} must provide either text or spans, but not both.`,
      );
    }
    const textLength = hasText
      ? block.text!.length
      : (block.spans || []).reduce(
          (sum, span) => sum + (span.text?.length || 0),
          0,
        );
    if (textLength > 10_000) {
      throw new Error(`${blockPath} exceeds 10,000 characters.`);
    }
    const citations = [
      ...(block.citations || []),
      ...(block.spans || []).flatMap((span) => span.citations || []),
    ];
    citations.forEach((citation, citationIndex) =>
      validateCitationInput(
        citation,
        `${blockPath}.citations[${citationIndex}]`,
      ),
    );
    for (const [spanIndex, span] of (block.spans || []).entries()) {
      if (!span.text?.trim()) {
        throw new Error(`${blockPath}.spans[${spanIndex}].text is required.`);
      }
    }
    if (style === "normal" && citations.length === 0) {
      throw new Error(
        `${blockPath} needs at least one citation. Every factual prose block in a launch manifest must be source-backed.`,
      );
    }
  });
}

function validateChange(
  change: LaunchChangeOccurrenceInput,
  path: string,
): void {
  changeDocumentId(change.key);
  if (change.title.trim().length < 3 || change.title.trim().length > 180) {
    throw new Error(`${path}.title must be 3–180 characters.`);
  }
  if (
    change.canonicalSummary.trim().length < 20 ||
    change.canonicalSummary.trim().length > 2_500
  ) {
    throw new Error(
      `${path}.canonicalSummary must be 20–2,500 characters of original synthesis.`,
    );
  }
  if (
    change.summary.trim().length < 20 ||
    change.summary.trim().length > 3_000
  ) {
    throw new Error(
      `${path}.summary must be 20–3,000 characters of original synthesis.`,
    );
  }
  if (!allowedChangeCategories.has(change.category)) {
    throw new Error(`${path}.category is not supported.`);
  }
  if (!allowedChangeActions.has(change.action)) {
    throw new Error(`${path}.action is not supported.`);
  }
  if (!allowedInheritanceStates.has(change.inheritance || "delta")) {
    throw new Error(`${path}.inheritance is not supported.`);
  }
  if (!allowedDocumentationStates.has(change.documentedStatus)) {
    throw new Error(`${path}.documentedStatus is not supported.`);
  }
  if (!allowedEvidenceStates.has(change.evidenceState)) {
    throw new Error(`${path}.evidenceState is not supported.`);
  }
  if ((change.verificationMethod?.length || 0) > 1_500) {
    throw new Error(`${path}.verificationMethod exceeds 1,500 characters.`);
  }
  if (!change.citations?.length) {
    throw new Error(`${path}.citations must contain at least one source.`);
  }
  change.citations.forEach((citation, index) =>
    validateCitationInput(citation, `${path}.citations[${index}]`),
  );
  const distinctSources = new Set(
    change.citations.map((citation) => normalizeSourceUrl(citation.url)),
  );
  if (
    change.evidenceState === "corroborated" &&
    distinctSources.size < 2 &&
    !change.verificationMethod?.trim()
  ) {
    throw new Error(
      `${path} is corroborated but has neither two independent sources nor a verificationMethod.`,
    );
  }
}

function validateEventTarget(target: LaunchEventTarget, path: string): void {
  const directValues = [
    stringValue(target.documentId),
    stringValue(target.legacySourceId),
    stringValue(target.stableEventId),
  ].filter(Boolean);
  const hasRouteReleaseVersion = Boolean(stringValue(target.releaseVersionId));
  const hasRouteAlias = Boolean(stringValue(target.routeAlias));
  if (hasRouteReleaseVersion !== hasRouteAlias) {
    throw new Error(
      `${path}.releaseVersionId and ${path}.routeAlias must be provided together.`,
    );
  }
  const selectorCount = directValues.length + (hasRouteReleaseVersion ? 1 : 0);
  if (selectorCount !== 1) {
    throw new Error(
      `${path} must select exactly one of documentId, legacySourceId, stableEventId, or releaseVersionId plus routeAlias.`,
    );
  }
  if (target.documentId) {
    assertDocumentId(target.documentId, `${path}.documentId`);
  }
  if (target.releaseVersionId) {
    assertDocumentId(target.releaseVersionId, `${path}.releaseVersionId`);
  }
  if (
    target.routeAlias &&
    (slugify(target.routeAlias) !== target.routeAlias ||
      target.routeAlias.length > 96)
  ) {
    throw new Error(
      `${path}.routeAlias must be a lowercase, hyphenated route segment.`,
    );
  }
}

function validateEventIdentity(
  identity: LaunchEventIdentityInput | undefined,
  path: string,
): void {
  if (!identity) return;
  assertDocumentId(identity.releaseVersionId, `${path}.releaseVersionId`);
  assertDocumentId(identity.platformId, `${path}.platformId`);
  if (!/^[A-Za-z0-9._:-]{12,220}$/.test(identity.stableEventId)) {
    throw new Error(`${path}.stableEventId is invalid.`);
  }
  if (identity.label.trim().length < 2 || identity.label.trim().length > 100) {
    throw new Error(`${path}.label must be 2–100 characters.`);
  }
  if (
    slugify(identity.routeAlias) !== identity.routeAlias ||
    identity.routeAlias.length > 96
  ) {
    throw new Error(
      `${path}.routeAlias must be a lowercase, hyphenated route segment.`,
    );
  }
  if (!allowedEventChannels.has(identity.channel)) {
    throw new Error(`${path}.channel is not supported.`);
  }
  if (!isIsoDate(identity.appearanceDate)) {
    throw new Error(`${path}.appearanceDate is not a valid ISO date.`);
  }
  if (
    identity.sequence !== undefined &&
    (!Number.isInteger(identity.sequence) || identity.sequence <= 0)
  ) {
    throw new Error(`${path}.sequence must be a positive integer.`);
  }
  if (
    !allowedAvailabilityStates.has(identity.availabilityState || "available")
  ) {
    throw new Error(`${path}.availabilityState is not supported.`);
  }
  if (
    identity.closesReleaseCycle &&
    !["public", "goldenMaster"].includes(identity.channel)
  ) {
    throw new Error(
      `${path} can close a cycle only for Public or Golden Master.`,
    );
  }
}

function validateVersionIdentity(
  identity: LaunchVersionIdentityInput | undefined,
  path: string,
): void {
  if (!identity) return;
  const releaseTrainId = stringValue(identity.releaseTrainId);
  if (!releaseTrainId || releaseTrainId !== identity.releaseTrainId) {
    throw new Error(`${path}.releaseTrainId is required.`);
  }
  assertDocumentId(releaseTrainId, `${path}.releaseTrainId`);
  const platformId = stringValue(identity.platformId);
  if (!platformId || platformId !== identity.platformId) {
    throw new Error(`${path}.platformId is required.`);
  }
  assertDocumentId(platformId, `${path}.platformId`);
  const version = stringValue(identity.version);
  if (!version || version !== identity.version || !isReleaseVersion(version)) {
    throw new Error(
      `${path}.version must be a dotted release version such as 18.4 or 18.4.1.`,
    );
  }
  if (identity.releaseStatus !== "released") {
    throw new Error(`${path}.releaseStatus must be released.`);
  }
  if (!isIsoDate(identity.publicReleaseDate)) {
    throw new Error(`${path}.publicReleaseDate is not a valid ISO date.`);
  }
}

export function assertLaunchContentBundle(bundle: LaunchContentBundle): void {
  if (!isRecord(bundle)) {
    throw new Error("Launch content must be a JSON object.");
  }
  if (bundle.formatVersion !== LAUNCH_CONTENT_FORMAT_VERSION) {
    throw new Error(
      `Launch content formatVersion must be ${LAUNCH_CONTENT_FORMAT_VERSION}.`,
    );
  }
  assertLaunchTarget(bundle.target || {});
  if (!isIsoDate(bundle.accessedAt)) {
    throw new Error("Launch content accessedAt must be a valid ISO date.");
  }
  rejectPublisherCopyFields(bundle);

  const sourceUrls = new Set<string>();
  for (const [index, source] of (bundle.sources || []).entries()) {
    const path = `sources[${index}]`;
    const url = normalizeSourceUrl(source.url, `${path}.url`);
    if (sourceUrls.has(url)) {
      throw new Error(`${path}.url repeats ${url}.`);
    }
    sourceUrls.add(url);
    if (/\/tutorials\/data\/.*\.json(?:$|\?)/i.test(url)) {
      throw new Error(
        `${path}.url must be the human-readable documentation page, not an Apple DocC transport JSON URL.`,
      );
    }
    if (source.transportUrl) {
      const transportUrl = normalizeSourceUrl(
        source.transportUrl,
        `${path}.transportUrl`,
      );
      if (
        !/developer\.apple\.com\/tutorials\/data\/.*\.json(?:$|\?)/i.test(
          transportUrl,
        )
      ) {
        throw new Error(
          `${path}.transportUrl must be an Apple DocC /tutorials/data/*.json URL when present.`,
        );
      }
    }
    if (!source.title?.trim() || source.title.length > 300) {
      throw new Error(
        `${path}.title is required and limited to 300 characters.`,
      );
    }
    if (!source.publisher?.trim() || source.publisher.length > 200) {
      throw new Error(
        `${path}.publisher is required and limited to 200 characters.`,
      );
    }
    if (!allowedSourceClasses.has(source.sourceClass)) {
      throw new Error(`${path}.sourceClass is not supported.`);
    }
    if (source.publishedAt && !isIsoDateTime(source.publishedAt)) {
      throw new Error(`${path}.publishedAt must be an ISO datetime.`);
    }
    if (source.archiveUrl) {
      const archiveUrl = normalizeSourceUrl(
        source.archiveUrl,
        `${path}.archiveUrl`,
      );
      if (/\/tutorials\/data\/.*\.json(?:$|\?)/i.test(archiveUrl)) {
        throw new Error(
          `${path}.archiveUrl cannot expose an Apple DocC transport JSON URL.`,
        );
      }
    }
  }

  const releaseVersionIds = new Set<string>();
  for (const [index, version] of (bundle.versions || []).entries()) {
    const path = `versions[${index}]`;
    assertDocumentId(version.releaseVersionId, `${path}.releaseVersionId`);
    if (releaseVersionIds.has(version.releaseVersionId)) {
      throw new Error(
        `${path}.releaseVersionId repeats ${version.releaseVersionId}.`,
      );
    }
    releaseVersionIds.add(version.releaseVersionId);
    validateVersionIdentity(version.identity, `${path}.identity`);
    if (version.authorship !== "originalSynthesis") {
      throw new Error(
        `${path}.authorship must explicitly attest originalSynthesis.`,
      );
    }
    if (version.releaseNotesUrl) {
      const releaseNotesUrl = normalizeSourceUrl(
        version.releaseNotesUrl,
        `${path}.releaseNotesUrl`,
      );
      if (/\/tutorials\/data\/.*\.json(?:$|\?)/i.test(releaseNotesUrl)) {
        throw new Error(
          `${path}.releaseNotesUrl must be a human-readable page, not a DocC transport JSON URL.`,
        );
      }
    }
    validateArticle(version.overview, `${path}.overview`);
    (version.citations || []).forEach((citation, citationIndex) =>
      validateCitationInput(citation, `${path}.citations[${citationIndex}]`),
    );
    if (
      version.provenanceStatus &&
      !allowedProvenanceStatuses.has(version.provenanceStatus)
    ) {
      throw new Error(`${path}.provenanceStatus is not supported.`);
    }
    validateReview(version.editorialReview, `${path}.editorialReview`);
  }

  for (const [index, event] of (bundle.events || []).entries()) {
    const path = `events[${index}]`;
    validateEventTarget(event.target, `${path}.target`);
    validateEventIdentity(event.identity, `${path}.identity`);
    if (event.authorship !== "originalSynthesis") {
      throw new Error(
        `${path}.authorship must explicitly attest originalSynthesis.`,
      );
    }
    if ((event.summary?.length || 0) > 1_000) {
      throw new Error(`${path}.summary exceeds 1,000 characters.`);
    }
    validateArticle(event.article, `${path}.article`);
    (event.citations || []).forEach((citation, citationIndex) =>
      validateCitationInput(citation, `${path}.citations[${citationIndex}]`),
    );
    (event.changes || []).forEach((change, changeIndex) =>
      validateChange(change, `${path}.changes[${changeIndex}]`),
    );
    if (
      event.provenanceStatus &&
      !allowedProvenanceStatuses.has(event.provenanceStatus)
    ) {
      throw new Error(`${path}.provenanceStatus is not supported.`);
    }
    validateReview(event.editorialReview, `${path}.editorialReview`);
  }

  for (const [index, build] of (bundle.builds || []).entries()) {
    const path = `builds[${index}]`;
    assertDocumentId(build.releaseVersionId, `${path}.releaseVersionId`);
    assertDocumentId(build.platformId, `${path}.platformId`);
    normalizedBuildNumber(build.buildNumber);
    (build.eventTargets || []).forEach((target, targetIndex) =>
      validateEventTarget(target, `${path}.eventTargets[${targetIndex}]`),
    );
    if (build.authorship !== "originalSynthesis") {
      throw new Error(
        `${path}.authorship must explicitly attest originalSynthesis.`,
      );
    }
    if ((build.summary?.length || 0) > 1_000) {
      throw new Error(`${path}.summary exceeds 1,000 characters.`);
    }
    validateArticle(build.article, `${path}.article`);
    if (!build.citations?.length) {
      throw new Error(`${path}.citations must contain at least one source.`);
    }
    build.citations.forEach((citation, citationIndex) =>
      validateCitationInput(citation, `${path}.citations[${citationIndex}]`),
    );
    (build.changes || []).forEach((change, changeIndex) =>
      validateChange(change, `${path}.changes[${changeIndex}]`),
    );
    if (
      build.provenanceStatus &&
      !allowedProvenanceStatuses.has(build.provenanceStatus)
    ) {
      throw new Error(`${path}.provenanceStatus is not supported.`);
    }
    validateReview(build.editorialReview, `${path}.editorialReview`);
  }
}

function normalizeCitationInputs(
  inputs: LaunchCitationInput[],
): LaunchCitationInput[] {
  const byIdentity = new Map<string, LaunchCitationInput>();
  for (const input of inputs) {
    const normalized = {
      url: normalizeSourceUrl(input.url),
      ...(input.locator?.trim() ? { locator: input.locator.trim() } : {}),
      ...(input.note?.trim() ? { note: input.note.trim() } : {}),
    };
    const identity = stableStringify(normalized);
    byIdentity.set(identity, normalized);
  }
  return [...byIdentity.values()].sort((left, right) =>
    stableStringify(left).localeCompare(stableStringify(right)),
  );
}

function citationDocument(
  ownerId: string,
  input: LaunchCitationInput,
  sourceId: string,
): UnknownRecord {
  const identity = stableStringify({
    ownerId,
    sourceId,
    locator: input.locator,
    note: input.note,
  });
  return {
    _key: `citation-${compactHash(identity)}`,
    _type: "citation",
    source: sanityReference(sourceId),
    ...(input.locator ? { locator: input.locator } : {}),
    ...(input.note ? { note: input.note } : {}),
  };
}

function citationIdentity(value: unknown): string | undefined {
  if (!isRecord(value)) return undefined;
  const sourceId = referenceId(value.source);
  if (!sourceId) return undefined;
  return stableStringify({
    sourceId,
    locator: stringValue(value.locator),
    note: stringValue(value.note),
  });
}

function mergeCitations(
  current: unknown,
  additions: UnknownRecord[],
): UnknownRecord[] {
  const merged = new Map<string, UnknownRecord>();
  for (const citation of [...asArray(current), ...additions]) {
    if (!isRecord(citation)) continue;
    const identity = citationIdentity(citation);
    if (!identity) continue;
    const existing = merged.get(identity);
    if (!existing) {
      merged.set(identity, cloneJson(citation));
      continue;
    }
    const currentKey = stringValue(existing._key) || "";
    const nextKey = stringValue(citation._key) || "";
    if (nextKey && (!currentKey || nextKey < currentKey)) {
      merged.set(identity, cloneJson(citation));
    }
  }
  return [...merged.values()].sort((left, right) =>
    (citationIdentity(left) || "").localeCompare(citationIdentity(right) || ""),
  );
}

function articleCitations(
  article: OriginalArticleInput | undefined,
): LaunchCitationInput[] {
  return normalizeCitationInputs(
    (article?.blocks || []).flatMap((block) => [
      ...(block.citations || []),
      ...(block.spans || []).flatMap((span) => span.citations || []),
    ]),
  );
}

function portableArticle(
  ownerId: string,
  article: OriginalArticleInput,
  sourceIdForUrl: (url: string) => string,
): UnknownRecord[] {
  return article.blocks.map((block, index) => {
    const inputSpans = block.spans?.length
      ? block.spans
      : [
          {
            text: block.text || "",
            citations: block.citations || [],
          },
        ];
    const citationByIdentity = new Map<
      string,
      { citation: LaunchCitationInput; mark: UnknownRecord }
    >();
    const spans = inputSpans.map((span, spanIndex) => {
      const citations = normalizeCitationInputs(span.citations || []);
      const marks = citations.map((citation) => {
        const identity = stableStringify(citation);
        let entry = citationByIdentity.get(identity);
        if (!entry) {
          entry = {
            citation,
            mark: citationDocument(
              `${ownerId}:block:${index}`,
              citation,
              sourceIdForUrl(citation.url),
            ),
          };
          citationByIdentity.set(identity, entry);
        }
        return String(entry.mark._key);
      });
      const text = block.spans?.length ? span.text : span.text.trim();
      return {
        _key: `span-${compactHash(
          `${ownerId}\0${index}\0${spanIndex}\0${text}`,
        )}`,
        _type: "span",
        text,
        marks,
      };
    });
    const markDefs = [...citationByIdentity.values()]
      .sort((left, right) =>
        stableStringify(left.citation).localeCompare(
          stableStringify(right.citation),
        ),
      )
      .map(({ mark }) => mark);
    const blockText = spans.map((span) => String(span.text)).join("");
    return {
      _key: `block-${compactHash(
        stableStringify({
          ownerId,
          index,
          style: block.style || "normal",
          text: blockText,
        }),
      )}`,
      _type: "block",
      style: block.style || "normal",
      markDefs,
      children: spans,
    };
  });
}

class WorkingSet {
  private readonly existingById: Map<string, SanityDocument>;
  private readonly documents = new Map<string, WorkingDocument>();

  constructor(existing: SanityDocument[]) {
    this.existingById = new Map(
      existing.map((document) => [document._id, document]),
    );
  }

  existing(id: string): SanityDocument | undefined {
    return this.existingById.get(id);
  }

  ensure(
    id: string,
    type: string,
    createDocument?: SanityDocument,
  ): WorkingDocument {
    const current = this.documents.get(id);
    if (current) {
      if (current.type !== type) {
        throw new Error(
          `${id} was planned as both ${current.type} and ${type}.`,
        );
      }
      return current;
    }

    const existing = this.existingById.get(id);
    if (existing && existing._type !== type) {
      throw new Error(
        `${id} already exists as ${existing._type}, not ${type}.`,
      );
    }
    if (!existing && !createDocument) {
      throw new Error(`${id} does not exist and has no create document.`);
    }
    if (
      createDocument &&
      (createDocument._id !== id || createDocument._type !== type)
    ) {
      throw new Error(`${id} has an inconsistent create document.`);
    }

    const working: WorkingDocument = {
      id,
      type,
      ...(existing ? { existing } : {}),
      value: cloneJson(existing || createDocument!),
      touched: new Set<string>(),
    };
    this.documents.set(id, working);
    return working;
  }

  requireExisting(id: string, type: string): WorkingDocument {
    const existing = this.existingById.get(id);
    if (!existing) {
      throw new Error(`${id} must already exist as ${type}.`);
    }
    return this.ensure(id, type);
  }

  set(document: WorkingDocument, field: string, value: unknown): void {
    if (!exactEqual(document.value[field], value)) {
      document.value[field] = cloneJson(value);
      document.touched.add(field);
    }
  }

  fill(document: WorkingDocument, field: string, value: unknown): void {
    if (document.value[field] === undefined) {
      this.set(document, field, value);
    }
  }

  assertReference(
    document: WorkingDocument,
    field: string,
    expectedId: string,
  ): void {
    const currentId = referenceId(document.value[field]);
    if (currentId && currentId !== expectedId) {
      throw new Error(
        `${document.id}.${field} references ${currentId}, expected ${expectedId}.`,
      );
    }
    this.fill(document, field, sanityReference(expectedId));
  }

  mergeCitations(document: WorkingDocument, additions: UnknownRecord[]): void {
    const citations = mergeCitations(document.value.citations, additions);
    this.set(document, "citations", citations);
  }

  mergeChanges(document: WorkingDocument, additions: UnknownRecord[]): void {
    const merged = new Map<string, UnknownRecord>();
    for (const occurrence of [
      ...asArray(document.value.changes),
      ...additions,
    ]) {
      if (!isRecord(occurrence)) continue;
      const changeId = referenceId(occurrence.change);
      const key = changeId || stringValue(occurrence._key);
      if (!key) continue;
      merged.set(key, cloneJson(occurrence));
    }
    const changes = [...merged.entries()]
      .sort(([left], [right]) => left.localeCompare(right))
      .map(([, occurrence]) => occurrence);
    this.set(document, "changes", changes);
  }

  values(): WorkingDocument[] {
    return [...this.documents.values()].sort((left, right) =>
      left.id.localeCompare(right.id),
    );
  }
}

function sourceLabelForLegacy(
  url: string,
  label: string | undefined,
): { title: string; publisher: string; sourceClass: string } {
  const hostname = new URL(url).hostname.replace(/^www\./, "");
  const cleanLabel = label?.trim();
  return {
    title: cleanLabel || `Legacy release source (${hostname})`,
    publisher: cleanLabel || hostname,
    sourceClass:
      hostname === "apple.com" || hostname.endsWith(".apple.com")
        ? "firstPartyDocumentation"
        : "other",
  };
}

function sourceCreateDocument(source: {
  id: string;
  url: string;
  accessedAt: string;
  explicit?: LaunchSourceInput;
  legacyLabel?: string;
}): SanityDocument {
  const fallback = sourceLabelForLegacy(source.url, source.legacyLabel);
  const explicit = source.explicit;
  return {
    _id: source.id,
    _type: "source",
    title: explicit?.title.trim() || fallback.title,
    canonicalUrl: source.url,
    publisher: explicit?.publisher.trim() || fallback.publisher,
    sourceClass: explicit?.sourceClass || fallback.sourceClass,
    ...(explicit?.author?.trim() ? { author: explicit.author.trim() } : {}),
    ...(explicit?.publishedAt ? { publishedAt: explicit.publishedAt } : {}),
    accessedAt: source.accessedAt,
    ...(explicit?.archiveUrl
      ? {
          archiveUrl: normalizeSourceUrl(explicit.archiveUrl),
        }
      : {}),
    status: "active",
    reuseBasis: "linkedFactsOnly",
    ...(explicit?.topics?.length
      ? {
          topics: [...new Set(explicit.topics.map((topic) => topic.trim()))]
            .filter(Boolean)
            .sort(),
        }
      : {}),
  };
}

function buildSourceRegistry({
  documents,
  versions,
  bundle,
  workingSet,
}: {
  documents: SanityDocument[];
  versions: LegacyReleaseVersion[];
  bundle: LaunchContentBundle;
  workingSet: WorkingSet;
}): Map<string, SourceResolution> {
  const existingByUrl = new Map<string, SanityDocument>();
  for (const source of documents.filter(
    (document) => document._type === "source",
  )) {
    const rawUrl = stringValue(source.canonicalUrl);
    if (!rawUrl) continue;
    const url = normalizeSourceUrl(rawUrl, `${source._id}.canonicalUrl`);
    const duplicate = existingByUrl.get(url);
    if (duplicate && duplicate._id !== source._id) {
      throw new Error(
        `Source URL ${url} is duplicated by ${duplicate._id} and ${source._id}.`,
      );
    }
    existingByUrl.set(url, source);
  }

  const explicitByUrl = new Map<string, LaunchSourceInput>();
  for (const source of bundle.sources || []) {
    explicitByUrl.set(normalizeSourceUrl(source.url), source);
  }

  const legacyLabels = new Map<string, string>();
  for (const version of versions) {
    for (const milestone of version.milestones) {
      const sourceUrl = stringValue(milestone.sourceUrl);
      if (!sourceUrl) continue;
      const url = normalizeSourceUrl(
        sourceUrl,
        `${version._id}.${milestone._key || milestone.label}.sourceUrl`,
      );
      const label = stringValue(milestone.sourceLabel);
      if (label && !legacyLabels.has(url)) {
        legacyLabels.set(url, label);
      }
    }
  }

  const citedUrls = new Set<string>([
    ...legacyLabels.keys(),
    ...explicitByUrl.keys(),
  ]);
  const collectCitations = (citations: LaunchCitationInput[] | undefined) => {
    for (const citation of citations || []) {
      citedUrls.add(normalizeSourceUrl(citation.url));
    }
  };
  for (const version of bundle.versions || []) {
    collectCitations(version.citations);
    collectCitations(articleCitations(version.overview));
  }
  for (const event of bundle.events || []) {
    collectCitations(event.citations);
    collectCitations(articleCitations(event.article));
    for (const change of event.changes || []) {
      collectCitations(change.citations);
    }
  }
  for (const build of bundle.builds || []) {
    collectCitations(build.citations);
    collectCitations(articleCitations(build.article));
    for (const change of build.changes || []) {
      collectCitations(change.citations);
    }
  }

  const registry = new Map<string, SourceResolution>();
  for (const url of [...citedUrls].sort()) {
    const existing = existingByUrl.get(url);
    const explicit = explicitByUrl.get(url);
    if (!existing && !explicit && !legacyLabels.has(url)) {
      throw new Error(
        `Editorial citation ${url} needs a matching entry in bundle.sources.`,
      );
    }
    const id = existing?._id || sourceDocumentId(url);
    const createDocument = sourceCreateDocument({
      id,
      url,
      accessedAt: bundle.accessedAt,
      ...(explicit ? { explicit } : {}),
      ...(legacyLabels.get(url) ? { legacyLabel: legacyLabels.get(url) } : {}),
    });
    const working = workingSet.ensure(id, "source", createDocument);

    if (existing) {
      if (normalizeSourceUrl(String(existing.canonicalUrl)) !== url) {
        throw new Error(`${id} has an unexpected canonical URL.`);
      }
      // Older source documents may predate the current provenance fields.
      // Fill only missing required metadata so a reused legacy source is safe
      // to cite without overwriting intentional editorial values.
      workingSet.fill(working, "title", createDocument.title);
      workingSet.fill(working, "publisher", createDocument.publisher);
      workingSet.fill(working, "sourceClass", createDocument.sourceClass);
      workingSet.fill(working, "accessedAt", bundle.accessedAt);
      workingSet.fill(working, "status", "active");
      workingSet.fill(working, "reuseBasis", "linkedFactsOnly");
      if (explicit) {
        workingSet.set(working, "title", explicit.title.trim());
        workingSet.set(working, "publisher", explicit.publisher.trim());
        workingSet.set(working, "sourceClass", explicit.sourceClass);
        if (explicit.author?.trim()) {
          workingSet.set(working, "author", explicit.author.trim());
        }
        if (explicit.publishedAt) {
          workingSet.set(working, "publishedAt", explicit.publishedAt);
        }
        if (explicit.archiveUrl) {
          workingSet.set(
            working,
            "archiveUrl",
            normalizeSourceUrl(explicit.archiveUrl),
          );
        }
        if (explicit.topics) {
          workingSet.set(
            working,
            "topics",
            [...new Set(explicit.topics.map((topic) => topic.trim()))]
              .filter(Boolean)
              .sort(),
          );
        }
      }
    }

    registry.set(url, {
      id,
      url,
      document: working.value,
    });
  }
  return registry;
}

function sourceIdResolver(
  registry: Map<string, SourceResolution>,
): (url: string) => string {
  return (url: string) => {
    const normalized = normalizeSourceUrl(url);
    const source = registry.get(normalized);
    if (!source) {
      throw new Error(`No source document was resolved for ${normalized}.`);
    }
    return source.id;
  };
}

function citationsForInputs(
  ownerId: string,
  inputs: LaunchCitationInput[],
  sourceIdForUrl: (url: string) => string,
): UnknownRecord[] {
  return normalizeCitationInputs(inputs).map((citation) =>
    citationDocument(ownerId, citation, sourceIdForUrl(citation.url)),
  );
}

function assertFieldIdentity(
  workingSet: WorkingSet,
  document: WorkingDocument,
  field: string,
  expected: unknown,
): void {
  const current = document.value[field];
  if (current !== undefined && !exactEqual(current, expected)) {
    throw new Error(
      `${document.id}.${field} conflicts with its deterministic migration identity.`,
    );
  }
  workingSet.fill(document, field, expected);
}

function applyMigrationEvent(
  workingSet: WorkingSet,
  event: SchemaReadyReleaseEvent,
  citations: UnknownRecord[],
): WorkingDocument {
  const createDocument = {
    ...cloneJson(event),
    ...(citations.length
      ? {
          citations,
          provenanceStatus: "sourceLinked",
        }
      : {}),
  } as SanityDocument;
  const document = workingSet.ensure(event._id, "releaseEvent", createDocument);

  assertFieldIdentity(
    workingSet,
    document,
    "releaseVersion",
    event.releaseVersion,
  );
  assertFieldIdentity(workingSet, document, "platform", event.platform);
  assertFieldIdentity(
    workingSet,
    document,
    "stableEventId",
    event.stableEventId,
  );
  assertFieldIdentity(
    workingSet,
    document,
    "legacySourceId",
    event.legacySourceId,
  );

  for (const [field, value] of Object.entries(event)) {
    if (["_id", "_type", "citations", "provenanceStatus"].includes(field)) {
      continue;
    }
    workingSet.fill(document, field, value);
  }
  if (citations.length) {
    workingSet.mergeCitations(document, citations);
    if (
      !document.value.provenanceStatus ||
      document.value.provenanceStatus === "legacyImported"
    ) {
      workingSet.set(document, "provenanceStatus", "sourceLinked");
    }
  } else {
    workingSet.fill(document, "provenanceStatus", "legacyImported");
  }
  workingSet.fill(document, "editorialReview", {
    _type: "editorialReview",
    status: "draft",
  });
  workingSet.fill(document, "isIndexable", false);
  if (event.build) {
    const currentBuildId = referenceId(document.value.build);
    if (currentBuildId && currentBuildId !== event.build._ref) {
      throw new Error(
        `${event._id}.build conflicts with verified build ${event.build._ref}.`,
      );
    }
    workingSet.fill(document, "build", event.build);
  }
  return document;
}

function applyMigrationBuild(
  workingSet: WorkingSet,
  build: SchemaReadyReleaseBuild,
): WorkingDocument {
  const createDocument = cloneJson(build) as unknown as SanityDocument;
  const document = workingSet.ensure(build._id, "releaseBuild", createDocument);
  assertFieldIdentity(
    workingSet,
    document,
    "releaseVersion",
    build.releaseVersion,
  );
  assertFieldIdentity(workingSet, document, "platform", build.platform);
  const currentBuild = stringValue(document.value.buildNumber);
  if (
    currentBuild &&
    currentBuild.toUpperCase() !== build.buildNumber.toUpperCase()
  ) {
    throw new Error(
      `${build._id}.buildNumber conflicts with ${build.buildNumber}.`,
    );
  }
  workingSet.fill(document, "buildNumber", build.buildNumber);
  for (const [field, value] of Object.entries(build)) {
    if (["_id", "_type", "citations", "provenanceStatus"].includes(field)) {
      continue;
    }
    workingSet.fill(document, field, value);
  }
  workingSet.mergeCitations(
    document,
    build.citations as unknown as UnknownRecord[],
  );
  if (
    !document.value.provenanceStatus ||
    document.value.provenanceStatus === "legacyImported"
  ) {
    workingSet.set(document, "provenanceStatus", "sourceLinked");
  }
  workingSet.fill(document, "editorialReview", {
    _type: "editorialReview",
    status: "draft",
  });
  workingSet.fill(document, "isIndexable", false);
  return document;
}

function applyReleaseStatusNormalizations(
  workingSet: WorkingSet,
  migrationPlan: ReleaseEventMigrationPlan,
): void {
  for (const normalization of migrationPlan.releaseStatusNormalizations) {
    const document = workingSet.requireExisting(
      normalization.releaseVersionId,
      "releaseVersion",
    );
    if (document.value.releaseStatus === undefined) {
      workingSet.set(document, "releaseStatus", normalization.to);
    }
  }
}

interface EventIndex {
  byId: Map<string, WorkingDocument>;
  byLegacySourceId: Map<string, WorkingDocument>;
  byStableEventId: Map<string, WorkingDocument>;
  byVersionRoute: Map<string, WorkingDocument>;
}

function versionRouteKey(releaseVersionId: string, routeAlias: string): string {
  return `${releaseVersionId}\0${routeAlias}`;
}

function indexEvent(index: EventIndex, document: WorkingDocument): void {
  const add = (
    map: Map<string, WorkingDocument>,
    key: string | undefined,
    kind: string,
  ) => {
    if (!key) return;
    const existing = map.get(key);
    if (existing && existing.id !== document.id) {
      throw new Error(
        `Release events ${existing.id} and ${document.id} repeat ${kind} ${key}.`,
      );
    }
    map.set(key, document);
  };
  add(index.byId, document.id, "document ID");
  add(
    index.byLegacySourceId,
    stringValue(document.value.legacySourceId),
    "legacySourceId",
  );
  add(
    index.byStableEventId,
    stringValue(document.value.stableEventId),
    "stableEventId",
  );
  const releaseVersionId = referenceId(document.value.releaseVersion);
  const routeAlias = isRecord(document.value.routeAlias)
    ? stringValue(document.value.routeAlias.current)
    : undefined;
  if (releaseVersionId && routeAlias) {
    add(
      index.byVersionRoute,
      versionRouteKey(releaseVersionId, routeAlias),
      "version-scoped route alias",
    );
  }
}

function createEventIndex(
  documents: SanityDocument[],
  workingSet: WorkingSet,
): EventIndex {
  const index: EventIndex = {
    byId: new Map(),
    byLegacySourceId: new Map(),
    byStableEventId: new Map(),
    byVersionRoute: new Map(),
  };
  for (const existing of documents.filter(
    (document) => document._type === "releaseEvent",
  )) {
    indexEvent(index, workingSet.ensure(existing._id, "releaseEvent"));
  }
  for (const document of workingSet
    .values()
    .filter((value) => value.type === "releaseEvent")) {
    indexEvent(index, document);
  }
  return index;
}

function findEvent(
  index: EventIndex,
  target: LaunchEventTarget,
): WorkingDocument | undefined {
  if (target.documentId) return index.byId.get(target.documentId);
  if (target.legacySourceId) {
    return index.byLegacySourceId.get(target.legacySourceId);
  }
  if (target.stableEventId) {
    return index.byStableEventId.get(target.stableEventId);
  }
  if (target.releaseVersionId && target.routeAlias) {
    return index.byVersionRoute.get(
      versionRouteKey(target.releaseVersionId, target.routeAlias),
    );
  }
  return undefined;
}

function ensureReferencedParent(
  documentsById: Map<string, SanityDocument>,
  id: string,
  type: string,
): void {
  const document = documentsById.get(id);
  if (!document || document._type !== type) {
    throw new Error(`${id} must exist as ${type}.`);
  }
}

function platformSlug(platform: SanityDocument): string | undefined {
  return isRecord(platform.slug)
    ? stringValue(platform.slug.current)
    : undefined;
}

function deterministicVersionDocumentId(
  platform: SanityDocument,
  version: string,
): string {
  const slug = platformSlug(platform);
  if (!slug || slugify(slug) !== slug) {
    throw new Error(
      `${platform._id} needs a canonical slug before it can parent a new releaseVersion.`,
    );
  }
  return `version-${slug}-${slugify(version)}`;
}

function assertVersionIdentityParents(
  documentsById: Map<string, SanityDocument>,
  releaseVersionId: string,
  identity: LaunchVersionIdentityInput,
): void {
  ensureReferencedParent(
    documentsById,
    identity.releaseTrainId,
    "releaseTrain",
  );
  ensureReferencedParent(documentsById, identity.platformId, "platform");

  const train = documentsById.get(identity.releaseTrainId)!;
  const trainPlatformId = referenceId(train.platform);
  if (!trainPlatformId) {
    throw new Error(
      `${identity.releaseTrainId}.platform must reference a platform.`,
    );
  }
  if (trainPlatformId !== identity.platformId) {
    throw new Error(
      `${identity.releaseTrainId} belongs to ${trainPlatformId}, not ${identity.platformId}.`,
    );
  }

  const trainMajorVersion = train.majorVersion;
  const versionMajor = Number(identity.version.split(".")[0]);
  if (
    typeof trainMajorVersion !== "number" ||
    !Number.isInteger(trainMajorVersion) ||
    trainMajorVersion <= 0
  ) {
    throw new Error(
      `${identity.releaseTrainId}.majorVersion must be a positive integer.`,
    );
  }
  if (trainMajorVersion !== versionMajor) {
    throw new Error(
      `${identity.releaseTrainId} is major version ${trainMajorVersion}, not ${versionMajor} for ${identity.version}.`,
    );
  }

  const platform = documentsById.get(identity.platformId)!;
  const expectedId = deterministicVersionDocumentId(platform, identity.version);
  if (releaseVersionId !== expectedId) {
    throw new Error(
      `${releaseVersionId} does not match deterministic releaseVersion ID ${expectedId} for ${identity.platformId} ${identity.version}.`,
    );
  }
}

function assertUniqueVersionIdentity(
  documentsById: Map<string, SanityDocument>,
  releaseVersionId: string,
  identity: LaunchVersionIdentityInput,
): void {
  const normalizedVersion = identity.version.toLowerCase();
  for (const document of documentsById.values()) {
    if (
      document._type !== "releaseVersion" ||
      document._id === releaseVersionId ||
      stringValue(document.version)?.toLowerCase() !== normalizedVersion
    ) {
      continue;
    }
    const trainId = referenceId(document.releaseTrain);
    const train = trainId ? documentsById.get(trainId) : undefined;
    if (
      train &&
      train._type === "releaseTrain" &&
      referenceId(train.platform) === identity.platformId
    ) {
      throw new Error(
        `${identity.platformId} version ${identity.version} already exists as ${document._id}.`,
      );
    }
  }
}

function assertIdentityMatchesExistingVersion(
  document: SanityDocument,
  identity: LaunchVersionIdentityInput,
): void {
  const checks: Array<[string, unknown]> = [
    ["releaseTrain", sanityReference(identity.releaseTrainId)],
    ["version", identity.version],
    ["releaseStatus", identity.releaseStatus],
    ["publicReleaseDate", identity.publicReleaseDate],
  ];
  for (const [field, expected] of checks) {
    if (!exactEqual(document[field], expected)) {
      throw new Error(
        `${document._id}.${field} does not match the manifest identity.`,
      );
    }
  }
}

function ensureManifestVersion(
  workingSet: WorkingSet,
  documentsById: Map<string, SanityDocument>,
  input: LaunchVersionContentInput,
): WorkingDocument {
  const identity = input.identity;
  if (!identity) {
    return workingSet.requireExisting(input.releaseVersionId, "releaseVersion");
  }

  assertVersionIdentityParents(documentsById, input.releaseVersionId, identity);
  assertUniqueVersionIdentity(documentsById, input.releaseVersionId, identity);

  const existing = documentsById.get(input.releaseVersionId);
  if (existing) {
    if (existing._type !== "releaseVersion") {
      throw new Error(
        `${input.releaseVersionId} already exists as ${existing._type}, not releaseVersion.`,
      );
    }
    assertIdentityMatchesExistingVersion(existing, identity);
    return workingSet.ensure(input.releaseVersionId, "releaseVersion");
  }

  const document = workingSet.ensure(input.releaseVersionId, "releaseVersion", {
    _id: input.releaseVersionId,
    _type: "releaseVersion",
    releaseTrain: sanityReference(identity.releaseTrainId),
    version: identity.version,
    releaseStatus: identity.releaseStatus,
    publicReleaseDate: identity.publicReleaseDate,
    milestones: [],
    provenanceStatus: "legacyImported",
    editorialReview: {
      _type: "editorialReview",
      status: "draft",
    },
  });
  documentsById.set(input.releaseVersionId, document.value);
  return document;
}

function assertReleaseParents(
  documentsById: Map<string, SanityDocument>,
  releaseVersionId: string,
  platformId: string,
): void {
  ensureReferencedParent(documentsById, releaseVersionId, "releaseVersion");
  ensureReferencedParent(documentsById, platformId, "platform");
  const version = documentsById.get(releaseVersionId)!;
  const trainId = referenceId(version.releaseTrain);
  const train = trainId ? documentsById.get(trainId) : undefined;
  const trainPlatformId = train ? referenceId(train.platform) : undefined;
  if (trainPlatformId && trainPlatformId !== platformId) {
    throw new Error(
      `${releaseVersionId} belongs to ${trainPlatformId}, not ${platformId}.`,
    );
  }
}

function createManifestEvent(
  workingSet: WorkingSet,
  documentsById: Map<string, SanityDocument>,
  input: LaunchEventContentInput,
): WorkingDocument {
  const identity = input.identity;
  if (!identity) {
    throw new Error(
      `Event target ${stableStringify(input.target)} was not found and needs a complete identity block.`,
    );
  }
  if (
    input.target.stableEventId &&
    input.target.stableEventId !== identity.stableEventId
  ) {
    throw new Error(
      "A new event target stableEventId must match identity.stableEventId.",
    );
  }
  if (
    input.target.releaseVersionId &&
    input.target.releaseVersionId !== identity.releaseVersionId
  ) {
    throw new Error(
      "A new event target releaseVersionId must match identity.releaseVersionId.",
    );
  }
  if (
    input.target.routeAlias &&
    input.target.routeAlias !== identity.routeAlias
  ) {
    throw new Error(
      "A new event target routeAlias must match identity.routeAlias.",
    );
  }
  assertReleaseParents(
    documentsById,
    identity.releaseVersionId,
    identity.platformId,
  );
  if (!workingSet.existing(identity.releaseVersionId)) {
    const releaseVersion = documentsById.get(identity.releaseVersionId)!;
    if (
      input.target.releaseVersionId !== identity.releaseVersionId ||
      input.target.routeAlias !== "public" ||
      identity.routeAlias !== "public" ||
      identity.channel !== "public" ||
      identity.appearanceDate !== releaseVersion.publicReleaseDate ||
      identity.closesReleaseCycle !== true
    ) {
      throw new Error(
        `A same-bundle event for new version ${identity.releaseVersionId} must use the durable public route, public channel, matching publicReleaseDate, and closesReleaseCycle=true.`,
      );
    }
  }
  const id = input.target.documentId || eventDocumentId(identity.stableEventId);
  const expectedId = eventDocumentId(identity.stableEventId);
  if (id !== expectedId) {
    throw new Error(
      `New event ${identity.stableEventId} must use deterministic document ID ${expectedId}.`,
    );
  }
  const document = workingSet.ensure(id, "releaseEvent", {
    _id: id,
    _type: "releaseEvent",
    releaseVersion: sanityReference(identity.releaseVersionId),
    platform: sanityReference(identity.platformId),
    stableEventId: identity.stableEventId,
    label: identity.label.trim(),
    routeAlias: {
      _type: "slug",
      current: identity.routeAlias,
    },
    channel: identity.channel,
    appearanceDate: identity.appearanceDate,
    ...(identity.sequence ? { sequence: identity.sequence } : {}),
    isRevision: identity.isRevision || false,
    availabilityState: identity.availabilityState || "available",
    closesReleaseCycle: identity.closesReleaseCycle || false,
    provenanceStatus: "legacyImported",
    editorialReview: {
      _type: "editorialReview",
      status: "draft",
    },
    isIndexable: false,
  });
  return document;
}

function reviewDocument(review: EditorialReviewInput): UnknownRecord {
  return {
    _type: "editorialReview",
    status: review.status,
    ...(review.reviewedAt ? { reviewedAt: review.reviewedAt } : {}),
  };
}

function publicationOverlay(
  workingSet: WorkingSet,
  document: WorkingDocument,
  {
    citations,
    provenanceStatus,
    editorialReview,
    isIndexable,
  }: {
    citations: UnknownRecord[];
    provenanceStatus?: ProvenanceStatus;
    editorialReview?: EditorialReviewInput;
    isIndexable?: boolean;
  },
): void {
  if (citations.length) {
    workingSet.mergeCitations(document, citations);
  }
  if (provenanceStatus) {
    workingSet.set(document, "provenanceStatus", provenanceStatus);
  } else if (
    citations.length &&
    (!document.value.provenanceStatus ||
      document.value.provenanceStatus === "legacyImported")
  ) {
    workingSet.set(document, "provenanceStatus", "sourceLinked");
  }
  if (editorialReview) {
    workingSet.set(
      document,
      "editorialReview",
      reviewDocument(editorialReview),
    );
  }
  if (isIndexable !== undefined) {
    workingSet.set(document, "isIndexable", isIndexable);
  }
}

function occurrenceCitations(
  ownerId: string,
  change: LaunchChangeOccurrenceInput,
  sourceIdForUrl: (url: string) => string,
): UnknownRecord[] {
  return citationsForInputs(
    `${ownerId}:change:${change.key}`,
    change.citations,
    sourceIdForUrl,
  );
}

function buildChangeOccurrence(
  ownerId: string,
  change: LaunchChangeOccurrenceInput,
  sourceIdForUrl: (url: string) => string,
): UnknownRecord {
  const changeId = changeDocumentId(change.key);
  return {
    _key: `occurrence-${compactHash(`${ownerId}\0${change.key}`)}`,
    _type: "changeOccurrence",
    change: sanityReference(changeId),
    action: change.action,
    inheritance: change.inheritance || "delta",
    summary: change.summary.trim(),
    documentedStatus: change.documentedStatus,
    evidenceState: change.evidenceState,
    ...(change.verificationMethod?.trim()
      ? {
          verificationMethod: change.verificationMethod.trim(),
        }
      : {}),
    citations: occurrenceCitations(ownerId, change, sourceIdForUrl),
  };
}

function ensureChangeDocument(
  workingSet: WorkingSet,
  change: LaunchChangeOccurrenceInput,
  sourceIdForUrl: (url: string) => string,
  definitions: Map<
    string,
    Pick<LaunchChangeOccurrenceInput, "title" | "canonicalSummary" | "category">
  >,
  ownerReview?: EditorialReviewInput,
  ownerProvenance?: ProvenanceStatus,
): WorkingDocument {
  const id = changeDocumentId(change.key);
  const definition = {
    title: change.title.trim(),
    canonicalSummary: change.canonicalSummary.trim(),
    category: change.category,
  };
  const previous = definitions.get(id);
  if (previous && !exactEqual(previous, definition)) {
    throw new Error(
      `Change key ${change.key} has conflicting canonical definitions in the manifest.`,
    );
  }
  definitions.set(id, definition);
  const citations = occurrenceCitations(id, change, sourceIdForUrl);
  const document = workingSet.ensure(id, "releaseChange", {
    _id: id,
    _type: "releaseChange",
    title: definition.title,
    slug: {
      _type: "slug",
      current: slugify(definition.title).slice(0, 96),
    },
    canonicalSummary: definition.canonicalSummary,
    category: definition.category,
    status: "active",
    citations,
    provenanceStatus: "sourceLinked",
    editorialReview: {
      _type: "editorialReview",
      status: "draft",
    },
  });
  workingSet.set(document, "title", definition.title);
  workingSet.set(document, "canonicalSummary", definition.canonicalSummary);
  workingSet.set(document, "category", definition.category);
  workingSet.fill(document, "slug", {
    _type: "slug",
    current: slugify(definition.title).slice(0, 96),
  });
  workingSet.fill(document, "status", "active");
  workingSet.mergeCitations(document, citations);
  if (
    !document.value.provenanceStatus ||
    document.value.provenanceStatus === "legacyImported"
  ) {
    workingSet.set(document, "provenanceStatus", "sourceLinked");
  }
  workingSet.fill(document, "editorialReview", {
    _type: "editorialReview",
    status: "draft",
  });
  // A canonical change definition is reviewed with the approved occurrence
  // that introduces it. Never downgrade a definition when a later draft
  // occurrence reuses the same library record.
  if (ownerReview?.status === "approved") {
    workingSet.set(document, "editorialReview", reviewDocument(ownerReview));
    if (ownerProvenance === "editoriallyVerified") {
      workingSet.set(document, "provenanceStatus", "editoriallyVerified");
    }
  }
  return document;
}

function allOwnerCitations({
  ownerId,
  citations,
  article,
  changes,
  sourceIdForUrl,
}: {
  ownerId: string;
  citations?: LaunchCitationInput[];
  article?: OriginalArticleInput;
  changes?: LaunchChangeOccurrenceInput[];
  sourceIdForUrl: (url: string) => string;
}): UnknownRecord[] {
  return citationsForInputs(
    ownerId,
    [
      ...(citations || []),
      ...articleCitations(article),
      ...(changes || []).flatMap((change) => change.citations),
    ],
    sourceIdForUrl,
  );
}

function applyVersionContent(
  workingSet: WorkingSet,
  documentsById: Map<string, SanityDocument>,
  version: LaunchVersionContentInput,
  sourceIdForUrl: (url: string) => string,
): void {
  const document = ensureManifestVersion(workingSet, documentsById, version);
  const citations = allOwnerCitations({
    ownerId: version.releaseVersionId,
    citations: version.citations,
    article: version.overview,
    sourceIdForUrl,
  });
  if (version.releaseNotesUrl) {
    workingSet.set(
      document,
      "releaseNotesUrl",
      normalizeSourceUrl(version.releaseNotesUrl),
    );
  }
  if (version.overview) {
    workingSet.set(
      document,
      "overview",
      portableArticle(
        `${version.releaseVersionId}:overview`,
        version.overview,
        sourceIdForUrl,
      ),
    );
  }
  publicationOverlay(workingSet, document, {
    citations,
    provenanceStatus: version.provenanceStatus,
    editorialReview: version.editorialReview,
  });
}

function assertIdentityMatchesExistingEvent(
  event: WorkingDocument,
  identity: LaunchEventIdentityInput,
): void {
  const checks: Array<[string, unknown]> = [
    ["releaseVersion", sanityReference(identity.releaseVersionId)],
    ["platform", sanityReference(identity.platformId)],
    ["stableEventId", identity.stableEventId],
  ];
  for (const [field, expected] of checks) {
    if (!exactEqual(event.value[field], expected)) {
      throw new Error(
        `${event.id}.${field} does not match the manifest identity.`,
      );
    }
  }
}

function applyEventContent({
  workingSet,
  documentsById,
  eventIndex,
  input,
  sourceIdForUrl,
  changeDefinitions,
}: {
  workingSet: WorkingSet;
  documentsById: Map<string, SanityDocument>;
  eventIndex: EventIndex;
  input: LaunchEventContentInput;
  sourceIdForUrl: (url: string) => string;
  changeDefinitions: Map<
    string,
    Pick<LaunchChangeOccurrenceInput, "title" | "canonicalSummary" | "category">
  >;
}): WorkingDocument {
  let document = findEvent(eventIndex, input.target);
  if (!document) {
    document = createManifestEvent(workingSet, documentsById, input);
    indexEvent(eventIndex, document);
  } else if (input.identity) {
    assertIdentityMatchesExistingEvent(document, input.identity);
  }

  const citations = allOwnerCitations({
    ownerId: document.id,
    citations: input.citations,
    article: input.article,
    changes: input.changes,
    sourceIdForUrl,
  });
  if (input.summary !== undefined) {
    workingSet.set(document, "summary", input.summary.trim());
  }
  if (input.article) {
    workingSet.set(
      document,
      "articleBody",
      portableArticle(`${document.id}:article`, input.article, sourceIdForUrl),
    );
  }
  if (input.changes?.length) {
    for (const change of input.changes) {
      ensureChangeDocument(
        workingSet,
        change,
        sourceIdForUrl,
        changeDefinitions,
        input.editorialReview,
        input.provenanceStatus,
      );
    }
    workingSet.mergeChanges(
      document,
      input.changes.map((change) =>
        buildChangeOccurrence(document.id, change, sourceIdForUrl),
      ),
    );
  }
  publicationOverlay(workingSet, document, {
    citations,
    provenanceStatus: input.provenanceStatus,
    editorialReview: input.editorialReview,
    isIndexable: input.isIndexable,
  });
  return document;
}

function assertUniqueBuildIdentity(
  documents: SanityDocument[],
  id: string,
  platformId: string,
  buildNumber: string,
): void {
  const normalized = normalizedBuildNumber(buildNumber);
  const collision = documents.find(
    (document) =>
      document._type === "releaseBuild" &&
      document._id !== id &&
      referenceId(document.platform) === platformId &&
      stringValue(document.buildNumber)?.toUpperCase() === normalized,
  );
  if (collision) {
    throw new Error(
      `${platformId} build ${normalized} already exists as ${collision._id}.`,
    );
  }
}

function applyBuildContent({
  workingSet,
  documents,
  documentsById,
  eventIndex,
  input,
  sourceIdForUrl,
  changeDefinitions,
}: {
  workingSet: WorkingSet;
  documents: SanityDocument[];
  documentsById: Map<string, SanityDocument>;
  eventIndex: EventIndex;
  input: LaunchBuildContentInput;
  sourceIdForUrl: (url: string) => string;
  changeDefinitions: Map<
    string,
    Pick<LaunchChangeOccurrenceInput, "title" | "canonicalSummary" | "category">
  >;
}): WorkingDocument {
  assertReleaseParents(documentsById, input.releaseVersionId, input.platformId);
  const buildNumber = normalizedBuildNumber(input.buildNumber);
  const id = buildDocumentId(input.releaseVersionId, buildNumber);
  assertUniqueBuildIdentity(documents, id, input.platformId, buildNumber);
  const citations = allOwnerCitations({
    ownerId: id,
    citations: input.citations,
    article: input.article,
    changes: input.changes,
    sourceIdForUrl,
  });
  const document = workingSet.ensure(id, "releaseBuild", {
    _id: id,
    _type: "releaseBuild",
    releaseVersion: sanityReference(input.releaseVersionId),
    platform: sanityReference(input.platformId),
    buildNumber,
    slug: {
      _type: "slug",
      current: slugify(buildNumber),
    },
    availabilityState: "available",
    citations,
    provenanceStatus: "sourceLinked",
    editorialReview: {
      _type: "editorialReview",
      status: "draft",
    },
    isIndexable: false,
  });
  assertFieldIdentity(
    workingSet,
    document,
    "releaseVersion",
    sanityReference(input.releaseVersionId),
  );
  assertFieldIdentity(
    workingSet,
    document,
    "platform",
    sanityReference(input.platformId),
  );
  const currentBuildNumber = stringValue(document.value.buildNumber);
  if (currentBuildNumber && currentBuildNumber.toUpperCase() !== buildNumber) {
    throw new Error(`${id}.buildNumber conflicts with ${buildNumber}.`);
  }
  workingSet.fill(document, "buildNumber", buildNumber);
  workingSet.fill(document, "slug", {
    _type: "slug",
    current: slugify(buildNumber),
  });
  workingSet.fill(document, "availabilityState", "available");

  if (input.summary !== undefined) {
    workingSet.set(document, "summary", input.summary.trim());
  }
  if (input.article) {
    workingSet.set(
      document,
      "articleBody",
      portableArticle(`${document.id}:article`, input.article, sourceIdForUrl),
    );
  }
  if (input.changes?.length) {
    for (const change of input.changes) {
      ensureChangeDocument(
        workingSet,
        change,
        sourceIdForUrl,
        changeDefinitions,
        input.editorialReview,
        input.provenanceStatus,
      );
    }
    workingSet.mergeChanges(
      document,
      input.changes.map((change) =>
        buildChangeOccurrence(document.id, change, sourceIdForUrl),
      ),
    );
  }
  workingSet.fill(document, "editorialReview", {
    _type: "editorialReview",
    status: "draft",
  });
  workingSet.fill(document, "isIndexable", false);
  publicationOverlay(workingSet, document, {
    citations,
    provenanceStatus: input.provenanceStatus || "sourceLinked",
    editorialReview: input.editorialReview,
    isIndexable: input.isIndexable,
  });

  for (const target of input.eventTargets || []) {
    const event = findEvent(eventIndex, target);
    if (!event) {
      throw new Error(
        `Build ${buildNumber} references unknown event ${stableStringify(target)}.`,
      );
    }
    const eventVersionId = referenceId(event.value.releaseVersion);
    const eventPlatformId = referenceId(event.value.platform);
    if (
      eventVersionId !== input.releaseVersionId ||
      eventPlatformId !== input.platformId
    ) {
      throw new Error(
        `${event.id} cannot link to build ${id} because its parent version/platform differs.`,
      );
    }
    const currentBuildId = referenceId(event.value.build);
    if (currentBuildId && currentBuildId !== id) {
      throw new Error(
        `${event.id} already links to a different build ${currentBuildId}.`,
      );
    }
    workingSet.set(event, "build", sanityReference(id));
  }
  return document;
}

function citationSourceIds(document: SanityDocument): string[] {
  return asArray(document.citations)
    .map((citation) =>
      isRecord(citation) ? referenceId(citation.source) : undefined,
    )
    .filter((value): value is string => Boolean(value));
}

function validatePortableArticleSources(
  document: SanityDocument,
  field: "overview" | "articleBody",
  sourceIds: Set<string>,
): void {
  for (const [blockIndex, block] of asArray(document[field]).entries()) {
    if (!isRecord(block) || block._type !== "block") continue;
    const markKeys = new Set(
      asArray(block.children).flatMap((child) =>
        isRecord(child)
          ? asArray(child.marks).filter(
              (mark): mark is string => typeof mark === "string",
            )
          : [],
      ),
    );
    for (const [markIndex, mark] of asArray(block.markDefs).entries()) {
      if (!isRecord(mark) || mark._type !== "citation") continue;
      const sourceId = referenceId(mark.source);
      if (!sourceId || !sourceIds.has(sourceId)) {
        throw new Error(
          `${document._id}.${field}[${blockIndex}].markDefs[${markIndex}] references a missing source.`,
        );
      }
      if (!stringValue(mark._key) || !markKeys.has(String(mark._key))) {
        throw new Error(
          `${document._id}.${field}[${blockIndex}] contains an unapplied citation annotation.`,
        );
      }
    }
  }
}

function validateChangeOccurrences(
  document: SanityDocument,
  sourceIds: Set<string>,
  changeIds: Set<string>,
): void {
  for (const [index, occurrence] of asArray(document.changes).entries()) {
    if (!isRecord(occurrence)) {
      throw new Error(`${document._id}.changes[${index}] is invalid.`);
    }
    const changeId = referenceId(occurrence.change);
    if (!changeId || !changeIds.has(changeId)) {
      throw new Error(
        `${document._id}.changes[${index}] references a missing releaseChange.`,
      );
    }
    const citations = asArray(occurrence.citations);
    if (!citations.length) {
      throw new Error(`${document._id}.changes[${index}] needs a citation.`);
    }
    const occurrenceSourceIds = new Set<string>();
    for (const citation of citations) {
      const sourceId = isRecord(citation)
        ? referenceId(citation.source)
        : undefined;
      if (!sourceId || !sourceIds.has(sourceId)) {
        throw new Error(
          `${document._id}.changes[${index}] references a missing source.`,
        );
      }
      occurrenceSourceIds.add(sourceId);
    }
    if (
      occurrence.evidenceState === "corroborated" &&
      occurrenceSourceIds.size < 2 &&
      !stringValue(occurrence.verificationMethod)
    ) {
      throw new Error(
        `${document._id}.changes[${index}] needs two sources or a verification method for corroborated evidence.`,
      );
    }
  }
}

function validatePublicationState(
  document: SanityDocument,
  sourceIds: Set<string>,
): void {
  const review = isRecord(document.editorialReview)
    ? document.editorialReview
    : undefined;
  const reviewStatus = stringValue(review?.status);
  const citations = citationSourceIds(document);
  const provenance = stringValue(document.provenanceStatus);

  if (reviewStatus && !allowedReviewStatuses.has(reviewStatus)) {
    throw new Error(`${document._id}.editorialReview.status is invalid.`);
  }
  if (
    ["approved", "rejected"].includes(reviewStatus || "") &&
    !isIsoDateTime(String(review?.reviewedAt || ""))
  ) {
    throw new Error(
      `${document._id} needs editorialReview.reviewedAt for ${reviewStatus}.`,
    );
  }
  if (reviewStatus === "approved" && citations.length === 0) {
    throw new Error(`${document._id} cannot be approved without citations.`);
  }
  if (provenance && !allowedProvenanceStatuses.has(provenance)) {
    throw new Error(`${document._id}.provenanceStatus is invalid.`);
  }
  if (
    ["sourceLinked", "editoriallyVerified"].includes(provenance || "") &&
    citations.length === 0
  ) {
    throw new Error(`${document._id} is ${provenance} but has no citations.`);
  }
  if (
    provenance === "auditVerified" &&
    asArray(document.auditBatches).length === 0
  ) {
    throw new Error(`${document._id} is auditVerified but has no audit batch.`);
  }
  if (provenance === "editoriallyVerified" && reviewStatus !== "approved") {
    throw new Error(
      `${document._id} is editoriallyVerified but is not approved.`,
    );
  }
  for (const sourceId of citations) {
    if (!sourceIds.has(sourceId)) {
      throw new Error(`${document._id} references missing source ${sourceId}.`);
    }
  }
  if (document.isIndexable === true) {
    if (reviewStatus !== "approved") {
      throw new Error(`${document._id} cannot be indexable before approval.`);
    }
    if (!["sourceLinked", "editoriallyVerified"].includes(provenance || "")) {
      throw new Error(
        `${document._id} cannot be indexable with ${provenance || "missing"} provenance.`,
      );
    }
    if (!citations.length) {
      throw new Error(`${document._id} cannot be indexable without citations.`);
    }
    if (
      asArray(document.articleBody).length === 0 &&
      asArray(document.changes).length === 0
    ) {
      throw new Error(
        `${document._id} cannot be indexable without an article or substantive change.`,
      );
    }
  }
}

function validateEffectiveDocuments(documents: SanityDocument[]): void {
  const ids = new Set(documents.map((document) => document._id));
  const sourceIds = new Set(
    documents
      .filter((document) => document._type === "source")
      .map((document) => document._id),
  );
  const changeIds = new Set(
    documents
      .filter((document) => document._type === "releaseChange")
      .map((document) => document._id),
  );
  const eventAliases = new Set<string>();
  const buildIdentities = new Set<string>();

  for (const document of documents) {
    if (document._type === "source") {
      const url = normalizeSourceUrl(
        String(document.canonicalUrl || ""),
        `${document._id}.canonicalUrl`,
      );
      if (/\/tutorials\/data\/.*\.json(?:$|\?)/i.test(url)) {
        throw new Error(
          `${document._id}.canonicalUrl exposes a DocC transport URL.`,
        );
      }
      if (
        !stringValue(document.title) ||
        !stringValue(document.publisher) ||
        !allowedSourceClasses.has(String(document.sourceClass || "")) ||
        !isIsoDate(String(document.accessedAt || ""))
      ) {
        throw new Error(`${document._id} is missing required source metadata.`);
      }
      continue;
    }

    if (
      [
        "releaseVersion",
        "releaseEvent",
        "releaseBuild",
        "releaseChange",
      ].includes(document._type)
    ) {
      validatePublicationState(document, sourceIds);
    }
    if (document._type === "releaseVersion") {
      validatePortableArticleSources(document, "overview", sourceIds);
    }
    if (document._type === "releaseEvent") {
      const releaseVersionId = referenceId(document.releaseVersion);
      const platformId = referenceId(document.platform);
      if (
        !releaseVersionId ||
        !ids.has(releaseVersionId) ||
        !platformId ||
        !ids.has(platformId) ||
        !stringValue(document.stableEventId) ||
        !stringValue(document.label) ||
        !isIsoDate(String(document.appearanceDate || ""))
      ) {
        throw new Error(
          `${document._id} is missing required releaseEvent identity fields.`,
        );
      }
      const routeAlias = isRecord(document.routeAlias)
        ? stringValue(document.routeAlias.current)
        : undefined;
      if (!routeAlias) {
        throw new Error(`${document._id} is missing routeAlias.current.`);
      }
      const aliasIdentity = `${releaseVersionId}\0${routeAlias}`;
      if (eventAliases.has(aliasIdentity)) {
        throw new Error(
          `${document._id} repeats version-scoped route alias ${routeAlias}.`,
        );
      }
      eventAliases.add(aliasIdentity);
      validatePortableArticleSources(document, "articleBody", sourceIds);
      validateChangeOccurrences(document, sourceIds, changeIds);
    }
    if (document._type === "releaseBuild") {
      const releaseVersionId = referenceId(document.releaseVersion);
      const platformId = referenceId(document.platform);
      const buildNumber = stringValue(document.buildNumber);
      if (
        !releaseVersionId ||
        !ids.has(releaseVersionId) ||
        !platformId ||
        !ids.has(platformId) ||
        !buildNumber
      ) {
        throw new Error(
          `${document._id} is missing required releaseBuild identity fields.`,
        );
      }
      const buildIdentity = `${platformId}\0${normalizedBuildNumber(
        buildNumber,
      )}`;
      if (buildIdentities.has(buildIdentity)) {
        throw new Error(
          `${document._id} repeats platform build ${buildNumber}.`,
        );
      }
      buildIdentities.add(buildIdentity);
      if (citationSourceIds(document).length === 0) {
        throw new Error(`${document._id} cannot be emitted without citations.`);
      }
      validatePortableArticleSources(document, "articleBody", sourceIds);
      validateChangeOccurrences(document, sourceIds, changeIds);
    }
    if (document._type === "releaseChange") {
      if (
        !stringValue(document.title) ||
        !stringValue(document.canonicalSummary) ||
        !allowedChangeCategories.has(String(document.category || ""))
      ) {
        throw new Error(
          `${document._id} is missing required releaseChange fields.`,
        );
      }
    }
  }
}

function stripMutableSystemFields(document: SanityDocument): SanityDocument {
  const result = cloneJson(document);
  delete result._rev;
  delete result._createdAt;
  delete result._updatedAt;
  return result;
}

function planMutations(workingSet: WorkingSet): {
  creates: LaunchCreateMutation[];
  patches: LaunchPatchMutation[];
  unchangedDocumentIds: string[];
} {
  const creates: LaunchCreateMutation[] = [];
  const patches: LaunchPatchMutation[] = [];
  const unchangedDocumentIds: string[] = [];

  for (const working of workingSet.values()) {
    if (!working.existing) {
      creates.push({
        document: stripMutableSystemFields(working.value),
      });
      continue;
    }
    const set: UnknownRecord = {};
    for (const field of [...working.touched].sort()) {
      if (
        ["_id", "_type", "_rev", "_createdAt", "_updatedAt"].includes(field)
      ) {
        throw new Error(
          `${working.id} attempted to mutate protected field ${field}.`,
        );
      }
      if (!exactEqual(working.existing[field], working.value[field])) {
        set[field] = cloneJson(working.value[field]);
      }
    }
    if (Object.keys(set).length === 0) {
      unchangedDocumentIds.push(working.id);
      continue;
    }
    if (!working.existing._rev) {
      throw new Error(`${working.id} needs _rev for a revision-guarded patch.`);
    }
    patches.push({
      id: working.id,
      ifRevisionId: working.existing._rev,
      set,
    });
  }

  creates.sort((left, right) =>
    left.document._id.localeCompare(right.document._id),
  );
  patches.sort((left, right) => left.id.localeCompare(right.id));
  unchangedDocumentIds.sort();
  return { creates, patches, unchangedDocumentIds };
}

function effectiveDocuments(
  snapshot: SanityDocument[],
  mutations: {
    creates: LaunchCreateMutation[];
    patches: LaunchPatchMutation[];
  },
): SanityDocument[] {
  const byId = new Map(
    snapshot.map((document) => [document._id, cloneJson(document)]),
  );
  for (const create of mutations.creates) {
    if (byId.has(create.document._id)) {
      throw new Error(
        `Create ${create.document._id} already exists in the snapshot.`,
      );
    }
    byId.set(create.document._id, cloneJson(create.document));
  }
  for (const patch of mutations.patches) {
    const current = byId.get(patch.id);
    if (!current) {
      throw new Error(`Patch ${patch.id} has no before document.`);
    }
    Object.assign(current, cloneJson(patch.set));
  }
  return [...byId.values()].sort((left, right) =>
    left._id.localeCompare(right._id),
  );
}

function buildRollbackSnapshot(
  plan: LaunchContentPlan,
  snapshotById: Map<string, SanityDocument>,
): LaunchRollbackSnapshot {
  const restoreDocuments = plan.patches.map((patch) => {
    const document = snapshotById.get(patch.id);
    if (!document) {
      throw new Error(
        `Rollback snapshot is missing patched document ${patch.id}.`,
      );
    }
    if (document._rev !== patch.ifRevisionId) {
      throw new Error(`Rollback revision mismatch for ${patch.id}.`);
    }
    return cloneJson(document);
  });
  const withoutDigest = {
    artifactType: "sanity-launch-content-rollback" as const,
    formatVersion: 1 as const,
    projectId: plan.projectId,
    dataset: plan.dataset,
    planDigest: plan.planDigest,
    sourceSnapshotDigest: plan.sourceSnapshotDigest,
    createdDocumentIds: plan.creates.map((create) => create.document._id),
    restoreDocuments,
    instructions: [
      "This artifact never performs rollback writes by itself.",
      "Delete only createdDocumentIds after verifying their post-apply revisions.",
      "Restore only non-system fields from restoreDocuments and guard each patch with the current post-apply revision.",
      "Never submit historical _rev, _createdAt, or _updatedAt as mutation fields.",
    ],
  };
  return {
    ...withoutDigest,
    rollbackDigest: sha256(stableStringify(withoutDigest)),
  };
}

function assertMutationCaps(plan: LaunchContentPlan): void {
  if (plan.creates.length > 5_000) {
    throw new Error(
      `Launch plan has ${plan.creates.length} creates; the safety cap is 5,000.`,
    );
  }
  if (plan.patches.length > 5_000) {
    throw new Error(
      `Launch plan has ${plan.patches.length} patches; the safety cap is 5,000.`,
    );
  }
  if (plan.creates.length + plan.patches.length > 7_500) {
    throw new Error("Launch plan exceeds the 7,500-mutation safety cap.");
  }
}

export function buildLaunchContentPlan(
  snapshotInput: unknown,
  bundle: LaunchContentBundle,
): LaunchContentPlanResult {
  assertLaunchContentBundle(bundle);
  const documents = extractSnapshotDocuments(snapshotInput);
  const documentsById = new Map(
    documents.map((document) => [document._id, document]),
  );
  const versions = extractLegacyReleaseVersions({
    documents: documents.map((document) =>
      document._type === "releaseVersion" && !Array.isArray(document.milestones)
        ? { ...document, milestones: [] }
        : document,
    ),
  });
  const migrationPlan = buildReleaseEventMigrationPlan(versions);
  assertValidReleaseEventMigration(versions, migrationPlan);
  const workingSet = new WorkingSet(documents);
  const sourceRegistry = buildSourceRegistry({
    documents,
    versions,
    bundle,
    workingSet,
  });
  const sourceIdForUrl = sourceIdResolver(sourceRegistry);

  const buildCitationMappings: Record<string, string[]> = {};
  for (const build of migrationPlan.builds) {
    const sourceIds = migrationPlan.events
      .filter((event) => event.proposedBuildRef === build._id)
      .map((event) =>
        event.sourceUrl ? sourceIdForUrl(event.sourceUrl) : undefined,
      )
      .filter((value): value is string => Boolean(value));
    if (sourceIds.length) {
      buildCitationMappings[build._id] = [...new Set(sourceIds)].sort();
    }
  }
  const schemaProjection = projectSchemaReadyMigration(migrationPlan, {
    approvedBuildCitationSourceIds: buildCitationMappings,
  });
  assertValidSchemaReadyMigration(migrationPlan, schemaProjection);

  const candidateById = new Map(
    migrationPlan.events.map((event) => [event._id, event]),
  );
  for (const event of schemaProjection.releaseEvents) {
    const candidate = candidateById.get(event._id);
    const citations = candidate?.sourceUrl
      ? citationsForInputs(
          event._id,
          [
            {
              url: candidate.sourceUrl,
              ...(candidate.sourceLabel
                ? {
                    note: `Legacy chronology source: ${candidate.sourceLabel}`,
                  }
                : {}),
            },
          ],
          sourceIdForUrl,
        )
      : [];
    applyMigrationEvent(workingSet, event, citations);
  }
  for (const build of schemaProjection.releaseBuilds) {
    applyMigrationBuild(workingSet, build);
  }
  applyReleaseStatusNormalizations(workingSet, migrationPlan);

  const eventIndex = createEventIndex(documents, workingSet);
  const changeDefinitions = new Map<
    string,
    Pick<LaunchChangeOccurrenceInput, "title" | "canonicalSummary" | "category">
  >();
  for (const version of bundle.versions || []) {
    applyVersionContent(workingSet, documentsById, version, sourceIdForUrl);
  }
  for (const event of bundle.events || []) {
    applyEventContent({
      workingSet,
      documentsById,
      eventIndex,
      input: event,
      sourceIdForUrl,
      changeDefinitions,
    });
  }
  for (const build of bundle.builds || []) {
    applyBuildContent({
      workingSet,
      documents,
      documentsById,
      eventIndex,
      input: build,
      sourceIdForUrl,
      changeDefinitions,
    });
  }

  const mutations = planMutations(workingSet);
  validateEffectiveDocuments(effectiveDocuments(documents, mutations));
  const sourceSnapshotDigest = sha256(stableStringify(documents));
  const contentDigest = sha256(stableStringify(bundle));
  const summary = {
    creates: mutations.creates.length,
    patches: mutations.patches.length,
    unchanged: mutations.unchangedDocumentIds.length,
    sourceCreates: mutations.creates.filter(
      (create) => create.document._type === "source",
    ).length,
    versionCreates: mutations.creates.filter(
      (create) => create.document._type === "releaseVersion",
    ).length,
    eventCreates: mutations.creates.filter(
      (create) => create.document._type === "releaseEvent",
    ).length,
    buildCreates: mutations.creates.filter(
      (create) => create.document._type === "releaseBuild",
    ).length,
    changeCreates: mutations.creates.filter(
      (create) => create.document._type === "releaseChange",
    ).length,
    versionPatches: mutations.patches.filter(
      (patch) => documentsById.get(patch.id)?._type === "releaseVersion",
    ).length,
  };
  const withoutDigest = {
    formatVersion: 1 as const,
    projectId: LAUNCH_CONTENT_PROJECT_ID,
    dataset: LAUNCH_CONTENT_DATASET,
    sourceSnapshotDigest,
    contentDigest,
    migrationPlanDigest: migrationPlan.planDigest,
    creates: mutations.creates,
    patches: mutations.patches,
    unchangedDocumentIds: mutations.unchangedDocumentIds,
    summary,
  };
  const plan: LaunchContentPlan = {
    ...withoutDigest,
    planDigest: sha256(stableStringify(withoutDigest)),
  };
  assertMutationCaps(plan);
  const rollback = buildRollbackSnapshot(plan, documentsById);
  return { plan, rollback, migrationPlan };
}

export function validateLaunchContentPlan(
  plan: LaunchContentPlan,
  rollback: LaunchRollbackSnapshot,
): string[] {
  const failures: string[] = [];
  const planWithoutDigest = {
    formatVersion: plan.formatVersion,
    projectId: plan.projectId,
    dataset: plan.dataset,
    sourceSnapshotDigest: plan.sourceSnapshotDigest,
    contentDigest: plan.contentDigest,
    migrationPlanDigest: plan.migrationPlanDigest,
    creates: plan.creates,
    patches: plan.patches,
    unchangedDocumentIds: plan.unchangedDocumentIds,
    summary: plan.summary,
  };
  if (plan.planDigest !== sha256(stableStringify(planWithoutDigest))) {
    failures.push("planDigest does not match the mutation plan");
  }
  if (
    plan.projectId !== LAUNCH_CONTENT_PROJECT_ID ||
    plan.dataset !== LAUNCH_CONTENT_DATASET
  ) {
    failures.push("plan target is not the exact public project/dataset");
  }
  if (
    new Set(plan.creates.map((create) => create.document._id)).size !==
    plan.creates.length
  ) {
    failures.push("create IDs are not unique");
  }
  if (
    new Set(plan.patches.map((patch) => patch.id)).size !== plan.patches.length
  ) {
    failures.push("patch IDs are not unique");
  }
  if (
    plan.patches.some(
      (patch) =>
        !patch.ifRevisionId ||
        Object.keys(patch.set).some((field) =>
          ["_id", "_type", "_rev", "_createdAt", "_updatedAt"].includes(field),
        ),
    )
  ) {
    failures.push("patches are not revision-guarded field overlays");
  }
  if (
    rollback.planDigest !== plan.planDigest ||
    rollback.projectId !== plan.projectId ||
    rollback.dataset !== plan.dataset ||
    rollback.createdDocumentIds.length !== plan.creates.length ||
    rollback.restoreDocuments.length !== plan.patches.length
  ) {
    failures.push("rollback snapshot does not cover the exact plan");
  }
  const rollbackWithoutDigest = {
    artifactType: rollback.artifactType,
    formatVersion: rollback.formatVersion,
    projectId: rollback.projectId,
    dataset: rollback.dataset,
    planDigest: rollback.planDigest,
    sourceSnapshotDigest: rollback.sourceSnapshotDigest,
    createdDocumentIds: rollback.createdDocumentIds,
    restoreDocuments: rollback.restoreDocuments,
    instructions: rollback.instructions,
  };
  if (
    rollback.rollbackDigest !== sha256(stableStringify(rollbackWithoutDigest))
  ) {
    failures.push("rollbackDigest does not match the rollback snapshot");
  }
  return failures;
}

export function assertValidLaunchContentPlan(
  plan: LaunchContentPlan,
  rollback: LaunchRollbackSnapshot,
): void {
  const failures = validateLaunchContentPlan(plan, rollback);
  if (failures.length) {
    throw new Error(
      `Launch content plan is invalid:\n${failures
        .map((failure) => `- ${failure}`)
        .join("\n")}`,
    );
  }
}

export function applyLaunchPlanToSnapshotForTest(
  snapshotInput: unknown,
  plan: LaunchContentPlan,
): SanityDocument[] {
  const documents = extractSnapshotDocuments(snapshotInput);
  const byId = new Map(
    documents.map((document) => [document._id, cloneJson(document)]),
  );
  for (const create of plan.creates) {
    if (byId.has(create.document._id)) {
      throw new Error(`${create.document._id} already exists.`);
    }
    byId.set(create.document._id, {
      ...cloneJson(create.document),
      _rev: `test-${compactHash(create.document._id)}`,
    });
  }
  for (const patch of plan.patches) {
    const current = byId.get(patch.id);
    if (!current || current._rev !== patch.ifRevisionId) {
      throw new Error(`${patch.id} failed its test revision guard.`);
    }
    Object.assign(current, cloneJson(patch.set));
    current._rev = `test-${compactHash(
      `${patch.id}\0${stableStringify(patch.set)}`,
    )}`;
  }
  return [...byId.values()].sort((left, right) =>
    left._id.localeCompare(right._id),
  );
}

export function deterministicLaunchIdsForTest(input: {
  sourceUrl?: string;
  stableEventId?: string;
  releaseVersionId?: string;
  buildNumber?: string;
  changeKey?: string;
}): {
  sourceId?: string;
  eventId?: string;
  buildId?: string;
  changeId?: string;
} {
  return {
    ...(input.sourceUrl ? { sourceId: sourceDocumentId(input.sourceUrl) } : {}),
    ...(input.stableEventId
      ? { eventId: eventDocumentId(input.stableEventId) }
      : {}),
    ...(input.releaseVersionId && input.buildNumber
      ? {
          buildId: buildDocumentId(input.releaseVersionId, input.buildNumber),
        }
      : {}),
    ...(input.changeKey ? { changeId: changeDocumentId(input.changeKey) } : {}),
  };
}
