"use client";

import Link from "next/link";
import Script from "next/script";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type FormEvent,
} from "react";

declare global {
  interface Window {
    turnstile?: {
      reset: () => void;
    };
    versionRecordSubmissionTurnstileError?: () => void;
    versionRecordSubmissionTurnstileExpired?: () => void;
  }
}

interface SubmitFormProps {
  turnstileSiteKey?: string;
}

type FormState =
  | { status: "idle" }
  | { status: "sending" }
  | { status: "success" }
  | { status: "error"; message: string; fields?: Record<string, string> };

const fieldClass =
  "submission-field mt-2 w-full rounded-lg border border-[var(--border)] bg-[var(--bg-elevated)] px-3 py-2.5 text-[var(--text)] outline-none transition focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent-muted)] aria-[invalid=true]:border-[var(--danger)] aria-[invalid=true]:ring-1 aria-[invalid=true]:ring-[var(--danger)]";
const labelClass = "block text-sm font-semibold text-[var(--text)]";
const helpClass = "mt-1 block text-sm text-[var(--text-tertiary)]";
const errorClass = "mt-1 block text-sm text-[var(--danger)]";
const subscribeToHydration = () => () => undefined;
const clientHydrationSnapshot = () => true;
const serverHydrationSnapshot = () => false;

const errorTargetIds: Record<string, string> = {
  submissionType: "submissionType",
  platform: "platform",
  version: "version",
  pageUrl: "pageUrl",
  summary: "summary",
  details: "details",
  sourceUrls: "sourceUrls",
  contactEmail: "contactEmail",
  publicCredit: "publicCredit",
  attestations: "submission-confirmations",
  consentToContact: "consentToContact",
  consentToPublicCredit: "consentToPublicCredit",
  turnstileToken: "submission-turnstile",
};

function value(form: FormData, name: string): string {
  const entry = form.get(name);
  return typeof entry === "string" ? entry : "";
}

function retryDelay(value: string | null): string | undefined {
  if (!value) return undefined;

  const seconds = Number(value);
  const delaySeconds = Number.isFinite(seconds)
    ? Math.max(1, Math.ceil(seconds))
    : Math.max(1, Math.ceil((Date.parse(value) - Date.now()) / 1000));
  if (!Number.isFinite(delaySeconds)) return undefined;
  if (delaySeconds < 60) {
    return delaySeconds + (delaySeconds === 1 ? " second" : " seconds");
  }

  const minutes = Math.ceil(delaySeconds / 60);
  return minutes + (minutes === 1 ? " minute" : " minutes");
}

function FieldError({
  id,
  message,
}: {
  id: string;
  message?: string;
}) {
  return (
    <span id={id} className={errorClass} hidden={!message}>
      {message ?? ""}
    </span>
  );
}

export function SubmitForm({ turnstileSiteKey }: SubmitFormProps) {
  const [state, setState] = useState<FormState>({ status: "idle" });
  const errorSummaryRef = useRef<HTMLDivElement>(null);
  const successMessageRef = useRef<HTMLParagraphElement>(null);
  const isHydrated = useSyncExternalStore(
    subscribeToHydration,
    clientHydrationSnapshot,
    serverHydrationSnapshot,
  );

  const showTurnstileError = useCallback((message: string) => {
    setState({
      status: "error",
      message:
        "Complete the anti-abuse check, then send your report again. Your entries are still here.",
      fields: { turnstileToken: message },
    });
  }, []);

  useEffect(() => {
    window.versionRecordSubmissionTurnstileError = () => {
      showTurnstileError(
        "The anti-abuse check did not load. Check your connection or content blocker, then retry it.",
      );
    };
    window.versionRecordSubmissionTurnstileExpired = () => {
      showTurnstileError(
        "The anti-abuse check expired. Complete the refreshed check before sending.",
      );
    };

    return () => {
      delete window.versionRecordSubmissionTurnstileError;
      delete window.versionRecordSubmissionTurnstileExpired;
    };
  }, [showTurnstileError]);

  useEffect(() => {
    if (state.status === "error") {
      errorSummaryRef.current?.focus();
    } else if (state.status === "success") {
      successMessageRef.current?.focus();
    }
  }, [state]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (state.status === "sending") return;

    const element = event.currentTarget;
    const form = new FormData(element);
    const payload = {
      submissionType: value(form, "submissionType"),
      platform: value(form, "platform"),
      version: value(form, "version"),
      summary: value(form, "summary"),
      details: value(form, "details"),
      pageUrl: value(form, "pageUrl"),
      sourceUrls: value(form, "sourceUrls")
        .split(/\r?\n/)
        .map((url) => url.trim())
        .filter(Boolean),
      publicCredit: value(form, "publicCredit"),
      contactEmail: value(form, "contactEmail"),
      consentToContact: form.get("consentToContact") === "on",
      consentToPublicCredit: form.get("consentToPublicCredit") === "on",
      publicEvidenceOnly: form.get("publicEvidenceOnly") === "on",
      rightsToSubmit: form.get("rightsToSubmit") === "on",
      noConfidentialInformation:
        form.get("noConfidentialInformation") === "on",
      turnstileToken: value(form, "cf-turnstile-response"),
      website: value(form, "website"),
    };

    setState({ status: "sending" });
    try {
      const response = await fetch("/api/submissions/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = (await response.json().catch(() => ({}))) as {
        error?: string;
        fields?: Record<string, string>;
      };
      if (!response.ok) {
        const isTurnstileFailure =
          response.status === 400 &&
          Boolean(result.error?.toLowerCase().includes("anti-abuse"));
        const fields = {
          ...result.fields,
          ...(isTurnstileFailure && result.error
            ? { turnstileToken: result.error }
            : {}),
        };
        const wait = retryDelay(response.headers.get("retry-after"));
        const message =
          response.status === 429
            ? "Too many reports were sent recently. Wait " +
              (wait ?? "a few minutes") +
              " before trying again. Your entries are still here."
            : response.status === 503
              ? "The private queue is temporarily unavailable. Try again in " +
                (wait ?? "a few minutes") +
                ". Your entries are still here."
              : Object.keys(fields).length > 0
                ? "Check the fields listed below, then send your report again. Your entries are still here."
                : result.error ??
                  "The report could not be submitted. Your entries are still here.";

        setState({
          status: "error",
          message,
          fields: Object.keys(fields).length > 0 ? fields : undefined,
        });
        if (isTurnstileFailure) window.turnstile?.reset();
        return;
      }

      element.reset();
      window.turnstile?.reset();
      setState({ status: "success" });
    } catch {
      setState({
        status: "error",
        message:
          "The report could not be submitted. Check your connection and try again. Your entries are still here.",
      });
    }
  }

  const errors = state.status === "error" ? state.fields : undefined;
  const listedErrors = Object.entries(errors ?? {}).filter(
    ([name]) => name !== "form",
  );
  const isSending = state.status === "sending";

  return (
    <>
      {turnstileSiteKey ? (
        <Script
          src="https://challenges.cloudflare.com/turnstile/v0/api.js"
          strategy="afterInteractive"
          onError={() =>
            showTurnstileError(
              "The anti-abuse check did not load. Check your connection or content blocker, then reload the page.",
            )
          }
        />
      ) : null}
      <form
        onSubmit={submit}
        className="space-y-7"
        action="/api/submissions/"
        method="post"
        noValidate
        aria-busy={isSending}
      >
        <noscript>
          <p className="rounded-xl border border-[var(--danger)] bg-[var(--danger-muted)] p-4 text-sm text-[var(--text)]">
            JavaScript is required to send this private form securely. The form
            is disabled, and none of your information has been sent.
          </p>
        </noscript>

        <div
          aria-hidden="true"
          className="absolute -left-[10000px] h-px w-px overflow-hidden"
        >
          <label htmlFor="website">Website</label>
          <input
            id="website"
            name="website"
            type="text"
            tabIndex={-1}
            autoComplete="off"
          />
        </div>

        {state.status === "error" ? (
          <div
            ref={errorSummaryRef}
            id="submission-error-summary"
            role="alert"
            tabIndex={-1}
            aria-labelledby="submission-error-title"
            className="rounded-xl border border-[var(--danger)] bg-[var(--danger-muted)] p-4 text-sm text-[var(--text)] outline-none focus:ring-2 focus:ring-[var(--danger)]"
          >
            <h3 id="submission-error-title" className="font-semibold">
              We could not send your report
            </h3>
            <p className="mt-1">{state.message}</p>
            {errors?.form ? (
              <p className="mt-2 text-[var(--danger)]">{errors.form}</p>
            ) : null}
            {listedErrors.length > 0 ? (
              <ul className="mt-3 list-disc space-y-1 pl-5">
                {listedErrors.map(([name, message]) => {
                  const targetId = errorTargetIds[name];
                  return (
                    <li key={name}>
                      {targetId ? (
                        <a
                          href={"#" + targetId}
                          className="text-[var(--danger)] underline underline-offset-4"
                        >
                          {message}
                        </a>
                      ) : (
                        message
                      )}
                    </li>
                  );
                })}
              </ul>
            ) : null}
          </div>
        ) : null}

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="submissionType" className={labelClass}>
              Report type (required)
            </label>
            <select
              id="submissionType"
              name="submissionType"
              className={fieldClass}
              required
              defaultValue=""
              aria-invalid={Boolean(errors?.submissionType)}
              aria-describedby="submissionType-error"
            >
              <option value="" disabled>
                Choose one
              </option>
              <option value="correction">Correction</option>
              <option value="release">New release or event</option>
              <option value="undocumentedChange">
                Undocumented change
              </option>
              <option value="source">Source suggestion</option>
              <option value="other">Other</option>
            </select>
            <FieldError
              id="submissionType-error"
              message={errors?.submissionType}
            />
          </div>

          <div>
            <label htmlFor="platform" className={labelClass}>
              Product or software track (required)
            </label>
            <input
              id="platform"
              name="platform"
              className={fieldClass}
              required
              maxLength={80}
              placeholder="For example, iOS or site-wide"
              aria-invalid={Boolean(errors?.platform)}
              aria-describedby="platform-error"
            />
            <FieldError id="platform-error" message={errors?.platform} />
          </div>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="version" className={labelClass}>
              Version or build (optional)
            </label>
            <input
              id="version"
              name="version"
              className={fieldClass}
              maxLength={80}
              placeholder="For example, 26.3 beta 4"
              aria-invalid={Boolean(errors?.version)}
              aria-describedby="version-error"
            />
            <FieldError id="version-error" message={errors?.version} />
          </div>

          <div>
            <label htmlFor="pageUrl" className={labelClass}>
              Related Version Record page (optional)
            </label>
            <input
              id="pageUrl"
              name="pageUrl"
              type="url"
              inputMode="url"
              className={fieldClass}
              maxLength={2048}
              placeholder="https://www.versionrecord.com/…"
              aria-invalid={Boolean(errors?.pageUrl)}
              aria-describedby="pageUrl-error"
            />
            <FieldError id="pageUrl-error" message={errors?.pageUrl} />
          </div>
        </div>

        <div>
          <label htmlFor="summary" className={labelClass}>
            Short summary (required)
          </label>
          <input
            id="summary"
            name="summary"
            className={fieldClass}
            required
            minLength={10}
            maxLength={240}
            placeholder="What should an editor review?"
            aria-invalid={Boolean(errors?.summary)}
            aria-describedby="summary-error"
          />
          <FieldError id="summary-error" message={errors?.summary} />
        </div>

        <div>
          <label htmlFor="details" className={labelClass}>
            Details (required)
          </label>
          <textarea
            id="details"
            name="details"
            className={fieldClass}
            required
            minLength={30}
            maxLength={6000}
            rows={8}
            placeholder="Describe the proposed addition or correction in your own words. Do not paste full articles, release notes, confidential material, or anything covered by an NDA."
            aria-invalid={Boolean(errors?.details)}
            aria-describedby="details-help details-error"
          />
          <span id="details-help" className={helpClass}>
            Original summaries are easiest to review. Short quotations should
            be used only when necessary.
          </span>
          <FieldError id="details-error" message={errors?.details} />
        </div>

        <div>
          <label htmlFor="sourceUrls" className={labelClass}>
            Public evidence links (required unless report type is Other)
          </label>
          <textarea
            id="sourceUrls"
            name="sourceUrls"
            className={fieldClass}
            rows={4}
            placeholder={"https://example.com/source-one\nhttps://example.com/source-two"}
            aria-invalid={Boolean(errors?.sourceUrls)}
            aria-describedby="sourceUrls-help sourceUrls-error"
          />
          <span id="sourceUrls-help" className={helpClass}>
            Enter one public HTTPS URL per line, up to five. Only the “Other”
            report type can be sent without a source.
          </span>
          <FieldError id="sourceUrls-error" message={errors?.sourceUrls} />
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="contactEmail" className={labelClass}>
              Contact email (optional)
            </label>
            <input
              id="contactEmail"
              name="contactEmail"
              type="email"
              autoComplete="email"
              className={fieldClass}
              maxLength={254}
              placeholder="you@example.com"
              aria-invalid={Boolean(errors?.contactEmail)}
              aria-describedby="contactEmail-help contactEmail-error"
            />
            <span id="contactEmail-help" className={helpClass}>
              Stored only in the private submission inbox. If you enter an
              email, also select contact permission below.
            </span>
            <FieldError
              id="contactEmail-error"
              message={errors?.contactEmail}
            />
          </div>

          <div>
            <label htmlFor="publicCredit" className={labelClass}>
              Public credit (optional)
            </label>
            <input
              id="publicCredit"
              name="publicCredit"
              className={fieldClass}
              maxLength={120}
              placeholder="Name or handle"
              aria-invalid={Boolean(errors?.publicCredit)}
              aria-describedby="publicCredit-help publicCredit-error"
            />
            <span id="publicCredit-help" className={helpClass}>
              This is separate from your private email address. If you enter a
              name or handle, also select publication permission below.
            </span>
            <FieldError
              id="publicCredit-error"
              message={errors?.publicCredit}
            />
          </div>
        </div>

        <fieldset
          id="submission-confirmations"
          className="space-y-3 rounded-xl border border-[var(--border)] bg-[var(--bg-subtle)] p-5"
          tabIndex={errors?.attestations ? -1 : undefined}
          aria-describedby="submission-confirmations-help attestations-error"
        >
          <legend className="px-2 text-sm font-semibold">
            Submission confirmations
          </legend>
          <p
            id="submission-confirmations-help"
            className="text-sm text-[var(--text-tertiary)]"
          >
            The first three confirmations are required. The last two are
            required only when you provide the related optional information.
          </p>
          <label className="flex gap-3 text-sm">
            <input
              id="publicEvidenceOnly"
              name="publicEvidenceOnly"
              type="checkbox"
              required
              aria-invalid={Boolean(errors?.attestations)}
              aria-describedby="attestations-error"
            />
            <span>
              Required: I linked only to evidence already available to the
              public.
            </span>
          </label>
          <label className="flex gap-3 text-sm">
            <input
              id="rightsToSubmit"
              name="rightsToSubmit"
              type="checkbox"
              required
              aria-invalid={Boolean(errors?.attestations)}
              aria-describedby="attestations-error"
            />
            <span>Required: I have the right to provide this material.</span>
          </label>
          <label className="flex gap-3 text-sm">
            <input
              id="noConfidentialInformation"
              name="noConfidentialInformation"
              type="checkbox"
              required
              aria-invalid={Boolean(errors?.attestations)}
              aria-describedby="attestations-error"
            />
            <span>
              Required: My report text and evidence contain no credentials,
              personal data, confidential information, or NDA-covered
              material. Any optional contact email appears only in the Contact
              email field.
            </span>
          </label>
          <FieldError id="attestations-error" message={errors?.attestations} />

          <label className="flex gap-3 text-sm">
            <input
              id="consentToContact"
              name="consentToContact"
              type="checkbox"
              aria-invalid={Boolean(errors?.consentToContact)}
              aria-describedby="consentToContact-error"
            />
            <span>
              Required if I entered an email: the editorial team may contact me
              about this report.
            </span>
          </label>
          <FieldError
            id="consentToContact-error"
            message={errors?.consentToContact}
          />

          <label className="flex gap-3 text-sm">
            <input
              id="consentToPublicCredit"
              name="consentToPublicCredit"
              type="checkbox"
              aria-invalid={Boolean(errors?.consentToPublicCredit)}
              aria-describedby="consentToPublicCredit-error"
            />
            <span>
              Required if I requested public credit: that name or handle may be
              published.
            </span>
          </label>
          <FieldError
            id="consentToPublicCredit-error"
            message={errors?.consentToPublicCredit}
          />
        </fieldset>

        {turnstileSiteKey ? (
          <div
            id="submission-turnstile"
            tabIndex={errors?.turnstileToken ? -1 : undefined}
            aria-invalid={Boolean(errors?.turnstileToken)}
            aria-describedby="turnstile-help turnstileToken-error"
          >
            <p className={labelClass}>Anti-abuse check (required)</p>
            <div
              className="cf-turnstile mt-2"
              data-sitekey={turnstileSiteKey}
              data-action="submission"
              data-size="compact"
              data-error-callback="versionRecordSubmissionTurnstileError"
              data-expired-callback="versionRecordSubmissionTurnstileExpired"
              data-refresh-expired="auto"
              data-retry="auto"
            />
            <p id="turnstile-help" className={helpClass}>
              Complete this check before sending. If it fails or expires, the
              form keeps your entries so you can retry.
            </p>
            <FieldError
              id="turnstileToken-error"
              message={errors?.turnstileToken}
            />
          </div>
        ) : null}

        <p
          id="submission-privacy-note"
          className="rounded-xl border border-[var(--border)] bg-[var(--bg-subtle)] p-4 text-sm text-[var(--text-secondary)]"
        >
          Before sending: your report and optional contact details will be
          stored in the private Vercel submission store and automatically
          scheduled for deletion within 180 days, except during a limited
          legal, fraud, or security hold. Nothing is published automatically.{" "}
          <Link
            href="/privacy/"
            className="text-[var(--accent)] underline underline-offset-4 hover:text-[var(--accent-hover)]"
          >
            Read the privacy notice
          </Link>
          .
        </p>

        <div className="flex flex-wrap items-center gap-4">
          <button
            type="submit"
            disabled={!isHydrated || isSending}
            aria-busy={isSending}
            aria-describedby="submission-privacy-note submission-status"
            className="rounded-lg bg-[var(--accent-cta)] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[var(--accent-cta-hover)] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {!isHydrated
              ? "Preparing secure form…"
              : isSending
                ? "Sending…"
                : "Send for review"}
          </button>
          <p
            ref={successMessageRef}
            id="submission-status"
            role="status"
            aria-live="polite"
            tabIndex={state.status === "success" ? -1 : undefined}
            className={
              state.status === "error"
                ? "text-sm text-[var(--danger)] outline-none focus:ring-2 focus:ring-[var(--accent)]"
                : "text-sm text-[var(--text-secondary)]"
            }
          >
            {state.status === "success"
              ? "Thanks. Your report is now in the private editorial queue."
              : isSending
                ? "Sending your report securely…"
                : state.status === "error"
                  ? "Your entries are still here. Review the error summary above."
                  : isHydrated
                    ? "Submissions are reviewed before anything appears publicly."
                    : "The form will be available when its security controls are ready."}
          </p>
        </div>
      </form>
    </>
  );
}
