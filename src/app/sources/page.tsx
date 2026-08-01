import Link from "next/link";
import {
  BulletList,
  ContentPage,
  ContentSection,
  Notice,
  OrderedSteps,
} from "@/components/content/ContentPage";
import { JsonLd, type JsonLdValue } from "@/components/seo/JsonLd";
import {
  CONTENT_COVERAGE_DESCRIPTIONS,
  CONTENT_COVERAGE_LABELS,
  type ContentCoverage,
} from "@/lib/content-coverage";
import { absoluteUrl, createPageMetadata } from "@/lib/site";

const pageDescription =
  "See which sources Version Record uses, how claims are cited, and how corrections and editorial conflicts are handled.";

const externalLinkClass =
  "text-[var(--accent)] hover:text-[var(--accent-hover)] underline underline-offset-4";

const coverageLevels: ContentCoverage[] = [
  "timelineOnly",
  "sourceLinkedRecord",
  "fullArticle",
];

export const metadata = createPageMetadata({
  title: "Sources & Editorial Policy",
  description: pageDescription,
  path: "/sources/",
});

export default function SourcesPage() {
  const canonical = absoluteUrl("/sources/");
  const structuredData: JsonLdValue = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${canonical}#webpage`,
    url: canonical,
    name: "Sources and Editorial Policy",
    description: pageDescription,
    inLanguage: "en-US",
    dateModified: "2026-07-29",
    isPartOf: { "@id": `${absoluteUrl("/")}#website` },
    about: [
      "Apple operating-system release dates",
      "Editorial standards",
      "Data corrections",
    ],
  };

  return (
    <>
      <JsonLd id="sources-structured-data" data={structuredData} />
      <ContentPage
        eyebrow="Editorial standards"
        title="Sources & editorial policy"
        description="The archive favors direct, contemporaneous evidence and makes uncertainty visible rather than turning an incomplete record into false precision."
      >
        <Notice title="The short version" tone="accent">
          <p>
            Official Apple records take priority. Independent sources can fill
            historical gaps, but they do not override stronger primary
            evidence without a documented reason.
          </p>
        </Notice>

        <ContentSection title="Source hierarchy">
          <p>
            Sources are evaluated in roughly this order, with the context and
            date of publication considered in every case:
          </p>
          <ol className="space-y-4">
            <li className="card">
              <p className="font-semibold text-[var(--text)]">
                1. Official release records
              </p>
              <p className="mt-1">
                Apple’s public release listings, release notes, security
                release pages, support documentation, and dated announcements.
              </p>
            </li>
            <li className="card">
              <p className="font-semibold text-[var(--text)]">
                2. Contemporaneous independent reporting
              </p>
              <p className="mt-1">
                Reputable publications that documented a release when it
                occurred, especially when an older official page is no longer
                available.
              </p>
            </li>
            <li className="card">
              <p className="font-semibold text-[var(--text)]">
                3. Archived and community records
              </p>
              <p className="mt-1">
                Archived pages, long-running community timelines, and other
                secondary references used to corroborate or reconstruct
                incomplete historical entries.
              </p>
            </li>
          </ol>
        </ContentSection>

        <ContentSection title="What the archive publishes">
          <p>
            Version Record writes an independent synthesis of release facts.
            It does not republish another outlet’s release-note article or
            present a publisher’s reporting as original work. Each material
            factual claim should point to the source that supports it, using an
            inline citation and a complete reference entry.
          </p>
          <BulletList>
            <li>
              Facts, dates, build identifiers, and independently described
              observations may be summarized with attribution.
            </li>
            <li>
              Quotations are used only when the exact wording matters, kept
              brief, clearly marked, and linked to the original publication.
            </li>
            <li>
              Screenshots, artwork, logos, and long excerpts are not copied
              merely to make a record feel complete.
            </li>
            <li>
              A link or citation credits the source; it does not transfer that
              publisher’s copyright or imply endorsement.
            </li>
          </BulletList>
        </ContentSection>

        <ContentSection title="Citation and evidence states">
          <p>
            Inline reference numbers connect a claim to the source ledger at
            the end of an article. The ledger records the source title,
            publisher, canonical URL, publication or access date when known,
            and an archived copy when one is appropriate.
          </p>
          <p>
            Community-sourced changes are labeled as reported, corroborated, or
            confirmed. “Undocumented” means the change was not found in the
            applicable official notes; it does not mean the change is secret or
            that every official document has been exhaustively checked.
          </p>
        </ContentSection>

        <ContentSection title="Content coverage labels">
          <p>
            A dated appearance is useful even before it has a researched
            article, but the two should not look equivalent. Every release
            record carries one of these coverage labels:
          </p>
          <div className="grid gap-3 sm:grid-cols-3">
            {coverageLevels.map((coverage) => (
              <div className="card" key={coverage}>
                <p className="font-semibold text-[var(--text)]">
                  {CONTENT_COVERAGE_LABELS[coverage]}
                </p>
                <p className="mt-2 text-sm">
                  {CONTENT_COVERAGE_DESCRIPTIONS[coverage]}
                </p>
              </div>
            ))}
          </div>
          <p>
            A linked source by itself does not make a release-notes article.
            The “Full article” label requires actual editorial prose; source
            ledgers without substantive prose remain labeled as source-linked
            records.
          </p>
        </ContentSection>

        <ContentSection title="Frequently used primary references">
          <BulletList>
            <li>
              <a
                href="https://developer.apple.com/news/releases/"
                target="_blank"
                rel="noreferrer"
                className={externalLinkClass}
              >
                Apple Developer Releases
              </a>{" "}
              for dated beta, RC, and public release listings.
            </li>
            <li>
              <a
                href="https://support.apple.com/100100"
                target="_blank"
                rel="noreferrer"
                className={externalLinkClass}
              >
                Apple security releases
              </a>{" "}
              for public operating-system availability dates and related
              release documentation.
            </li>
            <li>
              Platform-specific Apple Developer and Apple Support release
              notes linked from individual records when available.
            </li>
          </BulletList>
          <p>
            A link identifies where a claim can be checked; it does not imply
            that Apple endorses this project.
          </p>
        </ContentSection>

        <ContentSection title="Historical audit status">
          <p>
            The iOS and iPadOS chronology was comprehensively re-audited on
            July 29, 2026. The review checked developer seeds separately from
            public betas, preserved revised builds and device-limited releases,
            and marked cycles that never shipped publicly as superseded.
          </p>
          <p>
            Evidence was reconciled across Apple Developer Releases, Apple
            support and security-release records, Apple-CDN-backed firmware
            tables, and contemporaneous reporting for withdrawal or
            device-scope details. Conflicting terminology remains documented
            in the affected record instead of being silently normalized.
          </p>
        </ContentSection>

        <ContentSection title="How dates and labels are recorded">
          <BulletList>
            <li>
              A date represents the calendar day on which the referenced
              release was reported as available. Exact rollout times are not
              stored.
            </li>
            <li>
              Because releases happen globally, a source in another time zone
              may show an adjacent calendar date. The clearest primary record
              is preferred, and a note can preserve meaningful ambiguity.
            </li>
            <li>
              Milestone labels follow the source where practical—such as
              Beta, Public Beta, Release Candidate, or Public Release.
            </li>
            <li>
              Revised builds, reissued candidates, and unusual releases may be
              noted separately instead of being collapsed into a normal beta.
            </li>
            <li>
              An omitted milestone means the record is not yet documented; it
              does not prove that the milestone never existed.
            </li>
          </BulletList>
        </ContentSection>

        <ContentSection title="Conflicts and uncertainty">
          <p>
            When credible sources disagree, the editor checks whether they are
            describing different programs, audiences, build revisions, time
            zones, or rollout stages. A primary, contemporaneous source usually
            controls. If the conflict cannot be resolved confidently, the
            entry may retain a note or remain incomplete.
          </p>
          <p>
            Forecast calculations use the recorded dataset as it exists. A
            missing or misclassified historical milestone can affect an
            estimate, which is one reason forecast results include limitations
            and should not be treated as official schedules.
          </p>
        </ContentSection>

        <ContentSection title="Correction process">
          <OrderedSteps>
            <li>
              Submit a correction through the{" "}
              <Link href="/submit/" className={externalLinkClass}>
                submission form
              </Link>{" "}
              with the platform, version, milestone, current value, proposed
              value, and supporting link.
            </li>
            <li>
              The proposed change is compared with primary sources and, when
              needed, independent contemporaneous records.
            </li>
            <li>
              A supported correction is made in the editorial dataset. Public
              pages refresh after the updated content is published.
            </li>
            <li>
              If the evidence is inconclusive, the record may stay unchanged
              or receive a note until better evidence is available.
            </li>
          </OrderedSteps>
          <p>
            There is no guaranteed response or correction timetable, but
            specific reports with source links are much easier to verify.
          </p>
        </ContentSection>

        <ContentSection title="Editorial independence and commercial content">
          <p>
            Advertisers, sponsors, analytics providers, and hosting vendors do
            not receive editorial control over dates, labels, correction
            decisions, or forecasts. Paid placements, if introduced, will be
            visually distinguishable from reference content.
          </p>
          <p>
            Version Record is independent and is not affiliated with,
            sponsored by, endorsed by, or operated by Apple Inc.
          </p>
        </ContentSection>
      </ContentPage>
    </>
  );
}
