import Link from "next/link";
import {
  BulletList,
  ContentPage,
  ContentSection,
  Notice,
} from "@/components/content/ContentPage";
import { JsonLd, type JsonLdValue } from "@/components/seo/JsonLd";
import {
  publicContactEmail,
  publicOperatorName,
} from "@/lib/contact";
import { absoluteUrl, createPageMetadata } from "@/lib/site";

const pageDescription =
  "Learn how Beta Cadence uses consent-based Google Analytics, operational hosting data, local preferences, and any future advertising services.";
const lastUpdated = "July 28, 2026";
const analyticsConfigured = /^G-[A-Z0-9]+$/i.test(
  process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID?.trim() ?? "",
);

const linkClass =
  "text-[var(--accent)] hover:text-[var(--accent-hover)] underline underline-offset-4";

export const metadata = createPageMetadata({
  title: "Privacy",
  description: pageDescription,
  path: "/privacy/",
});

export default function PrivacyPage() {
  const canonical = absoluteUrl("/privacy/");
  const structuredData: JsonLdValue = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${canonical}#webpage`,
    url: canonical,
    name: "Privacy Notice",
    description: pageDescription,
    inLanguage: "en-US",
    dateModified: "2026-07-28",
    isPartOf: { "@id": `${absoluteUrl("/")}#website` },
  };

  return (
    <>
      <JsonLd id="privacy-structured-data" data={structuredData} />
      <ContentPage
        eyebrow={`Last updated ${lastUpdated}`}
        title="Privacy"
        description="This notice explains what the public site and its service providers may process, why it is used, and the choices available to visitors."
      >
        {analyticsConfigured ? (
          <Notice title="Analytics is optional" tone="accent">
            <p>
              Google Analytics does not load unless a visitor explicitly
              accepts analytics. The site’s analytics preference can be changed
              later. Advertising storage and personalization remain denied.
            </p>
          </Notice>
        ) : (
          <Notice title="Analytics is not active" tone="accent">
            <p>
              Google Analytics is not currently configured, so the site does
              not load the Google Analytics tag or show an analytics preference
              control. If optional analytics is activated, it will remain off
              until a visitor accepts.
            </p>
          </Notice>
        )}

        <ContentSection title="Scope">
          <p>
            This notice covers the public Beta Cadence website and its
            embedded editor area. Public visitors do not need an account. Site
            editors authenticate with the separate Sanity and GitHub services,
            which process editor account information under their own terms and
            privacy notices.
          </p>
          <p>
            Beta Cadence is an independently operated website based in the
            United States.{" "}
            {publicOperatorName ? (
              <>
                Its controller and operator is{" "}
                <strong className="text-[var(--text)]">
                  {publicOperatorName}
                </strong>
                .{" "}
              </>
            ) : (
              <>
                Before optional analytics or ad-account verification is
                enabled, the operator’s public identity will be shown here.{" "}
              </>
            )}
            The site operator controls the editorial dataset,
            analytics configuration, and the purposes described in this
            notice. Hosting, analytics, content-management, domain, and project
            providers may act as service providers or as independent
            controllers under their own notices.
          </p>
        </ContentSection>

        <ContentSection title="Information processed to operate the site">
          <p>
            Like most hosted websites, the infrastructure serving this site may
            process request and diagnostic information such as an IP address,
            requested URL, date and time, browser or device details, referrer,
            response status, and security signals. This information is used to
            deliver pages, prevent abuse, diagnose failures, and understand
            service performance.
          </p>
          <p>
            Vercel hosts the application. Cloudflare manages the site’s domain
            and may also process requests when its proxy or security features
            are enabled. Sanity hosts the editorial release dataset and editor
            workspace.
          </p>
        </ContentSection>

        <ContentSection title="Google Analytics 4">
          <p>
            When a Google Analytics measurement ID is configured, the site
            offers a clear analytics choice. Consent Mode defaults analytics
            storage, advertising storage, advertising user data, and ad
            personalization to denied. The Google Analytics tag does not load
            until “Accept analytics” is selected. Accepting grants analytics
            storage only; the advertising settings remain denied.
          </p>
          <p>
            After consent, Google Analytics may process page URLs and titles,
            referrers, general device and browser information, approximate
            location, engagement data, and identifiers used to distinguish
            visits. The site is designed not to send names, email addresses,
            credentials, or free-form visitor text to Google Analytics.
          </p>
          <p>
            As product measurement is connected, structured events may describe
            actions such as viewing a release or forecast, filtering a
            platform, exporting a calendar entry, following release notes,
            interacting with a timeline, sharing a release, or requesting a
            notification. Event properties are limited to product context such
            as platform, version, confidence label, sample size, or action
            type—not the visitor’s typed content.
          </p>
          <p>
            A direct load of the{" "}
            <span className="font-mono">/studio</span> editor route never
            initializes Google Analytics or shows the analytics prompt. The
            public site does not link into Studio. If an unexpected
            client-side transition enters the editor from an already measured
            public page, the application forces a full reload to remove the
            loaded tag.
          </p>
        </ContentSection>

        <ContentSection title="Your analytics choice">
          <BulletList>
            <li>
              Decline analytics when the preference prompt appears; the Google
              Analytics tag will remain unloaded.
            </li>
            <li>
              Use the site’s “Analytics preferences” control to change a saved
              choice. The preference itself is stored in the browser’s local
              storage so the site can remember it.
            </li>
            <li>
              Clear site storage in the browser to remove the saved preference
              and any analytics cookies already stored.
            </li>
            <li>
              Google also offers a{" "}
              <a
                href="https://tools.google.com/dlpage/gaoptout"
                target="_blank"
                rel="noreferrer"
                className={linkClass}
              >
                Google Analytics opt-out browser add-on
              </a>
              .
            </li>
          </BulletList>
        </ContentSection>

        <ContentSection title="Google Search Console">
          <p>
            Google Search Console provides the site operator with search and
            indexing reports, such as queries, impressions, clicks, ranking
            position, and crawl issues. It does not require a separate
            analytics tag on this site. Google independently controls the
            information it processes when people use Google Search.
          </p>
        </ContentSection>

        <ContentSection title="Why information is processed">
          <BulletList>
            <li>
              Requests, security signals, and diagnostics are processed as
              reasonably necessary to deliver, protect, and maintain the site
              and to pursue the legitimate interest in operating a reliable
              public reference.
            </li>
            <li>
              Optional Google Analytics is processed only after consent. That
              consent can be withdrawn through “Analytics preferences.”
            </li>
            <li>
              Public corrections and feedback are processed because the sender
              chose to submit them and because reviewing the public dataset is
              a legitimate editorial interest.
            </li>
            <li>
              Information may also be processed when necessary to comply with
              a legal obligation or protect the rights and safety of the site,
              its operator, or others.
            </li>
          </BulletList>
          <p>
            These descriptions are intended to explain the site’s practices,
            not to limit rights that apply under a visitor’s local law.
          </p>
        </ContentSection>

        <ContentSection title="Advertising status">
          <p>
            Advertising is not currently active. The site does not currently
            load Google AdSense, Google Ad Manager, or another advertising tag.
            The presence of this notice or an{" "}
            <span className="font-mono">ads.txt</span> file alone would not mean
            that ads are running.
          </p>
          <p>
            If advertising is introduced, this notice will be updated before
            activation to name the provider and explain the information used.
            Required consent and opt-out controls will be added for applicable
            regions, and paid placements will be labeled. Advertising will not
            be used to alter the historical dataset or forecast calculation.
          </p>
        </ContentSection>

        <ContentSection title="Privacy choices and rights">
          <p>
            Depending on where a visitor lives, applicable law may provide
            rights to request access, correction, deletion, portability, or
            restriction of personal information; to object to certain
            processing; to withdraw consent without affecting earlier
            processing; and to complain to a local data-protection authority.
          </p>
          <p>
            The on-site analytics control handles consent choices without
            requiring a request. For another privacy request, use the private
            role address shown below when configured. A request may require
            enough information to identify the relevant record and verify that
            the requester is entitled to it. Beta Cadence cannot directly
            fulfill requests for information controlled independently by
            Google, GitHub, Vercel, Cloudflare, Sanity, or another provider.
          </p>
        </ContentSection>

        <ContentSection title="Contact and correction submissions">
          <p>
            General feedback and data corrections can be submitted through the{" "}
            <Link href="/contact/" className={linkClass}>
              contact page
            </Link>
            . Reports opened in the project’s GitHub repository are public, so
            do not include private information, credentials, or anything you do
            not want published.
          </p>
          {publicContactEmail ? (
            <p>
              Privacy questions that require a private reply can be sent to{" "}
              <a
                href={`mailto:${publicContactEmail}`}
                className={linkClass}
              >
                {publicContactEmail}
              </a>
              .
            </p>
          ) : (
            <p>
              A dedicated, role-based privacy address will be displayed here
              when it is configured. Until then, do not put personal
              information in a public GitHub report.
              {analyticsConfigured
                ? " The on-site preference control remains available for analytics choices."
                : ""}
            </p>
          )}
        </ContentSection>

        <ContentSection title="Service providers and disclosures">
          <p>
            Information is processed by service providers only as needed for
            hosting, domain delivery and security, editorial content,
            consented analytics, and project communication. Those providers
            may process information in countries outside the visitor’s own.
            They maintain their own privacy notices and legal obligations.
          </p>
          <BulletList>
            <li>
              <a
                href="https://vercel.com/legal/privacy-policy"
                target="_blank"
                rel="noreferrer"
                className={linkClass}
              >
                Vercel Privacy Policy
              </a>
            </li>
            <li>
              <a
                href="https://www.cloudflare.com/privacypolicy/"
                target="_blank"
                rel="noreferrer"
                className={linkClass}
              >
                Cloudflare Privacy Policy
              </a>
            </li>
            <li>
              <a
                href="https://www.sanity.io/legal/privacy"
                target="_blank"
                rel="noreferrer"
                className={linkClass}
              >
                Sanity Privacy Policy
              </a>
            </li>
            <li>
              <a
                href="https://policies.google.com/privacy"
                target="_blank"
                rel="noreferrer"
                className={linkClass}
              >
                Google Privacy Policy
              </a>{" "}
              and{" "}
              <a
                href="https://policies.google.com/technologies/partner-sites"
                target="_blank"
                rel="noreferrer"
                className={linkClass}
              >
                Google’s information for partner sites
              </a>
            </li>
            <li>
              <a
                href="https://docs.github.com/site-policy/privacy-policies/github-general-privacy-statement"
                target="_blank"
                rel="noreferrer"
                className={linkClass}
              >
                GitHub General Privacy Statement
              </a>
            </li>
          </BulletList>
          <p>
            Information may also be disclosed when reasonably necessary to
            comply with law, protect the site or its users, investigate abuse,
            or complete a legitimate transfer of the project. There is
            currently no advertising-data sale or cross-context behavioral
            advertising program on the site.
          </p>
        </ContentSection>

        <ContentSection title="Retention">
          <p>
            The analytics choice remains in local browser storage until it is
            changed or site storage is cleared. Before GA4 is activated, its
            user-level event-data retention will be configured to two months;
            aggregated reports may remain available longer. Operational and
            security records are retained under provider settings for as long
            as reasonably needed to deliver, secure, and troubleshoot the
            service.
          </p>
          <p>
            Public GitHub submissions and their revision history can remain
            visible after an issue is closed. Editorial source records are
            retained while useful to document and correct the public dataset.
            Legal, fraud-prevention, or security needs may require a longer
            period. Provider-controlled records remain subject to the relevant
            provider’s settings and policies.
          </p>
        </ContentSection>

        <ContentSection title="Children">
          <p>
            The site is a general technical reference and is not directed to
            children under 13. It does not ask public visitors to create an
            account or submit a birth date. If a future feature intentionally
            collects visitor contact information, this notice and the feature
            design will be reviewed before launch.
          </p>
        </ContentSection>

        <ContentSection title="Changes to this notice">
          <p>
            This notice may change as the site adds features, vendors, or
            advertising. The date at the top will change when a material update
            is published. Continued availability of an old cached copy should
            not be treated as the current notice.
          </p>
        </ContentSection>
      </ContentPage>
    </>
  );
}
