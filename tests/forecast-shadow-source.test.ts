import assert from "node:assert/strict";
import test from "node:test";

import {
  FORECAST_SHADOW_MAX_SOURCE_EVENTS,
  FORECAST_SHADOW_MAX_SOURCE_LEGACY_MILESTONES,
  FORECAST_SHADOW_MAX_SOURCE_RELEASES,
  ForecastShadowSourceEnvelopeError,
  boundedForecastShadowSourceQuery,
  extractBoundedForecastShadowSource,
  publishedHistoricalReleaseSourceQuery,
  type PublishedForecastShadowSource,
} from "../src/lib/historical-release-source";

function emptySource(): PublishedForecastShadowSource {
  return {
    releases: [],
    events: [],
    compatibilityMilestones: [],
    releaseMetadata: [],
    legacyForecastReleases: [],
    legacyForecastMilestones: [],
  };
}

function envelope(source: PublishedForecastShadowSource) {
  const observations =
    source.events.length + source.compatibilityMilestones.length;
  return {
    ...source,
    sourceCounts: {
      releases: source.releases.length,
      events: source.events.length,
      compatibilityMilestones: source.compatibilityMilestones.length,
      releaseMetadata: source.releaseMetadata.length,
      legacyForecastReleases: source.legacyForecastReleases.length,
      legacyForecastMilestones: source.legacyForecastMilestones.length,
      observations,
    },
    sourceOverflow: {
      releases: false,
      events: false,
      compatibilityMilestones: false,
      releaseMetadata: false,
      legacyForecastReleases: false,
      legacyForecastMilestones: false,
      observations: false,
    },
  };
}

test("FR-014 accepts only a complete bounded source envelope", () => {
  const source = emptySource();
  assert.deepEqual(extractBoundedForecastShadowSource(envelope(source)), source);

  const mismatched = envelope(source);
  mismatched.sourceCounts.events = 1;
  assert.throws(
    () => extractBoundedForecastShadowSource(mismatched),
    ForecastShadowSourceEnvelopeError,
  );
});

test("FR-014 rejects overflow instead of accepting a sliced source", () => {
  const source = emptySource();
  const releases = Array.from(
    { length: FORECAST_SHADOW_MAX_SOURCE_RELEASES + 1 },
    (_, index) => ({ id: `release-${index}`, lifecycle: "active" as const }),
  );
  const overflow = envelope({ ...source, releases });
  overflow.sourceOverflow.releases = true;

  assert.throws(
    () => extractBoundedForecastShadowSource(overflow),
    ForecastShadowSourceEnvelopeError,
  );

  const legacyOverflow = envelope(source);
  legacyOverflow.sourceCounts.legacyForecastMilestones =
    FORECAST_SHADOW_MAX_SOURCE_LEGACY_MILESTONES + 1;
  legacyOverflow.sourceOverflow.legacyForecastMilestones = true;
  assert.throws(
    () => extractBoundedForecastShadowSource(legacyOverflow),
    ForecastShadowSourceEnvelopeError,
  );

  const falseSentinel = envelope(source);
  falseSentinel.sourceOverflow.events = true;
  assert.throws(
    () => extractBoundedForecastShadowSource(falseSentinel),
    ForecastShadowSourceEnvelopeError,
  );
});

test("FR-014 keeps the full migration query and adds a bounded route query", () => {
  assert.doesNotMatch(publishedHistoricalReleaseSourceQuery, /sourceCounts/);
  assert.doesNotMatch(publishedHistoricalReleaseSourceQuery, /sourceOverflow/);
  assert.doesNotMatch(publishedHistoricalReleaseSourceQuery, /legacyForecast/);
  assert.match(boundedForecastShadowSourceQuery, /"sourceCounts"/);
  assert.match(boundedForecastShadowSourceQuery, /"sourceOverflow"/);
  assert.match(boundedForecastShadowSourceQuery, /"legacyForecastReleases"/);
  assert.match(boundedForecastShadowSourceQuery, /"legacyForecastMilestones"/);
  assert.match(boundedForecastShadowSourceQuery, /"lifecycle": releaseStatus/);
  assert.match(boundedForecastShadowSourceQuery, /"displayLabel": label/);
  assert.match(boundedForecastShadowSourceQuery, /"slug": releaseTrain->platform->slug\.current/);
  assert.match(boundedForecastShadowSourceQuery, /"occurredOn": date/);
  assert.match(
    boundedForecastShadowSourceQuery,
    new RegExp(`\\[0\\.\\.\\.${FORECAST_SHADOW_MAX_SOURCE_RELEASES + 1}\\]`),
  );
  assert.match(
    boundedForecastShadowSourceQuery,
    new RegExp(`\\[0\\.\\.\\.${FORECAST_SHADOW_MAX_SOURCE_EVENTS + 1}\\]`),
  );
  assert.match(
    boundedForecastShadowSourceQuery,
    new RegExp(`\\[0\\.\\.\\.${FORECAST_SHADOW_MAX_SOURCE_LEGACY_MILESTONES + 1}\\]`),
  );
});
