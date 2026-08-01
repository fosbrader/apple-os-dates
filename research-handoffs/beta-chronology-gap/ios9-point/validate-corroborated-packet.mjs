import assert from "node:assert/strict";
import {createHash} from "node:crypto";
import {readFile, writeFile} from "node:fs/promises";
import path from "node:path";
import {fileURLToPath} from "node:url";
import {JSDOM} from "jsdom";

const here = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(here, "../../../");
const sha256 = (value) =>
  createHash("sha256").update(value).digest("hex");
const collapse = (value) =>
  String(value ?? "")
    .replace(/\s+/g, " ")
    .trim();
const words = (value) =>
  collapse(value)
    .split(" ")
    .filter(Boolean);
const load = async (name) =>
  JSON.parse(await readFile(path.join(here, name), "utf8"));

const [
  assignment,
  candidatesDocument,
  sourcesDocument,
  conflictsDocument,
  review,
  selfReview,
  productionSnapshot,
  manifest,
] = await Promise.all([
  load("assignment.json"),
  load("candidates.json"),
  load("sources.json"),
  load("conflicts.json"),
  load("review.json"),
  load("corroboration-self-review.json"),
  load("production-snapshot.json"),
  load("corroboration-fetch-manifest.json"),
]);
const report = await readFile(path.join(here, "report.md"), "utf8");

assert.equal(assignment.batchId, "beta-chronology-gap-ios9-point");
assert.equal(assignment.targetCount, 27);
assert.equal(candidatesDocument.candidateCount, 27);
assert.equal(candidatesDocument.candidates.length, 27);
assert.equal(sourcesDocument.sourceCount, 56);
assert.equal(sourcesDocument.sources.length, 56);
assert.equal(conflictsDocument.conflictCount, 7);
assert.equal(conflictsDocument.conflicts.length, 7);
assert.equal(manifest.sources.length, 25);

const sourceIds = sourcesDocument.sources.map((source) => source.sourceId);
assert.equal(new Set(sourceIds).size, sourceIds.length, "unique source IDs");
const sourceById = new Map(
  sourcesDocument.sources.map((source) => [source.sourceId, source]),
);
const candidateIds = candidatesDocument.candidates.map(
  (candidate) => candidate.candidateId,
);
assert.equal(
  new Set(candidateIds).size,
  candidateIds.length,
  "unique candidate IDs",
);
assert.deepEqual(
  new Set(candidateIds),
  new Set(assignment.targets.map((target) => target.candidateId)),
  "assignment-to-candidate closure",
);

let evidenceReferencesResolved = 0;
let rawSourcesVerified = 0;
let legacySelectedTextVerified = 0;
let boundedFragmentsVerified = 0;
const publisherLineagesByCandidate = {};

for (const source of sourcesDocument.sources) {
  const rawPath = path.join(repoRoot, source.evidence.rawPath);
  const raw = await readFile(rawPath);
  assert.equal(
    raw.byteLength,
    source.evidence.rawBytes,
    `${source.sourceId} raw byte count`,
  );
  assert.equal(
    sha256(raw),
    source.evidence.rawSha256,
    `${source.sourceId} raw SHA-256`,
  );
  rawSourcesVerified += 1;

  const document = new JSDOM(raw.toString("utf8")).window.document;
  if (source.evidence.selectedSelector) {
    const selected = document.querySelector(source.evidence.selectedSelector);
    assert(selected, `${source.sourceId} selected selector resolves`);
    const selectedText = collapse(selected.textContent);
    assert.equal(
      Buffer.byteLength(selectedText),
      source.evidence.selectedTextBytes,
      `${source.sourceId} selected text bytes`,
    );
    assert.equal(
      sha256(selectedText),
      source.evidence.selectedTextSha256,
      `${source.sourceId} selected text SHA-256`,
    );
    legacySelectedTextVerified += 1;
  }

  const fragments = source.evidence.selectedTextFragments;
  if (fragments) {
    assert(
      fragments.length >= 1 && fragments.length <= 2,
      `${source.sourceId} bounded fragment count`,
    );
    const corpus = collapse(
      [
        document.querySelector("h1")?.textContent,
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
    for (const fragment of fragments) {
      assert(words(fragment.text).length <= 20, `${source.sourceId} <=20 words`);
      assert.equal(
        fragment.wordCount,
        words(fragment.text).length,
        `${source.sourceId} word count`,
      );
      assert.equal(
        fragment.bytes,
        Buffer.byteLength(fragment.text),
        `${source.sourceId} fragment bytes`,
      );
      assert.equal(
        fragment.sha256,
        sha256(fragment.text),
        `${source.sourceId} fragment SHA-256`,
      );
      assert(
        corpus.includes(fragment.text),
        `${source.sourceId} fragment reproduced in retained source`,
      );
      boundedFragmentsVerified += 1;
    }
  }
}

const manifestCandidateIds = manifest.sources.map(
  (source) => source.candidateId,
);
assert.equal(
  new Set(manifestCandidateIds).size,
  25,
  "one new corroborator per backlog candidate",
);
assert.deepEqual(
  new Set(manifestCandidateIds),
  new Set(review.candidateVerdict.needsSecondPublisherLineage),
  "corroboration manifest exactly closes frozen review backlog",
);

const exactCheckByCandidate = new Map(
  productionSnapshot.exactChecks.map((check) => [check.candidateId, check]),
);
const developerCheckByCandidate = new Map(
  productionSnapshot.developerRouteChecks.map((check) => [
    check.candidateId,
    check,
  ]),
);

for (const candidate of candidatesDocument.candidates) {
  assert.equal(candidate.platform, "iOS");
  assert.equal(candidate.proposedIdentity.channel, "publicBeta");
  assert.match(
    candidate.proposedIdentity.routeAlias,
    /^public-beta-[1-7]$/,
  );
  assert.equal(candidate.evidenceState, "corroborated");
  assert.equal(candidate.identityStatus, "confirmed");
  assert.equal(candidate.candidateStatus, "needsEvidenceReview");
  assert.equal(candidate.flags.sanityMutationAllowed, false);
  assert.equal(candidate.flags.publicationEligible, false);
  assert.equal(candidate.buildEvidenceStatus, "absent");
  assert(!("stableEventId" in candidate), "no stable event ID assigned");

  const lineages = new Set();
  for (const reference of candidate.evidenceRefs) {
    const source = sourceById.get(reference.sourceId);
    assert(source, `${candidate.candidateId} evidence reference resolves`);
    lineages.add(source.lineage.publisherFamily);
    evidenceReferencesResolved += 1;
  }
  assert(
    lineages.size >= 2,
    `${candidate.candidateId} has two publisher lineages`,
  );
  publisherLineagesByCandidate[candidate.candidateId] = [...lineages];

  const exactCheck = exactCheckByCandidate.get(candidate.candidateId);
  assert(exactCheck, `${candidate.candidateId} has a production exact check`);
  assert.equal(exactCheck.exactIdentityMatches, 0);
  assert.equal(candidate.productionReconciliation.status, "confirmedMissing");
  assert.equal(
    candidate.productionReconciliation.queriedAt,
    productionSnapshot.capturedAt,
  );
  assert.equal(candidate.productionReconciliation.exactIdentityMatches, 0);

  const developerCheck = developerCheckByCandidate.get(candidate.candidateId);
  assert(developerCheck, `${candidate.candidateId} has a developer route check`);
  assert.equal(
    candidate.pairedDeveloperProductionState,
    developerCheck.exactIdentityMatches > 0
      ? "exactExistingMatch"
      : "confirmedMissingFromPublishedCorpus",
  );
}

assert.equal(
  productionSnapshot.expectedIdentityCount,
  27,
  "production target closure",
);
assert.equal(
  productionSnapshot.productionCounts.scopedPublicBetaEvents,
  0,
);
assert.equal(productionSnapshot.safety.queryOnly, true);
assert.equal(productionSnapshot.safety.sanityMutationPerformed, false);
assert.equal(
  productionSnapshot.exactChecks.filter(
    (check) => check.exactIdentityMatches > 0,
  ).length,
  0,
);

for (const conflict of conflictsDocument.conflicts) {
  for (const position of conflict.positions) {
    for (const sourceId of position.sources) {
      assert(sourceById.has(sourceId), `${conflict.conflictId}: ${sourceId}`);
    }
  }
}
for (const requiredConflictId of [
  "ios92-iculture-slug-and-copy-audience-mismatch",
  "ios932-public-beta-1-dated-update-boundary",
  "ios933-iculture-stale-pre-update-copy",
]) {
  assert(
    conflictsDocument.conflicts.some(
      (conflict) => conflict.conflictId === requiredConflictId,
    ),
    `${requiredConflictId} preserved`,
  );
}

const preservedReviewBytes = await readFile(path.join(here, "review.json"));
assert.equal(
  sha256(preservedReviewBytes),
  "c31165ca8df49d75c475b78b7fabefa415d04885b0ec98a1abc08cfc69f7779b",
  "prior independent review preserved byte-for-byte",
);
assert.equal(review.independentOfResearcher, true);
assert.equal(selfReview.independentOfResearcher, false);
assert.equal(
  selfReview.authorization.independentChronologyReviewCompleteForAddedSources,
  false,
);
assert(report.includes("short source-identification fragments"));
assert(report.includes("No Sanity mutation"));

const lockNames = [
  "assignment.json",
  "sources.json",
  "candidates.json",
  "conflicts.json",
  "production-snapshot.json",
  "review.json",
  "corroboration-self-review.json",
  "report.md",
  "corroboration-fetch-manifest.json",
  "fetch-corroboration.mjs",
  "inspect-corroboration.mjs",
  "build-corroborated-packet.mjs",
  "query-production.ts",
  "validate-corroborated-packet.mjs",
];
const fileLocks = [];
for (const name of lockNames) {
  const bytes = await readFile(path.join(here, name));
  fileLocks.push({
    path: `research-handoffs/beta-chronology-gap/ios9-point/${name}`,
    bytes: bytes.byteLength,
    sha256: sha256(bytes),
  });
}

const validation = {
  formatVersion: 1,
  batchId: assignment.batchId,
  validatedAt: new Date().toISOString(),
  validator: "codex-review-reusable-public-betas",
  status: "passedCorroborationSelfCheckPendingIndependentReview",
  independentReviewOfAddedSourcesComplete: false,
  checks: {
    packetJsonParsed: 7,
    assignmentTargetCount: assignment.targetCount,
    candidateCount: candidatesDocument.candidates.length,
    sourceCount: sourcesDocument.sources.length,
    legacySourceCount: sourcesDocument.sources.length - manifest.sources.length,
    addedCorroboratorCount: manifest.sources.length,
    conflictCount: conflictsDocument.conflicts.length,
    uniqueCandidateIds: true,
    uniqueSourceIds: true,
    assignmentTargetsResolved: candidateIds.length,
    evidenceReferencesResolved,
    twoPublisherLineagesPerCandidate: true,
    rawSourcesVerified,
    legacySelectedTextVerified,
    boundedFragmentsVerified,
    boundedFragmentMaximumWords: 20,
    exactProductionMatches: 0,
    scopedPublicBetaEventsInProduction: 0,
    productionSnapshotReadOnlyAndExact: true,
    sourceTextConflictsPreserved: true,
    priorIndependentReviewPreservedByteForByte: true,
    independentReviewStillRequiredForNewSources: true,
    stableEventIdsAssigned: 0,
    buildsIncluded: 0,
    sanityWritesPerformed: 0,
    deploymentsPerformed: 0,
    packetFilesLocked: fileLocks.length,
  },
  counts: {
    candidates: 27,
    corroboratedCandidates: 27,
    candidatesWithPriorIndependentEvidenceReview: 2,
    candidatesWithNewCorroborationPendingIndependentReview: 25,
    confirmedMissingCandidates: 27,
    sources: 56,
    rawSources: 56,
    conflicts: 7,
  },
  frozenBaseline: {
    assignmentSha256:
      "93d13e08f551095b3f69b3754f6c20239456dee7cf64fdc4b7058f19d2bf690d",
    priorIndependentReviewSha256:
      "c31165ca8df49d75c475b78b7fabefa415d04885b0ec98a1abc08cfc69f7779b",
    preCorroborationCandidatesSha256:
      "4dbdca3c8a75414fc1d8bec4472e50b73bee63c33af83f12bab41bd4a7305f61",
    preCorroborationSourcesSha256:
      "312cd79215b7c3946df0b2c7a02cb553efa41088919216b9361ffeb4c6f149ba",
    preCorroborationConflictsSha256:
      "e8a5c2f8fdeda74daf7b2ade39e8c132cedf9ec8ec947828a96ed80ecf16ecd2",
    preCorroborationReportSha256:
      "f87d5e486baead966772a70e58ef0a2fbd13bff70065d337d53072d01641e8b6",
  },
  blockers: [
    "A reviewer independent from the corroboration researcher has not inspected the 25 newly added source pages.",
    "Sanity mutation, stable ID allocation, publication, page building, and deployment remain unauthorized.",
  ],
  publisherLineagesByCandidate,
  fileLocks,
  safety: {
    sanityMutationPerformed: false,
    sanityMutationAllowed: false,
    publicationEligible: false,
    deploymentAllowed: false,
  },
  errors: [],
};

await writeFile(
  path.join(here, "validation.json"),
  `${JSON.stringify(validation, null, 2)}\n`,
);

console.log(
  JSON.stringify(
    {
      status: validation.status,
      counts: validation.counts,
      checks: {
        rawSourcesVerified,
        legacySelectedTextVerified,
        boundedFragmentsVerified,
        evidenceReferencesResolved,
        packetFilesLocked: fileLocks.length,
      },
    },
    null,
    2,
  ),
);
