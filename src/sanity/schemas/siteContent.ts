import { defineArrayMember, defineField, defineType } from "sanity";

export const sitePage = defineType({
  name: "sitePage",
  title: "Site Page",
  type: "document",
  groups: [
    { name: "content", title: "Content", default: true },
    { name: "sources", title: "Sources" },
    { name: "publishing", title: "Publishing" },
  ],
  initialValue: {
    editorialReview: { status: "draft" },
  },
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      group: "content",
      validation: (rule) => rule.required().max(160),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      group: "content",
      options: { source: "title", maxLength: 96 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "pageKind",
      title: "Page Kind",
      type: "string",
      group: "content",
      options: {
        list: [
          { title: "About", value: "about" },
          { title: "Methodology", value: "methodology" },
          { title: "Editorial policy", value: "editorialPolicy" },
          { title: "Sourcing standard", value: "sourcingStandard" },
          { title: "Corrections policy", value: "correctionsPolicy" },
          { title: "Takedown contact", value: "takedown" },
          { title: "Privacy policy", value: "privacy" },
          { title: "Contributor terms", value: "contributorTerms" },
          { title: "Trademark notice", value: "trademark" },
          { title: "Export documentation", value: "exports" },
          { title: "Other", value: "other" },
        ],
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "summary",
      title: "Summary",
      type: "text",
      rows: 3,
      group: "content",
      validation: (rule) => rule.required().max(500),
    }),
    defineField({
      name: "body",
      title: "Body",
      type: "blockContent",
      group: "content",
      validation: (rule) => rule.required().min(1),
    }),
    defineField({
      name: "citations",
      title: "Page Sources",
      type: "array",
      group: "sources",
      of: [defineArrayMember({ type: "citation" })],
    }),
    defineField({
      name: "effectiveDate",
      title: "Effective Date",
      type: "date",
      group: "publishing",
      description: "Recommended for policies and contributor terms.",
    }),
    defineField({
      name: "editorialReview",
      title: "Editorial Review",
      type: "editorialReview",
      group: "publishing",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "seo",
      title: "Search Metadata",
      type: "seoMetadata",
      group: "publishing",
    }),
  ],
  preview: {
    select: {
      title: "title",
      kind: "pageKind",
      status: "editorialReview.status",
    },
    prepare({ title, kind, status }) {
      return {
        title: title || "Untitled page",
        subtitle: [kind, status].filter(Boolean).join(" · "),
      };
    },
  },
});

export const siteSettings = defineType({
  name: "siteSettings",
  title: "Site Settings",
  type: "document",
  fields: [
    defineField({
      name: "siteName",
      title: "Site Name",
      type: "string",
      validation: (rule) => rule.required().max(100),
    }),
    defineField({
      name: "tagline",
      title: "Tagline",
      type: "string",
      validation: (rule) => rule.required().max(180),
    }),
    defineField({
      name: "description",
      title: "Site Description",
      type: "text",
      rows: 3,
      validation: (rule) => rule.required().max(500),
    }),
    defineField({
      name: "canonicalUrl",
      title: "Canonical Site URL",
      type: "url",
      validation: (rule) =>
        rule.required().uri({ scheme: ["https"] }),
    }),
    defineField({
      name: "independenceDisclaimer",
      title: "Independence Disclaimer",
      type: "text",
      rows: 4,
      description:
        "State clearly that the archive is independent and not endorsed by tracked vendors.",
      validation: (rule) => rule.required().min(40).max(2000),
    }),
    defineField({
      name: "trademarkNotice",
      title: "Trademark Notice",
      type: "text",
      rows: 3,
      validation: (rule) => rule.required().max(1500),
    }),
    defineField({
      name: "footerContent",
      title: "Footer Content",
      type: "blockContent",
    }),
    defineField({
      name: "policyPages",
      title: "Policy Pages",
      type: "array",
      of: [
        defineArrayMember({
          type: "reference",
          to: [{ type: "sitePage" }],
        }),
      ],
      validation: (rule) => rule.unique(),
    }),
    defineField({
      name: "defaultSeo",
      title: "Default Search Metadata",
      type: "seoMetadata",
    }),
  ],
  preview: {
    select: {
      title: "siteName",
      subtitle: "canonicalUrl",
    },
  },
});
