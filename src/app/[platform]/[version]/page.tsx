import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getAllVersionRoutes,
  getHistoricalContext,
  getVersionDetail,
} from "@/lib/sanity.fetch";
import { MilestoneTimeline } from "@/components/ui/MilestoneTimeline";
import { CalendarExport } from "@/components/ui/CalendarExport";
import { VersionInsights } from "@/components/analytics/VersionInsights";
import { ReleaseViewEvent } from "@/components/analytics/AnalyticsEventTracker";
import { TrackedReleaseNotesLink } from "@/components/analytics/TrackedReleaseNotesLink";
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
    return `See the recorded ${platformName} ${version} release timeline: ${milestoneCount} tracked beta and RC milestones through the ${formatDate(publicReleaseDate)} public release.`;
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
    path: `/${encodeURIComponent(slug)}/${encodeURIComponent(ver)}`,
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
    `/${encodeURIComponent(slug)}/${encodeURIComponent(ver)}`
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
      <ReleaseViewEvent
        platform={platform.name}
        version={detail.version}
        releaseStatus={isActive ? "active" : "released"}
      />
      <div className="space-y-16">
        <nav
          aria-label="Breadcrumb"
          className="breadcrumb-nav animate-in"
          style={{ "--delay": 0 } as React.CSSProperties}
        >
          <Link href="/">Overview</Link>
          <span aria-hidden="true">/</span>
          <Link href={`/${slug}`}>{platform.name}</Link>
          <span aria-hidden="true">/</span>
          <span className="text-[var(--text)]" aria-current="page">
            {detail.version}
          </span>
        </nav>

        <header
          className="version-hero animate-in"
          style={
            {
              "--delay": 1,
              "--platform-color": platform.color,
            } as React.CSSProperties
          }
        >
          <div className="version-hero__title">
            <p className="section-kicker">Release record</p>
            <h1>
              {platform.name} <span>{detail.version}</span>
            </h1>
            {detail.versionNote && (
              <p className="version-hero__note">{detail.versionNote}</p>
            )}
          </div>
          <div
            className={`version-status ${
              isActive ? "" : "version-status--released"
            }`}
          >
            {isActive ? "Cycle active" : "Public release"}
          </div>
        </header>

        <dl
          className="metric-rail animate-in"
          style={{ "--delay": 2 } as React.CSSProperties}
          aria-label="Release summary"
        >
          {[
            {
              value: detail.milestones.length,
              label: "Recorded milestones",
            },
            {
              value: cycleDays !== null ? `${cycleDays}d` : "—",
              label: "Beta cycle",
            },
            {
              value: avgInterval !== null ? `${avgInterval}d` : "—",
              label: "Average interval",
            },
            {
              value: detail.publicReleaseDate
                ? formatDate(detail.publicReleaseDate)
                : "TBD",
              label: "Public release",
            },
          ].map((stat, index) => (
            <div
              key={stat.label}
              className="metric-rail__item"
              data-index={String(index + 1).padStart(2, "0")}
            >
              <dt className="stat-label">{stat.label}</dt>
              <dd className="stat-value">{stat.value}</dd>
            </div>
          ))}
        </dl>

        <section
          className="animate-in"
          style={{ "--delay": 3 } as React.CSSProperties}
        >
          <div className="section-heading">
            <div>
              <p className="section-kicker">Dated record</p>
              <h2>Release history.</h2>
            </div>
            <p>
              Every recorded beta, release candidate, revision, and public
              milestone in chronological order.
            </p>
          </div>
          <div className="surface p-5 sm:p-8">
            <MilestoneTimeline milestones={detail.milestones} />
          </div>
        </section>

        <section
          className="animate-in"
          style={{ "--delay": 4 } as React.CSSProperties}
        >
          <div className="section-heading">
            <div>
              <p className="section-kicker">Historical context</p>
              <h2>How this cycle compares.</h2>
            </div>
            <p>
              Pace, intervals, and duration compared with earlier releases on
              the same platform.
            </p>
          </div>
          <VersionInsights
            version={detail}
            samePlatformVersions={historical.samePlatformVersions}
            samePositionVersions={historical.samePositionVersions}
          />
        </section>

        <section
          aria-label="Release actions"
          className="flex flex-wrap gap-3 animate-in"
          style={{ "--delay": 5 } as React.CSSProperties}
        >
          <CalendarExport
            milestones={detail.milestones}
            platform={platform.name}
            version={detail.version}
            versionName={`${platform.name} ${detail.version}`}
          />
          {detail.releaseNotesUrl && (
            <TrackedReleaseNotesLink
              href={detail.releaseNotesUrl}
              platform={platform.name}
              version={detail.version}
              className="button button--secondary"
            >
              Official release notes
              <span aria-hidden="true">↗</span>
            </TrackedReleaseNotesLink>
          )}
        </section>

        {(detail.updatedAt || detail.releaseNotesUrl) && (
          <aside
            aria-label="Data provenance"
            className="surface flex flex-wrap items-center gap-x-3 gap-y-1 p-4 text-xs text-[var(--text-tertiary)]"
          >
            <span className="text-label">Provenance</span>
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
                <TrackedReleaseNotesLink
                  href={detail.releaseNotesUrl}
                  platform={platform.name}
                  version={detail.version}
                  className="text-[var(--accent)] hover:underline"
                >
                  release notes
                </TrackedReleaseNotesLink>
              </span>
            )}
          </aside>
        )}
      </div>
    </>
  );
}
