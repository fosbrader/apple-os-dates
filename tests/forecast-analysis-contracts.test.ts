import assert from "node:assert/strict";
import test from "node:test";
import {
  FORECAST_ANALYSIS_CONTRACT_VERSION,
  canonicalForecastStage,
  compareVerifiedSameDayOrder,
  eligibleForecastEvents,
  forecastEventEligibility,
  forecastIntervalOutcome,
  forecastReleaseLifecycleAtCutoff,
  validateForecastAnalysisDataset,
  type ForecastAnalysisDatasetV1,
  type ForecastAnalysisEventV1,
  type ForecastAnalysisReleaseV1,
} from "../src/lib/forecast-analysis-contracts";
import { canonicalForecastFixture } from "./fixtures/forecast-analysis-contracts";

function event(
  overrides: Partial<ForecastAnalysisEventV1> = {},
): ForecastAnalysisEventV1 {
  return {
    id: "ios-27-developer-beta-2",
    releaseId: "ios-27.0",
    occurredOn: "2026-07-20",
    firstObservedOn: "2026-07-20",
    channel: "developerBeta",
    sequence: 2,
    availability: "available",
    isRevision: false,
    displayLabel: "An arbitrary display label",
    ...overrides,
  };
}

function release(
  overrides: Partial<ForecastAnalysisReleaseV1> = {},
): ForecastAnalysisReleaseV1 {
  return {
    id: "ios-27.0",
    lifecycle: "active",
    ...overrides,
  };
}

function dataset(
  events: ForecastAnalysisEventV1[],
  releases: ForecastAnalysisReleaseV1[] = [release()],
): ForecastAnalysisDatasetV1 {
  return {
    contractVersion: FORECAST_ANALYSIS_CONTRACT_VERSION,
    dataCutoff: "2026-08-09",
    releases,
    events,
  };
}

test("v1 stages use channel and sequence, never display labels", () => {
  const developer = event({ displayLabel: "Public Beta 99" });
  const publicBeta = event({
    id: "ios-27-public-beta-2",
    channel: "publicBeta",
    displayLabel: "Developer seed (editorial copy)",
  });

  assert.equal(canonicalForecastStage(developer), "developer-beta:2");
  assert.equal(canonicalForecastStage(publicBeta), "public-beta:2");
  assert.notEqual(
    canonicalForecastStage(developer),
    canonicalForecastStage(publicBeta),
  );
});

test("revisions remain in the canonical stage of their channel and sequence", () => {
  const original = event({ isRevision: false, sameDayOrder: 1 });
  const revision = event({
    id: "ios-27-developer-beta-2-revision",
    isRevision: true,
    revisionOfId: original.id,
    sameDayOrder: 2,
    displayLabel: "Developer Beta 2 Revised",
  });

  assert.equal(canonicalForecastStage(original), "developer-beta:2");
  assert.equal(canonicalForecastStage(revision), "developer-beta:2");
  assert.deepEqual(validateForecastAnalysisDataset(dataset([original, revision])), []);
  assert.deepEqual(
    eligibleForecastEvents(dataset([original, revision])).map(({ id }) => id),
    [revision.id],
  );
});

test("eligibility excludes future, unavailable, and descriptive events", () => {
  const cutoff = "2026-08-09";
  const active = release();
  assert.deepEqual(
    forecastEventEligibility(
      event({ occurredOn: "2026-08-10" }),
      cutoff,
      active,
    ),
    { eligible: false, reason: "future-occurrence" },
  );
  assert.deepEqual(
    forecastEventEligibility(
      event({ firstObservedOn: "2026-08-10" }),
      cutoff,
      active,
    ),
    { eligible: false, reason: "not-observed-by-cutoff" },
  );

  for (const availability of ["withdrawn", "replaced", "superseded"] as const) {
    assert.deepEqual(
      forecastEventEligibility(event({ availability }), cutoff, active),
      { eligible: false, reason: availability },
    );
  }

  for (const channel of ["securityResponse", "recovery", "other"] as const) {
    assert.deepEqual(
      forecastEventEligibility(
        event({ channel, sequence: undefined }),
        cutoff,
        active,
      ),
      { eligible: false, reason: "descriptive-channel" },
    );
  }
});

test("superseded release cycles stay outside eligible cohorts", () => {
  const superseded = release({
    lifecycle: "superseded",
    statusEffectiveOn: "2026-08-01",
    statusFirstObservedOn: "2026-08-01",
  });
  assert.deepEqual(
    forecastEventEligibility(event(), "2026-08-09", superseded),
    { eligible: false, reason: "superseded-cycle" },
  );
  assert.deepEqual(eligibleForecastEvents(dataset([event()], [superseded])), []);
});

test("lifecycle transitions are resolved as of the data cutoff", () => {
  const futureSupersession = release({
    lifecycle: "superseded",
    statusEffectiveOn: "2026-08-10",
    statusFirstObservedOn: "2026-08-10",
  });
  assert.deepEqual(
    forecastReleaseLifecycleAtCutoff(futureSupersession, "2026-08-09"),
    { available: true, lifecycle: "active" },
  );
  assert.equal(
    forecastEventEligibility(
      event(),
      "2026-08-09",
      futureSupersession,
    ).eligible,
    true,
  );

  const learnedLater = release({
    lifecycle: "superseded",
    statusEffectiveOn: "2026-08-01",
    statusFirstObservedOn: "2026-08-10",
  });
  assert.deepEqual(
    forecastReleaseLifecycleAtCutoff(learnedLater, "2026-08-09"),
    { available: true, lifecycle: "active" },
  );

  const undated = release({ lifecycle: "released" });
  assert.deepEqual(
    forecastEventEligibility(event(), "2026-08-09", undated),
    { eligible: false, reason: "release-lifecycle-date-unknown" },
  );
  assert.ok(
    validateForecastAnalysisDataset(dataset([event()], [undated])).some(
      ({ code }) => code === "missing-release-lifecycle-dates",
    ),
  );
});

test("an inclusive cutoff admits only facts known by that day", () => {
  const fixture = canonicalForecastFixture();
  const dataset = {
    ...fixture,
    events: [...fixture.events],
  };
  dataset.events.push(
    event({
      id: "later-correction",
      firstObservedOn: "2026-08-10",
    }),
  );

  assert.deepEqual(
    eligibleForecastEvents(dataset).map(({ id, stage }) => ({ id, stage })),
    [
      { id: "ios-27-developer-beta-2", stage: "developer-beta:2" },
      { id: "ios-27-public-beta-2", stage: "public-beta:2" },
    ],
  );
});

test("same-day ordering remains unknown unless each event supplies evidence", () => {
  const first = event({ sameDayOrder: 1 });
  const second = event({ id: "public-beta", sameDayOrder: 2 });
  const unordered = event({ id: "unknown-order", sameDayOrder: undefined });

  assert.equal(compareVerifiedSameDayOrder(first, second), -1);
  assert.equal(compareVerifiedSameDayOrder(first, unordered), null);
  assert.equal(
    compareVerifiedSameDayOrder(
      first,
      event({ id: "other-release", releaseId: "ipados-27.0", sameDayOrder: 2 }),
    ),
    null,
  );
});

test("date-only same-day intervals are unavailable even with identity order", () => {
  const first = event({ sameDayOrder: 1 });
  const second = event({ id: "revision", sameDayOrder: 2 });

  assert.deepEqual(forecastIntervalOutcome(first, second), {
    available: false,
    reason: "same-calendar-day",
  });
  assert.deepEqual(
    forecastIntervalOutcome(
      first,
      event({ id: "next-day", occurredOn: "2026-07-21" }),
    ),
    { available: true, days: 1 },
  );
});

test("eligible event serialization is stable across source-array order", () => {
  const fixture = canonicalForecastFixture();
  const forward = eligibleForecastEvents(fixture).map(({ id }) => id);
  const reversed = eligibleForecastEvents({
    ...fixture,
    events: [...fixture.events].reverse(),
  }).map(({ id }) => id);

  assert.deepEqual(reversed, forward);
});

test("the contract validator pins v1 structure without consulting storage", () => {
  const valid = canonicalForecastFixture();
  assert.deepEqual(validateForecastAnalysisDataset(valid), []);

  const fixture = canonicalForecastFixture();
  const invalid = {
    ...fixture,
    events: [...fixture.events],
  };
  invalid.contractVersion = "forecast-analysis/v0" as typeof FORECAST_ANALYSIS_CONTRACT_VERSION;
  invalid.events.push(
    event({
      id: "invalid-beta",
      sequence: undefined,
      sameDayOrder: 1,
      availability: "withdrawn",
    }),
    event({
      id: "duplicate-order",
      sameDayOrder: 1,
      firstObservedOn: "2026-07-19",
      availability: "withdrawn",
    }),
  );

  assert.deepEqual(
    validateForecastAnalysisDataset(invalid).map(({ code }) => code),
    [
      "unsupported-contract-version",
      "missing-stage-sequence",
      "first-observed-before-occurrence",
      "duplicate-same-day-order",
    ],
  );
});

test("runtime enum values and ambiguous effective stages are rejected", () => {
  const invalidEnums = dataset([
    event({
      channel: "label-derived" as ForecastAnalysisEventV1["channel"],
      availability:
        "maybe" as ForecastAnalysisEventV1["availability"],
    }),
  ]);
  assert.deepEqual(
    validateForecastAnalysisDataset(invalidEnums).map(({ code }) => code),
    ["invalid-channel", "invalid-availability"],
  );

  const ambiguous = dataset([
    event(),
    event({ id: "duplicate-stage-without-revision" }),
  ]);
  assert.ok(
    validateForecastAnalysisDataset(ambiguous).some(
      ({ code }) => code === "ambiguous-effective-stage",
    ),
  );
  assert.deepEqual(eligibleForecastEvents(ambiguous), []);

  const invalidLifecycle = release({
    lifecycle:
      "retired" as ForecastAnalysisReleaseV1["lifecycle"],
  });
  assert.deepEqual(
    forecastEventEligibility(event(), "2026-08-09", invalidLifecycle),
    { eligible: false, reason: "invalid-release-lifecycle" },
  );
});
