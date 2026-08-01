import {
  ContentPage,
  ContentSection,
  Notice,
} from "@/components/content/ContentPage";
import { createPageMetadata } from "@/lib/site";
import { SubmitForm } from "./SubmitForm";

const description =
  "Submit a sourced correction, release detail, or undocumented change to Version Record's private editorial queue.";

export const metadata = createPageMetadata({
  title: "Submit a correction or source",
  description,
  path: "/submit/",
});

export default function SubmitPage() {
  const turnstileSiteKey =
    process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY?.trim() || undefined;

  return (
    <ContentPage
      eyebrow="Community evidence"
      title="Submit a correction or source"
      description="Help improve the archive with public evidence and an original explanation. Every report enters a private moderation queue; nothing is published automatically."
    >
      <Notice title="Public evidence only" tone="warning">
        <p>
          Do not submit leaks, credentials, personal data, confidential
          information, NDA-covered material, full articles, or full publisher
          release notes. Version Record records facts in original language and
          links back to the source.
        </p>
      </Notice>

      <ContentSection title="Send an editorial report">
        <SubmitForm turnstileSiteKey={turnstileSiteKey} />
      </ContentSection>

      <ContentSection title="How reports are handled">
        <p>
          Editors compare the report with the strongest available sources. A
          supported item may become a correction, citation, release event, or
          summarized change. A report can also be rejected or held when the
          evidence is incomplete.
        </p>
        <p>
          Contact details stay in the private moderation dataset and are never
          part of public search, exports, or release pages. Raw submissions are
          scheduled for deletion or anonymization within 180 days.
        </p>
      </ContentSection>
    </ContentPage>
  );
}
