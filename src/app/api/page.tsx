import Link from "next/link";
import type { ReactNode } from "react";
import { publicApiDatasetFields, type PublicApiFieldDefinition } from "@/lib/public-api/fields";
import {
  PUBLIC_API_DATASETS,
  PUBLIC_API_DATASET_NAMES,
  PUBLIC_API_DEFAULT_LIMIT,
  PUBLIC_API_MAX_LIMIT,
  PUBLIC_API_SEARCH_FILTERS,
  PUBLIC_API_VERSION,
  publicApiCollectionPath,
  publicApiOpenApiPath,
  publicApiRootPath,
  publicApiSearchPath,
  type PublicApiDatasetName,
  type PublicApiFilterDefinition,
} from "@/lib/public-api/types";
import { RESEARCH_EXPORT_LICENSE_URL } from "@/lib/research/types";
import { createPageMetadata } from "@/lib/site";
import { ApiTableOfContents } from "./ApiTableOfContents";
import { CopyCodeButton } from "./CopyCodeButton";
import styles from "./api-reference.module.css";

const pageDescription =
  "Read Version Record public release data through a versioned API. Use short, direct API instructions.";

export const metadata = createPageMetadata({
  title: "Public API Reference",
  description: pageDescription,
  path: "/api/",
  socialImagePath: "/api-reference-og.png",
  socialImageAlt:
    "Version Record public API reference with a release data request and response.",
});

const endpointExamples: Record<PublicApiDatasetName, string> = {
  releases: `${publicApiCollectionPath("releases")}?platform=ios&limit=3`,
  events: `${publicApiCollectionPath("events")}?platform=ios&channel=developer_beta&limit=3`,
  builds: `${publicApiCollectionPath("builds")}?platform=ios&limit=3`,
  changes: `${publicApiCollectionPath("changes")}?limit=3`,
  occurrences: `${publicApiCollectionPath("occurrences")}?platform=ios&action=introduced&limit=3`,
  citations: `${publicApiCollectionPath("citations")}?publisher=apple&limit=3`,
  provenance: `${publicApiCollectionPath("provenance")}?limit=3`,
};

const paginationParameters = [
  {
    name: "limit",
    type: "integer",
    description: `Page size. Use an integer from 1 through ${PUBLIC_API_MAX_LIMIT}.`,
    example: String(PUBLIC_API_DEFAULT_LIMIT),
  },
  {
    name: "offset",
    type: "integer",
    description: "Zero-based record offset. Use 0 through 1000000.",
    example: "0",
  },
];

function Code({ children }: { children: ReactNode }) {
  return <code className={styles.inlineCode}>{children}</code>;
}

function CodeBlock({ children, label }: { children: string; label: string }) {
  return (
    <div className={styles.codePanel}>
      <CopyCodeButton value={children} label={label} className={styles.copyButton} />
      <pre className={styles.codeBlock}>
        <code>{children}</code>
      </pre>
    </div>
  );
}

function filterType(filter: PublicApiFilterDefinition): string {
  if (filter.value_type === "boolean") return "boolean";
  if (filter.value_type === "utc-date-or-date-time") return "UTC date or time";
  return "string";
}

function fieldType(field: PublicApiFieldDefinition): string {
  const type = field.type === "array" ? "string[]" : field.type;
  return field.nullable ? `${type} or null` : type;
}

function ParameterList({ filters }: { filters: readonly PublicApiFilterDefinition[] }) {
  return (
    <dl className={styles.definitionList}>
      {paginationParameters.map((parameter) => (
        <div key={parameter.name}>
          <dt>
            <Code>{parameter.name}</Code>
            <span className={styles.typeBadge}>{parameter.type}</span>
          </dt>
          <dd>
            {parameter.description} Example: <Code>{parameter.example}</Code>.
          </dd>
        </div>
      ))}
      {filters.map((filter) => (
        <div key={filter.name}>
          <dt>
            <Code>{filter.name}</Code>
            <span className={styles.typeBadge}>{filterType(filter)}</span>
          </dt>
          <dd>
            {filter.description} Example: <Code>{filter.example}</Code>.
          </dd>
        </div>
      ))}
    </dl>
  );
}

function FieldList({ fields }: { fields: PublicApiFieldDefinition[] }) {
  return (
    <dl className={styles.definitionList}>
      {fields.map((field) => (
        <div key={field.name}>
          <dt>
            <Code>{field.name}</Code>
            <span className={styles.typeBadge}>{fieldType(field)}</span>
          </dt>
          <dd>{field.description}</dd>
        </div>
      ))}
    </dl>
  );
}

function EndpointCard({ dataset }: { dataset: PublicApiDatasetName }) {
  const definition = PUBLIC_API_DATASETS[dataset];
  const collectionPath = publicApiCollectionPath(dataset);
  const example = endpointExamples[dataset];

  return (
    <section className={styles.endpointCard} id={dataset}>
      <div className={styles.endpointHeader}>
        <span className={styles.method}>GET</span>
        <div>
          <h3>
            <Code>{collectionPath}</Code>
          </h3>
          <p>{definition.description}</p>
        </div>
      </div>

      <div className={styles.endpointLinks}>
        <a href={example} aria-label={`Open ${dataset} API example`}>
          Open {dataset} example
        </a>
        <span>
          Use the returned <Code>links.self</Code> path to get one {definition.singular}.
        </span>
      </div>

      <div className={styles.endpointGrid}>
        <div>
          <p className={styles.cardLabel}>Query parameters</p>
          <ParameterList filters={definition.filters} />
        </div>
        <div>
          <p className={styles.cardLabel}>Public fields</p>
          <FieldList fields={publicApiDatasetFields(dataset)} />
        </div>
      </div>
    </section>
  );
}

function ReferenceLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a className={styles.referenceLink} href={href}>
      {children}
      <span aria-hidden="true">→</span>
    </a>
  );
}

export default function ApiReferencePage() {
  const eventsPath = publicApiCollectionPath("events");
  const searchPath = publicApiSearchPath();
  const curlExample = `curl -sS "https://www.versionrecord.com${eventsPath}?platform=ios&channel=developer_beta&limit=3"`;
  const responseExample = `{
  "api_version": "${PUBLIC_API_VERSION}",
  "generated_at": "2026-08-01T12:00:00.000Z",
  "data": [
    {
      "id": "release.ios.26.3",
      "vendor": "apple",
      "platform": "ios",
      "family": "26",
      "version": "26.3",
      "status": "active",
      "public_release_date": null,
      "release_notes_url": null,
      "provenance_status": "audit_verified",
      "updated_at": "2026-08-01T10:00:00.000Z"
    }
  ],
  "pagination": {
    "limit": 3,
    "offset": 0,
    "returned": 1,
    "total": 1,
    "next": null,
    "previous": null
  },
  "links": {
    "self": "/api/v1/releases/?limit=3",
    "openapi": "/api/v1/openapi.json"
  }
}`;
  const searchExample = `${searchPath}?q=ios&kind=event&limit=3`;

  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <div className={styles.heroCopy}>
          <p className="section-kicker">Public API · {PUBLIC_API_VERSION}</p>
          <h1 className="text-display">Release data, ready to use.</h1>
          <p className={styles.heroLead}>
            Read public release records with one stable API. Get versions,
            events, builds, changes, citations, and provenance.
          </p>
          <div className={styles.heroActions}>
            <ReferenceLink href={publicApiRootPath()}>Open API root</ReferenceLink>
            <ReferenceLink href={publicApiOpenApiPath()}>
              Get OpenAPI JSON
            </ReferenceLink>
          </div>
        </div>

        <div className={styles.heroExample}>
          <div className={styles.exampleLabel}>
            <span>Example request</span>
            <span>GET · JSON · no key</span>
          </div>
          <CodeBlock label="the example API request">{curlExample}</CodeBlock>
          <p>
            Use the direct path shown. It reaches the API without a redirect.
          </p>
        </div>
      </section>

      <div className={styles.referenceLayout}>
        <aside>
          <ApiTableOfContents />
        </aside>

        <article className={styles.reference}>
          <section className={styles.section} id="start">
            <p className={styles.eyebrow}>Start</p>
            <h2>Send GET requests.</h2>
            <p>
              Use the API base path <Code>{publicApiRootPath()}</Code>. The API
              has public data only. It does not require a key. It does not
              accept write requests.
            </p>
            <ol className={styles.steps}>
              <li>Send a GET request to a documented endpoint.</li>
              <li>Set each documented query parameter one time.</li>
              <li>Read the data, links, and pagination fields.</li>
            </ol>
            <div className={styles.callout}>
              <p className={styles.cardLabel}>Use canonical paths</p>
              <p>
                Collection and search paths end with <Code>/</Code>. Detail
                paths can vary when an ID contains a period. Follow the
                returned <Code>links.self</Code> or <Code>record.api_path</Code>
                value. This avoids an HTTP redirect before a browser CORS
                preflight reaches the API.
              </p>
            </div>
            <p className={styles.filterNote}>
              Filter values ignore letter case. Record IDs must match exactly.
              Use a UTC date or time for <Code>updated_since</Code>.
            </p>
          </section>

          <section className={styles.section} id="responses">
            <p className={styles.eyebrow}>Responses</p>
            <h2>Read the response envelope first.</h2>
            <p>
              Each response is JSON. Check <Code>api_version</Code> before you
              process data. <Code>generated_at</Code> is the time the API made
              this response snapshot. Use each record’s <Code>updated_at</Code>
              when you need its individual update time.
            </p>
            <CodeBlock label="the example API response">{responseExample}</CodeBlock>
            <dl className={styles.responseTerms}>
              <div>
                <dt><Code>data</Code></dt>
                <dd>The requested records or search results.</dd>
              </div>
              <div>
                <dt><Code>pagination</Code></dt>
                <dd>Page size, position, total, and direct page paths.</dd>
              </div>
              <div>
                <dt><Code>links</Code></dt>
                <dd>Canonical API paths related to the response.</dd>
              </div>
            </dl>
          </section>

          <section className={styles.section} id="records">
            <p className={styles.eyebrow}>Record endpoints</p>
            <h2>Read every public dataset.</h2>
            <p>
              Use a collection endpoint to get a page. Use the returned
              <Code>id</Code> value to get one record. Every field below has a
              type, null rule, and short description.
            </p>
            <div className={styles.endpointStack}>
              {PUBLIC_API_DATASET_NAMES.map((dataset) => (
                <EndpointCard key={dataset} dataset={dataset} />
              ))}
            </div>
          </section>

          <section className={styles.section} id="search">
            <p className={styles.eyebrow}>Search</p>
            <h2>Find a release record.</h2>
            <p>
              Send one or more letters or numbers in <Code>q</Code>. The API
              finds records that contain all search terms. Add filters to make
              the result smaller. Search results return matching metadata, not
              full editorial text.
            </p>
            <div className={styles.searchPanel}>
              <div>
                <span className={styles.method}>GET</span>
                <Code>{searchExample}</Code>
              </div>
              <a href={searchExample} aria-label="Open the search API example">
                Open search example
              </a>
            </div>
            <div className={styles.searchExplanation}>
              <Code>search_id</Code> identifies the search result. Use
              <Code>record.id</Code> and <Code>record.api_path</Code> to read
              the matching factual record.
            </div>
            <div className={styles.filterGrid}>
              {PUBLIC_API_SEARCH_FILTERS.map((filter) => (
                <div key={filter.name}>
                  <Code>{filter.name}</Code>
                  <span className={styles.typeBadge}>{filterType(filter)}</span>
                  <p>{filter.description}</p>
                  <Code>{filter.example}</Code>
                </div>
              ))}
            </div>
          </section>

          <section className={styles.section} id="errors">
            <p className={styles.eyebrow}>Errors</p>
            <h2>Check the status and error code.</h2>
            <p>
              Error responses use JSON. The <Code>error.code</Code> value is
              stable. Use it in program logic. Error responses do not enter the
              shared data cache.
            </p>
            <div className={styles.errorGrid}>
              <div>
                <Code>400</Code>
                <p>Check a query parameter or record ID.</p>
              </div>
              <div>
                <Code>404</Code>
                <p>Check the endpoint path or record ID.</p>
              </div>
              <div>
                <Code>429</Code>
                <p>Wait for <Code>Retry-After</Code> before you retry.</p>
              </div>
              <div>
                <Code>503</Code>
                <p>Wait 60 seconds. Then send the request again.</p>
              </div>
            </div>
            <CodeBlock label="the example API error response">{`{
  "api_version": "${PUBLIC_API_VERSION}",
  "error": {
    "code": "INVALID_PARAMETER",
    "message": "Set limit from 1 through ${PUBLIC_API_MAX_LIMIT}.",
    "parameter": "limit"
  }
}`}</CodeBlock>
          </section>

          <section className={styles.section} id="rules">
            <p className={styles.eyebrow}>Rules and rights</p>
            <h2>Use the public data with care.</h2>
            <div className={styles.ruleGrid}>
              <div>
                <h3>Cache</h3>
                <p>
                  Responses can stay in a shared cache for five minutes. Check
                  <Code>generated_at</Code> when time is important.
                </p>
              </div>
              <div>
                <h3>Compatibility</h3>
                <p>
                  Version Record can add documented fields in v1. A breaking
                  change uses a new versioned path.
                </p>
              </div>
              <div>
                <h3>Rate limits</h3>
                <p>
                  The production gateway can return <Code>429</Code>. Honor
                  <Code>Retry-After</Code>. Do not retry immediately.
                </p>
              </div>
              <div>
                <h3>Evidence and rights</h3>
                <p>
                  Use citation and provenance records with material claims.
                  Public factual fields use <a href={RESEARCH_EXPORT_LICENSE_URL}>CC0 1.0</a>.
                </p>
              </div>
            </div>
          </section>

          <section className={styles.endNote}>
            <p className="section-kicker">Need a complete snapshot?</p>
            <h2>Download the versioned data files.</h2>
            <p>
              Use bulk JSON or CSV files for a full archive copy. Use the API
              for filtered and paged reads.
            </p>
            <Link href="/exports/" className={styles.referenceLink}>
              Open data exports <span aria-hidden="true">→</span>
            </Link>
          </section>
        </article>
      </div>
    </div>
  );
}
