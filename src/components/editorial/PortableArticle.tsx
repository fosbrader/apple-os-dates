import type { ReactNode } from "react";
import Image from "next/image";
import type {
  CitationRecord,
  PortableTextBlock,
  PortableTextMarkDefinition,
  PortableTextSpan,
  SourceRecord,
} from "@/lib/types";

interface CitationEntry {
  id: string;
  number: number;
  citation: CitationRecord;
  backlinkId?: string;
}

interface PortableArticleProps {
  blocks?: PortableTextBlock[] | null;
  citations?: CitationRecord[] | null;
  className?: string;
  showReferences?: boolean;
  referenceKicker?: string;
  referenceTitle?: string;
  referenceDescription?: string;
}

function sourceKey(source: SourceRecord, locator?: string): string {
  return `${source._id}:${locator ?? ""}`;
}

function citationFromMark(
  definition: PortableTextMarkDefinition,
): CitationRecord | null {
  if (!definition.source) return null;

  return {
    _key: definition._key,
    source: definition.source,
    locator: definition.locator,
    context: definition.context,
  };
}

function collectCitations(
  blocks: PortableTextBlock[],
  standalone: CitationRecord[],
): {
  entries: CitationEntry[];
  numberByMark: Map<string, CitationEntry>;
} {
  const entries: CitationEntry[] = [];
  const numberByMark = new Map<string, CitationEntry>();
  const standaloneKeys = new Set<string>();
  const entryBySource = new Map<string, CitationEntry>();

  for (const block of blocks) {
    if (block.sourceCitation?.source) {
      const citation = block.sourceCitation;
      const key = sourceKey(citation.source, citation.locator);
      if (!standaloneKeys.has(key)) {
        const entry = {
          id: `reference-${entries.length + 1}`,
          number: entries.length + 1,
          citation,
        };
        entries.push(entry);
        entryBySource.set(key, entry);
        standaloneKeys.add(key);
      }
    }

    if (block._type !== "block") continue;

    const definitions = new Map(
      (block.markDefs ?? []).map((definition) => [
        definition._key,
        definition,
      ]),
    );

    for (const child of block.children ?? []) {
      for (const mark of child.marks ?? []) {
        const definition = definitions.get(mark);
        const citation = definition
          ? citationFromMark(definition)
          : null;
        const markKey = `${block._key}:${mark}`;

        if (!citation || numberByMark.has(markKey)) continue;

        const key = sourceKey(citation.source, citation.locator);
        const existingEntry = entryBySource.get(key);
        if (existingEntry) {
          existingEntry.backlinkId ??= `citation-${existingEntry.number}`;
          numberByMark.set(markKey, existingEntry);
          continue;
        }

        const number = entries.length + 1;
        const entry: CitationEntry = {
          id: `reference-${number}`,
          number,
          citation,
          backlinkId: `citation-${number}`,
        };
        entries.push(entry);
        numberByMark.set(markKey, entry);
        standaloneKeys.add(key);
        entryBySource.set(key, entry);
      }
    }
  }

  for (const citation of standalone) {
    const key = sourceKey(citation.source, citation.locator);
    if (standaloneKeys.has(key)) continue;

    entries.push({
      id: `reference-${entries.length + 1}`,
      number: entries.length + 1,
      citation,
    });
    entryBySource.set(key, entries[entries.length - 1]);
    standaloneKeys.add(key);
  }

  return { entries, numberByMark };
}

function renderDecorators(
  span: PortableTextSpan,
  content: ReactNode,
): ReactNode {
  return (span.marks ?? []).reduce<ReactNode>((rendered, mark) => {
    switch (mark) {
      case "strong":
        return <strong>{rendered}</strong>;
      case "em":
        return <em>{rendered}</em>;
      case "code":
        return <code>{rendered}</code>;
      case "underline":
        return <u>{rendered}</u>;
      case "strike-through":
        return <s>{rendered}</s>;
      default:
        return rendered;
    }
  }, content);
}

function renderSpan(
  block: PortableTextBlock,
  span: PortableTextSpan,
  numberByMark: Map<string, CitationEntry>,
): ReactNode {
  const definitions = new Map(
    (block.markDefs ?? []).map((definition) => [
      definition._key,
      definition,
    ]),
  );
  let rendered = renderDecorators(span, span.text);
  const citationEntries: CitationEntry[] = [];

  for (const mark of span.marks ?? []) {
    const definition = definitions.get(mark);
    if (!definition) continue;

    if (definition.href) {
      rendered = (
        <a
          href={definition.href}
          rel="external nofollow noopener noreferrer"
          target="_blank"
        >
          {rendered}
        </a>
      );
    }

    const citationEntry = numberByMark.get(`${block._key}:${mark}`);
    if (citationEntry) citationEntries.push(citationEntry);
  }

  return (
    <span key={span._key}>
      {rendered}
      {citationEntries.map((entry) => (
        <sup
          className="article-citation"
          id={entry.backlinkId}
          key={entry.id}
        >
          <a
            aria-label={`Reference ${entry.number}`}
            href={`#${entry.id}`}
          >
            [{entry.number}]
          </a>
        </sup>
      ))}
    </span>
  );
}

function renderBlockContent(
  block: PortableTextBlock,
  numberByMark: Map<string, CitationEntry>,
): ReactNode {
  return (block.children ?? []).map((span) =>
    renderSpan(block, span, numberByMark),
  );
}

function renderTextBlock(
  block: PortableTextBlock,
  numberByMark: Map<string, CitationEntry>,
): ReactNode {
  const content = renderBlockContent(block, numberByMark);

  switch (block.style) {
    case "h2":
      return <h2 id={`section-${block._key}`}>{content}</h2>;
    case "h3":
      return <h3 id={`section-${block._key}`}>{content}</h3>;
    case "h4":
      return <h4 id={`section-${block._key}`}>{content}</h4>;
    case "blockquote":
      return <blockquote>{content}</blockquote>;
    default:
      return <p>{content}</p>;
  }
}

function renderBlocks(
  blocks: PortableTextBlock[],
  numberByMark: Map<string, CitationEntry>,
): ReactNode[] {
  const rendered: ReactNode[] = [];

  for (let index = 0; index < blocks.length; index += 1) {
    const block = blocks[index];
    if (
      block._type === "editorialImage" &&
      block.asset?.url &&
      block.alt
    ) {
      const width = block.asset.metadata?.dimensions?.width ?? 1600;
      const height = block.asset.metadata?.dimensions?.height ?? 900;
      rendered.push(
        <figure className="article-figure" key={block._key}>
          <Image
            alt={block.alt}
            height={height}
            sizes="(max-width: 800px) 100vw, 768px"
            src={block.asset.url}
            width={width}
          />
          {block.caption ||
          block.rightsHolder ||
          block.sourceCitation?.source ? (
            <figcaption>
              {block.caption}
              {block.caption && block.rightsHolder ? " · " : ""}
              {block.rightsHolder
                ? `Image: ${block.rightsHolder}`
                : ""}
              {(block.caption || block.rightsHolder) &&
              block.sourceCitation?.source
                ? " · "
                : ""}
              {block.sourceCitation?.source ? (
                <a
                  href={block.sourceCitation.source.canonicalUrl}
                  rel="external nofollow noopener noreferrer"
                  target="_blank"
                >
                  Source: {block.sourceCitation.source.title}
                </a>
              ) : null}
            </figcaption>
          ) : null}
        </figure>,
      );
      continue;
    }

    if (block._type !== "block") continue;

    if (!block.listItem) {
      rendered.push(
        <div key={block._key}>
          {renderTextBlock(block, numberByMark)}
        </div>,
      );
      continue;
    }

    const listType = block.listItem;
    const listBlocks: PortableTextBlock[] = [];

    while (
      index < blocks.length &&
      blocks[index]._type === "block" &&
      blocks[index].listItem === listType
    ) {
      listBlocks.push(blocks[index]);
      index += 1;
    }
    index -= 1;

    const items = listBlocks.map((item) => (
      <li key={item._key}>
        {renderBlockContent(item, numberByMark)}
      </li>
    ));
    const key = `list-${listBlocks[0]._key}`;

    rendered.push(
      listType === "number" ? (
        <ol key={key}>{items}</ol>
      ) : (
        <ul key={key}>{items}</ul>
      ),
    );
  }

  return rendered;
}

function sourceDate(source: SourceRecord): string | undefined {
  return source.publishedAt ?? source.accessedAt;
}

export function ReferenceList({
  entries,
  kicker = "Source ledger",
  title = "References",
  description = "Sources are linked to the claims they support. Publication and access dates are shown when available.",
}: {
  entries: CitationEntry[];
  kicker?: string;
  title?: string;
  description?: string;
}) {
  if (entries.length === 0) return null;

  return (
    <section
      aria-labelledby="references-heading"
      className="article-references"
    >
      <div className="section-heading">
        <div>
          <p className="section-kicker">{kicker}</p>
          <h2 id="references-heading">{title}</h2>
        </div>
        <p>{description}</p>
      </div>
      <ol>
        {entries.map(({ id, number, citation, backlinkId }) => {
          const date = sourceDate(citation.source);

          return (
            <li id={id} key={id}>
              <span aria-hidden="true">{number}</span>
              <div>
                <a
                  href={citation.source.canonicalUrl}
                  rel="external nofollow noopener noreferrer"
                  target="_blank"
                >
                  {citation.source.title}
                </a>
                <p>
                  {[
                    citation.source.publisher,
                    citation.source.author,
                    date,
                    citation.locator,
                  ]
                    .filter(Boolean)
                    .join(" · ")}
                </p>
                {citation.context ? (
                  <p className="article-references__context">
                    {citation.context}
                  </p>
                ) : null}
                <div className="article-references__links">
                  {citation.source.archiveUrl ? (
                    <a
                      href={citation.source.archiveUrl}
                      rel="external nofollow noopener noreferrer"
                      target="_blank"
                    >
                      Archived copy
                    </a>
                  ) : null}
                  {backlinkId ? (
                    <a
                      aria-label={`Back to citation ${number}`}
                      href={`#${backlinkId}`}
                    >
                      Back to text ↑
                    </a>
                  ) : null}
                </div>
              </div>
            </li>
          );
        })}
      </ol>
    </section>
  );
}

export function PortableArticle({
  blocks,
  citations,
  className,
  showReferences = true,
  referenceKicker,
  referenceTitle,
  referenceDescription,
}: PortableArticleProps) {
  const safeBlocks = blocks ?? [];
  const safeCitations = citations ?? [];
  const { entries, numberByMark } = collectCitations(
    safeBlocks,
    safeCitations,
  );

  if (safeBlocks.length === 0 && entries.length === 0) return null;

  return (
    <>
      {safeBlocks.length > 0 ? (
        <div className={`portable-article ${className ?? ""}`.trim()}>
          {renderBlocks(safeBlocks, numberByMark)}
        </div>
      ) : null}
      {showReferences ? (
        <ReferenceList
          entries={entries}
          kicker={referenceKicker}
          title={referenceTitle}
          description={referenceDescription}
        />
      ) : null}
    </>
  );
}
