import Link from "next/link";
import {
  getAllPlatforms,
  getActiveBetas,
  getRecentReleases,
  getAnalyticsData,
} from "@/lib/sanity.fetch";
import { JsonLd, type JsonLdValue } from "@/components/seo/JsonLd";
import { daysBetween, formatDate, timeAgo } from "@/lib/utils";
import {
  absoluteUrl,
  createPageMetadata,
  latestDate,
  siteDescription,
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
  const canonical = absoluteUrl("/");
  const websiteId = `${canonical}#website`;
  const datasetId = `${canonical}#release-dataset`;
  const structuredData: JsonLdValue = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": websiteId,
        url: canonical,
        name: siteName,
        description: siteDescription,
        inLanguage: "en-US",
      },
      {
        "@type": "Dataset",
        "@id": datasetId,
        name: "Apple OS Release Date Dataset",
        description:
          "Historical beta, release candidate, and public release dates across Apple operating systems.",
        url: canonical,
        isPartOf: { "@id": websiteId },
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
      <div className="home-stack">
        <section
          className="home-hero animate-in"
          style={{ "--delay": 0 } as React.CSSProperties}
        >
          <div className="home-hero__copy">
            <p className="section-kicker">Apple OS release intelligence</p>
            <h1 className="display-serif">
              Every beta.
              <br />
              <em>Every beat.</em>
            </h1>
            <p className="home-hero__dek">
              A living record of Apple operating-system betas, release
              candidates, public launches, and evidence-based forecast ranges.
            </p>
            <div className="home-hero__actions">
              <Link href="/forecasts/" className="button button--primary">
                View release forecasts
                <span aria-hidden="true">→</span>
              </Link>
              <Link href="/timeline/" className="button button--secondary">
                Explore the timeline
              </Link>
            </div>
            <p className="source-note">
              <span>Independent &amp; unofficial</span>
              <span>Sanity-sourced index</span>
              <span>60-second refresh</span>
            </p>
          </div>

          <aside className="release-board" aria-label="Current release cycles">
            <div className="release-board__header">
              <p>Current cycles</p>
              <span className="status-pulse" aria-hidden="true" />
            </div>
            <div className="release-board__rows">
              {activeBetas.length > 0 ? (
                activeBetas.slice(0, 6).map((beta) => {
                  const platform = beta.releaseTrain.platform;
                  const latest =
                    beta.milestones[beta.milestones.length - 1];

                  return (
                    <Link
                      key={beta._id}
                      href={`/${platform.slug.current}/${beta.version}`}
                      className="release-board__row"
                    >
                      <span className="release-board__identity">
                        <span
                          style={{
                            background: platform.color,
                            color: platform.color,
                          }}
                        />
                        <span>
                          <span className="release-board__platform">
                            {platform.name}
                          </span>
                          <span className="release-board__version">
                            Version {beta.version}
                          </span>
                        </span>
                      </span>
                      <span className="release-board__milestone">
                        {latest?.label ?? "Awaiting data"}
                      </span>
                    </Link>
                  );
                })
              ) : (
                <div className="release-board__row">
                  <span className="release-board__platform">
                    No active beta cycles
                  </span>
                  <span className="release-board__milestone">All clear</span>
                </div>
              )}
            </div>
            <div className="release-board__footer">
              <span>{activeBetas.length} cycles tracked</span>
              <Link href="/forecasts/">Forecast desk ↗</Link>
            </div>
          </aside>
        </section>

        <dl
          className="metric-rail animate-in"
          style={{ "--delay": 1 } as React.CSSProperties}
          aria-label="Dataset overview"
        >
          {[
            { value: allData.length, label: "Versions indexed" },
            { value: totalMilestones, label: "Milestones recorded" },
            { value: activeBetas.length, label: "Active cycles" },
            { value: platforms.length, label: "Platforms covered" },
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

        <section>
          <div className="section-heading">
            <div>
              <p className="section-kicker">Platform index</p>
              <h2>Six systems, one release record.</h2>
            </div>
            <p>
              Browse each operating system from its earliest indexed cycle to
              the newest active beta.
            </p>
          </div>
          <div className="platform-grid">
            {platforms.map((platform, index) => {
              const versionCount = allData.filter(
                (version) =>
                  version.releaseTrain.platform.slug.current ===
                  platform.slug.current,
              ).length;

              return (
                <Link
                  key={platform._id}
                  href={`/${platform.slug.current}`}
                  className="platform-card"
                  style={
                    {
                      "--platform-color": platform.color,
                    } as React.CSSProperties
                  }
                >
                  <span className="platform-card__top">
                    <span className="platform-card__index">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className="platform-card__arrow" aria-hidden="true">
                      ↗
                    </span>
                  </span>
                  <div className="platform-card__bottom">
                    <div>
                      <h3>{platform.name}</h3>
                      <p>{versionCount} versions indexed</p>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        <section className="forecast-feature">
          <div className="forecast-feature__copy">
            <p className="section-kicker">Forecast desk</p>
            <h2>A range you can inspect, not a date we made up.</h2>
            <p>
              Forecasts compare active cycles with relevant historical
              releases, then publish the median, interquartile window, sample
              size, confidence, and backtest performance.
            </p>
            <div className="forecast-feature__actions">
              <Link href="/forecasts/" className="button button--primary">
                Open forecast desk
                <span aria-hidden="true">→</span>
              </Link>
              <Link href="/methodology/" className="button button--secondary">
                Read the methodology
              </Link>
            </div>
          </div>
          <div className="forecast-feature__signal" aria-hidden="true">
            <div className="signal-orbit">
              <span className="signal-orbit__core">Range</span>
            </div>
          </div>
        </section>

        {activeBetas.length > 0 && (
          <section>
            <div className="section-heading">
              <div>
                <p className="section-kicker">Live release board</p>
                <h2>Cycles in motion.</h2>
              </div>
              <p>
                The latest recorded milestone, its age, and the full count for
                every active operating-system cycle.
              </p>
            </div>

            {activeDataIsStale && latestActiveMilestoneDate && (
              <div className="freshness-notice">
                <p>
                  The latest recorded active milestone is{" "}
                  <strong>{formatDate(latestActiveMilestoneDate)}</strong>.
                  Active-cycle data may be incomplete until newer milestones
                  are added. <Link href="/contact/">Report an update</Link>.
                </p>
              </div>
            )}

            <div className="active-cycle-grid">
              {activeBetas.map((beta) => {
                const platform = beta.releaseTrain.platform;
                const latest =
                  beta.milestones[beta.milestones.length - 1];

                return (
                  <Link
                    key={beta._id}
                    href={`/${platform.slug.current}/${beta.version}`}
                    className="active-cycle-card"
                    style={
                      {
                        "--platform-color": platform.color,
                      } as React.CSSProperties
                    }
                  >
                    <div className="active-cycle-card__header">
                      <span>
                        <span className="active-cycle-card__name">
                          {platform.name}
                        </span>
                        <span className="active-cycle-card__version">
                          Version {beta.version}
                        </span>
                      </span>
                      <span className="badge badge-active">In beta</span>
                    </div>
                    <div className="active-cycle-card__latest">
                      <span>Latest recorded milestone</span>
                      <strong>{latest?.label ?? "Awaiting data"}</strong>
                      <span
                        className="active-cycle-card__ticks"
                        aria-hidden="true"
                      >
                        {beta.milestones.slice(-8).map((milestone, index) => (
                          <span key={milestone._key || index} />
                        ))}
                      </span>
                    </div>
                    <div className="active-cycle-card__footer">
                      <p>{latest ? formatDate(latest.date) : "No date"}</p>
                      <span>
                        {latest ? timeAgo(latest.date) : "Awaiting data"}
                        <br />
                        {beta.milestones.length} milestones
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>
        )}

        <section>
          <div className="section-heading">
            <div>
              <p className="section-kicker">Recently public</p>
              <h2>Latest arrivals.</h2>
            </div>
            <p>
              The newest public releases in the index, with the full beta and
              release-candidate record one click away.
            </p>
          </div>
          <div className="release-list">
            <div className="release-list__header" aria-hidden="true">
              <span>Version</span>
              <span>Public release</span>
              <span>Milestones</span>
              <span>Editorial note</span>
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
      </div>
    </>
  );
}
