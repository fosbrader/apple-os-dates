import assert from "node:assert/strict";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import test from "node:test";
import { TimelineView } from "../src/components/timeline/TimelineView";
import { buildReleaseForecasts } from "../src/lib/forecasts";
import {
  getActiveBetas,
  getHistoricalContext,
  getRecentReleases,
} from "../src/lib/seed-data";
import {
  activeBetasQuery,
  completedVersionsQuery,
  recentReleasesQuery,
} from "../src/lib/queries";
import {
  getReleaseStatus,
  isActiveRelease,
  isReleasedRelease,
  isSupersededRelease,
  type Platform,
  type ReleaseStatus,
  type ReleaseVersion,
} from "../src/lib/types";
import { computeBetaCycleDays } from "../src/lib/utils";

const platform: Platform = {
  _id: "platform-ios",
  name: "iOS",
  slug: { current: "ios" },
  color: "#007AFF",
  sortOrder: 1,
};

function release({
  version,
  betaOne,
  betaTwo,
  publicDate,
  status,
}: {
  version: string;
  betaOne: string;
  betaTwo: string;
  publicDate?: string;
  status?: ReleaseStatus;
}): ReleaseVersion {
  return {
    _id: `version-ios-${version}`,
    version,
    ...(status ? { releaseStatus: status } : {}),
    ...(publicDate ? { publicReleaseDate: publicDate } : {}),
    releaseTrain: {
      _id: `train-ios-${version.split(".")[0]}`,
      majorVersion: Number(version.split(".")[0]),
      displayName: `iOS ${version.split(".")[0]}`,
      releaseYear: Number(betaOne.slice(0, 4)),
      platform,
    },
    milestones: [
      {
        _key: "beta-1",
        label: "Beta 1",
        date: betaOne,
        isRevision: false,
      },
      {
        _key: "beta-2",
        label: "Beta 2",
        date: betaTwo,
        isRevision: false,
      },
      ...(publicDate
        ? [
            {
              _key: "public",
              label: "Public",
              date: publicDate,
              isRevision: false,
            },
          ]
        : []),
    ],
  };
}

test("legacy documents still infer active and released lifecycle states", () => {
  const legacyActive = {};
  const legacyReleased = { publicReleaseDate: "2024-09-16" };
  const explicitSupersededWithLegacyDate = {
    releaseStatus: "superseded" as const,
    publicReleaseDate: "2022-09-19",
  };

  assert.equal(getReleaseStatus(legacyActive), "active");
  assert.equal(getReleaseStatus(legacyReleased), "released");
  assert.equal(
    getReleaseStatus(explicitSupersededWithLegacyDate),
    "superseded",
  );
  assert.equal(isActiveRelease(legacyActive), true);
  assert.equal(isReleasedRelease(legacyReleased), true);
  assert.equal(
    isReleasedRelease(explicitSupersededWithLegacyDate),
    false,
  );
  assert.equal(
    isSupersededRelease(explicitSupersededWithLegacyDate),
    true,
  );
});

test("the JSON-backed active, recent, and completed cohorts exclude superseded cycles", () => {
  const active = getActiveBetas();
  const recent = getRecentReleases();
  const historical = getHistoricalContext("ipados", "27.0");

  assert.equal(active.some(isSupersededRelease), false);
  assert.equal(recent.some(isSupersededRelease), false);
  assert.equal(
    historical.allCompleted.some(isSupersededRelease),
    false,
  );
  assert.equal(
    historical.samePlatformVersions.some(
      (candidate) =>
        candidate.version === "16.0" ||
        candidate.version === "13.0",
    ),
    false,
  );
});

test("Sanity active, recent, and completed queries preserve legacy inference while excluding superseded records", () => {
  const active = activeBetasQuery.replace(/\s+/g, " ");
  const recent = recentReleasesQuery.replace(/\s+/g, " ");
  const completed = completedVersionsQuery.replace(/\s+/g, " ");

  assert.match(active, /releaseStatus == "active"/);
  assert.match(
    active,
    /!defined\(releaseStatus\) && !defined\(publicReleaseDate\)/,
  );
  assert.match(recent, /releaseStatus == "released"/);
  assert.match(recent, /!defined\(releaseStatus\)/);
  assert.match(recent, /defined\(publicReleaseDate\)/);
  assert.match(completed, /releaseStatus == "released"/);
  assert.match(completed, /!defined\(releaseStatus\)/);
  assert.match(completed, /defined\(publicReleaseDate\)/);
});

test("superseded cycles are neither forecast targets nor historical forecast samples", () => {
  const histories: ReleaseVersion[] = [
    release({
      version: "22.0",
      betaOne: "2021-06-01",
      betaTwo: "2021-06-08",
      publicDate: "2021-07-01",
      status: "superseded",
    }),
    release({
      version: "23.0",
      betaOne: "2022-06-01",
      betaTwo: "2022-06-08",
      publicDate: "2022-07-01",
      status: "released",
    }),
    release({
      version: "24.0",
      betaOne: "2023-06-01",
      betaTwo: "2023-06-08",
      publicDate: "2023-07-03",
      status: "released",
    }),
    release({
      version: "25.0",
      betaOne: "2024-06-03",
      betaTwo: "2024-06-10",
      publicDate: "2024-07-08",
      status: "released",
    }),
    release({
      version: "26.0",
      betaOne: "2025-06-02",
      betaTwo: "2025-06-09",
      publicDate: "2025-07-07",
    }),
  ];
  const supersededTarget = release({
    version: "26.1",
    betaOne: "2025-09-01",
    betaTwo: "2025-09-08",
    status: "superseded",
  });
  const activeTarget = release({
    version: "27.0",
    betaOne: "2026-07-06",
    betaTwo: "2026-07-20",
    status: "active",
  });

  const forecasts = buildReleaseForecasts(
    [...histories, supersededTarget, activeTarget],
    new Date("2026-07-25T12:00:00.000Z"),
  );

  assert.deepEqual(
    forecasts.map((forecast) => forecast.release.version),
    ["27.0"],
  );
  assert.ok(forecasts[0].cohort);
  assert.equal(
    forecasts[0].cohort.sampleVersions.includes("22.0"),
    false,
  );
  assert.equal(
    forecasts[0].cohort.sampleVersions.includes("26.0"),
    true,
    "legacy released records remain valid forecast history",
  );
  assert.equal(forecasts[0].publicReleaseWindow?.sampleSize, 4);
});

test("superseded cycles do not become completed-cycle analytics observations", () => {
  const superseded = release({
    version: "16.0",
    betaOne: "2022-06-06",
    betaTwo: "2022-06-22",
    publicDate: "2022-09-19",
    status: "superseded",
  });
  const legacyReleased = release({
    version: "15.0",
    betaOne: "2021-06-07",
    betaTwo: "2021-06-24",
    publicDate: "2021-09-20",
  });

  assert.equal(computeBetaCycleDays(superseded), null);
  assert.equal(computeBetaCycleDays(legacyReleased), 105);
});

test("a superseded timeline ends at its last recorded seed, not today", () => {
  const superseded = release({
    version: "16.0",
    betaOne: "2022-06-06",
    betaTwo: "2022-08-15",
    status: "superseded",
  });
  const html = renderToStaticMarkup(
    createElement(TimelineView, {
      data: [superseded],
      platforms: [platform],
    }),
  );

  assert.match(html, /Last seed/);
  assert.match(html, /Aug 15, 2022/);
  assert.match(html, /70 days/);
  assert.doesNotMatch(html, />Today</);
});
