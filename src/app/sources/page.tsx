import Link from "next/link";
import {
  BulletList,
  ContentPage,
  ContentSection,
  Notice,
  OrderedSteps,
} from "@/components/content/ContentPage";
import { JsonLd, type JsonLdValue } from "@/components/seo/JsonLd";
import { absoluteUrl, createPageMetadata } from "@/lib/site";

const pageDescription =
  "See which sources Beta Cadence uses, how dates are verified, and how corrections and editorial conflicts are handled.";

const externalLinkClass =
  "text-[var(--accent)] hover:text-[var(--accent-hover)] underline underline-offset-4";

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
        description="The tracker favors direct, contemporaneous evidence and makes uncertainty visible rather than turning an incomplete record into false precision."
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
              <Link href="/contact/" className={externalLinkClass}>
                contact page
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
            Beta Cadence is independent and is not affiliated with,
            sponsored by, endorsed by, or operated by Apple Inc.
          </p>
        </ContentSection>
      </ContentPage>
    </>
  );
}
