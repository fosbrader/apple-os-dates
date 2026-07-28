import { defineField, defineType } from "sanity";
import { uniqueReleaseVersion } from "../validation";

interface MilestoneValue {
  label?: string;
  date?: string;
}

export const releaseVersion = defineType({
  name: "releaseVersion",
  title: "Release Version",
  type: "document",
  initialValue: {
    milestones: [],
  },
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
      validation: (rule) =>
        rule
          .required()
          .regex(/^\d+(?:\.\d+){0,2}[a-z]?$/i, {
            name: "Apple OS version",
          })
          .custom(uniqueReleaseVersion),
    }),
    defineField({
      name: "releaseNotesUrl",
      title: "Release Notes URL",
      type: "url",
      validation: (rule) =>
        rule.uri({ scheme: ["https"] }).warning("Use an HTTPS URL."),
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
        "Date of the Public milestone (or GM when there is no Public milestone). Leave empty if still in beta.",
      validation: (rule) =>
        rule.custom((value, context) => {
          const milestones =
            (context.document?.milestones as MilestoneValue[] | undefined) ||
            [];
          const publicMilestone = milestones.find(
            (milestone) => milestone.label?.trim().toLowerCase() === "public"
          );
          const gmMilestone = milestones.find(
            (milestone) => milestone.label?.trim().toLowerCase() === "gm"
          );
          const releaseMilestone = publicMilestone || gmMilestone;

          if (!value && releaseMilestone?.date) {
            return `Enter ${releaseMilestone.date} here so this release is no longer shown as Active.`;
          }
          if (value && !releaseMilestone?.date) {
            return 'Add a "Public" milestone (or "GM" when no Public milestone exists) with the same date.';
          }
          if (value && releaseMilestone?.date !== value) {
            return `This date must match the ${releaseMilestone?.label} milestone (${releaseMilestone?.date}).`;
          }

          return true;
        }),
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
      description:
        "All beta, RC, and public milestones, ordered oldest to newest.",
      validation: (rule) =>
        rule
          .required()
          .min(1)
          .custom((value?: MilestoneValue[]) => {
            if (!value || value.length < 2) return true;

            for (let index = 1; index < value.length; index += 1) {
              const previous = value[index - 1];
              const current = value[index];
              if (
                previous.date &&
                current.date &&
                current.date < previous.date
              ) {
                return `${current.label || `Milestone ${index + 1}`} is dated before ${previous.label || `milestone ${index}`}. Keep milestones oldest to newest.`;
              }
            }

            return true;
          }),
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
