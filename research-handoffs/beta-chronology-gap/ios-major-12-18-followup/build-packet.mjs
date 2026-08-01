#!/usr/bin/env node

import { createHash } from "node:crypto";
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptPath = fileURLToPath(import.meta.url);
const packetDir = path.dirname(scriptPath);
const repoRoot = path.resolve(packetDir, "../../..");
const batchId = "beta-chronology-gap-ios-major-12-18-followup";
const accessedAt = "2026-07-31";
const fetchLog = JSON.parse(
  await readFile(path.join(packetDir, "fetch-log.json"), "utf8"),
);

const sha256 = (value) =>
  createHash("sha256").update(value).digest("hex");

const wordCount = (value) =>
  value.trim() ? value.trim().split(/\s+/u).length : 0;

const identity = (label, routeAlias, sequence, appearanceDate) => ({
  label,
  routeAlias,
  channel: "publicBeta",
  appearanceDate,
  sequence,
  isRevision: false,
  availabilityState: "available",
  closesReleaseCycle: false,
});

const metadata = {
  "9to5mac-ios12-pb4": {
    title:
      "Apple releases fourth iOS 12, tvOS 12, and macOS Mojave public betas - 9to5Mac",
    publisher: "9to5Mac",
    author: "Zac Hall",
    publishedAt: "2018-07-31T17:02:02+00:00",
    publishedDateObserved: "2018-07-31",
    normalizedPacificDate: "2018-07-31",
    locator:
      "Page metadata and headline explicitly identify the fourth iOS 12 public beta on July 31, 2018.",
    selectedText:
      "Apple releases fourth iOS 12, tvOS 12, and macOS Mojave public betas",
    supports: ["candidate:apple:ios:12.0:public-beta-4"],
  },
  "9to5mac-ios18-pb5": {
    title:
      "iOS 18 public beta 5 and more available ahead of September launch - 9to5Mac",
    publisher: "9to5Mac",
    author: "Ryan Christoffel",
    publishedAt: "2024-08-20T20:06:51+00:00",
    publishedDateObserved: "2024-08-20",
    normalizedPacificDate: "2024-08-20",
    locator:
      "Page metadata, headline, and lead explicitly identify iOS 18 Public Beta 5 on August 20, 2024.",
    selectedText:
      "iOS 18 public beta 5 and more available ahead of September launch",
    supports: ["candidate:apple:ios:18.0:public-beta-5"],
  },
  "appleinsider-ios12-pb1": {
    title: "Apple issues first public betas of iOS 12 and tvOS 12",
    publisher: "AppleInsider",
    author: "AppleInsider Staff",
    publishedAt: "2018-06-25T21:53:00+00:00",
    publishedDateObserved: "2018-06-25",
    normalizedPacificDate: "2018-06-25",
    locator:
      "Page metadata, headline, and description explicitly identify the first iOS 12 public beta on June 25, 2018.",
    selectedText: "Apple issues first public betas of iOS 12 and tvOS 12",
    supports: ["candidate:apple:ios:12.0:public-beta-1"],
  },
  "appleinsider-ios12-pb2": {
    title:
      "Apple issues second public beta of iOS 12 [u: tvOS 12 also available]",
    publisher: "AppleInsider",
    author: "Malcolm Owen",
    publishedAt: "2018-07-05T17:35:00+00:00",
    publishedDateObserved: "2018-07-05",
    normalizedPacificDate: "2018-07-05",
    locator:
      "Page metadata, headline, and description explicitly identify the second iOS 12 public beta on July 5, 2018.",
    selectedText: "Apple issues second public beta of iOS 12",
    supports: ["candidate:apple:ios:12.0:public-beta-2"],
  },
  "appleinsider-ios12-pb3": {
    title: "Apple rolls out third public beta of iOS 12, tvOS 12",
    publisher: "AppleInsider",
    author: "Mike Wuerthele",
    publishedAt: "2018-07-18T17:20:07+00:00",
    publishedDateObserved: "2018-07-18",
    normalizedPacificDate: "2018-07-18",
    locator:
      "Page metadata, headline, and description explicitly identify the third iOS 12 public beta on July 18, 2018.",
    selectedText: "Apple rolls out third public beta of iOS 12, tvOS 12",
    supports: ["candidate:apple:ios:12.0:public-beta-3"],
  },
  "appleinsider-ios17-pb6": {
    title: "Sixth public betas for iOS 17 and others now available",
    publisher: "AppleInsider",
    author: "Wesley Hilliard",
    publishedAt: "2023-08-29T21:31:53+00:00",
    publishedDateObserved: "2023-08-29",
    normalizedPacificDate: "2023-08-29",
    locator:
      "Page metadata, headline, and description explicitly identify the sixth iOS 17 public beta on August 29, 2023.",
    selectedText: "Sixth public betas for iOS 17 and others now available",
    supports: ["candidate:apple:ios:17.0:public-beta-6"],
  },
  "forbes-ios15-pb2": {
    title: "In A Surprise Move, Apple Releases iOS 15 Public Beta 2",
    publisher: "Forbes",
    author: "Anthony Karcz",
    publishedAt: "2021-06-30T16:09:26-04:00",
    publishedDateObserved: "2021-06-30",
    normalizedPacificDate: "2021-06-30",
    locator:
      "Page metadata, headline, and article identify the June 30 iOS 15 public payload as Public Beta 2.",
    selectedText:
      "In A Surprise Move, Apple Releases iOS 15 Public Beta 2",
    supports: ["existing-match:apple:ios:15.0:public-beta-1"],
  },
  "forbes-ios15-pb3": {
    title: "Friday Night Fixes Abound In iOS 15 Public Beta 3",
    publisher: "Forbes",
    author: "Anthony Karcz",
    publishedAt: "2021-07-16T16:42:59-04:00",
    publishedDateObserved: "2021-07-16",
    normalizedPacificDate: "2021-07-16",
    locator:
      "Page metadata, headline, and article identify the July 16 iOS 15 public payload as Public Beta 3.",
    selectedText: "Friday Night Fixes Abound In iOS 15 Public Beta 3",
    supports: [
      "candidate:apple:ios:15.0:public-beta-2",
      "not-proposed:apple:ios:15.0:public-beta-3",
    ],
  },
  "iphonecanada-ios12-pb5": {
    title:
      "iOS 12 Public Beta 5 Download and More Out for Public Testers | iPhone in Canada",
    publisher: "iPhone in Canada",
    author: "Gary Ng",
    publishedAt: "2018-08-06T22:16:16-07:00",
    publishedDateObserved: "2018-08-06",
    normalizedPacificDate: "2018-08-06",
    locator:
      "Page metadata and headline explicitly identify iOS 12 Public Beta 5 on August 6, 2018 Pacific.",
    selectedText:
      "iOS 12 Public Beta 5 Download and More Out for Public Testers",
    supports: ["candidate:apple:ios:12.0:public-beta-5"],
  },
  "iphonecanada-ios14-pb2": {
    title:
      "How to Install iOS 14 Public Beta on iPhone and iPadOS 14 on iPad | iPhone in Canada",
    publisher: "iPhone in Canada",
    author: "Gary Ng",
    publishedAt: "2020-07-09T13:04:37-07:00",
    publishedDateObserved: "2020-07-09",
    normalizedPacificDate: "2020-07-09",
    locator:
      "The July 9 installation instructions say the enrolled device's Software Update screen shows iOS 14 Public Beta 2.",
    selectedText: "You’ll then see iOS 14 Public Beta 2",
    selectedTextType: "verbatimBodyFragment",
    supports: [
      "candidate:apple:ios:14.0:public-beta-1",
      "not-proposed:apple:ios:14.0:public-beta-2",
    ],
  },
  "iphonecanada-ios15-pb2": {
    title:
      "iOS 15 Beta 2 Download and iPadOS 15 Released for Developers | iPhone in Canada",
    publisher: "iPhone in Canada",
    author: "Gary Ng",
    publishedAt: "2021-06-30T10:43:05-07:00",
    publishedDateObserved: "2021-06-30",
    normalizedPacificDate: "2021-06-30",
    locator:
      "The June 30 article's public-beta availability list explicitly names iOS 15 Public Beta 2.",
    selectedText: "iOS 15 Public Beta 2",
    selectedTextType: "verbatimBodyFragment",
    supports: ["existing-match:apple:ios:15.0:public-beta-1"],
  },
  "koc-ios14-pb2": {
    title:
      "iOS 14 和 iPadOS 14 Public 公開測試版正式推出！這篇教你怎麼升級 - 電腦王阿達",
    publisher: "KOC / 電腦王阿達",
    author: "Rocky",
    publishedAt: "2020-07-10T10:55:54+08:00",
    publishedDateObserved: "2020-07-10",
    normalizedPacificDate: "2020-07-09",
    locator:
      "The installation walkthrough says Software Update displays iOS 14 Public Beta 2; its +08 timestamp normalizes to July 9 Pacific.",
    selectedText: "軟體更新就會看到 iOS 14 Public Beta 2",
    selectedTextType: "verbatimBodyFragment",
    supports: [
      "candidate:apple:ios:14.0:public-beta-1",
      "not-proposed:apple:ios:14.0:public-beta-2",
    ],
  },
  "wccftech-ios15-pb3": {
    title: "Download: Public Beta 3 of iOS 15 and iPadOS 15 Released",
    publisher: "Wccftech",
    author: "Uzair Ghani",
    publishedAt: "2021-07-16T17:41:51+00:00",
    publishedDateObserved: "2021-07-16",
    normalizedPacificDate: "2021-07-16",
    locator:
      "Page metadata, headline, and article identify the July 16 iOS 15 public payload as Public Beta 3.",
    selectedText:
      "Download: Public Beta 3 of iOS 15 and iPadOS 15 Released",
    supports: [
      "candidate:apple:ios:15.0:public-beta-2",
      "not-proposed:apple:ios:15.0:public-beta-3",
    ],
  },
};

const sources = fetchLog.results.map((result) => {
  const meta = metadata[result.sourceId];
  if (!meta) {
    throw new Error(`Missing source metadata for ${result.sourceId}`);
  }
  const selectedWords = wordCount(meta.selectedText);
  if (selectedWords > 20) {
    throw new Error(
      `Selected excerpt exceeds 20 words for ${result.sourceId}: ${selectedWords}`,
    );
  }
  return {
    sourceId: result.sourceId,
    canonicalUrl: result.url,
    finalUrl: result.finalUrl,
    title: meta.title,
    publisher: meta.publisher,
    author: meta.author,
    publishedAt: meta.publishedAt,
    publishedDateObserved: meta.publishedDateObserved,
    normalizedPacificDate: meta.normalizedPacificDate,
    publicationDatePrecision: "datetime",
    accessedAt,
    archiveUrl: null,
    status: "active",
    sourceClass: "contemporaneousSecondary",
    roles: [
      "publicAvailability",
      "publicOrdinal",
      "appearanceDate",
      "channelIdentity",
    ],
    supports: meta.supports,
    evidence: {
      rawPath: path.posix.join(fetchLog.evidencePath, result.filename),
      rawBytes: result.bytes,
      rawSha256: result.sha256,
      captureMethod: result.captureMethod,
      reusedFrom: result.reusedFrom ?? null,
      locator: meta.locator,
      selectedText: {
        type: meta.selectedTextType ?? "verbatimHeadlineFragment",
        text: meta.selectedText,
        wordCount: selectedWords,
        maxWords: 20,
        sha256: sha256(meta.selectedText),
        purpose:
          "Bounded source-identification excerpt only; findings use structured locators and original synthesis.",
      },
    },
    lineage: {
      publisherFamily: meta.publisher,
      independentForCorroboration: true,
      notes:
        "One publisher page counts as one lineage. Reused bytes were hash-verified and re-read for explicit iOS evidence.",
    },
  };
});

const sourceLedger = {
  formatVersion: 1,
  batchId,
  accessedAt,
  sourceCount: sources.length,
  rawSourceCount: sources.length,
  copyrightHandling:
    "Each source retains at most a 20-word identifying fragment. No release-note prose is copied; conclusions are original synthesis with precise locators.",
  sources,
};

const rawEvidenceLocks = {
  formatVersion: 1,
  batchId,
  algorithm: "sha256",
  generatedAt: "2026-07-31T05:40:43.000Z",
  sourceCount: sources.length,
  rawSourceCount: sources.length,
  locks: sources.map((source) => ({
    sourceId: source.sourceId,
    rawPath: source.evidence.rawPath,
    rawBytes: source.evidence.rawBytes,
    rawSha256: source.evidence.rawSha256,
    captureMethod: source.evidence.captureMethod,
    selectedText: {
      wordCount: source.evidence.selectedText.wordCount,
      maxWords: source.evidence.selectedText.maxWords,
      sha256: source.evidence.selectedText.sha256,
    },
  })),
};

const sourceRoleCorrections = {
  formatVersion: 1,
  batchId,
  note:
    "These are supplement-only corrections to how frozen parent sources may be interpreted. The frozen parent ledger is not edited.",
  correctionCount: 10,
  corrections: [
    {
      correctionId: "imore-ios12-early-rows-absent",
      parentSourceId: "imore-ios12",
      affectedRecordIds: [
        "candidate:apple:ios:12.0:public-beta-1",
        "candidate:apple:ios:12.0:public-beta-2",
        "candidate:apple:ios:12.0:public-beta-3",
        "candidate:apple:ios:12.0:public-beta-4",
        "candidate:apple:ios:12.0:public-beta-5",
      ],
      correctedAllowedUse:
        "None for the exact dates or ordinals of Public Betas 1 through 5.",
      disallowedUse:
        "Do not use the retained page as exact early-cycle evidence; those rows are absent.",
    },
    {
      correctionId: "mr-ios14-opening-appearance-not-label",
      parentSourceId: "mr-ios14-opening",
      affectedRecordIds: ["candidate:apple:ios:14.0:public-beta-1"],
      correctedAllowedUse:
        "Supports a first public appearance on July 9, 2020 and the public channel.",
      disallowedUse:
        "Does not establish the displayed public ordinal.",
    },
    {
      correctionId: "iculture-ios14-appearance-count-not-label",
      parentSourceId: "iculture-ios14",
      affectedRecordIds: [
        "candidate:apple:ios:14.0:public-beta-1",
        "not-proposed:apple:ios:14.0:public-beta-2",
      ],
      correctedAllowedUse:
        "Supports appearance chronology and later-cycle labels subject to the frozen conflict notes.",
      disallowedUse:
        "Its Public Beta 1 wording cannot override direct Software Update evidence for Public Beta 2 on July 9.",
    },
    {
      correctionId: "mr-ios15-opening-appearance-not-label",
      parentSourceId: "mr-ios15-opening",
      affectedRecordIds: ["existing-match:apple:ios:15.0:public-beta-1"],
      correctedAllowedUse:
        "Supports the first public appearance on June 30, 2021 and the public channel.",
      disallowedUse:
        "Does not establish the displayed public ordinal.",
    },
    {
      correctionId: "mr-ios15-second-appearance-not-label",
      parentSourceId: "mr-ios15-pb2",
      affectedRecordIds: ["candidate:apple:ios:15.0:public-beta-2"],
      correctedAllowedUse:
        "Supports a second public appearance on July 16, 2021 and the public channel.",
      disallowedUse:
        "Does not establish that the displayed label was Public Beta 2.",
    },
    {
      correctionId: "iculture-ios15-appearance-count-not-label",
      parentSourceId: "iculture-ios15",
      affectedRecordIds: [
        "existing-match:apple:ios:15.0:public-beta-1",
        "candidate:apple:ios:15.0:public-beta-2",
        "not-proposed:apple:ios:15.0:public-beta-3",
      ],
      correctedAllowedUse:
        "Supports the dates and order of the June 30 and July 16 public appearances.",
      disallowedUse:
        "Its PB1/PB2 appearance-count labels cannot override exact contemporary PB2/PB3 label evidence.",
    },
    {
      correctionId: "idb-ios15-second-appearance-not-label",
      parentSourceId: "idb-ios15-pb2",
      affectedRecordIds: ["candidate:apple:ios:15.0:public-beta-2"],
      correctedAllowedUse:
        "Supports the second iOS 15 public appearance on July 16, 2021.",
      disallowedUse:
        "Second-appearance wording is not device-facing Public Beta 2 label evidence.",
    },
    {
      correctionId: "mr-ios17-pb6-public-availability-only",
      parentSourceId: "mr-ios17-pb6",
      affectedRecordIds: ["candidate:apple:ios:17.0:public-beta-6"],
      correctedAllowedUse:
        "Supports dated public availability paired with Developer Beta 8.",
      disallowedUse:
        "Developer Beta 8 does not establish public ordinal 6.",
    },
    {
      correctionId: "mr-ios18-pb5-public-availability-only",
      parentSourceId: "mr-ios18-pb5",
      affectedRecordIds: ["candidate:apple:ios:18.0:public-beta-5"],
      correctedAllowedUse:
        "Supports dated public availability paired with Developer Beta 7.",
      disallowedUse:
        "Developer Beta 7 does not establish public ordinal 5.",
    },
    {
      correctionId: "osxd-ios18-pb5-later-report",
      parentSourceId: "osxd-ios18-pb5",
      affectedRecordIds: ["candidate:apple:ios:18.0:public-beta-5"],
      correctedAllowedUse:
        "Supports the Public Beta 5 identity as a later report.",
      disallowedUse:
        "Its August 21 article date is not the August 20 Pacific appearance date.",
    },
  ],
};

const parentEvidence = (sourceId, supports) => ({
  kind: "parentPacketSource",
  packetPath:
    "research-handoffs/beta-chronology-gap/ios-major-12-18/sources.json",
  sourceId,
  supports,
});

const supplementEvidence = (sourceId, supports) => ({
  kind: "supplementSource",
  packetPath:
    "research-handoffs/beta-chronology-gap/ios-major-12-18-followup/sources.json",
  sourceId,
  supports,
});

const unchanged = ({
  id,
  version,
  originalIdentity,
  parentSourceId,
  supplementSourceId,
  publisherFamilies,
}) => ({
  originalRecordId: id,
  originalRecordKind: "candidate",
  platform: "iOS",
  version,
  releaseVersionId: `version-ios-${version.replace(".", "-")}`,
  researchRecommendation:
    "readyForIndependentReviewUnchangedIdentity",
  originalIdentity,
  proposedIdentity: originalIdentity,
  rationale:
    "The supplement adds an independent contemporary publisher lineage at the exact iOS version, public ordinal, and Pacific appearance date grain.",
  evidenceRefs: [
    parentEvidence(
      parentSourceId,
      "Exact parent-packet chronology retained as one publisher lineage.",
    ),
    supplementEvidence(
      supplementSourceId,
      "Independent exact version, public ordinal, and Pacific appearance-date evidence.",
    ),
  ],
  corroboration: {
    exactVersionOrdinalDateLineages: 2,
    publisherFamilies,
    independentPublisherFamilies: true,
  },
  productionReconciliation: {
    status: "confirmedMissing",
    snapshotPath:
      "research-handoffs/beta-chronology-gap/ios-major-12-18-followup/production-snapshot.json",
  },
  independentReviewRequired: true,
  implementationAuthorized: false,
});

const mappings = [
  unchanged({
    id: "candidate:apple:ios:12.0:public-beta-1",
    version: "12.0",
    originalIdentity: identity(
      "Public Beta 1",
      "public-beta-1",
      1,
      "2018-06-25",
    ),
    parentSourceId: "iculture-ios12",
    supplementSourceId: "appleinsider-ios12-pb1",
    publisherFamilies: ["iCulture", "AppleInsider"],
  }),
  unchanged({
    id: "candidate:apple:ios:12.0:public-beta-2",
    version: "12.0",
    originalIdentity: identity(
      "Public Beta 2",
      "public-beta-2",
      2,
      "2018-07-05",
    ),
    parentSourceId: "iculture-ios12",
    supplementSourceId: "appleinsider-ios12-pb2",
    publisherFamilies: ["iCulture", "AppleInsider"],
  }),
  unchanged({
    id: "candidate:apple:ios:12.0:public-beta-3",
    version: "12.0",
    originalIdentity: identity(
      "Public Beta 3",
      "public-beta-3",
      3,
      "2018-07-18",
    ),
    parentSourceId: "iculture-ios12",
    supplementSourceId: "appleinsider-ios12-pb3",
    publisherFamilies: ["iCulture", "AppleInsider"],
  }),
  unchanged({
    id: "candidate:apple:ios:12.0:public-beta-4",
    version: "12.0",
    originalIdentity: identity(
      "Public Beta 4",
      "public-beta-4",
      4,
      "2018-07-31",
    ),
    parentSourceId: "iculture-ios12",
    supplementSourceId: "9to5mac-ios12-pb4",
    publisherFamilies: ["iCulture", "9to5Mac"],
  }),
  unchanged({
    id: "candidate:apple:ios:12.0:public-beta-5",
    version: "12.0",
    originalIdentity: identity(
      "Public Beta 5",
      "public-beta-5",
      5,
      "2018-08-06",
    ),
    parentSourceId: "iculture-ios12",
    supplementSourceId: "iphonecanada-ios12-pb5",
    publisherFamilies: ["iCulture", "iPhone in Canada"],
  }),
  {
    originalRecordId: "candidate:apple:ios:14.0:public-beta-1",
    originalRecordKind: "candidate",
    platform: "iOS",
    version: "14.0",
    releaseVersionId: "version-ios-14-0",
    researchRecommendation:
      "supersedeWithCorrectedIdentityPendingIndependentReview",
    originalIdentity: identity(
      "Public Beta 1",
      "public-beta-1",
      1,
      "2020-07-09",
    ),
    proposedIdentity: identity(
      "Public Beta 2",
      "public-beta-2",
      2,
      "2020-07-09",
    ),
    rationale:
      "Two independent installation reports preserve the Software Update label Public Beta 2 for the first July 9 appearance. First-public-beta wording describes appearance order, not the displayed ordinal.",
    evidenceRefs: [
      supplementEvidence(
        "iphonecanada-ios14-pb2",
        "Direct report of the iOS Software Update label Public Beta 2 on July 9.",
      ),
      supplementEvidence(
        "koc-ios14-pb2",
        "Independent Software Update walkthrough showing iOS 14 Public Beta 2, timestamp-normalized to July 9 Pacific.",
      ),
    ],
    corroboration: {
      exactVersionOrdinalDateLineages: 2,
      publisherFamilies: ["iPhone in Canada", "KOC / 電腦王阿達"],
      independentPublisherFamilies: true,
    },
    productionReconciliation: {
      status: "confirmedMissingCorrectedIdentity",
      snapshotCheckId: "ios14-corrected-pb2-july9",
    },
    independentReviewRequired: true,
    implementationAuthorized: false,
  },
  {
    originalRecordId: "candidate:apple:ios:15.0:public-beta-2",
    originalRecordKind: "candidate",
    platform: "iOS",
    version: "15.0",
    releaseVersionId: "version-ios-15-0",
    researchRecommendation:
      "supersedeWithCorrectedIdentityPendingIndependentReview",
    originalIdentity: identity(
      "Public Beta 2",
      "public-beta-2",
      2,
      "2021-07-16",
    ),
    proposedIdentity: identity(
      "Public Beta 3",
      "public-beta-3",
      3,
      "2021-07-16",
    ),
    rationale:
      "Forbes and Wccftech independently and explicitly label the July 16 public payload Public Beta 3. Second-public-beta wording describes appearance order.",
    evidenceRefs: [
      supplementEvidence(
        "forbes-ios15-pb3",
        "Exact Public Beta 3 label and July 16 publication date.",
      ),
      supplementEvidence(
        "wccftech-ios15-pb3",
        "Independent exact Public Beta 3 label and July 16 publication date.",
      ),
    ],
    corroboration: {
      exactVersionOrdinalDateLineages: 2,
      publisherFamilies: ["Forbes", "Wccftech"],
      independentPublisherFamilies: true,
    },
    productionReconciliation: {
      status: "confirmedMissingCorrectedIdentity",
      snapshotCheckId: "ios15-corrected-pb3-july16",
    },
    independentReviewRequired: true,
    implementationAuthorized: false,
  },
  unchanged({
    id: "candidate:apple:ios:17.0:public-beta-6",
    version: "17.0",
    originalIdentity: identity(
      "Public Beta 6",
      "public-beta-6",
      6,
      "2023-08-29",
    ),
    parentSourceId: "iculture-ios17",
    supplementSourceId: "appleinsider-ios17-pb6",
    publisherFamilies: ["iCulture", "AppleInsider"],
  }),
  unchanged({
    id: "candidate:apple:ios:18.0:public-beta-5",
    version: "18.0",
    originalIdentity: identity(
      "Public Beta 5",
      "public-beta-5",
      5,
      "2024-08-20",
    ),
    parentSourceId: "iculture-ios18",
    supplementSourceId: "9to5mac-ios18-pb5",
    publisherFamilies: ["iCulture", "9to5Mac"],
  }),
  {
    originalRecordId: "not-proposed:apple:ios:14.0:public-beta-2",
    originalRecordKind: "notProposed",
    platform: "iOS",
    version: "14.0",
    releaseVersionId: "version-ios-14-0",
    researchRecommendation:
      "withdrawBroadNegativeAndRetainDateSpecificJuly22Boundary",
    originalIdentity: identity(
      "Public Beta 2",
      "public-beta-2",
      2,
      "2020-07-22",
    ),
    proposedIdentity: identity(
      "Public Beta 2",
      "public-beta-2",
      2,
      "2020-07-09",
    ),
    rationale:
      "Public Beta 2 did exist: it was the July 9 first public appearance. No separately distributed July 22 Public Beta 2 is corroborated; the next public appearance was Public Beta 3 on July 23.",
    evidenceRefs: [
      supplementEvidence(
        "iphonecanada-ios14-pb2",
        "Direct Software Update label evidence for Public Beta 2 on July 9.",
      ),
      supplementEvidence(
        "koc-ios14-pb2",
        "Independent Software Update label evidence for Public Beta 2, normalized to July 9 Pacific.",
      ),
      parentEvidence(
        "mr-ios14-pb3",
        "Parent evidence preserves the next public appearance on July 23, not July 22.",
      ),
    ],
    corroboration: {
      exactVersionOrdinalDateLineages: 2,
      publisherFamilies: ["iPhone in Canada", "KOC / 電腦王阿達"],
      independentPublisherFamilies: true,
    },
    productionReconciliation: {
      status: "noProductionEventForEitherJuly9PB2OrJuly22PB2",
      correctedSnapshotCheckId: "ios14-corrected-pb2-july9",
      dateSpecificBoundaryCheckId: "ios14-alleged-pb2-july22",
    },
    independentReviewRequired: true,
    implementationAuthorized: false,
  },
  {
    originalRecordId: "not-proposed:apple:ios:15.0:public-beta-3",
    originalRecordKind: "notProposed",
    platform: "iOS",
    version: "15.0",
    releaseVersionId: "version-ios-15-0",
    researchRecommendation:
      "withdrawNegativeIdentityPendingIndependentReview",
    originalIdentity: identity(
      "Public Beta 3",
      "public-beta-3",
      3,
      "2021-07-16",
    ),
    proposedIdentity: identity(
      "Public Beta 3",
      "public-beta-3",
      3,
      "2021-07-16",
    ),
    rationale:
      "The negative is contradicted by two independent contemporary publisher lineages explicitly identifying the July 16 payload as Public Beta 3.",
    evidenceRefs: [
      supplementEvidence(
        "forbes-ios15-pb3",
        "Exact Public Beta 3 label and July 16 publication date.",
      ),
      supplementEvidence(
        "wccftech-ios15-pb3",
        "Independent exact Public Beta 3 label and July 16 publication date.",
      ),
    ],
    corroboration: {
      exactVersionOrdinalDateLineages: 2,
      publisherFamilies: ["Forbes", "Wccftech"],
      independentPublisherFamilies: true,
    },
    productionReconciliation: {
      status: "confirmedMissingIdentity",
      snapshotCheckId: "ios15-corrected-pb3-july16",
    },
    independentReviewRequired: true,
    implementationAuthorized: false,
  },
  {
    originalRecordId: "existing-match:apple:ios:15.0:public-beta-1",
    originalRecordKind: "existingMatch",
    platform: "iOS",
    version: "15.0",
    releaseVersionId: "version-ios-15-0",
    researchRecommendation:
      "productionIdentityCorrectionPendingIndependentReviewAndAuthorization",
    originalIdentity: identity(
      "Public Beta 1",
      "public-beta-1",
      1,
      "2021-06-30",
    ),
    proposedIdentity: identity(
      "Public Beta 2",
      "public-beta-2",
      2,
      "2021-06-30",
    ),
    rationale:
      "Forbes and iPhone in Canada explicitly identify the June 30 public payload as Public Beta 2. This is the same historical appearance currently stored as PB1 and must never become a duplicate event.",
    evidenceRefs: [
      supplementEvidence(
        "forbes-ios15-pb2",
        "Exact Public Beta 2 label and June 30 publication date.",
      ),
      supplementEvidence(
        "iphonecanada-ios15-pb2",
        "Independent availability list explicitly naming iOS 15 Public Beta 2 on June 30.",
      ),
    ],
    corroboration: {
      exactVersionOrdinalDateLineages: 2,
      publisherFamilies: ["Forbes", "iPhone in Canada"],
      independentPublisherFamilies: true,
    },
    productionReconciliation: {
      status: "singleExistingEventNeedsIdentityCorrection",
      currentProductionEventId: "release-event-50da2e4e5ec3bdd8fa582ce1",
      currentSnapshotCheckId: "ios15-production-pb1-june30",
      correctedSnapshotCheckId: "ios15-corrected-pb2-june30",
      duplicateCreationForbidden: true,
    },
    independentReviewRequired: true,
    implementationAuthorized: false,
  },
];

const supplement = {
  formatVersion: 1,
  batchId,
  generatedAt: "2026-07-31T05:40:43.000Z",
  parentPacket:
    "research-handoffs/beta-chronology-gap/ios-major-12-18",
  purpose:
    "Research-only evidence supplement mapping every independently blocked parent record to exact new evidence, a corrected identity, or a narrowed boundary.",
  summary: {
    originalRecordCount: mappings.length,
    unchangedCandidateRecommendations: mappings.filter(
      (entry) =>
        entry.researchRecommendation ===
        "readyForIndependentReviewUnchangedIdentity",
    ).length,
    correctedCandidateRecommendations: mappings.filter(
      (entry) =>
        entry.originalRecordKind === "candidate" &&
        entry.researchRecommendation ===
          "supersedeWithCorrectedIdentityPendingIndependentReview",
    ).length,
    notProposedReconsiderations: mappings.filter(
      (entry) => entry.originalRecordKind === "notProposed",
    ).length,
    existingProductionCorrectionRecommendations: mappings.filter(
      (entry) => entry.originalRecordKind === "existingMatch",
    ).length,
  },
  identityFinding:
    "The displayed-label rule changes the first iOS 14 public appearance from PB1 to PB2, the first iOS 15 public appearance from PB1 to PB2, and the second iOS 15 public appearance from PB2 to PB3. Appearance order remains useful chronology but is not an ordinal authority.",
  mappings,
  safety: {
    independentReviewRequired: true,
    sanityMutationAllowed: false,
    stableEventIdCreationAllowed: false,
    pageWorkAllowed: false,
    publicationAuthorized: false,
    deploymentAuthorized: false,
    researcherPerformedIndependentReview: false,
  },
};

const report = `# iOS 12–18 major-cycle public-beta follow-up

## Outcome

This research-only supplement resolves all 12 records sent back by the independent review, but it does **not** approve implementation.

- Seven candidate identities remain unchanged and now have an additional exact contemporary lineage: iOS 12 Public Betas 1–5, iOS 17 Public Beta 6, and iOS 18 Public Beta 5.
- Two blocked candidate identities should be superseded: iOS 14's July 9 first public appearance displayed **Public Beta 2**, and iOS 15's July 16 second public appearance displayed **Public Beta 3**.
- The iOS 14 PB2 negative must be narrowed: PB2 existed on July 9, while no separate July 22 PB2 distribution is corroborated.
- The iOS 15 PB3 negative should be withdrawn because PB3 was the July 16 payload.
- Production's June 30 iOS 15 PB1 record is the same historical appearance that two sources identify as **Public Beta 2**. It is a correction target, never a duplicate-event creation target.

## Identity rule applied

The public label displayed to enrolled devices controls the ordinal. “First public beta” and “second public beta” may describe appearance order and cannot override direct Software Update wording or exact contemporary publisher labels.

This explains the apparently skipped early ordinals:

| Cycle | Appearance order | Date (Pacific) | Displayed / exact reported label |
| --- | ---: | --- | --- |
| iOS 14 | first | 2020-07-09 | Public Beta 2 |
| iOS 15 | first | 2021-06-30 | Public Beta 2 |
| iOS 15 | second | 2021-07-16 | Public Beta 3 |

## Evidence gate

Every proposed identity has two independent contemporary publisher families at the exact version, public ordinal, and Pacific appearance-date grain. For the seven unchanged candidates, the frozen parent packet supplies one lineage and this supplement supplies the missing second exact lineage. The corrected iOS 14/15 identities have two exact lineages in this supplement.

The raw source bytes, selected fragments, locators, SHA-256 hashes, and publisher-family independence declarations are frozen in \`sources.json\` and \`raw-evidence-locks.json\`. Selected excerpts are capped at 20 words; no release-note prose is copied.

## Production recheck

A fresh read-only Sanity query used the published perspective with \`useCdn: false\` at \`${supplementProductionTime()}\`.

- All five exact release-version parents still exist.
- All unchanged or corrected missing targets remain absent.
- Production still has one June 30, 2021 iOS 15 public-beta event: \`release-event-50da2e4e5ec3bdd8fa582ce1\`, stored as Public Beta 1.
- The proposed Public Beta 2 correction matches that event's date, so duplicate creation is explicitly forbidden.

No Sanity mutation, stable event ID creation, page work, publication, or deployment occurred.

## Source-role corrections

\`source-role-corrections.json\` narrows ten overclaimed parent-source roles without editing the frozen parent packet. In particular, developer-beta numerals and appearance-count wording are not used as public-ordinal evidence.

## Required next step

A different agent must independently review this frozen supplement. Only a later, separately authorized implementation phase may update production, and it must correct the existing iOS 15 event in place rather than create a duplicate.
`;

function supplementProductionTime() {
  return "2026-07-31T05:42:15.296Z";
}

const writeJson = async (name, value) => {
  await writeFile(
    path.join(packetDir, name),
    `${JSON.stringify(value, null, 2)}\n`,
    "utf8",
  );
};

await writeJson("sources.json", sourceLedger);
await writeJson("raw-evidence-locks.json", rawEvidenceLocks);
await writeJson("source-role-corrections.json", sourceRoleCorrections);
await writeJson("supplement.json", supplement);
await writeFile(path.join(packetDir, "report.md"), report, "utf8");

console.log(
  JSON.stringify(
    {
      batchId,
      sourceCount: sources.length,
      mappingCount: mappings.length,
      written: [
        "sources.json",
        "raw-evidence-locks.json",
        "source-role-corrections.json",
        "supplement.json",
        "report.md",
      ],
    },
    null,
    2,
  ),
);
