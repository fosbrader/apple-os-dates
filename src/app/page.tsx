import Link from "next/link";
import {
  getAllPlatforms,
  getActiveBetas,
  getRecentReleases,
  getAnalyticsData,
} from "@/lib/sanity.fetch";
import { PlatformBadge } from "@/components/ui/PlatformBadge";
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
    (sum, v) => sum + v.milestones.length,
    0
  );
  const milestoneDates = allData.flatMap((version) =>
    version.milestones.map((milestone) => milestone.date)
  );
  const firstMilestoneDate = milestoneDates.reduce<string | undefined>(
    (earliest, date) => (!earliest || date < earliest ? date : earliest),
    undefined
  );
  const lastMilestoneDate = latestDate(milestoneDates);
  const dateModified = latestDate(allData.map((version) => version.updatedAt));
  const latestActiveMilestoneDate = latestDate(
    activeBetas.flatMap((version) =>
      version.milestones.map((milestone) => milestone.date)
    )
  );
  const activeDataAgeDays = latestActiveMilestoneDate
    ? daysBetween(
        latestActiveMilestoneDate,
        new Date().toISOString().slice(0, 10)
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
      <div className="space-y-16">
      {/* Hero */}
      <section
        className="text-center pt-12 pb-2 animate-in"
        style={{ "--delay": 0 } as React.CSSProperties}
      >
        <h1 className="text-display">Beta Cadence</h1>
        <div className="gradient-line max-w-64 mx-auto mt-5 mb-5" />
        <p className="text-lg text-[var(--text-secondary)] max-w-lg mx-auto leading-relaxed">
          Browse recorded beta, RC, and public release dates for iOS, iPadOS,
          macOS, watchOS, tvOS, and visionOS.
        </p>
      </section>

      {/* Stats */}
      <section
        className="grid grid-cols-2 md:grid-cols-4 gap-px bg-[var(--border)] rounded-2xl overflow-hidden animate-in"
        style={{ "--delay": 1 } as React.CSSProperties}
      >
        {[
          { value: allData.length, label: "Versions" },
          { value: totalMilestones, label: "Releases" },
          { value: activeBetas.length, label: "Active Betas" },
          { value: platforms.length, label: "Platforms" },
        ].map((s) => (
          <div key={s.label} className="bg-[var(--bg)] text-center py-6 px-4">
            <div className="stat-value">{s.value}</div>
            <div className="stat-label">{s.label}</div>
          </div>
        ))}
      </section>

      {/* Platform pills */}
      <section
        className="flex flex-wrap gap-2.5 justify-center animate-in"
        style={{ "--delay": 2 } as React.CSSProperties}
      >
        {platforms.map((p) => (
          <Link key={p._id} href={`/${p.slug.current}`}>
            <PlatformBadge name={p.name} color={p.color} size="lg" />
          </Link>
        ))}
      </section>

      <section
        className="surface p-6 sm:p-8 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between animate-in"
        style={{ "--delay": 3 } as React.CSSProperties}
      >
        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-wide text-[var(--accent)]">
            Evidence-based forecasts
          </p>
          <h2 className="text-subheading mt-2">
            Explore likely release windows—not made-up exact dates.
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-[var(--text-secondary)]">
            Forecasts use comparable historical beta cycles to show a median
            estimate, an interquartile date range, sample size, and confidence
            level. Stale or insufficient data is called out instead of forced
            into a prediction.
          </p>
        </div>
        <div className="flex shrink-0 flex-wrap gap-3">
          <Link
            href="/forecasts"
            className="inline-flex items-center rounded-lg bg-[var(--accent-cta)] px-4 py-2 text-sm font-semibold text-white hover:bg-[var(--accent-cta-hover)]"
          >
            View forecasts
          </Link>
          <Link
            href="/methodology"
            className="inline-flex items-center rounded-lg surface px-4 py-2 text-sm font-medium text-[var(--accent)] hover:bg-[var(--bg-subtle)]"
          >
            How it works
          </Link>
        </div>
      </section>

      {/* Active Betas */}
      {activeBetas.length > 0 && (
        <section>
          <h2
            className="text-heading mb-6 animate-in"
            style={{ "--delay": 3 } as React.CSSProperties}
          >
            Active Betas
          </h2>
          {activeDataIsStale && latestActiveMilestoneDate && (
            <div className="mb-4 rounded-xl border border-[var(--milestone-rc)]/40 bg-[var(--bg-subtle)] px-4 py-3 text-sm text-[var(--text-secondary)]">
              The latest recorded active milestone is{" "}
              <strong className="text-[var(--text)]">
                {formatDate(latestActiveMilestoneDate)}
              </strong>
              . Active-cycle data may be incomplete until newer milestones are
              added.{" "}
              <Link href="/contact" className="text-[var(--accent)] hover:underline">
                Report an update
              </Link>
              .
            </div>
          )}
          <div
            className="surface overflow-hidden animate-in"
            style={{ "--delay": 4 } as React.CSSProperties}
          >
            <table className="data-table">
              <thead>
                <tr>
                  <th>Version</th>
                  <th>Latest</th>
                  <th className="hidden sm:table-cell">Date</th>
                  <th className="hidden md:table-cell">Age</th>
                  <th className="text-right">Releases</th>
                </tr>
              </thead>
              <tbody>
                {activeBetas.map((beta) => {
                  const platform = beta.releaseTrain.platform;
                  const latest = beta.milestones[beta.milestones.length - 1];
                  return (
                    <tr key={beta._id}>
                      <td>
                        <Link
                          href={`/${platform.slug.current}/${beta.version}`}
                          className="flex items-center gap-2.5 group"
                        >
                          <span
                            className="w-2 h-2 rounded-full shrink-0"
                            style={{ background: platform.color }}
                          />
                          <span className="font-medium group-hover:text-[var(--accent)] transition-colors">
                            {platform.name}
                          </span>
                          <span className="font-mono text-[var(--text-secondary)] text-sm group-hover:text-[var(--accent)] transition-colors">
                            {beta.version}
                          </span>
                        </Link>
                      </td>
                      <td>
                        {latest && (
                          <span className="milestone-beta font-medium text-sm">
                            {latest.label}
                          </span>
                        )}
                      </td>
                      <td className="hidden sm:table-cell text-[var(--text-secondary)]">
                        {latest ? formatDate(latest.date) : "—"}
                      </td>
                      <td className="hidden md:table-cell text-xs text-[var(--text-tertiary)]">
                        {latest ? timeAgo(latest.date) : "—"}
                      </td>
                      <td className="text-right font-mono text-[var(--text-secondary)]">
                        {beta.milestones.length}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* Recent Releases */}
      <section>
        <h2
          className="text-heading mb-6 animate-in"
          style={{ "--delay": 8 } as React.CSSProperties}
        >
          Recent Releases
        </h2>
        <div
          className="surface overflow-hidden animate-in"
          style={{ "--delay": 9 } as React.CSSProperties}
        >
          <table className="data-table">
            <thead>
              <tr>
                <th>Version</th>
                <th>Released</th>
                <th className="hidden sm:table-cell">Releases</th>
                <th className="hidden md:table-cell">Note</th>
              </tr>
            </thead>
            <tbody>
              {recentReleases.map((release) => (
                <tr key={release._id}>
                  <td>
                    <Link
                      href={`/${release.releaseTrain.platform.slug.current}/${release.version}`}
                      className="flex items-center gap-2.5"
                    >
                      <span
                        className="w-2 h-2 rounded-full shrink-0"
                        style={{
                          background: release.releaseTrain.platform.color,
                        }}
                      />
                      <span className="font-medium">
                        {release.releaseTrain.platform.name}
                      </span>
                      <span className="font-mono text-[var(--text-secondary)] text-sm">
                        {release.version}
                      </span>
                    </Link>
                  </td>
                  <td className="text-[var(--text-secondary)]">
                    {release.publicReleaseDate
                      ? formatDate(release.publicReleaseDate)
                      : "—"}
                  </td>
                  <td className="hidden sm:table-cell font-mono text-[var(--text-secondary)]">
                    {release.milestoneCount}
                  </td>
                  <td className="hidden md:table-cell text-[var(--text-tertiary)] text-xs">
                    {release.versionNote || "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
      </div>
    </>
  );
}
