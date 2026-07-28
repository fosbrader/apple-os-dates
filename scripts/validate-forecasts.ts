import assert from "node:assert/strict";
import {
  buildReleaseForecasts,
  normalizeMilestoneStage,
  summarizeForecastAccuracy,
} from "../src/lib/forecasts";
import type {
  BetaMilestone,
  Platform,
  ReleaseVersion,
} from "../src/lib/types";

const platform: Platform = {
  _id: "platform-ios",
  name: "iOS",
  slug: { current: "ios" },
  color: "#007aff",
  sortOrder: 1,
};

function addDays(date: string, days: number): string {
  const value = new Date(`${date}T00:00:00.000Z`);
  value.setUTCDate(value.getUTCDate() + days);
  return value.toISOString().slice(0, 10);
}

function milestones(firstBetaDate: string): BetaMilestone[] {
  return [
    {
      _key: "beta-1",
      label: "Beta 1",
      date: firstBetaDate,
      isRevision: false,
    },
    {
      _key: "beta-2",
      label: "Beta 2",
      date: addDays(firstBetaDate, 5),
      isRevision: false,
    },
  ];
}

function release(
  version: string,
  firstBetaDate: string,
  daysToPublic?: number
): ReleaseVersion {
  return {
    _id: `version-${version}`,
    version,
    releaseTrain: {
      _id: `train-${version.split(".")[0]}`,
      majorVersion: Number(version.split(".")[0]),
      displayName: `iOS ${version.split(".")[0]}`,
      releaseYear: Number(firstBetaDate.slice(0, 4)),
      platform,
    },
    milestones: milestones(firstBetaDate),
    publicReleaseDate:
      daysToPublic === undefined
        ? undefined
        : addDays(firstBetaDate, daysToPublic),
  };
}

const exactHistory = [10, 12, 14, 16, 18, 20].map((days, index) =>
  release(`${20 + index}.4`, `${2020 + index}-01-01`, days)
);
const current = release("26.4", "2026-07-20");
const exactForecast = buildReleaseForecasts(
  [...exactHistory, current],
  new Date("2026-07-28T12:00:00.000Z")
)[0];

assert.equal(exactForecast.status, "active");
assert.equal(exactForecast.cohort?.kind, "release-position");
assert.equal(exactForecast.publicReleaseWindow?.sampleSize, 6);
assert.equal(exactForecast.publicReleaseWindow?.earliestDate, "2026-08-02");
assert.equal(exactForecast.publicReleaseWindow?.medianDate, "2026-08-04");
assert.equal(exactForecast.publicReleaseWindow?.latestDate, "2026-08-07");
assert.equal(exactForecast.nextMilestoneWindow?.likelyLabel, "Public release");
assert.equal(exactForecast.confidence, "high");
assert.ok(exactForecast.backtest);

const accuracy = summarizeForecastAccuracy([exactForecast]);
assert.ok(accuracy);
assert.ok((accuracy?.sampleSize ?? 0) >= 3);

const fallbackHistory = [
  release("20.1", "2020-02-01", 18),
  release("21.2", "2021-02-01", 20),
  release("22.3", "2022-02-01", 22),
  release("23.5", "2023-02-01", 24),
];
const fallbackForecast = buildReleaseForecasts(
  [...fallbackHistory, current],
  new Date("2026-07-28T12:00:00.000Z")
)[0];
assert.equal(fallbackForecast.cohort?.kind, "release-class");
assert.equal(fallbackForecast.publicReleaseWindow?.sampleSize, 4);

const staleForecast = buildReleaseForecasts(
  [...exactHistory, release("26.4", "2026-02-16")],
  new Date("2026-07-28T12:00:00.000Z")
)[0];
assert.equal(staleForecast.status, "paused-stale");

const elapsedForecast = buildReleaseForecasts(
  [...exactHistory, release("26.4", "2026-07-01")],
  new Date("2026-07-28T12:00:00.000Z")
)[0];
assert.equal(elapsedForecast.status, "paused-window-passed");

const insufficientForecast = buildReleaseForecasts(
  [
    release("20.4", "2020-01-01", 10),
    release("21.4", "2021-01-01", 12),
    current,
  ],
  new Date("2026-07-28T12:00:00.000Z")
)[0];
assert.equal(insufficientForecast.status, "insufficient-history");
assert.equal(insufficientForecast.publicReleaseWindow, null);

assert.equal(normalizeMilestoneStage("Beta 3 v2"), "beta:3");
assert.equal(normalizeMilestoneStage("Beta 3 Update"), "beta:3");
assert.equal(normalizeMilestoneStage("RC"), "rc:1");
assert.equal(normalizeMilestoneStage("RC 2"), "rc:2");

console.log(
  "Forecast validation passed: cohort selection, percentile windows, stale-data pauses, minimum samples, confidence, and prior-only backtests."
);
