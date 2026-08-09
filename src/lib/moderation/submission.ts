import { canonicalizePublicHttpsUrl } from "./urls";

export const submissionKinds = [
  "correction",
  "release",
  "undocumentedChange",
  "source",
  "other",
] as const;

export type SubmissionKind = (typeof submissionKinds)[number];

export interface ValidSubmission {
  submissionType: SubmissionKind;
  platform: string;
  version?: string;
  summary: string;
  details: string;
  pageUrl?: string;
  sourceUrls: string[];
  publicCredit?: string;
  contactEmail?: string;
  consentToContact: boolean;
  consentToPublicCredit: boolean;
  attestations: {
    publicEvidenceOnly: true;
    rightsToSubmit: true;
    noConfidentialInformation: true;
  };
  turnstileToken?: string;
}

export type SubmissionValidationResult =
  | { ok: true; value: ValidSubmission }
  | { ok: false; errors: Record<string, string> };

function plainRecord(value: unknown): Record<string, unknown> | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  const prototype = Object.getPrototypeOf(value);
  return prototype === Object.prototype || prototype === null
    ? (value as Record<string, unknown>)
    : null;
}

function stringField(
  record: Record<string, unknown>,
  name: string,
): string {
  return typeof record[name] === "string" ? record[name].trim() : "";
}

function lengthError(
  value: string,
  minimum: number,
  maximum: number,
  label: string,
): string | undefined {
  if (value.length < minimum) {
    return `${label} must be at least ${minimum} characters.`;
  }
  if (value.length > maximum) {
    return `${label} must be no more than ${maximum} characters.`;
  }
}

/**
 * Reject terminal control and bidirectional-formatting characters that can
 * alter operator output. Newlines, tabs, and carriage returns remain valid in
 * report prose because JSON serialization escapes them before terminal output.
 */
export function containsUnsafeSubmissionCharacters(value: string): boolean {
  return /[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f-\u009f\u061c\u200e\u200f\u2028-\u202e\u2066-\u2069]/.test(
    value,
  );
}

function normalizeSourceUrls(value: unknown): {
  urls: string[];
  error?: string;
} {
  if (!Array.isArray(value)) {
    return { urls: [], error: "Add at least one supporting source URL." };
  }
  if (value.length > 5) {
    return { urls: [], error: "Add no more than five source URLs." };
  }

  const urls: string[] = [];
  for (const item of value) {
    if (typeof item !== "string" || item.length > 2_048) {
      return { urls: [], error: "Every source must be an HTTPS URL." };
    }
    const url = canonicalizePublicHttpsUrl(item);
    if (!url) {
      return { urls: [], error: "Every source must be a public HTTPS URL." };
    }
    if (!urls.includes(url)) urls.push(url);
  }

  return { urls };
}

function validEmail(value: string): boolean {
  return (
    value.length <= 254 &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) &&
    !/[\r\n]/.test(value)
  );
}

export function validateSubmission(
  input: unknown,
): SubmissionValidationResult {
  const record = plainRecord(input);
  if (!record) {
    return {
      ok: false,
      errors: { form: "The submission could not be read." },
    };
  }

  const errors: Record<string, string> = {};
  const submissionType = stringField(record, "submissionType");
  const platform = stringField(record, "platform");
  const version = stringField(record, "version");
  const summary = stringField(record, "summary");
  const details = stringField(record, "details");
  const pageUrlValue = stringField(record, "pageUrl");
  const publicCredit = stringField(record, "publicCredit");
  const contactEmail = stringField(record, "contactEmail").toLowerCase();
  const consentToContact = record.consentToContact === true;
  const consentToPublicCredit = record.consentToPublicCredit === true;
  const publicEvidenceOnly = record.publicEvidenceOnly === true;
  const rightsToSubmit = record.rightsToSubmit === true;
  const noConfidentialInformation =
    record.noConfidentialInformation === true;
  const turnstileToken = stringField(record, "turnstileToken");

  const rawTextValues = [
    "submissionType",
    "platform",
    "version",
    "summary",
    "details",
    "pageUrl",
    "publicCredit",
    "contactEmail",
    "turnstileToken",
  ]
    .map((name) => record[name])
    .filter((value): value is string => typeof value === "string");
  if (Array.isArray(record.sourceUrls)) {
    rawTextValues.push(
      ...record.sourceUrls.filter(
        (value): value is string => typeof value === "string",
      ),
    );
  }
  if (rawTextValues.some(containsUnsafeSubmissionCharacters)) {
    errors.form = "The submission contains unsupported control characters.";
  }

  if (!submissionKinds.includes(submissionType as SubmissionKind)) {
    errors.submissionType = "Choose a submission type.";
  }
  errors.platform =
    lengthError(platform, 2, 80, "Product or software track") ?? "";
  if (!errors.platform) delete errors.platform;
  if (version.length > 80) {
    errors.version = "Version must be no more than 80 characters.";
  }
  errors.summary = lengthError(summary, 10, 240, "Summary") ?? "";
  if (!errors.summary) delete errors.summary;
  errors.details = lengthError(details, 30, 6000, "Details") ?? "";
  if (!errors.details) delete errors.details;

  const pageUrl = pageUrlValue
    ? canonicalizePublicHttpsUrl(pageUrlValue)
    : undefined;
  if (
    pageUrlValue &&
    (!pageUrl ||
      pageUrlValue.length > 2_048 ||
      !["versionrecord.com", "www.versionrecord.com"].includes(
        new URL(pageUrl).hostname,
      ))
  ) {
    errors.pageUrl =
      "The related page must be an HTTPS page on versionrecord.com.";
  }

  const sourceResult = normalizeSourceUrls(record.sourceUrls);
  if (sourceResult.error) errors.sourceUrls = sourceResult.error;
  if (
    submissionType !== "other" &&
    sourceResult.urls.length === 0
  ) {
    errors.sourceUrls = "Add at least one supporting source URL.";
  }

  if (publicCredit.length > 120) {
    errors.publicCredit = "Public credit must be no more than 120 characters.";
  }
  if (contactEmail && !validEmail(contactEmail)) {
    errors.contactEmail = "Enter a valid email address.";
  }
  if (contactEmail && !consentToContact) {
    errors.consentToContact =
      "Confirm that the editorial team may contact you about this report.";
  }
  if (publicCredit && !consentToPublicCredit) {
    errors.consentToPublicCredit =
      "Confirm that this name or handle may appear publicly.";
  }
  if (!publicEvidenceOnly || !rightsToSubmit || !noConfidentialInformation) {
    errors.attestations =
      "Confirm all three evidence and confidentiality statements.";
  }
  if (turnstileToken.length > 2048) {
    errors.turnstileToken = "The anti-abuse token is invalid.";
  }
  if (Object.keys(errors).length > 0) return { ok: false, errors };

  return {
    ok: true,
    value: {
      submissionType: submissionType as SubmissionKind,
      platform,
      ...(version ? { version } : {}),
      summary,
      details,
      ...(pageUrl ? { pageUrl } : {}),
      sourceUrls: sourceResult.urls,
      ...(publicCredit ? { publicCredit } : {}),
      ...(contactEmail ? { contactEmail } : {}),
      consentToContact,
      consentToPublicCredit,
      attestations: {
        publicEvidenceOnly: true,
        rightsToSubmit: true,
        noConfidentialInformation: true,
      },
      ...(turnstileToken ? { turnstileToken } : {}),
    },
  };
}
