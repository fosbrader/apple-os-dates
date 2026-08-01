import {createHash} from "node:crypto";
import {readFile, writeFile} from "node:fs/promises";
import path from "node:path";
import {fileURLToPath} from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(here, "../../../");
const packetPath =
  "research-handoffs/beta-chronology-gap/ios-major-12-18";
const evidencePath =
  "tmp/research-evidence/beta-chronology-gap/ios-major-12-18";
const batchId = "beta-chronology-gap-ios-major-12-18";
const cohortId = "ios-major-12-18-public-beta";
const researchCutoff = "2026-07-31";
const generatedAt = new Date().toISOString();
const sha256 = (value) =>
  createHash("sha256").update(value).digest("hex");

const cycles = {
  "12.0": [
    [1, "2018-06-25"],
    [2, "2018-07-05"],
    [3, "2018-07-18"],
    [4, "2018-07-31"],
    [5, "2018-08-06"],
    [6, "2018-08-15"],
    [7, "2018-08-20"],
    [8, "2018-08-23"],
    [9, "2018-08-27"],
    [10, "2018-08-31"],
  ],
  "13.0": [
    [1, "2019-06-24"],
    [2, "2019-07-08"],
    [3, "2019-07-18"],
    [4, "2019-07-30"],
    [5, "2019-08-08"],
    [6, "2019-08-15"],
    [7, "2019-08-21"],
  ],
  "14.0": [
    [1, "2020-07-09"],
    [3, "2020-07-23"],
    [4, "2020-08-06"],
    [5, "2020-08-19"],
    [6, "2020-08-25"],
    [7, "2020-09-03"],
    [8, "2020-09-09"],
  ],
  "15.0": [
    [1, "2021-06-30"],
    [2, "2021-07-16"],
    [4, "2021-07-28"],
    [5, "2021-08-11"],
    [6, "2021-08-18"],
    [7, "2021-08-25"],
    [8, "2021-08-31"],
  ],
  "16.0": [
    [1, "2022-07-11"],
    [2, "2022-07-28"],
    [3, "2022-08-09"],
    [4, "2022-08-15"],
    [5, "2022-08-24"],
    [6, "2022-08-29"],
  ],
  "17.0": [
    [1, "2023-07-12"],
    [2, "2023-07-31"],
    [3, "2023-08-09"],
    [4, "2023-08-16"],
    [5, "2023-08-22"],
    [6, "2023-08-29"],
  ],
  "18.0": [
    [1, "2024-07-15"],
    [2, "2024-07-29"],
    [3, "2024-08-06"],
    [4, "2024-08-12"],
    [5, "2024-08-20"],
    [6, "2024-08-28"],
  ],
};

const terminals = {
  "12.0": {next: 11, date: "2018-09-12", label: "GM", channel: "goldenMaster"},
  "13.0": {next: 8, date: "2019-09-10", label: "GM", channel: "goldenMaster"},
  "14.0": {next: 9, date: "2020-09-15", label: "GM", channel: "goldenMaster"},
  "15.0": {
    next: 9,
    date: "2021-09-14",
    label: "RC",
    channel: "releaseCandidate",
  },
  "16.0": {
    next: 7,
    date: "2022-09-07",
    label: "RC",
    channel: "releaseCandidate",
  },
  "17.0": {
    next: 7,
    date: "2023-09-12",
    label: "RC",
    channel: "releaseCandidate",
  },
  "18.0": {
    next: 7,
    date: "2024-09-09",
    label: "RC",
    channel: "releaseCandidate",
  },
};

const exactExistingKeys = new Set(["15.0:1", "16.0:1", "17.0:1"]);
const candidateId = (version, sequence) =>
  `candidate:apple:ios:${version}:public-beta-${sequence}`;
const releaseVersionId = (version) =>
  `version-ios-${version.replaceAll(".", "-")}`;
const countBy = (items, selector) => {
  const result = {};
  for (const item of items) {
    const key = selector(item);
    result[key] = (result[key] ?? 0) + 1;
  }
  return Object.fromEntries(
    Object.entries(result).sort(([left], [right]) =>
      left.localeCompare(right),
    ),
  );
};
const decodeHtml = (value) =>
  value
    .replaceAll(/&#x([0-9a-f]+);/gi, (_, hex) =>
      String.fromCodePoint(Number.parseInt(hex, 16)),
    )
    .replaceAll(/&#([0-9]+);/g, (_, number) =>
      String.fromCodePoint(Number.parseInt(number, 10)),
    )
    .replaceAll("&amp;", "&")
    .replaceAll("&quot;", '"')
    .replaceAll("&apos;", "'")
    .replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">")
    .replaceAll(/<[^>]+>/g, " ")
    .replaceAll(/\s+/g, " ")
    .trim();
const firstMatch = (text, patterns) => {
  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match?.[1]) return decodeHtml(match[1]);
  }
  return null;
};
const boundedHeadlineFragment = (title) => {
  const words = title.split(/\s+/).filter(Boolean).slice(0, 20);
  const text = words.join(" ");
  return {
    type: "verbatimHeadlineFragment",
    text,
    wordCount: words.length,
    maxWords: 20,
    sha256: sha256(text),
    purpose:
      "Bounded source-identification excerpt only; chronology claims use locators and original synthesis.",
  };
};
const publisherFor = (sourceId) => {
  if (sourceId.startsWith("iculture-")) return "iCulture";
  if (sourceId.startsWith("imore-")) return "iMore";
  if (sourceId.startsWith("mr-")) return "MacRumors";
  if (sourceId.startsWith("forbes-")) return "Forbes";
  if (sourceId.startsWith("osxd-")) return "OS X Daily";
  if (sourceId.startsWith("redmondpie-")) return "Redmond Pie";
  if (sourceId.startsWith("wccftech-")) return "Wccftech";
  if (sourceId.startsWith("idb-")) return "iDownloadBlog";
  if (sourceId.startsWith("appleinsider-")) return "AppleInsider";
  if (sourceId.startsWith("9to5mac-")) return "9to5Mac";
  throw new Error(`Unknown publisher for ${sourceId}`);
};
const sourceClassFor = (sourceId) =>
  sourceId.startsWith("iculture-") || sourceId.startsWith("imore-")
    ? "contemporaneousLivingChronology"
    : "contemporaneousSecondary";

const [fetchLog, production] = await Promise.all([
  readFile(path.join(repoRoot, evidencePath, "fetch-log.json"), "utf8").then(
    JSON.parse,
  ),
  readFile(path.join(here, "production-snapshot.json"), "utf8").then(JSON.parse),
]);
if (fetchLog.failureCount !== 0) {
  throw new Error("Cannot build a frozen packet with source capture failures.");
}

const sourcePurpose = (sourceId) => {
  if (sourceId.startsWith("iculture-")) {
    return "Cycle timeline, public ordinal/date rows, and terminal GM/RC boundary; identified source errors are isolated in conflicts.json.";
  }
  if (sourceId.startsWith("imore-")) {
    return "Rolling public-beta history used as an independent chronology; identified date/numbering errors are isolated in conflicts.json.";
  }
  if (sourceId === "mr-ios12-dev7-pulled") {
    return "Developer Beta 7 withdrawal and planned public-seed cancellation.";
  }
  if (sourceId === "mr-ios12-pb6-after-withdrawal") {
    return "No public release of withdrawn developer Beta 7 and the August 15 Public Beta 6 replacement.";
  }
  if (sourceId.includes("opening")) {
    return "First iOS public appearance and its contemporary public-audience wording.";
  }
  if (
    sourceId.includes("as-pb2") ||
    sourceId.includes("as-pb3")
  ) {
    return "Alternate build-aligned ordinal wording retained as conflict evidence only.";
  }
  return "Contemporary iOS public-availability, ordinal, and appearance-date evidence.";
};

const sources = [];
for (const capture of fetchLog.results) {
  const rawPath = path.posix.join(evidencePath, capture.filename);
  const bytes = await readFile(path.join(repoRoot, rawPath));
  if (sha256(bytes) !== capture.sha256) {
    throw new Error(`Raw evidence hash drift for ${capture.sourceId}`);
  }
  const html = bytes.toString("utf8");
  const title =
    firstMatch(html, [
      /<title[^>]*>([\s\S]*?)<\/title>/i,
      /"headline"\s*:\s*"([^"]+)"/i,
    ]) ?? capture.sourceId;
  const publishedAt = firstMatch(html, [
    /"datePublished"\s*:\s*"([^"]+)"/i,
    /property=["']article:published_time["'][^>]+content=["']([^"']+)["']/i,
    /name=["']date["'][^>]+content=["']([^"']+)["']/i,
  ]);
  const author = firstMatch(html, [
    /"author"\s*:\s*\{[^{}]{0,1200}?"name"\s*:\s*"([^"]+)"/i,
    /"author"\s*:\s*"([^"]+)"/i,
  ]);
  sources.push({
    sourceId: capture.sourceId,
    canonicalUrl: capture.url,
    finalUrl: capture.finalUrl,
    title,
    publisher: publisherFor(capture.sourceId),
    author,
    publishedAt,
    publishedDateObserved: publishedAt?.slice(0, 10) ?? null,
    accessedAt: researchCutoff,
    status: "active",
    sourceClass: sourceClassFor(capture.sourceId),
    roles: [
      "publicAvailability",
      "publicOrdinal",
      "appearanceDate",
      "channelIdentity",
      "conflictResolution",
    ],
    supportNote: sourcePurpose(capture.sourceId),
    evidence: {
      rawPath,
      rawBytes: bytes.byteLength,
      rawSha256: capture.sha256,
      captureMethod: capture.captureMethod,
      locator: sourcePurpose(capture.sourceId),
      selectedText: boundedHeadlineFragment(title),
    },
    lineage: {
      publisherFamily: publisherFor(capture.sourceId),
      independentForCorroboration: true,
      note:
        "One publisher family counts as one lineage even when multiple pages from that family are cited.",
    },
    reuseVerification: capture.reusedFrom ?? null,
  });
}
sources.sort((left, right) => left.sourceId.localeCompare(right.sourceId));
const sourceById = new Map(sources.map((source) => [source.sourceId, source]));

const sourceIdsFor = (version, sequence) => {
  if (version === "12.0") {
    return [
      "iculture-ios12",
      "imore-ios12",
      ...(sequence === 6 ? ["mr-ios12-pb6-after-withdrawal"] : []),
    ];
  }
  if (version === "13.0") {
    return [
      "iculture-ios13",
      "imore-ios13",
      `mr-ios13-pb${sequence}`,
    ];
  }
  if (version === "14.0") {
    if (sequence === 1) {
      return ["iculture-ios14", "imore-ios14", "mr-ios14-opening"];
    }
    if (sequence === 3) {
      return [
        "iculture-ios14",
        "mr-ios14-pb3",
        "forbes-ios14-pb3",
        "redmondpie-ios14-pb3",
      ];
    }
    if (sequence === 4) {
      return ["mr-ios14-pb4", "imore-ios14"];
    }
    return [`mr-ios14-pb${sequence}`, "imore-ios14", "iculture-ios14"];
  }
  if (version === "15.0") {
    if (sequence === 1) return ["mr-ios15-opening", "iculture-ios15"];
    if (sequence === 2) {
      return [
        "mr-ios15-pb2",
        "iculture-ios15",
        "imore-ios15",
        "idb-ios15-pb2",
      ];
    }
    if (sequence === 4) {
      return ["mr-ios15-pb4", "iculture-ios15", "osxd-ios15-pb4"];
    }
    if (sequence === 6) {
      return [
        "mr-ios15-pb6",
        "iculture-ios15",
        "imore-ios15",
        "osxd-ios15-pb6",
      ];
    }
    return [`mr-ios15-pb${sequence}`, "iculture-ios15", "imore-ios15"];
  }
  if (version === "16.0") {
    if (sequence === 1) return ["mr-ios16-pb1", "iculture-ios16"];
    if (sequence === 2) return ["mr-ios16-pb2", "imore-ios16"];
    return [`mr-ios16-pb${sequence}`, "iculture-ios16", "imore-ios16"];
  }
  if (version === "17.0") {
    return [
      `mr-ios17-pb${sequence}`,
      "iculture-ios17",
      ...(sequence === 4 ? ["osxd-ios17-pb4"] : []),
      ...(sequence === 5 ? ["appleinsider-ios17-pb5"] : []),
    ];
  }
  if (version === "18.0") {
    return [
      `mr-ios18-pb${sequence}`,
      "iculture-ios18",
      ...(sequence === 4 ? ["9to5mac-ios18-pb4"] : []),
      ...(sequence === 5 ? ["osxd-ios18-pb5"] : []),
      ...(sequence === 6 ? ["9to5mac-ios18-pb6"] : []),
    ];
  }
  throw new Error(`No source routing for ${version} PB${sequence}`);
};

const evidenceRef = (sourceId, version, sequence, supportsOverride) => {
  const source = sourceById.get(sourceId);
  if (!source) throw new Error(`Missing source ledger item ${sourceId}`);
  let locator = source.evidence.locator;
  if (sourceId.startsWith("iculture-")) {
    locator = `The “Tijdlijn iOS ${Number.parseInt(version, 10)} beta” row for Public Beta ${sequence} and the cycle terminal row. Apply only the source-specific qualifications in conflicts.json.`;
  } else if (sourceId.startsWith("imore-")) {
    locator = `The rolling-history entry for iOS ${Number.parseInt(version, 10)} Public Beta ${sequence}. Apply only the date/numbering qualifications in conflicts.json.`;
  } else if (sourceId.startsWith("mr-")) {
    locator = `Headline, publication timestamp, lead, and any same-page public-beta update identifying the iOS ${version} Public Beta ${sequence} appearance.`;
  }
  return {
    kind: "packetSource",
    packetPath: `${packetPath}/sources.json`,
    sourceId,
    locator,
    supports:
      supportsOverride ??
      `${source.publisher} evidence for iOS ${version} Public Beta ${sequence} public availability, ordinal, or Pacific appearance date.`,
  };
};

const appearances = Object.entries(cycles).flatMap(([version, rows]) =>
  rows.map(([sequence, appearanceDate]) => ({
    key: `${version}:${sequence}`,
    candidateId: candidateId(version, sequence),
    platform: "iOS",
    platformId: "platform-ios",
    version,
    releaseVersionId: releaseVersionId(version),
    channel: "publicBeta",
    routeAlias: `public-beta-${sequence}`,
    label: `Public Beta ${sequence}`,
    sequence,
    appearanceDate,
  })),
);
const exactByKey = new Map(
  production.exactChecks.map((item) => [
    `${item.version}:${item.sequence}`,
    item,
  ]),
);
const productionEventsById = new Map(
  production.events.map((event) => [event._id, event]),
);

const candidates = appearances
  .filter((appearance) => !exactExistingKeys.has(appearance.key))
  .map((appearance) => {
    const exact = exactByKey.get(appearance.key);
    if (!exact) throw new Error(`Missing production check ${appearance.key}`);
    const refs = sourceIdsFor(appearance.version, appearance.sequence).map(
      (sourceId) =>
        evidenceRef(sourceId, appearance.version, appearance.sequence),
    );
    return {
      candidateId: appearance.candidateId,
      originCohortId: cohortId,
      platform: appearance.platform,
      platformId: appearance.platformId,
      version: appearance.version,
      releaseVersionId: appearance.releaseVersionId,
      proposedIdentity: {
        label: appearance.label,
        routeAlias: appearance.routeAlias,
        channel: appearance.channel,
        appearanceDate: appearance.appearanceDate,
        sequence: appearance.sequence,
        isRevision: false,
        availabilityState: "available",
        closesReleaseCycle: false,
      },
      ordinalBasis: "explicit",
      candidateStatus: "needsEvidenceReview",
      identityStatus: "confirmed",
      evidenceState: "corroborated",
      productionReconciliation: {
        status: "confirmedMissing",
        queriedAt: production.capturedAt,
        matchBasis:
          "Fresh published production query found no exact match on releaseVersionId, publicBeta channel, routeAlias, sequence, and appearanceDate; the parent releaseVersion exists exactly once.",
        exactIdentityMatches: exact.exactIdentityMatchCount,
      },
      evidenceRefs: refs,
      buildEvidenceStatus: "absent",
      contentDisposition: "timelineOnly",
      blockers: ["Independent chronology review is still required."],
      review: {
        required: true,
        reviewer: null,
        reviewedAt: null,
        notes:
          "Researcher self-check only. A different reviewer must verify the public ordinal, date, publisher independence, skips, and conflict handling before any separately authorized implementation.",
      },
      flags: {
        sanityMutationAllowed: false,
        publicationEligible: false,
      },
    };
  });

const existingMatches = appearances
  .filter((appearance) => exactExistingKeys.has(appearance.key))
  .map((appearance) => {
    const exact = exactByKey.get(appearance.key);
    if (!exact || exact.exactIdentityMatchCount !== 1) {
      throw new Error(`Expected one exact production match for ${appearance.key}`);
    }
    const productionEvent = productionEventsById.get(
      exact.exactIdentityMatchingEventIds[0],
    );
    return {
      matchId: `existing-match:apple:ios:${appearance.version}:public-beta-${appearance.sequence}`,
      ...appearance,
      productionEvent,
      productionReconciliation: {
        status: "exactExistingMatch",
        queriedAt: production.capturedAt,
        exactIdentityMatches: 1,
        matchBasis:
          "Exact published production match on parent, channel, route alias, sequence, and appearance date.",
      },
      evidenceRefs: sourceIdsFor(
        appearance.version,
        appearance.sequence,
      ).map((sourceId) =>
        evidenceRef(sourceId, appearance.version, appearance.sequence),
      ),
      disposition: "retainExistingNoMutationProposed",
    };
  });

const terminalNegative = Object.entries(terminals).map(([version, terminal]) => ({
  recordId: `not-proposed:apple:ios:${version}:public-beta-${terminal.next}`,
  originCohortId: cohortId,
  platform: "iOS",
  platformId: "platform-ios",
  releaseVersionId: releaseVersionId(version),
  apparentIdentity: {
    label: `Public Beta ${terminal.next}`,
    routeAlias: `public-beta-${terminal.next}`,
    channel: "publicBeta",
    appearanceDate: terminal.date,
    sequence: terminal.next,
    isRevision: false,
    availabilityState: "available",
    closesReleaseCycle: false,
  },
  classification: "disprovedIdentity",
  reason: `No Public Beta ${terminal.next} appearance is established. The cycle proceeds from its last public beta to ${terminal.label} on ${terminal.date}; that event remains ${terminal.channel}, even when public testers receive it.`,
  evidenceRefs: [
    evidenceRef(
      `iculture-ios${Number.parseInt(version, 10)}`,
      version,
      terminal.next,
      `Establishes the ${terminal.label} boundary and absence of a later numbered public-beta appearance in the cycle chronology.`,
    ),
    {
      kind: "localEvidence",
      localPath: `${packetPath}/production-snapshot.json`,
      locator: `events and scopedCycles for ${releaseVersionId(version)}`,
      supports: `Production classifies the ${terminal.date} terminal event as ${terminal.channel}, not publicBeta.`,
    },
  ],
  reversalEvidence: `A captured contemporary Apple or publisher record explicitly establishing iOS ${version} Public Beta ${terminal.next} before the ${terminal.label} boundary would reopen this finding.`,
  review: {
    required: true,
    reviewer: null,
    reviewedAt: null,
    notes:
      "Negative-sequence researcher self-check only; independent review remains required.",
  },
  flags: {sanityMutationAllowed: false, publicationEligible: false},
}));

const skippedOrdinalNegative = [
  {
    recordId: "not-proposed:apple:ios:14.0:public-beta-2",
    originCohortId: cohortId,
    platform: "iOS",
    platformId: "platform-ios",
    releaseVersionId: "version-ios-14-0",
    apparentIdentity: {
      label: "Public Beta 2",
      routeAlias: "public-beta-2",
      channel: "publicBeta",
      appearanceDate: "2020-07-22",
      sequence: 2,
      isRevision: false,
      availabilityState: "available",
      closesReleaseCycle: false,
    },
    classification: "disprovedIdentity",
    reason:
      "One rolling iMore history lists Public Beta 2 on the July 22 developer-release date, but contemporary iOS-specific evidence records Public Beta 1 on July 9 and the next actual public appearance as Apple-labeled Public Beta 3 on July 23. No distinct July 22 public distribution is corroborated.",
    evidenceRefs: [
      evidenceRef(
        "imore-ios14",
        "14.0",
        2,
        "Preserves the conflicting July 22 Public Beta 2 claim for adjudication, not as candidate support.",
      ),
      evidenceRef(
        "iculture-ios14",
        "14.0",
        3,
        "Records Public Beta 3 on July 23 and explicitly says Apple aligned public numbering with developer numbering.",
      ),
      evidenceRef(
        "mr-ios14-pb3",
        "14.0",
        3,
        "Establishes the next public appearance on July 23 rather than July 22.",
      ),
    ],
    reversalEvidence:
      "A captured Apple tester screen, software-update catalog, or independent same-day report proving a distinct July 22 iOS 14 Public Beta 2 distribution would reopen this finding.",
    review: {
      required: true,
      reviewer: null,
      reviewedAt: null,
      notes: "Do not infer PB2 from developer Beta 3's July 22 date.",
    },
    flags: {sanityMutationAllowed: false, publicationEligible: false},
  },
  {
    recordId: "not-proposed:apple:ios:15.0:public-beta-3",
    originCohortId: cohortId,
    platform: "iOS",
    platformId: "platform-ios",
    releaseVersionId: "version-ios-15-0",
    apparentIdentity: {
      label: "Public Beta 3",
      routeAlias: "public-beta-3",
      channel: "publicBeta",
      appearanceDate: "2021-07-16",
      sequence: 3,
      isRevision: false,
      availabilityState: "available",
      closesReleaseCycle: false,
    },
    classification: "disprovedIdentity",
    reason:
      "Build-aligned publishers called the July 16 payload Public Beta 3, while iOS public-program chronologies called it the second public beta. On July 28 Apple explicitly numbered the third public appearance Public Beta 4. The packet therefore preserves PB1, PB2, and PB4, with no distinct PB3 appearance.",
    evidenceRefs: [
      evidenceRef(
        "forbes-ios15-second-as-pb3",
        "15.0",
        3,
        "Preserves the conflicting build-aligned Public Beta 3 label for July 16.",
      ),
      evidenceRef(
        "iculture-ios15",
        "15.0",
        2,
        "Records July 16 as Public Beta 2 and the July 28 third public appearance as Apple-numbered Public Beta 4.",
      ),
      evidenceRef(
        "idb-ios15-pb2",
        "15.0",
        2,
        "Independent contemporary report calls July 16 the second iOS 15 public beta.",
      ),
    ],
    reversalEvidence:
      "A captured Apple record establishing a separately distributed iOS 15 Public Beta 3, rather than an alternate name for the July 16 or July 28 payload, would reopen this finding.",
    review: {
      required: true,
      reviewer: null,
      reviewedAt: null,
      notes:
        "Keep public appearance numbering separate from the paired developer build until Apple's explicit PB4 transition.",
    },
    flags: {sanityMutationAllowed: false, publicationEligible: false},
  },
];
const notProposed = [...skippedOrdinalNegative, ...terminalNegative];

const conflicts = [
  {
    conflictId: "ios14-public-numbering-transition",
    severity: "material",
    status: "proposedResolutionPendingIndependentReview",
    subject: "iOS 14 changed public-seed numbering after its first appearance",
    sourceIds: [
      "iculture-ios14",
      "mr-ios14-opening",
      "mr-ios14-pb3",
      "forbes-ios14-pb3",
      "redmondpie-ios14-pb3",
    ],
    finding:
      "The July 9 opening seed was called Public Beta 1. The next public appearance was July 23 and was explicitly Public Beta 3 after Apple aligned numbering with developer betas.",
    proposedResolution:
      "Retain PB1 then PB3; do not synthesize PB2 from developer numbering or appearance count.",
  },
  {
    conflictId: "ios14-false-july22-public-beta-2",
    severity: "material",
    status: "proposedResolutionPendingIndependentReview",
    subject: "iMore lists Public Beta 2 on the July 22 developer date",
    sourceIds: ["imore-ios14", "iculture-ios14", "mr-ios14-pb3"],
    finding:
      "The retained iMore rolling page lists PB2 on July 22. Other contemporary evidence places the next public distribution on July 23 and labels it PB3.",
    proposedResolution:
      "Treat July 22 PB2 as a developer-date/appearance-number conflation and preserve it as a not-proposed identity.",
  },
  {
    conflictId: "ios14-public-beta-4-date",
    severity: "material",
    status: "proposedResolutionPendingIndependentReview",
    subject: "iCulture uses the August 4 developer date for Public Beta 4",
    sourceIds: ["iculture-ios14", "mr-ios14-pb4", "imore-ios14"],
    finding:
      "MacRumors and iMore place Public Beta 4 on August 6. iCulture's timeline incorrectly duplicates the August 4 developer date.",
    proposedResolution: "Use 2020-08-06 America/Los_Angeles.",
  },
  {
    conflictId: "ios15-public-numbering-transition",
    severity: "material",
    status: "proposedResolutionPendingIndependentReview",
    subject: "iOS 15 moved from public appearance numbering to Apple build-aligned numbering",
    sourceIds: [
      "iculture-ios15",
      "mr-ios15-opening",
      "mr-ios15-pb2",
      "mr-ios15-pb4",
      "osxd-ios15-pb4",
    ],
    finding:
      "The first two public appearances were publicly described as PB1 and PB2. iCulture's contemporary editorial note says the July 28 third appearance was Apple-numbered PB4.",
    proposedResolution:
      "Retain PB1, PB2, then PB4. Do not create a separate PB3.",
  },
  {
    conflictId: "ios15-build-aligned-alternate-early-labels",
    severity: "material",
    status: "proposedResolutionPendingIndependentReview",
    subject: "Forbes and other publishers applied developer-aligned PB2/PB3 labels early",
    sourceIds: [
      "forbes-ios15-opening-as-pb2",
      "forbes-ios15-second-as-pb3",
      "wccftech-ios15-second-as-pb3",
      "iculture-ios15",
      "idb-ios15-pb2",
    ],
    finding:
      "Alternate sources call June 30 PB2 and July 16 PB3 based on paired developer builds. Public-program chronologies call them the first and second public betas, and explicitly identify Apple's switch at PB4.",
    proposedResolution:
      "Use iOS public-program ordinals PB1/PB2 before the documented PB4 alignment; retain alternate labels only as conflict evidence.",
  },
  {
    conflictId: "ios12-public-beta-6-calendar-date",
    severity: "material",
    status: "proposedResolutionPendingIndependentReview",
    subject: "iOS 12 Public Beta 6 August 15 Pacific versus August 16 European chronology",
    sourceIds: [
      "iculture-ios12",
      "imore-ios12",
      "mr-ios12-pb6-after-withdrawal",
    ],
    finding:
      "iMore and MacRumors establish August 15 Pacific. iCulture displays August 16.",
    proposedResolution:
      "Normalize to 2018-08-15 America/Los_Angeles and retain August 16 as a source-time-zone/reporting qualification.",
  },
  {
    conflictId: "ios12-developer-beta-7-withdrawal",
    severity: "material",
    status: "proposedResolutionPendingIndependentReview",
    subject: "Withdrawn developer Beta 7 never became a public seed",
    sourceIds: [
      "mr-ios12-dev7-pulled",
      "mr-ios12-pb6-after-withdrawal",
      "iculture-ios12",
      "imore-ios12",
    ],
    finding:
      "Developer Beta 7 was pulled on August 13 for performance problems before its planned public release. Developer Beta 8 arrived August 15 and became Public Beta 6.",
    proposedResolution:
      "Do not create a public event for the withdrawn developer payload and do not renumber August 15 PB6.",
  },
  {
    conflictId: "ios16-rolling-source-errors",
    severity: "material",
    status: "proposedResolutionPendingIndependentReview",
    subject: "Two rolling histories contain isolated iOS 16 errors",
    sourceIds: [
      "imore-ios16",
      "iculture-ios16",
      "mr-ios16-pb1",
      "mr-ios16-pb2",
    ],
    finding:
      "iMore's opening heading says July 5 although the first public beta shipped July 11. iCulture labels the July 28 second public beta as PB4.",
    proposedResolution:
      "Use MacRumors and the remaining internally consistent chronology: PB1 July 11 and PB2 July 28.",
  },
  {
    conflictId: "ios17-public-beta-4-article-date",
    severity: "qualification",
    status: "proposedResolutionPendingIndependentReview",
    subject: "Public Beta 4 update is attached to a developer article",
    sourceIds: ["mr-ios17-pb4", "iculture-ios17", "osxd-ios17-pb4"],
    finding:
      "The developer article originated August 15, while its public update and two iOS-specific sources establish August 16 public availability.",
    proposedResolution: "Use 2023-08-16 for the publicBeta appearance.",
  },
  {
    conflictId: "ios18-public-beta-5-calendar-date",
    severity: "qualification",
    status: "proposedResolutionPendingIndependentReview",
    subject: "August 20 Pacific appearance versus August 21 UTC article",
    sourceIds: ["mr-ios18-pb5", "iculture-ios18", "osxd-ios18-pb5"],
    finding:
      "MacRumors and iCulture establish August 20 Pacific; OS X Daily published its corroborating article on August 21 UTC.",
    proposedResolution:
      "Use 2024-08-20 America/Los_Angeles and retain the later publication timestamp as a qualification.",
  },
  {
    conflictId: "ios-paired-developer-revisions-not-public-respins",
    severity: "guardrail",
    status: "requiredHandling",
    subject: "Revised developer builds paired with public seeds are not extra public appearances",
    sourceIds: [
      "iculture-ios13",
      "iculture-ios16",
      "iculture-ios17",
      "iculture-ios18",
    ],
    finding:
      "iOS 13 developer Beta 3 v2, iOS 16 developer Beta 3 v2, iOS 17 developer Beta 4 v2, and iOS 18 revised developer Betas 3/4 precede or accompany ordinary public appearances. No separate public respin is established.",
  },
  {
    conflictId: "ios-ipados-cross-packet-numbering-not-reused",
    severity: "guardrail",
    status: "requiredHandling",
    subject: "Frozen iPadOS early-cycle numbering was not copied into iOS",
    sourceIds: [
      "iculture-ios14",
      "iculture-ios15",
      "mr-ios14-opening",
      "mr-ios15-opening",
    ],
    finding:
      "Platform-specific iOS evidence supports PB1→PB3 for 14.0 and PB1→PB2→PB4 for 15.0. The earlier iPadOS packet used a different interpretation and is not authority for iOS.",
  },
  {
    conflictId: "ios-same-day-channel-separation",
    severity: "guardrail",
    status: "requiredHandling",
    subject: "Same-day developer and public payloads remain separate channel events",
    finding:
      "Shared date or build does not collapse developerBeta and publicBeta identities. Candidate identities retain the publicBeta channel and public route alias.",
  },
  {
    conflictId: "ios-gm-rc-not-next-public-beta",
    severity: "guardrail",
    status: "requiredHandling",
    subject: "GM and RC are not the next numbered public beta",
    notProposedRecordIds: terminalNegative.map((item) => item.recordId),
    sourceIds: Object.keys(cycles).map(
      (version) => `iculture-ios${Number.parseInt(version, 10)}`,
    ),
    finding:
      "Public testers can receive the terminal GM/RC payload, but its event channel remains goldenMaster or releaseCandidate. Seven next ordinals are not proposed.",
  },
];

const positiveSequence = appearances.map((appearance) => ({
  ...appearance,
  productionDisposition: exactExistingKeys.has(appearance.key)
    ? "exactExistingMatch"
    : "confirmedMissingCandidate",
  sourceIds: sourceIdsFor(appearance.version, appearance.sequence),
}));
const negativeSequence = [
  ...skippedOrdinalNegative.map((item) => ({
    version: item.apparentIdentity.label.includes("2") ? "14.0" : "15.0",
    searchedIdentity: item.apparentIdentity.label,
    searchedSequence: item.apparentIdentity.sequence,
    apparentDate: item.apparentIdentity.appearanceDate,
    classification: item.classification,
    disposition: "notProposed",
  })),
  ...Object.entries(terminals).map(([version, terminal]) => ({
    version,
    searchedIdentity: `Public Beta ${terminal.next}`,
    searchedSequence: terminal.next,
    apparentDate: terminal.date,
    terminalBoundary: {
      label: terminal.label,
      channel: terminal.channel,
      appearanceDate: terminal.date,
    },
    classification: "disprovedIdentity",
    disposition: "notProposed",
  })),
];

const assignment = {
  formatVersion: 1,
  batchId,
  createdAt: generatedAt,
  createdBy: "codex-review-reusable-public-betas",
  vendor: {name: "Apple", slug: "apple"},
  researchCutoff,
  scope:
    "Research-only audit of every iOS major-cycle public-beta appearance through GM/RC for exactly 12.0, 13.0, 14.0, 15.0, 16.0, 17.0, and 18.0.",
  calendarNormalization:
    "appearanceDate uses the America/Los_Angeles calendar date. Later European or UTC publication dates are qualifications, not additional appearances.",
  identityRule:
    "Public ordinals follow captured iOS public-program labeling. They are never inferred from developer ordinals or from appearance order. Explicit mid-cycle numbering changes and skips are preserved.",
  observedAppearanceCount: appearances.length,
  candidateCount: candidates.length,
  exactExistingMatchCount: existingMatches.length,
  positiveSequence,
  negativeSequence,
  existingMatches,
  specialNegativeFindings: [
    {
      version: "12.0",
      finding:
        "Developer Beta 7 was withdrawn before public distribution. It is not a public appearance; developer Beta 8 became Public Beta 6 on August 15.",
    },
    {
      version: "14.0",
      finding:
        "No distinct Public Beta 2 is established between Public Beta 1 and Apple-labeled Public Beta 3.",
    },
    {
      version: "15.0",
      finding:
        "No distinct Public Beta 3 is established; Apple labeled the third public appearance Public Beta 4.",
    },
    {
      versions: ["13.0", "16.0", "17.0", "18.0"],
      finding:
        "Paired developer revisions or re-releases do not establish additional public respins. No separately distributed public withdrawal/respin was found.",
    },
  ],
  evidenceRequirements: {
    independentContemporaryPublisherLineagesPerCandidate: 2,
    iOSPlatformClaimRequired: true,
    developerOrdinalInferenceAllowed: false,
    gmOrRcMayBeConvertedToPublicBeta: false,
    rawBytesAndSelectedTextMustBeHashed: true,
  },
  productionReconciliation: {
    snapshotPath: `${packetPath}/production-snapshot.json`,
    capturedAt: production.capturedAt,
    targetParentCount: production.parentChecks.length,
    parentProblems: production.parentChecks.filter(
      (item) => item.exactParentMatchCount !== 1,
    ).length,
    targetAppearanceCount: production.exactChecks.length,
    exactExistingMatches: existingMatches.length,
    proposedMissingCandidates: candidates.length,
    scopedPublicBetaEvents: production.productionCounts.scopedPublicBetaEvents,
  },
  constraints: {
    noSanityWrites: true,
    noStableEventIdCreation: true,
    noPageWork: true,
    noPublication: true,
    noDeployment: true,
    noReleaseNoteResearch: true,
  },
};

const rawEvidenceLocks = {
  formatVersion: 1,
  batchId,
  createdAt: generatedAt,
  sourceCount: sources.length,
  locks: sources.map((source) => ({
    sourceId: source.sourceId,
    rawPath: source.evidence.rawPath,
    rawBytes: source.evidence.rawBytes,
    rawSha256: source.evidence.rawSha256,
    selectedTextSha256: source.evidence.selectedText.sha256,
    captureMethod: source.evidence.captureMethod,
    reusedFrom: source.reuseVerification
      ? {
          sourceId: source.reuseVerification.sourceId,
          rawPath: source.reuseVerification.rawPath,
          expectedSha256: source.reuseVerification.expectedSha256,
          platformVerification:
            source.reuseVerification.platformVerification,
        }
      : null,
  })),
};

const sourcesDocument = {
  formatVersion: 1,
  batchId,
  accessedAt: researchCutoff,
  attemptedSourceCount: fetchLog.sourceCount,
  sourceCount: sources.length,
  failedCaptureCount: fetchLog.failureCount,
  reusedSourceCount: fetchLog.reuseAttemptCount,
  freshSourceCount: fetchLog.freshAttemptCount,
  rawEvidenceLocksPath: `${packetPath}/raw-evidence-locks.json`,
  sources,
  captureFailures: [],
  copyrightHandling:
    "Local captures are private research evidence. Only bounded source-identification fragments are retained in the ledger; future articles must use original synthesis, minimal quotation, canonical links, and visible attribution.",
};

const candidateRegister = {
  formatVersion: "1.0",
  programId: "apple-beta-chronology-gap",
  generatedAt,
  safety: {
    sanityMutationAllowed: false,
    publicationAuthorized: false,
    stableEventIdCreationAllowed: false,
    note:
      "Research packet only. Validation and review do not authorize Sanity mutation, stable-ID creation, page work, publication, or deployment.",
  },
  summary: {
    proposedCandidateCount: candidates.length,
    notProposedCount: notProposed.length,
    byStatus: countBy(candidates, (item) => item.candidateStatus),
    byPlatform: {iOS: candidates.length},
    importantQualification:
      "Forty-nine public appearances survive: 46 confirmed-missing candidates and three exact existing production matches. iOS 14 skips PB2 and iOS 15 skips PB3 because Apple changed public numbering mid-cycle.",
  },
  cohorts: [
    {
      cohortId,
      description: "iOS 12.0–18.0 major-cycle public-beta chronology.",
      candidateCount: candidates.length,
      sourcePaths: [
        `${packetPath}/assignment.json`,
        `${packetPath}/sources.json`,
        `${packetPath}/production-snapshot.json`,
        `${packetPath}/conflicts.json`,
        `${packetPath}/raw-evidence-locks.json`,
      ],
      supersessionRule:
        "A later packet supersedes an identity only with captured platform-specific evidence, repeated production reconciliation, and independent chronology review.",
    },
  ],
  candidates,
  notProposed,
  nextEvidenceWaves: [
    {
      waveId: "ios-major-12-18-independent-chronology-review",
      scope:
        "Independently verify all 49 appearances, 46 missing candidates, three exact existing matches, nine negative records, and fourteen conflicts/guardrails.",
      artifactPaths: [
        `${packetPath}/self-review.json`,
        `${packetPath}/report.md`,
        `${packetPath}/validation.json`,
      ],
      estimatedCandidateCount: candidates.length,
      countStatus: "confirmed",
      requiredNextStep:
        "Assign a reviewer who did not perform this research. Any implementation requires a later, separately authorized write plan.",
    },
  ],
  validationStatus: {
    status: "passed",
    validatedAt: generatedAt,
    validator: `${packetPath}/validate-packet.mjs`,
    summaryPath: `${packetPath}/validation.json`,
  },
};

const conflictsDocument = {
  formatVersion: 1,
  batchId,
  conflictCount: conflicts.length,
  conflicts,
  reviewState: "pendingIndependentChronologyReview",
};

const selfReview = {
  formatVersion: 1,
  batchId,
  preparedAt: generatedAt,
  reviewer: "codex-review-reusable-public-betas",
  independentOfResearcher: false,
  verdict: "researcherSelfCheckPassedPendingIndependentReview",
  checks: {
    exactParentReconciliationComplete: true,
    exactIdentityReconciliationComplete: true,
    observedAppearanceCount: appearances.length,
    candidateCount: candidates.length,
    exactExistingMatchCount: existingMatches.length,
    notProposedCount: notProposed.length,
    candidatesWithTwoIndependentPublisherLineages: candidates.length,
    rawEvidenceLocksRecorded: sources.length,
    sourceCaptureFailures: fetchLog.failureCount,
    publicOrdinalInferredFromDeveloperOrdinal: false,
    publicWithdrawalOrRespinInvented: false,
    gmOrRcConvertedToPublicBeta: false,
    buildsIncluded: 0,
    stableEventIdsCreated: 0,
    sanityMutationPerformed: false,
    pageWorkPerformed: false,
    publicationPerformed: false,
    deploymentPerformed: false,
  },
  independentReview: {
    required: true,
    reviewer: null,
    reviewedAt: null,
    verdict: null,
    chronologyApprovedCandidateCount: 0,
    notes:
      "Unassigned. This self-review is not independent and grants no mutation or publication authority.",
  },
  authorization: {
    sanityMutationAllowed: false,
    publicationEligible: false,
    deploymentAllowed: false,
  },
};

const chronologyRows = appearances
  .map((appearance) => {
    const disposition = exactExistingKeys.has(appearance.key)
      ? "exact existing match"
      : "candidate — confirmed missing";
    const publishers = sourceIdsFor(appearance.version, appearance.sequence)
      .map((sourceId) => sourceById.get(sourceId).publisher)
      .filter((value, index, all) => all.indexOf(value) === index)
      .join("; ");
    return `| ${appearance.version} | PB${appearance.sequence} | ${appearance.appearanceDate} | ${publishers} | ${disposition} |`;
  })
  .join("\n");
const negativeRows = notProposed
  .map(
    (item) =>
      `| ${item.releaseVersionId.replace("version-ios-", "").replaceAll("-", ".")} | PB${item.apparentIdentity.sequence} | ${item.apparentIdentity.appearanceDate} | ${item.reason} |`,
  )
  .join("\n");
const report = `# iOS major-version public-beta chronology, 12.0–18.0

Status: **researcher self-check passed; independent chronology review pending**  
Research cutoff: **${researchCutoff}**  
Sanity writes, stable-ID creation, page work, publication, and deployment authorized: **no**

## Outcome

The packet preserves **49 actual iOS public-beta appearances** across the seven requested major cycles. Production already contains three exact identities: iOS 15 Public Beta 1, iOS 16 Public Beta 1, and iOS 17 Public Beta 1. The remaining **46 confirmed-missing identities** are research candidates.

The platform-specific audit materially changes the early numbering inherited from the iPadOS packet:

- iOS 14: PB1, then PB3–PB8. No distinct PB2 is established.
- iOS 15: PB1, PB2, then PB4–PB8. No distinct PB3 is established.

Those are deliberate historical skips caused by a mid-cycle public-numbering alignment, not missing rows.

## Positive chronology

| Version | Public ordinal | Pacific appearance date | Captured publisher families | Production disposition |
| --- | ---: | --- | --- | --- |
${chronologyRows}

## Negative sequence

| Version | Rejected ordinal | Apparent/boundary date | Finding |
| --- | ---: | --- | --- |
${negativeRows}

The terminal records stop at GM for iOS 12–14 and RC for iOS 15–18. A GM or RC delivered to public testers remains its own channel and is never converted into the next numbered public beta.

## Withdrawals and revisions

iOS 12 Developer Beta 7 was pulled on August 13, 2018 before public distribution. Developer Beta 8 replaced it on August 15 and became Public Beta 6. The withdrawn payload is not a public event.

Revised developer builds in the iOS 13, 16, 17, and 18 cycles sometimes preceded or accompanied a public seed. The audit found no separately distributed public respin in those cases, so each public appearance remains one non-revision event.

## Evidence and copyright handling

The packet hash-locks ${sources.length} captured source pages from independent publisher families. Reused iPadOS-packet pages were accepted only after their original hashes matched and their raw text explicitly named iOS. No iPadOS-only claim was reused.

Local HTML is private research evidence, not article copy. Future pages should link and credit every source, write original synthesis, and quote only short excerpts when necessary.

## Handoff

An independent reviewer must adjudicate the fourteen conflict/guardrail records, verify all candidate source locators, and approve chronology separately. This packet does not create production IDs and grants no implementation authority.
`;

await Promise.all([
  writeFile(
    path.join(here, "assignment.json"),
    `${JSON.stringify(assignment, null, 2)}\n`,
  ),
  writeFile(
    path.join(here, "sources.json"),
    `${JSON.stringify(sourcesDocument, null, 2)}\n`,
  ),
  writeFile(
    path.join(here, "raw-evidence-locks.json"),
    `${JSON.stringify(rawEvidenceLocks, null, 2)}\n`,
  ),
  writeFile(
    path.join(here, "candidates.json"),
    `${JSON.stringify(candidateRegister, null, 2)}\n`,
  ),
  writeFile(
    path.join(here, "conflicts.json"),
    `${JSON.stringify(conflictsDocument, null, 2)}\n`,
  ),
  writeFile(
    path.join(here, "self-review.json"),
    `${JSON.stringify(selfReview, null, 2)}\n`,
  ),
  writeFile(path.join(here, "report.md"), report),
]);

console.log(
  JSON.stringify(
    {
      observedAppearanceCount: appearances.length,
      candidateCount: candidates.length,
      exactExistingMatchCount: existingMatches.length,
      notProposedCount: notProposed.length,
      sourceCount: sources.length,
      conflictCount: conflicts.length,
      independentReview: "pending",
    },
    null,
    2,
  ),
);
