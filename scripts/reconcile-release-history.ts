/**
 * Reconciles the independently verified iOS/iPadOS chronology with Sanity.
 *
 * The command is read-only unless all three apply gates are present:
 *   --apply --confirm-production --plan-sha <dry-run SHA>
 *
 * Dry run:
 *   npm run sanity:history:check
 *
 * Apply the exact reviewed plan:
 *   npm run sanity:history:apply -- --confirm-production --plan-sha <SHA>
 */

import { createHash } from "node:crypto";
import * as fs from "node:fs";
import * as path from "node:path";
import { getCliClient } from "sanity/cli";
import { parseAppleNote } from "./lib/apple-note-parser";
import {
  assertValidReleaseData,
  type ReleaseData,
  type ReleaseDataMilestone,
  type ReleaseDataVersion,
} from "./lib/release-data-validation";

const apiVersion = "2024-01-01";
const expectedProjectId = "lh3yswzu";
const expectedDataset = "production";
const expectedTargetCount = 123;
const maximumCreateCount = 5;
const maximumUpdateCount = 100;
const maximumMilestoneAdditionCount = 320;
const maximumMilestoneTransformCount = 30;
const maximumMilestoneRemovalCount = 20;
const maximumMilestoneMetadataUpdateCount = 40;
const maximumTotalMilestoneChangeCount = 380;
const migrationArtifactFormatVersion = 1;
const repositoryRoot = path.join(__dirname, "..");
const migrationArtifactDirectory = path.join(
  repositoryRoot,
  ".migration-artifacts",
);
const applyChanges = process.argv.includes("--apply");
const productionAcknowledged = process.argv.includes(
  "--confirm-production",
);
const planShaIndex = process.argv.indexOf("--plan-sha");
const acknowledgedPlanSha =
  planShaIndex >= 0 ? process.argv[planShaIndex + 1] : undefined;

type UnknownFields = Record<string, unknown>;

interface SanityMilestone extends UnknownFields {
  _key: string;
  _type: "betaMilestone";
  label: string;
  date: string;
  note?: string;
  build?: string;
  channel?: string;
  deviceScope?: string;
  sourceUrl?: string;
  sourceLabel?: string;
  isRevision: boolean;
}

interface ExistingReleaseDocument extends UnknownFields {
  _id: string;
  _rev: string;
  _type: "releaseVersion";
  version: string;
  releaseStatus?: "active" | "released" | "superseded";
  publicReleaseDate?: string;
  releaseNotesUrl?: string;
  versionNote?: string;
  releaseTrainRef: string;
  platform: string;
  milestones: SanityMilestone[];
}

interface DesiredReleaseDocument {
  _id: string;
  releaseTrainRef: string;
  version: ReleaseDataVersion;
}

interface ReconciledRelease {
  desired: DesiredReleaseDocument;
  existing: ExistingReleaseDocument;
  nextMilestones: SanityMilestone[];
  nextReleaseStatus?: "active" | "released" | "superseded";
  fieldsChanged: string[];
  removals: SanityMilestone[];
  additions: SanityMilestone[];
  transforms: Array<{
    before: SanityMilestone;
    after: SanityMilestone;
  }>;
  metadataUpdates: Array<{
    before: SanityMilestone;
    after: SanityMilestone;
  }>;
}

interface MilestoneMatch {
  index: number;
  kind: "exact" | "verified-transform";
}

interface SanityReference {
  _type: "reference";
  _ref: string;
}

interface CreateReleaseDocument extends UnknownFields {
  _id: string;
  _type: "releaseVersion";
  releaseTrain: SanityReference;
  version: string;
  releaseStatus?: "active" | "released" | "superseded";
  publicReleaseDate?: string;
  releaseNotesUrl?: string;
  versionNote?: string;
  milestones: SanityMilestone[];
}

interface ExactPatchMutation {
  id: string;
  ifRevisionId: string;
  set: UnknownFields;
  unset: string[];
}

interface ExactMutationPayload {
  formatVersion: number;
  projectId: string;
  dataset: string;
  creates: CreateReleaseDocument[];
  patches: ExactPatchMutation[];
}

interface RawReleaseDocument extends UnknownFields {
  _id: string;
  _rev: string;
  _type: string;
}

interface RelevantDraft {
  _id: string;
  platform?: string;
  version?: string;
}

interface MigrationSummary {
  creates: number;
  patches: number;
  unchanged: number;
  createdMilestones: number;
  addedMilestonesToExisting: number;
  totalMilestoneAdditions: number;
  milestoneTransforms: number;
  milestoneMetadataUpdates: number;
  milestoneRemovals: number;
  patchSetFields: number;
  patchUnsetFields: number;
}

const explicitRemovals = new Set(
  [
    ["iPadOS", "26.0", "Beta 1 v2", "2025-06-13"],
    ["iOS", "16.1", "Beta 1", "2022-08-23"],
    ["iPadOS", "16.0", "Beta 7", "2022-08-23"],
    ["iPadOS", "16.0", "Beta 8", "2022-08-29"],
    ["iPadOS", "16.0", "RC", "2022-09-07"],
    ["iPadOS", "16.0", "Public", "2022-09-19"],
    ["iPadOS", "17.1", "RC 2", "2023-10-20"],
    ["iPadOS", "15.2", "RC 2", "2021-12-10"],
    ["iOS", "15.1", "RC 2", "2021-10-21"],
    ["iPadOS", "13.0", "GM", "2019-09-10"],
    ["iPadOS", "13.0", "Public", "2019-09-19"],
    ["iOS", "13.5", "Beta 5", "2020-05-14"],
    ["iPadOS", "13.5", "Beta 5", "2020-05-14"],
    ["iOS", "12.1.1", "Beta 4", "2018-11-29"],
  ].map(([platform, version, label, date]) =>
    [platform, version, normalized(label), date].join("|"),
  ),
);

interface MilestoneTransformDefinition {
  platform: "iOS" | "iPadOS";
  version: string;
  fromLabel: string;
  fromDate: string;
  toLabel: string;
  toDate: string;
}

const explicitTransforms: MilestoneTransformDefinition[] = [
  {
    platform: "iOS",
    version: "17.4",
    fromLabel: "Public",
    fromDate: "2024-03-07",
    toLabel: "Public",
    toDate: "2024-03-05",
  },
  {
    platform: "iOS",
    version: "13.0",
    fromLabel: "Beta 2",
    fromDate: "2019-06-18",
    toLabel: "Beta 2",
    toDate: "2019-06-17",
  },
  {
    platform: "iOS",
    version: "13.0",
    fromLabel: "Beta 3",
    fromDate: "2019-07-03",
    toLabel: "Beta 3",
    toDate: "2019-07-02",
  },
  {
    platform: "iOS",
    version: "12.0",
    fromLabel: "Beta 10",
    fromDate: "2018-08-27",
    toLabel: "Beta 10",
    toDate: "2018-08-23",
  },
  {
    platform: "iOS",
    version: "12.0",
    fromLabel: "Beta 11",
    fromDate: "2018-08-31",
    toLabel: "Beta 11",
    toDate: "2018-08-27",
  },
  {
    platform: "iOS",
    version: "12.0",
    fromLabel: "Beta 12",
    fromDate: "2018-09-04",
    toLabel: "Beta 12",
    toDate: "2018-08-31",
  },
  {
    platform: "iPadOS",
    version: "18.6",
    fromLabel: "Beta 3",
    fromDate: "2025-07-15",
    toLabel: "Beta 3",
    toDate: "2025-07-14",
  },
  {
    platform: "iPadOS",
    version: "17.1",
    fromLabel: "Beta 1",
    fromDate: "2023-09-28",
    toLabel: "Beta 1",
    toDate: "2023-09-27",
  },
  {
    platform: "iPadOS",
    version: "16.3",
    fromLabel: "Beta 2",
    fromDate: "2023-01-11",
    toLabel: "Beta 2",
    toDate: "2023-01-10",
  },
  {
    platform: "iPadOS",
    version: "16.1",
    fromLabel: "Beta 1",
    fromDate: "2022-09-14",
    toLabel: "Beta 2",
    toDate: "2022-09-14",
  },
  {
    platform: "iPadOS",
    version: "16.1",
    fromLabel: "Beta 2",
    fromDate: "2022-09-20",
    toLabel: "Beta 3",
    toDate: "2022-09-20",
  },
  {
    platform: "iPadOS",
    version: "16.1",
    fromLabel: "Beta 3",
    fromDate: "2022-09-27",
    toLabel: "Beta 4",
    toDate: "2022-09-27",
  },
  {
    platform: "iPadOS",
    version: "16.1",
    fromLabel: "Beta 4",
    fromDate: "2022-10-04",
    toLabel: "Beta 5",
    toDate: "2022-10-04",
  },
  {
    platform: "iPadOS",
    version: "16.1",
    fromLabel: "Beta 5",
    fromDate: "2022-10-11",
    toLabel: "Beta 6",
    toDate: "2022-10-11",
  },
  {
    platform: "iPadOS",
    version: "15.0",
    fromLabel: "Beta 1",
    fromDate: "2021-06-08",
    toLabel: "Beta 1",
    toDate: "2021-06-07",
  },
  {
    platform: "iPadOS",
    version: "14.5",
    fromLabel: "Beta 3",
    fromDate: "2021-03-03",
    toLabel: "Beta 3",
    toDate: "2021-03-02",
  },
  {
    platform: "iPadOS",
    version: "13.7",
    fromLabel: "GM",
    fromDate: "2020-08-26",
    toLabel: "Beta 1",
    toDate: "2020-08-26",
  },
  {
    platform: "iPadOS",
    version: "13.6",
    fromLabel: "Beta 1",
    fromDate: "2020-06-01",
    toLabel: "13.5.5 Beta 1",
    toDate: "2020-06-01",
  },
  {
    platform: "iPadOS",
    version: "13.5",
    fromLabel: "Beta 1",
    fromDate: "2020-03-31",
    toLabel: "13.4.5 Beta 1",
    toDate: "2020-03-31",
  },
  {
    platform: "iPadOS",
    version: "13.5",
    fromLabel: "Beta 2",
    fromDate: "2020-04-15",
    toLabel: "13.4.5 Beta 2",
    toDate: "2020-04-15",
  },
  {
    platform: "iPadOS",
    version: "13.4",
    fromLabel: "Beta 4",
    fromDate: "2020-03-04",
    toLabel: "Beta 4",
    toDate: "2020-03-03",
  },
  {
    platform: "iPadOS",
    version: "13.4",
    fromLabel: "Beta 6",
    fromDate: "2020-03-18",
    toLabel: "GM",
    toDate: "2020-03-18",
  },
];

function normalized(value: string | undefined): string {
  return (value || "").trim().toLowerCase().replace(/\s+/g, " ");
}

function canonicalize(value: unknown): unknown {
  if (Array.isArray(value)) {
    return value.map((entry) => canonicalize(entry));
  }
  if (value && typeof value === "object") {
    const entries = Object.entries(value as UnknownFields)
      .filter(([, entry]) => entry !== undefined)
      .sort(([left], [right]) => left.localeCompare(right))
      .map(([key, entry]) => [key, canonicalize(entry)]);
    return Object.fromEntries(entries);
  }
  return value;
}

function canonicalStringify(value: unknown, spacing?: number): string {
  return JSON.stringify(canonicalize(value), null, spacing);
}

function exactEqual(left: unknown, right: unknown): boolean {
  return canonicalStringify(left) === canonicalStringify(right);
}

function sha256(value: unknown): string {
  return createHash("sha256")
    .update(
      typeof value === "string"
        ? value
        : canonicalStringify(value),
    )
    .digest("hex");
}

function jsonClone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

function withoutMutableSystemFields(
  document: UnknownFields,
  includeCreatedAt = true,
): UnknownFields {
  const comparable = jsonClone(document);
  delete comparable._rev;
  delete comparable._updatedAt;
  if (!includeCreatedAt) delete comparable._createdAt;
  return comparable;
}

function writeJsonArtifact(
  fileName: string,
  value: unknown,
): string {
  fs.mkdirSync(migrationArtifactDirectory, {
    recursive: true,
    mode: 0o700,
  });
  const artifactPath = path.join(
    migrationArtifactDirectory,
    fileName,
  );
  const temporaryPath = `${artifactPath}.${process.pid}.tmp`;
  fs.writeFileSync(
    temporaryPath,
    `${canonicalStringify(value, 2)}\n`,
    { mode: 0o600 },
  );
  fs.renameSync(temporaryPath, artifactPath);
  return artifactPath;
}

function makeId(type: string, ...parts: Array<string | number>): string {
  return `${type}-${parts
    .map((part) =>
      String(part).toLowerCase().replace(/[^a-z0-9]/g, "-"),
    )
    .join("-")}`;
}

function versionKey(platform: string, version: string): string {
  return `${platform}|${version}`;
}

function removalKey(
  platform: string,
  version: string,
  milestone: Pick<SanityMilestone, "label" | "date">,
): string {
  return [
    platform,
    version,
    normalized(milestone.label),
    milestone.date,
  ].join("|");
}

function deterministicMilestoneKey(
  platform: string,
  version: string,
  milestone: ReleaseDataMilestone,
): string {
  const digest = createHash("sha1")
    .update(
      canonicalStringify({
        platform,
        version,
        label: milestone.label,
        date: milestone.date,
        note: milestone.note,
        build: milestone.build,
        channel: milestone.channel,
        deviceScope: milestone.deviceScope,
      }),
    )
    .digest("hex")
    .slice(0, 12);
  return `m-${digest}`;
}

function desiredMilestone(
  platform: string,
  version: string,
  milestone: ReleaseDataMilestone,
  existing?: SanityMilestone,
): SanityMilestone {
  const preserved: UnknownFields = { ...(existing || {}) };

  return {
    ...preserved,
    _key:
      existing?._key ||
      deterministicMilestoneKey(platform, version, milestone),
    _type: "betaMilestone",
    label: milestone.label,
    date: milestone.date,
    ...(milestone.note ? { note: milestone.note } : {}),
    ...(milestone.build ? { build: milestone.build } : {}),
    ...(milestone.channel ? { channel: milestone.channel } : {}),
    ...(milestone.deviceScope
      ? { deviceScope: milestone.deviceScope }
      : {}),
    ...(milestone.sourceUrl
      ? { sourceUrl: milestone.sourceUrl }
      : {}),
    ...(milestone.sourceLabel
      ? { sourceLabel: milestone.sourceLabel }
      : {}),
    isRevision: milestone.isRevision,
  };
}

function findExistingMatch(
  platform: string,
  version: string,
  desired: ReleaseDataMilestone,
  existing: SanityMilestone[],
  consumed: Set<number>,
): MilestoneMatch | undefined {
  const exact = existing.findIndex(
    (milestone, index) =>
      !consumed.has(index) &&
      normalized(milestone.label) === normalized(desired.label) &&
      milestone.date === desired.date,
  );
  if (exact >= 0) return { index: exact, kind: "exact" };

  const transform = explicitTransforms.find(
    (definition) =>
      definition.platform === platform &&
      definition.version === version &&
      normalized(definition.toLabel) === normalized(desired.label) &&
      definition.toDate === desired.date,
  );
  if (!transform) return undefined;

  const transformedIndex = existing.findIndex(
    (milestone, index) =>
      !consumed.has(index) &&
      normalized(milestone.label) ===
        normalized(transform.fromLabel) &&
      milestone.date === transform.fromDate,
  );
  return transformedIndex >= 0
    ? { index: transformedIndex, kind: "verified-transform" }
    : undefined;
}

function reconcileMilestones(
  desired: ReleaseDataVersion,
  existing: ExistingReleaseDocument,
): {
  milestones: SanityMilestone[];
  removals: SanityMilestone[];
  additions: SanityMilestone[];
  transforms: Array<{
    before: SanityMilestone;
    after: SanityMilestone;
  }>;
  metadataUpdates: Array<{
    before: SanityMilestone;
    after: SanityMilestone;
  }>;
} {
  const consumed = new Set<number>();
  const additions: SanityMilestone[] = [];
  const transforms: Array<{
    before: SanityMilestone;
    after: SanityMilestone;
  }> = [];
  const metadataUpdates: Array<{
    before: SanityMilestone;
    after: SanityMilestone;
  }> = [];
  const desiredEntries = desired.milestones.map((milestone, index) => {
    const match = findExistingMatch(
      desired.platform,
      desired.version,
      milestone,
      existing.milestones,
      consumed,
    );
    const existingIndex = match?.index;
    if (existingIndex !== undefined) consumed.add(existingIndex);

    const nextMilestone = desiredMilestone(
      desired.platform,
      desired.version,
      milestone,
      existingIndex === undefined
        ? undefined
        : existing.milestones[existingIndex],
    );
    if (existingIndex === undefined) additions.push(nextMilestone);
    if (match && match.kind !== "exact") {
      transforms.push({
        before: existing.milestones[match.index],
        after: nextMilestone,
      });
    } else if (
      match &&
      !exactEqual(
        existing.milestones[match.index],
        nextMilestone,
      )
    ) {
      metadataUpdates.push({
        before: existing.milestones[match.index],
        after: nextMilestone,
      });
    }

    return {
      milestone: nextMilestone,
      order: index,
    };
  });

  const removals: SanityMilestone[] = [];
  const supplemental = existing.milestones.flatMap(
    (milestone, index) => {
      if (consumed.has(index)) return [];
      if (
        explicitRemovals.has(
          removalKey(desired.platform, desired.version, milestone),
        )
      ) {
        removals.push(milestone);
        return [];
      }
      throw new Error(
        `${desired.platform} ${desired.version} has an unmatched production milestone ${milestone.label} on ${milestone.date}. Add an explicit verified removal or transform; supplemental events are never preserved implicitly.`,
      );
    },
  );

  return {
    milestones: [...desiredEntries, ...supplemental]
      .sort(
        (left, right) =>
          left.milestone.date.localeCompare(right.milestone.date) ||
          left.order - right.order,
      )
      .map(({ milestone }) => milestone),
    removals,
    additions,
    transforms,
    metadataUpdates,
  };
}

function statusToWrite(
  desired: ReleaseDataVersion,
  existing: ExistingReleaseDocument,
) {
  if (
    desired.releaseStatus === "superseded" ||
    existing.releaseStatus
  ) {
    return desired.releaseStatus;
  }
  return undefined;
}

function reconcileDocument(
  desired: DesiredReleaseDocument,
  existing: ExistingReleaseDocument,
): ReconciledRelease {
  if (
    existing.version !== desired.version.version ||
    existing.releaseTrainRef !== desired.releaseTrainRef ||
    existing.platform !== desired.version.platform
  ) {
    throw new Error(
      `${existing._id} has an unexpected version, train, or platform reference.`,
    );
  }

  const reconciledMilestones = reconcileMilestones(
    desired.version,
    existing,
  );
  const nextReleaseStatus = statusToWrite(desired.version, existing);
  const fieldsChanged: string[] = [];

  if (
    !exactEqual(
      existing.milestones,
      reconciledMilestones.milestones,
    )
  ) {
    fieldsChanged.push("milestones");
  }
  if (
    (existing.publicReleaseDate || undefined) !==
    (desired.version.publicReleaseDate || undefined)
  ) {
    fieldsChanged.push("publicReleaseDate");
  }
  if (
    nextReleaseStatus !== undefined &&
    existing.releaseStatus !== nextReleaseStatus
  ) {
    fieldsChanged.push("releaseStatus");
  }
  if (
    desired.version.versionNote &&
    existing.versionNote !== desired.version.versionNote
  ) {
    fieldsChanged.push("versionNote");
  }
  if (
    desired.version.releaseNotesUrl &&
    !existing.releaseNotesUrl
  ) {
    fieldsChanged.push("releaseNotesUrl");
  }

  return {
    desired,
    existing,
    nextMilestones: reconciledMilestones.milestones,
    nextReleaseStatus,
    fieldsChanged,
    removals: reconciledMilestones.removals,
    additions: reconciledMilestones.additions,
    transforms: reconciledMilestones.transforms,
    metadataUpdates: reconciledMilestones.metadataUpdates,
  };
}

function seedAuditMismatch(
  seeded: ReleaseDataVersion,
  audited: ReleaseDataVersion,
): string | undefined {
  const scalarFields = [
    "platform",
    "majorVersion",
    "version",
    "releaseStatus",
    "publicReleaseDate",
    "versionNote",
  ] as const;
  for (const field of scalarFields) {
    if (
      (seeded[field] || undefined) !==
      (audited[field] || undefined)
    ) {
      return `${field} differs`;
    }
  }
  if (
    audited.releaseNotesUrl &&
    seeded.releaseNotesUrl !== audited.releaseNotesUrl
  ) {
    return "releaseNotesUrl differs";
  }
  if (seeded.milestones.length !== audited.milestones.length) {
    return `milestone count differs (${seeded.milestones.length} vs ${audited.milestones.length})`;
  }
  for (let index = 0; index < audited.milestones.length; index += 1) {
    const desired = audited.milestones[index];
    const current = seeded.milestones[index];
    if (
      current.label !== desired.label ||
      current.date !== desired.date ||
      current.isRevision !== desired.isRevision
    ) {
      return `milestone ${index + 1} identity differs`;
    }
    if (
      desired.note !== undefined &&
      current.note !== desired.note
    ) {
      return `milestone ${index + 1} note differs`;
    }
  }
  return undefined;
}

function loadDesired(): DesiredReleaseDocument[] {
  const seedPath = path.join(__dirname, "seed-data.json");
  const notePath = path.join(__dirname, "..", "original-apple-note");
  const seed = JSON.parse(
    fs.readFileSync(seedPath, "utf8"),
  ) as ReleaseData;
  assertValidReleaseData(seed);

  const parsed = parseAppleNote(fs.readFileSync(notePath, "utf8"));
  const unclassified = parsed.diagnostics.filter(
    (diagnostic) => diagnostic.reason === "unclassified-line",
  );
  if (unclassified.length) {
    throw new Error(
      `original-apple-note has ${unclassified.length} unclassified line(s); reconcile only after the parser classifies every line.`,
    );
  }
  const auditedVersions = parsed.versions.filter((version) =>
    ["iOS", "iPadOS"].includes(version.platform),
  );
  const auditedKeys = auditedVersions.map((version) =>
    versionKey(version.platform, version.version),
  );
  if (new Set(auditedKeys).size !== auditedKeys.length) {
    throw new Error(
      "original-apple-note contains duplicate audited platform/version records.",
    );
  }
  if (auditedVersions.length !== expectedTargetCount) {
    throw new Error(
      `Expected ${expectedTargetCount} audited source versions, found ${auditedVersions.length}.`,
    );
  }
  const targetKeys = new Set(
    auditedKeys,
  );
  const versions = seed.releaseVersions.filter((version) =>
    targetKeys.has(versionKey(version.platform, version.version)),
  );

  if (versions.length !== expectedTargetCount) {
    throw new Error(
      `Expected ${expectedTargetCount} audited versions, found ${versions.length}.`,
    );
  }

  const seedByKey = new Map(
    versions.map((version) => [
      versionKey(version.platform, version.version),
      version,
    ]),
  );
  for (const audited of auditedVersions) {
    const key = versionKey(audited.platform, audited.version);
    const seeded = seedByKey.get(key);
    const mismatch = seeded
      ? seedAuditMismatch(seeded, audited)
      : "version is missing";
    if (mismatch) {
      throw new Error(
        `${key} differs between original-apple-note and seed-data.json (${mismatch}). Run and review npm run data:build before reconciling Sanity.`,
      );
    }
  }

  return versions.map((version) => ({
    _id: makeId("version", version.platform, version.version),
    releaseTrainRef: makeId(
      "train",
      version.platform,
      version.majorVersion,
    ),
    version,
  }));
}

function createReleaseDocument(
  document: DesiredReleaseDocument,
): CreateReleaseDocument {
  return canonicalize({
    _id: document._id,
    _type: "releaseVersion",
    releaseTrain: {
      _type: "reference",
      _ref: document.releaseTrainRef,
    },
    version: document.version.version,
    ...(document.version.releaseStatus
      ? { releaseStatus: document.version.releaseStatus }
      : {}),
    ...(document.version.publicReleaseDate
      ? { publicReleaseDate: document.version.publicReleaseDate }
      : {}),
    ...(document.version.versionNote
      ? { versionNote: document.version.versionNote }
      : {}),
    ...(document.version.releaseNotesUrl
      ? { releaseNotesUrl: document.version.releaseNotesUrl }
      : {}),
    milestones: document.version.milestones.map((milestone) =>
      desiredMilestone(
        document.version.platform,
        document.version.version,
        milestone,
      ),
    ),
  }) as CreateReleaseDocument;
}

function buildPatchMutation(
  update: ReconciledRelease,
): ExactPatchMutation {
  const set: UnknownFields = {};
  const unset: string[] = [];

  if (update.fieldsChanged.includes("milestones")) {
    set.milestones = update.nextMilestones;
  }
  if (update.fieldsChanged.includes("publicReleaseDate")) {
    if (update.desired.version.publicReleaseDate) {
      set.publicReleaseDate =
        update.desired.version.publicReleaseDate;
    } else {
      unset.push("publicReleaseDate");
    }
  }
  if (
    update.fieldsChanged.includes("releaseStatus") &&
    update.nextReleaseStatus
  ) {
    set.releaseStatus = update.nextReleaseStatus;
  }
  if (
    update.fieldsChanged.includes("versionNote") &&
    update.desired.version.versionNote
  ) {
    set.versionNote = update.desired.version.versionNote;
  }
  if (
    update.fieldsChanged.includes("releaseNotesUrl") &&
    update.desired.version.releaseNotesUrl
  ) {
    set.releaseNotesUrl =
      update.desired.version.releaseNotesUrl;
  }

  const plannedFields = [
    ...Object.keys(set),
    ...unset,
  ].sort();
  const expectedFields = [...update.fieldsChanged].sort();
  if (!exactEqual(plannedFields, expectedFields)) {
    throw new Error(
      `${update.existing._id} patch fields do not match its reconciliation diff.`,
    );
  }

  return canonicalize({
    id: update.existing._id,
    ifRevisionId: update.existing._rev,
    set,
    unset: unset.sort(),
  }) as ExactPatchMutation;
}

function buildExactMutationPayload(
  creates: DesiredReleaseDocument[],
  updates: ReconciledRelease[],
): ExactMutationPayload {
  return canonicalize({
    formatVersion: migrationArtifactFormatVersion,
    projectId: expectedProjectId,
    dataset: expectedDataset,
    creates: creates
      .map((document) => createReleaseDocument(document))
      .sort((left, right) => left._id.localeCompare(right._id)),
    patches: updates
      .map((update) => buildPatchMutation(update))
      .sort((left, right) => left.id.localeCompare(right.id)),
  }) as ExactMutationPayload;
}

function migrationSummary(
  desiredCount: number,
  payload: ExactMutationPayload,
  updates: ReconciledRelease[],
): MigrationSummary {
  const createdMilestones = payload.creates.reduce(
    (sum, document) => sum + document.milestones.length,
    0,
  );
  const addedMilestonesToExisting = updates.reduce(
    (sum, update) => sum + update.additions.length,
    0,
  );
  return {
    creates: payload.creates.length,
    patches: payload.patches.length,
    unchanged:
      desiredCount -
      payload.creates.length -
      payload.patches.length,
    createdMilestones,
    addedMilestonesToExisting,
    totalMilestoneAdditions:
      createdMilestones + addedMilestonesToExisting,
    milestoneTransforms: updates.reduce(
      (sum, update) => sum + update.transforms.length,
      0,
    ),
    milestoneMetadataUpdates: updates.reduce(
      (sum, update) =>
        sum + update.metadataUpdates.length,
      0,
    ),
    milestoneRemovals: updates.reduce(
      (sum, update) => sum + update.removals.length,
      0,
    ),
    patchSetFields: payload.patches.reduce(
      (sum, patch) => sum + Object.keys(patch.set).length,
      0,
    ),
    patchUnsetFields: payload.patches.reduce(
      (sum, patch) => sum + patch.unset.length,
      0,
    ),
  };
}

function assertMutationCaps(summary: MigrationSummary): void {
  const totalMilestoneChanges =
    summary.totalMilestoneAdditions +
    summary.milestoneTransforms +
    summary.milestoneMetadataUpdates +
    summary.milestoneRemovals;
  const violations = [
    summary.creates > maximumCreateCount
      ? `${summary.creates} creates > ${maximumCreateCount}`
      : undefined,
    summary.patches > maximumUpdateCount
      ? `${summary.patches} patches > ${maximumUpdateCount}`
      : undefined,
    summary.totalMilestoneAdditions >
    maximumMilestoneAdditionCount
      ? `${summary.totalMilestoneAdditions} milestone additions > ${maximumMilestoneAdditionCount}`
      : undefined,
    summary.milestoneTransforms >
    maximumMilestoneTransformCount
      ? `${summary.milestoneTransforms} milestone transforms > ${maximumMilestoneTransformCount}`
      : undefined,
    summary.milestoneMetadataUpdates >
    maximumMilestoneMetadataUpdateCount
      ? `${summary.milestoneMetadataUpdates} milestone metadata updates > ${maximumMilestoneMetadataUpdateCount}`
      : undefined,
    summary.milestoneRemovals >
    maximumMilestoneRemovalCount
      ? `${summary.milestoneRemovals} milestone removals > ${maximumMilestoneRemovalCount}`
      : undefined,
    totalMilestoneChanges >
    maximumTotalMilestoneChangeCount
      ? `${totalMilestoneChanges} total milestone changes > ${maximumTotalMilestoneChangeCount}`
      : undefined,
  ].filter(Boolean);

  if (violations.length) {
    throw new Error(
      `Mutation scope exceeded:\n${violations.join("\n")}`,
    );
  }
}

async function fetchPublishedExisting(
  client: ReturnType<typeof getCliClient>,
): Promise<ExistingReleaseDocument[]> {
  return client.fetch(
    `*[
      _type == "releaseVersion" &&
      releaseTrain->platform->name in ["iOS", "iPadOS"]
    ]{
      ...,
      "releaseTrainRef": releaseTrain._ref,
      "platform": releaseTrain->platform->name,
      milestones[]{...}
    }`,
  );
}

function duplicateEntries(
  documents: ExistingReleaseDocument[],
): Array<[string, string[]]> {
  const grouped = documents.reduce(
    (map, document) => {
      const key = versionKey(document.platform, document.version);
      map.set(key, [...(map.get(key) || []), document._id]);
      return map;
    },
    new Map<string, string[]>(),
  );
  return [...grouped.entries()].filter(([, ids]) => ids.length > 1);
}

async function fetchRelevantDrafts(
  rawClient: ReturnType<typeof getCliClient>,
  desiredByKey: Map<string, DesiredReleaseDocument>,
  relevantPublished: ExistingReleaseDocument[],
): Promise<RelevantDraft[]> {
  const draftsByVersion = await rawClient.fetch<RelevantDraft[]>(
    `*[
      _type == "releaseVersion" &&
      _id in path("drafts.**")
    ]{
      _id,
      version,
      "platform": releaseTrain->platform->name
    }`,
  );
  const exactDraftIds = [
    ...new Set([
      ...[...desiredByKey.values()].map(
        (document) => `drafts.${document._id}`,
      ),
      ...relevantPublished.map(
        (document) => `drafts.${document._id}`,
      ),
    ]),
  ];
  const draftsByExactId = exactDraftIds.length
    ? await rawClient.fetch<RelevantDraft[]>(
        `*[_id in $ids]{
          _id,
          version,
          "platform": releaseTrain->platform->name
        }`,
        { ids: exactDraftIds },
      )
    : [];

  const relevant = [
    ...draftsByVersion.filter(
      (draft) =>
        draft.platform &&
        draft.version &&
        desiredByKey.has(
          versionKey(draft.platform, draft.version),
        ),
    ),
    ...draftsByExactId,
  ];
  return [
    ...new Map(
      relevant.map((draft) => [draft._id, draft]),
    ).values(),
  ].sort((left, right) => left._id.localeCompare(right._id));
}

async function fetchRawDocumentsByIds(
  client: ReturnType<typeof getCliClient>,
  ids: string[],
): Promise<RawReleaseDocument[]> {
  if (!ids.length) return [];
  const documents = await client.fetch<RawReleaseDocument[]>(
    `*[_id in $ids]`,
    { ids },
  );
  return documents.sort((left, right) =>
    left._id.localeCompare(right._id),
  );
}

function expectedAfterPatch(
  before: RawReleaseDocument,
  patch: ExactPatchMutation,
): RawReleaseDocument {
  const expected = jsonClone(before);
  for (const [field, value] of Object.entries(patch.set)) {
    expected[field] = jsonClone(value);
  }
  for (const field of patch.unset) delete expected[field];
  return expected;
}

function scalarAudit(
  before: RawReleaseDocument,
  patch: ExactPatchMutation,
) {
  return [
    ...Object.entries(patch.set)
      .filter(([field]) => field !== "milestones")
      .map(([field, value]) => ({
        field,
        action: "set",
        hadBefore: Object.hasOwn(before, field),
        before: Object.hasOwn(before, field)
          ? before[field]
          : null,
        after: value,
      })),
    ...patch.unset.map((field) => ({
      field,
      action: "unset",
      hadBefore: Object.hasOwn(before, field),
      before: Object.hasOwn(before, field)
        ? before[field]
        : null,
      after: null,
    })),
  ];
}

function buildPlanAudit(
  updates: ReconciledRelease[],
  payload: ExactMutationPayload,
  rawBeforeById: Map<string, RawReleaseDocument>,
) {
  const updateById = new Map(
    updates.map((update) => [update.existing._id, update]),
  );
  return {
    creates: payload.creates.map((document) => ({
      id: document._id,
      milestoneAdditions: document.milestones,
    })),
    patches: payload.patches.map((patch) => {
      const update = updateById.get(patch.id);
      const before = rawBeforeById.get(patch.id);
      if (!update || !before) {
        throw new Error(
          `Cannot build audit detail for ${patch.id}.`,
        );
      }
      return {
        id: patch.id,
        ifRevisionId: patch.ifRevisionId,
        beforeMilestoneCount: update.existing.milestones.length,
        afterMilestoneCount: update.nextMilestones.length,
        additions: update.additions,
        transforms: update.transforms,
        metadataUpdates: update.metadataUpdates,
        removals: update.removals,
        scalarChanges: scalarAudit(before, patch),
      };
    }),
  };
}

function writeMigrationArtifacts({
  planSha,
  summary,
  payload,
  updates,
  rawBefore,
  generatedAt,
}: {
  planSha: string;
  summary: MigrationSummary;
  payload: ExactMutationPayload;
  updates: ReconciledRelease[];
  rawBefore: RawReleaseDocument[];
  generatedAt: string;
}) {
  const rawBeforeById = new Map(
    rawBefore.map((document) => [document._id, document]),
  );
  const beforeSnapshotSha = sha256(rawBefore);
  const planPath = writeJsonArtifact(
    `release-history-plan-${planSha}.json`,
    {
      artifactType: "sanity-release-history-plan",
      formatVersion: migrationArtifactFormatVersion,
      generatedAt,
      planSha,
      beforeSnapshotSha,
      summary,
      exactMutationPayload: payload,
      audit: buildPlanAudit(
        updates,
        payload,
        rawBeforeById,
      ),
    },
  );
  const rollbackManifest = {
    artifactType: "sanity-release-history-rollback-manifest",
    formatVersion: migrationArtifactFormatVersion,
    generatedAt,
    planSha,
    beforeSnapshotSha,
    projectId: expectedProjectId,
    dataset: expectedDataset,
    instructions: [
      "This manifest never performs writes by itself.",
      "Delete only the createdDocumentIds after verifying their post-apply revisions.",
      "Use restoreDocuments as the raw before-state; restore their non-system fields while guarding each current document with the corresponding post-apply revision.",
      "Never submit historical _rev, _createdAt, or _updatedAt values as mutation fields.",
    ],
    createdDocumentIds: payload.creates.map(
      (document) => document._id,
    ),
    restoreDocuments: rawBefore,
    postApply: null as null | {
      transactionId?: string;
      revisions: Record<string, string>;
    },
  };
  const rollbackPath = writeJsonArtifact(
    `release-history-rollback-${planSha}.json`,
    rollbackManifest,
  );
  return {
    planPath,
    rollbackPath,
    beforeSnapshotSha,
    rollbackManifest,
  };
}

function assertRawBeforeMatchesPatches(
  rawBefore: RawReleaseDocument[],
  patches: ExactPatchMutation[],
): void {
  const rawById = new Map(
    rawBefore.map((document) => [document._id, document]),
  );
  if (rawById.size !== patches.length) {
    throw new Error(
      `Raw before-snapshot has ${rawById.size} documents for ${patches.length} patches.`,
    );
  }
  for (const patch of patches) {
    const current = rawById.get(patch.id);
    if (!current) {
      throw new Error(
        `${patch.id} is missing from the raw before-snapshot.`,
      );
    }
    if (current._rev !== patch.ifRevisionId) {
      throw new Error(
        `${patch.id} changed while the plan was being built (${patch.ifRevisionId} -> ${current._rev}). Rerun the dry run.`,
      );
    }
  }
}

function verifyExactPostCommit(
  payload: ExactMutationPayload,
  rawBefore: RawReleaseDocument[],
  postDocuments: RawReleaseDocument[],
): string[] {
  const failures: string[] = [];
  const beforeById = new Map(
    rawBefore.map((document) => [document._id, document]),
  );
  const postById = new Map(
    postDocuments.map((document) => [document._id, document]),
  );

  for (const create of payload.creates) {
    const current = postById.get(create._id);
    if (!current) {
      failures.push(`${create._id}: missing after create`);
      continue;
    }
    if (
      !exactEqual(
        withoutMutableSystemFields(current, false),
        withoutMutableSystemFields(create, false),
      )
    ) {
      failures.push(
        `${create._id}: created document differs from exact plan`,
      );
    }
  }

  for (const patch of payload.patches) {
    const before = beforeById.get(patch.id);
    const current = postById.get(patch.id);
    if (!before || !current) {
      failures.push(
        `${patch.id}: missing before or after document`,
      );
      continue;
    }
    const expected = expectedAfterPatch(before, patch);
    if (
      !exactEqual(
        withoutMutableSystemFields(current),
        withoutMutableSystemFields(expected),
      )
    ) {
      failures.push(
        `${patch.id}: patched or untouched fields differ from exact plan`,
      );
    }
    if (current._rev === before._rev) {
      failures.push(`${patch.id}: revision did not change`);
    }
  }
  return failures;
}

async function zeroResidualFailures(
  publishedClient: ReturnType<typeof getCliClient>,
  rawClient: ReturnType<typeof getCliClient>,
  desired: DesiredReleaseDocument[],
  desiredByKey: Map<string, DesiredReleaseDocument>,
): Promise<string[]> {
  const failures: string[] = [];
  const published = await fetchPublishedExisting(publishedClient);
  const relevant = published.filter((document) =>
    desiredByKey.has(
      versionKey(document.platform, document.version),
    ),
  );
  const duplicates = duplicateEntries(relevant);
  if (duplicates.length) {
    failures.push(
      `duplicate published records: ${JSON.stringify(duplicates)}`,
    );
  }

  const drafts = await fetchRelevantDrafts(
    rawClient,
    desiredByKey,
    relevant,
  );
  if (drafts.length) {
    failures.push(
      `relevant drafts exist: ${drafts.map((draft) => draft._id).join(", ")}`,
    );
  }

  const currentByKey = new Map(
    relevant.map((document) => [
      versionKey(document.platform, document.version),
      document,
    ]),
  );
  for (const document of desired) {
    const key = versionKey(
      document.version.platform,
      document.version.version,
    );
    const current = currentByKey.get(key);
    if (!current) {
      failures.push(`${key}: missing after reconciliation`);
      continue;
    }
    try {
      const residual = reconcileDocument(document, current);
      if (residual.fieldsChanged.length) {
        failures.push(
          `${key}: residual fields ${residual.fieldsChanged.join(", ")}`,
        );
      }
    } catch (error) {
      failures.push(
        `${key}: residual reconciliation error: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  }
  return failures;
}

async function run() {
  const client = getCliClient({ apiVersion, useCdn: false });
  const publishedClient = client.withConfig({
    perspective: "published",
    useCdn: false,
  });
  const rawClient = client.withConfig({
    perspective: "raw",
    useCdn: false,
  });
  const config = client.config();
  if (
    config.projectId !== expectedProjectId ||
    config.dataset !== expectedDataset
  ) {
    throw new Error(
      `This migration is restricted to ${expectedProjectId}/${expectedDataset}; received ${config.projectId}/${config.dataset}.`,
    );
  }
  if (applyChanges && !productionAcknowledged) {
    throw new Error(
      "Production writes require --apply and --confirm-production.",
    );
  }

  const desired = loadDesired();
  const desiredByKey = new Map(
    desired.map((document) => [
      versionKey(
        document.version.platform,
        document.version.version,
      ),
      document,
    ]),
  );
  const existing = await fetchPublishedExisting(publishedClient);
  const relevantExisting = existing.filter((document) =>
    desiredByKey.has(versionKey(document.platform, document.version)),
  );
  const duplicates = duplicateEntries(relevantExisting);
  if (duplicates.length) {
    throw new Error(
      `Duplicate published records: ${JSON.stringify(duplicates)}.`,
    );
  }

  const relevantDrafts = await fetchRelevantDrafts(
    rawClient,
    desiredByKey,
    relevantExisting,
  );
  if (relevantDrafts.length) {
    throw new Error(
      `Open Sanity drafts block reconciliation: ${relevantDrafts.map((draft) => `${draft._id} (${draft.platform || "unknown"} ${draft.version || "unknown"})`).join(", ")}.`,
    );
  }

  const existingByKey = new Map(
    relevantExisting.map((document) => [
      versionKey(document.platform, document.version),
      document,
    ]),
  );
  const creates: DesiredReleaseDocument[] = [];
  const updates: ReconciledRelease[] = [];

  for (const document of desired) {
    const key = versionKey(
      document.version.platform,
      document.version.version,
    );
    const current = existingByKey.get(key);
    if (!current) {
      creates.push(document);
      continue;
    }

    const reconciled = reconcileDocument(document, current);
    if (reconciled.fieldsChanged.length) updates.push(reconciled);
  }

  const requiredTrainIds = [
    ...new Set(desired.map((document) => document.releaseTrainRef)),
  ];
  const existingTrainIds = await publishedClient.fetch<string[]>(
    `*[_id in $ids]._id`,
    { ids: requiredTrainIds },
  );
  const missingTrains = requiredTrainIds.filter(
    (id) => !existingTrainIds.includes(id),
  );
  if (missingTrains.length) {
    throw new Error(
      `Missing release trains: ${missingTrains.join(", ")}.`,
    );
  }

  const exactMutationPayload = buildExactMutationPayload(
    creates,
    updates,
  );
  const summary = migrationSummary(
    desired.length,
    exactMutationPayload,
    updates,
  );
  assertMutationCaps(summary);
  const planSha = sha256(exactMutationPayload);

  const rawBefore = await fetchRawDocumentsByIds(
    rawClient,
    exactMutationPayload.patches.map((patch) => patch.id),
  );
  assertRawBeforeMatchesPatches(
    rawBefore,
    exactMutationPayload.patches,
  );
  const generatedAt = new Date().toISOString();
  const artifacts = writeMigrationArtifacts({
    planSha,
    summary,
    payload: exactMutationPayload,
    updates,
    rawBefore,
    generatedAt,
  });

  console.log(
    `${applyChanges ? "APPLY" : "DRY RUN"}: ${summary.creates} create, ${summary.patches} revision-guarded patch, ${summary.unchanged} unchanged.`,
  );
  console.log(
    `MILESTONES: ${summary.totalMilestoneAdditions} additions (${summary.createdMilestones} in new documents, ${summary.addedMilestonesToExisting} in existing documents), ${summary.milestoneTransforms} verified transforms, ${summary.milestoneMetadataUpdates} metadata updates, ${summary.milestoneRemovals} verified removals.`,
  );
  console.log(
    `PATCH FIELDS: ${summary.patchSetFields} set, ${summary.patchUnsetFields} unset.`,
  );
  console.log(`PLAN SHA: ${planSha}`);
  console.log(`PLAN ARTIFACT: ${artifacts.planPath}`);
  console.log(`ROLLBACK MANIFEST: ${artifacts.rollbackPath}`);
  console.log(
    `BEFORE SNAPSHOT SHA: ${artifacts.beforeSnapshotSha}`,
  );
  for (const document of exactMutationPayload.creates) {
    console.log(
      `  CREATE ${document._id}: +${document.milestones.length} milestones`,
    );
  }
  for (const update of updates) {
    console.log(
      `  PATCH ${update.existing._id}: ${update.fieldsChanged.join(", ")}; +${update.additions.length} additions, ~${update.transforms.length} transforms, ~${update.metadataUpdates.length} metadata, -${update.removals.length} removals`,
    );
    for (const milestone of update.removals) {
      console.log(
        `    REMOVE VERIFIED FALSE/SCOPE-INAPPLICABLE ${milestone.label} ${milestone.date}`,
      );
    }
    for (const { before, after } of update.transforms) {
      console.log(
        `    TRANSFORM ${before.label} ${before.date} -> ${after.label} ${after.date}`,
      );
    }
    for (const { before, after } of update.metadataUpdates) {
      console.log(
        `    METADATA ${before.label} ${before.date}: ${sha256(before).slice(0, 12)} -> ${sha256(after).slice(0, 12)}`,
      );
    }
  }

  if (!applyChanges) {
    console.log(
      "\nNo Sanity data changed. Review the exact local plan and rollback artifacts, deploy lifecycle-aware code first, then apply with --confirm-production and this PLAN SHA.",
    );
    return;
  }
  if (!acknowledgedPlanSha || acknowledgedPlanSha !== planSha) {
    throw new Error(
      `Apply requires --plan-sha ${planSha} from this exact dry-run plan.`,
    );
  }

  let transaction = client.transaction();
  for (const document of exactMutationPayload.creates) {
    transaction = transaction.create(document);
  }
  for (const mutation of exactMutationPayload.patches) {
    transaction = transaction.patch(
      mutation.id,
      (patch) => {
        let next = patch.ifRevisionId(
          mutation.ifRevisionId,
        );
        if (Object.keys(mutation.set).length) {
          next = next.set(mutation.set);
        }
        if (mutation.unset.length) {
          next = next.unset(mutation.unset);
        }
        return next;
      },
    );
  }

  const result = await transaction.commit({
    visibility: "sync",
    tag: "beta-cadence.reconcile-release-history",
  });
  console.log(`Committed transaction ${result.transactionId}.`);

  const mutationIds = [
    ...exactMutationPayload.creates.map(
      (document) => document._id,
    ),
    ...exactMutationPayload.patches.map((patch) => patch.id),
  ];
  const postDocuments = await fetchRawDocumentsByIds(
    publishedClient,
    mutationIds,
  );
  artifacts.rollbackManifest.postApply = {
    transactionId: result.transactionId,
    revisions: Object.fromEntries(
      postDocuments.map((document) => [
        document._id,
        document._rev,
      ]),
    ),
  };
  writeJsonArtifact(
    path.basename(artifacts.rollbackPath),
    artifacts.rollbackManifest,
  );

  const failures = verifyExactPostCommit(
    exactMutationPayload,
    rawBefore,
    postDocuments,
  );
  failures.push(
    ...(await zeroResidualFailures(
      publishedClient,
      rawClient,
      desired,
      desiredByKey,
    )),
  );
  if (failures.length) {
    throw new Error(
      `Production transaction ${result.transactionId} committed, but exact post-commit verification failed. Use ${artifacts.rollbackPath} for guarded recovery:\n${failures.join("\n")}`,
    );
  }

  console.log(
    `Exactly verified ${mutationIds.length} mutated records, all untouched fields, and zero residual reconciliation.`,
  );
}

run().catch((error) => {
  console.error("Release-history reconciliation failed:", error);
  process.exit(1);
});
