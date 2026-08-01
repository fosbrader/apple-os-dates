import Link from "next/link";
import { JsonLd, type JsonLdValue } from "@/components/seo/JsonLd";
import { appleReleaseDatasetId } from "@/lib/structured-data";
import {
  getAllPlatforms,
  getAnalyticsData,
  getRecentReleases,
} from "@/lib/sanity.fetch";
import {
  absoluteUrl,
  createPageMetadata,
  latestDate,
  siteDescription,
  siteHost,
  siteName,
  siteXUrl,
} from "@/lib/site";
import {
  applePlatformPath,
  releaseVersionPath,
} from "@/lib/release-routes";
import { formatDate } from "@/lib/utils";

const homeTitle =
  "Version Record — Software Release History & Release Notes Archive";
const homeDescription =
  "Explore independent, source-backed software release histories, builds, beta timelines, release notes, citations, and corrections. Apple is the first catalog.";

export const metadata = createPageMetadata({
  title: homeTitle,
  description: homeDescription,
  path: "/",
  absoluteTitle: true,
});

function yearFromDate(value: string | undefined): string | undefined {
  return value?.slice(0, 4);
}

export default async function HomePage() {
  const [platforms, recentReleases, allData] = await Promise.all([
    getAllPlatforms(),
    getRecentReleases(),
    getAnalyticsData(),
  ]);
  const totalAppearances = allData.reduce(
    (sum, version) => sum + version.milestones.length,
    0,
  );
  const appearanceDates = allData.flatMap((version) =>
    version.milestones.map((milestone) => milestone.date),
  );
  const firstAppearanceDate = appearanceDates.reduce<string | undefined>(
    (earliest, date) => (!earliest || date < earliest ? date : earliest),
    undefined,
  );
  const lastAppearanceDate = latestDate(appearanceDates);
  const firstCoverageYear = yearFromDate(firstAppearanceDate);
  const lastCoverageYear = yearFromDate(lastAppearanceDate);
  const coverageYears =
    firstCoverageYear && lastCoverageYear
      ? firstCoverageYear === lastCoverageYear
        ? firstCoverageYear
        : `${firstCoverageYear}–${lastCoverageYear}`
      : "Growing";
  const recentAppleReleases = recentReleases.slice(0, 4);

  const canonical = absoluteUrl("/");
  const websiteId = `${canonical}#website`;
  const organizationId = `${canonical}#organization`;
  const pageId = `${canonical}#archive`;
  const organizationLogo = absoluteUrl("/icons/icon-512.png");
  const structuredData: JsonLdValue = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": websiteId,
        url: canonical,
        name: siteName,
        alternateName: ["VersionRecord", siteHost],
        description: siteDescription,
        inLanguage: "en-US",
        publisher: { "@id": organizationId },
        potentialAction: {
          "@type": "SearchAction",
          target: {
            "@type": "EntryPoint",
            urlTemplate: `${absoluteUrl("/search/")}?q={search_term_string}`,
          },
          "query-input": "required name=search_term_string",
        },
      },
      {
        "@type": "Organization",
        "@id": organizationId,
        url: canonical,
        name: siteName,
        alternateName: ["VersionRecord", siteHost],
        description:
          "Independent, source-backed archive of software releases, builds, changes, and historical release data.",
        logo: {
          "@type": "ImageObject",
          url: organizationLogo,
          contentUrl: organizationLogo,
          width: 512,
          height: 512,
        },
        sameAs: [
          "https://github.com/fosbrader/apple-os-dates",
          siteXUrl,
        ],
      },
      {
        "@type": "CollectionPage",
        "@id": pageId,
        url: canonical,
        name: homeTitle,
        description: homeDescription,
        isPartOf: { "@id": websiteId },
        mainEntity: { "@id": appleReleaseDatasetId() },
        about: {
          "@type": "Thing",
          name: "Software release history and release notes",
        },
      },
    ],
  };

  return (
    <>
      <JsonLd id="home-structured-data" data={structuredData} />
      <div className="archive-home">
        <header className="archive-home__hero">
          <div className="archive-home__hero-title">
            <p className="index-label">
              Independent software release knowledge base
            </p>
            <h1>A source-backed history of software releases</h1>
          </div>
          <div className="archive-home__hero-copy">
            <p className="archive-home__lede">
              Version Record documents when software shipped, what changed,
              and which sources support the record. It connects major versions,
              point releases, betas, builds, release notes, community-found
              changes, and corrections in one navigable history.
            </p>
            <p className="archive-home__scope">
              Apple software is the first catalog. Other software ecosystems
              can follow as their records can be sourced and maintained to the
              same standard.
            </p>
            <div className="archive-home__actions">
              <Link className="button button--primary" href="/apple/">
                Explore Apple releases
                <span aria-hidden="true">→</span>
              </Link>
              <Link className="button button--secondary" href="/sources/">
                How the archive is sourced
              </Link>
            </div>
          </div>
        </header>

        <section
          className="archive-home__model"
          aria-labelledby="record-model-heading"
        >
          <div className="archive-home__section-intro">
            <p className="index-label">More than a date tracker</p>
            <h2 id="record-model-heading">One record, from version to evidence</h2>
            <p>
              The archive is organized like a reference work, so a release can
              be understood at a glance and investigated in detail.
            </p>
          </div>
          <ol className="record-model">
            <li>
              <span>01</span>
              <div>
                <h3>Version history</h3>
                <p>
                  Follow a major release through point updates, release
                  candidates, public launches, and individual beta appearances.
                </p>
              </div>
            </li>
            <li>
              <span>02</span>
              <div>
                <h3>Release knowledge</h3>
                <p>
                  Bring official notes together with attributed reporting,
                  community-documented features, builds, fixes, and
                  undocumented changes.
                </p>
              </div>
            </li>
            <li>
              <span>03</span>
              <div>
                <h3>Visible evidence</h3>
                <p>
                  Citations stay attached to the claims they support. Source
                  details, evidence state, editorial review, and corrections
                  remain visible.
                </p>
              </div>
            </li>
          </ol>
        </section>

        <section
          className="catalog-index"
          aria-labelledby="catalog-index-heading"
        >
          <div className="index-section__heading">
            <div>
              <p className="index-label">Available catalogs</p>
              <h2 id="catalog-index-heading">Start with Apple software</h2>
            </div>
            <p>
              Coverage currently focuses on Apple operating systems. This
              dedicated catalog is the gateway to every platform, version,
              appearance, and build in the archive.
            </p>
          </div>

          <article className="catalog-feature">
            <div className="catalog-feature__summary">
              <div className="catalog-feature__eyebrow">
                <span>Catalog 01</span>
                <span>Available now</span>
              </div>
              <div>
                <h3>Apple software releases</h3>
                <p>
                  Browse the independent history of iOS, iPadOS, macOS,
                  watchOS, tvOS, and visionOS—from major release families down
                  to individual beta and public-release records.
                </p>
              </div>
              <div className="catalog-feature__platforms" aria-label="Apple platforms">
                {platforms.map((platform) => (
                  <Link
                    href={applePlatformPath(platform.slug.current)}
                    key={platform._id}
                  >
                    <i
                      aria-hidden="true"
                      style={{ background: platform.color }}
                    />
                    {platform.name}
                  </Link>
                ))}
              </div>
              <Link className="button button--primary" href="/apple/">
                Explore the Apple software release archive
                <span aria-hidden="true">→</span>
              </Link>
            </div>

            <div className="catalog-feature__record">
              <dl className="catalog-feature__metrics">
                <div>
                  <dt>Platforms</dt>
                  <dd>{platforms.length.toLocaleString()}</dd>
                </div>
                <div>
                  <dt>Apple versions</dt>
                  <dd>{allData.length.toLocaleString()}</dd>
                </div>
                <div>
                  <dt>Recorded appearances</dt>
                  <dd>{totalAppearances.toLocaleString()}</dd>
                </div>
                <div>
                  <dt>Archive span</dt>
                  <dd>{coverageYears}</dd>
                </div>
              </dl>

              {recentAppleReleases.length > 0 ? (
                <div className="catalog-feature__recent">
                  <div className="catalog-feature__recent-heading">
                    <p className="index-label">Latest public records</p>
                    <Link href="/apple/">
                      All Apple releases <span aria-hidden="true">→</span>
                    </Link>
                  </div>
                  <ul>
                    {recentAppleReleases.map((release) => {
                      const platform = release.releaseTrain.platform;

                      return (
                        <li key={release._id}>
                          <Link
                            href={releaseVersionPath(
                              platform.slug.current,
                              release.version,
                            )}
                          >
                            <span>
                              <i
                                aria-hidden="true"
                                style={{ background: platform.color }}
                              />
                              <strong>{platform.name}</strong>
                              <code>{release.version}</code>
                            </span>
                            <time dateTime={release.publicReleaseDate}>
                              {release.publicReleaseDate
                                ? formatDate(release.publicReleaseDate)
                                : "Date pending"}
                            </time>
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ) : null}
            </div>
          </article>
        </section>

        <section
          className="archive-home__principles"
          aria-labelledby="archive-principles-heading"
        >
          <div className="archive-home__section-intro">
            <p className="index-label">Editorial foundation</p>
            <h2 id="archive-principles-heading">
              A historical archive, not a press feed
            </h2>
            <p>
              The goal is durable context: what was known, where it came from,
              and how the record changed over time.
            </p>
          </div>
          <div className="archive-principles">
            <article>
              <h3>Sources travel with the claim</h3>
              <p>
                Original reporting is credited and linked. Summaries are
                written to preserve facts and context without republishing
                another publisher&apos;s work.
              </p>
              <Link href="/sources/">
                Read the sourcing policy <span aria-hidden="true">→</span>
              </Link>
            </article>
            <article>
              <h3>Facts and forecasts stay separate</h3>
              <p>
                Recorded history is presented as history. Estimates are
                explicitly labeled, show their evidence, and never masquerade
                as a vendor announcement.
              </p>
              <Link href="/methodology/">
                Review the methodology <span aria-hidden="true">→</span>
              </Link>
            </article>
            <article>
              <h3>The record can be corrected</h3>
              <p>
                Conflicting sources and later discoveries are part of the
                archive. Published corrections make substantive changes
                inspectable instead of silently overwriting history.
              </p>
              <Link href="/corrections/">
                View corrections <span aria-hidden="true">→</span>
              </Link>
            </article>
          </div>
        </section>

        <nav className="archive-home__explore" aria-label="Explore Version Record">
          <div>
            <p className="index-label">Research the archive</p>
            <h2>Find a release from any angle</h2>
          </div>
          <div className="archive-home__explore-links">
            <Link href="/search/">
              <strong>Search records</strong>
              <span>Versions, betas, builds, changes, and publishers</span>
            </Link>
            <Link href="/timeline/">
              <strong>Browse the timeline</strong>
              <span>Compare release appearances across the current catalog</span>
            </Link>
            <Link href="/forecasts/">
              <strong>View forecasts</strong>
              <span>History-based estimates kept separate from the record</span>
            </Link>
          </div>
        </nav>
      </div>
    </>
  );
}
