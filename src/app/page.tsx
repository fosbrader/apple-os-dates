import Link from "next/link";
import {
  getAllPlatforms,
  getActiveBetas,
  getRecentReleases,
  getAnalyticsData,
} from "@/lib/sanity.fetch";
import { JsonLd, type JsonLdValue } from "@/components/seo/JsonLd";
import { buildReleaseForecasts } from "@/lib/forecasts";
import { daysBetween, formatDate, timeAgo } from "@/lib/utils";
import {
  absoluteUrl,
  createPageMetadata,
  latestDate,
  siteDescription,
  siteHost,
  siteName,
} from "@/lib/site";

const homeTitle = "Beta Cadence — Apple OS Beta Dates & Forecasts";

export const metadata = createPageMetadata({
  title: homeTitle,
  description: siteDescription,
  path: "/",
  absoluteTitle: true,
});

export default async function HomePage() {
  const [platforms, activeBetas, recentReleases, allData] = await Promise.all([
    getAllPlatforms(),
    getActiveBetas(),
    getRecentReleases(),
    getAnalyticsData(),
  ]);
  const totalMilestones = allData.reduce(
    (sum, version) => sum + version.milestones.length,
    0,
  );
  const milestoneDates = allData.flatMap((version) =>
    version.milestones.map((milestone) => milestone.date),
  );
  const firstMilestoneDate = milestoneDates.reduce<string | undefined>(
    (earliest, date) => (!earliest || date < earliest ? date : earliest),
    undefined,
  );
  const lastMilestoneDate = latestDate(milestoneDates);
  const dateModified = latestDate(allData.map((version) => version.updatedAt));
  const latestActiveMilestoneDate = latestDate(
    activeBetas.flatMap((version) =>
      version.milestones.map((milestone) => milestone.date),
    ),
  );
  const activeDataAgeDays = latestActiveMilestoneDate
    ? daysBetween(
        latestActiveMilestoneDate,
        new Date().toISOString().slice(0, 10),
      )
    : null;
  const activeDataIsStale =
    activeDataAgeDays !== null && activeDataAgeDays > 60;
  const nextMilestoneForecast = buildReleaseForecasts(allData).find(
    (forecast) =>
      forecast.status === "active" && forecast.nextMilestoneWindow,
  );
  const nextMilestoneWindow = nextMilestoneForecast?.nextMilestoneWindow;
  const latestPublicReleaseDate = latestDate(
    recentReleases.map((release) => release.publicReleaseDate),
  );
  const latestPublicReleases = latestPublicReleaseDate
    ? recentReleases.filter(
        (release) => release.publicReleaseDate === latestPublicReleaseDate,
      )
    : [];
  const canonical = absoluteUrl("/");
  const websiteId = `${canonical}#website`;
  const organizationId = `${canonical}#organization`;
  const datasetId = `${canonical}#release-dataset`;
  const organizationLogo = absoluteUrl("/icons/icon-512.png");
  const structuredData: JsonLdValue = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": websiteId,
        url: canonical,
        name: siteName,
        alternateName: ["BetaCadence", siteHost],
        description: siteDescription,
        inLanguage: "en-US",
        publisher: { "@id": organizationId },
      },
      {
        "@type": "Organization",
        "@id": organizationId,
        url: canonical,
        name: siteName,
        alternateName: ["BetaCadence", siteHost],
        description:
          "Independent Apple operating-system release-date index and history-based forecasting project.",
        logo: {
          "@type": "ImageObject",
          url: organizationLogo,
          contentUrl: organizationLogo,
          width: 512,
          height: 512,
        },
        sameAs: ["https://github.com/fosbrader/apple-os-dates"],
      },
      {
        "@type": "Dataset",
        "@id": datasetId,
        name: "Apple OS Release Date Dataset",
        description:
          "Historical beta, release candidate, and public release dates across Apple operating systems.",
        url: canonical,
        isPartOf: { "@id": websiteId },
        creator: { "@id": organizationId },
        publisher: { "@id": organizationId },
        isAccessibleForFree: true,
        dateModified,
        temporalCoverage:
          firstMilestoneDate && lastMilestoneDate
            ? `${firstMilestoneDate}/${lastMilestoneDate}`
            : undefined,
        keywords: [
          "Apple OS release dates",
          "iOS beta dates",
          "macOS beta dates",
          "Apple release history",
        ],
        variableMeasured: [
          "Operating system version",
          "Release milestone",
          "Release date",
        ],
        measurementTechnique:
          "Release dates compiled from official release notes, public announcements, and documented contemporaneous sources.",
        hasPart: platforms.map((platform) => ({
          "@type": "Dataset",
          name: `${platform.name} Release Dates`,
          description: `Historical beta, release candidate, and public release dates for ${platform.name}.`,
          url: absoluteUrl(`/${encodeURIComponent(platform.slug.current)}/`),
        })),
      },
    ],
  };

  return (
    <>
      <JsonLd id="home-structured-data" data={structuredData} />
      <div className="home-index">
        <header className="home-index__intro">
          <div className="home-index__masthead">
            <div className="home-index__title">
              {latestPublicReleaseDate &&
                latestPublicReleases.length > 0 && (
                  <div
                    className="home-index__latest"
                    aria-label={`Latest public releases from ${formatDate(
                      latestPublicReleaseDate,
                    )}`}
                  >
                    <div className="home-index__latest-heading">
                      <p className="index-label">Latest public releases</p>
                      <time dateTime={latestPublicReleaseDate}>
                        {formatDate(latestPublicReleaseDate)}
                      </time>
                    </div>
                    <p className="home-index__latest-items">
                      {latestPublicReleases.map((release) => {
                        const platform = release.releaseTrain.platform;

                        return (
                          <Link
                            key={release._id}
                            href={`/${platform.slug.current}/${release.version}`}
                          >
                            <strong>{platform.name}</strong>{" "}
                            <code>{release.version}</code>
                          </Link>
                        );
                      })}
                    </p>
                  </div>
                )}
              <p className="index-label">Independent release index</p>
              <h1>Apple OS beta and release dates</h1>
            </div>
            <div className="home-index__lead">
              <p className="home-index__description">
                A historical index of beta, release candidate, and public
                release milestones for iOS, iPadOS, macOS, watchOS, tvOS, and
                visionOS. Next-beta, release-candidate, and public-release
                forecasts are based on comparable prior cycles and published
                as ranges.
              </p>
              <p className="home-index__meta">
                <span>{allData.length} versions</span>
                <span>{totalMilestones} milestones</span>
                <span>{activeBetas.length} active cycles</span>
                <span>
                  Updated{" "}
                  {lastMilestoneDate ? formatDate(lastMilestoneDate) : "—"}
                </span>
              </p>
              <nav
                className="home-index__links"
                aria-label="Release index links"
              >
                <Link href="/forecasts/">View forecasts</Link>
                <Link href="/methodology/">Read the methodology</Link>
              </nav>
              <p className="home-index__disclaimer">
                Independent; not affiliated with Apple Inc.
              </p>
            </div>
          </div>

          <div className="home-index__current">
            {nextMilestoneForecast && nextMilestoneWindow ? (
              <aside
                className="next-forecast"
                aria-labelledby="next-forecast-heading"
              >
                <div className="next-forecast__label">
                  <p className="index-label">Next milestone forecast</p>
                  <Link href="/forecasts/">
                    All forecasts <span aria-hidden="true">→</span>
                  </Link>
                </div>
                <div className="next-forecast__identity">
                  <i
                    aria-hidden="true"
                    style={{
                      background:
                        nextMilestoneForecast.release.releaseTrain.platform
                          .color,
                    }}
                  />
                  <h2 id="next-forecast-heading">
                    {
                      nextMilestoneForecast.release.releaseTrain.platform
                        .name
                    }{" "}
                    <code>{nextMilestoneForecast.release.version}</code>
                  </h2>
                </div>
                <div className="next-forecast__estimate">
                  <p className="next-forecast__target">
                    {nextMilestoneWindow.likelyLabel}
                  </p>
                  <p
                    className="next-forecast__range"
                    aria-label={`Estimated ${nextMilestoneWindow.likelyLabel} release window from ${formatDate(
                      nextMilestoneWindow.earliestDate,
                    )} to ${formatDate(nextMilestoneWindow.latestDate)}`}
                  >
                    <time dateTime={nextMilestoneWindow.earliestDate}>
                      {formatDate(nextMilestoneWindow.earliestDate)}
                    </time>
                    <span aria-hidden="true">–</span>
                    <time dateTime={nextMilestoneWindow.latestDate}>
                      {formatDate(nextMilestoneWindow.latestDate)}
                    </time>
                  </p>
                </div>
                <p className="next-forecast__evidence">
                  Median {formatDate(nextMilestoneWindow.medianDate)}
                  {" · "}
                  {nextMilestoneWindow.sampleSize} comparable cycles
                  {" · "}
                  {nextMilestoneWindow.labelAgreement}% label agreement
                </p>
                <p className="next-forecast__basis">
                  From the latest recorded{" "}
                  {nextMilestoneForecast.latestMilestone?.label ??
                    nextMilestoneForecast.stageLabel ??
                    "milestone"}
                  {nextMilestoneForecast.latestMilestone
                    ? ` on ${formatDate(nextMilestoneForecast.latestMilestone.date)}`
                    : ""}
                  . Independent estimate, not an Apple announcement.
                </p>
              </aside>
            ) : (
              <aside className="next-forecast next-forecast--empty">
                <p className="index-label">Next milestone forecast</p>
                <p>
                  No active next-milestone forecast currently meets the
                  publication safeguards.{" "}
                  <Link href="/forecasts/">View forecast status</Link>.
                </p>
              </aside>
            )}

            <section
              className="cycle-snapshot"
              aria-labelledby="active-cycles-heading"
            >
              <div className="cycle-snapshot__heading">
                <div>
                  <h2 id="active-cycles-heading">Active release cycles</h2>
                  <p>Latest recorded milestones</p>
                </div>
              </div>

              <div className="cycle-snapshot__grid">
                {activeBetas.length > 0 ? (
                  activeBetas.map((beta) => {
                    const platform = beta.releaseTrain.platform;
                    const latest =
                      beta.milestones[beta.milestones.length - 1];

                    return (
                      <Link
                        key={beta._id}
                      href={`/${platform.slug.current}/${beta.version}`}
                        className="cycle-snapshot__row"
                      >
                        <span className="cycle-snapshot__identity">
                          <i
                            aria-hidden="true"
                            style={{ background: platform.color }}
                          />
                          <strong>{platform.name}</strong>
                          <code>{beta.version}</code>
                        </span>
                        <span className="cycle-snapshot__milestone">
                          <strong>{latest?.label ?? "Awaiting data"}</strong>
                          <small>
                            {latest ? timeAgo(latest.date) : "No date"}
                            {" · "}
                            {beta.milestones.length} milestones
                          </small>
                        </span>
                        <time dateTime={latest?.date}>
                          {latest ? formatDate(latest.date) : "—"}
                        </time>
                      </Link>
                    );
                  })
                ) : (
                  <p className="cycle-snapshot__empty">
                    No active release cycles are currently recorded.
                  </p>
                )}
              </div>

              {activeDataIsStale && latestActiveMilestoneDate && (
                <p className="cycle-snapshot__stale">
                  Latest active data: {formatDate(latestActiveMilestoneDate)}.{" "}
                  <Link href="/contact/">Report an update</Link>.
                </p>
              )}
            </section>
          </div>
        </header>

        <section className="index-section">
          <div className="index-section__heading">
            <div>
              <h2>Recent public releases</h2>
              <p>
                The newest public releases and their recorded milestone
                histories.
              </p>
            </div>
          </div>
          <div className="release-list">
            <div className="release-list__header" aria-hidden="true">
              <span>Platform and version</span>
              <span>Public release</span>
              <span>Milestones</span>
              <span>Note</span>
            </div>
            {recentReleases.map((release) => {
              const platform = release.releaseTrain.platform;

              return (
                <Link
                  key={release._id}
                  href={`/${platform.slug.current}/${release.version}`}
                  className="release-list__row"
                >
                  <span className="release-identity">
                    <span
                      className="release-identity__dot"
                      style={{ background: platform.color }}
                    />
                    <span>
                      <strong>{platform.name}</strong>
                      <code>{release.version}</code>
                    </span>
                  </span>
                  <span>
                    {release.publicReleaseDate
                      ? formatDate(release.publicReleaseDate)
                      : "—"}
                  </span>
                  <span className="font-mono">{release.milestoneCount}</span>
                  <p>{release.versionNote || "—"}</p>
                </Link>
              );
            })}
          </div>
        </section>

        <section className="index-section">
          <div className="index-section__heading">
            <div>
              <h2>Browse by platform</h2>
              <p>Open the complete version history for each operating system.</p>
            </div>
          </div>
          <div className="platform-directory">
            {platforms.map((platform) => {
              const versionCount = allData.filter(
                (version) =>
                  version.releaseTrain.platform.slug.current ===
                  platform.slug.current,
              ).length;

              return (
                <Link
                  key={platform._id}
                  href={`/${platform.slug.current}/`}
                  className="platform-directory__row"
                >
                  <span>
                    <i
                      aria-hidden="true"
                      style={{ background: platform.color }}
                    />
                    <strong>{platform.name}</strong>
                  </span>
                  <span>{versionCount} versions</span>
                </Link>
              );
            })}
          </div>
        </section>

        <section className="forecast-note">
          <p className="index-label">About the forecasts</p>
          <div>
            <h2>History-based release ranges</h2>
            <p>
              Release forecasts summarize outcomes from comparable historical
              beta cycles. Each forecast includes its date range, median,
              sample size, confidence assessment, and prior-only backtest
              result. Forecasts are independent estimates, not Apple
              announcements.
            </p>
            <p className="forecast-note__links">
              <Link href="/forecasts/">View forecasts</Link>
              <Link href="/methodology/">Read the methodology</Link>
            </p>
          </div>
        </section>
      </div>
    </>
  );
}
