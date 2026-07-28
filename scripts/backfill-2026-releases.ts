/**
 * Reconciles the launch-critical 2026 release cycles with Apple's official
 * Developer Releases archive.
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
const appleReleasesUrl = "https://developer.apple.com/news/releases/";

const platformDefinitions = [
  { slug: "ios", name: "iOS", archiveSuffix: "a" },
  { slug: "ipados", name: "iPadOS", archiveSuffix: "b" },
  { slug: "macos", name: "macOS", archiveSuffix: "c" },
  { slug: "tvos", name: "tvOS", archiveSuffix: "d" },
  { slug: "visionos", name: "visionOS", archiveSuffix: "e" },
  { slug: "watchos", name: "watchOS", archiveSuffix: "f" },
] as const;

type PlatformSlug = (typeof platformDefinitions)[number]["slug"];
type PlatformValues = Partial<Record<PlatformSlug, string>>;

interface MilestoneDefinition {
  label: string;
  dates: string | PlatformValues;
  directArchiveIds?: boolean;
  sourceIds?: PlatformValues;
  sourceUrl?: string;
}

interface CycleDefinition {
  version: "26.4" | "26.5" | "26.6" | "27.0";
  majorVersion: 26 | 27;
  milestones: MilestoneDefinition[];
}

interface SanityMilestone {
  _key: string;
  _type: "betaMilestone";
  label: string;
  date: string;
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

const cycles: CycleDefinition[] = [
  {
    version: "26.4",
    majorVersion: 26,
    milestones: [
      {
        label: "Beta 1",
        dates: "2026-02-16",
        sourceUrl: "https://developer.apple.com/news/?id=xgkk9w83",
      },
      {
        label: "Beta 2",
        dates: "2026-02-23",
        directArchiveIds: true,
      },
      {
        label: "Beta 3",
        dates: {
          ios: "2026-03-02",
          ipados: "2026-03-02",
          macos: "2026-03-03",
          tvos: "2026-03-02",
          visionos: "2026-03-02",
          watchos: "2026-03-02",
        },
        directArchiveIds: true,
        sourceIds: { macos: "03032026a" },
      },
      {
        label: "Beta 3 v2",
        dates: {
          ios: "2026-03-05",
          ipados: "2026-03-05",
          watchos: "2026-03-05",
        },
        sourceIds: {
          ios: "03052026a",
          ipados: "03052026b",
          watchos: "03052026c",
        },
      },
      {
        label: "Beta 4",
        dates: "2026-03-09",
        directArchiveIds: true,
      },
      {
        label: "RC",
        dates: "2026-03-18",
        directArchiveIds: true,
      },
      {
        label: "Public",
        dates: "2026-03-24",
        directArchiveIds: true,
      },
    ],
  },
  {
    version: "26.5",
    majorVersion: 26,
    milestones: [
      {
        label: "Beta 1",
        dates: "2026-03-30",
        sourceUrl: "https://developer.apple.com/news/?id=z8vzrgzx",
      },
      {
        label: "Beta 1 v2",
        dates: {
          ios: "2026-04-03",
          ipados: "2026-04-03",
        },
        sourceIds: {
          ios: "04032026a",
          ipados: "04032026b",
        },
      },
      {
        label: "Beta 2",
        dates: "2026-04-13",
        directArchiveIds: true,
      },
      {
        label: "Beta 3",
        dates: "2026-04-20",
        directArchiveIds: true,
      },
      {
        label: "Beta 4",
        dates: "2026-04-27",
        directArchiveIds: true,
      },
      {
        label: "RC",
        dates: "2026-05-04",
        directArchiveIds: true,
      },
      {
        label: "RC 2",
        dates: {
          ios: "2026-05-08",
          ipados: "2026-05-08",
        },
        sourceIds: {
          ios: "05082026a",
          ipados: "05082026b",
        },
      },
      {
        label: "Public",
        dates: "2026-05-11",
        directArchiveIds: true,
      },
    ],
  },
  {
    version: "26.6",
    majorVersion: 26,
    milestones: [
      {
        label: "Beta 1",
        dates: "2026-05-26",
        sourceUrl: "https://developer.apple.com/news/?id=tu7pk9oy",
      },
      {
        label: "Beta 2",
        dates: "2026-06-15",
      },
      {
        label: "Beta 3",
        dates: "2026-06-29",
      },
      {
        label: "Beta 4",
        dates: "2026-07-06",
      },
      {
        label: "Beta 5",
        dates: "2026-07-13",
        sourceIds: {
          ios: "07132026c",
          ipados: "07132026d",
          macos: "07132026e",
          tvos: "07132026f",
          visionos: "07132026g",
          watchos: "07132026h",
        },
      },
      {
        label: "RC",
        dates: "2026-07-20",
        directArchiveIds: true,
      },
      {
        label: "Public",
        dates: "2026-07-27",
        directArchiveIds: true,
      },
    ],
  },
  {
    version: "27.0",
    majorVersion: 27,
    milestones: [
      {
        label: "Beta 1",
        dates: "2026-06-08",
        sourceIds: {
          ios: "06082026b",
          ipados: "06082026c",
          macos: "06082026d",
          tvos: "06082026e",
          visionos: "06082026f",
          watchos: "06082026g",
        },
      },
      {
        label: "Beta 2",
        dates: {
          ios: "2026-06-22",
          ipados: "2026-06-22",
          macos: "2026-06-22",
          tvos: "2026-06-22",
          visionos: "2026-06-22",
          watchos: "2026-06-23",
        },
      },
      { label: "Beta 3", dates: "2026-07-06" },
      {
        label: "Beta 3 v2",
        dates: {
          ipados: "2026-07-13",
          macos: "2026-07-13",
        },
        sourceIds: {
          ipados: "07132026a",
          macos: "07132026b",
        },
      },
      {
        label: "Beta 4",
        dates: "2026-07-20",
        sourceIds: {
          ios: "07202026g",
          ipados: "07202026h",
          macos: "07202026i",
          tvos: "07202026j",
          visionos: "07202026k",
          watchos: "07202026l",
        },
      },
    ],
  },
];

function makeId(type: string, ...parts: Array<string | number>): string {
  return `${type}-${parts
    .map((part) =>
      String(part).toLowerCase().replace(/[^a-z0-9]/g, "-"),
    )
    .join("-")}`;
}

function valueForPlatform(
  value: string | PlatformValues | undefined,
  platform: PlatformSlug,
): string | undefined {
  return typeof value === "string" ? value : value?.[platform];
}

function archiveId(date: string, suffix: string): string {
  const [year, month, day] = date.split("-");
  return `${month}${day}${year}${suffix}`;
}

function milestoneSource(
  milestone: MilestoneDefinition,
  platform: (typeof platformDefinitions)[number],
  date: string,
): string {
  const explicitSourceId = milestone.sourceIds?.[platform.slug];
  if (explicitSourceId) {
    return `${appleReleasesUrl}?id=${explicitSourceId}`;
  }

  if (milestone.sourceUrl) {
    return milestone.sourceUrl;
  }

  if (milestone.directArchiveIds) {
    return `${appleReleasesUrl}?id=${archiveId(
      date,
      platform.archiveSuffix,
    )}`;
  }

  return appleReleasesUrl;
}

function desiredDocuments(): DesiredReleaseDocument[] {
  return cycles.flatMap((cycle) =>
    platformDefinitions.map((platform) => {
      const milestones = cycle.milestones.flatMap<SanityMilestone>(
        (milestone, index) => {
          const date = valueForPlatform(milestone.dates, platform.slug);
          if (!date) return [];

          return [
            {
              _key: `m${index}`,
              _type: "betaMilestone",
              label: milestone.label,
              date,
              sourceUrl: milestoneSource(milestone, platform, date),
              sourceLabel: "Apple Developer",
              isRevision: /\bv\d+\b/i.test(milestone.label),
            },
          ];
        },
      );
      const publicReleaseDate = milestones.find(
        (milestone) => milestone.label === "Public",
      )?.date;

      return {
        _id: makeId("version", platform.slug, cycle.version),
        _type: "releaseVersion",
        releaseTrain: {
          _type: "reference",
          _ref: makeId("train", platform.slug, cycle.majorVersion),
        },
        version: cycle.version,
        ...(publicReleaseDate ? { publicReleaseDate } : {}),
        milestones,
      };
    }),
  );
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
  const requiredTrainIds = platformDefinitions.map((platform) =>
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

  for (const platform of platformDefinitions) {
    transaction = transaction.createIfNotExists({
      _id: makeId("train", platform.slug, 27),
      _type: "releaseTrain",
      platform: {
        _type: "reference",
        _ref: makeId("platform", platform.slug),
      },
      majorVersion: 27,
      displayName: `${platform.name} 27`,
      releaseYear: 2026,
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
    tag: "beta-cadence.backfill-2026-releases",
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
