import { createHash } from "node:crypto";

import { stableStringify } from "./release-event-migration";

type UnknownRecord = Record<string, unknown>;

interface AnalyticalSnapshotDocument extends UnknownRecord {
  _id: string;
  _type: string;
}

export interface CanonicalHistoricalAnalyticalSource {
  releases: Array<UnknownRecord & { id: string }>;
  events: Array<
    UnknownRecord & {
      id: string;
      releaseId: string;
      occurredOn: string;
      channel: string;
    }
  >;
  compatibilityMilestones: Array<
    UnknownRecord & { id: string; releaseId: string; occurredOn: string }
  >;
  releaseMetadata: Array<UnknownRecord & { releaseId: string; platformId: string }>;
}

function isRecord(value: unknown): value is UnknownRecord {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function compareText(left: string, right: string): -1 | 0 | 1 {
  return left < right ? -1 : left > right ? 1 : 0;
}

function exactRecord(
  value: unknown,
  allowed: readonly string[],
  path: string,
): UnknownRecord {
  if (!isRecord(value)) throw new Error(`${path} must be an object.`);
  const unknown = Object.keys(value)
    .filter((key) => !allowed.includes(key))
    .sort(compareText);
  if (unknown.length) {
    throw new Error(`${path} contains unknown properties: ${unknown.join(", ")}.`);
  }
  return value;
}

function requiredString(value: unknown, path: string): string {
  if (typeof value !== "string" || !value.trim()) {
    throw new Error(`${path} must be a non-empty string.`);
  }
  return value;
}

function optionalString(value: unknown, path: string): string | undefined {
  if (value === undefined || value === null) return undefined;
  if (typeof value !== "string" || !value.trim()) {
    throw new Error(`${path} must be a non-empty string when present.`);
  }
  return value;
}

function optionalBoolean(value: unknown, path: string): boolean | undefined {
  if (value === undefined || value === null) return undefined;
  if (typeof value !== "boolean") {
    throw new Error(`${path} must be a boolean when present.`);
  }
  return value;
}

function optionalNumber(value: unknown, path: string): number | undefined {
  if (value === undefined || value === null) return undefined;
  if (!Number.isFinite(value)) {
    throw new Error(`${path} must be a finite number when present.`);
  }
  return Number(value);
}

function optionalFields(
  value: UnknownRecord,
  stringFields: readonly string[],
  numberFields: readonly string[] = [],
  booleanFields: readonly string[] = [],
): UnknownRecord {
  const result: UnknownRecord = {};
  for (const field of stringFields) {
    const normalized = optionalString(value[field], field);
    if (normalized !== undefined) result[field] = normalized;
  }
  for (const field of numberFields) {
    const normalized = optionalNumber(value[field], field);
    if (normalized !== undefined) result[field] = normalized;
  }
  for (const field of booleanFields) {
    const normalized = optionalBoolean(value[field], field);
    if (normalized !== undefined) result[field] = normalized;
  }
  return result;
}

function stringArray(value: unknown, path: string): string[] {
  if (!Array.isArray(value)) throw new Error(`${path} must be an array.`);
  const values = value.map((entry, index) =>
    requiredString(entry, `${path}[${index}]`),
  );
  return [...new Set(values)].sort(compareText);
}

function projectedStringArray(value: unknown, path: string): string[] {
  return value === undefined || value === null ? [] : stringArray(value, path);
}

function requireUnique<T>(
  values: readonly T[],
  identity: (value: T) => string,
  path: string,
): void {
  const ids = values.map(identity);
  if (new Set(ids).size !== ids.length) {
    throw new Error(`${path} contains duplicate analytical identities.`);
  }
}

function canonicalRelease(value: unknown, index: number) {
  const path = `analyticalSource.releases[${index}]`;
  const record = exactRecord(
    value,
    [
      "id",
      "lifecycle",
      "publicReleaseDate",
      "statusEffectiveOn",
      "statusFirstObservedAt",
    ],
    path,
  );
  return {
    id: requiredString(record.id, `${path}.id`),
    ...optionalFields(record, [
      "lifecycle",
      "publicReleaseDate",
      "statusEffectiveOn",
      "statusFirstObservedAt",
    ]),
  };
}

function canonicalEvent(value: unknown, index: number) {
  const path = `analyticalSource.events[${index}]`;
  const record = exactRecord(
    value,
    [
      "id",
      "stableEventId",
      "releaseId",
      "occurredOn",
      "firstObservedAt",
      "channel",
      "sequence",
      "sameDayOrder",
      "availability",
      "isRevision",
      "revisionOfId",
      "replacesEventId",
      "replacedByEventId",
      "closesReleaseCycle",
      "legacySourceId",
    ],
    path,
  );
  return {
    id: requiredString(record.id, `${path}.id`),
    releaseId: requiredString(record.releaseId, `${path}.releaseId`),
    occurredOn: requiredString(record.occurredOn, `${path}.occurredOn`),
    channel: requiredString(record.channel, `${path}.channel`),
    ...optionalFields(
      record,
      [
        "stableEventId",
        "firstObservedAt",
        "availability",
        "revisionOfId",
        "replacesEventId",
        "replacedByEventId",
        "legacySourceId",
      ],
      ["sequence", "sameDayOrder"],
      ["isRevision", "closesReleaseCycle"],
    ),
  };
}

function canonicalMilestone(value: unknown, index: number) {
  const path = `analyticalSource.compatibilityMilestones[${index}]`;
  const record = exactRecord(
    value,
    [
      "id",
      "releaseId",
      "occurredOn",
      "channel",
      "sequence",
      "sameDayOrder",
      "availability",
      "isRevision",
      "firstObservedAt",
    ],
    path,
  );
  return {
    id: requiredString(record.id, `${path}.id`),
    releaseId: requiredString(record.releaseId, `${path}.releaseId`),
    occurredOn: requiredString(record.occurredOn, `${path}.occurredOn`),
    ...optionalFields(
      record,
      ["channel", "availability", "firstObservedAt"],
      ["sequence", "sameDayOrder"],
      ["isRevision"],
    ),
  };
}

function canonicalReleaseMetadata(value: unknown, index: number) {
  const path = `analyticalSource.releaseMetadata[${index}]`;
  const record = exactRecord(
    value,
    [
      "releaseId",
      "platformId",
      "productFamilyId",
      "releaseClass",
      "releasePosition",
      "releaseCycleId",
      "sourceEvidenceIds",
      "chronologyCoverage",
    ],
    path,
  );
  const coverage = exactRecord(
    record.chronologyCoverage,
    ["state", "reason", "sourceEvidenceIds"],
    `${path}.chronologyCoverage`,
  );
  return {
    releaseId: requiredString(record.releaseId, `${path}.releaseId`),
    platformId: requiredString(record.platformId, `${path}.platformId`),
    ...optionalFields(
      record,
      ["productFamilyId", "releaseClass", "releaseCycleId"],
      ["releasePosition"],
    ),
    sourceEvidenceIds: projectedStringArray(
      record.sourceEvidenceIds,
      `${path}.sourceEvidenceIds`,
    ),
    chronologyCoverage: {
      ...optionalFields(coverage, ["state", "reason"]),
      sourceEvidenceIds: projectedStringArray(
        coverage.sourceEvidenceIds,
        `${path}.chronologyCoverage.sourceEvidenceIds`,
      ),
    },
  };
}

export function canonicalHistoricalAnalyticalSource(
  input: unknown,
): CanonicalHistoricalAnalyticalSource {
  const source = exactRecord(
    input,
    ["releases", "events", "compatibilityMilestones", "releaseMetadata"],
    "analyticalSource",
  );
  if (
    !Array.isArray(source.releases) ||
    !Array.isArray(source.events) ||
    !Array.isArray(source.compatibilityMilestones) ||
    !Array.isArray(source.releaseMetadata)
  ) {
    throw new Error("Analytical source collections must all be arrays.");
  }
  const releases = source.releases.map(canonicalRelease);
  const events = source.events.map(canonicalEvent);
  const compatibilityMilestones = source.compatibilityMilestones.map(
    canonicalMilestone,
  );
  const releaseMetadata = source.releaseMetadata.map(canonicalReleaseMetadata);
  requireUnique(releases, ({ id }) => id, "analyticalSource.releases");
  requireUnique(events, ({ id }) => id, "analyticalSource.events");
  requireUnique(
    compatibilityMilestones,
    ({ releaseId, id }) => `${releaseId}\u0000${id}`,
    "analyticalSource.compatibilityMilestones",
  );
  requireUnique(
    releaseMetadata,
    ({ releaseId }) => releaseId,
    "analyticalSource.releaseMetadata",
  );
  releases.sort((left, right) => compareText(left.id, right.id));
  events.sort((left, right) => compareText(left.id, right.id));
  compatibilityMilestones.sort((left, right) =>
    compareText(`${left.releaseId}\u0000${left.id}`, `${right.releaseId}\u0000${right.id}`),
  );
  releaseMetadata.sort((left, right) => compareText(left.releaseId, right.releaseId));
  return {
    releases,
    events,
    compatibilityMilestones,
    releaseMetadata,
  };
}

function referenceId(value: unknown): string | undefined {
  return isRecord(value) && typeof value._ref === "string" && value._ref.trim()
    ? value._ref
    : undefined;
}

function dereferencedIds(
  value: unknown,
  byId: ReadonlyMap<string, AnalyticalSnapshotDocument>,
): string[] {
  if (!Array.isArray(value)) return [];
  return value.flatMap((reference) => {
    const id = referenceId(reference);
    return id && byId.has(id) ? [id] : [];
  });
}

function compact(value: UnknownRecord): UnknownRecord {
  return Object.fromEntries(
    Object.entries(value).filter(([, field]) => field !== undefined && field !== null),
  );
}

export function projectHistoricalAnalyticalSourceFromSnapshot(
  documents: readonly UnknownRecord[],
): CanonicalHistoricalAnalyticalSource {
  const snapshotDocuments: AnalyticalSnapshotDocument[] = documents.map(
    (document, index) => ({
      ...document,
      _id: requiredString(document._id, `snapshot[${index}]._id`),
      _type: requiredString(document._type, `snapshot[${index}]._type`),
    }),
  );
  const byId = new Map(
    snapshotDocuments.map((document) => [document._id, document]),
  );
  const releases = snapshotDocuments
    .filter(({ _type }) => _type === "releaseVersion")
    .map((document) =>
      compact({
        id: document._id,
        lifecycle: document.releaseStatus,
        publicReleaseDate: document.publicReleaseDate,
        statusEffectiveOn: document.statusEffectiveDate,
        statusFirstObservedAt: document.statusFirstObservedAt,
      }),
    );
  const compatibilityMilestones = snapshotDocuments
    .filter(({ _type }) => _type === "releaseVersion")
    .flatMap((document) => {
      if (document.milestones === undefined || document.milestones === null) return [];
      if (!Array.isArray(document.milestones)) {
        throw new Error(`${document._id}.milestones must be an array.`);
      }
      return document.milestones.map((milestone, index) => {
        if (!isRecord(milestone)) {
          throw new Error(`${document._id}.milestones[${index}] must be an object.`);
        }
        return compact({
          id: milestone._key,
          releaseId: document._id,
          occurredOn: milestone.date,
          channel: milestone.channel,
          sequence: milestone.sequence,
          sameDayOrder: milestone.sameDayOrder,
          availability: milestone.availabilityState,
          isRevision: milestone.isRevision,
          firstObservedAt: milestone.firstObservedAt,
        });
      });
    });
  const events = snapshotDocuments
    .filter(({ _type }) => _type === "releaseEvent")
    .map((document) => {
      const releaseVersionReference = referenceId(document.releaseVersion);
      const releaseVersion = releaseVersionReference
        ? byId.get(releaseVersionReference)
        : undefined;
      const replaces = referenceId(document.replaces);
      const replacedBy = referenceId(document.replacedBy);
      const replacesStableEventId = replaces
        ? byId.get(replaces)?.stableEventId
        : undefined;
      const replacedByStableEventId = replacedBy
        ? byId.get(replacedBy)?.stableEventId
        : undefined;
      return compact({
        id: document._id,
        stableEventId: document.stableEventId,
        releaseId:
          releaseVersion?._type === "releaseVersion"
            ? releaseVersion._id
            : undefined,
        occurredOn: document.appearanceDate,
        firstObservedAt: document.firstObservedAt,
        channel: document.channel,
        sequence: document.sequence,
        sameDayOrder: document.sameDayOrder,
        availability: document.availabilityState,
        isRevision: document.isRevision,
        revisionOfId:
          document.isRevision === true ? replacesStableEventId : undefined,
        replacesEventId: replacesStableEventId,
        replacedByEventId: replacedByStableEventId,
        closesReleaseCycle: document.closesReleaseCycle,
        legacySourceId: document.legacySourceId,
      });
    });
  const releaseMetadata = snapshotDocuments
    .filter(({ _type }) => _type === "historicalReleaseMetadata")
    .map((document) => {
      const releaseVersionReference = referenceId(document.releaseVersion);
      const releaseVersion = releaseVersionReference
        ? byId.get(releaseVersionReference)
        : undefined;
      const releaseId =
        releaseVersion?._type === "releaseVersion"
          ? releaseVersion._id
          : undefined;
      const releaseTrainId = releaseVersion
        ? referenceId(releaseVersion.releaseTrain)
        : undefined;
      const releaseTrain = releaseTrainId ? byId.get(releaseTrainId) : undefined;
      const platformReference = releaseTrain
        ? referenceId(releaseTrain.platform)
        : undefined;
      const metadataEvidence = isRecord(document.metadataEvidence)
        ? document.metadataEvidence
        : {};
      const chronologyCoverage = isRecord(document.chronologyCoverage)
        ? document.chronologyCoverage
        : {};
      return compact({
        releaseId,
        platformId:
          platformReference && byId.has(platformReference)
            ? platformReference
            : undefined,
        productFamilyId: document.productFamilyId,
        releaseClass: document.releaseClass,
        releasePosition: document.releasePosition,
        releaseCycleId: document.releaseCycleId,
        sourceEvidenceIds: [
          ...dereferencedIds(metadataEvidence.productFamily, byId),
          ...dereferencedIds(metadataEvidence.releaseClass, byId),
          ...dereferencedIds(metadataEvidence.releasePosition, byId),
          ...dereferencedIds(metadataEvidence.releaseCycle, byId),
        ],
        chronologyCoverage: compact({
          state: chronologyCoverage.state,
          reason: chronologyCoverage.reason,
          sourceEvidenceIds: dereferencedIds(chronologyCoverage.evidence, byId),
        }),
      });
    });
  return canonicalHistoricalAnalyticalSource({
    releases,
    events,
    compatibilityMilestones,
    releaseMetadata,
  });
}

export function historicalAnalyticalSourceDigest(input: unknown): string {
  return createHash("sha256")
    .update(stableStringify(canonicalHistoricalAnalyticalSource(input)))
    .digest("hex");
}
