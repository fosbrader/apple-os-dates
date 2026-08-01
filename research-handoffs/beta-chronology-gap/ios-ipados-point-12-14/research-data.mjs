export const batchId = "beta-chronology-gap-ios-ipados-point-12-14";
export const cohortId = "ios-ipados-point-12-14";
export const packetPath =
  "research-handoffs/beta-chronology-gap/ios-ipados-point-12-14";
export const evidenceRoot =
  "tmp/research-evidence/beta-chronology-gap/ios-ipados-point-12-14";
export const researchCutoff = "2026-07-31";

const cycle = (version, appearances) => ({version, appearances});
const appearance = (sequence, appearanceDate, extra = {}) => ({
  sequence,
  appearanceDate,
  ...extra,
});

export const iosCycles = [
  cycle("12.1", [
    appearance(1, "2018-09-20"),
    appearance(2, "2018-10-02"),
    appearance(3, "2018-10-09"),
    appearance(4, "2018-10-15"),
    appearance(5, "2018-10-22"),
  ]),
  cycle("12.1.1", [
    appearance(1, "2018-11-01"),
    appearance(2, "2018-11-07"),
    appearance(3, "2018-11-15"),
  ]),
  cycle("12.1.2", [appearance(1, "2018-12-11")]),
  cycle("12.1.3", [
    appearance(2, "2018-12-19"),
    appearance(3, "2019-01-07"),
    appearance(4, "2019-01-10"),
  ]),
  cycle("12.2", [
    appearance(1, "2019-01-28"),
    appearance(2, "2019-02-05"),
    appearance(3, "2019-02-20"),
    appearance(4, "2019-03-04"),
    appearance(5, "2019-03-11"),
    appearance(6, "2019-03-18"),
  ]),
  cycle("12.3", [
    appearance(1, "2019-03-28"),
    appearance(2, "2019-04-09"),
    appearance(3, "2019-04-23"),
    appearance(4, "2019-04-29"),
    appearance(5, "2019-05-07"),
    appearance(6, "2019-05-10"),
  ]),
  cycle("12.4", [
    appearance(2, "2019-05-20"),
    appearance(3, "2019-05-28"),
    appearance(4, "2019-06-12"),
    appearance(5, "2019-06-24"),
    appearance(6, "2019-07-09"),
    appearance(7, "2019-07-16"),
  ]),
  cycle("13.1", [
    appearance(1, "2019-08-28"),
    appearance(2, "2019-09-04"),
    appearance(3, "2019-09-11"),
    appearance(4, "2019-09-18"),
  ]),
  cycle("13.2", [
    appearance(1, "2019-10-02"),
    appearance(2, "2019-10-10"),
    appearance(3, "2019-10-16"),
    appearance(4, "2019-10-23"),
  ]),
  cycle("13.3", [
    appearance(1, "2019-11-06"),
    appearance(2, "2019-11-12"),
    appearance(3, "2019-11-20"),
    appearance(4, "2019-12-05"),
  ]),
  cycle("13.4", [
    appearance(1, "2020-02-10"),
    appearance(2, "2020-02-20"),
    appearance(3, "2020-02-26"),
    appearance(4, "2020-03-03"),
    appearance(5, "2020-03-10"),
  ]),
  cycle("13.5", [
    appearance(2, "2020-04-29"),
    appearance(3, "2020-05-06"),
  ]),
  cycle("13.6", [
    appearance(2, "2020-06-09"),
    appearance(3, "2020-06-30"),
  ]),
  cycle("13.7", [appearance(1, "2020-08-26")]),
  cycle("14.2", [
    appearance(1, "2020-09-21"),
    appearance(2, "2020-09-30"),
    appearance(3, "2020-10-14"),
    appearance(4, "2020-10-21"),
  ]),
  cycle("14.3", [
    appearance(1, "2020-11-13"),
    appearance(2, "2020-11-17"),
    appearance(3, "2020-12-02"),
  ]),
  cycle("14.4", [
    appearance(1, "2020-12-17"),
    appearance(2, "2021-01-13"),
  ]),
  cycle("14.5", [
    appearance(1, "2021-02-04"),
    appearance(2, "2021-02-17"),
    appearance(3, "2021-03-03", {productionExisting: true}),
    appearance(4, "2021-03-15"),
    appearance(5, "2021-03-23"),
    appearance(6, "2021-03-31"),
    appearance(7, "2021-04-07"),
    appearance(8, "2021-04-13"),
  ]),
  cycle("14.6", [
    appearance(1, "2021-04-23"),
    appearance(2, "2021-04-30"),
    appearance(3, "2021-05-10"),
  ]),
  cycle("14.7", [
    appearance(1, "2021-05-20"),
    appearance(3, "2021-06-15"),
    appearance(4, "2021-06-29"),
    appearance(5, "2021-07-08"),
  ]),
];

export const ipadosCycles = [
  ...iosCycles
    .filter(({version}) => version.startsWith("13."))
    .map(({version, appearances}) =>
      cycle(
        version,
        appearances.map(({sequence, appearanceDate}) =>
          appearance(sequence, appearanceDate),
        ),
      ),
    ),
  ...iosCycles
    .filter(({version}) =>
      ["14.2", "14.3", "14.4", "14.5", "14.6"].includes(version),
    )
    .map(({version, appearances}) =>
      cycle(
        version,
        appearances.map(({sequence, appearanceDate, productionExisting}) => ({
          sequence,
          appearanceDate,
          ...(productionExisting ? {productionExisting: true} : {}),
        })),
      ),
    ),
];

export const platformSpecs = [
  {
    platform: "iOS",
    slug: "ios",
    platformId: "platform-ios",
    cycles: iosCycles,
  },
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
      ...platform,
      cycles: undefined,
      version: entry.version,
      ...item,
      releaseVersionId: `version-${platform.slug}-${entry.version.replaceAll(".", "-")}`,
      candidateId: `candidate:apple:${platform.slug}:${entry.version}:public-beta-${item.sequence}`,
      label: `Public Beta ${item.sequence}`,
      routeAlias: `public-beta-${item.sequence}`,
    })),
  ),
);

export const candidates = allObservedAppearances.filter(
  ({productionExisting}) => !productionExisting,
);

export const targetVersionIds = [
  ...new Set(
    platformSpecs.flatMap((platform) =>
      platform.cycles.map(
        ({version}) =>
          `version-${platform.slug}-${version.replaceAll(".", "-")}`,
      ),
    ),
  ),
  "version-ios-14-1",
  "version-ios-14-8",
  "version-ipados-14-1",
  "version-ipados-14-7",
  "version-ipados-14-8",
].sort();

export const negativeFindings = [
  {
    findingId: "negative:ios:12.1.3:public-beta-1",
    platform: "iOS",
    version: "12.1.3",
    routeAlias: "public-beta-1",
    result: "notSeparatelyObserved",
    note:
      "The cycle inherited a first public appearance labeled iOS 12.1.2 Public Beta 1 before Apple renamed the tested branch. The first exact iOS 12.1.3 public label was Public Beta 2.",
  },
  {
    findingId: "negative:ios:12.4:public-beta-1",
    platform: "iOS",
    version: "12.4",
    routeAlias: "public-beta-1",
    result: "notSeparatelyObserved",
    note:
      "The first exact iOS 12.4 public appearance was explicitly labeled Public Beta 2; contemporary coverage states that no Public Beta 1 was released.",
  },
  {
    findingId: "negative:ios-ipados:13.5:public-beta-1",
    platform: "iOS and iPadOS",
    version: "13.5",
    routeAlias: "public-beta-1",
    result: "legacyLabelOnly",
    note:
      "The first public appearance was labeled 13.4.5 Public Beta 1. The branch was renamed to 13.5 before its next public appearance, Public Beta 2.",
  },
  {
    findingId: "negative:ios-ipados:13.6:public-beta-1",
    platform: "iOS and iPadOS",
    version: "13.6",
    routeAlias: "public-beta-1",
    result: "legacyLabelOnly",
    note:
      "The first public appearance was labeled 13.5.5 Public Beta 1. The branch was renamed to 13.6 before its next public appearance, Public Beta 2.",
  },
  {
    findingId: "negative:ios-ipados:14.1:any-public-beta",
    platform: "iOS and iPadOS",
    version: "14.1",
    routeAlias: null,
    result: "noPublicBetaTestingEstablished",
    note:
      "Contemporary histories describe 14.1 as an RC/final-only cycle without a public-beta program.",
  },
  {
    findingId: "negative:ios-ipados:14.7:public-beta-2",
    platform: "iOS and iPadOS",
    version: "14.7",
    routeAlias: "public-beta-2",
    result: "developerOnlyWithheldFromPublic",
    note:
      "Developer Beta 2 was released, but contemporary public-program histories jump from Public Beta 1 to Public Beta 3 and report that Public Beta 2 was withheld after SIM-failure reports.",
  },
  {
    findingId: "negative:ios-ipados:14.8:any-beta",
    platform: "iOS and iPadOS",
    version: "14.8",
    routeAlias: null,
    result: "releasedWithoutBetaTesting",
    note:
      "Contemporary reporting explicitly states that iOS 14.8 and iPadOS 14.8 were released without public beta testing.",
  },
];

export const modelGaps = [
  {
    platform: "iPadOS",
    version: "14.7",
    expectedReleaseVersionId: "version-ipados-14-7",
    result: "parentReleaseVersionMissing",
    observedPublicSequence: [
      appearance(1, "2021-05-20"),
      appearance(3, "2021-06-15"),
      appearance(4, "2021-06-29"),
      appearance(5, "2021-07-08"),
    ],
    note:
      "Research establishes iPadOS 14.7 public appearances, but this packet does not propose releaseEvent candidates because production lacks the required parent releaseVersion.",
  },
  {
    platform: "iPadOS",
    version: "14.8",
    expectedReleaseVersionId: "version-ipados-14-8",
    result: "parentReleaseVersionMissing",
    observedPublicSequence: [],
    note:
      "The final release existed and contemporary reporting says it was not beta-tested, but production lacks the parent releaseVersion.",
  },
];
