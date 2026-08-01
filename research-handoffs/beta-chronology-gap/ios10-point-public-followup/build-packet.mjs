import {createHash} from "node:crypto";
import {mkdir, readFile, writeFile} from "node:fs/promises";
import path from "node:path";
import {fileURLToPath} from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(here, "../../../");
const batchId = "beta-chronology-gap-ios10-point-public-followup";
const packetPath =
  "research-handoffs/beta-chronology-gap/ios10-point-public-followup";
const parentPacketPath =
  "research-handoffs/beta-chronology-gap/ios10-point-public";
const evidenceRoot =
  "tmp/research-evidence/beta-chronology-gap/ios10-point-public-followup";
const generatedAt = "2026-07-31T04:35:31.043Z";
const researchCutoff = "2026-07-31";

const sha256 = (value) =>
  createHash("sha256").update(value).digest("hex");
const absolute = (relativePath) => path.join(repoRoot, relativePath);
const readJson = async (relativePath) =>
  JSON.parse(await readFile(absolute(relativePath), "utf8"));
const writeJson = async (relativePath, value) =>
  writeFile(
    absolute(relativePath),
    `${JSON.stringify(value, null, 2)}\n`,
  );
const assert = (condition, message) => {
  if (!condition) throw new Error(message);
};

await mkdir(absolute(`${evidenceRoot}/selected`), {recursive: true});

const [fetchManifest, production, parentSourcesDocument, parentReview] =
  await Promise.all([
    readJson(`${evidenceRoot}/fetch-manifest.json`),
    readJson(`${evidenceRoot}/production-snapshot.json`),
    readJson(`${parentPacketPath}/sources.json`),
    readJson(`${parentPacketPath}/independent-review.json`),
  ]);

assert(fetchManifest.batchId === batchId, "Unexpected fetch-manifest batch.");
assert(production.batchId === batchId, "Unexpected production snapshot batch.");
assert(fetchManifest.sourceCount === 9, "Expected nine new source captures.");

const captureById = new Map(
  fetchManifest.sources.map((source) => [source.sourceId, source]),
);

const sourceSpecs = [
  {
    sourceId: "followup-ios102-pb3-macrumors-status-1302",
    title: "What's New in iOS 10.2 Beta 3",
    publisher: "MacRumors",
    author: "Juli Clover",
    canonicalUrl:
      "https://www.macrumors.com/2016/11/14/whats-new-in-ios-10-2-beta-3/",
    publishedAt: "2016-11-14T13:02:49-08:00",
    publishedAtAlternates: [],
    sourceClass: "journalism",
    roles: ["negativeStatus", "appearanceWindowLowerBound", "timezone"],
    rawMarker:
      "Apple has only provided the third beta of iOS 10.2 to developers today",
    excerpt:
      "Apple has only provided the third beta of iOS 10.2 to developers today.",
    supportNote:
      "At 1:02:49 p.m. Pacific, this separate MacRumors report still described beta 3 as developer-only and said public access would come later.",
    limitations:
      "This is a negative-status report from the same MacRumors publisher family as the archived revisions. It is not an independent second lineage.",
    timezoneAnalysis: {
      publishedAtOriginal: "2016-11-14T13:02:49-08:00",
      normalizedZone: "America/Los_Angeles",
      normalizedDate: "2016-11-14",
      normalizedTime: "13:02:49",
    },
    locator:
      "JSON-LD datePublished and the paragraph stating that only developers had beta 3 at publication time.",
    lineage: {
      publisherFamily: "MacRumors",
      independentForCorroboration: true,
      dependencyNote:
        "Deduplicate all MacRumors URLs and revisions as one publisher lineage.",
    },
  },
  {
    sourceId: "followup-ios102-pb3-macrumors-revision-1129",
    title: "Apple Seeds Third Beta of iOS 10.2 to Developers",
    publisher: "MacRumors",
    author: "Juli Clover",
    canonicalUrl:
      "https://www.macrumors.com/2016/11/14/apple-seeds-ios-10-2-beta-3-to-developers/",
    publishedAt: "2016-11-14T09:52:08-08:00",
    publishedAtAlternates: [],
    sourceClass: "archivedArticleRevision",
    roles: ["negativeRevision", "appearanceWindowLowerBound", "archive"],
    rawMarker:
      "<title>Apple Seeds Third Beta of iOS 10.2 to Developers - Mac Rumors</title>",
    excerpt: "Apple Seeds Third Beta of iOS 10.2 to Developers.",
    supportNote:
      "The 11:29:27 a.m. Pacific archived revision has no public-beta update in its title or article body.",
    limitations:
      "Absence is established by comparing this complete archived revision with the later revision; it is not a standalone publisher claim.",
    timezoneAnalysis: {
      articlePublishedAtOriginal: "2016-11-14T09:52:08-08:00",
      archiveCapturedAt: "2016-11-14T19:29:27Z",
      archiveCapturedAtPacific: "2016-11-14T11:29:27-08:00",
      normalizedZone: "America/Los_Angeles",
      normalizedDate: "2016-11-14",
    },
    locator:
      "Archived title and complete article revision captured at 2016-11-14T19:29:27Z; no public-beta update is present.",
    lineage: {
      publisherFamily: "MacRumors",
      independentForCorroboration: true,
      dependencyNote:
        "Deduplicate all MacRumors URLs and revisions as one publisher lineage.",
    },
  },
  {
    sourceId: "followup-ios102-pb3-macrumors-revision-1455",
    title:
      "Apple Seeds Third Beta of iOS 10.2 to Developers [Update: Public Beta Available]",
    publisher: "MacRumors",
    author: "Juli Clover",
    canonicalUrl:
      "https://www.macrumors.com/2016/11/14/apple-seeds-ios-10-2-beta-3-to-developers/",
    publishedAt: "2016-11-14T09:52:08-08:00",
    publishedAtAlternates: [],
    sourceClass: "archivedArticleRevision",
    roles: [
      "publicAvailability",
      "publicOrdinal",
      "appearanceWindowUpperBound",
      "archive",
    ],
    rawMarker:
      "iOS 10.2 beta 3 is also available for public beta testers.",
    excerpt: "iOS 10.2 beta 3 is also available for public beta testers.",
    supportNote:
      "By the 2:55:46 p.m. Pacific archive capture, MacRumors had added an explicit Public Beta 3 availability update.",
    limitations:
      "The edit itself has no publisher-supplied update timestamp. The archive capture is an availability-by upper bound, not the exact release minute.",
    timezoneAnalysis: {
      articlePublishedAtOriginal: "2016-11-14T09:52:08-08:00",
      archiveCapturedAt: "2016-11-14T22:55:46Z",
      archiveCapturedAtPacific: "2016-11-14T14:55:46-08:00",
      normalizedZone: "America/Los_Angeles",
      normalizedDate: "2016-11-14",
    },
    locator:
      "Archived title and bold Update paragraph captured at 2016-11-14T22:55:46Z.",
    lineage: {
      publisherFamily: "MacRumors",
      independentForCorroboration: true,
      dependencyNote:
        "Deduplicate all MacRumors URLs and revisions as one publisher lineage.",
    },
  },
  {
    sourceId: "followup-ios102-pb3-neowin",
    title:
      "Apple releases iOS 10.2 and macOS 10.12.2 Public Beta 3, watchOS 3.1.1 Developer Beta 3",
    publisher: "Neowin",
    author: "Rich Woods",
    canonicalUrl:
      "https://www.neowin.net/news/apple-releases-ios-102-and-macos-10122-public-beta-3-watchos-311-developer-beta-3/",
    publishedAt: "2016-11-15T22:42:01+00:00",
    publishedAtAlternates: [],
    sourceClass: "archivedJournalism",
    roles: [
      "publicAvailability",
      "publicOrdinal",
      "dateConflict",
      "archive",
    ],
    rawMarker:
      "Those on the Public Beta program got new iOS 10.2 and macOS 10.12.2 Sierra builds today",
    excerpt:
      "Those on the Public Beta program got new iOS 10.2 and macOS 10.12.2 Sierra builds today.",
    supportNote:
      "Neowin explicitly reports Public Beta 3 on November 15 and says the developer build arrived the prior day.",
    limitations:
      "The live page returned HTTP 500 during capture, so the packet uses a publisher-page replay from the Internet Archive. Its 'today' wording conflicts with the November 14 archival bracket.",
    timezoneAnalysis: {
      publishedAtOriginal: "2016-11-15T22:42:01+00:00",
      publishedAtEastern: "2016-11-15T17:42:01-05:00",
      publishedAtPacific: "2016-11-15T14:42:01-08:00",
      normalizedZone: "America/Los_Angeles",
      normalizedDate: "2016-11-15",
    },
    locator:
      "Article datePublished, headline, first paragraph saying public testers received the builds today, and next paragraph saying developer beta 3 arrived yesterday.",
    lineage: {
      publisherFamily: "Neowin",
      independentForCorroboration: true,
      dependencyNote:
        "Independent publisher lineage; preserved as a contrary chronology position.",
    },
  },
  {
    sourceId: "followup-ios102-pb3-redmondpie",
    title:
      "iOS 10.2 Beta 3: All New Changes And Features In One Place [Screenshots]",
    publisher: "Redmond Pie",
    author: "Oliver Haslam",
    canonicalUrl:
      "https://www.redmondpie.com/ios-10.2-beta-3-all-new-changes-and-features-in-one-place-screenshots/",
    publishedAt: "2016-11-15T07:11:54+00:00",
    publishedAtAlternates: ["2016-11-15T01:11:54+00:00"],
    sourceClass: "journalism",
    roles: [
      "publicAvailability",
      "publicOrdinal",
      "appearanceDate",
      "metadataConflict",
    ],
    rawMarker:
      "Apple seeded today to both developers and public beta testers",
    excerpt: "Apple seeded today to both developers and public beta testers.",
    supportNote:
      "The article explicitly includes public beta testers. Both conflicting machine timestamps normalize to November 14 Pacific.",
    limitations:
      "The page exposes 07:11:54Z in JSON-LD and the visible time element but 01:11:54Z in article:published_time. Both values must remain documented.",
    timezoneAnalysis: {
      primaryPublishedAtOriginal: "2016-11-15T07:11:54+00:00",
      primaryPublishedAtPacific: "2016-11-14T23:11:54-08:00",
      alternatePublishedAtOriginal: "2016-11-15T01:11:54+00:00",
      alternatePublishedAtPacific: "2016-11-14T17:11:54-08:00",
      normalizedZone: "America/Los_Angeles",
      normalizedDateForBoth: "2016-11-14",
    },
    locator:
      "JSON-LD Article datePublished, article:published_time, visible time element, and description naming public beta testers.",
    lineage: {
      publisherFamily: "Redmond Pie",
      independentForCorroboration: true,
      dependencyNote:
        "Independent publisher lineage; metadata discrepancy affects time precision, not Pacific calendar date.",
    },
  },
  {
    sourceId: "followup-ios102-pb3-geekygadgets",
    title: "Apple Releases iOS 10.2 Beta 3",
    publisher: "Geeky Gadgets",
    author: "Roland Hutchinson",
    canonicalUrl:
      "https://www.geeky-gadgets.com/apple-releases-ios-10-2-beta-3-15-11-2016/",
    publishedAt: "2016-11-15T08:13:21+00:00",
    publishedAtAlternates: [],
    sourceClass: "derivativeJournalism",
    roles: ["publicAvailability", "publicOrdinal", "supportingContext"],
    rawMarker:
      "Source <a href=\"https://www.macrumors.com/2016/11/14/apple-seeds-ios-10-2-beta-3-to-developers/\">MacRumors</a>",
    excerpt: "Source: MacRumors.",
    supportNote:
      "The article reports public-program availability shortly after midnight Pacific on November 15.",
    limitations:
      "The article explicitly credits MacRumors as its source, so it must not be counted as an independent publisher lineage for corroboration.",
    timezoneAnalysis: {
      publishedAtOriginal: "2016-11-15T08:13:21+00:00",
      publishedAtPacific: "2016-11-15T00:13:21-08:00",
      normalizedZone: "America/Los_Angeles",
      normalizedDate: "2016-11-15",
    },
    locator:
      "JSON-LD datePublished, article lead describing public-program availability, and final source attribution to MacRumors.",
    lineage: {
      publisherFamily: "Geeky Gadgets",
      independentForCorroboration: false,
      dependencyNote:
        "Explicitly derivative of MacRumors for this report.",
    },
  },
  {
    sourceId: "followup-ios102-pb3-taisy0",
    title:
      "Apple、｢iOS 10.2 Public Beta 3｣と｢macOS 10.12.2 Public Beta 3｣を公開",
    publisher: "気になる、記になる…",
    author: "taisy0",
    canonicalUrl: "https://taisy0.com/2016/11/15/76422.html",
    publishedAt: "2016-11-15T09:35:21+0900",
    publishedAtAlternates: [],
    sourceClass: "journalism",
    roles: [
      "publicAvailability",
      "publicOrdinal",
      "appearanceDate",
      "timezone",
    ],
    rawMarker:
      "Apple、｢iOS 10.2 Public Beta 3｣と｢macOS 10.12.2 Public Beta 3｣を公開",
    excerpt: "Apple、｢iOS 10.2 Public Beta 3｣を公開",
    supportNote:
      "The Japanese article explicitly identifies iOS 10.2 Public Beta 3 for Apple Beta Software Program members.",
    limitations:
      "The visible Japanese calendar date is November 15. Its full machine timestamp is November 14 in Pacific time and must not be truncated before normalization.",
    timezoneAnalysis: {
      publishedAtOriginal: "2016-11-15T09:35:21+09:00",
      publishedAtUtc: "2016-11-15T00:35:21Z",
      publishedAtPacific: "2016-11-14T16:35:21-08:00",
      normalizedZone: "America/Los_Angeles",
      normalizedDate: "2016-11-14",
    },
    locator:
      "JSON-LD Article datePublished, headline, description, and lead naming Apple Beta Software Program members and Public Beta 3.",
    lineage: {
      publisherFamily: "気になる、記になる…",
      independentForCorroboration: true,
      dependencyNote:
        "Independent Japanese editorial publisher lineage.",
    },
  },
  {
    sourceId: "followup-ios1021-pb3-kobonemi",
    title: "iOS10.2.1 Public Beta3が利用可能に",
    publisher: "こぼねみ",
    author: "こぼねみ",
    canonicalUrl:
      "https://www.kobonemi.com/entry/iOS_10.2.1_Public_Beta_3",
    publishedAt: "2017-01-10T09:05:45+09:00",
    publishedAtAlternates: ["2017-01-10T00:05:45Z"],
    sourceClass: "qualifiedJournalism",
    roles: [
      "publicAvailability",
      "publicOrdinal",
      "appearanceDate",
      "internalOrdinalConflict",
      "supportingContext",
    ],
    rawMarker: "iOS 10.2.1 Public Beta 3",
    excerpt: "iOS 10.2.1 Public Beta 3.",
    supportNote:
      "The title and quoted product identity explicitly say iOS 10.2.1 Public Beta 3; its timestamp normalizes to January 9 Pacific.",
    limitations:
      "The prose incorrectly calls this the second public beta and calls the paired developer seed Beta 2. The exact PB3 title is useful, but this source is supplementary and not needed to close the lineage gate.",
    timezoneAnalysis: {
      publishedAtOriginal: "2017-01-10T09:05:45+09:00",
      publishedAtUtc: "2017-01-10T00:05:45Z",
      publishedAtPacific: "2017-01-09T16:05:45-08:00",
      normalizedZone: "America/Los_Angeles",
      normalizedDate: "2017-01-09",
      metadataQualification:
        "The page's JSON-LD dateModified uses 2017-01-10T00:05:45+09:00, which is inconsistent with its published/visible timestamp.",
    },
    locator:
      "Title, article:published_time, JSON-LD datePublished, visible time, and lead; exclude the erroneous 'second public beta' and 'Developer Beta 2' prose.",
    lineage: {
      publisherFamily: "こぼねみ",
      independentForCorroboration: false,
      dependencyNote:
        "The article says it checked MacRumors and 9to5Mac and contains ordinal errors; retain as qualified supplementary evidence only.",
    },
  },
  {
    sourceId: "followup-ios1021-pb3-taisy0",
    title:
      "Apple、テスター向けに｢iOS 10.2.1 Public Beta 3｣と｢macOS Sierra 10.12.3 Public Beta 3｣をリリース",
    publisher: "気になる、記になる…",
    author: "taisy0",
    canonicalUrl: "https://taisy0.com/2017/01/10/78466.html",
    publishedAt: "2017-01-10T09:28:31+09:00",
    publishedAtAlternates: [],
    sourceClass: "journalism",
    roles: [
      "publicAvailability",
      "publicOrdinal",
      "appearanceDate",
      "secondEditorialLineage",
      "timezone",
    ],
    rawMarker:
      "Apple、テスター向けに｢iOS 10.2.1 Public Beta 3｣と｢macOS Sierra 10.12.3 Public Beta 3｣をリリース",
    excerpt: "Apple、テスター向けに｢iOS 10.2.1 Public Beta 3｣をリリース",
    supportNote:
      "The Japanese article explicitly says Apple released iOS 10.2.1 Public Beta 3 to beta testers after the developer seed.",
    limitations:
      "The visible Japanese calendar date is January 10. Its full machine timestamp normalizes to January 9 Pacific.",
    timezoneAnalysis: {
      publishedAtOriginal: "2017-01-10T09:28:31+09:00",
      publishedAtUtc: "2017-01-10T00:28:31Z",
      publishedAtPacific: "2017-01-09T16:28:31-08:00",
      normalizedZone: "America/Los_Angeles",
      normalizedDate: "2017-01-09",
    },
    locator:
      "JSON-LD Article datePublished, headline, description, and lead explicitly naming beta testers and Public Beta 3.",
    lineage: {
      publisherFamily: "気になる、記になる…",
      independentForCorroboration: true,
      dependencyNote:
        "Independent Japanese editorial publisher lineage; this closes the parent packet's second-editorial-lineage gap subject to independent review.",
    },
  },
];

const sources = [];
for (const spec of sourceSpecs) {
  const capture = captureById.get(spec.sourceId);
  assert(capture, `Missing capture for ${spec.sourceId}.`);
  const rawPath = `${evidenceRoot}/raw/${capture.filename}`;
  const raw = await readFile(absolute(rawPath));
  const rawText = raw.toString("utf8");
  assert(
    raw.byteLength === capture.rawBytes &&
      sha256(raw) === capture.rawSha256,
    `Raw evidence hash mismatch for ${spec.sourceId}.`,
  );
  assert(
    rawText.includes(spec.rawMarker),
    `Required locator marker missing for ${spec.sourceId}.`,
  );

  const selectedPath = `${evidenceRoot}/selected/${spec.sourceId}.selected.txt`;
  const selectedText = [
    `Source: ${spec.sourceId}`,
    `Publisher: ${spec.publisher}`,
    `Title: ${spec.title}`,
    `Published timestamp retained: ${spec.publishedAt}`,
    `Locator: ${spec.locator}`,
    `Bounded identification excerpt: ${spec.excerpt}`,
    "",
  ].join("\n");
  await writeFile(absolute(selectedPath), selectedText);
  const selectedBytes = Buffer.from(selectedText);

  sources.push({
    sourceId: spec.sourceId,
    canonicalUrl: spec.canonicalUrl,
    retrievalUrl: capture.retrievalUrl,
    finalUrl: capture.finalUrl,
    archiveUrl: capture.archive ? capture.retrievalUrl : null,
    archive: capture.archive,
    title: spec.title,
    publisher: spec.publisher,
    author: spec.author,
    publishedAt: spec.publishedAt,
    publishedAtAlternates: spec.publishedAtAlternates,
    accessedAt: researchCutoff,
    status: capture.archive ? "archived" : "active",
    sourceClass: spec.sourceClass,
    roles: spec.roles,
    supportNote: spec.supportNote,
    limitations: spec.limitations,
    timezoneAnalysis: spec.timezoneAnalysis,
    evidence: {
      rawPath,
      rawBytes: capture.rawBytes,
      rawSha256: capture.rawSha256,
      selectedPath,
      selectedTextBytes: selectedBytes.byteLength,
      selectedTextSha256: sha256(selectedBytes),
      captureMethod: capture.archive
        ? "internet-archive-html"
        : "direct-http-html",
      capturedAt: capture.capturedAt,
      locator: spec.locator,
    },
    lineage: spec.lineage,
  });
}

const sourcesDocument = {
  formatVersion: 1,
  batchId,
  generatedAt,
  researchCutoff,
  sourceCount: sources.length,
  sourcePolicy:
    "Retain complete source captures for audit, but expose only bounded identification excerpts. Treat multiple URLs or revisions from one publisher as one editorial lineage. Do not reproduce article prose downstream.",
  sources,
  captureFailures: [],
};

const parentSourceFindings = {
  "source-ios102-pb3-macrumors-update":
    "Current page still has an untimestamped public-beta update. The new archived revision pair now brackets when that update appeared.",
  "source-ios102-pb3-thinkapple":
    "Its 2016-11-15T00:28:13Z timestamp equals 2016-11-14T16:28:13-08:00. Its retrospective text is consistent with November 14 Pacific.",
  "source-ios102-pb3-idevice":
    "Explicit Public Beta 3 report published 2016-11-15T19:59:40+02:00, or 2016-11-15T09:59:40-08:00. It establishes availability by November 15, not first appearance.",
  "source-ios102-pb3-iphonefaq":
    "Explicit November 15 report, but its body contains version-number mistakes. Retain only its correctly identified headline/date as availability-by evidence.",
  "source-ios1021-pb3-macrumors":
    "The current untimestamped update explicitly says the third public beta was available. It remains one adequate editorial lineage.",
  "source-ios1021-pb3-osxdaily":
    "The article covers beta 3 but says public versions typically follow; it does not independently establish public availability.",
  "source-ios1021-pb3-idevicecentral-video":
    "The video description is a contemporaneous first-hand Public Beta 3 witness, but it remains non-editorial corroboration.",
};

const parentSourceById = new Map(
  parentSourcesDocument.sources.map((source) => [source.sourceId, source]),
);
const reinspectionSources = [];
for (const [sourceId, finding] of Object.entries(parentSourceFindings)) {
  const source = parentSourceById.get(sourceId);
  assert(source, `Parent source ${sourceId} not found.`);
  const [raw, selected] = await Promise.all([
    readFile(absolute(source.evidence.rawPath)),
    readFile(absolute(source.evidence.selectedPath)),
  ]);
  assert(
    raw.byteLength === source.evidence.rawBytes &&
      sha256(raw) === source.evidence.rawSha256,
    `Parent raw evidence mismatch for ${sourceId}.`,
  );
  assert(
    selected.byteLength === source.evidence.selectedTextBytes &&
      sha256(selected) === source.evidence.selectedTextSha256,
    `Parent selected evidence mismatch for ${sourceId}.`,
  );
  reinspectionSources.push({
    sourceId,
    parentRecordPath: `${parentPacketPath}/sources.json`,
    parentRawPath: source.evidence.rawPath,
    parentRawBytes: source.evidence.rawBytes,
    parentRawSha256: source.evidence.rawSha256,
    parentRawHashVerified: true,
    parentSelectedPath: source.evidence.selectedPath,
    parentSelectedTextBytes: source.evidence.selectedTextBytes,
    parentSelectedTextSha256: source.evidence.selectedTextSha256,
    parentSelectedHashVerified: true,
    reinspectionFinding: finding,
  });
}

const reviewedParentLocks = parentReview.reviewedPacketLocks;
const currentParentLocks = {};
for (const [filename, expected] of Object.entries(reviewedParentLocks)) {
  const bytes = await readFile(absolute(`${parentPacketPath}/${filename}`));
  const observed = {
    bytes: bytes.byteLength,
    sha256: sha256(bytes),
  };
  assert(
    observed.bytes === expected.bytes &&
      observed.sha256 === expected.sha256,
    `Frozen parent packet drifted at ${filename}.`,
  );
  currentParentLocks[filename] = observed;
}

const retainedSourceReinspection = {
  formatVersion: 1,
  batchId,
  generatedAt,
  parentPacketPath,
  parentIndependentReviewPath: `${parentPacketPath}/independent-review.json`,
  frozenParentPacketUnchanged: true,
  verifiedParentPacketLocks: currentParentLocks,
  reinspectionSourceCount: reinspectionSources.length,
  sources: reinspectionSources,
};

const assignment = {
  formatVersion: 1,
  batchId,
  createdAt: generatedAt,
  createdBy: "codex-scope-beta-gap-program",
  vendor: {name: "Apple", slug: "apple"},
  researchCutoff,
  parentPacketPath,
  trigger:
    "The parent packet's independent review blocked two identities: iOS 10.2 Public Beta 3 for a date correction and iOS 10.2.1 Public Beta 3 for a second editorial lineage.",
  scopeRule:
    "Research only the two blocked public-beta identities. Reinspect frozen evidence, preserve every timestamp and timezone, capture and hash new sources, query published production exactly, and return research candidates pending a different independent reviewer.",
  targetCount: 2,
  targets: [
    {
      candidateId: "candidate:apple:ios:10.2:public-beta-3",
      version: "10.2",
      releaseVersionId: "version-ios-10-2",
      priorFrozenDate: "2016-11-15",
      reviewerRequiredAlternative: "2016-11-14",
      followupProposedDate: "2016-11-14",
      task:
        "Adjudicate November 14 versus November 15 without suppressing conflicting contemporary reports.",
    },
    {
      candidateId: "candidate:apple:ios:10.2.1:public-beta-3",
      version: "10.2.1",
      releaseVersionId: "version-ios-10-2-1",
      priorFrozenDate: "2017-01-09",
      reviewerRequiredAlternative: null,
      followupProposedDate: "2017-01-09",
      task:
        "Find a second contemporary editorial lineage explicitly identifying Public Beta 3 and its appearance date.",
    },
  ],
  exclusions: [
    "Sanity writes or stableEventId creation",
    "Page builds, article content, release notes, and deployment",
    "Developer-beta chronology repair",
    "Build-number or shared-payload claims",
    "Modification of the frozen parent packet or its independent review",
  ],
  safety: {
    queryOnlyProductionAccess: true,
    sanityMutationAllowed: false,
    publicationAuthorized: false,
    stableEventIdCreationAllowed: false,
    pageBuildsAllowed: false,
    deploymentAllowed: false,
  },
};

const parentEvidence = (sourceId, locator, supports) => ({
  kind: "packetSource",
  packetPath: `${parentPacketPath}/sources.json`,
  sourceId,
  locator,
  supports,
});
const followupEvidence = (sourceId, locator, supports) => ({
  kind: "packetSource",
  packetPath: `${packetPath}/sources.json`,
  sourceId,
  locator,
  supports,
});

const candidates = [
  {
    candidateId: "candidate:apple:ios:10.2:public-beta-3",
    originCohortId: "ios10-point-public-followup",
    platform: "iOS",
    platformId: "platform-ios",
    version: "10.2",
    releaseVersionId: "version-ios-10-2",
    proposedIdentity: {
      label: "Public Beta 3",
      routeAlias: "public-beta-3",
      channel: "publicBeta",
      appearanceDate: "2016-11-14",
      sequence: 3,
      isRevision: false,
      availabilityState: "available",
      closesReleaseCycle: false,
    },
    ordinalBasis: "explicit",
    candidateStatus: "needsEvidenceReview",
    identityStatus: "conflict",
    evidenceState: "corroborated",
    productionReconciliation: {
      status: "confirmedMissing",
      queriedAt: production.capturedAt,
      matchBasis:
        "Fresh published, no-CDN production query checked releaseVersionId, publicBeta channel, routeAlias, sequence, label, and both 2016-11-14 and frozen 2016-11-15 date variants; all match counts were zero.",
      exactIdentityMatches: 0,
    },
    evidenceRefs: [
      followupEvidence(
        "followup-ios102-pb3-macrumors-status-1302",
        "13:02:49 Pacific publication timestamp and developer-only status paragraph.",
        "Provides a same-day negative lower bound before the public update appeared.",
      ),
      followupEvidence(
        "followup-ios102-pb3-macrumors-revision-1455",
        "14:55:46 Pacific archive capture and explicit public-beta update.",
        "Provides an availability-by upper bound for Public Beta 3 on November 14 Pacific.",
      ),
      followupEvidence(
        "followup-ios102-pb3-taisy0",
        "JSON-LD timestamp, headline, and lead naming Public Beta 3 for beta-program members.",
        "Independent editorial corroboration published at 16:35:21 Pacific on November 14.",
      ),
      parentEvidence(
        "source-ios102-pb3-thinkapple",
        "Full retained timestamp and retrospective chronology in the article lead.",
        "Independent editorial corroboration published at 16:28:13 Pacific on November 14.",
      ),
      followupEvidence(
        "followup-ios102-pb3-neowin",
        "November 15 timestamp and wording that public testers received the build 'today.'",
        "Preserves the material contrary November 15 chronology position for review.",
      ),
      followupEvidence(
        "followup-ios102-pb3-redmondpie",
        "Both conflicting machine timestamps and text naming public beta testers.",
        "Both machine timestamps normalize to November 14 Pacific and support same-day availability.",
      ),
    ],
    pairedDeveloperRoute: {
      releaseVersionId: "version-ios-10-2",
      routeAlias: "beta-3",
      relationship:
        "Production contains Developer Beta 3 on 2016-11-14. This is chronology context only and does not assert build or payload equivalence.",
    },
    upstreamPacket: parentPacketPath,
    buildEvidenceStatus: "absent",
    contentDisposition: "timelineOnly",
    blockers: [
      "A reviewer independent of this follow-up researcher must inspect the archival transition and adjudicate the preserved November 15 contrary reports.",
      "This proposal corrects only appearanceDate; it does not authorize chronology approval, publication, or a Sanity write.",
    ],
    review: {
      required: true,
      reviewer: null,
      reviewedAt: null,
      notes:
        "Research proposal only. The archival evidence brackets public availability between 13:02:49 and 14:55:46 Pacific on November 14, but a different reviewer must adjudicate the conflict.",
    },
    flags: {
      sanityMutationAllowed: false,
      publicationEligible: false,
    },
  },
  {
    candidateId: "candidate:apple:ios:10.2.1:public-beta-3",
    originCohortId: "ios10-point-public-followup",
    platform: "iOS",
    platformId: "platform-ios",
    version: "10.2.1",
    releaseVersionId: "version-ios-10-2-1",
    proposedIdentity: {
      label: "Public Beta 3",
      routeAlias: "public-beta-3",
      channel: "publicBeta",
      appearanceDate: "2017-01-09",
      sequence: 3,
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
        "Fresh published, no-CDN production query checked releaseVersionId, publicBeta channel, routeAlias, sequence, label, and 2017-01-09 appearanceDate; all match counts were zero.",
      exactIdentityMatches: 0,
    },
    evidenceRefs: [
      parentEvidence(
        "source-ios1021-pb3-macrumors",
        "Headline, article lead, and retained update explicitly stating third public-beta availability.",
        "Provides the parent packet's first adequate editorial publisher lineage.",
      ),
      followupEvidence(
        "followup-ios1021-pb3-taisy0",
        "JSON-LD timestamp, headline, description, and lead explicitly naming beta testers and Public Beta 3.",
        "Provides a second independent editorial lineage and normalizes to January 9 Pacific.",
      ),
      followupEvidence(
        "followup-ios1021-pb3-kobonemi",
        "Title and exact product identity only; exclude erroneous prose ordinals.",
        "Supplies qualified supplementary support for the exact Public Beta 3 identity and January 9 Pacific date.",
      ),
      parentEvidence(
        "source-ios1021-pb3-idevicecentral-video",
        "Video publication date, title, and description.",
        "Retains the independent contemporary first-hand witness without counting it as an editorial lineage.",
      ),
    ],
    pairedDeveloperRoute: null,
    upstreamPacket: parentPacketPath,
    buildEvidenceStatus: "absent",
    contentDisposition: "timelineOnly",
    blockers: [
      "A reviewer independent of this follow-up researcher must verify the new Taisy0 locator and accept or reject it as the second editorial lineage.",
      "No chronology approval, publication, or Sanity write is authorized by this packet.",
    ],
    review: {
      required: true,
      reviewer: null,
      reviewedAt: null,
      notes:
        "Research proposal only. Taisy0 supplies the clean second editorial lineage; Kobonemi is supplementary because its prose contains ordinal errors.",
    },
    flags: {
      sanityMutationAllowed: false,
      publicationEligible: false,
    },
  },
];

const candidateRegister = {
  formatVersion: "1.0",
  programId: "apple-beta-chronology-gap",
  generatedAt,
  safety: {
    sanityMutationAllowed: false,
    publicationAuthorized: false,
    stableEventIdCreationAllowed: false,
    note:
      "This follow-up is a research-only correction/supplement. An independent chronology review and separate write authorization are still required.",
  },
  summary: {
    proposedCandidateCount: candidates.length,
    notProposedCount: 0,
    byStatus: {needsEvidenceReview: 2},
    byPlatform: {iOS: 2},
    importantQualification:
      "iOS 10.2 Public Beta 3 is proposed for 2016-11-14 Pacific from an archived revision window, with contrary November 15 reports preserved as a material conflict. iOS 10.2.1 Public Beta 3 now has a clean second editorial lineage. Neither is chronology-approved.",
  },
  cohorts: [
    {
      cohortId: "ios10-point-public-followup",
      description:
        "Narrow follow-up for the two candidates blocked by the frozen iOS 10 point-public independent review.",
      candidateCount: candidates.length,
      sourcePaths: [
        `${parentPacketPath}/independent-review.json`,
        `${packetPath}/sources.json`,
        `${packetPath}/retained-source-reinspection.json`,
        `${packetPath}/production-snapshot.json`,
      ],
      supersessionRule:
        "This supplement does not alter the frozen parent packet. If independently approved, it supersedes only the parent candidate date for iOS 10.2 Public Beta 3 and the parent editorial-lineage status for iOS 10.2.1 Public Beta 3.",
    },
  ],
  candidates,
  notProposed: [],
  nextEvidenceWaves: [
    {
      waveId: "ios10-point-public-followup-independent-review",
      scope:
        "Independently verify the two corrected/supplemented candidate identities, their source hashes, time-zone normalization, and conflict handling.",
      artifactPaths: [
        `${packetPath}/report.md`,
        `${packetPath}/candidates.json`,
        `${packetPath}/conflicts.json`,
      ],
      estimatedCandidateCount: 2,
      countStatus: "confirmed",
      requiredNextStep:
        "A reviewer different from the researcher must issue a signed review artifact before any chronology approval or write decision.",
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
  generatedAt,
  conflictCount: 5,
  conflicts: [
    {
      conflictId: "ios102-public-beta-3-first-appearance-date",
      severity: "material",
      status: "proposedResolutionPendingIndependentReview",
      candidateIds: ["candidate:apple:ios:10.2:public-beta-3"],
      positions: [
        {
          position: "2016-11-14 America/Los_Angeles",
          sourceIds: [
            "followup-ios102-pb3-macrumors-status-1302",
            "followup-ios102-pb3-macrumors-revision-1129",
            "followup-ios102-pb3-macrumors-revision-1455",
            "followup-ios102-pb3-taisy0",
            "followup-ios102-pb3-redmondpie",
            "source-ios102-pb3-thinkapple",
          ],
          finding:
            "A MacRumors negative/positive revision window places the public update after 13:02:49 and no later than 14:55:46 Pacific. ThinkApple, Taisy0, and both Redmond Pie machine timestamps are later November 14 Pacific positives.",
        },
        {
          position: "2016-11-15 publisher-local or Pacific reporting date",
          sourceIds: [
            "followup-ios102-pb3-neowin",
            "followup-ios102-pb3-geekygadgets",
            "source-ios102-pb3-idevice",
            "source-ios102-pb3-iphonefaq",
          ],
          finding:
            "Neowin explicitly says public testers received the build 'today' on November 15. The other sources establish availability on November 15 but do not prove first appearance.",
        },
      ],
      researchDisposition: {
        proposedDate: "2016-11-14",
        confidence: "high",
        rationale:
          "The archived page-state transition directly proves the public update was visible on November 14 Pacific. Later November 15 availability reports cannot move first appearance forward, but Neowin's explicit 'today' wording remains a real contrary claim.",
      },
      requiredHandling:
        "Independent reviewer must inspect both archived revisions, verify the timestamps, and explicitly accept or reject the November 14 correction. Do not silently discard the Neowin position.",
    },
    {
      conflictId: "ios102-public-beta-3-cross-zone-calendar-dates",
      severity: "material",
      status: "normalizationDocumentedPendingIndependentReview",
      candidateIds: ["candidate:apple:ios:10.2:public-beta-3"],
      finding:
        "ThinkApple (UTC), Taisy0 (JST), and Redmond Pie (UTC) display or encode November 15 locally while their full timestamps fall on November 14 in America/Los_Angeles.",
      requiredHandling:
        "Preserve every original timestamp and offset. Normalize the chronology date only after conversion to America/Los_Angeles; never infer from URL or displayed date alone.",
    },
    {
      conflictId: "ios102-public-beta-3-redmondpie-metadata",
      severity: "nonMaterial",
      status: "qualified",
      candidateIds: ["candidate:apple:ios:10.2:public-beta-3"],
      sourceIds: ["followup-ios102-pb3-redmondpie"],
      finding:
        "Redmond Pie exposes 2016-11-15T07:11:54Z in JSON-LD and its visible time element, but 2016-11-15T01:11:54Z in article:published_time. Both normalize to November 14 Pacific.",
      requiredHandling:
        "Do not claim exact publication time from this source; retain both metadata positions.",
    },
    {
      conflictId: "ios1021-public-beta-3-editorial-lineage-gap",
      severity: "material",
      status: "researchResolvedPendingIndependentReview",
      candidateIds: ["candidate:apple:ios:10.2.1:public-beta-3"],
      sourceIds: [
        "source-ios1021-pb3-macrumors",
        "followup-ios1021-pb3-taisy0",
      ],
      finding:
        "Taisy0 explicitly identifies release of iOS 10.2.1 Public Beta 3 to beta testers at a timestamp equivalent to January 9 Pacific, providing a second publisher lineage independent from MacRumors.",
      requiredHandling:
        "Independent reviewer must verify the Taisy0 capture, timestamp conversion, translation summary, and publisher independence before closing the parent blocker.",
    },
    {
      conflictId: "ios1021-public-beta-3-kobonemi-internal-ordinals",
      severity: "material",
      status: "sourceQualified",
      candidateIds: ["candidate:apple:ios:10.2.1:public-beta-3"],
      sourceIds: ["followup-ios1021-pb3-kobonemi"],
      finding:
        "Kobonemi's title and exact product name say Public Beta 3, but the prose calls it the second public beta and calls the developer seed Beta 2. Its date metadata also contains a modified-time inconsistency.",
      requiredHandling:
        "Use Kobonemi only as supplementary exact-title evidence. Do not repeat its erroneous prose ordinals and do not count it as the lineage that closes the gate.",
    },
  ],
};

const selfReview = {
  formatVersion: 1,
  batchId,
  preparedAt: generatedAt,
  reviewer: "codex-scope-beta-gap-program-self-check",
  independentOfResearcher: false,
  verdict: "packetSelfCheckPassedPendingIndependentReview",
  candidateVerdict: {
    correctedDateProposalPendingIndependentReview: [
      "candidate:apple:ios:10.2:public-beta-3",
    ],
    secondEditorialLineageSuppliedPendingIndependentReview: [
      "candidate:apple:ios:10.2.1:public-beta-3",
    ],
    chronologyApproved: [],
  },
  checks: {
    parentPacketHashesVerified: true,
    retainedParentSourcesReinspected: reinspectionSources.length,
    newRawArtifactsHashed: sources.length,
    boundedSelectedArtifactsHashed: sources.length,
    fullTimestampsAndOffsetsRetained: true,
    conflictingDatePositionsPreserved: true,
    publisherFamiliesDeduplicated: true,
    derivativeSourcesExcludedFromLineageCount: true,
    exactPublishedProductionQueryReviewed: true,
    exactProductionMatches: 0,
    sanityMutationPerformed: false,
    stableEventIdsCreated: 0,
    pageBuildsPerformed: 0,
    deploymentPerformed: false,
  },
  authorization: {
    chronologyApprovedCandidateCount: 0,
    publicationEligible: false,
    sanityMutationAllowed: false,
    stableEventIdCreationAllowed: false,
    deploymentAllowed: false,
  },
};

const report = `# iOS 10 point-public blocked-identity follow-up

This supplement resolves the research work requested by the frozen parent review without changing the parent packet. It proposes a corrected Pacific date for iOS 10.2 Public Beta 3 and supplies the missing second editorial lineage for iOS 10.2.1 Public Beta 3. Both remain pending a different independent reviewer.

## Outcome

- **iOS 10.2 Public Beta 3:** propose **2016-11-14** in America/Los_Angeles. Archived MacRumors page states bracket public availability after 13:02:49 and no later than 14:55:46 Pacific. ThinkApple, Taisy0, and both Redmond Pie machine timestamps are later November 14 Pacific positives.
- **iOS 10.2.1 Public Beta 3:** retain **2017-01-09** in America/Los_Angeles. Taisy0 explicitly reports Public Beta 3 for testers at 2017-01-10T09:28:31+09:00, equivalent to 2017-01-09T16:28:31-08:00, supplying a clean second editorial publisher alongside the parent MacRumors record.
- The fresh published-perspective, no-CDN production query found **0** public-beta route identities and **0** full candidate matches under the two scoped releaseVersion documents.
- No Sanity write, stable event ID, page build, article content, or deployment was created.

## iOS 10.2 Public Beta 3 date adjudication

| Evidence state | Original timestamp | Pacific timestamp | What it establishes |
|---|---|---|---|
| MacRumors status article | 2016-11-14T13:02:49-08:00 | same | developer-only at publication |
| MacRumors archived revision | 2016-11-14T19:29:27Z | 2016-11-14 11:29:27 | no public update yet |
| MacRumors status article | 2016-11-14T13:02:49-08:00 | same | stronger same-day negative lower bound |
| MacRumors archived revision | 2016-11-14T22:55:46Z | 2016-11-14 14:55:46 | explicit public-beta update present |
| ThinkApple parent source | 2016-11-15T00:28:13Z | 2016-11-14 16:28:13 | explicit Public Beta 3 report |
| Taisy0 | 2016-11-15T09:35:21+09:00 | 2016-11-14 16:35:21 | explicit Public Beta 3 report |
| Redmond Pie | 01:11:54Z or 07:11:54Z on Nov 15 | Nov 14 17:11:54 or 23:11:54 | public availability; exact time conflicted |
| Neowin | 2016-11-15T22:42:01Z | 2016-11-15 14:42:01 | contrary claim that public testers received it “today” |

The archival transition is stronger first-appearance evidence than later availability reports, so the research proposal is November 14 Pacific. This is not a silent or final correction: Neowin's November 15 wording remains a material position that the independent reviewer must adjudicate.

## iOS 10.2.1 Public Beta 3 lineage adjudication

The parent packet had one qualifying editorial publisher, MacRumors, plus a first-hand video witness. The new Taisy0 article is a separate editorial publisher and explicitly identifies both the public audience and Public Beta 3. Its full JST timestamp normalizes to January 9 Pacific.

Kobonemi also names Public Beta 3 in its title and exact product string, but its prose incorrectly says “second public beta” and “Developer Beta 2.” It is retained and hashed as qualified supplementary evidence only; it is not needed to close the lineage gap.

## Source and copyright handling

Nine new raw HTML artifacts and nine bounded identification selections are retained with SHA-256 hashes. Multiple MacRumors pages and revisions count as one publisher family. Geeky Gadgets explicitly credits MacRumors and is excluded from independent-lineage counting. Kobonemi is likewise excluded because its article refers to MacRumors/9to5Mac and contains ordinal errors.

Downstream work must paraphrase findings, link and credit every source, avoid copying article prose, preserve timestamp/translation qualifications, and keep source-specific uncertainty visible.

## Production reconciliation

The read-only query ran at ${production.capturedAt} against project ${production.projectId}, dataset ${production.dataset}, with published perspective and CDN disabled. It observed ${production.productionCounts.totalReleaseEvents} total release events, ${production.productionCounts.iOSPublicBetaEventsAllVersions} iOS public-beta events across production, ${production.productionCounts.scopedReleaseEvents} events under the two scoped versions, and zero scoped public-beta events.

## Independent-review handoff

A reviewer different from the researcher should:

1. reproduce all parent and follow-up hashes;
2. compare the two archived MacRumors revisions and verify the Pacific time window;
3. explicitly accept or reject the November 14 proposal while preserving Neowin's contrary position;
4. verify Taisy0's exact Public Beta 3 language, timestamp conversion, and publisher independence;
5. keep Kobonemi qualified and excluded from the decisive lineage count; and
6. issue a separate signed review artifact.

Even a passing chronology review would not authorize a Sanity mutation. Any later write requires explicit authorization and another immediate production query.
`;

await Promise.all([
  writeJson(`${packetPath}/assignment.json`, assignment),
  writeJson(`${packetPath}/sources.json`, sourcesDocument),
  writeJson(
    `${packetPath}/retained-source-reinspection.json`,
    retainedSourceReinspection,
  ),
  writeJson(`${packetPath}/candidates.json`, candidateRegister),
  writeJson(`${packetPath}/conflicts.json`, conflictsDocument),
  writeJson(`${packetPath}/self-review.json`, selfReview),
  writeJson(`${packetPath}/production-snapshot.json`, production),
  writeFile(absolute(`${packetPath}/report.md`), report),
]);

console.log(
  JSON.stringify(
    {
      packetPath,
      candidateCount: candidates.length,
      sourceCount: sources.length,
      retainedSourcesReinspected: reinspectionSources.length,
      parentPacketUnchanged: true,
      productionExactMatches: 0,
      chronologyApprovedCandidateCount: 0,
      sanityMutationPerformed: false,
    },
    null,
    2,
  ),
);
