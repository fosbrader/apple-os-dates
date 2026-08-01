import type { Metadata } from "next";
import Link from "next/link";
import { notFound, permanentRedirect } from "next/navigation";
import {
  ContentCoverageBadge,
  ContentCoverageDisclosure,
} from "@/components/editorial/ContentCoverage";
import { PortableArticle } from "@/components/editorial/PortableArticle";
import { ProvenancePanel } from "@/components/editorial/Provenance";
import { ReleaseChanges } from "@/components/editorial/ReleaseChanges";
import { JsonLd, type JsonLdValue } from "@/components/seo/JsonLd";
import {
  getAllEventRoutes,
  getAnalyticsData,
  getReleaseEventDetail,
  getVersionDetail,
  getVersionEvents,
} from "@/lib/sanity.fetch";
import {
  applePlatformPath,
  releaseBuildPath,
  releaseEventPath,
  releaseVersionPath,
} from "@/lib/release-routes";
import {
  legacyEventsForVersion,
  releaseEventChannelLabel,
  releaseEventForLegacySource,
  releaseEventsForVersion,
} from "@/lib/release-events";
import { absoluteUrl, createPageMetadata, siteName } from "@/lib/site";
import { formatDate } from "@/lib/utils";
import { getContentCoverage } from "@/lib/content-coverage";

interface EventPageParams {
  platform: string;
  version: string;
  event: string;
}

async function findEvent({ platform, version, event }: EventPageParams) {
  const [release, firstClassEvent, firstClassEvents] = await Promise.all([
    getVersionDetail(platform, version),
    getReleaseEventDetail(platform, version, event),
    getVersionEvents(platform, version),
  ]);
  const events = release
    ? releaseEventsForVersion(release, firstClassEvents)
    : [];
  const directMatch = events.find(
    (candidate) => candidate.slug?.current === event,
  );
  const legacyMatch = release
    ? legacyEventsForVersion(release).find(
        (candidate) => candidate.slug?.current === event,
      )
    : undefined;
  const migratedMatch =
    release && legacyMatch?.legacySourceId
      ? releaseEventForLegacySource(
          release,
          legacyMatch.legacySourceId,
          firstClassEvents,
        )
      : undefined;
  // The route-specific query is authoritative for page content and metadata.
  // The aggregate event list can briefly retain an older cache entry after an
  // editorial publish; it remains useful for chronology and adjacent links.
  const releaseEvent =
    firstClassEvent ??
    directMatch ??
    (migratedMatch
      ? events.find((candidate) => candidate._id === migratedMatch._id)
      : undefined) ??
    migratedMatch;

  return { release, releaseEvent, events };
}

export async function generateStaticParams() {
  const [releases, firstClassRoutes] = await Promise.all([
    getAnalyticsData(),
    getAllEventRoutes(),
  ]);
  const params = new Map<
    string,
    { platform: string; version: string; event: string }
  >();

  for (const release of releases) {
    const platform = release.releaseTrain.platform.slug.current;

    for (const event of legacyEventsForVersion(release)) {
      const route = {
        platform,
        version: release.version,
        event: event.slug?.current ?? event._id,
      };
      params.set(`${route.platform}:${route.version}:${route.event}`, route);
    }
  }

  for (const route of firstClassRoutes) {
    params.set(`${route.platform}:${route.version}:${route.event}`, {
      platform: route.platform,
      version: route.version,
      event: route.event,
    });
  }

  return Array.from(params.values());
}

export async function generateMetadata({
  params,
}: {
  params: Promise<EventPageParams>;
}): Promise<Metadata> {
  const resolved = await params;
  const { release, releaseEvent } = await findEvent(resolved);
  if (!release || !releaseEvent) {
    return {
      title: "Release Appearance Not Found",
      robots: { index: false, follow: false },
    };
  }

  const platformName = release.releaseTrain.platform.name;
  const approvedSeo =
    releaseEvent.editorialReview?.status === "approved"
      ? releaseEvent.seo
      : undefined;
  const isIndexable =
    releaseEvent.editorialReview?.status === "approved" &&
    releaseEvent.isIndexable === true &&
    approvedSeo?.noIndex !== true;

  const pageMetadata = createPageMetadata({
    socialImage: false,
    title:
      approvedSeo?.title ??
      `${platformName} ${release.version} ${releaseEvent.label}`,
    description:
      approvedSeo?.description ??
      (releaseEvent.citations?.length
        ? `${releaseEvent.label} appeared on ${formatDate(releaseEvent.date)}. See its recorded context, evidence state, and linked sources.`
        : `${releaseEvent.label} appeared on ${formatDate(releaseEvent.date)}. See its recorded context and current evidence state.`),
    path: releaseEventPath(
      resolved.platform,
      resolved.version,
      releaseEvent.slug?.current ?? resolved.event,
    ),
  });

  return {
    ...pageMetadata,
    // Approved, citation-backed appearance pages are dated editorial
    // records; the article type carries their timestamps to crawlers.
    openGraph: isIndexable
      ? {
          ...pageMetadata.openGraph,
          type: "article",
          publishedTime: releaseEvent.date,
          modifiedTime: release.updatedAt,
        }
      : pageMetadata.openGraph,
    // Setting `robots` replaces (not merges) the root layout's value, so
    // the indexable branch must restate the googleBot snippet directives.
    robots: isIndexable
      ? {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            "max-image-preview": "large",
            "max-snippet": -1,
            "max-video-preview": -1,
          },
        }
      : { index: false, follow: true },
  };
}

export default async function ReleaseEventPage({
  params,
}: {
  params: Promise<EventPageParams>;
}) {
  const resolved = await params;
  const { release, releaseEvent, events } = await findEvent(resolved);
  if (!release || !releaseEvent) notFound();

  if (
    releaseEvent.slug?.current &&
    releaseEvent.slug.current !== resolved.event
  ) {
    permanentRedirect(
      releaseEventPath(
        resolved.platform,
        resolved.version,
        releaseEvent.slug.current,
      ),
    );
  }

  const currentIndex = events.findIndex(
    (candidate) => candidate._id === releaseEvent._id,
  );
  const previous = currentIndex > 0 ? events[currentIndex - 1] : undefined;
  const next =
    currentIndex >= 0 && currentIndex < events.length - 1
      ? events[currentIndex + 1]
      : undefined;
  const platform = release.releaseTrain.platform;
  const hasEventSources = Boolean(releaseEvent.citations?.length);
  const isEditoriallyApproved =
    releaseEvent.editorialReview?.status === "approved";
  const approvedArticle = isEditoriallyApproved
    ? releaseEvent.articleBody
    : undefined;
  const approvedChanges = isEditoriallyApproved
    ? releaseEvent.changes
    : undefined;
  const contentCoverage = getContentCoverage({
    article: approvedArticle,
    citations: releaseEvent.citations,
    changes: approvedChanges,
  });
  const hasEventArticle = contentCoverage === "fullArticle";
  const canonical = absoluteUrl(
    releaseEventPath(resolved.platform, resolved.version, resolved.event),
  );
  const structuredData: JsonLdValue = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${canonical}#webpage`,
        url: canonical,
        name: `${platform.name} ${release.version} ${releaseEvent.label}`,
        datePublished: releaseEvent.date,
        dateModified: release.updatedAt,
        isPartOf: { "@id": `${absoluteUrl("/")}#website` },
        breadcrumb: { "@id": `${canonical}#breadcrumb` },
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${canonical}#breadcrumb`,
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
            item: absoluteUrl(applePlatformPath(resolved.platform)),
          },
          {
            "@type": "ListItem",
            position: 4,
            name: `${platform.name} ${release.version}`,
            item: absoluteUrl(
              releaseVersionPath(resolved.platform, resolved.version),
            ),
          },
          {
            "@type": "ListItem",
            position: 5,
            name: releaseEvent.label,
            item: canonical,
          },
        ],
      },
    ],
  };

  return (
    <>
      <JsonLd id="release-event-structured-data" data={structuredData} />
      <article className="space-y-16">
        <nav aria-label="Breadcrumb" className="breadcrumb-nav">
          <Link href="/">Version Record</Link>
          <span aria-hidden="true">/</span>
          <Link href="/apple/">Apple</Link>
          <span aria-hidden="true">/</span>
          <Link href={applePlatformPath(resolved.platform)}>
            {platform.name}
          </Link>
          <span aria-hidden="true">/</span>
          <Link href={releaseVersionPath(resolved.platform, resolved.version)}>
            {platform.name} {release.version}
          </Link>
          <span aria-hidden="true">/</span>
          <span aria-current="page" className="text-[var(--text)]">
            {releaseEvent.label}
          </span>
        </nav>

        <header
          className="version-hero"
          style={
            {
              "--platform-color": platform.color,
            } as React.CSSProperties
          }
        >
          <div className="version-hero__title">
            <p className="section-kicker">Release appearance</p>
            <h1>
              {platform.name} {release.version}{" "}
              <span>{releaseEvent.label}</span>
            </h1>
            <p className="version-hero__note">
              <time dateTime={releaseEvent.date}>
                {formatDate(releaseEvent.date)}
              </time>
            </p>
            <div className="record-badge-row">
              <ContentCoverageBadge coverage={contentCoverage} />
            </div>
          </div>
          <div className="version-status">
            {releaseEventChannelLabel(releaseEvent.normalizedChannel)}
          </div>
        </header>

        <section className="release-appearance-summary">
          <div>
            <p className="section-kicker">Recorded context</p>
            <h2>About this appearance</h2>
          </div>
          <div>
            {releaseEvent.note ? (
              <p>{releaseEvent.note}</p>
            ) : (
              <ContentCoverageDisclosure coverage={contentCoverage} />
            )}
            <dl>
              <div>
                <dt>Date</dt>
                <dd>{formatDate(releaseEvent.date)}</dd>
              </div>
              <div>
                <dt>Availability</dt>
                <dd>{releaseEvent.availabilityState ?? "available"}</dd>
              </div>
              <div>
                <dt>Revision</dt>
                <dd>{releaseEvent.isRevision ? "Yes" : "No"}</dd>
              </div>
              {releaseEvent.build?.buildNumber ? (
                <div>
                  <dt>Build</dt>
                  <dd>
                    <Link
                      href={releaseBuildPath(
                        resolved.platform,
                        resolved.version,
                        releaseEvent.build.buildNumber,
                      )}
                    >
                      <code>
                        {releaseEvent.build.displayBuildNumber ??
                          releaseEvent.build.buildNumber}
                      </code>
                    </Link>
                  </dd>
                </div>
              ) : null}
            </dl>
          </div>
        </section>

        {hasEventArticle ? (
          <section aria-labelledby="event-article-heading">
            <div className="section-heading">
              <div>
                <p className="section-kicker">Release notes</p>
                <h2 id="event-article-heading">What changed</h2>
              </div>
              <p>
                Original editorial synthesis. Linked references appear with the
                claims they support and in the source ledger.
              </p>
            </div>
            <PortableArticle
              blocks={approvedArticle}
              citations={releaseEvent.citations}
            />
          </section>
        ) : hasEventSources ? (
          <PortableArticle
            citations={releaseEvent.citations}
            referenceKicker="Chronology evidence"
            referenceTitle="Appearance sources"
            referenceDescription="These sources support the recorded date, channel, or availability. A researched release-notes article has not been added."
          />
        ) : null}

        <ReleaseChanges changes={approvedChanges} targetId={releaseEvent._id} />

        <nav
          aria-label="Adjacent release appearances"
          className="adjacent-release-nav"
        >
          {previous ? (
            <Link
              href={releaseEventPath(
                resolved.platform,
                resolved.version,
                previous.slug?.current ?? previous._id,
              )}
            >
              <span>Previous appearance</span>
              <strong>{previous.label}</strong>
            </Link>
          ) : (
            <span />
          )}
          {next ? (
            <Link
              href={releaseEventPath(
                resolved.platform,
                resolved.version,
                next.slug?.current ?? next._id,
              )}
            >
              <span>Next appearance</span>
              <strong>{next.label}</strong>
            </Link>
          ) : null}
        </nav>

        <ProvenancePanel
          status={releaseEvent.provenanceStatus}
          updatedAt={release.updatedAt}
          audits={releaseEvent.auditBatches}
          review={releaseEvent.editorialReview}
        />
      </article>
    </>
  );
}
