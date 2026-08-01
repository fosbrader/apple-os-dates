import { defineArrayMember, defineField, defineType } from "sanity";
import { uniqueSourceUrl } from "./schemaValidation";

export const source = defineType({
  name: "source",
  title: "Source",
  type: "document",
  groups: [
    { name: "identity", title: "Identity", default: true },
    { name: "provenance", title: "Provenance" },
    { name: "internal", title: "Internal" },
  ],
  initialValue: {
    status: "active",
    reuseBasis: "linkedFactsOnly",
  },
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      group: "identity",
      validation: (rule) => rule.required().max(300),
    }),
    defineField({
      name: "canonicalUrl",
      title: "Canonical URL",
      type: "url",
      group: "identity",
      description: "Use the publisher's canonical HTTPS URL.",
      validation: (rule) =>
        rule
          .required()
          .uri({ scheme: ["https"] })
          .custom(uniqueSourceUrl),
    }),
    defineField({
      name: "publisher",
      title: "Publisher",
      type: "string",
      group: "identity",
      validation: (rule) => rule.required().max(200),
    }),
    defineField({
      name: "author",
      title: "Author",
      type: "string",
      group: "identity",
      validation: (rule) => rule.max(200),
    }),
    defineField({
      name: "sourceClass",
      title: "Source Class",
      type: "string",
      group: "provenance",
      options: {
        list: [
          {
            title: "First-party documentation",
            value: "firstPartyDocumentation",
          },
          {
            title: "First-party announcement",
            value: "firstPartyAnnouncement",
          },
          { title: "Government/public record", value: "government" },
          { title: "Independent journalism", value: "journalism" },
          { title: "Developer documentation", value: "developerDocs" },
          { title: "Community report", value: "community" },
          { title: "Archive", value: "archive" },
          { title: "Other", value: "other" },
        ],
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "publishedAt",
      title: "Published At",
      type: "datetime",
      group: "provenance",
    }),
    defineField({
      name: "accessedAt",
      title: "Accessed On",
      type: "date",
      group: "provenance",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "archiveUrl",
      title: "Archive URL",
      type: "url",
      group: "provenance",
      description: "Optional durable snapshot or publisher archive URL.",
      validation: (rule) => rule.uri({ scheme: ["https"] }),
    }),
    defineField({
      name: "status",
      title: "Link Status",
      type: "string",
      group: "provenance",
      options: {
        list: [
          { title: "Active", value: "active" },
          { title: "Moved", value: "moved" },
          { title: "Unavailable", value: "unavailable" },
        ],
        layout: "radio",
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "reuseBasis",
      title: "Reuse Basis",
      type: "string",
      group: "provenance",
      description:
        "This records the editorial rights posture; attribution alone is not permission.",
      options: {
        list: [
          {
            title: "Facts summarized; source linked",
            value: "linkedFactsOnly",
          },
          { title: "Owned by Version Record", value: "owned" },
          { title: "Licensed", value: "licensed" },
          { title: "Permission granted", value: "permission" },
          { title: "Public domain", value: "publicDomain" },
        ],
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "topics",
      title: "Topics",
      type: "array",
      group: "provenance",
      of: [defineArrayMember({ type: "string" })],
      options: { layout: "tags" },
      validation: (rule) => rule.unique(),
    }),
    defineField({
      name: "rightsNote",
      title: "Internal Rights Note",
      type: "text",
      rows: 3,
      group: "internal",
      description:
        "Internal only. Record permission, license, or quotation-specific review.",
      validation: (rule) => rule.max(3000),
    }),
    defineField({
      name: "editorialNotes",
      title: "Internal Editorial Notes",
      type: "text",
      rows: 4,
      group: "internal",
      description: "Internal only. Do not project this field publicly.",
      validation: (rule) => rule.max(5000),
    }),
  ],
  preview: {
    select: {
      title: "title",
      publisher: "publisher",
      sourceClass: "sourceClass",
      status: "status",
    },
    prepare({ title, publisher, sourceClass, status }) {
      return {
        title: title || "Untitled source",
        subtitle: [publisher, sourceClass, status !== "active" ? status : null]
          .filter(Boolean)
          .join(" · "),
      };
    },
  },
  orderings: [
    {
      title: "Accessed (Newest)",
      name: "accessedDesc",
      by: [{ field: "accessedAt", direction: "desc" }],
    },
    {
      title: "Publisher",
      name: "publisherAsc",
      by: [{ field: "publisher", direction: "asc" }],
    },
  ],
});
