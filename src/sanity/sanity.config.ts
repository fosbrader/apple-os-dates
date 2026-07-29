"use client";

import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { schemaTypes } from "./schemas";
import { dataset, projectId } from "./env";

export default defineConfig({
  name: "beta-cadence",
  title: "Beta Cadence",
  basePath: "/studio",
  projectId,
  dataset,
  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title("Beta Cadence")
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
            S.divider(),
            S.documentTypeListItem("releaseTrain").title("Release Trains"),
            S.documentTypeListItem("platform").title("Platforms"),
          ]),
    }),
    visionTool(),
  ],
  schema: {
    types: schemaTypes,
  },
});
