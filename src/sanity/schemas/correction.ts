import { defineArrayMember, defineField, defineType } from "sanity";

export const correctionClaim = defineType({
  name: "correctionClaim",
  title: "Corrected Claim",
  type: "object",
  fields: [
    defineField({
      name: "affectedDocument",
      title: "Affected Document",
      type: "reference",
      to: [
        { type: "releaseVersion" },
        { type: "releaseEvent" },
        { type: "releaseBuild" },
        { type: "releaseChange" },
        { type: "sitePage" },
      ],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "claim",
      title: "Affected Claim",
      type: "text",
      rows: 3,
      validation: (rule) => rule.required().max(1500),
    }),
    defineField({
      name: "previousValue",
      title: "Previous Wording or Value",
      type: "text",
      rows: 3,
      validation: (rule) => rule.max(2000),
    }),
    defineField({
      name: "correctedValue",
      title: "Corrected Wording or Value",
      type: "text",
      rows: 3,
      validation: (rule) => rule.required().max(2000),
    }),
    defineField({
      name: "resolution",
      title: "Resolution",
      type: "text",
      rows: 3,
      description: "Explain why the public record changed.",
      validation: (rule) => rule.required().max(2000),
    }),
    defineField({
      name: "citations",
      title: "Supporting Citations",
      type: "array",
      of: [defineArrayMember({ type: "citation" })],
      validation: (rule) => rule.required().min(1),
    }),
  ],
  preview: {
    select: {
      claim: "claim",
      documentTitle: "affectedDocument.title",
      version: "affectedDocument.version",
      eventLabel: "affectedDocument.label",
      buildNumber: "affectedDocument.buildNumber",
    },
    prepare({ claim, documentTitle, version, eventLabel, buildNumber }) {
      return {
        title: claim || "Corrected claim",
        subtitle:
          documentTitle ||
          eventLabel ||
          buildNumber ||
          (version ? `Version ${version}` : "Affected document"),
      };
    },
  },
});

export const correction = defineType({
  name: "correction",
  title: "Correction",
  type: "document",
  groups: [
    { name: "public", title: "Public Record", default: true },
    { name: "evidence", title: "Evidence" },
    { name: "review", title: "Review" },
    { name: "internal", title: "Internal" },
  ],
  initialValue: {
    status: "draft",
    editorialReview: { status: "draft" },
  },
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      group: "public",
      validation: (rule) => rule.required().max(200),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      group: "public",
      options: { source: "title", maxLength: 96 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "correctionDate",
      title: "Correction Date",
      type: "date",
      group: "public",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "reasonCategory",
      title: "Reason Category",
      type: "string",
      group: "public",
      options: {
        list: [
          { title: "Factual correction", value: "factual" },
          { title: "Source or citation update", value: "sourcing" },
          { title: "Terminology clarification", value: "terminology" },
          { title: "Attribution correction", value: "attribution" },
          { title: "Presentation clarification", value: "presentation" },
          { title: "Other", value: "other" },
        ],
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "publicSummary",
      title: "Public Summary",
      type: "text",
      rows: 4,
      group: "public",
      description:
        "State what changed and why without identifying private editors or contributors.",
      validation: (rule) => rule.required().min(20).max(2000),
    }),
    defineField({
      name: "affectedClaims",
      title: "Affected Claims",
      type: "array",
      group: "public",
      of: [defineArrayMember({ type: "correctionClaim" })],
      validation: (rule) => rule.required().min(1),
    }),
    defineField({
      name: "status",
      title: "Publication Status",
      type: "string",
      group: "public",
      options: {
        list: [
          { title: "Draft", value: "draft" },
          { title: "Published", value: "published" },
          { title: "Withdrawn", value: "withdrawn" },
        ],
        layout: "radio",
      },
      validation: (rule) =>
        rule.required().custom((value, context) => {
          const review = context.document?.editorialReview as
            | { status?: string }
            | undefined;
          return value !== "published" || review?.status === "approved"
            ? true
            : "A public correction must be editorially approved.";
        }),
    }),
    defineField({
      name: "publishedAt",
      title: "Published At",
      type: "datetime",
      group: "public",
      validation: (rule) =>
        rule.custom((value, context) =>
          context.document?.status !== "published" || value
            ? true
            : "Record when this correction was published."
        ),
    }),
    defineField({
      name: "citations",
      title: "Correction Sources",
      type: "array",
      group: "evidence",
      of: [defineArrayMember({ type: "citation" })],
      validation: (rule) => rule.required().min(1),
    }),
    defineField({
      name: "auditBatches",
      title: "Related Audit Batches",
      type: "array",
      group: "evidence",
      of: [
        defineArrayMember({
          type: "reference",
          to: [{ type: "auditBatch" }],
        }),
      ],
      validation: (rule) => rule.unique(),
    }),
    defineField({
      name: "editorialReview",
      title: "Editorial Review",
      type: "editorialReview",
      group: "review",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "internalNotes",
      title: "Internal Notes",
      type: "text",
      rows: 4,
      group: "internal",
      description: "Internal only. Never include this field in public queries.",
      validation: (rule) => rule.max(5000),
    }),
  ],
  preview: {
    select: {
      title: "title",
      date: "correctionDate",
      status: "status",
      category: "reasonCategory",
    },
    prepare({ title, date, status, category }) {
      return {
        title: title || "Untitled correction",
        subtitle: [date, category, status].filter(Boolean).join(" · "),
      };
    },
  },
  orderings: [
    {
      title: "Correction Date (Newest)",
      name: "correctionDateDesc",
      by: [{ field: "correctionDate", direction: "desc" }],
    },
  ],
});
