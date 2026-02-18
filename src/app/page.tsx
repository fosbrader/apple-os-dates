import Link from "next/link";
import {
  getAllPlatforms,
  getActiveBetas,
  getRecentReleases,
  getAnalyticsData,
} from "@/lib/seed-data";
import { PlatformBadge } from "@/components/ui/PlatformBadge";
import { formatDate, timeAgo } from "@/lib/utils";

export default function HomePage() {
  const platforms = getAllPlatforms();
  const activeBetas = getActiveBetas();
  const recentReleases = getRecentReleases();
  const allData = getAnalyticsData();
  const totalMilestones = allData.reduce(
    (sum, v) => sum + v.milestones.length,
    0
  );

  return (
    <div className="space-y-16">
      {/* Hero */}
      <section
        className="text-center pt-12 pb-2 animate-in"
        style={{ "--delay": 0 } as React.CSSProperties}
      >
        <h1 className="text-display">Apple Beta Tracker</h1>
        <div className="gradient-line max-w-64 mx-auto mt-5 mb-5" />
        <p className="text-lg text-[var(--text-secondary)] max-w-lg mx-auto leading-relaxed">
          Every beta, RC, and public release date for iOS, iPadOS, macOS,
          watchOS, tvOS, and visionOS.
        </p>
      </section>

      {/* Stats */}
      <section
        className="grid grid-cols-2 md:grid-cols-4 gap-px bg-[var(--border)] rounded-2xl overflow-hidden animate-in"
        style={{ "--delay": 1 } as React.CSSProperties}
      >
        {[
          { value: allData.length, label: "Versions" },
          { value: totalMilestones, label: "Milestones" },
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

      {/* Active Betas */}
      {activeBetas.length > 0 && (
        <section>
          <h2
            className="text-heading mb-6 animate-in"
            style={{ "--delay": 3 } as React.CSSProperties}
          >
            Active Betas
          </h2>
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
                  <th className="text-right">Milestones</th>
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
                <th className="hidden sm:table-cell">Milestones</th>
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
  );
}
