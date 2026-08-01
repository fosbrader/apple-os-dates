import Link from "next/link";
import { PortableArticle } from "@/components/editorial/PortableArticle";
import { JsonLd, type JsonLdValue } from "@/components/seo/JsonLd";
import { getPublishedCorrections } from "@/lib/sanity.fetch";
import { absoluteUrl, createPageMetadata } from "@/lib/site";
import { formatDate } from "@/lib/utils";

const pageDescription =
  "A public ledger of material corrections to Version Record release dates, claims, sourcing, attribution, and terminology.";

export const metadata = createPageMetadata({
  title: "Corrections Ledger",
  description: pageDescription,
  path: "/corrections/",
});

export default async function CorrectionsPage() {
  const corrections = await getPublishedCorrections();
  const canonical = absoluteUrl("/corrections/");
  const structuredData: JsonLdValue = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${canonical}#webpage`,
    url: canonical,
    name: "Version Record Corrections Ledger",
    description: pageDescription,
    isPartOf: { "@id": `${absoluteUrl("/")}#website` },
    hasPart: corrections.map((correction) => ({
      "@type": "CorrectionComment",
      name: correction.title,
      dateCreated: correction.correctionDate,
      text: correction.publicSummary,
    })),
  };

  return (
    <>
      <JsonLd id="corrections-structured-data" data={structuredData} />
      <div className="content-page space-y-16">
        <header className="content-page__header">
          <div>
            <p className="section-kicker">Public editorial record</p>
            <h1 className="text-display">Corrections ledger</h1>
          </div>
          <div className="content-page__description space-y-3">
            <p>
              Material factual, sourcing, attribution, and terminology changes
              are recorded here. Quiet copy edits and routine additions are not
              treated as corrections.
            </p>
            <p>
              <Link className="text-link" href="/submit/">
                Report a possible error →
              </Link>
            </p>
          </div>
        </header>

        {corrections.length > 0 ? (
          <ol className="correction-ledger">
            {corrections.map((correction) => (
              <li id={correction.slug.current} key={correction._id}>
                <article>
                  <header>
                    <div>
                      <p className="section-kicker">
                        {correction.reasonCategory}
                      </p>
                      <h2>{correction.title}</h2>
                    </div>
                    <time dateTime={correction.correctionDate}>
                      {formatDate(correction.correctionDate)}
                    </time>
                  </header>
                  <p className="correction-ledger__summary">
                    {correction.publicSummary}
                  </p>
                  <div className="correction-claims">
                    {correction.affectedClaims.map((claim) => (
                      <section key={claim._key}>
                        <h3>{claim.claim}</h3>
                        <dl>
                          {claim.previousValue ? (
                            <div>
                              <dt>Previous</dt>
                              <dd>{claim.previousValue}</dd>
                            </div>
                          ) : null}
                          <div>
                            <dt>Corrected</dt>
                            <dd>{claim.correctedValue}</dd>
                          </div>
                          <div>
                            <dt>Resolution</dt>
                            <dd>{claim.resolution}</dd>
                          </div>
                        </dl>
                        {claim.citations?.length ? (
                          <ul>
                            {claim.citations.map((citation, index) => (
                              <li
                                key={
                                  citation._key ??
                                  citation.source._id ??
                                  index
                                }
                              >
                                <a
                                  href={citation.source.canonicalUrl}
                                  rel="external nofollow noopener noreferrer"
                                  target="_blank"
                                >
                                  [{index + 1}] {citation.source.title}
                                </a>
                              </li>
                            ))}
                          </ul>
                        ) : null}
                      </section>
                    ))}
                  </div>
                  {correction.citations?.length ? (
                    <PortableArticle
                      citations={correction.citations}
                    />
                  ) : null}
                </article>
              </li>
            ))}
          </ol>
        ) : (
          <section className="content-notice">
            <h2>No material corrections are currently published</h2>
            <div className="content-notice__body">
              <p>
                The audited chronology remains versioned in the project
                history. Future material corrections will appear here after
                source review and editorial approval.
              </p>
            </div>
          </section>
        )}

        <aside className="provenance-panel">
          <div>
            <p className="section-kicker">Correction standard</p>
          </div>
          <div className="provenance-panel__copy">
            <p>
              Every published correction identifies the affected claim, the
              corrected value, the reason for the change, and supporting
              evidence. Submissions are reviewed privately; submitter contact
              details are never included in this public ledger.
            </p>
            <p>
              <Link href="/sources/">Read the editorial policy</Link>
              {" · "}
              <Link href="/submit/">Submit evidence</Link>
            </p>
          </div>
        </aside>
      </div>
    </>
  );
}
