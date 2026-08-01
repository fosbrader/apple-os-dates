import {createHash} from "node:crypto";
import {readFile, writeFile} from "node:fs/promises";
import {getCliClient} from "sanity/cli";

const packetRoot =
  "research-handoffs/beta-chronology-gap/ios-ipados-point-15-18";

type Candidate = {
  candidateId: string;
  releaseVersionId: string;
  proposedIdentity: {
    channel: string;
    routeAlias: string;
    label: string;
    sequence: number;
    appearanceDate: string;
  };
};

type CoverageRow = {
  releaseVersionId: string;
};

type ReleaseEvent = {
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

const sha256 = (value: Buffer | string): string =>
  createHash("sha256").update(value).digest("hex");

async function run(): Promise<void> {
  const [candidateBytes, assignmentBytes] = await Promise.all([
    readFile(`${packetRoot}/candidates.json`),
    readFile(`${packetRoot}/assignment.json`),
  ]);
  const candidates = (
    JSON.parse(candidateBytes.toString("utf8")) as {
      candidates: Candidate[];
    }
  ).candidates;
  const assignment = JSON.parse(assignmentBytes.toString("utf8")) as {
    coverageMatrix: {rows: CoverageRow[]};
  };
  const targetVersionIds = [
    ...new Set(
      assignment.coverageMatrix.rows.map((row) => row.releaseVersionId),
    ),
  ].sort();

  const client = getCliClient({
    apiVersion: "2024-01-01",
    useCdn: false,
  }).withConfig({
    perspective: "published",
    useCdn: false,
  });

  const [
    parents,
    scopedEvents,
    totalReleaseEvents,
    platformPublicBetaCounts,
  ] = await Promise.all([
    client.fetch<Array<{_id: string}>>(
      `*[_type == "releaseVersion" && _id in $targetVersionIds] {
        _id
      }`,
      {targetVersionIds},
    ),
    client.fetch<ReleaseEvent[]>(
      `*[_type == "releaseEvent" && releaseVersion._ref in $targetVersionIds] {
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
    client.fetch<number>(`count(*[_type == "releaseEvent"])`),
    client.fetch<{iOS: number; iPadOS: number}>(
      `{
        "iOS": count(*[
          _type == "releaseEvent" &&
          platform->name == "iOS" &&
          channel == "publicBeta"
        ]),
        "iPadOS": count(*[
          _type == "releaseEvent" &&
          platform->name == "iPadOS" &&
          channel == "publicBeta"
        ])
      }`,
    ),
  ]);

  const exactChecks = candidates.map((candidate) => {
    const identity = candidate.proposedIdentity;
    const routeMatches = scopedEvents.filter(
      (event) =>
        event.releaseVersionId === candidate.releaseVersionId &&
        event.channel === identity.channel &&
        event.routeAlias === identity.routeAlias,
    );
    const fullMatches = routeMatches.filter(
      (event) =>
        event.label === identity.label &&
        event.sequence === identity.sequence &&
        event.appearanceDate === identity.appearanceDate,
    );
    return {
      candidateId: candidate.candidateId,
      releaseVersionId: candidate.releaseVersionId,
      routeAlias: identity.routeAlias,
      label: identity.label,
      sequence: identity.sequence,
      appearanceDate: identity.appearanceDate,
      routeIdentityMatchCount: routeMatches.length,
      fullCandidateMatchCount: fullMatches.length,
      routeIdentityMatchingEventIds: routeMatches.map((event) => event._id),
      fullCandidateMatchingEventIds: fullMatches.map((event) => event._id),
    };
  });

  const parentChecks = targetVersionIds.map((releaseVersionId) => ({
    releaseVersionId,
    exists: parents.some((parent) => parent._id === releaseVersionId),
  }));
  const result = {
    formatVersion: 1,
    batchId: "beta-chronology-gap-ios-ipados-point-15-18",
    reviewer: "codex-independent-review-ios-ipados-point-15-18",
    queriedAt: new Date().toISOString(),
    perspective: "published",
    useCdn: false,
    projectId: client.config().projectId,
    dataset: client.config().dataset,
    inputs: {
      candidatesPath: `${packetRoot}/candidates.json`,
      candidatesSha256: sha256(candidateBytes),
      assignmentPath: `${packetRoot}/assignment.json`,
      assignmentSha256: sha256(assignmentBytes),
    },
    expectedIdentityCount: candidates.length,
    targetVersionCount: targetVersionIds.length,
    productionCounts: {
      totalReleaseEvents,
      platformPublicBetaCounts,
      scopedReleaseEvents: scopedEvents.length,
      scopedPublicBetaEvents: scopedEvents.filter(
        (event) => event.channel === "publicBeta",
      ).length,
      exactRouteMatches: exactChecks.reduce(
        (total, check) => total + check.routeIdentityMatchCount,
        0,
      ),
      exactFullMatches: exactChecks.reduce(
        (total, check) => total + check.fullCandidateMatchCount,
        0,
      ),
      missingParents: parentChecks.filter((check) => !check.exists).length,
    },
    parentChecks,
    exactChecks,
    safety: {
      queryOnly: true,
      sanityMutationPerformed: false,
    },
  };
  await writeFile(
    `${packetRoot}/independent-review-production.json`,
    `${JSON.stringify(result, null, 2)}\n`,
  );
  console.log(
    JSON.stringify({
      queriedAt: result.queriedAt,
      expectedIdentityCount: result.expectedIdentityCount,
      targetVersionCount: result.targetVersionCount,
      ...result.productionCounts,
    }),
  );
}

run().catch((error: unknown) => {
  console.error(error);
  process.exit(1);
});
