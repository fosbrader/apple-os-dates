export const batchId = "beta-chronology-gap-ios-ipados-point-15-18";
export const cohortId = "ios-ipados-point-15-18";
export const packetPath =
  "research-handoffs/beta-chronology-gap/ios-ipados-point-15-18";
export const evidenceRoot =
  "tmp/research-evidence/beta-chronology-gap/ios-ipados-point-15-18";
export const researchCutoff = "2026-07-31";

const appearance = (sequence, appearanceDate, extra = {}) => ({
  sequence,
  appearanceDate,
  ...extra,
});
const cycle = (version, appearances, terminalDate) => ({
  version,
  appearances,
  terminalDate,
});

// Dates are normalized to Apple's America/Los_Angeles availability date.
// Public ordinals are explicit public-program identities, never developer-beta
// ordinals inferred from build equivalence.
export const iosCycles = [
  cycle("15.1", [
    appearance(1, "2021-09-22"),
    appearance(2, "2021-09-29"),
    appearance(3, "2021-10-07"),
    appearance(4, "2021-10-13"),
  ], "2021-10-25"),
  cycle("15.2", [
    appearance(1, "2021-10-28"),
    appearance(2, "2021-11-10"),
    appearance(3, "2021-11-16"),
    appearance(4, "2021-12-02"),
  ], "2021-12-13"),
  cycle("15.3", [
    appearance(1, "2021-12-20"),
    appearance(2, "2022-01-13"),
  ], "2022-01-26"),
  cycle("15.4", [
    appearance(1, "2022-01-28"),
    appearance(2, "2022-02-09"),
    appearance(3, "2022-02-16"),
    appearance(4, "2022-02-22"),
    appearance(5, "2022-03-01"),
  ], "2022-03-14"),
  cycle("15.5", [
    appearance(1, "2022-04-06"),
    appearance(2, "2022-04-20"),
    appearance(3, "2022-04-26"),
    appearance(4, "2022-05-03"),
  ], "2022-05-16"),
  cycle("15.6", [
    appearance(1, "2022-05-19"),
    appearance(2, "2022-06-01"),
    appearance(3, "2022-06-15"),
    appearance(4, "2022-06-28"),
    appearance(5, "2022-07-05"),
  ], "2022-07-20"),
  cycle("16.1", [
    appearance(1, "2022-09-15"),
    appearance(2, "2022-09-21"),
    appearance(3, "2022-09-28"),
    appearance(4, "2022-10-04"),
    appearance(5, "2022-10-11"),
  ], "2022-10-24"),
  cycle("16.2", [
    appearance(1, "2022-10-27"),
    appearance(2, "2022-11-09"),
    appearance(3, "2022-11-16"),
    appearance(4, "2022-12-01"),
  ], "2022-12-13"),
  cycle("16.4", [
    appearance(1, "2023-02-17"),
    appearance(2, "2023-03-01"),
    appearance(3, "2023-03-08"),
    appearance(4, "2023-03-15"),
  ], "2023-03-27"),
  cycle("16.5", [
    appearance(1, "2023-03-30"),
    appearance(2, "2023-04-12"),
    appearance(3, "2023-04-26"),
    appearance(4, "2023-05-02"),
  ], "2023-05-18"),
  cycle("16.6", [
    appearance(1, "2023-05-22"),
    appearance(2, "2023-06-01"),
    appearance(3, "2023-06-16"),
    appearance(4, "2023-06-28"),
    appearance(5, "2023-07-10"),
  ], "2023-07-24"),
  cycle("17.2", [
    appearance(1, "2023-10-27"),
    appearance(2, "2023-11-10"),
    appearance(3, "2023-11-15"),
    appearance(4, "2023-11-28"),
  ], "2023-12-11"),
  cycle("17.3", [
    appearance(1, "2023-12-14"),
    appearance(3, "2024-01-10"),
  ], "2024-01-22"),
  cycle("17.4", [
    appearance(1, "2024-01-30"),
    appearance(2, "2024-02-07"),
    appearance(3, "2024-02-14"),
    appearance(4, "2024-02-21"),
  ], "2024-03-05"),
  cycle("17.5", [
    appearance(1, "2024-04-04"),
    appearance(2, "2024-04-17"),
    appearance(3, "2024-04-24"),
    appearance(4, "2024-04-30"),
  ], "2024-05-13"),
  cycle("17.6", [
    appearance(1, "2024-06-20"),
    appearance(2, "2024-07-02"),
    appearance(3, "2024-07-10"),
    appearance(4, "2024-07-16"),
  ], "2024-07-29"),
  cycle("18.1", [
    appearance(1, "2024-09-19"),
    appearance(2, "2024-09-24"),
    appearance(3, "2024-10-07"),
    appearance(4, "2024-10-14"),
  ], "2024-10-28"),
  cycle("18.2", [
    appearance(1, "2024-11-06"),
    appearance(2, "2024-11-12"),
    appearance(3, "2024-11-20"),
  ], "2024-12-11"),
  cycle("18.3", [
    appearance(1, "2024-12-18"),
    appearance(2, "2025-01-08"),
    appearance(3, "2025-01-16"),
  ], "2025-01-27"),
  cycle("18.4", [
    appearance(1, "2025-02-24"),
    appearance(2, "2025-03-04"),
    appearance(3, "2025-03-11"),
    appearance(4, "2025-03-17"),
  ], "2025-03-31"),
  cycle("18.5", [
    appearance(1, "2025-04-15"),
    appearance(2, "2025-04-22"),
    appearance(3, "2025-04-28"),
  ], "2025-05-12"),
];

const copiedIosCycle = (version) => {
  const source = iosCycles.find((entry) => entry.version === version);
  if (!source) throw new Error(`Missing shared iOS cycle ${version}`);
  return cycle(
    version,
    source.appearances.map((item) => appearance(item.sequence, item.appearanceDate)),
    source.terminalDate,
  );
};

export const ipadosCycles = [
  ...["15.1", "15.2", "15.3", "15.4", "15.5", "15.6"].map(copiedIosCycle),
  cycle("16.1", [
    appearance(1, "2022-08-24", {
      qualification:
        "Installed build 20B5027f identified itself as iPadOS 16.1 beta 1, while Apple's ongoing public campaign and some coverage called the same appearance iPadOS 16 Public Beta 5.",
    }),
    appearance(2, "2022-09-15"),
    appearance(3, "2022-09-21"),
    appearance(4, "2022-09-28"),
    appearance(5, "2022-10-04"),
    appearance(6, "2022-10-11"),
  ], "2022-10-24"),
  ...["16.2", "16.4", "16.5", "16.6", "17.2", "17.3", "17.5", "17.6", "18.1", "18.2", "18.3", "18.4", "18.5"].map(copiedIosCycle),
];

export const platformSpecs = [
  {platform: "iOS", slug: "ios", platformId: "platform-ios", cycles: iosCycles},
  {
    platform: "iPadOS",
    slug: "ipados",
    platformId: "platform-ipados",
    cycles: ipadosCycles,
  },
];

export const allObservedAppearances = platformSpecs.flatMap((platform) =>
  platform.cycles.flatMap((entry) =>
    entry.appearances.map((item) => ({
      platform: platform.platform,
      slug: platform.slug,
      platformId: platform.platformId,
      version: entry.version,
      releaseVersionId: `version-${platform.slug}-${entry.version.replaceAll(".", "-")}`,
      terminalDate: entry.terminalDate,
      ...item,
      candidateId: `candidate:apple:${platform.slug}:${entry.version}:public-beta-${item.sequence}`,
      label: `Public Beta ${item.sequence}`,
      routeAlias: `public-beta-${item.sequence}`,
    })),
  ),
);

// The fresh production query found no exact or route-identity matches for this
// cohort, so every researched positive appearance remains a proposed candidate.
export const candidates = allObservedAppearances;
export const modelGaps = [];

export const targetVersionIds = [
  ...new Set(
    platformSpecs.flatMap(({slug, cycles}) =>
      cycles.map(
        ({version}) => `version-${slug}-${version.replaceAll(".", "-")}`,
      ),
    ),
  ),
  // Negative/no-event audit parents from the current coverage matrix.
  "version-ios-15-2-1",
  "version-ios-15-3-1",
  "version-ios-15-4-1",
  "version-ios-15-6-1",
  "version-ios-15-7",
  "version-ios-16-0-1",
  "version-ios-16-0-2",
  "version-ios-16-0-3",
  "version-ios-16-1-1",
  "version-ios-16-1-2",
  "version-ios-16-3-1",
  "version-ios-16-4-1",
  "version-ios-16-5-1",
  "version-ios-16-6-1",
  "version-ios-16-7",
  "version-ios-17-0-1",
  "version-ios-17-0-2",
  "version-ios-17-0-3",
  "version-ios-17-1-1",
  "version-ios-17-1-2",
  "version-ios-17-2-1",
  "version-ios-17-3-1",
  "version-ios-17-4-1",
  "version-ios-17-5-1",
  "version-ios-17-6-1",
  "version-ios-17-7",
  "version-ios-18-0-1",
  "version-ios-18-1-1",
  "version-ios-18-2-1",
  "version-ios-18-3-1",
  "version-ios-18-3-2",
  "version-ios-18-4-1",
  "version-ios-18-7",
  "version-ipados-15-7",
].sort();

export const explicitNegativeFindings = [
  {
    findingId: "negative:ios-ipados:15.7:any-public-beta",
    platforms: ["iOS", "iPadOS"],
    version: "15.7",
    result: "rcOnlyPublicTesterBoundary",
    note:
      "No numbered public beta was separately observed before the release-candidate/public-tester boundary.",
  },
  {
    findingId: "negative:ios:16.7:any-public-beta",
    platforms: ["iOS"],
    version: "16.7",
    result: "rcOnlyPublicTesterBoundary",
    note:
      "Contemporary reporting described 16.7 as not actively beta-tested before the RC appeared.",
  },
  {
    findingId: "negative:ios:17.7:any-public-beta",
    platforms: ["iOS"],
    version: "17.7",
    result: "rcOnlyPublicTesterBoundary",
    note:
      "The first public-program distribution located for the branch was the release candidate, not Public Beta 1.",
  },
  {
    findingId: "negative:ios:18.7:any-numbered-public-beta",
    platforms: ["iOS"],
    version: "18.7",
    result: "rcMislabeledPublicBeta",
    note:
      "Build 22H20 was described by one publisher as a public beta, but build-level sources identify it as the RC and final build. No numbered public-beta identity is proposed.",
  },
  {
    findingId: "negative:ios-ipados:17.3:public-beta-2",
    platforms: ["iOS", "iPadOS"],
    version: "17.3",
    routeAlias: "public-beta-2",
    result: "withdrawnDeveloperSeedNeverPublic",
    note:
      "Apple withdrew the corresponding developer beta after boot-loop reports; the public sequence jumps explicitly from Public Beta 1 to Public Beta 3.",
  },
  {
    findingId: "negative:ios-ipados:18.5:public-beta-4",
    platforms: ["iOS", "iPadOS"],
    version: "18.5",
    routeAlias: "public-beta-4",
    result: "developerOrdinalNotPublicOrdinal",
    note:
      "Developer Beta 4 mapped to Public Beta 3. The next public-program appearance was the RC, so no Public Beta 4 is proposed.",
  },
];

export const sourceDateConflicts = [
  {
    conflictId: "conflict:15.1:public-beta-2:living-page-date",
    versions: ["iOS 15.1", "iPadOS 15.1"],
    selectedDate: "2021-09-29",
    alternatives: ["2021-09-28"],
    resolution:
      "Two same-day contemporary reports place Public Beta 2 on September 29. The living cycle page retains September 28 and is not used as selected-date corroboration.",
  },
  {
    conflictId: "conflict:15.1:public-beta-4:timezone",
    versions: ["iOS 15.1", "iPadOS 15.1"],
    selectedDate: "2021-10-13",
    alternatives: ["2021-10-14"],
    resolution:
      "Use Apple availability in America/Los_Angeles. European and Japanese articles dated the already-available seed on their next local calendar day.",
  },
  {
    conflictId: "conflict:15.4:public-beta-4:timezone",
    versions: ["iOS 15.4", "iPadOS 15.4"],
    selectedDate: "2022-02-22",
    alternatives: ["2022-02-23"],
    resolution:
      "Same-day public availability is explicit in Pacific-time coverage; the later date is a publication/local-calendar lag.",
  },
  {
    conflictId: "conflict:15.6:public-beta-1:developer-date",
    versions: ["iOS 15.6", "iPadOS 15.6"],
    selectedDate: "2022-05-19",
    alternatives: ["2022-05-18"],
    resolution:
      "May 18 is the developer seed. The public-program appearance followed May 19.",
  },
  {
    conflictId: "conflict:15.6:public-beta-4:developer-date",
    versions: ["iOS 15.6", "iPadOS 15.6"],
    selectedDate: "2022-06-28",
    alternatives: ["2022-06-29"],
    resolution:
      "Contemporaneous same-day updates and build-level evidence establish public availability on June 28; one later-edited living page records June 29.",
  },
  {
    conflictId: "conflict:16.2:public-beta-4:local-calendar-date",
    versions: ["iOS 16.2", "iPadOS 16.2"],
    selectedDate: "2022-12-01",
    alternatives: ["2022-12-02"],
    resolution:
      "Contemporaneous Pacific-time MacRumors and OS X Daily reports explicitly confirm public availability on December 1. December 2 is a European publication/calendar rollover.",
  },
  {
    conflictId: "conflict:17.4:public-beta-2:living-page-date",
    versions: ["iOS 17.4"],
    selectedDate: "2024-02-07",
    alternatives: ["2024-02-06"],
    resolution:
      "Exact public-beta reporting places Public Beta 2 on February 7. The February 6 row reflects the developer seed and is not used as public-date corroboration.",
  },
  {
    conflictId: "conflict:17.5:public-beta-2:living-page-date",
    versions: ["iOS 17.5", "iPadOS 17.5"],
    selectedDate: "2024-04-17",
    alternatives: ["2024-04-16"],
    resolution:
      "Exact public-beta reports place Public Beta 2 on April 17; April 16 is the developer-seed date.",
  },
  {
    conflictId: "conflict:17.5:public-beta-3:living-page-date",
    versions: ["iOS 17.5", "iPadOS 17.5"],
    selectedDate: "2024-04-24",
    alternatives: ["2024-04-23"],
    resolution:
      "Exact public-beta reports place Public Beta 3 on April 24; April 23 is the developer-seed date.",
  },
  {
    conflictId: "conflict:17.5:public-beta-4:local-calendar-date",
    versions: ["iOS 17.5", "iPadOS 17.5"],
    selectedDate: "2024-04-30",
    alternatives: ["2024-05-01"],
    resolution:
      "Contemporaneous Pacific-time reporting confirms the fourth public seed on April 30. May 1 is a later European calendar/publication representation of the same appearance.",
  },
  {
    conflictId: "conflict:ipados:17.6:public-beta-3:living-page-date",
    versions: ["iPadOS 17.6"],
    selectedDate: "2024-07-10",
    alternatives: ["2024-07-09"],
    resolution:
      "Platform-specific contemporary reports explicitly place iPadOS 17.6 Public Beta 3 on July 10; the living-page July 9 row is not used for the selected date.",
  },
  {
    conflictId: "conflict:18.1:public-beta-4:local-publication-date",
    versions: ["iOS 18.1", "iPadOS 18.1"],
    selectedDate: "2024-10-14",
    alternatives: ["2024-10-15"],
    resolution:
      "The build and contemporaneous Pacific-time article establish same-day public availability on October 14. October 15 reflects later/local reporting.",
  },
  {
    conflictId: "conflict:ipados:16.1:public-beta-1:cross-label",
    versions: ["iPadOS 16.1"],
    selectedDate: "2022-08-24",
    alternatives: [],
    resolution:
      "One appearance only: the public campaign called it iPadOS 16 Public Beta 5, while installed build 20B5027f was iPadOS 16.1 beta 1. Preserve the campaign alias as a qualification and model the installed exact-version identity once.",
  },
  {
    conflictId: "conflict:ipados:16.1:public-beta-3:living-page-error",
    versions: ["iPadOS 16.1"],
    selectedDate: "2022-09-21",
    alternatives: ["2022-09-28"],
    resolution:
      "Build chronology and contemporaneous exact-version coverage establish PB3 on September 21 and PB4 on September 28. A later-edited living page misnumbers September 28 as PB3.",
  },
  {
    conflictId: "conflict:ipados:16.1:public-beta-2-and-3:ordinal",
    versions: ["iPadOS 16.1"],
    selectedDate: "2022-09-15",
    alternatives: ["2022-09-21"],
    resolution:
      "Publisher numbering is irreconcilable without treating Apple's continuing iPadOS 16 campaign and the installed 16.1 version as two different numbering systems. The candidate sequence preserves exact-version appearance order as PB2 on September 15 and PB3 on September 21, but every iPadOS 16.1 candidate remains conflict-status pending independent review.",
  },
  {
    conflictId: "conflict:ipados:16.1:public-beta-5:calendar-date",
    versions: ["iPadOS 16.1"],
    selectedDate: "2022-10-04",
    alternatives: ["2022-10-05"],
    resolution:
      "Contemporaneous Pacific-time reporting and build chronology place the appearance on October 4; the living European timeline records October 5. Ordinal identity remains part of the broader iPadOS 16/16.1 numbering conflict.",
  },
  {
    conflictId: "conflict:18.4:public-beta-3:ordinal",
    versions: ["iOS 18.4", "iPadOS 18.4"],
    selectedDate: "2025-03-11",
    alternatives: [],
    resolution:
      "The seed was Public Beta 3, not Public Beta 4. A living timeline copied the developer ordinal.",
  },
  {
    conflictId: "conflict:18.3:public-beta-2:living-page-date",
    versions: ["iOS 18.3", "iPadOS 18.3"],
    selectedDate: "2025-01-08",
    alternatives: ["2025-01-07"],
    resolution:
      "Separate iOS and iPadOS contemporary public-beta reports place Public Beta 2 on January 8. January 7 is the developer-seed date.",
  },
  {
    conflictId: "conflict:18.5:public-beta-3:date-and-ordinal",
    versions: ["iOS 18.5", "iPadOS 18.5"],
    selectedDate: "2025-04-28",
    alternatives: ["2025-04-29"],
    resolution:
      "MacRumors' Pacific-time update and an independent Japanese install report describe the same build as Public Beta 3; the Japanese April 29 timestamp normalizes to April 28 in America/Los_Angeles. A living timeline incorrectly copies the developer ordinal as Public Beta 4.",
  },
  {
    conflictId: "conflict:15.7:beta-1-versus-release-candidate",
    versions: ["iOS 15.7", "iPadOS 15.7"],
    selectedDate: null,
    alternatives: ["2022-09-07"],
    resolution:
      "One headline called the September 7 terminal seed beta 1, while contemporaneous release-candidate coverage and Apple's September 12 final-release record establish the terminal boundary. No separately established numbered public-beta identity is proposed.",
  },
  {
    conflictId: "conflict:18.7:public-beta-label-versus-release-candidate",
    versions: ["iOS 18.7"],
    selectedDate: null,
    alternatives: ["2025-09-09"],
    resolution:
      "One publisher called build 22H20 a public beta. Build-level evidence identifies 22H20 as the release candidate and final payload, so the generic label is retained as a conflict and is not converted into Public Beta 1.",
  },
];
