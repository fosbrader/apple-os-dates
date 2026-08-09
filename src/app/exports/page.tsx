import Link from "next/link";
import { JsonLd, type JsonLdValue } from "@/components/seo/JsonLd";
import { absoluteUrl, createPageMetadata } from "@/lib/site";
import { factualDataset } from "@/lib/structured-data";
import { RESEARCH_DATASET_COLUMNS } from "@/lib/research/serialize";
import {
  RESEARCH_DATASET_NAMES,
  RESEARCH_EXPORT_LICENSE_SCOPE,
  RESEARCH_EXPORT_LICENSE_URL,
  RESEARCH_EXPORT_VERSION,
  type ResearchDatasetName,
} from "@/lib/research/types";

const pageDescription =
  "Download Version Record's source-backed software release history as CC0 open data: releases, events, builds, changes, citations, and provenance in JSON and CSV.";

const DATASET_SUMMARIES: Record<ResearchDatasetName, string> = {
  releases:
    "One row per recorded software version, with lifecycle status and public release date.",
  events:
    "Observed channel appearances: developer betas, public betas, release candidates, and public releases with dates.",
  builds:
    "Verified build numbers only, linked to the channels in which each build appeared.",
  changes:
    "The reusable change library: features, fixes, and modifications recorded across releases.",
  occurrences:
    "Release-specific change occurrences with delta/inherited scope and documentation status.",
  citations:
    "Source metadata and locators backing material claims. Never mirrored publisher copy.",
  provenance:
    "Audit batches and correction records describing how each fact earned its place.",
};

export const metadata = createPageMetadata({
  title: "Open Data Exports (CC0)",
  description: pageDescription,
  path: "/exports/",
});

export default function ExportsPage() {
  const canonical = absoluteUrl("/exports/");

  const structuredData: JsonLdValue = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${canonical}#webpage`,
        url: canonical,
        name: "Version Record Open Data Exports",
        description: pageDescription,
        isPartOf: { "@id": `${absoluteUrl("/")}#website` },
        mainEntity: { "@id": `${canonical}#dataset` },
      },
      factualDataset({
        "@id": `${canonical}#dataset`,
        name: "Version Record software release history exports",
        description:
          "Versioned bulk exports of an independent, source-backed software release archive: releases, channel appearance events, verified builds, documented changes, change occurrences, citation metadata, and provenance records. Apple operating systems are the first catalog.",
        url: canonical,
        version: RESEARCH_EXPORT_VERSION,
        isAccessibleForFree: true,
        keywords: [
          "software release history",
          "Apple release dates",
          "iOS version history",
          "macOS version history",
          "beta release timeline",
          "build numbers",
          "open data",
        ],
        distribution: RESEARCH_DATASET_NAMES.flatMap((dataset) => [
          {
            "@type": "DataDownload",
            name: `${dataset}.json`,
            encodingFormat: "application/json",
            contentUrl: absoluteUrl(`/exports/v1/${dataset}.json`),
          },
          {
            "@type": "DataDownload",
            name: `${dataset}.csv`,
            encodingFormat: "text/csv",
            contentUrl: absoluteUrl(`/exports/v1/${dataset}.csv`),
          },
        ]),
      }),
    ],
  };

  return (
    <>
      <JsonLd id="exports-structured-data" data={structuredData} />
      <div className="content-page space-y-16">
        <header className="content-page__header">
          <div>
            <p className="section-kicker">Open data · CC0</p>
            <h1 className="text-display">Data exports</h1>
          </div>
          <div className="content-page__description space-y-3">
            <p>
              The factual, structured release record is free to take: every
              recorded version, channel appearance, verified build, documented
              change, citation locator, and provenance trail, as versioned
              JSON and CSV files. No API key, no rate limits, no scraping
              required.
            </p>
            <p>
              <a className="text-link" href="/exports/v1/README.txt">
                Read the export README →
              </a>
            </p>
            <p>
              Need filtered JSON records? Use the{" "}
              <Link className="text-link" href="/api/">
                public API reference →
              </Link>
            </p>
          </div>
        </header>

        <section className="space-y-6">
          <h2>Datasets (schema v{RESEARCH_EXPORT_VERSION})</h2>
          <div style={{ overflowX: "auto" }}>
            <table>
              <thead>
                <tr>
                  <th scope="col">Dataset</th>
                  <th scope="col">Contents</th>
                  <th scope="col">Download</th>
                </tr>
              </thead>
              <tbody>
                {RESEARCH_DATASET_NAMES.map((dataset) => (
                  <tr key={dataset}>
                    <th scope="row">
                      <code>{dataset}</code>
                    </th>
                    <td>
                      {DATASET_SUMMARIES[dataset]}{" "}
                      <small>
                        Columns:{" "}
                        {RESEARCH_DATASET_COLUMNS[dataset].join(", ")}
                      </small>
                    </td>
                    <td>
                      <a href={`/exports/v1/${dataset}.json`}>JSON</a>
                      {" · "}
                      <a href={`/exports/v1/${dataset}.csv`}>CSV</a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p>
            A machine-readable index of all files is published at{" "}
            <a href="/exports/v1/manifest.json">
              <code>/exports/v1/manifest.json</code>
            </a>
            .
          </p>
        </section>

        <section className="space-y-3">
          <h2>License</h2>
          <p>
            The structured factual fields in these files are dedicated to the
            public domain under{" "}
            <a
              href={RESEARCH_EXPORT_LICENSE_URL}
              rel="external noopener noreferrer"
              target="_blank"
            >
              CC0 1.0
            </a>
            . {RESEARCH_EXPORT_LICENSE_SCOPE}
          </p>
          <p>
            Attribution is appreciated but not required. If the archive saved
            you a scrape, a link back to{" "}
            <Link href="/">Version Record</Link> helps others find the
            source.
          </p>
        </section>

        <section className="space-y-3">
          <h2>Data model in one paragraph</h2>
          <p>
            A release <em>event</em> is an observed channel appearance — a
            developer beta, public beta, release candidate, or public release
            on a date. A <em>build</em> exists only when a build number has
            been verified by sources, and multiple events can share one
            build. <em>Occurrences</em> attach documented changes to events
            or builds. Every material fact carries citations, and material
            corrections are recorded in a{" "}
            <Link href="/corrections/">public ledger</Link>. The{" "}
            <Link href="/methodology/">methodology page</Link> explains the
            evidence standards.
          </p>
        </section>
      </div>
    </>
  );
}
