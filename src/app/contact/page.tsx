import Link from "next/link";
import {
  BulletList,
  ContentPage,
  ContentSection,
  Notice,
} from "@/components/content/ContentPage";
import { JsonLd, type JsonLdValue } from "@/components/seo/JsonLd";
import { publicContactEmail } from "@/lib/contact";
import { absoluteUrl, createPageMetadata, siteName } from "@/lib/site";

const pageDescription =
  "Report a release-history correction, suggest a public source, or contact Version Record without exposing private information.";
const repositoryUrl = "https://github.com/fosbrader/apple-os-dates";
const feedbackUrl = `${repositoryUrl}/issues/new?title=${encodeURIComponent(
  "Site feedback: "
)}`;
const externalLinkClass =
  "text-[var(--accent)] hover:text-[var(--accent-hover)] underline underline-offset-4";

export const metadata = createPageMetadata({
  title: "Contact & Corrections",
  description: pageDescription,
  path: "/contact/",
});

export default function ContactPage() {
  const canonical = absoluteUrl("/contact/");
  const structuredData: JsonLdValue = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    "@id": `${canonical}#webpage`,
    url: canonical,
    name: `Contact ${siteName}`,
    description: pageDescription,
    inLanguage: "en-US",
    isPartOf: { "@id": `${absoluteUrl("/")}#website` },
  };

  return (
    <>
      <JsonLd id="contact-structured-data" data={structuredData} />
      <ContentPage
        eyebrow="Contact & corrections"
        title="Help improve the record"
        description="The most useful reports are specific, sourced, and safe to discuss in public. Choose the route that matches what you found."
      >
        <Notice title="This is not Apple Support" tone="warning">
          <p>
            Version Record is independent and cannot help with Apple
            accounts, devices, beta enrollment, billing, repairs, or security
            updates. For product help, visit{" "}
            <a
              href="https://support.apple.com/"
              target="_blank"
              rel="noreferrer"
              className={externalLinkClass}
            >
              Apple Support
            </a>
            .
          </p>
        </Notice>

        <section className="grid gap-4 md:grid-cols-2">
          <div className="card flex flex-col">
            <p className="text-label mb-2">Dataset</p>
            <h2 className="text-subheading">Report a correction</h2>
            <p className="text-sm text-[var(--text-secondary)] mt-2 mb-5 flex-1">
              Flag an incorrect date, milestone label, version, source link, or
              missing release. The private editorial form prompts for the
              evidence needed to verify it.
            </p>
            <Link
              href="/submit/"
              className="inline-flex justify-center rounded-lg bg-[var(--accent-cta)] px-4 py-2 text-sm font-semibold text-white hover:bg-[var(--accent-cta-hover)] transition-colors"
            >
              Send a private editorial report
            </Link>
          </div>

          <div className="card flex flex-col">
            <p className="text-label mb-2">Product</p>
            <h2 className="text-subheading">Suggest an improvement</h2>
            <p className="text-sm text-[var(--text-secondary)] mt-2 mb-5 flex-1">
              Report a broken page, accessibility problem, confusing forecast,
              or useful feature idea through the public project tracker.
            </p>
            <a
              href={feedbackUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex justify-center rounded-lg border border-[var(--border-hover)] px-4 py-2 text-sm font-semibold hover:bg-[var(--bg-subtle)] transition-colors"
            >
              Open a feedback report
            </a>
          </div>
        </section>

        <ContentSection title="What to include in a data correction">
          <BulletList>
            <li>The operating system and complete version number.</li>
            <li>
              The milestone label, such as Beta 3, Public Beta, RC, or Public
              Release.
            </li>
            <li>The date or value currently shown and the proposed correction.</li>
            <li>
              A direct Apple source when possible, or a contemporaneous
              independent source for an older record.
            </li>
            <li>
              Context about time zone, build revision, or audience if it
              explains an apparent conflict.
            </li>
          </BulletList>
          <p>
            Read the{" "}
            <Link href="/sources/" className={externalLinkClass}>
              sources and editorial policy
            </Link>{" "}
            for the verification process.
          </p>
        </ContentSection>

        <ContentSection title="Public reports and private information">
          <p>
            Editorial reports use a separate private moderation queue. Do not
            submit credentials, private API keys, unpublished personal
            information, confidential material, or sensitive security details.
            Public GitHub issues remain available for site bugs and feature
            requests; anything posted there is public.
          </p>
          {publicContactEmail ? (
            <p>
              For a privacy question that requires a private reply, email{" "}
              <a
                href={`mailto:${publicContactEmail}`}
                className={externalLinkClass}
              >
                {publicContactEmail}
              </a>
              . This role-based address is for site privacy matters, not Apple
              product support.
            </p>
          ) : (
            <p>
              A private, role-based contact address will appear here when it is
              configured. Until then, do not put sensitive material in a public
              report. Non-sensitive privacy-policy questions can be raised
              without including personal details.
            </p>
          )}
        </ContentSection>

        <ContentSection title="What happens after a report">
          <p>
            Reports are reviewed on a best-effort basis. A correction is not
            accepted only because it was submitted; the proposed change is
            checked against the strongest available evidence. The record may
            be updated, annotated, left unchanged, or held until the conflict
            can be resolved.
          </p>
          <p>
            There is no guaranteed response time. Please avoid filing duplicate
            reports or using several channels for the same issue.
          </p>
        </ContentSection>

        <ContentSection title="Project links">
          <BulletList>
            <li>
              <Link href="/submit/" className={externalLinkClass}>
                Private source and correction form
              </Link>
            </li>
            <li>
              <Link href="/corrections/" className={externalLinkClass}>
                Public corrections ledger
              </Link>
            </li>
            <li>
              <a
                href={repositoryUrl}
                target="_blank"
                rel="noreferrer"
                className={externalLinkClass}
              >
                Source repository and public issue tracker
              </a>
            </li>
            <li>
              <Link href="/methodology/" className={externalLinkClass}>
                Forecast methodology
              </Link>
            </li>
            <li>
              <Link href="/privacy/" className={externalLinkClass}>
                Privacy notice and analytics information
              </Link>
            </li>
          </BulletList>
        </ContentSection>
      </ContentPage>
    </>
  );
}
