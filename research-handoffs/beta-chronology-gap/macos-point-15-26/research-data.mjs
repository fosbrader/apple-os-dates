export const batchId = "beta-chronology-gap-macos-point-15-26";
export const cohortId = "macos-point-15-26";
export const packetPath =
  "research-handoffs/beta-chronology-gap/macos-point-15-26";
export const evidenceRoot =
  "tmp/research-evidence/beta-chronology-gap/macos-point-15-26";
export const researchCutoff = "2026-07-31";

const appearance = (
  sequence,
  appearanceDate,
  sourceIds,
  {
    identityStatus = "confirmed",
    evidenceState = "corroborated",
    blockers = [],
    qualification = null,
  } = {},
) => ({
  sequence,
  appearanceDate,
  sourceIds,
  identityStatus,
  evidenceState,
  blockers,
  qualification,
});

const cycle = (version, stableDate, appearances) => ({
  version,
  releaseVersionId: `version-macos-${version.replaceAll(".", "-")}`,
  stableDate,
  appearances,
});

export const cycles = [
  cycle("15.1", "2024-10-28", [
    appearance(1, "2024-09-19", [
      "9to5-151-cycle",
      "iculture-151-cycle",
    ]),
    appearance(2, "2024-09-24", [
      "9to5-151-cycle",
      "iculture-151-cycle",
    ]),
    appearance(
      3,
      "2024-10-07",
      ["9to5-151-cycle", "mr-151-pb3-update", "iculture-151-cycle"],
      {
        identityStatus: "conflict",
        blockers: [
          "Independent review must adjudicate iCulture's October 8 row against two October 7 Pacific reports; only 9to5Mac independently supplies the displayed Public Beta 3 ordinal.",
        ],
        qualification:
          "iCulture's retained rolling row says October 8. Two same-day Pacific reports support October 7; the one-day conflict remains explicit. 9to5Mac supplies the public ordinal, while MacRumors independently confirms public distribution and date.",
      },
    ),
    appearance(4, "2024-10-16", [
      "9to5-151-cycle",
      "iculture-151-cycle",
    ]),
  ]),
  cycle("15.2", "2024-12-11", [
    appearance(1, "2024-11-06", [
      "9to5-152-cycle",
      "iculture-152-cycle",
    ]),
    appearance(2, "2024-11-12", [
      "9to5-152-cycle",
      "iculture-152-cycle",
    ]),
    appearance(3, "2024-11-20", [
      "9to5-152-cycle",
      "iculture-152-cycle",
    ]),
  ]),
  cycle("15.3", "2025-01-27", [
    appearance(1, "2024-12-18", [
      "9to5-153-cycle",
      "mr-153-pb1",
    ]),
    appearance(2, "2025-01-08", [
      "9to5-153-cycle",
      "mr-153-pb2",
    ]),
    appearance(
      3,
      "2025-01-16",
      ["9to5-153-cycle", "osxdaily-153-pb3"],
      {
        blockers: [
          "9to5Mac explicitly establishes public-tester availability for Beta 3; OS X Daily independently corroborates the Beta 3 appearance through Apple's beta programs but does not state the word “public” in article prose.",
        ],
      },
    ),
  ]),
  cycle("15.4", "2025-03-31", [
    appearance(1, "2025-02-24", [
      "9to5-154-cycle",
      "mr-154-pb1",
    ]),
    appearance(2, "2025-03-04", [
      "9to5-154-cycle",
      "mr-154-pb2",
    ]),
    appearance(3, "2025-03-11", [
      "9to5-154-cycle",
      "mr-154-pb3",
    ]),
    appearance(
      4,
      "2025-03-17",
      ["9to5-154-cycle", "osxdaily-154-pb4"],
      {
        blockers: [
          "9to5Mac explicitly supplies Public Beta 4; OS X Daily independently corroborates Beta 4 through Apple's beta program but does not distinguish public from developer enrollment in article prose.",
        ],
      },
    ),
  ]),
  cycle("15.5", "2025-05-12", [
    appearance(
      1,
      "2025-04-15",
      ["9to5-155-cycle", "mr-155-pb1"],
      {
        identityStatus: "conflict",
        blockers: [
          "Independent review must retain the two exact first-public-beta lineages while documenting iClarified's internally inconsistent “third public beta” wording.",
        ],
      },
    ),
    appearance(2, "2025-04-22", [
      "9to5-155-cycle",
      "mr-155-pb2",
    ]),
    appearance(
      3,
      "2025-04-28",
      [
        "monomaniac-155-pb3",
        "9to5-155-cycle",
        "mr-155-pb3",
      ],
      {
        identityStatus: "conflict",
        blockers: [
          "Independent review must adjudicate iCulture's conflicting Public Beta 4 label against the explicit Public Beta 3 build record and installer observation.",
        ],
        qualification:
          "The public program called this Public Beta 3 even though it shared the fourth developer seed. iCulture's rolling table instead calls it Public Beta 4.",
      },
    ),
  ]),
  cycle("15.6", "2025-07-29", [
    appearance(3, "2025-07-15", [
      "mr-156-pb3",
      "iclarified-156-pb3",
    ]),
  ]),
  cycle("26.1", "2025-11-03", [
    appearance(1, "2025-09-24", [
      "mr-261-pb1",
      "iculture-261-cycle",
    ]),
    appearance(2, "2025-10-07", [
      "mr-261-pb2",
      "iculture-261-cycle",
    ]),
    appearance(3, "2025-10-14", [
      "mr-261-pb3",
      "iculture-261-cycle",
    ]),
    appearance(4, "2025-10-20", [
      "mr-261-pb4",
      "iculture-261-cycle",
    ]),
  ]),
  cycle("26.2", "2025-12-12", [
    appearance(1, "2025-11-07", [
      "9to5-262-pb1",
      "mr-262-pb1",
    ]),
    appearance(2, "2025-11-13", [
      "9to5-262-pb2",
      "mr-262-pb2",
    ]),
    appearance(
      3,
      "2025-11-18",
      ["9to5-262-pb3", "mactrast-262-pb3"],
      {
        identityStatus: "conflict",
        blockers: [
          "Independent review must adjudicate two explicit Public Beta 3 reports against MacTech's Public Beta 2 wording.",
        ],
        qualification:
          "MacTech called the November 18 seed the second public beta. Two platform-specific reports explicitly call it Public Beta 3, following the November 7 and November 13 public appearances.",
      },
    ),
  ]),
  cycle("26.3", "2026-02-11", [
    appearance(1, "2025-12-17", [
      "9to5-263-pb1",
      "iculture-263-cycle",
    ]),
    appearance(2, "2026-01-13", [
      "9to5-263-pb2",
      "iculture-263-cycle",
    ]),
    appearance(3, "2026-01-27", [
      "9to5-263-pb3",
      "iculture-263-cycle",
    ]),
  ]),
  cycle("26.4", "2026-03-24", [
    appearance(1, "2026-02-17", [
      "9to5-264-pb1",
      "mr-264-pb1",
    ]),
    appearance(2, "2026-02-24", [
      "mr-264-pb2",
      "mactrast-264-pb2",
    ]),
    appearance(3, "2026-03-04", [
      "mr-264-pb3",
      "mactrast-264-pb3",
    ]),
    appearance(
      4,
      "2026-03-09",
      ["9to5-264-pb4", "mr-264-pb4"],
      {
        blockers: [
          "9to5Mac explicitly supplies the public ordinal; MacRumors independently confirms the public appearance and date but uses a generic public-update label.",
        ],
        qualification:
          "The second publisher lineage corroborates public distribution and date, but not the public ordinal independently.",
      },
    ),
  ]),
  cycle("26.5", "2026-05-11", [
    appearance(1, "2026-04-03", [
      "mr-265-pb1",
      "technopat-265-pb1",
    ]),
    appearance(
      2,
      "2026-04-21",
      ["9to5-265-pb2", "mr-265-pb2"],
      {
        identityStatus: "conflict",
        blockers: [
          "Independent review must verify the explicit April 21 Public Beta 2 evidence against iCulture's shifted April 14 row.",
        ],
        qualification:
          "Apple skipped a macOS public seed after Developer Beta 2. The April 21 public appearance was explicitly labeled Public Beta 2 even though it shared Developer Beta 3.",
      },
    ),
    appearance(
      3,
      "2026-04-27",
      ["9to5-265-pb3", "monomaniac-265-pb3"],
      {
        identityStatus: "conflict",
        blockers: [
          "Independent review must verify the explicit April 27 Public Beta 3 evidence against iCulture's shifted Public Beta 4 row.",
        ],
        qualification:
          "The April 27 appearance was explicitly Public Beta 3 even though it shared Developer Beta 4. iCulture's rolling table shifts the public ordinals and dates.",
      },
    ),
  ]),
  cycle("26.6", "2026-07-27", [
    appearance(1, "2026-05-28", [
      "mr-266-pb1",
      "iculture-266-cycle",
    ]),
    appearance(2, "2026-06-16", [
      "mr-266-pb2",
      "iculture-266-cycle",
    ]),
    appearance(
      3,
      "2026-06-30",
      ["mr-266-pb3", "iculture-266-cycle"],
      {
        identityStatus: "conflict",
        blockers: [
          "Independent review must adjudicate June 30 public distribution against iCulture's June 29 developer-date row.",
        ],
        qualification:
          "iCulture's retained row says June 29, matching the developer seed. MacRumors explicitly reports public distribution on June 30 Pacific; that date is retained.",
      },
    ),
    appearance(4, "2026-07-07", [
      "mr-266-pb4",
      "iculture-266-cycle",
    ]),
    appearance(5, "2026-07-13", [
      "9to5-266-pb5",
      "monomaniac-266-pb5",
    ]),
  ]),
];

export const targetVersions = cycles.map(({version}) => version);
export const targetVersionIds = cycles.map(({releaseVersionId}) =>
  releaseVersionId,
);

export const candidates = cycles.flatMap((entry) =>
  entry.appearances.map((item) => ({
    candidateId: `candidate:apple:macos:${entry.version}:public-beta-${item.sequence}`,
    platform: "macOS",
    platformId: "platform-macos",
    version: entry.version,
    releaseVersionId: entry.releaseVersionId,
    stableDate: entry.stableDate,
    label: `Public Beta ${item.sequence}`,
    routeAlias: `public-beta-${item.sequence}`,
    channel: "publicBeta",
    appearanceDate: item.appearanceDate,
    sequence: item.sequence,
    sourceIds: item.sourceIds,
    identityStatus: item.identityStatus,
    evidenceState: item.evidenceState,
    blockers: item.blockers,
    qualification: item.qualification,
  })),
);

export const conflicts = [
  {
    conflictId: "conflict:macos:15.1:public-beta-3:calendar-date",
    version: "15.1",
    candidateId: "candidate:apple:macos:15.1:public-beta-3",
    field: "appearanceDate",
    retainedValue: "2024-10-07",
    conflictingValue: "2024-10-08",
    sourceIds: [
      "9to5-151-cycle",
      "mr-151-pb3-update",
      "iculture-151-cycle",
    ],
    disposition:
      "Retain October 7 in America/Los_Angeles. iCulture's one-day-later rolling row remains a source qualification.",
  },
  {
    conflictId: "conflict:macos:15.5:april-15-public-ordinal",
    version: "15.5",
    candidateId: "candidate:apple:macos:15.5:public-beta-1",
    field: "sequence",
    retainedValue: 1,
    conflictingValue: 3,
    sourceIds: ["mr-155-pb1", "9to5-155-cycle", "iclarified-155-conflict"],
    disposition:
      "Retain Public Beta 1. iClarified's article text says third public beta on the first-public-beta date and conflicts with two exact contemporary lineages.",
  },
  {
    conflictId: "conflict:macos:15.5:april-28-public-ordinal",
    version: "15.5",
    candidateId: "candidate:apple:macos:15.5:public-beta-3",
    field: "sequence",
    retainedValue: 3,
    conflictingValue: 4,
    sourceIds: [
      "monomaniac-155-pb3",
      "iculture-155-cycle",
      "9to5-155-cycle",
      "mr-155-pb3",
    ],
    disposition:
      "Retain displayed Public Beta 3. Do not infer Public Beta 4 from Developer Beta 4 or iCulture's shifted row.",
  },
  {
    conflictId: "conflict:macos:15.6:missing-early-public-labels",
    version: "15.6",
    candidateId: "candidate:apple:macos:15.6:public-beta-3",
    field: "sequenceCompleteness",
    retainedValue: "Only Public Beta 3 independently established",
    conflictingValue: "Assumed Public Beta 1 and 2 from developer chronology",
    sourceIds: ["mr-156-pb3", "iclarified-156-pb3", "iculture-156-cycle"],
    disposition:
      "Do not create Public Beta 1 or 2. No retained source explicitly establishes those macOS public appearances.",
  },
  {
    conflictId: "conflict:macos:26.2:november-18-public-ordinal",
    version: "26.2",
    candidateId: "candidate:apple:macos:26.2:public-beta-3",
    field: "sequence",
    retainedValue: 3,
    conflictingValue: 2,
    sourceIds: [
      "9to5-262-pb3",
      "mactrast-262-pb3",
      "mactech-262-conflict",
    ],
    disposition:
      "Retain Public Beta 3. MacTech's second-public-beta wording conflicts with the platform-specific sequence.",
  },
  {
    conflictId: "conflict:macos:26.2:iculture-public-row-omission",
    version: "26.2",
    candidateId: null,
    field: "sequenceCompleteness",
    retainedValue: "Three public appearances independently established",
    conflictingValue: "No public rows in iCulture table",
    sourceIds: ["iculture-262-cycle", "9to5-262-pb1", "9to5-262-pb2", "9to5-262-pb3"],
    disposition:
      "Treat iCulture as an incomplete living chronology for this cycle, not negative evidence.",
  },
  {
    conflictId: "conflict:macos:26.4:iculture-late-row-omissions",
    version: "26.4",
    candidateId: null,
    field: "sequenceCompleteness",
    retainedValue: "Public Beta 1 through 4",
    conflictingValue: "iCulture table stops after Public Beta 2",
    sourceIds: ["iculture-264-cycle", "mr-264-pb3", "9to5-264-pb4"],
    disposition:
      "Retain independently reported Public Beta 3 and 4; classify the rolling table as incomplete.",
  },
  {
    conflictId: "conflict:macos:26.5:shifted-public-sequence",
    version: "26.5",
    candidateId: null,
    field: "sequenceAndDate",
    retainedValue: "PB1 Apr 3; PB2 Apr 21; PB3 Apr 27",
    conflictingValue: "PB1 Apr 3; PB2 Apr 14; PB3 Apr 21; PB4 Apr 27",
    sourceIds: [
      "iculture-265-cycle",
      "mr-265-apr14-negative",
      "9to5-265-pb2",
      "mr-265-pb2",
      "9to5-265-pb3",
      "monomaniac-265-pb3",
    ],
    disposition:
      "Retain the explicit public-program sequence. April 14 did not include a macOS public release; do not map developer ordinals into the public channel.",
  },
  {
    conflictId: "conflict:macos:26.6:public-beta-3-calendar-date",
    version: "26.6",
    candidateId: "candidate:apple:macos:26.6:public-beta-3",
    field: "appearanceDate",
    retainedValue: "2026-06-30",
    conflictingValue: "2026-06-29",
    sourceIds: ["mr-266-pb3", "iculture-266-cycle"],
    disposition:
      "Retain June 30 Pacific for public distribution. June 29 is the developer-seed date.",
  },
];

export const negativeFindings = [
  {
    recordId: "not-proposed:apple:macos:15.5:public-beta-4",
    version: "15.5",
    sequence: 4,
    appearanceDate: "2025-04-28",
    classification: "disprovedIdentity",
    reason:
      "The April 28 public appearance is explicitly identified as Public Beta 3 by the installer observation and build history. Public Beta 4 is a shifted label in one living table and must not be inferred from Developer Beta 4.",
    sourceIds: [
      "monomaniac-155-pb3",
      "iculture-155-cycle",
    ],
    reversalEvidence:
      "Two independent retained sources explicitly showing an additional macOS 15.5 appearance displayed as Public Beta 4.",
  },
  {
    recordId: "not-proposed:apple:macos:15.6:public-beta-1",
    version: "15.6",
    sequence: 1,
    appearanceDate: null,
    classification: "publicDistributionNotEstablished",
    reason:
      "The retained chronology establishes only a macOS 15.6 Public Beta 3 appearance. Public Beta 1 is not created from Developer Beta 1 or an assumed contiguous sequence.",
    sourceIds: ["mr-156-pb3", "iclarified-156-pb3", "iculture-156-cycle"],
    reversalEvidence:
      "Contemporary evidence explicitly naming a macOS 15.6 Public Beta 1 distribution and its Pacific appearance date.",
  },
  {
    recordId: "not-proposed:apple:macos:15.6:public-beta-2",
    version: "15.6",
    sequence: 2,
    appearanceDate: null,
    classification: "publicDistributionNotEstablished",
    reason:
      "The retained chronology establishes only a macOS 15.6 Public Beta 3 appearance. Public Beta 2 is not created from Developer Beta 2 or an assumed contiguous sequence.",
    sourceIds: ["mr-156-pb3", "iclarified-156-pb3", "iculture-156-cycle"],
    reversalEvidence:
      "Contemporary evidence explicitly naming a macOS 15.6 Public Beta 2 distribution and its Pacific appearance date.",
  },
  {
    recordId: "not-proposed:apple:macos:26.5:public-beta-2",
    version: "26.5",
    sequence: 2,
    appearanceDate: "2026-04-14",
    classification: "disprovedIdentity",
    reason:
      "The April 14 public release article omits macOS, and platform-specific reporting says Apple skipped the macOS public seed that week. The actual Public Beta 2 appeared April 21.",
    sourceIds: [
      "mr-265-apr14-negative",
      "9to5-265-pb2",
      "mr-265-pb2",
      "iculture-265-cycle",
    ],
    reversalEvidence:
      "Contemporary evidence explicitly showing macOS Tahoe 26.5 Public Beta 2 available on April 14 Pacific.",
  },
  {
    recordId: "not-proposed:apple:macos:26.5:public-beta-4",
    version: "26.5",
    sequence: 4,
    appearanceDate: "2026-04-27",
    classification: "disprovedIdentity",
    reason:
      "The April 27 public appearance is explicitly Public Beta 3. Public Beta 4 is a shifted rolling-table label derived from the developer sequence.",
    sourceIds: [
      "9to5-265-pb3",
      "monomaniac-265-pb3",
      "iculture-265-cycle",
    ],
    reversalEvidence:
      "Two independent retained sources explicitly showing a separate macOS 26.5 appearance displayed as Public Beta 4.",
  },
];
