import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getAllPlatforms,
  getPlatformVersions,
  getVersionDetail,
  getHistoricalContext,
} from "@/lib/seed-data";
import { PlatformBadge } from "@/components/ui/PlatformBadge";
import { MilestoneTimeline } from "@/components/ui/MilestoneTimeline";
import { CalendarExport } from "@/components/ui/CalendarExport";
import { VersionInsights } from "@/components/analytics/VersionInsights";
import {
  formatDate,
  computeBetaCycleDays,
  computeAverageBetaInterval,
} from "@/lib/utils";

export function generateStaticParams() {
  const platforms = getAllPlatforms();
  const params: { platform: string; version: string }[] = [];
  for (const p of platforms) {
    const versions = getPlatformVersions(p.slug.current);
    for (const v of versions) {
      params.push({ platform: p.slug.current, version: v.version });
    }
  }
  return params;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ platform: string; version: string }>;
}) {
  const { platform: slug, version: ver } = await params;
  const detail = getVersionDetail(slug, ver);
  if (!detail) return { title: "Version Not Found" };
  return {
    title: `${detail.releaseTrain.platform.name} ${detail.version}`,
  };
}

export default async function VersionDetailPage({
  params,
}: {
  params: Promise<{ platform: string; version: string }>;
}) {
  const { platform: slug, version: ver } = await params;
  const detail = getVersionDetail(slug, ver);

  if (!detail) notFound();

  const platform = detail.releaseTrain.platform;
  const cycleDays = computeBetaCycleDays(detail);
  const avgInterval = computeAverageBetaInterval(detail.milestones);
  const isActive = !detail.publicReleaseDate;
  const historical = getHistoricalContext(slug, ver);

  return (
    <div className="space-y-10">
      {/* Breadcrumb */}
      <nav
        className="flex items-center gap-2 text-sm text-[var(--text-tertiary)] animate-in"
        style={{ "--delay": 0 } as React.CSSProperties}
      >
        <Link href="/" className="hover:text-[var(--text-secondary)]">
          Home
        </Link>
        <span>/</span>
        <Link
          href={`/${slug}`}
          className="hover:text-[var(--text-secondary)]"
        >
          {platform.name}
        </Link>
        <span>/</span>
        <span className="text-[var(--text)] font-mono">{detail.version}</span>
      </nav>

      {/* Header */}
      <div
        className="flex flex-col sm:flex-row sm:items-center gap-4 animate-in"
        style={{ "--delay": 1 } as React.CSSProperties}
      >
        <PlatformBadge name={platform.name} color={platform.color} size="lg" />
        <div>
          <h1 className="text-heading">
            {platform.name}{" "}
            <span className="font-mono">{detail.version}</span>
          </h1>
          {detail.versionNote && (
            <p className="text-sm text-[var(--accent)] italic mt-0.5">
              {detail.versionNote}
            </p>
          )}
        </div>
        {isActive && (
          <span className="self-start sm:ml-auto badge badge-active text-sm px-4 py-1.5">
            In Beta
          </span>
        )}
      </div>

      {/* Stats */}
      <div
        className="grid grid-cols-2 md:grid-cols-4 gap-px bg-[var(--border)] rounded-2xl overflow-hidden animate-in"
        style={{ "--delay": 2 } as React.CSSProperties}
      >
        <div className="bg-[var(--bg)] text-center py-5 px-4">
          <div className="stat-value">{detail.milestones.length}</div>
          <div className="stat-label">Milestones</div>
        </div>
        <div className="bg-[var(--bg)] text-center py-5 px-4">
          <div className="stat-value">
            {cycleDays !== null ? `${cycleDays}d` : "—"}
          </div>
          <div className="stat-label">Beta Cycle</div>
        </div>
        <div className="bg-[var(--bg)] text-center py-5 px-4">
          <div className="stat-value">
            {avgInterval !== null ? `${avgInterval}d` : "—"}
          </div>
          <div className="stat-label">Avg. Interval</div>
        </div>
        <div className="bg-[var(--bg)] text-center py-5 px-4">
          <div className="stat-value text-xl">
            {detail.publicReleaseDate
              ? formatDate(detail.publicReleaseDate)
              : "TBD"}
          </div>
          <div className="stat-label">Public Release</div>
        </div>
      </div>

      {/* Milestones */}
      <section
        className="animate-in"
        style={{ "--delay": 3 } as React.CSSProperties}
      >
        <h2 className="text-subheading mb-5">Milestones</h2>
        <div className="surface p-6">
          <MilestoneTimeline milestones={detail.milestones} />
        </div>
      </section>

      {/* Insights & Analytics */}
      <section
        className="animate-in"
        style={{ "--delay": 4 } as React.CSSProperties}
      >
        <h2 className="text-subheading mb-5">Insights</h2>
        <VersionInsights
          version={detail}
          samePlatformVersions={historical.samePlatformVersions}
          samePositionVersions={historical.samePositionVersions}
          allCompleted={historical.allCompleted}
        />
      </section>

      {/* Actions */}
      <section
        className="flex flex-wrap gap-3 animate-in"
        style={{ "--delay": 5 } as React.CSSProperties}
      >
        <CalendarExport
          milestones={detail.milestones}
          versionName={`${platform.name} ${detail.version}`}
        />
        {detail.releaseNotesUrl && (
          <a
            href={detail.releaseNotesUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg surface text-[var(--accent)] hover:bg-[var(--bg-subtle)] transition-colors"
          >
            Release Notes &rarr;
          </a>
        )}
      </section>
    </div>
  );
}
