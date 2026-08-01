import Link from "next/link";
import { JsonLd, type JsonLdValue } from "@/components/seo/JsonLd";
import { getAllPlatforms, getPlatformVersions } from "@/lib/sanity.fetch";
import { getReleaseStatus } from "@/lib/types";
import { applePlatformPath, releaseVersionPath } from "@/lib/release-routes";
import { RESEARCH_DATASET_NAMES } from "@/lib/research/types";
import {
  appleReleaseDatasetId,
  factualDataset,
} from "@/lib/structured-data";
import {
  absoluteUrl,
  createPageMetadata,
  latestDate,
} from "@/lib/site";
import { formatDate } from "@/lib/utils";

export const metadata = createPageMetadata({
  title: "Apple Software Release History & Release Notes Archive",
  description:
    "Browse Apple software release history, beta timelines, builds, and sourced release notes for iOS, iPadOS, macOS, watchOS, tvOS, and visionOS.",
  path: "/apple/",
});

export default async function AppleCatalogPage() {
  const platforms = await getAllPlatforms();
  const platformRecords = await Promise.all(
    platforms.map(async (platform) => ({
      platform,
      versions: await getPlatformVersions(platform.slug.current),
    })),
  );
  const allVersions = platformRecords.flatMap(({ versions }) => versions);
  const allAppearanceDates = allVersions.flatMap((version) =>
    (version.milestones ?? []).map((milestone) => milestone.date),
  );
  const firstAppearanceDate = allAppearanceDates.reduce<string | undefined>(
    (earliest, date) => (!earliest || date < earliest ? date : earliest),
    undefined,
  );
  const lastAppearanceDate = latestDate(allAppearanceDates);
  const dateModified = latestDate(
    allVersions.map((version) => version.updatedAt),
  );
  const canonical = absoluteUrl("/apple/");
  const datasetId = appleReleaseDatasetId();
  const platformListId = `${canonical}#platforms`;
  const structuredData: JsonLdValue = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        "@id": `${canonical}#page`,
        url: canonical,
        name: "Apple Software Release History & Release Notes Archive",
        description:
          "Independent histories of Apple operating-system versions, beta cycles, public releases, builds, changes, and sources.",
        isPartOf: { "@id": `${absoluteUrl("/")}#website` },
        breadcrumb: { "@id": `${canonical}#breadcrumb` },
        mainEntity: { "@id": datasetId },
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${canonical}#breadcrumb`,
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Version Record",
            item: absoluteUrl("/"),
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Apple software releases",
            item: canonical,
          },
        ],
      },
      factualDataset({
        "@id": datasetId,
        name: "Apple Software Release History",
        description:
          "Factual structured records of Apple operating-system versions, channel appearances, builds, and public-release dates.",
        url: canonical,
        isAccessibleForFree: true,
        dateModified,
        temporalCoverage:
          firstAppearanceDate && lastAppearanceDate
            ? `${firstAppearanceDate}/${lastAppearanceDate}`
            : undefined,
        includedInDataCatalog: {
          "@type": "DataCatalog",
          name: "Version Record",
          url: absoluteUrl("/"),
        },
        distribution: RESEARCH_DATASET_NAMES.flatMap((dataset) => [
          {
            "@type": "DataDownload",
            name: `${dataset}.json`,
            encodingFormat: "application/json",
            contentUrl: absoluteUrl(`/exports/v1/${dataset}.json`),
          },
          {
            "@type": "DataDownload",
            name: `${dataset}.csv`,
            encodingFormat: "text/csv",
            contentUrl: absoluteUrl(`/exports/v1/${dataset}.csv`),
          },
        ]),
        hasPart: platformRecords.map(({ platform }) =>
          `${absoluteUrl(applePlatformPath(platform.slug.current))}#release-dataset`
        ),
      }),
      {
        "@type": "ItemList",
        "@id": platformListId,
        name: "Apple software platform release archives",
        numberOfItems: platformRecords.length,
        itemListElement: platformRecords.map(
          ({ platform, versions }, index) => ({
            "@type": "ListItem",
            position: index + 1,
            name: `${platform.name} release history`,
            url: absoluteUrl(applePlatformPath(platform.slug.current)),
            description: `${versions.length} recorded ${platform.name} software versions.`,
          }),
        ),
      },
    ],
  };

  return (
    <>
      <JsonLd id="apple-catalog-structured-data" data={structuredData} />
      <div className="space-y-16">
        <nav aria-label="Breadcrumb" className="breadcrumb-nav">
          <Link href="/">Version Record</Link>
          <span aria-hidden="true">/</span>
          <span aria-current="page" className="text-[var(--text)]">
            Apple
          </span>
        </nav>

        <header className="content-page__header">
          <div>
            <p className="section-kicker">Catalog 01</p>
            <h1 className="text-display">Apple releases</h1>
          </div>
          <div className="content-page__description space-y-3">
            <p>
              An independent historical record of Apple operating-system release
              cycles. Dates, channel appearances, builds, changes, and sources
              become more detailed as each record is editorially verified.
            </p>
            <p className="text-sm text-[var(--text-tertiary)]">
              This publication is not affiliated with or endorsed by Apple Inc.
            </p>
          </div>
        </header>

        <section aria-labelledby="apple-platforms-heading">
          <div className="section-heading">
            <div>
              <p className="section-kicker">Product tracks</p>
              <h2 id="apple-platforms-heading">Browse by platform</h2>
            </div>
            <p>
              Historical versions remain available while current releases gain
              source-backed articles and build-level records.
            </p>
          </div>

          <div className="archive-catalog-grid">
            {platformRecords.map(({ platform, versions }) => {
              const latest = versions[0];
              const status = latest ? getReleaseStatus(latest) : undefined;

              return (
                <article key={platform._id} className="archive-catalog-card">
                  <div className="archive-catalog-card__heading">
                    <i
                      aria-hidden="true"
                      style={{ background: platform.color }}
                    />
                    <h3>{platform.name}</h3>
                  </div>
                  <p>
                    {versions.length} recorded version
                    {versions.length === 1 ? "" : "s"}
                  </p>
                  {latest ? (
                    <dl>
                      <div>
                        <dt>Latest record</dt>
                        <dd>
                          <Link
                            href={releaseVersionPath(
                              platform.slug.current,
                              latest.version,
                            )}
                          >
                            {platform.name} {latest.version}
                          </Link>
                        </dd>
                      </div>
                      <div>
                        <dt>Status</dt>
                        <dd>{status}</dd>
                      </div>
                      <div>
                        <dt>Public date</dt>
                        <dd>
                          {latest.publicReleaseDate
                            ? formatDate(latest.publicReleaseDate)
                            : "—"}
                        </dd>
                      </div>
                    </dl>
                  ) : null}
                  <Link
                    className="text-link"
                    href={applePlatformPath(platform.slug.current)}
                  >
                    Open archive <span aria-hidden="true">→</span>
                  </Link>
                </article>
              );
            })}
          </div>
        </section>
      </div>
    </>
  );
}
