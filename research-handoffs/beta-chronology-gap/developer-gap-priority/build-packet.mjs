import {createHash} from "node:crypto";
import {mkdir, readFile, writeFile} from "node:fs/promises";
import path from "node:path";
import {fileURLToPath} from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(here, "../../../");
const batchId = "beta-chronology-gap-developer-gap-priority";
const packetPath =
  "research-handoffs/beta-chronology-gap/developer-gap-priority";
const evidencePath =
  "tmp/research-evidence/beta-chronology-gap/developer-gap-priority";
const oldIos9Packet = "research-handoffs/beta-chronology-gap/ios9-point";
const oldIos10Packet =
  "research-handoffs/beta-chronology-gap/ios10-point-public";
const generatedAt = new Date().toISOString();
const researchCutoff = "2026-07-31";

const absolute = (relativePath) => path.join(repoRoot, relativePath);
const readJson = async (relativePath) =>
  JSON.parse(await readFile(absolute(relativePath), "utf8"));
const writeJson = async (relativePath, value) =>
  writeFile(
    absolute(relativePath),
    `${JSON.stringify(value, null, 2)}\n`,
  );
const sha256 = (value) =>
  createHash("sha256").update(value).digest("hex");
const assert = (condition, message) => {
  if (!condition) throw new Error(message);
};

await mkdir(absolute(`${evidencePath}/selected`), {recursive: true});

const [production, fetchManifest, oldIos9Sources, oldIos10Sources] =
  await Promise.all([
    readJson(`${evidencePath}/production-snapshot.json`),
    readJson(`${evidencePath}/fetch-manifest.json`),
    readJson(`${oldIos9Packet}/sources.json`),
    readJson(`${oldIos10Packet}/sources.json`),
  ]);

assert(production.batchId === batchId, "Unexpected production snapshot.");
assert(fetchManifest.batchId === batchId, "Unexpected fetch manifest.");
assert(
  fetchManifest.sourceCount === 14 &&
    fetchManifest.allExpectedMarkersFound === true,
  "Expected fourteen fully identified new source captures.",
);

const cycleSpecs = [
  {
    version: "9.2.1",
    releaseVersionId: "version-ios-9-2-1",
    stableDate: "2016-01-19",
    dates: ["2015-12-16", "2016-01-04"],
    nextTestedOrdinal: 3,
    closureSourceIds: ["negative-ios921-final-appleinsider"],
    exactSearchQueries: [
      "\"iOS 9.2.1 beta 3\" developer",
      "\"iOS 9.2.1 third beta\" developer",
    ],
  },
  {
    version: "10.2.1",
    releaseVersionId: "version-ios-10-2-1",
    stableDate: "2017-01-23",
    dates: ["2016-12-14", "2016-12-20", "2017-01-09", "2017-01-12"],
    nextTestedOrdinal: 5,
    closureSourceIds: ["negative-ios1021-final-appleinsider"],
    exactSearchQueries: [
      "\"iOS 10.2.1 beta 5\" developer",
      "\"iOS 10.2.1 fifth beta\" developer",
    ],
  },
  {
    version: "10.3.2",
    releaseVersionId: "version-ios-10-3-2",
    stableDate: "2017-05-15",
    dates: [
      "2017-03-28",
      "2017-04-10",
      "2017-04-17",
      "2017-04-24",
      "2017-04-27",
    ],
    nextTestedOrdinal: 6,
    closureSourceIds: [
      "negative-ios1032-final-forbes",
      "conflict-ios1032-final-macrumors",
    ],
    exactSearchQueries: [
      "\"iOS 10.3.2 beta 6\" developer",
      "\"iOS 10.3.2 sixth beta\" developer",
    ],
  },
  {
    version: "10.3.3",
    releaseVersionId: "version-ios-10-3-3",
    stableDate: "2017-07-19",
    dates: [
      "2017-05-16",
      "2017-05-30",
      "2017-06-13",
      "2017-06-22",
      "2017-06-28",
      "2017-07-05",
    ],
    nextTestedOrdinal: 7,
    closureSourceIds: [
      "negative-ios1033-final-macrumors",
      "negative-ios1033-final-forbes",
    ],
    exactSearchQueries: [
      "\"iOS 10.3.3 beta 7\" developer",
      "\"iOS 10.3.3 seventh beta\" developer",
    ],
  },
];

const candidateId = (version, sequence) =>
  `candidate:apple:ios:${version}:beta-${sequence}`;
const idsForVersion = (version) => {
  const cycle = cycleSpecs.find((item) => item.version === version);
  return cycle.dates.map((_, index) => candidateId(version, index + 1));
};

const manualRetainedSpecs = [
  {
    sourceId: "source-ios921-b1-macrumors-dev",
    parentSourceId: null,
    rawPath: "tmp/ios9-point-evidence/mr-ios-9-2-1-beta-1.html",
    canonicalUrl:
      "https://www.macrumors.com/2015/12/16/apple-seeds-first-921-beta-to-devs/",
    title: "Apple Seeds First Beta of iOS 9.2.1 to Developers",
    publisher: "MacRumors",
    author: "Juli Clover",
    publishedAt: "2015-12-16T10:04:56-08:00",
    candidateIds: [candidateId("9.2.1", 1)],
    marker: "Apple Seeds First Beta of iOS 9.2.1 to Developers",
    excerpt:
      "Apple today seeded the first beta of an upcoming iOS 9.2.1 update to developers for testing purposes.",
    supportNote:
      "Direct contemporary report explicitly identifies developer Beta 1 and its December 16 appearance.",
  },
  {
    sourceId: "source-ios921-b1-9to5mac-dev",
    parentSourceId: null,
    rawPath: "tmp/ios9-point-evidence/9to5-ios-9-2-1-beta-1.html",
    canonicalUrl: "https://9to5mac.com/2015/12/16/ios-9-2-1-beta-1/",
    title: "Apple releases first iOS 9.2.1 beta for testing",
    publisher: "9to5Mac",
    author: "Zac Hall",
    publishedAt: "2015-12-16T18:09:47+00:00",
    candidateIds: [candidateId("9.2.1", 1)],
    marker: "Apple has released the first iOS 9.2.1 beta to developers",
    excerpt:
      "Apple has released the first iOS 9.2.1 beta to developers for testing on iPhone, iPad, and iPod touch.",
    supportNote:
      "Independent direct contemporary report explicitly identifies developer Beta 1 and its December 16 appearance.",
  },
  {
    sourceId: "source-ios921-b2-macrumors-dev",
    parentSourceId: "source-ios921-pb2-macrumors",
    rawPath: "tmp/ios9-point-evidence/mr-ios-9-2-1-beta-2.html",
    canonicalUrl:
      "https://www.macrumors.com/2016/01/04/apple-seeds-second-beta-of-ios-9-2-1/",
    title:
      "Apple Seeds Second Beta of iOS 9.2.1 to Developers and Public Beta Testers",
    publisher: "MacRumors",
    author: "Juli Clover",
    publishedAt: "2016-01-04T10:00:56-08:00",
    candidateIds: [candidateId("9.2.1", 2)],
    marker: "Apple Seeds Second Beta of iOS 9.2.1",
    excerpt:
      "Apple today seeded the second beta of an upcoming iOS 9.2.1 update to developers and public beta testers.",
    supportNote:
      "Direct contemporary report explicitly identifies developer Beta 2 and its January 4 appearance.",
  },
  {
    sourceId: "source-ios921-b2-9to5mac-dev",
    parentSourceId: "source-ios921-pb2-9to5mac",
    rawPath: "tmp/ios9-point-evidence/9to5-ios-9-2-1-beta-2.html",
    canonicalUrl:
      "https://9to5mac.com/2016/01/04/apple-releases-ios-9-2-1-beta-for-developers/",
    title:
      "Apple releases iOS 9.2.1 beta 2 for developers and public beta testers",
    publisher: "9to5Mac",
    author: "Benjamin Mayo",
    publishedAt: "2016-01-04T18:04:53+00:00",
    candidateIds: [candidateId("9.2.1", 2)],
    marker:
      "Apple releases iOS 9.2.1 beta 2 for developers and public beta testers",
    excerpt:
      "Apple has seeded the second beta of iOS 9.2.1 for developers and pre-release testers.",
    supportNote:
      "Independent direct contemporary report explicitly identifies developer Beta 2 and its January 4 appearance.",
  },
  {
    sourceId: "source-ios921-final-macrumors-aggregate-conflict",
    parentSourceId: "source-ios921-final-macrumors",
    rawPath: "tmp/ios9-point-evidence/mr-ios-9-2-1-public.html",
    canonicalUrl:
      "https://www.macrumors.com/2016/01/19/apple-releases-ios-9-2-1/",
    title: "Apple Releases iOS 9.2.1 With Bug Fixes",
    publisher: "MacRumors",
    author: "Juli Clover",
    publishedAt: "2016-01-19T10:00:09-08:00",
    candidateIds: idsForVersion("9.2.1"),
    marker:
      "developers and public beta testers receiving a total of three betas",
    excerpt:
      "Developers and public beta testers received a total of three betas ahead of the launch of iOS 9.2.1.",
    roles: ["aggregateCountConflict", "cycleClosure"],
    supportNote:
      "Preserves ambiguous cross-channel aggregate wording; it cannot establish a developer Beta 3.",
  },
];

const retainedIos10Specs = [
  {
    sourceId: "source-ios1021-pb1-macrumors",
    candidateIds: [candidateId("10.2.1", 1)],
    marker: "one day after seeding the two new releases to developers",
  },
  {
    sourceId: "source-ios1021-pb2-macrumors",
    candidateIds: [candidateId("10.2.1", 2)],
    marker: "one day after providing the second beta to developers",
  },
  {
    sourceId: "source-ios1021-pb2-appleinsider",
    candidateIds: [candidateId("10.2.1", 2)],
    marker: "Following up on Tuesday's developer seeds",
  },
  {
    sourceId: "source-ios1021-pb3-macrumors",
    candidateIds: [candidateId("10.2.1", 3)],
    marker: "third beta of an upcoming iOS 10.2.1 update to developers",
  },
  {
    sourceId: "source-ios1021-pb3-osxdaily",
    candidateIds: [candidateId("10.2.1", 3)],
    marker: "iOS 10.2.1 beta 3",
  },
  {
    sourceId: "source-ios1021-pb4-macrumors",
    candidateIds: [candidateId("10.2.1", 4)],
    marker: "fourth beta of an upcoming iOS 10.2.1 update to developers",
  },
  {
    sourceId: "source-ios1021-pb4-appleinsider",
    candidateIds: [candidateId("10.2.1", 4)],
    marker: "fourth iteration of the forthcoming operating system",
  },
  {
    sourceId: "source-ios1032-pb1-macrumors",
    candidateIds: [candidateId("10.3.2", 1)],
    marker: "first released to developers on March 28",
  },
  {
    sourceId: "source-ios1032-pb2-macrumors",
    candidateIds: [candidateId("10.3.2", 2)],
    marker: "day after releasing the second beta to developers",
  },
  {
    sourceId: "source-ios1032-pb3-macrumors-update",
    candidateIds: [candidateId("10.3.2", 3)],
    marker: "third beta of an upcoming iOS 10.3.2 update to developers",
  },
  {
    sourceId: "source-ios1032-pb3-9to5mac",
    candidateIds: [candidateId("10.3.2", 3)],
    marker: "developer version of the upcoming software update",
  },
  {
    sourceId: "source-ios1032-pb4-macrumors",
    candidateIds: [candidateId("10.3.2", 4)],
    marker: "fourth beta of an upcoming iOS 10.3.2 update to developers",
  },
  {
    sourceId: "source-ios1032-pb5-macrumors",
    candidateIds: [candidateId("10.3.2", 5)],
    marker: "fifth beta of an upcoming iOS 10.3.2 update to developers",
  },
  {
    sourceId: "source-ios1032-pb5-macerkopf",
    candidateIds: [candidateId("10.3.2", 5)],
    marker: "eingetragene Entwickler die iOS 10.3.2 Beta 5",
  },
  {
    sourceId: "source-ios1033-pb1-9to5mac",
    candidateIds: [candidateId("10.3.3", 1)],
    marker: "first iOS 10.3.3 developer beta yesterday",
  },
  {
    sourceId: "source-ios1033-pb2-macrumors",
    candidateIds: [candidateId("10.3.3", 2)],
    marker: "second beta of an upcoming iOS 10.3.3 update to developers",
  },
  {
    sourceId: "source-ios1033-pb3-macrumors",
    candidateIds: [candidateId("10.3.3", 3)],
    marker: "third beta of an upcoming iOS 10.3.3 update to developers",
  },
  {
    sourceId: "source-ios1033-pb3-macerkopf",
    candidateIds: [candidateId("10.3.3", 3)],
    marker: "Beta 3 veröffentlicht und lädt Entwickler",
  },
  {
    sourceId: "source-ios1033-pb4-macrumors",
    candidateIds: [candidateId("10.3.3", 4)],
    marker: "fourth beta of an upcoming iOS 10.3.3 update to developers",
  },
  {
    sourceId: "source-ios1033-pb4-zollotech-video",
    candidateIds: [candidateId("10.3.3", 4)],
    marker: "Beta 4 to developers and public beta testers",
  },
  {
    sourceId: "source-ios1033-pb5-macrumors",
    candidateIds: [candidateId("10.3.3", 5)],
    marker: "fifth beta of an upcoming iOS 10.3.3 update to developers",
  },
  {
    sourceId: "source-ios1033-pb6-macrumors",
    candidateIds: [candidateId("10.3.3", 6)],
    marker: "sixth beta of an upcoming iOS 10.3.3 update to developers",
  },
  {
    sourceId: "source-ios1033-pb6-macobserver",
    candidateIds: [candidateId("10.3.3", 6)],
    marker: "The sixth beta is available now for developers",
  },
];

const newSourceSpecs = {
  "new-ios1021-b1-idb-direct": {
    publisher: "iDownloadBlog",
    candidateIds: [candidateId("10.2.1", 1)],
    roles: ["developerAvailability", "developerOrdinal", "appearanceDate"],
    supportNote:
      "Direct contemporary report explicitly identifies developer Beta 1 on December 14.",
  },
  "new-ios1032-b1-idb-direct": {
    publisher: "iDownloadBlog",
    candidateIds: [candidateId("10.3.2", 1)],
    roles: ["developerAvailability", "developerOrdinal", "appearanceDate"],
    supportNote:
      "Direct contemporary report explicitly identifies developer Beta 1 on March 28.",
  },
  "new-ios1032-b2-idb-direct": {
    publisher: "iDownloadBlog",
    candidateIds: [candidateId("10.3.2", 2)],
    roles: ["developerAvailability", "developerOrdinal", "appearanceDate"],
    supportNote:
      "Direct contemporary report explicitly identifies developer Beta 2 on April 10.",
  },
  "new-ios1032-b4-idb-direct": {
    publisher: "iDownloadBlog",
    candidateIds: [candidateId("10.3.2", 4)],
    roles: ["developerAvailability", "developerOrdinal", "appearanceDate"],
    supportNote:
      "Direct contemporary report explicitly identifies developer Beta 4 on April 24.",
  },
  "new-ios1032-b5-idb-direct": {
    publisher: "iDownloadBlog",
    candidateIds: [candidateId("10.3.2", 5)],
    roles: ["developerAvailability", "developerOrdinal", "appearanceDate"],
    supportNote:
      "Direct contemporary report explicitly identifies developer Beta 5 on April 27.",
  },
  "new-ios1033-b1-idb-direct": {
    publisher: "iDownloadBlog",
    candidateIds: [candidateId("10.3.3", 1)],
    roles: ["developerAvailability", "developerOrdinal", "appearanceDate"],
    supportNote:
      "Direct contemporary report explicitly identifies developer Beta 1 on May 16.",
  },
  "new-ios1033-b2-idb-direct": {
    publisher: "iDownloadBlog",
    candidateIds: [candidateId("10.3.3", 2)],
    roles: ["developerAvailability", "developerOrdinal", "appearanceDate"],
    supportNote:
      "Direct contemporary report explicitly identifies developer Beta 2 on May 30.",
  },
  "new-ios1033-b5-idb-direct": {
    publisher: "iDownloadBlog",
    candidateIds: [candidateId("10.3.3", 5)],
    roles: ["developerAvailability", "developerOrdinal", "appearanceDate"],
    supportNote:
      "Direct contemporary report explicitly identifies developer Beta 5 on June 28.",
  },
  "negative-ios921-final-appleinsider": {
    publisher: "AppleInsider",
    candidateIds: idsForVersion("9.2.1"),
    roles: ["cycleClosure", "negativeLaterOrdinal", "developerSequenceCount"],
    supportNote:
      "Stable-release report explicitly states that the cycle had two developer betas.",
  },
  "negative-ios1021-final-appleinsider": {
    publisher: "AppleInsider",
    candidateIds: idsForVersion("10.2.1"),
    roles: ["cycleClosure", "negativeLaterOrdinal", "sequenceCount"],
    supportNote:
      "Stable-release report explicitly states that the cycle had four betas seeded to developers and the public.",
  },
  "conflict-ios1032-final-macrumors": {
    publisher: "MacRumors",
    candidateIds: idsForVersion("10.3.2"),
    roles: ["cycleClosure", "aggregateCountConflict"],
    supportNote:
      "Preserves the erroneous four-beta aggregate against direct contemporary Beta 5 reports.",
  },
  "negative-ios1032-final-forbes": {
    publisher: "Forbes",
    candidateIds: idsForVersion("10.3.2"),
    roles: ["cycleClosure", "negativeLaterOrdinal", "sequenceCount"],
    supportNote:
      "Stable-release report explicitly states that five betas preceded the final release.",
  },
  "negative-ios1033-final-macrumors": {
    publisher: "MacRumors",
    candidateIds: idsForVersion("10.3.3"),
    roles: ["cycleClosure", "negativeLaterOrdinal", "sequenceCount"],
    supportNote:
      "Stable-release report explicitly states that six betas preceded the final release.",
  },
  "negative-ios1033-final-forbes": {
    publisher: "Forbes",
    candidateIds: idsForVersion("10.3.3"),
    roles: ["cycleClosure", "negativeLaterOrdinal", "sequenceCount"],
    supportNote:
      "Independent stable-release report explicitly states that six betas preceded the final release.",
  },
};

const oldIos9ById = new Map(
  oldIos9Sources.sources.map((source) => [source.sourceId, source]),
);
const oldIos10ById = new Map(
  oldIos10Sources.sources.map((source) => [source.sourceId, source]),
);
const sourceRecords = [];
const retainedReinspections = [];

for (const spec of manualRetainedSpecs) {
  const raw = await readFile(absolute(spec.rawPath));
  const rawText = raw.toString("utf8");
  assert(
    rawText.toLocaleLowerCase().includes(spec.marker.toLocaleLowerCase()),
    `Retained locator missing for ${spec.sourceId}.`,
  );
  const selectedPath = `${evidencePath}/selected/${spec.sourceId}.selected.txt`;
  const selectedText = [
    `SOURCE ID: ${spec.sourceId}`,
    `RETAINED RAW: ${spec.rawPath}`,
    `CANONICAL URL: ${spec.canonicalUrl}`,
    `TITLE: ${spec.title}`,
    `PUBLISHED: ${spec.publishedAt}`,
    `LOCATOR MARKER: ${spec.marker}`,
    "",
    `Bounded identification excerpt: ${spec.excerpt}`,
    "",
  ].join("\n");
  await writeFile(absolute(selectedPath), selectedText);
  const selected = Buffer.from(selectedText);
  const parentSource = spec.parentSourceId
    ? oldIos9ById.get(spec.parentSourceId)
    : null;
  if (spec.parentSourceId) {
    assert(parentSource, `Missing prior iOS 9 source ${spec.parentSourceId}.`);
    assert(
      parentSource.evidence.rawSha256 === sha256(raw),
      `Prior raw hash drift for ${spec.sourceId}.`,
    );
  }
  const roles = spec.roles ?? [
    "developerAvailability",
    "developerOrdinal",
    "appearanceDate",
    "channelIdentity",
  ];
  sourceRecords.push({
    sourceId: spec.sourceId,
    canonicalUrl: spec.canonicalUrl,
    finalUrl: spec.canonicalUrl,
    title: spec.title,
    publisher: spec.publisher,
    author: spec.author,
    publishedAt: spec.publishedAt,
    publishedDateObserved: spec.publishedAt.slice(0, 10),
    accessedAt: "2026-07-31",
    sourceClass: "journalism",
    candidateIds: spec.candidateIds,
    roles,
    supportNote: spec.supportNote,
    evidence: {
      rawPath: spec.rawPath,
      rawBytes: raw.byteLength,
      rawSha256: sha256(raw),
      selectedPath,
      selectedTextBytes: selected.byteLength,
      selectedTextSha256: sha256(selected),
      captureMethod: "retained-http-html-reinspected",
      locator:
        "Retained raw page headline/metadata and candidate-specific lead; bounded identification excerpt is packet-local.",
      locatorMarker: spec.marker,
    },
    lineage: {
      publisherFamily: spec.publisher,
      independentForCorroboration: true,
      notes:
        "Direct contemporary publisher page. URLs in one publisher family count as one editorial lineage.",
    },
  });
  retainedReinspections.push({
    sourceId: spec.sourceId,
    retainedFrom:
      spec.parentSourceId === null
        ? "retained raw artifact not previously entered in the packet ledger"
        : `${oldIos9Packet}/sources.json#${spec.parentSourceId}`,
    priorLedgerSourceId: spec.parentSourceId,
    rawPath: spec.rawPath,
    expectedRawBytes:
      parentSource?.evidence.rawBytes ?? raw.byteLength,
    expectedRawSha256:
      parentSource?.evidence.rawSha256 ?? sha256(raw),
    observedRawBytes: raw.byteLength,
    observedRawSha256: sha256(raw),
    rawHashMatch: true,
    locatorMarker: spec.marker,
    locatorFound: true,
    selectedPath,
    selectedTextBytes: selected.byteLength,
    selectedTextSha256: sha256(selected),
    conclusion:
      "Retained bytes and candidate-specific locator were reproduced before reuse.",
  });
}

for (const spec of retainedIos10Specs) {
  const parentSource = oldIos10ById.get(spec.sourceId);
  assert(parentSource, `Missing retained iOS 10 source ${spec.sourceId}.`);
  const [raw, selected] = await Promise.all([
    readFile(absolute(parentSource.evidence.rawPath)),
    readFile(absolute(parentSource.evidence.selectedPath)),
  ]);
  const selectedText = selected.toString("utf8");
  assert(
    raw.byteLength === parentSource.evidence.rawBytes &&
      sha256(raw) === parentSource.evidence.rawSha256,
    `Retained raw hash drift for ${spec.sourceId}.`,
  );
  assert(
    selected.byteLength === parentSource.evidence.selectedTextBytes &&
      sha256(selected) === parentSource.evidence.selectedTextSha256,
    `Retained selected hash drift for ${spec.sourceId}.`,
  );
  assert(
    selectedText.toLocaleLowerCase().includes(spec.marker.toLocaleLowerCase()),
    `Retained selected locator missing for ${spec.sourceId}.`,
  );
  sourceRecords.push({
    ...parentSource,
    candidateIds: spec.candidateIds,
    roles: [
      "developerAvailability",
      "developerOrdinal",
      "appearanceDate",
      "channelIdentity",
    ],
    supportNote:
      "Reinspected contemporary report supports the exact developer-beta identity and appearance date.",
    evidence: {
      ...parentSource.evidence,
      captureMethod: "retained-http-html-reinspected",
      locatorMarker: spec.marker,
    },
    lineage: {
      ...parentSource.lineage,
      independentForCorroboration: true,
      notes:
        "Direct contemporary publisher page; independently usable for this developer-beta identity after candidate-specific reinspection.",
    },
  });
  retainedReinspections.push({
    sourceId: spec.sourceId,
    retainedFrom: `${oldIos10Packet}/sources.json#${spec.sourceId}`,
    priorLedgerSourceId: spec.sourceId,
    rawPath: parentSource.evidence.rawPath,
    expectedRawBytes: parentSource.evidence.rawBytes,
    expectedRawSha256: parentSource.evidence.rawSha256,
    observedRawBytes: raw.byteLength,
    observedRawSha256: sha256(raw),
    rawHashMatch: true,
    locatorMarker: spec.marker,
    locatorFound: true,
    selectedPath: parentSource.evidence.selectedPath,
    expectedSelectedTextBytes: parentSource.evidence.selectedTextBytes,
    expectedSelectedTextSha256:
      parentSource.evidence.selectedTextSha256,
    observedSelectedTextBytes: selected.byteLength,
    observedSelectedTextSha256: sha256(selected),
    selectedHashMatch: true,
    conclusion:
      "Retained raw and selected bytes, hashes, and candidate-specific locator were reproduced before reuse.",
  });
}

for (const capture of fetchManifest.sources) {
  const spec = newSourceSpecs[capture.sourceId];
  assert(spec, `No source specification for ${capture.sourceId}.`);
  const [raw, selected] = await Promise.all([
    readFile(absolute(capture.evidence.rawPath)),
    readFile(absolute(capture.evidence.selectedPath)),
  ]);
  assert(
    raw.byteLength === capture.evidence.rawBytes &&
      sha256(raw) === capture.evidence.rawSha256,
    `New raw hash drift for ${capture.sourceId}.`,
  );
  assert(
    selected.byteLength === capture.evidence.selectedTextBytes &&
      sha256(selected) === capture.evidence.selectedTextSha256,
    `New selected hash drift for ${capture.sourceId}.`,
  );
  assert(
    capture.markerChecks.every((check) => check.found),
    `New source marker failure for ${capture.sourceId}.`,
  );
  sourceRecords.push({
    sourceId: capture.sourceId,
    canonicalUrl: capture.canonicalUrl,
    finalUrl: capture.finalUrl,
    title: capture.parsed.title,
    publisher: spec.publisher,
    author: capture.parsed.author,
    publishedAt: capture.parsed.publishedAt,
    publishedDateObserved: capture.parsed.publishedAt?.slice(0, 10) ?? null,
    accessedAt: "2026-07-31",
    sourceClass: "journalism",
    candidateIds: spec.candidateIds,
    roles: spec.roles,
    supportNote: spec.supportNote,
    evidence: {
      ...capture.evidence,
      locator:
        "Page metadata, headline, and article passage containing every expected identification marker.",
      locatorMarkers: capture.markerChecks.map((check) => check.marker),
    },
    lineage: {
      publisherFamily: spec.publisher,
      independentForCorroboration: true,
      notes:
        "Direct contemporary publisher page. URLs in one publisher family count as one editorial lineage.",
    },
  });
}

assert(sourceRecords.length === 42, "Expected forty-two packet sources.");
assert(
  new Set(sourceRecords.map((source) => source.sourceId)).size ===
    sourceRecords.length,
  "Source IDs are not unique.",
);
assert(
  retainedReinspections.length === 28,
  "Expected twenty-eight retained-source reinspections.",
);

const refsByCandidate = {
  [candidateId("9.2.1", 1)]: [
    "source-ios921-b1-macrumors-dev",
    "source-ios921-b1-9to5mac-dev",
  ],
  [candidateId("9.2.1", 2)]: [
    "source-ios921-b2-macrumors-dev",
    "source-ios921-b2-9to5mac-dev",
  ],
  [candidateId("10.2.1", 1)]: [
    "new-ios1021-b1-idb-direct",
    "source-ios1021-pb1-macrumors",
  ],
  [candidateId("10.2.1", 2)]: [
    "source-ios1021-pb2-macrumors",
    "source-ios1021-pb2-appleinsider",
  ],
  [candidateId("10.2.1", 3)]: [
    "source-ios1021-pb3-macrumors",
    "source-ios1021-pb3-osxdaily",
  ],
  [candidateId("10.2.1", 4)]: [
    "source-ios1021-pb4-macrumors",
    "source-ios1021-pb4-appleinsider",
  ],
  [candidateId("10.3.2", 1)]: [
    "new-ios1032-b1-idb-direct",
    "source-ios1032-pb1-macrumors",
  ],
  [candidateId("10.3.2", 2)]: [
    "new-ios1032-b2-idb-direct",
    "source-ios1032-pb2-macrumors",
  ],
  [candidateId("10.3.2", 3)]: [
    "source-ios1032-pb3-macrumors-update",
    "source-ios1032-pb3-9to5mac",
  ],
  [candidateId("10.3.2", 4)]: [
    "source-ios1032-pb4-macrumors",
    "new-ios1032-b4-idb-direct",
  ],
  [candidateId("10.3.2", 5)]: [
    "source-ios1032-pb5-macrumors",
    "source-ios1032-pb5-macerkopf",
    "new-ios1032-b5-idb-direct",
  ],
  [candidateId("10.3.3", 1)]: [
    "new-ios1033-b1-idb-direct",
    "source-ios1033-pb1-9to5mac",
  ],
  [candidateId("10.3.3", 2)]: [
    "source-ios1033-pb2-macrumors",
    "new-ios1033-b2-idb-direct",
  ],
  [candidateId("10.3.3", 3)]: [
    "source-ios1033-pb3-macrumors",
    "source-ios1033-pb3-macerkopf",
  ],
  [candidateId("10.3.3", 4)]: [
    "source-ios1033-pb4-macrumors",
    "source-ios1033-pb4-zollotech-video",
  ],
  [candidateId("10.3.3", 5)]: [
    "source-ios1033-pb5-macrumors",
    "new-ios1033-b5-idb-direct",
  ],
  [candidateId("10.3.3", 6)]: [
    "source-ios1033-pb6-macrumors",
    "source-ios1033-pb6-macobserver",
  ],
};
const sourceById = new Map(
  sourceRecords.map((source) => [source.sourceId, source]),
);
const exactCheckByKey = new Map(
  production.exactChecks.map((check) => [
    `${check.releaseVersionId}\u0000${check.routeAlias}`,
    check,
  ]),
);

const candidates = cycleSpecs.flatMap((cycle) =>
  cycle.dates.map((appearanceDate, index) => {
    const sequence = index + 1;
    const id = candidateId(cycle.version, sequence);
    const evidenceIds = refsByCandidate[id];
    assert(evidenceIds?.length >= 2, `Missing evidence mapping for ${id}.`);
    const families = new Set(
      evidenceIds.map(
        (sourceId) => sourceById.get(sourceId)?.lineage.publisherFamily,
      ),
    );
    assert(families.size >= 2, `${id} lacks two publisher lineages.`);
    const exactCheck = exactCheckByKey.get(
      `${cycle.releaseVersionId}\u0000beta-${sequence}`,
    );
    assert(
      exactCheck?.exactIdentityMatches === 0,
      `${id} unexpectedly exists in production.`,
    );
    return {
      candidateId: id,
      originCohortId: "developer-gap-priority",
      platform: "iOS",
      platformId: "platform-ios",
      version: cycle.version,
      releaseVersionId: cycle.releaseVersionId,
      proposedIdentity: {
        label: `Beta ${sequence}`,
        routeAlias: `beta-${sequence}`,
        channel: "developerBeta",
        appearanceDate,
        sequence,
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
          "Fresh read-only published/no-CDN production query found the releaseVersion parent, zero scoped developerBeta events, and zero exact {releaseVersionId, channel, routeAlias} matches.",
        exactIdentityMatches: 0,
      },
      evidenceRefs: evidenceIds.map((sourceId) => {
        const source = sourceById.get(sourceId);
        return {
          kind: "packetSource",
          packetPath: `${packetPath}/sources.json`,
          sourceId,
          locator: source.evidence.locator,
          supports: source.supportNote,
        };
      }),
      buildEvidenceStatus: "absent",
      contentDisposition: "timelineOnly",
      blockers: ["Independent chronology review has not yet occurred."],
      review: {
        required: true,
        reviewer: null,
        reviewedAt: null,
        notes:
          "The research agent reproduced source bytes, hashes, locators, full-sequence checks, and production reconciliation but cannot self-approve.",
      },
      flags: {
        sanityMutationAllowed: false,
        publicationEligible: false,
        stableEventIdCreationAllowed: false,
      },
    };
  }),
);

assert(candidates.length === 17, "Expected seventeen candidates.");

const sequenceAudits = cycleSpecs.map((cycle) => ({
  version: cycle.version,
  releaseVersionId: cycle.releaseVersionId,
  stableReleaseDate: cycle.stableDate,
  observedDeveloperSequence: cycle.dates.map((appearanceDate, index) => ({
    sequence: index + 1,
    routeAlias: `beta-${index + 1}`,
    appearanceDate,
    candidateId: candidateId(cycle.version, index + 1),
    evidenceSourceIds: refsByCandidate[
      candidateId(cycle.version, index + 1)
    ],
    publisherFamilies: [
      ...new Set(
        refsByCandidate[candidateId(cycle.version, index + 1)].map(
          (sourceId) => sourceById.get(sourceId).lineage.publisherFamily,
        ),
      ),
    ],
  })),
  continuityChecks: {
    firstOrdinal: 1,
    lastObservedOrdinal: cycle.dates.length,
    missingOrdinalsWithinObservedRange: [],
    duplicateOrdinals: [],
    withdrawalOrRespinsObserved: false,
    withdrawalOrRespinsConclusion:
      "No contemporaneous source in the inspected lineages reported a withdrawal, replacement seed, same-ordinal respin, or return. This is a bounded not-observed result.",
  },
  negativeLaterOrdinalAudit: {
    testedRouteAlias: `beta-${cycle.nextTestedOrdinal}`,
    testedSequence: cycle.nextTestedOrdinal,
    exactSearchQueries: cycle.exactSearchQueries,
    searchResult: "noPositiveContemporarySourceLocated",
    closureSourceIds: cycle.closureSourceIds,
    conclusion:
      `No Beta ${cycle.nextTestedOrdinal} identity is proposed. The stable-release boundary and retained aggregate sequence evidence close the observed consecutive run at Beta ${cycle.dates.length}.`,
    limitation:
      "Negative web searching alone is not treated as proof; the conclusion is paired with the stable-release date and explicit aggregate sequence reporting.",
  },
  cycleDisposition: "completeConsecutiveDeveloperSequencePendingReview",
}));

const conflicts = [
  {
    conflictId: "conflict-ios921-cross-channel-aggregate-three",
    version: "9.2.1",
    type: "ambiguousAggregateCountAcrossChannels",
    sourcePositions: [
      {
        sourceId: "source-ios921-final-macrumors-aggregate-conflict",
        position:
          "Says developers and public beta testers received a total of three betas; it does not say there was developer Beta 3.",
      },
      {
        sourceId: "negative-ios921-final-appleinsider",
        position:
          "Explicitly says there were two developer betas before the final release.",
      },
    ],
    directIdentityEvidence: [
      "source-ios921-b1-macrumors-dev",
      "source-ios921-b1-9to5mac-dev",
      "source-ios921-b2-macrumors-dev",
      "source-ios921-b2-9to5mac-dev",
    ],
    resolution:
      "Keep developer Betas 1 and 2 only. Preserve the three-beta wording as an ambiguous cross-channel aggregate; never convert it into developer Beta 3.",
    blocksCandidateApproval: false,
    requiresReviewerAttention: true,
  },
  {
    conflictId: "conflict-ios1032-final-four-versus-beta-five",
    version: "10.3.2",
    type: "aggregateCountContradictedByDirectIdentityEvidence",
    sourcePositions: [
      {
        sourceId: "conflict-ios1032-final-macrumors",
        position:
          "Final-release lead says iOS 10.3.2 followed four betas.",
      },
      {
        sourceId: "negative-ios1032-final-forbes",
        position:
          "Final-release report says five betas preceded the final version.",
      },
    ],
    directIdentityEvidence: [
      "source-ios1032-pb5-macrumors",
      "source-ios1032-pb5-macerkopf",
      "new-ios1032-b5-idb-direct",
    ],
    resolution:
      "Keep Beta 5. Three independent contemporary reports explicitly identify it on April 27; classify the later four-beta aggregate as a reporting error.",
    blocksCandidateApproval: false,
    requiresReviewerAttention: true,
  },
];

const assignment = {
  formatVersion: 1,
  batchId,
  createdAt: generatedAt,
  createdBy: "research-agent",
  researchCutoff,
  vendor: "Apple",
  platform: "iOS",
  channel: "developerBeta",
  cohortId: "developer-gap-priority",
  scopeRule:
    "Exact numbered developer-beta identities for iOS 9.2.1, 10.2.1, 10.3.2, and 10.3.3 before each stable release. Public-only identities, RCs, inferred builds, release-note prose, and stable IDs are excluded.",
  targetCount: candidates.length,
  targets: candidates.map((candidate) => ({
    candidateId: candidate.candidateId,
    version: candidate.version,
    releaseVersionId: candidate.releaseVersionId,
    routeAlias: candidate.proposedIdentity.routeAlias,
    appearanceDate: candidate.proposedIdentity.appearanceDate,
  })),
  safety: {
    productionQueriesReadOnly: true,
    sanityMutationAllowed: false,
    publicationAuthorized: false,
    stableEventIdCreationAllowed: false,
    independentReviewRequired: true,
  },
};

const sourcesDocument = {
  formatVersion: 1,
  batchId,
  createdAt: generatedAt,
  accessedAt: "2026-07-31",
  sourceCount: sourceRecords.length,
  retainedReinspectedSourceCount: retainedReinspections.length,
  newlyCapturedSourceCount: fetchManifest.sourceCount,
  lineagePolicy:
    "Multiple URLs from one publisher family count as one editorial lineage. Every candidate must resolve to at least two distinct independent publisher families.",
  sources: sourceRecords,
};
const reinspectionDocument = {
  formatVersion: 1,
  batchId,
  createdAt: generatedAt,
  sourceCount: retainedReinspections.length,
  result:
    "All retained raw hashes, available selected-text hashes, and candidate-specific locators reproduced before reuse.",
  sources: retainedReinspections,
};
const candidatesDocument = {
  formatVersion: 1,
  programId: "apple-beta-chronology-gap",
  batchId,
  createdAt: generatedAt,
  schemaPath: `${packetPath}/developer-candidate.schema.json`,
  cohort: {
    cohortId: "developer-gap-priority",
    candidateCount: candidates.length,
    platform: "iOS",
    channel: "developerBeta",
  },
  candidates,
  safety: {
    researchOnly: true,
    mutationAuthorized: false,
    stableIdsAllocated: 0,
    publicationAuthorized: false,
  },
};
const sequenceDocument = {
  formatVersion: 1,
  batchId,
  createdAt: generatedAt,
  cycleCount: sequenceAudits.length,
  positiveIdentityCount: candidates.length,
  negativeNextOrdinalTestCount: sequenceAudits.length,
  skippedOrdinalCount: 0,
  withdrawalOrRespinCount: 0,
  audits: sequenceAudits,
  methodology:
    "Each cycle was reconstructed from Beta 1 through its last supported explicit ordinal, checked for gaps and duplicate ordinals, tested for the next ordinal, bounded by the stable release, and compared with aggregate sequence reporting. Absence searches are recorded as bounded negative evidence, not standalone proof.",
};
const conflictsDocument = {
  formatVersion: 1,
  batchId,
  createdAt: generatedAt,
  conflictCount: conflicts.length,
  conflicts,
};
const selfReview = {
  formatVersion: 1,
  batchId,
  reviewedAt: generatedAt,
  reviewerRole: "research-agent-self-check-not-independent-approval",
  outcome: "readyForIndependentChronologyReview",
  checks: {
    candidateCount: candidates.length,
    exactDeveloperChannelAndRouteShape: true,
    twoPublisherLineagesPerCandidate: true,
    retainedHashesAndLocatorsReproduced: true,
    fullSequencesAudited: true,
    negativeNextOrdinalsAudited: true,
    conflictsPreserved: true,
    productionPublishedNoCdnReadOnly: true,
    exactProductionMatches: 0,
    buildsAsserted: false,
    stableIdsCreated: false,
    sanityWritesPerformed: false,
    publicationPerformed: false,
  },
  independentReview: {
    required: true,
    reviewer: null,
    reviewedAt: null,
    note:
      "Self-review validates packet mechanics only and is not chronology approval.",
  },
};

const report = `# iOS developer-beta priority gap packet

Status: frozen research candidate set pending independent chronology review.

## Result

The packet proposes 17 exact missing \`developerBeta\` identities using \`beta-N\` routes:

| Version | Consecutive developer sequence | Appearance dates | Next ordinal tested |
| --- | --- | --- | --- |
| iOS 9.2.1 | Beta 1–2 | 2015-12-16; 2016-01-04 | Beta 3 not supported |
| iOS 10.2.1 | Beta 1–4 | 2016-12-14; 2016-12-20; 2017-01-09; 2017-01-12 | Beta 5 not supported |
| iOS 10.3.2 | Beta 1–5 | 2017-03-28; 2017-04-10; 2017-04-17; 2017-04-24; 2017-04-27 | Beta 6 not supported |
| iOS 10.3.3 | Beta 1–6 | 2017-05-16; 2017-05-30; 2017-06-13; 2017-06-22; 2017-06-28; 2017-07-05 | Beta 7 not supported |

Every exact identity has at least two independent contemporary publisher lineages. No skipped ordinals, duplicate ordinals, withdrawals, replacements, returns, or same-ordinal respins were observed in the inspected evidence.

## Production reconciliation

The fresh query used the published perspective with CDN disabled and made no mutation. All four release-version parents exist. Production contains zero scoped developer-beta events and zero matches for the 17 exact \`{releaseVersionId, channel: "developerBeta", routeAlias: "beta-N"}\` identities.

## Preserved conflicts

- iOS 9.2.1: one final-release article says developers and public testers received “three betas,” while AppleInsider explicitly counts two developer betas. The ambiguous aggregate cannot establish developer Beta 3.
- iOS 10.3.2: one MacRumors final-release lead says four betas, but MacRumors’ own Beta 5 article plus independent Macerkopf and iDownloadBlog reports explicitly identify Beta 5; Forbes also counts five. Beta 5 remains proposed and the four-beta aggregate is preserved as an error.

## Evidence and safety

The packet contains 42 source records: 28 retained sources reverified byte-for-byte and at their candidate locators, plus 14 newly captured raw/selected pages. Candidate build evidence is deliberately absent, and content is timeline-only.

No stable IDs were allocated. No Sanity writes, publication, page builds, or deployment occurred. The packet does not self-approve; a different reviewer must inspect the chronology and preserved conflicts.
`;

await Promise.all([
  writeJson(`${packetPath}/assignment.json`, assignment),
  writeJson(`${packetPath}/sources.json`, sourcesDocument),
  writeJson(
    `${packetPath}/retained-source-reinspection.json`,
    reinspectionDocument,
  ),
  writeJson(`${packetPath}/candidates.json`, candidatesDocument),
  writeJson(`${packetPath}/full-sequence-audit.json`, sequenceDocument),
  writeJson(`${packetPath}/conflicts.json`, conflictsDocument),
  writeJson(`${packetPath}/self-review.json`, selfReview),
  writeFile(absolute(`${packetPath}/report.md`), report),
  writeFile(
    absolute(`${packetPath}/production-snapshot.json`),
    await readFile(absolute(`${evidencePath}/production-snapshot.json`)),
  ),
]);

console.log(
  JSON.stringify(
    {
      batchId,
      packetPath,
      candidateCount: candidates.length,
      sourceCount: sourceRecords.length,
      retainedReinspectionCount: retainedReinspections.length,
      conflictCount: conflicts.length,
      exactProductionMatches:
        production.productionCounts.exactIdentityMatches,
    },
    null,
    2,
  ),
);
