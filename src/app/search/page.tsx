import Link from "next/link";
import { Suspense } from "react";
import {
  getResearchSearchIndex,
  searchResearchIndex,
} from "@/lib/research/search";
import type {
  ResearchSearchFilters,
  SearchDocumentKind,
} from "@/lib/research/types";
import { getAllPlatforms } from "@/lib/sanity.fetch";
import { createPageMetadata } from "@/lib/site";
import { formatDate } from "@/lib/utils";

export const revalidate = 300;

export const metadata = {
  ...createPageMetadata({
    title: "Search Software Release Records",
    description:
      "Search Version Record by version, beta, build, change, platform, evidence state, or cited publisher.",
    path: "/search/",
  }),
  // Query and facet combinations are useful in-product, but they are not
  // durable editorial pages for web search. Keep their result links
  // crawlable without inviting an unbounded set of search-result URLs into
  // the index.
  robots: {
    index: false,
    follow: true,
    googleBot: {
      index: false,
      follow: true,
    },
  },
};

type SearchValue = string | string[] | undefined;

function firstValue(value: SearchValue): string {
  return Array.isArray(value) ? value[0] ?? "" : value ?? "";
}

function resultSnippet(text: string): string {
  const compact = text.replace(/\s+/g, " ").trim();
  return compact.length > 240
    ? `${compact.slice(0, 237).trimEnd()}…`
    : compact;
}

const kindLabels: Record<SearchDocumentKind, string> = {
  release: "Version",
  event: "Appearance",
  build: "Build",
  change: "Change",
};

/**
 * Everything index-dependent renders here so the page shell can flush
 * before the search index finishes building. Building the index is the
 * slow path on a cold instance; the shell must never wait on it.
 */
async function SearchResults({
  query,
  filters,
  hasCriteria,
}: {
  query: string;
  filters: ResearchSearchFilters;
  hasCriteria: boolean;
}) {
  let unavailable = false;
  let documentCount = 0;
  let publisherOptions: string[] = [];
  let results: ReturnType<typeof searchResearchIndex> = [];

  try {
    const index = await getResearchSearchIndex();
    documentCount = index.documents.length;
    publisherOptions = Array.from(
      new Set(
        index.documents.flatMap((document) => document.publishers),
      ),
    ).sort();
    results = searchResearchIndex(index, query, filters, 60);
  } catch (error) {
    console.error("Search page index failed", error);
    unavailable = true;
  }

  return (
    <>
      {/* Bound to the publisher input in the form shell by id. */}
      <datalist id="search-publishers">
        {publisherOptions.map((option) => (
          <option key={option} value={option} />
        ))}
      </datalist>

      <div className="section-heading">
        <div>
          <p className="section-kicker">
            {hasCriteria ? "Matching records" : "Recent records"}
          </p>
          <h2 id="search-results-heading">
            {unavailable
              ? "Search is temporarily unavailable"
              : `${results.length} result${results.length === 1 ? "" : "s"}`}
          </h2>
        </div>
        <p>
          {documentCount > 0
            ? `${documentCount.toLocaleString()} public records are currently indexed. `
            : null}
          Search data is also available as a public, versioned JSON index
          and as reusable research exports.
        </p>
      </div>

      {unavailable ? (
        <div className="content-notice">
          <h2>Please try again shortly</h2>
          <p className="content-notice__body">
            The release archive remains browsable from the{" "}
            <Link href="/apple/">Apple catalog</Link>.
          </p>
        </div>
      ) : results.length > 0 ? (
        <ol className="search-result-list">
          {results.map(({ document }) => (
            <li key={document.id}>
              <article>
                <div className="search-result-list__meta">
                  <span>{kindLabels[document.kind]}</span>
                  {document.platform ? (
                    <span>{document.platform}</span>
                  ) : null}
                  {document.date ? (
                    <time dateTime={document.date}>
                      {formatDate(document.date)}
                    </time>
                  ) : null}
                </div>
                <h3>
                  <Link href={document.href}>{document.title}</Link>
                </h3>
                {document.text ? (
                  <p>{resultSnippet(document.text)}</p>
                ) : null}
                <div className="search-result-list__badges">
                  {document.status ? (
                    <span>{document.status}</span>
                  ) : null}
                  {document.channel ? (
                    <span>{document.channel}</span>
                  ) : null}
                  {document.build_number ? (
                    <code>{document.build_number}</code>
                  ) : null}
                  {document.documented_status ? (
                    <span>{document.documented_status}</span>
                  ) : null}
                  {document.evidence_state ? (
                    <span>{document.evidence_state}</span>
                  ) : null}
                </div>
                {document.publishers.length > 0 ? (
                  <p className="search-result-list__sources">
                    Sources: {document.publishers.join(", ")}
                  </p>
                ) : null}
              </article>
            </li>
          ))}
        </ol>
      ) : (
        <div className="content-notice">
          <h2>No records matched those terms</h2>
          <p className="content-notice__body">
            Try a shorter version number, remove a filter, or{" "}
            <Link href="/submit/">submit a missing source</Link>.
          </p>
        </div>
      )}
    </>
  );
}

function SearchResultsFallback({
  hasCriteria,
}: {
  hasCriteria: boolean;
}) {
  return (
    <div className="section-heading">
      <div>
        <p className="section-kicker">
          {hasCriteria ? "Matching records" : "Recent records"}
        </p>
        <h2 id="search-results-heading">Searching the record…</h2>
      </div>
      <p>
        Search data is also available as a public, versioned JSON index and
        as reusable research exports.
      </p>
    </div>
  );
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, SearchValue>>;
}) {
  const params = await searchParams;
  const query = firstValue(params.q).trim().slice(0, 200);
  const kind = firstValue(params.kind) as
    | SearchDocumentKind
    | "";
  const platform = firstValue(params.platform).trim();
  const publisher = firstValue(params.publisher).trim();
  const evidenceState = firstValue(params.evidence).trim();
  const documentedStatus = firstValue(params.documented).trim();
  const filters: ResearchSearchFilters = {
    kind: kind || undefined,
    platform: platform || undefined,
    publisher: publisher || undefined,
    evidence_state: evidenceState || undefined,
    documented_status: documentedStatus || undefined,
  };
  const hasCriteria = Boolean(
    query ||
      kind ||
      platform ||
      publisher ||
      evidenceState ||
      documentedStatus,
  );

  // Small, data-cached query — unlike the search index, this never
  // blocks the shell for a meaningful amount of time.
  let platformOptions: string[] = [];
  try {
    const platforms = await getAllPlatforms();
    platformOptions = platforms
      .map((entry) => entry.slug.current)
      .sort();
  } catch (error) {
    console.error("Search page platform options failed", error);
  }

  return (
    <div className="search-page">
      <header className="content-page__header">
        <div>
          <p className="section-kicker">Research index</p>
          <h1 className="text-display">Search the record</h1>
        </div>
        <div className="content-page__description space-y-3">
          <p>
            Find versions, individual beta appearances, build numbers, and
            sourced changes. Filters expose the evidence state instead of
            hiding it behind a generic relevance score.
          </p>
          <p className="text-sm text-[var(--text-tertiary)]">
            The public index is assembled from published Sanity records.
          </p>
        </div>
      </header>

      <form action="/search/" className="search-form" method="get">
        <label className="search-form__query">
          <span>Keywords, version, or build</span>
          <input
            autoComplete="off"
            defaultValue={query}
            maxLength={200}
            name="q"
            placeholder="Try “26.3 beta 4” or a build number"
            type="search"
          />
        </label>
        <label>
          <span>Record type</span>
          <select defaultValue={kind} name="kind">
            <option value="">All records</option>
            <option value="release">Versions</option>
            <option value="event">Appearances</option>
            <option value="build">Builds</option>
            <option value="change">Changes</option>
          </select>
        </label>
        <label>
          <span>Platform</span>
          <select defaultValue={platform} name="platform">
            <option value="">All platforms</option>
            {platformOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>
        <label>
          <span>Evidence</span>
          <select defaultValue={evidenceState} name="evidence">
            <option value="">Any evidence state</option>
            <option value="reported">Reported</option>
            <option value="corroborated">Corroborated</option>
            <option value="confirmed">Confirmed</option>
          </select>
        </label>
        <label>
          <span>Documentation</span>
          <select defaultValue={documentedStatus} name="documented">
            <option value="">Any documentation state</option>
            <option value="documented">Documented</option>
            <option value="partiallyDocumented">
              Partially documented
            </option>
            <option value="undocumented">Undocumented</option>
            <option value="unknown">Unknown</option>
          </select>
        </label>
        <label>
          <span>Publisher</span>
          <input
            defaultValue={publisher}
            list="search-publishers"
            maxLength={200}
            name="publisher"
            placeholder="Any cited publisher"
          />
        </label>
        <div className="search-form__actions">
          <button className="button button--primary" type="submit">
            Search
          </button>
          {hasCriteria ? (
            <Link className="button button--secondary" href="/search/">
              Clear
            </Link>
          ) : null}
        </div>
      </form>

      <section
        aria-labelledby="search-results-heading"
        className="search-results"
      >
        <Suspense fallback={<SearchResultsFallback hasCriteria={hasCriteria} />}>
          <SearchResults
            query={query}
            filters={filters}
            hasCriteria={hasCriteria}
          />
        </Suspense>
      </section>

      <aside className="search-export-note">
        <p>
          Building a research tool? Read the{" "}
          <Link href="/exports/v1/README.txt">
            export documentation
          </Link>{" "}
          or fetch the{" "}
          <Link href="/api/search-index/">search index JSON</Link>.
        </p>
      </aside>
    </div>
  );
}
