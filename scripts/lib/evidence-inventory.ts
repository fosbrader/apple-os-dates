import { createHash } from "node:crypto";
import {
  buildReleaseEventMigrationPlan,
  extractLegacyReleaseVersions,
  stableStringify,
  type LegacyReleaseVersion,
} from "./release-event-migration";

const DEFAULT_BATCH_SIZE = 12;

export type EvidenceCoverage = "linked" | "missing" | "conflict";

export interface ObservedDate {
  state: "observed" | "unknown" | "conflict";
  value?: string;
  values?: string[];
  reason?: "not-present-in-local-seed";
}

export interface InventoryEvidenceSource {
  evidenceId: string;
  url: string;
  observedLabels: string[];
  sourceDate: ObservedDate;
  accessDate: ObservedDate;
  linkedRecordIds: string[];
  coverage: "observed" | "conflict";
  conflictIds: string[];
}

export interface InventoryEventRecord {
  recordId: string;
  candidateDocumentId: string;
  releaseVersionId: string;
  platformId: string;
  platform: string;
  version: string;
  label: string;
  appearanceDate: string;
  channel: string;
  legacySequence: number;
  identitySource: "liveMilestoneKey" | "syntheticFingerprint";
  evidenceIds: string[];
  sourceCoverage: EvidenceCoverage;
  quarantineReasons: string[];
}

export interface InventoryVersionRecord {
  recordId: string;
  platformId: string;
  platform: string;
  version: string;
  eventRecordIds: string[];
  evidenceIds: string[];
  sourceCoverage: EvidenceCoverage;
  quarantineReasons: string[];
}

export interface EvidenceConflict {
  conflictId: string;
  kind:
    | "appearance-date-disagreement"
    | "identity-disagreement"
    | "source-date-disagreement"
    | "access-date-disagreement";
  recordIds: string[];
  observedValues: string[];
  evidenceIds: string[];
  resolution: "quarantined";
}

export interface ResearchBatch {
  batchId: string;
  platform: string;
  majorVersion: number;
  targetRecordIds: string[];
  releaseVersionIds: string[];
  maximumTargetCount: number;
  evidenceRequirements: string[];
  quarantineReasons: string[];
}

export interface EvidenceInventory {
  formatVersion: 1;
  input: {
    path: "scripts/seed-data.json";
    sourceDigest: string;
    migrationPlanDigest: string;
    mode: "offline-legacy-seed";
  };
  counts: {
    releaseVersions: number;
    legacyMilestones: number;
    eventRecords: number;
    sources: number;
    linkedEvents: number;
    missingEvents: number;
    conflictingEvents: number;
    quarantinedEvents: number;
    quarantinedVersions: number;
    conflicts: number;
  };
  sourceEvidence: InventoryEvidenceSource[];
  releaseVersions: InventoryVersionRecord[];
  releaseEvents: InventoryEventRecord[];
  conflicts: EvidenceConflict[];
  quarantinedRecordIds: string[];
}

export interface ResearchBatchManifest {
  formatVersion: 1;
  inventoryDigest: string;
  maximumTargetCount: number;
  counts: {
    batches: number;
    targetRecords: number;
    missingEvidenceTargets: number;
    conflictingEvidenceTargets: number;
  };
  batches: ResearchBatch[];
}

export interface EvidenceInventoryArtifacts {
  inventory: EvidenceInventory;
  manifest: ResearchBatchManifest;
}

interface MutableSource {
  evidenceId: string;
  url: string;
  labels: Set<string>;
  linkedRecordIds: Set<string>;
  sourceDates: Set<string>;
  accessDates: Set<string>;
}

function compareCodeUnits(left: string, right: string): number {
  return left < right ? -1 : left > right ? 1 : 0;
}

function sha256(value: string): string {
  return createHash("sha256").update(value).digest("hex");
}

function evidenceId(url: string): string {
  return `evidence-source-${sha256(url).slice(0, 24)}`;
}

function recordReference(kind: "event" | "version", id: string): string {
  return `${kind}:${id}`;
}

function dateObservation(values: Set<string>): ObservedDate {
  const dates = [...values].sort(compareCodeUnits);
  if (!dates.length) return { state: "unknown", reason: "not-present-in-local-seed" };
  if (dates.length > 1) return { state: "conflict", values: dates };
  return { state: "observed", value: dates[0] };
}

function addSource(
  sources: Map<string, MutableSource>,
  url: string | undefined,
  label: string | undefined,
  recordId: string,
  sourceDates: string[] = [],
  accessDates: string[] = [],
): string | undefined {
  if (!url) return undefined;
  const id = evidenceId(url);
  const existing = sources.get(url) || {
    evidenceId: id,
    url,
    labels: new Set<string>(),
    linkedRecordIds: new Set<string>(),
    sourceDates: new Set<string>(),
    accessDates: new Set<string>(),
  };
  if (label?.trim()) existing.labels.add(label.trim());
  for (const sourceDate of sourceDates) if (sourceDate.trim()) existing.sourceDates.add(sourceDate.trim());
  for (const accessDate of accessDates) if (accessDate.trim()) existing.accessDates.add(accessDate.trim());
  existing.linkedRecordIds.add(recordId);
  sources.set(url, existing);
  return id;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function sourceMetadataByUrl(input: unknown): Map<string, { sourceDates: string[]; accessDates: string[] }> {
  const documents = Array.isArray(input)
    ? input
    : isRecord(input) && Array.isArray(input.releaseVersions)
      ? input.releaseVersions
      : isRecord(input) && Array.isArray(input.documents)
        ? input.documents
        : isRecord(input) && Array.isArray(input.result)
          ? input.result
          : [];
  const metadata = new Map<string, { sourceDates: Set<string>; accessDates: Set<string> }>();
  const add = (value: Record<string, unknown>) => {
    const url = stringValue(value.sourceUrl) || stringValue(value.releaseNotesUrl);
    if (!url) return;
    const entry = metadata.get(url) || { sourceDates: new Set<string>(), accessDates: new Set<string>() };
    const sourceDate = stringValue(value.sourcePublishedAt) || stringValue(value.sourcePublishedDate);
    const accessDate = stringValue(value.sourceAccessedAt);
    if (sourceDate) entry.sourceDates.add(sourceDate);
    if (accessDate) entry.accessDates.add(accessDate);
    metadata.set(url, entry);
  };
  for (const document of documents) {
    if (!isRecord(document)) continue;
    add(document);
    if (Array.isArray(document.milestones)) {
      for (const milestone of document.milestones) if (isRecord(milestone)) add(milestone);
    }
  }
  return new Map([...metadata].map(([url, value]) => [url, {
    sourceDates: [...value.sourceDates].sort(compareCodeUnits),
    accessDates: [...value.accessDates].sort(compareCodeUnits),
  }]));
}

function releaseNotesUrlsByVersion(input: unknown): Map<string, string> {
  const documents = isRecord(input) && Array.isArray(input.releaseVersions)
    ? input.releaseVersions
    : isRecord(input) && Array.isArray(input.documents)
      ? input.documents
      : isRecord(input) && Array.isArray(input.result)
        ? input.result
        : Array.isArray(input) ? input : [];
  const result = new Map<string, string>();
  for (const document of documents) {
    if (!isRecord(document)) continue;
    const platform = stringValue(document.platform);
    const version = stringValue(document.version);
    const url = stringValue(document.releaseNotesUrl);
    if (platform && version && url) result.set(`${platform}\0${version}`, url);
  }
  return result;
}

function explicitConflicts(input: unknown): Array<{
  recordId: string;
  kind: Extract<EvidenceConflict["kind"], "appearance-date-disagreement" | "identity-disagreement">;
  observedValues: string[];
  evidenceUrls: string[];
}> {
  if (!isRecord(input) || input.evidenceInventoryConflicts === undefined) return [];
  if (!Array.isArray(input.evidenceInventoryConflicts)) {
    throw new Error("evidenceInventoryConflicts must be an array when supplied.");
  }
  return input.evidenceInventoryConflicts.map((value, index) => {
    if (!isRecord(value)) throw new Error(`evidenceInventoryConflicts[${index}] must be an object.`);
    const recordId = stringValue(value.recordId);
    const field = stringValue(value.field);
    const observedValues = Array.isArray(value.observedValues)
      ? value.observedValues.map(stringValue).filter((item): item is string => Boolean(item))
      : [];
    const evidenceUrls = Array.isArray(value.evidenceUrls)
      ? value.evidenceUrls.map(stringValue).filter((item): item is string => Boolean(item))
      : [];
    if (!recordId || observedValues.length < 2 || evidenceUrls.length < 1 || !["appearanceDate", "identity"].includes(field || "")) {
      throw new Error(`evidenceInventoryConflicts[${index}] requires an exact recordId, two observed values, one or more linked source URLs, and appearanceDate or identity field.`);
    }
    return {
      recordId,
      kind: field === "appearanceDate" ? "appearance-date-disagreement" : "identity-disagreement",
      observedValues: [...new Set(observedValues)].sort(compareCodeUnits),
      evidenceUrls: [...new Set(evidenceUrls)].sort(compareCodeUnits),
    };
  });
}

function coverageFor(
  ids: string[],
  conflictEvidenceIds: Set<string>,
  recordHasConflict = false,
): EvidenceCoverage {
  if (recordHasConflict || ids.some((id) => conflictEvidenceIds.has(id))) return "conflict";
  return ids.length ? "linked" : "missing";
}

function quarantineReasons(coverage: EvidenceCoverage): string[] {
  if (coverage === "missing") return ["missing-observed-source-link"];
  if (coverage === "conflict") return ["conflicting-observed-chronology-evidence"];
  return [];
}

function majorVersion(version: string): number {
  const result = Number.parseInt(version.split(".")[0] || "", 10);
  if (!Number.isSafeInteger(result)) {
    throw new Error(`Cannot derive a major version from ${version}.`);
  }
  return result;
}

function eventSort(left: InventoryEventRecord, right: InventoryEventRecord): number {
  return (
    compareCodeUnits(left.platform, right.platform) ||
    majorVersion(left.version) - majorVersion(right.version) ||
    compareCodeUnits(left.appearanceDate, right.appearanceDate) ||
    compareCodeUnits(left.recordId, right.recordId)
  );
}

function versionSort(left: InventoryVersionRecord, right: InventoryVersionRecord): number {
  return compareCodeUnits(left.recordId, right.recordId);
}

function sourceSort(left: InventoryEvidenceSource, right: InventoryEvidenceSource): number {
  return compareCodeUnits(left.evidenceId, right.evidenceId);
}

function buildBatches(
  events: InventoryEventRecord[],
  inventoryDigest: string,
  maximumTargetCount: number,
): ResearchBatchManifest {
  const targets = events
    .filter((event) => event.sourceCoverage !== "linked")
    .sort(eventSort);
  const groups = new Map<string, InventoryEventRecord[]>();
  for (const event of targets) {
    const key = `${event.platform}\0${majorVersion(event.version)}`;
    const group = groups.get(key) || [];
    group.push(event);
    groups.set(key, group);
  }

  const batches: ResearchBatch[] = [];
  for (const [groupKey, group] of [...groups.entries()].sort(([left], [right]) => compareCodeUnits(left, right))) {
    const [platform, rawMajorVersion] = groupKey.split("\0");
    for (let offset = 0; offset < group.length; offset += maximumTargetCount) {
      const slice = group.slice(offset, offset + maximumTargetCount);
      const ordinal = Math.floor(offset / maximumTargetCount) + 1;
      batches.push({
        batchId: `apple-${platform.toLowerCase()}-${rawMajorVersion}-${String(ordinal).padStart(2, "0")}`,
        platform,
        majorVersion: Number(rawMajorVersion),
        targetRecordIds: slice.map((event) => event.recordId),
        releaseVersionIds: [...new Set(slice.map((event) => event.releaseVersionId))].sort(compareCodeUnits),
        maximumTargetCount,
        evidenceRequirements: [
          "Directly support the exact release appearance identity and appearance date.",
          "Link every factual chronology claim to a retained source URL and stable evidence ID.",
          "Record a source access date only when it is observed during research; do not infer one from this inventory.",
          "Keep unresolved identity or source conflicts quarantined; do not change chronology from this batch.",
        ],
        quarantineReasons: [...new Set(slice.flatMap((event) => event.quarantineReasons))].sort(compareCodeUnits),
      });
    }
  }

  return {
    formatVersion: 1,
    inventoryDigest,
    maximumTargetCount,
    counts: {
      batches: batches.length,
      targetRecords: targets.length,
      missingEvidenceTargets: targets.filter((event) => event.sourceCoverage === "missing").length,
      conflictingEvidenceTargets: targets.filter((event) => event.sourceCoverage === "conflict").length,
    },
    batches,
  };
}

export function buildEvidenceInventory(
  input: unknown,
  maximumTargetCount = DEFAULT_BATCH_SIZE,
): EvidenceInventoryArtifacts {
  if (!Number.isInteger(maximumTargetCount) || maximumTargetCount < 1 || maximumTargetCount > 20) {
    throw new Error("maximumTargetCount must be an integer from 1 through 20.");
  }

  const versions = extractLegacyReleaseVersions(input);
  const plan = buildReleaseEventMigrationPlan(versions);
  const sources = new Map<string, MutableSource>();
  const sourceMetadata = sourceMetadataByUrl(input);
  const releaseNotesUrls = releaseNotesUrlsByVersion(input);
  const versionEvidenceIds = new Map<string, string[]>();

  for (const version of versions) {
    const versionReference = recordReference("version", version._id);
    const evidenceIds: string[] = [];
    const releaseNotesUrl = releaseNotesUrls.get(`${version.platform}\0${version.version}`);
    const releaseNotesMetadata = releaseNotesUrl ? sourceMetadata.get(releaseNotesUrl) : undefined;
    const releaseNotesEvidence = addSource(
      sources,
      releaseNotesUrl,
      undefined,
      versionReference,
      releaseNotesMetadata?.sourceDates,
      releaseNotesMetadata?.accessDates,
    );
    if (releaseNotesEvidence) evidenceIds.push(releaseNotesEvidence);
    versionEvidenceIds.set(version._id, evidenceIds);
  }

  const rawEventEvidenceIds = new Map<string, string[]>();
  for (const event of plan.events) {
    const eventReference = recordReference("event", event.stableEventId);
    const metadata = event.sourceUrl ? sourceMetadata.get(event.sourceUrl) : undefined;
    const sourceId = addSource(
      sources,
      event.sourceUrl,
      event.sourceLabel,
      eventReference,
      metadata?.sourceDates,
      metadata?.accessDates,
    );
    rawEventEvidenceIds.set(event.stableEventId, sourceId ? [sourceId] : []);
    if (sourceId) {
      const versionIds = versionEvidenceIds.get(event.releaseVersion._ref) || [];
      versionEvidenceIds.set(event.releaseVersion._ref, [...new Set([...versionIds, sourceId])]);
    }
  }

  const knownRecordIds = new Set(plan.events.map((event) => event.stableEventId));
  const sourceByEvidenceId = new Map(
    [...sources.values()].map((source) => [source.evidenceId, source]),
  );
  const conflicts: EvidenceConflict[] = explicitConflicts(input).map((conflict) => {
    if (!knownRecordIds.has(conflict.recordId)) {
      throw new Error(`Evidence conflict targets unknown event record ${conflict.recordId}.`);
    }
    const evidenceIds = conflict.evidenceUrls.map(evidenceId);
    if (evidenceIds.some((id) => !sourceByEvidenceId.has(id))) {
      throw new Error(`Evidence conflict for ${conflict.recordId} references a source URL absent from the local seed.`);
    }
    if (evidenceIds.some((id) => !sourceByEvidenceId.get(id)?.linkedRecordIds.has(recordReference("event", conflict.recordId)))) {
      throw new Error(`Evidence conflict for ${conflict.recordId} references a source URL not linked to that exact event record.`);
    }
    return {
      conflictId: `conflict-${sha256(stableStringify(conflict)).slice(0, 24)}`,
      kind: conflict.kind,
      recordIds: [recordReference("event", conflict.recordId)],
      observedValues: conflict.observedValues,
      evidenceIds,
      resolution: "quarantined" as const,
    };
  });
  for (const source of sources.values()) {
    const metadataConflicts: Array<[EvidenceConflict["kind"], Set<string>]> = [
      ["source-date-disagreement", source.sourceDates],
      ["access-date-disagreement", source.accessDates],
    ];
    for (const [kind, values] of metadataConflicts) {
      const observedValues = [...values].sort(compareCodeUnits);
      if (observedValues.length < 2) continue;
      conflicts.push({
        conflictId: `conflict-${sha256(`${source.evidenceId}\0${kind}\0${observedValues.join("\0")}`).slice(0, 24)}`,
        kind,
        recordIds: [...source.linkedRecordIds].sort(compareCodeUnits),
        observedValues,
        evidenceIds: [source.evidenceId],
        resolution: "quarantined",
      });
    }
  }
  const metadataConflictEvidenceIds = new Set(
    conflicts
      .filter((conflict) =>
        conflict.kind === "source-date-disagreement" ||
        conflict.kind === "access-date-disagreement",
      )
      .flatMap((conflict) => conflict.evidenceIds),
  );
  const conflictEventRecordIds = new Set(
    conflicts
      .flatMap((conflict) => conflict.recordIds)
      .filter((recordId) => recordId.startsWith("event:"))
      .map((recordId) => recordId.slice("event:".length)),
  );
  conflicts.sort((left, right) => compareCodeUnits(left.conflictId, right.conflictId));

  const sourceEvidence = [...sources.values()]
    .map((source): InventoryEvidenceSource => ({
      evidenceId: source.evidenceId,
      url: source.url,
      observedLabels: [...source.labels].sort(compareCodeUnits),
      sourceDate: dateObservation(source.sourceDates),
      accessDate: dateObservation(source.accessDates),
      linkedRecordIds: [...source.linkedRecordIds].sort(compareCodeUnits),
      coverage: metadataConflictEvidenceIds.has(source.evidenceId) ? "conflict" : "observed",
      conflictIds: conflicts
        .filter((conflict) => conflict.evidenceIds.includes(source.evidenceId))
        .map((conflict) => conflict.conflictId),
    }))
    .sort(sourceSort);

  const releaseEvents = plan.events.map((event): InventoryEventRecord => {
    const evidenceIds = rawEventEvidenceIds.get(event.stableEventId) || [];
    const sourceCoverage = coverageFor(evidenceIds, metadataConflictEvidenceIds, conflictEventRecordIds.has(event.stableEventId));
    return {
      recordId: event.stableEventId,
      candidateDocumentId: event._id,
      releaseVersionId: event.releaseVersion._ref,
      platformId: event.platformId,
      platform: event.platform,
      version: event.version,
      label: event.label,
      appearanceDate: event.date,
      channel: event.channel,
      legacySequence: event.legacySequence,
      identitySource: event.identitySource,
      evidenceIds,
      sourceCoverage,
      quarantineReasons: quarantineReasons(sourceCoverage),
    };
  }).sort(eventSort);

  const releaseVersions = versions.map((version): InventoryVersionRecord => {
    const evidenceIds = [...new Set(versionEvidenceIds.get(version._id) || [])].sort(compareCodeUnits);
    const sourceCoverage = coverageFor(evidenceIds, metadataConflictEvidenceIds);
    return {
      recordId: version._id,
      platformId: version.platformId,
      platform: version.platform,
      version: version.version,
      eventRecordIds: plan.events
        .filter((event) => event.releaseVersion._ref === version._id)
        .map((event) => event.stableEventId)
        .sort(compareCodeUnits),
      evidenceIds,
      sourceCoverage,
      quarantineReasons: quarantineReasons(sourceCoverage),
    };
  }).sort(versionSort);

  const inventoryWithoutManifest: EvidenceInventory = {
    formatVersion: 1,
    input: {
      path: "scripts/seed-data.json",
      sourceDigest: plan.sourceDigest,
      migrationPlanDigest: plan.planDigest,
      mode: "offline-legacy-seed",
    },
    counts: {
      releaseVersions: versions.length,
      legacyMilestones: versions.reduce((total, version) => total + version.milestones.length, 0),
      eventRecords: releaseEvents.length,
      sources: sourceEvidence.length,
      linkedEvents: releaseEvents.filter((event) => event.sourceCoverage === "linked").length,
      missingEvents: releaseEvents.filter((event) => event.sourceCoverage === "missing").length,
      conflictingEvents: releaseEvents.filter((event) => event.sourceCoverage === "conflict").length,
      quarantinedEvents: releaseEvents.filter((event) => event.quarantineReasons.length > 0).length,
      quarantinedVersions: releaseVersions.filter((version) => version.quarantineReasons.length > 0).length,
      conflicts: conflicts.length,
    },
    sourceEvidence,
    releaseVersions,
    releaseEvents,
    conflicts,
    quarantinedRecordIds: releaseEvents
      .filter((event) => event.quarantineReasons.length > 0)
      .map((event) => event.recordId),
  };
  const inventoryDigest = sha256(stableStringify(inventoryWithoutManifest));

  return {
    inventory: inventoryWithoutManifest,
    manifest: buildBatches(releaseEvents, inventoryDigest, maximumTargetCount),
  };
}

function stringValue(value: unknown): string | undefined {
  return typeof value === "string" && value.trim() ? value.trim() : undefined;
}

export function renderEvidenceInventorySummary(
  artifacts: EvidenceInventoryArtifacts,
): string {
  const { counts, input } = artifacts.inventory;
  const manifestCounts = artifacts.manifest.counts;
  return [
    "# Offline release chronology evidence inventory",
    "",
    "This checked-in inventory is generated solely from `scripts/seed-data.json`. It does not fetch sources, read or write Sanity, or alter historical chronology.",
    "",
    "## Inputs and identity boundary",
    "",
    `- Input: \`${input.path}\``,
    `- Legacy source SHA-256: \`${input.sourceDigest}\``,
    `- Migration-plan SHA-256: \`${input.migrationPlanDigest}\``,
    "- Release-event record IDs are the planner's stable legacy source IDs. A seed milestone without a live Sanity key is explicitly marked synthetic; a supplied live key remains live-key identity.",
    "- Each source carries a machine-readable source-date and access-date state. The checked-in seed has no observed source or access dates, so those states are explicitly unknown rather than inferred.",
    "",
    "## Exact counts",
    "",
    "| Item | Count |",
    "| --- | ---: |",
    `| Release versions | ${counts.releaseVersions} |`,
    `| Legacy milestones / event records | ${counts.eventRecords} |`,
    `| Observed source URLs | ${counts.sources} |`,
    `| Source-linked event records | ${counts.linkedEvents} |`,
    `| Missing-evidence event records | ${counts.missingEvents} |`,
    `| Conflicting-evidence event records | ${counts.conflictingEvents} |`,
    `| Quarantined event records | ${counts.quarantinedEvents} |`,
    `| Quarantined version records | ${counts.quarantinedVersions} |`,
    `| Source metadata conflicts | ${counts.conflicts} |`,
    `| Review batches | ${manifestCounts.batches} |`,
    `| Batch targets | ${manifestCounts.targetRecords} |`,
    "",
    "## Review contract",
    "",
    `Every batch in [evidence-inventory-batches.json](./evidence-inventory-batches.json) is capped at ${artifacts.manifest.maximumTargetCount} exact event record IDs. Missing or conflicting evidence stays quarantined until a reviewer records source-backed findings; no batch authorizes a chronology correction, Sanity mutation, or publication.`,
    "",
    "Regenerate: `npm run evidence:inventory`",
    "Verify checked-in artifacts: `npm run evidence:inventory:check`",
    "",
  ].join("\n");
}

export function generatedArtifactContent(
  artifacts: EvidenceInventoryArtifacts,
): { inventory: string; manifest: string; summary: string } {
  return {
    inventory: `${stableStringify(artifacts.inventory, 2)}\n`,
    manifest: `${stableStringify(artifacts.manifest, 2)}\n`,
    summary: renderEvidenceInventorySummary(artifacts),
  };
}

export function staleGeneratedArtifactKeys(
  expected: ReturnType<typeof generatedArtifactContent>,
  existing: Partial<Record<keyof ReturnType<typeof generatedArtifactContent>, string>>,
): Array<keyof ReturnType<typeof generatedArtifactContent>> {
  return (Object.keys(expected) as Array<keyof typeof expected>).filter(
    (key) => existing[key] !== expected[key],
  );
}

export function assertValidEvidenceInventory(
  artifacts: EvidenceInventoryArtifacts,
  sourceInput?: unknown,
): void {
  const { inventory, manifest } = artifacts;
  const eventCounts = {
    eventRecords: inventory.releaseEvents.length,
    sources: inventory.sourceEvidence.length,
    linkedEvents: inventory.releaseEvents.filter((event) => event.sourceCoverage === "linked").length,
    missingEvents: inventory.releaseEvents.filter((event) => event.sourceCoverage === "missing").length,
    conflictingEvents: inventory.releaseEvents.filter((event) => event.sourceCoverage === "conflict").length,
    quarantinedEvents: inventory.releaseEvents.filter((event) => event.quarantineReasons.length > 0).length,
    quarantinedVersions: inventory.releaseVersions.filter((version) => version.quarantineReasons.length > 0).length,
    conflicts: inventory.conflicts.length,
  };
  for (const [key, actual] of Object.entries(eventCounts)) {
    if (inventory.counts[key as keyof typeof eventCounts] !== actual) {
      throw new Error(`Evidence inventory count ${key} does not match its records.`);
    }
  }
  if (inventory.counts.releaseVersions !== inventory.releaseVersions.length) {
    throw new Error("Evidence inventory release-version count does not match its records.");
  }
  if (manifest.counts.targetRecords !== manifest.batches.reduce((total, batch) => total + batch.targetRecordIds.length, 0)) {
    throw new Error("Research batch target count does not match its batch records.");
  }
  const knownEventIds = new Set(inventory.releaseEvents.map((event) => event.recordId));
  const batchEventIds = manifest.batches.flatMap((batch) => batch.targetRecordIds);
  if (new Set(batchEventIds).size !== batchEventIds.length || batchEventIds.some((id) => !knownEventIds.has(id))) {
    throw new Error("Research batches must contain unique, known event record IDs.");
  }
  const quarantinedEventIds = inventory.releaseEvents
    .filter((event) => event.quarantineReasons.length > 0)
    .map((event) => event.recordId)
    .sort(compareCodeUnits);
  if (stableStringify([...batchEventIds].sort(compareCodeUnits)) !== stableStringify(quarantinedEventIds)) {
    throw new Error("Research batches must cover exactly all and only quarantined event records.");
  }
  if (manifest.batches.some((batch) => batch.targetRecordIds.length === 0 || batch.targetRecordIds.length > manifest.maximumTargetCount)) {
    throw new Error("Research batches must be non-empty and bounded.");
  }
  const sourceIds = new Set(inventory.sourceEvidence.map((source) => source.evidenceId));
  for (const event of inventory.releaseEvents) {
    if (event.evidenceIds.some((id) => !sourceIds.has(id))) {
      throw new Error(`${event.recordId} links an unknown evidence ID.`);
    }
    if (event.sourceCoverage === "linked" && event.quarantineReasons.length) {
      throw new Error(`${event.recordId} cannot be both linked and quarantined.`);
    }
    if (event.sourceCoverage !== "linked" && !event.quarantineReasons.length) {
      throw new Error(`${event.recordId} must quarantine missing or conflicting evidence.`);
    }
  }
  const expectedInventoryDigest = sha256(stableStringify(inventory));
  if (manifest.inventoryDigest !== expectedInventoryDigest) {
    throw new Error("Research batch manifest does not match the evidence inventory digest.");
  }
  if (sourceInput !== undefined) {
    const regenerated = buildEvidenceInventory(sourceInput, manifest.maximumTargetCount);
    if (stableStringify(regenerated) !== stableStringify(artifacts)) {
      throw new Error("Evidence inventory differs from a fresh deterministic regeneration of its input.");
    }
  }
}

export function buildEvidenceInventoryFromVersionsForTest(
  versions: LegacyReleaseVersion[],
  maximumTargetCount = DEFAULT_BATCH_SIZE,
): EvidenceInventoryArtifacts {
  return buildEvidenceInventory({ releaseVersions: versions }, maximumTargetCount);
}
