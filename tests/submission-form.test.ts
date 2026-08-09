import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { SubmitForm } from "../src/app/submit/SubmitForm";

function openingTag(html: string, id: string): string {
  const match = html.match(new RegExp("<[^>]+id=\"" + id + "\"[^>]*>"));
  assert.ok(match, "Expected an element with id " + id);
  return match[0];
}

function explicitLabel(html: string, controlId: string): string {
  const match = html.match(
    new RegExp(
      "<label[^>]+for=\"" + controlId + "\"[^>]*>[\\s\\S]*?</label>",
    ),
  );
  assert.ok(match, "Expected an explicit label for " + controlId);
  return match[0];
}

function contrastWithWhite(hex: string): number {
  const channels = [1, 3, 5].map((offset) => {
    const value = Number.parseInt(hex.slice(offset, offset + 2), 16) / 255;
    return value <= 0.04045
      ? value / 12.92
      : ((value + 0.055) / 1.055) ** 2.4;
  });
  const luminance =
    0.2126 * channels[0] + 0.7152 * channels[1] + 0.0722 * channels[2];
  return 1.05 / (luminance + 0.05);
}

test("the unhydrated submission form cannot leak private fields through GET", () => {
  const html = renderToStaticMarkup(createElement(SubmitForm));

  assert.match(html, /<form[^>]+action="\/api\/submissions\/"/);
  assert.match(html, /<form[^>]+method="post"/);
  assert.doesNotMatch(html, /<form[^>]+method="get"/);
  assert.match(openingTag(html, "submission-status"), /role="status"/);
  assert.match(html, /security controls are ready/);
  assert.match(html, /<button[^>]+type="submit"[^>]+disabled=""/);
  assert.match(html, /Preparing secure form/);
  assert.match(
    html,
    /JavaScript is required to send this private form securely/,
  );
});

test("submission controls expose stable accessible error relationships", () => {
  const html = renderToStaticMarkup(createElement(SubmitForm));
  const controls = [
    ["submissionType", "submissionType-error"],
    ["platform", "platform-error"],
    ["version", "version-error"],
    ["pageUrl", "pageUrl-error"],
    ["summary", "summary-error"],
    ["details", "details-error"],
    ["sourceUrls", "sourceUrls-error"],
    ["contactEmail", "contactEmail-error"],
    ["publicCredit", "publicCredit-error"],
    ["publicEvidenceOnly", "attestations-error"],
    ["rightsToSubmit", "attestations-error"],
    ["noConfidentialInformation", "attestations-error"],
    ["consentToContact", "consentToContact-error"],
    ["consentToPublicCredit", "consentToPublicCredit-error"],
  ] as const;

  for (const [controlId, errorId] of controls) {
    const control = openingTag(html, controlId);
    assert.match(control, /aria-invalid="false"/);
    assert.match(
      control,
      new RegExp("aria-describedby=\"[^\"]*" + errorId + "[^\"]*\""),
    );
    assert.match(openingTag(html, errorId), /hidden=""/);
  }
});

test("field help and errors are descriptions, not part of control labels", () => {
  const html = renderToStaticMarkup(createElement(SubmitForm));
  const explicitLabelIds = [
    "submissionType",
    "platform",
    "version",
    "pageUrl",
    "summary",
    "details",
    "sourceUrls",
    "contactEmail",
    "publicCredit",
  ];

  for (const controlId of explicitLabelIds) {
    const label = explicitLabel(html, controlId);
    assert.doesNotMatch(label, /<(?:input|select|textarea|span)\b/);
    assert.doesNotMatch(label, /-(?:help|error)"/);
  }
});

test("the form states exact evidence rules and retention before submission", () => {
  const html = renderToStaticMarkup(
    createElement(SubmitForm, { turnstileSiteKey: "test-site-key" }),
  );

  assert.match(
    html,
    /Only the “Other” report type can be sent without a source/,
  );
  assert.match(
    html,
    /I linked only to evidence already available to the public/,
  );
  assert.match(
    html,
    /Any optional contact email appears only in the Contact email field/,
  );
  assert.match(html, /automatically scheduled for deletion within 180 days/);
  assert.match(html, /href="\/privacy\/?"/);

  const turnstile = openingTag(html, "submission-turnstile");
  assert.match(turnstile, /aria-invalid="false"/);
  assert.match(
    turnstile,
    /aria-describedby="turnstile-help turnstileToken-error"/,
  );
  assert.match(
    html,
    /data-error-callback="versionRecordSubmissionTurnstileError"/,
  );
  assert.match(
    html,
    /data-expired-callback="versionRecordSubmissionTurnstileExpired"/,
  );
  assert.match(html, /data-size="compact"/);

  const submitButton = html.match(/<button[^>]+type="submit"[^>]*>/)?.[0];
  assert.ok(submitButton);
  assert.match(submitButton, /\btext-white\b/);
  assert.doesNotMatch(submitButton, /text-\[var\(--text-inverse\)\]/);
});

test("submission CTA colors meet AA contrast with white text", () => {
  const css = readFileSync(
    new URL("../src/app/globals.css", import.meta.url),
    "utf8",
  );
  const accentColors = [
    ...css.matchAll(/--accent-cta(?:-hover)?:\s*(#[0-9a-f]{6})/gi),
  ].map((match) => match[1]);

  assert.ok(accentColors.length >= 4);
  for (const color of accentColors) {
    assert.ok(
      contrastWithWhite(color) >= 4.5,
      `${color} must have at least 4.5:1 contrast with white text`,
    );
  }
});
