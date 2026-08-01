/**
 * Plans or applies the checked-in, source-backed launch-content manifest.
 *
 * Dry run (default):
 *   npx sanity exec scripts/ingest-launch-content.ts --with-user-token -- \
 *     --content scripts/launch-content.example.json
 *
 * Apply the exact reviewed dry-run plan:
 *   npx sanity exec scripts/ingest-launch-content.ts --with-user-token -- \
 *     --content scripts/launch-content.example.json \
 *     --apply --confirm-production --plan-sha <PLAN_SHA>
 *
 * This command never fetches or copies publisher prose. Optional DocC
 * transport URLs in the manifest are validation provenance only.
 */

import * as fs from "node:fs";
import * as path from "node:path";
import { getCliClient } from "sanity/cli";
import {
  LAUNCH_CONTENT_DATASET,
  LAUNCH_CONTENT_PROJECT_ID,
  assertLaunchTarget,
  assertValidLaunchContentPlan,
  buildLaunchContentPlan,
  type LaunchContentBundle,
  type SanityDocument,
} from "./lib/launch-content-ingestion";
import { stableStringify } from "./lib/release-event-migration";

const apiVersion = "2024-01-01";
// Sanity's Content Lake rejects mutation request bodies above 4 MB. Keep a
// small margin for client-added request metadata so a reviewed plan cannot
// cross that boundary only when it is committed.
const maximumMutationPayloadBytes = 3_900_000;
const repositoryRoot = path.join(__dirname, "..");
const artifactDirectory = path.join(repositoryRoot, ".migration-artifacts");
const documentTypes = [
  "platform",
  "releaseTrain",
  "releaseVersion",
  "source",
  "releaseEvent",
  "releaseBuild",
  "releaseChange",
  "auditBatch",
];

function argumentValue(flag: string): string | undefined {
  const index = process.argv.indexOf(flag);
  return index >= 0 ? process.argv[index + 1] : undefined;
}

function printHelp(): void {
  console.log(
    [
      "Source-backed launch-content ingestion",
      "",
      "Dry run:",
      "  npx sanity exec scripts/ingest-launch-content.ts --with-user-token -- --content <manifest.json>",
      "",
      "Apply an exact reviewed plan:",
      "  npx sanity exec scripts/ingest-launch-content.ts --with-user-token -- --content <manifest.json> --apply --confirm-production --plan-sha <SHA>",
      "",
      `The command is hard-guarded to ${LAUNCH_CONTENT_PROJECT_ID}/${LAUNCH_CONTENT_DATASET}.`,
      "A plan artifact and rollback snapshot are written before any apply.",
    ].join("\n"),
  );
}

function parseManifest(contentPath: string): LaunchContentBundle {
  const resolved = path.resolve(contentPath);
  const relative = path.relative(repositoryRoot, resolved);
  if (relative.startsWith("..") || path.isAbsolute(relative)) {
    throw new Error(
      `The curated manifest must stay inside the repository: ${resolved}.`,
    );
  }
  if (path.extname(resolved).toLowerCase() !== ".json") {
    throw new Error("The curated manifest must be a JSON file.");
  }
  const content = fs.readFileSync(resolved, "utf8");
  let parsed: unknown;
  try {
    parsed = JSON.parse(content) as unknown;
  } catch (error) {
    throw new Error(`${resolved} is not valid JSON.`, {
      cause: error,
    });
  }
  return parsed as LaunchContentBundle;
}

function writeArtifact(filename: string, value: unknown): string {
  fs.mkdirSync(artifactDirectory, {
    recursive: true,
    mode: 0o700,
  });
  const artifactPath = path.join(artifactDirectory, filename);
  const content = `${stableStringify(value, 2)}\n`;
  if (fs.existsSync(artifactPath)) {
    const existing = fs.readFileSync(artifactPath, "utf8");
    if (existing !== content) {
      throw new Error(
        `${artifactPath} already exists with different contents.`,
      );
    }
    return artifactPath;
  }
  fs.writeFileSync(artifactPath, content, {
    encoding: "utf8",
    flag: "wx",
    mode: 0o600,
  });
  return artifactPath;
}

async function fetchPublishedSnapshot(
  client: ReturnType<typeof getCliClient>,
): Promise<SanityDocument[]> {
  return client.fetch<SanityDocument[]>(`*[_type in $types] | order(_id asc)`, {
    types: documentTypes,
  });
}

async function assertNoBlockingDrafts(
  rawClient: ReturnType<typeof getCliClient>,
  {
    mutationIds,
    releaseVersionIds,
    sourceUrls,
  }: {
    mutationIds: string[];
    releaseVersionIds: string[];
    sourceUrls: string[];
  },
): Promise<void> {
  const draftIds = [...new Set([...mutationIds, ...releaseVersionIds])].map(
    (id) => `drafts.${id}`,
  );
  const blocking = await rawClient.fetch<Array<{ _id: string; _type: string }>>(
    `*[
      _id in $draftIds ||
      (
        _id match "drafts.*" &&
        _type == "source" &&
        canonicalUrl in $sourceUrls
      )
    ] {
      _id,
      _type
    }`,
    { draftIds, sourceUrls },
  );
  if (blocking.length) {
    throw new Error(
      `Open Sanity drafts block launch ingestion: ${blocking
        .map((document) => `${document._id} (${document._type})`)
        .join(", ")}.`,
    );
  }
}

async function fetchDocumentsByIds(
  client: ReturnType<typeof getCliClient>,
  ids: string[],
): Promise<SanityDocument[]> {
  if (!ids.length) return [];
  return client.fetch<SanityDocument[]>(`*[_id in $ids] | order(_id asc)`, {
    ids,
  });
}

function buildTransaction(
  client: ReturnType<typeof getCliClient>,
  result: ReturnType<typeof buildLaunchContentPlan>,
) {
  let transaction = client.transaction();
  for (const create of result.plan.creates) {
    transaction = transaction.create(create.document);
  }
  for (const patch of result.plan.patches) {
    transaction = transaction.patch(patch.id, (builder) =>
      builder.ifRevisionId(patch.ifRevisionId).set(patch.set),
    );
  }
  return transaction;
}

async function run(): Promise<void> {
  if (process.argv.includes("--help")) {
    printHelp();
    return;
  }
  const contentArgument = argumentValue("--content");
  if (!contentArgument) {
    throw new Error("--content <checked-in-manifest.json> is required.");
  }
  const apply = process.argv.includes("--apply");
  const productionAcknowledged = process.argv.includes("--confirm-production");
  const acknowledgedPlanSha = argumentValue("--plan-sha");
  if (apply && !productionAcknowledged) {
    throw new Error(
      "Production writes require both --apply and --confirm-production.",
    );
  }
  if (!apply && (productionAcknowledged || acknowledgedPlanSha)) {
    throw new Error(
      "--confirm-production and --plan-sha are accepted only with --apply.",
    );
  }

  const client = getCliClient({
    apiVersion,
    useCdn: false,
  });
  const config = client.config();
  assertLaunchTarget({
    projectId: config.projectId,
    dataset: config.dataset,
  });
  const publishedClient = client.withConfig({
    perspective: "published",
    useCdn: false,
  });
  const rawClient = client.withConfig({
    perspective: "raw",
    useCdn: false,
  });
  const bundle = parseManifest(contentArgument);
  assertLaunchTarget(bundle.target);
  const snapshot = await fetchPublishedSnapshot(publishedClient);
  const result = buildLaunchContentPlan(snapshot, bundle);
  assertValidLaunchContentPlan(result.plan, result.rollback);
  const plannedTransaction = buildTransaction(client, result);
  const mutationPayloadBytes = Buffer.byteLength(
    JSON.stringify({
      mutations: plannedTransaction.serialize(),
    }),
    "utf8",
  );
  if (mutationPayloadBytes > maximumMutationPayloadBytes) {
    throw new Error(
      `The mutation payload is ${mutationPayloadBytes.toLocaleString()} bytes; the guarded limit is ${maximumMutationPayloadBytes.toLocaleString()} bytes. Split the migration before applying it.`,
    );
  }

  const mutationIds = [
    ...result.plan.creates.map((create) => create.document._id),
    ...result.plan.patches.map((patch) => patch.id),
  ];
  const sourceUrls = result.plan.creates
    .filter((create) => create.document._type === "source")
    .map((create) => String(create.document.canonicalUrl));
  await assertNoBlockingDrafts(rawClient, {
    mutationIds,
    releaseVersionIds: result.migrationPlan.versionStates.map(
      (state) => state.releaseVersionId,
    ),
    sourceUrls,
  });

  const planPath = writeArtifact(
    `launch-content-plan-${result.plan.planDigest}.json`,
    {
      artifactType: "sanity-launch-content-plan",
      manifest: path.relative(repositoryRoot, path.resolve(contentArgument)),
      plan: result.plan,
    },
  );
  const rollbackPath = writeArtifact(
    `launch-content-rollback-${result.plan.planDigest}.json`,
    result.rollback,
  );

  console.log(
    `${apply ? "APPLY" : "DRY RUN"}: ${result.plan.summary.creates} create, ${result.plan.summary.patches} revision-guarded patch, ${result.plan.summary.unchanged} unchanged.`,
  );
  console.log(
    `DOCUMENTS: ${result.plan.summary.sourceCreates} source, ${result.plan.summary.versionCreates} version, ${result.plan.summary.eventCreates} event, ${result.plan.summary.buildCreates} build, ${result.plan.summary.changeCreates} change creates; ${result.plan.summary.versionPatches} version patches.`,
  );
  console.log(`PLAN SHA: ${result.plan.planDigest}`);
  console.log(
    `MUTATION PAYLOAD: ${mutationPayloadBytes.toLocaleString()} bytes (${((mutationPayloadBytes / maximumMutationPayloadBytes) * 100).toFixed(1)}% of guarded limit).`,
  );
  console.log(`PLAN ARTIFACT: ${planPath}`);
  console.log(`ROLLBACK SNAPSHOT: ${rollbackPath}`);

  if (!apply) {
    console.log(
      "No Sanity data changed. Review both artifacts, then rerun with --apply --confirm-production and the exact PLAN SHA.",
    );
    return;
  }
  if (!acknowledgedPlanSha || acknowledgedPlanSha !== result.plan.planDigest) {
    throw new Error(
      `Apply requires --plan-sha ${result.plan.planDigest} from this exact dry-run plan.`,
    );
  }
  if (!fs.existsSync(rollbackPath)) {
    throw new Error("The rollback snapshot must exist before any write.");
  }
  if (mutationIds.length === 0) {
    console.log(
      "The reviewed plan is already fully applied; no transaction was created.",
    );
    return;
  }

  const commit = await plannedTransaction.commit({
    visibility: "sync",
    tag: "version-record.launch-content-ingestion",
  });

  const postSnapshot = await fetchPublishedSnapshot(publishedClient);
  const residual = buildLaunchContentPlan(postSnapshot, bundle);
  if (residual.plan.creates.length || residual.plan.patches.length) {
    throw new Error(
      `Transaction ${commit.transactionId} committed but left ${residual.plan.creates.length} create and ${residual.plan.patches.length} patch residuals. Use ${rollbackPath} for guarded recovery.`,
    );
  }
  const postDocuments = await fetchDocumentsByIds(publishedClient, mutationIds);
  const receiptPath = writeArtifact(
    `launch-content-receipt-${result.plan.planDigest}.json`,
    {
      artifactType: "sanity-launch-content-apply-receipt",
      formatVersion: 1,
      projectId: LAUNCH_CONTENT_PROJECT_ID,
      dataset: LAUNCH_CONTENT_DATASET,
      planDigest: result.plan.planDigest,
      transactionId: commit.transactionId,
      revisions: Object.fromEntries(
        postDocuments.map((document) => [document._id, document._rev]),
      ),
      rollbackPath: path.basename(rollbackPath),
      residualCreates: 0,
      residualPatches: 0,
    },
  );
  console.log(
    `Committed and zero-residual verified transaction ${commit.transactionId}.`,
  );
  console.log(`APPLY RECEIPT: ${receiptPath}`);
}

run().catch((error) => {
  console.error(
    "Launch-content ingestion failed:",
    error instanceof Error ? error.message : String(error),
  );
  process.exit(1);
});
