import type { BetaMilestone, ReleaseVersion } from "./types";

const DAY_MS = 86_400_000;

export const FORECAST_MINIMUM_SAMPLE = 3;
export const FORECAST_MAX_SAMPLE = 12;
export const FORECAST_STALE_AFTER_DAYS = 60;

export type ReleaseClass = "major" | "minor" | "patch";
export type ForecastConfidence = "high" | "medium" | "low";
export type ForecastStatus =
  | "active"
  | "paused-stale"
  | "paused-window-passed"
  | "insufficient-history";
export type ForecastCohortKind = "release-position" | "release-class";

export interface ForecastWindow {
  anchorDate: string;
  earliestDate: string;
  medianDate: string;
  latestDate: string;
  p25Days: number;
  medianDays: number;
  p75Days: number;
  sampleSize: number;
}

export interface NextMilestoneForecast extends ForecastWindow {
  likelyLabel: string;
  labelAgreement: number;
}

export interface ForecastCohort {
  kind: ForecastCohortKind;
  label: string;
  sampleVersions: string[];
}

export interface ForecastBacktest {
  sampleSize: number;
  medianAbsoluteErrorDays: number;
  withinRangePercent: number;
  absoluteErrorsDays: number[];
  withinRangeCount: number;
}

export interface ForecastAccuracySummary {
  sampleSize: number;
  medianAbsoluteErrorDays: number;
  withinRangePercent: number;
}

export interface ReleaseForecast {
  release: ReleaseVersion;
  latestMilestone: BetaMilestone | null;
  stageLabel: string | null;
  releasePosition: string;
  releaseClass: ReleaseClass;
  cohort: ForecastCohort | null;
  publicReleaseWindow: ForecastWindow | null;
  nextMilestoneWindow: NextMilestoneForecast | null;
  confidence: ForecastConfidence | null;
  confidenceReason: string;
  backtest: ForecastBacktest | null;
  status: ForecastStatus;
  statusMessage: string;
  daysSinceLatestMilestone: number | null;
}

interface HistoricalObservation {
  release: ReleaseVersion;
  daysToPublic: number;
  daysToNextMilestone: number | null;
  nextMilestoneLabel: string | null;
}

interface SelectedCohort {
  kind: ForecastCohortKind;
  observations: HistoricalObservation[];
}

function parseIsoDay(value: string | undefined): number | null {
  if (!value) return null;

  const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(value);
  if (!match) return null;

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const timestamp = Date.UTC(year, month - 1, day);
  const date = new Date(timestamp);

  if (
    date.getUTCFullYear() !== year ||
    date.getUTCMonth() !== month - 1 ||
    date.getUTCDate() !== day
  ) {
    return null;
  }

  return Math.floor(timestamp / DAY_MS);
}

function isoFromDay(day: number): string {
  return new Date(day * DAY_MS).toISOString().slice(0, 10);
}

function dateToIsoDay(date: Date): number {
  return Math.floor(
    Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()) /
      DAY_MS
  );
}

function percentile(sortedValues: number[], percentileValue: number): number {
  if (sortedValues.length === 0) {
    throw new Error("Cannot calculate a percentile for an empty sample.");
  }

  const position = (sortedValues.length - 1) * percentileValue;
  const lowerIndex = Math.floor(position);
  const upperIndex = Math.ceil(position);
  const fraction = position - lowerIndex;
  const lower = sortedValues[lowerIndex];
  const upper = sortedValues[upperIndex];

  return Math.round(lower + (upper - lower) * fraction);
}

export function getReleasePosition(version: string): string {
  const segments = version.split(".");
  return segments.length > 1 ? segments.slice(1).join(".") : "0";
}

export function getReleaseClass(version: string): ReleaseClass {
  const segments = version.split(".").map(Number);
  const minor = Number.isFinite(segments[1]) ? segments[1] : 0;
  const patchSegments = segments.slice(2).filter(Number.isFinite);

  if (minor === 0 && patchSegments.every((part) => part === 0)) {
    return "major";
  }

  if (patchSegments.some((part) => part !== 0)) {
    return "patch";
  }

  return "minor";
}

/**
 * Treat revisions such as "Beta 3 v2" as the same release stage while
 * preserving numbered RC stages when the source distinguishes them.
 */
export function normalizeMilestoneStage(label: string): string {
  const normalized = label.trim().toLowerCase();
  const betaNumber = normalized.match(/^beta\s*(\d+)/)?.[1];
  if (betaNumber) return `beta:${Number(betaNumber)}`;

  if (normalized === "gm" || normalized === "public") return "public";

  if (normalized.startsWith("rc")) {
    const rcNumber = normalized.match(/^rc\s*(\d+)/)?.[1];
    return `rc:${rcNumber ? Number(rcNumber) : 1}`;
  }

  return normalized.replace(/\s+/g, "-");
}

function stageDisplayLabel(stage: string): string {
  if (stage.startsWith("beta:")) {
    return `Beta ${stage.slice("beta:".length)}`;
  }

  if (stage.startsWith("rc:")) {
    const number = Number(stage.slice("rc:".length));
    return number > 1 ? `RC ${number}` : "RC";
  }

  if (stage === "public") return "Public release";
  return stage.replaceAll("-", " ");
}

function latestValidMilestone(
  milestones: BetaMilestone[] | undefined
): BetaMilestone | null {
  if (!milestones?.length) return null;

  return milestones.reduce<BetaMilestone | null>((latest, milestone) => {
    const day = parseIsoDay(milestone.date);
    if (day === null) return latest;
    if (!latest) return milestone;

    const latestDay = parseIsoDay(latest.date);
    return latestDay === null || day > latestDay ? milestone : latest;
  }, null);
}

function matchingStageMilestone(
  milestones: BetaMilestone[] | undefined,
  stage: string
): BetaMilestone | null {
  return latestValidMilestone(
    milestones?.filter(
      (milestone) => normalizeMilestoneStage(milestone.label) === stage
    )
  );
}

function nextDistinctMilestone(
  release: ReleaseVersion,
  matchedMilestone: BetaMilestone,
  stage: string
): { date: string; label: string } | null {
  const matchedDay = parseIsoDay(matchedMilestone.date);
  const publicDay = parseIsoDay(release.publicReleaseDate);
  if (matchedDay === null || publicDay === null) return null;

  const nextMilestone = [...(release.milestones ?? [])]
    .filter((milestone) => {
      const milestoneDay = parseIsoDay(milestone.date);
      return (
        milestoneDay !== null &&
        milestoneDay > matchedDay &&
        milestoneDay <= publicDay &&
        normalizeMilestoneStage(milestone.label) !== stage
      );
    })
    .sort(
      (left, right) =>
        (parseIsoDay(left.date) ?? Number.POSITIVE_INFINITY) -
        (parseIsoDay(right.date) ?? Number.POSITIVE_INFINITY)
    )[0];

  if (nextMilestone) {
    return {
      date: nextMilestone.date,
      label: stageDisplayLabel(normalizeMilestoneStage(nextMilestone.label)),
    };
  }

  if (publicDay > matchedDay) {
    return { date: release.publicReleaseDate!, label: "Public release" };
  }

  return null;
}

function createObservation(
  release: ReleaseVersion,
  stage: string
): HistoricalObservation | null {
  const publicDay = parseIsoDay(release.publicReleaseDate);
  const matchedMilestone = matchingStageMilestone(release.milestones, stage);
  const matchedDay = parseIsoDay(matchedMilestone?.date);

  if (
    publicDay === null ||
    matchedDay === null ||
    publicDay < matchedDay ||
    publicDay - matchedDay > 365
  ) {
    return null;
  }

  const nextMilestone = nextDistinctMilestone(
    release,
    matchedMilestone!,
    stage
  );
  const nextMilestoneDay = parseIsoDay(nextMilestone?.date);

  return {
    release,
    daysToPublic: publicDay - matchedDay,
    daysToNextMilestone:
      nextMilestoneDay === null ? null : nextMilestoneDay - matchedDay,
    nextMilestoneLabel: nextMilestone?.label ?? null,
  };
}

function releaseSortDay(release: ReleaseVersion): number {
  return parseIsoDay(release.publicReleaseDate) ?? Number.NEGATIVE_INFINITY;
}

function selectCohort(
  targetVersion: string,
  observations: HistoricalObservation[]
): SelectedCohort | null {
  const position = getReleasePosition(targetVersion);
  const releaseClass = getReleaseClass(targetVersion);
  const sorted = [...observations].sort(
    (left, right) => releaseSortDay(right.release) - releaseSortDay(left.release)
  );
  const exactPosition = sorted
    .filter(
      (observation) =>
        getReleasePosition(observation.release.version) === position
    )
    .slice(0, FORECAST_MAX_SAMPLE);

  if (exactPosition.length >= FORECAST_MINIMUM_SAMPLE) {
    return { kind: "release-position", observations: exactPosition };
  }

  const sameClass = sorted
    .filter(
      (observation) =>
        getReleaseClass(observation.release.version) === releaseClass
    )
    .slice(0, FORECAST_MAX_SAMPLE);

  if (sameClass.length >= FORECAST_MINIMUM_SAMPLE) {
    return { kind: "release-class", observations: sameClass };
  }

  const bestAvailable =
    exactPosition.length >= sameClass.length ? exactPosition : sameClass;

  return bestAvailable.length
    ? {
        kind:
          bestAvailable === exactPosition
            ? "release-position"
            : "release-class",
        observations: bestAvailable,
      }
    : null;
}

function createWindow(anchorDay: number, values: number[]): ForecastWindow {
  const sortedValues = [...values].sort((left, right) => left - right);
  const p25Days = percentile(sortedValues, 0.25);
  const medianDays = percentile(sortedValues, 0.5);
  const p75Days = percentile(sortedValues, 0.75);

  return {
    anchorDate: isoFromDay(anchorDay),
    earliestDate: isoFromDay(anchorDay + p25Days),
    medianDate: isoFromDay(anchorDay + medianDays),
    latestDate: isoFromDay(anchorDay + p75Days),
    p25Days,
    medianDays,
    p75Days,
    sampleSize: sortedValues.length,
  };
}

function createNextMilestoneWindow(
  anchorDay: number,
  observations: HistoricalObservation[]
): NextMilestoneForecast | null {
  const eligible = observations.filter(
    (
      observation
    ): observation is HistoricalObservation & {
      daysToNextMilestone: number;
      nextMilestoneLabel: string;
    } =>
      observation.daysToNextMilestone !== null &&
      observation.daysToNextMilestone > 0 &&
      Boolean(observation.nextMilestoneLabel)
  );

  if (eligible.length < FORECAST_MINIMUM_SAMPLE) return null;

  const labelCounts = new Map<string, number>();
  for (const observation of eligible) {
    labelCounts.set(
      observation.nextMilestoneLabel,
      (labelCounts.get(observation.nextMilestoneLabel) ?? 0) + 1
    );
  }

  const [likelyLabel, labelCount] = [...labelCounts.entries()].sort(
    ([leftLabel, leftCount], [rightLabel, rightCount]) =>
      rightCount - leftCount || leftLabel.localeCompare(rightLabel)
  )[0];
  const window = createWindow(
    anchorDay,
    eligible.map((observation) => observation.daysToNextMilestone)
  );

  return {
    ...window,
    likelyLabel,
    labelAgreement: Math.round((labelCount / eligible.length) * 100),
  };
}

function confidenceFor(
  cohort: SelectedCohort,
  window: ForecastWindow
): { confidence: ForecastConfidence; reason: string } {
  const sampleSize = cohort.observations.length;
  const spread = window.p75Days - window.p25Days;

  if (
    cohort.kind === "release-position" &&
    sampleSize >= 6 &&
    spread <= 21
  ) {
    return {
      confidence: "high",
      reason: `High: ${sampleSize} same-position cycles with a ${spread}-day middle-50% spread.`,
    };
  }

  if (sampleSize >= 4 && spread <= 28) {
    return {
      confidence: "medium",
      reason: `Medium: ${sampleSize} comparable cycles with a ${spread}-day middle-50% spread.`,
    };
  }

  return {
    confidence: "low",
    reason: `Low: limited history (${sampleSize} cycles) or a wide ${spread}-day middle-50% spread.`,
  };
}

function createBacktest(
  target: ReleaseVersion,
  stage: string,
  completedForPlatform: ReleaseVersion[]
): ForecastBacktest | null {
  const targetClass = getReleaseClass(target.version);
  const targets = completedForPlatform
    .filter(
      (release) =>
        getReleaseClass(release.version) === targetClass &&
        createObservation(release, stage)
    )
    .sort((left, right) => releaseSortDay(left) - releaseSortDay(right));
  const outcomes: { absoluteError: number; withinRange: boolean }[] = [];

  for (const historicalTarget of targets) {
    const targetReleaseDay = releaseSortDay(historicalTarget);
    const targetObservation = createObservation(historicalTarget, stage);
    if (!targetObservation) continue;

    const priorObservations = completedForPlatform
      .filter((release) => releaseSortDay(release) < targetReleaseDay)
      .map((release) => createObservation(release, stage))
      .filter(
        (observation): observation is HistoricalObservation =>
          observation !== null
      );
    const priorCohort = selectCohort(
      historicalTarget.version,
      priorObservations
    );

    if (
      !priorCohort ||
      priorCohort.observations.length < FORECAST_MINIMUM_SAMPLE
    ) {
      continue;
    }

    const sortedDays = priorCohort.observations
      .map((observation) => observation.daysToPublic)
      .sort((left, right) => left - right);
    const p25 = percentile(sortedDays, 0.25);
    const median = percentile(sortedDays, 0.5);
    const p75 = percentile(sortedDays, 0.75);

    outcomes.push({
      absoluteError: Math.abs(median - targetObservation.daysToPublic),
      withinRange:
        targetObservation.daysToPublic >= p25 &&
        targetObservation.daysToPublic <= p75,
    });
  }

  if (outcomes.length < FORECAST_MINIMUM_SAMPLE) return null;

  const errors = outcomes
    .map((outcome) => outcome.absoluteError)
    .sort((left, right) => left - right);
  const insideCount = outcomes.filter((outcome) => outcome.withinRange).length;

  return {
    sampleSize: outcomes.length,
    medianAbsoluteErrorDays: percentile(errors, 0.5),
    withinRangePercent: Math.round((insideCount / outcomes.length) * 100),
    absoluteErrorsDays: errors,
    withinRangeCount: insideCount,
  };
}

function cohortLabel(
  release: ReleaseVersion,
  stageLabel: string,
  cohort: SelectedCohort
): string {
  const platform = release.releaseTrain.platform.name;
  if (cohort.kind === "release-position") {
    return `${platform} .${getReleasePosition(release.version)} cycles at ${stageLabel}`;
  }

  return `${platform} ${getReleaseClass(release.version)} releases at ${stageLabel}`;
}

export function buildReleaseForecasts(
  releases: ReleaseVersion[],
  asOf = new Date()
): ReleaseForecast[] {
  const asOfDay = dateToIsoDay(asOf);
  const completed = releases.filter(
    (release) => Boolean(release.publicReleaseDate)
  );
  const active = releases.filter(
    (release) => !release.publicReleaseDate
  );

  return active
    .map((release): ReleaseForecast => {
      const platformSlug = release.releaseTrain.platform.slug.current;
      const latestMilestone = latestValidMilestone(release.milestones);
      const latestDay = parseIsoDay(latestMilestone?.date);
      const releasePosition = getReleasePosition(release.version);
      const releaseClass = getReleaseClass(release.version);

      if (!latestMilestone || latestDay === null) {
        return {
          release,
          latestMilestone: null,
          stageLabel: null,
          releasePosition,
          releaseClass,
          cohort: null,
          publicReleaseWindow: null,
          nextMilestoneWindow: null,
          confidence: null,
          confidenceReason: "No dated milestone is available.",
          backtest: null,
          status: "insufficient-history",
          statusMessage:
            "Forecast unavailable until this release has a dated beta or RC milestone.",
          daysSinceLatestMilestone: null,
        };
      }

      const stage = normalizeMilestoneStage(latestMilestone.label);
      const stageLabel = stageDisplayLabel(stage);
      const completedForPlatform = completed.filter(
        (candidate) =>
          candidate._id !== release._id &&
          candidate.releaseTrain.platform.slug.current === platformSlug
      );
      const observations = completedForPlatform
        .map((candidate) => createObservation(candidate, stage))
        .filter(
          (observation): observation is HistoricalObservation =>
            observation !== null
        );
      const selected = selectCohort(release.version, observations);
      const daysSinceLatestMilestone = asOfDay - latestDay;

      if (
        !selected ||
        selected.observations.length < FORECAST_MINIMUM_SAMPLE
      ) {
        const available = selected?.observations.length ?? 0;
        return {
          release,
          latestMilestone,
          stageLabel,
          releasePosition,
          releaseClass,
          cohort: selected
            ? {
                kind: selected.kind,
                label: cohortLabel(release, stageLabel, selected),
                sampleVersions: selected.observations.map(
                  (observation) => observation.release.version
                ),
              }
            : null,
          publicReleaseWindow: null,
          nextMilestoneWindow: null,
          confidence: null,
          confidenceReason: `Only ${available} comparable cycle${available === 1 ? "" : "s"} found; at least ${FORECAST_MINIMUM_SAMPLE} are required.`,
          backtest: null,
          status: "insufficient-history",
          statusMessage:
            "Forecast unavailable because there is not enough comparable history for this release stage.",
          daysSinceLatestMilestone,
        };
      }

      const publicReleaseWindow = createWindow(
        latestDay,
        selected.observations.map(
          (observation) => observation.daysToPublic
        )
      );
      const nextMilestoneWindow = createNextMilestoneWindow(
        latestDay,
        selected.observations
      );
      const confidence = confidenceFor(selected, publicReleaseWindow);
      const cohort: ForecastCohort = {
        kind: selected.kind,
        label: cohortLabel(release, stageLabel, selected),
        sampleVersions: selected.observations.map(
          (observation) => observation.release.version
        ),
      };
      const backtest = createBacktest(
        release,
        stage,
        completedForPlatform
      );

      let status: ForecastStatus = "active";
      let statusMessage =
        "Current estimate based on the latest recorded milestone and comparable historical cycles.";

      if (daysSinceLatestMilestone > FORECAST_STALE_AFTER_DAYS) {
        status = "paused-stale";
        statusMessage = `Forecast paused: the latest recorded milestone is ${daysSinceLatestMilestone} days old. Add the newest milestone in Sanity to resume the estimate.`;
      } else if (
        (parseIsoDay(publicReleaseWindow.latestDate) ??
          Number.NEGATIVE_INFINITY) < asOfDay
      ) {
        status = "paused-window-passed";
        statusMessage =
          "Forecast paused: this cycle has moved beyond the historical date window. A newer milestone is needed before publishing another estimate.";
      }

      return {
        release,
        latestMilestone,
        stageLabel,
        releasePosition,
        releaseClass,
        cohort,
        publicReleaseWindow,
        nextMilestoneWindow,
        confidence: confidence.confidence,
        confidenceReason: confidence.reason,
        backtest,
        status,
        statusMessage,
        daysSinceLatestMilestone,
      };
    })
    .sort(
      (left, right) =>
        left.release.releaseTrain.platform.sortOrder -
          right.release.releaseTrain.platform.sortOrder ||
        right.release.version.localeCompare(left.release.version, undefined, {
          numeric: true,
        })
    );
}

export function summarizeForecastAccuracy(
  forecasts: ReleaseForecast[]
): ForecastAccuracySummary | null {
  const uniqueBacktests = new Map<string, ForecastBacktest>();
  for (const forecast of forecasts) {
    if (!forecast.backtest || !forecast.stageLabel) continue;

    const key = [
      forecast.release.releaseTrain.platform.slug.current,
      forecast.releaseClass,
      forecast.stageLabel,
    ].join("|");
    uniqueBacktests.set(key, forecast.backtest);
  }
  const backtests = [...uniqueBacktests.values()];
  const errors = backtests
    .flatMap((backtest) => backtest.absoluteErrorsDays)
    .sort((left, right) => left - right);

  if (errors.length < FORECAST_MINIMUM_SAMPLE) return null;

  const withinRangeCount = backtests.reduce(
    (total, backtest) => total + backtest.withinRangeCount,
    0
  );

  return {
    sampleSize: errors.length,
    medianAbsoluteErrorDays: percentile(errors, 0.5),
    withinRangePercent: Math.round((withinRangeCount / errors.length) * 100),
  };
}
