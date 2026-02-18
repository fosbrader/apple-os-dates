import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllPlatforms, getPlatformVersions } from "@/lib/seed-data";
import { PlatformBadge } from "@/components/ui/PlatformBadge";
import { formatDate } from "@/lib/utils";

export function generateStaticParams() {
  const platforms = getAllPlatforms();
  return platforms.map((p) => ({ platform: p.slug.current }));
}

export function generateMetadata({
  params,
}: {
  params: Promise<{ platform: string }>;
}) {
  return params.then(({ platform: slug }) => {
    const platforms = getAllPlatforms();
    const platform = platforms.find((p) => p.slug.current === slug);
    return {
      title: platform ? `${platform.name} Releases` : "Platform",
    };
  });
}

export default async function PlatformPage({
  params,
}: {
  params: Promise<{ platform: string }>;
}) {
  const { platform: slug } = await params;
  const platforms = getAllPlatforms();
  const platform = platforms.find((p) => p.slug.current === slug);

  if (!platform) notFound();

  const versions = getPlatformVersions(slug);

  const grouped = new Map<number, typeof versions>();
  for (const v of versions) {
    const major = v.releaseTrain.majorVersion;
    if (!grouped.has(major)) grouped.set(major, []);
    grouped.get(major)!.push(v);
  }

  const sortedGroups = Array.from(grouped.entries()).sort(
    ([a], [b]) => b - a
  );

  return (
    <div className="space-y-12">
      {/* Header */}
      <div
        className="flex items-center gap-4 animate-in"
        style={{ "--delay": 0 } as React.CSSProperties}
      >
        <PlatformBadge name={platform.name} color={platform.color} size="lg" />
        <div>
          <h1 className="text-heading">{platform.name} Releases</h1>
          <p className="text-sm text-[var(--text-secondary)]">
            <span className="font-mono">{versions.length}</span> versions
            tracked
          </p>
        </div>
      </div>

      {/* Version groups */}
      {sortedGroups.map(([majorVersion, groupVersions], gi) => (
        <section
          key={majorVersion}
          className="animate-in"
          style={{ "--delay": 1 + gi } as React.CSSProperties}
        >
          <div className="flex items-center gap-3 mb-3">
            <h2 className="text-subheading text-[var(--text-secondary)]">
              {platform.name} {majorVersion}
            </h2>
            <div className="flex-1 h-px bg-[var(--border)]" />
            <span className="text-label">
              {groupVersions.length} version
              {groupVersions.length !== 1 ? "s" : ""}
            </span>
          </div>

          <div className="surface overflow-hidden">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Version</th>
                  <th>Status</th>
                  <th className="hidden sm:table-cell">Released</th>
                  <th className="hidden md:table-cell">First Beta</th>
                  <th className="text-right">Betas</th>
                  <th className="hidden lg:table-cell">Note</th>
                </tr>
              </thead>
              <tbody>
                {groupVersions.map((version, idx) => {
                  const isActive = !version.publicReleaseDate;
                  return (
                    <tr key={`${version._id}-${idx}`}>
                      <td>
                        <Link
                          href={`/${slug}/${version.version}`}
                          className="inline-flex items-center gap-2 group"
                        >
                          <span className="font-mono font-semibold group-hover:text-[var(--accent)] transition-colors">
                            {version.version}
                          </span>
                        </Link>
                      </td>
                      <td>
                        {isActive ? (
                          <span className="badge badge-active text-[0.625rem]">Active</span>
                        ) : (
                          <span className="text-[var(--text-tertiary)] text-xs">Released</span>
                        )}
                      </td>
                      <td className="hidden sm:table-cell text-[var(--text-secondary)]">
                        {version.publicReleaseDate
                          ? formatDate(version.publicReleaseDate)
                          : "—"}
                      </td>
                      <td className="hidden md:table-cell text-[var(--text-secondary)]">
                        {version.firstBetaDate
                          ? formatDate(version.firstBetaDate)
                          : "—"}
                      </td>
                      <td className="text-right font-mono text-[var(--text-secondary)]">
                        {version.milestoneCount}
                      </td>
                      <td className="hidden lg:table-cell text-xs text-[var(--accent)] italic">
                        {version.versionNote || ""}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>
      ))}
    </div>
  );
}
