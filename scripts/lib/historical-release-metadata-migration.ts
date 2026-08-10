import { createHash } from "node:crypto";

import { historicalReleaseMetadataDocumentId } from "../../src/lib/historical-release-metadata-id";
import {
  historicalAnalyticalSourceDigest,
  projectHistoricalAnalyticalSourceFromSnapshot,
} from "./historical-analytical-source-binding";
import { stableStringify } from "./release-event-migration";

type UnknownRecord = Record<string, unknown>;

const DOCUMENT_ID_PATTERN = /^[A-Za-z0-9][A-Za-z0-9_.-]*$/;
const STABLE_IDENTITY_PATTERN = /^[A-Za-z0-9][A-Za-z0-9._:-]*$/;
const RELEASE_CLASSES = new Set(["major", "minor", "patch"]);
const UNKNOWN_COVERAGE_REASONS = new Set([
  "not-reviewed",
  "source-coverage-incomplete",
  "same-day-order-unknown",
]);
const EVIDENCE_TYPES = new Set(["source", "auditBatch"]);
export const HISTORICAL_ANALYTICAL_SNAPSHOT_TYPES = [
  "auditBatch",
  "historicalReleaseMetadata",
  "platform",
  "releaseEvent",
  "releaseTrain",
  "releaseVersion",
  "source",
] as const;
const HISTORICAL_ANALYTICAL_SNAPSHOT_TYPE_SET = new Set<string>(
  HISTORICAL_ANALYTICAL_SNAPSHOT_TYPES,
);
const MANAGED_FIELDS = [
  "releaseVersion",
  "productFamilyId",
  "releaseClass",
  "releasePosition",
  "releaseCycleId",
  "metadataEvidence",
  "chronologyCoverage",
] as const;
const MUTABLE_SYSTEM_FIELDS = new Set(["_rev", "_createdAt", "_updatedAt"]);

export interface HistoricalMetadataSnapshotDocument extends UnknownRecord {
  _id: string;
  _type: string;
  _rev?: string;
}

export interface CuratedEvidenceReference {
  id: string;
  expectedRevision: string;
}

export interface CuratedMetadataEvidence {
  productFamily: CuratedEvidenceReference[];
  releaseClass: CuratedEvidenceReference[];
  releasePosition: CuratedEvidenceReference[];
  releaseCycle: CuratedEvidenceReference[];
}

export interface CuratedHistoricalMetadataEntry {
  metadataId: string;
  releaseVersionId: string;
  expectedReleaseVersionRevision: string;
  expectedReleaseTrainRevision: string;
  platformId: string;
  expectedPlatformRevision: string;
  expectedMetadataRevision: string | null;
  productFamilyId: string;
  releaseClass: "major" | "minor" | "patch";
  releasePosition: number;
  releaseCycleId: string;
  metadataEvidence: CuratedMetadataEvidence;
  chronologyCoverage:
    | {
        state: "complete";
        evidence: CuratedEvidenceReference[];
      }
    | {
        state: "unknown";
        reason:
          | "not-reviewed"
          | "source-coverage-incomplete"
          | "same-day-order-unknown";
        evidence: CuratedEvidenceReference[];
      };
  statusFirstObservedAt?:
    | {
        strategy: "explicit";
        value: string;
        evidence: CuratedEvidenceReference[];
      }
    | {
        strategy: "sanity-created-at";
      };
}

export interface CuratedHistoricalMetadataManifest {
  formatVersion: 1;
  entries: CuratedHistoricalMetadataEntry[];
}

export interface HistoricalMetadataMutation {
  action: "create" | "patch";
  id: string;
  releaseVersionId: string;
  releaseVersionRevision: string;
  releaseTrainId: string;
  releaseTrainRevision: string;
  platformId: string;
  platformRevision: string;
  ifRevisionId: string | null;
  metadataEvidence: CuratedMetadataEvidence;
  chronologyEvidence: CuratedEvidenceReference[];
  before: HistoricalMetadataSnapshotDocument | null;
  /** Exact expected writable document body; Sanity-managed timestamps/revision are excluded. */
  after: HistoricalMetadataSnapshotDocument;
  set: UnknownRecord;
  unset: string[];
}

export interface HistoricalReleaseMetadataPlan {
  artifactType: "sanity-historical-release-metadata-plan";
  formatVersion: 1;
  sourceSnapshotDigest: string;
  analyticalSnapshot: {
    documentTypes: typeof HISTORICAL_ANALYTICAL_SNAPSHOT_TYPES;
    revisions: HistoricalAnalyticalSnapshotRevision[];
    projectedSourceDigest: string;
  };
  curatedManifestDigest: string;
  planDigest: string;
  mutations: HistoricalMetadataMutation[];
  lifecycleObservationPatches: HistoricalLifecycleObservationPatch[];
  summary: {
    entries: number;
    creates: number;
    patches: number;
    lifecycleObservationPatches: number;
    metadataEvidenceReferences: number;
    chronologyEvidenceReferences: number;
    statusObservationEvidenceReferences: number;
  };
}

export interface HistoricalAnalyticalSnapshotRevision {
  id: string;
  documentType: (typeof HISTORICAL_ANALYTICAL_SNAPSHOT_TYPES)[number];
  expectedRevision: string;
}

export interface HistoricalLifecycleObservationPatch {
  id: string;
  ifRevisionId: string;
  basis: "explicit" | "sanity-created-at";
  evidence: HistoricalLifecycleObservationEvidence[];
  before: HistoricalMetadataSnapshotDocument;
  after: HistoricalMetadataSnapshotDocument;
  set: { statusFirstObservedAt: string };
  unset: string[];
}

export interface HistoricalLifecycleObservationEvidence
  extends CuratedEvidenceReference {
  documentType: "source" | "auditBatch";
  availableAt: string;
  availabilityBasis: "publishedAt" | "accessedAt" | "verifiedAt";
}

export interface HistoricalMetadataRollbackMutation {
  action: "delete-created" | "restore-patch";
  id: string;
  /** Recovery must replace this placeholder with the current post-apply revision. */
  requireCurrentPostApplyRevision: true;
  set: UnknownRecord;
  unset: string[];
}

export interface HistoricalReleaseMetadataRollback {
  artifactType: "sanity-historical-release-metadata-rollback";
  formatVersion: 1;
  planDigest: string;
  sourceSnapshotDigest: string;
  restoreMutations: HistoricalMetadataRollbackMutation[];
  instructions: string[];
  rollbackDigest: string;
}

export interface HistoricalReleaseMetadataPlanResult {
  plan: HistoricalReleaseMetadataPlan;
  rollback: HistoricalReleaseMetadataRollback;
}

export class HistoricalReleaseMetadataNoopPlanError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "HistoricalReleaseMetadataNoopPlanError";
  }
}

export interface HistoricalReleaseMetadataPlanOptions {
  /** Reserved for the guarded post-apply zero-residual proof. */
  allowNoopEntries?: boolean;
}

function isRecord(value: unknown): value is UnknownRecord {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function assertExactKeys(
  value: UnknownRecord,
  allowed: readonly string[],
  path: string,
): void {
  const unknown = Object.keys(value)
    .filter((key) => !allowed.includes(key))
    .sort(compareText);
  if (unknown.length) {
    throw new Error(`${path} contains unknown propert${unknown.length === 1 ? "y" : "ies"}: ${unknown.join(", ")}.`);
  }
}

function cloneJson<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

function sha256(value: unknown): string {
  const serialized = typeof value === "string" ? value : stableStringify(value);
  return createHash("sha256").update(serialized).digest("hex");
}

function compareText(left: string, right: string): -1 | 0 | 1 {
  return left < right ? -1 : left > right ? 1 : 0;
}

function exactEqualDocumentBody(left: unknown, right: unknown): boolean {
  return stableStringify(left) === stableStringify(right);
}

function requiredString(value: unknown, path: string): string {
  if (typeof value !== "string" || !value.trim()) {
    throw new Error(`${path} must be a non-empty string.`);
  }
  return value.trim();
}

function optionalString(value: unknown): string | undefined {
  return typeof value === "string" && value.trim() ? value.trim() : undefined;
}

function validDocumentId(value: string, path: string): string {
  if (
    !DOCUMENT_ID_PATTERN.test(value) ||
    value.startsWith("drafts.") ||
    value.length > 128
  ) {
    throw new Error(`${path} is not a safe published Sanity document ID.`);
  }
  return value;
}

function stableIdentity(value: unknown, path: string): string {
  const normalized = requiredString(value, path);
  if (normalized.length > 220 || !STABLE_IDENTITY_PATTERN.test(normalized)) {
    throw new Error(
      `${path} must be a stable identity using letters, numbers, dot, underscore, colon, or hyphen.`,
    );
  }
  return normalized;
}

function referenceId(value: unknown): string | undefined {
  return isRecord(value) && typeof value._ref === "string" && value._ref.trim()
    ? value._ref.trim()
    : undefined;
}

function evidenceReferencesMatch(
  evidence: CuratedEvidenceReference[],
  projectedReferences: unknown,
): boolean {
  if (!Array.isArray(projectedReferences) || evidence.length === 0) return false;
  const expectedIds = evidence.map(({ id, expectedRevision }) =>
    DOCUMENT_ID_PATTERN.test(id) &&
    !id.startsWith("drafts.") &&
    id.length <= 128 &&
    expectedRevision.trim()
      ? id
      : null,
  );
  const projectedIds = projectedReferences.map(referenceId);
  return (
    expectedIds.every((id): id is string => id !== null) &&
    new Set(expectedIds).size === expectedIds.length &&
    exactEqualDocumentBody(projectedIds, expectedIds)
  );
}

function revisionOf(document: HistoricalMetadataSnapshotDocument, path: string): string {
  return requiredString(document._rev, `${path}._rev`);
}

function normalizedEvidence(
  value: unknown,
  path: string,
): CuratedEvidenceReference[] {
  if (!Array.isArray(value) || value.length === 0) {
    throw new Error(`${path} must contain one or more explicit evidence references.`);
  }
  const normalized = value.map((candidate, index) => {
    if (!isRecord(candidate)) {
      throw new Error(`${path}[${index}] must be an object.`);
    }
    assertExactKeys(
      candidate,
      ["id", "expectedRevision"],
      `${path}[${index}]`,
    );
    return {
      id: validDocumentId(
        requiredString(candidate.id, `${path}[${index}].id`),
        `${path}[${index}].id`,
      ),
      expectedRevision: requiredString(
        candidate.expectedRevision,
        `${path}[${index}].expectedRevision`,
      ),
    };
  });
  normalized.sort((left, right) => compareText(left.id, right.id));
  if (new Set(normalized.map(({ id }) => id)).size !== normalized.length) {
    throw new Error(`${path} contains duplicate evidence document IDs.`);
  }
  return normalized;
}

function normalizedMetadataEvidence(
  value: unknown,
  path: string,
): CuratedMetadataEvidence {
  if (!isRecord(value)) {
    throw new Error(`${path} must be an object with assertion-scoped evidence.`);
  }
  assertExactKeys(
    value,
    ["productFamily", "releaseClass", "releasePosition", "releaseCycle"],
    path,
  );
  return {
    productFamily: normalizedEvidence(
      value.productFamily,
      `${path}.productFamily`,
    ),
    releaseClass: normalizedEvidence(value.releaseClass, `${path}.releaseClass`),
    releasePosition: normalizedEvidence(
      value.releasePosition,
      `${path}.releasePosition`,
    ),
    releaseCycle: normalizedEvidence(value.releaseCycle, `${path}.releaseCycle`),
  };
}

function isIsoDay(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const parsed = new Date(`${value}T00:00:00.000Z`);
  return (
    Number.isFinite(parsed.getTime()) &&
    parsed.toISOString().slice(0, 10) === value
  );
}

function isIsoInstant(value: string): boolean {
  const match =
    /^(\d{4}-\d{2}-\d{2})T(\d{2}):(\d{2}):(\d{2})(?:\.\d+)?(Z|([+-])(\d{2}):(\d{2}))$/.exec(
      value,
    );
  if (!match || !isIsoDay(match[1])) return false;
  const hour = Number(match[2]);
  const minute = Number(match[3]);
  const second = Number(match[4]);
  const offsetHour = match[7] === undefined ? 0 : Number(match[7]);
  const offsetMinute = match[8] === undefined ? 0 : Number(match[8]);
  return (
    hour <= 23 &&
    minute <= 59 &&
    second <= 59 &&
    offsetHour <= 14 &&
    offsetMinute <= 59 &&
    (offsetHour < 14 || offsetMinute === 0) &&
    Number.isFinite(Date.parse(value))
  );
}

function normalizedStatusFirstObservedAt(
  value: unknown,
  path: string,
): CuratedHistoricalMetadataEntry["statusFirstObservedAt"] {
  if (value === undefined) return undefined;
  if (!isRecord(value)) {
    throw new Error(`${path} must be an explicit or sanity-created-at strategy.`);
  }
  const strategy = requiredString(value.strategy, `${path}.strategy`);
  if (strategy === "sanity-created-at") {
    assertExactKeys(value, ["strategy"], path);
    if (value.value !== undefined || value.evidence !== undefined) {
      throw new Error(
        `${path} sanity-created-at strategy cannot include a value or evidence override.`,
      );
    }
    return { strategy };
  }
  if (strategy !== "explicit") {
    throw new Error(`${path}.strategy must be explicit or sanity-created-at.`);
  }
  assertExactKeys(value, ["strategy", "value", "evidence"], path);
  const observedAt = requiredString(value.value, `${path}.value`);
  if (!isIsoInstant(observedAt)) {
    throw new Error(`${path}.value must be an ISO timestamp with an offset.`);
  }
  return {
    strategy,
    value: observedAt,
    evidence: normalizedEvidence(value.evidence, `${path}.evidence`),
  };
}

export function flattenedMetadataEvidence(
  evidence: CuratedMetadataEvidence,
): CuratedEvidenceReference[] {
  const byId = new Map<string, CuratedEvidenceReference>();
  for (const reference of [
    ...evidence.productFamily,
    ...evidence.releaseClass,
    ...evidence.releasePosition,
    ...evidence.releaseCycle,
  ]) {
    const prior = byId.get(reference.id);
    if (prior && prior.expectedRevision !== reference.expectedRevision) {
      throw new Error(
        `${reference.id} has conflicting curated evidence revisions across metadata scopes.`,
      );
    }
    byId.set(reference.id, reference);
  }
  return [...byId.values()].sort((left, right) => compareText(left.id, right.id));
}

function normalizeEntry(
  value: unknown,
  index: number,
): CuratedHistoricalMetadataEntry {
  if (!isRecord(value)) {
    throw new Error(`entries[${index}] must be an object.`);
  }
  const path = `entries[${index}]`;
  assertExactKeys(
    value,
    [
      "metadataId",
      "releaseVersionId",
      "expectedReleaseVersionRevision",
      "expectedReleaseTrainRevision",
      "platformId",
      "expectedPlatformRevision",
      "expectedMetadataRevision",
      "productFamilyId",
      "releaseClass",
      "releasePosition",
      "releaseCycleId",
      "metadataEvidence",
      "chronologyCoverage",
      "statusFirstObservedAt",
    ],
    path,
  );
  const releaseVersionId = validDocumentId(
    requiredString(value.releaseVersionId, `${path}.releaseVersionId`),
    `${path}.releaseVersionId`,
  );
  const metadataId = validDocumentId(
    requiredString(value.metadataId, `${path}.metadataId`),
    `${path}.metadataId`,
  );
  const expectedMetadataId = historicalReleaseMetadataId(releaseVersionId);
  if (metadataId !== expectedMetadataId) {
    throw new Error(
      `${path}.metadataId must be ${expectedMetadataId}; sidecar identity is release-version keyed.`,
    );
  }
  const expectedMetadataRevision = value.expectedMetadataRevision;
  if (
    expectedMetadataRevision !== null &&
    (typeof expectedMetadataRevision !== "string" ||
      !expectedMetadataRevision.trim())
  ) {
    throw new Error(`${path}.expectedMetadataRevision must be a revision or null.`);
  }
  const releaseClass = requiredString(value.releaseClass, `${path}.releaseClass`);
  if (!RELEASE_CLASSES.has(releaseClass)) {
    throw new Error(`${path}.releaseClass must be major, minor, or patch.`);
  }
  if (!Number.isSafeInteger(value.releasePosition) || Number(value.releasePosition) < 1) {
    throw new Error(`${path}.releasePosition must be a positive safe integer.`);
  }
  if (!isRecord(value.chronologyCoverage)) {
    throw new Error(`${path}.chronologyCoverage must be an object.`);
  }
  const state = requiredString(
    value.chronologyCoverage.state,
    `${path}.chronologyCoverage.state`,
  );
  if (state !== "complete" && state !== "unknown") {
    throw new Error(`${path}.chronologyCoverage.state must be complete or unknown.`);
  }
  const coverageEvidence = normalizedEvidence(
    value.chronologyCoverage.evidence,
    `${path}.chronologyCoverage.evidence`,
  );
  let chronologyCoverage: CuratedHistoricalMetadataEntry["chronologyCoverage"];
  if (state === "unknown") {
    assertExactKeys(
      value.chronologyCoverage,
      ["state", "reason", "evidence"],
      `${path}.chronologyCoverage`,
    );
    const reason = requiredString(
      value.chronologyCoverage.reason,
      `${path}.chronologyCoverage.reason`,
    );
    if (!UNKNOWN_COVERAGE_REASONS.has(reason)) {
      throw new Error(`${path}.chronologyCoverage.reason is not supported by FR-007.`);
    }
    chronologyCoverage = {
      state,
      reason: reason as Extract<
        CuratedHistoricalMetadataEntry["chronologyCoverage"],
        { state: "unknown" }
      >["reason"],
      evidence: coverageEvidence,
    };
  } else {
    assertExactKeys(
      value.chronologyCoverage,
      ["state", "evidence"],
      `${path}.chronologyCoverage`,
    );
    if (value.chronologyCoverage.reason !== undefined) {
      throw new Error(`${path}.chronologyCoverage.reason is allowed only for unknown coverage.`);
    }
    chronologyCoverage = { state, evidence: coverageEvidence };
  }
  return {
    metadataId,
    releaseVersionId,
    expectedReleaseVersionRevision: requiredString(
      value.expectedReleaseVersionRevision,
      `${path}.expectedReleaseVersionRevision`,
    ),
    expectedReleaseTrainRevision: requiredString(
      value.expectedReleaseTrainRevision,
      `${path}.expectedReleaseTrainRevision`,
    ),
    platformId: validDocumentId(
      requiredString(value.platformId, `${path}.platformId`),
      `${path}.platformId`,
    ),
    expectedPlatformRevision: requiredString(
      value.expectedPlatformRevision,
      `${path}.expectedPlatformRevision`,
    ),
    expectedMetadataRevision:
      expectedMetadataRevision === null ? null : expectedMetadataRevision.trim(),
    productFamilyId: stableIdentity(
      value.productFamilyId,
      `${path}.productFamilyId`,
    ),
    releaseClass: releaseClass as CuratedHistoricalMetadataEntry["releaseClass"],
    releasePosition: Number(value.releasePosition),
    releaseCycleId: stableIdentity(
      value.releaseCycleId,
      `${path}.releaseCycleId`,
    ),
    metadataEvidence: normalizedMetadataEvidence(
      value.metadataEvidence,
      `${path}.metadataEvidence`,
    ),
    chronologyCoverage,
    ...(value.statusFirstObservedAt === undefined
      ? {}
      : {
          statusFirstObservedAt: normalizedStatusFirstObservedAt(
            value.statusFirstObservedAt,
            `${path}.statusFirstObservedAt`,
          ),
        }),
  };
}

export function parseCuratedHistoricalMetadataManifest(
  input: unknown,
): CuratedHistoricalMetadataManifest {
  if (!isRecord(input) || input.formatVersion !== 1 || !Array.isArray(input.entries)) {
    throw new Error("Curated manifest must have formatVersion 1 and an entries array.");
  }
  assertExactKeys(input, ["formatVersion", "entries"], "Curated manifest");
  if (!input.entries.length) {
    throw new Error("Curated manifest contains no entries; no-op planning is blocked.");
  }
  const entries = input.entries.map(normalizeEntry);
  entries.sort((left, right) => compareText(left.metadataId, right.metadataId));
  if (new Set(entries.map(({ metadataId }) => metadataId)).size !== entries.length) {
    throw new Error("Curated manifest repeats a metadata document ID.");
  }
  if (
    new Set(entries.map(({ releaseVersionId }) => releaseVersionId)).size !==
    entries.length
  ) {
    throw new Error("Curated manifest repeats a releaseVersion ID.");
  }
  return { formatVersion: 1, entries };
}

export function extractHistoricalMetadataSnapshotDocuments(
  input: unknown,
): HistoricalMetadataSnapshotDocument[] {
  const envelope = isRecord(input) ? input : undefined;
  const candidates = Array.isArray(input)
    ? input
    : envelope && Array.isArray(envelope.documents)
      ? envelope.documents
      : envelope && Array.isArray(envelope.result)
        ? envelope.result
        : [];
  if (!candidates.length) {
    throw new Error("Published snapshot contains no documents.");
  }
  const records = candidates.map((candidate, index) => {
    if (!isRecord(candidate)) {
      throw new Error(`Snapshot document ${index} is not an object.`);
    }
    const id = requiredString(candidate._id, `snapshot[${index}]._id`);
    if (id.startsWith("drafts.")) {
      throw new Error(`Snapshot contains draft ${id}. Export published documents only.`);
    }
    validDocumentId(id, `snapshot[${index}]._id`);
    return cloneJson({ ...candidate, _id: id }) as HistoricalMetadataSnapshotDocument;
  });
  records.sort((left, right) => compareText(left._id, right._id));
  if (new Set(records.map(({ _id }) => _id)).size !== records.length) {
    throw new Error("Published snapshot contains duplicate document IDs.");
  }
  return records;
}

export function historicalAnalyticalSnapshotBinding(
  documents: readonly HistoricalMetadataSnapshotDocument[],
): HistoricalReleaseMetadataPlan["analyticalSnapshot"] {
  const revisions = documents.map((document) => {
    if (!HISTORICAL_ANALYTICAL_SNAPSHOT_TYPE_SET.has(document._type)) {
      throw new Error(
        `Published snapshot contains unsupported analytical document type ${document._type} at ${document._id}.`,
      );
    }
    return {
      id: document._id,
      documentType:
        document._type as HistoricalAnalyticalSnapshotRevision["documentType"],
      expectedRevision: revisionOf(document, `snapshot.${document._id}`),
    };
  });
  revisions.sort((left, right) => compareText(left.id, right.id));
  return {
    documentTypes: HISTORICAL_ANALYTICAL_SNAPSHOT_TYPES,
    revisions,
    projectedSourceDigest: historicalAnalyticalSourceDigest(
      projectHistoricalAnalyticalSourceFromSnapshot(documents),
    ),
  };
}

export function assertHistoricalAnalyticalSnapshotMatchesPlan(
  plan: HistoricalReleaseMetadataPlan,
  snapshotInput: unknown,
): HistoricalMetadataSnapshotDocument[] {
  const documents = extractHistoricalMetadataSnapshotDocuments(snapshotInput);
  const binding = historicalAnalyticalSnapshotBinding(documents);
  if (
    !exactEqualDocumentBody(
      {
        documentTypes: binding.documentTypes,
        revisions: binding.revisions,
      },
      {
        documentTypes: plan.analyticalSnapshot.documentTypes,
        revisions: plan.analyticalSnapshot.revisions,
      },
    )
  ) {
    throw new Error(
      "The complete live analytical document revision set changed since planning. Generate and approve a new plan.",
    );
  }
  if (sha256(documents) !== plan.sourceSnapshotDigest) {
    throw new Error(
      "The complete live analytical snapshot changed since planning. Generate and approve a new plan.",
    );
  }
  if (
    binding.projectedSourceDigest !==
    plan.analyticalSnapshot.projectedSourceDigest
  ) {
    throw new Error(
      "The projected analytical source changed since planning. Generate and approve a new plan.",
    );
  }
  return documents;
}

export function historicalReleaseMetadataId(releaseVersionId: string): string {
  const id = historicalReleaseMetadataDocumentId(releaseVersionId);
  if (!id) {
    throw new Error(
      `${releaseVersionId} cannot form a deterministic historical metadata document ID.`,
    );
  }
  return id;
}

function writableBody(
  document: HistoricalMetadataSnapshotDocument,
): HistoricalMetadataSnapshotDocument {
  return Object.fromEntries(
    Object.entries(document).filter(([field]) => !MUTABLE_SYSTEM_FIELDS.has(field)),
  ) as HistoricalMetadataSnapshotDocument;
}

function sanityReference(id: string): UnknownRecord {
  return { _type: "reference", _ref: id };
}

export function historicalReleaseEvidenceReference(
  id: string,
  scope: string,
): UnknownRecord {
  return {
    _key: `e${sha256(`${scope}:${id}`).slice(0, 23)}`,
    _type: "reference",
    _ref: id,
  };
}

function plannedManagedFields(entry: CuratedHistoricalMetadataEntry): UnknownRecord {
  return {
    releaseVersion: sanityReference(entry.releaseVersionId),
    productFamilyId: entry.productFamilyId,
    releaseClass: entry.releaseClass,
    releasePosition: entry.releasePosition,
    releaseCycleId: entry.releaseCycleId,
    metadataEvidence: Object.fromEntries(
      (
        Object.entries(entry.metadataEvidence) as Array<
          [keyof CuratedMetadataEvidence, CuratedEvidenceReference[]]
        >
      ).map(([scope, evidence]) => [
        scope,
        evidence.map(({ id }) =>
          historicalReleaseEvidenceReference(id, `metadataEvidence.${scope}`),
        ),
      ]),
    ),
    chronologyCoverage: {
      state: entry.chronologyCoverage.state,
      ...(entry.chronologyCoverage.state === "unknown"
        ? { reason: entry.chronologyCoverage.reason }
        : {}),
      evidence: entry.chronologyCoverage.evidence.map(({ id }) =>
        historicalReleaseEvidenceReference(id, "chronologyCoverage.evidence"),
      ),
    },
  };
}

function assertReferencedDocument(
  byId: Map<string, HistoricalMetadataSnapshotDocument>,
  expected: CuratedEvidenceReference,
  path: string,
): void {
  const document = byId.get(expected.id);
  if (!document) {
    throw new Error(`${path} references missing published evidence ${expected.id}.`);
  }
  if (!EVIDENCE_TYPES.has(document._type)) {
    throw new Error(`${path} references ${expected.id} with unsupported type ${document._type}.`);
  }
  const currentRevision = revisionOf(document, `snapshot.${expected.id}`);
  if (currentRevision !== expected.expectedRevision) {
    throw new Error(
      `${path} evidence ${expected.id} is stale (${expected.expectedRevision} -> ${currentRevision}).`,
    );
  }
}

export function historicalLifecycleObservationEvidence(
  document: HistoricalMetadataSnapshotDocument,
  expected: CuratedEvidenceReference,
  path: string,
): HistoricalLifecycleObservationEvidence {
  if (document._id !== expected.id) {
    throw new Error(`${path} resolved the wrong evidence document.`);
  }
  if (!EVIDENCE_TYPES.has(document._type)) {
    throw new Error(
      `${path} references ${expected.id} with unsupported type ${document._type}.`,
    );
  }
  const currentRevision = revisionOf(document, `snapshot.${expected.id}`);
  if (currentRevision !== expected.expectedRevision) {
    throw new Error(
      `${path} evidence ${expected.id} is stale (${expected.expectedRevision} -> ${currentRevision}).`,
    );
  }

  if (document._type === "source") {
    if (Object.hasOwn(document, "publishedAt")) {
      const publishedAt = optionalString(document.publishedAt);
      if (!publishedAt || !isIsoInstant(publishedAt)) {
        throw new Error(
          `${path} source ${expected.id} has an invalid publishedAt evidence time.`,
        );
      }
      return {
        id: expected.id,
        expectedRevision: expected.expectedRevision,
        documentType: "source",
        availableAt: new Date(publishedAt).toISOString(),
        availabilityBasis: "publishedAt",
      };
    }
    const accessedAt = optionalString(document.accessedAt);
    if (!accessedAt || !isIsoDay(accessedAt)) {
      throw new Error(
        `${path} source ${expected.id} needs a valid publishedAt or conservative accessedAt evidence time.`,
      );
    }
    return {
      id: expected.id,
      expectedRevision: expected.expectedRevision,
      documentType: "source",
      availableAt: `${accessedAt}T23:59:59.999Z`,
      availabilityBasis: "accessedAt",
    };
  }

  const verifiedAt = optionalString(document.verifiedAt);
  if (!verifiedAt || !isIsoInstant(verifiedAt)) {
    throw new Error(
      `${path} auditBatch ${expected.id} needs a valid verifiedAt evidence time.`,
    );
  }
  return {
    id: expected.id,
    expectedRevision: expected.expectedRevision,
    documentType: "auditBatch",
    availableAt: new Date(verifiedAt).toISOString(),
    availabilityBasis: "verifiedAt",
  };
}

function rollbackForMutation(
  mutation: HistoricalMetadataMutation,
): HistoricalMetadataRollbackMutation {
  if (mutation.action === "create") {
    return {
      action: "delete-created",
      id: mutation.id,
      requireCurrentPostApplyRevision: true,
      set: {},
      unset: [],
    };
  }
  const set: UnknownRecord = {};
  const unset: string[] = [];
  for (const field of Object.keys(mutation.set).sort(compareText)) {
    if (mutation.before && Object.hasOwn(mutation.before, field)) {
      set[field] = cloneJson(mutation.before[field]);
    } else {
      unset.push(field);
    }
  }
  return {
    action: "restore-patch",
    id: mutation.id,
    requireCurrentPostApplyRevision: true,
    set,
    unset,
  };
}

function rollbackForLifecyclePatch(
  patch: HistoricalLifecycleObservationPatch,
): HistoricalMetadataRollbackMutation {
  return {
    action: "restore-patch",
    id: patch.id,
    requireCurrentPostApplyRevision: true,
    set: {},
    unset: ["statusFirstObservedAt"],
  };
}

function buildRollback(
  plan: HistoricalReleaseMetadataPlan,
): HistoricalReleaseMetadataRollback {
  const withoutDigest = {
    artifactType: "sanity-historical-release-metadata-rollback" as const,
    formatVersion: 1 as const,
    planDigest: plan.planDigest,
    sourceSnapshotDigest: plan.sourceSnapshotDigest,
    restoreMutations: [
      ...plan.mutations.map(rollbackForMutation),
      ...plan.lifecycleObservationPatches.map(rollbackForLifecyclePatch),
    ].sort((left, right) => compareText(left.id, right.id)),
    instructions: [
      "This artifact never performs rollback writes by itself.",
      "Fetch each current published target and require its post-apply revision before recovery.",
      "Delete only a created sidecar whose current writable body still matches this plan's after body.",
      "For sidecar or releaseVersion restore patches, set only set fields and unset only unset fields under that current revision guard.",
      "Never submit historical _rev, _createdAt, or _updatedAt values as document fields.",
    ],
  };
  return {
    ...withoutDigest,
    rollbackDigest: sha256(withoutDigest),
  };
}

export function buildHistoricalReleaseMetadataPlan(
  snapshotInput: unknown,
  curatedManifestInput: unknown,
  options: HistoricalReleaseMetadataPlanOptions = {},
): HistoricalReleaseMetadataPlanResult {
  const documents = extractHistoricalMetadataSnapshotDocuments(snapshotInput);
  const manifest = parseCuratedHistoricalMetadataManifest(curatedManifestInput);
  const byId = new Map(documents.map((document) => [document._id, document]));
  const snapshotReleaseIds = documents
    .filter(({ _type }) => _type === "releaseVersion")
    .map(({ _id }) => _id)
    .sort(compareText);
  const manifestReleaseIds = manifest.entries
    .map(({ releaseVersionId }) => releaseVersionId)
    .sort(compareText);
  if (!exactEqualDocumentBody(snapshotReleaseIds, manifestReleaseIds)) {
    throw new Error(
      "Curated manifest must exactly cover every releaseVersion in the complete analytical snapshot.",
    );
  }
  const sidecars = documents.filter(
    (document) => document._type === "historicalReleaseMetadata",
  );
  const sidecarsByRelease = new Map<string, HistoricalMetadataSnapshotDocument[]>();
  for (const sidecar of sidecars) {
    const releaseVersionId = referenceId(sidecar.releaseVersion);
    if (!releaseVersionId) {
      throw new Error(`${sidecar._id} lacks a releaseVersion reference.`);
    }
    sidecarsByRelease.set(releaseVersionId, [
      ...(sidecarsByRelease.get(releaseVersionId) ?? []),
      sidecar,
    ]);
  }
  for (const [releaseVersionId, matches] of sidecarsByRelease) {
    if (matches.length > 1) {
      throw new Error(
        `Published snapshot has duplicate historical metadata for ${releaseVersionId}: ${matches
          .map(({ _id }) => _id)
          .sort(compareText)
          .join(", ")}.`,
      );
    }
  }

  const mutations: HistoricalMetadataMutation[] = [];
  const lifecycleObservationPatches: HistoricalLifecycleObservationPatch[] = [];
  for (const entry of manifest.entries) {
    const releaseVersion = byId.get(entry.releaseVersionId);
    if (!releaseVersion || releaseVersion._type !== "releaseVersion") {
      throw new Error(`${entry.releaseVersionId} is not a published releaseVersion.`);
    }
    const releaseRevision = revisionOf(
      releaseVersion,
      `snapshot.${entry.releaseVersionId}`,
    );
    if (releaseRevision !== entry.expectedReleaseVersionRevision) {
      throw new Error(
        `${entry.releaseVersionId} is stale (${entry.expectedReleaseVersionRevision} -> ${releaseRevision}).`,
      );
    }
    const releaseTrainId = referenceId(releaseVersion.releaseTrain);
    const releaseTrain = releaseTrainId ? byId.get(releaseTrainId) : undefined;
    if (!releaseTrain || releaseTrain._type !== "releaseTrain") {
      throw new Error(`${entry.releaseVersionId} has no resolvable published releaseTrain.`);
    }
    const releaseTrainRevision = revisionOf(
      releaseTrain,
      `snapshot.${releaseTrain._id}`,
    );
    if (releaseTrainRevision !== entry.expectedReleaseTrainRevision) {
      throw new Error(
        `${releaseTrain._id} is stale (${entry.expectedReleaseTrainRevision} -> ${releaseTrainRevision}).`,
      );
    }
    const platformId = referenceId(releaseTrain.platform);
    if (platformId !== entry.platformId) {
      throw new Error(
        `${entry.releaseVersionId} resolves to platform ${platformId ?? "missing"}, not curated platform ${entry.platformId}.`,
      );
    }
    const platform = byId.get(entry.platformId);
    if (!platform || platform._type !== "platform") {
      throw new Error(`${entry.platformId} is not a published platform.`);
    }
    const platformRevision = revisionOf(platform, `snapshot.${entry.platformId}`);
    if (platformRevision !== entry.expectedPlatformRevision) {
      throw new Error(
        `${entry.platformId} is stale (${entry.expectedPlatformRevision} -> ${platformRevision}).`,
      );
    }
    flattenedMetadataEvidence(entry.metadataEvidence).forEach((evidence, index) =>
      assertReferencedDocument(byId, evidence, `${entry.metadataId}.metadataEvidence[${index}]`),
    );
    entry.chronologyCoverage.evidence.forEach((evidence, index) =>
      assertReferencedDocument(
        byId,
        evidence,
        `${entry.metadataId}.chronologyCoverage.evidence[${index}]`,
      ),
    );

    const explicitStatus = optionalString(releaseVersion.releaseStatus);
    const publicReleaseDate = optionalString(releaseVersion.publicReleaseDate);
    const lifecycle = explicitStatus || (publicReleaseDate ? "released" : "active");
    if (!new Set(["active", "released", "superseded"]).has(lifecycle)) {
      throw new Error(
        `${entry.releaseVersionId} has unsupported lifecycle ${lifecycle}.`,
      );
    }
    const recordedStatusEffectiveDate = optionalString(
      releaseVersion.statusEffectiveDate,
    );
    if (
      (lifecycle === "released" &&
        (!publicReleaseDate ||
          !isIsoDay(publicReleaseDate) ||
          (recordedStatusEffectiveDate !== undefined &&
            recordedStatusEffectiveDate !== publicReleaseDate))) ||
      (lifecycle !== "released" && publicReleaseDate !== undefined)
    ) {
      throw new Error(
        `${entry.releaseVersionId} has lifecycle dates inconsistent with ${lifecycle}.`,
      );
    }
    const statusEffectiveDate =
      recordedStatusEffectiveDate ||
      (lifecycle === "released" ? publicReleaseDate : undefined);
    const currentStatusFirstObservedAt = optionalString(
      releaseVersion.statusFirstObservedAt,
    );
    if (lifecycle === "active") {
      if (currentStatusFirstObservedAt || entry.statusFirstObservedAt) {
        throw new Error(
          `${entry.releaseVersionId} is active and cannot record a lifecycle-transition observation time.`,
        );
      }
    } else {
      if (!statusEffectiveDate || !isIsoDay(statusEffectiveDate)) {
        throw new Error(
          `${entry.releaseVersionId} requires an explicit lifecycle effective date before status observation can be planned.`,
        );
      }
      if (
        currentStatusFirstObservedAt &&
        (!isIsoInstant(currentStatusFirstObservedAt) ||
          new Date(currentStatusFirstObservedAt).toISOString().slice(0, 10) <
            statusEffectiveDate)
      ) {
        throw new Error(
          `${entry.releaseVersionId} has an invalid or temporally leaking statusFirstObservedAt.`,
        );
      }
      if (!currentStatusFirstObservedAt && !entry.statusFirstObservedAt) {
        throw new Error(
          `${entry.releaseVersionId} requires an explicit or conservative statusFirstObservedAt plan; _updatedAt is forbidden.`,
        );
      }
      if (entry.statusFirstObservedAt) {
        const statusPlan = entry.statusFirstObservedAt;
        const observedAt =
          statusPlan.strategy === "explicit"
            ? statusPlan.value
            : optionalString(releaseVersion._createdAt);
        if (!observedAt || !isIsoInstant(observedAt)) {
          throw new Error(
            `${entry.releaseVersionId} lacks a valid Sanity _createdAt for the conservative observation strategy.`,
          );
        }
        if (
          new Date(observedAt).toISOString().slice(0, 10) < statusEffectiveDate
        ) {
          throw new Error(
            `${entry.releaseVersionId} observation ${observedAt} predates lifecycle effective date ${statusEffectiveDate}.`,
          );
        }
        const observationEvidence =
          statusPlan.strategy === "explicit"
            ? statusPlan.evidence.map((evidence, index) => {
                const evidenceDocument = byId.get(evidence.id);
                const evidencePath =
                  `${entry.releaseVersionId}.statusFirstObservedAt.evidence[${index}]`;
                if (!evidenceDocument) {
                  throw new Error(
                    `${evidencePath} references missing published evidence ${evidence.id}.`,
                  );
                }
                const temporalEvidence =
                  historicalLifecycleObservationEvidence(
                    evidenceDocument,
                    evidence,
                    evidencePath,
                  );
                if (
                  Date.parse(observedAt) < Date.parse(temporalEvidence.availableAt)
                ) {
                  throw new Error(
                    `${entry.releaseVersionId} explicit observation ${new Date(observedAt).toISOString()} predates ${evidence.id} availability ${temporalEvidence.availableAt}.`,
                  );
                }
                return temporalEvidence;
              })
            : [];
        if (currentStatusFirstObservedAt) {
          if (currentStatusFirstObservedAt !== observedAt) {
            throw new Error(
              `${entry.releaseVersionId} statusFirstObservedAt conflicts with the curated value.`,
            );
          }
          if (!options.allowNoopEntries) {
            throw new HistoricalReleaseMetadataNoopPlanError(
              `${entry.releaseVersionId} statusFirstObservedAt is already identical; no-op plans are blocked.`,
            );
          }
        } else {
          lifecycleObservationPatches.push({
            id: entry.releaseVersionId,
            ifRevisionId: releaseRevision,
            basis: statusPlan.strategy,
            evidence: cloneJson(observationEvidence),
            before: cloneJson(releaseVersion),
            after: {
              ...writableBody(releaseVersion),
              statusFirstObservedAt: observedAt,
            },
            set: { statusFirstObservedAt: observedAt },
            unset: [],
          });
        }
      }
    }

    const sameReleaseSidecar = sidecarsByRelease.get(entry.releaseVersionId)?.[0];
    if (sameReleaseSidecar && sameReleaseSidecar._id !== entry.metadataId) {
      throw new Error(
        `${entry.releaseVersionId} already has sidecar ${sameReleaseSidecar._id}; stable ID must be ${entry.metadataId}.`,
      );
    }
    const current = byId.get(entry.metadataId);
    if (current && current._type !== "historicalReleaseMetadata") {
      throw new Error(
        `${entry.metadataId} already exists with type ${current._type}; stable identity is unavailable.`,
      );
    }
    if (entry.expectedMetadataRevision === null && current) {
      throw new Error(
        `${entry.metadataId} now exists at ${revisionOf(current, `snapshot.${entry.metadataId}`)}; manifest expected it missing.`,
      );
    }
    if (entry.expectedMetadataRevision !== null && !current) {
      throw new Error(
        `${entry.metadataId} is missing; manifest expected revision ${entry.expectedMetadataRevision}.`,
      );
    }
    if (
      current &&
      revisionOf(current, `snapshot.${entry.metadataId}`) !==
        entry.expectedMetadataRevision
    ) {
      throw new Error(
        `${entry.metadataId} is stale (${entry.expectedMetadataRevision} -> ${current._rev}).`,
      );
    }

    const managed = plannedManagedFields(entry);
    if (!current) {
      const after = {
        _id: entry.metadataId,
        _type: "historicalReleaseMetadata",
        ...cloneJson(managed),
      } as HistoricalMetadataSnapshotDocument;
      mutations.push({
        action: "create",
        id: entry.metadataId,
        releaseVersionId: entry.releaseVersionId,
        releaseVersionRevision: releaseRevision,
        releaseTrainId: releaseTrain._id,
        releaseTrainRevision,
        platformId: entry.platformId,
        platformRevision,
        ifRevisionId: null,
        metadataEvidence: cloneJson(entry.metadataEvidence),
        chronologyEvidence: cloneJson(entry.chronologyCoverage.evidence),
        before: null,
        after,
        set: cloneJson(managed),
        unset: [],
      });
      continue;
    }

    const set = Object.fromEntries(
      MANAGED_FIELDS.filter(
        (field) => stableStringify(current[field]) !== stableStringify(managed[field]),
      ).map((field) => [field, cloneJson(managed[field])]),
    );
    if (!Object.keys(set).length) {
      if (options.allowNoopEntries) continue;
      throw new HistoricalReleaseMetadataNoopPlanError(
        `${entry.metadataId} is already identical to the curated entry; no-op plans are blocked.`,
      );
    }
    const after = { ...writableBody(current), ...cloneJson(set) };
    mutations.push({
      action: "patch",
      id: entry.metadataId,
      releaseVersionId: entry.releaseVersionId,
      releaseVersionRevision: releaseRevision,
      releaseTrainId: releaseTrain._id,
      releaseTrainRevision,
      platformId: entry.platformId,
      platformRevision,
      ifRevisionId: revisionOf(current, `snapshot.${entry.metadataId}`),
      metadataEvidence: cloneJson(entry.metadataEvidence),
      chronologyEvidence: cloneJson(entry.chronologyCoverage.evidence),
      before: cloneJson(current),
      after: after as HistoricalMetadataSnapshotDocument,
      set,
      unset: [],
    });
  }

  if (!mutations.length && !lifecycleObservationPatches.length) {
    throw new HistoricalReleaseMetadataNoopPlanError(
      "Curated manifest produced no mutations; no-op plans are blocked.",
    );
  }
  mutations.sort((left, right) => compareText(left.id, right.id));
  lifecycleObservationPatches.sort((left, right) =>
    compareText(left.id, right.id),
  );
  const sourceSnapshotDigest = sha256(documents);
  const analyticalSnapshot = historicalAnalyticalSnapshotBinding(documents);
  const curatedManifestDigest = sha256(manifest);
  const summary = {
    entries: manifest.entries.length,
    creates: mutations.filter(({ action }) => action === "create").length,
    patches: mutations.filter(({ action }) => action === "patch").length,
    lifecycleObservationPatches: lifecycleObservationPatches.length,
    metadataEvidenceReferences: mutations.reduce(
      (total, mutation) =>
        total + flattenedMetadataEvidence(mutation.metadataEvidence).length,
      0,
    ),
    chronologyEvidenceReferences: mutations.reduce(
      (total, mutation) => total + mutation.chronologyEvidence.length,
      0,
    ),
    statusObservationEvidenceReferences: lifecycleObservationPatches.reduce(
      (total, patch) => total + patch.evidence.length,
      0,
    ),
  };
  const withoutDigest = {
    artifactType: "sanity-historical-release-metadata-plan" as const,
    formatVersion: 1 as const,
    sourceSnapshotDigest,
    analyticalSnapshot,
    curatedManifestDigest,
    mutations,
    lifecycleObservationPatches,
    summary,
  };
  const plan: HistoricalReleaseMetadataPlan = {
    ...withoutDigest,
    planDigest: sha256(withoutDigest),
  };
  const rollback = buildRollback(plan);
  assertValidHistoricalReleaseMetadataPlan(plan, rollback);
  return { plan, rollback };
}

function recordUnknownArtifactKeys(
  value: unknown,
  allowed: readonly string[],
  path: string,
  failures: string[],
): value is UnknownRecord {
  if (!isRecord(value)) {
    failures.push(`${path} must be an object`);
    return false;
  }
  const unknown = Object.keys(value)
    .filter((key) => !allowed.includes(key))
    .sort(compareText);
  if (unknown.length) {
    failures.push(`${path} contains unknown properties: ${unknown.join(", ")}`);
  }
  return true;
}

function recordEvidenceArtifactKeys(
  value: unknown,
  path: string,
  failures: string[],
  temporal: boolean,
): void {
  recordUnknownArtifactKeys(
    value,
    temporal
      ? [
          "id",
          "expectedRevision",
          "documentType",
          "availableAt",
          "availabilityBasis",
        ]
      : ["id", "expectedRevision"],
    path,
    failures,
  );
}

function recordMetadataEvidenceArtifactKeys(
  value: unknown,
  path: string,
  failures: string[],
): void {
  if (
    !recordUnknownArtifactKeys(
      value,
      ["productFamily", "releaseClass", "releasePosition", "releaseCycle"],
      path,
      failures,
    )
  ) {
    return;
  }
  for (const scope of [
    "productFamily",
    "releaseClass",
    "releasePosition",
    "releaseCycle",
  ] as const) {
    const references = value[scope];
    if (!Array.isArray(references)) {
      failures.push(`${path}.${scope} must be an array`);
      continue;
    }
    references.forEach((reference, index) =>
      recordEvidenceArtifactKeys(
        reference,
        `${path}.${scope}[${index}]`,
        failures,
        false,
      ),
    );
  }
}

function recordProjectedReferenceArtifactKeys(
  value: unknown,
  path: string,
  failures: string[],
  keyed: boolean,
): void {
  recordUnknownArtifactKeys(
    value,
    keyed ? ["_key", "_type", "_ref"] : ["_type", "_ref"],
    path,
    failures,
  );
}

function recordManagedProjectionArtifactKeys(
  value: unknown,
  path: string,
  failures: string[],
): void {
  if (!isRecord(value)) return;
  if (Object.hasOwn(value, "releaseVersion")) {
    recordProjectedReferenceArtifactKeys(
      value.releaseVersion,
      `${path}.releaseVersion`,
      failures,
      false,
    );
  }
  if (Object.hasOwn(value, "metadataEvidence")) {
    const metadataEvidence = value.metadataEvidence;
    if (
      recordUnknownArtifactKeys(
        metadataEvidence,
        ["productFamily", "releaseClass", "releasePosition", "releaseCycle"],
        `${path}.metadataEvidence`,
        failures,
      )
    ) {
      for (const scope of [
        "productFamily",
        "releaseClass",
        "releasePosition",
        "releaseCycle",
      ] as const) {
        const references = metadataEvidence[scope];
        if (!Array.isArray(references)) {
          failures.push(`${path}.metadataEvidence.${scope} must be an array`);
          continue;
        }
        references.forEach((reference, index) =>
          recordProjectedReferenceArtifactKeys(
            reference,
            `${path}.metadataEvidence.${scope}[${index}]`,
            failures,
            true,
          ),
        );
      }
    }
  }
  if (Object.hasOwn(value, "chronologyCoverage")) {
    const chronologyCoverage = value.chronologyCoverage;
    if (isRecord(chronologyCoverage)) {
      const allowed =
        chronologyCoverage.state === "unknown"
          ? ["state", "reason", "evidence"]
          : ["state", "evidence"];
      recordUnknownArtifactKeys(
        chronologyCoverage,
        allowed,
        `${path}.chronologyCoverage`,
        failures,
      );
      if (!Array.isArray(chronologyCoverage.evidence)) {
        failures.push(`${path}.chronologyCoverage.evidence must be an array`);
      } else {
        chronologyCoverage.evidence.forEach((reference, index) =>
          recordProjectedReferenceArtifactKeys(
            reference,
            `${path}.chronologyCoverage.evidence[${index}]`,
            failures,
            true,
          ),
        );
      }
    } else {
      failures.push(`${path}.chronologyCoverage must be an object`);
    }
  }
}

function recordPlanAndRollbackArtifactKeys(
  plan: HistoricalReleaseMetadataPlan,
  rollback: HistoricalReleaseMetadataRollback,
): string[] {
  const failures: string[] = [];
  if (
    !recordUnknownArtifactKeys(
      plan,
      [
        "artifactType",
        "formatVersion",
        "sourceSnapshotDigest",
        "analyticalSnapshot",
        "curatedManifestDigest",
        "planDigest",
        "mutations",
        "lifecycleObservationPatches",
        "summary",
      ],
      "plan",
      failures,
    )
  ) {
    return failures;
  }
  if (
    recordUnknownArtifactKeys(
      plan.analyticalSnapshot,
      ["documentTypes", "revisions", "projectedSourceDigest"],
      "plan.analyticalSnapshot",
      failures,
    )
  ) {
    if (!Array.isArray(plan.analyticalSnapshot.revisions)) {
      failures.push("plan.analyticalSnapshot.revisions must be an array");
    } else {
      plan.analyticalSnapshot.revisions.forEach((revision, index) =>
        recordUnknownArtifactKeys(
          revision,
          ["id", "documentType", "expectedRevision"],
          `plan.analyticalSnapshot.revisions[${index}]`,
          failures,
        ),
      );
    }
  }
  if (!Array.isArray(plan.mutations)) {
    failures.push("plan.mutations must be an array");
  } else {
    plan.mutations.forEach((mutation, index) => {
      const path = `plan.mutations[${index}]`;
      if (
        !recordUnknownArtifactKeys(
          mutation,
          [
            "action",
            "id",
            "releaseVersionId",
            "releaseVersionRevision",
            "releaseTrainId",
            "releaseTrainRevision",
            "platformId",
            "platformRevision",
            "ifRevisionId",
            "metadataEvidence",
            "chronologyEvidence",
            "before",
            "after",
            "set",
            "unset",
          ],
          path,
          failures,
        )
      ) {
        return;
      }
      recordMetadataEvidenceArtifactKeys(
        mutation.metadataEvidence,
        `${path}.metadataEvidence`,
        failures,
      );
      recordManagedProjectionArtifactKeys(mutation.set, `${path}.set`, failures);
      recordManagedProjectionArtifactKeys(
        mutation.after,
        `${path}.after`,
        failures,
      );
      if (!Array.isArray(mutation.chronologyEvidence)) {
        failures.push(`${path}.chronologyEvidence must be an array`);
      } else {
        mutation.chronologyEvidence.forEach((reference, referenceIndex) =>
          recordEvidenceArtifactKeys(
            reference,
            `${path}.chronologyEvidence[${referenceIndex}]`,
            failures,
            false,
          ),
        );
      }
    });
  }
  if (!Array.isArray(plan.lifecycleObservationPatches)) {
    failures.push("plan.lifecycleObservationPatches must be an array");
  } else {
    plan.lifecycleObservationPatches.forEach((patch, index) => {
      const path = `plan.lifecycleObservationPatches[${index}]`;
      if (
        !recordUnknownArtifactKeys(
          patch,
          ["id", "ifRevisionId", "basis", "evidence", "before", "after", "set", "unset"],
          path,
          failures,
        )
      ) {
        return;
      }
      if (!Array.isArray(patch.evidence)) {
        failures.push(`${path}.evidence must be an array`);
      } else {
        patch.evidence.forEach((reference, referenceIndex) =>
          recordEvidenceArtifactKeys(
            reference,
            `${path}.evidence[${referenceIndex}]`,
            failures,
            true,
          ),
        );
      }
      recordUnknownArtifactKeys(
        patch.set,
        ["statusFirstObservedAt"],
        `${path}.set`,
        failures,
      );
    });
  }
  recordUnknownArtifactKeys(
    plan.summary,
    [
      "entries",
      "creates",
      "patches",
      "lifecycleObservationPatches",
      "metadataEvidenceReferences",
      "chronologyEvidenceReferences",
      "statusObservationEvidenceReferences",
    ],
    "plan.summary",
    failures,
  );

  if (
    !recordUnknownArtifactKeys(
      rollback,
      [
        "artifactType",
        "formatVersion",
        "planDigest",
        "sourceSnapshotDigest",
        "restoreMutations",
        "instructions",
        "rollbackDigest",
      ],
      "rollback",
      failures,
    )
  ) {
    return failures;
  }
  if (!Array.isArray(rollback.restoreMutations)) {
    failures.push("rollback.restoreMutations must be an array");
  } else {
    rollback.restoreMutations.forEach((mutation, index) =>
      recordUnknownArtifactKeys(
        mutation,
        ["action", "id", "requireCurrentPostApplyRevision", "set", "unset"],
        `rollback.restoreMutations[${index}]`,
        failures,
      ),
    );
  }
  return failures;
}

export function validateHistoricalReleaseMetadataPlan(
  plan: HistoricalReleaseMetadataPlan,
  rollback: HistoricalReleaseMetadataRollback,
): string[] {
  const failures = recordPlanAndRollbackArtifactKeys(plan, rollback);
  if (
    !isRecord(plan) ||
    !isRecord(rollback) ||
    !isRecord(plan.analyticalSnapshot) ||
    !Array.isArray(plan.analyticalSnapshot.documentTypes) ||
    !Array.isArray(plan.analyticalSnapshot.revisions) ||
    !Array.isArray(plan.mutations) ||
    !Array.isArray(plan.lifecycleObservationPatches) ||
    !isRecord(plan.summary) ||
    !Array.isArray(rollback.restoreMutations) ||
    !Array.isArray(rollback.instructions)
  ) {
    return failures;
  }
  const withoutPlanDigest = {
    artifactType: plan.artifactType,
    formatVersion: plan.formatVersion,
    sourceSnapshotDigest: plan.sourceSnapshotDigest,
    analyticalSnapshot: plan.analyticalSnapshot,
    curatedManifestDigest: plan.curatedManifestDigest,
    mutations: plan.mutations,
    lifecycleObservationPatches: plan.lifecycleObservationPatches,
    summary: plan.summary,
  };
  if (
    plan.artifactType !== "sanity-historical-release-metadata-plan" ||
    plan.formatVersion !== 1 ||
    plan.planDigest !== sha256(withoutPlanDigest)
  ) {
    failures.push("plan identity or SHA-256 digest is invalid");
  }
  const snapshotRevisions = plan.analyticalSnapshot.revisions;
  if (
    !/^[a-f0-9]{64}$/.test(plan.sourceSnapshotDigest) ||
    !/^[a-f0-9]{64}$/.test(plan.analyticalSnapshot.projectedSourceDigest) ||
    !exactEqualDocumentBody(
      plan.analyticalSnapshot.documentTypes,
      HISTORICAL_ANALYTICAL_SNAPSHOT_TYPES,
    ) ||
    snapshotRevisions.length < 1 ||
    new Set(snapshotRevisions.map(({ id }) => id)).size !==
      snapshotRevisions.length ||
    !snapshotRevisions.every(
      (revision) =>
        DOCUMENT_ID_PATTERN.test(revision.id) &&
        !revision.id.startsWith("drafts.") &&
        revision.id.length <= 128 &&
        HISTORICAL_ANALYTICAL_SNAPSHOT_TYPE_SET.has(revision.documentType) &&
        Boolean(revision.expectedRevision.trim()),
    ) ||
    !exactEqualDocumentBody(
      snapshotRevisions,
      [...snapshotRevisions].sort((left, right) => compareText(left.id, right.id)),
    )
  ) {
    failures.push("analytical snapshot revision binding is invalid");
  }
  if (!plan.mutations.length && !plan.lifecycleObservationPatches.length) {
    failures.push("plan contains no mutations");
  }
  if (new Set(plan.mutations.map(({ id }) => id)).size !== plan.mutations.length) {
    failures.push("plan mutation IDs are not unique");
  }
  for (const mutation of plan.mutations) {
    const safeFields = Object.keys(mutation.set).every(
      (field) => MANAGED_FIELDS.includes(field as (typeof MANAGED_FIELDS)[number]),
    );
    const expectedAfter =
      mutation.action === "create"
        ? {
            _id: mutation.id,
            _type: "historicalReleaseMetadata",
            ...mutation.set,
          }
        : mutation.before
          ? { ...writableBody(mutation.before), ...mutation.set }
          : undefined;
    const actionValid =
      (mutation.action === "create" &&
        mutation.ifRevisionId === null &&
        mutation.before === null &&
        Object.keys(mutation.set).length === MANAGED_FIELDS.length) ||
      (mutation.action === "patch" &&
        Boolean(mutation.ifRevisionId) &&
        mutation.before?._id === mutation.id &&
        mutation.before?._type === "historicalReleaseMetadata" &&
        mutation.before?._rev === mutation.ifRevisionId &&
        Object.keys(mutation.set).length > 0);
    const projectedMetadataEvidence = isRecord(
      mutation.after.metadataEvidence,
    )
      ? mutation.after.metadataEvidence
      : {};
    const projectedCoverage = isRecord(mutation.after.chronologyCoverage)
      ? mutation.after.chronologyCoverage
      : {};
    const evidenceConsistent =
      evidenceReferencesMatch(
        mutation.metadataEvidence.productFamily,
        projectedMetadataEvidence.productFamily,
      ) &&
      evidenceReferencesMatch(
        mutation.metadataEvidence.releaseClass,
        projectedMetadataEvidence.releaseClass,
      ) &&
      evidenceReferencesMatch(
        mutation.metadataEvidence.releasePosition,
        projectedMetadataEvidence.releasePosition,
      ) &&
      evidenceReferencesMatch(
        mutation.metadataEvidence.releaseCycle,
        projectedMetadataEvidence.releaseCycle,
      ) &&
      evidenceReferencesMatch(
        mutation.chronologyEvidence,
        projectedCoverage.evidence,
      );
    if (
      !actionValid ||
      !safeFields ||
      mutation.unset.length ||
      mutation.after._id !== mutation.id ||
      mutation.after._type !== "historicalReleaseMetadata" ||
      !expectedAfter ||
      !exactEqualDocumentBody(mutation.after, expectedAfter) ||
      referenceId(mutation.after.releaseVersion) !== mutation.releaseVersionId ||
      !mutation.releaseVersionRevision ||
      !mutation.releaseTrainId ||
      !mutation.releaseTrainRevision ||
      !mutation.platformId ||
      !mutation.platformRevision ||
      !flattenedMetadataEvidence(mutation.metadataEvidence).length ||
      !mutation.chronologyEvidence.length ||
      !evidenceConsistent
    ) {
      failures.push(`${mutation.id}: mutation is not an exact safe sidecar operation`);
    }
  }
  if (
    new Set(plan.lifecycleObservationPatches.map(({ id }) => id)).size !==
    plan.lifecycleObservationPatches.length
  ) {
    failures.push("lifecycle observation patch IDs are not unique");
  }
  const allTargetIds = [
    ...plan.mutations.map(({ id }) => id),
    ...plan.lifecycleObservationPatches.map(({ id }) => id),
  ];
  if (new Set(allTargetIds).size !== allTargetIds.length) {
    failures.push("plan target IDs are not unique across operation types");
  }
  for (const patch of plan.lifecycleObservationPatches) {
    const observedAt = patch.set.statusFirstObservedAt;
    const observedDay = isIsoInstant(observedAt)
      ? new Date(observedAt).toISOString().slice(0, 10)
      : undefined;
    const temporalEvidenceValid =
      patch.evidence.length > 0 &&
      new Set(patch.evidence.map(({ id }) => id)).size === patch.evidence.length &&
      patch.evidence.every(
        (evidence) =>
          exactEqualDocumentBody(Object.keys(evidence).sort(compareText), [
            "availabilityBasis",
            "availableAt",
            "documentType",
            "expectedRevision",
            "id",
          ]) &&
          DOCUMENT_ID_PATTERN.test(evidence.id) &&
          !evidence.id.startsWith("drafts.") &&
          evidence.id.length <= 128 &&
          Boolean(evidence.expectedRevision.trim()) &&
          isIsoInstant(evidence.availableAt) &&
          new Date(evidence.availableAt).toISOString() === evidence.availableAt &&
          observedDay !== undefined &&
          Date.parse(observedAt) >= Date.parse(evidence.availableAt) &&
          ((evidence.documentType === "source" &&
            (evidence.availabilityBasis === "publishedAt" ||
              (evidence.availabilityBasis === "accessedAt" &&
                evidence.availableAt.endsWith("T23:59:59.999Z")))) ||
            (evidence.documentType === "auditBatch" &&
              evidence.availabilityBasis === "verifiedAt")),
      );
    const evidenceValid =
      (patch.basis === "explicit" && temporalEvidenceValid) ||
      (patch.basis === "sanity-created-at" &&
        patch.evidence.length === 0 &&
        patch.before._createdAt === observedAt);
    const lifecycle =
      optionalString(patch.before.releaseStatus) ||
      (optionalString(patch.before.publicReleaseDate) ? "released" : "active");
    const effectiveDate =
      optionalString(patch.before.statusEffectiveDate) ||
      (lifecycle === "released"
        ? optionalString(patch.before.publicReleaseDate)
        : undefined);
    const exactAfter = {
      ...writableBody(patch.before),
      statusFirstObservedAt: observedAt,
    };
    if (
      patch.before._id !== patch.id ||
      patch.before._type !== "releaseVersion" ||
      patch.before._rev !== patch.ifRevisionId ||
      Object.hasOwn(patch.before, "statusFirstObservedAt") ||
      patch.after._id !== patch.id ||
      patch.after._type !== "releaseVersion" ||
      !exactEqualDocumentBody(patch.after, exactAfter) ||
      Object.keys(patch.set).length !== 1 ||
      !isIsoInstant(observedAt) ||
      patch.unset.length !== 0 ||
      !evidenceValid ||
      lifecycle === "active" ||
      !effectiveDate ||
      !isIsoDay(effectiveDate) ||
      new Date(observedAt).toISOString().slice(0, 10) < effectiveDate
    ) {
      failures.push(
        `${patch.id}: lifecycle observation is not an exact safe releaseVersion patch`,
      );
    }
  }
  if (
    !Number.isSafeInteger(plan.summary.entries) ||
    plan.summary.entries < 1 ||
    plan.summary.creates !==
      plan.mutations.filter(({ action }) => action === "create").length ||
    plan.summary.patches !==
      plan.mutations.filter(({ action }) => action === "patch").length ||
    plan.summary.lifecycleObservationPatches !==
      plan.lifecycleObservationPatches.length ||
    plan.summary.metadataEvidenceReferences !==
      plan.mutations.reduce(
        (total, mutation) =>
          total + flattenedMetadataEvidence(mutation.metadataEvidence).length,
        0,
      ) ||
    plan.summary.chronologyEvidenceReferences !==
      plan.mutations.reduce(
        (total, mutation) => total + mutation.chronologyEvidence.length,
        0,
      ) ||
    plan.summary.statusObservationEvidenceReferences !==
      plan.lifecycleObservationPatches.reduce(
        (total, patch) => total + patch.evidence.length,
        0,
      )
  ) {
    failures.push("plan summary does not match mutations");
  }
  const expectedRestore = [
    ...plan.mutations.map(rollbackForMutation),
    ...plan.lifecycleObservationPatches.map(rollbackForLifecyclePatch),
  ].sort((left, right) => compareText(left.id, right.id));
  const withoutRollbackDigest = {
    artifactType: rollback.artifactType,
    formatVersion: rollback.formatVersion,
    planDigest: rollback.planDigest,
    sourceSnapshotDigest: rollback.sourceSnapshotDigest,
    restoreMutations: rollback.restoreMutations,
    instructions: rollback.instructions,
  };
  if (
    rollback.artifactType !== "sanity-historical-release-metadata-rollback" ||
    rollback.formatVersion !== 1 ||
    rollback.planDigest !== plan.planDigest ||
    rollback.sourceSnapshotDigest !== plan.sourceSnapshotDigest ||
    stableStringify(rollback.restoreMutations) !== stableStringify(expectedRestore) ||
    rollback.rollbackDigest !== sha256(withoutRollbackDigest)
  ) {
    failures.push("rollback does not exactly cover this plan");
  }
  return failures;
}

export function assertValidHistoricalReleaseMetadataPlan(
  plan: HistoricalReleaseMetadataPlan,
  rollback: HistoricalReleaseMetadataRollback,
): void {
  const failures = validateHistoricalReleaseMetadataPlan(plan, rollback);
  if (failures.length) {
    throw new Error(
      `Historical release metadata plan is invalid:\n${failures
        .map((failure) => `- ${failure}`)
        .join("\n")}`,
    );
  }
}
