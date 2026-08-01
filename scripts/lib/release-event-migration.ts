import { createHash } from "node:crypto";

export type ReleaseStatus = "active" | "released" | "superseded";

export type ReleaseEventChannel =
  | "developerBeta"
  | "publicBeta"
  | "releaseCandidate"
  | "goldenMaster"
  | "public"
  | "securityResponse"
  | "recovery"
  | "other";

export type MetadataReviewKind =
  | "availabilityState"
  | "buildNumber"
  | "channelAppearance"
  | "deviceScope"
  | "renamedCycle"
  | "revisionOrCorrective";

export interface LegacyMilestone extends Record<string, unknown> {
  _key?: string;
  _type?: string;
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

export interface LegacyReleaseVersion {
  _id: string;
  _rev?: string;
  _type?: string;
  platformId: string;
  platform: string;
  version: string;
  releaseStatus?: ReleaseStatus;
  publicReleaseDate?: string;
  releaseTrainId?: string;
  milestones: LegacyMilestone[];
}

export interface ReleaseStatusNormalizationCandidate {
  releaseVersionId: string;
  expectedRevision?: string;
  from: null;
  to: Exclude<ReleaseStatus, "superseded">;
  reason:
    | "legacy-public-date-implies-released"
    | "legacy-missing-public-date-implies-active";
}

export interface MetadataReviewCandidate {
  _key: string;
  kind: MetadataReviewKind;
  value: string;
  matchedText: string;
  evidenceField: "label" | "note";
  reviewRequired: true;
}

export interface ReleaseEventCandidate {
  _id: string;
  _type: "releaseEvent";
  releaseVersion: {
    _type: "reference";
    _ref: string;
  };
  platformId: string;
  platform: string;
  version: string;
  legacySourceId: string;
  stableEventId: string;
  legacyMilestoneKey?: string;
  legacySequence: number;
  identitySource: "liveMilestoneKey" | "syntheticFingerprint";
  label: string;
  date: string;
  note?: string;
  isRevision: boolean;
  channel: ReleaseEventChannel;
  availabilityState: "available";
  versionLabelAtAppearance?: string;
  legacyChannel?: string;
  applicabilityLabel?: string;
  sourceUrl?: string;
  sourceLabel?: string;
  structuredBuildNumber?: string;
  proposedBuildRef?: string;
  metadataReview: MetadataReviewCandidate[];
  /**
   * Exact source milestone used only by the compatibility projection.
   * It intentionally retains unknown CMS-only fields.
   */
  legacyProjection: LegacyMilestone;
}

export interface ReleaseBuildCandidate {
  _id: string;
  _type: "releaseBuild";
  releaseVersion: {
    _type: "reference";
    _ref: string;
  };
  platformId: string;
  platform: string;
  version: string;
  buildNumber: string;
  normalizedBuildNumber: string;
  eventRefs: Array<{
    _type: "reference";
    _ref: string;
  }>;
  mergeBasis: "identical-structured-build-number";
  reviewRequired: true;
}

export interface ReleaseVersionMigrationState {
  releaseVersionId: string;
  sourceRevision?: string;
  platformId: string;
  platform: string;
  version: string;
  currentReleaseStatus?: ReleaseStatus;
  normalizedReleaseStatus: ReleaseStatus;
  releaseStatusWasInferred: boolean;
  publicReleaseDate?: string;
  legacyMilestoneCount: number;
}

export interface ReleaseEventMigrationSummary {
  releaseVersions: number;
  releaseEvents: number;
  releaseBuildCandidates: number;
  reviewCandidates: number;
  syntheticEventIdentities: number;
  releaseStatusNormalizations: number;
}

export interface ReleaseEventMigrationPlan {
  formatVersion: 1;
  sourceDigest: string;
  planDigest: string;
  summary: ReleaseEventMigrationSummary;
  releaseStatusNormalizations: ReleaseStatusNormalizationCandidate[];
  versionStates: ReleaseVersionMigrationState[];
  events: ReleaseEventCandidate[];
  builds: ReleaseBuildCandidate[];
}

export interface SanityReference {
  _type: "reference";
  _ref: string;
}

export interface SanitySlug {
  _type: "slug";
  current: string;
}

export interface SchemaReadyApplicability {
  _type: "releaseApplicability";
  notes?: string;
}

export interface SchemaReadyCitation {
  _key: string;
  _type: "citation";
  source: SanityReference;
}

export interface SchemaReadyReleaseEvent {
  _id: string;
  _type: "releaseEvent";
  releaseVersion: SanityReference;
  platform: SanityReference;
  stableEventId: string;
  label: string;
  routeAlias: SanitySlug;
  channel: ReleaseEventChannel;
  appearanceDate: string;
  versionLabelAtAppearance?: string;
  sequence?: number;
  isRevision: boolean;
  availabilityState: "available";
  closesReleaseCycle: boolean;
  build?: SanityReference;
  applicability?: SchemaReadyApplicability;
  citations?: SchemaReadyCitation[];
  provenanceStatus: "legacyImported";
  editorialReview: {
    _type: "editorialReview";
    status: "draft";
  };
  isIndexable: false;
  legacySourceId: string;
  legacyNote?: string;
}

export interface SchemaReadyReleaseBuild {
  _id: string;
  _type: "releaseBuild";
  releaseVersion: SanityReference;
  platform: SanityReference;
  buildNumber: string;
  slug: SanitySlug;
  availabilityState: "available";
  applicability?: SchemaReadyApplicability;
  citations: SchemaReadyCitation[];
  provenanceStatus: "sourceLinked";
  editorialReview: {
    _type: "editorialReview";
    status: "draft";
  };
  isIndexable: false;
}

export interface WithheldBuildCandidate {
  candidateId: string;
  reason: "missing-approved-citation-source-refs";
}

export interface SchemaReadyMigrationProjection {
  formatVersion: 1;
  projectionDigest: string;
  releaseEvents: SchemaReadyReleaseEvent[];
  releaseBuilds: SchemaReadyReleaseBuild[];
  withheldBuildCandidates: WithheldBuildCandidate[];
}

export interface SchemaReadyProjectionOptions {
  /**
   * A build remains withheld unless a reviewed candidate is mapped to at
   * least one existing source document. Merely having a legacy source URL is
   * not equivalent to an approved citation.
   */
  approvedBuildCitationSourceIds?: Record<string, string[]>;
}

export type MigrationIssueSeverity = "error" | "warning";

export interface MigrationIssue {
  severity: MigrationIssueSeverity;
  code: string;
  path: string;
  message: string;
}

type UnknownRecord = Record<string, unknown>;

const releaseStatuses = new Set<ReleaseStatus>([
  "active",
  "released",
  "superseded",
]);

const availabilityTerms: Array<{
  pattern: RegExp;
  value: string;
}> = [
  { pattern: /\b(?:pulled|withdrawn)\b/i, value: "withdrawn" },
  { pattern: /\breplaced\b/i, value: "replaced" },
  { pattern: /\bsuperseded\b/i, value: "superseded" },
];

function isRecord(value: unknown): value is UnknownRecord {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function stringValue(value: unknown): string | undefined {
  return typeof value === "string" && value.trim()
    ? value.trim()
    : undefined;
}

function referenceId(value: unknown): string | undefined {
  if (!isRecord(value)) return undefined;
  return stringValue(value._ref) || stringValue(value._id);
}

function cloneJson<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

function normalizedForJson(value: unknown): unknown {
  if (Array.isArray(value)) {
    return value.map((item) => normalizedForJson(item));
  }
  if (isRecord(value)) {
    return Object.fromEntries(
      Object.entries(value)
        .filter(([, item]) => item !== undefined)
        .sort(([left], [right]) => left.localeCompare(right))
        .map(([key, item]) => [key, normalizedForJson(item)]),
    );
  }
  return value;
}

export function stableStringify(value: unknown, space?: number): string {
  return JSON.stringify(normalizedForJson(value), null, space);
}

function sha256(value: string): string {
  return createHash("sha256").update(value).digest("hex");
}

function compactHash(value: string): string {
  return sha256(value).slice(0, 24);
}

function slugPart(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function canonicalVersionId(platform: string, version: string): string {
  return `version-${slugPart(platform)}-${slugPart(version)}`;
}

function effectiveReleaseStatus(
  releaseStatus: ReleaseStatus | undefined,
  publicReleaseDate: string | undefined,
): ReleaseStatus {
  return releaseStatus || (publicReleaseDate ? "released" : "active");
}

function extractPlatformName(
  document: UnknownRecord,
  trainsById: Map<string, UnknownRecord>,
  platformsById: Map<string, UnknownRecord>,
): string | undefined {
  const direct = stringValue(document.platform);
  if (direct) return direct;

  if (isRecord(document.platform)) {
    const directObjectName =
      stringValue(document.platform.name) ||
      stringValue(document.platform.title);
    if (directObjectName) return directObjectName;
  }

  const releaseTrainValue =
    document.releaseTrain || document.releaseTrainRef;
  if (isRecord(releaseTrainValue)) {
    if (isRecord(releaseTrainValue.platform)) {
      const expandedPlatform =
        stringValue(releaseTrainValue.platform.name) ||
        stringValue(releaseTrainValue.platform.title);
      if (expandedPlatform) return expandedPlatform;
    }
    const expandedPlatform = stringValue(releaseTrainValue.platform);
    if (expandedPlatform) return expandedPlatform;
  }

  const trainId =
    stringValue(document.releaseTrainRef) ||
    referenceId(document.releaseTrain);
  const train = trainId ? trainsById.get(trainId) : undefined;
  if (!train) return undefined;

  const trainPlatformName = stringValue(train.platform);
  if (trainPlatformName) return trainPlatformName;
  if (isRecord(train.platform)) {
    const expandedName =
      stringValue(train.platform.name) ||
      stringValue(train.platform.title);
    if (expandedName) return expandedName;
  }

  const platformId = referenceId(train.platform);
  const platform = platformId
    ? platformsById.get(platformId)
    : undefined;
  return platform
    ? stringValue(platform.name) || stringValue(platform.title)
    : undefined;
}

function extractPlatformId(
  document: UnknownRecord,
  trainsById: Map<string, UnknownRecord>,
): string | undefined {
  const directPlatformId = referenceId(document.platform);
  if (directPlatformId) return directPlatformId;

  const releaseTrainValue =
    document.releaseTrain || document.releaseTrainRef;
  if (isRecord(releaseTrainValue)) {
    const expandedPlatformId = referenceId(
      releaseTrainValue.platform,
    );
    if (expandedPlatformId) return expandedPlatformId;
  }

  const trainId =
    stringValue(document.releaseTrainRef) ||
    referenceId(document.releaseTrain);
  const train = trainId ? trainsById.get(trainId) : undefined;
  return train ? referenceId(train.platform) : undefined;
}

function topLevelDocuments(input: unknown): UnknownRecord[] {
  if (Array.isArray(input)) {
    return input.filter(isRecord);
  }
  if (!isRecord(input)) return [];

  for (const field of ["documents", "result"]) {
    if (Array.isArray(input[field])) {
      return (input[field] as unknown[]).filter(isRecord);
    }
  }
  return [];
}

function releaseVersionDocuments(input: unknown): UnknownRecord[] {
  if (isRecord(input) && Array.isArray(input.releaseVersions)) {
    return (input.releaseVersions as unknown[]).filter(isRecord);
  }
  return topLevelDocuments(input).filter(
    (document) =>
      document._type === "releaseVersion" ||
      (stringValue(document.version) &&
        Array.isArray(document.milestones)),
  );
}

function normalizedReleaseStatus(
  value: unknown,
  documentId: string,
): ReleaseStatus | undefined {
  if (value === undefined || value === null || value === "") {
    return undefined;
  }
  if (
    typeof value === "string" &&
    releaseStatuses.has(value as ReleaseStatus)
  ) {
    return value as ReleaseStatus;
  }
  throw new Error(
    `${documentId} has unsupported releaseStatus ${JSON.stringify(value)}.`,
  );
}

function normalizedMilestone(
  value: unknown,
  versionId: string,
  index: number,
): LegacyMilestone {
  if (!isRecord(value)) {
    throw new Error(
      `${versionId} milestone ${index} is not an object.`,
    );
  }
  const label = stringValue(value.label);
  const date = stringValue(value.date);
  if (!label || !date) {
    throw new Error(
      `${versionId} milestone ${index} must contain label and date.`,
    );
  }
  return {
    ...cloneJson(value),
    label,
    date,
    isRevision: value.isRevision === true,
  } as LegacyMilestone;
}

/**
 * Adapts either scripts/seed-data.json or a local JSON Sanity snapshot.
 * A snapshot may be an array of documents, {documents: []}, or {result: []}.
 * The function performs no network calls.
 */
export function extractLegacyReleaseVersions(
  input: unknown,
): LegacyReleaseVersion[] {
  const documents = topLevelDocuments(input);
  const draftRelease = documents.find(
    (document) =>
      document._type === "releaseVersion" &&
      stringValue(document._id)?.startsWith("drafts."),
  );
  if (draftRelease) {
    throw new Error(
      `Snapshot contains draft release ${stringValue(draftRelease._id)}. Export published releaseVersion documents only so draft and published milestones cannot be migrated twice.`,
    );
  }
  const platformsById = new Map(
    documents
      .filter((document) => document._type === "platform")
      .flatMap((document) => {
        const id = stringValue(document._id);
        return id ? [[id, document] as const] : [];
      }),
  );
  const trainsById = new Map(
    documents
      .filter((document) => document._type === "releaseTrain")
      .flatMap((document) => {
        const id = stringValue(document._id);
        return id ? [[id, document] as const] : [];
      }),
  );

  const versions = releaseVersionDocuments(input).map((document, index) => {
    const version = stringValue(document.version);
    if (!version) {
      throw new Error(`Release version ${index} is missing version.`);
    }
    const platform = extractPlatformName(
      document,
      trainsById,
      platformsById,
    );
    if (!platform) {
      throw new Error(
        `${stringValue(document._id) || `release version ${index}`} is missing a resolvable platform.`,
      );
    }
    const platformId =
      extractPlatformId(document, trainsById) ||
      `platform-${slugPart(platform)}`;
    const id =
      stringValue(document._id) ||
      canonicalVersionId(platform, version);
    if (!Array.isArray(document.milestones)) {
      throw new Error(`${id} is missing its milestones array.`);
    }
    const releaseTrainId =
      stringValue(document.releaseTrainRef) ||
      referenceId(document.releaseTrain);
    const publicReleaseDate = stringValue(document.publicReleaseDate);

    return {
      _id: id,
      ...((stringValue(document._rev) && {
        _rev: stringValue(document._rev),
      }) ||
        {}),
      ...((stringValue(document._type) && {
        _type: stringValue(document._type),
      }) ||
        {}),
      platformId,
      platform,
      version,
      releaseStatus: normalizedReleaseStatus(
        document.releaseStatus,
        id,
      ),
      ...(publicReleaseDate ? { publicReleaseDate } : {}),
      ...(releaseTrainId ? { releaseTrainId } : {}),
      milestones: document.milestones.map((milestone, milestoneIndex) =>
        normalizedMilestone(milestone, id, milestoneIndex),
      ),
    } satisfies LegacyReleaseVersion;
  });

  const seen = new Set<string>();
  for (const version of versions) {
    if (seen.has(version._id)) {
      throw new Error(
        `The migration input repeats release version ID ${version._id}.`,
      );
    }
    seen.add(version._id);
  }

  return versions.sort((left, right) =>
    left._id.localeCompare(right._id),
  );
}

function classifyChannel(
  label: string,
  structuredChannel?: string,
): ReleaseEventChannel {
  const value = (structuredChannel || label).trim();
  const normalizedValue = value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "");
  if (["developer", "developerbeta"].includes(normalizedValue)) {
    return "developerBeta";
  }
  if (normalizedValue === "publicbeta") return "publicBeta";
  if (["rc", "releasecandidate"].includes(normalizedValue)) {
    return "releaseCandidate";
  }
  if (["gm", "goldenmaster"].includes(normalizedValue)) {
    return "goldenMaster";
  }
  if (normalizedValue === "public") return "public";
  if (normalizedValue === "securityresponse") {
    return "securityResponse";
  }
  if (["recovery", "rerelease"].includes(normalizedValue)) {
    return "recovery";
  }
  if (/rapid\s+security\s+response|security\s+response/i.test(value)) {
    return "securityResponse";
  }
  if (
    /\brecovery\b|\bre-?release\b|^public\s+update$/i.test(value)
  ) {
    return "recovery";
  }
  if (/public\s+beta/i.test(value)) return "publicBeta";
  if (
    /^(?:\d+(?:\.\d+)+\s+)?(?:developer\s+)?beta\b/i.test(
      value,
    )
  ) {
    return "developerBeta";
  }
  if (/^(?:release\s+candidate|rc)\b/i.test(value)) {
    return "releaseCandidate";
  }
  if (/^(?:golden\s+master|gm)\b/i.test(value)) {
    return "goldenMaster";
  }
  if (/^public$/i.test(value)) return "public";
  return "other";
}

function normalizeBuildNumber(value: string): string {
  return value.trim().toUpperCase();
}

function validBuildNumber(value: string): boolean {
  return /^\d{1,3}[A-Z]\d{1,5}[A-Z]?$/.test(
    normalizeBuildNumber(value),
  );
}

function isIsoDate(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const [year, month, day] = value.split("-").map(Number);
  const parsed = new Date(Date.UTC(year, month - 1, day));
  return (
    parsed.getUTCFullYear() === year &&
    parsed.getUTCMonth() === month - 1 &&
    parsed.getUTCDate() === day
  );
}

function appearanceVersionFromLabel(label: string): string | undefined {
  return label.match(
    /^(\d+(?:\.\d+)+)\s+(?:Beta|Public Beta|RC|GM)\b/i,
  )?.[1];
}

function pushReviewCandidate(
  candidates: MetadataReviewCandidate[],
  eventId: string,
  kind: MetadataReviewKind,
  value: string,
  matchedText: string,
  evidenceField: "label" | "note",
): void {
  const identity = [
    eventId,
    kind,
    value.toLowerCase(),
    matchedText.toLowerCase(),
    evidenceField,
  ].join("\0");
  if (
    candidates.some(
      (candidate) =>
        candidate.kind === kind &&
        candidate.value.toLowerCase() === value.toLowerCase() &&
        candidate.matchedText.toLowerCase() ===
          matchedText.toLowerCase(),
    )
  ) {
    return;
  }
  candidates.push({
    _key: `review-${compactHash(identity)}`,
    kind,
    value,
    matchedText,
    evidenceField,
    reviewRequired: true,
  });
}

function reviewCandidatesFromNote(
  note: string | undefined,
  eventId: string,
): MetadataReviewCandidate[] {
  if (!note) return [];
  const candidates: MetadataReviewCandidate[] = [];

  for (const match of note.matchAll(
    /\bbuild\s+(\d{1,3}[A-Z]\d{1,5}[A-Za-z]?)\b/gi,
  )) {
    pushReviewCandidate(
      candidates,
      eventId,
      "buildNumber",
      match[1],
      match[0],
      "note",
    );
  }

  const channelMatch = note.match(
    /\balso\s+released\s+as\s+((?:Public\s+Beta|Developer\s+Beta|Beta|RC)\s*\d*)/i,
  );
  if (channelMatch) {
    pushReviewCandidate(
      candidates,
      eventId,
      "channelAppearance",
      channelMatch[1].trim(),
      channelMatch[0],
      "note",
    );
  }

  for (const availability of availabilityTerms) {
    const match = note.match(availability.pattern);
    if (match) {
      pushReviewCandidate(
        candidates,
        eventId,
        "availabilityState",
        availability.value,
        match[0],
        "note",
      );
    }
  }

  const renamedMatch = note.match(
    /\b(?:cycle\s+)?renamed\s+to\s+(\d+(?:\.\d+)+)/i,
  );
  if (renamedMatch) {
    pushReviewCandidate(
      candidates,
      eventId,
      "renamedCycle",
      renamedMatch[1],
      renamedMatch[0],
      "note",
    );
  }

  const revisionMatch = note.match(
    /\b(?:revised|revision|corrective(?:\s+build)?)\b/i,
  );
  if (revisionMatch) {
    pushReviewCandidate(
      candidates,
      eventId,
      "revisionOrCorrective",
      revisionMatch[0],
      revisionMatch[0],
      "note",
    );
  }

  for (const clause of note.split(/[;—]/).map((value) => value.trim())) {
    if (
      /\b(?:iPhone|iPad|Mac|Apple Watch|Apple TV|Vision Pro|M[- ]series)\b/i.test(
        clause,
      ) &&
      /\bonly\b/i.test(clause)
    ) {
      pushReviewCandidate(
        candidates,
        eventId,
        "deviceScope",
        clause,
        clause,
        "note",
      );
    }
  }

  return candidates.sort(
    (left, right) =>
      left.kind.localeCompare(right.kind) ||
      left.value.localeCompare(right.value),
  );
}

function sourceBasis(versions: LegacyReleaseVersion[]): unknown {
  return versions.map((version) => ({
    _id: version._id,
    _rev: version._rev,
    platformId: version.platformId,
    platform: version.platform,
    version: version.version,
    releaseStatus: version.releaseStatus,
    publicReleaseDate: version.publicReleaseDate,
    releaseTrainId: version.releaseTrainId,
    milestones: version.milestones,
  }));
}

function syntheticMilestoneIdentity(
  milestone: LegacyMilestone,
  occurrence: number,
): string {
  const fingerprint = compactHash(
    stableStringify({
      label: milestone.label,
      date: milestone.date,
      note: milestone.note,
      build: milestone.build,
      channel: milestone.channel,
      deviceScope: milestone.deviceScope,
      sourceUrl: milestone.sourceUrl,
      sourceLabel: milestone.sourceLabel,
      isRevision: milestone.isRevision,
    }),
  );
  return `synthetic-${fingerprint}-${occurrence}`;
}

function planWithoutDigest(
  versions: LegacyReleaseVersion[],
): Omit<ReleaseEventMigrationPlan, "planDigest"> {
  const events: ReleaseEventCandidate[] = [];
  const versionStates: ReleaseVersionMigrationState[] = [];
  const releaseStatusNormalizations: ReleaseStatusNormalizationCandidate[] =
    [];

  for (const version of versions) {
    const normalizedStatus = effectiveReleaseStatus(
      version.releaseStatus,
      version.publicReleaseDate,
    );
    versionStates.push({
      releaseVersionId: version._id,
      ...(version._rev ? { sourceRevision: version._rev } : {}),
      platformId: version.platformId,
      platform: version.platform,
      version: version.version,
      ...(version.releaseStatus
        ? { currentReleaseStatus: version.releaseStatus }
        : {}),
      normalizedReleaseStatus: normalizedStatus,
      releaseStatusWasInferred: !version.releaseStatus,
      ...(version.publicReleaseDate
        ? { publicReleaseDate: version.publicReleaseDate }
        : {}),
      legacyMilestoneCount: version.milestones.length,
    });

    if (!version.releaseStatus) {
      releaseStatusNormalizations.push({
        releaseVersionId: version._id,
        ...(version._rev
          ? { expectedRevision: version._rev }
          : {}),
        from: null,
        to: normalizedStatus as Exclude<ReleaseStatus, "superseded">,
        reason: version.publicReleaseDate
          ? "legacy-public-date-implies-released"
          : "legacy-missing-public-date-implies-active",
      });
    }

    const syntheticOccurrences = new Map<string, number>();
    const liveKeys = new Set<string>();
    for (const [sequence, milestone] of version.milestones.entries()) {
      const liveKey = stringValue(milestone._key);
      if (liveKey && liveKeys.has(liveKey)) {
        throw new Error(
          `${version._id} repeats live milestone key ${liveKey}.`,
        );
      }
      if (liveKey) liveKeys.add(liveKey);

      let sourceKey = liveKey;
      if (!sourceKey) {
        const fingerprintBasis = stableStringify({
          label: milestone.label,
          date: milestone.date,
          note: milestone.note,
          build: milestone.build,
          channel: milestone.channel,
          deviceScope: milestone.deviceScope,
          sourceUrl: milestone.sourceUrl,
          sourceLabel: milestone.sourceLabel,
          isRevision: milestone.isRevision,
        });
        const occurrence =
          (syntheticOccurrences.get(fingerprintBasis) || 0) + 1;
        syntheticOccurrences.set(fingerprintBasis, occurrence);
        sourceKey = syntheticMilestoneIdentity(milestone, occurrence);
      }

      const legacySourceId = `${version._id}:${sourceKey}`;
      const eventId = `release-event-${compactHash(legacySourceId)}`;
      const structuredBuild = stringValue(milestone.build);
      const versionLabelAtAppearance =
        appearanceVersionFromLabel(milestone.label);
      const metadataReview = reviewCandidatesFromNote(
        stringValue(milestone.note),
        eventId,
      );

      events.push({
        _id: eventId,
        _type: "releaseEvent",
        releaseVersion: {
          _type: "reference",
          _ref: version._id,
        },
        platformId: version.platformId,
        platform: version.platform,
        version: version.version,
        legacySourceId,
        stableEventId: legacySourceId,
        ...(liveKey ? { legacyMilestoneKey: liveKey } : {}),
        legacySequence: sequence,
        identitySource: liveKey
          ? "liveMilestoneKey"
          : "syntheticFingerprint",
        label: milestone.label,
        date: milestone.date,
        ...(stringValue(milestone.note)
          ? { note: stringValue(milestone.note) }
          : {}),
        isRevision: milestone.isRevision,
        channel: classifyChannel(
          milestone.label,
          stringValue(milestone.channel),
        ),
        availabilityState: "available",
        ...(versionLabelAtAppearance &&
        versionLabelAtAppearance !== version.version
          ? { versionLabelAtAppearance }
          : {}),
        ...(stringValue(milestone.channel)
          ? { legacyChannel: stringValue(milestone.channel) }
          : {}),
        ...(stringValue(milestone.deviceScope)
          ? {
              applicabilityLabel: stringValue(
                milestone.deviceScope,
              ),
            }
          : {}),
        ...(stringValue(milestone.sourceUrl)
          ? { sourceUrl: stringValue(milestone.sourceUrl) }
          : {}),
        ...(stringValue(milestone.sourceLabel)
          ? { sourceLabel: stringValue(milestone.sourceLabel) }
          : {}),
        ...(structuredBuild
          ? { structuredBuildNumber: structuredBuild }
          : {}),
        metadataReview,
        legacyProjection: cloneJson(milestone),
      });
    }
  }

  const buildsByIdentity = new Map<string, ReleaseBuildCandidate>();
  for (const event of events) {
    if (!event.structuredBuildNumber) continue;
    if (!validBuildNumber(event.structuredBuildNumber)) continue;

    const normalizedBuild = normalizeBuildNumber(
      event.structuredBuildNumber,
    );
    const identity = `${event.releaseVersion._ref}\0${normalizedBuild}`;
    let build = buildsByIdentity.get(identity);
    if (!build) {
      const buildId = `release-build-${compactHash(identity)}`;
      build = {
        _id: buildId,
        _type: "releaseBuild",
        releaseVersion: {
          _type: "reference",
          _ref: event.releaseVersion._ref,
        },
        platformId: event.platformId,
        platform: event.platform,
        version: event.version,
        buildNumber: event.structuredBuildNumber,
        normalizedBuildNumber: normalizedBuild,
        eventRefs: [],
        mergeBasis: "identical-structured-build-number",
        reviewRequired: true,
      };
      buildsByIdentity.set(identity, build);
    }
    build.eventRefs.push({
      _type: "reference",
      _ref: event._id,
    });
    event.proposedBuildRef = build._id;
  }

  const builds = [...buildsByIdentity.values()]
    .map((build) => ({
      ...build,
      eventRefs: [...build.eventRefs].sort((left, right) =>
        left._ref.localeCompare(right._ref),
      ),
    }))
    .sort((left, right) => left._id.localeCompare(right._id));
  events.sort(
    (left, right) =>
      left.releaseVersion._ref.localeCompare(
        right.releaseVersion._ref,
      ) || left.legacySequence - right.legacySequence,
  );
  versionStates.sort((left, right) =>
    left.releaseVersionId.localeCompare(right.releaseVersionId),
  );
  releaseStatusNormalizations.sort((left, right) =>
    left.releaseVersionId.localeCompare(right.releaseVersionId),
  );

  return {
    formatVersion: 1,
    sourceDigest: sha256(stableStringify(sourceBasis(versions))),
    summary: {
      releaseVersions: versions.length,
      releaseEvents: events.length,
      releaseBuildCandidates: builds.length,
      reviewCandidates: events.reduce(
        (sum, event) => sum + event.metadataReview.length,
        0,
      ),
      syntheticEventIdentities: events.filter(
        (event) =>
          event.identitySource === "syntheticFingerprint",
      ).length,
      releaseStatusNormalizations:
        releaseStatusNormalizations.length,
    },
    releaseStatusNormalizations,
    versionStates,
    events,
    builds,
  };
}

/**
 * Produces a deterministic, non-executable migration plan.
 * No timestamps, network calls, or mutation payloads are included.
 */
export function buildReleaseEventMigrationPlan(
  versions: LegacyReleaseVersion[],
): ReleaseEventMigrationPlan {
  const canonicalVersions = [...versions].sort((left, right) =>
    left._id.localeCompare(right._id),
  );
  const plan = planWithoutDigest(canonicalVersions);
  return {
    ...plan,
    planDigest: sha256(stableStringify(plan)),
  };
}

function routeSlug(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/^developer(?:\s+|-)+/, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function uniqueEventRouteAlias(
  event: ReleaseEventCandidate,
  usedAliases: Set<string>,
  baseCollisionCount: number,
): string {
  const base =
    routeSlug(event.label).slice(0, 96) ||
    `event-${event.legacySequence + 1}`;
  if (baseCollisionCount <= 1 && !usedAliases.has(base)) {
    usedAliases.add(base);
    return base;
  }

  const dateSuffix = `-${event.date}`;
  let candidate = `${base.slice(0, 96 - dateSuffix.length)}${dateSuffix}`;
  let collision = 2;
  while (usedAliases.has(candidate)) {
    const suffix = `${dateSuffix}-${collision}`;
    candidate = `${base.slice(0, 96 - suffix.length)}${suffix}`;
    collision += 1;
  }
  usedAliases.add(candidate);
  return candidate;
}

function eventSequence(label: string): number | undefined {
  const match = label.match(
    /(?:public\s+beta|developer\s+beta|beta|rc)\s+(\d+)/i,
  );
  if (!match) return undefined;
  const value = Number.parseInt(match[1], 10);
  return value > 0 ? value : undefined;
}

function applicabilityFromNotes(
  notes: Array<string | undefined>,
): SchemaReadyApplicability | undefined {
  const uniqueNotes = [
    ...new Set(
      notes
        .map((note) => note?.trim())
        .filter((note): note is string => Boolean(note)),
    ),
  ];
  return uniqueNotes.length
    ? {
        _type: "releaseApplicability",
        notes: uniqueNotes.join("; "),
      }
    : undefined;
}

function citationForSource(
  ownerId: string,
  sourceId: string,
): SchemaReadyCitation {
  return {
    _key: `citation-${compactHash(`${ownerId}\0${sourceId}`)}`,
    _type: "citation",
    source: {
      _type: "reference",
      _ref: sourceId,
    },
  };
}

/**
 * Converts the guarded planner model into documents that match the finalized
 * Sanity schema. Build candidates are deliberately withheld until the caller
 * supplies approved references to existing source documents.
 */
export function projectSchemaReadyMigration(
  plan: ReleaseEventMigrationPlan,
  options: SchemaReadyProjectionOptions = {},
): SchemaReadyMigrationProjection {
  const citationMappings =
    options.approvedBuildCitationSourceIds || {};
  const buildCandidatesById = new Map(
    plan.builds.map((build) => [build._id, build]),
  );
  for (const candidateId of Object.keys(citationMappings)) {
    if (!buildCandidatesById.has(candidateId)) {
      throw new Error(
        `Citation mapping references unknown build candidate ${candidateId}.`,
      );
    }
  }

  const releaseBuilds: SchemaReadyReleaseBuild[] = [];
  const withheldBuildCandidates: WithheldBuildCandidate[] = [];
  for (const build of plan.builds) {
    const sourceIds = [
      ...new Set(
        (citationMappings[build._id] || [])
          .map((sourceId) => sourceId.trim())
          .filter(Boolean),
      ),
    ];
    if (!sourceIds.length) {
      withheldBuildCandidates.push({
        candidateId: build._id,
        reason: "missing-approved-citation-source-refs",
      });
      continue;
    }
    if (
      sourceIds.some(
        (sourceId) => !/^[A-Za-z0-9._-]+$/.test(sourceId),
      )
    ) {
      throw new Error(
        `${build._id} has an invalid approved source document ID.`,
      );
    }

    const relatedEvents = build.eventRefs
      .map((reference) =>
        plan.events.find((event) => event._id === reference._ref),
      )
      .filter(
        (event): event is ReleaseEventCandidate => Boolean(event),
      );
    const applicability = applicabilityFromNotes(
      relatedEvents.map((event) => event.applicabilityLabel),
    );
    releaseBuilds.push({
      _id: build._id,
      _type: "releaseBuild",
      releaseVersion: {
        _type: "reference",
        _ref: build.releaseVersion._ref,
      },
      platform: {
        _type: "reference",
        _ref: build.platformId,
      },
      buildNumber: build.buildNumber,
      slug: {
        _type: "slug",
        current: routeSlug(build.buildNumber),
      },
      availabilityState: "available",
      ...(applicability ? { applicability } : {}),
      citations: sourceIds.map((sourceId) =>
        citationForSource(build._id, sourceId),
      ),
      provenanceStatus: "sourceLinked",
      editorialReview: {
        _type: "editorialReview",
        status: "draft",
      },
      isIndexable: false,
    });
  }
  releaseBuilds.sort((left, right) =>
    left._id.localeCompare(right._id),
  );
  withheldBuildCandidates.sort((left, right) =>
    left.candidateId.localeCompare(right.candidateId),
  );

  const emittedBuildIds = new Set(
    releaseBuilds.map((build) => build._id),
  );
  const versionStates = new Map(
    plan.versionStates.map((state) => [
      state.releaseVersionId,
      state,
    ]),
  );
  const aliasesByVersion = new Map<string, Set<string>>();
  const aliasCountsByVersion = new Map<string, Map<string, number>>();
  for (const event of plan.events) {
    const versionId = event.releaseVersion._ref;
    const counts =
      aliasCountsByVersion.get(versionId) ||
      new Map<string, number>();
    aliasCountsByVersion.set(versionId, counts);
    const base =
      routeSlug(event.label).slice(0, 96) ||
      `event-${event.legacySequence + 1}`;
    counts.set(base, (counts.get(base) || 0) + 1);
  }
  const releaseEvents = plan.events.map(
    (event): SchemaReadyReleaseEvent => {
      const versionId = event.releaseVersion._ref;
      const aliases =
        aliasesByVersion.get(versionId) || new Set<string>();
      aliasesByVersion.set(versionId, aliases);
      const base =
        routeSlug(event.label).slice(0, 96) ||
        `event-${event.legacySequence + 1}`;
      const routeAlias = uniqueEventRouteAlias(
        event,
        aliases,
        aliasCountsByVersion.get(versionId)?.get(base) || 0,
      );
      const versionState = versionStates.get(versionId);
      const sequence = eventSequence(event.label);
      const applicability = applicabilityFromNotes([
        event.applicabilityLabel,
      ]);
      const buildId =
        event.proposedBuildRef &&
        emittedBuildIds.has(event.proposedBuildRef)
          ? event.proposedBuildRef
          : undefined;
      const closesReleaseCycle = Boolean(
        versionState?.normalizedReleaseStatus === "released" &&
          versionState.publicReleaseDate === event.date &&
          ["public", "goldenMaster"].includes(event.channel),
      );

      return {
        _id: event._id,
        _type: "releaseEvent",
        releaseVersion: {
          _type: "reference",
          _ref: versionId,
        },
        platform: {
          _type: "reference",
          _ref: event.platformId,
        },
        stableEventId: event.stableEventId,
        label: event.label,
        routeAlias: {
          _type: "slug",
          current: routeAlias,
        },
        channel: event.channel,
        appearanceDate: event.date,
        ...(event.versionLabelAtAppearance
          ? {
              versionLabelAtAppearance:
                event.versionLabelAtAppearance,
            }
          : {}),
        ...(sequence ? { sequence } : {}),
        isRevision: event.isRevision,
        availabilityState: "available",
        closesReleaseCycle,
        ...(buildId
          ? {
              build: {
                _type: "reference",
                _ref: buildId,
              } as SanityReference,
            }
          : {}),
        ...(applicability ? { applicability } : {}),
        provenanceStatus: "legacyImported",
        editorialReview: {
          _type: "editorialReview",
          status: "draft",
        },
        isIndexable: false,
        legacySourceId: event.legacySourceId,
        ...(event.note ? { legacyNote: event.note } : {}),
      };
    },
  );

  const projectionWithoutDigest = {
    formatVersion: 1 as const,
    releaseEvents,
    releaseBuilds,
    withheldBuildCandidates,
  };
  return {
    ...projectionWithoutDigest,
    projectionDigest: sha256(
      stableStringify(projectionWithoutDigest),
    ),
  };
}

export function validateSchemaReadyMigration(
  plan: ReleaseEventMigrationPlan,
  projection: SchemaReadyMigrationProjection,
): MigrationIssue[] {
  const issues: MigrationIssue[] = [];
  const allowedChannels = new Set<ReleaseEventChannel>([
    "developerBeta",
    "publicBeta",
    "releaseCandidate",
    "goldenMaster",
    "public",
    "securityResponse",
    "recovery",
    "other",
  ]);
  const candidateEvents = new Map(
    plan.events.map((event) => [event._id, event]),
  );
  const candidateBuilds = new Map(
    plan.builds.map((build) => [build._id, build]),
  );
  const emittedBuilds = new Map(
    projection.releaseBuilds.map((build) => [build._id, build]),
  );
  const routeAliases = new Set<string>();
  const schemaEventIds = new Set<string>();

  if (projection.releaseEvents.length !== plan.events.length) {
    issues.push({
      severity: "error",
      code: "schema-event-count-mismatch",
      path: "releaseEvents",
      message:
        "The schema-ready projection does not contain one event per migration candidate.",
    });
  }

  for (const [index, event] of projection.releaseEvents.entries()) {
    const path = `releaseEvents[${index}]`;
    const candidate = candidateEvents.get(event._id);
    if (schemaEventIds.has(event._id)) {
      issues.push({
        severity: "error",
        code: "duplicate-schema-event",
        path,
        message: `${event._id} appears more than once in the schema projection.`,
      });
    }
    schemaEventIds.add(event._id);
    if (!candidate) {
      issues.push({
        severity: "error",
        code: "unexpected-schema-event",
        path,
        message: `${event._id} has no planner event candidate.`,
      });
      continue;
    }
    if (
      event._type !== "releaseEvent" ||
      event.releaseVersion?._type !== "reference" ||
      event.platform?._type !== "reference" ||
      !event.releaseVersion?._ref ||
      !event.platform?._ref ||
      !event.stableEventId ||
      !event.label ||
      !event.routeAlias?.current ||
      !event.appearanceDate
    ) {
      issues.push({
        severity: "error",
        code: "schema-event-required-field",
        path,
        message: `${event._id} is missing a required releaseEvent field.`,
      });
    }
    if (event.label.length < 2 || event.label.length > 100) {
      issues.push({
        severity: "error",
        code: "invalid-schema-event-label",
        path: `${path}.label`,
        message: `${event._id} has a schema-invalid display label.`,
      });
    }
    if (
      event.releaseVersion._ref !== candidate.releaseVersion._ref ||
      event.platform._ref !== candidate.platformId
    ) {
      issues.push({
        severity: "error",
        code: "schema-event-parent-mismatch",
        path,
        message: `${event._id} does not preserve its version/platform references.`,
      });
    }
    if (
      event.stableEventId !== candidate.stableEventId ||
      event.legacySourceId !== candidate.legacySourceId
    ) {
      issues.push({
        severity: "error",
        code: "schema-event-identity-mismatch",
        path,
        message: `${event._id} does not preserve its stable migration identity.`,
      });
    }
    if (
      !/^[A-Za-z0-9._:-]{12,220}$/.test(event.stableEventId)
    ) {
      issues.push({
        severity: "error",
        code: "invalid-schema-stable-event-id",
        path: `${path}.stableEventId`,
        message: `${event._id} has a schema-invalid stableEventId.`,
      });
    }
    const aliasIdentity = `${event.releaseVersion._ref}\0${event.routeAlias.current}`;
    if (
      event.routeAlias._type !== "slug" ||
      !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(
        event.routeAlias.current,
      ) ||
      event.routeAlias.current.length > 96 ||
      routeAliases.has(aliasIdentity)
    ) {
      issues.push({
        severity: "error",
        code: "invalid-schema-event-alias",
        path: `${path}.routeAlias`,
        message: `${event._id} has an invalid or duplicate version-scoped route alias.`,
      });
    }
    routeAliases.add(aliasIdentity);
    if (!allowedChannels.has(event.channel)) {
      issues.push({
        severity: "error",
        code: "invalid-schema-event-channel",
        path: `${path}.channel`,
        message: `${event._id} has unsupported channel ${event.channel}.`,
      });
    }
    if (!isIsoDate(event.appearanceDate)) {
      issues.push({
        severity: "error",
        code: "invalid-schema-appearance-date",
        path: `${path}.appearanceDate`,
        message: `${event._id} has an invalid appearance date.`,
      });
    }
    if (
      event.versionLabelAtAppearance &&
      !/^\d+(?:\.\d+){0,2}[a-z]?$/i.test(
        event.versionLabelAtAppearance,
      )
    ) {
      issues.push({
        severity: "error",
        code: "invalid-schema-appearance-version",
        path: `${path}.versionLabelAtAppearance`,
        message: `${event._id} has an invalid appearance version label.`,
      });
    }
    if (
      event.sequence !== undefined &&
      (!Number.isInteger(event.sequence) || event.sequence <= 0)
    ) {
      issues.push({
        severity: "error",
        code: "invalid-schema-event-sequence",
        path: `${path}.sequence`,
        message: `${event._id} has an invalid channel sequence.`,
      });
    }
    if (
      event.closesReleaseCycle &&
      !["public", "goldenMaster"].includes(event.channel)
    ) {
      issues.push({
        severity: "error",
        code: "invalid-schema-cycle-closure",
        path: `${path}.closesReleaseCycle`,
        message: `${event._id} cannot close a release cycle in the ${event.channel} channel.`,
      });
    }
    if (
      event.availabilityState !== "available" ||
      typeof event.isRevision !== "boolean" ||
      event.provenanceStatus !== "legacyImported" ||
      event.editorialReview?._type !== "editorialReview" ||
      event.editorialReview?.status !== "draft" ||
      event.isIndexable !== false
    ) {
      issues.push({
        severity: "error",
        code: "unsafe-schema-event-publishing-state",
        path,
        message: `${event._id} must remain a legacy-imported, non-indexable draft.`,
      });
    }
    if (
      !/^[A-Za-z0-9._:-]+$/.test(event.legacySourceId) ||
      event.legacySourceId.length > 300 ||
      (event.legacyNote?.length || 0) > 5_000 ||
      (event.applicability?.notes?.length || 0) > 1_000
    ) {
      issues.push({
        severity: "error",
        code: "invalid-schema-event-legacy-fields",
        path,
        message: `${event._id} exceeds a legacy/applicability schema constraint.`,
      });
    }
    if (event.build && !emittedBuilds.has(event.build._ref)) {
      issues.push({
        severity: "error",
        code: "schema-event-missing-build",
        path: `${path}.build`,
        message: `${event._id} references a withheld or missing build.`,
      });
    }
    if (event.legacyNote !== candidate.note) {
      issues.push({
        severity: "error",
        code: "schema-event-legacy-note-parity",
        path: `${path}.legacyNote`,
        message: `${event._id} changed its original legacy note.`,
      });
    }
  }
  for (const event of plan.events) {
    if (!schemaEventIds.has(event._id)) {
      issues.push({
        severity: "error",
        code: "missing-schema-event",
        path: event._id,
        message: `${event._id} is missing from the schema projection.`,
      });
    }
  }

  const schemaBuildIds = new Set<string>();
  for (const [index, build] of projection.releaseBuilds.entries()) {
    const path = `releaseBuilds[${index}]`;
    const candidate = candidateBuilds.get(build._id);
    if (schemaBuildIds.has(build._id)) {
      issues.push({
        severity: "error",
        code: "duplicate-schema-build",
        path,
        message: `${build._id} appears more than once in the schema projection.`,
      });
    }
    schemaBuildIds.add(build._id);
    if (!candidate) {
      issues.push({
        severity: "error",
        code: "unexpected-schema-build",
        path,
        message: `${build._id} has no reviewed build candidate.`,
      });
      continue;
    }
    const expectedSlug = routeSlug(build.buildNumber);
    if (
      build._type !== "releaseBuild" ||
      build.releaseVersion?._type !== "reference" ||
      build.platform?._type !== "reference" ||
      build.releaseVersion?._ref !==
        candidate.releaseVersion._ref ||
      build.platform?._ref !== candidate.platformId ||
      build.buildNumber !== candidate.buildNumber ||
      build.slug?._type !== "slug" ||
      build.slug.current !== expectedSlug ||
      build.slug.current.length > 96
    ) {
      issues.push({
        severity: "error",
        code: "schema-build-contract",
        path,
        message: `${build._id} does not match the releaseBuild identity contract.`,
      });
    }
    if (!/^\d+[A-Za-z]\d+[A-Za-z]?$/.test(build.buildNumber)) {
      issues.push({
        severity: "error",
        code: "invalid-schema-build-number",
        path: `${path}.buildNumber`,
        message: `${build._id} does not preserve a valid display-case Apple build number.`,
      });
    }
    if (
      !build.citations?.length ||
      build.citations.some(
        (citation) =>
          citation._type !== "citation" ||
          !citation.source?._ref,
      )
    ) {
      issues.push({
        severity: "error",
        code: "schema-build-missing-citations",
        path: `${path}.citations`,
        message: `${build._id} cannot be emitted without approved source references.`,
      });
    }
    if (
      build.provenanceStatus !== "sourceLinked" ||
      build.editorialReview?._type !== "editorialReview" ||
      build.editorialReview?.status !== "draft" ||
      build.isIndexable !== false
    ) {
      issues.push({
        severity: "error",
        code: "unsafe-schema-build-publishing-state",
        path,
        message: `${build._id} must remain a source-linked, non-indexable draft.`,
      });
    }
    if ((build.applicability?.notes?.length || 0) > 1_000) {
      issues.push({
        severity: "error",
        code: "invalid-schema-build-applicability",
        path: `${path}.applicability`,
        message: `${build._id} exceeds the applicability schema limit.`,
      });
    }
  }

  const withheldIds = new Set(
    projection.withheldBuildCandidates.map(
      (candidate) => candidate.candidateId,
    ),
  );
  if (
    withheldIds.size !== projection.withheldBuildCandidates.length
  ) {
    issues.push({
      severity: "error",
      code: "duplicate-withheld-build",
      path: "withheldBuildCandidates",
      message: "A build candidate is withheld more than once.",
    });
  }
  for (const withheld of projection.withheldBuildCandidates) {
    if (
      !candidateBuilds.has(withheld.candidateId) ||
      withheld.reason !==
        "missing-approved-citation-source-refs"
    ) {
      issues.push({
        severity: "error",
        code: "invalid-withheld-build",
        path: withheld.candidateId,
        message:
          "The withheld build list contains an unknown candidate or reason.",
      });
    }
  }
  for (const build of plan.builds) {
    const emitted = emittedBuilds.has(build._id);
    const withheld = withheldIds.has(build._id);
    if (emitted === withheld) {
      issues.push({
        severity: "error",
        code: "schema-build-disposition",
        path: build._id,
        message: `${build._id} must be emitted or withheld exactly once.`,
      });
    }
  }

  const projectionWithoutDigest = {
    formatVersion: projection.formatVersion,
    releaseEvents: projection.releaseEvents,
    releaseBuilds: projection.releaseBuilds,
    withheldBuildCandidates: projection.withheldBuildCandidates,
  };
  if (
    projection.projectionDigest !==
    sha256(stableStringify(projectionWithoutDigest))
  ) {
    issues.push({
      severity: "error",
      code: "schema-projection-digest-mismatch",
      path: "projectionDigest",
      message:
        "The schema-ready projection digest does not match its contents.",
    });
  }

  return issues;
}

export function assertValidSchemaReadyMigration(
  plan: ReleaseEventMigrationPlan,
  projection: SchemaReadyMigrationProjection,
): void {
  const errors = validateSchemaReadyMigration(
    plan,
    projection,
  ).filter((issue) => issue.severity === "error");
  if (!errors.length) return;

  throw new Error(
    [
      `Schema-ready migration validation failed with ${errors.length} error(s):`,
      ...errors.map(
        (issue) =>
          `- [${issue.code}] ${issue.path}: ${issue.message}`,
      ),
    ].join("\n"),
  );
}

export function projectEventsToLegacyMilestones(
  plan: ReleaseEventMigrationPlan,
): Record<string, LegacyMilestone[]> {
  const projected: Record<string, LegacyMilestone[]> = {};
  for (const state of plan.versionStates) {
    projected[state.releaseVersionId] = [];
  }
  for (const event of plan.events) {
    const milestones =
      projected[event.releaseVersion._ref] ||
      (projected[event.releaseVersion._ref] = []);
    milestones.push(cloneJson(event.legacyProjection));
  }
  for (const [versionId, milestones] of Object.entries(projected)) {
    const events = plan.events
      .filter((event) => event.releaseVersion._ref === versionId)
      .sort(
        (left, right) =>
          left.legacySequence - right.legacySequence,
      );
    projected[versionId] = events.map((event) =>
      cloneJson(event.legacyProjection),
    );
    if (milestones.length !== events.length) {
      throw new Error(
        `${versionId} projection count changed while ordering events.`,
      );
    }
  }
  return projected;
}

export function validateLegacyProjection(
  versions: LegacyReleaseVersion[],
  plan: ReleaseEventMigrationPlan,
): MigrationIssue[] {
  const issues: MigrationIssue[] = [];
  const projected = projectEventsToLegacyMilestones(plan);
  const sourceById = new Map(
    versions.map((version) => [version._id, version]),
  );

  for (const version of versions) {
    const actual = projected[version._id];
    if (!actual) {
      issues.push({
        severity: "error",
        code: "missing-version-projection",
        path: version._id,
        message: `${version._id} has no event projection.`,
      });
      continue;
    }
    if (
      stableStringify(actual) !==
      stableStringify(version.milestones)
    ) {
      issues.push({
        severity: "error",
        code: "legacy-milestone-parity",
        path: `${version._id}.milestones`,
        message: `${version._id} does not project to its exact legacy milestone array.`,
      });
    }
    const state = plan.versionStates.find(
      (candidate) =>
        candidate.releaseVersionId === version._id,
    );
    if (!state) {
      issues.push({
        severity: "error",
        code: "missing-version-state",
        path: version._id,
        message: `${version._id} has no lifecycle migration state.`,
      });
      continue;
    }
    const expectedStatus = effectiveReleaseStatus(
      version.releaseStatus,
      version.publicReleaseDate,
    );
    if (state.normalizedReleaseStatus !== expectedStatus) {
      issues.push({
        severity: "error",
        code: "release-status-parity",
        path: `${version._id}.releaseStatus`,
        message: `${version._id} changed lifecycle from ${expectedStatus} to ${state.normalizedReleaseStatus}.`,
      });
    }
    if (state.publicReleaseDate !== version.publicReleaseDate) {
      issues.push({
        severity: "error",
        code: "public-date-parity",
        path: `${version._id}.publicReleaseDate`,
        message: `${version._id} changed its public release date.`,
      });
    }
  }

  for (const state of plan.versionStates) {
    if (!sourceById.has(state.releaseVersionId)) {
      issues.push({
        severity: "error",
        code: "unexpected-version-state",
        path: state.releaseVersionId,
        message: `${state.releaseVersionId} was not present in the migration source.`,
      });
    }
  }

  return issues;
}

export function validateReleaseEventMigrationPlan(
  plan: ReleaseEventMigrationPlan,
): MigrationIssue[] {
  const issues: MigrationIssue[] = [];
  const eventIds = new Set<string>();
  const legacySourceIds = new Set<string>();
  const eventById = new Map<string, ReleaseEventCandidate>();
  const versionStates = new Map(
    plan.versionStates.map((state) => [
      state.releaseVersionId,
      state,
    ]),
  );

  for (const [index, event] of plan.events.entries()) {
    const path = `events[${index}]`;
    if (eventIds.has(event._id)) {
      issues.push({
        severity: "error",
        code: "duplicate-event-id",
        path,
        message: `Duplicate event ID ${event._id}.`,
      });
    }
    eventIds.add(event._id);
    eventById.set(event._id, event);

    if (legacySourceIds.has(event.legacySourceId)) {
      issues.push({
        severity: "error",
        code: "duplicate-legacy-source",
        path: `${path}.legacySourceId`,
        message: `Duplicate legacy source ${event.legacySourceId}.`,
      });
    }
    legacySourceIds.add(event.legacySourceId);

    if (!isIsoDate(event.date)) {
      issues.push({
        severity: "error",
        code: "invalid-event-date",
        path: `${path}.date`,
        message: `${event._id} has invalid date ${event.date}.`,
      });
    }
    if (!versionStates.has(event.releaseVersion._ref)) {
      issues.push({
        severity: "error",
        code: "missing-event-version",
        path: `${path}.releaseVersion`,
        message: `${event._id} references an unknown release version.`,
      });
    }
    if (
      !event.platformId ||
      event.stableEventId !== event.legacySourceId
    ) {
      issues.push({
        severity: "error",
        code: "invalid-event-schema-identity",
        path,
        message: `${event._id} must carry its platform reference ID and immutable legacy stable identity.`,
      });
    }
    if (
      event.identitySource === "liveMilestoneKey" &&
      !event.legacyMilestoneKey
    ) {
      issues.push({
        severity: "error",
        code: "missing-live-milestone-key",
        path: `${path}.legacyMilestoneKey`,
        message: `${event._id} claims a live key identity without the key.`,
      });
    }
    if (
      event.structuredBuildNumber &&
      !validBuildNumber(event.structuredBuildNumber)
    ) {
      issues.push({
        severity: "error",
        code: "invalid-structured-build",
        path: `${path}.structuredBuildNumber`,
        message: `${event._id} has invalid structured build number ${event.structuredBuildNumber}.`,
      });
    }
    for (const [reviewIndex, review] of event.metadataReview.entries()) {
      if (review.reviewRequired !== true) {
        issues.push({
          severity: "error",
          code: "unguarded-note-metadata",
          path: `${path}.metadataReview[${reviewIndex}]`,
          message: `${event._id} contains note-derived metadata that is not review-required.`,
        });
      }
    }

    const noteBuilds = event.metadataReview
      .filter((candidate) => candidate.kind === "buildNumber")
      .map((candidate) => normalizeBuildNumber(candidate.value));
    if (
      event.structuredBuildNumber &&
      noteBuilds.length &&
      noteBuilds.some(
        (build) =>
          build !==
          normalizeBuildNumber(event.structuredBuildNumber as string),
      )
    ) {
      issues.push({
        severity: "error",
        code: "structured-build-note-conflict",
        path: `${path}.structuredBuildNumber`,
        message: `${event._id} has conflicting structured and note-derived build numbers.`,
      });
    }
    if (!event.structuredBuildNumber && event.proposedBuildRef) {
      issues.push({
        severity: "error",
        code: "note-only-build-merge",
        path: `${path}.proposedBuildRef`,
        message: `${event._id} was grouped into a build without an explicit structured build field.`,
      });
    }
  }

  const buildIds = new Set<string>();
  const platformBuilds = new Map<
    string,
    { buildId: string; releaseVersionId: string }
  >();
  for (const [index, build] of plan.builds.entries()) {
    const path = `builds[${index}]`;
    if (buildIds.has(build._id)) {
      issues.push({
        severity: "error",
        code: "duplicate-build-id",
        path,
        message: `Duplicate build ID ${build._id}.`,
      });
    }
    buildIds.add(build._id);
    const platformBuildIdentity = `${build.platform.toLowerCase()}\0${build.normalizedBuildNumber}`;
    const earlierPlatformBuild = platformBuilds.get(
      platformBuildIdentity,
    );
    if (
      earlierPlatformBuild &&
      earlierPlatformBuild.releaseVersionId !==
        build.releaseVersion._ref
    ) {
      issues.push({
        severity: "error",
        code: "cross-version-build-identity-conflict",
        path,
        message: `${build._id} and ${earlierPlatformBuild.buildId} use the same platform-scoped build number across different versions; review the version identity rather than merging automatically.`,
      });
    } else {
      platformBuilds.set(platformBuildIdentity, {
        buildId: build._id,
        releaseVersionId: build.releaseVersion._ref,
      });
    }
    if (
      build.mergeBasis !== "identical-structured-build-number" ||
      build.reviewRequired !== true
    ) {
      issues.push({
        severity: "error",
        code: "unguarded-build-group",
        path,
        message: `${build._id} does not use the guarded structured-build merge basis.`,
      });
    }

    for (const [referenceIndex, reference] of build.eventRefs.entries()) {
      const event = eventById.get(reference._ref);
      if (!event) {
        issues.push({
          severity: "error",
          code: "missing-build-event",
          path: `${path}.eventRefs[${referenceIndex}]`,
          message: `${build._id} references unknown event ${reference._ref}.`,
        });
        continue;
      }
      if (
        event.releaseVersion._ref !== build.releaseVersion._ref ||
        event.platformId !== build.platformId ||
        !event.structuredBuildNumber ||
        normalizeBuildNumber(event.structuredBuildNumber) !==
          build.normalizedBuildNumber
      ) {
        issues.push({
          severity: "error",
          code: "invalid-build-group",
          path: `${path}.eventRefs[${referenceIndex}]`,
          message: `${event._id} lacks identical explicit build evidence for ${build._id}.`,
        });
      }
    }
  }

  for (const state of plan.versionStates) {
    if (
      state.normalizedReleaseStatus === "released" &&
      !state.publicReleaseDate
    ) {
      issues.push({
        severity: "error",
        code: "released-without-public-date",
        path: `${state.releaseVersionId}.releaseStatus`,
        message: `${state.releaseVersionId} is released without a public date.`,
      });
    }
    if (
      state.normalizedReleaseStatus !== "released" &&
      state.publicReleaseDate
    ) {
      issues.push({
        severity: "error",
        code: "unreleased-with-public-date",
        path: `${state.releaseVersionId}.releaseStatus`,
        message: `${state.releaseVersionId} is ${state.normalizedReleaseStatus} but has a public date.`,
      });
    }
  }

  const planWithoutPlanDigest = {
    formatVersion: plan.formatVersion,
    sourceDigest: plan.sourceDigest,
    summary: plan.summary,
    releaseStatusNormalizations: plan.releaseStatusNormalizations,
    versionStates: plan.versionStates,
    events: plan.events,
    builds: plan.builds,
  };
  const expectedPlanDigest = sha256(
    stableStringify(planWithoutPlanDigest),
  );
  if (expectedPlanDigest !== plan.planDigest) {
    issues.push({
      severity: "error",
      code: "plan-digest-mismatch",
      path: "planDigest",
      message: "The plan digest does not match the plan contents.",
    });
  }

  const expectedSummary: ReleaseEventMigrationSummary = {
    releaseVersions: plan.versionStates.length,
    releaseEvents: plan.events.length,
    releaseBuildCandidates: plan.builds.length,
    reviewCandidates: plan.events.reduce(
      (sum, event) => sum + event.metadataReview.length,
      0,
    ),
    syntheticEventIdentities: plan.events.filter(
      (event) =>
        event.identitySource === "syntheticFingerprint",
    ).length,
    releaseStatusNormalizations:
      plan.releaseStatusNormalizations.length,
  };
  if (
    stableStringify(expectedSummary) !==
    stableStringify(plan.summary)
  ) {
    issues.push({
      severity: "error",
      code: "summary-mismatch",
      path: "summary",
      message: "The migration summary does not match its plan contents.",
    });
  }

  return issues;
}

export function assertValidReleaseEventMigration(
  versions: LegacyReleaseVersion[],
  plan: ReleaseEventMigrationPlan,
): void {
  const issues = [
    ...validateReleaseEventMigrationPlan(plan),
    ...validateLegacyProjection(versions, plan),
  ];
  const errors = issues.filter(
    (issue) => issue.severity === "error",
  );
  if (!errors.length) return;

  throw new Error(
    [
      `Release-event migration validation failed with ${errors.length} error(s):`,
      ...errors.map(
        (issue) =>
          `- [${issue.code}] ${issue.path}: ${issue.message}`,
      ),
    ].join("\n"),
  );
}
