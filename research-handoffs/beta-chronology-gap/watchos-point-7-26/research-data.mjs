export const batchId = "beta-chronology-gap-watchos-point-7-26";
export const cohortId = "watchos-point-7-26";
export const packetPath =
  "research-handoffs/beta-chronology-gap/watchos-point-7-26";
export const evidenceRoot =
  "tmp/research-evidence/beta-chronology-gap/watchos-point-7-26";
export const researchCutoff = "2026-07-31";
export const targetVersions = [
  "7.1",
  "7.2",
  "7.3",
  "7.4",
  "7.5",
  "7.6",
  "8.1",
  "8.3",
  "8.4",
  "8.5",
  "8.6",
  "8.7",
  "9.1",
  "26.4",
  "26.5",
  "26.6",
];
export const targetVersionIds = targetVersions.map(
  (version) => `version-watchos-${version.replaceAll(".", "-")}`,
);

const appearance = (
  sequence,
  appearanceDate,
  sourceIds,
  {
    decision = "supportable",
    identityStatus = "confirmed",
    blockers = [],
    qualification = null,
  } = {},
) => ({
  sequence,
  appearanceDate,
  sourceIds,
  decision,
  identityStatus,
  blockers,
  qualification,
});

const cycle = (version, appearances, notes = []) => ({
  version,
  releaseVersionId: `version-watchos-${version.replaceAll(".", "-")}`,
  applicabilityStatus: "applicableWithEstablishedAppearances",
  appearances,
  notes,
});

export const cycles = [
  cycle("7.1", [
    appearance(1, "2020-09-21", [
      "imore7-public-rolling",
      "iculture-71-cycle",
    ]),
    appearance(2, "2020-10-01", [
      "imore7-public-rolling",
      "iculture-71-cycle",
    ]),
  ]),
  cycle(
    "7.2",
    [
      appearance(2, "2020-11-18", [
        "imore7-public-rolling",
        "iphonecanada-72-pb2",
      ]),
    ],
    [
      "The November 12 first developer seed was pulled. Surviving evidence does not establish a public Public Beta 1 appearance.",
      "The December 2 third developer seed is not promoted to a public appearance; one living page reports broad tester availability, while the retained cycle chronology identifies only the developer seed.",
    ],
  ),
  cycle(
    "7.3",
    [
      appearance(2, "2021-01-13", [
        "9to5-73-pb2",
        "mr-73-pb2",
      ]),
    ],
    [
      "The December 16 first developer seed is not promoted to Public Beta 1 because contemporary reporting identifies watchOS as developer-only while other platforms entered public testing.",
    ],
  ),
  cycle(
    "7.4",
    [
      appearance(1, "2021-02-04", [
        "imore7-public-rolling",
        "iculture-74-cycle",
      ]),
      appearance(2, "2021-02-17", [
        "iculture-74-cycle",
        "kob-74-pb2",
      ]),
      appearance(3, "2021-03-05", [
        "kob-74-pb3",
        "macerkopf-74-pb3",
      ]),
      appearance(4, "2021-03-15", [
        "iculture-74-cycle",
        "ithinkdiff-74-pb4",
      ]),
      appearance(5, "2021-03-23", [
        "iculture-74-cycle",
        "kob-74-pb5",
      ]),
      appearance(
        7,
        "2021-04-07",
        ["9to5-74-pb7", "ithinkdiff-74-pb7"],
        {
          qualification:
            "Two independent contemporary reports explicitly identify Beta 7 as available to public testers. iCulture's living table omits a public row for Beta 7; the omission is retained as a completeness qualification rather than treated as affirmative contrary evidence.",
        },
      ),
    ],
    [
      "No Public Beta 6 appearance is established. Developer Beta 6 must not supply a public ordinal or date.",
    ],
  ),
  cycle("7.5", [
    appearance(1, "2021-04-23", [
      "imore7-public-rolling",
      "kob-75-pb1",
    ]),
    appearance(2, "2021-04-30", [
      "9to5-75-pb2",
      "kob-75-pb2",
    ]),
    appearance(3, "2021-05-10", [
      "9to5-75-pb3",
      "purudo-75-pb3",
    ]),
  ]),
  cycle(
    "7.6",
    [
      appearance(1, "2021-05-20", [
        "kob-76-pb1",
        "wccftech-76-pb1",
      ]),
      appearance(3, "2021-06-15", [
        "imore7-public-rolling",
        "9to5-76-pb3",
      ]),
      appearance(4, "2021-06-29", [
        "imore7-public-rolling",
        "9to5-76-pb4",
      ]),
      appearance(
        5,
        "2021-07-08",
        ["kob-76-pb5", "nishiki-76-pb5"],
        {
          qualification:
            "Two independent same-cycle reports explicitly identify Public Beta 5. The retained iCulture table omits a public row for Beta 5, so that living-table omission remains visible.",
        },
      ),
    ],
    [
      "No Public Beta 2 appearance is established. The paired developer seed is not used to infer one.",
    ],
  ),
  cycle("8.1", [
    appearance(
      2,
      "2021-09-29",
      ["forbes-81-first", "kob-81-pb2", "geeky-81-first"],
      {
        decision: "blocked",
        identityStatus: "conflict",
        blockers: [
          "The first defensible public appearance has an unresolved displayed-label conflict: Forbes calls it Public Beta 1, while Kobonemi calls the same appearance Public Beta 2 and Geeky Gadgets describes Beta 2 as public.",
          "No candidate may be admitted until an independent reviewer resolves or preserves the platform's actual displayed public-program identity.",
        ],
      },
    ),
    appearance(3, "2021-10-07", [
      "imore8-public-rolling",
      "9to5-81-pb3",
    ]),
    appearance(4, "2021-10-13", [
      "kob-81-pb4",
      "itopnews-81-pb4",
    ]),
  ]),
  cycle("8.3", [
    appearance(1, "2021-10-28", [
      "9to5-83-pb1",
      "ontop-83-pb1",
    ]),
    appearance(2, "2021-11-10", [
      "imore8-public-rolling",
      "macerkopf-83-pb2",
    ]),
    appearance(
      3,
      "2021-11-16",
      ["kob-83-pb3", "9to5-83-pb3-dev"],
      {
        decision: "blocked",
        identityStatus: "reported",
        blockers: [
          "Kobonemi explicitly identifies watchOS 8.3 Public Beta 3 and the Pacific-day appearance, but the second retained publisher only establishes the same-day developer seed.",
          "A second independent contemporary lineage must explicitly establish the public audience and ordinal.",
        ],
      },
    ),
    appearance(4, "2021-12-02", [
      "kob-83-pb4",
      "9to5-83-pb4",
    ]),
  ]),
  cycle("8.4", [
    appearance(
      1,
      "2021-12-20",
      ["kob-84-pb1", "ontop-84-pb1", "cultofmac-84-pb1-negative"],
      {
        qualification:
          "Cult of Mac reported watchOS as developer-only earlier on December 20. Kobonemi and ONTOP separately record the later public appearance; the negative source is a same-day timing boundary, not evidence that the appearance never occurred.",
      },
    ),
    appearance(2, "2022-01-13", [
      "iculture-84-cycle",
      "9to5-84-pb2",
    ]),
  ]),
  cycle("8.5", [
    appearance(1, "2022-01-28", [
      "ithinkdiff-85-cycle",
      "kob-85-pb1",
    ]),
    appearance(2, "2022-02-09", [
      "imore8-public-rolling",
      "kob-85-pb2",
    ]),
    appearance(3, "2022-02-16", [
      "imore8-public-rolling",
      "kob-85-pb3",
    ]),
    appearance(
      4,
      "2022-02-23",
      ["imore8-public-rolling", "kob-85-pb4", "9to5-85-pb4", "iculture-85-cycle"],
      {
        decision: "blocked",
        identityStatus: "conflict",
        blockers: [
          "Multiple reports support a February 23 Pacific public appearance, while iCulture's living table dates Public Beta 4 to February 22, the developer-seed date.",
          "The one-day channel-date conflict must be adjudicated independently before admission.",
        ],
      },
    ),
    appearance(
      5,
      "2022-03-02",
      ["imore8-public-rolling", "9to5-85-pb5", "iculture-85-cycle"],
      {
        decision: "blocked",
        identityStatus: "conflict",
        blockers: [
          "iMore explicitly records Public Beta 5 on March 2, but 9to5Mac's headline says Beta 5 while its body contains a Beta 4 typo and iCulture omits a public Beta 5 row.",
          "The exact identity lacks two internally clean, conflict-free lineages.",
        ],
      },
    ),
  ]),
  cycle("8.6", [
    appearance(
      1,
      "2022-04-06",
      ["ithinkdiff-86-cycle", "geeky-86-pb1-negative"],
      {
        decision: "blocked",
        identityStatus: "reported",
        blockers: [
          "iThinkDiff explicitly reports Public Beta 1; the second retained publisher described the seed as developer-only at publication and only expected a later public release.",
          "A second independent exact public-appearance lineage is required.",
        ],
      },
    ),
    appearance(
      2,
      "2022-04-20",
      ["9to5-86-pb2", "geeky-86-pb2-negative"],
      {
        decision: "blocked",
        identityStatus: "reported",
        blockers: [
          "9to5Mac explicitly establishes public availability of watchOS 8.6 Beta 2; the second retained publisher only says public availability was expected.",
          "A second independent exact public-appearance lineage is required.",
        ],
      },
    ),
    appearance(3, "2022-04-27", [
      "imore8-public-rolling",
      "9to5-86-pb3",
    ]),
    appearance(4, "2022-05-04", [
      "imore8-public-rolling",
      "9to5-86-pb4",
    ]),
  ]),
  cycle("8.7", [
    appearance(1, "2022-05-19", [
      "imore8-public-rolling",
      "9to5-87-pb1",
    ]),
    appearance(2, "2022-06-01", [
      "iculture-87-cycle",
      "9to5-87-pb2",
    ]),
    appearance(3, "2022-06-15", [
      "imore8-public-rolling",
      "iculture-87-cycle",
    ]),
    appearance(4, "2022-06-28", [
      "iculture-87-cycle",
      "9to5-87-pb4",
    ]),
    appearance(5, "2022-07-05", [
      "iculture-87-cycle",
      "kob-87-pb5",
    ]),
  ]),
  cycle(
    "9.1",
    [
      appearance(2, "2022-09-21", [
        "9to5-91-pb2",
        "mr-91-pb2",
      ]),
      appearance(3, "2022-09-28", [
        "9to5-91-pb3",
        "maclife-91-pb3",
      ]),
      appearance(4, "2022-10-06", [
        "9to5-91-pb4",
        "times-91-pb4",
      ]),
      appearance(5, "2022-10-12", [
        "9to5-91-pb5",
        "imore9-public-rolling",
      ]),
    ],
    [
      "The September 14 first developer seed is explicitly retained as not yet public; Public Beta 1 is not inferred.",
    ],
  ),
  cycle(
    "26.4",
    [
      appearance(1, "2026-02-17", [
        "9to5-264-pb1",
        "mr-264-pb1",
      ]),
      appearance(2, "2026-02-24", [
        "mr-264-pb2",
        "buchi-264-pb2",
      ]),
    ],
    [
      "No exact public Public Beta 3 or Public Beta 4 appearance is established. Developer-seed reporting is retained only as negative boundary evidence.",
    ],
  ),
  cycle("26.5", [
    appearance(1, "2026-04-03", [
      "mr-265-pb1",
      "9to5-265-pb1",
    ]),
    appearance(2, "2026-04-14", [
      "mr-265-pb2",
      "9to5-265-pb2",
    ]),
    appearance(3, "2026-04-21", [
      "9to5-265-pb3",
      "tuttotech-265-pb3",
    ]),
    appearance(
      4,
      "2026-04-27",
      ["9to5-265-pb4", "mr-265-pb4-dev"],
      {
        decision: "blocked",
        identityStatus: "reported",
        blockers: [
          "9to5Mac's same-day update explicitly says the Beta 4 releases reached public testers, including watchOS 26.5.",
          "MacRumors establishes only the developer seed. A second independent exact public-appearance lineage is required.",
        ],
      },
    ),
  ]),
  cycle("26.6", [
    appearance(1, "2026-05-28", [
      "mr-266-pb1",
      "9to5-266-pb1",
    ]),
    appearance(2, "2026-06-16", [
      "mr-266-pb2",
      "9to5-266-pb2",
    ]),
    appearance(
      3,
      "2026-06-30",
      ["mr-266-pb3", "9to5-266-pb3", "iculture-266-cycle"],
      {
        decision: "blocked",
        identityStatus: "conflict",
        blockers: [
          "MacRumors and 9to5Mac support the June 30 public appearance. iCulture labels the public row June 29, matching the developer release day.",
          "The channel-date conflict must be independently adjudicated before admission.",
        ],
      },
    ),
    appearance(4, "2026-07-07", [
      "mr-266-pb4",
      "iculture-266-cycle",
    ]),
    appearance(
      5,
      "2026-07-14",
      ["9to5-266-pb5", "mr-266-pb5-dev", "iculture-266-cycle"],
      {
        decision: "blocked",
        identityStatus: "conflict",
        blockers: [
          "9to5Mac's developer article was updated on July 14 to state that Public Beta 5 was available; its original developer appearance was July 13.",
          "iCulture dates Public Beta 5 to July 13, while MacRumors' July 13 report is developer-only. The exact Pacific public date lacks two conflict-free lineages.",
        ],
      },
    ),
  ]),
];

export const negativeFindings = [
  {
    findingId: "negative:watchos:7.2:public-beta-1",
    version: "7.2",
    sequence: 1,
    date: "2020-11-12",
    classification: "publicDistributionNotEstablished",
    sourceIds: ["iculture-72-cycle", "imore7-public-rolling"],
    finding:
      "The first seed was pulled and surviving sources do not establish a completed public-program appearance. One living iMore entry broadly says developer and public testers; it is not enough to overcome the withdrawal and developer-only reporting.",
  },
  {
    findingId: "negative:watchos:7.2:public-beta-3",
    version: "7.2",
    sequence: 3,
    date: "2020-12-02",
    classification: "publicDistributionNotEstablished",
    sourceIds: ["iculture-72-cycle", "imore7-public-rolling"],
    finding:
      "The retained cycle chronology establishes Developer Beta 3, while a single living iMore entry reports broad tester availability. The exact public identity is not established.",
  },
  {
    findingId: "negative:watchos:7.3:public-beta-1",
    version: "7.3",
    sequence: 1,
    date: "2020-12-16",
    classification: "publicDistributionNotEstablished",
    sourceIds: ["cultofmac-73-pb1-negative"],
    finding:
      "Contemporary reporting identifies watchOS 7.3 Beta 1 as developer-only while the mobile betas entered public testing.",
  },
  {
    findingId: "negative:watchos:7.4:public-beta-6",
    version: "7.4",
    sequence: 6,
    date: "2021-03-31",
    classification: "publicDistributionNotEstablished",
    sourceIds: ["iculture-74-cycle"],
    finding:
      "The retained chronology has a Developer Beta 6 row but no public row. No exact public appearance is inferred.",
  },
  {
    findingId: "negative:watchos:7.6:public-beta-2",
    version: "7.6",
    sequence: 2,
    date: null,
    classification: "publicDistributionNotEstablished",
    sourceIds: ["iculture-76-cycle", "imore7-public-rolling"],
    finding:
      "No exact Public Beta 2 appearance was established. The developer sequence is not used to manufacture a public date.",
  },
  {
    findingId: "negative:watchos:9.1:public-beta-1",
    version: "9.1",
    sequence: 1,
    date: "2022-09-14",
    classification: "publicDistributionNotEstablished",
    sourceIds: ["kob-91-pb1-negative"],
    finding:
      "The source explicitly says the first watchOS 9.1 seed was not yet public. Public numbering starts with the first supported displayed public label, Public Beta 2.",
  },
  {
    findingId: "negative:watchos:26.4:public-beta-3",
    version: "26.4",
    sequence: 3,
    date: "2026-03-05",
    classification: "publicDistributionNotEstablished",
    sourceIds: ["mr-264-pb3-negative"],
    finding:
      "The retained article identifies a third watchOS beta but does not establish a public audience or displayed Public Beta 3 label.",
  },
  {
    findingId: "negative:watchos:26.4:public-beta-4",
    version: "26.4",
    sequence: 4,
    date: "2026-03-09",
    classification: "publicDistributionNotEstablished",
    sourceIds: ["9to5-264-pb4-reported", "mr-264-pb4-negative"],
    finding:
      "9to5Mac's full-lineup article was updated to say public betas rolled out later on March 9, but no second independent source explicitly establishes the watchOS public ordinal. The platform-specific MacRumors report establishes Developer Beta 4 only, so no exact Public Beta 4 identity is admitted.",
  },
];

export const conflicts = [
  {
    conflictId: "conflict:watchos:7.4:public-beta-7-living-table-omission",
    severity: "qualification",
    candidateKey: "watchOS|7.4|publicBeta|7|2021-04-07",
    sourceIds: ["9to5-74-pb7", "ithinkdiff-74-pb7", "iculture-74-cycle"],
    disposition:
      "Retain the appearance with a mandatory qualification. Two independent exact reports outweigh a living-table omission; the omission is not affirmative contrary evidence.",
  },
  {
    conflictId: "conflict:watchos:7.6:public-beta-5-living-table-omission",
    severity: "qualification",
    candidateKey: "watchOS|7.6|publicBeta|5|2021-07-08",
    sourceIds: ["kob-76-pb5", "nishiki-76-pb5", "iculture-76-cycle"],
    disposition:
      "Retain the appearance with a mandatory qualification. Two independent exact reports support the public identity; preserve the living-table omission.",
  },
  {
    conflictId: "conflict:watchos:8.1:first-public-label",
    severity: "blocking",
    candidateKey: "watchOS|8.1|publicBeta|2|2021-09-29",
    sourceIds: ["forbes-81-first", "kob-81-pb2", "geeky-81-first"],
    disposition:
      "Blocked. The same first public appearance is explicitly labeled Public Beta 1 and Public Beta 2 by different publishers.",
  },
  {
    conflictId: "conflict:watchos:8.4:public-beta-1-same-day-timing",
    severity: "qualification",
    candidateKey: "watchOS|8.4|publicBeta|1|2021-12-20",
    sourceIds: ["kob-84-pb1", "ontop-84-pb1", "cultofmac-84-pb1-negative"],
    disposition:
      "Retain with timing qualification. The negative report predates the later same-day public appearance established by two independent sources.",
  },
  {
    conflictId: "conflict:watchos:8.5:public-beta-4-date",
    severity: "blocking",
    candidateKey: "watchOS|8.5|publicBeta|4|2022-02-23",
    sourceIds: ["imore8-public-rolling", "kob-85-pb4", "9to5-85-pb4", "iculture-85-cycle"],
    disposition:
      "Blocked pending independent adjudication of February 22 versus February 23 for the public channel.",
  },
  {
    conflictId: "conflict:watchos:8.5:public-beta-5-identity",
    severity: "blocking",
    candidateKey: "watchOS|8.5|publicBeta|5|2022-03-02",
    sourceIds: ["imore8-public-rolling", "9to5-85-pb5", "iculture-85-cycle"],
    disposition:
      "Blocked because one retained article is internally inconsistent and the living chronology omits the public row.",
  },
  {
    conflictId: "conflict:watchos:26.6:public-beta-3-date",
    severity: "blocking",
    candidateKey: "watchOS|26.6|publicBeta|3|2026-06-30",
    sourceIds: ["mr-266-pb3", "9to5-266-pb3", "iculture-266-cycle"],
    disposition:
      "Blocked pending independent adjudication of June 29 versus June 30 for the public channel.",
  },
  {
    conflictId: "conflict:watchos:26.6:public-beta-5-date",
    severity: "blocking",
    candidateKey: "watchOS|26.6|publicBeta|5|2026-07-14",
    sourceIds: ["9to5-266-pb5", "mr-266-pb5-dev", "iculture-266-cycle"],
    disposition:
      "Blocked. The public update was observed July 14, while the living table assigns July 13 and the July 13 MacRumors report is developer-only.",
  },
];

export const applicability = cycles.map(({version, releaseVersionId, appearances}) => ({
  version,
  releaseVersionId,
  status: "applicableWithEstablishedAppearances",
  basis:
    "watchOS public-beta applicability began with watchOS 7. This modeled point version is later than that boundary and has at least one claim-level public appearance supported in this packet.",
  establishedAppearanceCount: appearances.length,
  sourceIds: ["apple-watchos7-boundary"],
}));

export const allAppearances = cycles.flatMap((entry) =>
  entry.appearances.map((item) => ({
    ...item,
    version: entry.version,
    releaseVersionId: entry.releaseVersionId,
    applicabilityStatus: entry.applicabilityStatus,
  })),
);

export const supportableAppearances = allAppearances.filter(
  ({decision}) => decision === "supportable",
);
export const blockedAppearances = allAppearances.filter(
  ({decision}) => decision === "blocked",
);
