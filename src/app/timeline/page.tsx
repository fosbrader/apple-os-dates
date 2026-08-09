import Link from "next/link";
import { TimelineView } from "@/components/timeline/TimelineView";
import { JsonLd, type JsonLdValue } from "@/components/seo/JsonLd";
import {
  absoluteUrl,
  createPageMetadata,
  latestDate,
} from "@/lib/site";
import { appleReleaseDatasetId } from "@/lib/structured-data";
import { getTimelinePageData } from "@/lib/timeline";
import { applePlatformPath } from "@/lib/release-routes";

const timelineDescription =
  "Explore every tracked Apple OS beta, release candidate, and public release date together on one chronological timeline.";

export const metadata = createPageMetadata({
  title: "Apple OS Release Timeline",
  description: timelineDescription,
  path: "/timeline/",
});

export default async function TimelinePage() {
  const { versions, timeline } = await getTimelinePageData();
  const canonical = absoluteUrl("/timeline/");
  const milestoneDates = versions.flatMap((version) =>
    version.milestones.map((milestone) => milestone.date)
  );
  const firstMilestoneDate = milestoneDates.reduce<string | undefined>(
    (earliest, date) => (!earliest || date < earliest ? date : earliest),
    undefined
  );
  const lastMilestoneDate = latestDate(milestoneDates);
  const structuredData: JsonLdValue = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${canonical}#webpage`,
    url: canonical,
    name: "Apple OS Release Timeline",
    description: timelineDescription,
    dateModified: latestDate(versions.map((version) => version.updatedAt)),
    temporalCoverage:
      firstMilestoneDate && lastMilestoneDate
        ? `${firstMilestoneDate}/${lastMilestoneDate}`
        : undefined,
    isPartOf: { "@id": `${absoluteUrl("/")}#website` },
    about: appleReleaseDatasetId(),
  };
  const recordedMilestones = timeline.bars.reduce(
    (total, bar) => total + bar.milestoneCount,
    0,
  );
  const activeCycles = timeline.bars.filter(
    (bar) => bar.releaseStatus === "active",
  ).length;
  const activeCycleSentence =
    activeCycles > 0
      ? ` ${activeCycles} cycle${activeCycles === 1 ? " is" : "s are"} currently active.`
      : "";
  const archiveScopeDescription =
    `This archive currently connects ${timeline.bars.length.toLocaleString()} release cycles and ${recordedMilestones.toLocaleString()} recorded milestones.` +
    `${activeCycleSentence} Browse a platform directly or load the complete interactive comparison below.`;

  return (
    <>
      <JsonLd id="timeline-structured-data" data={structuredData} />
      <div className="space-y-16">
        <header
          className="page-intro animate-in"
          style={{ "--delay": 0 } as React.CSSProperties}
        >
          <div>
            <p className="section-kicker">Release timeline</p>
            <h1 className="text-heading">Apple OS beta release timeline</h1>
          </div>
          <div>
            <p className="page-intro__description">
              Compare recorded beta-to-public cycles across Apple platforms,
              sort by duration or milestone count, and inspect every marker in
              the underlying release record.
            </p>
            <span className="page-intro__meta">
              Active bars end at today · Markers show recorded milestones
            </span>
          </div>
        </header>
        <div
          className="animate-in"
          style={{ "--delay": 1 } as React.CSSProperties}
        >
          <section className="surface p-6 space-y-5" aria-labelledby="timeline-archive-scope">
            <div className="space-y-2">
              <p className="section-kicker">Archive scope</p>
              <h2 id="timeline-archive-scope" className="text-heading text-xl">
                A source-backed record across Apple platforms
              </h2>
              <p className="text-[var(--text-secondary)] max-w-3xl">
                {archiveScopeDescription}
              </p>
            </div>
            <nav aria-label="Browse the Apple release archive by platform">
              <ul className="flex flex-wrap gap-x-4 gap-y-2">
                {timeline.platforms.map((platform) => (
                  <li key={platform.slug}>
                    <Link
                      href={applePlatformPath(platform.slug)}
                      className="text-sm font-medium text-[var(--accent)] hover:underline"
                    >
                      {platform.name} release history
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </section>
          <TimelineView />
        </div>
      </div>
    </>
  );
}
