import { createHash } from "node:crypto";
import { readFile, writeFile } from "node:fs/promises";
import { getCliClient } from "sanity/cli";
import {
  allAppearances,
  batchId,
  packetPath,
  targetVersionIds,
} from "./research-data.mjs";

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
  closesReleaseCycle?: boolean;
};

const sha256 = (bytes: Buffer): string =>
  createHash("sha256").update(bytes).digest("hex");

const duplicateGroups = <T>(
  rows: T[],
  keyFor: (row: T) => string | null,
): Array<{ key: string; count: number }> => {
  const counts = new Map<string, number>();
  for (const row of rows) {
    const key = keyFor(row);
    if (!key) continue;
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }
  return [...counts.entries()]
    .filter(([, count]) => count > 1)
    .map(([key, count]) => ({ key, count }))
    .sort((left, right) => left.key.localeCompare(right.key));
};

async function run(): Promise<void> {
  const client = getCliClient({
    apiVersion: "2024-01-01",
    useCdn: false,
  }).withConfig({ perspective: "published", useCdn: false });

  const [versions, targetEvents, allEvents, tvosPublicBetaCount] =
    await Promise.all([
      client.fetch(
        `*[_type == "releaseVersion" && _id in $targetVersionIds] | order(_id asc) {
          _id, version, releaseStatus, publicReleaseDate,
          "platform": releaseTrain->platform->name,
          "train": releaseTrain->displayName
        }`,
        { targetVersionIds },
      ),
      client.fetch(
        `*[_type == "releaseEvent" && releaseVersion._ref in $targetVersionIds]
          | order(releaseVersion->version asc, appearanceDate asc, sequence asc) {
            _id, stableEventId, "releaseVersionId": releaseVersion._ref,
            "platform": platform->name, "version": releaseVersion->version,
            label, "routeAlias": routeAlias.current, channel, appearanceDate,
            sequence, isRevision, availabilityState, closesReleaseCycle
          }`,
        { targetVersionIds },
      ),
      client.fetch(
        `*[_type == "releaseEvent"] {
          _id, stableEventId, "releaseVersionId": releaseVersion._ref,
          "platform": platform->name, "version": releaseVersion->version,
          label, "routeAlias": routeAlias.current, channel, appearanceDate,
          sequence, isRevision, availabilityState, closesReleaseCycle
        }`,
      ),
      client.fetch(
        `count(*[_type == "releaseEvent" && platform->name == "tvOS" && channel == "publicBeta"])`,
      ),
    ]);

  const scopedEvents = targetEvents as ProductionEvent[];
  const productionEvents = allEvents as ProductionEvent[];
  const exactChecks = allAppearances.map((identity) => {
    const routeIdentityMatches = scopedEvents.filter(
      (event) =>
        event.releaseVersionId === identity.releaseVersionId &&
        event.channel === "publicBeta" &&
        event.routeAlias === identity.routeAlias,
    );
    const fullCandidateMatches = routeIdentityMatches.filter(
      (event) =>
        event.sequence === identity.sequence &&
        event.appearanceDate === identity.appearanceDate &&
        event.label === identity.label &&
        event.isRevision === false &&
        event.availabilityState === "available",
    );
    return {
      candidateId: identity.candidateId,
      researchDecision: identity.decision,
      releaseVersionId: identity.releaseVersionId,
      routeAlias: identity.routeAlias,
      label: identity.label,
      channel: identity.channel,
      sequence: identity.sequence,
      appearanceDate: identity.appearanceDate,
      routeIdentityMatchCount: routeIdentityMatches.length,
      fullCandidateMatchCount: fullCandidateMatches.length,
      routeIdentityMatches,
      fullCandidateMatches,
    };
  });

  const versionById = new Map(
    (versions as Array<{ _id: string }>).map((version) => [
      version._id,
      version,
    ]),
  );
  const parentChecks = targetVersionIds.map((releaseVersionId) => ({
    releaseVersionId,
    exists: versionById.has(releaseVersionId),
    document: versionById.get(releaseVersionId) ?? null,
  }));
  const [assignmentBytes, candidatesBytes] = await Promise.all([
    readFile(`${packetPath}/assignment.json`),
    readFile(`${packetPath}/candidates.json`),
  ]);

  const globalStableEventIdDuplicates = duplicateGroups(
    productionEvents,
    (event) => event.stableEventId ?? null,
  );
  const scopedRouteIdentityDuplicates = duplicateGroups(
    scopedEvents,
    (event) =>
      event.releaseVersionId && event.channel && event.routeAlias
        ? `${event.releaseVersionId}|${event.channel}|${event.routeAlias}`
        : null,
  );
  const scopedFullIdentityDuplicates = duplicateGroups(scopedEvents, (event) =>
    event.releaseVersionId &&
    event.channel &&
    event.routeAlias &&
    event.appearanceDate &&
    typeof event.sequence === "number"
      ? [
          event.releaseVersionId,
          event.channel,
          event.routeAlias,
          event.sequence,
          event.appearanceDate,
          event.label ?? "",
        ].join("|")
      : null,
  );

  const snapshot = {
    formatVersion: 1,
    batchId,
    capturedAt: new Date().toISOString(),
    queryScript: `${packetPath}/independent-review-query.ts`,
    perspective: "published",
    useCdn: false,
    projectId: client.config().projectId,
    dataset: client.config().dataset,
    reviewedAssignmentSha256: sha256(assignmentBytes),
    reviewedCandidatesSha256: sha256(candidatesBytes),
    targetVersionIds,
    observedAppearanceCount: allAppearances.length,
    productionCounts: {
      totalReleaseEvents: productionEvents.length,
      tvosPublicBetaEventsAllVersions: tvosPublicBetaCount,
      scopedReleaseEvents: scopedEvents.length,
      scopedPublicBetaEvents: scopedEvents.filter(
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
      globalStableEventIdDuplicateGroups: globalStableEventIdDuplicates.length,
      scopedRouteIdentityDuplicateGroups: scopedRouteIdentityDuplicates.length,
      scopedFullIdentityDuplicateGroups: scopedFullIdentityDuplicates.length,
    },
    duplicates: {
      globalStableEventIdDuplicates,
      scopedRouteIdentityDuplicates,
      scopedFullIdentityDuplicates,
    },
    versions,
    parentChecks,
    scopedEvents,
    exactChecks,
    safety: {
      queryOnly: true,
      sanityMutationPerformed: false,
      stableEventIdsCreated: 0,
      pageBuildsPerformed: 0,
      publicationPerformed: false,
      deploymentPerformed: false,
    },
  };

  await writeFile(
    `${packetPath}/independent-review-production-snapshot.json`,
    `${JSON.stringify(snapshot, null, 2)}\n`,
  );
  console.log(
    JSON.stringify(
      {
        packetPath: `${packetPath}/independent-review-production-snapshot.json`,
        capturedAt: snapshot.capturedAt,
        productionCounts: snapshot.productionCounts,
        missingParents: parentChecks
          .filter((check) => !check.exists)
          .map((check) => check.releaseVersionId),
        matchedCandidateIds: exactChecks
          .filter(
            (check) =>
              check.routeIdentityMatchCount > 0 ||
              check.fullCandidateMatchCount > 0,
          )
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
