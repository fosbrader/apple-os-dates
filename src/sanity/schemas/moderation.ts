import { defineArrayMember, defineField, defineType } from "sanity";
import {
  uniqueCandidateUrl,
  uniqueFeedUrl,
} from "./schemaValidation";

export const submission = defineType({
  name: "submission",
  title: "Private Submission",
  type: "document",
  groups: [
    { name: "submission", title: "Submission", default: true },
    { name: "privacy", title: "Private Contact" },
    { name: "moderation", title: "Moderation" },
  ],
  initialValue: () => {
    const submittedAt = new Date();
    const retentionDate = new Date(submittedAt);
    retentionDate.setUTCDate(retentionDate.getUTCDate() + 180);

    return {
      status: "new",
      submittedAt: submittedAt.toISOString(),
      retentionDeleteAfter: retentionDate.toISOString().slice(0, 10),
    };
  },
  fields: [
    defineField({
      name: "kind",
      title: "Submission Kind",
      type: "string",
      group: "submission",
      options: {
        list: [
          { title: "Correction", value: "correction" },
          { title: "New release/event", value: "release" },
          { title: "Undocumented change", value: "undocumentedChange" },
          { title: "Source suggestion", value: "source" },
          { title: "Other", value: "other" },
        ],
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "submittedAt",
      title: "Submitted At",
      type: "datetime",
      group: "submission",
      readOnly: true,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "summary",
      title: "Summary",
      type: "string",
      group: "submission",
      validation: (rule) => rule.required().min(10).max(300),
    }),
    defineField({
      name: "details",
      title: "Details",
      type: "text",
      rows: 8,
      group: "submission",
      validation: (rule) => rule.required().min(20).max(10000),
    }),
    defineField({
      name: "evidenceUrls",
      title: "Public Evidence URLs",
      type: "array",
      group: "submission",
      of: [
        defineArrayMember({
          type: "url",
          validation: (rule) =>
            rule.required().uri({ scheme: ["https"] }),
        }),
      ],
      validation: (rule) => rule.max(20).unique(),
    }),
    defineField({
      name: "targetDocumentType",
      title: "Related Public Document Type",
      type: "string",
      group: "submission",
      options: {
        list: [
          { title: "Release version", value: "releaseVersion" },
          { title: "Release event", value: "releaseEvent" },
          { title: "Release build", value: "releaseBuild" },
          { title: "Release change", value: "releaseChange" },
          { title: "Site page", value: "sitePage" },
          { title: "Unknown / new record", value: "unknown" },
        ],
      },
    }),
    defineField({
      name: "targetDocumentId",
      title: "Related Public Document ID",
      type: "string",
      group: "submission",
      description:
        "Scalar ID because private-dataset documents cannot use ordinary references to the public dataset.",
      validation: (rule) => rule.max(300),
    }),
    defineField({
      name: "targetLabel",
      title: "Related Page Label",
      type: "string",
      group: "submission",
      validation: (rule) => rule.max(200),
    }),
    defineField({
      name: "targetUrl",
      title: "Related Public Page URL",
      type: "url",
      group: "submission",
      validation: (rule) => rule.uri({ scheme: ["https"] }),
    }),
    defineField({
      name: "submitterEmail",
      title: "Submitter Email",
      type: "string",
      group: "privacy",
      description:
        "Sensitive. Never include this field in public queries or exports.",
      validation: (rule) =>
        rule
          .email()
          .warning("Enter a valid email or leave this optional field empty."),
    }),
    defineField({
      name: "requestedPublicCredit",
      title: "Requested Public Credit",
      type: "string",
      group: "privacy",
      description:
        "Optional approved name/handle. Do not publish the email address.",
      validation: (rule) => rule.max(120),
    }),
    defineField({
      name: "consentToPublicCredit",
      title: "Consent to Public Credit",
      type: "boolean",
      group: "privacy",
      initialValue: false,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "attestations",
      title: "Submission Attestations",
      type: "object",
      group: "privacy",
      fields: [
        defineField({
          name: "publicEvidenceOnly",
          title: "Evidence is public or authorized",
          type: "boolean",
          validation: (rule) =>
            rule.custom((value) =>
              value === true
                ? true
                : "Submissions must use public or authorized evidence."
            ),
        }),
        defineField({
          name: "rightsToSubmit",
          title: "Submitter has the right to provide this material",
          type: "boolean",
          validation: (rule) =>
            rule.custom((value) =>
              value === true
                ? true
                : "The submitter must attest that they can provide this material."
            ),
        }),
        defineField({
          name: "noConfidentialInformation",
          title: "No confidential or NDA-covered information",
          type: "boolean",
          validation: (rule) =>
            rule.custom((value) =>
              value === true
                ? true
                : "Confidential or NDA-covered material is not accepted."
            ),
        }),
      ],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "status",
      title: "Moderation Status",
      type: "string",
      group: "moderation",
      options: {
        list: [
          { title: "New", value: "new" },
          { title: "In review", value: "inReview" },
          { title: "Accepted", value: "accepted" },
          { title: "Rejected", value: "rejected" },
          { title: "Spam", value: "spam" },
        ],
        layout: "radio",
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "moderationNotes",
      title: "Private Moderation Notes",
      type: "text",
      rows: 5,
      group: "moderation",
      description: "Sensitive. Never include this field in public queries.",
      validation: (rule) => rule.max(10000),
    }),
    defineField({
      name: "resolutionDocumentIds",
      title: "Published Resolution Document IDs",
      type: "array",
      group: "moderation",
      of: [defineArrayMember({ type: "string" })],
      description: "IDs in the public content dataset.",
      validation: (rule) => rule.unique(),
    }),
    defineField({
      name: "resolutionUrls",
      title: "Published Resolution URLs",
      type: "array",
      group: "moderation",
      of: [
        defineArrayMember({
          type: "url",
          validation: (rule) =>
            rule.required().uri({ scheme: ["https"] }),
        }),
      ],
      validation: (rule) => rule.unique(),
    }),
    defineField({
      name: "retentionDeleteAfter",
      title: "Delete / Anonymize After",
      type: "date",
      group: "moderation",
      description:
        "Raw submission and contact details should be deleted or anonymized after resolution, no later than this date.",
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: {
      title: "summary",
      kind: "kind",
      status: "status",
      submittedAt: "submittedAt",
    },
    prepare({ title, kind, status, submittedAt }) {
      const date = submittedAt
        ? new Date(submittedAt).toISOString().slice(0, 10)
        : "Undated";
      return {
        title: title || "Untitled submission",
        subtitle: [date, kind, status].filter(Boolean).join(" · "),
      };
    },
  },
  orderings: [
    {
      title: "Submitted (Newest)",
      name: "submittedDesc",
      by: [{ field: "submittedAt", direction: "desc" }],
    },
  ],
});

export const feedSource = defineType({
  name: "feedSource",
  title: "Private Feed Source",
  type: "document",
  initialValue: {
    enabled: false,
    feedKind: "rss",
  },
  fields: [
    defineField({
      name: "name",
      title: "Name",
      type: "string",
      validation: (rule) => rule.required().max(200),
    }),
    defineField({
      name: "publisher",
      title: "Publisher",
      type: "string",
      validation: (rule) => rule.required().max(200),
    }),
    defineField({
      name: "feedUrl",
      title: "Allowlisted Feed URL",
      type: "url",
      validation: (rule) =>
        rule
          .required()
          .uri({ scheme: ["https"] })
          .custom(uniqueFeedUrl),
    }),
    defineField({
      name: "feedKind",
      title: "Feed Kind",
      type: "string",
      options: {
        list: [
          { title: "RSS / Atom", value: "rss" },
          { title: "JSON API", value: "jsonApi" },
        ],
        layout: "radio",
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "enabled",
      title: "Enabled",
      type: "boolean",
      description:
        "The ingestion worker must still enforce a server-side host allowlist.",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "defaultSourceId",
      title: "Default Public Source ID",
      type: "string",
      description:
        "Document ID in the public dataset; stored as a scalar across the dataset boundary.",
      validation: (rule) => rule.max(300),
    }),
    defineField({
      name: "lastCheckedAt",
      title: "Last Checked At",
      type: "datetime",
      readOnly: true,
    }),
    defineField({
      name: "lastError",
      title: "Last Error",
      type: "text",
      rows: 3,
      readOnly: true,
      validation: (rule) => rule.max(3000),
    }),
    defineField({
      name: "internalNotes",
      title: "Internal Notes",
      type: "text",
      rows: 4,
      description: "Do not store credentials, tokens, or full publisher copy.",
      validation: (rule) => rule.max(5000),
    }),
  ],
  preview: {
    select: {
      title: "name",
      publisher: "publisher",
      enabled: "enabled",
    },
    prepare({ title, publisher, enabled }) {
      return {
        title: title || "Untitled feed",
        subtitle: [publisher, enabled ? "Enabled" : "Disabled"]
          .filter(Boolean)
          .join(" · "),
      };
    },
  },
});

export const ingestCandidate = defineType({
  name: "ingestCandidate",
  title: "Private Ingest Candidate",
  type: "document",
  initialValue: () => ({
    status: "new",
    discoveredAt: new Date().toISOString(),
    publicationBlocked: true,
  }),
  fields: [
    defineField({
      name: "feedSource",
      title: "Feed Source",
      type: "reference",
      to: [{ type: "feedSource" }],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "title",
      title: "Publisher Title",
      type: "string",
      validation: (rule) => rule.required().max(500),
    }),
    defineField({
      name: "canonicalUrl",
      title: "Canonical URL",
      type: "url",
      validation: (rule) =>
        rule
          .required()
          .uri({ scheme: ["https"] })
          .custom(uniqueCandidateUrl),
    }),
    defineField({
      name: "contentHash",
      title: "Content Hash",
      type: "string",
      description: "Worker-provided deduplication hash; do not store full copy.",
      readOnly: true,
      validation: (rule) => rule.required().min(16).max(200),
    }),
    defineField({
      name: "publisher",
      title: "Publisher",
      type: "string",
      validation: (rule) => rule.required().max(200),
    }),
    defineField({
      name: "publishedAt",
      title: "Publisher Date",
      type: "datetime",
    }),
    defineField({
      name: "discoveredAt",
      title: "Discovered At",
      type: "datetime",
      readOnly: true,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "status",
      title: "Candidate Status",
      type: "string",
      options: {
        list: [
          { title: "New", value: "new" },
          { title: "In review", value: "inReview" },
          { title: "Accepted as source", value: "accepted" },
          { title: "Duplicate", value: "duplicate" },
          { title: "Rejected", value: "rejected" },
        ],
        layout: "radio",
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "acceptedSourceId",
      title: "Accepted Public Source ID",
      type: "string",
      description:
        "Document ID in the public dataset; stored as a scalar across the dataset boundary.",
      validation: (rule) =>
        rule.max(300).custom((value, context) =>
          context.document?.status !== "accepted" || value
            ? true
            : "Accepted candidates must identify their reviewed public source record."
        ),
    }),
    defineField({
      name: "acceptedSourceUrl",
      title: "Accepted Public Source URL",
      type: "url",
      validation: (rule) => rule.uri({ scheme: ["https"] }),
    }),
    defineField({
      name: "duplicateOf",
      title: "Duplicate Of",
      type: "reference",
      to: [{ type: "ingestCandidate" }],
      validation: (rule) =>
        rule.custom((value, context) => {
          const status = context.document?.status;
          const targetId = (value as { _ref?: string } | undefined)?._ref;
          const documentId = context.document?._id?.replace(/^drafts\./, "");
          if (status === "duplicate" && !targetId) {
            return "Duplicate candidates must link to the original candidate.";
          }
          return !targetId ||
            targetId.replace(/^drafts\./, "") !== documentId
            ? true
            : "A candidate cannot duplicate itself.";
        }),
    }),
    defineField({
      name: "publicationBlocked",
      title: "Automatic Publication Blocked",
      type: "boolean",
      readOnly: true,
      description:
        "Always true. Candidates must be independently reviewed and rewritten.",
      validation: (rule) =>
        rule.custom((value) =>
          value === true
            ? true
            : "Ingest candidates can never be automatically publishable."
        ),
    }),
    defineField({
      name: "editorNotes",
      title: "Private Editorial Notes",
      type: "text",
      rows: 5,
      description:
        "Do not paste the publisher's full article or release notes here.",
      validation: (rule) => rule.max(5000),
    }),
  ],
  preview: {
    select: {
      title: "title",
      publisher: "publisher",
      status: "status",
      discoveredAt: "discoveredAt",
    },
    prepare({ title, publisher, status, discoveredAt }) {
      const date = discoveredAt
        ? new Date(discoveredAt).toISOString().slice(0, 10)
        : "Undated";
      return {
        title: title || "Untitled candidate",
        subtitle: [date, publisher, status].filter(Boolean).join(" · "),
      };
    },
  },
  orderings: [
    {
      title: "Discovered (Newest)",
      name: "discoveredDesc",
      by: [{ field: "discoveredAt", direction: "desc" }],
    },
  ],
});
