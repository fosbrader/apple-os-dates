import type {
  ChangeOccurrence,
  CitationRecord,
  PortableTextBlock,
} from "./types";

export type ContentCoverage =
  | "timelineOnly"
  | "sourceLinkedRecord"
  | "fullArticle";

export const MINIMUM_ARTICLE_TEXT_LENGTH = 80;

export interface ContentCoverageInput {
  article?: PortableTextBlock[] | null;
  citations?: CitationRecord[] | null;
  changes?: ChangeOccurrence[] | null;
  hasLinkedChronology?: boolean;
}

export const CONTENT_COVERAGE_LABELS: Record<ContentCoverage, string> = {
  timelineOnly: "Timeline only",
  sourceLinkedRecord: "Source-linked record",
  fullArticle: "Full article",
};

export const CONTENT_COVERAGE_DESCRIPTIONS: Record<
  ContentCoverage,
  string
> = {
  timelineOnly:
    "This record currently contains chronology and release-state data. A researched release-notes article has not been added.",
  sourceLinkedRecord:
    "At least one source is linked to this record. A researched release-notes article has not been added.",
  fullArticle:
    "This record includes a substantive editorial release-notes article with linked source evidence.",
};

export function hasArticleProse(
  blocks?: PortableTextBlock[] | null,
): boolean {
  const articleText = (blocks ?? [])
    .filter((block) => block._type === "block")
    .flatMap((block) =>
      (block.children ?? []).map((child) => child.text),
    )
    .join(" ")
    .replace(/\s+/g, " ")
    .trim();

  return articleText.length >= MINIMUM_ARTICLE_TEXT_LENGTH;
}

function hasCitation(citations?: CitationRecord[] | null): boolean {
  return Boolean(citations?.length);
}

function hasInlineArticleCitation(
  blocks?: PortableTextBlock[] | null,
): boolean {
  return Boolean(
    blocks?.some((block) => {
      if (block.sourceCitation?.source) return true;
      if (block._type !== "block") return false;

      const appliedMarks = new Set(
        (block.children ?? []).flatMap((child) => child.marks ?? []),
      );

      return block.markDefs?.some(
        (definition) =>
          Boolean(definition.source) &&
          appliedMarks.has(definition._key),
      );
    }),
  );
}

function hasChangeCitation(
  changes?: ChangeOccurrence[] | null,
): boolean {
  return Boolean(
    changes?.some((change) => hasCitation(change.citations)),
  );
}

export function getContentCoverage({
  article,
  citations,
  changes,
  hasLinkedChronology = false,
}: ContentCoverageInput): ContentCoverage {
  const hasSourceEvidence =
    hasInlineArticleCitation(article) ||
    hasCitation(citations) ||
    hasChangeCitation(changes);

  if (hasArticleProse(article) && hasSourceEvidence) {
    return "fullArticle";
  }

  if (hasLinkedChronology || hasSourceEvidence) {
    return "sourceLinkedRecord";
  }

  return "timelineOnly";
}
