import {getCliClient} from "sanity/cli";
import {readFile, writeFile} from "node:fs/promises";
import path from "node:path";
import {fileURLToPath} from "node:url";

type Candidate = {
  candidateId: string;
  platform: string;
  version: string;
  releaseVersionId: string;
  proposedIdentity: {
    label: string;
    routeAlias: string;
    channel: string;
    appearanceDate: string;
    sequence: number;
  };
};

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

const scriptPath = fileURLToPath(import.meta.url);
const packetDir = path.dirname(scriptPath);
const parentDir = path.resolve(packetDir, "..", "ios-ipados-point-12-14");
const batchId = "beta-chronology-gap-ios-ipados-point-12-14-followup";

async function readJson(filePath: string) {
  return JSON.parse(await readFile(filePath, "utf8"));
}

async function run(): Promise<void> {
  const [parentReview, parentCandidates] = await Promise.all([
    readJson(path.join(parentDir, "independent-review.json")),
    readJson(path.join(parentDir, "candidates.json")),
  ]);
  const blockedIds = new Set(
    parentReview.candidateDisposition.blockedCandidateIds as string[],
  );
  const candidates = (parentCandidates.candidates as Candidate[]).filter(
    (candidate) => blockedIds.has(candidate.candidateId),
  );
  const targetVersionIds = [
    ...new Set(candidates.map((candidate) => candidate.releaseVersionId)),
  ].sort();

  const client = getCliClient({
    apiVersion: "2024-01-01",
    useCdn: false,
  }).withConfig({
    perspective: "published",
    useCdn: false,
  });

  const [versions, targetEvents, platformPublicBetaCounts, totalReleaseEvents] =
    await Promise.all([
      client.fetch(
        `*[_type == "releaseVersion" && _id in $targetVersionIds] | order(_id asc) {
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
        `{
          "iOS": count(*[_type == "releaseEvent" && platform->name == "iOS" && channel == "publicBeta"]),
          "iPadOS": count(*[_type == "releaseEvent" && platform->name == "iPadOS" && channel == "publicBeta"])
        }`,
      ),
      client.fetch(`count(*[_type == "releaseEvent"])`),
    ]);

  const events = targetEvents as ProductionEvent[];
  const exactChecks = candidates.map((candidate) => {
    const identity = candidate.proposedIdentity;
    const routeIdentityMatches = events.filter(
      (event) =>
        event.releaseVersionId === candidate.releaseVersionId &&
        event.channel === identity.channel &&
        event.routeAlias === identity.routeAlias,
    );
    const fullCandidateMatches = routeIdentityMatches.filter(
      (event) =>
        event.sequence === identity.sequence &&
        event.appearanceDate === identity.appearanceDate &&
        event.label === identity.label,
    );
    return {
      candidateId: candidate.candidateId,
      platform: candidate.platform,
      version: candidate.version,
      releaseVersionId: candidate.releaseVersionId,
      channel: identity.channel,
      routeAlias: identity.routeAlias,
      label: identity.label,
      sequence: identity.sequence,
      appearanceDate: identity.appearanceDate,
      routeIdentityMatchCount: routeIdentityMatches.length,
      fullCandidateMatchCount: fullCandidateMatches.length,
      routeIdentityMatches,
      fullCandidateMatches,
    };
  });

  const versionById = new Map(
    (versions as Array<{_id: string}>).map((version) => [version._id, version]),
  );
  const parentChecks = targetVersionIds.map((releaseVersionId) => ({
    releaseVersionId,
    exists: versionById.has(releaseVersionId),
    document: versionById.get(releaseVersionId) ?? null,
  }));

  const snapshot = {
    formatVersion: 1,
    batchId,
    capturedAt: new Date().toISOString(),
    queryScript:
      "research-handoffs/beta-chronology-gap/ios-ipados-point-12-14-followup/query-production.ts",
    perspective: "published",
    useCdn: false,
    projectId: client.config().projectId,
    dataset: client.config().dataset,
    targetVersionIds,
    candidateCount: candidates.length,
    productionCounts: {
      totalReleaseEvents,
      platformPublicBetaCounts,
      scopedReleaseEvents: events.length,
      scopedPublicBetaEvents: events.filter(
        (event) => event.channel === "publicBeta",
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
    versions,
    parentChecks,
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

  const outputPath = path.join(packetDir, "production-snapshot.json");
  await writeFile(outputPath, `${JSON.stringify(snapshot, null, 2)}\n`);
  console.log(
    JSON.stringify(
      {
        outputPath,
        capturedAt: snapshot.capturedAt,
        productionCounts: snapshot.productionCounts,
        missingParents: parentChecks
          .filter((check) => !check.exists)
          .map((check) => check.releaseVersionId),
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
