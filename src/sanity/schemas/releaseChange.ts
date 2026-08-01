import { defineArrayMember, defineField, defineType } from "sanity";
import {
  citationsRequiredWhenApproved,
  validateProvenanceStatus,
} from "./schemaValidation";

interface CitationValue {
  source?: { _ref?: string };
}

interface ChangeOccurrenceValue {
  evidenceState?: string;
  citations?: CitationValue[];
  verificationMethod?: string;
}

export const changeOccurrence = defineType({
  name: "changeOccurrence",
  title: "Change Occurrence",
  type: "object",
  fields: [
    defineField({
      name: "change",
      title: "Change",
      type: "reference",
      to: [{ type: "releaseChange" }],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "action",
      title: "Action in This Release",
      type: "string",
      options: {
        list: [
          { title: "Introduced", value: "introduced" },
          { title: "Changed", value: "changed" },
          { title: "Fixed", value: "fixed" },
          { title: "Removed", value: "removed" },
          { title: "Regression", value: "regression" },
          { title: "Known issue", value: "knownIssue" },
        ],
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "inheritance",
      title: "Presentation Scope",
      type: "string",
      description:
        "Delta is new in this release. Inherited and cumulative items are displayed separately.",
      options: {
        list: [
          { title: "Release delta", value: "delta" },
          { title: "Inherited", value: "inherited" },
          { title: "Cumulative context", value: "cumulative" },
        ],
        layout: "radio",
      },
      initialValue: "delta",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "summary",
      title: "Original Summary",
      type: "text",
      rows: 4,
      description:
        "Describe the observed change in original language; do not copy a publisher's release note.",
      validation: (rule) => rule.required().min(20).max(3000),
    }),
    defineField({
      name: "documentedStatus",
      title: "Documentation Status",
      type: "string",
      options: {
        list: [
          { title: "Documented", value: "documented" },
          { title: "Partially documented", value: "partiallyDocumented" },
          { title: "Undocumented", value: "undocumented" },
          { title: "Unknown", value: "unknown" },
        ],
        layout: "radio",
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "evidenceState",
      title: "Evidence State",
      type: "string",
      options: {
        list: [
          { title: "Reported", value: "reported" },
          { title: "Corroborated", value: "corroborated" },
          { title: "Confirmed", value: "confirmed" },
        ],
        layout: "radio",
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "verificationMethod",
      title: "Editorial Verification Method",
      type: "text",
      rows: 3,
      description:
        "Required when Corroborated relies on one public source plus reproducible editorial verification.",
      validation: (rule) => rule.max(1500),
    }),
    defineField({
      name: "applicability",
      title: "Applicability",
      type: "releaseApplicability",
    }),
    defineField({
      name: "citations",
      title: "Claim Citations",
      type: "array",
      of: [defineArrayMember({ type: "citation" })],
      validation: (rule) =>
        rule.required().min(1).custom(citationsRequiredWhenApproved),
    }),
    defineField({
      name: "publicContributorCredit",
      title: "Public Contributor Credit",
      type: "string",
      description:
        "Use only the approved public name or handle copied from a private submission.",
      validation: (rule) => rule.max(120),
    }),
    defineField({
      name: "internalNotes",
      title: "Internal Notes",
      type: "text",
      rows: 3,
      description: "Internal only. Never include this field in public queries.",
      validation: (rule) => rule.max(3000),
    }),
  ],
  validation: (rule) =>
    rule.custom((value) => {
      const occurrence = value as ChangeOccurrenceValue | undefined;
      if (!occurrence) return true;

      const distinctSources = new Set(
        (occurrence.citations || [])
          .map((citationValue) => citationValue.source?._ref)
          .filter(Boolean)
      );

      if (!occurrence.citations?.length) {
        return "Every structured change occurrence requires a citation.";
      }
      if (
        occurrence.evidenceState === "corroborated" &&
        distinctSources.size < 2 &&
        !occurrence.verificationMethod?.trim()
      ) {
        return "Corroborated changes need two independent sources or a documented editorial verification method.";
      }

      return true;
    }),
  preview: {
    select: {
      title: "change.title",
      action: "action",
      evidence: "evidenceState",
      inheritance: "inheritance",
    },
    prepare({ title, action, evidence, inheritance }) {
      return {
        title: title || "Untitled change",
        subtitle: [action, inheritance, evidence].filter(Boolean).join(" · "),
      };
    },
  },
});

export const releaseChange = defineType({
  name: "releaseChange",
  title: "Release Change",
  type: "document",
  groups: [
    { name: "content", title: "Content", default: true },
    { name: "evidence", title: "Evidence" },
    { name: "review", title: "Review" },
  ],
  initialValue: {
    status: "active",
    provenanceStatus: "legacyImported",
    editorialReview: { status: "draft" },
  },
  fields: [
    defineField({
      name: "title",
      title: "Canonical Title",
      type: "string",
      group: "content",
      validation: (rule) => rule.required().min(3).max(180),
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
      name: "canonicalSummary",
      title: "Canonical Summary",
      type: "text",
      rows: 4,
      group: "content",
      description:
        "Vendor-neutral, original description of the conceptual change. Release-specific deltas belong on occurrences.",
      validation: (rule) => rule.required().min(20).max(2500),
    }),
    defineField({
      name: "category",
      title: "Category",
      type: "string",
      group: "content",
      options: {
        list: [
          { title: "Feature", value: "feature" },
          { title: "Enhancement", value: "enhancement" },
          { title: "Behavior change", value: "behavior" },
          { title: "Bug fix", value: "bugFix" },
          { title: "Regression", value: "regression" },
          { title: "Security", value: "security" },
          { title: "Developer / API", value: "developerApi" },
          { title: "Compatibility", value: "compatibility" },
          { title: "Removal", value: "removal" },
          { title: "Known issue", value: "knownIssue" },
          { title: "Other", value: "other" },
        ],
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "aliases",
      title: "Aliases",
      type: "array",
      group: "content",
      of: [defineArrayMember({ type: "string" })],
      options: { layout: "tags" },
      validation: (rule) => rule.unique(),
    }),
    defineField({
      name: "topics",
      title: "Topics",
      type: "array",
      group: "content",
      of: [defineArrayMember({ type: "string" })],
      options: { layout: "tags" },
      validation: (rule) => rule.unique(),
    }),
    defineField({
      name: "status",
      title: "Library Status",
      type: "string",
      group: "content",
      options: {
        list: [
          { title: "Active", value: "active" },
          { title: "Deprecated", value: "deprecated" },
          { title: "Merged", value: "merged" },
        ],
        layout: "radio",
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "mergedInto",
      title: "Merged Into",
      type: "reference",
      group: "content",
      to: [{ type: "releaseChange" }],
      hidden: ({ document }) => document?.status !== "merged",
      validation: (rule) =>
        rule.custom((value, context) => {
          const status = context.document?.status;
          const targetId = (value as { _ref?: string } | undefined)?._ref;
          const documentId = context.document?._id?.replace(/^drafts\./, "");
          if (status === "merged" && !targetId) {
            return "Merged changes must identify their canonical replacement.";
          }
          return !targetId ||
            targetId.replace(/^drafts\./, "") !== documentId
            ? true
            : "A change cannot be merged into itself.";
        }),
    }),
    defineField({
      name: "relatedChanges",
      title: "Related Changes",
      type: "array",
      group: "content",
      of: [
        defineArrayMember({
          type: "reference",
          to: [{ type: "releaseChange" }],
        }),
      ],
      validation: (rule) => rule.unique(),
    }),
    defineField({
      name: "citations",
      title: "Canonical Description Citations",
      type: "array",
      group: "evidence",
      of: [defineArrayMember({ type: "citation" })],
      validation: (rule) => rule.custom(citationsRequiredWhenApproved),
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
  ],
  preview: {
    select: {
      title: "title",
      category: "category",
      status: "status",
      reviewStatus: "editorialReview.status",
    },
    prepare({ title, category, status, reviewStatus }) {
      return {
        title: title || "Untitled change",
        subtitle: [category, status, reviewStatus].filter(Boolean).join(" · "),
      };
    },
  },
  orderings: [
    {
      title: "Title",
      name: "titleAsc",
      by: [{ field: "title", direction: "asc" }],
    },
  ],
});
