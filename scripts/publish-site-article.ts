/**
 * Publishes a reviewed site article with durable, non-PII authorship metadata.
 *
 * Dry run:
 *   npx sanity exec scripts/publish-site-article.ts --with-user-token -- \
 *     --id sitePage.launching-version-record
 *
 * Apply the exact reviewed plan:
 *   npx sanity exec scripts/publish-site-article.ts --with-user-token -- \
 *     --id sitePage.launching-version-record \
 *     --at <ISO_TIMESTAMP> \
 *     --deployment-url https://www.versionrecord.com \
 *     --apply --confirm-production --plan-sha <PLAN_SHA>
 *
 * First publication sets both publishedAt and updatedAt. Later publications
 * preserve publishedAt and advance updatedAt. The public byline is always the
 * Version Record organization, never an editor's account identity.
 */

import { createHash } from "node:crypto";
import { getCliClient } from "sanity/cli";
import {
  createArticlePublicationStamp,
  defaultArticleByline,
} from "../src/lib/article";
import { verifyArticleDeployment } from "../src/lib/article-deployment";
import { stableStringify } from "./lib/release-event-migration";

const apiVersion = "2024-01-01";
const expectedProjectId = "lh3yswzu";
const expectedDataset = "production";

interface SiteArticleDocument extends Record<string, unknown> {
  _id: string;
  _rev: string;
  _type: "sitePage";
  title: string;
  slug?: { current?: string };
  pageKind?: string;
  byline?: string;
  publishedAt?: string;
  updatedAt?: string;
  editorialReview?: {
    status?: string;
    reviewedAt?: string;
    reviewNotes?: string;
  };
}

interface ArticlePublishPlan {
  projectId: string;
  dataset: string;
  draftId: string;
  publishedId: string;
  sourceRevision: string;
  title: string;
  slug: string;
  firstPublication: boolean;
  byline: string;
  publishedAt: string;
  updatedAt: string;
  editorialStatus: "approved";
  reviewedAt: string;
}

interface PublishedSiteArticle extends Record<string, unknown> {
  _id: string;
  _type: "sitePage";
}

function argumentValue(flag: string): string | undefined {
  const index = process.argv.indexOf(flag);
  return index >= 0 ? process.argv[index + 1] : undefined;
}

function normalizePublishedId(value: string | undefined): string {
  const id = value?.replace(/^drafts\./, "").trim();
  if (!id || !/^sitePage\.[a-z0-9][a-z0-9.-]*$/.test(id)) {
    throw new Error(
      "--id must be a sitePage document ID such as sitePage.launching-version-record.",
    );
  }
  return id;
}

function publicationTime(applyChanges: boolean): Date {
  const supplied = argumentValue("--at");
  if (applyChanges && !supplied) {
    throw new Error("Apply mode requires the exact --at timestamp from dry run.");
  }

  const value = supplied ? new Date(supplied) : new Date();
  if (Number.isNaN(value.getTime())) {
    throw new Error("--at must be a valid ISO-8601 timestamp.");
  }
  return value;
}

function planSha(plan: ArticlePublishPlan): string {
  return createHash("sha256")
    .update(stableStringify(plan))
    .digest("hex");
}

function publishedDocument(
  draft: SiteArticleDocument,
  plan: ArticlePublishPlan,
): PublishedSiteArticle {
  const content = Object.fromEntries(
    Object.entries(draft).filter(
      ([key]) => !["_id", "_rev", "_createdAt", "_updatedAt"].includes(key),
    ),
  );

  return JSON.parse(
    JSON.stringify({
      ...content,
      _id: plan.publishedId,
      _type: "sitePage",
      pageKind: "article",
      byline: plan.byline,
      publishedAt: plan.publishedAt,
      updatedAt: plan.updatedAt,
      editorialReview: {
        ...(draft.editorialReview ?? {}),
        status: plan.editorialStatus,
        reviewedAt: plan.reviewedAt,
      },
    }),
  ) as PublishedSiteArticle;
}

async function main(): Promise<void> {
  const applyChanges = process.argv.includes("--apply");
  const productionAcknowledged = process.argv.includes(
    "--confirm-production",
  );
  const acknowledgedPlanSha = argumentValue("--plan-sha");
  const deploymentUrl = argumentValue("--deployment-url")?.trim();
  const publishedId = normalizePublishedId(argumentValue("--id"));
  const draftId = `drafts.${publishedId}`;
  const at = publicationTime(applyChanges);
  const client = getCliClient({ apiVersion }).withConfig({
    perspective: "raw",
    useCdn: false,
  });
  const config = client.config();

  if (
    config.projectId !== expectedProjectId ||
    config.dataset !== expectedDataset
  ) {
    throw new Error(
      `Refusing to target ${String(config.projectId)}/${String(config.dataset)}; expected ${expectedProjectId}/${expectedDataset}.`,
    );
  }

  const [draft, existingPublished] = await Promise.all([
    client.fetch<SiteArticleDocument | null>(`*[_id == $id][0]`, {
      id: draftId,
    }),
    client.fetch<SiteArticleDocument | null>(`*[_id == $id][0]`, {
      id: publishedId,
    }),
  ]);

  if (!draft) {
    throw new Error(`No Sanity draft exists at ${draftId}.`);
  }
  if (draft._type !== "sitePage") {
    throw new Error(`${draftId} is not a sitePage document.`);
  }
  if (!draft.slug?.current) {
    throw new Error(`${draftId} has no public slug.`);
  }

  const stamp = createArticlePublicationStamp({
    existingPublishedAt:
      existingPublished?.publishedAt ?? draft.publishedAt ?? null,
    now: at,
  });
  if (Date.parse(stamp.updatedAt) < Date.parse(stamp.publishedAt)) {
    throw new Error("The publication update cannot predate first publication.");
  }

  const plan: ArticlePublishPlan = {
    projectId: expectedProjectId,
    dataset: expectedDataset,
    draftId,
    publishedId,
    sourceRevision: draft._rev,
    title: draft.title,
    slug: draft.slug.current,
    firstPublication: !existingPublished?.publishedAt,
    byline: defaultArticleByline,
    publishedAt: stamp.publishedAt,
    updatedAt: stamp.updatedAt,
    editorialStatus: "approved",
    reviewedAt: stamp.updatedAt,
  };
  const sha = planSha(plan);

  console.log(stableStringify({ mode: applyChanges ? "apply" : "dry-run", plan }, 2));
  console.log(`PLAN_SHA=${sha}`);

  if (!applyChanges) {
    console.log(
      `Review the plan, deploy and privately preview the article feature, then rerun with --at ${plan.updatedAt} --deployment-url https://www.versionrecord.com --apply --confirm-production --plan-sha ${sha}.`,
    );
    return;
  }

  if (!productionAcknowledged) {
    throw new Error("Apply mode requires --confirm-production.");
  }
  if (!acknowledgedPlanSha || acknowledgedPlanSha !== sha) {
    throw new Error(
      `Plan SHA mismatch. Expected --plan-sha ${sha} for the current draft revision.`,
    );
  }
  if (!deploymentUrl) {
    throw new Error(
      "Apply mode requires --deployment-url https://www.versionrecord.com.",
    );
  }

  const readiness = await verifyArticleDeployment(deploymentUrl);
  console.log(
    stableStringify(
      {
        deploymentVerified: true,
        featureVersion: readiness.featureVersion,
        previewConfigured: readiness.previewConfigured,
      },
      2,
    ),
  );

  const nextDocument = publishedDocument(draft, plan);
  const transaction = client
    .transaction()
    .patch(draftId, (patch) =>
      patch.ifRevisionId(draft._rev).set({
        pageKind: "article",
        byline: plan.byline,
        publishedAt: plan.publishedAt,
        updatedAt: plan.updatedAt,
        editorialReview: {
          ...(draft.editorialReview ?? {}),
          status: plan.editorialStatus,
          reviewedAt: plan.reviewedAt,
        },
      }),
    )
    .createOrReplace(nextDocument)
    .delete(draftId);

  const result = await transaction.commit({ visibility: "sync" });
  console.log(
    stableStringify(
      {
        published: publishedId,
        transactionId: result.transactionId,
        publishedAt: plan.publishedAt,
        updatedAt: plan.updatedAt,
        byline: plan.byline,
      },
      2,
    ),
  );
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
