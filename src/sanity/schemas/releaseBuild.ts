import { defineArrayMember, defineField, defineType } from "sanity";
import {
  citationsRequiredWhenApproved,
  noSelfReference,
  uniqueBuildNumber,
  validateIndexable,
  validateProvenanceStatus,
  versionMatchesPlatform,
} from "./schemaValidation";

export const releaseBuild = defineType({
  name: "releaseBuild",
  title: "Release Build",
  type: "document",
  groups: [
    { name: "identity", title: "Identity", default: true },
    { name: "content", title: "Release Notes" },
    { name: "evidence", title: "Evidence" },
    { name: "review", title: "Review & Publishing" },
    { name: "internal", title: "Internal" },
  ],
  initialValue: {
    availabilityState: "available",
    provenanceStatus: "sourceLinked",
    editorialReview: { status: "draft" },
    isIndexable: false,
  },
  fields: [
    defineField({
      name: "releaseVersion",
      title: "Release Version",
      type: "reference",
      group: "identity",
      to: [{ type: "releaseVersion" }],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "platform",
      title: "Platform",
      type: "reference",
      group: "identity",
      to: [{ type: "platform" }],
      validation: (rule) =>
        rule.required().custom(versionMatchesPlatform),
    }),
    defineField({
      name: "buildNumber",
      title: "Build Number",
      type: "string",
      group: "identity",
      description:
        "Verified Apple build number with its original display capitalization, e.g. 23D123.",
      validation: (rule) =>
        rule
          .required()
          .regex(/^\d+[A-Za-z]\d+[A-Za-z]?$/, {
            name: "Apple build number",
          })
          .custom(uniqueBuildNumber),
    }),
    defineField({
      name: "slug",
      title: "Canonical Build Slug",
      type: "slug",
      group: "identity",
      description:
        "Lowercase route segment generated from the verified build number.",
      options: {
        source: "buildNumber",
        maxLength: 96,
        slugify: (input) =>
          input
            .trim()
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-+|-+$/g, ""),
      },
      validation: (rule) =>
        rule.required().custom((value, context) => {
          const buildNumber = context.document?.buildNumber as
            | string
            | undefined;
          const expected = buildNumber
            ?.trim()
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-+|-+$/g, "");
          return !value?.current || !expected || value.current === expected
            ? true
            : `Use the canonical lowercase build slug "${expected}".`;
        }),
    }),
    defineField({
      name: "availabilityState",
      title: "Availability State",
      type: "string",
      group: "identity",
      options: {
        list: [
          { title: "Available", value: "available" },
          { title: "Withdrawn", value: "withdrawn" },
          { title: "Replaced", value: "replaced" },
          { title: "Superseded", value: "superseded" },
        ],
        layout: "radio",
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "applicability",
      title: "Applicability",
      type: "releaseApplicability",
      group: "identity",
    }),
    defineField({
      name: "revisionOf",
      title: "Revision Of",
      type: "reference",
      group: "identity",
      to: [{ type: "releaseBuild" }],
      validation: (rule) => rule.custom(noSelfReference),
    }),
    defineField({
      name: "replaces",
      title: "Replaces",
      type: "reference",
      group: "identity",
      to: [{ type: "releaseBuild" }],
      validation: (rule) => rule.custom(noSelfReference),
    }),
    defineField({
      name: "replacedBy",
      title: "Replaced By",
      type: "reference",
      group: "identity",
      to: [{ type: "releaseBuild" }],
      validation: (rule) => rule.custom(noSelfReference),
    }),
    defineField({
      name: "relatedBuilds",
      title: "Related Builds",
      type: "array",
      group: "identity",
      of: [
        defineArrayMember({
          type: "reference",
          to: [{ type: "releaseBuild" }],
        }),
      ],
      validation: (rule) => rule.unique(),
    }),
    defineField({
      name: "summary",
      title: "Release Summary",
      type: "text",
      rows: 3,
      group: "content",
      validation: (rule) => rule.max(1000),
    }),
    defineField({
      name: "changes",
      title: "Changes in This Build",
      type: "array",
      group: "content",
      of: [defineArrayMember({ type: "changeOccurrence" })],
      validation: (rule) =>
        rule.custom((value) => {
          const changeIds = (
            (value || []) as { change?: { _ref?: string } }[]
          )
            .map((occurrence) => occurrence.change?._ref)
            .filter(Boolean);
          return new Set(changeIds).size === changeIds.length
            ? true
            : "A change may appear only once on a build.";
        }),
    }),
    defineField({
      name: "articleBody",
      title: "Release Article",
      type: "blockContent",
      group: "content",
      description:
        "Optional sourced prose. Keep inherited or cumulative material clearly labeled.",
    }),
    defineField({
      name: "citations",
      title: "Page Sources",
      type: "array",
      group: "evidence",
      of: [defineArrayMember({ type: "citation" })],
      description:
        "Deduplicated bibliography for page-level facts and article sections.",
      validation: (rule) =>
        rule
          .required()
          .min(1)
          .custom(citationsRequiredWhenApproved),
    }),
    defineField({
      name: "provenanceStatus",
      title: "Provenance Status",
      type: "string",
      group: "evidence",
      options: {
        list: [
          { title: "Legacy imported", value: "legacyImported" },
          { title: "Audit verified", value: "auditVerified" },
          { title: "Source linked", value: "sourceLinked" },
          { title: "Editorially verified", value: "editoriallyVerified" },
        ],
        layout: "radio",
      },
      validation: (rule) =>
        rule.required().custom(validateProvenanceStatus),
    }),
    defineField({
      name: "auditBatches",
      title: "Audit Batches",
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
      name: "isIndexable",
      title: "Allow Search Engine Indexing",
      type: "boolean",
      group: "review",
      description:
        "Requires approved, source-linked substantive content. The application enforces the same gate in metadata and the sitemap.",
      validation: (rule) => rule.required().custom(validateIndexable),
    }),
    defineField({
      name: "seo",
      title: "Search Metadata",
      type: "seoMetadata",
      group: "review",
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
      buildNumber: "buildNumber",
      platform: "platform.name",
      version: "releaseVersion.version",
      state: "availabilityState",
      review: "editorialReview.status",
    },
    prepare({ buildNumber, platform, version, state, review }) {
      return {
        title: buildNumber || "Unknown build",
        subtitle: [
          [platform, version].filter(Boolean).join(" "),
          state,
          review,
        ]
          .filter(Boolean)
          .join(" · "),
      };
    },
  },
  orderings: [
    {
      title: "Build Number",
      name: "buildNumberDesc",
      by: [{ field: "buildNumber", direction: "desc" }],
    },
  ],
});
