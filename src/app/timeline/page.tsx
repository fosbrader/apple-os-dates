import { getTimelineData, getAllPlatforms } from "@/lib/seed-data";
import { TimelineView } from "@/components/timeline/TimelineView";

export const metadata = {
  title: "Timeline",
};

export default function TimelinePage() {
  const data = getTimelineData();
  const platforms = getAllPlatforms();

  return (
    <div className="space-y-8">
      <div className="animate-in" style={{ "--delay": 0 } as React.CSSProperties}>
        <h1 className="text-heading">Release Timeline</h1>
        <p className="text-sm text-[var(--text-secondary)] mt-1">
          Explore every beta, RC, and public release across all Apple platforms.
        </p>
      </div>
      <div className="animate-in" style={{ "--delay": 1 } as React.CSSProperties}>
        <TimelineView data={data} platforms={platforms} />
      </div>
    </div>
  );
}
