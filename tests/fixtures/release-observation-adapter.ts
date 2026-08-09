import type { ReleaseObservationAdapterInput } from "../../src/lib/release-observation-adapter";

export function releaseObservationFixture(): ReleaseObservationAdapterInput {
  return {
    asOfDate: "2026-08-09",
    issuedAt: "2026-08-09T12:00:00.000Z",
    releases: [
      { id: "release.ios.27", lifecycle: "active" },
      {
        id: "release.ios.26",
        lifecycle: "released",
        publicReleaseDate: "2025-09-15",
        statusEffectiveOn: "2025-09-15",
        statusFirstObservedAt: "2025-09-15T18:00:00.000Z",
      },
    ],
    compatibilityMilestones: [
      {
        id: "beta-2",
        releaseId: "release.ios.27",
        occurredOn: "2026-07-20",
        channel: "developerBeta",
        sequence: 2,
        availability: "available",
        displayLabel: "Beta 2",
      },
      {
        id: "public-beta-2",
        releaseId: "release.ios.27",
        occurredOn: "2026-07-20",
        channel: "publicBeta",
        sequence: 2,
        availability: "available",
        displayLabel: "Public Beta 2",
      },
    ],
    events: [
      {
        id: "document.beta-2-revision",
        stableEventId: "event:ios:27:developer-beta-2-revision",
        releaseId: "release.ios.27",
        occurredOn: "2026-07-21",
        firstObservedAt: "2026-07-21T11:30:00.000Z",
        channel: "developerBeta",
        sequence: 2,
        availability: "available",
        isRevision: false,
        legacySourceId: "release.ios.27:beta-2",
        displayLabel: "Developer seed (edited display copy)",
      },
    ],
  };
}
