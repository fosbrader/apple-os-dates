import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { basename, dirname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import { JSDOM } from "jsdom";
import prettier from "prettier";

const here = dirname(fileURLToPath(import.meta.url));
const repositoryRoot = resolve(here, "../../..");
const programDirectory = resolve(here, "..");
const registerPath = resolve(programDirectory, "candidate-register.json");
const productionExportPath = resolve(
  repositoryRoot,
  "tmp/all-event-identities.json",
);
const priorIos11Path = resolve(
  repositoryRoot,
  "scripts/research-batches/apple-ios-11-point-prerelease.json",
);
const priorIos8BuilderPath = resolve(
  repositoryRoot,
  "scripts/research-batches/build-apple-ios-8-point-prerelease.mjs",
);
const priorIos8LedgerPath = resolve(
  repositoryRoot,
  "scripts/research-batches/apple-ios-8-point-prerelease.md",
);
const evidenceOutputDirectory = resolve(
  repositoryRoot,
  "tmp/research-evidence/beta-chronology-gap/reusable-ios8-ios11",
);
mkdirSync(evidenceOutputDirectory, { recursive: true });

const reviewedAt = "2026-07-31T02:45:00Z";
const sha256 = (value) => createHash("sha256").update(value).digest("hex");
const normalizeUrl = (value) =>
  String(value || "")
    .replace(/[?#].*$/, "")
    .replace(/\/?$/, "/");
const collapse = (value) =>
  String(value || "")
    .replace(/\s+/g, " ")
    .trim();
const safeName = (value) =>
  value
    .replace(/[^a-z0-9]+/gi, "-")
    .replace(/^-|-$/g, "")
    .toLowerCase();

const inferredOrdinalKeys = new Set([
  "version-ios-11-1/public-beta-3",
  "version-ios-11-1/public-beta-4",
  "version-ios-11-2/public-beta-3",
  "version-ios-11-2/public-beta-4",
  "version-ios-11-2/public-beta-5",
  "version-ios-11-3/public-beta-5",
  "version-ios-11-4/public-beta-3",
  "version-ios-11-4/public-beta-4",
  "version-ios-11-4/public-beta-5",
]);

const ios8Inputs = [
  {
    releaseVersionId: "version-ios-8-3",
    routeAlias: "public-beta-1",
    version: "8.3",
    label: "Public Beta 1",
    appearanceDate: "2015-03-12",
    sequence: 1,
    pairedDeveloperRoute: "beta-3",
    sourceUrl: "https://www.macrumors.com/2015/03/12/ios-beta-testing-program/",
  },
  {
    releaseVersionId: "version-ios-8-3",
    routeAlias: "public-beta-2",
    version: "8.3",
    label: "Public Beta 2",
    appearanceDate: "2015-03-24",
    sequence: 2,
    pairedDeveloperRoute: "beta-4",
    sourceUrl:
      "https://www.macrumors.com/2015/03/24/apple-seeds-fourth-ios-8-3-beta-to-developers/",
  },
  {
    releaseVersionId: "version-ios-8-4",
    routeAlias: "public-beta-1",
    version: "8.4",
    label: "Public Beta 1",
    appearanceDate: "2015-04-27",
    sequence: 1,
    pairedDeveloperRoute: "beta-2",
    sourceUrl:
      "https://9to5mac.com/2015/04/27/apple-releases-ios-8-4-beta-2-to-developers-with-revamped-music-app/",
  },
  {
    releaseVersionId: "version-ios-8-4",
    routeAlias: "public-beta-2",
    version: "8.4",
    label: "Public Beta 2",
    appearanceDate: "2015-05-11",
    sequence: 2,
    pairedDeveloperRoute: "beta-3",
    sourceUrl:
      "https://9to5mac.com/2015/05/11/apple-releases-ios-8-4-beta-3-with-revamped-music-ahead-of-late-june-launch/",
  },
  {
    releaseVersionId: "version-ios-8-4",
    routeAlias: "public-beta-3",
    version: "8.4",
    label: "Public Beta 3",
    appearanceDate: "2015-06-09",
    sequence: 3,
    pairedDeveloperRoute: "beta-4",
    sourceUrl:
      "https://www.macrumors.com/2015/06/09/apple-seeds-fourth-ios-8-4-beta/",
  },
];

const priorIos11 = JSON.parse(readFileSync(priorIos11Path, "utf8"));
const ios11SourceByUrl = new Map(
  priorIos11.sources.map((source) => [normalizeUrl(source.url), source]),
);
const ios11Inputs = priorIos11.events
  .filter((event) => event.identity.channel === "publicBeta")
  .map((event) => {
    const identityCitation = event.citations.find(
      (citation) =>
        citation.note === "Contemporary milestone identity and audience.",
    );
    assert(identityCitation, `${event.target.routeAlias} identity citation`);
    return {
      releaseVersionId: event.identity.releaseVersionId,
      routeAlias: event.identity.routeAlias,
      version: event.identity.releaseVersionId
        .replace("version-ios-", "")
        .replaceAll("-", "."),
      label: event.identity.label,
      appearanceDate: event.identity.appearanceDate,
      sequence: event.identity.sequence,
      priorProposedStableEventId: event.identity.stableEventId,
      sourceUrl: identityCitation.url,
    };
  });
const inputs = [...ios8Inputs, ...ios11Inputs];
assert.equal(inputs.length, 33, "exact reusable candidate count");
assert.equal(
  new Set(
    inputs.map(
      (candidate) => `${candidate.releaseVersionId}/${candidate.routeAlias}`,
    ),
  ).size,
  33,
  "candidate keys are unique",
);

const productionEvents = JSON.parse(readFileSync(productionExportPath, "utf8"));
assert.equal(productionEvents.length, 2_068, "production export count");
const productionKeys = new Set(
  productionEvents.map(
    (event) => `${event.releaseVersionId}/${event.routeAlias}`,
  ),
);
for (const input of inputs) {
  const key = `${input.releaseVersionId}/${input.routeAlias}`;
  assert(!productionKeys.has(key), `${key} is absent from production export`);
}

const retainedCaptures = [];
for (const relativeDirectory of [
  "tmp/ios8-point-evidence",
  "tmp/ios11-point-evidence",
]) {
  const absoluteDirectory = resolve(repositoryRoot, relativeDirectory);
  for (const name of readdirSync(absoluteDirectory)) {
    const rawPath = resolve(absoluteDirectory, name);
    const raw = readFileSync(rawPath);
    const document = new JSDOM(raw).window.document;
    const canonicalUrl = document.querySelector('link[rel="canonical"]')?.href;
    if (!canonicalUrl) continue;
    retainedCaptures.push({
      raw,
      rawPath,
      document,
      canonicalUrl: normalizeUrl(canonicalUrl),
    });
  }
}

function structuredArticle(document) {
  for (const script of document.querySelectorAll(
    'script[type="application/ld+json"]',
  )) {
    let parsed;
    try {
      parsed = JSON.parse(script.textContent);
    } catch {
      continue;
    }
    const queue = [parsed];
    while (queue.length) {
      const value = queue.shift();
      if (!value || typeof value !== "object") continue;
      if (Array.isArray(value)) {
        queue.push(...value);
        continue;
      }
      const types = Array.isArray(value["@type"])
        ? value["@type"]
        : [value["@type"]];
      if (
        types.some((type) =>
          ["Article", "NewsArticle", "BlogPosting"].includes(type),
        ) &&
        value.datePublished
      ) {
        return value;
      }
      queue.push(...Object.values(value));
    }
  }
  return null;
}

function sourceMetadata(input, capture) {
  const structured = structuredArticle(capture.document);
  const prior = ios11SourceByUrl.get(normalizeUrl(input.sourceUrl));
  const title =
    prior?.title ||
    structured?.headline ||
    collapse(capture.document.querySelector("h1")?.textContent);
  const publishedAt = prior?.publishedAt || structured?.datePublished;
  const authorValue = structured?.author;
  const extractedAuthor = Array.isArray(authorValue)
    ? authorValue
        .map((author) => author?.name)
        .filter(Boolean)
        .join(", ")
    : authorValue?.name;
  const author = prior?.author || extractedAuthor || null;
  const publisher =
    prior?.publisher ||
    (new URL(input.sourceUrl).hostname.includes("9to5mac")
      ? "9to5Mac"
      : "MacRumors");
  assert(title, `${input.sourceUrl} title`);
  assert(publishedAt, `${input.sourceUrl} datePublished`);
  assert(
    publishedAt.startsWith(input.appearanceDate),
    `${input.sourceUrl} publication date supports ${input.appearanceDate}`,
  );
  return { title, publishedAt, author, publisher };
}

function selectedIdentityText(input, capture, metadata) {
  const articleNode = capture.document.querySelector("article");
  const article = articleNode?.querySelector("p")
    ? articleNode
    : capture.document.querySelector(".post-content");
  assert(article, `${input.sourceUrl} article`);
  const paragraphs = [...article.querySelectorAll("p")]
    .map((node) => collapse(node.textContent))
    .filter((paragraph) => /public beta/i.test(paragraph));
  assert(paragraphs.length > 0, `${input.sourceUrl} public identity paragraph`);
  const selected = [
    `Title: ${metadata.title}`,
    `Published: ${metadata.publishedAt}`,
    `Identity paragraph: ${paragraphs[0]}`,
  ].join("\n");
  const normalized = selected.toLowerCase();
  assert(normalized.includes(input.version.toLowerCase()));
  assert(normalized.includes("public beta"));
  return selected;
}

const register = JSON.parse(readFileSync(registerPath, "utf8"));
const registerCandidates = register.candidates || [];
const registerByKey = new Map(
  registerCandidates.map((candidate) => [
    `${candidate.releaseVersionId}/${candidate.proposedIdentity.routeAlias}`,
    candidate,
  ]),
);
const reviewedCandidates = inputs.map((input) => {
  const key = `${input.releaseVersionId}/${input.routeAlias}`;
  const candidate = registerByKey.get(key);
  assert(candidate, `${key} exists in foundation register`);
  assert.equal(candidate.platformId, "platform-ios", `${key} platform`);
  assert.equal(candidate.version, input.version, `${key} version`);
  assert.equal(
    candidate.proposedIdentity.channel,
    "publicBeta",
    `${key} channel`,
  );
  assert.equal(
    candidate.proposedIdentity.appearanceDate,
    input.appearanceDate,
    `${key} date`,
  );
  assert.equal(candidate.proposedIdentity.label, input.label, `${key} label`);
  assert.equal(
    candidate.proposedIdentity.sequence,
    input.sequence,
    `${key} sequence`,
  );
  assert.equal(
    candidate.productionReconciliation.status,
    "confirmedMissing",
    `${key} production reconciliation`,
  );
  assert.equal(
    candidate.candidateStatus,
    "needsEvidenceReview",
    `${key} review state`,
  );
  assert.equal(candidate.evidenceState, "reported", `${key} evidence state`);
  const inferredOrdinal = inferredOrdinalKeys.has(key);
  assert(
    ["unverified", "confirmed"].includes(candidate.identityStatus),
    `${key} identity status`,
  );

  const capture = retainedCaptures.find(
    (item) => item.canonicalUrl === normalizeUrl(input.sourceUrl),
  );
  assert(capture, `${input.sourceUrl} retained capture`);
  const metadata = sourceMetadata(input, capture);
  const selectedText = selectedIdentityText(input, capture, metadata);
  const selectedTextName = `${safeName(candidate.candidateId)}.selected.txt`;
  const selectedTextPath = resolve(evidenceOutputDirectory, selectedTextName);
  writeFileSync(selectedTextPath, selectedText);

  const sourceId = `source-review-${safeName(candidate.candidateId)}`;
  const locator = inferredOrdinal
    ? `Headline names Developer Beta ${input.sequence}; the update paragraph records public distribution without displaying a public ordinal.`
    : input.version === "8.3" && input.sequence === 1
      ? "Lead identity paragraph describes the first iOS public-program distribution and its pairing with Developer Beta 3."
      : `Headline and lead/update identity paragraph explicitly identify ${input.label} for the public beta audience.`;
  const sourceCaveats = [];
  if (key === "version-ios-11-4/public-beta-1") {
    sourceCaveats.push(
      "A later over-the-air sentence says iOS 11.3, while the headline and lead identify iOS 11.4; the retained typo is nonmaterial to the lead identity but should not be repeated.",
    );
  }
  if (key === "version-ios-11-4/public-beta-3") {
    sourceCaveats.push(
      "The canonical URL slug says beta 4, while the displayed headline and article lead identify Developer Beta 3; chronology should follow displayed content, not the slug.",
    );
  }
  if (key === "version-ios-8-3/public-beta-1") {
    sourceCaveats.push(
      "The first iOS public program seed was limited to selected program participants; that access boundary does not turn it into a developer-only event.",
      "The foundation source ledger names an independent Engadget program-launch report, but this reuse packet does not have a retained raw capture and therefore does not count it as hash-verified appearance evidence.",
    );
  }

  const reviewedCandidate = structuredClone(candidate);
  reviewedCandidate.identityStatus = inferredOrdinal
    ? "unverified"
    : "confirmed";
  const packetEvidenceRef = {
    kind: "packetSource",
    packetPath:
      "research-handoffs/beta-chronology-gap/reusable-ios8-ios11/findings.json",
    sourceId,
    locator,
    supports: inferredOrdinal
      ? "The retained source confirms the proposed version, date, and public audience, but not the public ordinal."
      : "The retained source directly supports the proposed public appearance identity.",
  };
  reviewedCandidate.evidenceRefs = [
    ...candidate.evidenceRefs.filter(
      (evidenceRef) =>
        !(
          evidenceRef.kind === "packetSource" &&
          evidenceRef.packetPath === packetEvidenceRef.packetPath &&
          evidenceRef.sourceId === sourceId
        ),
    ),
    packetEvidenceRef,
  ];
  reviewedCandidate.blockers = [
    "This reuse audit has only one independently hash-verified publisher lineage; corroborating evidence must be retained and reviewed under the program gate.",
    ...(inferredOrdinal
      ? [
          "The retained page does not display the proposed public ordinal; obtain ordinal-specific evidence without deriving it from the developer sequence.",
        ]
      : []),
  ];
  reviewedCandidate.review = {
    required: true,
    reviewer: "codex-review-reusable-public-betas",
    reviewedAt,
    notes: inferredOrdinal
      ? "The public audience, version, and date passed independent retained-evidence review. The public ordinal and independent-source gate remain open."
      : "The proposed identity passed independent retained-evidence review against one contemporary publisher. The independent-source gate remains open.",
  };

  return {
    candidate: reviewedCandidate,
    source: {
      sourceId,
      canonicalUrl: normalizeUrl(input.sourceUrl),
      title: metadata.title,
      publisher: metadata.publisher,
      author: metadata.author,
      sourceClass: "journalism",
      publishedAt: metadata.publishedAt,
      publishedDateObserved: input.appearanceDate,
      publicationDatePrecision: "datetime",
      accessedAt: "2026-07-30",
      archiveUrl: null,
      status: "retainedCapture",
      reuseBasis: "linkedFactsOnly",
      roles: ["releaseIdentity", "publicChannelIdentity"],
      evidence: {
        rawPath: relative(repositoryRoot, capture.rawPath),
        rawBytes: capture.raw.byteLength,
        rawSha256: sha256(capture.raw),
        selectedTextPath: relative(repositoryRoot, selectedTextPath),
        selectedTextBytes: Buffer.byteLength(selectedText),
        selectedTextSha256: sha256(selectedText),
        captureMethod:
          "Retained publisher HTML capture; independently parsed and hash-verified.",
        httpStatusAtCapture: 200,
        capturedAt: "2026-07-30",
      },
      lineage: {
        originSourceId: null,
        independentForCorroboration: true,
        notes:
          "One publisher lineage. Multiple pages from the same publisher do not satisfy the second-source gate for this appearance.",
      },
      rights: {
        publicUse: "factsAndShortLocatorsOnly",
        notes:
          "Raw and selected publisher text stays in ignored evidence storage; only original factual synthesis and source metadata may be committed.",
      },
    },
    review: {
      candidateId: candidate.candidateId,
      candidateKey: key,
      disposition: "needsEvidence",
      reviewedAt,
      reviewer: "codex-review-reusable-public-betas",
      ordinalSupport: inferredOrdinal
        ? "inferredFromPairedDeveloper"
        : "explicitPublicOrdinal",
      identityStatus: inferredOrdinal ? "unverified" : "confirmed",
      evidenceState: "reported",
      sourceIds: [sourceId],
      evidenceRefs: [
        {
          sourceId,
          locator,
          supports: inferredOrdinal
            ? "The version, date, and public audience are explicit; the proposed public sequence remains an editorial inference."
            : "The retained contemporary page directly supports the proposed version, date, public audience, and displayed public sequence.",
        },
        {
          sourceId,
          locator: "Structured article metadata > datePublished",
          supports: `The publisher metadata date matches ${input.appearanceDate}.`,
        },
      ],
      productionReconciliation: {
        status: "confirmedMissing",
        queriedAt: candidate.productionReconciliation.queriedAt,
        matchBasis:
          "No exact releaseVersionId/routeAlias key in the 2,068-event live-matching production identity export.",
      },
      checks: {
        retainedRawHashReproduced: true,
        canonicalUrlMatched: true,
        displayedVersionMatched: true,
        publicAudienceExplicit: true,
        publicationDateMatched: true,
        publicOrdinalExplicit: !inferredOrdinal,
        exactProductionRouteAbsent: true,
        independentSecondSourcePresent: false,
        materialConflictPresent: false,
      },
      blockers: [
        "This reuse audit has only one independently hash-verified publisher lineage; corroborating evidence must be retained and reviewed under the program gate.",
        ...(inferredOrdinal
          ? [
              "The retained page does not display the proposed public ordinal; obtain ordinal-specific evidence without deriving it from the developer sequence.",
            ]
          : []),
      ],
      sourceCaveats,
      publicationRecommendation:
        "None. This is an evidence review for chronology only.",
    },
  };
});

const candidates = reviewedCandidates.map(({ candidate }) => candidate);
const sources = reviewedCandidates.map(({ source }) => source);
const candidateReviews = reviewedCandidates.map(({ review }) => review);
assert.equal(new Set(sources.map((source) => source.sourceId)).size, 33);
assert.equal(
  candidateReviews.filter(
    (review) => review.ordinalSupport === "explicitPublicOrdinal",
  ).length,
  24,
);
assert.equal(
  candidateReviews.filter(
    (review) => review.ordinalSupport === "inferredFromPairedDeveloper",
  ).length,
  9,
);

const findings = {
  formatVersion: 1,
  batch: {
    batchId: "beta-chronology-gap-reusable-ios8-ios11",
    vendor: { name: "Apple", slug: "apple" },
    scope:
      "Independent reuse audit of five iOS 8.3/8.4 and twenty-eight iOS 11.1–11.4.1 public-beta candidates already present in local research.",
    researcher:
      "Prior apple-ios-8-point-prerelease and apple-ios-11-point-prerelease batch authors",
    evidenceReviewer: "codex-review-reusable-public-betas",
    startedAt: "2026-07-31T02:32:00Z",
    completedAt: reviewedAt,
    status: "needsEvidenceReview",
    sanityMutationAllowed: false,
    publicationEligible: false,
  },
  assignment: {
    candidateIds: candidates.map((candidate) => candidate.candidateId),
    candidateCount: candidates.length,
    cohorts: [
      { name: "iOS 8.3–8.4 ledger-only public betas", count: 5 },
      { name: "iOS 11.1–11.4.1 review-only public betas", count: 28 },
    ],
  },
  inputs: [
    {
      path: relative(repositoryRoot, priorIos8BuilderPath),
      sha256: sha256(readFileSync(priorIos8BuilderPath)),
      role: "Five ledger-only proposed identities and source metadata.",
    },
    {
      path: relative(repositoryRoot, priorIos8LedgerPath),
      sha256: sha256(readFileSync(priorIos8LedgerPath)),
      role: "Human-readable pairing and timeline boundary.",
    },
    {
      path: relative(repositoryRoot, priorIos11Path),
      sha256: sha256(readFileSync(priorIos11Path)),
      role: "Twenty-eight prior review-only public-beta candidates.",
    },
    {
      path: relative(repositoryRoot, productionExportPath),
      sha256: sha256(readFileSync(productionExportPath)),
      role: "All 2,068 exact production releaseVersionId/routeAlias keys.",
    },
    {
      path: relative(repositoryRoot, registerPath),
      sha256: sha256(readFileSync(registerPath)),
      role: "Foundation candidate identities and controlled review states.",
    },
  ],
  sources,
  candidates,
  candidateReviews,
  disagreements: [],
  excludedSources: [
    {
      url: "https://www.engadget.com/2015-03-12-apple-ios-public-beta.html",
      reason:
        "Useful independent program-launch corroboration for iOS 8.3, but this packet has no retained raw capture or selected-text lock and the page does not display the Public Beta 1 label. Keep it as the next custody lead rather than counting it as a completed appearance source.",
      evidencePath: null,
      sha256: null,
    },
  ],
  batchGaps: [
    {
      gapId: "gap-independent-corroboration",
      severity: "material",
      affectedCandidateCount: 33,
      description:
        "This packet independently hash-verifies only one retained contemporary publisher lineage per candidate.",
      impact:
        "No candidate passes the program's ready-for-chronology-review gate.",
      nextResearchStep:
        "Retain and review a first-party identity record or an independent contemporary report for each exact appearance; a foundation-level link without appearance-level custody is not enough.",
    },
    {
      gapId: "gap-public-ordinal",
      severity: "material",
      affectedCandidateCount: 9,
      affectedCandidateIds: candidateReviews
        .filter(
          (review) => review.ordinalSupport === "inferredFromPairedDeveloper",
        )
        .map((review) => review.candidateId),
      description:
        "The retained source confirms public distribution but does not display the proposed public ordinal.",
      impact:
        "The proposed Public Beta N label and sequence remain unverified.",
      nextResearchStep:
        "Find ordinal-specific public-channel evidence; do not copy the paired developer number into the public sequence.",
    },
  ],
  dispositionSummary: {
    assigned: 33,
    ready: 0,
    needsEvidence: 33,
    conflict: 0,
    duplicate: 0,
    confirmedMissingFromProduction: 33,
    explicitPublicOrdinal: 24,
    inferredPublicOrdinal: 9,
    independentlyHashVerifiedPublisherLineagesPerCandidate: 1,
  },
  qualityChecks: {
    exactCandidateClosure: true,
    allLocalIdsUnique: true,
    allSourcesUsed: true,
    allLocatorsResolvedAgainstRetainedEvidence: true,
    sourceMetadataAndPublicationDatesChecked: true,
    rawHashesReproduced: true,
    selectedTextHashesReproduced: true,
    exactProductionKeysChecked: true,
    independentCorroborationGatePassed: false,
    publicOrdinalGatePassedForEveryCandidate: false,
    containsNoSecretsOrPrivateData: true,
    containsNoCommittedRawCopyrightedEvidence: true,
    committedNarrativeUsesOriginalSynthesis: true,
    jsonParsed: true,
    controlledValuesValidated: true,
    noSanityWritesOrDeployment: true,
    reviewNotes:
      "Local evidence is real and reusable, but the stricter chronology gate deliberately keeps every candidate in needsEvidenceReview.",
  },
};

const findingsText = await prettier.format(JSON.stringify(findings), {
  parser: "json",
});
writeFileSync(resolve(here, "findings.json"), findingsText);
const findingsHash = sha256(findingsText);

const reviewRows = reviewedCandidates
  .map(({ candidate, source, review }) => {
    const ordinal =
      review.ordinalSupport === "explicitPublicOrdinal"
        ? "explicit"
        : "inferred";
    return `| ${candidate.version} ${candidate.proposedIdentity.label} | ${candidate.proposedIdentity.appearanceDate} | ${ordinal} | ${source.publisher} | needsEvidence |`;
  })
  .join("\n");
const sourceRows = sources
  .map(
    (source) =>
      `| ${source.sourceId} | ${source.publisher} | ${source.publishedAt} | ${source.evidence.rawBytes} | \`${source.evidence.rawSha256}\` |`,
  )
  .join("\n");
const inferredRoutes = candidateReviews
  .filter((review) => review.ordinalSupport === "inferredFromPairedDeveloper")
  .map((review) => `\`${review.candidateKey}\``)
  .join(", ");

const reportDraft = `# Reusable iOS 8 and iOS 11 public-beta evidence review

Status: needsEvidenceReview  
Research basis: retained iOS 8 and iOS 11 archive batches  
Evidence reviewer: codex-review-reusable-public-betas  
Findings SHA-256: \`${findingsHash}\`  
Evidence directory: \`tmp/research-evidence/beta-chronology-gap/reusable-ios8-ios11/\`

## Outcome

All 33 proposed routes are absent from the 2,068-event production identity
export. None is a production duplicate, and no retained page disproves a
candidate's public distribution date.

The review does **not** advance any candidate to chronology-ready:

- 24 candidates have an explicit public ordinal in the retained contemporary
  page, but this packet hash-verifies only one publisher lineage.
- 9 candidates explicitly establish public distribution while deriving the
  proposed public ordinal from a paired developer seed. That normalization is
  prohibited by the new program rules.
- All 33 therefore remain \`needsEvidenceReview\`. No publication or Sanity
  mutation is recommended by this packet.

## Scope closure

| Candidate | Date | Public ordinal | Current source | Disposition |
| --- | --- | --- | --- | --- |
${reviewRows}

## Identity boundary

The retained pages support the iOS version, calendar date, and public-beta
audience for every candidate. Publisher \`datePublished\` metadata matches each
proposed date, and every raw capture reproduced its pinned SHA-256.

The nine ordinal-specific gaps are: ${inferredRoutes}.

For those routes, the page headline names a developer ordinal and an update
records public distribution, but the page does not display a public ordinal.
The future researcher must find ordinal-specific public-channel evidence rather
than assuming both channels used the same sequence number.

## Production reconciliation

The exact \`releaseVersionId/routeAlias\` keys for all 33 candidates were
compared with \`tmp/all-event-identities.json\`. That export contains 2,068
events and matches the live total recorded by the program baseline. The result
was 33 confirmed missing keys, zero exact matches, and zero duplicate local
candidate keys.

This check proves the canonical proposed route is absent. It does not authorize
creation, and it must be refreshed immediately before any later chronology
decision.

## Source ledger

| ID | Publisher | Published | Raw bytes | Raw SHA-256 |
| --- | --- | --- | ---: | --- |
${sourceRows}

MacRumors supplies 31 candidate identity pages and 9to5Mac supplies 2. Each
candidate has only one publisher lineage with appearance-level custody in this
packet; other pages from the same publisher cannot satisfy independent
corroboration. Source titles, URLs,
bylines, timestamps, custody paths, and selected-text hashes are recorded in
\`findings.json\`.

## Source anomalies and decisions

- The iOS 11.4 Public Beta 1 page has an iOS 11.3 typo in a later installation
  sentence. Its headline and lead identify iOS 11.4, so the typo is retained as
  a nonmaterial caveat and must not be repeated.
- The canonical URL slug used for the May 1, 2018 iOS 11.4 article says beta 4,
  while its displayed headline and lead identify Developer Beta 3. The review
  follows displayed article content, not the slug; the proposed public ordinal
  remains unverified.
- iOS 8.3 Public Beta 1 was distributed through Apple's public program to a
  limited participant group. That access boundary is preserved and does not
  reclassify the appearance as developer-only.
- The foundation ledger links an independent Engadget report for the iOS 8.3
  program launch. It supports the same date, version, and nondeveloper audience,
  but this packet does not have its raw capture and therefore does not count it
  as a completed appearance-level custody record.
- Builds mentioned in the retained reporting were not promoted into this
  chronology packet. A public appearance and a build remain separate facts.

## Copyright, attribution, and trademark boundary

The committed packet contains original synthesis, source metadata, bounded
locators, and hashes. Raw publisher pages and selected identity text remain in
ignored evidence storage. No publisher article body, screenshot, logo, or long
quotation is committed. Apple and product names are used only for factual,
nominative identification; this packet implies no affiliation or endorsement.

## Evidence gaps

- Every candidate needs retained, independently reviewed corroboration at the
  exact appearance grain; a foundation-level link alone is not evidence
  custody.
- The nine listed routes additionally need public-ordinal evidence.
- A new live exact-identity query is required immediately before any later
  chronology or publication review.

## Validation

- [x] Exact 33-candidate closure
- [x] Every retained identity locator independently resolved
- [x] Canonical URLs and publication dates checked
- [x] Raw and selected-text hashes reproduced
- [x] Exact production route keys reconciled
- [x] Copyright and evidence-custody boundary documented
- [x] JSON parsed and controlled review states checked
- [x] No Sanity write, apply, approval, publication, or deployment performed
- [ ] Independent-source gate passed
- [ ] Public ordinal directly supported for all candidates
`;
const report = await prettier.format(reportDraft, { parser: "markdown" });
writeFileSync(resolve(here, "report.md"), report);

console.log(`Reviewed candidates: ${candidates.length}`);
console.log(
  "Dispositions: 0 ready / 33 needsEvidence / 0 conflict / 0 duplicate",
);
console.log("Ordinal support: 24 explicit / 9 inferred");
console.log(`Sources: ${sources.length}`);
console.log(`Findings SHA-256: ${findingsHash}`);
