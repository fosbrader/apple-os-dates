import { groq } from "next-sanity";

import type { HistoricalReleaseMetadataV1 } from "./historical-analysis-dataset";
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

export const FORECAST_SHADOW_MAX_SOURCE_RELEASES = 512;
export const FORECAST_SHADOW_MAX_SOURCE_EVENTS = 2_048;
export const FORECAST_SHADOW_MAX_SOURCE_COMPATIBILITY_MILESTONES = 2_048;
export const FORECAST_SHADOW_MAX_SOURCE_OBSERVATIONS = 4_096;
export const FORECAST_SHADOW_MAX_SOURCE_METADATA = 512;
export const FORECAST_SHADOW_MAX_SOURCE_CANONICAL_BYTES = 2_097_152;
export const FORECAST_SHADOW_MAX_SOURCE_STRING_BYTES = 512;
export const FORECAST_SHADOW_MAX_SOURCE_EVIDENCE_ID_BYTES = 256;
export const FORECAST_SHADOW_MAX_SOURCE_EVIDENCE_IDS = 128;

const boundedCollectionNames = [
  "releases",
  "events",
  "compatibilityMilestones",
  "releaseMetadata",
] as const;

type BoundedCollectionName = (typeof boundedCollectionNames)[number];

interface ForecastShadowSourceEnvelope {
  releases: unknown;
  events: unknown;
  compatibilityMilestones: unknown;
  releaseMetadata: unknown;
  sourceCounts: Record<BoundedCollectionName | "observations", unknown>;
  sourceOverflow: Record<BoundedCollectionName | "observations", unknown>;
}

export class ForecastShadowSourceEnvelopeError extends Error {
  constructor() {
    super("The bounded forecast source envelope is invalid.");
    this.name = "ForecastShadowSourceEnvelopeError";
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

const collectionLimits: Record<BoundedCollectionName, number> = {
  releases: FORECAST_SHADOW_MAX_SOURCE_RELEASES,
  events: FORECAST_SHADOW_MAX_SOURCE_EVENTS,
  compatibilityMilestones:
    FORECAST_SHADOW_MAX_SOURCE_COMPATIBILITY_MILESTONES,
  releaseMetadata: FORECAST_SHADOW_MAX_SOURCE_METADATA,
};

/**
 * Verify the count and overflow sentinels returned by the bounded route query.
 * A sliced array is never accepted as a complete source snapshot.
 */
export function extractBoundedForecastShadowSource(
  value: unknown,
): PublishedHistoricalReleaseSource {
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
      envelope.releases as PublishedHistoricalReleaseSource["releases"],
    events: envelope.events as PublishedHistoricalReleaseSource["events"],
    compatibilityMilestones:
      envelope.compatibilityMilestones as PublishedHistoricalReleaseSource["compatibilityMilestones"],
    releaseMetadata:
      envelope.releaseMetadata as PublishedHistoricalReleaseSource["releaseMetadata"],
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
        firstObservedAt
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
      "observations": count(*[
        _type == "releaseEvent" && !(_id in path("drafts.**"))
      ]) + count(*[
        _type == "releaseVersion" && !(_id in path("drafts.**"))
      ].milestones[]) > ${FORECAST_SHADOW_MAX_SOURCE_OBSERVATIONS}
    }
  }
`;
