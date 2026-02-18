import { defineField, defineType } from "sanity";

export const releaseVersion = defineType({
  name: "releaseVersion",
  title: "Release Version",
  type: "document",
  fields: [
    defineField({
      name: "releaseTrain",
      title: "Release Train",
      type: "reference",
      to: [{ type: "releaseTrain" }],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "version",
      title: "Version",
      type: "string",
      description: 'e.g., "18.4", "26.0"',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "releaseNotesUrl",
      title: "Release Notes URL",
      type: "url",
    }),
    defineField({
      name: "keyFeatures",
      title: "Key Features",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            defineField({
              name: "title",
              title: "Title",
              type: "string",
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "description",
              title: "Description",
              type: "text",
            }),
            defineField({
              name: "category",
              title: "Category",
              type: "string",
              options: {
                list: [
                  { title: "AI/ML", value: "ai" },
                  { title: "UI/UX", value: "ui" },
                  { title: "Performance", value: "performance" },
                  { title: "Privacy", value: "privacy" },
                  { title: "Accessibility", value: "accessibility" },
                  { title: "Developer", value: "developer" },
                  { title: "Other", value: "other" },
                ],
              },
            }),
          ],
          preview: {
            select: { title: "title", subtitle: "category" },
          },
        },
      ],
    }),
    defineField({
      name: "publicReleaseDate",
      title: "Public Release Date",
      type: "date",
      description:
        "Date of the public/GM release. Leave empty if still in beta.",
    }),
    defineField({
      name: "versionNote",
      title: "Version Note",
      type: "string",
      description:
        'Optional note about this version (e.g., "Apple Intelligence Release")',
    }),
    defineField({
      name: "milestones",
      title: "Milestones",
      type: "array",
      of: [{ type: "betaMilestone" }],
      description: "All beta milestones in chronological order",
    }),
  ],
  preview: {
    select: {
      version: "version",
      trainName: "releaseTrain.displayName",
      publicDate: "publicReleaseDate",
    },
    prepare({ version, trainName, publicDate }) {
      const status = publicDate ? `Released ${publicDate}` : "In Beta";
      return {
        title: `${trainName || "?"} ${version || ""}`.trim(),
        subtitle: status,
      };
    },
  },
  orderings: [
    {
      title: "Version (Descending)",
      name: "versionDesc",
      by: [{ field: "version", direction: "desc" }],
    },
  ],
});
