import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getAnalyticsData,
  getHistoricalContext,
  getVersionDetail,
  getVersionChanges,
  getVersionEvents,
} from "@/lib/sanity.fetch";
import { CalendarExport } from "@/components/ui/CalendarExport";
import { ContentCoverageBadge } from "@/components/editorial/ContentCoverage";
import { PortableArticle } from "@/components/editorial/PortableArticle";
import { ProvenancePanel } from "@/components/editorial/Provenance";
import { ReleaseChanges } from "@/components/editorial/ReleaseChanges";
import { ReleaseEventTimeline } from "@/components/editorial/ReleaseEventTimeline";
import {
  VersionForecastCard,
  VersionInsights,
} from "@/components/analytics/VersionInsights";
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
import { buildReleaseForecasts } from "@/lib/forecasts";
import {
  getReleaseStatus,
  type ReleaseStatus,
} from "@/lib/types";
import {
  applePlatformPath,
  releaseVersionPath,
} from "@/lib/release-routes";
import { releaseEventsForVersion } from "@/lib/release-events";
import {
  getContentCoverage,
} from "@/lib/content-coverage";
import { factualDataset } from "@/lib/structured-data";

function versionTitle(
  platformName: string,
  version: string,
  milestoneCount: number,
  releaseStatus: ReleaseStatus,
  publicReleaseDate?: string,
  hasFullArticle = false,
): string {
  if (hasFullArticle) {
    return releaseStatus === "active"
      ? `${platformName} ${version} Beta Release Notes & Timeline`
      : `${platformName} ${version} Release Notes, Changes & Timeline`;
  }

  if (releaseStatus === "superseded") {
    return `${platformName} ${version} Beta History`;
  }

  if (
    releaseStatus === "released" &&
    publicReleaseDate &&
    milestoneCount <= 1
  ) {
    return `${platformName} ${version} Release Date`;
  }

  if (releaseStatus === "released" && publicReleaseDate) {
    return `${platformName} ${version} Beta & Release Dates`;
  }

  return `${platformName} ${version} Beta Dates & Forecast`;
}

function versionDescription(
  platformName: string,
  version: string,
  milestoneCount: number,
  releaseStatus: ReleaseStatus,
  publicReleaseDate?: string,
  hasFullArticle = false,
): string {
  if (hasFullArticle) {
    const lifecycleTimeline =
      releaseStatus === "active"
        ? "active beta timeline"
        : releaseStatus === "superseded"
          ? "superseded beta timeline"
          : "release timeline";
    const releaseDate =
      releaseStatus === "released" && publicReleaseDate
        ? `, including the ${formatDate(publicReleaseDate)} public release`
        : "";

    return `Read the source-backed ${platformName} ${version} release-notes overview, documented changes, citations, and complete ${lifecycleTimeline}${releaseDate}.`;
  }

  if (releaseStatus === "superseded") {
    return `${platformName} ${version} was superseded before a public release. See its ${milestoneCount} recorded beta and release-candidate milestone${milestoneCount === 1 ? "" : "s"}.`;
  }

  if (
    releaseStatus === "released" &&
    publicReleaseDate &&
    milestoneCount <= 1
  ) {
    return `${platformName} ${version} was publicly released on ${formatDate(publicReleaseDate)}. See the recorded release date and historical Apple OS index.`;
  }

  if (releaseStatus === "released" && publicReleaseDate) {
    return `See ${milestoneCount} recorded milestones for ${platformName} ${version}, including beta, RC, and its ${formatDate(publicReleaseDate)} public release.`;
  }

  return `${platformName} ${version} is in beta. Track ${milestoneCount} recorded milestone${milestoneCount === 1 ? "" : "s"}, current cycle analytics, and history-based next-beta and public-release forecasts.`;
}

/**
 * Legacy tree: every /:platform/:version URL 308-redirects to the
 * /apple/-prefixed route before filesystem routing, so nothing is
 * prerendered here. The /apple/ route declares its own static params.
 */
export async function generateStaticParams() {
  return [];
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
  const releaseStatus = getReleaseStatus(detail);
  const approvedArticle =
    detail.editorialReview?.status === "approved"
      ? detail.overview
      : undefined;
  const hasFullArticle =
    getContentCoverage({
      article: approvedArticle,
      citations: detail.citations,
      hasLinkedChronology: Boolean(detail.releaseNotesUrl),
    }) === "fullArticle";

  return createPageMetadata({
    socialImage: false,
    title: versionTitle(
      platformName,
      detail.version,
      detail.milestones.length,
      releaseStatus,
      detail.publicReleaseDate,
      hasFullArticle,
    ),
    description: versionDescription(
      platformName,
      detail.version,
      detail.milestones.length,
      releaseStatus,
      detail.publicReleaseDate,
      hasFullArticle,
    ),
    path: releaseVersionPath(slug, ver),
  });
}

export default async function VersionDetailPage({
  params,
}: {
  params: Promise<{ platform: string; version: string }>;
}) {
  const { platform: slug, version: ver } = await params;
  const [detail, historical, firstClassEvents, versionChanges] =
    await Promise.all([
      getVersionDetail(slug, ver),
      getHistoricalContext(slug, ver),
      getVersionEvents(slug, ver),
      getVersionChanges(slug, ver),
    ]);

  if (!detail) notFound();

  const releaseStatus = getReleaseStatus(detail);
  const isActive = releaseStatus === "active";
  const isReleased = releaseStatus === "released";
  const versionForecast = isActive
    ? buildReleaseForecasts(await getAnalyticsData()).find(
        (forecast) => forecast.release._id === detail._id,
      )
    : undefined;
  const platform = detail.releaseTrain.platform;
  const releaseEvents = releaseEventsForVersion(
    detail,
    firstClassEvents,
  );
  const approvedOverview =
    detail.editorialReview?.status === "approved"
      ? detail.overview
      : undefined;
  const contentCoverage = getContentCoverage({
    article: approvedOverview,
    citations: detail.citations,
    hasLinkedChronology:
      Boolean(detail.releaseNotesUrl) ||
      releaseEvents.some((event) => Boolean(event.citations?.length)),
  });
  const hasVersionArticle = contentCoverage === "fullArticle";
  const cycleDays = computeBetaCycleDays(detail);
  const avgInterval = computeAverageBetaInterval(detail.milestones);
  const description = versionDescription(
    platform.name,
    detail.version,
    detail.milestones.length,
    releaseStatus,
    detail.publicReleaseDate,
    contentCoverage === "fullArticle",
  );
  const pageTitle = versionTitle(
    platform.name,
    detail.version,
    detail.milestones.length,
    releaseStatus,
    detail.publicReleaseDate,
    contentCoverage === "fullArticle",
  );
  const canonical = absoluteUrl(releaseVersionPath(slug, ver));
  const platformUrl = absoluteUrl(applePlatformPath(slug));
  const webpageId = `${canonical}#webpage`;
  const breadcrumbId = `${canonical}#breadcrumb`;
  const datasetId = `${canonical}#release-dataset`;
  const firstMilestone = detail.milestones[0];
  const lastMilestone = detail.milestones[detail.milestones.length - 1];
  const forecastIsAnomaly =
    versionForecast?.status === "paused-window-passed";
  const activeForecastWindow =
    versionForecast?.status === "active" || forecastIsAnomaly
      ? versionForecast.nextMilestoneWindow ??
        versionForecast.publicReleaseWindow
      : undefined;
  const summaryStats =
    releaseStatus === "active"
      ? [
        {
          value: lastMilestone?.label ?? "Awaiting data",
          label: "Latest milestone",
        },
        {
          value: lastMilestone ? formatDate(lastMilestone.date) : "—",
          label: "Last recorded",
        },
        {
          value:
            forecastIsAnomaly
              ? "Anomaly"
              : versionForecast?.nextMilestoneWindow?.likelyLabel ??
                (versionForecast?.publicReleaseWindow
                  ? "Public release"
                  : "Pending"),
          label: forecastIsAnomaly ? "Forecast status" : "Next forecast",
        },
        {
          value: detail.milestones.length,
          label: "Recorded milestones",
        },
      ]
      : isReleased
        ? [
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
      ]
        : [
            {
              value: detail.milestones.length,
              label: "Recorded milestones",
            },
            {
              value: avgInterval !== null ? `${avgInterval}d` : "—",
              label: "Average interval",
            },
            {
              value: lastMilestone
                ? formatDate(lastMilestone.date)
                : "—",
              label: "Last recorded",
            },
            {
              value: "Never shipped",
              label: "Public release",
            },
          ];
  const structuredData: JsonLdValue = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": webpageId,
        url: canonical,
        name: pageTitle,
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
            name: "Apple",
            item: absoluteUrl("/apple/"),
          },
          {
            "@type": "ListItem",
            position: 3,
            name: platform.name,
            item: platformUrl,
          },
          {
            "@type": "ListItem",
            position: 4,
            name: `${platform.name} ${detail.version}`,
            item: canonical,
          },
        ],
      },
      factualDataset({
        "@id": datasetId,
        url: canonical,
        name: `${platform.name} ${detail.version} Release Timeline`,
        description: `Factual structured timeline of recorded beta, release-candidate, build, and public-release appearances for ${platform.name} ${detail.version}.`,
        dateModified: detail.updatedAt,
        temporalCoverage:
          firstMilestone && lastMilestone
            ? `${firstMilestone.date}/${lastMilestone.date}`
            : undefined,
        isAccessibleForFree: true,
        isPartOf: `${platformUrl}#release-dataset`,
        about: {
          "@type": "SoftwareApplication",
          name: `${platform.name} ${detail.version}`,
          applicationCategory: "Operating system",
        },
        variableMeasured: [
          "Release milestone",
          "Release date",
          ...(cycleDays !== null ? ["Beta cycle length"] : []),
        ],
        measurementTechnique:
          "Release dates compiled from official release notes, public announcements, and documented contemporaneous sources.",
        isBasedOn: detail.releaseNotesUrl || undefined,
      }),
    ],
  };

  return (
    <>
      <JsonLd id="version-structured-data" data={structuredData} />
      <ReleaseViewEvent
        platform={platform.name}
        version={detail.version}
        releaseStatus={releaseStatus}
      />
      <div className="space-y-16">
        <nav
          aria-label="Breadcrumb"
          className="breadcrumb-nav animate-in"
          style={{ "--delay": 0 } as React.CSSProperties}
        >
          <Link href="/">Overview</Link>
          <span aria-hidden="true">/</span>
          <Link href="/apple/">Apple</Link>
          <span aria-hidden="true">/</span>
          <Link href={applePlatformPath(slug)}>{platform.name}</Link>
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
            <div className="record-badge-row">
              <ContentCoverageBadge coverage={contentCoverage} />
            </div>
          </div>
          <div
            className={`version-status ${
              isReleased ? "version-status--released" : ""
            }`}
            style={
              releaseStatus === "superseded"
                ? {
                    borderColor: "var(--border-strong)",
                    background: "var(--bg-subtle)",
                    color: "var(--text-tertiary)",
                  }
                : undefined
            }
          >
            {isActive
              ? "Cycle active"
              : isReleased
                ? "Public release"
                : "Superseded"}
          </div>
        </header>

        <dl
          className="metric-rail animate-in"
          style={{ "--delay": 2 } as React.CSSProperties}
          aria-label="Release summary"
        >
          {summaryStats.map((stat, index) => (
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

        {activeForecastWindow && (
          <div
            className="animate-in"
            style={{ "--delay": 3 } as React.CSSProperties}
          >
            <VersionForecastCard forecast={versionForecast} />
          </div>
        )}

        {hasVersionArticle ? (
          <section
            className="animate-in"
            style={{ "--delay": 4 } as React.CSSProperties}
          >
            <div className="section-heading">
              <div>
                <p className="section-kicker">Release notes</p>
                <h2>Overview</h2>
              </div>
              <p>
                Editorial synthesis with inline references and a source ledger
                when citations are available.
              </p>
            </div>
            <PortableArticle
              blocks={approvedOverview}
              citations={detail.citations}
            />
          </section>
        ) : detail.citations?.length ? (
          <PortableArticle
            citations={detail.citations}
            referenceKicker="Chronology evidence"
            referenceTitle="Version sources"
            referenceDescription="These sources support version-level chronology or metadata. A researched version overview has not been added."
          />
        ) : null}

        {versionChanges.length ? (
          <section
            aria-labelledby="version-changes-heading"
            className="animate-in"
            style={{ "--delay": 5 } as React.CSSProperties}
          >
            <div className="section-heading">
              <div>
                <p className="section-kicker">Documented & observed</p>
                <h2 id="version-changes-heading">Changes in this version</h2>
              </div>
              <p>
                Source-linked features, fixes, known issues, removals, and
                community-observed behavior recorded across this version’s
                appearances and verified builds.
              </p>
            </div>
            <ReleaseChanges
              changes={versionChanges}
              platform={slug}
              targetId={detail._id}
              version={detail.version}
            />
          </section>
        ) : null}

        <section
          className="animate-in"
          style={{ "--delay": 6 } as React.CSSProperties}
        >
          <div className="section-heading">
            <div>
              <p className="section-kicker">Milestones</p>
              <h2>Release history</h2>
            </div>
            <p>
              Every recorded channel appearance in chronological order. Open
              an appearance for any available build, scope, notes, and sources.
            </p>
          </div>
          <div className="surface p-5 sm:p-8">
            <ReleaseEventTimeline
              events={releaseEvents}
              platform={slug}
              version={detail.version}
            />
          </div>
        </section>

        <section
          className="animate-in"
          style={{ "--delay": 7 } as React.CSSProperties}
        >
          <div className="section-heading">
            <div>
              <p className="section-kicker">Historical context</p>
              <h2>Cycle comparison</h2>
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
          style={{ "--delay": 8 } as React.CSSProperties}
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

        <ProvenancePanel
          status={detail.provenanceStatus}
          updatedAt={detail.updatedAt}
          audits={detail.auditBatches}
          review={detail.editorialReview}
        />
      </div>
    </>
  );
}
