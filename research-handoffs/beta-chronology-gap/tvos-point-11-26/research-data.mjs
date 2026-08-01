export const batchId = "beta-chronology-gap-tvos-point-11-26";
export const cohortId = "tvos-point-11-26";
export const packetPath =
  "research-handoffs/beta-chronology-gap/tvos-point-11-26";
export const evidenceRoot =
  "tmp/research-evidence/beta-chronology-gap/tvos-point-11-26";
export const researchCutoff = "2026-07-31";

export const targetVersions = [
  "11.1",
  "11.2",
  "11.2.5",
  "11.3",
  "11.4",
  "12.1",
  "12.1.1",
  "12.1.2",
  "12.2",
  "12.3",
  "13.2",
  "13.3",
  "13.3.1",
  "13.4",
  "13.4.5",
  "14.2",
  "14.3",
  "14.4",
  "14.5",
  "14.6",
  "14.7",
  "15.1",
  "15.2",
  "15.3",
  "15.4",
  "15.5",
  "15.6",
  "16.1",
  "18.1",
  "26.4",
  "26.5",
  "26.6",
];

export const releaseVersionIdFor = (version) =>
  `version-tvos-${version.replaceAll(".", "-")}`;
export const targetVersionIds = targetVersions.map(releaseVersionIdFor);

const appearance = (
  version,
  sequence,
  appearanceDate,
  sourceIds,
  decision = "supportable",
  blockers = [],
  qualifications = [],
) => ({
  candidateId: `candidate:apple:tvos:${version}:public-beta-${sequence}`,
  platform: "tvOS",
  platformId: "platform-tvos",
  version,
  releaseVersionId: releaseVersionIdFor(version),
  label: `Public Beta ${sequence}`,
  routeAlias: `public-beta-${sequence}`,
  sequence,
  appearanceDate,
  normalizedTimeZone: "America/Los_Angeles",
  channel: "publicBeta",
  sourceIds,
  decision,
  identityStatus: "exactPublisherDisplayedPublicOrdinal",
  blockers,
  qualifications,
});

const cycle = (version, appearances) => ({
  version,
  releaseVersionId: releaseVersionIdFor(version),
  applicability: "publicBetaApplicable",
  appearanceCount: appearances.length,
  appearances,
});

export const cycles = [
  cycle("11.1", [
    appearance("11.1", 1, "2017-09-28", ["mr-111-pb1", "iculture-111-cycle"]),
    appearance("11.1", 2, "2017-10-09", ["mr-111-pb2", "iculture-111-cycle"]),
    appearance("11.1", 3, "2017-10-16", ["mr-111-pb3", "iculture-111-cycle"]),
    appearance("11.1", 4, "2017-10-23", ["mr-111-pb4", "iculture-111-cycle"]),
  ]),
  cycle("11.2", [
    appearance("11.2", 1, "2017-11-01", ["mr-112-pb1", "iculture-112-cycle"], "supportable", [], [
      "iCulture's first-row version token says 11.1; the cycle context, date, and MacRumors identify tvOS 11.2.",
    ]),
    appearance("11.2", 2, "2017-11-07", ["mr-112-pb2", "iculture-112-cycle"]),
    appearance("11.2", 3, "2017-11-13", ["mr-112-pb3", "iculture-112-cycle"]),
    appearance("11.2", 4, "2017-11-17", ["mr-112-pb4", "iculture-112-cycle"]),
    appearance("11.2", 5, "2017-11-28", ["mr-112-pb5", "iculture-112-cycle"]),
  ]),
  cycle("11.2.5", [
    appearance("11.2.5", 1, "2017-12-14", ["mr-1125-pb1", "iculture-1125-cycle"]),
    appearance("11.2.5", 2, "2017-12-20", ["mr-1125-pb2", "iculture-1125-cycle"]),
    appearance("11.2.5", 3, "2018-01-03", ["mr-1125-pb3", "iculture-1125-cycle"], "supportable", [], [
      "iCulture displays January 4 in Europe; the contemporaneous MacRumors Pacific timestamp establishes January 3 in America/Los_Angeles.",
    ]),
    appearance("11.2.5", 4, "2018-01-09", ["mr-1125-pb4"], "blocked", [
      "Only one independent publisher lineage was captured for the exact public identity.",
    ]),
    appearance("11.2.5", 6, "2018-01-17", ["mr-1125-pb6"], "blocked", [
      "Only one independent publisher lineage was captured for the exact public identity.",
    ]),
  ]),
  cycle("11.3", [
    appearance("11.3", 1, "2018-01-25", ["mr-113-pb1", "9to5-113-pb1", "iculture-113-cycle"], "supportable", [], [
      "iCulture displays January 26 in Europe; two contemporaneous Pacific sources establish January 25.",
    ]),
    appearance("11.3", 2, "2018-02-07", ["mr-113-pb2", "iculture-113-cycle"]),
    appearance("11.3", 3, "2018-02-21", ["mr-113-pb3", "iculture-113-cycle"]),
    appearance("11.3", 4, "2018-03-05", ["mr-113-pb4", "iculture-113-cycle"]),
    appearance("11.3", 5, "2018-03-12", ["mr-113-pb5", "9to5-113-pb5", "iculture-113-cycle"]),
    appearance("11.3", 6, "2018-03-20", ["mr-113-pb6"], "blocked", [
      "Only one independent publisher lineage was captured for the exact public identity.",
    ]),
  ]),
  cycle("11.4", [
    appearance("11.4", 1, "2018-04-03", ["mr-114-pb1", "iculture-114-cycle"]),
    appearance("11.4", 2, "2018-04-17", ["mr-114-pb2", "iculture-114-cycle"]),
    appearance("11.4", 3, "2018-05-01", ["mr-114-pb3", "iculture-114-cycle"]),
    appearance("11.4", 4, "2018-05-07", ["mr-114-pb4", "iculture-114-cycle"]),
    appearance("11.4", 5, "2018-05-14", ["mr-114-pb5", "iculture-114-cycle"]),
  ]),
  cycle("12.1", [
    appearance("12.1", 1, "2018-09-20", ["mr-121-pb1", "iculture-121-cycle", "imore-tvos12-rolling"]),
    appearance("12.1", 2, "2018-10-02", ["mr-121-pb2"], "blocked", [
      "Only one independent publisher lineage was captured for the exact public identity.",
    ]),
    appearance("12.1", 3, "2018-10-09", ["mr-121-pb3"], "blocked", [
      "Only one independent publisher lineage was captured for the exact public identity.",
    ]),
    appearance("12.1", 4, "2018-10-15", ["mr-121-pb4", "iculture-121-cycle"]),
    appearance("12.1", 5, "2018-10-22", ["mr-121-pb5", "iculture-121-cycle", "imore-tvos12-rolling"]),
  ]),
  cycle("12.1.1", [
    appearance("12.1.1", 1, "2018-11-01", ["mr-1211-pb1", "iculture-1211-cycle", "imore-tvos12-rolling"]),
    appearance("12.1.1", 2, "2018-11-07", ["mr-1211-pb2", "iculture-1211-cycle", "imore-tvos12-rolling"], "supportable", [], [
      "iCulture displays November 8 in Europe; MacRumors and iMore establish November 7 in America/Los_Angeles.",
    ]),
    appearance("12.1.1", 3, "2018-11-15", ["mr-1211-pb3", "iculture-1211-cycle", "imore-tvos12-rolling"], "supportable", [], [
      "iCulture displays November 16 in Europe; MacRumors and iMore establish November 15 in America/Los_Angeles.",
    ]),
    appearance("12.1.1", 4, "2018-11-29", ["mr-1211-pb4"], "blocked", [
      "Only one independent publisher lineage was captured for the exact public identity.",
    ]),
  ]),
  cycle("12.1.2", [
    appearance("12.1.2", 1, "2018-12-11", ["mr-1212-pb1", "iculture-1213-renamed-cycle", "imore-tvos12-rolling"]),
    appearance("12.1.2", 2, "2018-12-19", ["mr-1212-pb2", "iculture-1213-renamed-cycle"]),
    appearance("12.1.2", 3, "2019-01-07", ["mr-1212-pb3"], "blocked", [
      "Only one independent publisher lineage was captured for the exact public identity.",
    ]),
  ]),
  cycle("12.2", [
    appearance("12.2", 1, "2019-01-28", ["mr-122-pb1", "iculture-122-cycle", "imore-tvos12-rolling"]),
    appearance("12.2", 2, "2019-02-05", ["mr-122-pb2", "iculture-122-cycle", "imore-tvos12-rolling"]),
    appearance("12.2", 3, "2019-02-20", ["mr-122-pb3", "iculture-122-cycle", "imore-tvos12-rolling"]),
    appearance("12.2", 4, "2019-03-04", ["mr-122-pb4", "iculture-122-cycle", "imore-tvos12-rolling"]),
    appearance("12.2", 5, "2019-03-11", ["mr-122-pb5", "iculture-122-cycle"]),
    appearance("12.2", 6, "2019-03-18", ["mr-122-pb6", "iculture-122-cycle"]),
  ]),
  cycle("12.3", [
    appearance("12.3", 1, "2019-03-28", ["mr-123-pb1", "iculture-123-cycle", "imore-tvos12-rolling"]),
    appearance("12.3", 2, "2019-04-09", ["mr-123-pb2", "iculture-123-cycle", "imore-tvos12-rolling"]),
    appearance("12.3", 3, "2019-04-23", ["mr-123-pb3", "iculture-123-cycle", "imore-tvos12-rolling"], "supportable", [], [
      "The iMore rolling page displays April 22; MacRumors and iCulture independently establish April 23.",
    ]),
    appearance("12.3", 4, "2019-04-29", ["mr-123-pb4", "iculture-123-cycle", "imore-tvos12-rolling"], "supportable", [], [
      "iCulture displays April 30 in Europe; MacRumors and iMore establish April 29 in America/Los_Angeles.",
    ]),
    appearance("12.3", 5, "2019-05-07", ["mr-123-pb5", "iculture-123-cycle"]),
  ]),
  cycle("13.2", [
    appearance("13.2", 1, "2019-10-02", ["mr-132-pb1"], "blocked", [
      "Only one independent publisher lineage was captured for the exact public identity.",
    ]),
    appearance("13.2", 2, "2019-10-10", ["mr-132-pb2"], "blocked", [
      "Only one independent publisher lineage was captured for the exact public identity.",
    ]),
    appearance("13.2", 4, "2019-10-23", ["mr-132-pb4"], "blocked", [
      "Only one independent publisher lineage was captured for the exact public identity.",
    ]),
  ]),
  cycle("13.3", [
    appearance("13.3", 1, "2019-11-06", ["mr-133-pb1", "iculture-133-cycle", "imore-tvos13-rolling"]),
    appearance("13.3", 2, "2019-11-12", ["mr-133-pb2", "imore-tvos13-rolling"], "supportable", [], [
      "iCulture's table duplicates November 6 for Public Beta 2; it is excluded from the date support.",
    ]),
    appearance("13.3", 3, "2019-11-20", ["iculture-133-cycle"], "blocked", [
      "Only one independent publisher lineage was captured for the exact public identity.",
    ]),
    appearance("13.3", 4, "2019-12-05", ["mr-133-pb4"], "blocked", [
      "Only one independent publisher lineage was captured for the exact public identity.",
    ]),
  ]),
  cycle("13.3.1", [
    appearance("13.3.1", 1, "2019-12-18", ["mr-1331-pb1", "imore-tvos13-rolling"]),
    appearance("13.3.1", 2, "2020-01-14", ["mr-1331-pb2"], "blocked", [
      "Only one independent publisher lineage was captured for the exact public identity.",
    ]),
    appearance("13.3.1", 3, "2020-01-22", ["mr-1331-pb3"], "blocked", [
      "Only one independent publisher lineage was captured for the exact public identity.",
    ]),
  ]),
  cycle("13.4", [
    appearance("13.4", 1, "2020-02-10", ["imore-tvos13-rolling", "iculture-134-cycle"]),
    appearance("13.4", 2, "2020-02-20", ["iculture-134-cycle"], "blocked", [
      "Only one independent publisher lineage was captured for the exact public identity.",
    ]),
    appearance("13.4", 3, "2020-02-26", ["mr-134-pb3"], "blocked", [
      "Only one independent publisher lineage was captured for the exact public identity.",
    ]),
    appearance("13.4", 4, "2020-03-03", ["mr-134-pb4"], "blocked", [
      "Only one independent publisher lineage was captured for the exact public identity.",
    ]),
    appearance("13.4", 5, "2020-03-10", ["mr-134-pb5"], "blocked", [
      "Only one independent publisher lineage was captured for the exact public identity.",
    ]),
    appearance("13.4", 6, "2020-03-18", ["mr-134-pb6"], "blocked", [
      "Only one independent publisher lineage was captured for the exact public identity.",
    ]),
  ]),
  cycle("13.4.5", [
    appearance("13.4.5", 4, "2020-05-06", ["mr-1345-pb4", "mactrast-1345-pb4"]),
  ]),
  cycle("14.2", [
    appearance("14.2", 1, "2020-09-21", ["iculture-142-cycle", "imore-tvos14-rolling"]),
    appearance("14.2", 2, "2020-09-30", ["iculture-142-cycle"], "blocked", [
      "Only one independent publisher lineage was captured for the exact public identity.",
    ]),
    appearance("14.2", 3, "2020-10-15", ["iculture-142-cycle"], "blocked", [
      "Only one independent publisher lineage was captured for the exact public identity.",
    ]),
    appearance("14.2", 4, "2020-10-21", ["iculture-142-cycle"], "blocked", [
      "Only one independent publisher lineage was captured for the exact public identity.",
    ]),
  ]),
  cycle("14.3", [
    appearance("14.3", 2, "2020-11-18", ["iculture-143-cycle", "iphonecanada-143-pb2"]),
    appearance("14.3", 3, "2020-12-02", ["iculture-143-cycle", "mr-143-pb3"]),
  ]),
  cycle("14.4", [
    appearance("14.4", 2, "2021-01-13", ["mr-144-pb2", "osxdaily-144-pb2"]),
  ]),
  cycle("14.5", [
    appearance("14.5", 2, "2021-02-16", ["iculture-145-cycle"], "blocked", [
      "Only one independent publisher lineage was captured for the exact public identity.",
    ]),
    appearance("14.5", 3, "2021-03-03", ["iculture-145-cycle"], "blocked", [
      "Only one independent publisher lineage was captured for the exact public identity.",
    ]),
    appearance("14.5", 4, "2021-03-15", ["iculture-145-cycle", "ithinkdiff-145-pb4"]),
    appearance("14.5", 5, "2021-03-23", ["iculture-145-cycle", "mapped-kob-74-pb5"]),
    appearance("14.5", 6, "2021-03-31", ["purudo-145-pb6"], "blocked", [
      "Only one independent publisher lineage was captured for the exact public identity.",
    ]),
    appearance("14.5", 7, "2021-04-07", ["ithinkdiff-145-pb7", "mr-145-pb7"], "supportable", [], [
      "iCulture's table calls build 18L5203a Beta 6 while its revision history says it updated for Beta 7; the exact Beta 7 sources and build chronology control.",
    ]),
  ]),
  cycle("14.6", [
    appearance("14.6", 1, "2021-04-23", ["iculture-146-cycle", "imore-tvos14-rolling"]),
  ]),
  cycle("14.7", [
    appearance("14.7", 1, "2021-05-20", ["iculture-147-cycle", "wccftech-147-pb1", "mapped-kob-76-pb1"]),
    appearance("14.7", 4, "2021-06-29", ["imore-tvos14-rolling", "mapped-9to5-76-pb4"]),
    appearance("14.7", 5, "2021-07-08", ["mapped-kob-76-pb5", "mapped-nishiki-76-pb5"], "supportable", [], [
      "The Japanese pages display July 9 locally; their timestamps normalize to July 8 in America/Los_Angeles.",
    ]),
  ]),
  cycle("15.1", [
    appearance("15.1", 3, "2021-10-07", ["mapped-kob-81-pb4"], "blocked", [
      "Only one independent publisher lineage was captured for the exact tvOS Public Beta 3 identity.",
    ]),
  ]),
  cycle("15.2", [
    appearance("15.2", 1, "2021-10-28", ["9to5-152-pb1"], "blocked", [
      "Only one independent publisher lineage was captured for the exact public identity.",
    ]),
    appearance("15.2", 2, "2021-11-10", ["mapped-macerkopf-83-pb2"], "blocked", [
      "Only one independent publisher lineage was captured for the exact public identity.",
    ]),
    appearance("15.2", 3, "2021-11-16", ["kob-152-pb3"], "blocked", [
      "Only one independent publisher lineage was captured for the exact public identity.",
    ], [
      "The Japanese page displays November 17 locally; its timestamp normalizes to November 16 in America/Los_Angeles.",
    ]),
    appearance("15.2", 4, "2021-12-02", ["kob-152-pb4", "mapped-9to5-83-pb4"]),
  ]),
  cycle("15.3", [
    appearance("15.3", 2, "2022-01-13", ["mapped-9to5-84-pb2", "iculture-153-cycle"], "blocked", [
      "The two publisher lineages disagree on the appearance date: January 13 versus January 12.",
    ]),
  ]),
  cycle("15.4", [
    appearance("15.4", 1, "2022-01-28", ["kob-154-pb1", "iculture-154-cycle"]),
    appearance("15.4", 2, "2022-02-09", ["kob-154-pb2", "iculture-154-cycle"]),
    appearance("15.4", 3, "2022-02-16", ["kob-154-pb3", "iculture-154-cycle"]),
    appearance("15.4", 4, "2022-02-22", ["kob-154-pb4", "iculture-154-cycle"]),
  ]),
  cycle("15.5", [
    appearance("15.5", 1, "2022-04-06", ["ithinkdiff-155-cycle"], "blocked", [
      "Only one independent publisher lineage was captured for the exact public identity.",
    ]),
    appearance("15.5", 2, "2022-04-20", ["9to5-155-pb2"], "blocked", [
      "Only one independent publisher lineage was captured for the exact public identity.",
    ]),
    appearance("15.5", 3, "2022-04-26", ["kob-155-pb3"], "blocked", [
      "Only one independent publisher lineage was captured for the exact public identity.",
    ], [
      "The Japanese page displays April 27 locally; its timestamp normalizes to April 26 in America/Los_Angeles.",
    ]),
    appearance("15.5", 4, "2022-05-03", ["kob-155-pb4"], "blocked", [
      "Only one independent publisher lineage was captured for the exact public identity.",
    ], [
      "The Japanese page displays May 4 locally; its timestamp normalizes to May 3 in America/Los_Angeles.",
    ]),
  ]),
  cycle("15.6", [
    appearance("15.6", 1, "2022-05-19", ["mapped-9to5-87-pb1", "iculture-156-cycle"]),
    appearance("15.6", 2, "2022-06-01", ["mapped-9to5-87-pb2", "iculture-156-cycle"]),
    appearance("15.6", 3, "2022-06-15", ["iculture-156-cycle"], "blocked", [
      "Only one independent publisher lineage was captured for the exact public identity.",
    ]),
    appearance("15.6", 4, "2022-06-28", ["mapped-9to5-87-pb4", "iculture-156-cycle"], "blocked", [
      "iCulture records July 5, while 9to5Mac explicitly reports public availability on June 28; the date conflict requires review.",
    ]),
    appearance("15.6", 5, "2022-07-05", ["kob-156-pb5", "iculture-156-cycle"]),
  ]),
  cycle("16.1", [
    appearance("16.1", 2, "2022-09-21", ["mapped-9to5-91-pb2"], "blocked", [
      "Only one independent publisher lineage was captured for the exact public identity.",
    ]),
    appearance("16.1", 3, "2022-09-28", ["mapped-9to5-91-pb3"], "blocked", [
      "Only one independent publisher lineage was captured for the exact public identity.",
    ]),
  ]),
  cycle("18.1", [
    appearance("18.1", 3, "2024-10-02", ["mr-181-pb3"], "blocked", [
      "Only one independent publisher lineage was captured for the exact public identity.",
    ]),
  ]),
  cycle("26.4", [
    appearance("26.4", 1, "2026-02-17", ["9to5-264-pb1", "mr-264-pb1"]),
    appearance("26.4", 2, "2026-02-24", ["mr-264-pb2", "buchi-264-pb2"]),
    appearance("26.4", 4, "2026-03-09", ["9to5-264-pb4"], "blocked", [
      "Only one independent publisher lineage was captured for the exact public identity.",
    ]),
  ]),
  cycle("26.5", [
    appearance("26.5", 1, "2026-04-03", ["mr-265-pb1", "9to5-265-pb1"]),
    appearance("26.5", 2, "2026-04-14", ["mr-265-pb2", "9to5-265-pb2"]),
    appearance("26.5", 3, "2026-04-21", ["9to5-265-pb3", "tuttotech-265-pb3"]),
    appearance("26.5", 4, "2026-04-27", ["9to5-265-pb4"], "blocked", [
      "Only one independent publisher lineage was captured for the exact public identity.",
    ]),
  ]),
  cycle("26.6", [
    appearance("26.6", 1, "2026-05-28", ["mr-266-pb1", "9to5-266-pb1"]),
    appearance("26.6", 2, "2026-06-16", ["mr-266-pb2", "9to5-266-pb2"]),
    appearance("26.6", 3, "2026-06-30", ["mr-266-pb3", "9to5-266-pb3"]),
    appearance("26.6", 4, "2026-07-07", ["mr-266-pb4"], "blocked", [
      "Only one independent publisher lineage was captured for the exact public identity.",
    ]),
    appearance("26.6", 5, "2026-07-13", ["9to5-266-pb5"], "blocked", [
      "Only one independent publisher lineage was captured for the exact public identity.",
    ], [
      "9to5Mac's tvOS-specific update is timestamped July 13 Pacific; its separate watchOS update occurred July 14.",
    ]),
  ]),
];

export const allAppearances = cycles.flatMap(({appearances}) => appearances);
export const supportableAppearances = allAppearances.filter(
  ({decision}) => decision === "supportable",
);
export const blockedAppearances = allAppearances.filter(
  ({decision}) => decision === "blocked",
);

export const negativeFindings = [
  {
    findingId: "negative:tvos:11.2.5:public-beta-5",
    version: "11.2.5",
    label: "Public Beta 5",
    sourceIds: ["mr-1125-pb4", "mr-1125-pb6", "iculture-1125-cycle"],
    finding:
      "The researched public sequence moves from Public Beta 4 to Public Beta 6; the intervening contemporaneous beta-5 coverage is developer-only.",
    effect: "No Public Beta 5 candidate.",
  },
  {
    findingId: "negative:tvos:11.4:public-beta-6",
    version: "11.4",
    label: "Public Beta 6",
    sourceIds: ["iculture-114-cycle"],
    finding:
      "The living article's sixth-public-beta headline concerns iOS; its explicit tvOS public table ends at Public Beta 5.",
    effect: "No tvOS Public Beta 6 candidate.",
  },
  {
    findingId: "negative:tvos:13.2:public-beta-3",
    version: "13.2",
    label: "Public Beta 3",
    sourceIds: ["iculture-132-cycle", "mr-132-pb2", "mr-132-pb4"],
    finding:
      "The cycle chronology records Beta 3 only without a public label, between exact public identities 2 and 4.",
    effect: "No Public Beta 3 candidate.",
  },
  {
    findingId: "negative:tvos:13.4.5:public-beta-1-through-3",
    version: "13.4.5",
    label: "Public Betas 1–3",
    sourceIds: ["iculture-1345-cycle", "mr-1345-pb4", "mactrast-1345-pb4"],
    finding:
      "The multi-platform living chronology labels only iOS/iPadOS as public before the exact tvOS Public Beta 4 report.",
    effect: "No tvOS Public Beta 1, 2, or 3 candidate.",
  },
  {
    findingId: "negative:tvos:14.3:public-beta-1",
    version: "14.3",
    label: "Public Beta 1",
    sourceIds: ["iculture-143-cycle"],
    finding:
      "The explicit tvOS public chronology begins at Public Beta 2; no exact tvOS Public Beta 1 identity passed the gate.",
    effect: "No Public Beta 1 candidate.",
  },
  {
    findingId: "negative:tvos:14.4:public-beta-1",
    version: "14.4",
    label: "Public Beta 1",
    sourceIds: ["iculture-144-cycle", "mr-144-pb2"],
    finding:
      "The cycle's first build is developer-only; the first exact public identity located is Public Beta 2.",
    effect: "No Public Beta 1 candidate.",
  },
  {
    findingId: "negative:tvos:14.5:public-beta-1",
    version: "14.5",
    label: "Public Beta 1",
    sourceIds: ["iculture-145-cycle"],
    finding:
      "Beta 1 is recorded without a public label; exact public reporting begins at Public Beta 2.",
    effect: "No Public Beta 1 candidate.",
  },
  {
    findingId: "negative:tvos:14.6:later-public-ordinals",
    version: "14.6",
    label: "Public Betas 2–3",
    sourceIds: ["iculture-146-cycle", "mapped-kob-75-pb2", "mapped-purudo-75-pb3"],
    finding:
      "Later cross-platform pages name tvOS developer builds but do not explicitly assign the public audience and ordinal to tvOS.",
    effect: "No Public Beta 2 or 3 candidate; remains reversible if exact evidence is found.",
  },
  {
    findingId: "negative:tvos:14.7:public-beta-2-and-3",
    version: "14.7",
    label: "Public Betas 2–3",
    sourceIds: ["iculture-147-cycle", "mapped-9to5-76-pb3"],
    finding:
      "No exact Public Beta 2 identity passed the gate, and 9to5Mac explicitly excluded tvOS from the Public Beta 3 rollout at report time.",
    effect: "No Public Beta 2 or 3 candidate.",
  },
  {
    findingId: "negative:tvos:15.1:unqualified-ordinals",
    version: "15.1",
    label: "Public Betas 1, 2, and 4",
    sourceIds: ["kob-151-pb2", "mapped-kob-81-pb4", "mapped-9to5-81-pb3"],
    finding:
      "Cross-platform reports show tvOS builds but do not explicitly bind the public audience and displayed ordinal to tvOS for these appearances.",
    effect: "Only exact tvOS Public Beta 3 is retained, blocked for one lineage.",
  },
  {
    findingId: "negative:tvos:15.3:public-beta-1",
    version: "15.3",
    label: "Public Beta 1",
    sourceIds: ["kob-153-pb1", "iculture-153-cycle"],
    finding:
      "The first tvOS build is developer-only in the retained sources; the exact public chronology begins at Public Beta 2.",
    effect: "No Public Beta 1 candidate.",
  },
  {
    findingId: "negative:tvos:15.4:public-beta-5",
    version: "15.4",
    label: "Public Beta 5",
    sourceIds: ["iculture-154-cycle", "mapped-9to5-85-pb5"],
    finding:
      "The retained reporting identifies tvOS Beta 5 but does not explicitly bind a tvOS public audience to ordinal 5.",
    effect: "No Public Beta 5 candidate.",
  },
  {
    findingId: "negative:tvos:16.1:unqualified-ordinals",
    version: "16.1",
    label: "Public Betas 1, 4, and 5",
    sourceIds: ["kob-161-pb1-negative", "iculture-161-cycle"],
    finding:
      "The retained pages establish developer builds and generic public-program availability but not exact publisher-displayed tvOS public ordinals 1, 4, or 5.",
    effect: "No candidates for these ordinals; classification remains reversible.",
  },
  {
    findingId: "negative:tvos:18.1:unqualified-ordinals",
    version: "18.1",
    label: "Public Betas 1, 2, 4, and 5",
    sourceIds: ["iculture-181-cycle", "mr-181-pb3"],
    finding:
      "The cycle page lists developer betas and generic public installation instructions; only Public Beta 3 has an exact tvOS public ordinal report.",
    effect: "No candidates for the unqualified ordinals.",
  },
  {
    findingId: "negative:tvos:26.4:public-beta-3",
    version: "26.4",
    label: "Public Beta 3",
    sourceIds: ["9to5-264-pb4", "mr-264-pb2"],
    finding:
      "The exact public sequence located moves from Public Beta 2 to Public Beta 4; no exact tvOS Public Beta 3 report passed the gate.",
    effect: "No Public Beta 3 candidate.",
  },
];

export const conflicts = [
  {
    conflictId: "conflict:tvos:11.2:public-beta-1-version-token",
    candidateId: "candidate:apple:tvos:11.2:public-beta-1",
    sourceIds: ["iculture-112-cycle", "mr-112-pb1"],
    issue:
      "iCulture's first public row says tvOS 11.1 inside a tvOS 11.2 cycle; MacRumors and the cycle context identify 11.2.",
    resolution: "Qualified editorial typo; candidate remains supportable.",
  },
  {
    conflictId: "conflict:tvos:13.3:public-beta-2-date",
    candidateId: "candidate:apple:tvos:13.3:public-beta-2",
    sourceIds: ["iculture-133-cycle", "mr-133-pb2", "imore-tvos13-rolling"],
    issue:
      "iCulture duplicates November 6 for Public Betas 1 and 2; MacRumors and iMore independently report November 12.",
    resolution: "Use November 12 and exclude the duplicated table date.",
  },
  {
    conflictId: "conflict:tvos:14.5:beta-7-table-label",
    candidateId: "candidate:apple:tvos:14.5:public-beta-7",
    sourceIds: ["iculture-145-cycle", "mr-145-pb7", "ithinkdiff-145-pb7"],
    issue:
      "iCulture's table calls build 18L5203a Beta 6 although its revision history says Beta 7; two exact sources call it Public Beta 7.",
    resolution: "Use Public Beta 7 with explicit qualification.",
  },
  {
    conflictId: "conflict:tvos:15.3:public-beta-2-date",
    candidateId: "candidate:apple:tvos:15.3:public-beta-2",
    sourceIds: ["iculture-153-cycle", "mapped-9to5-84-pb2"],
    issue: "iCulture records January 12; 9to5Mac records public rollout January 13.",
    resolution: "Blocked pending independent date resolution.",
  },
  {
    conflictId: "conflict:tvos:15.6:public-beta-4-date",
    candidateId: "candidate:apple:tvos:15.6:public-beta-4",
    sourceIds: ["iculture-156-cycle", "mapped-9to5-87-pb4"],
    issue: "iCulture records July 5; 9to5Mac explicitly reports June 28.",
    resolution: "Blocked pending independent date resolution.",
  },
];

export const applicability = cycles.map((item) => ({
  platform: "tvOS",
  platformId: "platform-tvos",
  version: item.version,
  releaseVersionId: item.releaseVersionId,
  classification: item.applicability,
  exactAppearanceCount: item.appearanceCount,
  supportableCount: item.appearances.filter(
    ({decision}) => decision === "supportable",
  ).length,
  blockedCount: item.appearances.filter(
    ({decision}) => decision === "blocked",
  ).length,
  conclusion:
    "At least one exact publisher-displayed tvOS public-beta identity was located. Skipped ordinals are not filled from developer numbering or paired-platform cadence.",
}));
