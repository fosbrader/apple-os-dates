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
