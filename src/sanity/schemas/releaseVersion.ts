import { defineField, defineType } from "sanity";
import { uniqueReleaseVersion } from "../validation";

interface MilestoneValue {
  label?: string;
  date?: string;
}

type ReleaseStatusValue = "active" | "released" | "superseded";

export const releaseVersion = defineType({
  name: "releaseVersion",
  title: "Release Version",
  type: "document",
  initialValue: {
    milestones: [],
    releaseStatus: "active",
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
      name: "releaseStatus",
      title: "Release Status",
      type: "string",
      description:
        "Lifecycle state. Superseded cycles ended without a public release.",
      options: {
        list: [
          { title: "Active", value: "active" },
          { title: "Released", value: "released" },
          { title: "Superseded", value: "superseded" },
        ],
        layout: "radio",
      },
      validation: (rule) =>
        rule.custom((value, context) => {
          const publicReleaseDate = context.document?.publicReleaseDate as
            | string
            | undefined;

          // Existing documents infer their state until explicitly migrated.
          if (!value) return true;
          if (!["active", "released", "superseded"].includes(value)) {
            return "Choose Active, Released, or Superseded.";
          }
          if (value === "released" && !publicReleaseDate) {
            return "Released versions require a public release date.";
          }
          if (value !== "released" && publicReleaseDate) {
            return `${value === "active" ? "Active" : "Superseded"} versions cannot have a public release date.`;
          }

          return true;
        }),
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
          const explicitStatus = context.document
            ?.releaseStatus as ReleaseStatusValue | undefined;
          const releaseStatus =
            explicitStatus || (value ? "released" : "active");
          const publicMilestone = milestones.find(
            (milestone) => milestone.label?.trim().toLowerCase() === "public"
          );
          const gmMilestone = milestones.find(
            (milestone) => milestone.label?.trim().toLowerCase() === "gm"
          );
          const releaseMilestone = publicMilestone || gmMilestone;

          if (releaseStatus === "superseded") {
            if (value) {
              return "Superseded versions cannot have a public release date.";
            }
            if (releaseMilestone?.date) {
              return `Remove the ${releaseMilestone.label} milestone from this superseded cycle.`;
            }
            return true;
          }
          if (releaseStatus === "active") {
            if (value) {
              return "Active versions cannot have a public release date.";
            }
            if (releaseMilestone?.date) {
              return `Remove the ${releaseMilestone.label} milestone or mark this version Released.`;
            }
            return true;
          }
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
      releaseStatus: "releaseStatus",
      publicDate: "publicReleaseDate",
    },
    prepare({ version, trainName, releaseStatus, publicDate }) {
      const effectiveStatus =
        releaseStatus || (publicDate ? "released" : "active");
      const status =
        effectiveStatus === "superseded"
          ? "Superseded"
          : effectiveStatus === "released"
            ? `Released ${publicDate}`
            : "In Beta";
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
