import { createHash } from "node:crypto";
import { stableStringify } from "./release-event-migration";

type UnknownRecord = Record<string, unknown>;
const missingPreviousValue = { _migrationPreviousValue: "missing" };

export interface ChronologyMetadataDocument extends UnknownRecord {
  _id: string;
  _type: "releaseEvent" | "releaseVersion" | "source";
  _rev?: string;
  _createdAt?: string;
}

export interface SourcedTerminalDate {
  releaseVersionId: string;
  date: string;
  sourceIds: string[];
}

export interface ChronologyMetadataPatch {
  id: string;
  ifRevisionId: string;
  set: UnknownRecord;
  /** The exact pre-migration values for every field in set. */
  previousValues: UnknownRecord;
}

export interface ChronologyMetadataPlan {
  formatVersion: 1;
  sourceSnapshotDigest: string;
  terminalDatesDigest: string;
  planDigest: string;
  patches: ChronologyMetadataPatch[];
  unchangedDocumentIds: string[];
  skippedSupersededWithoutSourcedTerminalDateIds: string[];
  summary: {
    releaseEvents: number;
    releaseVersions: number;
    patches: number;
    unchanged: number;
    firstObservedAtDefaults: number;
    chronologyCoverageDefaults: number;
    releasedStatusEffectiveDates: number;
    supersededStatusEffectiveDates: number;
    supersededEvidenceCitationsAdded: number;
    skippedSupersededWithoutSourcedTerminalDate: number;
  };
}

export interface ChronologyMetadataRollback {
  artifactType: "sanity-chronology-metadata-rollback";
  formatVersion: 1;
  planDigest: string;
  sourceSnapshotDigest: string;
  restorePatches: Array<{
    id: string;
    plannedFromRevision: string;
    set: UnknownRecord;
    unset: string[];
  }>;
  instructions: string[];
  rollbackDigest: string;
}

export interface ChronologyMetadataPlanResult {
  plan: ChronologyMetadataPlan;
  rollback: ChronologyMetadataRollback;
}

function isRecord(value: unknown): value is UnknownRecord {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function stringValue(value: unknown): string | undefined {
  return typeof value === "string" && value.trim() ? value.trim() : undefined;
}

function cloneJson<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

function sha256(value: string): string {
  return createHash("sha256").update(value).digest("hex");
}

function compareText(left: string, right: string): -1 | 0 | 1 {
  return left < right ? -1 : left > right ? 1 : 0;
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

function isCreatedAt(value: string): boolean {
  return (
    /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{1,3})?Z$/.test(
      value,
    ) && !Number.isNaN(Date.parse(value))
  );
}

export function extractChronologyMetadataDocuments(
  snapshotInput: unknown,
): ChronologyMetadataDocument[] {
  const input = isRecord(snapshotInput) ? snapshotInput : undefined;
  const candidates = Array.isArray(snapshotInput)
    ? snapshotInput
    : input && Array.isArray(input.documents)
      ? input.documents
      : input && Array.isArray(input.result)
        ? input.result
        : [];
  const records = candidates.filter(isRecord);
  const draft = records.find((document) =>
    stringValue(document._id)?.startsWith("drafts."),
  );
  if (draft) {
    throw new Error(
      `Snapshot contains draft ${String(draft._id)}. Export published documents only.`,
    );
  }
  const documents = records.filter((document) =>
    ["releaseEvent", "releaseVersion", "source"].includes(
      String(document._type || ""),
    ),
  );
  const seen = new Set<string>();
  const normalized = documents.map((document, index) => {
    const id = stringValue(document._id);
    const type = document._type;
    if (!id || !["releaseEvent", "releaseVersion", "source"].includes(String(type))) {
      throw new Error(`Chronology snapshot document ${index} has invalid identity.`);
    }
    if (seen.has(id)) {
      throw new Error(`Chronology snapshot repeats document ID ${id}.`);
    }
    seen.add(id);
    return cloneJson(document) as ChronologyMetadataDocument;
  });
  return normalized.sort((left, right) => compareText(left._id, right._id));
}

export function parseSourcedTerminalDates(input: unknown): SourcedTerminalDate[] {
  let values: unknown[];
  if (Array.isArray(input)) {
    values = input;
  } else if (isRecord(input) && Array.isArray(input.terminalDates)) {
    values = input.terminalDates;
  } else {
    throw new Error(
      "Terminal-date input must be an array or an object with a terminalDates array.",
    );
  }
  const byVersion = new Map<string, SourcedTerminalDate>();
  for (const [index, value] of values.entries()) {
    if (!isRecord(value)) {
      throw new Error(`Terminal date entry ${index} is not an object.`);
    }
    const releaseVersionId = stringValue(value.releaseVersionId);
    const date = stringValue(value.date);
    const sourceIds = Array.isArray(value.sourceIds)
      ? value.sourceIds.map(stringValue).filter((id): id is string => Boolean(id))
      : [];
    if (!releaseVersionId || !date || !isIsoDate(date) || !sourceIds.length) {
      throw new Error(
        `Terminal date entry ${index} requires releaseVersionId, an ISO date, and one or more sourceIds.`,
      );
    }
    if (sourceIds.length !== new Set(sourceIds).size) {
      throw new Error(`Terminal date entry ${index} repeats a source ID.`);
    }
    if (byVersion.has(releaseVersionId)) {
      throw new Error(`Terminal dates repeat release version ${releaseVersionId}.`);
    }
    byVersion.set(releaseVersionId, {
      releaseVersionId,
      date,
      sourceIds: [...sourceIds].sort(compareText),
    });
  }
  return [...byVersion.values()].sort((left, right) =>
    compareText(left.releaseVersionId, right.releaseVersionId),
  );
}

function requireRevision(document: ChronologyMetadataDocument): string {
  const revision = stringValue(document._rev);
  if (!revision) {
    throw new Error(`${document._id} needs _rev for a revision-guarded patch.`);
  }
  return revision;
}

function defaultCoverage(document: ChronologyMetadataDocument, set: UnknownRecord): boolean {
  if (document.chronologyCoverage === undefined) {
    set.chronologyCoverage = { status: "unknown" };
    return true;
  }
  return false;
}

function isMissingPreviousValue(value: unknown): boolean {
  return (
    isRecord(value) &&
    value._migrationPreviousValue === "missing" &&
    Object.keys(value).length === 1
  );
}

function rollbackPatchFor(patch: ChronologyMetadataPatch) {
  const set: UnknownRecord = {};
  const unset: string[] = [];
  for (const field of Object.keys(patch.previousValues).sort(compareText)) {
    const value = patch.previousValues[field];
    if (isMissingPreviousValue(value)) {
      unset.push(field);
    } else {
      set[field] = cloneJson(value);
    }
  }
  return {
    id: patch.id,
    plannedFromRevision: patch.ifRevisionId,
    set,
    unset,
  };
}

function citationSourceIds(document: ChronologyMetadataDocument): Set<string> {
  if (document.citations === undefined) return new Set();
  if (!Array.isArray(document.citations)) {
    throw new Error(`${document._id} has citations that are not an array.`);
  }
  return new Set(
    document.citations
      .filter(isRecord)
      .map((citation) =>
        isRecord(citation.source) ? stringValue(citation.source._ref) : undefined,
      )
      .filter((sourceId): sourceId is string => Boolean(sourceId)),
  );
}

function citationsWithTerminalEvidence(
  document: ChronologyMetadataDocument,
  terminalDate: SourcedTerminalDate,
): UnknownRecord[] | undefined {
  const existing = document.citations === undefined
    ? []
    : cloneJson(document.citations as UnknownRecord[]);
  const existingSourceIds = citationSourceIds(document);
  const missingSourceIds = terminalDate.sourceIds.filter(
    (sourceId) => !existingSourceIds.has(sourceId),
  );
  if (!missingSourceIds.length) return undefined;

  return [
    ...existing,
    ...missingSourceIds.map((sourceId) => ({
      _key: `terminal-${sha256(`${document._id}|${terminalDate.date}|${sourceId}`).slice(0, 20)}`,
      _type: "citation",
      source: { _type: "reference", _ref: sourceId },
      note: "Supports the recorded terminal lifecycle date.",
    })),
  ];
}

function buildRollback(plan: ChronologyMetadataPlan): ChronologyMetadataRollback {
  const withoutDigest = {
    artifactType: "sanity-chronology-metadata-rollback" as const,
    formatVersion: 1 as const,
    planDigest: plan.planDigest,
    sourceSnapshotDigest: plan.sourceSnapshotDigest,
    restorePatches: plan.patches.map(rollbackPatchFor),
    instructions: [
      "This artifact never performs rollback writes by itself.",
      "Before any recovery, fetch current published documents and require their post-apply revisions.",
      "For each restore patch, set only its set fields and unset only its unset fields after adding a current post-apply revision guard.",
      "Never write the migration missing-value sentinel or submit historical _rev, _createdAt, or _updatedAt fields.",
    ],
  };
  return {
    ...withoutDigest,
    rollbackDigest: sha256(stableStringify(withoutDigest)),
  };
}

/**
 * Creates an offline, non-executable patch plan. It deliberately has no
 * Sanity client and never derives terminal dates from lifecycle status,
 * milestone labels, timestamps, or any other unsourced heuristic.
 */
export function buildChronologyMetadataPlan(
  snapshotInput: unknown,
  terminalDatesInput: unknown = [],
): ChronologyMetadataPlanResult {
  const documents = extractChronologyMetadataDocuments(snapshotInput);
  const sourceIds = new Set(
    documents.filter((document) => document._type === "source").map((document) => document._id),
  );
  const terminalDates = parseSourcedTerminalDates(terminalDatesInput);
  const terminalDateByVersion = new Map(
    terminalDates.map((terminalDate) => [terminalDate.releaseVersionId, terminalDate]),
  );
  const releaseVersionById = new Map(
    documents
      .filter((document) => document._type === "releaseVersion")
      .map((document) => [document._id, document]),
  );
  for (const terminalDate of terminalDates) {
    if (terminalDate.sourceIds.some((sourceId) => !sourceIds.has(sourceId))) {
      throw new Error(
        `${terminalDate.releaseVersionId} has a terminal date without a source document in this local snapshot.`,
      );
    }
    const target = releaseVersionById.get(terminalDate.releaseVersionId);
    if (!target) {
      throw new Error(
        `${terminalDate.releaseVersionId} is not a releaseVersion in this local snapshot.`,
      );
    }
    if (stringValue(target.releaseStatus) !== "superseded") {
      throw new Error(
        `${terminalDate.releaseVersionId} is not an explicitly superseded release version.`,
      );
    }
  }

  const patches: ChronologyMetadataPatch[] = [];
  const unchangedDocumentIds: string[] = [];
  const skippedSupersededWithoutSourcedTerminalDateIds: string[] = [];
  let firstObservedAtDefaults = 0;
  let chronologyCoverageDefaults = 0;
  let releasedStatusEffectiveDates = 0;
  let supersededStatusEffectiveDates = 0;
  let supersededEvidenceCitationsAdded = 0;

  for (const document of documents) {
    if (document._type === "source") continue;
    const set: UnknownRecord = {};

    if (document._type === "releaseEvent") {
      if (document.firstObservedAt === undefined) {
        const createdAt = stringValue(document._createdAt);
        if (!createdAt || !isCreatedAt(createdAt)) {
          throw new Error(
            `${document._id} needs a valid Sanity _createdAt to conservatively default firstObservedAt.`,
          );
        }
        set.firstObservedAt = createdAt;
        firstObservedAtDefaults += 1;
      }
    } else {
      if (defaultCoverage(document, set)) chronologyCoverageDefaults += 1;
      const explicitReleaseStatus = stringValue(document.releaseStatus);
      if (
        explicitReleaseStatus &&
        !["active", "released", "superseded"].includes(explicitReleaseStatus)
      ) {
        throw new Error(
          `${document._id} has unsupported releaseStatus ${explicitReleaseStatus}.`,
        );
      }
      const publicReleaseDate = stringValue(document.publicReleaseDate);
      const releaseStatus =
        explicitReleaseStatus || (publicReleaseDate ? "released" : "active");
      if (document.statusEffectiveDate === undefined && releaseStatus === "released") {
        if (!publicReleaseDate || !isIsoDate(publicReleaseDate)) {
          throw new Error(
            `${document._id} is released but lacks a valid publicReleaseDate.`,
          );
        }
        if (publicReleaseDate && isIsoDate(publicReleaseDate)) {
          set.statusEffectiveDate = publicReleaseDate;
          releasedStatusEffectiveDates += 1;
        }
      }
      if (releaseStatus === "superseded") {
        const terminalDate = terminalDateByVersion.get(document._id);
        if (terminalDate) {
          const existingStatusEffectiveDate = stringValue(
            document.statusEffectiveDate,
          );
          if (
            existingStatusEffectiveDate &&
            existingStatusEffectiveDate !== terminalDate.date
          ) {
            throw new Error(
              `${document._id} statusEffectiveDate conflicts with its sourced terminal date.`,
            );
          }
          if (!existingStatusEffectiveDate) {
            set.statusEffectiveDate = terminalDate.date;
            supersededStatusEffectiveDates += 1;
          }
          const citations = citationsWithTerminalEvidence(
            document,
            terminalDate,
          );
          if (citations) {
            set.citations = citations;
            supersededEvidenceCitationsAdded +=
              citations.length -
              (Array.isArray(document.citations)
                ? document.citations.length
                : 0);
          }
        } else {
          skippedSupersededWithoutSourcedTerminalDateIds.push(document._id);
        }
      }
    }
    if (Object.keys(set).length === 0) {
      unchangedDocumentIds.push(document._id);
      continue;
    }
    const previousValues = Object.fromEntries(
      Object.keys(set).sort(compareText).map((field) => [
        field,
        Object.hasOwn(document, field)
          ? cloneJson(document[field])
          : cloneJson(missingPreviousValue),
      ]),
    );
    patches.push({
      id: document._id,
      ifRevisionId: requireRevision(document),
      set: cloneJson(set),
      previousValues,
    });
  }

  patches.sort((left, right) => compareText(left.id, right.id));
  unchangedDocumentIds.sort(compareText);
  skippedSupersededWithoutSourcedTerminalDateIds.sort(compareText);
  const sourceSnapshotDigest = sha256(stableStringify(documents));
  const terminalDatesDigest = sha256(stableStringify(terminalDates));
  const summary = {
    releaseEvents: documents.filter((document) => document._type === "releaseEvent").length,
    releaseVersions: documents.filter((document) => document._type === "releaseVersion").length,
    patches: patches.length,
    unchanged: unchangedDocumentIds.length,
    firstObservedAtDefaults,
    chronologyCoverageDefaults,
    releasedStatusEffectiveDates,
    supersededStatusEffectiveDates,
    supersededEvidenceCitationsAdded,
    skippedSupersededWithoutSourcedTerminalDate: skippedSupersededWithoutSourcedTerminalDateIds.length,
  };
  const withoutDigest = {
    formatVersion: 1 as const,
    sourceSnapshotDigest,
    terminalDatesDigest,
    patches,
    unchangedDocumentIds,
    skippedSupersededWithoutSourcedTerminalDateIds,
    summary,
  };
  const plan: ChronologyMetadataPlan = {
    ...withoutDigest,
    planDigest: sha256(stableStringify(withoutDigest)),
  };
  const rollback = buildRollback(plan);
  assertValidChronologyMetadataPlan(plan, rollback);
  return { plan, rollback };
}

export function validateChronologyMetadataPlan(
  plan: ChronologyMetadataPlan,
  rollback: ChronologyMetadataRollback,
): string[] {
  const failures: string[] = [];
  const withoutDigest = {
    formatVersion: plan.formatVersion,
    sourceSnapshotDigest: plan.sourceSnapshotDigest,
    terminalDatesDigest: plan.terminalDatesDigest,
    patches: plan.patches,
    unchangedDocumentIds: plan.unchangedDocumentIds,
    skippedSupersededWithoutSourcedTerminalDateIds:
      plan.skippedSupersededWithoutSourcedTerminalDateIds,
    summary: plan.summary,
  };
  if (plan.planDigest !== sha256(stableStringify(withoutDigest))) {
    failures.push("planDigest does not match the local mutation plan");
  }
  if (
    plan.patches.some(
      (patch) =>
        !patch.ifRevisionId ||
        Object.keys(patch.set).length === 0 ||
        Object.keys(patch.set).some((field) =>
          ["_id", "_type", "_rev", "_createdAt", "_updatedAt"].includes(field),
        ) ||
        stableStringify(Object.keys(patch.set).sort(compareText)) !==
          stableStringify(Object.keys(patch.previousValues).sort(compareText)),
    )
  ) {
    failures.push("patches must be revision-guarded overlays with matching previous values");
  }
  if (new Set(plan.patches.map((patch) => patch.id)).size !== plan.patches.length) {
    failures.push("patch IDs are not unique");
  }
  if (plan.summary.patches !== plan.patches.length) {
    failures.push("summary patch count does not match patches");
  }
  const rollbackWithoutDigest = {
    artifactType: rollback.artifactType,
    formatVersion: rollback.formatVersion,
    planDigest: rollback.planDigest,
    sourceSnapshotDigest: rollback.sourceSnapshotDigest,
    restorePatches: rollback.restorePatches,
    instructions: rollback.instructions,
  };
  const expectedRestorePatches = plan.patches.map(rollbackPatchFor);
  if (
    rollback.artifactType !== "sanity-chronology-metadata-rollback" ||
    rollback.planDigest !== plan.planDigest ||
    rollback.sourceSnapshotDigest !== plan.sourceSnapshotDigest ||
    stableStringify(rollback.restorePatches) !==
      stableStringify(expectedRestorePatches) ||
    rollback.rollbackDigest !== sha256(stableStringify(rollbackWithoutDigest))
  ) {
    failures.push("rollback artifact does not cover the exact plan");
  }
  return failures;
}

export function assertValidChronologyMetadataPlan(
  plan: ChronologyMetadataPlan,
  rollback: ChronologyMetadataRollback,
): void {
  const failures = validateChronologyMetadataPlan(plan, rollback);
  if (failures.length) {
    throw new Error(`Chronology metadata plan is invalid:\n${failures.map((failure) => `- ${failure}`).join("\n")}`);
  }
}

/** Applies only to an in-memory snapshot for fixture tests and no-op proofs. */
export function applyChronologyMetadataPlanToSnapshotForTest(
  snapshotInput: unknown,
  plan: ChronologyMetadataPlan,
): ChronologyMetadataDocument[] {
  const documents = extractChronologyMetadataDocuments(snapshotInput);
  const byId = new Map(documents.map((document) => [document._id, cloneJson(document)]));
  for (const patch of plan.patches) {
    const document = byId.get(patch.id);
    if (!document || document._rev !== patch.ifRevisionId) {
      throw new Error(`Fixture snapshot revision mismatch for ${patch.id}.`);
    }
    Object.assign(document, cloneJson(patch.set));
  }
  return [...byId.values()].sort((left, right) =>
    compareText(left._id, right._id),
  );
}
