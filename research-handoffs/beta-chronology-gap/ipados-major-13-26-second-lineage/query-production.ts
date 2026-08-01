import {getCliClient} from "sanity/cli";
import {mkdir, writeFile} from "node:fs/promises";

const expectedIdentities = [
  {
    candidateId: "candidate:apple:ipados:14.0:public-beta-6",
    version: "14.0",
    releaseVersionId: "version-ipados-14-0",
    channel: "publicBeta",
    routeAlias: "public-beta-6",
    label: "Public Beta 6",
    sequence: 6,
    appearanceDate: "2020-08-25",
  },
  {
    candidateId: "candidate:apple:ipados:14.0:public-beta-7",
    version: "14.0",
    releaseVersionId: "version-ipados-14-0",
    channel: "publicBeta",
    routeAlias: "public-beta-7",
    label: "Public Beta 7",
    sequence: 7,
    appearanceDate: "2020-09-03",
  },
  {
    candidateId: "candidate:apple:ipados:14.0:public-beta-8",
    version: "14.0",
    releaseVersionId: "version-ipados-14-0",
    channel: "publicBeta",
    routeAlias: "public-beta-8",
    label: "Public Beta 8",
    sequence: 8,
    appearanceDate: "2020-09-09",
  },
  {
    candidateId: "candidate:apple:ipados:15.0:public-beta-5",
    version: "15.0",
    releaseVersionId: "version-ipados-15-0",
    channel: "publicBeta",
    routeAlias: "public-beta-5",
    label: "Public Beta 5",
    sequence: 5,
    appearanceDate: "2021-08-11",
  },
  {
    candidateId: "candidate:apple:ipados:15.0:public-beta-7",
    version: "15.0",
    releaseVersionId: "version-ipados-15-0",
    channel: "publicBeta",
    routeAlias: "public-beta-7",
    label: "Public Beta 7",
    sequence: 7,
    appearanceDate: "2021-08-25",
  },
  {
    candidateId: "candidate:apple:ipados:15.0:public-beta-8",
    version: "15.0",
    releaseVersionId: "version-ipados-15-0",
    channel: "publicBeta",
    routeAlias: "public-beta-8",
    label: "Public Beta 8",
    sequence: 8,
    appearanceDate: "2021-08-31",
  },
  {
    candidateId: "candidate:apple:ipados:16.0:public-beta-4",
    version: "16.0",
    releaseVersionId: "version-ipados-16-0",
    channel: "publicBeta",
    routeAlias: "public-beta-4",
    label: "Public Beta 4",
    sequence: 4,
    appearanceDate: "2022-08-15",
  },
  {
    candidateId: "candidate:apple:ipados:17.0:public-beta-6",
    version: "17.0",
    releaseVersionId: "version-ipados-17-0",
    channel: "publicBeta",
    routeAlias: "public-beta-6",
    label: "Public Beta 6",
    sequence: 6,
    appearanceDate: "2023-08-29",
  },
  {
    candidateId: "candidate:apple:ipados:18.0:public-beta-6",
    version: "18.0",
    releaseVersionId: "version-ipados-18-0",
    channel: "publicBeta",
    routeAlias: "public-beta-6",
    label: "Public Beta 6",
    sequence: 6,
    appearanceDate: "2024-08-28",
  },
];

const targetVersionIds = [
  ...new Set(expectedIdentities.map((identity) => identity.releaseVersionId)),
];

type ProductionEvent = {
  _id: string;
  stableEventId?: string;
  releaseVersionId: string;
  platform?: string;
  version?: string;
  label?: string;
  routeAlias?: string;
  channel?: string;
  appearanceDate?: string;
  sequence?: number;
  isRevision?: boolean;
  availabilityState?: string;
};

async function run(): Promise<void> {
  const client = getCliClient({
    apiVersion: "2024-01-01",
    useCdn: false,
  }).withConfig({
    perspective: "published",
    useCdn: false,
  });

  const [versions, targetEvents, iPadOSPublicBetaCount, totalReleaseEventCount] =
    await Promise.all([
      client.fetch(
        `*[_type == "releaseVersion" && _id in $targetVersionIds] | order(version asc) {
          _id,
          version,
          releaseStatus,
          publicReleaseDate,
          "platform": releaseTrain->platform->name,
          "train": releaseTrain->displayName
        }`,
        {targetVersionIds},
      ),
      client.fetch(
        `*[_type == "releaseEvent" && releaseVersion._ref in $targetVersionIds]
          | order(releaseVersion->version asc, appearanceDate asc, sequence asc) {
            _id,
            stableEventId,
            "releaseVersionId": releaseVersion._ref,
            "platform": platform->name,
            "version": releaseVersion->version,
            label,
            "routeAlias": routeAlias.current,
            channel,
            appearanceDate,
            sequence,
            isRevision,
            availabilityState
          }`,
        {targetVersionIds},
      ),
      client.fetch(
        `count(*[_type == "releaseEvent" && platform->name == "iPadOS" && channel == "publicBeta"])`,
      ),
      client.fetch(`count(*[_type == "releaseEvent"])`),
    ]);

  const events = targetEvents as ProductionEvent[];
  const exactChecks = expectedIdentities.map((identity) => {
    const routeIdentityMatches = events.filter(
      (event) =>
        event.releaseVersionId === identity.releaseVersionId &&
        event.channel === identity.channel &&
        event.routeAlias === identity.routeAlias,
    );
    const sequenceDateMatches = events.filter(
      (event) =>
        event.releaseVersionId === identity.releaseVersionId &&
        event.channel === identity.channel &&
        event.sequence === identity.sequence &&
        event.appearanceDate === identity.appearanceDate,
    );
    const fullCandidateMatches = routeIdentityMatches.filter(
      (event) =>
        event.sequence === identity.sequence &&
        event.appearanceDate === identity.appearanceDate &&
        event.label === identity.label,
    );
    return {
      ...identity,
      matchBasis: {
        routeIdentity:
          "{releaseVersionId, channel, routeAlias.current}",
        sequenceDate:
          "{releaseVersionId, channel, sequence, appearanceDate}",
        fullCandidate:
          "{releaseVersionId, channel, routeAlias.current, label, sequence, appearanceDate}",
      },
      routeIdentityMatchCount: routeIdentityMatches.length,
      sequenceDateMatchCount: sequenceDateMatches.length,
      fullCandidateMatchCount: fullCandidateMatches.length,
      routeIdentityMatches,
      sequenceDateMatches,
      fullCandidateMatches,
    };
  });

  const snapshot = {
    formatVersion: 1,
    batchId: "beta-chronology-gap-ipados-major-13-26-second-lineage",
    capturedAt: new Date().toISOString(),
    queryScript:
      "research-handoffs/beta-chronology-gap/ipados-major-13-26-second-lineage/query-production.ts",
    perspective: "published",
    useCdn: false,
    projectId: client.config().projectId,
    dataset: client.config().dataset,
    targetVersionIds,
    expectedIdentityCount: expectedIdentities.length,
    productionCounts: {
      totalReleaseEvents: totalReleaseEventCount,
      iPadOSPublicBetaEventsAllVersions: iPadOSPublicBetaCount,
      scopedReleaseEvents: events.length,
      scopedPublicBetaEvents: events.filter(
        (event) => event.channel === "publicBeta",
      ).length,
      routeIdentityMatches: exactChecks.reduce(
        (sum, check) => sum + check.routeIdentityMatchCount,
        0,
      ),
      fullCandidateMatches: exactChecks.reduce(
        (sum, check) => sum + check.fullCandidateMatchCount,
        0,
      ),
    },
    versions,
    scopedEvents: events,
    exactChecks,
    safety: {
      queryOnly: true,
      sanityMutationPerformed: false,
      productionIdsCreated: false,
      deploymentPerformed: false,
    },
  };

  const outputPath =
    "tmp/research-evidence/beta-chronology-gap/ipados-major-13-26-second-lineage/production-snapshot.json";
  await mkdir(
    "tmp/research-evidence/beta-chronology-gap/ipados-major-13-26-second-lineage",
    {recursive: true},
  );
  await writeFile(outputPath, `${JSON.stringify(snapshot, null, 2)}\n`);

  console.log(
    JSON.stringify(
      {
        outputPath,
        capturedAt: snapshot.capturedAt,
        productionCounts: snapshot.productionCounts,
        matchedCandidates: exactChecks
          .filter((check) => check.routeIdentityMatchCount > 0)
          .map((check) => check.candidateId),
      },
      null,
      2,
    ),
  );
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
