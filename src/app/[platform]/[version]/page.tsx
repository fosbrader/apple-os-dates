import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getAllVersionRoutes,
  getHistoricalContext,
  getVersionDetail,
} from "@/lib/sanity.fetch";
import { PlatformBadge } from "@/components/ui/PlatformBadge";
import { MilestoneTimeline } from "@/components/ui/MilestoneTimeline";
import { CalendarExport } from "@/components/ui/CalendarExport";
import { VersionInsights } from "@/components/analytics/VersionInsights";
import { JsonLd, type JsonLdValue } from "@/components/seo/JsonLd";
import {
  formatDate,
  computeBetaCycleDays,
  computeAverageBetaInterval,
} from "@/lib/utils";
import {
  absoluteUrl,
  createPageMetadata,
  siteName,
} from "@/lib/site";

function versionDescription(
  platformName: string,
  version: string,
  milestoneCount: number,
  publicReleaseDate?: string
): string {
  if (publicReleaseDate) {
    return `See the complete ${platformName} ${version} release timeline: ${milestoneCount} tracked beta and RC milestones through the ${formatDate(publicReleaseDate)} public release.`;
  }

  return `Track ${platformName} ${version} through ${milestoneCount} beta and RC milestones, with release dates, cycle analytics, and the latest status.`;
}

export async function generateStaticParams() {
  const routes = await getAllVersionRoutes();
  return routes.map(({ platform, version }) => ({ platform, version }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ platform: string; version: string }>;
}): Promise<Metadata> {
  const { platform: slug, version: ver } = await params;
  const detail = await getVersionDetail(slug, ver);
  if (!detail) {
    return {
      title: "Version Not Found",
      robots: { index: false, follow: false },
    };
  }

  const platformName = detail.releaseTrain.platform.name;

  return createPageMetadata({
    title: `${platformName} ${detail.version} Release Dates`,
    description: versionDescription(
      platformName,
      detail.version,
      detail.milestones.length,
      detail.publicReleaseDate
    ),
    path: `/${encodeURIComponent(slug)}/${encodeURIComponent(ver)}/`,
  });
}

export default async function VersionDetailPage({
  params,
}: {
  params: Promise<{ platform: string; version: string }>;
}) {
  const { platform: slug, version: ver } = await params;
  const [detail, historical] = await Promise.all([
    getVersionDetail(slug, ver),
    getHistoricalContext(slug, ver),
  ]);

  if (!detail) notFound();

  const platform = detail.releaseTrain.platform;
  const cycleDays = computeBetaCycleDays(detail);
  const avgInterval = computeAverageBetaInterval(detail.milestones);
  const isActive = !detail.publicReleaseDate;
  const description = versionDescription(
    platform.name,
    detail.version,
    detail.milestones.length,
    detail.publicReleaseDate
  );
  const canonical = absoluteUrl(
    `/${encodeURIComponent(slug)}/${encodeURIComponent(ver)}/`
  );
  const platformUrl = absoluteUrl(`/${encodeURIComponent(slug)}/`);
  const webpageId = `${canonical}#webpage`;
  const breadcrumbId = `${canonical}#breadcrumb`;
  const datasetId = `${canonical}#release-dataset`;
  const firstMilestone = detail.milestones[0];
  const lastMilestone = detail.milestones[detail.milestones.length - 1];
  const structuredData: JsonLdValue = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": webpageId,
        url: canonical,
        name: `${platform.name} ${detail.version} Release Dates`,
        description,
        dateModified: detail.updatedAt,
        isPartOf: { "@id": `${absoluteUrl("/")}#website` },
        breadcrumb: { "@id": breadcrumbId },
        mainEntity: { "@id": datasetId },
      },
      {
        "@type": "BreadcrumbList",
        "@id": breadcrumbId,
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: siteName,
            item: absoluteUrl("/"),
          },
          {
            "@type": "ListItem",
            position: 2,
            name: platform.name,
            item: platformUrl,
          },
          {
            "@type": "ListItem",
            position: 3,
            name: `${platform.name} ${detail.version}`,
            item: canonical,
          },
        ],
      },
      {
        "@type": "Dataset",
        "@id": datasetId,
        url: canonical,
        name: `${platform.name} ${detail.version} Release Timeline`,
        description,
        dateModified: detail.updatedAt,
        temporalCoverage:
          firstMilestone && lastMilestone
            ? `${firstMilestone.date}/${lastMilestone.date}`
            : undefined,
        isAccessibleForFree: true,
        about: {
          "@type": "SoftwareApplication",
          name: `${platform.name} ${detail.version}`,
          applicationCategory: "Operating system",
        },
        variableMeasured: [
          "Release milestone",
          "Release date",
          "Beta cycle length",
        ],
        citation: detail.releaseNotesUrl || undefined,
        sameAs: detail.releaseNotesUrl || undefined,
      },
    ],
  };

  return (
    <>
      <JsonLd id="version-structured-data" data={structuredData} />
      <div className="space-y-10">
      {/* Breadcrumb */}
      <nav
        className="flex items-center gap-2 text-sm text-[var(--text-tertiary)] animate-in"
        style={{ "--delay": 0 } as React.CSSProperties}
      >
        <Link href="/" className="hover:text-[var(--text-secondary)]">
          Home
        </Link>
        <span>/</span>
        <Link
          href={`/${slug}`}
          className="hover:text-[var(--text-secondary)]"
        >
          {platform.name}
        </Link>
        <span>/</span>
        <span
          className="text-[var(--text)] font-mono"
          aria-current="page"
        >
          {detail.version}
        </span>
      </nav>

      {/* Header */}
      <div
        className="flex flex-col sm:flex-row sm:items-center gap-4 animate-in"
        style={{ "--delay": 1 } as React.CSSProperties}
      >
        <PlatformBadge name={platform.name} color={platform.color} size="lg" />
        <div>
          <h1 className="text-heading">
            {platform.name}{" "}
            <span className="font-mono">{detail.version}</span>
          </h1>
          {detail.versionNote && (
            <p className="text-sm text-[var(--accent)] italic mt-0.5">
              {detail.versionNote}
            </p>
          )}
        </div>
        {isActive && (
          <span className="self-start sm:ml-auto badge badge-active text-sm px-4 py-1.5">
            In Beta
          </span>
        )}
      </div>

      {/* Stats */}
      <div
        className="grid grid-cols-2 md:grid-cols-4 gap-px bg-[var(--border)] rounded-2xl overflow-hidden animate-in"
        style={{ "--delay": 2 } as React.CSSProperties}
      >
        <div className="bg-[var(--bg)] text-center py-5 px-4">
          <div className="stat-value">{detail.milestones.length}</div>
          <div className="stat-label">Releases</div>
        </div>
        <div className="bg-[var(--bg)] text-center py-5 px-4">
          <div className="stat-value">
            {cycleDays !== null ? `${cycleDays}d` : "—"}
          </div>
          <div className="stat-label">Beta Cycle</div>
        </div>
        <div className="bg-[var(--bg)] text-center py-5 px-4">
          <div className="stat-value">
            {avgInterval !== null ? `${avgInterval}d` : "—"}
          </div>
          <div className="stat-label">Avg. Interval</div>
        </div>
        <div className="bg-[var(--bg)] text-center py-5 px-4">
          <div className="stat-value text-xl">
            {detail.publicReleaseDate
              ? formatDate(detail.publicReleaseDate)
              : "TBD"}
          </div>
          <div className="stat-label">Public Release</div>
        </div>
      </div>

      {/* Milestones */}
      <section
        className="animate-in"
        style={{ "--delay": 3 } as React.CSSProperties}
      >
        <h2 className="text-subheading mb-5">Release History</h2>
        <div className="surface p-6">
          <MilestoneTimeline milestones={detail.milestones} />
        </div>
      </section>

      {/* Insights & Analytics */}
      <section
        className="animate-in"
        style={{ "--delay": 4 } as React.CSSProperties}
      >
        <h2 className="text-subheading mb-5">Insights</h2>
        <VersionInsights
          version={detail}
          samePlatformVersions={historical.samePlatformVersions}
          samePositionVersions={historical.samePositionVersions}
        />
      </section>

      {/* Actions */}
      <section
        className="flex flex-wrap gap-3 animate-in"
        style={{ "--delay": 5 } as React.CSSProperties}
      >
        <CalendarExport
          milestones={detail.milestones}
          versionName={`${platform.name} ${detail.version}`}
        />
        {detail.releaseNotesUrl && (
          <a
            href={detail.releaseNotesUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg surface text-[var(--accent)] hover:bg-[var(--bg-subtle)] transition-colors"
          >
            Release Notes &rarr;
          </a>
        )}
      </section>

      {(detail.updatedAt || detail.releaseNotesUrl) && (
        <aside
          aria-label="Data provenance"
          className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-[var(--text-tertiary)]"
        >
          {detail.updatedAt && (
            <span>
              Last updated{" "}
              <time dateTime={detail.updatedAt}>
                {formatDate(detail.updatedAt)}
              </time>
            </span>
          )}
          {detail.updatedAt && detail.releaseNotesUrl && (
            <span aria-hidden="true">·</span>
          )}
          {detail.releaseNotesUrl && (
            <span>
              Source:{" "}
              <a
                href={detail.releaseNotesUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[var(--accent)] hover:underline"
              >
                Release notes
              </a>
            </span>
          )}
        </aside>
      )}
      </div>
    </>
  );
}
