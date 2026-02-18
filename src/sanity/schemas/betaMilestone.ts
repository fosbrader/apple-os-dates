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
      validation: (rule) => rule.required(),
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
      name: "isRevision",
      title: "Is Revision?",
      type: "boolean",
      description: "True for entries like Beta 1 v2",
      initialValue: false,
    }),
  ],
  preview: {
    select: { title: "label", date: "date", note: "note" },
    prepare({ title, date, note }) {
      return {
        title: title || "Untitled",
        subtitle: [date, note].filter(Boolean).join(" — "),
      };
    },
  },
});
