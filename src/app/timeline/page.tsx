import { getTimelineData, getAllPlatforms } from "@/lib/sanity.fetch";
import { TimelineView } from "@/components/timeline/TimelineView";
import { JsonLd, type JsonLdValue } from "@/components/seo/JsonLd";
import {
  absoluteUrl,
  createPageMetadata,
  latestDate,
} from "@/lib/site";

const timelineDescription =
  "Explore every tracked Apple OS beta, release candidate, and public release date together on one chronological timeline.";

export const metadata = createPageMetadata({
  title: "Apple OS Release Timeline",
  description: timelineDescription,
  path: "/timeline/",
});

export default async function TimelinePage() {
  const [data, platforms] = await Promise.all([
    getTimelineData(),
    getAllPlatforms(),
  ]);
  const canonical = absoluteUrl("/timeline/");
  const milestoneDates = data.flatMap((version) =>
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
    dateModified: latestDate(data.map((version) => version.updatedAt)),
    temporalCoverage:
      firstMilestoneDate && lastMilestoneDate
        ? `${firstMilestoneDate}/${lastMilestoneDate}`
        : undefined,
    isPartOf: { "@id": `${absoluteUrl("/")}#website` },
    about: { "@id": `${absoluteUrl("/")}#release-dataset` },
  };

  return (
    <>
      <JsonLd id="timeline-structured-data" data={structuredData} />
      <div className="space-y-8">
      <div className="animate-in" style={{ "--delay": 0 } as React.CSSProperties}>
        <h1 className="text-heading">Release Timeline</h1>
        <p className="text-sm text-[var(--text-secondary)] mt-1">
          Explore recorded beta, RC, and public releases across Apple platforms.
        </p>
      </div>
      <div className="animate-in" style={{ "--delay": 1 } as React.CSSProperties}>
        <TimelineView data={data} platforms={platforms} />
      </div>
      </div>
    </>
  );
}
