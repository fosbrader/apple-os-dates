import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ContentCoverageBadge } from "@/components/editorial/ContentCoverage";
import { PortableArticle } from "@/components/editorial/PortableArticle";
import { ProvenancePanel } from "@/components/editorial/Provenance";
import { ReleaseChanges } from "@/components/editorial/ReleaseChanges";
import { JsonLd, type JsonLdValue } from "@/components/seo/JsonLd";
import {
  getAllBuildRoutes,
  getReleaseBuildDetail,
} from "@/lib/sanity.fetch";
import {
  applePlatformPath,
  releaseBuildPath,
  releaseEventPath,
  releaseVersionPath,
} from "@/lib/release-routes";
import {
  absoluteUrl,
  createPageMetadata,
  siteName,
} from "@/lib/site";
import { releaseEventChannelLabel } from "@/lib/release-events";
import { formatDate } from "@/lib/utils";
import {
  getContentCoverage,
} from "@/lib/content-coverage";

interface BuildPageParams {
  platform: string;
  version: string;
  build: string;
}

export async function generateStaticParams() {
  const routes = await getAllBuildRoutes();
  return routes.map(({ platform, version, build }) => ({
    platform,
    version,
    build,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<BuildPageParams>;
}): Promise<Metadata> {
  const resolved = await params;
  const build = await getReleaseBuildDetail(
    resolved.platform,
    resolved.version,
    resolved.build,
  );
  if (!build) {
    return {
      title: "Build Not Found",
      robots: { index: false, follow: false },
    };
  }

  const platformName = build.platform.name;
  const approvedSummary =
    build.editorialReview?.status === "approved"
      ? build.summary
      : undefined;
  const approvedSeo =
    build.editorialReview?.status === "approved"
      ? build.seo
      : undefined;
  const metadata = createPageMetadata({
    socialImage: false,
    title:
      approvedSeo?.title ??
      `${platformName} ${resolved.version} Build ${build.displayBuildNumber ?? build.buildNumber}`,
    description:
      approvedSeo?.description ??
      approvedSummary ??
      `Release record and recorded appearances for ${platformName} ${resolved.version} build ${build.displayBuildNumber ?? build.buildNumber}.`,
    path: releaseBuildPath(
      resolved.platform,
      resolved.version,
      resolved.build,
    ),
  });
  const isIndexable =
    build.editorialReview?.status === "approved" &&
    build.indexEligible &&
    !approvedSeo?.noIndex;

  return {
    ...metadata,
    // Approved build records are dated editorial records; the article
    // type carries their timestamps to crawlers.
    openGraph: isIndexable
      ? {
          ...metadata.openGraph,
          type: "article",
          modifiedTime: build.updatedAt,
        }
      : metadata.openGraph,
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

export default async function ReleaseBuildPage({
  params,
}: {
  params: Promise<BuildPageParams>;
}) {
  const resolved = await params;
  const build = await getReleaseBuildDetail(
    resolved.platform,
    resolved.version,
    resolved.build,
  );
  if (!build) notFound();

  const platform = build.platform;
  const displayBuild = build.displayBuildNumber ?? build.buildNumber;
  const hasBuildSources = Boolean(build.citations?.length);
  const isEditoriallyApproved =
    build.editorialReview?.status === "approved";
  const approvedArticle = isEditoriallyApproved
    ? build.articleBody
    : undefined;
  const approvedChanges = isEditoriallyApproved
    ? build.changes
    : undefined;
  const approvedSummary = isEditoriallyApproved
    ? build.summary
    : undefined;
  const contentCoverage = getContentCoverage({
    article: approvedArticle,
    citations: build.citations,
    changes: approvedChanges,
  });
  const hasBuildArticle = contentCoverage === "fullArticle";
  const versionPath = releaseVersionPath(
    resolved.platform,
    resolved.version,
  );
  const canonicalPath = releaseBuildPath(
    resolved.platform,
    resolved.version,
    resolved.build,
  );
  const canonical = absoluteUrl(canonicalPath);
  const firstAppearance = build.events[0];
  const structuredData: JsonLdValue = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${canonical}#webpage`,
        url: canonical,
        name: `${platform.name} ${resolved.version} Build ${displayBuild}`,
        description:
          approvedSummary ??
          `Release record and recorded appearances for ${platform.name} ${resolved.version} build ${displayBuild}.`,
        datePublished: firstAppearance?.date,
        dateModified: build.updatedAt,
        isPartOf: { "@id": `${absoluteUrl("/")}#website` },
        breadcrumb: { "@id": `${canonical}#breadcrumb` },
        mainEntity: { "@id": `${canonical}#software-build` },
      },
      {
        "@type": "SoftwareApplication",
        "@id": `${canonical}#software-build`,
        name: `${platform.name} ${resolved.version}`,
        softwareVersion: resolved.version,
        identifier: displayBuild,
        applicationCategory: "Operating system",
        datePublished: firstAppearance?.date,
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
            item: absoluteUrl(
              applePlatformPath(resolved.platform),
            ),
          },
          {
            "@type": "ListItem",
            position: 4,
            name: `${platform.name} ${resolved.version}`,
            item: absoluteUrl(versionPath),
          },
          {
            "@type": "ListItem",
            position: 5,
            name: `Build ${displayBuild}`,
            item: canonical,
          },
        ],
      },
    ],
  };
  const scope = Array.from(
    new Set([
      ...(build.deviceScope ?? []),
      ...(build.regionScope ?? []),
      ...(build.languageScope ?? []),
      ...(build.audienceScope ?? []),
    ]),
  );

  return (
    <>
      <JsonLd id="release-build-structured-data" data={structuredData} />
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
          <Link href={versionPath}>{resolved.version}</Link>
          <span aria-hidden="true">/</span>
          <span aria-current="page" className="text-[var(--text)]">
            {displayBuild}
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
            <p className="section-kicker">Release build record</p>
            <h1>
              {platform.name} {resolved.version}{" "}
              <span>{displayBuild}</span>
            </h1>
            {approvedSummary ? (
              <p className="version-hero__note">{approvedSummary}</p>
            ) : null}
            <div className="record-badge-row">
              <ContentCoverageBadge coverage={contentCoverage} />
            </div>
          </div>
          <div
            className={`version-status ${
              build.availabilityState === "available"
                ? "version-status--released"
                : ""
            }`}
          >
            {build.availabilityState ?? "available"}
          </div>
        </header>

        <section className="build-facts" aria-labelledby="build-facts-heading">
          <div>
            <p className="section-kicker">Build identity</p>
            <h2 id="build-facts-heading">Release facts</h2>
          </div>
          <dl>
            <div>
              <dt>Build number</dt>
              <dd>
                <code>{displayBuild}</code>
              </dd>
            </div>
            <div>
              <dt>Version</dt>
              <dd>
                <Link href={versionPath}>
                  {platform.name} {resolved.version}
                </Link>
              </dd>
            </div>
            <div>
              <dt>Appearances</dt>
              <dd>{build.events.length}</dd>
            </div>
            <div>
              <dt>Scope</dt>
              <dd>{scope.length ? scope.join(", ") : "General"}</dd>
            </div>
          </dl>
        </section>

        {build.events.length > 0 ? (
          <section aria-labelledby="build-appearances-heading">
            <div className="section-heading">
              <div>
                <p className="section-kicker">Channel history</p>
                <h2 id="build-appearances-heading">
                  Recorded appearances
                </h2>
              </div>
              <p>
                A build can appear in more than one channel. These entries stay
                separate instead of being collapsed.
              </p>
            </div>
            <ol className="build-appearance-list">
              {build.events.map((event) => (
                <li key={event._id}>
                  <time dateTime={event.date}>
                    {formatDate(event.date)}
                  </time>
                  <div>
                    <h3>{event.label}</h3>
                    <p>
                      {releaseEventChannelLabel(
                        event.normalizedChannel,
                      )}
                      {event.versionLabelAtAppearance
                        ? ` · labeled ${event.versionLabelAtAppearance}`
                        : ""}
                    </p>
                  </div>
                  {event.slug?.current ? (
                    <Link
                      href={releaseEventPath(
                        resolved.platform,
                        resolved.version,
                        event.slug.current,
                      )}
                    >
                      Appearance
                    </Link>
                  ) : null}
                </li>
              ))}
            </ol>
          </section>
        ) : null}

        {hasBuildArticle ? (
          <section aria-labelledby="build-article-heading">
            <div className="section-heading">
              <div>
                <p className="section-kicker">Release notes</p>
                <h2 id="build-article-heading">Release notes</h2>
              </div>
              <p>
                Original editorial synthesis. Linked references appear with
                the claims they support and in the source ledger.
              </p>
            </div>
            <PortableArticle
              blocks={approvedArticle}
              citations={build.citations}
            />
          </section>
        ) : hasBuildSources ? (
          <PortableArticle
            citations={build.citations}
            referenceKicker="Build evidence"
            referenceTitle="Build sources"
            referenceDescription="These sources support the build identity, appearances, or availability. A researched release-notes article has not been added."
          />
        ) : null}

        <ReleaseChanges changes={approvedChanges} targetId={build._id} />

        <ProvenancePanel
          status={build.provenanceStatus}
          updatedAt={build.updatedAt}
          audits={build.auditBatches}
          review={build.editorialReview}
        />

        <p className="text-sm text-[var(--text-tertiary)]">
          Found an error or another source?{" "}
          <Link className="text-[var(--accent)]" href="/submit/">
            Submit a correction
          </Link>
          .
        </p>
      </article>
    </>
  );
}
