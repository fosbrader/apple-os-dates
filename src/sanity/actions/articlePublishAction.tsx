import { useEffect, useState } from "react";
import type { DocumentActionComponent } from "sanity";
import { useDocumentOperation } from "sanity";
import { defaultArticleByline } from "../../lib/article";
import { articleDeploymentIsReady } from "../../lib/article-deployment";

interface ArticleActionDocument {
  pageKind?: string;
  publishedAt?: string;
  editorialReview?: {
    status?: string;
    reviewedAt?: string;
    reviewNotes?: string;
  };
}

export function createArticlePublishAction(
  originalPublishAction: DocumentActionComponent,
): DocumentActionComponent {
  const ArticlePublishAction: DocumentActionComponent = (props) => {
    const { patch } = useDocumentOperation(props.id, props.type);
    const originalResult = originalPublishAction(props);
    const [confirmationOpen, setConfirmationOpen] = useState(false);
    const [isPublishing, setIsPublishing] = useState(false);
    const [gateError, setGateError] = useState<string | null>(null);
    const document = (props.draft ?? props.published) as
      | ArticleActionDocument
      | null;

    useEffect(() => {
      if (isPublishing && !props.draft) {
        setIsPublishing(false);
      }
    }, [isPublishing, props.draft]);

    if (!originalResult || document?.pageKind !== "article") {
      return originalResult;
    }

    const isUpdate = Boolean(props.published);
    const actionLabel = isUpdate ? "Update article" : "Publish article";

    return {
      ...originalResult,
      disabled: originalResult.disabled || isPublishing,
      label: isPublishing ? "Publishing…" : actionLabel,
      onHandle: () => {
        setGateError(null);
        setConfirmationOpen(true);
      },
      dialog: confirmationOpen
        ? {
            type: "confirm",
            tone: "positive",
            confirmButtonText: actionLabel,
            cancelButtonText: "Keep as draft",
            message: (
              <div style={{ display: "grid", gap: "0.75rem" }}>
                <p>
                  This will make the article public with the byline{" "}
                  <strong>{defaultArticleByline}</strong> and assign its
                  publication timestamps.
                </p>
                <p>
                  Publication is allowed only after the Site News code and
                  private draft-preview configuration are live in production.
                </p>
                {gateError ? (
                  <p style={{ color: "var(--card-critical-fg-color)" }}>
                    {gateError}
                  </p>
                ) : null}
              </div>
            ),
            onCancel: () => {
              setGateError(null);
              setConfirmationOpen(false);
            },
            onConfirm: async () => {
              setGateError(null);

              try {
                const response = await fetch("/api/news-readiness/", {
                  cache: "no-store",
                  credentials: "same-origin",
                  headers: { accept: "application/json" },
                });
                const readiness: unknown = response.ok
                  ? await response.json()
                  : null;
                if (!articleDeploymentIsReady(readiness)) {
                  throw new Error(
                    "Production deployment verification failed. Keep this article as a draft until deployment and private preview are complete.",
                  );
                }

                const now = new Date().toISOString();
                const publishedAt =
                  (props.published as ArticleActionDocument | null)
                    ?.publishedAt ??
                  document.publishedAt ??
                  now;

                setIsPublishing(true);
                patch.execute([
                  {
                    set: {
                      pageKind: "article",
                      byline: defaultArticleByline,
                      publishedAt,
                      updatedAt: now,
                      editorialReview: {
                        ...(document.editorialReview ?? {}),
                        status: "approved",
                        reviewedAt: now,
                      },
                    },
                  },
                ]);
                setConfirmationOpen(false);
                originalResult.onHandle?.();
              } catch (error: unknown) {
                setIsPublishing(false);
                setGateError(
                  error instanceof Error
                    ? error.message
                    : "Production deployment verification failed.",
                );
              }
            },
          }
        : originalResult.dialog,
    };
  };

  ArticlePublishAction.action = "publish";
  ArticlePublishAction.displayName = "VersionRecordArticlePublishAction";
  return ArticlePublishAction;
}
