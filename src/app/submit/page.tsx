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
          Submit only evidence that is already available to the public. Do not
          put leaks, credentials, personal data, confidential information,
          NDA-covered material, full articles, or full publisher release notes
          in the report text or evidence. You may provide your own optional
          contact email only in the labeled Contact email field. Version Record
          records facts in original language and links back to the source.
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
          Contact details stay in the private Vercel submission store and are
          never part of public search, exports, release pages, or GitHub queue
          notices. Raw submissions are automatically scheduled for deletion
          within 180 days, except during a limited legal, fraud, or security
          hold described in the privacy notice.
        </p>
      </ContentSection>
    </ContentPage>
  );
}
