import { createHash } from "node:crypto";

import {
  extractHistoricalMetadataSnapshotDocuments,
  historicalAnalyticalSnapshotBinding,
  historicalReleaseMetadataId,
  type HistoricalMetadataSnapshotDocument,
} from "./historical-release-metadata-migration";
import { stableStringify } from "./release-event-migration";

type UnknownRecord = Record<string, unknown>;

export const HISTORICAL_RELEASE_METADATA_CURATION_VERSION =
  "historical-release-metadata-curation/v1";

export type HistoricalLifecycleReviewState =
  | "not-applicable-active"
  | "already-recorded"
  | "candidate-sanity-created-at"
  | "requires-explicit-evidence"
  | "requires-effective-date-repair"
  | "requires-lifecycle-repair";

export interface HistoricalMetadataEvidenceCandidate {
  id: string;
  expectedRevision: string;
  documentType: "source" | "auditBatch";
  title?: string;
  canonicalUrl?: string;
  publishedAt?: string;
  accessedAt?: string;
  verifiedAt?: string;
}

export interface HistoricalMetadataCurationEntry {
  metadataId: string;
  releaseVersion: {
    id: string;
    expectedRevision: string;
    displayVersion?: string;
    releaseStatus?: string;
    publicReleaseDate?: string;
    statusEffectiveDate?: string;
    statusFirstObservedAt?: string;
    createdAt?: string;
  };
  releaseTrain: {
    id: string;
    expectedRevision: string;
    displayName?: string;
    majorVersion?: number;
  };
  platform: {
    id: string;
    expectedRevision: string;
    name?: string;
    slug?: string;
  };
  existingMetadata: readonly {
    id: string;
    expectedRevision: string;
  }[];
  evidenceCandidates: readonly HistoricalMetadataEvidenceCandidate[];
  unresolvedEvidenceReferenceCount: number;
  lifecycleReview: {
    state: HistoricalLifecycleReviewState;
    lifecycle: "active" | "released" | "superseded" | "invalid";
    effectiveDate?: string;
  };
  /**
   * These are deliberately null. This queue is not a migration manifest and
   * must not be used to infer or auto-fill historical assertions.
   */
  reviewFields: {
    productFamilyId: null;
    releaseClass: null;
    releasePosition: null;
    releaseCycleId: null;
    metadataEvidence: null;
    chronologyCoverage: null;
    statusFirstObservedAt: null;
  };
  blockers: readonly string[];
}

export interface HistoricalMetadataCurationQueue {
  curationVersion: typeof HISTORICAL_RELEASE_METADATA_CURATION_VERSION;
  sourceSnapshotDigest: string;
  projectedSourceDigest: string;
  summary: {
    releaseVersions: number;
    existingMetadata: number;
    missingMetadata: number;
    activeReleaseVersions: number;
    releaseVersionsRequiringLifecycleReview: number;
    releaseVersionsRequiringLifecycleRepair: number;
    releaseVersionsWithoutEvidenceCandidates: number;
  };
  entries: readonly HistoricalMetadataCurationEntry[];
}

function isRecord(value: unknown): value is UnknownRecord {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function compareText(left: string, right: string): number {
  return left < right ? -1 : left > right ? 1 : 0;
}

function optionalString(value: unknown): string | undefined {
  return typeof value === "string" && value.trim() ? value.trim() : undefined;
}

function optionalNumber(value: unknown): number | undefined {
  return typeof value === "number" && Number.isFinite(value)
    ? value
    : undefined;
}

function revisionOf(document: HistoricalMetadataSnapshotDocument): string {
  const revision = optionalString(document._rev);
  if (!revision) {
    throw new Error(`${document._id} lacks a revision.`);
  }
  return revision;
}

function referenceId(value: unknown): string | undefined {
  return isRecord(value) ? optionalString(value._ref) : undefined;
}

function referenceIds(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return [
    ...new Set(
      value.flatMap((entry) => {
        const id = referenceId(entry);
        return id ? [id] : [];
      }),
    ),
  ].sort(compareText);
}

function citationSourceIds(
  document: HistoricalMetadataSnapshotDocument,
): string[] {
  if (!Array.isArray(document.citations)) return [];
  return [
    ...new Set(
      document.citations.flatMap((citation) => {
        const id = isRecord(citation)
          ? referenceId(citation.source)
          : undefined;
        return id ? [id] : [];
      }),
    ),
  ].sort(compareText);
}

function auditBatchIds(document: HistoricalMetadataSnapshotDocument): string[] {
  const auditBatch = referenceId(document.auditBatch);
  return [
    ...new Set([
      ...(auditBatch ? [auditBatch] : []),
      ...referenceIds(document.auditBatches),
    ]),
  ].sort(compareText);
}

function validIsoDay(value: string | undefined): value is string {
  if (!value || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const [year, month, day] = value.split("-").map(Number);
  const parsed = new Date(Date.UTC(year, month - 1, day));
  return (
    parsed.getUTCFullYear() === year &&
    parsed.getUTCMonth() === month - 1 &&
    parsed.getUTCDate() === day
  );
}

function validIsoInstant(value: string | undefined): value is string {
  if (!value) return false;
  const parsed = new Date(value);
  return !Number.isNaN(parsed.getTime()) && parsed.toISOString() === value;
}

function lifecycleReview(
  document: HistoricalMetadataSnapshotDocument,
): HistoricalMetadataCurationEntry["lifecycleReview"] {
  const releaseStatus = optionalString(document.releaseStatus);
  const publicReleaseDate = optionalString(document.publicReleaseDate);
  const lifecycle =
    releaseStatus ?? (publicReleaseDate ? "released" : "active");
  if (
    lifecycle !== "active" &&
    lifecycle !== "released" &&
    lifecycle !== "superseded"
  ) {
    return { state: "requires-lifecycle-repair", lifecycle: "invalid" };
  }
  if (lifecycle === "active") {
    return { state: "not-applicable-active", lifecycle };
  }

  const effectiveDate =
    optionalString(document.statusEffectiveDate) ??
    (lifecycle === "released" ? publicReleaseDate : undefined);
  if (!validIsoDay(effectiveDate)) {
    return {
      state: "requires-effective-date-repair",
      lifecycle,
    };
  }
  const observedAt = optionalString(document.statusFirstObservedAt);
  if (observedAt) {
    return validIsoInstant(observedAt) &&
      observedAt.slice(0, 10) >= effectiveDate
      ? { state: "already-recorded", lifecycle, effectiveDate }
      : { state: "requires-lifecycle-repair", lifecycle, effectiveDate };
  }
  const createdAt = optionalString(document._createdAt);
  if (validIsoInstant(createdAt) && createdAt.slice(0, 10) >= effectiveDate) {
    return { state: "candidate-sanity-created-at", lifecycle, effectiveDate };
  }
  return { state: "requires-explicit-evidence", lifecycle, effectiveDate };
}

function evidenceCandidate(
  document: HistoricalMetadataSnapshotDocument,
): HistoricalMetadataEvidenceCandidate | undefined {
  if (document._type !== "source" && document._type !== "auditBatch") {
    return undefined;
  }
  const base = {
    id: document._id,
    expectedRevision: revisionOf(document),
    documentType: document._type,
  } as const;
  if (document._type === "source") {
    const title = optionalString(document.title);
    const canonicalUrl = optionalString(document.canonicalUrl);
    const publishedAt = optionalString(document.publishedAt);
    const accessedAt = optionalString(document.accessedAt);
    return {
      ...base,
      ...(title ? { title } : {}),
      ...(canonicalUrl ? { canonicalUrl } : {}),
      ...(publishedAt ? { publishedAt } : {}),
      ...(accessedAt ? { accessedAt } : {}),
    };
  }
  const title = optionalString(document.title);
  const verifiedAt = optionalString(document.verifiedAt);
  return {
    ...base,
    ...(title ? { title } : {}),
    ...(verifiedAt ? { verifiedAt } : {}),
  };
}

function sha256(value: unknown): string {
  return createHash("sha256").update(stableStringify(value)).digest("hex");
}

/**
 * Create a deterministic human-review queue from one complete snapshot. It
 * deliberately exposes evidence candidates and leaves every analytical value
 * unfilled; it is not accepted by the guarded migration planner.
 */
export function buildHistoricalMetadataCurationQueue(
  snapshotInput: unknown,
): HistoricalMetadataCurationQueue {
  const documents = extractHistoricalMetadataSnapshotDocuments(snapshotInput);
  const analyticalSnapshot = historicalAnalyticalSnapshotBinding(documents);
  const byId = new Map(documents.map((document) => [document._id, document]));
  const sidecarsByRelease = new Map<
    string,
    HistoricalMetadataSnapshotDocument[]
  >();
  for (const document of documents) {
    if (document._type !== "historicalReleaseMetadata") continue;
    const releaseId = referenceId(document.releaseVersion);
    if (!releaseId) continue;
    sidecarsByRelease.set(releaseId, [
      ...(sidecarsByRelease.get(releaseId) ?? []),
      document,
    ]);
  }

  const entries = documents
    .filter((document) => document._type === "releaseVersion")
    .map((releaseVersion) => {
      const releaseTrainId = referenceId(releaseVersion.releaseTrain);
      const releaseTrain = releaseTrainId
        ? byId.get(releaseTrainId)
        : undefined;
      if (!releaseTrain || releaseTrain._type !== "releaseTrain") {
        throw new Error(
          `${releaseVersion._id} has no published release train.`,
        );
      }
      const platformId = referenceId(releaseTrain.platform);
      const platform = platformId ? byId.get(platformId) : undefined;
      if (!platform || platform._type !== "platform") {
        throw new Error(`${releaseVersion._id} has no published platform.`);
      }

      const events = documents.filter(
        (document) =>
          document._type === "releaseEvent" &&
          referenceId(document.releaseVersion) === releaseVersion._id,
      );
      const candidateReferenceIds = new Set<string>([
        ...citationSourceIds(releaseVersion),
        ...auditBatchIds(releaseVersion),
        ...events.flatMap((event) => [
          ...citationSourceIds(event),
          ...auditBatchIds(event),
        ]),
      ]);
      const unresolvedEvidenceReferenceIds: string[] = [];
      const evidenceCandidates = [...candidateReferenceIds]
        .sort(compareText)
        .flatMap((id) => {
          const candidate = byId.get(id);
          if (!candidate) {
            unresolvedEvidenceReferenceIds.push(id);
            return [];
          }
          const evidence = evidenceCandidate(candidate);
          if (!evidence) {
            unresolvedEvidenceReferenceIds.push(id);
            return [];
          }
          return [evidence];
        })
        .sort((left, right) => compareText(left.id, right.id));
      const lifecycle = lifecycleReview(releaseVersion);
      const existingMetadata = [
        ...(sidecarsByRelease.get(releaseVersion._id) ?? []),
      ]
        .sort((left, right) => compareText(left._id, right._id))
        .map((document) => ({
          id: document._id,
          expectedRevision: revisionOf(document),
        }));
      const blockers = [
        ...(evidenceCandidates.length === 0 ? ["no-evidence-candidates"] : []),
        ...(unresolvedEvidenceReferenceIds.length > 0
          ? ["unresolved-evidence-reference"]
          : []),
        ...(existingMetadata.length > 1 ? ["duplicate-existing-metadata"] : []),
        ...(lifecycle.state === "requires-effective-date-repair" ||
        lifecycle.state === "requires-lifecycle-repair"
          ? ["lifecycle-repair-required"]
          : []),
      ].sort(compareText);
      const displayVersion = optionalString(releaseVersion.version);
      const releaseStatus = optionalString(releaseVersion.releaseStatus);
      const publicReleaseDate = optionalString(
        releaseVersion.publicReleaseDate,
      );
      const statusEffectiveDate = optionalString(
        releaseVersion.statusEffectiveDate,
      );
      const statusFirstObservedAt = optionalString(
        releaseVersion.statusFirstObservedAt,
      );
      const createdAt = optionalString(releaseVersion._createdAt);
      const displayName = optionalString(releaseTrain.displayName);
      const majorVersion = optionalNumber(releaseTrain.majorVersion);
      const platformName = optionalString(platform.name);
      const platformSlug = isRecord(platform.slug)
        ? optionalString(platform.slug.current)
        : undefined;

      return {
        metadataId: historicalReleaseMetadataId(releaseVersion._id),
        releaseVersion: {
          id: releaseVersion._id,
          expectedRevision: revisionOf(releaseVersion),
          ...(displayVersion ? { displayVersion } : {}),
          ...(releaseStatus ? { releaseStatus } : {}),
          ...(publicReleaseDate ? { publicReleaseDate } : {}),
          ...(statusEffectiveDate ? { statusEffectiveDate } : {}),
          ...(statusFirstObservedAt ? { statusFirstObservedAt } : {}),
          ...(createdAt ? { createdAt } : {}),
        },
        releaseTrain: {
          id: releaseTrain._id,
          expectedRevision: revisionOf(releaseTrain),
          ...(displayName ? { displayName } : {}),
          ...(majorVersion === undefined ? {} : { majorVersion }),
        },
        platform: {
          id: platform._id,
          expectedRevision: revisionOf(platform),
          ...(platformName ? { name: platformName } : {}),
          ...(platformSlug ? { slug: platformSlug } : {}),
        },
        existingMetadata,
        evidenceCandidates,
        unresolvedEvidenceReferenceCount: unresolvedEvidenceReferenceIds.length,
        lifecycleReview: lifecycle,
        reviewFields: {
          productFamilyId: null,
          releaseClass: null,
          releasePosition: null,
          releaseCycleId: null,
          metadataEvidence: null,
          chronologyCoverage: null,
          statusFirstObservedAt: null,
        },
        blockers,
      } as const;
    })
    .sort((left, right) => compareText(left.metadataId, right.metadataId));

  return {
    curationVersion: HISTORICAL_RELEASE_METADATA_CURATION_VERSION,
    sourceSnapshotDigest: sha256(documents),
    projectedSourceDigest: analyticalSnapshot.projectedSourceDigest,
    summary: {
      releaseVersions: entries.length,
      existingMetadata: entries.filter(
        (entry) => entry.existingMetadata.length > 0,
      ).length,
      missingMetadata: entries.filter(
        (entry) => entry.existingMetadata.length === 0,
      ).length,
      activeReleaseVersions: entries.filter(
        (entry) => entry.lifecycleReview.lifecycle === "active",
      ).length,
      releaseVersionsRequiringLifecycleReview: entries.filter(
        (entry) =>
          entry.lifecycleReview.state === "candidate-sanity-created-at" ||
          entry.lifecycleReview.state === "requires-explicit-evidence",
      ).length,
      releaseVersionsRequiringLifecycleRepair: entries.filter(
        (entry) =>
          entry.lifecycleReview.state === "requires-effective-date-repair" ||
          entry.lifecycleReview.state === "requires-lifecycle-repair",
      ).length,
      releaseVersionsWithoutEvidenceCandidates: entries.filter(
        (entry) => entry.evidenceCandidates.length === 0,
      ).length,
    },
    entries,
  };
}
