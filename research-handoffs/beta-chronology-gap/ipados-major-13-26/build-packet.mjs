import {createHash} from "node:crypto";
import {readFile, stat, writeFile} from "node:fs/promises";
import path from "node:path";
import {fileURLToPath} from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(here, "../../../");
const evidenceDir = path.join(
  repoRoot,
  "tmp/research-evidence/beta-chronology-gap/ipados-major-13-26",
);
const relativePacketDir =
  "research-handoffs/beta-chronology-gap/ipados-major-13-26";
const batchId = "beta-chronology-gap-ipados-major-13-26";
const cohortId = "ipados-major-13-26-public-beta";
const researchCutoff = "2026-07-30";
const generatedAt = new Date().toISOString();

const cycles = {
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
    [2, "2020-07-09"],
    [3, "2020-07-23"],
    [4, "2020-08-06"],
    [5, "2020-08-19"],
    [6, "2020-08-25"],
    [7, "2020-09-03"],
    [8, "2020-09-09"],
  ],
  "15.0": [
    [2, "2021-06-30"],
    [3, "2021-07-16"],
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
  "26.0": [
    [1, "2025-07-24"],
    [2, "2025-08-07"],
    [3, "2025-08-14"],
    [4, "2025-08-18"],
    [5, "2025-08-25"],
    [6, "2025-09-02"],
  ],
};

const exactExistingKeys = new Set([
  "16.0:1",
  "17.0:1",
  "26.0:1",
]);

const mrSourceNumbers = {
  "13.0": 101,
  "14.0": 108,
  "15.0": 115,
  "16.0": 122,
  "17.0": 126,
  "18.0": 132,
  "26.0": 138,
};

const mrFirstSequences = {
  "13.0": 1,
  "14.0": 2,
  "15.0": 2,
  "16.0": 1,
  "17.0": 1,
  "18.0": 1,
  "26.0": 1,
};

const iCultureSourceIds = {
  "13.0": "iculture-ipados13",
  "14.0": "iculture-ipados14",
  "15.0": "iculture-ipados15",
  "16.0": "iculture-ipados16",
  "17.0": "iculture-ipados17",
  "18.0": "iculture-ipados18",
  "26.0": "iculture-ipados26",
};

const extraEvidenceByKey = {
  "13.0:1": ["imore-ipados13-cycle"],
  "13.0:2": ["imore-ipados13-cycle"],
  "13.0:3": ["imore-ipados13-cycle"],
  "13.0:4": ["imore-ipados13-cycle"],
  "13.0:5": ["imore-ipados13-cycle"],
  "13.0:6": ["imore-ipados13-cycle"],
  "13.0:7": ["imore-ipados13-cycle"],
  "14.0:2": ["koc-ipados14-pb2"],
  "14.0:3": [
    "redmondpie-ipados14-pb3",
    "forbes-ipados14-pb3",
  ],
  "15.0:2": [
    "forbes-ipados15-pb2",
    "iphonecanada-ipados15-pb2",
  ],
  "15.0:3": [
    "forbes-ipados15-pb3",
    "wccftech-ipados15-pb3",
  ],
  "15.0:4": ["osxd-ipados15-pb4"],
  "15.0:6": ["osxd-ipados15-pb6"],
  "17.0:4": ["osxd-ipados17-pb4"],
  "17.0:5": ["appleinsider-ipados17-pb5"],
  "18.0:4": ["9to5mac-ipados18-pb4"],
  "18.0:5": ["osxd-ipados18-pb5"],
  "18.0:6": ["9to5mac-ipados18-pb6"],
};

const includedExtraSourceIds = new Set(
  Object.values(extraEvidenceByKey).flat(),
);

const sha256 = (value) =>
  createHash("sha256").update(value).digest("hex");

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
  const words = title.split(/\s+/).filter(Boolean);
  const selectedWords = words.slice(0, 20);
  return {
    type: "verbatimHeadlineFragment",
    text: selectedWords.join(" "),
    wordCount: selectedWords.length,
    maxWords: 20,
    purpose:
      "Bounded source-identification excerpt only; candidate claims use structured locators and original synthesis.",
  };
};

const publisherFor = (sourceId) => {
  if (sourceId.startsWith("iculture-")) return "iCulture";
  if (sourceId.startsWith("mr-")) return "MacRumors";
  if (sourceId.startsWith("imore-")) return "iMore";
  if (sourceId.startsWith("koc-")) return "KOC / 電腦王阿達";
  if (sourceId.startsWith("forbes-")) return "Forbes";
  if (sourceId.startsWith("osxd-")) return "OS X Daily";
  if (sourceId.startsWith("appleinsider-")) return "AppleInsider";
  if (sourceId.startsWith("9to5mac-")) return "9to5Mac";
  if (sourceId.startsWith("redmondpie-")) return "Redmond Pie";
  if (sourceId.startsWith("iphonecanada-")) return "iPhone in Canada";
  if (sourceId.startsWith("wccftech-")) return "Wccftech";
  throw new Error(`Unknown publisher for ${sourceId}`);
};

const sourceClassFor = (sourceId) =>
  sourceId.startsWith("iculture-") || sourceId.startsWith("imore-")
    ? "contemporaneousLivingChronology"
    : "contemporaneousSecondary";

const sourceLocatorFor = (sourceId, purpose) => {
  if (sourceId.startsWith("mr-")) {
    return "JSON-LD publication timestamp plus the article lead or same-day public-beta update. For the 14.0 and 15.0 opening seeds, newsroom appearance wording is explicitly treated as conflicting rather than as the displayed ordinal.";
  }
  if (sourceId.startsWith("iculture-")) {
    return "The dated iPadOS public-beta section and cycle recap. Known ordinal and time-zone disagreements are enumerated in conflicts.json.";
  }
  if (sourceId.startsWith("imore-")) {
    return "The rolling iPadOS 13 public-beta update history retained in the article body.";
  }
  return `Page metadata, headline, and the paragraph supporting: ${purpose}.`;
};

const manifest = JSON.parse(
  await readFile(path.join(evidenceDir, "fetch-manifest.json"), "utf8"),
);
const productionRaw = await readFile(
  path.join(evidenceDir, "production-snapshot.json"),
);
const production = JSON.parse(productionRaw);
const productionByKey = new Map(
  production.scopedPublicBetaEvents.map((event) => [
    `${event.version}:${event.sequence}`,
    event,
  ]),
);

const mrSourceIdFor = (version, sequence) => {
  const offset = sequence - mrFirstSequences[version];
  return `mr-ipados${version.split(".")[0]}-pb${sequence}`;
};

const usedSourceIds = new Set();
for (const [version, appearances] of Object.entries(cycles)) {
  for (const [sequence] of appearances) {
    usedSourceIds.add(mrSourceIdFor(version, sequence));
    usedSourceIds.add(iCultureSourceIds[version]);
    for (const sourceId of extraEvidenceByKey[`${version}:${sequence}`] ?? []) {
      usedSourceIds.add(sourceId);
    }
  }
}

const manifestById = new Map(
  manifest.sources.map((source) => [source.sourceId, source]),
);
const sources = [];
for (const sourceId of [...usedSourceIds].sort()) {
  const manifestSource = manifestById.get(sourceId);
  if (!manifestSource) throw new Error(`Missing manifest source ${sourceId}`);
  const rawPath = path.posix.join(
    "tmp/research-evidence/beta-chronology-gap/ipados-major-13-26",
    manifestSource.filename,
  );
  const bytes = await readFile(path.join(repoRoot, rawPath));
  const html = bytes.toString("utf8");
  const title =
    firstMatch(html, [
      /<title[^>]*>([\s\S]*?)<\/title>/i,
      /"headline"\s*:\s*"([^"]+)"/i,
    ]) ?? manifestSource.purpose;
  const publishedAt = firstMatch(html, [
    /"datePublished"\s*:\s*"([^"]+)"/i,
    /property=["']article:published_time["'][^>]+content=["']([^"']+)["']/i,
    /name=["']date["'][^>]+content=["']([^"']+)["']/i,
  ]);
  const author = firstMatch(html, [
    /"author"\s*:\s*\{[^{}]{0,800}?"name"\s*:\s*"([^"]+)"/i,
    /"author"\s*:\s*"([^"]+)"/i,
  ]);
  sources.push({
    sourceId,
    canonicalUrl: manifestSource.url,
    title,
    publisher: publisherFor(sourceId),
    author,
    publishedAt,
    publishedDateObserved: publishedAt?.slice(0, 10) ?? null,
    publicationDatePrecision: !publishedAt
      ? "unknown"
      : publishedAt.length > 10
        ? "datetime"
        : "date",
    accessedAt: researchCutoff,
    archiveUrl: null,
    status: "active",
    sourceClass: sourceClassFor(sourceId),
    roles: [
      "publicAvailability",
      "publicOrdinal",
      "appearanceDate",
      "channelIdentity",
    ],
    evidence: {
      rawPath,
      rawBytes: bytes.byteLength,
      rawSha256: sha256(bytes),
      captureMethod: "http-html",
      locator: sourceLocatorFor(sourceId, manifestSource.purpose),
      selectedText: boundedHeadlineFragment(title),
    },
    lineage: {
      publisherFamily: publisherFor(sourceId),
      independentForCorroboration: true,
      notes:
        "Direct publisher page retained locally. Shared article URLs across Apple platforms count as one publisher lineage, not separate corroboration.",
    },
  });
}

const sourceById = new Map(sources.map((source) => [source.sourceId, source]));

const evidenceRef = (sourceId, version, sequence) => {
  const source = sourceById.get(sourceId);
  if (!source) throw new Error(`Missing source ledger record ${sourceId}`);
  let locator = source.evidence.locator;
  let supports = `${source.publisher} evidence for the ${version} Public Beta ${sequence} public appearance.`;

  if (sourceId === "koc-ipados14-pb2") {
    locator =
      "The meta description states that the iOS 14 and iPadOS 14 public version arrived directly as Beta 2.";
    supports =
      "Explicit device-facing Beta 2 identity for the first iPadOS 14 public appearance.";
  } else if (sourceId === "mr-ipados14-pb2") {
    supports =
      "July 9 public availability and the newsroom's conflicting 'first beta' appearance wording; it does not establish Public Beta 1 as a displayed seed.";
  } else if (sourceId === "mr-ipados14-pb3") {
    supports =
      "July 23 public availability and the newsroom's conflicting 'second beta' appearance wording.";
  } else if (
    sourceId === "redmondpie-ipados14-pb3" ||
    sourceId === "forbes-ipados14-pb3"
  ) {
    supports =
      "Explicit Public Beta 3 identity for the July 23 iOS/iPadOS 14 public seed.";
  } else if (sourceId === "mr-ipados15-pb2") {
    supports =
      "June 30 iPadOS 15 public availability and the newsroom's conflicting 'first public beta' appearance wording.";
  } else if (sourceId === "forbes-ipados15-pb2") {
    supports =
      "Explicit Public Beta 2 identity for the June 30 public seed, paired with iPadOS-specific availability evidence.";
  } else if (sourceId === "iphonecanada-ipados15-pb2") {
    supports =
      "Contemporary iPadOS 15 public availability on June 30; ordinal corroboration comes from the independent Forbes lineage.";
  } else if (sourceId === "mr-ipados15-pb3") {
    supports =
      "July 16 iPadOS 15 public availability and conflicting second-appearance wording; the retained page also preserves tester observations of Public Beta 3.";
  } else if (
    sourceId === "forbes-ipados15-pb3" ||
    sourceId === "wccftech-ipados15-pb3"
  ) {
    supports =
      "Explicit Public Beta 3 identity for the July 16 iOS/iPadOS 15 public seed.";
  } else if (sourceId === "mr-ipados15-pb4") {
    supports =
      "July 28 iPadOS 15 public availability and conflicting third-appearance wording.";
  } else if (sourceId === "osxd-ipados15-pb4") {
    supports =
      "Explicit iPadOS 15 Public Beta 4 identity and July 28 date.";
  } else if (sourceId === "osxd-ipados15-pb6") {
    supports =
      "Explicit iPadOS 15 Public Beta 6 identity and August 18 date.";
  } else if (sourceId === "osxd-ipados17-pb4") {
    supports =
      "Explicit iPadOS 17 Public Beta 4 identity on August 16; the paired MacRumors developer article was published August 15 and updated for public availability the next day.";
  } else if (sourceId === "appleinsider-ipados17-pb5") {
    supports =
      "Explicit fifth iPadOS 17 public beta identity and August 22 availability.";
  } else if (sourceId === "9to5mac-ipados18-pb4") {
    supports =
      "Explicit iPadOS 18 Public Beta 4 availability on August 12.";
  } else if (sourceId === "osxd-ipados18-pb5") {
    supports =
      "Explicit iPadOS 18 Public Beta 5 identity in an August 21 UTC article; Pacific availability is independently fixed to August 20.";
  } else if (sourceId === "9to5mac-ipados18-pb6") {
    supports =
      "Explicit iPadOS 18 Public Beta 6 availability on August 28.";
  } else if (sourceId.startsWith("iculture-")) {
    locator = `${version} cycle: the Public Beta ${sequence} dated section or recap row. For 14.0 PB2 and 15.0 PB2–PB4, use only the date/appearance context described in conflicts.json, not the page's appearance-based ordinal.`;
  }

  return {
    kind: "packetSource",
    packetPath: `${relativePacketDir}/sources.json`,
    sourceId,
    locator,
    supports,
  };
};

const allAppearances = Object.entries(cycles).flatMap(
  ([version, appearances]) =>
    appearances.map(([sequence, appearanceDate]) => ({
      key: `${version}:${sequence}`,
      candidateId: `candidate:apple:ipados:${version}:public-beta-${sequence}`,
      platform: "iPadOS",
      platformId: "platform-ipados",
      version,
      releaseVersionId: `version-ipados-${version.replaceAll(".", "-")}`,
      channel: "publicBeta",
      routeAlias: `public-beta-${sequence}`,
      displayedLabel: `Public Beta ${sequence}`,
      appearanceDate,
      sequence,
    })),
);

const evidenceIdsFor = (appearance) => {
  const ids = [
    mrSourceIdFor(appearance.version, appearance.sequence),
    iCultureSourceIds[appearance.version],
    ...(extraEvidenceByKey[appearance.key] ?? []),
  ];
  return [...new Set(ids)];
};

const candidates = allAppearances
  .filter((appearance) => !exactExistingKeys.has(appearance.key))
  .map((appearance) => {
    const isProductionConflict = appearance.key === "15.0:2";
    return {
      candidateId: appearance.candidateId,
      originCohortId: cohortId,
      platform: appearance.platform,
      platformId: appearance.platformId,
      version: appearance.version,
      releaseVersionId: appearance.releaseVersionId,
      proposedIdentity: {
        label: appearance.displayedLabel,
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
      identityStatus: isProductionConflict ? "conflict" : "confirmed",
      evidenceState: "corroborated",
      productionReconciliation: {
        status: isProductionConflict
          ? "existingIdentityConflict"
          : "confirmedMissing",
        queriedAt: production.capturedAt,
        matchBasis: isProductionConflict
          ? "No exact Public Beta 2 route exists. The same June 30 appearance is currently stored as Public Beta 1 (release-event-01d7714ed4d28b61aeb41bf0), contradicting explicit Public Beta 2 evidence. This must be reviewed as a correction, not imported as a duplicate."
          : "The read-only published query found zero exact matches for {releaseVersionId, channel, routeAlias}; the releaseVersion parent exists.",
        exactIdentityMatches: 0,
      },
      evidenceRefs: evidenceIdsFor(appearance).map((sourceId) =>
        evidenceRef(
          sourceId,
          appearance.version,
          appearance.sequence,
        ),
      ),
      buildEvidenceStatus: "absent",
      contentDisposition: "timelineOnly",
      blockers: isProductionConflict
        ? [
            "Independent chronology review has not occurred.",
            "The existing same-date Public Beta 1 production identity must be corrected or rejected before any Public Beta 2 mutation is considered.",
          ]
        : ["Independent chronology review has not occurred."],
      review: {
        required: true,
        reviewer: null,
        reviewedAt: null,
        notes:
          "The research agent assembled and mechanically checked the packet but cannot serve as the independent chronology reviewer.",
      },
      flags: {
        sanityMutationAllowed: false,
        publicationEligible: false,
      },
    };
  });

const existingMatches = allAppearances
  .filter((appearance) => exactExistingKeys.has(appearance.key))
  .map((appearance) => {
    const event = productionByKey.get(appearance.key);
    if (!event) {
      throw new Error(`Missing exact production event for ${appearance.key}`);
    }
    return {
      matchId: `existing-match:apple:ipados:${appearance.version}:public-beta-${appearance.sequence}`,
      ...appearance,
      productionEvent: event,
      productionReconciliation: {
        status: "exactExistingMatch",
        queriedAt: production.capturedAt,
        exactIdentityMatches: 1,
        matchBasis:
          "Exact published production match on {releaseVersionId, channel, routeAlias}; date, label, sequence, availability state, and non-revision status also agree.",
      },
      evidenceState: "corroborated",
      evidenceRefs: evidenceIdsFor(appearance).map((sourceId) =>
        evidenceRef(
          sourceId,
          appearance.version,
          appearance.sequence,
        ),
      ),
      disposition: "retainExistingNoMutationProposed",
      flags: {
        sanityMutationAllowed: false,
        publicationEligible: false,
      },
    };
  });

const notProposed = [
  {
    recordId: "not-proposed:apple:ipados:14.0:public-beta-1",
    originCohortId: cohortId,
    platform: "iPadOS",
    platformId: "platform-ipados",
    releaseVersionId: "version-ipados-14-0",
    apparentIdentity: {
      label: "Public Beta 1",
      routeAlias: "public-beta-1",
      channel: "publicBeta",
      appearanceDate: "2020-07-09",
      sequence: 1,
      isRevision: false,
      availabilityState: "available",
      closesReleaseCycle: false,
    },
    classification: "disprovedIdentity",
    reason:
      "July 9 was the first public appearance, but retained contemporary device-facing evidence says the public seed arrived directly as Beta 2. 'First public beta' newsroom wording and iCulture's PB1 label count appearances; they do not establish a displayed Public Beta 1.",
    evidenceRefs: [
      evidenceRef("mr-ipados14-pb2", "14.0", 2),
      evidenceRef("koc-ipados14-pb2", "14.0", 2),
      evidenceRef("iculture-ipados14", "14.0", 2),
    ],
    reversalEvidence:
      "KOC's contemporary metadata explicitly states that iOS 14 and iPadOS 14 public availability arrived directly as Beta 2; the next retained public seed is explicitly Public Beta 3.",
    review: {
      required: true,
      reviewer: null,
      reviewedAt: null,
      notes:
        "Do not invent PB1 from appearance order or the paired developer ordinal.",
    },
    flags: {
      sanityMutationAllowed: false,
      publicationEligible: false,
    },
  },
  {
    recordId: "not-proposed:apple:ipados:15.0:public-beta-1",
    originCohortId: cohortId,
    platform: "iPadOS",
    platformId: "platform-ipados",
    releaseVersionId: "version-ipados-15-0",
    apparentIdentity: {
      label: "Public Beta 1",
      routeAlias: "public-beta-1",
      channel: "publicBeta",
      appearanceDate: "2021-06-30",
      sequence: 1,
      isRevision: false,
      availabilityState: "available",
      closesReleaseCycle: false,
    },
    classification: "disprovedIdentity",
    reason:
      "June 30 was the first public appearance, but multiple retained contemporary sources identify the seed as Public Beta 2. Production currently stores that date as Public Beta 1; this is an identity conflict, not a second historical appearance.",
    evidenceRefs: [
      evidenceRef("mr-ipados15-pb2", "15.0", 2),
      evidenceRef("forbes-ipados15-pb2", "15.0", 2),
      evidenceRef("iphonecanada-ipados15-pb2", "15.0", 2),
    ],
    reversalEvidence:
      "Forbes explicitly labels the June 30 payload Public Beta 2, and the following July 16 seed is explicitly Public Beta 3. No retained device-facing evidence supports a distinct Public Beta 1.",
    productionConflict: {
      eventId: "release-event-01d7714ed4d28b61aeb41bf0",
      stableEventId: "version-ipados-15-0:m-96d41d5554c6",
      currentRouteAlias: "public-beta-1",
      currentLabel: "Public Beta 1",
      appearanceDate: "2021-06-30",
      requiredDisposition:
        "Independent reviewer must decide and separately authorize correction. Do not create a duplicate Public Beta 2 event while PB1 remains.",
    },
    review: {
      required: true,
      reviewer: null,
      reviewedAt: null,
      notes:
        "The production correction is outside this research packet's authority.",
    },
    flags: {
      sanityMutationAllowed: false,
      publicationEligible: false,
    },
  },
];

const countBy = (items, selector) => {
  const counts = {};
  for (const item of items) {
    const key = selector(item);
    counts[key] = (counts[key] ?? 0) + 1;
  }
  return Object.fromEntries(
    Object.entries(counts).sort(([left], [right]) =>
      left.localeCompare(right),
    ),
  );
};

const assignment = {
  formatVersion: 1,
  batchId,
  createdAt: generatedAt,
  createdBy: "codex-review-reusable-public-betas",
  vendor: {name: "Apple", slug: "apple"},
  researchCutoff,
  scopeRule:
    "Audit every iPadOS major-cycle public-beta appearance for 13.0, 14.0, 15.0, 16.0, 17.0, 18.0, and 26.0. Preserve the displayed public ordinal, keep public and developer numbering separate, and exclude iPadOS 27 and all point-release cycles.",
  calendarNormalization:
    "appearanceDate uses the America/Los_Angeles calendar date. Later European/UTC publication dates are qualifications, not extra appearances.",
  identityRule:
    "A publisher calling an appearance first, second, or third does not prove Public Beta 1, 2, or 3. The numbered identity requires an explicit displayed/public label or independently corroborated device-facing evidence.",
  observedAppearanceCount: allAppearances.length,
  candidateCount: candidates.length,
  exactExistingMatchCount: existingMatches.length,
  targets: allAppearances,
  constraints: {
    noDeveloperOrdinalInference: true,
    noRcOrGmReclassification: true,
    noSanityWrites: true,
    noDeployment: true,
    noStableEventIdCreation: true,
    substantiveReleaseNotesInScope: false,
  },
  sourcePaths: [
    `${relativePacketDir}/sources.json`,
    `${relativePacketDir}/production-snapshot.json`,
    "tmp/research-evidence/beta-chronology-gap/ipados-major-13-26/",
  ],
};

const sourcesDocument = {
  formatVersion: 1,
  batchId,
  accessedAt: researchCutoff,
  sourceCount: sources.length,
  rawSourceCount: sources.length,
  copyrightHandling:
    "Each source retains at most a 20-word headline fragment for identification. No release-note prose is copied. Candidate claims use structured locators and original paraphrase.",
  sources,
};

const candidatesDocument = {
  formatVersion: 1,
  batchId,
  researchCutoff,
  observedAppearanceCount: allAppearances.length,
  candidateCount: candidates.length,
  exactExistingMatchCount: existingMatches.length,
  notProposedCount: notProposed.length,
  summary: {
    observedByVersion: countBy(allAppearances, (item) => item.version),
    candidatesByVersion: countBy(candidates, (item) => item.version),
    candidatesByStatus: countBy(
      candidates,
      (item) => item.candidateStatus,
    ),
    candidatesByEvidenceState: countBy(
      candidates,
      (item) => item.evidenceState,
    ),
    candidatesByProductionStatus: countBy(
      candidates,
      (item) => item.productionReconciliation.status,
    ),
    importantQualification:
      "Forty-three historical appearances survive. Three are exact production matches, 39 are confirmed missing identities, and one is an evidence-backed Public Beta 2 candidate blocked by a same-date production Public Beta 1 identity conflict.",
    buildsIncluded: 0,
    substantiveChangeClaimsIncluded: 0,
  },
  candidates,
  existingMatches,
  notProposed,
};

const conflicts = [
  {
    conflictId: "ipados-14-opening-public-seed-ordinal",
    severity: "high",
    subject:
      "iPadOS 14's first public appearance: appearance order versus displayed Beta 2 identity",
    sourceIds: [
      "mr-ipados14-pb2",
      "koc-ipados14-pb2",
      "iculture-ipados14",
    ],
    finding:
      "MacRumors calls July 9 the first public beta and iCulture labels it PB1, while KOC's contemporary metadata says the iOS/iPadOS public seed arrived directly as Beta 2.",
    decision:
      "Retain July 9 as Public Beta 2. Do not create Public Beta 1 from appearance order.",
  },
  {
    conflictId: "ipados-14-second-public-appearance-ordinal",
    severity: "high",
    subject:
      "iPadOS 14's July 23 appearance: second appearance versus displayed Public Beta 3",
    sourceIds: [
      "mr-ipados14-pb3",
      "redmondpie-ipados14-pb3",
      "forbes-ipados14-pb3",
      "iculture-ipados14",
    ],
    finding:
      "MacRumors' headline numbers the appearance as the second public beta. Independent contemporary sources explicitly identify the payload as Public Beta 3.",
    decision:
      "Retain July 23 as Public Beta 3. Appearance ordinal is not the public seed label.",
  },
  {
    conflictId: "ipados-15-opening-public-seed-production-identity",
    severity: "blocking",
    subject:
      "June 30, 2021 is stored in production as iPadOS 15 Public Beta 1 but contemporary evidence identifies Public Beta 2",
    sourceIds: [
      "mr-ipados15-pb2",
      "forbes-ipados15-pb2",
      "iphonecanada-ipados15-pb2",
    ],
    productionEventId: "release-event-01d7714ed4d28b61aeb41bf0",
    finding:
      "The date and public availability are real. The production ordinal/route is not supported; explicit contemporary labeling says Public Beta 2.",
    decision:
      "Propose PB2 only as an identity-conflict candidate. Do not create it or mutate PB1 until independent review and separate authorization.",
  },
  {
    conflictId: "ipados-15-early-appearance-versus-seed-number",
    severity: "high",
    subject:
      "iPadOS 15's July 16 and July 28 appearances are Public Beta 3 and 4, not second and third seed identities",
    sourceIds: [
      "mr-ipados15-pb3",
      "forbes-ipados15-pb3",
      "wccftech-ipados15-pb3",
      "mr-ipados15-pb4",
      "osxd-ipados15-pb4",
      "iculture-ipados15",
    ],
    finding:
      "Some rolling/newsroom chronologies count public appearances. Independent exact-label sources preserve Public Beta 3 on July 16 and Public Beta 4 on July 28.",
    decision:
      "Use the explicit public labels and preserve the appearance-count wording only as conflict evidence.",
  },
  {
    conflictId: "ipados-17-public-beta-4-article-date",
    severity: "medium",
    subject:
      "iPadOS 17 Public Beta 4 is an August 16 public appearance attached to an August 15 developer article",
    sourceIds: [
      "mr-ipados17-pb4",
      "iculture-ipados17",
      "osxd-ipados17-pb4",
    ],
    finding:
      "The MacRumors page metadata reflects the August 15 developer release; its public update and independent public-beta sources place public availability on August 16.",
    decision:
      "Use 2023-08-16. Do not inherit the paired developer article's publication date.",
  },
  {
    conflictId: "ipados-18-public-beta-5-calendar-date",
    severity: "medium",
    subject:
      "iPadOS 18 Public Beta 5 appears August 20 Pacific while one independent article is dated August 21 UTC",
    sourceIds: [
      "mr-ipados18-pb5",
      "iculture-ipados18",
      "osxd-ipados18-pb5",
    ],
    finding:
      "MacRumors' same-day public update and the cycle chronology support August 20 Pacific. OS X Daily's retained article was published August 21 UTC.",
    decision:
      "Normalize to 2024-08-20 America/Los_Angeles and preserve the later article timestamp as a qualification.",
  },
  {
    conflictId: "ipados-26-public-beta-5-calendar-date",
    severity: "medium",
    subject:
      "iPadOS 26 Public Beta 5: August 25 Pacific versus August 26 in a European living chronology",
    sourceIds: ["mr-ipados26-pb5", "iculture-ipados26"],
    finding:
      "MacRumors records release at 14:52 PDT on August 25. iCulture's European chronology displays August 26.",
    decision:
      "Normalize to 2025-08-25 America/Los_Angeles; do not create an August 26 appearance.",
  },
];

const conflictsDocument = {
  formatVersion: 1,
  batchId,
  conflictCount: conflicts.length,
  conflicts,
  reviewState: "selfCheckedPendingIndependentReview",
};

const review = {
  formatVersion: 1,
  batchId,
  reviewedAt: researchCutoff,
  reviewer: "codex-review-reusable-public-betas",
  independentOfResearcher: false,
  verdict: "selfCheckPassedPendingIndependentReview",
  candidateVerdict: {
    readyForIndependentChronologyReview: candidates
      .filter((candidate) => candidate.identityStatus === "confirmed")
      .map((candidate) => candidate.candidateId),
    needsIdentityCorrectionReview: candidates
      .filter((candidate) => candidate.identityStatus === "conflict")
      .map((candidate) => candidate.candidateId),
    existingExactMatchesNoMutationProposed: existingMatches.map(
      (match) => match.matchId,
    ),
  },
  checks: {
    targetEnumerationComplete: true,
    sourceMetadataCaptured: true,
    boundedSelectedTextCaptured: true,
    productionQueryReadOnly: true,
    productionScopedPublicBetaCount:
      production.productionCounts.scopedPublicBetaEvents,
    exactExistingMatchCount: existingMatches.length,
    publicOrdinalNotInferredFromDeveloperOrdinal: true,
    appearanceOrderNotUsedAsPublicOrdinal: true,
    rcGmBoundaryApplied: true,
    sanityMutationPerformed: false,
  },
  authorization: {
    independentChronologyReviewComplete: false,
    publicationEligible: false,
    sanityMutationAllowed: false,
    deploymentAllowed: false,
  },
};

const reportRows = allAppearances
  .map((appearance) => {
    const status = exactExistingKeys.has(appearance.key)
      ? "exact existing match"
      : appearance.key === "15.0:2"
        ? "candidate — production identity conflict"
        : "candidate — confirmed missing";
    return `| ${appearance.version} | ${appearance.displayedLabel} | ${appearance.appearanceDate} | corroborated | ${status} |`;
  })
  .join("\n");

const report = `# iPadOS major-cycle public-beta chronology, 13.0–26.0

Status: **research complete; mechanical self-check passed; independent chronology review required**

Research cutoff: **${researchCutoff}**

Scope: every public-beta appearance in the iPadOS 13.0, 14.0, 15.0, 16.0, 17.0, 18.0, and 26.0 major cycles. iPadOS 27 and point-release cycles are excluded.

## Outcome

The retained evidence supports **43 historical public-beta appearances**:

- 13.0: 7
- 14.0: 7, beginning at displayed **Public Beta 2**
- 15.0: 7, beginning at displayed **Public Beta 2**
- 16.0: 4
- 17.0: 6
- 18.0: 6
- 26.0: 6

Three identities already have exact production matches: 16.0 Public Beta 1, 17.0 Public Beta 1, and 26.0 Public Beta 1. Of the remaining 40, **39 are confirmed missing** and one is blocked by a production identity conflict: the June 30, 2021 iPadOS 15 appearance is stored as Public Beta 1, while explicit contemporary evidence identifies Public Beta 2.

No Sanity write, transaction, import, publication, stable ID creation, or deployment was performed.

## Chronology

| Version | Displayed label | Pacific appearance date | Evidence | Production disposition |
| --- | --- | --- | --- | --- |
${reportRows}

## The 14.0 and 15.0 numbering trap

The first public appearance is not necessarily Public Beta 1. For both iPadOS 14 and iPadOS 15, the first publicly available seed was displayed as Public Beta 2. Some publishers nevertheless called it the “first public beta,” and some rolling chronologies converted appearance order into PB1/PB2/PB3. This packet does not.

The retained sequence is:

- iPadOS 14: PB2 on July 9, PB3 on July 23, then PB4–PB8.
- iPadOS 15: PB2 on June 30, PB3 on July 16, PB4 on July 28, then PB5–PB8.

No iPadOS 14 or iPadOS 15 Public Beta 1 is proposed. The existing iPadOS 15 PB1 production event is preserved as a correction blocker; it is not silently reinterpreted or duplicated.

## Date convention

The canonical appearance date is the America/Los_Angeles calendar date:

- iPadOS 17 PB4 is August 16. The linked MacRumors developer article was published August 15 and updated for public availability the next day.
- iPadOS 18 PB5 is August 20 Pacific. An independent article published August 21 UTC is a later report, not a second appearance.
- iPadOS 26 PB5 is August 25 Pacific. iCulture's August 26 European date is retained as a time-zone qualification.

## Evidence and copyright handling

Every candidate has at least two independent publisher lineages in the packet. Raw publisher pages are archived under \`tmp/research-evidence/beta-chronology-gap/ipados-major-13-26/\` with byte counts and SHA-256 hashes. The source ledger retains only a bounded headline fragment of at most 20 words. No release-note prose or feature descriptions are copied.

This packet establishes chronology identity only: platform, public audience, displayed public ordinal, and appearance date. It does not supply substantive release-note claims.

## Required independent review

1. Reproduce every retained raw byte count and SHA-256.
2. Check each candidate locator for iPadOS public availability, displayed public ordinal, and Pacific appearance date.
3. Confirm that no public ordinal was derived from appearance order or a paired developer ordinal.
4. Review the June 30, 2021 production PB1/PB2 conflict before any separately authorized mutation.
5. Re-run the live read-only production query immediately before any separately authorized change.
6. Keep iPadOS 27 and point-release cycles outside this packet.

## Files

- \`assignment.json\` — scope, 43 frozen targets, identity rules, and constraints
- \`sources.json\` — source ledger, raw evidence custody, hashes, and bounded selected text
- \`candidates.json\` — 40 candidates, three exact existing matches, and two disproved PB1 identities
- \`conflicts.json\` — ordinal, production, and calendar-date conflicts
- \`production-snapshot.json\` — exact read-only published-production snapshot
- \`review.json\` — researcher self-check boundary
- \`validate.mjs\` and \`validation.json\` — repeatable mechanical validation

This packet authorizes no production change.
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
    path.join(here, "candidates.json"),
    `${JSON.stringify(candidatesDocument, null, 2)}\n`,
  ),
  writeFile(
    path.join(here, "conflicts.json"),
    `${JSON.stringify(conflictsDocument, null, 2)}\n`,
  ),
  writeFile(
    path.join(here, "production-snapshot.json"),
    productionRaw,
  ),
  writeFile(
    path.join(here, "review.json"),
    `${JSON.stringify(review, null, 2)}\n`,
  ),
  writeFile(path.join(here, "report.md"), report),
]);

console.log(
  JSON.stringify(
    {
      batchId,
      observedAppearances: allAppearances.length,
      candidates: candidates.length,
      existingMatches: existingMatches.length,
      notProposed: notProposed.length,
      sources: sources.length,
      conflicts: conflicts.length,
      productionCapturedAt: production.capturedAt,
      productionSnapshotSha256: sha256(productionRaw),
    },
    null,
    2,
  ),
);
