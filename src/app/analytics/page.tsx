import { getAnalyticsData, getAllPlatforms } from "@/lib/sanity.fetch";
import { AnalyticsDashboard } from "@/components/analytics/AnalyticsDashboard";
import { JsonLd, type JsonLdValue } from "@/components/seo/JsonLd";
import {
  absoluteUrl,
  createPageMetadata,
  latestDate,
} from "@/lib/site";
import {
  appleReleaseDatasetId,
  factualDataset,
} from "@/lib/structured-data";
import { buildAnalyticsViewModel } from "@/lib/view-models/analytics";

const analyticsDescription =
  "Compare Apple OS beta-cycle length, release cadence, and historical timing trends across iOS, macOS, watchOS, tvOS, and more.";

export const metadata = createPageMetadata({
  title: "Apple OS Release Analytics",
  description: analyticsDescription,
  path: "/analytics/",
});

export default async function AnalyticsPage() {
  const [data, platforms] = await Promise.all([
    getAnalyticsData(),
    getAllPlatforms(),
  ]);
  const canonical = absoluteUrl("/analytics/");
  const analytics = buildAnalyticsViewModel(data, platforms);
  const dateModified = latestDate(data.map((version) => version.updatedAt));
  const structuredData: JsonLdValue = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${canonical}#webpage`,
        url: canonical,
        name: "Apple OS Release Analytics",
        description: analyticsDescription,
        dateModified,
        isPartOf: { "@id": `${absoluteUrl("/")}#website` },
        mainEntity: { "@id": `${canonical}#analytics-dataset` },
      },
      factualDataset({
        "@id": `${canonical}#analytics-dataset`,
        url: canonical,
        name: "Apple OS Beta Cycle Analytics",
        description:
          "Calculated beta-cycle lengths, milestone intervals, and release timing comparisons derived from tracked Apple OS release dates.",
        dateModified,
        isAccessibleForFree: true,
        isBasedOn: appleReleaseDatasetId(),
        measurementTechnique:
          "Cycle lengths and milestone intervals calculated from the recorded Apple OS release-date dataset.",
        variableMeasured: [
          "Beta cycle length",
          "Milestone interval",
          "Public release date",
        ],
      }),
    ],
  };

  return (
    <>
      <JsonLd id="analytics-structured-data" data={structuredData} />
      <div className="space-y-16">
        <header
          className="page-intro animate-in"
          style={{ "--delay": 0 } as React.CSSProperties}
        >
          <div>
            <p className="section-kicker">Release analytics</p>
            <h1 className="text-heading">Apple OS release analytics</h1>
          </div>
          <div>
            <p className="page-intro__description">
              Historical cycle duration, milestone frequency, and interval
              patterns across the Apple operating-system release record.
            </p>
            <span className="page-intro__meta">
              Derived from published dates · Descriptive, not predictive
            </span>
          </div>
        </header>
        <div
          className="animate-in"
          style={{ "--delay": 1 } as React.CSSProperties}
        >
          <AnalyticsDashboard
            versions={analytics.versions}
            platforms={analytics.platforms}
          />
        </div>
      </div>
    </>
  );
}
