import { groq } from "next-sanity";

import {
  stableSerializeHistoricalAnalysis,
  type HistoricalReleaseMetadataV1,
} from "./historical-analysis-dataset";
import type {
  CompatibilityMilestoneInput,
  FirstClassReleaseEventInput,
  ReleaseObservationVersionInput,
} from "./release-observation-adapter";

/**
 * Raw, adapter-shaped Sanity input. The query performs field-name projection
 * only: callers still run the release-observation and historical validators.
 */
export interface PublishedHistoricalReleaseSource {
  releases: readonly ReleaseObservationVersionInput[];
  events: readonly FirstClassReleaseEventInput[];
  compatibilityMilestones: readonly CompatibilityMilestoneInput[];
  releaseMetadata: readonly HistoricalReleaseMetadataV1[];
}

export interface PublishedForecastShadowSource
  extends PublishedHistoricalReleaseSource {
  compatibilityMilestones: readonly ForecastShadowCompatibilityMilestoneInput[];
  /**
   * Frozen input for the public heuristic comparator. These rows are kept
   * separate from analytical truth and are admitted only after the pipeline
   * proves that each fact exists in the analytical projection at the same
   * cutoff.
   */
  legacyForecastReleases: readonly LegacyForecastReleaseInput[];
  legacyForecastMilestones: readonly LegacyForecastMilestoneInput[];
}

export interface ForecastShadowCompatibilityMilestoneInput
  extends CompatibilityMilestoneInput {
  /** Exact presentation label consumed only by the frozen legacy comparator. */
  displayLabel: string;
}

export interface LegacyForecastReleaseInput {
  id: string;
  version: string;
  lifecycle?: "active" | "released" | "superseded" | null;
  publicReleaseDate?: string | null;
  platform: {
    id: string;
    name: string;
    slug: string;
    sortOrder: number;
  };
}

export interface LegacyForecastMilestoneInput {
  id: string;
  releaseId: string;
  label: string;
  occurredOn: string;
}

export const FORECAST_SHADOW_MAX_SOURCE_RELEASES = 512;
export const FORECAST_SHADOW_MAX_SOURCE_EVENTS = 2_048;
export const FORECAST_SHADOW_MAX_SOURCE_COMPATIBILITY_MILESTONES = 2_048;
export const FORECAST_SHADOW_MAX_SOURCE_OBSERVATIONS = 4_096;
export const FORECAST_SHADOW_MAX_SOURCE_METADATA = 512;
export const FORECAST_SHADOW_MAX_SOURCE_LEGACY_RELEASES = 512;
export const FORECAST_SHADOW_MAX_SOURCE_LEGACY_MILESTONES = 2_048;
export const FORECAST_SHADOW_MAX_SOURCE_CANONICAL_BYTES = 2_097_152;
export const FORECAST_SHADOW_MAX_SOURCE_STRING_BYTES = 512;
export const FORECAST_SHADOW_MAX_SOURCE_EVIDENCE_ID_BYTES = 256;
export const FORECAST_SHADOW_MAX_SOURCE_EVIDENCE_IDS = 128;
export const FORECAST_SHADOW_MAX_SOURCE_NODES = 262_144;

export type PublishedHistoricalReleaseSourceValidationCode =
  | "invalid-source"
  | "chronology-mismatch"
  | "row-limit";

export class PublishedHistoricalReleaseSourceValidationError extends Error {
  constructor(
    public readonly code: PublishedHistoricalReleaseSourceValidationCode,
  ) {
    super(`Published historical release source is invalid: ${code}.`);
    this.name = "PublishedHistoricalReleaseSourceValidationError";
  }
}

const encoder = new TextEncoder();

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function canonicalInstant(value: unknown): value is string {
  if (typeof value !== "string") return false;
  const parsed = new Date(value);
  return !Number.isNaN(parsed.getTime()) && parsed.toISOString() === value;
}

function failSource(
  code: PublishedHistoricalReleaseSourceValidationCode,
): never {
  throw new PublishedHistoricalReleaseSourceValidationError(code);
}

function assertRawObservationInstant(value: unknown, issuedAt: string): void {
  if (value === undefined || value === null) return;
  if (!canonicalInstant(value)) failSource("invalid-source");
  if (value > issuedAt) failSource("chronology-mismatch");
}

function assertSourceValueBounds(source: PublishedHistoricalReleaseSource): void {
  type StackEntry =
    | { kind: "value"; value: unknown; field?: string }
    | { kind: "exit"; value: object };
  const ancestors = new WeakSet<object>();
  const stack: StackEntry[] = [{ kind: "value", value: source }];
  let nodeCount = 0;

  while (stack.length > 0) {
    const entry = stack.pop()!;
    if (entry.kind === "exit") {
      ancestors.delete(entry.value);
      continue;
    }
    nodeCount += 1;
    if (nodeCount > FORECAST_SHADOW_MAX_SOURCE_NODES) failSource("row-limit");

    const { value } = entry;
    if (
      value === undefined ||
      value === null ||
      typeof value === "boolean"
    ) {
      continue;
    }
    if (typeof value === "number") {
      if (!Number.isFinite(value)) failSource("invalid-source");
      continue;
    }
    if (typeof value === "string") {
      if (encoder.encode(value).byteLength > FORECAST_SHADOW_MAX_SOURCE_STRING_BYTES) {
        failSource("row-limit");
      }
      continue;
    }
    if (typeof value !== "object") failSource("invalid-source");

    const object = value as object;
    if (ancestors.has(object)) failSource("invalid-source");
    ancestors.add(object);
    stack.push({ kind: "exit", value: object });

    if (Array.isArray(value)) {
      if (entry.field === "sourceEvidenceIds") {
        if (value.length > FORECAST_SHADOW_MAX_SOURCE_EVIDENCE_IDS) {
          failSource("row-limit");
        }
        if (value.some((id) => typeof id !== "string")) {
          failSource("invalid-source");
        }
        if (
          value.some(
            (id) =>
              encoder.encode(id as string).byteLength >
              FORECAST_SHADOW_MAX_SOURCE_EVIDENCE_ID_BYTES,
          )
        ) {
          failSource("row-limit");
        }
      }
      for (let index = value.length - 1; index >= 0; index -= 1) {
        stack.push({ kind: "value", value: value[index] });
      }
      continue;
    }

    const prototype = Object.getPrototypeOf(value);
    if (prototype !== Object.prototype && prototype !== null) {
      failSource("invalid-source");
    }
    if (Object.getOwnPropertySymbols(value).length > 0) {
      failSource("invalid-source");
    }
    const entries = Object.entries(value as Record<string, unknown>);
    for (let index = entries.length - 1; index >= 0; index -= 1) {
      const [key, child] = entries[index]!;
      if (encoder.encode(key).byteLength > FORECAST_SHADOW_MAX_SOURCE_STRING_BYTES) {
        failSource("row-limit");
      }
      if (key === "sourceEvidenceIds" && !Array.isArray(child)) {
        failSource("invalid-source");
      }
      stack.push({ kind: "value", value: child, field: key });
    }
  }
}

const nullableReleaseFields = [
  "lifecycle",
  "publicReleaseDate",
  "statusEffectiveOn",
  "statusFirstObservedAt",
] as const;
const nullableMilestoneFields = [
  "channel",
  "sequence",
  "sameDayOrder",
  "availability",
  "isRevision",
  "firstObservedAt",
  "displayLabel",
  "note",
] as const;
const nullableEventFields = [
  "stableEventId",
  "firstObservedAt",
  "sequence",
  "sameDayOrder",
  "availability",
  "isRevision",
  "revisionOfId",
  "replacesEventId",
  "replacedByEventId",
  "closesReleaseCycle",
  "legacySourceId",
  "displayLabel",
  "note",
] as const;

function withoutNullFields<T extends object>(
  value: T,
  fields: readonly string[],
): T {
  let normalized: Record<string, unknown> | null = null;
  const record = value as Record<string, unknown>;
  for (const field of fields) {
    if (record[field] !== null) continue;
    normalized ??= { ...record };
    delete normalized[field];
  }
  return (normalized ?? record) as T;
}

function normalizeSanityNulls(
  source: PublishedHistoricalReleaseSource,
): PublishedHistoricalReleaseSource {
  return {
    releases: source.releases.map((release) =>
      withoutNullFields(release, nullableReleaseFields),
    ),
    events: source.events.map((event) =>
      withoutNullFields(event, nullableEventFields),
    ),
    compatibilityMilestones: source.compatibilityMilestones.map((milestone) =>
      withoutNullFields(milestone, nullableMilestoneFields),
    ),
    releaseMetadata: source.releaseMetadata.map((metadata) => {
      if (!isRecord(metadata.chronologyCoverage)) return metadata;
      const chronologyCoverage = withoutNullFields(
        metadata.chronologyCoverage,
        ["reason"],
      );
      return chronologyCoverage === metadata.chronologyCoverage
        ? metadata
        : ({ ...metadata, chronologyCoverage } as HistoricalReleaseMetadataV1);
    }),
  };
}

function optionalType(
  record: Record<string, unknown>,
  field: string,
  type: "boolean" | "number" | "string",
): boolean {
  return record[field] === undefined || typeof record[field] === type;
}

function assertNormalizedSourceShape(
  source: PublishedHistoricalReleaseSource,
): void {
  for (const release of source.releases) {
    const row = release as unknown as Record<string, unknown>;
    if (
      typeof row.id !== "string" ||
      !optionalType(row, "lifecycle", "string") ||
      !optionalType(row, "publicReleaseDate", "string") ||
      !optionalType(row, "statusEffectiveOn", "string") ||
      !optionalType(row, "statusFirstObservedAt", "string")
    ) {
      failSource("invalid-source");
    }
  }
  for (const milestone of source.compatibilityMilestones) {
    const row = milestone as unknown as Record<string, unknown>;
    if (
      typeof row.id !== "string" ||
      typeof row.releaseId !== "string" ||
      typeof row.occurredOn !== "string" ||
      !optionalType(row, "channel", "string") ||
      !optionalType(row, "sequence", "number") ||
      !optionalType(row, "sameDayOrder", "number") ||
      !optionalType(row, "availability", "string") ||
      !optionalType(row, "isRevision", "boolean") ||
      !optionalType(row, "firstObservedAt", "string") ||
      !optionalType(row, "displayLabel", "string") ||
      !optionalType(row, "note", "string")
    ) {
      failSource("invalid-source");
    }
  }
  for (const event of source.events) {
    const row = event as unknown as Record<string, unknown>;
    if (
      typeof row.id !== "string" ||
      typeof row.releaseId !== "string" ||
      typeof row.occurredOn !== "string" ||
      typeof row.channel !== "string" ||
      !optionalType(row, "stableEventId", "string") ||
      !optionalType(row, "firstObservedAt", "string") ||
      !optionalType(row, "sequence", "number") ||
      !optionalType(row, "sameDayOrder", "number") ||
      !optionalType(row, "availability", "string") ||
      !optionalType(row, "isRevision", "boolean") ||
      !optionalType(row, "revisionOfId", "string") ||
      !optionalType(row, "replacesEventId", "string") ||
      !optionalType(row, "replacedByEventId", "string") ||
      !optionalType(row, "closesReleaseCycle", "boolean") ||
      !optionalType(row, "legacySourceId", "string") ||
      !optionalType(row, "displayLabel", "string") ||
      !optionalType(row, "note", "string")
    ) {
      failSource("invalid-source");
    }
  }
  for (const metadata of source.releaseMetadata) {
    const row = metadata as unknown as Record<string, unknown>;
    const coverage = row.chronologyCoverage;
    if (
      typeof row.releaseId !== "string" ||
      typeof row.platformId !== "string" ||
      typeof row.productFamilyId !== "string" ||
      typeof row.releaseClass !== "string" ||
      typeof row.releasePosition !== "number" ||
      typeof row.releaseCycleId !== "string" ||
      !Array.isArray(row.sourceEvidenceIds) ||
      !isRecord(coverage) ||
      typeof coverage.state !== "string" ||
      !optionalType(coverage, "reason", "string") ||
      !Array.isArray(coverage.sourceEvidenceIds)
    ) {
      failSource("invalid-source");
    }
  }
}

/**
 * Validate the complete bounded raw source contract and normalize Sanity's
 * null projection for every optional scalar to the adapter's absent value.
 * Callers receive a safe snapshot that can be passed to both the historical
 * adapter and exact outcome-binding builder without semantic drift.
 */
export function validatePublishedHistoricalReleaseSource(
  value: unknown,
  issuedAt: string,
): PublishedHistoricalReleaseSource {
  if (!canonicalInstant(issuedAt) || !isRecord(value)) {
    failSource("invalid-source");
  }
  const source = value as unknown as PublishedHistoricalReleaseSource;
  if (
    !Array.isArray(source.releases) ||
    !Array.isArray(source.events) ||
    !Array.isArray(source.compatibilityMilestones) ||
    !Array.isArray(source.releaseMetadata)
  ) {
    failSource("invalid-source");
  }
  if (
    source.releases.length > FORECAST_SHADOW_MAX_SOURCE_RELEASES ||
    source.events.length > FORECAST_SHADOW_MAX_SOURCE_EVENTS ||
    source.compatibilityMilestones.length >
      FORECAST_SHADOW_MAX_SOURCE_COMPATIBILITY_MILESTONES ||
    source.events.length + source.compatibilityMilestones.length >
      FORECAST_SHADOW_MAX_SOURCE_OBSERVATIONS ||
    source.releaseMetadata.length > FORECAST_SHADOW_MAX_SOURCE_METADATA
  ) {
    failSource("row-limit");
  }
  if (
    source.releases.some((row) => !isRecord(row)) ||
    source.events.some((row) => !isRecord(row)) ||
    source.compatibilityMilestones.some((row) => !isRecord(row)) ||
    source.releaseMetadata.some((row) => !isRecord(row))
  ) {
    failSource("invalid-source");
  }

  assertSourceValueBounds(source);
  let canonicalBytes: number;
  try {
    canonicalBytes = encoder.encode(
      stableSerializeHistoricalAnalysis(source),
    ).byteLength;
  } catch {
    failSource("invalid-source");
  }
  if (canonicalBytes > FORECAST_SHADOW_MAX_SOURCE_CANONICAL_BYTES) {
    failSource("row-limit");
  }

  const normalized = normalizeSanityNulls(source);
  assertNormalizedSourceShape(normalized);

  for (const release of normalized.releases) {
    assertRawObservationInstant(release.statusFirstObservedAt, issuedAt);
  }
  for (const event of normalized.events) {
    assertRawObservationInstant(event.firstObservedAt, issuedAt);
  }
  for (const milestone of normalized.compatibilityMilestones) {
    assertRawObservationInstant(milestone.firstObservedAt, issuedAt);
  }

  return normalized;
}

function exactObjectKeys(
  value: Record<string, unknown>,
  required: readonly string[],
  optional: readonly string[] = [],
): boolean {
  const allowed = new Set([...required, ...optional]);
  return (
    required.every((key) => Object.hasOwn(value, key)) &&
    Object.keys(value).every((key) => allowed.has(key))
  );
}

function nonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function validIsoDay(value: unknown): value is string {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return false;
  }
  const [year, month, day] = value.split("-").map(Number);
  const parsed = new Date(Date.UTC(year, month - 1, day));
  return (
    parsed.getUTCFullYear() === year &&
    parsed.getUTCMonth() === month - 1 &&
    parsed.getUTCDate() === day
  );
}

function validLegacyForecastRelease(
  value: unknown,
): value is LegacyForecastReleaseInput {
  if (
    !isRecord(value) ||
    !exactObjectKeys(
      value,
      ["id", "version", "platform"],
      ["lifecycle", "publicReleaseDate"],
    ) ||
    !nonEmptyString(value.id) ||
    !nonEmptyString(value.version) ||
    !isRecord(value.platform) ||
    !exactObjectKeys(value.platform, ["id", "name", "slug", "sortOrder"]) ||
    !nonEmptyString(value.platform.id) ||
    !nonEmptyString(value.platform.name) ||
    !nonEmptyString(value.platform.slug) ||
    !Number.isSafeInteger(value.platform.sortOrder)
  ) {
    return false;
  }
  if (
    value.lifecycle !== undefined &&
    value.lifecycle !== null &&
    !["active", "released", "superseded"].includes(value.lifecycle as string)
  ) {
    return false;
  }
  return (
    value.publicReleaseDate === undefined ||
    value.publicReleaseDate === null ||
    validIsoDay(value.publicReleaseDate)
  );
}

function validLegacyForecastMilestone(
  value: unknown,
): value is LegacyForecastMilestoneInput {
  return (
    isRecord(value) &&
    exactObjectKeys(value, ["id", "releaseId", "label", "occurredOn"]) &&
    nonEmptyString(value.id) &&
    nonEmptyString(value.releaseId) &&
    nonEmptyString(value.label) &&
    validIsoDay(value.occurredOn)
  );
}

/**
 * Validate the route-only extension used to freeze the existing public
 * heuristic at forecast origin. The analytical arrays use the shared
 * normalizer; the separate legacy projection must be complete and match the
 * exact release and compatibility-milestone identities.
 */
export function validatePublishedForecastShadowSource(
  value: unknown,
  issuedAt: string,
): PublishedForecastShadowSource {
  if (!isRecord(value)) failSource("invalid-source");
  const raw = value as unknown as PublishedForecastShadowSource;
  if (
    !Array.isArray(raw.legacyForecastReleases) ||
    !Array.isArray(raw.legacyForecastMilestones) ||
    raw.legacyForecastReleases.length >
      FORECAST_SHADOW_MAX_SOURCE_LEGACY_RELEASES ||
    raw.legacyForecastMilestones.length >
      FORECAST_SHADOW_MAX_SOURCE_LEGACY_MILESTONES
  ) {
    failSource("row-limit");
  }
  if (
    raw.legacyForecastReleases.some(
      (release) => !validLegacyForecastRelease(release),
    ) ||
    raw.legacyForecastMilestones.some(
      (milestone) => !validLegacyForecastMilestone(milestone),
    )
  ) {
    failSource("invalid-source");
  }

  // This call performs the shared node, string, evidence, canonical-byte,
  // chronology, and analytical-row checks against the complete raw object.
  const analytical = validatePublishedHistoricalReleaseSource(value, issuedAt);
  const analyticalReleaseIds = analytical.releases
    .map(({ id }) => id)
    .sort();
  const legacyReleaseIds = raw.legacyForecastReleases
    .map(({ id }) => id)
    .sort();
  if (
    new Set(analyticalReleaseIds).size !== analyticalReleaseIds.length ||
    new Set(legacyReleaseIds).size !== legacyReleaseIds.length ||
    stableSerializeHistoricalAnalysis(analyticalReleaseIds) !==
      stableSerializeHistoricalAnalysis(legacyReleaseIds)
  ) {
    failSource("invalid-source");
  }

  const analyticalMilestones = new Map<string, CompatibilityMilestoneInput>();
  for (const milestone of analytical.compatibilityMilestones) {
    const key = `${milestone.releaseId}\u0000${milestone.id}`;
    if (analyticalMilestones.has(key)) failSource("invalid-source");
    analyticalMilestones.set(key, milestone);
  }
  const legacyMilestoneKeys = new Set<string>();
  for (const milestone of raw.legacyForecastMilestones) {
    const key = `${milestone.releaseId}\u0000${milestone.id}`;
    const analyticalMilestone = analyticalMilestones.get(key);
    if (
      legacyMilestoneKeys.has(key) ||
      !analyticalMilestone ||
      analyticalMilestone.occurredOn !== milestone.occurredOn ||
      analyticalMilestone.displayLabel !== milestone.label
    ) {
      failSource("invalid-source");
    }
    legacyMilestoneKeys.add(key);
  }
  if (
    legacyMilestoneKeys.size !== analyticalMilestones.size ||
    [...analyticalMilestones.keys()].some(
      (key) => !legacyMilestoneKeys.has(key),
    )
  ) {
    failSource("invalid-source");
  }

  return {
    ...analytical,
    compatibilityMilestones:
      analytical.compatibilityMilestones as readonly ForecastShadowCompatibilityMilestoneInput[],
    legacyForecastReleases: raw.legacyForecastReleases.map((release) => ({
      ...release,
      platform: { ...release.platform },
    })),
    legacyForecastMilestones: raw.legacyForecastMilestones.map(
      (milestone) => ({ ...milestone }),
    ),
  };
}

const boundedCollectionNames = [
  "releases",
  "events",
  "compatibilityMilestones",
  "releaseMetadata",
  "legacyForecastReleases",
  "legacyForecastMilestones",
] as const;

type BoundedCollectionName = (typeof boundedCollectionNames)[number];

interface ForecastShadowSourceEnvelope {
  releases: unknown;
  events: unknown;
  compatibilityMilestones: unknown;
  releaseMetadata: unknown;
  legacyForecastReleases: unknown;
  legacyForecastMilestones: unknown;
  sourceCounts: Record<BoundedCollectionName | "observations", unknown>;
  sourceOverflow: Record<BoundedCollectionName | "observations", unknown>;
}

export class ForecastShadowSourceEnvelopeError extends Error {
  constructor() {
    super("The bounded forecast source envelope is invalid.");
    this.name = "ForecastShadowSourceEnvelopeError";
  }
}

const collectionLimits: Record<BoundedCollectionName, number> = {
  releases: FORECAST_SHADOW_MAX_SOURCE_RELEASES,
  events: FORECAST_SHADOW_MAX_SOURCE_EVENTS,
  compatibilityMilestones:
    FORECAST_SHADOW_MAX_SOURCE_COMPATIBILITY_MILESTONES,
  releaseMetadata: FORECAST_SHADOW_MAX_SOURCE_METADATA,
  legacyForecastReleases: FORECAST_SHADOW_MAX_SOURCE_LEGACY_RELEASES,
  legacyForecastMilestones: FORECAST_SHADOW_MAX_SOURCE_LEGACY_MILESTONES,
};

/**
 * Verify the count and overflow sentinels returned by the bounded route query.
 * A sliced array is never accepted as a complete source snapshot.
 */
export function extractBoundedForecastShadowSource(
  value: unknown,
): PublishedForecastShadowSource {
  if (!isRecord(value)) throw new ForecastShadowSourceEnvelopeError();
  const envelope = value as unknown as ForecastShadowSourceEnvelope;
  if (!isRecord(envelope.sourceCounts) || !isRecord(envelope.sourceOverflow)) {
    throw new ForecastShadowSourceEnvelopeError();
  }

  for (const name of boundedCollectionNames) {
    const rows = envelope[name];
    const count = envelope.sourceCounts[name];
    const overflow = envelope.sourceOverflow[name];
    const limit = collectionLimits[name];
    if (
      !Array.isArray(rows) ||
      !Number.isSafeInteger(count) ||
      (count as number) < 0 ||
      typeof overflow !== "boolean" ||
      overflow !== ((count as number) > limit) ||
      (count as number) > limit ||
      rows.length !== count
    ) {
      throw new ForecastShadowSourceEnvelopeError();
    }
  }

  const observationCount = envelope.sourceCounts.observations;
  const observationOverflow = envelope.sourceOverflow.observations;
  const expectedObservationCount =
    (envelope.sourceCounts.events as number) +
    (envelope.sourceCounts.compatibilityMilestones as number);
  if (
    !Number.isSafeInteger(observationCount) ||
    observationCount !== expectedObservationCount ||
    typeof observationOverflow !== "boolean" ||
    observationOverflow !==
      (expectedObservationCount > FORECAST_SHADOW_MAX_SOURCE_OBSERVATIONS) ||
    expectedObservationCount > FORECAST_SHADOW_MAX_SOURCE_OBSERVATIONS
  ) {
    throw new ForecastShadowSourceEnvelopeError();
  }

  return {
    releases:
      envelope.releases as PublishedForecastShadowSource["releases"],
    events: envelope.events as PublishedForecastShadowSource["events"],
    compatibilityMilestones:
      envelope.compatibilityMilestones as PublishedForecastShadowSource["compatibilityMilestones"],
    releaseMetadata:
      envelope.releaseMetadata as PublishedForecastShadowSource["releaseMetadata"],
    legacyForecastReleases:
      envelope.legacyForecastReleases as PublishedForecastShadowSource["legacyForecastReleases"],
    legacyForecastMilestones:
      envelope.legacyForecastMilestones as PublishedForecastShadowSource["legacyForecastMilestones"],
  };
}

/**
 * Dereferences must use the published perspective as well as the explicit
 * document filters in the query. This prevents a preview client from mixing a
 * published event with draft relation or sidecar values.
 */
export const PUBLISHED_HISTORICAL_RELEASE_FETCH_OPTIONS = {
  perspective: "published",
} as const;

/**
 * Published-only raw input for the release-observation adapter and FR-007
 * historical dataset. Display versions, labels, notes, `_updatedAt`, and array
 * position never participate in an analytical identity or chronology.
 */
export const publishedHistoricalReleaseSourceQuery = groq`
  {
    "releases": *[
      _type == "releaseVersion" &&
      !(_id in path("drafts.**"))
    ] {
      "id": _id,
      "lifecycle": releaseStatus,
      publicReleaseDate,
      "statusEffectiveOn": statusEffectiveDate,
      statusFirstObservedAt
    },
    "compatibilityMilestones": *[
      _type == "releaseVersion" &&
      !(_id in path("drafts.**"))
    ] {
      "milestones": milestones[] {
        "id": _key,
        "releaseId": ^._id,
        "occurredOn": date,
        channel,
        sequence,
        sameDayOrder,
        "availability": availabilityState,
        isRevision,
        firstObservedAt
      }
    }.milestones[],
    "events": *[
      _type == "releaseEvent" &&
      !(_id in path("drafts.**"))
    ] {
      "id": _id,
      stableEventId,
      "releaseId": releaseVersion->_id,
      "occurredOn": appearanceDate,
      firstObservedAt,
      channel,
      sequence,
      sameDayOrder,
      "availability": availabilityState,
      isRevision,
      "revisionOfId": select(
        isRevision == true => replaces->stableEventId
      ),
      "replacesEventId": replaces->stableEventId,
      "replacedByEventId": replacedBy->stableEventId,
      closesReleaseCycle,
      legacySourceId
    },
    "releaseMetadata": *[
      _type == "historicalReleaseMetadata" &&
      !(_id in path("drafts.**"))
    ] {
      "releaseId": releaseVersion->_id,
      "platformId": releaseVersion->releaseTrain->platform->_id,
      productFamilyId,
      releaseClass,
      releasePosition,
      releaseCycleId,
      "sourceEvidenceIds": array::unique(
        metadataEvidence.productFamily[]->_id +
        metadataEvidence.releaseClass[]->_id +
        metadataEvidence.releasePosition[]->_id +
        metadataEvidence.releaseCycle[]->_id
      ),
      "chronologyCoverage": {
        "state": chronologyCoverage.state,
        "reason": chronologyCoverage.reason,
        "sourceEvidenceIds": chronologyCoverage.evidence[]->_id
      }
    }
  }
`;

/**
 * Route-only projection. Each collection returns at most limit + 1 rows and
 * carries independent count and overflow sentinels. The unsliced projection
 * above remains the migration and offline-planning source.
 */
export const boundedForecastShadowSourceQuery = groq`
  {
    "releases": *[
      _type == "releaseVersion" &&
      !(_id in path("drafts.**"))
    ] | order(_id asc) [0...${FORECAST_SHADOW_MAX_SOURCE_RELEASES + 1}] {
      "id": _id,
      "lifecycle": releaseStatus,
      publicReleaseDate,
      "statusEffectiveOn": statusEffectiveDate,
      statusFirstObservedAt
    },
    "compatibilityMilestones": (*[
      _type == "releaseVersion" &&
      !(_id in path("drafts.**"))
    ] | order(_id asc) {
      "milestones": milestones[] | order(_key asc) {
        "id": _key,
        "releaseId": ^._id,
        "occurredOn": date,
        channel,
        sequence,
        sameDayOrder,
        "availability": availabilityState,
        isRevision,
        firstObservedAt,
        "displayLabel": label
      }
    }.milestones[])[0...${FORECAST_SHADOW_MAX_SOURCE_COMPATIBILITY_MILESTONES + 1}],
    "events": *[
      _type == "releaseEvent" &&
      !(_id in path("drafts.**"))
    ] | order(_id asc) [0...${FORECAST_SHADOW_MAX_SOURCE_EVENTS + 1}] {
      "id": _id,
      stableEventId,
      "releaseId": releaseVersion->_id,
      "occurredOn": appearanceDate,
      firstObservedAt,
      channel,
      sequence,
      sameDayOrder,
      "availability": availabilityState,
      isRevision,
      "revisionOfId": select(
        isRevision == true => replaces->stableEventId
      ),
      "replacesEventId": replaces->stableEventId,
      "replacedByEventId": replacedBy->stableEventId,
      closesReleaseCycle,
      legacySourceId
    },
    "releaseMetadata": *[
      _type == "historicalReleaseMetadata" &&
      !(_id in path("drafts.**"))
    ] | order(_id asc) [0...${FORECAST_SHADOW_MAX_SOURCE_METADATA + 1}] {
      "releaseId": releaseVersion->_id,
      "platformId": releaseVersion->releaseTrain->platform->_id,
      productFamilyId,
      releaseClass,
      releasePosition,
      releaseCycleId,
      "sourceEvidenceIds": array::unique(
        metadataEvidence.productFamily[]->_id +
        metadataEvidence.releaseClass[]->_id +
        metadataEvidence.releasePosition[]->_id +
        metadataEvidence.releaseCycle[]->_id
      ),
      "chronologyCoverage": {
        "state": chronologyCoverage.state,
        "reason": chronologyCoverage.reason,
        "sourceEvidenceIds": chronologyCoverage.evidence[]->_id
      }
    },
    "legacyForecastReleases": *[
      _type == "releaseVersion" &&
      !(_id in path("drafts.**"))
    ] | order(_id asc) [0...${FORECAST_SHADOW_MAX_SOURCE_LEGACY_RELEASES + 1}] {
      "id": _id,
      version,
      "lifecycle": releaseStatus,
      publicReleaseDate,
      "platform": {
        "id": releaseTrain->platform->_id,
        "name": releaseTrain->platform->name,
        "slug": releaseTrain->platform->slug.current,
        "sortOrder": releaseTrain->platform->sortOrder
      }
    },
    "legacyForecastMilestones": (*[
      _type == "releaseVersion" &&
      !(_id in path("drafts.**"))
    ] | order(_id asc) {
      "milestones": milestones[] | order(_key asc) {
        "id": _key,
        "releaseId": ^._id,
        label,
        "occurredOn": date
      }
    }.milestones[])[0...${FORECAST_SHADOW_MAX_SOURCE_LEGACY_MILESTONES + 1}],
    "sourceCounts": {
      "releases": count(*[
        _type == "releaseVersion" && !(_id in path("drafts.**"))
      ]),
      "events": count(*[
        _type == "releaseEvent" && !(_id in path("drafts.**"))
      ]),
      "compatibilityMilestones": count(*[
        _type == "releaseVersion" && !(_id in path("drafts.**"))
      ].milestones[]),
      "releaseMetadata": count(*[
        _type == "historicalReleaseMetadata" && !(_id in path("drafts.**"))
      ]),
      "legacyForecastReleases": count(*[
        _type == "releaseVersion" && !(_id in path("drafts.**"))
      ]),
      "legacyForecastMilestones": count(*[
        _type == "releaseVersion" && !(_id in path("drafts.**"))
      ].milestones[]),
      "observations": count(*[
        _type == "releaseEvent" && !(_id in path("drafts.**"))
      ]) + count(*[
        _type == "releaseVersion" && !(_id in path("drafts.**"))
      ].milestones[])
    },
    "sourceOverflow": {
      "releases": count(*[
        _type == "releaseVersion" && !(_id in path("drafts.**"))
      ]) > ${FORECAST_SHADOW_MAX_SOURCE_RELEASES},
      "events": count(*[
        _type == "releaseEvent" && !(_id in path("drafts.**"))
      ]) > ${FORECAST_SHADOW_MAX_SOURCE_EVENTS},
      "compatibilityMilestones": count(*[
        _type == "releaseVersion" && !(_id in path("drafts.**"))
      ].milestones[]) > ${FORECAST_SHADOW_MAX_SOURCE_COMPATIBILITY_MILESTONES},
      "releaseMetadata": count(*[
        _type == "historicalReleaseMetadata" && !(_id in path("drafts.**"))
      ]) > ${FORECAST_SHADOW_MAX_SOURCE_METADATA},
      "legacyForecastReleases": count(*[
        _type == "releaseVersion" && !(_id in path("drafts.**"))
      ]) > ${FORECAST_SHADOW_MAX_SOURCE_LEGACY_RELEASES},
      "legacyForecastMilestones": count(*[
        _type == "releaseVersion" && !(_id in path("drafts.**"))
      ].milestones[]) > ${FORECAST_SHADOW_MAX_SOURCE_LEGACY_MILESTONES},
      "observations": count(*[
        _type == "releaseEvent" && !(_id in path("drafts.**"))
      ]) + count(*[
        _type == "releaseVersion" && !(_id in path("drafts.**"))
      ].milestones[]) > ${FORECAST_SHADOW_MAX_SOURCE_OBSERVATIONS}
    }
  }
`;
