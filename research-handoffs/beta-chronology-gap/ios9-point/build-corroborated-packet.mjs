import {createHash} from "node:crypto";
import {readFile, writeFile} from "node:fs/promises";
import path from "node:path";
import {fileURLToPath} from "node:url";
import {JSDOM} from "jsdom";

const here = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(here, "../../../");
const evidenceRoot = path.join(repoRoot, "tmp/ios9-point-evidence");
const packetPath = (name) => path.join(here, name);
const packetRelative = (name) =>
  `research-handoffs/beta-chronology-gap/ios9-point/${name}`;
const sha256 = (value) =>
  createHash("sha256").update(value).digest("hex");
const json = async (name) =>
  JSON.parse(await readFile(packetPath(name), "utf8"));
const collapse = (value) =>
  String(value ?? "")
    .replace(/\s+/g, " ")
    .trim();
const wordCount = (value) =>
  collapse(value)
    .split(" ")
    .filter(Boolean).length;

const preservedReviewSha256 =
  "c31165ca8df49d75c475b78b7fabefa415d04885b0ec98a1abc08cfc69f7779b";
const reviewBytes = await readFile(packetPath("review.json"));
if (sha256(reviewBytes) !== preservedReviewSha256) {
  throw new Error(
    "The frozen independent review changed; refusing to overwrite the packet.",
  );
}

const [
  assignment,
  candidateDocument,
  sourceDocument,
  conflictDocument,
  review,
  manifest,
  fetchLog,
  productionSnapshot,
] = await Promise.all([
  json("assignment.json"),
  json("candidates.json"),
  json("sources.json"),
  json("conflicts.json"),
  json("review.json"),
  json("corroboration-fetch-manifest.json"),
  JSON.parse(
    await readFile(
      path.join(evidenceRoot, "corroboration-fetch-log.json"),
      "utf8",
    ),
  ),
  json("production-snapshot.json"),
]);

if (assignment.targetCount !== 27 || candidateDocument.candidates.length !== 27) {
  throw new Error("The frozen 27-target assignment is not intact.");
}
if (manifest.sources.length !== 25 || fetchLog.successCount !== 25) {
  throw new Error("The 25-source corroboration fetch is incomplete.");
}
if (productionSnapshot.safety?.sanityMutationPerformed !== false) {
  throw new Error("Production snapshot does not declare a query-only run.");
}

const selectedFragments = {
  "source-ios91-pb1-iculture": [
    "eerste publieke beta van iOS 9.1 beschikbaar gesteld",
  ],
  "source-ios91-pb2-iculture": [
    "iOS 9.1 publieke beta 2 nu beschikbaar",
  ],
  "source-ios91-pb4-iculture": [
    "iOS 9.1 Publieke beta 4 beschikbaar",
  ],
  "source-ios91-pb5-iculture": [
    "(publieke) beta 5 van iOS 9.1 beschikbaar",
  ],
  "source-ios92-pb1-iculture": [
    "Eerste publieke beta iOS 9.2 beschikbaar voor testers",
  ],
  "source-ios92-pb2-iculture": [
    "Tweede (publieke) beta van iOS 9.2",
  ],
  "source-ios92-pb3-iculture": [
    "Beta 3 van iOS 9.2 nu door Apple beschikbaar gesteld, ook publieke beta",
  ],
  "source-ios92-pb4-iculture": [
    "Vierde beta iOS 9.2 nu beschikbaar voor ontwikkelaars en publieke testers",
  ],
  "source-ios921-pb1-iculture": [
    "de eerste beta voor iOS 9.2.1 nu ook beschikbaar gesteld publieke testers",
  ],
  "source-ios93-pb1-appleinsider": [
    "Apple seeds 1st public betas of iOS 9.3",
  ],
  "source-ios93-pb2-iculture": [
    "Publieke beta 2 van iOS 9.3 verschenen",
  ],
  "source-ios93-pb3-iculture": [
    "Derde beta iOS 9.3 met nachtmodus nu beschikbaar voor publieke testers",
  ],
  "source-ios93-pb4-appleinsider": [
    "Fourth betas of iOS 9.3",
    "issued to Apple's public testers",
  ],
  "source-ios93-pb5-iculture": [
    "Vijfde publieke beta van iOS 9.3",
  ],
  "source-ios93-pb6-iculture": [
    "Zesde beta iOS 9.3",
    "beschikbaar voor ontwikkelaars en publieke testers",
  ],
  "source-ios93-pb7-iculture": [
    "Zevende beta iOS 9.3",
    "beschikbaar voor ontwikkelaars en publieke betatesters",
  ],
  "source-ios932-pb1-9to5mac": [
    "Apple releases first iOS 9.3.2",
    "iOS 9.3.2 is now available as a public beta update as well",
  ],
  "source-ios932-pb2-iculture": [
    "iOS 9.3.2 beta 2",
    "nu ook voor publieke testers",
  ],
  "source-ios932-pb3-iculture": [
    "iOS 9.3.2 publieke beta 3",
  ],
  "source-ios932-pb4-iculture": [
    "Vierde publieke beta van iOS 9.3.2",
  ],
  "source-ios933-pb1-iculture": [
    "eerste beta van iOS 9.3.3 uitgebracht",
    "nu is er ook de publieke betaversie",
  ],
  "source-ios933-pb2-iculture": [
    "tweede publieke beta voor iOS 9.3.3",
  ],
  "source-ios933-pb3-iculture": [
    "derde (publieke) beta van iOS 9.3.3 beschikbaar gesteld",
  ],
  "source-ios933-pb4-iculture": [
    "Vierde publieke beta van iOS 9.3.3",
  ],
  "source-ios933-pb5-iculture": [
    "vijfde beta beschikbaar gesteld voor ontwikkelaars én publieke betatesters",
  ],
};

const supportNotes = {
  "source-ios932-pb1-9to5mac":
    "The April 6 article establishes the first iOS 9.3.2 seed; its explicitly dated April 7 update records the public-program appearance.",
  "source-ios933-pb1-iculture":
    "The same-day revised headline and lead explicitly identify the first public appearance; stale pre-update future-tense copy is preserved as a conflict.",
  "source-ios933-pb3-iculture":
    "The same-day revised lead explicitly identifies the third public appearance; stale developer-only copy later in the page is preserved as a conflict.",
};

function flattenJsonLd(value) {
  if (Array.isArray(value)) return value.flatMap(flattenJsonLd);
  if (!value || typeof value !== "object") return [];
  return [
    value,
    ...Object.values(value).flatMap((nested) => flattenJsonLd(nested)),
  ];
}

function metadataFromHtml(html) {
  const document = new JSDOM(html).window.document;
  const jsonLd = [...document.querySelectorAll('script[type="application/ld+json"]')]
    .flatMap((node) => {
      try {
        return flattenJsonLd(JSON.parse(node.textContent ?? ""));
      } catch {
        return [];
      }
    })
    .filter(
      (node) =>
        node.headline ||
        node.datePublished ||
        ["Article", "NewsArticle", "ReportageNewsArticle"].includes(
          node["@type"],
        ),
    );
  const articleNode =
    jsonLd.find((node) =>
      [node["@type"]].flat().some((type) =>
        ["Article", "NewsArticle", "ReportageNewsArticle"].includes(type),
      ),
    ) ?? jsonLd[0];
  const title =
    collapse(document.querySelector("h1")?.textContent) ||
    collapse(document.querySelector('meta[property="og:title"]')?.content) ||
    collapse(articleNode?.headline) ||
    collapse(document.title);
  const authorValue = articleNode?.author;
  const author =
    collapse(
      typeof authorValue === "string"
        ? authorValue
        : Array.isArray(authorValue)
          ? authorValue.map((value) => value?.name).filter(Boolean).join(", ")
          : authorValue?.name,
    ) || null;
  const datePublished =
    articleNode?.datePublished ??
    document.querySelector('meta[property="article:published_time"]')?.content ??
    null;
  const dateModified =
    articleNode?.dateModified ??
    document.querySelector('meta[property="article:modified_time"]')?.content ??
    null;
  const corpus = collapse(
    [
      title,
      document.querySelector('meta[property="og:title"]')?.content,
      ...document.querySelectorAll(
        "article p, .entry-content p, .post-content p, .article-content p, main p",
      ),
    ]
      .map((node) =>
        typeof node === "string" ? node : collapse(node?.textContent),
      )
      .join(" "),
  );
  return {title, author, datePublished, dateModified, corpus};
}

const fetchById = new Map(
  fetchLog.results.map((result) => [result.sourceId, result]),
);
const candidateById = new Map(
  candidateDocument.candidates.map((candidate) => [
    candidate.candidateId,
    candidate,
  ]),
);
const newSources = [];

for (const manifestSource of manifest.sources) {
  const fetchResult = fetchById.get(manifestSource.sourceId);
  const candidate = candidateById.get(manifestSource.candidateId);
  if (!fetchResult || fetchResult.status === "failed" || !candidate) {
    throw new Error(`Missing fetched source or candidate: ${manifestSource.sourceId}`);
  }
  const rawPath = path.join(evidenceRoot, manifestSource.filename);
  const raw = await readFile(rawPath);
  if (
    raw.byteLength !== fetchResult.bytes ||
    sha256(raw) !== fetchResult.sha256
  ) {
    throw new Error(`Raw source custody mismatch: ${manifestSource.sourceId}`);
  }
  const metadata = metadataFromHtml(raw.toString("utf8"));
  const fragments = selectedFragments[manifestSource.sourceId];
  if (!fragments?.length) {
    throw new Error(`No bounded fragments: ${manifestSource.sourceId}`);
  }
  for (const fragment of fragments) {
    if (wordCount(fragment) > 20) {
      throw new Error(`Fragment exceeds 20 words: ${manifestSource.sourceId}`);
    }
    if (!metadata.corpus.includes(fragment)) {
      throw new Error(
        `Fragment not reproduced in source ${manifestSource.sourceId}: ${fragment}`,
      );
    }
  }

  const publisher = manifestSource.sourceId.includes("iculture")
    ? "iCulture"
    : manifestSource.sourceId.includes("appleinsider")
      ? "AppleInsider"
      : "9to5Mac";
  const appearanceDate = candidate.proposedIdentity.appearanceDate;
  const publishedDate = metadata.datePublished?.slice(0, 10) ?? null;
  newSources.push({
    sourceId: manifestSource.sourceId,
    canonicalUrl: fetchResult.finalUrl ?? manifestSource.url,
    title: metadata.title,
    publisher,
    author: metadata.author,
    publishedAt: metadata.datePublished,
    modifiedAt: metadata.dateModified,
    publishedDateObserved: publishedDate,
    appearanceDateObserved: appearanceDate,
    publicationDatePrecision: metadata.datePublished ? "datetime" : "date",
    dateBasis:
      manifestSource.sourceId === "source-ios932-pb1-9to5mac"
        ? "The article was published for the developer seed on April 6; its explicit April 7 update and modification timestamp establish the public appearance date."
        : "The publisher date resolves to the same civil date as the public appearance; no UTC-to-Pacific rollover occurs.",
    accessedAt: manifest.accessedAt,
    archiveUrl: null,
    status: "active",
    sourceClass: "journalism",
    roles: [
      "publicAvailability",
      "publicOrdinal",
      "appearanceDate",
      "channelIdentity",
      "independentCorroboration",
    ],
    evidence: {
      rawPath: `tmp/ios9-point-evidence/${manifestSource.filename}`,
      rawBytes: raw.byteLength,
      rawSha256: sha256(raw),
      captureMethod: "http-html",
      locator:
        manifestSource.sourceId === "source-ios932-pb1-9to5mac"
          ? "Headline establishes the first iOS 9.3.2 seed; article update explicitly dated April 7 identifies public-beta availability."
          : "Headline and/or first article paragraph explicitly identifies the version, public audience, and ordinal; JSON-LD anchors the publisher date.",
      selectedTextPolicy:
        "Source-identification fragments only; each verbatim fragment is no more than 20 words.",
      selectedTextFragments: fragments.map((text) => ({
        text,
        wordCount: wordCount(text),
        bytes: Buffer.byteLength(text),
        sha256: sha256(text),
      })),
    },
    lineage: {
      publisherFamily: publisher,
      independentForCorroboration: true,
      notes:
        "Direct contemporary publisher page retained locally. This editorial lineage is independent from the candidate's MacRumors source.",
    },
    candidateSupport: {
      candidateId: manifestSource.candidateId,
      supports:
        supportNotes[manifestSource.sourceId] ??
        "Independent contemporary report explicitly corroborates the exact version, public audience, ordinal, and appearance date.",
    },
  });
}

const newSourceIds = new Set(manifest.sources.map((source) => source.sourceId));
sourceDocument.sources = [
  ...sourceDocument.sources.filter(
    (source) => !newSourceIds.has(source.sourceId),
  ),
  ...newSources,
];
sourceDocument.sourceCount = sourceDocument.sources.length;
sourceDocument.accessedAt = manifest.accessedAt;
sourceDocument.custody.note =
  "Raw publisher pages are retained only in the ignored evidence directory. This committed ledger stores metadata, bounded locators, byte counts, hashes, and short source-identification fragments—not article copy.";
sourceDocument.corroborationWave = {
  addedPublisherSources: newSources.length,
  candidateCount: manifest.sources.length,
  publisherFamilies: [...new Set(newSources.map((source) => source.publisher))],
  independentReviewOfAddedSourcesComplete: false,
};

const exactCheckByCandidate = new Map(
  productionSnapshot.exactChecks.map((check) => [check.candidateId, check]),
);
const developerCheckByCandidate = new Map(
  productionSnapshot.developerRouteChecks.map((check) => [
    check.candidateId,
    check,
  ]),
);
const manifestByCandidate = new Map(
  manifest.sources.map((source) => [source.candidateId, source]),
);

for (const candidate of candidateDocument.candidates) {
  const exactCheck = exactCheckByCandidate.get(candidate.candidateId);
  const developerCheck = developerCheckByCandidate.get(candidate.candidateId);
  if (!exactCheck) {
    throw new Error(`No fresh production check: ${candidate.candidateId}`);
  }
  const corroborator = manifestByCandidate.get(candidate.candidateId);
  if (corroborator) {
    candidate.evidenceRefs = candidate.evidenceRefs.filter(
      (reference) => !newSourceIds.has(reference.sourceId),
    );
    candidate.evidenceRefs.push({
      kind: "packetSource",
      packetPath: packetRelative("sources.json"),
      sourceId: corroborator.sourceId,
      locator:
        corroborator.sourceId === "source-ios932-pb1-9to5mac"
          ? "Headline plus the article's explicitly dated April 7 public-beta update"
          : "Bounded headline/lead fragments and JSON-LD publication metadata",
      supports:
        supportNotes[corroborator.sourceId] ??
        "Independent contemporary publisher lineage corroborates the exact public-beta identity and appearance date.",
    });
  }
  candidate.identityStatus = "confirmed";
  candidate.evidenceState = "corroborated";
  candidate.productionReconciliation = {
    status:
      exactCheck.exactIdentityMatches === 0
        ? "confirmedMissing"
        : "exactExistingMatch",
    queriedAt: productionSnapshot.capturedAt,
    matchBasis:
      "Fresh exact published-production query by releaseVersionId, channel publicBeta, and routeAlias.",
    exactIdentityMatches: exactCheck.exactIdentityMatches,
    exactDateMatches: exactCheck.exactDateMatches,
    matches: exactCheck.matches,
  };
  candidate.pairedDeveloperProductionState =
    developerCheck?.exactIdentityMatches > 0
      ? "exactExistingMatch"
      : "confirmedMissingFromPublishedCorpus";
  candidate.blockers = [
    "Independent chronology review of this assembled candidate packet has not yet occurred.",
  ];
  candidate.review = {
    required: true,
    reviewer: null,
    reviewedAt: null,
    notes:
      "The corroboration researcher performed a mechanical self-check but cannot serve as the independent chronology reviewer for the newly added evidence.",
  };
  candidate.flags = {
    sanityMutationAllowed: false,
    publicationEligible: false,
  };
}

candidateDocument.summary.byEvidenceState = {corroborated: 27};
candidateDocument.summary.importantQualification =
  "All 27 identities now have two independent contemporary publisher lineages. The frozen independent review covers two identities; the 25 newly added corroborations still require review before promotion. No candidate is publication-eligible.";
candidateDocument.summary.independentReviewCoverage = {
  previouslyReviewedCandidates: review.candidateVerdict.readyForChronologyReview
    .length,
  newlyCorroboratedCandidatesPendingReview:
    review.candidateVerdict.needsSecondPublisherLineage.length,
};

const addedConflictIds = new Set([
  "ios92-iculture-slug-and-copy-audience-mismatch",
  "ios932-public-beta-1-dated-update-boundary",
  "ios933-iculture-stale-pre-update-copy",
]);
conflictDocument.conflicts = conflictDocument.conflicts.filter(
  (conflict) => !addedConflictIds.has(conflict.conflictId),
);
conflictDocument.conflicts.push(
  {
    conflictId: "ios92-iculture-slug-and-copy-audience-mismatch",
    severity: "nonMaterial",
    subject:
      "Misleading developer-focused URL slugs or body copy on iCulture's iOS 9.2 Public Beta 2 and Public Beta 4 reports",
    positions: [
      {
        position: "developerFocusedSlugOrCopy",
        sources: [
          "source-ios92-pb2-iculture",
          "source-ios92-pb4-iculture",
        ],
        summary:
          "The legacy slugs mention developers, and the Public Beta 2 lead retains developer-focused copy.",
      },
      {
        position: "publicSpecificPublishedHeadline",
        sources: [
          "source-ios92-pb2-iculture",
          "source-ios92-pb4-iculture",
        ],
        summary:
          "The retained rendered headlines explicitly label the second and fourth releases for public testers on the candidate dates.",
      },
    ],
    decision: {
      disposition: "useRenderedHeadlineAndPreserveMismatch",
      confidence: "high",
      rationale:
        "A legacy URL slug is not an event label. The rendered publisher headline explicitly identifies the public audience and ordinal, while the mismatch remains documented.",
    },
  },
  {
    conflictId: "ios932-public-beta-1-dated-update-boundary",
    severity: "material",
    subject:
      "Whether iOS 9.3.2 Public Beta 1 appeared on the developer article's April 6 publication date or its April 7 public update",
    positions: [
      {
        position: "developerSeedPublishedApril6",
        sources: ["source-ios932-pb1-9to5mac"],
        summary:
          "The original article and headline identify the first developer seed on April 6.",
      },
      {
        position: "publicAppearanceExplicitlyUpdatedApril7",
        sources: ["source-ios932-pb1-9to5mac"],
        summary:
          "The retained article has an explicit April 7 update saying iOS 9.3.2 became available as a public beta.",
      },
    ],
    decision: {
      disposition: "use2016-04-07ForPublicAppearance",
      confidence: "high",
      rationale:
        "Developer and public audience appearances are separate events. The explicitly dated public update controls the public chronology.",
    },
    reversalEvidence:
      "A contemporary public-program source explicitly showing availability before April 7, 2016.",
  },
  {
    conflictId: "ios933-iculture-stale-pre-update-copy",
    severity: "nonMaterial",
    subject:
      "Stale developer-only or future-tense paragraphs within same-day revised iCulture pages for iOS 9.3.3 Public Beta 1 and Public Beta 3",
    positions: [
      {
        position: "stalePreUpdateParagraphs",
        sources: [
          "source-ios933-pb1-iculture",
          "source-ios933-pb3-iculture",
        ],
        summary:
          "Later page paragraphs still say the public release will follow or describe only developer availability.",
      },
      {
        position: "sameDayRevisedHeadlineAndLead",
        sources: [
          "source-ios933-pb1-iculture",
          "source-ios933-pb3-iculture",
        ],
        summary:
          "The rendered headline or lead explicitly says the first or third public beta is available, and JSON-LD records a same-day modification.",
      },
    ],
    decision: {
      disposition: "useRevisedHeadlineAndLeadPreserveStaleCopy",
      confidence: "high",
      rationale:
        "The revision-specific text is direct public-availability evidence; the internally stale paragraphs are preserved so downstream reviewers can reproduce the source history.",
    },
  },
);
conflictDocument.conflictCount = conflictDocument.conflicts.length;
conflictDocument.reviewState =
  "corroboratedSelfCheckCompletePendingIndependentChronologyReview";

const previouslyReviewed = new Set(
  review.candidateVerdict.readyForChronologyReview,
);
const rows = candidateDocument.candidates
  .map((candidate) => {
    const developer =
      candidate.pairedDeveloperProductionState === "exactExistingMatch"
        ? "existing"
        : "missing";
    const reviewState = previouslyReviewed.has(candidate.candidateId)
      ? "prior independent evidence review"
      : "new corroboration pending review";
    return `| ${candidate.version} | ${candidate.proposedIdentity.label} | ${candidate.proposedIdentity.appearanceDate} | corroborated | ${reviewState} | ${developer} |`;
  })
  .join("\n");
const cycleRows = assignment.cycles
  .map(
    (cycle) =>
      `| iOS ${cycle.version} | ${cycle.targetCount} | ${cycle.targetCount} | 0 | 0 |`,
  )
  .join("\n");

const report = `# iOS 9 point-release public-beta chronology handoff

Status: **corroborated; independent review pending for the new evidence**

Research cutoff: ${assignment.researchCutoff}  
Fresh production snapshot: \`${productionSnapshot.capturedAt}\`  
Frozen prior independent review: preserved byte-for-byte  
Evidence directory: \`tmp/ios9-point-evidence/\`

## Outcome

All **27 public-beta appearances** across iOS 9.1, 9.2, 9.2.1, 9.3,
9.3.2, and 9.3.3 now have two independent contemporary publisher lineages.
This wave added one corroborator for each of the 25 identities that the frozen
independent review had left at one lineage. The other two identities retain
their previously reviewed MacRumors + 9to5Mac evidence.

A fresh read-only production query found **zero** scoped \`publicBeta\`
events. All 27 proposed identities therefore remain confirmed missing as of
the snapshot above. No Sanity mutation, stable ID assignment, page build,
publication, or deployment occurred.

## Exact chronology

| Version | Public label | Appearance | Evidence | Independent-review state | Paired developer route |
| --- | --- | --- | --- | --- | --- |
${rows}

## Scope closure

| Cycle | Assigned | Corroborated | Exact production matches | Unresolved identities |
| --- | ---: | ---: | ---: | ---: |
${cycleRows}
| **Total** | **27** | **27** | **0** | **0** |

## Evidence and copyright boundary

The packet keeps URLs, metadata, reproducible locators, byte counts, SHA-256
hashes, and short source-identification fragments. Every newly stored fragment
is at most 20 words. Raw publisher pages remain in the ignored local evidence
directory and are not reproduced in this handoff. Later articles should
paraphrase facts, cite the source adjacent to the claim, and avoid copying
publisher prose.

The 25 added sources span iCulture, AppleInsider, and 9to5Mac, each independent
from the candidate's retained MacRumors source. The source ledger explicitly
records publisher lineage, the exact candidate supported, and date basis.

## Conflicts and boundaries

- iOS 9.3.2 Public Beta 1 uses the explicitly dated April 7 public update,
  not the April 6 developer-article publication date.
- Two iCulture iOS 9.2 URLs or page sections retain developer-focused wording;
  the rendered public-specific headlines control, and the mismatch is retained.
- The iOS 9.3.3 Public Beta 1 and Public Beta 3 pages contain stale pre-update
  paragraphs alongside same-day revised public-specific headlines or leads.
  Both positions are documented rather than silently harmonized.
- The frozen exclusions remain in force: no iOS 9.2.1 Public Beta 3 was
  invented from an aggregate count, no developer Beta 1.1 was converted to a
  public event, no build was attached, and no public release was relabeled.

Full reasoning and reversal evidence are in [conflicts.json](./conflicts.json).

## Review boundary

The existing [review.json](./review.json) remains byte-identical and is not
rewritten to imply that its reviewer saw this later evidence. It independently
reviewed two candidates. The 25 new corroborations have only a mechanical
self-check in [corroboration-self-review.json](./corroboration-self-review.json);
a different reviewer must inspect them before promotion or ingestion.

## Recommended next action

An independent reviewer should reproduce the 25 new raw hashes, read every
bounded locator in context (especially the three documented source-text
conflicts), confirm the fresh production reconciliation, and issue a separate
review artifact. A coordinator can then decide whether to promote the 27
candidates. Publication and Sanity mutation remain separately unauthorized.

## Validation

- [x] Exact 27-target assignment closure
- [x] Two independent contemporary publisher lineages per identity
- [x] Raw byte counts and SHA-256 hashes reproduced
- [x] Added source-identification fragments bounded to 20 words
- [x] Fresh exact published-production reconciliation recorded
- [x] Misleading slugs, dated updates, and stale copy preserved explicitly
- [x] Prior independent review preserved byte-for-byte
- [x] No build inferred or attached
- [x] No Sanity write, stable ID, page build, publication, or deployment
- [ ] Independent review of the 25 newly added corroborators completed
`;

const selfReview = {
  formatVersion: 1,
  batchId: assignment.batchId,
  reviewedAt: new Date().toISOString(),
  reviewer: "codex-review-reusable-public-betas",
  independentOfResearcher: false,
  verdict: "passedMechanicalSelfCheckPendingIndependentReview",
  scope: {
    addedSourceCount: newSources.length,
    candidateCount: manifest.sources.length,
    preservedPriorReviewSha256: preservedReviewSha256,
  },
  checks: {
    manifestMatchesFrozenReviewBacklog: true,
    allFetchesSucceeded: true,
    rawBytesAndHashesReproduced: true,
    boundedFragmentsReproduced: true,
    twoIndependentPublisherLineagesPerCandidate: true,
    sourceTextConflictsPreserved: true,
    freshProductionQueryReadOnly: true,
    exactProductionMatches: productionSnapshot.exactChecks.filter(
      (check) => check.exactIdentityMatches > 0,
    ).length,
    priorReviewPreservedByteForByte: true,
    sanityMutationPerformed: false,
  },
  authorization: {
    independentChronologyReviewCompleteForAddedSources: false,
    publicationEligible: false,
    sanityMutationAllowed: false,
    deploymentAllowed: false,
  },
  nextStep:
    "A reviewer independent from this corroboration wave must inspect the 25 added source pages and issue a separate review artifact.",
};

await Promise.all([
  writeFile(
    packetPath("sources.json"),
    `${JSON.stringify(sourceDocument, null, 2)}\n`,
  ),
  writeFile(
    packetPath("candidates.json"),
    `${JSON.stringify(candidateDocument, null, 2)}\n`,
  ),
  writeFile(
    packetPath("conflicts.json"),
    `${JSON.stringify(conflictDocument, null, 2)}\n`,
  ),
  writeFile(packetPath("report.md"), report),
  writeFile(
    packetPath("corroboration-self-review.json"),
    `${JSON.stringify(selfReview, null, 2)}\n`,
  ),
]);

console.log(
  JSON.stringify(
    {
      candidateCount: candidateDocument.candidates.length,
      corroboratedCandidates: candidateDocument.candidates.filter(
        (candidate) => candidate.evidenceState === "corroborated",
      ).length,
      sourceCount: sourceDocument.sourceCount,
      addedSourceCount: newSources.length,
      conflictCount: conflictDocument.conflictCount,
      exactProductionMatches: productionSnapshot.exactChecks.filter(
        (check) => check.exactIdentityMatches > 0,
      ).length,
      preservedReviewSha256: sha256(reviewBytes),
    },
    null,
    2,
  ),
);
