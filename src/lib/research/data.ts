import { client } from "@/sanity/client";
import { eventLabelSlug } from "@/lib/release-routes";
import { APPLE_VENDOR } from "@/lib/vendors";
import { publicResearchSnapshotQuery } from "./queries";
import type {
  PublicBuildRow,
  PublicChangeRow,
  PublicCitationRow,
  PublicEventRow,
  PublicOccurrenceRow,
  PublicProvenanceRow,
  PublicReleaseRow,
  PublicResearchDatasets,
} from "./types";

type RawRecord = Record<string, unknown>;

interface RawResearchSnapshot {
  releases?: RawRecord[];
  events?: RawRecord[];
  builds?: RawRecord[];
  changes?: RawRecord[];
  auditBatches?: RawRecord[];
  corrections?: RawRecord[];
}

export interface NormalizedResearchSnapshot {
  datasets: PublicResearchDatasets;
  releaseOverviewText: Map<string, string>;
  eventArticleText: Map<string, string>;
  buildArticleText: Map<string, string>;
}

const fetchOptions = {
  next: { revalidate: 300 },
} as const;

function asRecord(value: unknown): RawRecord {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as RawRecord)
    : {};
}

function asRecords(value: unknown): RawRecord[] {
  return Array.isArray(value)
    ? value.filter(
        (candidate): candidate is RawRecord =>
          Boolean(candidate) &&
          typeof candidate === "object" &&
          !Array.isArray(candidate),
      )
    : [];
}

function asString(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const normalized = value.trim();
  return normalized || null;
}

function asIdentifier(value: unknown): string | null {
  return (
    asString(value) ||
    (typeof value === "number" && Number.isFinite(value)
      ? String(value)
      : null)
  );
}

function asStringArray(value: unknown): string[] {
  const values = Array.isArray(value) ? value : value ? [value] : [];
  return Array.from(
    new Set(
      values
        .map(asString)
        .filter((candidate): candidate is string => Boolean(candidate)),
    ),
  );
}

function asBoolean(value: unknown): boolean {
  return value === true;
}

function asNumber(value: unknown): number | null {
  return typeof value === "number" && Number.isFinite(value)
    ? value
    : null;
}

function pathValue(
  record: RawRecord,
  ...path: string[]
): unknown {
  let value: unknown = record;
  for (const segment of path) {
    value = asRecord(value)[segment];
  }
  return value;
}

function normalizePlatform(value: unknown): string {
  return (asString(value) || "unknown")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "");
}

function normalizeEnum(value: unknown, fallback: string): string {
  const explicit = asString(value);
  if (!explicit) return fallback;
  return explicit
    .replace(/([a-z0-9])([A-Z])/g, "$1_$2")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_|_$/g, "");
}

function normalizeStatus(
  status: unknown,
  publicReleaseDate: unknown,
): string {
  const explicit = asString(status);
  if (explicit) return normalizeEnum(explicit, "active");
  return asString(publicReleaseDate) ? "released" : "active";
}

function normalizeProvenance(
  status: unknown,
  auditBatchCount?: unknown,
): string {
  const explicit = asString(status);
  if (explicit) return normalizeEnum(explicit, "legacy_imported");
  return (
    asNumber(auditBatchCount) && Number(auditBatchCount) > 0
      ? "audit_verified"
      : "legacy_imported"
  );
}

function deriveChannel(labelValue: unknown): string {
  const label = (asString(labelValue) || "").toLowerCase();
  if (label.includes("public beta")) return "public_beta";
  if (
    label.includes("release candidate") ||
    /(^|\s)rc(\s|$|\d)/.test(label)
  ) {
    return "release_candidate";
  }
  if (
    label.includes("golden master") ||
    /(^|\s)gm(\s|$)/.test(label)
  ) {
    return "golden_master";
  }
  if (label === "public" || label.includes("public release")) {
    return "public";
  }
  if (label.includes("beta")) return "developer_beta";
  return "other";
}

function normalizedChannel(
  channelValue: unknown,
  labelValue: unknown,
): string {
  return (
    (asString(channelValue)
      ? normalizeEnum(channelValue, "other")
      : null) ||
    deriveChannel(labelValue)
  );
}

function compareRows(
  left: Record<string, unknown>,
  right: Record<string, unknown>,
): number {
  const leftPlatform = asString(left.platform) || "";
  const rightPlatform = asString(right.platform) || "";
  const platformOrder = leftPlatform.localeCompare(rightPlatform);
  if (platformOrder) return platformOrder;

  const leftVersion = asString(left.version) || "";
  const rightVersion = asString(right.version) || "";
  const versionOrder = leftVersion.localeCompare(rightVersion, undefined, {
    numeric: true,
  });
  if (versionOrder) return versionOrder;

  const leftDate =
    asString(left.appearance_date) ||
    asString(left.public_release_date) ||
    "";
  const rightDate =
    asString(right.appearance_date) ||
    asString(right.public_release_date) ||
    "";
  const dateOrder = leftDate.localeCompare(rightDate);
  if (dateOrder) return dateOrder;

  return (asString(left.id) || "").localeCompare(
    asString(right.id) || "",
  );
}

function releaseRows(rawReleases: RawRecord[]): PublicReleaseRow[] {
  return rawReleases
    .map((release): PublicReleaseRow | null => {
      const id = asString(release._id);
      const version = asString(release.version);
      const platform =
        asString(pathValue(release, "releaseTrain", "platform", "slug")) ||
        asString(pathValue(release, "releaseTrain", "platform", "name"));

      if (!id || !version || !platform) return null;

      const explicitFamily = asNumber(
        pathValue(release, "releaseTrain", "majorVersion"),
      );
      const inferredFamily = version.split(".")[0] || version;

      return {
        id,
        vendor: APPLE_VENDOR.slug,
        platform: normalizePlatform(platform),
        family: String(explicitFamily ?? inferredFamily),
        version,
        status: normalizeStatus(
          release.releaseStatus,
          release.publicReleaseDate,
        ),
        public_release_date: asString(release.publicReleaseDate),
        note: asString(release.versionNote),
        release_notes_url: asString(release.releaseNotesUrl),
        provenance_status: normalizeProvenance(
          release.provenanceStatus,
          release.auditBatchCount,
        ),
        updated_at: asString(release._updatedAt),
      };
    })
    .filter((release): release is PublicReleaseRow => Boolean(release))
    .sort(compareRows);
}

function citationRows(
  citationsValue: unknown,
  targetKind: string,
  targetId: string,
): PublicCitationRow[] {
  return asRecords(citationsValue)
    .map((citation, index): PublicCitationRow | null => {
      const sourceUrl = asString(citation.sourceUrl);
      if (!sourceUrl) return null;

      const key = asString(citation._key) || String(index + 1);
      return {
        id: `${targetId}:citation:${key}`,
        target_kind: targetKind,
        target_id: targetId,
        source_id: asString(citation.sourceId),
        source_url: sourceUrl,
        source_title: asString(citation.sourceTitle),
        publisher: asString(citation.publisher),
        author: asString(citation.author),
        publication_date: asString(citation.publicationDate),
        accessed_date: asString(citation.accessedDate),
        archive_url: asString(citation.archiveUrl),
        source_class: asString(citation.sourceClass)
          ? normalizeEnum(citation.sourceClass, "other")
          : null,
        locator: asString(citation.locator),
      };
    })
    .filter((citation): citation is PublicCitationRow =>
      Boolean(citation),
    );
}

function firstClassEventRows(
  rawEvents: RawRecord[],
  releasesById: Map<string, PublicReleaseRow>,
): PublicEventRow[] {
  return rawEvents
    .map((event): PublicEventRow | null => {
      const id = asString(event._id);
      const versionId = asString(event.versionId);
      const release = versionId ? releasesById.get(versionId) : undefined;
      const version = asString(event.version) || release?.version;
      const platform =
        asString(event.platform) || release?.platform || null;
      const family =
        asIdentifier(event.family) || release?.family || null;
      const label = asString(event.label);
      const appearanceDate =
        asString(event.appearanceDate) || asString(event.date);

      if (
        !id ||
        !versionId ||
        !version ||
        !platform ||
        !family ||
        !label ||
        !appearanceDate
      ) {
        return null;
      }

      const citations = asRecords(event.citations);

      return {
        id,
        vendor: APPLE_VENDOR.slug,
        platform: normalizePlatform(platform),
        family,
        version_id: versionId,
        version,
        label,
        route_alias:
          asString(event.routeAlias) ||
          label
            .toLowerCase()
            .replace(/^developer\s+/, "")
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-|-$/g, ""),
        channel: normalizedChannel(event.channel, label),
        appearance_date: appearanceDate,
        version_label_at_appearance: asString(
          event.versionLabelAtAppearance,
        ),
        availability_state:
          asString(event.availabilityState) || "available",
        build_id: asString(event.buildId),
        build_number: asString(event.buildNumber),
        is_revision: asBoolean(event.isRevision),
        audience: asStringArray(event.audience),
        device_scope: asStringArray(event.deviceScope),
        region_scope: asStringArray(event.regionScope),
        language_scope: asStringArray(event.languageScope),
        note: asString(event.note),
        provenance_status: normalizeProvenance(event.provenanceStatus),
        index_eligible: asBoolean(event.indexEligible),
        source_count: citations.length,
        updated_at: asString(event._updatedAt),
      };
    })
    .filter((event): event is PublicEventRow => Boolean(event));
}

function legacyEventRows(
  rawReleases: RawRecord[],
  releasesById: Map<string, PublicReleaseRow>,
  representedLegacyIds: Set<string>,
): PublicEventRow[] {
  const events: PublicEventRow[] = [];

  for (const rawRelease of rawReleases) {
    const releaseId = asString(rawRelease._id);
    if (!releaseId) continue;
    const release = releasesById.get(releaseId);
    if (!release) continue;

    const milestones = asRecords(rawRelease.milestones);
    const aliasCounts = new Map<string, number>();
    for (const milestone of milestones) {
      const label = asString(milestone.label);
      if (!label) continue;
      const alias = eventLabelSlug(label);
      aliasCounts.set(alias, (aliasCounts.get(alias) || 0) + 1);
    }

    for (const milestone of milestones) {
      const key = asString(milestone._key);
      const label = asString(milestone.label);
      const date = asString(milestone.date);
      if (!key || !label || !date) continue;

      const legacySourceId = `${releaseId}:${key}`;
      if (
        representedLegacyIds.has(legacySourceId) ||
        representedLegacyIds.has(key)
      ) {
        continue;
      }

      const eventId = `legacy:${legacySourceId}`;
      const baseAlias = eventLabelSlug(label);
      events.push({
        id: eventId,
        vendor: APPLE_VENDOR.slug,
        platform: release.platform,
        family: release.family,
        version_id: release.id,
        version: release.version,
        label,
        route_alias:
          (aliasCounts.get(baseAlias) || 0) > 1
            ? `${baseAlias}-${date}`
            : baseAlias,
        channel: deriveChannel(label),
        appearance_date: date,
        version_label_at_appearance: null,
        availability_state: "available",
        build_id: null,
        build_number: null,
        is_revision: asBoolean(milestone.isRevision),
        audience: [],
        device_scope: [],
        region_scope: [],
        language_scope: [],
        note: asString(milestone.note),
        provenance_status: release.provenance_status,
        index_eligible: false,
        source_count: asString(milestone.sourceUrl) ? 1 : 0,
        updated_at: release.updated_at,
      });
    }
  }

  return events;
}

function buildRows(
  rawBuilds: RawRecord[],
  releasesById: Map<string, PublicReleaseRow>,
): PublicBuildRow[] {
  return rawBuilds
    .map((build): PublicBuildRow | null => {
      const id = asString(build._id);
      const versionId = asString(build.versionId);
      const release = versionId ? releasesById.get(versionId) : undefined;
      const version = asString(build.version) || release?.version;
      const platform =
        asString(build.platform) || release?.platform || null;
      const family =
        asIdentifier(build.family) || release?.family || null;
      const buildNumber = asString(build.buildNumber);

      if (
        !id ||
        !versionId ||
        !version ||
        !platform ||
        !family ||
        !buildNumber
      ) {
        return null;
      }

      return {
        id,
        vendor: APPLE_VENDOR.slug,
        platform: normalizePlatform(platform),
        family,
        version_id: versionId,
        version,
        build_number: buildNumber.toLowerCase(),
        display_build_number: buildNumber,
        canonical_slug:
          asString(build.canonicalSlug) || buildNumber.toLowerCase(),
        status: normalizeEnum(build.status, "available"),
        device_scope: asStringArray(build.deviceScope),
        provenance_status: normalizeProvenance(
          build.provenanceStatus,
        ),
        index_eligible: asBoolean(build.indexEligible),
        updated_at: asString(build._updatedAt),
      };
    })
    .filter((build): build is PublicBuildRow => Boolean(build))
    .sort(compareRows);
}

function changeRows(rawChanges: RawRecord[]): PublicChangeRow[] {
  return rawChanges
    .map((change): PublicChangeRow | null => {
      const id = asString(change._id);
      const title = asString(change.title);
      if (!id || !title) return null;

      return {
        id,
        title,
        category: normalizeEnum(change.category, "other"),
        summary: asString(change.summary),
        updated_at: asString(change._updatedAt),
      };
    })
    .filter((change): change is PublicChangeRow => Boolean(change))
    .sort((left, right) => left.title.localeCompare(right.title));
}

function appendOccurrenceRows(
  occurrences: PublicOccurrenceRow[],
  rawTargets: RawRecord[],
  targetKind: "event" | "build",
  targetsById: Map<string, PublicEventRow | PublicBuildRow>,
): void {
  for (const rawTarget of rawTargets) {
    const targetId = asString(rawTarget._id);
    if (!targetId) continue;
    const target = targetsById.get(targetId);
    if (!target) continue;

    asRecords(rawTarget.changes).forEach((occurrence, index) => {
      const key = asString(occurrence._key) || String(index + 1);
      const changeId = asString(occurrence.changeId);
      const changeTitle = asString(occurrence.changeTitle);
      if (!changeId || !changeTitle) return;

      const id = `${target.id}:change:${key}`;
      occurrences.push({
        id,
        change_id: changeId,
        change_title: changeTitle,
        action: normalizeEnum(occurrence.action, "changed"),
        inheritance: normalizeEnum(occurrence.inheritance, "delta"),
        summary: asString(occurrence.summary),
        target_kind: targetKind,
        target_id: target.id,
        vendor: target.vendor,
        platform: target.platform,
        family: target.family,
        version: target.version,
        build_number:
          targetKind === "build"
            ? (target as PublicBuildRow).build_number
            : (target as PublicEventRow).build_number,
        documented_status: normalizeEnum(
          occurrence.documentedStatus,
          "unknown",
        ),
        evidence_state: normalizeEnum(
          occurrence.evidenceState,
          "reported",
        ),
        verification_method: asString(
          occurrence.verificationMethod,
        ),
        applicability: asStringArray(occurrence.applicability),
        public_contributor_credit: asString(
          occurrence.publicContributorCredit,
        ),
        source_count: asRecords(occurrence.citations).length,
        updated_at: target.updated_at,
      });
    });
  }
}

function occurrenceRows(
  rawEvents: RawRecord[],
  rawBuilds: RawRecord[],
  eventsById: Map<string, PublicEventRow>,
  buildsById: Map<string, PublicBuildRow>,
): PublicOccurrenceRow[] {
  const occurrences: PublicOccurrenceRow[] = [];
  appendOccurrenceRows(
    occurrences,
    rawEvents,
    "event",
    eventsById,
  );
  appendOccurrenceRows(
    occurrences,
    rawBuilds,
    "build",
    buildsById,
  );

  return occurrences.sort(compareRows);
}

function allCitationRows(
  rawReleases: RawRecord[],
  rawEvents: RawRecord[],
  rawBuilds: RawRecord[],
  rawChanges: RawRecord[],
  rawAuditBatches: RawRecord[],
  rawCorrections: RawRecord[],
  releasesById: Map<string, PublicReleaseRow>,
  eventsById: Map<string, PublicEventRow>,
  buildsById: Map<string, PublicBuildRow>,
  changesById: Map<string, PublicChangeRow>,
): PublicCitationRow[] {
  const citations: PublicCitationRow[] = [];
  const migratedEventByLegacyId = new Map<string, string>();

  for (const rawEvent of rawEvents) {
    const eventId = asString(rawEvent._id);
    if (!eventId || !eventsById.has(eventId)) continue;
    const legacySourceId = asString(rawEvent.legacySourceId);
    if (legacySourceId) {
      migratedEventByLegacyId.set(legacySourceId, eventId);
    }
    citations.push(
      ...citationRows(rawEvent.citations, "event", eventId),
    );
    asRecords(rawEvent.changes).forEach((occurrence, index) => {
      const key = asString(occurrence._key) || String(index + 1);
      citations.push(
        ...citationRows(
          occurrence.citations,
          "occurrence",
          `${eventId}:change:${key}`,
        ),
      );
    });
  }

  for (const rawChange of rawChanges) {
    const changeId = asString(rawChange._id);
    if (!changeId || !changesById.has(changeId)) continue;
    citations.push(
      ...citationRows(rawChange.citations, "change", changeId),
    );
  }

  for (const rawAuditBatch of rawAuditBatches) {
    const auditBatchId = asString(rawAuditBatch._id);
    if (!auditBatchId) continue;
    citations.push(
      ...citationRows(
        rawAuditBatch.citations,
        "audit_batch",
        auditBatchId,
      ),
    );
  }

  for (const rawCorrection of rawCorrections) {
    const correctionId = asString(rawCorrection._id);
    if (!correctionId) continue;
    citations.push(
      ...citationRows(
        rawCorrection.citations,
        "correction",
        correctionId,
      ),
    );
    asRecords(rawCorrection.affectedClaims).forEach((claim) => {
      citations.push(
        ...citationRows(
          claim.citations,
          "correction",
          correctionId,
        ),
      );
    });
  }

  for (const rawBuild of rawBuilds) {
    const buildId = asString(rawBuild._id);
    if (!buildId || !buildsById.has(buildId)) continue;
    citations.push(
      ...citationRows(rawBuild.citations, "build", buildId),
    );

    asRecords(rawBuild.changes).forEach((occurrence, index) => {
      const key = asString(occurrence._key) || String(index + 1);
      const occurrenceId = `${buildId}:change:${key}`;
      citations.push(
        ...citationRows(
          occurrence.citations,
          "occurrence",
          occurrenceId,
        ),
      );
    });
  }

  for (const rawRelease of rawReleases) {
    const releaseId = asString(rawRelease._id);
    if (!releaseId) continue;
    const release = releasesById.get(releaseId);
    if (!release) continue;

    const releaseNotesUrl = asString(rawRelease.releaseNotesUrl);
    if (releaseNotesUrl) {
      citations.push({
        id: `${releaseId}:citation:release-notes`,
        target_kind: "release",
        target_id: releaseId,
        source_id: null,
        source_url: releaseNotesUrl,
        source_title: "Official release notes",
        publisher: "Apple",
        author: null,
        publication_date: null,
        accessed_date: null,
        archive_url: null,
        source_class: "first_party",
        locator: null,
      });
    }

    for (const milestone of asRecords(rawRelease.milestones)) {
      const key = asString(milestone._key);
      const sourceUrl = asString(milestone.sourceUrl);
      if (!key || !sourceUrl) continue;
      const legacySourceId = `${releaseId}:${key}`;
      const representedEventId =
        migratedEventByLegacyId.get(legacySourceId) ||
        migratedEventByLegacyId.get(key) ||
        `legacy:${legacySourceId}`;
      const representedEvent = eventsById.get(representedEventId);
      if (!representedEvent) continue;

      citations.push({
        id: `${representedEvent.id}:citation:legacy-source`,
        target_kind: "event",
        target_id: representedEvent.id,
        source_id: null,
        source_url: sourceUrl,
        source_title: asString(milestone.sourceLabel),
        publisher: null,
        author: null,
        publication_date: null,
        accessed_date: null,
        archive_url: null,
        source_class: null,
        locator: null,
      });
    }
  }

  const unique = new Map<string, PublicCitationRow>();
  for (const citation of citations) {
    const dedupeKey = [
      citation.target_kind,
      citation.target_id,
      citation.source_id || citation.source_url,
      citation.locator || "",
    ].join("|");
    if (!unique.has(dedupeKey)) unique.set(dedupeKey, citation);
  }

  return Array.from(unique.values()).sort((left, right) =>
    left.id.localeCompare(right.id),
  );
}

function provenanceRows(
  rawAuditBatches: RawRecord[],
  rawCorrections: RawRecord[],
): PublicProvenanceRow[] {
  const batches = rawAuditBatches
    .map((batch): PublicProvenanceRow | null => {
      const id = asString(batch._id);
      const title = asString(batch.title);
      if (!id || !title) return null;

      return {
        id,
        record_type: "audit_batch",
        title,
        status: asString(batch.status) || "verified",
        verification_date: asString(batch.verificationDate),
        methodology: asString(batch.methodology),
        scope: asStringArray(batch.scope),
        snapshot_identity: asString(batch.snapshotIdentity),
        affected_target_ids: [],
        reason_category: null,
        reason: null,
        published_at: null,
      };
    })
    .filter((row): row is PublicProvenanceRow => Boolean(row));

  const corrections = rawCorrections
    .map((correction): PublicProvenanceRow | null => {
      const id = asString(correction._id);
      const title = asString(correction.title);
      if (!id || !title) return null;

      return {
        id,
        record_type: "correction",
        title,
        status: asString(correction.status) || "published",
        verification_date: asString(correction.correctionDate),
        methodology: null,
        scope: [],
        snapshot_identity: null,
        affected_target_ids: asStringArray(
          correction.affectedTargetIds,
        ),
        reason_category: normalizeEnum(
          correction.reasonCategory,
          "other",
        ),
        reason: asString(correction.reason),
        published_at: asString(correction.publishedAt),
      };
    })
    .filter((row): row is PublicProvenanceRow => Boolean(row));

  return [...batches, ...corrections].sort((left, right) =>
    left.id.localeCompare(right.id),
  );
}

export function normalizeResearchSnapshot(
  rawSnapshot: RawResearchSnapshot,
): NormalizedResearchSnapshot {
  const rawReleases = asRecords(rawSnapshot.releases);
  const rawEvents = asRecords(rawSnapshot.events);
  const rawBuilds = asRecords(rawSnapshot.builds);
  const rawChanges = asRecords(rawSnapshot.changes);
  const rawAuditBatches = asRecords(rawSnapshot.auditBatches);
  const rawCorrections = asRecords(rawSnapshot.corrections);

  const releases = releaseRows(rawReleases);
  const releasesById = new Map(
    releases.map((release) => [release.id, release]),
  );

  const firstClassEvents = firstClassEventRows(
    rawEvents,
    releasesById,
  );
  const representedLegacyIds = new Set(
    rawEvents
      .map((event) => asString(event.legacySourceId))
      .filter((id): id is string => Boolean(id)),
  );
  const events = [
    ...firstClassEvents,
    ...legacyEventRows(
      rawReleases,
      releasesById,
      representedLegacyIds,
    ),
  ].sort(compareRows);
  const eventsById = new Map(events.map((event) => [event.id, event]));

  const builds = buildRows(rawBuilds, releasesById);
  const buildsById = new Map(builds.map((build) => [build.id, build]));
  const changes = changeRows(rawChanges);
  const changesById = new Map(
    changes.map((change) => [change.id, change]),
  );
  const occurrences = occurrenceRows(
    rawEvents,
    rawBuilds,
    eventsById,
    buildsById,
  );

  const releaseOverviewText = new Map<string, string>();
  for (const rawRelease of rawReleases) {
    const id = asString(rawRelease._id);
    const overviewText = asString(rawRelease.overviewText);
    if (id && overviewText && releasesById.has(id)) {
      releaseOverviewText.set(id, overviewText);
    }
  }

  const eventArticleText = new Map<string, string>();
  for (const rawEvent of rawEvents) {
    const id = asString(rawEvent._id);
    const articleText = asString(rawEvent.articleText);
    if (id && articleText && eventsById.has(id)) {
      eventArticleText.set(id, articleText);
    }
  }

  const buildArticleText = new Map<string, string>();
  for (const rawBuild of rawBuilds) {
    const id = asString(rawBuild._id);
    const articleText = asString(rawBuild.articleText);
    if (id && articleText && buildsById.has(id)) {
      buildArticleText.set(id, articleText);
    }
  }

  return {
    datasets: {
      releases,
      events,
      builds,
      changes,
      occurrences,
      citations: allCitationRows(
        rawReleases,
        rawEvents,
        rawBuilds,
        rawChanges,
        rawAuditBatches,
        rawCorrections,
        releasesById,
        eventsById,
        buildsById,
        changesById,
      ),
      provenance: provenanceRows(
        rawAuditBatches,
        rawCorrections,
      ),
    },
    releaseOverviewText,
    eventArticleText,
    buildArticleText,
  };
}

/**
 * Normalization (portable-text flattening across every release, event,
 * build, and change) is the expensive step, not the fetch — Next's data
 * cache already holds the raw snapshot for 300s. Cache the normalized
 * result for the same window so dynamic routes such as /search/ do not
 * re-normalize the full archive on every request. Caching the promise
 * also collapses concurrent requests into one normalization pass.
 */
const SNAPSHOT_CACHE_TTL_MS = 300_000;

let snapshotCache: {
  value: Promise<NormalizedResearchSnapshot>;
  expiresAt: number;
} | null = null;

export function getNormalizedResearchSnapshot(): Promise<NormalizedResearchSnapshot> {
  const now = Date.now();

  if (snapshotCache && snapshotCache.expiresAt > now) {
    return snapshotCache.value;
  }

  const value = client
    .fetch<RawResearchSnapshot>(
      publicResearchSnapshotQuery,
      {},
      fetchOptions,
    )
    .then((snapshot) => normalizeResearchSnapshot(snapshot || {}));

  const entry = { value, expiresAt: now + SNAPSHOT_CACHE_TTL_MS };
  snapshotCache = entry;

  value.catch(() => {
    if (snapshotCache === entry) {
      snapshotCache = null;
    }
  });

  return value;
}

export async function getPublicResearchDatasets(): Promise<PublicResearchDatasets> {
  return (await getNormalizedResearchSnapshot()).datasets;
}
