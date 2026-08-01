import {getCliClient} from "sanity/cli";
import {mkdir, writeFile} from "node:fs/promises";

const expectedIdentities = [
  {
    candidateId: "candidate:apple:ios:10.2:public-beta-3",
    variantId: "corrected-pacific-date",
    version: "10.2",
    releaseVersionId: "version-ios-10-2",
    channel: "publicBeta",
    routeAlias: "public-beta-3",
    label: "Public Beta 3",
    sequence: 3,
    appearanceDate: "2016-11-14",
  },
  {
    candidateId: "candidate:apple:ios:10.2:public-beta-3",
    variantId: "frozen-parent-date",
    version: "10.2",
    releaseVersionId: "version-ios-10-2",
    channel: "publicBeta",
    routeAlias: "public-beta-3",
    label: "Public Beta 3",
    sequence: 3,
    appearanceDate: "2016-11-15",
  },
  {
    candidateId: "candidate:apple:ios:10.2.1:public-beta-3",
    variantId: "frozen-parent-date",
    version: "10.2.1",
    releaseVersionId: "version-ios-10-2-1",
    channel: "publicBeta",
    routeAlias: "public-beta-3",
    label: "Public Beta 3",
    sequence: 3,
    appearanceDate: "2017-01-09",
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

  const [versions, targetEvents, iOSPublicBetaCount, totalReleaseEventCount] =
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
        `count(*[_type == "releaseEvent" && platform->name == "iOS" && channel == "publicBeta"])`,
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
    batchId: "beta-chronology-gap-ios10-point-public-followup",
    capturedAt: new Date().toISOString(),
    queryScript:
      "research-handoffs/beta-chronology-gap/ios10-point-public-followup/query-production.ts",
    perspective: "published",
    useCdn: false,
    projectId: client.config().projectId,
    dataset: client.config().dataset,
    targetVersionIds,
    candidateCount: 2,
    identityVariantCount: expectedIdentities.length,
    productionCounts: {
      totalReleaseEvents: totalReleaseEventCount,
      iOSPublicBetaEventsAllVersions: iOSPublicBetaCount,
      scopedReleaseEvents: events.length,
      scopedPublicBetaEvents: events.filter(
        (event) => event.channel === "publicBeta",
      ).length,
      routeIdentityMatchesByVariant: exactChecks.reduce(
        (sum, check) => sum + check.routeIdentityMatchCount,
        0,
      ),
      fullCandidateMatchesByVariant: exactChecks.reduce(
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
      stableEventIdsCreated: 0,
      pageBuildsPerformed: 0,
      deploymentPerformed: false,
    },
  };

  const outputPath =
    "tmp/research-evidence/beta-chronology-gap/ios10-point-public-followup/production-snapshot.json";
  await mkdir(
    "tmp/research-evidence/beta-chronology-gap/ios10-point-public-followup",
    {recursive: true},
  );
  await writeFile(outputPath, `${JSON.stringify(snapshot, null, 2)}\n`);

  console.log(
    JSON.stringify(
      {
        outputPath,
        capturedAt: snapshot.capturedAt,
        productionCounts: snapshot.productionCounts,
        matchedVariants: exactChecks
          .filter((check) => check.routeIdentityMatchCount > 0)
          .map((check) => ({
            candidateId: check.candidateId,
            variantId: check.variantId,
          })),
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
