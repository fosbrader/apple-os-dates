/**
 * Applies an already reviewed FR-021 sidecar plan. This is intentionally a
 * separate command from offline planning and has no dry-run shortcut.
 *
 * Never invoke without fresh approval of the exact plan SHA-256.
 */

import { createHash } from "node:crypto";
import * as fs from "node:fs";
import * as path from "node:path";
import { getCliClient } from "sanity/cli";

import {
  assertValidHistoricalReleaseMetadataPlan,
  buildHistoricalReleaseMetadataPlan,
  flattenedMetadataEvidence,
  historicalLifecycleObservationEvidence,
  historicalReleaseEvidenceReference,
  HistoricalReleaseMetadataNoopPlanError,
  parseCuratedHistoricalMetadataManifest,
  type HistoricalMetadataSnapshotDocument,
  type CuratedHistoricalMetadataManifest,
  type HistoricalReleaseMetadataPlan,
  type HistoricalReleaseMetadataRollback,
} from "./lib/historical-release-metadata-migration";
import { stableStringify } from "./lib/release-event-migration";
import {
  PUBLISHED_HISTORICAL_RELEASE_FETCH_OPTIONS,
  publishedHistoricalReleaseSourceQuery,
  type PublishedHistoricalReleaseSource,
} from "../src/lib/historical-release-source";
import { adaptReleaseObservations } from "../src/lib/release-observation-adapter";
import {
  buildHistoricalAnalysisDataset,
  validateHistoricalAnalysisDataset,
} from "../src/lib/historical-analysis-dataset";

const apiVersion = "2024-01-01";
const expectedProjectId = "lh3yswzu";
const expectedDataset = "production";
const maximumMutationPayloadBytes = 3_900_000;
const repositoryRoot = path.join(__dirname, "..");
const artifactDirectory = path.join(repositoryRoot, ".migration-artifacts");
const mutableSystemFields = new Set(["_rev", "_createdAt", "_updatedAt"]);

function argumentValue(flag: string): string | undefined {
  const index = process.argv.indexOf(flag);
  return index >= 0 ? process.argv[index + 1] : undefined;
}

function localJson<T>(value: string, label: string): T {
  const resolved = path.resolve(value);
  const relative = path.relative(repositoryRoot, resolved);
  if (relative.startsWith("..") || path.isAbsolute(relative)) {
    throw new Error(`${label} must stay inside the repository: ${resolved}.`);
  }
  try {
    return JSON.parse(fs.readFileSync(resolved, "utf8")) as T;
  } catch (error) {
    throw new Error(`${label} is not readable JSON: ${resolved}.`, { cause: error });
  }
}

function writeReceipt(filename: string, value: unknown): string {
  fs.mkdirSync(artifactDirectory, { recursive: true, mode: 0o700 });
  const artifactPath = path.join(artifactDirectory, filename);
  fs.writeFileSync(artifactPath, `${stableStringify(value, 2)}\n`, {
    encoding: "utf8",
    flag: "wx",
    mode: 0o600,
  });
  return artifactPath;
}

function writableBody(document: HistoricalMetadataSnapshotDocument) {
  return Object.fromEntries(
    Object.entries(document).filter(([field]) => !mutableSystemFields.has(field)),
  );
}

function exactEqual(left: unknown, right: unknown): boolean {
  return stableStringify(left) === stableStringify(right);
}

function sha256(value: unknown): string {
  return createHash("sha256").update(stableStringify(value)).digest("hex");
}

function reference(id: string) {
  return { _type: "reference", _ref: id };
}

function assertPlanMatchesManifest(
  plan: HistoricalReleaseMetadataPlan,
  manifest: CuratedHistoricalMetadataManifest,
): void {
  const mutationsByRelease = new Map(
    plan.mutations.map((mutation) => [mutation.releaseVersionId, mutation]),
  );
  const lifecycleByRelease = new Map(
    plan.lifecycleObservationPatches.map((patch) => [patch.id, patch]),
  );
  const requestedLifecycleIds = new Set(
    manifest.entries
      .filter(({ statusFirstObservedAt }) => Boolean(statusFirstObservedAt))
      .map(({ releaseVersionId }) => releaseVersionId),
  );
  if (lifecycleByRelease.size !== requestedLifecycleIds.size) {
    throw new Error(
      "Reviewed plan lifecycle patches do not exactly cover the curated manifest instructions.",
    );
  }
  for (const entry of manifest.entries) {
    const mutation = mutationsByRelease.get(entry.releaseVersionId);
    if (!mutation) {
      throw new Error(
        `${entry.releaseVersionId} has no sidecar mutation in the reviewed plan.`,
      );
    }
    const expectedManagedFields = {
      releaseVersion: reference(entry.releaseVersionId),
      productFamilyId: entry.productFamilyId,
      releaseClass: entry.releaseClass,
      releasePosition: entry.releasePosition,
      releaseCycleId: entry.releaseCycleId,
      metadataEvidence: {
        productFamily: entry.metadataEvidence.productFamily.map(({ id }) =>
          historicalReleaseEvidenceReference(id, "metadataEvidence.productFamily"),
        ),
        releaseClass: entry.metadataEvidence.releaseClass.map(({ id }) =>
          historicalReleaseEvidenceReference(id, "metadataEvidence.releaseClass"),
        ),
        releasePosition: entry.metadataEvidence.releasePosition.map(({ id }) =>
          historicalReleaseEvidenceReference(id, "metadataEvidence.releasePosition"),
        ),
        releaseCycle: entry.metadataEvidence.releaseCycle.map(({ id }) =>
          historicalReleaseEvidenceReference(id, "metadataEvidence.releaseCycle"),
        ),
      },
      chronologyCoverage: {
        state: entry.chronologyCoverage.state,
        ...(entry.chronologyCoverage.state === "unknown"
          ? { reason: entry.chronologyCoverage.reason }
          : {}),
        evidence: entry.chronologyCoverage.evidence.map(({ id }) =>
          historicalReleaseEvidenceReference(
            id,
            "chronologyCoverage.evidence",
          ),
        ),
      },
    };
    const managedAfter = Object.fromEntries(
      Object.keys(expectedManagedFields).map((field) => [
        field,
        mutation.after[field],
      ]),
    );
    const metadataRevisionMatches =
      entry.expectedMetadataRevision === null
        ? mutation.action === "create" && mutation.ifRevisionId === null
        : mutation.action === "patch" &&
          mutation.ifRevisionId === entry.expectedMetadataRevision;
    if (
      mutation.id !== entry.metadataId ||
      mutation.releaseVersionRevision !==
        entry.expectedReleaseVersionRevision ||
      mutation.releaseTrainRevision !== entry.expectedReleaseTrainRevision ||
      mutation.platformId !== entry.platformId ||
      mutation.platformRevision !== entry.expectedPlatformRevision ||
      !metadataRevisionMatches ||
      !exactEqual(mutation.metadataEvidence, entry.metadataEvidence) ||
      !exactEqual(
        mutation.chronologyEvidence,
        entry.chronologyCoverage.evidence,
      ) ||
      !exactEqual(managedAfter, expectedManagedFields)
    ) {
      throw new Error(
        `${entry.releaseVersionId} plan operation does not exactly match the curated manifest.`,
      );
    }

    const lifecyclePatch = lifecycleByRelease.get(entry.releaseVersionId);
    if (!entry.statusFirstObservedAt) {
      if (lifecyclePatch) {
        throw new Error(
          `${entry.releaseVersionId} has an unrequested lifecycle observation patch.`,
        );
      }
      continue;
    }
    const expectedEvidence =
      entry.statusFirstObservedAt.strategy === "explicit"
        ? entry.statusFirstObservedAt.evidence
        : [];
    if (
      !lifecyclePatch ||
      lifecyclePatch.ifRevisionId !== entry.expectedReleaseVersionRevision ||
      lifecyclePatch.basis !== entry.statusFirstObservedAt.strategy ||
      !exactEqual(
        lifecyclePatch.evidence.map(({ id, expectedRevision }) => ({
          id,
          expectedRevision,
        })),
        expectedEvidence,
      ) ||
      (entry.statusFirstObservedAt.strategy === "explicit" &&
        lifecyclePatch.set.statusFirstObservedAt !==
          entry.statusFirstObservedAt.value)
    ) {
      throw new Error(
        `${entry.releaseVersionId} lifecycle observation patch does not exactly match the curated manifest.`,
      );
    }
  }
}

async function run(): Promise<void> {
  const planArgument = argumentValue("--plan");
  const rollbackArgument = argumentValue("--rollback");
  const manifestArgument = argumentValue("--manifest");
  const acknowledgedPlanSha = argumentValue("--plan-sha");
  if (
    !process.argv.includes("--apply") ||
    !process.argv.includes("--confirm-production") ||
    !planArgument ||
    !rollbackArgument ||
    !manifestArgument ||
    !acknowledgedPlanSha
  ) {
    throw new Error(
      "Apply requires --plan <artifact> --rollback <artifact> --manifest <curated manifest> --apply --confirm-production --plan-sha <exact SHA>.",
    );
  }

  const plan = localJson<HistoricalReleaseMetadataPlan>(planArgument, "Plan artifact");
  const rollback = localJson<HistoricalReleaseMetadataRollback>(
    rollbackArgument,
    "Rollback artifact",
  );
  const manifest = parseCuratedHistoricalMetadataManifest(
    localJson<unknown>(manifestArgument, "Curated manifest"),
  );
  assertValidHistoricalReleaseMetadataPlan(plan, rollback);
  if (sha256(manifest) !== plan.curatedManifestDigest) {
    throw new Error(
      "Curated manifest does not match the reviewed plan artifact. Generate and approve a new plan.",
    );
  }
  if (acknowledgedPlanSha !== plan.planDigest) {
    throw new Error(
      `Plan SHA mismatch. Fresh approval must name exactly ${plan.planDigest}.`,
    );
  }
  if (
    plan.mutations.length !== manifest.entries.length ||
    new Set(plan.mutations.map(({ releaseVersionId }) => releaseVersionId)).size !==
      manifest.entries.length
  ) {
    throw new Error(
      "Apply requires one reviewed sidecar mutation per manifest entry; residual-proof plans cannot be applied.",
    );
  }
  assertPlanMatchesManifest(plan, manifest);

  const client = getCliClient({ apiVersion, useCdn: false });
  const config = client.config();
  if (
    config.projectId !== expectedProjectId ||
    config.dataset !== expectedDataset
  ) {
    throw new Error(
      `This apply is restricted to ${expectedProjectId}/${expectedDataset}; received ${config.projectId}/${config.dataset}.`,
    );
  }
  const rawClient = client.withConfig({ perspective: "raw", useCdn: false });
  const publishedClient = client.withConfig({
    perspective: "published",
    useCdn: false,
  });

  const expectedRevisions = new Map<string, string>();
  const evidenceIds = new Set<string>();
  const addExpectedRevision = (id: string, revision: string) => {
    const prior = expectedRevisions.get(id);
    if (prior && prior !== revision) {
      throw new Error(`${id} has conflicting planned dependency revisions.`);
    }
    expectedRevisions.set(id, revision);
  };
  for (const mutation of plan.mutations) {
    addExpectedRevision(
      mutation.releaseVersionId,
      mutation.releaseVersionRevision,
    );
    addExpectedRevision(mutation.releaseTrainId, mutation.releaseTrainRevision);
    addExpectedRevision(mutation.platformId, mutation.platformRevision);
    for (const evidence of [
      ...flattenedMetadataEvidence(mutation.metadataEvidence),
      ...mutation.chronologyEvidence,
    ]) {
      evidenceIds.add(evidence.id);
      addExpectedRevision(evidence.id, evidence.expectedRevision);
    }
  }
  for (const patch of plan.lifecycleObservationPatches) {
    addExpectedRevision(patch.id, patch.ifRevisionId);
    for (const evidence of patch.evidence) {
      evidenceIds.add(evidence.id);
      addExpectedRevision(evidence.id, evidence.expectedRevision);
    }
  }
  const targetIds = [
    ...new Set([
      ...plan.mutations.map(({ id }) => id),
      ...plan.lifecycleObservationPatches.map(({ id }) => id),
    ]),
  ];
  const dependencyIds = [...expectedRevisions.keys()];
  const rawIds = [...new Set([...targetIds, ...dependencyIds])];
  const plannedReleaseVersionIds = plan.mutations.map(
    ({ releaseVersionId }) => releaseVersionId,
  );
  const rawDocuments = await rawClient.fetch<HistoricalMetadataSnapshotDocument[]>(
    `*[
      _id in $ids ||
      _id in $draftIds ||
      (
        _type == "historicalReleaseMetadata" &&
        releaseVersion._ref in $releaseVersionIds
      )
    ] {
      _id, _type, _rev, releaseVersion, publishedAt, accessedAt, verifiedAt
    } | order(_id asc)`,
    {
      ids: rawIds,
      draftIds: rawIds.map((id) => `drafts.${id}`),
      releaseVersionIds: plannedReleaseVersionIds,
    },
  );
  const draft = rawDocuments.find(({ _id }) => _id.startsWith("drafts."));
  if (draft) {
    throw new Error(`Open draft ${draft._id} blocks this apply.`);
  }
  const plannedSidecarIds = new Set(plan.mutations.map(({ id }) => id));
  const unexpectedSidecar = rawDocuments.find(
    (document) =>
      document._type === "historicalReleaseMetadata" &&
      !plannedSidecarIds.has(document._id),
  );
  if (unexpectedSidecar) {
    throw new Error(
      `Unexpected sidecar ${unexpectedSidecar._id} now targets a planned release version. Generate and approve a new plan.`,
    );
  }
  const rawById = new Map(rawDocuments.map((document) => [document._id, document]));
  for (const [id, expectedRevision] of expectedRevisions) {
    const current = rawById.get(id);
    if (!current) throw new Error(`Required published dependency ${id} is missing.`);
    if (current._rev !== expectedRevision) {
      throw new Error(
        `${id} changed since planning (${expectedRevision} -> ${current._rev}). Generate and approve a new plan.`,
      );
    }
    if (
      evidenceIds.has(id) &&
      current._type !== "source" &&
      current._type !== "auditBatch"
    ) {
      throw new Error(
        `${id} is no longer a source or auditBatch evidence document.`,
      );
    }
  }
  for (const mutation of plan.mutations) {
    const current = rawById.get(mutation.id);
    if (mutation.action === "create" && current) {
      throw new Error(`${mutation.id} now exists; generate and approve a new plan.`);
    }
    if (
      mutation.action === "patch" &&
      (!current || current._rev !== mutation.ifRevisionId)
    ) {
      throw new Error(
        `${mutation.id} no longer matches planned revision ${mutation.ifRevisionId}.`,
      );
    }
  }
  for (const patch of plan.lifecycleObservationPatches) {
    const current = rawById.get(patch.id);
    if (
      !current ||
      current._type !== "releaseVersion" ||
      current._rev !== patch.ifRevisionId
    ) {
      throw new Error(
        `${patch.id} no longer matches planned lifecycle revision ${patch.ifRevisionId}.`,
      );
    }
    for (const evidence of patch.evidence) {
      const evidenceDocument = rawById.get(evidence.id);
      if (!evidenceDocument) {
        throw new Error(
          `${patch.id} lifecycle evidence ${evidence.id} is missing.`,
        );
      }
      const currentTemporalEvidence = historicalLifecycleObservationEvidence(
        evidenceDocument,
        evidence,
        `${patch.id}.statusFirstObservedAt`,
      );
      if (!exactEqual(currentTemporalEvidence, evidence)) {
        throw new Error(
          `${patch.id} lifecycle evidence availability changed since planning. Generate and approve a new plan.`,
        );
      }
    }
  }

  let transaction = client.transaction();
  for (const mutation of plan.mutations) {
    if (mutation.action === "create") {
      transaction = transaction.create(mutation.after);
      continue;
    }
    transaction = transaction.patch(mutation.id, (patch) => {
      let guarded = patch.ifRevisionId(mutation.ifRevisionId as string);
      if (Object.keys(mutation.set).length) guarded = guarded.set(mutation.set);
      if (mutation.unset.length) guarded = guarded.unset(mutation.unset);
      return guarded;
    });
  }
  for (const lifecyclePatch of plan.lifecycleObservationPatches) {
    transaction = transaction.patch(lifecyclePatch.id, (patch) =>
      patch
        .ifRevisionId(lifecyclePatch.ifRevisionId)
        .set(lifecyclePatch.set),
    );
  }
  const mutationPayloadBytes = Buffer.byteLength(
    JSON.stringify({ mutations: transaction.serialize() }),
    "utf8",
  );
  if (mutationPayloadBytes > maximumMutationPayloadBytes) {
    throw new Error(
      `Mutation payload is ${mutationPayloadBytes} bytes, above the guarded ${maximumMutationPayloadBytes}-byte limit.`,
    );
  }

  const result = await transaction.commit({
    visibility: "sync",
    tag: "version-record.historical-release-metadata",
  });
  const postDocuments = await publishedClient.fetch<
    HistoricalMetadataSnapshotDocument[]
  >(`*[_id in $ids]`, { ids: targetIds });
  const postById = new Map(postDocuments.map((document) => [document._id, document]));
  const failures = [
    ...plan.mutations,
    ...plan.lifecycleObservationPatches,
  ].flatMap((mutation) => {
    const current = postById.get(mutation.id);
    return current && exactEqual(writableBody(current), mutation.after)
      ? []
      : [`${mutation.id} does not match the exact reviewed after body`];
  });
  if (failures.length) {
    throw new Error(
      `Transaction ${result.transactionId} committed, but post-apply verification failed: ${failures.join(
        "; ",
      )}. Use the reviewed rollback artifact for guarded recovery.`,
    );
  }
  const issuedAt = new Date().toISOString();
  let liveDataset: ReturnType<typeof buildHistoricalAnalysisDataset>;
  try {
    const liveSource =
      await publishedClient.fetch<PublishedHistoricalReleaseSource>(
        publishedHistoricalReleaseSourceQuery,
        {},
        PUBLISHED_HISTORICAL_RELEASE_FETCH_OPTIONS,
      );
    const adapterResult = adaptReleaseObservations({
      asOfDate: issuedAt.slice(0, 10),
      issuedAt,
      releases: liveSource.releases,
      events: liveSource.events,
      compatibilityMilestones: liveSource.compatibilityMilestones,
    });
    liveDataset = buildHistoricalAnalysisDataset({
      adapterResult,
      releaseMetadata: liveSource.releaseMetadata,
    });
    const liveDatasetIssues = validateHistoricalAnalysisDataset(liveDataset);
    if (liveDatasetIssues.length) {
      throw new Error(stableStringify(liveDatasetIssues));
    }
  } catch (error) {
    throw new Error(
      `Transaction ${result.transactionId} committed, but post-apply FR-007 validation failed: ${error instanceof Error ? error.message : String(error)}. Use the reviewed rollback artifact for guarded recovery.`,
      { cause: error },
    );
  }

  let zeroResidual = false;
  try {
    const postPlanningDocuments = await publishedClient.fetch<
      HistoricalMetadataSnapshotDocument[]
    >(`*[_type in $types]`, {
      types: [
        "platform",
        "releaseTrain",
        "releaseVersion",
        "source",
        "auditBatch",
        "historicalReleaseMetadata",
      ],
    });
    const postPlanningById = new Map(
      postPlanningDocuments.map((document) => [document._id, document]),
    );
    const replayManifest = structuredClone(manifest);
    for (const entry of replayManifest.entries) {
      const currentMetadata = postPlanningById.get(entry.metadataId);
      const currentReleaseVersion = postPlanningById.get(entry.releaseVersionId);
      if (!currentMetadata?._rev || !currentReleaseVersion?._rev) {
        throw new Error(
          `Post-apply zero-residual proof cannot resolve ${entry.metadataId} and ${entry.releaseVersionId}.`,
        );
      }
      entry.expectedMetadataRevision = currentMetadata._rev;
      entry.expectedReleaseVersionRevision = currentReleaseVersion._rev;
    }
    const residual = buildHistoricalReleaseMetadataPlan(
      { documents: postPlanningDocuments },
      replayManifest,
      { allowNoopEntries: true },
    );
    throw new Error(
      `Post-apply rerun produced ${residual.plan.mutations.length} sidecar and ${residual.plan.lifecycleObservationPatches.length} lifecycle residual mutation(s).`,
    );
  } catch (error) {
    if (error instanceof HistoricalReleaseMetadataNoopPlanError) {
      zeroResidual = true;
    } else {
      throw new Error(
        `Transaction ${result.transactionId} committed, but the post-apply planner rerun failed: ${error instanceof Error ? error.message : String(error)}. Use the reviewed rollback artifact for guarded recovery.`,
        { cause: error },
      );
    }
  }
  if (!zeroResidual) {
    throw new Error(
      "Post-apply planner rerun did not prove zero residual mutations.",
    );
  }
  const receiptPath = writeReceipt(
    `historical-release-metadata-receipt-${plan.planDigest}.json`,
    {
      artifactType: "sanity-historical-release-metadata-apply-receipt",
      formatVersion: 1,
      projectId: expectedProjectId,
      dataset: expectedDataset,
      planDigest: plan.planDigest,
      transactionId: result.transactionId,
      historicalDatasetFingerprint:
        liveDataset.fingerprints.datasetFingerprint,
      zeroResidualPlannerRerun: zeroResidual,
      revisions: Object.fromEntries(
        postDocuments
          .sort((left, right) => left._id.localeCompare(right._id))
          .map(({ _id, _rev }) => [_id, _rev]),
      ),
    },
  );
  console.log(`Committed exact plan ${plan.planDigest}.`);
  console.log(`Apply receipt: ${receiptPath}`);
}

run().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
});
