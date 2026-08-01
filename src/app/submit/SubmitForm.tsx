"use client";

import Script from "next/script";
import { useState, type FormEvent } from "react";

declare global {
  interface Window {
    turnstile?: {
      reset: () => void;
    };
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
  "mt-2 w-full rounded-lg border border-[var(--border)] bg-[var(--bg-elevated)] px-3 py-2.5 text-[var(--text)] outline-none transition focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent-muted)]";
const labelClass = "block text-sm font-semibold text-[var(--text)]";
const helpClass = "mt-1 text-sm text-[var(--text-tertiary)]";

function value(form: FormData, name: string): string {
  const entry = form.get(name);
  return typeof entry === "string" ? entry : "";
}

export function SubmitForm({ turnstileSiteKey }: SubmitFormProps) {
  const [state, setState] = useState<FormState>({ status: "idle" });

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
      const response = await fetch("/api/submissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = (await response.json()) as {
        error?: string;
        fields?: Record<string, string>;
      };
      if (!response.ok) {
        setState({
          status: "error",
          message: result.error ?? "The report could not be submitted.",
          fields: result.fields,
        });
        return;
      }

      element.reset();
      window.turnstile?.reset();
      setState({ status: "success" });
    } catch {
      setState({
        status: "error",
        message: "The report could not be submitted. Please try again later.",
      });
    }
  }

  const errors = state.status === "error" ? state.fields : undefined;

  return (
    <>
      {turnstileSiteKey ? (
        <Script
          src="https://challenges.cloudflare.com/turnstile/v0/api.js"
          strategy="afterInteractive"
        />
      ) : null}
      <form
        onSubmit={submit}
        className="space-y-7"
        noValidate
        encType="application/x-www-form-urlencoded"
      >
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

        <div className="grid gap-5 sm:grid-cols-2">
          <label className={labelClass}>
            Report type
            <select
              name="submissionType"
              className={fieldClass}
              required
              defaultValue=""
              aria-describedby={
                errors?.submissionType ? "submissionType-error" : undefined
              }
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
            {errors?.submissionType ? (
              <span
                id="submissionType-error"
                className="mt-1 block text-sm text-[#ff6b60]"
              >
                {errors.submissionType}
              </span>
            ) : null}
          </label>

          <label className={labelClass}>
            Product or software track
            <input
              name="platform"
              className={fieldClass}
              required
              maxLength={80}
              placeholder="For example, iOS"
            />
            {errors?.platform ? (
              <span className="mt-1 block text-sm text-[#ff6b60]">
                {errors.platform}
              </span>
            ) : null}
          </label>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <label className={labelClass}>
            Version or build
            <input
              name="version"
              className={fieldClass}
              maxLength={80}
              placeholder="For example, 26.3 beta 4"
            />
            {errors?.version ? (
              <span className="mt-1 block text-sm text-[#ff6b60]">
                {errors.version}
              </span>
            ) : null}
          </label>

          <label className={labelClass}>
            Related Version Record page
            <input
              name="pageUrl"
              type="url"
              inputMode="url"
              className={fieldClass}
              placeholder="https://www.versionrecord.com/…"
            />
            {errors?.pageUrl ? (
              <span className="mt-1 block text-sm text-[#ff6b60]">
                {errors.pageUrl}
              </span>
            ) : null}
          </label>
        </div>

        <label className={labelClass}>
          Short summary
          <input
            name="summary"
            className={fieldClass}
            required
            minLength={10}
            maxLength={240}
            placeholder="What should an editor review?"
          />
          {errors?.summary ? (
            <span className="mt-1 block text-sm text-[#ff6b60]">
              {errors.summary}
            </span>
          ) : null}
        </label>

        <label className={labelClass}>
          Details
          <textarea
            name="details"
            className={fieldClass}
            required
            minLength={30}
            maxLength={6000}
            rows={8}
            placeholder="Describe the proposed addition or correction in your own words. Do not paste full articles, release notes, confidential material, or anything covered by an NDA."
          />
          <span className={helpClass}>
            Original summaries are easiest to review. Short quotations should
            be used only when necessary.
          </span>
          {errors?.details ? (
            <span className="mt-1 block text-sm text-[#ff6b60]">
              {errors.details}
            </span>
          ) : null}
        </label>

        <label className={labelClass}>
          Public evidence links
          <textarea
            name="sourceUrls"
            className={fieldClass}
            rows={4}
            placeholder={"https://example.com/source-one\nhttps://example.com/source-two"}
          />
          <span className={helpClass}>
            One public HTTPS URL per line, up to five. A source is required
            unless this is a general message.
          </span>
          {errors?.sourceUrls ? (
            <span className="mt-1 block text-sm text-[#ff6b60]">
              {errors.sourceUrls}
            </span>
          ) : null}
        </label>

        <div className="grid gap-5 sm:grid-cols-2">
          <label className={labelClass}>
            Contact email (optional)
            <input
              name="contactEmail"
              type="email"
              autoComplete="email"
              className={fieldClass}
              maxLength={254}
              placeholder="you@example.com"
            />
            <span className={helpClass}>
              Stored only in the private moderation inbox.
            </span>
            {errors?.contactEmail ? (
              <span className="mt-1 block text-sm text-[#ff6b60]">
                {errors.contactEmail}
              </span>
            ) : null}
          </label>

          <label className={labelClass}>
            Public credit (optional)
            <input
              name="publicCredit"
              className={fieldClass}
              maxLength={120}
              placeholder="Name or handle"
            />
            <span className={helpClass}>
              This is separate from your private email address.
            </span>
            {errors?.publicCredit ? (
              <span className="mt-1 block text-sm text-[#ff6b60]">
                {errors.publicCredit}
              </span>
            ) : null}
          </label>
        </div>

        <fieldset className="space-y-3 rounded-xl border border-[var(--border)] bg-[var(--bg-subtle)] p-5">
          <legend className="px-2 text-sm font-semibold">
            Submission confirmations
          </legend>
          <label className="flex gap-3 text-sm">
            <input name="publicEvidenceOnly" type="checkbox" required />
            <span>
              My evidence is public, or I am authorized to share it.
            </span>
          </label>
          <label className="flex gap-3 text-sm">
            <input name="rightsToSubmit" type="checkbox" required />
            <span>I have the right to provide this material.</span>
          </label>
          <label className="flex gap-3 text-sm">
            <input
              name="noConfidentialInformation"
              type="checkbox"
              required
            />
            <span>
              This contains no confidential, private, or NDA-covered
              information.
            </span>
          </label>
          <label className="flex gap-3 text-sm">
            <input name="consentToContact" type="checkbox" />
            <span>
              If I entered an email, the editorial team may contact me about
              this report.
            </span>
          </label>
          <label className="flex gap-3 text-sm">
            <input name="consentToPublicCredit" type="checkbox" />
            <span>
              If I requested public credit, that name or handle may be
              published.
            </span>
          </label>
          {errors?.attestations ||
          errors?.consentToContact ||
          errors?.consentToPublicCredit ? (
            <p className="text-sm text-[#ff6b60]">
              {errors.attestations ??
                errors.consentToContact ??
                errors.consentToPublicCredit}
            </p>
          ) : null}
        </fieldset>

        {turnstileSiteKey ? (
          <div
            className="cf-turnstile"
            data-sitekey={turnstileSiteKey}
            data-action="submission"
          />
        ) : null}

        <div className="flex flex-wrap items-center gap-4">
          <button
            type="submit"
            disabled={state.status === "sending"}
            className="rounded-lg bg-[var(--accent-cta)] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[var(--accent-cta-hover)] disabled:cursor-wait disabled:opacity-60"
          >
            {state.status === "sending" ? "Sending…" : "Send for review"}
          </button>
          <p
            role="status"
            aria-live="polite"
            className={
              state.status === "error"
                ? "text-sm text-[#ff6b60]"
                : "text-sm text-[var(--text-secondary)]"
            }
          >
            {state.status === "success"
              ? "Thanks. Your report is now in the private editorial queue."
              : state.status === "error"
                ? state.message
                : "Submissions are reviewed before anything appears publicly."}
          </p>
        </div>
      </form>
    </>
  );
}
