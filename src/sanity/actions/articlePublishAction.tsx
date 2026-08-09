import type { DocumentActionComponent } from "sanity";
import { useDocumentOperation } from "sanity";
import { defaultArticleByline } from "../../lib/article";

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
    const document = (props.draft ?? props.published) as
      | ArticleActionDocument
      | null;

    if (!originalResult || document?.pageKind !== "article") {
      return originalResult;
    }

    return {
      ...originalResult,
      label: props.published ? "Update article" : "Publish article",
      onHandle: () => {
        const now = new Date().toISOString();
        const publishedAt =
          (props.published as ArticleActionDocument | null)?.publishedAt ??
          document.publishedAt ??
          now;

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
        originalResult.onHandle?.();
      },
    };
  };

  ArticlePublishAction.action = "publish";
  ArticlePublishAction.displayName = "VersionRecordArticlePublishAction";
  return ArticlePublishAction;
}
