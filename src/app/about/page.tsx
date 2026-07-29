import Link from "next/link";
import {
  BulletList,
  ContentPage,
  ContentSection,
  Notice,
} from "@/components/content/ContentPage";
import { JsonLd, type JsonLdValue } from "@/components/seo/JsonLd";
import {
  absoluteUrl,
  createPageMetadata,
  siteName,
} from "@/lib/site";

const pageDescription =
  "Learn what Beta Cadence covers, how the independent project is maintained, and how to report a data correction.";

export const metadata = createPageMetadata({
  title: "About",
  description: pageDescription,
  path: "/about/",
});

export default function AboutPage() {
  const canonical = absoluteUrl("/about/");
  const structuredData: JsonLdValue = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    "@id": `${canonical}#webpage`,
    url: canonical,
    name: `About ${siteName}`,
    description: pageDescription,
    inLanguage: "en-US",
    isPartOf: { "@id": `${absoluteUrl("/")}#website` },
    mainEntity: { "@id": `${absoluteUrl("/")}#website` },
  };

  return (
    <>
      <JsonLd id="about-structured-data" data={structuredData} />
      <ContentPage
        eyebrow="About the project"
        title="A clearer view of Apple’s release cadence"
        description="Beta Cadence is an independent reference for people who want historical Apple OS release dates and practical context without digging through years of announcements."
      >
        <Notice title="Independent and unofficial" tone="warning">
          <p>
            This site is not affiliated with, sponsored by, endorsed by, or
            operated by Apple Inc. Apple, iOS, iPadOS, macOS, watchOS, tvOS,
            and visionOS are trademarks of Apple Inc.
          </p>
          <p>
            Dates and forecasts on this site are provided for general
            informational purposes. For official availability, compatibility,
            and security guidance, consult Apple directly.
          </p>
        </Notice>

        <ContentSection title="What this site is for">
          <p>
            The tracker organizes beta, release candidate, and public-release
            milestones into one searchable history. It is designed to answer
            questions such as:
          </p>
          <BulletList>
            <li>When did a particular operating-system beta ship?</li>
            <li>How long did comparable beta cycles take?</li>
            <li>How frequently has Apple issued the next beta?</li>
            <li>
              What range of upcoming dates is plausible based on previous
              cycles?
            </li>
          </BulletList>
          <p>
            The project currently focuses on iOS, iPadOS, macOS, watchOS,
            tvOS, and visionOS. It does not attempt to catalog every Apple app,
            service, firmware, hardware launch, or unverified rumor.
          </p>
        </ContentSection>

        <ContentSection title="Dates first, interpretation second">
          <p>
            Historical milestones are the foundation of the site. Analytics
            and forecasts are derived from that record and are presented with
            their sample size, range, and limitations where possible. A
            forecast is an estimate—not a report of an unpublished Apple
            schedule.
          </p>
          <p>
            Read the{" "}
            <Link
              href="/methodology/"
              className="text-[var(--accent)] hover:text-[var(--accent-hover)] underline underline-offset-4"
            >
              forecasting methodology
            </Link>{" "}
            to see how estimates are calculated and how to interpret
            confidence.
          </p>
        </ContentSection>

        <ContentSection title="How the record is maintained">
          <p>
            Release entries are maintained through an editorial content
            system. Official Apple materials are preferred, particularly
            Apple Developer release listings and Apple Support release
            records. Reputable contemporaneous reporting or archived
            community records may be used when an official historical page is
            unavailable.
          </p>
          <p>
            Sources can disagree, older records can be incomplete, and dates
            can differ by time zone. The{" "}
            <Link
              href="/sources/"
              className="text-[var(--accent)] hover:text-[var(--accent-hover)] underline underline-offset-4"
            >
              sources and editorial policy
            </Link>{" "}
            explains how those cases are handled.
          </p>
        </ContentSection>

        <ContentSection title="Corrections are welcome">
          <p>
            If a date, label, or link appears incorrect, report it through the{" "}
            <Link
              href="/contact/"
              className="text-[var(--accent)] hover:text-[var(--accent-hover)] underline underline-offset-4"
            >
              contact and corrections page
            </Link>
            . Include the platform, version, milestone, proposed correction,
            and a source link when available. Corrections are checked against
            the strongest available evidence before the public record changes.
          </p>
        </ContentSection>

        <ContentSection title="Keeping access open">
          <p>
            The public tracker is intended to remain quick to load and free to
            browse. The site may eventually use clearly labeled advertising or
            sponsorships to help cover hosting and maintenance. Commercial
            relationships do not determine release dates, source selection,
            corrections, or forecast results.
          </p>
          <p>
            Advertising status and related data practices are disclosed in the{" "}
            <Link
              href="/privacy/"
              className="text-[var(--accent)] hover:text-[var(--accent-hover)] underline underline-offset-4"
            >
              privacy notice
            </Link>
            .
          </p>
        </ContentSection>
      </ContentPage>
    </>
  );
}
