import {getCliClient} from "sanity/cli";
import {mkdir, readFile, writeFile} from "node:fs/promises";

const batchId = "beta-chronology-gap-macos-point-15-26";
const targetVersions = [
  "15.1",
  "15.2",
  "15.3",
  "15.4",
  "15.5",
  "15.6",
  "26.1",
  "26.2",
  "26.3",
  "26.4",
  "26.5",
  "26.6",
];
const targetVersionIds = targetVersions.map(
  (version) => `version-macos-${version.replaceAll(".", "-")}`,
);
const identitiesPath =
  "research-handoffs/beta-chronology-gap/macos-point-15-26/researched-identities.json";

async function readExpectedIdentities(): Promise<
  {
    candidateId: string;
    version: string;
    releaseVersionId: string;
    channel: "publicBeta";
    routeAlias: string;
    label: string;
    sequence: number;
    appearanceDate: string;
  }[]
> {
  try {
    return JSON.parse(await readFile(identitiesPath, "utf8")).identities;
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") return [];
    throw error;
  }
}

async function run(): Promise<void> {
  const expectedIdentities = await readExpectedIdentities();
  const client = getCliClient({
    apiVersion: "2024-01-01",
    useCdn: false,
  }).withConfig({
    perspective: "published",
    useCdn: false,
  });

  const [versions, targetEvents, macOSPublicBetaCount, allPublishedEventCount] =
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
        `count(*[_type == "releaseEvent" && platform->name == "macOS" && channel == "publicBeta"])`,
      ),
      client.fetch(`count(*[_type == "releaseEvent"])`),
    ]);

  const parentChecks = targetVersionIds.map((releaseVersionId) => ({
    releaseVersionId,
    exists: versions.some(
      (version: {_id: string}) => version._id === releaseVersionId,
    ),
    document:
      versions.find(
        (version: {_id: string}) => version._id === releaseVersionId,
      ) ?? null,
  }));
  const exactChecks = expectedIdentities.map((identity) => {
    const routeIdentityMatches = targetEvents.filter(
      (event: {
        releaseVersionId: string;
        channel: string;
        routeAlias: string;
      }) =>
        event.releaseVersionId === identity.releaseVersionId &&
        event.channel === identity.channel &&
        event.routeAlias === identity.routeAlias,
    );
    const fullCandidateMatches = routeIdentityMatches.filter(
      (event: {
        label: string;
        sequence: number;
        appearanceDate: string;
      }) =>
        event.label === identity.label &&
        event.sequence === identity.sequence &&
        event.appearanceDate === identity.appearanceDate,
    );
    return {
      ...identity,
      routeIdentityMatchCount: routeIdentityMatches.length,
      fullCandidateMatchCount: fullCandidateMatches.length,
      routeIdentityMatches,
      fullCandidateMatches,
    };
  });

  const snapshot = {
    formatVersion: 1,
    batchId,
    capturedAt: new Date().toISOString(),
    perspective: "published",
    useCdn: false,
    projectId: client.config().projectId,
    dataset: client.config().dataset,
    targetVersions,
    targetVersionIds,
    expectedIdentityCount: expectedIdentities.length,
    productionCounts: {
      totalReleaseEvents: allPublishedEventCount,
      macOSPublicBetaEventsAllVersions: macOSPublicBetaCount,
      scopedReleaseEvents: targetEvents.length,
      scopedPublicBetaEvents: targetEvents.filter(
        (event: {channel: string}) => event.channel === "publicBeta",
      ).length,
      exactRouteMatches: exactChecks.reduce(
        (sum, check) => sum + check.routeIdentityMatchCount,
        0,
      ),
      exactFullMatches: exactChecks.reduce(
        (sum, check) => sum + check.fullCandidateMatchCount,
        0,
      ),
    },
    parentChecks,
    versions,
    scopedEvents: targetEvents,
    exactChecks,
    queryScript:
      "research-handoffs/beta-chronology-gap/macos-point-15-26/query-production.ts",
    safety: {
      queryOnly: true,
      sanityMutationPerformed: false,
    },
  };
  const outputPath =
    "tmp/research-evidence/beta-chronology-gap/macos-point-15-26/production-snapshot.json";
  await mkdir(
    "tmp/research-evidence/beta-chronology-gap/macos-point-15-26",
    {recursive: true},
  );
  await writeFile(outputPath, `${JSON.stringify(snapshot, null, 2)}\n`);

  console.log(
    JSON.stringify(
      {
        outputPath,
        capturedAt: snapshot.capturedAt,
        expectedIdentityCount: snapshot.expectedIdentityCount,
        productionCounts: snapshot.productionCounts,
        missingParents: parentChecks
          .filter((check) => !check.exists)
          .map((check) => check.releaseVersionId),
        exactMatches: exactChecks.filter(
          (check) => check.fullCandidateMatchCount > 0,
        ),
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
