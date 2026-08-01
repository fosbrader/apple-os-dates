import { defineArrayMember, defineField, defineType } from "sanity";

export const citation = defineType({
  name: "citation",
  title: "Citation",
  type: "object",
  fields: [
    defineField({
      name: "source",
      title: "Source",
      type: "reference",
      to: [{ type: "source" }],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "locator",
      title: "Locator",
      type: "string",
      description:
        "Section heading, page, paragraph, timestamp, or other precise locator.",
      validation: (rule) => rule.max(240),
    }),
    defineField({
      name: "note",
      title: "Citation Note",
      type: "string",
      description:
        "Optional explanation of exactly what this source supports.",
      validation: (rule) => rule.max(500),
    }),
    defineField({
      name: "quotedText",
      title: "Short Quotation",
      type: "text",
      rows: 2,
      description:
        "Use only when necessary. Keep quotations short and independently justified.",
      validation: (rule) =>
        rule
          .max(300)
          .warning("Prefer an original summary over quoted publisher wording."),
    }),
  ],
  preview: {
    select: {
      title: "source.title",
      publisher: "source.publisher",
      locator: "locator",
    },
    prepare({ title, publisher, locator }) {
      return {
        title: title || "Source citation",
        subtitle: [publisher, locator].filter(Boolean).join(" · "),
      };
    },
  },
});

export const releaseApplicability = defineType({
  name: "releaseApplicability",
  title: "Applicability",
  type: "object",
  fields: [
    defineField({
      name: "deviceFamilies",
      title: "Device Families",
      type: "array",
      of: [defineArrayMember({ type: "string" })],
      options: { layout: "tags" },
      validation: (rule) => rule.unique(),
    }),
    defineField({
      name: "models",
      title: "Specific Models",
      type: "array",
      of: [defineArrayMember({ type: "string" })],
      options: { layout: "tags" },
      validation: (rule) => rule.unique(),
    }),
    defineField({
      name: "regions",
      title: "Regions",
      type: "array",
      of: [defineArrayMember({ type: "string" })],
      options: { layout: "tags" },
      validation: (rule) => rule.unique(),
    }),
    defineField({
      name: "languages",
      title: "Languages",
      type: "array",
      of: [defineArrayMember({ type: "string" })],
      options: { layout: "tags" },
      validation: (rule) => rule.unique(),
    }),
    defineField({
      name: "audiences",
      title: "Audiences",
      type: "array",
      of: [
        defineArrayMember({
          type: "string",
          options: {
            list: [
              { title: "Developers", value: "developers" },
              { title: "Public beta testers", value: "publicBetaTesters" },
              { title: "General public", value: "generalPublic" },
              { title: "Enterprise", value: "enterprise" },
              { title: "Education", value: "education" },
              { title: "Other", value: "other" },
            ],
          },
        }),
      ],
      validation: (rule) => rule.unique(),
    }),
    defineField({
      name: "notes",
      title: "Applicability Notes",
      type: "text",
      rows: 3,
      validation: (rule) => rule.max(1000),
    }),
  ],
});

export const editorialReview = defineType({
  name: "editorialReview",
  title: "Editorial Review",
  type: "object",
  initialValue: {
    status: "draft",
  },
  fields: [
    defineField({
      name: "status",
      title: "Status",
      type: "string",
      options: {
        list: [
          { title: "Draft", value: "draft" },
          { title: "Needs evidence", value: "needsEvidence" },
          { title: "Ready for review", value: "readyForReview" },
          { title: "Approved", value: "approved" },
          { title: "Rejected", value: "rejected" },
        ],
        layout: "radio",
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "reviewedAt",
      title: "Reviewed At",
      type: "datetime",
      description: "Required when the status is Approved or Rejected.",
      validation: (rule) =>
        rule.custom((value, context) => {
          const status = (context.parent as { status?: string } | undefined)
            ?.status;
          return !["approved", "rejected"].includes(status || "") || value
            ? true
            : "Record the review date for an approved or rejected item.";
        }),
    }),
    defineField({
      name: "reviewNotes",
      title: "Internal Review Notes",
      type: "text",
      rows: 3,
      description: "Internal only. Never include this field in public queries.",
      validation: (rule) => rule.max(3000),
    }),
  ],
});

export const seoMetadata = defineType({
  name: "seoMetadata",
  title: "Search Metadata",
  type: "object",
  fields: [
    defineField({
      name: "title",
      title: "Search Title",
      type: "string",
      validation: (rule) => rule.max(70),
    }),
    defineField({
      name: "description",
      title: "Search Description",
      type: "text",
      rows: 3,
      validation: (rule) => rule.max(180),
    }),
    defineField({
      name: "image",
      title: "Social Image",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "noIndex",
      title: "Exclude from Search Engines",
      type: "boolean",
      initialValue: false,
    }),
  ],
});

export const editorialImage = defineType({
  name: "editorialImage",
  title: "Editorial Image",
  type: "image",
  options: { hotspot: true },
  fields: [
    defineField({
      name: "alt",
      title: "Alternative Text",
      type: "string",
      validation: (rule) => rule.required().max(300),
    }),
    defineField({
      name: "caption",
      title: "Caption",
      type: "string",
      validation: (rule) => rule.max(500),
    }),
    defineField({
      name: "rightsBasis",
      title: "Rights Basis",
      type: "string",
      options: {
        list: [
          { title: "Owned by Version Record", value: "owned" },
          { title: "Licensed for this use", value: "licensed" },
          { title: "Provider-approved embed/use", value: "providerApproved" },
        ],
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "rightsHolder",
      title: "Rights Holder",
      type: "string",
      validation: (rule) => rule.required().max(200),
    }),
    defineField({
      name: "rightsNote",
      title: "Internal Rights Note",
      type: "text",
      rows: 2,
      description: "Record the license, permission, or approval location.",
      validation: (rule) => rule.required().max(1000),
    }),
    defineField({
      name: "sourceCitation",
      title: "Source Citation",
      type: "citation",
    }),
  ],
});

export const blockContent = defineType({
  name: "blockContent",
  title: "Editorial Content",
  type: "array",
  of: [
    defineArrayMember({
      type: "block",
      styles: [
        { title: "Normal", value: "normal" },
        { title: "Heading 2", value: "h2" },
        { title: "Heading 3", value: "h3" },
        { title: "Blockquote", value: "blockquote" },
      ],
      lists: [
        { title: "Bulleted", value: "bullet" },
        { title: "Numbered", value: "number" },
      ],
      marks: {
        decorators: [
          { title: "Strong", value: "strong" },
          { title: "Emphasis", value: "em" },
          { title: "Code", value: "code" },
        ],
        annotations: [
          {
            name: "externalLink",
            title: "External Link",
            type: "object",
            fields: [
              defineField({
                name: "href",
                title: "URL",
                type: "url",
                validation: (rule) =>
                  rule.required().uri({ scheme: ["https", "mailto"] }),
              }),
            ],
          },
          { type: "citation" },
        ],
      },
    }),
    defineArrayMember({ type: "editorialImage" }),
  ],
});
