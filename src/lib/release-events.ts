import { eventLabelSlug, legacyEventAliases } from "./release-routes";
import type {
  BetaMilestone,
  ReleaseEvent,
  ReleaseEventAvailability,
  ReleaseEventChannel,
} from "./types";

interface ReleaseTimelineVersion {
  _id: string;
  milestones?: BetaMilestone[];
  legacyMilestones?: BetaMilestone[];
  updatedAt?: string;
}

export function milestoneChannel(label: string): ReleaseEventChannel {
  const normalized = label.trim().toLowerCase();

  if (normalized.includes("security response")) {
    return "securityResponse";
  }
  if (
    normalized.includes("recovery") ||
    normalized.includes("re-release") ||
    normalized.includes("rerelease")
  ) {
    return "recovery";
  }
  if (normalized.includes("public beta")) return "publicBeta";
  if (
    normalized === "public" ||
    normalized.includes("public release")
  ) {
    return "public";
  }
  if (
    normalized === "gm" ||
    normalized.includes("golden master")
  ) {
    return "gm";
  }
  if (
    normalized === "rc" ||
    normalized.includes("release candidate") ||
    /^rc\s*\d*/.test(normalized)
  ) {
    return "releaseCandidate";
  }
  if (
    normalized.includes("developer") ||
    normalized.includes("beta")
  ) {
    return "developer";
  }

  return "other";
}

const RELEASE_EVENT_CHANNEL_LABELS: Record<
  ReleaseEventChannel,
  string
> = {
  developer: "Developer beta",
  publicBeta: "Public beta",
  releaseCandidate: "Release candidate",
  gm: "Golden master",
  public: "Public release",
  securityResponse: "Security response",
  recovery: "Recovery / re-release",
  other: "Release appearance",
};

export function releaseEventChannelLabel(
  channel: ReleaseEventChannel,
): string {
  return RELEASE_EVENT_CHANNEL_LABELS[channel];
}

export function milestoneAvailability(
  milestone: Pick<BetaMilestone, "note">,
): ReleaseEventAvailability {
  const note = milestone.note?.toLowerCase() ?? "";

  if (/\b(pulled|withdrawn|revoked)\b/.test(note)) {
    return "withdrawn";
  }
  if (/\b(replaced|reissued|re-released)\b/.test(note)) {
    return "replaced";
  }
  if (/\bsuperseded\b/.test(note)) {
    return "superseded";
  }

  return "available";
}

export function legacyEventsForVersion(
  version: ReleaseTimelineVersion,
): ReleaseEvent[] {
  const milestones =
    version.legacyMilestones ?? version.milestones ?? [];
  const aliases = legacyEventAliases(milestones);
  const aliasByKey = new Map<string, string>();

  for (const [alias, milestone] of aliases) {
    aliasByKey.set(milestone._key, alias);
  }

  return milestones.map((milestone, index) => ({
    _id: `${version._id}:legacy-event:${milestone._key || index}`,
    slug: {
      current:
        aliasByKey.get(milestone._key) ??
        eventLabelSlug(milestone.label),
    },
    label: milestone.label,
    normalizedChannel: milestoneChannel(milestone.label),
    date: milestone.date,
    availabilityState: milestoneAvailability(milestone),
    note: milestone.note,
    deviceScope: milestone.deviceScope
      ? [milestone.deviceScope]
      : undefined,
    isRevision: milestone.isRevision,
    legacySourceId: `${version._id}:${milestone._key}`,
    provenanceStatus: "legacyImported",
    citations: milestone.sourceUrl
      ? [
          {
            _key: `${milestone._key}-source`,
            source: {
              _id: `${milestone._key}-legacy-source`,
              title: milestone.sourceLabel || "Original timeline source",
              canonicalUrl: milestone.sourceUrl,
              sourceClass: "legacy",
            },
          },
        ]
      : [],
  }));
}

function legacyKey(
  version: Pick<ReleaseTimelineVersion, "_id">,
  legacySourceId: string,
): string {
  const prefix = `${version._id}:`;
  return legacySourceId.startsWith(prefix)
    ? legacySourceId.slice(prefix.length)
    : legacySourceId;
}

function eventMatchesMilestone(
  version: Pick<ReleaseTimelineVersion, "_id">,
  event: ReleaseEvent,
  milestone: BetaMilestone,
): boolean {
  if (!event.legacySourceId) return false;

  return (
    event.legacySourceId === `${version._id}:${milestone._key}` ||
    legacyKey(version, event.legacySourceId) === milestone._key
  );
}

export function releaseEventForLegacySource(
  version: Pick<ReleaseTimelineVersion, "_id">,
  legacySourceId: string,
  events: ReleaseEvent[],
): ReleaseEvent | undefined {
  const key = legacyKey(version, legacySourceId);
  return events.find(
    (event) =>
      event.legacySourceId === legacySourceId ||
      (event.legacySourceId
        ? legacyKey(version, event.legacySourceId) === key
        : false),
  );
}

function compareReleaseEvents(
  left: ReleaseEvent,
  right: ReleaseEvent,
): number {
  return (
    left.date.localeCompare(right.date) ||
    (left.sequence ?? Number.MAX_SAFE_INTEGER) -
      (right.sequence ?? Number.MAX_SAFE_INTEGER) ||
    left.label.localeCompare(right.label)
  );
}

export function releaseEventToMilestone(
  version: Pick<ReleaseTimelineVersion, "_id">,
  event: ReleaseEvent,
  legacy?: BetaMilestone,
): BetaMilestone {
  const source = event.citations?.find(
    (citation) => citation.source?.canonicalUrl,
  )?.source;
  const scope = [
    ...(event.deviceScope ?? []),
    ...(event.regionScope ?? []),
    ...(event.languageScope ?? []),
    ...(event.audienceScope ?? []),
  ];

  return {
    _key: event.legacySourceId
      ? legacyKey(version, event.legacySourceId)
      : `release-event:${event._id}`,
    label: event.label,
    date: event.date,
    note: event.note ?? legacy?.note,
    build:
      event.build?.displayBuildNumber ??
      event.build?.buildNumber ??
      legacy?.build,
    channel: event.normalizedChannel,
    deviceScope:
      (scope.length ? scope.join(", ") : undefined) ??
      legacy?.deviceScope,
    sourceUrl: source?.canonicalUrl ?? legacy?.sourceUrl,
    sourceLabel: source?.title ?? legacy?.sourceLabel,
    isRevision: event.isRevision ?? legacy?.isRevision ?? false,
  };
}

function eventWithLegacyFallback(
  version: ReleaseTimelineVersion,
  event: ReleaseEvent,
  legacy: BetaMilestone,
): ReleaseEvent {
  const fallback = legacyEventsForVersion({
    _id: version._id,
    milestones: [legacy],
  })[0];

  return {
    ...event,
    note: event.note ?? fallback.note,
    deviceScope:
      event.deviceScope?.length
        ? event.deviceScope
        : fallback.deviceScope,
    isRevision: event.isRevision ?? fallback.isRevision,
    citations:
      event.citations?.length
        ? event.citations
        : fallback.citations,
  };
}

/**
 * First-class release events are canonical. During a staged migration they
 * replace only the legacy milestone identified by legacySourceId; every other
 * audited milestone remains available to timelines, forecasts, and exports.
 */
export function milestonesForVersion(
  version: ReleaseTimelineVersion,
  events?: ReleaseEvent[],
): BetaMilestone[] {
  if (!events?.length) return version.milestones ?? [];

  const legacy =
    version.legacyMilestones ?? version.milestones ?? [];
  const representedEventIds = new Set<string>();
  const overlaid = legacy.map((milestone) => {
    const replacement = events.find((event) =>
      eventMatchesMilestone(version, event, milestone),
    );
    if (!replacement) return milestone;

    representedEventIds.add(replacement._id);
    return releaseEventToMilestone(version, replacement, milestone);
  });
  const appended = events
    .filter((event) => !representedEventIds.has(event._id))
    .sort(compareReleaseEvents)
    .map((event) => releaseEventToMilestone(version, event));

  // Modern JavaScript sorting is stable, so equal-date legacy records retain
  // their audited order and replacements stay in the same position.
  return [...overlaid, ...appended].sort(
    (left, right) => left.date.localeCompare(right.date),
  );
}

export function versionWithReleaseEvents<
  T extends ReleaseTimelineVersion,
>(
  version: T,
  events?: ReleaseEvent[],
): T & { milestones: BetaMilestone[] } {
  if (!events?.length) {
    return Array.isArray(version.milestones)
      ? (version as T & { milestones: BetaMilestone[] })
      : { ...version, milestones: [] };
  }

  const legacyMilestones =
    version.legacyMilestones ?? version.milestones ?? [];
  const updatedAt = [version.updatedAt, ...events.map((event) => event.updatedAt)]
    .filter((value): value is string => Boolean(value))
    .sort()
    .at(-1);

  return {
    ...version,
    ...(updatedAt ? { updatedAt } : {}),
    legacyMilestones,
    milestones: milestonesForVersion(
      { ...version, legacyMilestones },
      events,
    ),
  };
}

export function releaseEventsForVersion(
  version: ReleaseTimelineVersion,
  events?: ReleaseEvent[],
): ReleaseEvent[] {
  if (!events?.length) return legacyEventsForVersion(version);

  const legacyMilestones =
    version.legacyMilestones ?? version.milestones ?? [];
  const legacyEvents = legacyEventsForVersion({
    _id: version._id,
    milestones: legacyMilestones,
  });
  const representedEventIds = new Set<string>();
  const overlaid = legacyEvents.map((legacyEvent, index) => {
    const replacement = releaseEventForLegacySource(
      version,
      legacyEvent.legacySourceId ?? legacyMilestones[index]?._key ?? "",
      events,
    );
    if (!replacement) return legacyEvent;

    representedEventIds.add(replacement._id);
    return eventWithLegacyFallback(
      version,
      replacement,
      legacyMilestones[index],
    );
  });
  const appended = events
    .filter((event) => !representedEventIds.has(event._id))
    .sort(compareReleaseEvents);

  return [...overlaid, ...appended].sort(
    (left, right) => left.date.localeCompare(right.date),
  );
}
