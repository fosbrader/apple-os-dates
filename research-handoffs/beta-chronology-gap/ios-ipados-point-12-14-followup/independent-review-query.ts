import {getCliClient} from "sanity/cli";
import {readFile} from "node:fs/promises";
import path from "node:path";
import {fileURLToPath} from "node:url";

type Mapping = {
  candidateId: string;
  originalCandidate: {
    platform: string;
    version: string;
    releaseVersionId: string;
  };
  recommendedIdentity: {
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
};

const packetDir = path.dirname(fileURLToPath(import.meta.url));

async function run(): Promise<void> {
  const mappingsDocument = JSON.parse(
    await readFile(path.join(packetDir, "mappings.json"), "utf8"),
  ) as {mappings: Mapping[]};
  const mappings = mappingsDocument.mappings;
  const targetVersionIds = [
    ...new Set(
      mappings.map((mapping) => mapping.originalCandidate.releaseVersionId),
    ),
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
            sequence
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
  const exactChecks = mappings.map((mapping) => {
    const candidate = mapping.originalCandidate;
    const identity = mapping.recommendedIdentity;
    const routeIdentityMatches = events.filter(
      (event) =>
        event.releaseVersionId === candidate.releaseVersionId &&
        event.platform === candidate.platform &&
        event.channel === identity.channel &&
        event.routeAlias === identity.routeAlias,
    );
    const fullCandidateMatches = routeIdentityMatches.filter(
      (event) =>
        event.version === candidate.version &&
        event.label === identity.label &&
        event.sequence === identity.sequence &&
        event.appearanceDate === identity.appearanceDate,
    );
    return {
      candidateId: mapping.candidateId,
      routeIdentityMatchCount: routeIdentityMatches.length,
      fullCandidateMatchCount: fullCandidateMatches.length,
      routeIdentityMatchingEventIds: routeIdentityMatches.map(
        (event) => event._id,
      ),
      fullCandidateMatchingEventIds: fullCandidateMatches.map(
        (event) => event._id,
      ),
    };
  });

  const parentIds = new Set(
    (versions as Array<{_id: string}>).map((version) => version._id),
  );
  const result = {
    queriedAt: new Date().toISOString(),
    perspective: "published",
    useCdn: false,
    projectId: client.config().projectId,
    dataset: client.config().dataset,
    candidateCount: mappings.length,
    targetVersionCount: targetVersionIds.length,
    targetParentsFound: parentIds.size,
    missingParentIds: targetVersionIds.filter((id) => !parentIds.has(id)),
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
    exactChecks,
    queryOnly: true,
    sanityMutationPerformed: false,
  };

  console.log(JSON.stringify(result, null, 2));
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
