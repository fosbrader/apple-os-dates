/**
 * Prints a read-only coverage inventory for the published Sanity corpus.
 *
 * Run with:
 *   npm run sanity:coverage:report
 *   npm run sanity:coverage:report -- --json
 */

import { getCliClient } from "sanity/cli";
import {
  LAUNCH_CONTENT_DATASET,
  LAUNCH_CONTENT_PROJECT_ID,
  assertLaunchTarget,
} from "./lib/launch-content-ingestion";

const apiVersion = "2024-01-01";

type CoverageLevel = "fullArticle" | "sourceLinked" | "timelineOnly";

interface VersionCoverageRow {
  _id: string;
  platform: string;
  version: string;
  reviewStatus?: string;
  articleLength: number;
  citationCount: number;
  hasReleaseNotesUrl: boolean;
}

interface EventCoverageRow {
  _id: string;
  releaseVersionId: string;
  reviewStatus?: string;
  articleLength: number;
  citationCount: number;
  changeCount: number;
}

interface CoverageSnapshot {
  versions: VersionCoverageRow[];
  events: EventCoverageRow[];
}

interface CoverageCounts {
  total: number;
  fullArticle: number;
  sourceLinked: number;
  timelineOnly: number;
}

function versionCoverage(row: VersionCoverageRow): CoverageLevel {
  if (
    row.reviewStatus === "approved" &&
    row.articleLength >= 80 &&
    row.citationCount > 0
  ) {
    return "fullArticle";
  }
  if (row.citationCount > 0 || row.hasReleaseNotesUrl) {
    return "sourceLinked";
  }
  return "timelineOnly";
}

function eventCoverage(row: EventCoverageRow): CoverageLevel {
  if (
    row.reviewStatus === "approved" &&
    row.articleLength >= 80 &&
    row.citationCount > 0
  ) {
    return "fullArticle";
  }
  if (row.citationCount > 0) {
    return "sourceLinked";
  }
  return "timelineOnly";
}

function countCoverage<T>(
  rows: T[],
  classify: (row: T) => CoverageLevel,
): CoverageCounts {
  const result: CoverageCounts = {
    total: rows.length,
    fullArticle: 0,
    sourceLinked: 0,
    timelineOnly: 0,
  };
  for (const row of rows) {
    result[classify(row)] += 1;
  }
  return result;
}

function majorFamily(version: string): string {
  return version.split(".")[0] || version;
}

function printCounts(label: string, counts: CoverageCounts): void {
  console.log(
    `${label}: ${counts.total} total · ${counts.fullArticle} full article · ${counts.sourceLinked} source-linked · ${counts.timelineOnly} timeline-only`,
  );
}

async function run(): Promise<void> {
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
  const snapshot = await publishedClient.fetch<CoverageSnapshot>(`
    {
      "versions": *[_type == "releaseVersion"] | order(
        releaseTrain->platform->sortOrder asc,
        releaseTrain->majorVersion desc,
        version desc
      ) {
        _id,
        "platform": releaseTrain->platform->name,
        version,
        "reviewStatus": editorialReview.status,
        "articleLength": length(coalesce(pt::text(overview), "")),
        "citationCount": count(citations),
        "hasReleaseNotesUrl": defined(releaseNotesUrl)
      },
      "events": *[_type == "releaseEvent"] {
        _id,
        "releaseVersionId": releaseVersion._ref,
        "reviewStatus": editorialReview.status,
        "articleLength": length(coalesce(pt::text(articleBody), "")),
        "citationCount": count(citations),
        "changeCount": count(
          changes[change->editorialReview.status == "approved"]
        )
      }
    }
  `);

  const versionCounts = countCoverage(
    snapshot.versions,
    versionCoverage,
  );
  const eventCounts = countCoverage(snapshot.events, eventCoverage);
  const richStructuredEvents = snapshot.events.filter(
    (event) =>
      event.reviewStatus === "approved" &&
      event.citationCount > 0 &&
      event.changeCount > 0,
  ).length;
  const backlog = new Map<string, VersionCoverageRow[]>();
  for (const version of snapshot.versions) {
    if (versionCoverage(version) === "fullArticle") continue;
    const key = `${version.platform} ${majorFamily(version.version)}`;
    const existing = backlog.get(key) || [];
    existing.push(version);
    backlog.set(key, existing);
  }
  const backlogRows = [...backlog.entries()]
    .map(([family, versions]) => ({
      family,
      versions: versions
        .map((version) => version.version)
        .sort((left, right) =>
          right.localeCompare(left, undefined, { numeric: true }),
        ),
    }))
    .sort((left, right) => {
      const leftMajor = Number(left.family.match(/(\d+)$/)?.[1] || 0);
      const rightMajor = Number(
        right.family.match(/(\d+)$/)?.[1] || 0,
      );
      return (
        rightMajor - leftMajor ||
        left.family.localeCompare(right.family)
      );
    });

  if (process.argv.includes("--json")) {
    console.log(
      JSON.stringify(
        {
          target: {
            projectId: LAUNCH_CONTENT_PROJECT_ID,
            dataset: LAUNCH_CONTENT_DATASET,
          },
          versions: versionCounts,
          events: eventCounts,
          richStructuredEvents,
          backlog: backlogRows,
        },
        null,
        2,
      ),
    );
    return;
  }

  console.log(
    `Published coverage for ${LAUNCH_CONTENT_PROJECT_ID}/${LAUNCH_CONTENT_DATASET}`,
  );
  printCounts("Versions", versionCounts);
  printCounts("Appearances", eventCounts);
  console.log(
    `Appearances with approved structured changes: ${richStructuredEvents}`,
  );
  console.log("");
  console.log("Version families still needing full articles:");
  for (const row of backlogRows) {
    console.log(
      `- ${row.family}: ${row.versions.length} (${row.versions.join(", ")})`,
    );
  }
}

run().catch((error) => {
  console.error(
    "Coverage report failed:",
    error instanceof Error ? error.message : String(error),
  );
  process.exit(1);
});
