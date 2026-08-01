import {
  getNormalizedResearchSnapshot,
  type NormalizedResearchSnapshot,
} from "./data";
import {
  RESEARCH_EXPORT_VERSION,
  type PublicCitationRow,
  type ResearchSearchDocument,
  type ResearchSearchFilters,
  type ResearchSearchIndex,
  type ResearchSearchResult,
} from "./types";
import {
  releaseBuildPath,
  releaseEventPath,
  releaseVersionPath,
} from "@/lib/release-routes";

const PLATFORM_NAMES: Record<string, string> = {
  ios: "iOS",
  ipados: "iPadOS",
  macos: "macOS",
  watchos: "watchOS",
  tvos: "tvOS",
  visionos: "visionOS",
};

function platformName(slug: string): string {
  return PLATFORM_NAMES[slug] || slug;
}

function pathSegment(value: string): string {
  return encodeURIComponent(value.toLowerCase());
}

function aliasSlug(label: string): string {
  return (
    label
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "") || "release-event"
  );
}

export function releaseHref(
  platform: string,
  version: string,
): string {
  return releaseVersionPath(pathSegment(platform), version);
}

export function buildHref(
  platform: string,
  version: string,
  buildNumber: string,
): string {
  return releaseBuildPath(platform, version, buildNumber);
}

export function eventHref(
  platform: string,
  version: string,
  label: string,
  routeAlias?: string | null,
): string {
  return releaseEventPath(
    platform,
    version,
    routeAlias || aliasSlug(label),
  );
}

function compactText(...parts: Array<string | null | undefined>): string {
  return parts
    .filter((part): part is string => Boolean(part))
    .join(" ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 4_000);
}

function citationsByTarget(
  citations: PublicCitationRow[],
): Map<string, PublicCitationRow[]> {
  const grouped = new Map<string, PublicCitationRow[]>();
  for (const citation of citations) {
    const current = grouped.get(citation.target_id) || [];
    current.push(citation);
    grouped.set(citation.target_id, current);
  }
  return grouped;
}

function publishersFor(
  groupedCitations: Map<string, PublicCitationRow[]>,
  targetId: string,
): string[] {
  return Array.from(
    new Set(
      (groupedCitations.get(targetId) || [])
        .map((citation) => citation.publisher)
        .filter(
          (publisher): publisher is string => Boolean(publisher),
        ),
    ),
  ).sort();
}

/**
 * Document building walks the entire archive, so its output is cached per
 * normalized snapshot. The WeakMap key is the snapshot object itself: the
 * data layer returns the same instance for its cache window, and a new
 * snapshot naturally invalidates the entry.
 */
const searchDocumentsCache = new WeakMap<
  NormalizedResearchSnapshot,
  ResearchSearchDocument[]
>();

export async function getResearchSearchIndex(
  generatedAt = new Date().toISOString(),
): Promise<ResearchSearchIndex> {
  const snapshot = await getNormalizedResearchSnapshot();
  let documents = searchDocumentsCache.get(snapshot);

  if (!documents) {
    documents = buildSearchDocuments(snapshot);
    searchDocumentsCache.set(snapshot, documents);
  }

  return {
    schema_version: RESEARCH_EXPORT_VERSION,
    generated_at: generatedAt,
    documents,
  };
}

function buildSearchDocuments({
  datasets,
  releaseOverviewText,
  eventArticleText,
  buildArticleText,
}: NormalizedResearchSnapshot): ResearchSearchDocument[] {
  const groupedCitations = citationsByTarget(datasets.citations);
  const documents: ResearchSearchDocument[] = [];

  for (const release of datasets.releases) {
    const platform = platformName(release.platform);
    documents.push({
      id: `release:${release.id}`,
      kind: "release",
      title: `${platform} ${release.version}`,
      href: releaseHref(release.platform, release.version),
      text: compactText(
        release.note,
        release.status,
        release.release_notes_url,
        releaseOverviewText.get(release.id),
      ),
      vendor: release.vendor,
      platform: release.platform,
      family: release.family,
      version: release.version,
      date: release.public_release_date,
      status: release.status,
      channel: null,
      build_number: null,
      change_type: null,
      documented_status: null,
      evidence_state: null,
      publishers: publishersFor(groupedCitations, release.id),
    });
  }

  for (const event of datasets.events) {
    const platform = platformName(event.platform);
    documents.push({
      id: `event:${event.id}`,
      kind: "event",
      title: `${platform} ${event.version} ${event.label}`,
      href: eventHref(
        event.platform,
        event.version,
        event.label,
        event.route_alias,
      ),
      text: compactText(
        event.note,
        eventArticleText.get(event.id),
        event.channel,
        event.availability_state,
        event.build_number,
        ...event.device_scope,
      ),
      vendor: event.vendor,
      platform: event.platform,
      family: event.family,
      version: event.version,
      date: event.appearance_date,
      status: event.availability_state,
      channel: event.channel,
      build_number: event.build_number,
      change_type: null,
      documented_status: null,
      evidence_state: null,
      publishers: publishersFor(groupedCitations, event.id),
    });
  }

  for (const build of datasets.builds) {
    const platform = platformName(build.platform);
    documents.push({
      id: `build:${build.id}`,
      kind: "build",
      title: `${platform} ${build.version} (${build.display_build_number})`,
      href: buildHref(
        build.platform,
        build.version,
        build.canonical_slug,
      ),
      text: compactText(
        build.status,
        buildArticleText.get(build.id),
        ...build.device_scope,
      ),
      vendor: build.vendor,
      platform: build.platform,
      family: build.family,
      version: build.version,
      date: null,
      status: build.status,
      channel: null,
      build_number: build.build_number,
      change_type: null,
      documented_status: null,
      evidence_state: null,
      publishers: publishersFor(groupedCitations, build.id),
    });
  }

  const eventsById = new Map(
    datasets.events.map((event) => [event.id, event]),
  );
  const buildsById = new Map(
    datasets.builds.map((build) => [build.id, build]),
  );

  for (const occurrence of datasets.occurrences) {
    const targetBuild =
      occurrence.target_kind === "build"
        ? buildsById.get(occurrence.target_id)
        : undefined;
    const targetEvent =
      occurrence.target_kind === "event"
        ? eventsById.get(occurrence.target_id)
        : undefined;
    const href = targetBuild
      ? buildHref(
          targetBuild.platform,
          targetBuild.version,
          targetBuild.canonical_slug,
        )
      : targetEvent
        ? eventHref(
            targetEvent.platform,
            targetEvent.version,
            targetEvent.label,
            targetEvent.route_alias,
          )
        : releaseHref(occurrence.platform, occurrence.version);

    documents.push({
      id: `change:${occurrence.id}`,
      kind: "change",
      title: occurrence.change_title,
      href: `${href}#change-${encodeURIComponent(occurrence.id)}`,
      text: compactText(
        occurrence.summary,
        occurrence.action,
        ...occurrence.applicability,
      ),
      vendor: occurrence.vendor,
      platform: occurrence.platform,
      family: occurrence.family,
      version: occurrence.version,
      date: targetEvent?.appearance_date || null,
      status: occurrence.action,
      channel: null,
      build_number: occurrence.build_number,
      change_type: occurrence.action,
      documented_status: occurrence.documented_status,
      evidence_state: occurrence.evidence_state,
      publishers: publishersFor(
        groupedCitations,
        occurrence.id,
      ),
    });
  }

  return documents;
}

function normalizeSearchText(value: string): string {
  return value
    .normalize("NFKD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .replace(/[^a-z0-9.]+/g, " ")
    .trim();
}

function matchesFilter(
  document: ResearchSearchDocument,
  filters: ResearchSearchFilters,
): boolean {
  const entries = Object.entries(filters).filter(
    ([, value]) => Boolean(value),
  );
  return entries.every(([key, value]) => {
    if (key === "publisher") {
      const wanted = normalizeSearchText(String(value));
      return document.publishers.some(
        (publisher) => normalizeSearchText(publisher) === wanted,
      );
    }
    const documentValue =
      document[key as keyof ResearchSearchDocument];
    return (
      typeof documentValue === "string" &&
      normalizeSearchText(documentValue) ===
        normalizeSearchText(String(value))
    );
  });
}

function relevanceScore(
  document: ResearchSearchDocument,
  query: string,
): number {
  const normalizedQuery = normalizeSearchText(query);
  if (!normalizedQuery) return 1;

  const terms = normalizedQuery.split(/\s+/).filter(Boolean);
  const title = normalizeSearchText(document.title);
  const metadata = normalizeSearchText(
    [
      document.vendor,
      document.platform,
      document.family,
      document.version,
      document.status,
      document.channel,
      document.build_number,
      document.change_type,
      document.documented_status,
      document.evidence_state,
      ...document.publishers,
    ]
      .filter(Boolean)
      .join(" "),
  );
  const body = normalizeSearchText(document.text);

  if (
    !terms.every(
      (term) =>
        title.includes(term) ||
        metadata.includes(term) ||
        body.includes(term),
    )
  ) {
    return 0;
  }

  let score = title === normalizedQuery ? 100 : 0;
  if (title.startsWith(normalizedQuery)) score += 35;
  if (title.includes(normalizedQuery)) score += 20;

  for (const term of terms) {
    if (title.split(" ").includes(term)) score += 12;
    else if (title.includes(term)) score += 8;
    if (metadata.includes(term)) score += 4;
    if (body.includes(term)) score += 2;
  }

  return score;
}

export function searchResearchIndex(
  index: ResearchSearchIndex,
  query: string,
  filters: ResearchSearchFilters = {},
  limit = 25,
): ResearchSearchResult[] {
  const boundedLimit = Math.max(1, Math.min(100, limit));

  return index.documents
    .filter((document) => matchesFilter(document, filters))
    .map((document) => ({
      document,
      score: relevanceScore(document, query),
    }))
    .filter((result) => result.score > 0)
    .sort(
      (left, right) =>
        right.score - left.score ||
        (right.document.date || "").localeCompare(
          left.document.date || "",
        ) ||
        left.document.title.localeCompare(right.document.title),
    )
    .slice(0, boundedLimit);
}
