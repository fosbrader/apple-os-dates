import { getAnalyticsData, getAllPlatforms } from "@/lib/seed-data";
import { AnalyticsDashboard } from "@/components/analytics/AnalyticsDashboard";

export const metadata = {
  title: "Analytics",
};

export default function AnalyticsPage() {
  const data = getAnalyticsData();
  const platforms = getAllPlatforms();

  return (
    <div className="space-y-8">
      <div className="animate-in" style={{ "--delay": 0 } as React.CSSProperties}>
        <h1 className="text-heading">Release Analytics</h1>
        <p className="text-sm text-[var(--text-secondary)] mt-1">
          Historical stats, trends, and comparisons across Apple beta cycles.
        </p>
      </div>
      <div className="animate-in" style={{ "--delay": 1 } as React.CSSProperties}>
        <AnalyticsDashboard data={data} platforms={platforms} />
      </div>
    </div>
  );
}
