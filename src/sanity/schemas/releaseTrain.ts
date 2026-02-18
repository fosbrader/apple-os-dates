import { defineField, defineType } from "sanity";

export const releaseTrain = defineType({
  name: "releaseTrain",
  title: "Release Train",
  type: "document",
  fields: [
    defineField({
      name: "platform",
      title: "Platform",
      type: "reference",
      to: [{ type: "platform" }],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "majorVersion",
      title: "Major Version",
      type: "number",
      description: "e.g., 18 for iOS 18.x",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "displayName",
      title: "Display Name",
      type: "string",
      description: 'e.g., "iOS 18"',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "linkedTrains",
      title: "Linked Release Trains",
      type: "array",
      of: [{ type: "reference", to: [{ type: "releaseTrain" }] }],
      description: "Related trains (e.g., iOS 18 ↔ iPadOS 18)",
    }),
    defineField({
      name: "releaseYear",
      title: "Release Year",
      type: "number",
      description: "Year of initial public release",
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: {
      title: "displayName",
      platformName: "platform.name",
      year: "releaseYear",
    },
    prepare({ title, platformName, year }) {
      return {
        title: title || "Untitled",
        subtitle: `${platformName || "?"} · ${year || "?"}`,
      };
    },
  },
  orderings: [
    {
      title: "Version (Descending)",
      name: "versionDesc",
      by: [{ field: "majorVersion", direction: "desc" }],
    },
  ],
});
