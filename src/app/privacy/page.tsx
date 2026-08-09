import Link from "next/link";
import {
  BulletList,
  ContentPage,
  ContentSection,
  Notice,
} from "@/components/content/ContentPage";
import { JsonLd, type JsonLdValue } from "@/components/seo/JsonLd";
import { publicContactEmail, publicOperatorName } from "@/lib/contact";
import { absoluteUrl, createPageMetadata } from "@/lib/site";

const pageDescription =
  "Learn how Version Record handles cookieless analytics, operational hosting data, private submissions, and optional future services.";
const lastUpdated = "August 8, 2026";

const linkClass =
  "text-[var(--accent)] hover:text-[var(--accent-hover)] underline underline-offset-4";

export const metadata = createPageMetadata({
  title: "Privacy Policy",
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
    dateModified: "2026-08-08",
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
        <Notice title="Cookieless traffic analytics is active" tone="accent">
          <p>
            Vercel Web Analytics measures visits to public pages without setting
            analytics cookies or showing an opt-in prompt. Google Analytics is
            currently disabled: no Google tag or Google Analytics preference
            panel loads, and no site data is sent to Google Analytics.
          </p>
        </Notice>

        <ContentSection title="Scope">
          <p>
            This notice covers the public Version Record website and its embedded
            editor area. Public visitors do not need an account. Site editors
            authenticate with the separate Sanity and GitHub services, which
            process editor account information under their own terms and privacy
            notices.
          </p>
          <p>
            Version Record is an independently operated website based in the
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
                The operator’s public identity will be shown here when it is
                configured.{" "}
              </>
            )}
            The site operator controls the editorial dataset, analytics
            configuration, and the purposes described in this notice. Hosting,
            analytics, content-management, domain, and project providers may act
            as service providers or as independent controllers under their own
            notices.
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

        <ContentSection title="Vercel Web Analytics">
          <p>
            Vercel Web Analytics is active on the public site so the operator
            can understand overall traffic and which pages are useful. It
            records a page-view timestamp, the cleaned page URL or dynamic path,
            the referring page, coarse geographic information, operating system,
            browser, device type, and the version of Vercel’s analytics script.
            Version Record removes query strings and fragments from the visited
            URL before the page-view event is sent.
          </p>
          <p>
            Vercel uses request information to create an anonymized hash for
            counting visits without setting a cookie. That hash changes each
            day, so it is not a persistent identifier. Vercel Web Analytics does
            not create a persistent cross-site visitor profile. The resulting
            reports are aggregated, and the site does not use this service to
            collect names, email addresses, credentials, or free-form visitor
            text.
          </p>
          <p>
            The <span className="font-mono">/studio</span> editor area is
            excluded from Vercel Web Analytics. The public site does not link
            into Studio.
          </p>
        </ContentSection>

        <ContentSection title="Google Analytics 4 is dormant">
          <p>
            The site retains an implementation of Google Analytics 4 for
            possible future use, but production Google Analytics is currently
            disabled. The Google tag does not load, no Google Analytics
            preference panel is shown, and no page views or events are sent to
            Google Analytics.
          </p>
          <p>
            If Google Analytics is reactivated, it will be optional. Consent
            Mode will initially deny analytics storage, advertising storage,
            advertising user data, and ad personalization. The Google tag will
            remain unloaded until a visitor selects “Accept analytics.”
            Accepting will grant analytics storage only; advertising settings
            will remain denied. A saved choice will be changeable later through
            an analytics-preferences control.
          </p>
          <p>
            After opt-in, Google Analytics may process page URLs and titles,
            referrers, general device and browser information, approximate
            location, engagement data, and identifiers used to distinguish
            visits. Structured product events may describe actions such as
            viewing a release or forecast, filtering a platform, exporting a
            calendar entry, or interacting with a timeline. Event properties
            will be limited to product context rather than visitor-typed
            content.
          </p>
          <p>
            The <span className="font-mono">/studio</span> editor route will
            remain excluded from Google Analytics if it is reactivated.
          </p>
        </ContentSection>

        <ContentSection title="Google Search Console">
          <p>
            Google Search Console provides the site operator with search and
            indexing reports, such as queries, impressions, clicks, ranking
            position, and crawl issues. It does not require a separate analytics
            tag on this site. Google independently controls the information it
            processes when people use Google Search.
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
              Cookieless Web Analytics is used to understand aggregate traffic
              and improve the public reference. It does not use analytics
              cookies or a persistent cross-site visitor identifier.
            </li>
            <li>
              If Google Analytics is reactivated, it will be processed only
              after opt-in and that choice will be changeable through “Analytics
              preferences.”
            </li>
            <li>
              Public corrections and feedback are processed because the sender
              chose to submit them and because reviewing the public dataset is a
              legitimate editorial interest.
            </li>
            <li>
              Information may also be processed when necessary to comply with a
              legal obligation or protect the rights and safety of the site, its
              operator, or others.
            </li>
          </BulletList>
          <p>
            These descriptions are intended to explain the site’s practices, not
            to limit rights that apply under a visitor’s local law.
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
            Vercel Web Analytics does not set an analytics-choice cookie or
            provide an on-site preference panel. Visitors can use browser
            content-blocking controls if they do not want the analytics script
            to load. If Google Analytics is reactivated, its on-site control
            will handle the opt-in choice without requiring a request. For
            another privacy request, use the private role address shown below
            when configured. A request may require enough information to
            identify the relevant record and verify that the requester is
            entitled to it. Version Record cannot directly fulfill requests for
            information controlled independently by Google, GitHub, Vercel,
            Cloudflare, Sanity, or another provider.
          </p>
        </ContentSection>

        <ContentSection title="Contact and correction submissions">
          <p>
            Sourced release additions and corrections can be submitted through
            the{" "}
            <Link href="/submit/" className={linkClass}>
              private editorial form
            </Link>
            . The report, evidence links, optional email, and optional public
            credit are stored as authenticated objects in a private Vercel Blob
            store that is separate from public site content and research
            exports. Vercel BotID Basic checks browser and network security
            signals before a report can enter that store. Cloudflare Turnstile
            can supply a second anti-abuse check when it is enabled. Nothing is
            published automatically. GitHub receives only a generic
            queue-attention notice; submission contents are not sent there.
            Reports that a visitor opens directly in GitHub remain public.
          </p>
          {publicContactEmail ? (
            <p>
              Privacy questions that require a private reply can be sent to{" "}
              <a href={`mailto:${publicContactEmail}`} className={linkClass}>
                {publicContactEmail}
              </a>
              .
            </p>
          ) : (
            <p>
              A dedicated, role-based privacy address will be displayed here
              when it is configured. Until then, do not put personal information
              in a public GitHub report.
            </p>
          )}
        </ContentSection>

        <ContentSection title="Service providers and disclosures">
          <p>
            Information is processed by service providers only as needed for
            hosting, domain delivery and security, editorial content, cookieless
            traffic analytics, any future consented Google Analytics, and
            project communication. Those providers may process information in
            countries outside the visitor’s own. They maintain their own privacy
            notices and legal obligations.
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
              </a>{" "}
              and{" "}
              <a
                href="https://vercel.com/docs/analytics/privacy-policy"
                target="_blank"
                rel="noreferrer"
                className={linkClass}
              >
                Web Analytics privacy documentation
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
            or complete a legitimate transfer of the project. There is currently
            no advertising-data sale or cross-context behavioral advertising
            program on the site.
          </p>
        </ContentSection>

        <ContentSection title="Retention">
          <p>
            Vercel’s anonymized request hash changes daily. Aggregated Web
            Analytics reports are retained under the site’s Vercel plan and
            provider settings. If Google Analytics is reactivated, its saved
            choice will remain in local browser storage until it is changed or
            site storage is cleared, and its user-level event-data retention
            will be configured to two months; aggregated reports may remain
            available longer. Operational and security records are retained
            under provider settings for as long as reasonably needed to deliver,
            secure, and troubleshoot the service.
          </p>
          <p>
            Raw private submissions and contact details are automatically
            scheduled for deletion within 180 days unless a limited legal,
            fraud, or security hold is necessary. A held record keeps its
            original received date, and normal deletion resumes when the hold
            ends. Approved public credit may remain on a release record with
            the submitter’s consent. Public GitHub submissions and their
            revision history can remain visible after an issue is closed.
            Editorial source records are retained while useful to document and
            correct the public dataset.
          </p>
        </ContentSection>

        <ContentSection title="Children">
          <p>
            The site is a general technical reference and is not directed to
            children under 13. It does not ask public visitors to create an
            account or submit a birth date. The private editorial form includes
            an optional contact-email field, but it is not designed to collect
            personal information from children. Do not submit personal
            information about a child under 13.
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
