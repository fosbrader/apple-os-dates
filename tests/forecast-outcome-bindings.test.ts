import assert from "node:assert/strict";
import test from "node:test";

import {
  ForecastOutcomeBindingError,
  buildForecastOutcomeInstantBindings,
} from "../src/lib/forecast-outcome-bindings";
import { buildHistoricalAnalysisDataset } from "../src/lib/historical-analysis-dataset";
import {
  validatePublishedHistoricalReleaseSource,
  type PublishedHistoricalReleaseSource,
} from "../src/lib/historical-release-source";
import { adaptReleaseObservations } from "../src/lib/release-observation-adapter";

const ISSUED_AT = "2026-08-09T12:43:00.000Z";

function source(): PublishedHistoricalReleaseSource {
  return {
    releases: [
      {
        id: "ios-27",
        lifecycle: "released",
        publicReleaseDate: "2026-08-09",
        statusEffectiveOn: "2026-08-09",
        statusFirstObservedAt: "2026-08-09T12:40:00.000Z",
      },
    ],
    events: [
      {
        id: "event-doc-db1",
        stableEventId: "ios-27-db1",
        releaseId: "ios-27",
        occurredOn: "2026-08-01",
        firstObservedAt: "2026-08-01T12:00:00.000Z",
        channel: "developerBeta",
        sequence: 1,
        availability: "available",
      },
    ],
    compatibilityMilestones: [
      {
        id: "legacy-pb1",
        releaseId: "ios-27",
        occurredOn: "2026-08-05",
        firstObservedAt: "2026-08-05T15:30:00.000Z",
        channel: "publicBeta",
        sequence: 1,
        availability: "available",
      },
    ],
    releaseMetadata: [
      {
        releaseId: "ios-27",
        platformId: "ios",
        productFamilyId: "iphone-os",
        releaseClass: "major",
        releasePosition: 1,
        releaseCycleId: "cycle-ios-27",
        chronologyCoverage: {
          state: "complete",
          sourceEvidenceIds: ["coverage:ios-27"],
        },
        sourceEvidenceIds: ["metadata:ios-27"],
      },
    ],
  };
}

function dataset(value: PublishedHistoricalReleaseSource) {
  return buildHistoricalAnalysisDataset({
    adapterResult: adaptReleaseObservations({
      asOfDate: "2026-08-09",
      issuedAt: ISSUED_AT,
      releases: value.releases,
      events: value.events,
      compatibilityMilestones: value.compatibilityMilestones,
    }),
    releaseMetadata: value.releaseMetadata,
  });
}

function assertBindingError(
  run: () => unknown,
  code: ForecastOutcomeBindingError["code"],
): void {
  assert.throws(
    run,
    (error: unknown) =>
      error instanceof ForecastOutcomeBindingError && error.code === code,
  );
}

test("forecast outcome bindings retain exact source observation instants", () => {
  const value = source();
  const result = buildForecastOutcomeInstantBindings(value, dataset(value));
  assert.deepEqual(result, [
    {
      bindingVersion: "forecast-outcome-instant-binding/v1",
      evidenceId: "event:ios-27-db1",
      firstObservedAt: "2026-08-01T12:00:00.000Z",
    },
    {
      bindingVersion: "forecast-outcome-instant-binding/v1",
      evidenceId: "legacy:ios-27:legacy-pb1",
      firstObservedAt: "2026-08-05T15:30:00.000Z",
    },
    {
      bindingVersion: "forecast-outcome-instant-binding/v1",
      evidenceId: "release:ios-27:outcome",
      firstObservedAt: "2026-08-09T12:40:00.000Z",
    },
  ]);
});

test("forecast outcome bindings are source-order invariant", () => {
  const value = source();
  const reversed = {
    ...value,
    events: [...value.events].reverse(),
    compatibilityMilestones: [...value.compatibilityMilestones].reverse(),
  };
  assert.deepEqual(
    buildForecastOutcomeInstantBindings(reversed, dataset(reversed)),
    buildForecastOutcomeInstantBindings(value, dataset(value)),
  );
});

test("forecast outcome bindings reject ambiguous and post-snapshot evidence", () => {
  const value = source();
  const duplicate = {
    ...value,
    events: [...value.events, { ...value.events[0]!, id: "other-doc" }],
  };
  assertBindingError(
    () => buildForecastOutcomeInstantBindings(duplicate, dataset(value)),
    "ambiguous-evidence",
  );

  const future = {
    ...value,
    events: value.events.map((event) => ({
      ...event,
      firstObservedAt: "2026-08-09T23:59:00.000Z",
    })),
  };
  assertBindingError(
    () => buildForecastOutcomeInstantBindings(future, dataset(value)),
    "chronology-mismatch",
  );
});

test("forecast outcome bindings require the dataset's exact event semantics", () => {
  const value = source();
  const originalDataset = dataset(value);
  const variants: PublishedHistoricalReleaseSource[] = [
    {
      ...value,
      releases: [
        ...value.releases,
        {
          id: "other-release",
          lifecycle: "active" as const,
        },
      ],
      events: value.events.map((event) => ({
        ...event,
        releaseId: "other-release",
      })),
      releaseMetadata: [
        ...value.releaseMetadata,
        {
          releaseId: "other-release",
          platformId: "ios",
          productFamilyId: "iphone-os",
          releaseClass: "major" as const,
          releasePosition: 2,
          releaseCycleId: "cycle-ios-28",
          chronologyCoverage: {
            state: "complete" as const,
            sourceEvidenceIds: ["coverage:other-release"],
          },
          sourceEvidenceIds: ["metadata:other-release"],
        },
      ],
    },
    {
      ...value,
      events: value.events.map((event) => ({
        ...event,
        occurredOn: "2026-07-31",
      })),
    },
    {
      ...value,
      events: value.events.map((event) => ({
        ...event,
        channel: "releaseCandidate" as const,
      })),
    },
  ];

  for (const variant of variants) {
    assertBindingError(
      () => buildForecastOutcomeInstantBindings(variant, originalDataset),
      "source-dataset-mismatch",
    );
  }
});

test("forecast outcome bindings reject metadata, lifecycle, date, and stable-id drift", () => {
  const value = source();
  const originalDataset = dataset(value);
  const variants: PublishedHistoricalReleaseSource[] = [
    {
      ...value,
      releaseMetadata: value.releaseMetadata.map((metadata) => ({
        ...metadata,
        productFamilyId: "tablet-os",
      })),
    },
    {
      ...value,
      releases: value.releases.map((release) => ({
        ...release,
        lifecycle: "active" as const,
      })),
    },
    {
      ...value,
      releases: value.releases.map((release) => ({
        ...release,
        publicReleaseDate: "2026-08-08",
        statusEffectiveOn: "2026-08-08",
      })),
    },
    {
      ...value,
      events: value.events.map((event) => ({
        ...event,
        stableEventId: "ios-27-db1-drifted",
      })),
    },
    { ...value, events: [] },
  ];

  for (const variant of variants) {
    assertBindingError(
      () => buildForecastOutcomeInstantBindings(variant, originalDataset),
      "source-dataset-mismatch",
    );
  }
});

test("forecast outcome bindings enforce raw row bounds before rebuilding", () => {
  const value = source();
  const unbounded = {
    ...value,
    events: Array.from({ length: 9_001 }, () => value.events[0]!),
  };

  assertBindingError(
    () => buildForecastOutcomeInstantBindings(unbounded, dataset(value)),
    "row-limit",
  );
});

test("forecast outcome bindings validate derived IDs after prefix expansion", () => {
  for (const stableEventId of ["unsafe\u0001id", "x".repeat(510)]) {
    const value = source();
    const unsafe = {
      ...value,
      events: value.events.map((event) => ({ ...event, stableEventId })),
    };
    assertBindingError(
      () => buildForecastOutcomeInstantBindings(unsafe, dataset(unsafe)),
      "invalid-source",
    );
  }
});

test("forecast outcome bindings normalize a GROQ-shaped null projection", () => {
  const value = source();
  const groqShaped = {
    releases: value.releases.map((release) => ({
      ...release,
      lifecycle: null,
      statusEffectiveOn: null,
      statusFirstObservedAt: null,
    })),
    events: value.events.map((event) => ({
      ...event,
      stableEventId: null,
      firstObservedAt: null,
      sameDayOrder: null,
      availability: null,
      isRevision: null,
      revisionOfId: null,
      replacesEventId: null,
      replacedByEventId: null,
      closesReleaseCycle: null,
      legacySourceId: null,
    })),
    compatibilityMilestones: value.compatibilityMilestones.map((milestone) => ({
      ...milestone,
      firstObservedAt: null,
      sameDayOrder: null,
      availability: null,
      isRevision: null,
    })),
    releaseMetadata: value.releaseMetadata.map((metadata) => ({
      ...metadata,
      chronologyCoverage: {
        ...metadata.chronologyCoverage,
        reason: null,
      },
    })),
  } as unknown as PublishedHistoricalReleaseSource;
  const normalized = validatePublishedHistoricalReleaseSource(
    groqShaped,
    ISSUED_AT,
  );

  assert.equal("lifecycle" in normalized.releases[0]!, false);
  assert.equal("sameDayOrder" in normalized.events[0]!, false);
  assert.equal(
    "reason" in normalized.releaseMetadata[0]!.chronologyCoverage,
    false,
  );
  assert.deepEqual(
    buildForecastOutcomeInstantBindings(groqShaped, dataset(normalized)),
    [
      {
        bindingVersion: "forecast-outcome-instant-binding/v1",
        evidenceId: "event:event-doc-db1",
        firstObservedAt: ISSUED_AT,
      },
      {
        bindingVersion: "forecast-outcome-instant-binding/v1",
        evidenceId: "legacy:ios-27:legacy-pb1",
        firstObservedAt: ISSUED_AT,
      },
      {
        bindingVersion: "forecast-outcome-instant-binding/v1",
        evidenceId: "release:ios-27:outcome",
        firstObservedAt: ISSUED_AT,
      },
    ],
  );
});

test("forecast outcome bindings close malformed source rows to invalid-source", () => {
  const value = source();
  const malformedSources = [
    { ...value, events: [null] },
    {
      ...value,
      events: value.events.map((event) => ({ ...event, id: null })),
    },
    {
      ...value,
      releaseMetadata: value.releaseMetadata.map((metadata) => ({
        ...metadata,
        sourceEvidenceIds: [null],
      })),
    },
  ] as unknown as PublishedHistoricalReleaseSource[];

  for (const malformed of malformedSources) {
    assertBindingError(
      () => buildForecastOutcomeInstantBindings(malformed, dataset(value)),
      "invalid-source",
    );
  }
});
