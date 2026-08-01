import { defineArrayMember, defineField, defineType } from "sanity";

export const auditBatch = defineType({
  name: "auditBatch",
  title: "Audit Batch",
  type: "document",
  groups: [
    { name: "summary", title: "Summary", default: true },
    { name: "scope", title: "Scope" },
    { name: "evidence", title: "Evidence" },
    { name: "review", title: "Review" },
  ],
  initialValue: {
    status: "complete",
    editorialReview: { status: "draft" },
  },
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      group: "summary",
      validation: (rule) => rule.required().max(200),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      group: "summary",
      options: { source: "title", maxLength: 96 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "status",
      title: "Status",
      type: "string",
      group: "summary",
      options: {
        list: [
          { title: "Complete", value: "complete" },
          { title: "Partial", value: "partial" },
          { title: "Superseded", value: "superseded" },
        ],
        layout: "radio",
      },
      validation: (rule) =>
        rule.required().custom((value, context) => {
          const review = context.document?.editorialReview as
            | { status?: string }
            | undefined;
          return value !== "complete" || review?.status === "approved"
            ? true
            : "A complete audit batch must be editorially approved.";
        }),
    }),
    defineField({
      name: "verifiedAt",
      title: "Verified At",
      type: "datetime",
      group: "summary",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "summary",
      title: "Public Summary",
      type: "text",
      rows: 4,
      group: "summary",
      validation: (rule) => rule.required().max(2000),
    }),
    defineField({
      name: "platforms",
      title: "Platforms",
      type: "array",
      group: "scope",
      of: [
        defineArrayMember({
          type: "reference",
          to: [{ type: "platform" }],
        }),
      ],
      validation: (rule) => rule.required().min(1).unique(),
    }),
    defineField({
      name: "releaseTrains",
      title: "Release Trains",
      type: "array",
      group: "scope",
      of: [
        defineArrayMember({
          type: "reference",
          to: [{ type: "releaseTrain" }],
        }),
      ],
      validation: (rule) => rule.unique(),
    }),
    defineField({
      name: "coveredVersions",
      title: "Covered Versions",
      type: "array",
      group: "scope",
      of: [
        defineArrayMember({
          type: "reference",
          to: [{ type: "releaseVersion" }],
        }),
      ],
      validation: (rule) => rule.unique(),
    }),
    defineField({
      name: "coveredEvents",
      title: "Covered Events",
      type: "array",
      group: "scope",
      of: [
        defineArrayMember({
          type: "reference",
          to: [{ type: "releaseEvent" }],
        }),
      ],
      validation: (rule) => rule.unique(),
    }),
    defineField({
      name: "coverageNote",
      title: "Coverage Note",
      type: "text",
      rows: 4,
      group: "scope",
      description:
        "State exclusions and distinguish comprehensive audits from current-cycle updates.",
      validation: (rule) => rule.required().max(3000),
    }),
    defineField({
      name: "recordCounts",
      title: "Baseline Record Counts",
      type: "object",
      group: "scope",
      fields: [
        defineField({
          name: "versions",
          title: "Versions",
          type: "number",
          validation: (rule) => rule.integer().min(0),
        }),
        defineField({
          name: "events",
          title: "Events / Legacy Milestones",
          type: "number",
          validation: (rule) => rule.integer().min(0),
        }),
        defineField({
          name: "releaseTrains",
          title: "Release Trains",
          type: "number",
          validation: (rule) => rule.integer().min(0),
        }),
        defineField({
          name: "supersededCycles",
          title: "Superseded Cycles",
          type: "number",
          validation: (rule) => rule.integer().min(0),
        }),
      ],
    }),
    defineField({
      name: "methodology",
      title: "Methodology",
      type: "blockContent",
      group: "evidence",
      validation: (rule) => rule.required().min(1),
    }),
    defineField({
      name: "citations",
      title: "Methodology Sources",
      type: "array",
      group: "evidence",
      of: [defineArrayMember({ type: "citation" })],
      validation: (rule) => rule.required().min(1),
    }),
    defineField({
      name: "commitSha",
      title: "Audit Commit SHA",
      type: "string",
      group: "evidence",
      validation: (rule) =>
        rule
          .required()
          .regex(/^[0-9a-f]{7,40}$/i, { name: "Git commit SHA" }),
    }),
    defineField({
      name: "snapshotDigest",
      title: "Snapshot Digest",
      type: "string",
      group: "evidence",
      description: "Content digest of the audited production snapshot.",
      validation: (rule) => rule.required().min(16).max(200),
    }),
    defineField({
      name: "reportUrl",
      title: "Public Report URL",
      type: "url",
      group: "evidence",
      validation: (rule) => rule.uri({ scheme: ["https"] }),
    }),
    defineField({
      name: "reportPath",
      title: "Repository Report Path",
      type: "string",
      group: "evidence",
      description: "Internal repository-relative path to the frozen audit report.",
      validation: (rule) => rule.max(500),
    }),
    defineField({
      name: "supersededBy",
      title: "Superseded By",
      type: "reference",
      group: "evidence",
      to: [{ type: "auditBatch" }],
      hidden: ({ document }) => document?.status !== "superseded",
    }),
    defineField({
      name: "editorialReview",
      title: "Editorial Review",
      type: "editorialReview",
      group: "review",
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: {
      title: "title",
      verifiedAt: "verifiedAt",
      status: "status",
    },
    prepare({ title, verifiedAt, status }) {
      const date = verifiedAt
        ? new Date(verifiedAt).toISOString().slice(0, 10)
        : "Undated";
      return {
        title: title || "Untitled audit",
        subtitle: `${date} · ${status || "unknown"}`,
      };
    },
  },
  orderings: [
    {
      title: "Verified (Newest)",
      name: "verifiedDesc",
      by: [{ field: "verifiedAt", direction: "desc" }],
    },
  ],
});
