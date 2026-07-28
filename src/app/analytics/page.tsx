import { getAnalyticsData, getAllPlatforms } from "@/lib/sanity.fetch";
import { AnalyticsDashboard } from "@/components/analytics/AnalyticsDashboard";
import { JsonLd, type JsonLdValue } from "@/components/seo/JsonLd";
import {
  absoluteUrl,
  createPageMetadata,
  latestDate,
} from "@/lib/site";

const analyticsDescription =
  "Compare Apple OS beta-cycle length, release cadence, and historical timing trends across iOS, macOS, watchOS, tvOS, and more.";

export const metadata = createPageMetadata({
  title: "Apple Release Analytics",
  description: analyticsDescription,
  path: "/analytics/",
});

export default async function AnalyticsPage() {
  const [data, platforms] = await Promise.all([
    getAnalyticsData(),
    getAllPlatforms(),
  ]);
  const canonical = absoluteUrl("/analytics/");
  const dateModified = latestDate(data.map((version) => version.updatedAt));
  const structuredData: JsonLdValue = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${canonical}#webpage`,
        url: canonical,
        name: "Apple Release Analytics",
        description: analyticsDescription,
        dateModified,
        isPartOf: { "@id": `${absoluteUrl("/")}#website` },
        mainEntity: { "@id": `${canonical}#analytics-dataset` },
      },
      {
        "@type": "Dataset",
        "@id": `${canonical}#analytics-dataset`,
        url: canonical,
        name: "Apple OS Beta Cycle Analytics",
        description:
          "Calculated beta-cycle lengths, milestone intervals, and release timing comparisons derived from tracked Apple OS release dates.",
        dateModified,
        isAccessibleForFree: true,
        variableMeasured: [
          "Beta cycle length",
          "Milestone interval",
          "Public release date",
        ],
      },
    ],
  };

  return (
    <>
      <JsonLd id="analytics-structured-data" data={structuredData} />
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
    </>
  );
}
