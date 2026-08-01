export const batchId = "ios-patch-applicability-2026-07-31";
export const researchCutoff = "2026-07-31";
export const packetPath =
  "research-handoffs/beta-chronology-gap/ios-patch-applicability";
export const evidenceRoot =
  "tmp/research-evidence/beta-chronology-gap/ios-patch-applicability";

export const targetVersions = [
  "8.4.1",
  "9.0.1",
  "9.0.2",
  "9.3.1",
  "9.3.5",
  "10.3.1",
  "11.0.1",
  "11.0.2",
  "11.0.3",
  "11.1.1",
  "11.1.2",
  "11.2.1",
  "12.0.1",
  "12.3.1",
  "12.4.1",
  "13.1.1",
  "13.1.2",
  "13.1.3",
  "13.3.1",
  "13.4.1",
  "13.5.1",
  "14.0.1",
  "14.5.1",
  "14.7.1",
  "14.8",
  "26.0.1",
  "26.2.1",
];

export const releaseVersionIdFor = (version) =>
  `version-ios-${version.replaceAll(".", "-")}`;

export const targetVersionIds = targetVersions.map(releaseVersionIdFor);

export const observedPublicBetas = [
  {
    candidateId: "candidate:apple:ios:13.3.1:public-beta-1",
    platform: "iOS",
    platformId: "platform-ios",
    version: "13.3.1",
    releaseVersionId: "version-ios-13-3-1",
    label: "Public Beta 1",
    routeAlias: "public-beta-1",
    sequence: 1,
    appearanceDate: "2019-12-18",
    sourceIds: ["bgr-ios-13-3-1-pb1", "cultofmac-ios-13-3-1-pb1"],
  },
  {
    candidateId: "candidate:apple:ios:13.3.1:public-beta-2",
    platform: "iOS",
    platformId: "platform-ios",
    version: "13.3.1",
    releaseVersionId: "version-ios-13-3-1",
    label: "Public Beta 2",
    routeAlias: "public-beta-2",
    sequence: 2,
    appearanceDate: "2020-01-14",
    sourceIds: ["9to5mac-ios-13-3-1-pb2", "forbes-ios-13-3-1-pb2"],
  },
  {
    candidateId: "candidate:apple:ios:13.3.1:public-beta-3",
    platform: "iOS",
    platformId: "platform-ios",
    version: "13.3.1",
    releaseVersionId: "version-ios-13-3-1",
    label: "Public Beta 3",
    routeAlias: "public-beta-3",
    sequence: 3,
    appearanceDate: "2020-01-22",
    sourceIds: [
      "9to5mac-ios-13-3-1-pb3",
      "kobonemi-ios-13-3-1-pb3",
    ],
  },
];

export const evidenceBackedNotApplicableVersions = ["14.8"];
export const notEstablishedVersions = ["8.4.1"];
export const auditedNoPositiveButReversibleVersions = targetVersions.filter(
  (version) =>
    version !== "13.3.1" &&
    !evidenceBackedNotApplicableVersions.includes(version) &&
    !notEstablishedVersions.includes(version),
);
