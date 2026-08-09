import { defineArrayMember, defineField, defineType } from "sanity";
import {
  citationsRequiredWhenApproved,
  eventBuildMatchesParent,
  noSelfReference,
  uniqueEventAlias,
  uniqueEventIdentity,
  uniqueLegacySourceId,
  validateIndexable,
  validateProvenanceStatus,
  versionMatchesPlatform,
} from "./schemaValidation";

export const releaseEvent = defineType({
  name: "releaseEvent",
  title: "Release Event",
  type: "document",
  groups: [
    { name: "identity", title: "Identity", default: true },
    { name: "scope", title: "Scope & Relationships" },
    { name: "content", title: "Release Notes" },
    { name: "evidence", title: "Evidence" },
    { name: "review", title: "Review & Publishing" },
    { name: "legacy", title: "Legacy Migration" },
  ],
  initialValue: () => ({
    stableEventId: `event:${crypto.randomUUID()}`,
    firstObservedAt: new Date().toISOString(),
    availabilityState: "available",
    isRevision: false,
    closesReleaseCycle: false,
    provenanceStatus: "legacyImported",
    editorialReview: { status: "draft" },
    isIndexable: false,
  }),
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
      name: "stableEventId",
      title: "Stable Event Identity",
      type: "string",
      group: "identity",
      description:
        "Immutable application/migration identity. This is not the display label or route.",
      readOnly: ({ document }) => Boolean(document?.stableEventId),
      validation: (rule) =>
        rule
          .required()
          .min(12)
          .max(220)
          .regex(/^[A-Za-z0-9._:-]+$/, {
            name: "stable event identity",
          })
          .custom(uniqueEventIdentity),
    }),
    defineField({
      name: "label",
      title: "Display Label",
      type: "string",
      group: "identity",
      description: "e.g. Developer Beta 4, Public Beta 2, RC, or Public.",
      validation: (rule) => rule.required().min(2).max(100),
    }),
    defineField({
      name: "routeAlias",
      title: "Human Route Alias",
      type: "slug",
      group: "identity",
      description:
        "Version-scoped human alias, e.g. beta-4. It may redirect to a verified build later.",
      options: {
        source: "label",
        maxLength: 96,
        slugify: (input) =>
          input
            .trim()
            .toLowerCase()
            .replace(/^developer-/, "")
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-+|-+$/g, ""),
      },
      validation: (rule) =>
        rule.required().custom(uniqueEventAlias),
    }),
    defineField({
      name: "channel",
      title: "Channel",
      type: "string",
      group: "identity",
      options: {
        list: [
          { title: "Developer Beta", value: "developerBeta" },
          { title: "Public Beta", value: "publicBeta" },
          { title: "Release Candidate", value: "releaseCandidate" },
          { title: "Golden Master", value: "goldenMaster" },
          { title: "Public Release", value: "public" },
          { title: "Security Response", value: "securityResponse" },
          { title: "Recovery / Re-release", value: "recovery" },
          { title: "Other", value: "other" },
        ],
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "appearanceDate",
      title: "Appearance Date",
      type: "date",
      group: "identity",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "firstObservedAt",
      title: "First Observed At",
      type: "datetime",
      group: "identity",
      description:
        "When Version Record first observed this event. This timestamp is not the event appearance date. Leave it empty when the observation time is unknown.",
      options: {
        dateFormat: "YYYY-MM-DD",
        timeFormat: "HH:mm",
        timeStep: 1,
      },
      readOnly: ({ document }) => Boolean(document?.firstObservedAt),
    }),
    defineField({
      name: "versionLabelAtAppearance",
      title: "Version Label at Appearance",
      type: "string",
      group: "identity",
      description:
        "Record when Apple renamed a cycle; leave empty when it matches the parent version.",
      validation: (rule) =>
        rule.regex(/^\d+(?:\.\d+){0,2}[a-z]?$/i, {
          name: "Apple OS version",
        }),
    }),
    defineField({
      name: "sequence",
      title: "Sequence",
      type: "number",
      group: "identity",
      description: "Optional sequence within a channel, such as Beta 4.",
      validation: (rule) => rule.integer().positive(),
    }),
    defineField({
      name: "isRevision",
      title: "Is Revision",
      type: "boolean",
      group: "identity",
      validation: (rule) => rule.required(),
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
      name: "closesReleaseCycle",
      title: "Closes Release Cycle",
      type: "boolean",
      group: "identity",
      description:
        "Only a verified Public Release or qualifying Golden Master may close a version cycle.",
      validation: (rule) =>
        rule.required().custom((value, context) => {
          const channel = context.document?.channel;
          return !value || channel === "public" || channel === "goldenMaster"
            ? true
            : "Developer Beta, Public Beta, and RC events cannot close a release cycle.";
        }),
    }),
    defineField({
      name: "build",
      title: "Verified Build",
      type: "reference",
      group: "scope",
      to: [{ type: "releaseBuild" }],
      description:
        "Optional. Link only when source evidence establishes the actual build identity.",
      validation: (rule) => rule.custom(eventBuildMatchesParent),
    }),
    defineField({
      name: "applicability",
      title: "Applicability",
      type: "releaseApplicability",
      group: "scope",
    }),
    defineField({
      name: "replaces",
      title: "Replaces Event",
      type: "reference",
      group: "scope",
      to: [{ type: "releaseEvent" }],
      validation: (rule) => rule.custom(noSelfReference),
    }),
    defineField({
      name: "replacedBy",
      title: "Replaced By Event",
      type: "reference",
      group: "scope",
      to: [{ type: "releaseEvent" }],
      validation: (rule) => rule.custom(noSelfReference),
    }),
    defineField({
      name: "relatedEvents",
      title: "Related Events",
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
      name: "summary",
      title: "Event Summary",
      type: "text",
      rows: 3,
      group: "content",
      validation: (rule) => rule.max(1000),
    }),
    defineField({
      name: "changes",
      title: "Changes Observed at This Event",
      type: "array",
      group: "content",
      description:
        "Use while build identity is unresolved. Move occurrences to the build once evidence verifies it.",
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
            : "A change may appear only once on an event.";
        }),
    }),
    defineField({
      name: "articleBody",
      title: "Event Article",
      type: "blockContent",
      group: "content",
      description:
        "Optional sourced prose for an event whose build remains unresolved.",
    }),
    defineField({
      name: "citations",
      title: "Event Sources",
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
    defineField({
      name: "isIndexable",
      title: "Allow Search Engine Indexing",
      type: "boolean",
      group: "review",
      description:
        "Date-only, citation-pending, and temporary event pages must remain off.",
      validation: (rule) => rule.required().custom(validateIndexable),
    }),
    defineField({
      name: "seo",
      title: "Search Metadata",
      type: "seoMetadata",
      group: "review",
    }),
    defineField({
      name: "legacySourceId",
      title: "Legacy Source Identity",
      type: "string",
      group: "legacy",
      description:
        "Immutable releaseVersion document ID + milestone key from the chronology migration.",
      readOnly: ({ document }) => Boolean(document?.legacySourceId),
      validation: (rule) =>
        rule
          .max(300)
          .regex(/^[A-Za-z0-9._:-]+$/, {
            name: "legacy source identity",
          })
          .custom(uniqueLegacySourceId),
    }),
    defineField({
      name: "legacyNote",
      title: "Original Legacy Note",
      type: "text",
      rows: 3,
      group: "legacy",
      description:
        "Exact imported note retained for migration traceability.",
      readOnly: ({ document }) => Boolean(document?.legacySourceId),
      validation: (rule) => rule.max(5000),
    }),
    defineField({
      name: "internalNotes",
      title: "Internal Notes",
      type: "text",
      rows: 4,
      group: "legacy",
      description: "Internal only. Never include this field in public queries.",
      validation: (rule) => rule.max(5000),
    }),
  ],
  preview: {
    select: {
      label: "label",
      date: "appearanceDate",
      platform: "platform.name",
      version: "releaseVersion.version",
      buildNumber: "build.buildNumber",
      provenance: "provenanceStatus",
    },
    prepare({ label, date, platform, version, buildNumber, provenance }) {
      return {
        title: label || "Untitled event",
        subtitle: [
          date,
          [platform, version].filter(Boolean).join(" "),
          buildNumber,
          provenance,
        ]
          .filter(Boolean)
          .join(" · "),
      };
    },
  },
  orderings: [
    {
      title: "Appearance (Newest)",
      name: "appearanceDesc",
      by: [{ field: "appearanceDate", direction: "desc" }],
    },
  ],
});
