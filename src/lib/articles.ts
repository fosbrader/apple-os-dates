import type {
  CitationRecord,
  PortableTextBlock,
  SlugValue,
} from "./types";
import { client } from "../sanity/client";

export interface ArticleImageAsset {
  url?: string;
  metadata?: {
    dimensions?: {
      width?: number;
      height?: number;
      aspectRatio?: number;
    };
  };
}

export interface ArticleDocument {
  _id: string;
  title: string;
  slug: SlugValue;
  summary: string;
  byline?: string;
  publishedAt?: string;
  updatedAt?: string;
  body: PortableTextBlock[];
  citations?: CitationRecord[];
  seo?: {
    title?: string;
    description?: string;
    noIndex?: boolean;
    image?: {
      asset?: ArticleImageAsset;
    };
  };
}

export interface ArticleSummary {
  _id: string;
  title: string;
  slug: SlugValue;
  summary: string;
  byline?: string;
  publishedAt: string;
  updatedAt: string;
  image?: ArticleImageAsset;
  imageAlt?: string;
  seo?: {
    title?: string;
    description?: string;
  };
}

const articleProjection = `{
  _id,
  title,
  slug,
  summary,
  byline,
  publishedAt,
  updatedAt,
  body[]{
    ...,
    asset->{
      _id,
      url,
      metadata{dimensions}
    },
    markDefs[]{
      ...,
      source->{
        _id,
        title,
        publisher,
        author,
        canonicalUrl,
        publishedAt,
        accessedAt,
        archiveUrl,
        sourceClass
      }
    },
    sourceCitation{
      ...,
      source->{
        _id,
        title,
        publisher,
        author,
        canonicalUrl,
        publishedAt,
        accessedAt,
        archiveUrl,
        sourceClass
      }
    }
  },
  citations[]{
    ...,
    source->{
      _id,
      title,
      publisher,
      author,
      canonicalUrl,
      publishedAt,
      accessedAt,
      archiveUrl,
      sourceClass
    }
  },
  seo{
    title,
    description,
    noIndex,
    image{
      asset->{
        _id,
        url,
        metadata{dimensions}
      }
    }
  }
}`;

const draftArticleQuery = `*[
  _type == "sitePage" &&
  _id in path("drafts.**") &&
  pageKind == "article" &&
  slug.current == $slug
][0]${articleProjection}`;

const publishedArticleQuery = `*[
  _type == "sitePage" &&
  !(_id in path("drafts.**")) &&
  pageKind == "article" &&
  slug.current == $slug &&
  editorialReview.status == "approved" &&
  defined(publishedAt) &&
  defined(updatedAt)
][0]${articleProjection}`;

const publishedArticleSummariesQuery = `*[
  _type == "sitePage" &&
  !(_id in path("drafts.**")) &&
  pageKind == "article" &&
  editorialReview.status == "approved" &&
  defined(slug.current) &&
  defined(publishedAt) &&
  defined(updatedAt) &&
  coalesce(seo.noIndex, false) == false
] | order(publishedAt desc) {
  _id,
  title,
  slug,
  summary,
  byline,
  publishedAt,
  updatedAt,
  "image": coalesce(
    seo.image.asset->{url, metadata{dimensions}},
    body[_type == "editorialImage"][0].asset->{url, metadata{dimensions}}
  ),
  "imageAlt": coalesce(
    body[_type == "editorialImage"][0].alt,
    title
  ),
  seo{title, description}
}`;

const publishedFetchOptions = {
  next: { revalidate: 60 },
} as const;

export async function getDraftArticle(
  slug: string,
  token: string,
): Promise<ArticleDocument | null> {
  return client
    .withConfig({
      token,
      useCdn: false,
      perspective: "raw",
    })
    .fetch<ArticleDocument | null>(
      draftArticleQuery,
      { slug },
      { cache: "no-store" },
    );
}

export async function getPublishedArticle(
  slug: string,
): Promise<ArticleDocument | null> {
  return client.fetch<ArticleDocument | null>(
    publishedArticleQuery,
    { slug },
    publishedFetchOptions,
  );
}

export async function getPublishedArticleSummaries(): Promise<
  ArticleSummary[]
> {
  return client.fetch<ArticleSummary[]>(
    publishedArticleSummariesQuery,
    {},
    publishedFetchOptions,
  );
}
