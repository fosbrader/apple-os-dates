/**
 * Legacy launch backfill for the 2026 release cycles.
 *
 * This command is superseded by `sanity:history:check` and
 * `sanity:history:apply`, which reconcile the complete verified chronology.
 * It remains available as a narrowly guarded audit of its original target
 * records and must not be used to bypass the history reconciliation plan.
 *
 * The command is a dry run unless `--apply` is passed. Existing records are
 * only eligible for replacement when they match the known one-milestone 26.4
 * placeholder state; later editor changes cause the script to stop.
 *
 * Dry run:
 *   npm run sanity:backfill:2026:check
 *
 * Apply:
 *   npm run sanity:backfill:2026:apply -- --confirm-production
 */

import { getCliClient } from "sanity/cli";
import {
  buildCurrentReleaseTrains,
  buildCurrentReleaseVersions,
  currentReleasePlatforms,
} from "./lib/current-release-cycles";

throw new Error(
  "Retired: this launch-only backfill targets obsolete 2026 placeholder records. Use sanity:history:check for the audited chronology.",
);

const apiVersion = "2024-01-01";
const applyChanges = process.argv.includes("--apply");
const productionAcknowledged = process.argv.includes(
  "--confirm-production",
);
const expectedProjectId = "lh3yswzu";
const expectedDataset = "production";
const expectedTargetCount = 24;
const maximumCreateCount = 21;
const maximumUpdateCount = 3;

interface SanityMilestone {
  _key: string;
  _type: "betaMilestone";
  label: string;
  date: string;
  note?: string;
  sourceUrl: string;
  sourceLabel: "Apple Developer";
  isRevision: boolean;
}

interface DesiredReleaseDocument {
  _id: string;
  _type: "releaseVersion";
  releaseTrain: {
    _type: "reference";
    _ref: string;
  };
  version: string;
  publicReleaseDate?: string;
  milestones: SanityMilestone[];
}

interface ExistingReleaseDocument {
  _id: string;
  _rev: string;
  version?: string;
  publicReleaseDate?: string;
  releaseTrainRef?: string;
  milestones?: Array<Partial<SanityMilestone> & { note?: string }>;
}

function makeId(type: string, ...parts: Array<string | number>): string {
  return `${type}-${parts
    .map((part) =>
      String(part).toLowerCase().replace(/[^a-z0-9]/g, "-"),
    )
    .join("-")}`;
}

function desiredDocuments(): DesiredReleaseDocument[] {
  return buildCurrentReleaseVersions().map((release) => ({
    _id: makeId("version", release.platformSlug, release.version),
    _type: "releaseVersion",
    releaseTrain: {
      _type: "reference",
      _ref: makeId(
        "train",
        release.platformSlug,
        release.majorVersion,
      ),
    },
    version: release.version,
    ...(release.publicReleaseDate
      ? { publicReleaseDate: release.publicReleaseDate }
      : {}),
    milestones: release.milestones.map((milestone) => ({
      _key: milestone.key,
      _type: "betaMilestone",
      label: milestone.label,
      date: milestone.date,
      ...(milestone.note ? { note: milestone.note } : {}),
      sourceUrl: milestone.sourceUrl,
      sourceLabel: milestone.sourceLabel,
      isRevision: milestone.isRevision,
    })),
  }));
}

function comparableDesired(document: DesiredReleaseDocument) {
  return {
    version: document.version,
    publicReleaseDate: document.publicReleaseDate ?? null,
    releaseTrainRef: document.releaseTrain._ref,
    milestones: document.milestones.map(comparableMilestone),
  };
}

function comparableExisting(document: ExistingReleaseDocument) {
  return {
    version: document.version,
    publicReleaseDate: document.publicReleaseDate ?? null,
    releaseTrainRef: document.releaseTrainRef,
    milestones: (document.milestones ?? []).map(comparableMilestone),
  };
}

function comparableMilestone(milestone: Partial<SanityMilestone>) {
  return {
    _key: milestone._key,
    _type: milestone._type,
    label: milestone.label,
    date: milestone.date,
    note: milestone.note,
    sourceUrl: milestone.sourceUrl,
    sourceLabel: milestone.sourceLabel,
    isRevision: milestone.isRevision,
  };
}

function documentsMatch(
  desired: DesiredReleaseDocument,
  existing: ExistingReleaseDocument,
): boolean {
  return (
    JSON.stringify(comparableDesired(desired)) ===
    JSON.stringify(comparableExisting(existing))
  );
}

function isKnownLegacyPlaceholder(
  document: ExistingReleaseDocument,
): boolean {
  const eligibleIds = new Set([
    "version-ios-26-4",
    "version-ipados-26-4",
    "version-visionos-26-4",
  ]);
  const milestones = document.milestones ?? [];
  const milestone = milestones[0];
  const expectedTrainRef = document._id.replace(
    /^version-(.+)-26-4$/,
    "train-$1-26",
  );

  return (
    eligibleIds.has(document._id) &&
    document.version === "26.4" &&
    !document.publicReleaseDate &&
    document.releaseTrainRef === expectedTrainRef &&
    milestones.length === 1 &&
    milestone?._key === "m0" &&
    milestone?._type === "betaMilestone" &&
    milestone.label === "Beta 1" &&
    milestone.date === "2026-02-16" &&
    milestone.isRevision === false &&
    !milestone.note &&
    !milestone.sourceUrl &&
    !milestone.sourceLabel
  );
}

async function fetchReleaseDocuments(
  client: ReturnType<typeof getCliClient>,
  ids: string[],
): Promise<ExistingReleaseDocument[]> {
  return client.fetch(
    `*[_id in $ids]{
      _id,
      _rev,
      version,
      publicReleaseDate,
      "releaseTrainRef": releaseTrain._ref,
      milestones[]{
        _key,
        _type,
        label,
        date,
        note,
        sourceUrl,
        sourceLabel,
        isRevision
      }
    }`,
    { ids },
  );
}

async function run() {
  const client = getCliClient({ apiVersion, useCdn: false });
  const clientConfig = client.config();
  const projectId = clientConfig.projectId;
  const dataset = clientConfig.dataset;

  console.log(`Target: Sanity project ${projectId}, dataset ${dataset}.`);
  console.warn(
    "Legacy command: use sanity:history:check/apply for the verified chronology.",
  );

  if (
    projectId !== expectedProjectId ||
    dataset !== expectedDataset
  ) {
    throw new Error(
      `This one-time backfill is restricted to ${expectedProjectId}/${expectedDataset}.`,
    );
  }

  if (applyChanges && !productionAcknowledged) {
    throw new Error(
      "Production writes require both --apply and --confirm-production.",
    );
  }

  const desired = desiredDocuments();

  if (desired.length !== expectedTargetCount) {
    throw new Error(
      `Expected ${expectedTargetCount} target releases, found ${desired.length}.`,
    );
  }

  const releaseIds = desired.map((document) => document._id);
  const requiredTrainIds = currentReleasePlatforms.map((platform) =>
    makeId("train", platform.slug, 26),
  );
  const existingTrainIds = await client.fetch<string[]>(
    `*[_id in $ids]._id`,
    { ids: requiredTrainIds },
  );
  const missingTrainIds = requiredTrainIds.filter(
    (id) => !existingTrainIds.includes(id),
  );

  if (missingTrainIds.length) {
    throw new Error(
      `Missing required 26.x release trains: ${missingTrainIds.join(", ")}`,
    );
  }

  const existing = await fetchReleaseDocuments(client, releaseIds);
  const existingById = new Map(
    existing.map((document) => [document._id, document]),
  );
  const creates: DesiredReleaseDocument[] = [];
  const updates: Array<{
    desired: DesiredReleaseDocument;
    existing: ExistingReleaseDocument;
  }> = [];
  const unchanged: DesiredReleaseDocument[] = [];

  for (const document of desired) {
    const current = existingById.get(document._id);

    if (!current) {
      creates.push(document);
      continue;
    }

    if (documentsMatch(document, current)) {
      unchanged.push(document);
      continue;
    }

    if (!isKnownLegacyPlaceholder(current)) {
      throw new Error(
        `${document._id} differs from both the target data and the known legacy placeholder. Review it in Studio; this script will not overwrite later editor changes.`,
      );
    }

    updates.push({ desired: document, existing: current });
  }

  if (
    creates.length > maximumCreateCount ||
    updates.length > maximumUpdateCount
  ) {
    throw new Error(
      `Mutation scope exceeded: ${creates.length} create and ${updates.length} update.`,
    );
  }

  console.log(
    `${applyChanges ? "APPLY" : "DRY RUN"}: ${creates.length} create, ${updates.length} guarded update, ${unchanged.length} unchanged.`,
  );
  for (const document of creates) {
    console.log(`  CREATE ${document._id}`);
  }
  for (const { desired: document } of updates) {
    console.log(`  UPDATE ${document._id}`);
  }

  if (!applyChanges) {
    console.log(
      "\nNo production data changed. After reviewing this plan, run npm run sanity:backfill:2026:apply -- --confirm-production.",
    );
    return;
  }

  let transaction = client.transaction();

  for (const train of buildCurrentReleaseTrains()) {
    transaction = transaction.createIfNotExists({
      _id: makeId(
        "train",
        train.platformSlug,
        train.majorVersion,
      ),
      _type: "releaseTrain",
      platform: {
        _type: "reference",
        _ref: makeId("platform", train.platformSlug),
      },
      majorVersion: train.majorVersion,
      displayName: train.displayName,
      releaseYear: train.releaseYear,
    });
  }

  for (const document of creates) {
    transaction = transaction.create(document);
  }

  for (const { desired: document, existing: current } of updates) {
    transaction = transaction.patch(document._id, (patch) =>
      patch.ifRevisionId(current._rev).set({
        releaseTrain: document.releaseTrain,
        version: document.version,
        publicReleaseDate: document.publicReleaseDate,
        milestones: document.milestones,
      }),
    );
  }

  const result = await transaction.commit({
    visibility: "sync",
    tag: "version-record.backfill-2026-releases",
  });
  console.log(`\nCommitted transaction ${result.transactionId}.`);

  const verified = await fetchReleaseDocuments(client, releaseIds);
  const verifiedById = new Map(
    verified.map((document) => [document._id, document]),
  );
  const verificationFailures = desired.filter((document) => {
    const current = verifiedById.get(document._id);
    return !current || !documentsMatch(document, current);
  });

  if (verificationFailures.length) {
    throw new Error(
      `Post-commit verification failed for: ${verificationFailures
        .map((document) => document._id)
        .join(", ")}`,
    );
  }

  console.log(`Verified ${desired.length} current release records.`);
}

run().catch((error) => {
  console.error("2026 release backfill failed:", error);
  process.exit(1);
});
