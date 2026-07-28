import { defineField, defineType } from "sanity";

export const betaMilestone = defineType({
  name: "betaMilestone",
  title: "Beta Milestone",
  type: "object",
  fields: [
    defineField({
      name: "label",
      title: "Label",
      type: "string",
      description:
        "e.g., Beta 1, Beta 2, RC, RC 2, Public, GM, Public Beta",
      validation: (rule) => rule.required().min(2).max(80),
    }),
    defineField({
      name: "date",
      title: "Date",
      type: "date",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "note",
      title: "Note",
      type: "string",
      description:
        'Optional note (e.g., "pulled", "Public Beta Release", "iPhone Only")',
    }),
    defineField({
      name: "sourceUrl",
      title: "Source URL",
      type: "url",
      description:
        "Optional first-party release note, developer announcement, or other source for this date.",
      validation: (rule) =>
        rule.uri({ scheme: ["https"] }).warning("Use an HTTPS source URL."),
    }),
    defineField({
      name: "sourceLabel",
      title: "Source Label",
      type: "string",
      description:
        'Optional short label such as "Apple Developer" or "Release notes".',
      validation: (rule) => rule.max(80),
    }),
    defineField({
      name: "isRevision",
      title: "Is Revision?",
      type: "boolean",
      description: "True for entries like Beta 1 v2",
      initialValue: false,
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: {
      title: "label",
      date: "date",
      note: "note",
      sourceLabel: "sourceLabel",
    },
    prepare({ title, date, note, sourceLabel }) {
      return {
        title: title || "Untitled",
        subtitle: [date, note, sourceLabel].filter(Boolean).join(" — "),
      };
    },
  },
});
