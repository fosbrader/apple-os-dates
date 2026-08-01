import assert from "node:assert/strict";
import test from "node:test";
import {
  getContentCoverage,
  hasArticleProse,
  MINIMUM_ARTICLE_TEXT_LENGTH,
} from "../src/lib/content-coverage";
import type {
  ChangeOccurrence,
  CitationRecord,
  PortableTextBlock,
} from "../src/lib/types";

const citation: CitationRecord = {
  _key: "citation-1",
  source: {
    _id: "source-1",
    title: "Release documentation",
    canonicalUrl: "https://example.com/release",
  },
};

function paragraph(
  text: string,
  options: {
    marks?: string[];
    includeCitationDefinition?: boolean;
  } = {},
): PortableTextBlock {
  return {
    _key: "paragraph-1",
    _type: "block",
    style: "normal",
    markDefs: options.includeCitationDefinition
      ? [
          {
            _key: "citation-mark",
            _type: "citationMark",
            source: citation.source,
          },
        ]
      : [],
    children: [
      {
        _key: "span-1",
        _type: "span",
        text,
        marks: options.marks,
      },
    ],
  };
}

const substantiveArticle = "A".repeat(MINIMUM_ARTICLE_TEXT_LENGTH);

test("coverage remains timeline-only without substantive sourced prose", () => {
  assert.equal(getContentCoverage({}), "timelineOnly");
  assert.equal(
    getContentCoverage({ article: [paragraph("   ")] }),
    "timelineOnly",
  );
  assert.equal(
    getContentCoverage({ article: [paragraph(substantiveArticle)] }),
    "timelineOnly",
  );
});

test("chronology and occurrence citations produce source-linked record coverage", () => {
  assert.equal(
    getContentCoverage({ hasLinkedChronology: true }),
    "sourceLinkedRecord",
  );
  assert.equal(
    getContentCoverage({ citations: [citation] }),
    "sourceLinkedRecord",
  );

  const change = {
    _key: "change-1",
    change: {
      _id: "change-record-1",
      title: "Observed behavior",
    },
    action: "changed",
    documentedStatus: "undocumented",
    evidenceState: "reported",
    citations: [citation],
  } satisfies ChangeOccurrence;

  assert.equal(
    getContentCoverage({ changes: [change] }),
    "sourceLinkedRecord",
  );
});

test("full-article coverage requires at least 80 trimmed characters and source evidence", () => {
  assert.equal(hasArticleProse([paragraph("What changed.")]), false);
  assert.equal(
    hasArticleProse([
      paragraph("A".repeat(MINIMUM_ARTICLE_TEXT_LENGTH - 1)),
    ]),
    false,
  );
  assert.equal(hasArticleProse([paragraph(substantiveArticle)]), true);

  assert.equal(
    getContentCoverage({
      article: [paragraph(substantiveArticle)],
      citations: [citation],
    }),
    "fullArticle",
  );
  assert.equal(
    getContentCoverage({
      article: [paragraph("Too short.")],
      citations: [citation],
    }),
    "sourceLinkedRecord",
  );
  assert.equal(
    getContentCoverage({
      article: [{ _key: "image-1", _type: "editorialImage" }],
      citations: [citation],
    }),
    "sourceLinkedRecord",
  );
});

test("an applied inline citation qualifies as article source evidence", () => {
  assert.equal(
    getContentCoverage({
      article: [
        paragraph(substantiveArticle, {
          marks: ["citation-mark"],
          includeCitationDefinition: true,
        }),
      ],
    }),
    "fullArticle",
  );

  assert.equal(
    getContentCoverage({
      article: [
        paragraph(substantiveArticle, {
          includeCitationDefinition: true,
        }),
      ],
    }),
    "timelineOnly",
  );
});
