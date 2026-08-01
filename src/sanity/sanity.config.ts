"use client";

import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { schemaTypes } from "./schemas";
import { dataset, projectId } from "./env";

const privateDocumentTypes = new Set([
  "submission",
  "feedSource",
  "ingestCandidate",
]);
const inactiveDocumentTypes = new Set([
  ...privateDocumentTypes,
  "sitePage",
  "siteSettings",
]);

export default defineConfig({
  name: "version-record",
  title: "Version Record",
  basePath: "/studio",
  projectId,
  dataset,
  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title("Version Record")
          .items([
            S.listItem()
              .title("Release Versions")
              .child(
                S.list()
                  .title("Release Versions")
                  .items([
                    S.listItem()
                      .title("Active Betas")
                      .child(
                        S.documentList()
                          .title("Active Betas")
                          .schemaType("releaseVersion")
                          .filter(
                            '_type == "releaseVersion" && (releaseStatus == "active" || (!defined(releaseStatus) && !defined(publicReleaseDate)))'
                          )
                          .defaultOrdering([
                            { field: "version", direction: "desc" },
                          ])
                      ),
                    S.listItem()
                      .title("Recently Released")
                      .child(
                        S.documentList()
                          .title("Recently Released")
                          .schemaType("releaseVersion")
                          .filter(
                            '_type == "releaseVersion" && defined(publicReleaseDate) && (releaseStatus == "released" || !defined(releaseStatus))'
                          )
                          .defaultOrdering([
                            {
                              field: "publicReleaseDate",
                              direction: "desc",
                            },
                          ])
                      ),
                    S.listItem()
                      .title("Superseded")
                      .child(
                        S.documentList()
                          .title("Superseded")
                          .schemaType("releaseVersion")
                          .filter(
                            '_type == "releaseVersion" && releaseStatus == "superseded"'
                          )
                          .defaultOrdering([
                            { field: "version", direction: "desc" },
                          ])
                      ),
                    S.listItem()
                      .title("All Versions")
                      .child(
                        S.documentTypeList("releaseVersion").title(
                          "All Versions"
                        )
                      ),
                  ])
              ),
            S.listItem()
              .title("Release Events")
              .child(
                S.list()
                  .title("Release Events")
                  .items([
                    S.listItem()
                      .title("Ready for Review")
                      .child(
                        S.documentList()
                          .title("Events Ready for Review")
                          .schemaType("releaseEvent")
                          .filter(
                            '_type == "releaseEvent" && editorialReview.status == "readyForReview"'
                          )
                          .defaultOrdering([
                            { field: "appearanceDate", direction: "desc" },
                          ])
                      ),
                    S.listItem()
                      .title("Citation Pending")
                      .child(
                        S.documentList()
                          .title("Citation-Pending Events")
                          .schemaType("releaseEvent")
                          .filter(
                            '_type == "releaseEvent" && !defined(citations[0])'
                          )
                          .defaultOrdering([
                            { field: "appearanceDate", direction: "desc" },
                          ])
                      ),
                    S.listItem()
                      .title("All Events")
                      .child(
                        S.documentTypeList("releaseEvent").title("All Events")
                      ),
                  ])
              ),
            S.listItem()
              .title("Release Builds")
              .child(
                S.list()
                  .title("Release Builds")
                  .items([
                    S.listItem()
                      .title("Ready for Review")
                      .child(
                        S.documentList()
                          .title("Builds Ready for Review")
                          .schemaType("releaseBuild")
                          .filter(
                            '_type == "releaseBuild" && editorialReview.status == "readyForReview"'
                          )
                      ),
                    S.listItem()
                      .title("Indexable")
                      .child(
                        S.documentList()
                          .title("Indexable Builds")
                          .schemaType("releaseBuild")
                          .filter(
                            '_type == "releaseBuild" && isIndexable == true'
                          )
                      ),
                    S.listItem()
                      .title("All Builds")
                      .child(
                        S.documentTypeList("releaseBuild").title("All Builds")
                      ),
                  ])
              ),
            S.documentTypeListItem("releaseChange").title("Change Library"),
            S.divider(),
            S.listItem()
              .title("Sources & Provenance")
              .child(
                S.list()
                  .title("Sources & Provenance")
                  .items([
                    S.documentTypeListItem("source").title("Sources"),
                    S.documentTypeListItem("auditBatch").title(
                      "Audit Batches"
                    ),
                    S.documentTypeListItem("correction").title("Corrections"),
                  ])
              ),
            S.documentTypeListItem("releaseTrain").title("Release Trains"),
            S.documentTypeListItem("platform").title("Platforms"),
          ]),
    }),
    visionTool(),
  ],
  schema: {
    types: schemaTypes,
  },
  document: {
    newDocumentOptions: (previous) =>
      previous.filter(
        (template) =>
          !inactiveDocumentTypes.has(template.templateId)
      ),
    actions: (previous, context) =>
      inactiveDocumentTypes.has(context.schemaType) ? [] : previous,
  },
});
